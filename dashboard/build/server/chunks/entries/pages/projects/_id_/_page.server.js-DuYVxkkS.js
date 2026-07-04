import { e as listTasksForProject } from '../../../../chunks/tasks.js-m2xglkGD.js';
import { d as deleteProject, u as updateProject, g as getProject } from '../../../../chunks/projects.js-Bx7Ibrtr.js';
import { a as listHumanOptions } from '../../../../chunks/humans.js-RfevdKXI.js';
import { a as listDeliverables } from '../../../../chunks/deliverables.js-CigY-aU9.js';
import { A as fail, z as redirect, x as error } from '../../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/projects/[id]/+page.server.js
function load({ params }) {
	const id = Number(params.id);
	const project = id ? getProject(id) : null;
	if (!project) throw error(404, "Project not found");
	return {
		project,
		tasks: listTasksForProject(id),
		deliverables: listDeliverables({ projectId: id }),
		humans: listHumanOptions()
	};
}
var actions = {
	update: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing project id." });
		const paid = data.has("paid");
		updateProject(id, {
			name: data.get("name") ? String(data.get("name")).trim() : void 0,
			description: data.get("description") != null ? String(data.get("description")).trim() : void 0,
			status: data.get("status") ? String(data.get("status")) : void 0,
			color: data.get("color") ? String(data.get("color")) : void 0,
			paid,
			humanId: paid && data.get("humanId") ? Number(data.get("humanId")) : null
		});
		return { success: true };
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing project id." });
		deleteProject(id);
		throw redirect(303, "/projects");
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-DuYVxkkS.js.map
