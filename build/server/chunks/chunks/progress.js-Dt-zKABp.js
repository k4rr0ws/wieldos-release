import { Y as bind_props, a3 as spread_props, a8 as attr_style, a6 as stringify, a5 as props_id, W as attributes, T as derived } from './server.js-BeDXxHyW.js';
import { c as cn } from './button.js-BKCc13Pl.js';
import { a as createBitsAttrs, c as createId, b as boxWith, d as attachRef, m as mergeProps } from './create-id.js-BN8YEFln.js';

//#region node_modules/bits-ui/dist/bits/progress/progress.svelte.js
var progressAttrs = createBitsAttrs({
	component: "progress",
	parts: ["root"]
});
var ProgressRootState = class ProgressRootState {
	static create(opts) {
		return new ProgressRootState(opts);
	}
	opts;
	attachment;
	constructor(opts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
	}
	#props = derived(() => ({
		role: "progressbar",
		value: this.opts.value.current,
		"aria-valuemin": this.opts.min.current,
		"aria-valuemax": this.opts.max.current,
		"aria-valuenow": this.opts.value.current === null ? void 0 : this.opts.value.current,
		"data-value": this.opts.value.current === null ? void 0 : this.opts.value.current,
		"data-state": getProgressDataState(this.opts.value.current, this.opts.max.current),
		"data-max": this.opts.max.current,
		"data-min": this.opts.min.current,
		"data-indeterminate": this.opts.value.current === null ? "" : void 0,
		[progressAttrs.root]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
function getProgressDataState(value, max) {
	if (value === null) return "indeterminate";
	return value === max ? "loaded" : "loading";
}
//#endregion
//#region node_modules/bits-ui/dist/bits/progress/components/progress.svelte
function Progress$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { child, children, value = 0, max = 100, min = 0, id = createId(uid), ref = null, $$slots, $$events, ...restProps } = $$props;
		const rootState = ProgressRootState.create({
			value: boxWith(() => value),
			max: boxWith(() => max),
			min: boxWith(() => min),
			id: boxWith(() => id),
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
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/progress/progress.svelte
function Progress($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, max = 100, value, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Progress$1) {
				$$renderer.push("<!--[-->");
				Progress$1($$renderer, spread_props([
					{
						"data-slot": "progress",
						class: cn("bg-muted h-1.5 rounded-full relative flex w-full items-center overflow-x-hidden", className),
						value,
						max
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
						children: ($$renderer) => {
							$$renderer.push(`<div data-slot="progress-indicator" class="bg-primary size-full flex-1 transition-all"${attr_style(`transform: translateX(-${stringify(100 - 100 * (value ?? 0) / (max ?? 1))}%)`)}></div>`);
						},
						$$slots: { default: true }
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

export { Progress as P };
//# sourceMappingURL=progress.js-Dt-zKABp.js.map
