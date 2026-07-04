import { d as deleteGroup, a as deleteSetting, u as upsertSetting, b as listGroups, c as listSettings } from '../../../chunks/settings.js-B6ViW1Gq.js';
import { A as fail } from '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/settings/+page.server.js
function load() {
	return {
		settings: listSettings(),
		groups: listGroups()
	};
}
var actions = {
	upsert: async ({ request }) => {
		const data = await request.formData();
		const key = String(data.get("key") ?? "").trim();
		if (!key) return fail(400, { message: "A key is required." });
		const group = String(data.get("newGroup") ?? "").trim() || String(data.get("group") ?? "").trim();
		if (!upsertSetting({
			key,
			value: String(data.get("value") ?? ""),
			group
		})) return fail(400, { message: "That key is reserved." });
		return { success: true };
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const key = String(data.get("key") ?? "").trim();
		if (!key) return fail(400, { message: "Missing key." });
		deleteSetting(key);
		return { success: true };
	},
	deleteGroup: async ({ request }) => {
		const data = await request.formData();
		const group = String(data.get("group") ?? "").trim();
		if (!group) return fail(400, { message: "Missing group." });
		deleteGroup(group);
		return { success: true };
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-C2QHgLi8.js.map
