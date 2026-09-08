import type { Point } from "./model.js";
export interface Rect {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}
export declare function rectContains(rect: Rect, point: Point, epsilon?: number): boolean;
/** すべての点が矩形の内側か。 */
export declare function allInside(rect: Rect, points: readonly Point[]): boolean;
/**
 * 開いた折れ線を矩形で切る（Liang–Barsky を線分ごとに当てる）。
 *
 * 線が矩形を出入りするたびに分かれるので、戻り値は「折れ線の並び」。
 * 隣り合う線分の切り口が一致するときは 1 本につなぎ直す。
 */
export declare function clipPolyline(points: readonly Point[], rect: Rect): Point[][];
/** 閉じた多角形を矩形で切る（Sutherland–Hodgman）。 */
export declare function clipPolygon(points: readonly Point[], rect: Rect): Point[];
