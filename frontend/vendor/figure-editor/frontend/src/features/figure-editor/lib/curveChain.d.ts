import type { Point2D } from "./shapeBuilders";
import { type CubicCurveHandles, type CurveSample } from "./curveGeometry";
export interface CurveChain {
    /** 長さ 3n+1。[p0, c1, c2, p1, c1', c2', p2, …]。 */
    points: Point2D[];
}
/**
 * 交換形式の上限スパン数（= 61 点）。編集ハンドルを出す上限もこれに揃える。
 * 超える連鎖は切り詰めず「全体変形のみ」にする。
 *
 * ここは**画面の間隔では置き換えない**。多角形・折れ線の頂点ハンドルは
 * 「掴めるか」だけの話なので間隔判定へ移したが（lib/polygonHandles.ts）、
 * こちらは docs/INTEROP-EXCHANGE-V1.md の上限そのもので、越えた連鎖は
 * そもそも鬼授業へ渡せない。拡大しても渡せるようにはならない。
 */
export declare const CURVE_CHAIN_MAX_SPANS = 20;
/** 新規描画で置ける通過点の上限（= CURVE_CHAIN_MAX_SPANS + 1）。 */
export declare const CURVE_CHAIN_MAX_THROUGH_POINTS: number;
export declare function curveChainSpanCount(chain: CurveChain): number;
/** スパン i の 4 点。範囲外は null。 */
export declare function curveChainSpan(chain: CurveChain, spanIndex: number): CubicCurveHandles | null;
/** 通過点（スパン境界）の一覧。長さ n+1。 */
export declare function curveChainAnchors(chain: CurveChain): Point2D[];
/**
 * 連鎖全体の媒介変数 t ∈ [0, n]（整数部=スパン番号、小数部=スパン内 t）で
 * 曲線上の点を返す。
 */
export declare function curveChainPointAt(chain: CurveChain, t: number): Point2D | null;
/** 各スパンの「ふくらみつまみ」を置く位置（スパン中央 t=0.5 の曲線上の点）。 */
export declare function curveChainBulgeGrips(chain: CurveChain): Point2D[];
/** 2次スパン (p0, q, p1) の厳密な次数上げ。 */
export declare function elevateQuadraticSpan(p0: Point2D, q: Point2D, p1: Point2D): [Point2D, Point2D];
/**
 * スパンが2次へ厳密還元できるなら、その2次制御点を返す。
 *
 * 3次 (p0, c1, c2, p1) が2次由来 ⇔ (3c1-p0)/2 と (3c2-p1)/2 が一致する。
 * 許容は座標の大きさに比例させ、浮動小数の丸めだけを吸収する（手で置いた
 * 独立な制御点を「たまたま2次」と誤認しない程度に狭い）。
 */
export declare function quadraticControlOfSpan(span: CubicCurveHandles): Point2D | null;
/** 全スパンが2次へ厳密還元できる連鎖か（交換時に2次で渡せるか）。 */
export declare function isQuadraticReducibleCurveChain(chain: CurveChain): boolean;
export interface CurveChainThroughOptions {
    /**
     * "smooth": Catmull-Rom の3次で、通過点をなめらかに通る初期ふくらみ。
     *   隣り合うスパンが同じ接線ベクトルを共有するので接合部は厳密に C1。
     * "straight": 全スパン直線（ふくらみ = 弦の中点）。こちらは2次由来。
     */
    bulge?: "smooth" | "straight";
}
/**
 * 通過点列から連鎖曲線を作る公開 API。
 *
 * 手描き認識レイヤなど外部からの入り口はこれ 1 つ。通過点 2 個以上・全て
 * 有限座標のときだけ連鎖を返す。生成直後の連鎖は**全ての接合部がなめらか**
 * （curveChainJointKindAt が全て "smooth"）。
 */
export declare function curveChainThroughPoints(through: Point2D[], options?: CurveChainThroughOptions): CurveChain | null;
/**
 * 接合部を「なめらか」と見なす、接線の食い違いの上限（度）。
 *
 * この判定を使うのは **編集のときと、ハンドルの見た目だけ**。開いただけの
 * 連鎖には何もしないので、保存済みの図や鬼授業から取り込んだ図の形は
 * そのまま（保存形式も不変）。
 */
