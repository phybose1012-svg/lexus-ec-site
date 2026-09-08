export declare class EmbeddedSvgImageError extends Error {
    constructor(message: string);
}
/**
 * Resolve the only Image source that can be made self-contained and safe in
 * both the browser editor and the server renderer.
 *
 * Penrose substitutes its own "not found" drawing when a resolver returns
 * undefined. Throwing for unsupported/unreadable sources is deliberate: the
 * caller must not accept a placeholder as a successfully rendered Image.
 */
export declare function resolveEmbeddedSvgImage(source: string): Promise<string>;
/**
 * Audit already-decoded SVG markup and return the form Penrose may insert.
 *
 * Exposed so that a caller which obtained the SVG some other way — the object
 * storage background resolver builds one around a fetched PNG — passes through
 * exactly the same checks as an embedded data URI, rather than growing a second
 * and inevitably weaker sanitizer.
 */
export declare function sanitizeEmbeddedSvgMarkup(decoded: string): string;
