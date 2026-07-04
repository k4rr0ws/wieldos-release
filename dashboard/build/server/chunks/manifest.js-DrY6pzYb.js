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
		client: {start:"_app/immutable/entry/start.DHCj1MSo.js",app:"_app/immutable/entry/app.O7B1K2Sm.js",imports:["_app/immutable/entry/start.DHCj1MSo.js","_app/immutable/chunks/CxXELwVZ.js","_app/immutable/chunks/BKbxTPW3.js","_app/immutable/entry/app.O7B1K2Sm.js","_app/immutable/chunks/BKbxTPW3.js","_app/immutable/chunks/kNaey6uv.js","_app/immutable/chunks/xihTtKlq.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js-Crr9IDrI.js')),
			__memo(() => import('./nodes/1.js-KG51jyqh.js')),
			__memo(() => import('./nodes/2.js-BuSTc2HF.js')),
			__memo(() => import('./nodes/3.js-U0EP91ZG.js')),
			__memo(() => import('./nodes/4.js-D4wojC5F.js')),
			__memo(() => import('./nodes/5.js-DDDa-zeU.js')),
			__memo(() => import('./nodes/6.js-DdmLZRKB.js')),
			__memo(() => import('./nodes/7.js-DvOy8J-9.js')),
			__memo(() => import('./nodes/8.js-DYZKN8Nm.js')),
			__memo(() => import('./nodes/9.js-D1cam2uX.js')),
			__memo(() => import('./nodes/10.js-BZ-QM0ht.js')),
			__memo(() => import('./nodes/11.js-CO5zyIjL.js')),
			__memo(() => import('./nodes/12.js-B7HxGKPD.js')),
			__memo(() => import('./nodes/13.js-Cl7Lk0rG.js')),
			__memo(() => import('./nodes/14.js-DT_TM2xy.js')),
			__memo(() => import('./nodes/15.js-C2X12ug0.js')),
			__memo(() => import('./nodes/16.js-COtDh6h5.js')),
			__memo(() => import('./nodes/17.js-BJ0w3-s5.js')),
			__memo(() => import('./nodes/18.js-CIvwYrqC.js')),
			__memo(() => import('./nodes/19.js-BLHYzMuN.js')),
			__memo(() => import('./nodes/20.js-D19CV_fL.js')),
			__memo(() => import('./nodes/21.js-X9PJB2YV.js')),
			__memo(() => import('./nodes/22.js-iiTLIuND.js')),
			__memo(() => import('./nodes/23.js-BpYfjNIi.js')),
			__memo(() => import('./nodes/24.js-BEfdX_PF.js')),
			__memo(() => import('./nodes/25.js-DHzeKwiy.js')),
			__memo(() => import('./nodes/26.js-BeP5ExuI.js')),
			__memo(() => import('./nodes/27.js-MBuTmKPe.js')),
			__memo(() => import('./nodes/28.js-BTDZq3AF.js'))
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
//# sourceMappingURL=manifest.js-DrY6pzYb.js.map
