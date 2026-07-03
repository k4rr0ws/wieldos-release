import { a1 as head, _ as ensure_array_like, T as derived, a9 as escape_html, a3 as spread_props, a0 as attr, a7 as attr_class } from '../../../chunks/server.js-BeDXxHyW.js';
import { B as Button, I as Icon } from '../../../chunks/button.js-BKCc13Pl.js';
import { I as Input } from '../../../chunks/input.js-VxJyhIEJ.js';
import { D as Dialog, a as Dialog_trigger, b as Dialog_content, c as Dialog_header, e as Dialog_title, f as Dialog_description, d as Dialog_footer } from '../../../chunks/dialog.js-BiupuAC8.js';
import { L as Label } from '../../../chunks/label.js-C7a3GAk3.js';
import '../../../chunks/client.js-BHHES_V7.js';
import { C as Calendar_days } from '../../../chunks/calendar-days.js-DJ_3FQbv.js';
import { C as Card, f as Card_content, a as Card_header, c as Card_title } from '../../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../chunks/page-header.js-Bo0OtOYz.js';
import { l as localDateString, c as formatDay, f as formatTime } from '../../../chunks/datetime.js-DS-g6TQJ.js';
import { P as Plus } from '../../../chunks/plus.js-BImBz3Qf.js';
import { N as Native_select } from '../../../chunks/native-select.js-BcwRQfN8.js';
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

