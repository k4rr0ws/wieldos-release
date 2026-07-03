import { i as insertActivity } from './activity2.js-uHW7HsJq.js';

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
//# sourceMappingURL=log.js-D10-n4Pe.js.map
