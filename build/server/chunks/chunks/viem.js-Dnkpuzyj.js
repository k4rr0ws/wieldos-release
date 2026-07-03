import { _ as __exportAll } from './chunk.js-BBx_TEkp.js';
import { d as db } from './db.js-BcppfB2j.js';
import { g as getProviderValues } from './instances.js-DLoGySTX.js';
import { parseAbi, parseAbiItem, formatUnits, formatEther, decodeEventLog, createPublicClient, http, createWalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

//#region src/lib/server/db/adapters.js
var selectBase = `
	SELECT a.id, a.type, a.label, a.provider, a.description,
		a.input_hint AS inputHint, a.default_record_type AS defaultRecordType,
		a.script, a.created_at AS createdAt, a.updated_at AS updatedAt,
		(SELECT COUNT(*) FROM research_collectors c WHERE c.type = a.type) AS collectorCount
	FROM adapters a
`;
function listAdapters() {
	return db.prepare(`${selectBase} ORDER BY a.provider, a.type`).all();
}
function getAdapter(id) {
	return db.prepare(`${selectBase} WHERE a.id = ?`).get(id) ?? null;
}
function getAdapterByType(type) {
	return db.prepare(`${selectBase} WHERE a.type = ?`).get(String(type)) ?? null;
}
function createAdapter({ type, label, provider = "", description = "", inputHint = "", defaultRecordType = "item", script = "" }) {
	const info = db.prepare(`INSERT INTO adapters (type, label, provider, description, input_hint, default_record_type, script)
			 VALUES (?, ?, ?, ?, ?, ?, ?)`).run(String(type), String(label), String(provider ?? ""), String(description ?? ""), String(inputHint ?? ""), String(defaultRecordType || "item"), String(script ?? ""));
	return getAdapter(Number(info.lastInsertRowid));
}
function updateAdapter(id, { type, label, provider, description, inputHint, defaultRecordType, script } = {}) {
	db.prepare(`UPDATE adapters SET
			type = COALESCE(?, type),
			label = COALESCE(?, label),
			provider = COALESCE(?, provider),
			description = COALESCE(?, description),
			input_hint = COALESCE(?, input_hint),
			default_record_type = COALESCE(?, default_record_type),
			script = COALESCE(?, script),
			updated_at = datetime('now')
		 WHERE id = ?`).run(type != null ? String(type) : null, label != null ? String(label) : null, provider != null ? String(provider) : null, description != null ? String(description) : null, inputHint != null ? String(inputHint) : null, defaultRecordType != null ? String(defaultRecordType) : null, script != null ? String(script) : null, id);
	return getAdapter(id);
}
function deleteAdapter(id) {
	return db.prepare(`DELETE FROM adapters WHERE id = ?`).run(id).changes > 0;
}
//#endregion
//#region src/lib/server/providers/tool-kit.js
function sliceSafe(value, max) {
	const out = value.slice(0, max);
	const last = out.charCodeAt(out.length - 1);
	return last >= 55296 && last <= 56319 ? out.slice(0, -1) : out;
}
/** Coerce any value to a trimmed, length-capped string. */
function str(value, max = 500) {
	return sliceSafe(String(value ?? "").trim(), max);
}
/** Coerce any value to a whitespace-collapsed, trimmed, length-capped string.
*  (Unlike `str`, runs of whitespace become a single space — for free text we
*  surface to the model.) Shared by provider normalizers. */
function clip(value, max = 500) {
	return sliceSafe(String(value ?? "").replace(/\s+/g, " ").trim(), max);
}
/** Coerce an array to trimmed, non-empty, length-capped strings (else []). */
function toStrArray(value, max = 60) {
	return Array.isArray(value) ? value.map((v) => str(v, max)).filter(Boolean) : [];
}
/** Canonical EVM address: trimmed, lowercased. '' when missing. */
function address(value) {
	return String(value ?? "").trim().toLowerCase();
}
/** Canonical transaction/log hash: trimmed, lowercased. '' when missing. */
function txHash(value) {
	return String(value ?? "").trim().toLowerCase();
}
/** Canonical social handle: trimmed, leading '@' stripped, lowercased. */
function handle(value) {
	return String(value ?? "").trim().replace(/^@+/, "").toLowerCase();
}
var DEFAULT_TIMEOUT_MS = 12e3;
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/**
* Fetch JSON with timeout, query params, and uniform error shaping.
* @param {string} url Base URL (without query string).
* @param {object} [opts]
* @param {string} [opts.method='GET']
* @param {Record<string,string>} [opts.headers]
* @param {Record<string,unknown>} [opts.params] Query params (empty/null skipped).
* @param {unknown} [opts.body] Request body; objects are JSON-stringified.
* @param {number} [opts.timeoutMs=12000]
* @param {number} [opts.retries=0] Retries on transient 429/5xx (off by default).
* @param {string} [opts.label='HTTP'] Prefix for thrown error messages.
* @returns {Promise<any>} Parsed JSON.
*/
async function httpJson(url, { method = "GET", headers = {}, params, body, timeoutMs = DEFAULT_TIMEOUT_MS, retries = 0, label = "HTTP" } = {}) {
	const target = new URL(url);
	if (params) for (const [key, value] of Object.entries(params)) {
		if (value === void 0 || value === null || value === "") continue;
		target.searchParams.set(key, String(value));
	}
	const init = {
		method,
		headers: { ...headers }
	};
	if (body !== void 0) init.body = typeof body === "string" ? body : JSON.stringify(body);
	for (let attempt = 0;; attempt++) {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), timeoutMs);
		try {
			const res = await fetch(target, {
				...init,
				signal: controller.signal
			});
			if (!res.ok) {
				if (attempt < retries && (res.status === 429 || res.status >= 500)) {
					clearTimeout(timer);
					await sleep(250 * (attempt + 1));
					continue;
				}
				const detail = await res.text().catch(() => "");
				throw new Error(`${label} HTTP ${res.status}${detail ? `: ${detail.slice(0, 200)}` : ""}`);
			}
			return await res.json();
		} finally {
			clearTimeout(timer);
		}
	}
}
function assertPublicHttpUrl(raw) {
	let url;
	try {
		url = new URL(String(raw));
	} catch {
		throw new Error("Invalid URL.");
	}
	if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Only http(s) URLs are allowed.");
	const host = url.hostname.toLowerCase();
	if (host === "localhost" || host.endsWith(".local") || host === "0.0.0.0" || host === "::1" || /^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)) throw new Error("That host is not allowed.");
	return url.toString();
}
//#endregion
//#region src/lib/server/providers/xapi.js
var xapi_exports = /* @__PURE__ */ __exportAll({
	fetchFollowers: () => fetchFollowers,
	fetchFollowing: () => fetchFollowing,
	fetchTweetsByIds: () => fetchTweetsByIds,
	fetchUserByUsername: () => fetchUserByUsername,
	fetchUserMentions: () => fetchUserMentions,
	fetchUserTweets: () => fetchUserTweets,
	formatTweet: () => formatTweet$1,
	formatTweets: () => formatTweets$1,
	formatUser: () => formatUser$1,
	moreCursor: () => moreCursor,
	normalizeTweet: () => normalizeTweet$1,
	normalizeUser: () => normalizeUser$1,
	searchRecentTweets: () => searchRecentTweets
});
var BASE$2 = "https://api.x.com/2";
var MAX_ITEMS$2 = 20;
var USER_FIELDS = "name,username,description,location,url,public_metrics,verified,verified_type,created_at";
var TWEET_FIELDS = "created_at,lang,public_metrics,author_id,referenced_tweets";
var TWEET_EXPANSIONS = "author_id";
function normalizeUser$1(u = {}) {
	const m = u.public_metrics ?? {};
	return {
		id: clip(u.id, 32),
		handle: clip(u.username, 40),
		name: clip(u.name, 80),
		bio: clip(u.description, 400),
		location: clip(u.location, 80),
		url: clip(u.url, 120),
		followers: Number(m.followers_count ?? 0),
		following: Number(m.following_count ?? 0),
		tweets: Number(m.tweet_count ?? 0),
		verified: Boolean(u.verified),
		verifiedType: clip(u.verified_type, 32),
		createdAt: clip(u.created_at, 40)
	};
}
function normalizeTweet$1(t = {}, ctx = {}) {
	const m = t.public_metrics ?? {};
	const author = ctx.users?.get(t.author_id);
	const handle = clip(author?.username, 40);
	const refs = Array.isArray(t.referenced_tweets) ? t.referenced_tweets : [];
	const id = clip(t.id, 32);
	return {
		id,
		url: handle ? `https://x.com/${handle}/status/${id}` : `https://x.com/i/web/status/${id}`,
		text: clip(t.text, 500),
		author: handle,
		authorName: clip(author?.name, 80),
		createdAt: clip(t.created_at, 40),
		lang: clip(t.lang, 8),
		likes: Number(m.like_count ?? 0),
		retweets: Number(m.retweet_count ?? 0),
		replies: Number(m.reply_count ?? 0),
		quotes: Number(m.quote_count ?? 0),
		views: Number(m.impression_count ?? 0),
		isReply: refs.some((r) => r?.type === "replied_to"),
		isQuote: refs.some((r) => r?.type === "quoted"),
		isRetweet: refs.some((r) => r?.type === "retweeted")
	};
}
function formatUser$1(u) {
	const v = u.verified ? ` ✓${u.verifiedType ? `(${u.verifiedType})` : ""}` : "";
	return [
		`@${u.handle}${v} — ${u.name}`,
		`${u.followers.toLocaleString()} followers · ${u.following.toLocaleString()} following · ${u.tweets.toLocaleString()} tweets`,
		[u.location && `📍 ${u.location}`, u.createdAt && `joined ${u.createdAt}`].filter(Boolean).join(" · "),
		u.bio && `“${u.bio}”`
	].filter(Boolean).join("\n");
}
function formatTweet$1(t) {
	const flags = [
		t.isRetweet && "RT",
		t.isQuote && "QT",
		t.isReply && "reply"
	].filter(Boolean).join("/");
	const tag = flags ? ` [${flags}]` : "";
	const engagement = `♥${t.likes} ↻${t.retweets} 💬${t.replies} 👁${t.views}`;
	return `#${t.id} @${t.author}${tag} (${t.createdAt})\n${t.text}\n${engagement} — ${t.url}`;
}
function formatTweets$1(tweets, { empty = "No tweets found." } = {}) {
	if (!tweets.length) return empty;
	return tweets.map(formatTweet$1).join("\n\n");
}
function moreCursor(next) {
	return next?.hasNext && next?.nextCursor ? `\n\n(more: cursor=${next.nextCursor})` : "";
}
/**
* Low-level GET with bearer auth + app-level error check. `bearerToken`
* overrides the instance token so a collector can supply a specific instance's
* token; otherwise the primary active xapi instance's bearerToken is used.
*/
async function xapiGet(path, params = {}, { bearerToken: keyOverride } = {}) {
	const bearerToken = keyOverride || getProviderValues("xapi").bearerToken;
	if (!bearerToken) throw new Error("X API reads are not configured (no bearer token).");
	const json = await httpJson(BASE$2 + path, {
		params,
		headers: { Authorization: `Bearer ${bearerToken}` },
		label: "api.x.com",
		retries: 2
	});
	if (json?.errors && json?.data == null) {
		const first = Array.isArray(json.errors) ? json.errors[0] : null;
		throw new Error(first?.detail || first?.title || json?.title || "api.x.com error");
	}
	return json;
}
function indexUsers(json) {
	const map = /* @__PURE__ */ new Map();
	for (const u of json?.includes?.users ?? []) map.set(u.id, u);
	return map;
}
function takeList(json, normalize) {
	const arr = Array.isArray(json?.data) ? json.data : json?.data ? [json.data] : [];
	const ctx = { users: indexUsers(json) };
	return arr.slice(0, MAX_ITEMS$2).map((item) => normalize(item, ctx));
}
var extractTweets$1 = (json) => takeList(json, normalizeTweet$1);
var extractUsers$1 = (json) => takeList(json, normalizeUser$1);
function extractPaging$1(json) {
	const nextCursor = clip(json?.meta?.next_token, 200);
	return {
		nextCursor,
		hasNext: Boolean(nextCursor)
	};
}
async function fetchUserByUsername(username, { bearerToken = "" } = {}) {
	const data = (await xapiGet(`/users/by/username/${encodeURIComponent(username)}`, { "user.fields": USER_FIELDS }, { bearerToken }))?.data;
	if (!data?.id) throw new Error(`No such user: @${username}`);
	return normalizeUser$1(data);
}
async function fetchUserTweets({ userId, cursor = "", excludeReplies = false, bearerToken = "" } = {}) {
	const json = await xapiGet(`/users/${encodeURIComponent(userId)}/tweets`, {
		max_results: MAX_ITEMS$2,
		pagination_token: cursor,
		exclude: excludeReplies ? "replies" : void 0,
		"tweet.fields": TWEET_FIELDS,
		expansions: TWEET_EXPANSIONS,
		"user.fields": USER_FIELDS
	}, { bearerToken });
	return {
		tweets: extractTweets$1(json),
		...extractPaging$1(json)
	};
}
async function searchRecentTweets({ query, sortOrder = "recency", cursor = "", bearerToken = "" } = {}) {
	const json = await xapiGet("/tweets/search/recent", {
		query,
		max_results: MAX_ITEMS$2,
		sort_order: sortOrder === "relevancy" ? "relevancy" : "recency",
		next_token: cursor,
		"tweet.fields": TWEET_FIELDS,
		expansions: TWEET_EXPANSIONS,
		"user.fields": USER_FIELDS
	}, { bearerToken });
	return {
		tweets: extractTweets$1(json),
		...extractPaging$1(json)
	};
}
async function fetchTweetsByIds(ids = [], { bearerToken = "" } = {}) {
	const list = (Array.isArray(ids) ? ids : [ids]).map((v) => clip(v, 32)).filter(Boolean).slice(0, MAX_ITEMS$2);
	if (!list.length) return { tweets: [] };
	return { tweets: extractTweets$1(await xapiGet("/tweets", {
		ids: list.join(","),
		"tweet.fields": TWEET_FIELDS,
		expansions: TWEET_EXPANSIONS,
		"user.fields": USER_FIELDS
	}, { bearerToken })) };
}
async function fetchUserMentions({ userId, cursor = "", bearerToken = "" } = {}) {
	const json = await xapiGet(`/users/${encodeURIComponent(userId)}/mentions`, {
		max_results: MAX_ITEMS$2,
		pagination_token: cursor,
		"tweet.fields": TWEET_FIELDS,
		expansions: TWEET_EXPANSIONS,
		"user.fields": USER_FIELDS
	}, { bearerToken });
	return {
		tweets: extractTweets$1(json),
		...extractPaging$1(json)
	};
}
async function fetchFollowers({ userId, cursor = "", bearerToken = "" } = {}) {
	const json = await xapiGet(`/users/${encodeURIComponent(userId)}/followers`, {
		max_results: MAX_ITEMS$2,
		pagination_token: cursor,
		"user.fields": USER_FIELDS
	}, { bearerToken });
	return {
		users: extractUsers$1(json),
		...extractPaging$1(json)
	};
}
async function fetchFollowing({ userId, cursor = "", bearerToken = "" } = {}) {
	const json = await xapiGet(`/users/${encodeURIComponent(userId)}/following`, {
		max_results: MAX_ITEMS$2,
		pagination_token: cursor,
		"user.fields": USER_FIELDS
	}, { bearerToken });
	return {
		users: extractUsers$1(json),
		...extractPaging$1(json)
	};
}
//#endregion
//#region src/lib/server/providers/twitterapi.js
var twitterapi_exports = /* @__PURE__ */ __exportAll({
	formatTweet: () => formatTweet,
	formatTweets: () => formatTweets,
	formatUser: () => formatUser,
	normalizeTweet: () => normalizeTweet,
	normalizeUser: () => normalizeUser,
	twitterCreateTweet: () => twitterCreateTweet,
	twitterFollow: () => twitterFollow,
	twitterFollowers: () => twitterFollowers,
	twitterFollowings: () => twitterFollowings,
	twitterLike: () => twitterLike,
	twitterMentions: () => twitterMentions,
	twitterReplies: () => twitterReplies,
	twitterRetweet: () => twitterRetweet,
	twitterSearch: () => twitterSearch,
	twitterSendDm: () => twitterSendDm,
	twitterTrends: () => twitterTrends,
	twitterTweetsByIds: () => twitterTweetsByIds,
	twitterUserInfo: () => twitterUserInfo,
	twitterUserTweets: () => twitterUserTweets
});
var BASE$1 = "https://api.twitterapi.io";
var MAX_ITEMS$1 = 20;
function normalizeUser(u = {}) {
	return {
		id: clip(u.id, 32),
		handle: clip(u.userName, 40),
		name: clip(u.name, 80),
		bio: clip(u.description, 400),
		location: clip(u.location, 80),
		url: clip(u.url, 120),
		followers: Number(u.followers ?? 0),
		following: Number(u.following ?? 0),
		tweets: Number(u.statusesCount ?? 0),
		verified: Boolean(u.isBlueVerified),
		verifiedType: clip(u.verifiedType, 32),
		createdAt: clip(u.createdAt, 40)
	};
}
function normalizeTweet(t = {}) {
	return {
		id: clip(t.id, 32),
		url: clip(t.url, 120),
		text: clip(t.text, 500),
		author: clip(t.author?.userName, 40),
		authorName: clip(t.author?.name, 80),
		createdAt: clip(t.createdAt, 40),
		lang: clip(t.lang, 8),
		likes: Number(t.likeCount ?? 0),
		retweets: Number(t.retweetCount ?? 0),
		replies: Number(t.replyCount ?? 0),
		quotes: Number(t.quoteCount ?? 0),
		views: Number(t.viewCount ?? 0),
		isReply: Boolean(t.isReply),
		isQuote: Boolean(t.quoted_tweet),
		isRetweet: Boolean(t.retweeted_tweet)
	};
}
function formatUser(u) {
	const v = u.verified ? ` ✓${u.verifiedType ? `(${u.verifiedType})` : ""}` : "";
	return [
		`@${u.handle}${v} — ${u.name}`,
		`${u.followers.toLocaleString()} followers · ${u.following.toLocaleString()} following · ${u.tweets.toLocaleString()} tweets`,
		[u.location && `📍 ${u.location}`, u.createdAt && `joined ${u.createdAt}`].filter(Boolean).join(" · "),
		u.bio && `“${u.bio}”`
	].filter(Boolean).join("\n");
}
function formatTweet(t) {
	const flags = [
		t.isRetweet && "RT",
		t.isQuote && "QT",
		t.isReply && "reply"
	].filter(Boolean).join("/");
	const tag = flags ? ` [${flags}]` : "";
	const engagement = `♥${t.likes} ↻${t.retweets} 💬${t.replies} 👁${t.views}`;
	return `#${t.id} @${t.author}${tag} (${t.createdAt})\n${t.text}\n${engagement} — ${t.url}`;
}
function formatTweets(tweets, { empty = "No tweets found." } = {}) {
	if (!tweets.length) return empty;
	return tweets.map(formatTweet).join("\n\n");
}
/**
* Low-level GET with auth + app-level error check. `apiKey` overrides the
* instance key so a collector can supply a specific instance's key; otherwise
* the primary active twitterapi instance's apiKey is used.
*/
async function twitterGet(path, params = {}, { apiKey: keyOverride } = {}) {
	const apiKey = keyOverride || getProviderValues("twitterapi").apiKey;
	if (!apiKey) throw new Error("Twitter reads are not configured (no API key).");
	const json = await httpJson(BASE$1 + path, {
		params,
		headers: { "x-api-key": apiKey },
		label: "twitterapi.io"
	});
	if (json?.status === "error") throw new Error(json?.msg || json?.message || "twitterapi.io error");
	return json;
}
function extractTweets(json) {
	const arr = json?.tweets ?? json?.data?.tweets ?? (Array.isArray(json?.data) ? json.data : null) ?? [];
	return (Array.isArray(arr) ? arr : []).slice(0, MAX_ITEMS$1).map(normalizeTweet);
}
function extractUsers(json, key) {
	const arr = json?.[key] ?? json?.data?.[key] ?? (Array.isArray(json?.data) ? json.data : null) ?? [];
	return (Array.isArray(arr) ? arr : []).slice(0, MAX_ITEMS$1).map(normalizeUser);
}
function extractPaging(json) {
	return {
		nextCursor: clip(json?.next_cursor ?? json?.data?.next_cursor, 200),
		hasNext: Boolean(json?.has_next_page ?? json?.data?.has_next_page)
	};
}
async function twitterUserInfo(userName) {
	const json = await twitterGet("/twitter/user/info", { userName });
	const data = json?.data ?? json;
	if (!data || !data.userName && !data.id) throw new Error(`No such user: @${userName}`);
	return normalizeUser(data);
}
async function twitterUserTweets({ userName, cursor = "", includeReplies = false, apiKey = "" } = {}) {
	const json = await twitterGet("/twitter/user/last_tweets", {
		userName,
		cursor,
		includeReplies
	}, { apiKey });
	return {
		tweets: extractTweets(json),
		...extractPaging(json)
	};
}
async function twitterSearch({ query, queryType = "Latest", cursor = "", apiKey = "" } = {}) {
	const json = await twitterGet("/twitter/tweet/advanced_search", {
		query,
		queryType: queryType === "Top" ? "Top" : "Latest",
		cursor
	}, { apiKey });
	return {
		tweets: extractTweets(json),
		...extractPaging(json)
	};
}
async function twitterTweetsByIds(ids = []) {
	const list = (Array.isArray(ids) ? ids : [ids]).map((v) => clip(v, 32)).filter(Boolean).slice(0, MAX_ITEMS$1);
	if (!list.length) return { tweets: [] };
	return { tweets: extractTweets(await twitterGet("/twitter/tweets", { tweet_ids: list.join(",") })) };
}
async function twitterReplies({ tweetId, cursor = "", apiKey = "" } = {}) {
	const json = await twitterGet("/twitter/tweet/replies", {
		tweetId,
		cursor
	}, { apiKey });
	return {
		tweets: extractTweets(json),
		...extractPaging(json)
	};
}
async function twitterMentions({ userName, cursor = "", apiKey = "" } = {}) {
	const json = await twitterGet("/twitter/user/mentions", {
		userName,
		cursor
	}, { apiKey });
	return {
		tweets: extractTweets(json),
		...extractPaging(json)
	};
}
async function twitterFollowers({ userName, cursor = "", apiKey = "" } = {}) {
	const json = await twitterGet("/twitter/user/followers", {
		userName,
		cursor
	}, { apiKey });
	return {
		users: extractUsers(json, "followers"),
		...extractPaging(json)
	};
}
async function twitterFollowings({ userName, cursor = "", apiKey = "" } = {}) {
	const json = await twitterGet("/twitter/user/followings", {
		userName,
		cursor
	}, { apiKey });
	return {
		users: extractUsers(json, "followings"),
		...extractPaging(json)
	};
}
async function twitterTrends({ woeid = 1, count = 30 } = {}) {
	const json = await twitterGet("/twitter/trends", {
		woeid,
		count
	});
	const arr = json?.trends ?? json?.data?.trends ?? [];
	return { trends: (Array.isArray(arr) ? arr : []).slice(0, 30).map((t) => ({
		name: clip(t?.name ?? t?.trend ?? t?.title, 80),
		volume: Number(t?.tweet_volume ?? 0)
	})).filter((t) => t.name) };
}
var tweetText = (v) => String(v ?? "").trim().slice(0, 4e3);
async function twitterPost(path, body) {
	const { apiKey, loginCookies, proxy } = getProviderValues("twitterapi");
	if (!apiKey || !loginCookies || !proxy) throw new Error("Twitter writes are not configured: set apiKey, loginCookies and proxy on an active X / Twitter instance.");
	const json = await httpJson(BASE$1 + path, {
		method: "POST",
		headers: {
			"x-api-key": apiKey,
			"content-type": "application/json"
		},
		body: {
			...body,
			login_cookies: loginCookies,
			proxy
		},
		label: "twitterapi.io write failed"
	});
	if (json?.status === "error") throw new Error(json?.msg || json?.message || "twitterapi.io write failed");
	return json;
}
function twitterCreateTweet({ text, replyToTweetId = "", quoteTweetId = "" } = {}) {
	const body = {
		tweet_text: tweetText(text),
		is_note_tweet: tweetText(text).length > 280
	};
	if (replyToTweetId) body.reply_to_tweet_id = String(replyToTweetId);
	if (quoteTweetId) body.quote_tweet_id = String(quoteTweetId);
	return twitterPost("/twitter/create_tweet_v2", body);
}
function twitterLike(tweetId) {
	return twitterPost("/twitter/like_tweet_v2", { tweet_id: String(tweetId) });
}
function twitterRetweet(tweetId) {
	return twitterPost("/twitter/retweet_tweet_v2", { tweet_id: String(tweetId) });
}
function twitterFollow(userId) {
	return twitterPost("/twitter/follow_user_v2", { user_id: String(userId) });
}
function twitterSendDm({ userId, text } = {}) {
	return twitterPost("/twitter/send_dm_to_user", {
		user_id: String(userId),
		text: tweetText(text)
	});
}
//#endregion
//#region src/lib/server/providers/dexscreener.js
var dexscreener_exports = /* @__PURE__ */ __exportAll({
	DEX_DEFAULT_CHAIN: () => DEX_DEFAULT_CHAIN,
	MAX_ITEMS: () => 12,
	dexBoosts: () => dexBoosts,
	dexFetchPairs: () => dexFetchPairs,
	dexPair: () => dexPair,
	dexProfiles: () => dexProfiles,
	dexSearch: () => dexSearch,
	dexToken: () => dexToken,
	dexTokenPairs: () => dexTokenPairs,
	formatBoosts: () => formatBoosts,
	formatPairs: () => formatPairs,
	formatProfiles: () => formatProfiles,
	normalizePair: () => normalizePair
});
var BASE = "https://api.dexscreener.com";
var DEX_DEFAULT_CHAIN = "pulsechain";
/** Compact USD: $1.23B / $4.5M / $6.7K / $0.89 / $0.000123. '—' when missing. */
function usd(value) {
	if (value === null || value === void 0 || value === "") return "—";
	const n = Number(value);
	if (!Number.isFinite(n)) return "—";
	const abs = Math.abs(n);
	if (abs >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
	if (abs >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
	if (abs >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
	if (abs >= 1) return `$${n.toFixed(2)}`;
	if (abs > 0) return `$${n.toPrecision(3)}`;
	return "$0";
}
/** Signed percentage, e.g. +4.3% / -12% / —. */
function pct(value) {
	if (value === null || value === void 0 || value === "") return "—";
	const n = Number(value);
	if (!Number.isFinite(n)) return "—";
	return `${n > 0 ? "+" : ""}${n.toFixed(Math.abs(n) >= 100 ? 0 : 1)}%`;
}
function ageDays(createdAtMs) {
	const t = Number(createdAtMs);
	if (!Number.isFinite(t) || t <= 0) return null;
	return Math.max(0, Math.round((Date.now() - t) / 864e5));
}
function normalizePair(p = {}) {
	const base = p.baseToken ?? {};
	const quote = p.quoteToken ?? {};
	const socials = Array.isArray(p.info?.socials) ? p.info.socials.map((s) => clip(`${s.platform}:${s.handle}`, 48)).filter(Boolean) : [];
	return {
		id: clip(p.pairAddress || base.address, 64),
		chain: clip(p.chainId, 24),
		dex: clip(p.dexId, 24),
		pair: `${clip(base.symbol, 16) || "?"}/${clip(quote.symbol, 16) || "?"}`,
		baseSymbol: clip(base.symbol, 16),
		address: address(base.address),
		pairAddress: clip(p.pairAddress, 64),
		priceUsd: p.priceUsd != null ? Number(p.priceUsd) : null,
		h1: p.priceChange?.h1 ?? null,
		h24: p.priceChange?.h24 ?? null,
		volH24: p.volume?.h24 ?? null,
		liqUsd: p.liquidity?.usd ?? null,
		mcap: p.marketCap ?? p.fdv ?? null,
		ageDays: ageDays(p.pairCreatedAt),
		url: clip(p.url, 120),
		socials: socials.slice(0, 3)
	};
}
/** Format an array of pairs: sorted by liquidity desc, capped, compact lines. */
function formatPairs(pairs, { limit = 12, empty = "No pairs found." } = {}) {
	const list = (Array.isArray(pairs) ? pairs : []).map(normalizePair).sort((a, b) => (Number(b.liqUsd) || 0) - (Number(a.liqUsd) || 0)).slice(0, limit);
	if (!list.length) return empty;
	return list.map((p) => {
		const price = p.priceUsd != null ? usd(p.priceUsd) : "—";
		const socials = p.socials.length ? `\n  ${p.socials.join(" · ")}` : "";
		const age = p.ageDays != null ? ` · age ${p.ageDays}d` : "";
		return `${p.chain} · ${p.dex} · ${p.pair}  ${price}  (h1 ${pct(p.h1)} · h24 ${pct(p.h24)})  vol24 ${usd(p.volH24)}  liq ${usd(p.liqUsd)}  mcap ${usd(p.mcap)}${age}\n  ${p.baseSymbol} ${p.address} · ${p.url}${socials}`;
	}).join("\n");
}
/** Format token profiles (newly listed/promoted tokens). */
function formatProfiles(data, { limit = 12 } = {}) {
	const list = Array.isArray(data) ? data : data ? [data] : [];
	if (!list.length) return "No token profiles.";
	return list.slice(0, limit).map((t) => {
		const desc = clip(t.description, 160);
		const links = Array.isArray(t.links) ? t.links.map((l) => clip(l.url, 80)).filter(Boolean).slice(0, 3) : [];
		return `${clip(t.chainId, 24)} · ${clip(t.tokenAddress, 64)}${desc ? `\n  ${desc}` : ""}\n  ${clip(t.url, 120)}${links.length ? ` · ${links.join(" · ")}` : ""}`;
	}).join("\n");
}
/** Format boosted tokens (paid-promotion signal). */
function formatBoosts(data, { limit = 12 } = {}) {
	const list = Array.isArray(data) ? data : data ? [data] : [];
	if (!list.length) return "No boosted tokens.";
	return list.slice(0, limit).map((b) => {
		const amount = b.amount != null ? `boost ${Number(b.amount)}` : "";
		const total = b.totalAmount != null ? ` (total ${Number(b.totalAmount)})` : "";
		const desc = clip(b.description, 120);
		return `${clip(b.chainId, 24)} · ${clip(b.tokenAddress, 64)}  ${amount}${total}${desc ? `\n  ${desc}` : ""}\n  ${clip(b.url, 120)}`;
	}).join("\n");
}
/** Low-level GET with timeout + query serialization. Throws on failure. */
function dexGet(path, params = {}) {
	return httpJson(BASE + path, {
		params,
		headers: {
			accept: "application/json",
			"user-agent": "WieldOS-Agent/1.0"
		},
		label: "DexScreener"
	});
}
async function dexSearch(query) {
	return formatPairs((await dexGet("/latest/dex/search", { q: query }))?.pairs, { empty: `No pairs matched "${clip(query, 60)}".` });
}
async function dexToken(chainId, addresses) {
	const joined = addresses.map((a) => encodeURIComponent(a)).join(",");
	return formatPairs(await dexGet(`/tokens/v1/${encodeURIComponent(chainId)}/${joined}`), { empty: "No pools found for those tokens." });
}
async function dexTokenPairs(chainId, tokenAddress) {
	return formatPairs(await dexGet(`/token-pairs/v1/${encodeURIComponent(chainId)}/${encodeURIComponent(tokenAddress)}`), { empty: "No pools found for that token." });
}
async function dexPair(chainId, pairId) {
	return formatPairs((await dexGet(`/latest/dex/pairs/${encodeURIComponent(chainId)}/${encodeURIComponent(pairId)}`))?.pairs, { empty: "No pair found." });
}
async function dexProfiles() {
	return formatProfiles(await dexGet("/token-profiles/latest/v1"));
}
/**
* Structured pair fetch for the research pipeline (the dexscreener_pairs
* adapter). Returns an array of normalizePair() objects (not formatted text),
* sorted by liquidity desc. Supply exactly one of query / tokenAddress / pairId;
* chainId defaults to DEX_DEFAULT_CHAIN.
*/
async function dexFetchPairs({ chainId = DEX_DEFAULT_CHAIN, query = "", tokenAddress = "", pairId = "" } = {}) {
	let data;
	if (query) data = (await dexGet("/latest/dex/search", { q: query }))?.pairs;
	else if (pairId) data = (await dexGet(`/latest/dex/pairs/${encodeURIComponent(chainId)}/${encodeURIComponent(pairId)}`))?.pairs;
	else if (tokenAddress) data = await dexGet(`/token-pairs/v1/${encodeURIComponent(chainId)}/${encodeURIComponent(tokenAddress)}`);
	else throw new Error("dexFetchPairs requires one of: query, tokenAddress, or pairId.");
	return (Array.isArray(data) ? data : []).map(normalizePair).sort((a, b) => (Number(b.liqUsd) || 0) - (Number(a.liqUsd) || 0)).slice(0, 12);
}
async function dexBoosts(list = "top") {
	return formatBoosts(await dexGet(list === "latest" ? "/token-boosts/latest/v1" : "/token-boosts/top/v1"));
}
//#endregion
//#region src/lib/server/providers/sourcify.js
var sourcify_exports = /* @__PURE__ */ __exportAll({
	CONTRACT_FIELDS: () => CONTRACT_FIELDS,
	SOURCIFY_DEFAULT_CHAIN: () => "1",
	SOURCIFY_DEFAULT_SERVER: () => SOURCIFY_DEFAULT_SERVER,
	fetchContract: () => fetchContract,
	formatContract: () => formatContract,
	normalizeContract: () => normalizeContract
});
var SOURCIFY_DEFAULT_SERVER = "https://sourcify.dev/server";
var CONTRACT_FIELDS = "abi,compilation,proxyResolution,deployment";
/** Human-readable signature for an ABI function/event/error entry, e.g.
*  "Transfer(address,address,uint256)". */
function signatureOf(item = {}) {
	const inputs = Array.isArray(item.inputs) ? item.inputs.map((i) => clip(i?.type, 40)) : [];
	return `${clip(item.name, 80)}(${inputs.join(",")})`;
}
function abiByType(abi, type) {
	return (Array.isArray(abi) ? abi : []).filter((i) => i?.type === type).map(signatureOf);
}
function normalizeContract(raw = {}) {
	const compilation = raw.compilation ?? {};
	const proxy = raw.proxyResolution ?? {};
	const deployment = raw.deployment ?? {};
	const abi = Array.isArray(raw.abi) ? raw.abi : [];
	const chainId = clip(raw.chainId, 24);
	const address$1 = address(raw.address);
	return {
		id: `${chainId}-${address$1}`,
		chainId,
		address: address$1,
		name: clip(compilation.name, 80),
		match: clip(raw.match ?? raw.runtimeMatch ?? raw.creationMatch, 24),
		compilerVersion: clip(compilation.compilerVersion, 48),
		language: clip(compilation.language, 24),
		evmVersion: clip(compilation.compilerSettings?.evmVersion, 24),
		verifiedAt: clip(raw.verifiedAt, 40),
		isProxy: Boolean(proxy.isProxy),
		proxyType: clip(proxy.proxyType, 40),
		implementations: Array.isArray(proxy.implementations) ? proxy.implementations.map((i) => address(i?.address)).filter(Boolean) : [],
		deploymentTxHash: txHash(deployment.transactionHash),
		events: abiByType(abi, "event"),
		functions: abiByType(abi, "function"),
		abi
	};
}
var FN_LIMIT = 30;
function formatContract(c) {
	return [
		`${c.name || "(unnamed)"} — verified contract on chain ${c.chainId}`,
		[
			c.address,
			c.compilerVersion,
			c.language
		].filter(Boolean).join(" · "),
		[
			c.match && `match ${c.match}`,
			c.verifiedAt && `verified ${c.verifiedAt}`,
			c.evmVersion
		].filter(Boolean).join(" · "),
		c.isProxy ? `proxy${c.proxyType ? ` (${c.proxyType})` : ""}${c.implementations.length ? ` → ${c.implementations.join(", ")}` : ""}` : "",
		`${c.functions.length} functions · ${c.events.length} events`,
		c.events.length ? `events: ${c.events.join(", ")}` : "",
		c.functions.length ? `functions: ${c.functions.slice(0, FN_LIMIT).join(", ")}${c.functions.length > FN_LIMIT ? ` … (+${c.functions.length - FN_LIMIT})` : ""}` : ""
	].filter(Boolean).join("\n");
}
/**
* Fetch a verified contract (ABI, events, compilation, proxy info) from the
* Sourcify v2 contract-lookup endpoint. Returns a normalizeContract() object.
* Throws a friendly error when the contract isn't verified on that chain.
*/
async function fetchContract({ chainId = "1", address, serverUrl = SOURCIFY_DEFAULT_SERVER } = {}) {
	const addr = String(address ?? "").trim();
	if (!addr) throw new Error("A contract address is required.");
	const chain = String(chainId ?? "").trim() || "1";
	const base = (serverUrl || "https://sourcify.dev/server").replace(/\/+$/, "");
	try {
		return normalizeContract(await httpJson(`${base}/v2/contract/${encodeURIComponent(chain)}/${encodeURIComponent(addr)}`, {
			params: { fields: CONTRACT_FIELDS },
			headers: { accept: "application/json" },
			label: "Sourcify"
		}));
	} catch (err) {
		if (/HTTP 404/.test(err?.message ?? "")) throw new Error(`No verified contract for ${addr} on chain ${chain}.`);
		throw err;
	}
}
//#endregion
//#region src/lib/server/providers/telegram.js
var telegram_exports = /* @__PURE__ */ __exportAll({
	DEFAULT_LIMIT: () => 30,
	MAX_LIMIT: () => 100,
	clampLimit: () => clampLimit,
	fetchMessages: () => fetchMessages,
	formatMessage: () => formatMessage,
	formatMessages: () => formatMessages,
	normalizeChannel: () => normalizeChannel,
	normalizeMessage: () => normalizeMessage
});
/** Clamp a requested message count to [1, MAX_LIMIT], defaulting when absent. */
function clampLimit(value, fallback = 30) {
	const n = Number(value);
	if (!Number.isFinite(n) || n <= 0) return fallback;
	return Math.min(Math.floor(n), 100);
}
/** Accept '@name', 'name', or a t.me/(s/)name link → the bare username GramJS resolves. */
function normalizeChannel(value) {
	const raw = String(value ?? "").trim();
	if (!raw) return "";
	const link = raw.match(/^https?:\/\/t\.me\/(?:s\/)?([^/?#]+)/i);
	return (link ? link[1] : raw).replace(/^@+/, "");
}
function toIso(value) {
	if (value == null) return null;
	const ms = value instanceof Date ? value.getTime() : Number(value) * 1e3;
	const d = new Date(ms);
	return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
function normalizeMessage(raw = {}, chat = {}) {
	const username = handle(chat.username);
	const id = raw.id != null ? String(raw.id) : "";
	return {
		id,
		chat: clip(chat.title || chat.username, 120),
		chatUsername: username,
		text: clip(raw.message, 1e3),
		date: toIso(raw.date),
		views: Number(raw.views ?? 0),
		forwards: Number(raw.forwards ?? 0),
		replies: Number(raw.replies?.replies ?? 0),
		url: username && id ? `https://t.me/${username}/${id}` : ""
	};
}
function formatMessage(m) {
	const who = m.chatUsername ? `@${m.chatUsername}` : m.chat;
	const when = m.date ? ` (${m.date})` : "";
	const engagement = `👁${m.views} ↻${m.forwards} 💬${m.replies}`;
	const link = m.url ? ` — ${m.url}` : "";
	return `#${m.id} ${who}${when}\n${m.text || "(no text)"}\n${engagement}${link}`;
}
function formatMessages(messages, { empty = "No messages found." } = {}) {
	if (!messages.length) return empty;
	return messages.map(formatMessage).join("\n\n");
}
async function getClient({ apiId, apiHash, session }) {
	if (!apiId || !apiHash || !session) throw new Error("Telegram is not configured (need apiId, apiHash, and a session string).");
	const { TelegramClient } = await import('telegram');
	const { StringSession } = await import('telegram/sessions/index.js');
	const client = new TelegramClient(new StringSession(String(session)), Number(apiId), String(apiHash), {
		connectionRetries: 3,
		autoReconnect: false
	});
	client.setLogLevel("none");
	client.onError = async () => {};
	await client.connect();
	return client;
}
/**
* Read recent messages from a channel/group.
* @param {object} opts
* @param {string} opts.channel @username or t.me link.
* @param {number} [opts.limit] Max messages (clamped to [1, MAX_LIMIT]).
* @param {number|string} [opts.minId] Only messages newer than this id (0 = all).
* @param {string} opts.apiId
* @param {string} opts.apiHash
* @param {string} opts.session
* @returns {Promise<object[]>} Normalized messages (newest first).
*/
async function fetchMessages({ channel, limit, minId = 0, apiId, apiHash, session } = {}) {
	const target = normalizeChannel(channel);
	if (!target) throw new Error("A channel username or t.me link is required.");
	const take = clampLimit(limit);
	const client = await getClient({
		apiId,
		apiHash,
		session
	});
	try {
		const entity = await client.getEntity(target);
		const chat = {
			title: entity?.title ?? "",
			username: entity?.username ?? target
		};
		return (await client.getMessages(entity, {
			limit: take,
			minId: minId ? Number(minId) : void 0
		})).map((m) => normalizeMessage(m, chat)).filter((m) => m.id);
	} finally {
		await client.destroy().catch(() => {});
	}
}
//#endregion
//#region src/lib/server/providers/viem.js
var viem_exports = /* @__PURE__ */ __exportAll({
	DEFAULT_LOOKBACK_BLOCKS: () => 500,
	ERC20_ABI: () => ERC20_ABI,
	decodeEventLog: () => decodeEventLog,
	formatEther: () => formatEther,
	formatUnits: () => formatUnits,
	getPublicClient: () => getPublicClient,
	getWalletClient: () => getWalletClient,
	parseAbi: () => parseAbi,
	parseAbiItem: () => parseAbiItem,
	publicClientFromUrl: () => publicClientFromUrl,
	resolveFromBlock: () => resolveFromBlock
});
function publicClientFromUrl(rpcUrl) {
	if (!rpcUrl) throw new Error("EVM not configured (add an active EVM instance with an RPC URL).");
	return createPublicClient({ transport: http(rpcUrl, { timeout: 15e3 }) });
}
function getPublicClient() {
	return publicClientFromUrl(getProviderValues("viem").rpcUrl);
}
function getWalletClient() {
	const { rpcUrl, privateKey } = getProviderValues("viem");
	if (!rpcUrl) throw new Error("EVM not configured (add an active EVM instance with an RPC URL).");
	if (!privateKey) throw new Error("EVM writes not configured (add a privateKey to the active EVM instance).");
	const account = privateKeyToAccount(privateKey);
	return {
		client: createWalletClient({
			account,
			transport: http(rpcUrl, { timeout: 15e3 })
		}),
		account
	};
}
var MAX_LOOKBACK_BLOCKS = 5e6;
function resolveFromBlock(cursor, latest, lookbackBlocks) {
	if (cursor) return BigInt(cursor) + 1n;
	const requested = Math.floor(Number(lookbackBlocks));
	const back = BigInt(Number.isFinite(requested) && requested > 0 ? Math.min(requested, MAX_LOOKBACK_BLOCKS) : 500);
	return latest > back ? latest - back : 0n;
}
var ERC20_ABI = parseAbi([
	"function name() view returns (string)",
	"function symbol() view returns (string)",
	"function decimals() view returns (uint8)",
	"function totalSupply() view returns (uint256)",
	"function balanceOf(address account) view returns (uint256)",
	"function allowance(address owner, address spender) view returns (uint256)",
	"function transfer(address to, uint256 amount) returns (bool)",
	"function approve(address spender, uint256 amount) returns (bool)",
	"event Transfer(address indexed from, address indexed to, uint256 value)",
	"event Approval(address indexed owner, address indexed spender, uint256 value)"
]);

export { getAdapter as $, twitterReplies as A, twitterMentions as B, twitterFollowers as C, twitterFollowings as D, twitterTrends as E, getPublicClient as F, ERC20_ABI as G, getWalletClient as H, fetchUserByUsername as I, formatUser$1 as J, fetchUserTweets as K, formatTweets$1 as L, moreCursor as M, searchRecentTweets as N, txHash as O, address as P, handle as Q, clip as R, viem_exports as S, telegram_exports as T, sourcify_exports as U, dexscreener_exports as V, twitterapi_exports as W, xapi_exports as X, httpJson as Y, assertPublicHttpUrl as Z, deleteAdapter as _, dexToken as a, updateAdapter as a0, createAdapter as a1, dexTokenPairs as b, dexPair as c, dexSearch as d, dexProfiles as e, dexBoosts as f, getAdapterByType as g, formatContract as h, fetchContract as i, formatMessages as j, fetchMessages as k, listAdapters as l, clampLimit as m, twitterCreateTweet as n, twitterLike as o, twitterRetweet as p, twitterFollow as q, twitterSendDm as r, str as s, toStrArray as t, formatUser as u, twitterUserInfo as v, twitterUserTweets as w, formatTweets as x, twitterSearch as y, twitterTweetsByIds as z };
//# sourceMappingURL=viem.js-Dnkpuzyj.js.map
