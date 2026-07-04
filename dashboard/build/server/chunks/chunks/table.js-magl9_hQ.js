import { W as attributes, X as clsx$1, Y as bind_props } from './server.js-BeDXxHyW.js';
import { c as cn } from './button.js-BKCc13Pl.js';

//#region src/lib/components/ui/table/table.svelte
function Table($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div data-slot="table-container" class="relative w-full overflow-x-auto"><table${attributes({
			"data-slot": "table",
			class: clsx$1(cn("w-full caption-bottom text-sm", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></table></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/table/table-body.svelte
function Table_body($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<tbody${attributes({
			"data-slot": "table-body",
			class: clsx$1(cn("[&_tr:last-child]:border-0", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></tbody>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/table/table-cell.svelte
function Table_cell($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<td${attributes({
			"data-slot": "table-cell",
			class: clsx$1(cn("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></td>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/table/table-head.svelte
function Table_head($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<th${attributes({
			"data-slot": "table-head",
			class: clsx$1(cn("text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></th>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/table/table-header.svelte
function Table_header($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<thead${attributes({
			"data-slot": "table-header",
			class: clsx$1(cn("[&_tr]:border-b", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></thead>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/table/table-row.svelte
function Table_row($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<tr${attributes({
			"data-slot": "table-row",
			class: clsx$1(cn("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></tr>`);
		bind_props($$props, { ref });
	});
}

export { Table as T, Table_header as a, Table_body as b, Table_row as c, Table_head as d, Table_cell as e };
//# sourceMappingURL=table.js-magl9_hQ.js.map
