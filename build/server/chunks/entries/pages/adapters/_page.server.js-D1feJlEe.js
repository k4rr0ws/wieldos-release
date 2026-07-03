import { _ as deleteAdapter, $ as getAdapter, g as getAdapterByType, a0 as updateAdapter, a1 as createAdapter, l as listAdapters } from '../../../chunks/viem.js-Dnkpuzyj.js';
import { c as compileScript } from '../../../chunks/adapter-runner.js-SRrLtSoq.js';
import { A as fail } from '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/adapters/+page.server.js
function load() {
	return { adapters: listAdapters() };
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
		script: String(data.get("script") ?? "")
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
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-D1feJlEe.js.map
