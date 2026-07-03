import { b as private_env } from '../chunks/shared-server.js-9-2j12mp.js';
import { d as db } from '../chunks/db.js-BcppfB2j.js';
import { b as listAgents, l as listAgentTasks, d as listPlaybooks, m as markTaskDispatched, g as getAgent, k as listUnreflectedObservations, n as createMemory, o as markObservationsReflected } from '../chunks/agents.js-DSCIW6gH.js';
import { f as findOrCreateInstance, u as updateInstance } from '../chunks/instances.js-DLoGySTX.js';
import { c as createCollector, a as gatherContext, l as listDueCollectors } from '../chunks/tools.js-C1CBPtEY.js';
import { g as getSetting } from '../chunks/settings.js-CGfdgS1b.js';
import { l as logEvent } from '../chunks/log.js-D10-n4Pe.js';
import { h as hasAnthropicKey, d as dispatchAgent, c as callClaudeTool, A as AiError } from '../chunks/agent-runtime.js-CBlullnv.js';
import { r as runCollector } from '../chunks/collector.js-DQ-r_gt5.js';
import { i as isPinConfigured, a as isValidSession } from '../chunks/auth.js-CVDVLUQB.js';
import { l as listDueTransformers, r as runTransformer } from '../chunks/transformer.js-BBxyHg-P.js';
import { z as redirect } from '../chunks/utils.js-UusfKV9V.js';
import '../chunks/theme-presets.js-B35K5uvm.js';
import 'node:fs';
import 'node:path';
import 'node:sqlite';
import '../chunks/chunk.js-BBx_TEkp.js';
import '../chunks/tasks.js-Bci1Un8l.js';
import '../chunks/projects.js-BVUHOwgk.js';
import '../chunks/notes.js-BAFtkvVL.js';
import '../chunks/events.js-DfgN28oW.js';
import '../chunks/viem.js-Dnkpuzyj.js';
import 'viem';
import 'viem/accounts';
import '../chunks/goals.js-Cf0BF7rV.js';
import '../chunks/humans.js-CapNfHxi.js';
import '../chunks/deliverables.js-f4a3J5Ph.js';
import '../chunks/records.js-CRr2Hc_8.js';
import '../chunks/reports.js-CxYYqpm4.js';
import '../chunks/activity2.js-uHW7HsJq.js';
import 'node:crypto';
import '../chunks/adapter-runner.js-SRrLtSoq.js';
import '../chunks/shared.js-CgP5r6wP.js';

