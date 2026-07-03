import { a1 as head, _ as ensure_array_like, a9 as escape_html, a0 as attr, a7 as attr_class } from '../../../chunks/server.js-BeDXxHyW.js';
import { B as Button } from '../../../chunks/button.js-BKCc13Pl.js';
import { I as Input } from '../../../chunks/input.js-VxJyhIEJ.js';
import { D as Dialog, b as Dialog_content, c as Dialog_header, e as Dialog_title, f as Dialog_description, d as Dialog_footer } from '../../../chunks/dialog.js-BiupuAC8.js';
import { L as Label } from '../../../chunks/label.js-C7a3GAk3.js';
import '../../../chunks/client.js-BHHES_V7.js';
import { S as Sliders_horizontal } from '../../../chunks/sliders-horizontal.js-BQqfkzVX.js';
import { B as Badge } from '../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../chunks/page-header.js-Bo0OtOYz.js';
import { P as Plus } from '../../../chunks/plus.js-BImBz3Qf.js';
import { N as Native_select } from '../../../chunks/native-select.js-BcwRQfN8.js';
import { P as Pencil } from '../../../chunks/pencil.js-DGUBFH_b.js';
import { T as Trash_2 } from '../../../chunks/trash-2.js-CCEbkDYU.js';
import { T as Table, a as Table_header, c as Table_row, b as Table_body, d as Table_head, e as Table_cell } from '../../../chunks/table.js-magl9_hQ.js';
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

