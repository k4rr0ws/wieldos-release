import { a1 as head, _ as ensure_array_like, a9 as escape_html, a0 as attr, a6 as stringify, a3 as spread_props } from '../../../chunks/server.js-BeDXxHyW.js';
import { B as Button, I as Icon } from '../../../chunks/button.js-BKCc13Pl.js';
import { I as Input } from '../../../chunks/input.js-VxJyhIEJ.js';
import { D as Dialog, a as Dialog_trigger, b as Dialog_content, c as Dialog_header, e as Dialog_title, f as Dialog_description, d as Dialog_footer } from '../../../chunks/dialog.js-BiupuAC8.js';
import { L as Label } from '../../../chunks/label.js-C7a3GAk3.js';
import { X } from '../../../chunks/x.js-Q2Bhqwn4.js';
import '../../../chunks/client.js-u-B9u8_c.js';
import { D as Database } from '../../../chunks/database.js-C4gk-2uV.js';
import { B as Badge } from '../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../chunks/page-header.js-Bo0OtOYz.js';
import { b as formatRelative } from '../../../chunks/datetime.js-DS-g6TQJ.js';
import { P as Plus } from '../../../chunks/plus.js-BImBz3Qf.js';
import { N as Native_select } from '../../../chunks/native-select.js-BcwRQfN8.js';
import { T as Trash_2 } from '../../../chunks/trash-2.js-CCEbkDYU.js';
import { P as Pencil } from '../../../chunks/pencil.js-DGUBFH_b.js';
import '../../../chunks/shared.js-CgP5r6wP.js';
import '../../../chunks/create-id.js-BN8YEFln.js';
import '../../../chunks/palette.js-BPVUdeAc.js';
import '../../../chunks/index-server2.js-UaiofxX-.js';
import '../../../chunks/dialog-content.js-DJOVMfdX.js';
import '../../../chunks/index-server.js-YgGoPwWh.js';
import '../../../chunks/chunk.js-BBx_TEkp.js';
import '../../../chunks/noop.js-D37m5eAl.js';
import '../../../chunks/exports.js-Y2Zp5fEj.js';
import '../../../chunks/internal2.js-0xtVfVtb.js';
import '../../../chunks/utils.js-UusfKV9V.js';

