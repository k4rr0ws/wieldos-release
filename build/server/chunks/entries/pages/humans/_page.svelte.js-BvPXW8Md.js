import { a1 as head, _ as ensure_array_like, a3 as spread_props, a0 as attr, a9 as escape_html, a7 as attr_class } from '../../../chunks/server.js-BeDXxHyW.js';
import { B as Button, I as Icon } from '../../../chunks/button.js-BKCc13Pl.js';
import { I as Input } from '../../../chunks/input.js-VxJyhIEJ.js';
import { D as Dialog, a as Dialog_trigger, b as Dialog_content, c as Dialog_header, e as Dialog_title, f as Dialog_description, d as Dialog_footer } from '../../../chunks/dialog.js-BiupuAC8.js';
import { L as Label } from '../../../chunks/label.js-C7a3GAk3.js';
import '../../../chunks/client.js-BHHES_V7.js';
import { U as Users_round } from '../../../chunks/users-round.js-BV_dMmp-.js';
import { C as Card, f as Card_content, a as Card_header, c as Card_title } from '../../../chunks/card.js-CpJf0FPn.js';
import { P as Page_header } from '../../../chunks/page-header.js-Bo0OtOYz.js';
import { P as Plus } from '../../../chunks/plus.js-BImBz3Qf.js';
import { P as Pencil } from '../../../chunks/pencil.js-DGUBFH_b.js';
import { T as Trash_2 } from '../../../chunks/trash-2.js-CCEbkDYU.js';
import { T as Textarea } from '../../../chunks/textarea.js-OJ5frhCS.js';
import { S as Send } from '../../../chunks/send.js-A4K4xnP_.js';
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