//#region src/routes/settings/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		const NEW_GROUP = "__new__";
		let dialogOpen = false;
		let editing = null;
		let groupChoice = "";
		let newGroupName = "";
		let revealed = {};
		function openAdd() {
			editing = null;
			groupChoice = "";
			newGroupName = "";
			dialogOpen = true;
		}
		function openEdit(setting) {
			editing = setting;
			groupChoice = setting.group;
			newGroupName = "";
			dialogOpen = true;
		}
		function groupLabel(group) {
			return group || "Ungrouped";
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("1i19ct2", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Settings · WieldOS</title>`);
				});
			});
			Page_header($$renderer, {
				title: "Settings",
				description: "Configuration & integration keys — stored in the database",
				icon: Sliders_horizontal,
				children: ($$renderer) => {
					Button($$renderer, {
						size: "sm",
						onclick: openAdd,
						children: ($$renderer) => {
							Plus($$renderer, { class: "size-4" });
							$$renderer.push(`<!----> Add setting`);
						},
						$$slots: { default: true }
					});
				}});
			$$renderer.push(`<!----> `);
			if (data.settings.length === 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-muted-foreground rounded-md border border-dashed py-16 text-center text-sm">No settings yet. Add one to get started.</div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="rounded-md border">`);
				if (Table) {
					$$renderer.push("<!--[-->");
					Table($$renderer, {
						children: ($$renderer) => {
							if (Table_header) {
								$$renderer.push("<!--[-->");
								Table_header($$renderer, {
									children: ($$renderer) => {
										if (Table_row) {
											$$renderer.push("<!--[-->");
											Table_row($$renderer, {
												children: ($$renderer) => {
													if (Table_head) {
														$$renderer.push("<!--[-->");
														Table_head($$renderer, {
															children: ($$renderer) => {
																$$renderer.push(`<!---->Key`);
															},
															$$slots: { default: true }
														});
														$$renderer.push("<!--]-->");
													} else {
														$$renderer.push("<!--[!-->");
														$$renderer.push("<!--]-->");
													}
													$$renderer.push(` `);
													if (Table_head) {
														$$renderer.push("<!--[-->");
														Table_head($$renderer, {
															children: ($$renderer) => {
																$$renderer.push(`<!---->Value`);
															},
															$$slots: { default: true }
														});
														$$renderer.push("<!--]-->");
													} else {
														$$renderer.push("<!--[!-->");
														$$renderer.push("<!--]-->");
													}
													$$renderer.push(` `);
													if (Table_head) {
														$$renderer.push("<!--[-->");
														Table_head($$renderer, {
															children: ($$renderer) => {
																$$renderer.push(`<!---->Group`);
															},
															$$slots: { default: true }
														});
														$$renderer.push("<!--]-->");
													} else {
														$$renderer.push("<!--[!-->");
														$$renderer.push("<!--]-->");
													}
													$$renderer.push(` `);
													if (Table_head) {
														$$renderer.push("<!--[-->");
														Table_head($$renderer, {
															class: "w-0 text-right",
															children: ($$renderer) => {
																$$renderer.push(`<!---->Actions`);
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
									},
									$$slots: { default: true }
								});
								$$renderer.push("<!--]-->");
							} else {
								$$renderer.push("<!--[!-->");
								$$renderer.push("<!--]-->");
							}
							$$renderer.push(` `);
							if (Table_body) {
								$$renderer.push("<!--[-->");
								Table_body($$renderer, {
									children: ($$renderer) => {
										$$renderer.push(`<!--[-->`);
										const each_array = ensure_array_like(data.settings);
										for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
											let setting = each_array[$$index];
											if (Table_row) {
												$$renderer.push("<!--[-->");
												Table_row($$renderer, {
													class: "group",
													children: ($$renderer) => {
														if (Table_cell) {
															$$renderer.push("<!--[-->");
															Table_cell($$renderer, {
																class: "font-mono text-xs font-medium",
																children: ($$renderer) => {
																	$$renderer.push(`<!---->${escape_html(setting.key)}`);
																},
																$$slots: { default: true }
															});
															$$renderer.push("<!--]-->");
														} else {
															$$renderer.push("<!--[!-->");
															$$renderer.push("<!--]-->");
														}
														$$renderer.push(` `);
														if (Table_cell) {
															$$renderer.push("<!--[-->");
															Table_cell($$renderer, {
																class: "max-w-xs",
																children: ($$renderer) => {
																	if (setting.value) {
																		$$renderer.push("<!--[0-->");
																		$$renderer.push(`<button type="button"${attr_class(`block max-w-full cursor-pointer truncate text-left font-mono text-xs transition ${revealed[setting.key] ? "" : "blur-[5px] select-none hover:blur-[4px]"}`)}${attr("title", revealed[setting.key] ? "Click to hide" : "Click to reveal")}${attr("aria-label", revealed[setting.key] ? "Hide value" : "Reveal value")}>${escape_html(setting.value)}</button>`);
																	} else {
																		$$renderer.push("<!--[-1-->");
																		$$renderer.push(`<span class="text-muted-foreground">—</span>`);
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
														$$renderer.push(` `);
														if (Table_cell) {
															$$renderer.push("<!--[-->");
															Table_cell($$renderer, {
																children: ($$renderer) => {
																	Badge($$renderer, {
																		variant: setting.group ? "secondary" : "outline",
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->${escape_html(groupLabel(setting.group))}`);
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
														$$renderer.push(` `);
														if (Table_cell) {
															$$renderer.push("<!--[-->");
															Table_cell($$renderer, {
																class: "text-right",
																children: ($$renderer) => {
																	$$renderer.push(`<div class="flex items-center justify-end gap-0.5 opacity-0 transition group-hover:opacity-100">`);
																	Button($$renderer, {
																		type: "button",
																		variant: "ghost",
																		size: "icon-sm",
																		"aria-label": "Edit setting",
																		class: "text-muted-foreground hover:text-foreground",
																		onclick: () => openEdit(setting),
																		children: ($$renderer) => {
																			Pencil($$renderer, { class: "size-4" });
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----> <form method="POST" action="?/delete"><input type="hidden" name="key"${attr("value", setting.key)}/> `);
																	Button($$renderer, {
																		type: "submit",
																		variant: "ghost",
																		size: "icon-sm",
																		"aria-label": "Delete setting",
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
				$$renderer.push(`</div>`);
			}
			$$renderer.push(`<!--]--> `);
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
															$$renderer.push(`<!---->${escape_html(editing ? "Edit setting" : "Add setting")}`);
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
															$$renderer.push(`<!---->${escape_html(editing ? "Update this setting’s value and group." : "Add a key/value setting and assign it to a group.")}`);
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
									$$renderer.push(`<form method="POST" action="?/upsert" class="grid gap-4"><div class="grid gap-2">`);
									Label($$renderer, {
										for: "key",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Key`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "key",
										name: "key",
										value: editing?.key ?? "",
										placeholder: "ANTHROPIC_API_KEY",
										readonly: !!editing,
										class: editing ? "bg-muted font-mono text-xs" : "font-mono text-xs",
										required: true
									});
									$$renderer.push(`<!----> `);
									if (form?.message) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<p class="text-destructive text-xs">${escape_html(form.message)}</p>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "value",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Value`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "value",
										name: "value",
										value: editing?.value ?? "",
										placeholder: "value"
									});
									$$renderer.push(`<!----></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "group",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Group`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Native_select($$renderer, {
										id: "group",
										name: "group",
										class: "w-full",
										get value() {
											return groupChoice;
										},
										set value($$value) {
											groupChoice = $$value;
											$$settled = false;
										},
										children: ($$renderer) => {
											$$renderer.option({ value: "" }, ($$renderer) => {
												$$renderer.push(`Ungrouped`);
											});
											$$renderer.push(` <!--[-->`);
											const each_array_1 = ensure_array_like(data.groups);
											for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
												let group = each_array_1[$$index_1];
												$$renderer.option({ value: group }, ($$renderer) => {
													$$renderer.push(`${escape_html(group)}`);
												});
											}
											$$renderer.push(`<!--]--> `);
											$$renderer.option({ value: NEW_GROUP }, ($$renderer) => {
												$$renderer.push(`+ New group…`);
											});
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									if (groupChoice === NEW_GROUP) {
										$$renderer.push("<!--[0-->");
										Input($$renderer, {
											name: "newGroup",
											placeholder: "New group name",
											get value() {
												return newGroupName;
											},
											set value($$value) {
												newGroupName = $$value;
												$$settled = false;
											}
										});
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></div> `);
									if (Dialog_footer) {
										$$renderer.push("<!--[-->");
										Dialog_footer($$renderer, {
											children: ($$renderer) => {
												Button($$renderer, {
													type: "submit",
													children: ($$renderer) => {
														$$renderer.push(`<!---->${escape_html(editing ? "Save changes" : "Add setting")}`);
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
									$$renderer.push(`<!----> `);
									if (data.groups.length) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="mt-2 border-t pt-4"><p class="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">Manage groups</p> <div class="flex flex-wrap gap-1.5"><!--[-->`);
										const each_array_2 = ensure_array_like(data.groups);
										for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
											let group = each_array_2[$$index_2];
											$$renderer.push(`<form method="POST" action="?/deleteGroup" class="contents"><input type="hidden" name="group"${attr("value", group)}/> `);
											Badge($$renderer, {
												variant: "secondary",
												class: "gap-1 pr-1",
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(group)} <button type="submit"${attr("aria-label", `Delete group ${group}`)} class="hover:text-destructive rounded-sm p-0.5">`);
													Trash_2($$renderer, { class: "size-3" });
													$$renderer.push(`<!----></button>`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></form>`);
										}
										$$renderer.push(`<!--]--></div> <p class="text-muted-foreground mt-2 text-xs">Deleting a group moves its settings to Ungrouped.</p></div>`);
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
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-CzRHeyNa.js.map
