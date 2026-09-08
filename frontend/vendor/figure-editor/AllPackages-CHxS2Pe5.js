import { t as e } from "./index.js";
import { n as t } from "./mathjax-CVxQUBnW.js";
import { c as n, i as r } from "./mo-Dc4wDYuI.js";
import { _ as i, a, c as o, d as s, f as c, g as l, h as u, i as d, l as f, m as p, n as m, o as h, p as g, r as _, s as v, t as y, u as b, v as x } from "./BaseConfiguration-D6XxvD-h.js";
import { t as S } from "./lengths-BaAVnJyO.js";
//#region node_modules/mathjax-full/js/input/tex/action/ActionConfiguration.js
var C = /* @__PURE__ */ e(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.ActionConfiguration = e.ActionMethods = void 0;
	var n = o(), r = t(g()), i = h(), a = t(_());
	e.ActionMethods = {}, e.ActionMethods.Macro = a.default.Macro, e.ActionMethods.Toggle = function(e, t) {
		for (var n = [], i; (i = e.GetArgument(t)) !== "\\endtoggle";) n.push(new r.default(i, e.stack.env, e.configuration).mml());
		e.Push(e.create("node", "maction", n, { actiontype: "toggle" }));
	}, e.ActionMethods.Mathtip = function(e, t) {
		var n = e.ParseArg(t), r = e.ParseArg(t);
		e.Push(e.create("node", "maction", [n, r], { actiontype: "tooltip" }));
	}, new i.CommandMap("action-macros", {
		toggle: "Toggle",
		mathtip: "Mathtip",
		texttip: [
			"Macro",
			"\\mathtip{#1}{\\text{#2}}",
			2
		]
	}, e.ActionMethods), e.ActionConfiguration = n.Configuration.create("action", { handler: { macro: ["action-macros"] } });
})), w = /* @__PURE__ */ e(((e) => {
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
	})(), n = e && e.__assign || function() {
		return n = Object.assign || function(e) {
			for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
			return e;
		}, n.apply(this, arguments);
	}, r = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.FlalignItem = e.MultlineItem = void 0;
	var o = a(), s = r(u()), c = r(x()), l = r(i()), f = d();
	e.MultlineItem = function(e) {
		t(n, e);
		function n(t) {
			var n = [...arguments].slice(1), r = e.call(this, t) || this;
			return r.factory.configuration.tags.start("multline", !0, n[0]), r;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "multline";
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.EndEntry = function() {
			this.table.length && s.default.fixInitialMO(this.factory.configuration, this.nodes);
			var e = this.getProperty("shove"), t = this.create("node", "mtd", this.nodes, e ? { columnalign: e } : {});
			this.setProperty("shove", null), this.row.push(t), this.Clear();
		}, n.prototype.EndRow = function() {
			if (this.row.length !== 1) throw new l.default("MultlineRowsOneCol", "The rows within the %1 environment must have exactly one column", "multline");
			var e = this.create("node", "mtr", this.row);
			this.table.push(e), this.row = [];
		}, n.prototype.EndTable = function() {
			if (e.prototype.EndTable.call(this), this.table.length) {
				var t = this.table.length - 1, n = -1;
				c.default.getAttribute(c.default.getChildren(this.table[0])[0], "columnalign") || c.default.setAttribute(c.default.getChildren(this.table[0])[0], "columnalign", f.TexConstant.Align.LEFT), c.default.getAttribute(c.default.getChildren(this.table[t])[0], "columnalign") || c.default.setAttribute(c.default.getChildren(this.table[t])[0], "columnalign", f.TexConstant.Align.RIGHT);
				var r = this.factory.configuration.tags.getTag();
				if (r) {
					n = this.arraydef.side === f.TexConstant.Align.LEFT ? 0 : this.table.length - 1;
					var i = this.table[n], a = this.create("node", "mlabeledtr", [r].concat(c.default.getChildren(i)));
					c.default.copyAttributes(i, a), this.table[n] = a;
				}
			}
			this.factory.configuration.tags.end();
		}, n;
	}(o.ArrayItem), e.FlalignItem = function(e) {
		t(r, e);
		function r(t, n, r, i, a) {
			var o = e.call(this, t) || this;
			return o.name = n, o.numbered = r, o.padded = i, o.center = a, o.factory.configuration.tags.start(n, r, r), o;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "flalign";
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.EndEntry = function() {
			e.prototype.EndEntry.call(this);
			var t = this.getProperty("xalignat");
			if (t && this.row.length > t) throw new l.default("XalignOverflow", "Extra %1 in row of %2", "&", this.name);
		}, r.prototype.EndRow = function() {
			for (var t, r = this.row, i = this.getProperty("xalignat"); r.length < i;) r.push(this.create("node", "mtd"));
			for (this.row = [], this.padded && this.row.push(this.create("node", "mtd")); t = r.shift();) this.row.push(t), t = r.shift(), t && this.row.push(t), (r.length || this.padded) && this.row.push(this.create("node", "mtd"));
			this.row.length > this.maxrow && (this.maxrow = this.row.length), e.prototype.EndRow.call(this);
			var a = this.table[this.table.length - 1];
			if (this.getProperty("zeroWidthLabel") && a.isKind("mlabeledtr")) {
				var o = c.default.getChildren(a)[0], s = this.factory.configuration.options.tagSide, l = n({ width: 0 }, s === "right" ? { lspace: "-1width" } : {}), u = this.create("node", "mpadded", c.default.getChildren(o), l);
				o.setChildren([u]);
			}
		}, r.prototype.EndTable = function() {
			if (e.prototype.EndTable.call(this), this.center && this.maxrow <= 2) {
				var t = this.arraydef;
				delete t.width, delete this.global.indentalign;
			}
		}, r;
	}(o.EqnArrayItem);
})), T = /* @__PURE__ */ e(((e) => {
	var t = e && e.__assign || function() {
		return t = Object.assign || function(e) {
			for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
			return e;
		}, t.apply(this, arguments);
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
	}, a = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.NEW_OPS = e.AmsMethods = void 0;
	var o = a(u()), s = a(m()), c = a(x()), l = d(), f = a(g()), p = a(i()), h = v(), y = a(_()), b = r();
	e.AmsMethods = {}, e.AmsMethods.AmsEqnArray = function(e, t, n, r, i, a, s) {
		var c = e.GetBrackets("\\begin{" + t.getName() + "}"), l = y.default.EqnArray(e, t, n, r, i, a, s);
		return o.default.setArrayAlign(l, c);
	}, e.AmsMethods.AlignAt = function(t, n, r, i) {
		var a = n.getName(), s, c, l = "", u = [];
		if (i || (c = t.GetBrackets("\\begin{" + a + "}")), s = t.GetArgument("\\begin{" + a + "}"), s.match(/[^0-9]/)) throw new p.default("PositiveIntegerArg", "Argument to %1 must me a positive integer", "\\begin{" + a + "}");
		for (var d = parseInt(s, 10); d > 0;) l += "rl", u.push("0em 0em"), d--;
		var f = u.join(" ");
		if (i) return e.AmsMethods.EqnArray(t, n, r, i, l, f);
		var m = e.AmsMethods.EqnArray(t, n, r, i, l, f);
		return o.default.setArrayAlign(m, c);
	}, e.AmsMethods.Multline = function(e, t, n) {
		e.Push(t), o.default.checkEqnEnv(e);
		var r = e.itemFactory.create("multline", n, e.stack);
		return r.arraydef = {
			displaystyle: !0,
			rowspacing: ".5em",
			columnspacing: "100%",
			width: e.options.ams.multlineWidth,
			side: e.options.tagSide,
			minlabelspacing: e.options.tagIndent,
			framespacing: e.options.ams.multlineIndent + " 0",
			frame: "",
			"data-width-includes-label": !0
		}, r;
	}, e.AmsMethods.XalignAt = function(t, n, r, i) {
		var a = t.GetArgument("\\begin{" + n.getName() + "}");
		if (a.match(/[^0-9]/)) throw new p.default("PositiveIntegerArg", "Argument to %1 must me a positive integer", "\\begin{" + n.getName() + "}");
		var o = i ? "crl" : "rlc", s = i ? "fit auto auto" : "auto auto fit", c = e.AmsMethods.FlalignArray(t, n, r, i, !1, o, s, !0);
		return c.setProperty("xalignat", 2 * parseInt(a)), c;
	}, e.AmsMethods.FlalignArray = function(e, t, n, r, i, a, s, c) {
		c === void 0 && (c = !1), e.Push(t), o.default.checkEqnEnv(e), a = a.split("").join(" ").replace(/r/g, "right").replace(/l/g, "left").replace(/c/g, "center");
		var l = e.itemFactory.create("flalign", t.getName(), n, r, i, e.stack);
		return l.arraydef = {
			width: "100%",
			displaystyle: !0,
			columnalign: a,
			columnspacing: "0em",
			columnwidth: s,
			rowspacing: "3pt",
			side: e.options.tagSide,
			minlabelspacing: c ? "0" : e.options.tagIndent,
			"data-width-includes-label": !0
		}, l.setProperty("zeroWidthLabel", c), l;
	}, e.NEW_OPS = "ams-declare-ops", e.AmsMethods.HandleDeclareOp = function(t, n) {
		var r = t.GetStar() ? "*" : "", i = o.default.trimSpaces(t.GetArgument(n));
		i.charAt(0) === "\\" && (i = i.substr(1));
		var a = t.GetArgument(n);
		t.configuration.handlers.retrieve(e.NEW_OPS).add(i, new h.Macro(i, e.AmsMethods.Macro, [`\\operatorname${r}{${a}}`]));
	}, e.AmsMethods.HandleOperatorName = function(e, n) {
		var r = e.GetStar(), i = o.default.trimSpaces(e.GetArgument(n)), a = new f.default(i, t(t({}, e.stack.env), {
			font: l.TexConstant.Variant.NORMAL,
			multiLetterIdentifiers: /^[-*a-z]+/i,
			operatorLetters: !0
		}), e.configuration).mml();
		if (a.isKind("mi") || (a = e.create("node", "TeXAtom", [a])), c.default.setProperties(a, {
			movesupsub: r,
			movablelimits: !0,
			texClass: b.TEXCLASS.OP
		}), !r) {
			var s = e.GetNext(), u = e.i;
			s === "\\" && ++e.i && e.GetCS() !== "limits" && (e.i = u);
		}
		e.Push(a);
	}, e.AmsMethods.SideSet = function(e, t) {
		var r = n(S(e.ParseArg(t)), 2), i = r[0], a = r[1], s = n(S(e.ParseArg(t)), 2), l = s[0], u = s[1], d = e.ParseArg(t), f = d;
		i && (a ? i.replaceChild(e.create("node", "mphantom", [e.create("node", "mpadded", [o.default.copyNode(d, e)], { width: 0 })]), c.default.getChildAt(i, 0)) : (f = e.create("node", "mmultiscripts", [d]), l && c.default.appendChildren(f, [c.default.getChildAt(l, 1) || e.create("node", "none"), c.default.getChildAt(l, 2) || e.create("node", "none")]), c.default.setProperty(f, "scriptalign", "left"), c.default.appendChildren(f, [
			e.create("node", "mprescripts"),
			c.default.getChildAt(i, 1) || e.create("node", "none"),
			c.default.getChildAt(i, 2) || e.create("node", "none")
		]))), l && f === d && (l.replaceChild(d, c.default.getChildAt(l, 0)), f = l);
		var p = e.create("node", "TeXAtom", [], {
			texClass: b.TEXCLASS.OP,
			movesupsub: !0,
			movablelimits: !0
		});
		a && (i && p.appendChild(i), p.appendChild(a)), p.appendChild(f), u && p.appendChild(u), e.Push(p);
	};
	function S(e) {
		if (!e || e.isInferred && e.childNodes.length === 0) return [null, null];
		if (e.isKind("msubsup") && C(e)) return [e, null];
		var t = c.default.getChildAt(e, 0);
		return e.isInferred && t && C(t) ? (e.childNodes.splice(0, 1), [t, e]) : [null, e];
	}
	function C(e) {
		var t = e.childNodes[0];
		return t && t.isKind("mi") && t.getText() === "";
	}
	e.AmsMethods.operatorLetter = function(e, t) {
		return e.stack.env.operatorLetters ? s.default.variable(e, t) : !1;
	}, e.AmsMethods.MultiIntegral = function(e, t, n) {
		var r = e.GetNext();
		if (r === "\\") {
			var i = e.i;
			r = e.GetArgument(t), e.i = i, r === "\\limits" && (n = t === "\\idotsint" ? "\\!\\!\\mathop{\\,\\," + n + "}" : "\\!\\!\\!\\mathop{\\,\\,\\," + n + "}");
		}
		e.string = n + " " + e.string.slice(e.i), e.i = 0;
	}, e.AmsMethods.xArrow = function(e, t, n, r, i) {
		var a = {
			width: "+" + o.default.Em((r + i) / 18),
			lspace: o.default.Em(r / 18)
		}, s = e.GetBrackets(t), l = e.ParseArg(t), u = e.create("node", "mspace", [], { depth: ".25em" }), d = e.create("token", "mo", {
			stretchy: !0,
			texClass: b.TEXCLASS.REL
		}, String.fromCodePoint(n));
		d = e.create("node", "mstyle", [d], { scriptlevel: 0 });
		var p = e.create("node", "munderover", [d]), m = e.create("node", "mpadded", [l, u], a);
		if (c.default.setAttribute(m, "voffset", "-.2em"), c.default.setAttribute(m, "height", "-.2em"), c.default.setChild(p, p.over, m), s) {
			var h = new f.default(s, e.stack.env, e.configuration).mml(), g = e.create("node", "mspace", [], { height: ".75em" });
			m = e.create("node", "mpadded", [h, g], a), c.default.setAttribute(m, "voffset", ".15em"), c.default.setAttribute(m, "depth", "-.15em"), c.default.setChild(p, p.under, m);
		}
		c.default.setProperty(p, "subsupOK", !0), e.Push(p);
	}, e.AmsMethods.HandleShove = function(e, t, n) {
		var r = e.stack.Top();
		if (r.kind !== "multline") throw new p.default("CommandOnlyAllowedInEnv", "%1 only allowed in %2 environment", e.currentCS, "multline");
		if (r.Size()) throw new p.default("CommandAtTheBeginingOfLine", "%1 must come at the beginning of the line", e.currentCS);
		r.setProperty("shove", n);
	}, e.AmsMethods.CFrac = function(e, t) {
		var n = o.default.trimSpaces(e.GetBrackets(t, "")), r = e.GetArgument(t), i = e.GetArgument(t), a = {
			l: l.TexConstant.Align.LEFT,
			r: l.TexConstant.Align.RIGHT,
			"": ""
		}, s = new f.default("\\strut\\textstyle{" + r + "}", e.stack.env, e.configuration).mml(), u = new f.default("\\strut\\textstyle{" + i + "}", e.stack.env, e.configuration).mml(), d = e.create("node", "mfrac", [s, u]);
		if (n = a[n], n == null) throw new p.default("IllegalAlign", "Illegal alignment specified in %1", e.currentCS);
		n && c.default.setProperties(d, {
			numalign: n,
			denomalign: n
		}), e.Push(d);
	}, e.AmsMethods.Genfrac = function(e, t, n, r, i, a) {
		n ??= e.GetDelimiterArg(t), r ??= e.GetDelimiterArg(t), i ??= e.GetArgument(t), a ??= o.default.trimSpaces(e.GetArgument(t));
		var s = e.ParseArg(t), l = e.ParseArg(t), u = e.create("node", "mfrac", [s, l]);
		if (i !== "" && c.default.setAttribute(u, "linethickness", i), (n || r) && (c.default.setProperty(u, "withDelims", !0), u = o.default.fixedFence(e.configuration, n, u, r)), a !== "") {
			var d = parseInt(a, 10), f = [
				"D",
				"T",
				"S",
				"SS"
			][d];
			if (f == null) throw new p.default("BadMathStyleFor", "Bad math style for %1", e.currentCS);
			u = e.create("node", "mstyle", [u]), f === "D" ? c.default.setProperties(u, {
				displaystyle: !0,
				scriptlevel: 0
			}) : c.default.setProperties(u, {
				displaystyle: !1,
				scriptlevel: d - 1
			});
		}
		e.Push(u);
	}, e.AmsMethods.HandleTag = function(e, t) {
		if (!e.tags.currentTag.taggable && e.tags.env) throw new p.default("CommandNotAllowedInEnv", "%1 not allowed in %2 environment", e.currentCS, e.tags.env);
		if (e.tags.currentTag.tag) throw new p.default("MultipleCommand", "Multiple %1", e.currentCS);
		var n = e.GetStar(), r = o.default.trimSpaces(e.GetArgument(t));
		e.tags.tag(r, n);
	}, e.AmsMethods.HandleNoTag = y.default.HandleNoTag, e.AmsMethods.HandleRef = y.default.HandleRef, e.AmsMethods.Macro = y.default.Macro, e.AmsMethods.Accent = y.default.Accent, e.AmsMethods.Tilde = y.default.Tilde, e.AmsMethods.Array = y.default.Array, e.AmsMethods.Spacer = y.default.Spacer, e.AmsMethods.NamedOp = y.default.NamedOp, e.AmsMethods.EqnArray = y.default.EqnArray, e.AmsMethods.Equation = y.default.Equation;
})), E = /* @__PURE__ */ e(((e) => {
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
	}), i = e && e.__importStar || function(e) {
		if (e && e.__esModule) return e;
		var r = {};
		if (e != null) for (var i in e) i !== "default" && Object.prototype.hasOwnProperty.call(e, i) && t(r, e, i);
		return n(r, e), r;
	}, a = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 });
	var o = T(), s = i(h()), c = d(), l = a(m()), f = a(u()), p = r(), g = S();
	new s.CharacterMap("AMSmath-mathchar0mo", l.default.mathchar0mo, { iiiint: ["⨌", { texClass: p.TEXCLASS.OP }] }), new s.RegExpMap("AMSmath-operatorLetter", o.AmsMethods.operatorLetter, /[-*]/i), new s.CommandMap("AMSmath-macros", {
		mathring: ["Accent", "02DA"],
		nobreakspace: "Tilde",
		negmedspace: ["Spacer", g.MATHSPACE.negativemediummathspace],
		negthickspace: ["Spacer", g.MATHSPACE.negativethickmathspace],
		idotsint: ["MultiIntegral", "\\int\\cdots\\int"],
		dddot: ["Accent", "20DB"],
		ddddot: ["Accent", "20DC"],
		sideset: "SideSet",
		boxed: [
			"Macro",
			"\\fbox{$\\displaystyle{#1}$}",
			1
		],
		tag: "HandleTag",
		notag: "HandleNoTag",
		eqref: ["HandleRef", !0],
		substack: [
			"Macro",
			"\\begin{subarray}{c}#1\\end{subarray}",
			1
		],
		injlim: ["NamedOp", "inj&thinsp;lim"],
		projlim: ["NamedOp", "proj&thinsp;lim"],
		varliminf: ["Macro", "\\mathop{\\underline{\\mmlToken{mi}{lim}}}"],
		varlimsup: ["Macro", "\\mathop{\\overline{\\mmlToken{mi}{lim}}}"],
		varinjlim: ["Macro", "\\mathop{\\underrightarrow{\\mmlToken{mi}{lim}}}"],
		varprojlim: ["Macro", "\\mathop{\\underleftarrow{\\mmlToken{mi}{lim}}}"],
		DeclareMathOperator: "HandleDeclareOp",
		operatorname: "HandleOperatorName",
		genfrac: "Genfrac",
		frac: [
			"Genfrac",
			"",
			"",
			"",
			""
		],
		tfrac: [
			"Genfrac",
			"",
			"",
			"",
			"1"
		],
		dfrac: [
			"Genfrac",
			"",
			"",
			"",
			"0"
		],
		binom: [
			"Genfrac",
			"(",
			")",
			"0",
			""
		],
		tbinom: [
			"Genfrac",
			"(",
			")",
			"0",
			"1"
		],
		dbinom: [
			"Genfrac",
			"(",
			")",
			"0",
			"0"
		],
		cfrac: "CFrac",
		shoveleft: ["HandleShove", c.TexConstant.Align.LEFT],
		shoveright: ["HandleShove", c.TexConstant.Align.RIGHT],
		xrightarrow: [
			"xArrow",
			8594,
			5,
			10
		],
		xleftarrow: [
			"xArrow",
			8592,
			10,
			5
		]
	}, o.AmsMethods), new s.EnvironmentMap("AMSmath-environment", l.default.environment, {
		"equation*": [
			"Equation",
			null,
			!1
		],
		"eqnarray*": [
			"EqnArray",
			null,
			!1,
			!0,
			"rcl",
			f.default.cols(0, g.MATHSPACE.thickmathspace),
			".5em"
		],
		align: [
			"EqnArray",
			null,
			!0,
			!0,
			"rl",
			f.default.cols(0, 2)
		],
		"align*": [
			"EqnArray",
			null,
			!1,
			!0,
			"rl",
			f.default.cols(0, 2)
		],
		multline: [
			"Multline",
			null,
			!0
		],
		"multline*": [
			"Multline",
			null,
			!1
		],
		split: [
			"EqnArray",
			null,
			!1,
			!1,
			"rl",
			f.default.cols(0)
		],
		gather: [
			"EqnArray",
			null,
			!0,
			!0,
			"c"
		],
		"gather*": [
			"EqnArray",
			null,
			!1,
			!0,
			"c"
		],
		alignat: [
			"AlignAt",
			null,
			!0,
			!0
		],
		"alignat*": [
			"AlignAt",
			null,
			!1,
			!0
		],
		alignedat: [
			"AlignAt",
			null,
			!1,
			!1
		],
		aligned: [
			"AmsEqnArray",
			null,
			null,
			null,
			"rl",
			f.default.cols(0, 2),
			".5em",
			"D"
		],
		gathered: [
			"AmsEqnArray",
			null,
			null,
			null,
			"c",
			null,
			".5em",
			"D"
		],
		xalignat: [
			"XalignAt",
			null,
			!0,
			!0
		],
		"xalignat*": [
			"XalignAt",
			null,
			!1,
			!0
		],
		xxalignat: [
			"XalignAt",
			null,
			!1,
			!1
		],
		flalign: [
			"FlalignArray",
			null,
			!0,
			!1,
			!0,
			"rlc",
			"auto auto fit"
		],
		"flalign*": [
			"FlalignArray",
			null,
			!1,
			!1,
			!0,
			"rlc",
			"auto auto fit"
		],
		subarray: [
			"Array",
			null,
			null,
			null,
			null,
			f.default.cols(0),
			"0.1em",
			"S",
			1
		],
		smallmatrix: [
			"Array",
			null,
			null,
			null,
			"c",
			f.default.cols(1 / 3),
			".2em",
			"S",
			1
		],
		matrix: [
			"Array",
			null,
			null,
			null,
			"c"
		],
		pmatrix: [
			"Array",
			null,
			"(",
			")",
			"c"
		],
		bmatrix: [
			"Array",
			null,
			"[",
			"]",
			"c"
		],
		Bmatrix: [
			"Array",
			null,
			"\\{",
			"\\}",
			"c"
		],
		vmatrix: [
			"Array",
			null,
			"\\vert",
			"\\vert",
			"c"
		],
		Vmatrix: [
			"Array",
			null,
			"\\Vert",
			"\\Vert",
			"c"
		],
		cases: [
			"Array",
			null,
			"\\{",
			".",
			"ll",
			null,
			".2em",
			"T"
		]
	}, o.AmsMethods), new s.DelimiterMap("AMSmath-delimiter", l.default.delimiter, {
		"\\lvert": ["|", { texClass: p.TEXCLASS.OPEN }],
		"\\rvert": ["|", { texClass: p.TEXCLASS.CLOSE }],
		"\\lVert": ["‖", { texClass: p.TEXCLASS.OPEN }],
		"\\rVert": ["‖", { texClass: p.TEXCLASS.CLOSE }]
	}), new s.CharacterMap("AMSsymbols-mathchar0mi", l.default.mathchar0mi, {
		digamma: "ϝ",
		varkappa: "ϰ",
		varGamma: ["Γ", { mathvariant: c.TexConstant.Variant.ITALIC }],
		varDelta: ["Δ", { mathvariant: c.TexConstant.Variant.ITALIC }],
		varTheta: ["Θ", { mathvariant: c.TexConstant.Variant.ITALIC }],
		varLambda: ["Λ", { mathvariant: c.TexConstant.Variant.ITALIC }],
		varXi: ["Ξ", { mathvariant: c.TexConstant.Variant.ITALIC }],
		varPi: ["Π", { mathvariant: c.TexConstant.Variant.ITALIC }],
		varSigma: ["Σ", { mathvariant: c.TexConstant.Variant.ITALIC }],
		varUpsilon: ["Υ", { mathvariant: c.TexConstant.Variant.ITALIC }],
		varPhi: ["Φ", { mathvariant: c.TexConstant.Variant.ITALIC }],
		varPsi: ["Ψ", { mathvariant: c.TexConstant.Variant.ITALIC }],
		varOmega: ["Ω", { mathvariant: c.TexConstant.Variant.ITALIC }],
		beth: "ℶ",
		gimel: "ℷ",
		daleth: "ℸ",
		backprime: ["‵", { variantForm: !0 }],
		hslash: "ℏ",
		varnothing: ["∅", { variantForm: !0 }],
		blacktriangle: "▴",
		triangledown: ["▽", { variantForm: !0 }],
		blacktriangledown: "▾",
		square: "◻",
		Box: "◻",
		blacksquare: "◼",
		lozenge: "◊",
		Diamond: "◊",
		blacklozenge: "⧫",
		circledS: ["Ⓢ", { mathvariant: c.TexConstant.Variant.NORMAL }],
		bigstar: "★",
		sphericalangle: "∢",
		measuredangle: "∡",
		nexists: "∄",
		complement: "∁",
		mho: "℧",
		eth: ["ð", { mathvariant: c.TexConstant.Variant.NORMAL }],
		Finv: "Ⅎ",
		diagup: "╱",
		Game: "⅁",
		diagdown: "╲",
		Bbbk: ["k", { mathvariant: c.TexConstant.Variant.DOUBLESTRUCK }],
		yen: "¥",
		circledR: "®",
		checkmark: "✓",
		maltese: "✠"
	}), new s.CharacterMap("AMSsymbols-mathchar0mo", l.default.mathchar0mo, {
		dotplus: "∔",
		ltimes: "⋉",
		smallsetminus: ["∖", { variantForm: !0 }],
		rtimes: "⋊",
		Cap: "⋒",
		doublecap: "⋒",
		leftthreetimes: "⋋",
		Cup: "⋓",
		doublecup: "⋓",
		rightthreetimes: "⋌",
		barwedge: "⊼",
		curlywedge: "⋏",
		veebar: "⊻",
		curlyvee: "⋎",
		doublebarwedge: "⩞",
		boxminus: "⊟",
		circleddash: "⊝",
		boxtimes: "⊠",
		circledast: "⊛",
		boxdot: "⊡",
		circledcirc: "⊚",
		boxplus: "⊞",
		centerdot: ["⋅", { variantForm: !0 }],
		divideontimes: "⋇",
		intercal: "⊺",
		leqq: "≦",
		geqq: "≧",
		leqslant: "⩽",
		geqslant: "⩾",
		eqslantless: "⪕",
		eqslantgtr: "⪖",
		lesssim: "≲",
		gtrsim: "≳",
		lessapprox: "⪅",
		gtrapprox: "⪆",
		approxeq: "≊",
		lessdot: "⋖",
		gtrdot: "⋗",
		lll: "⋘",
		llless: "⋘",
		ggg: "⋙",
		gggtr: "⋙",
		lessgtr: "≶",
		gtrless: "≷",
		lesseqgtr: "⋚",
		gtreqless: "⋛",
		lesseqqgtr: "⪋",
		gtreqqless: "⪌",
		doteqdot: "≑",
		Doteq: "≑",
		eqcirc: "≖",
		risingdotseq: "≓",
		circeq: "≗",
		fallingdotseq: "≒",
		triangleq: "≜",
		backsim: "∽",
		thicksim: ["∼", { variantForm: !0 }],
		backsimeq: "⋍",
		thickapprox: ["≈", { variantForm: !0 }],
		subseteqq: "⫅",
		supseteqq: "⫆",
		Subset: "⋐",
		Supset: "⋑",
		sqsubset: "⊏",
		sqsupset: "⊐",
		preccurlyeq: "≼",
		succcurlyeq: "≽",
		curlyeqprec: "⋞",
		curlyeqsucc: "⋟",
		precsim: "≾",
		succsim: "≿",
		precapprox: "⪷",
		succapprox: "⪸",
		vartriangleleft: "⊲",
		lhd: "⊲",
		vartriangleright: "⊳",
		rhd: "⊳",
		trianglelefteq: "⊴",
		unlhd: "⊴",
		trianglerighteq: "⊵",
		unrhd: "⊵",
		vDash: ["⊨", { variantForm: !0 }],
		Vdash: "⊩",
		Vvdash: "⊪",
		smallsmile: ["⌣", { variantForm: !0 }],
		shortmid: ["∣", { variantForm: !0 }],
		smallfrown: ["⌢", { variantForm: !0 }],
		shortparallel: ["∥", { variantForm: !0 }],
		bumpeq: "≏",
		between: "≬",
		Bumpeq: "≎",
		pitchfork: "⋔",
		varpropto: ["∝", { variantForm: !0 }],
		backepsilon: "∍",
		blacktriangleleft: "◂",
		blacktriangleright: "▸",
		therefore: "∴",
		because: "∵",
		eqsim: "≂",
		vartriangle: ["△", { variantForm: !0 }],
		Join: "⋈",
		nless: "≮",
		ngtr: "≯",
		nleq: "≰",
		ngeq: "≱",
		nleqslant: ["⪇", { variantForm: !0 }],
		ngeqslant: ["⪈", { variantForm: !0 }],
		nleqq: ["≰", { variantForm: !0 }],
		ngeqq: ["≱", { variantForm: !0 }],
		lneq: "⪇",
		gneq: "⪈",
		lneqq: "≨",
		gneqq: "≩",
		lvertneqq: ["≨", { variantForm: !0 }],
		gvertneqq: ["≩", { variantForm: !0 }],
		lnsim: "⋦",
		gnsim: "⋧",
		lnapprox: "⪉",
		gnapprox: "⪊",
		nprec: "⊀",
		nsucc: "⊁",
		npreceq: ["⋠", { variantForm: !0 }],
		nsucceq: ["⋡", { variantForm: !0 }],
		precneqq: "⪵",
		succneqq: "⪶",
		precnsim: "⋨",
		succnsim: "⋩",
		precnapprox: "⪹",
		succnapprox: "⪺",
		nsim: "≁",
		ncong: "≇",
		nshortmid: ["∤", { variantForm: !0 }],
		nshortparallel: ["∦", { variantForm: !0 }],
		nmid: "∤",
		nparallel: "∦",
		nvdash: "⊬",
		nvDash: "⊭",
		nVdash: "⊮",
		nVDash: "⊯",
		ntriangleleft: "⋪",
		ntriangleright: "⋫",
		ntrianglelefteq: "⋬",
		ntrianglerighteq: "⋭",
		nsubseteq: "⊈",
		nsupseteq: "⊉",
		nsubseteqq: ["⊈", { variantForm: !0 }],
		nsupseteqq: ["⊉", { variantForm: !0 }],
		subsetneq: "⊊",
		supsetneq: "⊋",
		varsubsetneq: ["⊊", { variantForm: !0 }],
		varsupsetneq: ["⊋", { variantForm: !0 }],
		subsetneqq: "⫋",
		supsetneqq: "⫌",
		varsubsetneqq: ["⫋", { variantForm: !0 }],
		varsupsetneqq: ["⫌", { variantForm: !0 }],
		leftleftarrows: "⇇",
		rightrightarrows: "⇉",
		leftrightarrows: "⇆",
		rightleftarrows: "⇄",
		Lleftarrow: "⇚",
		Rrightarrow: "⇛",
		twoheadleftarrow: "↞",
		twoheadrightarrow: "↠",
		leftarrowtail: "↢",
		rightarrowtail: "↣",
		looparrowleft: "↫",
		looparrowright: "↬",
		leftrightharpoons: "⇋",
		rightleftharpoons: ["⇌", { variantForm: !0 }],
		curvearrowleft: "↶",
		curvearrowright: "↷",
		circlearrowleft: "↺",
		circlearrowright: "↻",
		Lsh: "↰",
		Rsh: "↱",
		upuparrows: "⇈",
		downdownarrows: "⇊",
		upharpoonleft: "↿",
		upharpoonright: "↾",
		downharpoonleft: "⇃",
		restriction: "↾",
		multimap: "⊸",
		downharpoonright: "⇂",
		leftrightsquigarrow: "↭",
		rightsquigarrow: "⇝",
		leadsto: "⇝",
		dashrightarrow: "⇢",
		dashleftarrow: "⇠",
		nleftarrow: "↚",
		nrightarrow: "↛",
		nLeftarrow: "⇍",
		nRightarrow: "⇏",
		nleftrightarrow: "↮",
		nLeftrightarrow: "⇎"
	}), new s.DelimiterMap("AMSsymbols-delimiter", l.default.delimiter, {
		"\\ulcorner": "⌜",
		"\\urcorner": "⌝",
		"\\llcorner": "⌞",
		"\\lrcorner": "⌟"
	}), new s.CommandMap("AMSsymbols-macros", {
		implies: ["Macro", "\\;\\Longrightarrow\\;"],
		impliedby: ["Macro", "\\;\\Longleftarrow\\;"]
	}, o.AmsMethods);
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
	})(), n;
	Object.defineProperty(e, "__esModule", { value: !0 }), e.AmsConfiguration = e.AmsTags = void 0;
	var r = o(), i = w(), a = f(), s = T();
	E();
	var c = h(), l = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return n;
	}(a.AbstractTags);
	e.AmsTags = l;
	var u = function(e) {
		new c.CommandMap(s.NEW_OPS, {}, {}), e.append(r.Configuration.local({
			handler: { macro: [s.NEW_OPS] },
			priority: -1
		}));
	};
	e.AmsConfiguration = r.Configuration.create("ams", {
		handler: {
			character: ["AMSmath-operatorLetter"],
			delimiter: ["AMSsymbols-delimiter", "AMSmath-delimiter"],
			macro: [
				"AMSsymbols-mathchar0mi",
				"AMSsymbols-mathchar0mo",
				"AMSsymbols-delimiter",
				"AMSsymbols-macros",
				"AMSmath-mathchar0mo",
				"AMSmath-macros",
				"AMSmath-delimiter"
			],
			environment: ["AMSmath-environment"]
		},
		items: (n = {}, n[i.MultlineItem.prototype.kind] = i.MultlineItem, n[i.FlalignItem.prototype.kind] = i.FlalignItem, n),
		tags: { ams: l },
		init: u,
		config: function(e, t) {
			t.parseOptions.options.multlineWidth && (t.parseOptions.options.ams.multlineWidth = t.parseOptions.options.multlineWidth), delete t.parseOptions.options.multlineWidth;
		},
		options: {
			multlineWidth: "",
			ams: {
				multlineWidth: "100%",
				multlineIndent: "1em"
			}
		}
	});
})), O = /* @__PURE__ */ e(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 });
	var n = t(g()), i = y(), a = r(), o = t(x()), s = {};
	s.CD = function(e, t) {
		e.Push(t);
		var n = e.itemFactory.create("array"), r = e.configuration.options.amscd;
		return n.setProperties({
			minw: e.stack.env.CD_minw || r.harrowsize,
			minh: e.stack.env.CD_minh || r.varrowsize
		}), n.arraydef = {
			columnalign: "center",
			columnspacing: r.colspace,
			rowspacing: r.rowspace,
			displaystyle: !0
		}, n;
	}, s.arrow = function(e, t) {
		var r = e.string.charAt(e.i);
		if (r.match(/[><VA.|=]/)) e.i++;
		else return (0, i.Other)(e, t);
		var c = e.stack.Top();
		(!c.isKind("array") || c.Size()) && (s.cell(e, t), c = e.stack.Top());
		for (var l = c, u = l.table.length % 2 == 1, d = (l.row.length + +!u) % 2; d;) s.cell(e, t), d--;
		var f, p = {
			minsize: l.getProperty("minw"),
			stretchy: !0
		}, m = {
			minsize: l.getProperty("minh"),
			stretchy: !0,
			symmetric: !0,
			lspace: 0,
			rspace: 0
		};
		if (r !== ".") if (r === "|") f = e.create("token", "mo", m, "∥");
		else if (r === "=") f = e.create("token", "mo", p, "=");
		else {
			var h = {
				">": "→",
				"<": "←",
				V: "↓",
				A: "↑"
			}[r], g = e.GetUpTo(t + r, r), _ = e.GetUpTo(t + r, r);
			if (r === ">" || r === "<") {
				if (f = e.create("token", "mo", p, h), g ||= "\\kern " + l.getProperty("minw"), g || _) {
					var v = {
						width: "+.67em",
						lspace: ".33em"
					};
					if (f = e.create("node", "munderover", [f]), g) {
						var y = new n.default(g, e.stack.env, e.configuration).mml(), b = e.create("node", "mpadded", [y], v);
						o.default.setAttribute(b, "voffset", ".1em"), o.default.setChild(f, f.over, b);
					}
					if (_) {
						var x = new n.default(_, e.stack.env, e.configuration).mml();
						o.default.setChild(f, f.under, e.create("node", "mpadded", [x], v));
					}
					e.configuration.options.amscd.hideHorizontalLabels && (f = e.create("node", "mpadded", f, {
						depth: 0,
						height: ".67em"
					}));
				}
			} else {
				var S = e.create("token", "mo", m, h);
				f = S, (g || _) && (f = e.create("node", "mrow"), g && o.default.appendChildren(f, [new n.default("\\scriptstyle\\llap{" + g + "}", e.stack.env, e.configuration).mml()]), S.texClass = a.TEXCLASS.ORD, o.default.appendChildren(f, [S]), _ && o.default.appendChildren(f, [new n.default("\\scriptstyle\\rlap{" + _ + "}", e.stack.env, e.configuration).mml()]));
			}
		}
		f && e.Push(f), s.cell(e, t);
	}, s.cell = function(e, t) {
		var n = e.stack.Top();
		(n.table || []).length % 2 == 0 && (n.row || []).length === 0 && e.Push(e.create("node", "mpadded", [], {
			height: "8.5pt",
			depth: "2pt"
		})), e.Push(e.itemFactory.create("cell").setProperties({
			isEntry: !0,
			name: t
		}));
	}, s.minCDarrowwidth = function(e, t) {
		e.stack.env.CD_minw = e.GetDimen(t);
	}, s.minCDarrowheight = function(e, t) {
		e.stack.env.CD_minh = e.GetDimen(t);
	}, e.default = s;
})), k = /* @__PURE__ */ e(((e) => {
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
	var a = r(h()), o = i(m()), s = i(O());
	new a.EnvironmentMap("amscd_environment", o.default.environment, { CD: "CD" }, s.default), new a.CommandMap("amscd_macros", {
		minCDarrowwidth: "minCDarrowwidth",
		minCDarrowheight: "minCDarrowheight"
	}, s.default), new a.MacroMap("amscd_special", { "@": "arrow" }, s.default);
})), A = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.AmsCdConfiguration = void 0;
	var t = o();
	k(), e.AmsCdConfiguration = t.Configuration.create("amscd", {
		handler: {
			character: ["amscd_special"],
			macro: ["amscd_macros"],
			environment: ["amscd_environment"]
		},
		options: { amscd: {
			colspace: "5pt",
			rowspace: "5pt",
			harrowsize: "2.75em",
			varrowsize: "1.75em",
			hideHorizontalLabels: !1
		} }
	});
})), j = /* @__PURE__ */ e(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.BboxConfiguration = e.BboxMethods = void 0;
	var n = o(), r = h(), a = t(i());
	e.BboxMethods = {}, e.BboxMethods.BBox = function(e, t) {
		for (var n = e.GetBrackets(t, ""), r = e.ParseArg(t), i = n.split(/,/), o, l, u, d = 0, f = i.length; d < f; d++) {
			var p = i[d].trim(), m = p.match(/^(\.\d+|\d+(\.\d*)?)(pt|em|ex|mu|px|in|cm|mm)$/);
			if (m) {
				if (o) throw new a.default("MultipleBBoxProperty", "%1 specified twice in %2", "Padding", t);
				var h = c(m[1] + m[3]);
				h && (o = {
					height: "+" + h,
					depth: "+" + h,
					lspace: h,
					width: "+" + 2 * parseInt(m[1], 10) + m[3]
				});
			} else if (p.match(/^([a-z0-9]+|\#[0-9a-f]{6}|\#[0-9a-f]{3})$/i)) {
				if (l) throw new a.default("MultipleBBoxProperty", "%1 specified twice in %2", "Background", t);
				l = p;
			} else if (p.match(/^[-a-z]+:/i)) {
				if (u) throw new a.default("MultipleBBoxProperty", "%1 specified twice in %2", "Style", t);
				u = s(p);
			} else if (p !== "") throw new a.default("InvalidBBoxProperty", "\"%1\" doesn't look like a color, a padding dimension, or a style", p);
		}
		o && (r = e.create("node", "mpadded", [r], o)), (l || u) && (o = {}, l && Object.assign(o, { mathbackground: l }), u && Object.assign(o, { style: u }), r = e.create("node", "mstyle", [r], o)), e.Push(r);
	};
	var s = function(e) {
		return e;
	}, c = function(e) {
		return e;
	};
	new r.CommandMap("bbox", { bbox: "BBox" }, e.BboxMethods), e.BboxConfiguration = n.Configuration.create("bbox", { handler: { macro: ["bbox"] } });
})), M = /* @__PURE__ */ e(((e) => {
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
	}, n = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.BoldsymbolConfiguration = e.rewriteBoldTokens = e.createBoldToken = e.BoldsymbolMethods = void 0;
	var r = o(), i = n(x()), a = d(), c = h(), l = s(), u = {};
	u[a.TexConstant.Variant.NORMAL] = a.TexConstant.Variant.BOLD, u[a.TexConstant.Variant.ITALIC] = a.TexConstant.Variant.BOLDITALIC, u[a.TexConstant.Variant.FRAKTUR] = a.TexConstant.Variant.BOLDFRAKTUR, u[a.TexConstant.Variant.SCRIPT] = a.TexConstant.Variant.BOLDSCRIPT, u[a.TexConstant.Variant.SANSSERIF] = a.TexConstant.Variant.BOLDSANSSERIF, u["-tex-calligraphic"] = "-tex-bold-calligraphic", u["-tex-oldstyle"] = "-tex-bold-oldstyle", u["-tex-mathit"] = a.TexConstant.Variant.BOLDITALIC, e.BoldsymbolMethods = {}, e.BoldsymbolMethods.Boldsymbol = function(e, t) {
		var n = e.stack.env.boldsymbol;
		e.stack.env.boldsymbol = !0;
		var r = e.ParseArg(t);
		e.stack.env.boldsymbol = n, e.Push(r);
	}, new c.CommandMap("boldsymbol", { boldsymbol: "Boldsymbol" }, e.BoldsymbolMethods);
	function f(e, t, n, r) {
		var a = l.NodeFactory.createToken(e, t, n, r);
		return t !== "mtext" && e.configuration.parser.stack.env.boldsymbol && (i.default.setProperty(a, "fixBold", !0), e.configuration.addNode("fixBold", a)), a;
	}
	e.createBoldToken = f;
	function p(e) {
		var n, r;
		try {
			for (var o = t(e.data.getList("fixBold")), s = o.next(); !s.done; s = o.next()) {
				var c = s.value;
				if (i.default.getProperty(c, "fixBold")) {
					var l = i.default.getAttribute(c, "mathvariant");
					l == null ? i.default.setAttribute(c, "mathvariant", a.TexConstant.Variant.BOLD) : i.default.setAttribute(c, "mathvariant", u[l] || l), i.default.removeProperties(c, "fixBold");
				}
			}
		} catch (e) {
			n = { error: e };
		} finally {
			try {
				s && !s.done && (r = o.return) && r.call(o);
			} finally {
				if (n) throw n.error;
			}
		}
	}
	e.rewriteBoldTokens = p, e.BoldsymbolConfiguration = r.Configuration.create("boldsymbol", {
		handler: { macro: ["boldsymbol"] },
		nodes: { token: f },
		postprocessors: [p]
	});
})), N = /* @__PURE__ */ e(((e) => {
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
	})(), n = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.BraketItem = void 0;
	var i = c(), a = r(), o = n(u());
	e.BraketItem = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "braket";
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
			return t.isKind("close") ? [[this.factory.create("mml", this.toMml())], !0] : t.isKind("mml") ? (this.Push(t.toMml()), this.getProperty("single") ? [[this.toMml()], !0] : i.BaseItem.fail) : e.prototype.checkItem.call(this, t);
		}, n.prototype.toMml = function() {
			var t = e.prototype.toMml.call(this), n = this.getProperty("open"), r = this.getProperty("close");
			if (this.getProperty("stretchy")) return o.default.fenced(this.factory.configuration, n, t, r);
			var i = {
				fence: !0,
				stretchy: !1,
				symmetric: !0,
				texClass: a.TEXCLASS.OPEN
			}, s = this.create("token", "mo", i, n);
			i.texClass = a.TEXCLASS.CLOSE;
			var c = this.create("token", "mo", i, r);
			return this.create("node", "mrow", [
				s,
				t,
				c
			], {
				open: n,
				close: r,
				texClass: a.TEXCLASS.INNER
			});
		}, n;
	}(i.BaseItem);
})), P = /* @__PURE__ */ e(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 });
	var n = t(_()), a = r(), o = t(i()), s = {};
	s.Macro = n.default.Macro, s.Braket = function(e, t, n, r, i, a) {
		var s = e.GetNext();
		if (s === "") throw new o.default("MissingArgFor", "Missing argument for %1", e.currentCS);
		var c = !0;
		s === "{" && (e.i++, c = !1), e.Push(e.itemFactory.create("braket").setProperties({
			barmax: a,
			barcount: 0,
			open: n,
			close: r,
			stretchy: i,
			single: c
		}));
	}, s.Bar = function(e, t) {
		var n = t === "|" ? "|" : "∥", r = e.stack.Top();
		if (r.kind !== "braket" || r.getProperty("barcount") >= r.getProperty("barmax")) {
			var i = e.create("token", "mo", {
				texClass: a.TEXCLASS.ORD,
				stretchy: !1
			}, n);
			e.Push(i);
			return;
		}
		if (n === "|" && e.GetNext() === "|" && (e.i++, n = "∥"), !r.getProperty("stretchy")) {
			var o = e.create("token", "mo", {
				stretchy: !1,
				braketbar: !0
			}, n);
			e.Push(o);
			return;
		}
		var s = e.create("node", "TeXAtom", [], { texClass: a.TEXCLASS.CLOSE });
		e.Push(s), r.setProperty("barcount", r.getProperty("barcount") + 1), s = e.create("token", "mo", {
			stretchy: !0,
			braketbar: !0
		}, n), e.Push(s), s = e.create("node", "TeXAtom", [], { texClass: a.TEXCLASS.OPEN }), e.Push(s);
	}, e.default = s;
})), ee = /* @__PURE__ */ e(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 });
	var n = h(), r = t(P());
	new n.CommandMap("Braket-macros", {
		bra: [
			"Macro",
			"{\\langle {#1} \\vert}",
			1
		],
		ket: [
			"Macro",
			"{\\vert {#1} \\rangle}",
			1
		],
		braket: [
			"Braket",
			"⟨",
			"⟩",
			!1,
			Infinity
		],
		set: [
			"Braket",
			"{",
			"}",
			!1,
			1
		],
		Bra: [
			"Macro",
			"{\\left\\langle {#1} \\right\\vert}",
			1
		],
		Ket: [
			"Macro",
			"{\\left\\vert {#1} \\right\\rangle}",
			1
		],
		Braket: [
			"Braket",
			"⟨",
			"⟩",
			!0,
			Infinity
		],
		Set: [
			"Braket",
			"{",
			"}",
			!0,
			1
		],
		ketbra: [
			"Macro",
			"{\\vert {#1} \\rangle\\langle {#2} \\vert}",
			2
		],
		Ketbra: [
			"Macro",
			"{\\left\\vert {#1} \\right\\rangle\\left\\langle {#2} \\right\\vert}",
			2
		],
		"|": "Bar"
	}, r.default), new n.MacroMap("Braket-characters", { "|": "Bar" }, r.default);
})), te = /* @__PURE__ */ e(((e) => {
	var t;
	Object.defineProperty(e, "__esModule", { value: !0 }), e.BraketConfiguration = void 0;
	var n = o(), r = N();
	ee(), e.BraketConfiguration = n.Configuration.create("braket", {
		handler: {
			character: ["Braket-characters"],
			macro: ["Braket-macros"]
		},
		items: (t = {}, t[r.BraketItem.prototype.kind] = r.BraketItem, t)
	});
})), F = /* @__PURE__ */ e(((e) => {
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
	}, i;
	Object.defineProperty(e, "__esModule", { value: !0 }), e.clearDocument = e.saveDocument = e.makeBsprAttributes = e.removeProperty = e.getProperty = e.setProperty = e.balanceRules = void 0;
	var a = r(x()), o = r(u()), s = null, c = null, l = function(e) {
		return c.root = e, s.outputJax.getBBox(c, s).w;
	}, d = function(e) {
		for (var t = 0; e && !a.default.isType(e, "mtable");) {
			if (a.default.isType(e, "text")) return null;
			if (a.default.isType(e, "mrow")) {
				e = e.childNodes[0], t = 0;
				continue;
			}
			e = e.parent.childNodes[t], t++;
		}
		return e;
	}, f = function(e, t) {
		return e.childNodes[+(t === "up")].childNodes[0].childNodes[0].childNodes[0].childNodes[0];
	}, p = function(e, t) {
		return e.childNodes[t].childNodes[0].childNodes[0];
	}, m = function(e) {
		return p(e, 0);
	}, h = function(e) {
		return p(e, e.childNodes.length - 1);
	}, g = function(e, t) {
		return e.childNodes[t === "up" ? 0 : 1].childNodes[0].childNodes[0].childNodes[0];
	}, _ = function(e) {
		for (; e && !a.default.isType(e, "mtd");) e = e.parent;
		return e;
	}, v = function(e) {
		return e.parent.childNodes[e.parent.childNodes.indexOf(e) + 1];
	}, y = function(t) {
		for (; t && (0, e.getProperty)(t, "inference") == null;) t = t.parent;
		return t;
	}, b = function(e, t, n) {
		n === void 0 && (n = !1);
		var r = 0;
		if (e === t) return r;
		if (e !== t.parent) {
			var i = e.childNodes, o = n ? i.length - 1 : 0;
			a.default.isType(i[o], "mspace") && (r += l(i[o])), e = t.parent;
		}
		if (e === t) return r;
		var s = e.childNodes, c = n ? s.length - 1 : 0;
		return s[c] !== t && (r += l(s[c])), r;
	}, S = function(t, n) {
		n === void 0 && (n = !1);
		var r = d(t), i = g(r, (0, e.getProperty)(r, "inferenceRule"));
		return b(t, r, n) + (l(r) - l(i)) / 2;
	}, C = function(t, n, r, i) {
		if (i === void 0 && (i = !1), (0, e.getProperty)(n, "inferenceRule") || (0, e.getProperty)(n, "labelledRule")) {
			var s = t.nodeFactory.create("node", "mrow");
			n.parent.replaceChild(s, n), s.setChildren([n]), w(n, s), n = s;
		}
		var c = i ? n.childNodes.length - 1 : 0, l = n.childNodes[c];
		if (a.default.isType(l, "mspace")) {
			a.default.setAttribute(l, "width", o.default.Em(o.default.dimen2em(a.default.getAttribute(l, "width")) + r));
			return;
		}
		if (l = t.nodeFactory.create("node", "mspace", [], { width: o.default.Em(r) }), i) {
			n.appendChild(l);
			return;
		}
		l.parent = n, n.childNodes.unshift(l);
	}, w = function(t, n) {
		[
			"inference",
			"proof",
			"maxAdjust",
			"labelledRule"
		].forEach(function(r) {
			var i = (0, e.getProperty)(t, r);
			i != null && ((0, e.setProperty)(n, r, i), (0, e.removeProperty)(t, r));
		});
	}, T = function(t) {
		var n = t.nodeLists.sequent;
		if (n) for (var r = n.length - 1, i = void 0; i = n[r]; r--) {
			if ((0, e.getProperty)(i, "sequentProcessed")) {
				(0, e.removeProperty)(i, "sequentProcessed");
				continue;
			}
			var a = [], o = y(i);
			if ((0, e.getProperty)(o, "inference") === 1) {
				for (a.push(i); (0, e.getProperty)(o, "inference") === 1;) {
					o = d(o);
					var s = m(f(o, (0, e.getProperty)(o, "inferenceRule"))), c = (0, e.getProperty)(s, "inferenceRule") ? g(s, (0, e.getProperty)(s, "inferenceRule")) : s;
					(0, e.getProperty)(c, "sequent") && (i = c.childNodes[0], a.push(i), (0, e.setProperty)(i, "sequentProcessed", !0)), o = s;
				}
				D(t, a);
			}
		}
	}, E = function(t, n, r, i, a) {
		var s = t.nodeFactory.create("node", "mspace", [], { width: o.default.Em(a) });
		if (i === "left") {
			var c = n.childNodes[r].childNodes[0];
			s.parent = c, c.childNodes.unshift(s);
		} else n.childNodes[r].appendChild(s);
		(0, e.setProperty)(n.parent, "sequentAdjust_" + i, a);
	}, D = function(n, r) {
		for (var i = r.pop(); r.length;) {
			var a = r.pop(), o = t(O(i, a), 2), s = o[0], c = o[1];
			(0, e.getProperty)(i.parent, "axiom") && (E(n, s < 0 ? i : a, 0, "left", Math.abs(s)), E(n, c < 0 ? i : a, 2, "right", Math.abs(c))), i = a;
		}
	}, O = function(e, t) {
		var n = l(e.childNodes[2]), r = l(t.childNodes[2]);
		return [l(e.childNodes[0]) - l(t.childNodes[0]), n - r];
	};
	e.balanceRules = function(t) {
		var r, i;
		c = new t.document.options.MathItem("", null, t.math.display);
		var a = t.data;
		T(a);
		var o = a.nodeLists.inference || [];
		try {
			for (var s = n(o), l = s.next(); !l.done; l = s.next()) {
				var u = l.value, p = (0, e.getProperty)(u, "proof"), g = d(u), x = f(g, (0, e.getProperty)(g, "inferenceRule")), w = m(x);
				if ((0, e.getProperty)(w, "inference")) {
					var E = S(w);
					E && (C(a, w, -E), C(a, u, E - b(u, g, !1)));
				}
				var D = h(x);
				if ((0, e.getProperty)(D, "inference") != null) {
					var O = S(D, !0);
					C(a, D, -O, !0);
					var k = b(u, g, !0), A = (0, e.getProperty)(u, "maxAdjust");
					A != null && (O = Math.max(O, A));
					var j = void 0;
					if (p || !(j = _(u))) {
						C(a, (0, e.getProperty)(u, "proof") ? u : u.parent, O - k, !0);
						continue;
					}
					var M = v(j);
					if (M) {
						var N = a.nodeFactory.create("node", "mspace", [], { width: O - k + "em" });
						M.appendChild(N), u.removeProperty("maxAdjust");
						continue;
					}
					var P = y(j);
					P && (O = (0, e.getProperty)(P, "maxAdjust") ? Math.max((0, e.getProperty)(P, "maxAdjust"), O) : O, (0, e.setProperty)(P, "maxAdjust", O));
				}
			}
		} catch (e) {
			r = { error: e };
		} finally {
			try {
				l && !l.done && (i = s.return) && i.call(s);
			} finally {
				if (r) throw r.error;
			}
		}
	};
	var k = "bspr_", A = (i = {}, i[k + "maxAdjust"] = !0, i);
	e.setProperty = function(e, t, n) {
		a.default.setProperty(e, k + t, n);
	}, e.getProperty = function(e, t) {
		return a.default.getProperty(e, k + t);
	}, e.removeProperty = function(e, t) {
		e.removeProperty(k + t);
	}, e.makeBsprAttributes = function(e) {
		e.data.root.walkTree(function(e, t) {
			var n = [];
			e.getPropertyNames().forEach(function(t) {
				!A[t] && t.match(RegExp("^" + k)) && n.push(t + ":" + e.getProperty(t));
			}), n.length && a.default.setAttribute(e, "semantics", n.join(";"));
		});
	}, e.saveDocument = function(e) {
		if (s = e.document, !("getBBox" in s.outputJax)) throw Error("The bussproofs extension requires an output jax with a getBBox() method");
	}, e.clearDocument = function(e) {
		s = null;
	};
})), I = /* @__PURE__ */ e(((e) => {
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
	}), a = e && e.__importStar || function(e) {
		if (e && e.__esModule) return e;
		var t = {};
		if (e != null) for (var i in e) i !== "default" && Object.prototype.hasOwnProperty.call(e, i) && n(t, e, i);
		return r(t, e), t;
	}, o = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.ProofTreeItem = void 0;
	var s = o(i()), l = c(), u = o(p()), d = a(F());
	e.ProofTreeItem = function(e) {
		t(n, e);
		function n() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.leftLabel = null, t.rigthLabel = null, t.innerStack = new u.default(t.factory, {}, !0), t;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "proofTree";
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.checkItem = function(e) {
			if (e.isKind("end") && e.getName() === "prooftree") {
				var t = this.toMml();
				return d.setProperty(t, "proof", !0), [[this.factory.create("mml", t), e], !0];
			}
			if (e.isKind("stop")) throw new s.default("EnvMissingEnd", "Missing \\end{%1}", this.getName());
			return this.innerStack.Push(e), l.BaseItem.fail;
		}, n.prototype.toMml = function() {
			var t = e.prototype.toMml.call(this), n = this.innerStack.Top();
			if (n.isKind("start") && !n.Size()) return t;
			this.innerStack.Push(this.factory.create("stop"));
			var r = this.innerStack.Top().toMml();
			return this.create("node", "mrow", [r, t], {});
		}, n;
	}(l.BaseItem);
})), L = /* @__PURE__ */ e(((e) => {
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
	}, a = e && e.__read || function(e, t) {
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
	}, o = e && e.__spreadArray || function(e, t, n) {
		if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++) (a || !(r in t)) && (a ||= Array.prototype.slice.call(t, 0, r), a[r] = t[r]);
		return e.concat(a || Array.prototype.slice.call(t));
	}, s = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 });
	var c = s(i()), l = s(g()), d = s(u()), f = r(F()), p = {};
	p.Prooftree = function(e, t) {
		return e.Push(t), e.itemFactory.create("proofTree").setProperties({
			name: t.getName(),
			line: "solid",
			currentLine: "solid",
			rootAtTop: !1
		});
	}, p.Axiom = function(e, t) {
		var n = e.stack.Top();
		if (n.kind !== "proofTree") throw new c.default("IllegalProofCommand", "Proof commands only allowed in prooftree environment.");
		var r = m(e, e.GetArgument(t));
		f.setProperty(r, "axiom", !0), n.Push(r);
	};
	var m = function(e, t) {
		var n = d.default.internalMath(e, d.default.trimSpaces(t), 0);
		if (!n[0].childNodes[0].childNodes.length) return e.create("node", "mrow", []);
		var r = e.create("node", "mspace", [], { width: ".5ex" }), i = e.create("node", "mspace", [], { width: ".5ex" });
		return e.create("node", "mrow", o(o([r], a(n), !1), [i], !1));
	};
	p.Inference = function(e, t, n) {
		var r = e.stack.Top();
		if (r.kind !== "proofTree") throw new c.default("IllegalProofCommand", "Proof commands only allowed in prooftree environment.");
		if (r.Size() < n) throw new c.default("BadProofTree", "Proof tree badly specified.");
		var i = r.getProperty("rootAtTop"), a = n === 1 && !r.Peek()[0].childNodes.length ? 0 : n, o = [];
		do
			o.length && o.unshift(e.create("node", "mtd", [], {})), o.unshift(e.create("node", "mtd", [r.Pop()], { rowalign: i ? "top" : "bottom" })), n--;
		while (n > 0);
		var s = e.create("node", "mtr", o, {}), l = e.create("node", "mtable", [s], { framespacing: "0 0" }), u = m(e, e.GetArgument(t)), d = r.getProperty("currentLine");
		d !== r.getProperty("line") && r.setProperty("currentLine", r.getProperty("line"));
		var p = h(e, l, [u], r.getProperty("left"), r.getProperty("right"), d, i);
		r.setProperty("left", null), r.setProperty("right", null), f.setProperty(p, "inference", a), e.configuration.addNode("inference", p), r.Push(p);
	};
	function h(e, t, n, r, i, a, o) {
		var s = e.create("node", "mtr", [e.create("node", "mtd", [t], {})], {}), c = e.create("node", "mtr", [e.create("node", "mtd", n, {})], {}), l = e.create("node", "mtable", o ? [c, s] : [s, c], {
			align: "top 2",
			rowlines: a,
			framespacing: "0 0"
		});
		f.setProperty(l, "inferenceRule", o ? "up" : "down");
		var u, d;
		r && (u = e.create("node", "mpadded", [r], {
			height: "+.5em",
			width: "+.5em",
			voffset: "-.15em"
		}), f.setProperty(u, "prooflabel", "left")), i && (d = e.create("node", "mpadded", [i], {
			height: "+.5em",
			width: "+.5em",
			voffset: "-.15em"
		}), f.setProperty(d, "prooflabel", "right"));
		var p, m;
		if (r && i) p = [
			u,
			l,
			d
		], m = "both";
		else if (r) p = [u, l], m = "left";
		else if (i) p = [l, d], m = "right";
		else return l;
		return l = e.create("node", "mrow", p), f.setProperty(l, "labelledRule", m), l;
	}
	p.Label = function(e, t, n) {
		var r = e.stack.Top();
		if (r.kind !== "proofTree") throw new c.default("IllegalProofCommand", "Proof commands only allowed in prooftree environment.");
		var i = d.default.internalMath(e, e.GetArgument(t), 0), a = i.length > 1 ? e.create("node", "mrow", i, {}) : i[0];
		r.setProperty(n, a);
	}, p.SetLine = function(e, t, n, r) {
		var i = e.stack.Top();
		if (i.kind !== "proofTree") throw new c.default("IllegalProofCommand", "Proof commands only allowed in prooftree environment.");
		i.setProperty("currentLine", n), r && i.setProperty("line", n);
	}, p.RootAtTop = function(e, t, n) {
		var r = e.stack.Top();
		if (r.kind !== "proofTree") throw new c.default("IllegalProofCommand", "Proof commands only allowed in prooftree environment.");
		r.setProperty("rootAtTop", n);
	}, p.AxiomF = function(e, t) {
		var n = e.stack.Top();
		if (n.kind !== "proofTree") throw new c.default("IllegalProofCommand", "Proof commands only allowed in prooftree environment.");
		var r = _(e, t);
		f.setProperty(r, "axiom", !0), n.Push(r);
	};
	function _(e, t) {
		if (e.GetNext() !== "$") throw new c.default("IllegalUseOfCommand", "Use of %1 does not match it's definition.", t);
		e.i++;
		var n = e.GetUpTo(t, "$");
		if (n.indexOf("\\fCenter") === -1) throw new c.default("IllegalUseOfCommand", "Missing \\fCenter in %1.", t);
		var r = a(n.split("\\fCenter"), 2), i = r[0], o = r[1], s = new l.default(i, e.stack.env, e.configuration).mml(), u = new l.default(o, e.stack.env, e.configuration).mml(), d = new l.default("\\fCenter", e.stack.env, e.configuration).mml(), p = e.create("node", "mtd", [s], {}), m = e.create("node", "mtd", [d], {}), h = e.create("node", "mtd", [u], {}), g = e.create("node", "mtr", [
			p,
			m,
			h
		], {}), _ = e.create("node", "mtable", [g], {
			columnspacing: ".5ex",
			columnalign: "center 2"
		});
		return f.setProperty(_, "sequent", !0), e.configuration.addNode("sequent", g), _;
	}
	p.FCenter = function(e, t) {}, p.InferenceF = function(e, t, n) {
		var r = e.stack.Top();
		if (r.kind !== "proofTree") throw new c.default("IllegalProofCommand", "Proof commands only allowed in prooftree environment.");
		if (r.Size() < n) throw new c.default("BadProofTree", "Proof tree badly specified.");
		var i = r.getProperty("rootAtTop"), a = n === 1 && !r.Peek()[0].childNodes.length ? 0 : n, o = [];
		do
			o.length && o.unshift(e.create("node", "mtd", [], {})), o.unshift(e.create("node", "mtd", [r.Pop()], { rowalign: i ? "top" : "bottom" })), n--;
		while (n > 0);
		var s = e.create("node", "mtr", o, {}), l = e.create("node", "mtable", [s], { framespacing: "0 0" }), u = _(e, t), d = r.getProperty("currentLine");
		d !== r.getProperty("line") && r.setProperty("currentLine", r.getProperty("line"));
		var p = h(e, l, [u], r.getProperty("left"), r.getProperty("right"), d, i);
		r.setProperty("left", null), r.setProperty("right", null), f.setProperty(p, "inference", a), e.configuration.addNode("inference", p), r.Push(p);
	}, e.default = p;
})), ne = /* @__PURE__ */ e(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 });
	var n = t(L()), r = t(m()), i = h();
	new i.CommandMap("Bussproofs-macros", {
		AxiomC: "Axiom",
		UnaryInfC: ["Inference", 1],
		BinaryInfC: ["Inference", 2],
		TrinaryInfC: ["Inference", 3],
		QuaternaryInfC: ["Inference", 4],
		QuinaryInfC: ["Inference", 5],
		RightLabel: ["Label", "right"],
		LeftLabel: ["Label", "left"],
		AXC: "Axiom",
		UIC: ["Inference", 1],
		BIC: ["Inference", 2],
		TIC: ["Inference", 3],
		RL: ["Label", "right"],
		LL: ["Label", "left"],
		noLine: [
			"SetLine",
			"none",
			!1
		],
		singleLine: [
			"SetLine",
			"solid",
			!1
		],
		solidLine: [
			"SetLine",
			"solid",
			!1
		],
		dashedLine: [
			"SetLine",
			"dashed",
			!1
		],
		alwaysNoLine: [
			"SetLine",
			"none",
			!0
		],
		alwaysSingleLine: [
			"SetLine",
			"solid",
			!0
		],
		alwaysSolidLine: [
			"SetLine",
			"solid",
			!0
		],
		alwaysDashedLine: [
			"SetLine",
			"dashed",
			!0
		],
		rootAtTop: ["RootAtTop", !0],
		alwaysRootAtTop: ["RootAtTop", !0],
		rootAtBottom: ["RootAtTop", !1],
		alwaysRootAtBottom: ["RootAtTop", !1],
		fCenter: "FCenter",
		Axiom: "AxiomF",
		UnaryInf: ["InferenceF", 1],
		BinaryInf: ["InferenceF", 2],
		TrinaryInf: ["InferenceF", 3],
		QuaternaryInf: ["InferenceF", 4],
		QuinaryInf: ["InferenceF", 5]
	}, n.default), new i.EnvironmentMap("Bussproofs-environments", r.default.environment, { prooftree: [
		"Prooftree",
		null,
		!1
	] }, n.default);
})), re = /* @__PURE__ */ e(((e) => {
	var t;
	Object.defineProperty(e, "__esModule", { value: !0 }), e.BussproofsConfiguration = void 0;
	var n = o(), r = I(), i = F();
	ne(), e.BussproofsConfiguration = n.Configuration.create("bussproofs", {
		handler: {
			macro: ["Bussproofs-macros"],
			environment: ["Bussproofs-environments"]
		},
		items: (t = {}, t[r.ProofTreeItem.prototype.kind] = r.ProofTreeItem, t),
		preprocessors: [[i.saveDocument, 1]],
		postprocessors: [
			[i.clearDocument, 3],
			[i.makeBsprAttributes, 2],
			[i.balanceRules, 1]
		]
	});
})), R = /* @__PURE__ */ e(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.EncloseConfiguration = e.EncloseMethods = e.ENCLOSE_OPTIONS = void 0;
	var n = o(), r = h(), i = t(u());
	e.ENCLOSE_OPTIONS = {
		"data-arrowhead": 1,
		color: 1,
		mathcolor: 1,
		background: 1,
		mathbackground: 1,
		"data-padding": 1,
		"data-thickness": 1
	}, e.EncloseMethods = {}, e.EncloseMethods.Enclose = function(t, n) {
		var r = t.GetArgument(n).replace(/,/g, " "), a = t.GetBrackets(n, ""), o = t.ParseArg(n), s = i.default.keyvalOptions(a, e.ENCLOSE_OPTIONS);
		s.notation = r, t.Push(t.create("node", "menclose", [o], s));
	}, new r.CommandMap("enclose", { enclose: "Enclose" }, e.EncloseMethods), e.EncloseConfiguration = n.Configuration.create("enclose", { handler: { macro: ["enclose"] } });
})), ie = /* @__PURE__ */ e(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.CancelConfiguration = e.CancelMethods = void 0;
	var n = o(), r = d(), i = h(), a = t(u()), s = R();
	e.CancelMethods = {}, e.CancelMethods.Cancel = function(e, t, n) {
		var r = e.GetBrackets(t, ""), i = e.ParseArg(t), o = a.default.keyvalOptions(r, s.ENCLOSE_OPTIONS);
		o.notation = n, e.Push(e.create("node", "menclose", [i], o));
	}, e.CancelMethods.CancelTo = function(e, t) {
		var n = e.GetBrackets(t, ""), i = e.ParseArg(t), o = e.ParseArg(t), c = a.default.keyvalOptions(n, s.ENCLOSE_OPTIONS);
		c.notation = [
			r.TexConstant.Notation.UPDIAGONALSTRIKE,
			r.TexConstant.Notation.UPDIAGONALARROW,
			r.TexConstant.Notation.NORTHEASTARROW
		].join(" "), i = e.create("node", "mpadded", [i], {
			depth: "-.1em",
			height: "+.1em",
			voffset: ".1em"
		}), e.Push(e.create("node", "msup", [e.create("node", "menclose", [o], c), i]));
	}, new i.CommandMap("cancel", {
		cancel: ["Cancel", r.TexConstant.Notation.UPDIAGONALSTRIKE],
		bcancel: ["Cancel", r.TexConstant.Notation.DOWNDIAGONALSTRIKE],
		xcancel: ["Cancel", r.TexConstant.Notation.UPDIAGONALSTRIKE + " " + r.TexConstant.Notation.DOWNDIAGONALSTRIKE],
		cancelto: "CancelTo"
	}, e.CancelMethods), e.CancelConfiguration = n.Configuration.create("cancel", { handler: { macro: ["cancel"] } });
})), z = /* @__PURE__ */ e(((e) => {
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
	}, i = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.EmpheqUtil = void 0;
	var a = i(u()), o = i(g());
	e.EmpheqUtil = {
		environment: function(e, r, i, a) {
			var o = a[0], s = e.itemFactory.create(o + "-begin").setProperties({
				name: r,
				end: o
			});
			e.Push(i.apply(void 0, n([e, s], t(a.slice(1)), !1)));
		},
		splitOptions: function(e, t) {
			return t === void 0 && (t = null), a.default.keyvalOptions(e, t, !0);
		},
		columnCount: function(e) {
			var t, n, i = 0;
			try {
				for (var a = r(e.childNodes), o = a.next(); !o.done; o = a.next()) {
					var s = o.value, c = s.childNodes.length - +!!s.isKind("mlabeledtr");
					c > i && (i = c);
				}
			} catch (e) {
				t = { error: e };
			} finally {
				try {
					o && !o.done && (n = a.return) && n.call(a);
				} finally {
					if (t) throw t.error;
				}
			}
			return i;
		},
		cellBlock: function(e, t, n, i) {
			var a, s, c = n.create("node", "mpadded", [], {
				height: 0,
				depth: 0,
				voffset: "-1height"
			}), l = new o.default(e, n.stack.env, n.configuration), u = l.mml();
			i && l.configuration.tags.label && (l.configuration.tags.currentTag.env = i, l.configuration.tags.getTag(!0));
			try {
				for (var d = r(u.isInferred ? u.childNodes : [u]), f = d.next(); !f.done; f = d.next()) {
					var p = f.value;
					c.appendChild(p);
				}
			} catch (e) {
				a = { error: e };
			} finally {
				try {
					f && !f.done && (s = d.return) && s.call(d);
				} finally {
					if (a) throw a.error;
				}
			}
			return c.appendChild(n.create("node", "mphantom", [n.create("node", "mpadded", [t], { width: 0 })])), c;
		},
		topRowTable: function(e, t) {
			var n = a.default.copyNode(e, t);
			return n.setChildren(n.childNodes.slice(0, 1)), n.attributes.set("align", "baseline 1"), e.factory.create("mphantom", {}, [t.create("node", "mpadded", [n], { width: 0 })]);
		},
		rowspanCell: function(e, t, n, r, i) {
			e.appendChild(r.create("node", "mpadded", [this.cellBlock(t, a.default.copyNode(n, r), r, i), this.topRowTable(n, r)], {
				height: 0,
				depth: 0,
				voffset: "height"
			}));
		},
		left: function(e, t, n, i, a) {
			var o, s;
			a === void 0 && (a = ""), e.attributes.set("columnalign", "right " + (e.attributes.get("columnalign") || "")), e.attributes.set("columnspacing", "0em " + (e.attributes.get("columnspacing") || ""));
			var c;
			try {
				for (var l = r(e.childNodes.slice(0).reverse()), u = l.next(); !u.done; u = l.next()) {
					var d = u.value;
					c = i.create("node", "mtd"), d.childNodes.unshift(c), c.parent = d, d.isKind("mlabeledtr") && (d.childNodes[0] = d.childNodes[1], d.childNodes[1] = c);
				}
			} catch (e) {
				o = { error: e };
			} finally {
				try {
					u && !u.done && (s = l.return) && s.call(l);
				} finally {
					if (o) throw o.error;
				}
			}
			this.rowspanCell(c, n, t, i, a);
		},
		right: function(t, n, r, i, a) {
			a === void 0 && (a = ""), t.childNodes.length === 0 && t.appendChild(i.create("node", "mtr"));
			for (var o = e.EmpheqUtil.columnCount(t), s = t.childNodes[0]; s.childNodes.length < o;) s.appendChild(i.create("node", "mtd"));
			var c = s.appendChild(i.create("node", "mtd"));
			e.EmpheqUtil.rowspanCell(c, r, n, i, a), t.attributes.set("columnalign", (t.attributes.get("columnalign") || "").split(/ /).slice(0, o).join(" ") + " left"), t.attributes.set("columnspacing", (t.attributes.get("columnspacing") || "").split(/ /).slice(0, o - 1).join(" ") + " 0em");
		},
		adjustTable: function(e, t) {
			var n = e.getProperty("left"), r = e.getProperty("right");
			if (n || r) {
				var i = e.Last, o = a.default.copyNode(i, t);
				n && this.left(i, o, n, t), r && this.right(i, o, r, t);
			}
		},
		allowEnv: {
			equation: !0,
			align: !0,
			gather: !0,
			flalign: !0,
			alignat: !0,
			multline: !0
		},
		checkEnv: function(e) {
			return this.allowEnv.hasOwnProperty(e.replace(/\*$/, "")) || !1;
		}
	};
})), ae = /* @__PURE__ */ e(((e) => {
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
	})(), n = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	}, r;
	Object.defineProperty(e, "__esModule", { value: !0 }), e.CasesConfiguration = e.CasesMethods = e.CasesTags = e.CasesBeginItem = void 0;
	var s = o(), c = h(), l = n(u()), d = n(_()), f = n(i()), p = a(), m = D(), g = z(), v = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "cases-begin";
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.checkItem = function(t) {
			return t.isKind("end") && t.getName() === this.getName() && this.getProperty("end") ? (this.setProperty("end", !1), [[], !0]) : e.prototype.checkItem.call(this, t);
		}, n;
	}(p.BeginItem);
	e.CasesBeginItem = v;
	var y = function(e) {
		t(n, e);
		function n() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.subcounter = 0, t;
		}
		return n.prototype.start = function(t, n, r) {
			this.subcounter = 0, e.prototype.start.call(this, t, n, r);
		}, n.prototype.autoTag = function() {
			this.currentTag.tag ?? (this.currentTag.env === "subnumcases" ? (this.subcounter === 0 && this.counter++, this.subcounter++, this.tag(this.formatNumber(this.counter, this.subcounter), !1)) : ((this.subcounter === 0 || this.currentTag.env !== "numcases-left") && this.counter++, this.tag(this.formatNumber(this.counter), !1)));
		}, n.prototype.formatNumber = function(e, t) {
			return t === void 0 && (t = null), e.toString() + (t === null ? "" : String.fromCharCode(96 + t));
		}, n;
	}(m.AmsTags);
	e.CasesTags = y, e.CasesMethods = {
		NumCases: function(e, t) {
			if (e.stack.env.closing === t.getName()) {
				delete e.stack.env.closing, e.Push(e.itemFactory.create("end").setProperty("name", t.getName()));
				var n = e.stack.Top(), r = n.Last, i = l.default.copyNode(r, e), a = n.getProperty("left");
				return g.EmpheqUtil.left(r, i, a + "\\empheqlbrace\\,", e, "numcases-left"), e.Push(e.itemFactory.create("end").setProperty("name", t.getName())), null;
			} else {
				var a = e.GetArgument("\\begin{" + t.getName() + "}");
				t.setProperty("left", a);
				var o = d.default.EqnArray(e, t, !0, !0, "ll");
				return o.arraydef.displaystyle = !1, o.arraydef.rowspacing = ".2em", o.setProperty("numCases", !0), e.Push(t), o;
			}
		},
		Entry: function(e, t) {
			if (!e.stack.Top().getProperty("numCases")) return d.default.Entry(e, t);
			e.Push(e.itemFactory.create("cell").setProperties({
				isEntry: !0,
				name: t
			}));
			for (var n = e.string, r = 0, i = e.i, a = n.length; i < a;) {
				var o = n.charAt(i);
				if (o === "{") r++, i++;
				else if (o === "}") {
					if (r === 0) break;
					r--, i++;
				} else if (o === "&" && r === 0) throw new f.default("ExtraCasesAlignTab", "Extra alignment tab in text for numcase environment");
				else if (o === "\\" && r === 0) {
					var s = (n.slice(i + 1).match(/^[a-z]+|./i) || [])[0];
					if (s === "\\" || s === "cr" || s === "end" || s === "label") break;
					i += s.length;
				} else i++;
			}
			var c = n.substr(e.i, i - e.i).replace(/^\s*/, "");
			e.PushAll(l.default.internalMath(e, c, 0)), e.i = i;
		}
	}, new c.EnvironmentMap("cases-env", g.EmpheqUtil.environment, {
		numcases: ["NumCases", "cases"],
		subnumcases: ["NumCases", "cases"]
	}, e.CasesMethods), new c.MacroMap("cases-macros", { "&": "Entry" }, e.CasesMethods), e.CasesConfiguration = s.Configuration.create("cases", {
		handler: {
			environment: ["cases-env"],
			character: ["cases-macros"]
		},
		items: (r = {}, r[v.prototype.kind] = v, r),
		tags: { cases: y }
	});
})), oe = /* @__PURE__ */ e(((e) => {
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
	}, n = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.CenternotConfiguration = e.filterCenterOver = void 0;
	var r = o(), i = n(g()), a = n(x()), s = h(), c = n(_());
	new s.CommandMap("centernot", {
		centerOver: "CenterOver",
		centernot: [
			"Macro",
			"\\centerOver{#1}{{⧸}}",
			1
		]
	}, {
		CenterOver: function(e, t) {
			var n = "{" + e.GetArgument(t) + "}", r = e.ParseArg(t), a = new i.default(n, e.stack.env, e.configuration).mml(), o = e.create("node", "TeXAtom", [new i.default(n, e.stack.env, e.configuration).mml(), e.create("node", "mpadded", [e.create("node", "mpadded", [r], {
				width: 0,
				lspace: "-.5width"
			}), e.create("node", "mphantom", [a])], {
				width: 0,
				lspace: "-.5width"
			})]);
			e.configuration.addNode("centerOver", a), e.Push(o);
		},
		Macro: c.default.Macro
	});
	function l(e) {
		var n, r, i = e.data;
		try {
			for (var o = t(i.getList("centerOver")), s = o.next(); !s.done; s = o.next()) {
				var c = s.value, l = a.default.getTexClass(c.childNodes[0].childNodes[0]);
				l !== null && a.default.setProperties(c.parent.parent.parent.parent.parent.parent, { texClass: l });
			}
		} catch (e) {
			n = { error: e };
		} finally {
			try {
				s && !s.done && (r = o.return) && r.call(o);
			} finally {
				if (n) throw n.error;
			}
		}
	}
	e.filterCenterOver = l, e.CenternotConfiguration = r.Configuration.create("centernot", {
		handler: { macro: ["centernot"] },
		postprocessors: [l]
	});
})), se = /* @__PURE__ */ e(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.ColorMethods = void 0;
	var n = t(x()), r = t(u());
	function i(e) {
		var t = `+${e}`, n = e.replace(/^.*?([a-z]*)$/, "$1");
		return {
			width: `+${2 * parseFloat(t)}${n}`,
			height: t,
			depth: t,
			lspace: e
		};
	}
	e.ColorMethods = {}, e.ColorMethods.Color = function(e, t) {
		var n = e.GetBrackets(t, ""), r = e.GetArgument(t), i = e.configuration.packageData.get("color").model.getColor(n, r), a = e.itemFactory.create("style").setProperties({ styles: { mathcolor: i } });
		e.stack.env.color = i, e.Push(a);
	}, e.ColorMethods.TextColor = function(e, t) {
		var n = e.GetBrackets(t, ""), r = e.GetArgument(t), i = e.configuration.packageData.get("color").model.getColor(n, r), a = e.stack.env.color;
		e.stack.env.color = i;
		var o = e.ParseArg(t);
		a ? e.stack.env.color = a : delete e.stack.env.color;
		var s = e.create("node", "mstyle", [o], { mathcolor: i });
		e.Push(s);
	}, e.ColorMethods.DefineColor = function(e, t) {
		var n = e.GetArgument(t), r = e.GetArgument(t), i = e.GetArgument(t);
		e.configuration.packageData.get("color").model.defineColor(r, n, i);
	}, e.ColorMethods.ColorBox = function(e, t) {
		var a = e.GetArgument(t), o = r.default.internalMath(e, e.GetArgument(t)), s = e.configuration.packageData.get("color").model, c = e.create("node", "mpadded", o, { mathbackground: s.getColor("named", a) });
		n.default.setProperties(c, i(e.options.color.padding)), e.Push(c);
	}, e.ColorMethods.FColorBox = function(e, t) {
		var a = e.GetArgument(t), o = e.GetArgument(t), s = r.default.internalMath(e, e.GetArgument(t)), c = e.options.color, l = e.configuration.packageData.get("color").model, u = e.create("node", "mpadded", s, {
			mathbackground: l.getColor("named", o),
			style: `border: ${c.borderWidth} solid ${l.getColor("named", a)}`
		});
		n.default.setProperties(u, i(c.padding)), e.Push(u);
	};
})), ce = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.COLORS = void 0, e.COLORS = new Map([
		["Apricot", "#FBB982"],
		["Aquamarine", "#00B5BE"],
		["Bittersweet", "#C04F17"],
		["Black", "#221E1F"],
		["Blue", "#2D2F92"],
		["BlueGreen", "#00B3B8"],
		["BlueViolet", "#473992"],
		["BrickRed", "#B6321C"],
		["Brown", "#792500"],
		["BurntOrange", "#F7921D"],
		["CadetBlue", "#74729A"],
		["CarnationPink", "#F282B4"],
		["Cerulean", "#00A2E3"],
		["CornflowerBlue", "#41B0E4"],
		["Cyan", "#00AEEF"],
		["Dandelion", "#FDBC42"],
		["DarkOrchid", "#A4538A"],
		["Emerald", "#00A99D"],
		["ForestGreen", "#009B55"],
		["Fuchsia", "#8C368C"],
		["Goldenrod", "#FFDF42"],
		["Gray", "#949698"],
		["Green", "#00A64F"],
		["GreenYellow", "#DFE674"],
		["JungleGreen", "#00A99A"],
		["Lavender", "#F49EC4"],
		["LimeGreen", "#8DC73E"],
		["Magenta", "#EC008C"],
		["Mahogany", "#A9341F"],
		["Maroon", "#AF3235"],
		["Melon", "#F89E7B"],
		["MidnightBlue", "#006795"],
		["Mulberry", "#A93C93"],
		["NavyBlue", "#006EB8"],
		["OliveGreen", "#3C8031"],
		["Orange", "#F58137"],
		["OrangeRed", "#ED135A"],
		["Orchid", "#AF72B0"],
		["Peach", "#F7965A"],
		["Periwinkle", "#7977B8"],
		["PineGreen", "#008B72"],
		["Plum", "#92268F"],
		["ProcessBlue", "#00B0F0"],
		["Purple", "#99479B"],
		["RawSienna", "#974006"],
		["Red", "#ED1B23"],
		["RedOrange", "#F26035"],
		["RedViolet", "#A1246B"],
		["Rhodamine", "#EF559F"],
		["RoyalBlue", "#0071BC"],
		["RoyalPurple", "#613F99"],
		["RubineRed", "#ED017D"],
		["Salmon", "#F69289"],
		["SeaGreen", "#3FBC9D"],
		["Sepia", "#671800"],
		["SkyBlue", "#46C5DD"],
		["SpringGreen", "#C6DC67"],
		["Tan", "#DA9D76"],
		["TealBlue", "#00AEB3"],
		["Thistle", "#D883B7"],
		["Turquoise", "#00B4CE"],
		["Violet", "#58429B"],
		["VioletRed", "#EF58A0"],
		["White", "#FFFFFF"],
		["WildStrawberry", "#EE2967"],
		["Yellow", "#FFF200"],
		["YellowGreen", "#98CC70"],
		["YellowOrange", "#FAA21A"]
	]);
})), B = /* @__PURE__ */ e(((e) => {
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
	}, n = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.ColorModel = void 0;
	var r = n(i()), a = ce(), o = /* @__PURE__ */ new Map();
	e.ColorModel = function() {
		function e() {
			this.userColors = /* @__PURE__ */ new Map();
		}
		return e.prototype.normalizeColor = function(e, t) {
			if (!e || e === "named") return t;
			if (o.has(e)) return o.get(e)(t);
			throw new r.default("UndefinedColorModel", "Color model '%1' not defined", e);
		}, e.prototype.getColor = function(e, t) {
			return !e || e === "named" ? this.getColorByName(t) : this.normalizeColor(e, t);
		}, e.prototype.getColorByName = function(e) {
			return this.userColors.has(e) ? this.userColors.get(e) : a.COLORS.has(e) ? a.COLORS.get(e) : e;
		}, e.prototype.defineColor = function(e, t, n) {
			var r = this.normalizeColor(e, n);
			this.userColors.set(t, r);
		}, e;
	}(), o.set("rgb", function(e) {
		var n, i, a = e.trim().split(/\s*,\s*/), o = "#";
		if (a.length !== 3) throw new r.default("ModelArg1", "Color values for the %1 model require 3 numbers", "rgb");
		try {
			for (var s = t(a), c = s.next(); !c.done; c = s.next()) {
				var l = c.value;
				if (!l.match(/^(\d+(\.\d*)?|\.\d+)$/)) throw new r.default("InvalidDecimalNumber", "Invalid decimal number");
				var u = parseFloat(l);
				if (u < 0 || u > 1) throw new r.default("ModelArg2", "Color values for the %1 model must be between %2 and %3", "rgb", "0", "1");
				var d = Math.floor(u * 255).toString(16);
				d.length < 2 && (d = "0" + d), o += d;
			}
		} catch (e) {
			n = { error: e };
		} finally {
			try {
				c && !c.done && (i = s.return) && i.call(s);
			} finally {
				if (n) throw n.error;
			}
		}
		return o;
	}), o.set("RGB", function(e) {
		var n, i, a = e.trim().split(/\s*,\s*/), o = "#";
		if (a.length !== 3) throw new r.default("ModelArg1", "Color values for the %1 model require 3 numbers", "RGB");
		try {
			for (var s = t(a), c = s.next(); !c.done; c = s.next()) {
				var l = c.value;
				if (!l.match(/^\d+$/)) throw new r.default("InvalidNumber", "Invalid number");
				var u = parseInt(l);
				if (u > 255) throw new r.default("ModelArg2", "Color values for the %1 model must be between %2 and %3", "RGB", "0", "255");
				var d = u.toString(16);
				d.length < 2 && (d = "0" + d), o += d;
			}
		} catch (e) {
			n = { error: e };
		} finally {
			try {
				c && !c.done && (i = s.return) && i.call(s);
			} finally {
				if (n) throw n.error;
			}
		}
		return o;
	}), o.set("gray", function(e) {
		if (!e.match(/^\s*(\d+(\.\d*)?|\.\d+)\s*$/)) throw new r.default("InvalidDecimalNumber", "Invalid decimal number");
		var t = parseFloat(e);
		if (t < 0 || t > 1) throw new r.default("ModelArg2", "Color values for the %1 model must be between %2 and %3", "gray", "0", "1");
		var n = Math.floor(t * 255).toString(16);
		return n.length < 2 && (n = "0" + n), `#${n}${n}${n}`;
	});
})), V = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.ColorConfiguration = void 0;
	var t = h(), n = o(), r = se(), i = B();
	new t.CommandMap("color", {
		color: "Color",
		textcolor: "TextColor",
		definecolor: "DefineColor",
		colorbox: "ColorBox",
		fcolorbox: "FColorBox"
	}, r.ColorMethods), e.ColorConfiguration = n.Configuration.create("color", {
		handler: { macro: ["color"] },
		options: { color: {
			padding: "5px",
			borderWidth: "2px"
		} },
		config: function(e, t) {
			t.parseOptions.packageData.set("color", { model: new i.ColorModel() });
		}
	});
})), H = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.ColorConfiguration = e.ColorV2Methods = void 0;
	var t = h(), n = o();
	e.ColorV2Methods = { Color: function(e, t) {
		var n = e.GetArgument(t), r = e.stack.env.color;
		e.stack.env.color = n;
		var i = e.ParseArg(t);
		r ? e.stack.env.color = r : delete e.stack.env.color;
		var a = e.create("node", "mstyle", [i], { mathcolor: n });
		e.Push(a);
	} }, new t.CommandMap("colorv2", { color: "Color" }, e.ColorV2Methods), e.ColorConfiguration = n.Configuration.create("colorv2", { handler: { macro: ["colorv2"] } });
})), U = /* @__PURE__ */ e(((e) => {
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
	})(), n = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.ColortblConfiguration = e.ColorArrayItem = void 0;
	var r = a(), s = o(), c = h(), l = n(i()), u = function(e) {
		t(n, e);
		function n() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.color = {
				cell: "",
				row: "",
				col: []
			}, t.hasColor = !1, t;
		}
		return n.prototype.EndEntry = function() {
			e.prototype.EndEntry.call(this);
			var t = this.row[this.row.length - 1], n = this.color.cell || this.color.row || this.color.col[this.row.length - 1];
			n && (t.attributes.set("mathbackground", n), this.color.cell = "", this.hasColor = !0);
		}, n.prototype.EndRow = function() {
			e.prototype.EndRow.call(this), this.color.row = "";
		}, n.prototype.createMml = function() {
			var t = e.prototype.createMml.call(this), n = t.isKind("mrow") ? t.childNodes[1] : t;
			return n.isKind("menclose") && (n = n.childNodes[0].childNodes[0]), this.hasColor && n.attributes.get("frame") === "none" && n.attributes.set("frame", ""), t;
		}, n;
	}(r.ArrayItem);
	e.ColorArrayItem = u, new c.CommandMap("colortbl", {
		cellcolor: ["TableColor", "cell"],
		rowcolor: ["TableColor", "row"],
		columncolor: ["TableColor", "col"]
	}, { TableColor: function(e, t, n) {
		var r = e.configuration.packageData.get("color").model, i = e.GetBrackets(t, ""), a = r.getColor(i, e.GetArgument(t)), o = e.stack.Top();
		if (!(o instanceof u)) throw new l.default("UnsupportedTableColor", "Unsupported use of %1", e.currentCS);
		if (n === "col") {
			if (o.table.length) throw new l.default("ColumnColorNotTop", "%1 must be in the top row", t);
			o.color.col[o.row.length] = a, e.GetBrackets(t, "") && e.GetBrackets(t, "");
		} else if (o.color[n] = a, n === "row" && (o.Size() || o.row.length)) throw new l.default("RowColorNotFirst", "%1 must be at the beginning of a row", t);
	} }), e.ColortblConfiguration = s.Configuration.create("colortbl", {
		handler: { macro: ["colortbl"] },
		items: { array: u },
		priority: 10,
		config: [function(e, t) {
			t.parseOptions.packageData.has("color") || s.ConfigurationHandler.get("color").config(e, t);
		}, 10]
	});
})), W = /* @__PURE__ */ e(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 });
	var n = t(u()), r = t(i()), a = v(), o;
	(function(e) {
		function t(e, t) {
			var n = [e, t.char];
			if (t.attributes) for (var r in t.attributes) n.push(r), n.push(t.attributes[r]);
			return n;
		}
		e.disassembleSymbol = t;
		function i(e) {
			for (var t = e[0], n = e[1], r = {}, i = 2; i < e.length; i += 2) r[e[i]] = e[i + 1];
			return new a.Symbol(t, n, r);
		}
		e.assembleSymbol = i;
		function o(e, t) {
			if (e.GetNext() !== "\\") throw new r.default("MissingCS", "%1 must be followed by a control sequence", t);
			return n.default.trimSpaces(e.GetArgument(t)).substr(1);
		}
		e.GetCSname = o;
		function s(e, t) {
			var i = n.default.trimSpaces(e.GetArgument(t));
			if (i.charAt(0) === "\\" && (i = i.substr(1)), !i.match(/^(.|[a-z]+)$/i)) throw new r.default("IllegalControlSequenceName", "Illegal control sequence name for %1", t);
			return i;
		}
		e.GetCsNameArgument = s;
		function c(e, t) {
			var i = e.GetBrackets(t);
			if (i && (i = n.default.trimSpaces(i), !i.match(/^[0-9]+$/))) throw new r.default("IllegalParamNumber", "Illegal number of parameters specified in %1", t);
			return i;
		}
		e.GetArgCount = c;
		function l(e, t, n) {
			for (var i = e.GetNext(), a = [], o = 0, s = e.i; e.i < e.string.length;) {
				if (i = e.GetNext(), i === "#") {
					if (s !== e.i && (a[o] = e.string.substr(s, e.i - s)), i = e.string.charAt(++e.i), !i.match(/^[1-9]$/)) throw new r.default("CantUseHash2", "Illegal use of # in template for %1", n);
					if (parseInt(i) !== ++o) throw new r.default("SequentialParam", "Parameters for %1 must be numbered sequentially", n);
					s = e.i + 1;
				} else if (i === "{") return s !== e.i && (a[o] = e.string.substr(s, e.i - s)), a.length > 0 ? [o.toString()].concat(a) : o;
				e.i++;
			}
			throw new r.default("MissingReplacementString", "Missing replacement string for definition of %1", t);
		}
		e.GetTemplate = l;
		function u(e, t, n) {
			if (n == null) return e.GetArgument(t);
			for (var i = e.i, a = 0, o = 0; e.i < e.string.length;) {
				var s = e.string.charAt(e.i);
				if (s === "{") e.i === i && (o = 1), e.GetArgument(t), a = e.i - i;
				else if (d(e, n)) return o && (i++, a -= 2), e.string.substr(i, a);
				else if (s === "\\") {
					e.i++, a++, o = 0;
					var c = e.string.substr(e.i).match(/[a-z]+|./i);
					c && (e.i += c[0].length, a = e.i - i);
				} else e.i++, a++, o = 0;
			}
			throw new r.default("RunawayArgument", "Runaway argument for %1?", t);
		}
		e.GetParameter = u;
		function d(e, t) {
			return e.string.substr(e.i, t.length) !== t || t.match(/\\[a-z]+$/i) && e.string.charAt(e.i + t.length).match(/[a-z]/i) ? 0 : (e.i += t.length, 1);
		}
		e.MatchParam = d;
		function f(t, n, r, i) {
			t.configuration.handlers.retrieve(e.NEW_DELIMITER).add(n, new a.Symbol(n, r, i));
		}
		e.addDelimiter = f;
		function p(t, n, r, i, o) {
			o === void 0 && (o = ""), t.configuration.handlers.retrieve(e.NEW_COMMAND).add(n, new a.Macro(o || n, r, i));
		}
		e.addMacro = p;
		function m(t, n, r, i) {
			t.configuration.handlers.retrieve(e.NEW_ENVIRONMENT).add(n, new a.Macro(n, r, i));
		}
		e.addEnvironment = m, e.NEW_DELIMITER = "new-Delimiter", e.NEW_COMMAND = "new-Command", e.NEW_ENVIRONMENT = "new-Environment";
	})(o ||= {}), e.default = o;
})), G = /* @__PURE__ */ e(((e) => {
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
	}, a = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 });
	var o = a(i()), s = r(h()), c = a(_()), l = a(u()), d = a(W()), f = {};
	f.NewCommand = function(e, t) {
		var n = d.default.GetCsNameArgument(e, t), r = d.default.GetArgCount(e, t), i = e.GetBrackets(t), a = e.GetArgument(t);
		d.default.addMacro(e, n, f.Macro, [
			a,
			r,
			i
		]);
	}, f.NewEnvironment = function(e, t) {
		var n = l.default.trimSpaces(e.GetArgument(t)), r = d.default.GetArgCount(e, t), i = e.GetBrackets(t), a = e.GetArgument(t), o = e.GetArgument(t);
		d.default.addEnvironment(e, n, f.BeginEnv, [
			!0,
			a,
			o,
			r,
			i
		]);
	}, f.MacroDef = function(e, t) {
		var n = d.default.GetCSname(e, t), r = d.default.GetTemplate(e, t, "\\" + n), i = e.GetArgument(t);
		r instanceof Array ? d.default.addMacro(e, n, f.MacroWithTemplate, [i].concat(r)) : d.default.addMacro(e, n, f.Macro, [i, r]);
	}, f.Let = function(e, t) {
		var n = d.default.GetCSname(e, t), r = e.GetNext();
		r === "=" && (e.i++, r = e.GetNext());
		var i = e.configuration.handlers;
		if (r === "\\") {
			t = d.default.GetCSname(e, t);
			var a = i.get("delimiter").lookup("\\" + t);
			if (a) {
				d.default.addDelimiter(e, "\\" + n, a.char, a.attributes);
				return;
			}
			var o = i.get("macro").applicable(t);
			if (!o) return;
			if (o instanceof s.MacroMap) {
				var c = o.lookup(t);
				d.default.addMacro(e, n, c.func, c.args, c.symbol);
				return;
			}
			a = o.lookup(t);
			var l = d.default.disassembleSymbol(n, a);
			d.default.addMacro(e, n, function(e, t) {
				var n = [...arguments].slice(2), r = d.default.assembleSymbol(n);
				return o.parser(e, r);
			}, l);
			return;
		}
		e.i++;
		var u = i.get("delimiter").lookup(r);
		if (u) {
			d.default.addDelimiter(e, "\\" + n, u.char, u.attributes);
			return;
		}
		d.default.addMacro(e, n, f.Macro, [r]);
	}, f.MacroWithTemplate = function(e, t, n, r) {
		var i = [...arguments].slice(4), a = parseInt(r, 10);
		if (a) {
			var s = [];
			if (e.GetNext(), i[0] && !d.default.MatchParam(e, i[0])) throw new o.default("MismatchUseDef", "Use of %1 doesn't match its definition", t);
			for (var c = 0; c < a; c++) s.push(d.default.GetParameter(e, t, i[c + 1]));
			n = l.default.substituteArgs(e, s, n);
		}
		e.string = l.default.addArgs(e, n, e.string.slice(e.i)), e.i = 0, l.default.checkMaxMacros(e);
	}, f.BeginEnv = function(e, t, n, r, i, a) {
		if (t.getProperty("end") && e.stack.env.closing === t.getName()) {
			delete e.stack.env.closing;
			var o = e.string.slice(e.i);
			return e.string = r, e.i = 0, e.Parse(), e.string = o, e.i = 0, e.itemFactory.create("end").setProperty("name", t.getName());
		}
		if (i) {
			var s = [];
			if (a != null) {
				var c = e.GetBrackets("\\begin{" + t.getName() + "}");
				s.push(c ?? a);
			}
			for (var u = s.length; u < i; u++) s.push(e.GetArgument("\\begin{" + t.getName() + "}"));
			n = l.default.substituteArgs(e, s, n), r = l.default.substituteArgs(e, [], r);
		}
		return e.string = l.default.addArgs(e, n, e.string.slice(e.i)), e.i = 0, e.itemFactory.create("beginEnv").setProperty("name", t.getName());
	}, f.Macro = c.default.Macro, e.default = f;
})), K = /* @__PURE__ */ e(((e) => {
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
	})(), n = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.BeginEnvItem = void 0;
	var r = n(i());
	e.BeginEnvItem = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "beginEnv";
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
				if (t.getName() !== this.getName()) throw new r.default("EnvBadEnd", "\\begin{%1} ended with \\end{%2}", this.getName(), t.getName());
				return [[this.factory.create("mml", this.toMml())], !0];
			}
			if (t.isKind("stop")) throw new r.default("EnvMissingEnd", "Missing \\end{%1}", this.getName());
			return e.prototype.checkItem.call(this, t);
		}, n;
	}(c().BaseItem);
})), le = /* @__PURE__ */ e(((e) => {
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
	}, r = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	}, i;
	Object.defineProperty(e, "__esModule", { value: !0 }), e.ConfigMacrosConfiguration = void 0;
	var a = o(), s = n(), c = h(), l = r(m()), u = v(), d = r(G()), f = K(), p = "configmacros-map", g = "configmacros-env-map";
	function _(e) {
		new c.CommandMap(p, {}, {}), new c.EnvironmentMap(g, l.default.environment, {}, {}), e.append(a.Configuration.local({
			handler: {
				macro: [p],
				environment: [g]
			},
			priority: 3
		}));
	}
	function y(e, t) {
		b(t), x(t);
	}
	function b(e) {
		var n, r, i = e.parseOptions.handlers.retrieve(p), a = e.parseOptions.options.macros;
		try {
			for (var o = t(Object.keys(a)), s = o.next(); !s.done; s = o.next()) {
				var c = s.value, l = typeof a[c] == "string" ? [a[c]] : a[c], f = Array.isArray(l[2]) ? new u.Macro(c, d.default.MacroWithTemplate, l.slice(0, 2).concat(l[2])) : new u.Macro(c, d.default.Macro, l);
				i.add(c, f);
			}
		} catch (e) {
			n = { error: e };
		} finally {
			try {
				s && !s.done && (r = o.return) && r.call(o);
			} finally {
				if (n) throw n.error;
			}
		}
	}
	function x(e) {
		var n, r, i = e.parseOptions.handlers.retrieve(g), a = e.parseOptions.options.environments;
		try {
			for (var o = t(Object.keys(a)), s = o.next(); !s.done; s = o.next()) {
				var c = s.value;
				i.add(c, new u.Macro(c, d.default.BeginEnv, [!0].concat(a[c])));
			}
		} catch (e) {
			n = { error: e };
		} finally {
			try {
				s && !s.done && (r = o.return) && r.call(o);
			} finally {
				if (n) throw n.error;
			}
		}
	}
	e.ConfigMacrosConfiguration = a.Configuration.create("configmacros", {
		init: _,
		config: y,
		items: (i = {}, i[f.BeginEnvItem.prototype.kind] = f.BeginEnvItem, i),
		options: {
			macros: (0, s.expandable)({}),
			environments: (0, s.expandable)({})
		}
	});
})), ue = /* @__PURE__ */ e(((e) => {
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
	}, r = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	}, s;
	Object.defineProperty(e, "__esModule", { value: !0 }), e.EmpheqConfiguration = e.EmpheqMethods = e.EmpheqBeginItem = void 0;
	var c = o(), l = h(), d = r(u()), f = r(i()), p = a(), m = z(), g = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "empheq-begin";
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.checkItem = function(t) {
			return t.isKind("end") && t.getName() === this.getName() && this.setProperty("end", !1), e.prototype.checkItem.call(this, t);
		}, n;
	}(p.BeginItem);
	e.EmpheqBeginItem = g, e.EmpheqMethods = {
		Empheq: function(e, t) {
			if (e.stack.env.closing === t.getName()) {
				delete e.stack.env.closing, e.Push(e.itemFactory.create("end").setProperty("name", e.stack.global.empheq)), e.stack.global.empheq = "";
				var r = e.stack.Top();
				m.EmpheqUtil.adjustTable(r, e), e.Push(e.itemFactory.create("end").setProperty("name", "empheq"));
			} else {
				d.default.checkEqnEnv(e), delete e.stack.global.eqnenv;
				var i = e.GetBrackets("\\begin{" + t.getName() + "}") || "", a = n((e.GetArgument("\\begin{" + t.getName() + "}") || "").split(/=/), 2), o = a[0], s = a[1];
				if (!m.EmpheqUtil.checkEnv(o)) throw new f.default("UnknownEnv", "Unknown environment \"%1\"", o);
				i && t.setProperties(m.EmpheqUtil.splitOptions(i, {
					left: 1,
					right: 1
				})), e.stack.global.empheq = o, e.string = "\\begin{" + o + "}" + (s ? "{" + s + "}" : "") + e.string.slice(e.i), e.i = 0, e.Push(t);
			}
		},
		EmpheqMO: function(e, t, n) {
			e.Push(e.create("token", "mo", {}, n));
		},
		EmpheqDelim: function(e, t) {
			var n = e.GetDelimiter(t);
			e.Push(e.create("token", "mo", {
				stretchy: !0,
				symmetric: !0
			}, n));
		}
	}, new l.EnvironmentMap("empheq-env", m.EmpheqUtil.environment, { empheq: ["Empheq", "empheq"] }, e.EmpheqMethods), new l.CommandMap("empheq-macros", {
		empheqlbrace: ["EmpheqMO", "{"],
		empheqrbrace: ["EmpheqMO", "}"],
		empheqlbrack: ["EmpheqMO", "["],
		empheqrbrack: ["EmpheqMO", "]"],
		empheqlangle: ["EmpheqMO", "⟨"],
		empheqrangle: ["EmpheqMO", "⟩"],
		empheqlparen: ["EmpheqMO", "("],
		empheqrparen: ["EmpheqMO", ")"],
		empheqlvert: ["EmpheqMO", "|"],
		empheqrvert: ["EmpheqMO", "|"],
		empheqlVert: ["EmpheqMO", "‖"],
		empheqrVert: ["EmpheqMO", "‖"],
		empheqlfloor: ["EmpheqMO", "⌊"],
		empheqrfloor: ["EmpheqMO", "⌋"],
		empheqlceil: ["EmpheqMO", "⌈"],
		empheqrceil: ["EmpheqMO", "⌉"],
		empheqbiglbrace: ["EmpheqMO", "{"],
		empheqbigrbrace: ["EmpheqMO", "}"],
		empheqbiglbrack: ["EmpheqMO", "["],
		empheqbigrbrack: ["EmpheqMO", "]"],
		empheqbiglangle: ["EmpheqMO", "⟨"],
		empheqbigrangle: ["EmpheqMO", "⟩"],
		empheqbiglparen: ["EmpheqMO", "("],
		empheqbigrparen: ["EmpheqMO", ")"],
		empheqbiglvert: ["EmpheqMO", "|"],
		empheqbigrvert: ["EmpheqMO", "|"],
		empheqbiglVert: ["EmpheqMO", "‖"],
		empheqbigrVert: ["EmpheqMO", "‖"],
		empheqbiglfloor: ["EmpheqMO", "⌊"],
		empheqbigrfloor: ["EmpheqMO", "⌋"],
		empheqbiglceil: ["EmpheqMO", "⌈"],
		empheqbigrceil: ["EmpheqMO", "⌉"],
		empheql: "EmpheqDelim",
		empheqr: "EmpheqDelim",
		empheqbigl: "EmpheqDelim",
		empheqbigr: "EmpheqDelim"
	}, e.EmpheqMethods), e.EmpheqConfiguration = c.Configuration.create("empheq", {
		handler: {
			macro: ["empheq-macros"],
			environment: ["empheq-env"]
		},
		items: (s = {}, s[g.prototype.kind] = g, s)
	});
})), de = /* @__PURE__ */ e(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 });
	var n = t(G());
	new (h()).CommandMap("Newcommand-macros", {
		newcommand: "NewCommand",
		renewcommand: "NewCommand",
		newenvironment: "NewEnvironment",
		renewenvironment: "NewEnvironment",
		def: "MacroDef",
		let: "Let"
	}, n.default);
})), q = /* @__PURE__ */ e(((e) => {
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
	}, a;
	Object.defineProperty(e, "__esModule", { value: !0 }), e.NewcommandConfiguration = void 0;
	var s = o(), c = K(), l = i(W());
	de();
	var u = i(m()), d = r(h()), f = function(e) {
		new d.DelimiterMap(l.default.NEW_DELIMITER, u.default.delimiter, {}), new d.CommandMap(l.default.NEW_COMMAND, {}, {}), new d.EnvironmentMap(l.default.NEW_ENVIRONMENT, u.default.environment, {}, {}), e.append(s.Configuration.local({
			handler: {
				character: [],
				delimiter: [l.default.NEW_DELIMITER],
				macro: [l.default.NEW_DELIMITER, l.default.NEW_COMMAND],
				environment: [l.default.NEW_ENVIRONMENT]
			},
			priority: -1
		}));
	};
	e.NewcommandConfiguration = s.Configuration.create("newcommand", {
		handler: { macro: ["Newcommand-macros"] },
		items: (a = {}, a[c.BeginEnvItem.prototype.kind] = c.BeginEnvItem, a),
		options: { maxMacros: 1e3 },
		init: f
	});
})), fe = /* @__PURE__ */ e(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.ExtpfeilConfiguration = e.ExtpfeilMethods = void 0;
	var n = o(), r = h(), a = T(), s = t(W()), c = q(), l = t(i());
	e.ExtpfeilMethods = {}, e.ExtpfeilMethods.xArrow = a.AmsMethods.xArrow, e.ExtpfeilMethods.NewExtArrow = function(t, n) {
		var r = t.GetArgument(n), i = t.GetArgument(n), a = t.GetArgument(n);
		if (!r.match(/^\\([a-z]+|.)$/i)) throw new l.default("NewextarrowArg1", "First argument to %1 must be a control sequence name", n);
		if (!i.match(/^(\d+),(\d+)$/)) throw new l.default("NewextarrowArg2", "Second argument to %1 must be two integers separated by a comma", n);
		if (!a.match(/^(\d+|0x[0-9A-F]+)$/i)) throw new l.default("NewextarrowArg3", "Third argument to %1 must be a unicode character number", n);
		r = r.substr(1);
		var o = i.split(",");
		s.default.addMacro(t, r, e.ExtpfeilMethods.xArrow, [
			parseInt(a),
			parseInt(o[0]),
			parseInt(o[1])
		]);
	}, new r.CommandMap("extpfeil", {
		xtwoheadrightarrow: [
			"xArrow",
			8608,
			12,
			16
		],
		xtwoheadleftarrow: [
			"xArrow",
			8606,
			17,
			13
		],
		xmapsto: [
			"xArrow",
			8614,
			6,
			7
		],
		xlongequal: [
			"xArrow",
			61,
			7,
			7
		],
		xtofrom: [
			"xArrow",
			8644,
			12,
			12
		],
		Newextarrow: "NewExtArrow"
	}, e.ExtpfeilMethods), e.ExtpfeilConfiguration = n.Configuration.create("extpfeil", {
		handler: { macro: ["extpfeil"] },
		init: function(e) {
			c.NewcommandConfiguration.init(e);
		}
	});
})), pe = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.GensymbConfiguration = void 0;
	var t = o(), n = d(), r = h();
	function i(e, t) {
		var r = t.attributes || {};
		r.mathvariant = n.TexConstant.Variant.NORMAL, r.class = "MathML-Unit";
		var i = e.create("token", "mi", r, t.char);
		e.Push(i);
	}
	new r.CharacterMap("gensymb-symbols", i, {
		ohm: "Ω",
		degree: "°",
		celsius: "℃",
		perthousand: "‰",
		micro: "µ"
	}), e.GensymbConfiguration = t.Configuration.create("gensymb", { handler: { macro: ["gensymb-symbols"] } });
})), me = /* @__PURE__ */ e(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 });
	var n = t(x()), r = {};
	r.Href = function(e, t) {
		var r = e.GetArgument(t), a = i(e, t);
		n.default.setAttribute(a, "href", r), e.Push(a);
	}, r.Class = function(e, t) {
		var r = e.GetArgument(t), a = i(e, t), o = n.default.getAttribute(a, "class");
		o && (r = o + " " + r), n.default.setAttribute(a, "class", r), e.Push(a);
	}, r.Style = function(e, t) {
		var r = e.GetArgument(t), a = i(e, t), o = n.default.getAttribute(a, "style");
		o && (r.charAt(r.length - 1) !== ";" && (r += ";"), r = o + " " + r), n.default.setAttribute(a, "style", r), e.Push(a);
	}, r.Id = function(e, t) {
		var r = e.GetArgument(t), a = i(e, t);
		n.default.setAttribute(a, "id", r), e.Push(a);
	};
	var i = function(e, t) {
		var r = e.ParseArg(t);
		if (!n.default.isInferred(r)) return r;
		var i = n.default.getChildren(r);
		if (i.length === 1) return i[0];
		var a = e.create("node", "mrow");
		return n.default.copyChildren(r, a), n.default.copyAttributes(r, a), a;
	};
	e.default = r;
})), he = /* @__PURE__ */ e(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.HtmlConfiguration = void 0;
	var n = o(), r = h(), i = t(me());
	new r.CommandMap("html_macros", {
		href: "Href",
		class: "Class",
		style: "Style",
		cssId: "Id"
	}, i.default), e.HtmlConfiguration = n.Configuration.create("html", { handler: { macro: ["html_macros"] } });
})), J = /* @__PURE__ */ e(((e) => {
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
	}, r = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MathtoolsUtil = void 0;
	var o = a(), s = r(u()), c = r(g()), l = r(i()), d = v(), f = n(), p = Y(), m = X();
	e.MathtoolsUtil = {
		setDisplayLevel: function(e, n) {
			if (n) {
				var r = t((0, f.lookup)(n, {
					"\\displaystyle": [!0, 0],
					"\\textstyle": [!1, 0],
					"\\scriptstyle": [!1, 1],
					"\\scriptscriptstyle": [!1, 2]
				}, [null, null]), 2), i = r[0], a = r[1];
				i !== null && (e.attributes.set("displaystyle", i), e.attributes.set("scriptlevel", a));
			}
		},
		checkAlignment: function(e, t) {
			var n = e.stack.Top();
			if (n.kind !== o.EqnArrayItem.prototype.kind) throw new l.default("NotInAlignment", "%1 can only be used in aligment environments", t);
			return n;
		},
		addPairedDelims: function(e, t, n) {
			e.handlers.retrieve(m.PAIREDDELIMS).add(t, new d.Macro(t, p.MathtoolsMethods.PairedDelimiters, n));
		},
		spreadLines: function(e, t) {
			if (e.isKind("mtable")) {
				var n = e.attributes.get("rowspacing");
				if (n) {
					var r = s.default.dimen2em(t);
					n = n.split(/ /).map(function(e) {
						return s.default.Em(Math.max(0, s.default.dimen2em(e) + r));
					}).join(" ");
				} else n = t;
				e.attributes.set("rowspacing", n);
			}
		},
		plusOrMinus: function(e, t) {
			if (t = t.trim(), !t.match(/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/)) throw new l.default("NotANumber", "Argument to %1 is not a number", e);
			return t.match(/^[-+]/) ? t : "+" + t;
		},
		getScript: function(e, t, n) {
			var r = s.default.trimSpaces(e.GetArgument(t));
			if (r === "") return e.create("node", "none");
			var i = e.options.mathtools[`prescript-${n}-format`];
			return i && (r = `${i}{${r}}`), new c.default(r, e.stack.env, e.configuration).mml();
		}
	};
})), Y = /* @__PURE__ */ e(((e) => {
	var t = e && e.__assign || function() {
		return t = Object.assign || function(e) {
			for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
			return e;
		}, t.apply(this, arguments);
	}, a = e && e.__read || function(e, t) {
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
	}, o = e && e.__values || function(e) {
		var t = typeof Symbol == "function" && Symbol.iterator, n = t && e[t], r = 0;
		if (n) return n.call(e);
		if (e && typeof e.length == "number") return { next: function() {
			return e && r >= e.length && (e = void 0), {
				value: e && e[r++],
				done: !e
			};
		} };
		throw TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
	}, s = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MathtoolsMethods = void 0;
	var c = s(u()), l = T(), d = s(_()), f = s(g()), p = s(i()), m = s(x()), h = r(), v = S(), y = n(), b = s(W()), C = s(G()), w = J();
	e.MathtoolsMethods = {
		MtMatrix: function(t, n, r, i) {
			var a = t.GetBrackets(`\\begin{${n.getName()}}`, "c");
			return e.MathtoolsMethods.Array(t, n, r, i, a);
		},
		MtSmallMatrix: function(t, n, r, i, a) {
			return a ||= t.GetBrackets(`\\begin{${n.getName()}}`, t.options.mathtools["smallmatrix-align"]), e.MathtoolsMethods.Array(t, n, r, i, a, c.default.Em(1 / 3), ".2em", "S", 1);
		},
		MtMultlined: function(e, t) {
			var n, r = `\\begin{${t.getName()}}`, i = e.GetBrackets(r, e.options.mathtools["multlined-pos"] || "c"), o = i ? e.GetBrackets(r, "") : "";
			i && !i.match(/^[cbt]$/) && (n = a([i, o], 2), o = n[0], i = n[1]), e.Push(t);
			var s = e.itemFactory.create("multlined", e, t);
			return s.arraydef = {
				displaystyle: !0,
				rowspacing: ".5em",
				width: o || "auto",
				columnwidth: "100%"
			}, c.default.setArrayAlign(s, i || "c");
		},
		HandleShove: function(e, t, n) {
			var r = e.stack.Top();
			if (r.kind !== "multline" && r.kind !== "multlined") throw new p.default("CommandInMultlined", "%1 can only appear within the multline or multlined environments", t);
			if (r.Size()) throw new p.default("CommandAtTheBeginingOfLine", "%1 must come at the beginning of the line", t);
			r.setProperty("shove", n);
			var i = e.GetBrackets(t), a = e.ParseArg(t);
			if (i) {
				var o = e.create("node", "mrow", []), s = e.create("node", "mspace", [], { width: i });
				n === "left" ? (o.appendChild(s), o.appendChild(a)) : (o.appendChild(a), o.appendChild(s)), a = o;
			}
			e.Push(a);
		},
		SpreadLines: function(e, t) {
			var n, r;
			if (e.stack.env.closing === t.getName()) {
				delete e.stack.env.closing;
				var i = e.stack.Pop(), a = i.toMml(), s = i.getProperty("spread");
				if (a.isInferred) try {
					for (var c = o(m.default.getChildren(a)), l = c.next(); !l.done; l = c.next()) {
						var u = l.value;
						w.MathtoolsUtil.spreadLines(u, s);
					}
				} catch (e) {
					n = { error: e };
				} finally {
					try {
						l && !l.done && (r = c.return) && r.call(c);
					} finally {
						if (n) throw n.error;
					}
				}
				else w.MathtoolsUtil.spreadLines(a, s);
				e.Push(a);
			} else {
				var s = e.GetDimen(`\\begin{${t.getName()}}`);
				t.setProperty("spread", s), e.Push(t);
			}
		},
		Cases: function(e, t, n, r, i) {
			var a = e.itemFactory.create("array").setProperty("casesEnv", t.getName());
			return a.arraydef = {
				rowspacing: ".2em",
				columnspacing: "1em",
				columnalign: "left"
			}, i === "D" && (a.arraydef.displaystyle = !0), a.setProperties({
				open: n,
				close: r
			}), e.Push(t), a;
		},
		MathLap: function(e, n, r, i) {
			var a = e.GetBrackets(n, "").trim(), o = e.create("node", "mstyle", [e.create("node", "mpadded", [e.ParseArg(n)], t({ width: 0 }, r === "r" ? {} : { lspace: r === "l" ? "-1width" : "-.5width" }))], { "data-cramped": i });
			w.MathtoolsUtil.setDisplayLevel(o, a), e.Push(e.create("node", "TeXAtom", [o]));
		},
		Cramped: function(e, t) {
			var n = e.GetBrackets(t, "").trim(), r = e.ParseArg(t), i = e.create("node", "mstyle", [r], { "data-cramped": !0 });
			w.MathtoolsUtil.setDisplayLevel(i, n), e.Push(i);
		},
		MtLap: function(e, t, n) {
			var r = c.default.internalMath(e, e.GetArgument(t), 0), i = e.create("node", "mpadded", r, { width: 0 });
			n !== "r" && m.default.setAttribute(i, "lspace", n === "l" ? "-1width" : "-.5width"), e.Push(i);
		},
		MathMakeBox: function(e, t) {
			var n = e.GetBrackets(t), r = e.GetBrackets(t, "c"), i = e.create("node", "mpadded", [e.ParseArg(t)]);
			n && m.default.setAttribute(i, "width", n);
			var a = (0, y.lookup)(r, {
				c: "center",
				r: "right"
			}, "");
			a && m.default.setAttribute(i, "data-align", a), e.Push(i);
		},
		MathMBox: function(e, t) {
			e.Push(e.create("node", "mrow", [e.ParseArg(t)]));
		},
		UnderOverBracket: function(e, t) {
			var n = (0, v.length2em)(e.GetBrackets(t, ".1em"), .1), r = e.GetBrackets(t, ".2em"), i = e.GetArgument(t), o = a(t.charAt(1) === "o" ? [
				"over",
				"accent",
				"bottom"
			] : [
				"under",
				"accentunder",
				"top"
			], 3), s = o[0], l = o[1], u = o[2], d = (0, v.em)(n), p = new f.default(i, e.stack.env, e.configuration).mml(), h = new f.default(i, e.stack.env, e.configuration).mml(), g = e.create("node", "mpadded", [e.create("node", "mphantom", [h])], {
				style: `border: ${d} solid; border-${u}: none`,
				height: r,
				depth: 0
			}), _ = c.default.underOver(e, p, g, s, !0), y = m.default.getChildAt(m.default.getChildAt(_, 0), 0);
			m.default.setAttribute(y, l, !0), e.Push(_);
		},
		Aboxed: function(e, t) {
			var n = w.MathtoolsUtil.checkAlignment(e, t);
			n.row.length % 2 == 1 && n.row.push(e.create("node", "mtd", []));
			var r = e.GetArgument(t), i = e.string.substr(e.i);
			e.string = r + "&&\\endAboxed", e.i = 0;
			var a = e.GetUpTo(t, "&"), o = e.GetUpTo(t, "&");
			e.GetUpTo(t, "\\endAboxed"), e.string = c.default.substituteArgs(e, [a, o], "\\rlap{\\boxed{#1{}#2}}\\kern.267em\\phantom{#1}&\\phantom{{}#2}\\kern.267em") + i, e.i = 0;
		},
		ArrowBetweenLines: function(e, t) {
			var n = w.MathtoolsUtil.checkAlignment(e, t);
			if (n.Size() || n.row.length) throw new p.default("BetweenLines", "%1 must be on a row by itself", t);
			var r = e.GetStar(), i = e.GetBrackets(t, "\\Updownarrow");
			r && (n.EndEntry(), n.EndEntry());
			var a = r ? "\\quad" + i : i + "\\quad", o = new f.default(a, e.stack.env, e.configuration).mml();
			e.Push(o), n.EndEntry(), n.EndRow();
		},
		VDotsWithin: function(e, n) {
			var r = e.stack.Top(), i = r.getProperty("flushspaceabove") === r.table.length, a = "\\mmlToken{mi}{}" + e.GetArgument(n) + "\\mmlToken{mi}{}", o = new f.default(a, e.stack.env, e.configuration).mml(), s = e.create("node", "mpadded", [e.create("node", "mpadded", [e.create("node", "mo", [e.create("text", "⋮")])], t({
				width: 0,
				lspace: "-.5width"
			}, i ? {
				height: "-.6em",
				voffset: "-.18em"
			} : {})), e.create("node", "mphantom", [o])], { lspace: ".5width" });
			e.Push(s);
		},
		ShortVDotsWithin: function(t, n) {
			var r = t.stack.Top(), i = t.GetStar();
			e.MathtoolsMethods.FlushSpaceAbove(t, "\\MTFlushSpaceAbove"), !i && r.EndEntry(), e.MathtoolsMethods.VDotsWithin(t, "\\vdotswithin"), i && r.EndEntry(), e.MathtoolsMethods.FlushSpaceBelow(t, "\\MTFlushSpaceBelow");
		},
		FlushSpaceAbove: function(e, t) {
			var n = w.MathtoolsUtil.checkAlignment(e, t);
			n.setProperty("flushspaceabove", n.table.length), n.addRowSpacing("-" + e.options.mathtools.shortvdotsadjustabove);
		},
		FlushSpaceBelow: function(e, t) {
			var n = w.MathtoolsUtil.checkAlignment(e, t);
			n.Size() && n.EndEntry(), n.EndRow(), n.addRowSpacing("-" + e.options.mathtools.shortvdotsadjustbelow);
		},
		PairedDelimiters: function(e, t, n, r, i, o, s, l) {
			i === void 0 && (i = "#1"), o === void 0 && (o = 1), s === void 0 && (s = ""), l === void 0 && (l = "");
			var u = e.GetStar(), d = u ? "" : e.GetBrackets(t), f = a(u ? ["\\left", "\\right"] : d ? [d + "l", d + "r"] : ["", ""], 2), p = f[0], m = f[1], h = u ? "\\middle" : d || "";
			if (o) {
				for (var g = [], _ = g.length; _ < o; _++) g.push(e.GetArgument(t));
				s = c.default.substituteArgs(e, g, s), i = c.default.substituteArgs(e, g, i), l = c.default.substituteArgs(e, g, l);
			}
			i = i.replace(/\\delimsize/g, h), e.string = [
				s,
				p,
				n,
				i,
				m,
				r,
				l,
				e.string.substr(e.i)
			].reduce(function(t, n) {
				return c.default.addArgs(e, t, n);
			}, ""), e.i = 0, c.default.checkMaxMacros(e);
		},
		DeclarePairedDelimiter: function(e, t) {
			var n = b.default.GetCsNameArgument(e, t), r = e.GetArgument(t), i = e.GetArgument(t);
			w.MathtoolsUtil.addPairedDelims(e.configuration, n, [r, i]);
		},
		DeclarePairedDelimiterX: function(e, t) {
			var n = b.default.GetCsNameArgument(e, t), r = b.default.GetArgCount(e, t), i = e.GetArgument(t), a = e.GetArgument(t), o = e.GetArgument(t);
			w.MathtoolsUtil.addPairedDelims(e.configuration, n, [
				i,
				a,
				o,
				r
			]);
		},
		DeclarePairedDelimiterXPP: function(e, t) {
			var n = b.default.GetCsNameArgument(e, t), r = b.default.GetArgCount(e, t), i = e.GetArgument(t), a = e.GetArgument(t), o = e.GetArgument(t), s = e.GetArgument(t), c = e.GetArgument(t);
			w.MathtoolsUtil.addPairedDelims(e.configuration, n, [
				a,
				o,
				c,
				r,
				i,
				s
			]);
		},
		CenterColon: function(e, n, r, i, a) {
			i === void 0 && (i = !1), a === void 0 && (a = !1);
			var o = e.options.mathtools, s = e.create("token", "mo", {}, ":");
			if (r && (o.centercolon || i)) {
				var c = o["centercolon-offset"];
				s = e.create("node", "mpadded", [s], t({
					voffset: c,
					height: `+${c}`,
					depth: `-${c}`
				}, a ? {
					width: o["thincolon-dw"],
					lspace: o["thincolon-dx"]
				} : {}));
			}
			e.Push(s);
		},
		Relation: function(e, t, n, r) {
			e.options.mathtools["use-unicode"] && r ? e.Push(e.create("token", "mo", { texClass: h.TEXCLASS.REL }, r)) : (n = "\\mathrel{" + n.replace(/:/g, "\\MTThinColon").replace(/-/g, "\\mathrel{-}") + "}", e.string = c.default.addArgs(e, n, e.string.substr(e.i)), e.i = 0);
		},
		NArrow: function(e, t, n, r) {
			e.Push(e.create("node", "TeXAtom", [e.create("token", "mtext", {}, n), e.create("node", "mpadded", [e.create("node", "mpadded", [e.create("node", "menclose", [e.create("node", "mspace", [], {
				height: ".2em",
				depth: 0,
				width: ".4em"
			})], {
				notation: "updiagonalstrike",
				"data-thickness": ".05em",
				"data-padding": 0
			})], {
				width: 0,
				lspace: "-.5width",
				voffset: r
			}), e.create("node", "mphantom", [e.create("token", "mtext", {}, n)])], {
				width: 0,
				lspace: "-.5width"
			})], { texClass: h.TEXCLASS.REL }));
		},
		SplitFrac: function(e, t, n) {
			var r = e.ParseArg(t), i = e.ParseArg(t);
			e.Push(e.create("node", "mstyle", [e.create("node", "mfrac", [e.create("node", "mstyle", [
				r,
				e.create("token", "mi"),
				e.create("token", "mspace", { width: "1em" })
			], { scriptlevel: 0 }), e.create("node", "mstyle", [
				e.create("token", "mspace", { width: "1em" }),
				e.create("token", "mi"),
				i
			], { scriptlevel: 0 })], {
				linethickness: 0,
				numalign: "left",
				denomalign: "right"
			})], {
				displaystyle: n,
				scriptlevel: 0
			}));
		},
		XMathStrut: function(e, t) {
			var n = e.GetBrackets(t), r = e.GetArgument(t);
			r = w.MathtoolsUtil.plusOrMinus(t, r), n = w.MathtoolsUtil.plusOrMinus(t, n || r), e.Push(e.create("node", "TeXAtom", [e.create("node", "mpadded", [e.create("node", "mphantom", [e.create("token", "mo", { stretchy: !1 }, "(")])], {
				width: 0,
				height: r + "height",
				depth: n + "depth"
			})], { texClass: h.TEXCLASS.ORD }));
		},
		Prescript: function(e, t) {
			var n = w.MathtoolsUtil.getScript(e, t, "sup"), r = w.MathtoolsUtil.getScript(e, t, "sub"), i = w.MathtoolsUtil.getScript(e, t, "arg");
			if (m.default.isType(n, "none") && m.default.isType(r, "none")) {
				e.Push(i);
				return;
			}
			var a = e.create("node", "mmultiscripts", [i]);
			m.default.getChildren(a).push(null, null), m.default.appendChildren(a, [
				e.create("node", "mprescripts"),
				r,
				n
			]), a.setProperty("fixPrescript", !0), e.Push(a);
		},
		NewTagForm: function(e, t, n) {
			n === void 0 && (n = !1);
			var r = e.tags;
			if (!("mtFormats" in r)) throw new p.default("TagsNotMT", "%1 can only be used with ams or mathtools tags", t);
			var i = e.GetArgument(t).trim();
			if (!i) throw new p.default("InvalidTagFormID", "Tag form name can't be empty");
			var a = e.GetBrackets(t, ""), o = e.GetArgument(t), s = e.GetArgument(t);
			if (!n && r.mtFormats.has(i)) throw new p.default("DuplicateTagForm", "Duplicate tag form: %1", i);
			r.mtFormats.set(i, [
				o,
				s,
				a
			]);
		},
		UseTagForm: function(e, t) {
			var n = e.tags;
			if (!("mtFormats" in n)) throw new p.default("TagsNotMT", "%1 can only be used with ams or mathtools tags", t);
			var r = e.GetArgument(t).trim();
			if (!r) {
				n.mtCurrent = null;
				return;
			}
			if (!n.mtFormats.has(r)) throw new p.default("UndefinedTagForm", "Undefined tag form: %1", r);
			n.mtCurrent = n.mtFormats.get(r);
		},
		SetOptions: function(e, t) {
			var n, r, i = e.options.mathtools;
			if (!i["allow-mathtoolsset"]) throw new p.default("ForbiddenMathtoolsSet", "%1 is disabled", t);
			var a = {};
			Object.keys(i).forEach(function(e) {
				e !== "pariedDelimiters" && e !== "tagforms" && e !== "allow-mathtoolsset" && (a[e] = 1);
			});
			var s = e.GetArgument(t), l = c.default.keyvalOptions(s, a, !0);
			try {
				for (var u = o(Object.keys(l)), d = u.next(); !d.done; d = u.next()) {
					var f = d.value;
					i[f] = l[f];
				}
			} catch (e) {
				n = { error: e };
			} finally {
				try {
					d && !d.done && (r = u.return) && r.call(u);
				} finally {
					if (n) throw n.error;
				}
			}
		},
		Array: d.default.Array,
		Macro: d.default.Macro,
		xArrow: l.AmsMethods.xArrow,
		HandleRef: l.AmsMethods.HandleRef,
		AmsEqnArray: l.AmsMethods.AmsEqnArray,
		MacroWithTemplate: C.default.MacroWithTemplate
	};
})), ge = /* @__PURE__ */ e(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 });
	var n = t(m()), r = h(), i = d(), a = Y();
	new r.CommandMap("mathtools-macros", {
		shoveleft: ["HandleShove", i.TexConstant.Align.LEFT],
		shoveright: ["HandleShove", i.TexConstant.Align.RIGHT],
		xleftrightarrow: [
			"xArrow",
			8596,
			10,
			10
		],
		xLeftarrow: [
			"xArrow",
			8656,
			12,
			7
		],
		xRightarrow: [
			"xArrow",
			8658,
			7,
			12
		],
		xLeftrightarrow: [
			"xArrow",
			8660,
			12,
			12
		],
		xhookleftarrow: [
			"xArrow",
			8617,
			10,
			5
		],
		xhookrightarrow: [
			"xArrow",
			8618,
			5,
			10
		],
		xmapsto: [
			"xArrow",
			8614,
			10,
			10
		],
		xrightharpoondown: [
			"xArrow",
			8641,
			5,
			10
		],
		xleftharpoondown: [
			"xArrow",
			8637,
			10,
			5
		],
		xrightleftharpoons: [
			"xArrow",
			8652,
			10,
			10
		],
		xrightharpoonup: [
			"xArrow",
			8640,
			5,
			10
		],
		xleftharpoonup: [
			"xArrow",
			8636,
			10,
			5
		],
		xleftrightharpoons: [
			"xArrow",
			8651,
			10,
			10
		],
		mathllap: [
			"MathLap",
			"l",
			!1
		],
		mathrlap: [
			"MathLap",
			"r",
			!1
		],
		mathclap: [
			"MathLap",
			"c",
			!1
		],
		clap: ["MtLap", "c"],
		textllap: ["MtLap", "l"],
		textrlap: ["MtLap", "r"],
		textclap: ["MtLap", "c"],
		cramped: "Cramped",
		crampedllap: [
			"MathLap",
			"l",
			!0
		],
		crampedrlap: [
			"MathLap",
			"r",
			!0
		],
		crampedclap: [
			"MathLap",
			"c",
			!0
		],
		crampedsubstack: [
			"Macro",
			"\\begin{crampedsubarray}{c}#1\\end{crampedsubarray}",
			1
		],
		mathmbox: "MathMBox",
		mathmakebox: "MathMakeBox",
		overbracket: "UnderOverBracket",
		underbracket: "UnderOverBracket",
		refeq: "HandleRef",
		MoveEqLeft: [
			"Macro",
			"\\hspace{#1em}&\\hspace{-#1em}",
			1,
			"2"
		],
		Aboxed: "Aboxed",
		ArrowBetweenLines: "ArrowBetweenLines",
		vdotswithin: "VDotsWithin",
		shortvdotswithin: "ShortVDotsWithin",
		MTFlushSpaceAbove: "FlushSpaceAbove",
		MTFlushSpaceBelow: "FlushSpaceBelow",
		DeclarePairedDelimiter: "DeclarePairedDelimiter",
		DeclarePairedDelimiterX: "DeclarePairedDelimiterX",
		DeclarePairedDelimiterXPP: "DeclarePairedDelimiterXPP",
		DeclarePairedDelimiters: "DeclarePairedDelimiter",
		DeclarePairedDelimitersX: "DeclarePairedDelimiterX",
		DeclarePairedDelimitersXPP: "DeclarePairedDelimiterXPP",
		centercolon: [
			"CenterColon",
			!0,
			!0
		],
		ordinarycolon: ["CenterColon", !1],
		MTThinColon: [
			"CenterColon",
			!0,
			!0,
			!0
		],
		coloneqq: [
			"Relation",
			":=",
			"≔"
		],
		Coloneqq: [
			"Relation",
			"::=",
			"⩴"
		],
		coloneq: ["Relation", ":-"],
		Coloneq: ["Relation", "::-"],
		eqqcolon: [
			"Relation",
			"=:",
			"≕"
		],
		Eqqcolon: ["Relation", "=::"],
		eqcolon: [
			"Relation",
			"-:",
			"∹"
		],
		Eqcolon: ["Relation", "-::"],
		colonapprox: ["Relation", ":\\approx"],
		Colonapprox: ["Relation", "::\\approx"],
		colonsim: ["Relation", ":\\sim"],
		Colonsim: ["Relation", "::\\sim"],
		dblcolon: [
			"Relation",
			"::",
			"∷"
		],
		nuparrow: [
			"NArrow",
			"↑",
			".06em"
		],
		ndownarrow: [
			"NArrow",
			"↓",
			".25em"
		],
		bigtimes: ["Macro", "\\mathop{\\Large\\kern-.1em\\boldsymbol{\\times}\\kern-.1em}"],
		splitfrac: ["SplitFrac", !1],
		splitdfrac: ["SplitFrac", !0],
		xmathstrut: "XMathStrut",
		prescript: "Prescript",
		newtagform: ["NewTagForm", !1],
		renewtagform: ["NewTagForm", !0],
		usetagform: "UseTagForm",
		adjustlimits: [
			"MacroWithTemplate",
			"\\mathop{{#1}\\vphantom{{#3}}}_{{#2}\\vphantom{{#4}}}\\mathop{{#3}\\vphantom{{#1}}}_{{#4}\\vphantom{{#2}}}",
			4,
			,
			"_",
			,
			"_"
		],
		mathtoolsset: "SetOptions"
	}, a.MathtoolsMethods), new r.EnvironmentMap("mathtools-environments", n.default.environment, {
		dcases: [
			"Array",
			null,
			"\\{",
			"",
			"ll",
			null,
			".2em",
			"D"
		],
		rcases: [
			"Array",
			null,
			"",
			"\\}",
			"ll",
			null,
			".2em"
		],
		drcases: [
			"Array",
			null,
			"",
			"\\}",
			"ll",
			null,
			".2em",
			"D"
		],
		"dcases*": [
			"Cases",
			null,
			"{",
			"",
			"D"
		],
		"rcases*": [
			"Cases",
			null,
			"",
			"}"
		],
		"drcases*": [
			"Cases",
			null,
			"",
			"}",
			"D"
		],
		"cases*": [
			"Cases",
			null,
			"{",
			""
		],
		"matrix*": [
			"MtMatrix",
			null,
			null,
			null
		],
		"pmatrix*": [
			"MtMatrix",
			null,
			"(",
			")"
		],
		"bmatrix*": [
			"MtMatrix",
			null,
			"[",
			"]"
		],
		"Bmatrix*": [
			"MtMatrix",
			null,
			"\\{",
			"\\}"
		],
		"vmatrix*": [
			"MtMatrix",
			null,
			"\\vert",
			"\\vert"
		],
		"Vmatrix*": [
			"MtMatrix",
			null,
			"\\Vert",
			"\\Vert"
		],
		"smallmatrix*": [
			"MtSmallMatrix",
			null,
			null,
			null
		],
		psmallmatrix: [
			"MtSmallMatrix",
			null,
			"(",
			")",
			"c"
		],
		"psmallmatrix*": [
			"MtSmallMatrix",
			null,
			"(",
			")"
		],
		bsmallmatrix: [
			"MtSmallMatrix",
			null,
			"[",
			"]",
			"c"
		],
		"bsmallmatrix*": [
			"MtSmallMatrix",
			null,
			"[",
			"]"
		],
		Bsmallmatrix: [
			"MtSmallMatrix",
			null,
			"\\{",
			"\\}",
			"c"
		],
		"Bsmallmatrix*": [
			"MtSmallMatrix",
			null,
			"\\{",
			"\\}"
		],
		vsmallmatrix: [
			"MtSmallMatrix",
			null,
			"\\vert",
			"\\vert",
			"c"
		],
		"vsmallmatrix*": [
			"MtSmallMatrix",
			null,
			"\\vert",
			"\\vert"
		],
		Vsmallmatrix: [
			"MtSmallMatrix",
			null,
			"\\Vert",
			"\\Vert",
			"c"
		],
		"Vsmallmatrix*": [
			"MtSmallMatrix",
			null,
			"\\Vert",
			"\\Vert"
		],
		crampedsubarray: [
			"Array",
			null,
			null,
			null,
			null,
			"0em",
			"0.1em",
			"S'",
			1
		],
		multlined: "MtMultlined",
		spreadlines: ["SpreadLines", !0],
		lgathered: [
			"AmsEqnArray",
			null,
			null,
			null,
			"l",
			null,
			".5em",
			"D"
		],
		rgathered: [
			"AmsEqnArray",
			null,
			null,
			null,
			"r",
			null,
			".5em",
			"D"
		]
	}, a.MathtoolsMethods), new r.DelimiterMap("mathtools-delimiters", n.default.delimiter, {
		"\\lparen": "(",
		"\\rparen": ")"
	}), new r.CommandMap("mathtools-characters", { ":": ["CenterColon", !0] }, a.MathtoolsMethods);
})), _e = /* @__PURE__ */ e(((e) => {
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
	}, r = e && e.__read || function(e, t) {
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
	}, a = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MathtoolsTagFormat = void 0;
	var o = a(i()), s = f(), c = 0;
	function l(e, i) {
		var a = i.parseOptions.options.tags;
		a !== "base" && e.tags.hasOwnProperty(a) && s.TagsFactory.add(a, e.tags[a]);
		var l = function(e) {
			t(a, e);
			function a() {
				var t, r, a = e.call(this) || this;
				a.mtFormats = /* @__PURE__ */ new Map(), a.mtCurrent = null;
				var s = i.parseOptions.options.mathtools.tagforms;
				try {
					for (var c = n(Object.keys(s)), l = c.next(); !l.done; l = c.next()) {
						var u = l.value;
						if (!Array.isArray(s[u]) || s[u].length !== 3) throw new o.default("InvalidTagFormDef", "The tag form definition for \"%1\" should be an array fo three strings", u);
						a.mtFormats.set(u, s[u]);
					}
				} catch (e) {
					t = { error: e };
				} finally {
					try {
						l && !l.done && (r = c.return) && r.call(c);
					} finally {
						if (t) throw t.error;
					}
				}
				return a;
			}
			return a.prototype.formatTag = function(t) {
				if (this.mtCurrent) {
					var n = r(this.mtCurrent, 3), i = n[0], a = n[1], o = n[2];
					return o ? `${i}${o}{${t}}${a}` : `${i}${t}${a}`;
				}
				return e.prototype.formatTag.call(this, t);
			}, a;
		}(s.TagsFactory.create(i.parseOptions.options.tags).constructor);
		c++;
		var u = "MathtoolsTags-" + c;
		s.TagsFactory.add(u, l), i.parseOptions.options.tags = u;
	}
	e.MathtoolsTagFormat = l;
})), ve = /* @__PURE__ */ e(((e) => {
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
	})(), n = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MultlinedItem = void 0;
	var r = w(), i = n(x()), a = d();
	e.MultlinedItem = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "multlined";
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.EndTable = function() {
			if ((this.Size() || this.row.length) && (this.EndEntry(), this.EndRow()), this.table.length > 1) {
				var t = this.factory.configuration.options.mathtools, n = t.multlinegap, r = t["firstline-afterskip"] || n, o = t["lastline-preskip"] || n, s = i.default.getChildren(this.table[0])[0];
				i.default.getAttribute(s, "columnalign") !== a.TexConstant.Align.RIGHT && s.appendChild(this.create("node", "mspace", [], { width: r }));
				var c = i.default.getChildren(this.table[this.table.length - 1])[0];
				if (i.default.getAttribute(c, "columnalign") !== a.TexConstant.Align.LEFT) {
					var l = i.default.getChildren(c)[0];
					l.childNodes.unshift(null);
					var u = this.create("node", "mspace", [], { width: o });
					i.default.setChild(l, 0, u);
				}
			}
			e.prototype.EndTable.call(this);
		}, n;
	}(r.MultlineItem);
})), X = /* @__PURE__ */ e(((e) => {
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
	}, r = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	}, i;
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MathtoolsConfiguration = e.fixPrescripts = e.PAIREDDELIMS = void 0;
	var a = o(), s = h(), c = r(x()), l = n();
	ge();
	var u = J(), d = _e(), f = ve();
	e.PAIREDDELIMS = "mathtools-paired-delims";
	function p(t) {
		new s.CommandMap(e.PAIREDDELIMS, {}, {}), t.append(a.Configuration.local({
			handler: { macro: [e.PAIREDDELIMS] },
			priority: -5
		}));
	}
	function m(e, n) {
		var r, i, a = n.parseOptions, o = a.options.mathtools.pairedDelimiters;
		try {
			for (var s = t(Object.keys(o)), c = s.next(); !c.done; c = s.next()) {
				var l = c.value;
				u.MathtoolsUtil.addPairedDelims(a, l, o[l]);
			}
		} catch (e) {
			r = { error: e };
		} finally {
			try {
				c && !c.done && (i = s.return) && i.call(s);
			} finally {
				if (r) throw r.error;
			}
		}
		(0, d.MathtoolsTagFormat)(e, n);
	}
	function g(e) {
		var n, r, i, a, o, s, l = e.data;
		try {
			for (var u = t(l.getList("mmultiscripts")), d = u.next(); !d.done; d = u.next()) {
				var f = d.value;
				if (f.getProperty("fixPrescript")) {
					var p = c.default.getChildren(f), m = 0;
					try {
						for (var h = (i = void 0, t([1, 2])), g = h.next(); !g.done; g = h.next()) {
							var _ = g.value;
							p[_] || (c.default.setChild(f, _, l.nodeFactory.create("node", "none")), m++);
						}
					} catch (e) {
						i = { error: e };
					} finally {
						try {
							g && !g.done && (a = h.return) && a.call(h);
						} finally {
							if (i) throw i.error;
						}
					}
					try {
						for (var v = (o = void 0, t([4, 5])), y = v.next(); !y.done; y = v.next()) {
							var _ = y.value;
							c.default.isType(p[_], "mrow") && c.default.getChildren(p[_]).length === 0 && c.default.setChild(f, _, l.nodeFactory.create("node", "none"));
						}
					} catch (e) {
						o = { error: e };
					} finally {
						try {
							y && !y.done && (s = v.return) && s.call(v);
						} finally {
							if (o) throw o.error;
						}
					}
					m === 2 && p.splice(1, 2);
				}
			}
		} catch (e) {
			n = { error: e };
		} finally {
			try {
				d && !d.done && (r = u.return) && r.call(u);
			} finally {
				if (n) throw n.error;
			}
		}
	}
	e.fixPrescripts = g, e.MathtoolsConfiguration = a.Configuration.create("mathtools", {
		handler: {
			macro: ["mathtools-macros", "mathtools-delimiters"],
			environment: ["mathtools-environments"],
			delimiter: ["mathtools-delimiters"],
			character: ["mathtools-characters"]
		},
		items: (i = {}, i[f.MultlinedItem.prototype.kind] = f.MultlinedItem, i),
		init: p,
		config: m,
		postprocessors: [[g, -6]],
		options: { mathtools: {
			multlinegap: "1em",
			"multlined-pos": "c",
			"firstline-afterskip": "",
			"lastline-preskip": "",
			"smallmatrix-align": "c",
			shortvdotsadjustabove: ".2em",
			shortvdotsadjustbelow: ".2em",
			centercolon: !1,
			"centercolon-offset": ".04em",
			"thincolon-dx": "-.04em",
			"thincolon-dw": "-.08em",
			"use-unicode": !1,
			"prescript-sub-format": "",
			"prescript-sup-format": "",
			"prescript-arg-format": "",
			"allow-mathtoolsset": !0,
			pairedDelimiters: (0, l.expandable)({}),
			tagforms: (0, l.expandable)({})
		} }
	});
})), ye = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.mhchemParser = void 0, e.mhchemParser = function() {
		function e() {}
		return e.toTex = function(e, t) {
			return r.go(n.go(e, t), t !== "tex");
		}, e;
	}();
	function t(e) {
		var t, n, r = {};
		for (t in e) for (n in e[t]) {
			var i = n.split("|");
			e[t][n].stateArray = i;
			for (var a = 0; a < i.length; a++) r[i[a]] = [];
		}
		for (t in e) for (n in e[t]) for (var i = e[t][n].stateArray || [], a = 0; a < i.length; a++) {
			var o = e[t][n];
			o.action_ = [].concat(o.action_);
			for (var s = 0; s < o.action_.length; s++) typeof o.action_[s] == "string" && (o.action_[s] = { type_: o.action_[s] });
			for (var c = t.split("|"), l = 0; l < c.length; l++) if (i[a] === "*") {
				var u = void 0;
				for (u in r) r[u].push({
					pattern: c[l],
					task: o
				});
			} else r[i[a]].push({
				pattern: c[l],
				task: o
			});
		}
		return r;
	}
	var n = {
		go: function(e, t) {
			if (!e) return [];
			t === void 0 && (t = "ce");
			var r = "0", i = {};
			i.parenthesisLevel = 0, e = e.replace(/\n/g, " "), e = e.replace(/[\u2212\u2013\u2014\u2010]/g, "-"), e = e.replace(/[\u2026]/g, "...");
			for (var a, o = 10, s = [];;) {
				a === e ? o-- : (o = 10, a = e);
				var c = n.stateMachines[t], l = c.transitions[r] || c.transitions["*"];
				iterateTransitions: for (var u = 0; u < l.length; u++) {
					var d = n.patterns.match_(l[u].pattern, e);
					if (d) {
						for (var f = l[u].task, p = 0; p < f.action_.length; p++) {
							var m = void 0;
							if (c.actions[f.action_[p].type_]) m = c.actions[f.action_[p].type_](i, d.match_, f.action_[p].option);
							else if (n.actions[f.action_[p].type_]) m = n.actions[f.action_[p].type_](i, d.match_, f.action_[p].option);
							else throw ["MhchemBugA", "mhchem bug A. Please report. (" + f.action_[p].type_ + ")"];
							n.concatArray(s, m);
						}
						if (r = f.nextState || r, e.length > 0) {
							if (f.revisit || (e = d.remainder), !f.toContinue) break iterateTransitions;
						} else return s;
					}
				}
				if (o <= 0) throw ["MhchemBugU", "mhchem bug U. Please report."];
			}
		},
		concatArray: function(e, t) {
			if (t) if (Array.isArray(t)) for (var n = 0; n < t.length; n++) e.push(t[n]);
			else e.push(t);
		},
		patterns: {
			patterns: {
				empty: /^$/,
				else: /^./,
				else2: /^./,
				space: /^\s/,
				"space A": /^\s(?=[A-Z\\$])/,
				space$: /^\s$/,
				"a-z": /^[a-z]/,
				x: /^x/,
				x$: /^x$/,
				i$: /^i$/,
				letters: /^(?:[a-zA-Z\u03B1-\u03C9\u0391-\u03A9?@]|(?:\\(?:alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega|Gamma|Delta|Theta|Lambda|Xi|Pi|Sigma|Upsilon|Phi|Psi|Omega)(?:\s+|\{\}|(?![a-zA-Z]))))+/,
				"\\greek": /^\\(?:alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega|Gamma|Delta|Theta|Lambda|Xi|Pi|Sigma|Upsilon|Phi|Psi|Omega)(?:\s+|\{\}|(?![a-zA-Z]))/,
				"one lowercase latin letter $": /^(?:([a-z])(?:$|[^a-zA-Z]))$/,
				"$one lowercase latin letter$ $": /^\$(?:([a-z])(?:$|[^a-zA-Z]))\$$/,
				"one lowercase greek letter $": /^(?:\$?[\u03B1-\u03C9]\$?|\$?\\(?:alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega)\s*\$?)(?:\s+|\{\}|(?![a-zA-Z]))$/,
				digits: /^[0-9]+/,
				"-9.,9": /^[+\-]?(?:[0-9]+(?:[,.][0-9]+)?|[0-9]*(?:\.[0-9]+))/,
				"-9.,9 no missing 0": /^[+\-]?[0-9]+(?:[.,][0-9]+)?/,
				"(-)(9.,9)(e)(99)": function(e) {
					var t = e.match(/^(\+\-|\+\/\-|\+|\-|\\pm\s?)?([0-9]+(?:[,.][0-9]+)?|[0-9]*(?:\.[0-9]+))?(\((?:[0-9]+(?:[,.][0-9]+)?|[0-9]*(?:\.[0-9]+))\))?(?:(?:([eE])|\s*(\*|x|\\times|\u00D7)\s*10\^)([+\-]?[0-9]+|\{[+\-]?[0-9]+\}))?/);
					return t && t[0] ? {
						match_: t.slice(1),
						remainder: e.substr(t[0].length)
					} : null;
				},
				"(-)(9)^(-9)": /^(\+\-|\+\/\-|\+|\-|\\pm\s?)?([0-9]+(?:[,.][0-9]+)?|[0-9]*(?:\.[0-9]+)?)\^([+\-]?[0-9]+|\{[+\-]?[0-9]+\})/,
				"state of aggregation $": function(e) {
					var t = n.patterns.findObserveGroups(e, "", /^\([a-z]{1,3}(?=[\),])/, ")", "");
					if (t && t.remainder.match(/^($|[\s,;\)\]\}])/)) return t;
					var r = e.match(/^(?:\((?:\\ca\s?)?\$[amothc]\$\))/);
					return r ? {
						match_: r[0],
						remainder: e.substr(r[0].length)
					} : null;
				},
				"_{(state of aggregation)}$": /^_\{(\([a-z]{1,3}\))\}/,
				"{[(": /^(?:\\\{|\[|\()/,
				")]}": /^(?:\)|\]|\\\})/,
				", ": /^[,;]\s*/,
				",": /^[,;]/,
				".": /^[.]/,
				". __* ": /^([.\u22C5\u00B7\u2022]|[*])\s*/,
				"...": /^\.\.\.(?=$|[^.])/,
				"^{(...)}": function(e) {
					return n.patterns.findObserveGroups(e, "^{", "", "", "}");
				},
				"^($...$)": function(e) {
					return n.patterns.findObserveGroups(e, "^", "$", "$", "");
				},
				"^a": /^\^([0-9]+|[^\\_])/,
				"^\\x{}{}": function(e) {
					return n.patterns.findObserveGroups(e, "^", /^\\[a-zA-Z]+\{/, "}", "", "", "{", "}", "", !0);
				},
				"^\\x{}": function(e) {
					return n.patterns.findObserveGroups(e, "^", /^\\[a-zA-Z]+\{/, "}", "");
				},
				"^\\x": /^\^(\\[a-zA-Z]+)\s*/,
				"^(-1)": /^\^(-?\d+)/,
				"'": /^'/,
				"_{(...)}": function(e) {
					return n.patterns.findObserveGroups(e, "_{", "", "", "}");
				},
				"_($...$)": function(e) {
					return n.patterns.findObserveGroups(e, "_", "$", "$", "");
				},
				_9: /^_([+\-]?[0-9]+|[^\\])/,
				"_\\x{}{}": function(e) {
					return n.patterns.findObserveGroups(e, "_", /^\\[a-zA-Z]+\{/, "}", "", "", "{", "}", "", !0);
				},
				"_\\x{}": function(e) {
					return n.patterns.findObserveGroups(e, "_", /^\\[a-zA-Z]+\{/, "}", "");
				},
				"_\\x": /^_(\\[a-zA-Z]+)\s*/,
				"^_": /^(?:\^(?=_)|\_(?=\^)|[\^_]$)/,
				"{}^": /^\{\}(?=\^)/,
				"{}": /^\{\}/,
				"{...}": function(e) {
					return n.patterns.findObserveGroups(e, "", "{", "}", "");
				},
				"{(...)}": function(e) {
					return n.patterns.findObserveGroups(e, "{", "", "", "}");
				},
				"$...$": function(e) {
					return n.patterns.findObserveGroups(e, "", "$", "$", "");
				},
				"${(...)}$__$(...)$": function(e) {
					return n.patterns.findObserveGroups(e, "${", "", "", "}$") || n.patterns.findObserveGroups(e, "$", "", "", "$");
				},
				"=<>": /^[=<>]/,
				"#": /^[#\u2261]/,
				"+": /^\+/,
				"-$": /^-(?=[\s_},;\]/]|$|\([a-z]+\))/,
				"-9": /^-(?=[0-9])/,
				"- orbital overlap": /^-(?=(?:[spd]|sp)(?:$|[\s,;\)\]\}]))/,
				"-": /^-/,
				"pm-operator": /^(?:\\pm|\$\\pm\$|\+-|\+\/-)/,
				operator: /^(?:\+|(?:[\-=<>]|<<|>>|\\approx|\$\\approx\$)(?=\s|$|-?[0-9]))/,
				arrowUpDown: /^(?:v|\(v\)|\^|\(\^\))(?=$|[\s,;\)\]\}])/,
				"\\bond{(...)}": function(e) {
					return n.patterns.findObserveGroups(e, "\\bond{", "", "", "}");
				},
				"->": /^(?:<->|<-->|->|<-|<=>>|<<=>|<=>|[\u2192\u27F6\u21CC])/,
				CMT: /^[CMT](?=\[)/,
				"[(...)]": function(e) {
					return n.patterns.findObserveGroups(e, "[", "", "", "]");
				},
				"1st-level escape": /^(&|\\\\|\\hline)\s*/,
				"\\,": /^(?:\\[,\ ;:])/,
				"\\x{}{}": function(e) {
					return n.patterns.findObserveGroups(e, "", /^\\[a-zA-Z]+\{/, "}", "", "", "{", "}", "", !0);
				},
				"\\x{}": function(e) {
					return n.patterns.findObserveGroups(e, "", /^\\[a-zA-Z]+\{/, "}", "");
				},
				"\\ca": /^\\ca(?:\s+|(?![a-zA-Z]))/,
				"\\x": /^(?:\\[a-zA-Z]+\s*|\\[_&{}%])/,
				orbital: /^(?:[0-9]{1,2}[spdfgh]|[0-9]{0,2}sp)(?=$|[^a-zA-Z])/,
				others: /^[\/~|]/,
				"\\frac{(...)}": function(e) {
					return n.patterns.findObserveGroups(e, "\\frac{", "", "", "}", "{", "", "", "}");
				},
				"\\overset{(...)}": function(e) {
					return n.patterns.findObserveGroups(e, "\\overset{", "", "", "}", "{", "", "", "}");
				},
				"\\underset{(...)}": function(e) {
					return n.patterns.findObserveGroups(e, "\\underset{", "", "", "}", "{", "", "", "}");
				},
				"\\underbrace{(...)}": function(e) {
					return n.patterns.findObserveGroups(e, "\\underbrace{", "", "", "}_", "{", "", "", "}");
				},
				"\\color{(...)}": function(e) {
					return n.patterns.findObserveGroups(e, "\\color{", "", "", "}");
				},
				"\\color{(...)}{(...)}": function(e) {
					return n.patterns.findObserveGroups(e, "\\color{", "", "", "}", "{", "", "", "}") || n.patterns.findObserveGroups(e, "\\color", "\\", "", /^(?=\{)/, "{", "", "", "}");
				},
				"\\ce{(...)}": function(e) {
					return n.patterns.findObserveGroups(e, "\\ce{", "", "", "}");
				},
				"\\pu{(...)}": function(e) {
					return n.patterns.findObserveGroups(e, "\\pu{", "", "", "}");
				},
				oxidation$: /^(?:[+-][IVX]+|(?:\\pm|\$\\pm\$|\+-|\+\/-)\s*0)$/,
				"d-oxidation$": /^(?:[+-]?[IVX]+|(?:\\pm|\$\\pm\$|\+-|\+\/-)\s*0)$/,
				"1/2$": /^[+\-]?(?:[0-9]+|\$[a-z]\$|[a-z])\/[0-9]+(?:\$[a-z]\$|[a-z])?$/,
				amount: function(e) {
					var t = e.match(/^(?:(?:(?:\([+\-]?[0-9]+\/[0-9]+\)|[+\-]?(?:[0-9]+|\$[a-z]\$|[a-z])\/[0-9]+|[+\-]?[0-9]+[.,][0-9]+|[+\-]?\.[0-9]+|[+\-]?[0-9]+)(?:[a-z](?=\s*[A-Z]))?)|[+\-]?[a-z](?=\s*[A-Z])|\+(?!\s))/);
					if (t) return {
						match_: t[0],
						remainder: e.substr(t[0].length)
					};
					var r = n.patterns.findObserveGroups(e, "", "$", "$", "");
					return r && (t = r.match_.match(/^\$(?:\(?[+\-]?(?:[0-9]*[a-z]?[+\-])?[0-9]*[a-z](?:[+\-][0-9]*[a-z]?)?\)?|\+|-)\$$/), t) ? {
						match_: t[0],
						remainder: e.substr(t[0].length)
					} : null;
				},
				amount2: function(e) {
					return this.amount(e);
				},
				"(KV letters),": /^(?:[A-Z][a-z]{0,2}|i)(?=,)/,
				formula$: function(e) {
					if (e.match(/^\([a-z]+\)$/)) return null;
					var t = e.match(/^(?:[a-z]|(?:[0-9\ \+\-\,\.\(\)]+[a-z])+[0-9\ \+\-\,\.\(\)]*|(?:[a-z][0-9\ \+\-\,\.\(\)]+)+[a-z]?)$/);
					return t ? {
						match_: t[0],
						remainder: e.substr(t[0].length)
					} : null;
				},
				uprightEntities: /^(?:pH|pOH|pC|pK|iPr|iBu)(?=$|[^a-zA-Z])/,
				"/": /^\s*(\/)\s*/,
				"//": /^\s*(\/\/)\s*/,
				"*": /^\s*[*.]\s*/
			},
			findObserveGroups: function(e, t, n, r, i, a, o, s, c, l) {
				var u = function(e, t) {
					if (typeof t == "string") return e.indexOf(t) === 0 ? t : null;
					var n = e.match(t);
					return n ? n[0] : null;
				}, d = function(e, t, n) {
					for (var r = 0; t < e.length;) {
						var i = e.charAt(t), a = u(e.substr(t), n);
						if (a !== null && r === 0) return {
							endMatchBegin: t,
							endMatchEnd: t + a.length
						};
						if (i === "{") r++;
						else if (i === "}") {
							if (r === 0) throw ["ExtraCloseMissingOpen", "Extra close brace or missing open brace"];
							r--;
						}
						t++;
					}
					return null;
				}, f = u(e, t);
				if (f === null || (e = e.substr(f.length), f = u(e, n), f === null)) return null;
				var p = d(e, f.length, r || i);
				if (p === null) return null;
				var m = e.substring(0, r ? p.endMatchEnd : p.endMatchBegin);
				if (a || o) {
					var h = this.findObserveGroups(e.substr(p.endMatchEnd), a, o, s, c);
					if (h === null) return null;
					var g = [m, h.match_];
					return {
						match_: l ? g.join("") : g,
						remainder: h.remainder
					};
				} else return {
					match_: m,
					remainder: e.substr(p.endMatchEnd)
				};
			},
			match_: function(e, t) {
				var r = n.patterns.patterns[e];
				if (r === void 0) throw ["MhchemBugP", "mhchem bug P. Please report. (" + e + ")"];
				if (typeof r == "function") return n.patterns.patterns[e](t);
				var i = t.match(r);
				return i ? i.length > 2 ? {
					match_: i.slice(1),
					remainder: t.substr(i[0].length)
				} : {
					match_: i[1] || i[0],
					remainder: t.substr(i[0].length)
				} : null;
			}
		},
		actions: {
			"a=": function(e, t) {
				e.a = (e.a || "") + t;
			},
			"b=": function(e, t) {
				e.b = (e.b || "") + t;
			},
			"p=": function(e, t) {
				e.p = (e.p || "") + t;
			},
			"o=": function(e, t) {
				e.o = (e.o || "") + t;
			},
			"o=+p1": function(e, t, n) {
				e.o = (e.o || "") + n;
			},
			"q=": function(e, t) {
				e.q = (e.q || "") + t;
			},
			"d=": function(e, t) {
				e.d = (e.d || "") + t;
			},
			"rm=": function(e, t) {
				e.rm = (e.rm || "") + t;
			},
			"text=": function(e, t) {
				e.text_ = (e.text_ || "") + t;
			},
			insert: function(e, t, n) {
				return { type_: n };
			},
			"insert+p1": function(e, t, n) {
				return {
					type_: n,
					p1: t
				};
			},
			"insert+p1+p2": function(e, t, n) {
				return {
					type_: n,
					p1: t[0],
					p2: t[1]
				};
			},
			copy: function(e, t) {
				return t;
			},
			write: function(e, t, n) {
				return n;
			},
			rm: function(e, t) {
				return {
					type_: "rm",
					p1: t
				};
			},
			text: function(e, t) {
				return n.go(t, "text");
			},
			"tex-math": function(e, t) {
				return n.go(t, "tex-math");
			},
			"tex-math tight": function(e, t) {
				return n.go(t, "tex-math tight");
			},
			bond: function(e, t, n) {
				return {
					type_: "bond",
					kind_: n || t
				};
			},
			"color0-output": function(e, t) {
				return {
					type_: "color0",
					color: t
				};
			},
			ce: function(e, t) {
				return n.go(t, "ce");
			},
			pu: function(e, t) {
				return n.go(t, "pu");
			},
			"1/2": function(e, t) {
				var n = [];
				t.match(/^[+\-]/) && (n.push(t.substr(0, 1)), t = t.substr(1));
				var r = t.match(/^([0-9]+|\$[a-z]\$|[a-z])\/([0-9]+)(\$[a-z]\$|[a-z])?$/);
				return r[1] = r[1].replace(/\$/g, ""), n.push({
					type_: "frac",
					p1: r[1],
					p2: r[2]
				}), r[3] && (r[3] = r[3].replace(/\$/g, ""), n.push({
					type_: "tex-math",
					p1: r[3]
				})), n;
			},
			"9,9": function(e, t) {
				return n.go(t, "9,9");
			}
		},
		stateMachines: {
			tex: {
				transitions: t({
					empty: { 0: { action_: "copy" } },
					"\\ce{(...)}": { 0: { action_: [
						{
							type_: "write",
							option: "{"
						},
						"ce",
						{
							type_: "write",
							option: "}"
						}
					] } },
					"\\pu{(...)}": { 0: { action_: [
						{
							type_: "write",
							option: "{"
						},
						"pu",
						{
							type_: "write",
							option: "}"
						}
					] } },
					else: { 0: { action_: "copy" } }
				}),
				actions: {}
			},
			ce: {
				transitions: t({
					empty: { "*": { action_: "output" } },
					else: { "0|1|2": {
						action_: "beginsWithBond=false",
						revisit: !0,
						toContinue: !0
					} },
					oxidation$: { 0: { action_: "oxidation-output" } },
					CMT: {
						r: {
							action_: "rdt=",
							nextState: "rt"
						},
						rd: {
							action_: "rqt=",
							nextState: "rdt"
						}
					},
					arrowUpDown: { "0|1|2|as": {
						action_: [
							"sb=false",
							"output",
							"operator"
						],
						nextState: "1"
					} },
					uprightEntities: { "0|1|2": {
						action_: ["o=", "output"],
						nextState: "1"
					} },
					orbital: { "0|1|2|3": {
						action_: "o=",
						nextState: "o"
					} },
					"->": {
						"0|1|2|3": {
							action_: "r=",
							nextState: "r"
						},
						"a|as": {
							action_: ["output", "r="],
							nextState: "r"
						},
						"*": {
							action_: ["output", "r="],
							nextState: "r"
						}
					},
					"+": {
						o: {
							action_: "d= kv",
							nextState: "d"
						},
						"d|D": {
							action_: "d=",
							nextState: "d"
						},
						q: {
							action_: "d=",
							nextState: "qd"
						},
						"qd|qD": {
							action_: "d=",
							nextState: "qd"
						},
						dq: {
							action_: ["output", "d="],
							nextState: "d"
						},
						3: {
							action_: [
								"sb=false",
								"output",
								"operator"
							],
							nextState: "0"
						}
					},
					amount: { "0|2": {
						action_: "a=",
						nextState: "a"
					} },
					"pm-operator": { "0|1|2|a|as": {
						action_: [
							"sb=false",
							"output",
							{
								type_: "operator",
								option: "\\pm"
							}
						],
						nextState: "0"
					} },
					operator: { "0|1|2|a|as": {
						action_: [
							"sb=false",
							"output",
							"operator"
						],
						nextState: "0"
					} },
					"-$": {
						"o|q": {
							action_: ["charge or bond", "output"],
							nextState: "qd"
						},
						d: {
							action_: "d=",
							nextState: "d"
						},
						D: {
							action_: ["output", {
								type_: "bond",
								option: "-"
							}],
							nextState: "3"
						},
						q: {
							action_: "d=",
							nextState: "qd"
						},
						qd: {
							action_: "d=",
							nextState: "qd"
						},
						"qD|dq": {
							action_: ["output", {
								type_: "bond",
								option: "-"
							}],
							nextState: "3"
						}
					},
					"-9": { "3|o": {
						action_: ["output", {
							type_: "insert",
							option: "hyphen"
						}],
						nextState: "3"
					} },
					"- orbital overlap": {
						o: {
							action_: ["output", {
								type_: "insert",
								option: "hyphen"
							}],
							nextState: "2"
						},
						d: {
							action_: ["output", {
								type_: "insert",
								option: "hyphen"
							}],
							nextState: "2"
						}
					},
					"-": {
						"0|1|2": {
							action_: [
								{
									type_: "output",
									option: 1
								},
								"beginsWithBond=true",
								{
									type_: "bond",
									option: "-"
								}
							],
							nextState: "3"
						},
						3: { action_: {
							type_: "bond",
							option: "-"
						} },
						a: {
							action_: ["output", {
								type_: "insert",
								option: "hyphen"
							}],
							nextState: "2"
						},
						as: {
							action_: [{
								type_: "output",
								option: 2
							}, {
								type_: "bond",
								option: "-"
							}],
							nextState: "3"
						},
						b: { action_: "b=" },
						o: {
							action_: {
								type_: "- after o/d",
								option: !1
							},
							nextState: "2"
						},
						q: {
							action_: {
								type_: "- after o/d",
								option: !1
							},
							nextState: "2"
						},
						"d|qd|dq": {
							action_: {
								type_: "- after o/d",
								option: !0
							},
							nextState: "2"
						},
						"D|qD|p": {
							action_: ["output", {
								type_: "bond",
								option: "-"
							}],
							nextState: "3"
						}
					},
					amount2: { "1|3": {
						action_: "a=",
						nextState: "a"
					} },
					letters: {
						"0|1|2|3|a|as|b|p|bp|o": {
							action_: "o=",
							nextState: "o"
						},
						"q|dq": {
							action_: ["output", "o="],
							nextState: "o"
						},
						"d|D|qd|qD": {
							action_: "o after d",
							nextState: "o"
						}
					},
					digits: {
						o: {
							action_: "q=",
							nextState: "q"
						},
						"d|D": {
							action_: "q=",
							nextState: "dq"
						},
						q: {
							action_: ["output", "o="],
							nextState: "o"
						},
						a: {
							action_: "o=",
							nextState: "o"
						}
					},
					"space A": { "b|p|bp": { action_: [] } },
					space: {
						a: {
							action_: [],
							nextState: "as"
						},
						0: { action_: "sb=false" },
						"1|2": { action_: "sb=true" },
						"r|rt|rd|rdt|rdq": {
							action_: "output",
							nextState: "0"
						},
						"*": {
							action_: ["output", "sb=true"],
							nextState: "1"
						}
					},
					"1st-level escape": {
						"1|2": { action_: ["output", {
							type_: "insert+p1",
							option: "1st-level escape"
						}] },
						"*": {
							action_: ["output", {
								type_: "insert+p1",
								option: "1st-level escape"
							}],
							nextState: "0"
						}
					},
					"[(...)]": {
						"r|rt": {
							action_: "rd=",
							nextState: "rd"
						},
						"rd|rdt": {
							action_: "rq=",
							nextState: "rdq"
						}
					},
					"...": {
						"o|d|D|dq|qd|qD": {
							action_: ["output", {
								type_: "bond",
								option: "..."
							}],
							nextState: "3"
						},
						"*": {
							action_: [{
								type_: "output",
								option: 1
							}, {
								type_: "insert",
								option: "ellipsis"
							}],
							nextState: "1"
						}
					},
					". __* ": { "*": {
						action_: ["output", {
							type_: "insert",
							option: "addition compound"
						}],
						nextState: "1"
					} },
					"state of aggregation $": { "*": {
						action_: ["output", "state of aggregation"],
						nextState: "1"
					} },
					"{[(": {
						"a|as|o": {
							action_: [
								"o=",
								"output",
								"parenthesisLevel++"
							],
							nextState: "2"
						},
						"0|1|2|3": {
							action_: [
								"o=",
								"output",
								"parenthesisLevel++"
							],
							nextState: "2"
						},
						"*": {
							action_: [
								"output",
								"o=",
								"output",
								"parenthesisLevel++"
							],
							nextState: "2"
						}
					},
					")]}": {
						"0|1|2|3|b|p|bp|o": {
							action_: ["o=", "parenthesisLevel--"],
							nextState: "o"
						},
						"a|as|d|D|q|qd|qD|dq": {
							action_: [
								"output",
								"o=",
								"parenthesisLevel--"
							],
							nextState: "o"
						}
					},
					", ": { "*": {
						action_: ["output", "comma"],
						nextState: "0"
					} },
					"^_": { "*": { action_: [] } },
					"^{(...)}|^($...$)": {
						"0|1|2|as": {
							action_: "b=",
							nextState: "b"
						},
						p: {
							action_: "b=",
							nextState: "bp"
						},
						"3|o": {
							action_: "d= kv",
							nextState: "D"
						},
						q: {
							action_: "d=",
							nextState: "qD"
						},
						"d|D|qd|qD|dq": {
							action_: ["output", "d="],
							nextState: "D"
						}
					},
					"^a|^\\x{}{}|^\\x{}|^\\x|'": {
						"0|1|2|as": {
							action_: "b=",
							nextState: "b"
						},
						p: {
							action_: "b=",
							nextState: "bp"
						},
						"3|o": {
							action_: "d= kv",
							nextState: "d"
						},
						q: {
							action_: "d=",
							nextState: "qd"
						},
						"d|qd|D|qD": { action_: "d=" },
						dq: {
							action_: ["output", "d="],
							nextState: "d"
						}
					},
					"_{(state of aggregation)}$": { "d|D|q|qd|qD|dq": {
						action_: ["output", "q="],
						nextState: "q"
					} },
					"_{(...)}|_($...$)|_9|_\\x{}{}|_\\x{}|_\\x": {
						"0|1|2|as": {
							action_: "p=",
							nextState: "p"
						},
						b: {
							action_: "p=",
							nextState: "bp"
						},
						"3|o": {
							action_: "q=",
							nextState: "q"
						},
						"d|D": {
							action_: "q=",
							nextState: "dq"
						},
						"q|qd|qD|dq": {
							action_: ["output", "q="],
							nextState: "q"
						}
					},
					"=<>": { "0|1|2|3|a|as|o|q|d|D|qd|qD|dq": {
						action_: [{
							type_: "output",
							option: 2
						}, "bond"],
						nextState: "3"
					} },
					"#": { "0|1|2|3|a|as|o": {
						action_: [{
							type_: "output",
							option: 2
						}, {
							type_: "bond",
							option: "#"
						}],
						nextState: "3"
					} },
					"{}^": { "*": {
						action_: [{
							type_: "output",
							option: 1
						}, {
							type_: "insert",
							option: "tinySkip"
						}],
						nextState: "1"
					} },
					"{}": { "*": {
						action_: {
							type_: "output",
							option: 1
						},
						nextState: "1"
					} },
					"{...}": {
						"0|1|2|3|a|as|b|p|bp": {
							action_: "o=",
							nextState: "o"
						},
						"o|d|D|q|qd|qD|dq": {
							action_: ["output", "o="],
							nextState: "o"
						}
					},
					"$...$": {
						a: { action_: "a=" },
						"0|1|2|3|as|b|p|bp|o": {
							action_: "o=",
							nextState: "o"
						},
						"as|o": { action_: "o=" },
						"q|d|D|qd|qD|dq": {
							action_: ["output", "o="],
							nextState: "o"
						}
					},
					"\\bond{(...)}": { "*": {
						action_: [{
							type_: "output",
							option: 2
						}, "bond"],
						nextState: "3"
					} },
					"\\frac{(...)}": { "*": {
						action_: [{
							type_: "output",
							option: 1
						}, "frac-output"],
						nextState: "3"
					} },
					"\\overset{(...)}": { "*": {
						action_: [{
							type_: "output",
							option: 2
						}, "overset-output"],
						nextState: "3"
					} },
					"\\underset{(...)}": { "*": {
						action_: [{
							type_: "output",
							option: 2
						}, "underset-output"],
						nextState: "3"
					} },
					"\\underbrace{(...)}": { "*": {
						action_: [{
							type_: "output",
							option: 2
						}, "underbrace-output"],
						nextState: "3"
					} },
					"\\color{(...)}{(...)}": { "*": {
						action_: [{
							type_: "output",
							option: 2
						}, "color-output"],
						nextState: "3"
					} },
					"\\color{(...)}": { "*": { action_: [{
						type_: "output",
						option: 2
					}, "color0-output"] } },
					"\\ce{(...)}": { "*": {
						action_: [{
							type_: "output",
							option: 2
						}, "ce"],
						nextState: "3"
					} },
					"\\,": { "*": {
						action_: [{
							type_: "output",
							option: 1
						}, "copy"],
						nextState: "1"
					} },
					"\\pu{(...)}": { "*": {
						action_: [
							"output",
							{
								type_: "write",
								option: "{"
							},
							"pu",
							{
								type_: "write",
								option: "}"
							}
						],
						nextState: "3"
					} },
					"\\x{}{}|\\x{}|\\x": {
						"0|1|2|3|a|as|b|p|bp|o|c0": {
							action_: ["o=", "output"],
							nextState: "3"
						},
						"*": {
							action_: [
								"output",
								"o=",
								"output"
							],
							nextState: "3"
						}
					},
					others: { "*": {
						action_: [{
							type_: "output",
							option: 1
						}, "copy"],
						nextState: "3"
					} },
					else2: {
						a: {
							action_: "a to o",
							nextState: "o",
							revisit: !0
						},
						as: {
							action_: ["output", "sb=true"],
							nextState: "1",
							revisit: !0
						},
						"r|rt|rd|rdt|rdq": {
							action_: ["output"],
							nextState: "0",
							revisit: !0
						},
						"*": {
							action_: ["output", "copy"],
							nextState: "3"
						}
					}
				}),
				actions: {
					"o after d": function(e, t) {
						var r;
						if ((e.d || "").match(/^[1-9][0-9]*$/)) {
							var i = e.d;
							e.d = void 0, r = this.output(e), r.push({ type_: "tinySkip" }), e.b = i;
						} else r = this.output(e);
						return n.actions["o="](e, t), r;
					},
					"d= kv": function(e, t) {
						e.d = t, e.dType = "kv";
					},
					"charge or bond": function(e, t) {
						if (e.beginsWithBond) {
							var r = [];
							return n.concatArray(r, this.output(e)), n.concatArray(r, n.actions.bond(e, t, "-")), r;
						} else {
							e.d = t;
							return;
						}
					},
					"- after o/d": function(e, t, r) {
						var i = n.patterns.match_("orbital", e.o || ""), a = n.patterns.match_("one lowercase greek letter $", e.o || ""), o = n.patterns.match_("one lowercase latin letter $", e.o || ""), s = n.patterns.match_("$one lowercase latin letter$ $", e.o || ""), c = t === "-" && (i && i.remainder === "" || a || o || s);
						c && !e.a && !e.b && !e.p && !e.d && !e.q && !i && o && (e.o = "$" + e.o + "$");
						var l = [];
						return c ? (n.concatArray(l, this.output(e)), l.push({ type_: "hyphen" })) : (i = n.patterns.match_("digits", e.d || ""), r && i && i.remainder === "" ? (n.concatArray(l, n.actions["d="](e, t)), n.concatArray(l, this.output(e))) : (n.concatArray(l, this.output(e)), n.concatArray(l, n.actions.bond(e, t, "-")))), l;
					},
					"a to o": function(e) {
						e.o = e.a, e.a = void 0;
					},
					"sb=true": function(e) {
						e.sb = !0;
					},
					"sb=false": function(e) {
						e.sb = !1;
					},
					"beginsWithBond=true": function(e) {
						e.beginsWithBond = !0;
					},
					"beginsWithBond=false": function(e) {
						e.beginsWithBond = !1;
					},
					"parenthesisLevel++": function(e) {
						e.parenthesisLevel++;
					},
					"parenthesisLevel--": function(e) {
						e.parenthesisLevel--;
					},
					"state of aggregation": function(e, t) {
						return {
							type_: "state of aggregation",
							p1: n.go(t, "o")
						};
					},
					comma: function(e, t) {
						var n = t.replace(/\s*$/, "");
						return n !== t && e.parenthesisLevel === 0 ? {
							type_: "comma enumeration L",
							p1: n
						} : {
							type_: "comma enumeration M",
							p1: n
						};
					},
					output: function(e, t, r) {
						var i;
						if (!e.r) i = [], !e.a && !e.b && !e.p && !e.o && !e.q && !e.d && !r || (e.sb && i.push({ type_: "entitySkip" }), !e.o && !e.q && !e.d && !e.b && !e.p && r !== 2 ? (e.o = e.a, e.a = void 0) : !e.o && !e.q && !e.d && (e.b || e.p) ? (e.o = e.a, e.d = e.b, e.q = e.p, e.a = e.b = e.p = void 0) : e.o && e.dType === "kv" && n.patterns.match_("d-oxidation$", e.d || "") ? e.dType = "oxidation" : e.o && e.dType === "kv" && !e.q && (e.dType = void 0), i.push({
							type_: "chemfive",
							a: n.go(e.a, "a"),
							b: n.go(e.b, "bd"),
							p: n.go(e.p, "pq"),
							o: n.go(e.o, "o"),
							q: n.go(e.q, "pq"),
							d: n.go(e.d, e.dType === "oxidation" ? "oxidation" : "bd"),
							dType: e.dType
						}));
						else {
							var a = void 0;
							a = e.rdt === "M" ? n.go(e.rd, "tex-math") : e.rdt === "T" ? [{
								type_: "text",
								p1: e.rd || ""
							}] : n.go(e.rd, "ce");
							var o = void 0;
							o = e.rqt === "M" ? n.go(e.rq, "tex-math") : e.rqt === "T" ? [{
								type_: "text",
								p1: e.rq || ""
							}] : n.go(e.rq, "ce"), i = {
								type_: "arrow",
								r: e.r,
								rd: a,
								rq: o
							};
						}
						for (var s in e) s !== "parenthesisLevel" && s !== "beginsWithBond" && delete e[s];
						return i;
					},
					"oxidation-output": function(e, t) {
						var r = ["{"];
						return n.concatArray(r, n.go(t, "oxidation")), r.push("}"), r;
					},
					"frac-output": function(e, t) {
						return {
							type_: "frac-ce",
							p1: n.go(t[0], "ce"),
							p2: n.go(t[1], "ce")
						};
					},
					"overset-output": function(e, t) {
						return {
							type_: "overset",
							p1: n.go(t[0], "ce"),
							p2: n.go(t[1], "ce")
						};
					},
					"underset-output": function(e, t) {
						return {
							type_: "underset",
							p1: n.go(t[0], "ce"),
							p2: n.go(t[1], "ce")
						};
					},
					"underbrace-output": function(e, t) {
						return {
							type_: "underbrace",
							p1: n.go(t[0], "ce"),
							p2: n.go(t[1], "ce")
						};
					},
					"color-output": function(e, t) {
						return {
							type_: "color",
							color1: t[0],
							color2: n.go(t[1], "ce")
						};
					},
					"r=": function(e, t) {
						e.r = t;
					},
					"rdt=": function(e, t) {
						e.rdt = t;
					},
					"rd=": function(e, t) {
						e.rd = t;
					},
					"rqt=": function(e, t) {
						e.rqt = t;
					},
					"rq=": function(e, t) {
						e.rq = t;
					},
					operator: function(e, t, n) {
						return {
							type_: "operator",
							kind_: n || t
						};
					}
				}
			},
			a: {
				transitions: t({
					empty: { "*": { action_: [] } },
					"1/2$": { 0: { action_: "1/2" } },
					else: { 0: {
						action_: [],
						nextState: "1",
						revisit: !0
					} },
					"${(...)}$__$(...)$": { "*": {
						action_: "tex-math tight",
						nextState: "1"
					} },
					",": { "*": { action_: {
						type_: "insert",
						option: "commaDecimal"
					} } },
					else2: { "*": { action_: "copy" } }
				}),
				actions: {}
			},
			o: {
				transitions: t({
					empty: { "*": { action_: [] } },
					"1/2$": { 0: { action_: "1/2" } },
					else: { 0: {
						action_: [],
						nextState: "1",
						revisit: !0
					} },
					letters: { "*": { action_: "rm" } },
					"\\ca": { "*": { action_: {
						type_: "insert",
						option: "circa"
					} } },
					"\\pu{(...)}": { "*": { action_: [
						{
							type_: "write",
							option: "{"
						},
						"pu",
						{
							type_: "write",
							option: "}"
						}
					] } },
					"\\x{}{}|\\x{}|\\x": { "*": { action_: "copy" } },
					"${(...)}$__$(...)$": { "*": { action_: "tex-math" } },
					"{(...)}": { "*": { action_: [
						{
							type_: "write",
							option: "{"
						},
						"text",
						{
							type_: "write",
							option: "}"
						}
					] } },
					else2: { "*": { action_: "copy" } }
				}),
				actions: {}
			},
			text: {
				transitions: t({
					empty: { "*": { action_: "output" } },
					"{...}": { "*": { action_: "text=" } },
					"${(...)}$__$(...)$": { "*": { action_: "tex-math" } },
					"\\greek": { "*": { action_: ["output", "rm"] } },
					"\\pu{(...)}": { "*": { action_: [
						"output",
						{
							type_: "write",
							option: "{"
						},
						"pu",
						{
							type_: "write",
							option: "}"
						}
					] } },
					"\\,|\\x{}{}|\\x{}|\\x": { "*": { action_: ["output", "copy"] } },
					else: { "*": { action_: "text=" } }
				}),
				actions: { output: function(e) {
					if (e.text_) {
						var t = {
							type_: "text",
							p1: e.text_
						};
						for (var n in e) delete e[n];
						return t;
					}
				} }
			},
			pq: {
				transitions: t({
					empty: { "*": { action_: [] } },
					"state of aggregation $": { "*": { action_: "state of aggregation" } },
					i$: { 0: {
						action_: [],
						nextState: "!f",
						revisit: !0
					} },
					"(KV letters),": { 0: {
						action_: "rm",
						nextState: "0"
					} },
					formula$: { 0: {
						action_: [],
						nextState: "f",
						revisit: !0
					} },
					"1/2$": { 0: { action_: "1/2" } },
					else: { 0: {
						action_: [],
						nextState: "!f",
						revisit: !0
					} },
					"${(...)}$__$(...)$": { "*": { action_: "tex-math" } },
					"{(...)}": { "*": { action_: "text" } },
					"a-z": { f: { action_: "tex-math" } },
					letters: { "*": { action_: "rm" } },
					"-9.,9": { "*": { action_: "9,9" } },
					",": { "*": { action_: {
						type_: "insert+p1",
						option: "comma enumeration S"
					} } },
					"\\color{(...)}{(...)}": { "*": { action_: "color-output" } },
					"\\color{(...)}": { "*": { action_: "color0-output" } },
					"\\ce{(...)}": { "*": { action_: "ce" } },
					"\\pu{(...)}": { "*": { action_: [
						{
							type_: "write",
							option: "{"
						},
						"pu",
						{
							type_: "write",
							option: "}"
						}
					] } },
					"\\,|\\x{}{}|\\x{}|\\x": { "*": { action_: "copy" } },
					else2: { "*": { action_: "copy" } }
				}),
				actions: {
					"state of aggregation": function(e, t) {
						return {
							type_: "state of aggregation subscript",
							p1: n.go(t, "o")
						};
					},
					"color-output": function(e, t) {
						return {
							type_: "color",
							color1: t[0],
							color2: n.go(t[1], "pq")
						};
					}
				}
			},
			bd: {
				transitions: t({
					empty: { "*": { action_: [] } },
					x$: { 0: {
						action_: [],
						nextState: "!f",
						revisit: !0
					} },
					formula$: { 0: {
						action_: [],
						nextState: "f",
						revisit: !0
					} },
					else: { 0: {
						action_: [],
						nextState: "!f",
						revisit: !0
					} },
					"-9.,9 no missing 0": { "*": { action_: "9,9" } },
					".": { "*": { action_: {
						type_: "insert",
						option: "electron dot"
					} } },
					"a-z": { f: { action_: "tex-math" } },
					x: { "*": { action_: {
						type_: "insert",
						option: "KV x"
					} } },
					letters: { "*": { action_: "rm" } },
					"'": { "*": { action_: {
						type_: "insert",
						option: "prime"
					} } },
					"${(...)}$__$(...)$": { "*": { action_: "tex-math" } },
					"{(...)}": { "*": { action_: "text" } },
					"\\color{(...)}{(...)}": { "*": { action_: "color-output" } },
					"\\color{(...)}": { "*": { action_: "color0-output" } },
					"\\ce{(...)}": { "*": { action_: "ce" } },
					"\\pu{(...)}": { "*": { action_: [
						{
							type_: "write",
							option: "{"
						},
						"pu",
						{
							type_: "write",
							option: "}"
						}
					] } },
					"\\,|\\x{}{}|\\x{}|\\x": { "*": { action_: "copy" } },
					else2: { "*": { action_: "copy" } }
				}),
				actions: { "color-output": function(e, t) {
					return {
						type_: "color",
						color1: t[0],
						color2: n.go(t[1], "bd")
					};
				} }
			},
			oxidation: {
				transitions: t({
					empty: { "*": { action_: "roman-numeral" } },
					"pm-operator": { "*": { action_: {
						type_: "o=+p1",
						option: "\\pm"
					} } },
					else: { "*": { action_: "o=" } }
				}),
				actions: { "roman-numeral": function(e) {
					return {
						type_: "roman numeral",
						p1: e.o || ""
					};
				} }
			},
			"tex-math": {
				transitions: t({
					empty: { "*": { action_: "output" } },
					"\\ce{(...)}": { "*": { action_: ["output", "ce"] } },
					"\\pu{(...)}": { "*": { action_: [
						"output",
						{
							type_: "write",
							option: "{"
						},
						"pu",
						{
							type_: "write",
							option: "}"
						}
					] } },
					"{...}|\\,|\\x{}{}|\\x{}|\\x": { "*": { action_: "o=" } },
					else: { "*": { action_: "o=" } }
				}),
				actions: { output: function(e) {
					if (e.o) {
						var t = {
							type_: "tex-math",
							p1: e.o
						};
						for (var n in e) delete e[n];
						return t;
					}
				} }
			},
			"tex-math tight": {
				transitions: t({
					empty: { "*": { action_: "output" } },
					"\\ce{(...)}": { "*": { action_: ["output", "ce"] } },
					"\\pu{(...)}": { "*": { action_: [
						"output",
						{
							type_: "write",
							option: "{"
						},
						"pu",
						{
							type_: "write",
							option: "}"
						}
					] } },
					"{...}|\\,|\\x{}{}|\\x{}|\\x": { "*": { action_: "o=" } },
					"-|+": { "*": { action_: "tight operator" } },
					else: { "*": { action_: "o=" } }
				}),
				actions: {
					"tight operator": function(e, t) {
						e.o = (e.o || "") + "{" + t + "}";
					},
					output: function(e) {
						if (e.o) {
							var t = {
								type_: "tex-math",
								p1: e.o
							};
							for (var n in e) delete e[n];
							return t;
						}
					}
				}
			},
			"9,9": {
				transitions: t({
					empty: { "*": { action_: [] } },
					",": { "*": { action_: "comma" } },
					else: { "*": { action_: "copy" } }
				}),
				actions: { comma: function() {
					return { type_: "commaDecimal" };
				} }
			},
			pu: {
				transitions: t({
					empty: { "*": { action_: "output" } },
					space$: { "*": { action_: ["output", "space"] } },
					"{[(|)]}": { "0|a": { action_: "copy" } },
					"(-)(9)^(-9)": { 0: {
						action_: "number^",
						nextState: "a"
					} },
					"(-)(9.,9)(e)(99)": { 0: {
						action_: "enumber",
						nextState: "a"
					} },
					space: { "0|a": { action_: [] } },
					"pm-operator": { "0|a": {
						action_: {
							type_: "operator",
							option: "\\pm"
						},
						nextState: "0"
					} },
					operator: { "0|a": {
						action_: "copy",
						nextState: "0"
					} },
					"//": { d: {
						action_: "o=",
						nextState: "/"
					} },
					"/": { d: {
						action_: "o=",
						nextState: "/"
					} },
					"{...}|else": {
						"0|d": {
							action_: "d=",
							nextState: "d"
						},
						a: {
							action_: ["space", "d="],
							nextState: "d"
						},
						"/|q": {
							action_: "q=",
							nextState: "q"
						}
					}
				}),
				actions: {
					enumber: function(e, t) {
						var r = [];
						return t[0] === "+-" || t[0] === "+/-" ? r.push("\\pm ") : t[0] && r.push(t[0]), t[1] && (n.concatArray(r, n.go(t[1], "pu-9,9")), t[2] && (t[2].match(/[,.]/) ? n.concatArray(r, n.go(t[2], "pu-9,9")) : r.push(t[2])), (t[3] || t[4]) && (t[3] === "e" || t[4] === "*" ? r.push({ type_: "cdot" }) : r.push({ type_: "times" }))), t[5] && r.push("10^{" + t[5] + "}"), r;
					},
					"number^": function(e, t) {
						var r = [];
						return t[0] === "+-" || t[0] === "+/-" ? r.push("\\pm ") : t[0] && r.push(t[0]), n.concatArray(r, n.go(t[1], "pu-9,9")), r.push("^{" + t[2] + "}"), r;
					},
					operator: function(e, t, n) {
						return {
							type_: "operator",
							kind_: n || t
						};
					},
					space: function() {
						return { type_: "pu-space-1" };
					},
					output: function(e) {
						var t, r = n.patterns.match_("{(...)}", e.d || "");
						r && r.remainder === "" && (e.d = r.match_);
						var i = n.patterns.match_("{(...)}", e.q || "");
						if (i && i.remainder === "" && (e.q = i.match_), e.d &&= (e.d = e.d.replace(/\u00B0C|\^oC|\^{o}C/g, "{}^{\\circ}C"), e.d.replace(/\u00B0F|\^oF|\^{o}F/g, "{}^{\\circ}F")), e.q) {
							e.q = e.q.replace(/\u00B0C|\^oC|\^{o}C/g, "{}^{\\circ}C"), e.q = e.q.replace(/\u00B0F|\^oF|\^{o}F/g, "{}^{\\circ}F");
							var a = {
								d: n.go(e.d, "pu"),
								q: n.go(e.q, "pu")
							};
							e.o === "//" ? t = {
								type_: "pu-frac",
								p1: a.d,
								p2: a.q
							} : (t = a.d, a.d.length > 1 || a.q.length > 1 ? t.push({ type_: " / " }) : t.push({ type_: "/" }), n.concatArray(t, a.q));
						} else t = n.go(e.d, "pu-2");
						for (var o in e) delete e[o];
						return t;
					}
				}
			},
			"pu-2": {
				transitions: t({
					empty: { "*": { action_: "output" } },
					"*": { "*": {
						action_: ["output", "cdot"],
						nextState: "0"
					} },
					"\\x": { "*": { action_: "rm=" } },
					space: { "*": {
						action_: ["output", "space"],
						nextState: "0"
					} },
					"^{(...)}|^(-1)": { 1: { action_: "^(-1)" } },
					"-9.,9": {
						0: {
							action_: "rm=",
							nextState: "0"
						},
						1: {
							action_: "^(-1)",
							nextState: "0"
						}
					},
					"{...}|else": { "*": {
						action_: "rm=",
						nextState: "1"
					} }
				}),
				actions: {
					cdot: function() {
						return { type_: "tight cdot" };
					},
					"^(-1)": function(e, t) {
						e.rm += "^{" + t + "}";
					},
					space: function() {
						return { type_: "pu-space-2" };
					},
					output: function(e) {
						var t = [];
						if (e.rm) {
							var r = n.patterns.match_("{(...)}", e.rm || "");
							t = r && r.remainder === "" ? n.go(r.match_, "pu") : {
								type_: "rm",
								p1: e.rm
							};
						}
						for (var i in e) delete e[i];
						return t;
					}
				}
			},
			"pu-9,9": {
				transitions: t({
					empty: {
						0: { action_: "output-0" },
						o: { action_: "output-o" }
					},
					",": { 0: {
						action_: ["output-0", "comma"],
						nextState: "o"
					} },
					".": { 0: {
						action_: ["output-0", "copy"],
						nextState: "o"
					} },
					else: { "*": { action_: "text=" } }
				}),
				actions: {
					comma: function() {
						return { type_: "commaDecimal" };
					},
					"output-0": function(e) {
						var t = [];
						if (e.text_ = e.text_ || "", e.text_.length > 4) {
							var n = e.text_.length % 3;
							n === 0 && (n = 3);
							for (var r = e.text_.length - 3; r > 0; r -= 3) t.push(e.text_.substr(r, 3)), t.push({ type_: "1000 separator" });
							t.push(e.text_.substr(0, n)), t.reverse();
						} else t.push(e.text_);
						for (var i in e) delete e[i];
						return t;
					},
					"output-o": function(e) {
						var t = [];
						if (e.text_ = e.text_ || "", e.text_.length > 4) {
							var n = e.text_.length - 3, r = void 0;
							for (r = 0; r < n; r += 3) t.push(e.text_.substr(r, 3)), t.push({ type_: "1000 separator" });
							t.push(e.text_.substr(r));
						} else t.push(e.text_);
						for (var i in e) delete e[i];
						return t;
					}
				}
			}
		}
	}, r = {
		go: function(e, t) {
			if (!e) return "";
			for (var n = "", i = !1, a = 0; a < e.length; a++) {
				var o = e[a];
				typeof o == "string" ? n += o : (n += r._go2(o), o.type_ === "1st-level escape" && (i = !0));
			}
			return t && !i && n && (n = "{" + n + "}"), n;
		},
		_goInner: function(e) {
			return r.go(e, !1);
		},
		_go2: function(e) {
			var t;
			switch (e.type_) {
				case "chemfive":
					t = "";
					var n = {
						a: r._goInner(e.a),
						b: r._goInner(e.b),
						p: r._goInner(e.p),
						o: r._goInner(e.o),
						q: r._goInner(e.q),
						d: r._goInner(e.d)
					};
					n.a && (n.a.match(/^[+\-]/) && (n.a = "{" + n.a + "}"), t += n.a + "\\,"), (n.b || n.p) && (t += "{\\vphantom{A}}", t += "^{\\hphantom{" + (n.b || "") + "}}_{\\hphantom{" + (n.p || "") + "}}", t += "\\mkern-1.5mu", t += "{\\vphantom{A}}", t += "^{\\smash[t]{\\vphantom{2}}\\llap{" + (n.b || "") + "}}", t += "_{\\vphantom{2}\\llap{\\smash[t]{" + (n.p || "") + "}}}"), n.o && (n.o.match(/^[+\-]/) && (n.o = "{" + n.o + "}"), t += n.o), e.dType === "kv" ? ((n.d || n.q) && (t += "{\\vphantom{A}}"), n.d && (t += "^{" + n.d + "}"), n.q && (t += "_{\\smash[t]{" + n.q + "}}")) : e.dType === "oxidation" ? (n.d && (t += "{\\vphantom{A}}", t += "^{" + n.d + "}"), n.q && (t += "{\\vphantom{A}}", t += "_{\\smash[t]{" + n.q + "}}")) : (n.q && (t += "{\\vphantom{A}}", t += "_{\\smash[t]{" + n.q + "}}"), n.d && (t += "{\\vphantom{A}}", t += "^{" + n.d + "}"));
					break;
				case "rm":
					t = "\\mathrm{" + e.p1 + "}";
					break;
				case "text":
					e.p1.match(/[\^_]/) ? (e.p1 = e.p1.replace(" ", "~").replace("-", "\\text{-}"), t = "\\mathrm{" + e.p1 + "}") : t = "\\text{" + e.p1 + "}";
					break;
				case "roman numeral":
					t = "\\mathrm{" + e.p1 + "}";
					break;
				case "state of aggregation":
					t = "\\mskip2mu " + r._goInner(e.p1);
					break;
				case "state of aggregation subscript":
					t = "\\mskip1mu " + r._goInner(e.p1);
					break;
				case "bond":
					if (t = r._getBond(e.kind_), !t) throw ["MhchemErrorBond", "mhchem Error. Unknown bond type (" + e.kind_ + ")"];
					break;
				case "frac":
					var i = "\\frac{" + e.p1 + "}{" + e.p2 + "}";
					t = "\\mathchoice{\\textstyle" + i + "}{" + i + "}{" + i + "}{" + i + "}";
					break;
				case "pu-frac":
					var a = "\\frac{" + r._goInner(e.p1) + "}{" + r._goInner(e.p2) + "}";
					t = "\\mathchoice{\\textstyle" + a + "}{" + a + "}{" + a + "}{" + a + "}";
					break;
				case "tex-math":
					t = e.p1 + " ";
					break;
				case "frac-ce":
					t = "\\frac{" + r._goInner(e.p1) + "}{" + r._goInner(e.p2) + "}";
					break;
				case "overset":
					t = "\\overset{" + r._goInner(e.p1) + "}{" + r._goInner(e.p2) + "}";
					break;
				case "underset":
					t = "\\underset{" + r._goInner(e.p1) + "}{" + r._goInner(e.p2) + "}";
					break;
				case "underbrace":
					t = "\\underbrace{" + r._goInner(e.p1) + "}_{" + r._goInner(e.p2) + "}";
					break;
				case "color":
					t = "{\\color{" + e.color1 + "}{" + r._goInner(e.color2) + "}}";
					break;
				case "color0":
					t = "\\color{" + e.color + "}";
					break;
				case "arrow":
					var o = {
						rd: r._goInner(e.rd),
						rq: r._goInner(e.rq)
					}, s = r._getArrow(e.r);
					o.rd || o.rq ? e.r === "<=>" || e.r === "<=>>" || e.r === "<<=>" || e.r === "<-->" ? (s = "\\long" + s, o.rd && (s = "\\overset{" + o.rd + "}{" + s + "}"), o.rq && (s = e.r === "<-->" ? "\\underset{\\lower2mu{" + o.rq + "}}{" + s + "}" : "\\underset{\\lower6mu{" + o.rq + "}}{" + s + "}"), s = " {}\\mathrel{" + s + "}{} ") : (o.rq && (s += "[{" + o.rq + "}]"), s += "{" + o.rd + "}", s = " {}\\mathrel{\\x" + s + "}{} ") : s = " {}\\mathrel{\\long" + s + "}{} ", t = s;
					break;
				case "operator":
					t = r._getOperator(e.kind_);
					break;
				case "1st-level escape":
					t = e.p1 + " ";
					break;
				case "space":
					t = " ";
					break;
				case "tinySkip":
					t = "\\mkern2mu";
					break;
				case "entitySkip":
					t = "~";
					break;
				case "pu-space-1":
					t = "~";
					break;
				case "pu-space-2":
					t = "\\mkern3mu ";
					break;
				case "1000 separator":
					t = "\\mkern2mu ";
					break;
				case "commaDecimal":
					t = "{,}";
					break;
				case "comma enumeration L":
					t = "{" + e.p1 + "}\\mkern6mu ";
					break;
				case "comma enumeration M":
					t = "{" + e.p1 + "}\\mkern3mu ";
					break;
				case "comma enumeration S":
					t = "{" + e.p1 + "}\\mkern1mu ";
					break;
				case "hyphen":
					t = "\\text{-}";
					break;
				case "addition compound":
					t = "\\,{\\cdot}\\,";
					break;
				case "electron dot":
					t = "\\mkern1mu \\bullet\\mkern1mu ";
					break;
				case "KV x":
					t = "{\\times}";
					break;
				case "prime":
					t = "\\prime ";
					break;
				case "cdot":
					t = "\\cdot ";
					break;
				case "tight cdot":
					t = "\\mkern1mu{\\cdot}\\mkern1mu ";
					break;
				case "times":
					t = "\\times ";
					break;
				case "circa":
					t = "{\\sim}";
					break;
				case "^":
					t = "uparrow";
					break;
				case "v":
					t = "downarrow";
					break;
				case "ellipsis":
					t = "\\ldots ";
					break;
				case "/":
					t = "/";
					break;
				case " / ":
					t = "\\,/\\,";
					break;
				default: throw ["MhchemBugT", "mhchem bug T. Please report."];
			}
			return t;
		},
		_getArrow: function(e) {
			switch (e) {
				case "->": return "rightarrow";
				case "→": return "rightarrow";
				case "⟶": return "rightarrow";
				case "<-": return "leftarrow";
				case "<->": return "leftrightarrow";
				case "<-->": return "leftrightarrows";
				case "<=>": return "rightleftharpoons";
				case "⇌": return "rightleftharpoons";
				case "<=>>": return "Rightleftharpoons";
				case "<<=>": return "Leftrightharpoons";
				default: throw ["MhchemBugT", "mhchem bug T. Please report."];
			}
		},
		_getBond: function(e) {
			switch (e) {
				case "-": return "{-}";
				case "1": return "{-}";
				case "=": return "{=}";
				case "2": return "{=}";
				case "#": return "{\\equiv}";
				case "3": return "{\\equiv}";
				case "~": return "{\\tripledash}";
				case "~-": return "{\\rlap{\\lower.1em{-}}\\raise.1em{\\tripledash}}";
				case "~=": return "{\\rlap{\\lower.2em{-}}\\rlap{\\raise.2em{\\tripledash}}-}";
				case "~--": return "{\\rlap{\\lower.2em{-}}\\rlap{\\raise.2em{\\tripledash}}-}";
				case "-~-": return "{\\rlap{\\lower.2em{-}}\\rlap{\\raise.2em{-}}\\tripledash}";
				case "...": return "{{\\cdot}{\\cdot}{\\cdot}}";
				case "....": return "{{\\cdot}{\\cdot}{\\cdot}{\\cdot}}";
				case "->": return "{\\rightarrow}";
				case "<-": return "{\\leftarrow}";
				case "<": return "{<}";
				case ">": return "{>}";
				default: throw ["MhchemBugT", "mhchem bug T. Please report."];
			}
		},
		_getOperator: function(e) {
			switch (e) {
				case "+": return " {}+{} ";
				case "-": return " {}-{} ";
				case "=": return " {}={} ";
				case "<": return " {}<{} ";
				case ">": return " {}>{} ";
				case "<<": return " {}\\ll{} ";
				case ">>": return " {}\\gg{} ";
				case "\\pm": return " {}\\pm{} ";
				case "\\approx": return " {}\\approx{} ";
				case "$\\approx$": return " {}\\approx{} ";
				case "v": return " \\downarrow{} ";
				case "(v)": return " \\downarrow{} ";
				case "^": return " \\uparrow{} ";
				case "(^)": return " \\uparrow{} ";
				default: throw ["MhchemBugT", "mhchem bug T. Please report."];
			}
		}
	};
})), be = /* @__PURE__ */ e(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MhchemConfiguration = void 0;
	var n = o(), r = h(), a = t(i()), s = t(_()), c = T(), l = ye(), u = {};
	u.Macro = s.default.Macro, u.xArrow = c.AmsMethods.xArrow, u.Machine = function(e, t, n) {
		var r = e.GetArgument(t), i;
		try {
			i = l.mhchemParser.toTex(r, n);
		} catch (e) {
			throw new a.default(e[0], e[1]);
		}
		e.string = i + e.string.substr(e.i), e.i = 0;
	}, new r.CommandMap("mhchem", {
		ce: ["Machine", "ce"],
		pu: ["Machine", "pu"],
		longrightleftharpoons: ["Macro", "\\stackrel{\\textstyle{-}\\!\\!{\\rightharpoonup}}{\\smash{{\\leftharpoondown}\\!\\!{-}}}"],
		longRightleftharpoons: ["Macro", "\\stackrel{\\textstyle{-}\\!\\!{\\rightharpoonup}}{\\smash{\\leftharpoondown}}"],
		longLeftrightharpoons: ["Macro", "\\stackrel{\\textstyle\\vphantom{{-}}{\\rightharpoonup}}{\\smash{{\\leftharpoondown}\\!\\!{-}}}"],
		longleftrightarrows: ["Macro", "\\stackrel{\\longrightarrow}{\\smash{\\longleftarrow}\\Rule{0px}{.25em}{0px}}"],
		tripledash: ["Macro", "\\vphantom{-}\\raise2mu{\\kern2mu\\tiny\\text{-}\\kern1mu\\text{-}\\kern1mu\\text{-}\\kern2mu}"],
		xleftrightarrow: [
			"xArrow",
			8596,
			6,
			6
		],
		xrightleftharpoons: [
			"xArrow",
			8652,
			5,
			7
		],
		xRightleftharpoons: [
			"xArrow",
			8652,
			5,
			7
		],
		xLeftrightharpoons: [
			"xArrow",
			8652,
			5,
			7
		]
	}, u), e.MhchemConfiguration = n.Configuration.create("mhchem", { handler: { macro: ["mhchem"] } });
})), xe = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.NoErrorsConfiguration = void 0;
	var t = o();
	function n(e, t, n, r) {
		var i = e.create("token", "mtext", {}, r.replace(/\n/g, " "));
		return e.create("node", "merror", [i], {
			"data-mjx-error": t,
			title: t
		});
	}
	e.NoErrorsConfiguration = t.Configuration.create("noerrors", { nodes: { error: n } });
})), Se = /* @__PURE__ */ e(((e) => {
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
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.NoUndefinedConfiguration = void 0;
	var n = o();
	function r(e, n) {
		var r, i, a = e.create("text", "\\" + n), o = e.options.noundefined || {}, s = {};
		try {
			for (var c = t([
				"color",
				"background",
				"size"
			]), l = c.next(); !l.done; l = c.next()) {
				var u = l.value;
				o[u] && (s["math" + u] = o[u]);
			}
		} catch (e) {
			r = { error: e };
		} finally {
			try {
				l && !l.done && (i = c.return) && i.call(c);
			} finally {
				if (r) throw r.error;
			}
		}
		e.Push(e.create("node", "mtext", [], s, a));
	}
	e.NoUndefinedConfiguration = n.Configuration.create("noundefined", {
		fallback: { macro: r },
		options: { noundefined: {
			color: "red",
			background: "",
			size: ""
		} },
		priority: 3
	});
})), Ce = /* @__PURE__ */ e(((e) => {
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
	})(), n = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.AutoOpen = void 0;
	var r = c(), i = n(u()), a = n(x()), o = n(g());
	e.AutoOpen = function(e) {
		t(n, e);
		function n() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.openCount = 0, t;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "auto open";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(n.prototype, "isOpen", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.toMml = function() {
			var t = this.factory.configuration.parser, n = this.getProperty("right");
			if (this.getProperty("smash")) {
				var r = e.prototype.toMml.call(this), s = t.create("node", "mpadded", [r], {
					height: 0,
					depth: 0
				});
				this.Clear(), this.Push(t.create("node", "TeXAtom", [s]));
			}
			n && this.Push(new o.default(n, t.stack.env, t.configuration).mml());
			var c = i.default.fenced(this.factory.configuration, this.getProperty("open"), e.prototype.toMml.call(this), this.getProperty("close"), this.getProperty("big"));
			return a.default.removeProperties(c, "open", "close", "texClass"), c;
		}, n.prototype.checkItem = function(t) {
			if (t.isKind("mml") && t.Size() === 1) {
				var n = t.toMml();
				n.isKind("mo") && n.getText() === this.getProperty("open") && this.openCount++;
			}
			var r = t.getProperty("autoclose");
			return r && r === this.getProperty("close") && !this.openCount-- ? this.getProperty("ignore") ? (this.Clear(), [[], !0]) : [[this.toMml()], !0] : e.prototype.checkItem.call(this, t);
		}, n.errors = Object.assign(Object.create(r.BaseItem.errors), { stop: ["ExtraOrMissingDelims", "Extra open or missing close delimiter"] }), n;
	}(r.BaseItem);
})), we = /* @__PURE__ */ e(((e) => {
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
	}, n = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 });
	var a = n(_()), o = n(g()), c = n(i()), l = r(), d = n(u()), f = n(x()), p = s(), m = {}, h = {
		"(": ")",
		"[": "]",
		"{": "}",
		"|": "|"
	}, v = /^(b|B)i(g{1,2})$/;
	m.Quantity = function(e, t, n, r, i, a, s) {
		n === void 0 && (n = "("), r === void 0 && (r = ")"), i === void 0 && (i = !1), a === void 0 && (a = ""), s === void 0 && (s = "");
		var u = i ? e.GetStar() : !1, p = e.GetNext(), m = e.i, g = null;
		if (p === "\\") {
			if (e.i++, g = e.GetCS(), !g.match(v)) {
				var _ = e.create("node", "mrow");
				e.Push(d.default.fenced(e.configuration, n, _, r)), e.i = m;
				return;
			}
			p = e.GetNext();
		}
		var y = h[p];
		if (i && p !== "{") throw new c.default("MissingArgFor", "Missing argument for %1", e.currentCS);
		if (!y) {
			var _ = e.create("node", "mrow");
			e.Push(d.default.fenced(e.configuration, n, _, r)), e.i = m;
			return;
		}
		if (a) {
			var b = e.create("token", "mi", { texClass: l.TEXCLASS.OP }, a);
			s && f.default.setAttribute(b, "mathvariant", s), e.Push(e.itemFactory.create("fn", b));
		}
		if (p === "{") {
			var x = e.GetArgument(t);
			p = i ? n : "\\{", y = i ? r : "\\}", x = u ? p + " " + x + " " + y : g ? "\\" + g + "l" + p + " " + x + " \\" + g + "r" + y : "\\left" + p + " " + x + " \\right" + y, e.Push(new o.default(x, e.stack.env, e.configuration).mml());
			return;
		}
		i && (p = n, y = r), e.i++, e.Push(e.itemFactory.create("auto open").setProperties({
			open: p,
			close: y,
			big: g
		}));
	}, m.Eval = function(e, t) {
		var n = e.GetStar(), r = e.GetNext();
		if (r === "{") {
			var i = e.GetArgument(t), a = "\\left. " + (n ? "\\smash{" + i + "}" : i) + " \\vphantom{\\int}\\right|";
			e.string = e.string.slice(0, e.i) + a + e.string.slice(e.i);
			return;
		}
		if (r === "(" || r === "[") {
			e.i++, e.Push(e.itemFactory.create("auto open").setProperties({
				open: r,
				close: "|",
				smash: n,
				right: "\\vphantom{\\int}"
			}));
			return;
		}
		throw new c.default("MissingArgFor", "Missing argument for %1", e.currentCS);
	}, m.Commutator = function(e, t, n, r) {
		n === void 0 && (n = "["), r === void 0 && (r = "]");
		var i = e.GetStar(), a = e.GetNext(), s = null;
		if (a === "\\") {
			if (e.i++, s = e.GetCS(), !s.match(v)) throw new c.default("MissingArgFor", "Missing argument for %1", e.currentCS);
			a = e.GetNext();
		}
		if (a !== "{") throw new c.default("MissingArgFor", "Missing argument for %1", e.currentCS);
		var l = e.GetArgument(t), u = e.GetArgument(t), d = l + "," + u;
		d = i ? n + " " + d + " " + r : s ? "\\" + s + "l" + n + " " + d + " \\" + s + "r" + r : "\\left" + n + " " + d + " \\right" + r, e.Push(new o.default(d, e.stack.env, e.configuration).mml());
	};
	var y = [65, 90], b = [97, 122], S = [913, 937], C = [945, 969], w = [48, 57];
	function T(e, t) {
		return e >= t[0] && e <= t[1];
	}
	function E(e, t, n, r) {
		var i = e.configuration.parser, a = p.NodeFactory.createToken(e, t, n, r), o = r.codePointAt(0);
		return r.length === 1 && !i.stack.env.font && i.stack.env.vectorFont && (T(o, y) || T(o, b) || T(o, S) || T(o, w) || T(o, C) && i.stack.env.vectorStar || f.default.getAttribute(a, "accent")) && f.default.setAttribute(a, "mathvariant", i.stack.env.vectorFont), a;
	}
	m.VectorBold = function(e, t) {
		var n = e.GetStar(), r = e.GetArgument(t), i = e.configuration.nodeFactory.get("token"), a = e.stack.env.font;
		delete e.stack.env.font, e.configuration.nodeFactory.set("token", E), e.stack.env.vectorFont = n ? "bold-italic" : "bold", e.stack.env.vectorStar = n;
		var s = new o.default(r, e.stack.env, e.configuration).mml();
		a && (e.stack.env.font = a), delete e.stack.env.vectorFont, delete e.stack.env.vectorStar, e.configuration.nodeFactory.set("token", i), e.Push(s);
	}, m.StarMacro = function(e, t, n) {
		var r = [...arguments].slice(3), i = e.GetStar(), a = [];
		if (n) for (var o = a.length; o < n; o++) a.push(e.GetArgument(t));
		var s = r.join(i ? "*" : "");
		s = d.default.substituteArgs(e, a, s), e.string = d.default.addArgs(e, s, e.string.slice(e.i)), e.i = 0, d.default.checkMaxMacros(e);
	};
	var D = function(e, t, n, r, i) {
		var a = new o.default(r, e.stack.env, e.configuration).mml();
		e.Push(e.itemFactory.create(t, a));
		var s = e.GetNext(), c = h[s];
		if (c) {
			var l = "", u = "", d = "", f = i.indexOf(s) !== -1;
			if (s === "{") {
				d = e.GetArgument(n), l = f ? "\\left\\{" : "", u = f ? "\\right\\}" : "", e.string = l + " " + d + " " + u + e.string.slice(e.i), e.i = 0;
				return;
			}
			f && (e.i++, e.Push(e.itemFactory.create("auto open").setProperties({
				open: s,
				close: c
			})));
		}
	};
	m.OperatorApplication = function(e, t, n) {
		D(e, "fn", t, n, [...arguments].slice(3));
	}, m.VectorOperator = function(e, t, n) {
		D(e, "mml", t, n, [...arguments].slice(3));
	}, m.Expression = function(e, t, n, r) {
		n === void 0 && (n = !0), r === void 0 && (r = ""), r ||= t.slice(1);
		var i = n ? e.GetBrackets(t) : null, a = e.create("token", "mi", { texClass: l.TEXCLASS.OP }, r);
		if (i) {
			var s = new o.default(i, e.stack.env, e.configuration).mml();
			a = e.create("node", "msup", [a, s]);
		}
		e.Push(e.itemFactory.create("fn", a)), e.GetNext() === "(" && (e.i++, e.Push(e.itemFactory.create("auto open").setProperties({
			open: "(",
			close: ")"
		})));
	}, m.Qqtext = function(e, t, n) {
		var r = e.GetStar(), i = n || e.GetArgument(t), a = (r ? "" : "\\quad") + "\\text{" + i + "}\\quad ";
		e.string = e.string.slice(0, e.i) + a + e.string.slice(e.i);
	}, m.Differential = function(e, t, n) {
		var r = e.GetBrackets(t), i = r == null ? " " : "^{" + r + "}", a = e.GetNext() === "(", s = e.GetNext() === "{", c = n + i;
		if (!(a || s)) {
			c += e.GetArgument(t, !0) || "";
			var u = new o.default(c, e.stack.env, e.configuration).mml();
			e.Push(u);
			return;
		}
		if (s) {
			c += e.GetArgument(t);
			var u = new o.default(c, e.stack.env, e.configuration).mml();
			e.Push(e.create("node", "TeXAtom", [u], { texClass: l.TEXCLASS.OP }));
			return;
		}
		e.Push(new o.default(c, e.stack.env, e.configuration).mml()), e.i++, e.Push(e.itemFactory.create("auto open").setProperties({
			open: "(",
			close: ")"
		}));
	}, m.Derivative = function(e, t, n, r) {
		var i = e.GetStar(), a = e.GetBrackets(t), s = 1, c = [];
		for (c.push(e.GetArgument(t)); e.GetNext() === "{" && s < n;) c.push(e.GetArgument(t)), s++;
		var l = !1, u = " ", d = " ";
		n > 2 && c.length > 2 ? (u = "^{" + (c.length - 1) + "}", l = !0) : a != null && (n > 2 && c.length > 1 && (l = !0), u = "^{" + a + "}", d = u);
		for (var f = i ? "\\flatfrac" : "\\frac", p = c.length > 1 ? c[0] : "", m = c.length > 1 ? c[1] : c[0], h = "", g = 2, _ = void 0; _ = c[g]; g++) h += r + " " + _;
		var v = f + "{" + r + u + p + "}{" + r + " " + m + d + " " + h + "}";
		e.Push(new o.default(v, e.stack.env, e.configuration).mml()), e.GetNext() === "(" && (e.i++, e.Push(e.itemFactory.create("auto open").setProperties({
			open: "(",
			close: ")",
			ignore: l
		})));
	}, m.Bra = function(e, t) {
		var n = e.GetStar(), r = e.GetArgument(t), i = "", a = !1, s = !1;
		if (e.GetNext() === "\\") {
			var c = e.i;
			e.i++;
			var l = e.GetCS(), u = e.lookup("macro", l);
			u && u.symbol === "ket" ? (a = !0, c = e.i, s = e.GetStar(), e.GetNext() === "{" ? i = e.GetArgument(l, !0) : (e.i = c, s = !1)) : e.i = c;
		}
		var d = "";
		d = a ? n || s ? `\\langle{${r}}\\vert{${i}}\\rangle` : `\\left\\langle{${r}}\\middle\\vert{${i}}\\right\\rangle` : n || s ? `\\langle{${r}}\\vert` : `\\left\\langle{${r}}\\right\\vert{${i}}`, e.Push(new o.default(d, e.stack.env, e.configuration).mml());
	}, m.Ket = function(e, t) {
		var n = e.GetStar(), r = e.GetArgument(t), i = n ? `\\vert{${r}}\\rangle` : `\\left\\vert{${r}}\\right\\rangle`;
		e.Push(new o.default(i, e.stack.env, e.configuration).mml());
	}, m.BraKet = function(e, t) {
		var n = e.GetStar(), r = e.GetArgument(t), i = null;
		e.GetNext() === "{" && (i = e.GetArgument(t, !0));
		var a = "";
		a = i == null ? n ? `\\langle{${r}}\\vert{${r}}\\rangle` : `\\left\\langle{${r}}\\middle\\vert{${r}}\\right\\rangle` : n ? `\\langle{${r}}\\vert{${i}}\\rangle` : `\\left\\langle{${r}}\\middle\\vert{${i}}\\right\\rangle`, e.Push(new o.default(a, e.stack.env, e.configuration).mml());
	}, m.KetBra = function(e, t) {
		var n = e.GetStar(), r = e.GetArgument(t), i = null;
		e.GetNext() === "{" && (i = e.GetArgument(t, !0));
		var a = "";
		a = i == null ? n ? `\\vert{${r}}\\rangle\\!\\langle{${r}}\\vert` : `\\left\\vert{${r}}\\middle\\rangle\\!\\middle\\langle{${r}}\\right\\vert` : n ? `\\vert{${r}}\\rangle\\!\\langle{${i}}\\vert` : `\\left\\vert{${r}}\\middle\\rangle\\!\\middle\\langle{${i}}\\right\\vert`, e.Push(new o.default(a, e.stack.env, e.configuration).mml());
	};
	function O(e, n, r) {
		var i = t(e, 3), a = i[0], o = i[1], s = i[2];
		return n && r ? `\\left\\langle{${a}}\\middle\\vert{${o}}\\middle\\vert{${s}}\\right\\rangle` : n ? `\\langle{${a}}\\vert{${o}}\\vert{${s}}\\rangle` : `\\left\\langle{${a}}\\right\\vert{${o}}\\left\\vert{${s}}\\right\\rangle`;
	}
	m.Expectation = function(e, t) {
		var n = e.GetStar(), r = n && e.GetStar(), i = e.GetArgument(t), a = null;
		e.GetNext() === "{" && (a = e.GetArgument(t, !0));
		var s = i && a ? O([
			a,
			i,
			a
		], n, r) : n ? `\\langle {${i}} \\rangle` : `\\left\\langle {${i}} \\right\\rangle`;
		e.Push(new o.default(s, e.stack.env, e.configuration).mml());
	}, m.MatrixElement = function(e, t) {
		var n = e.GetStar(), r = n && e.GetStar(), i = O([
			e.GetArgument(t),
			e.GetArgument(t),
			e.GetArgument(t)
		], n, r);
		e.Push(new o.default(i, e.stack.env, e.configuration).mml());
	}, m.MatrixQuantity = function(e, t, n) {
		var r = e.GetStar(), i = e.GetNext(), a = n ? "smallmatrix" : "array", s = "", c = "", l = "";
		switch (i) {
			case "{":
				s = e.GetArgument(t);
				break;
			case "(":
				e.i++, c = r ? "\\lgroup" : "(", l = r ? "\\rgroup" : ")", s = e.GetUpTo(t, ")");
				break;
			case "[":
				e.i++, c = "[", l = "]", s = e.GetUpTo(t, "]");
				break;
			case "|":
				e.i++, c = "|", l = "|", s = e.GetUpTo(t, "|");
				break;
			default:
				c = "(", l = ")";
				break;
		}
		var u = (c ? "\\left" : "") + c + "\\begin{" + a + "}{} " + s + "\\end{" + a + "}" + (c ? "\\right" : "") + l;
		e.Push(new o.default(u, e.stack.env, e.configuration).mml());
	}, m.IdentityMatrix = function(e, t) {
		var n = e.GetArgument(t), r = parseInt(n, 10);
		if (isNaN(r)) throw new c.default("InvalidNumber", "Invalid number");
		if (r <= 1) {
			e.string = "1" + e.string.slice(e.i), e.i = 0;
			return;
		}
		for (var i = Array(r).fill("0"), a = [], o = 0; o < r; o++) {
			var s = i.slice();
			s[o] = "1", a.push(s.join(" & "));
		}
		e.string = a.join("\\\\ ") + e.string.slice(e.i), e.i = 0;
	}, m.XMatrix = function(e, t) {
		var n = e.GetStar(), r = e.GetArgument(t), i = e.GetArgument(t), a = e.GetArgument(t), o = parseInt(i, 10), s = parseInt(a, 10);
		if (isNaN(o) || isNaN(s) || s.toString() !== a || o.toString() !== i) throw new c.default("InvalidNumber", "Invalid number");
		if (o = o < 1 ? 1 : o, s = s < 1 ? 1 : s, !n) {
			var l = Array(s).fill(r).join(" & ");
			e.string = Array(o).fill(l).join("\\\\ ") + e.string.slice(e.i), e.i = 0;
			return;
		}
		var u = "";
		if (o === 1 && s === 1) u = r;
		else if (o === 1) {
			for (var l = [], d = 1; d <= s; d++) l.push(`${r}_{${d}}`);
			u = l.join(" & ");
		} else if (s === 1) {
			for (var l = [], d = 1; d <= o; d++) l.push(`${r}_{${d}}`);
			u = l.join("\\\\ ");
		} else {
			for (var f = [], d = 1; d <= o; d++) {
				for (var l = [], p = 1; p <= s; p++) l.push(`${r}_{{${d}}{${p}}}`);
				f.push(l.join(" & "));
			}
			u = f.join("\\\\ ");
		}
		e.string = u + e.string.slice(e.i), e.i = 0;
	}, m.PauliMatrix = function(e, t) {
		var n = e.GetArgument(t), r = n.slice(1);
		switch (n[0]) {
			case "0":
				r += " 1 & 0\\\\ 0 & 1";
				break;
			case "1":
			case "x":
				r += " 0 & 1\\\\ 1 & 0";
				break;
			case "2":
			case "y":
				r += " 0 & -i\\\\ i & 0";
				break;
			case "3":
			case "z":
				r += " 1 & 0\\\\ 0 & -1";
				break;
			default:
		}
		e.string = r + e.string.slice(e.i), e.i = 0;
	}, m.DiagonalMatrix = function(e, t, n) {
		if (e.GetNext() === "{") {
			var r = e.i;
			e.GetArgument(t);
			var i = e.i;
			e.i = r + 1;
			for (var a = [], o = "", s = e.i; s < i;) {
				try {
					o = e.GetUpTo(t, ",");
				} catch {
					e.i = i, a.push(e.string.slice(s, i - 1));
					break;
				}
				if (e.i >= i) {
					a.push(e.string.slice(s, i));
					break;
				}
				s = e.i, a.push(o);
			}
			e.string = k(a, n) + e.string.slice(i), e.i = 0;
		}
	};
	function k(e, t) {
		for (var n = e.length, r = [], i = 0; i < n; i++) r.push(Array(t ? n - i : i + 1).join("&") + "\\mqty{" + e[i] + "}");
		return r.join("\\\\ ");
	}
	m.AutoClose = function(e, t, n) {
		var r = e.create("token", "mo", { stretchy: !1 }, t), i = e.itemFactory.create("mml", r).setProperties({ autoclose: t });
		e.Push(i);
	}, m.Vnabla = function(e, t) {
		var n = e.options.physics.arrowdel ? "\\vec{\\gradientnabla}" : "{\\gradientnabla}";
		return e.Push(new o.default(n, e.stack.env, e.configuration).mml());
	}, m.DiffD = function(e, t) {
		var n = e.options.physics.italicdiff ? "d" : "{\\rm d}";
		return e.Push(new o.default(n, e.stack.env, e.configuration).mml());
	}, m.Macro = a.default.Macro, m.NamedFn = a.default.NamedFn, m.Array = a.default.Array, e.default = m;
})), Te = /* @__PURE__ */ e(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 });
	var n = h(), i = t(we()), a = d(), o = t(m()), s = r();
	new n.CommandMap("Physics-automatic-bracing-macros", {
		quantity: "Quantity",
		qty: "Quantity",
		pqty: [
			"Quantity",
			"(",
			")",
			!0
		],
		bqty: [
			"Quantity",
			"[",
			"]",
			!0
		],
		vqty: [
			"Quantity",
			"|",
			"|",
			!0
		],
		Bqty: [
			"Quantity",
			"\\{",
			"\\}",
			!0
		],
		absolutevalue: [
			"Quantity",
			"|",
			"|",
			!0
		],
		abs: [
			"Quantity",
			"|",
			"|",
			!0
		],
		norm: [
			"Quantity",
			"\\|",
			"\\|",
			!0
		],
		evaluated: "Eval",
		eval: "Eval",
		order: [
			"Quantity",
			"(",
			")",
			!0,
			"O",
			a.TexConstant.Variant.CALLIGRAPHIC
		],
		commutator: "Commutator",
		comm: "Commutator",
		anticommutator: [
			"Commutator",
			"\\{",
			"\\}"
		],
		acomm: [
			"Commutator",
			"\\{",
			"\\}"
		],
		poissonbracket: [
			"Commutator",
			"\\{",
			"\\}"
		],
		pb: [
			"Commutator",
			"\\{",
			"\\}"
		]
	}, i.default), new n.CharacterMap("Physics-vector-mo", o.default.mathchar0mo, {
		dotproduct: ["⋅", { mathvariant: a.TexConstant.Variant.BOLD }],
		vdot: ["⋅", { mathvariant: a.TexConstant.Variant.BOLD }],
		crossproduct: "×",
		cross: "×",
		cp: "×",
		gradientnabla: ["∇", { mathvariant: a.TexConstant.Variant.BOLD }]
	}), new n.CharacterMap("Physics-vector-mi", o.default.mathchar0mi, {
		real: ["ℜ", { mathvariant: a.TexConstant.Variant.NORMAL }],
		imaginary: ["ℑ", { mathvariant: a.TexConstant.Variant.NORMAL }]
	}), new n.CommandMap("Physics-vector-macros", {
		vnabla: "Vnabla",
		vectorbold: "VectorBold",
		vb: "VectorBold",
		vectorarrow: [
			"StarMacro",
			1,
			"\\vec{\\vb",
			"{#1}}"
		],
		va: [
			"StarMacro",
			1,
			"\\vec{\\vb",
			"{#1}}"
		],
		vectorunit: [
			"StarMacro",
			1,
			"\\hat{\\vb",
			"{#1}}"
		],
		vu: [
			"StarMacro",
			1,
			"\\hat{\\vb",
			"{#1}}"
		],
		gradient: [
			"OperatorApplication",
			"\\vnabla",
			"(",
			"["
		],
		grad: [
			"OperatorApplication",
			"\\vnabla",
			"(",
			"["
		],
		divergence: [
			"VectorOperator",
			"\\vnabla\\vdot",
			"(",
			"["
		],
		div: [
			"VectorOperator",
			"\\vnabla\\vdot",
			"(",
			"["
		],
		curl: [
			"VectorOperator",
			"\\vnabla\\crossproduct",
			"(",
			"["
		],
		laplacian: [
			"OperatorApplication",
			"\\nabla^2",
			"(",
			"["
		]
	}, i.default), new n.CommandMap("Physics-expressions-macros", {
		sin: "Expression",
		sinh: "Expression",
		arcsin: "Expression",
		asin: "Expression",
		cos: "Expression",
		cosh: "Expression",
		arccos: "Expression",
		acos: "Expression",
		tan: "Expression",
		tanh: "Expression",
		arctan: "Expression",
		atan: "Expression",
		csc: "Expression",
		csch: "Expression",
		arccsc: "Expression",
		acsc: "Expression",
		sec: "Expression",
		sech: "Expression",
		arcsec: "Expression",
		asec: "Expression",
		cot: "Expression",
		coth: "Expression",
		arccot: "Expression",
		acot: "Expression",
		exp: ["Expression", !1],
		log: "Expression",
		ln: "Expression",
		det: ["Expression", !1],
		Pr: ["Expression", !1],
		tr: ["Expression", !1],
		trace: [
			"Expression",
			!1,
			"tr"
		],
		Tr: ["Expression", !1],
		Trace: [
			"Expression",
			!1,
			"Tr"
		],
		rank: "NamedFn",
		erf: ["Expression", !1],
		Residue: ["Macro", "\\mathrm{Res}"],
		Res: [
			"OperatorApplication",
			"\\Residue",
			"(",
			"[",
			"{"
		],
		principalvalue: ["OperatorApplication", "{\\cal P}"],
		pv: ["OperatorApplication", "{\\cal P}"],
		PV: ["OperatorApplication", "{\\rm P.V.}"],
		Re: [
			"OperatorApplication",
			"\\mathrm{Re}",
			"{"
		],
		Im: [
			"OperatorApplication",
			"\\mathrm{Im}",
			"{"
		],
		sine: ["NamedFn", "sin"],
		hypsine: ["NamedFn", "sinh"],
		arcsine: ["NamedFn", "arcsin"],
		asine: ["NamedFn", "asin"],
		cosine: ["NamedFn", "cos"],
		hypcosine: ["NamedFn", "cosh"],
		arccosine: ["NamedFn", "arccos"],
		acosine: ["NamedFn", "acos"],
		tangent: ["NamedFn", "tan"],
		hyptangent: ["NamedFn", "tanh"],
		arctangent: ["NamedFn", "arctan"],
		atangent: ["NamedFn", "atan"],
		cosecant: ["NamedFn", "csc"],
		hypcosecant: ["NamedFn", "csch"],
		arccosecant: ["NamedFn", "arccsc"],
		acosecant: ["NamedFn", "acsc"],
		secant: ["NamedFn", "sec"],
		hypsecant: ["NamedFn", "sech"],
		arcsecant: ["NamedFn", "arcsec"],
		asecant: ["NamedFn", "asec"],
		cotangent: ["NamedFn", "cot"],
		hypcotangent: ["NamedFn", "coth"],
		arccotangent: ["NamedFn", "arccot"],
		acotangent: ["NamedFn", "acot"],
		exponential: ["NamedFn", "exp"],
		logarithm: ["NamedFn", "log"],
		naturallogarithm: ["NamedFn", "ln"],
		determinant: ["NamedFn", "det"],
		Probability: ["NamedFn", "Pr"]
	}, i.default), new n.CommandMap("Physics-quick-quad-macros", {
		qqtext: "Qqtext",
		qq: "Qqtext",
		qcomma: ["Macro", "\\qqtext*{,}"],
		qc: ["Macro", "\\qqtext*{,}"],
		qcc: ["Qqtext", "c.c."],
		qif: ["Qqtext", "if"],
		qthen: ["Qqtext", "then"],
		qelse: ["Qqtext", "else"],
		qotherwise: ["Qqtext", "otherwise"],
		qunless: ["Qqtext", "unless"],
		qgiven: ["Qqtext", "given"],
		qusing: ["Qqtext", "using"],
		qassume: ["Qqtext", "assume"],
		qsince: ["Qqtext", "since"],
		qlet: ["Qqtext", "let"],
		qfor: ["Qqtext", "for"],
		qall: ["Qqtext", "all"],
		qeven: ["Qqtext", "even"],
		qodd: ["Qqtext", "odd"],
		qinteger: ["Qqtext", "integer"],
		qand: ["Qqtext", "and"],
		qor: ["Qqtext", "or"],
		qas: ["Qqtext", "as"],
		qin: ["Qqtext", "in"]
	}, i.default), new n.CommandMap("Physics-derivative-macros", {
		diffd: "DiffD",
		flatfrac: [
			"Macro",
			"\\left.#1\\middle/#2\\right.",
			2
		],
		differential: ["Differential", "\\diffd"],
		dd: ["Differential", "\\diffd"],
		variation: ["Differential", "\\delta"],
		var: ["Differential", "\\delta"],
		derivative: [
			"Derivative",
			2,
			"\\diffd"
		],
		dv: [
			"Derivative",
			2,
			"\\diffd"
		],
		partialderivative: [
			"Derivative",
			3,
			"\\partial"
		],
		pderivative: [
			"Derivative",
			3,
			"\\partial"
		],
		pdv: [
			"Derivative",
			3,
			"\\partial"
		],
		functionalderivative: [
			"Derivative",
			2,
			"\\delta"
		],
		fderivative: [
			"Derivative",
			2,
			"\\delta"
		],
		fdv: [
			"Derivative",
			2,
			"\\delta"
		]
	}, i.default), new n.CommandMap("Physics-bra-ket-macros", {
		bra: "Bra",
		ket: "Ket",
		innerproduct: "BraKet",
		ip: "BraKet",
		braket: "BraKet",
		outerproduct: "KetBra",
		dyad: "KetBra",
		ketbra: "KetBra",
		op: "KetBra",
		expectationvalue: "Expectation",
		expval: "Expectation",
		ev: "Expectation",
		matrixelement: "MatrixElement",
		matrixel: "MatrixElement",
		mel: "MatrixElement"
	}, i.default), new n.CommandMap("Physics-matrix-macros", {
		matrixquantity: "MatrixQuantity",
		mqty: "MatrixQuantity",
		pmqty: [
			"Macro",
			"\\mqty(#1)",
			1
		],
		Pmqty: [
			"Macro",
			"\\mqty*(#1)",
			1
		],
		bmqty: [
			"Macro",
			"\\mqty[#1]",
			1
		],
		vmqty: [
			"Macro",
			"\\mqty|#1|",
			1
		],
		smallmatrixquantity: ["MatrixQuantity", !0],
		smqty: ["MatrixQuantity", !0],
		spmqty: [
			"Macro",
			"\\smqty(#1)",
			1
		],
		sPmqty: [
			"Macro",
			"\\smqty*(#1)",
			1
		],
		sbmqty: [
			"Macro",
			"\\smqty[#1]",
			1
		],
		svmqty: [
			"Macro",
			"\\smqty|#1|",
			1
		],
		matrixdeterminant: [
			"Macro",
			"\\vmqty{#1}",
			1
		],
		mdet: [
			"Macro",
			"\\vmqty{#1}",
			1
		],
		smdet: [
			"Macro",
			"\\svmqty{#1}",
			1
		],
		identitymatrix: "IdentityMatrix",
		imat: "IdentityMatrix",
		xmatrix: "XMatrix",
		xmat: "XMatrix",
		zeromatrix: [
			"Macro",
			"\\xmat{0}{#1}{#2}",
			2
		],
		zmat: [
			"Macro",
			"\\xmat{0}{#1}{#2}",
			2
		],
		paulimatrix: "PauliMatrix",
		pmat: "PauliMatrix",
		diagonalmatrix: "DiagonalMatrix",
		dmat: "DiagonalMatrix",
		antidiagonalmatrix: ["DiagonalMatrix", !0],
		admat: ["DiagonalMatrix", !0]
	}, i.default), new n.EnvironmentMap("Physics-aux-envs", o.default.environment, { smallmatrix: [
		"Array",
		null,
		null,
		null,
		"c",
		"0.333em",
		".2em",
		"S",
		1
	] }, i.default), new n.MacroMap("Physics-characters", {
		"|": ["AutoClose", s.TEXCLASS.ORD],
		")": "AutoClose",
		"]": "AutoClose"
	}, i.default);
})), Ee = /* @__PURE__ */ e(((e) => {
	var t;
	Object.defineProperty(e, "__esModule", { value: !0 }), e.PhysicsConfiguration = void 0;
	var n = o(), r = Ce();
	Te(), e.PhysicsConfiguration = n.Configuration.create("physics", {
		handler: {
			macro: [
				"Physics-automatic-bracing-macros",
				"Physics-vector-macros",
				"Physics-vector-mo",
				"Physics-vector-mi",
				"Physics-derivative-macros",
				"Physics-expressions-macros",
				"Physics-quick-quad-macros",
				"Physics-bra-ket-macros",
				"Physics-matrix-macros"
			],
			character: ["Physics-characters"],
			environment: ["Physics-aux-envs"]
		},
		items: (t = {}, t[r.AutoOpen.prototype.kind] = r.AutoOpen, t),
		options: { physics: {
			italicdiff: !1,
			arrowdel: !1
		} }
	});
})), De = /* @__PURE__ */ e(((e) => {
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
	}, r = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.SetOptionsConfiguration = e.SetOptionsUtil = void 0;
	var a = o(), s = h(), c = r(i()), l = r(u()), d = v(), f = r(_()), p = n();
	e.SetOptionsUtil = {
		filterPackage: function(e, t) {
			if (t !== "tex" && !a.ConfigurationHandler.get(t)) throw new c.default("NotAPackage", "Not a defined package: %1", t);
			var n = e.options.setoptions, r = n.allowOptions[t];
			if (r === void 0 && !n.allowPackageDefault || r === !1) throw new c.default("PackageNotSettable", "Options can't be set for package \"%1\"", t);
			return !0;
		},
		filterOption: function(e, t, n) {
			var r = e.options.setoptions, i = r.allowOptions[t] || {}, a = i.hasOwnProperty(n) && !(0, p.isObject)(i[n]) ? i[n] : null;
			if (a === !1 || a === null && !r.allowOptionsDefault) throw new c.default("OptionNotSettable", "Option \"%1\" is not allowed to be set", n);
			if (!(t === "tex" ? e.options : e.options[t])?.hasOwnProperty(n)) throw t === "tex" ? new c.default("InvalidTexOption", "Invalid TeX option \"%1\"", n) : new c.default("InvalidOptionKey", "Invalid option \"%1\" for package \"%2\"", n, t);
			return !0;
		},
		filterValue: function(e, t, n, r) {
			return r;
		}
	};
	var m = new s.CommandMap("setoptions", { setOptions: "SetOptions" }, { SetOptions: function(e, n) {
		var r, i, a = e.GetBrackets(n) || "tex", o = l.default.keyvalOptions(e.GetArgument(n)), s = e.options.setoptions;
		if (s.filterPackage(e, a)) try {
			for (var c = t(Object.keys(o)), u = c.next(); !u.done; u = c.next()) {
				var d = u.value;
				s.filterOption(e, a, d) && ((a === "tex" ? e.options : e.options[a])[d] = s.filterValue(e, a, d, o[d]));
			}
		} catch (e) {
			r = { error: e };
		} finally {
			try {
				u && !u.done && (i = c.return) && i.call(c);
			} finally {
				if (r) throw r.error;
			}
		}
	} });
	function g(e, t) {
		var n = t.parseOptions.handlers.get("macro").lookup("require");
		n && (m.add("Require", new d.Macro("Require", n._func)), m.add("require", new d.Macro("require", f.default.Macro, [
			"\\Require{#2}\\setOptions[#2]{#1}",
			2,
			""
		])));
	}
	e.SetOptionsConfiguration = a.Configuration.create("setoptions", {
		handler: { macro: ["setoptions"] },
		config: g,
		priority: 3,
		options: { setoptions: {
			filterPackage: e.SetOptionsUtil.filterPackage,
			filterOption: e.SetOptionsUtil.filterOption,
			filterValue: e.SetOptionsUtil.filterValue,
			allowPackageDefault: !0,
			allowOptionsDefault: !0,
			allowOptions: (0, p.expandable)({
				tex: {
					FindTeX: !1,
					formatError: !1,
					package: !1,
					baseURL: !1,
					tags: !1,
					maxBuffer: !1,
					maxMaxros: !1,
					macros: !1,
					environments: !1
				},
				setoptions: !1,
				autoload: !1,
				require: !1,
				configmacros: !1,
				tagformat: !1
			})
		} }
	});
})), Oe = /* @__PURE__ */ e(((e) => {
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
	})();
	Object.defineProperty(e, "__esModule", { value: !0 }), e.TagFormatConfiguration = e.tagformatConfig = void 0;
	var n = o(), r = f(), i = 0;
	function a(e, n) {
		var a = n.parseOptions.options.tags;
		a !== "base" && e.tags.hasOwnProperty(a) && r.TagsFactory.add(a, e.tags[a]);
		var o = function(e) {
			t(r, e);
			function r() {
				return e !== null && e.apply(this, arguments) || this;
			}
			return r.prototype.formatNumber = function(e) {
				return n.parseOptions.options.tagformat.number(e);
			}, r.prototype.formatTag = function(e) {
				return n.parseOptions.options.tagformat.tag(e);
			}, r.prototype.formatId = function(e) {
				return n.parseOptions.options.tagformat.id(e);
			}, r.prototype.formatUrl = function(e, t) {
				return n.parseOptions.options.tagformat.url(e, t);
			}, r;
		}(r.TagsFactory.create(n.parseOptions.options.tags).constructor);
		i++;
		var s = "configTags-" + i;
		r.TagsFactory.add(s, o), n.parseOptions.options.tags = s;
	}
	e.tagformatConfig = a, e.TagFormatConfiguration = n.Configuration.create("tagformat", {
		config: [a, 10],
		options: { tagformat: {
			number: function(e) {
				return e.toString();
			},
			tag: function(e) {
				return "(" + e + ")";
			},
			id: function(e) {
				return "mjx-eqn:" + e.replace(/\s/g, "_");
			},
			url: function(e, t) {
				return t + "#" + encodeURIComponent(e);
			}
		} }
	});
})), Z = /* @__PURE__ */ e(((e) => {
	var n = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.TextMacrosMethods = void 0;
	var r = n(g()), i = t(), a = n(_());
	e.TextMacrosMethods = {
		Comment: function(e, t) {
			for (; e.i < e.string.length && e.string.charAt(e.i) !== "\n";) e.i++;
			e.i++;
		},
		Math: function(e, t) {
			e.saveText();
			for (var n = e.i, i, a, o = 0; a = e.GetNext();) switch (i = e.i++, a) {
				case "\\": e.GetCS() === ")" && (a = "\\(");
				case "$":
					if (o === 0 && t === a) {
						var s = e.texParser.configuration, c = new r.default(e.string.substr(n, i - n), e.stack.env, s).mml();
						e.PushMath(c);
						return;
					}
					break;
				case "{":
					o++;
					break;
				case "}":
					o === 0 && e.Error("ExtraCloseMissingOpen", "Extra close brace or missing open brace"), o--;
					break;
			}
			e.Error("MathNotTerminated", "Math-mode is not properly terminated");
		},
		MathModeOnly: function(e, t) {
			e.Error("MathModeOnly", "'%1' allowed only in math mode", t);
		},
		Misplaced: function(e, t) {
			e.Error("Misplaced", "'%1' can not be used here", t);
		},
		OpenBrace: function(e, t) {
			var n = e.stack.env;
			e.envStack.push(n), e.stack.env = Object.assign({}, n);
		},
		CloseBrace: function(e, t) {
			e.envStack.length ? (e.saveText(), e.stack.env = e.envStack.pop()) : e.Error("ExtraCloseMissingOpen", "Extra close brace or missing open brace");
		},
		OpenQuote: function(e, t) {
			e.string.charAt(e.i) === t ? (e.text += "“", e.i++) : e.text += "‘";
		},
		CloseQuote: function(e, t) {
			e.string.charAt(e.i) === t ? (e.text += "”", e.i++) : e.text += "’";
		},
		Tilde: function(e, t) {
			e.text += "\xA0";
		},
		Space: function(e, t) {
			for (e.text += " "; e.GetNext().match(/\s/);) e.i++;
		},
		SelfQuote: function(e, t) {
			e.text += t.substr(1);
		},
		Insert: function(e, t, n) {
			e.text += n;
		},
		Accent: function(e, t, n) {
			var r = e.ParseArg(t), i = e.create("token", "mo", {}, n);
			e.addAttributes(i), e.Push(e.create("node", "mover", [r, i]));
		},
		Emph: function(e, t) {
			var n = e.stack.env.mathvariant === "-tex-mathit" ? "normal" : "-tex-mathit";
			e.Push(e.ParseTextArg(t, { mathvariant: n }));
		},
		SetFont: function(e, t, n) {
			e.saveText(), e.stack.env.mathvariant = n;
		},
		SetSize: function(e, t, n) {
			e.saveText(), e.stack.env.mathsize = n;
		},
		CheckAutoload: function(e, t) {
			var n = e.configuration.packageData.get("autoload"), r = e.texParser;
			t = t.slice(1);
			var a = r.lookup("macro", t);
			if (!a || n && a._func === n.Autoload) {
				if (r.parse("macro", [r, t]), !a) return;
				(0, i.retryAfter)(Promise.resolve());
			}
			r.parse("macro", [e, t]);
		},
		Macro: a.default.Macro,
		Spacer: a.default.Spacer,
		Hskip: a.default.Hskip,
		rule: a.default.rule,
		Rule: a.default.Rule,
		HandleRef: a.default.HandleRef
	};
})), Q = /* @__PURE__ */ e(((e) => {
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
	}, o = e && e.__read || function(e, t) {
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
	}, s = e && e.__spreadArray || function(e, t, n) {
		if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++) (a || !(r in t)) && (a ||= Array.prototype.slice.call(t, 0, r), a[r] = t[r]);
		return e.concat(a || Array.prototype.slice.call(t));
	}, c = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.TextParser = void 0;
	var l = c(g()), d = c(i()), f = c(u()), p = r(), m = c(x()), h = a();
	e.TextParser = function(e) {
		t(r, e);
		function r(t, n, r, i) {
			var a = e.call(this, t, n, r) || this;
			return a.level = i, a;
		}
		return Object.defineProperty(r.prototype, "texParser", {
			get: function() {
				return this.configuration.packageData.get("textmacros").texParser;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "tags", {
			get: function() {
				return this.texParser.tags;
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.mml = function() {
			return this.level == null ? this.nodes.length === 1 ? this.nodes[0] : this.create("node", "mrow", this.nodes) : this.create("node", "mstyle", this.nodes, {
				displaystyle: !1,
				scriptlevel: this.level
			});
		}, r.prototype.Parse = function() {
			this.text = "", this.nodes = [], this.envStack = [], e.prototype.Parse.call(this);
		}, r.prototype.saveText = function() {
			if (this.text) {
				var e = this.stack.env.mathvariant, t = f.default.internalText(this, this.text, e ? { mathvariant: e } : {});
				this.text = "", this.Push(t);
			}
		}, r.prototype.Push = function(t) {
			if (this.text && this.saveText(), t instanceof h.StopItem) return e.prototype.Push.call(this, t);
			if (t instanceof h.StyleItem) {
				this.stack.env.mathcolor = this.stack.env.color;
				return;
			}
			t instanceof p.AbstractMmlNode && (this.addAttributes(t), this.nodes.push(t));
		}, r.prototype.PushMath = function(e) {
			var t, r, i = this.stack.env;
			e.isKind("TeXAtom") || (e = this.create("node", "TeXAtom", [e]));
			try {
				for (var a = n(["mathsize", "mathcolor"]), o = a.next(); !o.done; o = a.next()) {
					var s = o.value;
					i[s] && !e.attributes.getExplicit(s) && (!e.isToken && !e.isKind("mstyle") && (e = this.create("node", "mstyle", [e])), m.default.setAttribute(e, s, i[s]));
				}
			} catch (e) {
				t = { error: e };
			} finally {
				try {
					o && !o.done && (r = a.return) && r.call(a);
				} finally {
					if (t) throw t.error;
				}
			}
			e.isInferred && (e = this.create("node", "mrow", e.childNodes)), this.nodes.push(e);
		}, r.prototype.addAttributes = function(e) {
			var t, r, i = this.stack.env;
			if (e.isToken) try {
				for (var a = n([
					"mathsize",
					"mathcolor",
					"mathvariant"
				]), o = a.next(); !o.done; o = a.next()) {
					var s = o.value;
					i[s] && !e.attributes.getExplicit(s) && m.default.setAttribute(e, s, i[s]);
				}
			} catch (e) {
				t = { error: e };
			} finally {
				try {
					o && !o.done && (r = a.return) && r.call(a);
				} finally {
					if (t) throw t.error;
				}
			}
		}, r.prototype.ParseTextArg = function(e, t) {
			var n = this.GetArgument(e);
			return t = Object.assign(Object.assign({}, this.stack.env), t), new r(n, t, this.configuration).mml();
		}, r.prototype.ParseArg = function(e) {
			return new r(this.GetArgument(e), this.stack.env, this.configuration).mml();
		}, r.prototype.Error = function(e, t) {
			var n = [...arguments].slice(2);
			throw new (d.default.bind.apply(d.default, s([
				void 0,
				e,
				t
			], o(n), !1)))();
		}, r;
	}(l.default);
})), ke = /* @__PURE__ */ e(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 });
	var n = h(), r = d(), i = Z(), a = t(u()), o = Q();
	new n.CommandMap("textcomp-macros", {
		textasciicircum: ["Insert", "^"],
		textasciitilde: ["Insert", "~"],
		textasteriskcentered: ["Insert", "*"],
		textbackslash: ["Insert", "\\"],
		textbar: ["Insert", "|"],
		textbraceleft: ["Insert", "{"],
		textbraceright: ["Insert", "}"],
		textbullet: ["Insert", "•"],
		textdagger: ["Insert", "†"],
		textdaggerdbl: ["Insert", "‡"],
		textellipsis: ["Insert", "…"],
		textemdash: ["Insert", "—"],
		textendash: ["Insert", "–"],
		textexclamdown: ["Insert", "¡"],
		textgreater: ["Insert", ">"],
		textless: ["Insert", "<"],
		textordfeminine: ["Insert", "ª"],
		textordmasculine: ["Insert", "º"],
		textparagraph: ["Insert", "¶"],
		textperiodcentered: ["Insert", "·"],
		textquestiondown: ["Insert", "¿"],
		textquotedblleft: ["Insert", "“"],
		textquotedblright: ["Insert", "”"],
		textquoteleft: ["Insert", "‘"],
		textquoteright: ["Insert", "’"],
		textsection: ["Insert", "§"],
		textunderscore: ["Insert", "_"],
		textvisiblespace: ["Insert", "␣"],
		textacutedbl: ["Insert", "˝"],
		textasciiacute: ["Insert", "´"],
		textasciibreve: ["Insert", "˘"],
		textasciicaron: ["Insert", "ˇ"],
		textasciidieresis: ["Insert", "¨"],
		textasciimacron: ["Insert", "¯"],
		textgravedbl: ["Insert", "˵"],
		texttildelow: ["Insert", "˷"],
		textbaht: ["Insert", "฿"],
		textcent: ["Insert", "¢"],
		textcolonmonetary: ["Insert", "₡"],
		textcurrency: ["Insert", "¤"],
		textdollar: ["Insert", "$"],
		textdong: ["Insert", "₫"],
		texteuro: ["Insert", "€"],
		textflorin: ["Insert", "ƒ"],
		textguarani: ["Insert", "₲"],
		textlira: ["Insert", "₤"],
		textnaira: ["Insert", "₦"],
		textpeso: ["Insert", "₱"],
		textsterling: ["Insert", "£"],
		textwon: ["Insert", "₩"],
		textyen: ["Insert", "¥"],
		textcircledP: ["Insert", "℗"],
		textcompwordmark: ["Insert", "‌"],
		textcopyleft: ["Insert", "🄯"],
		textcopyright: ["Insert", "©"],
		textregistered: ["Insert", "®"],
		textservicemark: ["Insert", "℠"],
		texttrademark: ["Insert", "™"],
		textbardbl: ["Insert", "‖"],
		textbigcircle: ["Insert", "◯"],
		textblank: ["Insert", "␢"],
		textbrokenbar: ["Insert", "¦"],
		textdiscount: ["Insert", "⁒"],
		textestimated: ["Insert", "℮"],
		textinterrobang: ["Insert", "‽"],
		textinterrobangdown: ["Insert", "⸘"],
		textmusicalnote: ["Insert", "♪"],
		textnumero: ["Insert", "№"],
		textopenbullet: ["Insert", "◦"],
		textpertenthousand: ["Insert", "‱"],
		textperthousand: ["Insert", "‰"],
		textrecipe: ["Insert", "℞"],
		textreferencemark: ["Insert", "※"],
		textlangle: ["Insert", "〈"],
		textrangle: ["Insert", "〉"],
		textlbrackdbl: ["Insert", "⟦"],
		textrbrackdbl: ["Insert", "⟧"],
		textlquill: ["Insert", "⁅"],
		textrquill: ["Insert", "⁆"],
		textcelsius: ["Insert", "℃"],
		textdegree: ["Insert", "°"],
		textdiv: ["Insert", "÷"],
		textdownarrow: ["Insert", "↓"],
		textfractionsolidus: ["Insert", "⁄"],
		textleftarrow: ["Insert", "←"],
		textlnot: ["Insert", "¬"],
		textmho: ["Insert", "℧"],
		textminus: ["Insert", "−"],
		textmu: ["Insert", "µ"],
		textohm: ["Insert", "Ω"],
		textonehalf: ["Insert", "½"],
		textonequarter: ["Insert", "¼"],
		textonesuperior: ["Insert", "¹"],
		textpm: ["Insert", "±"],
		textrightarrow: ["Insert", "→"],
		textsurd: ["Insert", "√"],
		textthreequarters: ["Insert", "¾"],
		textthreesuperior: ["Insert", "³"],
		texttimes: ["Insert", "×"],
		texttwosuperior: ["Insert", "²"],
		textuparrow: ["Insert", "↑"],
		textborn: ["Insert", "*"],
		textdied: ["Insert", "†"],
		textdivorced: ["Insert", "⚮"],
		textmarried: ["Insert", "⚭"],
		textcentoldstyle: [
			"Insert",
			"¢",
			r.TexConstant.Variant.OLDSTYLE
		],
		textdollaroldstyle: [
			"Insert",
			"$",
			r.TexConstant.Variant.OLDSTYLE
		],
		textzerooldstyle: [
			"Insert",
			"0",
			r.TexConstant.Variant.OLDSTYLE
		],
		textoneoldstyle: [
			"Insert",
			"1",
			r.TexConstant.Variant.OLDSTYLE
		],
		texttwooldstyle: [
			"Insert",
			"2",
			r.TexConstant.Variant.OLDSTYLE
		],
		textthreeoldstyle: [
			"Insert",
			"3",
			r.TexConstant.Variant.OLDSTYLE
		],
		textfouroldstyle: [
			"Insert",
			"4",
			r.TexConstant.Variant.OLDSTYLE
		],
		textfiveoldstyle: [
			"Insert",
			"5",
			r.TexConstant.Variant.OLDSTYLE
		],
		textsixoldstyle: [
			"Insert",
			"6",
			r.TexConstant.Variant.OLDSTYLE
		],
		textsevenoldstyle: [
			"Insert",
			"7",
			r.TexConstant.Variant.OLDSTYLE
		],
		texteightoldstyle: [
			"Insert",
			"8",
			r.TexConstant.Variant.OLDSTYLE
		],
		textnineoldstyle: [
			"Insert",
			"9",
			r.TexConstant.Variant.OLDSTYLE
		]
	}, { Insert: function(e, t, n, r) {
		if (e instanceof o.TextParser) {
			if (!r) {
				i.TextMacrosMethods.Insert(e, t, n);
				return;
			}
			e.saveText();
		}
		e.Push(a.default.internalText(e, n, r ? { mathvariant: r } : {}));
	} });
})), Ae = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.TextcompConfiguration = void 0;
	var t = o();
	ke(), e.TextcompConfiguration = t.Configuration.create("textcomp", { handler: { macro: ["textcomp-macros"] } });
})), $ = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 });
	var t = h(), n = d(), r = Z(), i = S();
	new t.MacroMap("text-special", {
		$: "Math",
		"%": "Comment",
		"^": "MathModeOnly",
		_: "MathModeOnly",
		"&": "Misplaced",
		"#": "Misplaced",
		"~": "Tilde",
		" ": "Space",
		"	": "Space",
		"\r": "Space",
		"\n": "Space",
		"\xA0": "Tilde",
		"{": "OpenBrace",
		"}": "CloseBrace",
		"`": "OpenQuote",
		"'": "CloseQuote"
	}, r.TextMacrosMethods), new t.CommandMap("text-macros", {
		"(": "Math",
		$: "SelfQuote",
		_: "SelfQuote",
		"%": "SelfQuote",
		"{": "SelfQuote",
		"}": "SelfQuote",
		" ": "SelfQuote",
		"&": "SelfQuote",
		"#": "SelfQuote",
		"\\": "SelfQuote",
		"'": ["Accent", "´"],
		"’": ["Accent", "´"],
		"`": ["Accent", "`"],
		"‘": ["Accent", "`"],
		"^": ["Accent", "^"],
		"\"": ["Accent", "¨"],
		"~": ["Accent", "~"],
		"=": ["Accent", "¯"],
		".": ["Accent", "˙"],
		u: ["Accent", "˘"],
		v: ["Accent", "ˇ"],
		emph: "Emph",
		rm: ["SetFont", n.TexConstant.Variant.NORMAL],
		mit: ["SetFont", n.TexConstant.Variant.ITALIC],
		oldstyle: ["SetFont", n.TexConstant.Variant.OLDSTYLE],
		cal: ["SetFont", n.TexConstant.Variant.CALLIGRAPHIC],
		it: ["SetFont", "-tex-mathit"],
		bf: ["SetFont", n.TexConstant.Variant.BOLD],
		bbFont: ["SetFont", n.TexConstant.Variant.DOUBLESTRUCK],
		scr: ["SetFont", n.TexConstant.Variant.SCRIPT],
		frak: ["SetFont", n.TexConstant.Variant.FRAKTUR],
		sf: ["SetFont", n.TexConstant.Variant.SANSSERIF],
		tt: ["SetFont", n.TexConstant.Variant.MONOSPACE],
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
		Bbb: [
			"Macro",
			"{\\bbFont #1}",
			1
		],
		textnormal: [
			"Macro",
			"{\\rm #1}",
			1
		],
		textup: [
			"Macro",
			"{\\rm #1}",
			1
		],
		textrm: [
			"Macro",
			"{\\rm #1}",
			1
		],
		textit: [
			"Macro",
			"{\\it #1}",
			1
		],
		textbf: [
			"Macro",
			"{\\bf #1}",
			1
		],
		textsf: [
			"Macro",
			"{\\sf #1}",
			1
		],
		texttt: [
			"Macro",
			"{\\tt #1}",
			1
		],
		dagger: ["Insert", "†"],
		ddagger: ["Insert", "‡"],
		S: ["Insert", "§"],
		",": ["Spacer", i.MATHSPACE.thinmathspace],
		":": ["Spacer", i.MATHSPACE.mediummathspace],
		">": ["Spacer", i.MATHSPACE.mediummathspace],
		";": ["Spacer", i.MATHSPACE.thickmathspace],
		"!": ["Spacer", i.MATHSPACE.negativethinmathspace],
		enspace: ["Spacer", .5],
		quad: ["Spacer", 1],
		qquad: ["Spacer", 2],
		thinspace: ["Spacer", i.MATHSPACE.thinmathspace],
		negthinspace: ["Spacer", i.MATHSPACE.negativethinmathspace],
		hskip: "Hskip",
		hspace: "Hskip",
		kern: "Hskip",
		mskip: "Hskip",
		mspace: "Hskip",
		mkern: "Hskip",
		rule: "rule",
		Rule: ["Rule"],
		Space: ["Rule", "blank"],
		color: "CheckAutoload",
		textcolor: "CheckAutoload",
		colorbox: "CheckAutoload",
		fcolorbox: "CheckAutoload",
		href: "CheckAutoload",
		style: "CheckAutoload",
		class: "CheckAutoload",
		cssId: "CheckAutoload",
		unicode: "CheckAutoload",
		ref: ["HandleRef", !1],
		eqref: ["HandleRef", !0]
	}, r.TextMacrosMethods);
})), je = /* @__PURE__ */ e(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	}, n;
	Object.defineProperty(e, "__esModule", { value: !0 }), e.TextMacrosConfiguration = e.TextBaseConfiguration = void 0;
	var r = o(), i = t(b()), s = f(), c = a(), l = Q(), u = Z();
	$(), e.TextBaseConfiguration = r.Configuration.create("text-base", {
		parser: "text",
		handler: {
			character: ["command", "text-special"],
			macro: ["text-macros"]
		},
		fallback: {
			character: function(e, t) {
				e.text += t;
			},
			macro: function(e, t) {
				var n = e.texParser, r = n.lookup("macro", t);
				r && r._func !== u.TextMacrosMethods.Macro && e.Error("MathMacro", "%1 is only supported in math mode", "\\" + t), n.parse("macro", [e, t]);
			}
		},
		items: (n = {}, n[c.StartItem.prototype.kind] = c.StartItem, n[c.StopItem.prototype.kind] = c.StopItem, n[c.MmlItem.prototype.kind] = c.MmlItem, n[c.StyleItem.prototype.kind] = c.StyleItem, n)
	});
	function d(e, t, n, r) {
		var i = e.configuration.packageData.get("textmacros");
		return e instanceof l.TextParser || (i.texParser = e), [new l.TextParser(t, r ? { mathvariant: r } : {}, i.parseOptions, n).mml()];
	}
	e.TextMacrosConfiguration = r.Configuration.create("textmacros", {
		config: function(e, t) {
			var n = new r.ParserConfiguration(t.parseOptions.options.textmacros.packages, ["tex", "text"]);
			n.init();
			var a = new i.default(n, []);
			a.options = t.parseOptions.options, n.config(t), s.TagsFactory.addTags(n.tags), a.tags = s.TagsFactory.getDefault(), a.tags.configuration = a, a.packageData = t.parseOptions.packageData, a.packageData.set("textmacros", {
				parseOptions: a,
				jax: t,
				texParser: null
			}), a.options.internalMath = d;
		},
		preprocessors: [function(e) {
			var t = e.data.packageData.get("textmacros");
			t.parseOptions.nodeFactory.setMmlFactory(t.jax.mmlFactory);
		}],
		options: { textmacros: { packages: ["text-base"] } }
	});
})), Me = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.UpgreekConfiguration = void 0;
	var t = o(), n = h(), r = d();
	function i(e, t) {
		var n = t.attributes || {};
		n.mathvariant = r.TexConstant.Variant.NORMAL;
		var i = e.create("token", "mi", n, t.char);
		e.Push(i);
	}
	new n.CharacterMap("upgreek", i, {
		upalpha: "α",
		upbeta: "β",
		upgamma: "γ",
		updelta: "δ",
		upepsilon: "ϵ",
		upzeta: "ζ",
		upeta: "η",
		uptheta: "θ",
		upiota: "ι",
		upkappa: "κ",
		uplambda: "λ",
		upmu: "μ",
		upnu: "ν",
		upxi: "ξ",
		upomicron: "ο",
		uppi: "π",
		uprho: "ρ",
		upsigma: "σ",
		uptau: "τ",
		upupsilon: "υ",
		upphi: "ϕ",
		upchi: "χ",
		uppsi: "ψ",
		upomega: "ω",
		upvarepsilon: "ε",
		upvartheta: "ϑ",
		upvarpi: "ϖ",
		upvarrho: "ϱ",
		upvarsigma: "ς",
		upvarphi: "φ",
		Upgamma: "Γ",
		Updelta: "Δ",
		Uptheta: "Θ",
		Uplambda: "Λ",
		Upxi: "Ξ",
		Uppi: "Π",
		Upsigma: "Σ",
		Upupsilon: "Υ",
		Upphi: "Φ",
		Uppsi: "Ψ",
		Upomega: "Ω"
	}), e.UpgreekConfiguration = t.Configuration.create("upgreek", { handler: { macro: ["upgreek"] } });
})), Ne = /* @__PURE__ */ e(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.UnicodeConfiguration = e.UnicodeMethods = void 0;
	var n = o(), r = t(i()), a = h(), s = t(u()), c = t(x()), d = l();
	e.UnicodeMethods = {};
	var f = {};
	e.UnicodeMethods.Unicode = function(e, t) {
		var n = e.GetBrackets(t), i = null, a = null;
		n && (n.replace(/ /g, "").match(/^(\d+(\.\d*)?|\.\d+),(\d+(\.\d*)?|\.\d+)$/) ? (i = n.replace(/ /g, "").split(/,/), a = e.GetBrackets(t)) : a = n);
		var o = s.default.trimSpaces(e.GetArgument(t)).replace(/^0x/, "x");
		if (!o.match(/^(x[0-9A-Fa-f]+|[0-9]+)$/)) throw new r.default("BadUnicode", "Argument to \\unicode must be a number");
		var l = parseInt(o.match(/^x/) ? "0" + o : o);
		f[l] ? a ||= f[l][2] : f[l] = [
			800,
			200,
			a,
			l
		], i && (f[l][0] = Math.floor(parseFloat(i[0]) * 1e3), f[l][1] = Math.floor(parseFloat(i[1]) * 1e3));
		var u = e.stack.env.font, p = {};
		a ? (f[l][2] = p.fontfamily = a.replace(/'/g, "'"), u && (u.match(/bold/) && (p.fontweight = "bold"), u.match(/italic|-mathit/) && (p.fontstyle = "italic"))) : u && (p.mathvariant = u);
		var m = e.create("token", "mtext", p, (0, d.numeric)(o));
		c.default.setProperty(m, "unicode", !0), e.Push(m);
	}, new a.CommandMap("unicode", { unicode: "Unicode" }, e.UnicodeMethods), e.UnicodeConfiguration = n.Configuration.create("unicode", { handler: { macro: ["unicode"] } });
})), Pe = /* @__PURE__ */ e(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.VerbConfiguration = e.VerbMethods = void 0;
	var n = o(), r = d(), a = h(), s = t(i());
	e.VerbMethods = {}, e.VerbMethods.Verb = function(e, t) {
		var n = e.GetNext(), i = ++e.i;
		if (n === "") throw new s.default("MissingArgFor", "Missing argument for %1", t);
		for (; e.i < e.string.length && e.string.charAt(e.i) !== n;) e.i++;
		if (e.i === e.string.length) throw new s.default("NoClosingDelim", "Can't find closing delimiter for %1", e.currentCS);
		var a = e.string.slice(i, e.i).replace(/ /g, "\xA0");
		e.i++, e.Push(e.create("token", "mtext", { mathvariant: r.TexConstant.Variant.MONOSPACE }, a));
	}, new a.CommandMap("verb", { verb: "Verb" }, e.VerbMethods), e.VerbConfiguration = n.Configuration.create("verb", { handler: { macro: ["verb"] } });
})), Fe = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.AllPackages = void 0, y(), C(), D(), A(), j(), M(), te(), re(), ie(), ae(), oe(), V(), H(), U(), le(), ue(), R(), fe(), pe(), he(), X(), be(), q(), xe(), Se(), Ee(), De(), Oe(), Ae(), je(), Me(), Ne(), Pe(), typeof MathJax < "u" && MathJax.loader && MathJax.loader.preLoad("[tex]/action", "[tex]/ams", "[tex]/amscd", "[tex]/bbox", "[tex]/boldsymbol", "[tex]/braket", "[tex]/bussproofs", "[tex]/cancel", "[tex]/cases", "[tex]/centernot", "[tex]/color", "[tex]/colorv2", "[tex]/colortbl", "[tex]/empheq", "[tex]/enclose", "[tex]/extpfeil", "[tex]/gensymb", "[tex]/html", "[tex]/mathtools", "[tex]/mhchem", "[tex]/newcommand", "[tex]/noerrors", "[tex]/noundefined", "[tex]/physics", "[tex]/upgreek", "[tex]/unicode", "[tex]/verb", "[tex]/configmacros", "[tex]/tagformat", "[tex]/textcomp", "[tex]/textmacros", "[tex]/setoptions"), e.AllPackages = /* @__PURE__ */ "base.action.ams.amscd.bbox.boldsymbol.braket.bussproofs.cancel.cases.centernot.color.colortbl.empheq.enclose.extpfeil.gensymb.html.mathtools.mhchem.newcommand.noerrors.noundefined.upgreek.unicode.verb.configmacros.tagformat.textcomp.textmacros".split(".");
}));
//#endregion
export default Fe();
