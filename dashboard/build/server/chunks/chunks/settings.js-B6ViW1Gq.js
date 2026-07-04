import { S as SETTINGS, d as db } from './db.js-tGTv_Rod.js';

//#region src/lib/server/db/settings.js
var REGISTRY = new Map(SETTINGS.map((s) => [s.key, s]));
var INTERNAL_KEYS = new Set([
	"__seeded_keys__",
	"__env_imported__",
	"__groups_backfilled__"
]);
var TRUE_RE = /^(1|true|yes|on)$/i;
var cache = null;
function load() {
	if (cache) return cache;
	cache = /* @__PURE__ */ new Map();
	for (const row of db.prepare(`SELECT key, value FROM app_settings`).all()) cache.set(row.key, row.value);
	return cache;
}
function getRaw(key) {
	const v = load().get(key);
	return v == null || v === "" ? null : String(v);
}
/**
* Typed setting value with the registry default applied. Returns a boolean for
* boolean settings, a number for number settings, and a string otherwise.
*/
function getSetting(key) {
	const def = REGISTRY.get(key);
	const raw = getRaw(key);
	const type = def?.type ?? "string";
	if (type === "boolean") return raw == null ? Boolean(def?.default) : TRUE_RE.test(raw.trim());
	if (type === "number") {
		const n = Number(raw);
		return Number.isFinite(n) ? n : Number(def?.default ?? 0);
	}
	return raw != null ? raw : String(def?.default ?? "");
}
/**
* Registry-defined settings of one group with their current (typed) values —
* for feature pages that surface just their own settings. Works whether or not
* the rows exist yet (older installs predate later registry additions; defaults
* apply until first save). Secret values are blanked: render, never echo.
*/
function listGroupSettings(group) {
	return SETTINGS.filter((s) => s.group === group).map((s) => ({
		key: s.key,
		label: s.label,
		type: s.type,
		help: s.help ?? "",
		value: s.type === "secret" ? "" : getSetting(s.key)
	}));
}
/** All settings as flat rows, ordered by group then key. Excludes bookkeeping rows. */
function listSettings() {
	return db.prepare(`SELECT key, value, group_name AS "group" FROM app_settings ORDER BY group_name, key`).all().filter((r) => !INTERNAL_KEYS.has(r.key)).map((r) => ({
		key: r.key,
		value: r.value ?? "",
		group: r.group ?? ""
	}));
}
/** Distinct, non-empty group names in alphabetical order. */
function listGroups() {
	return [...new Set(listSettings().map((r) => r.group).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}
/**
* Create or update a setting. Returns false for a blank or reserved key.
* A blank group means "Ungrouped".
*/
function upsertSetting({ key, value = "", group = "" }) {
	const k = String(key ?? "").trim();
	if (!k || INTERNAL_KEYS.has(k)) return false;
	const v = String(value ?? "");
	const g = String(group ?? "").trim();
	db.prepare(`INSERT INTO app_settings (key, value, group_name, updated_at) VALUES (?, ?, ?, datetime('now'))
		 ON CONFLICT(key) DO UPDATE SET value = excluded.value, group_name = excluded.group_name, updated_at = datetime('now')`).run(k, v, g);
	load().set(k, v);
	return true;
}
/** Remove a setting. Returns false for a blank or reserved key. */
function deleteSetting(key) {
	const k = String(key ?? "").trim();
	if (!k || INTERNAL_KEYS.has(k)) return false;
	db.prepare(`DELETE FROM app_settings WHERE key = ?`).run(k);
	load().delete(k);
	return true;
}
/** Delete a group by moving every setting in it to Ungrouped. Returns rows moved. */
function deleteGroup(group) {
	const g = String(group ?? "").trim();
	if (!g) return 0;
	return db.prepare(`UPDATE app_settings SET group_name = '', updated_at = datetime('now') WHERE group_name = ?`).run(g).changes;
}

export { deleteSetting as a, listGroups as b, listSettings as c, deleteGroup as d, getSetting as g, listGroupSettings as l, upsertSetting as u };
//# sourceMappingURL=settings.js-B6ViW1Gq.js.map
