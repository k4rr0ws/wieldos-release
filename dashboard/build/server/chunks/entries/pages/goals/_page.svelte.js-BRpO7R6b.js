import { a1 as head, a9 as escape_html, _ as ensure_array_like, T as derived, a7 as attr_class, a3 as spread_props, a0 as attr } from '../../../chunks/server.js-BeDXxHyW.js';
import { B as Button, I as Icon } from '../../../chunks/button.js-BKCc13Pl.js';
import { C as Circle_check } from '../../../chunks/circle-check.js-B6UbzeD-.js';
import { I as Input } from '../../../chunks/input.js-VxJyhIEJ.js';
import { D as Dialog, a as Dialog_trigger, b as Dialog_content, c as Dialog_header, e as Dialog_title, f as Dialog_description, d as Dialog_footer } from '../../../chunks/dialog.js-BiupuAC8.js';
import { L as Label } from '../../../chunks/label.js-C7a3GAk3.js';
import '../../../chunks/client.js-C3bkgsj6.js';
import { T as Target } from '../../../chunks/target.js-sMu4JatZ.js';
import { C as Card, f as Card_content, a as Card_header, e as Card_footer, c as Card_title } from '../../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../chunks/page-header.js-Bo0OtOYz.js';
import { b as formatRelative } from '../../../chunks/datetime.js-DS-g6TQJ.js';
import { P as Plus } from '../../../chunks/plus.js-BImBz3Qf.js';
import { T as Trash_2 } from '../../../chunks/trash-2.js-CCEbkDYU.js';
import { T as Textarea } from '../../../chunks/textarea.js-OJ5frhCS.js';
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
import '../../../chunks/internal2.js-3fvE3IOr.js';
import '../../../chunks/utils.js-UusfKV9V.js';

