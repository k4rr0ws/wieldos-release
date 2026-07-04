import { a as listProjectOptions } from '../../../chunks/projects.js-Bx7Ibrtr.js';
import { d as deleteNote, a as togglePin, u as updateNote, c as createNote, l as listNotes } from '../../../chunks/notes.js-DRMbxsWP.js';
import { A as fail } from '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/notes/+page.server.js
function load() {
	return {
		notes: listNotes(),
		projects: listProjectOptions()
	};
}
var actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const title = String(data.get("title") ?? "").trim();
		const content = String(data.get("content") ?? "").trim();
		const tags = String(data.get("tags") ?? "");
		if (!title) return fail(400, {
			message: "A title is required.",
			values: {
				title,
				content
			}
		});
		createNote({
			title,
			content,
			tags,
			projectId: data.get("projectId") ? Number(data.get("projectId")) : null
		});
		return { success: true };
	},
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
		return { success: true };
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-DH-ijlTA.js.map
