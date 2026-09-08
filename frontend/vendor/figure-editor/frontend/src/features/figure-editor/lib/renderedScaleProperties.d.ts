export type RenderedScaleProperties = Record<string, string>;
/**
 * Reads the numeric dimensions that produced the current SVG primitive.
 *
 * These values are used only when the Trio property is omitted or expressed
 * through another Style variable and therefore cannot be scaled by rewriting
 * its source text. Returning Style-compatible literals lets the editor
 * materialize an instance override that matches the live preview.
 */
export declare function readRenderedScaleProperties(owner: SVGElement, shapeType: string): RenderedScaleProperties;
