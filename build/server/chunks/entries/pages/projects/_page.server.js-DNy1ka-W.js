import { d as deleteProject, u as updateProject, c as createProject, l as listProjects } from '../../../chunks/projects.js-BVUHOwgk.js';
import { a as listHumanOptions } from '../../../chunks/humans.js-CapNfHxi.js';
import { A as fail } from '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/projects/+page.server.js
var STATUSES = [
	"planning",
	"active",
	"on_hold",
	"done"
];
var COLORS = [
	"slate",
	"blue",
	"emerald",
	"amber",
	"rose",
	"violet"
];
function load() {
	return {
		projects: listProjects(),
		humans: listHumanOptions()
	};
}
var actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get("name") ?? "").trim();
		const description = String(data.get("description") ?? "").trim();
		const status = String(data.get("status") ?? "active");
		const color = String(data.get("color") ?? "slate");
		if (!name) return fail(400, {
			message: "A project name is required.",
			values: {
				name,
				description
			}
		});
		const paid = data.has("paid");
		createProject({
			name,
			description,
			status: STATUSES.includes(status) ? status : "active",
			color: COLORS.includes(color) ? color : "slate",
			paid,
			humanId: paid && data.get("humanId") ? Number(data.get("humanId")) : null
		});
		return { success: true };
	},
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
		return { success: true };
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-DNy1ka-W.js.map
