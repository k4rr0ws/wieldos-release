import { a1 as head, a9 as escape_html, a0 as attr, _ as ensure_array_like, a3 as spread_props } from '../../../chunks/server.js-BeDXxHyW.js';
import { B as Button } from '../../../chunks/button.js-BKCc13Pl.js';
import { I as Input } from '../../../chunks/input.js-VxJyhIEJ.js';
import { D as Dialog, a as Dialog_trigger, b as Dialog_content, c as Dialog_header, e as Dialog_title, f as Dialog_description, d as Dialog_footer } from '../../../chunks/dialog.js-BiupuAC8.js';
import { R as Record_card } from '../../../chunks/record-card.js-4n4JZ07d.js';
import { L as Label } from '../../../chunks/label.js-C7a3GAk3.js';
import '../../../chunks/client.js-C3bkgsj6.js';
import { F as File_text } from '../../../chunks/file-text.js-LRQpmmf4.js';
import { L as List_filter } from '../../../chunks/list-filter.js-DXLJh7Ue.js';
import { C as Card, f as Card_content } from '../../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../chunks/page-header.js-Bo0OtOYz.js';
import { P as Plus } from '../../../chunks/plus.js-BImBz3Qf.js';
import { P as Play } from '../../../chunks/play.js-BmT9XzUw.js';
import { N as Native_select } from '../../../chunks/native-select.js-BcwRQfN8.js';
import { T as Trash_2 } from '../../../chunks/trash-2.js-CCEbkDYU.js';
import { T as Textarea } from '../../../chunks/textarea.js-OJ5frhCS.js';
import { P as Pencil } from '../../../chunks/pencil.js-DGUBFH_b.js';
import { P as Pin } from '../../../chunks/pin.js-MmVKgSyK.js';
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
import '../../../chunks/separator.js-DXXH6IUo.js';
import '../../../chunks/datetime.js-DS-g6TQJ.js';
import '../../../chunks/check.js-DucKGNns.js';
import '../../../chunks/exports.js-Y2Zp5fEj.js';
import '../../../chunks/internal2.js-3fvE3IOr.js';
import '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/reports/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let createOpen = false;
		let editOpen = false;
		let editReport = null;
		const filterExample = JSON.stringify({
			recordType: "tweet",
			since: "24h",
			orderBy: "metadata.likes",
			limit: 25
		}, null, 2);
		function openEdit(report) {
			editReport = report;
			editOpen = true;
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("2pp8mk", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Reports · WieldOS</title>`);
				});
			});
			Page_header($$renderer, {
				title: "Reports",
				description: "Query and filter your record corpus into reusable, named reports",
				icon: List_filter,
				children: ($$renderer) => {
					if (Dialog) {
						$$renderer.push("<!--[-->");
						Dialog($$renderer, {
							get open() {
								return createOpen;
							},
							set open($$value) {
								createOpen = $$value;
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
													$$renderer.push(`<!----> New report`);
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
										class: "sm:max-w-lg",
										children: ($$renderer) => {
											if (Dialog_header) {
												$$renderer.push("<!--[-->");
												Dialog_header($$renderer, {
													children: ($$renderer) => {
														if (Dialog_title) {
															$$renderer.push("<!--[-->");
															Dialog_title($$renderer, {
																children: ($$renderer) => {
																	$$renderer.push(`<!---->New report`);
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
																	$$renderer.push(`<!---->A saved filter that surfaces records from the corpus. Pin it to inject results into agent context.`);
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
											$$renderer.push(`<form method="POST" action="?/create" class="grid gap-4"><div class="grid gap-2">`);
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
												placeholder: "e.g. PulseChain Latest Tweets 24h",
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
													$$renderer.push(`<!---->Description <span class="text-muted-foreground">(optional)</span>`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Input($$renderer, {
												id: "description",
												name: "description",
												placeholder: "What this report surfaces"
											});
											$$renderer.push(`<!----></div> <div class="grid gap-2">`);
											Label($$renderer, {
												for: "filter",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Filter (JSON)`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Textarea($$renderer, {
												id: "filter",
												name: "filter",
												rows: 6,
												value: filterExample,
												class: "font-mono text-xs"
											});
											$$renderer.push(`<!----> <p class="text-muted-foreground text-xs">Keys: recordType, contains, since (24h/7d), instanceId, metadata.&lt;key> ({ gte/lte/eq }), orderBy, dir, limit.</p></div> <label class="flex items-center gap-2 text-sm"><input type="checkbox" name="pinned" class="size-4"/> Pin to agent context</label> `);
											if (Dialog_footer) {
												$$renderer.push("<!--[-->");
												Dialog_footer($$renderer, {
													children: ($$renderer) => {
														Button($$renderer, {
															type: "submit",
															children: ($$renderer) => {
																$$renderer.push(`<!---->Create report`);
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
								class: "sm:max-w-lg",
								children: ($$renderer) => {
									if (Dialog_header) {
										$$renderer.push("<!--[-->");
										Dialog_header($$renderer, {
											children: ($$renderer) => {
												if (Dialog_title) {
													$$renderer.push("<!--[-->");
													Dialog_title($$renderer, {
														children: ($$renderer) => {
															$$renderer.push(`<!---->Edit report`);
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
									$$renderer.push(`<form method="POST" action="?/update" class="grid gap-4"><input type="hidden" name="id"${attr("value", editReport?.id)}/> <div class="grid gap-2">`);
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
										value: editReport?.name,
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
									Input($$renderer, {
										id: "edit-description",
										name: "description",
										value: editReport?.description
									});
									$$renderer.push(`<!----></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-filter",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Filter (JSON)`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Textarea($$renderer, {
										id: "edit-filter",
										name: "filter",
										rows: 6,
										value: JSON.stringify(editReport?.filter ?? {}, null, 2),
										class: "font-mono text-xs"
									});
									$$renderer.push(`<!----></div> <label class="flex items-center gap-2 text-sm"><input type="checkbox" name="pinned" class="size-4"${attr("checked", editReport?.pinned, true)}/> Pin to agent context</label> `);
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
			if (form?.message && !createOpen && !editOpen) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-destructive mb-3 text-sm">${escape_html(form.message)}</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (form?.materialized) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-muted-foreground mb-3 text-sm">Materialized as ${escape_html(form.materialized.type)} → <a class="underline"${attr("href", `/deliverables/${form.materialized.deliverableId}`)}>deliverable #${escape_html(form.materialized.deliverableId)}</a>.</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (data.reports.length === 0) {
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
										List_filter($$renderer, { class: "size-6" });
										$$renderer.push(`<!----></div> <div class="space-y-1"><p class="font-medium">No reports yet</p> <p class="text-muted-foreground text-sm">Turn the record corpus into reusable, named reports.</p></div> `);
										Button($$renderer, {
											onclick: () => createOpen = true,
											children: ($$renderer) => {
												Plus($$renderer, { class: "size-4" });
												$$renderer.push(`<!----> Add a report`);
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
				$$renderer.push(`<div class="grid gap-3"><!--[-->`);
				const each_array = ensure_array_like(data.reports);
				for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
					let report = each_array[$$index_2];
					if (Card) {
						$$renderer.push("<!--[-->");
						Card($$renderer, {
							children: ($$renderer) => {
								if (Card_content) {
									$$renderer.push("<!--[-->");
									Card_content($$renderer, {
										class: "space-y-2 py-4",
										children: ($$renderer) => {
											$$renderer.push(`<div class="flex items-start justify-between gap-3"><div class="min-w-0 space-y-1"><div class="flex flex-wrap items-center gap-2"><p class="truncate font-medium">${escape_html(report.name)}</p> `);
											if (report.pinned) {
												$$renderer.push("<!--[0-->");
												Badge($$renderer, {
													variant: report.matchCount ? "secondary" : "outline",
													title: "Records currently matched and injected into agent context",
													children: ($$renderer) => {
														Pin($$renderer, { class: "size-3" });
														$$renderer.push(`<!----> Pinned · ${escape_html(report.matchCount ?? 0)} in context`);
													},
													$$slots: { default: true }
												});
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--> `);
											if (report.deliverableId) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<a${attr("href", `/deliverables/${report.deliverableId}`)} class="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs">`);
												File_text($$renderer, { class: "size-3" });
												$$renderer.push(`<!----> #${escape_html(report.deliverableId)}</a>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div> `);
											if (report.description) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<p class="text-muted-foreground text-sm">${escape_html(report.description)}</p>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--> <code class="text-muted-foreground block truncate font-mono text-xs">${escape_html(JSON.stringify(report.filter))}</code></div> <div class="flex shrink-0 items-center gap-0.5"><form method="POST" action="?/run"><input type="hidden" name="id"${attr("value", report.id)}/> `);
											Button($$renderer, {
												type: "submit",
												variant: "ghost",
												size: "sm",
												class: "text-muted-foreground hover:text-foreground",
												children: ($$renderer) => {
													Play($$renderer, { class: "size-4" });
													$$renderer.push(`<!----> Run`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></form> <form method="POST" action="?/pin"><input type="hidden" name="id"${attr("value", report.id)}/> <input type="hidden" name="pinned"${attr("value", (!report.pinned).toString())}/> `);
											Button($$renderer, {
												type: "submit",
												variant: "ghost",
												size: "sm",
												disabled: !report.pinned && data.pinnedCount >= data.pinLimit,
												title: !report.pinned && data.pinnedCount >= data.pinLimit ? `Only ${data.pinLimit} reports can be pinned to agent context.` : void 0,
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(report.pinned ? "Unpin" : "Pin")}`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></form> <form method="POST" action="?/materialize" class="flex items-center gap-1"><input type="hidden" name="id"${attr("value", report.id)}/> `);
											Native_select($$renderer, {
												name: "type",
												size: "sm",
												value: report.deliverableType ?? "reference",
												"aria-label": "Deliverable type",
												title: "Deliverable type",
												class: "w-28",
												children: ($$renderer) => {
													$$renderer.push(`<!--[-->`);
													const each_array_1 = ensure_array_like(data.deliverableTypes);
													for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
														let type = each_array_1[$$index];
														$$renderer.option({ value: type }, ($$renderer) => {
															$$renderer.push(`${escape_html(type)}`);
														});
													}
													$$renderer.push(`<!--]-->`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Button($$renderer, {
												type: "submit",
												variant: "ghost",
												size: "sm",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Materialize`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></form> `);
											Button($$renderer, {
												type: "button",
												variant: "ghost",
												size: "icon-sm",
												"aria-label": "Edit report",
												class: "text-muted-foreground hover:text-foreground",
												onclick: () => openEdit(report),
												children: ($$renderer) => {
													Pencil($$renderer, { class: "size-4" });
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", report.id)}/> `);
											Button($$renderer, {
												type: "submit",
												variant: "ghost",
												size: "icon-sm",
												"aria-label": "Delete report",
												class: "text-muted-foreground hover:text-destructive",
												children: ($$renderer) => {
													Trash_2($$renderer, { class: "size-4" });
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></form></div></div> `);
											if (form?.preview && form.preview.id === report.id) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<div class="space-y-2 border-t pt-3"><p class="text-muted-foreground text-xs">${escape_html(form.preview.count)} match${escape_html(form.preview.count === 1 ? "" : "es")}</p> `);
												if (form.preview.records.length) {
													$$renderer.push("<!--[0-->");
													$$renderer.push(`<div class="grid gap-2"><!--[-->`);
													const each_array_2 = ensure_array_like(form.preview.records);
													for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
														let record = each_array_2[$$index_1];
														Record_card($$renderer, { record });
													}
													$$renderer.push(`<!--]--></div>`);
												} else {
													$$renderer.push("<!--[-1-->");
													$$renderer.push(`<p class="text-muted-foreground text-xs">No records matched.</p>`);
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
//# sourceMappingURL=_page.svelte.js-C9NSdISq.js.map
