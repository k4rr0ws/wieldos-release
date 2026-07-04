import { g as getSetting } from './settings.js-B6ViW1Gq.js';
import { createHmac } from 'node:crypto';

//#region src/lib/server/auth.js
var COOKIE_NAME = "wieldos_session";
var HMAC_MSG = "wieldos-session-v1";
function pinHmac(pin) {
	return createHmac("sha256", String(pin)).update(HMAC_MSG).digest("hex");
}
function getPin() {
	return String(getSetting("DASHBOARD_PIN") ?? "").trim();
}
function isPinConfigured() {
	return Boolean(getPin());
}
function verifyPin(submitted) {
	const pin = getPin();
	if (!pin) return true;
	return String(submitted).trim() === pin;
}
function makeSessionToken() {
	return pinHmac(getPin());
}
function isValidSession(cookieValue) {
	const pin = getPin();
	if (!pin) return true;
	if (!cookieValue) return false;
	return cookieValue === pinHmac(pin);
}
var COOKIE_OPTIONS = {
	path: "/",
	httpOnly: true,
	sameSite: "lax",
	maxAge: 3600 * 24 * 7,
	secure: false
};

export { COOKIE_NAME as C, isValidSession as a, COOKIE_OPTIONS as b, isPinConfigured as i, makeSessionToken as m, verifyPin as v };
//# sourceMappingURL=auth.js-DmprVbMF.js.map
