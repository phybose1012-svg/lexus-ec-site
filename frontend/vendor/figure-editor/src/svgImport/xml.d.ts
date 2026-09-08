import { type SvgImportLimits } from "./limits.js";
export interface XmlAttribute {
    /** 属性名（`xlink:href` のように前置き付きのまま）。 */
    readonly name: string;
    /** 前置きを落とした名前（小文字化しない。SVG の属性は大小を区別する）。 */
    readonly local: string;
    /** 名前空間の前置き（無ければ空文字）。 */
    readonly prefix: string;
    readonly value: string;
    /** 入力内の 0 始まり文字位置（属性名の先頭）。 */
    readonly index: number;
}
/**
 * 直下の中身を「出てきた順」で持つ。`<text>A<tspan>B</tspan>C</text>` の
 * A / tspan / C の並びは、文字の並びそのものなので順序を落とせない。
 */
export type XmlContent = {
    readonly type: "text";
    readonly value: string;
} | {
    readonly type: "element";
    readonly element: XmlElement;
};
export interface XmlElement {
    /** タグ名（前置き付きのまま）。 */
    readonly name: string;
    /** 前置きを落として小文字化したタグ名。要素の判別はこちらを使う。 */
    readonly local: string;
    readonly prefix: string;
    readonly attributes: readonly XmlAttribute[];
    readonly children: XmlElement[];
    /** 直下のテキストと子要素を、出てきた順に並べたもの。 */
    readonly content: XmlContent[];
    /** 直下のテキスト（子要素の中身は含まない）。 */
    text: string;
    readonly parent: XmlElement | null;
    /** 入力内の 0 始まり文字位置（開始タグの `<`）。 */
    readonly index: number;
    /** 根から数えた深さ（根が 0）。 */
    readonly depth: number;
    /** 文書順の通し番号（根が 0）。安定 ID の材料に使う。 */
    readonly order: number;
}
export declare function attributeValue(element: XmlElement, local: string): string | null;
/** 子孫を文書順に列挙する（自分自身は含まない）。 */
export declare function descendants(element: XmlElement): Generator<XmlElement>;
/** 要素とその子孫のテキストを連結する。 */
export declare function textContent(element: XmlElement): string;
export interface XmlParseResult {
    readonly root: XmlElement;
    /** 文書順の全要素（根を含む）。 */
    readonly all: readonly XmlElement[];
}
/**
 * SVG 文字列を要素ツリーへ変換する。
 *
 * DTD（`<!DOCTYPE`）は種類を問わず拒否する。外部実体の読み込みが本体だが、
 * 内部サブセットだけでも実体展開爆弾を書けるため、内部・外部を区別しない。
 */
export declare function parseXml(source: string, limits?: SvgImportLimits): XmlParseResult;
