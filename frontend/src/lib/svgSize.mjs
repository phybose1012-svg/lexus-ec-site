/**
 * SVG の表示寸法を読む。
 *
 * width / height 属性を優先し、読めなければ viewBox の 3・4 番目を使う。
 * どちらも読めなければ null。
 *
 * 図版の manifest と実ファイルの突き合わせ（src/lib/pastExamFigures.mjs）、
 * 生成スクリプトの引き継ぎ判定、ローカル管理 API の書き戻しで同じ答えが要る
 * ので、1 箇所に置いてある。別々に書くと、片方だけ丸め方が変わる。
 *
 * **書く側と検査する側が同じ関数なので、ここが間違うと誰も鳴らない。**
 * 実際に2つ踏んだ:
 *  - `\bwidth` は `stroke-width="2"` にも当たる（ハイフンの後ろは語境界）。
 *    root に stroke-width がある図で manifest が 2px になり、両側が同じ値を
 *    出すので突き合わせも素通りした。属性名の直前を見て弾く。
 *  - `parseFloat` は `124.35mm` や `100%` から数字だけ取る。px でない単位は
 *    「読めなかった」ことにして viewBox へ落とす。黙って px 扱いにしない。
 */

/** 素の数値か px だけを受ける。%・mm・em などは読めなかったことにする。 */
const PX_ONLY = /^\s*([0-9]*\.?[0-9]+)(?:px)?\s*$/i;

const attribute = (openTag, name) => {
  // 直前がハイフンや英数字なら別の属性（stroke-width / data-width など）。
  const pattern = new RegExp(String.raw`(?<![-\w])` + name + String.raw`\s*=\s*"([^"]*)"`, "i");
  const found = openTag.match(pattern);
  if (!found) return Number.NaN;
  const value = found[1].match(PX_ONLY);
  return value ? Number.parseFloat(value[1]) : Number.NaN;
};

export function readSvgSize(svg) {
  const open = String(svg).match(/<svg\b[^>]*>/i);
  if (!open) return null;

  let width = attribute(open[0], "width");
  let height = attribute(open[0], "height");

  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    const viewBox = open[0].match(/(?<![-\w])viewBox\s*=\s*"([^"]*)"/i);
    if (!viewBox) return null;
    const parts = viewBox[1].trim().split(/[\s,]+/).map(Number);
    if (parts.length !== 4 || parts.some((value) => !Number.isFinite(value))) return null;
    width = parts[2];
    height = parts[3];
  }

  if (!(width > 0) || !(height > 0)) return null;
  return { width: Math.round(width), height: Math.round(height) };
}
