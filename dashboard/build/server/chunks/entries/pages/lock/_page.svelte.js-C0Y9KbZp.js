import { a9 as escape_html } from '../../../chunks/server.js-BeDXxHyW.js';
import { B as Button } from '../../../chunks/button.js-BKCc13Pl.js';
import { I as Input } from '../../../chunks/input.js-VxJyhIEJ.js';
import { L as Label } from '../../../chunks/label.js-C7a3GAk3.js';
import '../../../chunks/client.js-u-B9u8_c.js';
import { L as Lock_keyhole } from '../../../chunks/lock-keyhole.js-BWlBQyJL.js';
import '../../../chunks/shared.js-CgP5r6wP.js';
import '../../../chunks/create-id.js-BN8YEFln.js';
import '../../../chunks/palette.js-BPVUdeAc.js';
import '../../../chunks/index-server2.js-UaiofxX-.js';
import '../../../chunks/exports.js-Y2Zp5fEj.js';
import '../../../chunks/internal2.js-0xtVfVtb.js';
import '../../../chunks/index-server.js-YgGoPwWh.js';
import '../../../chunks/chunk.js-BBx_TEkp.js';
import '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/lock/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		$$renderer.push(`<div class="min-h-screen flex items-center justify-center bg-background"><div class="w-full max-w-sm space-y-6 rounded-xl border bg-card p-8 shadow-sm"><div class="flex flex-col items-center gap-3"><div class="bg-muted flex size-12 items-center justify-center rounded-xl">`);
		Lock_keyhole($$renderer, { class: "size-6" });
		$$renderer.push(`<!----></div> <div class="text-center"><h1 class="text-lg font-semibold">WieldOS</h1> <p class="text-muted-foreground text-sm">Enter your PIN to unlock</p></div></div> `);
		if (data.noPinConfigured) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-2 text-center"><p class="text-muted-foreground text-sm">No PIN configured.</p> <p class="text-muted-foreground text-sm">Set a <strong>Dashboard PIN</strong> in Settings to enable locking.</p> `);
			Button($$renderer, {
				href: "/",
				variant: "outline",
				class: "w-full",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Go to dashboard`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<form method="POST" action="?/unlock"><div class="grid gap-2">`);
			Label($$renderer, {
				for: "pin",
				children: ($$renderer) => {
					$$renderer.push(`<!---->PIN`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "pin",
				name: "pin",
				type: "password",
				placeholder: "••••",
				autofocus: true,
				required: true
			});
			$$renderer.push(`<!----></div> `);
			if (form?.error) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-destructive text-sm text-center">${escape_html(form.error)}</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			Button($$renderer, {
				type: "submit",
				class: "w-full",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Unlock`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></form>`);
		}
		$$renderer.push(`<!--]--></div> <p class="text-muted-foreground text-center text-xs mt-4">WieldOS</p></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-C0Y9KbZp.js.map
