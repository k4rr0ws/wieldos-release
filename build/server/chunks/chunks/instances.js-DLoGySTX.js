import { d as db } from './db.js-BcppfB2j.js';

//#region src/lib/server/db/instances.js
var INSTANCE_STATUSES = [
	"active",
	"paused",
	"error"
];
var selectBase = `
	SELECT s.id, s.name, s.type, s.config_json AS configJson, s.credentials_json AS credentialsJson, s.status,
		s.last_checked_at AS lastCheckedAt, s.created_at AS createdAt, s.updated_at AS updatedAt,
		(SELECT COUNT(*) FROM research_collectors c WHERE c.instance_id = s.id) AS collectorCount,
		(SELECT COUNT(*) FROM records rec WHERE rec.instance_id = s.id) AS recordCount
	FROM research_instances s
`;
function safeParse(raw, fallback) {
	try {
		const value = JSON.parse(raw);
		return value && typeof value === "object" ? value : fallback;
	} catch {
		return fallback;
	}
}
function maskSecret(value) {
	const s = String(value ?? "");
	return s ? `••••${s.slice(-4)}` : "";
}
function redactCredentials(raw) {
	const obj = safeParse(raw, {});
	const out = {};
	for (const [key, value] of Object.entries(obj)) if (value) out[key] = maskSecret(value);
	return out;
}
function mapInstance(row) {
	if (!row) return null;
	const { credentialsJson, ...rest } = row;
	return {
		...rest,
		config: safeParse(row.configJson, {}),
		credentials: redactCredentials(credentialsJson)
	};
}
var cleanStatus = (status) => INSTANCE_STATUSES.includes(status) ? status : "active";
function listInstances() {
	return db.prepare(`${selectBase} ORDER BY s.created_at DESC`).all().map(mapInstance);
}
function getInstance(id) {
	return mapInstance(db.prepare(`${selectBase} WHERE s.id = ?`).get(id));
}
/** Lightweight {id, name, type} list for select inputs (no derived counts). */
function listInstanceOptions() {
	return db.prepare(`SELECT id, name, type FROM research_instances ORDER BY name`).all();
}
/**
* The primary active instance of a provider type — the first one created, so the
* choice is stable. Used by agent tools / integrations that aren't bound to a
* specific instance. Returns null when none is configured.
*/
function getPrimaryInstance(type) {
	return mapInstance(db.prepare(`${selectBase} WHERE s.type = ? AND s.status = 'active' ORDER BY s.created_at ASC LIMIT 1`).get(String(type)));
}
/**
* Flattened config + RAW credential values of the primary active instance of
* `type` (config first, credentials take precedence). Returns {} when no active
* instance exists. SERVER-ONLY — includes secret values; never send to a client.
*/
function getProviderValues(type) {
	const inst = getPrimaryInstance(type);
	if (!inst) return {};
	return {
		...inst.config ?? {},
		...getInstanceCredentials(inst.id)
	};
}
/** Raw (un-redacted) credentials for an instance. SERVER-ONLY — never send to a client. */
function getInstanceCredentials(id) {
	return safeParse(db.prepare(`SELECT credentials_json AS c FROM research_instances WHERE id = ?`).get(id)?.c, {});
}
function cleanCredentials(credentials) {
	const out = {};
	for (const [key, value] of Object.entries(credentials ?? {})) {
		const s = String(value ?? "").trim();
		if (s) out[key] = s;
	}
	return out;
}
function createInstance({ name, type, config = {}, credentials = {}, status = "active" }) {
	const info = db.prepare(`INSERT INTO research_instances (name, type, config_json, credentials_json, status) VALUES (?, ?, ?, ?, ?)`).run(String(name), String(type), JSON.stringify(config ?? {}), JSON.stringify(cleanCredentials(credentials)), cleanStatus(status));
	return getInstance(Number(info.lastInsertRowid));
}
function updateInstance(id, { name, type, config, credentials, status } = {}) {
	let credentialsJson = null;
	if (credentials != null) credentialsJson = JSON.stringify({
		...getInstanceCredentials(id),
		...cleanCredentials(credentials)
	});
	db.prepare(`UPDATE research_instances SET
			name = COALESCE(?, name),
			type = COALESCE(?, type),
			config_json = COALESCE(?, config_json),
			credentials_json = COALESCE(?, credentials_json),
			status = COALESCE(?, status),
			updated_at = datetime('now')
		 WHERE id = ?`).run(name != null ? String(name) : null, type != null ? String(type) : null, config != null ? JSON.stringify(config) : null, credentialsJson, status != null ? cleanStatus(status) : null, id);
	return getInstance(id);
}
/** Find an existing instance by (type, name) or create one. Used by create_collector. */
function findOrCreateInstance({ name, type, config = {} }) {
	const existing = db.prepare(`${selectBase} WHERE s.type = ? AND s.name = ? LIMIT 1`).get(String(type), String(name));
	if (existing) return mapInstance(existing);
	return createInstance({
		name,
		type,
		config
	});
}
function markInstanceChecked(id) {
	db.prepare(`UPDATE research_instances SET last_checked_at = datetime('now') WHERE id = ?`).run(id);
}
function deleteInstance(id) {
	return db.prepare(`DELETE FROM research_instances WHERE id = ?`).run(id).changes > 0;
}

export { getPrimaryInstance as a, getInstance as b, getInstanceCredentials as c, deleteInstance as d, createInstance as e, findOrCreateInstance as f, getProviderValues as g, listInstances as h, listInstanceOptions as l, markInstanceChecked as m, updateInstance as u };
//# sourceMappingURL=instances.js-DLoGySTX.js.map
