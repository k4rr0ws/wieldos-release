import { a1 as head, T as derived, z as run, a2 as html, _ as ensure_array_like, a0 as attr, a9 as escape_html, a6 as stringify, a7 as attr_class, a8 as attr_style, a3 as spread_props } from '../../../chunks/server.js-BeDXxHyW.js';
import { P as Palette } from '../../../chunks/palette.js-BPVUdeAc.js';
import { B as Button, I as Icon } from '../../../chunks/button.js-BKCc13Pl.js';
import { I as Input } from '../../../chunks/input.js-VxJyhIEJ.js';
import { L as Label } from '../../../chunks/label.js-C7a3GAk3.js';
import '../../../chunks/client.js-BHHES_V7.js';
import { F as FONT_KEYS, a as tokenLabel, C as COLOR_GROUPS, S as SHADOW_KEYS, b as buildThemeCss, t as themeFontUrls } from '../../../chunks/theme.js-DVGyOT_Y.js';
import { C as Card, a as Card_header, c as Card_title, f as Card_content } from '../../../chunks/card.js-CpJf0FPn.js';
import { B as Badge } from '../../../chunks/badge.js-C8dsQDqL.js';
import { P as Page_header } from '../../../chunks/page-header.js-Bo0OtOYz.js';
import { P as Plus } from '../../../chunks/plus.js-BImBz3Qf.js';
import { T as Trash_2 } from '../../../chunks/trash-2.js-CCEbkDYU.js';
import { C as Check } from '../../../chunks/check.js-DucKGNns.js';
import '../../../chunks/shared.js-CgP5r6wP.js';
import '../../../chunks/index-server2.js-UaiofxX-.js';
import '../../../chunks/create-id.js-BN8YEFln.js';
import '../../../chunks/exports.js-Y2Zp5fEj.js';
import '../../../chunks/internal2.js-D42FY-0m.js';
import '../../../chunks/index-server.js-YgGoPwWh.js';
import '../../../chunks/chunk.js-BBx_TEkp.js';
import '../../../chunks/utils.js-UusfKV9V.js';
import '../../../chunks/theme-presets.js-B35K5uvm.js';

