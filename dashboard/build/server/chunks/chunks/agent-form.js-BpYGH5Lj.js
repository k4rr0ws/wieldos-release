import { s as saveAvatar, i as isUploadedAvatar, d as deleteAvatar } from './uploads.js-qd8H1eFO.js';

//#region src/lib/server/agent-form.js
function mergeTools(values) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const value of values) for (const part of String(value).split(/[,\n]/)) {
		const tool = part.trim();
		const key = tool.toLowerCase();
		if (tool && !seen.has(key)) {
			seen.add(key);
			out.push(tool);
		}
	}
	return out.join(", ");
}
function readAgentFields(data) {
	return {
		name: String(data.get("name") ?? "").trim(),
		title: String(data.get("title") ?? "").trim(),
		description: String(data.get("description") ?? "").trim(),
		avatar: String(data.get("avatar") ?? "").trim(),
		status: String(data.get("status") ?? "active").trim() || "active",
		systemPrompt: String(data.get("systemPrompt") ?? "").trim(),
		specialization: String(data.get("specialization") ?? "").trim(),
		tools: mergeTools(data.getAll("tools"))
	};
}
async function resolveAvatarUpdate(data, fields) {
	const current = String(data.get("currentAvatar") ?? "").trim();
	const uploaded = await saveAvatar(data.get("avatarFile"));
	if (uploaded) fields.avatar = uploaded;
	else if (!fields.avatar && isUploadedAvatar(current)) fields.avatar = current;
	if (isUploadedAvatar(current) && current !== fields.avatar) deleteAvatar(current);
	return fields;
}

export { resolveAvatarUpdate as a, readAgentFields as r };
//# sourceMappingURL=agent-form.js-BpYGH5Lj.js.map
