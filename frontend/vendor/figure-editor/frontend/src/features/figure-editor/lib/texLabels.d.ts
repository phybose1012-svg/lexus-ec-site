import type { PenroseTrio } from "./types";
/** `$...$` のような数式の囲みを外す。囲みが無ければそのまま返す。 */
export declare function unwrapMathDelimiters(text: string): string;
/**
 * TeX として組むべき文字列か。
 *
 * 誤って組み直すと平文が斜体になるので、TeX でしか意味を持たない書き方が
 * ある場合だけ true にする。単位付きの寸法 (`9 cm`) や点の名前 (`P(2, 3)`)
 * は Text のままが正しい。
 */
export declare function looksLikeTex(text: string): boolean;
/** 日本語 (かな・漢字・全角) を含むか。 */
export declare function containsJapanese(text: string): boolean;
export declare function escapeTexPlainText(text: string): string;
/**
 * ラベルの文字列と、それを数式として組むべきかの判断。
 *
 * 日本語を含むものだけ Text (立体)、それ以外はすべて Equation にする。
 * 理由は 2 つ:
 *   * x・y・P・θ のような記号ラベルが立体で出ると、1 つずつ数式へ直す手間が
 *     利用者に残る。数式で出しておけば、ラベルの「立体」ボタンで戻せる。
 *   * MathJax は和文の字形を持たないので、日本語だけは Text のままにする。
 *
 * TeX として書かれていない平文はそのまま組むと特殊文字が食われるので、
 * 打ち消してから渡す。
 */
export declare function labelTypesetting(text: string, math?: boolean): {
    math: boolean;
    text: string;
};
/**
 * 全体がちょうど 1 つの `\mathrm{...}` なら、その中身。そうでなければ null。
 *
 * `\mathrm{AB}_{12}` や `\mathrm{A}+\mathrm{B}` は「包まれていない」と読む。
 */
export declare function uprightLabelBody(latex: string): string | null;
/** ラベルがまるごと立体（`\mathrm{...}`）になっているか。 */
export declare function isUprightLabel(latex: string): boolean;
/**
 * 斜体 ⇔ 立体 を 1 回切り替える。
 *
 * 何度押しても中身が増えたり減ったりしないこと（往復で元に戻ること）が要件。
 * 包むのは波括弧の対応が取れているときだけにする。もともと壊れている TeX を
 * さらに包むと、直しようのない形へ進んでしまう。
 */
export declare function toggleUprightLabel(latex: string): string;
export interface TexLabelRepair {
    trio: PenroseTrio;
    /** Text から Equation へ組み直したパス。 */
    converted: string[];
    /** `$...$` の囲みだけ外したパス。 */
    unwrapped: string[];
    /** 直したいが共有テンプレート由来で触れなかったパス。 */
    skipped: string[];
}
/**
 * 図の中のラベルを見て回り、TeX がむき出しのものを数式として組み直す。
 *
 * paths を渡すとその範囲だけを見る (選択中のオブジェクトだけ直したいとき)。
 */
export declare function repairTexLabels(trio: PenroseTrio, paths?: readonly string[]): TexLabelRepair;
