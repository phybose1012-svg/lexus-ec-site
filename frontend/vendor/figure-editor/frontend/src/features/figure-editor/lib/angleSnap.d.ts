import type { Point2D } from "./shapeBuilders";
/** 吸着先の角度（度）。昇順。y 軸の向きに依らないよう 0 を挟んで対称。 */
export declare const SNAP_ANGLES_DEG: readonly [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
/**
 * もっとも近い代表角（度）を返す。
 *
 * 真ん中でちょうど割れたとき（例: 30 度と 45 度の間の 37.5 度）は、小さい方の
 * 代表角を採る。どちらへ寄るか毎回変わると、境目でプレビューがちらつく。
 */
export declare function snapAngleDegrees(degrees: number): number;
/**
 * 線分の終点を、始点から見てもっとも近い代表角の向きへ寄せる。
 *
 * 長さは変えない（カーソルまでの距離をそのまま保つ）ので、指した位置から
 * 遠ざかったり近づいたりしない。始点と重なっているときは何もしない。
 */
export declare function snapLineEndPoint(start: Point2D, end: Point2D): Point2D;
