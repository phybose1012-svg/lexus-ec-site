import { t as e } from "./index.js";
//#region node_modules/mathjax-full/js/core/DOMAdaptor.js
var t = /* @__PURE__ */ e(((e) => {
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
	Object.defineProperty(e, "__esModule", { value: !0 }), e.AbstractDOMAdaptor = void 0, e.AbstractDOMAdaptor = function() {
		function e(e) {
			e === void 0 && (e = null), this.document = e;
		}
		return e.prototype.node = function(e, n, r, i) {
			var a, o;
			n === void 0 && (n = {}), r === void 0 && (r = []);
			var s = this.create(e, i);
			this.setAttributes(s, n);
			try {
				for (var c = t(r), l = c.next(); !l.done; l = c.next()) {
					var u = l.value;
					this.append(s, u);
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
			return s;
		}, e.prototype.setAttributes = function(e, n) {
			var r, i, a, o, s, c;
			if (n.style && typeof n.style != "string") try {
				for (var l = t(Object.keys(n.style)), u = l.next(); !u.done; u = l.next()) {
					var d = u.value;
					this.setStyle(e, d.replace(/-([a-z])/g, function(e, t) {
						return t.toUpperCase();
					}), n.style[d]);
				}
			} catch (e) {
				r = { error: e };
			} finally {
				try {
					u && !u.done && (i = l.return) && i.call(l);
				} finally {
					if (r) throw r.error;
				}
			}
			if (n.properties) try {
				for (var f = t(Object.keys(n.properties)), p = f.next(); !p.done; p = f.next()) {
					var d = p.value;
					e[d] = n.properties[d];
				}
			} catch (e) {
				a = { error: e };
			} finally {
				try {
					p && !p.done && (o = f.return) && o.call(f);
				} finally {
					if (a) throw a.error;
				}
			}
			try {
				for (var m = t(Object.keys(n)), h = m.next(); !h.done; h = m.next()) {
					var d = h.value;
					(d !== "style" || typeof n.style == "string") && d !== "properties" && this.setAttribute(e, d, n[d]);
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
		}, e.prototype.replace = function(e, t) {
			return this.insert(e, t), this.remove(t), t;
		}, e.prototype.childNode = function(e, t) {
			return this.childNodes(e)[t];
		}, e.prototype.allClasses = function(e) {
			var t = this.getAttribute(e, "class");
			return t ? t.replace(/  +/g, " ").replace(/^ /, "").replace(/ $/, "").split(/ /) : [];
		}, e;
	}();
})), n = /* @__PURE__ */ e(((e) => {
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
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.HTMLAdaptor = void 0, e.HTMLAdaptor = function(e) {
		n(t, e);
		function t(t) {
			var n = e.call(this, t.document) || this;
			return n.window = t, n.parser = new t.DOMParser(), n;
		}
		return t.prototype.parse = function(e, t) {
			return t === void 0 && (t = "text/html"), this.parser.parseFromString(e, t);
		}, t.prototype.create = function(e, t) {
			return t ? this.document.createElementNS(t, e) : this.document.createElement(e);
		}, t.prototype.text = function(e) {
			return this.document.createTextNode(e);
		}, t.prototype.head = function(e) {
			return e.head || e;
		}, t.prototype.body = function(e) {
			return e.body || e;
		}, t.prototype.root = function(e) {
			return e.documentElement || e;
		}, t.prototype.doctype = function(e) {
			return e.doctype ? `<!DOCTYPE ${e.doctype.name}>` : "";
		}, t.prototype.tags = function(e, t, n) {
			n === void 0 && (n = null);
			var r = n ? e.getElementsByTagNameNS(n, t) : e.getElementsByTagName(t);
			return Array.from(r);
		}, t.prototype.getElements = function(e, t) {
			var n, i, a = [];
			try {
				for (var o = r(e), s = o.next(); !s.done; s = o.next()) {
					var c = s.value;
					typeof c == "string" ? a = a.concat(Array.from(this.document.querySelectorAll(c))) : Array.isArray(c) || c instanceof this.window.NodeList || c instanceof this.window.HTMLCollection ? a = a.concat(Array.from(c)) : a.push(c);
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
			return a;
		}, t.prototype.contains = function(e, t) {
			return e.contains(t);
		}, t.prototype.parent = function(e) {
			return e.parentNode;
		}, t.prototype.append = function(e, t) {
			return e.appendChild(t);
		}, t.prototype.insert = function(e, t) {
			return this.parent(t).insertBefore(e, t);
		}, t.prototype.remove = function(e) {
			return this.parent(e).removeChild(e);
		}, t.prototype.replace = function(e, t) {
			return this.parent(t).replaceChild(e, t);
		}, t.prototype.clone = function(e) {
			return e.cloneNode(!0);
		}, t.prototype.split = function(e, t) {
			return e.splitText(t);
		}, t.prototype.next = function(e) {
			return e.nextSibling;
		}, t.prototype.previous = function(e) {
			return e.previousSibling;
		}, t.prototype.firstChild = function(e) {
			return e.firstChild;
		}, t.prototype.lastChild = function(e) {
			return e.lastChild;
		}, t.prototype.childNodes = function(e) {
			return Array.from(e.childNodes);
		}, t.prototype.childNode = function(e, t) {
			return e.childNodes[t];
		}, t.prototype.kind = function(e) {
			var t = e.nodeType;
			return t === 1 || t === 3 || t === 8 ? e.nodeName.toLowerCase() : "";
		}, t.prototype.value = function(e) {
			return e.nodeValue || "";
		}, t.prototype.textContent = function(e) {
			return e.textContent;
		}, t.prototype.innerHTML = function(e) {
			return e.innerHTML;
		}, t.prototype.outerHTML = function(e) {
			return e.outerHTML;
		}, t.prototype.serializeXML = function(e) {
			return new this.window.XMLSerializer().serializeToString(e);
		}, t.prototype.setAttribute = function(e, t, n, r) {
			return r === void 0 && (r = null), r ? (t = r.replace(/.*\//, "") + ":" + t.replace(/^.*:/, ""), e.setAttributeNS(r, t, n)) : e.setAttribute(t, n);
		}, t.prototype.getAttribute = function(e, t) {
			return e.getAttribute(t);
		}, t.prototype.removeAttribute = function(e, t) {
			return e.removeAttribute(t);
		}, t.prototype.hasAttribute = function(e, t) {
			return e.hasAttribute(t);
		}, t.prototype.allAttributes = function(e) {
			return Array.from(e.attributes).map(function(e) {
				return {
					name: e.name,
					value: e.value
				};
			});
		}, t.prototype.addClass = function(e, t) {
			e.classList ? e.classList.add(t) : e.className = (e.className + " " + t).trim();
		}, t.prototype.removeClass = function(e, t) {
			e.classList ? e.classList.remove(t) : e.className = e.className.split(/ /).filter(function(e) {
				return e !== t;
			}).join(" ");
		}, t.prototype.hasClass = function(e, t) {
			return e.classList ? e.classList.contains(t) : e.className.split(/ /).indexOf(t) >= 0;
		}, t.prototype.setStyle = function(e, t, n) {
			e.style[t] = n;
		}, t.prototype.getStyle = function(e, t) {
			return e.style[t];
		}, t.prototype.allStyles = function(e) {
			return e.style.cssText;
		}, t.prototype.insertRules = function(e, t) {
			var n, i;
			try {
				for (var a = r(t.reverse()), o = a.next(); !o.done; o = a.next()) {
					var s = o.value;
					try {
						e.sheet.insertRule(s, 0);
					} catch (e) {
						console.warn(`MathJax: can't insert css rule '${s}': ${e.message}`);
					}
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
		}, t.prototype.fontSize = function(e) {
			var t = this.window.getComputedStyle(e);
			return parseFloat(t.fontSize);
		}, t.prototype.fontFamily = function(e) {
			return this.window.getComputedStyle(e).fontFamily || "";
		}, t.prototype.nodeSize = function(e, t, n) {
			if (t === void 0 && (t = 1), n === void 0 && (n = !1), n && e.getBBox) {
				var r = e.getBBox(), i = r.width, a = r.height;
				return [i / t, a / t];
			}
			return [e.offsetWidth / t, e.offsetHeight / t];
		}, t.prototype.nodeBBox = function(e) {
			var t = e.getBoundingClientRect();
			return {
				left: t.left,
				right: t.right,
				top: t.top,
				bottom: t.bottom
			};
		}, t;
	}(t().AbstractDOMAdaptor);
}));
//#endregion
export default n();
