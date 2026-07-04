import { a1 as head, _ as ensure_array_like, a9 as escape_html, T as derived, a0 as attr } from '../../../chunks/server.js-BeDXxHyW.js';
import { B as Button } from '../../../chunks/button.js-BKCc13Pl.js';
import { I as Input } from '../../../chunks/input.js-VxJyhIEJ.js';
import { D as Dialog, b as Dialog_content, c as Dialog_header, e as Dialog_title, f as Dialog_description, d as Dialog_footer } from '../../../chunks/dialog.js-BiupuAC8.js';
import { L as Label } from '../../../chunks/label.js-C7a3GAk3.js';
import '../../../chunks/client.js-u-B9u8_c.js';
import { B as Bot } from '../../../chunks/bot.js-B_UekssS.js';
import { F as File_text } from '../../../chunks/file-text.js-LRQpmmf4.js';
import { S as Search } from '../../../chunks/search.js-gP76OJx7.js';
import { C as Card, f as Card_content, a as Card_header, e as Card_footer, c as Card_title } from '../../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../chunks/page-header.js-Bo0OtOYz.js';
import { b as formatRelative } from '../../../chunks/datetime.js-DS-g6TQJ.js';
import { R as Rotate_ccw } from '../../../chunks/rotate-ccw.js-DVa2SmVN.js';
import { N as Native_select } from '../../../chunks/native-select.js-BcwRQfN8.js';
import { T as Trash_2 } from '../../../chunks/trash-2.js-CCEbkDYU.js';
import { T as Textarea } from '../../../chunks/textarea.js-OJ5frhCS.js';
import { P as Pencil } from '../../../chunks/pencil.js-DGUBFH_b.js';
import { C as Check } from '../../../chunks/check.js-DucKGNns.js';
import { A as Archive } from '../../../chunks/archive.js-kpnLl5ml.js';
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

