// Original SVG diagrams for 自治医科大学 2025 一般選抜・第一次試験 数学.
//
// Every drawing is reconstructed from the published mathematical conditions.
// Restricted answer-book crops are used only to identify which relationship
// needs a visual explanation; no crop is traced, embedded, or copied.
import fs from "node:fs";

const packageId = "jichi-medical-2025-general-mathematics";
const output = new URL(`../public/assets/past-exams/${packageId}/figures/`, import.meta.url);
const figures = [];
const esc = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");
const fixed = (value) => Number(value).toFixed(2);
const fontData = (name) => fs
  .readFileSync(new URL(`../public/assets/vendor/katex/fonts/${name}.woff2`, import.meta.url))
  .toString("base64");

const katexFonts = `@font-face{font-family:'KaTeX_Main';font-style:normal;font-weight:400;src:url(data:font/woff2;base64,${fontData("KaTeX_Main-Regular")}) format('woff2')}@font-face{font-family:'KaTeX_Math';font-style:italic;font-weight:400;src:url(data:font/woff2;base64,${fontData("KaTeX_Math-Italic")}) format('woff2')}`;
const line = (x1, y1, x2, y2, extra = "") =>
  `<line x1="${fixed(x1)}" y1="${fixed(y1)}" x2="${fixed(x2)}" y2="${fixed(y2)}" ${extra}/>`;
const circle = (x, y, r, extra = "") =>
  `<circle cx="${fixed(x)}" cy="${fixed(y)}" r="${fixed(r)}" ${extra}/>`;
const rect = (x, y, width, height, extra = "") =>
  `<rect x="${fixed(x)}" y="${fixed(y)}" width="${fixed(width)}" height="${fixed(height)}" ${extra}/>`;
const polygon = (points, extra = "") =>
  `<polygon points="${points.map(([x, y]) => `${fixed(x)},${fixed(y)}`).join(" ")}" ${extra}/>`;
const polyline = (points, extra = "") =>
  `<polyline points="${points.map(([x, y]) => `${fixed(x)},${fixed(y)}`).join(" ")}" ${extra}/>`;
const pathFromPoints = (points) => points
  .map(([x, y], index) => `${index ? "L" : "M"}${fixed(x)},${fixed(y)}`)
  .join(" ");
const span = (value, klass) => `<tspan class="${klass}">${esc(value)}</tspan>`;
const mi = (value) => span(value, "mi");
const rm = (value) => span(value, "rm");
const jp = (value) => span(value, "jp");
const mathText = (x, y, parts, extra = "", small = false) =>
  `<text x="${fixed(x)}" y="${fixed(y)}" class="math${small ? " small" : ""}" ${extra}>${parts.join("")}</text>`;
const plainText = (x, y, value, extra = "") =>
  `<text x="${fixed(x)}" y="${fixed(y)}" ${extra}>${esc(value)}</text>`;

function add(id, width, height, alt, caption, body, extraDefs = "") {
  figures.push({ id, width, height, alt, caption, src: `/assets/past-exams/${packageId}/figures/${id}.svg` });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title"><title id="title">${esc(alt)}</title><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#18334c"/></marker><marker id="arrow-gold" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#bd8b27"/></marker>${extraDefs}</defs><style>${katexFonts}text{font-family:'Yu Gothic','Meiryo',sans-serif;font-size:18px;fill:#18334c;stroke:none}.math{font-family:'KaTeX_Main','Times New Roman',serif;font-size:21px}.math .mi{font-family:'KaTeX_Math','Times New Roman',serif;font-style:italic}.math .rm{font-family:'KaTeX_Main','Times New Roman',serif;font-style:normal}.math .jp{font-family:'Yu Gothic','Meiryo',sans-serif;font-style:normal}.small{font-size:16px}line,path,circle,ellipse,rect,polygon,polyline{vector-effect:non-scaling-stroke}.axis{stroke:#18334c;stroke-width:1.7}.guide{stroke:#9cabb8;stroke-width:1.2;stroke-dasharray:5 5}.hidden{stroke:#8090a0;stroke-width:1.45;stroke-dasharray:6 6}.edge{stroke:#18334c;stroke-width:2}.construction{stroke:#bd8b27;stroke-width:2.4}.curve{stroke:#173f69;stroke-width:2.8}.curve-secondary{stroke:#bd8b27;stroke-width:2.2}.point{fill:white;stroke:#173f69;stroke-width:2}.point-accent{fill:#bd8b27;stroke:white;stroke-width:1.6}.plane{fill:#eef4f8;stroke:#7f94a6;stroke-width:1.5}.region{fill:#fff1c9;stroke:none;opacity:.8}.label-bg{fill:white;stroke:#d9e2e9;stroke-width:1}</style><rect width="100%" height="100%" fill="white"/><g stroke="#18334c" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
  fs.writeFileSync(new URL(`${id}.svg`, output), svg);
}

