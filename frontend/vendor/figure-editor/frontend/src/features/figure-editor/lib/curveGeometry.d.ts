import type { Point2D } from "./shapeBuilders";
export type CurveHandleKind = "start" | "control1" | "control2" | "end";
export interface CurveHandles {
    start: Point2D;
    control1?: Point2D;
    control2?: Point2D;
    end: Point2D;
}
export interface CubicCurveHandles extends CurveHandles {
    control1: Point2D;
    control2: Point2D;
}
export interface CurveSample {
    point: Point2D;
    t: number;
}
export declare function parseCubicCurveHandles(raw: string): CubicCurveHandles | null;
export declare function serializeCubicCurveHandles(handles: CurveHandles): string | null;
export declare function moveCurveHandle(handles: CurveHandles, which: CurveHandleKind, point: Point2D): CurveHandles;
export declare function sampleCubicCurve(handles: CurveHandles, segments?: number): Point2D[];
/** Split a cubic Bezier exactly using de Casteljau's algorithm. */
export declare function splitCubicCurveAt(handles: CurveHandles, rawT: number): [CubicCurveHandles, CubicCurveHandles] | null;
/**
 * Linearize a cubic only for geometry calculations. Flat areas use few points;
 * strongly curved areas subdivide until the control polygon is within the
 * requested tolerance of its chord. The editable Trio remains a Bezier.
 */
export declare function sampleCubicCurveAdaptive(handles: CurveHandles, tolerance?: number, maxDepth?: number): CurveSample[];
/** Split a cubic at ascending global t values while keeping every piece cubic. */
export declare function splitCubicCurveAtParameters(handles: CurveHandles, parameters: number[]): CubicCurveHandles[];
