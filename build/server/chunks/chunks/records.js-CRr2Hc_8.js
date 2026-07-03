import { d as db } from './db.js-BcppfB2j.js';

//#region src/lib/server/db/records.js
var selectBase = `
	SELECT rec.id, rec.instance_id AS instanceId, s.name AS instanceName, s.type AS instanceType,
		rec.collector_id AS collectorId, rec.external_id AS externalId, rec.record_type AS recordType,
		rec.metadata_json AS metadataJson,
		rec.captured_at AS capturedAt, rec.created_at AS createdAt
	FROM records rec
	LEFT JOIN research_instances s ON s.id = rec.instance_id
`;
function safeParse(raw, fallback) {
	try {
		const value = JSON.parse(raw);
		return value && typeof value === "object" ? value : fallback;
	} catch {
		return fallback;
	}
}
function mapRecord(row) {
	if (!row) return null;
	return {
		...row,
		metadata: safeParse(row.metadataJson, {})
	};
}
function truncate(str, n) {
	const s = String(str ?? "").replace(/\s+/g, " ").trim();
	return s.length > n ? `${s.slice(0, n)}…` : s;
}
/** Render a metadata value for compact text: objects/arrays as JSON, else as-is. */
function display(value) {
	return value !== null && typeof value === "object" ? JSON.stringify(value) : value;
}
var intOrNull = (value) => Number.isFinite(Number(value)) && Number(value) > 0 ? Math.round(Number(value)) : null;
var SAFE_KEY = /^[a-zA-Z0-9_]+$/;
/**
* Persist a batch of records. Idempotent: a repeated (collector_id, external_id)
* refreshes the mutable fields instead of duplicating. Bad rows are skipped
* rather than aborting the batch. Returns the number of rows written. All
* provider-specific fields live inside `metadata`; only `captured_at` is a column.
*
* @param {Array<{ instanceId:number, collectorId?:number|null, id?:string,
*   recordType:string, metadata?:object, raw?:any, capturedAt?:string|null }>} rows
*/
function upsertRecords(rows) {
	if (!Array.isArray(rows) || rows.length === 0) return 0;
	const stmt = db.prepare(`INSERT INTO records (instance_id, collector_id, external_id, record_type, metadata_json, raw_json, captured_at)
		 VALUES (?, ?, ?, ?, ?, ?, ?)
		 ON CONFLICT(collector_id, external_id) DO UPDATE SET
		   metadata_json = excluded.metadata_json, captured_at = excluded.captured_at`);
	let written = 0;
	for (const r of rows) try {
		stmt.run(Number(r.instanceId), r.collectorId != null ? Number(r.collectorId) : null, r.id != null ? String(r.id) : null, String(r.recordType || "item"), JSON.stringify(r.metadata ?? {}), r.raw != null ? typeof r.raw === "string" ? r.raw : JSON.stringify(r.raw) : null, r.capturedAt != null ? String(r.capturedAt) : null);
		written++;
	} catch {}
	return written;
}
/**
* Persist a batch of transformer-produced records. Idempotent on
* (transformer_id, external_id) via the partial unique index — the NULL-aware
* counterpart of upsertRecords' (collector_id, external_id) key. Returns the
* number of rows written.
*
* @param {Array<{ instanceId:number, transformerId:number, id:string,
*   recordType:string, metadata?:object, raw?:any, capturedAt?:string|null }>} rows
*/
function upsertTransformerRecords(rows) {
	if (!Array.isArray(rows) || rows.length === 0) return 0;
	const stmt = db.prepare(`INSERT INTO records (instance_id, transformer_id, external_id, record_type, metadata_json, raw_json, captured_at)
		 VALUES (?, ?, ?, ?, ?, ?, ?)
		 ON CONFLICT(transformer_id, external_id) WHERE transformer_id IS NOT NULL DO UPDATE SET
		   metadata_json = excluded.metadata_json, captured_at = excluded.captured_at`);
	let written = 0;
	for (const r of rows) try {
		stmt.run(Number(r.instanceId), Number(r.transformerId), String(r.id), String(r.recordType || "item"), JSON.stringify(r.metadata ?? {}), r.raw != null ? typeof r.raw === "string" ? r.raw : JSON.stringify(r.raw) : null, r.capturedAt != null ? String(r.capturedAt) : null);
		written++;
	} catch {}
	return written;
}
function parseSince(since) {
	const m = /^(\d+)\s*(h|d)$/.exec(String(since ?? "").trim());
	if (!m) return null;
	const n = Number(m[1]);
	if (!Number.isFinite(n) || n <= 0) return null;
	return m[2] === "h" ? `-${n} hours` : `-${n} days`;
}
function compileFilter(filter) {
	const f = filter && typeof filter === "object" ? filter : {};
	const where = [];
	const params = [];
	const instanceId = f.instanceId;
	if (intOrNull(instanceId)) {
		where.push("rec.instance_id = ?");
		params.push(Number(instanceId));
	}
	const collectorId = f.collectorId;
	if (intOrNull(collectorId)) {
		where.push("rec.collector_id = ?");
		params.push(Number(collectorId));
	}
	if (intOrNull(f.afterId)) {
		where.push("rec.id > ?");
		params.push(Number(f.afterId));
	}
	if (f.recordType) {
		where.push("rec.record_type = ?");
		params.push(String(f.recordType));
	}
	if (f.contains) {
		where.push("rec.metadata_json LIKE ?");
		params.push(`%${String(f.contains)}%`);
	}
	const since = parseSince(f.since);
	if (since) {
		where.push("COALESCE(rec.captured_at, rec.created_at) >= datetime('now', ?)");
		params.push(since);
	}
	if (f.metadata && typeof f.metadata === "object") for (const [key, cond] of Object.entries(f.metadata)) {
		if (!SAFE_KEY.test(key) || !cond || typeof cond !== "object") continue;
		for (const [op, val] of Object.entries(cond)) {
			const sqlOp = {
				gte: ">=",
				lte: "<=",
				eq: "=",
				gt: ">",
				lt: "<"
			}[op];
			if (!sqlOp || !Number.isFinite(Number(val))) continue;
			where.push(`CAST(json_extract(rec.metadata_json, '$.${key}') AS REAL) ${sqlOp} ?`);
			params.push(Number(val));
		}
	}
	let orderSql = "COALESCE(rec.captured_at, rec.created_at)";
	const ob = String(f.orderBy ?? "");
	if (ob.startsWith("metadata.")) {
		const key = ob.slice(9);
		if (SAFE_KEY.test(key)) orderSql = `CAST(json_extract(rec.metadata_json, '$.${key}') AS REAL)`;
	}
	const dir = String(f.dir ?? "").toLowerCase() === "asc" ? "ASC" : "DESC";
	const limit = Math.max(1, Math.min(100, Math.round(Number(f.limit) || 25)));
	return {
		clause: where.length ? `WHERE ${where.join(" AND ")}` : "",
		params,
		order: `ORDER BY ${orderSql} ${dir}`,
		limit
	};
}
/** Run a report filter and return mapped records. `opts.limit` overrides the
* filter's own (clamped) limit; pass `null` to return every match (no cap). */
function queryRecords(filter = {}, { limit } = {}) {
	const compiled = compileFilter(filter);
	const cap = limit === null ? null : limit ?? compiled.limit;
	const sql = `${selectBase} ${compiled.clause} ${compiled.order}${cap === null ? "" : " LIMIT ?"}`;
	const params = cap === null ? compiled.params : [...compiled.params, cap];
	return db.prepare(sql).all(...params).map(mapRecord);
}
/** Count records matching a filter (ignores limit/order). */
function countRecordsMatching(filter = {}) {
	const { clause, params } = compileFilter(filter);
	return db.prepare(`SELECT COUNT(*) AS n FROM records rec ${clause}`).get(...params)?.n ?? 0;
}
/** Convenience wrapper for the /records browse UI. */
function listRecords({ instanceId, collectorId, recordType, search = "", limit = 60 } = {}) {
	return queryRecords({
		instanceId,
		collectorId,
		recordType,
		contains: search ? String(search) : void 0,
		orderBy: "captured_at",
		dir: "desc",
		limit
	});
}
function countRecords() {
	return db.prepare("SELECT COUNT(*) AS n FROM records").get()?.n ?? 0;
}
/** Distinct record types present, for filter chips. */
function listRecordTypes() {
	return db.prepare("SELECT DISTINCT record_type AS type FROM records ORDER BY record_type").all().map((r) => r.type);
}
/** Delete a batch of records by row id. Returns the number deleted. */
function deleteRecordsByIds(ids) {
	const clean = (Array.isArray(ids) ? ids : []).map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0);
	if (clean.length === 0) return 0;
	const placeholders = clean.map(() => "?").join(", ");
	return db.prepare(`DELETE FROM records WHERE id IN (${placeholders})`).run(...clean).changes;
}
/** Fetch a transformer's own target record by dedup key, or null. */
function getTransformerRecordByKey(transformerId, externalId) {
	const id = Number(transformerId);
	if (!Number.isInteger(id) || id <= 0) return null;
	return mapRecord(db.prepare(`${selectBase} WHERE rec.transformer_id = ? AND rec.external_id = ?`).get(id, String(externalId)));
}
/** Delete every record a transformer produced. Returns the number deleted. */
function deleteRecordsByTransformer(transformerId) {
	const id = Number(transformerId);
	if (!Number.isInteger(id) || id <= 0) return 0;
	return db.prepare(`DELETE FROM records WHERE transformer_id = ?`).run(id).changes;
}
/** Compact, model-friendly rendering reused by the query_records tool + reports.
* Generic: providers store only their declared fields, so every metadata entry
* is rendered as `key: value` (longer values truncated). */
function formatRecords(rows, { limit = 25 } = {}) {
	const list = (Array.isArray(rows) ? rows : []).slice(0, limit);
	if (!list.length) return "No records matched.";
	return list.map((r) => {
		const m = r.metadata && typeof r.metadata === "object" ? r.metadata : {};
		const meta = Object.entries(m).filter(([, v]) => v !== "" && v !== null && v !== void 0).slice(0, 8).map(([k, v]) => `${k}: ${truncate(display(v), 120)}`).join(" · ");
		const head = `- [${r.recordType}] ${r.instanceName || ""}`.trimEnd();
		return meta ? `${head}\n  ${meta}` : head;
	}).join("\n");
}

export { upsertTransformerRecords as a, listRecords as b, countRecords as c, deleteRecordsByIds as d, countRecordsMatching as e, formatRecords as f, getTransformerRecordByKey as g, deleteRecordsByTransformer as h, listRecordTypes as l, queryRecords as q, upsertRecords as u };
//# sourceMappingURL=records.js-CRr2Hc_8.js.map
