import { t as e } from "./index.js";
import { a as t, c as n, i as r, n as i, s as a, t as o } from "./mo-Dc4wDYuI.js";
//#region node_modules/mathjax-full/js/core/OutputJax.js
var s = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.AbstractOutputJax = void 0;
	var t = n(), r = a();
	e.AbstractOutputJax = function() {
		function e(e) {
			e === void 0 && (e = {}), this.adaptor = null;
			var n = this.constructor;
			this.options = (0, t.userOptions)((0, t.defaultOptions)({}, n.OPTIONS), e), this.postFilters = new r.FunctionList();
		}
		return Object.defineProperty(e.prototype, "name", {
			get: function() {
				return this.constructor.NAME;
			},
			enumerable: !1,
			configurable: !0
		}), e.prototype.setAdaptor = function(e) {
			this.adaptor = e;
		}, e.prototype.initialize = function() {}, e.prototype.reset = function() {}, e.prototype.getMetrics = function(e) {}, e.prototype.styleSheet = function(e) {
			return null;
		}, e.prototype.pageElements = function(e) {
			return null;
		}, e.prototype.executeFilters = function(e, t, n, r) {
			var i = {
				math: t,
				document: n,
				data: r
			};
			return e.execute(i), i.data;
		}, e.NAME = "generic", e.OPTIONS = {}, e;
	}();
})), c = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMath = void 0;
	var i = r();
	e.MmlMath = function(e) {
		t(r, e);
		function r() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "math";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "linebreakContainer", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.setChildInheritedAttributes = function(t, n, r, i) {
			this.attributes.get("mode") === "display" && this.attributes.setInherited("display", "block"), t = this.addInheritedAttributes(t, this.attributes.getAllAttributes()), n = !!this.attributes.get("displaystyle") || !this.attributes.get("displaystyle") && this.attributes.get("display") === "block", this.attributes.setInherited("displaystyle", n), r = this.attributes.get("scriptlevel") || this.constructor.defaults.scriptlevel, e.prototype.setChildInheritedAttributes.call(this, t, n, r, i);
		}, r.defaults = n(n({}, i.AbstractMmlLayoutNode.defaults), {
			mathvariant: "normal",
			mathsize: "normal",
			mathcolor: "",
			mathbackground: "transparent",
			dir: "ltr",
			scriptlevel: 0,
			displaystyle: !1,
			display: "inline",
			maxwidth: "",
			overflow: "linebreak",
			altimg: "",
			"altimg-width": "",
			"altimg-height": "",
			"altimg-valign": "",
			alttext: "",
			cdgroup: "",
			scriptsizemultiplier: 1 / Math.sqrt(2),
			scriptminsize: "8px",
			infixlinebreakstyle: "before",
			lineleading: "1ex",
			linebreakmultchar: "⁢",
			indentshift: "auto",
			indentalign: "auto",
			indenttarget: "",
			indentalignfirst: "indentalign",
			indentshiftfirst: "indentshift",
			indentalignlast: "indentalign",
			indentshiftlast: "indentshift"
		}), r;
	}(i.AbstractMmlLayoutNode);
})), l = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMi = void 0;
	var i = r();
	e.MmlMi = function(e) {
		t(r, e);
		function r() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.texclass = i.TEXCLASS.ORD, t;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "mi";
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.setInheritedAttributes = function(t, n, i, a) {
			t === void 0 && (t = {}), n === void 0 && (n = !1), i === void 0 && (i = 0), a === void 0 && (a = !1), e.prototype.setInheritedAttributes.call(this, t, n, i, a), this.getText().match(r.singleCharacter) && !t.mathvariant && this.attributes.setInherited("mathvariant", "italic");
		}, r.prototype.setTeXclass = function(e) {
			this.getPrevClass(e);
			var t = this.getText();
			return t.length > 1 && t.match(r.operatorName) && this.attributes.get("mathvariant") === "normal" && this.getProperty("autoOP") === void 0 && this.getProperty("texClass") === void 0 && (this.texClass = i.TEXCLASS.OP, this.setProperty("autoOP", !0)), this;
		}, r.defaults = n({}, i.AbstractMmlTokenNode.defaults), r.operatorName = /^[a-z][a-z0-9]*$/i, r.singleCharacter = /^[\uD800-\uDBFF]?.[\u0300-\u036F\u1AB0-\u1ABE\u1DC0-\u1DFF\u20D0-\u20EF]*$/, r;
	}(i.AbstractMmlTokenNode);
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
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMn = void 0;
	var i = r();
	e.MmlMn = function(e) {
		t(r, e);
		function r() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.texclass = i.TEXCLASS.ORD, t;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "mn";
			},
			enumerable: !1,
			configurable: !0
		}), r.defaults = n({}, i.AbstractMmlTokenNode.defaults), r;
	}(i.AbstractMmlTokenNode);
})), d = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMtext = void 0;
	var i = r();
	e.MmlMtext = function(e) {
		t(r, e);
		function r() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.texclass = i.TEXCLASS.ORD, t;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "mtext";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "isSpacelike", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), r.defaults = n({}, i.AbstractMmlTokenNode.defaults), r;
	}(i.AbstractMmlTokenNode);
})), f = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMspace = void 0;
	var i = r();
	e.MmlMspace = function(e) {
		t(r, e);
		function r() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.texclass = i.TEXCLASS.NONE, t;
		}
		return r.prototype.setTeXclass = function(e) {
			return e;
		}, Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "mspace";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "arity", {
			get: function() {
				return 0;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "isSpacelike", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "hasNewline", {
			get: function() {
				var e = this.attributes;
				return e.getExplicit("width") == null && e.getExplicit("height") == null && e.getExplicit("depth") == null && e.get("linebreak") === "newline";
			},
			enumerable: !1,
			configurable: !0
		}), r.defaults = n(n({}, i.AbstractMmlTokenNode.defaults), {
			width: "0em",
			height: "0ex",
			depth: "0ex",
			linebreak: "auto"
		}), r;
	}(i.AbstractMmlTokenNode);
})), p = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMs = void 0;
	var i = r();
	e.MmlMs = function(e) {
		t(r, e);
		function r() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.texclass = i.TEXCLASS.ORD, t;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "ms";
			},
			enumerable: !1,
			configurable: !0
		}), r.defaults = n(n({}, i.AbstractMmlTokenNode.defaults), {
			lquote: "\"",
			rquote: "\""
		}), r;
	}(i.AbstractMmlTokenNode);
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
	})(), n = e && e.__assign || function() {
		return n = Object.assign || function(e) {
			for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
			return e;
		}, n.apply(this, arguments);
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlInferredMrow = e.MmlMrow = void 0;
	var a = r(), o = function(e) {
		t(r, e);
		function r() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t._core = null, t;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "mrow";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "isSpacelike", {
			get: function() {
				var e, t;
				try {
					for (var n = i(this.childNodes), r = n.next(); !r.done; r = n.next()) if (!r.value.isSpacelike) return !1;
				} catch (t) {
					e = { error: t };
				} finally {
					try {
						r && !r.done && (t = n.return) && t.call(n);
					} finally {
						if (e) throw e.error;
					}
				}
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "isEmbellished", {
			get: function() {
				var e, t, n = !1, r = 0;
				try {
					for (var a = i(this.childNodes), o = a.next(); !o.done; o = a.next()) {
						var s = o.value;
						if (s) {
							if (s.isEmbellished) {
								if (n) return !1;
								n = !0, this._core = r;
							} else if (!s.isSpacelike) return !1;
						}
						r++;
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
				return n;
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.core = function() {
			return !this.isEmbellished || this._core == null ? this : this.childNodes[this._core];
		}, r.prototype.coreMO = function() {
			return !this.isEmbellished || this._core == null ? this : this.childNodes[this._core].coreMO();
		}, r.prototype.nonSpaceLength = function() {
			var e, t, n = 0;
			try {
				for (var r = i(this.childNodes), a = r.next(); !a.done; a = r.next()) {
					var o = a.value;
					o && !o.isSpacelike && n++;
				}
			} catch (t) {
				e = { error: t };
			} finally {
				try {
					a && !a.done && (t = r.return) && t.call(r);
				} finally {
					if (e) throw e.error;
				}
			}
			return n;
		}, r.prototype.firstNonSpace = function() {
			var e, t;
			try {
				for (var n = i(this.childNodes), r = n.next(); !r.done; r = n.next()) {
					var a = r.value;
					if (a && !a.isSpacelike) return a;
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
			return null;
		}, r.prototype.lastNonSpace = function() {
			for (var e = this.childNodes.length; --e >= 0;) {
				var t = this.childNodes[e];
				if (t && !t.isSpacelike) return t;
			}
			return null;
		}, r.prototype.setTeXclass = function(e) {
			var t, n, r, o;
			if (this.getProperty("open") != null || this.getProperty("close") != null) {
				this.getPrevClass(e), e = null;
				try {
					for (var s = i(this.childNodes), c = s.next(); !c.done; c = s.next()) {
						var l = c.value;
						e = l.setTeXclass(e);
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
				this.texClass ??= a.TEXCLASS.INNER;
			} else {
				try {
					for (var u = i(this.childNodes), d = u.next(); !d.done; d = u.next()) {
						var l = d.value;
						e = l.setTeXclass(e);
					}
				} catch (e) {
					r = { error: e };
				} finally {
					try {
						d && !d.done && (o = u.return) && o.call(u);
					} finally {
						if (r) throw r.error;
					}
				}
				this.childNodes[0] && this.updateTeXclass(this.childNodes[0]);
			}
			return e;
		}, r.defaults = n({}, a.AbstractMmlNode.defaults), r;
	}(a.AbstractMmlNode);
	e.MmlMrow = o, e.MmlInferredMrow = function(e) {
		t(n, e);
		function n() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(n.prototype, "kind", {
			get: function() {
				return "inferredMrow";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(n.prototype, "isInferred", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(n.prototype, "notParent", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), n.prototype.toString = function() {
			return "[" + this.childNodes.join(",") + "]";
		}, n.defaults = o.defaults, n;
	}(o);
})), h = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMfrac = void 0;
	var a = r();
	e.MmlMfrac = function(e) {
		t(r, e);
		function r() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "mfrac";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "arity", {
			get: function() {
				return 2;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "linebreakContainer", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.setTeXclass = function(e) {
			var t, n;
			this.getPrevClass(e);
			try {
				for (var r = i(this.childNodes), a = r.next(); !a.done; a = r.next()) a.value.setTeXclass(null);
			} catch (e) {
				t = { error: e };
			} finally {
				try {
					a && !a.done && (n = r.return) && n.call(r);
				} finally {
					if (t) throw t.error;
				}
			}
			return this;
		}, r.prototype.setChildInheritedAttributes = function(e, t, n, r) {
			(!t || n > 0) && n++, this.childNodes[0].setInheritedAttributes(e, !1, n, r), this.childNodes[1].setInheritedAttributes(e, !1, n, !0);
		}, r.defaults = n(n({}, a.AbstractMmlBaseNode.defaults), {
			linethickness: "medium",
			numalign: "center",
			denomalign: "center",
			bevelled: !1
		}), r;
	}(a.AbstractMmlBaseNode);
})), g = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMsqrt = void 0;
	var i = r();
	e.MmlMsqrt = function(e) {
		t(r, e);
		function r() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.texclass = i.TEXCLASS.ORD, t;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "msqrt";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "arity", {
			get: function() {
				return -1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "linebreakContainer", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.setTeXclass = function(e) {
			return this.getPrevClass(e), this.childNodes[0].setTeXclass(null), this;
		}, r.prototype.setChildInheritedAttributes = function(e, t, n, r) {
			this.childNodes[0].setInheritedAttributes(e, t, n, !0);
		}, r.defaults = n({}, i.AbstractMmlNode.defaults), r;
	}(i.AbstractMmlNode);
})), _ = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMroot = void 0;
	var i = r();
	e.MmlMroot = function(e) {
		t(r, e);
		function r() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.texclass = i.TEXCLASS.ORD, t;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "mroot";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "arity", {
			get: function() {
				return 2;
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.setTeXclass = function(e) {
			return this.getPrevClass(e), this.childNodes[0].setTeXclass(null), this.childNodes[1].setTeXclass(null), this;
		}, r.prototype.setChildInheritedAttributes = function(e, t, n, r) {
			this.childNodes[0].setInheritedAttributes(e, t, n, !0), this.childNodes[1].setInheritedAttributes(e, !1, n + 2, r);
		}, r.defaults = n({}, i.AbstractMmlNode.defaults), r;
	}(i.AbstractMmlNode);
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
	})(), n = e && e.__assign || function() {
		return n = Object.assign || function(e) {
			for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
			return e;
		}, n.apply(this, arguments);
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMerror = void 0;
	var i = r();
	e.MmlMerror = function(e) {
		t(r, e);
		function r() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.texclass = i.TEXCLASS.ORD, t;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "merror";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "arity", {
			get: function() {
				return -1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "linebreakContainer", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), r.defaults = n({}, i.AbstractMmlNode.defaults), r;
	}(i.AbstractMmlNode);
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
	})(), n = e && e.__assign || function() {
		return n = Object.assign || function(e) {
			for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
			return e;
		}, n.apply(this, arguments);
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMpadded = void 0;
	var i = r();
	e.MmlMpadded = function(e) {
		t(r, e);
		function r() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "mpadded";
			},
			enumerable: !1,
			configurable: !0
		}), r.defaults = n(n({}, i.AbstractMmlLayoutNode.defaults), {
			width: "",
			height: "",
			depth: "",
			lspace: 0,
			voffset: 0
		}), r;
	}(i.AbstractMmlLayoutNode);
})), b = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMphantom = void 0;
	var i = r();
	e.MmlMphantom = function(e) {
		t(r, e);
		function r() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.texclass = i.TEXCLASS.ORD, t;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "mphantom";
			},
			enumerable: !1,
			configurable: !0
		}), r.defaults = n({}, i.AbstractMmlLayoutNode.defaults), r;
	}(i.AbstractMmlLayoutNode);
})), x = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMfenced = void 0;
	var a = r();
	e.MmlMfenced = function(e) {
		t(r, e);
		function r() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.texclass = a.TEXCLASS.INNER, t.separators = [], t.open = null, t.close = null, t;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "mfenced";
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.setTeXclass = function(e) {
			this.getPrevClass(e), this.open && (e = this.open.setTeXclass(e)), this.childNodes[0] && (e = this.childNodes[0].setTeXclass(e));
			for (var t = 1, n = this.childNodes.length; t < n; t++) this.separators[t - 1] && (e = this.separators[t - 1].setTeXclass(e)), this.childNodes[t] && (e = this.childNodes[t].setTeXclass(e));
			return this.close && (e = this.close.setTeXclass(e)), this.updateTeXclass(this.open), e;
		}, r.prototype.setChildInheritedAttributes = function(t, n, r, a) {
			var o, s;
			this.addFakeNodes();
			try {
				for (var c = i([this.open, this.close].concat(this.separators)), l = c.next(); !l.done; l = c.next()) {
					var u = l.value;
					u && u.setInheritedAttributes(t, n, r, a);
				}
			} catch (e) {
				o = { error: e };
			} finally {
				try {
					l && !l.done && (s = c.return) && s.call(c);
				} finally {
					if (o) throw o.error;
				}
			}
			e.prototype.setChildInheritedAttributes.call(this, t, n, r, a);
		}, r.prototype.addFakeNodes = function() {
			var e, t, n = this.attributes.getList("open", "close", "separators"), r = n.open, o = n.close, s = n.separators;
			if (r = r.replace(/[ \t\n\r]/g, ""), o = o.replace(/[ \t\n\r]/g, ""), s = s.replace(/[ \t\n\r]/g, ""), r && (this.open = this.fakeNode(r, {
				fence: !0,
				form: "prefix"
			}, a.TEXCLASS.OPEN)), s) {
				for (; s.length < this.childNodes.length - 1;) s += s.charAt(s.length - 1);
				var c = 0;
				try {
					for (var l = i(this.childNodes.slice(1)), u = l.next(); !u.done; u = l.next()) u.value && this.separators.push(this.fakeNode(s.charAt(c++)));
				} catch (t) {
					e = { error: t };
				} finally {
					try {
						u && !u.done && (t = l.return) && t.call(l);
					} finally {
						if (e) throw e.error;
					}
				}
			}
			o && (this.close = this.fakeNode(o, {
				fence: !0,
				form: "postfix"
			}, a.TEXCLASS.CLOSE));
		}, r.prototype.fakeNode = function(e, t, n) {
			t === void 0 && (t = {}), n === void 0 && (n = null);
			var r = this.factory.create("text").setText(e), i = this.factory.create("mo", t, [r]);
			return i.texClass = n, i.parent = this, i;
		}, r.defaults = n(n({}, a.AbstractMmlNode.defaults), {
			open: "(",
			close: ")",
			separators: ","
		}), r;
	}(a.AbstractMmlNode);
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
	})(), n = e && e.__assign || function() {
		return n = Object.assign || function(e) {
			for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
			return e;
		}, n.apply(this, arguments);
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMenclose = void 0;
	var i = r();
	e.MmlMenclose = function(e) {
		t(r, e);
		function r() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.texclass = i.TEXCLASS.ORD, t;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "menclose";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "arity", {
			get: function() {
				return -1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "linebreakContininer", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.setTeXclass = function(e) {
			return e = this.childNodes[0].setTeXclass(e), this.updateTeXclass(this.childNodes[0]), e;
		}, r.defaults = n(n({}, i.AbstractMmlNode.defaults), { notation: "longdiv" }), r;
	}(i.AbstractMmlNode);
})), C = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMaction = void 0;
	var i = r();
	e.MmlMaction = function(e) {
		t(r, e);
		function r() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "maction";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "arity", {
			get: function() {
				return 1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "selected", {
			get: function() {
				var e = this.attributes.get("selection"), t = Math.max(1, Math.min(this.childNodes.length, e)) - 1;
				return this.childNodes[t] || this.factory.create("mrow");
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "isEmbellished", {
			get: function() {
				return this.selected.isEmbellished;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "isSpacelike", {
			get: function() {
				return this.selected.isSpacelike;
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.core = function() {
			return this.selected.core();
		}, r.prototype.coreMO = function() {
			return this.selected.coreMO();
		}, r.prototype.verifyAttributes = function(t) {
			if (e.prototype.verifyAttributes.call(this, t), this.attributes.get("actiontype") !== "toggle" && this.attributes.getExplicit("selection") !== void 0) {
				var n = this.attributes.getAllAttributes();
				delete n.selection;
			}
		}, r.prototype.setTeXclass = function(e) {
			this.attributes.get("actiontype") === "tooltip" && this.childNodes[1] && this.childNodes[1].setTeXclass(null);
			var t = this.selected;
			return e = t.setTeXclass(e), this.updateTeXclass(t), e;
		}, r.prototype.nextToggleSelection = function() {
			var e = Math.max(1, this.attributes.get("selection") + 1);
			e > this.childNodes.length && (e = 1), this.attributes.set("selection", e);
		}, r.defaults = n(n({}, i.AbstractMmlNode.defaults), {
			actiontype: "toggle",
			selection: 1
		}), r;
	}(i.AbstractMmlNode);
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
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMsup = e.MmlMsub = e.MmlMsubsup = void 0;
	var i = r(), a = function(e) {
		t(r, e);
		function r() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "msubsup";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "arity", {
			get: function() {
				return 3;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "base", {
			get: function() {
				return 0;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "sub", {
			get: function() {
				return 1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "sup", {
			get: function() {
				return 2;
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.setChildInheritedAttributes = function(e, t, n, r) {
			var i = this.childNodes;
			i[0].setInheritedAttributes(e, t, n, r), i[1].setInheritedAttributes(e, !1, n + 1, r || this.sub === 1), i[2] && i[2].setInheritedAttributes(e, !1, n + 1, r || this.sub === 2);
		}, r.defaults = n(n({}, i.AbstractMmlBaseNode.defaults), {
			subscriptshift: "",
			superscriptshift: ""
		}), r;
	}(i.AbstractMmlBaseNode);
	e.MmlMsubsup = a, e.MmlMsub = function(e) {
		t(r, e);
		function r() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "msub";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "arity", {
			get: function() {
				return 2;
			},
			enumerable: !1,
			configurable: !0
		}), r.defaults = n({}, a.defaults), r;
	}(a), e.MmlMsup = function(e) {
		t(r, e);
		function r() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "msup";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "arity", {
			get: function() {
				return 2;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "sup", {
			get: function() {
				return 1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "sub", {
			get: function() {
				return 2;
			},
			enumerable: !1,
			configurable: !0
		}), r.defaults = n({}, a.defaults), r;
	}(a);
})), T = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMover = e.MmlMunder = e.MmlMunderover = void 0;
	var i = r(), a = function(e) {
		t(r, e);
		function r() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "munderover";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "arity", {
			get: function() {
				return 3;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "base", {
			get: function() {
				return 0;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "under", {
			get: function() {
				return 1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "over", {
			get: function() {
				return 2;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "linebreakContainer", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.setChildInheritedAttributes = function(e, t, n, r) {
			var i = this.childNodes;
			i[0].setInheritedAttributes(e, t, n, r || !!i[this.over]);
			var a = !!(!t && i[0].coreMO().attributes.get("movablelimits")), o = this.constructor.ACCENTS;
			i[1].setInheritedAttributes(e, !1, this.getScriptlevel(o[1], a, n), r || this.under === 1), this.setInheritedAccent(1, o[1], t, n, r, a), i[2] && (i[2].setInheritedAttributes(e, !1, this.getScriptlevel(o[2], a, n), r || this.under === 2), this.setInheritedAccent(2, o[2], t, n, r, a));
		}, r.prototype.getScriptlevel = function(e, t, n) {
			return (t || !this.attributes.get(e)) && n++, n;
		}, r.prototype.setInheritedAccent = function(e, t, n, r, i, a) {
			var o = this.childNodes[e];
			if (this.attributes.getExplicit(t) == null && o.isEmbellished) {
				var s = o.coreMO().attributes.get("accent");
				this.attributes.setInherited(t, s), s !== this.attributes.getDefault(t) && o.setInheritedAttributes({}, n, this.getScriptlevel(t, a, r), i);
			}
		}, r.defaults = n(n({}, i.AbstractMmlBaseNode.defaults), {
			accent: !1,
			accentunder: !1,
			align: "center"
		}), r.ACCENTS = [
			"",
			"accentunder",
			"accent"
		], r;
	}(i.AbstractMmlBaseNode);
	e.MmlMunderover = a, e.MmlMunder = function(e) {
		t(r, e);
		function r() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "munder";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "arity", {
			get: function() {
				return 2;
			},
			enumerable: !1,
			configurable: !0
		}), r.defaults = n({}, a.defaults), r;
	}(a), e.MmlMover = function(e) {
		t(r, e);
		function r() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "mover";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "arity", {
			get: function() {
				return 2;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "over", {
			get: function() {
				return 1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "under", {
			get: function() {
				return 2;
			},
			enumerable: !1,
			configurable: !0
		}), r.defaults = n({}, a.defaults), r.ACCENTS = [
			"",
			"accent",
			"accentunder"
		], r;
	}(a);
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
	})(), n = e && e.__assign || function() {
		return n = Object.assign || function(e) {
			for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
			return e;
		}, n.apply(this, arguments);
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlNone = e.MmlMprescripts = e.MmlMmultiscripts = void 0;
	var i = r(), a = w();
	e.MmlMmultiscripts = function(e) {
		t(r, e);
		function r() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "mmultiscripts";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "arity", {
			get: function() {
				return 1;
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.setChildInheritedAttributes = function(e, t, n, r) {
			this.childNodes[0].setInheritedAttributes(e, t, n, r);
			for (var i = !1, a = 1, o = 0; a < this.childNodes.length; a++) {
				var s = this.childNodes[a];
				if (s.isKind("mprescripts")) {
					if (!i && (i = !0, a % 2 == 0)) {
						var c = this.factory.create("mrow");
						this.childNodes.splice(a, 0, c), c.parent = this, a++;
					}
				} else {
					var l = r || o % 2 == 0;
					s.setInheritedAttributes(e, !1, n + 1, l), o++;
				}
			}
			this.childNodes.length % 2 == +!!i && (this.appendChild(this.factory.create("mrow")), this.childNodes[this.childNodes.length - 1].setInheritedAttributes(e, !1, n + 1, r));
		}, r.prototype.verifyChildren = function(t) {
			for (var n = !1, r = t.fixMmultiscripts, i = 0; i < this.childNodes.length; i++) {
				var a = this.childNodes[i];
				a.isKind("mprescripts") && (n ? a.mError(a.kind + " can only appear once in " + this.kind, t, !0) : (n = !0, i % 2 == 0 && !r && this.mError("There must be an equal number of prescripts of each type", t)));
			}
			this.childNodes.length % 2 == +!!n && !r && this.mError("There must be an equal number of scripts of each type", t), e.prototype.verifyChildren.call(this, t);
		}, r.defaults = n({}, a.MmlMsubsup.defaults), r;
	}(a.MmlMsubsup), e.MmlMprescripts = function(e) {
		t(r, e);
		function r() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "mprescripts";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "arity", {
			get: function() {
				return 0;
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.verifyTree = function(t) {
			e.prototype.verifyTree.call(this, t), this.parent && !this.parent.isKind("mmultiscripts") && this.mError(this.kind + " must be a child of mmultiscripts", t, !0);
		}, r.defaults = n({}, i.AbstractMmlNode.defaults), r;
	}(i.AbstractMmlNode), e.MmlNone = function(e) {
		t(r, e);
		function r() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "none";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "arity", {
			get: function() {
				return 0;
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.verifyTree = function(t) {
			e.prototype.verifyTree.call(this, t), this.parent && !this.parent.isKind("mmultiscripts") && this.mError(this.kind + " must be a child of mmultiscripts", t, !0);
		}, r.defaults = n({}, i.AbstractMmlNode.defaults), r;
	}(i.AbstractMmlNode);
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
	})(), n = e && e.__assign || function() {
		return n = Object.assign || function(e) {
			for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
			return e;
		}, n.apply(this, arguments);
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMtable = void 0;
	var o = r(), s = i();
	e.MmlMtable = function(e) {
		t(r, e);
		function r() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.properties = { useHeight: !0 }, t.texclass = o.TEXCLASS.ORD, t;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "mtable";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "linebreakContainer", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.setInheritedAttributes = function(t, n, r, i) {
			var s, c;
			try {
				for (var l = a(o.indentAttributes), u = l.next(); !u.done; u = l.next()) {
					var d = u.value;
					t[d] && this.attributes.setInherited(d, t[d][1]), this.attributes.getExplicit(d) !== void 0 && delete this.attributes.getAllAttributes()[d];
				}
			} catch (e) {
				s = { error: e };
			} finally {
				try {
					u && !u.done && (c = l.return) && c.call(l);
				} finally {
					if (s) throw s.error;
				}
			}
			e.prototype.setInheritedAttributes.call(this, t, n, r, i);
		}, r.prototype.setChildInheritedAttributes = function(e, t, n, r) {
			var i, o, c, l;
			try {
				for (var u = a(this.childNodes), d = u.next(); !d.done; d = u.next()) {
					var f = d.value;
					f.isKind("mtr") || this.replaceChild(this.factory.create("mtr"), f).appendChild(f);
				}
			} catch (e) {
				i = { error: e };
			} finally {
				try {
					d && !d.done && (o = u.return) && o.call(u);
				} finally {
					if (i) throw i.error;
				}
			}
			n = this.getProperty("scriptlevel") || n, t = !!(this.attributes.getExplicit("displaystyle") || this.attributes.getDefault("displaystyle")), e = this.addInheritedAttributes(e, {
				columnalign: this.attributes.get("columnalign"),
				rowalign: "center"
			});
			var p = this.attributes.getExplicit("data-cramped"), m = (0, s.split)(this.attributes.get("rowalign"));
			try {
				for (var h = a(this.childNodes), g = h.next(); !g.done; g = h.next()) {
					var f = g.value;
					e.rowalign[1] = m.shift() || e.rowalign[1], f.setInheritedAttributes(e, t, n, !!p);
				}
			} catch (e) {
				c = { error: e };
			} finally {
				try {
					g && !g.done && (l = h.return) && l.call(h);
				} finally {
					if (c) throw c.error;
				}
			}
		}, r.prototype.verifyChildren = function(t) {
			for (var n = null, r = this.factory, i = 0; i < this.childNodes.length; i++) {
				var a = this.childNodes[i];
				if (a.isKind("mtr")) n = null;
				else {
					var o = a.isKind("mtd");
					if (n ? (this.removeChild(a), i--) : n = this.replaceChild(r.create("mtr"), a), n.appendChild(o ? a : r.create("mtd", {}, [a])), !t.fixMtables) {
						a.parent.removeChild(a), a.parent = this, o && n.appendChild(r.create("mtd"));
						var s = a.mError("Children of " + this.kind + " must be mtr or mlabeledtr", t, o);
						n.childNodes[n.childNodes.length - 1].appendChild(s);
					}
				}
			}
			e.prototype.verifyChildren.call(this, t);
		}, r.prototype.setTeXclass = function(e) {
			var t, n;
			this.getPrevClass(e);
			try {
				for (var r = a(this.childNodes), i = r.next(); !i.done; i = r.next()) i.value.setTeXclass(null);
			} catch (e) {
				t = { error: e };
			} finally {
				try {
					i && !i.done && (n = r.return) && n.call(r);
				} finally {
					if (t) throw t.error;
				}
			}
			return this;
		}, r.defaults = n(n({}, o.AbstractMmlNode.defaults), {
			align: "axis",
			rowalign: "baseline",
			columnalign: "center",
			groupalign: "{left}",
			alignmentscope: !0,
			columnwidth: "auto",
			width: "auto",
			rowspacing: "1ex",
			columnspacing: ".8em",
			rowlines: "none",
			columnlines: "none",
			frame: "none",
			framespacing: "0.4em 0.5ex",
			equalrows: !1,
			equalcolumns: !1,
			displaystyle: !1,
			side: "right",
			minlabelspacing: "0.8em"
		}), r;
	}(o.AbstractMmlNode);
})), O = /* @__PURE__ */ e(((e) => {
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
	})(), a = e && e.__assign || function() {
		return a = Object.assign || function(e) {
			for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
			return e;
		}, a.apply(this, arguments);
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
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMlabeledtr = e.MmlMtr = void 0;
	var s = r(), c = t(), l = i(), u = function(e) {
		n(t, e);
		function t() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(t.prototype, "kind", {
			get: function() {
				return "mtr";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(t.prototype, "linebreakContainer", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), t.prototype.setChildInheritedAttributes = function(e, t, n, r) {
			var i, a, s, c;
			try {
				for (var u = o(this.childNodes), d = u.next(); !d.done; d = u.next()) {
					var f = d.value;
					f.isKind("mtd") || this.replaceChild(this.factory.create("mtd"), f).appendChild(f);
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
			var p = (0, l.split)(this.attributes.get("columnalign"));
			this.arity === 1 && p.unshift(this.parent.attributes.get("side")), e = this.addInheritedAttributes(e, {
				rowalign: this.attributes.get("rowalign"),
				columnalign: "center"
			});
			try {
				for (var m = o(this.childNodes), h = m.next(); !h.done; h = m.next()) {
					var f = h.value;
					e.columnalign[1] = p.shift() || e.columnalign[1], f.setInheritedAttributes(e, t, n, r);
				}
			} catch (e) {
				s = { error: e };
			} finally {
				try {
					h && !h.done && (c = m.return) && c.call(m);
				} finally {
					if (s) throw s.error;
				}
			}
		}, t.prototype.verifyChildren = function(t) {
			var n, r;
			if (this.parent && !this.parent.isKind("mtable")) {
				this.mError(this.kind + " can only be a child of an mtable", t, !0);
				return;
			}
			try {
				for (var i = o(this.childNodes), a = i.next(); !a.done; a = i.next()) {
					var s = a.value;
					s.isKind("mtd") || (this.replaceChild(this.factory.create("mtd"), s).appendChild(s), t.fixMtables || s.mError("Children of " + this.kind + " must be mtd", t));
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
			e.prototype.verifyChildren.call(this, t);
		}, t.prototype.setTeXclass = function(e) {
			var t, n;
			this.getPrevClass(e);
			try {
				for (var r = o(this.childNodes), i = r.next(); !i.done; i = r.next()) i.value.setTeXclass(null);
			} catch (e) {
				t = { error: e };
			} finally {
				try {
					i && !i.done && (n = r.return) && n.call(r);
				} finally {
					if (t) throw t.error;
				}
			}
			return this;
		}, t.defaults = a(a({}, s.AbstractMmlNode.defaults), {
			rowalign: c.INHERIT,
			columnalign: c.INHERIT,
			groupalign: c.INHERIT
		}), t;
	}(s.AbstractMmlNode);
	e.MmlMtr = u, e.MmlMlabeledtr = function(e) {
		n(t, e);
		function t() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(t.prototype, "kind", {
			get: function() {
				return "mlabeledtr";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(t.prototype, "arity", {
			get: function() {
				return 1;
			},
			enumerable: !1,
			configurable: !0
		}), t;
	}(u);
})), k = /* @__PURE__ */ e(((e) => {
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
	})(), i = e && e.__assign || function() {
		return i = Object.assign || function(e) {
			for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
			return e;
		}, i.apply(this, arguments);
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMtd = void 0;
	var a = r(), o = t();
	e.MmlMtd = function(e) {
		n(t, e);
		function t() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(t.prototype, "kind", {
			get: function() {
				return "mtd";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(t.prototype, "arity", {
			get: function() {
				return -1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(t.prototype, "linebreakContainer", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), t.prototype.verifyChildren = function(t) {
			if (this.parent && !this.parent.isKind("mtr")) {
				this.mError(this.kind + " can only be a child of an mtr or mlabeledtr", t, !0);
				return;
			}
			e.prototype.verifyChildren.call(this, t);
		}, t.prototype.setTeXclass = function(e) {
			return this.getPrevClass(e), this.childNodes[0].setTeXclass(null), this;
		}, t.defaults = i(i({}, a.AbstractMmlBaseNode.defaults), {
			rowspan: 1,
			columnspan: 1,
			rowalign: o.INHERIT,
			columnalign: o.INHERIT,
			groupalign: o.INHERIT
		}), t;
	}(a.AbstractMmlBaseNode);
})), A = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlMglyph = void 0;
	var i = r();
	e.MmlMglyph = function(e) {
		t(r, e);
		function r() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.texclass = i.TEXCLASS.ORD, t;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "mglyph";
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.verifyAttributes = function(t) {
			var n = this.attributes.getList("src", "fontfamily", "index"), r = n.src, i = n.fontfamily, a = n.index;
			r === "" && (i === "" || a === "") ? this.mError("mglyph must have either src or fontfamily and index attributes", t, !0) : e.prototype.verifyAttributes.call(this, t);
		}, r.defaults = n(n({}, i.AbstractMmlTokenNode.defaults), {
			alt: "",
			src: "",
			index: "",
			width: "auto",
			height: "auto",
			valign: "0em"
		}), r;
	}(i.AbstractMmlTokenNode);
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
	})(), n = e && e.__assign || function() {
		return n = Object.assign || function(e) {
			for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
			return e;
		}, n.apply(this, arguments);
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MmlAnnotation = e.MmlAnnotationXML = e.MmlSemantics = void 0;
	var i = r();
	e.MmlSemantics = function(e) {
		t(r, e);
		function r() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "semantics";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "arity", {
			get: function() {
				return 1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "notParent", {
			get: function() {
				return !0;
			},
			enumerable: !1,
			configurable: !0
		}), r.defaults = n(n({}, i.AbstractMmlBaseNode.defaults), {
			definitionUrl: null,
			encoding: null
		}), r;
	}(i.AbstractMmlBaseNode);
	var a = function(e) {
		t(r, e);
		function r() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "annotation-xml";
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.setChildInheritedAttributes = function() {}, r.defaults = n(n({}, i.AbstractMmlNode.defaults), {
			definitionUrl: null,
			encoding: null,
			cd: "mathmlkeys",
			name: "",
			src: null
		}), r;
	}(i.AbstractMmlNode);
	e.MmlAnnotationXML = a, e.MmlAnnotation = function(e) {
		t(r, e);
		function r() {
			var t = e !== null && e.apply(this, arguments) || this;
			return t.properties = { isChars: !0 }, t;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "annotation";
			},
			enumerable: !1,
			configurable: !0
		}), r.defaults = n({}, a.defaults), r;
	}(a);
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
	})(), n = e && e.__assign || function() {
		return n = Object.assign || function(e) {
			for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
			return e;
		}, n.apply(this, arguments);
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.TeXAtom = void 0;
	var i = r(), a = o(), s = function(e) {
		t(r, e);
		function r(t, n, r) {
			var a = e.call(this, t, n, r) || this;
			return a.texclass = i.TEXCLASS.ORD, a.setProperty("texClass", a.texClass), a;
		}
		return Object.defineProperty(r.prototype, "kind", {
			get: function() {
				return "TeXAtom";
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "arity", {
			get: function() {
				return -1;
			},
			enumerable: !1,
			configurable: !0
		}), Object.defineProperty(r.prototype, "notParent", {
			get: function() {
				return this.childNodes[0] && this.childNodes[0].childNodes.length === 1;
			},
			enumerable: !1,
			configurable: !0
		}), r.prototype.setTeXclass = function(e) {
			return this.childNodes[0].setTeXclass(null), this.adjustTeXclass(e);
		}, r.prototype.adjustTeXclass = function(e) {
			return e;
		}, r.defaults = n({}, i.AbstractMmlBaseNode.defaults), r;
	}(i.AbstractMmlBaseNode);
	e.TeXAtom = s, s.prototype.adjustTeXclass = a.MmlMo.prototype.adjustTeXclass;
}));
//#endregion
export { u as C, s as E, d as S, c as T, g as _, O as a, p as b, T as c, S as d, x as f, _ as g, v as h, k as i, w as l, y as m, j as n, D as o, b as p, A as r, E as s, M as t, C as u, h as v, l as w, f as x, m as y };
