import { t as e } from "./index.js";
//#region node_modules/mathjax-full/js/util/PrioritizedList.js
var t = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.PrioritizedList = void 0, e.PrioritizedList = function() {
		function e() {
			this.items = [], this.items = [];
		}
		return e.prototype[Symbol.iterator] = function() {
			var e = 0, t = this.items;
			return { next: function() {
				return {
					value: t[e++],
					done: e > t.length
				};
			} };
		}, e.prototype.add = function(t, n) {
			n === void 0 && (n = e.DEFAULTPRIORITY);
			var r = this.items.length;
			do
				r--;
			while (r >= 0 && n < this.items[r].priority);
			return this.items.splice(r + 1, 0, {
				item: t,
				priority: n
			}), t;
		}, e.prototype.remove = function(e) {
			var t = this.items.length;
			do
				t--;
			while (t >= 0 && this.items[t].item !== e);
			t >= 0 && this.items.splice(t, 1);
		}, e.DEFAULTPRIORITY = 5, e;
	}();
}));
//#endregion
export { t };
