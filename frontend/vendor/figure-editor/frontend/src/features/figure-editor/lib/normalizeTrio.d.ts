import type { PenroseTrio } from "./types";
/**
 * Substance の引用符付き数式ラベルを Penrose 本来の math-label 構文へ戻す。
 *
 * LLM が `Label A "$A_1$"` と出力すると、コンパイル自体は通るものの
 * Equation にはドル記号を含む通常文字列として渡り、画面にも `$A_1$` と
 * 表示される。行全体が `$...$` の引用符付きラベルである場合だけ引用符を
 * 外し、普通の文字列ラベルや Style 内の文字列には触れない。
 */
export declare function normalizeQuotedMathLabels(substance: string): string;
/**
 * Penrose Equation は CJK を含む `\text{...}` を最適化すると NaN になる。
 * 日本語を含む説明ラベルだけを Text + Unicode 記号へ安全に変換し、
 * ASCII/LaTeX の通常数式ラベルは Equation のまま維持する。
 */
export declare function normalizeCjkEquationTextShapes(style: string): string;
/**
 * 旧エディターが Rectangle に誤って保存した Ellipse 用の rx / ry を、
 * Penrose Rectangle が実際に描画へ使う cornerRadius へ移行する。
 * Ellipse やコメント・文字列内の同名フィールドには触れない。
 */
export declare function normalizeLegacyRectangleRoundness(style: string): string;
/**
 * 点列で描かれた楕円を、1 つの Ellipse として読み直す。
 *
 * 生成 AI は曲線を「サンプル点を並べた Polygon / Polyline」で出す（生成プロン
 * プトの許可図形に Ellipse が無く、曲線は点列で描けと指示している）。多角形の
 * ままでは長軸・短軸のガイドも rx / ry ハンドルも出ないので、取り込みの時点で
 * 楕円へ畳んでおく。当てはめ（fitSampledEllipse）は機械が打った標本しか通さない
 * ので、手で置いた多角形・弧・正多角形はここを素通りする。
 *
 * 傾いた楕円は Penrose の Ellipse に回転が無いため、エディタの回転ハンドルと
 * 同じ作法で rotation と SVG の transform を持たせる（どちらも Penrose の
 * passthrough でそのまま SVG 属性になる）。
 */
export declare function normalizeSampledEllipseShapes(style: string): string;
export declare function normalizeTrio(t: PenroseTrio): PenroseTrio;
