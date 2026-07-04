import { a1 as head, a9 as escape_html, a3 as spread_props, _ as ensure_array_like, a0 as attr, a6 as stringify } from '../../../chunks/server.js-BeDXxHyW.js';
import { B as Button, I as Icon } from '../../../chunks/button.js-BKCc13Pl.js';
import { T as Triangle_alert } from '../../../chunks/triangle-alert.js-D5mtn1DL.js';
import { I as Input } from '../../../chunks/input.js-VxJyhIEJ.js';
import { D as Dialog, a as Dialog_trigger, b as Dialog_content, c as Dialog_header, e as Dialog_title, f as Dialog_description, d as Dialog_footer } from '../../../chunks/dialog.js-BiupuAC8.js';
import { L as Label } from '../../../chunks/label.js-C7a3GAk3.js';
import '../../../chunks/client.js-u-B9u8_c.js';
import { A as Arrow_right_left } from '../../../chunks/arrow-right-left.js-DKRClxV8.js';
import { C as Card, f as Card_content } from '../../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../chunks/page-header.js-Bo0OtOYz.js';
import { b as formatRelative } from '../../../chunks/datetime.js-DS-g6TQJ.js';
import { P as Plus } from '../../../chunks/plus.js-BImBz3Qf.js';
import { P as Play } from '../../../chunks/play.js-BmT9XzUw.js';
import { R as Rotate_ccw } from '../../../chunks/rotate-ccw.js-DVa2SmVN.js';
import { N as Native_select } from '../../../chunks/native-select.js-BcwRQfN8.js';
import { C as Code_textarea } from '../../../chunks/code-textarea.js-DT3cZcBg.js';
import { T as Trash_2 } from '../../../chunks/trash-2.js-CCEbkDYU.js';
import { P as Pencil } from '../../../chunks/pencil.js-DGUBFH_b.js';
import { T as Table, a as Table_header, c as Table_row, d as Table_head, b as Table_body, e as Table_cell } from '../../../chunks/table.js-magl9_hQ.js';
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
import '../../../chunks/internal2.js-0xtVfVtb.js';
import '../../../chunks/utils.js-UusfKV9V.js';
import '../../../index.js-Ilpi2VuO.js';
import '../../../chunks/internal.js-BlXt2rfE.js';
import '../../../chunks/shared-server.js-9-2j12mp.js';
import '../../../chunks/app.js-DT8253QF.js';

