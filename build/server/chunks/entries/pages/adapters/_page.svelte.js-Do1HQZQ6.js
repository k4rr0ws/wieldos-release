import { a1 as head, _ as ensure_array_like, a9 as escape_html, T as derived, a0 as attr, a3 as spread_props } from '../../../chunks/server.js-BeDXxHyW.js';
import { B as Button, I as Icon } from '../../../chunks/button.js-BKCc13Pl.js';
import { I as Input } from '../../../chunks/input.js-VxJyhIEJ.js';
import { D as Dialog, a as Dialog_trigger, b as Dialog_content, c as Dialog_header, d as Dialog_footer, e as Dialog_title, f as Dialog_description } from '../../../chunks/dialog.js-BiupuAC8.js';
import { L as Label } from '../../../chunks/label.js-C7a3GAk3.js';
import '../../../chunks/client.js-BHHES_V7.js';
import { B as Blocks } from '../../../chunks/blocks.js-ojZmXUy4.js';
import { C as Card, f as Card_content } from '../../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../chunks/page-header.js-Bo0OtOYz.js';
import { P as Plus } from '../../../chunks/plus.js-BImBz3Qf.js';
import { N as Native_select } from '../../../chunks/native-select.js-BcwRQfN8.js';
import { C as Code_textarea } from '../../../chunks/code-textarea.js-DhEr-sf_.js';
import { P as Pencil } from '../../../chunks/pencil.js-DGUBFH_b.js';
import { T as Trash_2 } from '../../../chunks/trash-2.js-CCEbkDYU.js';
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
import '../../../index.js-CE_SAs7G.js';
import '../../../chunks/internal.js-BlXt2rfE.js';
import '../../../chunks/shared-server.js-9-2j12mp.js';
import '../../../chunks/app.js-DT8253QF.js';

