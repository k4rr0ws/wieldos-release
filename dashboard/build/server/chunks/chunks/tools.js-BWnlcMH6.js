import { _ as __exportAll } from './chunk.js-BBx_TEkp.js';
import { d as db } from './db.js-tGTv_Rod.js';
import { l as listAgentTasks, c as createAgentTask, g as getAgent, u as updateAgent, a as createAgent, b as listAgents } from './agents.js-xaDulNxk.js';
import { l as listTasks, g as getTask, u as updateTask, s as setTaskDone, c as createTask } from './tasks.js-m2xglkGD.js';
import { l as listProjects, g as getProject, u as updateProject, c as createProject } from './projects.js-Bx7Ibrtr.js';
import { l as listNotes, c as createNote, g as getNote } from './notes.js-DRMbxsWP.js';
import { c as createEvent } from './events.js-DkEVwPVI.js';
import { l as listAdapters, g as getAdapterByType, r as runAdapter, s as str, t as toStrArray, a as twitterCreateTweet, b as twitterLike, c as twitterRetweet, d as twitterFollow, e as twitterSendDm, f as getPublicClient, h as getWalletClient, E as ERC20_ABI } from './adapter-runner.js-Dsa3ucuC.js';
import { a as getPrimaryInstance, b as getInstanceCredentials, f as findOrCreateInstance, g as getProviderValues } from './instances.js-BWUEcufp.js';
import { q as queryRecords, f as formatRecords } from './records.js-CB6fc5uw.js';
import { l as listGoals, u as updateGoal, g as getGoal, t as toggleAchieved, c as createGoal } from './goals.js-DdTl5nIC.js';
import { u as updateHuman, g as getHuman, c as createHuman, l as listHumans } from './humans.js-RfevdKXI.js';
import { r as recentFinalDeliverables, l as listReferenceDeliverables, D as DELIVERABLE_TYPES, u as updateDeliverable, c as createDeliverable, g as getDeliverable, a as listDeliverables } from './deliverables.js-CigY-aU9.js';
import { l as listPinnedReports, g as getReport, f as findReportByName, a as listReports, r as runReport } from './reports.js-bi6hjnds.js';
import { parseEther, parseAbi, parseUnits, isAddress } from 'viem';

//#region src/lib/server/ai/context.js
/**
* Build a compact text digest of the user's real goals, projects, tasks, notes,
* and routines. Shared by every AI capability (scheduling, dispatch, tools) so
* they ground in the same context. Optionally filtered by a free-text query.
*
* @param {{ query?: string, maxTasks?: number, maxNotes?: number }} [options]
* @returns {string}
*/
function gatherContext({ query = "", maxTasks = 40, maxNotes = 10, maxDeliverables = 8 } = {}) {
	const q = String(query ?? "").trim().toLowerCase();
	const match = (text) => !q || String(text ?? "").toLowerCase().includes(q);
	const goals = listGoals();
	const projects = listProjects();
	const tasks = listTasks();
	const notes = listNotes();
	const goalLines = goals.filter((g) => !g.achieved).map((g) => `- #${g.id} ${g.title}${g.description ? `: ${truncate(g.description, 160)}` : ""}`);
	const projectLines = projects.filter((p) => match(`${p.name} ${p.description}`)).map((p) => {
		const progress = p.totalTasks ? ` (${p.progress}% complete)` : "";
		const paid = p.paid ? ", paid" : "";
		return `- #${p.id} ${p.name} [${p.status}${paid}]${progress}: ${truncate(p.description, 160)}`;
	});
	const taskLines = tasks.filter((t) => !t.isRecurring && t.status !== "done").filter((t) => match(`${t.title} ${t.projectName ?? ""}`)).slice(0, maxTasks).map((t) => {
		const project = t.projectName ? ` @${t.projectName}` : "";
		const due = t.dueDate ? ` (due ${t.dueDate})` : "";
		return `- #${t.id} [${t.priority}]${project} ${t.title}${due}`;
	});
	const recurringLines = tasks.filter((t) => t.isRecurring).filter((t) => match(`${t.title} ${t.projectName ?? ""}`)).map((t) => {
		const project = t.projectName ? ` @${t.projectName}` : "";
		const today = t.scheduledToday ? " — due today" : "";
		return `- #${t.id} ${t.title}${project}: repeats ${describeRecurrence(t)}${today}`;
	});
	const noteLines = notes.filter((n) => match(`${n.title} ${n.content} ${(n.tags ?? []).join(" ")}`)).slice(0, maxNotes).map((n) => `- #${n.id} ${n.title}: ${truncate(n.content, 120)}`);
	const deliverableLines = recentFinalDeliverables(maxDeliverables).filter((d) => d.type !== "reference").filter((d) => match(`${d.title} ${d.body} ${(d.tags ?? []).join(" ")}`)).map((d) => `- #${d.id} [${d.type}] ${d.title}: ${truncate(d.body, 80)}`);
	const referenceLines = listReferenceDeliverables(6).filter((d) => match(`${d.title} ${d.body} ${(d.tags ?? []).join(" ")}`)).map((d) => {
		const tags = d.tags?.length ? ` {${d.tags.join(", ")}}` : "";
		return `- #${d.id} ${d.title}${tags}: ${truncate(d.body, 120)}`;
	});
	const reportLines = listPinnedReports(3).filter((r) => match(`${r.name} ${r.description}`)).map((r) => {
		const rows = queryRecords({
			...r.filter,
			limit: 5
		});
		return `▸ ${r.name} (run_report id=${r.id}):\n${formatRecords(rows, { limit: 5 })}`;
	});
	return [
		"Items below are prefixed with #id — use that id with the update_* tools to edit them.",
		"",
		"GOALS:",
		goalLines.join("\n") || "(none)",
		"",
		"PROJECTS:",
		projectLines.join("\n") || "(none)",
		"",
		"OPEN TASKS:",
		taskLines.join("\n") || "(none)",
		"",
		"RECURRING ROUTINES:",
		recurringLines.join("\n") || "(none)",
		"",
		"NOTES (excerpts — open by #id with read_note for the full content):",
		noteLines.join("\n") || "(none)",
		"",
		"DELIVERABLES (finalized artifacts):",
		deliverableLines.join("\n") || "(none)",
		"",
		"REFERENCE LIBRARY (living reference material — open by #id to read fully, update_deliverable to revise):",
		referenceLines.join("\n") || "(none)",
		"",
		"PINNED REPORTS (live record queries — run_report id=<#id> for the full set):",
		reportLines.join("\n\n") || "(none)"
	].join("\n");
}
function describeRecurrence(task) {
	if (task.recurrence === "daily") return "every day";
	if (task.recurrence === "weekdays") return "weekdays";
	if (task.recurrence === "weekly") {
		const names = [
			"Sun",
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat"
		];
		const days = (task.recurrenceDays ?? []).map((d) => names[d]).filter(Boolean);
		return days.length ? `weekly on ${days.join(", ")}` : "weekly";
	}
	return "on a schedule";
}
function truncate(str, n) {
	const s = String(str ?? "").replace(/\s+/g, " ").trim();
	return s.length > n ? `${s.slice(0, n)}…` : s;
}
//#endregion
//#region src/lib/server/ai/tools/internal/context.js
var context_exports = /* @__PURE__ */ __exportAll({ tools: () => tools$3 });
var tools$3 = [
	{
		name: "search_context",
		kind: "read",
		description: "Look up the user’s real goals, projects, open tasks, recurring routines, notes, and saved deliverables. Active goals are always listed in full; the optional query only narrows the longer lists (tasks, notes, projects, deliverables). Call with no query to see everything.",
		inputSchema: {
			type: "object",
			properties: { query: {
				type: "string",
				description: "Optional keyword to filter the context."
			} }
		},
		run(input) {
			return gatherContext({ query: str(input?.query, 100) });
		}
	},
	{
		name: "search_deliverables",
		kind: "read",
		description: "Browse or open saved deliverables (artifacts agents produced). Pass an id (#id from context) to read one in full, or a query/status to list matches with excerpts. Read-only.",
		inputSchema: {
			type: "object",
			properties: {
				id: {
					type: "number",
					description: "Open a specific deliverable in full by its #id."
				},
				query: {
					type: "string",
					description: "Optional keyword to filter title/body/tags."
				},
				status: {
					type: "string",
					enum: [
						"draft",
						"final",
						"archived"
					],
					description: "Optional status filter."
				}
			}
		},
		run(input) {
			const id = Number(input?.id);
			if (Number.isInteger(id) && id > 0) {
				const d = getDeliverable(id);
				if (!d) return `No deliverable with id ${id}.`;
				const tags = d.tags?.length ? ` [${d.tags.join(", ")}]` : "";
				return `#${d.id} ${d.title} (${d.type}, ${d.status})${tags}\n\n${str(d.body, 8e3)}`;
			}
			const q = str(input?.query, 100).toLowerCase();
			const status = [
				"draft",
				"final",
				"archived"
			].includes(input?.status) ? input.status : void 0;
			const matches = listDeliverables(status ? { status } : {}).filter((d) => {
				if (!q) return true;
				return d.title.toLowerCase().includes(q) || d.body.toLowerCase().includes(q) || (d.tags ?? []).some((t) => t.toLowerCase().includes(q));
			}).slice(0, 10);
			if (!matches.length) return "No matching deliverables. Use create_deliverable to make one.";
			return ["Deliverables (open one by id for its full body):", ...matches.map((d) => `- #${d.id} [${d.type}/${d.status}] ${d.title}: ${truncate(d.body, 160)}`)].join("\n");
		}
	},
	{
		name: "read_note",
		kind: "read",
		description: "Read one of the user’s notes in full by its #id (the ids shown in search_context). Returns the title, tags, and complete content — use this when a note’s context excerpt is truncated and you need the whole thing. Read-only.",
		inputSchema: {
			type: "object",
			properties: { id: {
				type: "number",
				description: "The note #id (e.g. 42 from context) to open in full."
			} },
			required: ["id"]
		},
		run(input) {
			const id = Number(input?.id);
			if (!Number.isInteger(id) || id <= 0) return "Provide a valid note id (e.g. id=42).";
			const note = getNote(id);
			if (!note) return `No note with id ${id}.`;
			const tags = note.tags?.length ? ` [${note.tags.join(", ")}]` : "";
			return `#${note.id} ${note.title}${tags}\n\n${str(note.content, 8e3)}`;
		}
	}
];
//#endregion
//#region src/lib/server/ai/tools/internal/helpers.js
var helpers_exports = /* @__PURE__ */ __exportAll({
	AGENT_STATUSES: () => AGENT_STATUSES$1,
	EVENT_CATEGORIES: () => EVENT_CATEGORIES$1,
	PRIORITIES: () => PRIORITIES$1,
	PROJECT_STATUSES: () => PROJECT_STATUSES$1,
	resolveCollectorInstance: () => resolveCollectorInstance$1,
	toIso: () => toIso$1
});
var PRIORITIES$1 = [
	"low",
	"medium",
	"high"
];
var EVENT_CATEGORIES$1 = [
	"work",
	"personal",
	"health",
	"growth"
];
var PROJECT_STATUSES$1 = [
	"active",
	"planning",
	"on_hold",
	"done"
];
var AGENT_STATUSES$1 = ["active", "inactive"];
function toIso$1(date, time) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date ?? "").trim())) return null;
	const d = /* @__PURE__ */ new Date(`${date}T${time || "00:00"}`);
	return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
