import { a1 as head, a9 as escape_html, a0 as attr, T as derived, Y as bind_props, a3 as spread_props, a5 as props_id, W as attributes, _ as ensure_array_like, a6 as stringify, a7 as attr_class } from '../../../../chunks/server.js-BeDXxHyW.js';
import { S as SvelteMap } from '../../../../chunks/index-server2.js-UaiofxX-.js';
import { B as Button, c as cn, t as tv } from '../../../../chunks/button.js-BKCc13Pl.js';
import { L as Loader_circle } from '../../../../chunks/loader-circle.js-7ssjm3Rp.js';
import { T as Triangle_alert } from '../../../../chunks/triangle-alert.js-D5mtn1DL.js';
import { I as Input } from '../../../../chunks/input.js-VxJyhIEJ.js';
import { c as createId, b as boxWith, d as attachRef, m as mergeProps, a as createBitsAttrs, f as boolToEmptyStrOrUndef, w as boolToTrueOrUndef, q as boolToStr } from '../../../../chunks/create-id.js-BN8YEFln.js';
import { R as RovingFocusGroup } from '../../../../chunks/dialog-content.js-DJOVMfdX.js';
import { n as noop, C as Context, w as watch } from '../../../../chunks/noop.js-D37m5eAl.js';
import { D as Dialog, b as Dialog_content, c as Dialog_header, e as Dialog_title, f as Dialog_description, d as Dialog_footer } from '../../../../chunks/dialog.js-BiupuAC8.js';
import { L as Label } from '../../../../chunks/label.js-C7a3GAk3.js';
import { X } from '../../../../chunks/x.js-Q2Bhqwn4.js';
import '../../../../chunks/client.js-C3bkgsj6.js';
import { C as Card, a as Card_header, c as Card_title, f as Card_content, b as Card_description } from '../../../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../../../chunks/badge.js-C8dsQDqL.js';
import { b as formatRelative } from '../../../../chunks/datetime.js-DS-g6TQJ.js';
import { P as Plus } from '../../../../chunks/plus.js-BImBz3Qf.js';
import { N as Native_select } from '../../../../chunks/native-select.js-BcwRQfN8.js';
import { T as Trash_2 } from '../../../../chunks/trash-2.js-CCEbkDYU.js';
import { T as Textarea } from '../../../../chunks/textarea.js-OJ5frhCS.js';
import { A as Agent_fields } from '../../../../chunks/agent-fields.js-B-qRKaR_.js';
import { P as Pencil } from '../../../../chunks/pencil.js-DGUBFH_b.js';
import { M as Markdown } from '../../../../chunks/markdown.js-CoQQw_ZF.js';
import { A as Arrow_left } from '../../../../chunks/arrow-left.js-Ci-i4sMA.js';
import { S as Send } from '../../../../chunks/send.js-A4K4xnP_.js';
import { S as Sparkles } from '../../../../chunks/sparkles.js-Bj0hSY7a.js';
import { R as Rocket } from '../../../../chunks/rocket.js-Bpyh89z6.js';
import { C as Check } from '../../../../chunks/check.js-DucKGNns.js';
import '../../../../chunks/shared.js-CgP5r6wP.js';
import '../../../../chunks/palette.js-BPVUdeAc.js';
import '../../../../chunks/index-server.js-YgGoPwWh.js';
import '../../../../chunks/chunk.js-BBx_TEkp.js';
import '../../../../chunks/exports.js-Y2Zp5fEj.js';
import '../../../../chunks/internal2.js-3fvE3IOr.js';
import '../../../../chunks/utils.js-UusfKV9V.js';

