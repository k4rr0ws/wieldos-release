import { d as db } from './db.js-tGTv_Rod.js';

//#region src/lib/server/db/projects.js
var selectWithProgress = `
	SELECT p.id, p.name, p.description, p.status, p.color, p.paid,
	       p.human_id AS humanId, h.username AS humanName,
	       p.created_at AS createdAt, p.updated_at AS updatedAt,
	       COUNT(t.id) AS totalTasks,
	       SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END) AS doneTasks
	FROM projects p
	LEFT JOIN tasks t ON t.project_id = p.id
	LEFT JOIN humans h ON h.id = p.human_id
`;
function withProgress(row) {
	const total = row.totalTasks ?? 0;
	const done = row.doneTasks ?? 0;
	return {
		...row,
		paid: !!row.paid,
		totalTasks: total,
		doneTasks: done,
		progress: total === 0 ? 0 : Math.round(done / total * 100)
	};
}
function listProjects() {
	return db.prepare(`${selectWithProgress}
			GROUP BY p.id
			ORDER BY
				CASE p.status
					WHEN 'active' THEN 0
					WHEN 'planning' THEN 1
					WHEN 'on_hold' THEN 2
					WHEN 'done' THEN 3
					ELSE 4
				END,
				p.created_at DESC`).all().map(withProgress);
}
function getProject(id) {
	const row = db.prepare(`${selectWithProgress} WHERE p.id = ? GROUP BY p.id`).get(id);
	return row ? withProgress(row) : null;
}
/** Lightweight list for populating selects. */
function listProjectOptions() {
	return db.prepare(`SELECT id, name, color FROM projects ORDER BY name ASC`).all();
}
function createProject({ name, description = "", status = "active", color = "slate", paid = false, humanId = null }) {
	const info = db.prepare(`INSERT INTO projects (name, description, status, color, paid, human_id)
			 VALUES (?, ?, ?, ?, ?, ?)`).run(name, description, status, color, paid ? 1 : 0, paid ? humanId || null : null);
	return getProject(Number(info.lastInsertRowid));
}
function updateProject(id, { name, description, status, color, paid, humanId }) {
	db.prepare(`UPDATE projects SET
			name = COALESCE(?, name),
			description = COALESCE(?, description),
			status = COALESCE(?, status),
			color = COALESCE(?, color),
			paid = COALESCE(?, paid),
			human_id = ?,
			updated_at = datetime('now')
		 WHERE id = ?`).run(name ?? null, description ?? null, status ?? null, color ?? null, paid == null ? null : paid ? 1 : 0, paid ? humanId || null : null, id);
	return getProject(id);
}
function deleteProject(id) {
	return db.prepare(`DELETE FROM projects WHERE id = ?`).run(id).changes > 0;
}
function projectStats() {
	return db.prepare(`SELECT
				COUNT(*) AS total,
				SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active
			FROM projects`).get();
}

export { listProjectOptions as a, createProject as c, deleteProject as d, getProject as g, listProjects as l, projectStats as p, updateProject as u };
//# sourceMappingURL=projects.js-Bx7Ibrtr.js.map
