import type { CanvasDimensions } from "./canvasViewport";
export declare const DEFAULT_STROKE_WIDTH_PERCENT = 0.25;
/**
 * SVG percentages use the normalized viewport diagonal as their reference:
 * sqrt(width^2 + height^2) / sqrt(2). Using the same reference keeps line
 * thickness stable across square, portrait and landscape canvases.
 */
export declare function canvasStrokeReference(dimensions: CanvasDimensions): number;
export declare function strokeWidthToPercent(strokeWidth: number, dimensions: CanvasDimensions): number;
export declare function strokeWidthFromPercent(percent: number, dimensions: CanvasDimensions): number;
export declare function formatStrokeWidth(value: number): string;