fs.mkdirSync(output, { recursive: true });

// ---------------------------------------------------------------------------
// Problem 4: the explanation solves directly for
// h(t)=-t^2/(2t+3), -1 <= t <= 1. Its value range is -1 <= k <= 0.
// ---------------------------------------------------------------------------
{
  const h = (t) => -t * t / (2 * t + 3);
  const plot = { left: 88, right: 650, top: 52, bottom: 334, xMin: -1.25, xMax: 1.25, yMin: -1.15, yMax: 0.25 };
  const px = (x) => plot.left + (x - plot.xMin) * (plot.right - plot.left) / (plot.xMax - plot.xMin);
  const py = (y) => plot.bottom - (y - plot.yMin) * (plot.bottom - plot.top) / (plot.yMax - plot.yMin);
  const sample = (fn, from, to, count = 140) => Array.from({ length: count + 1 }, (_, i) => {
    const x = from + (to - from) * i / count;
    return [px(x), py(fn(x))];
  });
  let body = "";
  body += line(plot.left, py(0), plot.right + 18, py(0), 'class="axis" marker-end="url(#arrow)"');
  body += line(px(0), plot.bottom, px(0), plot.top - 18, 'class="axis" marker-end="url(#arrow)"');
  body += `<path d="${pathFromPoints(sample(h, -1, 1))}" class="curve"/>`;
  body += line(px(-1), py(0), px(-1), py(-1), 'class="guide"');
  body += line(px(1), py(0), px(1), py(-0.2), 'class="guide"');
  body += line(px(-1.2), py(-1), px(-1), py(-1), 'class="guide"');
  body += circle(px(-1), py(-1), 5.2, 'class="point-accent"');
  body += circle(px(0), py(0), 5.2, 'class="point-accent"');
  body += circle(px(1), py(-0.2), 4.6, 'class="point"');
  body += mathText(plot.right + 23, py(0) + 7, [mi("t")]);
  body += mathText(px(0) + 9, plot.top - 17, [mi("y")]);
  body += mathText(px(-1), py(0) - 14, [rm("−1")], 'text-anchor="middle"', true);
  body += mathText(px(1), py(0) - 14, [rm("1")], 'text-anchor="middle"', true);
  body += mathText(px(-1) + 10, py(-1) + 27, [rm("(−1, −1)")], "", true);
  body += mathText(px(1) - 8, py(-0.2) + 28, [rm("(1, −1/5)")], 'text-anchor="end"', true);
  body += mathText(px(0.42), py(h(0.42)) + 62, [mi("k"), rm("="), mi("h"), rm("("), mi("t"), rm(")")], "", true);
  body += rect(478, 292, 190, 56, 'rx="9" class="label-bg"');
  body += mathText(573, 326, [rm("−1≦"), mi("k"), rm("≦0")], 'text-anchor="middle"');
  add(
    "ans-q4-k-range-graph",
    720,
    380,
    "区間マイナス1以上1以下における関数k=h(t)=-tの2乗/(2t+3)のグラフ。最大値h(0)=0、最小値h(-1)=-1から、値域-1≦k≦0を示す。",
    "k=h(t) の最大値 0 と最小値 −1 から、−1≦k≦0 を読み取る。",
    body,
  );
}

