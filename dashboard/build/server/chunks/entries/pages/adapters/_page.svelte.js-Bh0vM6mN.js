import { a1 as head, a9 as escape_html, _ as ensure_array_like, a7 as attr_class, T as derived, a0 as attr } from '../../../chunks/server.js-BeDXxHyW.js';
import { B as Button } from '../../../chunks/button.js-BKCc13Pl.js';
import { C as Circle_check } from '../../../chunks/circle-check.js-B6UbzeD-.js';
import { T as Triangle_alert } from '../../../chunks/triangle-alert.js-D5mtn1DL.js';
import { I as Input } from '../../../chunks/input.js-VxJyhIEJ.js';
import { L as Label } from '../../../chunks/label.js-C7a3GAk3.js';
import { X } from '../../../chunks/x.js-Q2Bhqwn4.js';
import '../../../chunks/client.js-C3bkgsj6.js';
import { B as Bot } from '../../../chunks/bot.js-B_UekssS.js';
import { B as Blocks, C as Chevron_right } from '../../../chunks/chevron-right.js-Bs16VbPn.js';
import { S as Search } from '../../../chunks/search.js-gP76OJx7.js';
import { B as Badge } from '../../../chunks/badge.js-C8dsQDqL.js';
import { P as Plus } from '../../../chunks/plus.js-BImBz3Qf.js';
import { P as Play } from '../../../chunks/play.js-BmT9XzUw.js';
import { N as Native_select } from '../../../chunks/native-select.js-BcwRQfN8.js';
import { C as Code_textarea } from '../../../chunks/code-textarea.js-DiJpDJEg.js';
import { T as Trash_2 } from '../../../chunks/trash-2.js-CCEbkDYU.js';
import '../../../chunks/shared.js-CgP5r6wP.js';
import '../../../chunks/create-id.js-BN8YEFln.js';
import '../../../chunks/palette.js-BPVUdeAc.js';
import '../../../chunks/index-server2.js-UaiofxX-.js';
import '../../../chunks/exports.js-Y2Zp5fEj.js';
import '../../../chunks/internal2.js-3fvE3IOr.js';
import '../../../chunks/index-server.js-YgGoPwWh.js';
import '../../../chunks/chunk.js-BBx_TEkp.js';
import '../../../chunks/utils.js-UusfKV9V.js';
import '../../../index.js-b3zrUcaR.js';
import '../../../chunks/internal.js-BlXt2rfE.js';
import '../../../chunks/shared-server.js-9-2j12mp.js';
import '../../../chunks/app.js-DT8253QF.js';

