import { d as db } from './db.js-BcppfB2j.js';
import { D as DELIVERABLE_TYPES, g as getDeliverable, u as updateDeliverable, c as createDeliverable } from './deliverables.js-f4a3J5Ph.js';
import { q as queryRecords } from './records.js-CRr2Hc_8.js';

//#region src/lib/server/db/reports.js
var selectBase = `
	SELECT r.id, r.name, r.description, r.filter_json AS filterJson, r.pinned,
		r.deliverable_id AS deliverableId, d.title AS deliverableTitle, d.status AS deliverableStatus,
		d.type AS deliverableType,
		r.created_at AS createdAt, r.updated_at AS updatedAt
	FROM reports r
	LEFT JOIN deliverables d ON d.id = r.deliverable_id
`;
function safeParse(raw, fallback) {
	try {
		const value = JSON.parse(raw);
		return value && typeof value === "object" ? value : fallback;
	} catch {
		return fallback;
	}
}
function mapReport(row) {
	if (!row) return null;
	return {
		...row,
		filter: safeParse(row.filterJson, {}),
		pinned: Boolean(row.pinned)
	};
}
function listReports() {
	return db.prepare(`${selectBase} ORDER BY r.pinned DESC, r.updated_at DESC`).all().map(mapReport);
}
function getReport(id) {
	return mapReport(db.prepare(`${selectBase} WHERE r.id = ?`).get(id));
}
/** Pinned reports, for injection into gatherContext(). */
function listPinnedReports(limit = 3) {
	return db.prepare(`${selectBase} WHERE r.pinned = 1 ORDER BY r.updated_at DESC LIMIT ?`).all(Math.max(1, Math.min(20, Math.round(Number(limit) || 3)))).map(mapReport);
}
/** Count pinned reports, optionally excluding one id (the row being toggled). */
function countPinnedReports(excludeId = null) {
	return (excludeId ? db.prepare(`SELECT COUNT(*) AS n FROM reports WHERE pinned = 1 AND id != ?`).get(excludeId) : db.prepare(`SELECT COUNT(*) AS n FROM reports WHERE pinned = 1`).get())?.n ?? 0;
}
/** Find a report by exact name (case-insensitive), or null. Used by run_report. */
function findReportByName(name) {
	return mapReport(db.prepare(`${selectBase} WHERE lower(r.name) = lower(?) LIMIT 1`).get(String(name ?? "").trim()));
}
function createReport({ name, description = "", filter = {}, pinned = false }) {
	const info = db.prepare(`INSERT INTO reports (name, description, filter_json, pinned) VALUES (?, ?, ?, ?)`).run(String(name), String(description ?? ""), JSON.stringify(filter ?? {}), pinned ? 1 : 0);
	return getReport(Number(info.lastInsertRowid));
}
function updateReport(id, { name, description, filter, pinned } = {}) {
	db.prepare(`UPDATE reports SET
			name = COALESCE(?, name),
			description = COALESCE(?, description),
			filter_json = COALESCE(?, filter_json),
			pinned = COALESCE(?, pinned),
			updated_at = datetime('now')
		 WHERE id = ?`).run(name != null ? String(name) : null, description != null ? String(description) : null, filter != null ? JSON.stringify(filter) : null, pinned == null ? null : pinned ? 1 : 0, id);
	return getReport(id);
}
function setReportDeliverable(id, deliverableId) {
	db.prepare(`UPDATE reports SET deliverable_id = ?, updated_at = datetime('now') WHERE id = ?`).run(deliverableId, id);
}
function deleteReport(id) {
	return db.prepare(`DELETE FROM reports WHERE id = ?`).run(id).changes > 0;
}
/** Run a report's filter and return the matching records. */
function runReport(id) {
	const report = getReport(id);
	return report ? queryRecords(report.filter) : [];
}
/** Markdown for one metadata value: objects/arrays as inline-code JSON, else text. */
function renderValue(value) {
	return value !== null && typeof value === "object" ? `\`${JSON.stringify(value)}\`` : String(value);
}
function renderRecord(row) {
	const m = row.metadata && typeof row.metadata === "object" ? row.metadata : {};
	const when = row.capturedAt || row.createdAt;
	const heading = `## ${row.recordType}${row.instanceName ? ` · ${row.instanceName}` : ""}${when ? ` · ${when}` : ""}`;
	const lines = Object.entries(m).filter(([, v]) => v !== "" && v !== null && v !== void 0 && v !== false).map(([k, v]) => `- **${k}:** ${renderValue(v)}`);
	return lines.length ? `${heading}\n${lines.join("\n")}` : heading;
}
function renderReportBody(report, rows) {
	return `${[
		`# ${report.name}`,
		report.description ? `\n${report.description}` : "",
		`\n_Generated ${(/* @__PURE__ */ new Date()).toISOString()} · ${rows.length} record${rows.length === 1 ? "" : "s"}_`
	].filter(Boolean).join("\n")}\n\n${rows.length ? rows.map(renderRecord).join("\n\n") : "\n_No records matched._"}`;
}
function materializeReport(id, { agentId = null, type = "reference" } = {}) {
	const report = getReport(id);
	if (!report) return null;
	const deliverableType = DELIVERABLE_TYPES.includes(type) ? type : "reference";
	const body = renderReportBody(report, queryRecords(report.filter, { limit: null }));
	if (report.deliverableId && getDeliverable(report.deliverableId)) {
		updateDeliverable(report.deliverableId, {
			title: report.name,
			body,
			type: deliverableType
		});
		return getDeliverable(report.deliverableId);
	}
	const created = createDeliverable({
		title: report.name,
		body,
		type: deliverableType,
		agentId,
		tags: ["report"]
	});
	setReportDeliverable(id, created.id);
	return created;
}

export { listReports as a, countPinnedReports as b, createReport as c, deleteReport as d, findReportByName as f, getReport as g, listPinnedReports as l, materializeReport as m, runReport as r, updateReport as u };
//# sourceMappingURL=reports.js-CxYYqpm4.js.map