// ---------------------------------------------------------------------------
// Problem 7: regular tetrahedron. Coordinates form an exact unit tetrahedron;
// the projection is oblique only for legibility. M is the midpoint of CD.
// ---------------------------------------------------------------------------
{
  const A3 = [-0.5, 0, 0];
  const B3 = [0.5, 0, 0];
  const C3 = [0, Math.sqrt(3) / 2, 0];
  const D3 = [0, Math.sqrt(3) / 6, Math.sqrt(2 / 3)];
  const lerp3 = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const P3 = lerp3(A3, B3, 0.42);
  const M3 = lerp3(C3, D3, 0.5);
  // Keep CD vertical and PM horizontal while leaving AB oblique. This makes
  // M unambiguously the midpoint of CD instead of appearing to lie on AB.
  const project = ([x, y, z]) => [
    220 + 160 * x + 288.675134594813 * y + 204.124145231932 * z,
    280 + 240 * x + 144.337567297406 * y - 251.154348293368 * z,
  ];
  const points = Object.fromEntries(Object.entries({ A: A3, B: B3, C: C3, D: D3, P: P3, M: M3 }).map(([k, v]) => [k, project(v)]));
  const [Ax, Ay] = points.A; const [Bx, By] = points.B; const [Cx, Cy] = points.C;
  const [Dx, Dy] = points.D; const [Px, Py] = points.P; const [Mx, My] = points.M;
  let body = "";
  body += line(Ax, Ay, Cx, Cy, 'class="hidden"');
  body += line(Bx, By, Dx, Dy, 'class="hidden"');
  body += polygon([[Px, Py], [Cx, Cy], [Dx, Dy]], 'fill="#fff7df" stroke="#bd8b27" stroke-width="2.4"');
  body += line(Ax, Ay, Bx, By, 'class="edge"');
  body += line(Ax, Ay, Dx, Dy, 'class="edge"');
  body += line(Bx, By, Cx, Cy, 'class="edge"');
  body += line(Cx, Cy, Dx, Dy, 'class="edge"');
  body += line(Px, Py, Mx, My, 'class="construction"');
  body += polyline([[Mx - 14, My], [Mx - 14, My + 14], [Mx, My + 14]], 'stroke="#bd8b27" stroke-width="1.6"');
  for (const [name, [x, y]] of Object.entries(points)) body += circle(x, y, name === "P" || name === "M" ? 5 : 4.5, name === "P" || name === "M" ? 'class="point-accent"' : 'class="point"');
  const labels = { A: [-25, 22], B: [12, 23], C: [12, 22], D: [8, -13], P: [-3, -17], M: [13, 20] };
  for (const [name, [x, y]] of Object.entries(points)) body += mathText(x + labels[name][0], y + labels[name][1], [mi(name)]);
  body += rect(506, 52, 158, 48, 'rx="8" class="label-bg"');
  body += mathText(585, 82, [jp("各辺の長さ"), rm(" 1")], 'text-anchor="middle"', true);
  add(
    "ans-q7-tetrahedron",
    700,
    500,
    "1辺1の正四面体ABCDで、辺AB上の点P、辺CDの中点M、三角形CPDと高さPMを示す立体図。PMはCDに垂直である。",
    "PC=PD より、CD の中点 M へ下ろした PM が三角形 CPD の高さになる。",
    body,
  );
}

// ---------------------------------------------------------------------------
// Problem 7 alternative: alternate vertices of a cube of side 1/sqrt(2)
// form a unit regular tetrahedron. All selected-vertex distances are 1.
// ---------------------------------------------------------------------------
{
  const cube = {
    v000: [0, 0, 0], v100: [1, 0, 0], v010: [0, 1, 0], v110: [1, 1, 0],
    v001: [0, 0, 1], v101: [1, 0, 1], v011: [0, 1, 1], v111: [1, 1, 1],
  };
  const selected = { A: cube.v000, B: cube.v110, C: cube.v101, D: cube.v011 };
  const lerp3 = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const P3 = lerp3(selected.A, selected.B, 0.5);
  const M3 = lerp3(selected.C, selected.D, 0.5);
  const project = ([x, y, z]) => [210 + 280 * x + 118 * y, 356 - 62 * y - 238 * z];
  const p = (v) => project(v);
  const cubeEdges = [
    ["v000", "v100"], ["v000", "v010"], ["v100", "v110"], ["v010", "v110"],
    ["v001", "v101"], ["v001", "v011"], ["v101", "v111"], ["v011", "v111"],
    ["v000", "v001"], ["v100", "v101"], ["v010", "v011"], ["v110", "v111"],
  ];
  let body = "";
  for (const [a, b] of cubeEdges) body += line(...p(cube[a]), ...p(cube[b]), a === "v010" || a === "v011" ? 'class="hidden"' : 'stroke="#9aa9b6" stroke-width="1.4"');
  const names = Object.keys(selected);
  for (let i = 0; i < names.length; i += 1) {
    for (let j = i + 1; j < names.length; j += 1) {
      const a = names[i]; const b = names[j];
      body += line(...p(selected[a]), ...p(selected[b]), 'class="edge"');
    }
  }
  body += line(...p(P3), ...p(M3), 'class="construction"');
  for (const value of Object.values(selected)) body += circle(...p(value), 5, 'class="point"');
  body += circle(...p(P3), 5.6, 'class="point-accent"');
  body += circle(...p(M3), 5.6, 'class="point-accent"');
  const offsets = { A: [-28, 22], B: [12, -10], C: [-8, -12], D: [-26, -10] };
  for (const [name, value] of Object.entries(selected)) {
    const [x, y] = p(value); body += mathText(x + offsets[name][0], y + offsets[name][1], [mi(name)]);
  }
  { const [x, y] = p(P3); body += mathText(x + 10, y - 12, [mi("P")]); }
  { const [x, y] = p(M3); body += mathText(x - 7, y - 16, [mi("M")]); }
  body += rect(420, 384, 238, 54, 'rx="9" class="label-bg"');
  body += mathText(539, 417, [jp("立方体の1辺"), rm(" = 1/√2")], 'text-anchor="middle"', true);
  add(
    "ans-q7-cube-model",
    700,
    470,
    "1辺1/√2の立方体の互い違いの4頂点A、B、C、Dを結んで、1辺1の正四面体を構成した補助図。ABとCDの中点P、Mも示す。",
    "立方体の互い違いの4頂点を結ぶと、各辺が面対角線となる正四面体ができる。",
    body,
  );
}

