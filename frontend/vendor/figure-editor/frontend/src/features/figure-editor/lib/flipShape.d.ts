import type { Point2D } from "./shapeBuilders";
import type { PenroseTrio } from "./types";
import type { ArcMetadataMap } from "./arcMetadata";
export type FlipAxis = "horizontal" | "vertical";
/** 反転できなかった形状と、その理由。 */
export interface FlipSkip {
    path: string;
    reason: string;
}
export interface FlipResult {
    trio: PenroseTrio;
    arcMetadata: ArcMetadataMap;
    flipped: string[];
    skipped: FlipSkip[];
    /**
     * 折り返しの基準点。呼び出し側が originalPoints など「trio の外に持って
     * いる点列」を同じ基準で折り返せるように返す。ここを揃えないと、なぞり
     * 由来の折れ線を「なめらか」で作り直したときに反転前へ巻き戻る。
     */
    center: Point2D;
}
export declare function mirrorPoint(point: Point2D, axis: FlipAxis, center: Point2D): Point2D;
/** 選択全体の外接矩形の中心。1 つも読めなければ null。 */
export declare function selectionFlipCenter(trio: PenroseTrio, paths: string[]): Point2D | null;
/**
 * 選択された形状をまとめて裏返す。基準は選択全体の外接矩形の中心なので、
 * 1 つでも複数でも「その場で裏返る」。
 */
export declare function flipShapes(trio: PenroseTrio, paths: string[], axis: FlipAxis, arcMetadata?: ArcMetadataMap): FlipResult | null;
