var SvelteSet = globalThis.Set;
var SvelteMap = globalThis.Map;
var MediaQuery = class {
	current;
	/**
	* @param {string} query
	* @param {boolean} [matches]
	*/
	constructor(query, matches = false) {
		this.current = matches;
	}
};
/**
* @param {any} _
*/
function createSubscriber(_) {
	return () => {};
}

export { MediaQuery as M, SvelteMap as S, SvelteSet as a, createSubscriber as c };
//# sourceMappingURL=index-server2.js-UaiofxX-.js.map