// ---------------------------------------------------------------------------
// Problem 11: A(8,0,0), B(0,4,0), C(0,0,2). The foot from O to
// x/8+y/4+z/2=1 is H=(8/21,16/21,32/21).
// ---------------------------------------------------------------------------
{
  const A = [8, 0, 0]; const B = [0, 4, 0]; const C = [0, 0, 2]; const O = [0, 0, 0];
  const H = [8 / 21, 16 / 21, 32 / 21];
  const project = ([x, y, z]) => [330 + 42 * x - 50 * y, 385 + 13 * x + 17 * y - 103 * z];
  const pts = Object.fromEntries(Object.entries({ A, B, C, O, H }).map(([k, v]) => [k, project(v)]));
  const [Ax, Ay] = pts.A; const [Bx, By] = pts.B; const [Cx, Cy] = pts.C;
  const [Ox, Oy] = pts.O; const [Hx, Hy] = pts.H;
  let body = "";
  body += polygon([[Ax, Ay], [Bx, By], [Cx, Cy]], 'class="plane"');
  body += line(Ax, Ay, Bx, By, 'class="edge"');
  body += line(Bx, By, Cx, Cy, 'class="edge"');
  body += line(Cx, Cy, Ax, Ay, 'class="edge"');
  body += line(Ox, Oy, Hx, Hy, 'class="construction" stroke-dasharray="5 5" marker-end="url(#arrow-gold)"');
  body += polyline([[Hx + 13, Hy + 3], [Hx + 15, Hy + 16], [Hx + 2, Hy + 18]], 'stroke="#bd8b27" stroke-width="1.6"');
  for (const [name, [x, y]] of Object.entries(pts)) body += circle(x, y, name === "H" ? 5.5 : 4.6, name === "H" ? 'class="point-accent"' : 'class="point"');
  const offsets = { A: [-12, -13], B: [-25, 20], C: [8, -12], O: [10, 22], H: [12, -10] };
  for (const [name, [x, y]] of Object.entries(pts)) body += mathText(x + offsets[name][0], y + offsets[name][1], [mi(name)]);
  body += mathText(345, (Oy + Hy) / 2 + 5, [mi("OH"), rm(" ⟂ "), jp("平面"), mi("ABC")], "", true);
  body += rect(504, 58, 168, 76, 'rx="9" class="label-bg"');
  body += mathText(588, 88, [mi("A"), rm("(8,0,0)")], 'text-anchor="middle"', true);
  body += mathText(588, 111, [mi("B"), rm("(0,4,0), "), mi("C"), rm("(0,0,2)")], 'text-anchor="middle"', true);
  add(
    "ans-q11-space-projection",
    720,
    510,
    "座標空間の3点A(8,0,0)、B(0,4,0)、C(0,0,2)がつくる平面と、原点Oからその平面へ下ろした垂線OHおよび垂足Hを示す。",
    "OP が最短になる点 H では、OH は平面 ABC に垂直になる。",
    body,
  );
}

