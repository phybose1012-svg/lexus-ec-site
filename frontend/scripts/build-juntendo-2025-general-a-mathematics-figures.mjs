// Original diagrams for 順天堂大学 2025 一般選抜A方式 数学.
// Every coordinate is computed from the published conditions of 大問Ⅰ（2）:
//   |OA| = 9, |OB| = 3, |OC| = 6, ∠AOB = ∠BOC = ∠AOC = 60°,
//   P on OA, Q on BC, R divides PQ in 2:1, D divides OB in 2:1.
// The restricted reference crop is not traced, embedded, or copied.
import fs from "node:fs";

const packageId = "juntendo-2025-general-a-mathematics";
const output = new URL(`../public/assets/past-exams/${packageId}/figures/`, import.meta.url);
const figures = [];
const esc = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");
const fontData = (name) => fs
  .readFileSync(new URL(`../public/assets/vendor/katex/fonts/${name}.woff2`, import.meta.url))
  .toString("base64");

// SVGs displayed through <img> do not reliably inherit the page fonts. Embed
// the same KaTeX faces used by the surrounding explanations and print output.
const katexFonts = `@font-face{font-family:'KaTeX_Main';font-style:normal;font-weight:400;src:url(data:font/woff2;base64,${fontData("KaTeX_Main-Regular")}) format('woff2')}@font-face{font-family:'KaTeX_Math';font-style:italic;font-weight:400;src:url(data:font/woff2;base64,${fontData("KaTeX_Math-Italic")}) format('woff2')}`;

const line = (x1, y1, x2, y2, extra = "") =>
  `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" ${extra}/>`;
const circle = (x, y, r, extra = "") => `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r}" ${extra}/>`;
const span = (value, klass) => `<tspan class="${klass}">${esc(value)}</tspan>`;
const mi = (value) => span(value, "mi");
const rm = (value) => span(value, "rm");
const jp = (value) => span(value, "jp");
const mathText = (x, y, parts, extra = "", small = false) =>
  `<text x="${x.toFixed(2)}" y="${y.toFixed(2)}" class="math${small ? " small" : ""}" ${extra}>${parts.join("")}</text>`;
const polygon = (points, extra = "") =>
  `<polygon points="${points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ")}" ${extra}/>`;

// KaTeX Main's U+221A carries no vinculum, so the overbar is drawn as a path.
// Returns the radical mark plus its radicand, and reports the advance width.
const radicalWidth = (radicand, size) => size * 0.42 + radicand.length * size * 0.5 + 6;
const mathRadical = (x, y, radicand, size = 21) => {
  const hook = size * 0.42;
  const top = y - size * 0.82;
  const barEnd = x + hook + radicand.length * size * 0.5 + 3;
  const d = `M${x.toFixed(2)},${(y - size * 0.34).toFixed(2)} L${(x + size * 0.17).toFixed(2)},${(y - size * 0.16).toFixed(2)} L${(x + hook - 2).toFixed(2)},${top.toFixed(2)} L${barEnd.toFixed(2)},${top.toFixed(2)}`;
  return `<path d="${d}" stroke="#18334c" stroke-width="1.4" fill="none" stroke-linejoin="miter" stroke-linecap="round"/>`
    + `<text x="${(x + hook).toFixed(2)}" y="${y.toFixed(2)}" class="math"${size !== 21 ? ` style="font-size:${size}px"` : ""}>${rm(radicand)}</text>`;
};

