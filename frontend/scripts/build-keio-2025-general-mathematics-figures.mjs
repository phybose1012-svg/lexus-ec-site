// Original SVG diagrams for Keio University 2025 general mathematics.
//
// The drawings below are derived from the published coordinates and the
// equal-angle (reflection) conditions in problem IV. Restricted answer-book
// crops only establish that these two cases need a visual; they are not traced,
// embedded, or copied.
import assert from "node:assert/strict";
import fs from "node:fs";
import { createFigureHandoff } from "./lib/past-exam-figure-handoff.mjs";

const packageId = "keio-2025-general-mathematics";
const output = new URL(`../public/assets/past-exams/${packageId}/figures/`, import.meta.url);
const figures = [];
const handoff = createFigureHandoff(packageId, import.meta.url);

const esc = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");
const fixed = (value) => Number(value).toFixed(2);
const fontData = (name) => fs
  .readFileSync(new URL(`../public/assets/vendor/katex/fonts/${name}.woff2`, import.meta.url))
  .toString("base64");

// SVG images loaded through <img> cannot inherit the page's KaTeX faces.
const katexFonts = `@font-face{font-family:'KaTeX_Main';font-style:normal;font-weight:400;src:url(data:font/woff2;base64,${fontData("KaTeX_Main-Regular")}) format('woff2')}@font-face{font-family:'KaTeX_Math';font-style:italic;font-weight:400;src:url(data:font/woff2;base64,${fontData("KaTeX_Math-Italic")}) format('woff2')}`;
const line = (x1, y1, x2, y2, extra = "") =>
  `<line x1="${fixed(x1)}" y1="${fixed(y1)}" x2="${fixed(x2)}" y2="${fixed(y2)}" ${extra}/>`;
const circle = (x, y, r, extra = "") =>
  `<circle cx="${fixed(x)}" cy="${fixed(y)}" r="${fixed(r)}" ${extra}/>`;
const rect = (x, y, width, height, extra = "") =>
  `<rect x="${fixed(x)}" y="${fixed(y)}" width="${fixed(width)}" height="${fixed(height)}" ${extra}/>`;
const polyline = (points, extra = "") =>
  `<polyline points="${points.map(([x, y]) => `${fixed(x)},${fixed(y)}`).join(" ")}" ${extra}/>`;
const span = (value, klass) => `<tspan class="${klass}">${esc(value)}</tspan>`;
const mi = (value) => span(value, "mi");
const rm = (value) => span(value, "rm");
const jp = (value) => span(value, "jp");
const sub = (value) => span(value, "sub");
const mathText = (x, y, parts, extra = "", small = false) =>
  `<text x="${fixed(x)}" y="${fixed(y)}" class="math${small ? " small" : ""}" ${extra}>${parts.join("")}</text>`;
const plainText = (x, y, value, extra = "") =>
  `<text x="${fixed(x)}" y="${fixed(y)}" ${extra}>${esc(value)}</text>`;
const pointLabel = (x, y, index, prime = false, extra = "") =>
  mathText(x, y, [mi("P"), sub(index), ...(prime ? [rm("′")] : [])], extra);

const reflectAcrossHorizontal = ([x, y], boundaryY) => [x, 2 * boundaryY - y];
const reflectAcrossVertical = ([x, y], boundaryX) => [2 * boundaryX - x, y];
const close = (actual, expected, message) => {
  assert.ok(Math.abs(actual - expected) < 1e-10, `${message}: ${actual} != ${expected}`);
};

/**
 * The representative p values determine only the schematic placement.
 * All symbolic relations shown in the figures hold throughout each interval.
 */
