/**
 * 近傍ピック — 直接ヒットが外れたクリックだけを、いちばん近い図形へ寄せる。
 *
 * 線分・曲線・円弧・折れ線は塗りが無いので、当たり判定が線幅ぶんしかない。
 * 少し外すと何も選べず「この図形は選べないのか」と見える、という実機報告が
 * 出発点。**選択は二段構え**にしてある——まず従来どおりの直接ヒットで判定し、
 * それが空だったときに限ってここで距離を測る。
 *
 * **透明な太いストロークを重ねて当たり判定を広げる方式は採らない。** 書き出しへ
 * 混入しうる要素が増えるうえ、「図形を読む処理が、見えない余分な要素を掴む」
 * 事故（矢先の marker 内 `<path>` を輪郭と取り違えた ba530b5）を領域塗り・
 * 頂点編集・投げ縄へそのまま持ち込む。距離で拾えば DOM は 1 つも増えない。
 *
 * ## 距離は画面(client)座標で測る
 *
 * 図形の点列は SVG userspace で来るので、根 SVG の screen CTM で画面へ写して
 * から測る（`toClientPoint`）。こうすると**許容量はどの拡大率でも画面 px のまま**で、
 * キャンバスのプリセットが座標系の桁を変えても影響を受けない。許容量の側を
 * 拡大率で割る作りにすると、換算を忘れた経路がひとつでもあると倍率によって
 * 当たり方が変わる。
 */
import type { PointerKind } from "./pointerInput";
export interface NearPickPoint {
    x: number;
    y: number;
}
/**
 * 近傍で拾う上限。**画面 px。**
 *
 * 入力の種類で変えるのは `TAP_SLOP_PX`（pointerInput.ts）と同じ理由で、狙える
 * 精度が道具ごとに違うから。マウス < ペン < 指。
 *
 * - `mouse` 12: 直接ヒットは 9 点サンプル（±6px）＋線幅の半分で、実測すると
 *   7〜8px までしか届かない。「少し外した」が救われるにはその倍が要る。
 *   12px は 96dpi で約 3mm——空白を押して選択を外す感覚は残る。
 * - `pen` 16: ペン先は細いが、ガラスの厚みぶん視差で狙いがずれる。
 * - `touch` 24: 指の接触面は Apple の推奨タップ標的 44pt と同じ桁。その半分。
 *
 * **ここが唯一の定義場所。** 呼ぶ側で足したり掛けたりしないこと（倍率の換算は
 * 上のとおり点列側で済ませてある）。
 */
export declare const NEAR_PICK_TOLERANCE_PX: Record<PointerKind, number>;
/**
 * 「同じくらい近い」とみなす差。**画面 px。**
 *
 * 重なった線のどちらが選ばれるかを 0.1px の差で決めると、同じ場所を押しても
 * 結果が入れ替わって見える。この幅に収まっていれば距離では決めず、**手前
 * （描画順が後）**を選ぶ。
 */
export declare const NEAR_PICK_TIE_PX = 1.5;
/** DOMMatrix のうち 2 次元の変換に要る部分だけ。DOM 無しで測れるようにするため。 */
export interface NearPickTransform {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
}
/** SVG userspace の点を画面(client)座標へ写す。 */
export declare function toClientPoint(point: NearPickPoint, matrix: NearPickTransform): NearPickPoint;
/** 点と線分の距離。線分が潰れていれば端点との距離。 */
export declare function distanceToSegment(point: NearPickPoint, from: NearPickPoint, to: NearPickPoint): number;
/**
 * 点と点列（連続する 2 点を線分とみなす折れ線）の距離。
 *
 * 円・楕円・長方形の輪郭も、点編集の土台も、領域塗りも同じ点列を使っている
 * （`getShapeGeometryFromSVG`）。図形の種類ごとに別の距離計算を持たせない。
 * 点が 1 つだけなら、その点との距離（点マーカーのような極小の図形）。
 */
export declare function distanceToPoints(point: NearPickPoint, points: readonly NearPickPoint[]): number;
export interface NearPickCandidate {
    path: string;
    /** 画面(client)座標の点列。 */
    points: readonly NearPickPoint[];
    /** 描画順。**大きいほど手前**（`svgPaintOrder` の添字）。 */
    order: number;
}
export interface NearPickResult {
    path: string;
    distance: number;
    order: number;
}
/**
 * 許容内の図形を「選ばれるべき順」に並べて返す。
 *
 * - いちばん近いものが先頭
 * - 先頭から `tiePx` 以内に並ぶものは同点とみなし、その中の**手前**を先頭へ繰り上げる
 * - 残りは距離の昇順（同距離なら手前が先）
 *
 * 並べ替えの比較関数に許容差を混ぜると推移律が壊れて、並びが入力順で変わる。
 * 先頭だけを決め打ちで繰り上げる形にしてあるのはそのため。
 */
export declare function rankNearPickCandidates(point: NearPickPoint, candidates: readonly NearPickCandidate[], tolerancePx: number, tiePx?: number): NearPickResult[];
