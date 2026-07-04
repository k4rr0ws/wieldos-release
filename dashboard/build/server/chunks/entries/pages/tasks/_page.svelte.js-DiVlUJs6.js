import { a1 as head, T as derived, a9 as escape_html, _ as ensure_array_like, a0 as attr, a3 as spread_props, a7 as attr_class, a6 as stringify } from '../../../chunks/server.js-BeDXxHyW.js';
import { B as Button, I as Icon } from '../../../chunks/button.js-BKCc13Pl.js';
import { I as Input } from '../../../chunks/input.js-VxJyhIEJ.js';
import { D as Dialog, a as Dialog_trigger, b as Dialog_content, c as Dialog_header, e as Dialog_title, f as Dialog_description, d as Dialog_footer } from '../../../chunks/dialog.js-BiupuAC8.js';
import { S as Separator } from '../../../chunks/separator.js-DXXH6IUo.js';
import { L as Label } from '../../../chunks/label.js-C7a3GAk3.js';
import '../../../chunks/client.js-u-B9u8_c.js';
import { C as Circle_check_big } from '../../../chunks/circle-check-big.js-Dt7uTxUS.js';
import { C as Card, f as Card_content, a as Card_header, c as Card_title, b as Card_description } from '../../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../chunks/page-header.js-Bo0OtOYz.js';
import { i as isOverdue, a as formatDueDate } from '../../../chunks/datetime.js-DS-g6TQJ.js';
import { P as Plus } from '../../../chunks/plus.js-BImBz3Qf.js';
import { C as Clock, F as Flame } from '../../../chunks/flame.js-DXdo46Y6.js';
import { N as Native_select } from '../../../chunks/native-select.js-BcwRQfN8.js';
import { T as Trash_2 } from '../../../chunks/trash-2.js-CCEbkDYU.js';
import { P as Pencil } from '../../../chunks/pencil.js-DGUBFH_b.js';
import { C as Check } from '../../../chunks/check.js-DucKGNns.js';
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

