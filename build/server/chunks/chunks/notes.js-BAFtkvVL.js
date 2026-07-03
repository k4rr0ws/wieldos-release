import { d as db } from './db.js-BcppfB2j.js';

//#region src/lib/server/db/notes.js
var selectBase = `
	SELECT n.id, n.title, n.content, n.pinned, n.tags, n.task_id AS taskId,
	       n.project_id AS projectId, p.name AS projectName,
	       n.created_at AS createdAt, n.updated_at AS updatedAt
	FROM notes n
	LEFT JOIN projects p ON p.id = n.project_id
`;
var intOrNull = (value) => Number.isInteger(Number(value)) && Number(value) > 0 ? Number(value) : null;
/** Normalize freeform tag input (array or comma/newline string) to a clean array. */
function toTags(value) {
	if (Array.isArray(value)) return [...new Set(value.map((v) => String(v).trim()).filter(Boolean))];
	if (typeof value === "string") return [...new Set(value.split(/[\n,]/).map((s) => s.trim()).filter(Boolean))];
	return [];
}
function parseTags(raw) {
	if (!raw) return [];
	try {
		const value = JSON.parse(raw);
		return Array.isArray(value) ? value.map((v) => String(v)) : [];
	} catch {
		return [];
	}
}
function mapNote(note) {
	if (!note) return null;
	return {
		...note,
		pinned: !!note.pinned,
		tags: parseTags(note.tags)
	};
}
function listNotes() {
	return db.prepare(`${selectBase} ORDER BY n.pinned DESC, n.updated_at DESC`).all().map(mapNote);
}
function getNote(id) {
	return mapNote(db.prepare(`${selectBase} WHERE n.id = ?`).get(id));
}
function createNote({ title, content = "", pinned = false, taskId = null, projectId = null, tags = [] }) {
	const info = db.prepare(`INSERT INTO notes (title, content, pinned, task_id, project_id, tags) VALUES (?, ?, ?, ?, ?, ?)`).run(title, content, pinned ? 1 : 0, taskId || null, intOrNull(projectId), JSON.stringify(toTags(tags)));
	return getNote(Number(info.lastInsertRowid));
}
function updateNote(id, { title, content, tags, projectId }) {
	const sets = [
		"title = COALESCE(?, title)",
		"content = COALESCE(?, content)",
		"tags = COALESCE(?, tags)"
	];
	const params = [
		title ?? null,
		content ?? null,
		tags != null ? JSON.stringify(toTags(tags)) : null
	];
	if (projectId !== void 0) {
		sets.push("project_id = ?");
		params.push(intOrNull(projectId));
	}
	sets.push("updated_at = datetime('now')");
	params.push(id);
	db.prepare(`UPDATE notes SET ${sets.join(", ")} WHERE id = ?`).run(...params);
	return getNote(id);
}
function togglePin(id) {
	db.prepare(`UPDATE notes SET pinned = CASE pinned WHEN 1 THEN 0 ELSE 1 END,
			updated_at = datetime('now')
		 WHERE id = ?`).run(id);
	return getNote(id);
}
function deleteNote(id) {
	return db.prepare(`DELETE FROM notes WHERE id = ?`).run(id).changes > 0;
}
function recentNotes(limit = 4) {
	return db.prepare(`${selectBase} ORDER BY n.updated_at DESC LIMIT ?`).all(limit).map(mapNote);
}
function notesSince(isoDate) {
	return db.prepare(`SELECT COUNT(*) AS count FROM notes WHERE created_at >= ?`).get(isoDate).count;
}

export { togglePin as a, createNote as c, deleteNote as d, getNote as g, listNotes as l, notesSince as n, recentNotes as r, toTags as t, updateNote as u };
//# sourceMappingURL=notes.js-BAFtkvVL.js.map
