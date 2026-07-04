import { a9 as escape_html } from '../../chunks/server.js-BeDXxHyW.js';
import { p as page } from '../../chunks/state.js-DqT00El0.js';
import '../../chunks/shared.js-CgP5r6wP.js';
import '../../chunks/client.js-u-B9u8_c.js';
import '../../chunks/exports.js-Y2Zp5fEj.js';
import '../../chunks/internal2.js-0xtVfVtb.js';
import '../../chunks/index-server.js-YgGoPwWh.js';
import '../../chunks/chunk.js-BBx_TEkp.js';
import '../../chunks/utils.js-UusfKV9V.js';

//#region node_modules/@sveltejs/kit/src/runtime/components/svelte-5/error.svelte
function Error($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<h1>${escape_html(page.status)}</h1> <p>${escape_html(page.error?.message)}</p>`);
	});
}

export { Error as default };
//# sourceMappingURL=error.svelte.js-CAtUyM7r.js.map
