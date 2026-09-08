import { type CanvasDimensions, type CanvasFormat, type CanvasGuideSettings } from "./canvasViewport";
export type CanvasGuideLineKind = "center" | "margin";
export interface CanvasGuideFrame {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface CanvasGuideLine {
    id: "center-horizontal" | "center-vertical" | "margin-top" | "margin-right" | "margin-bottom" | "margin-left";
    kind: CanvasGuideLineKind;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
/**
 * Convert document guide settings into SVG-user-space line segments.
 *
 * Margin values are stored in millimetres. Mapping them through the logical
 * canvas dimensions keeps the overlay correct even if a renderer emits a
 * viewBox with a non-zero origin.
 */
export declare function canvasGuideLines(dimensions: CanvasDimensions, format: CanvasFormat, settings: CanvasGuideSettings, frame: CanvasGuideFrame): CanvasGuideLine[];
