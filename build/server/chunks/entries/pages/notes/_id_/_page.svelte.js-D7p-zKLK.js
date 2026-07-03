import { a1 as head, a9 as escape_html, a0 as attr, T as derived, _ as ensure_array_like, Y as bind_props, a3 as spread_props } from '../../../../chunks/server.js-BeDXxHyW.js';
import { t as tick } from '../../../../chunks/index-server.js-YgGoPwWh.js';
import { B as Button, c as cn, I as Icon } from '../../../../chunks/button.js-BKCc13Pl.js';
import { I as Input } from '../../../../chunks/input.js-VxJyhIEJ.js';
import { D as Dialog, b as Dialog_content, c as Dialog_header, e as Dialog_title, f as Dialog_description, d as Dialog_footer } from '../../../../chunks/dialog.js-BiupuAC8.js';
import { L as Label } from '../../../../chunks/label.js-C7a3GAk3.js';
import '../../../../chunks/client.js-BHHES_V7.js';
import { F as Folder_kanban } from '../../../../chunks/folder-kanban.js-fP0CGmTv.js';
import { C as Card, f as Card_content, a as Card_header, c as Card_title } from '../../../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../../chunks/page-header.js-Bo0OtOYz.js';
import { b as formatRelative } from '../../../../chunks/datetime.js-DS-g6TQJ.js';
import { N as Native_select } from '../../../../chunks/native-select.js-BcwRQfN8.js';
import { P as Pencil } from '../../../../chunks/pencil.js-DGUBFH_b.js';
import { T as Trash_2 } from '../../../../chunks/trash-2.js-CCEbkDYU.js';
import { T as Textarea } from '../../../../chunks/textarea.js-OJ5frhCS.js';
import { A as Arrow_left, M as Markdown } from '../../../../chunks/arrow-left.js-ycJiM6c7.js';
import { P as Pin } from '../../../../chunks/pin.js-MmVKgSyK.js';
import '../../../../chunks/shared.js-CgP5r6wP.js';
import '../../../../chunks/chunk.js-BBx_TEkp.js';
import '../../../../chunks/create-id.js-BN8YEFln.js';
import '../../../../chunks/palette.js-BPVUdeAc.js';
import '../../../../chunks/index-server2.js-UaiofxX-.js';
import '../../../../chunks/dialog-content.js-DJOVMfdX.js';
import '../../../../chunks/noop.js-D37m5eAl.js';
import '../../../../chunks/x.js-Q2Bhqwn4.js';
import '../../../../chunks/exports.js-Y2Zp5fEj.js';
import '../../../../chunks/internal2.js-D42FY-0m.js';
import '../../../../chunks/utils.js-UusfKV9V.js';

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
//#endregion
//#region src/routes/notes/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		const n = derived(() => data.note);
		let editOpen = false;
		let editTitle = "";
		let editContent = "";
		let editTags = "";
		let editProject = "";
		function openEdit() {
			editTitle = n().title;
			editContent = n().content;
			editTags = (n().tags ?? []).join(", ");
			editProject = n().projectId ? String(n().projectId) : "";
			editOpen = true;
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("7ls2f6", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>${escape_html(n().title)} · Notes</title>`);
				});
			});
			Page_header($$renderer, {
				title: n().title,
				description: `Updated ${formatRelative(n().updatedAt)}`,
				children: ($$renderer) => {
					$$renderer.push(`<form method="POST" action="?/togglePin"><input type="hidden" name="id"${attr("value", n().id)}/> `);
					Button($$renderer, {
						type: "submit",
						size: "sm",
						variant: n().pinned ? "default" : "outline",
						children: ($$renderer) => {
							Pin($$renderer, { class: `size-4 ${n().pinned ? "fill-current" : ""}` });
							$$renderer.push(`<!----> ${escape_html(n().pinned ? "Pinned" : "Pin")}`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></form> `);
					Button($$renderer, {
						size: "sm",
						variant: "outline",
						href: "/notes",
						children: ($$renderer) => {
							Arrow_left($$renderer, { class: "size-4" });
							$$renderer.push(`<!----> All notes`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				}});
			$$renderer.push(`<!----> `);
			if (Dialog) {
				$$renderer.push("<!--[-->");
				Dialog($$renderer, {
					get open() {
						return editOpen;
					},
					set open($$value) {
						editOpen = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						if (Dialog_content) {
							$$renderer.push("<!--[-->");
							Dialog_content($$renderer, {
								class: "max-h-[90vh] overflow-y-auto sm:max-w-3xl",
								children: ($$renderer) => {
									if (Dialog_header) {
										$$renderer.push("<!--[-->");
										Dialog_header($$renderer, {
											children: ($$renderer) => {
												if (Dialog_title) {
													$$renderer.push("<!--[-->");
													Dialog_title($$renderer, {
														children: ($$renderer) => {
															$$renderer.push(`<!---->Edit note`);
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
															$$renderer.push(`<!---->Update the title or content of your note. Markdown supported.`);
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
									$$renderer.push(` <form method="POST" action="?/update" class="grid gap-4"><input type="hidden" name="id"${attr("value", n().id)}/> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-title",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Title`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "edit-title",
										name: "title",
										placeholder: "Note title",
										required: true,
										get value() {
											return editTitle;
										},
										set value($$value) {
											editTitle = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-content",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Content`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Markdown_editor($$renderer, {
										id: "edit-content",
										name: "content",
										rows: 18,
										class: "max-h-[55vh] overflow-y-auto font-mono text-xs",
										get value() {
											return editContent;
										},
										set value($$value) {
											editContent = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-project",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Project`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Native_select($$renderer, {
										id: "edit-project",
										name: "projectId",
										class: "w-full",
										get value() {
											return editProject;
										},
										set value($$value) {
											editProject = $$value;
											$$settled = false;
										},
										children: ($$renderer) => {
											$$renderer.option({ value: "" }, ($$renderer) => {
												$$renderer.push(`None`);
											});
											$$renderer.push(` <!--[-->`);
											const each_array = ensure_array_like(data.projects);
											for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
												let project = each_array[$$index];
												$$renderer.option({ value: project.id }, ($$renderer) => {
													$$renderer.push(`${escape_html(project.name)}`);
												});
											}
											$$renderer.push(`<!--]-->`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "edit-tags",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Tags`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "edit-tags",
										name: "tags",
										placeholder: "e.g. ideas, defi, roadmap",
										get value() {
											return editTags;
										},
										set value($$value) {
											editTags = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----> <p class="text-muted-foreground text-xs">Separate with commas.</p></div> `);
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
			$$renderer.push(` <div class="grid gap-4 lg:grid-cols-[1fr_18rem]">`);
			if (Card) {
				$$renderer.push("<!--[-->");
				Card($$renderer, {
					children: ($$renderer) => {
						if (Card_content) {
							$$renderer.push("<!--[-->");
							Card_content($$renderer, {
								class: "pt-6",
								children: ($$renderer) => {
									if (n().content.trim()) {
										$$renderer.push("<!--[0-->");
										Markdown($$renderer, { source: n().content });
									} else {
										$$renderer.push("<!--[-1-->");
										$$renderer.push(`<p class="text-muted-foreground text-sm">This note has no content yet. Use Edit to add some (Markdown supported).</p>`);
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
			$$renderer.push(` <div class="flex flex-col gap-4">`);
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
											class: "text-sm",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Details`);
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
								class: "text-muted-foreground space-y-3 text-xs",
								children: ($$renderer) => {
									if (n().projectName) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="flex items-center justify-between gap-2"><span>Project</span> <a${attr("href", `/projects/${n().projectId}`)} class="text-foreground inline-flex items-center gap-1 hover:underline">`);
										Folder_kanban($$renderer, { class: "size-3" });
										$$renderer.push(`<!---->${escape_html(n().projectName)}</a></div>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> <div class="flex items-center justify-between gap-2"><span>Created</span><span>${escape_html(formatRelative(n().createdAt))}</span></div> <div class="flex items-center justify-between gap-2"><span>Updated</span><span>${escape_html(formatRelative(n().updatedAt))}</span></div> `);
									if (n().tags.length) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="border-border flex flex-wrap gap-1.5 border-t pt-3"><!--[-->`);
										const each_array_1 = ensure_array_like(n().tags);
										for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
											let tag = each_array_1[$$index_1];
											Badge($$renderer, {
												variant: "secondary",
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
			$$renderer.push(` `);
			if (Card) {
				$$renderer.push("<!--[-->");
				Card($$renderer, {
					children: ($$renderer) => {
						if (Card_content) {
							$$renderer.push("<!--[-->");
							Card_content($$renderer, {
								class: "flex flex-col gap-2 py-4",
								children: ($$renderer) => {
									if (form?.message) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<p class="text-destructive text-xs">${escape_html(form.message)}</p>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									Button($$renderer, {
										variant: "outline",
										size: "sm",
										onclick: openEdit,
										children: ($$renderer) => {
											Pencil($$renderer, { class: "size-4" });
											$$renderer.push(`<!----> Edit`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", n().id)}/> `);
									Button($$renderer, {
										type: "submit",
										variant: "ghost",
										size: "sm",
										class: "text-muted-foreground hover:text-destructive w-full",
										children: ($$renderer) => {
											Trash_2($$renderer, { class: "size-4" });
											$$renderer.push(`<!----> Delete`);
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
					},
					$$slots: { default: true }
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
			$$renderer.push(`</div></div>`);
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
//# sourceMappingURL=_page.svelte.js-D7p-zKLK.js.map
