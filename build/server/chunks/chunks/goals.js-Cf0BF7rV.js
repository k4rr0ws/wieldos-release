import { d as db } from './db.js-BcppfB2j.js';

//#region src/lib/server/db/goals.js
var selectBase = `
	SELECT id, title, description, achieved, achieved_at AS achievedAt,
		created_at AS createdAt, updated_at AS updatedAt
	FROM goals
`;
function listGoals() {
	return db.prepare(`${selectBase} ORDER BY achieved ASC, updated_at DESC`).all().map((g) => ({
		...g,
		achieved: !!g.achieved
	}));
}
function getGoal(id) {
	const goal = db.prepare(`${selectBase} WHERE id = ?`).get(id);
	return goal ? {
		...goal,
		achieved: !!goal.achieved
	} : null;
}
function createGoal({ title, description = "" }) {
	const info = db.prepare(`INSERT INTO goals (title, description) VALUES (?, ?)`).run(title, description);
	return getGoal(Number(info.lastInsertRowid));
}
function updateGoal(id, { title, description }) {
	db.prepare(`UPDATE goals SET
			title = COALESCE(?, title),
			description = COALESCE(?, description),
			updated_at = datetime('now')
		 WHERE id = ?`).run(title ?? null, description ?? null, id);
	return getGoal(id);
}
function toggleAchieved(id) {
	db.prepare(`UPDATE goals SET
			achieved = CASE achieved WHEN 1 THEN 0 ELSE 1 END,
			achieved_at = CASE achieved WHEN 1 THEN NULL ELSE datetime('now') END,
			updated_at = datetime('now')
		 WHERE id = ?`).run(id);
	return getGoal(id);
}
function deleteGoal(id) {
	return db.prepare(`DELETE FROM goals WHERE id = ?`).run(id).changes > 0;
}

export { createGoal as c, deleteGoal as d, getGoal as g, listGoals as l, toggleAchieved as t, updateGoal as u };
//# sourceMappingURL=goals.js-Cf0BF7rV.js.map
