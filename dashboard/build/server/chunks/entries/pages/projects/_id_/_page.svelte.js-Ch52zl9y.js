import { a1 as head, a9 as escape_html, T as derived, a0 as attr, _ as ensure_array_like, a7 as attr_class, a6 as stringify } from '../../../../chunks/server.js-BeDXxHyW.js';
import { B as Button } from '../../../../chunks/button.js-BKCc13Pl.js';
import { I as Input } from '../../../../chunks/input.js-VxJyhIEJ.js';
import { D as Dialog, b as Dialog_content, c as Dialog_header, e as Dialog_title, f as Dialog_description, d as Dialog_footer } from '../../../../chunks/dialog.js-BiupuAC8.js';
import { L as Label } from '../../../../chunks/label.js-C7a3GAk3.js';
import { P as Progress } from '../../../../chunks/progress.js-Dt-zKABp.js';
import { S as Switch, B as Badge_dollar_sign, U as User_round } from '../../../../chunks/user-round.js-Bo_RZgXR.js';
import '../../../../chunks/client.js-u-B9u8_c.js';
import { C as Circle_check_big } from '../../../../chunks/circle-check-big.js-Dt7uTxUS.js';
import { F as File_text } from '../../../../chunks/file-text.js-LRQpmmf4.js';
import { C as Card, a as Card_header, f as Card_content, c as Card_title } from '../../../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../../chunks/page-header.js-Bo0OtOYz.js';
import { b as formatRelative } from '../../../../chunks/datetime.js-DS-g6TQJ.js';
import { N as Native_select } from '../../../../chunks/native-select.js-BcwRQfN8.js';
import { T as Trash_2 } from '../../../../chunks/trash-2.js-CCEbkDYU.js';
import { T as Textarea } from '../../../../chunks/textarea.js-OJ5frhCS.js';
import { P as Pencil } from '../../../../chunks/pencil.js-DGUBFH_b.js';
import { M as Markdown } from '../../../../chunks/markdown.js-CoQQw_ZF.js';
import { A as Arrow_left } from '../../../../chunks/arrow-left.js-Ci-i4sMA.js';
import '../../../../chunks/shared.js-CgP5r6wP.js';
import '../../../../chunks/create-id.js-BN8YEFln.js';
import '../../../../chunks/palette.js-BPVUdeAc.js';
import '../../../../chunks/index-server2.js-UaiofxX-.js';
import '../../../../chunks/dialog-content.js-DJOVMfdX.js';
import '../../../../chunks/index-server.js-YgGoPwWh.js';
import '../../../../chunks/chunk.js-BBx_TEkp.js';
import '../../../../chunks/noop.js-D37m5eAl.js';
import '../../../../chunks/x.js-Q2Bhqwn4.js';
import '../../../../chunks/hidden-input.js-BC35bBrE.js';
import '../../../../chunks/exports.js-Y2Zp5fEj.js';
import '../../../../chunks/internal2.js-0xtVfVtb.js';
import '../../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/projects/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		const p = derived(() => data.project);
		const colorDot = {
			slate: "bg-slate-400",
			blue: "bg-blue-500",
			emerald: "bg-emerald-500",
			amber: "bg-amber-500",
			rose: "bg-rose-500",
			violet: "bg-violet-500"
		};
		const statusLabel = {
			planning: "Planning",
			active: "Active",
			on_hold: "On hold",
			done: "Done"
		};
		const statusVariant = {
			planning: "outline",
			active: "default",
			on_hold: "outline",
			done: "secondary"
		};
		const priorityVariant = {
			high: "default",
			medium: "secondary",
			low: "outline"
		};
		const deliverableStatusVariant = {
			draft: "secondary",
			final: "default",
			archived: "outline"
		};
		let editOpen = false;
		let editPaid = false;
		function openEdit() {
			editPaid = p().paid;
			editOpen = true;
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("ffmenf", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>${escape_html(p().name)} · Projects</title>`);
				});
			});
			Page_header($$renderer, {
				title: p().name,
				description: `${statusLabel[p().status] ?? p().status} · updated ${formatRelative(p().updatedAt)}`,
				children: ($$renderer) => {
					Button($$renderer, {
						size: "sm",
						variant: "outline",
						href: "/projects",
						children: ($$renderer) => {
							Arrow_left($$renderer, { class: "size-4" });
							$$renderer.push(`<!----> All projects`);
						},
						$$slots: { default: true }
					});
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
															$$renderer.push(`<!---->Edit project`);
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
															$$renderer.push(`<!---->Update the details of your project.`);
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
									$$renderer.push(` <form method="POST" action="?/update" class="grid gap-4"><input type="hidden" name="id"${attr("value", p().id)}/> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-name",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Name`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "edit-name",
										name: "name",
										value: p().name,
										placeholder: "Project name",
										required: true
									});
									$$renderer.push(`<!----></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-description",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Description`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Textarea($$renderer, {
										id: "edit-description",
										name: "description",
										value: p().description,
										placeholder: "What's this about? Markdown supported.",
										rows: 6,
										class: "font-mono text-xs"
									});
									$$renderer.push(`<!----></div> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-status",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Status`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Native_select($$renderer, {
										id: "edit-status",
										name: "status",
										value: p().status,
										class: "w-full",
										children: ($$renderer) => {
											$$renderer.option({ value: "planning" }, ($$renderer) => {
												$$renderer.push(`Planning`);
											});
											$$renderer.push(` `);
											$$renderer.option({ value: "active" }, ($$renderer) => {
												$$renderer.push(`Active`);
											});
											$$renderer.push(` `);
											$$renderer.option({ value: "on_hold" }, ($$renderer) => {
												$$renderer.push(`On hold`);
											});
											$$renderer.push(` `);
											$$renderer.option({ value: "done" }, ($$renderer) => {
												$$renderer.push(`Done`);
											});
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-color",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Color`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Native_select($$renderer, {
										id: "edit-color",
										name: "color",
										value: p().color,
										class: "w-full",
										children: ($$renderer) => {
											$$renderer.option({ value: "slate" }, ($$renderer) => {
												$$renderer.push(`Slate`);
											});
											$$renderer.push(` `);
											$$renderer.option({ value: "blue" }, ($$renderer) => {
												$$renderer.push(`Blue`);
											});
											$$renderer.push(` `);
											$$renderer.option({ value: "emerald" }, ($$renderer) => {
												$$renderer.push(`Emerald`);
											});
											$$renderer.push(` `);
											$$renderer.option({ value: "amber" }, ($$renderer) => {
												$$renderer.push(`Amber`);
											});
											$$renderer.push(` `);
											$$renderer.option({ value: "rose" }, ($$renderer) => {
												$$renderer.push(`Rose`);
											});
											$$renderer.push(` `);
											$$renderer.option({ value: "violet" }, ($$renderer) => {
												$$renderer.push(`Violet`);
											});
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div></div> <div class="rounded-lg border p-3"><div class="flex items-center justify-between"><div class="space-y-0.5">`);
									Label($$renderer, {
										for: "edit-paid",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Paid work`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> <p class="text-muted-foreground text-xs">Freelance or consulting, not a personal project.</p></div> `);
									Switch($$renderer, {
										id: "edit-paid",
										name: "paid",
										get checked() {
											return editPaid;
										},
										set checked($$value) {
											editPaid = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----></div> `);
									if (editPaid) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="mt-3 grid gap-2 border-t pt-3">`);
										Label($$renderer, {
											for: "edit-humanId",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Client / collaborator`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										Native_select($$renderer, {
											id: "edit-humanId",
											name: "humanId",
											value: p().humanId ?? "",
											class: "w-full",
											children: ($$renderer) => {
												$$renderer.option({ value: "" }, ($$renderer) => {
													$$renderer.push(`No one selected`);
												});
												$$renderer.push(` <!--[-->`);
												const each_array = ensure_array_like(data.humans);
												for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
													let human = each_array[$$index];
													$$renderer.option({ value: human.id }, ($$renderer) => {
														$$renderer.push(`${escape_html(human.username)}`);
													});
												}
												$$renderer.push(`<!--]-->`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										if (data.humans.length === 0) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<p class="text-muted-foreground text-xs">Add people on the Humans page to link them here.</p>`);
										} else $$renderer.push("<!--[-1-->");
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
			$$renderer.push(` <div class="grid gap-4 lg:grid-cols-[1fr_18rem]"><div class="flex flex-col gap-4">`);
			if (Card) {
				$$renderer.push("<!--[-->");
				Card($$renderer, {
					children: ($$renderer) => {
						if (Card_header) {
							$$renderer.push("<!--[-->");
							Card_header($$renderer, {
								children: ($$renderer) => {
									$$renderer.push(`<div class="flex flex-wrap items-center gap-1.5"><span${attr_class(`size-2.5 rounded-full ${stringify(colorDot[p().color] ?? colorDot.slate)}`)}></span> `);
									Badge($$renderer, {
										variant: statusVariant[p().status] ?? "secondary",
										children: ($$renderer) => {
											$$renderer.push(`<!---->${escape_html(statusLabel[p().status] ?? p().status)}`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									if (p().paid) {
										$$renderer.push("<!--[0-->");
										Badge($$renderer, {
											variant: "outline",
											class: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
											children: ($$renderer) => {
												Badge_dollar_sign($$renderer, { class: "size-3" });
												$$renderer.push(`<!----> Paid`);
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
								children: ($$renderer) => {
									if (p().description?.trim()) {
										$$renderer.push("<!--[0-->");
										Markdown($$renderer, { source: p().description });
									} else {
										$$renderer.push("<!--[-1-->");
										$$renderer.push(`<p class="text-muted-foreground text-sm">No description yet. Use Edit to add one (Markdown supported).</p>`);
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
											class: "text-sm",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Tasks (${escape_html(p().doneTasks)} of ${escape_html(p().totalTasks)} done)`);
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
								children: ($$renderer) => {
									if (data.tasks.length) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<ul class="divide-border divide-y"><!--[-->`);
										const each_array_1 = ensure_array_like(data.tasks);
										for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
											let task = each_array_1[$$index_1];
											const done = task.status === "done";
											$$renderer.push(`<li class="flex items-center gap-2 py-2 text-sm first:pt-0 last:pb-0">`);
											Circle_check_big($$renderer, { class: `size-4 shrink-0 ${done ? "text-emerald-500" : "text-muted-foreground/40"}` });
											$$renderer.push(`<!----> <span${attr_class(`flex-1 ${done ? "text-muted-foreground line-through" : ""}`)}>${escape_html(task.title)}</span> `);
											if (task.dueDate) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<span class="text-muted-foreground text-xs">${escape_html(task.dueDate)}</span>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--> `);
											Badge($$renderer, {
												variant: priorityVariant[task.priority] ?? "outline",
												class: "text-[10px] capitalize",
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(task.priority)}`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></li>`);
										}
										$$renderer.push(`<!--]--></ul>`);
									} else {
										$$renderer.push("<!--[-1-->");
										$$renderer.push(`<p class="text-muted-foreground text-sm">No tasks linked to this project yet.</p>`);
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
											class: "text-sm",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Deliverables`);
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
								children: ($$renderer) => {
									if (data.deliverables.length) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<ul class="divide-border divide-y"><!--[-->`);
										const each_array_2 = ensure_array_like(data.deliverables);
										for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
											let d = each_array_2[$$index_2];
											$$renderer.push(`<li class="py-2 first:pt-0 last:pb-0"><a${attr("href", `/deliverables/${d.id}`)} class="flex items-center gap-2 text-sm hover:underline">`);
											File_text($$renderer, { class: "text-muted-foreground size-4 shrink-0" });
											$$renderer.push(`<!----> <span class="flex-1 truncate">${escape_html(d.title)}</span> `);
											Badge($$renderer, {
												variant: "outline",
												class: "text-[10px] capitalize",
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(d.type)}`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Badge($$renderer, {
												variant: deliverableStatusVariant[d.status] ?? "secondary",
												class: "text-[10px] capitalize",
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(d.status)}`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></a></li>`);
										}
										$$renderer.push(`<!--]--></ul>`);
									} else {
										$$renderer.push("<!--[-1-->");
										$$renderer.push(`<p class="text-muted-foreground text-sm">No deliverables tied to this project yet.</p>`);
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
			$$renderer.push(`</div> <div class="flex flex-col gap-4">`);
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
											class: "text-sm",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Details`);
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
								class: "text-muted-foreground space-y-3 text-xs",
								children: ($$renderer) => {
									if (p().paid && p().humanName) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="flex items-center justify-between gap-2"><span>Client</span> <span class="text-foreground inline-flex items-center gap-1">`);
										User_round($$renderer, { class: "size-3" });
										$$renderer.push(`<!---->${escape_html(p().humanName)}</span></div>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> <div class="space-y-1.5"><div class="flex items-center justify-between gap-2"><span>Progress</span> <span class="text-foreground font-medium">${escape_html(p().progress)}%</span></div> `);
									Progress($$renderer, { value: p().progress });
									$$renderer.push(`<!----> <p>${escape_html(p().doneTasks)} of ${escape_html(p().totalTasks)} tasks done</p></div> <div class="border-border flex items-center justify-between gap-2 border-t pt-3"><span>Created</span><span>${escape_html(formatRelative(p().createdAt))}</span></div> <div class="flex items-center justify-between gap-2"><span>Updated</span><span>${escape_html(formatRelative(p().updatedAt))}</span></div>`);
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
						if (Card_content) {
							$$renderer.push("<!--[-->");
							Card_content($$renderer, {
								class: "flex flex-col gap-2 py-4",
								children: ($$renderer) => {
									if (form?.message) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<p class="text-destructive text-xs">${escape_html(form.message)}</p>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									Button($$renderer, {
										variant: "outline",
										size: "sm",
										onclick: openEdit,
										children: ($$renderer) => {
											Pencil($$renderer, { class: "size-4" });
											$$renderer.push(`<!----> Edit`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", p().id)}/> `);
									Button($$renderer, {
										type: "submit",
										variant: "ghost",
										size: "sm",
										class: "text-muted-foreground hover:text-destructive w-full",
										children: ($$renderer) => {
											Trash_2($$renderer, { class: "size-4" });
											$$renderer.push(`<!----> Delete`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></form>`);
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
			$$renderer.push(`</div></div>`);
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
//# sourceMappingURL=_page.svelte.js-Ch52zl9y.js.map
