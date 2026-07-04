import { a1 as head, _ as ensure_array_like, a9 as escape_html, a0 as attr, a3 as spread_props } from '../../../chunks/server.js-BeDXxHyW.js';
import { B as Button, I as Icon } from '../../../chunks/button.js-BKCc13Pl.js';
import { L as Loader_circle } from '../../../chunks/loader-circle.js-7ssjm3Rp.js';
import { X } from '../../../chunks/x.js-Q2Bhqwn4.js';
import '../../../chunks/client.js-C3bkgsj6.js';
import { I as Inbox } from '../../../chunks/inbox.js-BrajTkm6.js';
import { C as Card, f as Card_content } from '../../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../chunks/page-header.js-Bo0OtOYz.js';
import { b as formatRelative } from '../../../chunks/datetime.js-DS-g6TQJ.js';
import { A as Arrow_up_right } from '../../../chunks/arrow-up-right.js-DiQMgjIG.js';
import { C as Check } from '../../../chunks/check.js-DucKGNns.js';
import '../../../chunks/shared.js-CgP5r6wP.js';
import '../../../chunks/exports.js-Y2Zp5fEj.js';
import '../../../chunks/internal2.js-3fvE3IOr.js';
import '../../../chunks/index-server.js-YgGoPwWh.js';
import '../../../chunks/chunk.js-BBx_TEkp.js';
import '../../../chunks/utils.js-UusfKV9V.js';

//#region node_modules/@lucide/svelte/dist/icons/check-check.svelte
function Check_check($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "check-check" },
		props,
		{ iconNode: [["path", { "d": "M18 6 7 17l-5-5" }], ["path", { "d": "m22 10-7.5 7.5L13 16" }]] }
	]));
}
//#endregion
//#region src/routes/inbox/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let busyId = null;
		let approvingAll = false;
		head("9rszxv", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Inbox · WieldOS</title>`);
			});
		});
		Page_header($$renderer, {
			icon: Inbox,
			title: "Inbox",
			description: "Staged agent actions awaiting your approval",
			children: ($$renderer) => {
				Button($$renderer, {
					size: "sm",
					variant: "outline",
					href: "/activity",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Activity `);
						Arrow_up_right($$renderer, { class: "size-4" });
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				if (data.pending.length > 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<form method="POST" action="?/approveAll">`);
					Button($$renderer, {
						type: "submit",
						size: "sm",
						disabled: approvingAll,
						children: ($$renderer) => {
							$$renderer.push("<!--[-1-->");
							Check_check($$renderer, { class: "size-4" });
							$$renderer.push(`<!----> Approve all (${escape_html(data.stagedTotal)})`);
							$$renderer.push(`<!--]-->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></form>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			}});
		$$renderer.push(`<!----> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (data.pending.length === 0) {
			$$renderer.push("<!--[0-->");
			if (Card) {
				$$renderer.push("<!--[-->");
				Card($$renderer, {
					class: "border-dashed",
					children: ($$renderer) => {
						if (Card_content) {
							$$renderer.push("<!--[-->");
							Card_content($$renderer, {
								class: "text-muted-foreground flex flex-col items-center gap-2 py-16 text-center text-sm",
								children: ($$renderer) => {
									Inbox($$renderer, { class: "size-8 opacity-50" });
									$$renderer.push(`<!----> <p class="text-foreground font-medium">Inbox zero</p> <p>No actions are waiting. When an agent run stages writes, they’ll appear here for approval.</p>`);
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
			$$renderer.push(`<div class="grid gap-3"><!--[-->`);
			const each_array = ensure_array_like(data.pending);
			for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
				let run = each_array[$$index_1];
				if (Card) {
					$$renderer.push("<!--[-->");
					Card($$renderer, {
						children: ($$renderer) => {
							if (Card_content) {
								$$renderer.push("<!--[-->");
								Card_content($$renderer, {
									class: "space-y-3 py-4",
									children: ($$renderer) => {
										$$renderer.push(`<div class="flex items-start justify-between gap-3"><div class="space-y-0.5"><a${attr("href", `/agents/${run.agentId}`)} class="text-sm font-medium hover:underline">${escape_html(run.agentName ?? `Agent #${run.agentId}`)}</a> `);
										if (run.objective) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<p class="text-muted-foreground text-xs">${escape_html(run.objective)}</p>`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--></div> <span class="text-muted-foreground shrink-0 text-xs">${escape_html(formatRelative(run.createdAt))}</span></div> `);
										if (run.summary) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<p class="text-muted-foreground text-sm whitespace-pre-wrap">${escape_html(run.summary)}</p>`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> <div class="flex flex-wrap items-center gap-1.5">`);
										if (run.error) {
											$$renderer.push("<!--[0-->");
											Badge($$renderer, {
												variant: "destructive",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Stopped early`);
												},
												$$slots: { default: true }
											});
										} else if (run.truncated) {
											$$renderer.push("<!--[1-->");
											Badge($$renderer, {
												variant: "secondary",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Truncated`);
												},
												$$slots: { default: true }
											});
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> `);
										Badge($$renderer, {
											variant: "outline",
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(run.stagedCount)} staged`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										Badge($$renderer, {
											variant: "ghost",
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(run.steps)} step${escape_html(run.steps === 1 ? "" : "s")}`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----></div> <ul class="text-muted-foreground list-disc space-y-0.5 pl-5 text-xs"><!--[-->`);
										const each_array_1 = ensure_array_like(run.staged);
										for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
											let action = each_array_1[i];
											$$renderer.push(`<li>${escape_html(action.summary)}</li>`);
										}
										$$renderer.push(`<!--]--></ul> <div class="flex items-center justify-end gap-2 pt-1"><form method="POST" action="?/deny"><input type="hidden" name="id"${attr("value", run.id)}/> <input type="hidden" name="agentId"${attr("value", run.agentId)}/> `);
										Button($$renderer, {
											type: "submit",
											variant: "outline",
											size: "sm",
											disabled: busyId === run.id,
											children: ($$renderer) => {
												X($$renderer, { class: "size-4" });
												$$renderer.push(`<!----> Deny`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----></form> <form method="POST" action="?/approve"><input type="hidden" name="actions"${attr("value", JSON.stringify(run.staged))}/> <input type="hidden" name="agentId"${attr("value", run.agentId)}/> <input type="hidden" name="objective"${attr("value", run.objective ?? "")}/> <input type="hidden" name="dispatchId"${attr("value", run.dispatchId ?? "")}/> `);
										Button($$renderer, {
											type: "submit",
											size: "sm",
											disabled: busyId === run.id,
											children: ($$renderer) => {
												if (busyId === run.id) {
													$$renderer.push("<!--[0-->");
													Loader_circle($$renderer, { class: "size-4 animate-spin" });
													$$renderer.push(`<!----> Running…`);
												} else {
													$$renderer.push("<!--[-1-->");
													Check($$renderer, { class: "size-4" });
													$$renderer.push(`<!----> Approve &amp; run ${escape_html(run.stagedCount)}`);
												}
												$$renderer.push(`<!--]-->`);
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
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]-->`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-C9hH3FS2.js.map
