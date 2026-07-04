import { a1 as head, _ as ensure_array_like, T as derived, a9 as escape_html, a0 as attr, a7 as attr_class, a3 as spread_props } from '../../chunks/server.js-BeDXxHyW.js';
import { B as Button, I as Icon } from '../../chunks/button.js-BKCc13Pl.js';
import { S as Separator } from '../../chunks/separator.js-DXXH6IUo.js';
import { P as Progress } from '../../chunks/progress.js-Dt-zKABp.js';
import '../../chunks/client.js-u-B9u8_c.js';
import { C as Circle_check_big } from '../../chunks/circle-check-big.js-Dt7uTxUS.js';
import { F as Folder_kanban } from '../../chunks/folder-kanban.js-fP0CGmTv.js';
import { N as Notebook_pen } from '../../chunks/notebook-pen.js-ozXOqybA.js';
import { C as Calendar_days } from '../../chunks/calendar-days.js-DJ_3FQbv.js';
import { I as Inbox } from '../../chunks/inbox.js-BrajTkm6.js';
import { C as Card, a as Card_header, b as Card_description, c as Card_title, d as Card_action, e as Card_footer, f as Card_content } from '../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../chunks/page-header.js-Bo0OtOYz.js';
import { f as formatTime, i as isOverdue, a as formatDueDate } from '../../chunks/datetime.js-DS-g6TQJ.js';
import { P as Plus } from '../../chunks/plus.js-BImBz3Qf.js';
import { A as Arrow_up_right } from '../../chunks/arrow-up-right.js-DiQMgjIG.js';
import { F as Flame, C as Clock } from '../../chunks/flame.js-DXdo46Y6.js';
import { T as Timer } from '../../chunks/timer.js-CkKaJpeW.js';
import { P as Play } from '../../chunks/play.js-BmT9XzUw.js';
import { R as Rotate_ccw } from '../../chunks/rotate-ccw.js-DVa2SmVN.js';
import '../../chunks/shared.js-CgP5r6wP.js';
import '../../chunks/create-id.js-BN8YEFln.js';
import '../../chunks/palette.js-BPVUdeAc.js';
import '../../chunks/index-server2.js-UaiofxX-.js';
import '../../chunks/exports.js-Y2Zp5fEj.js';
import '../../chunks/internal2.js-0xtVfVtb.js';
import '../../chunks/index-server.js-YgGoPwWh.js';
import '../../chunks/chunk.js-BBx_TEkp.js';
import '../../chunks/utils.js-UusfKV9V.js';

