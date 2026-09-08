/**
 * 公開アセットとして置けない SVG か。置けないなら理由を返す。
 *
 * **完全な無害化ではない。** 断るための検査であって、通ったものが安全だと
 * 言っているわけではない。ここへ来る SVG は図形エディタの書き出しなので、
 * 下のどれかが入っていること自体が異常であり、その時点で止めれば足りる。
 * 落とすのではなく断るのは、直したはずの図が黙って変わるのを避けるため。
 *
 * **接頭辞を無視して名前で見る。** XML では要素は「名前空間 + 名前」で決まり、
 * 接頭辞は書き手が好きに付けられる。`<script>` だけを見ていたら
 * `<x:script xmlns:x="http://www.w3.org/2000/svg">` が素通りし、置いた SVG を
 * 直接開くとサイトのオリジンで JS が動いた（実測）。同じ理由で属性も、
 * 引用符もどちらでも拾う。
 *
 * これに加えて `public/_headers` が /assets/past-exams/ 配下へ
 * `Content-Security-Policy: default-src 'none'` を付けている。ここを抜けた
 * ものがあっても、ブラウザ側でもう一度止まる。
 *
 * 書き戻し口はローカルの管理 API（scripts/admin-local-api.mjs）と
 * ステージングの Pages Function（functions/admin/api/past-exam-figures.ts）の
 * 2 つある。**同じ答えでなければ意味がない**ので 1 箇所に置いてある。
 */

/** 名前空間の接頭辞（`x:` など）を挟んでもよい形にする。 */
const tag = (names) => new RegExp(`<\\s*(?:[A-Za-z_][\\w.-]*:)?(?:${names})\\b`, "i");

const CHECKS = [
  [tag("script"), "script 要素"],
  [tag("foreignObject"), "foreignObject 要素"],
  [tag("iframe|embed|object|audio|video"), "外部を読む要素"],
  [tag("animate|animateTransform|animateMotion|set|handler"), "動かす要素"],
  // on... のイベント属性。接頭辞付き（ev:onload など）も拾う。
  [/[\s"'](?:[A-Za-z_][\w.-]*:)?on[a-z]+\s*=/i, "on... のイベント属性"],
  [/javascript\s*:/i, "javascript: の参照"],
  [/<!ENTITY/i, "実体宣言"],
  [/@import\b/i, "スタイルの @import"],
];

/** 同じ文書の中（#id）か、埋め込んだ画像・フォントだけ通す。 */
const isLocalReference = (value) => {
  const target = value.trim();
  return target.startsWith("#") || target.startsWith("data:image/") || target.startsWith("data:font/");
};

export function unsafeSvgReason(svg) {
  const source = String(svg);

  for (const [pattern, label] of CHECKS) {
    if (pattern.test(source)) return label;
  }

  // 外部を読みにいく参照。属性は引用符がどちらでもよく、接頭辞も付きうる。
  const attributes = source.matchAll(
    /(?:[A-Za-z_][\w.-]*:)?(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi,
  );
  for (const found of attributes) {
    const value = found[1] ?? found[2] ?? "";
    if (!isLocalReference(value)) return `外部の参照 ${value.trim().slice(0, 60)}`;
  }

  // スタイルの中の url()。埋め込んだフォントは通すが、外を読むものは断る。
  const urls = source.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)\s]*))\s*\)/gi);
  for (const found of urls) {
    const value = found[1] ?? found[2] ?? found[3] ?? "";
    if (!isLocalReference(value)) return `スタイルからの外部参照 ${value.trim().slice(0, 60)}`;
  }

  return null;
}