export declare const CURVE_CHAIN_SMOOTH_TOLERANCE_DEG = 10;
export type CurveChainJointKind = "smooth" | "corner";
/**
 * 通過点 anchorIndex が接合部なら、その状態（なめらか／角）。両端の通過点は
 * 片側しか無いので null。
 */
export declare function curveChainJointKindAt(chain: CurveChain, anchorIndex: number): CurveChainJointKind | null;
/**
 * 通過点を「角」⇄「なめらか」に切り替える。
 *
 * 保存形式は変わらない。角かどうかは**点の並びそのもの**（接合部の両側の
 * 制御点が一直線に並んでいるか）なので、印を足す必要がない。
 *
 * - "corner": 両側の制御点を、それぞれ隣の通過点の方角へ向け直す。以後の
 *   編集はこの接合部を越えて伝わらない（keepJointSmooth が降りる）。
 * - "smooth": 両側を、いまの2方向の中間へそろえる。
 */
export declare function setCurveChainJointKind(chain: CurveChain, anchorIndex: number, kind: CurveChainJointKind): CurveChain;
export interface CurveChainEditOptions {
    /**
     * true にすると接合部のなめらかさを保たない（＝その場に折れ目ができる）。
     * 既定は false。UI からは「通過点をタップして角にする」道を出しているので、
     * これは単体テストと、意図して折りたい呼び出し側のためのつまみ。
     */
    breakJoints?: boolean;
}
/**
 * スパンのふくらみを「曲線上の中点が target へ来る」ように動かす。
 *
 * 中点の変位 Δ に対して両制御点を (4/3)Δ ずつ平行移動する。B(0.5) は
 * (p0+3c1+3c2+p1)/8 なので中点はちょうど Δ 動き、2次由来スパンは
 * 2次由来のまま（q が 2Δ 動く）、独立制御点のスパンでも形の癖を保って
 * ふくらみだけ変わる。
 *
 * つまんだスパンの両端では接線の向きが変わるので、**隣のスパンの制御点を
 * その向きへ向け直す**（なめらかだった接合部だけ）。ここをやらないと、
 * ふくらませるたびに両隣の通過点が尖る。
 */
export declare function moveCurveChainBulge(chain: CurveChain, spanIndex: number, target: Point2D, options?: CurveChainEditOptions): CurveChain;
/**
 * 通過点（スパン境界）anchorIndex（0..n）を point へ動かす。
 *
 * 隣接スパンの制御点は、媒介変数上の位置に比例して Δ の 1/3・2/3 を配る
 * （動かした端に近い制御点ほど大きく動く）。これは「仮想2次制御点 q を
 * 弦の中点の変位ぶんだけ平行移動する」ことと同値。
 *
 * そのうえで接合部を 3 つ直す。動かした通過点そのもの（両側とも動くので
 * 平均で回す）と、その両隣（動いていない外側が正・内側を向け直す＝2 つ先の
 * スパンは 1 点も動かない）。
 */
export declare function moveCurveChainAnchor(chain: CurveChain, anchorIndex: number, point: Point2D, options?: CurveChainEditOptions): CurveChain;
/**
 * 通過点 anchorIndex にぶら下がる制御点の添字。片側しか無い両端では null。
 *
 * 添字は chain.points のもので、そのまま moveCurveChainControl へ渡せる。
 * 「入り側 = 手前のスパンの c2」「出し側 = 次のスパンの c1」で、どちらも
 * 通過点から生えている腕として見せる（画面ではここへ線を引く）。
 */