function resolveCollectorInstance$1(providerType) {
	const existing = getPrimaryInstance(providerType);
	if (existing) return existing;
	return findOrCreateInstance({
		name: providerType,
		type: providerType
	});
}
//#endregion
//#region src/lib/server/db/collectors.js
var COLLECTOR_STATUSES = [
	"idle",
	"running",
	"error"
];
var selectBase = `
	SELECT c.id, c.instance_id AS instanceId, s.name AS instanceName, s.type AS instanceType,
		c.name, c.type, c.input_json AS inputJson, c.schedule_minutes AS scheduleMinutes,
		c.cursor, c.enabled, c.notify, c.status, c.last_run_at AS lastRunAt, c.last_error AS lastError,
		c.agent_id AS agentId, ag.name AS agentName,
		c.created_at AS createdAt, c.updated_at AS updatedAt,
		(SELECT COUNT(*) FROM records rec WHERE rec.collector_id = c.id) AS recordCount
	FROM research_collectors c
	LEFT JOIN research_instances s ON s.id = c.instance_id
	LEFT JOIN agents ag ON ag.id = c.agent_id
`;
function safeParse(raw, fallback) {
	try {
		const value = JSON.parse(raw);
		return value && typeof value === "object" ? value : fallback;
	} catch {
		return fallback;
	}
}
function mapCollector(row) {
	if (!row) return null;
	return {
		...row,
		input: safeParse(row.inputJson, {}),
		enabled: Boolean(row.enabled),
		notify: Boolean(row.notify)
	};
}
var intOrNull = (value) => Number.isFinite(Number(value)) && Number(value) > 0 ? Math.round(Number(value)) : null;
function listCollectors({ instanceId } = {}) {
	if (intOrNull(instanceId)) return db.prepare(`${selectBase} WHERE c.instance_id = ? ORDER BY c.created_at DESC`).all(Number(instanceId)).map(mapCollector);
	return db.prepare(`${selectBase} ORDER BY c.created_at DESC`).all().map(mapCollector);
}
function getCollector(id) {
	return mapCollector(db.prepare(`${selectBase} WHERE c.id = ?`).get(id));
}
/**
* Enabled collectors that are due for a run (never run, or last run older than
* their cadence), oldest-first so they round-robin across scheduler ticks.
* Manual-only collectors (schedule_minutes IS NULL) are excluded.
*/
function listDueCollectors() {
	return db.prepare(`${selectBase}
			 WHERE c.enabled = 1 AND c.schedule_minutes IS NOT NULL
			   AND (
			     c.last_run_at IS NULL
			     OR datetime(c.last_run_at, '+' || c.schedule_minutes || ' minutes') <= datetime('now')
			   )
			 ORDER BY c.last_run_at IS NULL DESC, c.last_run_at ASC`).all().map(mapCollector);
}
function createCollector({ instanceId, name, type, input = {}, scheduleMinutes = null, notify = false, agentId = null, cursor = null }) {
	const info = db.prepare(`INSERT INTO research_collectors (instance_id, name, type, input_json, schedule_minutes, notify, agent_id, cursor)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(Number(instanceId), String(name), String(type), JSON.stringify(input ?? {}), intOrNull(scheduleMinutes), notify ? 1 : 0, intOrNull(agentId), cursor != null ? String(cursor) : null);
	return getCollector(Number(info.lastInsertRowid));
}
function updateCollector(id, { name, type, input, scheduleMinutes, notify, enabled, agentId } = {}) {
	db.prepare(`UPDATE research_collectors SET
			name = COALESCE(?, name),
			type = COALESCE(?, type),
			input_json = COALESCE(?, input_json),
			schedule_minutes = CASE WHEN ? THEN ? ELSE schedule_minutes END,
			notify = COALESCE(?, notify),
			enabled = COALESCE(?, enabled),
			agent_id = CASE WHEN ? THEN ? ELSE agent_id END,
			updated_at = datetime('now')
		 WHERE id = ?`).run(name != null ? String(name) : null, type != null ? String(type) : null, input != null ? JSON.stringify(input) : null, scheduleMinutes !== void 0 ? 1 : 0, intOrNull(scheduleMinutes), notify == null ? null : notify ? 1 : 0, enabled == null ? null : enabled ? 1 : 0, agentId !== void 0 ? 1 : 0, intOrNull(agentId), id);
	return getCollector(id);
}
function setCollectorStatus(id, status) {
	db.prepare(`UPDATE research_collectors SET status = ? WHERE id = ?`).run(COLLECTOR_STATUSES.includes(status) ? status : "idle", id);
}
/**
* Record the outcome of a run: stamp last_run_at, advance the cursor, and set
* status/last_error. Pass `error` to mark the collector errored; otherwise it
* goes back to idle and the error is cleared.
*/
function markCollectorRun(id, { cursor, error = null } = {}) {
	db.prepare(`UPDATE research_collectors SET
			last_run_at = datetime('now'),
			cursor = COALESCE(?, cursor),
			status = ?,
			last_error = ?,
			updated_at = datetime('now')
		 WHERE id = ?`).run(cursor != null ? String(cursor) : null, error ? "error" : "idle", error ? String(error) : null, id);
	return getCollector(id);
}
function deleteCollector(id) {
	return db.prepare(`DELETE FROM research_collectors WHERE id = ?`).run(id).changes > 0;
}
//#endregion
//#region src/lib/server/ai/tools/internal/records.js
var records_exports = /* @__PURE__ */ __exportAll({ tools: () => tools$2 });
var tools$2 = [
	{
		name: "query_records",
		kind: "read",
		description: "Search the captured research corpus (records: tweets, token pairs, articles…) with a structured filter. This is fresh signal that adapters have already collected — prefer it over live API calls for recurring research. Read-only.",
		inputSchema: {
			type: "object",
			properties: {
				recordType: {
					type: "string",
					description: "Restrict to a record type (e.g. tweet, token_pair, article)."
				},
				contains: {
					type: "string",
					description: "Keyword that must appear anywhere in a record’s metadata."
				},
				since: {
					type: "string",
					description: "Recency window like \"24h\" or \"7d\"."
				},
				instanceId: {
					type: "number",
					description: "Restrict to one instance #id."
				},
				orderBy: {
					type: "string",
					description: "captured_at (default) or metadata.<key>, e.g. metadata.likes."
				},
				dir: {
					type: "string",
					enum: ["asc", "desc"],
					description: "Sort direction (default desc)."
				},
				limit: {
					type: "number",
					description: "Max results (1–100, default 25)."
				}
			}
		},
		run(input) {
			const filter = {
				recordType: str(input?.recordType, 40) || void 0,
				contains: str(input?.contains, 200) || void 0,
				since: str(input?.since, 12) || void 0,
				instanceId: Number(input?.instanceId) || void 0,
				orderBy: str(input?.orderBy, 40) || void 0,
				dir: input?.dir === "asc" ? "asc" : "desc",
				limit: Number(input?.limit) || 25
			};
			return formatRecords(queryRecords(filter), { limit: filter.limit });
		}
	},
	{
		name: "run_report",
		kind: "read",
		description: "Run a saved report by #id or name and return its current results. Reports are curated, named queries over records (e.g. “PulseChain KOLs”). Call with no argument to list the available reports. Read-only.",
		inputSchema: {
			type: "object",
			properties: {
				id: {
					type: "number",
					description: "Report #id to run."
				},
				name: {
					type: "string",
					description: "Report name to run (alternative to id)."
				}
			}
		},
		run(input) {
			const id = Number(input?.id);
			let report = Number.isInteger(id) && id > 0 ? getReport(id) : null;
			const name = str(input?.name, 120);
			if (!report && name) report = findReportByName(name);
			if (!report) {
				const all = listReports();
				if (!all.length) return "No reports defined yet.";
				return ["Available reports (run one by #id or name):", ...all.map((r) => `- #${r.id} ${r.name}${r.description ? ` — ${truncate(r.description, 100)}` : ""}`)].join("\n");
			}
			const rows = runReport(report.id);
			return `# ${report.name}\n${formatRecords(rows, { limit: Number(report.filter?.limit) || 25 })}`;
		}
	},
	{
		name: "list_adapters",
		kind: "read",
		description: "List the available research adapters (the collector types you can schedule with create_collector). Each shows its provider and the input shape it expects. Call this first to discover valid adapterType values and their input. Read-only.",
		inputSchema: {
			type: "object",
			properties: { provider: {
				type: "string",
				description: "Optional provider filter, e.g. twitterapi, dexscreener, viem, sourcify, xapi."
			} }
		},
		run(input) {
			const q = str(input?.provider, 40).toLowerCase();
			const defs = listAdapters().filter((d) => !q || d.provider.toLowerCase() === q || d.type.toLowerCase().includes(q));
			if (!defs.length) return q ? `No adapters for “${q}”.` : "(no adapters)";
			return defs.map((d) => `- ${d.type} [${d.provider}] — ${d.label}${d.inputHint ? `\n  input: ${d.inputHint}` : ""}`).join("\n");
		}
	},
	{
		name: "list_collectors",
		kind: "read",
		description: "List the existing research collectors with their adapter type, instance, cadence, status, captured-record count, and last run. Use before creating one to avoid duplicates. Read-only.",
		inputSchema: {
			type: "object",
			properties: { instanceId: {
				type: "number",
				description: "Optional: restrict to one instance #id."
			} }
		},
		run(input) {
			const rows = listCollectors({ instanceId: Number(input?.instanceId) || void 0 });
			if (!rows.length) return "No collectors yet. Use list_adapters, then create_collector to add one.";
			return rows.map((c) => {
				const cadence = c.scheduleMinutes ? `every ${c.scheduleMinutes}m` : "manual";
				const last = c.lastRunAt ? `last ${c.lastRunAt}` : "never run";
				const owner = c.agentName ? ` · owner ${c.agentName}` : "";
				const err = c.lastError ? ` · error: ${truncate(c.lastError, 80)}` : "";
				return `#${c.id} ${c.name} [${c.type}] — ${c.instanceName ?? "(no instance)"} · ${cadence} · ${c.status} · ${c.recordCount} records · ${last}${owner}${err}`;
			}).join("\n");
		}
	},
	{
		name: "create_collector",
		kind: "write",
		description: "Set up a scheduled research collector. Pick an adapterType (run list_adapters to see every option and its input shape — e.g. twitterapi_search, dexscreener_pairs, viem_contract_events, sourcify_fetch_contract), give it matching input and an optional cadence in minutes — new items are captured as records (and, if you own it, become your observations). Omit scheduleMinutes for a manual-only collector. STAGED for approval.",
		inputSchema: {
			type: "object",
			properties: {
				adapterType: {
					type: "string",
					description: "Which adapter the collector runs (see list_adapters for valid values)."
				},
				name: {
					type: "string",
					description: "A short label for this collector."
				},
				input: {
					type: "object",
					description: "Adapter input matching the adapter’s input hint (from list_adapters), e.g. { \"query\": \"PulseChain\" }."
				},
				scheduleMinutes: {
					type: "number",
					description: "Poll cadence in minutes (5–10080); omit for manual-only."
				}
			},
			required: ["adapterType", "name"]
		},
		normalize(input) {
			const def = getAdapterByType(str(input?.adapterType, 60));
			if (!def) throw new Error(`Unknown adapterType. Options: ${listAdapters().map((d) => d.type).join(", ")}.`);
			const name = str(input?.name, 80);
			if (!name) throw new Error("A collector name is required.");
			const jobInput = input?.input && typeof input.input === "object" && !Array.isArray(input.input) ? input.input : {};
			const sched = Number(input?.scheduleMinutes);
			const scheduleMinutes = Number.isFinite(sched) && sched > 0 ? Math.min(10080, Math.max(5, Math.round(sched))) : null;
			return {
				adapterType: def.type,
				provider: def.provider,
				name,
				input: jobInput,
				scheduleMinutes
			};
		},
		summarize(v) {
			return `Create ${v.adapterType} collector: “${v.name}”${v.scheduleMinutes ? ` every ${v.scheduleMinutes}m` : " (manual)"}`;
		},
		execute(v, ctx = {}) {
			return createCollector({
				instanceId: resolveCollectorInstance$1(v.provider).id,
				name: v.name,
				type: v.adapterType,
				input: v.input,
				scheduleMinutes: v.scheduleMinutes,
				agentId: ctx.agentId ?? null
			});
		}
	}
];
//#endregion
//#region src/lib/server/ai/tools/internal/workspace.js
var workspace_exports = /* @__PURE__ */ __exportAll({ tools: () => tools$1 });
var tools$1 = [
	{
		name: "create_task",
		kind: "write",
		description: "Create a new task on the user’s task list.",
		inputSchema: {
			type: "object",
			properties: {
				title: { type: "string" },
				description: { type: "string" },
				priority: {
					type: "string",
					enum: PRIORITIES$1
				},
				dueDate: {
					type: "string",
					description: "Optional due date, YYYY-MM-DD."
				}
			},
			required: ["title"]
		},
		normalize(input) {
			const title = str(input?.title, 200);
			if (!title) throw new Error("A task title is required.");
			const priority = PRIORITIES$1.includes(input?.priority) ? input.priority : "medium";
			const dueDate = /^\d{4}-\d{2}-\d{2}$/.test(String(input?.dueDate ?? "").trim()) ? String(input.dueDate).trim() : null;
			return {
				title,
				description: str(input?.description, 1e3),
				priority,
				dueDate
			};
		},
		summarize(v) {
			return `Create task: “${v.title}” [${v.priority}]${v.dueDate ? `, due ${v.dueDate}` : ""}`;
		},
		execute(v) {
			return createTask(v);
		}
	},
	{
		name: "update_task",
		kind: "write",
		description: "Update an existing task: title, description, priority, due date, or mark it done/reopened.",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "number" },
				title: { type: "string" },
				description: { type: "string" },
				priority: {
					type: "string",
					enum: PRIORITIES$1
				},
				dueDate: {
					type: "string",
					description: "YYYY-MM-DD, or empty to clear."
				},
				done: {
					type: "boolean",
					description: "true to complete, false to reopen."
				}
			},
			required: ["id"]
		},
		normalize(input) {
			const id = Number(input?.id);
			if (!id) throw new Error("A task id is required.");
			const existing = getTask(id);
			if (!existing) throw new Error(`No task with id ${id}.`);
			const value = {
				id,
				existingTitle: existing.title
			};
			if (input?.title != null) value.title = str(input.title, 200);
			if (input?.description != null) value.description = str(input.description, 1e3);
			if (PRIORITIES$1.includes(input?.priority)) value.priority = input.priority;
			if (input?.dueDate != null) {
				const d = String(input.dueDate).trim();
				value.dueDate = /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : null;
			}
			if (typeof input?.done === "boolean") value.done = input.done;
			return value;
		},
		summarize(v) {
			const bits = [];
			if (v.done === true) bits.push("mark done");
			if (v.done === false) bits.push("reopen");
			if (v.priority) bits.push(`priority ${v.priority}`);
			if (v.dueDate) bits.push(`due ${v.dueDate}`);
			const extra = bits.length ? ` — ${bits.join(", ")}` : "";
			return `Update task #${v.id} (“${v.existingTitle}”)${extra}`;
		},
		execute(v) {
			const existing = getTask(v.id);
			updateTask(v.id, {
				title: v.title,
				description: v.description,
				priority: v.priority,
				dueDate: v.dueDate !== void 0 ? v.dueDate : existing?.dueDate ?? null,
				projectId: existing?.projectId ?? null
			});
			if (v.done !== void 0) setTaskDone(v.id, v.done);
			return getTask(v.id);
		}
	},
	{
		name: "create_note",
		kind: "write",
		description: "Save a note for the user, optionally with keyword tags.",
		inputSchema: {
			type: "object",
			properties: {
				title: { type: "string" },
				content: { type: "string" },
				tags: {
					type: "array",
					items: { type: "string" }
				}
			},
			required: ["title"]
		},
		normalize(input) {
			const title = str(input?.title, 200);
			if (!title) throw new Error("A note title is required.");
			const tags = Array.isArray(input?.tags) ? input.tags.map((t) => str(t, 40)).filter(Boolean) : [];
			return {
				title,
				content: str(input?.content, 5e3),
				tags
			};
		},
		summarize(v) {
			return `Create note: “${v.title}”${v.tags.length ? ` (${v.tags.join(", ")})` : ""}`;
		},
		execute(v) {
			return createNote(v);
		}
	},
	{
		name: "create_deliverable",
		kind: "write",
		description: "Save a finished artifact you produced (report, content draft, spec, plan) as a deliverable the director can review, refine, and publish. Use type \"reference\" for living reference material you maintain and reuse over time (curated lists, datasets, standing context) — but first search_deliverables to see if one already exists and update_deliverable it instead of creating a duplicate.",
		inputSchema: {
			type: "object",
			properties: {
				title: { type: "string" },
				body: {
					type: "string",
					description: "The artifact content (markdown)."
				},
				type: {
					type: "string",
					enum: DELIVERABLE_TYPES
				},
				projectId: {
					type: "number",
					description: "Optional project id (#id from context) this belongs to."
				},
				tags: {
					type: "array",
					items: { type: "string" }
				}
			},
			required: ["title", "body"]
		},
		normalize(input) {
			const title = str(input?.title, 200);
			if (!title) throw new Error("A deliverable title is required.");
			const body = str(input?.body, 2e4);
			if (!body) throw new Error("A deliverable needs body content.");
			const type = DELIVERABLE_TYPES.includes(input?.type) ? input.type : "note";
			const tags = Array.isArray(input?.tags) ? input.tags.map((t) => str(t, 40)).filter(Boolean) : [];
			return {
				title,
				body,
				type,
				projectId: Number(input?.projectId) || null,
				tags
			};
		},
		summarize(v) {
			return `Create ${v.type}: “${v.title}”`;
		},
		execute(v, ctx = {}) {
			return createDeliverable({
				...v,
				agentId: ctx.agentId ?? null,
				sourceDispatchId: ctx.dispatchId ?? ""
			});
		}
	},
	{
		name: "update_deliverable",
		kind: "write",
		description: "Revise an existing deliverable (by #id) — its content, title, type, or tags.",
		inputSchema: {
			type: "object",
			properties: {
				id: {
					type: "number",
					description: "Deliverable #id from context."
				},
				title: { type: "string" },
				body: { type: "string" },
				type: {
					type: "string",
					enum: DELIVERABLE_TYPES
				},
				tags: {
					type: "array",
					items: { type: "string" }
				}
			},
			required: ["id"]
		},
		normalize(input) {
			const id = Number(input?.id);
			if (!Number.isInteger(id) || id <= 0) throw new Error("A deliverable id is required to update.");
			const patch = { id };
			if (input?.title != null) patch.title = str(input.title, 200);
			if (input?.body != null) patch.body = str(input.body, 2e4);
			if (input?.type != null && DELIVERABLE_TYPES.includes(input.type)) patch.type = input.type;
			if (Array.isArray(input?.tags)) patch.tags = input.tags.map((t) => str(t, 40)).filter(Boolean);
			return patch;
		},
		summarize(v) {
			return `Update deliverable #${v.id}`;
		},
		execute(v) {
			const { id, ...rest } = v;
			return updateDeliverable(id, rest);
		}
	},
	{
		name: "create_event",
		kind: "write",
		description: "Add an event to the user’s schedule.",
		inputSchema: {
			type: "object",
			properties: {
				title: { type: "string" },
				date: {
					type: "string",
					description: "YYYY-MM-DD."
				},
				startTime: {
					type: "string",
					description: "24-hour HH:MM."
				},
				endTime: {
					type: "string",
					description: "Optional 24-hour HH:MM."
				},
				category: {
					type: "string",
					enum: EVENT_CATEGORIES$1
				}
			},
			required: [
				"title",
				"date",
				"startTime"
			]
		},
		normalize(input) {
			const title = str(input?.title, 200);
			if (!title) throw new Error("An event title is required.");
			const start = toIso$1(input?.date, str(input?.startTime, 5));
			if (!start) throw new Error("A valid date and start time are required.");
			return {
				title,
				startTime: start,
				endTime: input?.endTime ? toIso$1(input.date, str(input.endTime, 5)) : null,
				category: EVENT_CATEGORIES$1.includes(input?.category) ? input.category : "personal",
				label: `${input.date} ${input.startTime}`
			};
		},
		summarize(v) {
			return `Add event: “${v.title}” on ${v.label} [${v.category}]`;
		},
		execute(v) {
			return createEvent({
				title: v.title,
				startTime: v.startTime,
				endTime: v.endTime,
				category: v.category
			});
		}
	},
	{
		name: "create_goal",
		kind: "write",
		description: "Create a new high-level goal for the user.",
		inputSchema: {
			type: "object",
			properties: {
				title: { type: "string" },
				description: { type: "string" }
			},
			required: ["title"]
		},
		normalize(input) {
			const title = str(input?.title, 200);
			if (!title) throw new Error("A goal title is required.");
			return {
				title,
				description: str(input?.description, 1e3)
			};
		},
		summarize(v) {
			return `Create goal: “${v.title}”`;
		},
		execute(v) {
			return createGoal(v);
		}
	},
	{
		name: "update_goal",
		kind: "write",
		description: "Update an existing goal’s title or description, or mark it achieved/unachieved.",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "number" },
				title: { type: "string" },
				description: { type: "string" },
				achieved: {
					type: "boolean",
					description: "true to mark achieved, false to reopen."
				}
			},
			required: ["id"]
		},
		normalize(input) {
			const id = Number(input?.id);
			if (!id) throw new Error("A goal id is required.");
			const existing = getGoal(id);
			if (!existing) throw new Error(`No goal with id ${id}.`);
			const value = {
				id,
				existingTitle: existing.title
			};
			if (input?.title != null) value.title = str(input.title, 200);
			if (input?.description != null) value.description = str(input.description, 1e3);
			if (typeof input?.achieved === "boolean") value.achieved = input.achieved;
			return value;
		},
		summarize(v) {
			const bits = [];
			if (v.achieved === true) bits.push("mark achieved");
			if (v.achieved === false) bits.push("reopen");
			const extra = bits.length ? ` — ${bits.join(", ")}` : "";
			return `Update goal #${v.id} (“${v.existingTitle}”)${extra}`;
		},
		execute(v) {
			if (v.title !== void 0 || v.description !== void 0) updateGoal(v.id, {
				title: v.title,
				description: v.description
			});
			if (v.achieved !== void 0 && getGoal(v.id)?.achieved !== v.achieved) toggleAchieved(v.id);
			return getGoal(v.id);
		}
	},
	{
		name: "create_project",
		kind: "write",
		description: "Create a new project / product line.",
		inputSchema: {
			type: "object",
			properties: {
				name: { type: "string" },
				description: { type: "string" },
				status: {
					type: "string",
					enum: PROJECT_STATUSES$1
				}
			},
			required: ["name"]
		},
		normalize(input) {
			const name = str(input?.name, 200);
			if (!name) throw new Error("A project name is required.");
			const status = PROJECT_STATUSES$1.includes(input?.status) ? input.status : "active";
			return {
				name,
				description: str(input?.description, 1e3),
				status
			};
		},
		summarize(v) {
			return `Create project: “${v.name}” [${v.status}]`;
		},
		execute(v) {
			return createProject(v);
		}
	},
	{
		name: "update_project",
		kind: "write",
		description: "Update an existing project’s name, description, or status.",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "number" },
				name: { type: "string" },
				description: { type: "string" },
				status: {
					type: "string",
					enum: PROJECT_STATUSES$1
				}
			},
			required: ["id"]
		},
		normalize(input) {
			const id = Number(input?.id);
			if (!id) throw new Error("A project id is required.");
			const existing = getProject(id);
			if (!existing) throw new Error(`No project with id ${id}.`);
			const value = {
				id,
				existingName: existing.name
			};
			if (input?.name != null) value.name = str(input.name, 200);
			if (input?.description != null) value.description = str(input.description, 1e3);
			if (PROJECT_STATUSES$1.includes(input?.status)) value.status = input.status;
			return value;
		},
		summarize(v) {
			const extra = v.status ? ` — ${v.status}` : "";
			return `Update project #${v.id} (“${v.existingName}”)${extra}`;
		},
		execute(v) {
			const existing = getProject(v.id);
			return updateProject(v.id, {
				name: v.name,
				description: v.description,
				status: v.status,
				paid: existing?.paid ?? false,
				humanId: existing?.humanId ?? null
			});
		}
	}
];
//#endregion
//#region src/lib/server/ai/tools/internal/people.js
var people_exports = /* @__PURE__ */ __exportAll({ tools: () => tools });
var tools = [
	{
		name: "list_agents",
		kind: "read",
		description: "List the agents (teammates) with their ids, status, granted tools, and which profile fields are filled vs. empty. Use this before updating an agent.",
		inputSchema: {
			type: "object",
			properties: { query: {
				type: "string",
				description: "Optional name/title filter."
			} }
		},
		run(input) {
			const q = str(input?.query, 80).toLowerCase();
			const rows = listAgents().filter((a) => !q || `${a.name} ${a.title}`.toLowerCase().includes(q));
			if (!rows.length) return "(no agents)";
			return rows.map((a) => {
				const text = [
					["persona", a.persona],
					["beliefs", a.beliefs],
					["communicationStyle", a.communicationStyle],
					["decisionStyle", a.decisionStyle],
					["motivations", a.motivations],
					["background", a.background],
					["experience", a.experience],
					["specialization", a.specialization]
				];
				const empty = text.filter(([, v]) => !String(v ?? "").trim()).map(([k]) => k);
				for (const k of [
					"skills",
					"strengths",
					"tools"
				]) if (!(Array.isArray(a[k]) && a[k].length)) empty.push(k);
				const filled = text.filter(([, v]) => String(v ?? "").trim()).map(([k]) => k);
				return [
					`#${a.id} ${a.name} — ${a.title || "(no title)"} [${a.status}]`,
					`  filled: ${filled.join(", ") || "(none)"}`,
					`  empty: ${empty.join(", ") || "(none)"}`,
					`  tools: ${(a.tools ?? []).join(", ") || "(none)"}`
				].join("\n");
			}).join("\n");
		}
	},
	{
		name: "list_humans",
		kind: "read",
		description: "List people / contacts with their ids and which fields are filled vs. empty.",
		inputSchema: {
			type: "object",
			properties: { query: {
				type: "string",
				description: "Optional username filter."
			} }
		},
		run(input) {
			const q = str(input?.query, 80).toLowerCase();
			const rows = listHumans().filter((h) => !q || String(h.username).toLowerCase().includes(q));
			if (!rows.length) return "(no contacts)";
			return rows.map((h) => {
				const empty = [
					["tgUsername", h.tgUsername],
					["twitterUsername", h.twitterUsername],
					["phone", h.phone],
					["email", h.email],
					["evmAddress", h.evmAddress],
					["notes", h.notes]
				].filter(([, v]) => !String(v ?? "").trim()).map(([k]) => k);
				const x = String(h.twitterUsername ?? "").trim();
				const handle = x ? ` — X: @${x.replace(/^@/, "")}` : "";
				return `#${h.id} ${h.username}${handle}${empty.length ? ` — empty: ${empty.join(", ")}` : ""}`;
			}).join("\n");
		}
	},
	{
		name: "create_agent",
		kind: "write",
		description: "Create a new agent — a persistent persona / teammate in the workforce.",
		inputSchema: {
			type: "object",
			properties: {
				name: { type: "string" },
				title: { type: "string" },
				description: { type: "string" },
				persona: {
					type: "string",
					description: "How this agent thinks and behaves."
				},
				beliefs: {
					type: "string",
					description: "Core beliefs / principles."
				},
				motivations: {
					type: "string",
					description: "What drives this agent."
				},
				communicationStyle: { type: "string" },
				decisionStyle: {
					type: "string",
					description: "How this agent makes decisions."
				},
				background: { type: "string" },
				experience: { type: "string" },
				specialization: { type: "string" },
				skills: {
					type: "array",
					items: { type: "string" }
				},
				strengths: {
					type: "array",
					items: { type: "string" }
				},
				tools: {
					type: "array",
					items: { type: "string" },
					description: "Capability labels, e.g. Tasks, Notes."
				},
				status: {
					type: "string",
					enum: AGENT_STATUSES$1
				}
			},
			required: ["name"]
		},
		normalize(input) {
			const name = str(input?.name, 120);
			if (!name) throw new Error("An agent name is required.");
			return {
				name,
				title: str(input?.title, 120),
				description: str(input?.description, 500),
				persona: str(input?.persona, 1e3),
				beliefs: str(input?.beliefs, 1e3),
				motivations: str(input?.motivations, 1e3),
				communicationStyle: str(input?.communicationStyle, 1e3),
				decisionStyle: str(input?.decisionStyle, 1e3),
				background: str(input?.background, 1e3),
				experience: str(input?.experience, 1e3),
				specialization: str(input?.specialization, 300),
				skills: toStrArray(input?.skills),
				strengths: toStrArray(input?.strengths),
				tools: toStrArray(input?.tools),
				status: AGENT_STATUSES$1.includes(input?.status) ? input.status : "active"
			};
		},
		summarize(v) {
			return `Create agent: “${v.name}”${v.title ? ` · ${v.title}` : ""}`;
		},
		execute(v) {
			return createAgent(v);
		}
	},
	{
		name: "update_agent",
		kind: "write",
		description: "Update an existing agent’s identity, persona, skills, or granted tools.",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "number" },
				name: { type: "string" },
				title: { type: "string" },
				description: { type: "string" },
				persona: { type: "string" },
				beliefs: { type: "string" },
				motivations: { type: "string" },
				communicationStyle: { type: "string" },
				decisionStyle: { type: "string" },
				background: { type: "string" },
				experience: { type: "string" },
				specialization: { type: "string" },
				skills: {
					type: "array",
					items: { type: "string" }
				},
				strengths: {
					type: "array",
					items: { type: "string" }
				},
				tools: {
					type: "array",
					items: { type: "string" }
				},
				status: {
					type: "string",
					enum: AGENT_STATUSES$1
				}
			},
			required: ["id"]
		},
		normalize(input) {
			const id = Number(input?.id);
			if (!id) throw new Error("An agent id is required.");
			const existing = getAgent(id);
			if (!existing) throw new Error(`No agent with id ${id}.`);
			const value = {
				id,
				existingName: existing.name
			};
			if (input?.name != null) value.name = str(input.name, 120);
			if (input?.title != null) value.title = str(input.title, 120);
			if (input?.description != null) value.description = str(input.description, 500);
			if (input?.persona != null) value.persona = str(input.persona, 1e3);
			if (input?.beliefs != null) value.beliefs = str(input.beliefs, 1e3);
			if (input?.motivations != null) value.motivations = str(input.motivations, 1e3);
			if (input?.communicationStyle != null) value.communicationStyle = str(input.communicationStyle, 1e3);
			if (input?.decisionStyle != null) value.decisionStyle = str(input.decisionStyle, 1e3);
			if (input?.background != null) value.background = str(input.background, 1e3);
			if (input?.experience != null) value.experience = str(input.experience, 1e3);
			if (input?.specialization != null) value.specialization = str(input.specialization, 300);
			if (input?.skills != null) value.skills = toStrArray(input.skills);
			if (input?.strengths != null) value.strengths = toStrArray(input.strengths);
			if (input?.tools != null) value.tools = toStrArray(input.tools);
			if (AGENT_STATUSES$1.includes(input?.status)) value.status = input.status;
			return value;
		},
		summarize(v) {
			return `Update agent #${v.id} (“${v.existingName}”)`;
		},
		execute(v) {
			return updateAgent(v.id, v);
		}
	},
	{
		name: "create_human",
		kind: "write",
		description: "Add a person / contact (e.g. a client or collaborator).",
		inputSchema: {
			type: "object",
			properties: {
				username: { type: "string" },
				tgUsername: {
					type: "string",
					description: "Telegram handle."
				},
				twitterUsername: {
					type: "string",
					description: "X / Twitter handle."
				},
				phone: { type: "string" },
				email: { type: "string" },
				evmAddress: {
					type: "string",
					description: "EVM wallet address."
				},
				notes: {
					type: "string",
					description: "Freeform notes (e.g. social bio, follower stats, context)."
				}
			},
			required: ["username"]
		},
		normalize(input) {
			const username = str(input?.username, 80);
			if (!username) throw new Error("A username is required.");
			return {
				username,
				tgUsername: str(input?.tgUsername, 80),
				twitterUsername: str(input?.twitterUsername, 80),
				phone: str(input?.phone, 40),
				email: str(input?.email, 160),
				evmAddress: str(input?.evmAddress, 80),
				notes: str(input?.notes, 2e3)
			};
		},
		summarize(v) {
			return `Add contact: “${v.username}”`;
		},
		execute(v) {
			return createHuman(v);
		}
	},
	{
		name: "update_human",
		kind: "write",
		description: "Update a person / contact’s details.",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "number" },
				username: { type: "string" },
				tgUsername: { type: "string" },
				twitterUsername: { type: "string" },
				phone: { type: "string" },
				email: { type: "string" },
				evmAddress: { type: "string" },
				notes: {
					type: "string",
					description: "Freeform notes (e.g. social bio, follower stats, context)."
				}
			},
			required: ["id"]
		},
		normalize(input) {
			const id = Number(input?.id);
			if (!id) throw new Error("A contact id is required.");
			const existing = getHuman(id);
			if (!existing) throw new Error(`No contact with id ${id}.`);
			const value = {
				id,
				existingName: existing.username
			};
			if (input?.username != null) value.username = str(input.username, 80);
			if (input?.tgUsername != null) value.tgUsername = str(input.tgUsername, 80);
			if (input?.twitterUsername != null) value.twitterUsername = str(input.twitterUsername, 80);
			if (input?.phone != null) value.phone = str(input.phone, 40);
			if (input?.email != null) value.email = str(input.email, 160);
			if (input?.evmAddress != null) value.evmAddress = str(input.evmAddress, 80);
			if (input?.notes != null) value.notes = str(input.notes, 2e3);
			return value;
		},
		summarize(v) {
			return `Update contact #${v.id} (“${v.existingName}”)`;
		},
		execute(v) {
			return updateHuman(v.id, v);
		}
	},
	{
		name: "assign_task",
		kind: "write",
		description: "Delegate work to a teammate agent by creating a task on their to-do list. Use list_agents first to pick the right agent id. The task appears as a proposal on their list for the principal to trigger — it is not run automatically — so delegate sparingly and only what is clearly needed.",
		inputSchema: {
			type: "object",
			properties: {
				agentId: {
					type: "number",
					description: "The id of the agent to assign the task to."
				},
				title: {
					type: "string",
					description: "Short, action-oriented task title."
				},
				description: {
					type: "string",
					description: "Concrete detail / acceptance criteria."
				},
				priority: {
					type: "string",
					enum: PRIORITIES$1
				}
			},
			required: ["agentId", "title"]
		},
		normalize(input) {
			const agentId = Number(input?.agentId);
			if (!agentId) throw new Error("A target agent id is required.");
			const target = getAgent(agentId);
			if (!target) throw new Error(`No agent with id ${agentId}.`);
			const title = str(input?.title, 200);
			if (!title) throw new Error("A task title is required.");
			const priority = PRIORITIES$1.includes(input?.priority) ? input.priority : "medium";
			return {
				agentId,
				targetName: target.name,
				title,
				description: str(input?.description, 1e3),
				priority
			};
		},
		summarize(v) {
			return `Assign to ${v.targetName} (#${v.agentId}): “${v.title}” [${v.priority}]`;
		},
		execute(v, ctx) {
			const title = v.title.trim().toLowerCase();
			const existing = listAgentTasks(v.agentId).find((t) => t.status !== "done" && t.title.trim().toLowerCase() === title);
			if (existing) return existing.id;
			return createAgentTask(v.agentId, {
				title: v.title,
				description: v.description,
				priority: v.priority,
				createdByAgentId: ctx?.agentId ?? null
			});
		}
	}
];
//#endregion
//#region src/lib/server/ai/tools/internal/index.js
var internal_exports = /* @__PURE__ */ __exportAll({ INTERNAL_TOOLS: () => INTERNAL_TOOLS$1 });
function indexTools(tools) {
	return Object.fromEntries(tools.map((t) => [t.name, t]));
}
var INTERNAL_TOOLS$1 = {
	...indexTools(tools$3),
	...indexTools(tools$2),
	...indexTools(tools$1),
	...indexTools(tools)
};
//#endregion
//#region src/lib/server/ai/tools/twitterapi/action.js
var action_exports = /* @__PURE__ */ __exportAll({ tool: () => tool$1 });
var snip = (text) => {
	const s = String(text ?? "").trim();
	return `“${s.length > 80 ? `${s.slice(0, 80)}…` : s}”`;
};
var tool$1 = {
	name: "twitterapi_action",
	kind: "write",
	capability: {
		id: "Twitter Write",
		description: "Act on X as the configured account: post, reply, like, retweet, follow, DM (staged for approval)."
	},
	aliases: ["twitter write"],
	available: () => {
		const v = getProviderValues("twitterapi");
		return Boolean(v.apiKey && v.loginCookies && v.proxy);
	},
	description: "Act on X/Twitter as the configured account: post a tweet, reply, like, retweet, follow a user, or DM. STAGED for the user’s approval — nothing posts until approved. Resolve a handle to its numeric user id via twitterapi_read user_info first for follow/dm.",
	inputSchema: {
		type: "object",
		properties: {
			action: {
				type: "string",
				enum: [
					"post",
					"reply",
					"like",
					"retweet",
					"follow",
					"dm"
				],
				description: "What to do."
			},
			text: {
				type: "string",
				description: "Tweet/reply/DM text (post, reply, dm)."
			},
			tweetId: {
				type: "string",
				description: "Target tweet id (reply, like, retweet)."
			},
			userId: {
				type: "string",
				description: "Target numeric user id (follow, dm)."
			}
		},
		required: ["action"]
	},
	normalize(input) {
		const action = str(input?.action, 12).toLowerCase();
		const text = String(input?.text ?? "").trim().slice(0, 4e3);
		const tweetId = str(input?.tweetId, 32);
		const userId = str(input?.userId, 32);
		if (action === "post") {
			if (!text) throw new Error("Tweet text is required.");
			return {
				action,
				text
			};
		}
		if (action === "reply") {
			if (!text) throw new Error("Reply text is required.");
			if (!tweetId) throw new Error("A target tweetId is required to reply.");
			return {
				action,
				text,
				tweetId
			};
		}
		if (action === "like" || action === "retweet") {
			if (!tweetId) throw new Error(`A tweetId is required to ${action}.`);
			return {
				action,
				tweetId
			};
		}
		if (action === "follow") {
			if (!userId) throw new Error("A numeric userId is required to follow.");
			return {
				action,
				userId
			};
		}
		if (action === "dm") {
			if (!userId) throw new Error("A numeric userId is required to DM.");
			if (!text) throw new Error("DM text is required.");
			return {
				action,
				userId,
				text
			};
		}
		throw new Error("Unknown twitterapi_action action.");
	},
	summarize(v) {
		if (v.action === "post") return `Post to X: ${snip(v.text)}`;
		if (v.action === "reply") return `Reply to tweet ${v.tweetId}: ${snip(v.text)}`;
		if (v.action === "like") return `Like tweet ${v.tweetId}`;
		if (v.action === "retweet") return `Retweet ${v.tweetId}`;
		if (v.action === "follow") return `Follow user ${v.userId}`;
		if (v.action === "dm") return `DM user ${v.userId}: ${snip(v.text)}`;
		return "X action";
	},
	execute(v) {
		if (v.action === "post") return twitterCreateTweet({ text: v.text });
		if (v.action === "reply") return twitterCreateTweet({
			text: v.text,
			replyToTweetId: v.tweetId
		});
		if (v.action === "like") return twitterLike(v.tweetId);
		if (v.action === "retweet") return twitterRetweet(v.tweetId);
		if (v.action === "follow") return twitterFollow(v.userId);
		if (v.action === "dm") return twitterSendDm({
			userId: v.userId,
			text: v.text
		});
		throw new Error("Unknown twitterapi_action action.");
	}
};
//#endregion
//#region src/lib/server/ai/tools/viem/write.js
var write_exports = /* @__PURE__ */ __exportAll({ tool: () => tool });
var coerceArg = (a) => typeof a === "string" && /^\d+$/.test(a) ? BigInt(a) : a;
var tool = {
	name: "viem_write",
	kind: "write",
	capability: {
		id: "Chain Write",
		description: "Send EVM transactions: native transfers, typed contract writes, ERC-20 transfers and approvals (staged for approval)."
	},
	aliases: [
		"chain write",
		"evm write",
		"viem write"
	],
	available: () => {
		const v = getProviderValues("viem");
		return Boolean(v.rpcUrl && v.privateKey);
	},
	description: "Send EVM transactions as the configured wallet: native coin transfer, typed contract write with human-readable ABI, ERC-20 transfer, or ERC-20 approve. STAGED for user approval — nothing is broadcast until confirmed. Use viem_read token_info to look up decimals before token actions.",
	inputSchema: {
		type: "object",
		properties: {
			action: {
				type: "string",
				enum: [
					"send",
					"write_contract",
					"transfer_erc20",
					"approve_erc20"
				],
				description: "What to do."
			},
			to: {
				type: "string",
				description: "Recipient address (0x…) for send or transfer_erc20."
			},
			value: {
				type: "string",
				description: "Amount in native coin (e.g. \"0.5\") for send."
			},
			data: {
				type: "string",
				description: "Optional hex calldata for send."
			},
			address: {
				type: "string",
				description: "Contract address (0x…) for write_contract."
			},
			abi: {
				type: "string",
				description: "Human-readable function signature for write_contract, e.g. \"function harvest() external\" or \"function deposit(uint256 amount) external\"."
			},
			functionName: {
				type: "string",
				description: "Function name for write_contract."
			},
			args: {
				type: "array",
				description: "Function arguments for write_contract. Use strings for large integers (e.g. \"1000000000000000000\")."
			},
			tokenAddress: {
				type: "string",
				description: "ERC-20 contract address (0x…) for transfer_erc20 or approve_erc20."
			},
			spender: {
				type: "string",
				description: "Spender address (0x…) for approve_erc20."
			},
			amount: {
				type: "string",
				description: "Human-readable token amount (e.g. \"1000.5\") for transfer_erc20 / approve_erc20. Use viem_read token_info to get decimals first."
			},
			decimals: {
				type: "number",
				description: "Token decimals for amount parsing (default 18 if omitted)."
			}
		},
		required: ["action"]
	},
	normalize(input) {
		const action = str(input?.action, 20).toLowerCase();
		if (action === "send") {
			const to = str(input?.to, 64);
			const value = str(input?.value, 40);
			const data = str(input?.data, 4e3) || void 0;
			if (!isAddress(to)) throw new Error("A valid 0x recipient address is required.");
			if (!value || Number.isNaN(parseFloat(value))) throw new Error("A numeric value (in native coin) is required.");
			return {
				action,
				to,
				value,
				data
			};
		}
		if (action === "write_contract") {
			const address = str(input?.address, 64);
			const abiStr = str(input?.abi, 600);
			const functionName = str(input?.functionName, 80);
			if (!isAddress(address)) throw new Error("A valid 0x contract address is required.");
			if (!abiStr) throw new Error("An ABI string is required, e.g. \"function harvest() external\".");
			if (!functionName) throw new Error("A functionName is required.");
			return {
				action,
				address,
				abi: abiStr,
				functionName,
				args: Array.isArray(input?.args) ? input.args : []
			};
		}
		if (action === "transfer_erc20") {
			const tokenAddress = str(input?.tokenAddress, 64);
			const to = str(input?.to, 64);
			const amount = str(input?.amount, 60);
			if (!isAddress(tokenAddress)) throw new Error("A valid 0x token contract address is required.");
			if (!isAddress(to)) throw new Error("A valid 0x recipient address is required.");
			if (!amount || Number.isNaN(parseFloat(amount))) throw new Error("A numeric token amount is required.");
			return {
				action,
				tokenAddress,
				to,
				amount,
				decimals: Number.isFinite(Number(input?.decimals)) ? Number(input.decimals) : 18
			};
		}
		if (action === "approve_erc20") {
			const tokenAddress = str(input?.tokenAddress, 64);
			const spender = str(input?.spender, 64);
			const amount = str(input?.amount, 80);
			if (!isAddress(tokenAddress)) throw new Error("A valid 0x token contract address is required.");
			if (!isAddress(spender)) throw new Error("A valid 0x spender address is required.");
			if (!amount || Number.isNaN(parseFloat(amount))) throw new Error("A numeric token amount is required.");
			return {
				action,
				tokenAddress,
				spender,
				amount,
				decimals: Number.isFinite(Number(input?.decimals)) ? Number(input.decimals) : 18
			};
		}
		throw new Error("Unknown viem_write action.");
	},
	summarize(v) {
		if (v.action === "send") return `Send ${v.value} native to ${v.to}`;
		if (v.action === "write_contract") {
			const argStr = v.args.map((a) => String(a).slice(0, 20)).join(", ");
			return `Call ${v.functionName}(${argStr}) on ${v.address}`;
		}
		if (v.action === "transfer_erc20") return `Transfer ${v.amount} tokens (${v.tokenAddress}) to ${v.to}`;
		if (v.action === "approve_erc20") return `Approve ${v.spender} to spend ${v.amount} tokens (${v.tokenAddress})`;
		return "EVM write";
	},
	async execute(v) {
		const pub = getPublicClient();
		const { client, account } = getWalletClient();
		if (v.action === "send") return { hash: await client.sendTransaction({
			account,
			to: v.to,
			value: parseEther(v.value),
			...v.data ? { data: v.data } : {}
		}) };
		if (v.action === "write_contract") {
			const abi = parseAbi([v.abi]);
			const args = v.args.map(coerceArg);
			const { request } = await pub.simulateContract({
				address: v.address,
				abi,
				functionName: v.functionName,
				args,
				account: account.address
			});
			return { hash: await client.writeContract(request) };
		}
		if (v.action === "transfer_erc20") {
			const amountRaw = parseUnits(v.amount, v.decimals);
			const { request } = await pub.simulateContract({
				address: v.tokenAddress,
				abi: ERC20_ABI,
				functionName: "transfer",
				args: [v.to, amountRaw],
				account: account.address
			});
			return { hash: await client.writeContract(request) };
		}
		if (v.action === "approve_erc20") {
			const amountRaw = parseUnits(v.amount, v.decimals);
			const { request } = await pub.simulateContract({
				address: v.tokenAddress,
				abi: ERC20_ABI,
				functionName: "approve",
				args: [v.spender, amountRaw],
				account: account.address
			});
			return { hash: await client.writeContract(request) };
		}
		throw new Error("Unknown viem_write action.");
	}
};
//#endregion
//#region src/lib/server/ai/tools/registry.js
var toolModules = /* #__PURE__ */ Object.assign({
	"./internal/context.js": context_exports,
	"./internal/helpers.js": helpers_exports,
	"./internal/index.js": internal_exports,
	"./internal/people.js": people_exports,
	"./internal/records.js": records_exports,
	"./internal/workspace.js": workspace_exports,
	"./twitterapi/action.js": action_exports,
	"./viem/write.js": write_exports
});
var PROVIDER_TOOLS = {};
for (const mod of Object.values(toolModules)) {
	const tool = mod.tool;
	if (tool?.name) PROVIDER_TOOLS[tool.name] = tool;
}
function listProviderTools() {
	return Object.values(PROVIDER_TOOLS);
}
//#endregion
//#region src/lib/server/ai/tools.js
var PRIORITIES = [
	"low",
	"medium",
	"high"
];
var EVENT_CATEGORIES = [
	"work",
	"personal",
	"health",
	"growth"
];
var PROJECT_STATUSES = [
	"active",
	"planning",
	"on_hold",
	"done"
];
async function runAdapterFetch(adapterType, adapterInput = {}, limit = 25) {
	const adapter = getAdapterByType(adapterType);
	if (!adapter) throw new Error(`Adapter "${adapterType}" not found.`);
	const instance = adapter.provider ? getPrimaryInstance(adapter.provider) : null;
	const credentials = instance ? getInstanceCredentials(instance.id) : {};
	const input = adapterInput && typeof adapterInput === "object" && !Array.isArray(adapterInput) ? adapterInput : {};
	const records = [];
	const { result, data, logs } = await runAdapter(adapter, {
		instance: instance ?? null,
		credentials,
		input,
		cursor: "",
		mode: "fetch",
		collect: (rec) => {
			if (!rec) return true;
			records.push(rec);
			return records.length < limit;
		}
	});
	return {
		data,
		result,
		records,
		logs
	};
}
async function fetchViaAdapter(adapterType, adapterInput = {}, limit = 25) {
	const { data: _data, result, records, logs } = await runAdapterFetch(adapterType, adapterInput, limit);
	if (result !== void 0 && result !== null) return typeof result === "string" ? result : JSON.stringify(result, null, 2);
	const lines = [];
	if (!records.length) lines.push("(no records returned)");
	else {
		lines.push(`${records.length} record(s) from ${adapterType}:`);
		for (const r of records) {
			const m = r.metadata ?? {};
			const meta = Object.entries(m).filter(([, v]) => v !== "" && v !== null && v !== void 0).slice(0, 8).map(([k, v]) => {
				const s = typeof v === "object" ? JSON.stringify(v) : String(v);
				return `${k}: ${s.length > 120 ? s.slice(0, 120) + "…" : s}`;
			}).join(" · ");
			lines.push(`- [${r.recordType}]${meta ? " " + meta : ""}`);
		}
	}
	if (logs.length) lines.push(`\nlogs: ${logs.join(" | ")}`);
	return lines.join("\n");
}
var AGENT_STATUSES = ["active", "inactive"];
function toIso(date, time) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date ?? "").trim())) return null;
	const d = /* @__PURE__ */ new Date(`${date}T${time || "00:00"}`);
	return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
