import { i as importJson, a as importSqliteBuffer, t as tableCounts, d as dbInfo } from '../../../chunks/backup.js-D9w40wKZ.js';
import { s as schedulerHealth } from '../../../chunks/activity2.js-uHW7HsJq.js';
import { g as getSetting } from '../../../chunks/settings.js-CGfdgS1b.js';
import { A as fail } from '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/status/+page.server.js
function load() {
	return {
		db: dbInfo(),
		counts: tableCounts(),
		scheduler: schedulerHealth(),
		ai: {
			configured: Boolean(getSetting("ANTHROPIC_API_KEY")),
			model: getSetting("ANTHROPIC_MODEL")
		},
		runtime: {
			node: process.version,
			uptimeSec: Math.round(process.uptime()),
			platform: `${process.platform} ${process.arch}`
		}
	};
}
var actions = { importData: async ({ request }) => {
	const file = (await request.formData()).get("file");
	if (!file || typeof file === "string" || file.size === 0) return fail(400, { message: "Choose a backup file to import." });
	try {
		const buffer = Buffer.from(await file.arrayBuffer());
		const restored = String(file.name ?? "").toLowerCase().endsWith(".json") || buffer[0] === 123 ? importJson(buffer.toString("utf8")) : importSqliteBuffer(buffer);
		return {
			success: true,
			total: Object.values(restored).reduce((sum, n) => sum + n, 0)
		};
	} catch (err) {
		return fail(400, { message: err?.message ?? "Import failed." });
	}
} };

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-Bb45f6T9.js.map