//#region node_modules/bits-ui/dist/bits/tabs/tabs.svelte.js
var tabsAttrs = createBitsAttrs({
	component: "tabs",
	parts: [
		"root",
		"list",
		"trigger",
		"content"
	]
});
var TabsRootContext = new Context("Tabs.Root");
var TabsRootState = class TabsRootState {
	static create(opts) {
		return TabsRootContext.set(new TabsRootState(opts));
	}
	opts;
	attachment;
	rovingFocusGroup;
	triggerIds = [];
	valueToTriggerId = new SvelteMap();
	valueToContentId = new SvelteMap();
	constructor(opts) {
		this.opts = opts;
		this.attachment = attachRef(opts.ref);
		this.rovingFocusGroup = new RovingFocusGroup({
			candidateAttr: tabsAttrs.trigger,
			rootNode: this.opts.ref,
			loop: this.opts.loop,
			orientation: this.opts.orientation
		});
	}
	registerTrigger(id, value) {
		this.triggerIds.push(id);
		this.valueToTriggerId.set(value, id);
		return () => {
			this.triggerIds = this.triggerIds.filter((triggerId) => triggerId !== id);
			this.valueToTriggerId.delete(value);
		};
	}
	registerContent(id, value) {
		this.valueToContentId.set(value, id);
		return () => {
			this.valueToContentId.delete(value);
		};
	}
	setValue(v) {
		this.opts.value.current = v;
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"data-orientation": this.opts.orientation.current,
		[tabsAttrs.root]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var TabsListState = class TabsListState {
	static create(opts) {
		return new TabsListState(opts, TabsRootContext.get());
	}
	opts;
	root;
	attachment;
	#isDisabled = derived(() => this.root.opts.disabled.current);
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "tablist",
		"aria-orientation": this.root.opts.orientation.current,
		"data-orientation": this.root.opts.orientation.current,
		[tabsAttrs.list]: "",
		"data-disabled": boolToEmptyStrOrUndef(this.#isDisabled()),
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var TabsTriggerState = class TabsTriggerState {
	static create(opts) {
		return new TabsTriggerState(opts, TabsRootContext.get());
	}
	opts;
	root;
	attachment;
	#tabIndex = 0;
	#isActive = derived(() => this.root.opts.value.current === this.opts.value.current);
	#isDisabled = derived(() => this.opts.disabled.current || this.root.opts.disabled.current);
	#ariaControls = derived(() => this.root.valueToContentId.get(this.opts.value.current));
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
		watch([() => this.opts.id.current, () => this.opts.value.current], ([id, value]) => {
			return this.root.registerTrigger(id, value);
		});
		this.onfocus = this.onfocus.bind(this);
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}
	#activate() {
		if (this.root.opts.value.current === this.opts.value.current) return;
		this.root.setValue(this.opts.value.current);
	}
	onfocus(_) {
		if (this.root.opts.activationMode.current !== "automatic" || this.#isDisabled()) return;
		this.#activate();
	}
	onclick(_) {
		if (this.#isDisabled()) return;
		this.#activate();
	}
	onkeydown(e) {
		if (this.#isDisabled()) return;
		if (e.key === " " || e.key === "Enter") {
			e.preventDefault();
			this.#activate();
			return;
		}
		this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "tab",
		"data-state": getTabDataState(this.#isActive()),
		"data-value": this.opts.value.current,
		"data-orientation": this.root.opts.orientation.current,
		"data-disabled": boolToEmptyStrOrUndef(this.#isDisabled()),
		"aria-selected": boolToStr(this.#isActive()),
		"aria-controls": this.#ariaControls(),
		[tabsAttrs.trigger]: "",
		disabled: boolToTrueOrUndef(this.#isDisabled()),
		tabindex: this.#tabIndex,
		onclick: this.onclick,
		onfocus: this.onfocus,
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var TabsContentState = class TabsContentState {
	static create(opts) {
		return new TabsContentState(opts, TabsRootContext.get());
	}
	opts;
	root;
	attachment;
	#isActive = derived(() => this.root.opts.value.current === this.opts.value.current);
	#ariaLabelledBy = derived(() => this.root.valueToTriggerId.get(this.opts.value.current));
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
		watch([() => this.opts.id.current, () => this.opts.value.current], ([id, value]) => {
			return this.root.registerContent(id, value);
		});
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "tabpanel",
		hidden: boolToTrueOrUndef(!this.#isActive()),
		tabindex: 0,
		"data-value": this.opts.value.current,
		"data-state": getTabDataState(this.#isActive()),
		"aria-labelledby": this.#ariaLabelledBy(),
		"data-orientation": this.root.opts.orientation.current,
		[tabsAttrs.content]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
function getTabDataState(condition) {
	return condition ? "active" : "inactive";
}
//#endregion
//#region node_modules/bits-ui/dist/bits/tabs/components/tabs.svelte
function Tabs$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, value = "", onValueChange = noop, orientation = "horizontal", loop = true, activationMode = "automatic", disabled = false, children, child, $$slots, $$events, ...restProps } = $$props;
		const rootState = TabsRootState.create({
			id: boxWith(() => id),
			value: boxWith(() => value, (v) => {
				value = v;
				onValueChange(v);
			}),
			orientation: boxWith(() => orientation),
			loop: boxWith(() => loop),
			activationMode: boxWith(() => activationMode),
			disabled: boxWith(() => disabled),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, rootState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, {
			ref,
			value
		});
	});
}
//#endregion
//#region node_modules/bits-ui/dist/bits/tabs/components/tabs-content.svelte
function Tabs_content$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, id = createId(uid), ref = null, value, $$slots, $$events, ...restProps } = $$props;
		const contentState = TabsContentState.create({
			value: boxWith(() => value),
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, contentState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region node_modules/bits-ui/dist/bits/tabs/components/tabs-list.svelte
function Tabs_list$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { child, children, id = createId(uid), ref = null, $$slots, $$events, ...restProps } = $$props;
		const listState = TabsListState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, listState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region node_modules/bits-ui/dist/bits/tabs/components/tabs-trigger.svelte
function Tabs_trigger$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { child, children, disabled = false, id = createId(uid), type = "button", value, ref = null, $$slots, $$events, ...restProps } = $$props;
		const triggerState = TabsTriggerState.create({
			id: boxWith(() => id),
			disabled: boxWith(() => disabled ?? false),
			value: boxWith(() => value),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, triggerState.props, { type }));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<button${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></button>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/tabs/tabs.svelte
function Tabs($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, value = "", class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Tabs$1) {
				$$renderer.push("<!--[-->");
				Tabs$1($$renderer, spread_props([
					{
						"data-slot": "tabs",
						class: cn("gap-2 group/tabs flex data-[orientation=horizontal]:flex-col", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						},
						get value() {
							return value;
						},
						set value($$value) {
							value = $$value;
							$$settled = false;
						}
					}
				]));
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
		bind_props($$props, {
			ref,
			value
		});
	});
}
//#endregion
//#region src/lib/components/ui/tabs/tabs-content.svelte
function Tabs_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Tabs_content$1) {
				$$renderer.push("<!--[-->");
				Tabs_content$1($$renderer, spread_props([
					{
						"data-slot": "tabs-content",
						class: cn("text-sm flex-1 outline-none", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
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
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/tabs/tabs-list.svelte
var tabsListVariants = tv({
	base: "rounded-lg p-[3px] group-data-horizontal/tabs:h-9 data-[variant=line]:rounded-none group/tabs-list text-muted-foreground inline-flex w-fit items-center justify-center group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
	variants: { variant: {
		default: "cn-tabs-list-variant-default bg-muted",
		line: "cn-tabs-list-variant-line gap-1 bg-transparent"
	} },
	defaultVariants: { variant: "default" }
});
function Tabs_list($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, variant = "default", class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Tabs_list$1) {
				$$renderer.push("<!--[-->");
				Tabs_list$1($$renderer, spread_props([
					{
						"data-slot": "tabs-list",
						"data-variant": variant,
						class: cn(tabsListVariants({ variant }), className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
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
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/tabs/tabs-trigger.svelte
function Tabs_trigger($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Tabs_trigger$1) {
				$$renderer.push("<!--[-->");
				Tabs_trigger$1($$renderer, spread_props([
					{
						"data-slot": "tabs-trigger",
						class: cn("gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg:not([class*='size-'])]:size-4 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground/60 hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center whitespace-nowrap transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0", "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent", "data-active:bg-background dark:data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 data-active:text-foreground", "after:bg-foreground after:absolute after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
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
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/routes/agents/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		const MEMORY_TYPES = [
			"note",
			"lesson",
			"preference",
			"project",
			"fact",
			"relationship"
		];
		const agent = derived(() => data.agent);
		let agentOpen = false;
		let memoryOpen = false;
		let editMemory = null;
		let playbookOpen = false;
		let editPlaybook = null;
		let taskOpen = false;
		let editTaskItem = null;
		const TASK_STATUSES = [
			{
				value: "todo",
				label: "To do"
			},
			{
				value: "in_progress",
				label: "In progress"
			},
			{
				value: "waiting",
				label: "Waiting"
			},
			{
				value: "done",
				label: "Done"
			}
		];
		const TASK_PRIORITIES = [
			"low",
			"medium",
			"high"
		];
		function openTask(task) {
			editTaskItem = task;
			taskOpen = true;
		}
		let runOpen = false;
		let runTarget = null;
		let runFocus = "";
		let running = false;
		let committingTasks = false;
		let pbError = "";
		let proposedTasks = null;
		function initials(name) {
			return name?.trim()?.slice(0, 2)?.toUpperCase() ?? "?";
		}
		function openMemory(memory) {
			editMemory = memory;
			memoryOpen = true;
		}
		function openPlaybook(playbook) {
			editPlaybook = playbook;
			playbookOpen = true;
		}
		function openRun(playbook) {
			runTarget = playbook;
			runFocus = "";
			proposedTasks = null;
			pbError = "";
			runOpen = true;
		}
		function resetProposedTasks() {
			proposedTasks = null;
			pbError = "";
		}
		let dispatchOpen = false;
		let objective = "";
		let dispatchSteps = 5;
		let dispatchNotice = "";
		function openDispatch(prefill = "") {
			objective = typeof prefill === "string" ? prefill : "";
			dispatchNotice = "";
			dispatchOpen = true;
		}
		function playbookObjective(playbook) {
			const steps = playbook.steps?.length ? playbook.steps.map((s, i) => `${i + 1}. ${s}`).join("\n") : "(infer a sensible procedure from the name and description)";
			return [
				`Execute your "${playbook.name}" playbook end-to-end as a propose-only run.`,
				playbook.description ? `Purpose: ${playbook.description}` : "",
				"",
				"Steps:",
				steps,
				"",
				"Ground the work in live signal before deciding direction: if you can read X/Twitter, pull current trends and search recent tweets on the topic. Capture the result as a deliverable (create_deliverable) — e.g. a campaign brief or content set — and stage any concrete tasks or posts needed. Cite the handles/tweet ids you drew on."
			].filter(Boolean).join("\n");
		}
		let committingRunId = null;
		let runError = "";
		let chatMessages = [];
		let chatInput = "";
		let chatting = false;
		let chatError = "";
		function onChatKeydown(event) {
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				event.currentTarget.form?.requestSubmit();
			}
		}
		function clearChat() {
			chatMessages = [];
			chatError = "";
		}
		const statusLabel = {
			todo: "To do",
			in_progress: "In progress",
			waiting: "Waiting",
			done: "Done"
		};
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("3k3a1f", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>${escape_html(agent().name)} · Agents · WieldOS</title>`);
				});
			});
			$$renderer.push(`<div><a href="/agents" class="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm">`);
			Arrow_left($$renderer, { class: "size-4" });
			$$renderer.push(`<!----> All agents</a></div> <div class="flex items-start gap-4"><div class="bg-muted text-foreground flex size-14 shrink-0 items-center justify-center rounded-full text-lg font-medium">`);
			if (agent().avatar && agent().avatar.length <= 4) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="text-2xl">${escape_html(agent().avatar)}</span>`);
			} else if (agent().avatar) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<img${attr("src", agent().avatar)}${attr("alt", agent().name)} class="size-14 rounded-full object-cover"/>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`${escape_html(initials(agent().name))}`);
			}
			$$renderer.push(`<!--]--></div> <div class="flex-1 space-y-1"><div class="flex items-center gap-2"><h1 class="text-xl font-semibold tracking-tight">${escape_html(agent().name)}</h1> `);
			Badge($$renderer, {
				variant: agent().status === "active" ? "default" : "secondary",
				class: "capitalize",
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html(agent().status)}`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> `);
			if (agent().title) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-muted-foreground text-sm">${escape_html(agent().title)}</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (agent().description) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-sm">${escape_html(agent().description)}</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="flex items-center gap-2">`);
			Button($$renderer, {
				type: "button",
				variant: "outline",
				onclick: () => agentOpen = true,
				children: ($$renderer) => {
					Pencil($$renderer, { class: "size-4" });
					$$renderer.push(`<!----> Edit`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			if (data.aiEnabled && agent().status === "active") {
				$$renderer.push("<!--[0-->");
				Button($$renderer, {
					onclick: openDispatch,
					children: ($$renderer) => {
						Rocket($$renderer, { class: "size-4" });
						$$renderer.push(`<!----> Dispatch`);
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div> `);
			if (dispatchNotice) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-muted-foreground -mt-2 mb-4 flex items-center gap-2 text-sm">`);
				Rocket($$renderer, { class: "size-4 shrink-0" });
				$$renderer.push(`<!----> <span class="flex-1">${escape_html(dispatchNotice)}</span> <button type="button" class="text-xs underline">Dismiss</button></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (Tabs) {
				$$renderer.push("<!--[-->");
				Tabs($$renderer, {
					value: "overview",
					class: "gap-4",
					children: ($$renderer) => {
						if (Tabs_list) {
							$$renderer.push("<!--[-->");
							Tabs_list($$renderer, {
								children: ($$renderer) => {
									if (Tabs_trigger) {
										$$renderer.push("<!--[-->");
										Tabs_trigger($$renderer, {
											value: "overview",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Overview`);
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(` `);
									if (Tabs_trigger) {
										$$renderer.push("<!--[-->");
										Tabs_trigger($$renderer, {
											value: "chat",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Chat`);
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(` `);
									if (Tabs_trigger) {
										$$renderer.push("<!--[-->");
										Tabs_trigger($$renderer, {
											value: "context",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Context`);
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(` `);
									if (Tabs_trigger) {
										$$renderer.push("<!--[-->");
										Tabs_trigger($$renderer, {
											value: "memory",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Memory (${escape_html(data.memories.length)})`);
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(` `);
									if (Tabs_trigger) {
										$$renderer.push("<!--[-->");
										Tabs_trigger($$renderer, {
											value: "playbooks",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Playbooks (${escape_html(data.playbooks.length)})`);
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(` `);
									if (Tabs_trigger) {
										$$renderer.push("<!--[-->");
										Tabs_trigger($$renderer, {
											value: "tasks",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Tasks (${escape_html(data.tasks.length)})`);
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(` `);
									if (Tabs_trigger) {
										$$renderer.push("<!--[-->");
										Tabs_trigger($$renderer, {
											value: "observations",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Observations (${escape_html(data.observations.length)})`);
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(` `);
									if (Tabs_trigger) {
										$$renderer.push("<!--[-->");
										Tabs_trigger($$renderer, {
											value: "runs",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Runs (${escape_html(data.dispatches.length)})`);
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(` `);
									if (Tabs_trigger) {
										$$renderer.push("<!--[-->");
										Tabs_trigger($$renderer, {
											value: "deliverables",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Deliverables (${escape_html(data.deliverables.length)})`);
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
						if (Tabs_content) {
							$$renderer.push("<!--[-->");
							Tabs_content($$renderer, {
								value: "overview",
								class: "space-y-4",
								children: ($$renderer) => {
									if (agent().systemPrompt) {
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
																		class: "text-base",
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->Identity prompt`);
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
																$$renderer.push(`<p class="text-sm whitespace-pre-wrap leading-relaxed">${escape_html(agent().systemPrompt)}</p>`);
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
									if (agent().specialization) {
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
																		class: "text-base",
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->Specialization`);
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
																$$renderer.push(`<p class="text-sm">${escape_html(agent().specialization)}</p>`);
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
									$$renderer.push(`<!--]--> <div class="grid gap-4 sm:grid-cols-3"><!--[-->`);
									const each_array = ensure_array_like([
										{
											label: "Skills",
											items: agent().skills
										},
										{
											label: "Strengths",
											items: agent().strengths
										},
										{
											label: "Tools",
											items: agent().tools
										}
									]);
									for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
										let group = each_array[$$index_1];
										if (group.items.length > 0) {
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
																children: ($$renderer) => {
																	$$renderer.push(`<div class="flex flex-wrap gap-1.5"><!--[-->`);
																	const each_array_1 = ensure_array_like(group.items);
																	for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
																		let item = each_array_1[$$index];
																		Badge($$renderer, {
																			variant: "outline",
																			children: ($$renderer) => {
																				$$renderer.push(`<!---->${escape_html(item)}`);
																			},
																			$$slots: { default: true }
																		});
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
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]-->`);
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
						$$renderer.push(` `);
						if (Tabs_content) {
							$$renderer.push("<!--[-->");
							Tabs_content($$renderer, {
								value: "chat",
								children: ($$renderer) => {
									if (Card) {
										$$renderer.push("<!--[-->");
										Card($$renderer, {
											class: "flex h-[70vh] flex-col",
											children: ($$renderer) => {
												if (Card_header) {
													$$renderer.push("<!--[-->");
													Card_header($$renderer, {
														class: "flex flex-row items-center justify-between gap-2 border-b",
														children: ($$renderer) => {
															$$renderer.push(`<div>`);
															if (Card_title) {
																$$renderer.push("<!--[-->");
																Card_title($$renderer, {
																	class: "text-base",
																	children: ($$renderer) => {
																		$$renderer.push(`<!---->Chat with ${escape_html(agent().name)}`);
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
																		$$renderer.push(`<!---->A direct, in-character conversation. ${escape_html(agent().name)} can look things up with its read tools
						but can't take actions here — use <span class="font-medium">Dispatch</span> for that.`);
																	},
																	$$slots: { default: true }
																});
																$$renderer.push("<!--]-->");
															} else {
																$$renderer.push("<!--[!-->");
																$$renderer.push("<!--]-->");
															}
															$$renderer.push(`</div> `);
															if (chatMessages.length) {
																$$renderer.push("<!--[0-->");
																Button($$renderer, {
																	type: "button",
																	variant: "ghost",
																	size: "sm",
																	onclick: clearChat,
																	disabled: chatting,
																	children: ($$renderer) => {
																		$$renderer.push(`<!---->Clear`);
																	},
																	$$slots: { default: true }
																});
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
												$$renderer.push(` <div class="flex-1 space-y-4 overflow-y-auto p-4">`);
												if (chatMessages.length === 0) {
													$$renderer.push("<!--[0-->");
													$$renderer.push(`<div class="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 text-center text-sm"><div class="bg-muted flex size-12 items-center justify-center rounded-full text-lg font-medium">`);
													if (agent().avatar && agent().avatar.length <= 4) {
														$$renderer.push("<!--[0-->");
														$$renderer.push(`<span class="text-2xl">${escape_html(agent().avatar)}</span>`);
													} else if (agent().avatar) {
														$$renderer.push("<!--[1-->");
														$$renderer.push(`<img${attr("src", agent().avatar)}${attr("alt", agent().name)} class="size-12 rounded-full object-cover"/>`);
													} else {
														$$renderer.push("<!--[-1-->");
														$$renderer.push(`${escape_html(initials(agent().name))}`);
													}
													$$renderer.push(`<!--]--></div> <p>Say hello to ${escape_html(agent().name)}, or ask how they'd approach something.</p></div>`);
												} else {
													$$renderer.push("<!--[-1-->");
													$$renderer.push(`<!--[-->`);
													const each_array_2 = ensure_array_like(chatMessages);
													for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
														let message = each_array_2[i];
														if (message.role === "user") {
															$$renderer.push("<!--[0-->");
															$$renderer.push(`<div class="flex justify-end"><div class="bg-primary text-primary-foreground max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap">${escape_html(message.content)}</div></div>`);
														} else {
															$$renderer.push("<!--[-1-->");
															$$renderer.push(`<div class="flex justify-start"><div class="bg-muted max-w-[80%] rounded-lg px-3 py-2">`);
															Markdown($$renderer, { source: message.content });
															$$renderer.push(`<!----> `);
															if (message.toolsUsed?.length) {
																$$renderer.push("<!--[0-->");
																$$renderer.push(`<p class="text-muted-foreground mt-1.5 text-xs">Looked up: ${escape_html(message.toolsUsed.join(", "))}</p>`);
															} else $$renderer.push("<!--[-1-->");
															$$renderer.push(`<!--]--></div></div>`);
														}
														$$renderer.push(`<!--]-->`);
													}
													$$renderer.push(`<!--]--> `);
													$$renderer.push("<!--[-1-->");
													$$renderer.push(`<!--]-->`);
												}
												$$renderer.push(`<!--]--></div> <div class="border-t p-3">`);
												if (!data.aiEnabled) {
													$$renderer.push("<!--[0-->");
													$$renderer.push(`<div class="flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">`);
													Triangle_alert($$renderer, { class: "mt-0.5 size-4 shrink-0" });
													$$renderer.push(`<!----> <span>Add an <code class="font-mono text-xs">ANTHROPIC_API_KEY</code> under Settings → Core AI
							to chat with ${escape_html(agent().name)}.</span></div>`);
												} else {
													$$renderer.push("<!--[-1-->");
													if (chatError) {
														$$renderer.push("<!--[0-->");
														$$renderer.push(`<p class="text-destructive mb-2 text-sm">${escape_html(chatError)}</p>`);
													} else $$renderer.push("<!--[-1-->");
													$$renderer.push(`<!--]--> <form method="POST" action="?/chat" class="flex items-end gap-2">`);
													Textarea($$renderer, {
														onkeydown: onChatKeydown,
														rows: 1,
														placeholder: `Message ${stringify(agent().name)}…  (Enter to send, Shift+Enter for a new line)`,
														class: "max-h-40 min-h-10 flex-1 resize-none",
														disabled: chatting,
														get value() {
															return chatInput;
														},
														set value($$value) {
															chatInput = $$value;
															$$settled = false;
														}
													});
													$$renderer.push(`<!----> `);
													Button($$renderer, {
														type: "submit",
														size: "icon",
														"aria-label": "Send message",
														disabled: !chatInput.trim(),
														children: ($$renderer) => {
															$$renderer.push("<!--[-1-->");
															Send($$renderer, { class: "size-4" });
															$$renderer.push(`<!--]-->`);
														},
														$$slots: { default: true }
													});
													$$renderer.push(`<!----></form>`);
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
						$$renderer.push(` `);
						if (Tabs_content) {
							$$renderer.push("<!--[-->");
							Tabs_content($$renderer, {
								value: "context",
								class: "space-y-4",
								children: ($$renderer) => {
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
																		$$renderer.push(`<!---->Injected context`);
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
																		$$renderer.push(`<!---->The identity, memory, and playbooks prepended to ${escape_html(agent().name)}'s system prompt on every run.
					Workspace data (goals, tasks, notes, pinned reports) isn't shown here — ${escape_html(agent().name)} pulls
					it on demand via the <code class="text-xs">search_context</code> tool.`);
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
															$$renderer.push(`<pre class="bg-muted/40 text-muted-foreground max-h-[60vh] overflow-auto rounded-md p-4 text-xs whitespace-pre-wrap">${escape_html(data.agentContext)}</pre>`);
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
																	class: "text-base",
																	children: ($$renderer) => {
																		$$renderer.push(`<!---->Workspace digest`);
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
																		$$renderer.push(`<!---->The shared snapshot of goals, projects, tasks, notes, deliverables, and pinned reports
					that ${escape_html(agent().name)} retrieves on demand via the <code class="text-xs">search_context</code> tool.`);
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
															$$renderer.push(`<pre class="bg-muted/40 text-muted-foreground max-h-[60vh] overflow-auto rounded-md p-4 text-xs whitespace-pre-wrap">${escape_html(data.workspaceDigest)}</pre>`);
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
																	class: "text-base",
																	children: ($$renderer) => {
																		$$renderer.push(`<!---->System context`);
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
																		$$renderer.push(`<!---->The operating instructions appended after the identity above to form ${escape_html(agent().name)}'s full
					system prompt on every dispatch.`);
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
															$$renderer.push(`<pre class="bg-muted/40 text-muted-foreground max-h-[60vh] overflow-auto rounded-md p-4 text-xs whitespace-pre-wrap">${escape_html(data.systemContext)}</pre>`);
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
						if (Tabs_content) {
							$$renderer.push("<!--[-->");
							Tabs_content($$renderer, {
								value: "memory",
								class: "space-y-4",
								children: ($$renderer) => {
									$$renderer.push(`<div class="flex justify-end">`);
									Button($$renderer, {
										size: "sm",
										onclick: () => openMemory(null),
										children: ($$renderer) => {
											Plus($$renderer, { class: "size-4" });
											$$renderer.push(`<!----> New memory`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div> `);
									if (data.memories.length === 0) {
										$$renderer.push("<!--[0-->");
										if (Card) {
											$$renderer.push("<!--[-->");
											Card($$renderer, {
												class: "border-dashed",
												children: ($$renderer) => {
													if (Card_content) {
														$$renderer.push("<!--[-->");
														Card_content($$renderer, {
															class: "text-muted-foreground py-12 text-center text-sm",
															children: ($$renderer) => {
																$$renderer.push(`<!---->No memories yet.`);
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
										const each_array_3 = ensure_array_like(data.memories);
										for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
											let memory = each_array_3[$$index_3];
											if (Card) {
												$$renderer.push("<!--[-->");
												Card($$renderer, {
													class: "group",
													children: ($$renderer) => {
														if (Card_content) {
															$$renderer.push("<!--[-->");
															Card_content($$renderer, {
																class: "flex items-start gap-3 py-4",
																children: ($$renderer) => {
																	$$renderer.push(`<div class="flex-1 space-y-1.5"><div class="flex items-center gap-2">`);
																	Badge($$renderer, {
																		variant: "secondary",
																		class: "capitalize",
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->${escape_html(memory.memoryType)}`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----> <span class="text-muted-foreground text-xs">Importance ${escape_html(memory.importance)}/5</span> <span class="text-muted-foreground text-xs">· ${escape_html(formatRelative(memory.createdAt))}</span></div> <p class="text-sm whitespace-pre-wrap">${escape_html(memory.content)}</p></div> <div class="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">`);
																	Button($$renderer, {
																		type: "button",
																		variant: "ghost",
																		size: "icon-sm",
																		"aria-label": "Edit memory",
																		class: "text-muted-foreground hover:text-foreground",
																		onclick: () => openMemory(memory),
																		children: ($$renderer) => {
																			Pencil($$renderer, { class: "size-4" });
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----> <form method="POST" action="?/deleteMemory"><input type="hidden" name="id"${attr("value", memory.id)}/> `);
																	Button($$renderer, {
																		type: "submit",
																		variant: "ghost",
																		size: "icon-sm",
																		"aria-label": "Delete memory",
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
						$$renderer.push(` `);
						if (Tabs_content) {
							$$renderer.push("<!--[-->");
							Tabs_content($$renderer, {
								value: "playbooks",
								class: "space-y-4",
								children: ($$renderer) => {
									$$renderer.push(`<div class="flex justify-end">`);
									Button($$renderer, {
										size: "sm",
										onclick: () => openPlaybook(null),
										children: ($$renderer) => {
											Plus($$renderer, { class: "size-4" });
											$$renderer.push(`<!----> New playbook`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div> `);
									if (data.playbooks.length === 0) {
										$$renderer.push("<!--[0-->");
										if (Card) {
											$$renderer.push("<!--[-->");
											Card($$renderer, {
												class: "border-dashed",
												children: ($$renderer) => {
													if (Card_content) {
														$$renderer.push("<!--[-->");
														Card_content($$renderer, {
															class: "text-muted-foreground py-12 text-center text-sm",
															children: ($$renderer) => {
																$$renderer.push(`<!---->No playbooks yet.`);
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
										$$renderer.push(`<div class="grid gap-4 lg:grid-cols-2"><!--[-->`);
										const each_array_4 = ensure_array_like(data.playbooks);
										for (let $$index_6 = 0, $$length = each_array_4.length; $$index_6 < $$length; $$index_6++) {
											let playbook = each_array_4[$$index_6];
											if (Card) {
												$$renderer.push("<!--[-->");
												Card($$renderer, {
													class: "group",
													children: ($$renderer) => {
														if (Card_header) {
															$$renderer.push("<!--[-->");
															Card_header($$renderer, {
																children: ($$renderer) => {
																	$$renderer.push(`<div class="flex items-start gap-2"><div class="flex-1">`);
																	if (Card_title) {
																		$$renderer.push("<!--[-->");
																		Card_title($$renderer, {
																			class: "text-base",
																			children: ($$renderer) => {
																				$$renderer.push(`<!---->${escape_html(playbook.name)}`);
																			},
																			$$slots: { default: true }
																		});
																		$$renderer.push("<!--]-->");
																	} else {
																		$$renderer.push("<!--[!-->");
																		$$renderer.push("<!--]-->");
																	}
																	$$renderer.push(` `);
																	if (playbook.description) {
																		$$renderer.push("<!--[0-->");
																		$$renderer.push(`<p class="text-muted-foreground mt-1 text-sm">${escape_html(playbook.description)}</p>`);
																	} else $$renderer.push("<!--[-1-->");
																	$$renderer.push(`<!--]--></div> <div class="flex items-center gap-1">`);
																	Button($$renderer, {
																		type: "button",
																		variant: "outline",
																		size: "sm",
																		onclick: () => openRun(playbook),
																		children: ($$renderer) => {
																			Sparkles($$renderer, { class: "size-4" });
																			$$renderer.push(`<!----> Run`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----> `);
																	Button($$renderer, {
																		type: "button",
																		variant: "outline",
																		size: "sm",
																		onclick: () => openDispatch(playbookObjective(playbook)),
																		children: ($$renderer) => {
																			Rocket($$renderer, { class: "size-4" });
																			$$renderer.push(`<!----> Dispatch`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----> <div class="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">`);
																	Button($$renderer, {
																		type: "button",
																		variant: "ghost",
																		size: "icon-sm",
																		"aria-label": "Edit playbook",
																		class: "text-muted-foreground hover:text-foreground",
																		onclick: () => openPlaybook(playbook),
																		children: ($$renderer) => {
																			Pencil($$renderer, { class: "size-4" });
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----> <form method="POST" action="?/deletePlaybook"><input type="hidden" name="id"${attr("value", playbook.id)}/> `);
																	Button($$renderer, {
																		type: "submit",
																		variant: "ghost",
																		size: "icon-sm",
																		"aria-label": "Delete playbook",
																		class: "text-muted-foreground hover:text-destructive",
																		children: ($$renderer) => {
																			Trash_2($$renderer, { class: "size-4" });
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----></form></div></div></div>`);
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
																class: "space-y-3",
																children: ($$renderer) => {
																	if (playbook.steps.length > 0) {
																		$$renderer.push("<!--[0-->");
																		$$renderer.push(`<ol class="list-decimal space-y-1 pl-5 text-sm"><!--[-->`);
																		const each_array_5 = ensure_array_like(playbook.steps);
																		for (let i = 0, $$length = each_array_5.length; i < $$length; i++) {
																			let step = each_array_5[i];
																			$$renderer.push(`<li>${escape_html(step)}</li>`);
																		}
																		$$renderer.push(`<!--]--></ol>`);
																	} else $$renderer.push("<!--[-1-->");
																	$$renderer.push(`<!--]--> `);
																	if (playbook.triggerTags.length > 0) {
																		$$renderer.push("<!--[0-->");
																		$$renderer.push(`<div class="flex flex-wrap gap-1.5"><!--[-->`);
																		const each_array_6 = ensure_array_like(playbook.triggerTags);
																		for (let $$index_5 = 0, $$length = each_array_6.length; $$index_5 < $$length; $$index_5++) {
																			let tag = each_array_6[$$index_5];
																			Badge($$renderer, {
																				variant: "outline",
																				children: ($$renderer) => {
																					$$renderer.push(`<!---->${escape_html(tag)}`);
																				},
																				$$slots: { default: true }
																			});
																		}
																		$$renderer.push(`<!--]--></div>`);
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
								},
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
						$$renderer.push(` `);
						if (Tabs_content) {
							$$renderer.push("<!--[-->");
							Tabs_content($$renderer, {
								value: "tasks",
								class: "space-y-4",
								children: ($$renderer) => {
									if (data.tasks.length === 0) {
										$$renderer.push("<!--[0-->");
										if (Card) {
											$$renderer.push("<!--[-->");
											Card($$renderer, {
												class: "border-dashed",
												children: ($$renderer) => {
													if (Card_content) {
														$$renderer.push("<!--[-->");
														Card_content($$renderer, {
															class: "text-muted-foreground py-12 text-center text-sm",
															children: ($$renderer) => {
																$$renderer.push(`<!---->No tasks assigned yet.`);
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
										const each_array_7 = ensure_array_like(data.tasks);
										for (let $$index_7 = 0, $$length = each_array_7.length; $$index_7 < $$length; $$index_7++) {
											let task = each_array_7[$$index_7];
											if (Card) {
												$$renderer.push("<!--[-->");
												Card($$renderer, {
													class: "group",
													children: ($$renderer) => {
														if (Card_content) {
															$$renderer.push("<!--[-->");
															Card_content($$renderer, {
																class: "flex items-center gap-3 py-4",
																children: ($$renderer) => {
																	$$renderer.push(`<div class="min-w-0 flex-1"><p${attr_class(`text-sm font-medium ${task.status === "done" ? "text-muted-foreground line-through" : ""}`)}>${escape_html(task.title)}</p> `);
																	if (task.description) {
																		$$renderer.push("<!--[0-->");
																		$$renderer.push(`<p class="text-muted-foreground text-sm whitespace-pre-wrap">${escape_html(task.description)}</p>`);
																	} else $$renderer.push("<!--[-1-->");
																	$$renderer.push(`<!--]--> `);
																	if (task.projectName) {
																		$$renderer.push("<!--[0-->");
																		$$renderer.push(`<p class="text-muted-foreground mt-1 text-xs">Project: ${escape_html(task.projectName)}</p>`);
																	} else $$renderer.push("<!--[-1-->");
																	$$renderer.push(`<!--]--></div> `);
																	Badge($$renderer, {
																		variant: "outline",
																		class: "capitalize",
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->${escape_html(task.priority)}`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----> `);
																	Badge($$renderer, {
																		variant: "secondary",
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->${escape_html(statusLabel[task.status] ?? task.status)}`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----> <div class="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">`);
																	Button($$renderer, {
																		type: "button",
																		variant: "ghost",
																		size: "icon-sm",
																		"aria-label": "Edit task",
																		class: "text-muted-foreground hover:text-foreground",
																		onclick: () => openTask(task),
																		children: ($$renderer) => {
																			Pencil($$renderer, { class: "size-4" });
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----> <form method="POST" action="?/deleteTask"><input type="hidden" name="id"${attr("value", task.id)}/> `);
																	Button($$renderer, {
																		type: "submit",
																		variant: "ghost",
																		size: "icon-sm",
																		"aria-label": "Delete task",
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
						$$renderer.push(` `);
						if (Tabs_content) {
							$$renderer.push("<!--[-->");
							Tabs_content($$renderer, {
								value: "observations",
								class: "space-y-4",
								children: ($$renderer) => {
									if (data.observations.length === 0) {
										$$renderer.push("<!--[0-->");
										if (Card) {
											$$renderer.push("<!--[-->");
											Card($$renderer, {
												class: "border-dashed",
												children: ($$renderer) => {
													if (Card_content) {
														$$renderer.push("<!--[-->");
														Card_content($$renderer, {
															class: "text-muted-foreground py-12 text-center text-sm",
															children: ($$renderer) => {
																$$renderer.push(`<!---->No observations yet.`);
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
										const each_array_8 = ensure_array_like(data.observations);
										for (let $$index_9 = 0, $$length = each_array_8.length; $$index_9 < $$length; $$index_9++) {
											let obs = each_array_8[$$index_9];
											if (Card) {
												$$renderer.push("<!--[-->");
												Card($$renderer, {
													children: ($$renderer) => {
														if (Card_content) {
															$$renderer.push("<!--[-->");
															Card_content($$renderer, {
																class: "space-y-2 py-4",
																children: ($$renderer) => {
																	$$renderer.push(`<p class="text-sm whitespace-pre-wrap">${escape_html(obs.content)}</p> <div class="flex flex-wrap items-center gap-1.5">`);
																	Badge($$renderer, {
																		variant: "secondary",
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->${escape_html(Math.round(obs.confidence * 100))}% confidence`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----> <!--[-->`);
																	const each_array_9 = ensure_array_like(obs.tags);
																	for (let $$index_8 = 0, $$length = each_array_9.length; $$index_8 < $$length; $$index_8++) {
																		let tag = each_array_9[$$index_8];
																		Badge($$renderer, {
																			variant: "outline",
																			children: ($$renderer) => {
																				$$renderer.push(`<!---->${escape_html(tag)}`);
																			},
																			$$slots: { default: true }
																		});
																	}
																	$$renderer.push(`<!--]--> <span class="text-muted-foreground text-xs">· ${escape_html(formatRelative(obs.createdAt))}</span></div>`);
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
								},
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
						$$renderer.push(` `);
						if (Tabs_content) {
							$$renderer.push("<!--[-->");
							Tabs_content($$renderer, {
								value: "runs",
								class: "space-y-4",
								children: ($$renderer) => {
									if (data.dispatches.length === 0) {
										$$renderer.push("<!--[0-->");
										if (Card) {
											$$renderer.push("<!--[-->");
											Card($$renderer, {
												class: "border-dashed",
												children: ($$renderer) => {
													if (Card_content) {
														$$renderer.push("<!--[-->");
														Card_content($$renderer, {
															class: "text-muted-foreground py-12 text-center text-sm",
															children: ($$renderer) => {
																$$renderer.push(`<!---->No runs yet. Dispatch ${escape_html(agent().name)} to see its history here.`);
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
										const each_array_10 = ensure_array_like(data.dispatches);
										for (let $$index_11 = 0, $$length = each_array_10.length; $$index_11 < $$length; $$index_11++) {
											let run = each_array_10[$$index_11];
											if (Card) {
												$$renderer.push("<!--[-->");
												Card($$renderer, {
													children: ($$renderer) => {
														if (Card_content) {
															$$renderer.push("<!--[-->");
															Card_content($$renderer, {
																class: "space-y-2 py-4",
																children: ($$renderer) => {
																	$$renderer.push(`<div class="flex items-start justify-between gap-3"><p class="text-sm font-medium">${escape_html(run.objective)}</p> <div class="flex shrink-0 items-center gap-1"><span class="text-muted-foreground text-xs">${escape_html(formatRelative(run.createdAt))}</span> <form method="POST" action="?/deleteDispatch"><input type="hidden" name="id"${attr("value", run.id)}/> `);
																	Button($$renderer, {
																		type: "submit",
																		variant: "ghost",
																		size: "icon-sm",
																		"aria-label": "Delete run",
																		class: "text-muted-foreground hover:text-destructive",
																		children: ($$renderer) => {
																			Trash_2($$renderer, { class: "size-4" });
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----></form></div></div> `);
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
																			$$renderer.push(`<!---->${escape_html(run.staged.length)} staged`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----> `);
																	Badge($$renderer, {
																		variant: "ghost",
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->${escape_html(run.reads.length)} reads`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----> `);
																	Badge($$renderer, {
																		variant: "ghost",
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->${escape_html(run.steps)} steps`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----> `);
																	if (run.committed) {
																		$$renderer.push("<!--[0-->");
																		Badge($$renderer, {
																			variant: "secondary",
																			children: ($$renderer) => {
																				Check($$renderer, { class: "mr-1 size-3" });
																				$$renderer.push(`<!----> Approved`);
																			},
																			$$slots: { default: true }
																		});
																	} else if (run.denied) {
																		$$renderer.push("<!--[1-->");
																		Badge($$renderer, {
																			variant: "outline",
																			class: "text-muted-foreground",
																			children: ($$renderer) => {
																				X($$renderer, { class: "mr-1 size-3" });
																				$$renderer.push(`<!----> Denied`);
																			},
																			$$slots: { default: true }
																		});
																	} else $$renderer.push("<!--[-1-->");
																	$$renderer.push(`<!--]--></div> `);
																	if (run.staged.length) {
																		$$renderer.push("<!--[0-->");
																		$$renderer.push(`<ul class="text-muted-foreground mt-1 list-disc space-y-0.5 pl-5 text-xs"><!--[-->`);
																		const each_array_11 = ensure_array_like(run.staged);
																		for (let i = 0, $$length = each_array_11.length; i < $$length; i++) {
																			let action = each_array_11[i];
																			$$renderer.push(`<li>${escape_html(action.summary)}</li>`);
																		}
																		$$renderer.push(`<!--]--></ul>`);
																	} else $$renderer.push("<!--[-1-->");
																	$$renderer.push(`<!--]--> `);
																	if (run.staged.length && !run.committed && !run.denied) {
																		$$renderer.push("<!--[0-->");
																		$$renderer.push(`<div class="flex items-center justify-between gap-3 pt-1">`);
																		if (committingRunId === run.id && runError);
																		else {
																			$$renderer.push("<!--[-1-->");
																			$$renderer.push(`<p class="text-muted-foreground text-xs">Writes are staged — approve to run them.</p>`);
																		}
																		$$renderer.push(`<!--]--> <div class="flex items-center gap-2"><form method="POST" action="?/denyDispatch"><input type="hidden" name="id"${attr("value", run.id)}/> `);
																		Button($$renderer, {
																			type: "submit",
																			variant: "outline",
																			size: "sm",
																			disabled: committingRunId === run.id,
																			children: ($$renderer) => {
																				X($$renderer, { class: "size-4" });
																				$$renderer.push(`<!----> Deny`);
																			},
																			$$slots: { default: true }
																		});
																		$$renderer.push(`<!----></form> <form method="POST" action="?/commitDispatch"><input type="hidden" name="actions"${attr("value", JSON.stringify(run.staged))}/> <input type="hidden" name="objective"${attr("value", run.objective ?? "")}/> <input type="hidden" name="dispatchId"${attr("value", run.dispatchId ?? "")}/> `);
																		Button($$renderer, {
																			type: "submit",
																			size: "sm",
																			disabled: committingRunId === run.id,
																			children: ($$renderer) => {
																				if (committingRunId === run.id) {
																					$$renderer.push("<!--[0-->");
																					Loader_circle($$renderer, { class: "size-4 animate-spin" });
																					$$renderer.push(`<!----> Running…`);
																				} else {
																					$$renderer.push("<!--[-1-->");
																					Check($$renderer, { class: "size-4" });
																					$$renderer.push(`<!----> Approve &amp; run ${escape_html(run.staged.length)}`);
																				}
																				$$renderer.push(`<!--]-->`);
																			},
																			$$slots: { default: true }
																		});
																		$$renderer.push(`<!----></form></div></div>`);
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
								},
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
						$$renderer.push(` `);
						if (Tabs_content) {
							$$renderer.push("<!--[-->");
							Tabs_content($$renderer, {
								value: "deliverables",
								class: "space-y-4",
								children: ($$renderer) => {
									if (data.deliverables.length === 0) {
										$$renderer.push("<!--[0-->");
										if (Card) {
											$$renderer.push("<!--[-->");
											Card($$renderer, {
												class: "border-dashed",
												children: ($$renderer) => {
													if (Card_content) {
														$$renderer.push("<!--[-->");
														Card_content($$renderer, {
															class: "text-muted-foreground py-12 text-center text-sm",
															children: ($$renderer) => {
																$$renderer.push(`<!---->No deliverables yet. Approve a run's <code class="text-xs">create_deliverable</code> action to save one.`);
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
										const each_array_12 = ensure_array_like(data.deliverables);
										for (let $$index_12 = 0, $$length = each_array_12.length; $$index_12 < $$length; $$index_12++) {
											let item = each_array_12[$$index_12];
											if (Card) {
												$$renderer.push("<!--[-->");
												Card($$renderer, {
													children: ($$renderer) => {
														if (Card_content) {
															$$renderer.push("<!--[-->");
															Card_content($$renderer, {
																class: "space-y-2 py-4",
																children: ($$renderer) => {
																	$$renderer.push(`<div class="flex items-start justify-between gap-3"><a${attr("href", `/deliverables/${item.id}`)} class="text-sm font-medium hover:underline">${escape_html(item.title)}</a> <span class="text-muted-foreground shrink-0 text-xs">${escape_html(formatRelative(item.updatedAt))}</span></div> <div class="flex flex-wrap items-center gap-1.5">`);
																	Badge($$renderer, {
																		variant: "outline",
																		class: "capitalize",
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->${escape_html(item.status)}`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----> `);
																	Badge($$renderer, {
																		variant: "ghost",
																		class: "capitalize",
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->${escape_html(item.type)}`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----> `);
																	if (item.exportedAt) {
																		$$renderer.push("<!--[0-->");
																		Badge($$renderer, {
																			variant: "secondary",
																			children: ($$renderer) => {
																				$$renderer.push(`<!---->Exported`);
																			},
																			$$slots: { default: true }
																		});
																	} else $$renderer.push("<!--[-1-->");
																	$$renderer.push(`<!--]--></div> `);
																	if (item.body) {
																		$$renderer.push("<!--[0-->");
																		$$renderer.push(`<p class="text-muted-foreground line-clamp-3 text-sm whitespace-pre-wrap">${escape_html(item.body)}</p>`);
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
						return agentOpen;
					},
					set open($$value) {
						agentOpen = $$value;
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
															$$renderer.push(`<!---->Edit agent`);
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
															$$renderer.push(`<!---->Update this agent's identity and configuration.`);
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
									$$renderer.push(` <form method="POST" action="?/updateAgent" enctype="multipart/form-data" class="grid gap-4"><input type="hidden" name="id"${attr("value", agent().id)}/> `);
									Agent_fields($$renderer, {
										agent: agent(),
										toolCatalog: data.toolCatalog,
										message: form?.message
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
						return taskOpen;
					},
					set open($$value) {
						taskOpen = $$value;
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
															$$renderer.push(`<!---->Edit task`);
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
															$$renderer.push(`<!---->Update this agent's task.`);
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
									$$renderer.push(`<form method="POST" action="?/updateTask" class="grid gap-4"><input type="hidden" name="id"${attr("value", editTaskItem?.id)}/> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "task-title",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Title`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "task-title",
										name: "title",
										value: editTaskItem?.title ?? "",
										placeholder: "Task title",
										required: true
									});
									$$renderer.push(`<!----> `);
									if (form?.message) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<p class="text-destructive text-xs">${escape_html(form.message)}</p>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "task-description",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Description`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Textarea($$renderer, {
										id: "task-description",
										name: "description",
										value: editTaskItem?.description ?? "",
										rows: 3
									});
									$$renderer.push(`<!----></div> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
									Label($$renderer, {
										for: "task-status",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Status`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Native_select($$renderer, {
										id: "task-status",
										name: "status",
										value: editTaskItem?.status ?? "todo",
										class: "w-full",
										children: ($$renderer) => {
											$$renderer.push(`<!--[-->`);
											const each_array_13 = ensure_array_like(TASK_STATUSES);
											for (let $$index_13 = 0, $$length = each_array_13.length; $$index_13 < $$length; $$index_13++) {
												let s = each_array_13[$$index_13];
												$$renderer.option({ value: s.value }, ($$renderer) => {
													$$renderer.push(`${escape_html(s.label)}`);
												});
											}
											$$renderer.push(`<!--]-->`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "task-priority",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Priority`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Native_select($$renderer, {
										id: "task-priority",
										name: "priority",
										value: editTaskItem?.priority ?? "medium",
										class: "w-full",
										children: ($$renderer) => {
											$$renderer.push(`<!--[-->`);
											const each_array_14 = ensure_array_like(TASK_PRIORITIES);
											for (let $$index_14 = 0, $$length = each_array_14.length; $$index_14 < $$length; $$index_14++) {
												let p = each_array_14[$$index_14];
												$$renderer.option({
													value: p,
													class: "capitalize"
												}, ($$renderer) => {
													$$renderer.push(`${escape_html(p)}`);
												});
											}
											$$renderer.push(`<!--]-->`);
										},
										$$slots: { default: true }
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
			if (Dialog) {
				$$renderer.push("<!--[-->");
				Dialog($$renderer, {
					get open() {
						return memoryOpen;
					},
					set open($$value) {
						memoryOpen = $$value;
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
															$$renderer.push(`<!---->${escape_html(editMemory ? "Edit memory" : "New memory")}`);
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
															$$renderer.push(`<!---->Long-term knowledge this agent should retain.`);
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
									$$renderer.push(`<form method="POST"${attr("action", editMemory ? "?/updateMemory" : "?/createMemory")} class="grid gap-4">`);
									if (editMemory) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<input type="hidden" name="id"${attr("value", editMemory.id)}/>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
									Label($$renderer, {
										for: "memoryType",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Type`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Native_select($$renderer, {
										id: "memoryType",
										name: "memoryType",
										value: editMemory?.memoryType ?? "note",
										class: "w-full",
										children: ($$renderer) => {
											$$renderer.push(`<!--[-->`);
											const each_array_15 = ensure_array_like(MEMORY_TYPES);
											for (let $$index_15 = 0, $$length = each_array_15.length; $$index_15 < $$length; $$index_15++) {
												let type = each_array_15[$$index_15];
												$$renderer.option({
													value: type,
													class: "capitalize"
												}, ($$renderer) => {
													$$renderer.push(`${escape_html(type)}`);
												});
											}
											$$renderer.push(`<!--]-->`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "importance",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Importance (1–5)`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "importance",
										name: "importance",
										type: "number",
										min: "1",
										max: "5",
										value: editMemory?.importance ?? 1
									});
									$$renderer.push(`<!----></div></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "memory-content",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Content`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Textarea($$renderer, {
										id: "memory-content",
										name: "content",
										value: editMemory?.content ?? "",
										rows: 4,
										required: true
									});
									$$renderer.push(`<!----> `);
									if (form?.message) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<p class="text-destructive text-xs">${escape_html(form.message)}</p>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></div> `);
									if (Dialog_footer) {
										$$renderer.push("<!--[-->");
										Dialog_footer($$renderer, {
											children: ($$renderer) => {
												Button($$renderer, {
													type: "submit",
													children: ($$renderer) => {
														$$renderer.push(`<!---->${escape_html(editMemory ? "Save changes" : "Add memory")}`);
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
			if (Dialog) {
				$$renderer.push("<!--[-->");
				Dialog($$renderer, {
					get open() {
						return playbookOpen;
					},
					set open($$value) {
						playbookOpen = $$value;
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
															$$renderer.push(`<!---->${escape_html(editPlaybook ? "Edit playbook" : "New playbook")}`);
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
															$$renderer.push(`<!---->A reusable operating procedure for this agent.`);
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
									$$renderer.push(`<form method="POST"${attr("action", editPlaybook ? "?/updatePlaybook" : "?/createPlaybook")} class="grid gap-4">`);
									if (editPlaybook) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<input type="hidden" name="id"${attr("value", editPlaybook.id)}/>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "playbook-name",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Name`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "playbook-name",
										name: "name",
										value: editPlaybook?.name ?? "",
										placeholder: "Build Smart Contract",
										required: true
									});
									$$renderer.push(`<!----> `);
									if (form?.message) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<p class="text-destructive text-xs">${escape_html(form.message)}</p>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "playbook-description",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Description`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Textarea($$renderer, {
										id: "playbook-description",
										name: "description",
										value: editPlaybook?.description ?? "",
										rows: 2
									});
									$$renderer.push(`<!----></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "playbook-steps",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Steps`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Textarea($$renderer, {
										id: "playbook-steps",
										name: "steps",
										value: editPlaybook ? editPlaybook.steps.join("\n") : "",
										placeholder: "Gather requirements\nDesign architecture\nWrite tests",
										rows: 6
									});
									$$renderer.push(`<!----> <p class="text-muted-foreground text-xs">One step per line.</p></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "playbook-tags",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Trigger tags`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "playbook-tags",
										name: "triggerTags",
										value: editPlaybook ? editPlaybook.triggerTags.join(", ") : "",
										placeholder: "solidity, defi, smart-contract"
									});
									$$renderer.push(`<!----> <p class="text-muted-foreground text-xs">Separate with commas.</p></div> `);
									if (Dialog_footer) {
										$$renderer.push("<!--[-->");
										Dialog_footer($$renderer, {
											children: ($$renderer) => {
												Button($$renderer, {
													type: "submit",
													children: ($$renderer) => {
														$$renderer.push(`<!---->${escape_html(editPlaybook ? "Save changes" : "Create playbook")}`);
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
			if (Dialog) {
				$$renderer.push("<!--[-->");
				Dialog($$renderer, {
					get open() {
						return runOpen;
					},
					set open($$value) {
						runOpen = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						if (Dialog_content) {
							$$renderer.push("<!--[-->");
							Dialog_content($$renderer, {
								class: "max-h-[85vh] overflow-y-auto sm:max-w-2xl",
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
															Sparkles($$renderer, { class: "size-4" });
															$$renderer.push(`<!----> Run playbook`);
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
															$$renderer.push(`<!---->${escape_html(agent().name)} turns “${escape_html(runTarget?.name)}” into concrete tasks. Review them before adding.`);
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
									if (!data.aiEnabled) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">`);
										Triangle_alert($$renderer, { class: "mt-0.5 size-4 shrink-0" });
										$$renderer.push(`<!----> <span>Add <code class="font-mono text-xs">ANTHROPIC_API_KEY</code> to your <code class="font-mono text-xs">.env</code> file to run playbooks, then restart the dev server.</span></div>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									if (!proposedTasks) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<form method="POST" action="?/runPlaybook" class="grid gap-4"><input type="hidden" name="playbookId"${attr("value", runTarget?.id)}/> `);
										if (runTarget?.steps?.length) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<div class="grid gap-1.5"><p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Steps</p> <ol class="list-decimal space-y-1 pl-5 text-sm"><!--[-->`);
											const each_array_16 = ensure_array_like(runTarget.steps);
											for (let i = 0, $$length = each_array_16.length; i < $$length; i++) {
												let step = each_array_16[i];
												$$renderer.push(`<li>${escape_html(step)}</li>`);
											}
											$$renderer.push(`<!--]--></ol></div>`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> <div class="grid gap-2">`);
										Label($$renderer, {
											for: "focus",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Focus for this run <span class="text-muted-foreground">(optional)</span>`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										Textarea($$renderer, {
											id: "focus",
											name: "focus",
											rows: 3,
											placeholder: "e.g. Target the EMIT farm launch this week.",
											get value() {
												return runFocus;
											},
											set value($$value) {
												runFocus = $$value;
												$$settled = false;
											}
										});
										$$renderer.push(`<!----></div> `);
										if (pbError) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<p class="text-destructive text-sm">${escape_html(pbError)}</p>`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> `);
										if (Dialog_footer) {
											$$renderer.push("<!--[-->");
											Dialog_footer($$renderer, {
												children: ($$renderer) => {
													Button($$renderer, {
														type: "submit",
														disabled: running,
														children: ($$renderer) => {
															$$renderer.push("<!--[-1-->");
															Sparkles($$renderer, { class: "size-4" });
															$$renderer.push(`<!----> Run playbook`);
															$$renderer.push(`<!--]-->`);
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
									} else {
										$$renderer.push("<!--[-1-->");
										$$renderer.push(`<div class="grid gap-3"><p class="text-muted-foreground text-sm">${escape_html(proposedTasks.length)} task${escape_html(proposedTasks.length === 1 ? "" : "s")}. Review, then add to ${escape_html(agent().name)}’s tasks.</p> <div class="-mx-1 flex max-h-[50vh] flex-col gap-2 overflow-y-auto px-1"><!--[-->`);
										const each_array_17 = ensure_array_like(proposedTasks);
										for (let i = 0, $$length = each_array_17.length; i < $$length; i++) {
											let task = each_array_17[i];
											$$renderer.push(`<div class="bg-muted/40 flex items-start gap-3 rounded-md p-2.5"><div class="flex-1"><p class="text-sm font-medium">${escape_html(task.title)}</p> `);
											if (task.description) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<p class="text-muted-foreground text-xs">${escape_html(task.description)}</p>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div> `);
											Badge($$renderer, {
												variant: "outline",
												class: "capitalize",
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(task.priority)}`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></div>`);
										}
										$$renderer.push(`<!--]--></div> `);
										if (pbError) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<p class="text-destructive text-sm">${escape_html(pbError)}</p>`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--></div> `);
										if (Dialog_footer) {
											$$renderer.push("<!--[-->");
											Dialog_footer($$renderer, {
												children: ($$renderer) => {
													Button($$renderer, {
														type: "button",
														variant: "outline",
														onclick: resetProposedTasks,
														disabled: committingTasks,
														children: ($$renderer) => {
															$$renderer.push(`<!---->Start over`);
														},
														$$slots: { default: true }
													});
													$$renderer.push(`<!----> <form method="POST" action="?/commitPlaybook"><input type="hidden" name="tasks"${attr("value", JSON.stringify(proposedTasks))}/> <input type="hidden" name="playbookId"${attr("value", runTarget?.id)}/> `);
													Button($$renderer, {
														type: "submit",
														disabled: committingTasks,
														children: ($$renderer) => {
															$$renderer.push("<!--[-1-->");
															Plus($$renderer, { class: "size-4" });
															$$renderer.push(`<!----> Add ${escape_html(proposedTasks.length)} task${escape_html(proposedTasks.length === 1 ? "" : "s")}`);
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
			$$renderer.push(` `);
			if (Dialog) {
				$$renderer.push("<!--[-->");
				Dialog($$renderer, {
					get open() {
						return dispatchOpen;
					},
					set open($$value) {
						dispatchOpen = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						if (Dialog_content) {
							$$renderer.push("<!--[-->");
							Dialog_content($$renderer, {
								class: "max-h-[85vh] overflow-y-auto sm:max-w-2xl",
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
															Rocket($$renderer, { class: "size-4" });
															$$renderer.push(`<!----> Dispatch ${escape_html(agent().name)}`);
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
															$$renderer.push(`<!---->Give an objective. ${escape_html(agent().name)} works in the background; its proposed actions appear in the Runs tab for your approval.`);
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
									$$renderer.push(` <form method="POST" action="?/dispatch" class="grid gap-4"><div class="grid gap-2">`);
									Label($$renderer, {
										for: "objective",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Objective`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Textarea($$renderer, {
										id: "objective",
										name: "objective",
										rows: 3,
										placeholder: "e.g. Review my open EMIT tasks and draft a plan note, then add any missing follow-ups.",
										required: true,
										get value() {
											return objective;
										},
										set value($$value) {
											objective = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "maxSteps",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Step budget`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "maxSteps",
										name: "maxSteps",
										type: "number",
										min: 1,
										max: 15,
										class: "w-24",
										get value() {
											return dispatchSteps;
										},
										set value($$value) {
											dispatchSteps = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----> <p class="text-muted-foreground text-xs">Max tool calls (one per step). Raise for multi-lookup jobs like maintaining a reference
					directory; keep low for quick tasks. Default 5, max 15.</p></div> `);
									if (data.grantedTools?.length) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="grid gap-1.5"><p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Allowed tools</p> <div class="flex flex-wrap gap-1.5"><!--[-->`);
										const each_array_18 = ensure_array_like(data.grantedTools);
										for (let $$index_18 = 0, $$length = each_array_18.length; $$index_18 < $$length; $$index_18++) {
											let tool = each_array_18[$$index_18];
											Badge($$renderer, {
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(tool.name.replace(/_/g, " "))}`);
												},
												$$slots: { default: true }
											});
										}
										$$renderer.push(`<!--]--></div></div>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									if (Dialog_footer) {
										$$renderer.push("<!--[-->");
										Dialog_footer($$renderer, {
											children: ($$renderer) => {
												Button($$renderer, {
													type: "submit",
													children: ($$renderer) => {
														Rocket($$renderer, { class: "size-4" });
														$$renderer.push(`<!----> Dispatch`);
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
//# sourceMappingURL=_page.svelte.js-C5l7t2xi.js.map