//#region node_modules/@lucide/svelte/dist/icons/user-round-plus.svelte
function User_round_plus($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "user-round-plus" },
		props,
		{ iconNode: [
			["path", { "d": "M2 21a8 8 0 0 1 13.292-6" }],
			["circle", {
				"cx": "10",
				"cy": "8",
				"r": "5"
			}],
			["path", { "d": "M19 16v6" }],
			["path", { "d": "M22 19h-6" }]
		] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/at-sign.svelte
function At_sign($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "at-sign" },
		props,
		{ iconNode: [["circle", {
			"cx": "12",
			"cy": "12",
			"r": "4"
		}], ["path", { "d": "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" }]] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/phone.svelte
function Phone($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "phone" },
		props,
		{ iconNode: [["path", { "d": "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" }]] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/mail.svelte
function Mail($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "mail" },
		props,
		{ iconNode: [["path", { "d": "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" }], ["rect", {
			"x": "2",
			"y": "4",
			"width": "20",
			"height": "16",
			"rx": "2"
		}]] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/wallet.svelte
function Wallet($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "wallet" },
		props,
		{ iconNode: [["path", { "d": "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" }], ["path", { "d": "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" }]] }
	]));
}
//#endregion
//#region src/routes/humans/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let addOpen = false;
		let editOpen = false;
		let editHuman = null;
		function openEdit(human) {
			editHuman = human;
			editOpen = true;
		}
		function shortAddress(addr) {
			return addr && addr.length > 14 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
		}
		function initials(name) {
			return name?.trim()?.slice(0, 2)?.toUpperCase() ?? "?";
		}
		function contactRows(human) {
			return [
				{
					icon: Send,
					label: human.tgUsername,
					kind: "tg"
				},
				{
					icon: At_sign,
					label: human.twitterUsername,
					kind: "tw"
				},
				{
					icon: Phone,
					label: human.phone,
					kind: "phone"
				},
				{
					icon: Mail,
					label: human.email,
					kind: "email"
				},
				{
					icon: Wallet,
					label: shortAddress(human.evmAddress),
					kind: "evm"
				}
			].filter((row) => row.label);
		}
		function personFields($$renderer, person) {
			$$renderer.push(`<div class="grid gap-2">`);
			Label($$renderer, {
				for: "username",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Username`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "username",
				name: "username",
				value: person?.username ?? "",
				placeholder: "Display name or handle",
				required: true
			});
			$$renderer.push(`<!----> `);
			if (form?.message) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-destructive text-xs">${escape_html(form.message)}</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
			Label($$renderer, {
				for: "tgUsername",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Telegram`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "tgUsername",
				name: "tgUsername",
				value: person?.tgUsername ?? "",
				placeholder: "@handle"
			});
			$$renderer.push(`<!----></div> <div class="grid gap-2">`);
			Label($$renderer, {
				for: "twitterUsername",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Twitter / X`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "twitterUsername",
				name: "twitterUsername",
				value: person?.twitterUsername ?? "",
				placeholder: "@handle"
			});
			$$renderer.push(`<!----></div></div> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
			Label($$renderer, {
				for: "phone",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Phone`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "phone",
				name: "phone",
				type: "tel",
				value: person?.phone ?? "",
				placeholder: "+1 555 000 0000"
			});
			$$renderer.push(`<!----></div> <div class="grid gap-2">`);
			Label($$renderer, {
				for: "email",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Email`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "email",
				name: "email",
				type: "email",
				value: person?.email ?? "",
				placeholder: "name@example.com"
			});
			$$renderer.push(`<!----></div></div> <div class="grid gap-2">`);
			Label($$renderer, {
				for: "evmAddress",
				children: ($$renderer) => {
					$$renderer.push(`<!---->EVM address`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "evmAddress",
				name: "evmAddress",
				value: person?.evmAddress ?? "",
				placeholder: "0x…",
				class: "font-mono"
			});
			$$renderer.push(`<!----></div> <div class="grid gap-2">`);
			Label($$renderer, {
				for: "notes",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Notes`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Textarea($$renderer, {
				id: "notes",
				name: "notes",
				value: person?.notes ?? "",
				rows: 3,
				placeholder: "Social bio, follower stats, context…"
			});
			$$renderer.push(`<!----></div>`);
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("w8tlp3", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Humans · WieldOS</title>`);
				});
			});
			Page_header($$renderer, {
				title: "Humans",
				description: "People in your orbit",
				icon: Users_round,
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
													$$renderer.push(`<!----> Add person`);
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
																	$$renderer.push(`<!---->Add person`);
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
																	$$renderer.push(`<!---->Only a username is required; everything else is optional.`);
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
											personFields($$renderer, null);
											$$renderer.push(`<!----> `);
											if (Dialog_footer) {
												$$renderer.push("<!--[-->");
												Dialog_footer($$renderer, {
													children: ($$renderer) => {
														Button($$renderer, {
															type: "submit",
															children: ($$renderer) => {
																$$renderer.push(`<!---->Add person`);
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
															$$renderer.push(`<!---->Edit person`);
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
															$$renderer.push(`<!---->Update this person's details.`);
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
									$$renderer.push(`<form method="POST" action="?/update" class="grid gap-4"><input type="hidden" name="id"${attr("value", editHuman?.id)}/> `);
									personFields($$renderer, editHuman);
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
			if (data.humans.length === 0) {
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
										User_round_plus($$renderer, { class: "size-6" });
										$$renderer.push(`<!----></div> <div class="space-y-1"><p class="font-medium">No people yet</p> <p class="text-muted-foreground text-sm">Add the people you work and collaborate with.</p></div> `);
										Button($$renderer, {
											onclick: () => addOpen = true,
											children: ($$renderer) => {
												Plus($$renderer, { class: "size-4" });
												$$renderer.push(`<!----> Add a person`);
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
				$$renderer.push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				const each_array = ensure_array_like(data.humans);
				for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
					let human = each_array[$$index_1];
					if (Card) {
						$$renderer.push("<!--[-->");
						Card($$renderer, {
							class: "group",
							children: ($$renderer) => {
								if (Card_header) {
									$$renderer.push("<!--[-->");
									Card_header($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<div class="flex items-center gap-3"><div class="bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-medium">${escape_html(initials(human.username))}</div> `);
											if (Card_title) {
												$$renderer.push("<!--[-->");
												Card_title($$renderer, {
													class: "flex-1 truncate",
													children: ($$renderer) => {
														$$renderer.push(`<!---->${escape_html(human.username)}`);
													},
													$$slots: { default: true }
												});
												$$renderer.push("<!--]-->");
											} else {
												$$renderer.push("<!--[!-->");
												$$renderer.push("<!--]-->");
											}
											$$renderer.push(` <div class="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">`);
											Button($$renderer, {
												type: "button",
												variant: "ghost",
												size: "icon-sm",
												"aria-label": "Edit person",
												class: "text-muted-foreground hover:text-foreground",
												onclick: () => openEdit(human),
												children: ($$renderer) => {
													Pencil($$renderer, { class: "size-4" });
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", human.id)}/> `);
											Button($$renderer, {
												type: "submit",
												variant: "ghost",
												size: "icon-sm",
												"aria-label": "Delete person",
												class: "text-muted-foreground hover:text-destructive",
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
								$$renderer.push(` `);
								if (Card_content) {
									$$renderer.push("<!--[-->");
									Card_content($$renderer, {
										children: ($$renderer) => {
											if (contactRows(human).length > 0) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<ul class="flex flex-col gap-2 text-sm"><!--[-->`);
												const each_array_1 = ensure_array_like(contactRows(human));
												for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
													let row = each_array_1[$$index];
													const Icon = row.icon;
													$$renderer.push(`<li class="flex items-center gap-2">`);
													if (Icon) {
														$$renderer.push("<!--[-->");
														Icon($$renderer, { class: "text-muted-foreground size-4 shrink-0" });
														$$renderer.push("<!--]-->");
													} else {
														$$renderer.push("<!--[!-->");
														$$renderer.push("<!--]-->");
													}
													$$renderer.push(` <span${attr_class(`truncate ${row.kind === "evm" ? "font-mono text-xs" : ""}`)}>${escape_html(row.label)}</span></li>`);
												}
												$$renderer.push(`<!--]--></ul>`);
											} else {
												$$renderer.push("<!--[-1-->");
												$$renderer.push(`<p class="text-muted-foreground text-sm">No contact details yet.</p>`);
											}
											$$renderer.push(`<!--]--> `);
											if (human.notes) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<p class="text-muted-foreground mt-3 border-t pt-3 text-sm whitespace-pre-wrap">${escape_html(human.notes)}</p>`);
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
//# sourceMappingURL=_page.svelte.js-BvPXW8Md.js.map
