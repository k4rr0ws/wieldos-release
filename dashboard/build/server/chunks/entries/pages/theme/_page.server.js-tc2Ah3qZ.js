import { n as normalizeTokens } from '../../../chunks/theme.js-DVGyOT_Y.js';
import { d as deleteTheme, a as getTheme, c as createTheme, b as activateTheme, u as updateTheme, l as listThemes } from '../../../chunks/themes.js-D7tp0BQd.js';
import { A as fail } from '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/theme/+page.server.js
function load() {
	const themes = listThemes();
	return {
		themes,
		activeThemeId: themes.find((t) => t.isActive)?.id ?? null
	};
}
function tokensFromForm(data) {
	try {
		return normalizeTokens(JSON.parse(String(data.get("tokens") ?? "{}")));
	} catch {
		return null;
	}
}
function uniqueName(desired) {
	const taken = new Set(listThemes().map((t) => t.name.toLowerCase()));
	const base = desired.trim() || "Theme";
	if (!taken.has(base.toLowerCase())) return base;
	for (let i = 2; i < 1e3; i++) {
		const candidate = `${base} ${i}`;
		if (!taken.has(candidate.toLowerCase())) return candidate;
	}
	return `${base} ${Date.now()}`;
}
var actions = {
	activate: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id || !getTheme(id)) return fail(400, { message: "Unknown theme." });
		activateTheme(id);
		return { success: true };
	},
	save: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id || !getTheme(id)) return fail(400, { message: "Unknown theme." });
		const tokens = tokensFromForm(data);
		if (!tokens) return fail(400, { message: "Invalid theme data." });
		updateTheme(id, {
			tokens,
			name: String(data.get("name") ?? "").trim() || void 0
		});
		return {
			success: true,
			saved: true
		};
	},
	create: async ({ request }) => {
		const data = await request.formData();
		const theme = createTheme({
			name: uniqueName(String(data.get("name") ?? "Custom")),
			tokens: tokensFromForm(data) ?? normalizeTokens({})
		});
		activateTheme(theme.id);
		return {
			success: true,
			createdId: theme.id
		};
	},
	duplicate: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		const source = id ? getTheme(id) : null;
		if (!source) return fail(400, { message: "Unknown theme." });
		const theme = createTheme({
			name: uniqueName(`${source.name} copy`),
			tokens: source.tokens
		});
		activateTheme(theme.id);
		return {
			success: true,
			createdId: theme.id
		};
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing theme id." });
		if (!deleteTheme(id)) return fail(400, { message: "Cannot delete the last theme." });
		return { success: true };
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-tc2Ah3qZ.js.map