//#region src/lib/instance-templates.js
var INSTANCE_TEMPLATES = [
	{
		type: "xapi",
		label: "X API (official)",
		config: [],
		credentials: [{
			key: "bearerToken",
			placeholder: "X API bearer token"
		}]
	},
	{
		type: "twitterapi",
		label: "X / Twitter (twitterapi.io)",
		config: [],
		credentials: [
			{
				key: "apiKey",
				placeholder: "twitterapi.io API key"
			},
			{
				key: "loginCookies",
				placeholder: "Login cookies (optional — enables writes)"
			},
			{
				key: "proxy",
				placeholder: "Write proxy, host:port or URL (optional)"
			}
		]
	},
	{
		type: "telegram",
		label: "Telegram (GramJS)",
		config: [],
		credentials: [
			{
				key: "apiId",
				placeholder: "API ID (my.telegram.org)"
			},
			{
				key: "apiHash",
				placeholder: "API hash"
			},
			{
				key: "session",
				placeholder: "StringSession from a one-time login"
			}
		]
	},
	{
		type: "viem",
		label: "EVM — on-chain (viem)",
		config: [{
			key: "rpcUrl",
			placeholder: "JSON-RPC URL"
		}, {
			key: "chainId",
			placeholder: "369 (PulseChain)"
		}],
		credentials: [{
			key: "privateKey",
			placeholder: "Private key (optional — enables writes)"
		}]
	},
	{
		type: "dexscreener",
		label: "DexScreener",
		config: [{
			key: "chainId",
			placeholder: "pulsechain"
		}],
		credentials: []
	},
	{
		type: "sourcify",
		label: "Sourcify — verified contracts",
		config: [{
			key: "chainId",
			placeholder: "1 (Ethereum mainnet)"
		}, {
			key: "serverUrl",
			placeholder: "https://sourcify.dev/server"
		}],
		credentials: []
	}
];
function templateForType(type) {
	return INSTANCE_TEMPLATES.find((t) => t.type === type) ?? null;
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/key-round.svelte
function Key_round($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "key-round" },
		props,
		{ iconNode: [["path", { "d": "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" }], ["circle", {
			"cx": "16.5",
			"cy": "7.5",
			"r": ".5",
			"fill": "currentColor"
		}]] }
	]));
}
//#endregion
//#region src/routes/instances/+page.svelte
function pairEditor($$renderer, rows, prefix, { title, secret = false, addLabel } = {}) {
	$$renderer.push(`<div class="grid gap-2"><div class="flex items-center justify-between">`);
	Label($$renderer, {
		class: "flex items-center gap-1.5",
		children: ($$renderer) => {
			if (secret) {
				$$renderer.push("<!--[0-->");
				Key_round($$renderer, { class: "size-3.5" });
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> ${escape_html(title)}`);
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----> `);
	Button($$renderer, {
		type: "button",
		variant: "ghost",
		size: "sm",
		class: "text-muted-foreground h-7 px-2 text-xs",
		onclick: () => rows.push({
			key: "",
			value: "",
			placeholder: ""
		}),
		children: ($$renderer) => {
			Plus($$renderer, { class: "size-3.5" });
			$$renderer.push(`<!----> ${escape_html(addLabel)}`);
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----></div> `);
	const each_array = ensure_array_like(rows);
	if (each_array.length !== 0) {
		$$renderer.push("<!--[-->");
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let row = each_array[i];
			$$renderer.push(`<div class="flex items-center gap-2">`);
			Input($$renderer, {
				name: `${prefix}Key`,
				placeholder: "key",
				autocomplete: "off",
				class: "w-2/5 font-mono text-xs",
				get value() {
					return row.key;
				},
				set value($$value) {
					row.key = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				name: `${prefix}Value`,
				type: secret ? "password" : "text",
				autocomplete: "off",
				placeholder: row.placeholder || "value",
				class: "flex-1",
				get value() {
					return row.value;
				},
				set value($$value) {
					row.value = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				type: "button",
				variant: "ghost",
				size: "icon-sm",
				"aria-label": "Remove row",
				class: "text-muted-foreground hover:text-destructive shrink-0",
				onclick: () => rows.splice(i, 1),
				children: ($$renderer) => {
					X($$renderer, { class: "size-4" });
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div>`);
		}
	} else {
		$$renderer.push("<!--[!-->");
		$$renderer.push(`<p class="text-muted-foreground text-xs">None — this provider may not need any.</p>`);
	}
	$$renderer.push(`<!--]--></div>`);
}
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let createOpen = false;
		let editOpen = false;
		let editInstance = null;
		let createTemplate = "";
		let createType = "";
		let createConfigRows = [];
		let createCredRows = [];
		let editConfigRows = [];
		let editCredRows = [];
		function applyTemplate(type) {
			const template = templateForType(type);
			if (!template) return;
			createType = template.type;
			createConfigRows = template.config.map((f) => ({
				key: f.key,
				value: "",
				placeholder: f.placeholder
			}));
			createCredRows = template.credentials.map((f) => ({
				key: f.key,
				value: "",
				placeholder: f.placeholder
			}));
		}
		function openCreate() {
			createTemplate = "";
			createType = "";
			createConfigRows = [];
			createCredRows = [];
			createOpen = true;
		}
		function openEdit(instance) {
			editInstance = instance;
			editConfigRows = Object.entries(instance.config ?? {}).map(([key, value]) => ({
				key,
				value: String(value),
				placeholder: ""
			}));
			editCredRows = Object.keys(instance.credentials ?? {}).map((key) => ({
				key,
				value: "",
				placeholder: `${instance.credentials[key]} — leave blank to keep`
			}));
			editOpen = true;
		}
		const statusVariant = {
			active: "secondary",
			paused: "outline",
			error: "destructive"
		};
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("aye7dn", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Instances · WieldOS</title>`);
				});
			});
			Page_header($$renderer, {
				title: "Instances",
				description: "Connections to providers & integrations — credentials live here",
				icon: Database,
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
												onclick: openCreate,
												children: ($$renderer) => {
													Plus($$renderer, { class: "size-4" });
													$$renderer.push(`<!----> New instance`);
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
										children: ($$renderer) => {
											if (Dialog_header) {
												$$renderer.push("<!--[-->");
												Dialog_header($$renderer, {
													children: ($$renderer) => {
														if (Dialog_title) {
															$$renderer.push("<!--[-->");
															Dialog_title($$renderer, {
																children: ($$renderer) => {
																	$$renderer.push(`<!---->New instance`);
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
																	$$renderer.push(`<!---->A connection to a provider — give it credentials so collectors and adapters can act as this account.`);
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
												placeholder: "e.g. Main X account",
												required: true
											});
											$$renderer.push(`<!----></div> <div class="grid gap-2">`);
											Label($$renderer, {
												for: "template",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Template`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Native_select($$renderer, {
												id: "template",
												class: "w-full",
												onchange: () => applyTemplate(createTemplate),
												get value() {
													return createTemplate;
												},
												set value($$value) {
													createTemplate = $$value;
													$$settled = false;
												},
												children: ($$renderer) => {
													$$renderer.option({ value: "" }, ($$renderer) => {
														$$renderer.push(`Custom…`);
													});
													$$renderer.push(` <!--[-->`);
													const each_array_1 = ensure_array_like(INSTANCE_TEMPLATES);
													for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
														let template = each_array_1[$$index_1];
														$$renderer.option({ value: template.type }, ($$renderer) => {
															$$renderer.push(`${escape_html(template.label)}`);
														});
													}
													$$renderer.push(`<!--]-->`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></div></div> <div class="grid gap-2">`);
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
												placeholder: "e.g. xapi, telegram, my_api",
												required: true,
												class: "font-mono text-xs",
												get value() {
													return createType;
												},
												set value($$value) {
													createType = $$value;
													$$settled = false;
												}
											});
											$$renderer.push(`<!----> <p class="text-muted-foreground text-xs">A tag that groups this instance with the adapters built for it.</p></div> `);
											pairEditor($$renderer, createConfigRows, "config", {
												title: "Config",
												addLabel: "Add config"
											});
											$$renderer.push(`<!----> `);
											pairEditor($$renderer, createCredRows, "cred", {
												title: "Credentials",
												secret: true,
												addLabel: "Add credential"
											});
											$$renderer.push(`<!----> `);
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
																$$renderer.push(`<!---->Create instance`);
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
								children: ($$renderer) => {
									if (Dialog_header) {
										$$renderer.push("<!--[-->");
										Dialog_header($$renderer, {
											children: ($$renderer) => {
												if (Dialog_title) {
													$$renderer.push("<!--[-->");
													Dialog_title($$renderer, {
														children: ($$renderer) => {
															$$renderer.push(`<!---->Edit instance`);
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
									$$renderer.push(`<form method="POST" action="?/update" class="grid gap-4"><input type="hidden" name="id"${attr("value", editInstance?.id)}/> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
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
										value: editInstance?.name,
										required: true
									});
									$$renderer.push(`<!----></div> <div class="grid gap-2">`);
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
										value: editInstance?.status,
										class: "w-full",
										children: ($$renderer) => {
											$$renderer.option({ value: "active" }, ($$renderer) => {
												$$renderer.push(`Active`);
											});
											$$renderer.push(` `);
											$$renderer.option({ value: "paused" }, ($$renderer) => {
												$$renderer.push(`Paused`);
											});
											$$renderer.push(` `);
											$$renderer.option({ value: "error" }, ($$renderer) => {
												$$renderer.push(`Error`);
											});
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-type",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Type`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "edit-type",
										name: "type",
										value: editInstance?.type,
										required: true,
										class: "font-mono text-xs"
									});
									$$renderer.push(`<!----></div> `);
									pairEditor($$renderer, editConfigRows, "config", {
										title: "Config",
										addLabel: "Add config"
									});
									$$renderer.push(`<!----> `);
									pairEditor($$renderer, editCredRows, "cred", {
										title: "Credentials",
										secret: true,
										addLabel: "Add credential"
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
			$$renderer.push(` `);
			if (data.instances.length === 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center"><div class="bg-muted flex size-12 items-center justify-center rounded-xl">`);
				Database($$renderer, { class: "size-6" });
				$$renderer.push(`<!----></div> <div class="space-y-1"><p class="font-medium">No instances yet</p> <p class="text-muted-foreground text-sm">Connect a provider to start collecting intelligence.</p></div> `);
				Button($$renderer, {
					onclick: openCreate,
					children: ($$renderer) => {
						Plus($$renderer, { class: "size-4" });
						$$renderer.push(`<!----> Add an instance`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="rounded-lg border"><table class="w-full text-sm"><thead><tr class="border-b"><th class="text-muted-foreground px-4 py-2.5 text-left text-xs font-medium">Name</th><th class="text-muted-foreground px-4 py-2.5 text-left text-xs font-medium">Status</th><th class="text-muted-foreground hidden px-4 py-2.5 text-left text-xs font-medium sm:table-cell">Collectors</th><th class="text-muted-foreground hidden px-4 py-2.5 text-left text-xs font-medium sm:table-cell">Records</th><th class="text-muted-foreground hidden px-4 py-2.5 text-left text-xs font-medium md:table-cell">Keys</th><th class="text-muted-foreground hidden px-4 py-2.5 text-left text-xs font-medium lg:table-cell">Checked</th><th class="px-2 py-2.5"></th></tr></thead><tbody><!--[-->`);
				const each_array_2 = ensure_array_like(data.instances);
				for (let $$index_4 = 0, $$length = each_array_2.length; $$index_4 < $$length; $$index_4++) {
					let instance = each_array_2[$$index_4];
					$$renderer.push(`<tr class="hover:bg-muted/40 border-b transition-colors last:border-b-0"><td class="px-4 py-3"><div class="flex items-center gap-2"><span class="font-medium">${escape_html(instance.name)}</span> <span class="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-[10px]">${escape_html(instance.type)}</span></div></td><td class="px-4 py-3">`);
					Badge($$renderer, {
						variant: statusVariant[instance.status] ?? "outline",
						class: "capitalize text-xs",
						children: ($$renderer) => {
							$$renderer.push(`<!---->${escape_html(instance.status)}`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></td><td class="hidden px-4 py-3 sm:table-cell">`);
					if (instance.transformerCount > 0) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<a href="/transformers" class="text-muted-foreground hover:text-foreground text-xs tabular-nums">${escape_html(instance.transformerCount)}</a>`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<a${attr("href", `/collectors?instance=${stringify(instance.id)}`)} class="text-muted-foreground hover:text-foreground text-xs tabular-nums">${escape_html(instance.collectorCount)}</a>`);
					}
					$$renderer.push(`<!--]--></td><td class="hidden px-4 py-3 sm:table-cell"><a${attr("href", `/records?instance=${stringify(instance.id)}`)} class="text-muted-foreground hover:text-foreground text-xs tabular-nums">${escape_html(instance.recordCount)}</a></td><td class="hidden px-4 py-3 md:table-cell"><div class="flex flex-wrap gap-1"><!--[-->`);
					const each_array_3 = ensure_array_like(Object.keys(instance.config));
					for (let $$index_2 = 0, $$length = each_array_3.length; $$index_2 < $$length; $$index_2++) {
						let key = each_array_3[$$index_2];
						$$renderer.push(`<span class="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-[10px]">${escape_html(key)}</span>`);
					}
					$$renderer.push(`<!--]--> <!--[-->`);
					const each_array_4 = ensure_array_like(Object.keys(instance.credentials));
					for (let $$index_3 = 0, $$length = each_array_4.length; $$index_3 < $$length; $$index_3++) {
						let key = each_array_4[$$index_3];
						$$renderer.push(`<span class="bg-muted text-muted-foreground inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-mono text-[10px]">`);
						Key_round($$renderer, { class: "size-2.5" });
						$$renderer.push(`<!---->${escape_html(key)}</span>`);
					}
					$$renderer.push(`<!--]--></div></td><td class="text-muted-foreground hidden px-4 py-3 text-xs lg:table-cell">${escape_html(instance.lastCheckedAt ? formatRelative(instance.lastCheckedAt) : "—")}</td><td class="px-2 py-3"><div class="flex items-center gap-0.5">`);
					Button($$renderer, {
						type: "button",
						variant: "ghost",
						size: "icon-sm",
						"aria-label": "Edit instance",
						class: "text-muted-foreground hover:text-foreground",
						onclick: () => openEdit(instance),
						children: ($$renderer) => {
							Pencil($$renderer, { class: "size-4" });
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", instance.id)}/> `);
					Button($$renderer, {
						type: "submit",
						variant: "ghost",
						size: "icon-sm",
						"aria-label": "Delete instance",
						class: "text-muted-foreground hover:text-destructive",
						children: ($$renderer) => {
							Trash_2($$renderer, { class: "size-4" });
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></form></div></td></tr>`);
				}
				$$renderer.push(`<!--]--></tbody></table></div>`);
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
//# sourceMappingURL=_page.svelte.js-vI_2uxVi.js.map
