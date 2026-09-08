export declare const DEFAULT_REGULAR_POLYGON_SIDES = 5;
export declare const MIN_REGULAR_POLYGON_SIDES = 3;
export declare const MAX_REGULAR_POLYGON_SIDES = 500;
export interface RegularPolygonMetadata {
    sides: number;
}
export type RegularPolygonMetadataMap = Map<string, RegularPolygonMetadata>;
/** Normalize a requested side count to a finite integer supported by the editor. */
export declare function normalizeRegularPolygonSides(value: unknown): number;
/**
 * Restore persisted editor metadata without letting malformed entries mark an
 * unrelated Polygon as a user-created regular polygon.
 */
export declare function regularPolygonMetadataFromRecord(value: unknown): RegularPolygonMetadataMap;
/** Copy editor-only side-count metadata to a duplicated shape path. */
export declare function copyRegularPolygonMetadataForDuplicate(metadata: RegularPolygonMetadataMap, sourcePath: string, targetPath: string): RegularPolygonMetadataMap;
