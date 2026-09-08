/**
 * 公開アセットとして置けない SVG か。置けないなら理由を返す。
 *
 * **完全な無害化ではない。** 断るための検査であって、通ったものが安全だと
 * 言っているわけではない。ここへ来る SVG は図形エディタの書き出しなので、
 * 下のどれかが入っていること自体が異常であり、その時点で止めれば足りる。
 *
 * 落とすのではなく断るのは、直したはずの図が黙って変わるのを避けるため。
 *
 * 書き戻し口はローカルの管理 API（scripts/admin-local-api.mjs）と
 * ステージングの Pages Function（functions/admin/api/past-exam-figures.ts）の
 * 2 つある。**同じ答えでなければ意味がない**ので 1 箇所に置いてある。
 */
const CHECKS = [
  [/<\s*script\b/i, "<script>"],
  [/<\s*foreignObject\b/i, "<foreignObject>"],
  [/<\s*(iframe|embed|object|audio|video)\b/i, "外部を読む要素"],
  [/\son[a-z]+\s*=/i, "on... のイベント属性"],
  [/javascript\s*:/i, "javascript: の参照"],
  [/<!ENTITY/i, "実体宣言"],
];

export function unsafeSvgReason(svg) {
  const source = String(svg);
  for (const [pattern, label] of CHECKS) {
    if (pattern.test(source)) return label;
  }

  // 外部を読みにいく参照。data:image と同じ文書の中の #id だけ通す。
  const references = source.match(/(?:\bhref|xlink:href|\bsrc)\s*=\s*"([^"]*)"/gi) ?? [];
  for (const reference of references) {
    const value = reference.slice(reference.indexOf('"') + 1, -1).trim();
    if (value.startsWith("#") || value.startsWith("data:image/")) continue;
    return `外部の参照 ${value.slice(0, 60)}`;
  }

  return null;
}
