import { d as db } from './db.js-BcppfB2j.js';

//#region src/lib/server/db/tasks.js
var selectBase = `
	SELECT t.id, t.title, t.description, t.status, t.priority, t.due_date AS dueDate,
	       t.project_id AS projectId, t.recurrence, t.recurrence_days AS recurrenceDaysRaw,
	       t.recurrence_interval AS recurrenceInterval,
	       t.created_at AS createdAt, t.updated_at AS updatedAt,
	       t.completed_at AS completedAt, p.name AS projectName, p.color AS projectColor
	FROM tasks t
	LEFT JOIN projects p ON p.id = t.project_id
`;
var RECURRENCES = [
	"none",
	"daily",
	"weekdays",
	"weekly"
];
function localDateStr(date = /* @__PURE__ */ new Date()) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function parseDays(raw) {
	return raw ? raw.split(",").map((n) => Number(n)).filter((n) => Number.isInteger(n)) : [];
}
/** Is a recurring task scheduled on the given Date? `task` must carry parsed fields. */
function isScheduledOn(task, date) {
	if (task.dueDate && localDateStr(date) < task.dueDate) return false;
	const dow = date.getDay();
	switch (task.recurrence) {
		case "daily": return true;
		case "weekdays": return dow >= 1 && dow <= 5;
		case "weekly": return task.recurrenceDays.includes(dow);
		default: return false;
	}
}
/** First scheduled date (YYYY-MM-DD) on or after `fromStr`, else null. */
function nextScheduled(task, fromStr) {
	const d = /* @__PURE__ */ new Date(`${fromStr}T00:00:00`);
	for (let i = 0; i < 400; i++) {
		if (isScheduledOn(task, d)) return localDateStr(d);
		d.setDate(d.getDate() + 1);
	}
	return null;
}
/** Consecutive scheduled days completed, counting back from today. */
function currentStreak(task, completedSet, today) {
	if (completedSet.size === 0) return 0;
	let streak = 0;
	let isToday = true;
	const d = /* @__PURE__ */ new Date(`${today}T00:00:00`);
	for (let guard = 0; guard < 800; guard++) {
		if (isScheduledOn(task, d)) {
			const ds = localDateStr(d);
			if (completedSet.has(ds)) streak++;
			else if (!(isToday && ds === today)) break;
		}
		d.setDate(d.getDate() - 1);
		isToday = false;
	}
	return streak;
}
function completionDates(taskId) {
	return db.prepare(`SELECT date FROM task_completions WHERE task_id = ? ORDER BY date DESC`).all(taskId).map((r) => r.date);
}
/** Attaches recurrence/streak metadata to a raw task row. */
function enrich(row, today = localDateStr()) {
	if (!row) return row;
	const recurrenceDays = parseDays(row.recurrenceDaysRaw);
	const task = {
		...row,
		recurrenceDays
	};
	delete task.recurrenceDaysRaw;
	const isRecurring = row.recurrence && row.recurrence !== "none";
	task.isRecurring = !!isRecurring;
	if (isRecurring) {
		const dates = completionDates(row.id);
		const set = new Set(dates);
		task.totalCompletions = dates.length;
		task.completedToday = set.has(today);
		task.scheduledToday = isScheduledOn(task, /* @__PURE__ */ new Date(`${today}T00:00:00`));
		task.currentStreak = currentStreak(task, set, today);
		task.nextScheduled = nextScheduled(task, today);
	} else {
		task.totalCompletions = 0;
		task.completedToday = false;
		task.scheduledToday = false;
		task.currentStreak = 0;
		task.nextScheduled = null;
	}
	return task;
}
function listTasks() {
	const today = localDateStr();
	return db.prepare(`${selectBase}
			ORDER BY
				CASE t.status WHEN 'done' THEN 1 ELSE 0 END,
				CASE t.priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END,
				t.due_date IS NULL, t.due_date ASC, t.created_at DESC`).all().map((row) => enrich(row, today));
}
function getTask(id) {
	return enrich(db.prepare(`${selectBase} WHERE t.id = ?`).get(id));
}
function listTasksForProject(projectId) {
	const today = localDateStr();
	return db.prepare(`${selectBase} WHERE t.project_id = ? ORDER BY t.created_at DESC`).all(projectId).map((row) => enrich(row, today));
}
function createTask({ title, description = "", priority = "medium", dueDate = null, projectId = null, recurrence = "none", recurrenceDays = [] }) {
	const rec = RECURRENCES.includes(recurrence) ? recurrence : "none";
	const daysRaw = rec === "weekly" ? normalizeDays(recurrenceDays) : "";
	const info = db.prepare(`INSERT INTO tasks (title, description, priority, due_date, project_id, recurrence, recurrence_days)
			 VALUES (?, ?, ?, ?, ?, ?, ?)`).run(title, description, priority, dueDate || null, projectId || null, rec, daysRaw);
	return getTask(Number(info.lastInsertRowid));
}
function toggleTask(id) {
	const task = db.prepare(`SELECT status FROM tasks WHERE id = ?`).get(id);
	if (!task) return null;
	const done = task.status === "done";
	db.prepare(`UPDATE tasks
		 SET status = ?, completed_at = ?, updated_at = datetime('now')
		 WHERE id = ?`).run(done ? "todo" : "done", done ? null : (/* @__PURE__ */ new Date()).toISOString(), id);
	return getTask(id);
}
/**
* Toggle completion for the appropriate "occurrence":
* - recurring tasks log/unlog today's completion (and stay open)
* - one-off tasks flip their done status
*/
function toggleTaskOccurrence(id) {
	const row = db.prepare(`SELECT recurrence FROM tasks WHERE id = ?`).get(id);
	if (!row) return null;
	if (row.recurrence && row.recurrence !== "none") {
		const today = localDateStr();
		if (db.prepare(`SELECT id FROM task_completions WHERE task_id = ? AND date = ?`).get(id, today)) db.prepare(`DELETE FROM task_completions WHERE task_id = ? AND date = ?`).run(id, today);
		else db.prepare(`INSERT INTO task_completions (task_id, date, completed_at) VALUES (?, ?, ?)`).run(id, today, (/* @__PURE__ */ new Date()).toISOString());
		return getTask(id);
	}
	return toggleTask(id);
}
function updateTask(id, { title, description, priority, dueDate, projectId, recurrence, recurrenceDays }) {
	const rec = recurrence != null && RECURRENCES.includes(recurrence) ? recurrence : null;
	const daysRaw = rec === "weekly" ? normalizeDays(recurrenceDays) : rec ? "" : null;
	db.prepare(`UPDATE tasks SET
			title = COALESCE(?, title),
			description = COALESCE(?, description),
			priority = COALESCE(?, priority),
			due_date = ?,
			project_id = ?,
			recurrence = COALESCE(?, recurrence),
			recurrence_days = COALESCE(?, recurrence_days),
			updated_at = datetime('now')
		 WHERE id = ?`).run(title ?? null, description ?? null, priority ?? null, dueDate || null, projectId || null, rec, daysRaw, id);
	return getTask(id);
}
function deleteTask(id) {
	return db.prepare(`DELETE FROM tasks WHERE id = ?`).run(id).changes > 0;
}
/** Set a one-off task's completion state directly (vs. toggleTask which flips). */
function setTaskDone(id, done) {
	db.prepare(`UPDATE tasks SET status = ?, completed_at = ?, updated_at = datetime('now') WHERE id = ?`).run(done ? "done" : "todo", done ? (/* @__PURE__ */ new Date()).toISOString() : null, id);
	return getTask(id);
}
function normalizeDays(days) {
	const list = Array.isArray(days) ? days : parseDays(String(days ?? ""));
	const unique = [...new Set(list.map((n) => Number(n)).filter((n) => n >= 0 && n <= 6))];
	unique.sort((a, b) => a - b);
	return unique.join(",");
}
/** Aggregate counts used by the overview page (one-off tasks). */
function taskStats(today) {
	return db.prepare(`SELECT
				SUM(CASE WHEN status != 'done' AND recurrence = 'none' AND due_date = ? THEN 1 ELSE 0 END) AS dueToday,
				SUM(CASE WHEN status != 'done' AND recurrence = 'none' AND due_date < ? THEN 1 ELSE 0 END) AS overdue,
				SUM(CASE WHEN status != 'done' AND recurrence = 'none' THEN 1 ELSE 0 END) AS open,
				SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) AS done
			FROM tasks`).get(today, today);
}
function listTasksDueBy(today) {
	return db.prepare(`${selectBase}
			WHERE t.status != 'done' AND t.recurrence = 'none'
				AND t.due_date IS NOT NULL AND t.due_date <= ?
			ORDER BY t.due_date ASC,
				CASE t.priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END
			LIMIT 6`).all(today).map((row) => enrich(row, today));
}
/** Best current streak across recurring tasks (for the overview stat). */
function bestStreak() {
	const today = localDateStr();
	return db.prepare(`${selectBase} WHERE t.recurrence != 'none'`).all().map((row) => enrich(row, today)).reduce((max, t) => Math.max(max, t.currentStreak), 0);
}

export { taskStats as a, listTasksDueBy as b, createTask as c, bestStreak as d, listTasksForProject as e, deleteTask as f, getTask as g, listTasks as l, setTaskDone as s, toggleTaskOccurrence as t, updateTask as u };
//# sourceMappingURL=tasks.js-Bci1Un8l.js.map
