/**
 * Converts SVG source into an inert image resource.
 *
 * Security invariant: the returned URL is safe only when it is assigned to an
 * image-loading context such as <img src>. It is deliberately not a sanitizer
 * and must never be injected as markup or loaded in an iframe/object.
 *
 * SVG image documents keep legitimate foreignObject rich text and their local
 * styles, while browsers disable scripts and keep their DOM/CSS separate from
 * the parent document.
 */
export declare function svgToIsolatedImageDataUrl(svg: string): string;