// ---------------------------------------------------------------------------
// Problem 12: at the smallest admissible integer k=4,
// g(t)=t^2-12t+5 has two distinct positive roots.
// ---------------------------------------------------------------------------
{
  const k = 4;
  const fn = (t) => t * t - 2 * (k + 2) * t + k * k - 2 * k - 3;
  const root1 = 6 - Math.sqrt(31); const root2 = 6 + Math.sqrt(31);
  const plot = { left: 90, right: 650, top: 48, bottom: 390, xMin: -1.2, xMax: 13.2, yMin: -35, yMax: 14 };
  const px = (x) => plot.left + (x - plot.xMin) * (plot.right - plot.left) / (plot.xMax - plot.xMin);
  const py = (y) => plot.bottom - (y - plot.yMin) * (plot.bottom - plot.top) / (plot.yMax - plot.yMin);
  const points = Array.from({ length: 241 }, (_, i) => {
    const t = plot.xMin + (plot.xMax - plot.xMin) * i / 240;
    return [px(t), py(fn(t))];
  });
  let body = "";
  body += line(plot.left, py(0), plot.right + 17, py(0), 'class="axis" marker-end="url(#arrow)"');
  body += line(px(0), plot.bottom, px(0), plot.top - 18, 'class="axis" marker-end="url(#arrow)"');
  body += `<path d="${pathFromPoints(points)}" class="curve"/>`;
  body += line(px(6), py(0), px(6), py(-31), 'class="guide"');
  body += circle(px(root1), py(0), 4.7, 'class="point-accent"');
  body += circle(px(root2), py(0), 4.7, 'class="point-accent"');
  body += circle(px(0), py(fn(0)), 4.7, 'class="point"');
  body += mathText(plot.right + 22, py(0) + 7, [mi("t")]);
  body += mathText(px(0) + 10, plot.top - 16, [mi("g"), rm("("), mi("t"), rm(")")]);
  body += mathText(px(root1), py(0) + 28, [mi("t"), rm("₁")], 'text-anchor="middle"', true);
  body += mathText(px(root2), py(0) + 28, [mi("t"), rm("₂")], 'text-anchor="middle"', true);
  body += mathText(px(6), py(-31) + 29, [mi("t"), rm("="), mi("k"), rm("+2")], 'text-anchor="middle"', true);
  body += mathText(px(0) + 12, py(fn(0)) - 10, [mi("g"), rm("(0)>0")], "", true);
  body += rect(450, 50, 206, 72, 'rx="9" class="label-bg"');
  body += mathText(553, 80, [rm("0<"), mi("t"), rm("₁<"), mi("t"), rm("₂")], 'text-anchor="middle"');
  body += plainText(553, 105, "異なる2つの正の解", 'text-anchor="middle" font-size="15"');
  add(
    "ans-q12-parabola-condition",
    720,
    440,
    "t=xの2乗とおいた二次関数g(t)のグラフ。g(0)>0、軸t=k+2が正、判別式が正のとき、t軸の正の範囲で異なる2点t1、t2と交わることを示す。",
    "異なる4実根は、t=x² の方程式が異なる2つの正の解をもつ条件へ読み替える。",
    body,
  );
}

