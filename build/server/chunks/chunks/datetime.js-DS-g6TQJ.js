//#region src/lib/datetime.js
/** Local date as YYYY-MM-DD (used for due-date comparisons). */
function localDateString(date = /* @__PURE__ */ new Date()) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
/** Start of today as a local Date. */
function startOfToday() {
	const d = /* @__PURE__ */ new Date();
	d.setHours(0, 0, 0, 0);
	return d;
}
/** Human label for a YYYY-MM-DD due date relative to today. */
function formatDueDate(dateStr) {
	if (!dateStr) return "";
	if (dateStr === localDateString()) return "Today";
	const target = /* @__PURE__ */ new Date(`${dateStr}T00:00:00`);
	const base = startOfToday();
	const diffDays = Math.round((target - base) / 864e5);
	if (diffDays === 1) return "Tomorrow";
	if (diffDays === -1) return "Yesterday";
	if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
	return target.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric"
	});
}
function isOverdue(dateStr) {
	if (!dateStr) return false;
	return dateStr < localDateString();
}
/** "2:00 PM" from an ISO timestamp. */
function formatTime(iso) {
	if (!iso) return "";
	return new Date(iso).toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit"
	});
}
/** "Mon, Jun 23" from an ISO timestamp. */
function formatDay(iso) {
	if (!iso) return "";
	return new Date(iso).toLocaleDateString("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric"
	});
}
/** Relative "edited" label for notes, e.g. "2h ago". */
function formatRelative(iso) {
	if (!iso) return "";
	const normalized = iso.includes("T") ? iso : `${iso.replace(" ", "T")}Z`;
	const then = new Date(normalized).getTime();
	const diff = Date.now() - then;
	const mins = Math.round(diff / 6e4);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hours = Math.round(mins / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.round(hours / 24);
	if (days < 7) return `${days}d ago`;
	return new Date(normalized).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric"
	});
}

export { formatDueDate as a, formatRelative as b, formatDay as c, formatTime as f, isOverdue as i, localDateString as l, startOfToday as s };
//# sourceMappingURL=datetime.js-DS-g6TQJ.js.map
