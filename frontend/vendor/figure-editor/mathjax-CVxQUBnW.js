import { t as __commonJSMin } from "./index.js";
import { t as require_PrioritizedList } from "./PrioritizedList-D16v7yMr.js";
//#region node_modules/mathjax-full/js/components/version.js
var require_version = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: !0 }), exports.VERSION = void 0, exports.VERSION = typeof PACKAGE_VERSION > "u" ? (function() {
		var load = eval("require"), dirname = eval("__dirname"), path = load("path");
		return load(path.resolve(dirname, "..", "..", "package.json")).version;
	})() : PACKAGE_VERSION;
})), require_HandlerList = /* @__PURE__ */ __commonJSMin(((e) => {
	var t = e && e.__extends || (function() {
		var e = function(t, n) {
			return e = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, t) {
				e.__proto__ = t;
			} || function(e, t) {
				for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
			}, e(t, n);
		};
		return function(t, n) {
			if (typeof n != "function" && n !== null) throw TypeError("Class extends value " + String(n) + " is not a constructor or null");
			e(t, n);
			function r() {
				this.constructor = t;
			}
			t.prototype = n === null ? Object.create(n) : (r.prototype = n.prototype, new r());
		};
	})(), n = e && e.__values || function(e) {
		var t = typeof Symbol == "function" && Symbol.iterator, n = t && e[t], r = 0;
		if (n) return n.call(e);
		if (e && typeof e.length == "number") return { next: function() {
			return e && r >= e.length && (e = void 0), {
				value: e && e[r++],
				done: !e
			};
		} };
		throw TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.HandlerList = void 0, e.HandlerList = function(e) {
		t(r, e);
		function r() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return r.prototype.register = function(e) {
			return this.add(e, e.priority);
		}, r.prototype.unregister = function(e) {
			this.remove(e);
		}, r.prototype.handlesDocument = function(e) {
			var t, r;
			try {
				for (var i = n(this), a = i.next(); !a.done; a = i.next()) {
					var o = a.value.item;
					if (o.handlesDocument(e)) return o;
				}
			} catch (e) {
				t = { error: e };
			} finally {
				try {
					a && !a.done && (r = i.return) && r.call(i);
				} finally {
					if (t) throw t.error;
				}
			}
			throw Error("Can't find handler for document");
		}, r.prototype.document = function(e, t) {
			return t === void 0 && (t = null), this.handlesDocument(e).create(e, t);
		}, r;
	}(require_PrioritizedList().PrioritizedList);
})), require_Retries = /* @__PURE__ */ __commonJSMin(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.retryAfter = e.handleRetriesFor = void 0;
	function t(e) {
		return new Promise(function t(n, r) {
			try {
				n(e());
			} catch (e) {
				e.retry && e.retry instanceof Promise ? e.retry.then(function() {
					return t(n, r);
				}).catch(function(e) {
					return r(e);
				}) : e.restart && e.restart.isCallback ? MathJax.Callback.After(function() {
					return t(n, r);
				}, e.restart) : r(e);
			}
		});
	}
	e.handleRetriesFor = t;
	function n(e) {
		var t = /* @__PURE__ */ Error("MathJax retry");
		throw t.retry = e, t;
	}
	e.retryAfter = n;
})), require_mathjax = /* @__PURE__ */ __commonJSMin(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.mathjax = void 0;
	var t = require_version(), n = require_HandlerList(), r = require_Retries();
	e.mathjax = {
		version: t.VERSION,
		handlers: new n.HandlerList(),
		document: function(t, n) {
			return e.mathjax.handlers.document(t, n);
		},
		handleRetriesFor: r.handleRetriesFor,
		retryAfter: r.retryAfter,
		asyncLoad: null
	};
}));
//#endregion
export { require_Retries as n, require_mathjax as t };
