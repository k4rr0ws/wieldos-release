import { a1 as head, a9 as escape_html, a3 as spread_props, a7 as attr_class, a0 as attr, _ as ensure_array_like, T as derived } from '../../../chunks/server.js-BeDXxHyW.js';
import { B as Button, I as Icon } from '../../../chunks/button.js-BKCc13Pl.js';
import { T as Triangle_alert } from '../../../chunks/triangle-alert.js-D5mtn1DL.js';
import { D as Dialog, b as Dialog_content, c as Dialog_header, e as Dialog_title, f as Dialog_description, d as Dialog_footer } from '../../../chunks/dialog.js-BiupuAC8.js';
import '../../../chunks/client.js-C3bkgsj6.js';
import { D as Database } from '../../../chunks/database.js-C4gk-2uV.js';
import { H as Heart_pulse } from '../../../chunks/heart-pulse.js-Dl7DSqsu.js';
import { C as Card, a as Card_header, c as Card_title, b as Card_description, f as Card_content } from '../../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../chunks/page-header.js-Bo0OtOYz.js';
import { b as formatRelative } from '../../../chunks/datetime.js-DS-g6TQJ.js';
import { T as Timer } from '../../../chunks/timer.js-CkKaJpeW.js';
import { S as Sparkles } from '../../../chunks/sparkles.js-Bj0hSY7a.js';
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
import '../../../chunks/internal2.js-3fvE3IOr.js';
import '../../../chunks/utils.js-UusfKV9V.js';

