import type { CanvasDimensions } from "./canvasViewport";
import type { Point2D } from "./shapeBuilders";
/** 縦横の半径がこの割合以内に収まっていれば、正円として扱う。 */
export declare const CIRCLE_GUIDE_TOLERANCE = 0.02;
/**
 * バツ印の腕の長さ。線の太さと同じく、キャンバスの大きさに対する割合で持つ。
 * 400 x 400 のキャンバスで 8 単位 = 従来の見え方とほぼ同じ。
 */
export declare const CENTER_CROSS_ARM_PERCENT = 2;
export interface EllipseGuideSegment {
    from: Point2D;
    to: Point2D;
}
export interface EllipseGuide {
    /** center = 中心のバツ印、axes = 長軸と短軸。 */
    kind: "center" | "axes";
    /** 図形のローカル座標。回転は描画側の変換に任せる。 */
    segments: [EllipseGuideSegment, EllipseGuideSegment];
}
/** キャンバスの大きさに対して一定になる、バツ印の腕の長さ。 */
export declare function centerCrossArmLength(dimensions: CanvasDimensions): number;
/**
 * 目印を図形のローカル座標で組み立てる。
 *
 * 半径が読めない (0 や NaN) 図形には目印を出さない。潰れた図形に軸を引いても
 * 線が重なるだけで、かえって図が読みにくくなる。
 */
export declare function ellipseGuide(center: Point2D, rx: number, ry: number, crossArm: number): EllipseGuide | null;
