import { a as listProjectOptions } from '../../../../chunks/projects.js-BVUHOwgk.js';
import { d as deleteNote, a as togglePin, u as updateNote, g as getNote } from '../../../../chunks/notes.js-BAFtkvVL.js';
import { A as fail, z as redirect, x as error } from '../../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/notes/[id]/+page.server.js
function load({ params }) {
	const id = Number(params.id);
	const note = id ? getNote(id) : null;
	if (!note) throw error(404, "Note not found");
	return {
		note,
		projects: listProjectOptions()
	};
}
var actions = {
	update: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing note id." });
		updateNote(id, {
			title: data.get("title") ? String(data.get("title")).trim() : void 0,
			content: data.get("content") != null ? String(data.get("content")) : void 0,
			tags: data.get("tags") != null ? String(data.get("tags")) : void 0,
			projectId: data.has("projectId") ? data.get("projectId") ? Number(data.get("projectId")) : null : void 0
		});
		return { success: true };
	},
	togglePin: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing note id." });
		togglePin(id);
		return { success: true };
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing note id." });
		deleteNote(id);
		throw redirect(303, "/notes");
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-jumNwLcg.js.map
