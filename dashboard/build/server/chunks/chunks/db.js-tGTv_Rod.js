import { T as THEME_PRESETS } from './theme-presets.js-B35K5uvm.js';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

//#region src/lib/server/db/settings-registry.js
/**
* @typedef {Object} SettingDef
* @property {string} key     setting key (also the db key)
* @property {string} group   UI section
* @property {string} label   UI label
* @property {'string'|'number'|'boolean'|'secret'} type
* @property {string|number|boolean} [default]
* @property {string} [help]
*/
/** @type {SettingDef[]}
*  Built-in, app-level config. Used to type getSetting and to seed the
*  database (see seedSettings.js). External integration credentials (Twitter,
*  Tavily, EVM, Notion, Telegram, webhook) are configured as provider Instances
*  instead (Instances page) — see the clients in server/providers/. */
var SETTINGS = [
	{
		key: "ANTHROPIC_API_KEY",
		group: "Core AI",
		label: "Anthropic API key",
		type: "secret",
		help: "Required for every agent feature. Without it, all AI is inert."
	},
	{
		key: "ANTHROPIC_MODEL",
		group: "Core AI",
		label: "Model",
		type: "string",
		default: "claude-sonnet-4-6",
		help: "Model id used for all calls and cost estimates."
	},
	{
		key: "AI_REQUEST_TIMEOUT_MS",
		group: "Core AI",
		label: "Request timeout (ms)",
		type: "number",
		default: 12e4,
		help: "Per-request timeout. Raised to at least 10000."
	},
	{
		key: "SCHEDULER_ENABLED",
		group: "Scheduler",
		label: "Enable background scheduler",
		type: "boolean",
		default: false,
		help: "Background agent work + collector polling. Starting/stopping the loop takes effect on next restart."
	},
	{
		key: "SCHEDULER_INTERVAL_MINUTES",
		group: "Scheduler",
		label: "Tick interval (minutes)",
		type: "number",
		default: 15,
		help: "How often the scheduler runs."
	},
	{
		key: "ALIAS",
		group: "General",
		label: "Your name / alias",
		type: "string",
		default: "",
		help: "Displayed on the overview page greeting. Leave blank to hide the name."
	},
	{
		key: "APP_BASE_URL",
		group: "General",
		label: "App base URL",
		type: "string",
		help: "Used to build absolute links in notifications (e.g. https://wieldos.example.com)."
	},
	{
		key: "RECORDS_KEEP_RAW",
		group: "General",
		label: "Keep raw record payloads",
		type: "boolean",
		default: false,
		help: "Persist the original API payload alongside each captured record."
	},
	{
		key: "DASHBOARD_PIN",
		group: "Security",
		label: "Dashboard PIN",
		type: "secret",
		help: "Set a PIN to enable the Lock button. Leave blank to disable locking. Changes take effect immediately (existing sessions stay valid until the PIN changes)."
	},
	{
		key: "COLLECTOR_MAX_RECORDS",
		group: "Collectors",
		label: "Records per run",
		type: "number",
		default: 50,
		help: "How many records one collector run persists; the adapter stops collecting once the cap is hit."
	},
	{
		key: "COLLECTOR_MAX_OBSERVATIONS",
		group: "Collectors",
		label: "Observations per run",
		type: "number",
		default: 5,
		help: "How many fresh records per run become observations for the subscribed agent."
	},
	{
		key: "TRANSFORMER_MAX_SOURCE_RECORDS",
		group: "Transformers",
		label: "Source records per run",
		type: "number",
		default: 200,
		help: "How many matching source records one run processes; the rest wait for the next run."
	},
	{
		key: "TRANSFORMER_MAX_ENRICH_CALLS",
		group: "Transformers",
		label: "Enrich calls per run",
		type: "number",
		default: 25,
		help: "ctx.enrich() budget per run (each call is ≥1 external API request). Hitting it stops the run; unprocessed records are deferred."
	},
	{
		key: "TRANSFORMER_MAX_LOG_LINES",
		group: "Transformers",
		label: "Log lines per run",
		type: "number",
		default: 50,
		help: "ctx.log() and skip-reason lines kept in a run summary."
	}
];
//#endregion
//#region src/lib/server/db/seedSettings.js
function seedSettings(database) {
	const BOOKKEEPING_KEY = "__seeded_keys__";
	const row = database.prepare(`SELECT value FROM app_settings WHERE key = ?`).get(BOOKKEEPING_KEY);
	let seeded;
	try {
		const parsed = JSON.parse(row?.value ?? "[]");
		seeded = new Set(Array.isArray(parsed) ? parsed : []);
	} catch {
		seeded = /* @__PURE__ */ new Set();
	}
	const insert = database.prepare(`INSERT OR IGNORE INTO app_settings (key, value, group_name) VALUES (?, ?, ?)`);
	let added = false;
	for (const s of SETTINGS) {
		if (seeded.has(s.key)) continue;
		insert.run(s.key, s.default != null ? String(s.default) : "", s.group);
		seeded.add(s.key);
		added = true;
	}
	if (added || !row) database.prepare(`INSERT INTO app_settings (key, value, group_name) VALUES (?, ?, '')
				 ON CONFLICT(key) DO UPDATE SET value = excluded.value`).run(BOOKKEEPING_KEY, JSON.stringify([...seeded]));
	return added;
}
//#endregion
//#region src/lib/server/providers/adapter-seeds.js
var TWEET_FIELDS = [
	"url",
	"text",
	"author",
	"authorName",
	"createdAt",
	"lang",
	"likes",
	"retweets",
	"replies",
	"quotes",
	"views",
	"isReply",
	"isQuote",
	"isRetweet"
];
var USER_FIELDS = [
	"handle",
	"name",
	"bio",
	"location",
	"url",
	"followers",
	"following",
	"tweets",
	"verified",
	"verifiedType",
	"createdAt"
];
var fields = (list) => JSON.stringify(list);
var ADAPTER_SEEDS = [
	{
		type: "xapi_search",
		label: "X API search",
		provider: "xapi",
		description: "Searches recent tweets and watermarks by newest tweet id into xapi_tweet records.",
		inputHint: "{ \"query\": \"PulseChain OR #PLS from:RichardHeartWin -is:retweet\", \"sortOrder\": \"recency\" }",
		defaultRecordType: "xapi_tweet",
		toolEnabled: true,
		script: `const { input, credentials, clients, paginate } = ctx;
const query = String(input.query ?? '').trim();
if (!query) throw new Error('xapi_search requires input.query');
const sortOrder = input.sortOrder === 'relevancy' ? 'relevancy' : 'recency';
return paginate({
	mode: 'newest-id',
	fetchPage: () => clients.xapi.searchRecentTweets({ query, sortOrder, bearerToken: credentials.bearerToken }),
	items: (r) => r.tweets,
	shape: { type: 'xapi_tweet', id: 'id', capturedAt: 'createdAt', fields: ${fields(TWEET_FIELDS)} }
});`
	},
	{
		type: "xapi_fetch_user_tweets",
		label: "X API user tweets",
		provider: "xapi",
		description: "Reads an account’s recent tweets (handle resolved to a user id first) into xapi_tweet records.",
		inputHint: "{ \"username\": \"elonmusk\", \"excludeReplies\": false }",
		defaultRecordType: "xapi_tweet",
		toolEnabled: true,
		script: `const { input, credentials, clients, paginate } = ctx;
const username = String(input.username ?? '').trim().replace(/^@/, '');
if (!username) throw new Error('xapi_fetch_user_tweets requires input.username');
const excludeReplies = Boolean(input.excludeReplies);
const bearerToken = credentials.bearerToken;
const user = await clients.xapi.fetchUserByUsername(username, { bearerToken });
return paginate({
	mode: 'newest-id',
	fetchPage: () => clients.xapi.fetchUserTweets({ userId: user.id, excludeReplies, bearerToken }),
	items: (r) => r.tweets,
	shape: { type: 'xapi_tweet', id: 'id', capturedAt: 'createdAt', fields: ${fields(TWEET_FIELDS)} }
});`
	},
	{
		type: "xapi_fetch_user",
		label: "X API user lookup",
		provider: "xapi",
		description: "Looks up an X account by handle and emits one xapi_user record.",
		inputHint: "{ \"username\": \"elonmusk\" }",
		defaultRecordType: "xapi_user",
		toolEnabled: true,
		script: `const { input, credentials, clients, save } = ctx;
const username = String(input.username ?? '').trim().replace(/^@/, '');
if (!username) throw new Error('xapi_fetch_user requires input.username');
const user = await clients.xapi.fetchUserByUsername(username, { bearerToken: credentials.bearerToken });
save(user, { type: 'xapi_user', id: 'id', fields: ${fields(USER_FIELDS)} });
return {};`
	},
	{
		type: "twitterapi_search",
		label: "X/Twitter search",
		provider: "twitterapi",
		description: "Collects tweets matching a query into tweet records, watermarked by newest tweet id.",
		inputHint: "{ \"query\": \"PulseChain\", \"queryType\": \"Latest\" }",
		defaultRecordType: "tweet",
		toolEnabled: true,
		script: `const { input, credentials, clients, paginate } = ctx;
const query = String(input.query ?? '').trim();
if (!query) throw new Error('twitterapi_search requires input.query');
const queryType = input.queryType === 'Top' ? 'Top' : 'Latest';
return paginate({
	mode: 'newest-id',
	fetchPage: () => clients.twitterapi.twitterSearch({ query, queryType, apiKey: credentials.apiKey }),
	items: (r) => r.tweets,
	shape: { type: 'tweet', id: 'id', capturedAt: 'createdAt', fields: ${fields(TWEET_FIELDS)} }
});`
	},
	{
		type: "twitterapi_user_tweets",
		label: "X/Twitter user tweets",
		provider: "twitterapi",
		description: "Collects a specific account's latest tweets into tweet records, watermarked by newest tweet id.",
		inputHint: "{ \"userName\": \"elonmusk\", \"includeReplies\": false }",
		defaultRecordType: "tweet",
		toolEnabled: true,
		script: `const { input, credentials, clients, paginate } = ctx;
const userName = String(input.userName ?? '').trim().replace(/^@/, '');
if (!userName) throw new Error('twitterapi_user_tweets requires input.userName');
const includeReplies = Boolean(input.includeReplies);
return paginate({
	mode: 'newest-id',
	fetchPage: () => clients.twitterapi.twitterUserTweets({ userName, includeReplies, apiKey: credentials.apiKey }),
	items: (r) => r.tweets,
	shape: { type: 'tweet', id: 'id', capturedAt: 'createdAt', fields: ${fields(TWEET_FIELDS)} }
});`
	},
	{
		type: "twitterapi_mentions",
		label: "X/Twitter mentions",
		provider: "twitterapi",
		description: "Collects tweets mentioning a handle into tweet records — useful for monitoring chatter about a project or brand.",
		inputHint: "{ \"userName\": \"PulseChain\" }",
		defaultRecordType: "tweet",
		toolEnabled: true,
		script: `const { input, credentials, clients, paginate } = ctx;
const userName = String(input.userName ?? '').trim().replace(/^@/, '');
if (!userName) throw new Error('twitterapi_mentions requires input.userName');
return paginate({
	mode: 'newest-id',
	fetchPage: () => clients.twitterapi.twitterMentions({ userName, apiKey: credentials.apiKey }),
	items: (r) => r.tweets,
	shape: { type: 'tweet', id: 'id', capturedAt: 'createdAt', fields: ${fields(TWEET_FIELDS)} }
});`
	},
	{
		type: "twitterapi_replies",
		label: "X/Twitter replies",
		provider: "twitterapi",
		description: "Collects replies to a specific tweet into tweet_reply records, watermarked by newest reply id.",
		inputHint: "{ \"tweetId\": \"1234567890123456789\" }",
		defaultRecordType: "tweet_reply",
		toolEnabled: true,
		script: `const { input, credentials, clients, paginate, toRecord } = ctx;
const tweetId = String(input.tweetId ?? '').trim();
if (!tweetId) throw new Error('twitterapi_replies requires input.tweetId');
const shape = { type: 'tweet_reply', id: 'id', capturedAt: 'createdAt', fields: ${fields([...TWEET_FIELDS, "inReplyTo"])} };
return paginate({
	mode: 'newest-id',
	fetchPage: () => clients.twitterapi.twitterReplies({ tweetId, apiKey: credentials.apiKey }),
	items: (r) => r.tweets,
	build: (t) => toRecord({ ...t, inReplyTo: tweetId }, shape),
	id: (t) => t.id
});`
	},
	{
		type: "twitterapi_followers",
		label: "X/Twitter followers",
		provider: "twitterapi",
		description: "Collects an account's followers into twitter_user records; the cursor walks one page per run and resets once exhausted.",
		inputHint: "{ \"userName\": \"PulseChain\" }",
		defaultRecordType: "twitter_user",
		toolEnabled: true,
		script: `const { input, credentials, clients, paginate } = ctx;
const userName = String(input.userName ?? '').trim().replace(/^@/, '');
if (!userName) throw new Error('twitterapi_followers requires input.userName');
return paginate({
	mode: 'paginate',
	fetchPage: (c) => clients.twitterapi.twitterFollowers({ userName, cursor: c, apiKey: credentials.apiKey }),
	items: (r) => r.users,
	paging: (r) => ({ nextCursor: r.nextCursor, hasNext: r.hasNext }),
	shape: { type: 'twitter_user', id: 'id', fields: ${fields(USER_FIELDS)} }
});`
	},
	{
		type: "twitterapi_followings",
		label: "X/Twitter followings",
		provider: "twitterapi",
		description: "Collects the accounts a user follows into twitter_user records; paginates across runs then resets to refresh.",
		inputHint: "{ \"userName\": \"PulseChain\" }",
		defaultRecordType: "twitter_user",
		toolEnabled: true,
		script: `const { input, credentials, clients, paginate } = ctx;
const userName = String(input.userName ?? '').trim().replace(/^@/, '');
if (!userName) throw new Error('twitterapi_followings requires input.userName');
return paginate({
	mode: 'paginate',
	fetchPage: (c) => clients.twitterapi.twitterFollowings({ userName, cursor: c, apiKey: credentials.apiKey }),
	items: (r) => r.users,
	paging: (r) => ({ nextCursor: r.nextCursor, hasNext: r.hasNext }),
	shape: { type: 'twitter_user', id: 'id', fields: ${fields(USER_FIELDS)} }
});`
	},
	{
		type: "dexscreener_pairs",
		label: "DexScreener pairs",
		provider: "dexscreener",
		description: "Fetches token pairs (by query, token address, or pair id) into token_pair records. Public API, no credentials.",
		inputHint: "{ \"query\": \"PulseChain\" }",
		defaultRecordType: "token_pair",
		script: `const { input, config, clients, save } = ctx;
const chainId = String(input.chainId ?? '').trim() || String(config.chainId ?? '').trim() || clients.dexscreener.DEX_DEFAULT_CHAIN;
const pairs = await clients.dexscreener.dexFetchPairs({
	chainId,
	query: String(input.query ?? '').trim(),
	tokenAddress: String(input.tokenAddress ?? '').trim(),
	pairId: String(input.pairId ?? '').trim()
});
const shape = { type: 'token_pair', id: 'id', fields: ${fields([
			"chain",
			"dex",
			"pair",
			"baseSymbol",
			"address",
			"priceUsd",
			"h1",
			"h24",
			"volH24",
			"liqUsd",
			"mcap",
			"ageDays",
			"url",
			"socials"
		])} };
for (const p of pairs) if (save(p, shape) === false) break;
return {};`
	},
	{
		type: "dexscreener_search",
		label: "DexScreener search",
		provider: "dexscreener",
		description: "Search pairs by token name, symbol, or address. Returns price, volume, liquidity, and links for the top matches sorted by liquidity. Public API, no credentials.",
		inputHint: "{ \"query\": \"PulseChain OR PLSX\", \"chainId\": \"pulsechain\" }",
		defaultRecordType: "token_pair",
		toolEnabled: true,
		script: `const { input, clients, save, mode } = ctx;
const query = String(input.query ?? '').trim();
if (!query) throw new Error('dexscreener_search requires input.query');
const chainId = String(input.chainId ?? '').trim() || clients.dexscreener.DEX_DEFAULT_CHAIN;
if (mode === 'fetch') {
	return { result: await clients.dexscreener.dexSearch(query) };
}
const pairs = await clients.dexscreener.dexFetchPairs({ chainId, query });
const shape = { type: 'token_pair', id: 'id', fields: ${fields([
			"chain",
			"dex",
			"pair",
			"baseSymbol",
			"address",
			"priceUsd",
			"h1",
			"h24",
			"volH24",
			"liqUsd",
			"mcap",
			"ageDays",
			"url",
			"socials"
		])} };
for (const p of pairs) if (save(p, shape) === false) break;
return {};`
	},
	{
		type: "dexscreener_token",
		label: "DexScreener token",
		provider: "dexscreener",
		description: "Look up all trading pairs for up to 30 token contract addresses. Returns price, volume, and liquidity per pool, sorted by liquidity. Public API, no credentials.",
		inputHint: "{ \"tokenAddresses\": [\"0x...\"], \"chainId\": \"pulsechain\" }",
		defaultRecordType: "token_pair",
		toolEnabled: true,
		script: `const { input, clients, save, mode } = ctx;
const chainId = String(input.chainId ?? '').trim() || clients.dexscreener.DEX_DEFAULT_CHAIN;
const addresses = (Array.isArray(input.tokenAddresses) ? input.tokenAddresses : [input.tokenAddresses])
	.map(a => String(a ?? '').trim()).filter(Boolean).slice(0, 30);
if (!addresses.length) throw new Error('dexscreener_token requires input.tokenAddresses');
if (mode === 'fetch') {
	return { result: await clients.dexscreener.dexToken(chainId, addresses) };
}
const pairs = await clients.dexscreener.dexFetchToken(chainId, addresses);
const shape = { type: 'token_pair', id: 'id', fields: ${fields([
			"chain",
			"dex",
			"pair",
			"baseSymbol",
			"address",
			"priceUsd",
			"h1",
			"h24",
			"volH24",
			"liqUsd",
			"mcap",
			"ageDays",
			"url",
			"socials"
		])} };
for (const p of pairs) if (save(p, shape) === false) break;
return {};`
	},
	{
		type: "dexscreener_token_pairs",
		label: "DexScreener token pairs",
		provider: "dexscreener",
		description: "List all trading pools for a single token contract address. Returns price, volume, liquidity, and age per pool. Public API, no credentials.",
		inputHint: "{ \"tokenAddress\": \"0x...\", \"chainId\": \"pulsechain\" }",
		defaultRecordType: "token_pair",
		toolEnabled: true,
		script: `const { input, clients, save, mode } = ctx;
const tokenAddress = String(input.tokenAddress ?? '').trim();
if (!tokenAddress) throw new Error('dexscreener_token_pairs requires input.tokenAddress');
const chainId = String(input.chainId ?? '').trim() || clients.dexscreener.DEX_DEFAULT_CHAIN;
if (mode === 'fetch') {
	return { result: await clients.dexscreener.dexTokenPairs(chainId, tokenAddress) };
}
const pairs = await clients.dexscreener.dexFetchPairs({ chainId, tokenAddress });
const shape = { type: 'token_pair', id: 'id', fields: ${fields([
			"chain",
			"dex",
			"pair",
			"baseSymbol",
			"address",
			"priceUsd",
			"h1",
			"h24",
			"volH24",
			"liqUsd",
			"mcap",
			"ageDays",
			"url",
			"socials"
		])} };
for (const p of pairs) if (save(p, shape) === false) break;
return {};`
	},
	{
		type: "dexscreener_pair",
		label: "DexScreener pair",
		provider: "dexscreener",
		description: "Fetch a specific trading pair by its contract address. Returns price, volume, liquidity, market cap, and age. Public API, no credentials.",
		inputHint: "{ \"pairId\": \"0x...\", \"chainId\": \"pulsechain\" }",
		defaultRecordType: "token_pair",
		toolEnabled: true,
		script: `const { input, clients, save, mode } = ctx;
const pairId = String(input.pairId ?? '').trim();
if (!pairId) throw new Error('dexscreener_pair requires input.pairId');
const chainId = String(input.chainId ?? '').trim() || clients.dexscreener.DEX_DEFAULT_CHAIN;
if (mode === 'fetch') {
	return { result: await clients.dexscreener.dexPair(chainId, pairId) };
}
const pairs = await clients.dexscreener.dexFetchPairs({ chainId, pairId });
const shape = { type: 'token_pair', id: 'id', fields: ${fields([
			"chain",
			"dex",
			"pair",
			"baseSymbol",
			"address",
			"priceUsd",
			"h1",
			"h24",
			"volH24",
			"liqUsd",
			"mcap",
			"ageDays",
			"url",
			"socials"
		])} };
for (const p of pairs) if (save(p, shape) === false) break;
return {};`
	},
	{
		type: "dexscreener_profiles",
		label: "DexScreener token profiles",
		provider: "dexscreener",
		description: "Fetch the latest newly-profiled token listings on DexScreener: description, links, and chain for each. No input required. Public API, no credentials.",
		inputHint: "",
		defaultRecordType: "token_profile",
		toolEnabled: true,
		script: `const { clients, save, mode } = ctx;
if (mode === 'fetch') {
	return { result: await clients.dexscreener.dexProfiles() };
}
const data = await clients.dexscreener.dexFetchProfilesRaw();
const list = Array.isArray(data) ? data : [];
const shape = { type: 'token_profile', id: 'id', fields: ${fields([
			"chainId",
			"tokenAddress",
			"url",
			"description",
			"links"
		])} };
for (const item of list.slice(0, clients.dexscreener.MAX_ITEMS)) {
	const record = {
		id: String(item.chainId ?? '') + '_' + String(item.tokenAddress ?? ''),
		chainId: String(item.chainId ?? ''),
		tokenAddress: String(item.tokenAddress ?? ''),
		url: String(item.url ?? ''),
		description: String(item.description ?? ''),
		links: (Array.isArray(item.links) ? item.links : []).map(l => String(l.url ?? '')).filter(Boolean)
	};
	if (save(record, shape) === false) break;
}
return {};`
	},
	{
		type: "dexscreener_boosts",
		label: "DexScreener boosted tokens",
		provider: "dexscreener",
		description: "Fetch top or latest boosted (paid-promoted) tokens on DexScreener. Boost amount is a signal for paid attention. Public API, no credentials.",
		inputHint: "{ \"list\": \"top\" }",
		defaultRecordType: "token_boost",
		toolEnabled: true,
		script: `const { input, clients, save, mode } = ctx;
const list = input.list === 'latest' ? 'latest' : 'top';
if (mode === 'fetch') {
	return { result: await clients.dexscreener.dexBoosts(list) };
}
const data = await clients.dexscreener.dexFetchBoostsRaw(list);
const items = Array.isArray(data) ? data : [];
const shape = { type: 'token_boost', id: 'id', fields: ${fields([
			"chainId",
			"tokenAddress",
			"url",
			"description",
			"amount",
			"totalAmount"
		])} };
for (const item of items.slice(0, clients.dexscreener.MAX_ITEMS)) {
	const record = {
		id: String(item.chainId ?? '') + '_' + String(item.tokenAddress ?? ''),
		chainId: String(item.chainId ?? ''),
		tokenAddress: String(item.tokenAddress ?? ''),
		url: String(item.url ?? ''),
		description: String(item.description ?? ''),
		amount: item.amount ?? null,
		totalAmount: item.totalAmount ?? null
	};
	if (save(record, shape) === false) break;
}
return {};`
	},
	{
		type: "sourcify_fetch_contract",
		label: "Sourcify contract lookup",
		provider: "sourcify",
		description: "Looks up a verified contract by chain + address and emits one verified_contract record. Public API, no credentials.",
		inputHint: "{ \"address\": \"0x…\", \"chainId\": \"1\" }",
		defaultRecordType: "verified_contract",
		toolEnabled: true,
		script: `const { input, config, clients, save } = ctx;
const address = String(input.address ?? '').trim();
if (!address) throw new Error('sourcify_fetch_contract requires input.address');
const chainId = String(input.chainId ?? '').trim() || String(config.chainId ?? '').trim() || clients.sourcify.SOURCIFY_DEFAULT_CHAIN;
const serverUrl = String(config.serverUrl ?? '').trim();
const contract = await clients.sourcify.fetchContract({ chainId, address, serverUrl });
save(contract, { type: 'verified_contract', id: 'id', capturedAt: 'verifiedAt', fields: ${fields([
			"chainId",
			"address",
			"name",
			"match",
			"compilerVersion",
			"language",
			"evmVersion",
			"verifiedAt",
			"isProxy",
			"proxyType",
			"implementations",
			"deploymentTxHash",
			"events",
			"functions",
			"abi"
		])} });
return {};`
	},
	{
		type: "telegram_fetch_messages",
		label: "Telegram channel messages",
		provider: "telegram",
		description: "Reads recent Telegram channel/group messages into telegram_message records, watermarked by newest message id.",
		inputHint: "{ \"channel\": \"@durov\", \"limit\": 30 }",
		defaultRecordType: "telegram_message",
		toolEnabled: true,
		script: `const { input, cursor, credentials, clients, paginate } = ctx;
const channel = String(input.channel ?? '').trim();
if (!channel) throw new Error('telegram_fetch_messages requires input.channel');
const limit = clients.telegram.clampLimit(input.limit);
return paginate({
	mode: 'newest-id',
	fetchPage: () =>
		clients.telegram.fetchMessages({
			channel,
			limit,
			minId: cursor ? Number(cursor) : 0,
			apiId: credentials.apiId,
			apiHash: credentials.apiHash,
			session: credentials.session
		}),
	items: (list) => list,
	shape: { type: 'telegram_message', id: 'id', capturedAt: 'date', fields: ${fields([
			"chat",
			"chatUsername",
			"text",
			"date",
			"views",
			"forwards",
			"replies",
			"url"
		])} }
});`
	},
	{
		type: "viem_read_contract",
		label: "EVM read contract",
		provider: "viem",
		description: "Calls a single read-only contract function and stores the result as a contract_read record per block, preserving full history. Useful for polling TVL, prices, balances, or any view function over time.",
		inputHint: "{ \"address\": \"0x…\", \"abi\": \"function totalSupply() view returns (uint256)\", \"functionName\": \"totalSupply\", \"args\": [] }",
		defaultRecordType: "contract_read",
		toolEnabled: true,
		script: `const { input, config, clients, save } = ctx;
const address = String(input.address ?? '').trim();
const abiStr = String(input.abi ?? '').trim();
const functionName = String(input.functionName ?? '').trim();
if (!address) throw new Error('viem_read_contract requires input.address');
if (!abiStr) throw new Error('viem_read_contract requires input.abi');
if (!functionName) throw new Error('viem_read_contract requires input.functionName');

const client = clients.viem.publicClientFromUrl(config.rpcUrl);
const signature = /^\\s*(function|event|error)\\b/i.test(abiStr) ? abiStr : 'function ' + abiStr;
const abi = clients.viem.parseAbi([signature]);

const coerce = (a) => (typeof a === 'string' && /^\\d+$/.test(a) ? BigInt(a) : a);
const args = Array.isArray(input.args) ? input.args.map(coerce) : [];

const [result, blockNumber] = await Promise.all([
	client.readContract({ address, abi, functionName, args }),
	client.getBlockNumber()
]);

const serialize = (v) => typeof v === 'bigint' ? v.toString() : v;
const resultSerialized = Array.isArray(result) ? result.map(serialize) : serialize(result);

save(
	{ id: address + ':' + functionName + ':' + blockNumber.toString(), address, functionName, args: args.map(String), result: resultSerialized, blockNumber: blockNumber.toString() },
	{ type: 'contract_read', id: 'id', fields: ['address', 'functionName', 'args', 'result', 'blockNumber'] }
);
return {};`
	},
	{
		type: "viem_contract_events",
		label: "EVM contract events",
		provider: "viem",
		description: "Polls event logs from a specific contract and produces one contract_event record per decoded event, watermarked by block number.",
		inputHint: "{ \"address\": \"0x…\", \"abi\": \"event Deposit(address indexed user, uint256 amount)\", \"eventName\": \"Deposit\", \"lookbackBlocks\": 500 }",
		defaultRecordType: "contract_event",
		toolEnabled: true,
		script: `const { input, cursor, config, clients, save, lib } = ctx;
const address = String(input.address ?? '').trim();
const abiStr = String(input.abi ?? '').trim();
const eventName = String(input.eventName ?? '').trim();
if (!address) throw new Error('viem_contract_events requires input.address');
if (!abiStr) throw new Error('viem_contract_events requires input.abi (human-readable event signature)');

const client = clients.viem.publicClientFromUrl(config.rpcUrl);
const latest = await client.getBlockNumber();

// cursor = last block number processed. First run looks back input.lookbackBlocks
// (default 500) from the chain head. Catch up in capped chunks per run.
const MAX_RANGE = 2000n;
const from = clients.viem.resolveFromBlock(cursor, latest, input.lookbackBlocks);
if (from > latest) return { cursor };
const fromBlock = from;
const toBlock = fromBlock + MAX_RANGE < latest ? fromBlock + MAX_RANGE : latest;
const newCursor = toBlock.toString();

// parseAbiItem needs the leading 'event' keyword; accept signatures without it.
const signature = /^\\s*(event|function|error)\\b/i.test(abiStr) ? abiStr : 'event ' + abiStr;
let event;
try {
	event = clients.viem.parseAbiItem(signature);
} catch {
	throw new Error('viem_contract_events: invalid ABI string — ' + abiStr);
}

const logs = await client.getLogs({ address, event, fromBlock, toBlock });
if (!logs.length) return { cursor: newCursor };

const shape = { type: 'contract_event', id: 'id', fields: ${fields([
			"eventName",
			"address",
			"blockNumber",
			"txHash",
			"logIndex",
			"args"
		])} };
for (const log of logs) {
	let decoded;
	try {
		decoded = clients.viem.decodeEventLog({ abi: [event], data: log.data, topics: log.topics });
	} catch {
		decoded = null;
	}
	const args = decoded?.args
		? Object.fromEntries(Object.entries(decoded.args).map(([k, v]) => [k, typeof v === 'bigint' ? v.toString() : v]))
		: null;
	const record = {
		id: log.transactionHash + '-' + log.logIndex,
		eventName: decoded?.eventName ?? eventName,
		address: lib.address(address),
		blockNumber: log.blockNumber?.toString(),
		txHash: lib.txHash(log.transactionHash),
		logIndex: log.logIndex,
		args
	};
	if (save(record, shape) === false) break;
}
return { cursor: newCursor };`
	},
	{
		type: "viem_token_transfers",
		label: "EVM ERC-20 token transfers",
		provider: "viem",
		description: "Polls ERC-20 Transfer events for a token contract (optionally filtered to one wallet) into token_transfer records, watermarked by block number.",
		inputHint: "{ \"tokenAddress\": \"0x…\", \"lookbackBlocks\": 500 }",
		defaultRecordType: "token_transfer",
		toolEnabled: true,
		script: `const { input, cursor, config, clients, save, lib } = ctx;
const tokenAddress = String(input.tokenAddress ?? '').trim();
const watchAddress = String(input.watchAddress ?? '').trim() || null;
if (!tokenAddress) throw new Error('viem_token_transfers requires input.tokenAddress');

const client = clients.viem.publicClientFromUrl(config.rpcUrl);
const latest = await client.getBlockNumber();

const MAX_RANGE = 2000n;
const from = clients.viem.resolveFromBlock(cursor, latest, input.lookbackBlocks);
if (from > latest) return { cursor };
const fromBlock = from;
const toBlock = fromBlock + MAX_RANGE < latest ? fromBlock + MAX_RANGE : latest;
const newCursor = toBlock.toString();

const TRANSFER_EVENT = clients.viem.parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)');

// Fetch outgoing and incoming transfers in parallel when filtering by wallet;
// otherwise fetch all transfers for the token.
let logs;
if (watchAddress) {
	const [outgoing, incoming] = await Promise.all([
		client.getLogs({ address: tokenAddress, event: TRANSFER_EVENT, args: { from: watchAddress }, fromBlock, toBlock }),
		client.getLogs({ address: tokenAddress, event: TRANSFER_EVENT, args: { to: watchAddress }, fromBlock, toBlock })
	]);
	const seen = new Set();
	logs = [];
	for (const log of [...outgoing, ...incoming]) {
		const key = log.transactionHash + '-' + log.logIndex;
		if (!seen.has(key)) {
			seen.add(key);
			logs.push(log);
		}
	}
	logs.sort((a, b) => {
		const bDiff = (a.blockNumber ?? 0n) - (b.blockNumber ?? 0n);
		return bDiff !== 0n ? (bDiff < 0n ? -1 : 1) : (a.logIndex ?? 0) - (b.logIndex ?? 0);
	});
} else {
	logs = await client.getLogs({ address: tokenAddress, event: TRANSFER_EVENT, fromBlock, toBlock });
}
if (!logs.length) return { cursor: newCursor };

// Fetch token metadata once for the whole batch.
let symbol = '';
let decimals = 18;
try {
	[symbol, decimals] = await Promise.all([
		client.readContract({ address: tokenAddress, abi: clients.viem.ERC20_ABI, functionName: 'symbol' }),
		client.readContract({ address: tokenAddress, abi: clients.viem.ERC20_ABI, functionName: 'decimals' })
	]);
} catch {
	// non-standard token — fall back to raw values
}

const shape = { type: 'token_transfer', id: 'id', fields: ${fields([
			"tokenAddress",
			"symbol",
			"decimals",
			"from",
			"to",
			"valueRaw",
			"valueFormatted",
			"blockNumber",
			"txHash",
			"logIndex"
		])} };
for (const log of logs) {
	const value = log.args?.value ?? 0n;
	const record = {
		id: log.transactionHash + '-' + log.logIndex,
		tokenAddress: lib.address(tokenAddress),
		symbol,
		decimals,
		from: lib.address(log.args?.from ?? ''),
		to: lib.address(log.args?.to ?? ''),
		valueRaw: value.toString(),
		valueFormatted: clients.viem.formatUnits(value, decimals),
		blockNumber: log.blockNumber?.toString(),
		txHash: lib.txHash(log.transactionHash),
		logIndex: log.logIndex
	};
	if (save(record, shape) === false) break;
}
return { cursor: newCursor };`
	},
	{
		type: "viem_wallet_activity",
		label: "EVM wallet activity (ERC-20 transfers)",
		provider: "viem",
		description: "Tracks all ERC-20 transfers involving a wallet (as sender or receiver) across every token contract into evm_transfer records.",
		inputHint: "{ \"address\": \"0x…\", \"lookbackBlocks\": 500 }",
		defaultRecordType: "evm_transfer",
		toolEnabled: true,
		script: `const { input, cursor, config, clients, save, lib } = ctx;
const address = String(input.address ?? '').trim();
if (!address) throw new Error('viem_wallet_activity requires input.address');

const client = clients.viem.publicClientFromUrl(config.rpcUrl);
const latest = await client.getBlockNumber();

const MAX_RANGE = 1000n;
const from = clients.viem.resolveFromBlock(cursor, latest, input.lookbackBlocks);
if (from > latest) return { cursor };
const fromBlock = from;
const toBlock = fromBlock + MAX_RANGE < latest ? fromBlock + MAX_RANGE : latest;
const newCursor = toBlock.toString();

const TRANSFER_EVENT = clients.viem.parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)');

// Scan all contracts for transfers where this wallet is sender or receiver.
const [outgoing, incoming] = await Promise.all([
	client.getLogs({ event: TRANSFER_EVENT, args: { from: address }, fromBlock, toBlock }),
	client.getLogs({ event: TRANSFER_EVENT, args: { to: address }, fromBlock, toBlock })
]);

const seen = new Set();
const merged = [];
for (const log of [...outgoing, ...incoming]) {
	const key = log.transactionHash + '-' + log.logIndex;
	if (!seen.has(key)) {
		seen.add(key);
		merged.push(log);
	}
}
if (!merged.length) return { cursor: newCursor };

merged.sort((a, b) => {
	const bDiff = (a.blockNumber ?? 0n) - (b.blockNumber ?? 0n);
	return bDiff !== 0n ? (bDiff < 0n ? -1 : 1) : (a.logIndex ?? 0) - (b.logIndex ?? 0);
});

// Token metadata cache within a single run (the same token often appears in
// many transfers).
const tokenCache = new Map();
async function getTokenMeta(tokenAddress) {
	if (tokenCache.has(tokenAddress)) return tokenCache.get(tokenAddress);
	let meta = { symbol: '', decimals: 18 };
	try {
		const [symbol, decimals] = await Promise.all([
			client.readContract({ address: tokenAddress, abi: clients.viem.ERC20_ABI, functionName: 'symbol' }),
			client.readContract({ address: tokenAddress, abi: clients.viem.ERC20_ABI, functionName: 'decimals' })
		]);
		meta = { symbol, decimals };
	} catch {
		// non-standard token — use defaults
	}
	tokenCache.set(tokenAddress, meta);
	return meta;
}

const shape = { type: 'evm_transfer', id: 'id', fields: ${fields([
			"walletAddress",
			"direction",
			"tokenAddress",
			"symbol",
			"decimals",
			"from",
			"to",
			"valueRaw",
			"valueFormatted",
			"blockNumber",
			"txHash",
			"logIndex"
		])} };
for (const log of merged) {
	const { symbol, decimals } = await getTokenMeta(log.address);
	const fromAddr = log.args?.from ?? '';
	const value = log.args?.value ?? 0n;
	const record = {
		id: log.transactionHash + '-' + log.logIndex,
		walletAddress: lib.address(address),
		direction: fromAddr.toLowerCase() === address.toLowerCase() ? 'OUT' : 'IN',
		tokenAddress: lib.address(log.address),
		symbol,
		decimals,
		from: lib.address(fromAddr),
		to: lib.address(log.args?.to ?? ''),
		valueRaw: value.toString(),
		valueFormatted: clients.viem.formatUnits(value, decimals),
		blockNumber: log.blockNumber?.toString(),
		txHash: lib.txHash(log.transactionHash),
		logIndex: log.logIndex
	};
	if (save(record, shape) === false) break;
}
return { cursor: newCursor };`
	},
	{
		type: "viem_balance",
		label: "EVM native balance",
		provider: "viem",
		description: "Read the native coin balance of any EVM address. Returns a chain_balance record with wei and ETH-unit values.",
		inputHint: "{ \"address\": \"0x…\" }",
		defaultRecordType: "chain_balance",
		toolEnabled: true,
		script: `const { input, config, clients, save, mode } = ctx;
const address = String(input.address ?? '').trim();
if (!address) throw new Error('viem_balance requires input.address');
const client = clients.viem.publicClientFromUrl(config.rpcUrl);
const bal = await client.getBalance({ address });
const balWei = bal.toString();
const balEth = clients.viem.formatEther(bal);
if (mode === 'fetch') {
	return { data: { address, balanceWei: balWei, balanceEth: balEth }, result: 'Native balance of ' + address + ':\\n' + balEth + ' (' + balWei + ' wei)' };
}
save(
	{ id: address, address, balanceWei: balWei, balanceEth: balEth },
	{ type: 'chain_balance', id: 'id', fields: ['address', 'balanceWei', 'balanceEth'] }
);
return {};`
	},
	{
		type: "viem_token_info",
		label: "EVM ERC-20 token info",
		provider: "viem",
		description: "Read ERC-20 metadata (name, symbol, decimals, total supply) for a token contract. Returns a token_info record.",
		inputHint: "{ \"tokenAddress\": \"0x…\" }",
		defaultRecordType: "token_info",
		toolEnabled: true,
		script: `const { input, config, clients, save, mode } = ctx;
const tokenAddress = String(input.tokenAddress ?? '').trim();
if (!tokenAddress) throw new Error('viem_token_info requires input.tokenAddress');
const client = clients.viem.publicClientFromUrl(config.rpcUrl);
const [name, symbol, decimals, totalSupply] = await Promise.all([
	client.readContract({ address: tokenAddress, abi: clients.viem.ERC20_ABI, functionName: 'name' }),
	client.readContract({ address: tokenAddress, abi: clients.viem.ERC20_ABI, functionName: 'symbol' }),
	client.readContract({ address: tokenAddress, abi: clients.viem.ERC20_ABI, functionName: 'decimals' }),
	client.readContract({ address: tokenAddress, abi: clients.viem.ERC20_ABI, functionName: 'totalSupply' })
]);
const totalSupplyRaw = totalSupply.toString();
const totalSupplyFormatted = clients.viem.formatUnits(totalSupply, decimals);
if (mode === 'fetch') {
	return {
		data: { tokenAddress, name, symbol, decimals, totalSupplyRaw, totalSupplyFormatted },
		result: 'Token: ' + name + ' (' + symbol + ')\\nAddress: ' + tokenAddress + '\\nDecimals: ' + decimals + '\\nTotal supply: ' + totalSupplyFormatted + ' ' + symbol
	};
}
save(
	{ id: tokenAddress, tokenAddress, name, symbol, decimals, totalSupplyRaw, totalSupplyFormatted },
	{ type: 'token_info', id: 'id', fields: ['tokenAddress', 'name', 'symbol', 'decimals', 'totalSupplyRaw', 'totalSupplyFormatted'] }
);
return {};`
	},
	{
		type: "viem_token_balance",
		label: "EVM ERC-20 token balance",
		provider: "viem",
		description: "Read the ERC-20 token balance of a wallet address. Returns a token_balance record with raw and formatted amounts.",
		inputHint: "{ \"tokenAddress\": \"0x…\", \"address\": \"0x…\" }",
		defaultRecordType: "token_balance",
		toolEnabled: true,
		script: `const { input, config, clients, save, mode } = ctx;
const tokenAddress = String(input.tokenAddress ?? '').trim();
const address = String(input.address ?? '').trim();
if (!tokenAddress) throw new Error('viem_token_balance requires input.tokenAddress');
if (!address) throw new Error('viem_token_balance requires input.address');
const client = clients.viem.publicClientFromUrl(config.rpcUrl);
const [balance, symbol, decimals] = await Promise.all([
	client.readContract({ address: tokenAddress, abi: clients.viem.ERC20_ABI, functionName: 'balanceOf', args: [address] }),
	client.readContract({ address: tokenAddress, abi: clients.viem.ERC20_ABI, functionName: 'symbol' }),
	client.readContract({ address: tokenAddress, abi: clients.viem.ERC20_ABI, functionName: 'decimals' })
]);
const balanceRaw = balance.toString();
const balanceFormatted = clients.viem.formatUnits(balance, decimals);
if (mode === 'fetch') {
	return {
		data: { address, tokenAddress, symbol, decimals, balanceRaw, balanceFormatted },
		result: address + ': ' + balanceFormatted + ' ' + symbol + ' (' + balanceRaw + ' base units)'
	};
}
save(
	{ id: address + ':' + tokenAddress, address, tokenAddress, symbol, decimals, balanceRaw, balanceFormatted },
	{ type: 'token_balance', id: 'id', fields: ['address', 'tokenAddress', 'symbol', 'decimals', 'balanceRaw', 'balanceFormatted'] }
);
return {};`
	},
	{
		type: "viem_transaction",
		label: "EVM transaction details",
		provider: "viem",
		description: "Fetch a transaction and its receipt by hash: block, from/to, value, gas, status, and log count. Returns a chain_transaction record.",
		inputHint: "{ \"hash\": \"0x…\" }",
		defaultRecordType: "chain_transaction",
		toolEnabled: true,
		script: `const { input, config, clients, save, mode } = ctx;
const hash = String(input.hash ?? '').trim();
if (!hash) throw new Error('viem_transaction requires input.hash');
const client = clients.viem.publicClientFromUrl(config.rpcUrl);
const [tx, receipt] = await Promise.all([
	client.getTransaction({ hash }),
	client.getTransactionReceipt({ hash }).catch(() => null)
]);
const record = {
	id: hash,
	hash,
	blockNumber: tx.blockNumber?.toString() ?? null,
	from: tx.from,
	to: tx.to ?? null,
	valueWei: (tx.value ?? 0n).toString(),
	valueEth: clients.viem.formatEther(tx.value ?? 0n),
	status: receipt?.status ?? null,
	gasUsed: receipt?.gasUsed?.toString() ?? null,
	logCount: receipt?.logs?.length ?? 0
};
if (mode === 'fetch') {
	const lines = ['Tx ' + hash, 'Block:    ' + (record.blockNumber ?? 'pending'), 'From:     ' + record.from, 'To:       ' + (record.to ?? '(contract creation)'), 'Value:    ' + record.valueEth + ' native'];
	if (tx.gasPrice) lines.push('Gas price: ' + clients.viem.formatUnits(tx.gasPrice, 9) + ' gwei');
	if (receipt) {
		lines.push('Status:   ' + (receipt.status === 'success' ? 'success ✓' : 'reverted ✗'));
		lines.push('Gas used: ' + record.gasUsed);
		if (record.logCount) lines.push('Logs:     ' + record.logCount);
	}
	return { data: record, result: lines.join('\\n') };
}
save(record, { type: 'chain_transaction', id: 'id', fields: ['hash', 'blockNumber', 'from', 'to', 'valueWei', 'valueEth', 'status', 'gasUsed', 'logCount'] });
return {};`
	},
	{
		type: "viem_logs",
		label: "EVM event logs",
		provider: "viem",
		description: "Query decoded event logs from a contract over a block range. In fetch mode: one-shot query; in collect mode: watermarked scan storing chain_log records.",
		inputHint: "{ \"address\": \"0x…\", \"event\": \"event Transfer(address indexed from, address indexed to, uint256 value)\", \"fromBlock\": 12000000, \"toBlock\": 12001000 }",
		defaultRecordType: "chain_log",
		toolEnabled: true,
		script: `const { input, cursor, config, clients, save, mode } = ctx;
const contractAddress = String(input.address ?? '').trim() || undefined;
const eventStr = String(input.event ?? '').trim();
const client = clients.viem.publicClientFromUrl(config.rpcUrl);
const latest = await client.getBlockNumber();

function parseEventAbi(str) {
	if (!str) return undefined;
	const sig = /^\\s*(event|function|error)\\b/i.test(str) ? str : 'event ' + str;
	try { return clients.viem.parseAbiItem(sig); } catch { return undefined; }
}

if (mode === 'fetch') {
	const fromBlock = input.fromBlock != null ? BigInt(input.fromBlock) : (latest > 500n ? latest - 500n : 0n);
	const toBlock = input.toBlock != null ? BigInt(input.toBlock) : latest;
	const eventAbi = parseEventAbi(eventStr);
	const params = { fromBlock, toBlock };
	if (contractAddress) params.address = contractAddress;
	if (eventAbi) params.event = eventAbi;
	const logs = await client.getLogs(params);
	if (!logs.length) return { result: 'No logs found between blocks ' + fromBlock + '–' + toBlock + '.' };
	const shown = logs.slice(0, 25);
	const lines = shown.map(log => {
		const prefix = 'block ' + log.blockNumber + ' ' + String(log.transactionHash ?? '').slice(0, 10) + '… #' + log.logIndex;
		if (eventAbi && log.topics.length) {
			try {
				const decoded = clients.viem.decodeEventLog({ abi: [eventAbi], data: log.data, topics: log.topics });
				const args = Object.entries(decoded.args ?? {}).map(([k, v]) => k + '=' + (typeof v === 'bigint' ? v.toString() : v)).join(', ');
				return prefix + '  ' + decoded.eventName + '(' + args + ')';
			} catch {}
		}
		return prefix + '  topics: ' + log.topics.slice(0, 3).join(', ');
	});
	const header = logs.length + ' log' + (logs.length === 1 ? '' : 's') + ' (blocks ' + fromBlock + '–' + toBlock + (logs.length > 25 ? ', showing first 25' : '') + '):';
	return { result: [header, ...lines].join('\\n') };
}

const MAX_RANGE = 2000n;
const from = clients.viem.resolveFromBlock(cursor, latest, input.lookbackBlocks);
if (from > latest) return { cursor };
const fromBlock = from;
const toBlock = fromBlock + MAX_RANGE < latest ? fromBlock + MAX_RANGE : latest;
const newCursor = toBlock.toString();
const eventAbi = parseEventAbi(eventStr);
const params = { fromBlock, toBlock };
if (contractAddress) params.address = contractAddress;
if (eventAbi) params.event = eventAbi;
const logs = await client.getLogs(params);
if (!logs.length) return { cursor: newCursor };
const shape = { type: 'chain_log', id: 'id', fields: ['address', 'eventName', 'blockNumber', 'txHash', 'logIndex', 'args'] };
for (const log of logs) {
	let decoded = null;
	if (eventAbi) try { decoded = clients.viem.decodeEventLog({ abi: [eventAbi], data: log.data, topics: log.topics }); } catch {}
	const args = decoded?.args ? Object.fromEntries(Object.entries(decoded.args).map(([k, v]) => [k, typeof v === 'bigint' ? v.toString() : v])) : null;
	const record = {
		id: log.transactionHash + '-' + log.logIndex,
		address: String(log.address ?? ''),
		eventName: decoded?.eventName ?? eventStr || null,
		blockNumber: log.blockNumber?.toString(),
		txHash: String(log.transactionHash ?? ''),
		logIndex: log.logIndex,
		args
	};
	if (save(record, shape) === false) break;
}
return { cursor: newCursor };`
	},
	{
		type: "twitterapi_user_info",
		label: "X/Twitter user info",
		provider: "twitterapi",
		description: "Look up a public X/Twitter profile by handle: bio, follower count, tweet count, and verification status. Returns a twitter_user record.",
		inputHint: "{ \"userName\": \"elonmusk\" }",
		defaultRecordType: "twitter_user",
		toolEnabled: true,
		script: `const { input, credentials, clients, save, mode } = ctx;
const userName = String(input.userName ?? '').trim().replace(/^@/, '');
if (!userName) throw new Error('twitterapi_user_info requires input.userName');
const user = await clients.twitterapi.twitterUserInfo(userName, { apiKey: credentials.apiKey });
if (mode === 'fetch') {
	return { data: user, result: clients.twitterapi.formatUser(user) };
}
save(user, { type: 'twitter_user', id: 'id', fields: ${fields(USER_FIELDS)} });
return {};`
	},
	{
		type: "twitterapi_tweet_by_ids",
		label: "X/Twitter tweets by id",
		provider: "twitterapi",
		description: "Hydrate up to 20 tweets by id — full text, author, metrics, and timestamps. Returns tweet records.",
		inputHint: "{ \"ids\": [\"1234567890123456789\"] }",
		defaultRecordType: "tweet",
		toolEnabled: true,
		script: `const { input, credentials, clients, save, mode } = ctx;
const ids = (Array.isArray(input.ids) ? input.ids : [input.ids]).map(v => String(v ?? '').trim()).filter(Boolean).slice(0, 20);
if (!ids.length) throw new Error('twitterapi_tweet_by_ids requires input.ids');
const r = await clients.twitterapi.twitterTweetsByIds(ids, { apiKey: credentials.apiKey });
if (mode === 'fetch') {
	return { data: r.tweets, result: clients.twitterapi.formatTweets(r.tweets, { empty: 'No tweets found for those ids.' }) };
}
const shape = { type: 'tweet', id: 'id', capturedAt: 'createdAt', fields: ${fields(TWEET_FIELDS)} };
for (const t of r.tweets) if (save(t, shape) === false) break;
return {};`
	},
	{
		type: "twitterapi_trends",
		label: "X/Twitter trends",
		provider: "twitterapi",
		description: "Fetch trending topics for a given location (WOEID). 1 = worldwide. Returns trend records with name and tweet volume.",
		inputHint: "{ \"woeid\": 1 }",
		defaultRecordType: "trend",
		toolEnabled: true,
		script: `const { input, credentials, clients, save, mode } = ctx;
const woeid = Number.isFinite(Number(input.woeid)) ? Number(input.woeid) : 1;
const { trends } = await clients.twitterapi.twitterTrends({ woeid, apiKey: credentials.apiKey });
if (!trends.length) {
	if (mode === 'fetch') return { result: 'No trends available.' };
	return {};
}
if (mode === 'fetch') {
	const lines = ['Trends (woeid=' + woeid + '):', ...trends.map(t => '- ' + t.name + (t.volume ? ' (' + t.volume.toLocaleString() + ')' : ''))];
	return { data: trends, result: lines.join('\\n') };
}
const shape = { type: 'trend', id: 'id', fields: ['name', 'volume', 'woeid'] };
for (const t of trends) {
	if (save({ id: woeid + '_' + t.name, name: t.name, volume: t.volume ?? 0, woeid }, shape) === false) break;
}
return {};`
	}
];
//#endregion
//#region src/lib/server/db/migrate.js
function migrate(db) {
	db.exec(`
		CREATE TABLE IF NOT EXISTS app_settings (
			key        TEXT PRIMARY KEY,
			value      TEXT NOT NULL,
			updated_at TEXT NOT NULL DEFAULT (datetime('now'))
		);

		CREATE TABLE IF NOT EXISTS humans (
			id               INTEGER PRIMARY KEY AUTOINCREMENT,
			username         TEXT NOT NULL,
			tg_username      TEXT NOT NULL DEFAULT '',
			twitter_username TEXT NOT NULL DEFAULT '',
			phone            TEXT NOT NULL DEFAULT '',
			email            TEXT NOT NULL DEFAULT '',
			evm_address      TEXT NOT NULL DEFAULT '',
			created_at       TEXT NOT NULL DEFAULT (datetime('now')),
			updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
		);

		CREATE TABLE IF NOT EXISTS projects (
			id          INTEGER PRIMARY KEY AUTOINCREMENT,
			name        TEXT NOT NULL,
			description TEXT NOT NULL DEFAULT '',
			status      TEXT NOT NULL DEFAULT 'active',
			color       TEXT NOT NULL DEFAULT 'slate',
			paid        INTEGER NOT NULL DEFAULT 0,
			human_id    INTEGER REFERENCES humans(id) ON DELETE SET NULL,
			created_at  TEXT NOT NULL DEFAULT (datetime('now')),
			updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
		);

		CREATE TABLE IF NOT EXISTS tasks (
			id                  INTEGER PRIMARY KEY AUTOINCREMENT,
			title               TEXT NOT NULL,
			description         TEXT NOT NULL DEFAULT '',
			status              TEXT NOT NULL DEFAULT 'todo',
			priority            TEXT NOT NULL DEFAULT 'medium',
			due_date            TEXT,
			project_id          INTEGER REFERENCES projects(id) ON DELETE SET NULL,
			recurrence          TEXT NOT NULL DEFAULT 'none',
			recurrence_days     TEXT NOT NULL DEFAULT '',
			recurrence_interval INTEGER NOT NULL DEFAULT 1,
			created_at          TEXT NOT NULL DEFAULT (datetime('now')),
			updated_at          TEXT NOT NULL DEFAULT (datetime('now')),
			completed_at        TEXT
		);

		CREATE TABLE IF NOT EXISTS task_completions (
			id           INTEGER PRIMARY KEY AUTOINCREMENT,
			task_id      INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
			date         TEXT NOT NULL,
			completed_at TEXT NOT NULL DEFAULT (datetime('now')),
			UNIQUE (task_id, date)
		);

		CREATE TABLE IF NOT EXISTS notes (
			id         INTEGER PRIMARY KEY AUTOINCREMENT,
			title      TEXT NOT NULL,
			content    TEXT NOT NULL DEFAULT '',
			pinned     INTEGER NOT NULL DEFAULT 0,
			tags       TEXT NOT NULL DEFAULT '[]',
			task_id    INTEGER REFERENCES tasks(id) ON DELETE SET NULL,
			created_at TEXT NOT NULL DEFAULT (datetime('now')),
			updated_at TEXT NOT NULL DEFAULT (datetime('now'))
		);

		CREATE TABLE IF NOT EXISTS goals (
			id          INTEGER PRIMARY KEY AUTOINCREMENT,
			title       TEXT NOT NULL,
			description TEXT NOT NULL DEFAULT '',
			achieved    INTEGER NOT NULL DEFAULT 0,
			achieved_at TEXT,
			created_at  TEXT NOT NULL DEFAULT (datetime('now')),
			updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
		);

		CREATE TABLE IF NOT EXISTS events (
			id          INTEGER PRIMARY KEY AUTOINCREMENT,
			title       TEXT NOT NULL,
			description TEXT NOT NULL DEFAULT '',
			category    TEXT NOT NULL DEFAULT 'personal',
			start_time  TEXT NOT NULL,
			end_time    TEXT,
			created_at  TEXT NOT NULL DEFAULT (datetime('now')),
			updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
		);

		-- Agents are first-class citizens: persistent AI personas with identity,
		-- memory, playbooks, tasks, and observations.
		CREATE TABLE IF NOT EXISTS agents (
			id                  INTEGER PRIMARY KEY AUTOINCREMENT,
			name                TEXT NOT NULL,
			title               TEXT NOT NULL DEFAULT '',
			description         TEXT NOT NULL DEFAULT '',
			avatar              TEXT NOT NULL DEFAULT '',
			status              TEXT NOT NULL DEFAULT 'active',
			persona             TEXT NOT NULL DEFAULT '',
			beliefs             TEXT NOT NULL DEFAULT '',
			communication_style TEXT NOT NULL DEFAULT '',
			decision_style      TEXT NOT NULL DEFAULT '',
			motivations         TEXT NOT NULL DEFAULT '',
			background          TEXT NOT NULL DEFAULT '',
			experience          TEXT NOT NULL DEFAULT '',
			specialization      TEXT NOT NULL DEFAULT '',
			skills              TEXT NOT NULL DEFAULT '[]',
			strengths           TEXT NOT NULL DEFAULT '[]',
			tools               TEXT NOT NULL DEFAULT '[]',
			created_at          TEXT NOT NULL DEFAULT (datetime('now')),
			updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
		);

		CREATE TABLE IF NOT EXISTS agent_memories (
			id          INTEGER PRIMARY KEY AUTOINCREMENT,
			agent_id    INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
			memory_type TEXT NOT NULL DEFAULT 'note',
			content     TEXT NOT NULL DEFAULT '',
			importance  INTEGER NOT NULL DEFAULT 1,
			created_at  TEXT NOT NULL DEFAULT (datetime('now'))
		);

		CREATE TABLE IF NOT EXISTS playbooks (
			id           INTEGER PRIMARY KEY AUTOINCREMENT,
			agent_id     INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
			name         TEXT NOT NULL,
			description  TEXT NOT NULL DEFAULT '',
			steps_json   TEXT NOT NULL DEFAULT '[]',
			trigger_tags TEXT NOT NULL DEFAULT '[]',
			created_at   TEXT NOT NULL DEFAULT (datetime('now'))
		);

		CREATE TABLE IF NOT EXISTS agent_tasks (
			id          INTEGER PRIMARY KEY AUTOINCREMENT,
			agent_id    INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
			title       TEXT NOT NULL,
			description TEXT NOT NULL DEFAULT '',
			status      TEXT NOT NULL DEFAULT 'todo',
			priority    TEXT NOT NULL DEFAULT 'medium',
			project_id  INTEGER REFERENCES projects(id) ON DELETE SET NULL,
			created_at  TEXT NOT NULL DEFAULT (datetime('now')),
			updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
		);

		CREATE TABLE IF NOT EXISTS agent_observations (
			id         INTEGER PRIMARY KEY AUTOINCREMENT,
			agent_id   INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
			content    TEXT NOT NULL DEFAULT '',
			confidence REAL NOT NULL DEFAULT 0.5,
			tags       TEXT NOT NULL DEFAULT '[]',
			created_at TEXT NOT NULL DEFAULT (datetime('now'))
		);

		CREATE TABLE IF NOT EXISTS agent_actions (
			id          INTEGER PRIMARY KEY AUTOINCREMENT,
			agent_id    INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
			dispatch_id TEXT NOT NULL DEFAULT '',
			tool        TEXT NOT NULL,
			summary     TEXT NOT NULL DEFAULT '',
			input       TEXT NOT NULL DEFAULT '{}',
			status      TEXT NOT NULL DEFAULT 'executed',
			error       TEXT NOT NULL DEFAULT '',
			created_at  TEXT NOT NULL DEFAULT (datetime('now'))
		);

		CREATE TABLE IF NOT EXISTS agent_dispatches (
			id          INTEGER PRIMARY KEY AUTOINCREMENT,
			agent_id    INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
			dispatch_id TEXT NOT NULL DEFAULT '',
			objective   TEXT NOT NULL DEFAULT '',
			summary     TEXT NOT NULL DEFAULT '',
			reads       TEXT NOT NULL DEFAULT '[]',
			staged      TEXT NOT NULL DEFAULT '[]',
			steps       INTEGER NOT NULL DEFAULT 0,
			truncated   INTEGER NOT NULL DEFAULT 0,
			error       TEXT NOT NULL DEFAULT '',
			created_at  TEXT NOT NULL DEFAULT (datetime('now'))
		);

		CREATE INDEX IF NOT EXISTS idx_tasks_due ON tasks(due_date);
		CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
		CREATE INDEX IF NOT EXISTS idx_events_start ON events(start_time);
		CREATE INDEX IF NOT EXISTS idx_task_completions_task ON task_completions(task_id);
		CREATE INDEX IF NOT EXISTS idx_agent_memories_agent ON agent_memories(agent_id);
		CREATE INDEX IF NOT EXISTS idx_playbooks_agent ON playbooks(agent_id);
		CREATE INDEX IF NOT EXISTS idx_agent_tasks_agent ON agent_tasks(agent_id);
		CREATE INDEX IF NOT EXISTS idx_agent_observations_agent ON agent_observations(agent_id);
		CREATE INDEX IF NOT EXISTS idx_agent_actions_agent ON agent_actions(agent_id);
		CREATE INDEX IF NOT EXISTS idx_agent_actions_dispatch ON agent_actions(dispatch_id);
		CREATE INDEX IF NOT EXISTS idx_agent_dispatches_agent ON agent_dispatches(agent_id);
	`);
	ensureColumn(db, "app_settings", "group_name", "TEXT NOT NULL DEFAULT ''");
	ensureColumn(db, "projects", "paid", "INTEGER NOT NULL DEFAULT 0");
	ensureColumn(db, "projects", "human_id", "INTEGER REFERENCES humans(id) ON DELETE SET NULL");
	ensureColumn(db, "tasks", "recurrence", "TEXT NOT NULL DEFAULT 'none'");
	ensureColumn(db, "tasks", "recurrence_days", "TEXT NOT NULL DEFAULT ''");
	ensureColumn(db, "tasks", "recurrence_interval", "INTEGER NOT NULL DEFAULT 1");
	ensureColumn(db, "tasks", "assigned_human_id", "INTEGER REFERENCES humans(id) ON DELETE SET NULL");
	ensureColumn(db, "tasks", "assigned_agent_id", "INTEGER REFERENCES agents(id) ON DELETE SET NULL");
	ensureColumn(db, "humans", "notes", "TEXT NOT NULL DEFAULT ''");
	ensureColumn(db, "notes", "task_id", "INTEGER REFERENCES tasks(id) ON DELETE SET NULL");
	db.exec("CREATE INDEX IF NOT EXISTS idx_notes_task ON notes(task_id)");
	ensureColumn(db, "notes", "tags", "TEXT NOT NULL DEFAULT '[]'");
	ensureColumn(db, "notes", "project_id", "INTEGER REFERENCES projects(id) ON DELETE SET NULL");
	db.exec("CREATE INDEX IF NOT EXISTS idx_notes_project ON notes(project_id)");
	ensureColumn(db, "agent_dispatches", "task_id", "INTEGER REFERENCES agent_tasks(id) ON DELETE SET NULL");
	db.exec("CREATE INDEX IF NOT EXISTS idx_agent_dispatches_task ON agent_dispatches(task_id)");
	ensureColumn(db, "agent_dispatches", "denied", "INTEGER NOT NULL DEFAULT 0");
	ensureColumn(db, "agent_tasks", "last_dispatched_at", "TEXT");
	ensureColumn(db, "agent_tasks", "created_by_agent_id", "INTEGER REFERENCES agents(id) ON DELETE SET NULL");
	ensureColumn(db, "agent_observations", "reflected", "INTEGER NOT NULL DEFAULT 0");
	ensureColumn(db, "agent_dispatches", "input_tokens", "INTEGER NOT NULL DEFAULT 0");
	ensureColumn(db, "agent_dispatches", "output_tokens", "INTEGER NOT NULL DEFAULT 0");
	ensureColumn(db, "agent_dispatches", "cost_usd", "REAL NOT NULL DEFAULT 0");
	db.exec(`
		CREATE TABLE IF NOT EXISTS agent_orchestrations (
			id          INTEGER PRIMARY KEY AUTOINCREMENT,
			goal        TEXT NOT NULL,
			plan        TEXT NOT NULL DEFAULT '[]',
			steps       TEXT NOT NULL DEFAULT '[]',
			status      TEXT NOT NULL DEFAULT 'planned',
			created_at  TEXT NOT NULL DEFAULT (datetime('now'))
		);
	`);
	db.exec(`
		CREATE TABLE IF NOT EXISTS deliverables (
			id                 INTEGER PRIMARY KEY AUTOINCREMENT,
			title              TEXT NOT NULL,
			body               TEXT NOT NULL DEFAULT '',
			type               TEXT NOT NULL DEFAULT 'note',
			status             TEXT NOT NULL DEFAULT 'draft',
			agent_id           INTEGER REFERENCES agents(id) ON DELETE SET NULL,
			project_id         INTEGER REFERENCES projects(id) ON DELETE SET NULL,
			source_dispatch_id TEXT NOT NULL DEFAULT '',
			tags               TEXT NOT NULL DEFAULT '[]',
			exported_at        TEXT,
			created_at         TEXT NOT NULL DEFAULT (datetime('now')),
			updated_at         TEXT NOT NULL DEFAULT (datetime('now'))
		);
		CREATE INDEX IF NOT EXISTS idx_deliverables_agent ON deliverables(agent_id);
		CREATE INDEX IF NOT EXISTS idx_deliverables_project ON deliverables(project_id);
	`);
	db.exec(`UPDATE deliverables SET type = 'report' WHERE type = 'recollection'`);
	db.exec(`UPDATE OR IGNORE app_settings SET key = 'RECORDS_KEEP_RAW' WHERE key = 'SHARDS_KEEP_RAW' AND NOT EXISTS (SELECT 1 FROM app_settings WHERE key = 'RECORDS_KEEP_RAW')`);
	db.exec(`DELETE FROM app_settings WHERE key = 'SHARDS_KEEP_RAW'`);
	db.exec(`
		CREATE TABLE IF NOT EXISTS activity_log (
			id         INTEGER PRIMARY KEY AUTOINCREMENT,
			event      TEXT NOT NULL,
			fields     TEXT NOT NULL DEFAULT '{}',
			created_at TEXT NOT NULL DEFAULT (datetime('now'))
		);
		CREATE INDEX IF NOT EXISTS idx_activity_log_event ON activity_log(event);
	`);
	db.exec("DROP INDEX IF EXISTS idx_research_adapters_source");
	db.exec("DROP INDEX IF EXISTS idx_research_adapters_due");
	db.exec("DROP INDEX IF EXISTS idx_research_collectors_source");
	db.exec("DROP INDEX IF EXISTS idx_shards_source");
	renameTableIfExists(db, "research_adapters", "research_collectors");
	renameTableIfExists(db, "research_sources", "research_instances");
	renameTableIfExists(db, "research_reports", "reports");
	renameColumnIfExists(db, "shards", "adapter_id", "collector_id");
	renameColumnIfExists(db, "research_collectors", "source_id", "instance_id");
	renameColumnIfExists(db, "shards", "source_id", "instance_id");
	db.exec("DROP INDEX IF EXISTS idx_shards_instance");
	db.exec("DROP INDEX IF EXISTS idx_shards_type");
	db.exec("DROP INDEX IF EXISTS idx_shards_captured");
	db.exec("DROP INDEX IF EXISTS idx_shards_external");
	renameTableIfExists(db, "shards", "records");
	renameColumnIfExists(db, "records", "shard_type", "record_type");
	db.exec(`
		CREATE TABLE IF NOT EXISTS research_instances (
			id               INTEGER PRIMARY KEY AUTOINCREMENT,
			name             TEXT NOT NULL,
			type             TEXT NOT NULL,
			config_json      TEXT NOT NULL DEFAULT '{}',
			credentials_json TEXT NOT NULL DEFAULT '{}',
			status           TEXT NOT NULL DEFAULT 'active',
			last_checked_at  TEXT,
			created_at       TEXT NOT NULL DEFAULT (datetime('now')),
			updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
		);

		CREATE TABLE IF NOT EXISTS research_collectors (
			id               INTEGER PRIMARY KEY AUTOINCREMENT,
			instance_id      INTEGER NOT NULL REFERENCES research_instances(id) ON DELETE CASCADE,
			name             TEXT NOT NULL,
			type             TEXT NOT NULL,
			input_json       TEXT NOT NULL DEFAULT '{}',
			schedule_minutes INTEGER,
			cursor           TEXT,
			enabled          INTEGER NOT NULL DEFAULT 1,
			notify           INTEGER NOT NULL DEFAULT 0,
			status           TEXT NOT NULL DEFAULT 'idle',
			last_run_at      TEXT,
			last_error       TEXT,
			agent_id         INTEGER REFERENCES agents(id) ON DELETE SET NULL,
			created_at       TEXT NOT NULL DEFAULT (datetime('now')),
			updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
		);
		CREATE INDEX IF NOT EXISTS idx_research_collectors_instance ON research_collectors(instance_id);
		CREATE INDEX IF NOT EXISTS idx_research_collectors_due ON research_collectors(enabled, last_run_at);

		CREATE TABLE IF NOT EXISTS records (
			id            INTEGER PRIMARY KEY AUTOINCREMENT,
			instance_id   INTEGER NOT NULL REFERENCES research_instances(id) ON DELETE CASCADE,
			collector_id  INTEGER REFERENCES research_collectors(id) ON DELETE SET NULL,
			external_id   TEXT,
			record_type   TEXT NOT NULL,
			metadata_json TEXT NOT NULL DEFAULT '{}',
			raw_json      TEXT,
			captured_at   TEXT,
			created_at    TEXT NOT NULL DEFAULT (datetime('now')),
			UNIQUE(collector_id, external_id)
		);
		CREATE INDEX IF NOT EXISTS idx_records_instance ON records(instance_id);
		CREATE INDEX IF NOT EXISTS idx_records_type ON records(record_type);
		CREATE INDEX IF NOT EXISTS idx_records_captured ON records(captured_at DESC);
		CREATE INDEX IF NOT EXISTS idx_records_external ON records(external_id);

		CREATE TABLE IF NOT EXISTS reports (
			id             INTEGER PRIMARY KEY AUTOINCREMENT,
			name           TEXT NOT NULL,
			description    TEXT NOT NULL DEFAULT '',
			filter_json    TEXT NOT NULL DEFAULT '{}',
			pinned         INTEGER NOT NULL DEFAULT 0,
			deliverable_id INTEGER REFERENCES deliverables(id) ON DELETE SET NULL,
			created_at     TEXT NOT NULL DEFAULT (datetime('now')),
			updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
		);
	`);
	ensureColumn(db, "research_instances", "credentials_json", "TEXT NOT NULL DEFAULT '{}'");
	db.exec(`
		CREATE TABLE IF NOT EXISTS transformers (
			id               INTEGER PRIMARY KEY AUTOINCREMENT,
			name             TEXT NOT NULL,
			description      TEXT NOT NULL DEFAULT '',
			record_type      TEXT NOT NULL,
			fields_json      TEXT NOT NULL DEFAULT '[]',
			key_field        TEXT NOT NULL DEFAULT 'id',
			filter_json      TEXT NOT NULL DEFAULT '{}',
			script           TEXT NOT NULL DEFAULT '',
			schedule_minutes INTEGER,
			cursor           TEXT,
			enabled          INTEGER NOT NULL DEFAULT 1,
			status           TEXT NOT NULL DEFAULT 'idle',
			last_run_at      TEXT,
			last_error       TEXT,
			created_at       TEXT NOT NULL DEFAULT (datetime('now')),
			updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
		);
	`);
	ensureColumn(db, "records", "transformer_id", "INTEGER REFERENCES transformers(id) ON DELETE SET NULL");
	db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_records_transformer_external
		 ON records(transformer_id, external_id) WHERE transformer_id IS NOT NULL`);
	db.exec(`
		CREATE TABLE IF NOT EXISTS adapters (
			id                  INTEGER PRIMARY KEY AUTOINCREMENT,
			type                TEXT NOT NULL UNIQUE,
			label               TEXT NOT NULL,
			provider            TEXT NOT NULL DEFAULT '',
			description         TEXT NOT NULL DEFAULT '',
			input_hint          TEXT NOT NULL DEFAULT '',
			default_record_type TEXT NOT NULL DEFAULT 'item',
			script              TEXT NOT NULL DEFAULT '',
			created_at          TEXT NOT NULL DEFAULT (datetime('now')),
			updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
		);
	`);
	ensureColumn(db, "adapters", "tool_json", "TEXT NOT NULL DEFAULT ''");
	ensureColumn(db, "adapters", "tool_enabled", "INTEGER NOT NULL DEFAULT 0");
	ensureColumn(db, "agents", "system_prompt", "TEXT NOT NULL DEFAULT ''");
	seedAdapters(db);
	migrateAdapterScripts(db);
	seedAdapterToolMeta(db);
	db.exec(`
		CREATE TABLE IF NOT EXISTS themes (
			id          INTEGER PRIMARY KEY AUTOINCREMENT,
			name        TEXT NOT NULL UNIQUE,
			tokens_json TEXT NOT NULL,
			is_active   INTEGER NOT NULL DEFAULT 0,
			created_at  TEXT NOT NULL DEFAULT (datetime('now')),
			updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
		);
	`);
	seedThemes(db);
	db.exec(`UPDATE research_instances SET type = 'twitterapi' WHERE type = 'twitter'`);
	db.exec(`UPDATE research_collectors SET type = 'twitterapi_' || substr(type, 9) WHERE type LIKE 'twitter\\_%' ESCAPE '\\'`);
	if (hasColumn(db, "records", "title")) {
		db.exec(`UPDATE records SET metadata_json = json_set(metadata_json, '$.title', title) WHERE title IS NOT NULL AND title <> ''`);
		db.exec(`UPDATE records SET metadata_json = json_set(metadata_json, '$.content', content) WHERE content IS NOT NULL AND content <> ''`);
		db.exec(`UPDATE records SET metadata_json = json_set(metadata_json, '$.url', url) WHERE url IS NOT NULL AND url <> ''`);
		db.exec(`UPDATE records SET metadata_json = json_set(metadata_json, '$.author', author) WHERE author IS NOT NULL AND author <> ''`);
		db.exec("ALTER TABLE records DROP COLUMN title");
		db.exec("ALTER TABLE records DROP COLUMN content");
		db.exec("ALTER TABLE records DROP COLUMN url");
		db.exec("ALTER TABLE records DROP COLUMN author");
	}
}
/** Insert the built-in adapter scripts, skipping any type that already exists
*  (user-created or user-edited rows are never touched). */
function seedAdapters(db) {
	const insert = db.prepare(`INSERT OR IGNORE INTO adapters (type, label, provider, description, input_hint, default_record_type, script)
		 VALUES (?, ?, ?, ?, ?, ?, ?)`);
	for (const seed of ADAPTER_SEEDS) insert.run(seed.type, seed.label, seed.provider ?? "", seed.description ?? "", seed.inputHint ?? "", seed.defaultRecordType ?? "item", seed.script ?? "");
}
/** Enable the agent-tool flag for built-in adapters that declare toolEnabled in
*  their seed entry. Runs insert-if-absent style: only sets the flag once, so
*  a user who unchecks it in the UI won't see it re-enabled on next restart. */
function seedAdapterToolMeta(db) {
	const update = db.prepare(`UPDATE adapters SET tool_enabled = 1 WHERE type = ? AND tool_enabled = 0`);
	for (const seed of ADAPTER_SEEDS) {
		if (!seed.toolEnabled) continue;
		update.run(seed.type);
	}
}
/** Rewrite built-in adapter scripts that still use the pre-rename API names
*  (ingest → paginate, remember → toRecord, ctx.collect → ctx.emit).
*  Only touches rows whose script still contains an old-API token, so
*  user-edited scripts that have already moved on are left untouched. */
function migrateAdapterScripts(db) {
	const get = db.prepare(`SELECT script FROM adapters WHERE type = ?`);
	const update = db.prepare(`UPDATE adapters SET script = ? WHERE type = ?`);
	for (const seed of ADAPTER_SEEDS) {
		if (!seed.script) continue;
		const row = get.get(seed.type);
		if (!row) continue;
		const old = row.script ?? "";
		if (!(old.includes(", ingest }") || old.includes(", ingest,") || old.includes("ingest }") || old.includes("return ingest(") || old.includes(", remember }") || old.includes(", remember,") || old.includes("remember(") || old.includes("ctx.collect("))) continue;
		update.run(seed.script, seed.type);
	}
}
/** Insert the built-in theme presets, skipping any name that already exists
*  (user-created or user-edited themes are never touched). The first preset is
*  activated only when no theme is active yet, so a fresh database boots with a
*  selection but re-running never overrides the user's active choice. */
function seedThemes(db) {
	const insert = db.prepare(`INSERT OR IGNORE INTO themes (name, tokens_json) VALUES (?, ?)`);
	for (const preset of THEME_PRESETS) insert.run(preset.name, JSON.stringify(preset.tokens));
	if (!db.prepare(`SELECT COUNT(*) AS n FROM themes WHERE is_active = 1`).get().n) db.prepare(`UPDATE themes SET is_active = 1 WHERE name = ?`).run(THEME_PRESETS[0].name);
}
/** Adds a column to an existing table if it isn't already present. */
function ensureColumn(db, table, column, definition) {
	if (!db.prepare(`PRAGMA table_info(${table})`).all().some((c) => c.name === column)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}
function tableExists(db, name) {
	return Boolean(db.prepare(`SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?`).get(name));
}
function hasColumn(db, table, column) {
	return db.prepare(`PRAGMA table_info(${table})`).all().some((c) => c.name === column);
}
/** Renames a table when the old name still exists and the new one doesn't yet. */
function renameTableIfExists(db, from, to) {
	if (tableExists(db, from) && !tableExists(db, to)) db.exec(`ALTER TABLE ${from} RENAME TO ${to}`);
}
/** Renames a column on an existing table (no-op if already migrated or absent). */
function renameColumnIfExists(db, table, from, to) {
	if (tableExists(db, table) && hasColumn(db, table, from) && !hasColumn(db, table, to)) db.exec(`ALTER TABLE ${table} RENAME COLUMN ${from} TO ${to}`);
}
//#endregion
//#region src/lib/server/db/index.js
var DB_PATH = process.env.DATABASE_PATH ?? join(process.cwd(), "data", "wiel.db");
/**
* Vite/SvelteKit can re-evaluate server modules during HMR. Cache the
* connection on globalThis so we never open more than one handle.
*/
var globalForDb = globalThis;
function createDb() {
	mkdirSync(dirname(DB_PATH), { recursive: true });
	const db = new DatabaseSync(DB_PATH);
	db.exec("PRAGMA journal_mode = WAL;");
	db.exec("PRAGMA foreign_keys = ON;");
	migrate(db);
	seedSettings(db);
	return db;
}
var db = globalForDb.__dashboardDb ?? createDb();
if (!globalForDb.__dashboardDb) globalForDb.__dashboardDb = db;

export { SETTINGS as S, db as d };
//# sourceMappingURL=db.js-tGTv_Rod.js.map
