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
		beliefs: String(data.get("beliefs") ?? "").trim(),
		communicationStyle: String(data.get("communicationStyle") ?? "").trim(),
		decisionStyle: String(data.get("decisionStyle") ?? "").trim(),
		motivations: String(data.get("motivations") ?? "").trim(),
		background: String(data.get("background") ?? "").trim(),
		experience: String(data.get("experience") ?? "").trim(),
		specialization: String(data.get("specialization") ?? "").trim(),
		persona: String(data.get("persona") ?? "").trim(),
		skills: String(data.get("skills") ?? ""),
		strengths: String(data.get("strengths") ?? ""),
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
//# sourceMappingURL=agent-form.js-CfQt9OwA.js.map
