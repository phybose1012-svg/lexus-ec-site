import type { PenroseTrio } from "../types.js";
import type { ImportWarning, ImportedDocument } from "./model.js";
import { type MeasureText } from "./text.js";
export interface TrioObjectMapping {
    /** Penrose のパス（`name.shape`）。 */
    readonly path: string;
    /** 元 SVG の ID（data-edit-id / id / title / 導出）。 */
    readonly sourceId: string;
    readonly sourceTag: string;
    readonly sourceLocation: string;
    readonly shapeType: string;
    /** ラベルなら元の文字列。 */
    readonly label: string | null;
}
/** 仕上げ（refine.ts）で位置を合わせ直すための、ラベル 1 組ぶんの意図。 */
export interface LabelPlacement {
    /** 同じ `<text>` から出たラベルのパス（左から順）。 */
    readonly paths: readonly string[];
    /** ラベル全体の左端から見た、各断片の左端までの距離（Penrose の長さ）。 */
    readonly offsets: readonly number[];
    /** 元 SVG での各断片の送り幅（Penrose の長さ）。寄せ直しの基準。 */
    readonly sourceAdvances: readonly number[];
    /** 断片ごとの Penrose 図形種別。Text は送り幅がそのまま使える。 */
    readonly shapeTypes: readonly string[];
    /** 元 SVG の寄せ方。 */
    readonly textAnchor: "start" | "middle" | "end";
    /** 外接矩形の左端（Penrose x）。 */
    readonly left: number;
    /** ベースライン（Penrose y）。 */
    readonly baselineY: number;
}
export interface BuildTrioOptions {
    readonly measure?: MeasureText;
    /** 取り込み時に付ける variation。既定は内容に依らない固定値。 */
    readonly variation?: string;
}
export interface BuildTrioResult {
    readonly trio: PenroseTrio;
    readonly mapping: readonly TrioObjectMapping[];
    readonly warnings: readonly ImportWarning[];
    readonly labelPlacements: readonly LabelPlacement[];
    readonly canvas: {
        readonly width: number;
        readonly height: number;
        readonly scale: number;
    };
}
export declare const SVG_IMPORT_VARIATION = "fibona-svg-import";
/** SVG 座標 → Penrose 座標。 */
interface Frame {
    readonly width: number;
    readonly height: number;
    readonly scale: number;
}
/** キャンバス寸法を Penrose の許容範囲へ収める。必要なら全体を等倍で縮める。 */
export declare function fitCanvas(width: number, height: number): Frame;
export declare function buildTrio(document: ImportedDocument, options?: BuildTrioOptions): BuildTrioResult;
export {};
