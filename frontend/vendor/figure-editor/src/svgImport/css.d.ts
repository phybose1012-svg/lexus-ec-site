import type { XmlElement } from "./xml.js";
export interface CssDeclaration {
    readonly property: string;
    readonly value: string;
    readonly important: boolean;
}
export interface CssCompound {
    /** 型セレクタ（小文字）。`*` と省略は null。 */
    readonly type: string | null;
    readonly classes: readonly string[];
    readonly id: string | null;
}
export interface CssSelector {
    /** 祖先から順に並べた複合セレクタ。最後の要素が対象。 */
    readonly parts: readonly CssCompound[];
    /** parts[i] と parts[i+1] の結合子。`" "`（子孫）または `">"`（子）。 */
    readonly combinators: readonly (" " | ">")[];
    /** (id, class, type) の三つ組。比較は辞書順。 */
    readonly specificity: readonly [number, number, number];
    readonly source: string;
}
export interface CssRule {
    readonly selectors: readonly CssSelector[];
    readonly declarations: readonly CssDeclaration[];
    /** 文書内の出現順。同特異度のとき後勝ちにするため。 */
    readonly order: number;
}
export interface CssStylesheet {
    readonly rules: readonly CssRule[];
    /** 解釈できなかったセレクタ・at 規則（利用者へ「未対応」として見せる）。 */
    readonly unsupported: readonly string[];
}
/** 宣言リスト（`a: b; c: d`）を解く。`style=""` 属性にも使う。 */
export declare function parseDeclarations(text: string): CssDeclaration[];
/**
 * スタイルシートを解く。
 *
 * `@font-face` は**中身ごと捨てる**。KaTeX の base64 フォントが 1 ファイル 58KB
 * 入っており、Trio へ写しても Penrose は使えないうえ、保存容量を食うだけになる
 * （書体の再注入は将来の rendererProfile の担当）。それ以外の at 規則は
 * 解釈できないものとして記録する。
 */
export declare function parseStylesheet(css: string): CssStylesheet;
/**
 * 末尾の複合セレクタから祖先へ向かって照合する。
 * 子孫結合子は「どこかの祖先」なので後戻りが要る。深さは実物で 3 段程度、
 * 上限（xml.ts の maxDepth）も 64 段なので素朴な再帰で足りる。
 */
export declare function selectorMatches(element: XmlElement, selector: CssSelector): boolean;
export interface MatchedDeclaration extends CssDeclaration {
    readonly specificity: readonly [number, number, number];
    readonly order: number;
}
/** 要素に効く宣言を、弱い順に並べて返す（後ろが強い）。 */
export declare function cascadeFor(element: XmlElement, stylesheet: CssStylesheet): MatchedDeclaration[];