//#region src/lib/adapter-templates.js
var ADAPTER_SCRIPT_TEMPLATES = [
	{
		id: "client_watermark",
		label: "Provider client + newest-id watermark",
		script: [
			"// Fetch a page from a provider client and emit only items newer than the",
			"// cursor. The shape declares which item fields are kept as metadata.",
			"const { input, credentials, clients, paginate } = ctx;",
			"const query = String(input.query ?? '').trim();",
			"if (!query) throw new Error('This adapter requires input.query');",
			"return paginate({",
			"	mode: 'newest-id',",
			"	fetchPage: () => clients.twitterapi.twitterSearch({ query, apiKey: credentials.apiKey }),",
			"	items: (r) => r.tweets,",
			"	shape: { type: 'tweet', id: 'id', capturedAt: 'createdAt', fields: ['url', 'text', 'author', 'createdAt', 'likes'] }",
			"});"
		].join("\n")
	},
	{
		id: "viem_multi_read",
		label: "Viem — read multiple contracts (status report)",
		script: [
			"// Reads multiple contracts + functions in parallel and saves a single",
			"// status_report record per run. Extend the `reads` array with any",
			"// ABI fragment + address + args you need.",
			"",
			"const { viem } = ctx.clients;",
			"const { parseAbi, formatUnits, publicClientFromUrl } = viem;",
			"",
			"const rpcUrl = ctx.config.rpcUrl ?? ctx.credentials.rpcUrl;",
			"if (!rpcUrl) throw new Error('No rpcUrl in instance config or credentials.');",
			"const client = publicClientFromUrl(rpcUrl);",
			"",
			"// ── Contract reads ─────────────────────────────────────────────────",
			"// Each entry: { key, address, abi, functionName, args?, decimals? }",
			"// `decimals` is optional — set it to auto-format a uint256 as a float.",
			"const reads = [",
			"	{",
			"		key: 'totalSupply',",
			"		address: ctx.input.tokenAddress ?? '0x...',",
			"		abi: parseAbi(['function totalSupply() view returns (uint256)']),",
			"		functionName: 'totalSupply',",
			"		decimals: 18",
			"	},",
			"	{",
			"		key: 'symbol',",
			"		address: ctx.input.tokenAddress ?? '0x...',",
			"		abi: parseAbi(['function symbol() view returns (string)']),",
			"		functionName: 'symbol'",
			"	},",
			"	{",
			"		key: 'reserveA',",
			"		address: ctx.input.pairAddress ?? '0x...',",
			"		abi: parseAbi(['function getReserves() view returns (uint112, uint112, uint32)']),",
			"		functionName: 'getReserves'",
			"	}",
			"];",
			"",
			"// ── Parallel multicall ─────────────────────────────────────────────",
			"const results = await Promise.allSettled(",
			"	reads.map((r) =>",
			"		client.readContract({ address: r.address, abi: r.abi, functionName: r.functionName, args: r.args ?? [] })",
			"	)",
			");",
			"",
			"// ── Shape results into a flat data object ──────────────────────────",
			"const data = {};",
			"for (let i = 0; i < reads.length; i++) {",
			"	const { key, decimals } = reads[i];",
			"	const r = results[i];",
			"	if (r.status === 'fulfilled') {",
			"		const raw = r.value;",
			"		if (decimals !== undefined && typeof raw === 'bigint') {",
			"			data[key] = Number(formatUnits(raw, decimals));",
			"		} else if (typeof raw === 'bigint') {",
			"			data[key] = raw.toString();",
			"		} else if (Array.isArray(raw)) {",
			"			data[key] = raw.map((v) => typeof v === 'bigint' ? v.toString() : v);",
			"		} else {",
			"			data[key] = raw;",
			"		}",
			"	} else {",
			"		data[key] = null;",
			"		ctx.log(`${key} failed: ${r.reason?.message ?? r.reason}`);",
			"	}",
			"}",
			"",
			"// ── Save one status_report record ──────────────────────────────────",
			"// The id is the date (YYYY-MM-DD) so each day gets one upserted record.",
			"const day = new Date().toISOString().slice(0, 10);",
			"ctx.emit({",
			"	type: 'status_report',",
			"	id: `${ctx.input.label ?? 'report'}-${day}`,",
			"	capturedAt: new Date().toISOString(),",
			"	fields: data",
			"});"
		].join("\n")
	},
	{
		id: "x_search_signal",
		label: "X API — search + engagement filter",
		script: [
			"// Search X for a topic and save only tweets that clear an engagement",
			"// threshold. Good for tracking narratives and surfacing key voices.",
			"// input: { query, minLikes, minFollowers }",
			"",
			"const { xapi } = ctx.clients;",
			"const query = String(ctx.input.query ?? '').trim();",
			"const minLikes = Number(ctx.input.minLikes ?? 20);",
			"const minFollowers = Number(ctx.input.minFollowers ?? 500);",
			"if (!query) throw new Error('This adapter requires input.query');",
			"",
			"const spec = {",
			"	type: 'x_signal',",
			"	id: 'id',",
			"	capturedAt: 'createdAt',",
			"	fields: ['url', 'text', 'author', 'authorName', 'createdAt', 'likes', 'retweets', 'replies', 'views']",
			"};",
			"",
			"return ctx.paginate({",
			"	mode: 'newest-id',",
			"	fetchPage: (cursor) =>",
			"		xapi.searchRecentTweets({ query, cursor, bearerToken: ctx.credentials.bearerToken }),",
			"	items: (r) => r.tweets ?? [],",
			"	shape: spec,",
			"	build: (tweet) => {",
			"		if ((tweet.likes ?? 0) < minLikes) return null;",
			"		return ctx.toRecord(tweet, spec);",
			"	}",
			"});"
		].join("\n")
	},
	{
		id: "dexscreener_movers",
		label: "DexScreener — token pair movers",
		script: [
			"// Fetch all pairs for a token address and save each pair as a snapshot",
			"// record. On every run the latest price/volume/liquidity is upserted.",
			"// Pairs with significant 24h price moves are flagged via a `mover` field.",
			"// input: { tokenAddress, chainId, moveThreshold }",
			"",
			"const { dexscreener } = ctx.clients;",
			"const chainId = String(ctx.input.chainId ?? 'pulsechain');",
			"const tokenAddress = String(ctx.input.tokenAddress ?? '').trim();",
			"const moveThreshold = Number(ctx.input.moveThreshold ?? 10);",
			"if (!tokenAddress) throw new Error('This adapter requires input.tokenAddress');",
			"",
			"const pairs = await dexscreener.dexTokenPairs(chainId, tokenAddress);",
			"const normalized = (pairs ?? []).map(dexscreener.normalizePair);",
			"",
			"for (const pair of normalized) {",
			"	const h24 = Number(pair.h24 ?? 0);",
			"	ctx.emit({",
			"		type: 'token_pair_snapshot',",
			"		id: pair.pairAddress ?? pair.id,",
			"		capturedAt: new Date().toISOString(),",
			"		fields: {",
			"			...pair,",
			"			mover: Math.abs(h24) >= moveThreshold,",
			"			moveDirection: h24 > 0 ? 'up' : h24 < 0 ? 'down' : 'flat'",
			"		}",
			"	});",
			"}"
		].join("\n")
	},
	{
		id: "telegram_keyword_alert",
		label: "Telegram — keyword alert monitor",
		script: [
			"// Monitor a Telegram channel/group for new messages containing any of",
			"// the given keywords. Only messages newer than the cursor are checked.",
			"// Matched messages are saved as alert records.",
			"// input: { channel, keywords, limit }",
			"// credentials: { apiId, apiHash, session }",
			"",
			"const { telegram } = ctx.clients;",
			"const channel = String(ctx.input.channel ?? '').trim();",
			"const keywords = (ctx.input.keywords ?? []).map((k) => String(k).toLowerCase().trim()).filter(Boolean);",
			"const limit = Math.min(Number(ctx.input.limit ?? 50), 100);",
			"",
			"if (!channel) throw new Error('This adapter requires input.channel');",
			"if (!keywords.length) throw new Error('This adapter requires input.keywords (array of strings)');",
			"",
			"const { apiId, apiHash, session } = ctx.credentials;",
			"const messages = await telegram.fetchMessages({",
			"	channel,",
			"	limit,",
			"	minId: ctx.cursor ? Number(ctx.cursor) : 0,",
			"	apiId, apiHash, session",
			"});",
			"",
			"let newCursor = ctx.cursor;",
			"const spec = {",
			"	type: 'telegram_alert',",
			"	id: 'id',",
			"	capturedAt: 'date',",
			"	fields: ['chat', 'chatUsername', 'text', 'date', 'views', 'forwards', 'replies', 'url', 'matchedKeywords']",
			"};",
			"",
			"for (const msg of messages) {",
			"	if (!msg.id) continue;",
			"	if (!newCursor || Number(msg.id) > Number(newCursor)) newCursor = msg.id;",
			"	const text = (msg.text ?? '').toLowerCase();",
			"	const matched = keywords.filter((k) => text.includes(k));",
			"	if (!matched.length) continue;",
			"	if (ctx.emit({ ...ctx.toRecord({ ...msg, matchedKeywords: matched }, spec) }) === false) break;",
			"}",
			"",
			"return { cursor: newCursor };"
		].join("\n")
	},
	{
		id: "viem_v2_swap_monitor",
		label: "Viem — Uniswap V2 pair swap monitor",
		script: [
			"// Monitors one or more Uniswap V2 pairs: reads current reserves + token",
			"// metadata, then fetches Swap events since the last cursor block.",
			"// Saves a v2_pair_snapshot per pair + a v2_swap record per event.",
			"// input: { pairAddresses: [\"0x…\",\"0x…\"], lookbackBlocks }",
			"",
			"const { viem } = ctx.clients;",
			"const { parseAbi, parseAbiItem, decodeEventLog, formatUnits, publicClientFromUrl, resolveFromBlock } = viem;",
			"",
			"const rpcUrl = ctx.config.rpcUrl ?? ctx.credentials.rpcUrl;",
			"if (!rpcUrl) throw new Error('No rpcUrl in instance config or credentials.');",
			"const client = publicClientFromUrl(rpcUrl);",
			"",
			"const pairAddresses = (ctx.input.pairAddresses ?? []).map((a) => String(a).trim()).filter(Boolean);",
			"if (!pairAddresses.length) throw new Error('This adapter requires input.pairAddresses (array of pair contract addresses).');",
			"",
			"// ── ABIs ──────────────────────────────────────────────────────────────",
			"const PAIR_ABI = parseAbi([",
			"	'function token0() view returns (address)',",
			"	'function token1() view returns (address)',",
			"	'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',",
			"]);",
			"const ERC20_ABI = parseAbi([",
			"	'function symbol() view returns (string)',",
			"	'function decimals() view returns (uint8)',",
			"]);",
			"const SWAP_EVENT = parseAbiItem(",
			"	'event Swap(address indexed sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address indexed to)'",
			");",
			"",
			"// ── Block range (capped to 2000 per run) ──────────────────────────────",
			"const MAX_RANGE = 2000n;",
			"const latest = await client.getBlockNumber();",
			"const fromBlock = resolveFromBlock(ctx.cursor, latest, ctx.input.lookbackBlocks ?? 500);",
			"const toBlock = fromBlock + MAX_RANGE < latest ? fromBlock + MAX_RANGE : latest;",
			"ctx.log(`Scanning blocks ${fromBlock}–${toBlock} (${pairAddresses.length} pair(s))`);",
			"",
			"// ── Fetch token metadata + reserves for a pair ────────────────────────",
			"async function pairMeta(pair) {",
			"	const read = (address, abi, functionName) =>",
			"		client.readContract({ address, abi, functionName });",
			"	const [t0, t1, reserves] = await Promise.all([",
			"		read(pair, PAIR_ABI, 'token0'),",
			"		read(pair, PAIR_ABI, 'token1'),",
			"		read(pair, PAIR_ABI, 'getReserves'),",
			"	]);",
			"	const [sym0, dec0, sym1, dec1] = await Promise.all([",
			"		client.readContract({ address: t0, abi: ERC20_ABI, functionName: 'symbol' }).catch(() => '?'),",
			"		client.readContract({ address: t0, abi: ERC20_ABI, functionName: 'decimals' }).catch(() => 18),",
			"		client.readContract({ address: t1, abi: ERC20_ABI, functionName: 'symbol' }).catch(() => '?'),",
			"		client.readContract({ address: t1, abi: ERC20_ABI, functionName: 'decimals' }).catch(() => 18),",
			"	]);",
			"	const d0 = Number(dec0), d1 = Number(dec1);",
			"	return {",
			"		token0: t0, token1: t1,",
			"		symbol0: sym0, symbol1: sym1,",
			"		decimals0: d0, decimals1: d1,",
			"		reserve0: Number(formatUnits(reserves[0], d0)),",
			"		reserve1: Number(formatUnits(reserves[1], d1)),",
			"	};",
			"}",
			"",
			"// ── Main loop ─────────────────────────────────────────────────────────",
			"let totalSwaps = 0;",
			"for (const pair of pairAddresses) {",
			"	const meta = await pairMeta(pair);",
			"	const label = `${meta.symbol0}/${meta.symbol1}`;",
			"",
			"	// Reserve snapshot — one per pair per run (upserted by block)",
			"	ctx.emit({",
			"		type: 'v2_pair_snapshot',",
			"		id: `${pair}-${toBlock}`,",
			"		capturedAt: new Date().toISOString(),",
			"		fields: {",
			"			pair, label,",
			"			token0: meta.token0, symbol0: meta.symbol0,",
			"			token1: meta.token1, symbol1: meta.symbol1,",
			"			reserve0: meta.reserve0, reserve1: meta.reserve1,",
			"			blockNumber: toBlock.toString()",
			"		}",
			"	});",
			"",
			"	// Swap events",
			"	const logs = await client.getLogs({ address: pair, event: SWAP_EVENT, fromBlock, toBlock });",
			"	ctx.log(`${label} — ${logs.length} swap(s)`);",
			"	totalSwaps += logs.length;",
			"",
			"	for (const log of logs) {",
			"		let args;",
			"		try {",
			"			({ args } = decodeEventLog({ abi: [SWAP_EVENT], data: log.data, topics: log.topics }));",
			"		} catch { continue; }",
			"",
			"		const a0in  = Number(formatUnits(args.amount0In,  meta.decimals0));",
			"		const a1in  = Number(formatUnits(args.amount1In,  meta.decimals1));",
			"		const a0out = Number(formatUnits(args.amount0Out, meta.decimals0));",
			"		const a1out = Number(formatUnits(args.amount1Out, meta.decimals1));",
			"",
			"		// Which token is flowing in determines direction",
			"		const buying0 = a1in > 0;",
			"		const direction  = buying0 ? `${meta.symbol1} → ${meta.symbol0}` : `${meta.symbol0} → ${meta.symbol1}`;",
			"		const amountIn   = buying0 ? a1in  : a0in;",
			"		const amountOut  = buying0 ? a0out : a1out;",
			"		const symbolIn   = buying0 ? meta.symbol1 : meta.symbol0;",
			"		const symbolOut  = buying0 ? meta.symbol0 : meta.symbol1;",
			"",
			"		if (ctx.emit({",
			"			type: 'v2_swap',",
			"			id: `${log.transactionHash}-${log.logIndex}`,",
			"			capturedAt: new Date().toISOString(),",
			"			fields: {",
			"				pair, label, direction,",
			"				symbolIn, symbolOut, amountIn, amountOut,",
			"				amount0In: a0in, amount1In: a1in,",
			"				amount0Out: a0out, amount1Out: a1out,",
			"				sender: args.sender, to: args.to,",
			"				blockNumber: log.blockNumber?.toString(),",
			"				txHash: log.transactionHash,",
			"			}",
			"		}) === false) break;",
			"	}",
			"}",
			"",
			"ctx.log(`Done — ${totalSwaps} swap(s) saved`);",
			"return { cursor: toBlock.toString() };"
		].join("\n")
	},
	{
		id: "xapi_http_user_tweets",
		label: "X API v2 — user tweets via HTTP (no client)",
		script: [
			"// Fetch a user's recent tweets directly via the X API v2 HTTP API using",
			"// ctx.http — no client wrapper, just raw fetch. Useful when you want full",
			"// control over query params or fields not exposed by ctx.clients.xapi.",
			"// credentials: { bearerToken }",
			"// input: { username, maxResults, minLikes }",
			"",
			"const bearerToken = ctx.credentials.bearerToken ?? '';",
			"if (!bearerToken) throw new Error('Missing credentials.bearerToken');",
			"",
			"const username = String(ctx.input.username ?? '').trim().replace(/^@/, '');",
			"if (!username) throw new Error('This adapter requires input.username');",
			"const maxResults = Math.min(Number(ctx.input.maxResults ?? 20), 100);",
			"const minLikes = Number(ctx.input.minLikes ?? 0);",
			"",
			"// ── Step 1: resolve username → numeric user id ────────────────────────",
			"const userUrl = `https://api.twitter.com/2/users/by/username/${encodeURIComponent(username)}?user.fields=public_metrics,description`;",
			"const userResp = await ctx.http(userUrl, {",
			"	headers: { Authorization: `Bearer ${bearerToken}` }",
			"});",
			"if (!userResp.data?.id) throw new Error(`User @${username} not found`);",
			"const userId = userResp.data.id;",
			"ctx.log(`Resolved @${username} → ${userId}`);",
			"",
			"// ── Step 2: fetch recent tweets ───────────────────────────────────────",
			"// sinceId is the stored cursor (newest tweet id from last run)",
			"const sinceId = ctx.cursor || '';",
			"const params = new URLSearchParams({",
			"	max_results: String(maxResults),",
			"	\"tweet.fields\": \"id,text,created_at,public_metrics,entities,attachments\",",
			"	\"expansions\": \"author_id\",",
			"	\"user.fields\": \"name,username,public_metrics\"",
			"});",
			"if (sinceId) params.set('since_id', sinceId);",
			"",
			"const tweetsUrl = `https://api.twitter.com/2/users/${userId}/tweets?${params}`;",
			"const resp = await ctx.http(tweetsUrl, {",
			"	headers: { Authorization: `Bearer ${bearerToken}` }",
			"});",
			"",
			"const tweets = resp.data ?? [];",
			"ctx.log(`Fetched ${tweets.length} tweet(s) from @${username}`);",
			"",
			"// ── Step 3: emit records ──────────────────────────────────────────────",
			"let newestId = sinceId;",
			"for (const tweet of tweets) {",
			"	const likes = tweet.public_metrics?.like_count ?? 0;",
			"	if (likes < minLikes) continue;",
			"	if (!newestId || BigInt(tweet.id) > BigInt(newestId)) newestId = tweet.id;",
			"	if (ctx.emit({",
			"		type: 'tweet',",
			"		id: tweet.id,",
			"		capturedAt: tweet.created_at,",
			"		fields: {",
			"			author: username,",
			"			authorId: userId,",
			"			text: tweet.text,",
			"			likes: tweet.public_metrics?.like_count ?? 0,",
			"			retweets: tweet.public_metrics?.retweet_count ?? 0,",
			"			replies: tweet.public_metrics?.reply_count ?? 0,",
			"			quotes: tweet.public_metrics?.quote_count ?? 0,",
			"			url: `https://x.com/${username}/status/${tweet.id}`,",
			"			createdAt: tweet.created_at",
			"		}",
			"	}) === false) break;",
			"}",
			"",
			"// Advance the cursor to the newest tweet id so the next run only fetches newer.",
			"return { cursor: newestId };"
		].join("\n")
	},
	{
		id: "http_snapshot",
		label: "Ad-hoc HTTP API (snapshot)",
		script: [
			"// Call any public JSON API with ctx.http and emit every item on each run",
			"// (upsert dedupes by id). Good for lists that are re-fetched fresh.",
			"const { input, http, save } = ctx;",
			"const url = String(input.url ?? '').trim();",
			"if (!url) throw new Error('This adapter requires input.url');",
			"const json = await http(url);",
			"const items = Array.isArray(json) ? json : (json.items ?? []);",
			"const shape = { type: 'item', id: 'id', fields: ['name', 'value'] };",
			"for (const item of items) if (save(item, shape) === false) break;",
			"return {};"
		].join("\n")
	}
];
//#endregion
//#region src/routes/adapters/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		const emptyForm = () => ({
			type: "",
			label: "",
			provider: "",
			description: "",
			inputHint: "",
			defaultRecordType: "",
			script: "",
			template: "",
			toolEnabled: false,
			testInput: "{}"
		});
		let createRefs = { script: null };
		let editRefs = { script: null };
		let selected = null;
		let mode = null;
		let createForm = emptyForm();
		let editForm = emptyForm();
		let query = "";
		let lastTestResult = null;
		let testInstanceId = "";
		function startNew() {
			selected = null;
			mode = "new";
			lastTestResult = null;
			createForm = emptyForm();
		}
		function closePanel() {
			selected = null;
			mode = null;
			lastTestResult = null;
		}
		function applyTemplate(f, id, refs) {
			const template = ADAPTER_SCRIPT_TEMPLATES.find((t) => t.id === id);
			f.template = "";
			if (!template) return;
			const ta = refs?.script;
			if (ta && document.activeElement === ta) {
				const start = ta.selectionStart ?? 0;
				const end = ta.selectionEnd ?? 0;
				f.script = (f.script ?? "").slice(0, start) + template.script + (f.script ?? "").slice(end);
				requestAnimationFrame(() => {
					ta.selectionStart = start + template.script.length;
					ta.selectionEnd = start + template.script.length;
					ta.focus();
				});
			} else f.script = template.script;
		}
		function validateScript(script) {
			const s = String(script ?? "").trim();
			if (!s) return [];
			try {
				const AF = Object.getPrototypeOf(async function() {}).constructor;
				new AF("ctx", s);
			} catch (err) {
				return [{
					type: "error",
					message: `Syntax: ${err.message}`
				}];
			}
			const warns = [];
			if (!/ctx\.(save|emit|paginate)\b/.test(s)) warns.push({
				type: "warn",
				message: "No ctx.save, ctx.emit, or ctx.paginate found — script may not collect records."
			});
			return warns;
		}
		const filtered = derived(() => query.trim() ? data.adapters.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()) || a.type.toLowerCase().includes(query.toLowerCase()) || (a.provider ?? "").toLowerCase().includes(query.toLowerCase())) : data.adapters);
		const grouped = derived(() => Object.entries(filtered().reduce((acc, a) => {
			const key = a.provider || "other";
			(acc[key] ??= []).push(a);
			return acc;
		}, {})));
		let collapsed = new Set(data.adapters.map((a) => a.provider || "other"));
		const effectiveCollapsed = derived(() => query.trim() ? /* @__PURE__ */ new Set() : collapsed);
		function adapterFields($$renderer, f, refs) {
			$$renderer.push(`<div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
			Label($$renderer, {
				for: "type",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Type`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "type",
				name: "type",
				placeholder: "e.g. xapi_search",
				class: "font-mono text-xs",
				required: true,
				get value() {
					return f.type;
				},
				set value($$value) {
					f.type = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div> <div class="grid gap-2">`);
			Label($$renderer, {
				for: "label",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Label`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "label",
				name: "label",
				placeholder: "e.g. X API search",
				required: true,
				get value() {
					return f.label;
				},
				set value($$value) {
					f.label = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div></div> <div class="grid grid-cols-2 gap-4"><div class="grid gap-2">`);
			Label($$renderer, {
				for: "provider",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Provider tag`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "provider",
				name: "provider",
				placeholder: "e.g. xapi, telegram",
				class: "font-mono text-xs",
				get value() {
					return f.provider;
				},
				set value($$value) {
					f.provider = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div> <div class="grid gap-2">`);
			Label($$renderer, {
				for: "defaultRecordType",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Default record type`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "defaultRecordType",
				name: "defaultRecordType",
				placeholder: "e.g. tweet",
				class: "font-mono text-xs",
				get value() {
					return f.defaultRecordType;
				},
				set value($$value) {
					f.defaultRecordType = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div></div> <div class="grid gap-2">`);
			Label($$renderer, {
				for: "description",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Description (optional)`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "description",
				name: "description",
				placeholder: "What this adapter collects",
				get value() {
					return f.description;
				},
				set value($$value) {
					f.description = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div> <div class="grid gap-2">`);
			Label($$renderer, {
				for: "inputHint",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Input hint (optional)`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				id: "inputHint",
				name: "inputHint",
				placeholder: "{ \"query\": \"PulseChain\" }",
				class: "font-mono text-xs",
				get value() {
					return f.inputHint;
				},
				set value($$value) {
					f.inputHint = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div> <div class="grid gap-2"><div class="flex items-center justify-between">`);
			Label($$renderer, {
				for: "script",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Script`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Native_select($$renderer, {
				"aria-label": "Script examples",
				size: "sm",
				class: "w-auto",
				onchange: () => applyTemplate(f, f.template, refs),
				get value() {
					return f.template;
				},
				set value($$value) {
					f.template = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					$$renderer.option({
						value: "",
						disabled: true
					}, ($$renderer) => {
						$$renderer.push(`Script examples…`);
					});
					$$renderer.push(` <!--[-->`);
					const each_array = ensure_array_like(ADAPTER_SCRIPT_TEMPLATES);
					for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
						let template = each_array[$$index];
						$$renderer.option({ value: template.id }, ($$renderer) => {
							$$renderer.push(`${escape_html(template.label)}`);
						});
					}
					$$renderer.push(`<!--]-->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> `);
			Code_textarea($$renderer, {
				id: "script",
				name: "script",
				rows: 28,
				required: true,
				get value() {
					return f.script;
				},
				set value($$value) {
					f.script = $$value;
					$$settled = false;
				},
				get ref() {
					return refs.script;
				},
				set ref($$value) {
					refs.script = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> <!--[-->`);
			const each_array_1 = ensure_array_like(validateScript(f.script));
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let w = each_array_1[$$index_1];
				$$renderer.push(`<p${attr_class(`flex items-center gap-1.5 text-xs ${w.type === "error" ? "text-destructive" : "text-muted-foreground"}`)}>`);
				Triangle_alert($$renderer, { class: "size-3 shrink-0" });
				$$renderer.push(`<!---->${escape_html(w.message)}</p>`);
			}
			$$renderer.push(`<!--]--> <details class="group"><summary class="text-muted-foreground hover:text-foreground flex cursor-pointer select-none items-center gap-1.5 text-xs"><svg class="size-3 rotate-0 transition-transform group-open:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"></path></svg> ctx reference</summary> <div class="mt-2 space-y-3"><pre class="bg-muted/60 text-muted-foreground overflow-x-auto rounded-md p-3 font-mono text-xs leading-relaxed"><code>// ── Inputs ───────────────────────────────────────────────
ctx.input        // collector Input JSON  e.g. { query: "PLS" }
ctx.cursor       // last saved watermark  ('' on first run)
ctx.config       // instance config object
ctx.credentials  // instance credentials object

// ── Clients ───────────────────────────────────────────────
ctx.clients.xapi          // X API (RapidAPI)
ctx.clients.twitterapi    // TwitterAPI.io
ctx.clients.dexscreener   // DexScreener REST
ctx.clients.telegram      // Telegram MTProto
ctx.clients.viem          // viem public + wallet client
ctx.clients.sourcify      // Sourcify contract API

// ── Utilities ─────────────────────────────────────────────
ctx.http(url, opts?)      // fetch JSON (SSRF-guarded)
ctx.query(filter?)        // query persisted records (same filter grammar as reports)
ctx.log(msg)              // append to run log

// ── Emitting records ──────────────────────────────────────
const spec = { type: 'tweet', id: 'id', capturedAt: 'createdAt',
               fields: ['text', 'author', 'likes'] };

ctx.save(item, spec)      // shape + emit one item
ctx.emit(record)          // emit a pre-shaped record
ctx.toRecord(item, spec)  // shape without emitting

// ── Pagination driver ─────────────────────────────────────
return await ctx.paginate({
  mode: 'newest-id',       // 'newest-id' | 'paginate' | 'snapshot'
  fetchPage: (cursor) => ctx.clients.xapi.search(ctx.input.query, cursor),
  items: (page) => page.results,
  paging: (page) => ({ nextCursor: page.next_cursor }),
  shape: spec,
});

// ── Return (manual collect) ───────────────────────────────
return { cursor: newCursor };  // advance the watermark

// ── Agent fetch mode ──────────────────────────────────────
// When an agent calls this adapter directly (ctx.mode === 'fetch'),
// records are collected in memory and returned as text. Scripts can
// return a richer response by checking the mode:
if (ctx.mode === 'fetch') {
  return { result: \`Found \${items.length} items — summary here\` };
}</code></pre></div></details></div> <label class="flex cursor-pointer items-start gap-3 rounded-lg border p-3"><input type="checkbox" name="toolEnabled" value="1"${attr("checked", f.toolEnabled, true)} class="mt-0.5 size-4 cursor-pointer accent-primary"/> <div><span class="flex items-center gap-1.5 text-sm font-medium">`);
			Bot($$renderer, { class: "size-3.5" });
			$$renderer.push(`<!----> Expose as agent tool</span> <p class="text-muted-foreground mt-0.5 text-xs">When enabled, this adapter is registered as a named agent tool. The description,
				input hint, and provider are used to build the tool definition automatically.</p></div></label> `);
			if (form?.message) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-destructive text-xs">${escape_html(form.message)}</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		function testSection($$renderer, f) {
			$$renderer.push(`<div class="mt-4 rounded-lg border"><form method="POST" action="?/test" class="p-3"><input type="hidden" name="script"${attr("value", f.script)}/> <div class="mb-2 flex items-center gap-2"><span class="text-xs font-medium">Run test</span> `);
			if (data.instances.length > 0) {
				$$renderer.push("<!--[0-->");
				Native_select($$renderer, {
					"aria-label": "Instance for test",
					size: "sm",
					name: "instanceId",
					class: "ml-auto h-6 w-auto text-xs",
					get value() {
						return testInstanceId;
					},
					set value($$value) {
						testInstanceId = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						$$renderer.option({ value: "" }, ($$renderer) => {
							$$renderer.push(`No instance`);
						});
						$$renderer.push(` <!--[-->`);
						const each_array_2 = ensure_array_like(data.instances);
						for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
							let inst = each_array_2[$$index_2];
							$$renderer.option({ value: inst.id }, ($$renderer) => {
								$$renderer.push(`${escape_html(inst.name)}`);
							});
						}
						$$renderer.push(`<!--]-->`);
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="flex gap-2">`);
			Input($$renderer, {
				name: "testInput",
				placeholder: `{"query":"PulseChain"}`,
				class: "font-mono text-xs",
				get value() {
					return f.testInput;
				},
				set value($$value) {
					f.testInput = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				type: "submit",
				size: "sm",
				variant: "outline",
				disabled: !f.script.trim(),
				class: "shrink-0",
				children: ($$renderer) => {
					$$renderer.push("<!--[-1-->");
					Play($$renderer, { class: "size-3.5" });
					$$renderer.push(`<!--]--> Run`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></form> `);
			if (lastTestResult) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="border-t px-3 pb-3 pt-2">`);
				if (lastTestResult.error) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-destructive mb-1.5 flex items-center gap-1.5 text-xs font-medium">`);
					Triangle_alert($$renderer, { class: "size-3.5 shrink-0" });
					$$renderer.push(`<!---->${escape_html(lastTestResult.error)}</p>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<p class="text-muted-foreground mb-1.5 flex items-center gap-1.5 text-xs">`);
					Circle_check($$renderer, { class: "text-primary size-3.5 shrink-0" });
					$$renderer.push(`<!----> ${escape_html(lastTestResult.records)} record${escape_html(lastTestResult.records === 1 ? "" : "s")} collected `);
					if (lastTestResult.result) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`· ${escape_html(lastTestResult.result)}`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></p>`);
				}
				$$renderer.push(`<!--]--> `);
				if (lastTestResult.logs?.length) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="bg-muted/50 max-h-40 overflow-y-auto rounded p-2"><!--[-->`);
					const each_array_3 = ensure_array_like(lastTestResult.logs);
					for (let i = 0, $$length = each_array_3.length; i < $$length; i++) {
						let line = each_array_3[i];
						$$renderer.push(`<p class="text-muted-foreground font-mono text-[11px] leading-5">${escape_html(line)}</p>`);
					}
					$$renderer.push(`<!--]--></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("bpimpx", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Adapters · WieldOS</title>`);
				});
			});
			$$renderer.push(`<div class="flex min-h-[500px] flex-1 gap-4 overflow-hidden" style="height: calc(100svh - 9.5rem)"><div class="flex w-64 shrink-0 flex-col overflow-hidden rounded-lg border"><div class="flex items-center gap-2 border-b p-2.5"><div class="relative flex-1">`);
			Search($$renderer, { class: "text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" });
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				placeholder: "Filter…",
				class: "h-7 pl-7 text-xs",
				get value() {
					return query;
				},
				set value($$value) {
					query = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div> `);
			Button($$renderer, {
				size: "sm",
				onclick: startNew,
				class: "h-7 shrink-0 px-2 text-xs",
				children: ($$renderer) => {
					Plus($$renderer, { class: "size-3.5" });
					$$renderer.push(`<!----> New`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> <div class="flex-1 overflow-y-auto">`);
			if (data.adapters.length === 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-muted-foreground flex flex-col items-center gap-2 px-4 py-12 text-center text-sm">`);
				Blocks($$renderer, { class: "size-8 opacity-40" });
				$$renderer.push(`<!----> <p>No adapters yet</p></div>`);
			} else if (grouped().length === 0) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<p class="text-muted-foreground px-3 py-6 text-center text-xs">No match for "${escape_html(query)}"</p>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--[-->`);
				const each_array_4 = ensure_array_like(grouped());
				for (let $$index_5 = 0, $$length = each_array_4.length; $$index_5 < $$length; $$index_5++) {
					let [provider, adapters] = each_array_4[$$index_5];
					const isCollapsed = effectiveCollapsed().has(provider);
					$$renderer.push(`<button type="button" class="text-muted-foreground hover:text-foreground hover:bg-muted/30 flex w-full items-center justify-between border-b px-3 py-1.5 transition-colors"><span class="font-mono text-[10px] tracking-widest uppercase">${escape_html(provider)}</span> <div class="flex items-center gap-1.5"><span class="text-[10px] opacity-50">${escape_html(adapters.length)}</span> `);
					Chevron_right($$renderer, { class: `size-3 transition-transform duration-150 ${isCollapsed ? "" : "rotate-90"}` });
					$$renderer.push(`<!----></div></button> `);
					if (!isCollapsed) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<!--[-->`);
						const each_array_5 = ensure_array_like(adapters);
						for (let $$index_4 = 0, $$length = each_array_5.length; $$index_4 < $$length; $$index_4++) {
							let adapter = each_array_5[$$index_4];
							$$renderer.push(`<button type="button"${attr_class(`w-full border-b px-3 py-2.5 text-left transition-colors last:border-b-0 hover:bg-muted/50 ${selected?.id === adapter.id ? "bg-muted" : ""}`)}><div class="flex items-center justify-between gap-1.5"><span class="truncate text-sm font-medium">${escape_html(adapter.label)}</span> <div class="flex shrink-0 items-center gap-1">`);
							if (adapter.toolEnabled) {
								$$renderer.push("<!--[0-->");
								Bot($$renderer, { class: "text-primary/60 size-3" });
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> `);
							if (adapter.collectorCount > 0) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<span class="text-muted-foreground text-xs">${escape_html(adapter.collectorCount)}</span>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div></div> <span class="text-muted-foreground font-mono text-xs">${escape_html(adapter.type)}</span></button>`);
						}
						$$renderer.push(`<!--]-->`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				}
				$$renderer.push(`<!--]-->`);
			}
			$$renderer.push(`<!--]--></div></div> <div class="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border">`);
			if (!mode) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-2 text-sm">`);
				Blocks($$renderer, { class: "size-8 opacity-30" });
				$$renderer.push(`<!----> <p>Select an adapter or create a new one</p></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="flex shrink-0 items-center gap-2 border-b px-4 py-2.5"><h2 class="truncate font-medium">${escape_html(mode === "new" ? "New adapter" : editForm.label || "Edit adapter")}</h2> `);
				if (mode === "edit" && selected) {
					$$renderer.push("<!--[0-->");
					Badge($$renderer, {
						variant: "outline",
						class: "font-mono text-xs",
						children: ($$renderer) => {
							$$renderer.push(`<!---->${escape_html(editForm.type)}`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> <form method="POST" action="?/delete" class="ml-auto"><input type="hidden" name="id"${attr("value", selected.id)}/> `);
					Button($$renderer, {
						type: "submit",
						variant: "ghost",
						size: "sm",
						class: "text-muted-foreground hover:text-destructive",
						disabled: selected.collectorCount > 0,
						title: selected.collectorCount > 0 ? "In use by collectors" : "Delete adapter",
						children: ($$renderer) => {
							Trash_2($$renderer, { class: "size-4" });
							$$renderer.push(`<!----> Delete`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></form>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="ml-auto"></div>`);
				}
				$$renderer.push(`<!--]--> `);
				Button($$renderer, {
					variant: "ghost",
					size: "icon-sm",
					class: "text-muted-foreground",
					onclick: closePanel,
					children: ($$renderer) => {
						X($$renderer, { class: "size-4" });
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div> <div class="flex-1 overflow-y-auto p-4">`);
				if (mode === "new") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<form method="POST" action="?/create" class="grid gap-4">`);
					adapterFields($$renderer, createForm, createRefs);
					$$renderer.push(`<!----> <div>`);
					Button($$renderer, {
						type: "submit",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Create adapter`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div></form> `);
					testSection($$renderer, createForm);
					$$renderer.push(`<!---->`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<!---->`);
					$$renderer.push(`<form method="POST" action="?/update" class="grid gap-4"><input type="hidden" name="id"${attr("value", selected?.id)}/> `);
					adapterFields($$renderer, editForm, editRefs);
					$$renderer.push(`<!----> <div>`);
					Button($$renderer, {
						type: "submit",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Save changes`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div></form> `);
					testSection($$renderer, editForm);
					$$renderer.push(`<!---->`);
					$$renderer.push(`<!---->`);
				}
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-Bh0vM6mN.js.map