function add(id, width, height, alt, caption, body, extraDefs = "") {
  figures.push({ id, width, height, alt, caption, src: `/assets/past-exams/${packageId}/figures/${id}.svg` });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title"><title id="title">${esc(alt)}</title><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#bd8b27"/></marker>${extraDefs}</defs><style>${katexFonts}text{font-family:'Yu Gothic','Meiryo',sans-serif;font-size:19px;fill:#18334c;stroke:none}.math{font-family:'KaTeX_Main','Times New Roman',serif;font-size:21px}.math .mi{font-family:'KaTeX_Math','Times New Roman',serif;font-style:italic}.math .rm{font-family:'KaTeX_Main','Times New Roman',serif;font-style:normal}.math .jp{font-family:'Yu Gothic','Meiryo',sans-serif;font-style:normal}.small{font-size:16px}line,path,circle,ellipse,rect,polygon{vector-effect:non-scaling-stroke}.hidden-edge{stroke-dasharray:7 6}.chord{stroke:#173f69;stroke-width:2.2}.gold{stroke:#bd8b27;stroke-width:2.6}.halo{stroke:white;stroke-width:8;stroke-linecap:butt}.region{fill:#fff4d6;stroke:#bd8b27;stroke-width:2}.point{fill:white;stroke:#173f69;stroke-width:2.2}.point-accent{fill:#bd8b27;stroke:white;stroke-width:1.6}</style><rect width="100%" height="100%" fill="white"/><g stroke="#18334c" stroke-width="1.9" fill="none" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
  fs.writeFileSync(new URL(`${id}.svg`, output), svg);
}

fs.mkdirSync(output, { recursive: true });

// ---------------------------------------------------------------------------
// 3D reconstruction from the published conditions.
// O at the origin; A placed in the xy-plane; B fixed by ∠AOB = 60°;
// C fixed by ∠AOC = ∠BOC = 60° together with |OC| = 6.
// The whole frame is then rotated about z by +30° so that the oblique view
// leaves only edge AB hidden — every edge carrying a marked point stays solid.
// ---------------------------------------------------------------------------
const lenOA = 9;
const lenOB = 3;
const lenOC = 6;
const cos60 = Math.cos(Math.PI / 3);
const spin = Math.PI / 6; // +30° about z

const rotate = ([x, y, z]) => [
  x * Math.cos(spin) - y * Math.sin(spin),
  x * Math.sin(spin) + y * Math.cos(spin),
  z,
];

const rawA = [lenOA, 0, 0];
const rawB = [lenOB * cos60, lenOB * Math.sin(Math.PI / 3), 0];
// |OC| = 6 with OA·OC = 27 and OB·OC = 9 determines C uniquely (z > 0).
const cX = (lenOA * lenOC * cos60) / lenOA;
const cY = (lenOB * lenOC * cos60 - rawB[0] * cX) / rawB[1];
const rawC = [cX, cY, Math.sqrt(lenOC ** 2 - cX ** 2 - cY ** 2)];

const O = [0, 0, 0];
const A = rotate(rawA);
const B = rotate(rawB);
const C = rotate(rawC);

const dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
const norm = (u) => Math.sqrt(dot(u, u));
const lerp = (u, v, t) => u.map((value, index) => value + (v[index] - value) * t);
const scale3 = (u, k) => u.map((value) => value * k);
const addVec = (u, v) => u.map((value, index) => value + v[index]);
const subVec = (u, v) => u.map((value, index) => value - v[index]);

// The illustrated instant: a representative (s, t) inside the parameter square.
const sSample = 0.55;
const tSample = 0.45;
const P = scale3(A, sSample);
const Q = addVec(scale3(B, 1 - tSample), scale3(C, tSample));
const R = lerp(P, Q, 2 / 3); // PR : RQ = 2 : 1
const D = scale3(B, 2 / 3); // OD : DB = 2 : 1

// k and l from the published decomposition DR = s k + t l.
const kVec = scale3(A, 1 / 3);
const lVec = scale3(subVec(C, B), 2 / 3);

// Oblique projection: depth (+y) leaves up-left, so face ABC is the only hidden face.
const depthX = -0.42;
const depthY = 0.35;
const projectMath = ([x, y, z]) => [x + depthX * y, z + depthY * y];

// ---------------------------------------------------------------------------
// Figure 1: the tetrahedron with P, Q, R and D.
// ---------------------------------------------------------------------------
const scale1 = 74;
const originX1 = 183;
const originY1 = 508;
const to1 = (p) => {
  const [mx, my] = projectMath(p);
  return [originX1 + scale1 * mx, originY1 - scale1 * my];
};

const [Ox, Oy] = to1(O);
const [Ax, Ay] = to1(A);
const [Bx, By] = to1(B);
const [Cx, Cy] = to1(C);
const [Px, Py] = to1(P);
const [Qx, Qy] = to1(Q);
const [Rx, Ry] = to1(R);
const [Dx, Dy] = to1(D);

const solidEdge = (x1, y1, x2, y2) => line(x1, y1, x2, y2);
let body1 = "";

// Interior construction first, so the front edge OC can break it with a halo.
// The arrow stops short of R so its head does not cover the marked point.
const drLength = Math.hypot(Rx - Dx, Ry - Dy);
const drStop = (drLength - 11) / drLength;
body1 += line(Px, Py, Qx, Qy, 'class="chord"');
body1 += line(Dx, Dy, Dx + (Rx - Dx) * drStop, Dy + (Ry - Dy) * drStop, 'class="gold" marker-end="url(#arrow)"');

// Tetrahedron edges. Only AB is hidden from this viewpoint.
body1 += line(Ax, Ay, Bx, By, 'class="hidden-edge" stroke="#7d90a4" stroke-width="1.7"');
body1 += line(Ox, Oy, Cx, Cy, 'class="halo"');
body1 += solidEdge(Ox, Oy, Ax, Ay);
body1 += solidEdge(Ox, Oy, Bx, By);
body1 += solidEdge(Ox, Oy, Cx, Cy);
body1 += solidEdge(Ax, Ay, Cx, Cy);
body1 += solidEdge(Bx, By, Cx, Cy);

// Marked points.
for (const [x, y] of [[Ox, Oy], [Ax, Ay], [Bx, By], [Cx, Cy]]) body1 += circle(x, y, 4.6, 'class="point"');
for (const [x, y] of [[Px, Py], [Qx, Qy], [Dx, Dy]]) body1 += circle(x, y, 5, 'class="point"');
body1 += circle(Rx, Ry, 5.6, 'class="point-accent"');

// Vertex and point labels. Each sits in space that no edge, chord or arrow
// crosses; R uses the open wedge above PQ rather than the crowded side.
body1 += mathText(Ox - 28, Oy + 24, [mi("O")]);
body1 += mathText(Ax + 14, Ay + 8, [mi("A")]);
body1 += mathText(Bx - 30, By + 2, [mi("B")]);
body1 += mathText(Cx - 6, Cy - 16, [mi("C")]);
body1 += mathText(Px + 12, Py + 26, [mi("P")]);
body1 += mathText(Qx - 32, Qy - 4, [mi("Q")]);
body1 += mathText(Rx + 11, Ry - 16, [mi("R")]);
body1 += mathText(Dx - 34, Dy + 22, [mi("D")]);

// Edge lengths, offset clear of the segments they measure. The 2:1 division
// ratios stay in the caption so the drawing keeps its breathing room.
body1 += mathText(Ox + 0.3 * (Ax - Ox), Oy + 0.3 * (Ay - Oy) + 26, [rm("9")], "", true);
body1 += mathText(Ox + 0.45 * (Bx - Ox) + 10, Oy + 0.45 * (By - Oy) - 11, [rm("3")], "", true);
body1 += mathText(Ox + 0.74 * (Cx - Ox) + 14, Oy + 0.74 * (Cy - Oy) + 4, [rm("6")], "", true);

add(
  "ans-q1-geometry",
  700,
  566,
  "四面体OABCで、点Pが辺OA上、点Qが辺BC上を動き、線分PQを2:1に内分する点Rと、辺OBを2:1に内分する点Dを結んだベクトルDRを示す図。辺の長さはOA=9、OB=3、OC=6。",
  "PQを2:1に内分する点Rと、OBを2:1に内分する点D。P・Qの一例を描いた模式図で、破線の辺ABは奥に隠れる辺。",
  body1,
);

// ---------------------------------------------------------------------------
// Figure 2: the parallelogram that R sweeps out on plane H.
// D + s k + t l with 0 ≤ s ≤ 1 and 0 ≤ t ≤ 1.
// Drawn in the true plane of k and l, so the shown angle is the real angle.
// ---------------------------------------------------------------------------
const kLen = norm(kVec);
const lLen = norm(lVec);
const cosKL = dot(kVec, lVec) / (kLen * lLen);
const sinKL = Math.sqrt(1 - cosKL ** 2);
const trueArea = kLen * lLen * sinKL;

const scale2 = 58;
const baseX = 150;
const baseY = 300;
// In-plane orthonormal frame: k along +x, l at its true angle to k.
const kPoint = [baseX + scale2 * kLen, baseY];
const lPoint = [baseX + scale2 * lLen * cosKL, baseY - scale2 * lLen * sinKL];
const farPoint = [kPoint[0] + (lPoint[0] - baseX), kPoint[1] + (lPoint[1] - baseY)];
const sampleR = [
  baseX + scale2 * (sSample * kLen + tSample * lLen * cosKL),
  baseY - scale2 * (tSample * lLen * sinKL),
];

let body2 = "";
body2 += polygon([[baseX, baseY], kPoint, farPoint, lPoint], 'class="region"');
body2 += line(baseX, baseY, kPoint[0], kPoint[1], 'class="gold" marker-end="url(#arrow)"');
body2 += line(baseX, baseY, lPoint[0], lPoint[1], 'class="gold" marker-end="url(#arrow)"');
// Guides showing the sample point's coordinates in the (k, l) frame.
body2 += line(sampleR[0], sampleR[1], baseX + scale2 * sSample * kLen, baseY, 'stroke="#aab7c3" stroke-width="1.3" stroke-dasharray="4 5"');
body2 += line(sampleR[0], sampleR[1], baseX + scale2 * tSample * lLen * cosKL, baseY - scale2 * tSample * lLen * sinKL, 'stroke="#aab7c3" stroke-width="1.3" stroke-dasharray="4 5"');
body2 += circle(baseX, baseY, 5, 'class="point"');
body2 += circle(sampleR[0], sampleR[1], 5.6, 'class="point-accent"');

body2 += mathText(baseX - 30, baseY + 22, [mi("D")]);
body2 += mathText(kPoint[0] + 12, kPoint[1] + 24, [mi("k")]);
body2 += mathText(lPoint[0] - 26, lPoint[1] - 8, [mi("l")]);
body2 += mathText(sampleR[0] + 14, sampleR[1] - 10, [mi("R")]);

// Area caption, laid out piece by piece so the drawn radical lines up.
const areaX = baseX + 85;
const areaY = baseY - 135;
body2 += mathText(areaX, areaY, [jp("面積"), rm(" = "), rm("3")]);
body2 += mathRadical(areaX + 70, areaY, "11");

add(
  "ans-q1-region",
  470,
  370,
  "点Dを基準に、ベクトルkとlが張る平行四辺形。sとtが0以上1以下を動くとき点Rはこの平行四辺形全体を覆い、面積は3√11になる。",
  "Rが動く範囲：kとlが張る平行四辺形（面積 3√11）",
  body2,
);

const manifest = {
  schemaVersion: "lexus-past-exam-figures.v1",
  packageId,
  contentProvenance: "original_editorial",
  restrictedSourceCopied: false,
  review: {
    needsHumanReview: true,
    notes: "公開問題の辺の長さ・なす角・内分比から3次元座標と斜投影を計算した独自SVG。制限付き参照画像のトレースや埋め込みは行っていない。",
  },
  items: figures,
};
fs.mkdirSync(new URL("../src/data/pastExamFigures/", import.meta.url), { recursive: true });
fs.writeFileSync(new URL(`../src/data/pastExamFigures/${packageId}.json`, import.meta.url), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Built ${figures.length} original mathematics diagrams (area check: ${trueArea.toFixed(6)})`);
