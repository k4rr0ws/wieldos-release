import { d as deleteInstance, u as updateInstance, e as createInstance, h as listInstances } from '../../../chunks/instances.js-DLoGySTX.js';
import { A as fail } from '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/instances/+page.server.js
function load() {
	return { instances: listInstances() };
}
function collectPairs(data, prefix) {
	const keys = data.getAll(`${prefix}Key`);
	const values = data.getAll(`${prefix}Value`);
	const out = {};
	keys.forEach((raw, i) => {
		const key = String(raw ?? "").trim();
		const value = String(values[i] ?? "").trim();
		if (key && value) out[key] = value;
	});
	return out;
}
var actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get("name") ?? "").trim();
		const type = String(data.get("type") ?? "").trim();
		if (!name) return fail(400, { message: "A name is required." });
		if (!type) return fail(400, { message: "A provider type is required." });
		createInstance({
			name,
			type,
			config: collectPairs(data, "config"),
			credentials: collectPairs(data, "cred")
		});
		return { success: true };
	},
	update: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing instance id." });
		const patch = {
			config: collectPairs(data, "config"),
			credentials: collectPairs(data, "cred")
		};
		const type = String(data.get("type") ?? "").trim();
		if (type) patch.type = type;
		if (data.get("name") != null) patch.name = String(data.get("name")).trim();
		if (data.get("status") != null) patch.status = String(data.get("status"));
		updateInstance(id, patch);
		return { success: true };
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing instance id." });
		deleteInstance(id);
		return { success: true };
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-BiAxB5jn.js.map
