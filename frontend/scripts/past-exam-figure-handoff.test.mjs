// 手で直した図版を守る仕掛けの検査。
//
// 見るのは3つ:
//  - SVG の寸法の読み方（manifest との突き合わせも生成スクリプトもこれを使う）
//  - 控えがある図を生成スクリプトが上書きしないこと
//  - manifest と実ファイルの寸法がずれたら loadFigureManifest が鳴ること
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

import { readSvgSize } from "../src/lib/svgSize.mjs";
import { loadFigureManifest } from "../src/lib/pastExamFigures.mjs";
import { createFigureHandoff, handEditedTrioPath, figureSvgPath } from "./lib/past-exam-figure-handoff.mjs";

const PACKAGE_ID = "test-package-2025-mathematics";
const FIGURE_ID = "q1-sample";

const svgOf = (width, height, extra = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" ${extra}><line x1="0" y1="0" x2="1" y2="1"/></svg>`;

/** frontend と同じ形の一時ディレクトリを作る。scripts/ から見た相対で使う。 */
function makeTree({ svg = svgOf(640, 480), trio = null, manifestSize = null } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "figure-handoff-"));
  fs.mkdirSync(path.join(root, "scripts"), { recursive: true });

  if (svg !== null) {
    const svgPath = figureSvgPath(root, PACKAGE_ID, FIGURE_ID);
    fs.mkdirSync(path.dirname(svgPath), { recursive: true });
    fs.writeFileSync(svgPath, svg);
  }
  if (trio !== null) {
    const trioPath = handEditedTrioPath(root, PACKAGE_ID, FIGURE_ID);
    fs.mkdirSync(path.dirname(trioPath), { recursive: true });
    fs.writeFileSync(trioPath, JSON.stringify(trio, null, 2));
  }

  const size = manifestSize ?? { width: 640, height: 480 };
  const manifest = {
    schemaVersion: "lexus-past-exam-figures.v1",
    packageId: PACKAGE_ID,
    contentProvenance: "original_editorial",
    restrictedSourceCopied: false,
    review: { needsHumanReview: true, notes: "検査用" },
    items: [
      {
        id: FIGURE_ID,
        width: size.width,
        height: size.height,
        alt: "検査用の図",
        caption: "検査用の図",
        src: `/assets/past-exams/${PACKAGE_ID}/figures/${FIGURE_ID}.svg`,
      },
    ],
  };
  const manifestPath = path.join(root, "src", "data", "pastExamFigures", `${PACKAGE_ID}.json`);
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  return {
    root,
    manifestPath,
    publicRoot: path.join(root, "public"),
    // 生成スクリプトは scripts/ に居るので、そこからの import.meta.url を模す。
    metaUrl: pathToFileURL(path.join(root, "scripts", "build-figures.mjs")).href,
    cleanup: () => fs.rmSync(root, { recursive: true, force: true }),
  };
}

test("readSvgSize: width/height 属性を読む", () => {
  assert.deepEqual(readSvgSize(svgOf(760, 500)), { width: 760, height: 500 });
});

test("readSvgSize: 属性が無ければ viewBox から取る", () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240"></svg>';
  assert.deepEqual(readSvgSize(svg), { width: 320, height: 240 });
});

test("readSvgSize: 単位付きでも数値を取り、小数は丸める", () => {
  const svg = '<svg width="640.4px" height="480.6px" viewBox="0 0 640 480"></svg>';
  assert.deepEqual(readSvgSize(svg), { width: 640, height: 481 });
});

test("readSvgSize: 読めないものは null", () => {
  assert.equal(readSvgSize("hello"), null);
  assert.equal(readSvgSize("<svg></svg>"), null);
  assert.equal(readSvgSize('<svg width="0" height="10"></svg>'), null);
});

// 書く側と検査する側が同じ関数なので、ここが間違うと両方同じ嘘をつく。
test("readSvgSize: stroke-width や data-width には当たらない", () => {
  assert.deepEqual(readSvgSize('<svg stroke-width="2" width="470" height="370"></svg>'), {
    width: 470,
    height: 370,
  });
  assert.deepEqual(readSvgSize('<svg data-width="9" width="470" height="370"></svg>'), {
    width: 470,
    height: 370,
  });
});

test("readSvgSize: px でない単位は読めなかったことにして viewBox へ落とす", () => {
  const mm = '<svg width="124.35mm" height="97.9mm" viewBox="0 0 470 370"></svg>';
  assert.deepEqual(readSvgSize(mm), { width: 470, height: 370 });
  const percent = '<svg width="100%" height="100%" viewBox="0 0 470 370"></svg>';
  assert.deepEqual(readSvgSize(percent), { width: 470, height: 370 });
  // 落とす先が無ければ、黙って px 扱いにせず読めないと答える。
  assert.equal(readSvgSize('<svg width="100%" height="100%"></svg>'), null);
});

test("控えが無ければ、生成スクリプトはこれまでどおり書く", () => {
  const tree = makeTree();
  try {
    const handoff = createFigureHandoff(PACKAGE_ID, tree.metaUrl);
    assert.equal(handoff.keep(FIGURE_ID), null);
  } finally {
    tree.cleanup();
  }
});

test("控えがあれば上書きせず、寸法は現物の SVG から取る", () => {
  const tree = makeTree({
    svg: svgOf(700, 520),
    trio: { schemaVersion: "lexus-past-exam-figure-trio.v1", trio: { domain: "", substance: "", style: "" } },
  });
  try {
    const handoff = createFigureHandoff(PACKAGE_ID, tree.metaUrl);
    // 生成スクリプトが 640x480 のつもりでも、現物の 700x520 が返る。
    assert.deepEqual(handoff.keep(FIGURE_ID), { width: 700, height: 520 });
  } finally {
    tree.cleanup();
  }
});

test("控えだけあって SVG が無いときは、黙って作り直さず止まる", () => {
  const tree = makeTree({
    svg: null,
    trio: { schemaVersion: "lexus-past-exam-figure-trio.v1", trio: { domain: "", substance: "", style: "" } },
  });
  try {
    const handoff = createFigureHandoff(PACKAGE_ID, tree.metaUrl);
    assert.throws(() => handoff.keep(FIGURE_ID), /控え/);
  } finally {
    tree.cleanup();
  }
});

test("manifest と実ファイルの寸法が合っていれば読める", () => {
  const tree = makeTree({ svg: svgOf(640, 480), manifestSize: { width: 640, height: 480 } });
  try {
    const manifest = loadFigureManifest(tree.manifestPath, tree.publicRoot, PACKAGE_ID);
    assert.equal(manifest.byId.get(FIGURE_ID).width, 640);
  } finally {
    tree.cleanup();
  }
});

test("寸法がずれていたら loadFigureManifest が止める", () => {
  const tree = makeTree({ svg: svgOf(640, 480), manifestSize: { width: 640, height: 479 } });
  try {
    assert.throws(
      () => loadFigureManifest(tree.manifestPath, tree.publicRoot, PACKAGE_ID),
      /Figure size mismatch/
    );
  } finally {
    tree.cleanup();
  }
});
