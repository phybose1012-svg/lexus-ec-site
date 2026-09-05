// Original vector diagrams derived from the published mathematical conditions.
// The restricted reference crops are not traced, embedded, or copied.
import fs from "node:fs";

const packageId = "iwate-medical-2025-general-mathematics";
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
const line = (x1, y1, x2, y2, extra = "") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}/>`;
const text = (x, y, value, extra = "") => `<text x="${x}" y="${y}" ${extra}>${esc(value)}</text>`;
const span = (value, klass) => `<tspan class="${klass}">${esc(value)}</tspan>`;
const mi = (value) => span(value, "mi");
const rm = (value) => span(value, "rm");
const jp = (value) => span(value, "jp");
const mathText = (x, y, parts, extra = "", small = false) => `<text x="${x}" y="${y}" class="math${small ? " small" : ""}" ${extra}>${parts.join("")}</text>`;
const circle = (x, y, r, extra = "") => `<circle cx="${x}" cy="${y}" r="${r}" ${extra}/>`;
const rect = (x, y, width, height, extra = "") => `<rect x="${x}" y="${y}" width="${width}" height="${height}" ${extra}/>`;
const pathFromPoints = (points) => points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

function add(id, width, height, alt, caption, body, extraDefs = "") {
  figures.push({ id, width, height, alt, caption, src: `/assets/past-exams/${packageId}/figures/${id}.svg` });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title"><title id="title">${esc(alt)}</title><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#18334c"/></marker>${extraDefs}</defs><style>${katexFonts}text{font-family:'Yu Gothic','Meiryo',sans-serif;font-size:19px;fill:#18334c;stroke:none}.math{font-family:'KaTeX_Main','Times New Roman',serif;font-size:21px}.math .mi{font-family:'KaTeX_Math','Times New Roman',serif;font-style:italic}.math .rm{font-family:'KaTeX_Main','Times New Roman',serif;font-style:normal}.math .jp{font-family:'Yu Gothic','Meiryo',sans-serif;font-style:normal}.small{font-size:16px}line,path,circle,ellipse,rect{vector-effect:non-scaling-stroke}.dash{stroke-dasharray:6 6}.guide{stroke:#aab7c3;stroke-width:1.2;stroke-dasharray:4 5}.gold{stroke:#bd8b27}.gold-fill{fill:#fff4d6}.function-curve{stroke:#173f69;stroke-width:2.6}.point{fill:white;stroke:#173f69;stroke-width:2}.label-bg{fill:white;stroke:#dbe3ea;stroke-width:1}</style><rect width="100%" height="100%" fill="white"/><g stroke="#18334c" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
  fs.writeFileSync(new URL(`${id}.svg`, output), svg);
}

fs.mkdirSync(output, { recursive: true });

// Q1: f(x)=x^3/(2x^2-1), drawn numerically from the formula.
const graph = { left: 60, right: 700, top: 38, bottom: 440, xMin: -4, xMax: 4, yMin: -4, yMax: 4 };
const gx = (x) => graph.left + (x - graph.xMin) * (graph.right - graph.left) / (graph.xMax - graph.xMin);
const gy = (y) => graph.bottom - (y - graph.yMin) * (graph.bottom - graph.top) / (graph.yMax - graph.yMin);
const f = (x) => x ** 3 / (2 * x ** 2 - 1);
const asymptote = 1 / Math.sqrt(2);
const extremumX = Math.sqrt(6) / 2;
const extremumY = 3 * Math.sqrt(6) / 8;
const sampleBranch = (from, to, count = 220) => Array.from({ length: count + 1 }, (_, index) => {
  const x = from + (to - from) * index / count;
  const y = Math.max(-8, Math.min(8, f(x)));
  return [gx(x), gy(y)];
});
const bisect = (from, to, target) => {
  let lo = from;
  let hi = to;
  let loValue = f(lo) - target;
  for (let index = 0; index < 80; index++) {
    const mid = (lo + hi) / 2;
    const midValue = f(mid) - target;
    if (Math.sign(midValue) === Math.sign(loValue)) {
      lo = mid;
      loValue = midValue;
    } else {
      hi = mid;
    }
  }
  return (lo + hi) / 2;
};
const k = 1.45;
const intersections = [
  bisect(-asymptote + 0.01, -0.001, k),
  bisect(asymptote + 0.01, extremumX, k),
  bisect(extremumX, 4, k),
];
const graphCurves = [
  [-4, -asymptote - 0.012],
  [-asymptote + 0.012, asymptote - 0.012],
  [asymptote + 0.012, 4],
].map(([from, to]) => `<path class="function-curve" data-graph="rational-function" d="${pathFromPoints(sampleBranch(from, to))}"/>`).join("");
const graphBody =
  `<g clip-path="url(#plot-clip)">` +
  line(gx(-asymptote), graph.top, gx(-asymptote), graph.bottom, 'class="guide"') +
  line(gx(asymptote), graph.top, gx(asymptote), graph.bottom, 'class="guide"') +
  line(gx(-4), gy(-2), gx(4), gy(2), 'class="dash" stroke="#6f8799"') +
  line(gx(-extremumX), gy(-extremumY), gx(0), gy(-extremumY), 'class="guide"') +
  line(gx(-extremumX), gy(0), gx(-extremumX), gy(-extremumY), 'class="guide"') +
  line(gx(0), gy(extremumY), gx(extremumX), gy(extremumY), 'class="guide"') +
  line(gx(extremumX), gy(0), gx(extremumX), gy(extremumY), 'class="guide"') +
  graphCurves +
  line(graph.left, gy(k), graph.right, gy(k), 'class="gold" stroke-width="2.4"') +
  intersections.map((x) => circle(gx(x), gy(k), 4.5, 'fill="#bd8b27" stroke="white" stroke-width="1.5"')).join("") +
  `</g>` +
  line(graph.left, gy(0), graph.right + 15, gy(0), 'marker-end="url(#arrow)"') +
  line(gx(0), graph.bottom, gx(0), graph.top - 15, 'marker-end="url(#arrow)"') +
  circle(gx(-extremumX), gy(-extremumY), 4.5, 'class="point"') +
  circle(gx(extremumX), gy(extremumY), 4.5, 'class="point"') +
  mathText(718, gy(0) + 7, [mi("x")]) +
  mathText(gx(0) + 8, 24, [mi("y")]) +
  mathText(614, gy(k) - 10, [mi("y"), rm("="), mi("k")]) +
  mathText(85, 397, [mi("y"), rm("="), mi("f"), rm("("), mi("x"), rm(")")]) +
  mathText(90, 337, [mi("y"), rm("="), mi("x"), rm("/2")], "", true) +
  mathText(gx(-asymptote) - 8, 61, [mi("x"), rm("=−√2/2")], 'text-anchor="end"', true) +
  mathText(gx(asymptote) + 8, 426, [mi("x"), rm("=√2/2")], 'text-anchor="start"', true) +
  text(72, 286, "極大") +
  mathText(72, 308, [rm("(−√6/2, −3√6/8)")], "", true) +
  line(242, 298, gx(-extremumX) - 6, gy(-extremumY) + 2, 'class="guide"') +
  text(520, 204, "極小") +
  mathText(520, 226, [rm("(√6/2, 3√6/8)")], "", true) +
  line(gx(extremumX) + 7, gy(extremumY), 512, 207, 'class="guide"') +
  rect(538, 48, 152, 42, 'rx="8" class="label-bg"') +
  mathText(614, 75, [mi("k"), rm(">3√6/8"), jp(" の例")], 'text-anchor="middle"', true) +
  text(614, 112, "水平線を上下に動かす", 'text-anchor="middle" font-size="15"');
add(
  "q1-function-graph",
  760,
  500,
  "関数y=f(x)=xの3乗を2xの2乗マイナス1で割ったグラフ。縦の漸近線x=プラスマイナスルート2割る2、斜めの漸近線y=x割る2、極大点、極小点と、3つの共有点をもつ水平線y=kを示す。",
  "y=f(x) と、上下に動かす水平線 y=k の共有点",
  graphBody,
  `<clipPath id="plot-clip">${rect(graph.left, graph.top, graph.right - graph.left, graph.bottom - graph.top)}</clipPath>`,
);

// Q2: place B and C on a horizontal chord, then calculate every other point.
const sqrt7 = Math.sqrt(7);
const world = {
  A: [3 / (2 * sqrt7), Math.sqrt(3 / 7)],
  B: [-sqrt7 / 2, 0],
  C: [sqrt7 / 2, 0],
  D: [sqrt7 / 6, 0],
  E: [0, -Math.sqrt(21) / 2],
  O: [0, -Math.sqrt(21) / 6],
};
const incenterRatio = 3 / (3 + sqrt7);
world.I = [
  world.A[0] + incenterRatio * (world.D[0] - world.A[0]),
  world.A[1] + incenterRatio * (world.D[1] - world.A[1]),
];
const px = ([x]) => 360 + 132 * x;
const py = ([, y]) => 140 - 132 * y;
const point = (name) => [px(world[name]), py(world[name])];
const [Ax, Ay] = point("A");
const [Bx, By] = point("B");
const [Cx, Cy] = point("C");
const [Dx, Dy] = point("D");
const [Ex, Ey] = point("E");
const [Ix, Iy] = point("I");
const [Ox, Oy] = point("O");
const circumradius = Math.sqrt(7 / 3) * 132;
const inradius = (Math.sqrt(3) / 2) / ((2 + 1 + sqrt7) / 2) * 132;
const arcPath = (cx, cy, radius, fromDegrees, toDegrees) => {
  const p = (degrees) => [cx + radius * Math.cos(degrees * Math.PI / 180), cy + radius * Math.sin(degrees * Math.PI / 180)];
  const start = p(fromDegrees);
  const end = p(toDegrees);
  return `M${start[0].toFixed(2)},${start[1].toFixed(2)} A${radius},${radius} 0 0 1 ${end[0].toFixed(2)},${end[1].toFixed(2)}`;
};
const geometryBody =
  circle(Ox, Oy, circumradius, 'stroke="#173f69" stroke-width="2.2"') +
  circle(Ix, Iy, inradius, 'class="gold" stroke-width="1.4" stroke-dasharray="5 5"') +
  `<path d="M${Ax},${Ay} L${Bx},${By} L${Cx},${Cy} Z" stroke="#18334c" stroke-width="2.2"/>` +
  line(Ax, Ay, Ex, Ey, 'class="gold" stroke-width="2.2"') +
  line(Ox, Oy, Bx, By, 'class="guide"') +
  line(Ox, Oy, Cx, Cy, 'class="guide"') +
  `<path d="${arcPath(Ax, Ay, 28, 101, 161)}" class="gold"/><path d="${arcPath(Ax, Ay, 35, 41, 101)}" class="gold"/>` +
  ["A", "B", "C", "D", "E", "I", "O"].map((name) => circle(px(world[name]), py(world[name]), name === "I" || name === "O" ? 4 : 4.5, 'fill="white" stroke="#173f69" stroke-width="2"')).join("") +
  mathText(Ax + 8, Ay - 12, [mi("A")]) +
  mathText(Bx - 24, By + 6, [mi("B")]) +
  mathText(Cx + 10, Cy + 6, [mi("C")]) +
  mathText(Dx + 8, Dy + 26, [mi("D")]) +
  mathText(Ex + 10, Ey + 8, [mi("E")]) +
  mathText(Ix + 9, Iy + 4, [mi("I")]) +
  mathText(Ox + 10, Oy + 6, [mi("O")]) +
  mathText((Ax + Bx) / 2 - 6, (Ay + By) / 2 - 10, [rm("2")]) +
  mathText((Ax + Cx) / 2 + 6, (Ay + Cy) / 2 - 10, [rm("1")]) +
  mathText((Bx + Cx) / 2 - 12, By + 30, [rm("√7")]);
add(
  "q2-geometry",
  720,
  500,
  "三角形ABCとその外接円。角Aの二等分線は辺BCとDで交わり、外接円と再びEで交わる。内心Iは線分AD上、外心Oは円内にある。辺ABは2、ACは1、BCはルート7。",
  "外接円と、直線 AE 上の D・I および外心 O の位置関係",
  geometryBody,
);

// Q3: the adjacency block can begin in exactly three positions among four slots.
const slotX = 244;
const slotWidth = 94;
const slotHeight = 58;
const rowY = [58, 151, 244];
const rowLabels = ["左端", "中央", "右端"];
let adjacencyBody = text(48, 31, "ブロックを置く位置", 'font-weight="700"');
rowY.forEach((y, rowIndex) => {
  adjacencyBody += text(198, y + 37, rowLabels[rowIndex], 'text-anchor="end" font-weight="700"');
  for (let column = 0; column < 4; column++) {
    const active = column === rowIndex || column === rowIndex + 1;
    adjacencyBody += rect(slotX + column * slotWidth, y, slotWidth, slotHeight, active ? 'class="gold-fill" stroke="#bd8b27" stroke-width="2"' : 'fill="white" stroke="#aab7c3"');
    if (active) {
      adjacencyBody += mathText(slotX + column * slotWidth + slotWidth / 2, y + 38, [rm(column === rowIndex ? "1" : "8")], 'text-anchor="middle"');
    } else {
      adjacencyBody += text(slotX + column * slotWidth + slotWidth / 2, y + 37, "他", 'text-anchor="middle" fill="#65798d"');
    }
  }
  adjacencyBody += line(slotX + rowIndex * slotWidth + 8, y - 8, slotX + (rowIndex + 2) * slotWidth - 8, y - 8, 'class="gold" stroke-width="3"');
});
adjacencyBody += rect(244, 321, 18, 18, 'class="gold-fill" stroke="#bd8b27"') + mathText(273, 337, [rm("1"), jp("と"), rm("8"), jp("のブロック（順序は各配置で"), rm("2"), jp("通り）")], "", true);
add(
  "q3-adjacency-layout",
  720,
  365,
  "4つの枠で1と8が隣り合う位置は、左端、中央、右端の3通り。各配置で1と8の順序は2通り。",
  "1と8を一つのブロックとして置ける3つの位置",
  adjacencyBody,
);

const manifest = {
  schemaVersion: "lexus-past-exam-figures.v1",
  packageId,
  contentProvenance: "original_editorial",
  restrictedSourceCopied: false,
  review: {
    needsHumanReview: true,
    notes: "公開問題の関数式・幾何条件・場合の数から座標と配置を計算した独自SVG。制限付き参照画像のトレースや埋め込みは行っていない。",
  },
  items: figures,
};
fs.mkdirSync(new URL("../src/data/pastExamFigures/", import.meta.url), { recursive: true });
fs.writeFileSync(new URL(`../src/data/pastExamFigures/${packageId}.json`, import.meta.url), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Built ${figures.length} original mathematics diagrams`);
