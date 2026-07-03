import { v as deleteDispatch, w as denyDispatch, c as createAgentTask, x as getPlaybook, y as deleteAgentTask, z as updateAgentTask, A as deletePlaybook, B as updatePlaybook, C as createPlaybook, D as deleteMemory, E as updateMemory, n as createMemory, u as updateAgent, g as getAgent, F as listDispatches, G as listObservations, l as listAgentTasks, d as listPlaybooks, H as listMemories } from '../../../../chunks/agents.js-DSCIW6gH.js';
import { r as readAgentFields, a as resolveAvatarUpdate } from '../../../../chunks/agent-form.js-CfQt9OwA.js';
import { b as TOOL_CATALOG, r as resolveAgentTools, a as gatherContext } from '../../../../chunks/tools.js-C1CBPtEY.js';
import { a as listDeliverables } from '../../../../chunks/deliverables.js-f4a3J5Ph.js';
import { a as commitDispatch, b as chatWithAgent, A as AiError, d as dispatchAgent, o as observeFromRun, D as DISPATCH_INSTRUCTIONS, p as previewAgentContext, h as hasAnthropicKey, r as runAgentTool } from '../../../../chunks/agent-runtime.js-CBlullnv.js';
import { A as fail, x as error } from '../../../../chunks/utils.js-UusfKV9V.js';

