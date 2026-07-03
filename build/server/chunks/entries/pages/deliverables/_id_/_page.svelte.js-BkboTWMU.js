import { a1 as head, a9 as escape_html, T as derived, a0 as attr, _ as ensure_array_like } from '../../../../chunks/server.js-BeDXxHyW.js';
import { B as Button } from '../../../../chunks/button.js-BKCc13Pl.js';
import { I as Input } from '../../../../chunks/input.js-VxJyhIEJ.js';
import { D as Dialog, b as Dialog_content, c as Dialog_header, e as Dialog_title, f as Dialog_description, d as Dialog_footer } from '../../../../chunks/dialog.js-BiupuAC8.js';
import { L as Label } from '../../../../chunks/label.js-C7a3GAk3.js';
import '../../../../chunks/client.js-BHHES_V7.js';
import { B as Bot } from '../../../../chunks/bot.js-B_UekssS.js';
import { C as Card, a as Card_header, f as Card_content, c as Card_title } from '../../../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../../chunks/page-header.js-Bo0OtOYz.js';
import { b as formatRelative } from '../../../../chunks/datetime.js-DS-g6TQJ.js';
import { R as Rotate_ccw } from '../../../../chunks/rotate-ccw.js-DVa2SmVN.js';
import { N as Native_select } from '../../../../chunks/native-select.js-BcwRQfN8.js';
import { P as Pencil } from '../../../../chunks/pencil.js-DGUBFH_b.js';
import { T as Trash_2 } from '../../../../chunks/trash-2.js-CCEbkDYU.js';
import { T as Textarea } from '../../../../chunks/textarea.js-OJ5frhCS.js';
import { A as Arrow_left, M as Markdown } from '../../../../chunks/arrow-left.js-ycJiM6c7.js';
import { C as Check } from '../../../../chunks/check.js-DucKGNns.js';
import { A as Archive } from '../../../../chunks/archive.js-kpnLl5ml.js';
import '../../../../chunks/shared.js-CgP5r6wP.js';
import '../../../../chunks/create-id.js-BN8YEFln.js';
import '../../../../chunks/palette.js-BPVUdeAc.js';
import '../../../../chunks/index-server2.js-UaiofxX-.js';
import '../../../../chunks/dialog-content.js-DJOVMfdX.js';
import '../../../../chunks/index-server.js-YgGoPwWh.js';
import '../../../../chunks/chunk.js-BBx_TEkp.js';
import '../../../../chunks/noop.js-D37m5eAl.js';
import '../../../../chunks/x.js-Q2Bhqwn4.js';
import '../../../../chunks/exports.js-Y2Zp5fEj.js';
import '../../../../chunks/internal2.js-D42FY-0m.js';
import '../../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/deliverables/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		const d = derived(() => data.deliverable);
		const statusVariant = {
			draft: "secondary",
			final: "default",
			archived: "outline"
		};
		let editOpen = false;
		let editTitle = "";
		let editType = "note";
		let editProject = "";
		let editBody = "";
		let editTags = "";
		function openEdit() {
			editTitle = d().title;
			editType = d().type;
			editProject = d().projectId ? String(d().projectId) : "";
			editBody = d().body;
			editTags = (d().tags ?? []).join(", ");
			editOpen = true;
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("1d3wtnj", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>${escape_html(d().title)} · Deliverables</title>`);
				});
			});
			Page_header($$renderer, {
				title: d().title,
				description: `${d().type} · updated ${formatRelative(d().updatedAt)}`,
				children: ($$renderer) => {
					Button($$renderer, {
						size: "sm",
						variant: "outline",
						href: "/deliverables",
						children: ($$renderer) => {
							Arrow_left($$renderer, { class: "size-4" });
							$$renderer.push(`<!----> All deliverables`);
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
									$$renderer.push(` <form method="POST" action="?/update" class="grid gap-4"><input type="hidden" name="id"${attr("value", d().id)}/> <div class="grid gap-2">`);
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
										rows: 14,
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
			$$renderer.push(` <div class="grid gap-4 lg:grid-cols-[1fr_18rem]">`);
			if (Card) {
				$$renderer.push("<!--[-->");
				Card($$renderer, {
					children: ($$renderer) => {
						if (Card_header) {
							$$renderer.push("<!--[-->");
							Card_header($$renderer, {
								children: ($$renderer) => {
									$$renderer.push(`<div class="flex flex-wrap items-center gap-1.5">`);
									if (d().type !== "reference" || d().status === "archived") {
										$$renderer.push("<!--[0-->");
										Badge($$renderer, {
											variant: statusVariant[d().status],
											class: "capitalize",
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(d().status)}`);
											},
											$$slots: { default: true }
										});
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									Badge($$renderer, {
										variant: "outline",
										class: "capitalize",
										children: ($$renderer) => {
											$$renderer.push(`<!---->${escape_html(d().type)}`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									if (d().exportedAt) {
										$$renderer.push("<!--[0-->");
										Badge($$renderer, {
											variant: "secondary",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Exported`);
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
									if (d().body.trim()) {
										$$renderer.push("<!--[0-->");
										Markdown($$renderer, { source: d().body });
									} else {
										$$renderer.push("<!--[-1-->");
										$$renderer.push(`<p class="text-muted-foreground text-sm">This deliverable has no content yet.</p>`);
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
			$$renderer.push(` <div class="flex flex-col gap-4">`);
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
									if (d().agentName) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="flex items-center justify-between gap-2"><span>Author</span> <a${attr("href", `/agents/${d().agentId}`)} class="text-foreground inline-flex items-center gap-1 hover:underline">`);
										Bot($$renderer, { class: "size-3" });
										$$renderer.push(`<!---->${escape_html(d().agentName)}</a></div>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									if (d().projectName) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="flex items-center justify-between gap-2"><span>Project</span><span class="text-foreground">${escape_html(d().projectName)}</span></div>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> <div class="flex items-center justify-between gap-2"><span>Created</span><span>${escape_html(formatRelative(d().createdAt))}</span></div> <div class="flex items-center justify-between gap-2"><span>Updated</span><span>${escape_html(formatRelative(d().updatedAt))}</span></div> `);
									if (data.sourceRun) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="border-border border-t pt-3"><p class="mb-1">Generated in run</p> <a${attr("href", `/agents/${data.sourceRun.agentId}`)} class="text-foreground line-clamp-2 hover:underline">${escape_html(data.sourceRun.objective || "View run")}</a></div>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									if (d().tags.length) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="flex flex-wrap gap-1.5 border-border border-t pt-3"><!--[-->`);
										const each_array_2 = ensure_array_like(d().tags);
										for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
											let tag = each_array_2[$$index_2];
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
									$$renderer.push(`<!----> `);
									if (d().type === "reference") {
										$$renderer.push("<!--[0-->");
										if (d().status === "archived") {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<form method="POST" action="?/setStatus"><input type="hidden" name="id"${attr("value", d().id)}/> <input type="hidden" name="status" value="draft"/> `);
											Button($$renderer, {
												type: "submit",
												variant: "outline",
												size: "sm",
												class: "w-full",
												children: ($$renderer) => {
													Rotate_ccw($$renderer, { class: "size-4" });
													$$renderer.push(`<!----> Reactivate`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></form>`);
										} else {
											$$renderer.push("<!--[-1-->");
											$$renderer.push(`<form method="POST" action="?/setStatus"><input type="hidden" name="id"${attr("value", d().id)}/> <input type="hidden" name="status" value="archived"/> `);
											Button($$renderer, {
												type: "submit",
												variant: "outline",
												size: "sm",
												class: "w-full",
												children: ($$renderer) => {
													Archive($$renderer, { class: "size-4" });
													$$renderer.push(`<!----> Archive`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></form>`);
										}
										$$renderer.push(`<!--]-->`);
									} else if (d().status === "draft") {
										$$renderer.push("<!--[1-->");
										$$renderer.push(`<form method="POST" action="?/setStatus"><input type="hidden" name="id"${attr("value", d().id)}/> <input type="hidden" name="status" value="final"/> `);
										Button($$renderer, {
											type: "submit",
											size: "sm",
											class: "w-full",
											children: ($$renderer) => {
												Check($$renderer, { class: "size-4" });
												$$renderer.push(`<!----> Mark final`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----></form>`);
									} else if (d().status === "final") {
										$$renderer.push("<!--[2-->");
										$$renderer.push(`<form method="POST" action="?/setStatus"><input type="hidden" name="id"${attr("value", d().id)}/> <input type="hidden" name="status" value="archived"/> `);
										Button($$renderer, {
											type: "submit",
											variant: "outline",
											size: "sm",
											class: "w-full",
											children: ($$renderer) => {
												Archive($$renderer, { class: "size-4" });
												$$renderer.push(`<!----> Archive`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----></form>`);
									} else {
										$$renderer.push("<!--[-1-->");
										$$renderer.push(`<form method="POST" action="?/setStatus"><input type="hidden" name="id"${attr("value", d().id)}/> <input type="hidden" name="status" value="draft"/> `);
										Button($$renderer, {
											type: "submit",
											variant: "outline",
											size: "sm",
											class: "w-full",
											children: ($$renderer) => {
												Rotate_ccw($$renderer, { class: "size-4" });
												$$renderer.push(`<!----> Restore to draft`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----></form>`);
									}
									$$renderer.push(`<!--]--> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", d().id)}/> `);
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
//# sourceMappingURL=_page.svelte.js-BkboTWMU.js.map
