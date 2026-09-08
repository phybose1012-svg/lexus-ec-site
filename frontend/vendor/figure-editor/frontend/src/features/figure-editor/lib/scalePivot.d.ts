import type { ClientRectEdges } from "./selectionFrame";
/**
 * 拡大縮小の基準点（pivot）を決める純関数。
 *
 * 既定は選択範囲の**左下**。図をまとめて拡げるときは、下端と左端が動かない
 * ほうが並びが崩れないため。
 *
 * ただし**単体で選んだ円・楕円だけは自分の中心**を基準にする。円は「中心と
 * 半径」で意味が決まる図形で、大きさを変えたときに中心が動くのは操作として
 * 不自然（半径ハンドル `resizeEllipseLocalRadii` も同じ理由で中心固定）。
 *
 * 複数選択のときは種類に関わらず左下のまま。選択全体をひとつの箱として
 * 拡げるほうが自然で、円が混ざっているかどうかで基準が変わると読めない。
 */
/** その shape 型は、単体で選んだとき中心を動かさずに拡大縮小するか。 */
export declare function scalesAroundOwnCenter(shapeType: string | null | undefined): boolean;
export type ScalePivotKind = "center" | "bottomLeft";
export interface ScalePivotPoint {
    x: number;
    y: number;
    kind: ScalePivotKind;
}
/**
 * 基準点の種類だけを決める。
 *
 * `shapeType` は**単体選択のときだけ**渡すこと（複数選択では null）。呼ぶ側が
 * 「複数選択なら null」で揃えているので、ここは件数と型だけを見ればよい。
 */
export declare function scalePivotKindFor(pathCount: number, shapeType: string | null | undefined): ScalePivotKind;
/**
 * client 座標の基準点。
 *
 * `box` は対象 path 群の `unionClientRect`。単体の円・楕円ではその中心が
 * そのまま図形の中心になる（楕円は中心対称なので、回っていても外接矩形の
 * 中心は中心のまま）。**確定側 `readRenderedPlacement()` の `center` と
 * 同じ測り方**なので、`scaleShapeAround` が書き戻す中心はここと厳密に
 * 一致する＝倍率をいくつにしても中心が動かない。
 */
export declare function scalePivotClientPoint(box: ClientRectEdges, pathCount: number, shapeType: string | null | undefined): ScalePivotPoint;
/** 基準点の呼び名（青丸の title・右パネルの見出しで使う）。 */
export declare function scalePivotLabel(kind: ScalePivotKind): string;
