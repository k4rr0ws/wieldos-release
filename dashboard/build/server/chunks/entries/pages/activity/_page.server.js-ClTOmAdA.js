import { q as listAllDispatches, s as dispatchStats } from '../../../chunks/agents.js-xaDulNxk.js';
import { s as schedulerHealth, l as listActivity } from '../../../chunks/activity2.js-ocJf-Bki.js';

//#region src/routes/activity/+page.server.js
function load() {
	return {
		stats: dispatchStats(),
		runs: listAllDispatches(60),
		activity: listActivity({ limit: 40 }),
		scheduler: schedulerHealth()
	};
}

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-ClTOmAdA.js.map
