import type { Point2D } from "./shapeBuilders";
import type { PenroseTrio } from "./types";
/**
 * ユーザーに見せる閉領域の候補の上限。何十個も並べても選べないので、
 * 面積の小さい順にこれだけ残して切る。
 */
export declare const MAX_REGION_CANDIDATES = 6;
/** 塗れる閉領域 1 つぶん。面積は提示順（小さい順）を決めるのに使う。 */
export interface RegionCandidate {
    points: Point2D[];
    closed: true;
    area: number;
}
export interface RegionTolerances {
    /** 端点がぴったり合っている図形だけを閉じる、厳しい方の許容量。 */
    strict: number;
    /** 厳しい方で閉じられなかったときだけ使う、隙間をまたぐ許容量。 */
    bridge: number;
}
export declare function resolveRegionTolerances(canvas: {
    width: number;
    height: number;
} | null): RegionTolerances;
/**
 * Split selected boundaries at mutual intersections, build a small planar
 * multigraph, and collect every closed cycle that uses all of the selection,
 * smallest area first.
 */
export declare function buildClosedBoundaryCandidates(polylines: Point2D[][], mergeTol?: number, limit?: number): RegionCandidate[];
/** 候補のうち最小面積の 1 つだけを返す従来の入口。 */
export declare function buildClosedBoundaryFromPolylines(polylines: Point2D[][], mergeTol?: number): {
    points: Point2D[];
    closed: true;
} | null;
export declare function stitchClosedBoundary(polylines: Point2D[][], mergeTol?: number): {
    points: Point2D[];
    closed: boolean;
} | null;
export interface RegionResult {
    points: Point2D[];
    closed: boolean;
    /** 端点の隙間をまたいで閉じたか。true なら利用者に伝える必要がある。 */
    bridgedGap: boolean;
    /** またいだときの許容量。bridgedGap が false なら 0。 */
    gapTolerance: number;
}
/** 塗れる閉領域の候補一式。隙間をまたいだかどうかは候補で共通。 */
export interface RegionCandidateSet {
    candidates: RegionCandidate[];
    /** 端点の隙間をまたいで閉じたか。true なら利用者に伝える必要がある。 */
    bridgedGap: boolean;
    /** またいだときの許容量。bridgedGap が false なら 0。 */
    gapTolerance: number;
}
export declare function buildClosedBoundaryCandidatesWithGapBridging(polylines: Point2D[][], tolerances: RegionTolerances, limit?: number): RegionCandidateSet;
export declare function buildClosedBoundaryWithGapBridging(polylines: Point2D[][], tolerances: RegionTolerances): RegionResult | null;
/**
 * trio の選択 path 群から、塗れる閉領域の候補を面積の小さい順に返す。
 * 交わり方によっては閉領域が複数できるので、どれを塗るかは呼び出し側で選ぶ。
 */
export declare function buildRegionCandidates(trio: PenroseTrio, paths: string[], tol?: number, limit?: number): RegionCandidateSet;
export declare function buildRegionPoints(trio: PenroseTrio, paths: string[], tol?: number): RegionResult | null;
