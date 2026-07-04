import { a1 as head, _ as ensure_array_like, T as derived, a3 as spread_props, a9 as escape_html, a0 as attr, a7 as attr_class } from '../../../chunks/server.js-BeDXxHyW.js';
import { I as Icon, B as Button } from '../../../chunks/button.js-BKCc13Pl.js';
import { T as Triangle_alert } from '../../../chunks/triangle-alert.js-D5mtn1DL.js';
import { S as Separator } from '../../../chunks/separator.js-DXXH6IUo.js';
import { A as Activity } from '../../../chunks/activity.js-CJHn9ZoA.js';
import { I as Inbox } from '../../../chunks/inbox.js-BrajTkm6.js';
import { C as Card, a as Card_header, b as Card_description, c as Card_title, d as Card_action, e as Card_footer, f as Card_content } from '../../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../chunks/page-header.js-Bo0OtOYz.js';
import { b as formatRelative } from '../../../chunks/datetime.js-DS-g6TQJ.js';
import { A as Arrow_up_right } from '../../../chunks/arrow-up-right.js-DiQMgjIG.js';
import { T as Timer } from '../../../chunks/timer.js-CkKaJpeW.js';
import '../../../chunks/shared.js-CgP5r6wP.js';
import '../../../chunks/create-id.js-BN8YEFln.js';
import '../../../chunks/palette.js-BPVUdeAc.js';
import '../../../chunks/index-server2.js-UaiofxX-.js';

