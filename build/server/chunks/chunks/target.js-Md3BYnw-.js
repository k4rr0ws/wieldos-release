import { a3 as spread_props } from './server.js-BeDXxHyW.js';
import { I as Icon } from './button.js-BKCc13Pl.js';

//#region node_modules/@lucide/svelte/dist/icons/circle-check.svelte
function Circle_check($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "circle-check" },
		props,
		{ iconNode: [["circle", {
			"cx": "12",
			"cy": "12",
			"r": "10"
		}], ["path", { "d": "m9 12 2 2 4-4" }]] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/target.svelte
function Target($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "target" },
		props,
		{ iconNode: [
			["circle", {
				"cx": "12",
				"cy": "12",
				"r": "10"
			}],
			["circle", {
				"cx": "12",
				"cy": "12",
				"r": "6"
			}],
			["circle", {
				"cx": "12",
				"cy": "12",
				"r": "2"
			}]
		] }
	]));
}

export { Circle_check as C, Target as T };
//# sourceMappingURL=target.js-Md3BYnw-.js.map
