import { a1 as head, _ as ensure_array_like, a7 as attr_class, a9 as escape_html, a3 as spread_props, a0 as attr, a6 as stringify } from '../../../chunks/server.js-BeDXxHyW.js';
import { B as Button } from '../../../chunks/button.js-BKCc13Pl.js';
import { I as Input } from '../../../chunks/input.js-VxJyhIEJ.js';
import { D as Dialog, a as Dialog_trigger, b as Dialog_content, c as Dialog_header, e as Dialog_title, f as Dialog_description, d as Dialog_footer } from '../../../chunks/dialog.js-BiupuAC8.js';
import { L as Label } from '../../../chunks/label.js-C7a3GAk3.js';
import { P as Progress } from '../../../chunks/progress.js-Dt-zKABp.js';
import { S as Switch, B as Badge_dollar_sign, U as User_round } from '../../../chunks/user-round.js-Bo_RZgXR.js';
import '../../../chunks/client.js-C3bkgsj6.js';
import { F as Folder_kanban } from '../../../chunks/folder-kanban.js-fP0CGmTv.js';
import { C as Card, f as Card_content, a as Card_header, e as Card_footer, c as Card_title, b as Card_description } from '../../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../chunks/page-header.js-Bo0OtOYz.js';
import { P as Plus } from '../../../chunks/plus.js-BImBz3Qf.js';
import { N as Native_select } from '../../../chunks/native-select.js-BcwRQfN8.js';
import { T as Trash_2 } from '../../../chunks/trash-2.js-CCEbkDYU.js';
import { P as Pencil } from '../../../chunks/pencil.js-DGUBFH_b.js';
import { M as Markdown_editor } from '../../../chunks/markdown-editor.js-6-VpBlpN.js';
import '../../../chunks/shared.js-CgP5r6wP.js';
import '../../../chunks/create-id.js-BN8YEFln.js';
import '../../../chunks/palette.js-BPVUdeAc.js';
import '../../../chunks/index-server2.js-UaiofxX-.js';
import '../../../chunks/dialog-content.js-DJOVMfdX.js';
import '../../../chunks/index-server.js-YgGoPwWh.js';
import '../../../chunks/chunk.js-BBx_TEkp.js';
import '../../../chunks/noop.js-D37m5eAl.js';
import '../../../chunks/x.js-Q2Bhqwn4.js';
import '../../../chunks/hidden-input.js-BC35bBrE.js';
import '../../../chunks/exports.js-Y2Zp5fEj.js';
import '../../../chunks/internal2.js-3fvE3IOr.js';
import '../../../chunks/utils.js-UusfKV9V.js';
import '../../../chunks/textarea.js-OJ5frhCS.js';
import '../../../chunks/markdown.js-CoQQw_ZF.js';