//#region node_modules/@lucide/svelte/dist/icons/pause.svelte
function Pause($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "pause" },
		props,
		{ iconNode: [["rect", {
			"x": "14",
			"y": "3",
			"width": "5",
			"height": "18",
			"rx": "1"
		}], ["rect", {
			"x": "5",
			"y": "3",
			"width": "5",
			"height": "18",
			"rx": "1"
		}]] }
	]));
}
//#endregion
//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let running = false;
		let accumulated = 0;
		let startedAt = 0;
		let nowTick = 0;
		const elapsed = derived(() => accumulated + (running ? nowTick - startedAt : 0));
		function startStop() {
			if (running) {
				accumulated += Date.now() - startedAt;
				running = false;
			} else {
				startedAt = Date.now();
				nowTick = startedAt;
				running = true;
			}
		}
		function resetStopwatch() {
			running = false;
			accumulated = 0;
			startedAt = 0;
		}
		function formatStopwatch(ms) {
			const totalCs = Math.floor(ms / 10);
			const cs = totalCs % 100;
			const totalSeconds = Math.floor(totalCs / 100);
			const seconds = totalSeconds % 60;
			const minutes = Math.floor(totalSeconds / 60) % 60;
			const hours = Math.floor(totalSeconds / 3600);
			const pad = (n) => String(n).padStart(2, "0");
			const base = `${pad(minutes)}:${pad(seconds)}.${pad(cs)}`;
			return hours > 0 ? `${pad(hours)}:${base}` : base;
		}
		const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric"
		});
		const stats = derived(() => [
			{
				label: "Tasks due today",
				value: data.stats.tasksDueToday,
				hint: data.stats.tasksOverdue > 0 ? `${data.stats.tasksOverdue} overdue` : "all on track",
				icon: Circle_check_big
			},
			{
				label: "Active projects",
				value: data.stats.activeProjects,
				hint: `${data.stats.totalProjects} total`,
				icon: Folder_kanban
			},
			{
				label: "Notes this week",
				value: data.stats.notesThisWeek,
				hint: "captured recently",
				icon: Notebook_pen
			},
			{
				label: "Events today",
				value: data.stats.eventsToday,
				hint: data.stats.nextEvent ? `next at ${formatTime(data.stats.nextEvent.startTime)}` : "nothing scheduled",
				icon: Calendar_days
			}
		]);
		const priorityVariant = {
			high: "destructive",
			medium: "secondary",
			low: "outline"
		};
		head("1uha8ag", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Overview · WieldOS</title>`);
			});
		});
		Page_header($$renderer, {
			title: data.alias ? `Good to see you, ${data.alias}` : "Good to see you",
			description: today,
			children: ($$renderer) => {
				if (data.stats.bestStreak > 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1.5 text-sm font-medium text-orange-600 dark:text-orange-400" title="Best active streak across your recurring tasks">`);
					Flame($$renderer, { class: "size-4" });
					$$renderer.push(`<!----> ${escape_html(data.stats.bestStreak)} day streak</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				Button($$renderer, {
					size: "sm",
					href: "/tasks",
					children: ($$renderer) => {
						Plus($$renderer, { class: "size-4" });
						$$renderer.push(`<!----> Quick add`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
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
		$$renderer.push(`<!--]--></div> `);
		if (data.pendingApprovals > 0) {
			$$renderer.push("<!--[0-->");
			if (Card) {
				$$renderer.push("<!--[-->");
				Card($$renderer, {
					class: "border-amber-500/40 bg-amber-500/5",
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
												Inbox($$renderer, { class: "size-4 text-amber-600 dark:text-amber-400" });
												$$renderer.push(`<!----> Approvals waiting`);
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
												$$renderer.push(`<!---->${escape_html(data.pendingApprovals)}
				agent ${escape_html(data.pendingApprovals === 1 ? "run has" : "runs have")} staged actions awaiting your review.`);
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
												Button($$renderer, {
													size: "sm",
													href: "/inbox",
													children: ($$renderer) => {
														$$renderer.push(`<!---->Review `);
														Arrow_up_right($$renderer, { class: "size-4" });
														$$renderer.push(`<!---->`);
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
					},
					$$slots: { default: true }
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
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
											$$renderer.push(`<!----> Stopwatch`);
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
											$$renderer.push(`<!---->${escape_html(running ? "Running" : elapsed() > 0 ? "Paused" : "Ready")}`);
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
							class: "flex flex-wrap items-center justify-between gap-4",
							children: ($$renderer) => {
								$$renderer.push(`<span class="font-mono text-4xl font-semibold tabular-nums">${escape_html(formatStopwatch(elapsed()))}</span> <div class="flex items-center gap-2">`);
								Button($$renderer, {
									size: "sm",
									onclick: startStop,
									children: ($$renderer) => {
										if (running) {
											$$renderer.push("<!--[0-->");
											Pause($$renderer, { class: "size-4" });
											$$renderer.push(`<!----> Pause`);
										} else {
											$$renderer.push("<!--[-1-->");
											Play($$renderer, { class: "size-4" });
											$$renderer.push(`<!----> ${escape_html(elapsed() > 0 ? "Resume" : "Start")}`);
										}
										$$renderer.push(`<!--]-->`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----> `);
								Button($$renderer, {
									size: "sm",
									variant: "outline",
									onclick: resetStopwatch,
									disabled: running || elapsed() === 0,
									children: ($$renderer) => {
										Rotate_ccw($$renderer, { class: "size-4" });
										$$renderer.push(`<!----> Reset`);
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
				},
				$$slots: { default: true }
			});
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
		$$renderer.push(` <div class="grid gap-4 lg:grid-cols-3">`);
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
											$$renderer.push(`<!---->Tasks needing attention`);
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
											$$renderer.push(`<!---->Due today and overdue`);
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
											Button($$renderer, {
												variant: "ghost",
												size: "sm",
												href: "/tasks",
												children: ($$renderer) => {
													$$renderer.push(`<!---->View all `);
													Arrow_up_right($$renderer, { class: "size-4" });
													$$renderer.push(`<!---->`);
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
							class: "flex flex-col gap-1",
							children: ($$renderer) => {
								const each_array_1 = ensure_array_like(data.dueTasks);
								if (each_array_1.length !== 0) {
									$$renderer.push("<!--[-->");
									for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
										let task = each_array_1[i];
										if (i > 0) {
											$$renderer.push("<!--[0-->");
											Separator($$renderer, {});
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> <div class="flex items-center gap-3 py-2"><form method="POST" action="?/toggleTask"><input type="hidden" name="id"${attr("value", task.id)}/> <button type="submit" aria-label="Toggle task" class="border-muted-foreground/40 hover:border-primary flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors"></button></form> <span class="flex-1 text-sm">${escape_html(task.title)}</span> `);
										if (task.projectName) {
											$$renderer.push("<!--[0-->");
											Badge($$renderer, {
												variant: "outline",
												class: "hidden sm:inline-flex",
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(task.projectName)}`);
												},
												$$slots: { default: true }
											});
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> `);
										Badge($$renderer, {
											variant: priorityVariant[task.priority],
											class: "hidden capitalize sm:inline-flex",
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(task.priority)}`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> <span${attr_class(`flex items-center gap-1 text-xs ${isOverdue(task.dueDate) ? "text-destructive" : "text-muted-foreground"}`)}>`);
										Clock($$renderer, { class: "size-3" });
										$$renderer.push(`<!----> ${escape_html(formatDueDate(task.dueDate))}</span></div>`);
									}
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push(`<p class="text-muted-foreground py-8 text-center text-sm">Nothing due right now. Enjoy the breathing room.</p>`);
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
											$$renderer.push(`<!---->Schedule`);
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
											$$renderer.push(`<!---->Today`);
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
											Button($$renderer, {
												variant: "ghost",
												size: "sm",
												href: "/schedule",
												children: ($$renderer) => {
													Arrow_up_right($$renderer, { class: "size-4" });
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
							class: "flex flex-col gap-4",
							children: ($$renderer) => {
								const each_array_2 = ensure_array_like(data.schedule);
								if (each_array_2.length !== 0) {
									$$renderer.push("<!--[-->");
									for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
										let event = each_array_2[$$index_2];
										$$renderer.push(`<div class="flex items-start gap-3"><span class="text-muted-foreground w-16 shrink-0 text-xs font-medium tabular-nums">${escape_html(formatTime(event.startTime))}</span> <div class="bg-border relative flex-1 pl-4"><span class="bg-primary absolute -left-[3px] top-1 size-1.5 rounded-full"></span> <p class="text-sm font-medium leading-none">${escape_html(event.title)}</p> <p class="text-muted-foreground mt-1 text-xs capitalize">${escape_html(event.category)}</p></div></div>`);
									}
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push(`<p class="text-muted-foreground py-8 text-center text-sm">No events today.</p>`);
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
		$$renderer.push(`</div> `);
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
											$$renderer.push(`<!---->Project progress`);
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
											$$renderer.push(`<!---->Where your bigger efforts stand`);
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
											Button($$renderer, {
												variant: "ghost",
												size: "sm",
												href: "/projects",
												children: ($$renderer) => {
													$$renderer.push(`<!---->View all `);
													Arrow_up_right($$renderer, { class: "size-4" });
													$$renderer.push(`<!---->`);
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
							class: "grid gap-6 sm:grid-cols-3",
							children: ($$renderer) => {
								const each_array_3 = ensure_array_like(data.projects);
								if (each_array_3.length !== 0) {
									$$renderer.push("<!--[-->");
									for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
										let project = each_array_3[$$index_3];
										$$renderer.push(`<div class="space-y-2"><div class="flex items-center justify-between"><span class="text-sm font-medium">${escape_html(project.name)}</span> <span class="text-muted-foreground text-xs">${escape_html(project.doneTasks)} / ${escape_html(project.totalTasks)}</span></div> `);
										Progress($$renderer, { value: project.progress });
										$$renderer.push(`<!----> <span class="text-muted-foreground text-xs">${escape_html(project.progress)}% complete</span></div>`);
									}
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push(`<p class="text-muted-foreground col-span-full py-4 text-center text-sm">No projects yet.</p>`);
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
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-BszM7gr2.js.map
