export type FieldKind = "string" | "number" | "color" | "point" | "pointList" | "boolean" | "expression";
export interface ParsedField {
    name: string;
    raw: string;
    kind: FieldKind;
}
export type ShapeFields = Map<string, ParsedField>;
export declare function parseShapeBody(body: string): ShapeFields;
export declare function writeField(body: string, fieldName: string, newRaw: string): string;
export interface ColorRGBA {
    r: number;
    g: number;
    b: number;
    a: number;
}
export declare function parseColor(raw: string): ColorRGBA | null;
export declare function writeColor(c: ColorRGBA): string;
export interface Point2D {
    x: number;
    y: number;
}
export declare function parsePoint(raw: string): Point2D | null;
export declare function writePoint(p: Point2D): string;
export declare function parseString(raw: string): string;
export declare function writeString(s: string): string;
export declare function isDashed(fields: ShapeFields): boolean;
export declare function parsePointList(raw: string): Point2D[];
/**
 * Pick the editable baseline for a Polyline/Polygon point list.
 *
 * Penrose can render symbolic coordinates such as `(curve.cx - 10, curve.cy)`,
 * but the editor intentionally does not evaluate arbitrary Style expressions.
 * In that case the compiled SVG coordinates are supplied as a safe numerical
 * fallback. Literal Trio coordinates remain authoritative when available.
 */
export declare function resolvePointEditingBaseline(raw: string, renderedPoints?: Point2D[]): Point2D[];
export declare function serializePointList(points: Point2D[]): string;
export declare function resamplePointsAtLevel(original: Point2D[], K: number): Point2D[];
export declare function inferResampleLevel(originalCount: number, currentCount: number): number | null;
export declare function smoothenPoints(points: Point2D[]): Point2D[];
export declare function coarsenPoints(points: Point2D[]): Point2D[];
