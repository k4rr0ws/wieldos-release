import { W as attributes, X as clsx$1, a9 as escape_html, Y as bind_props } from './server.js-BeDXxHyW.js';
import { c as cn } from './button.js-BKCc13Pl.js';

//#region src/lib/components/ui/textarea/textarea.svelte
function Textarea($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, value = void 0, class: className, "data-slot": dataSlot = "textarea", $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<textarea${attributes({
			"data-slot": dataSlot,
			class: clsx$1(cn("border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-md border bg-transparent px-2.5 py-2 text-base shadow-xs transition-[color,box-shadow] focus-visible:ring-3 aria-invalid:ring-3 md:text-sm placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50", className)),
			...restProps
		})}>`);
		const $$body = escape_html(value);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea>`);
		bind_props($$props, {
			ref,
			value
		});
	});
}

export { Textarea as T };
//# sourceMappingURL=textarea.js-OJ5frhCS.js.map
