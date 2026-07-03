import { d as deleteAvatar, s as saveAvatar } from '../../../chunks/uploads.js-qd8H1eFO.js';
import { g as getAgent, t as deleteAgent, u as updateAgent, a as createAgent, b as listAgents } from '../../../chunks/agents.js-DSCIW6gH.js';
import { r as readAgentFields, a as resolveAvatarUpdate } from '../../../chunks/agent-form.js-CfQt9OwA.js';
import { b as TOOL_CATALOG } from '../../../chunks/tools.js-C1CBPtEY.js';
import { A as fail, z as redirect } from '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/agents/+page.server.js
function load() {
	return {
		agents: listAgents(),
		toolCatalog: TOOL_CATALOG
	};
}
var actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const fields = readAgentFields(data);
		if (!fields.name) return fail(400, {
			message: "A name is required.",
			values: fields
		});
		let uploaded;
		try {
			uploaded = await saveAvatar(data.get("avatarFile"));
		} catch (err) {
			return fail(400, {
				message: err.message,
				values: fields
			});
		}
		if (uploaded) fields.avatar = uploaded;
		throw redirect(303, `/agents/${createAgent(fields).id}`);
	},
	update: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing agent id." });
		const fields = readAgentFields(data);
		if (!fields.name) return fail(400, {
			message: "A name is required.",
			values: fields
		});
		try {
			await resolveAvatarUpdate(data, fields);
		} catch (err) {
			return fail(400, {
				message: err.message,
				values: fields
			});
		}
		updateAgent(id, fields);
		return { success: true };
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing agent id." });
		const agent = getAgent(id);
		if (deleteAgent(id) && agent) deleteAvatar(agent.avatar);
		return { success: true };
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-h_Kuwnbv.js.map