// ---------------------------------------------------------------------------
// Problems 14-16: for beta=3, l:y=(x+2)/sqrt(3) touches C1 and C2.
// Q=(-1/2,sqrt(3)/2), R=(7/4,5sqrt(3)/4).
// ---------------------------------------------------------------------------
{
  const sqrt3 = Math.sqrt(3);
  const world = { P: [-2, 0], O: [0, 0], A: [3, 0], Q: [-0.5, sqrt3 / 2], R: [7 / 4, 5 * sqrt3 / 4] };
  const px = (x) => 225 + 72 * x;
  const py = (y) => 270 - 72 * y;
  const pt = (name) => [px(world[name][0]), py(world[name][1])];
  const [Px, Py] = pt("P"); const [Ox, Oy] = pt("O"); const [Ax, Ay] = pt("A");
  const [Qx, Qy] = pt("Q"); const [Rx, Ry] = pt("R");
  const arc = (cx, cy, radius, from, to) => {
    const p = (deg) => [cx + radius * Math.cos(deg * Math.PI / 180), cy + radius * Math.sin(deg * Math.PI / 180)];
    const a = p(from); const b = p(to);
    return `M${fixed(a[0])},${fixed(a[1])} A${fixed(radius)},${fixed(radius)} 0 0 0 ${fixed(b[0])},${fixed(b[1])}`;
  };
  const unit = ([x, y]) => {
    const length = Math.hypot(x, y);
    return [x / length, y / length];
  };
  const rightAngle = (touch, center, pointOnTangent, size = 12) => {
    const radiusDirection = unit([center[0] - touch[0], center[1] - touch[1]]);
    const tangentDirection = unit([pointOnTangent[0] - touch[0], pointOnTangent[1] - touch[1]]);
    return [
      [touch[0] + size * radiusDirection[0], touch[1] + size * radiusDirection[1]],
      [touch[0] + size * (radiusDirection[0] + tangentDirection[0]), touch[1] + size * (radiusDirection[1] + tangentDirection[1])],
      [touch[0] + size * tangentDirection[0], touch[1] + size * tangentDirection[1]],
    ];
  };
  let body = "";
  body += line(48, Py, 688, Py, 'class="axis" marker-end="url(#arrow)"');
  body += circle(Ox, Oy, 72, 'stroke="#173f69" stroke-width="2.2" fill="#f6f9fb"');
  body += circle(Ax, Ay, 180, 'stroke="#173f69" stroke-width="2.2" fill="#f6f9fb"');
  body += line(Px - 22, Py + 13, px(3.75), py((3.75 + 2) / sqrt3), 'class="construction"');
  body += line(Ox, Oy, Qx, Qy, 'class="edge"');
  body += line(Ax, Ay, Rx, Ry, 'class="edge"');
  body += polyline(rightAngle([Qx, Qy], [Ox, Oy], [Px, Py]), 'stroke="#bd8b27" stroke-width="1.5"');
  body += polyline(rightAngle([Rx, Ry], [Ax, Ay], [Px, Py]), 'stroke="#bd8b27" stroke-width="1.5"');
  body += `<path d="${arc(Px, Py, 35, 0, -30)}" stroke="#bd8b27" stroke-width="1.8"/>`;
  for (const [name, [x, y]] of Object.entries(Object.fromEntries(Object.keys(world).map((name) => [name, pt(name)])))) body += circle(x, y, name === "Q" || name === "R" ? 5.2 : 4.5, name === "Q" || name === "R" ? 'class="point-accent"' : 'class="point"');
  const offsets = { P: [-8, 27], O: [-5, 28], A: [-4, 29], Q: [-27, -9], R: [10, -9] };
  for (const [name, [x, y]] of Object.entries(Object.fromEntries(Object.keys(world).map((name) => [name, pt(name)])))) body += mathText(x + offsets[name][0], y + offsets[name][1], [mi(name)]);
  body += mathText(Px + 47, Py - 12, [rm("30°")], "", true);
  body += mathText((Ox + Qx) / 2 - 23, (Oy + Qy) / 2 - 4, [rm("1")], "", true);
  body += mathText((Ax + Rx) / 2 + 14, (Ay + Ry) / 2 + 1, [rm("5/2")], "", true);
  body += mathText(px(3.55), py((3.55 + 2) / sqrt3) - 12, [mi("l")]);
  body += mathText(699, Py + 8, [mi("x")]);
  body += rect(477, 372, 204, 61, 'rx="9" class="label-bg"');
  body += mathText(579, 399, [mi("OQ"), rm("⊥"), mi("l"), rm(",  "), mi("AR"), rm("⊥"), mi("l")], 'text-anchor="middle"', true);
  body += mathText(579, 421, [mi("PO"), rm("=2,  "), mi("PA"), rm("=5")], 'text-anchor="middle"', true);
  add(
    "ans-q14-16-common-tangent",
    740,
    470,
    "中心Oで半径1の円C1と、中心Aで半径5/2の円C2、傾き√3/3の共通接線l、接点Q・R、x軸との交点Pを示す。OQとARは接線lに垂直。",
    "共通接線 l と半径 OQ・AR がつくる、相似な30度の直角三角形。",
    body,
  );
}

