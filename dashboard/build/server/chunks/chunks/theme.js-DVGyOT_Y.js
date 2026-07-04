import { C as CRIMSON_TOKENS } from './theme-presets.js-B35K5uvm.js';

//#region src/lib/theme.js
var COLOR_GROUPS = [
	{
		label: "Base",
		keys: [
			"background",
			"foreground",
			"card",
			"card-foreground",
			"popover",
			"popover-foreground",
			"muted",
			"muted-foreground"
		]
	},
	{
		label: "Brand",
		keys: [
			"primary",
			"primary-foreground",
			"secondary",
			"secondary-foreground",
			"accent",
			"accent-foreground"
		]
	},
	{
		label: "State",
		keys: ["destructive", "destructive-foreground"]
	},
	{
		label: "UI",
		keys: [
			"border",
			"input",
			"ring"
		]
	},
	{
		label: "Charts",
		keys: [
			"chart-1",
			"chart-2",
			"chart-3",
			"chart-4",
			"chart-5"
		]
	},
	{
		label: "Sidebar",
		keys: [
			"sidebar",
			"sidebar-foreground",
			"sidebar-primary",
			"sidebar-primary-foreground",
			"sidebar-accent",
			"sidebar-accent-foreground",
			"sidebar-border",
			"sidebar-ring"
		]
	}
];
var COLOR_KEYS = COLOR_GROUPS.flatMap((g) => g.keys);
var SHADOW_KEYS = [
	"shadow-x",
	"shadow-y",
	"shadow-blur",
	"shadow-spread",
	"shadow-opacity",
	"shadow-color"
];
var FONT_KEYS = [
	"font-sans",
	"font-serif",
	"font-mono"
];
var SHARED_KEYS = [
	"radius",
	...FONT_KEYS,
	"tracking-normal",
	"spacing"
];
/** Human label for a token key, e.g. 'sidebar-primary-foreground' → 'Sidebar primary foreground'. */
function tokenLabel(key) {
	const spaced = key.replace(/-/g, " ");
	return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
function sanitizeValue(value) {
	return String(value ?? "").replace(/[;{}<>]/g, "").trim().slice(0, 120);
}
/**
* Coerce arbitrary stored/edited data into a complete theme:
* { radius, font-*, tracking-normal, spacing, light: {…}, dark: {…} } where
* each mode holds all color tokens plus the six shadow parameters. Missing
* values fall back to Crimson (the layout.css built-ins), which also keeps
* themes saved before a token existed working unchanged.
*/
function normalizeTokens(raw) {
	const src = raw && typeof raw === "object" ? raw : {};
	const mode = (name) => {
		const given = src[name] && typeof src[name] === "object" ? src[name] : {};
		const out = {};
		for (const key of [...COLOR_KEYS, ...SHADOW_KEYS]) out[key] = sanitizeValue(given[key] ?? CRIMSON_TOKENS[name][key]);
		return out;
	};
	const out = {
		light: mode("light"),
		dark: mode("dark")
	};
	for (const key of SHARED_KEYS) out[key] = sanitizeValue(src[key] ?? CRIMSON_TOKENS[key]) || sanitizeValue(CRIMSON_TOKENS[key]);
	return out;
}
/**
* Derive the tiered shadow values from a mode's six shadow parameters. The
* tier recipe mirrors layout.css / tweakcn: 2xs+xs at half opacity, sm…xl add
* a second tighter layer, 2xl at 2.5× opacity. color-mix applies the alpha so
* any CSS color (hsl, hex, oklch) works as --shadow-color.
*/
function shadowDecls(mode) {
	const x = mode["shadow-x"];
	const y = mode["shadow-y"];
	const blur = mode["shadow-blur"];
	const spread = mode["shadow-spread"];
	const opacity = Math.max(0, parseFloat(mode["shadow-opacity"]) || 0);
	const paint = (mult) => `color-mix(in srgb, ${mode["shadow-color"]} ${Math.min(100, Math.round(opacity * mult * 100))}%, transparent)`;
	const base = (mult) => `${x} ${y} ${blur} ${spread} ${paint(mult)}`;
	const layered = (offsetY, layerBlur) => `${base(1)}, ${x} ${offsetY} ${layerBlur} -1px ${paint(1)}`;
	return [
		`--shadow-2xs: ${base(.5)};`,
		`--shadow-xs: ${base(.5)};`,
		`--shadow-sm: ${layered("1px", "2px")};`,
		`--shadow: ${layered("1px", "2px")};`,
		`--shadow-md: ${layered("2px", "4px")};`,
		`--shadow-lg: ${layered("4px", "6px")};`,
		`--shadow-xl: ${layered("8px", "10px")};`,
		`--shadow-2xl: ${base(2.5)};`
	];
}
var GENERIC_FAMILIES = new Set([
	"sans-serif",
	"serif",
	"monospace",
	"cursive",
	"fantasy",
	"math",
	"system-ui",
	"ui-sans-serif",
	"ui-serif",
	"ui-monospace",
	"ui-rounded"
]);
var BUNDLED_FAMILIES = new Set([
	"inter",
	"inter variable",
	"courier new",
	"courier",
	"arial",
	"helvetica",
	"helvetica neue",
	"georgia",
	"times new roman",
	"times",
	"trebuchet ms",
	"verdana",
	"tahoma",
	"impact",
	"comic sans ms",
	"segoe ui",
	"apple system",
	"-apple-system",
	"blinkmacsystemfont"
]);
/**
* Google Fonts stylesheet URLs for a theme's font stacks. Only the first
* (primary) family of each stack is loaded; generic and locally bundled
* families are skipped. One URL per family so an unknown font name fails
* alone (the css2 endpoint rejects the whole request otherwise) and the
* stack's fallbacks still apply.
*/
function themeFontUrls(tokens) {
	const t = normalizeTokens(tokens);
	const families = /* @__PURE__ */ new Set();
	for (const key of FONT_KEYS) {
		const first = String(t[key]).split(",")[0].trim().replace(/^["']+|["']+$/g, "").trim();
		if (!first) continue;
		const lower = first.toLowerCase();
		if (GENERIC_FAMILIES.has(lower) || BUNDLED_FAMILIES.has(lower)) continue;
		families.add(first);
	}
	return [...families].map((family) => `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}:wght@400;500;600;700&display=swap`);
}
/**
* Generate the CSS that applies a theme's tokens at runtime. `weight` repeats
* `:root` to raise specificity so the generated rules win over layout.css's
* static fallback (weight 2) and, for the page's live preview, over the
* layout's own injected block (weight 3).
*/
function buildThemeCss(tokens, { weight = 2 } = {}) {
	const t = normalizeTokens(tokens);
	const root = ":root".repeat(weight);
	const decls = (mode) => [
		...SHARED_KEYS.map((k) => `--${k}: ${t[k]};`),
		...COLOR_KEYS.map((k) => `--${k}: ${mode[k]};`),
		...SHADOW_KEYS.map((k) => `--${k}: ${mode[k]};`),
		...shadowDecls(mode)
	].join(" ");
	return `${root} { ${decls(t.light)} }\n${root}.dark { ${decls(t.dark)} }`;
}

export { COLOR_GROUPS as C, FONT_KEYS as F, SHADOW_KEYS as S, tokenLabel as a, buildThemeCss as b, normalizeTokens as n, themeFontUrls as t };
//# sourceMappingURL=theme.js-DVGyOT_Y.js.map
