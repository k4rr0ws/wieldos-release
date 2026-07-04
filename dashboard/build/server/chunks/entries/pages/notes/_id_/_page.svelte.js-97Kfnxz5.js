import { a1 as head, a9 as escape_html, a0 as attr, T as derived, _ as ensure_array_like } from '../../../../chunks/server.js-BeDXxHyW.js';
import { B as Button } from '../../../../chunks/button.js-BKCc13Pl.js';
import { I as Input } from '../../../../chunks/input.js-VxJyhIEJ.js';
import { D as Dialog, b as Dialog_content, c as Dialog_header, e as Dialog_title, f as Dialog_description, d as Dialog_footer } from '../../../../chunks/dialog.js-BiupuAC8.js';
import { L as Label } from '../../../../chunks/label.js-C7a3GAk3.js';
import '../../../../chunks/client.js-C3bkgsj6.js';
import { F as Folder_kanban } from '../../../../chunks/folder-kanban.js-fP0CGmTv.js';
import { C as Card, f as Card_content, a as Card_header, c as Card_title } from '../../../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../../chunks/page-header.js-Bo0OtOYz.js';
import { b as formatRelative } from '../../../../chunks/datetime.js-DS-g6TQJ.js';
import { N as Native_select } from '../../../../chunks/native-select.js-BcwRQfN8.js';
import { T as Trash_2 } from '../../../../chunks/trash-2.js-CCEbkDYU.js';
import { P as Pencil } from '../../../../chunks/pencil.js-DGUBFH_b.js';
import { M as Markdown } from '../../../../chunks/markdown.js-CoQQw_ZF.js';
import { A as Arrow_left } from '../../../../chunks/arrow-left.js-Ci-i4sMA.js';
import { M as Markdown_editor } from '../../../../chunks/markdown-editor.js-6-VpBlpN.js';
import { P as Pin } from '../../../../chunks/pin.js-MmVKgSyK.js';
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
import '../../../../chunks/internal2.js-3fvE3IOr.js';
import '../../../../chunks/utils.js-UusfKV9V.js';
import '../../../../chunks/textarea.js-OJ5frhCS.js';

//#region src/routes/notes/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		const n = derived(() => data.note);
		let editOpen = false;
		let editTitle = "";
		let editContent = "";
		let editTags = "";
		let editProject = "";
		function openEdit() {
			editTitle = n().title;
			editContent = n().content;
			editTags = (n().tags ?? []).join(", ");
			editProject = n().projectId ? String(n().projectId) : "";
			editOpen = true;
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("7ls2f6", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>${escape_html(n().title)} · Notes</title>`);
				});
			});
			Page_header($$renderer, {
				title: n().title,
				description: `Updated ${formatRelative(n().updatedAt)}`,
				children: ($$renderer) => {
					$$renderer.push(`<form method="POST" action="?/togglePin"><input type="hidden" name="id"${attr("value", n().id)}/> `);
					Button($$renderer, {
						type: "submit",
						size: "sm",
						variant: n().pinned ? "default" : "outline",
						children: ($$renderer) => {
							Pin($$renderer, { class: `size-4 ${n().pinned ? "fill-current" : ""}` });
							$$renderer.push(`<!----> ${escape_html(n().pinned ? "Pinned" : "Pin")}`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></form> `);
					Button($$renderer, {
						size: "sm",
						variant: "outline",
						href: "/notes",
						children: ($$renderer) => {
							Arrow_left($$renderer, { class: "size-4" });
							$$renderer.push(`<!----> All notes`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
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
								class: "max-h-[90vh] overflow-y-auto sm:max-w-3xl",
								children: ($$renderer) => {
									if (Dialog_header) {
										$$renderer.push("<!--[-->");
										Dialog_header($$renderer, {
											children: ($$renderer) => {
												if (Dialog_title) {
													$$renderer.push("<!--[-->");
													Dialog_title($$renderer, {
														children: ($$renderer) => {
															$$renderer.push(`<!---->Edit note`);
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
															$$renderer.push(`<!---->Update the title or content of your note. Markdown supported.`);
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
									$$renderer.push(` <form method="POST" action="?/update" class="grid gap-4"><input type="hidden" name="id"${attr("value", n().id)}/> <div class="grid gap-2">`);
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
										placeholder: "Note title",
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
										for: "edit-content",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Content`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Markdown_editor($$renderer, {
										id: "edit-content",
										name: "content",
										rows: 18,
										class: "max-h-[55vh] overflow-y-auto font-mono text-xs",
										get value() {
											return editContent;
										},
										set value($$value) {
											editContent = $$value;
											$$settled = false;
										}
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
										class: "w-full",
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
										placeholder: "e.g. ideas, defi, roadmap",
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
			$$renderer.push(` <div class="grid gap-4 lg:grid-cols-[1fr_18rem]">`);
			if (Card) {
				$$renderer.push("<!--[-->");
				Card($$renderer, {
					children: ($$renderer) => {
						if (Card_content) {
							$$renderer.push("<!--[-->");
							Card_content($$renderer, {
								class: "pt-6",
								children: ($$renderer) => {
									if (n().content.trim()) {
										$$renderer.push("<!--[0-->");
										Markdown($$renderer, { source: n().content });
									} else {
										$$renderer.push("<!--[-1-->");
										$$renderer.push(`<p class="text-muted-foreground text-sm">This note has no content yet. Use Edit to add some (Markdown supported).</p>`);
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
									if (n().projectName) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="flex items-center justify-between gap-2"><span>Project</span> <a${attr("href", `/projects/${n().projectId}`)} class="text-foreground inline-flex items-center gap-1 hover:underline">`);
										Folder_kanban($$renderer, { class: "size-3" });
										$$renderer.push(`<!---->${escape_html(n().projectName)}</a></div>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> <div class="flex items-center justify-between gap-2"><span>Created</span><span>${escape_html(formatRelative(n().createdAt))}</span></div> <div class="flex items-center justify-between gap-2"><span>Updated</span><span>${escape_html(formatRelative(n().updatedAt))}</span></div> `);
									if (n().tags.length) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="border-border flex flex-wrap gap-1.5 border-t pt-3"><!--[-->`);
										const each_array_1 = ensure_array_like(n().tags);
										for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
											let tag = each_array_1[$$index_1];
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
									$$renderer.push(`<!----> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", n().id)}/> `);
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
//# sourceMappingURL=_page.svelte.js-97Kfnxz5.js.map
