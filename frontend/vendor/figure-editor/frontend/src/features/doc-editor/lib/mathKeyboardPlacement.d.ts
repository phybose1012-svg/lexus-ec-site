export interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}
export interface Size {
    w: number;
    h: number;
}
/** これ以上狭いとキーが横スクロールばかりになるので、縮めるのをやめる下限 */
export declare const PANEL_MIN_W = 380;
export declare const PANEL_MIN_H = 220;
export interface PlacementInput {
    /** 使いたい大きさ（保存値または既定値） */
    desired: Size;
    viewport: Size;
    /** 隠したくない矩形（数式ダイアログのカードなど）。無ければ null */
    avoid: Rect | null;
    /** 仮想キーボードの上端。出ていなければ viewport.h を渡す */
    keyboardTop: number;
}
/** どの候補で決まったか（テストと、なぜそこに出たかの説明用） */
export type PlacementKind = "right" | "above" | "below" | "overlap";
export interface Placement extends Rect {
    kind: PlacementKind;
}
/**
 * 右上を第一候補に、避けたい矩形にかぶらない大きさ・位置を選ぶ。
 *
 * 候補の順は「右上らしさ」の順:
 *   right … 矩形の右隣（上端そろえ）。いちばん素直な右上
 *   above … 矩形の上（右端そろえ）。これも右上
 *   below … 矩形の下（右端そろえ）。縦長の画面ではここしか空いていない
 *   overlap … どこにも収まらないときだけ。右上に重ねて出す（出ないよりまし）
 */
export declare function placeAboveVirtualKeyboard(input: PlacementInput): Placement;
/** 2 つの矩形が重なるか（テストと配置判定の共通判定） */
export declare function rectsOverlap(a: Rect, b: Rect): boolean;
