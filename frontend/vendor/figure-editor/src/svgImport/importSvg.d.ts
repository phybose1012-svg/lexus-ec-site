import type { PenroseTrio } from "../types.js";
import { SvgImportRejection, type SvgImportLimits } from "./limits.js";
import type { ImportWarning, UnsupportedElement } from "./model.js";
import { type CompileTrio } from "./refine.js";
import type { MeasureText } from "./text.js";
import { type TrioObjectMapping } from "./toTrio.js";
export interface SvgImportOptions {
    /** 上限の上書き（既定は DEFAULT_SVG_IMPORT_LIMITS）。 */
    readonly limits?: Partial<SvgImportLimits>;
    /**
     * 文字の実寸を測る手段。ブラウザ・Node のどちらでも
     * `@penrose/core` の `measureText` を渡すのが正解（Penrose 自身と同じ
     * 測り方になるので、ずれが最小になる）。省略すると粗い推定を使う。
     */
    readonly measure?: MeasureText;
    /**
     * 1 回組んでラベルの位置を実測で合わせ直すための手段。
     * 渡すと数式ラベルの位置がずれなくなる。省略すると推定のまま。
     */
    readonly compile?: CompileTrio;
    /** trio に入れる variation。 */
    readonly variation?: string;
    /** SHA-256 の計算手段。省略時は WebCrypto を使う。 */
    readonly digest?: (source: string) => Promise<string>;
}
export type SvgImportStatus = "complete" | "partial";
export interface SvgImportVerification {
    /** 生成した trio のキャンバス（`0 0 W H`）。 */
    readonly viewBox: string;
    /** 元 SVG の見え方（`minX minY W H`）。 */
    readonly sourceViewBox: string;
    /** 元 SVG に対する縮尺（1 なら等倍）。 */
    readonly scale: number;
    /** Penrose 図形の種類ごとの個数。 */
    readonly shapeCounts: Readonly<Record<string, number>>;
    /** 取り込んだラベルの文字列（欠落の確認用）。 */
    readonly labelTexts: readonly string[];
    /** 実測で位置を直したラベルの数。 */
    readonly refinedLabels: number;
}
export interface SvgImportResult {
    /** 見た目に影響する未対応が 1 つも無ければ complete。 */
    readonly status: SvgImportStatus;
    readonly trio: PenroseTrio;
    readonly width: number;
    readonly height: number;
    readonly viewBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    } | null;
    /** 元 SVG の SHA-256（16 進小文字）。 */
    readonly sourceSha256: string;
    /** 変換した元 SVG 要素の数。 */
    readonly convertedElementCount: number;
    /** 生成した Penrose オブジェクトの数。 */
    readonly objectCount: number;
    readonly warnings: readonly ImportWarning[];
    readonly unsupported: readonly UnsupportedElement[];
    /** 元 SVG 要素 ↔ Penrose オブジェクトの対応表。 */
    readonly mapping: readonly TrioObjectMapping[];
    readonly verification: SvgImportVerification;
}
/**
 * SVG 文字列を、図形エディタでそのまま編集できる Penrose Trio へ変換する。
 *
 * 危険な内容・上限超え・SVG として読めないものは `SvgImportRejection` を投げる。
 * 「読めたが一部が未対応」は例外にせず、`status: "partial"` と
 * `unsupported` / `warnings` で返す（何が落ちたかを利用者に見せるため）。
 */
export declare function importSvgToPenroseTrio(svgSource: string, options?: SvgImportOptions): Promise<SvgImportResult>;
export { SvgImportRejection };
