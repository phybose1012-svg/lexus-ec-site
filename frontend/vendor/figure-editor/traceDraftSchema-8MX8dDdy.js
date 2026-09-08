function e(e) {
	let t = typeof e == "string" ? Number.parseFloat(e) : e;
	return typeof t == "number" && Number.isFinite(t) ? t : null;
}
function t(t) {
	if (!t || typeof t != "object") return null;
	let n = t, r = e(n.x), i = e(n.y);
	if (r === null || i === null) return null;
	let a = (e) => Math.min(1, Math.max(0, e));
	return {
		x: a(r),
		y: a(i)
	};
}
function n(e, n) {
	if (!Array.isArray(e) || e.length !== n) return null;
	let r = [];
	for (let n of e) {
		let e = t(n);
		if (!e) return null;
		r.push(e);
	}
	return r;
}
function r(e, n) {
	if (!Array.isArray(e) || e.length < n) return null;
	let r = [];
	for (let n of e.slice(0, 40)) {
		let e = t(n);
		if (!e) return null;
		r.push(e);
	}
	return r.length >= n ? r : null;
}
function i(i) {
	if (!i || typeof i != "object") return null;
	let a = i;
	switch (a.kind) {
		case "point": {
			let n = t(a.at);
			if (!n) return null;
			let r = e(a.radius);
			return {
				kind: "point",
				at: n,
				...r !== null && r > 0 ? { radius: Math.min(1, r) } : {}
			};
		}
		case "line": {
			let e = n(a.points, 2);
			return e ? {
				kind: "line",
				points: e
			} : null;
		}
		case "polyline": {
			let e = r(a.points, 3);
			return e ? {
				kind: "polyline",
				points: e,
				...a.closed === !0 ? { closed: !0 } : {}
			} : null;
		}
		case "rectangle": {
			let e = n(a.corners, 2);
			return e ? {
				kind: "rectangle",
				corners: e
			} : null;
		}
		case "ellipse": {
			let e = n(a.bounds, 2);
			return e ? {
				kind: "ellipse",
				bounds: e
			} : null;
		}
		case "circle": {
			let n = t(a.center), r = e(a.radius);
			return !n || r === null || !(r > 0) ? null : {
				kind: "circle",
				center: n,
				radius: Math.min(1, r)
			};
		}
		case "arc": {
			let e = n(a.points, 3);
			return e ? {
				kind: "arc",
				points: e
			} : null;
		}
		case "curve": {
			let e = n(a.points, 4);
			return e ? {
				kind: "curve",
				points: e
			} : null;
		}
		case "label": {
			let e = t(a.at), n = typeof a.text == "string" ? a.text.replace(/[\s\u0000-\u001f\u007f]+/g, " ").trim() : "";
			return !e || !n ? null : {
				kind: "label",
				at: e,
				text: n.slice(0, 120),
				...a.math === !0 ? { math: !0 } : {}
			};
		}
		default: return null;
	}
}
function a(e) {
	let t = e && typeof e == "object" ? e : {}, n = Array.isArray(t.shapes) ? t.shapes : [], r = [];
	for (let e of n) {
		if (r.length >= 60) break;
		let t = i(e);
		t && r.push(t);
	}
	let a = typeof t.note == "string" ? t.note.trim() : "";
	return {
		shapes: r,
		...a ? { note: a } : {}
	};
}
//#endregion
export { a as parseTraceDraft };
