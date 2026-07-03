import { a3 as spread_props, a7 as attr_class, a6 as stringify, _ as ensure_array_like, a9 as escape_html, a0 as attr, X as clsx$1, T as derived } from './server.js-BeDXxHyW.js';
import { I as Icon } from './button.js-BKCc13Pl.js';

//#region src/lib/markdown.js
var SAFE_URL = /^(https?:\/\/|mailto:)/i;
var INLINE_RE = /(`([^`]+)`)|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(__([^_]+)__)|(_([^_]+)_)|(\[([^\]]+)\]\(([^)\s]+)\))|(~~([^~]+)~~)/g;
/**
* Parse inline markdown into an array of spans.
* @param {string} text
* @returns {Array<{ type: 'text'|'bold'|'italic'|'strike'|'code'|'link', text: string, href?: string }>}
*/
function parseInline(text) {
	const src = String(text ?? "");
	const spans = [];
	let last = 0;
	let m;
	INLINE_RE.lastIndex = 0;
	while (m = INLINE_RE.exec(src)) {
		if (m.index > last) spans.push({
			type: "text",
			text: src.slice(last, m.index)
		});
		if (m[2] != null) spans.push({
			type: "code",
			text: m[2]
		});
		else if (m[4] != null) spans.push({
			type: "bold",
			text: m[4]
		});
		else if (m[6] != null) spans.push({
			type: "italic",
			text: m[6]
		});
		else if (m[8] != null) spans.push({
			type: "bold",
			text: m[8]
		});
		else if (m[10] != null) spans.push({
			type: "italic",
			text: m[10]
		});
		else if (m[12] != null) {
			const href = m[13];
			if (SAFE_URL.test(href)) spans.push({
				type: "link",
				text: m[12],
				href
			});
			else spans.push({
				type: "text",
				text: m[0]
			});
		} else if (m[15] != null) spans.push({
			type: "strike",
			text: m[15]
		});
		last = m.index + m[0].length;
	}
	if (last < src.length) spans.push({
		type: "text",
		text: src.slice(last)
	});
	return spans.length ? spans : [{
		type: "text",
		text: src
	}];
}
var HEADING_RE = /^(#{1,6})\s+(.*)$/;
var HR_RE = /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/;
var QUOTE_RE = /^>\s?(.*)$/;
var ULIST_RE = /^\s*[-*+]\s+(.*)$/;
var OLIST_RE = /^\s*\d+\.\s+(.*)$/;
var TASK_RE = /^\[([ xX])\]\s+(.*)$/;
var TABLE_DELIM_RE = /^\s*\|?\s*:?-{1,}:?\s*(?:\|\s*:?-{1,}:?\s*)*\|?\s*$/;
/** Split a table row into trimmed cell strings (tolerates optional edge pipes). */
function splitRow(line) {
	let s = line.trim();
	if (s.startsWith("|")) s = s.slice(1);
	if (s.endsWith("|")) s = s.slice(0, -1);
	return s.split("|").map((c) => c.trim());
}
/** A header line followed by a delimiter row begins a GFM table. */
function isTableStart(lines, i) {
	const head = lines[i];
	const delim = lines[i + 1];
	return head != null && head.includes("|") && delim != null && TABLE_DELIM_RE.test(delim);
}
/** Per-column alignment from the delimiter row: 'left' | 'center' | 'right' | null. */
function parseAlign(delim) {
	return splitRow(delim).map((c) => {
		const left = c.startsWith(":");
		const right = c.endsWith(":");
		if (left && right) return "center";
		if (right) return "right";
		if (left) return "left";
		return null;
	});
}
/**
* Parse markdown into a flat list of block tokens.
* @param {string} source
* @returns {Array<object>}
*/
function parseMarkdown(source) {
	const lines = String(source ?? "").replace(/\r\n?/g, "\n").split("\n");
	const blocks = [];
	let i = 0;
	while (i < lines.length) {
		const line = lines[i];
		if (line.trim() === "") {
			i++;
			continue;
		}
		if (/^```/.test(line.trim())) {
			const code = [];
			i++;
			while (i < lines.length && !/^```/.test(lines[i].trim())) code.push(lines[i++]);
			i++;
			blocks.push({
				type: "code",
				code: code.join("\n")
			});
			continue;
		}
		if (HR_RE.test(line)) {
			blocks.push({ type: "hr" });
			i++;
			continue;
		}
		const heading = line.match(HEADING_RE);
		if (heading) {
			blocks.push({
				type: "heading",
				level: heading[1].length,
				inline: parseInline(heading[2])
			});
			i++;
			continue;
		}
		if (QUOTE_RE.test(line)) {
			const quote = [];
			while (i < lines.length && QUOTE_RE.test(lines[i])) quote.push(lines[i++].match(QUOTE_RE)[1]);
			blocks.push({
				type: "quote",
				inline: parseInline(quote.join(" "))
			});
			continue;
		}
		if (isTableStart(lines, i)) {
			const align = parseAlign(lines[i + 1]);
			const header = splitRow(lines[i]).map(parseInline);
			i += 2;
			const rows = [];
			while (i < lines.length && lines[i].trim() !== "" && lines[i].includes("|") && !HR_RE.test(lines[i])) rows.push(splitRow(lines[i++]).map(parseInline));
			blocks.push({
				type: "table",
				align,
				header,
				rows
			});
			continue;
		}
		if (ULIST_RE.test(line) || OLIST_RE.test(line)) {
			const ordered = OLIST_RE.test(line);
			const re = ordered ? OLIST_RE : ULIST_RE;
			const items = [];
			while (i < lines.length && re.test(lines[i])) {
				const raw = lines[i++].match(re)[1];
				const task = !ordered && raw.match(TASK_RE);
				if (task) items.push({
					checked: /x/i.test(task[1]),
					inline: parseInline(task[2])
				});
				else items.push({
					checked: null,
					inline: parseInline(raw)
				});
			}
			blocks.push({
				type: "list",
				ordered,
				items
			});
			continue;
		}
		const para = [];
		while (i < lines.length && lines[i].trim() !== "" && !/^```/.test(lines[i].trim()) && !HEADING_RE.test(lines[i]) && !HR_RE.test(lines[i]) && !QUOTE_RE.test(lines[i]) && !ULIST_RE.test(lines[i]) && !OLIST_RE.test(lines[i]) && !isTableStart(lines, i)) para.push(lines[i++]);
		blocks.push({
			type: "paragraph",
			inline: parseInline(para.join(" "))
		});
	}
	return blocks;
}
//#endregion
//#region src/lib/components/markdown.svelte
function inline($$renderer, spans) {
	$$renderer.push(`<!--[-->`);
	const each_array = ensure_array_like(spans);
	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let span = each_array[$$index];
		if (span.type === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<strong>${escape_html(span.text)}</strong>`);
		} else if (span.type === "italic") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<em>${escape_html(span.text)}</em>`);
		} else if (span.type === "strike") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<s class="opacity-70">${escape_html(span.text)}</s>`);
		} else if (span.type === "code") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<code class="bg-muted rounded px-1 py-0.5 text-[0.85em]">${escape_html(span.text)}</code>`);
		} else if (span.type === "link") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<a${attr("href", span.href)} target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-2">${escape_html(span.text)}</a>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html(span.text)}`);
		}
		$$renderer.push(`<!--]-->`);
	}
	$$renderer.push(`<!--]-->`);
}
function Markdown($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { source = "", class: className = "" } = $$props;
		const blocks = derived(() => parseMarkdown(source));
		const alignClass = (a) => a === "center" ? "text-center" : a === "right" ? "text-right" : "text-left";
		$$renderer.push(`<div${attr_class(`space-y-3 text-sm leading-relaxed ${stringify(className)}`)}><!--[-->`);
		const each_array_1 = ensure_array_like(blocks());
		for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
			let block = each_array_1[i];
			if (block.type === "heading") {
				$$renderer.push("<!--[0-->");
				if (block.level <= 2) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<h2 class="mt-2 text-lg font-semibold">`);
					inline($$renderer, block.inline);
					$$renderer.push(`<!----></h2>`);
				} else if (block.level === 3) {
					$$renderer.push("<!--[1-->");
					$$renderer.push(`<h3 class="mt-2 text-base font-semibold">`);
					inline($$renderer, block.inline);
					$$renderer.push(`<!----></h3>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<h4 class="mt-2 text-sm font-semibold">`);
					inline($$renderer, block.inline);
					$$renderer.push(`<!----></h4>`);
				}
				$$renderer.push(`<!--]-->`);
			} else if (block.type === "paragraph") {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<p>`);
				inline($$renderer, block.inline);
				$$renderer.push(`<!----></p>`);
			} else if (block.type === "code") {
				$$renderer.push("<!--[2-->");
				$$renderer.push(`<pre class="bg-muted overflow-x-auto rounded-md p-3 text-xs"><code>${escape_html(block.code)}</code></pre>`);
			} else if (block.type === "quote") {
				$$renderer.push("<!--[3-->");
				$$renderer.push(`<blockquote class="border-muted-foreground/30 text-muted-foreground border-l-2 pl-3 italic">`);
				inline($$renderer, block.inline);
				$$renderer.push(`<!----></blockquote>`);
			} else if (block.type === "list") {
				$$renderer.push("<!--[4-->");
				if (block.ordered) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<ol class="list-decimal space-y-1 pl-5"><!--[-->`);
					const each_array_2 = ensure_array_like(block.items);
					for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
						let item = each_array_2[$$index_1];
						$$renderer.push(`<li>`);
						inline($$renderer, item.inline);
						$$renderer.push(`<!----></li>`);
					}
					$$renderer.push(`<!--]--></ol>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<ul class="list-disc space-y-1 pl-5"><!--[-->`);
					const each_array_3 = ensure_array_like(block.items);
					for (let $$index_2 = 0, $$length = each_array_3.length; $$index_2 < $$length; $$index_2++) {
						let item = each_array_3[$$index_2];
						if (item.checked !== null) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<li class="-ml-5 flex list-none items-start gap-2"><input type="checkbox"${attr("checked", item.checked, true)} disabled="" class="mt-1 size-3.5"/> <span${attr_class(clsx$1(item.checked ? "text-muted-foreground line-through" : ""))}>`);
							inline($$renderer, item.inline);
							$$renderer.push(`<!----></span></li>`);
						} else {
							$$renderer.push("<!--[-1-->");
							$$renderer.push(`<li>`);
							inline($$renderer, item.inline);
							$$renderer.push(`<!----></li>`);
						}
						$$renderer.push(`<!--]-->`);
					}
					$$renderer.push(`<!--]--></ul>`);
				}
				$$renderer.push(`<!--]-->`);
			} else if (block.type === "table") {
				$$renderer.push("<!--[5-->");
				$$renderer.push(`<div class="overflow-x-auto"><table class="w-full border-collapse text-sm"><thead><tr class="border-border border-b"><!--[-->`);
				const each_array_4 = ensure_array_like(block.header);
				for (let c = 0, $$length = each_array_4.length; c < $$length; c++) {
					let cell = each_array_4[c];
					$$renderer.push(`<th${attr_class(`px-3 py-1.5 font-semibold ${stringify(alignClass(block.align[c]))}`)}>`);
					inline($$renderer, cell);
					$$renderer.push(`<!----></th>`);
				}
				$$renderer.push(`<!--]--></tr></thead><tbody><!--[-->`);
				const each_array_5 = ensure_array_like(block.rows);
				for (let r = 0, $$length = each_array_5.length; r < $$length; r++) {
					let row = each_array_5[r];
					$$renderer.push(`<tr class="border-border/50 border-b last:border-0"><!--[-->`);
					const each_array_6 = ensure_array_like(row);
					for (let c = 0, $$length = each_array_6.length; c < $$length; c++) {
						let cell = each_array_6[c];
						$$renderer.push(`<td${attr_class(`px-3 py-1.5 align-top ${stringify(alignClass(block.align[c]))}`)}>`);
						inline($$renderer, cell);
						$$renderer.push(`<!----></td>`);
					}
					$$renderer.push(`<!--]--></tr>`);
				}
				$$renderer.push(`<!--]--></tbody></table></div>`);
			} else if (block.type === "hr") {
				$$renderer.push("<!--[6-->");
				$$renderer.push(`<hr class="border-border"/>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/arrow-left.svelte
function Arrow_left($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "arrow-left" },
		props,
		{ iconNode: [["path", { "d": "m12 19-7-7 7-7" }], ["path", { "d": "M19 12H5" }]] }
	]));
}

export { Arrow_left as A, Markdown as M };
//# sourceMappingURL=arrow-left.js-ycJiM6c7.js.map