// ---------------------------------------------------------------------------
// Problems 21-25: f(x)=(x-3)^2(x+2)(x+8). Critical points are
// alpha=-3-sqrt(34)/2, beta=-3+sqrt(34)/2 and x=3.
// ---------------------------------------------------------------------------
{
  const fn = (x) => (x - 3) ** 2 * (x + 2) * (x + 8);
  const alpha = -3 - Math.sqrt(34) / 2;
  const beta = -3 + Math.sqrt(34) / 2;
  const plot = { left: 76, right: 688, top: 42, bottom: 435, xMin: -8.5, xMax: 5.1, yMin: -720, yMax: 440 };
  const px = (x) => plot.left + (x - plot.xMin) * (plot.right - plot.left) / (plot.xMax - plot.xMin);
  const py = (y) => plot.bottom - (y - plot.yMin) * (plot.bottom - plot.top) / (plot.yMax - plot.yMin);
  const points = Array.from({ length: 360 }, (_, i) => {
    const x = plot.xMin + (plot.xMax - plot.xMin) * i / 359;
    const y = Math.max(plot.yMin, Math.min(plot.yMax, fn(x)));
    return [px(x), py(y)];
  });
  const regionPoints = [[px(-2), py(0)], ...Array.from({ length: 151 }, (_, i) => {
    const x = -2 + 5 * i / 150;
    return [px(x), py(fn(x))];
  }), [px(3), py(0)]];
  let body = "";
  body += polygon(regionPoints, 'class="region"');
  body += line(plot.left, py(0), plot.right + 17, py(0), 'class="axis" marker-end="url(#arrow)"');
  body += line(px(0), plot.bottom, px(0), plot.top - 17, 'class="axis" marker-end="url(#arrow)"');
  body += `<path d="${pathFromPoints(points)}" class="curve"/>`;
  body += line(px(alpha), py(0), px(alpha), py(fn(alpha)), 'class="guide"');
  body += line(px(beta), py(0), px(beta), py(fn(beta)), 'class="guide"');
  body += circle(px(alpha), py(fn(alpha)), 5, 'class="point-accent"');
  body += circle(px(beta), py(fn(beta)), 5, 'class="point-accent"');
  for (const root of [-8, -2, 3]) body += circle(px(root), py(0), 4.6, 'class="point"');
  body += mathText(plot.right + 22, py(0) + 7, [mi("x")]);
  body += mathText(px(0) + 9, plot.top - 15, [mi("y")]);
  body += mathText(px(-8), py(0) + 28, [rm("−8")], 'text-anchor="middle"', true);
  body += mathText(px(-2), py(0) - 13, [rm("−2")], 'text-anchor="middle"', true);
  body += mathText(px(3), py(0) + 29, [rm("3")], 'text-anchor="middle"', true);
  body += mathText(px(alpha), py(0) - 13, [mi("α")], 'text-anchor="middle"', true);
  body += mathText(px(beta) - 10, py(0) + 28, [mi("β")], 'text-anchor="end"', true);
  body += mathText(px(alpha) - 11, py(fn(alpha)) + 7, [rm("("), mi("α"), rm(","), mi("m"), rm(")")], 'text-anchor="end"', true);
  body += mathText(px(beta) + 12, py(fn(beta)) - 12, [rm("("), mi("β"), rm(","), mi("M"), rm(")")], "", true);
  body += mathText(535, 79, [mi("y"), rm("="), mi("f"), rm("("), mi("x"), rm(")")]);
  body += rect(490, 366, 190, 50, 'rx="9" class="label-bg"');
  body += plainText(585, 397, "着色部が面積 S", 'text-anchor="middle" font-size="15"');
  add(
    "ans-q21-25-quartic-graph",
    740,
    490,
    "四次関数y=f(x)=(x-3)の2乗(x+2)(x+8)のグラフ。零点-8、-2、重解3、極小点(α,m)、極大点(β,M)と、-2から3までの非負部分の面積Sを示す。",
    "零点・極値・重解の位置と、曲線の非負部分にある有限領域 S。",
    body,
  );
}

const manifest = {
  schemaVersion: "lexus-past-exam-figures.v1",
  packageId,
  contentProvenance: "original_editorial",
  restrictedSourceCopied: false,
  review: {
    needsHumanReview: true,
    notes: "公開問題の数式・座標・幾何条件から計算して描いた独自SVG。制限付き参照画像のトレース・埋め込み・複製は行っていない。",
  },
  items: figures,
};
fs.mkdirSync(new URL("../src/data/pastExamFigures/", import.meta.url), { recursive: true });
fs.writeFileSync(new URL(`../src/data/pastExamFigures/${packageId}.json`, import.meta.url), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Built ${figures.length} original mathematics diagrams for ${packageId}`);
