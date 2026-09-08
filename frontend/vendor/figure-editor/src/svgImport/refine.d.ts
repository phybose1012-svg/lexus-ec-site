import type { PenroseTrio } from "../types.js";
import type { LabelPlacement } from "./toTrio.js";
/** trio を組んで SVG 文字列にする手段。ブラウザと CLI で実装が違う。 */
export type CompileTrio = (trio: PenroseTrio) => Promise<string | null>;
interface RenderedLabel {
    readonly width: number;
    readonly ascent: number;
    readonly descent: number;
}
/** 組み上がった SVG から、ラベルごとの実寸を読む。 */
export declare function readRenderedLabels(svg: string): Map<string, RenderedLabel>;
/**
 * 生成済み Style の中の `center:` を 1 行だけ差し替える。
 *
 * 対象の Style はこの取り込みが組み立てたものなので、ブロックの形は既知
 * （`forall UserShape \`name\` { ... }`・1 プロパティ 1 行）。よそから来た
 * Style を編集する用途には使わないこと。
 */
export declare function replaceCenter(style: string, name: string, x: number, y: number): string;
export interface RefineResult {
    readonly trio: PenroseTrio;
    /** 位置を直したラベルの数。 */
    readonly adjusted: number;
    /** 実寸を読めなかったラベルのパス。 */
    readonly unmeasured: readonly string[];
}
/**
 * 1 回組んで、ラベルを元 SVG のベースライン・左端へ合わせ直す。
 *
 * `compile` が null を返した（＝組めなかった）ときは、位置を直さずそのまま返す。
 * 取り込み自体は成功させ、warnings で知らせるのは呼び出し側の仕事。
 */
export declare function refineLabelPlacement(trio: PenroseTrio, placements: readonly LabelPlacement[], compile: CompileTrio): Promise<RefineResult>;
export {};
