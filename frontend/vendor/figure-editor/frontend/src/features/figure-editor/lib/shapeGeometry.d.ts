import type { Point2D } from "./shapeBuilders";
import type { PenroseTrio } from "./types";
import { type CurveChain } from "./curveChain";
export interface ShapeGeometry {
    shapeType: string;
    points: Point2D[];
    sourceParameters?: number[];
    curveChain?: CurveChain;
}
type LinePointPair = [[number, number], [number, number]];
/**
 * Penrose trims the SVG line primitive to make room for arrowhead markers.
 * Editing must use the semantic endpoints before that render-only trimming,
 * otherwise every drag permanently shortens the line.
 */
export declare function restoreArrowTrimmedLineEndpoints(rendered: LinePointPair, startInset: number, endInset: number): LinePointPair;
/**
 * Exact inverse of restoreArrowTrimmedLineEndpoints: reapply the render-only
 * trimming Penrose performs in makeRoomForArrows. Live previews that rewrite
 * the rendered <line> must go through this, otherwise the arrowhead overshoots
 * the cursor during the drag and jumps back by the arrow length on commit.
 */
export declare function trimLineEndpointsForArrows(semantic: LinePointPair, startInset: number, endInset: number): LinePointPair;
export declare function lineArrowMarkerInsets(lineEl: SVGGraphicsElement): {
    start: number;
    end: number;
};
export declare function getShapeGeometryFromSVG(host: HTMLElement, path: string): ShapeGeometry | null;
export declare function getShapeGeometry(trio: PenroseTrio, path: string): ShapeGeometry | null;
export {};
