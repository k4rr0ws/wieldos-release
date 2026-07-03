import { rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import { randomUUID } from 'node:crypto';

//#region src/lib/server/uploads.js
/** Uploaded avatars live alongside the database so they persist at runtime. */
var AVATAR_DIR = process.env.AVATAR_DIR ?? join(process.cwd(), "data", "uploads", "avatars");
/** Public URL prefix served by src/routes/media/avatars/[file]/+server.js */
var AVATAR_URL_PREFIX = "/media/avatars/";
var MAX_BYTES = 5 * 1024 * 1024;
var EXT_BY_MIME = {
	"image/png": ".png",
	"image/jpeg": ".jpg",
	"image/gif": ".gif",
	"image/webp": ".webp",
	"image/svg+xml": ".svg"
};
function isUploadedAvatar(value) {
	return typeof value === "string" && value.startsWith("/media/avatars/");
}
/** Absolute path for a stored avatar URL or bare filename. */
function avatarFilePath(name) {
	return join(AVATAR_DIR, basename(name));
}
/**
* Persists an uploaded image and returns its public URL, or null when no usable
* file was provided. Throws on unsupported types or oversized files.
*/
async function saveAvatar(file) {
	if (!file || typeof file === "string") return null;
	if (typeof file.arrayBuffer !== "function" || !file.size) return null;
	if (file.size > MAX_BYTES) throw new Error("Image is too large (max 5 MB).");
	let ext = extname(file.name ?? "").toLowerCase();
	if (!Object.values(EXT_BY_MIME).includes(ext)) ext = EXT_BY_MIME[file.type] ?? "";
	if (!ext) throw new Error("Unsupported image type. Use PNG, JPG, GIF, WEBP, or SVG.");
	const buffer = Buffer.from(await file.arrayBuffer());
	mkdirSync(AVATAR_DIR, { recursive: true });
	const filename = `${randomUUID()}${ext}`;
	writeFileSync(join(AVATAR_DIR, filename), buffer);
	return `${AVATAR_URL_PREFIX}${filename}`;
}
/** Removes a previously uploaded avatar file. No-op for emojis / external URLs. */
function deleteAvatar(value) {
	if (!isUploadedAvatar(value)) return;
	try {
		rmSync(avatarFilePath(value), { force: true });
	} catch {}
}

export { avatarFilePath as a, deleteAvatar as d, isUploadedAvatar as i, saveAvatar as s };
//# sourceMappingURL=uploads.js-qd8H1eFO.js.map