export interface CurveChainControlHandle {
    index: number;
    point: Point2D;
}
export declare function curveChainControlsAt(chain: CurveChain, anchorIndex: number): {
    incoming: CurveChainControlHandle | null;
    outgoing: CurveChainControlHandle | null;
} | null;
/**
 * 制御点そのものを point へ動かす（Illustrator / Figma と同じ直接操作）。
 *
 * controlIndex は chain.points の添字で、3 の倍数でない位置＝制御点だけを
 * 受ける。動かした側が接線を決め、**なめらかだった接合部では反対側の制御点を
 * 一直線に向け直す**。向け直すのは向きだけで、長さは反対側のものを保つ
 * （＝スムーズ点。鏡のように長さまで揃えると、左右でスパンの大きさが違う
 * ところで隣のスパンの形が巻き添えで壊れる。既存の keepJointSmooth /
 * aimJointHandle が「長さは保ち向きだけ合わせる」なので、そこに合わせた）。
 *
 * 角の接合部と両端の通過点では、keepJointSmooth が降りるので左右独立に動く。
 */
export declare function moveCurveChainControl(chain: CurveChain, controlIndex: number, target: Point2D, options?: CurveChainEditOptions): CurveChain;
/**
 * スパン spanIndex の途中（既定は中央 t=0.5）に通過点を 1 つ足す。
 *
 * de Casteljau で厳密に切るので、**足しても形は 1 ミリも変わらない**。
 * 上限（CURVE_CHAIN_MAX_SPANS）に達していれば null を返す。呼び出し側は
 * 黙って落とさず、断った理由を出すこと。
 */
export declare function insertCurveChainAnchor(chain: CurveChain, spanIndex: number, t?: number): CurveChain | null;
/**
 * 通過点 anchorIndex を取り除く。1 スパンしかない連鎖からは抜けない（null）。
 *
 * - 両端: そのスパンごと落とす＝曲線が 1 スパンぶん短くなる（Illustrator で
 *   端のアンカーを消したときと同じ）。
 * - 途中: 前後 2 スパンを 1 スパンへ畳む。外側の制御点を通過点から見て 2 倍へ
 *   伸ばす＝t=0.5 の de Casteljau 分割の逆。**中央で足した通過点をそのまま
 *   消せば、形は元へ厳密に戻る。** それ以外の位置でも両端の接線の向きは保つ。
 */
export declare function removeCurveChainAnchor(chain: CurveChain, anchorIndex: number): CurveChain | null;
/** 反転などの点ごとの写像。3n+1 構造は保たれる。 */
export declare function mapCurveChainPoints(chain: CurveChain, map: (point: Point2D) => Point2D): CurveChain;
/**
 * 幾何計算用の適応標本化。t は連鎖全体の媒介変数（[0, n]）で、交点分割を
 * 元の曲線位置へ正確に戻すために保持する。
 */
export declare function sampleCurveChainAdaptive(chain: CurveChain, tolerance?: number): CurveSample[];
/** ライブプレビュー用の等間隔標本化（spanSegments 分割/スパン）。 */
export declare function sampleCurveChain(chain: CurveChain, spanSegments?: number): Point2D[];
/**
 * 連鎖全体の媒介変数（[0, n]）の昇順リストで分割し、連鎖の配列を返す。
 * スパン内部の切断は de Casteljau で厳密、スパン境界ちょうどの切断は
 * 境界で連鎖を切り離す。
 */
export declare function splitCurveChainAtParameters(chain: CurveChain, parameters: number[]): CurveChain[];
/**
 * Style の実効 d 値（getEffectiveShapePropertyValue の生値）を連鎖として読む。
 *
 * 対応形式:
 * 1. 引用符付きの標準 SVG Path（"M … C/L/Q …"、単一サブパス・開）。
 *    L/Q は厳密な次数上げで3次スパン化する（S/T はパーサーが C/Q へ展開済み）。
 * 2. 旧文書の単発3次 cubicCurveFromPoints("open", [4点]) → 1 スパンの連鎖。
 * どちらでもなければ null（円弧・pathFromPoints・閉路などは対象外）。
 */
export declare function parseCurveChainValue(raw: string): CurveChain | null;
/**
 * 連鎖を Style の d 値（引用符付き標準 SVG Path 文字列）へ書き出す。
 * 数値は共有エンジンの round-trip 表現なので、parse で厳密に元へ戻る。
 */
export declare function serializeCurveChainStyleValue(chain: CurveChain): string | null;
