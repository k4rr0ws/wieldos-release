import { a1 as head, _ as ensure_array_like, T as derived, a3 as spread_props, a0 as attr, a9 as escape_html, a6 as stringify } from '../../../chunks/server.js-BeDXxHyW.js';
import { B as Button, I as Icon } from '../../../chunks/button.js-BKCc13Pl.js';
import { I as Input } from '../../../chunks/input.js-VxJyhIEJ.js';
import { D as Dialog, a as Dialog_trigger, b as Dialog_content, c as Dialog_header, e as Dialog_title, f as Dialog_description, d as Dialog_footer } from '../../../chunks/dialog.js-BiupuAC8.js';
import '../../../chunks/client.js-BHHES_V7.js';
import { B as Bot } from '../../../chunks/bot.js-B_UekssS.js';
import { S as Search } from '../../../chunks/search.js-gP76OJx7.js';
import { C as Card, f as Card_content, a as Card_header, e as Card_footer, c as Card_title } from '../../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../chunks/page-header.js-Bo0OtOYz.js';
import { P as Plus } from '../../../chunks/plus.js-BImBz3Qf.js';
import { N as Native_select } from '../../../chunks/native-select.js-BcwRQfN8.js';
import { P as Pencil } from '../../../chunks/pencil.js-DGUBFH_b.js';
import { T as Trash_2 } from '../../../chunks/trash-2.js-CCEbkDYU.js';
import { A as Agent_fields } from '../../../chunks/agent-fields.js-TdLtRcnF.js';
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
		let addOpen = false;
		let editOpen = false;
		let editAgent = null;
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
											$$renderer.push(` <form method="POST" action="?/create" enctype="multipart/form-data" class="grid gap-4">`);
											Agent_fields($$renderer, {
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
				const each_array = ensure_array_like(filtered());
				for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
					let agent = each_array[$$index_2];
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
												const each_array_1 = ensure_array_like(agent.skills.slice(0, 3));
												for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
													let skill = each_array_1[$$index];
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
												const each_array_2 = ensure_array_like(agent.tools);
												for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
													let tool = each_array_2[$$index_1];
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
//# sourceMappingURL=_page.svelte.js-_9dQx3it.js.map
