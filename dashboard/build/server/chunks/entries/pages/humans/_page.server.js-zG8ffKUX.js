import { d as deleteHuman, u as updateHuman, c as createHuman, l as listHumans } from '../../../chunks/humans.js-RfevdKXI.js';
import { A as fail } from '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/humans/+page.server.js
function fields(data) {
	return {
		username: String(data.get("username") ?? "").trim(),
		tgUsername: String(data.get("tgUsername") ?? "").trim(),
		twitterUsername: String(data.get("twitterUsername") ?? "").trim(),
		phone: String(data.get("phone") ?? "").trim(),
		email: String(data.get("email") ?? "").trim(),
		evmAddress: String(data.get("evmAddress") ?? "").trim(),
		notes: String(data.get("notes") ?? "").trim()
	};
}
function load() {
	return { humans: listHumans() };
}
var actions = {
	create: async ({ request }) => {
		const values = fields(await request.formData());
		if (!values.username) return fail(400, {
			message: "A username is required.",
			values
		});
		createHuman(values);
		return { success: true };
	},
	update: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing person id." });
		const values = fields(data);
		if (!values.username) return fail(400, {
			message: "A username is required.",
			values
		});
		updateHuman(id, values);
		return { success: true };
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing person id." });
		deleteHuman(id);
		return { success: true };
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-zG8ffKUX.js.map