//#region node_modules/@lucide/svelte/dist/icons/dollar-sign.svelte
function Dollar_sign($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "dollar-sign" },
		props,
		{ iconNode: [["line", {
			"x1": "12",
			"x2": "12",
			"y1": "2",
			"y2": "22"
		}], ["path", { "d": "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" }]] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/coins.svelte
function Coins($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "coins" },
		props,
		{ iconNode: [
			["path", { "d": "M13.744 17.736a6 6 0 1 1-7.48-7.48" }],
			["path", { "d": "M15 6h1v4" }],
			["path", { "d": "m6.134 14.768.866-.5 2 3.464" }],
			["circle", {
				"cx": "16",
				"cy": "8",
				"r": "6"
			}]
		] }
	]));
}
//#endregion
//#region src/routes/activity/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const usd = (n) => `$${(Number(n) || 0).toFixed(Number(n) >= 1 ? 2 : 4)}`;
		const compact = new Intl.NumberFormat("en-US", {
			notation: "compact",
			maximumFractionDigits: 1
		});
		const num = (n) => compact.format(Number(n) || 0);
		const isErrorEvent = (event) => /error/i.test(String(event));
		function summarizeFields(fields) {
			const parts = [];
			for (const [key, value] of Object.entries(fields ?? {})) {
				if (value == null || value === "" || key === "error") continue;
				let text;
				if (Array.isArray(value)) {
					if (!value.length) continue;
					text = value.join(", ");
				} else if (typeof value === "object") continue;
				else text = String(value);
				parts.push(`${key} ${text.slice(0, 40)}`);
				if (parts.length >= 6) break;
			}
			return parts.join(" · ");
		}
		const sched = derived(() => data.scheduler);
		const intervalMin = derived(() => sched().intervalMs ? Math.round(sched().intervalMs / 6e4) : null);
		const schedStatus = derived(() => sched().status === "running" ? {
			label: "Running",
			variant: "secondary"
		} : sched().status === "disabled" ? {
			label: "Disabled",
			variant: "outline"
		} : {
			label: "Unknown",
			variant: "outline"
		});
		const tickSummary = derived(() => sched().lastTick ? [
			`${sched().lastTick.agents ?? 0} agent${sched().lastTick.agents === 1 ? "" : "s"}`,
			`${sched().lastTick.dispatched ?? 0} dispatched`,
			`${sched().lastTick.reflected ?? 0} reflected`,
			sched().lastTick.collectorsPolled != null ? `${sched().lastTick.collectorsPolled} collectors` : null,
			sched().lastTick.ms != null ? `${sched().lastTick.ms}ms` : null
		].filter(Boolean).join(" · ") : null);
		const stats = derived(() => [
			{
				label: "Total runs",
				value: data.stats.runs,
				hint: "dispatched agent runs",
				icon: Activity
			},
			{
				label: "Estimated cost",
				value: usd(data.stats.costUsd),
				hint: "across all runs",
				icon: Dollar_sign
			},
			{
				label: "Tokens used",
				value: num(data.stats.inputTokens + data.stats.outputTokens),
				hint: `${num(data.stats.inputTokens)} in · ${num(data.stats.outputTokens)} out`,
				icon: Coins
			},
			{
				label: "Pending approvals",
				value: data.stats.pending,
				hint: data.stats.pending > 0 ? "awaiting your review" : "all clear",
				icon: Inbox
			}
		]);
		function runStatus(run) {
			if (run.error) return {
				label: "Failed",
				variant: "destructive"
			};
			if (run.committed) return {
				label: "Approved",
				variant: "secondary"
			};
			if (run.denied) return {
				label: "Denied",
				variant: "outline"
			};
			if (run.pending) return {
				label: `${run.stagedCount} pending`,
				variant: "default"
			};
			return {
				label: "Read-only",
				variant: "outline"
			};
		}
		head("13r34ge", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Activity · WieldOS</title>`);
			});
		});
		Page_header($$renderer, {
			title: "Activity",
			description: "Agent runs, token spend, and approvals across your workforce",
			children: ($$renderer) => {
				Button($$renderer, {
					size: "sm",
					variant: "outline",
					href: "/agents",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Agents `);
						Arrow_up_right($$renderer, { class: "size-4" });
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
			}});
		$$renderer.push(`<!----> <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`);
		const each_array = ensure_array_like(stats());
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let stat = each_array[$$index];
			const Icon = stat.icon;
			if (Card) {
				$$renderer.push("<!--[-->");
				Card($$renderer, {
					children: ($$renderer) => {
						if (Card_header) {
							$$renderer.push("<!--[-->");
							Card_header($$renderer, {
								children: ($$renderer) => {
									if (Card_description) {
										$$renderer.push("<!--[-->");
										Card_description($$renderer, {
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(stat.label)}`);
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(` `);
									if (Card_title) {
										$$renderer.push("<!--[-->");
										Card_title($$renderer, {
											class: "text-3xl",
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(stat.value)}`);
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(` `);
									if (Card_action) {
										$$renderer.push("<!--[-->");
										Card_action($$renderer, {
											children: ($$renderer) => {
												$$renderer.push(`<div class="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-lg">`);
												if (Icon) {
													$$renderer.push("<!--[-->");
													Icon($$renderer, { class: "size-4" });
													$$renderer.push("<!--]-->");
												} else {
													$$renderer.push("<!--[!-->");
													$$renderer.push("<!--]-->");
												}
												$$renderer.push(`</div>`);
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
						$$renderer.push(` `);
						if (Card_footer) {
							$$renderer.push("<!--[-->");
							Card_footer($$renderer, {
								children: ($$renderer) => {
									$$renderer.push(`<span class="text-muted-foreground text-xs">${escape_html(stat.hint)}</span>`);
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
		$$renderer.push(`<!--]--></div> <div class="grid gap-4 lg:grid-cols-3">`);
		if (Card) {
			$$renderer.push("<!--[-->");
			Card($$renderer, {
				class: "lg:col-span-2",
				children: ($$renderer) => {
					if (Card_header) {
						$$renderer.push("<!--[-->");
						Card_header($$renderer, {
							children: ($$renderer) => {
								if (Card_title) {
									$$renderer.push("<!--[-->");
									Card_title($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<!---->Recent runs`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
								$$renderer.push(` `);
								if (Card_description) {
									$$renderer.push("<!--[-->");
									Card_description($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<!---->Most recent agent dispatches`);
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
					$$renderer.push(` `);
					if (Card_content) {
						$$renderer.push("<!--[-->");
						Card_content($$renderer, {
							class: "flex flex-col gap-1",
							children: ($$renderer) => {
								const each_array_1 = ensure_array_like(data.runs);
								if (each_array_1.length !== 0) {
									$$renderer.push("<!--[-->");
									for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
										let run = each_array_1[i];
										const status = runStatus(run);
										if (i > 0) {
											$$renderer.push("<!--[0-->");
											Separator($$renderer, {});
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> <a${attr("href", `/agents/${run.agentId}`)} class="hover:bg-muted/50 -mx-2 flex flex-col gap-1 rounded-md px-2 py-2.5 transition-colors"><div class="flex items-center gap-2"><span class="text-sm font-medium">${escape_html(run.agentName ?? `Agent #${run.agentId}`)}</span> `);
										Badge($$renderer, {
											variant: status.variant,
											class: "text-[10px]",
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(status.label)}`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> <span class="text-muted-foreground ml-auto text-xs">${escape_html(formatRelative(run.createdAt))}</span></div> <p class="text-muted-foreground line-clamp-1 text-xs">${escape_html(run.objective || run.summary || "—")}</p> <div class="text-muted-foreground flex items-center gap-3 text-[11px] tabular-nums"><span>${escape_html(run.steps)} step${escape_html(run.steps === 1 ? "" : "s")}</span> <span>${escape_html(num(run.inputTokens + run.outputTokens))} tok</span> <span>${escape_html(usd(run.costUsd))}</span></div></a>`);
									}
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push(`<p class="text-muted-foreground py-8 text-center text-sm">No agent runs yet. The scheduler and orchestrator will fill this in.</p>`);
								}
								$$renderer.push(`<!--]-->`);
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
		$$renderer.push(` `);
		if (Card) {
			$$renderer.push("<!--[-->");
			Card($$renderer, {
				children: ($$renderer) => {
					if (Card_header) {
						$$renderer.push("<!--[-->");
						Card_header($$renderer, {
							children: ($$renderer) => {
								if (Card_title) {
									$$renderer.push("<!--[-->");
									Card_title($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<!---->Cost by agent`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
								$$renderer.push(` `);
								if (Card_description) {
									$$renderer.push("<!--[-->");
									Card_description($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<!---->Estimated spend`);
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
					$$renderer.push(` `);
					if (Card_content) {
						$$renderer.push("<!--[-->");
						Card_content($$renderer, {
							class: "flex flex-col gap-3",
							children: ($$renderer) => {
								const each_array_2 = ensure_array_like(data.stats.perAgent);
								if (each_array_2.length !== 0) {
									$$renderer.push("<!--[-->");
									for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
										let agent = each_array_2[$$index_2];
										$$renderer.push(`<div class="flex items-center justify-between gap-3"><a${attr("href", `/agents/${agent.agentId}`)} class="text-sm font-medium hover:underline">${escape_html(agent.agentName)}</a> <div class="text-muted-foreground flex items-center gap-3 text-xs tabular-nums"><span>${escape_html(agent.runs)} run${escape_html(agent.runs === 1 ? "" : "s")}</span> <span class="text-foreground font-medium">${escape_html(usd(agent.costUsd))}</span></div></div>`);
									}
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push(`<p class="text-muted-foreground py-8 text-center text-sm">No spend recorded yet.</p>`);
								}
								$$renderer.push(`<!--]-->`);
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
		$$renderer.push(`</div> <div class="grid gap-4 lg:grid-cols-3">`);
		if (Card) {
			$$renderer.push("<!--[-->");
			Card($$renderer, {
				class: "lg:col-span-2",
				children: ($$renderer) => {
					if (Card_header) {
						$$renderer.push("<!--[-->");
						Card_header($$renderer, {
							children: ($$renderer) => {
								if (Card_title) {
									$$renderer.push("<!--[-->");
									Card_title($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<!---->Event log`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
								$$renderer.push(` `);
								if (Card_description) {
									$$renderer.push("<!--[-->");
									Card_description($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<!---->Recent scheduler and agent events`);
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
					$$renderer.push(` `);
					if (Card_content) {
						$$renderer.push("<!--[-->");
						Card_content($$renderer, {
							class: "flex flex-col gap-1",
							children: ($$renderer) => {
								const each_array_3 = ensure_array_like(data.activity);
								if (each_array_3.length !== 0) {
									$$renderer.push("<!--[-->");
									for (let i = 0, $$length = each_array_3.length; i < $$length; i++) {
										let ev = each_array_3[i];
										if (i > 0) {
											$$renderer.push("<!--[0-->");
											Separator($$renderer, {});
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> <div class="flex items-start gap-2 py-2"><span${attr_class(`mt-1.5 size-1.5 shrink-0 rounded-full ${isErrorEvent(ev.event) ? "bg-destructive" : "bg-muted-foreground/40"}`)}></span> <div class="min-w-0 flex-1"><div class="flex items-center gap-2"><span class="font-mono text-xs">${escape_html(ev.event)}</span> <span class="text-muted-foreground ml-auto shrink-0 text-[11px]">${escape_html(formatRelative(ev.createdAt))}</span></div> `);
										if (ev.fields.error) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<p class="text-destructive line-clamp-1 text-xs">${escape_html(ev.fields.error)}</p>`);
										} else if (summarizeFields(ev.fields)) {
											$$renderer.push("<!--[1-->");
											$$renderer.push(`<p class="text-muted-foreground line-clamp-1 text-xs tabular-nums">${escape_html(summarizeFields(ev.fields))}</p>`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--></div></div>`);
									}
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push(`<p class="text-muted-foreground py-8 text-center text-sm">No activity recorded yet.</p>`);
								}
								$$renderer.push(`<!--]-->`);
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
		$$renderer.push(` `);
		if (Card) {
			$$renderer.push("<!--[-->");
			Card($$renderer, {
				children: ($$renderer) => {
					if (Card_header) {
						$$renderer.push("<!--[-->");
						Card_header($$renderer, {
							children: ($$renderer) => {
								if (Card_title) {
									$$renderer.push("<!--[-->");
									Card_title($$renderer, {
										class: "flex items-center gap-2",
										children: ($$renderer) => {
											Timer($$renderer, { class: "text-muted-foreground size-4" });
											$$renderer.push(`<!----> Scheduler`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
								$$renderer.push(` `);
								if (Card_description) {
									$$renderer.push("<!--[-->");
									Card_description($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<!---->Background agent loop`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
								$$renderer.push(` `);
								if (Card_action) {
									$$renderer.push("<!--[-->");
									Card_action($$renderer, {
										children: ($$renderer) => {
											Badge($$renderer, {
												variant: schedStatus().variant,
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(schedStatus().label)}`);
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
							class: "flex flex-col gap-3 text-sm",
							children: ($$renderer) => {
								if (sched().status === "disabled") {
									$$renderer.push("<!--[0-->");
									$$renderer.push(`<p class="text-muted-foreground">Off — ${escape_html(sched().disabledReason || "not enabled")}. Set <code class="text-xs">SCHEDULER_ENABLED=1</code> (with an Anthropic key) to run it.</p>`);
								} else if (sched().status === "unknown") {
									$$renderer.push("<!--[1-->");
									$$renderer.push(`<p class="text-muted-foreground">No scheduler lifecycle recorded yet this process.</p>`);
								} else {
									$$renderer.push("<!--[-1-->");
									$$renderer.push(`<div class="flex items-center justify-between"><span class="text-muted-foreground">Cadence</span> <span class="tabular-nums">every ${escape_html(intervalMin())}m</span></div>`);
								}
								$$renderer.push(`<!--]--> <div class="flex items-center justify-between"><span class="text-muted-foreground">Last tick</span> <span>${escape_html(sched().lastTickAt ? formatRelative(sched().lastTickAt) : "—")}</span></div> `);
								if (tickSummary()) {
									$$renderer.push("<!--[0-->");
									$$renderer.push(`<p class="text-muted-foreground text-xs tabular-nums">${escape_html(tickSummary())}</p>`);
								} else $$renderer.push("<!--[-1-->");
								$$renderer.push(`<!--]--> <div class="flex items-center justify-between"><span class="text-muted-foreground">Last 24h</span> <span class="tabular-nums">${escape_html(sched().ticks24h)} tick${escape_html(sched().ticks24h === 1 ? "" : "s")} · ${escape_html(sched().errors24h)} error${escape_html(sched().errors24h === 1 ? "" : "s")}</span></div> `);
								if (sched().lastError) {
									$$renderer.push("<!--[0-->");
									$$renderer.push(`<div class="border-destructive/30 bg-destructive/5 rounded-md border px-3 py-2"><div class="text-destructive flex items-center gap-2 text-xs font-medium">`);
									Triangle_alert($$renderer, { class: "size-3.5 shrink-0" });
									$$renderer.push(`<!----> <span class="font-mono">${escape_html(sched().lastError.event)}</span> <span class="text-muted-foreground ml-auto font-normal">${escape_html(formatRelative(sched().lastError.createdAt))}</span></div> `);
									if (sched().lastError.message) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<p class="text-muted-foreground mt-1 line-clamp-2 text-xs">${escape_html(sched().lastError.message)}</p>`);
									} else $$renderer.push("<!--[-1-->");
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
				},
				$$slots: { default: true }
			});
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
		$$renderer.push(`</div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-BkhMB-Os.js.map
