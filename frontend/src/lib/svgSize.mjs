/**
 * SVG の表示寸法を読む。
 *
 * width / height 属性を優先し、無ければ viewBox の 3・4 番目を使う。単位付き
 * （`760px`）は数値部分だけを取る。読めなければ null を返す。
 *
 * 図版の manifest と実ファイルの突き合わせ（src/lib/pastExamFigures.mjs）、
 * 生成スクリプトの引き継ぎ判定、ローカル管理 API の書き戻しで同じ答えが要る
 * ので、1 箇所に置いてある。別々に書くと、片方だけ丸め方が変わる。
 */
const attribute = (openTag, name) => {
  const found = openTag.match(new RegExp(String.raw`\b` + name + String.raw`\s*=\s*"([^"]*)"`, "i"));
  return found ? Number.parseFloat(found[1]) : Number.NaN;
};

export function readSvgSize(svg) {
  const open = String(svg).match(/<svg\b[^>]*>/i);
  if (!open) return null;

  let width = attribute(open[0], "width");
  let height = attribute(open[0], "height");

  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    const viewBox = open[0].match(/\bviewBox\s*=\s*"([^"]*)"/i);
    if (!viewBox) return null;
    const parts = viewBox[1].trim().split(/[\s,]+/).map(Number);
    if (parts.length !== 4 || parts.some((value) => !Number.isFinite(value))) return null;
    width = parts[2];
    height = parts[3];
  }

  if (!(width > 0) || !(height > 0)) return null;
  return { width: Math.round(width), height: Math.round(height) };
}
