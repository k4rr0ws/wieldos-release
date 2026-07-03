import { g as getAdapterByType } from './viem.js-Dnkpuzyj.js';
import { b as getInstance, c as getInstanceCredentials, m as markInstanceChecked } from './instances.js-DLoGySTX.js';
import { r as runAdapter } from './adapter-runner.js-SRrLtSoq.js';
import { m as markCollectorRun, s as setCollectorStatus } from './tools.js-C1CBPtEY.js';
import { u as upsertRecords } from './records.js-CRr2Hc_8.js';
import { g as getSetting } from './settings.js-CGfdgS1b.js';
import { l as logEvent } from './log.js-D10-n4Pe.js';
import { o as observeFromRun } from './agent-runtime.js-CBlullnv.js';

//#region src/lib/server/providers/collector.js
function runCaps() {
	const cap = (key, fallback) => {
		const n = Math.round(getSetting(key));
		return Number.isFinite(n) && n > 0 ? n : fallback;
	};
	return {
		maxRecords: cap("COLLECTOR_MAX_RECORDS", 50),
		maxObservations: cap("COLLECTOR_MAX_OBSERVATIONS", 5)
	};
}
var keepRaw = () => getSetting("RECORDS_KEEP_RAW") === true;
async function runCollector(collector) {
	const adapter = getAdapterByType(collector.type);
	if (!adapter) {
		markCollectorRun(collector.id, { error: `Unknown adapter type: ${collector.type}` });
		return {
			persisted: 0,
			error: "unknown_type"
		};
	}
	const priorCursor = collector.cursor || "";
	const { maxRecords, maxObservations } = runCaps();
	setCollectorStatus(collector.id, "running");
	try {
		const instance = getInstance(collector.instanceId);
		const credentials = getInstanceCredentials(collector.instanceId);
		const rows = [];
		const collect = (record) => {
			if (rows.length >= maxRecords) return false;
			if (!record) return true;
			rows.push({
				instanceId: collector.instanceId,
				collectorId: collector.id,
				id: record.id,
				recordType: record.recordType || adapter.defaultRecordType,
				metadata: record.metadata ?? {},
				capturedAt: record.capturedAt ?? null,
				raw: keepRaw() ? record.raw : null
			});
			return true;
		};
		const { cursor } = await runAdapter(adapter, {
			instance,
			credentials,
			input: collector.input ?? {},
			cursor: priorCursor,
			collect
		});
		const persisted = upsertRecords(rows);
		markCollectorRun(collector.id, { cursor: cursor ?? priorCursor });
		markInstanceChecked(collector.instanceId);
		if (priorCursor && rows.length && collector.agentId) {
			const fresh = rows.slice(0, maxObservations);
			for (const r of fresh) {
				const summary = Object.entries(r.metadata ?? {}).slice(0, 5).map(([k, v]) => `${k}: ${v}`).join(" · ");
				observeFromRun(collector.agentId, {
					content: `${collector.name} [${r.recordType}] ${summary}`.trim(),
					confidence: .6,
					tags: ["research", collector.type]
				});
			}
		}
		logEvent("scheduler_collector", {
			collectorId: collector.id,
			type: collector.type,
			persisted,
			baseline: !priorCursor
		});
		return {
			persisted,
			error: null
		};
	} catch (err) {
		markCollectorRun(collector.id, { error: err?.message ?? String(err) });
		logEvent("scheduler_collector_error", {
			collectorId: collector.id,
			error: err?.message ?? String(err)
		});
		return {
			persisted: 0,
			error: err?.message ?? String(err)
		};
	}
}

export { runCollector as r };
//# sourceMappingURL=collector.js-DQ-r_gt5.js.map
