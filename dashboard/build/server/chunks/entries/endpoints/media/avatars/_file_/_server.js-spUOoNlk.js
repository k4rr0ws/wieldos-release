import { a as avatarFilePath } from '../../../../../chunks/uploads.js-qd8H1eFO.js';
import { x as error } from '../../../../../chunks/utils.js-UusfKV9V.js';
import { existsSync, readFileSync } from 'node:fs';
import { basename, extname } from 'node:path';
import 'node:crypto';
import '../../../../../chunks/shared.js-CgP5r6wP.js';

//#region src/routes/media/avatars/[file]/+server.js
var CONTENT_TYPES = {
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".webp": "image/webp",
	".svg": "image/svg+xml"
};
function GET({ params }) {
	const name = basename(params.file);
	const path = avatarFilePath(name);
	if (!existsSync(path)) throw error(404, "Not found");
	const body = readFileSync(path);
	return new Response(body, { headers: {
		"Content-Type": CONTENT_TYPES[extname(name).toLowerCase()] ?? "application/octet-stream",
		"Cache-Control": "public, max-age=31536000, immutable"
	} });
}

export { GET };
//# sourceMappingURL=_server.js-spUOoNlk.js.map
