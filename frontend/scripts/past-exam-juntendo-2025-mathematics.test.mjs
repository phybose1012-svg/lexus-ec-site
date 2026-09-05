// Mathematical-meaning tests for 順天堂大学 2025 一般選抜A方式 数学.
// Every expected value is recomputed here from the published question conditions,
// then compared with the authored answer key, the figure geometry and the built page.
// A page that merely renders is not evidence that its mathematics is right.
import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { parse } from "parse5";
import { loadFigureManifest } from "../src/lib/pastExamFigures.mjs";

const root = new URL("../", import.meta.url);
const id = "juntendo-2025-general-a-mathematics";
const route = "/past-exam-library/juntendo/2025/mathematics/answers/";
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

const close = (a, b, epsilon = 1e-9) => Math.abs(a - b) < epsilon;
// Answer-key values print a real MINUS SIGN (U+2212); parse them as numbers deliberately.
const num = (value) => Number(String(value).replace(/−/g, "-"));
const keyOf = (majorId, label) => {
  const major = source.document.majorQuestions.find((m) => m.id === majorId);
  const group = major.answerKey.find((k) => k.label === label);
  return Object.fromEntries(group.entries.map((e) => [e.mark, e.value]));
};

test("Ⅰ(1) geometric rewrite, first index below 1, series sum and product index", () => {
  const a = (n) => 8 * (2 / 3) ** n;
  // 2^{n+3}3^{-n} really is 8(2/3)^n, not merely asserted in prose.
  for (const n of [1, 2, 5, 9]) assert.ok(close(2 ** (n + 3) * 3 ** -n, a(n)));

  let firstBelowOne = null;
  for (let n = 1; n < 200 && firstBelowOne === null; n += 1) if (a(n) < 1) firstBelowOne = n;
  assert.equal(a(firstBelowOne - 1) >= 1 && a(firstBelowOne) < 1, true);

  const sum = 8 * (2 / 3) / (1 - 2 / 3);
  assert.ok(close(sum, 16));

  let product = 1;
  let firstProductBelowOne = null;
  for (let n = 1; n < 200 && firstProductBelowOne === null; n += 1) {
    product *= a(n);
    if (product < 1) firstProductBelowOne = n;
  }
  // Closed form 8^n (2/3)^{n(n+1)/2} must agree with the running product.
  const closed = (n) => 8 ** n * (2 / 3) ** ((n * (n + 1)) / 2);
  for (const n of [1, 3, 7, 10]) {
    let running = 1;
    for (let k = 1; k <= n; k += 1) running *= a(k);
    assert.ok(Math.abs(running - closed(n)) < 1e-6 * Math.max(1, Math.abs(closed(n))));
  }
  assert.ok(closed(firstProductBelowOne - 1) >= 1 && closed(firstProductBelowOne) < 1);

  const key = keyOf("major-question-01", "（1）");
  assert.equal(key["ア"], String(firstBelowOne));
  assert.equal(key["イウ"], String(sum.toFixed(0)));
  assert.equal(key["エオ"], String(firstProductBelowOne));
  assert.deepEqual([key["ア"], key["イウ"], key["エオ"]], ["6", "16", "10"]);
});

// Shared 3D reconstruction of 四面体OABC, from |OA|=9, |OB|=3, |OC|=6 and three 60° angles.
const tetrahedron = () => {
  const cos60 = 0.5;
  const A = [9, 0, 0];
  const B = [3 * cos60, 3 * Math.sin(Math.PI / 3), 0];
  const cx = (9 * 6 * cos60) / 9;
  const cy = (3 * 6 * cos60 - B[0] * cx) / B[1];
  const C = [cx, cy, Math.sqrt(36 - cx ** 2 - cy ** 2)];
  return { A, B, C };
};
const dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
const sub = (u, v) => u.map((x, i) => x - v[i]);
const add = (u, v) => u.map((x, i) => x + v[i]);
const mul = (u, k) => u.map((x) => x * k);

