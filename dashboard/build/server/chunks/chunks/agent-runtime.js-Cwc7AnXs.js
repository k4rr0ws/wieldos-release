import { g as getAgent, r as recordDispatch, d as listPlaybooks, e as listRelevantObservations, f as listRelevantMemories, h as createObservation, i as dispatchAlreadyCommitted, j as recordAgentAction } from './agents.js-xaDulNxk.js';
import { g as getSetting } from './settings.js-B6ViW1Gq.js';
import { r as resolveAgentTools, t as toolSpec, g as getTool } from './tools.js-BWnlcMH6.js';
import { l as logEvent } from './log.js-DBWwQvzy.js';
import { randomUUID } from 'node:crypto';

//#region src/lib/server/ai/client.js
var API_URL = "https://api.anthropic.com/v1/messages";
var DEFAULT_MODEL = "claude-sonnet-4-6";
var MODELS = {
	"claude-haiku-4-5": {
		tier: "fast",
		input: 1,
		output: 5
	},
	"claude-sonnet-4-6": {
		tier: "balanced",
		input: 3,
		output: 15
	},
	"claude-opus-4-8": {
		tier: "premium",
		input: 5,
		output: 25
	},
	"claude-fable-5": {
		tier: "frontier",
		input: 10,
		output: 50
	}
};
/** The model these calls will actually use (settings override or default). */
function activeModel() {
	return getSetting("ANTHROPIC_MODEL") || DEFAULT_MODEL;
}
/**
* Estimate the USD cost of a call from its token usage. Best-effort — for the
* cost dashboard only, never for billing. Unknown models use the default rate.
*
* @param {{ model?: string, inputTokens?: number, outputTokens?: number }} usage
* @returns {number} estimated cost in USD
*/
function estimateCost({ model = activeModel(), inputTokens = 0, outputTokens = 0 } = {}) {
	const rate = MODELS[String(model).toLowerCase()] ?? MODELS[DEFAULT_MODEL];
	return (Number(inputTokens) * rate.input + Number(outputTokens) * rate.output) / 1e6;
}
function requestTimeoutMs() {
	return Math.max(1e4, Number(getSetting("AI_REQUEST_TIMEOUT_MS")) || 12e4);
}
var MAX_RETRIES = 2;
var RETRYABLE_STATUS = new Set([
	408,
	409,
	429,
	500,
	502,
	503,
	504,
	529
]);
/** Surfaced to the UI with a friendly message. */
var AiError = class extends Error {};
function hasAnthropicKey() {
	return Boolean(getSetting("ANTHROPIC_API_KEY"));
}
var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function backoffDelay(attempt, res) {
	const retryAfter = Number(res?.headers?.get?.("retry-after"));
	if (Number.isFinite(retryAfter) && retryAfter > 0) return Math.min(retryAfter * 1e3, 15e3);
	const base = 500 * 2 ** attempt;
	return Math.min(base + Math.random() * 250, 15e3);
}
async function readErrorDetail(res) {
	try {
		const body = await res.json();
		return body?.error?.message ?? JSON.stringify(body);
	} catch {
		return res.text().catch(() => "");
	}
}
function sanitizeSurrogates(text) {
	return text.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "�");
}
/**
* Single hardened request to the Anthropic Messages API. Adds the api key and
* model, enforces a timeout, and retries transient failures (429/5xx/network)
* with exponential backoff. Throws AiError on unrecoverable failure.
*
* @param {object} body - request body without `model`
* @returns {Promise<object>} parsed JSON payload
*/
async function anthropicRequest(body) {
	const apiKey = getSetting("ANTHROPIC_API_KEY");
	if (!apiKey) throw new AiError("No Anthropic API key found. Set it under Settings → Core AI.");
	const payload = {
		model: getSetting("ANTHROPIC_MODEL") || DEFAULT_MODEL,
		...body
	};
	let lastError = "";
	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), requestTimeoutMs());
		const startedAt = Date.now();
		try {
			const res = await fetch(API_URL, {
				method: "POST",
				headers: {
					"content-type": "application/json",
					"x-api-key": apiKey,
					"anthropic-version": "2023-06-01"
				},
				body: JSON.stringify(payload, (_, value) => typeof value === "string" ? sanitizeSurrogates(value) : value),
				signal: controller.signal
			});
			if (res.ok) {
				const json = await res.json();
				logEvent("anthropic_request", {
					model: payload.model,
					status: res.status,
					latencyMs: Date.now() - startedAt,
					attempt,
					inputTokens: json?.usage?.input_tokens,
					outputTokens: json?.usage?.output_tokens,
					stopReason: json?.stop_reason
				});
				return json;
			}
			const detail = await readErrorDetail(res);
			logEvent("anthropic_error", {
				model: payload.model,
				status: res.status,
				latencyMs: Date.now() - startedAt,
				attempt,
				detail: truncate(detail, 200)
			});
			if (RETRYABLE_STATUS.has(res.status) && attempt < MAX_RETRIES) {
				lastError = `HTTP ${res.status}`;
				await sleep(backoffDelay(attempt, res));
				continue;
			}
			throw new AiError(`Anthropic API error (${res.status}): ${truncate(detail, 300)}`);
		} catch (err) {
			if (err instanceof AiError) throw err;
			const timedOut = err?.name === "AbortError";
			lastError = timedOut ? "request timed out" : err?.message ?? "network error";
			logEvent("anthropic_error", {
				model: payload.model,
				latencyMs: Date.now() - startedAt,
				attempt,
				detail: lastError
			});
			if (attempt < MAX_RETRIES) {
				await sleep(backoffDelay(attempt));
				continue;
			}
			throw new AiError(timedOut ? `Anthropic request timed out after ${requestTimeoutMs() / 1e3}s. Try again.` : `Couldn't reach Anthropic: ${lastError}`);
		} finally {
			clearTimeout(timer);
		}
	}
	throw new AiError(`Couldn't reach Anthropic: ${lastError || "unknown error"}`);
}
/**
* Call Claude and force a single tool call, returning the tool's structured input.
* Using a tool keeps the model's output strictly shaped to our schema.
*/
async function callClaudeTool({ system, prompt, tool, maxTokens = 8e3 }) {
	const block = (await anthropicRequest({
		max_tokens: maxTokens,
		system,
		tools: [tool],
		tool_choice: {
			type: "tool",
			name: tool.name
		},
		messages: [{
			role: "user",
			content: prompt
		}]
	}))?.content?.find((b) => b.type === "tool_use");
	if (!block?.input) throw new AiError("Claude returned no structured result. Try again or rephrase your direction.");
	return block.input;
}
/**
* Lower-level call for a multi-turn, multi-tool conversation. Sends the message
* history plus the available tool specs and returns the raw assistant content
* blocks and stop reason, so the caller can run a tool loop. The model chooses
* whether and which tool to call (tool_choice: auto).
*
* @param {{ system?: string, messages: Array, tools?: Array, maxTokens?: number }} options
* @returns {Promise<{ content: Array, stopReason: string }>}
*/
async function callClaude({ system, messages, tools = [], maxTokens = 4e3 }) {
	const body = {
		max_tokens: maxTokens,
		messages
	};
	if (system) body.system = system;
	if (tools.length) body.tools = tools;
	const payload = await anthropicRequest(body);
	const usage = payload?.usage ?? {};
	return {
		content: payload?.content ?? [],
		stopReason: payload?.stop_reason ?? "end_turn",
		usage: {
			inputTokens: usage.input_tokens ?? 0,
			outputTokens: usage.output_tokens ?? 0
		}
	};
}
function truncate(str, n) {
	const s = String(str ?? "");
	return s.length > n ? `${s.slice(0, n)}…` : s;
}
//#endregion
//#region src/lib/server/ai/agent-runtime.js
var MAX_MEMORIES = 10;
var MAX_OBSERVATIONS = 3;
function personaForRun(agent, query = "") {
	return buildAgentPersona(agent, {
		memories: listRelevantMemories(agent.id, query, MAX_MEMORIES),
		observations: listRelevantObservations(agent.id, query, MAX_OBSERVATIONS),
		playbooks: listPlaybooks(agent.id)
	});
}
function previewAgentContext(agent) {
	return personaForRun(agent, "");
}
/**
* Build the system prompt for an agent. The identity block is the
* `systemPrompt` field written verbatim; memories, observations, and
* playbooks are appended after.
*
* @param {object} agent - row from getAgent()
* @param {{ memories?: Array, observations?: Array, playbooks?: Array }} [extras]
* @returns {string}
*/
function buildAgentPersona(agent, { memories = [], observations = [], playbooks = [] } = {}) {
	const lines = [];
	const body = agent.systemPrompt?.trim();
	const heading = agent.title ? `${agent.name}, ${agent.title}` : agent.name;
	if (body) {
		if (!body.toLowerCase().startsWith("you are")) {
			lines.push(`You are ${heading}.`);
			lines.push("");
		}
		lines.push(body);
	} else {
		lines.push(`You are ${heading}.`);
		if (agent.description) lines.push(agent.description);
		if (agent.specialization) lines.push(`Specialization: ${agent.specialization}`);
	}
	if (memories.length) {
		lines.push("", "What you remember (most relevant first):");
		for (const m of memories) lines.push(`- [${m.memoryType}] ${m.content}`);
	}
	if (observations.length) {
		lines.push("", "Recent run notes (raw, not yet consolidated):");
		for (const o of observations) lines.push(`- ${o.content}`);
	}
	if (playbooks.length) {
		lines.push("", "Playbooks you can follow:");
		for (const p of playbooks) {
			const steps = Array.isArray(p.steps) && p.steps.length ? ` Steps: ${p.steps.join(" → ")}.` : "";
			const desc = p.description ? ` ${p.description}` : "";
			lines.push(`- ${p.name}:${desc}${steps}`);
		}
	}
	lines.push("", "Act and decide in character.");
	return lines.join("\n");
}
/**
* Run a tool-constrained Claude call "as" a given agent. The agent's identity,
* memories, and playbooks are prepended to the provided task system prompt,
* then the call is delegated to the hardened callClaudeTool transport.
*
* @param {number} agentId
* @param {{ system?: string, prompt: string, tool: object, maxTokens?: number }} options
* @returns {Promise<object>} the tool's structured input
*/
async function runAgentTool(agentId, { system = "", prompt, tool, maxTokens }) {
	const agent = getAgent(agentId);
	if (!agent) throw new AiError("That agent no longer exists. Pick another agent and try again.");
	return callClaudeTool({
		system: [personaForRun(agent, prompt), system].filter(Boolean).join("\n\n---\n\n"),
		prompt,
		tool,
		maxTokens
	});
}
var CHAT_MAX_TOKENS = 1024;
var CHAT_MESSAGE_MAX_CHARS = 6e3;
var CHAT_MAX_STEPS = 4;
var CHAT_READ_BUDGET = 12e3;
var CHAT_INSTRUCTIONS = [
	"You are in a direct, real-time chat with your principal (the owner of this dashboard).",
	"Stay in character and reply conversationally and concisely — this is a discussion, not a dispatched job.",
	"You can use your READ tools to look things up before answering: the principal’s context (projects,",
	"tasks, notes), saved deliverables, the research corpus, and any external reads you’ve been granted.",
	"Use them when they help you answer with real, specific information instead of guessing.",
	"You CANNOT make changes from chat — no creating or updating tasks/notes/deliverables, no posting or",
	"sending. If a request needs that, say briefly how you’d approach it and suggest they Dispatch you to",
	"carry it out. Draw on what you remember and your playbooks when relevant."
].join("\n");
function sanitizeChatHistory(messages) {
	const cleaned = [];
	for (const m of Array.isArray(messages) ? messages : []) {
		const role = m?.role === "assistant" ? "assistant" : m?.role === "user" ? "user" : null;
		const content = String(m?.content ?? "").trim();
		if (!role || !content) continue;
		cleaned.push({
			role,
			content: content.slice(0, CHAT_MESSAGE_MAX_CHARS)
		});
	}
	const recent = cleaned.slice(-24);
	while (recent.length && recent[0].role === "assistant") recent.shift();
	return recent;
}
/**
* Hold a turn of conversation with an agent. Builds the agent's persona around
* the latest user message and runs a bounded READ-tool loop: read tools execute
* immediately and their output is fed back so the agent can ground its reply in
* real data. Write tools are withheld, so nothing is staged or persisted here.
*
* @param {number} agentId
* @param {{ messages: Array<{ role: 'user'|'assistant', content: string }> }} options
* @returns {Promise<{ reply: string, toolsUsed: string[], usage: object, costUsd: number }>}
*/
async function chatWithAgent(agentId, { messages }) {
	const agent = getAgent(agentId);
	if (!agent) throw new AiError("That agent no longer exists. Pick another agent and try again.");
	const history = sanitizeChatHistory(messages);
	if (!history.length || history[history.length - 1].role !== "user") throw new AiError("Say something to start the conversation.");
	const system = [
		personaForRun(agent, history[history.length - 1].content),
		"---",
		CHAT_INSTRUCTIONS
	].join("\n");
	const readTools = resolveAgentTools(agent).filter((t) => t.kind === "read");
	const granted = new Set(readTools.map((t) => t.name));
	const specs = readTools.map(toolSpec);
	const convo = [...history];
	const toolsUsed = [];
	let reply = "";
	let readBytes = 0;
	let inputTokens = 0;
	let outputTokens = 0;
	for (let step = 0; step < CHAT_MAX_STEPS; step++) {
		const res = await callClaude({
			system,
			messages: convo,
			tools: specs,
			maxTokens: CHAT_MAX_TOKENS
		});
		inputTokens += res.usage?.inputTokens ?? 0;
		outputTokens += res.usage?.outputTokens ?? 0;
		convo.push({
			role: "assistant",
			content: res.content
		});
		const text = textOf(res.content);
		if (text) reply = text;
		const toolUses = (res.content ?? []).filter((b) => b.type === "tool_use");
		if (toolUses.length === 0) break;
		const toolResults = [];
		for (const tu of toolUses) {
			const tool = granted.has(tu.name) ? getTool(tu.name) : null;
			let out;
			if (!tool) out = `Tool "${tu.name}" isn’t available in chat. If this needs real work, suggest a Dispatch.`;
			else if (readBytes >= CHAT_READ_BUDGET) out = "Read budget reached for this reply. Answer with what you have.";
			else try {
				out = String(await tool.run(tu.input ?? {})).slice(0, CHAT_READ_BUDGET - readBytes);
				readBytes += out.length;
				if (!toolsUsed.includes(tool.name)) toolsUsed.push(tool.name);
			} catch (err) {
				out = `Error: ${err.message}`;
			}
			toolResults.push({
				type: "tool_result",
				tool_use_id: tu.id,
				content: out
			});
		}
		convo.push({
			role: "user",
			content: toolResults
		});
	}
	if (!reply) throw new AiError("The agent didn’t have a reply. Try rephrasing.");
	const costUsd = estimateCost({
		model: activeModel(),
		inputTokens,
		outputTokens
	});
	logEvent("agent_chat", {
		agentId,
		turns: history.length,
		toolCalls: toolsUsed.length,
		inputTokens,
		outputTokens,
		costUsd: Number(costUsd.toFixed(6))
	});
	return {
		reply,
		toolsUsed,
		usage: {
			inputTokens,
			outputTokens
		},
		costUsd
	};
}
/**
* Record an automatic run-outcome as an observation (distinct from curated
* memories). Fed back into future runs via relevance retrieval. Best-effort —
* a write-back failure must never break the user's action.
*
* @param {number} agentId
* @param {{ content: string, confidence?: number, tags?: string[] }} observation
*/
function observeFromRun(agentId, { content, confidence = .7, tags = [] }) {
	const id = Number(agentId);
	const text = String(content ?? "").trim();
	if (!id || !text) return false;
	try {
		createObservation(id, {
			content: text,
			confidence,
			tags
		});
		return true;
	} catch {
		return false;
	}
}
var MAX_STAGED = 25;
var READ_BUDGET = 24e3;
var STEP_MAX_TOKENS = 12e3;
var FINAL_STEP_NUDGE = "You are about to run out of steps. Do NOT gather any more context. On your next turn, stage the concrete write action(s) that satisfy the objective (for example create_deliverable with the full body) and then briefly summarize. If you cannot finish everything, stage your best partial output now rather than nothing.";
var ARTIFACT_TOOLS = new Set(["create_deliverable", "update_deliverable"]);
var DISPATCH_INSTRUCTIONS = [
	"You have been dispatched to work an objective inside a personal life-management dashboard.",
	"You can use tools. READ tools (e.g. search_context, twitterapi_read) run immediately and return data.",
	"WRITE tools (e.g. create_task, create_note, create_event, update_task) are STAGED for the user’s",
	"approval — calling one queues the action but does NOT take effect yet.",
	"Approach: gather only the context you need, then stage concrete, specific actions that satisfy",
	"the objective. Do not ask the user questions; act with sensible defaults. When finished, briefly",
	"summarize what you staged and why."
].join("\n");
function textOf(content) {
	return (Array.isArray(content) ? content : []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
}
/**
* Run a bounded tool loop "as" an agent against a free-form objective. Read
* tools execute immediately; write tools are STAGED (validated + summarized) and
* returned for the user to approve — nothing is written here.
*
* When `autoCommitArtifacts` is set (orchestration), artifact writes
* (deliverables) are committed immediately after the loop so a later agent in
* the workflow can read them; side-effecting writes still stay staged.
*
* @param {number} agentId
* @param {{ objective: string, maxSteps?: number, taskId?: number|null, autoCommitArtifacts?: boolean }} options
* @returns {Promise<{ summary: string, staged: Array, reads: Array, steps: number, committedArtifacts: Array }>}
*/
async function dispatchAgent(agentId, { objective, maxSteps = 5, taskId = null, autoCommitArtifacts = false }) {
	const agent = getAgent(agentId);
	if (!agent) throw new AiError("That agent no longer exists. Pick another agent and try again.");
	const goal = String(objective ?? "").trim();
	if (!goal) throw new AiError("Give the agent an objective to work on.");
	const tools = resolveAgentTools(agent);
	const granted = new Set(tools.map((t) => t.name));
	const specs = tools.map(toolSpec);
	const system = [
		personaForRun(agent, goal),
		"---",
		DISPATCH_INSTRUCTIONS
	].join("\n");
	const dispatchId = randomUUID();
	const messages = [{
		role: "user",
		content: goal
	}];
	let staged = [];
	const reads = [];
	let summary = "";
	let steps = 0;
	let readBytes = 0;
	let finished = false;
	let error = null;
	let inputTokens = 0;
	let outputTokens = 0;
	for (; steps < maxSteps; steps++) {
		let res;
		try {
			res = await callClaude({
				system,
				messages,
				tools: specs,
				maxTokens: STEP_MAX_TOKENS
			});
		} catch (err) {
			error = err instanceof AiError ? err.message : "The agent run failed unexpectedly.";
			break;
		}
		inputTokens += res.usage?.inputTokens ?? 0;
		outputTokens += res.usage?.outputTokens ?? 0;
		messages.push({
			role: "assistant",
			content: res.content
		});
		const text = textOf(res.content);
		if (text) summary = text;
		const toolUses = (res.content ?? []).filter((b) => b.type === "tool_use");
		if (toolUses.length === 0) {
			finished = true;
			break;
		}
		const toolResults = [];
		for (const tu of toolUses) {
			const tool = granted.has(tu.name) ? getTool(tu.name) : null;
			let out;
			if (!tool) out = `Tool "${tu.name}" is not available to you.`;
			else if (tool.kind === "read") if (readBytes >= READ_BUDGET) out = "Read budget exhausted for this run. Stop gathering and summarize.";
			else try {
				out = String(await tool.run(tu.input ?? {})).slice(0, READ_BUDGET - readBytes);
				readBytes += out.length;
				reads.push({
					tool: tool.name,
					input: tu.input ?? {}
				});
			} catch (err) {
				out = `Error: ${err.message}`;
			}
			else if (staged.length >= MAX_STAGED) out = "Too many actions already staged; stop and summarize.";
			else try {
				const value = tool.normalize(tu.input ?? {});
				const itemSummary = tool.summarize(value);
				staged.push({
					tool: tool.name,
					input: tu.input ?? {},
					summary: itemSummary
				});
				out = `Staged for approval: ${itemSummary}`;
			} catch (err) {
				out = `Error: ${err.message}`;
			}
			toolResults.push({
				type: "tool_result",
				tool_use_id: tu.id,
				content: out
			});
		}
		if (steps === maxSteps - 2) toolResults.push({
			type: "text",
			text: FINAL_STEP_NUDGE
		});
		messages.push({
			role: "user",
			content: toolResults
		});
	}
	const truncated = !finished && !error;
	const committedArtifacts = [];
	if (autoCommitArtifacts && staged.length) {
		const remaining = [];
		for (const item of staged) {
			const tool = granted.has(item.tool) ? getTool(item.tool) : null;
			if (tool && ARTIFACT_TOOLS.has(item.tool)) try {
				const result = await tool.execute(tool.normalize(item.input ?? {}), {
					agentId,
					dispatchId
				});
				committedArtifacts.push({
					tool: item.tool,
					summary: item.summary,
					id: result?.id ?? null,
					title: result?.title ?? "",
					type: result?.type ?? "note"
				});
			} catch (err) {
				remaining.push(item);
				logEvent("orchestration_artifact_error", {
					agentId,
					dispatchId,
					tool: item.tool,
					error: err?.message ?? String(err)
				});
			}
			else remaining.push(item);
		}
		staged = remaining;
	}
	const linkedTaskId = Number.isInteger(taskId) ? taskId : null;
	const costUsd = estimateCost({
		model: activeModel(),
		inputTokens,
		outputTokens
	});
	logEvent("dispatch", {
		agentId,
		dispatchId,
		taskId: linkedTaskId ?? void 0,
		steps,
		reads: reads.length,
		staged: staged.length,
		committed: committedArtifacts.length,
		truncated,
		inputTokens,
		outputTokens,
		costUsd: Number(costUsd.toFixed(6)),
		error: error ?? void 0
	});
	try {
		recordDispatch(agentId, {
			dispatchId,
			objective: goal,
			summary,
			reads,
			staged,
			steps,
			truncated,
			error,
			taskId: linkedTaskId,
			inputTokens,
			outputTokens,
			costUsd
		});
	} catch {}
	return {
		dispatchId,
		taskId: linkedTaskId,
		summary,
		staged,
		reads,
		steps,
		truncated,
		error,
		committedArtifacts,
		inputTokens,
		outputTokens,
		costUsd
	};
}
/**
* Execute the write actions staged by a previous dispatch, after the user has
* approved them. Re-validates each action against the agent's granted tools,
* logs every outcome to the audit trail, and is idempotent per dispatchId so a
* double-submit can't duplicate writes.
*
* @param {number} agentId
* @param {{ actions: Array<{ tool: string, input: object, summary?: string }>, objective?: string, dispatchId?: string }} options
* @returns {{ added: number, failed: Array<{ summary: string, error: string }>, duplicate: boolean }}
*/
async function commitDispatch(agentId, { actions, objective = "", dispatchId = "" }) {
	const agent = getAgent(agentId);
	if (!agent) throw new AiError("That agent no longer exists.");
	if (dispatchId && dispatchAlreadyCommitted(dispatchId)) return {
		added: 0,
		failed: [],
		duplicate: true
	};
	const granted = new Set(resolveAgentTools(agent).map((t) => t.name));
	let added = 0;
	const failed = [];
	for (const action of Array.isArray(actions) ? actions : []) {
		const tool = getTool(action?.tool);
		const label = action?.summary || action?.tool || "action";
		if (!tool || tool.kind !== "write" || !granted.has(tool.name)) {
			failed.push({
				summary: label,
				error: "Tool not available."
			});
			continue;
		}
		try {
			await tool.execute(tool.normalize(action.input ?? {}), {
				agentId,
				dispatchId
			});
			added++;
			recordAgentAction(agentId, {
				dispatchId,
				tool: tool.name,
				summary: label,
				input: action.input ?? {},
				status: "executed"
			});
		} catch (err) {
			failed.push({
				summary: label,
				error: err.message
			});
			recordAgentAction(agentId, {
				dispatchId,
				tool: tool.name,
				summary: label,
				input: action.input ?? {},
				status: "failed",
				error: err.message
			});
		}
	}
	if (added > 0) {
		const detail = objective ? ` for "${String(objective).slice(0, 140)}"` : "";
		const note = failed.length ? `, ${failed.length} failed` : "";
		observeFromRun(agentId, {
			content: `Dispatched${detail}: executed ${added} action${added === 1 ? "" : "s"}${note}.`,
			confidence: .8
		});
	}
	return {
		added,
		failed,
		duplicate: false
	};
}

export { AiError as A, DISPATCH_INSTRUCTIONS as D, commitDispatch as a, chatWithAgent as b, callClaudeTool as c, dispatchAgent as d, hasAnthropicKey as h, observeFromRun as o, previewAgentContext as p, runAgentTool as r };
//# sourceMappingURL=agent-runtime.js-Cwc7AnXs.js.map
