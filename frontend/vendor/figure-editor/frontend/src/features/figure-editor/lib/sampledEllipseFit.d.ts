import type { Point2D } from "./styleParser";
/** これ未満の点数は多角形として読む。AI の楕円標本は数十〜160 点。 */
export declare const MIN_ELLIPSE_SAMPLES = 16;
/** 当てはめた楕円からの外れ（正規化半径の 1 からのずれ）の許容量。 */
export declare const ELLIPSE_FIT_TOLERANCE = 0.02;
/** 標本が一周を覆っているか。この角度以上の隙間があれば弧とみなす。 */
export declare const MAX_ELLIPSE_SAMPLE_GAP_DEGREES = 50;
export interface SampledEllipseFit {
    center: Point2D;
    /** 図形ローカルの横半径（rotationDegrees だけ回す前の姿勢で測る）。 */
    rx: number;
    ry: number;
    /** エディタ準拠の回転角（画面で時計回りが正）。0 なら軸に平行。 */
    rotationDegrees: number;
}
/**
 * 点列を楕円として読む。楕円だと言い切れなければ null。
 *
 * 落とすのは「点が少ない / 凹んでいる / 一周していない / 当てはめから外れる /
 * 縦横が同じ」。通るのは、機械が楕円の式から打った標本だけ。
 *
 * **縦横が同じものは通さない。** 正 N 角形は N を増やすほど円に当てはまるので、
 * 円と正多角形は点列からは見分けられない。読み替えれば頂点ハンドルを失うのに、
 * 得られるのは中心のバツ印だけ（円のガイドには長軸・短軸が無い）。割に合わない。
 */
export declare function fitSampledEllipse(points: readonly Point2D[]): SampledEllipseFit | null;
