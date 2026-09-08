import { type BackgroundLoader } from "../../../../../src/figureImageResolver";
import type { PenroseTrio } from "./types";
export declare const loadFigureBackground: BackgroundLoader;
/** Test seam: drop everything already downloaded. */
export declare function clearFigureBackgroundCache(): void;
/**
 * Put referenced backgrounds back into the Style as data URIs.
 *
 * A downloaded trio.json has to stand on its own: it outlives the editor
 * session, gets hand-edited, and is fed to the CLI, which has no way to reach
 * object storage. Saving to the library is deliberately not inlined — those
 * figures are read back through the sidecar, which can resolve the reference.
 */
export declare function inlineFigureBackgrounds(trio: PenroseTrio): Promise<PenroseTrio>;
/**
 * Inline only the backgrounds that live in this browser.
 *
 * Cloud saves and library registrations are read back through the sidecar, so a
 * MAX precision background must stay a reference: inlining it would replace a
 * 70-character pointer with megabytes of base64 on every save. A background the
 * user laid down here has no server-side copy, so that one has to travel with
 * the document or it will not resolve on another device.
 */
export declare function inlineLocalFigureBackgrounds(trio: PenroseTrio): Promise<PenroseTrio>;
