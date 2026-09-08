/** バーと領域の端の間隔。Tailwind の bottom-4 / top-4 と同じ 16px。 */
export declare const FREEHAND_BAR_EDGE_MARGIN = 16;
/**
 * 図形の周りに残す余白。選択枠（padding 16px）ぶんに少し足した値で、バーが
 * 枠すれすれに並んで「隠れてはいないが掴めない」になるのを避ける。
 */
export declare const FREEHAND_BAR_CLEARANCE = 24;
export type FreehandBarSide = "bottom" | "top";
export interface FreehandBarGeometry {
    /** キャンバス領域の内寸。 */
    rootWidth: number;
    rootHeight: number;
    /** 描いた図形の外接矩形（キャンバス領域座標）。 */
    boxTop: number;
    boxBottom: number;
    boxLeft: number;
    boxRight: number;
    /** バー自身の実測サイズ。バーは水平中央に置かれる。 */
    barWidth: number;
    barHeight: number;
}
/**
 * バーを下端・上端のどちらに出すか。
 *
 * 下端（既定）で図形と重ならなければ下端のまま。重なるなら上端を試し、
 * 上端でも重なる（縦に大きい図形）なら、図形の外の余白が広い側に置く
 * ——どのみち少し重なるが、余白の広い側なら図形のはみ出しは小さい。
 */
export declare function computeFreehandBarSide(geom: FreehandBarGeometry): FreehandBarSide;
