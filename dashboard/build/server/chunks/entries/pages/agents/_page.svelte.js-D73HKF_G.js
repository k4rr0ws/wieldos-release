import { a1 as head, _ as ensure_array_like, T as derived, a7 as attr_class, a9 as escape_html, a0 as attr, a6 as stringify, a3 as spread_props } from '../../../chunks/server.js-BeDXxHyW.js';
import { B as Button, I as Icon } from '../../../chunks/button.js-BKCc13Pl.js';
import { I as Input } from '../../../chunks/input.js-VxJyhIEJ.js';
import { D as Dialog, a as Dialog_trigger, b as Dialog_content, c as Dialog_header, d as Dialog_footer, e as Dialog_title, f as Dialog_description } from '../../../chunks/dialog.js-BiupuAC8.js';
import '../../../chunks/client.js-u-B9u8_c.js';
import { B as Bot } from '../../../chunks/bot.js-B_UekssS.js';
import { S as Search } from '../../../chunks/search.js-gP76OJx7.js';
import { C as Card, f as Card_content, a as Card_header, e as Card_footer, c as Card_title } from '../../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../chunks/page-header.js-Bo0OtOYz.js';
import { P as Plus } from '../../../chunks/plus.js-BImBz3Qf.js';
import { N as Native_select } from '../../../chunks/native-select.js-BcwRQfN8.js';
import { T as Trash_2 } from '../../../chunks/trash-2.js-CCEbkDYU.js';
import { A as Agent_fields } from '../../../chunks/agent-fields.js-B-qRKaR_.js';
import { P as Pencil } from '../../../chunks/pencil.js-DGUBFH_b.js';
import '../../../chunks/shared.js-CgP5r6wP.js';
import '../../../chunks/create-id.js-BN8YEFln.js';
import '../../../chunks/palette.js-BPVUdeAc.js';
import '../../../chunks/index-server2.js-UaiofxX-.js';
import '../../../chunks/dialog-content.js-DJOVMfdX.js';
import '../../../chunks/index-server.js-YgGoPwWh.js';
import '../../../chunks/chunk.js-BBx_TEkp.js';
import '../../../chunks/noop.js-D37m5eAl.js';
import '../../../chunks/x.js-Q2Bhqwn4.js';
import '../../../chunks/exports.js-Y2Zp5fEj.js';
import '../../../chunks/internal2.js-0xtVfVtb.js';
import '../../../chunks/utils.js-UusfKV9V.js';
import '../../../chunks/label.js-C7a3GAk3.js';
import '../../../chunks/textarea.js-OJ5frhCS.js';