//#region node_modules/@lucide/svelte/dist/icons/calendar-plus.svelte
function Calendar_plus($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "calendar-plus" },
		props,
		{ iconNode: [
			["path", { "d": "M16 19h6" }],
			["path", { "d": "M16 2v4" }],
			["path", { "d": "M19 16v6" }],
			["path", { "d": "M21 12.598V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5" }],
			["path", { "d": "M3 10h18" }],
			["path", { "d": "M8 2v4" }]
		] }
	]));
}
//#endregion
//#region src/routes/schedule/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let dialogOpen = false;
		let editOpen = false;
		let editEvent = null;
		const todayStr = localDateString();
		function toDateInput(iso) {
			return iso ? localDateString(new Date(iso)) : todayStr;
		}
		function toTimeInput(iso) {
			if (!iso) return "";
			const d = new Date(iso);
			return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
		}
		function openEdit(event) {
			editEvent = event;
			editOpen = true;
		}
		let now = Date.now();
		function isHappeningNow(event, nowMs) {
			const start = new Date(event.startTime).getTime();
			const end = event.endTime ? new Date(event.endTime).getTime() : start + 3600 * 1e3;
			return nowMs >= start && nowMs < end;
		}
		const categoryVariant = {
			work: "default",
			personal: "secondary",
			health: "outline",
			growth: "outline"
		};
		const groups = derived(() => {
			const map = /* @__PURE__ */ new Map();
			for (const event of data.events) {
				const key = new Date(event.startTime).toDateString();
				if (!map.has(key)) map.set(key, {
					label: formatDay(event.startTime),
					events: []
				});
				map.get(key).events.push(event);
			}
			return [...map.values()];
		});
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("19rgvlq", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Schedule · WieldOS</title>`);
				});
			});
			Page_header($$renderer, {
				title: "Schedule",
				description: "Upcoming events and time blocks",
				icon: Calendar_days,
				children: ($$renderer) => {
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
								{
									function child($$renderer, { props }) {
										Button($$renderer, spread_props([
											{ size: "sm" },
											props,
											{
												children: ($$renderer) => {
													Plus($$renderer, { class: "size-4" });
													$$renderer.push(`<!----> New event`);
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
																	$$renderer.push(`<!---->New event`);
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
																	$$renderer.push(`<!---->Block out time for what matters.`);
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
											$$renderer.push(` <form method="POST" action="?/create" class="grid gap-4"><div class="grid gap-2">`);
											Label($$renderer, {
												for: "title",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Title`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Input($$renderer, {
												id: "title",
												name: "title",
												placeholder: "Event title",
												required: true
											});
											$$renderer.push(`<!----> `);
											if (form?.message) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<p class="text-destructive text-xs">${escape_html(form.message)}</p>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
											Label($$renderer, {
												for: "date",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Date`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Input($$renderer, {
												id: "date",
												name: "date",
												type: "date",
												value: todayStr,
												required: true
											});
											$$renderer.push(`<!----></div> <div class="grid gap-2">`);
											Label($$renderer, {
												for: "category",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Category`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Native_select($$renderer, {
												id: "category",
												name: "category",
												class: "w-full",
												children: ($$renderer) => {
													$$renderer.option({ value: "work" }, ($$renderer) => {
														$$renderer.push(`Work`);
													});
													$$renderer.push(` `);
													$$renderer.option({
														value: "personal",
														selected: true
													}, ($$renderer) => {
														$$renderer.push(`Personal`);
													});
													$$renderer.push(` `);
													$$renderer.option({ value: "health" }, ($$renderer) => {
														$$renderer.push(`Health`);
													});
													$$renderer.push(` `);
													$$renderer.option({ value: "growth" }, ($$renderer) => {
														$$renderer.push(`Growth`);
													});
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></div></div> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
											Label($$renderer, {
												for: "startTime",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Start`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Input($$renderer, {
												id: "startTime",
												name: "startTime",
												type: "time",
												required: true
											});
											$$renderer.push(`<!----></div> <div class="grid gap-2">`);
											Label($$renderer, {
												for: "endTime",
												children: ($$renderer) => {
													$$renderer.push(`<!---->End`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Input($$renderer, {
												id: "endTime",
												name: "endTime",
												type: "time"
											});
											$$renderer.push(`<!----></div></div> `);
											if (Dialog_footer) {
												$$renderer.push("<!--[-->");
												Dialog_footer($$renderer, {
													children: ($$renderer) => {
														Button($$renderer, {
															type: "submit",
															children: ($$renderer) => {
																$$renderer.push(`<!---->Add event`);
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
															$$renderer.push(`<!---->Edit event`);
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
															$$renderer.push(`<!---->Update the details of this event.`);
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
									$$renderer.push(`<form method="POST" action="?/update" class="grid gap-4"><input type="hidden" name="id"${attr("value", editEvent?.id)}/> <div class="grid gap-2">`);
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
										value: editEvent?.title,
										placeholder: "Event title",
										required: true
									});
									$$renderer.push(`<!----></div> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-date",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Date`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "edit-date",
										name: "date",
										type: "date",
										value: toDateInput(editEvent?.startTime),
										required: true
									});
									$$renderer.push(`<!----></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-category",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Category`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Native_select($$renderer, {
										id: "edit-category",
										name: "category",
										value: editEvent?.category,
										class: "w-full",
										children: ($$renderer) => {
											$$renderer.option({ value: "work" }, ($$renderer) => {
												$$renderer.push(`Work`);
											});
											$$renderer.push(` `);
											$$renderer.option({ value: "personal" }, ($$renderer) => {
												$$renderer.push(`Personal`);
											});
											$$renderer.push(` `);
											$$renderer.option({ value: "health" }, ($$renderer) => {
												$$renderer.push(`Health`);
											});
											$$renderer.push(` `);
											$$renderer.option({ value: "growth" }, ($$renderer) => {
												$$renderer.push(`Growth`);
											});
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div></div> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-startTime",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Start`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "edit-startTime",
										name: "startTime",
										type: "time",
										value: toTimeInput(editEvent?.startTime),
										required: true
									});
									$$renderer.push(`<!----></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-endTime",
										children: ($$renderer) => {
											$$renderer.push(`<!---->End`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "edit-endTime",
										name: "endTime",
										type: "time",
										value: toTimeInput(editEvent?.endTime)
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
			if (data.events.length === 0) {
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
										Calendar_plus($$renderer, { class: "size-6" });
										$$renderer.push(`<!----></div> <div class="space-y-1"><p class="font-medium">Nothing scheduled</p> <p class="text-muted-foreground text-sm">Add an event to start filling your calendar.</p></div> `);
										Button($$renderer, {
											onclick: () => dialogOpen = true,
											children: ($$renderer) => {
												Plus($$renderer, { class: "size-4" });
												$$renderer.push(`<!----> Schedule something`);
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
				$$renderer.push(`<div class="flex flex-col gap-6"><!--[-->`);
				const each_array = ensure_array_like(groups());
				for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
					let group = each_array[$$index_1];
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
													class: "text-base",
													children: ($$renderer) => {
														$$renderer.push(`<!---->${escape_html(group.label)}`);
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
										class: "flex flex-col",
										children: ($$renderer) => {
											$$renderer.push(`<!--[-->`);
											const each_array_1 = ensure_array_like(group.events);
											for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
												let event = each_array_1[$$index];
												const active = isHappeningNow(event, now);
												$$renderer.push(`<div${attr_class(`group relative flex items-center gap-4 border-t py-3 pl-3 first:border-t-0 ${active ? "bg-primary/5" : ""}`)}>`);
												if (active) {
													$$renderer.push("<!--[0-->");
													$$renderer.push(`<span class="bg-primary absolute top-1/2 left-0 h-8 w-1 -translate-y-1/2 rounded-full"></span>`);
												} else $$renderer.push("<!--[-1-->");
												$$renderer.push(`<!--]--> <div${attr_class(`w-28 shrink-0 text-sm tabular-nums ${active ? "text-foreground font-medium" : "text-muted-foreground"}`)}>${escape_html(formatTime(event.startTime))}`);
												if (event.endTime) {
													$$renderer.push("<!--[0-->");
													$$renderer.push(`<span class="text-muted-foreground/60">– ${escape_html(formatTime(event.endTime))}</span>`);
												} else $$renderer.push("<!--[-1-->");
												$$renderer.push(`<!--]--></div> <div class="flex-1"><div class="flex items-center gap-2"><p class="text-sm font-medium">${escape_html(event.title)}</p> `);
												if (active) {
													$$renderer.push("<!--[0-->");
													$$renderer.push(`<span class="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide"><span class="bg-green-500 size-1.5 animate-pulse rounded-full"></span> Now</span>`);
												} else $$renderer.push("<!--[-1-->");
												$$renderer.push(`<!--]--></div> `);
												if (event.description) {
													$$renderer.push("<!--[0-->");
													$$renderer.push(`<p class="text-muted-foreground text-xs">${escape_html(event.description)}</p>`);
												} else $$renderer.push("<!--[-1-->");
												$$renderer.push(`<!--]--></div> `);
												Badge($$renderer, {
													variant: categoryVariant[event.category] ?? "secondary",
													class: "capitalize",
													children: ($$renderer) => {
														$$renderer.push(`<!---->${escape_html(event.category)}`);
													},
													$$slots: { default: true }
												});
												$$renderer.push(`<!----> <div class="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">`);
												Button($$renderer, {
													type: "button",
													variant: "ghost",
													size: "icon-sm",
													"aria-label": "Edit event",
													class: "text-muted-foreground hover:text-foreground",
													onclick: () => openEdit(event),
													children: ($$renderer) => {
														Pencil($$renderer, { class: "size-4" });
													},
													$$slots: { default: true }
												});
												$$renderer.push(`<!----> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", event.id)}/> `);
												Button($$renderer, {
													type: "submit",
													variant: "ghost",
													size: "icon-sm",
													"aria-label": "Delete event",
													class: "text-muted-foreground hover:text-destructive",
													children: ($$renderer) => {
														Trash_2($$renderer, { class: "size-4" });
													},
													$$slots: { default: true }
												});
												$$renderer.push(`<!----></form></div></div>`);
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
//# sourceMappingURL=_page.svelte.js-DqljXj5C.js.map
