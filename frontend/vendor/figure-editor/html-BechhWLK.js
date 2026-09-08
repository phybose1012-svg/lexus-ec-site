import { t as e } from "./index.js";
import { t } from "./mathjax-CVxQUBnW.js";
import { t as n } from "./PrioritizedList-D16v7yMr.js";
import { a as r, c as i, i as a, o, t as s } from "./mo-Dc4wDYuI.js";
import { t as c } from "./InputJax-CQediEQT.js";
import { C as l, E as u, S as d, T as f, _ as p, a as m, b as h, c as g, d as _, f as v, g as y, h as b, i as x, l as S, m as C, n as w, o as T, p as E, r as D, s as O, t as ee, u as te, v as ne, w as re, x as ie, y as ae } from "./TeXAtom-CeB8MS7L.js";
import { t as k } from "./MathItem-CEq4TfS_.js";
//#region node_modules/mathjax-full/js/util/LinkedList.js
var A = /* @__PURE__ */ e(((e) => {
	var t = e && e.__generator || function(e, t) {
		var n = {
			label: 0,
			sent: function() {
				if (a[0] & 1) throw a[1];
				return a[1];
			},
			trys: [],
			ops: []
		}, r, i, a, o;
		return o = {
			next: s(0),
			throw: s(1),
			return: s(2)
		}, typeof Symbol == "function" && (o[Symbol.iterator] = function() {
			return this;
		}), o;
		function s(e) {
			return function(t) {
				return c([e, t]);
			};
		}
		function c(o) {
			if (r) throw TypeError("Generator is already executing.");
			for (; n;) try {
				if (r = 1, i && (a = o[0] & 2 ? i.return : o[0] ? i.throw || ((a = i.return) && a.call(i), 0) : i.next) && !(a = a.call(i, o[1])).done) return a;
				switch (i = 0, a && (o = [o[0] & 2, a.value]), o[0]) {
					case 0:
					case 1:
						a = o;
						break;
					case 4: return n.label++, {
						value: o[1],
						done: !1
					};
					case 5:
						n.label++, i = o[1], o = [0];
						continue;
					case 7:
						o = n.ops.pop(), n.trys.pop();
						continue;
					default:
						if ((a = n.trys, !(a = a.length > 0 && a[a.length - 1])) && (o[0] === 6 || o[0] === 2)) {
							n = 0;
							continue;
						}
						if (o[0] === 3 && (!a || o[1] > a[0] && o[1] < a[3])) {
							n.label = o[1];
							break;
						}
						if (o[0] === 6 && n.label < a[1]) {
							n.label = a[1], a = o;
							break;
						}
						if (a && n.label < a[2]) {
							n.label = a[2], n.ops.push(o);
							break;
						}
						a[2] && n.ops.pop(), n.trys.pop();
						continue;
				}
				o = t.call(e, n);
			} catch (e) {
				o = [6, e], i = 0;
			} finally {
				r = a = 0;
			}
			if (o[0] & 5) throw o[1];
			return {
				value: o[0] ? o[1] : void 0,
				done: !0
			};
		}
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.LinkedList = e.ListItem = e.END = void 0, e.END = Symbol();
	var a = function() {
		function e(e) {
			e === void 0 && (e = null), this.next = null, this.prev = null, this.data = e;
		}
		return e;
	}();
	e.ListItem = a, e.LinkedList = function() {
		function o() {
			var t = [...arguments];
			this.list = new a(e.END), this.list.next = this.list.prev = this.list, this.push.apply(this, r([], n(t), !1));
		}
		return o.prototype.isBefore = function(e, t) {
			return e < t;
		}, o.prototype.push = function() {
			for (var e, t, n = [], r = 0; r < arguments.length; r++) n[r] = arguments[r];
			try {
				for (var o = i(n), s = o.next(); !s.done; s = o.next()) {
					var c = s.value, l = new a(c);
					l.next = this.list, l.prev = this.list.prev, this.list.prev = l, l.prev.next = l;
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
			return this;
		}, o.prototype.pop = function() {
			var t = this.list.prev;
			return t.data === e.END ? null : (this.list.prev = t.prev, t.prev.next = this.list, t.next = t.prev = null, t.data);
		}, o.prototype.unshift = function() {
			for (var e, t, n = [], r = 0; r < arguments.length; r++) n[r] = arguments[r];
			try {
				for (var o = i(n.slice(0).reverse()), s = o.next(); !s.done; s = o.next()) {
					var c = s.value, l = new a(c);
					l.next = this.list.next, l.prev = this.list, this.list.next = l, l.next.prev = l;
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
			return this;
		}, o.prototype.shift = function() {
			var t = this.list.next;
			return t.data === e.END ? null : (this.list.next = t.next, t.next.prev = this.list, t.next = t.prev = null, t.data);
		}, o.prototype.remove = function() {
			for (var t, n, r = [], a = 0; a < arguments.length; a++) r[a] = arguments[a];
			var o = /* @__PURE__ */ new Map();
			try {
				for (var s = i(r), c = s.next(); !c.done; c = s.next()) {
					var l = c.value;
					o.set(l, !0);
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
			for (var u = this.list.next; u.data !== e.END;) {
				var d = u.next;
				o.has(u.data) && (u.prev.next = u.next, u.next.prev = u.prev, u.next = u.prev = null), u = d;
			}
		}, o.prototype.clear = function() {
			return this.list.next.prev = this.list.prev.next = null, this.list.next = this.list.prev = this.list, this;
		}, o.prototype[Symbol.iterator] = function() {
			var n;
			return t(this, function(t) {
				switch (t.label) {
					case 0: n = this.list.next, t.label = 1;
					case 1: return n.data === e.END ? [3, 3] : [4, n.data];
					case 2: return t.sent(), n = n.next, [3, 1];
					case 3: return [2];
				}
			});
		}, o.prototype.reversed = function() {
			var n;
			return t(this, function(t) {
				switch (t.label) {
					case 0: n = this.list.prev, t.label = 1;
					case 1: return n.data === e.END ? [3, 3] : [4, n.data];
					case 2: return t.sent(), n = n.prev, [3, 1];
					case 3: return [2];
				}
			});
		}, o.prototype.insert = function(t, n) {
			n === void 0 && (n = null), n === null && (n = this.isBefore.bind(this));
			for (var r = new a(t), i = this.list.next; i.data !== e.END && n(i.data, r.data);) i = i.next;
			return r.prev = i.prev, r.next = i, i.prev.next = i.prev = r, this;
		}, o.prototype.sort = function(e) {
			var t, n;
			e === void 0 && (e = null), e === null && (e = this.isBefore.bind(this));
			var r = [];
			try {
				for (var a = i(this), s = a.next(); !s.done; s = a.next()) {
					var c = s.value;
					r.push(new o(c));
				}
			} catch (e) {
				t = { error: e };
			} finally {
				try {
					s && !s.done && (n = a.return) && n.call(a);
				} finally {
					if (t) throw t.error;
				}
			}
			for (this.list.next = this.list.prev = this.list; r.length > 1;) {
				var l = r.shift(), u = r.shift();
				l.merge(u, e), r.push(l);
			}
			return r.length && (this.list = r[0].list), this;
		}, o.prototype.merge = function(t, r) {
			var i, a, o, s, c;
			r === void 0 && (r = null), r === null && (r = this.isBefore.bind(this));
			for (var l = this.list.next, u = t.list.next; l.data !== e.END && u.data !== e.END;) r(u.data, l.data) ? (i = n([l, u], 2), u.prev.next = i[0], l.prev.next = i[1], a = n([l.prev, u.prev], 2), u.prev = a[0], l.prev = a[1], o = n([t.list, this.list], 2), this.list.prev.next = o[0], t.list.prev.next = o[1], s = n([t.list.prev, this.list.prev], 2), this.list.prev = s[0], t.list.prev = s[1], c = n([u.next, l], 2), l = c[0], u = c[1]) : l = l.next;
			return u.data !== e.END && (this.list.prev.next = t.list.next, t.list.next.prev = this.list.prev, t.list.prev.next = this.list, this.list.prev = t.list.prev, t.list.next = t.list.prev = t.list), this;
		}, o;
	}();
})), j = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.AbstractMathList = void 0, e.AbstractMathList = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return n.prototype.isBefore = function(e, t) {
			return e.start.i < t.start.i || e.start.i === t.start.i && e.start.n < t.start.n;
		}, n;
	}(A().LinkedList);
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
	})();
	Object.defineProperty(e, "__esModule", { value: !0 }), e.AbstractNodeFactory = void 0, e.AbstractNodeFactory = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return n.prototype.create = function(e, t, n) {
			return t === void 0 && (t = {}), n === void 0 && (n = []), this.node[e](t, n);
		}, n;
	}(o().AbstractFactory);
})), oe = /* @__PURE__ */ e(((e) => {
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
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMstyle = void 0;
	var i = a(), o = r();
	e.MmlMstyle = function(e) {
		t(r, e);
		function r() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "mstyle";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "notParent", {
			get: function() {
				return this.childNodes[0] && this.childNodes[0].childNodes.length === 1;
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.setChildInheritedAttributes = function(e, t, n, r) {
			var i = this.attributes.getExplicit("scriptlevel");
			i != null && (i = i.toString(), i.match(/^\s*[-+]/) ? n += parseInt(i) : n = parseInt(i), r = !1);
			var a = this.attributes.getExplicit("displaystyle");
			a != null && (t = a === !0, r = !1);
			var o = this.attributes.getExplicit("data-cramped");
			o != null && (r = o), e = this.addInheritedAttributes(e, this.attributes.getAllAttributes()), this.childNodes[0].setInheritedAttributes(e, t, n, r);
		}, r.defaults = n(n({}, i.AbstractMmlLayoutNode.defaults), {
			scriptlevel: o.INHERIT,
			displaystyle: o.INHERIT,
			scriptsizemultiplier: 1 / Math.sqrt(2),
			scriptminsize: "8px",
			mathbackground: o.INHERIT,
			mathcolor: o.INHERIT,
			dir: o.INHERIT,
			infixlinebreakstyle: "before"
		}), r;
	}(i.AbstractMmlLayoutNode);
})), se = /* @__PURE__ */ e(((e) => {
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
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMaligngroup = void 0;
	var i = a(), o = r();
	e.MmlMaligngroup = function(e) {
		t(r, e);
		function r() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "maligngroup";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "isSpacelike", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.setChildInheritedAttributes = function(t, n, r, i) {
			t = this.addInheritedAttributes(t, this.attributes.getAllAttributes()), e.prototype.setChildInheritedAttributes.call(this, t, n, r, i);
		}, r.defaults = n(n({}, i.AbstractMmlLayoutNode.defaults), { groupalign: o.INHERIT }), r;
	}(i.AbstractMmlLayoutNode);
})), ce = /* @__PURE__ */ e(((e) => {
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
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMalignmark = void 0;
	var r = a();
	e.MmlMalignmark = function(e) {
		t(i, e);
		function i() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(i.prototype, "kind", {
			get: function() {
				return "malignmark";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(i.prototype, "arity", {
			get: function() {
				return 0;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(i.prototype, "isSpacelike", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), i.defaults = n(n({}, r.AbstractMmlNode.defaults), { edge: "left" }), i;
	}(r.AbstractMmlNode);
})), le = /* @__PURE__ */ e(((e) => {
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
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MathChoice = void 0;
	var r = a();
	e.MathChoice = function(e) {
		t(i, e);
		function i() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(i.prototype, "kind", {
			get: function() {
				return "MathChoice";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(i.prototype, "arity", {
			get: function() {
				return 4;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(i.prototype, "notParent", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), i.prototype.setInheritedAttributes = function(e, t, n, r) {
			var i = t ? 0 : Math.max(0, Math.min(n, 2)) + 1, a = this.childNodes[i] || this.factory.create("mrow");
			this.parent.replaceChild(a, this), a.setInheritedAttributes(e, t, n, r);
		}, i.defaults = n({}, r.AbstractMmlBaseNode.defaults), i;
	}(r.AbstractMmlBaseNode);
})), N = /* @__PURE__ */ e(((e) => {
	var t;
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MML = void 0;
	var n = a(), r = f(), i = re(), o = l(), c = s(), u = d(), k = ie(), A = h(), j = ae(), M = ne(), N = p(), P = y(), F = oe(), I = b(), L = C(), R = E(), z = v(), B = _(), V = te(), H = S(), U = g(), W = O(), G = T(), K = m(), q = x(), J = se(), Y = ce(), X = D(), Z = w(), Q = ee(), $ = le();
	e.MML = (t = {}, t[r.MmlMath.prototype.kind] = r.MmlMath, t[i.MmlMi.prototype.kind] = i.MmlMi, t[o.MmlMn.prototype.kind] = o.MmlMn, t[c.MmlMo.prototype.kind] = c.MmlMo, t[u.MmlMtext.prototype.kind] = u.MmlMtext, t[k.MmlMspace.prototype.kind] = k.MmlMspace, t[A.MmlMs.prototype.kind] = A.MmlMs, t[j.MmlMrow.prototype.kind] = j.MmlMrow, t[j.MmlInferredMrow.prototype.kind] = j.MmlInferredMrow, t[M.MmlMfrac.prototype.kind] = M.MmlMfrac, t[N.MmlMsqrt.prototype.kind] = N.MmlMsqrt, t[P.MmlMroot.prototype.kind] = P.MmlMroot, t[F.MmlMstyle.prototype.kind] = F.MmlMstyle, t[I.MmlMerror.prototype.kind] = I.MmlMerror, t[L.MmlMpadded.prototype.kind] = L.MmlMpadded, t[R.MmlMphantom.prototype.kind] = R.MmlMphantom, t[z.MmlMfenced.prototype.kind] = z.MmlMfenced, t[B.MmlMenclose.prototype.kind] = B.MmlMenclose, t[V.MmlMaction.prototype.kind] = V.MmlMaction, t[H.MmlMsub.prototype.kind] = H.MmlMsub, t[H.MmlMsup.prototype.kind] = H.MmlMsup, t[H.MmlMsubsup.prototype.kind] = H.MmlMsubsup, t[U.MmlMunder.prototype.kind] = U.MmlMunder, t[U.MmlMover.prototype.kind] = U.MmlMover, t[U.MmlMunderover.prototype.kind] = U.MmlMunderover, t[W.MmlMmultiscripts.prototype.kind] = W.MmlMmultiscripts, t[W.MmlMprescripts.prototype.kind] = W.MmlMprescripts, t[W.MmlNone.prototype.kind] = W.MmlNone, t[G.MmlMtable.prototype.kind] = G.MmlMtable, t[K.MmlMlabeledtr.prototype.kind] = K.MmlMlabeledtr, t[K.MmlMtr.prototype.kind] = K.MmlMtr, t[q.MmlMtd.prototype.kind] = q.MmlMtd, t[J.MmlMaligngroup.prototype.kind] = J.MmlMaligngroup, t[Y.MmlMalignmark.prototype.kind] = Y.MmlMalignmark, t[X.MmlMglyph.prototype.kind] = X.MmlMglyph, t[Z.MmlSemantics.prototype.kind] = Z.MmlSemantics, t[Z.MmlAnnotation.prototype.kind] = Z.MmlAnnotation, t[Z.MmlAnnotationXML.prototype.kind] = Z.MmlAnnotationXML, t[Q.TeXAtom.prototype.kind] = Q.TeXAtom, t[$.MathChoice.prototype.kind] = $.MathChoice, t[n.TextNode.prototype.kind] = n.TextNode, t[n.XMLNode.prototype.kind] = n.XMLNode, t);
})), P = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlFactory = void 0;
	var n = M(), r = N();
	e.MmlFactory = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(n.prototype, "MML", {
			get: function() {
				return this.node;
			},
			enumerable: !1,
			configurable: !0
		}), n.defaultNodes = r.MML, n;
	}(n.AbstractNodeFactory);
})), F = /* @__PURE__ */ e(((e) => {
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
	}, i = e && e.__spreadArray || function(e, t, n) {
		if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++) (a || !(r in t)) && (a ||= Array.prototype.slice.call(t, 0, r), a[r] = t[r]);
		return e.concat(a || Array.prototype.slice.call(t));
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.BitFieldClass = e.BitField = void 0;
	var a = function() {
		function e() {
			this.bits = 0;
		}
		return e.allocate = function() {
			for (var t, r, i = [], a = 0; a < arguments.length; a++) i[a] = arguments[a];
			try {
				for (var o = n(i), s = o.next(); !s.done; s = o.next()) {
					var c = s.value;
					if (this.has(c)) throw Error("Bit already allocated for " + c);
					if (this.next === e.MAXBIT) throw Error("Maximum number of bits already allocated");
					this.names.set(c, this.next), this.next <<= 1;
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
		}, e.has = function(e) {
			return this.names.has(e);
		}, e.prototype.set = function(e) {
			this.bits |= this.getBit(e);
		}, e.prototype.clear = function(e) {
			this.bits &= ~this.getBit(e);
		}, e.prototype.isSet = function(e) {
			return !!(this.bits & this.getBit(e));
		}, e.prototype.reset = function() {
			this.bits = 0;
		}, e.prototype.getBit = function(e) {
			var t = this.constructor.names.get(e);
			if (!t) throw Error("Unknown bit-field name: " + e);
			return t;
		}, e.MAXBIT = 1 << 31, e.next = 1, e.names = /* @__PURE__ */ new Map(), e;
	}();
	e.BitField = a;
	function o() {
		var e = [...arguments], n = function(e) {
			t(n, e);
			function n() {
				return e !== null && e.apply(this, arguments) || this;
			}
			return n;
		}(a);
		return n.allocate.apply(n, i([], r(e), !1)), n;
	}
	e.BitFieldClass = o;
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
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.AbstractMathDocument = e.resetAllOptions = e.resetOptions = e.RenderList = void 0;
	var s = i(), l = c(), d = u(), f = j(), p = k(), m = P(), h = F(), g = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return n.create = function(e) {
			var t, n, i = new this();
			try {
				for (var o = r(Object.keys(e)), s = o.next(); !s.done; s = o.next()) {
					var c = s.value, l = a(this.action(c, e[c]), 2), u = l[0], d = l[1];
					d && i.add(u, d);
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
			return i;
		}, n.action = function(e, t) {
			var n, r, i, o, s, c, l = !0, u = t[0];
			if (t.length === 1 || typeof t[1] == "boolean") t.length === 2 && (l = t[1]), n = a(this.methodActions(e), 2), s = n[0], c = n[1];
			else if (typeof t[1] == "string") if (typeof t[2] == "string") {
				t.length === 4 && (l = t[3]);
				var d = a(t.slice(1), 2), f = d[0], p = d[1];
				r = a(this.methodActions(f, p), 2), s = r[0], c = r[1];
			} else t.length === 3 && (l = t[2]), i = a(this.methodActions(t[1]), 2), s = i[0], c = i[1];
			else t.length === 4 && (l = t[3]), o = a(t.slice(1), 2), s = o[0], c = o[1];
			return [{
				id: e,
				renderDoc: s,
				renderMath: c,
				convert: l
			}, u];
		}, n.methodActions = function(e, t) {
			return t === void 0 && (t = e), [function(t) {
				return e && t[e](), !1;
			}, function(e, n) {
				return t && e[t](n), !1;
			}];
		}, n.prototype.renderDoc = function(e, t) {
			var n, i;
			t === void 0 && (t = p.STATE.UNPROCESSED);
			try {
				for (var a = r(this.items), o = a.next(); !o.done; o = a.next()) {
					var s = o.value;
					if (s.priority >= t && s.item.renderDoc(e)) return;
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
		}, n.prototype.renderMath = function(e, t, n) {
			var i, a;
			n === void 0 && (n = p.STATE.UNPROCESSED);
			try {
				for (var o = r(this.items), s = o.next(); !s.done; s = o.next()) {
					var c = s.value;
					if (c.priority >= n && c.item.renderMath(e, t)) return;
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
		}, n.prototype.renderConvert = function(e, t, n) {
			var i, a;
			n === void 0 && (n = p.STATE.LAST);
			try {
				for (var o = r(this.items), s = o.next(); !s.done; s = o.next()) {
					var c = s.value;
					if (c.priority > n || c.item.convert && c.item.renderMath(e, t)) return;
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
		}, n.prototype.findID = function(e) {
			var t, n;
			try {
				for (var i = r(this.items), a = i.next(); !a.done; a = i.next()) {
					var o = a.value;
					if (o.item.id === e) return o.item;
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
			return null;
		}, n;
	}(n().PrioritizedList);
	e.RenderList = g, e.resetOptions = {
		all: !1,
		processed: !1,
		inputJax: null,
		outputJax: null
	}, e.resetAllOptions = {
		all: !0,
		processed: !0,
		inputJax: [],
		outputJax: []
	};
	var _ = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return n.prototype.compile = function(e) {
			return null;
		}, n;
	}(l.AbstractInputJax), v = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return n.prototype.typeset = function(e, t) {
			return t === void 0 && (t = null), null;
		}, n.prototype.escaped = function(e, t) {
			return null;
		}, n;
	}(d.AbstractOutputJax), y = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return n;
	}(f.AbstractMathList), b = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return n;
	}(p.AbstractMathItem);
	e.AbstractMathDocument = function() {
		function t(e, n, r) {
			var i = this, a = this.constructor;
			this.document = e, this.options = (0, s.userOptions)((0, s.defaultOptions)({}, a.OPTIONS), r), this.math = new (this.options.MathList || y)(), this.renderActions = g.create(this.options.renderActions), this.processed = new t.ProcessBits(), this.outputJax = this.options.OutputJax || new v();
			var o = this.options.InputJax || [new _()];
			Array.isArray(o) || (o = [o]), this.inputJax = o, this.adaptor = n, this.outputJax.setAdaptor(n), this.inputJax.map(function(e) {
				return e.setAdaptor(n);
			}), this.mmlFactory = this.options.MmlFactory || new m.MmlFactory(), this.inputJax.map(function(e) {
				return e.setMmlFactory(i.mmlFactory);
			}), this.outputJax.initialize(), this.inputJax.map(function(e) {
				return e.initialize();
			});
		}
		return Object.defineProperty(t.prototype, "kind", {
			get: function() {
				return this.constructor.KIND;
			},
			enumerable: !1,
			configurable: !0
		}), t.prototype.addRenderAction = function(e) {
			var t = [...arguments].slice(1), n = a(g.action(e, t), 2), r = n[0], i = n[1];
			this.renderActions.add(r, i);
		}, t.prototype.removeRenderAction = function(e) {
			var t = this.renderActions.findID(e);
			t && this.renderActions.remove(t);
		}, t.prototype.render = function() {
			return this.renderActions.renderDoc(this), this;
		}, t.prototype.rerender = function(e) {
			return e === void 0 && (e = p.STATE.RERENDER), this.state(e - 1), this.render(), this;
		}, t.prototype.convert = function(e, t) {
			t === void 0 && (t = {});
			var n = (0, s.userOptions)({
				format: this.inputJax[0].name,
				display: !0,
				end: p.STATE.LAST,
				em: 16,
				ex: 8,
				containerWidth: null,
				lineWidth: 1e6,
				scale: 1,
				family: ""
			}, t), r = n.format, i = n.display, a = n.end, o = n.ex, c = n.em, l = n.containerWidth, u = n.lineWidth, d = n.scale, f = n.family;
			l === null && (l = 80 * o);
			var m = this.inputJax.reduce(function(e, t) {
				return t.name === r ? t : e;
			}, null), h = new this.options.MathItem(e, m, i);
			return h.start.node = this.adaptor.body(this.document), h.setMetrics(c, o, l, u, d), this.outputJax.options.mtextInheritFont && (h.outputData.mtextFamily = f), this.outputJax.options.merrorInheritFont && (h.outputData.merrorFamily = f), h.convert(this, a), h.typesetRoot || h.root;
		}, t.prototype.findMath = function(e) {
			return e === void 0 && (e = null), this.processed.set("findMath"), this;
		}, t.prototype.compile = function() {
			var e, t, n, i;
			if (!this.processed.isSet("compile")) {
				var a = [];
				try {
					for (var o = r(this.math), s = o.next(); !s.done; s = o.next()) {
						var c = s.value;
						this.compileMath(c), c.inputData.recompile !== void 0 && a.push(c);
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
				try {
					for (var l = r(a), u = l.next(); !u.done; u = l.next()) {
						var c = u.value, d = c.inputData.recompile;
						c.state(d.state), c.inputData.recompile = d, this.compileMath(c);
					}
				} catch (e) {
					n = { error: e };
				} finally {
					try {
						u && !u.done && (i = l.return) && i.call(l);
					} finally {
						if (n) throw n.error;
					}
				}
				this.processed.set("compile");
			}
			return this;
		}, t.prototype.compileMath = function(e) {
			try {
				e.compile(this);
			} catch (t) {
				if (t.retry || t.restart) throw t;
				this.options.compileError(this, e, t), e.inputData.error = t;
			}
		}, t.prototype.compileError = function(e, t) {
			e.root = this.mmlFactory.create("math", null, [this.mmlFactory.create("merror", {
				"data-mjx-error": t.message,
				title: t.message
			}, [this.mmlFactory.create("mtext", null, [this.mmlFactory.create("text").setText("Math input error")])])]), e.display && e.root.attributes.set("display", "block"), e.inputData.error = t.message;
		}, t.prototype.typeset = function() {
			var e, t;
			if (!this.processed.isSet("typeset")) {
				try {
					for (var n = r(this.math), i = n.next(); !i.done; i = n.next()) {
						var a = i.value;
						try {
							a.typeset(this);
						} catch (e) {
							if (e.retry || e.restart) throw e;
							this.options.typesetError(this, a, e), a.outputData.error = e;
						}
					}
				} catch (t) {
					e = { error: t };
				} finally {
					try {
						i && !i.done && (t = n.return) && t.call(n);
					} finally {
						if (e) throw e.error;
					}
				}
				this.processed.set("typeset");
			}
			return this;
		}, t.prototype.typesetError = function(e, t) {
			e.typesetRoot = this.adaptor.node("mjx-container", {
				class: "MathJax mjx-output-error",
				jax: this.outputJax.name
			}, [this.adaptor.node("span", {
				"data-mjx-error": t.message,
				title: t.message,
				style: {
					color: "red",
					"background-color": "yellow",
					"line-height": "normal"
				}
			}, [this.adaptor.text("Math output error")])]), e.display && this.adaptor.setAttributes(e.typesetRoot, { style: {
				display: "block",
				margin: "1em 0",
				"text-align": "center"
			} }), e.outputData.error = t.message;
		}, t.prototype.getMetrics = function() {
			return this.processed.isSet("getMetrics") || (this.outputJax.getMetrics(this), this.processed.set("getMetrics")), this;
		}, t.prototype.updateDocument = function() {
			var e, t;
			if (!this.processed.isSet("updateDocument")) {
				try {
					for (var n = r(this.math.reversed()), i = n.next(); !i.done; i = n.next()) i.value.updateDocument(this);
				} catch (t) {
					e = { error: t };
				} finally {
					try {
						i && !i.done && (t = n.return) && t.call(n);
					} finally {
						if (e) throw e.error;
					}
				}
				this.processed.set("updateDocument");
			}
			return this;
		}, t.prototype.removeFromDocument = function(e) {
			return e === void 0 && (e = !1), this;
		}, t.prototype.state = function(e, t) {
			var n, i;
			t === void 0 && (t = !1);
			try {
				for (var a = r(this.math), o = a.next(); !o.done; o = a.next()) o.value.state(e, t);
			} catch (e) {
				n = { error: e };
			} finally {
				try {
					o && !o.done && (i = a.return) && i.call(a);
				} finally {
					if (n) throw n.error;
				}
			}
			return e < p.STATE.INSERTED && this.processed.clear("updateDocument"), e < p.STATE.TYPESET && (this.processed.clear("typeset"), this.processed.clear("getMetrics")), e < p.STATE.COMPILED && this.processed.clear("compile"), this;
		}, t.prototype.reset = function(t) {
			var n;
			return t === void 0 && (t = { processed: !0 }), t = (0, s.userOptions)(Object.assign({}, e.resetOptions), t), t.all && Object.assign(t, e.resetAllOptions), t.processed && this.processed.reset(), t.inputJax && this.inputJax.forEach(function(e) {
				return e.reset.apply(e, o([], a(t.inputJax), !1));
			}), t.outputJax && (n = this.outputJax).reset.apply(n, o([], a(t.outputJax), !1)), this;
		}, t.prototype.clear = function() {
			return this.reset(), this.math.clear(), this;
		}, t.prototype.concat = function(e) {
			return this.math.merge(e), this;
		}, t.prototype.clearMathItemsWithin = function(e) {
			var t, n = this.getMathItemsWithin(e);
			return (t = this.math).remove.apply(t, o([], a(n), !1)), n;
		}, t.prototype.getMathItemsWithin = function(e) {
			var t, n, i, a;
			Array.isArray(e) || (e = [e]);
			var o = this.adaptor, s = [], c = o.getElements(e, this.document);
			try {
				ITEMS: for (var l = r(this.math), u = l.next(); !u.done; u = l.next()) {
					var d = u.value;
					try {
						for (var f = (i = void 0, r(c)), p = f.next(); !p.done; p = f.next()) {
							var m = p.value;
							if (d.start.node && o.contains(m, d.start.node)) {
								s.push(d);
								continue ITEMS;
							}
						}
					} catch (e) {
						i = { error: e };
					} finally {
						try {
							p && !p.done && (a = f.return) && a.call(f);
						} finally {
							if (i) throw i.error;
						}
					}
				}
			} catch (e) {
				t = { error: e };
			} finally {
				try {
					u && !u.done && (n = l.return) && n.call(l);
				} finally {
					if (t) throw t.error;
				}
			}
			return s;
		}, t.KIND = "MathDocument", t.OPTIONS = {
			OutputJax: null,
			InputJax: null,
			MmlFactory: null,
			MathList: y,
			MathItem: b,
			compileError: function(e, t, n) {
				e.compileError(t, n);
			},
			typesetError: function(e, t, n) {
				e.typesetError(t, n);
			},
			renderActions: (0, s.expandable)({
				find: [
					p.STATE.FINDMATH,
					"findMath",
					"",
					!1
				],
				compile: [p.STATE.COMPILED],
				metrics: [
					p.STATE.METRICS,
					"getMetrics",
					"",
					!1
				],
				typeset: [p.STATE.TYPESET],
				update: [
					p.STATE.INSERTED,
					"updateDocument",
					!1
				]
			})
		}, t.ProcessBits = (0, h.BitFieldClass)("findMath", "compile", "getMetrics", "typeset", "updateDocument"), t;
	}();
})), L = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.AbstractHandler = void 0;
	var n = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return n;
	}(I().AbstractMathDocument);
	e.AbstractHandler = function() {
		function e(e, t) {
			t === void 0 && (t = 5), this.documentClass = n, this.adaptor = e, this.priority = t;
		}
		return Object.defineProperty(e.prototype, "name", {
			get: function() {
				return this.constructor.NAME;
			},
			enumerable: !1,
			configurable: !0
		}), e.prototype.handlesDocument = function(e) {
			return !1;
		}, e.prototype.create = function(e, t) {
			return new this.documentClass(e, this.adaptor, t);
		}, e.NAME = "generic", e;
	}();
})), R = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.HTMLMathItem = void 0;
	var n = k();
	e.HTMLMathItem = function(e) {
		t(r, e);
		function r(t, n, r, i, a) {
			return r === void 0 && (r = !0), i === void 0 && (i = {
				node: null,
				n: 0,
				delim: ""
			}), a === void 0 && (a = {
				node: null,
				n: 0,
				delim: ""
			}), e.call(this, t, n, r, i, a) || this;
		}
		return Object.defineProperty(r.prototype, "adaptor", {
			get: function() {
				return this.inputJax.adaptor;
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.updateDocument = function(e) {
			if (this.state() < n.STATE.INSERTED) {
				if (this.inputJax.processStrings) {
					var t = this.start.node;
					if (t === this.end.node) this.end.n && this.end.n < this.adaptor.value(this.end.node).length && this.adaptor.split(this.end.node, this.end.n), this.start.n && (t = this.adaptor.split(this.start.node, this.start.n)), this.adaptor.replace(this.typesetRoot, t);
					else {
						for (this.start.n && (t = this.adaptor.split(t, this.start.n)); t !== this.end.node;) {
							var r = this.adaptor.next(t);
							this.adaptor.remove(t), t = r;
						}
						this.adaptor.insert(this.typesetRoot, t), this.end.n < this.adaptor.value(t).length && this.adaptor.split(t, this.end.n), this.adaptor.remove(t);
					}
				} else this.adaptor.replace(this.typesetRoot, this.start.node);
				this.start.node = this.end.node = this.typesetRoot, this.start.n = this.end.n = 0, this.state(n.STATE.INSERTED);
			}
		}, r.prototype.updateStyleSheet = function(e) {
			e.addStyleSheet();
		}, r.prototype.removeFromDocument = function(e) {
			if (e === void 0 && (e = !1), this.state() >= n.STATE.TYPESET) {
				var t = this.adaptor, r = this.start.node, i = t.text("");
				if (e) {
					var a = this.start.delim + this.math + this.end.delim;
					if (this.inputJax.processStrings) i = t.text(a);
					else {
						var o = t.parse(a, "text/html");
						i = t.firstChild(t.body(o));
					}
				}
				t.parent(r) && t.replace(i, r), this.start.node = this.end.node = i, this.start.n = this.end.n = 0;
			}
		}, r;
	}(n.AbstractMathItem);
})), z = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.HTMLMathList = void 0, e.HTMLMathList = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return n;
	}(j().AbstractMathList);
})), B = /* @__PURE__ */ e(((e) => {
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
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.HTMLDomStrings = void 0;
	var n = i();
	e.HTMLDomStrings = function() {
		function e(e) {
			e === void 0 && (e = null);
			var t = this.constructor;
			this.options = (0, n.userOptions)((0, n.defaultOptions)({}, t.OPTIONS), e), this.init(), this.getPatterns();
		}
		return e.prototype.init = function() {
			this.strings = [], this.string = "", this.snodes = [], this.nodes = [], this.stack = [];
		}, e.prototype.getPatterns = function() {
			var e = (0, n.makeArray)(this.options.skipHtmlTags), t = (0, n.makeArray)(this.options.ignoreHtmlClass), r = (0, n.makeArray)(this.options.processHtmlClass);
			this.skipHtmlTags = RegExp("^(?:" + e.join("|") + ")$", "i"), this.ignoreHtmlClass = RegExp("(?:^| )(?:" + t.join("|") + ")(?: |$)"), this.processHtmlClass = RegExp("(?:^| )(?:" + r + ")(?: |$)");
		}, e.prototype.pushString = function() {
			this.string.match(/\S/) && (this.strings.push(this.string), this.nodes.push(this.snodes)), this.string = "", this.snodes = [];
		}, e.prototype.extendString = function(e, t) {
			this.snodes.push([e, t.length]), this.string += t;
		}, e.prototype.handleText = function(e, t) {
			return t || this.extendString(e, this.adaptor.value(e)), this.adaptor.next(e);
		}, e.prototype.handleTag = function(e, t) {
			if (!t) {
				var n = this.options.includeHtmlTags[this.adaptor.kind(e)];
				this.extendString(e, n);
			}
			return this.adaptor.next(e);
		}, e.prototype.handleContainer = function(e, t) {
			this.pushString();
			var n = this.adaptor.getAttribute(e, "class") || "", r = this.adaptor.kind(e) || "", i = this.processHtmlClass.exec(n), a = e;
			return this.adaptor.firstChild(e) && !this.adaptor.getAttribute(e, "data-MJX") && (i || !this.skipHtmlTags.exec(r)) ? (this.adaptor.next(e) && this.stack.push([this.adaptor.next(e), t]), a = this.adaptor.firstChild(e), t = (t || this.ignoreHtmlClass.exec(n)) && !i) : a = this.adaptor.next(e), [a, t];
		}, e.prototype.handleOther = function(e, t) {
			return this.pushString(), this.adaptor.next(e);
		}, e.prototype.find = function(e) {
			var n, r;
			this.init();
			for (var i = this.adaptor.next(e), a = !1, o = this.options.includeHtmlTags; e && e !== i;) {
				var s = this.adaptor.kind(e);
				s === "#text" ? e = this.handleText(e, a) : o.hasOwnProperty(s) ? e = this.handleTag(e, a) : s ? (n = t(this.handleContainer(e, a), 2), e = n[0], a = n[1]) : e = this.handleOther(e, a), !e && this.stack.length && (this.pushString(), r = t(this.stack.pop(), 2), e = r[0], a = r[1]);
			}
			this.pushString();
			var c = [this.strings, this.nodes];
			return this.init(), c;
		}, e.OPTIONS = {
			skipHtmlTags: [
				"script",
				"noscript",
				"style",
				"textarea",
				"pre",
				"code",
				"annotation",
				"annotation-xml"
			],
			includeHtmlTags: {
				br: "\n",
				wbr: "",
				"#comment": ""
			},
			ignoreHtmlClass: "mathjax_ignore",
			processHtmlClass: "mathjax_process"
		}, e;
	}();
})), V = /* @__PURE__ */ e(((e) => {
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
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.HTMLDocument = void 0;
	var o = I(), s = i(), c = R(), l = z(), u = B(), d = k();
	e.HTMLDocument = function(e) {
		t(i, e);
		function i(t, n, i) {
			var a = this, o = r((0, s.separateOptions)(i, u.HTMLDomStrings.OPTIONS), 2), c = o[0], l = o[1];
			return a = e.call(this, t, n, c) || this, a.domStrings = a.options.DomStrings || new u.HTMLDomStrings(l), a.domStrings.adaptor = n, a.styles = [], a;
		}
		return i.prototype.findPosition = function(e, t, n, i) {
			var o, s, c = this.adaptor;
			try {
				for (var l = a(i[e]), u = l.next(); !u.done; u = l.next()) {
					var d = u.value, f = r(d, 2), p = f[0], m = f[1];
					if (t <= m && c.kind(p) === "#text") return {
						node: p,
						n: Math.max(t, 0),
						delim: n
					};
					t -= m;
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
			return {
				node: null,
				n: 0,
				delim: n
			};
		}, i.prototype.mathItem = function(e, t, n) {
			var r = e.math, i = this.findPosition(e.n, e.start.n, e.open, n), a = this.findPosition(e.n, e.end.n, e.close, n);
			return new this.options.MathItem(r, t, e.display, i, a);
		}, i.prototype.findMath = function(e) {
			var t, n, i, o, c, l, u, d, f;
			if (!this.processed.isSet("findMath")) {
				this.adaptor.document = this.document, e = (0, s.userOptions)({ elements: this.options.elements || [this.adaptor.body(this.document)] }, e);
				try {
					for (var p = a(this.adaptor.getElements(e.elements, this.document)), m = p.next(); !m.done; m = p.next()) {
						var h = m.value, g = r([null, null], 2), _ = g[0], v = g[1];
						try {
							for (var y = (i = void 0, a(this.inputJax)), b = y.next(); !b.done; b = y.next()) {
								var x = b.value, S = new this.options.MathList();
								if (x.processStrings) {
									_ === null && (c = r(this.domStrings.find(h), 2), _ = c[0], v = c[1]);
									try {
										for (var C = (l = void 0, a(x.findMath(_))), w = C.next(); !w.done; w = C.next()) {
											var T = w.value;
											S.push(this.mathItem(T, x, v));
										}
									} catch (e) {
										l = { error: e };
									} finally {
										try {
											w && !w.done && (u = C.return) && u.call(C);
										} finally {
											if (l) throw l.error;
										}
									}
								} else try {
									for (var E = (d = void 0, a(x.findMath(h))), D = E.next(); !D.done; D = E.next()) {
										var T = D.value, O = new this.options.MathItem(T.math, x, T.display, T.start, T.end);
										S.push(O);
									}
								} catch (e) {
									d = { error: e };
								} finally {
									try {
										D && !D.done && (f = E.return) && f.call(E);
									} finally {
										if (d) throw d.error;
									}
								}
								this.math.merge(S);
							}
						} catch (e) {
							i = { error: e };
						} finally {
							try {
								b && !b.done && (o = y.return) && o.call(y);
							} finally {
								if (i) throw i.error;
							}
						}
					}
				} catch (e) {
					t = { error: e };
				} finally {
					try {
						m && !m.done && (n = p.return) && n.call(p);
					} finally {
						if (t) throw t.error;
					}
				}
				this.processed.set("findMath");
			}
			return this;
		}, i.prototype.updateDocument = function() {
			return this.processed.isSet("updateDocument") || (this.addPageElements(), this.addStyleSheet(), e.prototype.updateDocument.call(this), this.processed.set("updateDocument")), this;
		}, i.prototype.addPageElements = function() {
			var e = this.adaptor.body(this.document), t = this.documentPageElements();
			t && this.adaptor.append(e, t);
		}, i.prototype.addStyleSheet = function() {
			var e = this.documentStyleSheet(), t = this.adaptor;
			if (e && !t.parent(e)) {
				var n = t.head(this.document), r = this.findSheet(n, t.getAttribute(e, "id"));
				r ? t.replace(e, r) : t.append(n, e);
			}
		}, i.prototype.findSheet = function(e, t) {
			var n, r;
			if (t) try {
				for (var i = a(this.adaptor.tags(e, "style")), o = i.next(); !o.done; o = i.next()) {
					var s = o.value;
					if (this.adaptor.getAttribute(s, "id") === t) return s;
				}
			} catch (e) {
				n = { error: e };
			} finally {
				try {
					o && !o.done && (r = i.return) && r.call(i);
				} finally {
					if (n) throw n.error;
				}
			}
			return null;
		}, i.prototype.removeFromDocument = function(e) {
			var t, n;
			if (e === void 0 && (e = !1), this.processed.isSet("updateDocument")) try {
				for (var r = a(this.math), i = r.next(); !i.done; i = r.next()) {
					var o = i.value;
					o.state() >= d.STATE.INSERTED && o.state(d.STATE.TYPESET, e);
				}
			} catch (e) {
				t = { error: e };
			} finally {
				try {
					i && !i.done && (n = r.return) && n.call(r);
				} finally {
					if (t) throw t.error;
				}
			}
			return this.processed.clear("updateDocument"), this;
		}, i.prototype.documentStyleSheet = function() {
			return this.outputJax.styleSheet(this);
		}, i.prototype.documentPageElements = function() {
			return this.outputJax.pageElements(this);
		}, i.prototype.addStyles = function(e) {
			this.styles.push(e);
		}, i.prototype.getStyles = function() {
			return this.styles;
		}, i.KIND = "HTML", i.OPTIONS = n(n({}, o.AbstractMathDocument.OPTIONS), {
			renderActions: (0, s.expandable)(n(n({}, o.AbstractMathDocument.OPTIONS.renderActions), { styles: [
				d.STATE.INSERTED + 1,
				"",
				"updateStyleSheet",
				!1
			] })),
			MathList: l.HTMLMathList,
			MathItem: c.HTMLMathItem,
			DomStrings: null
		}), i;
	}(o.AbstractMathDocument);
})), H = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.HTMLHandler = void 0;
	var n = L(), r = V();
	e.HTMLHandler = function(e) {
		t(n, e);
		function n() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.documentClass = r.HTMLDocument, t;
		}
		return n.prototype.handlesDocument = function(e) {
			var t = this.adaptor;
			if (typeof e == "string") try {
				e = t.parse(e, "text/html");
			} catch {}
			return e instanceof t.window.Document || e instanceof t.window.HTMLElement || e instanceof t.window.DocumentFragment;
		}, n.prototype.create = function(t, n) {
			var r = this.adaptor;
			if (typeof t == "string") t = r.parse(t, "text/html");
			else if (t instanceof r.window.HTMLElement || t instanceof r.window.DocumentFragment) {
				var i = t;
				t = r.parse("", "text/html"), r.append(r.body(t), i);
			}
			return e.prototype.create.call(this, t, n);
		}, n;
	}(n.AbstractHandler);
})), U = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.RegisterHTMLHandler = void 0;
	var n = t(), r = H();
	function i(e) {
		var t = new r.HTMLHandler(e);
		return n.mathjax.handlers.register(t), t;
	}
	e.RegisterHTMLHandler = i;
}));
//#endregion
export default U();
