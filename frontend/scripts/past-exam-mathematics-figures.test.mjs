// Static artifact and mathematical-invariant tests; no browser is launched.
import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { parse } from "parse5";
import { loadFigureManifest } from "../src/lib/pastExamFigures.mjs";

const root = new URL("../", import.meta.url);
const id = "iwate-medical-2025-general-mathematics";
const route = "/past-exam-library/iwate-medical/2025/mathematics/answers/";
const read = (path) => fs.readFileSync(new URL(path, root), "utf8");
const source = JSON.parse(read(`src/data/pastExamAnswerSources/${id}.json`));
const manifest = JSON.parse(read(`src/data/pastExamFigures/${id}.json`));
const registry = loadFigureManifest(
  fileURLToPath(new URL(`src/data/pastExamFigures/${id}.json`, root)),
  fileURLToPath(new URL("public", root)),
  id,
);
const attr = (node, key) => node.attrs?.find((item) => item.name === key)?.value;
const nodes = (node) => [node, ...(node.childNodes ?? []).flatMap(nodes)];
const cls = (node, name) => (attr(node, "class") ?? "").split(" ").includes(name);

test("all three mathematics placeholders are replaced by registered original figures", () => {
  const blocks = source.document.majorQuestions.flatMap((major) => major.sections.flatMap((section) => section.blocks));
  assert.equal(source.figureManifest, `frontend/src/data/pastExamFigures/${id}.json`);
  assert.deepEqual(blocks.filter((block) => block.type === "figure").map((block) => block.assetId), [
    "q1-function-graph",
    "q2-geometry",
    "q3-adjacency-layout",
  ]);
  assert.equal(blocks.some((block) => block.type === "figurePlaceholder"), false);
  assert.equal(manifest.items.length, 3);
  assert.equal(registry.byId.size, 3);
});

test("SVG assets are self-contained, safe, descriptive and use embedded KaTeX typography", () => {
  const textPattern = /<text([^>]*)>([\s\S]*?)<\/text>/g;
  for (const item of manifest.items) {
    const svg = read(`public${item.src}`);
    assert.match(svg, /<svg/);
    assert.ok(item.alt.length > 30);
    assert.ok(!/<script|<image|<foreignObject|(?:href|onload)\s*=/i.test(svg), item.id);
    assert.equal((svg.match(/data:font\/woff2;base64/g) ?? []).length, 2, item.id);
    assert.match(svg, /\.math \.mi\{font-family:'KaTeX_Math'/);
    const mathLabels = [...svg.matchAll(textPattern)].filter((match) => /[A-Za-z0-9√−=]/.test(match[2].replace(/<[^>]+>/g, "")));
    assert.ok(mathLabels.length > 0, item.id);
    for (const label of mathLabels) assert.match(label[1], /class="math/);
  }
});

test("function graph boundaries and triangle construction agree with the derived values", () => {
  const f = (x) => x ** 3 / (2 * x ** 2 - 1);
  const extremumX = Math.sqrt(6) / 2;
  const extremumY = 3 * Math.sqrt(6) / 8;
  assert.ok(Math.abs(f(extremumX) - extremumY) < 1e-12);
  assert.ok(Math.abs(f(-extremumX) + extremumY) < 1e-12);

  const distance = ([x1, y1], [x2, y2]) => Math.hypot(x2 - x1, y2 - y1);
  const sqrt7 = Math.sqrt(7);
  const A = [3 / (2 * sqrt7), Math.sqrt(3 / 7)];
  const B = [-sqrt7 / 2, 0];
  const C = [sqrt7 / 2, 0];
  const D = [sqrt7 / 6, 0];
  const E = [0, -Math.sqrt(21) / 2];
  assert.ok(Math.abs(distance(A, B) - 2) < 1e-12);
  assert.ok(Math.abs(distance(A, C) - 1) < 1e-12);
  assert.ok(Math.abs(distance(B, C) - sqrt7) < 1e-12);
  assert.ok(Math.abs(distance(A, D) - 2 / 3) < 1e-12);
  assert.ok(Math.abs(distance(A, E) - 3) < 1e-12);
});

test("built answer page exposes three semantic figures with intrinsic dimensions", () => {
  const page = nodes(parse(read(`dist${route}index.html`)));
  const figures = page.filter((node) => cls(node, "past-exam-figure"));
  assert.equal(figures.length, 3);
  assert.equal(page.some((node) => cls(node, "answer-figure-placeholder")), false);
  for (const figure of figures) {
    const image = nodes(figure).find((node) => node.tagName === "img");
    const item = registry.bySrc.get(attr(image, "src"));
    assert.ok(item);
    assert.equal(attr(image, "alt"), item.alt);
    assert.equal(attr(image, "width"), String(item.width));
    assert.equal(attr(image, "height"), String(item.height));
    assert.ok(fs.existsSync(new URL(`dist${item.src}`, root)));
  }
});
