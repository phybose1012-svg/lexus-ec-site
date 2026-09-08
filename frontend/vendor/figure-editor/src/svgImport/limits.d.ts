/** 取り込みの上限。すべて「超えたら中止」で、黙って切り詰めない。 */
export interface SvgImportLimits {
    /** 入力 SVG の UTF-16 コード単位数。KaTeX の base64 フォントを含む実物が 72KB。 */
    maxSourceLength: number;
    /** 要素の総数（style / defs の中身も数える）。 */
    maxElements: number;
    /** 要素の入れ子の深さ。 */
    maxDepth: number;
    /** 1 つの d 属性に含められるコマンド数。 */
    maxPathCommands: number;
    /** 1 つの図形が持てる点の数（polyline / polygon）。 */
    maxPoints: number;
    /** 座標・長さの絶対値。これを超える数は「壊れた入力」として扱う。 */
    maxCoordinate: number;
    /** 生成する Penrose オブジェクトの数。 */
    maxObjects: number;
    /** style 要素の中身の長さ合計（@font-face の base64 を含む）。 */
    maxStyleLength: number;
}
export declare const DEFAULT_SVG_IMPORT_LIMITS: Readonly<SvgImportLimits>;
/**
 * 取り込みを中止する理由。
 *
 * `security` は「危険なので読まない」、`limit` は「大きすぎるので読まない」、
 * `malformed` は「SVG として読めない」。利用者への説明文が変わるので分けてある。
 */
export type SvgRejectionKind = "security" | "limit" | "malformed";
export declare class SvgImportRejection extends Error {
    readonly kind: SvgRejectionKind;
    /** 機械可読な識別子（テストと UI の分岐用）。 */
    readonly code: string;
    /** 入力 SVG 内の 0 始まり文字位置。分からなければ -1。 */
    readonly index: number;
    constructor(kind: SvgRejectionKind, code: string, message: string, index?: number);
}
export declare function reject(kind: SvgRejectionKind, code: string, message: string, index?: number): never;