//#region src/lib/adapter-templates.js
var ADAPTER_SCRIPT_TEMPLATES = [{
	id: "client_watermark",
	label: "Provider client + newest-id watermark",
	script: [
		"// Fetch a page from a provider client and emit only items newer than the",
		"// cursor. The shape declares which item fields are kept as metadata.",
		"const { input, credentials, clients, ingest } = ctx;",
		"const query = String(input.query ?? '').trim();",
		"if (!query) throw new Error('This adapter requires input.query');",
		"return ingest({",
		"	mode: 'newest-id',",
		"	fetchPage: () => clients.twitterapi.twitterSearch({ query, apiKey: credentials.apiKey }),",
		"	items: (r) => r.tweets,",
		"	shape: { type: 'tweet', id: 'id', capturedAt: 'createdAt', fields: ['url', 'text', 'author', 'createdAt', 'likes'] }",
		"});"
	].join("\n")
}, {
	id: "http_snapshot",
	label: "Ad-hoc HTTP API (snapshot)",
	script: [
		"// Call any public JSON API with ctx.http and emit every item on each run",
		"// (upsert dedupes by id). Good for lists that are re-fetched fresh.",
		"const { input, http, save } = ctx;",
		"const url = String(input.url ?? '').trim();",
		"if (!url) throw new Error('This adapter requires input.url');",
		"const json = await http(url);",
		"const items = Array.isArray(json) ? json : (json.items ?? []);",
		"const shape = { type: 'item', id: 'id', fields: ['name', 'value'] };",
		"for (const item of items) if (save(item, shape) === false) break;",
		"return {};"
	].join("\n")
}];
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/arrow-right.svelte
function Arrow_right($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "arrow-right" },
		props,
		{ iconNode: [["path", { "d": "M5 12h14" }], ["path", { "d": "m12 5 7 7-7 7" }]] }
	]));
}
//#endregion
//#region src/routes/adapters/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let createOpen = false;
		let editOpen = false;
		let editAdapter = null;
		const emptyForm = () => ({
			type: "",
			label: "",
			provider: "",
			description: "",
			inputHint: "",
			defaultRecordType: "",
			script: "",
			template: ""
		});
		let createForm = emptyForm();
		let editForm = emptyForm();
		function openEdit(adapter) {
			editAdapter = adapter;
			editForm = {
				type: adapter.type ?? "",
				label: adapter.label ?? "",
				provider: adapter.provider ?? "",
				description: adapter.description ?? "",
				inputHint: adapter.inputHint ?? "",
				defaultRecordType: adapter.defaultRecordType ?? "",
				script: adapter.script ?? "",
				template: ""
			};
			editOpen = true;
		}
		function applyTemplate(f, id) {
			const template = ADAPTER_SCRIPT_TEMPLATES.find((t) => t.id === id);
			f.template = "";
			if (template) f.script = template.script;
		}
		const grouped = derived(() => Object.entries(data.adapters.reduce((acc, adapter) => {
			const key = adapter.provider || "other";
			(acc[key] ??= []).push(adapter);
			return acc;
		}, {})));
		function adapterFields($$renderer, f) {
			$$renderer.push(`<div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
			Label($$renderer, {
				for: "type",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Type`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "type",
				name: "type",
				placeholder: "e.g. xapi_search",
				class: "font-mono text-xs",
				required: true,
				get value() {
					return f.type;
				},
				set value($$value) {
					f.type = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div> <div class="grid gap-2">`);
			Label($$renderer, {
				for: "label",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Label`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "label",
				name: "label",
				placeholder: "e.g. X API search",
				required: true,
				get value() {
					return f.label;
				},
				set value($$value) {
					f.label = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div></div> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
			Label($$renderer, {
				for: "provider",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Provider tag`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "provider",
				name: "provider",
				placeholder: "e.g. xapi, telegram",
				class: "font-mono text-xs",
				get value() {
					return f.provider;
				},
				set value($$value) {
					f.provider = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div> <div class="grid gap-2">`);
			Label($$renderer, {
				for: "defaultRecordType",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Default record type`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "defaultRecordType",
				name: "defaultRecordType",
				placeholder: "e.g. tweet",
				class: "font-mono text-xs",
				get value() {
					return f.defaultRecordType;
				},
				set value($$value) {
					f.defaultRecordType = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div></div> <div class="grid gap-2">`);
			Label($$renderer, {
				for: "description",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Description (optional)`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "description",
				name: "description",
				placeholder: "What this adapter collects",
				get value() {
					return f.description;
				},
				set value($$value) {
					f.description = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div> <div class="grid gap-2">`);
			Label($$renderer, {
				for: "inputHint",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Input hint (optional)`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "inputHint",
				name: "inputHint",
				placeholder: "{ \"query\": \"PulseChain\" }",
				class: "font-mono text-xs",
				get value() {
					return f.inputHint;
				},
				set value($$value) {
					f.inputHint = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div> <div class="grid gap-2"><div class="flex items-center justify-between">`);
			Label($$renderer, {
				for: "script",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Script`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Native_select($$renderer, {
				"aria-label": "Insert a script template",
				size: "sm",
				class: "w-auto",
				onchange: () => applyTemplate(f, f.template),
				get value() {
					return f.template;
				},
				set value($$value) {
					f.template = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					$$renderer.option({
						value: "",
						disabled: true
					}, ($$renderer) => {
						$$renderer.push(`Insert template…`);
					});
					$$renderer.push(` <!--[-->`);
					const each_array = ensure_array_like(ADAPTER_SCRIPT_TEMPLATES);
					for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
						let template = each_array[$$index];
						$$renderer.option({ value: template.id }, ($$renderer) => {
							$$renderer.push(`${escape_html(template.label)}`);
						});
					}
					$$renderer.push(`<!--]-->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> `);
			Code_textarea($$renderer, {
				id: "script",
				name: "script",
				rows: 12,
				required: true,
				get value() {
					return f.script;
				},
				set value($$value) {
					f.script = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> <p class="text-muted-foreground text-xs">ctx.input · ctx.cursor · ctx.config · ctx.credentials · ctx.clients.&lt;provider> ·
			ctx.http(url) · ctx.save(item, shape) · ctx.ingest({…}) ·
			return { cursor } to advance the watermark</p></div> `);
			if (form?.message) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-destructive text-xs">${escape_html(form.message)}</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("bpimpx", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Adapters · WieldOS</title>`);
				});
			});
			Page_header($$renderer, {
				title: "Adapters",
				description: "Collection scripts — editable in the browser, run by collectors",
				icon: Blocks,
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
													$$renderer.push(`<!----> New adapter`);
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
										class: "sm:max-w-2xl",
										children: ($$renderer) => {
											if (Dialog_header) {
												$$renderer.push("<!--[-->");
												Dialog_header($$renderer, {
													children: ($$renderer) => {
														if (Dialog_title) {
															$$renderer.push("<!--[-->");
															Dialog_title($$renderer, {
																children: ($$renderer) => {
																	$$renderer.push(`<!---->New adapter`);
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
																	$$renderer.push(`<!---->A script that calls a provider client and emits records. Collectors run it against an instance.`);
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
											$$renderer.push(` <form method="POST" action="?/create" class="grid gap-4">`);
											adapterFields($$renderer, createForm);
											$$renderer.push(`<!----> `);
											if (Dialog_footer) {
												$$renderer.push("<!--[-->");
												Dialog_footer($$renderer, {
													children: ($$renderer) => {
														Button($$renderer, {
															type: "submit",
															children: ($$renderer) => {
																$$renderer.push(`<!---->Create adapter`);
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
								class: "sm:max-w-2xl",
								children: ($$renderer) => {
									if (Dialog_header) {
										$$renderer.push("<!--[-->");
										Dialog_header($$renderer, {
											children: ($$renderer) => {
												if (Dialog_title) {
													$$renderer.push("<!--[-->");
													Dialog_title($$renderer, {
														children: ($$renderer) => {
															$$renderer.push(`<!---->Edit adapter`);
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
									$$renderer.push(`<form method="POST" action="?/update" class="grid gap-4"><input type="hidden" name="id"${attr("value", editAdapter?.id)}/> `);
									adapterFields($$renderer, editForm);
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
			$$renderer.push(` <p class="text-muted-foreground mb-4 max-w-2xl text-sm">Adapters are scripts stored in the database — create or edit them right here. To run one against an
	instance — manually or on a schedule — create a <a href="/collectors" class="text-foreground underline-offset-4 hover:underline">collector</a>.</p> `);
			if (data.adapters.length === 0) {
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
										Blocks($$renderer, { class: "size-6" });
										$$renderer.push(`<!----></div> <div class="space-y-1"><p class="font-medium">No adapters yet</p> <p class="text-muted-foreground text-sm">Write a script that calls a provider client and emits records.</p></div> `);
										Button($$renderer, {
											onclick: () => createOpen = true,
											children: ($$renderer) => {
												Plus($$renderer, { class: "size-4" });
												$$renderer.push(`<!----> Add an adapter`);
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
				$$renderer.push(`<!--[-->`);
				const each_array_1 = ensure_array_like(grouped());
				for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
					let [provider, adapters] = each_array_1[$$index_2];
					$$renderer.push(`<h2 class="text-muted-foreground mt-4 mb-2 font-mono text-xs tracking-wide uppercase first:mt-0">${escape_html(provider)}</h2> <div class="grid gap-3 sm:grid-cols-2"><!--[-->`);
					const each_array_2 = ensure_array_like(adapters);
					for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
						let adapter = each_array_2[$$index_1];
						if (Card) {
							$$renderer.push("<!--[-->");
							Card($$renderer, {
								children: ($$renderer) => {
									if (Card_content) {
										$$renderer.push("<!--[-->");
										Card_content($$renderer, {
											class: "space-y-2.5 py-4",
											children: ($$renderer) => {
												$$renderer.push(`<div class="flex items-start justify-between gap-2"><div class="flex min-w-0 flex-wrap items-center gap-2"><p class="font-medium">${escape_html(adapter.label)}</p> `);
												Badge($$renderer, {
													variant: "outline",
													class: "font-mono text-xs",
													children: ($$renderer) => {
														$$renderer.push(`<!---->${escape_html(adapter.type)}`);
													},
													$$slots: { default: true }
												});
												$$renderer.push(`<!----></div> <div class="flex shrink-0 items-center gap-0.5">`);
												Button($$renderer, {
													type: "button",
													variant: "ghost",
													size: "icon-sm",
													"aria-label": "Edit adapter",
													class: "text-muted-foreground hover:text-foreground",
													onclick: () => openEdit(adapter),
													children: ($$renderer) => {
														Pencil($$renderer, { class: "size-4" });
													},
													$$slots: { default: true }
												});
												$$renderer.push(`<!----> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", adapter.id)}/> `);
												Button($$renderer, {
													type: "submit",
													variant: "ghost",
													size: "icon-sm",
													"aria-label": "Delete adapter",
													class: "text-muted-foreground hover:text-destructive",
													disabled: adapter.collectorCount > 0,
													title: adapter.collectorCount > 0 ? "In use by collectors" : "Delete adapter",
													children: ($$renderer) => {
														Trash_2($$renderer, { class: "size-4" });
													},
													$$slots: { default: true }
												});
												$$renderer.push(`<!----></form></div></div> `);
												if (adapter.description) {
													$$renderer.push("<!--[0-->");
													$$renderer.push(`<p class="text-muted-foreground text-xs">${escape_html(adapter.description)}</p>`);
												} else $$renderer.push("<!--[-1-->");
												$$renderer.push(`<!--]--> <div class="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs"><span>record: ${escape_html(adapter.defaultRecordType)}</span> `);
												if (adapter.collectorCount > 0) {
													$$renderer.push("<!--[0-->");
													$$renderer.push(`<a href="/collectors" class="hover:text-foreground">${escape_html(adapter.collectorCount)} collector${escape_html(adapter.collectorCount === 1 ? "" : "s")}</a>`);
												} else $$renderer.push("<!--[-1-->");
												$$renderer.push(`<!--]--></div> `);
												if (adapter.inputHint) {
													$$renderer.push("<!--[0-->");
													$$renderer.push(`<pre class="bg-muted/60 text-muted-foreground overflow-x-auto rounded-md p-2 font-mono text-xs">${escape_html(adapter.inputHint)}</pre>`);
												} else $$renderer.push("<!--[-1-->");
												$$renderer.push(`<!--]--> `);
												Button($$renderer, {
													href: "/collectors",
													variant: "ghost",
													size: "sm",
													class: "text-muted-foreground hover:text-foreground -ml-2",
													children: ($$renderer) => {
														$$renderer.push(`<!---->New collector `);
														Arrow_right($$renderer, { class: "size-3.5" });
														$$renderer.push(`<!---->`);
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
					}
					$$renderer.push(`<!--]--></div>`);
				}
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
//# sourceMappingURL=_page.svelte.js-Do1HQZQ6.js.map
