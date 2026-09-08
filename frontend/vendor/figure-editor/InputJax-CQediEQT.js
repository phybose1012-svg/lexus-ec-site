import { t as e } from "./index.js";
import { c as t, s as n } from "./mo-Dc4wDYuI.js";
//#region node_modules/mathjax-full/js/core/InputJax.js
var r = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.AbstractInputJax = void 0;
	var r = t(), i = n();
	e.AbstractInputJax = function() {
		function e(e) {
			e === void 0 && (e = {}), this.adaptor = null, this.mmlFactory = null;
			var t = this.constructor;
			this.options = (0, r.userOptions)((0, r.defaultOptions)({}, t.OPTIONS), e), this.preFilters = new i.FunctionList(), this.postFilters = new i.FunctionList();
		}
		return Object.defineProperty(e.prototype, "name", {
			get: function() {
				return this.constructor.NAME;
			},
			enumerable: !1,
			configurable: !0
		}), e.prototype.setAdaptor = function(e) {
			this.adaptor = e;
		}, e.prototype.setMmlFactory = function(e) {
			this.mmlFactory = e;
		}, e.prototype.initialize = function() {}, e.prototype.reset = function() {}, Object.defineProperty(e.prototype, "processStrings", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), e.prototype.findMath = function(e, t) {
			return [];
		}, e.prototype.executeFilters = function(e, t, n, r) {
			var i = {
				math: t,
				document: n,
				data: r
			};
			return e.execute(i), i.data;
		}, e.NAME = "generic", e.OPTIONS = {}, e;
	}();
}));
//#endregion
export { r as t };
