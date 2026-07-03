import { K as listOrchestrations, b as listAgents, g as getAgent, L as recordOrchestration } from '../../../chunks/agents.js-DSCIW6gH.js';
import { l as logEvent } from '../../../chunks/log.js-D10-n4Pe.js';
import { A as AiError, h as hasAnthropicKey, d as dispatchAgent, c as callClaudeTool } from '../../../chunks/agent-runtime.js-CBlullnv.js';
import { A as fail } from '../../../chunks/utils.js-UusfKV9V.js';

//#region src/lib/server/ai/orchestrator.js
var MAX_STEPS = 8;
var planTool = {
	name: "propose_orchestration",
	description: "Decompose the goal into an ordered plan. Each step assigns exactly one agent (by id) a concrete objective. Order steps so later agents can build on earlier ones.",
	input_schema: {
		type: "object",
		properties: { steps: {
			type: "array",
			description: "Ordered steps, each routed to one agent.",
			items: {
				type: "object",
				properties: {
					agentId: {
						type: "number",
						description: "Id of the agent to handle this step."
					},
					objective: {
						type: "string",
						description: "Specific, actionable objective for that agent."
					},
					rationale: {
						type: "string",
						description: "One short line: why this agent, why now."
					}
				},
				required: ["agentId", "objective"]
			}
		} },
		required: ["steps"]
	}
};
function rosterLine(a) {
	const tools = Array.isArray(a.tools) && a.tools.length ? a.tools.join(", ") : "(core tools only)";
	return `#${a.id} ${a.name} — ${a.title || "specialist"} · ${a.specialization || "general"} · tools: ${tools}`;
}
/**
* Phase 1 — propose a plan only. Nothing runs; returns ordered, validated steps
* for the director to approve.
*
* @param {string} goal
* @returns {Promise<{ goal: string, steps: Array<{ agentId: number, agentName: string, objective: string, rationale: string }> }>}
*/
async function planOrchestration(goal) {
	const g = String(goal ?? "").trim();
	if (!g) throw new AiError("Give the orchestrator a goal to plan.");
	const agents = listAgents().filter((a) => a.status === "active");
	if (!agents.length) throw new AiError("There are no active agents to orchestrate.");
	const out = await callClaudeTool({
		system: [
			"You are the orchestrator of a small agency of specialist agents inside a personal",
			"life-management dashboard. Decompose the director’s goal into an ordered plan where each",
			"step is handled by exactly one agent, chosen for its specialization and tools.",
			"",
			"Design the plan as a COOPERATIVE PIPELINE, not a set of independent tasks. Each step",
			"produces a concrete deliverable that the NEXT step consumes and transforms. The handoff",
			"is automatic: a step’s deliverables are saved immediately and the next agent receives",
			"their ids and opens them with search_deliverables, so it never re-gathers what an",
			"earlier agent already produced — it just does its own specialty on top.",
			"",
			"Guidelines:",
			"- Use the fewest steps that complete the directives (1–4 is typical). Use more then one step",
			"  only when it needs additional specialist or tools than the previous one.",
			"- Route each step to the best-fit agent by id from the roster.",
			"- Sequence so each step transforms the prior deliverable into the next form",
			"  (e.g. research report → positioning narrative → X post → standing monitor).",
			"- Write each objective as an explicit handoff: name the upstream deliverable to build on",
			"  (\"using the research deliverable from step 1, ...\") and the single artifact this step",
			"  must produce. State the deliverable’s form and audience so the agent can finish in one pass.",
			"- A later step should NOT redo research or re-fetch sources the prior step already captured.",
			"- Each objective is concrete and self-contained; do not ask the director questions.",
			"Return the plan exclusively through the propose_orchestration tool."
		].join("\n"),
		prompt: [
			`Goal: ${g}`,
			"",
			"Agent roster:",
			agents.map(rosterLine).join("\n")
		].join("\n"),
		tool: planTool
	});
	const byId = new Map(agents.map((a) => [a.id, a]));
	const steps = (Array.isArray(out?.steps) ? out.steps : []).map((s) => {
		const agent = byId.get(Number(s?.agentId));
		const objective = String(s?.objective ?? "").trim();
		if (!agent || !objective) return null;
		return {
			agentId: agent.id,
			agentName: agent.name,
			objective: objective.slice(0, 800),
			rationale: String(s?.rationale ?? "").replace(/\s+/g, " ").trim().slice(0, 300)
		};
	}).filter(Boolean).slice(0, MAX_STEPS);
	if (!steps.length) throw new AiError("The orchestrator could not produce a usable plan. Rephrase the goal.");
	return {
		goal: g,
		steps
	};
}
/**
* Phase 2 — run an approved plan. Dispatches each step in order. A step's
* deliverables are auto-committed and their ids/titles + the running summary are
* threaded into the next step's objective, so later specialists open and build
* on earlier artifacts. Side-effecting writes still stage for approval.
*
* @param {{ goal: string, steps: Array<{ agentId: number, agentName?: string, objective: string }> }} plan
* @returns {Promise<{ goal: string, steps: Array<object> }>}
*/
async function runOrchestration({ goal, steps }) {
	const g = String(goal ?? "").trim();
	const planned = (Array.isArray(steps) ? steps : []).slice(0, MAX_STEPS);
	if (!g || !planned.length) throw new AiError("There is no plan to run.");
	const results = [];
	const produced = [];
	let carried = "";
	for (const step of planned) {
		const agentId = Number(step?.agentId);
		const agentName = step?.agentName || `#${agentId}`;
		const baseObjective = String(step?.objective ?? "").trim();
		if (!getAgent(agentId) || !baseObjective) {
			results.push({
				agentId,
				agentName,
				error: "Agent or objective is no longer valid."
			});
			continue;
		}
		const handoff = [];
		if (produced.length) handoff.push("Build directly on the deliverables already produced in this workflow — open the relevant ones in full with search_deliverables (by id) and transform them; do NOT redo their research or re-fetch sources:\n" + produced.map((d) => `- #${d.id} "${d.title}" (by ${d.agentName})`).join("\n"));
		if (carried) handoff.push(`Notes from earlier steps:\n${carried}`);
		const objective = handoff.length ? `${baseObjective}\n\nWorkflow goal: ${g}\n\n${handoff.join("\n\n")}` : `${baseObjective}\n\nThis is the first step of a workflow toward: ${g}`;
		try {
			const r = await dispatchAgent(agentId, {
				objective,
				autoCommitArtifacts: true
			});
			const deliverables = (r.committedArtifacts ?? []).filter((a) => a.id).map((a) => ({
				id: a.id,
				title: a.title
			}));
			for (const d of deliverables) produced.push({
				id: d.id,
				title: d.title,
				agentName
			});
			results.push({
				agentId,
				agentName,
				dispatchId: r.dispatchId,
				summary: r.summary,
				staged: r.staged.length,
				committed: deliverables.length,
				deliverables,
				truncated: r.truncated,
				error: r.error ?? void 0
			});
			if (r.summary) carried = `${carried}\n${agentName}: ${r.summary}`.slice(-4e3);
		} catch (err) {
			results.push({
				agentId,
				agentName,
				error: err instanceof AiError ? err.message : "Dispatch failed."
			});
		}
	}
	try {
		recordOrchestration({
			goal: g,
			plan: planned,
			steps: results,
			status: "ran"
		});
	} catch {}
	const totalStaged = results.reduce((n, r) => n + (r.staged || 0), 0);
	const totalCommitted = results.reduce((n, r) => n + (r.committed || 0), 0);
	logEvent("orchestration", {
		goal: g.slice(0, 140),
		steps: results.length,
		staged: totalStaged,
		committed: totalCommitted
	});
	return {
		goal: g,
		steps: results
	};
}
//#endregion
//#region src/routes/orchestrate/+page.server.js
function load() {
	return {
		agents: listAgents().filter((a) => a.status === "active"),
		recent: listOrchestrations(10),
		aiReady: hasAnthropicKey()
	};
}
var actions = {
	plan: async ({ request }) => {
		const data = await request.formData();
		const goal = String(data.get("goal") ?? "").trim();
		if (!goal) return fail(400, { message: "Enter a goal to orchestrate." });
		try {
			return { planned: await planOrchestration(goal) };
		} catch (err) {
			return fail(400, { message: err instanceof AiError ? err.message : "Could not plan that goal." });
		}
	},
	run: async ({ request }) => {
		const data = await request.formData();
		const goal = String(data.get("goal") ?? "").trim();
		let steps = [];
		try {
			steps = JSON.parse(String(data.get("steps") ?? "[]"));
		} catch {
			steps = [];
		}
		if (!goal || !Array.isArray(steps) || !steps.length) return fail(400, { message: "There is no plan to run." });
		try {
			return { ran: await runOrchestration({
				goal,
				steps
			}) };
		} catch (err) {
			return fail(400, { message: err instanceof AiError ? err.message : "Could not run the plan." });
		}
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-DYRQl0UN.js.map
