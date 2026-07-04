import { s as startOfToday } from '../../../chunks/datetime.js-DS-g6TQJ.js';
import { d as deleteEvent, c as createEvent, u as updateEvent, a as listUpcoming } from '../../../chunks/events.js-DkEVwPVI.js';
import { A as fail } from '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/schedule/+page.server.js
var CATEGORIES = [
	"work",
	"personal",
	"health",
	"growth"
];
function toIso(date, time) {
	if (!date || !time) return null;
	const d = /* @__PURE__ */ new Date(`${date}T${time}`);
	return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
function load() {
	return { events: listUpcoming(startOfToday().toISOString(), 100) };
}
var actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const title = String(data.get("title") ?? "").trim();
		const category = String(data.get("category") ?? "personal");
		const date = String(data.get("date") ?? "").trim();
		const startTime = toIso(date, String(data.get("startTime") ?? "").trim());
		const endTime = toIso(date, String(data.get("endTime") ?? "").trim());
		if (!title) return fail(400, { message: "A title is required." });
		if (!startTime) return fail(400, { message: "A date and start time are required." });
		createEvent({
			title,
			category: CATEGORIES.includes(category) ? category : "personal",
			startTime,
			endTime
		});
		return { success: true };
	},
	update: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing event id." });
		const date = String(data.get("date") ?? "").trim();
		updateEvent(id, {
			title: data.get("title") ? String(data.get("title")).trim() : void 0,
			category: data.get("category") ? String(data.get("category")) : void 0,
			startTime: toIso(date, String(data.get("startTime") ?? "").trim()) ?? void 0,
			endTime: toIso(date, String(data.get("endTime") ?? "").trim())
		});
		return { success: true };
	},
	createBatch: async ({ request }) => {
		const data = await request.formData();
		const date = String(data.get("date") ?? "").trim();
		if (!date) return fail(400, { message: "A date is required." });
		let events;
		try {
			events = JSON.parse(String(data.get("events") ?? "[]"));
		} catch {
			return fail(400, { message: "Invalid template data." });
		}
		for (const e of events) {
			const startTime = toIso(date, e.startTime);
			const endTime = e.endTime ? toIso(date, e.endTime) : null;
			if (!startTime) continue;
			createEvent({
				title: e.title,
				category: CATEGORIES.includes(e.category) ? e.category : "personal",
				startTime,
				endTime
			});
		}
		return { success: true };
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing event id." });
		deleteEvent(id);
		return { success: true };
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-DHB8MIS-.js.map
