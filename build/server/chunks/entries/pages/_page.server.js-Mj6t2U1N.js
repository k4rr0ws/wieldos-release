import { l as localDateString, s as startOfToday } from '../../chunks/datetime.js-DS-g6TQJ.js';
import { t as toggleTaskOccurrence, a as taskStats, b as listTasksDueBy, d as bestStreak } from '../../chunks/tasks.js-Bci1Un8l.js';
import { p as projectStats, l as listProjects } from '../../chunks/projects.js-BVUHOwgk.js';
import { r as recentNotes, n as notesSince } from '../../chunks/notes.js-BAFtkvVL.js';
import { l as listEventsBetween, a as listUpcoming } from '../../chunks/events.js-DfgN28oW.js';
import { A as fail } from '../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/+page.server.js
function load() {
	const today = localDateString();
	const startToday = startOfToday();
	const startTomorrow = new Date(startToday);
	startTomorrow.setDate(startTomorrow.getDate() + 1);
	const weekAgo = /* @__PURE__ */ new Date();
	weekAgo.setDate(weekAgo.getDate() - 7);
	const weekAgoStamp = `${weekAgo.toISOString().slice(0, 10)} 00:00:00`;
	const tStats = taskStats(today);
	const pStats = projectStats();
	const todaysEvents = listEventsBetween(startToday.toISOString(), startTomorrow.toISOString());
	const upcoming = listUpcoming((/* @__PURE__ */ new Date()).toISOString(), 1);
	return {
		stats: {
			tasksDueToday: tStats.dueToday ?? 0,
			tasksOverdue: tStats.overdue ?? 0,
			activeProjects: pStats.active ?? 0,
			totalProjects: pStats.total ?? 0,
			notesThisWeek: notesSince(weekAgoStamp),
			eventsToday: todaysEvents.length,
			nextEvent: upcoming[0] ?? null,
			bestStreak: bestStreak()
		},
		dueTasks: listTasksDueBy(today),
		projects: listProjects().slice(0, 3),
		schedule: todaysEvents,
		notes: recentNotes(3)
	};
}
var actions = { toggleTask: async ({ request }) => {
	const data = await request.formData();
	const id = Number(data.get("id"));
	if (!id) return fail(400, { message: "Missing task id" });
	toggleTaskOccurrence(id);
	return { success: true };
} };

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-Mj6t2U1N.js.map