//#region node_modules/@lucide/svelte/dist/icons/download.svelte
function Download($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "download" },
		props,
		{ iconNode: [
			["path", { "d": "M12 15V3" }],
			["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
			["path", { "d": "m7 10 5 5 5-5" }]
		] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/upload.svelte
function Upload($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "upload" },
		props,
		{ iconNode: [
			["path", { "d": "M12 3v12" }],
			["path", { "d": "m17 8-5-5-5 5" }],
			["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }]
		] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/file-braces.svelte
function File_braces($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "file-braces" },
		props,
		{ iconNode: [
			["path", { "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" }],
			["path", { "d": "M14 2v5a1 1 0 0 0 1 1h5" }],
			["path", { "d": "M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1" }],
			["path", { "d": "M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1" }]
		] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/database-backup.svelte
function Database_backup($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "database-backup" },
		props,
		{ iconNode: [
			["ellipse", {
				"cx": "12",
				"cy": "5",
				"rx": "9",
				"ry": "3"
			}],
			["path", { "d": "M3 12a9 3 0 0 0 5 2.69" }],
			["path", { "d": "M21 9.3V5" }],
			["path", { "d": "M3 5v14a9 3 0 0 0 6.47 2.88" }],
			["path", { "d": "M12 12v4h4" }],
			["path", { "d": "M13 20a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L12 16" }]
		] }
	]));
}
//#endregion
//#region src/lib/components/data-backup.svelte
function Data_backup($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let confirmOpen = false;
		let fileName = "";
		function submitImport() {
			confirmOpen = false;
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
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
											class: "flex items-center gap-2",
											children: ($$renderer) => {
												Database_backup($$renderer, { class: "size-4" });
												$$renderer.push(`<!----> Backup &amp; restore`);
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(` `);
									if (Card_description) {
										$$renderer.push("<!--[-->");
										Card_description($$renderer, {
											children: ($$renderer) => {
												$$renderer.push(`<!---->Download a full backup, or restore by replacing all current data.`);
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
								class: "grid gap-6",
								children: ($$renderer) => {
									$$renderer.push(`<div class="grid gap-2"><p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Backup</p> <div class="flex flex-wrap gap-2">`);
									Button($$renderer, {
										href: "/status/backup?format=sqlite",
										download: true,
										variant: "outline",
										size: "sm",
										children: ($$renderer) => {
											Download($$renderer, { class: "size-4" });
											$$renderer.push(`<!----> SQLite snapshot`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Button($$renderer, {
										href: "/status/backup?format=json",
										download: true,
										variant: "outline",
										size: "sm",
										children: ($$renderer) => {
											File_braces($$renderer, { class: "size-4" });
											$$renderer.push(`<!----> JSON export`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div></div> <div class="grid gap-2 border-t pt-4"><p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Restore</p> <form method="POST" action="?/importData" enctype="multipart/form-data" class="flex flex-wrap items-center gap-2"><input type="file" name="file" accept=".sqlite,.db,.json" class="text-muted-foreground file:bg-muted file:text-foreground hover:file:bg-muted/70 max-w-full text-sm file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:px-3 file:py-1.5 file:text-sm file:font-medium"/> `);
									Button($$renderer, {
										type: "button",
										variant: "destructive",
										size: "sm",
										disabled: true,
										onclick: () => confirmOpen = true,
										children: ($$renderer) => {
											Upload($$renderer, { class: "size-4" });
											$$renderer.push(`<!----> ${escape_html("Import & replace")}`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></form> <p class="text-muted-foreground text-xs">Accepts a <span class="font-mono">.sqlite</span> snapshot or a <span class="font-mono">.json</span> export. Importing overwrites everything currently stored.</p> `);
									$$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></div>`);
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
						return confirmOpen;
					},
					set open($$value) {
						confirmOpen = $$value;
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
														class: "flex items-center gap-2",
														children: ($$renderer) => {
															Triangle_alert($$renderer, { class: "text-destructive size-4" });
															$$renderer.push(`<!----> Replace all data?`);
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
															$$renderer.push(`<!---->Importing <span class="font-medium">${escape_html(fileName)}</span> will delete all current records and replace
				them with the backup’s contents. This cannot be undone.`);
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
									if (Dialog_footer) {
										$$renderer.push("<!--[-->");
										Dialog_footer($$renderer, {
											children: ($$renderer) => {
												Button($$renderer, {
													variant: "outline",
													size: "sm",
													onclick: () => confirmOpen = false,
													children: ($$renderer) => {
														$$renderer.push(`<!---->Cancel`);
													},
													$$slots: { default: true }
												});
												$$renderer.push(`<!----> `);
												Button($$renderer, {
													variant: "destructive",
													size: "sm",
													onclick: submitImport,
													children: ($$renderer) => {
														$$renderer.push(`<!---->Replace data`);
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
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/cpu.svelte
function Cpu($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "cpu" },
		props,
		{ iconNode: [
			["path", { "d": "M12 20v2" }],
			["path", { "d": "M12 2v2" }],
			["path", { "d": "M17 20v2" }],
			["path", { "d": "M17 2v2" }],
			["path", { "d": "M2 12h2" }],
			["path", { "d": "M2 17h2" }],
			["path", { "d": "M2 7h2" }],
			["path", { "d": "M20 12h2" }],
			["path", { "d": "M20 17h2" }],
			["path", { "d": "M20 7h2" }],
			["path", { "d": "M7 20v2" }],
			["path", { "d": "M7 2v2" }],
			["rect", {
				"x": "4",
				"y": "4",
				"width": "16",
				"height": "16",
				"rx": "2"
			}],
			["rect", {
				"x": "8",
				"y": "8",
				"width": "8",
				"height": "8",
				"rx": "1"
			}]
		] }
	]));
}
//#endregion
//#region src/routes/status/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const compact = new Intl.NumberFormat("en-US", {
			notation: "compact",
			maximumFractionDigits: 1
		});
		const num = (n) => compact.format(Number(n) || 0);
		function humanBytes(bytes) {
			let value = Number(bytes) || 0;
			if (value < 1024) return `${value} B`;
			const units = [
				"KB",
				"MB",
				"GB",
				"TB"
			];
			let i = -1;
			do {
				value /= 1024;
				i++;
			} while (value >= 1024 && i < units.length - 1);
			return `${value.toFixed(1)} ${units[i]}`;
		}
		function humanUptime(seconds) {
			const s = Math.max(0, Math.round(Number(seconds) || 0));
			const d = Math.floor(s / 86400);
			const h = Math.floor(s % 86400 / 3600);
			const m = Math.floor(s % 3600 / 60);
			const parts = [];
			if (d) parts.push(`${d}d`);
			if (h) parts.push(`${h}h`);
			parts.push(`${m}m`);
			return parts.join(" ");
		}
		const sched = derived(() => data.scheduler);
		const schedStatus = derived(() => sched().status === "running" ? {
			label: "Running",
			variant: "secondary"
		} : sched().status === "disabled" ? {
			label: "Disabled",
			variant: "outline"
		} : {
			label: "Unknown",
			variant: "outline"
		});
		const intervalMin = derived(() => sched().intervalMs ? Math.round(sched().intervalMs / 6e4) : null);
		const totalRows = derived(() => Object.values(data.counts).reduce((sum, n) => sum + (Number(n) || 0), 0));
		const countEntries = derived(() => Object.entries(data.counts).sort((a, b) => (Number(b[1]) || 0) - (Number(a[1]) || 0)));
		head("1xd49a3", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Status · WieldOS</title>`);
			});
		});
		Page_header($$renderer, {
			title: "Status",
			description: "System, database, and scheduler health",
			icon: Heart_pulse
		});
		$$renderer.push(`<!----> <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">`);
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
										class: "flex items-center justify-between gap-2 text-base",
										children: ($$renderer) => {
											$$renderer.push(`<span class="flex items-center gap-2">`);
											Timer($$renderer, { class: "size-4" });
											$$renderer.push(`<!----> Scheduler</span> `);
											Badge($$renderer, {
												variant: schedStatus().variant,
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(schedStatus().label)}`);
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
					$$renderer.push(` `);
					if (Card_content) {
						$$renderer.push("<!--[-->");
						Card_content($$renderer, {
							class: "text-sm",
							children: ($$renderer) => {
								$$renderer.push(`<dl class="grid grid-cols-2 gap-y-2"><dt class="text-muted-foreground">Interval</dt> <dd class="text-right">${escape_html(intervalMin() ? `${intervalMin()} min` : "—")}</dd> <dt class="text-muted-foreground">Last tick</dt> <dd class="text-right">${escape_html(sched().lastTickAt ? formatRelative(sched().lastTickAt) : "never")}</dd> <dt class="text-muted-foreground">Ticks (24h)</dt> <dd class="text-right">${escape_html(num(sched().ticks24h))}</dd> <dt class="text-muted-foreground">Errors (24h)</dt> <dd${attr_class(`text-right ${sched().errors24h ? "text-destructive" : ""}`)}>${escape_html(num(sched().errors24h))}</dd></dl> `);
								if (sched().disabledReason) {
									$$renderer.push("<!--[0-->");
									$$renderer.push(`<p class="text-muted-foreground mt-3 text-xs">Disabled: ${escape_html(sched().disabledReason)}</p>`);
								} else $$renderer.push("<!--[-1-->");
								$$renderer.push(`<!--]--> `);
								if (sched().lastError?.message) {
									$$renderer.push("<!--[0-->");
									$$renderer.push(`<p class="text-destructive mt-3 flex items-start gap-1.5 text-xs">`);
									Triangle_alert($$renderer, { class: "mt-0.5 size-3.5 shrink-0" });
									$$renderer.push(`<!----> <span class="break-words">${escape_html(sched().lastError.message)}</span></p>`);
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
					if (Card_header) {
						$$renderer.push("<!--[-->");
						Card_header($$renderer, {
							children: ($$renderer) => {
								if (Card_title) {
									$$renderer.push("<!--[-->");
									Card_title($$renderer, {
										class: "flex items-center gap-2 text-base",
										children: ($$renderer) => {
											Database($$renderer, { class: "size-4" });
											$$renderer.push(`<!----> Database`);
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
							class: "text-sm",
							children: ($$renderer) => {
								$$renderer.push(`<dl class="grid grid-cols-2 gap-y-2"><dt class="text-muted-foreground">Size on disk</dt> <dd class="text-right">${escape_html(humanBytes(data.db.sizeBytes))}</dd> <dt class="text-muted-foreground">Total rows</dt> <dd class="text-right">${escape_html(num(totalRows()))}</dd> <dt class="text-muted-foreground">Tables</dt> <dd class="text-right">${escape_html(countEntries().length)}</dd> <dt class="text-muted-foreground">Journal</dt> <dd class="text-right">${escape_html(data.db.walMode ? "WAL" : "default")}</dd></dl> <p class="text-muted-foreground mt-3 truncate font-mono text-xs"${attr("title", data.db.path)}>${escape_html(data.db.path)}</p>`);
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
					if (Card_header) {
						$$renderer.push("<!--[-->");
						Card_header($$renderer, {
							children: ($$renderer) => {
								if (Card_title) {
									$$renderer.push("<!--[-->");
									Card_title($$renderer, {
										class: "flex items-center gap-2 text-base",
										children: ($$renderer) => {
											Cpu($$renderer, { class: "size-4" });
											$$renderer.push(`<!----> Runtime`);
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
							class: "text-sm",
							children: ($$renderer) => {
								$$renderer.push(`<dl class="grid grid-cols-2 gap-y-2"><dt class="text-muted-foreground">Node</dt> <dd class="text-right font-mono text-xs">${escape_html(data.runtime.node)}</dd> <dt class="text-muted-foreground">Uptime</dt> <dd class="text-right">${escape_html(humanUptime(data.runtime.uptimeSec))}</dd> <dt class="text-muted-foreground">Platform</dt> <dd class="text-right font-mono text-xs">${escape_html(data.runtime.platform)}</dd> <dt class="text-muted-foreground">AI</dt> <dd class="text-right"><span class="inline-flex items-center gap-1">`);
								Sparkles($$renderer, { class: "size-3.5" });
								$$renderer.push(`<!----> ${escape_html(data.ai.configured ? data.ai.model : "not configured")}</span></dd></dl>`);
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
		$$renderer.push(`</div> `);
		Data_backup($$renderer);
		$$renderer.push(`<!----> `);
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
								if (Card_description) {
									$$renderer.push("<!--[-->");
									Card_description($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<!---->Row counts per table.`);
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
							children: ($$renderer) => {
								$$renderer.push(`<div class="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3 lg:grid-cols-4"><!--[-->`);
								const each_array = ensure_array_like(countEntries());
								for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
									let [table, count] = each_array[$$index];
									$$renderer.push(`<div class="flex items-baseline justify-between gap-2 border-b py-1"><span class="text-muted-foreground truncate font-mono text-xs"${attr("title", table)}>${escape_html(table)}</span> <span class="text-sm font-medium tabular-nums">${escape_html(num(count))}</span></div>`);
								}
								$$renderer.push(`<!--]--></div>`);
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
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-23v4jC4h.js.map
