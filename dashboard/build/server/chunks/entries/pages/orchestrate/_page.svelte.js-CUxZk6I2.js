import { a1 as head, T as derived, a9 as escape_html, _ as ensure_array_like, a0 as attr } from '../../../chunks/server.js-BeDXxHyW.js';
import { B as Button } from '../../../chunks/button.js-BKCc13Pl.js';
import { T as Triangle_alert } from '../../../chunks/triangle-alert.js-D5mtn1DL.js';
import { S as Separator } from '../../../chunks/separator.js-DXXH6IUo.js';
import '../../../chunks/client.js-u-B9u8_c.js';
import { W as Workflow } from '../../../chunks/workflow.js-CmUS5mTC.js';
import { F as File_text } from '../../../chunks/file-text.js-LRQpmmf4.js';
import { C as Card, a as Card_header, f as Card_content, e as Card_footer, c as Card_title, b as Card_description } from '../../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../chunks/page-header.js-Bo0OtOYz.js';
import { b as formatRelative } from '../../../chunks/datetime.js-DS-g6TQJ.js';
import { A as Arrow_up_right } from '../../../chunks/arrow-up-right.js-DiQMgjIG.js';
import { T as Textarea } from '../../../chunks/textarea.js-OJ5frhCS.js';
import { S as Sparkles } from '../../../chunks/sparkles.js-Bj0hSY7a.js';
import { R as Rocket } from '../../../chunks/rocket.js-Bpyh89z6.js';
import '../../../chunks/shared.js-CgP5r6wP.js';
import '../../../chunks/create-id.js-BN8YEFln.js';
import '../../../chunks/palette.js-BPVUdeAc.js';
import '../../../chunks/index-server2.js-UaiofxX-.js';
import '../../../chunks/exports.js-Y2Zp5fEj.js';
import '../../../chunks/internal2.js-0xtVfVtb.js';
import '../../../chunks/index-server.js-YgGoPwWh.js';
import '../../../chunks/chunk.js-BBx_TEkp.js';
import '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/orchestrate/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let goal = "";
		let running = false;
		const recipes = [
			{
				label: "Launch monitor",
				goal: "Launch an X campaign: have your research agent scan X and the web for current trends, competing projects, and sentiment on the topic; have your narrative agent draft positioning and a launch thread grounded in that research and save it as a deliverable; then set up a standing X monitor for replies and mentions of the campaign so we catch responses as they come in."
			},
			{
				label: "Ecosystem report",
				goal: "Survey the ecosystem across web, on-chain, and X, and produce a single sourced intelligence report as a deliverable with concrete, prioritized opportunities."
			},
			{
				label: "Weekly plan",
				goal: "Review my open tasks and goals, then draft a prioritized plan for the week and stage the missing follow-up tasks."
			}
		];
		const plan = derived(() => form?.planned ?? null);
		const ran = derived(() => form?.ran ?? null);
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("zpqfcj", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Orchestrate · WieldOS</title>`);
				});
			});
			Page_header($$renderer, {
				title: "Orchestrate",
				description: "Hand a goal to the agency — it decomposes the work and routes each step to the right agent",
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
				}});
			$$renderer.push(`<!----> `);
			if (!data.aiReady) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-muted-foreground flex items-center gap-2 rounded-lg border border-dashed px-4 py-3 text-sm">`);
				Triangle_alert($$renderer, { class: "size-4 shrink-0" });
				$$renderer.push(`<!----> <span>Set <code class="text-xs">ANTHROPIC_API_KEY</code> to enable orchestration.</span></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
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
												Workflow($$renderer, { class: "text-muted-foreground size-4" });
												$$renderer.push(`<!----> Delegate a goal`);
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
												$$renderer.push(`<!---->${escape_html(data.agents.length)} active agent${escape_html(data.agents.length === 1 ? "" : "s")} available. The plan is proposed for your approval before anything runs.`);
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
									$$renderer.push(`<div class="mb-3 flex flex-wrap items-center gap-2"><span class="text-muted-foreground text-xs">Recipes:</span> <!--[-->`);
									const each_array = ensure_array_like(recipes);
									for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
										let recipe = each_array[$$index];
										Button($$renderer, {
											type: "button",
											variant: "outline",
											size: "sm",
											onclick: () => goal = recipe.goal,
											disabled: !data.aiReady,
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(recipe.label)}`);
											},
											$$slots: { default: true }
										});
									}
									$$renderer.push(`<!--]--></div> <form method="POST" action="?/plan" class="flex flex-col gap-3">`);
									Textarea($$renderer, {
										name: "goal",
										rows: 3,
										placeholder: "e.g. Research competing PulseChain farms, then draft an EMIT positioning thread and a launch checklist.",
										disabled: !data.aiReady,
										get value() {
											return goal;
										},
										set value($$value) {
											goal = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----> `);
									if (form?.message) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<p class="text-destructive text-sm">${escape_html(form.message)}</p>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> <div class="flex justify-end">`);
									Button($$renderer, {
										type: "submit",
										disabled: !goal.trim() || !data.aiReady,
										children: ($$renderer) => {
											$$renderer.push("<!--[-1-->");
											Sparkles($$renderer, { class: "size-4" });
											$$renderer.push(`<!----> Propose plan`);
											$$renderer.push(`<!--]-->`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div></form>`);
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
			if (plan()) {
				$$renderer.push("<!--[0-->");
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
												children: ($$renderer) => {
													$$renderer.push(`<!---->Proposed plan`);
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
													$$renderer.push(`<!---->${escape_html(plan().goal)}`);
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
									class: "flex flex-col gap-1",
									children: ($$renderer) => {
										$$renderer.push(`<!--[-->`);
										const each_array_1 = ensure_array_like(plan().steps);
										for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
											let step = each_array_1[i];
											if (i > 0) {
												$$renderer.push("<!--[0-->");
												Separator($$renderer, {});
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--> <div class="flex items-start gap-3 py-2.5"><span class="bg-muted text-muted-foreground mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">${escape_html(i + 1)}</span> <div class="flex-1 space-y-1">`);
											Badge($$renderer, {
												variant: "secondary",
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(step.agentName)}`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> <p class="text-sm">${escape_html(step.objective)}</p> `);
											if (step.rationale) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<p class="text-muted-foreground text-xs italic">${escape_html(step.rationale)}</p>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div></div>`);
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
							if (Card_footer) {
								$$renderer.push("<!--[-->");
								Card_footer($$renderer, {
									class: "justify-between",
									children: ($$renderer) => {
										$$renderer.push(`<p class="text-muted-foreground text-xs">Deliverables are saved automatically so later steps can build on them; other actions stage for approval.</p> <form method="POST" action="?/run"><input type="hidden" name="goal"${attr("value", plan().goal)}/> <input type="hidden" name="steps"${attr("value", JSON.stringify(plan().steps))}/> `);
										Button($$renderer, {
											type: "submit",
											disabled: running,
											children: ($$renderer) => {
												$$renderer.push("<!--[-1-->");
												Rocket($$renderer, { class: "size-4" });
												$$renderer.push(`<!----> Approve &amp; run ${escape_html(plan().steps.length)} step${escape_html(plan().steps.length === 1 ? "" : "s")}`);
												$$renderer.push(`<!--]-->`);
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
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (ran()) {
				$$renderer.push("<!--[0-->");
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
												children: ($$renderer) => {
													$$renderer.push(`<!---->Run results`);
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
													$$renderer.push(`<!---->${escape_html(ran().goal)}`);
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
									class: "flex flex-col gap-1",
									children: ($$renderer) => {
										$$renderer.push(`<!--[-->`);
										const each_array_2 = ensure_array_like(ran().steps);
										for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
											let step = each_array_2[i];
											if (i > 0) {
												$$renderer.push("<!--[0-->");
												Separator($$renderer, {});
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--> <div class="flex flex-col gap-1 py-2.5"><div class="flex flex-wrap items-center gap-2">`);
											Badge($$renderer, {
												variant: "secondary",
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(step.agentName)}`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											if (step.error) {
												$$renderer.push("<!--[0-->");
												Badge($$renderer, {
													variant: "destructive",
													class: "text-[10px]",
													children: ($$renderer) => {
														$$renderer.push(`<!---->Failed`);
													},
													$$slots: { default: true }
												});
											} else {
												$$renderer.push("<!--[-1-->");
												if (step.committed > 0) {
													$$renderer.push("<!--[0-->");
													Badge($$renderer, {
														class: "text-[10px]",
														children: ($$renderer) => {
															$$renderer.push(`<!---->${escape_html(step.committed)} deliverable${escape_html(step.committed === 1 ? "" : "s")}`);
														},
														$$slots: { default: true }
													});
												} else $$renderer.push("<!--[-1-->");
												$$renderer.push(`<!--]--> `);
												if (step.staged > 0) {
													$$renderer.push("<!--[0-->");
													Badge($$renderer, {
														variant: "outline",
														class: "text-[10px]",
														children: ($$renderer) => {
															$$renderer.push(`<!---->${escape_html(step.staged)} staged`);
														},
														$$slots: { default: true }
													});
												} else $$renderer.push("<!--[-1-->");
												$$renderer.push(`<!--]--> `);
												if (!step.committed && !step.staged) {
													$$renderer.push("<!--[0-->");
													Badge($$renderer, {
														variant: "outline",
														class: "text-[10px]",
														children: ($$renderer) => {
															$$renderer.push(`<!---->No writes`);
														},
														$$slots: { default: true }
													});
												} else $$renderer.push("<!--[-1-->");
												$$renderer.push(`<!--]-->`);
											}
											$$renderer.push(`<!--]--> <a${attr("href", `/agents/${step.agentId}`)} class="text-muted-foreground ml-auto inline-flex items-center gap-1 text-xs hover:underline">Review `);
											Arrow_up_right($$renderer, { class: "size-3" });
											$$renderer.push(`<!----></a></div> <p class="text-muted-foreground text-sm">${escape_html(step.error ?? step.summary ?? "—")}</p> `);
											if (step.deliverables?.length) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<div class="flex flex-wrap gap-x-3 gap-y-1 pt-0.5"><!--[-->`);
												const each_array_3 = ensure_array_like(step.deliverables);
												for (let $$index_2 = 0, $$length = each_array_3.length; $$index_2 < $$length; $$index_2++) {
													let d = each_array_3[$$index_2];
													$$renderer.push(`<a${attr("href", `/deliverables/${d.id}`)} class="text-primary inline-flex items-center gap-1 text-xs hover:underline">`);
													File_text($$renderer, { class: "size-3" });
													$$renderer.push(`<!----> ${escape_html(d.title)}</a>`);
												}
												$$renderer.push(`<!--]--></div>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div>`);
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
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
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
											children: ($$renderer) => {
												$$renderer.push(`<!---->Recent workflows`);
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
												$$renderer.push(`<!---->Past orchestrations`);
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
								class: "flex flex-col gap-1",
								children: ($$renderer) => {
									const each_array_4 = ensure_array_like(data.recent);
									if (each_array_4.length !== 0) {
										$$renderer.push("<!--[-->");
										for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
											let o = each_array_4[$$index_4];
											$$renderer.push(`<div class="flex items-center gap-3 py-2"><span class="flex-1 text-sm">${escape_html(o.goal)}</span> `);
											Badge($$renderer, {
												variant: "outline",
												class: "text-[10px]",
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(o.steps.length)} step${escape_html(o.steps.length === 1 ? "" : "s")}`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> <span class="text-muted-foreground text-xs">${escape_html(formatRelative(o.createdAt))}</span></div>`);
										}
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push(`<p class="text-muted-foreground py-8 text-center text-sm">No workflows yet. Delegate a goal above.</p>`);
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
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-CUxZk6I2.js.map