//#region src/lib/server/db/migrate-monitors.js
var DEFAULT_SCHEDULE_MINUTES = 15;
function migrateMonitorsToCollectors() {
	let monitors;
	try {
		monitors = db.prepare(`SELECT * FROM twitter_monitors`).all();
	} catch {
		return 0;
	}
	if (!monitors.length) return 0;
	const instance = findOrCreateInstance({
		name: "X / Twitter",
		type: "twitterapi"
	});
	const drain = db.prepare(`DELETE FROM twitter_monitors WHERE id = ?`);
	let migrated = 0;
	for (const m of monitors) {
		const query = String(m.query ?? "").trim();
		if (query) {
			createCollector({
				instanceId: instance.id,
				name: query.slice(0, 80),
				type: "twitterapi_search",
				input: {
					query,
					queryType: m.query_type === "Top" ? "Top" : "Latest"
				},
				scheduleMinutes: DEFAULT_SCHEDULE_MINUTES,
				notify: Boolean(m.notify),
				agentId: m.agent_id ?? null,
				cursor: m.last_tweet_id || null
			});
			migrated++;
		}
		drain.run(m.id);
	}
	return migrated;
}
//#endregion
//#region src/lib/server/db/migrate-integrations.js
var MARKER = "__integrations_seeded__";
var SEED = [{
	type: "twitterapi",
	name: "X / Twitter",
	required: "apiKey",
	credentials: {
		apiKey: "TWITTERAPI_API_KEY",
		loginCookies: "TWITTER_LOGIN_COOKIES",
		proxy: "TWITTER_PROXY"
	},
	config: {}
}, {
	type: "viem",
	name: "EVM RPC",
	required: "rpcUrl",
	credentials: {},
	config: { rpcUrl: "EVM_RPC_URL" }
}];
function readLegacy(envKey) {
	const fromEnv = private_env[envKey];
	if (fromEnv != null && String(fromEnv).trim()) return String(fromEnv).trim();
	const v = db.prepare(`SELECT value FROM app_settings WHERE key = ?`).get(envKey)?.value;
	return v != null && String(v).trim() ? String(v).trim() : "";
}
function mapValues(spec) {
	const out = {};
	for (const [field, envKey] of Object.entries(spec)) {
		const value = readLegacy(envKey);
		if (value) out[field] = value;
	}
	return out;
}
/** Seed integration instances from legacy env/settings. Returns the count created
*  or updated. Idempotent: a no-op after the first successful run. */
function migrateIntegrationsToInstances() {
	if (db.prepare(`SELECT 1 FROM app_settings WHERE key = ?`).get(MARKER)) return 0;
	let migrated = 0;
	for (const spec of SEED) {
		const credentials = mapValues(spec.credentials);
		const config = mapValues(spec.config);
		if (!{
			...config,
			...credentials
		}[spec.required]) continue;
		const instance = findOrCreateInstance({
			name: spec.name,
			type: spec.type,
			config
		});
		updateInstance(instance.id, {
			credentials,
			config: {
				...instance.config ?? {},
				...config
			}
		});
		migrated++;
	}
	db.prepare(`INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)`).run(MARKER, (/* @__PURE__ */ new Date()).toISOString());
	return migrated;
}
//#endregion
//#region src/lib/server/ai/reflection.js
var REFLECT_THRESHOLD = 6;
var REFLECT_BATCH = 30;
var MAX_INSIGHTS = 2;
var insightTool = {
	name: "record_insights",
	description: "Record durable, reusable lessons distilled from an agent’s recent run notes. Return an empty list if nothing is worth keeping.",
	input_schema: {
		type: "object",
		properties: { insights: {
			type: "array",
			description: "At most two genuinely reusable lessons. Empty if none qualify.",
			items: {
				type: "object",
				properties: {
					content: {
						type: "string",
						description: "A non-obvious, generally-stated lesson for future runs."
					},
					importance: {
						type: "number",
						description: "1 (minor) to 5 (critical)."
					}
				},
				required: ["content"]
			}
		} },
		required: ["insights"]
	}
};
/**
* Consolidate an agent's raw observations into durable lesson-memories. No-op
* until at least REFLECT_THRESHOLD unreflected observations exist.
*
* @param {number} agentId
* @returns {Promise<{ reflected: number, insights: number }>}
*/
async function reflectAgent(agentId) {
	const agent = getAgent(agentId);
	if (!agent) return {
		reflected: 0,
		insights: 0
	};
	const observations = listUnreflectedObservations(agentId, REFLECT_BATCH);
	if (observations.length < REFLECT_THRESHOLD) return {
		reflected: 0,
		insights: 0
	};
	const system = [
		`You are consolidating ${agent.name}'s episodic run notes into at most ${MAX_INSIGHTS} durable, reusable lessons.`,
		"Keep only genuinely useful, non-obvious insights that would improve future runs.",
		"Ignore routine telemetry (e.g. \"executed 3 actions\"), one-offs, and restatements of the obvious.",
		"State each lesson generally, not as a recap of a single run. If nothing qualifies, return an empty list.",
		"Respond exclusively through the record_insights tool."
	].join("\n");
	const prompt = ["Recent run notes:", ...observations.map((o) => `- ${o.content}`)].join("\n");
	let out;
	try {
		out = await callClaudeTool({
			system,
			prompt,
			tool: insightTool,
			maxTokens: 1e3
		});
	} catch (err) {
		logEvent("reflection_error", {
			agentId,
			error: err instanceof AiError ? err.message : String(err?.message ?? err)
		});
		return {
			reflected: 0,
			insights: 0
		};
	}
	const insights = Array.isArray(out?.insights) ? out.insights.slice(0, MAX_INSIGHTS) : [];
	let written = 0;
	for (const insight of insights) {
		const content = String(insight?.content ?? "").replace(/\s+/g, " ").trim().slice(0, 400);
		if (!content) continue;
		const importance = Math.min(5, Math.max(1, Math.round(Number(insight?.importance) || 3)));
		try {
			createMemory(agentId, {
				memoryType: "lesson",
				content,
				importance
			});
			written++;
		} catch {}
	}
	markObservationsReflected(observations.map((o) => o.id));
	logEvent("reflection", {
		agentId,
		name: agent.name,
		consumed: observations.length,
		insights: written
	});
	return {
		reflected: observations.length,
		insights: written
	};
}
//#endregion
//#region src/lib/server/ai/scheduler.js
var DEFAULT_INTERVAL_MIN = 15;
var OPEN_STATUSES = new Set([
	"todo",
	"in_progress",
	"waiting"
]);
var MAX_DISPATCHES_PER_TICK = 3;
var MAX_REFLECTIONS_PER_TICK = 2;
var MAX_COLLECTOR_RUNS_PER_TICK = 5;
var MAX_TRANSFORMER_RUNS_PER_TICK = 3;
var started = false;
var running = false;
var timer = null;
function isEnabled() {
	return getSetting("SCHEDULER_ENABLED") === true;
}
function intervalMs() {
	const n = Number(getSetting("SCHEDULER_INTERVAL_MINUTES"));
	return Math.round((Number.isFinite(n) && n > 0 ? n : DEFAULT_INTERVAL_MIN) * 6e4);
}
function triggeredPlaybooks(playbooks, contextText) {
	const haystack = String(contextText).toLowerCase();
	return playbooks.filter((p) => Array.isArray(p.triggerTags) && p.triggerTags.some((tag) => {
		const t = String(tag).trim().toLowerCase();
		return t && haystack.includes(t);
	}));
}
function objectiveForTask(task) {
	const lines = [
		"Work on the following assigned task. Gather only the context you need, then",
		"stage the concrete actions required to make progress on it.",
		"",
		`Task: ${task.title}`
	];
	if (task.description) lines.push(`Details: ${task.description}`);
	if (task.projectName) lines.push(`Project: ${task.projectName}`);
	if (task.priority) lines.push(`Priority: ${task.priority}`);
	if (task.status) lines.push(`Current status: ${task.status}`);
	return lines.join("\n");
}
/**
* Run due research collectors — the general successor to the old monitor poll.
* Each due collector fetches from its source, upserts records, and advances its
* watermark (and, when an agent is subscribed, tees new records into
* observations). Bounded per tick, oldest-first; runCollector records its own
* outcome and never throws.
*/
async function pollCollectors() {
	const due = listDueCollectors().slice(0, MAX_COLLECTOR_RUNS_PER_TICK);
	let ran = 0;
	for (const collector of due) {
		ran++;
		await runCollector(collector);
	}
	return ran;
}
/**
* Run due transformers — user-defined derivations over records. Runs after
* pollCollectors so records collected this tick are transformed in the same
* tick. Bounded, oldest-first; runTransformer records its own outcome and
* never throws.
*/
async function pollTransformers() {
	const due = listDueTransformers().slice(0, MAX_TRANSFORMER_RUNS_PER_TICK);
	let ran = 0;
	for (const transformer of due) {
		ran++;
		await runTransformer(transformer);
	}
	return ran;
}
/**
* Run a single scheduler tick. Exported so it can be invoked manually (tests,
* a "run now" button) independent of the interval. Dispatches open tasks
* (propose-only); playbook matches are logged but not acted on yet.
*/
async function runSchedulerTick() {
	if (running) {
		logEvent("scheduler_skip", { reason: "overlap" });
		return;
	}
	running = true;
	const startedAt = Date.now();
	try {
		let context = "";
		try {
			context = gatherContext({
				maxTasks: 60,
				maxNotes: 20
			});
		} catch {
			context = "";
		}
		const agents = listAgents().filter((a) => a.status === "active");
		let agentsWithWork = 0;
		let dispatched = 0;
		for (const agent of agents) {
			const openTasks = listAgentTasks(agent.id).filter((t) => OPEN_STATUSES.has(t.status) && !t.createdByAgentId);
			const playbooks = triggeredPlaybooks(listPlaybooks(agent.id), context);
			if (openTasks.length === 0 && playbooks.length === 0) continue;
			agentsWithWork++;
			logEvent("scheduler_agent", {
				agentId: agent.id,
				name: agent.name,
				openTasks: openTasks.length,
				triggeredPlaybooks: playbooks.map((p) => p.name)
			});
			for (const task of openTasks) {
				if (dispatched >= MAX_DISPATCHES_PER_TICK) break;
				if (task.lastDispatchedAt && task.lastDispatchedAt >= task.updatedAt) continue;
				dispatched++;
				try {
					const result = await dispatchAgent(agent.id, {
						objective: objectiveForTask(task),
						taskId: task.id
					});
					logEvent("scheduler_dispatch", {
						agentId: agent.id,
						name: agent.name,
						taskId: task.id,
						title: task.title,
						dispatchId: result.dispatchId,
						staged: result.staged.length,
						steps: result.steps,
						truncated: result.truncated,
						error: result.error ?? void 0
					});
				} catch (err) {
					logEvent("scheduler_dispatch_error", {
						agentId: agent.id,
						taskId: task.id,
						error: err?.message ?? String(err)
					});
				} finally {
					markTaskDispatched(task.id);
				}
			}
			if (dispatched >= MAX_DISPATCHES_PER_TICK) break;
		}
		let collectorsPolled = 0;
		try {
			collectorsPolled = await pollCollectors();
		} catch (err) {
			logEvent("scheduler_collector_error", { error: err?.message ?? String(err) });
		}
		let transformersRun = 0;
		try {
			transformersRun = await pollTransformers();
		} catch (err) {
			logEvent("scheduler_transformer_error", { error: err?.message ?? String(err) });
		}
		let reflected = 0;
		for (const agent of agents) {
			if (reflected >= MAX_REFLECTIONS_PER_TICK) break;
			try {
				if ((await reflectAgent(agent.id)).reflected > 0) reflected++;
			} catch (err) {
				logEvent("scheduler_reflect_error", {
					agentId: agent.id,
					error: err?.message ?? String(err)
				});
			}
		}
		logEvent("scheduler_tick", {
			agents: agents.length,
			agentsWithWork,
			dispatched,
			collectorsPolled,
			transformersRun,
			reflected,
			ms: Date.now() - startedAt
		});
	} catch (err) {
		logEvent("scheduler_error", { error: err?.message ?? String(err) });
	} finally {
		running = false;
	}
}
/**
* Start the background scheduler. Idempotent (safe to call more than once) and a
* no-op unless explicitly enabled and an API key is present.
*/
function startScheduler() {
	if (started) return;
	started = true;
	try {
		const migrated = migrateMonitorsToCollectors();
		if (migrated) logEvent("monitors_migrated", { count: migrated });
	} catch (err) {
		logEvent("monitors_migrate_error", { error: err?.message ?? String(err) });
	}
	try {
		const seeded = migrateIntegrationsToInstances();
		if (seeded) logEvent("integrations_migrated", { count: seeded });
	} catch (err) {
		logEvent("integrations_migrate_error", { error: err?.message ?? String(err) });
	}
	if (!isEnabled()) {
		logEvent("scheduler_disabled", { reason: "SCHEDULER_ENABLED not set" });
		return;
	}
	if (!hasAnthropicKey()) {
		logEvent("scheduler_disabled", { reason: "no ANTHROPIC_API_KEY" });
		return;
	}
	const ms = intervalMs();
	logEvent("scheduler_start", { intervalMs: ms });
	timer = setInterval(runSchedulerTick, ms);
	if (timer && typeof timer.unref === "function") timer.unref();
}
//#endregion
//#region src/hooks.server.js
startScheduler();
async function handle({ event, resolve }) {
	const { pathname } = event.url;
	if (!(pathname === "/lock" || pathname.startsWith("/__")) && isPinConfigured()) {
		if (!isValidSession(event.cookies.get("wieldos_session"))) redirect(303, "/lock");
	}
	return resolve(event);
}

export { handle };
//# sourceMappingURL=hooks.server.js-CNw1G5Iy.js.map
