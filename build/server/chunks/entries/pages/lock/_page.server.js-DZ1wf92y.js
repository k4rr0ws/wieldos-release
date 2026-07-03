import { C as COOKIE_NAME, v as verifyPin, m as makeSessionToken, b as COOKIE_OPTIONS, a as isValidSession, i as isPinConfigured } from '../../../chunks/auth.js-CVDVLUQB.js';
import { z as redirect, A as fail } from '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/lock/+page.server.js
function load({ cookies }) {
	if (isValidSession(cookies.get("wieldos_session"))) redirect(303, "/");
	return { noPinConfigured: !isPinConfigured() };
}
var actions = {
	unlock: async ({ request, cookies }) => {
		const data = await request.formData();
		if (!verifyPin(String(data.get("pin") ?? ""))) return fail(401, { error: "Incorrect PIN." });
		cookies.set(COOKIE_NAME, makeSessionToken(), COOKIE_OPTIONS);
		redirect(303, "/");
	},
	lock: async ({ cookies }) => {
		cookies.delete(COOKIE_NAME, { path: "/" });
		redirect(303, "/lock");
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-DZ1wf92y.js.map
