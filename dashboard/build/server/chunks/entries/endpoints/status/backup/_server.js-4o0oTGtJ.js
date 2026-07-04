import { e as exportJson, b as backupStamp, s as snapshotSqlite } from '../../../../chunks/backup.js-CLmuAf1S.js';
import '../../../../chunks/db.js-tGTv_Rod.js';
import '../../../../chunks/theme-presets.js-B35K5uvm.js';
import 'node:fs';
import 'node:path';
import 'node:sqlite';
import 'node:os';

//#region src/routes/status/backup/+server.js
function GET({ url }) {
	if (url.searchParams.get("format") === "json") return new Response(JSON.stringify(exportJson()), { headers: {
		"Content-Type": "application/json",
		"Content-Disposition": `attachment; filename="wieldos-backup-${backupStamp()}.json"`,
		"Cache-Control": "no-store"
	} });
	const { buffer, filename } = snapshotSqlite();
	return new Response(buffer, { headers: {
		"Content-Type": "application/octet-stream",
		"Content-Disposition": `attachment; filename="${filename}"`,
		"Cache-Control": "no-store"
	} });
}

export { GET };
//# sourceMappingURL=_server.js-4o0oTGtJ.js.map