//#region node_modules/@lucide/svelte/dist/icons/list-plus.svelte
function List_plus($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "list-plus" },
		props,
		{ iconNode: [
			["path", { "d": "M16 5H3" }],
			["path", { "d": "M11 12H3" }],
			["path", { "d": "M16 19H3" }],
			["path", { "d": "M18 9v6" }],
			["path", { "d": "M21 12h-6" }]
		] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/repeat.svelte
function Repeat($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "repeat" },
		props,
		{ iconNode: [
			["path", { "d": "m17 2 4 4-4 4" }],
			["path", { "d": "M3 11v-1a4 4 0 0 1 4-4h14" }],
			["path", { "d": "m7 22-4-4 4-4" }],
			["path", { "d": "M21 13v1a4 4 0 0 1-4 4H3" }]
		] }
	]));
}
//#endregion
//#region src/routes/tasks/+page.svelte
function streakBadge($$renderer, task) {
	if (task.currentStreak > 0) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<span class="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-600 dark:text-orange-400"${attr("title", `${stringify(task.currentStreak)} day streak`)}>`);
		Flame($$renderer, { class: "size-3" });
		$$renderer.push(`<!----> ${escape_html(task.currentStreak)}</span>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]-->`);
}
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let dialogOpen = false;
		let editOpen = false;
		let editTask = null;
		let createRecurrence = "none";
		let editRecurrence = "none";
		let editDays = [];
		const WEEKDAYS = [
			{
				value: 1,
				label: "Mon"
			},
			{
				value: 2,
				label: "Tue"
			},
			{
				value: 3,
				label: "Wed"
			},
			{
				value: 4,
				label: "Thu"
			},
			{
				value: 5,
				label: "Fri"
			},
			{
				value: 6,
				label: "Sat"
			},
			{
				value: 0,
				label: "Sun"
			}
		];
		const priorityVariant = {
			high: "destructive",
			medium: "secondary",
			low: "outline"
		};
		const recurring = derived(() => data.tasks.filter((t) => t.isRecurring));
		const todayRecurring = derived(() => recurring().filter((t) => t.scheduledToday));
		const todayRoutineRemaining = derived(() => todayRecurring().filter((t) => !t.completedToday));
		const upcomingRecurring = derived(() => recurring().filter((t) => !t.scheduledToday));
		const openTasks = derived(() => data.tasks.filter((t) => !t.isRecurring && t.status !== "done"));
		const doneTasks = derived(() => data.tasks.filter((t) => !t.isRecurring && t.status === "done"));
		function scheduleLabel(task) {
			if (task.recurrence === "daily") return "Every day";
			if (task.recurrence === "weekdays") return "Weekdays";
			if (task.recurrence === "weekly") {
				const names = WEEKDAYS.filter((d) => task.recurrenceDays.includes(d.value)).map((d) => d.label);
				return names.length ? names.join(", ") : "Weekly";
			}
			return "";
		}
		function openEdit(task) {
			editTask = task;
			editRecurrence = task.recurrence ?? "none";
			editDays = [...task.recurrenceDays ?? []];
			editOpen = true;
		}
		function rowActions($$renderer, task) {
			$$renderer.push(`<div class="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">`);
			Button($$renderer, {
				type: "button",
				variant: "ghost",
				size: "icon-sm",
				"aria-label": "Edit task",
				class: "text-muted-foreground hover:text-foreground",
				onclick: () => openEdit(task),
				children: ($$renderer) => {
					Pencil($$renderer, { class: "size-4" });
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", task.id)}/> `);
			Button($$renderer, {
				type: "submit",
				variant: "ghost",
				size: "icon-sm",
				"aria-label": "Delete task",
				class: "text-muted-foreground hover:text-destructive",
				children: ($$renderer) => {
					Trash_2($$renderer, { class: "size-4" });
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></form></div>`);
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("1pluywh", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Tasks · WieldOS</title>`);
				});
			});
			Page_header($$renderer, {
				title: "Tasks",
				description: "Everything on your plate, in one place",
				icon: Circle_check_big,
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
													$$renderer.push(`<!----> New task`);
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
																	$$renderer.push(`<!---->New task`);
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
																	$$renderer.push(`<!---->Add a one-off task or set it to repeat.`);
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
												placeholder: "What needs doing?",
												required: true
											});
											$$renderer.push(`<!----> `);
											if (form?.message) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<p class="text-destructive text-xs">${escape_html(form.message)}</p>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
											Label($$renderer, {
												for: "priority",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Priority`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Native_select($$renderer, {
												id: "priority",
												name: "priority",
												class: "w-full",
												children: ($$renderer) => {
													$$renderer.option({ value: "low" }, ($$renderer) => {
														$$renderer.push(`Low`);
													});
													$$renderer.push(` `);
													$$renderer.option({
														value: "medium",
														selected: true
													}, ($$renderer) => {
														$$renderer.push(`Medium`);
													});
													$$renderer.push(` `);
													$$renderer.option({ value: "high" }, ($$renderer) => {
														$$renderer.push(`High`);
													});
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></div> <div class="grid gap-2">`);
											Label($$renderer, {
												for: "dueDate",
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(createRecurrence === "none" ? "Due date" : "Start date")}`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Input($$renderer, {
												id: "dueDate",
												name: "dueDate",
												type: "date"
											});
											$$renderer.push(`<!----></div></div> <div class="grid gap-2">`);
											Label($$renderer, {
												for: "projectId",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Project`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Native_select($$renderer, {
												id: "projectId",
												name: "projectId",
												class: "w-full",
												children: ($$renderer) => {
													$$renderer.option({ value: "" }, ($$renderer) => {
														$$renderer.push(`No project`);
													});
													$$renderer.push(` <!--[-->`);
													const each_array = ensure_array_like(data.projects);
													for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
														let project = each_array[$$index];
														$$renderer.option({ value: project.id }, ($$renderer) => {
															$$renderer.push(`${escape_html(project.name)}`);
														});
													}
													$$renderer.push(`<!--]-->`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></div> <div class="rounded-lg border p-3"><div class="grid gap-2">`);
											Label($$renderer, {
												for: "recurrence",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Repeats`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Native_select($$renderer, {
												id: "recurrence",
												name: "recurrence",
												class: "w-full",
												get value() {
													return createRecurrence;
												},
												set value($$value) {
													createRecurrence = $$value;
													$$settled = false;
												},
												children: ($$renderer) => {
													$$renderer.option({ value: "none" }, ($$renderer) => {
														$$renderer.push(`Doesn't repeat`);
													});
													$$renderer.push(` `);
													$$renderer.option({ value: "daily" }, ($$renderer) => {
														$$renderer.push(`Every day`);
													});
													$$renderer.push(` `);
													$$renderer.option({ value: "weekdays" }, ($$renderer) => {
														$$renderer.push(`Weekdays (Mon–Fri)`);
													});
													$$renderer.push(` `);
													$$renderer.option({ value: "weekly" }, ($$renderer) => {
														$$renderer.push(`Weekly on…`);
													});
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></div> `);
											if (createRecurrence === "weekly") {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<div class="mt-3 flex flex-wrap gap-1.5 border-t pt-3"><!--[-->`);
												const each_array_1 = ensure_array_like(WEEKDAYS);
												for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
													let day = each_array_1[$$index_1];
													$$renderer.push(`<label class="border-input has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary flex size-9 cursor-pointer items-center justify-center rounded-md border text-xs font-medium transition-colors"><input type="checkbox" name="days"${attr("value", day.value)} class="sr-only"/> ${escape_html(day.label)}</label>`);
												}
												$$renderer.push(`<!--]--></div>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div> `);
											if (Dialog_footer) {
												$$renderer.push("<!--[-->");
												Dialog_footer($$renderer, {
													children: ($$renderer) => {
														Button($$renderer, {
															type: "submit",
															children: ($$renderer) => {
																$$renderer.push(`<!---->Create task`);
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
															$$renderer.push(`<!---->Edit task`);
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
															$$renderer.push(`<!---->Update the details of your task.`);
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
									$$renderer.push(`<form method="POST" action="?/update" class="grid gap-4"><input type="hidden" name="id"${attr("value", editTask?.id)}/> <div class="grid gap-2">`);
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
										value: editTask?.title,
										placeholder: "What needs doing?",
										required: true
									});
									$$renderer.push(`<!----></div> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-priority",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Priority`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Native_select($$renderer, {
										id: "edit-priority",
										name: "priority",
										value: editTask?.priority,
										class: "w-full",
										children: ($$renderer) => {
											$$renderer.option({ value: "low" }, ($$renderer) => {
												$$renderer.push(`Low`);
											});
											$$renderer.push(` `);
											$$renderer.option({ value: "medium" }, ($$renderer) => {
												$$renderer.push(`Medium`);
											});
											$$renderer.push(` `);
											$$renderer.option({ value: "high" }, ($$renderer) => {
												$$renderer.push(`High`);
											});
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-dueDate",
										children: ($$renderer) => {
											$$renderer.push(`<!---->${escape_html(editRecurrence === "none" ? "Due date" : "Start date")}`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "edit-dueDate",
										name: "dueDate",
										type: "date",
										value: editTask?.dueDate ?? ""
									});
									$$renderer.push(`<!----></div></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-projectId",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Project`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Native_select($$renderer, {
										id: "edit-projectId",
										name: "projectId",
										value: editTask?.projectId ?? "",
										class: "w-full",
										children: ($$renderer) => {
											$$renderer.option({ value: "" }, ($$renderer) => {
												$$renderer.push(`No project`);
											});
											$$renderer.push(` <!--[-->`);
											const each_array_2 = ensure_array_like(data.projects);
											for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
												let project = each_array_2[$$index_2];
												$$renderer.option({ value: project.id }, ($$renderer) => {
													$$renderer.push(`${escape_html(project.name)}`);
												});
											}
											$$renderer.push(`<!--]-->`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div> <div class="rounded-lg border p-3"><div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-recurrence",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Repeats`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Native_select($$renderer, {
										id: "edit-recurrence",
										name: "recurrence",
										class: "w-full",
										get value() {
											return editRecurrence;
										},
										set value($$value) {
											editRecurrence = $$value;
											$$settled = false;
										},
										children: ($$renderer) => {
											$$renderer.option({ value: "none" }, ($$renderer) => {
												$$renderer.push(`Doesn't repeat`);
											});
											$$renderer.push(` `);
											$$renderer.option({ value: "daily" }, ($$renderer) => {
												$$renderer.push(`Every day`);
											});
											$$renderer.push(` `);
											$$renderer.option({ value: "weekdays" }, ($$renderer) => {
												$$renderer.push(`Weekdays (Mon–Fri)`);
											});
											$$renderer.push(` `);
											$$renderer.option({ value: "weekly" }, ($$renderer) => {
												$$renderer.push(`Weekly on…`);
											});
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div> `);
									if (editRecurrence === "weekly") {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="mt-3 flex flex-wrap gap-1.5 border-t pt-3"><!--[-->`);
										const each_array_3 = ensure_array_like(WEEKDAYS);
										for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
											let day = each_array_3[$$index_3];
											$$renderer.push(`<label class="border-input has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary flex size-9 cursor-pointer items-center justify-center rounded-md border text-xs font-medium transition-colors"><input type="checkbox" name="days"${attr("value", day.value)}${attr("checked", editDays.includes(day.value), true)} class="sr-only"/> ${escape_html(day.label)}</label>`);
										}
										$$renderer.push(`<!--]--></div>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></div> `);
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
			$$renderer.push(`  `);
			if (data.tasks.length === 0) {
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
										List_plus($$renderer, { class: "size-6" });
										$$renderer.push(`<!----></div> <div class="space-y-1"><p class="font-medium">No tasks yet</p> <p class="text-muted-foreground text-sm">Add your first task to get started.</p></div> `);
										Button($$renderer, {
											onclick: () => dialogOpen = true,
											children: ($$renderer) => {
												Plus($$renderer, { class: "size-4" });
												$$renderer.push(`<!----> Add a task`);
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
				if (todayRoutineRemaining().length > 0) {
					$$renderer.push("<!--[0-->");
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
														Repeat($$renderer, { class: "text-muted-foreground size-4" });
														$$renderer.push(`<!----> Today's routine`);
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
														$$renderer.push(`<!---->${escape_html(todayRecurring().filter((t) => t.completedToday).length)} of ${escape_html(todayRecurring().length)} done`);
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
											$$renderer.push(`<!--[-->`);
											const each_array_4 = ensure_array_like(todayRoutineRemaining());
											for (let i = 0, $$length = each_array_4.length; i < $$length; i++) {
												let task = each_array_4[i];
												if (i > 0) {
													$$renderer.push("<!--[0-->");
													Separator($$renderer, {});
												} else $$renderer.push("<!--[-1-->");
												$$renderer.push(`<!--]--> <div class="group flex items-center gap-3 py-2"><form method="POST" action="?/toggle"><input type="hidden" name="id"${attr("value", task.id)}/> <button type="submit"${attr("aria-label", task.completedToday ? "Mark not done today" : "Mark done today")}${attr_class(`flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors ${task.completedToday ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40 hover:border-primary hover:text-primary text-transparent"}`)}>`);
												Check($$renderer, { class: "size-3" });
												$$renderer.push(`<!----></button></form> <span${attr_class(`flex-1 text-sm ${task.completedToday ? "text-muted-foreground line-through" : ""}`)}>${escape_html(task.title)}</span> `);
												streakBadge($$renderer, task);
												$$renderer.push(`<!----> `);
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
												rowActions($$renderer, task);
												$$renderer.push(`<!----></div>`);
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
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (openTasks().length > 0) {
					$$renderer.push("<!--[0-->");
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
														$$renderer.push(`<!---->Open · ${escape_html(openTasks().length)}`);
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
											$$renderer.push(`<!--[-->`);
											const each_array_5 = ensure_array_like(openTasks());
											for (let i = 0, $$length = each_array_5.length; i < $$length; i++) {
												let task = each_array_5[i];
												if (i > 0) {
													$$renderer.push("<!--[0-->");
													Separator($$renderer, {});
												} else $$renderer.push("<!--[-1-->");
												$$renderer.push(`<!--]--> <div class="group flex items-center gap-3 py-2"><form method="POST" action="?/toggle"><input type="hidden" name="id"${attr("value", task.id)}/> <button type="submit" aria-label="Complete task" class="border-muted-foreground/40 hover:border-primary hover:text-primary flex size-5 shrink-0 items-center justify-center rounded-full border text-transparent transition-colors">`);
												Check($$renderer, { class: "size-3" });
												$$renderer.push(`<!----></button></form> <div class="min-w-0 flex-1"><p class="text-sm">${escape_html(task.title)}</p></div> `);
												if (task.projectName) {
													$$renderer.push("<!--[0-->");
													Badge($$renderer, {
														variant: "outline",
														class: "hidden self-start sm:inline-flex",
														children: ($$renderer) => {
															$$renderer.push(`<!---->${escape_html(task.projectName)}`);
														},
														$$slots: { default: true }
													});
												} else $$renderer.push("<!--[-1-->");
												$$renderer.push(`<!--]--> `);
												Badge($$renderer, {
													variant: priorityVariant[task.priority],
													class: "hidden self-start capitalize sm:inline-flex",
													children: ($$renderer) => {
														$$renderer.push(`<!---->${escape_html(task.priority)}`);
													},
													$$slots: { default: true }
												});
												$$renderer.push(`<!----> `);
												if (task.dueDate) {
													$$renderer.push("<!--[0-->");
													$$renderer.push(`<span${attr_class(`flex w-24 items-center justify-end gap-1 text-xs ${isOverdue(task.dueDate) ? "text-destructive" : "text-muted-foreground"}`)}>`);
													Clock($$renderer, { class: "size-3" });
													$$renderer.push(`<!----> ${escape_html(formatDueDate(task.dueDate))}</span>`);
												} else $$renderer.push("<!--[-1-->");
												$$renderer.push(`<!--]--> `);
												rowActions($$renderer, task);
												$$renderer.push(`<!----></div>`);
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
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (upcomingRecurring().length > 0) {
					$$renderer.push("<!--[0-->");
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
														Repeat($$renderer, { class: "text-muted-foreground size-4" });
														$$renderer.push(`<!----> Recurring`);
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
														$$renderer.push(`<!---->Not scheduled for today`);
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
											$$renderer.push(`<!--[-->`);
											const each_array_6 = ensure_array_like(upcomingRecurring());
											for (let i = 0, $$length = each_array_6.length; i < $$length; i++) {
												let task = each_array_6[i];
												if (i > 0) {
													$$renderer.push("<!--[0-->");
													Separator($$renderer, {});
												} else $$renderer.push("<!--[-1-->");
												$$renderer.push(`<!--]--> <div class="group flex items-center gap-3 py-2"><div class="bg-muted text-muted-foreground flex size-5 shrink-0 items-center justify-center rounded-full">`);
												Repeat($$renderer, { class: "size-3" });
												$$renderer.push(`<!----></div> <span class="flex-1 text-sm">${escape_html(task.title)}</span> `);
												streakBadge($$renderer, task);
												$$renderer.push(`<!----> `);
												Badge($$renderer, {
													variant: "secondary",
													class: "hidden sm:inline-flex",
													children: ($$renderer) => {
														$$renderer.push(`<!---->${escape_html(scheduleLabel(task))}`);
													},
													$$slots: { default: true }
												});
												$$renderer.push(`<!----> `);
												if (task.nextScheduled) {
													$$renderer.push("<!--[0-->");
													$$renderer.push(`<span class="text-muted-foreground flex w-24 items-center justify-end gap-1 text-xs">`);
													Clock($$renderer, { class: "size-3" });
													$$renderer.push(`<!----> ${escape_html(formatDueDate(task.nextScheduled))}</span>`);
												} else $$renderer.push("<!--[-1-->");
												$$renderer.push(`<!--]--> `);
												rowActions($$renderer, task);
												$$renderer.push(`<!----></div>`);
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
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (doneTasks().length > 0) {
					$$renderer.push("<!--[0-->");
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
														$$renderer.push(`<!---->Completed · ${escape_html(doneTasks().length)}`);
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
											$$renderer.push(`<!--[-->`);
											const each_array_7 = ensure_array_like(doneTasks());
											for (let i = 0, $$length = each_array_7.length; i < $$length; i++) {
												let task = each_array_7[i];
												if (i > 0) {
													$$renderer.push("<!--[0-->");
													Separator($$renderer, {});
												} else $$renderer.push("<!--[-1-->");
												$$renderer.push(`<!--]--> <div class="group flex items-center gap-3 py-2"><form method="POST" action="?/toggle"><input type="hidden" name="id"${attr("value", task.id)}/> <button type="submit" aria-label="Mark incomplete" class="bg-primary border-primary text-primary-foreground flex size-5 shrink-0 items-center justify-center rounded-full border">`);
												Check($$renderer, { class: "size-3" });
												$$renderer.push(`<!----></button></form> <div class="min-w-0 flex-1"><span class="text-muted-foreground text-sm line-through">${escape_html(task.title)}</span></div> `);
												rowActions($$renderer, task);
												$$renderer.push(`<!----></div>`);
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
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
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
//# sourceMappingURL=_page.svelte.js-DiVlUJs6.js.map
