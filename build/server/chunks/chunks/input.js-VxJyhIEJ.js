import { W as attributes, X as clsx$1, Y as bind_props } from './server.js-BeDXxHyW.js';
import { c as cn } from './button.js-BKCc13Pl.js';

//#region src/lib/components/ui/input/input.svelte
function Input($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, value = void 0, type, files = void 0, class: className, "data-slot": dataSlot = "input", $$slots, $$events, ...restProps } = $$props;
		if (type === "file") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<input${attributes({
				"data-slot": dataSlot,
				class: clsx$1(cn("dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-9 rounded-md border bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] file:h-7 file:text-sm file:font-medium focus-visible:ring-3 aria-invalid:ring-3 md:text-sm file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50", className)),
				type: "file",
				...restProps
			}, void 0, void 0, void 0, 4)}/>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<input${attributes({
				"data-slot": dataSlot,
				class: clsx$1(cn("dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-9 rounded-md border bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] file:h-7 file:text-sm file:font-medium focus-visible:ring-3 aria-invalid:ring-3 md:text-sm file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50", className)),
				type,
				value,
				...restProps
			}, void 0, void 0, void 0, 4)}/>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, {
			ref,
			value,
			files
		});
	});
}

export { Input as I };
//# sourceMappingURL=input.js-VxJyhIEJ.js.map