//#region src/lib/transformer-templates.js
var SCRIPT_TEMPLATES = [
	{
		id: "copy_fields",
		label: "Copy metadata fields",
		sourceTypes: null,
		script: [
			"// Copy the source record's metadata into a new record.",
			"// Only the fields declared above are kept.",
			"ctx.save({ id: ctx.record.id, ...ctx.record.metadata });"
		].join("\n")
	},
	{
		id: "inspect",
		label: "Inspect records (log only)",
		sourceTypes: null,
		script: ["// Log each record to the run summary without saving anything.", "ctx.log(ctx.record.id + \" \" + JSON.stringify(ctx.record.metadata));"].join("\n")
	},
	{
		id: "tweet_poster",
		label: "Save poster as ecosystem user",
		sourceTypes: [
			"tweet",
			"tweet_reply",
			"xapi_tweet"
		],
		suggests: {
			recordType: "ecosystem_user",
			fields: [
				"username",
				"role",
				"telegram",
				"x"
			],
			keyField: "username"
		},
		script: [
			"// Save each tweet's poster as an ecosystem user.",
			"const username = ctx.record.metadata.author;",
			"if (!username) return; // returning skips this record",
			"ctx.save({ username, role: 'community', telegram: '', x: 'https://x.com/' + username });"
		].join("\n")
	},
	{
		id: "tweet_poster_enriched",
		label: "Save poster, enriched via X API",
		sourceTypes: [
			"tweet",
			"tweet_reply",
			"xapi_tweet"
		],
		suggests: {
			recordType: "ecosystem_user",
			fields: [
				"username",
				"role",
				"telegram",
				"x",
				"displayName",
				"bio",
				"location",
				"verified",
				"followers",
				"following",
				"tweets",
				"ffRatio",
				"accountCreated"
			],
			keyField: "username"
		},
		script: [
			"// Save each tweet's poster with a quality-gated X profile (needs an xapi instance).",
			"const username = ctx.record.metadata.author;",
			"if (!username) ctx.skip('no author on record');",
			"",
			"let profile;",
			"try {",
			"	profile = await ctx.enrich('xapi_fetch_user', { username }); // normalized user object",
			"} catch (err) {",
			"	ctx.skip('profile lookup failed: ' + err.message);",
			"}",
			"",
			"// Quality gates — drop low-signal accounts before saving.",
			"const MIN_FOLLOWERS = 50;",
			"const tier =",
			"	profile.followers >= 100000 ? 'kol' :",
			"	profile.followers >= 10000 ? 'influencer' :",
			"	profile.followers >= 1000 ? 'active' :",
			"	profile.followers >= MIN_FOLLOWERS ? 'community' : 'low-signal';",
			"if (tier === 'low-signal') ctx.skip(username + ' has under ' + MIN_FOLLOWERS + ' followers');",
			"",
			"// Follower/following ratio helps flag follow-bait accounts downstream.",
			"const ffRatio = profile.following > 0",
			"	? Number((profile.followers / profile.following).toFixed(2))",
			"	: null;",
			"",
			"ctx.save({",
			"	username,",
			"	role: tier,",
			"	telegram: '',",
			"	x: 'https://x.com/' + username,",
			"	displayName: profile.name,",
			"	bio: profile.bio,",
			"	location: profile.location,",
			"	verified: profile.verified,",
			"	followers: profile.followers,",
			"	following: profile.following,",
			"	tweets: profile.tweets,",
			"	ffRatio,",
			"	accountCreated: profile.createdAt",
			"});"
		].join("\n")
	},
	{
		id: "author_tally",
		label: "Tally posts per author",
		sourceTypes: [
			"tweet",
			"tweet_reply",
			"xapi_tweet"
		],
		suggests: {
			recordType: "author_activity",
			fields: [
				"username",
				"posts",
				"lastSeen"
			],
			keyField: "username"
		},
		script: [
			"// Count posts per author, merging with what earlier runs saved.",
			"const username = ctx.record.metadata.author;",
			"if (!username) ctx.skip('no author on record'); // counted + logged, not an error",
			"const prev = ctx.existing(username); // fields saved under this key, or null",
			"ctx.save({",
			"	username,",
			"	posts: (prev?.posts ?? 0) + 1,",
			"	lastSeen: ctx.record.capturedAt ?? ''",
			"});"
		].join("\n")
	},
	{
		id: "telegram_chat",
		label: "Save chat as ecosystem user",
		sourceTypes: ["telegram_message"],
		suggests: {
			recordType: "ecosystem_user",
			fields: [
				"username",
				"role",
				"telegram",
				"x"
			],
			keyField: "username"
		},
		script: [
			"// Save each message's chat as an ecosystem user entry.",
			"const m = ctx.record.metadata;",
			"if (!m.chatUsername) return;",
			"ctx.save({ username: m.chatUsername, role: 'channel', telegram: 'https://t.me/' + m.chatUsername, x: '' });"
		].join("\n")
	},
	{
		id: "x_account",
		label: "Save account as ecosystem user",
		sourceTypes: ["twitter_user", "xapi_user"],
		suggests: {
			recordType: "ecosystem_user",
			fields: [
				"username",
				"role",
				"telegram",
				"x"
			],
			keyField: "username"
		},
		script: [
			"// Save each captured X account as an ecosystem user.",
			"const m = ctx.record.metadata;",
			"if (!m.handle) return;",
			"ctx.save({ username: m.handle, role: 'community', telegram: '', x: 'https://x.com/' + m.handle });"
		].join("\n")
	}
];
/** Templates that apply to a source record type ('' = no filter, show all). */
function templatesForSource(sourceType) {
	const type = String(sourceType ?? "");
	return SCRIPT_TEMPLATES.filter((t) => !t.sourceTypes || !type || t.sourceTypes.includes(type));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/eraser.svelte
function Eraser($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "eraser" },
		props,
		{ iconNode: [["path", { "d": "M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21" }], ["path", { "d": "m5.082 11.09 8.828 8.828" }]] }
	]));
}
//#endregion
//#region src/routes/transformers/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let createOpen = false;
		let editOpen = false;
		let editTransformer = null;
		let createScheduleMode = "manual";
		let createEveryHours = 8;
		let settingsOpen = false;
		let settingsForm = {};
		function openSettings() {
			settingsForm = Object.fromEntries(data.settings.map((s) => [s.key, s.value]));
			settingsOpen = true;
		}
		const scriptExample = [
			"const username = ctx.record.metadata.author;",
			"if (!username) return; // returning skips this record",
			"const profile = await ctx.enrich('xapi_fetch_user', { username });",
			"ctx.save({ username, role: 'community', telegram: '', x: 'https://x.com/' + username });"
		].join("\n");
		const emptyForm = () => ({
			name: "",
			recordType: "",
			keyField: "",
			fields: "",
			sourceType: "",
			contains: "",
			script: "",
			template: ""
		});
		let createForm = emptyForm();
		let editForm = emptyForm();
		function openEdit(transformer) {
			editTransformer = transformer;
			editForm = {
				name: transformer.name ?? "",
				recordType: transformer.recordType ?? "",
				keyField: transformer.keyField ?? "",
				fields: transformer.fields?.join(", ") ?? "",
				sourceType: transformer.filter?.recordType ?? "",
				contains: transformer.filter?.contains ?? "",
				script: transformer.script ?? "",
				template: ""
			};
			editOpen = true;
		}
		function applyTemplate(f, id) {
			const template = SCRIPT_TEMPLATES.find((t) => t.id === id);
			f.template = "";
			if (!template) return;
			f.script = template.script;
			if (template.suggests) {
				if (!f.recordType.trim()) f.recordType = template.suggests.recordType;
				if (!f.fields.trim()) f.fields = template.suggests.fields.join(", ");
				if (!f.keyField.trim()) f.keyField = template.suggests.keyField;
			}
		}
		function cadenceLabel(minutes) {
			if (!minutes) return "manual";
			return minutes % 60 === 0 ? `every ${minutes / 60}h` : `every ${minutes}m`;
		}
		const editHours = (t) => t?.scheduleMinutes ? Math.max(1, Math.round(t.scheduleMinutes / 60)) : 8;
		function sourceLabel(filter) {
			const parts = [];
			if (filter?.recordType) parts.push(filter.recordType);
			if (filter?.contains) parts.push(`"${filter.contains}"`);
			return parts.length ? parts.join(" · ") : "all records";
		}
		function transformerFields($$renderer, f) {
			$$renderer.push(`<div class="grid gap-2">`);
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
				placeholder: "e.g. save_users",
				required: true,
				get value() {
					return f.name;
				},
				set value($$value) {
					f.name = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			if (form?.message) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-destructive text-xs">${escape_html(form.message)}</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
			Label($$renderer, {
				for: "recordType",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Target record type`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "recordType",
				name: "recordType",
				placeholder: "e.g. ecosystem_user",
				class: "font-mono text-xs",
				required: true,
				get value() {
					return f.recordType;
				},
				set value($$value) {
					f.recordType = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div> <div class="grid gap-2">`);
			Label($$renderer, {
				for: "keyField",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Key field (dedup)`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "keyField",
				name: "keyField",
				placeholder: "e.g. username",
				class: "font-mono text-xs",
				get value() {
					return f.keyField;
				},
				set value($$value) {
					f.keyField = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div></div> <div class="grid gap-2">`);
			Label($$renderer, {
				for: "fields",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Fields (comma-separated)`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "fields",
				name: "fields",
				placeholder: "e.g. username, role, telegram, x",
				class: "font-mono text-xs",
				required: true,
				get value() {
					return f.fields;
				},
				set value($$value) {
					f.fields = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
			Label($$renderer, {
				for: "sourceType",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Source record type`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Native_select($$renderer, {
				id: "sourceType",
				name: "sourceType",
				class: "w-full",
				get value() {
					return f.sourceType;
				},
				set value($$value) {
					f.sourceType = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					$$renderer.option({ value: "" }, ($$renderer) => {
						$$renderer.push(`All types`);
					});
					$$renderer.push(` <!--[-->`);
					const each_array = ensure_array_like(data.recordTypes);
					for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
						let type = each_array[$$index];
						$$renderer.option({ value: type }, ($$renderer) => {
							$$renderer.push(`${escape_html(type)}`);
						});
					}
					$$renderer.push(`<!--]-->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> <div class="grid gap-2">`);
			Label($$renderer, {
				for: "contains",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Contains (optional)`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "contains",
				name: "contains",
				placeholder: "substring filter",
				get value() {
					return f.contains;
				},
				set value($$value) {
					f.contains = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div></div> <div class="grid gap-2"><div class="flex items-center justify-between">`);
			Label($$renderer, {
				for: "script",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Script (runs once per record)`);
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
					const each_array_1 = ensure_array_like(templatesForSource(f.sourceType));
					for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
						let template = each_array_1[$$index_1];
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
				rows: 8,
				placeholder: scriptExample,
				required: true,
				get value() {
					return f.script;
				},
				set value($$value) {
					f.script = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> <p class="text-muted-foreground text-xs">ctx.record — the source record · ctx.save(fields) — upsert a target record ·
			ctx.enrich(tool, input) — call a read-only tool · ctx.query(filter) — read records ·
			ctx.existing(key) — fields saved under key, or null · ctx.hash(input) — stable key ·
			ctx.skip(reason) — skip with a logged reason · ctx.log(msg)</p></div>`);
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("jzvd9d", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Transformers · WieldOS</title>`);
				});
			});
			Page_header($$renderer, {
				title: "Transformers",
				description: "Derive new record types from existing records with a per-record script",
				icon: Arrow_right_left,
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
												children: ($$renderer) => {
													Plus($$renderer, { class: "size-4" });
													$$renderer.push(`<!----> New transformer`);
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
																	$$renderer.push(`<!---->New transformer`);
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
																	$$renderer.push(`<!---->Queries records, runs your script per record, and saves the results as a new record type.`);
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
											transformerFields($$renderer, createForm);
											$$renderer.push(`<!----> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
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
											$$renderer.push(`<!----></div></div> `);
											if (Dialog_footer) {
												$$renderer.push("<!--[-->");
												Dialog_footer($$renderer, {
													children: ($$renderer) => {
														Button($$renderer, {
															type: "submit",
															children: ($$renderer) => {
																$$renderer.push(`<!---->Create transformer`);
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
															$$renderer.push(`<!---->Transformer settings`);
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
															$$renderer.push(`<!---->Per-run limits for every transformer. Changes apply from the next run.`);
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
									const each_array_2 = ensure_array_like(data.settings);
									for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
										let setting = each_array_2[$$index_2];
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
															$$renderer.push(`<!---->Edit transformer`);
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
									$$renderer.push(`<form method="POST" action="?/update" class="grid gap-4"><input type="hidden" name="id"${attr("value", editTransformer?.id)}/> `);
									transformerFields($$renderer, editForm);
									$$renderer.push(`<!----> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
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
										value: editTransformer?.scheduleMinutes ? "scheduled" : "manual",
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
										value: editHours(editTransformer)
									});
									$$renderer.push(`<!----></div></div> `);
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
			if (form?.emptied) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-muted-foreground mb-3 text-sm">Emptied — ${escape_html(form.emptied.deleted)} record${escape_html(form.emptied.deleted === 1 ? "" : "s")} deleted.</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (form?.ran) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-muted-foreground mb-3 text-sm">Run complete — ${escape_html(form.ran.processed)} record${escape_html(form.ran.processed === 1 ? "" : "s")} processed,
		${escape_html(form.ran.saved)} saved${escape_html(form.ran.skipped ? `, ${form.ran.skipped} skipped` : "")}${escape_html(form.ran.errors ? `, ${form.ran.errors} failed` : "")}${escape_html(form.ran.deferred ? `, ${form.ran.deferred} deferred to the next run` : "")}.</p> `);
				if (form.ran.logs?.length) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<pre class="bg-muted text-muted-foreground mb-3 overflow-x-auto rounded-md p-3 font-mono text-xs">${escape_html(form.ran.logs.join("\n"))}</pre>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (data.transformers.length === 0) {
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
										Arrow_right_left($$renderer, { class: "size-6" });
										$$renderer.push(`<!----></div> <div class="space-y-1"><p class="font-medium">No transformers yet</p> <p class="text-muted-foreground text-sm">Define a record type and a script to derive new records from what you've already collected.</p></div> `);
										Button($$renderer, {
											onclick: () => createOpen = true,
											children: ($$renderer) => {
												Plus($$renderer, { class: "size-4" });
												$$renderer.push(`<!----> Add a transformer`);
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
																$$renderer.push(`<!---->Target type`);
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
																$$renderer.push(`<!---->Source`);
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
										const each_array_3 = ensure_array_like(data.transformers);
										for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
											let transformer = each_array_3[$$index_3];
											if (Table_row) {
												$$renderer.push("<!--[-->");
												Table_row($$renderer, {
													class: "group",
													children: ($$renderer) => {
														if (Table_cell) {
															$$renderer.push("<!--[-->");
															Table_cell($$renderer, {
																children: ($$renderer) => {
																	$$renderer.push(`<div class="flex flex-col gap-1"><span class="font-medium">${escape_html(transformer.name)}</span> `);
																	if (transformer.lastError) {
																		$$renderer.push("<!--[0-->");
																		$$renderer.push(`<span class="text-destructive flex items-center gap-1 text-xs">`);
																		Triangle_alert($$renderer, { class: "size-3" });
																		$$renderer.push(`<!----> ${escape_html(transformer.lastError)}</span>`);
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
																			$$renderer.push(`<!---->${escape_html(transformer.recordType)}`);
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
																	$$renderer.push(`<!---->${escape_html(sourceLabel(transformer.filter))}`);
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
																	$$renderer.push(`<!---->${escape_html(cadenceLabel(transformer.scheduleMinutes))}`);
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
																	$$renderer.push(`<a${attr("href", `/records?type=${stringify(transformer.recordType)}`)} class="text-muted-foreground hover:text-foreground">${escape_html(transformer.recordCount)}</a>`);
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
																	$$renderer.push(`<!---->${escape_html(transformer.lastRunAt ? formatRelative(transformer.lastRunAt) : "never")}`);
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
																		variant: transformer.enabled ? "secondary" : "outline",
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->${escape_html(transformer.enabled ? "Enabled" : "Paused")}`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----> `);
																	if (transformer.status === "error") {
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
																	$$renderer.push(`<div class="flex items-center justify-end gap-0.5"><form method="POST" action="?/run"><input type="hidden" name="id"${attr("value", transformer.id)}/> `);
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
																	$$renderer.push(`<!----></form> <form method="POST" action="?/toggle"><input type="hidden" name="id"${attr("value", transformer.id)}/> <input type="hidden" name="enabled"${attr("value", (!transformer.enabled).toString())}/> `);
																	Button($$renderer, {
																		type: "submit",
																		variant: "ghost",
																		size: "sm",
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->${escape_html(transformer.enabled ? "Pause" : "Resume")}`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----></form> <form method="POST" action="?/reset"><input type="hidden" name="id"${attr("value", transformer.id)}/> `);
																	Button($$renderer, {
																		type: "submit",
																		variant: "ghost",
																		size: "icon-sm",
																		"aria-label": "Reset cursor (reprocess all records)",
																		title: "Reset cursor — the next run reprocesses every matching record",
																		class: "text-muted-foreground hover:text-foreground",
																		disabled: !transformer.cursor,
																		children: ($$renderer) => {
																			Rotate_ccw($$renderer, { class: "size-4" });
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----></form> <form method="POST" action="?/empty"><input type="hidden" name="id"${attr("value", transformer.id)}/> `);
																	Button($$renderer, {
																		type: "submit",
																		variant: "ghost",
																		size: "icon-sm",
																		"aria-label": "Empty records",
																		title: "Empty — delete every record this transformer produced",
																		class: "text-muted-foreground hover:text-destructive",
																		disabled: !transformer.recordCount,
																		children: ($$renderer) => {
																			Eraser($$renderer, { class: "size-4" });
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----></form> `);
																	Button($$renderer, {
																		type: "button",
																		variant: "ghost",
																		size: "icon-sm",
																		"aria-label": "Edit transformer",
																		class: "text-muted-foreground hover:text-foreground",
																		onclick: () => openEdit(transformer),
																		children: ($$renderer) => {
																			Pencil($$renderer, { class: "size-4" });
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", transformer.id)}/> `);
																	Button($$renderer, {
																		type: "submit",
																		variant: "ghost",
																		size: "icon-sm",
																		"aria-label": "Delete transformer",
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
//# sourceMappingURL=_page.svelte.js-Dud_irck.js.map
