import type { Point2D } from "./shapeBuilders";
export interface ArcMetadata {
    start: Point2D;
    end: Point2D;
    angleU: number;
    flipped: boolean;
}
export type ArcMetadataMap = Map<string, ArcMetadata>;
/**
 * 円弧を複製したとき、Trio 本体とは別に保持している編集用メタデータも
 * 新しい path へ引き継ぐ。始点・終点は図形本体と同じ移動量だけずらす。
 */
export declare function copyArcMetadataForDuplicate(metadata: ArcMetadataMap, sourcePath: string, targetPath: string, dx: number, dy: number): ArcMetadataMap;