function resolveCollectorInstance(providerType) {
	const existing = getPrimaryInstance(providerType);
	if (existing) return existing;
	return findOrCreateInstance({
		name: providerType,
		type: providerType
	});
}
var INTERNAL_TOOLS = {
	search_context: {
		name: "search_context",
		kind: "read",
		description: "Look up the user’s real goals, projects, open tasks, recurring routines, notes, and saved deliverables. Active goals are always listed in full; the optional query only narrows the longer lists (tasks, notes, projects, deliverables). Call with no query to see everything.",
		inputSchema: {
			type: "object",
			properties: { query: {
				type: "string",
				description: "Optional keyword to filter the context."
			} }
		},
		run(input) {
			return gatherContext({ query: str(input?.query, 100) });
		}
	},
	search_deliverables: {
		name: "search_deliverables",
		kind: "read",
		description: "Browse or open saved deliverables (artifacts agents produced). Pass an id (#id from context) to read one in full, or a query/status to list matches with excerpts. Read-only.",
		inputSchema: {
			type: "object",
			properties: {
				id: {
					type: "number",
					description: "Open a specific deliverable in full by its #id."
				},
				query: {
					type: "string",
					description: "Optional keyword to filter title/body/tags."
				},
				status: {
					type: "string",
					enum: [
						"draft",
						"final",
						"archived"
					],
					description: "Optional status filter."
				}
			}
		},
		run(input) {
			const id = Number(input?.id);
			if (Number.isInteger(id) && id > 0) {
				const d = getDeliverable(id);
				if (!d) return `No deliverable with id ${id}.`;
				const tags = d.tags?.length ? ` [${d.tags.join(", ")}]` : "";
				return `#${d.id} ${d.title} (${d.type}, ${d.status})${tags}\n\n${str(d.body, 8e3)}`;
			}
			const q = str(input?.query, 100).toLowerCase();
			const status = [
				"draft",
				"final",
				"archived"
			].includes(input?.status) ? input.status : void 0;
			const matches = listDeliverables(status ? { status } : {}).filter((d) => {
				if (!q) return true;
				return d.title.toLowerCase().includes(q) || d.body.toLowerCase().includes(q) || (d.tags ?? []).some((t) => t.toLowerCase().includes(q));
			}).slice(0, 10);
			if (!matches.length) return "No matching deliverables. Use create_deliverable to make one.";
			return ["Deliverables (open one by id for its full body):", ...matches.map((d) => `- #${d.id} [${d.type}/${d.status}] ${d.title}: ${truncate(d.body, 160)}`)].join("\n");
		}
	},
	read_note: {
		name: "read_note",
		kind: "read",
		description: "Read one of the user’s notes in full by its #id (the ids shown in search_context). Returns the title, tags, and complete content — use this when a note’s context excerpt is truncated and you need the whole thing. Read-only.",
		inputSchema: {
			type: "object",
			properties: { id: {
				type: "number",
				description: "The note #id (e.g. 42 from context) to open in full."
			} },
			required: ["id"]
		},
		run(input) {
			const id = Number(input?.id);
			if (!Number.isInteger(id) || id <= 0) return "Provide a valid note id (e.g. id=42).";
			const note = getNote(id);
			if (!note) return `No note with id ${id}.`;
			const tags = note.tags?.length ? ` [${note.tags.join(", ")}]` : "";
			return `#${note.id} ${note.title}${tags}\n\n${str(note.content, 8e3)}`;
		}
	},
	query_records: {
		name: "query_records",
		kind: "read",
		description: "Search the captured research corpus (records: tweets, token pairs, articles…) with a structured filter. This is fresh signal that adapters have already collected — prefer it over live API calls for recurring research. Read-only.",
		inputSchema: {
			type: "object",
			properties: {
				recordType: {
					type: "string",
					description: "Restrict to a record type (e.g. tweet, token_pair, article)."
				},
				contains: {
					type: "string",
					description: "Keyword that must appear anywhere in a record’s metadata."
				},
				since: {
					type: "string",
					description: "Recency window like \"24h\" or \"7d\"."
				},
				instanceId: {
					type: "number",
					description: "Restrict to one instance #id."
				},
				orderBy: {
					type: "string",
					description: "captured_at (default) or metadata.<key>, e.g. metadata.likes."
				},
				dir: {
					type: "string",
					enum: ["asc", "desc"],
					description: "Sort direction (default desc)."
				},
				limit: {
					type: "number",
					description: "Max results (1–100, default 25)."
				}
			}
		},
		run(input) {
			const filter = {
				recordType: str(input?.recordType, 40) || void 0,
				contains: str(input?.contains, 200) || void 0,
				since: str(input?.since, 12) || void 0,
				instanceId: Number(input?.instanceId) || void 0,
				orderBy: str(input?.orderBy, 40) || void 0,
				dir: input?.dir === "asc" ? "asc" : "desc",
				limit: Number(input?.limit) || 25
			};
			return formatRecords(queryRecords(filter), { limit: filter.limit });
		}
	},
	run_report: {
		name: "run_report",
		kind: "read",
		description: "Run a saved report by #id or name and return its current results. Reports are curated, named queries over records (e.g. “PulseChain KOLs”). Call with no argument to list the available reports. Read-only.",
		inputSchema: {
			type: "object",
			properties: {
				id: {
					type: "number",
					description: "Report #id to run."
				},
				name: {
					type: "string",
					description: "Report name to run (alternative to id)."
				}
			}
		},
		run(input) {
			const id = Number(input?.id);
			let report = Number.isInteger(id) && id > 0 ? getReport(id) : null;
			const name = str(input?.name, 120);
			if (!report && name) report = findReportByName(name);
			if (!report) {
				const all = listReports();
				if (!all.length) return "No reports defined yet.";
				return ["Available reports (run one by #id or name):", ...all.map((r) => `- #${r.id} ${r.name}${r.description ? ` — ${truncate(r.description, 100)}` : ""}`)].join("\n");
			}
			const rows = runReport(report.id);
			return `# ${report.name}\n${formatRecords(rows, { limit: Number(report.filter?.limit) || 25 })}`;
		}
	},
	list_adapters: {
		name: "list_adapters",
		kind: "read",
		description: "List the available research adapters (the collector types you can schedule with create_collector). Each shows its provider and the input shape it expects. Call this first to discover valid adapterType values and their input. Read-only.",
		inputSchema: {
			type: "object",
			properties: { provider: {
				type: "string",
				description: "Optional provider filter, e.g. twitterapi, dexscreener, viem, sourcify, xapi."
			} }
		},
		run(input) {
			const q = str(input?.provider, 40).toLowerCase();
			const defs = listAdapters().filter((d) => !q || d.provider.toLowerCase() === q || d.type.toLowerCase().includes(q));
			if (!defs.length) return q ? `No adapters for “${q}”.` : "(no adapters)";
			return defs.map((d) => `- ${d.type} [${d.provider}] — ${d.label}${d.inputHint ? `\n  input: ${d.inputHint}` : ""}`).join("\n");
		}
	},
	list_collectors: {
		name: "list_collectors",
		kind: "read",
		description: "List the existing research collectors with their adapter type, instance, cadence, status, captured-record count, and last run. Use before creating one to avoid duplicates. Read-only.",
		inputSchema: {
			type: "object",
			properties: { instanceId: {
				type: "number",
				description: "Optional: restrict to one instance #id."
			} }
		},
		run(input) {
			const rows = listCollectors({ instanceId: Number(input?.instanceId) || void 0 });
			if (!rows.length) return "No collectors yet. Use list_adapters, then create_collector to add one.";
			return rows.map((c) => {
				const cadence = c.scheduleMinutes ? `every ${c.scheduleMinutes}m` : "manual";
				const last = c.lastRunAt ? `last ${c.lastRunAt}` : "never run";
				const owner = c.agentName ? ` · owner ${c.agentName}` : "";
				const err = c.lastError ? ` · error: ${truncate(c.lastError, 80)}` : "";
				return `#${c.id} ${c.name} [${c.type}] — ${c.instanceName ?? "(no instance)"} · ${cadence} · ${c.status} · ${c.recordCount} records · ${last}${owner}${err}`;
			}).join("\n");
		}
	},
	run_adapter: {
		name: "run_adapter",
		kind: "read",
		description: "Run any adapter on-demand and get its results immediately — without scheduling a collector. Good for one-off lookups or adapters that don't have their own named tool. The adapter runs in 'fetch' mode (ctx.mode === 'fetch'): records are collected in memory and returned as text. Use list_adapters first to find valid adapterType values and their expected input.",
		inputSchema: {
			type: "object",
			properties: {
				adapterType: {
					type: "string",
					description: "The adapter type to run (see list_adapters for valid values and input hints)."
				},
				input: {
					type: "object",
					description: "Input object for the adapter, matching its input hint from list_adapters."
				},
				limit: {
					type: "number",
					description: "Max records to return (1–100, default 25)."
				}
			},
			required: ["adapterType"]
		},
		async run(input) {
			const adapterType = str(input?.adapterType, 60);
			if (!getAdapterByType(adapterType)) {
				const available = listAdapters().map((d) => d.type).join(", ");
				throw new Error(`Unknown adapterType "${adapterType}". Available: ${available}`);
			}
			const limit = Math.min(100, Math.max(1, Number(input?.limit) || 25));
			return fetchViaAdapter(adapterType, input?.input && typeof input.input === "object" && !Array.isArray(input.input) ? input.input : {}, limit);
		}
	},
	create_collector: {
		name: "create_collector",
		kind: "write",
		description: "Set up a scheduled research collector. Pick an adapterType (run list_adapters to see every option and its input shape — e.g. twitterapi_search, dexscreener_search, dexscreener_token_pairs, viem_contract_events, sourcify_fetch_contract, telegram_fetch_messages), give it matching input and an optional cadence in minutes — new items are captured as records (and, if you own it, become your observations). Omit scheduleMinutes for a manual-only collector. STAGED for approval.",
		inputSchema: {
			type: "object",
			properties: {
				adapterType: {
					type: "string",
					description: "Which adapter the collector runs (see list_adapters for valid values)."
				},
				name: {
					type: "string",
					description: "A short label for this collector."
				},
				input: {
					type: "object",
					description: "Adapter input matching the adapter’s input hint (from list_adapters), e.g. { \"query\": \"PulseChain\" }."
				},
				scheduleMinutes: {
					type: "number",
					description: "Poll cadence in minutes (5–10080); omit for manual-only."
				}
			},
			required: ["adapterType", "name"]
		},
		normalize(input) {
			const def = getAdapterByType(str(input?.adapterType, 60));
			if (!def) throw new Error(`Unknown adapterType. Options: ${listAdapters().map((d) => d.type).join(", ")}.`);
			const name = str(input?.name, 80);
			if (!name) throw new Error("A collector name is required.");
			const jobInput = input?.input && typeof input.input === "object" && !Array.isArray(input.input) ? input.input : {};
			const sched = Number(input?.scheduleMinutes);
			const scheduleMinutes = Number.isFinite(sched) && sched > 0 ? Math.min(10080, Math.max(5, Math.round(sched))) : null;
			return {
				adapterType: def.type,
				provider: def.provider,
				name,
				input: jobInput,
				scheduleMinutes
			};
		},
		summarize(v) {
			return `Create ${v.adapterType} collector: “${v.name}”${v.scheduleMinutes ? ` every ${v.scheduleMinutes}m` : " (manual)"}`;
		},
		execute(v, ctx = {}) {
			return createCollector({
				instanceId: resolveCollectorInstance(v.provider).id,
				name: v.name,
				type: v.adapterType,
				input: v.input,
				scheduleMinutes: v.scheduleMinutes,
				agentId: ctx.agentId ?? null
			});
		}
	},
	list_agents: {
		name: "list_agents",
		kind: "read",
		description: "List the agents (teammates) with their ids, status, granted tools, and which profile fields are filled vs. empty. Use this before updating an agent.",
		inputSchema: {
			type: "object",
			properties: { query: {
				type: "string",
				description: "Optional name/title filter."
			} }
		},
		run(input) {
			const q = str(input?.query, 80).toLowerCase();
			const rows = listAgents().filter((a) => !q || `${a.name} ${a.title}`.toLowerCase().includes(q));
			if (!rows.length) return "(no agents)";
			return rows.map((a) => {
				const text = [
					["persona", a.persona],
					["beliefs", a.beliefs],
					["communicationStyle", a.communicationStyle],
					["decisionStyle", a.decisionStyle],
					["motivations", a.motivations],
					["background", a.background],
					["experience", a.experience],
					["specialization", a.specialization]
				];
				const empty = text.filter(([, v]) => !String(v ?? "").trim()).map(([k]) => k);
				for (const k of [
					"skills",
					"strengths",
					"tools"
				]) if (!(Array.isArray(a[k]) && a[k].length)) empty.push(k);
				const filled = text.filter(([, v]) => String(v ?? "").trim()).map(([k]) => k);
				return [
					`#${a.id} ${a.name} — ${a.title || "(no title)"} [${a.status}]`,
					`  filled: ${filled.join(", ") || "(none)"}`,
					`  empty: ${empty.join(", ") || "(none)"}`,
					`  tools: ${(a.tools ?? []).join(", ") || "(none)"}`
				].join("\n");
			}).join("\n");
		}
	},
	list_humans: {
		name: "list_humans",
		kind: "read",
		description: "List people / contacts with their ids and which fields are filled vs. empty.",
		inputSchema: {
			type: "object",
			properties: { query: {
				type: "string",
				description: "Optional username filter."
			} }
		},
		run(input) {
			const q = str(input?.query, 80).toLowerCase();
			const rows = listHumans().filter((h) => !q || String(h.username).toLowerCase().includes(q));
			if (!rows.length) return "(no contacts)";
			return rows.map((h) => {
				const empty = [
					["tgUsername", h.tgUsername],
					["twitterUsername", h.twitterUsername],
					["phone", h.phone],
					["email", h.email],
					["evmAddress", h.evmAddress],
					["notes", h.notes]
				].filter(([, v]) => !String(v ?? "").trim()).map(([k]) => k);
				const x = String(h.twitterUsername ?? "").trim();
				const handle = x ? ` — X: @${x.replace(/^@/, "")}` : "";
				return `#${h.id} ${h.username}${handle}${empty.length ? ` — empty: ${empty.join(", ")}` : ""}`;
			}).join("\n");
		}
	},
	create_task: {
		name: "create_task",
		kind: "write",
		description: "Create a new task on the user’s task list.",
		inputSchema: {
			type: "object",
			properties: {
				title: { type: "string" },
				description: { type: "string" },
				priority: {
					type: "string",
					enum: PRIORITIES
				},
				dueDate: {
					type: "string",
					description: "Optional due date, YYYY-MM-DD."
				}
			},
			required: ["title"]
		},
		normalize(input) {
			const title = str(input?.title, 200);
			if (!title) throw new Error("A task title is required.");
			const priority = PRIORITIES.includes(input?.priority) ? input.priority : "medium";
			const dueDate = /^\d{4}-\d{2}-\d{2}$/.test(String(input?.dueDate ?? "").trim()) ? String(input.dueDate).trim() : null;
			return {
				title,
				description: str(input?.description, 1e3),
				priority,
				dueDate
			};
		},
		summarize(v) {
			return `Create task: “${v.title}” [${v.priority}]${v.dueDate ? `, due ${v.dueDate}` : ""}`;
		},
		execute(v) {
			return createTask(v);
		}
	},
	update_task: {
		name: "update_task",
		kind: "write",
		description: "Update an existing task: title, description, priority, due date, or mark it done/reopened.",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "number" },
				title: { type: "string" },
				description: { type: "string" },
				priority: {
					type: "string",
					enum: PRIORITIES
				},
				dueDate: {
					type: "string",
					description: "YYYY-MM-DD, or empty to clear."
				},
				done: {
					type: "boolean",
					description: "true to complete, false to reopen."
				}
			},
			required: ["id"]
		},
		normalize(input) {
			const id = Number(input?.id);
			if (!id) throw new Error("A task id is required.");
			const existing = getTask(id);
			if (!existing) throw new Error(`No task with id ${id}.`);
			const value = {
				id,
				existingTitle: existing.title
			};
			if (input?.title != null) value.title = str(input.title, 200);
			if (input?.description != null) value.description = str(input.description, 1e3);
			if (PRIORITIES.includes(input?.priority)) value.priority = input.priority;
			if (input?.dueDate != null) {
				const d = String(input.dueDate).trim();
				value.dueDate = /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : null;
			}
			if (typeof input?.done === "boolean") value.done = input.done;
			return value;
		},
		summarize(v) {
			const bits = [];
			if (v.done === true) bits.push("mark done");
			if (v.done === false) bits.push("reopen");
			if (v.priority) bits.push(`priority ${v.priority}`);
			if (v.dueDate) bits.push(`due ${v.dueDate}`);
			const extra = bits.length ? ` — ${bits.join(", ")}` : "";
			return `Update task #${v.id} (“${v.existingTitle}”)${extra}`;
		},
		execute(v) {
			const existing = getTask(v.id);
			updateTask(v.id, {
				title: v.title,
				description: v.description,
				priority: v.priority,
				dueDate: v.dueDate !== void 0 ? v.dueDate : existing?.dueDate ?? null,
				projectId: existing?.projectId ?? null
			});
			if (v.done !== void 0) setTaskDone(v.id, v.done);
			return getTask(v.id);
		}
	},
	create_note: {
		name: "create_note",
		kind: "write",
		description: "Save a note for the user, optionally with keyword tags.",
		inputSchema: {
			type: "object",
			properties: {
				title: { type: "string" },
				content: { type: "string" },
				tags: {
					type: "array",
					items: { type: "string" }
				}
			},
			required: ["title"]
		},
		normalize(input) {
			const title = str(input?.title, 200);
			if (!title) throw new Error("A note title is required.");
			const tags = Array.isArray(input?.tags) ? input.tags.map((t) => str(t, 40)).filter(Boolean) : [];
			return {
				title,
				content: str(input?.content, 5e3),
				tags
			};
		},
		summarize(v) {
			return `Create note: “${v.title}”${v.tags.length ? ` (${v.tags.join(", ")})` : ""}`;
		},
		execute(v) {
			return createNote(v);
		}
	},
	create_deliverable: {
		name: "create_deliverable",
		kind: "write",
		description: "Save a finished artifact you produced (report, content draft, spec, plan) as a deliverable the director can review, refine, and publish. Use type \"reference\" for living reference material you maintain and reuse over time (curated lists, datasets, standing context) — but first search_deliverables to see if one already exists and update_deliverable it instead of creating a duplicate.",
		inputSchema: {
			type: "object",
			properties: {
				title: { type: "string" },
				body: {
					type: "string",
					description: "The artifact content (markdown)."
				},
				type: {
					type: "string",
					enum: DELIVERABLE_TYPES
				},
				projectId: {
					type: "number",
					description: "Optional project id (#id from context) this belongs to."
				},
				tags: {
					type: "array",
					items: { type: "string" }
				}
			},
			required: ["title", "body"]
		},
		normalize(input) {
			const title = str(input?.title, 200);
			if (!title) throw new Error("A deliverable title is required.");
			const body = str(input?.body, 2e4);
			if (!body) throw new Error("A deliverable needs body content.");
			const type = DELIVERABLE_TYPES.includes(input?.type) ? input.type : "note";
			const tags = Array.isArray(input?.tags) ? input.tags.map((t) => str(t, 40)).filter(Boolean) : [];
			return {
				title,
				body,
				type,
				projectId: Number(input?.projectId) || null,
				tags
			};
		},
		summarize(v) {
			return `Create ${v.type}: “${v.title}”`;
		},
		execute(v, ctx = {}) {
			return createDeliverable({
				...v,
				agentId: ctx.agentId ?? null,
				sourceDispatchId: ctx.dispatchId ?? ""
			});
		}
	},
	update_deliverable: {
		name: "update_deliverable",
		kind: "write",
		description: "Revise an existing deliverable (by #id) — its content, title, type, or tags.",
		inputSchema: {
			type: "object",
			properties: {
				id: {
					type: "number",
					description: "Deliverable #id from context."
				},
				title: { type: "string" },
				body: { type: "string" },
				type: {
					type: "string",
					enum: DELIVERABLE_TYPES
				},
				tags: {
					type: "array",
					items: { type: "string" }
				}
			},
			required: ["id"]
		},
		normalize(input) {
			const id = Number(input?.id);
			if (!Number.isInteger(id) || id <= 0) throw new Error("A deliverable id is required to update.");
			const patch = { id };
			if (input?.title != null) patch.title = str(input.title, 200);
			if (input?.body != null) patch.body = str(input.body, 2e4);
			if (input?.type != null && DELIVERABLE_TYPES.includes(input.type)) patch.type = input.type;
			if (Array.isArray(input?.tags)) patch.tags = input.tags.map((t) => str(t, 40)).filter(Boolean);
			return patch;
		},
		summarize(v) {
			return `Update deliverable #${v.id}`;
		},
		execute(v) {
			const { id, ...rest } = v;
			return updateDeliverable(id, rest);
		}
	},
	create_event: {
		name: "create_event",
		kind: "write",
		description: "Add an event to the user’s schedule.",
		inputSchema: {
			type: "object",
			properties: {
				title: { type: "string" },
				date: {
					type: "string",
					description: "YYYY-MM-DD."
				},
				startTime: {
					type: "string",
					description: "24-hour HH:MM."
				},
				endTime: {
					type: "string",
					description: "Optional 24-hour HH:MM."
				},
				category: {
					type: "string",
					enum: EVENT_CATEGORIES
				}
			},
			required: [
				"title",
				"date",
				"startTime"
			]
		},
		normalize(input) {
			const title = str(input?.title, 200);
			if (!title) throw new Error("An event title is required.");
			const start = toIso(input?.date, str(input?.startTime, 5));
			if (!start) throw new Error("A valid date and start time are required.");
			return {
				title,
				startTime: start,
				endTime: input?.endTime ? toIso(input.date, str(input.endTime, 5)) : null,
				category: EVENT_CATEGORIES.includes(input?.category) ? input.category : "personal",
				label: `${input.date} ${input.startTime}`
			};
		},
		summarize(v) {
			return `Add event: “${v.title}” on ${v.label} [${v.category}]`;
		},
		execute(v) {
			return createEvent({
				title: v.title,
				startTime: v.startTime,
				endTime: v.endTime,
				category: v.category
			});
		}
	},
	create_goal: {
		name: "create_goal",
		kind: "write",
		description: "Create a new high-level goal for the user.",
		inputSchema: {
			type: "object",
			properties: {
				title: { type: "string" },
				description: { type: "string" }
			},
			required: ["title"]
		},
		normalize(input) {
			const title = str(input?.title, 200);
			if (!title) throw new Error("A goal title is required.");
			return {
				title,
				description: str(input?.description, 1e3)
			};
		},
		summarize(v) {
			return `Create goal: “${v.title}”`;
		},
		execute(v) {
			return createGoal(v);
		}
	},
	update_goal: {
		name: "update_goal",
		kind: "write",
		description: "Update an existing goal’s title or description, or mark it achieved/unachieved.",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "number" },
				title: { type: "string" },
				description: { type: "string" },
				achieved: {
					type: "boolean",
					description: "true to mark achieved, false to reopen."
				}
			},
			required: ["id"]
		},
		normalize(input) {
			const id = Number(input?.id);
			if (!id) throw new Error("A goal id is required.");
			const existing = getGoal(id);
			if (!existing) throw new Error(`No goal with id ${id}.`);
			const value = {
				id,
				existingTitle: existing.title
			};
			if (input?.title != null) value.title = str(input.title, 200);
			if (input?.description != null) value.description = str(input.description, 1e3);
			if (typeof input?.achieved === "boolean") value.achieved = input.achieved;
			return value;
		},
		summarize(v) {
			const bits = [];
			if (v.achieved === true) bits.push("mark achieved");
			if (v.achieved === false) bits.push("reopen");
			const extra = bits.length ? ` — ${bits.join(", ")}` : "";
			return `Update goal #${v.id} (“${v.existingTitle}”)${extra}`;
		},
		execute(v) {
			if (v.title !== void 0 || v.description !== void 0) updateGoal(v.id, {
				title: v.title,
				description: v.description
			});
			if (v.achieved !== void 0 && getGoal(v.id)?.achieved !== v.achieved) toggleAchieved(v.id);
			return getGoal(v.id);
		}
	},
	create_project: {
		name: "create_project",
		kind: "write",
		description: "Create a new project / product line.",
		inputSchema: {
			type: "object",
			properties: {
				name: { type: "string" },
				description: { type: "string" },
				status: {
					type: "string",
					enum: PROJECT_STATUSES
				}
			},
			required: ["name"]
		},
		normalize(input) {
			const name = str(input?.name, 200);
			if (!name) throw new Error("A project name is required.");
			const status = PROJECT_STATUSES.includes(input?.status) ? input.status : "active";
			return {
				name,
				description: str(input?.description, 1e3),
				status
			};
		},
		summarize(v) {
			return `Create project: “${v.name}” [${v.status}]`;
		},
		execute(v) {
			return createProject(v);
		}
	},
	update_project: {
		name: "update_project",
		kind: "write",
		description: "Update an existing project’s name, description, or status.",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "number" },
				name: { type: "string" },
				description: { type: "string" },
				status: {
					type: "string",
					enum: PROJECT_STATUSES
				}
			},
			required: ["id"]
		},
		normalize(input) {
			const id = Number(input?.id);
			if (!id) throw new Error("A project id is required.");
			const existing = getProject(id);
			if (!existing) throw new Error(`No project with id ${id}.`);
			const value = {
				id,
				existingName: existing.name
			};
			if (input?.name != null) value.name = str(input.name, 200);
			if (input?.description != null) value.description = str(input.description, 1e3);
			if (PROJECT_STATUSES.includes(input?.status)) value.status = input.status;
			return value;
		},
		summarize(v) {
			const extra = v.status ? ` — ${v.status}` : "";
			return `Update project #${v.id} (“${v.existingName}”)${extra}`;
		},
		execute(v) {
			const existing = getProject(v.id);
			return updateProject(v.id, {
				name: v.name,
				description: v.description,
				status: v.status,
				paid: existing?.paid ?? false,
				humanId: existing?.humanId ?? null
			});
		}
	},
	create_agent: {
		name: "create_agent",
		kind: "write",
		description: "Create a new agent — a persistent persona / teammate in the workforce.",
		inputSchema: {
			type: "object",
			properties: {
				name: { type: "string" },
				title: { type: "string" },
				description: { type: "string" },
				persona: {
					type: "string",
					description: "How this agent thinks and behaves."
				},
				beliefs: {
					type: "string",
					description: "Core beliefs / principles."
				},
				motivations: {
					type: "string",
					description: "What drives this agent."
				},
				communicationStyle: { type: "string" },
				decisionStyle: {
					type: "string",
					description: "How this agent makes decisions."
				},
				background: { type: "string" },
				experience: { type: "string" },
				specialization: { type: "string" },
				skills: {
					type: "array",
					items: { type: "string" }
				},
				strengths: {
					type: "array",
					items: { type: "string" }
				},
				tools: {
					type: "array",
					items: { type: "string" },
					description: "Capability labels, e.g. Tasks, Notes."
				},
				status: {
					type: "string",
					enum: AGENT_STATUSES
				}
			},
			required: ["name"]
		},
		normalize(input) {
			const name = str(input?.name, 120);
			if (!name) throw new Error("An agent name is required.");
			return {
				name,
				title: str(input?.title, 120),
				description: str(input?.description, 500),
				persona: str(input?.persona, 1e3),
				beliefs: str(input?.beliefs, 1e3),
				motivations: str(input?.motivations, 1e3),
				communicationStyle: str(input?.communicationStyle, 1e3),
				decisionStyle: str(input?.decisionStyle, 1e3),
				background: str(input?.background, 1e3),
				experience: str(input?.experience, 1e3),
				specialization: str(input?.specialization, 300),
				skills: toStrArray(input?.skills),
				strengths: toStrArray(input?.strengths),
				tools: toStrArray(input?.tools),
				status: AGENT_STATUSES.includes(input?.status) ? input.status : "active"
			};
		},
		summarize(v) {
			return `Create agent: “${v.name}”${v.title ? ` · ${v.title}` : ""}`;
		},
		execute(v) {
			return createAgent(v);
		}
	},
	update_agent: {
		name: "update_agent",
		kind: "write",
		description: "Update an existing agent’s identity, persona, skills, or granted tools.",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "number" },
				name: { type: "string" },
				title: { type: "string" },
				description: { type: "string" },
				persona: { type: "string" },
				beliefs: { type: "string" },
				motivations: { type: "string" },
				communicationStyle: { type: "string" },
				decisionStyle: { type: "string" },
				background: { type: "string" },
				experience: { type: "string" },
				specialization: { type: "string" },
				skills: {
					type: "array",
					items: { type: "string" }
				},
				strengths: {
					type: "array",
					items: { type: "string" }
				},
				tools: {
					type: "array",
					items: { type: "string" }
				},
				status: {
					type: "string",
					enum: AGENT_STATUSES
				}
			},
			required: ["id"]
		},
		normalize(input) {
			const id = Number(input?.id);
			if (!id) throw new Error("An agent id is required.");
			const existing = getAgent(id);
			if (!existing) throw new Error(`No agent with id ${id}.`);
			const value = {
				id,
				existingName: existing.name
			};
			if (input?.name != null) value.name = str(input.name, 120);
			if (input?.title != null) value.title = str(input.title, 120);
			if (input?.description != null) value.description = str(input.description, 500);
			if (input?.persona != null) value.persona = str(input.persona, 1e3);
			if (input?.beliefs != null) value.beliefs = str(input.beliefs, 1e3);
			if (input?.motivations != null) value.motivations = str(input.motivations, 1e3);
			if (input?.communicationStyle != null) value.communicationStyle = str(input.communicationStyle, 1e3);
			if (input?.decisionStyle != null) value.decisionStyle = str(input.decisionStyle, 1e3);
			if (input?.background != null) value.background = str(input.background, 1e3);
			if (input?.experience != null) value.experience = str(input.experience, 1e3);
			if (input?.specialization != null) value.specialization = str(input.specialization, 300);
			if (input?.skills != null) value.skills = toStrArray(input.skills);
			if (input?.strengths != null) value.strengths = toStrArray(input.strengths);
			if (input?.tools != null) value.tools = toStrArray(input.tools);
			if (AGENT_STATUSES.includes(input?.status)) value.status = input.status;
			return value;
		},
		summarize(v) {
			return `Update agent #${v.id} (“${v.existingName}”)`;
		},
		execute(v) {
			return updateAgent(v.id, v);
		}
	},
	create_human: {
		name: "create_human",
		kind: "write",
		description: "Add a person / contact (e.g. a client or collaborator).",
		inputSchema: {
			type: "object",
			properties: {
				username: { type: "string" },
				tgUsername: {
					type: "string",
					description: "Telegram handle."
				},
				twitterUsername: {
					type: "string",
					description: "X / Twitter handle."
				},
				phone: { type: "string" },
				email: { type: "string" },
				evmAddress: {
					type: "string",
					description: "EVM wallet address."
				},
				notes: {
					type: "string",
					description: "Freeform notes (e.g. social bio, follower stats, context)."
				}
			},
			required: ["username"]
		},
		normalize(input) {
			const username = str(input?.username, 80);
			if (!username) throw new Error("A username is required.");
			return {
				username,
				tgUsername: str(input?.tgUsername, 80),
				twitterUsername: str(input?.twitterUsername, 80),
				phone: str(input?.phone, 40),
				email: str(input?.email, 160),
				evmAddress: str(input?.evmAddress, 80),
				notes: str(input?.notes, 2e3)
			};
		},
		summarize(v) {
			return `Add contact: “${v.username}”`;
		},
		execute(v) {
			return createHuman(v);
		}
	},
	update_human: {
		name: "update_human",
		kind: "write",
		description: "Update a person / contact’s details.",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "number" },
				username: { type: "string" },
				tgUsername: { type: "string" },
				twitterUsername: { type: "string" },
				phone: { type: "string" },
				email: { type: "string" },
				evmAddress: { type: "string" },
				notes: {
					type: "string",
					description: "Freeform notes (e.g. social bio, follower stats, context)."
				}
			},
			required: ["id"]
		},
		normalize(input) {
			const id = Number(input?.id);
			if (!id) throw new Error("A contact id is required.");
			const existing = getHuman(id);
			if (!existing) throw new Error(`No contact with id ${id}.`);
			const value = {
				id,
				existingName: existing.username
			};
			if (input?.username != null) value.username = str(input.username, 80);
			if (input?.tgUsername != null) value.tgUsername = str(input.tgUsername, 80);
			if (input?.twitterUsername != null) value.twitterUsername = str(input.twitterUsername, 80);
			if (input?.phone != null) value.phone = str(input.phone, 40);
			if (input?.email != null) value.email = str(input.email, 160);
			if (input?.evmAddress != null) value.evmAddress = str(input.evmAddress, 80);
			if (input?.notes != null) value.notes = str(input.notes, 2e3);
			return value;
		},
		summarize(v) {
			return `Update contact #${v.id} (“${v.existingName}”)`;
		},
		execute(v) {
			return updateHuman(v.id, v);
		}
	},
	assign_task: {
		name: "assign_task",
		kind: "write",
		description: "Delegate work to a teammate agent by creating a task on their to-do list. Use list_agents first to pick the right agent id. The task appears as a proposal on their list for the principal to trigger — it is not run automatically — so delegate sparingly and only what is clearly needed.",
		inputSchema: {
			type: "object",
			properties: {
				agentId: {
					type: "number",
					description: "The id of the agent to assign the task to."
				},
				title: {
					type: "string",
					description: "Short, action-oriented task title."
				},
				description: {
					type: "string",
					description: "Concrete detail / acceptance criteria."
				},
				priority: {
					type: "string",
					enum: PRIORITIES
				}
			},
			required: ["agentId", "title"]
		},
		normalize(input) {
			const agentId = Number(input?.agentId);
			if (!agentId) throw new Error("A target agent id is required.");
			const target = getAgent(agentId);
			if (!target) throw new Error(`No agent with id ${agentId}.`);
			const title = str(input?.title, 200);
			if (!title) throw new Error("A task title is required.");
			const priority = PRIORITIES.includes(input?.priority) ? input.priority : "medium";
			return {
				agentId,
				targetName: target.name,
				title,
				description: str(input?.description, 1e3),
				priority
			};
		},
		summarize(v) {
			return `Assign to ${v.targetName} (#${v.agentId}): “${v.title}” [${v.priority}]`;
		},
		execute(v, ctx) {
			const title = v.title.trim().toLowerCase();
			const existing = listAgentTasks(v.agentId).find((t) => t.status !== "done" && t.title.trim().toLowerCase() === title);
			if (existing) return existing.id;
			return createAgentTask(v.agentId, {
				title: v.title,
				description: v.description,
				priority: v.priority,
				createdByAgentId: ctx?.agentId ?? null
			});
		}
	}
};
function schemaFromHint(hint) {
	if (!hint) return { type: "object" };
	try {
		const example = JSON.parse(hint);
		if (!example || typeof example !== "object" || Array.isArray(example)) return { type: "object" };
		const properties = {};
		for (const [k, v] of Object.entries(example)) properties[k] = Array.isArray(v) ? {
			type: "array",
			items: { type: "string" }
		} : { type: typeof v === "boolean" ? "boolean" : typeof v === "number" ? "number" : "string" };
		return {
			type: "object",
			properties
		};
	} catch {
		return { type: "object" };
	}
}
function loadAdapterTools() {
	const tools = {};
	for (const adapter of listAdapters()) {
		if (!adapter.toolEnabled) continue;
		const type = adapter.type;
		const provider = adapter.provider;
		const desc = adapter.description || adapter.label;
		const description = adapter.inputHint ? `${desc}\nExpected input: \`${adapter.inputHint}\`` : desc;
		tools[type] = {
			name: type,
			kind: "read",
			capability: provider ? {
				id: provider,
				description: adapter.description || adapter.label
			} : null,
			aliases: provider ? [provider] : [],
			description,
			inputSchema: schemaFromHint(adapter.inputHint),
			...provider ? { available: () => Boolean(getPrimaryInstance(provider)) } : {},
			async data(input) {
				const { data, result: _r, records } = await runAdapterFetch(type, input);
				if (data !== void 0 && data !== null) return data;
				return records.length ? records.map((r) => r.metadata ?? r) : null;
			},
			async run(input) {
				return fetchViaAdapter(type, input);
			}
		};
	}
	return tools;
}
var ADAPTER_TOOLS = loadAdapterTools();
var TOOLS = {
	...INTERNAL_TOOLS,
	...PROVIDER_TOOLS,
	...ADAPTER_TOOLS
};
var INTERNAL_CATALOG = [
	{
		id: "Goals",
		description: "Create and update goals."
	},
	{
		id: "Projects",
		description: "Create and update projects."
	},
	{
		id: "Tasks",
		description: "Create and update tasks."
	},
	{
		id: "Notes",
		description: "Save notes."
	},
	{
		id: "Calendar",
		description: "Add events to the schedule."
	},
	{
		id: "Agents",
		description: "Create and update agents (teammates)."
	},
	{
		id: "Humans",
		description: "Create and update people / contacts."
	},
	{
		id: "Delegation",
		description: "Assign tasks to other agents (delegate work)."
	},
	{
		id: "Deliverables",
		description: "Save and revise artifacts (reports, drafts, specs, plans)."
	},
	{
		id: "Research",
		description: "Set up scheduled collectors that capture records. Querying records/reports is available to every agent."
	}
];
var TOOL_CATALOG = (() => {
	const seen = new Set(INTERNAL_CATALOG.map((c) => c.id));
	const merged = [...INTERNAL_CATALOG];
	for (const t of [...listProviderTools(), ...Object.values(ADAPTER_TOOLS)]) if (t.capability?.id && !seen.has(t.capability.id)) {
		seen.add(t.capability.id);
		merged.push(t.capability);
	}
	return merged;
})();
var INTERNAL_GRANTS = {
	goals: ["create_goal", "update_goal"],
	projects: ["create_project", "update_project"],
	agents: [
		"list_agents",
		"create_agent",
		"update_agent"
	],
	humans: [
		"list_humans",
		"create_human",
		"update_human"
	],
	delegation: ["list_agents", "assign_task"],
	tasks: ["create_task", "update_task"],
	calendar: ["create_event"],
	schedule: ["create_event"],
	notes: ["create_note"],
	deliverables: ["create_deliverable", "update_deliverable"],
	deliverable: ["create_deliverable", "update_deliverable"],
	research: [
		"list_adapters",
		"list_collectors",
		"create_collector",
		"run_adapter"
	]
};
var GRANTS = (() => {
	const map = {};
	for (const [key, names] of Object.entries(INTERNAL_GRANTS)) map[key] = [...names];
	for (const t of [...listProviderTools(), ...Object.values(ADAPTER_TOOLS)]) for (const alias of t.aliases ?? []) {
		const key = String(alias).toLowerCase();
		map[key] ??= [];
		if (!map[key].includes(t.name)) map[key].push(t.name);
	}
	return map;
})();
var ALWAYS = [
	"search_context",
	"search_deliverables",
	"read_note",
	"query_records",
	"run_report"
];
function getTool(name) {
	return TOOLS[name] ?? null;
}
/** The Anthropic tool spec for a registry tool. */
function toolSpec(tool) {
	return {
		name: tool.name,
		description: tool.description,
		input_schema: tool.inputSchema
	};
}
/** Resolve the set of tools an agent is allowed to use, from its `tools` list. */
function resolveAgentTools(agent) {
	const names = new Set(ALWAYS);
	for (const raw of agent?.tools ?? []) {
		const g = String(raw).trim().toLowerCase();
		for (const [key, granted] of Object.entries(GRANTS)) if (g === key || key.length > 2 && g.includes(key)) granted.forEach((n) => names.add(n));
	}
	return [...names].map((n) => TOOLS[n]).filter((t) => t && (typeof t.available === "function" ? t.available() : true));
}

export { TOOLS as T, gatherContext as a, TOOL_CATALOG as b, createCollector as c, deleteCollector as d, getCollector as e, listCollectors as f, getTool as g, listDueCollectors as l, markCollectorRun as m, resolveAgentTools as r, setCollectorStatus as s, toolSpec as t, updateCollector as u };
//# sourceMappingURL=tools.js-BWnlcMH6.js.map