//#region node_modules/@lucide/svelte/dist/icons/trophy.svelte
function Trophy($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "trophy" },
		props,
		{ iconNode: [
			["path", { "d": "M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978" }],
			["path", { "d": "M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978" }],
			["path", { "d": "M18 9h1.5a1 1 0 0 0 0-5H18" }],
			["path", { "d": "M4 22h16" }],
			["path", { "d": "M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z" }],
			["path", { "d": "M6 9H4.5a1 1 0 0 1 0-5H6" }]
		] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/circle.svelte
function Circle($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "circle" },
		props,
		{ iconNode: [["circle", {
			"cx": "12",
			"cy": "12",
			"r": "10"
		}]] }
	]));
}
//#endregion
//#region src/routes/goals/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let dialogOpen = false;
		let editOpen = false;
		let editId = null;
		let editTitle = "";
		let editDescription = "";
		const GOAL_TEMPLATES = [
			{
				key: "build",
				label: "🔨 Create things",
				title: "Build something that matters",
				description: `Create a product, protocol, or system that solves a real problem and compounds in value over time. Ship continuously, learn from users, and raise the quality bar with every iteration.

* Define the one problem you're uniquely positioned to solve
* Ship a working version to real users within 90 days
* Talk to users weekly — let feedback drive the roadmap
* Cut every feature that doesn't serve the core use case
* Measure what matters: retention, usage depth, word of mouth`
			},
			{
				key: "ownership",
				label: "💰 Financial freedom",
				title: "Achieve financial independence",
				description: `Build enough ownership — equity, tokens, revenue, or assets — that work becomes a choice rather than a necessity. Design for long-term compounding, not short-term income.

* Calculate your actual number — what monthly passive income covers your life
* Prioritize equity and ownership over salary wherever possible
* Build revenue streams that don't require your direct time
* Reinvest aggressively in the early years; optimize lifestyle later
* Avoid lifestyle inflation — the gap between income and spend is what compounds`
			},
			{
				key: "influence",
				label: "📣 Earn influence",
				title: "Become a trusted voice in the space",
				description: `Build a reputation that opens doors, attracts collaborators, and shapes the direction of the industry. Earn influence through consistent, high-quality thinking shared publicly over years.

* Pick a specific niche and go deeper than anyone else
* Write or post publicly at least once a week — quantity builds quality over time
* Share your real process, mistakes, and contrarian views — that's what gets remembered
* Engage genuinely with others in your space; influence is reciprocal
* Build an audience you own (email list, community) alongside social presence`
			},
			{
				key: "mastery",
				label: "🎯 Deep mastery",
				title: "Reach the top of a craft",
				description: `Go deep on one domain until you are among the best. Mastery creates leverage — the insights, intuitions, and speed that come from years of focused practice compound in ways breadth cannot.

* Choose one domain and commit to it for at least three years
* Spend the first hour of every workday on deliberate practice, not reactive tasks
* Study the best in the field obsessively — read everything they've written
* Seek feedback from people who are better than you, not peers at your level
* Track your progress visibly — mastery is slow and feedback loops matter`
			},
			{
				key: "network",
				label: "🤝 Strong network",
				title: "Build a world-class network",
				description: `Surround yourself with exceptional builders, operators, and thinkers. The right network compounds: it generates opportunities, provides honest feedback, and raises your own standards.

* Be useful first — give value before you ask for anything
* Attend the events and spaces where the best people in your field gather
* Maintain relationships actively — follow up, remember context, check in
* Introduce people to each other; your network grows when you connect others
* Quality over quantity — 20 deep relationships beat 2000 weak ones`
			},
			{
				key: "legacy",
				label: "🏛️ Lasting legacy",
				title: "Leave something lasting",
				description: `Build or contribute to something that outlives your direct involvement — an open protocol, a community, a body of work, or an institution that others carry forward.

* Identify what you want to be known for in 20 years and work backwards
* Build in public so your thinking and process outlast any single product
* Invest in people — mentor, teach, and share knowledge generously
* Create systems and documentation that let others carry the work forward
* Prioritize open and composable work over closed and proprietary where possible`
			}
		];
		let createTitle = "";
		let createDescription = "";
		function openCreate() {
			createTitle = "";
			createDescription = "";
			dialogOpen = true;
		}
		const achievedCount = derived(() => data.goals.filter((g) => g.achieved).length);
		function openEdit(goal) {
			editId = goal.id;
			editTitle = goal.title;
			editDescription = goal.description;
			editOpen = true;
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("1xpegcv", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Goals · WieldOS</title>`);
				});
			});
			Page_header($$renderer, {
				title: "Goals",
				description: "What you're working toward",
				icon: Target,
				children: ($$renderer) => {
					if (Dialog) {
						$$renderer.push("<!--[-->");
						Dialog($$renderer, {
							get open() {
								return dialogOpen;
							},
							set open($$value) {
								dialogOpen = $$value;
								$$settled = false;
							},
							children: ($$renderer) => {
								{
									function child($$renderer, { props }) {
										Button($$renderer, spread_props([
											{ size: "sm" },
											props,
											{
												onclick: openCreate,
												children: ($$renderer) => {
													Plus($$renderer, { class: "size-4" });
													$$renderer.push(`<!----> New goal`);
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
										children: ($$renderer) => {
											if (Dialog_header) {
												$$renderer.push("<!--[-->");
												Dialog_header($$renderer, {
													children: ($$renderer) => {
														if (Dialog_title) {
															$$renderer.push("<!--[-->");
															Dialog_title($$renderer, {
																children: ($$renderer) => {
																	$$renderer.push(`<!---->New goal`);
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
																	$$renderer.push(`<!---->Name something you want to achieve.`);
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
											$$renderer.push(` <form method="POST" action="?/create" class="grid gap-4"><div class="-mt-1 flex flex-wrap items-center gap-1.5"><!--[-->`);
											const each_array = ensure_array_like(GOAL_TEMPLATES);
											for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
												let t = each_array[$$index];
												$$renderer.push(`<button type="button"${attr_class(`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] transition-colors ${createTitle === t.title ? "bg-foreground text-background border-foreground" : "text-muted-foreground border-input hover:border-foreground/40 hover:text-foreground"}`)}>${escape_html(t.label)}</button>`);
											}
											$$renderer.push(`<!--]--></div> <div class="grid gap-2">`);
											Label($$renderer, {
												for: "title",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Title`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Input($$renderer, {
												id: "title",
												name: "title",
												placeholder: "Run a half marathon",
												required: true,
												get value() {
													return createTitle;
												},
												set value($$value) {
													createTitle = $$value;
													$$settled = false;
												}
											});
											$$renderer.push(`<!----> `);
											if (form?.message) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<p class="text-destructive text-xs">${escape_html(form.message)}</p>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div> <div class="grid gap-2">`);
											Label($$renderer, {
												for: "description",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Details`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Textarea($$renderer, {
												id: "description",
												name: "description",
												placeholder: "Why it matters, how you'll get there...",
												rows: 5,
												get value() {
													return createDescription;
												},
												set value($$value) {
													createDescription = $$value;
													$$settled = false;
												}
											});
											$$renderer.push(`<!----></div> `);
											if (Dialog_footer) {
												$$renderer.push("<!--[-->");
												Dialog_footer($$renderer, {
													children: ($$renderer) => {
														Button($$renderer, {
															type: "submit",
															children: ($$renderer) => {
																$$renderer.push(`<!---->Save goal`);
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
								children: ($$renderer) => {
									if (Dialog_header) {
										$$renderer.push("<!--[-->");
										Dialog_header($$renderer, {
											children: ($$renderer) => {
												if (Dialog_title) {
													$$renderer.push("<!--[-->");
													Dialog_title($$renderer, {
														children: ($$renderer) => {
															$$renderer.push(`<!---->Edit goal`);
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
															$$renderer.push(`<!---->Update the title or details of your goal.`);
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
									$$renderer.push(` <form method="POST" action="?/update" class="grid gap-4"><input type="hidden" name="id"${attr("value", editId)}/> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-title",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Title`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "edit-title",
										name: "title",
										placeholder: "Goal title",
										required: true,
										get value() {
											return editTitle;
										},
										set value($$value) {
											editTitle = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-description",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Details`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Textarea($$renderer, {
										id: "edit-description",
										name: "description",
										rows: 5,
										get value() {
											return editDescription;
										},
										set value($$value) {
											editDescription = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----></div> `);
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
			if (data.goals.length === 0) {
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
										Trophy($$renderer, { class: "size-6" });
										$$renderer.push(`<!----></div> <div class="space-y-1"><p class="font-medium">No goals yet</p> <p class="text-muted-foreground text-sm">Set a goal and check it off once you've achieved it.</p></div> `);
										Button($$renderer, {
											onclick: () => dialogOpen = true,
											children: ($$renderer) => {
												Plus($$renderer, { class: "size-4" });
												$$renderer.push(`<!----> Add a goal`);
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
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<p class="text-muted-foreground mb-4 text-sm">${escape_html(achievedCount())} of ${escape_html(data.goals.length)} achieved</p> <div class="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				const each_array_1 = ensure_array_like(data.goals);
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let goal = each_array_1[$$index_1];
					if (Card) {
						$$renderer.push("<!--[-->");
						Card($$renderer, {
							class: `group flex flex-col ${goal.achieved ? "border-primary/30 bg-primary/5" : ""}`,
							children: ($$renderer) => {
								if (Card_header) {
									$$renderer.push("<!--[-->");
									Card_header($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<div class="flex items-start gap-2"><form method="POST" action="?/toggleAchieved"><input type="hidden" name="id"${attr("value", goal.id)}/> `);
											Button($$renderer, {
												type: "submit",
												variant: "ghost",
												size: "icon-sm",
												"aria-label": goal.achieved ? "Mark not achieved" : "Mark achieved",
												class: goal.achieved ? "text-primary" : "text-muted-foreground hover:text-primary",
												children: ($$renderer) => {
													if (goal.achieved) {
														$$renderer.push("<!--[0-->");
														Circle_check($$renderer, { class: "size-5" });
													} else {
														$$renderer.push("<!--[-1-->");
														Circle($$renderer, { class: "size-5" });
													}
													$$renderer.push(`<!--]-->`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></form> `);
											if (Card_title) {
												$$renderer.push("<!--[-->");
												Card_title($$renderer, {
													class: `flex-1 pt-1 text-base ${goal.achieved ? "text-muted-foreground line-through" : ""}`,
													children: ($$renderer) => {
														$$renderer.push(`<!---->${escape_html(goal.title)}`);
													},
													$$slots: { default: true }
												});
												$$renderer.push("<!--]-->");
											} else {
												$$renderer.push("<!--[!-->");
												$$renderer.push("<!--]-->");
											}
											$$renderer.push(` `);
											if (goal.achieved) {
												$$renderer.push("<!--[0-->");
												Badge($$renderer, {
													class: "shrink-0",
													children: ($$renderer) => {
														$$renderer.push(`<!---->Achieved`);
													},
													$$slots: { default: true }
												});
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div>`);
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
										class: "flex-1",
										children: ($$renderer) => {
											if (goal.description) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<p class="text-muted-foreground line-clamp-5 text-sm whitespace-pre-wrap">${escape_html(goal.description)}</p>`);
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
											$$renderer.push(`<span>`);
											if (goal.achieved && goal.achievedAt) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`Achieved ${escape_html(formatRelative(goal.achievedAt))}`);
											} else {
												$$renderer.push("<!--[-1-->");
												$$renderer.push(`Updated ${escape_html(formatRelative(goal.updatedAt))}`);
											}
											$$renderer.push(`<!--]--></span> <div class="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">`);
											Button($$renderer, {
												type: "button",
												variant: "ghost",
												size: "icon-sm",
												"aria-label": "Edit goal",
												class: "text-muted-foreground hover:text-foreground",
												onclick: () => openEdit(goal),
												children: ($$renderer) => {
													Pencil($$renderer, { class: "size-4" });
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", goal.id)}/> `);
											Button($$renderer, {
												type: "submit",
												variant: "ghost",
												size: "icon-sm",
												"aria-label": "Delete goal",
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
//# sourceMappingURL=_page.svelte.js-BRpO7R6b.js.map
