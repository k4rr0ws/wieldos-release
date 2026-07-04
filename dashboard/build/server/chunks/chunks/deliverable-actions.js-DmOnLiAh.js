import { b as DELIVERABLE_STATUSES, s as setDeliverableStatus, u as updateDeliverable } from './deliverables.js-CigY-aU9.js';
import { A as fail } from './utils.js-UusfKV9V.js';

//#region src/lib/server/deliverable-actions.js
async function updateAction(request) {
	const data = await request.formData();
	const id = Number(data.get("id"));
	if (!id) return fail(400, { message: "Missing deliverable id." });
	const title = String(data.get("title") ?? "").trim();
	if (!title) return fail(400, { message: "A title is required." });
	updateDeliverable(id, {
		title,
		body: String(data.get("body") ?? ""),
		type: String(data.get("type") ?? "") || void 0,
		projectId: data.get("projectId") ? Number(data.get("projectId")) : void 0,
		tags: String(data.get("tags") ?? "")
	});
	return { success: true };
}
async function statusAction(request) {
	const data = await request.formData();
	const id = Number(data.get("id"));
	const status = String(data.get("status") ?? "");
	if (!id || !DELIVERABLE_STATUSES.includes(status)) return fail(400, { message: "Invalid status change." });
	setDeliverableStatus(id, status);
	return { success: true };
}

export { statusAction as s, updateAction as u };
//# sourceMappingURL=deliverable-actions.js-DmOnLiAh.js.map