test("Ⅰ(2) the tetrahedron satisfies the stated lengths and 60° angles", () => {
  const { A, B, C } = tetrahedron();
  assert.ok(close(Math.sqrt(dot(A, A)), 9));
  assert.ok(close(Math.sqrt(dot(B, B)), 3));
  assert.ok(close(Math.sqrt(dot(C, C)), 6));
  for (const [u, v] of [[A, B], [B, C], [A, C]]) {
    assert.ok(close(dot(u, v) / (Math.sqrt(dot(u, u)) * Math.sqrt(dot(v, v))), 0.5));
  }
});

test("Ⅰ(2) DR = s k + t l holds for every (s,t), with |k|²=9, |l|²=12, k·l=3 and area 3√11", () => {
  const { A, B, C } = tetrahedron();
  const k = mul(A, 1 / 3);
  const l = mul(sub(C, B), 2 / 3);
  const D = mul(B, 2 / 3);

  // The decomposition is an identity in (s, t), not a coincidence at one sample.
  for (const s of [0, 0.23, 0.55, 1]) {
    for (const t of [0, 0.4, 0.77, 1]) {
      const P = mul(A, s);
      const Q = add(mul(B, 1 - t), mul(C, t));
      const R = add(mul(P, 1 / 3), mul(Q, 2 / 3)); // PR : RQ = 2 : 1
      const DR = sub(R, D);
      const predicted = add(mul(k, s), mul(l, t));
      assert.ok(DR.every((value, i) => close(value, predicted[i])));
    }
  }

  assert.ok(close(dot(k, k), 9));
  assert.ok(close(dot(l, l), 12));
  assert.ok(close(dot(k, l), 3));
  const area = Math.sqrt(dot(k, k) * dot(l, l) - dot(k, l) ** 2);
  assert.ok(close(area, 3 * Math.sqrt(11)));
  assert.ok(close(area ** 2, 99));

  const key = keyOf("major-question-01", "（2）");
  assert.deepEqual(
    ["ア", "イ", "ウ", "エ", "オ", "カ", "キ", "クケ", "コ", "サ", "シス"].map((m) => key[m]),
    ["1", "3", "2", "3", "2", "3", "9", "12", "3", "3", "11"],
  );
  // k = (ア/イ)OA and l = (ウ/エ)OC − (オ/カ)OB must reproduce the vectors used above.
  assert.ok(mul(A, num(key["ア"]) / num(key["イ"])).every((v, i) => close(v, k[i])));
  const lFromKey = sub(mul(C, num(key["ウ"]) / num(key["エ"])), mul(B, num(key["オ"]) / num(key["カ"])));
  assert.ok(lFromKey.every((v, i) => close(v, l[i])));
});

test("Ⅰ(3) the quartic reductions and the largest real root are exact", () => {
  const P = (x) => x ** 4 - 54 * x * x - 40 * x + 269;
  const b = -1;
  const shifted = (y) => y ** 4 - 4 * y ** 3 - 48 * y * y + 64 * y + 256;
  for (const y of [-3, -1, 0, 1.5, 4]) assert.ok(close(P(y + b), shifted(y), 1e-9));

  const a = 4;
  const c = 256;
  const d = -768;
  for (const z of [-1.7, -0.4, 0.6, 1, 2.3]) {
    assert.ok(close(P(a * z + b), c * z ** 4 - c * z ** 3 + d * z * z + c * z + c, 1e-8));
  }
  // The requested shape forces a^4 = c = 4a^3 and d = -48a².
  assert.ok(close(a ** 4, c) && close(4 * a ** 3, c) && close(-48 * a * a, d));

  for (const t of [(1 + Math.sqrt(5)) / 2, (1 - Math.sqrt(5)) / 2]) assert.ok(close(t * t - t - 1, 0));

  const largest = Math.sqrt(5) + Math.sqrt(22 + 2 * Math.sqrt(5));
  assert.ok(close(P(largest), 0, 1e-8));
  // It is genuinely the largest real root: bisect every sign change of P.
  const roots = [];
  let previous = P(-20);
  for (let i = -200000 + 1; i <= 200000; i += 1) {
    const x = i / 10000;
    const current = P(x);
    if (previous * current < 0) {
      let lo = (i - 1) / 10000;
      let hi = x;
      for (let step = 0; step < 100; step += 1) {
        const mid = (lo + hi) / 2;
        if (P(lo) * P(mid) <= 0) hi = mid; else lo = mid;
      }
      roots.push((lo + hi) / 2);
    }
    previous = current;
  }
  assert.equal(roots.length, 4);
  assert.ok(close(Math.max(...roots), largest, 1e-8));

  const key = keyOf("major-question-01", "（3）");
  assert.deepEqual(
    ["アイ", "ウ", "エオカ", "キクケコ", "サ", "シ", "ス", "セ", "ソタ", "チ", "ツ"].map((m) => key[m]),
    ["−1", "4", "256", "−768", "1", "5", "2", "5", "22", "2", "5"],
  );
  // The published slot values must rebuild the same root: √セ + √(ソタ + チ√ツ).
  const rebuilt = Math.sqrt(num(key["セ"]))
    + Math.sqrt(num(key["ソタ"]) + num(key["チ"]) * Math.sqrt(num(key["ツ"])));
  assert.ok(close(rebuilt, largest));
});

