import type { ArcMetadataMap } from "./arcMetadata";
import type { RegularPolygonMetadataMap } from "./regularPolygonMetadata";
import type { Point2D } from "./shapeBuilders";
import type { PenroseTrio } from "./types";
export interface GeometryMetadataState {
    arcMetadata: ArcMetadataMap;
    regularPolygonMetadata: RegularPolygonMetadataMap;
    originalPoints: Map<string, Point2D[]>;
    originalPointCounts: Map<string, number>;
    smoothnessLevel: Map<string, number>;
}
/**
 * Detects a manual body-field edit that can indirectly move symbolic `d` or
 * `points` even though those two property strings themselves stayed unchanged.
 */
export declare function shapeGeometryReferencesProperties(trio: PenroseTrio, path: string, propertyNames: readonly string[]): boolean;
/**
 * Reconciles editor-only geometry baselines after a whole/body Trio replacement.
 *
 * Arc and smoothness controls intentionally keep semantic state outside Penrose.
 * Reusing that state after `d`, `points`, shape type, or path identity changed
 * can regenerate the old geometry and overwrite a manual/AI edit. Changed
 * literal point lists are therefore rebased; symbolic lists are cleared and
 * lazily reconstructed from the newly rendered SVG on the next selection.
 */
export declare function reconcileGeometryMetadata(before: PenroseTrio, after: PenroseTrio, current: GeometryMetadataState, affectedPaths?: readonly string[]): GeometryMetadataState;
