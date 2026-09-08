export interface SvgPoint {
    x: number;
    y: number;
}
type AttributeReader = (name: string) => string | null;
export declare function parseSvgPoints(value: string): SvgPoint[];
export declare function isPointInPolygon(point: SvgPoint, polygon: SvgPoint[]): boolean;
/**
 * Hit-tests the interior of basic closed SVG geometry without consulting its
 * visual fill. Editors should allow a transparent closed shape to be grabbed
 * from its interior just like a filled shape.
 */
export declare function isPointInBasicClosedShape(tagName: string, readAttribute: AttributeReader, point: SvgPoint): boolean;
export {};