function deriveReflectionCase(p, firstBoundary) {
  assert.ok(p > 0 && p < 1);
  assert.ok(firstBoundary === "x=2" || firstBoundary === "y=3");

  const p1 = (2 - p) / 2;
  const q2 = (2 - 2 * p) / (2 - p);
  const p4 = firstBoundary === "y=3" ? (3 * p - 2) / 2 : 0;
  const q4 = firstBoundary === "x=2" ? 2 * p / (2 - p) : 1;
  const folded = {
    P0: [0, 0],
    P1: [p1, 1],
    P2: [1, q2],
    P3: [p, 0],
    P4: [p4, q4],
  };

  // Unfold the reflections successively across y=1, x=1, and y=2.
  const unfolded = {
    P0: folded.P0,
    P1: folded.P1,
    P2: reflectAcrossHorizontal(folded.P2, 1),
    P3: reflectAcrossVertical(reflectAcrossHorizontal(folded.P3, 1), 1),
    P4: reflectAcrossHorizontal(
      reflectAcrossVertical(reflectAcrossHorizontal(folded.P4, 1), 1),
      2,
    ),
  };

  const slope = 2 / (2 - p);
  for (const [name, [x, y]] of Object.entries(unfolded)) {
    close(y, slope * x, `${name} must lie on the unfolded straight line`);
  }
  const unfoldedX = Object.values(unfolded).map(([x]) => x);
  assert.ok(unfoldedX.every((x, index) => index === 0 || x > unfoldedX[index - 1]), "unfolded points must retain travel order");
  close(unfolded.P1[1], 1, "P1 must be on the first reflection edge");
  close(unfolded.P2[0], 1, "P2 prime must be on the second reflection edge");
  close(unfolded.P3[1], 2, "P3 prime must be on the third reflection edge");
  if (firstBoundary === "x=2") {
    close(unfolded.P4[0], 2, "case 1 must meet x=2 first");
    assert.ok(unfolded.P4[1] <= 3);
  } else {
    close(unfolded.P4[1], 3, "case 2 must meet y=3 first");
    assert.ok(unfolded.P4[0] < 2);
  }

  return { p, p1, q2, p4, q4, folded, unfolded, slope, firstBoundary };
}

const drawingCases = [
  {
    id: "a13-square-reflection-case1",
    data: deriveReflectionCase(1 / 2, "x=2"),
    titleParts: [mi("p"), jp(" が "), rm("0"), jp(" より大きく "), rm("2/3"), jp(" 以下の場合")],
    sampleParts: [mi("p"), rm(" = 1/2"), jp(" の配置例（位置関係を示す模式図）")],
    endpointLines: [
      [mi("y"), rm("=3"), jp(" に達するまでに")],
      [mi("x"), rm("=2"), jp(" の辺へ到達")],
    ],
    resultParts: [mi("P"), sub("4"), rm("=(0, 2"), mi("p"), rm("/(2−"), mi("p"), rm("))")],
    alt: "正方形S内でP0からP1、P2、P3、P4へ反射する折れ線と、辺y=1、x=1、y=2で順に展開して5点が一直線に並ぶ対応図。0<p≦2/3では展開線がy=3に達するまでにx=2へ達し、p=2/3では角を通る。P4=(0,2p/(2-p))となる。p=1/2を用いた模式図。",
    caption: "0<p≦2/3：反射を展開すると、直線は y=3 に達するまでに x=2 へ達する（p=2/3 では角）。",
  },
  {
    id: "a13-square-reflection-case2",
    data: deriveReflectionCase(4 / 5, "y=3"),
    titleParts: [mi("p"), jp(" が "), rm("2/3"), jp(" より大きく "), rm("1"), jp(" 未満の場合")],
    sampleParts: [mi("p"), rm(" = 4/5"), jp(" の配置例（位置関係を示す模式図）")],
    endpointLines: [
      [mi("x"), rm("=2"), jp(" に達する前に")],
      [mi("y"), rm("=3"), jp(" の辺へ到達")],
    ],
    resultParts: [mi("P"), sub("4"), rm("=((3"), mi("p"), rm("−2)/2, 1)")],
    alt: "正方形S内でP0からP1、P2、P3、P4へ反射する折れ線と、辺y=1、x=1、y=2で順に展開して5点が一直線に並ぶ対応図。2/3<p<1では展開線がx=2より先にy=3へ達し、P4=((3p-2)/2,1)となる。p=4/5を用いた模式図。",
    caption: "2/3<p<1：反射を展開すると、直線は x=2 より先に y=3 へ達する。",
  },
];

