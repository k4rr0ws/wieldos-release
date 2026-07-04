import { a7 as attr_class, X as clsx$1, a0 as attr, Y as bind_props, a3 as spread_props } from './server.js-BeDXxHyW.js';
import { c as cn, I as Icon } from './button.js-BKCc13Pl.js';

//#region node_modules/@lucide/svelte/dist/icons/chevron-down.svelte
function Chevron_down($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "chevron-down" },
		props,
		{ iconNode: [["path", { "d": "m6 9 6 6 6-6" }]] }
	]));
}
//#endregion
//#region src/lib/components/ui/native-select/native-select.svelte
function Native_select($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, value = void 0, class: className, size = "default", children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attr_class(clsx$1(cn("cn-native-select-wrapper group/native-select relative w-fit has-[select:disabled]:opacity-50", className)))} data-slot="native-select-wrapper"${attr("data-size", size)}>`);
		$$renderer.select({
			value,
			this: ref,
			"data-slot": "native-select",
			"data-size": size,
			class: "border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-9 w-full min-w-0 appearance-none rounded-md border bg-transparent py-1 pr-8 pl-2.5 text-sm shadow-xs transition-[color,box-shadow] select-none focus-visible:ring-3 aria-invalid:ring-3 data-[size=sm]:h-8 outline-none disabled:pointer-events-none disabled:cursor-not-allowed [&amp;_option]:bg-popover [&amp;_option]:text-popover-foreground [&amp;_optgroup]:bg-popover [&amp;_optgroup]:text-popover-foreground",
			...restProps
		}, ($$renderer) => {
			children?.($$renderer);
			$$renderer.push(`<!---->`);
		}, void 0, void 0, void 0, void 0, true);
		$$renderer.push(` `);
		Chevron_down($$renderer, {
			class: "text-muted-foreground top-1/2 right-2.5 size-4 -translate-y-1/2 pointer-events-none absolute select-none",
			"aria-hidden": true,
			"data-slot": "native-select-icon"
		});
		$$renderer.push(`<!----></div>`);
		bind_props($$props, {
			ref,
			value
		});
	});
}

export { Chevron_down as C, Native_select as N };
//# sourceMappingURL=native-select.js-BcwRQfN8.js.map
