// Original SVG diagrams for Keio University 2025 general mathematics.
//
// The two drawings below are derived from the published coordinates and the
// equal-angle (reflection) condition in problem IV(1). Restricted answer-book
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
    const [dx, dy] = labelOffsets.folded[name];
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
    const [dx, dy] = labelOffsets.unfolded[name];
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
handoff.report();

const manifest = {
  schemaVersion: "lexus-past-exam-figures.v1",
  packageId,
  contentProvenance: "original_editorial",
  restrictedSourceCopied: false,
  review: {
    needsHumanReview: true,
    notes: "公開問題IV(1)の座標・等角条件と、反射による独立導出から作成した独自SVG。制限付き参照画像のトレース・埋め込み・複製は行っていない。公開候補HTMLで等角条件が欠落しているIV(2)の立方体図は推測作成していない。",
  },
  items: figures,
};
fs.mkdirSync(new URL("../src/data/pastExamFigures/", import.meta.url), { recursive: true });
fs.writeFileSync(
  new URL(`../src/data/pastExamFigures/${packageId}.json`, import.meta.url),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log(`Built ${figures.length} original reflection diagrams for ${packageId}`);
