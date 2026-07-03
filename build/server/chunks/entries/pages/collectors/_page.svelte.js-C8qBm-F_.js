import { a1 as head, a9 as escape_html, _ as ensure_array_like, a3 as spread_props, a0 as attr, T as derived, a6 as stringify } from '../../../chunks/server.js-BeDXxHyW.js';
import { B as Button } from '../../../chunks/button.js-BKCc13Pl.js';
import { T as Triangle_alert } from '../../../chunks/triangle-alert.js-D5mtn1DL.js';
import { I as Input } from '../../../chunks/input.js-VxJyhIEJ.js';
import { D as Dialog, a as Dialog_trigger, b as Dialog_content, c as Dialog_header, e as Dialog_title, f as Dialog_description, d as Dialog_footer } from '../../../chunks/dialog.js-BiupuAC8.js';
import { L as Label } from '../../../chunks/label.js-C7a3GAk3.js';
import '../../../chunks/client.js-BHHES_V7.js';
import { C as Cable } from '../../../chunks/cable.js-Wyr8vump.js';
import { C as Card, f as Card_content } from '../../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../chunks/page-header.js-Bo0OtOYz.js';
import { b as formatRelative } from '../../../chunks/datetime.js-DS-g6TQJ.js';
import { P as Plus } from '../../../chunks/plus.js-BImBz3Qf.js';
import { P as Play } from '../../../chunks/play.js-BmT9XzUw.js';
import { N as Native_select } from '../../../chunks/native-select.js-BcwRQfN8.js';
import { P as Pencil } from '../../../chunks/pencil.js-DGUBFH_b.js';
import { T as Trash_2 } from '../../../chunks/trash-2.js-CCEbkDYU.js';
import { T as Textarea } from '../../../chunks/textarea.js-OJ5frhCS.js';
import { T as Table, a as Table_header, b as Table_body, c as Table_row, d as Table_head, e as Table_cell } from '../../../chunks/table.js-magl9_hQ.js';
import { S as Settings_2 } from '../../../chunks/settings-2.js-Bnn6grMl.js';
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

