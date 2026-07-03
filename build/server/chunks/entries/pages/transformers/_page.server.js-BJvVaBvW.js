import { h as deleteRecordsByTransformer, l as listRecordTypes } from '../../../chunks/records.js-CRr2Hc_8.js';
import { l as listGroupSettings, u as upsertSetting } from '../../../chunks/settings.js-CGfdgS1b.js';
import { d as deleteTransformer, a as resetTransformerCursor, g as getTransformer, r as runTransformer, u as updateTransformer, c as createTransformer, b as listTransformers, e as compileScript } from '../../../chunks/transformer.js-BBxyHg-P.js';
import { A as fail } from '../../../chunks/utils.js-UusfKV9V.js';

//#region src/routes/transformers/+page.server.js
var SETTINGS_GROUP = "Transformers";
function load() {
	return {
		transformers: listTransformers(),
		recordTypes: listRecordTypes(),
		settings: listGroupSettings(SETTINGS_GROUP)
	};
}
function scheduleFromForm(data) {
	if (String(data.get("scheduleMode") ?? "") !== "scheduled") return null;
	const hours = Number(data.get("everyHours"));
	if (!Number.isFinite(hours) || hours <= 0) return null;
	return Math.min(10080, Math.max(60, Math.round(hours * 60)));
}
function fieldsFromForm(data) {
	return String(data.get("fields") ?? "").split(",").map((f) => f.trim()).filter(Boolean);
}
function filterFromForm(data) {
	const filter = {};
	const sourceType = String(data.get("sourceType") ?? "").trim();
	const contains = String(data.get("contains") ?? "").trim();
	if (sourceType) filter.recordType = sourceType;
	if (contains) filter.contains = contains;
	return filter;
}
function validate({ name, recordType, fields, keyField, script }) {
	if (!name) return fail(400, { message: "A name is required." });
	if (!recordType) return fail(400, { message: "A target record type is required." });
	if (!/^[a-z0-9_]+$/.test(recordType)) return fail(400, { message: "Record type must be lowercase letters, digits, and underscores." });
	if (fields.length === 0) return fail(400, { message: "Declare at least one field." });
	if (!fields.includes(keyField)) return fail(400, { message: "The key field must be one of the declared fields." });
	try {
		compileScript(script);
	} catch (err) {
		return fail(400, { message: `Script error: ${err?.message ?? err}` });
	}
	return null;
}
var actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get("name") ?? "").trim();
		const recordType = String(data.get("recordType") ?? "").trim();
		const fields = fieldsFromForm(data);
		const keyField = String(data.get("keyField") ?? "").trim() || fields[0] || "id";
		const script = String(data.get("script") ?? "");
		const invalid = validate({
			name,
			recordType,
			fields,
			keyField,
			script
		});
		if (invalid) return invalid;
		createTransformer({
			name,
			recordType,
			fields,
			keyField,
			filter: filterFromForm(data),
			script,
			scheduleMinutes: scheduleFromForm(data)
		});
		return { success: true };
	},
	update: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing transformer id." });
		const name = String(data.get("name") ?? "").trim();
		const recordType = String(data.get("recordType") ?? "").trim();
		const fields = fieldsFromForm(data);
		const keyField = String(data.get("keyField") ?? "").trim() || fields[0] || "id";
		const script = String(data.get("script") ?? "");
		const invalid = validate({
			name,
			recordType,
			fields,
			keyField,
			script
		});
		if (invalid) return invalid;
		updateTransformer(id, {
			name,
			recordType,
			fields,
			keyField,
			filter: filterFromForm(data),
			script,
			scheduleMinutes: scheduleFromForm(data)
		});
		return { success: true };
	},
	toggle: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing transformer id." });
		updateTransformer(id, { enabled: data.get("enabled") === "true" });
		return { success: true };
	},
	run: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		const transformer = id ? getTransformer(id) : null;
		if (!transformer) return fail(404, { message: "Transformer not found." });
		const result = await runTransformer(transformer);
		if (result.error && !result.processed) return fail(502, { message: `Run failed: ${result.error}` });
		return {
			success: true,
			ran: {
				processed: result.processed,
				saved: result.saved,
				skipped: result.skipped,
				deferred: result.deferred,
				errors: result.errors,
				logs: (result.logs ?? []).slice(0, 10)
			}
		};
	},
	reset: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing transformer id." });
		resetTransformerCursor(id);
		return { success: true };
	},
	settings: async ({ request }) => {
		const data = await request.formData();
		const known = new Map(listGroupSettings(SETTINGS_GROUP).map((s) => [s.key, s]));
		for (const [key, value] of data.entries()) {
			const def = known.get(key);
			if (!def) continue;
			if (def.type === "number" && !Number.isFinite(Number(value))) return fail(400, { message: `${def.label} must be a number.` });
			upsertSetting({
				key,
				value: String(value),
				group: SETTINGS_GROUP
			});
		}
		return { success: true };
	},
	empty: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing transformer id." });
		return {
			success: true,
			emptied: { deleted: deleteRecordsByTransformer(id) }
		};
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { message: "Missing transformer id." });
		deleteTransformer(id);
		return { success: true };
	}
};

var _page_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

export { _page_server as _ };
//# sourceMappingURL=_page.server.js-BJvVaBvW.js.map