//#region src/routes/deliverables/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let query = "";
		let statusFilter = "all";
		let typeFilter = "all";
		let editOpen = false;
		let editItem = null;
		let editTitle = "";
		let editType = "note";
		let editProject = "";
		let editBody = "";
		let editTags = "";
		const statusVariant = {
			draft: "secondary",
			final: "default",
			archived: "outline"
		};
		const filtered = derived(() => {
			const q = query.trim().toLowerCase();
			return data.deliverables.filter((d) => {
				if (statusFilter !== "all" && d.status !== statusFilter) return false;
				if (typeFilter !== "all" && d.type !== typeFilter) return false;
				if (!q) return true;
				return d.title.toLowerCase().includes(q) || d.body.toLowerCase().includes(q) || (d.tags ?? []).some((t) => t.toLowerCase().includes(q));
			});
		});
		function openEdit(item) {
			editItem = item;
			editTitle = item.title;
			editType = item.type;
			editProject = item.projectId ? String(item.projectId) : "";
			editBody = item.body;
			editTags = (item.tags ?? []).join(", ");
			editOpen = true;
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("mhryon", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Deliverables · WieldOS</title>`);
				});
			});
			Page_header($$renderer, {
				title: "Deliverables",
				description: "Artifacts your agents produced — review, refine, and publish",
				icon: File_text
			});
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
															$$renderer.push(`<!---->Edit deliverable`);
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
															$$renderer.push(`<!---->Refine the artifact before marking it final or exporting.`);
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
									$$renderer.push(` <form method="POST" action="?/update" class="grid gap-4"><input type="hidden" name="id"${attr("value", editItem?.id)}/> <div class="grid gap-2">`);
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
										required: true,
										get value() {
											return editTitle;
										},
										set value($$value) {
											editTitle = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----></div> <div class="grid grid-cols-2 gap-3"><div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-type",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Type`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Native_select($$renderer, {
										id: "edit-type",
										name: "type",
										get value() {
											return editType;
										},
										set value($$value) {
											editType = $$value;
											$$settled = false;
										},
										children: ($$renderer) => {
											$$renderer.push(`<!--[-->`);
											const each_array = ensure_array_like(data.types);
											for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
												let t = each_array[$$index];
												$$renderer.option({ value: t }, ($$renderer) => {
													$$renderer.push(`${escape_html(t)}`);
												});
											}
											$$renderer.push(`<!--]-->`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-project",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Project`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Native_select($$renderer, {
										id: "edit-project",
										name: "projectId",
										get value() {
											return editProject;
										},
										set value($$value) {
											editProject = $$value;
											$$settled = false;
										},
										children: ($$renderer) => {
											$$renderer.option({ value: "" }, ($$renderer) => {
												$$renderer.push(`None`);
											});
											$$renderer.push(` <!--[-->`);
											const each_array_1 = ensure_array_like(data.projects);
											for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
												let p = each_array_1[$$index_1];
												$$renderer.option({ value: p.id }, ($$renderer) => {
													$$renderer.push(`${escape_html(p.name)}`);
												});
											}
											$$renderer.push(`<!--]-->`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-body",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Content`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Textarea($$renderer, {
										id: "edit-body",
										name: "body",
										rows: 12,
										class: "max-h-[50vh] overflow-y-auto font-mono text-xs",
										get value() {
											return editBody;
										},
										set value($$value) {
											editBody = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-tags",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Tags`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "edit-tags",
										name: "tags",
										placeholder: "e.g. research, emit",
										get value() {
											return editTags;
										},
										set value($$value) {
											editTags = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----> <p class="text-muted-foreground text-xs">Separate with commas.</p></div> `);
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
			if (data.deliverables.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="mb-4 flex flex-col gap-3"><div class="flex flex-wrap items-center gap-3"><div class="relative min-w-[12rem] flex-1">`);
				Search($$renderer, { class: "text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" });
				$$renderer.push(`<!----> `);
				Input($$renderer, {
					placeholder: "Search deliverables...",
					class: "pl-9",
					"aria-label": "Search deliverables",
					get value() {
						return query;
					},
					set value($$value) {
						query = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----></div> <div class="flex items-center gap-1"><!--[-->`);
				const each_array_2 = ensure_array_like(["all", ...data.statuses]);
				for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
					let s = each_array_2[$$index_2];
					Button($$renderer, {
						variant: statusFilter === s ? "default" : "outline",
						size: "sm",
						class: "capitalize",
						onclick: () => statusFilter = s,
						children: ($$renderer) => {
							$$renderer.push(`<!---->${escape_html(s)}`);
						},
						$$slots: { default: true }
					});
				}
				$$renderer.push(`<!--]--></div></div> <div class="flex flex-wrap items-center gap-1"><span class="text-muted-foreground mr-1 text-xs font-medium">Type</span> <!--[-->`);
				const each_array_3 = ensure_array_like(["all", ...data.types]);
				for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
					let t = each_array_3[$$index_3];
					Button($$renderer, {
						variant: typeFilter === t ? "default" : "outline",
						size: "sm",
						class: "capitalize",
						onclick: () => typeFilter = t,
						children: ($$renderer) => {
							$$renderer.push(`<!---->${escape_html(t)}`);
						},
						$$slots: { default: true }
					});
				}
				$$renderer.push(`<!--]--></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (form?.message) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-destructive mb-3 text-sm">${escape_html(form.message)}</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (data.deliverables.length === 0) {
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
										File_text($$renderer, { class: "size-6" });
										$$renderer.push(`<!----></div> <div class="space-y-1"><p class="font-medium">No deliverables yet</p> <p class="text-muted-foreground text-sm">Agents create these during a run. Approve a run's <code class="text-xs">create_deliverable</code> action
					and it'll show up here.</p></div> `);
										Button($$renderer, {
											variant: "outline",
											href: "/agents",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Go to agents`);
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
										$$renderer.push(`<!---->No deliverables match your filters.`);
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
				const each_array_4 = ensure_array_like(filtered());
				for (let $$index_5 = 0, $$length = each_array_4.length; $$index_5 < $$length; $$index_5++) {
					let item = each_array_4[$$index_5];
					if (Card) {
						$$renderer.push("<!--[-->");
						Card($$renderer, {
							class: "group flex flex-col",
							children: ($$renderer) => {
								if (Card_header) {
									$$renderer.push("<!--[-->");
									Card_header($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<div class="mb-1 flex flex-wrap items-center gap-1.5">`);
											if (item.type !== "reference" || item.status === "archived") {
												$$renderer.push("<!--[0-->");
												Badge($$renderer, {
													variant: statusVariant[item.status],
													class: "capitalize",
													children: ($$renderer) => {
														$$renderer.push(`<!---->${escape_html(item.status)}`);
													},
													$$slots: { default: true }
												});
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--> `);
											Badge($$renderer, {
												variant: "outline",
												class: "capitalize",
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(item.type)}`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											if (item.exportedAt) {
												$$renderer.push("<!--[0-->");
												Badge($$renderer, {
													variant: "secondary",
													children: ($$renderer) => {
														$$renderer.push(`<!---->Exported`);
													},
													$$slots: { default: true }
												});
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div> `);
											if (Card_title) {
												$$renderer.push("<!--[-->");
												Card_title($$renderer, {
													class: "text-base",
													children: ($$renderer) => {
														$$renderer.push(`<a${attr("href", `/deliverables/${item.id}`)} class="hover:underline">${escape_html(item.title)}</a>`);
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
										class: "flex-1 space-y-3",
										children: ($$renderer) => {
											$$renderer.push(`<p class="text-muted-foreground line-clamp-5 text-sm whitespace-pre-wrap">${escape_html(item.body)}</p> `);
											if (item.tags.length) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<div class="flex flex-wrap gap-1.5"><!--[-->`);
												const each_array_5 = ensure_array_like(item.tags);
												for (let $$index_4 = 0, $$length = each_array_5.length; $$index_4 < $$length; $$index_4++) {
													let tag = each_array_5[$$index_4];
													Badge($$renderer, {
														variant: "secondary",
														children: ($$renderer) => {
															$$renderer.push(`<!---->${escape_html(tag)}`);
														},
														$$slots: { default: true }
													});
												}
												$$renderer.push(`<!--]--></div>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--> <div class="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">`);
											if (item.agentName) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<a${attr("href", `/agents/${item.agentId}`)} class="inline-flex items-center gap-1 hover:underline">`);
												Bot($$renderer, { class: "size-3" });
												$$renderer.push(`<!---->${escape_html(item.agentName)}</a>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--> `);
											if (item.projectName) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<span>· ${escape_html(item.projectName)}</span>`);
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
								if (Card_footer) {
									$$renderer.push("<!--[-->");
									Card_footer($$renderer, {
										class: "flex-col items-stretch gap-2",
										children: ($$renderer) => {
											$$renderer.push(`<div class="flex items-center justify-between"><span class="text-muted-foreground text-xs">Edited ${escape_html(formatRelative(item.updatedAt))}</span> <div class="flex items-center gap-0.5">`);
											if (item.type === "reference") {
												$$renderer.push("<!--[0-->");
												if (item.status === "archived") {
													$$renderer.push("<!--[0-->");
													$$renderer.push(`<form method="POST" action="?/setStatus"><input type="hidden" name="id"${attr("value", item.id)}/> <input type="hidden" name="status" value="draft"/> `);
													Button($$renderer, {
														type: "submit",
														variant: "ghost",
														size: "icon-sm",
														"aria-label": "Reactivate reference",
														children: ($$renderer) => {
															Rotate_ccw($$renderer, { class: "size-4" });
														},
														$$slots: { default: true }
													});
													$$renderer.push(`<!----></form>`);
												} else {
													$$renderer.push("<!--[-1-->");
													$$renderer.push(`<form method="POST" action="?/setStatus"><input type="hidden" name="id"${attr("value", item.id)}/> <input type="hidden" name="status" value="archived"/> `);
													Button($$renderer, {
														type: "submit",
														variant: "ghost",
														size: "icon-sm",
														"aria-label": "Archive reference",
														children: ($$renderer) => {
															Archive($$renderer, { class: "size-4" });
														},
														$$slots: { default: true }
													});
													$$renderer.push(`<!----></form>`);
												}
												$$renderer.push(`<!--]-->`);
											} else if (item.status === "draft") {
												$$renderer.push("<!--[1-->");
												$$renderer.push(`<form method="POST" action="?/setStatus"><input type="hidden" name="id"${attr("value", item.id)}/> <input type="hidden" name="status" value="final"/> `);
												Button($$renderer, {
													type: "submit",
													variant: "ghost",
													size: "sm",
													title: "Mark final",
													children: ($$renderer) => {
														Check($$renderer, { class: "size-4" });
														$$renderer.push(`<!----> Final`);
													},
													$$slots: { default: true }
												});
												$$renderer.push(`<!----></form>`);
											} else if (item.status === "final") {
												$$renderer.push("<!--[2-->");
												$$renderer.push(`<form method="POST" action="?/setStatus"><input type="hidden" name="id"${attr("value", item.id)}/> <input type="hidden" name="status" value="archived"/> `);
												Button($$renderer, {
													type: "submit",
													variant: "ghost",
													size: "icon-sm",
													"aria-label": "Archive",
													children: ($$renderer) => {
														Archive($$renderer, { class: "size-4" });
													},
													$$slots: { default: true }
												});
												$$renderer.push(`<!----></form>`);
											} else {
												$$renderer.push("<!--[-1-->");
												$$renderer.push(`<form method="POST" action="?/setStatus"><input type="hidden" name="id"${attr("value", item.id)}/> <input type="hidden" name="status" value="draft"/> `);
												Button($$renderer, {
													type: "submit",
													variant: "ghost",
													size: "icon-sm",
													"aria-label": "Restore to draft",
													children: ($$renderer) => {
														Rotate_ccw($$renderer, { class: "size-4" });
													},
													$$slots: { default: true }
												});
												$$renderer.push(`<!----></form>`);
											}
											$$renderer.push(`<!--]--> `);
											Button($$renderer, {
												type: "button",
												variant: "ghost",
												size: "icon-sm",
												"aria-label": "Edit",
												onclick: () => openEdit(item),
												children: ($$renderer) => {
													Pencil($$renderer, { class: "size-4" });
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", item.id)}/> `);
											Button($$renderer, {
												type: "submit",
												variant: "ghost",
												size: "icon-sm",
												"aria-label": "Delete",
												class: "hover:text-destructive",
												children: ($$renderer) => {
													Trash_2($$renderer, { class: "size-4" });
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></form></div></div>`);
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
//# sourceMappingURL=_page.svelte.js-Dm_Evvxr.js.map
