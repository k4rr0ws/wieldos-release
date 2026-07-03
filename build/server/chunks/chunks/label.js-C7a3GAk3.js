import { Y as bind_props, a3 as spread_props, a5 as props_id, W as attributes, T as derived } from './server.js-BeDXxHyW.js';
import { c as cn } from './button.js-BKCc13Pl.js';
import { c as createId, b as boxWith, d as attachRef, m as mergeProps, a as createBitsAttrs } from './create-id.js-BN8YEFln.js';

//#region node_modules/bits-ui/dist/bits/label/label.svelte.js
var labelAttrs = createBitsAttrs({
	component: "label",
	parts: ["root"]
});
var LabelRootState = class LabelRootState {
	static create(opts) {
		return new LabelRootState(opts);
	}
	opts;
	attachment;
	constructor(opts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
		this.onmousedown = this.onmousedown.bind(this);
	}
	onmousedown(e) {
		if (e.detail > 1) e.preventDefault();
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		[labelAttrs.root]: "",
		onmousedown: this.onmousedown,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
//#endregion
//#region node_modules/bits-ui/dist/bits/label/components/label.svelte
function Label$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, id = createId(uid), ref = null, for: forProp, $$slots, $$events, ...restProps } = $$props;
		const rootState = LabelRootState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, rootState.props, { for: forProp }));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<label${attributes({
				...mergedProps(),
				for: forProp
			})}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></label>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/label/label.svelte
function Label($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Label$1) {
				$$renderer.push("<!--[-->");
				Label$1($$renderer, spread_props([
					{
						"data-slot": "label",
						class: cn("gap-2 text-sm leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed", className)
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

export { Label as L };
//# sourceMappingURL=label.js-C7a3GAk3.js.map
