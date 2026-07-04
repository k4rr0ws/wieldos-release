import { d as db } from './db.js-tGTv_Rod.js';
import { t as toTags } from './notes.js-DRMbxsWP.js';

//#region src/lib/server/db/deliverables.js
var DELIVERABLE_TYPES = [
	"report",
	"draft",
	"spec",
	"plan",
	"thread",
	"note",
	"reference"
];
var DELIVERABLE_STATUSES = [
	"draft",
	"final",
	"archived"
];
var selectBase = `
	SELECT d.id, d.title, d.body, d.type, d.status,
		d.agent_id AS agentId, a.name AS agentName,
		d.project_id AS projectId, p.name AS projectName,
		d.source_dispatch_id AS sourceDispatchId, d.tags, d.exported_at AS exportedAt,
		d.created_at AS createdAt, d.updated_at AS updatedAt
	FROM deliverables d
	LEFT JOIN agents a ON a.id = d.agent_id
	LEFT JOIN projects p ON p.id = d.project_id
`;
function parseTags(raw) {
	if (!raw) return [];
	try {
		const value = JSON.parse(raw);
		return Array.isArray(value) ? value.map((v) => String(v)) : [];
	} catch {
		return [];
	}
}
function mapDeliverable(row) {
	if (!row) return null;
	return {
		...row,
		tags: parseTags(row.tags)
	};
}
var cleanType = (type) => DELIVERABLE_TYPES.includes(type) ? type : "note";
var cleanStatus = (status) => DELIVERABLE_STATUSES.includes(status) ? status : "draft";
var intOrNull = (value) => Number.isInteger(Number(value)) && Number(value) > 0 ? Number(value) : null;
/**
* List deliverables, newest first, with optional filters.
* @param {{ agentId?: number, projectId?: number, status?: string, type?: string }} [filters]
*/
function listDeliverables(filters = {}) {
	const where = [];
	const params = [];
	if (intOrNull(filters.agentId)) {
		where.push("d.agent_id = ?");
		params.push(Number(filters.agentId));
	}
	if (intOrNull(filters.projectId)) {
		where.push("d.project_id = ?");
		params.push(Number(filters.projectId));
	}
	if (DELIVERABLE_STATUSES.includes(filters.status)) {
		where.push("d.status = ?");
		params.push(filters.status);
	}
	if (DELIVERABLE_TYPES.includes(filters.type)) {
		where.push("d.type = ?");
		params.push(filters.type);
	}
	const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
	return db.prepare(`${selectBase} ${clause} ORDER BY d.updated_at DESC`).all(...params).map(mapDeliverable);
}
function getDeliverable(id) {
	return mapDeliverable(db.prepare(`${selectBase} WHERE d.id = ?`).get(id));
}
function createDeliverable({ title, body = "", type = "note", status = "draft", agentId = null, projectId = null, sourceDispatchId = "", tags = [] }) {
	const info = db.prepare(`INSERT INTO deliverables (title, body, type, status, agent_id, project_id, source_dispatch_id, tags)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(String(title), String(body ?? ""), cleanType(type), cleanStatus(status), intOrNull(agentId), intOrNull(projectId), String(sourceDispatchId ?? ""), JSON.stringify(toTags(tags)));
	return getDeliverable(Number(info.lastInsertRowid));
}
function updateDeliverable(id, { title, body, type, projectId, tags }) {
	db.prepare(`UPDATE deliverables SET
			title = COALESCE(?, title),
			body = COALESCE(?, body),
			type = COALESCE(?, type),
			project_id = COALESCE(?, project_id),
			tags = COALESCE(?, tags),
			updated_at = datetime('now')
		 WHERE id = ?`).run(title != null ? String(title) : null, body != null ? String(body) : null, type != null ? cleanType(type) : null, projectId != null ? intOrNull(projectId) : null, tags != null ? JSON.stringify(toTags(tags)) : null, id);
	return getDeliverable(id);
}
function setDeliverableStatus(id, status) {
	db.prepare(`UPDATE deliverables SET status = ?, updated_at = datetime('now') WHERE id = ?`).run(cleanStatus(status), id);
	return getDeliverable(id);
}
function deleteDeliverable(id) {
	return db.prepare(`DELETE FROM deliverables WHERE id = ?`).run(id).changes > 0;
}
/** Recent finalized deliverables, used to ground agents in prior artifacts. */
function recentFinalDeliverables(limit = 8) {
	return db.prepare(`${selectBase} WHERE d.status = 'final' ORDER BY d.updated_at DESC LIMIT ?`).all(Math.max(1, Math.min(50, Math.round(Number(limit) || 8)))).map(mapDeliverable);
}
/**
* Reference-type deliverables: living reference material agents maintain and
* recall (curated lists, datasets, standing context). Most recently updated
* first, so it's always discoverable. Archived references are excluded — that's
* how a reference is "retired" from agent context. Agents read one in full /
* revise it via search_deliverables + update_deliverable by #id.
*/
function listReferenceDeliverables(limit = 6) {
	return db.prepare(`${selectBase} WHERE d.type = 'reference' AND d.status != 'archived'
			 ORDER BY d.updated_at DESC LIMIT ?`).all(Math.max(1, Math.min(50, Math.round(Number(limit) || 6)))).map(mapDeliverable);
}

export { DELIVERABLE_TYPES as D, listDeliverables as a, DELIVERABLE_STATUSES as b, createDeliverable as c, deleteDeliverable as d, getDeliverable as g, listReferenceDeliverables as l, recentFinalDeliverables as r, setDeliverableStatus as s, updateDeliverable as u };
//# sourceMappingURL=deliverables.js-CigY-aU9.js.map
