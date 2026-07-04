import { i as insertActivity } from './activity2.js-ocJf-Bki.js';

//#region src/lib/server/ai/log.js
function logEvent(event, fields = {}) {
	try {
		console.log(JSON.stringify({
			ts: (/* @__PURE__ */ new Date()).toISOString(),
			src: "ai",
			event,
			...fields
		}));
	} catch {}
	try {
		insertActivity(event, fields);
	} catch {}
}

export { logEvent as l };
//# sourceMappingURL=log.js-DBWwQvzy.js.map
