import { t as e } from "./index.js";
import { n as t, t as n } from "./mathjax-CVxQUBnW.js";
import { t as r } from "./PrioritizedList-D16v7yMr.js";
import { c as i, i as a, o, r as s, s as c, t as l } from "./mo-Dc4wDYuI.js";
import { t as u } from "./lengths-BaAVnJyO.js";
//#region node_modules/mathjax-full/js/input/tex/NodeUtil.js
var d = /* @__PURE__ */ e(((e) => {
	var t = e && e.__values || function(e) {
		var t = typeof Symbol == "function" && Symbol.iterator, n = t && e[t], r = 0;
		if (n) return n.call(e);
		if (e && typeof e.length == "number") return { next: function() {
			return e && r >= e.length && (e = void 0), {
				value: e && e[r++],
				done: !e
			};
		} };
		throw TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
	}, n = e && e.__read || function(e, t) {
		var n = typeof Symbol == "function" && e[Symbol.iterator];
		if (!n) return e;
		var r = n.call(e), i, a = [], o;
		try {
			for (; (t === void 0 || t-- > 0) && !(i = r.next()).done;) a.push(i.value);
		} catch (e) {
			o = { error: e };
		} finally {
			try {
				i && !i.done && (n = r.return) && n.call(r);
			} finally {
				if (o) throw o.error;
			}
		}
		return a;
	}, r = e && e.__spreadArray || function(e, t, n) {
		if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++) (a || !(r in t)) && (a ||= Array.prototype.slice.call(t, 0, r), a[r] = t[r]);
		return e.concat(a || Array.prototype.slice.call(t));
	};
	Object.defineProperty(e, "__esModule", { value: !0 });
	var i = a(), o = l(), s;
	(function(e) {
		var a = new Map([
			["autoOP", !0],
			["fnOP", !0],
			["movesupsub", !0],
			["subsupOK", !0],
			["texprimestyle", !0],
			["useHeight", !0],
			["variantForm", !0],
			["withDelims", !0],
			["mathaccent", !0],
			["open", !0],
			["close", !0]
		]);
		function s(e) {
			return String.fromCodePoint(parseInt(e, 16));
		}
		e.createEntity = s;
		function c(e) {
			return e.childNodes;
		}
		e.getChildren = c;
		function l(e) {
			return e.getText();
		}
		e.getText = l;
		function u(e, n) {
			var r, i;
			try {
				for (var a = t(n), o = a.next(); !o.done; o = a.next()) {
					var s = o.value;
					e.appendChild(s);
				}
			} catch (e) {
				r = { error: e };
			} finally {
				try {
					o && !o.done && (i = a.return) && i.call(a);
				} finally {
					if (r) throw r.error;
				}
			}
		}
		e.appendChildren = u;
		function d(e, t, n) {
			e.attributes.set(t, n);
		}
		e.setAttribute = d;
		function f(e, t, n) {
			e.setProperty(t, n);
		}
		e.setProperty = f;
		function p(e, n) {
			var r, i;
			try {
				for (var o = t(Object.keys(n)), s = o.next(); !s.done; s = o.next()) {
					var c = s.value, l = n[c];
					c === "texClass" ? (e.texClass = l, e.setProperty(c, l)) : c === "movablelimits" ? (e.setProperty("movablelimits", l), (e.isKind("mo") || e.isKind("mstyle")) && e.attributes.set("movablelimits", l)) : c === "inferred" || (a.has(c) ? e.setProperty(c, l) : e.attributes.set(c, l));
				}
			} catch (e) {
				r = { error: e };
			} finally {
				try {
					s && !s.done && (i = o.return) && i.call(o);
				} finally {
					if (r) throw r.error;
				}
			}
		}
		e.setProperties = p;
		function m(e, t) {
			return e.getProperty(t);
		}
		e.getProperty = m;
		function h(e, t) {
			return e.attributes.get(t);
		}
		e.getAttribute = h;
		function g(e) {
			var t = [...arguments].slice(1);
			e.removeProperty.apply(e, r([], n(t), !1));
		}
		e.removeProperties = g;
		function _(e, t) {
			return e.childNodes[t];
		}
		e.getChildAt = _;
		function v(e, t, n) {
			var r = e.childNodes;
			r[t] = n, n && (n.parent = e);
		}
		e.setChild = v;
		function y(e, t) {
			for (var n = e.childNodes, r = 0; r < n.length; r++) v(t, r, n[r]);
		}
		e.copyChildren = y;
		function b(e, t) {
			t.attributes = e.attributes, p(t, e.getAllProperties());
		}
		e.copyAttributes = b;
		function x(e, t) {
			return e.isKind(t);
		}
		e.isType = x;
		function S(e) {
			return e.isEmbellished;
		}
		e.isEmbellished = S;
		function C(e) {
			return e.texClass;
		}
		e.getTexClass = C;
		function w(e) {
			return e.coreMO();
		}
		e.getCoreMO = w;
		function T(e) {
			return e instanceof i.AbstractMmlNode || e instanceof i.AbstractMmlEmptyNode;
		}
		e.isNode = T;
		function E(e) {
			return e.isInferred;
		}
		e.isInferred = E;
		function D(e) {
			var n, r;
			if (!x(e, "mo")) return null;
			var i = e, a = i.getForms();
			try {
				for (var s = t(a), c = s.next(); !c.done; c = s.next()) {
					var l = c.value, u = o.MmlMo.OPTABLE[l][i.getText()];
					if (u) return u;
				}
			} catch (e) {
				n = { error: e };
			} finally {
				try {
					c && !c.done && (r = s.return) && r.call(s);
				} finally {
					if (n) throw n.error;
				}
			}
			return null;
		}
		e.getForm = D;
	})(s ||= {}), e.default = s;
})), f = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.default = function() {
		function e(t, n) {
			var r = [...arguments].slice(2);
			this.id = t, this.message = e.processString(n, r);
		}
		return e.processString = function(t, n) {
			for (var r = t.split(e.pattern), i = 1, a = r.length; i < a; i += 2) {
				var o = r[i].charAt(0);
				o >= "0" && o <= "9" ? (r[i] = n[parseInt(r[i], 10) - 1], typeof r[i] == "number" && (r[i] = r[i].toString())) : o === "{" && (o = r[i].substr(1), o >= "0" && o <= "9" ? (r[i] = n[parseInt(r[i].substr(1, r[i].length - 2), 10) - 1], typeof r[i] == "number" && (r[i] = r[i].toString())) : r[i].match(/^\{([a-z]+):%(\d+)\|(.*)\}$/) && (r[i] = "%" + r[i])), r[i] ?? (r[i] = "???");
			}
			return r.join("");
		}, e.pattern = /%(\d+|\{\d+\}|\{[a-z]+:\%\d+(?:\|(?:%\{\d+\}|%.|[^\}])*)+\}|.)/g, e;
	}();
})), p = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.asyncLoad = void 0;
	var t = n();
	function r(e) {
		return t.mathjax.asyncLoad ? new Promise(function(n, r) {
			var i = t.mathjax.asyncLoad(e);
			i instanceof Promise ? i.then(function(e) {
				return n(e);
			}).catch(function(e) {
				return r(e);
			}) : n(i);
		}) : Promise.reject(`Can't load '${e}': No asyncLoad method specified`);
	}
	e.asyncLoad = r;
})), m = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.numeric = e.translate = e.remove = e.add = e.entities = e.options = void 0;
	var n = t(), r = p();
	e.options = { loadMissingEntities: !0 }, e.entities = {
		ApplyFunction: "⁡",
		Backslash: "∖",
		Because: "∵",
		Breve: "˘",
		Cap: "⋒",
		CenterDot: "·",
		CircleDot: "⊙",
		CircleMinus: "⊖",
		CirclePlus: "⊕",
		CircleTimes: "⊗",
		Congruent: "≡",
		ContourIntegral: "∮",
		Coproduct: "∐",
		Cross: "⨯",
		Cup: "⋓",
		CupCap: "≍",
		Dagger: "‡",
		Del: "∇",
		Delta: "Δ",
		Diamond: "⋄",
		DifferentialD: "ⅆ",
		DotEqual: "≐",
		DoubleDot: "¨",
		DoubleRightTee: "⊨",
		DoubleVerticalBar: "∥",
		DownArrow: "↓",
		DownLeftVector: "↽",
		DownRightVector: "⇁",
		DownTee: "⊤",
		Downarrow: "⇓",
		Element: "∈",
		EqualTilde: "≂",
		Equilibrium: "⇌",
		Exists: "∃",
		ExponentialE: "ⅇ",
		FilledVerySmallSquare: "▪",
		ForAll: "∀",
		Gamma: "Γ",
		Gg: "⋙",
		GreaterEqual: "≥",
		GreaterEqualLess: "⋛",
		GreaterFullEqual: "≧",
		GreaterLess: "≷",
		GreaterSlantEqual: "⩾",
		GreaterTilde: "≳",
		Hacek: "ˇ",
		Hat: "^",
		HumpDownHump: "≎",
		HumpEqual: "≏",
		Im: "ℑ",
		ImaginaryI: "ⅈ",
		Integral: "∫",
		Intersection: "⋂",
		InvisibleComma: "⁣",
		InvisibleTimes: "⁢",
		Lambda: "Λ",
		Larr: "↞",
		LeftAngleBracket: "⟨",
		LeftArrow: "←",
		LeftArrowRightArrow: "⇆",
		LeftCeiling: "⌈",
		LeftDownVector: "⇃",
		LeftFloor: "⌊",
		LeftRightArrow: "↔",
		LeftTee: "⊣",
		LeftTriangle: "⊲",
		LeftTriangleEqual: "⊴",
		LeftUpVector: "↿",
		LeftVector: "↼",
		Leftarrow: "⇐",
		Leftrightarrow: "⇔",
		LessEqualGreater: "⋚",
		LessFullEqual: "≦",
		LessGreater: "≶",
		LessSlantEqual: "⩽",
		LessTilde: "≲",
		Ll: "⋘",
		Lleftarrow: "⇚",
		LongLeftArrow: "⟵",
		LongLeftRightArrow: "⟷",
		LongRightArrow: "⟶",
		Longleftarrow: "⟸",
		Longleftrightarrow: "⟺",
		Longrightarrow: "⟹",
		Lsh: "↰",
		MinusPlus: "∓",
		NestedGreaterGreater: "≫",
		NestedLessLess: "≪",
		NotDoubleVerticalBar: "∦",
		NotElement: "∉",
		NotEqual: "≠",
		NotExists: "∄",
		NotGreater: "≯",
		NotGreaterEqual: "≱",
		NotLeftTriangle: "⋪",
		NotLeftTriangleEqual: "⋬",
		NotLess: "≮",
		NotLessEqual: "≰",
		NotPrecedes: "⊀",
		NotPrecedesSlantEqual: "⋠",
		NotRightTriangle: "⋫",
		NotRightTriangleEqual: "⋭",
		NotSubsetEqual: "⊈",
		NotSucceeds: "⊁",
		NotSucceedsSlantEqual: "⋡",
		NotSupersetEqual: "⊉",
		NotTilde: "≁",
		NotVerticalBar: "∤",
		Omega: "Ω",
		OverBar: "‾",
		OverBrace: "⏞",
		PartialD: "∂",
		Phi: "Φ",
		Pi: "Π",
		PlusMinus: "±",
		Precedes: "≺",
		PrecedesEqual: "⪯",
		PrecedesSlantEqual: "≼",
		PrecedesTilde: "≾",
		Product: "∏",
		Proportional: "∝",
		Psi: "Ψ",
		Rarr: "↠",
		Re: "ℜ",
		ReverseEquilibrium: "⇋",
		RightAngleBracket: "⟩",
		RightArrow: "→",
		RightArrowLeftArrow: "⇄",
		RightCeiling: "⌉",
		RightDownVector: "⇂",
		RightFloor: "⌋",
		RightTee: "⊢",
		RightTeeArrow: "↦",
		RightTriangle: "⊳",
		RightTriangleEqual: "⊵",
		RightUpVector: "↾",
		RightVector: "⇀",
		Rightarrow: "⇒",
		Rrightarrow: "⇛",
		Rsh: "↱",
		Sigma: "Σ",
		SmallCircle: "∘",
		Sqrt: "√",
		Square: "□",
		SquareIntersection: "⊓",
		SquareSubset: "⊏",
		SquareSubsetEqual: "⊑",
		SquareSuperset: "⊐",
		SquareSupersetEqual: "⊒",
		SquareUnion: "⊔",
		Star: "⋆",
		Subset: "⋐",
		SubsetEqual: "⊆",
		Succeeds: "≻",
		SucceedsEqual: "⪰",
		SucceedsSlantEqual: "≽",
		SucceedsTilde: "≿",
		SuchThat: "∋",
		Sum: "∑",
		Superset: "⊃",
		SupersetEqual: "⊇",
		Supset: "⋑",
		Therefore: "∴",
		Theta: "Θ",
		Tilde: "∼",
		TildeEqual: "≃",
		TildeFullEqual: "≅",
		TildeTilde: "≈",
		UnderBar: "_",
		UnderBrace: "⏟",
		Union: "⋃",
		UnionPlus: "⊎",
		UpArrow: "↑",
		UpDownArrow: "↕",
		UpTee: "⊥",
		Uparrow: "⇑",
		Updownarrow: "⇕",
		Upsilon: "Υ",
		Vdash: "⊩",
		Vee: "⋁",
		VerticalBar: "∣",
		VerticalTilde: "≀",
		Vvdash: "⊪",
		Wedge: "⋀",
		Xi: "Ξ",
		amp: "&",
		acute: "´",
		aleph: "ℵ",
		alpha: "α",
		amalg: "⨿",
		and: "∧",
		ang: "∠",
		angmsd: "∡",
		angsph: "∢",
		ape: "≊",
		backprime: "‵",
		backsim: "∽",
		backsimeq: "⋍",
		beta: "β",
		beth: "ℶ",
		between: "≬",
		bigcirc: "◯",
		bigodot: "⨀",
		bigoplus: "⨁",
		bigotimes: "⨂",
		bigsqcup: "⨆",
		bigstar: "★",
		bigtriangledown: "▽",
		bigtriangleup: "△",
		biguplus: "⨄",
		blacklozenge: "⧫",
		blacktriangle: "▴",
		blacktriangledown: "▾",
		blacktriangleleft: "◂",
		bowtie: "⋈",
		boxdl: "┐",
		boxdr: "┌",
		boxminus: "⊟",
		boxplus: "⊞",
		boxtimes: "⊠",
		boxul: "┘",
		boxur: "└",
		bsol: "\\",
		bull: "•",
		cap: "∩",
		check: "✓",
		chi: "χ",
		circ: "ˆ",
		circeq: "≗",
		circlearrowleft: "↺",
		circlearrowright: "↻",
		circledR: "®",
		circledS: "Ⓢ",
		circledast: "⊛",
		circledcirc: "⊚",
		circleddash: "⊝",
		clubs: "♣",
		colon: ":",
		comp: "∁",
		ctdot: "⋯",
		cuepr: "⋞",
		cuesc: "⋟",
		cularr: "↶",
		cup: "∪",
		curarr: "↷",
		curlyvee: "⋎",
		curlywedge: "⋏",
		dagger: "†",
		daleth: "ℸ",
		ddarr: "⇊",
		deg: "°",
		delta: "δ",
		digamma: "ϝ",
		div: "÷",
		divideontimes: "⋇",
		dot: "˙",
		doteqdot: "≑",
		dotplus: "∔",
		dotsquare: "⊡",
		dtdot: "⋱",
		ecir: "≖",
		efDot: "≒",
		egs: "⪖",
		ell: "ℓ",
		els: "⪕",
		empty: "∅",
		epsi: "ε",
		epsiv: "ϵ",
		erDot: "≓",
		eta: "η",
		eth: "ð",
		flat: "♭",
		fork: "⋔",
		frown: "⌢",
		gEl: "⪌",
		gamma: "γ",
		gap: "⪆",
		gimel: "ℷ",
		gnE: "≩",
		gnap: "⪊",
		gne: "⪈",
		gnsim: "⋧",
		gt: ">",
		gtdot: "⋗",
		harrw: "↭",
		hbar: "ℏ",
		hellip: "…",
		hookleftarrow: "↩",
		hookrightarrow: "↪",
		imath: "ı",
		infin: "∞",
		intcal: "⊺",
		iota: "ι",
		jmath: "ȷ",
		kappa: "κ",
		kappav: "ϰ",
		lEg: "⪋",
		lambda: "λ",
		lap: "⪅",
		larrlp: "↫",
		larrtl: "↢",
		lbrace: "{",
		lbrack: "[",
		le: "≤",
		leftleftarrows: "⇇",
		leftthreetimes: "⋋",
		lessdot: "⋖",
		lmoust: "⎰",
		lnE: "≨",
		lnap: "⪉",
		lne: "⪇",
		lnsim: "⋦",
		longmapsto: "⟼",
		looparrowright: "↬",
		lowast: "∗",
		loz: "◊",
		lt: "<",
		ltimes: "⋉",
		ltri: "◃",
		macr: "¯",
		malt: "✠",
		mho: "℧",
		mu: "μ",
		multimap: "⊸",
		nLeftarrow: "⇍",
		nLeftrightarrow: "⇎",
		nRightarrow: "⇏",
		nVDash: "⊯",
		nVdash: "⊮",
		natur: "♮",
		nearr: "↗",
		nharr: "↮",
		nlarr: "↚",
		not: "¬",
		nrarr: "↛",
		nu: "ν",
		nvDash: "⊭",
		nvdash: "⊬",
		nwarr: "↖",
		omega: "ω",
		omicron: "ο",
		or: "∨",
		osol: "⊘",
		period: ".",
		phi: "φ",
		phiv: "ϕ",
		pi: "π",
		piv: "ϖ",
		prap: "⪷",
		precnapprox: "⪹",
		precneqq: "⪵",
		precnsim: "⋨",
		prime: "′",
		psi: "ψ",
		quot: "\"",
		rarrtl: "↣",
		rbrace: "}",
		rbrack: "]",
		rho: "ρ",
		rhov: "ϱ",
		rightrightarrows: "⇉",
		rightthreetimes: "⋌",
		ring: "˚",
		rmoust: "⎱",
		rtimes: "⋊",
		rtri: "▹",
		scap: "⪸",
		scnE: "⪶",
		scnap: "⪺",
		scnsim: "⋩",
		sdot: "⋅",
		searr: "↘",
		sect: "§",
		sharp: "♯",
		sigma: "σ",
		sigmav: "ς",
		simne: "≆",
		smile: "⌣",
		spades: "♠",
		sub: "⊂",
		subE: "⫅",
		subnE: "⫋",
		subne: "⊊",
		supE: "⫆",
		supnE: "⫌",
		supne: "⊋",
		swarr: "↙",
		tau: "τ",
		theta: "θ",
		thetav: "ϑ",
		tilde: "˜",
		times: "×",
		triangle: "▵",
		triangleq: "≜",
		upsi: "υ",
		upuparrows: "⇈",
		veebar: "⊻",
		vellip: "⋮",
		weierp: "℘",
		xi: "ξ",
		yen: "¥",
		zeta: "ζ",
		zigrarr: "⇝",
		nbsp: "\xA0",
		rsquo: "’",
		lsquo: "‘"
	};
	var i = {};
	function a(t, n) {
		Object.assign(e.entities, t), i[n] = !0;
	}
	e.add = a;
	function o(t) {
		delete e.entities[t];
	}
	e.remove = o;
	function s(e) {
		return e.replace(/&([a-z][a-z0-9]*|#(?:[0-9]+|x[0-9a-f]+));/gi, c);
	}
	e.translate = s;
	function c(t, a) {
		if (a.charAt(0) === "#") return l(a.slice(1));
		if (e.entities[a]) return e.entities[a];
		if (e.options.loadMissingEntities) {
			var o = a.match(/^[a-zA-Z](fr|scr|opf)$/) ? RegExp.$1 : a.charAt(0).toLowerCase();
			i[o] || (i[o] = !0, (0, n.retryAfter)((0, r.asyncLoad)("./util/entities/" + o + ".js")));
		}
		return t;
	}
	function l(e) {
		var t = e.charAt(0) === "x" ? parseInt(e.slice(1), 16) : parseInt(e);
		return String.fromCodePoint(t);
	}
	e.numeric = l;
})), h = /* @__PURE__ */ e(((e) => {
	var t = e && e.__read || function(e, t) {
		var n = typeof Symbol == "function" && e[Symbol.iterator];
		if (!n) return e;
		var r = n.call(e), i, a = [], o;
		try {
			for (; (t === void 0 || t-- > 0) && !(i = r.next()).done;) a.push(i.value);
		} catch (e) {
			o = { error: e };
		} finally {
			try {
				i && !i.done && (n = r.return) && n.call(r);
			} finally {
				if (o) throw o.error;
			}
		}
		return a;
	}, n = e && e.__values || function(e) {
		var t = typeof Symbol == "function" && Symbol.iterator, n = t && e[t], r = 0;
		if (n) return n.call(e);
		if (e && typeof e.length == "number") return { next: function() {
			return e && r >= e.length && (e = void 0), {
				value: e && e[r++],
				done: !e
			};
		} };
		throw TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
	}, r = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 });
	var i = a(), o = r(d()), s = r(_()), c = r(f()), l = m(), u;
	(function(e) {
		var r = 7.2, a = 72, u = {
			em: function(e) {
				return e;
			},
			ex: function(e) {
				return e * .43;
			},
			pt: function(e) {
				return e / 10;
			},
			pc: function(e) {
				return e * 1.2;
			},
			px: function(e) {
				return e * r / a;
			},
			in: function(e) {
				return e * r;
			},
			cm: function(e) {
				return e * r / 2.54;
			},
			mm: function(e) {
				return e * r / 25.4;
			},
			mu: function(e) {
				return e / 18;
			}
		}, d = "([-+]?([.,]\\d+|\\d+([.,]\\d*)?))", f = "(pt|em|ex|mu|px|mm|cm|in|pc)", p = RegExp("^\\s*" + d + "\\s*" + f + "\\s*$"), m = RegExp("^\\s*" + d + "\\s*" + f + " ?");
		function h(e, t) {
			t === void 0 && (t = !1);
			var n = e.match(t ? m : p);
			return n ? g([
				n[1].replace(/,/, "."),
				n[4],
				n[0].length
			]) : [
				null,
				null,
				0
			];
		}
		e.matchDimen = h;
		function g(e) {
			var n = t(e, 3), r = n[0], i = n[1], a = n[2];
			return i === "mu" ? [
				v(u[i](parseFloat(r || "1"))).slice(0, -2),
				"em",
				a
			] : [
				r,
				i,
				a
			];
		}
		function _(e) {
			var n = t(h(e), 2), r = n[0], i = n[1], a = parseFloat(r || "1"), o = u[i];
			return o ? o(a) : 0;
		}
		e.dimen2em = _;
		function v(e) {
			return Math.abs(e) < 6e-4 ? "0em" : e.toFixed(3).replace(/\.?0+$/, "") + "em";
		}
		e.Em = v;
		function y() {
			return [...arguments].map(function(e) {
				return v(e);
			}).join(" ");
		}
		e.cols = y;
		function b(e, t, n, r, a, c) {
			a === void 0 && (a = ""), c === void 0 && (c = "");
			var l = e.nodeFactory, u = l.create("node", "mrow", [], {
				open: t,
				close: r,
				texClass: i.TEXCLASS.INNER
			}), d;
			if (a) d = new s.default("\\" + a + "l" + t, e.parser.stack.env, e).mml();
			else {
				var f = l.create("text", t);
				d = l.create("node", "mo", [], {
					fence: !0,
					stretchy: !0,
					symmetric: !0,
					texClass: i.TEXCLASS.OPEN
				}, f);
			}
			if (o.default.appendChildren(u, [d, n]), a) d = new s.default("\\" + a + "r" + r, e.parser.stack.env, e).mml();
			else {
				var p = l.create("text", r);
				d = l.create("node", "mo", [], {
					fence: !0,
					stretchy: !0,
					symmetric: !0,
					texClass: i.TEXCLASS.CLOSE
				}, p);
			}
			return c && d.attributes.set("mathcolor", c), o.default.appendChildren(u, [d]), u;
		}
		e.fenced = b;
		function x(e, t, n, r) {
			var a = e.nodeFactory.create("node", "mrow", [], {
				open: t,
				close: r,
				texClass: i.TEXCLASS.ORD
			});
			return t && o.default.appendChildren(a, [S(e, t, "l")]), o.default.isType(n, "mrow") ? o.default.appendChildren(a, o.default.getChildren(n)) : o.default.appendChildren(a, [n]), r && o.default.appendChildren(a, [S(e, r, "r")]), a;
		}
		e.fixedFence = x;
		function S(e, t, n) {
			(t === "{" || t === "}") && (t = "\\" + t);
			var r = "{\\bigg" + n + " " + t + "}", i = "{\\big" + n + " " + t + "}";
			return new s.default("\\mathchoice" + r + i + i + i, {}, e).mml();
		}
		e.mathPalette = S;
		function C(e, t) {
			for (var n = 0, r = t.length; n < r; n++) {
				var a = t[n];
				if (a && !o.default.isType(a, "mspace") && (!o.default.isType(a, "TeXAtom") || o.default.getChildren(a)[0] && o.default.getChildren(o.default.getChildren(a)[0]).length)) {
					if (o.default.isEmbellished(a) || o.default.isType(a, "TeXAtom") && o.default.getTexClass(a) === i.TEXCLASS.REL) {
						var s = e.nodeFactory.create("node", "mi");
						t.unshift(s);
					}
					break;
				}
			}
		}
		e.fixInitialMO = C;
		function w(e, t, n, r) {
			if (e.configuration.options.internalMath) return e.configuration.options.internalMath(e, t, n, r);
			var i = r || e.stack.env.font, a = i ? { mathvariant: i } : {}, o = [], l = 0, u = 0, d, f, p = "", m = 0;
			if (t.match(/\\?[${}\\]|\\\(|\\(eq)?ref\s*\{/)) {
				for (; l < t.length;) if (d = t.charAt(l++), d === "$") p === "$" && m === 0 ? (f = e.create("node", "TeXAtom", [new s.default(t.slice(u, l - 1), {}, e.configuration).mml()]), o.push(f), p = "", u = l) : p === "" && (u < l - 1 && o.push(T(e, t.slice(u, l - 1), a)), p = "$", u = l);
				else if (d === "{" && p !== "") m++;
				else if (d === "}") if (p === "}" && m === 0) {
					var h = new s.default(t.slice(u, l), {}, e.configuration).mml();
					f = e.create("node", "TeXAtom", [h], a), o.push(f), p = "", u = l;
				} else p !== "" && m && m--;
				else if (d === "\\") if (p === "" && t.substr(l).match(/^(eq)?ref\s*\{/)) {
					var g = RegExp["$&"].length;
					u < l - 1 && o.push(T(e, t.slice(u, l - 1), a)), p = "}", u = l - 1, l += g;
				} else d = t.charAt(l++), d === "(" && p === "" ? (u < l - 2 && o.push(T(e, t.slice(u, l - 2), a)), p = ")", u = l) : d === ")" && p === ")" && m === 0 ? (f = e.create("node", "TeXAtom", [new s.default(t.slice(u, l - 2), {}, e.configuration).mml()]), o.push(f), p = "", u = l) : d.match(/[${}\\]/) && p === "" && (l--, t = t.substr(0, l - 1) + t.substr(l));
				if (p !== "") throw new c.default("MathNotTerminated", "Math not terminated in text box");
			}
			return u < t.length && o.push(T(e, t.slice(u), a)), n == null ? o.length > 1 && (o = [e.create("node", "mrow", o)]) : o = [e.create("node", "mstyle", o, {
				displaystyle: !1,
				scriptlevel: n
			})], o;
		}
		e.internalMath = w;
		function T(e, t, n) {
			t = t.replace(/^\s+/, l.entities.nbsp).replace(/\s+$/, l.entities.nbsp);
			var r = e.create("text", t);
			return e.create("node", "mtext", [], n, r);
		}
		e.internalText = T;
		function E(t, n, r, a, s) {
			if (e.checkMovableLimits(n), o.default.isType(n, "munderover") && o.default.isEmbellished(n)) {
				o.default.setProperties(o.default.getCoreMO(n), {
					lspace: 0,
					rspace: 0
				});
				var c = t.create("node", "mo", [], { rspace: 0 });
				n = t.create("node", "mrow", [c, n]);
			}
			var l = t.create("node", "munderover", [n]);
			o.default.setChild(l, a === "over" ? l.over : l.under, r);
			var u = l;
			return s && (u = t.create("node", "TeXAtom", [l], {
				texClass: i.TEXCLASS.OP,
				movesupsub: !0
			})), o.default.setProperty(u, "subsupOK", !0), u;
		}
		e.underOver = E;
		function D(e) {
			var t = o.default.isType(e, "mo") ? o.default.getForm(e) : null;
			(o.default.getProperty(e, "movablelimits") || t && t[3] && t[3].movablelimits) && o.default.setProperties(e, { movablelimits: !1 });
		}
		e.checkMovableLimits = D;
		function O(e) {
			if (typeof e != "string") return e;
			var t = e.trim();
			return t.match(/\\$/) && e.match(/ $/) && (t += " "), t;
		}
		e.trimSpaces = O;
		function k(t, n) {
			return n = e.trimSpaces(n || ""), n === "t" ? t.arraydef.align = "baseline 1" : n === "b" ? t.arraydef.align = "baseline -1" : n === "c" ? t.arraydef.align = "axis" : n && (t.arraydef.align = n), t;
		}
		e.setArrayAlign = k;
		function A(e, t, n) {
			for (var r = "", i = "", a = 0; a < n.length;) {
				var o = n.charAt(a++);
				if (o === "\\") r += o + n.charAt(a++);
				else if (o === "#") if (o = n.charAt(a++), o === "#") r += o;
				else {
					if (!o.match(/[1-9]/) || parseInt(o, 10) > t.length) throw new c.default("IllegalMacroParam", "Illegal macro parameter reference");
					i = j(e, j(e, i, r), t[parseInt(o, 10) - 1]), r = "";
				}
				else r += o;
			}
			return j(e, i, r);
		}
		e.substituteArgs = A;
		function j(e, t, n) {
			if (n.match(/^[a-z]/i) && t.match(/(^|[^\\])(\\\\)*\\[a-z]+$/i) && (t += " "), t.length + n.length > e.configuration.options.maxBuffer) throw new c.default("MaxBufferSize", "MathJax internal buffer size exceeded; is there a recursive macro call?");
			return t + n;
		}
		e.addArgs = j;
		function M(e, t) {
			if (t === void 0 && (t = !0), !(++e.macroCount <= e.configuration.options.maxMacros)) throw t ? new c.default("MaxMacroSub1", "MathJax maximum macro substitution count exceeded; is here a recursive macro call?") : new c.default("MaxMacroSub2", "MathJax maximum substitution count exceeded; is there a recursive latex environment?");
		}
		e.checkMaxMacros = M;
		function N(e) {
			if (e.stack.global.eqnenv) throw new c.default("ErroneousNestingEq", "Erroneous nesting of equation structures");
			e.stack.global.eqnenv = !0;
		}
		e.checkEqnEnv = N;
		function P(e, t) {
			var r = e.copy(), i = t.configuration;
			return r.walkTree(function(e) {
				var t, r;
				i.addNode(e.kind, e);
				var a = (e.getProperty("in-lists") || "").split(/,/);
				try {
					for (var o = n(a), s = o.next(); !s.done; s = o.next()) {
						var c = s.value;
						c && i.addNode(c, e);
					}
				} catch (e) {
					t = { error: e };
				} finally {
					try {
						s && !s.done && (r = o.return) && r.call(o);
					} finally {
						if (t) throw t.error;
					}
				}
			}), r;
		}
		e.copyNode = P;
		function F(e, t, n) {
			return n;
		}
		e.MmlFilterAttribute = F;
		function I(e) {
			var t = e.stack.env.font;
			return t ? { mathvariant: t } : {};
		}
		e.getFontDef = I;
		function L(e, t, r) {
			var i, a;
			t === void 0 && (t = null), r === void 0 && (r = !1);
			var o = R(e);
			if (t) try {
				for (var s = n(Object.keys(o)), l = s.next(); !l.done; l = s.next()) {
					var u = l.value;
					if (!t.hasOwnProperty(u)) {
						if (r) throw new c.default("InvalidOption", "Invalid option: %1", u);
						delete o[u];
					}
				}
			} catch (e) {
				i = { error: e };
			} finally {
				try {
					l && !l.done && (a = s.return) && a.call(s);
				} finally {
					if (i) throw i.error;
				}
			}
			return o;
		}
		e.keyvalOptions = L;
		function R(e) {
			for (var n, r, i = {}, a = e, o, s, c; a;) n = t(B(a, ["=", ","]), 3), s = n[0], o = n[1], a = n[2], o === "=" ? (r = t(B(a, [","]), 3), c = r[0], o = r[1], a = r[2], c = c === "false" || c === "true" ? JSON.parse(c) : c, i[s] = c) : s && (i[s] = !0);
			return i;
		}
		function z(e, t) {
			for (; t > 0;) e = e.trim().slice(1, -1), t--;
			return e.trim();
		}
		function B(e, t) {
			for (var n = e.length, r = 0, i = "", a = 0, o = 0, s = !0, l = !1; a < n;) {
				var u = e[a++];
				switch (u) {
					case " ": break;
					case "{":
						s ? o++ : (l = !1, o > r && (o = r)), r++;
						break;
					case "}":
						r && r--, (s || l) && (o--, l = !0), s = !1;
						break;
					default:
						if (!r && t.indexOf(u) !== -1) return [
							l ? "true" : z(i, o),
							u,
							e.slice(a)
						];
						s = !1, l = !1;
				}
				i += u;
			}
			if (r) throw new c.default("ExtraOpenMissingClose", "Extra open brace or missing close brace");
			return [
				l ? "true" : z(i, o),
				"",
				e.slice(a)
			];
		}
	})(u ||= {}), e.default = u;
})), g = /* @__PURE__ */ e(((e) => {
	var t = e && e.__values || function(e) {
		var t = typeof Symbol == "function" && Symbol.iterator, n = t && e[t], r = 0;
		if (n) return n.call(e);
		if (e && typeof e.length == "number") return { next: function() {
			return e && r >= e.length && (e = void 0), {
				value: e && e[r++],
				done: !e
			};
		} };
		throw TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
	}, n = e && e.__read || function(e, t) {
		var n = typeof Symbol == "function" && e[Symbol.iterator];
		if (!n) return e;
		var r = n.call(e), i, a = [], o;
		try {
			for (; (t === void 0 || t-- > 0) && !(i = r.next()).done;) a.push(i.value);
		} catch (e) {
			o = { error: e };
		} finally {
			try {
				i && !i.done && (n = r.return) && n.call(r);
			} finally {
				if (o) throw o.error;
			}
		}
		return a;
	}, r = e && e.__spreadArray || function(e, t, n) {
		if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++) (a || !(r in t)) && (a ||= Array.prototype.slice.call(t, 0, r), a[r] = t[r]);
		return e.concat(a || Array.prototype.slice.call(t));
	}, i = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 });
	var a = i(d());
	e.default = function() {
		function e(e, t, n) {
			this._factory = e, this._env = t, this.global = {}, this.stack = [], this.global = { isInner: n }, this.stack = [this._factory.create("start", this.global)], t && (this.stack[0].env = t), this.env = this.stack[0].env;
		}
		return Object.defineProperty(e.prototype, "env", {
			get: function() {
				return this._env;
			},
			set: function(e) {
				this._env = e;
			},
			enumerable: !1,
			configurable: !0
		}), e.prototype.Push = function() {
			for (var e, i, o = [], s = 0; s < arguments.length; s++) o[s] = arguments[s];
			try {
				for (var c = t(o), l = c.next(); !l.done; l = c.next()) {
					var u = l.value;
					if (u) {
						var d = a.default.isNode(u) ? this._factory.create("mml", u) : u;
						d.global = this.global;
						var f = n(this.stack.length ? this.Top().checkItem(d) : [null, !0], 2), p = f[0];
						if (f[1]) {
							if (p) {
								this.Pop(), this.Push.apply(this, r([], n(p), !1));
								continue;
							}
							this.stack.push(d), d.env ? (d.copyEnv && Object.assign(d.env, this.env), this.env = d.env) : d.env = this.env;
						}
					}
				}
			} catch (t) {
				e = { error: t };
			} finally {
				try {
					l && !l.done && (i = c.return) && i.call(c);
				} finally {
					if (e) throw e.error;
				}
			}
		}, e.prototype.Pop = function() {
			var e = this.stack.pop();
			return e.isOpen || delete e.env, this.env = this.stack.length ? this.Top().env : {}, e;
		}, e.prototype.Top = function(e) {
			return e === void 0 && (e = 1), this.stack.length < e ? null : this.stack[this.stack.length - e];
		}, e.prototype.Prev = function(e) {
			var t = this.Top();
			return e ? t.First : t.Pop();
		}, e.prototype.toString = function() {
			return "stack[\n  " + this.stack.join("\n  ") + "\n]";
		}, e;
	}();
})), _ = /* @__PURE__ */ e(((e) => {
	var t = e && e.__values || function(e) {
		var t = typeof Symbol == "function" && Symbol.iterator, n = t && e[t], r = 0;
		if (n) return n.call(e);
		if (e && typeof e.length == "number") return { next: function() {
			return e && r >= e.length && (e = void 0), {
				value: e && e[r++],
				done: !e
			};
		} };
		throw TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
	}, n = e && e.__read || function(e, t) {
		var n = typeof Symbol == "function" && e[Symbol.iterator];
		if (!n) return e;
		var r = n.call(e), i, a = [], o;
		try {
			for (; (t === void 0 || t-- > 0) && !(i = r.next()).done;) a.push(i.value);
		} catch (e) {
			o = { error: e };
		} finally {
			try {
				i && !i.done && (n = r.return) && n.call(r);
			} finally {
				if (o) throw o.error;
			}
		}
		return a;
	}, r = e && e.__spreadArray || function(e, t, n) {
		if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++) (a || !(r in t)) && (a ||= Array.prototype.slice.call(t, 0, r), a[r] = t[r]);
		return e.concat(a || Array.prototype.slice.call(t));
	}, i = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 });
	var o = i(h()), s = i(g()), c = i(f()), l = a();
	e.default = function() {
		function e(e, n, r) {
			var i, a;
			this._string = e, this.configuration = r, this.macroCount = 0, this.i = 0, this.currentCS = "";
			var o = n.hasOwnProperty("isInner"), c = n.isInner;
			delete n.isInner;
			var l;
			if (n) {
				l = {};
				try {
					for (var u = t(Object.keys(n)), d = u.next(); !d.done; d = u.next()) {
						var f = d.value;
						l[f] = n[f];
					}
				} catch (e) {
					i = { error: e };
				} finally {
					try {
						d && !d.done && (a = u.return) && a.call(u);
					} finally {
						if (i) throw i.error;
					}
				}
			}
			this.configuration.pushParser(this), this.stack = new s.default(this.itemFactory, l, o ? c : !0), this.Parse(), this.Push(this.itemFactory.create("stop"));
		}
		return Object.defineProperty(e.prototype, "options", {
			get: function() {
				return this.configuration.options;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(e.prototype, "itemFactory", {
			get: function() {
				return this.configuration.itemFactory;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(e.prototype, "tags", {
			get: function() {
				return this.configuration.tags;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(e.prototype, "string", {
			get: function() {
				return this._string;
			},
			set: function(e) {
				this._string = e;
			},
			enumerable: !1,
			configurable: !0
		}), e.prototype.parse = function(e, t) {
			return this.configuration.handlers.get(e).parse(t);
		}, e.prototype.lookup = function(e, t) {
			return this.configuration.handlers.get(e).lookup(t);
		}, e.prototype.contains = function(e, t) {
			return this.configuration.handlers.get(e).contains(t);
		}, e.prototype.toString = function() {
			var e, n, r = "";
			try {
				for (var i = t(Array.from(this.configuration.handlers.keys())), a = i.next(); !a.done; a = i.next()) {
					var o = a.value;
					r += o + ": " + this.configuration.handlers.get(o) + "\n";
				}
			} catch (t) {
				e = { error: t };
			} finally {
				try {
					a && !a.done && (n = i.return) && n.call(i);
				} finally {
					if (e) throw e.error;
				}
			}
			return r;
		}, e.prototype.Parse = function() {
			for (var e; this.i < this.string.length;) e = this.getCodePoint(), this.i += e.length, this.parse("character", [this, e]);
		}, e.prototype.Push = function(e) {
			e instanceof l.AbstractMmlNode && e.isInferred ? this.PushAll(e.childNodes) : this.stack.Push(e);
		}, e.prototype.PushAll = function(e) {
			var n, r;
			try {
				for (var i = t(e), a = i.next(); !a.done; a = i.next()) {
					var o = a.value;
					this.stack.Push(o);
				}
			} catch (e) {
				n = { error: e };
			} finally {
				try {
					a && !a.done && (r = i.return) && r.call(i);
				} finally {
					if (n) throw n.error;
				}
			}
		}, e.prototype.mml = function() {
			if (!this.stack.Top().isKind("mml")) return null;
			var e = this.stack.Top().First;
			return this.configuration.popParser(), e;
		}, e.prototype.convertDelimiter = function(e) {
			var t = this.lookup("delimiter", e);
			return t ? t.char : null;
		}, e.prototype.getCodePoint = function() {
			var e = this.string.codePointAt(this.i);
			return e === void 0 ? "" : String.fromCodePoint(e);
		}, e.prototype.nextIsSpace = function() {
			return !!this.string.charAt(this.i).match(/\s/);
		}, e.prototype.GetNext = function() {
			for (; this.nextIsSpace();) this.i++;
			return this.getCodePoint();
		}, e.prototype.GetCS = function() {
			var e = this.string.slice(this.i).match(/^(([a-z]+) ?|[\uD800-\uDBFF].|.)/i);
			return e ? (this.i += e[0].length, e[2] || e[1]) : (this.i++, " ");
		}, e.prototype.GetArgument = function(e, t) {
			switch (this.GetNext()) {
				case "":
					if (!t) throw new c.default("MissingArgFor", "Missing argument for %1", this.currentCS);
					return null;
				case "}":
					if (!t) throw new c.default("ExtraCloseMissingOpen", "Extra close brace or missing open brace");
					return null;
				case "\\": return this.i++, "\\" + this.GetCS();
				case "{":
					for (var n = ++this.i, r = 1; this.i < this.string.length;) switch (this.string.charAt(this.i++)) {
						case "\\":
							this.i++;
							break;
						case "{":
							r++;
							break;
						case "}":
							if (--r === 0) return this.string.slice(n, this.i - 1);
							break;
					}
					throw new c.default("MissingCloseBrace", "Missing close brace");
			}
			var i = this.getCodePoint();
			return this.i += i.length, i;
		}, e.prototype.GetBrackets = function(e, t) {
			if (this.GetNext() !== "[") return t;
			for (var n = ++this.i, r = 0; this.i < this.string.length;) switch (this.string.charAt(this.i++)) {
				case "{":
					r++;
					break;
				case "\\":
					this.i++;
					break;
				case "}":
					if (r-- <= 0) throw new c.default("ExtraCloseLooking", "Extra close brace while looking for %1", "']'");
					break;
				case "]":
					if (r === 0) return this.string.slice(n, this.i - 1);
					break;
			}
			throw new c.default("MissingCloseBracket", "Could not find closing ']' for argument to %1", this.currentCS);
		}, e.prototype.GetDelimiter = function(e, t) {
			var n = this.GetNext();
			if (this.i += n.length, this.i <= this.string.length && (n === "\\" ? n += this.GetCS() : n === "{" && t && (this.i--, n = this.GetArgument(e).trim()), this.contains("delimiter", n))) return this.convertDelimiter(n);
			throw new c.default("MissingOrUnrecognizedDelim", "Missing or unrecognized delimiter for %1", this.currentCS);
		}, e.prototype.GetDimen = function(e) {
			if (this.GetNext() === "{") {
				var t = this.GetArgument(e), r = n(o.default.matchDimen(t), 2), i = r[0], a = r[1];
				if (i) return i + a;
			} else {
				var t = this.string.slice(this.i), s = n(o.default.matchDimen(t, !0), 3), i = s[0], a = s[1], l = s[2];
				if (i) return this.i += l, i + a;
			}
			throw new c.default("MissingDimOrUnits", "Missing dimension or its units for %1", this.currentCS);
		}, e.prototype.GetUpTo = function(e, t) {
			for (; this.nextIsSpace();) this.i++;
			for (var n = this.i, r = 0; this.i < this.string.length;) {
				var i = this.i, a = this.GetNext();
				switch (this.i += a.length, a) {
					case "\\":
						a += this.GetCS();
						break;
					case "{":
						r++;
						break;
					case "}":
						if (r === 0) throw new c.default("ExtraCloseLooking", "Extra close brace while looking for %1", t);
						r--;
						break;
				}
				if (r === 0 && a === t) return this.string.slice(n, i);
			}
			throw new c.default("TokenNotFoundForCommand", "Could not find %1 for %2", t, this.currentCS);
		}, e.prototype.ParseArg = function(t) {
			return new e(this.GetArgument(t), this.stack.env, this.configuration).mml();
		}, e.prototype.ParseUpTo = function(t, n) {
			return new e(this.GetUpTo(t, n), this.stack.env, this.configuration).mml();
		}, e.prototype.GetDelimiterArg = function(e) {
			var t = o.default.trimSpaces(this.GetArgument(e));
			if (t === "") return null;
			if (this.contains("delimiter", t)) return t;
			throw new c.default("MissingOrUnrecognizedDelim", "Missing or unrecognized delimiter for %1", this.currentCS);
		}, e.prototype.GetStar = function() {
			var e = this.GetNext() === "*";
			return e && this.i++, e;
		}, e.prototype.create = function(e) {
			for (var t, i = [], a = 1; a < arguments.length; a++) i[a - 1] = arguments[a];
			return (t = this.configuration.nodeFactory).create.apply(t, r([e], n(i), !1));
		}, e;
	}();
})), v = /* @__PURE__ */ e(((e) => {
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
	})(), n = e && e.__read || function(e, t) {
		var n = typeof Symbol == "function" && e[Symbol.iterator];
		if (!n) return e;
		var r = n.call(e), i, a = [], o;
		try {
			for (; (t === void 0 || t-- > 0) && !(i = r.next()).done;) a.push(i.value);
		} catch (e) {
			o = { error: e };
		} finally {
			try {
				i && !i.done && (n = r.return) && n.call(r);
			} finally {
				if (o) throw o.error;
			}
		}
		return a;
	}, r = e && e.__spreadArray || function(e, t, n) {
		if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++) (a || !(r in t)) && (a ||= Array.prototype.slice.call(t, 0, r), a[r] = t[r]);
		return e.concat(a || Array.prototype.slice.call(t));
	}, i = e && e.__values || function(e) {
		var t = typeof Symbol == "function" && Symbol.iterator, n = t && e[t], r = 0;
		if (n) return n.call(e);
		if (e && typeof e.length == "number") return { next: function() {
			return e && r >= e.length && (e = void 0), {
				value: e && e[r++],
				done: !e
			};
		} };
		throw TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
	}, a = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.BaseItem = e.MmlStack = void 0;
	var o = a(f()), s = function() {
		function e(e) {
			this._nodes = e;
		}
		return Object.defineProperty(e.prototype, "nodes", {
			get: function() {
				return this._nodes;
			},
			enumerable: !1,
			configurable: !0
		}), e.prototype.Push = function() {
			for (var e, t = [], i = 0; i < arguments.length; i++) t[i] = arguments[i];
			(e = this._nodes).push.apply(e, r([], n(t), !1));
		}, e.prototype.Pop = function() {
			return this._nodes.pop();
		}, Object.defineProperty(e.prototype, "First", {
			get: function() {
				return this._nodes[this.Size() - 1];
			},
			set: function(e) {
				this._nodes[this.Size() - 1] = e;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(e.prototype, "Last", {
			get: function() {
				return this._nodes[0];
			},
			set: function(e) {
				this._nodes[0] = e;
			},
			enumerable: !1,
			configurable: !0
		}), e.prototype.Peek = function(e) {
			return e ??= 1, this._nodes.slice(this.Size() - e);
		}, e.prototype.Size = function() {
			return this._nodes.length;
		}, e.prototype.Clear = function() {
			this._nodes = [];
		}, e.prototype.toMml = function(e, t) {
			return e === void 0 && (e = !0), this._nodes.length === 1 && !t ? this.First : this.create("node", e ? "inferredMrow" : "mrow", this._nodes, {});
		}, e.prototype.create = function(e) {
			for (var t, i = [], a = 1; a < arguments.length; a++) i[a - 1] = arguments[a];
			return (t = this.factory.configuration.nodeFactory).create.apply(t, r([e], n(i), !1));
		}, e;
	}();
	e.MmlStack = s, e.BaseItem = function(e) {
		t(r, e);
		function r(t) {
			var n = [...arguments].slice(1), r = e.call(this, n) || this;
			return r.factory = t, r.global = {}, r._properties = {}, r.isOpen && (r._env = {}), r;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "base";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "env", {
			get: function() {
				return this._env;
			},
			set: function(e) {
				this._env = e;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "copyEnv", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.getProperty = function(e) {
			return this._properties[e];
		}, r.prototype.setProperty = function(e, t) {
			return this._properties[e] = t, this;
		}, Object.defineProperty(r.prototype, "isOpen", {
			get: function() {
				return !1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "isClose", {
			get: function() {
				return !1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "isFinal", {
			get: function() {
				return !1;
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.isKind = function(e) {
			return e === this.kind;
		}, r.prototype.checkItem = function(e) {
			if (e.isKind("over") && this.isOpen && (e.setProperty("num", this.toMml(!1)), this.Clear()), e.isKind("cell") && this.isOpen) {
				if (e.getProperty("linebreak")) return r.fail;
				throw new o.default("Misplaced", "Misplaced %1", e.getName());
			}
			if (e.isClose && this.getErrors(e.kind)) {
				var t = n(this.getErrors(e.kind), 2), i = t[0], a = t[1];
				throw new o.default(i, a, e.getName());
			}
			return e.isFinal ? (this.Push(e.First), r.fail) : r.success;
		}, r.prototype.clearEnv = function() {
			var e, t;
			try {
				for (var n = i(Object.keys(this.env)), r = n.next(); !r.done; r = n.next()) {
					var a = r.value;
					delete this.env[a];
				}
			} catch (t) {
				e = { error: t };
			} finally {
				try {
					r && !r.done && (t = n.return) && t.call(n);
				} finally {
					if (e) throw e.error;
				}
			}
		}, r.prototype.setProperties = function(e) {
			return Object.assign(this._properties, e), this;
		}, r.prototype.getName = function() {
			return this.getProperty("name");
		}, r.prototype.toString = function() {
			return this.kind + "[" + this.nodes.join("; ") + "]";
		}, r.prototype.getErrors = function(e) {
			return (this.constructor.errors || {})[e] || r.errors[e];
		}, r.fail = [null, !1], r.success = [null, !0], r.errors = {
			end: ["MissingBeginExtraEnd", "Missing \\begin{%1} or extra \\end{%1}"],
			close: ["ExtraCloseMissingOpen", "Extra close brace or missing open brace"],
			right: ["MissingLeftExtraRight", "Missing \\left or extra \\right"],
			middle: ["ExtraMiddle", "Extra \\middle"]
		}, r;
	}(s);
})), y = /* @__PURE__ */ e(((e) => {
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
	})(), n;
	Object.defineProperty(e, "__esModule", { value: !0 });
	var r = v(), i = o(), a = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return n;
	}(r.BaseItem);
	e.default = function(e) {
		t(r, e);
		function r() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.defaultKind = "dummy", t.configuration = null, t;
		}
		return r.DefaultStackItems = (n = {}, n[a.prototype.kind] = a, n), r;
	}(i.AbstractFactory);
})), b = /* @__PURE__ */ e(((e) => {
	var t = e && e.__read || function(e, t) {
		var n = typeof Symbol == "function" && e[Symbol.iterator];
		if (!n) return e;
		var r = n.call(e), i, a = [], o;
		try {
			for (; (t === void 0 || t-- > 0) && !(i = r.next()).done;) a.push(i.value);
		} catch (e) {
			o = { error: e };
		} finally {
			try {
				i && !i.done && (n = r.return) && n.call(r);
			} finally {
				if (o) throw o.error;
			}
		}
		return a;
	}, n = e && e.__spreadArray || function(e, t, n) {
		if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++) (a || !(r in t)) && (a ||= Array.prototype.slice.call(t, 0, r), a[r] = t[r]);
		return e.concat(a || Array.prototype.slice.call(t));
	}, r = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.NodeFactory = void 0;
	var i = r(d());
	e.NodeFactory = function() {
		function e() {
			this.mmlFactory = null, this.factory = {
				node: e.createNode,
				token: e.createToken,
				text: e.createText,
				error: e.createError
			};
		}
		return e.createNode = function(e, t, n, r, a) {
			n === void 0 && (n = []), r === void 0 && (r = {});
			var o = e.mmlFactory.create(t);
			return o.setChildren(n), a && o.appendChild(a), i.default.setProperties(o, r), o;
		}, e.createToken = function(e, t, n, r) {
			n === void 0 && (n = {}), r === void 0 && (r = "");
			var i = e.create("text", r);
			return e.create("node", t, [], n, i);
		}, e.createText = function(e, t) {
			return t == null ? null : e.mmlFactory.create("text").setText(t);
		}, e.createError = function(e, t) {
			var n = e.create("text", t), r = e.create("node", "mtext", [], {}, n);
			return e.create("node", "merror", [r], { "data-mjx-error": t });
		}, e.prototype.setMmlFactory = function(e) {
			this.mmlFactory = e;
		}, e.prototype.set = function(e, t) {
			this.factory[e] = t;
		}, e.prototype.setCreators = function(e) {
			for (var t in e) this.set(t, e[t]);
		}, e.prototype.create = function(e) {
			var r = [...arguments].slice(1), i = (this.factory[e] || this.factory.node).apply(void 0, n([this, r[0]], t(r.slice(1)), !1));
			return e === "node" && this.configuration.addNode(r[0], i), i;
		}, e.prototype.get = function(e) {
			return this.factory[e];
		}, e;
	}();
})), x = /* @__PURE__ */ e(((e) => {
	var t = e && e.__read || function(e, t) {
		var n = typeof Symbol == "function" && e[Symbol.iterator];
		if (!n) return e;
		var r = n.call(e), i, a = [], o;
		try {
			for (; (t === void 0 || t-- > 0) && !(i = r.next()).done;) a.push(i.value);
		} catch (e) {
			o = { error: e };
		} finally {
			try {
				i && !i.done && (n = r.return) && n.call(r);
			} finally {
				if (o) throw o.error;
			}
		}
		return a;
	}, n = e && e.__spreadArray || function(e, t, n) {
		if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++) (a || !(r in t)) && (a ||= Array.prototype.slice.call(t, 0, r), a[r] = t[r]);
		return e.concat(a || Array.prototype.slice.call(t));
	}, r = e && e.__values || function(e) {
		var t = typeof Symbol == "function" && Symbol.iterator, n = t && e[t], r = 0;
		if (n) return n.call(e);
		if (e && typeof e.length == "number") return { next: function() {
			return e && r >= e.length && (e = void 0), {
				value: e && e[r++],
				done: !e
			};
		} };
		throw TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
	}, a = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 });
	var o = a(y()), s = b(), c = a(d()), l = i();
	e.default = function() {
		function e(e, r) {
			r === void 0 && (r = []), this.options = {}, this.packageData = /* @__PURE__ */ new Map(), this.parsers = [], this.root = null, this.nodeLists = {}, this.error = !1, this.handlers = e.handlers, this.nodeFactory = new s.NodeFactory(), this.nodeFactory.configuration = this, this.nodeFactory.setCreators(e.nodes), this.itemFactory = new o.default(e.items), this.itemFactory.configuration = this, l.defaultOptions.apply(void 0, n([this.options], t(r), !1)), (0, l.defaultOptions)(this.options, e.options);
		}
		return e.prototype.pushParser = function(e) {
			this.parsers.unshift(e);
		}, e.prototype.popParser = function() {
			this.parsers.shift();
		}, Object.defineProperty(e.prototype, "parser", {
			get: function() {
				return this.parsers[0];
			},
			enumerable: !1,
			configurable: !0
		}), e.prototype.clear = function() {
			this.parsers = [], this.root = null, this.nodeLists = {}, this.error = !1, this.tags.resetTag();
		}, e.prototype.addNode = function(e, t) {
			var n = this.nodeLists[e];
			if (n ||= this.nodeLists[e] = [], n.push(t), t.kind !== e) {
				var r = c.default.getProperty(t, "in-lists") || "", i = (r ? r.split(/,/) : []).concat(e).join(",");
				c.default.setProperty(t, "in-lists", i);
			}
		}, e.prototype.getList = function(e) {
			var t, n, i = this.nodeLists[e] || [], a = [];
			try {
				for (var o = r(i), s = o.next(); !s.done; s = o.next()) {
					var c = s.value;
					this.inTree(c) && a.push(c);
				}
			} catch (e) {
				t = { error: e };
			} finally {
				try {
					s && !s.done && (n = o.return) && n.call(o);
				} finally {
					if (t) throw t.error;
				}
			}
			return this.nodeLists[e] = a, a;
		}, e.prototype.removeFromList = function(e, t) {
			var n, i, a = this.nodeLists[e] || [];
			try {
				for (var o = r(t), s = o.next(); !s.done; s = o.next()) {
					var c = s.value, l = a.indexOf(c);
					l >= 0 && a.splice(l, 1);
				}
			} catch (e) {
				n = { error: e };
			} finally {
				try {
					s && !s.done && (i = o.return) && i.call(o);
				} finally {
					if (n) throw n.error;
				}
			}
		}, e.prototype.inTree = function(e) {
			for (; e && e !== this.root;) e = e.parent;
			return !!e;
		}, e;
	}();
})), S = /* @__PURE__ */ e(((e) => {
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
	}, r = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.TagsFactory = e.AllTags = e.NoTags = e.AbstractTags = e.TagInfo = e.Label = void 0;
	var i = r(_()), a = function() {
		function e(e, t) {
			e === void 0 && (e = "???"), t === void 0 && (t = ""), this.tag = e, this.id = t;
		}
		return e;
	}();
	e.Label = a;
	var o = function() {
		function e(e, t, n, r, i, a, o, s) {
			e === void 0 && (e = ""), t === void 0 && (t = !1), n === void 0 && (n = !1), r === void 0 && (r = null), i === void 0 && (i = ""), a === void 0 && (a = ""), o === void 0 && (o = !1), s === void 0 && (s = ""), this.env = e, this.taggable = t, this.defaultTags = n, this.tag = r, this.tagId = i, this.tagFormat = a, this.noTag = o, this.labelId = s;
		}
		return e;
	}();
	e.TagInfo = o;
	var s = function() {
		function e() {
			this.counter = 0, this.allCounter = 0, this.configuration = null, this.ids = {}, this.allIds = {}, this.labels = {}, this.allLabels = {}, this.redo = !1, this.refUpdate = !1, this.currentTag = new o(), this.history = [], this.stack = [], this.enTag = function(e, t) {
				var n = this.configuration.nodeFactory, r = n.create("node", "mtd", [e]), i = n.create("node", "mlabeledtr", [t, r]);
				return n.create("node", "mtable", [i], {
					side: this.configuration.options.tagSide,
					minlabelspacing: this.configuration.options.tagIndent,
					displaystyle: !0
				});
			};
		}
		return e.prototype.start = function(e, t, n) {
			this.currentTag && this.stack.push(this.currentTag), this.currentTag = new o(e, t, n);
		}, Object.defineProperty(e.prototype, "env", {
			get: function() {
				return this.currentTag.env;
			},
			enumerable: !1,
			configurable: !0
		}), e.prototype.end = function() {
			this.history.push(this.currentTag), this.currentTag = this.stack.pop();
		}, e.prototype.tag = function(e, t) {
			this.currentTag.tag = e, this.currentTag.tagFormat = t ? e : this.formatTag(e), this.currentTag.noTag = !1;
		}, e.prototype.notag = function() {
			this.tag("", !0), this.currentTag.noTag = !0;
		}, Object.defineProperty(e.prototype, "noTag", {
			get: function() {
				return this.currentTag.noTag;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(e.prototype, "label", {
			get: function() {
				return this.currentTag.labelId;
			},
			set: function(e) {
				this.currentTag.labelId = e;
			},
			enumerable: !1,
			configurable: !0
		}), e.prototype.formatUrl = function(e, t) {
			return t + "#" + encodeURIComponent(e);
		}, e.prototype.formatTag = function(e) {
			return "(" + e + ")";
		}, e.prototype.formatId = function(e) {
			return "mjx-eqn:" + e.replace(/\s/g, "_");
		}, e.prototype.formatNumber = function(e) {
			return e.toString();
		}, e.prototype.autoTag = function() {
			this.currentTag.tag ?? (this.counter++, this.tag(this.formatNumber(this.counter), !1));
		}, e.prototype.clearTag = function() {
			this.label = "", this.tag(null, !0), this.currentTag.tagId = "";
		}, e.prototype.getTag = function(e) {
			if (e === void 0 && (e = !1), e) return this.autoTag(), this.makeTag();
			var t = this.currentTag;
			return t.taggable && !t.noTag && (t.defaultTags && this.autoTag(), t.tag) ? this.makeTag() : null;
		}, e.prototype.resetTag = function() {
			this.history = [], this.redo = !1, this.refUpdate = !1, this.clearTag();
		}, e.prototype.reset = function(e) {
			e === void 0 && (e = 0), this.resetTag(), this.counter = this.allCounter = e, this.allLabels = {}, this.allIds = {};
		}, e.prototype.startEquation = function(e) {
			this.history = [], this.stack = [], this.clearTag(), this.currentTag = new o("", void 0, void 0), this.labels = {}, this.ids = {}, this.counter = this.allCounter, this.redo = !1;
			var t = e.inputData.recompile;
			t && (this.refUpdate = !0, this.counter = t.counter);
		}, e.prototype.finishEquation = function(e) {
			this.redo && (e.inputData.recompile = {
				state: e.state(),
				counter: this.allCounter
			}), this.refUpdate || (this.allCounter = this.counter), Object.assign(this.allIds, this.ids), Object.assign(this.allLabels, this.labels);
		}, e.prototype.finalize = function(e, t) {
			if (!t.display || this.currentTag.env || this.currentTag.tag == null) return e;
			var n = this.makeTag();
			return this.enTag(e, n);
		}, e.prototype.makeId = function() {
			this.currentTag.tagId = this.formatId(this.configuration.options.useLabelIds && this.label || this.currentTag.tag);
		}, e.prototype.makeTag = function() {
			this.makeId(), this.label && (this.labels[this.label] = new a(this.currentTag.tag, this.currentTag.tagId));
			var e = new i.default("\\text{" + this.currentTag.tagFormat + "}", {}, this.configuration).mml();
			return this.configuration.nodeFactory.create("node", "mtd", [e], { id: this.currentTag.tagId });
		}, e;
	}();
	e.AbstractTags = s;
	var c = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return n.prototype.autoTag = function() {}, n.prototype.getTag = function() {
			return this.currentTag.tag ? e.prototype.getTag.call(this) : null;
		}, n;
	}(s);
	e.NoTags = c;
	var l = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return n.prototype.finalize = function(e, t) {
			if (!t.display || this.history.find(function(e) {
				return e.taggable;
			})) return e;
			var n = this.getTag(!0);
			return this.enTag(e, n);
		}, n;
	}(s);
	e.AllTags = l, (function(e) {
		var t = new Map([["none", c], ["all", l]]), r = "none";
		e.OPTIONS = {
			tags: r,
			tagSide: "right",
			tagIndent: "0.8em",
			useLabelIds: !0,
			ignoreDuplicateLabels: !1
		}, e.add = function(e, n) {
			t.set(e, n);
		}, e.addTags = function(t) {
			var r, i;
			try {
				for (var a = n(Object.keys(t)), o = a.next(); !o.done; o = a.next()) {
					var s = o.value;
					e.add(s, t[s]);
				}
			} catch (e) {
				r = { error: e };
			} finally {
				try {
					o && !o.done && (i = a.return) && i.call(a);
				} finally {
					if (r) throw r.error;
				}
			}
		}, e.create = function(e) {
			var n = t.get(e) || t.get(r);
			if (!n) throw Error("Unknown tags class");
			return new n();
		}, e.setDefault = function(e) {
			r = e;
		}, e.getDefault = function() {
			return e.create(r);
		};
	})(e.TagsFactory ||= {});
})), C = /* @__PURE__ */ e(((e) => {
	var t = e && e.__values || function(e) {
		var t = typeof Symbol == "function" && Symbol.iterator, n = t && e[t], r = 0;
		if (n) return n.call(e);
		if (e && typeof e.length == "number") return { next: function() {
			return e && r >= e.length && (e = void 0), {
				value: e && e[r++],
				done: !e
			};
		} };
		throw TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
	}, n = e && e.__read || function(e, t) {
		var n = typeof Symbol == "function" && e[Symbol.iterator];
		if (!n) return e;
		var r = n.call(e), i, a = [], o;
		try {
			for (; (t === void 0 || t-- > 0) && !(i = r.next()).done;) a.push(i.value);
		} catch (e) {
			o = { error: e };
		} finally {
			try {
				i && !i.done && (n = r.return) && n.call(r);
			} finally {
				if (o) throw o.error;
			}
		}
		return a;
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.SubHandlers = e.SubHandler = e.MapHandler = void 0;
	var i = r(), a = c(), o;
	(function(e) {
		var t = /* @__PURE__ */ new Map();
		e.register = function(e) {
			t.set(e.name, e);
		}, e.getMap = function(e) {
			return t.get(e);
		};
	})(o = e.MapHandler ||= {});
	var s = function() {
		function e() {
			this._configuration = new i.PrioritizedList(), this._fallback = new a.FunctionList();
		}
		return e.prototype.add = function(e, n, r) {
			var a, s;
			r === void 0 && (r = i.PrioritizedList.DEFAULTPRIORITY);
			try {
				for (var c = t(e.slice().reverse()), l = c.next(); !l.done; l = c.next()) {
					var u = l.value, d = o.getMap(u);
					if (!d) {
						this.warn("Configuration " + u + " not found! Omitted.");
						return;
					}
					this._configuration.add(d, r);
				}
			} catch (e) {
				a = { error: e };
			} finally {
				try {
					l && !l.done && (s = c.return) && s.call(c);
				} finally {
					if (a) throw a.error;
				}
			}
			n && this._fallback.add(n, r);
		}, e.prototype.parse = function(e) {
			var r, i;
			try {
				for (var a = t(this._configuration), o = a.next(); !o.done; o = a.next()) {
					var s = o.value.item.parse(e);
					if (s) return s;
				}
			} catch (e) {
				r = { error: e };
			} finally {
				try {
					o && !o.done && (i = a.return) && i.call(a);
				} finally {
					if (r) throw r.error;
				}
			}
			var c = n(e, 2), l = c[0], u = c[1];
			Array.from(this._fallback)[0].item(l, u);
		}, e.prototype.lookup = function(e) {
			var t = this.applicable(e);
			return t ? t.lookup(e) : null;
		}, e.prototype.contains = function(e) {
			return !!this.applicable(e);
		}, e.prototype.toString = function() {
			var e, n, r = [];
			try {
				for (var i = t(this._configuration), a = i.next(); !a.done; a = i.next()) {
					var o = a.value.item;
					r.push(o.name);
				}
			} catch (t) {
				e = { error: t };
			} finally {
				try {
					a && !a.done && (n = i.return) && n.call(i);
				} finally {
					if (e) throw e.error;
				}
			}
			return r.join(", ");
		}, e.prototype.applicable = function(e) {
			var n, r;
			try {
				for (var i = t(this._configuration), a = i.next(); !a.done; a = i.next()) {
					var o = a.value.item;
					if (o.contains(e)) return o;
				}
			} catch (e) {
				n = { error: e };
			} finally {
				try {
					a && !a.done && (r = i.return) && r.call(i);
				} finally {
					if (n) throw n.error;
				}
			}
			return null;
		}, e.prototype.retrieve = function(e) {
			var n, r;
			try {
				for (var i = t(this._configuration), a = i.next(); !a.done; a = i.next()) {
					var o = a.value.item;
					if (o.name === e) return o;
				}
			} catch (e) {
				n = { error: e };
			} finally {
				try {
					a && !a.done && (r = i.return) && r.call(i);
				} finally {
					if (n) throw n.error;
				}
			}
			return null;
		}, e.prototype.warn = function(e) {
			console.log("TexParser Warning: " + e);
		}, e;
	}();
	e.SubHandler = s, e.SubHandlers = function() {
		function e() {
			this.map = /* @__PURE__ */ new Map();
		}
		return e.prototype.add = function(e, n, r) {
			var a, o;
			r === void 0 && (r = i.PrioritizedList.DEFAULTPRIORITY);
			try {
				for (var c = t(Object.keys(e)), l = c.next(); !l.done; l = c.next()) {
					var u = l.value, d = this.get(u);
					d || (d = new s(), this.set(u, d)), d.add(e[u], n[u], r);
				}
			} catch (e) {
				a = { error: e };
			} finally {
				try {
					l && !l.done && (o = c.return) && o.call(c);
				} finally {
					if (a) throw a.error;
				}
			}
		}, e.prototype.set = function(e, t) {
			this.map.set(e, t);
		}, e.prototype.get = function(e) {
			return this.map.get(e);
		}, e.prototype.retrieve = function(e) {
			var n, r;
			try {
				for (var i = t(this.map.values()), a = i.next(); !a.done; a = i.next()) {
					var o = a.value.retrieve(e);
					if (o) return o;
				}
			} catch (e) {
				n = { error: e };
			} finally {
				try {
					a && !a.done && (r = i.return) && r.call(i);
				} finally {
					if (n) throw n.error;
				}
			}
			return null;
		}, e.prototype.keys = function() {
			return this.map.keys();
		}, e;
	}();
})), w = /* @__PURE__ */ e(((e) => {
	var t = e && e.__values || function(e) {
		var t = typeof Symbol == "function" && Symbol.iterator, n = t && e[t], r = 0;
		if (n) return n.call(e);
		if (e && typeof e.length == "number") return { next: function() {
			return e && r >= e.length && (e = void 0), {
				value: e && e[r++],
				done: !e
			};
		} };
		throw TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
	}, n = e && e.__read || function(e, t) {
		var n = typeof Symbol == "function" && e[Symbol.iterator];
		if (!n) return e;
		var r = n.call(e), i, a = [], o;
		try {
			for (; (t === void 0 || t-- > 0) && !(i = r.next()).done;) a.push(i.value);
		} catch (e) {
			o = { error: e };
		} finally {
			try {
				i && !i.done && (n = r.return) && n.call(r);
			} finally {
				if (o) throw o.error;
			}
		}
		return a;
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.ParserConfiguration = e.ConfigurationHandler = e.Configuration = void 0;
	var a = i(), o = C(), s = c(), l = r(), u = S();
	e.Configuration = function() {
		function e(e, t, n, r, i, a, o, s, c, l, u, d, f) {
			t === void 0 && (t = {}), n === void 0 && (n = {}), r === void 0 && (r = {}), i === void 0 && (i = {}), a === void 0 && (a = {}), o === void 0 && (o = {}), s === void 0 && (s = []), c === void 0 && (c = []), l === void 0 && (l = null), u === void 0 && (u = null), this.name = e, this.handler = t, this.fallback = n, this.items = r, this.tags = i, this.options = a, this.nodes = o, this.preprocessors = s, this.postprocessors = c, this.initMethod = l, this.configMethod = u, this.priority = d, this.parser = f, this.handler = Object.assign({
				character: [],
				delimiter: [],
				macro: [],
				environment: []
			}, t);
		}
		return e.makeProcessor = function(e, t) {
			return Array.isArray(e) ? e : [e, t];
		}, e._create = function(t, n) {
			var r = this;
			n === void 0 && (n = {});
			var i = n.priority || l.PrioritizedList.DEFAULTPRIORITY, a = n.init ? this.makeProcessor(n.init, i) : null, o = n.config ? this.makeProcessor(n.config, i) : null, s = (n.preprocessors || []).map(function(e) {
				return r.makeProcessor(e, i);
			}), c = (n.postprocessors || []).map(function(e) {
				return r.makeProcessor(e, i);
			}), u = n.parser || "tex";
			return new e(t, n.handler || {}, n.fallback || {}, n.items || {}, n.tags || {}, n.options || {}, n.nodes || {}, s, c, a, o, i, u);
		}, e.create = function(t, n) {
			n === void 0 && (n = {});
			var r = e._create(t, n);
			return d.set(t, r), r;
		}, e.local = function(t) {
			return t === void 0 && (t = {}), e._create("", t);
		}, Object.defineProperty(e.prototype, "init", {
			get: function() {
				return this.initMethod ? this.initMethod[0] : null;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(e.prototype, "config", {
			get: function() {
				return this.configMethod ? this.configMethod[0] : null;
			},
			enumerable: !1,
			configurable: !0
		}), e;
	}();
	var d;
	(function(e) {
		var t = /* @__PURE__ */ new Map();
		e.set = function(e, n) {
			t.set(e, n);
		}, e.get = function(e) {
			return t.get(e);
		}, e.keys = function() {
			return t.keys();
		};
	})(d = e.ConfigurationHandler ||= {}), e.ParserConfiguration = function() {
		function e(e, n) {
			var r, i, a, c;
			n === void 0 && (n = ["tex"]), this.initMethod = new s.FunctionList(), this.configMethod = new s.FunctionList(), this.configurations = new l.PrioritizedList(), this.parsers = [], this.handlers = new o.SubHandlers(), this.items = {}, this.tags = {}, this.options = {}, this.nodes = {}, this.parsers = n;
			try {
				for (var u = t(e.slice().reverse()), d = u.next(); !d.done; d = u.next()) {
					var f = d.value;
					this.addPackage(f);
				}
			} catch (e) {
				r = { error: e };
			} finally {
				try {
					d && !d.done && (i = u.return) && i.call(u);
				} finally {
					if (r) throw r.error;
				}
			}
			try {
				for (var p = t(this.configurations), m = p.next(); !m.done; m = p.next()) {
					var h = m.value, g = h.item, _ = h.priority;
					this.append(g, _);
				}
			} catch (e) {
				a = { error: e };
			} finally {
				try {
					m && !m.done && (c = p.return) && c.call(p);
				} finally {
					if (a) throw a.error;
				}
			}
		}
		return e.prototype.init = function() {
			this.initMethod.execute(this);
		}, e.prototype.config = function(e) {
			var n, r;
			this.configMethod.execute(this, e);
			try {
				for (var i = t(this.configurations), a = i.next(); !a.done; a = i.next()) {
					var o = a.value;
					this.addFilters(e, o.item);
				}
			} catch (e) {
				n = { error: e };
			} finally {
				try {
					a && !a.done && (r = i.return) && r.call(i);
				} finally {
					if (n) throw n.error;
				}
			}
		}, e.prototype.addPackage = function(e) {
			var t = typeof e == "string" ? e : e[0], n = this.getPackage(t);
			n && this.configurations.add(n, typeof e == "string" ? n.priority : e[1]);
		}, e.prototype.add = function(e, n, r) {
			var i, o;
			r === void 0 && (r = {});
			var s = this.getPackage(e);
			this.append(s), this.configurations.add(s, s.priority), this.init();
			var c = n.parseOptions;
			c.nodeFactory.setCreators(s.nodes);
			try {
				for (var l = t(Object.keys(s.items)), d = l.next(); !d.done; d = l.next()) {
					var f = d.value;
					c.itemFactory.setNodeClass(f, s.items[f]);
				}
			} catch (e) {
				i = { error: e };
			} finally {
				try {
					d && !d.done && (o = l.return) && o.call(l);
				} finally {
					if (i) throw i.error;
				}
			}
			u.TagsFactory.addTags(s.tags), (0, a.defaultOptions)(c.options, s.options), (0, a.userOptions)(c.options, r), this.addFilters(n, s), s.config && s.config(this, n);
		}, e.prototype.getPackage = function(e) {
			var t = d.get(e);
			if (t && this.parsers.indexOf(t.parser) < 0) throw Error(`Package ${e} doesn't target the proper parser`);
			return t;
		}, e.prototype.append = function(e, t) {
			t ||= e.priority, e.initMethod && this.initMethod.add(e.initMethod[0], e.initMethod[1]), e.configMethod && this.configMethod.add(e.configMethod[0], e.configMethod[1]), this.handlers.add(e.handler, e.fallback, t), Object.assign(this.items, e.items), Object.assign(this.tags, e.tags), (0, a.defaultOptions)(this.options, e.options), Object.assign(this.nodes, e.nodes);
		}, e.prototype.addFilters = function(e, r) {
			var i, a, o, s;
			try {
				for (var c = t(r.preprocessors), l = c.next(); !l.done; l = c.next()) {
					var u = n(l.value, 2), d = u[0], f = u[1];
					e.preFilters.add(d, f);
				}
			} catch (e) {
				i = { error: e };
			} finally {
				try {
					l && !l.done && (a = c.return) && a.call(c);
				} finally {
					if (i) throw i.error;
				}
			}
			try {
				for (var p = t(r.postprocessors), m = p.next(); !m.done; m = p.next()) {
					var h = n(m.value, 2), g = h[0], f = h[1];
					e.postFilters.add(g, f);
				}
			} catch (e) {
				o = { error: e };
			} finally {
				try {
					m && !m.done && (s = p.return) && s.call(p);
				} finally {
					if (o) throw o.error;
				}
			}
		}, e;
	}();
})), T = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.Macro = e.Symbol = void 0, e.Symbol = function() {
		function e(e, t, n) {
			this._symbol = e, this._char = t, this._attributes = n;
		}
		return Object.defineProperty(e.prototype, "symbol", {
			get: function() {
				return this._symbol;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(e.prototype, "char", {
			get: function() {
				return this._char;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(e.prototype, "attributes", {
			get: function() {
				return this._attributes;
			},
			enumerable: !1,
			configurable: !0
		}), e;
	}(), e.Macro = function() {
		function e(e, t, n) {
			n === void 0 && (n = []), this._symbol = e, this._func = t, this._args = n;
		}
		return Object.defineProperty(e.prototype, "symbol", {
			get: function() {
				return this._symbol;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(e.prototype, "func", {
			get: function() {
				return this._func;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(e.prototype, "args", {
			get: function() {
				return this._args;
			},
			enumerable: !1,
			configurable: !0
		}), e;
	}();
})), E = /* @__PURE__ */ e(((e) => {
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
	})(), n = e && e.__read || function(e, t) {
		var n = typeof Symbol == "function" && e[Symbol.iterator];
		if (!n) return e;
		var r = n.call(e), i, a = [], o;
		try {
			for (; (t === void 0 || t-- > 0) && !(i = r.next()).done;) a.push(i.value);
		} catch (e) {
			o = { error: e };
		} finally {
			try {
				i && !i.done && (n = r.return) && n.call(r);
			} finally {
				if (o) throw o.error;
			}
		}
		return a;
	}, r = e && e.__values || function(e) {
		var t = typeof Symbol == "function" && Symbol.iterator, n = t && e[t], r = 0;
		if (n) return n.call(e);
		if (e && typeof e.length == "number") return { next: function() {
			return e && r >= e.length && (e = void 0), {
				value: e && e[r++],
				done: !e
			};
		} };
		throw TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
	}, i = e && e.__spreadArray || function(e, t, n) {
		if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++) (a || !(r in t)) && (a ||= Array.prototype.slice.call(t, 0, r), a[r] = t[r]);
		return e.concat(a || Array.prototype.slice.call(t));
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.EnvironmentMap = e.CommandMap = e.MacroMap = e.DelimiterMap = e.CharacterMap = e.AbstractParseMap = e.RegExpMap = e.AbstractSymbolMap = e.parseResult = void 0;
	var a = T(), o = C();
	function s(e) {
		return e === void 0 ? !0 : e;
	}
	e.parseResult = s;
	var c = function() {
		function e(e, t) {
			this._name = e, this._parser = t, o.MapHandler.register(this);
		}
		return Object.defineProperty(e.prototype, "name", {
			get: function() {
				return this._name;
			},
			enumerable: !1,
			configurable: !0
		}), e.prototype.parserFor = function(e) {
			return this.contains(e) ? this.parser : null;
		}, e.prototype.parse = function(e) {
			var t = n(e, 2), r = t[0], i = t[1], a = this.parserFor(i), o = this.lookup(i);
			return a && o ? s(a(r, o)) : null;
		}, Object.defineProperty(e.prototype, "parser", {
			get: function() {
				return this._parser;
			},
			set: function(e) {
				this._parser = e;
			},
			enumerable: !1,
			configurable: !0
		}), e;
	}();
	e.AbstractSymbolMap = c, e.RegExpMap = function(e) {
		t(n, e);
		function n(t, n, r) {
			var i = e.call(this, t, n) || this;
			return i._regExp = r, i;
		}
		return n.prototype.contains = function(e) {
			return this._regExp.test(e);
		}, n.prototype.lookup = function(e) {
			return this.contains(e) ? e : null;
		}, n;
	}(c);
	var l = function(e) {
		t(n, e);
		function n() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.map = /* @__PURE__ */ new Map(), t;
		}
		return n.prototype.lookup = function(e) {
			return this.map.get(e);
		}, n.prototype.contains = function(e) {
			return this.map.has(e);
		}, n.prototype.add = function(e, t) {
			this.map.set(e, t);
		}, n.prototype.remove = function(e) {
			this.map.delete(e);
		}, n;
	}(c);
	e.AbstractParseMap = l;
	var u = function(e) {
		t(i, e);
		function i(t, i, o) {
			var s, c, l = e.call(this, t, i) || this;
			try {
				for (var u = r(Object.keys(o)), d = u.next(); !d.done; d = u.next()) {
					var f = d.value, p = o[f], m = n(typeof p == "string" ? [p, null] : p, 2), h = m[0], g = m[1], _ = new a.Symbol(f, h, g);
					l.add(f, _);
				}
			} catch (e) {
				s = { error: e };
			} finally {
				try {
					d && !d.done && (c = u.return) && c.call(u);
				} finally {
					if (s) throw s.error;
				}
			}
			return l;
		}
		return i;
	}(l);
	e.CharacterMap = u, e.DelimiterMap = function(e) {
		t(r, e);
		function r() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return r.prototype.parse = function(t) {
			var r = n(t, 2), i = r[0], a = r[1];
			return e.prototype.parse.call(this, [i, "\\" + a]);
		}, r;
	}(u);
	var d = function(e) {
		t(o, e);
		function o(t, i, o) {
			var s, c, l = e.call(this, t, null) || this;
			try {
				for (var u = r(Object.keys(i)), d = u.next(); !d.done; d = u.next()) {
					var f = d.value, p = i[f], m = n(typeof p == "string" ? [p] : p), h = m[0], g = m.slice(1), _ = new a.Macro(f, o[h], g);
					l.add(f, _);
				}
			} catch (e) {
				s = { error: e };
			} finally {
				try {
					d && !d.done && (c = u.return) && c.call(u);
				} finally {
					if (s) throw s.error;
				}
			}
			return l;
		}
		return o.prototype.parserFor = function(e) {
			var t = this.lookup(e);
			return t ? t.func : null;
		}, o.prototype.parse = function(e) {
			var t = n(e, 2), r = t[0], a = t[1], o = this.lookup(a), c = this.parserFor(a);
			return !o || !c ? null : s(c.apply(void 0, i([r, o.symbol], n(o.args), !1)));
		}, o;
	}(l);
	e.MacroMap = d, e.CommandMap = function(e) {
		t(r, e);
		function r() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return r.prototype.parse = function(e) {
			var t = n(e, 2), r = t[0], a = t[1], o = this.lookup(a), c = this.parserFor(a);
			if (!o || !c) return null;
			var l = r.currentCS;
			r.currentCS = "\\" + a;
			var u = c.apply(void 0, i([r, "\\" + o.symbol], n(o.args), !1));
			return r.currentCS = l, s(u);
		}, r;
	}(d), e.EnvironmentMap = function(e) {
		t(r, e);
		function r(t, n, r, i) {
			var a = e.call(this, t, r, i) || this;
			return a.parser = n, a;
		}
		return r.prototype.parse = function(e) {
			var t = n(e, 2), r = t[0], i = t[1], a = this.lookup(i), o = this.parserFor(i);
			return !a || !o ? null : s(this.parser(r, a.symbol, o, a.args));
		}, r;
	}(d);
})), D = /* @__PURE__ */ e(((e) => {
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
	})(), n = e && e.__read || function(e, t) {
		var n = typeof Symbol == "function" && e[Symbol.iterator];
		if (!n) return e;
		var r = n.call(e), i, a = [], o;
		try {
			for (; (t === void 0 || t-- > 0) && !(i = r.next()).done;) a.push(i.value);
		} catch (e) {
			o = { error: e };
		} finally {
			try {
				i && !i.done && (n = r.return) && n.call(r);
			} finally {
				if (o) throw o.error;
			}
		}
		return a;
	}, r = e && e.__spreadArray || function(e, t, n) {
		if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++) (a || !(r in t)) && (a ||= Array.prototype.slice.call(t, 0, r), a[r] = t[r]);
		return e.concat(a || Array.prototype.slice.call(t));
	}, i = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.EquationItem = e.EqnArrayItem = e.ArrayItem = e.DotsItem = e.NonscriptItem = e.NotItem = e.FnItem = e.MmlItem = e.CellItem = e.PositionItem = e.StyleItem = e.EndItem = e.BeginItem = e.RightItem = e.Middle = e.LeftItem = e.OverItem = e.SubsupItem = e.PrimeItem = e.CloseItem = e.OpenItem = e.StopItem = e.StartItem = void 0;
	var o = C(), s = m(), c = a(), l = i(f()), u = i(h()), p = i(d()), g = v();
	e.StartItem = function(e) {
		t(n, e);
		function n(t, n) {
			var r = e.call(this, t) || this;
			return r.global = n, r;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "start";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(n.prototype, "isOpen", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.checkItem = function(t) {
			if (t.isKind("stop")) {
				var n = this.toMml();
				return this.global.isInner || (n = this.factory.configuration.tags.finalize(n, this.env)), [[this.factory.create("mml", n)], !0];
			}
			return e.prototype.checkItem.call(this, t);
		}, n;
	}(g.BaseItem), e.StopItem = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "stop";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(n.prototype, "isClose", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), n;
	}(g.BaseItem), e.OpenItem = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "open";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(n.prototype, "isOpen", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.checkItem = function(t) {
			if (t.isKind("close")) {
				var n = this.toMml(), r = this.create("node", "TeXAtom", [n]);
				return [[this.factory.create("mml", r)], !0];
			}
			return e.prototype.checkItem.call(this, t);
		}, n.errors = Object.assign(Object.create(g.BaseItem.errors), { stop: ["ExtraOpenMissingClose", "Extra open brace or missing close brace"] }), n;
	}(g.BaseItem), e.CloseItem = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "close";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(n.prototype, "isClose", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), n;
	}(g.BaseItem), e.PrimeItem = function(e) {
		t(r, e);
		function r() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "prime";
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.checkItem = function(e) {
			var t = n(this.Peek(2), 2), r = t[0], i = t[1];
			return !p.default.isType(r, "msubsup") || p.default.isType(r, "msup") ? [[this.create("node", "msup", [r, i]), e], !0] : (p.default.setChild(r, r.sup, i), [[r, e], !0]);
		}, r;
	}(g.BaseItem), e.SubsupItem = function(e) {
		t(i, e);
		function i() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(i.prototype, "kind", {
			get: function() {
				return "subsup";
			},
			enumerable: !1,
			configurable: !0
		}), i.prototype.checkItem = function(t) {
			if (t.isKind("open") || t.isKind("left")) return g.BaseItem.success;
			var i = this.First, a = this.getProperty("position");
			if (t.isKind("mml")) return this.getProperty("primes") && (a === 2 ? (p.default.setProperty(this.getProperty("primes"), "variantForm", !0), t.First = this.create("node", "mrow", [this.getProperty("primes"), t.First])) : p.default.setChild(i, 2, this.getProperty("primes"))), p.default.setChild(i, a, t.First), this.getProperty("movesupsub") != null && p.default.setProperty(i, "movesupsub", this.getProperty("movesupsub")), [[this.factory.create("mml", i)], !0];
			if (e.prototype.checkItem.call(this, t)[1]) {
				var o = this.getErrors([
					"",
					"sub",
					"sup"
				][a]);
				throw new (l.default.bind.apply(l.default, r([
					void 0,
					o[0],
					o[1]
				], n(o.splice(2)), !1)))();
			}
			return null;
		}, i.errors = Object.assign(Object.create(g.BaseItem.errors), {
			stop: ["MissingScript", "Missing superscript or subscript argument"],
			sup: ["MissingOpenForSup", "Missing open brace for superscript"],
			sub: ["MissingOpenForSub", "Missing open brace for subscript"]
		}), i;
	}(g.BaseItem), e.OverItem = function(e) {
		t(n, e);
		function n(t) {
			var n = e.call(this, t) || this;
			return n.setProperty("name", "\\over"), n;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "over";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(n.prototype, "isClose", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.checkItem = function(t) {
			if (t.isKind("over")) throw new l.default("AmbiguousUseOf", "Ambiguous use of %1", t.getName());
			if (t.isClose) {
				var n = this.create("node", "mfrac", [this.getProperty("num"), this.toMml(!1)]);
				return this.getProperty("thickness") != null && p.default.setAttribute(n, "linethickness", this.getProperty("thickness")), (this.getProperty("open") || this.getProperty("close")) && (p.default.setProperty(n, "withDelims", !0), n = u.default.fixedFence(this.factory.configuration, this.getProperty("open"), n, this.getProperty("close"))), [[this.factory.create("mml", n), t], !0];
			}
			return e.prototype.checkItem.call(this, t);
		}, n.prototype.toString = function() {
			return "over[" + this.getProperty("num") + " / " + this.nodes.join("; ") + "]";
		}, n;
	}(g.BaseItem), e.LeftItem = function(e) {
		t(n, e);
		function n(t, n) {
			var r = e.call(this, t) || this;
			return r.setProperty("delim", n), r;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "left";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(n.prototype, "isOpen", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.checkItem = function(t) {
			if (t.isKind("right")) return [[this.factory.create("mml", u.default.fenced(this.factory.configuration, this.getProperty("delim"), this.toMml(), t.getProperty("delim"), "", t.getProperty("color")))], !0];
			if (t.isKind("middle")) {
				var n = { stretchy: !0 };
				return t.getProperty("color") && (n.mathcolor = t.getProperty("color")), this.Push(this.create("node", "TeXAtom", [], { texClass: c.TEXCLASS.CLOSE }), this.create("token", "mo", n, t.getProperty("delim")), this.create("node", "TeXAtom", [], { texClass: c.TEXCLASS.OPEN })), this.env = {}, [[this], !0];
			}
			return e.prototype.checkItem.call(this, t);
		}, n.errors = Object.assign(Object.create(g.BaseItem.errors), { stop: ["ExtraLeftMissingRight", "Extra \\left or missing \\right"] }), n;
	}(g.BaseItem), e.Middle = function(e) {
		t(n, e);
		function n(t, n, r) {
			var i = e.call(this, t) || this;
			return i.setProperty("delim", n), r && i.setProperty("color", r), i;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "middle";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(n.prototype, "isClose", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), n;
	}(g.BaseItem), e.RightItem = function(e) {
		t(n, e);
		function n(t, n, r) {
			var i = e.call(this, t) || this;
			return i.setProperty("delim", n), r && i.setProperty("color", r), i;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "right";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(n.prototype, "isClose", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), n;
	}(g.BaseItem), e.BeginItem = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "begin";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(n.prototype, "isOpen", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.checkItem = function(t) {
			if (t.isKind("end")) {
				if (t.getName() !== this.getName()) throw new l.default("EnvBadEnd", "\\begin{%1} ended with \\end{%2}", this.getName(), t.getName());
				return this.getProperty("end") ? g.BaseItem.fail : [[this.factory.create("mml", this.toMml())], !0];
			}
			if (t.isKind("stop")) throw new l.default("EnvMissingEnd", "Missing \\end{%1}", this.getName());
			return e.prototype.checkItem.call(this, t);
		}, n;
	}(g.BaseItem), e.EndItem = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "end";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(n.prototype, "isClose", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), n;
	}(g.BaseItem), e.StyleItem = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "style";
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.checkItem = function(t) {
			if (!t.isClose) return e.prototype.checkItem.call(this, t);
			var n = this.create("node", "mstyle", this.nodes, this.getProperty("styles"));
			return [[this.factory.create("mml", n), t], !0];
		}, n;
	}(g.BaseItem), e.PositionItem = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "position";
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.checkItem = function(t) {
			if (t.isClose) throw new l.default("MissingBoxFor", "Missing box for %1", this.getName());
			if (t.isFinal) {
				var n = t.toMml();
				switch (this.getProperty("move")) {
					case "vertical": return n = this.create("node", "mpadded", [n], {
						height: this.getProperty("dh"),
						depth: this.getProperty("dd"),
						voffset: this.getProperty("dh")
					}), [[this.factory.create("mml", n)], !0];
					case "horizontal": return [[
						this.factory.create("mml", this.getProperty("left")),
						t,
						this.factory.create("mml", this.getProperty("right"))
					], !0];
				}
			}
			return e.prototype.checkItem.call(this, t);
		}, n;
	}(g.BaseItem), e.CellItem = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "cell";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(n.prototype, "isClose", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), n;
	}(g.BaseItem), e.MmlItem = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(n.prototype, "isFinal", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "mml";
			},
			enumerable: !1,
			configurable: !0
		}), n;
	}(g.BaseItem), e.FnItem = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "fn";
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.checkItem = function(t) {
			var n = this.First;
			if (n) {
				if (t.isOpen) return g.BaseItem.success;
				if (!t.isKind("fn")) {
					var r = t.First;
					if (!t.isKind("mml") || !r || p.default.isType(r, "mstyle") && r.childNodes.length && p.default.isType(r.childNodes[0].childNodes[0], "mspace") || p.default.isType(r, "mspace")) return [[n, t], !0];
					p.default.isEmbellished(r) && (r = p.default.getCoreMO(r));
					var i = p.default.getForm(r);
					if (i != null && [
						0,
						0,
						1,
						1,
						0,
						1,
						1,
						0,
						0,
						0
					][i[2]]) return [[n, t], !0];
				}
				return [[
					n,
					this.create("token", "mo", { texClass: c.TEXCLASS.NONE }, s.entities.ApplyFunction),
					t
				], !0];
			}
			return e.prototype.checkItem.apply(this, arguments);
		}, n;
	}(g.BaseItem), e.NotItem = function(e) {
		t(n, e);
		function n() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.remap = o.MapHandler.getMap("not_remap"), t;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "not";
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.checkItem = function(e) {
			var t, n, r;
			if (e.isKind("open") || e.isKind("left")) return g.BaseItem.success;
			if (e.isKind("mml") && (p.default.isType(e.First, "mo") || p.default.isType(e.First, "mi") || p.default.isType(e.First, "mtext")) && (t = e.First, n = p.default.getText(t), n.length === 1 && !p.default.getProperty(t, "movesupsub") && p.default.getChildren(t).length === 1)) return this.remap.contains(n) ? (r = this.create("text", this.remap.lookup(n).char), p.default.setChild(t, 0, r)) : (r = this.create("text", "̸"), p.default.appendChildren(t, [r])), [[e], !0];
			r = this.create("text", "⧸");
			var i = this.create("node", "mtext", [], {}, r), a = this.create("node", "mpadded", [i], { width: 0 });
			return t = this.create("node", "TeXAtom", [a], { texClass: c.TEXCLASS.REL }), [[t, e], !0];
		}, n;
	}(g.BaseItem), e.NonscriptItem = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "nonscript";
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.checkItem = function(e) {
			if (e.isKind("mml") && e.Size() === 1) {
				var t = e.First;
				if (t.isKind("mstyle") && t.notParent && (t = p.default.getChildren(p.default.getChildren(t)[0])[0]), t.isKind("mspace")) {
					if (t !== e.First) {
						var n = this.create("node", "mrow", [e.Pop()]);
						e.Push(n);
					}
					this.factory.configuration.addNode("nonscript", e.First);
				}
			}
			return [[e], !0];
		}, n;
	}(g.BaseItem), e.DotsItem = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "dots";
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.checkItem = function(e) {
			if (e.isKind("open") || e.isKind("left")) return g.BaseItem.success;
			var t = this.getProperty("ldots"), n = e.First;
			if (e.isKind("mml") && p.default.isEmbellished(n)) {
				var r = p.default.getTexClass(p.default.getCoreMO(n));
				(r === c.TEXCLASS.BIN || r === c.TEXCLASS.REL) && (t = this.getProperty("cdots"));
			}
			return [[t, e], !0];
		}, n;
	}(g.BaseItem);
	var _ = function(e) {
		t(n, e);
		function n() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.table = [], t.row = [], t.frame = [], t.hfill = [], t.arraydef = {}, t.dashed = !1, t;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "array";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(n.prototype, "isOpen", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(n.prototype, "copyEnv", {
			get: function() {
				return !1;
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.checkItem = function(t) {
			if (t.isClose && !t.isKind("over")) {
				if (t.getProperty("isEntry")) return this.EndEntry(), this.clearEnv(), g.BaseItem.fail;
				if (t.getProperty("isCR")) return this.EndEntry(), this.EndRow(), this.clearEnv(), g.BaseItem.fail;
				this.EndTable(), this.clearEnv();
				var n = this.factory.create("mml", this.createMml());
				if (this.getProperty("requireClose")) {
					if (t.isKind("close")) return [[n], !0];
					throw new l.default("MissingCloseBrace", "Missing close brace");
				}
				return [[n, t], !0];
			}
			return e.prototype.checkItem.call(this, t);
		}, n.prototype.createMml = function() {
			var e = this.arraydef.scriptlevel;
			delete this.arraydef.scriptlevel;
			var t = this.create("node", "mtable", this.table, this.arraydef);
			return e && t.setProperty("scriptlevel", e), this.frame.length === 4 ? p.default.setAttribute(t, "frame", this.dashed ? "dashed" : "solid") : this.frame.length && (this.arraydef.rowlines && (this.arraydef.rowlines = this.arraydef.rowlines.replace(/none( none)+$/, "none")), p.default.setAttribute(t, "frame", ""), t = this.create("node", "menclose", [t], { notation: this.frame.join(" ") }), ((this.arraydef.columnlines || "none") !== "none" || (this.arraydef.rowlines || "none") !== "none") && p.default.setAttribute(t, "data-padding", 0)), (this.getProperty("open") || this.getProperty("close")) && (t = u.default.fenced(this.factory.configuration, this.getProperty("open"), t, this.getProperty("close"))), t;
		}, n.prototype.EndEntry = function() {
			var e = this.create("node", "mtd", this.nodes);
			this.hfill.length && (this.hfill[0] === 0 && p.default.setAttribute(e, "columnalign", "right"), this.hfill[this.hfill.length - 1] === this.Size() && p.default.setAttribute(e, "columnalign", p.default.getAttribute(e, "columnalign") ? "center" : "left")), this.row.push(e), this.Clear(), this.hfill = [];
		}, n.prototype.EndRow = function() {
			var e;
			this.getProperty("isNumbered") && this.row.length === 3 ? (this.row.unshift(this.row.pop()), e = this.create("node", "mlabeledtr", this.row)) : e = this.create("node", "mtr", this.row), this.table.push(e), this.row = [];
		}, n.prototype.EndTable = function() {
			(this.Size() || this.row.length) && (this.EndEntry(), this.EndRow()), this.checkLines();
		}, n.prototype.checkLines = function() {
			if (this.arraydef.rowlines) {
				var e = this.arraydef.rowlines.split(/ /);
				e.length === this.table.length ? (this.frame.push("bottom"), e.pop(), this.arraydef.rowlines = e.join(" ")) : e.length < this.table.length - 1 && (this.arraydef.rowlines += " none");
			}
			if (this.getProperty("rowspacing")) {
				for (var t = this.arraydef.rowspacing.split(/ /); t.length < this.table.length;) t.push(this.getProperty("rowspacing") + "em");
				this.arraydef.rowspacing = t.join(" ");
			}
		}, n.prototype.addRowSpacing = function(e) {
			if (this.arraydef.rowspacing) {
				var t = this.arraydef.rowspacing.split(/ /);
				if (!this.getProperty("rowspacing")) {
					var n = u.default.dimen2em(t[0]);
					this.setProperty("rowspacing", n);
				}
				for (var r = this.getProperty("rowspacing"); t.length < this.table.length;) t.push(u.default.Em(r));
				t[this.table.length - 1] = u.default.Em(Math.max(0, r + u.default.dimen2em(e))), this.arraydef.rowspacing = t.join(" ");
			}
		}, n;
	}(g.BaseItem);
	e.ArrayItem = _, e.EqnArrayItem = function(e) {
		t(i, e);
		function i(t) {
			var n = [...arguments].slice(1), r = e.call(this, t) || this;
			return r.maxrow = 0, r.factory.configuration.tags.start(n[0], n[2], n[1]), r;
		}
		return Object.defineProperty(i.prototype, "kind", {
			get: function() {
				return "eqnarray";
			},
			enumerable: !1,
			configurable: !0
		}), i.prototype.EndEntry = function() {
			this.row.length && u.default.fixInitialMO(this.factory.configuration, this.nodes);
			var e = this.create("node", "mtd", this.nodes);
			this.row.push(e), this.Clear();
		}, i.prototype.EndRow = function() {
			this.row.length > this.maxrow && (this.maxrow = this.row.length);
			var e = "mtr", t = this.factory.configuration.tags.getTag();
			t && (this.row = [t].concat(this.row), e = "mlabeledtr"), this.factory.configuration.tags.clearTag();
			var n = this.create("node", e, this.row);
			this.table.push(n), this.row = [];
		}, i.prototype.EndTable = function() {
			e.prototype.EndTable.call(this), this.factory.configuration.tags.end(), this.extendArray("columnalign", this.maxrow), this.extendArray("columnwidth", this.maxrow), this.extendArray("columnspacing", this.maxrow - 1);
		}, i.prototype.extendArray = function(e, t) {
			if (this.arraydef[e]) {
				var i = this.arraydef[e].split(/ /), a = r([], n(i), !1);
				if (a.length > 1) {
					for (; a.length < t;) a.push.apply(a, r([], n(i), !1));
					this.arraydef[e] = a.slice(0, t).join(" ");
				}
			}
		}, i;
	}(_), e.EquationItem = function(e) {
		t(n, e);
		function n(t) {
			var n = [...arguments].slice(1), r = e.call(this, t) || this;
			return r.factory.configuration.tags.start("equation", !0, n[0]), r;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "equation";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(n.prototype, "isOpen", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.checkItem = function(t) {
			if (t.isKind("end")) {
				var n = this.toMml(), r = this.factory.configuration.tags.getTag();
				return this.factory.configuration.tags.end(), [[r ? this.factory.configuration.tags.enTag(n, r) : n, t], !0];
			}
			if (t.isKind("stop")) throw new l.default("EnvMissingEnd", "Missing \\end{%1}", this.getName());
			return e.prototype.checkItem.call(this, t);
		}, n;
	}(g.BaseItem);
})), O = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.TexConstant = void 0, (function(e) {
		e.Variant = {
			NORMAL: "normal",
			BOLD: "bold",
			ITALIC: "italic",
			BOLDITALIC: "bold-italic",
			DOUBLESTRUCK: "double-struck",
			FRAKTUR: "fraktur",
			BOLDFRAKTUR: "bold-fraktur",
			SCRIPT: "script",
			BOLDSCRIPT: "bold-script",
			SANSSERIF: "sans-serif",
			BOLDSANSSERIF: "bold-sans-serif",
			SANSSERIFITALIC: "sans-serif-italic",
			SANSSERIFBOLDITALIC: "sans-serif-bold-italic",
			MONOSPACE: "monospace",
			INITIAL: "inital",
			TAILED: "tailed",
			LOOPED: "looped",
			STRETCHED: "stretched",
			CALLIGRAPHIC: "-tex-calligraphic",
			BOLDCALLIGRAPHIC: "-tex-bold-calligraphic",
			OLDSTYLE: "-tex-oldstyle",
			BOLDOLDSTYLE: "-tex-bold-oldstyle",
			MATHITALIC: "-tex-mathit"
		}, e.Form = {
			PREFIX: "prefix",
			INFIX: "infix",
			POSTFIX: "postfix"
		}, e.LineBreak = {
			AUTO: "auto",
			NEWLINE: "newline",
			NOBREAK: "nobreak",
			GOODBREAK: "goodbreak",
			BADBREAK: "badbreak"
		}, e.LineBreakStyle = {
			BEFORE: "before",
			AFTER: "after",
			DUPLICATE: "duplicate",
			INFIXLINBREAKSTYLE: "infixlinebreakstyle"
		}, e.IndentAlign = {
			LEFT: "left",
			CENTER: "center",
			RIGHT: "right",
			AUTO: "auto",
			ID: "id",
			INDENTALIGN: "indentalign"
		}, e.IndentShift = { INDENTSHIFT: "indentshift" }, e.LineThickness = {
			THIN: "thin",
			MEDIUM: "medium",
			THICK: "thick"
		}, e.Notation = {
			LONGDIV: "longdiv",
			ACTUARIAL: "actuarial",
			PHASORANGLE: "phasorangle",
			RADICAL: "radical",
			BOX: "box",
			ROUNDEDBOX: "roundedbox",
			CIRCLE: "circle",
			LEFT: "left",
			RIGHT: "right",
			TOP: "top",
			BOTTOM: "bottom",
			UPDIAGONALSTRIKE: "updiagonalstrike",
			DOWNDIAGONALSTRIKE: "downdiagonalstrike",
			VERTICALSTRIKE: "verticalstrike",
			HORIZONTALSTRIKE: "horizontalstrike",
			NORTHEASTARROW: "northeastarrow",
			MADRUWB: "madruwb",
			UPDIAGONALARROW: "updiagonalarrow"
		}, e.Align = {
			TOP: "top",
			BOTTOM: "bottom",
			CENTER: "center",
			BASELINE: "baseline",
			AXIS: "axis",
			LEFT: "left",
			RIGHT: "right"
		}, e.Lines = {
			NONE: "none",
			SOLID: "solid",
			DASHED: "dashed"
		}, e.Side = {
			LEFT: "left",
			RIGHT: "right",
			LEFTOVERLAP: "leftoverlap",
			RIGHTOVERLAP: "rightoverlap"
		}, e.Width = {
			AUTO: "auto",
			FIT: "fit"
		}, e.Actiontype = {
			TOGGLE: "toggle",
			STATUSLINE: "statusline",
			TOOLTIP: "tooltip",
			INPUT: "input"
		}, e.Overflow = {
			LINBREAK: "linebreak",
			SCROLL: "scroll",
			ELIDE: "elide",
			TRUNCATE: "truncate",
			SCALE: "scale"
		}, e.Unit = {
			EM: "em",
			EX: "ex",
			PX: "px",
			IN: "in",
			CM: "cm",
			MM: "mm",
			PT: "pt",
			PC: "pc"
		};
	})(e.TexConstant ||= {});
})), k = /* @__PURE__ */ e(((e) => {
	var t = e && e.__assign || function() {
		return t = Object.assign || function(e) {
			for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
			return e;
		}, t.apply(this, arguments);
	}, n = e && e.__createBinding || (Object.create ? (function(e, t, n, r) {
		r === void 0 && (r = n);
		var i = Object.getOwnPropertyDescriptor(t, n);
		(!i || ("get" in i ? !t.__esModule : i.writable || i.configurable)) && (i = {
			enumerable: !0,
			get: function() {
				return t[n];
			}
		}), Object.defineProperty(e, r, i);
	}) : (function(e, t, n, r) {
		r === void 0 && (r = n), e[r] = t[n];
	})), r = e && e.__setModuleDefault || (Object.create ? (function(e, t) {
		Object.defineProperty(e, "default", {
			enumerable: !0,
			value: t
		});
	}) : function(e, t) {
		e.default = t;
	}), o = e && e.__importStar || function(e) {
		if (e && e.__esModule) return e;
		var t = {};
		if (e != null) for (var i in e) i !== "default" && Object.prototype.hasOwnProperty.call(e, i) && n(t, e, i);
		return r(t, e), t;
	}, s = e && e.__read || function(e, t) {
		var n = typeof Symbol == "function" && e[Symbol.iterator];
		if (!n) return e;
		var r = n.call(e), i, a = [], o;
		try {
			for (; (t === void 0 || t-- > 0) && !(i = r.next()).done;) a.push(i.value);
		} catch (e) {
			o = { error: e };
		} finally {
			try {
				i && !i.done && (n = r.return) && n.call(r);
			} finally {
				if (o) throw o.error;
			}
		}
		return a;
	}, c = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 });
	var l = o(D()), p = c(d()), g = c(f()), v = c(_()), y = O(), b = c(h()), x = a(), C = S(), w = u(), T = m(), E = i(), k = {}, A = 1.2 / .85, j = {
		fontfamily: 1,
		fontsize: 1,
		fontweight: 1,
		fontstyle: 1,
		color: 1,
		background: 1,
		id: 1,
		class: 1,
		href: 1,
		style: 1
	};
	k.Open = function(e, t) {
		e.Push(e.itemFactory.create("open"));
	}, k.Close = function(e, t) {
		e.Push(e.itemFactory.create("close"));
	}, k.Tilde = function(e, t) {
		e.Push(e.create("token", "mtext", {}, T.entities.nbsp));
	}, k.Space = function(e, t) {}, k.Superscript = function(e, t) {
		var n;
		e.GetNext().match(/\d/) && (e.string = e.string.substr(0, e.i + 1) + " " + e.string.substr(e.i + 1));
		var r, i, a = e.stack.Top();
		a.isKind("prime") ? (n = s(a.Peek(2), 2), i = n[0], r = n[1], e.stack.Pop()) : (i = e.stack.Prev(), i ||= e.create("token", "mi", {}, ""));
		var o = p.default.getProperty(i, "movesupsub"), c = p.default.isType(i, "msubsup") ? i.sup : i.over;
		if (p.default.isType(i, "msubsup") && !p.default.isType(i, "msup") && p.default.getChildAt(i, i.sup) || p.default.isType(i, "munderover") && !p.default.isType(i, "mover") && p.default.getChildAt(i, i.over) && !p.default.getProperty(i, "subsupOK")) throw new g.default("DoubleExponent", "Double exponent: use braces to clarify");
		(!p.default.isType(i, "msubsup") || p.default.isType(i, "msup")) && (o ? ((!p.default.isType(i, "munderover") || p.default.isType(i, "mover") || p.default.getChildAt(i, i.over)) && (i = e.create("node", "munderover", [i], { movesupsub: !0 })), c = i.over) : (i = e.create("node", "msubsup", [i]), c = i.sup)), e.Push(e.itemFactory.create("subsup", i).setProperties({
			position: c,
			primes: r,
			movesupsub: o
		}));
	}, k.Subscript = function(e, t) {
		var n;
		e.GetNext().match(/\d/) && (e.string = e.string.substr(0, e.i + 1) + " " + e.string.substr(e.i + 1));
		var r, i, a = e.stack.Top();
		a.isKind("prime") ? (n = s(a.Peek(2), 2), i = n[0], r = n[1], e.stack.Pop()) : (i = e.stack.Prev(), i ||= e.create("token", "mi", {}, ""));
		var o = p.default.getProperty(i, "movesupsub"), c = p.default.isType(i, "msubsup") ? i.sub : i.under;
		if (p.default.isType(i, "msubsup") && !p.default.isType(i, "msup") && p.default.getChildAt(i, i.sub) || p.default.isType(i, "munderover") && !p.default.isType(i, "mover") && p.default.getChildAt(i, i.under) && !p.default.getProperty(i, "subsupOK")) throw new g.default("DoubleSubscripts", "Double subscripts: use braces to clarify");
		(!p.default.isType(i, "msubsup") || p.default.isType(i, "msup")) && (o ? ((!p.default.isType(i, "munderover") || p.default.isType(i, "mover") || p.default.getChildAt(i, i.under)) && (i = e.create("node", "munderover", [i], { movesupsub: !0 })), c = i.under) : (i = e.create("node", "msubsup", [i]), c = i.sub)), e.Push(e.itemFactory.create("subsup", i).setProperties({
			position: c,
			primes: r,
			movesupsub: o
		}));
	}, k.Prime = function(e, t) {
		var n = e.stack.Prev();
		if (n ||= e.create("node", "mi"), p.default.isType(n, "msubsup") && !p.default.isType(n, "msup") && p.default.getChildAt(n, n.sup)) throw new g.default("DoubleExponentPrime", "Prime causes double exponent: use braces to clarify");
		var r = "";
		e.i--;
		do
			r += T.entities.prime, e.i++, t = e.GetNext();
		while (t === "'" || t === T.entities.rsquo);
		r = [
			"",
			"′",
			"″",
			"‴",
			"⁗"
		][r.length] || r;
		var i = e.create("token", "mo", { variantForm: !0 }, r);
		e.Push(e.itemFactory.create("prime", n, i));
	}, k.Comment = function(e, t) {
		for (; e.i < e.string.length && e.string.charAt(e.i) !== "\n";) e.i++;
	}, k.Hash = function(e, t) {
		throw new g.default("CantUseHash1", "You can't use 'macro parameter character #' in math mode");
	}, k.MathFont = function(e, n, r) {
		var i = e.GetArgument(n), a = new v.default(i, t(t({}, e.stack.env), {
			font: r,
			multiLetterIdentifiers: /^[a-zA-Z]+/,
			noAutoOP: !0
		}), e.configuration).mml();
		e.Push(e.create("node", "TeXAtom", [a]));
	}, k.SetFont = function(e, t, n) {
		e.stack.env.font = n;
	}, k.SetStyle = function(e, t, n, r, i) {
		e.stack.env.style = n, e.stack.env.level = i, e.Push(e.itemFactory.create("style").setProperty("styles", {
			displaystyle: r,
			scriptlevel: i
		}));
	}, k.SetSize = function(e, t, n) {
		e.stack.env.size = n, e.Push(e.itemFactory.create("style").setProperty("styles", { mathsize: (0, w.em)(n) }));
	}, k.Spacer = function(e, t, n) {
		var r = e.create("node", "mspace", [], { width: (0, w.em)(n) }), i = e.create("node", "mstyle", [r], { scriptlevel: 0 });
		e.Push(i);
	}, k.LeftRight = function(e, t) {
		var n = t.substr(1);
		e.Push(e.itemFactory.create(n, e.GetDelimiter(t), e.stack.env.color));
	}, k.NamedFn = function(e, t, n) {
		n ||= t.substr(1);
		var r = e.create("token", "mi", { texClass: x.TEXCLASS.OP }, n);
		e.Push(e.itemFactory.create("fn", r));
	}, k.NamedOp = function(e, t, n) {
		n ||= t.substr(1), n = n.replace(/&thinsp;/, " ");
		var r = e.create("token", "mo", {
			movablelimits: !0,
			movesupsub: !0,
			form: y.TexConstant.Form.PREFIX,
			texClass: x.TEXCLASS.OP
		}, n);
		e.Push(r);
	}, k.Limits = function(e, t, n) {
		var r = e.stack.Prev(!0);
		if (!r || p.default.getTexClass(p.default.getCoreMO(r)) !== x.TEXCLASS.OP && p.default.getProperty(r, "movesupsub") == null) throw new g.default("MisplacedLimits", "%1 is allowed only on operators", e.currentCS);
		var i = e.stack.Top(), a;
		p.default.isType(r, "munderover") && !n ? (a = e.create("node", "msubsup"), p.default.copyChildren(r, a), r = i.Last = a) : p.default.isType(r, "msubsup") && n && (a = e.create("node", "munderover"), p.default.copyChildren(r, a), r = i.Last = a), p.default.setProperty(r, "movesupsub", !!n), p.default.setProperties(p.default.getCoreMO(r), { movablelimits: !1 }), (p.default.getAttribute(r, "movablelimits") || p.default.getProperty(r, "movablelimits")) && p.default.setProperties(r, { movablelimits: !1 });
	}, k.Over = function(e, t, n, r) {
		var i = e.itemFactory.create("over").setProperty("name", e.currentCS);
		n || r ? (i.setProperty("open", n), i.setProperty("close", r)) : t.match(/withdelims$/) && (i.setProperty("open", e.GetDelimiter(t)), i.setProperty("close", e.GetDelimiter(t))), t.match(/^\\above/) ? i.setProperty("thickness", e.GetDimen(t)) : (t.match(/^\\atop/) || n || r) && i.setProperty("thickness", 0), e.Push(i);
	}, k.Frac = function(e, t) {
		var n = e.ParseArg(t), r = e.ParseArg(t), i = e.create("node", "mfrac", [n, r]);
		e.Push(i);
	}, k.Sqrt = function(e, t) {
		var n = e.GetBrackets(t), r = e.GetArgument(t);
		r === "\\frac" && (r += "{" + e.GetArgument(r) + "}{" + e.GetArgument(r) + "}");
		var i = new v.default(r, e.stack.env, e.configuration).mml();
		i = n ? e.create("node", "mroot", [i, M(e, n)]) : e.create("node", "msqrt", [i]), e.Push(i);
	};
	function M(e, t) {
		var n = e.stack.env, r = n.inRoot;
		n.inRoot = !0;
		var i = new v.default(t, n, e.configuration), a = i.mml(), o = i.stack.global;
		if (o.leftRoot || o.upRoot) {
			var s = {};
			o.leftRoot && (s.width = o.leftRoot), o.upRoot && (s.voffset = o.upRoot, s.height = o.upRoot), a = e.create("node", "mpadded", [a], s);
		}
		return n.inRoot = r, a;
	}
	k.Root = function(e, t) {
		var n = e.GetUpTo(t, "\\of"), r = e.ParseArg(t), i = e.create("node", "mroot", [r, M(e, n)]);
		e.Push(i);
	}, k.MoveRoot = function(e, t, n) {
		if (!e.stack.env.inRoot) throw new g.default("MisplacedMoveRoot", "%1 can appear only within a root", e.currentCS);
		if (e.stack.global[n]) throw new g.default("MultipleMoveRoot", "Multiple use of %1", e.currentCS);
		var r = e.GetArgument(t);
		if (!r.match(/-?[0-9]+/)) throw new g.default("IntegerArg", "The argument to %1 must be an integer", e.currentCS);
		r = parseInt(r, 10) / 15 + "em", r.substr(0, 1) !== "-" && (r = "+" + r), e.stack.global[n] = r;
	}, k.Accent = function(e, n, r, i) {
		var a = e.ParseArg(n), o = t(t({}, b.default.getFontDef(e)), {
			accent: !0,
			mathaccent: !0
		}), s = p.default.createEntity(r), c = e.create("token", "mo", o, s);
		p.default.setAttribute(c, "stretchy", !!i);
		var l = p.default.isEmbellished(a) ? p.default.getCoreMO(a) : a;
		(p.default.isType(l, "mo") || p.default.getProperty(l, "movablelimits")) && p.default.setProperties(l, { movablelimits: !1 });
		var u = e.create("node", "munderover");
		p.default.setChild(u, 0, a), p.default.setChild(u, 1, null), p.default.setChild(u, 2, c);
		var d = e.create("node", "TeXAtom", [u]);
		e.Push(d);
	}, k.UnderOver = function(e, t, n, r) {
		var i = p.default.createEntity(n), a = e.create("token", "mo", {
			stretchy: !0,
			accent: !0
		}, i), o = t.charAt(1) === "o" ? "over" : "under", s = e.ParseArg(t);
		e.Push(b.default.underOver(e, s, a, o, r));
	}, k.Overset = function(e, t) {
		var n = e.ParseArg(t), r = e.ParseArg(t);
		b.default.checkMovableLimits(r), n.isKind("mo") && p.default.setAttribute(n, "accent", !1);
		var i = e.create("node", "mover", [r, n]);
		e.Push(i);
	}, k.Underset = function(e, t) {
		var n = e.ParseArg(t), r = e.ParseArg(t);
		b.default.checkMovableLimits(r), n.isKind("mo") && p.default.setAttribute(n, "accent", !1);
		var i = e.create("node", "munder", [r, n], { accentunder: !1 });
		e.Push(i);
	}, k.Overunderset = function(e, t) {
		var n = e.ParseArg(t), r = e.ParseArg(t), i = e.ParseArg(t);
		b.default.checkMovableLimits(i), n.isKind("mo") && p.default.setAttribute(n, "accent", !1), r.isKind("mo") && p.default.setAttribute(r, "accent", !1);
		var a = e.create("node", "munderover", [
			i,
			r,
			n
		], {
			accent: !1,
			accentunder: !1
		});
		e.Push(a);
	}, k.TeXAtom = function(e, t, n) {
		var r = { texClass: n }, i, a, o;
		if (n === x.TEXCLASS.OP) {
			r.movesupsub = r.movablelimits = !0;
			var s = e.GetArgument(t), c = s.match(/^\s*\\rm\s+([a-zA-Z0-9 ]+)$/);
			c ? (r.mathvariant = y.TexConstant.Variant.NORMAL, a = e.create("token", "mi", r, c[1])) : (o = new v.default(s, e.stack.env, e.configuration).mml(), a = e.create("node", "TeXAtom", [o], r)), i = e.itemFactory.create("fn", a);
		} else o = e.ParseArg(t), i = e.create("node", "TeXAtom", [o], r);
		e.Push(i);
	}, k.MmlToken = function(e, t) {
		var n = e.GetArgument(t), r = e.GetBrackets(t, "").replace(/^\s+/, ""), i = e.GetArgument(t), a = {}, o = [], s;
		try {
			s = e.create("node", n);
		} catch {
			s = null;
		}
		if (!s || !s.isToken) throw new g.default("NotMathMLToken", "%1 is not a token element", n);
		for (; r !== "";) {
			var c = r.match(/^([a-z]+)\s*=\s*('[^']*'|"[^"]*"|[^ ,]*)\s*,?\s*/i);
			if (!c) throw new g.default("InvalidMathMLAttr", "Invalid MathML attribute: %1", r);
			if (!s.attributes.hasDefault(c[1]) && !j[c[1]]) throw new g.default("UnknownAttrForElement", "%1 is not a recognized attribute for %2", c[1], n);
			var l = b.default.MmlFilterAttribute(e, c[1], c[2].replace(/^(['"])(.*)\1$/, "$2"));
			l && (l.toLowerCase() === "true" ? l = !0 : l.toLowerCase() === "false" && (l = !1), a[c[1]] = l, o.push(c[1])), r = r.substr(c[0].length);
		}
		o.length && (a["mjx-keep-attrs"] = o.join(" "));
		var u = e.create("text", i);
		s.appendChild(u), p.default.setProperties(s, a), e.Push(s);
	}, k.Strut = function(e, t) {
		var n = e.create("node", "mrow"), r = e.create("node", "mpadded", [n], {
			height: "8.6pt",
			depth: "3pt",
			width: 0
		});
		e.Push(r);
	}, k.Phantom = function(e, t, n, r) {
		var i = e.create("node", "mphantom", [e.ParseArg(t)]);
		(n || r) && (i = e.create("node", "mpadded", [i]), r && (p.default.setAttribute(i, "height", 0), p.default.setAttribute(i, "depth", 0)), n && p.default.setAttribute(i, "width", 0));
		var a = e.create("node", "TeXAtom", [i]);
		e.Push(a);
	}, k.Smash = function(e, t) {
		var n = b.default.trimSpaces(e.GetBrackets(t, "")), r = e.create("node", "mpadded", [e.ParseArg(t)]);
		switch (n) {
			case "b":
				p.default.setAttribute(r, "depth", 0);
				break;
			case "t":
				p.default.setAttribute(r, "height", 0);
				break;
			default: p.default.setAttribute(r, "height", 0), p.default.setAttribute(r, "depth", 0);
		}
		var i = e.create("node", "TeXAtom", [r]);
		e.Push(i);
	}, k.Lap = function(e, t) {
		var n = e.create("node", "mpadded", [e.ParseArg(t)], { width: 0 });
		t === "\\llap" && p.default.setAttribute(n, "lspace", "-1width");
		var r = e.create("node", "TeXAtom", [n]);
		e.Push(r);
	}, k.RaiseLower = function(e, t) {
		var n = e.GetDimen(t), r = e.itemFactory.create("position").setProperties({
			name: e.currentCS,
			move: "vertical"
		});
		n.charAt(0) === "-" && (n = n.slice(1), t = t.substr(1) === "raise" ? "\\lower" : "\\raise"), t === "\\lower" ? (r.setProperty("dh", "-" + n), r.setProperty("dd", "+" + n)) : (r.setProperty("dh", "+" + n), r.setProperty("dd", "-" + n)), e.Push(r);
	}, k.MoveLeftRight = function(e, t) {
		var n = e.GetDimen(t), r = n.charAt(0) === "-" ? n.slice(1) : "-" + n;
		if (t === "\\moveleft") {
			var i = n;
			n = r, r = i;
		}
		e.Push(e.itemFactory.create("position").setProperties({
			name: e.currentCS,
			move: "horizontal",
			left: e.create("node", "mspace", [], { width: n }),
			right: e.create("node", "mspace", [], { width: r })
		}));
	}, k.Hskip = function(e, t) {
		var n = e.create("node", "mspace", [], { width: e.GetDimen(t) });
		e.Push(n);
	}, k.Nonscript = function(e, t) {
		e.Push(e.itemFactory.create("nonscript"));
	}, k.Rule = function(e, t, n) {
		var r = {
			width: e.GetDimen(t),
			height: e.GetDimen(t),
			depth: e.GetDimen(t)
		};
		n !== "blank" && (r.mathbackground = e.stack.env.color || "black");
		var i = e.create("node", "mspace", [], r);
		e.Push(i);
	}, k.rule = function(e, t) {
		var n = e.GetBrackets(t), r = e.GetDimen(t), i = e.GetDimen(t), a = e.create("node", "mspace", [], {
			width: r,
			height: i,
			mathbackground: e.stack.env.color || "black"
		});
		n && (a = e.create("node", "mpadded", [a], { voffset: n }), n.match(/^\-/) ? (p.default.setAttribute(a, "height", n), p.default.setAttribute(a, "depth", "+" + n.substr(1))) : p.default.setAttribute(a, "height", "+" + n)), e.Push(a);
	}, k.MakeBig = function(e, t, n, r) {
		r *= A;
		var i = String(r).replace(/(\.\d\d\d).+/, "$1") + "em", a = e.GetDelimiter(t, !0), o = e.create("token", "mo", {
			minsize: i,
			maxsize: i,
			fence: !0,
			stretchy: !0,
			symmetric: !0
		}, a), s = e.create("node", "TeXAtom", [o], { texClass: n });
		e.Push(s);
	}, k.BuildRel = function(e, t) {
		var n = e.ParseUpTo(t, "\\over"), r = e.ParseArg(t), i = e.create("node", "munderover");
		p.default.setChild(i, 0, r), p.default.setChild(i, 1, null), p.default.setChild(i, 2, n);
		var a = e.create("node", "TeXAtom", [i], { texClass: x.TEXCLASS.REL });
		e.Push(a);
	}, k.HBox = function(e, t, n, r) {
		e.PushAll(b.default.internalMath(e, e.GetArgument(t), n, r));
	}, k.FBox = function(e, t) {
		var n = b.default.internalMath(e, e.GetArgument(t)), r = e.create("node", "menclose", n, { notation: "box" });
		e.Push(r);
	}, k.FrameBox = function(e, t) {
		var n = e.GetBrackets(t), r = e.GetBrackets(t) || "c", i = b.default.internalMath(e, e.GetArgument(t));
		n && (i = [e.create("node", "mpadded", i, {
			width: n,
			"data-align": (0, E.lookup)(r, {
				l: "left",
				r: "right"
			}, "center")
		})]);
		var a = e.create("node", "TeXAtom", [e.create("node", "menclose", i, { notation: "box" })], { texClass: x.TEXCLASS.ORD });
		e.Push(a);
	}, k.Not = function(e, t) {
		e.Push(e.itemFactory.create("not"));
	}, k.Dots = function(e, t) {
		var n = p.default.createEntity("2026"), r = p.default.createEntity("22EF"), i = e.create("token", "mo", { stretchy: !1 }, n), a = e.create("token", "mo", { stretchy: !1 }, r);
		e.Push(e.itemFactory.create("dots").setProperties({
			ldots: i,
			cdots: a
		}));
	}, k.Matrix = function(e, t, n, r, i, a, o, s, c, l) {
		var u = e.GetNext();
		if (u === "") throw new g.default("MissingArgFor", "Missing argument for %1", e.currentCS);
		u === "{" ? e.i++ : (e.string = u + "}" + e.string.slice(e.i + 1), e.i = 0);
		var d = e.itemFactory.create("array").setProperty("requireClose", !0);
		d.arraydef = {
			rowspacing: o || "4pt",
			columnspacing: a || "1em"
		}, c && d.setProperty("isCases", !0), l && (d.setProperty("isNumbered", !0), d.arraydef.side = l), (n || r) && (d.setProperty("open", n), d.setProperty("close", r)), s === "D" && (d.arraydef.displaystyle = !0), i != null && (d.arraydef.columnalign = i), e.Push(d);
	}, k.Entry = function(e, t) {
		e.Push(e.itemFactory.create("cell").setProperties({
			isEntry: !0,
			name: t
		}));
		var n = e.stack.Top(), r = n.getProperty("casesEnv");
		if (!(!n.getProperty("isCases") && !r)) {
			for (var i = e.string, a = 0, o = -1, s = e.i, c = i.length, l = r ? RegExp(`^\\\\end\\s*\\{${r.replace(/\*/, "\\*")}\\}`) : null; s < c;) {
				var u = i.charAt(s);
				if (u === "{") a++, s++;
				else if (u === "}") a === 0 ? c = 0 : (a--, a === 0 && o < 0 && (o = s - e.i), s++);
				else if (u === "&" && a === 0) throw new g.default("ExtraAlignTab", "Extra alignment tab in \\cases text");
				else if (u === "\\") {
					var d = i.substr(s);
					d.match(/^((\\cr)[^a-zA-Z]|\\\\)/) || l && d.match(l) ? c = 0 : s += 2;
				} else s++;
			}
			var f = i.substr(e.i, s - e.i);
			if (!f.match(/^\s*\\text[^a-zA-Z]/) || o !== f.replace(/\s+$/, "").length - 1) {
				var p = b.default.internalMath(e, b.default.trimSpaces(f), 0);
				e.PushAll(p), e.i = s;
			}
		}
	}, k.Cr = function(e, t) {
		e.Push(e.itemFactory.create("cell").setProperties({
			isCR: !0,
			name: t
		}));
	}, k.CrLaTeX = function(e, t, n) {
		n === void 0 && (n = !1);
		var r;
		if (!n && (e.string.charAt(e.i) === "*" && e.i++, e.string.charAt(e.i) === "[")) {
			var i = e.GetBrackets(t, ""), a = s(b.default.matchDimen(i), 2), o = a[0], c = a[1];
			if (i && !o) throw new g.default("BracketMustBeDimension", "Bracket argument to %1 must be a dimension", e.currentCS);
			r = o + c;
		}
		e.Push(e.itemFactory.create("cell").setProperties({
			isCR: !0,
			name: t,
			linebreak: !0
		}));
		var u = e.stack.Top(), d;
		u instanceof l.ArrayItem ? r && u.addRowSpacing(r) : (r && (d = e.create("node", "mspace", [], { depth: r }), e.Push(d)), d = e.create("node", "mspace", [], { linebreak: y.TexConstant.LineBreak.NEWLINE }), e.Push(d));
	}, k.HLine = function(e, t, n) {
		n ??= "solid";
		var r = e.stack.Top();
		if (!(r instanceof l.ArrayItem) || r.Size()) throw new g.default("Misplaced", "Misplaced %1", e.currentCS);
		if (!r.table.length) r.frame.push("top");
		else {
			for (var i = r.arraydef.rowlines ? r.arraydef.rowlines.split(/ /) : []; i.length < r.table.length;) i.push("none");
			i[r.table.length - 1] = n, r.arraydef.rowlines = i.join(" ");
		}
	}, k.HFill = function(e, t) {
		var n = e.stack.Top();
		if (n instanceof l.ArrayItem) n.hfill.push(n.Size());
		else throw new g.default("UnsupportedHFill", "Unsupported use of %1", e.currentCS);
	}, k.BeginEnd = function(e, t) {
		var n = e.GetArgument(t);
		if (n.match(/\\/i)) throw new g.default("InvalidEnv", "Invalid environment name '%1'", n);
		var r = e.configuration.handlers.get("environment").lookup(n);
		if (r && t === "\\end") {
			if (!r.args[0]) {
				var i = e.itemFactory.create("end").setProperty("name", n);
				e.Push(i);
				return;
			}
			e.stack.env.closing = n;
		}
		b.default.checkMaxMacros(e, !1), e.parse("environment", [e, n]);
	}, k.Array = function(e, t, n, r, i, a, o, s, c) {
		i ||= e.GetArgument("\\begin{" + t.getName() + "}");
		var l = ("c" + i).replace(/[^clr|:]/g, "").replace(/[^|:]([|:])+/g, "$1");
		i = i.replace(/[^clr]/g, "").split("").join(" "), i = i.replace(/l/g, "left").replace(/r/g, "right").replace(/c/g, "center");
		var u = e.itemFactory.create("array");
		return u.arraydef = {
			columnalign: i,
			columnspacing: a || "1em",
			rowspacing: o || "4pt"
		}, l.match(/[|:]/) && (l.charAt(0).match(/[|:]/) && (u.frame.push("left"), u.dashed = l.charAt(0) === ":"), l.charAt(l.length - 1).match(/[|:]/) && u.frame.push("right"), l = l.substr(1, l.length - 2), u.arraydef.columnlines = l.split("").join(" ").replace(/[^|: ]/g, "none").replace(/\|/g, "solid").replace(/:/g, "dashed")), n && u.setProperty("open", e.convertDelimiter(n)), r && u.setProperty("close", e.convertDelimiter(r)), (s || "").charAt(1) === "'" && (u.arraydef["data-cramped"] = !0, s = s.charAt(0)), s === "D" ? u.arraydef.displaystyle = !0 : s && (u.arraydef.displaystyle = !1), s === "S" && (u.arraydef.scriptlevel = 1), c && (u.arraydef.useHeight = !1), e.Push(t), u;
	}, k.AlignedArray = function(e, t) {
		var n = e.GetBrackets("\\begin{" + t.getName() + "}"), r = k.Array(e, t);
		return b.default.setArrayAlign(r, n);
	}, k.Equation = function(e, t, n) {
		return e.Push(t), b.default.checkEqnEnv(e), e.itemFactory.create("equation", n).setProperty("name", t.getName());
	}, k.EqnArray = function(e, t, n, r, i, a) {
		e.Push(t), r && b.default.checkEqnEnv(e), i = i.replace(/[^clr]/g, "").split("").join(" "), i = i.replace(/l/g, "left").replace(/r/g, "right").replace(/c/g, "center");
		var o = e.itemFactory.create("eqnarray", t.getName(), n, r, e.stack.global);
		return o.arraydef = {
			displaystyle: !0,
			columnalign: i,
			columnspacing: a || "1em",
			rowspacing: "3pt",
			side: e.options.tagSide,
			minlabelspacing: e.options.tagIndent
		}, o;
	}, k.HandleNoTag = function(e, t) {
		e.tags.notag();
	}, k.HandleLabel = function(e, t) {
		var n = e.GetArgument(t);
		if (n !== "" && !e.tags.refUpdate) {
			if (e.tags.label) throw new g.default("MultipleCommand", "Multiple %1", e.currentCS);
			if (e.tags.label = n, (e.tags.allLabels[n] || e.tags.labels[n]) && !e.options.ignoreDuplicateLabels) throw new g.default("MultipleLabel", "Label '%1' multiply defined", n);
			e.tags.labels[n] = new C.Label();
		}
	}, k.HandleRef = function(e, t, n) {
		var r = e.GetArgument(t), i = e.tags.allLabels[r] || e.tags.labels[r];
		i ||= (e.tags.refUpdate || (e.tags.redo = !0), new C.Label());
		var a = i.tag;
		n && (a = e.tags.formatTag(a));
		var o = e.create("node", "mrow", b.default.internalMath(e, a), {
			href: e.tags.formatUrl(i.id, e.options.baseURL),
			class: "MathJax_ref"
		});
		e.Push(o);
	}, k.Macro = function(e, t, n, r, i) {
		if (r) {
			var a = [];
			if (i != null) {
				var o = e.GetBrackets(t);
				a.push(o ?? i);
			}
			for (var s = a.length; s < r; s++) a.push(e.GetArgument(t));
			n = b.default.substituteArgs(e, a, n);
		}
		e.string = b.default.addArgs(e, n, e.string.slice(e.i)), e.i = 0, b.default.checkMaxMacros(e);
	}, k.MathChoice = function(e, t) {
		var n = e.ParseArg(t), r = e.ParseArg(t), i = e.ParseArg(t), a = e.ParseArg(t);
		e.Push(e.create("node", "MathChoice", [
			n,
			r,
			i,
			a
		]));
	}, e.default = k;
})), A = /* @__PURE__ */ e(((e) => {
	var t = e && e.__read || function(e, t) {
		var n = typeof Symbol == "function" && e[Symbol.iterator];
		if (!n) return e;
		var r = n.call(e), i, a = [], o;
		try {
			for (; (t === void 0 || t-- > 0) && !(i = r.next()).done;) a.push(i.value);
		} catch (e) {
			o = { error: e };
		} finally {
			try {
				i && !i.done && (n = r.return) && n.call(r);
			} finally {
				if (o) throw o.error;
			}
		}
		return a;
	}, n = e && e.__spreadArray || function(e, t, n) {
		if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++) (a || !(r in t)) && (a ||= Array.prototype.slice.call(t, 0, r), a[r] = t[r]);
		return e.concat(a || Array.prototype.slice.call(t));
	}, r = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 });
	var i = r(d()), a = O(), o = r(h()), s;
	(function(e) {
		function r(e, t) {
			var n = o.default.getFontDef(e), r = e.stack.env;
			r.multiLetterIdentifiers && r.font !== "" && (t = e.string.substr(e.i - 1).match(r.multiLetterIdentifiers)[0], e.i += t.length - 1, n.mathvariant === a.TexConstant.Variant.NORMAL && r.noAutoOP && t.length > 1 && (n.autoOP = !1));
			var i = e.create("token", "mi", n, t);
			e.Push(i);
		}
		e.variable = r;
		function s(e, t) {
			var n, r = e.configuration.options.digits, i = e.string.slice(e.i - 1).match(r), a = o.default.getFontDef(e);
			i ? (n = e.create("token", "mn", a, i[0].replace(/[{}]/g, "")), e.i += i[0].length - 1) : n = e.create("token", "mo", a, t), e.Push(n);
		}
		e.digit = s;
		function c(e, t) {
			var n = e.GetCS();
			e.parse("macro", [e, n]);
		}
		e.controlSequence = c;
		function l(e, t) {
			var n = t.attributes || { mathvariant: a.TexConstant.Variant.ITALIC }, r = e.create("token", "mi", n, t.char);
			e.Push(r);
		}
		e.mathchar0mi = l;
		function u(e, t) {
			var n = t.attributes || {};
			n.stretchy = !1;
			var r = e.create("token", "mo", n, t.char);
			i.default.setProperty(r, "fixStretchy", !0), e.configuration.addNode("fixStretchy", r), e.Push(r);
		}
		e.mathchar0mo = u;
		function d(e, t) {
			var n = t.attributes || { mathvariant: a.TexConstant.Variant.NORMAL };
			e.stack.env.font && (n.mathvariant = e.stack.env.font);
			var r = e.create("token", "mi", n, t.char);
			e.Push(r);
		}
		e.mathchar7 = d;
		function f(e, t) {
			var n = t.attributes || {};
			n = Object.assign({
				fence: !1,
				stretchy: !1
			}, n);
			var r = e.create("token", "mo", n, t.char);
			e.Push(r);
		}
		e.delimiter = f;
		function p(e, r, i, a) {
			var o = a[0], s = e.itemFactory.create("begin").setProperties({
				name: r,
				end: o
			});
			s = i.apply(void 0, n([e, s], t(a.slice(1)), !1)), e.Push(s);
		}
		e.environment = p;
	})(s ||= {}), e.default = s;
})), j = /* @__PURE__ */ e(((e) => {
	var t = e && e.__createBinding || (Object.create ? (function(e, t, n, r) {
		r === void 0 && (r = n);
		var i = Object.getOwnPropertyDescriptor(t, n);
		(!i || ("get" in i ? !t.__esModule : i.writable || i.configurable)) && (i = {
			enumerable: !0,
			get: function() {
				return t[n];
			}
		}), Object.defineProperty(e, r, i);
	}) : (function(e, t, n, r) {
		r === void 0 && (r = n), e[r] = t[n];
	})), n = e && e.__setModuleDefault || (Object.create ? (function(e, t) {
		Object.defineProperty(e, "default", {
			enumerable: !0,
			value: t
		});
	}) : function(e, t) {
		e.default = t;
	}), r = e && e.__importStar || function(e) {
		if (e && e.__esModule) return e;
		var r = {};
		if (e != null) for (var i in e) i !== "default" && Object.prototype.hasOwnProperty.call(e, i) && t(r, e, i);
		return n(r, e), r;
	}, i = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 });
	var o = r(E()), s = O(), c = i(k()), l = i(A()), d = i(h()), f = a(), p = u();
	new o.RegExpMap("letter", l.default.variable, /[a-z]/i), new o.RegExpMap("digit", l.default.digit, /[0-9.,]/), new o.RegExpMap("command", l.default.controlSequence, /^\\/), new o.MacroMap("special", {
		"{": "Open",
		"}": "Close",
		"~": "Tilde",
		"^": "Superscript",
		_: "Subscript",
		" ": "Space",
		"	": "Space",
		"\r": "Space",
		"\n": "Space",
		"'": "Prime",
		"%": "Comment",
		"&": "Entry",
		"#": "Hash",
		"\xA0": "Space",
		"’": "Prime"
	}, c.default), new o.CharacterMap("mathchar0mi", l.default.mathchar0mi, {
		alpha: "α",
		beta: "β",
		gamma: "γ",
		delta: "δ",
		epsilon: "ϵ",
		zeta: "ζ",
		eta: "η",
		theta: "θ",
		iota: "ι",
		kappa: "κ",
		lambda: "λ",
		mu: "μ",
		nu: "ν",
		xi: "ξ",
		omicron: "ο",
		pi: "π",
		rho: "ρ",
		sigma: "σ",
		tau: "τ",
		upsilon: "υ",
		phi: "ϕ",
		chi: "χ",
		psi: "ψ",
		omega: "ω",
		varepsilon: "ε",
		vartheta: "ϑ",
		varpi: "ϖ",
		varrho: "ϱ",
		varsigma: "ς",
		varphi: "φ",
		S: ["§", { mathvariant: s.TexConstant.Variant.NORMAL }],
		aleph: ["ℵ", { mathvariant: s.TexConstant.Variant.NORMAL }],
		hbar: ["ℏ", { variantForm: !0 }],
		imath: "ı",
		jmath: "ȷ",
		ell: "ℓ",
		wp: ["℘", { mathvariant: s.TexConstant.Variant.NORMAL }],
		Re: ["ℜ", { mathvariant: s.TexConstant.Variant.NORMAL }],
		Im: ["ℑ", { mathvariant: s.TexConstant.Variant.NORMAL }],
		partial: ["∂", { mathvariant: s.TexConstant.Variant.ITALIC }],
		infty: ["∞", { mathvariant: s.TexConstant.Variant.NORMAL }],
		prime: ["′", { variantForm: !0 }],
		emptyset: ["∅", { mathvariant: s.TexConstant.Variant.NORMAL }],
		nabla: ["∇", { mathvariant: s.TexConstant.Variant.NORMAL }],
		top: ["⊤", { mathvariant: s.TexConstant.Variant.NORMAL }],
		bot: ["⊥", { mathvariant: s.TexConstant.Variant.NORMAL }],
		angle: ["∠", { mathvariant: s.TexConstant.Variant.NORMAL }],
		triangle: ["△", { mathvariant: s.TexConstant.Variant.NORMAL }],
		backslash: ["∖", { mathvariant: s.TexConstant.Variant.NORMAL }],
		forall: ["∀", { mathvariant: s.TexConstant.Variant.NORMAL }],
		exists: ["∃", { mathvariant: s.TexConstant.Variant.NORMAL }],
		neg: ["¬", { mathvariant: s.TexConstant.Variant.NORMAL }],
		lnot: ["¬", { mathvariant: s.TexConstant.Variant.NORMAL }],
		flat: ["♭", { mathvariant: s.TexConstant.Variant.NORMAL }],
		natural: ["♮", { mathvariant: s.TexConstant.Variant.NORMAL }],
		sharp: ["♯", { mathvariant: s.TexConstant.Variant.NORMAL }],
		clubsuit: ["♣", { mathvariant: s.TexConstant.Variant.NORMAL }],
		diamondsuit: ["♢", { mathvariant: s.TexConstant.Variant.NORMAL }],
		heartsuit: ["♡", { mathvariant: s.TexConstant.Variant.NORMAL }],
		spadesuit: ["♠", { mathvariant: s.TexConstant.Variant.NORMAL }]
	}), new o.CharacterMap("mathchar0mo", l.default.mathchar0mo, {
		surd: "√",
		coprod: ["∐", {
			texClass: f.TEXCLASS.OP,
			movesupsub: !0
		}],
		bigvee: ["⋁", {
			texClass: f.TEXCLASS.OP,
			movesupsub: !0
		}],
		bigwedge: ["⋀", {
			texClass: f.TEXCLASS.OP,
			movesupsub: !0
		}],
		biguplus: ["⨄", {
			texClass: f.TEXCLASS.OP,
			movesupsub: !0
		}],
		bigcap: ["⋂", {
			texClass: f.TEXCLASS.OP,
			movesupsub: !0
		}],
		bigcup: ["⋃", {
			texClass: f.TEXCLASS.OP,
			movesupsub: !0
		}],
		int: ["∫", { texClass: f.TEXCLASS.OP }],
		intop: ["∫", {
			texClass: f.TEXCLASS.OP,
			movesupsub: !0,
			movablelimits: !0
		}],
		iint: ["∬", { texClass: f.TEXCLASS.OP }],
		iiint: ["∭", { texClass: f.TEXCLASS.OP }],
		prod: ["∏", {
			texClass: f.TEXCLASS.OP,
			movesupsub: !0
		}],
		sum: ["∑", {
			texClass: f.TEXCLASS.OP,
			movesupsub: !0
		}],
		bigotimes: ["⨂", {
			texClass: f.TEXCLASS.OP,
			movesupsub: !0
		}],
		bigoplus: ["⨁", {
			texClass: f.TEXCLASS.OP,
			movesupsub: !0
		}],
		bigodot: ["⨀", {
			texClass: f.TEXCLASS.OP,
			movesupsub: !0
		}],
		oint: ["∮", { texClass: f.TEXCLASS.OP }],
		bigsqcup: ["⨆", {
			texClass: f.TEXCLASS.OP,
			movesupsub: !0
		}],
		smallint: ["∫", { largeop: !1 }],
		triangleleft: "◃",
		triangleright: "▹",
		bigtriangleup: "△",
		bigtriangledown: "▽",
		wedge: "∧",
		land: "∧",
		vee: "∨",
		lor: "∨",
		cap: "∩",
		cup: "∪",
		ddagger: "‡",
		dagger: "†",
		sqcap: "⊓",
		sqcup: "⊔",
		uplus: "⊎",
		amalg: "⨿",
		diamond: "⋄",
		bullet: "∙",
		wr: "≀",
		div: "÷",
		divsymbol: "÷",
		odot: ["⊙", { largeop: !1 }],
		oslash: ["⊘", { largeop: !1 }],
		otimes: ["⊗", { largeop: !1 }],
		ominus: ["⊖", { largeop: !1 }],
		oplus: ["⊕", { largeop: !1 }],
		mp: "∓",
		pm: "±",
		circ: "∘",
		bigcirc: "◯",
		setminus: "∖",
		cdot: "⋅",
		ast: "∗",
		times: "×",
		star: "⋆",
		propto: "∝",
		sqsubseteq: "⊑",
		sqsupseteq: "⊒",
		parallel: "∥",
		mid: "∣",
		dashv: "⊣",
		vdash: "⊢",
		leq: "≤",
		le: "≤",
		geq: "≥",
		ge: "≥",
		lt: "<",
		gt: ">",
		succ: "≻",
		prec: "≺",
		approx: "≈",
		succeq: "⪰",
		preceq: "⪯",
		supset: "⊃",
		subset: "⊂",
		supseteq: "⊇",
		subseteq: "⊆",
		in: "∈",
		ni: "∋",
		notin: "∉",
		owns: "∋",
		gg: "≫",
		ll: "≪",
		sim: "∼",
		simeq: "≃",
		perp: "⊥",
		equiv: "≡",
		asymp: "≍",
		smile: "⌣",
		frown: "⌢",
		ne: "≠",
		neq: "≠",
		cong: "≅",
		doteq: "≐",
		bowtie: "⋈",
		models: "⊨",
		notChar: "⧸",
		Leftrightarrow: "⇔",
		Leftarrow: "⇐",
		Rightarrow: "⇒",
		leftrightarrow: "↔",
		leftarrow: "←",
		gets: "←",
		rightarrow: "→",
		to: ["→", { accent: !1 }],
		mapsto: "↦",
		leftharpoonup: "↼",
		leftharpoondown: "↽",
		rightharpoonup: "⇀",
		rightharpoondown: "⇁",
		nearrow: "↗",
		searrow: "↘",
		nwarrow: "↖",
		swarrow: "↙",
		rightleftharpoons: "⇌",
		hookrightarrow: "↪",
		hookleftarrow: "↩",
		longleftarrow: "⟵",
		Longleftarrow: "⟸",
		longrightarrow: "⟶",
		Longrightarrow: "⟹",
		Longleftrightarrow: "⟺",
		longleftrightarrow: "⟷",
		longmapsto: "⟼",
		ldots: "…",
		cdots: "⋯",
		vdots: "⋮",
		ddots: "⋱",
		dotsc: "…",
		dotsb: "⋯",
		dotsm: "⋯",
		dotsi: "⋯",
		dotso: "…",
		ldotp: [".", { texClass: f.TEXCLASS.PUNCT }],
		cdotp: ["⋅", { texClass: f.TEXCLASS.PUNCT }],
		colon: [":", { texClass: f.TEXCLASS.PUNCT }]
	}), new o.CharacterMap("mathchar7", l.default.mathchar7, {
		Gamma: "Γ",
		Delta: "Δ",
		Theta: "Θ",
		Lambda: "Λ",
		Xi: "Ξ",
		Pi: "Π",
		Sigma: "Σ",
		Upsilon: "Υ",
		Phi: "Φ",
		Psi: "Ψ",
		Omega: "Ω",
		_: "_",
		"#": "#",
		$: "$",
		"%": "%",
		"&": "&",
		And: "&"
	}), new o.DelimiterMap("delimiter", l.default.delimiter, {
		"(": "(",
		")": ")",
		"[": "[",
		"]": "]",
		"<": "⟨",
		">": "⟩",
		"\\lt": "⟨",
		"\\gt": "⟩",
		"/": "/",
		"|": ["|", { texClass: f.TEXCLASS.ORD }],
		".": "",
		"\\\\": "\\",
		"\\lmoustache": "⎰",
		"\\rmoustache": "⎱",
		"\\lgroup": "⟮",
		"\\rgroup": "⟯",
		"\\arrowvert": "⏐",
		"\\Arrowvert": "‖",
		"\\bracevert": "⎪",
		"\\Vert": ["‖", { texClass: f.TEXCLASS.ORD }],
		"\\|": ["‖", { texClass: f.TEXCLASS.ORD }],
		"\\vert": ["|", { texClass: f.TEXCLASS.ORD }],
		"\\uparrow": "↑",
		"\\downarrow": "↓",
		"\\updownarrow": "↕",
		"\\Uparrow": "⇑",
		"\\Downarrow": "⇓",
		"\\Updownarrow": "⇕",
		"\\backslash": "\\",
		"\\rangle": "⟩",
		"\\langle": "⟨",
		"\\rbrace": "}",
		"\\lbrace": "{",
		"\\}": "}",
		"\\{": "{",
		"\\rceil": "⌉",
		"\\lceil": "⌈",
		"\\rfloor": "⌋",
		"\\lfloor": "⌊",
		"\\lbrack": "[",
		"\\rbrack": "]"
	}), new o.CommandMap("macros", {
		displaystyle: [
			"SetStyle",
			"D",
			!0,
			0
		],
		textstyle: [
			"SetStyle",
			"T",
			!1,
			0
		],
		scriptstyle: [
			"SetStyle",
			"S",
			!1,
			1
		],
		scriptscriptstyle: [
			"SetStyle",
			"SS",
			!1,
			2
		],
		rm: ["SetFont", s.TexConstant.Variant.NORMAL],
		mit: ["SetFont", s.TexConstant.Variant.ITALIC],
		oldstyle: ["SetFont", s.TexConstant.Variant.OLDSTYLE],
		cal: ["SetFont", s.TexConstant.Variant.CALLIGRAPHIC],
		it: ["SetFont", s.TexConstant.Variant.MATHITALIC],
		bf: ["SetFont", s.TexConstant.Variant.BOLD],
		bbFont: ["SetFont", s.TexConstant.Variant.DOUBLESTRUCK],
		scr: ["SetFont", s.TexConstant.Variant.SCRIPT],
		frak: ["SetFont", s.TexConstant.Variant.FRAKTUR],
		sf: ["SetFont", s.TexConstant.Variant.SANSSERIF],
		tt: ["SetFont", s.TexConstant.Variant.MONOSPACE],
		mathrm: ["MathFont", s.TexConstant.Variant.NORMAL],
		mathup: ["MathFont", s.TexConstant.Variant.NORMAL],
		mathnormal: ["MathFont", ""],
		mathbf: ["MathFont", s.TexConstant.Variant.BOLD],
		mathbfup: ["MathFont", s.TexConstant.Variant.BOLD],
		mathit: ["MathFont", s.TexConstant.Variant.MATHITALIC],
		mathbfit: ["MathFont", s.TexConstant.Variant.BOLDITALIC],
		mathbb: ["MathFont", s.TexConstant.Variant.DOUBLESTRUCK],
		Bbb: ["MathFont", s.TexConstant.Variant.DOUBLESTRUCK],
		mathfrak: ["MathFont", s.TexConstant.Variant.FRAKTUR],
		mathbffrak: ["MathFont", s.TexConstant.Variant.BOLDFRAKTUR],
		mathscr: ["MathFont", s.TexConstant.Variant.SCRIPT],
		mathbfscr: ["MathFont", s.TexConstant.Variant.BOLDSCRIPT],
		mathsf: ["MathFont", s.TexConstant.Variant.SANSSERIF],
		mathsfup: ["MathFont", s.TexConstant.Variant.SANSSERIF],
		mathbfsf: ["MathFont", s.TexConstant.Variant.BOLDSANSSERIF],
		mathbfsfup: ["MathFont", s.TexConstant.Variant.BOLDSANSSERIF],
		mathsfit: ["MathFont", s.TexConstant.Variant.SANSSERIFITALIC],
		mathbfsfit: ["MathFont", s.TexConstant.Variant.SANSSERIFBOLDITALIC],
		mathtt: ["MathFont", s.TexConstant.Variant.MONOSPACE],
		mathcal: ["MathFont", s.TexConstant.Variant.CALLIGRAPHIC],
		mathbfcal: ["MathFont", s.TexConstant.Variant.BOLDCALLIGRAPHIC],
		symrm: ["MathFont", s.TexConstant.Variant.NORMAL],
		symup: ["MathFont", s.TexConstant.Variant.NORMAL],
		symnormal: ["MathFont", ""],
		symbf: ["MathFont", s.TexConstant.Variant.BOLD],
		symbfup: ["MathFont", s.TexConstant.Variant.BOLD],
		symit: ["MathFont", s.TexConstant.Variant.ITALIC],
		symbfit: ["MathFont", s.TexConstant.Variant.BOLDITALIC],
		symbb: ["MathFont", s.TexConstant.Variant.DOUBLESTRUCK],
		symfrak: ["MathFont", s.TexConstant.Variant.FRAKTUR],
		symbffrak: ["MathFont", s.TexConstant.Variant.BOLDFRAKTUR],
		symscr: ["MathFont", s.TexConstant.Variant.SCRIPT],
		symbfscr: ["MathFont", s.TexConstant.Variant.BOLDSCRIPT],
		symsf: ["MathFont", s.TexConstant.Variant.SANSSERIF],
		symsfup: ["MathFont", s.TexConstant.Variant.SANSSERIF],
		symbfsf: ["MathFont", s.TexConstant.Variant.BOLDSANSSERIF],
		symbfsfup: ["MathFont", s.TexConstant.Variant.BOLDSANSSERIF],
		symsfit: ["MathFont", s.TexConstant.Variant.SANSSERIFITALIC],
		symbfsfit: ["MathFont", s.TexConstant.Variant.SANSSERIFBOLDITALIC],
		symtt: ["MathFont", s.TexConstant.Variant.MONOSPACE],
		symcal: ["MathFont", s.TexConstant.Variant.CALLIGRAPHIC],
		symbfcal: ["MathFont", s.TexConstant.Variant.BOLDCALLIGRAPHIC],
		textrm: [
			"HBox",
			null,
			s.TexConstant.Variant.NORMAL
		],
		textup: [
			"HBox",
			null,
			s.TexConstant.Variant.NORMAL
		],
		textnormal: ["HBox"],
		textit: [
			"HBox",
			null,
			s.TexConstant.Variant.ITALIC
		],
		textbf: [
			"HBox",
			null,
			s.TexConstant.Variant.BOLD
		],
		textsf: [
			"HBox",
			null,
			s.TexConstant.Variant.SANSSERIF
		],
		texttt: [
			"HBox",
			null,
			s.TexConstant.Variant.MONOSPACE
		],
		tiny: ["SetSize", .5],
		Tiny: ["SetSize", .6],
		scriptsize: ["SetSize", .7],
		small: ["SetSize", .85],
		normalsize: ["SetSize", 1],
		large: ["SetSize", 1.2],
		Large: ["SetSize", 1.44],
		LARGE: ["SetSize", 1.73],
		huge: ["SetSize", 2.07],
		Huge: ["SetSize", 2.49],
		arcsin: "NamedFn",
		arccos: "NamedFn",
		arctan: "NamedFn",
		arg: "NamedFn",
		cos: "NamedFn",
		cosh: "NamedFn",
		cot: "NamedFn",
		coth: "NamedFn",
		csc: "NamedFn",
		deg: "NamedFn",
		det: "NamedOp",
		dim: "NamedFn",
		exp: "NamedFn",
		gcd: "NamedOp",
		hom: "NamedFn",
		inf: "NamedOp",
		ker: "NamedFn",
		lg: "NamedFn",
		lim: "NamedOp",
		liminf: ["NamedOp", "lim&thinsp;inf"],
		limsup: ["NamedOp", "lim&thinsp;sup"],
		ln: "NamedFn",
		log: "NamedFn",
		max: "NamedOp",
		min: "NamedOp",
		Pr: "NamedOp",
		sec: "NamedFn",
		sin: "NamedFn",
		sinh: "NamedFn",
		sup: "NamedOp",
		tan: "NamedFn",
		tanh: "NamedFn",
		limits: ["Limits", 1],
		nolimits: ["Limits", 0],
		overline: ["UnderOver", "2015"],
		underline: ["UnderOver", "2015"],
		overbrace: [
			"UnderOver",
			"23DE",
			1
		],
		underbrace: [
			"UnderOver",
			"23DF",
			1
		],
		overparen: ["UnderOver", "23DC"],
		underparen: ["UnderOver", "23DD"],
		overrightarrow: ["UnderOver", "2192"],
		underrightarrow: ["UnderOver", "2192"],
		overleftarrow: ["UnderOver", "2190"],
		underleftarrow: ["UnderOver", "2190"],
		overleftrightarrow: ["UnderOver", "2194"],
		underleftrightarrow: ["UnderOver", "2194"],
		overset: "Overset",
		underset: "Underset",
		overunderset: "Overunderset",
		stackrel: [
			"Macro",
			"\\mathrel{\\mathop{#2}\\limits^{#1}}",
			2
		],
		stackbin: [
			"Macro",
			"\\mathbin{\\mathop{#2}\\limits^{#1}}",
			2
		],
		over: "Over",
		overwithdelims: "Over",
		atop: "Over",
		atopwithdelims: "Over",
		above: "Over",
		abovewithdelims: "Over",
		brace: [
			"Over",
			"{",
			"}"
		],
		brack: [
			"Over",
			"[",
			"]"
		],
		choose: [
			"Over",
			"(",
			")"
		],
		frac: "Frac",
		sqrt: "Sqrt",
		root: "Root",
		uproot: ["MoveRoot", "upRoot"],
		leftroot: ["MoveRoot", "leftRoot"],
		left: "LeftRight",
		right: "LeftRight",
		middle: "LeftRight",
		llap: "Lap",
		rlap: "Lap",
		raise: "RaiseLower",
		lower: "RaiseLower",
		moveleft: "MoveLeftRight",
		moveright: "MoveLeftRight",
		",": ["Spacer", p.MATHSPACE.thinmathspace],
		":": ["Spacer", p.MATHSPACE.mediummathspace],
		">": ["Spacer", p.MATHSPACE.mediummathspace],
		";": ["Spacer", p.MATHSPACE.thickmathspace],
		"!": ["Spacer", p.MATHSPACE.negativethinmathspace],
		enspace: ["Spacer", .5],
		quad: ["Spacer", 1],
		qquad: ["Spacer", 2],
		thinspace: ["Spacer", p.MATHSPACE.thinmathspace],
		negthinspace: ["Spacer", p.MATHSPACE.negativethinmathspace],
		hskip: "Hskip",
		hspace: "Hskip",
		kern: "Hskip",
		mskip: "Hskip",
		mspace: "Hskip",
		mkern: "Hskip",
		rule: "rule",
		Rule: ["Rule"],
		Space: ["Rule", "blank"],
		nonscript: "Nonscript",
		big: [
			"MakeBig",
			f.TEXCLASS.ORD,
			.85
		],
		Big: [
			"MakeBig",
			f.TEXCLASS.ORD,
			1.15
		],
		bigg: [
			"MakeBig",
			f.TEXCLASS.ORD,
			1.45
		],
		Bigg: [
			"MakeBig",
			f.TEXCLASS.ORD,
			1.75
		],
		bigl: [
			"MakeBig",
			f.TEXCLASS.OPEN,
			.85
		],
		Bigl: [
			"MakeBig",
			f.TEXCLASS.OPEN,
			1.15
		],
		biggl: [
			"MakeBig",
			f.TEXCLASS.OPEN,
			1.45
		],
		Biggl: [
			"MakeBig",
			f.TEXCLASS.OPEN,
			1.75
		],
		bigr: [
			"MakeBig",
			f.TEXCLASS.CLOSE,
			.85
		],
		Bigr: [
			"MakeBig",
			f.TEXCLASS.CLOSE,
			1.15
		],
		biggr: [
			"MakeBig",
			f.TEXCLASS.CLOSE,
			1.45
		],
		Biggr: [
			"MakeBig",
			f.TEXCLASS.CLOSE,
			1.75
		],
		bigm: [
			"MakeBig",
			f.TEXCLASS.REL,
			.85
		],
		Bigm: [
			"MakeBig",
			f.TEXCLASS.REL,
			1.15
		],
		biggm: [
			"MakeBig",
			f.TEXCLASS.REL,
			1.45
		],
		Biggm: [
			"MakeBig",
			f.TEXCLASS.REL,
			1.75
		],
		mathord: ["TeXAtom", f.TEXCLASS.ORD],
		mathop: ["TeXAtom", f.TEXCLASS.OP],
		mathopen: ["TeXAtom", f.TEXCLASS.OPEN],
		mathclose: ["TeXAtom", f.TEXCLASS.CLOSE],
		mathbin: ["TeXAtom", f.TEXCLASS.BIN],
		mathrel: ["TeXAtom", f.TEXCLASS.REL],
		mathpunct: ["TeXAtom", f.TEXCLASS.PUNCT],
		mathinner: ["TeXAtom", f.TEXCLASS.INNER],
		vcenter: ["TeXAtom", f.TEXCLASS.VCENTER],
		buildrel: "BuildRel",
		hbox: ["HBox", 0],
		text: "HBox",
		mbox: ["HBox", 0],
		fbox: "FBox",
		boxed: [
			"Macro",
			"\\fbox{$\\displaystyle{#1}$}",
			1
		],
		framebox: "FrameBox",
		strut: "Strut",
		mathstrut: ["Macro", "\\vphantom{(}"],
		phantom: "Phantom",
		vphantom: [
			"Phantom",
			1,
			0
		],
		hphantom: [
			"Phantom",
			0,
			1
		],
		smash: "Smash",
		acute: ["Accent", "00B4"],
		grave: ["Accent", "0060"],
		ddot: ["Accent", "00A8"],
		tilde: ["Accent", "007E"],
		bar: ["Accent", "00AF"],
		breve: ["Accent", "02D8"],
		check: ["Accent", "02C7"],
		hat: ["Accent", "005E"],
		vec: ["Accent", "2192"],
		dot: ["Accent", "02D9"],
		widetilde: [
			"Accent",
			"007E",
			1
		],
		widehat: [
			"Accent",
			"005E",
			1
		],
		matrix: "Matrix",
		array: "Matrix",
		pmatrix: [
			"Matrix",
			"(",
			")"
		],
		cases: [
			"Matrix",
			"{",
			"",
			"left left",
			null,
			".1em",
			null,
			!0
		],
		eqalign: [
			"Matrix",
			null,
			null,
			"right left",
			(0, p.em)(p.MATHSPACE.thickmathspace),
			".5em",
			"D"
		],
		displaylines: [
			"Matrix",
			null,
			null,
			"center",
			null,
			".5em",
			"D"
		],
		cr: "Cr",
		"\\": "CrLaTeX",
		newline: ["CrLaTeX", !0],
		hline: ["HLine", "solid"],
		hdashline: ["HLine", "dashed"],
		eqalignno: [
			"Matrix",
			null,
			null,
			"right left",
			(0, p.em)(p.MATHSPACE.thickmathspace),
			".5em",
			"D",
			null,
			"right"
		],
		leqalignno: [
			"Matrix",
			null,
			null,
			"right left",
			(0, p.em)(p.MATHSPACE.thickmathspace),
			".5em",
			"D",
			null,
			"left"
		],
		hfill: "HFill",
		hfil: "HFill",
		hfilll: "HFill",
		bmod: ["Macro", "\\mmlToken{mo}[lspace=\"thickmathspace\" rspace=\"thickmathspace\"]{mod}"],
		pmod: [
			"Macro",
			"\\pod{\\mmlToken{mi}{mod}\\kern 6mu #1}",
			1
		],
		mod: [
			"Macro",
			"\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,#1",
			1
		],
		pod: [
			"Macro",
			"\\mathchoice{\\kern18mu}{\\kern8mu}{\\kern8mu}{\\kern8mu}(#1)",
			1
		],
		iff: ["Macro", "\\;\\Longleftrightarrow\\;"],
		skew: [
			"Macro",
			"{{#2{#3\\mkern#1mu}\\mkern-#1mu}{}}",
			3
		],
		pmb: [
			"Macro",
			"\\rlap{#1}\\kern1px{#1}",
			1
		],
		TeX: ["Macro", "T\\kern-.14em\\lower.5ex{E}\\kern-.115em X"],
		LaTeX: ["Macro", "L\\kern-.325em\\raise.21em{\\scriptstyle{A}}\\kern-.17em\\TeX"],
		" ": ["Macro", "\\text{ }"],
		not: "Not",
		dots: "Dots",
		space: "Tilde",
		"\xA0": "Tilde",
		begin: "BeginEnd",
		end: "BeginEnd",
		label: "HandleLabel",
		ref: "HandleRef",
		nonumber: "HandleNoTag",
		mathchoice: "MathChoice",
		mmlToken: "MmlToken"
	}, c.default), new o.EnvironmentMap("environment", l.default.environment, {
		array: ["AlignedArray"],
		equation: [
			"Equation",
			null,
			!0
		],
		eqnarray: [
			"EqnArray",
			null,
			!0,
			!0,
			"rcl",
			d.default.cols(0, p.MATHSPACE.thickmathspace),
			".5em"
		]
	}, c.default), new o.CharacterMap("not_remap", null, {
		"←": "↚",
		"→": "↛",
		"↔": "↮",
		"⇐": "⇍",
		"⇒": "⇏",
		"⇔": "⇎",
		"∈": "∉",
		"∋": "∌",
		"∣": "∤",
		"∥": "∦",
		"∼": "≁",
		"~": "≁",
		"≃": "≄",
		"≅": "≇",
		"≈": "≉",
		"≍": "≭",
		"=": "≠",
		"≡": "≢",
		"<": "≮",
		">": "≯",
		"≤": "≰",
		"≥": "≱",
		"≲": "≴",
		"≳": "≵",
		"≶": "≸",
		"≷": "≹",
		"≺": "⊀",
		"≻": "⊁",
		"⊂": "⊄",
		"⊃": "⊅",
		"⊆": "⊈",
		"⊇": "⊉",
		"⊢": "⊬",
		"⊨": "⊭",
		"⊩": "⊮",
		"⊫": "⊯",
		"≼": "⋠",
		"≽": "⋡",
		"⊑": "⋢",
		"⊒": "⋣",
		"⊲": "⋪",
		"⊳": "⋫",
		"⊴": "⋬",
		"⊵": "⋭",
		"∃": "∄"
	});
})), M = /* @__PURE__ */ e(((e) => {
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
	})(), n = e && e.__createBinding || (Object.create ? (function(e, t, n, r) {
		r === void 0 && (r = n);
		var i = Object.getOwnPropertyDescriptor(t, n);
		(!i || ("get" in i ? !t.__esModule : i.writable || i.configurable)) && (i = {
			enumerable: !0,
			get: function() {
				return t[n];
			}
		}), Object.defineProperty(e, r, i);
	}) : (function(e, t, n, r) {
		r === void 0 && (r = n), e[r] = t[n];
	})), r = e && e.__setModuleDefault || (Object.create ? (function(e, t) {
		Object.defineProperty(e, "default", {
			enumerable: !0,
			value: t
		});
	}) : function(e, t) {
		e.default = t;
	}), i = e && e.__importStar || function(e) {
		if (e && e.__esModule) return e;
		var t = {};
		if (e != null) for (var i in e) i !== "default" && Object.prototype.hasOwnProperty.call(e, i) && n(t, e, i);
		return r(t, e), t;
	}, a = e && e.__values || function(e) {
		var t = typeof Symbol == "function" && Symbol.iterator, n = t && e[t], r = 0;
		if (n) return n.call(e);
		if (e && typeof e.length == "number") return { next: function() {
			return e && r >= e.length && (e = void 0), {
				value: e && e[r++],
				done: !e
			};
		} };
		throw TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
	}, o = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	}, c;
	Object.defineProperty(e, "__esModule", { value: !0 }), e.BaseConfiguration = e.BaseTags = e.Other = void 0;
	var l = w(), u = C(), p = o(f()), m = o(d()), h = E(), g = i(D()), _ = S();
	j();
	var v = s();
	new h.CharacterMap("remap", null, {
		"-": "−",
		"*": "∗",
		"`": "‘"
	});
	function y(e, t) {
		var n = e.stack.env.font ? { mathvariant: e.stack.env.font } : {}, r = u.MapHandler.getMap("remap").lookup(t), i = (0, v.getRange)(t), a = i ? i[3] : "mo", o = e.create("token", a, n, r ? r.char : t);
		i[4] && o.attributes.set("mathvariant", i[4]), a === "mo" && (m.default.setProperty(o, "fixStretchy", !0), e.configuration.addNode("fixStretchy", o)), e.Push(o);
	}
	e.Other = y;
	function b(e, t) {
		throw new p.default("UndefinedControlSequence", "Undefined control sequence %1", "\\" + t);
	}
	function x(e, t) {
		throw new p.default("UnknownEnv", "Unknown environment '%1'", t);
	}
	function T(e) {
		var t, n, r = e.data;
		try {
			for (var i = a(r.getList("nonscript")), o = i.next(); !o.done; o = i.next()) {
				var s = o.value;
				if (s.attributes.get("scriptlevel") > 0) {
					var c = s.parent;
					if (c.childNodes.splice(c.childIndex(s), 1), r.removeFromList(s.kind, [s]), s.isKind("mrow")) {
						var l = s.childNodes[0];
						r.removeFromList("mstyle", [l]), r.removeFromList("mspace", l.childNodes[0].childNodes);
					}
				} else s.isKind("mrow") && (s.parent.replaceChild(s.childNodes[0], s), r.removeFromList("mrow", [s]));
			}
		} catch (e) {
			t = { error: e };
		} finally {
			try {
				o && !o.done && (n = i.return) && n.call(i);
			} finally {
				if (t) throw t.error;
			}
		}
	}
	var O = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return n;
	}(_.AbstractTags);
	e.BaseTags = O, e.BaseConfiguration = l.Configuration.create("base", {
		handler: {
			character: [
				"command",
				"special",
				"letter",
				"digit"
			],
			delimiter: ["delimiter"],
			macro: [
				"delimiter",
				"macros",
				"mathchar0mi",
				"mathchar0mo",
				"mathchar7"
			],
			environment: ["environment"]
		},
		fallback: {
			character: y,
			macro: b,
			environment: x
		},
		items: (c = {}, c[g.StartItem.prototype.kind] = g.StartItem, c[g.StopItem.prototype.kind] = g.StopItem, c[g.OpenItem.prototype.kind] = g.OpenItem, c[g.CloseItem.prototype.kind] = g.CloseItem, c[g.PrimeItem.prototype.kind] = g.PrimeItem, c[g.SubsupItem.prototype.kind] = g.SubsupItem, c[g.OverItem.prototype.kind] = g.OverItem, c[g.LeftItem.prototype.kind] = g.LeftItem, c[g.Middle.prototype.kind] = g.Middle, c[g.RightItem.prototype.kind] = g.RightItem, c[g.BeginItem.prototype.kind] = g.BeginItem, c[g.EndItem.prototype.kind] = g.EndItem, c[g.StyleItem.prototype.kind] = g.StyleItem, c[g.PositionItem.prototype.kind] = g.PositionItem, c[g.CellItem.prototype.kind] = g.CellItem, c[g.MmlItem.prototype.kind] = g.MmlItem, c[g.FnItem.prototype.kind] = g.FnItem, c[g.NotItem.prototype.kind] = g.NotItem, c[g.NonscriptItem.prototype.kind] = g.NonscriptItem, c[g.DotsItem.prototype.kind] = g.DotsItem, c[g.ArrayItem.prototype.kind] = g.ArrayItem, c[g.EqnArrayItem.prototype.kind] = g.EqnArrayItem, c[g.EquationItem.prototype.kind] = g.EquationItem, c),
		options: {
			maxMacros: 1e3,
			baseURL: typeof document > "u" || document.getElementsByTagName("base").length === 0 ? "" : String(document.location).replace(/#.*$/, "")
		},
		tags: { base: O },
		postprocessors: [[T, -4]]
	});
}));
//#endregion
export { f as _, D as a, w as c, b as d, v as f, m as g, h, O as i, S as l, g as m, A as n, E as o, _ as p, k as r, T as s, M as t, x as u, d as v };
