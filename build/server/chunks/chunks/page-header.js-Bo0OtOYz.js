import { a9 as escape_html, T as derived } from './server.js-BeDXxHyW.js';

//#region src/lib/components/page-header.svelte
function Page_header($$renderer, $$props) {
	let { title, description, icon, children } = $$props;
	const Icon = derived(() => icon);
	$$renderer.push(`<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div class="flex items-center gap-3">`);
	if (Icon()) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="bg-muted text-foreground hidden size-10 shrink-0 items-center justify-center rounded-lg sm:flex">`);
		if (Icon()) {
			$$renderer.push("<!--[-->");
			Icon()($$renderer, { class: "size-5" });
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
		$$renderer.push(`</div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> <div class="space-y-0.5"><h1 class="text-xl font-semibold tracking-tight">${escape_html(title)}</h1> `);
	if (description) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p class="text-muted-foreground text-sm">${escape_html(description)}</p>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div></div> `);
	if (children) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex items-center gap-2">`);
		children($$renderer);
		$$renderer.push(`<!----></div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div>`);
}

export { Page_header as P };
//# sourceMappingURL=page-header.js-Bo0OtOYz.js.map
