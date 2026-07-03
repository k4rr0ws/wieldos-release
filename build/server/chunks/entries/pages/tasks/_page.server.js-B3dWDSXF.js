import { f as deleteTask, u as updateTask, t as toggleTaskOccurrence, c as createTask, l as listTasks } from '../../../chunks/tasks.js-Bci1Un8l.js';
import { a as listProjectOptions } from '../../../chunks/projects.js-BVUHOwgk.js';
import { A as fail } from '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/tasks/+page.server.js
var PRIORITIES = [
	"low",
	"medium",
	"high"
];
var RECURRENCES = [
	"none",
	"daily",
	"weekdays",
	"weekly"
];
function recurrenceFrom(data) {
	const recurrence = String(data.get("recurrence") ?? "none");
	const recurrenceDays = data.getAll("days").map((d) => Number(d));
	return {
		recurrence: RECURRENCES.includes(recurrence) ? recurrence : "none",
		recurrenceDays
	};
}
function load() {
	return {
		tasks: listTasks(),
		projects: listProjectOptions()
	};
}
var actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const title = String(data.get("title") ?? "").trim();
		const priority = String(data.get("priority") ?? "medium");
		const dueDate = String(data.get("dueDate") ?? "").trim();
		const projectId = data.get("projectId") ? Number(data.get("projectId")) : null;
		const { recurrence, recurrenceDays } = recurrenceFrom(data);
		if (!title) return fail(400, {
			message: "A title is required.",
			values: {
				title,
				priority,
				dueDate
			}
		});
		createTask({
			title,
			priority: PRIORITIES.includes(priority) ? priority : "medium",
			dueDate: dueDate || null,
			projectId,
			recurrence,
			recurrenceDays
		});
		return { success: true };
	},
	toggle: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing task id." });
		toggleTaskOccurrence(id);
		return { success: true };
	},
	update: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing task id." });
		const { recurrence, recurrenceDays } = recurrenceFrom(data);
		updateTask(id, {
			title: data.get("title") ? String(data.get("title")).trim() : void 0,
			priority: data.get("priority") ? String(data.get("priority")) : void 0,
			dueDate: String(data.get("dueDate") ?? "").trim() || null,
			projectId: data.get("projectId") ? Number(data.get("projectId")) : null,
			recurrence,
			recurrenceDays
		});
		return { success: true };
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing task id." });
		deleteTask(id);
		return { success: true };
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-B3dWDSXF.js.map
