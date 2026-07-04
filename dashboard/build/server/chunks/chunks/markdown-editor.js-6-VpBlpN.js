import { Y as bind_props, _ as ensure_array_like, a9 as escape_html, a3 as spread_props } from './server.js-BeDXxHyW.js';
import { t as tick } from './index-server.js-YgGoPwWh.js';
import { B as Button, c as cn, I as Icon } from './button.js-BKCc13Pl.js';
import { T as Textarea } from './textarea.js-OJ5frhCS.js';
import { M as Markdown } from './markdown.js-CoQQw_ZF.js';

//#region node_modules/@lucide/svelte/dist/icons/bold.svelte
function Bold($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "bold" },
		props,
		{ iconNode: [["path", { "d": "M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" }]] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/italic.svelte
function Italic($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "italic" },
		props,
		{ iconNode: [
			["line", {
				"x1": "19",
				"x2": "10",
				"y1": "4",
				"y2": "4"
			}],
			["line", {
				"x1": "14",
				"x2": "5",
				"y1": "20",
				"y2": "20"
			}],
			["line", {
				"x1": "15",
				"x2": "9",
				"y1": "4",
				"y2": "20"
			}]
		] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/strikethrough.svelte
function Strikethrough($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "strikethrough" },
		props,
		{ iconNode: [
			["path", { "d": "M16 4H9a3 3 0 0 0-2.83 4" }],
			["path", { "d": "M14 12a4 4 0 0 1 0 8H6" }],
			["line", {
				"x1": "4",
				"x2": "20",
				"y1": "12",
				"y2": "12"
			}]
		] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/code.svelte
function Code($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "code" },
		props,
		{ iconNode: [["path", { "d": "m16 18 6-6-6-6" }], ["path", { "d": "m8 6-6 6 6 6" }]] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/link-2.svelte
function Link_2($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "link-2" },
		props,
		{ iconNode: [
			["path", { "d": "M9 17H7A5 5 0 0 1 7 7h2" }],
			["path", { "d": "M15 7h2a5 5 0 1 1 0 10h-2" }],
			["line", {
				"x1": "8",
				"x2": "16",
				"y1": "12",
				"y2": "12"
			}]
		] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/heading-2.svelte
function Heading_2($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "heading-2" },
		props,
		{ iconNode: [
			["path", { "d": "M4 12h8" }],
			["path", { "d": "M4 18V6" }],
			["path", { "d": "M12 18V6" }],
			["path", { "d": "M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" }]
		] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/list.svelte
function List($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "list" },
		props,
		{ iconNode: [
			["path", { "d": "M3 5h.01" }],
			["path", { "d": "M3 12h.01" }],
			["path", { "d": "M3 19h.01" }],
			["path", { "d": "M8 5h13" }],
			["path", { "d": "M8 12h13" }],
			["path", { "d": "M8 19h13" }]
		] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/list-ordered.svelte
function List_ordered($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "list-ordered" },
		props,
		{ iconNode: [
			["path", { "d": "M11 5h10" }],
			["path", { "d": "M11 12h10" }],
			["path", { "d": "M11 19h10" }],
			["path", { "d": "M4 4h1v5" }],
			["path", { "d": "M4 9h2" }],
			["path", { "d": "M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02" }]
		] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/list-todo.svelte
function List_todo($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "list-todo" },
		props,
		{ iconNode: [
			["path", { "d": "M13 5h8" }],
			["path", { "d": "M13 12h8" }],
			["path", { "d": "M13 19h8" }],
			["path", { "d": "m3 17 2 2 4-4" }],
			["rect", {
				"x": "3",
				"y": "4",
				"width": "6",
				"height": "6",
				"rx": "1"
			}]
		] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/text-quote.svelte
function Text_quote($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "text-quote" },
		props,
		{ iconNode: [
			["path", { "d": "M17 5H3" }],
			["path", { "d": "M21 12H8" }],
			["path", { "d": "M21 19H8" }],
			["path", { "d": "M3 12v7" }]
		] }
	]));
}
//#endregion
//#region src/lib/components/markdown-editor.svelte
function Markdown_editor($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { value = "", class: className, rows = 14, $$slots, $$events, ...restProps } = $$props;
		let ref = null;
		let preview = false;
		async function applyEdit(next, selStart, selEnd) {
			value = next;
			await tick();
			ref.focus();
			ref.setSelectionRange(selStart, selEnd);
		}
		function surround(marker) {
			const start = ref.selectionStart;
			const end = ref.selectionEnd;
			const before = value.slice(0, start);
			const selected = value.slice(start, end);
			const after = value.slice(end);
			if (before.endsWith(marker) && after.startsWith(marker)) applyEdit(before.slice(0, -marker.length) + selected + after.slice(marker.length), start - marker.length, end - marker.length);
			else if (selected.startsWith(marker) && selected.endsWith(marker) && selected.length >= marker.length * 2) {
				const inner = selected.slice(marker.length, selected.length - marker.length);
				applyEdit(before + inner + after, start, start + inner.length);
			} else applyEdit(before + marker + selected + marker + after, start + marker.length, end + marker.length);
		}
		function prefixLines(prefix, numbered = false) {
			const start = ref.selectionStart;
			const end = ref.selectionEnd;
			const blockStart = value.lastIndexOf("\n", start - 1) + 1;
			let blockEnd = value.indexOf("\n", end);
			if (blockEnd === -1) blockEnd = value.length;
			const lines = value.slice(blockStart, blockEnd).split("\n");
			const numberedRe = /^\d+\.\s/;
			const active = lines.every((l) => numbered ? numberedRe.test(l) : l.startsWith(prefix));
			const next = lines.map((l, i) => {
				if (active) return numbered ? l.replace(numberedRe, "") : l.slice(prefix.length);
				return numbered ? `${i + 1}. ${l}` : prefix + l;
			}).join("\n");
			applyEdit(value.slice(0, blockStart) + next + value.slice(blockEnd), blockStart, blockStart + next.length);
		}
		function insertLink() {
			const start = ref.selectionStart;
			const end = ref.selectionEnd;
			const selected = value.slice(start, end) || "link text";
			const inserted = `[${selected}](url)`;
			const urlStart = start + selected.length + 3;
			applyEdit(value.slice(0, start) + inserted + value.slice(end), urlStart, urlStart + 3);
		}
		function onkeydown(event) {
			if (!(event.ctrlKey || event.metaKey)) return;
			const key = event.key.toLowerCase();
			if (key === "b") surround("**");
			else if (key === "i") surround("*");
			else if (key === "k") insertLink();
			else return;
			event.preventDefault();
		}
		const actions = [
			{
				label: "Bold (Ctrl+B)",
				icon: Bold,
				run: () => surround("**")
			},
			{
				label: "Italic (Ctrl+I)",
				icon: Italic,
				run: () => surround("*")
			},
			{
				label: "Strikethrough",
				icon: Strikethrough,
				run: () => surround("~~")
			},
			{
				label: "Inline code",
				icon: Code,
				run: () => surround("`")
			},
			{
				label: "Link (Ctrl+K)",
				icon: Link_2,
				run: insertLink
			},
			{
				label: "Heading",
				icon: Heading_2,
				run: () => prefixLines("## ")
			},
			{
				label: "Bullet list",
				icon: List,
				run: () => prefixLines("- ")
			},
			{
				label: "Numbered list",
				icon: List_ordered,
				run: () => prefixLines("", true)
			},
			{
				label: "Task list",
				icon: List_todo,
				run: () => prefixLines("- [ ] ")
			},
			{
				label: "Quote",
				icon: Text_quote,
				run: () => prefixLines("> ")
			}
		];
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="border-input dark:bg-input/30 focus-within:border-ring focus-within:ring-ring/50 rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] focus-within:ring-3"><div class="border-input flex items-center gap-0.5 border-b px-1.5 py-1"><!--[-->`);
			const each_array = ensure_array_like(actions);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let action = each_array[$$index];
				Button($$renderer, {
					type: "button",
					variant: "ghost",
					size: "icon-sm",
					class: "text-muted-foreground hover:text-foreground",
					"aria-label": action.label,
					title: action.label,
					disabled: preview,
					onclick: action.run,
					children: ($$renderer) => {
						if (action.icon) {
							$$renderer.push("<!--[-->");
							action.icon($$renderer, { class: "size-4" });
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
					},
					$$slots: { default: true }
				});
			}
			$$renderer.push(`<!--]--> <div class="ml-auto">`);
			Button($$renderer, {
				type: "button",
				variant: preview ? "secondary" : "ghost",
				size: "sm",
				class: "h-7 text-xs",
				onclick: () => preview = !preview,
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html(preview ? "Edit" : "Preview")}`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></div> `);
			Textarea($$renderer, spread_props([
				{
					rows,
					onkeydown,
					class: cn("rounded-t-none border-0 shadow-none focus-visible:ring-0", preview && "hidden", className)
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
			$$renderer.push(`<!----> `);
			if (preview) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="max-h-[55vh] min-h-32 overflow-y-auto px-3 py-2.5">`);
				if (value.trim()) {
					$$renderer.push("<!--[0-->");
					Markdown($$renderer, { source: value });
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<p class="text-muted-foreground text-sm">Nothing to preview.</p>`);
				}
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { value });
	});
}

export { Markdown_editor as M };
//# sourceMappingURL=markdown-editor.js-6-VpBlpN.js.map
