import { J as listPendingDispatches, w as denyDispatch } from '../../../chunks/agents.js-DSCIW6gH.js';
import { a as commitDispatch } from '../../../chunks/agent-runtime.js-CBlullnv.js';
import { A as fail } from '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/inbox/+page.server.js
function load() {
	const pending = listPendingDispatches(50);
	return {
		pending,
		stagedTotal: pending.reduce((n, d) => n + d.stagedCount, 0)
	};
}
var actions = {
	approve: async ({ request }) => {
		const data = await request.formData();
		const agentId = Number(data.get("agentId"));
		if (!agentId) return fail(400, { dispatch: { error: "Missing agent id." } });
		let actions;
		try {
			actions = JSON.parse(String(data.get("actions") ?? "[]"));
		} catch {
			actions = null;
		}
		if (!Array.isArray(actions) || actions.length === 0) return fail(400, { dispatch: { error: "There were no actions to run." } });
		const objective = String(data.get("objective") ?? "").trim();
		const dispatchId = String(data.get("dispatchId") ?? "").trim();
		const { added, failed, duplicate } = await commitDispatch(agentId, {
			actions,
			objective,
			dispatchId
		});
		return { dispatch: {
			added,
			failed,
			duplicate
		} };
	},
	deny: async ({ request }) => {
		const data = await request.formData();
		const agentId = Number(data.get("agentId"));
		const id = Number(data.get("id"));
		if (!agentId || !id) return fail(400, { message: "Missing run id." });
		denyDispatch(agentId, id);
		return { success: true };
	},
	approveAll: async () => {
		const pending = listPendingDispatches(200);
		let runs = 0;
		let added = 0;
		const failed = [];
		for (const d of pending) {
			if (!d.staged.length) continue;
			try {
				const r = await commitDispatch(d.agentId, {
					actions: d.staged,
					objective: d.objective,
					dispatchId: d.dispatchId
				});
				runs++;
				added += r.added;
				if (r.failed?.length) failed.push(...r.failed);
			} catch (err) {
				failed.push({
					summary: `${d.agentName ?? "Agent"} run`,
					error: err.message
				});
			}
		}
		return { bulk: {
			runs,
			added,
			failed: failed.length ? failed : void 0
		} };
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-C89fbbzn.js.map
