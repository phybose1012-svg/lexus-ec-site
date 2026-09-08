import { t as e } from "./index.js";
import { t } from "./PrioritizedList-D16v7yMr.js";
//#region node_modules/mathjax-full/js/util/Options.js
var n = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.lookup = e.separateOptions = e.selectOptionsFromKeys = e.selectOptions = e.userOptions = e.defaultOptions = e.insert = e.copy = e.keys = e.makeArray = e.expandable = e.Expandable = e.OPTIONS = e.REMOVE = e.APPEND = e.isObject = void 0;
	var i = {}.constructor;
	function a(e) {
		return typeof e == "object" && !!e && (e.constructor === i || e.constructor === o);
	}
	e.isObject = a, e.APPEND = "[+]", e.REMOVE = "[-]", e.OPTIONS = {
		invalidOption: "warn",
		optionError: function(t, n) {
			if (e.OPTIONS.invalidOption === "fatal") throw Error(t);
			console.warn("MathJax: " + t);
		}
	};
	var o = function() {
		function e() {}
		return e;
	}();
	e.Expandable = o;
	function s(e) {
		return Object.assign(Object.create(o.prototype), e);
	}
	e.expandable = s;
	function c(e) {
		return Array.isArray(e) ? e : [e];
	}
	e.makeArray = c;
	function l(e) {
		return e ? Object.keys(e).concat(Object.getOwnPropertySymbols(e)) : [];
	}
	e.keys = l;
	function u(e) {
		var n, r, i = {};
		try {
			for (var c = t(l(e)), f = c.next(); !f.done; f = c.next()) {
				var p = f.value, m = Object.getOwnPropertyDescriptor(e, p), h = m.value;
				Array.isArray(h) ? m.value = d([], h, !1) : a(h) && (m.value = u(h)), m.enumerable && (i[p] = m);
			}
		} catch (e) {
			n = { error: e };
		} finally {
			try {
				f && !f.done && (r = c.return) && r.call(c);
			} finally {
				if (n) throw n.error;
			}
		}
		return Object.defineProperties(e.constructor === o ? s({}) : {}, i);
	}
	e.copy = u;
	function d(i, s, c) {
		var f, p;
		c === void 0 && (c = !0);
		var m = function(t) {
			if (c && i[t] === void 0 && i.constructor !== o) return typeof t == "symbol" && (t = t.toString()), e.OPTIONS.optionError(`Invalid option "${t}" (no default value).`, t), "continue";
			var f = s[t], p = i[t];
			if (a(f) && p !== null && (typeof p == "object" || typeof p == "function")) {
				var m = l(f);
				Array.isArray(p) && (m.length === 1 && (m[0] === e.APPEND || m[0] === e.REMOVE) && Array.isArray(f[m[0]]) || m.length === 2 && m.sort().join(",") === e.APPEND + "," + e.REMOVE && Array.isArray(f[e.APPEND]) && Array.isArray(f[e.REMOVE])) ? (f[e.REMOVE] && (p = i[t] = p.filter(function(t) {
					return f[e.REMOVE].indexOf(t) < 0;
				})), f[e.APPEND] && (i[t] = r(r([], n(p), !1), n(f[e.APPEND]), !1))) : d(p, f, c);
			} else Array.isArray(f) ? (i[t] = [], d(i[t], f, !1)) : a(f) ? i[t] = u(f) : i[t] = f;
		};
		try {
			for (var h = t(l(s)), g = h.next(); !g.done; g = h.next()) {
				var _ = g.value;
				m(_);
			}
		} catch (e) {
			f = { error: e };
		} finally {
			try {
				g && !g.done && (p = h.return) && p.call(h);
			} finally {
				if (f) throw f.error;
			}
		}
		return i;
	}
	e.insert = d;
	function f(e) {
		return [...arguments].slice(1).forEach(function(t) {
			return d(e, t, !1);
		}), e;
	}
	e.defaultOptions = f;
	function p(e) {
		return [...arguments].slice(1).forEach(function(t) {
			return d(e, t, !0);
		}), e;
	}
	e.userOptions = p;
	function m(e) {
		for (var n, r, i = [], a = 1; a < arguments.length; a++) i[a - 1] = arguments[a];
		var o = {};
		try {
			for (var s = t(i), c = s.next(); !c.done; c = s.next()) {
				var l = c.value;
				e.hasOwnProperty(l) && (o[l] = e[l]);
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
		return o;
	}
	e.selectOptions = m;
	function h(e, t) {
		return m.apply(void 0, r([e], n(Object.keys(t)), !1));
	}
	e.selectOptionsFromKeys = h;
	function g(e) {
		for (var n, r, i, a, o = [], s = 1; s < arguments.length; s++) o[s - 1] = arguments[s];
		var c = [];
		try {
			for (var l = t(o), u = l.next(); !u.done; u = l.next()) {
				var d = u.value, f = {}, p = {};
				try {
					for (var m = (i = void 0, t(Object.keys(e || {}))), h = m.next(); !h.done; h = m.next()) {
						var g = h.value;
						(d[g] === void 0 ? p : f)[g] = e[g];
					}
				} catch (e) {
					i = { error: e };
				} finally {
					try {
						h && !h.done && (a = m.return) && a.call(m);
					} finally {
						if (i) throw i.error;
					}
				}
				c.push(f), e = p;
			}
		} catch (e) {
			n = { error: e };
		} finally {
			try {
				u && !u.done && (r = l.return) && r.call(l);
			} finally {
				if (n) throw n.error;
			}
		}
		return c.unshift(e), c;
	}
	e.separateOptions = g;
	function _(e, t, n) {
		return n === void 0 && (n = null), t.hasOwnProperty(e) ? t[e] : n;
	}
	e.lookup = _;
})), r = /* @__PURE__ */ e(((e) => {
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
	})(), r = e && e.__values || function(e) {
		var t = typeof Symbol == "function" && Symbol.iterator, n = t && e[t], r = 0;
		if (n) return n.call(e);
		if (e && typeof e.length == "number") return { next: function() {
			return e && r >= e.length && (e = void 0), {
				value: e && e[r++],
				done: !e
			};
		} };
		throw TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
	}, i = e && e.__read || function(e, t) {
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
	}, a = e && e.__spreadArray || function(e, t, n) {
		if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++) (a || !(r in t)) && (a ||= Array.prototype.slice.call(t, 0, r), a[r] = t[r]);
		return e.concat(a || Array.prototype.slice.call(t));
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.FunctionList = void 0, e.FunctionList = function(e) {
		n(t, e);
		function t() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return t.prototype.execute = function() {
			for (var e, t, n = [], o = 0; o < arguments.length; o++) n[o] = arguments[o];
			try {
				for (var s = r(this), c = s.next(); !c.done; c = s.next()) {
					var l = c.value;
					if (l.item.apply(l, a([], i(n), !1)) === !1) return !1;
				}
			} catch (t) {
				e = { error: t };
			} finally {
				try {
					c && !c.done && (t = s.return) && t.call(s);
				} finally {
					if (e) throw e.error;
				}
			}
			return !0;
		}, t.prototype.asyncExecute = function() {
			var e = [...arguments], t = -1, n = this.items;
			return new Promise(function(r, o) {
				(function s() {
					for (var c; ++t < n.length;) {
						var l = (c = n[t]).item.apply(c, a([], i(e), !1));
						if (l instanceof Promise) {
							l.then(s).catch(function(e) {
								return o(e);
							});
							return;
						}
						if (l === !1) {
							r(!1);
							return;
						}
					}
					r(!0);
				})();
			});
		}, t;
	}(t().PrioritizedList);
})), i = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.AbstractFactory = void 0, e.AbstractFactory = function() {
		function e(e) {
			var n, r;
			e === void 0 && (e = null), this.defaultKind = "unknown", this.nodeMap = /* @__PURE__ */ new Map(), this.node = {}, e === null && (e = this.constructor.defaultNodes);
			try {
				for (var i = t(Object.keys(e)), a = i.next(); !a.done; a = i.next()) {
					var o = a.value;
					this.setNodeClass(o, e[o]);
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
		}
		return e.prototype.create = function(e) {
			var t = [...arguments].slice(1);
			return (this.node[e] || this.node[this.defaultKind]).apply(void 0, r([], n(t), !1));
		}, e.prototype.setNodeClass = function(e, t) {
			this.nodeMap.set(e, t);
			var i = this, a = this.nodeMap.get(e);
			this.node[e] = function() {
				var e = [...arguments];
				return new (a.bind.apply(a, r([void 0, i], n(e), !1)))();
			};
		}, e.prototype.getNodeClass = function(e) {
			return this.nodeMap.get(e);
		}, e.prototype.deleteNodeClass = function(e) {
			this.nodeMap.delete(e), delete this.node[e];
		}, e.prototype.nodeIsKind = function(e, t) {
			return e instanceof this.getNodeClass(t);
		}, e.prototype.getKinds = function() {
			return Array.from(this.nodeMap.keys());
		}, e.defaultNodes = {}, e;
	}();
})), a = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.Attributes = e.INHERIT = void 0, e.INHERIT = "_inherit_", e.Attributes = function() {
		function n(e, t) {
			this.global = t, this.defaults = Object.create(t), this.inherited = Object.create(this.defaults), this.attributes = Object.create(this.inherited), Object.assign(this.defaults, e);
		}
		return n.prototype.set = function(e, t) {
			this.attributes[e] = t;
		}, n.prototype.setList = function(e) {
			Object.assign(this.attributes, e);
		}, n.prototype.get = function(t) {
			var n = this.attributes[t];
			return n === e.INHERIT && (n = this.global[t]), n;
		}, n.prototype.getExplicit = function(e) {
			if (this.attributes.hasOwnProperty(e)) return this.attributes[e];
		}, n.prototype.getList = function() {
			for (var e, n, r = [], i = 0; i < arguments.length; i++) r[i] = arguments[i];
			var a = {};
			try {
				for (var o = t(r), s = o.next(); !s.done; s = o.next()) {
					var c = s.value;
					a[c] = this.get(c);
				}
			} catch (t) {
				e = { error: t };
			} finally {
				try {
					s && !s.done && (n = o.return) && n.call(o);
				} finally {
					if (e) throw e.error;
				}
			}
			return a;
		}, n.prototype.setInherited = function(e, t) {
			this.inherited[e] = t;
		}, n.prototype.getInherited = function(e) {
			return this.inherited[e];
		}, n.prototype.getDefault = function(e) {
			return this.defaults[e];
		}, n.prototype.isSet = function(e) {
			return this.attributes.hasOwnProperty(e) || this.inherited.hasOwnProperty(e);
		}, n.prototype.hasDefault = function(e) {
			return e in this.defaults;
		}, n.prototype.getExplicitNames = function() {
			return Object.keys(this.attributes);
		}, n.prototype.getInheritedNames = function() {
			return Object.keys(this.inherited);
		}, n.prototype.getDefaultNames = function() {
			return Object.keys(this.defaults);
		}, n.prototype.getGlobalNames = function() {
			return Object.keys(this.global);
		}, n.prototype.getAllAttributes = function() {
			return this.attributes;
		}, n.prototype.getAllInherited = function() {
			return this.inherited;
		}, n.prototype.getAllDefaults = function() {
			return this.defaults;
		}, n.prototype.getAllGlobals = function() {
			return this.global;
		}, n;
	}();
})), o = /* @__PURE__ */ e(((e) => {
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
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.AbstractEmptyNode = e.AbstractNode = void 0;
	var i = function() {
		function e(e, t, n) {
			var i, a;
			t === void 0 && (t = {}), n === void 0 && (n = []), this.factory = e, this.parent = null, this.properties = {}, this.childNodes = [];
			try {
				for (var o = r(Object.keys(t)), s = o.next(); !s.done; s = o.next()) {
					var c = s.value;
					this.setProperty(c, t[c]);
				}
			} catch (e) {
				i = { error: e };
			} finally {
				try {
					s && !s.done && (a = o.return) && a.call(o);
				} finally {
					if (i) throw i.error;
				}
			}
			n.length && this.setChildren(n);
		}
		return Object.defineProperty(e.prototype, "kind", {
			get: function() {
				return "unknown";
			},
			enumerable: !1,
			configurable: !0
		}), e.prototype.setProperty = function(e, t) {
			this.properties[e] = t;
		}, e.prototype.getProperty = function(e) {
			return this.properties[e];
		}, e.prototype.getPropertyNames = function() {
			return Object.keys(this.properties);
		}, e.prototype.getAllProperties = function() {
			return this.properties;
		}, e.prototype.removeProperty = function() {
			for (var e, t, n = [], i = 0; i < arguments.length; i++) n[i] = arguments[i];
			try {
				for (var a = r(n), o = a.next(); !o.done; o = a.next()) {
					var s = o.value;
					delete this.properties[s];
				}
			} catch (t) {
				e = { error: t };
			} finally {
				try {
					o && !o.done && (t = a.return) && t.call(a);
				} finally {
					if (e) throw e.error;
				}
			}
		}, e.prototype.isKind = function(e) {
			return this.factory.nodeIsKind(this, e);
		}, e.prototype.setChildren = function(e) {
			var t, n;
			this.childNodes = [];
			try {
				for (var i = r(e), a = i.next(); !a.done; a = i.next()) {
					var o = a.value;
					this.appendChild(o);
				}
			} catch (e) {
				t = { error: e };
			} finally {
				try {
					a && !a.done && (n = i.return) && n.call(i);
				} finally {
					if (t) throw t.error;
				}
			}
		}, e.prototype.appendChild = function(e) {
			return this.childNodes.push(e), e.parent = this, e;
		}, e.prototype.replaceChild = function(e, t) {
			var n = this.childIndex(t);
			return n !== null && (this.childNodes[n] = e, e.parent = this, t.parent = null), e;
		}, e.prototype.removeChild = function(e) {
			var t = this.childIndex(e);
			return t !== null && (this.childNodes.splice(t, 1), e.parent = null), e;
		}, e.prototype.childIndex = function(e) {
			var t = this.childNodes.indexOf(e);
			return t === -1 ? null : t;
		}, e.prototype.copy = function() {
			var e, t, i = this.factory.create(this.kind);
			i.properties = n({}, this.properties);
			try {
				for (var a = r(this.childNodes || []), o = a.next(); !o.done; o = a.next()) {
					var s = o.value;
					s && i.appendChild(s.copy());
				}
			} catch (t) {
				e = { error: t };
			} finally {
				try {
					o && !o.done && (t = a.return) && t.call(a);
				} finally {
					if (e) throw e.error;
				}
			}
			return i;
		}, e.prototype.findNodes = function(e) {
			var t = [];
			return this.walkTree(function(n) {
				n.isKind(e) && t.push(n);
			}), t;
		}, e.prototype.walkTree = function(e, t) {
			var n, i;
			e(this, t);
			try {
				for (var a = r(this.childNodes), o = a.next(); !o.done; o = a.next()) {
					var s = o.value;
					s && s.walkTree(e, t);
				}
			} catch (e) {
				n = { error: e };
			} finally {
				try {
					o && !o.done && (i = a.return) && i.call(a);
				} finally {
					if (n) throw n.error;
				}
			}
			return t;
		}, e.prototype.toString = function() {
			return this.kind + "(" + this.childNodes.join(",") + ")";
		}, e;
	}();
	e.AbstractNode = i, e.AbstractEmptyNode = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return n.prototype.setChildren = function(e) {}, n.prototype.appendChild = function(e) {
			return e;
		}, n.prototype.replaceChild = function(e, t) {
			return t;
		}, n.prototype.childIndex = function(e) {
			return null;
		}, n.prototype.walkTree = function(e, t) {
			return e(this, t), t;
		}, n.prototype.toString = function() {
			return this.kind;
		}, n;
	}(i);
})), s = /* @__PURE__ */ e(((e) => {
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
	}, i = e && e.__read || function(e, t) {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.XMLNode = e.TextNode = e.AbstractMmlEmptyNode = e.AbstractMmlBaseNode = e.AbstractMmlLayoutNode = e.AbstractMmlTokenNode = e.AbstractMmlNode = e.indentAttributes = e.TEXCLASSNAMES = e.TEXCLASS = void 0;
	var s = a(), c = o();
	e.TEXCLASS = {
		ORD: 0,
		OP: 1,
		BIN: 2,
		REL: 3,
		OPEN: 4,
		CLOSE: 5,
		PUNCT: 6,
		INNER: 7,
		VCENTER: 8,
		NONE: -1
	}, e.TEXCLASSNAMES = [
		"ORD",
		"OP",
		"BIN",
		"REL",
		"OPEN",
		"CLOSE",
		"PUNCT",
		"INNER",
		"VCENTER"
	];
	var l = [
		"",
		"thinmathspace",
		"mediummathspace",
		"thickmathspace"
	], u = [
		[
			0,
			-1,
			2,
			3,
			0,
			0,
			0,
			1
		],
		[
			-1,
			-1,
			0,
			3,
			0,
			0,
			0,
			1
		],
		[
			2,
			2,
			0,
			0,
			2,
			0,
			0,
			2
		],
		[
			3,
			3,
			0,
			0,
			3,
			0,
			0,
			3
		],
		[
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0
		],
		[
			0,
			-1,
			2,
			3,
			0,
			0,
			0,
			1
		],
		[
			1,
			1,
			0,
			1,
			1,
			1,
			1,
			1
		],
		[
			1,
			-1,
			2,
			3,
			1,
			0,
			1,
			1
		]
	];
	e.indentAttributes = [
		"indentalign",
		"indentalignfirst",
		"indentshift",
		"indentshiftfirst"
	];
	var d = function(a) {
		t(o, a);
		function o(e, t, n) {
			t === void 0 && (t = {}), n === void 0 && (n = []);
			var r = a.call(this, e) || this;
			return r.prevClass = null, r.prevLevel = null, r.texclass = null, r.arity < 0 && (r.childNodes = [e.create("inferredMrow")], r.childNodes[0].parent = r), r.setChildren(n), r.attributes = new s.Attributes(e.getNodeClass(r.kind).defaults, e.getNodeClass("math").defaults), r.attributes.setList(t), r;
		}
		return o.prototype.copy = function(e) {
			var t, i, a, o;
			e === void 0 && (e = !1);
			var s = this.factory.create(this.kind);
			if (s.properties = n({}, this.properties), this.attributes) {
				var c = this.attributes.getAllAttributes();
				try {
					for (var l = r(Object.keys(c)), u = l.next(); !u.done; u = l.next()) {
						var d = u.value;
						(d !== "id" || e) && s.attributes.set(d, c[d]);
					}
				} catch (e) {
					t = { error: e };
				} finally {
					try {
						u && !u.done && (i = l.return) && i.call(l);
					} finally {
						if (t) throw t.error;
					}
				}
			}
			if (this.childNodes && this.childNodes.length) {
				var f = this.childNodes;
				f.length === 1 && f[0].isInferred && (f = f[0].childNodes);
				try {
					for (var p = r(f), m = p.next(); !m.done; m = p.next()) {
						var h = m.value;
						h ? s.appendChild(h.copy()) : s.childNodes.push(null);
					}
				} catch (e) {
					a = { error: e };
				} finally {
					try {
						m && !m.done && (o = p.return) && o.call(p);
					} finally {
						if (a) throw a.error;
					}
				}
			}
			return s;
		}, Object.defineProperty(o.prototype, "texClass", {
			get: function() {
				return this.texclass;
			},
			set: function(e) {
				this.texclass = e;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(o.prototype, "isToken", {
			get: function() {
				return !1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(o.prototype, "isEmbellished", {
			get: function() {
				return !1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(o.prototype, "isSpacelike", {
			get: function() {
				return !1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(o.prototype, "linebreakContainer", {
			get: function() {
				return !1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(o.prototype, "hasNewLine", {
			get: function() {
				return !1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(o.prototype, "arity", {
			get: function() {
				return Infinity;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(o.prototype, "isInferred", {
			get: function() {
				return !1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(o.prototype, "Parent", {
			get: function() {
				for (var e = this.parent; e && e.notParent;) e = e.Parent;
				return e;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(o.prototype, "notParent", {
			get: function() {
				return !1;
			},
			enumerable: !1,
			configurable: !0
		}), o.prototype.setChildren = function(e) {
			return this.arity < 0 ? this.childNodes[0].setChildren(e) : a.prototype.setChildren.call(this, e);
		}, o.prototype.appendChild = function(e) {
			var t, n, i = this;
			if (this.arity < 0) return this.childNodes[0].appendChild(e), e;
			if (e.isInferred) {
				if (this.arity === Infinity) return e.childNodes.forEach(function(e) {
					return a.prototype.appendChild.call(i, e);
				}), e;
				var o = e;
				e = this.factory.create("mrow"), e.setChildren(o.childNodes), e.attributes = o.attributes;
				try {
					for (var s = r(o.getPropertyNames()), c = s.next(); !c.done; c = s.next()) {
						var l = c.value;
						e.setProperty(l, o.getProperty(l));
					}
				} catch (e) {
					t = { error: e };
				} finally {
					try {
						c && !c.done && (n = s.return) && n.call(s);
					} finally {
						if (t) throw t.error;
					}
				}
			}
			return a.prototype.appendChild.call(this, e);
		}, o.prototype.replaceChild = function(e, t) {
			return this.arity < 0 ? (this.childNodes[0].replaceChild(e, t), e) : a.prototype.replaceChild.call(this, e, t);
		}, o.prototype.core = function() {
			return this;
		}, o.prototype.coreMO = function() {
			return this;
		}, o.prototype.coreIndex = function() {
			return 0;
		}, o.prototype.childPosition = function() {
			for (var e, t, n = this, i = n.parent; i && i.notParent;) n = i, i = i.parent;
			if (i) {
				var a = 0;
				try {
					for (var o = r(i.childNodes), s = o.next(); !s.done; s = o.next()) {
						if (s.value === n) return a;
						a++;
					}
				} catch (t) {
					e = { error: t };
				} finally {
					try {
						s && !s.done && (t = o.return) && t.call(o);
					} finally {
						if (e) throw e.error;
					}
				}
			}
			return null;
		}, o.prototype.setTeXclass = function(e) {
			return this.getPrevClass(e), this.texClass == null ? e : this;
		}, o.prototype.updateTeXclass = function(e) {
			e && (this.prevClass = e.prevClass, this.prevLevel = e.prevLevel, e.prevClass = e.prevLevel = null, this.texClass = e.texClass);
		}, o.prototype.getPrevClass = function(e) {
			e && (this.prevClass = e.texClass, this.prevLevel = e.attributes.get("scriptlevel"));
		}, o.prototype.texSpacing = function() {
			var t = this.prevClass == null ? e.TEXCLASS.NONE : this.prevClass, n = this.texClass || e.TEXCLASS.ORD;
			if (t === e.TEXCLASS.NONE || n === e.TEXCLASS.NONE) return "";
			t === e.TEXCLASS.VCENTER && (t = e.TEXCLASS.ORD), n === e.TEXCLASS.VCENTER && (n = e.TEXCLASS.ORD);
			var r = u[t][n];
			return (this.prevLevel > 0 || this.attributes.get("scriptlevel") > 0) && r >= 0 ? "" : l[Math.abs(r)];
		}, o.prototype.hasSpacingAttributes = function() {
			return this.isEmbellished && this.coreMO().hasSpacingAttributes();
		}, o.prototype.setInheritedAttributes = function(e, t, n, a) {
			var s, c;
			e === void 0 && (e = {}), t === void 0 && (t = !1), n === void 0 && (n = 0), a === void 0 && (a = !1);
			var l = this.attributes.getAllDefaults();
			try {
				for (var u = r(Object.keys(e)), d = u.next(); !d.done; d = u.next()) {
					var f = d.value;
					if (l.hasOwnProperty(f) || o.alwaysInherit.hasOwnProperty(f)) {
						var p = i(e[f], 2), m = p[0], h = p[1];
						((o.noInherit[m] || {})[this.kind] || {})[f] || this.attributes.setInherited(f, h);
					}
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
			this.attributes.getExplicit("displaystyle") === void 0 && this.attributes.setInherited("displaystyle", t), this.attributes.getExplicit("scriptlevel") === void 0 && this.attributes.setInherited("scriptlevel", n), a && this.setProperty("texprimestyle", a);
			var g = this.arity;
			if (g >= 0 && g !== Infinity && (g === 1 && this.childNodes.length === 0 || g !== 1 && this.childNodes.length !== g)) if (g < this.childNodes.length) this.childNodes = this.childNodes.slice(0, g);
			else for (; this.childNodes.length < g;) this.appendChild(this.factory.create("mrow"));
			this.setChildInheritedAttributes(e, t, n, a);
		}, o.prototype.setChildInheritedAttributes = function(e, t, n, i) {
			var a, o;
			try {
				for (var s = r(this.childNodes), c = s.next(); !c.done; c = s.next()) c.value.setInheritedAttributes(e, t, n, i);
			} catch (e) {
				a = { error: e };
			} finally {
				try {
					c && !c.done && (o = s.return) && o.call(s);
				} finally {
					if (a) throw a.error;
				}
			}
		}, o.prototype.addInheritedAttributes = function(e, t) {
			var i, a, o = n({}, e);
			try {
				for (var s = r(Object.keys(t)), c = s.next(); !c.done; c = s.next()) {
					var l = c.value;
					l !== "displaystyle" && l !== "scriptlevel" && l !== "style" && (o[l] = [this.kind, t[l]]);
				}
			} catch (e) {
				i = { error: e };
			} finally {
				try {
					c && !c.done && (a = s.return) && a.call(s);
				} finally {
					if (i) throw i.error;
				}
			}
			return o;
		}, o.prototype.inheritAttributesFrom = function(e) {
			var t = e.attributes, n = t.get("displaystyle"), r = t.get("scriptlevel"), i = t.isSet("mathsize") ? { mathsize: ["math", t.get("mathsize")] } : {}, a = e.getProperty("texprimestyle") || !1;
			this.setInheritedAttributes(i, n, r, a);
		}, o.prototype.verifyTree = function(e) {
			if (e === void 0 && (e = null), e !== null) {
				this.verifyAttributes(e);
				var t = this.arity;
				e.checkArity && t >= 0 && t !== Infinity && (t === 1 && this.childNodes.length === 0 || t !== 1 && this.childNodes.length !== t) && this.mError("Wrong number of children for \"" + this.kind + "\" node", e, !0), this.verifyChildren(e);
			}
		}, o.prototype.verifyAttributes = function(e) {
			var t, n;
			if (e.checkAttributes) {
				var i = this.attributes, a = [];
				try {
					for (var o = r(i.getExplicitNames()), s = o.next(); !s.done; s = o.next()) {
						var c = s.value;
						c.substr(0, 5) !== "data-" && i.getDefault(c) === void 0 && !c.match(/^(?:class|style|id|(?:xlink:)?href)$/) && a.push(c);
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
				a.length && this.mError("Unknown attributes for " + this.kind + " node: " + a.join(", "), e);
			}
		}, o.prototype.verifyChildren = function(e) {
			var t, n;
			try {
				for (var i = r(this.childNodes), a = i.next(); !a.done; a = i.next()) a.value.verifyTree(e);
			} catch (e) {
				t = { error: e };
			} finally {
				try {
					a && !a.done && (n = i.return) && n.call(i);
				} finally {
					if (t) throw t.error;
				}
			}
		}, o.prototype.mError = function(e, t, n) {
			if (n === void 0 && (n = !1), this.parent && this.parent.isKind("merror")) return null;
			var r = this.factory.create("merror");
			if (r.attributes.set("data-mjx-message", e), t.fullErrors || n) {
				var i = this.factory.create("mtext"), a = this.factory.create("text");
				a.setText(t.fullErrors ? e : this.kind), i.appendChild(a), r.appendChild(i), this.parent.replaceChild(r, this);
			} else this.parent.replaceChild(r, this), r.appendChild(this);
			return r;
		}, o.defaults = {
			mathbackground: s.INHERIT,
			mathcolor: s.INHERIT,
			mathsize: s.INHERIT,
			dir: s.INHERIT
		}, o.noInherit = {
			mstyle: {
				mpadded: {
					width: !0,
					height: !0,
					depth: !0,
					lspace: !0,
					voffset: !0
				},
				mtable: {
					width: !0,
					height: !0,
					depth: !0,
					align: !0
				}
			},
			maligngroup: {
				mrow: { groupalign: !0 },
				mtable: { groupalign: !0 }
			}
		}, o.alwaysInherit = {
			scriptminsize: !0,
			scriptsizemultiplier: !0
		}, o.verifyDefaults = {
			checkArity: !0,
			checkAttributes: !1,
			fullErrors: !1,
			fixMmultiscripts: !0,
			fixMtables: !0
		}, o;
	}(c.AbstractNode);
	e.AbstractMmlNode = d, e.AbstractMmlTokenNode = function(e) {
		t(i, e);
		function i() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(i.prototype, "isToken", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), i.prototype.getText = function() {
			var e, t, n = "";
			try {
				for (var i = r(this.childNodes), a = i.next(); !a.done; a = i.next()) {
					var o = a.value;
					o instanceof p && (n += o.getText());
				}
			} catch (t) {
				e = { error: t };
			} finally {
				try {
					a && !a.done && (t = i.return) && t.call(i);
				} finally {
					if (e) throw e.error;
				}
			}
			return n;
		}, i.prototype.setChildInheritedAttributes = function(e, t, n, i) {
			var a, o;
			try {
				for (var s = r(this.childNodes), c = s.next(); !c.done; c = s.next()) {
					var l = c.value;
					l instanceof d && l.setInheritedAttributes(e, t, n, i);
				}
			} catch (e) {
				a = { error: e };
			} finally {
				try {
					c && !c.done && (o = s.return) && o.call(s);
				} finally {
					if (a) throw a.error;
				}
			}
		}, i.prototype.walkTree = function(e, t) {
			var n, i;
			e(this, t);
			try {
				for (var a = r(this.childNodes), o = a.next(); !o.done; o = a.next()) {
					var s = o.value;
					s instanceof d && s.walkTree(e, t);
				}
			} catch (e) {
				n = { error: e };
			} finally {
				try {
					o && !o.done && (i = a.return) && i.call(a);
				} finally {
					if (n) throw n.error;
				}
			}
			return t;
		}, i.defaults = n(n({}, d.defaults), {
			mathvariant: "normal",
			mathsize: s.INHERIT
		}), i;
	}(d), e.AbstractMmlLayoutNode = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(n.prototype, "isSpacelike", {
			get: function() {
				return this.childNodes[0].isSpacelike;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(n.prototype, "isEmbellished", {
			get: function() {
				return this.childNodes[0].isEmbellished;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(n.prototype, "arity", {
			get: function() {
				return -1;
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.core = function() {
			return this.childNodes[0];
		}, n.prototype.coreMO = function() {
			return this.childNodes[0].coreMO();
		}, n.prototype.setTeXclass = function(e) {
			return e = this.childNodes[0].setTeXclass(e), this.updateTeXclass(this.childNodes[0]), e;
		}, n.defaults = d.defaults, n;
	}(d), e.AbstractMmlBaseNode = function(n) {
		t(i, n);
		function i() {
			return n !== null && n.apply(this, arguments) || this;
		}
		return Object.defineProperty(i.prototype, "isEmbellished", {
			get: function() {
				return this.childNodes[0].isEmbellished;
			},
			enumerable: !1,
			configurable: !0
		}), i.prototype.core = function() {
			return this.childNodes[0];
		}, i.prototype.coreMO = function() {
			return this.childNodes[0].coreMO();
		}, i.prototype.setTeXclass = function(t) {
			var n, i;
			this.getPrevClass(t), this.texClass = e.TEXCLASS.ORD;
			var a = this.childNodes[0];
			a ? this.isEmbellished || a.isKind("mi") ? (t = a.setTeXclass(t), this.updateTeXclass(this.core())) : (a.setTeXclass(null), t = this) : t = this;
			try {
				for (var o = r(this.childNodes.slice(1)), s = o.next(); !s.done; s = o.next()) {
					var c = s.value;
					c && c.setTeXclass(null);
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
			return t;
		}, i.defaults = d.defaults, i;
	}(d);
	var f = function(n) {
		t(r, n);
		function r() {
			return n !== null && n.apply(this, arguments) || this;
		}
		return Object.defineProperty(r.prototype, "isToken", {
			get: function() {
				return !1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "isEmbellished", {
			get: function() {
				return !1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "isSpacelike", {
			get: function() {
				return !1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "linebreakContainer", {
			get: function() {
				return !1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "hasNewLine", {
			get: function() {
				return !1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "arity", {
			get: function() {
				return 0;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "isInferred", {
			get: function() {
				return !1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "notParent", {
			get: function() {
				return !1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "Parent", {
			get: function() {
				return this.parent;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "texClass", {
			get: function() {
				return e.TEXCLASS.NONE;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "prevClass", {
			get: function() {
				return e.TEXCLASS.NONE;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "prevLevel", {
			get: function() {
				return 0;
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.hasSpacingAttributes = function() {
			return !1;
		}, Object.defineProperty(r.prototype, "attributes", {
			get: function() {
				return null;
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.core = function() {
			return this;
		}, r.prototype.coreMO = function() {
			return this;
		}, r.prototype.coreIndex = function() {
			return 0;
		}, r.prototype.childPosition = function() {
			return 0;
		}, r.prototype.setTeXclass = function(e) {
			return e;
		}, r.prototype.texSpacing = function() {
			return "";
		}, r.prototype.setInheritedAttributes = function(e, t, n, r) {}, r.prototype.inheritAttributesFrom = function(e) {}, r.prototype.verifyTree = function(e) {}, r.prototype.mError = function(e, t, n) {
			return n === void 0 && (n = !1), null;
		}, r;
	}(c.AbstractEmptyNode);
	e.AbstractMmlEmptyNode = f;
	var p = function(e) {
		t(n, e);
		function n() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.text = "", t;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "text";
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.getText = function() {
			return this.text;
		}, n.prototype.setText = function(e) {
			return this.text = e, this;
		}, n.prototype.copy = function() {
			return this.factory.create(this.kind).setText(this.getText());
		}, n.prototype.toString = function() {
			return this.text;
		}, n;
	}(f);
	e.TextNode = p, e.XMLNode = function(e) {
		t(n, e);
		function n() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.xml = null, t.adaptor = null, t;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "XML";
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.getXML = function() {
			return this.xml;
		}, n.prototype.setXML = function(e, t) {
			return t === void 0 && (t = null), this.xml = e, this.adaptor = t, this;
		}, n.prototype.getSerializedXML = function() {
			return this.adaptor.serializeXML(this.xml);
		}, n.prototype.copy = function() {
			return this.factory.create(this.kind).setXML(this.adaptor.clone(this.xml));
		}, n.prototype.toString = function() {
			return "XML data";
		}, n;
	}(f);
})), c = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.OPTABLE = e.MMLSPACING = e.getRange = e.RANGES = e.MO = e.OPDEF = void 0;
	var n = s();
	function r(e, t, r, i) {
		return r === void 0 && (r = n.TEXCLASS.BIN), i === void 0 && (i = null), [
			e,
			t,
			r,
			i
		];
	}
	e.OPDEF = r, e.MO = {
		ORD: r(0, 0, n.TEXCLASS.ORD),
		ORD11: r(1, 1, n.TEXCLASS.ORD),
		ORD21: r(2, 1, n.TEXCLASS.ORD),
		ORD02: r(0, 2, n.TEXCLASS.ORD),
		ORD55: r(5, 5, n.TEXCLASS.ORD),
		NONE: r(0, 0, n.TEXCLASS.NONE),
		OP: r(1, 2, n.TEXCLASS.OP, {
			largeop: !0,
			movablelimits: !0,
			symmetric: !0
		}),
		OPFIXED: r(1, 2, n.TEXCLASS.OP, {
			largeop: !0,
			movablelimits: !0
		}),
		INTEGRAL: r(0, 1, n.TEXCLASS.OP, {
			largeop: !0,
			symmetric: !0
		}),
		INTEGRAL2: r(1, 2, n.TEXCLASS.OP, {
			largeop: !0,
			symmetric: !0
		}),
		BIN3: r(3, 3, n.TEXCLASS.BIN),
		BIN4: r(4, 4, n.TEXCLASS.BIN),
		BIN01: r(0, 1, n.TEXCLASS.BIN),
		BIN5: r(5, 5, n.TEXCLASS.BIN),
		TALLBIN: r(4, 4, n.TEXCLASS.BIN, { stretchy: !0 }),
		BINOP: r(4, 4, n.TEXCLASS.BIN, {
			largeop: !0,
			movablelimits: !0
		}),
		REL: r(5, 5, n.TEXCLASS.REL),
		REL1: r(1, 1, n.TEXCLASS.REL, { stretchy: !0 }),
		REL4: r(4, 4, n.TEXCLASS.REL),
		RELSTRETCH: r(5, 5, n.TEXCLASS.REL, { stretchy: !0 }),
		RELACCENT: r(5, 5, n.TEXCLASS.REL, { accent: !0 }),
		WIDEREL: r(5, 5, n.TEXCLASS.REL, {
			accent: !0,
			stretchy: !0
		}),
		OPEN: r(0, 0, n.TEXCLASS.OPEN, {
			fence: !0,
			stretchy: !0,
			symmetric: !0
		}),
		CLOSE: r(0, 0, n.TEXCLASS.CLOSE, {
			fence: !0,
			stretchy: !0,
			symmetric: !0
		}),
		INNER: r(0, 0, n.TEXCLASS.INNER),
		PUNCT: r(0, 3, n.TEXCLASS.PUNCT),
		ACCENT: r(0, 0, n.TEXCLASS.ORD, { accent: !0 }),
		WIDEACCENT: r(0, 0, n.TEXCLASS.ORD, {
			accent: !0,
			stretchy: !0
		})
	}, e.RANGES = [
		[
			32,
			127,
			n.TEXCLASS.REL,
			"mo"
		],
		[
			160,
			191,
			n.TEXCLASS.ORD,
			"mo"
		],
		[
			192,
			591,
			n.TEXCLASS.ORD,
			"mi"
		],
		[
			688,
			879,
			n.TEXCLASS.ORD,
			"mo"
		],
		[
			880,
			6688,
			n.TEXCLASS.ORD,
			"mi"
		],
		[
			6832,
			6911,
			n.TEXCLASS.ORD,
			"mo"
		],
		[
			6912,
			7615,
			n.TEXCLASS.ORD,
			"mi"
		],
		[
			7616,
			7679,
			n.TEXCLASS.ORD,
			"mo"
		],
		[
			7680,
			8191,
			n.TEXCLASS.ORD,
			"mi"
		],
		[
			8192,
			8303,
			n.TEXCLASS.ORD,
			"mo"
		],
		[
			8304,
			8351,
			n.TEXCLASS.ORD,
			"mo"
		],
		[
			8448,
			8527,
			n.TEXCLASS.ORD,
			"mi"
		],
		[
			8528,
			8591,
			n.TEXCLASS.ORD,
			"mn"
		],
		[
			8592,
			8703,
			n.TEXCLASS.REL,
			"mo"
		],
		[
			8704,
			8959,
			n.TEXCLASS.BIN,
			"mo"
		],
		[
			8960,
			9215,
			n.TEXCLASS.ORD,
			"mo"
		],
		[
			9312,
			9471,
			n.TEXCLASS.ORD,
			"mn"
		],
		[
			9472,
			10223,
			n.TEXCLASS.ORD,
			"mo"
		],
		[
			10224,
			10239,
			n.TEXCLASS.REL,
			"mo"
		],
		[
			10240,
			10495,
			n.TEXCLASS.ORD,
			"mtext"
		],
		[
			10496,
			10623,
			n.TEXCLASS.REL,
			"mo"
		],
		[
			10624,
			10751,
			n.TEXCLASS.ORD,
			"mo"
		],
		[
			10752,
			11007,
			n.TEXCLASS.BIN,
			"mo"
		],
		[
			11008,
			11055,
			n.TEXCLASS.ORD,
			"mo"
		],
		[
			11056,
			11087,
			n.TEXCLASS.REL,
			"mo"
		],
		[
			11088,
			11263,
			n.TEXCLASS.ORD,
			"mo"
		],
		[
			11264,
			11744,
			n.TEXCLASS.ORD,
			"mi"
		],
		[
			11776,
			11903,
			n.TEXCLASS.ORD,
			"mo"
		],
		[
			11904,
			12255,
			n.TEXCLASS.ORD,
			"mi",
			"normal"
		],
		[
			12272,
			12351,
			n.TEXCLASS.ORD,
			"mo"
		],
		[
			12352,
			42143,
			n.TEXCLASS.ORD,
			"mi",
			"normal"
		],
		[
			42192,
			43055,
			n.TEXCLASS.ORD,
			"mi"
		],
		[
			43056,
			43071,
			n.TEXCLASS.ORD,
			"mn"
		],
		[
			43072,
			55295,
			n.TEXCLASS.ORD,
			"mi"
		],
		[
			63744,
			64255,
			n.TEXCLASS.ORD,
			"mi",
			"normal"
		],
		[
			64256,
			65023,
			n.TEXCLASS.ORD,
			"mi"
		],
		[
			65024,
			65135,
			n.TEXCLASS.ORD,
			"mo"
		],
		[
			65136,
			65791,
			n.TEXCLASS.ORD,
			"mi"
		],
		[
			65792,
			65935,
			n.TEXCLASS.ORD,
			"mn"
		],
		[
			65936,
			74751,
			n.TEXCLASS.ORD,
			"mi",
			"normal"
		],
		[
			74752,
			74879,
			n.TEXCLASS.ORD,
			"mn"
		],
		[
			74880,
			113823,
			n.TEXCLASS.ORD,
			"mi",
			"normal"
		],
		[
			113824,
			119391,
			n.TEXCLASS.ORD,
			"mo"
		],
		[
			119648,
			119679,
			n.TEXCLASS.ORD,
			"mn"
		],
		[
			119808,
			120781,
			n.TEXCLASS.ORD,
			"mi"
		],
		[
			120782,
			120831,
			n.TEXCLASS.ORD,
			"mn"
		],
		[
			122624,
			129023,
			n.TEXCLASS.ORD,
			"mo"
		],
		[
			129024,
			129279,
			n.TEXCLASS.REL,
			"mo"
		],
		[
			129280,
			129535,
			n.TEXCLASS.ORD,
			"mo"
		],
		[
			131072,
			195103,
			n.TEXCLASS.ORD,
			"mi",
			"normnal"
		]
	];
	function i(n) {
		var r, i, a = n.codePointAt(0);
		try {
			for (var o = t(e.RANGES), s = o.next(); !s.done; s = o.next()) {
				var c = s.value;
				if (a <= c[1]) {
					if (a >= c[0]) return c;
					break;
				}
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
		return null;
	}
	e.getRange = i, e.MMLSPACING = [
		[0, 0],
		[1, 2],
		[3, 3],
		[4, 4],
		[0, 0],
		[0, 0],
		[0, 3]
	], e.OPTABLE = {
		prefix: {
			"(": e.MO.OPEN,
			"+": e.MO.BIN01,
			"-": e.MO.BIN01,
			"[": e.MO.OPEN,
			"{": e.MO.OPEN,
			"|": e.MO.OPEN,
			"||": [
				0,
				0,
				n.TEXCLASS.BIN,
				{
					fence: !0,
					stretchy: !0,
					symmetric: !0
				}
			],
			"|||": [
				0,
				0,
				n.TEXCLASS.ORD,
				{
					fence: !0,
					stretchy: !0,
					symmetric: !0
				}
			],
			"¬": e.MO.ORD21,
			"±": e.MO.BIN01,
			"‖": [
				0,
				0,
				n.TEXCLASS.ORD,
				{
					fence: !0,
					stretchy: !0
				}
			],
			"‘": [
				0,
				0,
				n.TEXCLASS.OPEN,
				{ fence: !0 }
			],
			"“": [
				0,
				0,
				n.TEXCLASS.OPEN,
				{ fence: !0 }
			],
			ⅅ: e.MO.ORD21,
			ⅆ: r(2, 0, n.TEXCLASS.ORD),
			"∀": e.MO.ORD21,
			"∂": e.MO.ORD21,
			"∃": e.MO.ORD21,
			"∄": e.MO.ORD21,
			"∇": e.MO.ORD21,
			"∏": e.MO.OP,
			"∐": e.MO.OP,
			"∑": e.MO.OP,
			"−": e.MO.BIN01,
			"∓": e.MO.BIN01,
			"√": [
				1,
				1,
				n.TEXCLASS.ORD,
				{ stretchy: !0 }
			],
			"∛": e.MO.ORD11,
			"∜": e.MO.ORD11,
			"∠": e.MO.ORD,
			"∡": e.MO.ORD,
			"∢": e.MO.ORD,
			"∫": e.MO.INTEGRAL,
			"∬": e.MO.INTEGRAL,
			"∭": e.MO.INTEGRAL,
			"∮": e.MO.INTEGRAL,
			"∯": e.MO.INTEGRAL,
			"∰": e.MO.INTEGRAL,
			"∱": e.MO.INTEGRAL,
			"∲": e.MO.INTEGRAL,
			"∳": e.MO.INTEGRAL,
			"⋀": e.MO.OP,
			"⋁": e.MO.OP,
			"⋂": e.MO.OP,
			"⋃": e.MO.OP,
			"⌈": e.MO.OPEN,
			"⌊": e.MO.OPEN,
			"〈": e.MO.OPEN,
			"❲": e.MO.OPEN,
			"⟦": e.MO.OPEN,
			"⟨": e.MO.OPEN,
			"⟪": e.MO.OPEN,
			"⟬": e.MO.OPEN,
			"⟮": e.MO.OPEN,
			"⦀": [
				0,
				0,
				n.TEXCLASS.ORD,
				{
					fence: !0,
					stretchy: !0
				}
			],
			"⦃": e.MO.OPEN,
			"⦅": e.MO.OPEN,
			"⦇": e.MO.OPEN,
			"⦉": e.MO.OPEN,
			"⦋": e.MO.OPEN,
			"⦍": e.MO.OPEN,
			"⦏": e.MO.OPEN,
			"⦑": e.MO.OPEN,
			"⦓": e.MO.OPEN,
			"⦕": e.MO.OPEN,
			"⦗": e.MO.OPEN,
			"⧼": e.MO.OPEN,
			"⨀": e.MO.OP,
			"⨁": e.MO.OP,
			"⨂": e.MO.OP,
			"⨃": e.MO.OP,
			"⨄": e.MO.OP,
			"⨅": e.MO.OP,
			"⨆": e.MO.OP,
			"⨇": e.MO.OP,
			"⨈": e.MO.OP,
			"⨉": e.MO.OP,
			"⨊": e.MO.OP,
			"⨋": e.MO.INTEGRAL2,
			"⨌": e.MO.INTEGRAL,
			"⨍": e.MO.INTEGRAL2,
			"⨎": e.MO.INTEGRAL2,
			"⨏": e.MO.INTEGRAL2,
			"⨐": e.MO.OP,
			"⨑": e.MO.OP,
			"⨒": e.MO.OP,
			"⨓": e.MO.OP,
			"⨔": e.MO.OP,
			"⨕": e.MO.INTEGRAL2,
			"⨖": e.MO.INTEGRAL2,
			"⨗": e.MO.INTEGRAL2,
			"⨘": e.MO.INTEGRAL2,
			"⨙": e.MO.INTEGRAL2,
			"⨚": e.MO.INTEGRAL2,
			"⨛": e.MO.INTEGRAL2,
			"⨜": e.MO.INTEGRAL2,
			"⫼": e.MO.OP,
			"⫿": e.MO.OP
		},
		postfix: {
			"!!": r(1, 0),
			"!": [
				1,
				0,
				n.TEXCLASS.CLOSE,
				null
			],
			"\"": e.MO.ACCENT,
			"&": e.MO.ORD,
			")": e.MO.CLOSE,
			"++": r(0, 0),
			"--": r(0, 0),
			"..": r(0, 0),
			"...": e.MO.ORD,
			"'": e.MO.ACCENT,
			"]": e.MO.CLOSE,
			"^": e.MO.WIDEACCENT,
			_: e.MO.WIDEACCENT,
			"`": e.MO.ACCENT,
			"|": e.MO.CLOSE,
			"}": e.MO.CLOSE,
			"~": e.MO.WIDEACCENT,
			"||": [
				0,
				0,
				n.TEXCLASS.BIN,
				{
					fence: !0,
					stretchy: !0,
					symmetric: !0
				}
			],
			"|||": [
				0,
				0,
				n.TEXCLASS.ORD,
				{
					fence: !0,
					stretchy: !0,
					symmetric: !0
				}
			],
			"¨": e.MO.ACCENT,
			ª: e.MO.ACCENT,
			"¯": e.MO.WIDEACCENT,
			"°": e.MO.ORD,
			"²": e.MO.ACCENT,
			"³": e.MO.ACCENT,
			"´": e.MO.ACCENT,
			"¸": e.MO.ACCENT,
			"¹": e.MO.ACCENT,
			º: e.MO.ACCENT,
			ˆ: e.MO.WIDEACCENT,
			ˇ: e.MO.WIDEACCENT,
			ˉ: e.MO.WIDEACCENT,
			ˊ: e.MO.ACCENT,
			ˋ: e.MO.ACCENT,
			ˍ: e.MO.WIDEACCENT,
			"˘": e.MO.ACCENT,
			"˙": e.MO.ACCENT,
			"˚": e.MO.ACCENT,
			"˜": e.MO.WIDEACCENT,
			"˝": e.MO.ACCENT,
			"˷": e.MO.WIDEACCENT,
			"̂": e.MO.WIDEACCENT,
			"̑": e.MO.ACCENT,
			"϶": e.MO.REL,
			"‖": [
				0,
				0,
				n.TEXCLASS.ORD,
				{
					fence: !0,
					stretchy: !0
				}
			],
			"’": [
				0,
				0,
				n.TEXCLASS.CLOSE,
				{ fence: !0 }
			],
			"‚": e.MO.ACCENT,
			"‛": e.MO.ACCENT,
			"”": [
				0,
				0,
				n.TEXCLASS.CLOSE,
				{ fence: !0 }
			],
			"„": e.MO.ACCENT,
			"‟": e.MO.ACCENT,
			"′": e.MO.ORD,
			"″": e.MO.ACCENT,
			"‴": e.MO.ACCENT,
			"‵": e.MO.ACCENT,
			"‶": e.MO.ACCENT,
			"‷": e.MO.ACCENT,
			"‾": e.MO.WIDEACCENT,
			"⁗": e.MO.ACCENT,
			"⃛": e.MO.ACCENT,
			"⃜": e.MO.ACCENT,
			"⌉": e.MO.CLOSE,
			"⌋": e.MO.CLOSE,
			"〉": e.MO.CLOSE,
			"⎴": e.MO.WIDEACCENT,
			"⎵": e.MO.WIDEACCENT,
			"⏜": e.MO.WIDEACCENT,
			"⏝": e.MO.WIDEACCENT,
			"⏞": e.MO.WIDEACCENT,
			"⏟": e.MO.WIDEACCENT,
			"⏠": e.MO.WIDEACCENT,
			"⏡": e.MO.WIDEACCENT,
			"■": e.MO.BIN3,
			"□": e.MO.BIN3,
			"▪": e.MO.BIN3,
			"▫": e.MO.BIN3,
			"▭": e.MO.BIN3,
			"▮": e.MO.BIN3,
			"▯": e.MO.BIN3,
			"▰": e.MO.BIN3,
			"▱": e.MO.BIN3,
			"▲": e.MO.BIN4,
			"▴": e.MO.BIN4,
			"▶": e.MO.BIN4,
			"▷": e.MO.BIN4,
			"▸": e.MO.BIN4,
			"▼": e.MO.BIN4,
			"▾": e.MO.BIN4,
			"◀": e.MO.BIN4,
			"◁": e.MO.BIN4,
			"◂": e.MO.BIN4,
			"◄": e.MO.BIN4,
			"◅": e.MO.BIN4,
			"◆": e.MO.BIN4,
			"◇": e.MO.BIN4,
			"◈": e.MO.BIN4,
			"◉": e.MO.BIN4,
			"◌": e.MO.BIN4,
			"◍": e.MO.BIN4,
			"◎": e.MO.BIN4,
			"●": e.MO.BIN4,
			"◖": e.MO.BIN4,
			"◗": e.MO.BIN4,
			"◦": e.MO.BIN4,
			"♭": e.MO.ORD02,
			"♮": e.MO.ORD02,
			"♯": e.MO.ORD02,
			"❳": e.MO.CLOSE,
			"⟧": e.MO.CLOSE,
			"⟩": e.MO.CLOSE,
			"⟫": e.MO.CLOSE,
			"⟭": e.MO.CLOSE,
			"⟯": e.MO.CLOSE,
			"⦀": [
				0,
				0,
				n.TEXCLASS.ORD,
				{
					fence: !0,
					stretchy: !0
				}
			],
			"⦄": e.MO.CLOSE,
			"⦆": e.MO.CLOSE,
			"⦈": e.MO.CLOSE,
			"⦊": e.MO.CLOSE,
			"⦌": e.MO.CLOSE,
			"⦎": e.MO.CLOSE,
			"⦐": e.MO.CLOSE,
			"⦒": e.MO.CLOSE,
			"⦔": e.MO.CLOSE,
			"⦖": e.MO.CLOSE,
			"⦘": e.MO.CLOSE,
			"⧽": e.MO.CLOSE
		},
		infix: {
			"!=": e.MO.BIN4,
			"#": e.MO.ORD,
			$: e.MO.ORD,
			"%": [
				3,
				3,
				n.TEXCLASS.ORD,
				null
			],
			"&&": e.MO.BIN4,
			"": e.MO.ORD,
			"*": e.MO.BIN3,
			"**": r(1, 1),
			"*=": e.MO.BIN4,
			"+": e.MO.BIN4,
			"+=": e.MO.BIN4,
			",": [
				0,
				3,
				n.TEXCLASS.PUNCT,
				{
					linebreakstyle: "after",
					separator: !0
				}
			],
			"-": e.MO.BIN4,
			"-=": e.MO.BIN4,
			"->": e.MO.BIN5,
			".": [
				0,
				3,
				n.TEXCLASS.PUNCT,
				{ separator: !0 }
			],
			"/": e.MO.ORD11,
			"//": r(1, 1),
			"/=": e.MO.BIN4,
			":": [
				1,
				2,
				n.TEXCLASS.REL,
				null
			],
			":=": e.MO.BIN4,
			";": [
				0,
				3,
				n.TEXCLASS.PUNCT,
				{
					linebreakstyle: "after",
					separator: !0
				}
			],
			"<": e.MO.REL,
			"<=": e.MO.BIN5,
			"<>": r(1, 1),
			"=": e.MO.REL,
			"==": e.MO.BIN4,
			">": e.MO.REL,
			">=": e.MO.BIN5,
			"?": [
				1,
				1,
				n.TEXCLASS.CLOSE,
				null
			],
			"@": e.MO.ORD11,
			"\\": e.MO.ORD,
			"^": e.MO.ORD11,
			_: e.MO.ORD11,
			"|": [
				2,
				2,
				n.TEXCLASS.ORD,
				{
					fence: !0,
					stretchy: !0,
					symmetric: !0
				}
			],
			"||": [
				2,
				2,
				n.TEXCLASS.BIN,
				{
					fence: !0,
					stretchy: !0,
					symmetric: !0
				}
			],
			"|||": [
				2,
				2,
				n.TEXCLASS.ORD,
				{
					fence: !0,
					stretchy: !0,
					symmetric: !0
				}
			],
			"±": e.MO.BIN4,
			"·": e.MO.BIN4,
			"×": e.MO.BIN4,
			"÷": e.MO.BIN4,
			ʹ: e.MO.ORD,
			"̀": e.MO.ACCENT,
			"́": e.MO.ACCENT,
			"̃": e.MO.WIDEACCENT,
			"̄": e.MO.ACCENT,
			"̆": e.MO.ACCENT,
			"̇": e.MO.ACCENT,
			"̈": e.MO.ACCENT,
			"̌": e.MO.ACCENT,
			"̲": e.MO.WIDEACCENT,
			"̸": e.MO.REL4,
			"―": [
				0,
				0,
				n.TEXCLASS.ORD,
				{ stretchy: !0 }
			],
			"‗": [
				0,
				0,
				n.TEXCLASS.ORD,
				{ stretchy: !0 }
			],
			"†": e.MO.BIN3,
			"‡": e.MO.BIN3,
			"•": e.MO.BIN4,
			"…": e.MO.INNER,
			"⁃": e.MO.BIN4,
			"⁄": e.MO.TALLBIN,
			"⁡": e.MO.NONE,
			"⁢": e.MO.NONE,
			"⁣": [
				0,
				0,
				n.TEXCLASS.NONE,
				{
					linebreakstyle: "after",
					separator: !0
				}
			],
			"⁤": e.MO.NONE,
			"⃗": e.MO.ACCENT,
			ℑ: e.MO.ORD,
			ℓ: e.MO.ORD,
			℘: e.MO.ORD,
			ℜ: e.MO.ORD,
			"←": e.MO.WIDEREL,
			"↑": e.MO.RELSTRETCH,
			"→": e.MO.WIDEREL,
			"↓": e.MO.RELSTRETCH,
			"↔": e.MO.WIDEREL,
			"↕": e.MO.RELSTRETCH,
			"↖": e.MO.RELSTRETCH,
			"↗": e.MO.RELSTRETCH,
			"↘": e.MO.RELSTRETCH,
			"↙": e.MO.RELSTRETCH,
			"↚": e.MO.RELACCENT,
			"↛": e.MO.RELACCENT,
			"↜": e.MO.WIDEREL,
			"↝": e.MO.WIDEREL,
			"↞": e.MO.WIDEREL,
			"↟": e.MO.WIDEREL,
			"↠": e.MO.WIDEREL,
			"↡": e.MO.RELSTRETCH,
			"↢": e.MO.WIDEREL,
			"↣": e.MO.WIDEREL,
			"↤": e.MO.WIDEREL,
			"↥": e.MO.RELSTRETCH,
			"↦": e.MO.WIDEREL,
			"↧": e.MO.RELSTRETCH,
			"↨": e.MO.RELSTRETCH,
			"↩": e.MO.WIDEREL,
			"↪": e.MO.WIDEREL,
			"↫": e.MO.WIDEREL,
			"↬": e.MO.WIDEREL,
			"↭": e.MO.WIDEREL,
			"↮": e.MO.RELACCENT,
			"↯": e.MO.RELSTRETCH,
			"↰": e.MO.RELSTRETCH,
			"↱": e.MO.RELSTRETCH,
			"↲": e.MO.RELSTRETCH,
			"↳": e.MO.RELSTRETCH,
			"↴": e.MO.RELSTRETCH,
			"↵": e.MO.RELSTRETCH,
			"↶": e.MO.RELACCENT,
			"↷": e.MO.RELACCENT,
			"↸": e.MO.REL,
			"↹": e.MO.WIDEREL,
			"↺": e.MO.REL,
			"↻": e.MO.REL,
			"↼": e.MO.WIDEREL,
			"↽": e.MO.WIDEREL,
			"↾": e.MO.RELSTRETCH,
			"↿": e.MO.RELSTRETCH,
			"⇀": e.MO.WIDEREL,
			"⇁": e.MO.WIDEREL,
			"⇂": e.MO.RELSTRETCH,
			"⇃": e.MO.RELSTRETCH,
			"⇄": e.MO.WIDEREL,
			"⇅": e.MO.RELSTRETCH,
			"⇆": e.MO.WIDEREL,
			"⇇": e.MO.WIDEREL,
			"⇈": e.MO.RELSTRETCH,
			"⇉": e.MO.WIDEREL,
			"⇊": e.MO.RELSTRETCH,
			"⇋": e.MO.WIDEREL,
			"⇌": e.MO.WIDEREL,
			"⇍": e.MO.RELACCENT,
			"⇎": e.MO.RELACCENT,
			"⇏": e.MO.RELACCENT,
			"⇐": e.MO.WIDEREL,
			"⇑": e.MO.RELSTRETCH,
			"⇒": e.MO.WIDEREL,
			"⇓": e.MO.RELSTRETCH,
			"⇔": e.MO.WIDEREL,
			"⇕": e.MO.RELSTRETCH,
			"⇖": e.MO.RELSTRETCH,
			"⇗": e.MO.RELSTRETCH,
			"⇘": e.MO.RELSTRETCH,
			"⇙": e.MO.RELSTRETCH,
			"⇚": e.MO.WIDEREL,
			"⇛": e.MO.WIDEREL,
			"⇜": e.MO.WIDEREL,
			"⇝": e.MO.WIDEREL,
			"⇞": e.MO.REL,
			"⇟": e.MO.REL,
			"⇠": e.MO.WIDEREL,
			"⇡": e.MO.RELSTRETCH,
			"⇢": e.MO.WIDEREL,
			"⇣": e.MO.RELSTRETCH,
			"⇤": e.MO.WIDEREL,
			"⇥": e.MO.WIDEREL,
			"⇦": e.MO.WIDEREL,
			"⇧": e.MO.RELSTRETCH,
			"⇨": e.MO.WIDEREL,
			"⇩": e.MO.RELSTRETCH,
			"⇪": e.MO.RELSTRETCH,
			"⇫": e.MO.RELSTRETCH,
			"⇬": e.MO.RELSTRETCH,
			"⇭": e.MO.RELSTRETCH,
			"⇮": e.MO.RELSTRETCH,
			"⇯": e.MO.RELSTRETCH,
			"⇰": e.MO.WIDEREL,
			"⇱": e.MO.REL,
			"⇲": e.MO.REL,
			"⇳": e.MO.RELSTRETCH,
			"⇴": e.MO.RELACCENT,
			"⇵": e.MO.RELSTRETCH,
			"⇶": e.MO.WIDEREL,
			"⇷": e.MO.RELACCENT,
			"⇸": e.MO.RELACCENT,
			"⇹": e.MO.RELACCENT,
			"⇺": e.MO.RELACCENT,
			"⇻": e.MO.RELACCENT,
			"⇼": e.MO.RELACCENT,
			"⇽": e.MO.WIDEREL,
			"⇾": e.MO.WIDEREL,
			"⇿": e.MO.WIDEREL,
			"∁": r(1, 2, n.TEXCLASS.ORD),
			"∅": e.MO.ORD,
			"∆": e.MO.BIN3,
			"∈": e.MO.REL,
			"∉": e.MO.REL,
			"∊": e.MO.REL,
			"∋": e.MO.REL,
			"∌": e.MO.REL,
			"∍": e.MO.REL,
			"∎": e.MO.BIN3,
			"−": e.MO.BIN4,
			"∓": e.MO.BIN4,
			"∔": e.MO.BIN4,
			"∕": e.MO.TALLBIN,
			"∖": e.MO.BIN4,
			"∗": e.MO.BIN4,
			"∘": e.MO.BIN4,
			"∙": e.MO.BIN4,
			"∝": e.MO.REL,
			"∞": e.MO.ORD,
			"∟": e.MO.REL,
			"∣": e.MO.REL,
			"∤": e.MO.REL,
			"∥": e.MO.REL,
			"∦": e.MO.REL,
			"∧": e.MO.BIN4,
			"∨": e.MO.BIN4,
			"∩": e.MO.BIN4,
			"∪": e.MO.BIN4,
			"∴": e.MO.REL,
			"∵": e.MO.REL,
			"∶": e.MO.REL,
			"∷": e.MO.REL,
			"∸": e.MO.BIN4,
			"∹": e.MO.REL,
			"∺": e.MO.BIN4,
			"∻": e.MO.REL,
			"∼": e.MO.REL,
			"∽": e.MO.REL,
			"∽̱": e.MO.BIN3,
			"∾": e.MO.REL,
			"∿": e.MO.BIN3,
			"≀": e.MO.BIN4,
			"≁": e.MO.REL,
			"≂": e.MO.REL,
			"≂̸": e.MO.REL,
			"≃": e.MO.REL,
			"≄": e.MO.REL,
			"≅": e.MO.REL,
			"≆": e.MO.REL,
			"≇": e.MO.REL,
			"≈": e.MO.REL,
			"≉": e.MO.REL,
			"≊": e.MO.REL,
			"≋": e.MO.REL,
			"≌": e.MO.REL,
			"≍": e.MO.REL,
			"≎": e.MO.REL,
			"≎̸": e.MO.REL,
			"≏": e.MO.REL,
			"≏̸": e.MO.REL,
			"≐": e.MO.REL,
			"≑": e.MO.REL,
			"≒": e.MO.REL,
			"≓": e.MO.REL,
			"≔": e.MO.REL,
			"≕": e.MO.REL,
			"≖": e.MO.REL,
			"≗": e.MO.REL,
			"≘": e.MO.REL,
			"≙": e.MO.REL,
			"≚": e.MO.REL,
			"≛": e.MO.REL,
			"≜": e.MO.REL,
			"≝": e.MO.REL,
			"≞": e.MO.REL,
			"≟": e.MO.REL,
			"≠": e.MO.REL,
			"≡": e.MO.REL,
			"≢": e.MO.REL,
			"≣": e.MO.REL,
			"≤": e.MO.REL,
			"≥": e.MO.REL,
			"≦": e.MO.REL,
			"≦̸": e.MO.REL,
			"≧": e.MO.REL,
			"≨": e.MO.REL,
			"≩": e.MO.REL,
			"≪": e.MO.REL,
			"≪̸": e.MO.REL,
			"≫": e.MO.REL,
			"≫̸": e.MO.REL,
			"≬": e.MO.REL,
			"≭": e.MO.REL,
			"≮": e.MO.REL,
			"≯": e.MO.REL,
			"≰": e.MO.REL,
			"≱": e.MO.REL,
			"≲": e.MO.REL,
			"≳": e.MO.REL,
			"≴": e.MO.REL,
			"≵": e.MO.REL,
			"≶": e.MO.REL,
			"≷": e.MO.REL,
			"≸": e.MO.REL,
			"≹": e.MO.REL,
			"≺": e.MO.REL,
			"≻": e.MO.REL,
			"≼": e.MO.REL,
			"≽": e.MO.REL,
			"≾": e.MO.REL,
			"≿": e.MO.REL,
			"≿̸": e.MO.REL,
			"⊀": e.MO.REL,
			"⊁": e.MO.REL,
			"⊂": e.MO.REL,
			"⊂⃒": e.MO.REL,
			"⊃": e.MO.REL,
			"⊃⃒": e.MO.REL,
			"⊄": e.MO.REL,
			"⊅": e.MO.REL,
			"⊆": e.MO.REL,
			"⊇": e.MO.REL,
			"⊈": e.MO.REL,
			"⊉": e.MO.REL,
			"⊊": e.MO.REL,
			"⊋": e.MO.REL,
			"⊌": e.MO.BIN4,
			"⊍": e.MO.BIN4,
			"⊎": e.MO.BIN4,
			"⊏": e.MO.REL,
			"⊏̸": e.MO.REL,
			"⊐": e.MO.REL,
			"⊐̸": e.MO.REL,
			"⊑": e.MO.REL,
			"⊒": e.MO.REL,
			"⊓": e.MO.BIN4,
			"⊔": e.MO.BIN4,
			"⊕": e.MO.BIN4,
			"⊖": e.MO.BIN4,
			"⊗": e.MO.BIN4,
			"⊘": e.MO.BIN4,
			"⊙": e.MO.BIN4,
			"⊚": e.MO.BIN4,
			"⊛": e.MO.BIN4,
			"⊜": e.MO.BIN4,
			"⊝": e.MO.BIN4,
			"⊞": e.MO.BIN4,
			"⊟": e.MO.BIN4,
			"⊠": e.MO.BIN4,
			"⊡": e.MO.BIN4,
			"⊢": e.MO.REL,
			"⊣": e.MO.REL,
			"⊤": e.MO.ORD55,
			"⊥": e.MO.REL,
			"⊦": e.MO.REL,
			"⊧": e.MO.REL,
			"⊨": e.MO.REL,
			"⊩": e.MO.REL,
			"⊪": e.MO.REL,
			"⊫": e.MO.REL,
			"⊬": e.MO.REL,
			"⊭": e.MO.REL,
			"⊮": e.MO.REL,
			"⊯": e.MO.REL,
			"⊰": e.MO.REL,
			"⊱": e.MO.REL,
			"⊲": e.MO.REL,
			"⊳": e.MO.REL,
			"⊴": e.MO.REL,
			"⊵": e.MO.REL,
			"⊶": e.MO.REL,
			"⊷": e.MO.REL,
			"⊸": e.MO.REL,
			"⊹": e.MO.REL,
			"⊺": e.MO.BIN4,
			"⊻": e.MO.BIN4,
			"⊼": e.MO.BIN4,
			"⊽": e.MO.BIN4,
			"⊾": e.MO.BIN3,
			"⊿": e.MO.BIN3,
			"⋄": e.MO.BIN4,
			"⋅": e.MO.BIN4,
			"⋆": e.MO.BIN4,
			"⋇": e.MO.BIN4,
			"⋈": e.MO.REL,
			"⋉": e.MO.BIN4,
			"⋊": e.MO.BIN4,
			"⋋": e.MO.BIN4,
			"⋌": e.MO.BIN4,
			"⋍": e.MO.REL,
			"⋎": e.MO.BIN4,
			"⋏": e.MO.BIN4,
			"⋐": e.MO.REL,
			"⋑": e.MO.REL,
			"⋒": e.MO.BIN4,
			"⋓": e.MO.BIN4,
			"⋔": e.MO.REL,
			"⋕": e.MO.REL,
			"⋖": e.MO.REL,
			"⋗": e.MO.REL,
			"⋘": e.MO.REL,
			"⋙": e.MO.REL,
			"⋚": e.MO.REL,
			"⋛": e.MO.REL,
			"⋜": e.MO.REL,
			"⋝": e.MO.REL,
			"⋞": e.MO.REL,
			"⋟": e.MO.REL,
			"⋠": e.MO.REL,
			"⋡": e.MO.REL,
			"⋢": e.MO.REL,
			"⋣": e.MO.REL,
			"⋤": e.MO.REL,
			"⋥": e.MO.REL,
			"⋦": e.MO.REL,
			"⋧": e.MO.REL,
			"⋨": e.MO.REL,
			"⋩": e.MO.REL,
			"⋪": e.MO.REL,
			"⋫": e.MO.REL,
			"⋬": e.MO.REL,
			"⋭": e.MO.REL,
			"⋮": e.MO.ORD55,
			"⋯": e.MO.INNER,
			"⋰": e.MO.REL,
			"⋱": [
				5,
				5,
				n.TEXCLASS.INNER,
				null
			],
			"⋲": e.MO.REL,
			"⋳": e.MO.REL,
			"⋴": e.MO.REL,
			"⋵": e.MO.REL,
			"⋶": e.MO.REL,
			"⋷": e.MO.REL,
			"⋸": e.MO.REL,
			"⋹": e.MO.REL,
			"⋺": e.MO.REL,
			"⋻": e.MO.REL,
			"⋼": e.MO.REL,
			"⋽": e.MO.REL,
			"⋾": e.MO.REL,
			"⋿": e.MO.REL,
			"⌅": e.MO.BIN3,
			"⌆": e.MO.BIN3,
			"⌢": e.MO.REL4,
			"⌣": e.MO.REL4,
			"〈": e.MO.OPEN,
			"〉": e.MO.CLOSE,
			"⎪": e.MO.ORD,
			"⎯": [
				0,
				0,
				n.TEXCLASS.ORD,
				{ stretchy: !0 }
			],
			"⎰": e.MO.OPEN,
			"⎱": e.MO.CLOSE,
			"─": e.MO.ORD,
			"△": e.MO.BIN4,
			"▵": e.MO.BIN4,
			"▹": e.MO.BIN4,
			"▽": e.MO.BIN4,
			"▿": e.MO.BIN4,
			"◃": e.MO.BIN4,
			"◯": e.MO.BIN3,
			"♠": e.MO.ORD,
			"♡": e.MO.ORD,
			"♢": e.MO.ORD,
			"♣": e.MO.ORD,
			"❘": e.MO.REL,
			"⟰": e.MO.RELSTRETCH,
			"⟱": e.MO.RELSTRETCH,
			"⟵": e.MO.WIDEREL,
			"⟶": e.MO.WIDEREL,
			"⟷": e.MO.WIDEREL,
			"⟸": e.MO.WIDEREL,
			"⟹": e.MO.WIDEREL,
			"⟺": e.MO.WIDEREL,
			"⟻": e.MO.WIDEREL,
			"⟼": e.MO.WIDEREL,
			"⟽": e.MO.WIDEREL,
			"⟾": e.MO.WIDEREL,
			"⟿": e.MO.WIDEREL,
			"⤀": e.MO.RELACCENT,
			"⤁": e.MO.RELACCENT,
			"⤂": e.MO.RELACCENT,
			"⤃": e.MO.RELACCENT,
			"⤄": e.MO.RELACCENT,
			"⤅": e.MO.RELACCENT,
			"⤆": e.MO.RELACCENT,
			"⤇": e.MO.RELACCENT,
			"⤈": e.MO.REL,
			"⤉": e.MO.REL,
			"⤊": e.MO.RELSTRETCH,
			"⤋": e.MO.RELSTRETCH,
			"⤌": e.MO.WIDEREL,
			"⤍": e.MO.WIDEREL,
			"⤎": e.MO.WIDEREL,
			"⤏": e.MO.WIDEREL,
			"⤐": e.MO.WIDEREL,
			"⤑": e.MO.RELACCENT,
			"⤒": e.MO.RELSTRETCH,
			"⤓": e.MO.RELSTRETCH,
			"⤔": e.MO.RELACCENT,
			"⤕": e.MO.RELACCENT,
			"⤖": e.MO.RELACCENT,
			"⤗": e.MO.RELACCENT,
			"⤘": e.MO.RELACCENT,
			"⤙": e.MO.RELACCENT,
			"⤚": e.MO.RELACCENT,
			"⤛": e.MO.RELACCENT,
			"⤜": e.MO.RELACCENT,
			"⤝": e.MO.RELACCENT,
			"⤞": e.MO.RELACCENT,
			"⤟": e.MO.RELACCENT,
			"⤠": e.MO.RELACCENT,
			"⤡": e.MO.RELSTRETCH,
			"⤢": e.MO.RELSTRETCH,
			"⤣": e.MO.REL,
			"⤤": e.MO.REL,
			"⤥": e.MO.REL,
			"⤦": e.MO.REL,
			"⤧": e.MO.REL,
			"⤨": e.MO.REL,
			"⤩": e.MO.REL,
			"⤪": e.MO.REL,
			"⤫": e.MO.REL,
			"⤬": e.MO.REL,
			"⤭": e.MO.REL,
			"⤮": e.MO.REL,
			"⤯": e.MO.REL,
			"⤰": e.MO.REL,
			"⤱": e.MO.REL,
			"⤲": e.MO.REL,
			"⤳": e.MO.RELACCENT,
			"⤴": e.MO.REL,
			"⤵": e.MO.REL,
			"⤶": e.MO.REL,
			"⤷": e.MO.REL,
			"⤸": e.MO.REL,
			"⤹": e.MO.REL,
			"⤺": e.MO.RELACCENT,
			"⤻": e.MO.RELACCENT,
			"⤼": e.MO.RELACCENT,
			"⤽": e.MO.RELACCENT,
			"⤾": e.MO.REL,
			"⤿": e.MO.REL,
			"⥀": e.MO.REL,
			"⥁": e.MO.REL,
			"⥂": e.MO.RELACCENT,
			"⥃": e.MO.RELACCENT,
			"⥄": e.MO.RELACCENT,
			"⥅": e.MO.RELACCENT,
			"⥆": e.MO.RELACCENT,
			"⥇": e.MO.RELACCENT,
			"⥈": e.MO.RELACCENT,
			"⥉": e.MO.REL,
			"⥊": e.MO.RELACCENT,
			"⥋": e.MO.RELACCENT,
			"⥌": e.MO.REL,
			"⥍": e.MO.REL,
			"⥎": e.MO.WIDEREL,
			"⥏": e.MO.RELSTRETCH,
			"⥐": e.MO.WIDEREL,
			"⥑": e.MO.RELSTRETCH,
			"⥒": e.MO.WIDEREL,
			"⥓": e.MO.WIDEREL,
			"⥔": e.MO.RELSTRETCH,
			"⥕": e.MO.RELSTRETCH,
			"⥖": e.MO.RELSTRETCH,
			"⥗": e.MO.RELSTRETCH,
			"⥘": e.MO.RELSTRETCH,
			"⥙": e.MO.RELSTRETCH,
			"⥚": e.MO.WIDEREL,
			"⥛": e.MO.WIDEREL,
			"⥜": e.MO.RELSTRETCH,
			"⥝": e.MO.RELSTRETCH,
			"⥞": e.MO.WIDEREL,
			"⥟": e.MO.WIDEREL,
			"⥠": e.MO.RELSTRETCH,
			"⥡": e.MO.RELSTRETCH,
			"⥢": e.MO.RELACCENT,
			"⥣": e.MO.REL,
			"⥤": e.MO.RELACCENT,
			"⥥": e.MO.REL,
			"⥦": e.MO.RELACCENT,
			"⥧": e.MO.RELACCENT,
			"⥨": e.MO.RELACCENT,
			"⥩": e.MO.RELACCENT,
			"⥪": e.MO.RELACCENT,
			"⥫": e.MO.RELACCENT,
			"⥬": e.MO.RELACCENT,
			"⥭": e.MO.RELACCENT,
			"⥮": e.MO.RELSTRETCH,
			"⥯": e.MO.RELSTRETCH,
			"⥰": e.MO.RELACCENT,
			"⥱": e.MO.RELACCENT,
			"⥲": e.MO.RELACCENT,
			"⥳": e.MO.RELACCENT,
			"⥴": e.MO.RELACCENT,
			"⥵": e.MO.RELACCENT,
			"⥶": e.MO.RELACCENT,
			"⥷": e.MO.RELACCENT,
			"⥸": e.MO.RELACCENT,
			"⥹": e.MO.RELACCENT,
			"⥺": e.MO.RELACCENT,
			"⥻": e.MO.RELACCENT,
			"⥼": e.MO.RELACCENT,
			"⥽": e.MO.RELACCENT,
			"⥾": e.MO.REL,
			"⥿": e.MO.REL,
			"⦁": e.MO.BIN3,
			"⦂": e.MO.BIN3,
			"⦙": e.MO.BIN3,
			"⦚": e.MO.BIN3,
			"⦛": e.MO.BIN3,
			"⦜": e.MO.BIN3,
			"⦝": e.MO.BIN3,
			"⦞": e.MO.BIN3,
			"⦟": e.MO.BIN3,
			"⦠": e.MO.BIN3,
			"⦡": e.MO.BIN3,
			"⦢": e.MO.BIN3,
			"⦣": e.MO.BIN3,
			"⦤": e.MO.BIN3,
			"⦥": e.MO.BIN3,
			"⦦": e.MO.BIN3,
			"⦧": e.MO.BIN3,
			"⦨": e.MO.BIN3,
			"⦩": e.MO.BIN3,
			"⦪": e.MO.BIN3,
			"⦫": e.MO.BIN3,
			"⦬": e.MO.BIN3,
			"⦭": e.MO.BIN3,
			"⦮": e.MO.BIN3,
			"⦯": e.MO.BIN3,
			"⦰": e.MO.BIN3,
			"⦱": e.MO.BIN3,
			"⦲": e.MO.BIN3,
			"⦳": e.MO.BIN3,
			"⦴": e.MO.BIN3,
			"⦵": e.MO.BIN3,
			"⦶": e.MO.BIN4,
			"⦷": e.MO.BIN4,
			"⦸": e.MO.BIN4,
			"⦹": e.MO.BIN4,
			"⦺": e.MO.BIN4,
			"⦻": e.MO.BIN4,
			"⦼": e.MO.BIN4,
			"⦽": e.MO.BIN4,
			"⦾": e.MO.BIN4,
			"⦿": e.MO.BIN4,
			"⧀": e.MO.REL,
			"⧁": e.MO.REL,
			"⧂": e.MO.BIN3,
			"⧃": e.MO.BIN3,
			"⧄": e.MO.BIN4,
			"⧅": e.MO.BIN4,
			"⧆": e.MO.BIN4,
			"⧇": e.MO.BIN4,
			"⧈": e.MO.BIN4,
			"⧉": e.MO.BIN3,
			"⧊": e.MO.BIN3,
			"⧋": e.MO.BIN3,
			"⧌": e.MO.BIN3,
			"⧍": e.MO.BIN3,
			"⧎": e.MO.REL,
			"⧏": e.MO.REL,
			"⧏̸": e.MO.REL,
			"⧐": e.MO.REL,
			"⧐̸": e.MO.REL,
			"⧑": e.MO.REL,
			"⧒": e.MO.REL,
			"⧓": e.MO.REL,
			"⧔": e.MO.REL,
			"⧕": e.MO.REL,
			"⧖": e.MO.BIN4,
			"⧗": e.MO.BIN4,
			"⧘": e.MO.BIN3,
			"⧙": e.MO.BIN3,
			"⧛": e.MO.BIN3,
			"⧜": e.MO.BIN3,
			"⧝": e.MO.BIN3,
			"⧞": e.MO.REL,
			"⧟": e.MO.BIN3,
			"⧠": e.MO.BIN3,
			"⧡": e.MO.REL,
			"⧢": e.MO.BIN4,
			"⧣": e.MO.REL,
			"⧤": e.MO.REL,
			"⧥": e.MO.REL,
			"⧦": e.MO.REL,
			"⧧": e.MO.BIN3,
			"⧨": e.MO.BIN3,
			"⧩": e.MO.BIN3,
			"⧪": e.MO.BIN3,
			"⧫": e.MO.BIN3,
			"⧬": e.MO.BIN3,
			"⧭": e.MO.BIN3,
			"⧮": e.MO.BIN3,
			"⧯": e.MO.BIN3,
			"⧰": e.MO.BIN3,
			"⧱": e.MO.BIN3,
			"⧲": e.MO.BIN3,
			"⧳": e.MO.BIN3,
			"⧴": e.MO.REL,
			"⧵": e.MO.BIN4,
			"⧶": e.MO.BIN4,
			"⧷": e.MO.BIN4,
			"⧸": e.MO.BIN3,
			"⧹": e.MO.BIN3,
			"⧺": e.MO.BIN3,
			"⧻": e.MO.BIN3,
			"⧾": e.MO.BIN4,
			"⧿": e.MO.BIN4,
			"⨝": e.MO.BIN3,
			"⨞": e.MO.BIN3,
			"⨟": e.MO.BIN3,
			"⨠": e.MO.BIN3,
			"⨡": e.MO.BIN3,
			"⨢": e.MO.BIN4,
			"⨣": e.MO.BIN4,
			"⨤": e.MO.BIN4,
			"⨥": e.MO.BIN4,
			"⨦": e.MO.BIN4,
			"⨧": e.MO.BIN4,
			"⨨": e.MO.BIN4,
			"⨩": e.MO.BIN4,
			"⨪": e.MO.BIN4,
			"⨫": e.MO.BIN4,
			"⨬": e.MO.BIN4,
			"⨭": e.MO.BIN4,
			"⨮": e.MO.BIN4,
			"⨯": e.MO.BIN4,
			"⨰": e.MO.BIN4,
			"⨱": e.MO.BIN4,
			"⨲": e.MO.BIN4,
			"⨳": e.MO.BIN4,
			"⨴": e.MO.BIN4,
			"⨵": e.MO.BIN4,
			"⨶": e.MO.BIN4,
			"⨷": e.MO.BIN4,
			"⨸": e.MO.BIN4,
			"⨹": e.MO.BIN4,
			"⨺": e.MO.BIN4,
			"⨻": e.MO.BIN4,
			"⨼": e.MO.BIN4,
			"⨽": e.MO.BIN4,
			"⨾": e.MO.BIN4,
			"⨿": e.MO.BIN4,
			"⩀": e.MO.BIN4,
			"⩁": e.MO.BIN4,
			"⩂": e.MO.BIN4,
			"⩃": e.MO.BIN4,
			"⩄": e.MO.BIN4,
			"⩅": e.MO.BIN4,
			"⩆": e.MO.BIN4,
			"⩇": e.MO.BIN4,
			"⩈": e.MO.BIN4,
			"⩉": e.MO.BIN4,
			"⩊": e.MO.BIN4,
			"⩋": e.MO.BIN4,
			"⩌": e.MO.BIN4,
			"⩍": e.MO.BIN4,
			"⩎": e.MO.BIN4,
			"⩏": e.MO.BIN4,
			"⩐": e.MO.BIN4,
			"⩑": e.MO.BIN4,
			"⩒": e.MO.BIN4,
			"⩓": e.MO.BIN4,
			"⩔": e.MO.BIN4,
			"⩕": e.MO.BIN4,
			"⩖": e.MO.BIN4,
			"⩗": e.MO.BIN4,
			"⩘": e.MO.BIN4,
			"⩙": e.MO.REL,
			"⩚": e.MO.BIN4,
			"⩛": e.MO.BIN4,
			"⩜": e.MO.BIN4,
			"⩝": e.MO.BIN4,
			"⩞": e.MO.BIN4,
			"⩟": e.MO.BIN4,
			"⩠": e.MO.BIN4,
			"⩡": e.MO.BIN4,
			"⩢": e.MO.BIN4,
			"⩣": e.MO.BIN4,
			"⩤": e.MO.BIN4,
			"⩥": e.MO.BIN4,
			"⩦": e.MO.REL,
			"⩧": e.MO.REL,
			"⩨": e.MO.REL,
			"⩩": e.MO.REL,
			"⩪": e.MO.REL,
			"⩫": e.MO.REL,
			"⩬": e.MO.REL,
			"⩭": e.MO.REL,
			"⩮": e.MO.REL,
			"⩯": e.MO.REL,
			"⩰": e.MO.REL,
			"⩱": e.MO.BIN4,
			"⩲": e.MO.BIN4,
			"⩳": e.MO.REL,
			"⩴": e.MO.REL,
			"⩵": e.MO.REL,
			"⩶": e.MO.REL,
			"⩷": e.MO.REL,
			"⩸": e.MO.REL,
			"⩹": e.MO.REL,
			"⩺": e.MO.REL,
			"⩻": e.MO.REL,
			"⩼": e.MO.REL,
			"⩽": e.MO.REL,
			"⩽̸": e.MO.REL,
			"⩾": e.MO.REL,
			"⩾̸": e.MO.REL,
			"⩿": e.MO.REL,
			"⪀": e.MO.REL,
			"⪁": e.MO.REL,
			"⪂": e.MO.REL,
			"⪃": e.MO.REL,
			"⪄": e.MO.REL,
			"⪅": e.MO.REL,
			"⪆": e.MO.REL,
			"⪇": e.MO.REL,
			"⪈": e.MO.REL,
			"⪉": e.MO.REL,
			"⪊": e.MO.REL,
			"⪋": e.MO.REL,
			"⪌": e.MO.REL,
			"⪍": e.MO.REL,
			"⪎": e.MO.REL,
			"⪏": e.MO.REL,
			"⪐": e.MO.REL,
			"⪑": e.MO.REL,
			"⪒": e.MO.REL,
			"⪓": e.MO.REL,
			"⪔": e.MO.REL,
			"⪕": e.MO.REL,
			"⪖": e.MO.REL,
			"⪗": e.MO.REL,
			"⪘": e.MO.REL,
			"⪙": e.MO.REL,
			"⪚": e.MO.REL,
			"⪛": e.MO.REL,
			"⪜": e.MO.REL,
			"⪝": e.MO.REL,
			"⪞": e.MO.REL,
			"⪟": e.MO.REL,
			"⪠": e.MO.REL,
			"⪡": e.MO.REL,
			"⪡̸": e.MO.REL,
			"⪢": e.MO.REL,
			"⪢̸": e.MO.REL,
			"⪣": e.MO.REL,
			"⪤": e.MO.REL,
			"⪥": e.MO.REL,
			"⪦": e.MO.REL,
			"⪧": e.MO.REL,
			"⪨": e.MO.REL,
			"⪩": e.MO.REL,
			"⪪": e.MO.REL,
			"⪫": e.MO.REL,
			"⪬": e.MO.REL,
			"⪭": e.MO.REL,
			"⪮": e.MO.REL,
			"⪯": e.MO.REL,
			"⪯̸": e.MO.REL,
			"⪰": e.MO.REL,
			"⪰̸": e.MO.REL,
			"⪱": e.MO.REL,
			"⪲": e.MO.REL,
			"⪳": e.MO.REL,
			"⪴": e.MO.REL,
			"⪵": e.MO.REL,
			"⪶": e.MO.REL,
			"⪷": e.MO.REL,
			"⪸": e.MO.REL,
			"⪹": e.MO.REL,
			"⪺": e.MO.REL,
			"⪻": e.MO.REL,
			"⪼": e.MO.REL,
			"⪽": e.MO.REL,
			"⪾": e.MO.REL,
			"⪿": e.MO.REL,
			"⫀": e.MO.REL,
			"⫁": e.MO.REL,
			"⫂": e.MO.REL,
			"⫃": e.MO.REL,
			"⫄": e.MO.REL,
			"⫅": e.MO.REL,
			"⫆": e.MO.REL,
			"⫇": e.MO.REL,
			"⫈": e.MO.REL,
			"⫉": e.MO.REL,
			"⫊": e.MO.REL,
			"⫋": e.MO.REL,
			"⫌": e.MO.REL,
			"⫍": e.MO.REL,
			"⫎": e.MO.REL,
			"⫏": e.MO.REL,
			"⫐": e.MO.REL,
			"⫑": e.MO.REL,
			"⫒": e.MO.REL,
			"⫓": e.MO.REL,
			"⫔": e.MO.REL,
			"⫕": e.MO.REL,
			"⫖": e.MO.REL,
			"⫗": e.MO.REL,
			"⫘": e.MO.REL,
			"⫙": e.MO.REL,
			"⫚": e.MO.REL,
			"⫛": e.MO.REL,
			"⫝": e.MO.REL,
			"⫝̸": e.MO.REL,
			"⫞": e.MO.REL,
			"⫟": e.MO.REL,
			"⫠": e.MO.REL,
			"⫡": e.MO.REL,
			"⫢": e.MO.REL,
			"⫣": e.MO.REL,
			"⫤": e.MO.REL,
			"⫥": e.MO.REL,
			"⫦": e.MO.REL,
			"⫧": e.MO.REL,
			"⫨": e.MO.REL,
			"⫩": e.MO.REL,
			"⫪": e.MO.REL,
			"⫫": e.MO.REL,
			"⫬": e.MO.REL,
			"⫭": e.MO.REL,
			"⫮": e.MO.REL,
			"⫯": e.MO.REL,
			"⫰": e.MO.REL,
			"⫱": e.MO.REL,
			"⫲": e.MO.REL,
			"⫳": e.MO.REL,
			"⫴": e.MO.BIN4,
			"⫵": e.MO.BIN4,
			"⫶": e.MO.BIN4,
			"⫷": e.MO.REL,
			"⫸": e.MO.REL,
			"⫹": e.MO.REL,
			"⫺": e.MO.REL,
			"⫻": e.MO.BIN4,
			"⫽": e.MO.BIN4,
			"⫾": e.MO.BIN3,
			"⭅": e.MO.RELSTRETCH,
			"⭆": e.MO.RELSTRETCH,
			"〈": e.MO.OPEN,
			"〉": e.MO.CLOSE,
			"︷": e.MO.WIDEACCENT,
			"︸": e.MO.WIDEACCENT
		}
	}, e.OPTABLE.infix["^"] = e.MO.WIDEREL, e.OPTABLE.infix._ = e.MO.WIDEREL, e.OPTABLE.infix["⫝̸"] = e.MO.REL;
})), l = /* @__PURE__ */ e(((e) => {
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
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.split = e.isPercent = e.unicodeString = e.unicodeChars = e.quotePattern = e.sortLength = void 0;
	function r(e, t) {
		return e.length === t.length ? e === t ? 0 : e < t ? -1 : 1 : t.length - e.length;
	}
	e.sortLength = r;
	function i(e) {
		return e.replace(/([\^$(){}+*?\-|\[\]\:\\])/g, "\\$1");
	}
	e.quotePattern = i;
	function a(e) {
		return Array.from(e).map(function(e) {
			return e.codePointAt(0);
		});
	}
	e.unicodeChars = a;
	function o(e) {
		return String.fromCodePoint.apply(String, n([], t(e), !1));
	}
	e.unicodeString = o;
	function s(e) {
		return !!e.match(/%\s*$/);
	}
	e.isPercent = s;
	function c(e) {
		return e.trim().split(/\s+/);
	}
	e.split = c;
})), u = /* @__PURE__ */ e(((e) => {
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
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMo = void 0;
	var a = s(), o = c(), u = l();
	e.MmlMo = function(e) {
		t(s, e);
		function s() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t._texClass = null, t.lspace = 5 / 18, t.rspace = 5 / 18, t;
		}
		return Object.defineProperty(s.prototype, "texClass", {
			get: function() {
				if (this._texClass === null) {
					var e = this.getText(), t = r(this.handleExplicitForm(this.getForms()), 3), n = t[0], i = t[1], o = t[2], s = this.constructor.OPTABLE, c = s[n][e] || s[i][e] || s[o][e];
					return c ? c[2] : a.TEXCLASS.REL;
				}
				return this._texClass;
			},
			set: function(e) {
				this._texClass = e;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(s.prototype, "kind", {
			get: function() {
				return "mo";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(s.prototype, "isEmbellished", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(s.prototype, "hasNewLine", {
			get: function() {
				return this.attributes.get("linebreak") === "newline";
			},
			enumerable: !1,
			configurable: !0
		}), s.prototype.coreParent = function() {
			for (var e = this, t = this, n = this.factory.getNodeClass("math"); t && t.isEmbellished && t.coreMO() === this && !(t instanceof n);) e = t, t = t.parent;
			return e;
		}, s.prototype.coreText = function(e) {
			if (!e) return "";
			if (e.isEmbellished) return e.coreMO().getText();
			for (; ((e.isKind("mrow") || e.isKind("TeXAtom") && e.texClass !== a.TEXCLASS.VCENTER || e.isKind("mstyle") || e.isKind("mphantom")) && e.childNodes.length === 1 || e.isKind("munderover")) && e.childNodes[0];) e = e.childNodes[0];
			return e.isToken ? e.getText() : "";
		}, s.prototype.hasSpacingAttributes = function() {
			return this.attributes.isSet("lspace") || this.attributes.isSet("rspace");
		}, Object.defineProperty(s.prototype, "isAccent", {
			get: function() {
				var e = !1, t = this.coreParent().parent;
				if (t) {
					var n = t.isKind("mover") ? t.childNodes[t.over].coreMO() ? "accent" : "" : t.isKind("munder") ? t.childNodes[t.under].coreMO() ? "accentunder" : "" : t.isKind("munderover") ? this === t.childNodes[t.over].coreMO() ? "accent" : this === t.childNodes[t.under].coreMO() ? "accentunder" : "" : "";
					n && (e = t.attributes.getExplicit(n) === void 0 ? this.attributes.get("accent") : e);
				}
				return e;
			},
			enumerable: !1,
			configurable: !0
		}), s.prototype.setTeXclass = function(e) {
			var t = this.attributes.getList("form", "fence"), n = t.form, r = t.fence;
			return this.getProperty("texClass") === void 0 && (this.attributes.isSet("lspace") || this.attributes.isSet("rspace")) ? null : (r && this.texClass === a.TEXCLASS.REL && (n === "prefix" && (this.texClass = a.TEXCLASS.OPEN), n === "postfix" && (this.texClass = a.TEXCLASS.CLOSE)), this.adjustTeXclass(e));
		}, s.prototype.adjustTeXclass = function(e) {
			var t = this.texClass, n = this.prevClass;
			if (t === a.TEXCLASS.NONE) return e;
			if (e ? (e.getProperty("autoOP") && (t === a.TEXCLASS.BIN || t === a.TEXCLASS.REL) && (n = e.texClass = a.TEXCLASS.ORD), n = this.prevClass = e.texClass || a.TEXCLASS.ORD, this.prevLevel = this.attributes.getInherited("scriptlevel")) : n = this.prevClass = a.TEXCLASS.NONE, t === a.TEXCLASS.BIN && (n === a.TEXCLASS.NONE || n === a.TEXCLASS.BIN || n === a.TEXCLASS.OP || n === a.TEXCLASS.REL || n === a.TEXCLASS.OPEN || n === a.TEXCLASS.PUNCT)) this.texClass = a.TEXCLASS.ORD;
			else if (n === a.TEXCLASS.BIN && (t === a.TEXCLASS.REL || t === a.TEXCLASS.CLOSE || t === a.TEXCLASS.PUNCT)) e.texClass = this.prevClass = a.TEXCLASS.ORD;
			else if (t === a.TEXCLASS.BIN) {
				for (var r = this, i = this.parent; i && i.parent && i.isEmbellished && (i.childNodes.length === 1 || !i.isKind("mrow") && i.core() === r);) r = i, i = i.parent;
				i.childNodes[i.childNodes.length - 1] === r && (this.texClass = a.TEXCLASS.ORD);
			}
			return this;
		}, s.prototype.setInheritedAttributes = function(t, n, r, i) {
			t === void 0 && (t = {}), n === void 0 && (n = !1), r === void 0 && (r = 0), i === void 0 && (i = !1), e.prototype.setInheritedAttributes.call(this, t, n, r, i);
			var a = this.getText();
			this.checkOperatorTable(a), this.checkPseudoScripts(a), this.checkPrimes(a), this.checkMathAccent(a);
		}, s.prototype.checkOperatorTable = function(e) {
			var t, n, a = r(this.handleExplicitForm(this.getForms()), 3), s = a[0], c = a[1], l = a[2];
			this.attributes.setInherited("form", s);
			var u = this.constructor.OPTABLE, d = u[s][e] || u[c][e] || u[l][e];
			if (d) {
				this.getProperty("texClass") === void 0 && (this.texClass = d[2]);
				try {
					for (var f = i(Object.keys(d[3] || {})), p = f.next(); !p.done; p = f.next()) {
						var m = p.value;
						this.attributes.setInherited(m, d[3][m]);
					}
				} catch (e) {
					t = { error: e };
				} finally {
					try {
						p && !p.done && (n = f.return) && n.call(f);
					} finally {
						if (t) throw t.error;
					}
				}
				this.lspace = (d[0] + 1) / 18, this.rspace = (d[1] + 1) / 18;
			} else {
				var h = (0, o.getRange)(e);
				if (h) {
					this.getProperty("texClass") === void 0 && (this.texClass = h[2]);
					var g = this.constructor.MMLSPACING[h[2]];
					this.lspace = (g[0] + 1) / 18, this.rspace = (g[1] + 1) / 18;
				}
			}
		}, s.prototype.getForms = function() {
			for (var e = this, t = this.parent, n = this.Parent; n && n.isEmbellished;) e = t, t = n.parent, n = n.Parent;
			if (t && t.isKind("mrow") && t.nonSpaceLength() !== 1) {
				if (t.firstNonSpace() === e) return [
					"prefix",
					"infix",
					"postfix"
				];
				if (t.lastNonSpace() === e) return [
					"postfix",
					"infix",
					"prefix"
				];
			}
			return [
				"infix",
				"prefix",
				"postfix"
			];
		}, s.prototype.handleExplicitForm = function(e) {
			if (this.attributes.isSet("form")) {
				var t = this.attributes.get("form");
				e = [t].concat(e.filter(function(e) {
					return e !== t;
				}));
			}
			return e;
		}, s.prototype.checkPseudoScripts = function(e) {
			var t = this.constructor.pseudoScripts;
			if (e.match(t)) {
				var n = this.coreParent().Parent, r = !n || !(n.isKind("msubsup") && !n.isKind("msub"));
				this.setProperty("pseudoscript", r), r && (this.attributes.setInherited("lspace", 0), this.attributes.setInherited("rspace", 0));
			}
		}, s.prototype.checkPrimes = function(e) {
			var t = this.constructor.primes;
			if (e.match(t)) {
				var n = this.constructor.remapPrimes, r = (0, u.unicodeString)((0, u.unicodeChars)(e).map(function(e) {
					return n[e];
				}));
				this.setProperty("primes", r);
			}
		}, s.prototype.checkMathAccent = function(e) {
			var t = this.Parent;
			if (!(this.getProperty("mathaccent") !== void 0 || !t || !t.isKind("munderover"))) {
				var n = t.childNodes[0];
				if (!(n.isEmbellished && n.coreMO() === this)) {
					var r = this.constructor.mathaccents;
					e.match(r) && this.setProperty("mathaccent", !0);
				}
			}
		}, s.defaults = n(n({}, a.AbstractMmlTokenNode.defaults), {
			form: "infix",
			fence: !1,
			separator: !1,
			lspace: "thickmathspace",
			rspace: "thickmathspace",
			stretchy: !1,
			symmetric: !1,
			maxsize: "infinity",
			minsize: "0em",
			largeop: !1,
			movablelimits: !1,
			accent: !1,
			linebreak: "auto",
			lineleading: "1ex",
			linebreakstyle: "before",
			indentalign: "auto",
			indentshift: "0",
			indenttarget: "",
			indentalignfirst: "indentalign",
			indentshiftfirst: "indentshift",
			indentalignlast: "indentalign",
			indentshiftlast: "indentshift"
		}), s.MMLSPACING = o.MMLSPACING, s.OPTABLE = o.OPTABLE, s.pseudoScripts = new RegExp([
			"^[\"'*`",
			"ª",
			"°",
			"²-´",
			"¹",
			"º",
			"‘-‟",
			"′-‷⁗",
			"⁰ⁱ",
			"⁴-ⁿ",
			"₀-₎",
			"]+$"
		].join("")), s.primes = new RegExp([
			"^[\"'`",
			"‘-‟",
			"]+$"
		].join("")), s.remapPrimes = {
			34: 8243,
			39: 8242,
			96: 8245,
			8216: 8245,
			8217: 8242,
			8218: 8242,
			8219: 8245,
			8220: 8246,
			8221: 8243,
			8222: 8243,
			8223: 8246
		}, s.mathaccents = new RegExp([
			"^[",
			"´́ˊ",
			"`̀ˋ",
			"¨̈",
			"~̃˜",
			"¯̄ˉ",
			"˘̆",
			"ˇ̌",
			"^̂ˆ",
			"→⃗",
			"˙̇",
			"˚̊",
			"⃛",
			"⃜",
			"]$"
		].join("")), s;
	}(a.AbstractMmlTokenNode);
}));
//#endregion
export { a, n as c, s as i, l as n, i as o, c as r, r as s, u as t };