function add(id, width, height, alt, caption, body) {
  const kept = handoff.keep(id);
  figures.push({
    id,
    width: kept?.width ?? width,
    height: kept?.height ?? height,
    alt,
    caption,
    src: `/assets/past-exams/${packageId}/figures/${id}.svg`,
  });
  if (kept) return;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title"><title id="title">${esc(alt)}</title><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#18334c"/></marker></defs><style>${katexFonts}text{font-family:'Yu Gothic','Meiryo',sans-serif;font-size:19px;fill:#18334c;stroke:none}.math{font-family:'KaTeX_Main','Times New Roman',serif;font-size:22px}.math .mi{font-family:'KaTeX_Math','Times New Roman',serif;font-style:italic}.math .rm{font-family:'KaTeX_Main','Times New Roman',serif;font-style:normal}.math .jp{font-family:'Yu Gothic','Meiryo',sans-serif;font-style:normal}.math .sub{font-family:'KaTeX_Main','Times New Roman',serif;font-size:68%;font-style:normal;baseline-shift:sub}.small{font-size:17px}line,path,circle,rect,polyline{vector-effect:non-scaling-stroke}.square{fill:#f5f8fb;stroke:#18334c;stroke-width:2}.tile{fill:#f7f9fb;stroke:#9babb9;stroke-width:1.3}.tile-accent{fill:#fff8e8}.ray{fill:none;stroke:#bd8b27;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.straight{fill:none;stroke:#173f69;stroke-width:3}.reflection-edge{stroke:#bd8b27;stroke-width:2.2;stroke-dasharray:7 5}.axis{stroke:#18334c;stroke-width:1.5}.point{fill:white;stroke:#173f69;stroke-width:2}.point-end{fill:#bd8b27;stroke:white;stroke-width:1.6}.panel-title{font-size:18px;font-weight:700}.muted{font-size:15px;fill:#607589}.callout{fill:#fffdf8;stroke:#d8c79f;stroke-width:1.4}</style><rect width="100%" height="100%" fill="white"/>${body}</svg>\n`;
  fs.writeFileSync(new URL(`${id}.svg`, output), svg);
}

const foldFrame = { left: 48, bottom: 405, scale: 250 };
const unfoldFrame = { left: 430, bottom: 405, scale: 94 };
const foldPoint = ([x, y]) => [foldFrame.left + x * foldFrame.scale, foldFrame.bottom - y * foldFrame.scale];
const unfoldPoint = ([x, y]) => [unfoldFrame.left + x * unfoldFrame.scale, unfoldFrame.bottom - y * unfoldFrame.scale];
const labelOffsets = {
  folded: {
    P0: [-21, 27],
    P1: [-9, -14],
    P2: [12, 6],
    P3: [-5, 28],
    P4: [-35, 6],
  },
  unfolded: {
    P0: [-22, 27],
    P1: [-35, -10],
    P2: [9, -10],
    P3: [9, -10],
    P4: [-12, -13],
  },
};

function renderCase(spec) {
  const { data } = spec;
  let body = `<g data-representative-p="${data.p}" data-first-boundary="${data.firstBoundary}">`;
  body += mathText(46, 39, spec.titleParts, 'style="font-size:23px;font-weight:700"');
  body += mathText(46, 67, spec.sampleParts, 'style="font-size:15px;fill:#607589"');

  // Folded square and the original broken ray.
  body += plainText(173, 112, "正方形内の反射", 'class="panel-title" text-anchor="middle"');
  body += rect(foldFrame.left, foldFrame.bottom - foldFrame.scale, foldFrame.scale, foldFrame.scale, 'class="square"');
  const foldedPoints = Object.values(data.folded).map(foldPoint);
  body += polyline(foldedPoints, 'class="ray" data-path="P0-P1-P2-P3-P4"');
  for (const [name, value] of Object.entries(data.folded)) {
    const [x, y] = foldPoint(value);
    const [dx, dy] = name === "P4" && data.firstBoundary === "y=3" ? [-12, -15] : labelOffsets.folded[name];
    body += circle(x, y, name === "P0" || name === "P4" ? 5.5 : 4.8, name === "P4" ? 'class="point-end"' : 'class="point"');
    body += pointLabel(x + dx, y + dy, name.slice(1));
  }
  body += mathText(269, 181, [mi("S")], '', true);

  // The transformation is intentionally shown between two different visual
  // forms, rather than imitating the answer-book crop.
  body += line(329, 279, 398, 279, 'class="axis" marker-end="url(#arrow)"');
  body += plainText(364, 260, "辺で展開", 'class="muted" text-anchor="middle"');

  // Four reflected copies traversed by the unfolded straight line.
  const tileCells = [[0, 0], [0, 1], [1, 1], [1, 2]];
  tileCells.forEach(([x, y], index) => {
    const [left, bottom] = unfoldPoint([x, y]);
    body += rect(left, bottom - unfoldFrame.scale, unfoldFrame.scale, unfoldFrame.scale, `class="tile${index === 0 ? " tile-accent" : ""}"`);
  });
  const [u01x, u01y] = unfoldPoint([0, 1]);
  const [u11x, u11y] = unfoldPoint([1, 1]);
  const [u12x, u12y] = unfoldPoint([1, 2]);
  const [u22x, u22y] = unfoldPoint([2, 2]);
  body += line(u01x, u01y, u11x, u11y, 'class="reflection-edge"');
  body += line(u11x, u11y, u12x, u12y, 'class="reflection-edge"');
  body += line(u12x, u12y, u22x, u22y, 'class="reflection-edge"');
  body += plainText(524, 112, "反射を展開した直線", 'class="panel-title" text-anchor="middle"');

  const unfoldedPoints = Object.values(data.unfolded).map(unfoldPoint);
  body += polyline(unfoldedPoints, 'class="straight" data-path="P0-P1-P2-prime-P3-prime-P4-prime"');
  for (const [name, value] of Object.entries(data.unfolded)) {
    const [x, y] = unfoldPoint(value);
    const [dx, dy] = name === "P4" && data.firstBoundary === "y=3" ? [15, 22] : labelOffsets.unfolded[name];
    body += circle(x, y, name === "P4" ? 5.7 : 4.7, name === "P4" ? 'class="point-end" data-point="P4-prime"' : 'class="point"');
    body += pointLabel(x + dx, y + dy, name.slice(1), name === "P2" || name === "P3" || name === "P4");
  }

  // Coordinate guides make the first boundary reached auditable.
  body += mathText(...unfoldPoint([1, 0]), [rm("1")], 'transform="translate(0 26)" text-anchor="middle"', true);
  body += mathText(...unfoldPoint([2, 0]), [rm("2")], 'transform="translate(0 26)" text-anchor="middle"', true);
  body += mathText(...unfoldPoint([0, 1]), [rm("1")], 'transform="translate(-16 6)" text-anchor="end"', true);
  body += mathText(...unfoldPoint([0, 2]), [rm("2")], 'transform="translate(-16 6)" text-anchor="end"', true);
  body += mathText(...unfoldPoint([1, 3]), [rm("3")], 'transform="translate(-110 6)" text-anchor="end"', true);

  body += rect(651, 143, 245, 246, 'rx="11" class="callout"');
  body += plainText(671, 174, "一直線になる理由", 'font-size="17" font-weight="700"');
  body += plainText(671, 203, "展開する辺の順序", 'class="muted"');
  body += mathText(671, 231, [mi("y"), rm("=1 → "), mi("x"), rm("=1 → "), mi("y"), rm("=2")], '', true);
  body += plainText(671, 264, "展開後の直線", 'class="muted"');
  body += mathText(671, 294, [mi("y"), rm("=2"), mi("x"), rm("/(2−"), mi("p"), rm(")")]);
  body += mathText(671, 326, spec.endpointLines[0], 'style="font-size:16px"');
  body += mathText(671, 349, spec.endpointLines[1], 'style="font-size:16px"');
  body += mathText(671, 378, spec.resultParts, '', true);
  body += '</g>';
  return body;
}

fs.mkdirSync(output, { recursive: true });
for (const spec of drawingCases) {
  add(spec.id, 920, 455, spec.alt, spec.caption, renderCase(spec));
}

// IV(2): independently derived from the restored perpendicular-plane and
// equal-angle conditions. The displayed sample is not an additional condition.
const projectCube = ([x, y, z]) => [190 + 180 * x - 66 * y, 425 + 34 * x + 26 * y - 106 * z];
const sampleA = 1 / 2;
const sampleB = 4 / 5;
const cubeTimes = [0, 1 / 2, 1 / (2 - sampleB), 1, 3 / 2];
const cubePoints = cubeTimes.map(t => [sampleA * t, (2 - sampleB) * t, 2 * t]);
assert.ok(cubeTimes.at(-1) < 1 / sampleA && cubeTimes.at(-1) < 2 / (2 - sampleB));
let cubeBody = '<g data-cube-a="0.5" data-cube-b="0.8" data-reflection-planes="z=1,y=1,z=2">';
cubeBody += plainText(30, 38, "面の反射を展開すると、経路は一直線", 'class="panel-title"');
cubeBody += mathText(30, 69, [mi("a"), rm("=1/2, "), mi("b"), rm("=4/5"), jp(" の配置例（座標を斜めから投影）")], '', true);
for (const [y0, z0] of [[0, 0], [0, 1], [1, 1], [1, 2]]) {
  const vertices = Array.from({ length: 8 }, (_, i) => [i & 1, y0 + ((i >> 1) & 1), z0 + ((i >> 2) & 1)]);
  for (let i = 0; i < 8; i += 1) for (const bit of [1, 2, 4]) if (!(i & bit)) {
    cubeBody += line(...projectCube(vertices[i]), ...projectCube(vertices[i | bit]), 'stroke="#b9c5cf" stroke-width="1.2"');
  }
}
for (const plane of [
  [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1], [0, 0, 1]],
  [[0, 1, 1], [1, 1, 1], [1, 1, 2], [0, 1, 2], [0, 1, 1]],
  [[0, 1, 2], [1, 1, 2], [1, 2, 2], [0, 2, 2], [0, 1, 2]],
]) cubeBody += polyline(plane.map(projectCube), 'class="reflection-edge" fill="none"');
cubeBody += polyline(cubePoints.map(projectCube), 'class="straight" data-path="Q0-Q1-Q2-prime-Q3-prime-Q4-prime"');
cubePoints.forEach((point, i) => {
  const [x, y] = projectCube(point);
  cubeBody += circle(x, y, 4.7, i === 4 ? 'class="point-end"' : 'class="point"');
  cubeBody += mathText(x + (i ? 19 : -29), y + (i ? 5 : 25), [mi("Q"), sub(i), ...(i >= 2 ? [rm("′")] : [])], 'style="paint-order:stroke;stroke:white;stroke-width:6px;stroke-linejoin:round"');
});
cubeBody += line(355, 350, 377, 358, 'stroke="#607589" stroke-width="1"');
cubeBody += mathText(382, 364, [mi("z"), rm("=1")], 'style="paint-order:stroke;stroke:white;stroke-width:6px"', true);
cubeBody += line(100, 308, 149, 305, 'stroke="#607589" stroke-width="1"');
cubeBody += mathText(57, 314, [mi("y"), rm("=1")], 'style="paint-order:stroke;stroke:white;stroke-width:6px"', true);
cubeBody += line(290, 284, 313, 292, 'stroke="#607589" stroke-width="1"');
cubeBody += mathText(320, 298, [mi("z"), rm("=2")], 'style="paint-order:stroke;stroke:white;stroke-width:6px"', true);
// Stack the calculation key below the geometry so labels remain legible when
// the SVG is scaled to a narrow phone viewport.
cubeBody += '<g transform="translate(-418 415)">';
cubeBody += rect(443, 105, 410, 342, 'rx="10" class="callout"');
cubeBody += plainText(465, 136, "展開した面の順序", 'class="panel-title"');
cubeBody += mathText(465, 171, [mi("z"), rm("=1 → "), mi("y"), rm("=1 → "), mi("z"), rm("=2")]);
cubeBody += plainText(465, 212, "原点と Q₃′ を結ぶ直線", 'class="muted"');
cubeBody += mathText(465, 246, [rm("("), mi("x"), rm(","), mi("y"), rm(","), mi("z"), rm(")="), mi("t"), rm("("), mi("a"), rm(",2−"), mi("b"), rm(",2)")]);
cubeBody += plainText(465, 289, "Q₃′ の先では到達時刻を比較", 'class="muted"');
cubeBody += mathText(465, 324, [mi("x"), rm("=1: "), mi("t"), rm("=1/"), mi("a")]);
cubeBody += mathText(465, 360, [mi("y"), rm("=2: "), mi("t"), rm("=2/(2−"), mi("b"), rm(")")]);
cubeBody += mathText(465, 396, [mi("z"), rm("=3: "), mi("t"), rm("=3/2")]);
cubeBody += '</g>';
cubeBody += '</g>';
add("iv2-cube-unfolding", 460, 890,
  "立方体をz=1、y=1、z=2の順に反射して展開した模式図。Q0、Q1、展開後のQ2、Q3、Q4が直線t(a,2−b,2)に並ぶ。a=1/2、b=4/5の例ではQ3の次にz=3へ到達する。一般の場合はx=1、y=2、z=3への到達時刻を比較する。",
  "立方体を面で展開した配置例。Q₃′の先では、3つの面への到達時刻の最小値でQ₄を決めます。", cubeBody);
handoff.report();

const manifest = {
  schemaVersion: "lexus-past-exam-figures.v1",
  packageId,
  contentProvenance: "original_editorial",
  restrictedSourceCopied: false,
  review: {
    needsHumanReview: true,
    notes: "問題IVの座標・等角条件と、反射による独立導出から作成した独自SVG。IV(2)は2026-09-10に修復された直交平面・共有線分・等角条件を確認し、反射面z=1、y=1、z=2と座標を独立検算して作図。制限付き参照画像のトレース・埋め込み・複製は行っていない。人間の内容承認は未完了。",
  },
  items: figures,
};
fs.mkdirSync(new URL("../src/data/pastExamFigures/", import.meta.url), { recursive: true });
fs.writeFileSync(
  new URL(`../src/data/pastExamFigures/${packageId}.json`, import.meta.url),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log(`Built ${figures.length} original reflection diagrams for ${packageId}`);