//#region src/routes/collectors/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let createOpen = false;
		let settingsOpen = false;
		let settingsForm = {};
		function openSettings() {
			settingsForm = Object.fromEntries(data.settings.map((s) => [s.key, s.value]));
			settingsOpen = true;
		}
		let editOpen = false;
		let editCollector = null;
		let createType = "";
		let createInstanceId = String(data.filterInstanceId ?? data.instances[0]?.id ?? "");
		let createScheduleMode = "manual";
		let createEveryHours = 8;
		let createInput = "";
		const defByType = derived(() => new Map(data.defs.map((d) => [d.type, d])));
		const createHint = derived(() => defByType().get(createType)?.inputHint ?? "{ }");
		const instanceById = derived(() => new Map(data.instances.map((s) => [String(s.id), s])));
		const createProviderType = derived(() => instanceById().get(String(createInstanceId))?.type ?? "");
		const matchingDefs = derived(() => createProviderType() ? data.defs.filter((d) => d.provider === createProviderType()) : data.defs);
		const otherDefs = derived(() => createProviderType() ? data.defs.filter((d) => d.provider !== createProviderType()) : []);
		function openEdit(collector) {
			editCollector = collector;
			editOpen = true;
		}
		function cadenceLabel(minutes) {
			if (!minutes) return "manual";
			return minutes % 60 === 0 ? `every ${minutes / 60}h` : `every ${minutes}m`;
		}
		const editHours = (c) => c?.scheduleMinutes ? Math.max(1, Math.round(c.scheduleMinutes / 60)) : 8;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("t4vja9", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Collectors · WieldOS</title>`);
				});
			});
			Page_header($$renderer, {
				title: "Collectors",
				description: "Run an adapter on an instance — manually or on a schedule",
				icon: Cable,
				children: ($$renderer) => {
					Button($$renderer, {
						size: "sm",
						variant: "outline",
						onclick: openSettings,
						children: ($$renderer) => {
							Settings_2($$renderer, { class: "size-4" });
							$$renderer.push(`<!----> Settings`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
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
												disabled: data.instances.length === 0,
												children: ($$renderer) => {
													Plus($$renderer, { class: "size-4" });
													$$renderer.push(`<!----> New collector`);
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
																	$$renderer.push(`<!---->New collector`);
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
																	$$renderer.push(`<!---->Runs an adapter against an instance. Choose Manual to run it only on demand.`);
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
											$$renderer.push(` <form method="POST" action="?/create" class="grid gap-4"><div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
											Label($$renderer, {
												for: "instanceId",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Instance`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Native_select($$renderer, {
												id: "instanceId",
												name: "instanceId",
												class: "w-full",
												required: true,
												get value() {
													return createInstanceId;
												},
												set value($$value) {
													createInstanceId = $$value;
													$$settled = false;
												},
												children: ($$renderer) => {
													$$renderer.push(`<!--[-->`);
													const each_array = ensure_array_like(data.instances);
													for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
														let instance = each_array[$$index];
														$$renderer.option({ value: String(instance.id) }, ($$renderer) => {
															$$renderer.push(`${escape_html(instance.name)}`);
														});
													}
													$$renderer.push(`<!--]-->`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></div> <div class="grid gap-2">`);
											Label($$renderer, {
												for: "type",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Adapter`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Native_select($$renderer, {
												id: "type",
												name: "type",
												class: "w-full",
												required: true,
												get value() {
													return createType;
												},
												set value($$value) {
													createType = $$value;
													$$settled = false;
												},
												children: ($$renderer) => {
													if (otherDefs().length) {
														$$renderer.push("<!--[0-->");
														$$renderer.push(`<optgroup label="For this instance"><!--[-->`);
														const each_array_1 = ensure_array_like(matchingDefs());
														for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
															let def = each_array_1[$$index_1];
															$$renderer.option({ value: def.type }, ($$renderer) => {
																$$renderer.push(`${escape_html(def.label)}`);
															});
														}
														$$renderer.push(`<!--]--></optgroup> <optgroup label="Other adapters"><!--[-->`);
														const each_array_2 = ensure_array_like(otherDefs());
														for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
															let def = each_array_2[$$index_2];
															$$renderer.option({ value: def.type }, ($$renderer) => {
																$$renderer.push(`${escape_html(def.label)}`);
															});
														}
														$$renderer.push(`<!--]--></optgroup>`);
													} else {
														$$renderer.push("<!--[-1-->");
														$$renderer.push(`<!--[-->`);
														const each_array_3 = ensure_array_like(matchingDefs());
														for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
															let def = each_array_3[$$index_3];
															$$renderer.option({ value: def.type }, ($$renderer) => {
																$$renderer.push(`${escape_html(def.label)}`);
															});
														}
														$$renderer.push(`<!--]-->`);
													}
													$$renderer.push(`<!--]-->`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></div></div> <div class="grid gap-2">`);
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
												placeholder: "e.g. PulseChain latest tweets",
												required: true
											});
											$$renderer.push(`<!----> `);
											if (form?.message) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<p class="text-destructive text-xs">${escape_html(form.message)}</p>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div> <div class="grid gap-2">`);
											Label($$renderer, {
												for: "input",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Input (JSON)`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Textarea($$renderer, {
												id: "input",
												name: "input",
												rows: 3,
												placeholder: createHint(),
												class: "font-mono text-xs",
												get value() {
													return createInput;
												},
												set value($$value) {
													createInput = $$value;
													$$settled = false;
												}
											});
											$$renderer.push(`<!----></div> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
											Label($$renderer, {
												for: "scheduleMode",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Run`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Native_select($$renderer, {
												id: "scheduleMode",
												name: "scheduleMode",
												class: "w-full",
												get value() {
													return createScheduleMode;
												},
												set value($$value) {
													createScheduleMode = $$value;
													$$settled = false;
												},
												children: ($$renderer) => {
													$$renderer.option({ value: "manual" }, ($$renderer) => {
														$$renderer.push(`Manual only`);
													});
													$$renderer.push(` `);
													$$renderer.option({ value: "scheduled" }, ($$renderer) => {
														$$renderer.push(`On a schedule`);
													});
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></div> <div class="grid gap-2">`);
											Label($$renderer, {
												for: "everyHours",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Every (hours)`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Input($$renderer, {
												id: "everyHours",
												name: "everyHours",
												type: "number",
												min: "1",
												max: "168",
												disabled: createScheduleMode !== "scheduled",
												get value() {
													return createEveryHours;
												},
												set value($$value) {
													createEveryHours = $$value;
													$$settled = false;
												}
											});
											$$renderer.push(`<!----></div></div> <div class="grid gap-2">`);
											Label($$renderer, {
												for: "agentId",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Notify agent`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Native_select($$renderer, {
												id: "agentId",
												name: "agentId",
												class: "w-full",
												children: ($$renderer) => {
													$$renderer.option({ value: "" }, ($$renderer) => {
														$$renderer.push(`None`);
													});
													$$renderer.push(` <!--[-->`);
													const each_array_4 = ensure_array_like(data.agents);
													for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
														let agent = each_array_4[$$index_4];
														$$renderer.option({ value: agent.id }, ($$renderer) => {
															$$renderer.push(`${escape_html(agent.name)}`);
														});
													}
													$$renderer.push(`<!--]-->`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></div> `);
											if (Dialog_footer) {
												$$renderer.push("<!--[-->");
												Dialog_footer($$renderer, {
													children: ($$renderer) => {
														Button($$renderer, {
															type: "submit",
															children: ($$renderer) => {
																$$renderer.push(`<!---->Create collector`);
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
						return settingsOpen;
					},
					set open($$value) {
						settingsOpen = $$value;
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
															$$renderer.push(`<!---->Collector settings`);
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
															$$renderer.push(`<!---->Per-run limits for every collector. Changes apply from the next run.`);
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
									$$renderer.push(` <form method="POST" action="?/settings" class="grid gap-4"><!--[-->`);
									const each_array_5 = ensure_array_like(data.settings);
									for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
										let setting = each_array_5[$$index_5];
										$$renderer.push(`<div class="grid gap-2">`);
										Label($$renderer, {
											for: setting.key,
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(setting.label)}`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										Input($$renderer, {
											id: setting.key,
											name: setting.key,
											type: setting.type === "number" ? "number" : "text",
											min: setting.type === "number" ? 1 : void 0,
											required: true,
											get value() {
												return settingsForm[setting.key];
											},
											set value($$value) {
												settingsForm[setting.key] = $$value;
												$$settled = false;
											}
										});
										$$renderer.push(`<!----> `);
										if (setting.help) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<p class="text-muted-foreground text-xs">${escape_html(setting.help)}</p>`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--></div>`);
									}
									$$renderer.push(`<!--]--> `);
									if (form?.message) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<p class="text-destructive text-xs">${escape_html(form.message)}</p>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									if (Dialog_footer) {
										$$renderer.push("<!--[-->");
										Dialog_footer($$renderer, {
											children: ($$renderer) => {
												Button($$renderer, {
													type: "submit",
													children: ($$renderer) => {
														$$renderer.push(`<!---->Save settings`);
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
															$$renderer.push(`<!---->Edit collector`);
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
									$$renderer.push(`<form method="POST" action="?/update" class="grid gap-4"><input type="hidden" name="id"${attr("value", editCollector?.id)}/> <div class="grid gap-2">`);
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
										value: editCollector?.name,
										required: true
									});
									$$renderer.push(`<!----></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-input",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Input (JSON)`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Textarea($$renderer, {
										id: "edit-input",
										name: "input",
										rows: 3,
										value: JSON.stringify(editCollector?.input ?? {}, null, 2),
										class: "font-mono text-xs"
									});
									$$renderer.push(`<!----></div> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-mode",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Run`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Native_select($$renderer, {
										id: "edit-mode",
										name: "scheduleMode",
										value: editCollector?.scheduleMinutes ? "scheduled" : "manual",
										class: "w-full",
										children: ($$renderer) => {
											$$renderer.option({ value: "manual" }, ($$renderer) => {
												$$renderer.push(`Manual only`);
											});
											$$renderer.push(` `);
											$$renderer.option({ value: "scheduled" }, ($$renderer) => {
												$$renderer.push(`On a schedule`);
											});
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-hours",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Every (hours)`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "edit-hours",
										name: "everyHours",
										type: "number",
										min: "1",
										max: "168",
										value: editHours(editCollector)
									});
									$$renderer.push(`<!----></div></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-agent",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Notify agent`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Native_select($$renderer, {
										id: "edit-agent",
										name: "agentId",
										value: editCollector?.agentId ?? "",
										class: "w-full",
										children: ($$renderer) => {
											$$renderer.option({ value: "" }, ($$renderer) => {
												$$renderer.push(`None`);
											});
											$$renderer.push(` <!--[-->`);
											const each_array_6 = ensure_array_like(data.agents);
											for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
												let agent = each_array_6[$$index_6];
												$$renderer.option({ value: agent.id }, ($$renderer) => {
													$$renderer.push(`${escape_html(agent.name)}`);
												});
											}
											$$renderer.push(`<!--]-->`);
										},
										$$slots: { default: true }
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
			if (form?.ran) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-muted-foreground mb-3 text-sm">Run complete — ${escape_html(form.ran.persisted)} record${escape_html(form.ran.persisted === 1 ? "" : "s")} captured.</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (data.collectors.length === 0) {
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
										Cable($$renderer, { class: "size-6" });
										$$renderer.push(`<!----></div> <div class="space-y-1"><p class="font-medium">No collectors yet</p> <p class="text-muted-foreground text-sm">${escape_html(data.instances.length === 0 ? "Create an instance first, then add a collector." : "Add a collector to start producing records.")}</p></div> `);
										if (data.instances.length > 0) {
											$$renderer.push("<!--[0-->");
											Button($$renderer, {
												onclick: () => createOpen = true,
												children: ($$renderer) => {
													Plus($$renderer, { class: "size-4" });
													$$renderer.push(`<!----> Add a collector`);
												},
												$$slots: { default: true }
											});
										} else {
											$$renderer.push("<!--[-1-->");
											Button($$renderer, {
												href: "/instances",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Go to instances`);
												},
												$$slots: { default: true }
											});
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
																$$renderer.push(`<!---->Name`);
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
																$$renderer.push(`<!---->Type`);
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
																$$renderer.push(`<!---->Instance`);
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
																$$renderer.push(`<!---->Schedule`);
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
															class: "text-right",
															children: ($$renderer) => {
																$$renderer.push(`<!---->Records`);
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
																$$renderer.push(`<!---->Last run`);
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
																$$renderer.push(`<!---->Status`);
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
										const each_array_7 = ensure_array_like(data.collectors);
										for (let $$index_7 = 0, $$length = each_array_7.length; $$index_7 < $$length; $$index_7++) {
											let collector = each_array_7[$$index_7];
											if (Table_row) {
												$$renderer.push("<!--[-->");
												Table_row($$renderer, {
													class: "group",
													children: ($$renderer) => {
														if (Table_cell) {
															$$renderer.push("<!--[-->");
															Table_cell($$renderer, {
																children: ($$renderer) => {
																	$$renderer.push(`<div class="flex flex-col gap-1"><span class="font-medium">${escape_html(collector.name)}</span> `);
																	if (collector.lastError) {
																		$$renderer.push("<!--[0-->");
																		$$renderer.push(`<span class="text-destructive flex items-center gap-1 text-xs">`);
																		Triangle_alert($$renderer, { class: "size-3" });
																		$$renderer.push(`<!----> ${escape_html(collector.lastError)}</span>`);
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
														if (Table_cell) {
															$$renderer.push("<!--[-->");
															Table_cell($$renderer, {
																children: ($$renderer) => {
																	Badge($$renderer, {
																		variant: "outline",
																		class: "font-mono text-xs",
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->${escape_html(collector.type)}`);
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
																class: "text-muted-foreground text-sm",
																children: ($$renderer) => {
																	$$renderer.push(`<!---->${escape_html(collector.instanceName)}`);
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
																class: "text-muted-foreground text-sm",
																children: ($$renderer) => {
																	$$renderer.push(`<!---->${escape_html(cadenceLabel(collector.scheduleMinutes))}`);
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
																class: "text-right text-sm",
																children: ($$renderer) => {
																	$$renderer.push(`<a${attr("href", `/records?collector=${stringify(collector.id)}`)} class="text-muted-foreground hover:text-foreground">${escape_html(collector.recordCount)}</a>`);
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
																class: "text-muted-foreground text-sm",
																children: ($$renderer) => {
																	$$renderer.push(`<!---->${escape_html(collector.lastRunAt ? formatRelative(collector.lastRunAt) : "never")}`);
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
																	$$renderer.push(`<div class="flex items-center gap-1">`);
																	Badge($$renderer, {
																		variant: collector.enabled ? "secondary" : "outline",
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->${escape_html(collector.enabled ? "Enabled" : "Paused")}`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----> `);
																	if (collector.status === "error") {
																		$$renderer.push("<!--[0-->");
																		Badge($$renderer, {
																			variant: "destructive",
																			children: ($$renderer) => {
																				$$renderer.push(`<!---->Error`);
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
														if (Table_cell) {
															$$renderer.push("<!--[-->");
															Table_cell($$renderer, {
																class: "text-right",
																children: ($$renderer) => {
																	$$renderer.push(`<div class="flex items-center justify-end gap-0.5"><form method="POST" action="?/run"><input type="hidden" name="id"${attr("value", collector.id)}/> `);
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
																	$$renderer.push(`<!----></form> <form method="POST" action="?/toggle"><input type="hidden" name="id"${attr("value", collector.id)}/> <input type="hidden" name="enabled"${attr("value", (!collector.enabled).toString())}/> `);
																	Button($$renderer, {
																		type: "submit",
																		variant: "ghost",
																		size: "sm",
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->${escape_html(collector.enabled ? "Pause" : "Resume")}`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----></form> `);
																	Button($$renderer, {
																		type: "button",
																		variant: "ghost",
																		size: "icon-sm",
																		"aria-label": "Edit collector",
																		class: "text-muted-foreground hover:text-foreground",
																		onclick: () => openEdit(collector),
																		children: ($$renderer) => {
																			Pencil($$renderer, { class: "size-4" });
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", collector.id)}/> `);
																	Button($$renderer, {
																		type: "submit",
																		variant: "ghost",
																		size: "icon-sm",
																		"aria-label": "Delete collector",
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
//# sourceMappingURL=_page.svelte.js-C8qBm-F_.js.map
