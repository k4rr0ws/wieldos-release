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
		client: {start:"_app/immutable/entry/start.uv6n3Vwq.js",app:"_app/immutable/entry/app.DSTDlMdC.js",imports:["_app/immutable/entry/start.uv6n3Vwq.js","_app/immutable/chunks/DHgxtuuK.js","_app/immutable/chunks/BKbxTPW3.js","_app/immutable/entry/app.DSTDlMdC.js","_app/immutable/chunks/BKbxTPW3.js","_app/immutable/chunks/kNaey6uv.js","_app/immutable/chunks/xihTtKlq.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js-jn6SgzD-.js')),
			__memo(() => import('./nodes/1.js-Da1Pc2tt.js')),
			__memo(() => import('./nodes/2.js-BuSTc2HF.js')),
			__memo(() => import('./nodes/3.js-jMKrJRU1.js')),
			__memo(() => import('./nodes/4.js-PskOUmVC.js')),
			__memo(() => import('./nodes/5.js-C-DDIy17.js')),
			__memo(() => import('./nodes/6.js-DzWdLgrV.js')),
			__memo(() => import('./nodes/7.js-Bq6jOPRJ.js')),
			__memo(() => import('./nodes/8.js-B66UeV3i.js')),
			__memo(() => import('./nodes/9.js-B9_vS2IL.js')),
			__memo(() => import('./nodes/10.js-A2TKFn2Y.js')),
			__memo(() => import('./nodes/11.js-BZrfqcgv.js')),
			__memo(() => import('./nodes/12.js-BSfFye86.js')),
			__memo(() => import('./nodes/13.js-Cu1vAfpF.js')),
			__memo(() => import('./nodes/14.js-nC99OKFZ.js')),
			__memo(() => import('./nodes/15.js-BRv0OBgU.js')),
			__memo(() => import('./nodes/16.js-53iWNc3P.js')),
			__memo(() => import('./nodes/17.js-DhV0Z_zG.js')),
			__memo(() => import('./nodes/18.js-CF9UbEjI.js')),
			__memo(() => import('./nodes/19.js-DtrGfhV1.js')),
			__memo(() => import('./nodes/20.js-02PVCd1y.js')),
			__memo(() => import('./nodes/21.js-mI82ixDg.js')),
			__memo(() => import('./nodes/22.js-DnYVbI3N.js')),
			__memo(() => import('./nodes/23.js-DNFakIf7.js')),
			__memo(() => import('./nodes/24.js-CLW8k6U6.js')),
			__memo(() => import('./nodes/25.js-DcONODho.js')),
			__memo(() => import('./nodes/26.js-H7M8Ffqi.js')),
			__memo(() => import('./nodes/27.js-DWfpmSIe.js')),
			__memo(() => import('./nodes/28.js-fhFFIm3D.js'))
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
				endpoint: __memo(() => import('./entries/endpoints/status/backup/_server.js-DmBLOA56.js'))
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
//# sourceMappingURL=manifest.js-C2B4MtQo.js.map
