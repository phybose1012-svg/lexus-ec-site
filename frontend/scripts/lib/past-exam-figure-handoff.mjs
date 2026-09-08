/**
 * 手で直した図版を、生成スクリプトから守る。
 *
 * 図版 SVG は build-*-figures.mjs の出力だが、管理ページ（/admin/figures/edit）
 * から手で直すこともできる。生成スクリプトは無条件に上書きするので、放って
 * おけば直した内容は次にそれを流した瞬間に消える。
 *
 * そこで、手で保存したときに trio の控え
 * `src/data/pastExamFigures/<packageId>/<figureId>.trio.json` を残す。
 * この控えがある図は「もう手が正本」と見なし、生成スクリプトは SVG を
 * 書かない。manifest の寸法だけは現物の SVG から取り直す。
 *
 * **生成スクリプトへ戻したくなったら、控えを消すだけでよい。** 次に流したとき
 * から、また計算した図が書かれる。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readSvgSize } from "../../src/lib/svgSize.mjs";

export function handEditedTrioPath(frontendRoot, packageId, figureId) {
  return path.join(frontendRoot, "src", "data", "pastExamFigures", packageId, `${figureId}.trio.json`);
}

export function figureSvgPath(frontendRoot, packageId, figureId) {
  return path.join(frontendRoot, "public", "assets", "past-exams", packageId, "figures", `${figureId}.svg`);
}

/**
 * 生成スクリプト用。`import.meta.url` を渡すと、その scripts/ から見た
 * frontend を起点に判定する。
 */
export function createFigureHandoff(packageId, metaUrl) {
  const frontendRoot = fileURLToPath(new URL("..", metaUrl));
  const kept = [];

  return {
    /**
     * 手が正本なら現物の寸法を返す。生成スクリプトが正本なら null。
     *
     * 控えがあるのに SVG が無いときは投げる。黙って生成し直すと、直した図が
     * 消えたことに気づけないまま manifest だけ整ってしまう。
     */
    keep(figureId) {
      const trioPath = handEditedTrioPath(frontendRoot, packageId, figureId);
      if (!fs.existsSync(trioPath)) return null;

      const svgPath = figureSvgPath(frontendRoot, packageId, figureId);
      if (!fs.existsSync(svgPath)) {
        throw new Error(
          `手で直した控えはあるのに SVG がありません: ${figureId}\n` +
            `  控え: ${path.relative(frontendRoot, trioPath).replaceAll("\\", "/")}\n` +
            `  生成し直すなら、先に控えを消してください。`
        );
      }

      const size = readSvgSize(fs.readFileSync(svgPath, "utf8"));
      if (!size) throw new Error(`手で直した SVG の寸法が読めません: ${figureId}`);

      kept.push(figureId);
      return size;
    },

    /** 何を書かなかったかを残す。黙って飛ばすと、直らない図として報告される。 */
    report() {
      if (kept.length === 0) return;
      console.log(`手で直した図なので上書きしませんでした (${kept.length}): ${kept.join(", ")}`);
    },
  };
}
