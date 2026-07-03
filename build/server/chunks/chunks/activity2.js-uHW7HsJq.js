import { d as db } from './db.js-BcppfB2j.js';

//#region src/lib/server/db/activity.js
var MAX_ROWS = 5e3;
var PRUNE_EVERY = 200;
var MAX_FIELDS_CHARS = 4e3;
function safeParse(raw) {
	try {
		const value = JSON.parse(raw);
		return value && typeof value === "object" ? value : {};
	} catch {
		return {};
	}
}
/**
* Append one event to the activity log. Mirrors logEvent's (event, fields)
* shape. Callers (logEvent) already swallow errors; this stays best-effort.
*
* @param {string} event
* @param {object} [fields]
*/
function insertActivity(event, fields = {}) {
	let serialized = "{}";
	try {
		serialized = JSON.stringify(fields ?? {}).slice(0, MAX_FIELDS_CHARS);
	} catch {
		serialized = "{}";
	}
	const info = db.prepare(`INSERT INTO activity_log (event, fields) VALUES (?, ?)`).run(String(event), serialized);
	if (Number(info.lastInsertRowid) % PRUNE_EVERY === 0) pruneActivity();
}
/** Trim the log to (roughly) the newest `maxRows` rows, by id. */
function pruneActivity(maxRows = MAX_ROWS) {
	db.prepare(`DELETE FROM activity_log WHERE id <= (SELECT MAX(id) FROM activity_log) - ?`).run(Math.max(0, Math.round(maxRows)));
}
/**
* Recent activity, newest first, with parsed fields. Optional exact-event filter.
* @param {{ limit?: number, event?: string }} [opts]
*/
function listActivity({ limit = 50, event = "" } = {}) {
	const n = Math.max(1, Math.min(200, Math.round(Number(limit) || 50)));
	return (event ? db.prepare(`SELECT id, event, fields, created_at AS createdAt FROM activity_log
					 WHERE event = ? ORDER BY id DESC LIMIT ?`).all(String(event), n) : db.prepare(`SELECT id, event, fields, created_at AS createdAt FROM activity_log ORDER BY id DESC LIMIT ?`).all(n)).map((r) => ({
		id: r.id,
		event: r.event,
		createdAt: r.createdAt,
		fields: safeParse(r.fields)
	}));
}
/** Most recent row whose event is one of `events`, or null. */
function lastEvent(events) {
	const list = Array.isArray(events) ? events : [events];
	const placeholders = list.map(() => "?").join(",");
	const row = db.prepare(`SELECT event, fields, created_at AS createdAt FROM activity_log
			 WHERE event IN (${placeholders}) ORDER BY id DESC LIMIT 1`).get(...list);
	return row ? {
		event: row.event,
		createdAt: row.createdAt,
		fields: safeParse(row.fields)
	} : null;
}
/** Count rows matching `clause` within the last 24 hours. */
function countLastDay(clause, params = []) {
	return db.prepare(`SELECT COUNT(*) AS n FROM activity_log
			 WHERE ${clause} AND created_at >= datetime('now', '-1 day')`).get(...params)?.n ?? 0;
}
/**
* Derive scheduler health purely from the activity log: whether it started or
* was disabled this process, its cadence, the last tick + last error, and 24h
* counters. No in-memory scheduler state required, so it works across reloads.
*/
function schedulerHealth() {
	const lifecycle = lastEvent(["scheduler_start", "scheduler_disabled"]);
	const lastTick = lastEvent("scheduler_tick");
	const errorRow = db.prepare(`SELECT event, fields, created_at AS createdAt FROM activity_log
			 WHERE event LIKE '%error' ORDER BY id DESC LIMIT 1`).get();
	const lastError = errorRow ? {
		event: errorRow.event,
		createdAt: errorRow.createdAt,
		message: safeParse(errorRow.fields).error ?? ""
	} : null;
	return {
		status: !lifecycle ? "unknown" : lifecycle.event === "scheduler_start" ? "running" : "disabled",
		disabledReason: lifecycle?.event === "scheduler_disabled" ? lifecycle.fields.reason ?? "" : null,
		intervalMs: lifecycle?.event === "scheduler_start" ? lifecycle.fields.intervalMs ?? null : null,
		startedAt: lifecycle?.createdAt ?? null,
		lastTickAt: lastTick?.createdAt ?? null,
		lastTick: lastTick?.fields ?? null,
		lastError,
		ticks24h: countLastDay("event = ?", ["scheduler_tick"]),
		errors24h: countLastDay("event LIKE '%error'")
	};
}

export { insertActivity as i, listActivity as l, schedulerHealth as s };
//# sourceMappingURL=activity2.js-uHW7HsJq.js.map
