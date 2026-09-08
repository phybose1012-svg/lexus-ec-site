import { type Point2D } from "./shapeBuilders";
import type { ArcMetadata } from "./arcMetadata";
import type { PenroseTrio } from "./types";
import type { TraceDraftPoint, TraceDraftShape } from "../../../../../src/traceDraftSchema";
/** 下敷き画像が Penrose 座標のどこに、どの大きさで置かれているか。 */
export interface BackgroundPlacement {
    center: Point2D;
    width: number;
    height: number;
}
/** 背景 Image シェイプの実際の配置。読めなければ null。 */
export declare function readBackgroundPlacement(trio: PenroseTrio, path: string): BackgroundPlacement | null;
/**
 * 画像基準の正規化座標 (左上 0,0 / 右下 1,1) → Penrose 座標。
 * Penrose の y は上が正なので、縦だけ向きが反転する。
 */
export declare function toPenrosePoint(point: TraceDraftPoint, placement: BackgroundPlacement): Point2D;
/** 下書きの図形を trio へ足した結果。 */
export interface TraceDraftPlacementResult {
    trio: PenroseTrio;
    /** 実際に置けたオブジェクトのパス。 */
    paths: string[];
    /** 置いた円弧の曲率メタデータ。曲率スライダーの基準として引き継ぐ。 */
    arcMetadata: Map<string, ArcMetadata>;
    /** 置けなかった図形の数 (座標が潰れていた等)。 */
    skipped: number;
}
/** 3 点を通る円弧を、エディタの円弧 (弦 + ふくらみ) の表し方へ直す。 */
export declare function arcThroughPoints(start: Point2D, through: Point2D, end: Point2D): {
    curvature: number;
    flipped: boolean;
} | null;
/** 16px @ 400x400 と同じ、正規化対角に対する文字の大きさの割合。 */
export declare const TRACE_DRAFT_FONT_PERCENT = 4;
/** 点マーカーの既定半径 5 @ 400x400 と同じ割合。 */
export declare const TRACE_DRAFT_POINT_PERCENT = 1.25;
/** px 換算した縦横の半径がこの割合以内なら、正円として置く。 */
export declare const TRACE_DRAFT_CIRCLE_TOLERANCE = 0.05;
/** 置くものの「線の太さ・文字の大きさ・点の大きさ」。 */
export interface TraceDraftSizing {
    strokeWidth: number;
    /** Style の fontSize へ書く値 ("48px" 形式)。 */
    fontSize: string;
    /** 点マーカーの半径。 */
    pointSize: number;
}
/**
 * 背景画像の placement から、置くものの大きさを決める。
 *
 * 文字は既存 UI と単位を揃えるため pt (1pt = 4/3px) へ丸めてから px へ戻す。
 * シンプルモードの ±ステッパーがそのまま続きを操作できる値になる。
 */
export declare function traceDraftSizing(placement: BackgroundPlacement): TraceDraftSizing;
/**
 * 下書きを 1 つずつ既存の追加経路 (appendShape) で足す。
 *
 * 手で図形を追加するのと同じ道を通るので、Substance と Style が必ず揃い、
 * 参照の整合性もエディタの他の機能と同じ保証になる。太さ・文字・点の
 * 大きさは placement から逆算した値で置く。
 */
export declare function placeTraceDraft(trio: PenroseTrio, shapes: readonly TraceDraftShape[], placement: BackgroundPlacement): TraceDraftPlacementResult;
