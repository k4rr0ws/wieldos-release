import { d as db } from './db.js-BcppfB2j.js';
import { readFileSync, rmSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { tmpdir } from 'node:os';

//#region src/lib/server/db/backup.js
var DB_PATH = process.env.DATABASE_PATH ?? join(process.cwd(), "data", "dashboard.db");
var SQLITE_HEADER = "SQLite format 3\0";
/** Double-quote a SQL identifier (table/column). Safe for interpolation. */
function quoteIdent(name) {
	return `"${String(name).replace(/"/g, "\"\"")}"`;
}
/** Single-quote a SQL string literal (used for the VACUUM INTO path). */
function quoteLiteral(value) {
	return `'${String(value).replace(/'/g, "''")}'`;
}
/** Compact filename timestamp, e.g. 20260630-2037. */
function backupStamp(date = /* @__PURE__ */ new Date()) {
	const p = (n) => String(n).padStart(2, "0");
	return `${date.getFullYear()}${p(date.getMonth() + 1)}${p(date.getDate())}-${p(date.getHours())}${p(date.getMinutes())}`;
}
/** User table names (excludes SQLite internal tables), from a given handle. */
function userTables(database = db) {
	return database.prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name`).all().map((r) => r.name);
}
/** Actual column names of a table on a given handle. */
function tableColumns(database, table) {
	return database.prepare(`PRAGMA table_info(${quoteIdent(table)})`).all().map((c) => c.name);
}
/** Coerce a JS value to something node:sqlite can bind. */
function bindable(value) {
	if (value === void 0 || value === null) return null;
	if (typeof value === "boolean") return value ? 1 : 0;
	if (typeof value === "object" && !(value instanceof Uint8Array)) return JSON.stringify(value);
	return value;
}
/** Database file location, on-disk size, and whether WAL journaling is on. */
function dbInfo() {
	let sizeBytes = 0;
	try {
		sizeBytes = statSync(DB_PATH).size;
	} catch {
		sizeBytes = 0;
	}
	let walMode = false;
	try {
		walMode = String(db.prepare("PRAGMA journal_mode").get()?.journal_mode ?? "").toLowerCase() === "wal";
	} catch {
		walMode = false;
	}
	return {
		path: DB_PATH,
		sizeBytes,
		walMode
	};
}
/** Row count per user table, e.g. { tasks: 12, notes: 4, … }. */
function tableCounts() {
	const counts = {};
	for (const table of userTables()) try {
		counts[table] = db.prepare(`SELECT COUNT(*) AS n FROM ${quoteIdent(table)}`).get()?.n ?? 0;
	} catch {
		counts[table] = 0;
	}
	return counts;
}
/** Portable JSON export: every user table's full row set. */
function exportJson() {
	const tables = {};
	for (const table of userTables()) tables[table] = db.prepare(`SELECT * FROM ${quoteIdent(table)}`).all();
	return {
		app: "wieldos",
		version: 1,
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		tables
	};
}
/** Consistent single-file snapshot of the DB as a Buffer (via VACUUM INTO). */
function snapshotSqlite() {
	const temp = join(tmpdir(), `wieldos-snapshot-${process.pid}-${Date.now()}.sqlite`);
	db.exec(`VACUUM INTO ${quoteLiteral(temp)}`);
	try {
		return {
			buffer: readFileSync(temp),
			filename: `wieldos-backup-${backupStamp()}.sqlite`
		};
	} finally {
		try {
			rmSync(temp, { force: true });
		} catch {}
	}
}
/**
* Replace every recognized table's contents with the provided rows, in one
* transaction with foreign-key checks disabled. Tables/columns not present in
* the live schema are skipped. Returns the resulting table counts.
* @param {Record<string, any[]>} tables
*/
function replaceAll(tables) {
	const live = new Set(userTables());
	const incoming = Object.entries(tables ?? {}).filter(([name]) => live.has(name));
	if (!incoming.length) throw new Error("Backup contains no tables that match this database.");
	db.exec("PRAGMA foreign_keys = OFF");
	db.exec("BEGIN");
	try {
		for (const [name, rows] of incoming) {
			db.exec(`DELETE FROM ${quoteIdent(name)}`);
			if (!Array.isArray(rows) || !rows.length) continue;
			const cols = new Set(tableColumns(db, name));
			for (const row of rows) {
				const keys = Object.keys(row ?? {}).filter((k) => cols.has(k));
				if (!keys.length) continue;
				const sql = `INSERT INTO ${quoteIdent(name)} (${keys.map(quoteIdent).join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`;
				db.prepare(sql).run(...keys.map((k) => bindable(row[k])));
			}
		}
		db.exec("COMMIT");
	} catch (err) {
		db.exec("ROLLBACK");
		throw err;
	} finally {
		db.exec("PRAGMA foreign_keys = ON");
	}
	return tableCounts();
}
/** Restore from a JSON export string (replace-all). Returns resulting counts. */
function importJson(text) {
	let doc;
	try {
		doc = JSON.parse(text);
	} catch {
		throw new Error("File is not valid JSON.");
	}
	if (!doc || typeof doc !== "object" || !doc.tables || typeof doc.tables !== "object") throw new Error("Not a WieldOS JSON backup (missing \"tables\").");
	return replaceAll(doc.tables);
}
/** Restore from an uploaded .sqlite file buffer (replace-all). Returns counts. */
function importSqliteBuffer(buffer) {
	if (!buffer || buffer.length < 16 || buffer.subarray(0, 16).toString("latin1") !== SQLITE_HEADER) throw new Error("File is not a SQLite database.");
	const temp = join(tmpdir(), `wieldos-restore-${process.pid}-${Date.now()}.sqlite`);
	writeFileSync(temp, buffer);
	let source = null;
	try {
		source = new DatabaseSync(temp, { readOnly: true });
		const tables = {};
		for (const name of userTables(source)) tables[name] = source.prepare(`SELECT * FROM ${quoteIdent(name)}`).all();
		return replaceAll(tables);
	} finally {
		try {
			source?.close();
		} catch {}
		try {
			rmSync(temp, { force: true });
		} catch {}
	}
}

export { importSqliteBuffer as a, backupStamp as b, dbInfo as d, exportJson as e, importJson as i, snapshotSqlite as s, tableCounts as t };
//# sourceMappingURL=backup.js-D9w40wKZ.js.map
