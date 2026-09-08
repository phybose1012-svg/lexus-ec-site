import { t as e } from "./index.js";
//#region node_modules/mathjax-full/js/core/MathItem.js
var t = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.newState = e.STATE = e.AbstractMathItem = e.protoItem = void 0;
	function t(e, t, n, r, i, a, o) {
		return o === void 0 && (o = null), {
			open: e,
			math: t,
			close: n,
			n: r,
			start: { n: i },
			end: { n: a },
			display: o
		};
	}
	e.protoItem = t, e.AbstractMathItem = function() {
		function t(t, n, r, i, a) {
			r === void 0 && (r = !0), i === void 0 && (i = {
				i: 0,
				n: 0,
				delim: ""
			}), a === void 0 && (a = {
				i: 0,
				n: 0,
				delim: ""
			}), this.root = null, this.typesetRoot = null, this.metrics = {}, this.inputData = {}, this.outputData = {}, this._state = e.STATE.UNPROCESSED, this.math = t, this.inputJax = n, this.display = r, this.start = i, this.end = a, this.root = null, this.typesetRoot = null, this.metrics = {}, this.inputData = {}, this.outputData = {};
		}
		return Object.defineProperty(t.prototype, "isEscaped", {
			get: function() {
				return this.display === null;
			},
			enumerable: !1,
			configurable: !0
		}), t.prototype.render = function(e) {
			e.renderActions.renderMath(this, e);
		}, t.prototype.rerender = function(t, n) {
			n === void 0 && (n = e.STATE.RERENDER), this.state() >= n && this.state(n - 1), t.renderActions.renderMath(this, t, n);
		}, t.prototype.convert = function(t, n) {
			n === void 0 && (n = e.STATE.LAST), t.renderActions.renderConvert(this, t, n);
		}, t.prototype.compile = function(t) {
			this.state() < e.STATE.COMPILED && (this.root = this.inputJax.compile(this, t), this.state(e.STATE.COMPILED));
		}, t.prototype.typeset = function(t) {
			this.state() < e.STATE.TYPESET && (this.typesetRoot = t.outputJax[this.isEscaped ? "escaped" : "typeset"](this, t), this.state(e.STATE.TYPESET));
		}, t.prototype.updateDocument = function(e) {}, t.prototype.removeFromDocument = function(e) {
			e === void 0 && (e = !1);
		}, t.prototype.setMetrics = function(e, t, n, r, i) {
			this.metrics = {
				em: e,
				ex: t,
				containerWidth: n,
				lineWidth: r,
				scale: i
			};
		}, t.prototype.state = function(t, n) {
			return t === void 0 && (t = null), n === void 0 && (n = !1), t != null && (t < e.STATE.INSERTED && this._state >= e.STATE.INSERTED && this.removeFromDocument(n), t < e.STATE.TYPESET && this._state >= e.STATE.TYPESET && (this.outputData = {}), t < e.STATE.COMPILED && this._state >= e.STATE.COMPILED && (this.inputData = {}), this._state = t), this._state;
		}, t.prototype.reset = function(t) {
			t === void 0 && (t = !1), this.state(e.STATE.UNPROCESSED, t);
		}, t;
	}(), e.STATE = {
		UNPROCESSED: 0,
		FINDMATH: 10,
		COMPILED: 20,
		CONVERT: 100,
		METRICS: 110,
		RERENDER: 125,
		TYPESET: 150,
		INSERTED: 200,
		LAST: 1e4
	};
	function n(t, n) {
		if (t in e.STATE) throw Error("State " + t + " already exists");
		e.STATE[t] = n;
	}
	e.newState = n;
}));
//#endregion
export { t };
