import { a1 as head, a9 as escape_html, _ as ensure_array_like, T as derived, a3 as spread_props, a0 as attr } from '../../../chunks/server.js-BeDXxHyW.js';
import { B as Button, I as Icon } from '../../../chunks/button.js-BKCc13Pl.js';
import { T as Target, C as Circle_check } from '../../../chunks/target.js-Md3BYnw-.js';
import { I as Input } from '../../../chunks/input.js-VxJyhIEJ.js';
import { D as Dialog, a as Dialog_trigger, b as Dialog_content, c as Dialog_header, e as Dialog_title, f as Dialog_description, d as Dialog_footer } from '../../../chunks/dialog.js-BiupuAC8.js';
import { L as Label } from '../../../chunks/label.js-C7a3GAk3.js';
import '../../../chunks/client.js-BHHES_V7.js';
import { C as Card, f as Card_content, a as Card_header, e as Card_footer, c as Card_title } from '../../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../chunks/page-header.js-Bo0OtOYz.js';
import { b as formatRelative } from '../../../chunks/datetime.js-DS-g6TQJ.js';
import { P as Plus } from '../../../chunks/plus.js-BImBz3Qf.js';
import { P as Pencil } from '../../../chunks/pencil.js-DGUBFH_b.js';
import { T as Trash_2 } from '../../../chunks/trash-2.js-CCEbkDYU.js';
import { T as Textarea } from '../../../chunks/textarea.js-OJ5frhCS.js';
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
import '../../../chunks/internal2.js-D42FY-0m.js';
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
											$$renderer.push(` <form method="POST" action="?/create" class="grid gap-4"><div class="grid gap-2">`);
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
												required: true
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
												rows: 5
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
				const each_array = ensure_array_like(data.goals);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let goal = each_array[$$index];
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
//# sourceMappingURL=_page.svelte.js-RxtHqrqE.js.map
