import type { Point2D } from "./shapeBuilders";
export interface SplittableShape {
    path: string;
    /** 折れ線近似した形状。曲線は十分細かくサンプリングされている前提。 */
    points: Point2D[];
    /** 曲線のとき、points と同数のパラメータ列 (分割位置の復元に要る)。 */
    sourceParameters?: number[];
}
export interface SplitPosition {
    point: Point2D;
    /** 形状全体を 0..1 で見たときの位置 (累積長基準)。 */
    tNorm: number;
    sourceParameter?: number;
    /** カーソルからの距離 (Penrose 単位)。 */
    distance: number;
}
export interface SplitCandidate extends SplitPosition {
    path: string;
    /** 交点・接点へ吸い付いているか。UI の赤/緑の切り替えに使う。 */
    snapped: boolean;
}
export interface SplitCandidateRadii {
    /** この距離までカーソルが近づいた形状を候補にする。 */
    hover: number;
    /** 交点がこの距離内にあれば、そこへ吸い付く。 */
    snap: number;
}
/** 点列上で target に最も近い位置。 */
export declare function projectPointOntoPolyline(points: readonly Point2D[], target: Point2D, sourceParameters?: readonly number[]): SplitPosition | null;
/** 対象形状の上にある「意味のある位置」= 他の形状との交点・接点。 */
export declare function collectSnapPositions(target: SplittableShape, others: readonly SplittableShape[]): SplitPosition[];
/** 端点に寄りすぎていないか (分割して意味がある位置か)。 */
export declare function isSplittablePosition(tNorm: number): boolean;
/**
 * カーソル位置に対する分割候補。
 *
 * snapPositionsFor は対象形状ごとの交点を返す関数。交点計算は形状の組み合わせ
 * ぶん重いので、呼び出し側でキャッシュできるよう外から渡す。
 */
export declare function chooseSplitCandidate(shapes: readonly SplittableShape[], cursor: Point2D, radii: SplitCandidateRadii, snapPositionsFor: (path: string) => readonly SplitPosition[]): SplitCandidate | null;
