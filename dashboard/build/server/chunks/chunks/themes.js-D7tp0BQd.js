import { d as db } from './db.js-tGTv_Rod.js';
import { n as normalizeTokens } from './theme.js-DVGyOT_Y.js';

//#region src/lib/server/db/themes.js
function mapTheme(row) {
	if (!row) return null;
	let parsed;
	try {
		parsed = JSON.parse(row.tokensJson);
	} catch {
		parsed = {};
	}
	return {
		id: row.id,
		name: row.name,
		isActive: Boolean(row.isActive),
		tokens: normalizeTokens(parsed),
		createdAt: row.createdAt,
		updatedAt: row.updatedAt
	};
}
var selectBase = `
	SELECT id, name, tokens_json AS tokensJson, is_active AS isActive,
		created_at AS createdAt, updated_at AS updatedAt
	FROM themes
`;
function listThemes() {
	return db.prepare(`${selectBase} ORDER BY name`).all().map(mapTheme);
}
function getTheme(id) {
	return mapTheme(db.prepare(`${selectBase} WHERE id = ?`).get(id));
}
/** The active theme, or the first theme, or null if none exist. */
function getActiveTheme() {
	return mapTheme(db.prepare(`${selectBase} WHERE is_active = 1`).get()) ?? mapTheme(db.prepare(`${selectBase} ORDER BY name LIMIT 1`).get());
}
/** Create a theme from (partial) tokens; returns the new row. Name must be unique. */
function createTheme({ name, tokens }) {
	const info = db.prepare(`INSERT INTO themes (name, tokens_json) VALUES (?, ?)`).run(String(name), JSON.stringify(normalizeTokens(tokens)));
	return getTheme(Number(info.lastInsertRowid));
}
function updateTheme(id, { name, tokens } = {}) {
	db.prepare(`UPDATE themes SET
			name = COALESCE(?, name),
			tokens_json = COALESCE(?, tokens_json),
			updated_at = datetime('now')
		 WHERE id = ?`).run(name != null ? String(name) : null, tokens != null ? JSON.stringify(normalizeTokens(tokens)) : null, id);
	return getTheme(id);
}
/** Make one theme active and clear the flag on all others. */
function activateTheme(id) {
	db.exec("BEGIN");
	try {
		db.prepare(`UPDATE themes SET is_active = 0 WHERE is_active = 1`).run();
		db.prepare(`UPDATE themes SET is_active = 1, updated_at = datetime('now') WHERE id = ?`).run(id);
		db.exec("COMMIT");
	} catch (error) {
		db.exec("ROLLBACK");
		throw error;
	}
	return getTheme(id);
}
/**
* Delete a theme. The last remaining theme can't be deleted; deleting the
* active theme promotes another to active so the app always has one. Returns
* true when a row was removed.
*/
function deleteTheme(id) {
	const target = getTheme(id);
	if (!target) return false;
	const { n } = db.prepare(`SELECT COUNT(*) AS n FROM themes`).get();
	if (n <= 1) return false;
	db.prepare(`DELETE FROM themes WHERE id = ?`).run(id);
	if (target.isActive) {
		const next = db.prepare(`SELECT id FROM themes ORDER BY name LIMIT 1`).get();
		if (next) activateTheme(next.id);
	}
	return true;
}

export { getTheme as a, activateTheme as b, createTheme as c, deleteTheme as d, getActiveTheme as g, listThemes as l, updateTheme as u };
//# sourceMappingURL=themes.js-D7tp0BQd.js.map
