import type { Point2D } from "./shapeBuilders";
/** どの対称で補正したか。**これだけを覚える。** */
export type SymmetryGuideKind = "mirror" | "point";
export type SymmetryGuideMap = Map<string, SymmetryGuideKind>;
/**
 * 保存から復元する。読めない値は落とす——**関係のない図形に対称の札が
 * 付くくらいなら、出ない方がよい**（ずれたガイドは無いより悪い）。
 */
export declare function symmetryGuidesFromRecord(value: unknown): SymmetryGuideMap;
/** 複製した図形へ、対称のしるしも引き継ぐ。 */
export declare function copySymmetryGuideForDuplicate(guides: SymmetryGuideMap, sourcePath: string, targetPath: string): SymmetryGuideMap;
/** 点対称の中心 ＝ 両端の中点。 */
export declare function symmetryCenterPoint(start: Point2D, end: Point2D): Point2D | null;
export interface AxisSegment {
    from: Point2D;
    to: Point2D;
}
/**
 * 線対称の軸 ＝ 両端を結んだ弦の垂直二等分線。
 *
 * 長さは、図形の外接矩形を軸の向きへ射影して決める（回した図形でも、軸が
 * 図形を突き抜けるちょうどの長さになる）。`margin` は上下へ足す余白。
 *
 * **すべて図形のローカル座標で計算する。** 呼び出し側が CTM で写せば、
 * 図形が回っていても縮んでいても、軸は図形と同じだけ回って縮む。
 */
export declare function symmetryAxisSegment(start: Point2D, end: Point2D, bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
}, margin: number): AxisSegment | null;
/**
 * 対称がまだ生きているかを測る。**「ずれるくらいなら出さない」の実体。**
 *
 * 覚えているのは「どの対称か」だけなので、あとから通過点を引きずって形を
 * 崩されても覚え書きは残る。残ったまま軸を引けば、対称でない曲線に対称の
 * 線が乗る——**無いより悪いガイド**になる。そこで描く直前に測り直す。
 *
 * 測り方は弧長で対にする。対称な曲線は、始点から測った弧長と終点から測った
 * 弧長が対応する点どうしが**厳密に**——線対称なら軸について鏡像、点対称なら
 * 中心について対称——になる。だから `samples[i]` と `samples[n-1-i]` を
 * 突き合わせればよい。返すのは食い違いの最大値 ÷ 図形の大きさ。
 *
 * 拡大縮小・回転・反転では対称は保たれるので、ここは通る。崩れるのは
 * 「通過点を動かした」「回した図形を縦横別々に伸ばした」のときだけ。
 */
export declare function symmetryResidual(samples: readonly Point2D[], kind: SymmetryGuideKind, size: number): number;
/**
 * 対称と認める食い違いの上限（図形の外接矩形の対角線に対する割合）。
 *
 * 補正の出口はそのままの点列ではない——通過点を間引いて 3 次ベジェの連鎖へ
 * 詰め直すので、厳密な対称からはわずかに崩れる。その分は通し、目で見て
 * 対称でないものは落とす幅にする。
 */
export declare const SYMMETRY_GUIDE_TOLERANCE = 0.05;