test("Ⅰ(4) each necessity/sufficiency verdict follows from an explicit witness", () => {
  // (a) |x+2|−|x−1| is piecewise; compare the solution set with −1 < x < 1.
  const g = (x) => (x < -2 ? -3 : x < 1 ? 2 * x + 1 : 3);
  const satisfies = (x) => g(x) > 0 && g(x) < 3;
  assert.ok(satisfies(-0.4) && satisfies(0.9));
  assert.ok(!satisfies(-0.5) && !satisfies(-0.75) && !satisfies(1) && !satisfies(5));
  // Sufficient (subset of (−1,1)) but not necessary (x = −0.75 is a counterexample).
  for (let i = -49999; i <= 99999; i += 1) {
    const x = i / 100000;
    if (satisfies(x)) assert.ok(x > -1 && x < 1);
  }
  assert.ok(-0.75 > -1 && -0.75 < 1 && !satisfies(-0.75));

  // (b) 2^(1/2) is irrational, so a^b need not be rational; x = x^1 gives necessity.
  assert.ok(!Number.isInteger(Math.SQRT2) && close(2 ** 0.5, Math.SQRT2));

  // (c) a_n = 1/n tends to 0 while its series diverges past any bound.
  let harmonic = 0;
  for (let n = 1; n <= 200000; n += 1) harmonic += 1 / n;
  assert.ok(harmonic > 10 && close(1 / 200000, 0, 1e-4));

  // (d) m² and m share parity, so the two statements are equivalent.
  for (let m = -8; m <= 8; m += 1) {
    for (let n = -8; n <= 8; n += 1) {
      for (let l = -8; l <= 8; l += 1) {
        assert.equal(Math.abs((m * m + n * n + l * l) % 2), Math.abs((m + n + l) % 2));
      }
    }
  }

  const key = keyOf("major-question-01", "（4）");
  assert.deepEqual(["ア", "イ", "ウ", "エ"].map((m) => key[m]), ["C", "B", "C", "A"]);
});

