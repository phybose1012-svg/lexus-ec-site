import { t as e } from "./index.js";
import { c as t, i as n, n as r } from "./mo-Dc4wDYuI.js";
import { t as i } from "./InputJax-CQediEQT.js";
import { t as a } from "./MathItem-CEq4TfS_.js";
import { _ as o, c as s, l as c, p as l, t as u, u as d, v as f } from "./BaseConfiguration-D6XxvD-h.js";
//#region node_modules/mathjax-full/js/core/FindMath.js
var p = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.AbstractFindMath = void 0;
	var n = t();
	e.AbstractFindMath = function() {
		function e(e) {
			var t = this.constructor;
			this.options = (0, n.userOptions)((0, n.defaultOptions)({}, t.OPTIONS), e);
		}
		return e.OPTIONS = {}, e;
	}();
})), m = /* @__PURE__ */ e(((e) => {
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
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.FindTeX = void 0;
	var i = p(), o = r(), s = a();
	e.FindTeX = function(e) {
		t(r, e);
		function r(t) {
			var n = e.call(this, t) || this;
			return n.getPatterns(), n;
		}
		return r.prototype.getPatterns = function() {
			var e = this, t = this.options, n = [], r = [], i = [];
			this.end = {}, this.env = this.sub = 0;
			var a = 1;
			t.inlineMath.forEach(function(t) {
				return e.addPattern(n, t, !1);
			}), t.displayMath.forEach(function(t) {
				return e.addPattern(n, t, !0);
			}), n.length && r.push(n.sort(o.sortLength).join("|")), t.processEnvironments && (r.push("\\\\begin\\s*\\{([^}]*)\\}"), this.env = a, a++), t.processEscapes && i.push("\\\\([\\\\$])"), t.processRefs && i.push("(\\\\(?:eq)?ref\\s*\\{[^}]*\\})"), i.length && (r.push("(" + i.join("|") + ")"), this.sub = a), this.start = new RegExp(r.join("|"), "g"), this.hasPatterns = r.length > 0;
		}, r.prototype.addPattern = function(e, t, r) {
			var i = n(t, 2), a = i[0], s = i[1];
			e.push((0, o.quotePattern)(a)), this.end[a] = [
				s,
				r,
				this.endPattern(s)
			];
		}, r.prototype.endPattern = function(e, t) {
			return RegExp((t || (0, o.quotePattern)(e)) + "|\\\\(?:[a-zA-Z]|.)|[{}]", "g");
		}, r.prototype.findEnd = function(e, t, r, i) {
			for (var a = n(i, 3), o = a[0], c = a[1], l = a[2], u = l.lastIndex = r.index + r[0].length, d, f = 0; d = l.exec(e);) if ((d[1] || d[0]) === o && f === 0) return (0, s.protoItem)(r[0], e.substr(u, d.index - u), d[0], t, r.index, d.index + d[0].length, c);
			else d[0] === "{" ? f++ : d[0] === "}" && f && f--;
			return null;
		}, r.prototype.findMathInString = function(e, t, n) {
			var r, i;
			for (this.start.lastIndex = 0; r = this.start.exec(n);) {
				if (r[this.env] !== void 0 && this.env) {
					var a = "\\\\end\\s*(\\{" + (0, o.quotePattern)(r[this.env]) + "\\})";
					i = this.findEnd(n, t, r, [
						"{" + r[this.env] + "}",
						!0,
						this.endPattern(null, a)
					]), i && (i.math = i.open + i.math + i.close, i.open = i.close = "");
				} else if (r[this.sub] !== void 0 && this.sub) {
					var c = r[this.sub], a = r.index + r[this.sub].length;
					i = c.length === 2 ? (0, s.protoItem)("", c.substr(1), "", t, r.index, a) : (0, s.protoItem)("", c, "", t, r.index, a, !1);
				} else i = this.findEnd(n, t, r, this.end[r[0]]);
				i && (e.push(i), this.start.lastIndex = i.end.n);
			}
		}, r.prototype.findMath = function(e) {
			var t = [];
			if (this.hasPatterns) for (var n = 0, r = e.length; n < r; n++) this.findMathInString(t, n, e[n]);
			return t;
		}, r.OPTIONS = {
			inlineMath: [["\\(", "\\)"]],
			displayMath: [["$$", "$$"], ["\\[", "\\]"]],
			processEscapes: !0,
			processEnvironments: !0,
			processRefs: !0
		}, r;
	}(i.AbstractFindMath);
})), h = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 });
	var i = n(), a = r(f()), o;
	(function(e) {
		e.cleanStretchy = function(e) {
			var n, r, i = e.data;
			try {
				for (var o = t(i.getList("fixStretchy")), s = o.next(); !s.done; s = o.next()) {
					var c = s.value;
					if (a.default.getProperty(c, "fixStretchy")) {
						var l = a.default.getForm(c);
						l && l[3] && l[3].stretchy && a.default.setAttribute(c, "stretchy", !1);
						var u = c.parent;
						if (!a.default.getTexClass(c) && (!l || !l[2])) {
							var d = i.nodeFactory.create("node", "TeXAtom", [c]);
							u.replaceChild(d, c), d.inheritAttributesFrom(c);
						}
						a.default.removeProperties(c, "fixStretchy");
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
		}, e.cleanAttributes = function(e) {
			e.data.root.walkTree(function(e, n) {
				var r, i, a = e.attributes;
				if (a) {
					var o = new Set((a.get("mjx-keep-attrs") || "").split(/ /));
					delete a.getAllAttributes()["mjx-keep-attrs"];
					try {
						for (var s = t(a.getExplicitNames()), c = s.next(); !c.done; c = s.next()) {
							var l = c.value;
							!o.has(l) && a.attributes[l] === e.attributes.getInherited(l) && delete a.attributes[l];
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
				}
			}, {});
		}, e.combineRelations = function(e) {
			var o, s, c, l, u = [];
			try {
				for (var d = t(e.data.getList("mo")), f = d.next(); !f.done; f = d.next()) {
					var p = f.value;
					if (!(p.getProperty("relationsCombined") || !p.parent || p.parent && !a.default.isType(p.parent, "mrow") || a.default.getTexClass(p) !== i.TEXCLASS.REL)) {
						for (var m = p.parent, h = void 0, g = m.childNodes, _ = g.indexOf(p) + 1, v = a.default.getProperty(p, "variantForm"); _ < g.length && (h = g[_]) && a.default.isType(h, "mo") && a.default.getTexClass(h) === i.TEXCLASS.REL;) if (v === a.default.getProperty(h, "variantForm") && r(p, h)) {
							a.default.appendChildren(p, a.default.getChildren(h)), n(["stretchy", "rspace"], p, h);
							try {
								for (var y = (c = void 0, t(h.getPropertyNames())), b = y.next(); !b.done; b = y.next()) {
									var x = b.value;
									p.setProperty(x, h.getProperty(x));
								}
							} catch (e) {
								c = { error: e };
							} finally {
								try {
									b && !b.done && (l = y.return) && l.call(y);
								} finally {
									if (c) throw c.error;
								}
							}
							g.splice(_, 1), u.push(h), h.parent = null, h.setProperty("relationsCombined", !0);
						} else {
							p.attributes.getExplicit("rspace") ?? a.default.setAttribute(p, "rspace", "0pt"), h.attributes.getExplicit("lspace") ?? a.default.setAttribute(h, "lspace", "0pt");
							break;
						}
						p.attributes.setInherited("form", p.getForms()[0]);
					}
				}
			} catch (e) {
				o = { error: e };
			} finally {
				try {
					f && !f.done && (s = d.return) && s.call(d);
				} finally {
					if (o) throw o.error;
				}
			}
			e.data.removeFromList("mo", u);
		};
		var n = function(e, t, n) {
			var r = t.attributes, i = n.attributes;
			e.forEach(function(e) {
				var t = i.getExplicit(e);
				t != null && r.set(e, t);
			});
		}, r = function(e, n) {
			var r, i, a = function(e, t) {
				return e.getExplicitNames().filter(function(n) {
					return n !== t && (n !== "stretchy" || e.getExplicit("stretchy"));
				});
			}, o = e.attributes, s = n.attributes, c = a(o, "lspace"), l = a(s, "rspace");
			if (c.length !== l.length) return !1;
			try {
				for (var u = t(c), d = u.next(); !d.done; d = u.next()) {
					var f = d.value;
					if (o.getExplicit(f) !== s.getExplicit(f)) return !1;
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
			return !0;
		}, o = function(e, n, r) {
			var i, o, s = [];
			try {
				for (var c = t(e.getList("m" + n + r)), l = c.next(); !l.done; l = c.next()) {
					var u = l.value, d = u.childNodes;
					if (!(d[u[n]] && d[u[r]])) {
						var f = u.parent, p = d[u[n]] ? e.nodeFactory.create("node", "m" + n, [d[u.base], d[u[n]]]) : e.nodeFactory.create("node", "m" + r, [d[u.base], d[u[r]]]);
						a.default.copyAttributes(u, p), f ? f.replaceChild(p, u) : e.root = p, s.push(u);
					}
				}
			} catch (e) {
				i = { error: e };
			} finally {
				try {
					l && !l.done && (o = c.return) && o.call(c);
				} finally {
					if (i) throw i.error;
				}
			}
			e.removeFromList("m" + n + r, s);
		};
		e.cleanSubSup = function(e) {
			var t = e.data;
			t.error || (o(t, "sub", "sup"), o(t, "under", "over"));
		};
		var s = function(e, n, r) {
			var i, o, s = [];
			try {
				for (var c = t(e.getList(n)), l = c.next(); !l.done; l = c.next()) {
					var u = l.value;
					if (!u.attributes.get("displaystyle")) {
						var d = u.childNodes[u.base], f = d.coreMO();
						if (d.getProperty("movablelimits") && !f.attributes.getExplicit("movablelimits")) {
							var p = e.nodeFactory.create("node", r, u.childNodes);
							a.default.copyAttributes(u, p), u.parent ? u.parent.replaceChild(p, u) : e.root = p, s.push(u);
						}
					}
				}
			} catch (e) {
				i = { error: e };
			} finally {
				try {
					l && !l.done && (o = c.return) && o.call(c);
				} finally {
					if (i) throw i.error;
				}
			}
			e.removeFromList(n, s);
		};
		e.moveLimits = function(e) {
			var t = e.data;
			s(t, "munderover", "msubsup"), s(t, "munder", "msub"), s(t, "mover", "msup");
		}, e.setInherited = function(e) {
			e.data.root.setInheritedAttributes({}, e.math.display, 0, !1);
		};
	})(o ||= {}), e.default = o;
})), g = /* @__PURE__ */ e(((e) => {
	var n = e && e.__extends || (function() {
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
	})(), r = e && e.__assign || function() {
		return r = Object.assign || function(e) {
			for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
			return e;
		}, r.apply(this, arguments);
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
	}, p = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.TeX = void 0;
	var g = i(), _ = t(), v = m(), y = p(h()), b = p(f()), x = p(l()), S = p(o()), C = p(d()), w = c(), T = s();
	u(), e.TeX = function(e) {
		n(t, e);
		function t(n) {
			n === void 0 && (n = {});
			var r = this, i = a((0, _.separateOptions)(n, t.OPTIONS, v.FindTeX.OPTIONS), 3), o = i[0], s = i[1], c = i[2];
			r = e.call(this, s) || this, r.findTeX = r.options.FindTeX || new v.FindTeX(c);
			var l = r.options.packages, u = r.configuration = t.configure(l), d = r._parseOptions = new C.default(u, [r.options, w.TagsFactory.OPTIONS]);
			return (0, _.userOptions)(d.options, o), u.config(r), t.tags(d, u), r.postFilters.add(y.default.cleanSubSup, -6), r.postFilters.add(y.default.setInherited, -5), r.postFilters.add(y.default.moveLimits, -4), r.postFilters.add(y.default.cleanStretchy, -3), r.postFilters.add(y.default.cleanAttributes, -2), r.postFilters.add(y.default.combineRelations, -1), r;
		}
		return t.configure = function(e) {
			var t = new T.ParserConfiguration(e, ["tex"]);
			return t.init(), t;
		}, t.tags = function(e, t) {
			w.TagsFactory.addTags(t.tags), w.TagsFactory.setDefault(e.options.tags), e.tags = w.TagsFactory.getDefault(), e.tags.configuration = e;
		}, t.prototype.setMmlFactory = function(t) {
			e.prototype.setMmlFactory.call(this, t), this._parseOptions.nodeFactory.setMmlFactory(t);
		}, Object.defineProperty(t.prototype, "parseOptions", {
			get: function() {
				return this._parseOptions;
			},
			enumerable: !1,
			configurable: !0
		}), t.prototype.reset = function(e) {
			e === void 0 && (e = 0), this.parseOptions.tags.reset(e);
		}, t.prototype.compile = function(e, t) {
			this.parseOptions.clear(), this.executeFilters(this.preFilters, e, t, this.parseOptions);
			var n = e.display;
			this.latex = e.math;
			var r;
			this.parseOptions.tags.startEquation(e);
			var i;
			try {
				var a = new x.default(this.latex, {
					display: n,
					isInner: !1
				}, this.parseOptions);
				r = a.mml(), i = a.stack.global;
			} catch (e) {
				if (!(e instanceof S.default)) throw e;
				this.parseOptions.error = !0, r = this.options.formatError(this, e);
			}
			return r = this.parseOptions.nodeFactory.create("node", "math", [r]), i?.indentalign && b.default.setAttribute(r, "indentalign", i.indentalign), n && b.default.setAttribute(r, "display", "block"), this.parseOptions.tags.finishEquation(e), this.parseOptions.root = r, this.executeFilters(this.postFilters, e, t, this.parseOptions), this.mathNode = this.parseOptions.root, this.mathNode;
		}, t.prototype.findMath = function(e) {
			return this.findTeX.findMath(e);
		}, t.prototype.formatError = function(e) {
			var t = e.message.replace(/\n.*/, "");
			return this.parseOptions.nodeFactory.create("error", t, e.id, this.latex);
		}, t.NAME = "TeX", t.OPTIONS = r(r({}, g.AbstractInputJax.OPTIONS), {
			FindTeX: null,
			packages: ["base"],
			digits: /^(?:[0-9]+(?:\{,\}[0-9]{3})*(?:\.[0-9]*)?|\.[0-9]+)/,
			maxBuffer: 5 * 1024,
			formatError: function(e, t) {
				return e.formatError(t);
			}
		}), t;
	}(g.AbstractInputJax);
}));
//#endregion
export default g();
