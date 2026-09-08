import type { Point2D } from "./shapeBuilders";
export type LassoMode = "enclose" | "touch";
export interface LassoCandidate {
    path: string;
    /**
     * 図形の輪郭・線を表す画面座標の点列。曲線はサンプリング済みのものを渡す。
     * 閉じた図形なら最後に始点を繰り返して閉じておくこと。
     */
    points: Point2D[];
}
/** 交差回数法。多角形が自分自身と交わっていても偶奇で一貫して判定する。 */
export declare function pointInPolygon(point: Point2D, polygon: readonly Point2D[]): boolean;
/** 線分 a-b と c-d が交わるか（端点で触れる場合も交わりとみなす）。 */
export declare function segmentsIntersect(a: Point2D, b: Point2D, c: Point2D, d: Point2D): boolean;
/**
 * 図形が投げ縄に丸ごと収まっているか。
 *
 * 「全部の点が内側」だけでは足りない。凹んだ投げ縄では、両端が内側でも途中が
 * 外へはみ出すことがある。境界と交わっていないことまで確かめる。
 */
export declare function enclosedByLasso(points: readonly Point2D[], lasso: readonly Point2D[]): boolean;
/** 図形が投げ縄に少しでも重なっているか。 */
export declare function touchedByLasso(points: readonly Point2D[], lasso: readonly Point2D[]): boolean;
/**
 * 投げ縄に対して選ばれる図形を返す。
 *
 * 点が 1 つも読めなかった図形は選ばない。位置が分からないものを勝手に選ぶより、
 * 選ばれないほうが直せる。
 */
export declare function lassoSelectedPaths(lasso: readonly Point2D[], candidates: readonly LassoCandidate[], mode: LassoMode): string[];
/**
 * なぞった軌跡を投げ縄の輪郭にする。
 *
 * mousemove は細かく飛んでくるので、近すぎる点は捨てて多角形を軽くする。
 * 判定は点の数の二乗で効いてくるため、ここで間引いておくのが効く。
 */
export declare function appendLassoPoint(points: Point2D[], next: Point2D, minimumDistance?: number): Point2D[];