test("Ⅱ each cubic satisfies exactly the stated shared-point, tangency and extremum conditions", () => {
  const derivative = (f, x) => (f(x + 1e-6) - f(x - 1e-6)) / 2e-6;

  // (a) three shared points with y = 6x, and f'(-2) = -3.
  const fa = (x) => -0.5 * x ** 3 + 1.5 * x * x + 9 * x - 4;
  for (const [x, y] of [[-2, -12], [1, 6], [4, 24]]) assert.ok(close(fa(x), y, 1e-9) && close(6 * x, y));
  assert.ok(close(derivative(fa, -2), -3, 1e-5));

  // (b) tangent to y = 6x at (1,6), passes (4,24), and tangent to y = 6x-12.
  const fb = (x) => 3 * x ** 3 - 18 * x * x + 33 * x - 12;
  assert.ok(close(fb(1), 6, 1e-9) && close(derivative(fb, 1), 6, 1e-5));
  assert.ok(close(fb(4), 24, 1e-9));
  const gb = (x) => fb(x) - (6 * x - 12);
  assert.ok(close(gb(3), 0, 1e-9) && close(derivative(gb, 3), 0, 1e-5));
  // Tangency means a double root: gb keeps one sign around x = 3.
  assert.ok(gb(2.9) > 0 && gb(3.1) > 0);

  // (c) tangent to y = 6x at (1,6) with no other shared point, and an extremum at x = -3.
  const fc = (x) => -(1 / 8) * x ** 3 + (3 / 8) * x * x + (45 / 8) * x + 1 / 8;
  assert.ok(close(fc(1), 6, 1e-9) && close(derivative(fc, 1), 6, 1e-5));
  const diff = (x) => fc(x) - 6 * x;
  for (const x of [-40, -5, 0.5, 2, 30]) assert.ok(close(diff(x), -(1 / 8) * (x - 1) ** 3, 1e-6));
  for (let i = -50000; i <= 50000; i += 1) {
    const x = i / 500;
    if (close(diff(x), 0, 1e-12)) assert.ok(close(x, 1, 1e-9));
  }
  assert.ok(close(derivative(fc, -3), 0, 1e-5));
  // A zero derivative is only a candidate: check the sign actually changes.
  assert.ok(derivative(fc, -3.2) * derivative(fc, -2.8) < 0);

  const a = keyOf("major-question-02", "（a）");
  const b = keyOf("major-question-02", "（b）");
  const c = keyOf("major-question-02", "（c）");
  assert.deepEqual(["ア", "イ", "ウ"].map((m) => a[m]), ["2", "1", "4"]);
  assert.ok(num(a["イ"]) < num(a["ウ"]));
  assert.ok(close(num(a["エオ"]) / num(a["カ"]), -0.5));
  assert.ok(close(num(a["キ"]) / num(a["ク"]), 1.5));
  assert.deepEqual([a["ケ"], a["コサ"]], ["9", "−4"]);
  assert.deepEqual([b["シ"], b["スセソ"], b["タチ"], b["ツテト"]], ["3", "−18", "33", "−12"]);
  assert.ok(close(num(c["ナニ"]) / num(c["ヌ"]), -1 / 8));
  assert.ok(close(num(c["ネ"]) / num(c["ノ"]), 3 / 8));
  assert.ok(close(num(c["ハヒ"]) / num(c["フ"]), 45 / 8));
  assert.ok(close(num(c["ヘ"]) / num(c["ホ"]), 1 / 8));
});

test("Ⅲ I₀, the integral recurrence, the closed form and the squeeze bound all hold", () => {
  const simpson = (f, lo, hi, n = 20000) => {
    let total = f(lo) + f(hi);
    for (let i = 1; i < n; i += 1) total += f(lo + ((hi - lo) * i) / n) * (i % 2 ? 4 : 2);
    return (total * (hi - lo)) / (3 * n);
  };
  const I = (n) => simpson((x) => Math.tan(x) ** (2 * n + 1), 0, Math.PI / 4);

  assert.ok(close(I(0), 0.5 * Math.log(2), 1e-8));
  // I_n + I_{n-1} = 1/(2n) is the engine of the induction.
  for (let n = 1; n <= 6; n += 1) assert.ok(close(I(n) + I(n - 1), 1 / (2 * n), 1e-7));
  // The closed form proved by induction.
  for (let n = 1; n <= 6; n += 1) {
    let sum = 0;
    for (let m = 1; m <= n; m += 1) sum += (-1) ** m / (2 * m);
    assert.ok(close(I(n), (-1) ** n * (I(0) + sum), 1e-7));
  }
  // 0 ≤ tan x ≤ (4/π)x on [0, π/4] gives 0 ≤ I_n ≤ π/(8(n+1)) → 0.
  for (let n = 0; n <= 8; n += 1) {
    assert.ok(I(n) >= 0 && I(n) <= Math.PI / (8 * (n + 1)) + 1e-9);
  }
  let alternating = 0;
  for (let m = 1; m <= 400000; m += 1) alternating += (-1) ** m / m;
  assert.ok(close(-alternating, Math.log(2), 1e-5));
});