//#region src/lib/color.js
function linearToSrgb(c) {
	return c <= .0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - .055;
}
function clamp01(x) {
	return Math.min(1, Math.max(0, x));
}
/** Parse an `oklch(L C H)` CSS string; L may be a number or percentage. Returns { l, c, h } or null. */
function parseOklch(value) {
	const match = /^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*\)$/i.exec(String(value ?? "").trim());
	if (!match) return null;
	return {
		l: match[1].endsWith("%") ? parseFloat(match[1]) / 100 : parseFloat(match[1]),
		c: parseFloat(match[2]),
		h: parseFloat(match[3])
	};
}
/** Convert an oklch CSS string (or hex passthrough) to '#rrggbb'. Returns null when unparseable. */
function oklchToHex(value) {
	const str = String(value ?? "").trim();
	if (/^#[0-9a-f]{6}$/i.test(str)) return str.toLowerCase();
	if (/^#[0-9a-f]{3}$/i.test(str)) return `#${str[1]}${str[1]}${str[2]}${str[2]}${str[3]}${str[3]}`.toLowerCase();
	const parsed = parseOklch(str);
	if (!parsed) return null;
	const { l: L, c: C, h: H } = parsed;
	const hRad = H * Math.PI / 180;
	const a = C * Math.cos(hRad);
	const b = C * Math.sin(hRad);
	const l_ = L + .3963377774 * a + .2158037573 * b;
	const m_ = L - .1055613458 * a - .0638541728 * b;
	const s_ = L - .0894841775 * a - 1.291485548 * b;
	const l = l_ ** 3;
	const m = m_ ** 3;
	const s = s_ ** 3;
	return `#${[
		4.0767416621 * l - 3.3077115913 * m + .2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - .3413193965 * s,
		-0.0041960863 * l - .7034186147 * m + 1.707614701 * s
	].map((ch) => Math.round(clamp01(linearToSrgb(clamp01(ch))) * 255)).map((ch) => ch.toString(16).padStart(2, "0")).join("")}`;
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/copy.svelte
function Copy($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "copy" },
		props,
		{ iconNode: [["rect", {
			"width": "14",
			"height": "14",
			"x": "8",
			"y": "8",
			"rx": "2",
			"ry": "2"
		}], ["path", { "d": "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }]] }
	]));
}
//#endregion
//#region src/lib/components/theme-editor.svelte
function Theme_editor($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { theme, themeCount = 1, saved = false } = $$props;
		let tokens = run(() => structuredClone(theme.tokens));
		let name = run(() => theme.name);
		let editMode = "light";
		const previewCss = derived(() => buildThemeCss(tokens, { weight: 3 }));
		const tokensJson = derived(() => JSON.stringify(tokens));
		let fontUrls = run(() => themeFontUrls(theme.tokens));
		const layoutFields = [
			"radius",
			"spacing",
			"tracking-normal"
		];
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("1knd5j3", $$renderer, ($$renderer) => {
				$$renderer.push(`${html(`<style>${previewCss()}</style>`)} <!--[-->`);
				const each_array = ensure_array_like(fontUrls);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let url = each_array[$$index];
					$$renderer.push(`<link rel="stylesheet"${attr("href", url)}/>`);
				}
				$$renderer.push(`<!--]-->`);
			});
			if (Card) {
				$$renderer.push("<!--[-->");
				Card($$renderer, {
					children: ($$renderer) => {
						if (Card_header) {
							$$renderer.push("<!--[-->");
							Card_header($$renderer, {
								class: "flex-row items-center justify-between gap-2 space-y-0",
								children: ($$renderer) => {
									if (Card_title) {
										$$renderer.push("<!--[-->");
										Card_title($$renderer, {
											class: "text-sm",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Editing “${escape_html(name)}”`);
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(` <div class="flex items-center gap-2"><form method="POST" action="/theme?/duplicate"><input type="hidden" name="id"${attr("value", theme.id)}/> `);
									Button($$renderer, {
										type: "submit",
										variant: "outline",
										size: "sm",
										children: ($$renderer) => {
											Copy($$renderer, { class: "size-4" });
											$$renderer.push(`<!----> Duplicate`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></form> `);
									if (themeCount > 1) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<form method="POST" action="/theme?/delete"><input type="hidden" name="id"${attr("value", theme.id)}/> `);
										Button($$renderer, {
											type: "submit",
											variant: "ghost",
											size: "icon-sm",
											"aria-label": "Delete theme",
											class: "text-muted-foreground hover:text-destructive",
											children: ($$renderer) => {
												Trash_2($$renderer, { class: "size-4" });
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----></form>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></div>`);
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
								children: ($$renderer) => {
									$$renderer.push(`<form id="theme-form" method="POST" action="/theme?/save" class="grid gap-6"><input type="hidden" name="id"${attr("value", theme.id)}/> <input type="hidden" name="tokens"${attr("value", tokensJson())}/> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "theme-name",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Name`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "theme-name",
										name: "name",
										required: true,
										get value() {
											return name;
										},
										set value($$value) {
											name = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----></div> <div class="grid gap-3"><p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Typography</p> <div class="grid gap-3 sm:grid-cols-3"><!--[-->`);
									const each_array_1 = ensure_array_like(FONT_KEYS);
									for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
										let key = each_array_1[$$index_1];
										$$renderer.push(`<div class="grid gap-1">`);
										Label($$renderer, {
											for: `shared-${stringify(key)}`,
											class: "text-xs",
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(tokenLabel(key))}`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										Input($$renderer, {
											id: `shared-${stringify(key)}`,
											class: "h-8 font-mono text-xs",
											spellcheck: "false",
											get value() {
												return tokens[key];
											},
											set value($$value) {
												tokens[key] = $$value;
												$$settled = false;
											}
										});
										$$renderer.push(`<!----></div>`);
									}
									$$renderer.push(`<!--]--></div></div> <div class="grid gap-3"><p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Layout</p> <div class="grid gap-3 sm:grid-cols-3"><!--[-->`);
									const each_array_2 = ensure_array_like(layoutFields);
									for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
										let key = each_array_2[$$index_2];
										$$renderer.push(`<div class="grid gap-1">`);
										Label($$renderer, {
											for: `shared-${stringify(key)}`,
											class: "text-xs",
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(tokenLabel(key))}`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										Input($$renderer, {
											id: `shared-${stringify(key)}`,
											class: "h-8 font-mono text-xs",
											spellcheck: "false",
											placeholder: "e.g. 0.4rem",
											get value() {
												return tokens[key];
											},
											set value($$value) {
												tokens[key] = $$value;
												$$settled = false;
											}
										});
										$$renderer.push(`<!----></div>`);
									}
									$$renderer.push(`<!--]--></div></div> <div class="bg-muted flex w-fit gap-1 rounded-md p-1"><button type="button"${attr_class(`rounded px-3 py-1 text-sm bg-background shadow-sm`)}>Light</button> <button type="button"${attr_class(`rounded px-3 py-1 text-sm text-muted-foreground`)}>Dark</button></div> <!--[-->`);
									const each_array_3 = ensure_array_like(COLOR_GROUPS);
									for (let $$index_4 = 0, $$length = each_array_3.length; $$index_4 < $$length; $$index_4++) {
										let group = each_array_3[$$index_4];
										$$renderer.push(`<div class="grid gap-3"><p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">${escape_html(group.label)}</p> <div class="grid gap-3 sm:grid-cols-2"><!--[-->`);
										const each_array_4 = ensure_array_like(group.keys);
										for (let $$index_3 = 0, $$length = each_array_4.length; $$index_3 < $$length; $$index_3++) {
											let key = each_array_4[$$index_3];
											const hex = oklchToHex(tokens[editMode][key]);
											$$renderer.push(`<div class="flex items-center gap-2">`);
											if (hex) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<input type="color"${attr("value", hex)}${attr("aria-label", `Pick ${stringify(tokenLabel(key))} color`)} class="size-8 shrink-0 cursor-pointer rounded-md border bg-transparent p-0.5 [&amp;::-moz-color-swatch]:rounded-sm [&amp;::-moz-color-swatch]:border-0 [&amp;::-webkit-color-swatch]:rounded-sm [&amp;::-webkit-color-swatch]:border-0 [&amp;::-webkit-color-swatch-wrapper]:p-0"/>`);
											} else {
												$$renderer.push("<!--[-1-->");
												$$renderer.push(`<span class="size-8 shrink-0 rounded-md border"${attr_style(`background: ${stringify(tokens[editMode][key])}`)}></span>`);
											}
											$$renderer.push(`<!--]--> <div class="grid flex-1 gap-1">`);
											Label($$renderer, {
												for: `${stringify(editMode)}-${stringify(key)}`,
												class: "text-xs",
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(tokenLabel(key))}`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Input($$renderer, {
												id: `${stringify(editMode)}-${stringify(key)}`,
												class: "h-8 font-mono text-xs",
												spellcheck: "false",
												get value() {
													return tokens[editMode][key];
												},
												set value($$value) {
													tokens[editMode][key] = $$value;
													$$settled = false;
												}
											});
											$$renderer.push(`<!----></div></div>`);
										}
										$$renderer.push(`<!--]--></div></div>`);
									}
									$$renderer.push(`<!--]--> <div class="grid gap-3"><p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Shadow (${escape_html(editMode)})</p> <div class="grid gap-3 sm:grid-cols-3"><!--[-->`);
									const each_array_5 = ensure_array_like(SHADOW_KEYS);
									for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
										let key = each_array_5[$$index_5];
										$$renderer.push(`<div class="flex items-center gap-2">`);
										if (key === "shadow-color") {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<span class="size-8 shrink-0 rounded-md border"${attr_style(`background: ${stringify(tokens[editMode][key])}`)}></span>`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> <div class="grid flex-1 gap-1">`);
										Label($$renderer, {
											for: `${stringify(editMode)}-${stringify(key)}`,
											class: "text-xs",
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(tokenLabel(key))}`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										Input($$renderer, {
											id: `${stringify(editMode)}-${stringify(key)}`,
											class: "h-8 font-mono text-xs",
											spellcheck: "false",
											get value() {
												return tokens[editMode][key];
											},
											set value($$value) {
												tokens[editMode][key] = $$value;
												$$settled = false;
											}
										});
										$$renderer.push(`<!----></div></div>`);
									}
									$$renderer.push(`<!--]--></div> <div class="bg-muted/50 flex items-center justify-center rounded-md border p-6"><div class="bg-card text-card-foreground rounded-md border px-6 py-3 text-sm" style="box-shadow: var(--shadow-md); border-radius: var(--radius);">Shadow preview</div></div></div> `);
									if (saved) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<p class="text-muted-foreground text-xs">Theme saved.</p>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> <div class="flex justify-end">`);
									Button($$renderer, {
										type: "submit",
										children: ($$renderer) => {
											Check($$renderer, { class: "size-4" });
											$$renderer.push(`<!----> Save changes`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div></form>`);
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
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
//#region src/routes/theme/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		const activeTheme = derived(() => data.themes.find((t) => t.id === data.activeThemeId) ?? data.themes[0] ?? null);
		head("1y3nc6e", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Theme · WieldOS</title>`);
			});
		});
		Page_header($$renderer, {
			title: "Theme",
			description: "Select a theme, then fine-tune its colors, typography, and shadows",
			icon: Palette,
			children: ($$renderer) => {
				$$renderer.push(`<form method="POST" action="?/create">`);
				Button($$renderer, {
					type: "submit",
					size: "sm",
					variant: "outline",
					children: ($$renderer) => {
						Plus($$renderer, { class: "size-4" });
						$$renderer.push(`<!----> New`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></form> `);
				Button($$renderer, {
					type: "submit",
					size: "sm",
					form: "theme-form",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Save changes`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
			}});
		$$renderer.push(`<!----> <div class="grid gap-4 lg:grid-cols-[18rem_1fr]">`);
		if (Card) {
			$$renderer.push("<!--[-->");
			Card($$renderer, {
				class: "h-fit",
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
											$$renderer.push(`<!---->Themes`);
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
							class: "flex flex-col gap-1.5",
							children: ($$renderer) => {
								$$renderer.push(`<!--[-->`);
								const each_array = ensure_array_like(data.themes);
								for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
									let theme = each_array[$$index_1];
									$$renderer.push(`<div${attr_class(`flex items-center gap-2 rounded-md border p-2 ${theme.id === data.activeThemeId ? "border-primary bg-primary/5" : "border-border"}`)}><div class="flex flex-1 items-center gap-1.5 overflow-hidden"><!--[-->`);
									const each_array_1 = ensure_array_like([
										"primary",
										"secondary",
										"accent",
										"background"
									]);
									for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
										let swatch = each_array_1[$$index];
										$$renderer.push(`<span class="size-4 shrink-0 rounded-full border"${attr_style(`background: ${stringify(theme.tokens.light[swatch])}`)}></span>`);
									}
									$$renderer.push(`<!--]--> <span class="ml-1 truncate text-sm font-medium">${escape_html(theme.name)}</span></div> `);
									if (theme.id === data.activeThemeId) {
										$$renderer.push("<!--[0-->");
										Badge($$renderer, {
											variant: "secondary",
											class: "text-xs",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Active`);
											},
											$$slots: { default: true }
										});
									} else {
										$$renderer.push("<!--[-1-->");
										$$renderer.push(`<form method="POST" action="?/activate"><input type="hidden" name="id"${attr("value", theme.id)}/> `);
										Button($$renderer, {
											type: "submit",
											variant: "ghost",
											size: "sm",
											class: "h-7 text-xs",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Use`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----></form>`);
									}
									$$renderer.push(`<!--]--></div>`);
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
		$$renderer.push(` `);
		if (activeTheme()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<!---->`);
			Theme_editor($$renderer, {
				theme: activeTheme(),
				themeCount: data.themes.length,
				saved: Boolean(form?.saved)
			});
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-BYSzACyD.js.map
