import { p as pendingDispatchCount } from '../../chunks/agents.js-DSCIW6gH.js';
import { t as themeFontUrls, b as buildThemeCss } from '../../chunks/theme.js-DVGyOT_Y.js';
import { g as getActiveTheme } from '../../chunks/themes.js-DSkb-kw0.js';

//#region src/routes/+layout.server.js
function load() {
	const theme = getActiveTheme();
	return {
		pendingApprovals: pendingDispatchCount(),
		themeCss: theme ? buildThemeCss(theme.tokens) : "",
		themeFontUrls: theme ? themeFontUrls(theme.tokens) : []
	};
}

var _layout_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

export { _layout_server as _ };
//# sourceMappingURL=_layout.server.js-Cyzkt2oI.js.map
