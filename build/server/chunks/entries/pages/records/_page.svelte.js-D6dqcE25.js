import { a1 as head, a9 as escape_html, a0 as attr, _ as ensure_array_like, T as derived } from '../../../chunks/server.js-BeDXxHyW.js';
import { a as SvelteSet } from '../../../chunks/index-server2.js-UaiofxX-.js';
import { B as Button } from '../../../chunks/button.js-BKCc13Pl.js';
import { I as Input } from '../../../chunks/input.js-VxJyhIEJ.js';
import { C as Checkbox, R as Record_card } from '../../../chunks/record-card.js-4n4JZ07d.js';
import '../../../chunks/client.js-BHHES_V7.js';
import { B as Boxes } from '../../../chunks/boxes.js-BpFsuqNV.js';
import { C as Card, f as Card_content } from '../../../chunks/card.js-CpJf0FPn.js';
import { P as Page_header } from '../../../chunks/page-header.js-Bo0OtOYz.js';
import { N as Native_select } from '../../../chunks/native-select.js-BcwRQfN8.js';
import { T as Trash_2 } from '../../../chunks/trash-2.js-CCEbkDYU.js';
import '../../../chunks/shared.js-CgP5r6wP.js';
import '../../../chunks/index-server.js-YgGoPwWh.js';
import '../../../chunks/chunk.js-BBx_TEkp.js';
import '../../../chunks/create-id.js-BN8YEFln.js';
import '../../../chunks/palette.js-BPVUdeAc.js';
import '../../../chunks/hidden-input.js-BC35bBrE.js';
import '../../../chunks/noop.js-D37m5eAl.js';
import '../../../chunks/separator.js-DXXH6IUo.js';
import '../../../chunks/badge.js-C8dsQDqL.js';
import '../../../chunks/datetime.js-DS-g6TQJ.js';
import '../../../chunks/check.js-DucKGNns.js';
import '../../../chunks/exports.js-Y2Zp5fEj.js';
import '../../../chunks/internal2.js-D42FY-0m.js';
import '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/records/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const selected = new SvelteSet();
		const selectedIds = derived(() => data.records.map((r) => r.id).filter((id) => selected.has(id)));
		const allSelected = derived(() => data.records.length > 0 && selectedIds().length === data.records.length);
		const someSelected = derived(() => selectedIds().length > 0 && !allSelected());
		function toggleAll(checked) {
			if (checked) for (const r of data.records) selected.add(r.id);
			else selected.clear();
		}
		head("192mfm1", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Records · WieldOS</title>`);
			});
		});
		Page_header($$renderer, {
			title: "Records",
			description: `${data.total} captured knowledge unit${data.total === 1 ? "" : "s"}`,
			icon: Boxes
		});
		$$renderer.push(`<!----> <form method="GET" class="mb-4 flex flex-wrap items-end gap-2"><div class="grid min-w-48 flex-1 gap-1.5">`);
		Input($$renderer, {
			name: "q",
			value: data.filters.search,
			placeholder: "Search metadata…"
		});
		$$renderer.push(`<!----></div> `);
		Native_select($$renderer, {
			name: "instance",
			value: data.filters.instanceId ?? "",
			class: "w-40",
			children: ($$renderer) => {
				$$renderer.option({ value: "" }, ($$renderer) => {
					$$renderer.push(`All instances`);
				});
				$$renderer.push(` <!--[-->`);
				const each_array = ensure_array_like(data.instances);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let instance = each_array[$$index];
					$$renderer.option({ value: instance.id }, ($$renderer) => {
						$$renderer.push(`${escape_html(instance.name)}`);
					});
				}
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Native_select($$renderer, {
			name: "type",
			value: data.filters.recordType,
			class: "w-40",
			children: ($$renderer) => {
				$$renderer.option({ value: "" }, ($$renderer) => {
					$$renderer.push(`All types`);
				});
				$$renderer.push(` <!--[-->`);
				const each_array_1 = ensure_array_like(data.types);
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let type = each_array_1[$$index_1];
					$$renderer.option({ value: type }, ($$renderer) => {
						$$renderer.push(`${escape_html(type)}`);
					});
				}
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Button($$renderer, {
			type: "submit",
			variant: "outline",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Apply`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		if (data.filters.search || data.filters.instanceId || data.filters.recordType || data.filters.collectorId) {
			$$renderer.push("<!--[0-->");
			Button($$renderer, {
				href: "/records",
				variant: "ghost",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Clear`);
				},
				$$slots: { default: true }
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></form> `);
		if (data.records.length === 0) {
			$$renderer.push("<!--[0-->");
			if (Card) {
				$$renderer.push("<!--[-->");
				Card($$renderer, {
					class: "border-dashed",
					children: ($$renderer) => {
						if (Card_content) {
							$$renderer.push("<!--[-->");
							Card_content($$renderer, {
								class: "flex flex-col items-center gap-3 py-16 text-center",
								children: ($$renderer) => {
									$$renderer.push(`<div class="bg-muted flex size-12 items-center justify-center rounded-xl">`);
									Boxes($$renderer, { class: "size-6" });
									$$renderer.push(`<!----></div> <div class="space-y-1"><p class="font-medium">No records${escape_html(data.total > 0 ? " match these filters" : " yet")}</p> <p class="text-muted-foreground text-sm">${escape_html(data.total > 0 ? "Try clearing the filters." : "Collectors populate this as they run.")}</p></div>`);
								},
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
					},
					$$slots: { default: true }
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="mb-3 flex items-center gap-3">`);
			Checkbox($$renderer, {
				checked: allSelected(),
				indeterminate: someSelected(),
				onCheckedChange: toggleAll,
				"aria-label": "Select all listed records"
			});
			$$renderer.push(`<!----> <span class="text-muted-foreground text-sm">${escape_html(selectedIds().length > 0 ? `${selectedIds().length} of ${data.records.length} selected` : `Select all ${data.records.length} listed`)}</span> `);
			if (selectedIds().length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<form method="POST" action="?/delete"><input type="hidden" name="ids"${attr("value", selectedIds().join(","))}/> `);
				Button($$renderer, {
					type: "submit",
					variant: "destructive",
					size: "sm",
					children: ($$renderer) => {
						Trash_2($$renderer, { class: "size-4" });
						$$renderer.push(`<!----> Delete ${escape_html(allSelected() ? "all" : selectedIds().length)}`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></form>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="grid gap-3"><!--[-->`);
			const each_array_2 = ensure_array_like(data.records);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let record = each_array_2[$$index_2];
				Record_card($$renderer, {
					record,
					selectable: true,
					selected: selected.has(record.id),
					onSelect: (checked) => checked ? selected.add(record.id) : selected.delete(record.id)
				});
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]-->`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-D6dqcE25.js.map
