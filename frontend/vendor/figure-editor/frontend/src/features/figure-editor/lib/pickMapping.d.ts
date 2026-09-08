import { NEAR_PICK_TOLERANCE_PX } from "./nearestPick";
export interface PickedShape {
    path: string;
    substanceName: string;
    fieldName: string;
    groupEl: SVGElement;
}
export declare function findFieldFromClick(target: EventTarget | null): PickedShape | null;
export type ShapeCategoryFn = (path: string) => "label" | "shape" | null;
export declare function pickCandidatesAtPoint(clientX: number, clientY: number, host: HTMLElement, getCategory: ShapeCategoryFn): PickedShape[];
/**
 * 二段構えの後段。**直接ヒットが 1 つも無かったときだけ呼ぶこと。**
 *
 * クリック点から各図形までの距離を測り、許容内のものを近い順に返す。塗りの無い
 * 線・曲線は当たり判定が線幅ぶんしかないので、少し外しただけで「選べない図形」に
 * 見えてしまう——その取りこぼしだけを拾うための経路。
 *
 * 点列は `getShapeGeometryFromSVG`（領域塗り・頂点編集と同じもの）を使う。図形の
 * 種類ごとの幾何実装をここに起こさない。距離は画面 px なので、許容量は拡大率に
 * よらず一定（`nearestPick.ts` の頭を見よ）。
 *
 * **ラベルと画像は対象にしない。** どちらも既に bbox で当てていて、そこを近傍で
 * さらに広げると文字の周りの空白まで選択になる。
 */
export declare function nearestShapeCandidates(clientX: number, clientY: number, host: HTMLElement, getCategory: ShapeCategoryFn, tolerancePx: number): PickedShape[];
/**
 * 直接ヒット → 近傍、の二段構えをまとめたもの。選択を決める経路はここを通す。
 *
 * 近傍で拾ったかどうかを返すのは、**空白のドラッグ（パン）を奪わないため**。
 * 近傍だけで見つかったクリックは「本来なら何も選ばれなかった」ので、掴む相手が
 * 選択中でなければ従来どおり空白として扱う（Canvas.handlePointerDown を見よ）。
 */
export declare function pickCandidatesWithNearFallback(clientX: number, clientY: number, host: HTMLElement, getCategory: ShapeCategoryFn, kind: keyof typeof NEAR_PICK_TOLERANCE_PX): {
    candidates: PickedShape[];
    fromNearFallback: boolean;
};
export declare function pickAtPoint(clientX: number, clientY: number, host: HTMLElement, getCategory: ShapeCategoryFn): PickedShape | null;
export declare function findGroupByPath(host: HTMLElement, path: string): SVGElement | null;
export declare function unionClientRect(host: HTMLElement, paths: string[]): {
    left: number;
    top: number;
    right: number;
    bottom: number;
} | null;
