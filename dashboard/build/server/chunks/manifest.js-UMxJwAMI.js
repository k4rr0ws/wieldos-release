const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.Dmw6xW4i.js",app:"_app/immutable/entry/app.DClLUkDs.js",imports:["_app/immutable/entry/start.Dmw6xW4i.js","_app/immutable/chunks/DTaMewld.js","_app/immutable/chunks/BKbxTPW3.js","_app/immutable/entry/app.DClLUkDs.js","_app/immutable/chunks/BKbxTPW3.js","_app/immutable/chunks/kNaey6uv.js","_app/immutable/chunks/xihTtKlq.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js-RQ82-qx4.js')),
			__memo(() => import('./nodes/1.js-Bf7_YBAR.js')),
			__memo(() => import('./nodes/2.js-BuSTc2HF.js')),
			__memo(() => import('./nodes/3.js-B5XT6EoL.js')),
			__memo(() => import('./nodes/4.js-D4wojC5F.js')),
			__memo(() => import('./nodes/5.js-DN4-IPHv.js')),
			__memo(() => import('./nodes/6.js-pU1j7Twe.js')),
			__memo(() => import('./nodes/7.js-DNAwJpdQ.js')),
			__memo(() => import('./nodes/8.js-C2j06dEt.js')),
			__memo(() => import('./nodes/9.js-DrCVeN1t.js')),
			__memo(() => import('./nodes/10.js-D_D21v6_.js')),
			__memo(() => import('./nodes/11.js-C23j_fNi.js')),
			__memo(() => import('./nodes/12.js-eWS4vd7V.js')),
			__memo(() => import('./nodes/13.js-CVBwjIuf.js')),
			__memo(() => import('./nodes/14.js-CTu1vcud.js')),
			__memo(() => import('./nodes/15.js-5uTda3xm.js')),
			__memo(() => import('./nodes/16.js-CWDjMSEy.js')),
			__memo(() => import('./nodes/17.js-B3aad6EL.js')),
			__memo(() => import('./nodes/18.js-CoDgTgtN.js')),
			__memo(() => import('./nodes/19.js-BIKRI-hY.js')),
			__memo(() => import('./nodes/20.js-DwEqiNaV.js')),
			__memo(() => import('./nodes/21.js-B2dYPLeN.js')),
			__memo(() => import('./nodes/22.js-DGbYc-8x.js')),
			__memo(() => import('./nodes/23.js-8QRFDIML.js')),
			__memo(() => import('./nodes/24.js-Cwbg8l5L.js')),
			__memo(() => import('./nodes/25.js-DHljgYJC.js')),
			__memo(() => import('./nodes/26.js-STi00QzD.js')),
			__memo(() => import('./nodes/27.js-BstCIRT2.js')),
			__memo(() => import('./nodes/28.js-DOlTTkbZ.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/activity",
				pattern: /^\/activity\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/adapters",
				pattern: /^\/adapters\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/agents",
				pattern: /^\/agents\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/agents/[id]",
				pattern: /^\/agents\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/collectors",
				pattern: /^\/collectors\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/deliverables",
				pattern: /^\/deliverables\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/deliverables/[id]",
				pattern: /^\/deliverables\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/goals",
				pattern: /^\/goals\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/humans",
				pattern: /^\/humans\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/inbox",
				pattern: /^\/inbox\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/instances",
				pattern: /^\/instances\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/lock",
				pattern: /^\/lock\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/media/avatars/[file]",
				pattern: /^\/media\/avatars\/([^/]+?)\/?$/,
				params: [{"name":"file","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/media/avatars/_file_/_server.js-spUOoNlk.js'))
			},
			{
				id: "/notes",
				pattern: /^\/notes\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/notes/[id]",
				pattern: /^\/notes\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/orchestrate",
				pattern: /^\/orchestrate\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/projects",
				pattern: /^\/projects\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/projects/[id]",
				pattern: /^\/projects\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/records",
				pattern: /^\/records\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/reports",
				pattern: /^\/reports\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/schedule",
				pattern: /^\/schedule\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/status",
				pattern: /^\/status\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/status/backup",
				pattern: /^\/status\/backup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/status/backup/_server.js-4o0oTGtJ.js'))
			},
			{
				id: "/tasks",
				pattern: /^\/tasks\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/theme",
				pattern: /^\/theme\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/transformers",
				pattern: /^\/transformers\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 28 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

export { manifest as m };
//# sourceMappingURL=manifest.js-UMxJwAMI.js.map
