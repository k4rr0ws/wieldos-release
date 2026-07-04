import { I as getDispatchByDispatchId } from '../../../../chunks/agents.js-xaDulNxk.js';
import { l as listProjects } from '../../../../chunks/projects.js-Bx7Ibrtr.js';
import { d as deleteDeliverable, g as getDeliverable, b as DELIVERABLE_STATUSES, D as DELIVERABLE_TYPES } from '../../../../chunks/deliverables.js-CigY-aU9.js';
import { s as statusAction, u as updateAction } from '../../../../chunks/deliverable-actions.js-DmOnLiAh.js';
import { A as fail, z as redirect, x as error } from '../../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/deliverables/[id]/+page.server.js
function load({ params }) {
	const id = Number(params.id);
	const deliverable = id ? getDeliverable(id) : null;
	if (!deliverable) throw error(404, "Deliverable not found");
	return {
		deliverable,
		sourceRun: deliverable.sourceDispatchId ? getDispatchByDispatchId(deliverable.sourceDispatchId) ?? null : null,
		projects: listProjects(),
		types: DELIVERABLE_TYPES,
		statuses: DELIVERABLE_STATUSES
	};
}
var actions = {
	update: ({ request }) => updateAction(request),
	setStatus: ({ request }) => statusAction(request),
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing deliverable id." });
		deleteDeliverable(id);
		throw redirect(303, "/deliverables");
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-Br3D9XdG.js.map
