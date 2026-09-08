import type { SvgPathCommand } from "../svgPathEngine.js";
import type { Point } from "./model.js";
import { type Matrix } from "./transform.js";
export interface EllipseShape {
    readonly cx: number;
    readonly cy: number;
    readonly rx: number;
    readonly ry: number;
    /** 長軸の傾き（度・SVG 画面座標で時計回りが正）。 */
    readonly phi: number;
}
/** 2x2 行列の特異値分解から、楕円の半径と傾きを出す。 */
export declare function transformEllipse(ellipse: EllipseShape, matrix: Matrix): EllipseShape;
/** 端点表記の円弧を、中心表記へ直す（SVG 実装ノート F.6.5）。 */
export declare function arcToCenter(start: Point, command: Extract<SvgPathCommand, {
    type: "A";
}>): {
    center: Point;
    rx: number;
    ry: number;
    phi: number;
    theta1: number;
    deltaTheta: number;
} | null;
/**
 * 円弧を 3 次ベジェの列へ開く。1 区間 90 度以下に割るので、誤差は
 * 半径に対して 1e-4 未満（描画には十分）。
 */
export declare function arcToCubic(start: Point, command: Extract<SvgPathCommand, {
    type: "A";
}>): SvgPathCommand[];
/**
 * パスのコマンド列へ行列を当てる。
 *
 * 円弧は、相似変換ならそのまま運び、そうでなければ 3 次ベジェへ開いてから移す。
 * こうしておけば、呼び出し側は「変換できる形かどうか」を気にしなくてよい。
 */
export declare function transformCommands(commands: readonly SvgPathCommand[], matrix: Matrix): SvgPathCommand[];
/**
 * SVG 座標（左上原点・y 下向き）を Penrose 座標（中心原点・y 上向き）へ移す。
 *
 * **円弧のフラグは触らない。** ここでの y 反転は、Penrose 側の描画時の
 * y 反転（screenY = H/2 - penroseY）とちょうど逆なので、端点は元の画面座標へ
 * 戻る。一方 Penrose の PathBuilder は rx / ry / x-rotation / largeArc / sweep を
 * そのまま SVG へ書き出すため、ここで sweep を反転すると **弧だけが上下に
 * 裏返る**。
 *
 * 実測（2026-09-06・q3-lens-pair.svg）: 反転させた版では、元の
 * `A450 450 0 0 0 630 170` が出力で `A 450 450 0 0 1 630 170` になり、
 * レンズの弧が上下逆さまに描かれた。反転をやめると元と同じ弧になる。
 */
export declare function toPenroseCommands(commands: readonly SvgPathCommand[], canvasWidth: number, canvasHeight: number): SvgPathCommand[];
/** コマンド列の外接矩形（制御点も含む粗い箱。切り抜き判定に使う）。 */
export declare function commandsBounds(commands: readonly SvgPathCommand[]): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
} | null;