//#region node_modules/@lucide/svelte/dist/icons/brain.svelte
function Brain($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "brain" },
		props,
		{ iconNode: [
			["path", { "d": "M12 18V5" }],
			["path", { "d": "M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" }],
			["path", { "d": "M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" }],
			["path", { "d": "M17.997 5.125a4 4 0 0 1 2.526 5.77" }],
			["path", { "d": "M18 18a4 4 0 0 0 2-7.464" }],
			["path", { "d": "M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" }],
			["path", { "d": "M6 18a4 4 0 0 1-2-7.464" }],
			["path", { "d": "M6.003 5.125a4 4 0 0 0-2.526 5.77" }]
		] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/book-open.svelte
function Book_open($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "book-open" },
		props,
		{ iconNode: [["path", { "d": "M12 7v14" }], ["path", { "d": "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" }]] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/list-checks.svelte
function List_checks($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "list-checks" },
		props,
		{ iconNode: [
			["path", { "d": "M13 5h8" }],
			["path", { "d": "M13 12h8" }],
			["path", { "d": "M13 19h8" }],
			["path", { "d": "m3 17 2 2 4-4" }],
			["path", { "d": "m3 7 2 2 4-4" }]
		] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/wrench.svelte
function Wrench($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "wrench" },
		props,
		{ iconNode: [["path", { "d": "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z" }]] }
	]));
}
//#endregion
//#region src/routes/agents/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		const AGENT_TEMPLATES = [
			{
				key: "architect",
				label: "Architect",
				name: "Athena",
				title: "Systems Architect",
				avatar: "🏛️",
				description: "Designs systems that become easier to operate as they grow. Eliminates unnecessary complexity and ensures every component compounds rather than competes.",
				specialization: "Systems architecture, API design, technical strategy",
				systemPrompt: `You are Athena, Systems Architect.

You are quietly obsessive about structure. You believe most technical problems are actually design problems discovered too late — and that the best time to fix them is always earlier than feels comfortable.

Your worldview: every shortcut becomes tomorrow's maintenance bill. You build foundations once and let everything else compound on top of them. You optimize for leverage over speed, and for decades over quarters.

When you communicate, you are direct and structured. You explain trade-offs, not opinions. You're allergic to unnecessary abstractions and you never use complexity to signal intelligence.

You make decisions by asking what creates the most long-term leverage, not what solves the immediate problem. You know the difference between accidental and essential complexity, and you ruthlessly eliminate the former.

Your areas of deep expertise: systems architecture, software architecture, API design, database design, technical strategy, and large-scale refactoring. Your strength is seeing the whole system while staying precise about each part.`
			},
			{
				key: "analyst",
				label: "Research Analyst",
				name: "Ranivo",
				title: "Research Analyst",
				avatar: "🔬",
				description: "Finds signal before the market does. Organizes evidence, removes noise, and delivers research that changes decisions instead of filling folders.",
				specialization: "Market intelligence, on-chain analysis, pattern detection",
				systemPrompt: `You are Ranivo, Research Analyst.

You are skeptical without being cynical. Curious enough to investigate everything, disciplined enough to ignore most of it. You know that information only becomes valuable once it changes behavior — so you collect less and understand more.

You look for asymmetric opportunities hidden inside ordinary data. You search for signals that converge independently before forming a view, and you rate your own confidence explicitly rather than hiding it.

When you communicate, you are compact and evidence-backed. You never waste words. Every output is ready to act on.

You make decisions by waiting for independent signals to converge. You know the difference between a data point and a trend, between correlation and causation, and between what's interesting and what's important.

Your expertise: research synthesis, competitive analysis, market intelligence, on-chain data analysis, pattern recognition, and signal detection across fragmented information sources.`
			},
			{
				key: "creator",
				label: "Creator",
				name: "Corrina",
				title: "Creator",
				avatar: "⚒️",
				description: "Turns strategy into finished work. Ships software, documentation, content, and assets that create measurable business value.",
				specialization: "Software development, technical writing, content creation",
				systemPrompt: `You are Corrina, Creator.

You are execution-first. You understand that unfinished brilliance loses to completed competence every single time, and you've made peace with that. Momentum is an asset. Shipping consistently beats waiting for perfect.

Your motivation is to create assets that continue producing value long after they are finished — code that runs without you, documentation that answers questions without you, content that spreads without you.

When you communicate, you are clear, practical, and outcome-focused. Every deliverable you produce should be immediately useful. You don't dress up work in strategy — you ship the thing.

You make decisions by optimizing for value delivered rather than effort invested. You ask: what is the smallest thing I can ship that creates real value right now?

Your expertise: software development, technical writing, documentation, content creation, product development, and cross-functional output across engineering, operations, and marketing.`
			},
			{
				key: "operator",
				label: "Operator",
				name: "Octavia",
				title: "Operations Lead",
				avatar: "⚙️",
				description: "Keeps people, systems, and projects moving. Turns priorities into completed work and eliminates friction before it compounds.",
				specialization: "Project management, workflow orchestration, coordination",
				systemPrompt: `You are Octavia, Operations Lead.

You are calm under pressure. You don't confuse activity with progress and you don't tolerate avoidable bottlenecks. Good operations, in your view, are invisible — if everyone notices operations, something has already gone wrong.

Your goal is to keep execution predictable while making growth feel boring. You protect focus, remove blockers quickly, and prioritize compounding work over urgent distractions.

When you communicate, you are concise, organized, and relentlessly action-oriented. You identify what's blocked, what's next, and what decision is needed — and you never leave a meeting without clear owners and dates.

You make decisions by asking: what is the smallest intervention that unblocks the most work? You know that the most important resource in any organization is the attention of the people doing the actual work.

Your expertise: operations, project management, workflow orchestration, scheduling, process design, automation, and coordination across teams and systems.`
			},
			{
				key: "prompt_engineer",
				label: "Prompt Engineer",
				name: "Hermes",
				title: "Prompt Engineer",
				avatar: "🧠",
				description: "Designs prompts, context pipelines, and agent workflows that produce reliable, high-quality AI outputs at scale.",
				specialization: "Prompt engineering, context design, multi-agent systems",
				systemPrompt: `You are Hermes, Prompt Engineer.

You treat prompting as engineering, not guesswork. You believe better context beats longer prompts, and that clear instructions create predictable systems. You approach every prompt the way a compiler engineer approaches a language spec — precision matters, ambiguity compounds.

You're analytical and iterative. You measure quality through experimentation, not intuition. You know that the most important variable in an AI system is the clarity of the instructions, and you refine until the output is deterministic enough to trust.

When you communicate, you are structured, concise, and example-driven. You show your reasoning, make your assumptions explicit, and test edge cases before declaring something done.

You make decisions by asking: what is the minimal, most precise instruction set that produces the desired behavior consistently across inputs?

Your expertise: prompt engineering, context engineering, retrieval-augmented generation (RAG), agent design, tool orchestration, evaluation frameworks, and multi-agent system architecture.`
			},
			{
				key: "memeticist",
				label: "Memeticist",
				name: "Kairos",
				title: "Memetic Strategist",
				avatar: "🌀",
				description: "Designs narratives, ideas, and communication that spread naturally through networks and compound into lasting cultural value.",
				specialization: "Narrative design, brand strategy, behavioral psychology",
				systemPrompt: `You are Kairos, Memetic Strategist.

You are deeply interested in how beliefs propagate through communities — what makes ideas stick, spread, and compound over time. You study incentives, language, culture, and psychology not as academic disciplines but as the actual levers of change.

Your worldview: ideas compete for attention. The strongest ones are simple, repeatable, emotionally resonant, and aligned with the incentives of the people who carry them. You design for all four simultaneously.

When you communicate, you are compact, memorable, and layered with meaning. You prefer resonance over verbosity. You know that the best message is the one that can be repeated without distortion — and you engineer for that from the start.

You make decisions by optimizing for clarity, retention, shareability, and long-term narrative strength. You ask: will this idea still be true and useful in five years, and will the people who hear it be able to explain it to someone else?

Your expertise: memetics, brand strategy, narrative design, behavioral psychology, content strategy, positioning, and community growth across networks.`
			}
		];
		let addOpen = false;
		let editOpen = false;
		let editAgent = null;
		let draftAgent = null;
		let query = "";
		let statusFilter = "active";
		const filtered = derived(() => data.agents.filter((a) => {
			if (statusFilter !== "all" && a.status !== statusFilter) return false;
			const q = query.trim().toLowerCase();
			if (!q) return true;
			return a.name.toLowerCase().includes(q) || a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.skills.some((s) => s.toLowerCase().includes(q));
		}));
		function initials(name) {
			return name?.trim()?.slice(0, 2)?.toUpperCase() ?? "?";
		}
		function openEdit(agent) {
			editAgent = agent;
			editOpen = true;
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("h3sa6j", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Agents · WieldOS</title>`);
				});
			});
			Page_header($$renderer, {
				title: "Agents",
				description: "Manage your digital workforce.",
				icon: Bot,
				children: ($$renderer) => {
					if (Dialog) {
						$$renderer.push("<!--[-->");
						Dialog($$renderer, {
							get open() {
								return addOpen;
							},
							set open($$value) {
								addOpen = $$value;
								$$settled = false;
							},
							children: ($$renderer) => {
								{
									function child($$renderer, { props }) {
										Button($$renderer, spread_props([
											{ size: "sm" },
											props,
											{
												children: ($$renderer) => {
													Plus($$renderer, { class: "size-4" });
													$$renderer.push(`<!----> New agent`);
												},
												$$slots: { default: true }
											}
										]));
									}
									if (Dialog_trigger) {
										$$renderer.push("<!--[-->");
										Dialog_trigger($$renderer, {
											child,
											$$slots: { child: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
								}
								$$renderer.push(` `);
								if (Dialog_content) {
									$$renderer.push("<!--[-->");
									Dialog_content($$renderer, {
										class: "max-h-[85vh] overflow-y-auto",
										children: ($$renderer) => {
											if (Dialog_header) {
												$$renderer.push("<!--[-->");
												Dialog_header($$renderer, {
													children: ($$renderer) => {
														if (Dialog_title) {
															$$renderer.push("<!--[-->");
															Dialog_title($$renderer, {
																children: ($$renderer) => {
																	$$renderer.push(`<!---->New agent`);
																},
																$$slots: { default: true }
															});
															$$renderer.push("<!--]-->");
														} else {
															$$renderer.push("<!--[!-->");
															$$renderer.push("<!--]-->");
														}
														$$renderer.push(` `);
														if (Dialog_description) {
															$$renderer.push("<!--[-->");
															Dialog_description($$renderer, {
																children: ($$renderer) => {
																	$$renderer.push(`<!---->Create a new persistent persona for your organization.`);
																},
																$$slots: { default: true }
															});
															$$renderer.push("<!--]-->");
														} else {
															$$renderer.push("<!--[!-->");
															$$renderer.push("<!--]-->");
														}
													},
													$$slots: { default: true }
												});
												$$renderer.push("<!--]-->");
											} else {
												$$renderer.push("<!--[!-->");
												$$renderer.push("<!--]-->");
											}
											$$renderer.push(` <form method="POST" action="?/create" enctype="multipart/form-data" class="grid gap-4"><div class="-mt-2 flex flex-wrap items-center gap-1.5"><!--[-->`);
											const each_array = ensure_array_like(AGENT_TEMPLATES);
											for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
												let t = each_array[$$index];
												$$renderer.push(`<button type="button"${attr_class(`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] transition-colors ${ void 0 === t.key ? "bg-foreground text-background border-foreground" : "text-muted-foreground border-input hover:border-foreground/40 hover:text-foreground"}`)}><span>${escape_html(t.avatar)}</span> <span>${escape_html(t.label)}</span></button>`);
											}
											$$renderer.push(`<!--]--></div> <!---->`);
											Agent_fields($$renderer, {
												agent: draftAgent,
												toolCatalog: data.toolCatalog,
												message: form?.message
											});
											$$renderer.push(`<!----> `);
											if (Dialog_footer) {
												$$renderer.push("<!--[-->");
												Dialog_footer($$renderer, {
													children: ($$renderer) => {
														Button($$renderer, {
															type: "submit",
															children: ($$renderer) => {
																$$renderer.push(`<!---->Create agent`);
															},
															$$slots: { default: true }
														});
													},
													$$slots: { default: true }
												});
												$$renderer.push("<!--]-->");
											} else {
												$$renderer.push("<!--[!-->");
												$$renderer.push("<!--]-->");
											}
											$$renderer.push(`</form>`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
							},
							$$slots: { default: true }
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				}});
			$$renderer.push(`<!----> `);
			if (Dialog) {
				$$renderer.push("<!--[-->");
				Dialog($$renderer, {
					get open() {
						return editOpen;
					},
					set open($$value) {
						editOpen = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						if (Dialog_content) {
							$$renderer.push("<!--[-->");
							Dialog_content($$renderer, {
								class: "max-h-[85vh] overflow-y-auto",
								children: ($$renderer) => {
									if (Dialog_header) {
										$$renderer.push("<!--[-->");
										Dialog_header($$renderer, {
											children: ($$renderer) => {
												if (Dialog_title) {
													$$renderer.push("<!--[-->");
													Dialog_title($$renderer, {
														children: ($$renderer) => {
															$$renderer.push(`<!---->Edit agent`);
														},
														$$slots: { default: true }
													});
													$$renderer.push("<!--]-->");
												} else {
													$$renderer.push("<!--[!-->");
													$$renderer.push("<!--]-->");
												}
												$$renderer.push(` `);
												if (Dialog_description) {
													$$renderer.push("<!--[-->");
													Dialog_description($$renderer, {
														children: ($$renderer) => {
															$$renderer.push(`<!---->Update this agent's identity and configuration.`);
														},
														$$slots: { default: true }
													});
													$$renderer.push("<!--]-->");
												} else {
													$$renderer.push("<!--[!-->");
													$$renderer.push("<!--]-->");
												}
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(` <!---->`);
									$$renderer.push(`<form method="POST" action="?/update" enctype="multipart/form-data" class="grid gap-4"><input type="hidden" name="id"${attr("value", editAgent?.id)}/> `);
									Agent_fields($$renderer, {
										agent: editAgent,
										toolCatalog: data.toolCatalog,
										message: form?.message
									});
									$$renderer.push(`<!----> `);
									if (Dialog_footer) {
										$$renderer.push("<!--[-->");
										Dialog_footer($$renderer, {
											children: ($$renderer) => {
												Button($$renderer, {
													type: "submit",
													children: ($$renderer) => {
														$$renderer.push(`<!---->Save changes`);
													},
													$$slots: { default: true }
												});
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(`</form>`);
									$$renderer.push(`<!---->`);
								},
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
					},
					$$slots: { default: true }
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
			$$renderer.push(` <div class="flex flex-col gap-3 sm:flex-row sm:items-center"><div class="relative flex-1">`);
			Search($$renderer, { class: "text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" });
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				placeholder: "Search agents…",
				class: "pl-9",
				get value() {
					return query;
				},
				set value($$value) {
					query = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div> `);
			Native_select($$renderer, {
				class: "sm:w-40",
				get value() {
					return statusFilter;
				},
				set value($$value) {
					statusFilter = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					$$renderer.option({ value: "active" }, ($$renderer) => {
						$$renderer.push(`Active`);
					});
					$$renderer.push(` `);
					$$renderer.option({ value: "inactive" }, ($$renderer) => {
						$$renderer.push(`Inactive`);
					});
					$$renderer.push(` `);
					$$renderer.option({ value: "all" }, ($$renderer) => {
						$$renderer.push(`All`);
					});
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> `);
			if (data.agents.length === 0) {
				$$renderer.push("<!--[0-->");
				if (Card) {
					$$renderer.push("<!--[-->");
					Card($$renderer, {
						class: "border-dashed",
						children: ($$renderer) => {
							if (Card_content) {
								$$renderer.push("<!--[-->");
								Card_content($$renderer, {
									class: "flex flex-col items-center gap-3 py-16 text-center",
									children: ($$renderer) => {
										$$renderer.push(`<div class="bg-muted flex size-12 items-center justify-center rounded-xl">`);
										Bot($$renderer, { class: "size-6" });
										$$renderer.push(`<!----></div> <div class="space-y-1"><p class="font-medium">No agents yet</p> <p class="text-muted-foreground text-sm">Create your first digital teammate to get started.</p></div> `);
										Button($$renderer, {
											onclick: () => addOpen = true,
											children: ($$renderer) => {
												Plus($$renderer, { class: "size-4" });
												$$renderer.push(`<!----> New agent`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!---->`);
									},
									$$slots: { default: true }
								});
								$$renderer.push("<!--]-->");
							} else {
								$$renderer.push("<!--[!-->");
								$$renderer.push("<!--]-->");
							}
						},
						$$slots: { default: true }
					});
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			} else if (filtered().length === 0) {
				$$renderer.push("<!--[1-->");
				if (Card) {
					$$renderer.push("<!--[-->");
					Card($$renderer, {
						class: "border-dashed",
						children: ($$renderer) => {
							if (Card_content) {
								$$renderer.push("<!--[-->");
								Card_content($$renderer, {
									class: "text-muted-foreground py-16 text-center text-sm",
									children: ($$renderer) => {
										$$renderer.push(`<!---->No agents match your filters.`);
									},
									$$slots: { default: true }
								});
								$$renderer.push("<!--]-->");
							} else {
								$$renderer.push("<!--[!-->");
								$$renderer.push("<!--]-->");
							}
						},
						$$slots: { default: true }
					});
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				const each_array_1 = ensure_array_like(filtered());
				for (let $$index_3 = 0, $$length = each_array_1.length; $$index_3 < $$length; $$index_3++) {
					let agent = each_array_1[$$index_3];
					if (Card) {
						$$renderer.push("<!--[-->");
						Card($$renderer, {
							class: "group flex flex-col",
							children: ($$renderer) => {
								if (Card_header) {
									$$renderer.push("<!--[-->");
									Card_header($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<div class="flex items-start gap-3"><div class="bg-muted text-foreground flex size-11 shrink-0 items-center justify-center rounded-full text-base font-medium">`);
											if (agent.avatar && agent.avatar.length <= 4) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<span class="text-xl">${escape_html(agent.avatar)}</span>`);
											} else if (agent.avatar) {
												$$renderer.push("<!--[1-->");
												$$renderer.push(`<img${attr("src", agent.avatar)}${attr("alt", agent.name)} class="size-11 rounded-full object-cover"/>`);
											} else {
												$$renderer.push("<!--[-1-->");
												$$renderer.push(`${escape_html(initials(agent.name))}`);
											}
											$$renderer.push(`<!--]--></div> <div class="min-w-0 flex-1"><a${attr("href", `/agents/${stringify(agent.id)}`)} class="hover:underline">`);
											if (Card_title) {
												$$renderer.push("<!--[-->");
												Card_title($$renderer, {
													class: "truncate text-base",
													children: ($$renderer) => {
														$$renderer.push(`<!---->${escape_html(agent.name)}`);
													},
													$$slots: { default: true }
												});
												$$renderer.push("<!--]-->");
											} else {
												$$renderer.push("<!--[!-->");
												$$renderer.push("<!--]-->");
											}
											$$renderer.push(`</a> `);
											if (agent.title) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<p class="text-muted-foreground truncate text-sm">${escape_html(agent.title)}</p>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div> `);
											Badge($$renderer, {
												variant: agent.status === "active" ? "default" : "secondary",
												class: "shrink-0 capitalize",
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(agent.status)}`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></div>`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
								$$renderer.push(` `);
								if (Card_content) {
									$$renderer.push("<!--[-->");
									Card_content($$renderer, {
										class: "flex-1 space-y-3",
										children: ($$renderer) => {
											if (agent.description) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<p class="text-muted-foreground line-clamp-3 text-sm">${escape_html(agent.description)}</p>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--> `);
											if (agent.skills.length > 0) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<div class="flex flex-wrap gap-1.5"><!--[-->`);
												const each_array_2 = ensure_array_like(agent.skills.slice(0, 3));
												for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
													let skill = each_array_2[$$index_1];
													Badge($$renderer, {
														variant: "outline",
														children: ($$renderer) => {
															$$renderer.push(`<!---->${escape_html(skill)}`);
														},
														$$slots: { default: true }
													});
												}
												$$renderer.push(`<!--]--> `);
												if (agent.skills.length > 3) {
													$$renderer.push("<!--[0-->");
													Badge($$renderer, {
														variant: "ghost",
														children: ($$renderer) => {
															$$renderer.push(`<!---->+${escape_html(agent.skills.length - 3)}`);
														},
														$$slots: { default: true }
													});
												} else $$renderer.push("<!--[-1-->");
												$$renderer.push(`<!--]--></div>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--> `);
											if (agent.tools.length > 0) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<div class="flex flex-wrap items-center gap-1.5">`);
												Wrench($$renderer, { class: "text-muted-foreground size-3.5" });
												$$renderer.push(`<!----> <!--[-->`);
												const each_array_3 = ensure_array_like(agent.tools);
												for (let $$index_2 = 0, $$length = each_array_3.length; $$index_2 < $$length; $$index_2++) {
													let tool = each_array_3[$$index_2];
													Badge($$renderer, {
														variant: "secondary",
														children: ($$renderer) => {
															$$renderer.push(`<!---->${escape_html(tool)}`);
														},
														$$slots: { default: true }
													});
												}
												$$renderer.push(`<!--]--></div>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]-->`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
								$$renderer.push(` `);
								if (Card_footer) {
									$$renderer.push("<!--[-->");
									Card_footer($$renderer, {
										class: "text-muted-foreground items-center justify-between text-xs",
										children: ($$renderer) => {
											$$renderer.push(`<div class="flex items-center gap-3"><span class="flex items-center gap-1">`);
											Brain($$renderer, { class: "size-3.5" });
											$$renderer.push(`<!---->${escape_html(agent.memoryCount)}</span> <span class="flex items-center gap-1">`);
											Book_open($$renderer, { class: "size-3.5" });
											$$renderer.push(`<!---->${escape_html(agent.playbookCount)}</span> <span class="flex items-center gap-1">`);
											List_checks($$renderer, { class: "size-3.5" });
											$$renderer.push(`<!---->${escape_html(agent.taskCount)}</span></div> <div class="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">`);
											Button($$renderer, {
												type: "button",
												variant: "ghost",
												size: "icon-sm",
												"aria-label": "Edit agent",
												class: "text-muted-foreground hover:text-foreground",
												onclick: () => openEdit(agent),
												children: ($$renderer) => {
													Pencil($$renderer, { class: "size-4" });
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", agent.id)}/> `);
											Button($$renderer, {
												type: "submit",
												variant: "ghost",
												size: "icon-sm",
												"aria-label": "Delete agent",
												class: "text-muted-foreground hover:text-destructive",
												children: ($$renderer) => {
													Trash_2($$renderer, { class: "size-4" });
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></form></div>`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
							},
							$$slots: { default: true }
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				}
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-D73HKF_G.js.map
