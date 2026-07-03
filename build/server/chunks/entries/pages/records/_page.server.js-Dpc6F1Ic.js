import { l as listInstanceOptions } from '../../../chunks/instances.js-DLoGySTX.js';
import { d as deleteRecordsByIds, l as listRecordTypes, c as countRecords, b as listRecords } from '../../../chunks/records.js-CRr2Hc_8.js';
import { A as fail } from '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/records/+page.server.js
function load({ url }) {
	const instanceId = Number(url.searchParams.get("instance")) || null;
	const collectorId = Number(url.searchParams.get("collector")) || null;
	const recordType = url.searchParams.get("type") || "";
	const search = url.searchParams.get("q") || "";
	return {
		records: listRecords({
			instanceId,
			collectorId,
			recordType,
			search,
			limit: 100
		}),
		total: countRecords(),
		types: listRecordTypes(),
		instances: listInstanceOptions(),
		filters: {
			instanceId,
			collectorId,
			recordType,
			search
		}
	};
}
var actions = { delete: async ({ request }) => {
	const data = await request.formData();
	const ids = String(data.get("ids") ?? "").split(",").map((s) => Number(s.trim())).filter((n) => Number.isInteger(n) && n > 0);
	if (ids.length === 0) return fail(400, { message: "No records selected." });
	return {
		success: true,
		deleted: deleteRecordsByIds(ids)
	};
} };

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-Dpc6F1Ic.js.map