//#region src/routes/projects/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		const PROJECT_TEMPLATES = [
			{
				key: "product",
				label: "📦 Build Product",
				name: "New Product",
				description: `Build a product that solves a meaningful problem for a specific audience.

Vision
[What are you building?]

Audience
[Who is it for?]

Core Value
[Why does it matter?]

Business Model
[How does it create value?]

Next Milestone
[What's the next major objective?]

Success
[How will you measure success?]`,
				color: "blue"
			},
			{
				key: "business",
				label: "🏢 Start Business",
				name: "New Business",
				description: `Build a business that consistently delivers value and generates sustainable revenue.

Mission
[Why does this business exist?]

Customers
[Who do you serve?]

Offerings
[Products or services]

Revenue Model
[How does it make money?]

Growth Strategy
[How will you acquire customers?]

Success
[Revenue, profit, customers]`,
				color: "emerald"
			},
			{
				key: "brand",
				label: "📣 Grow Brand",
				name: "New Brand",
				description: `Build a trusted brand through consistent publishing, valuable ideas, and community.

Mission
[What do you want to be known for?]

Audience
[Who are you building for?]

Platforms
[X, YouTube, Newsletter, etc.]

Content Themes
[Topics you'll consistently cover]

Publishing Cadence
[Daily, weekly, etc.]

Success
[Followers, engagement, opportunities]`,
				color: "amber"
			},
			{
				key: "initiative",
				label: "🎯 Launch Initiative",
				name: "New Initiative",
				description: `Coordinate multiple projects toward a long-term objective.

Objective
[Desired outcome]

Projects
[Supporting projects]

Resources
[People, capital, tools]

Milestones
[Major phases]

Success
[What does completion look like?]`,
				color: "violet"
			}
		];
		let dialogOpen = false;
		let createPaid = false;
		let createName = "";
		let createDescription = "";
		let createColor = "blue";
		let activeTemplateKey = null;
		let editOpen = false;
		let editProject = null;
		let editPaid = false;
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
		function openEdit(project) {
			editProject = project;
			editPaid = project.paid;
			editOpen = true;
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("rqn88j", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Projects · WieldOS</title>`);
				});
			});
			Page_header($$renderer, {
				title: "Projects",
				description: "Bigger efforts and the goals behind them",
				icon: Folder_kanban,
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
													$$renderer.push(`<!----> New project`);
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
										class: "max-h-[90vh] overflow-y-auto sm:max-w-2xl",
										children: ($$renderer) => {
											if (Dialog_header) {
												$$renderer.push("<!--[-->");
												Dialog_header($$renderer, {
													children: ($$renderer) => {
														if (Dialog_title) {
															$$renderer.push("<!--[-->");
															Dialog_title($$renderer, {
																children: ($$renderer) => {
																	$$renderer.push(`<!---->New project`);
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
																	$$renderer.push(`<!---->Group related tasks toward a goal.`);
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
											$$renderer.push(` <form method="POST" action="?/create" class="grid gap-4"><div class="-mt-2 flex flex-wrap items-center gap-1.5"><!--[-->`);
											const each_array = ensure_array_like(PROJECT_TEMPLATES);
											for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
												let t = each_array[$$index];
												$$renderer.push(`<button type="button"${attr_class(`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] transition-colors ${activeTemplateKey === t.key ? "bg-foreground text-background border-foreground" : "text-muted-foreground border-input hover:border-foreground/40 hover:text-foreground"}`)}>${escape_html(t.label)}</button>`);
											}
											$$renderer.push(`<!--]--></div> <div class="grid gap-2">`);
											Label($$renderer, {
												for: "name",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Name`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Input($$renderer, {
												id: "name",
												name: "name",
												placeholder: "Project name",
												required: true,
												get value() {
													return createName;
												},
												set value($$value) {
													createName = $$value;
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
													$$renderer.push(`<!---->Description`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Markdown_editor($$renderer, {
												name: "description",
												placeholder: "What's this about?",
												rows: 5,
												get value() {
													return createDescription;
												},
												set value($$value) {
													createDescription = $$value;
													$$settled = false;
												}
											});
											$$renderer.push(`<!----></div> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
											Label($$renderer, {
												for: "status",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Status`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Native_select($$renderer, {
												id: "status",
												name: "status",
												class: "w-full",
												children: ($$renderer) => {
													$$renderer.option({ value: "planning" }, ($$renderer) => {
														$$renderer.push(`Planning`);
													});
													$$renderer.push(` `);
													$$renderer.option({
														value: "active",
														selected: true
													}, ($$renderer) => {
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
												for: "color",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Color`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Native_select($$renderer, {
												id: "color",
												name: "color",
												value: createColor,
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
												for: "paid",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Paid work`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> <p class="text-muted-foreground text-xs">Freelance or consulting, not a personal project.</p></div> `);
											Switch($$renderer, {
												id: "paid",
												name: "paid",
												get checked() {
													return createPaid;
												},
												set checked($$value) {
													createPaid = $$value;
													$$settled = false;
												}
											});
											$$renderer.push(`<!----></div> `);
											if (createPaid) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<div class="mt-3 grid gap-2 border-t pt-3">`);
												Label($$renderer, {
													for: "humanId",
													children: ($$renderer) => {
														$$renderer.push(`<!---->Client / collaborator`);
													},
													$$slots: { default: true }
												});
												$$renderer.push(`<!----> `);
												Native_select($$renderer, {
													id: "humanId",
													name: "humanId",
													class: "w-full",
													children: ($$renderer) => {
														$$renderer.option({ value: "" }, ($$renderer) => {
															$$renderer.push(`No one selected`);
														});
														$$renderer.push(` <!--[-->`);
														const each_array_1 = ensure_array_like(data.humans);
														for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
															let human = each_array_1[$$index_1];
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
																$$renderer.push(`<!---->Create project`);
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
								class: "max-h-[90vh] overflow-y-auto sm:max-w-2xl",
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
									$$renderer.push(` <!---->`);
									$$renderer.push(`<form method="POST" action="?/update" class="grid gap-4"><input type="hidden" name="id"${attr("value", editProject?.id)}/> <div class="grid gap-2">`);
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
										value: editProject?.name,
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
									Markdown_editor($$renderer, {
										name: "description",
										placeholder: "What's this about?",
										rows: 5,
										value: editProject?.description ?? ""
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
										value: editProject?.status,
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
										value: editProject?.color,
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
											value: editProject?.humanId ?? "",
											class: "w-full",
											children: ($$renderer) => {
												$$renderer.option({ value: "" }, ($$renderer) => {
													$$renderer.push(`No one selected`);
												});
												$$renderer.push(` <!--[-->`);
												const each_array_2 = ensure_array_like(data.humans);
												for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
													let human = each_array_2[$$index_2];
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
			$$renderer.push(` `);
			if (data.projects.length === 0) {
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
										Folder_kanban($$renderer, { class: "size-6" });
										$$renderer.push(`<!----></div> <div class="space-y-1"><p class="font-medium">No projects yet</p> <p class="text-muted-foreground text-sm">Create a project to organize related tasks.</p></div> `);
										Button($$renderer, {
											onclick: () => dialogOpen = true,
											children: ($$renderer) => {
												Plus($$renderer, { class: "size-4" });
												$$renderer.push(`<!----> Create a project`);
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
				$$renderer.push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				const each_array_3 = ensure_array_like(data.projects);
				for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
					let project = each_array_3[$$index_3];
					if (Card) {
						$$renderer.push("<!--[-->");
						Card($$renderer, {
							class: "group",
							children: ($$renderer) => {
								if (Card_header) {
									$$renderer.push("<!--[-->");
									Card_header($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<div class="flex items-center gap-2"><span${attr_class(`size-2.5 rounded-full ${stringify(colorDot[project.color] ?? colorDot.slate)}`)}></span> `);
											if (Card_title) {
												$$renderer.push("<!--[-->");
												Card_title($$renderer, {
													class: "flex-1",
													children: ($$renderer) => {
														$$renderer.push(`<a${attr("href", `/projects/${project.id}`)} class="hover:underline">${escape_html(project.name)}</a>`);
													},
													$$slots: { default: true }
												});
												$$renderer.push("<!--]-->");
											} else {
												$$renderer.push("<!--[!-->");
												$$renderer.push("<!--]-->");
											}
											$$renderer.push(` `);
											if (project.paid) {
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
											$$renderer.push(`<!--]--> `);
											Badge($$renderer, {
												variant: statusVariant[project.status] ?? "secondary",
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(statusLabel[project.status] ?? project.status)}`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></div> `);
											if (project.description) {
												$$renderer.push("<!--[0-->");
												if (Card_description) {
													$$renderer.push("<!--[-->");
													Card_description($$renderer, {
														children: ($$renderer) => {
															$$renderer.push(`<!---->${escape_html(project.description)}`);
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
										class: "space-y-2",
										children: ($$renderer) => {
											if (project.paid && project.humanName) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<div class="text-muted-foreground flex items-center gap-1.5 text-xs">`);
												User_round($$renderer, { class: "size-3.5" });
												$$renderer.push(`<!----> <span>for <span class="text-foreground font-medium">${escape_html(project.humanName)}</span></span></div>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--> <div class="flex items-center justify-between text-xs"><span class="text-muted-foreground">${escape_html(project.doneTasks)} of ${escape_html(project.totalTasks)} tasks</span> <span class="font-medium">${escape_html(project.progress)}%</span></div> `);
											Progress($$renderer, { value: project.progress });
											$$renderer.push(`<!---->`);
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
										class: "justify-end gap-0.5",
										children: ($$renderer) => {
											Button($$renderer, {
												type: "button",
												variant: "ghost",
												size: "icon-sm",
												"aria-label": "Edit project",
												class: "text-muted-foreground hover:text-foreground opacity-0 transition group-hover:opacity-100",
												onclick: () => openEdit(project),
												children: ($$renderer) => {
													Pencil($$renderer, { class: "size-4" });
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", project.id)}/> `);
											Button($$renderer, {
												type: "submit",
												variant: "ghost",
												size: "icon-sm",
												"aria-label": "Delete project",
												class: "text-muted-foreground hover:text-destructive opacity-0 transition group-hover:opacity-100",
												children: ($$renderer) => {
													Trash_2($$renderer, { class: "size-4" });
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
//# sourceMappingURL=_page.svelte.js-LcFmZaqV.js.map
