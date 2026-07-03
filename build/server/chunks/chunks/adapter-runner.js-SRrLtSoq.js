import { O as txHash, P as address, Q as handle, t as toStrArray, R as clip, s as str, S as viem_exports, T as telegram_exports, U as sourcify_exports, V as dexscreener_exports, W as twitterapi_exports, X as xapi_exports, Y as httpJson, Z as assertPublicHttpUrl } from './viem.js-Dnkpuzyj.js';

//#region src/lib/server/providers/record.js
function remember(record = {}, shape = {}) {
	const names = Array.isArray(shape.fields) ? shape.fields : Object.keys(shape.fields ?? {});
	const metadata = {};
	for (const name of names) {
		const value = record[name];
		if (value !== void 0) metadata[name] = value;
	}
	const id = record[shape.id || "id"];
	return {
		id: id == null ? "" : String(id),
		recordType: shape.type || "item",
		metadata,
		raw: record,
		capturedAt: shape.capturedAt ? isoOrNull(record[shape.capturedAt]) : null
	};
}
/** ISO string for a date-ish value, or null when unparseable (orders by ingest). */
function isoOrNull(value) {
	const d = new Date(value);
	return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
/** True when numeric-string id `a` is newer (greater) than `b`. Used by id watermarks. */
function isNewerNumericId(a, b) {
	try {
		return BigInt(a) > BigInt(b || "0");
	} catch {
		return false;
	}
}
/**
* Generic newest-id watermark.
* @param {Array} items Source items (any shape).
* @param {string} cursor Prior high-water mark ('' on first run).
* @param {object} ops
* @param {(item:any)=>string} ops.id Extract the comparable id from an item.
* @param {(item:any)=>object} ops.build Map a fresh item to a NormalizedRecord.
* @param {(a:string,b:string)=>boolean} [ops.isNewer] Comparator (default numeric id).
* @returns {{ records: object[], cursor: string }}
*/
function watermark(items, cursor, { id, build, isNewer = isNewerNumericId }) {
	if (!items.length) return {
		records: [],
		cursor
	};
	const newest = items.reduce((m, it) => isNewer(id(it), m) ? id(it) : m, cursor || "0");
	return {
		records: (cursor ? items.filter((it) => isNewer(id(it), cursor)) : items).map(build),
		cursor: newest
	};
}
//#endregion
//#region src/lib/server/providers/ingest.js
/**
* @param {object} opts
* @param {(record:object)=>boolean} opts.collect Runner sink; false ⇒ stop.
* @param {string} [opts.cursor] Prior cursor for this collector.
* @param {'newest-id'|'paginate'|'snapshot'} [opts.mode]
* @param {(cursor:string)=>Promise<any>} opts.fetchPage Fetch one source page.
* @param {(page:any)=>any[]} [opts.items] Extract the item array from a page.
* @param {(page:any)=>{nextCursor?:string,hasNext?:boolean}} [opts.paging] For 'paginate'.
* @param {object} [opts.shape] Record shape; items map through remember(item, shape).
* @param {(item:any)=>string} [opts.id] Id accessor for 'newest-id' (defaults to the shape's id field).
* @param {(item:any)=>object} [opts.build] Custom item → NormalizedRecord mapper (overrides shape).
* @returns {Promise<{cursor?:string}>} The collector's next cursor.
*/
async function ingest({ collect, cursor = "", mode = "newest-id", fetchPage, items = (page) => page, paging = () => ({}), shape, id, build }) {
	if (!build && !shape) throw new Error("ingest needs a shape or a build(item) mapper.");
	const toRecord = build ?? ((item) => remember(item, shape));
	const idOf = id ?? ((item) => String(item?.[shape?.id ?? "id"] ?? ""));
	const page = await fetchPage(mode === "paginate" ? cursor : "");
	const list = items(page) ?? [];
	if (mode === "snapshot") {
		for (const it of list) if (collect(toRecord(it)) === false) break;
		return {};
	}
	if (mode === "paginate") {
		for (const it of list) if (collect(toRecord(it)) === false) break;
		const { nextCursor, hasNext } = paging(page);
		return { cursor: hasNext && nextCursor ? nextCursor : "" };
	}
	const { records, cursor: next } = watermark(list, cursor, {
		id: idOf,
		build: toRecord
	});
	for (const s of records) if (collect(s) === false) break;
	return { cursor: next };
}
//#endregion
//#region src/lib/server/providers/adapter-runner.js
var CLIENTS = {
	xapi: xapi_exports,
	twitterapi: twitterapi_exports,
	dexscreener: dexscreener_exports,
	sourcify: sourcify_exports,
	telegram: telegram_exports,
	viem: viem_exports
};
var MAX_LOG_LINES = 50;
var AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;
/** Compile a stored adapter script into an async function. Throws on syntax errors. */
function compileScript(script) {
	return new AsyncFunction("ctx", String(script ?? ""));
}
/**
* Run one adapter against one instance. The caller (collector.js) owns
* persistence: it supplies `collect` and stores the returned cursor. Throws on
* script/compile/runtime errors — the caller maps those onto the collector row.
*/
async function runAdapter(adapter, { instance, credentials = {}, input = {}, cursor = "", collect }) {
	if (!String(adapter?.script ?? "").trim()) throw new Error(`Adapter ${adapter?.type ?? "(unknown)"} has no script.`);
	const fn = compileScript(adapter.script);
	const logs = [];
	return {
		cursor: (await fn({
			input: input ?? {},
			cursor: cursor ?? "",
			config: instance?.config ?? {},
			credentials: credentials ?? {},
			clients: CLIENTS,
			http: (url, options = {}) => httpJson(assertPublicHttpUrl(url), options),
			save: (item, shape) => collect(remember(item, shape)),
			collect,
			ingest: (options) => ingest({
				collect,
				cursor: cursor ?? "",
				...options
			}),
			remember,
			lib: {
				str,
				clip,
				toStrArray,
				handle,
				address,
				txHash,
				isoOrNull,
				watermark,
				isNewerNumericId
			},
			log(msg) {
				if (logs.length < MAX_LOG_LINES) logs.push(String(msg));
			}
		}) ?? {}).cursor,
		logs
	};
}

export { compileScript as c, runAdapter as r };
//# sourceMappingURL=adapter-runner.js-SRrLtSoq.js.map
