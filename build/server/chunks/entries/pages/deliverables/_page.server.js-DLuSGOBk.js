import { l as listProjects } from '../../../chunks/projects.js-BVUHOwgk.js';
import { d as deleteDeliverable, b as DELIVERABLE_STATUSES, D as DELIVERABLE_TYPES, a as listDeliverables } from '../../../chunks/deliverables.js-f4a3J5Ph.js';
import { s as statusAction, u as updateAction } from '../../../chunks/deliverable-actions.js-Drmpi2q5.js';
import { A as fail } from '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/deliverables/+page.server.js
function load() {
	return {
		deliverables: listDeliverables(),
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
		return { success: true };
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-DLuSGOBk.js.map