test("both original figures are registered, self-contained and geometrically consistent", () => {
  const blocks = source.document.majorQuestions.flatMap((major) => major.sections.flatMap((section) => section.blocks));
  assert.equal(source.figureManifest, `frontend/src/data/pastExamFigures/${id}.json`);
  assert.deepEqual(
    blocks.filter((block) => block.type === "figure").map((block) => block.assetId),
    ["ans-q1-geometry", "ans-q1-region"],
  );
  assert.equal(blocks.filter((block) => block.type === "figurePlaceholder").length, 0);
  assert.equal(manifest.contentProvenance, "original_editorial");
  assert.equal(manifest.restrictedSourceCopied, false);
  assert.equal(registry.byId.size, 2);

  for (const item of manifest.items) {
    const svg = read(`public${item.src}`);
    assert.match(svg, new RegExp(`viewBox="0 0 ${item.width} ${item.height}"`));
    assert.match(svg, /role="img"/);
    assert.match(svg, /<title id="title">[^<]+<\/title>/);
    // No traced source art, no remote resources, no scripting.
    assert.doesNotMatch(svg, /<(script|image|foreignObject|use)\b/i);
    assert.doesNotMatch(svg, /data:image\//);
    // The XML namespace is the only permitted http reference; nothing may be fetched.
    assert.deepEqual(svg.match(/https?:\/\/[^"')\s]*/g), ["http://www.w3.org/2000/svg"]);
    // Mathematical labels use the embedded KaTeX faces, exactly two of them.
    assert.equal((svg.match(/data:font\/woff2;base64/g) ?? []).length, 2);
    assert.match(svg, /\.math \.mi\{font-family:'KaTeX_Math'/);
    assert.ok(registry.byId.get(item.id));
    assert.ok(item.alt.length > 20 && item.caption.length > 0);
  }

  // The region figure must draw the true angle between k and l, not a generic rhombus.
  const region = read(`public/assets/past-exams/${id}/figures/ans-q1-region.svg`);
  const points = region.match(/<polygon points="([^"]+)"/)[1]
    .split(" ")
    .map((pair) => pair.split(",").map(Number));
  const [origin, kEnd, , lEnd] = points;
  const kScreen = [kEnd[0] - origin[0], kEnd[1] - origin[1]];
  const lScreen = [lEnd[0] - origin[0], lEnd[1] - origin[1]];
  const lengthRatio = Math.hypot(...lScreen) / Math.hypot(...kScreen);
  // |l| / |k| = 2√3 / 3 and cos∠(k,l) = 3 / (3·2√3).
  assert.ok(close(lengthRatio, Math.sqrt(12) / 3, 1e-3));
  const cosine = (kScreen[0] * lScreen[0] + kScreen[1] * lScreen[1]) / (Math.hypot(...kScreen) * Math.hypot(...lScreen));
  assert.ok(close(cosine, 3 / (3 * Math.sqrt(12)), 1e-3));

  // Exactly one tetrahedron edge (AB) is hidden, so every marked point sits on a solid edge.
  const geometry = read(`public/assets/past-exams/${id}/figures/ans-q1-geometry.svg`);
  assert.equal((geometry.match(/class="hidden-edge"/g) ?? []).length, 1);
});

test("built answers page renders both figures with intrinsic dimensions", () => {
  const html = read(`dist${route}index.html`);
  const images = nodes(parse(html)).filter((node) => node.nodeName === "img" && (attr(node, "src") ?? "").includes(`/${id}/figures/`));
  assert.equal(images.length, 2);
  for (const image of images) {
    const item = manifest.items.find((entry) => attr(image, "src") === entry.src);
    assert.ok(item, `unregistered figure ${attr(image, "src")}`);
    assert.equal(attr(image, "width"), String(item.width));
    assert.equal(attr(image, "height"), String(item.height));
    assert.equal(attr(image, "alt"), item.alt);
  }
  // The mark answers must reach the page, not only the source JSON.
  for (const value of ["3\\sqrt{11}", "256", "-768"]) assert.ok(html.includes(value) || html.includes(value.replace(/\\/g, "&#92;")));
});
