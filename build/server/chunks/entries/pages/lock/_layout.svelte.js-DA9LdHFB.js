import { a1 as head } from '../../../chunks/server.js-BeDXxHyW.js';
import '../../../chunks/shared.js-CgP5r6wP.js';

//#region src/routes/lock/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	head("8dalkb", $$renderer, ($$renderer) => {
		$$renderer.push(`<link rel="icon" href="/favicon.svg"/>`);
	});
	children($$renderer);
	$$renderer.push(`<!---->`);
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte.js-DA9LdHFB.js.map
