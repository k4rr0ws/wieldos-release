import { d as db } from './db.js-tGTv_Rod.js';

//#region src/lib/server/db/events.js
var selectBase = `
	SELECT id, title, description, category, start_time AS startTime, end_time AS endTime,
	       created_at AS createdAt, updated_at AS updatedAt
	FROM events
`;
function getEvent(id) {
	return db.prepare(`${selectBase} WHERE id = ?`).get(id);
}
/** Events whose start falls within [fromIso, toIso). */
function listEventsBetween(fromIso, toIso) {
	return db.prepare(`${selectBase} WHERE start_time >= ? AND start_time < ? ORDER BY start_time ASC`).all(fromIso, toIso);
}
function listUpcoming(fromIso, limit = 5) {
	return db.prepare(`${selectBase} WHERE start_time >= ? ORDER BY start_time ASC LIMIT ?`).all(fromIso, limit);
}
function createEvent({ title, description = "", category = "personal", startTime, endTime = null }) {
	const info = db.prepare(`INSERT INTO events (title, description, category, start_time, end_time)
			 VALUES (?, ?, ?, ?, ?)`).run(title, description, category, startTime, endTime || null);
	return getEvent(Number(info.lastInsertRowid));
}
function updateEvent(id, { title, description, category, startTime, endTime }) {
	db.prepare(`UPDATE events SET
			title = COALESCE(?, title),
			description = COALESCE(?, description),
			category = COALESCE(?, category),
			start_time = COALESCE(?, start_time),
			end_time = ?,
			updated_at = datetime('now')
		 WHERE id = ?`).run(title ?? null, description ?? null, category ?? null, startTime ?? null, endTime || null, id);
	return getEvent(id);
}
function deleteEvent(id) {
	return db.prepare(`DELETE FROM events WHERE id = ?`).run(id).changes > 0;
}

export { listUpcoming as a, createEvent as c, deleteEvent as d, listEventsBetween as l, updateEvent as u };
//# sourceMappingURL=events.js-DkEVwPVI.js.map
