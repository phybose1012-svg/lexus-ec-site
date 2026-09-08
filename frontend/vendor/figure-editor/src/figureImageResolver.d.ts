/**
 * The Image resolver Penrose is handed when rendering a figure.
 *
 * Documents may name a MAX precision background that lives in object storage
 * instead of carrying its bytes. The reference is `fibona-bg:<sha256>` and
 * nothing else: not a URL. A document therefore still cannot point the renderer
 * at an arbitrary host, which is the property `embeddedSvgImageResolver` exists
 * to guarantee — the caller supplies the one function that can turn a digest
 * into bytes, and the fetched PNG is wrapped and then audited by the very same
 * sanitizer an embedded image goes through.
 *
 * Every other href keeps the previous behaviour exactly.
 */
export declare const BACKGROUND_REFERENCE_SCHEME = "fibona-bg:";
/** The digest of a well-formed background reference, or null. */
export declare function parseBackgroundReference(href: string): string | null;
export declare function isBackgroundReference(href: string): boolean;
/** Wrap a background PNG in the same self-contained SVG an embedded one uses. */
export declare function backgroundSvgMarkup(png: Uint8Array): string;
/** The embedded href form, byte-for-byte what the pipeline writes inline. */
export declare function backgroundDataUrl(png: Uint8Array): string;
/** Every distinct background a Style references, in first-seen order. */
export declare function collectBackgroundReferences(style: string): string[];
export type BackgroundLoader = (digest: string) => Promise<Uint8Array>;
/**
 * Build the resolver for a rendering context. Without a loader, background
 * references cannot be resolved and say so, instead of letting Penrose draw its
 * "not found" placeholder as if the figure had rendered.
 */
export declare function createFigureImageResolver(loadBackground?: BackgroundLoader): (href: string) => Promise<string>;
