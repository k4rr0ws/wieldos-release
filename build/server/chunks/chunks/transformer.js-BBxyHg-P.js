import { d as db } from './db.js-BcppfB2j.js';
import { f as findOrCreateInstance } from './instances.js-DLoGySTX.js';
import { T as TOOLS } from './tools.js-C1CBPtEY.js';
import { q as queryRecords, g as getTransformerRecordByKey, a as upsertTransformerRecords } from './records.js-CRr2Hc_8.js';
import { g as getSetting } from './settings.js-CGfdgS1b.js';
import { l as logEvent } from './log.js-D10-n4Pe.js';
import { createHash } from 'node:crypto';

//#region src/lib/server/db/transformers.js
var TRANSFORMER_STATUSES = [
	"idle",
	"running",
	"error"
];
var selectBase = `
	SELECT t.id, t.name, t.description, t.record_type AS recordType,
		t.fields_json AS fieldsJson, t.key_field AS keyField, t.filter_json AS filterJson,
		t.script, t.schedule_minutes AS scheduleMinutes, t.cursor, t.enabled,
		t.status, t.last_run_at AS lastRunAt, t.last_error AS lastError,
		t.created_at AS createdAt, t.updated_at AS updatedAt,
		(SELECT COUNT(*) FROM records rec WHERE rec.transformer_id = t.id) AS recordCount
	FROM transformers t
`;
function safeParse(raw, fallback) {
	try {
		const value = JSON.parse(raw);
		return value && typeof value === "object" ? value : fallback;
	} catch {
		return fallback;
	}
}
function mapTransformer(row) {
	if (!row) return null;
	return {
		...row,
		fields: Array.isArray(safeParse(row.fieldsJson, [])) ? safeParse(row.fieldsJson, []) : [],
		filter: safeParse(row.filterJson, {}),
		enabled: Boolean(row.enabled)
	};
}
var intOrNull = (value) => Number.isFinite(Number(value)) && Number(value) > 0 ? Math.round(Number(value)) : null;
function listTransformers() {
	return db.prepare(`${selectBase} ORDER BY t.created_at DESC`).all().map(mapTransformer);
}
function getTransformer(id) {
	return mapTransformer(db.prepare(`${selectBase} WHERE t.id = ?`).get(id));
}
/**
* Enabled transformers that are due for a run (never run, or last run older
* than their cadence), oldest-first so they round-robin across scheduler ticks.
* Manual-only transformers (schedule_minutes IS NULL) are excluded.
*/
function listDueTransformers() {
	return db.prepare(`${selectBase}
			 WHERE t.enabled = 1 AND t.schedule_minutes IS NOT NULL
			   AND (
			     t.last_run_at IS NULL
			     OR datetime(t.last_run_at, '+' || t.schedule_minutes || ' minutes') <= datetime('now')
			   )
			 ORDER BY t.last_run_at IS NULL DESC, t.last_run_at ASC`).all().map(mapTransformer);
}
function createTransformer({ name, description = "", recordType, fields = [], keyField = "id", filter = {}, script = "", scheduleMinutes = null }) {
	const info = db.prepare(`INSERT INTO transformers (name, description, record_type, fields_json, key_field, filter_json, script, schedule_minutes)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(String(name), String(description ?? ""), String(recordType), JSON.stringify(Array.isArray(fields) ? fields : []), String(keyField || "id"), JSON.stringify(filter ?? {}), String(script ?? ""), intOrNull(scheduleMinutes));
	return getTransformer(Number(info.lastInsertRowid));
}
function updateTransformer(id, { name, description, recordType, fields, keyField, filter, script, scheduleMinutes, enabled } = {}) {
	db.prepare(`UPDATE transformers SET
			name = COALESCE(?, name),
			description = COALESCE(?, description),
			record_type = COALESCE(?, record_type),
			fields_json = COALESCE(?, fields_json),
			key_field = COALESCE(?, key_field),
			filter_json = COALESCE(?, filter_json),
			script = COALESCE(?, script),
			schedule_minutes = CASE WHEN ? THEN ? ELSE schedule_minutes END,
			enabled = COALESCE(?, enabled),
			updated_at = datetime('now')
		 WHERE id = ?`).run(name != null ? String(name) : null, description != null ? String(description) : null, recordType != null ? String(recordType) : null, fields != null ? JSON.stringify(Array.isArray(fields) ? fields : []) : null, keyField != null ? String(keyField) : null, filter != null ? JSON.stringify(filter) : null, script != null ? String(script) : null, scheduleMinutes !== void 0 ? 1 : 0, intOrNull(scheduleMinutes), enabled == null ? null : enabled ? 1 : 0, id);
	return getTransformer(id);
}
function setTransformerStatus(id, status) {
	db.prepare(`UPDATE transformers SET status = ? WHERE id = ?`).run(TRANSFORMER_STATUSES.includes(status) ? status : "idle", id);
}
/**
* Record the outcome of a run: stamp last_run_at, advance the cursor, and set
* status/last_error. Pass `error` to mark the transformer errored; otherwise it
* goes back to idle and the error is cleared.
*/
function markTransformerRun(id, { cursor, error = null } = {}) {
	db.prepare(`UPDATE transformers SET
			last_run_at = datetime('now'),
			cursor = COALESCE(?, cursor),
			status = ?,
			last_error = ?,
			updated_at = datetime('now')
		 WHERE id = ?`).run(cursor != null ? String(cursor) : null, error ? "error" : "idle", error ? String(error) : null, id);
	return getTransformer(id);
}
/** Clear the watermark so the next run reprocesses every matching record. */
function resetTransformerCursor(id) {
	db.prepare(`UPDATE transformers SET cursor = NULL, updated_at = datetime('now') WHERE id = ?`).run(id);
	return getTransformer(id);
}
function deleteTransformer(id) {
	return db.prepare(`DELETE FROM transformers WHERE id = ?`).run(id).changes > 0;
}
//#endregion
//#region src/lib/server/providers/transformer.js
function runCaps() {
	const cap = (key, fallback) => {
		const n = Math.round(getSetting(key));
		return Number.isFinite(n) && n > 0 ? n : fallback;
	};
	return {
		maxSourceRecords: cap("TRANSFORMER_MAX_SOURCE_RECORDS", 200),
		maxEnrichCalls: cap("TRANSFORMER_MAX_ENRICH_CALLS", 25),
		maxLogLines: cap("TRANSFORMER_MAX_LOG_LINES", 50)
	};
}
var INSTANCE_NAME = "Transformers";
var INSTANCE_TYPE = "transformer";
var AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;
var SkipSignal = class {
	constructor(reason) {
		this.reason = reason == null ? "" : String(reason);
	}
};
/** Compile the stored script into a per-record async function. Throws on syntax errors. */
function compileScript(script) {
	return new AsyncFunction("ctx", String(script ?? ""));
}
async function runTransformer(transformer) {
	if (!String(transformer.script ?? "").trim()) {
		markTransformerRun(transformer.id, { error: "Transformer has no script." });
		return {
			processed: 0,
			saved: 0,
			errors: 1,
			error: "no_script"
		};
	}
	let fn;
	try {
		fn = compileScript(transformer.script);
	} catch (err) {
		markTransformerRun(transformer.id, { error: `Script error: ${err?.message ?? err}` });
		return {
			processed: 0,
			saved: 0,
			errors: 1,
			error: err?.message ?? String(err)
		};
	}
	setTransformerStatus(transformer.id, "running");
	const priorCursor = Number(transformer.cursor) || 0;
	const { maxSourceRecords, maxEnrichCalls, maxLogLines } = runCaps();
	try {
		const instance = findOrCreateInstance({
			name: INSTANCE_NAME,
			type: INSTANCE_TYPE
		});
		const source = queryRecords({
			...transformer.filter ?? {},
			afterId: priorCursor || void 0
		}, { limit: null }).sort((a, b) => a.id - b.id).slice(0, maxSourceRecords);
		const declaredFields = Array.isArray(transformer.fields) ? transformer.fields : [];
		const keyField = transformer.keyField || "id";
		const rows = [];
		const logs = [];
		let enrichCalls = 0;
		let saved = 0;
		let skipped = 0;
		let errors = 0;
		let firstError = "";
		let capHit = false;
		let processedCount = 0;
		for (const record of source) {
			if (capHit) break;
			const before = {
				saved,
				skipped,
				errors,
				firstError,
				rowCount: rows.length,
				logCount: logs.length
			};
			const ctx = {
				record,
				save(fields) {
					if (!fields || typeof fields !== "object") throw new Error("save() expects an object of fields.");
					const key = fields[keyField];
					if (key == null || String(key).trim() === "") throw new Error(`save() is missing the key field "${keyField}".`);
					const metadata = {};
					const names = declaredFields.length ? declaredFields : Object.keys(fields);
					for (const name of names) if (fields[name] !== void 0) metadata[name] = fields[name];
					rows.push({
						instanceId: instance.id,
						transformerId: transformer.id,
						id: String(key),
						recordType: transformer.recordType,
						metadata,
						capturedAt: record.capturedAt ?? null
					});
					saved++;
				},
				async enrich(toolName, params = {}) {
					const tool = TOOLS[String(toolName)];
					if (!tool) throw new Error(`Unknown tool: ${toolName}`);
					if (tool.kind !== "read") throw new Error(`Tool ${toolName} is not read-only.`);
					if (enrichCalls >= maxEnrichCalls) {
						capHit = true;
						throw new Error(`Enrich cap reached (${maxEnrichCalls} calls per run).`);
					}
					enrichCalls++;
					return typeof tool.data === "function" ? tool.data(params) : tool.run(params);
				},
				query(filter = {}) {
					return queryRecords(filter);
				},
				existing(key) {
					const k = String(key ?? "").trim();
					if (!k) return null;
					const stagedRow = rows.findLast((r) => r.id === k);
					if (stagedRow) return { ...stagedRow.metadata };
					const persistedRecord = getTransformerRecordByKey(transformer.id, k);
					return persistedRecord ? { ...persistedRecord.metadata } : null;
				},
				hash(input) {
					return createHash("sha256").update(String(input ?? "")).digest("hex").slice(0, 16);
				},
				skip(reason) {
					throw new SkipSignal(reason);
				},
				log(msg) {
					if (logs.length < maxLogLines) logs.push(String(msg));
				}
			};
			try {
				await fn(ctx);
			} catch (err) {
				if (err instanceof SkipSignal) {
					skipped++;
					if (err.reason && logs.length < maxLogLines) logs.push(`skipped record ${record.id}: ${err.reason}`);
				} else {
					errors++;
					if (!firstError) firstError = err?.message ?? String(err);
				}
			}
			if (capHit) {
				({saved, skipped, errors, firstError} = before);
				rows.length = before.rowCount;
				logs.length = before.logCount;
				break;
			}
			processedCount++;
		}
		const deferred = source.length - processedCount;
		if (deferred && logs.length < maxLogLines) logs.push(`enrich cap (${maxEnrichCalls}) reached — ${deferred} record${deferred === 1 ? "" : "s"} deferred to the next run`);
		const persisted = upsertTransformerRecords(rows);
		const lastId = processedCount ? source[processedCount - 1].id : null;
		markTransformerRun(transformer.id, {
			cursor: lastId != null ? String(lastId) : void 0,
			error: errors ? `${errors}/${processedCount} records failed: ${firstError}` : null
		});
		logEvent("transformer_run", {
			transformerId: transformer.id,
			name: transformer.name,
			processed: processedCount,
			saved: persisted,
			enriched: enrichCalls,
			skipped,
			deferred,
			errors
		});
		return {
			processed: processedCount,
			saved: persisted,
			skipped,
			deferred,
			errors,
			logs,
			error: firstError || null
		};
	} catch (err) {
		markTransformerRun(transformer.id, { error: err?.message ?? String(err) });
		logEvent("transformer_run_error", {
			transformerId: transformer.id,
			error: err?.message ?? String(err)
		});
		return {
			processed: 0,
			saved: 0,
			errors: 1,
			error: err?.message ?? String(err)
		};
	}
}

export { resetTransformerCursor as a, listTransformers as b, createTransformer as c, deleteTransformer as d, compileScript as e, getTransformer as g, listDueTransformers as l, runTransformer as r, updateTransformer as u };
//# sourceMappingURL=transformer.js-BBxyHg-P.js.map
