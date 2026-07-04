import { d as listInstanceOptions } from '../../../chunks/instances.js-BWUEcufp.js';
import { e as countRecordsMatching, l as listRecordTypes } from '../../../chunks/records.js-CB6fc5uw.js';
import { D as DELIVERABLE_TYPES } from '../../../chunks/deliverables.js-CigY-aU9.js';
import { d as deleteReport, m as materializeReport, g as getReport, r as runReport, u as updateReport, c as createReport, a as listReports, b as countPinnedReports } from '../../../chunks/reports.js-bi6hjnds.js';
import { A as fail } from '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/reports/+page.server.js
function load() {
	const reports = listReports().map((r) => r.pinned ? {
		...r,
		matchCount: countRecordsMatching(r.filter)
	} : r);
	return {
		reports,
		pinnedCount: reports.filter((r) => r.pinned).length,
		pinLimit: 3,
		types: listRecordTypes(),
		instances: listInstanceOptions(),
		deliverableTypes: DELIVERABLE_TYPES
	};
}
function pinLimitReached(excludeId = null) {
	return countPinnedReports(excludeId) >= 3;
}
function stripTrailingCommas(s) {
	let out = "";
	let inString = false;
	let escaped = false;
	for (let i = 0; i < s.length; i++) {
		const ch = s[i];
		if (inString) {
			out += ch;
			if (escaped) escaped = false;
			else if (ch === "\\") escaped = true;
			else if (ch === "\"") inString = false;
			continue;
		}
		if (ch === "\"") inString = true;
		else if (ch === ",") {
			let j = i + 1;
			while (j < s.length && /\s/.test(s[j])) j++;
			if (s[j] === "}" || s[j] === "]") continue;
		}
		out += ch;
	}
	return out;
}
function parseFilter(raw) {
	const s = String(raw ?? "").trim();
	if (!s) return {};
	const value = JSON.parse(stripTrailingCommas(s));
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("must be a JSON object, e.g. { \"recordType\": \"tweet\", \"since\": \"24h\" }");
	return value;
}
var actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get("name") ?? "").trim();
		if (!name) return fail(400, { message: "A name is required." });
		let filter;
		try {
			filter = parseFilter(data.get("filter"));
		} catch (err) {
			return fail(400, { message: `Invalid filter: ${err.message}` });
		}
		const pinned = data.get("pinned") === "on" || data.get("pinned") === "true";
		if (pinned && pinLimitReached()) return fail(400, { message: `Only 3 reports can be pinned to agent context.` });
		createReport({
			name,
			description: String(data.get("description") ?? "").trim(),
			filter,
			pinned
		});
		return { success: true };
	},
	update: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing report id." });
		const patch = {};
		if (data.get("name") != null) patch.name = String(data.get("name")).trim();
		if (data.get("description") != null) patch.description = String(data.get("description")).trim();
		if (data.get("filter") != null) try {
			patch.filter = parseFilter(data.get("filter"));
		} catch (err) {
			return fail(400, { message: `Invalid filter: ${err.message}` });
		}
		patch.pinned = data.get("pinned") === "on" || data.get("pinned") === "true";
		if (patch.pinned && pinLimitReached(id)) return fail(400, { message: `Only 3 reports can be pinned to agent context.` });
		updateReport(id, patch);
		return { success: true };
	},
	pin: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing report id." });
		const pinned = data.get("pinned") === "true";
		if (pinned && pinLimitReached(id)) return fail(400, { message: `Only 3 reports can be pinned to agent context.` });
		updateReport(id, { pinned });
		return { success: true };
	},
	run: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!(id ? getReport(id) : null)) return fail(404, { message: "Report not found." });
		const rows = runReport(id);
		const records = rows.map((r) => ({
			id: r.id,
			recordType: r.recordType,
			instanceName: r.instanceName,
			capturedAt: r.capturedAt,
			createdAt: r.createdAt,
			metadata: r.metadata
		}));
		return {
			success: true,
			preview: {
				id,
				count: rows.length,
				records
			}
		};
	},
	materialize: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing report id." });
		const deliverable = materializeReport(id, { type: String(data.get("type") ?? "reference") });
		if (!deliverable) return fail(404, { message: "Report not found." });
		return {
			success: true,
			materialized: {
				id,
				deliverableId: deliverable.id,
				type: deliverable.type
			}
		};
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing report id." });
		deleteReport(id);
		return { success: true };
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-58lwp0di.js.map
