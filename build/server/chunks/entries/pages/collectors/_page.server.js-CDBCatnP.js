import { b as listAgents } from '../../../chunks/agents.js-DSCIW6gH.js';
import { l as listAdapters } from '../../../chunks/viem.js-Dnkpuzyj.js';
import { l as listInstanceOptions } from '../../../chunks/instances.js-DLoGySTX.js';
import { d as deleteCollector, e as getCollector, u as updateCollector, c as createCollector, f as listCollectors } from '../../../chunks/tools.js-C1CBPtEY.js';
import { l as listGroupSettings, u as upsertSetting } from '../../../chunks/settings.js-CGfdgS1b.js';
import { r as runCollector } from '../../../chunks/collector.js-DQ-r_gt5.js';
import { A as fail } from '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/collectors/+page.server.js
var SETTINGS_GROUP = "Collectors";
function load({ url }) {
	const instanceId = Number(url.searchParams.get("instance")) || null;
	return {
		collectors: listCollectors(instanceId ? { instanceId } : {}),
		instances: listInstanceOptions(),
		defs: listAdapters().map(({ type, label, provider, inputHint }) => ({
			type,
			label,
			provider,
			inputHint
		})),
		agents: listAgents().filter((a) => a.status === "active").map((a) => ({
			id: a.id,
			name: a.name
		})),
		filterInstanceId: instanceId,
		settings: listGroupSettings(SETTINGS_GROUP)
	};
}
function parseInput(raw) {
	const s = String(raw ?? "").trim();
	if (!s) return {};
	return JSON.parse(s);
}
function scheduleFromForm(data) {
	if (String(data.get("scheduleMode") ?? "") !== "scheduled") return null;
	const hours = Number(data.get("everyHours"));
	if (!Number.isFinite(hours) || hours <= 0) return null;
	return Math.min(10080, Math.max(60, Math.round(hours * 60)));
}
var actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const instanceId = Number(data.get("instanceId"));
		const name = String(data.get("name") ?? "").trim();
		const type = String(data.get("type") ?? "").trim();
		if (!instanceId) return fail(400, { message: "Choose an instance." });
		if (!name) return fail(400, { message: "A name is required." });
		if (!type) return fail(400, { message: "Choose an adapter." });
		let input;
		try {
			input = parseInput(data.get("input"));
		} catch {
			return fail(400, { message: "Input must be valid JSON." });
		}
		createCollector({
			instanceId,
			name,
			type,
			input,
			scheduleMinutes: scheduleFromForm(data),
			agentId: data.get("agentId") ? Number(data.get("agentId")) : null
		});
		return { success: true };
	},
	update: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing collector id." });
		const patch = {};
		if (data.get("name") != null) patch.name = String(data.get("name")).trim();
		if (data.get("input") != null) try {
			patch.input = parseInput(data.get("input"));
		} catch {
			return fail(400, { message: "Input must be valid JSON." });
		}
		patch.scheduleMinutes = scheduleFromForm(data);
		patch.agentId = data.get("agentId") ? Number(data.get("agentId")) : null;
		updateCollector(id, patch);
		return { success: true };
	},
	toggle: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing collector id." });
		updateCollector(id, { enabled: data.get("enabled") === "true" });
		return { success: true };
	},
	settings: async ({ request }) => {
		const data = await request.formData();
		const known = new Map(listGroupSettings(SETTINGS_GROUP).map((s) => [s.key, s]));
		for (const [key, value] of data.entries()) {
			const def = known.get(key);
			if (!def) continue;
			if (def.type === "number" && !Number.isFinite(Number(value))) return fail(400, { message: `${def.label} must be a number.` });
			upsertSetting({
				key,
				value: String(value),
				group: SETTINGS_GROUP
			});
		}
		return { success: true };
	},
	run: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		const collector = id ? getCollector(id) : null;
		if (!collector) return fail(404, { message: "Collector not found." });
		const result = await runCollector(collector);
		if (result.error) return fail(502, { message: `Run failed: ${result.error}` });
		return {
			success: true,
			ran: { persisted: result.persisted }
		};
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing collector id." });
		deleteCollector(id);
		return { success: true };
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-CDBCatnP.js.map
