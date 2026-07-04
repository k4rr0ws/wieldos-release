import { i as compileScript, r as runAdapter, j as deleteAdapter, k as getAdapter, g as getAdapterByType, u as updateAdapter, m as createAdapter, l as listAdapters } from '../../../chunks/adapter-runner.js-Dsa3ucuC.js';
import { c as getInstance, b as getInstanceCredentials, l as listInstances } from '../../../chunks/instances.js-BWUEcufp.js';
import { A as fail } from '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/adapters/+page.server.js
function load() {
	return {
		adapters: listAdapters(),
		instances: listInstances()
	};
}
var TYPE_RE = /^[a-z0-9_]+$/;
function readFields(data) {
	return {
		type: String(data.get("type") ?? "").trim(),
		label: String(data.get("label") ?? "").trim(),
		provider: String(data.get("provider") ?? "").trim(),
		description: String(data.get("description") ?? "").trim(),
		inputHint: String(data.get("inputHint") ?? "").trim(),
		defaultRecordType: String(data.get("defaultRecordType") ?? "").trim() || "item",
		script: String(data.get("script") ?? ""),
		toolEnabled: data.get("toolEnabled") === "1" ? 1 : 0
	};
}
function validate(fields) {
	if (!fields.type) return "A type is required.";
	if (!TYPE_RE.test(fields.type)) return "Type must be lowercase letters, digits, and underscores.";
	if (!fields.label) return "A label is required.";
	if (!String(fields.script).trim()) return "A script is required.";
	try {
		compileScript(fields.script);
	} catch (err) {
		return `Script error: ${err?.message ?? err}`;
	}
	return null;
}
var actions = {
	create: async ({ request }) => {
		const fields = readFields(await request.formData());
		const message = validate(fields);
		if (message) return fail(400, { message });
		if (getAdapterByType(fields.type)) return fail(400, { message: `Adapter "${fields.type}" already exists.` });
		createAdapter(fields);
		return { success: true };
	},
	update: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id || !getAdapter(id)) return fail(400, { message: "Missing adapter id." });
		const fields = readFields(data);
		const message = validate(fields);
		if (message) return fail(400, { message });
		const clash = getAdapterByType(fields.type);
		if (clash && clash.id !== id) return fail(400, { message: `Adapter "${fields.type}" already exists.` });
		updateAdapter(id, fields);
		return { success: true };
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing adapter id." });
		deleteAdapter(id);
		return { success: true };
	},
	test: async ({ request }) => {
		const data = await request.formData();
		const script = String(data.get("script") ?? "");
		const testInput = String(data.get("testInput") ?? "{}").trim() || "{}";
		const instanceId = Number(data.get("instanceId") ?? 0);
		if (!script.trim()) return fail(400, { testError: "Script is empty." });
		try {
			compileScript(script);
		} catch (err) {
			return fail(400, { testError: `Syntax error: ${err?.message ?? err}` });
		}
		let input = {};
		try {
			input = JSON.parse(testInput);
		} catch {
			return fail(400, { testError: "Test input must be valid JSON." });
		}
		let instance = null;
		let credentials = {};
		if (instanceId) {
			instance = getInstance(instanceId);
			if (instance) credentials = getInstanceCredentials(instanceId);
		}
		const records = [];
		let testError = null;
		let logs = [];
		let result = null;
		try {
			const out = await runAdapter({
				script,
				type: "_test",
				defaultRecordType: "item"
			}, {
				instance: instance ?? { config: {} },
				credentials,
				input,
				cursor: "",
				mode: "fetch",
				collect: (r) => {
					if (r) records.push(r);
					return records.length < 50;
				}
			});
			logs = out.logs ?? [];
			result = out.result ?? null;
		} catch (err) {
			testError = err?.message ?? String(err);
		}
		return { testResult: {
			logs,
			records: records.length,
			result,
			error: testError
		} };
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-CQRvxKEL.js.map
