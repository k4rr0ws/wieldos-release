import { d as deleteGoal, t as toggleAchieved, u as updateGoal, c as createGoal, l as listGoals } from '../../../chunks/goals.js-Cf0BF7rV.js';
import { A as fail } from '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/goals/+page.server.js
function load() {
	return { goals: listGoals() };
}
var actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const title = String(data.get("title") ?? "").trim();
		const description = String(data.get("description") ?? "").trim();
		if (!title) return fail(400, {
			message: "A title is required.",
			values: {
				title,
				description
			}
		});
		createGoal({
			title,
			description
		});
		return { success: true };
	},
	update: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing goal id." });
		updateGoal(id, {
			title: data.get("title") ? String(data.get("title")).trim() : void 0,
			description: data.get("description") != null ? String(data.get("description")) : void 0
		});
		return { success: true };
	},
	toggleAchieved: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing goal id." });
		toggleAchieved(id);
		return { success: true };
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing goal id." });
		deleteGoal(id);
		return { success: true };
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-Com0OZFW.js.map
