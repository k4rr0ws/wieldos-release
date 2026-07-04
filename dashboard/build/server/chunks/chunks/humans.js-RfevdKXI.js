import { d as db } from './db.js-tGTv_Rod.js';

//#region src/lib/server/db/humans.js
var selectBase = `
	SELECT id, username, tg_username AS tgUsername, twitter_username AS twitterUsername,
	       phone, email, evm_address AS evmAddress, notes,
	       created_at AS createdAt, updated_at AS updatedAt
	FROM humans
`;
function listHumans() {
	return db.prepare(`${selectBase} ORDER BY username COLLATE NOCASE ASC`).all();
}
function getHuman(id) {
	return db.prepare(`${selectBase} WHERE id = ?`).get(id);
}
/** Lightweight list for populating selects. */
function listHumanOptions() {
	return db.prepare(`SELECT id, username FROM humans ORDER BY username COLLATE NOCASE ASC`).all();
}
function createHuman({ username, tgUsername = "", twitterUsername = "", phone = "", email = "", evmAddress = "", notes = "" }) {
	const info = db.prepare(`INSERT INTO humans (username, tg_username, twitter_username, phone, email, evm_address, notes)
			 VALUES (?, ?, ?, ?, ?, ?, ?)`).run(username, tgUsername, twitterUsername, phone, email, evmAddress, notes);
	return getHuman(Number(info.lastInsertRowid));
}
function updateHuman(id, { username, tgUsername, twitterUsername, phone, email, evmAddress, notes }) {
	db.prepare(`UPDATE humans SET
			username = COALESCE(?, username),
			tg_username = COALESCE(?, tg_username),
			twitter_username = COALESCE(?, twitter_username),
			phone = COALESCE(?, phone),
			email = COALESCE(?, email),
			evm_address = COALESCE(?, evm_address),
			notes = COALESCE(?, notes),
			updated_at = datetime('now')
		 WHERE id = ?`).run(username ?? null, tgUsername ?? null, twitterUsername ?? null, phone ?? null, email ?? null, evmAddress ?? null, notes ?? null, id);
	return getHuman(id);
}
function deleteHuman(id) {
	return db.prepare(`DELETE FROM humans WHERE id = ?`).run(id).changes > 0;
}

export { listHumanOptions as a, createHuman as c, deleteHuman as d, getHuman as g, listHumans as l, updateHuman as u };
//# sourceMappingURL=humans.js-RfevdKXI.js.map
