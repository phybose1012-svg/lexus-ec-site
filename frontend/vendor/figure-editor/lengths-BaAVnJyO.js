import { t as e } from "./index.js";
//#region node_modules/mathjax-full/js/util/lengths.js
var t = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.px = e.emRounded = e.em = e.percent = e.length2em = e.MATHSPACE = e.RELUNITS = e.UNITS = e.BIGDIMEN = void 0, e.BIGDIMEN = 1e6, e.UNITS = {
		px: 1,
		in: 96,
		cm: 96 / 2.54,
		mm: 96 / 25.4
	}, e.RELUNITS = {
		em: 1,
		ex: .431,
		pt: 1 / 10,
		pc: 12 / 10,
		mu: 1 / 18
	}, e.MATHSPACE = {
		veryverythinmathspace: 1 / 18,
		verythinmathspace: 2 / 18,
		thinmathspace: 3 / 18,
		mediummathspace: 4 / 18,
		thickmathspace: 5 / 18,
		verythickmathspace: 6 / 18,
		veryverythickmathspace: 7 / 18,
		negativeveryverythinmathspace: -1 / 18,
		negativeverythinmathspace: -2 / 18,
		negativethinmathspace: -3 / 18,
		negativemediummathspace: -4 / 18,
		negativethickmathspace: -5 / 18,
		negativeverythickmathspace: -6 / 18,
		negativeveryverythickmathspace: -7 / 18,
		thin: .04,
		medium: .06,
		thick: .1,
		normal: 1,
		big: 2,
		small: 1 / Math.sqrt(2),
		infinity: e.BIGDIMEN
	};
	function t(t, n, r, i) {
		if (n === void 0 && (n = 0), r === void 0 && (r = 1), i === void 0 && (i = 16), typeof t != "string" && (t = String(t)), t === "" || t == null) return n;
		if (e.MATHSPACE[t]) return e.MATHSPACE[t];
		var a = t.match(/^\s*([-+]?(?:\.\d+|\d+(?:\.\d*)?))?(pt|em|ex|mu|px|pc|in|mm|cm|%)?/);
		if (!a) return n;
		var o = parseFloat(a[1] || "1"), s = a[2];
		return e.UNITS.hasOwnProperty(s) ? o * e.UNITS[s] / i / r : e.RELUNITS.hasOwnProperty(s) ? o * e.RELUNITS[s] : s === "%" ? o / 100 * n : o * n;
	}
	e.length2em = t;
	function n(e) {
		return (100 * e).toFixed(1).replace(/\.?0+$/, "") + "%";
	}
	e.percent = n;
	function r(e) {
		return Math.abs(e) < .001 ? "0" : e.toFixed(3).replace(/\.?0+$/, "") + "em";
	}
	e.em = r;
	function i(e, t) {
		return t === void 0 && (t = 16), e = (Math.round(e * t) + .05) / t, Math.abs(e) < .001 ? "0em" : e.toFixed(3).replace(/\.?0+$/, "") + "em";
	}
	e.emRounded = i;
	function a(t, n, r) {
		return n === void 0 && (n = -e.BIGDIMEN), r === void 0 && (r = 16), t *= r, n && t < n && (t = n), Math.abs(t) < .1 ? "0" : t.toFixed(1).replace(/\.0$/, "") + "px";
	}
	e.px = a;
}));
//#endregion
export { t };
