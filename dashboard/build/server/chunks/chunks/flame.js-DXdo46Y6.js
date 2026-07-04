import { a3 as spread_props } from './server.js-BeDXxHyW.js';
import { I as Icon } from './button.js-BKCc13Pl.js';

//#region node_modules/@lucide/svelte/dist/icons/clock.svelte
function Clock($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "clock" },
		props,
		{ iconNode: [["circle", {
			"cx": "12",
			"cy": "12",
			"r": "10"
		}], ["path", { "d": "M12 6v6l4 2" }]] }
	]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/flame.svelte
function Flame($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "flame" },
		props,
		{ iconNode: [["path", { "d": "M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" }]] }
	]));
}

export { Clock as C, Flame as F };
//# sourceMappingURL=flame.js-DXdo46Y6.js.map