//#region src/lib/server/ai/playbook.js
var TASK_PRIORITIES = [
	"low",
	"medium",
	"high"
];
var playbookTool = {
	name: "plan_playbook_tasks",
	description: "Translate the playbook into a concrete, ordered checklist of actionable tasks.",
	input_schema: {
		type: "object",
		properties: { tasks: {
			type: "array",
			description: "Ordered, concrete tasks derived from the playbook steps.",
			items: {
				type: "object",
				properties: {
					title: {
						type: "string",
						description: "Short, action-oriented task title."
					},
					description: {
						type: "string",
						description: "One or two sentences of concrete detail for the task."
					},
					priority: {
						type: "string",
						enum: TASK_PRIORITIES,
						description: "low, medium, or high — reflect sequencing and importance."
					}
				},
				required: ["title"]
			}
		} },
		required: ["tasks"]
	}
};
/**
* Run a playbook "as" its owning agent: a single, sequential expansion of the
* ordered steps into concrete agent tasks. Returns a proposal only — nothing is
* persisted (generate-then-confirm).
*
* @param {{ agentId: number, playbookId: number, focus?: string }} options
* @returns {Promise<Array<{title:string,description:string,priority:string}>>}
*/
async function runPlaybook({ agentId, playbookId, focus = "" }) {
	const playbook = getPlaybook(playbookId);
	if (!playbook || playbook.agentId !== Number(agentId)) throw new AiError("That playbook no longer exists for this agent.");
	const steps = playbook.steps.length ? playbook.steps.map((s, i) => `${i + 1}. ${s}`).join("\n") : "(no steps defined — infer a sensible procedure from the name and description)";
	return normalizeTasks((await runAgentTool(agentId, {
		system: [
			"You are executing one of your own playbooks inside a personal life-management dashboard.",
			"Translate the playbook into a concrete, ordered checklist of tasks the user can act on now.",
			"Guidelines:",
			"- Produce one or more tasks per step; keep them specific and actionable, not abstract restatements of the step.",
			"- Preserve the order of the playbook steps.",
			"- When a focus note is provided, ground every task in it.",
			"- Set priority to reflect sequencing and importance.",
			"Return tasks exclusively through the plan_playbook_tasks tool."
		].join("\n"),
		prompt: [
			`Playbook: ${playbook.name}`,
			playbook.description ? `Purpose: ${playbook.description}` : "",
			"",
			"Steps:",
			steps,
			"",
			focus ? `Focus for this run: ${focus}` : "No extra focus provided; use sensible defaults."
		].filter(Boolean).join("\n"),
		tool: playbookTool
	}))?.tasks);
}
function normalizeTasks(raw) {
	if (!Array.isArray(raw)) return [];
	const out = [];
	for (const t of raw) {
		const title = String(t?.title ?? "").trim();
		if (!title) continue;
		let priority = String(t?.priority ?? "medium").trim();
		if (!TASK_PRIORITIES.includes(priority)) priority = "medium";
		out.push({
			title: title.slice(0, 200),
			description: String(t?.description ?? "").replace(/\s+/g, " ").trim().slice(0, 500),
			priority
		});
		if (out.length >= 25) break;
	}
	return out;
}
//#endregion
//#region src/routes/agents/[id]/+page.server.js
function load({ params }) {
	const id = Number(params.id);
	const agent = id ? getAgent(id) : null;
	if (!agent) throw error(404, "Agent not found");
	return {
		agent,
		memories: listMemories(id),
		playbooks: listPlaybooks(id),
		tasks: listAgentTasks(id),
		observations: listObservations(id),
		dispatches: listDispatches(id),
		deliverables: listDeliverables({ agentId: id }),
		aiEnabled: hasAnthropicKey(),
		agentContext: previewAgentContext(agent),
		workspaceDigest: gatherContext(),
		systemContext: DISPATCH_INSTRUCTIONS,
		grantedTools: resolveAgentTools(agent).map((t) => ({
			name: t.name,
			kind: t.kind
		})),
		toolCatalog: TOOL_CATALOG
	};
}
var actions = {
	updateAgent: async ({ request, params }) => {
		const id = Number(params.id);
		if (!id) return fail(400, { message: "Missing agent id." });
		const data = await request.formData();
		const fields = readAgentFields(data);
		if (!fields.name) return fail(400, {
			message: "A name is required.",
			values: fields
		});
		try {
			await resolveAvatarUpdate(data, fields);
		} catch (err) {
			return fail(400, {
				message: err.message,
				values: fields
			});
		}
		updateAgent(id, fields);
		return { success: true };
	},
	createMemory: async ({ request, params }) => {
		const agentId = Number(params.id);
		const data = await request.formData();
		const content = String(data.get("content") ?? "").trim();
		if (!content) return fail(400, { message: "Memory content is required." });
		createMemory(agentId, {
			memoryType: String(data.get("memoryType") ?? "note"),
			content,
			importance: Number(data.get("importance") ?? 1)
		});
		return { success: true };
	},
	updateMemory: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing memory id." });
		updateMemory(id, {
			memoryType: data.get("memoryType") ? String(data.get("memoryType")) : void 0,
			content: data.get("content") != null ? String(data.get("content")) : void 0,
			importance: data.get("importance") != null ? Number(data.get("importance")) : void 0
		});
		return { success: true };
	},
	deleteMemory: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing memory id." });
		deleteMemory(id);
		return { success: true };
	},
	createPlaybook: async ({ request, params }) => {
		const agentId = Number(params.id);
		const data = await request.formData();
		const name = String(data.get("name") ?? "").trim();
		if (!name) return fail(400, { message: "Playbook name is required." });
		createPlaybook(agentId, {
			name,
			description: String(data.get("description") ?? "").trim(),
			steps: String(data.get("steps") ?? ""),
			triggerTags: String(data.get("triggerTags") ?? "")
		});
		return { success: true };
	},
	updatePlaybook: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing playbook id." });
		updatePlaybook(id, {
			name: data.get("name") ? String(data.get("name")).trim() : void 0,
			description: data.get("description") != null ? String(data.get("description")) : void 0,
			steps: data.get("steps") != null ? String(data.get("steps")) : void 0,
			triggerTags: data.get("triggerTags") != null ? String(data.get("triggerTags")) : void 0
		});
		return { success: true };
	},
	deletePlaybook: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing playbook id." });
		deletePlaybook(id);
		return { success: true };
	},
	updateTask: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing task id." });
		const title = String(data.get("title") ?? "").trim();
		if (!title) return fail(400, { message: "A task title is required." });
		updateAgentTask(id, {
			title,
			description: String(data.get("description") ?? "").trim(),
			status: data.get("status") ? String(data.get("status")) : void 0,
			priority: data.get("priority") ? String(data.get("priority")) : void 0
		});
		return { success: true };
	},
	deleteTask: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing task id." });
		deleteAgentTask(id);
		return { success: true };
	},
	runPlaybook: async ({ request, params }) => {
		const agentId = Number(params.id);
		const data = await request.formData();
		const playbookId = Number(data.get("playbookId"));
		if (!playbookId) return fail(400, { pb: { error: "Missing playbook id." } });
		const focus = String(data.get("focus") ?? "").trim();
		try {
			const tasks = await runPlaybook({
				agentId,
				playbookId,
				focus
			});
			if (tasks.length === 0) return fail(422, { pb: { error: "No tasks came back. Add more detail to the steps or the focus note." } });
			return { pb: {
				tasks,
				playbookId
			} };
		} catch (err) {
			return fail(502, { pb: { error: err instanceof AiError ? err.message : "Something went wrong running the playbook." } });
		}
	},
	commitPlaybook: async ({ request, params }) => {
		const agentId = Number(params.id);
		const data = await request.formData();
		let tasks;
		try {
			tasks = JSON.parse(String(data.get("tasks") ?? "[]"));
		} catch {
			tasks = null;
		}
		if (!Array.isArray(tasks) || tasks.length === 0) return fail(400, { pb: { error: "There were no tasks to add." } });
		let added = 0;
		for (const t of tasks) {
			const title = String(t?.title ?? "").trim();
			if (!title) continue;
			createAgentTask(agentId, {
				title,
				description: String(t?.description ?? "").trim(),
				priority: t?.priority
			});
			added++;
		}
		const playbookId = Number(data.get("playbookId")) || null;
		if (added > 0 && playbookId) observeFromRun(agentId, {
			content: `Ran the "${getPlaybook(playbookId)?.name ?? "playbook"}" playbook and created ${added} task${added === 1 ? "" : "s"}.`,
			confidence: .8
		});
		return { pb: { added } };
	},
	dispatch: async ({ request, params }) => {
		const agentId = Number(params.id);
		const data = await request.formData();
		const objective = String(data.get("objective") ?? "").trim();
		if (!objective) return fail(400, { dispatch: { error: "Give the agent an objective." } });
		const requested = Number(data.get("maxSteps"));
		const maxSteps = Number.isFinite(requested) ? Math.min(15, Math.max(1, Math.round(requested))) : void 0;
		try {
			const result = await dispatchAgent(agentId, {
				objective,
				maxSteps
			});
			if (result.error && result.staged.length === 0) return fail(502, { dispatch: { error: result.error } });
			return { dispatch: {
				...result,
				objective
			} };
		} catch (err) {
			return fail(502, { dispatch: { error: err instanceof AiError ? err.message : "Something went wrong dispatching the agent." } });
		}
	},
	chat: async ({ request, params }) => {
		const agentId = Number(params.id);
		const data = await request.formData();
		let messages;
		try {
			messages = JSON.parse(String(data.get("messages") ?? "[]"));
		} catch {
			messages = null;
		}
		if (!Array.isArray(messages) || messages.length === 0) return fail(400, { chat: { error: "Say something to start the conversation." } });
		try {
			const { reply, toolsUsed } = await chatWithAgent(agentId, { messages });
			return { chat: {
				reply,
				toolsUsed
			} };
		} catch (err) {
			return fail(502, { chat: { error: err instanceof AiError ? err.message : "Something went wrong chatting with the agent." } });
		}
	},
	commitDispatch: async ({ request, params }) => {
		const agentId = Number(params.id);
		const data = await request.formData();
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
	denyDispatch: async ({ request, params }) => {
		const agentId = Number(params.id);
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing run id." });
		denyDispatch(agentId, id);
		return { success: true };
	},
	deleteDispatch: async ({ request, params }) => {
		const agentId = Number(params.id);
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing run id." });
		deleteDispatch(agentId, id);
		return { success: true };
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-BdyMMm9a.js.map
