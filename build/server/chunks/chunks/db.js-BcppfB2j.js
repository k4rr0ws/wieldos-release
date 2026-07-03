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
		script: `const { input, credentials, clients, ingest } = ctx;
const query = String(input.query ?? '').trim();
if (!query) throw new Error('xapi_search requires input.query');
const sortOrder = input.sortOrder === 'relevancy' ? 'relevancy' : 'recency';
return ingest({
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
		script: `const { input, credentials, clients, ingest } = ctx;
const username = String(input.username ?? '').trim().replace(/^@/, '');
if (!username) throw new Error('xapi_fetch_user_tweets requires input.username');
const excludeReplies = Boolean(input.excludeReplies);
const bearerToken = credentials.bearerToken;
const user = await clients.xapi.fetchUserByUsername(username, { bearerToken });
return ingest({
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
		script: `const { input, credentials, clients, ingest } = ctx;
const query = String(input.query ?? '').trim();
if (!query) throw new Error('twitterapi_search requires input.query');
const queryType = input.queryType === 'Top' ? 'Top' : 'Latest';
return ingest({
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
		description: "Collects a specific account’s latest tweets into tweet records, watermarked by newest tweet id.",
		inputHint: "{ \"userName\": \"elonmusk\", \"includeReplies\": false }",
		defaultRecordType: "tweet",
		script: `const { input, credentials, clients, ingest } = ctx;
const userName = String(input.userName ?? '').trim().replace(/^@/, '');
if (!userName) throw new Error('twitterapi_user_tweets requires input.userName');
const includeReplies = Boolean(input.includeReplies);
return ingest({
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
		script: `const { input, credentials, clients, ingest } = ctx;
const userName = String(input.userName ?? '').trim().replace(/^@/, '');
if (!userName) throw new Error('twitterapi_mentions requires input.userName');
return ingest({
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
		script: `const { input, credentials, clients, ingest, remember } = ctx;
const tweetId = String(input.tweetId ?? '').trim();
if (!tweetId) throw new Error('twitterapi_replies requires input.tweetId');
const shape = { type: 'tweet_reply', id: 'id', capturedAt: 'createdAt', fields: ${fields([...TWEET_FIELDS, "inReplyTo"])} };
return ingest({
	mode: 'newest-id',
	fetchPage: () => clients.twitterapi.twitterReplies({ tweetId, apiKey: credentials.apiKey }),
	items: (r) => r.tweets,
	build: (t) => remember({ ...t, inReplyTo: tweetId }, shape),
	id: (t) => t.id
});`
	},
	{
		type: "twitterapi_followers",
		label: "X/Twitter followers",
		provider: "twitterapi",
		description: "Collects an account’s followers into twitter_user records; the cursor walks one page per run and resets once exhausted.",
		inputHint: "{ \"userName\": \"PulseChain\" }",
		defaultRecordType: "twitter_user",
		script: `const { input, credentials, clients, ingest } = ctx;
const userName = String(input.userName ?? '').trim().replace(/^@/, '');
if (!userName) throw new Error('twitterapi_followers requires input.userName');
return ingest({
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
		script: `const { input, credentials, clients, ingest } = ctx;
const userName = String(input.userName ?? '').trim().replace(/^@/, '');
if (!userName) throw new Error('twitterapi_followings requires input.userName');
return ingest({
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
		type: "sourcify_fetch_contract",
		label: "Sourcify contract lookup",
		provider: "sourcify",
		description: "Looks up a verified contract by chain + address and emits one verified_contract record. Public API, no credentials.",
		inputHint: "{ \"address\": \"0x…\", \"chainId\": \"1\" }",
		defaultRecordType: "verified_contract",
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
		script: `const { input, cursor, credentials, clients, ingest } = ctx;
const channel = String(input.channel ?? '').trim();
if (!channel) throw new Error('telegram_fetch_messages requires input.channel');
const limit = clients.telegram.clampLimit(input.limit);
return ingest({
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
	seedAdapters(db);
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
var DB_PATH = process.env.DATABASE_PATH ?? join(process.cwd(), "data", "dashboard.db");
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
//# sourceMappingURL=db.js-BcppfB2j.js.map
