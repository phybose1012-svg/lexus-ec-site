import type { PenroseTrio } from "./types";
import { type ColorRGBA } from "./styleParser";
export declare const TRANSPARENT_LABEL_BACKGROUND: ColorRGBA;
export declare function readLabelBackgroundSettings(style: string): Record<string, ColorRGBA>;
export declare function getLabelBackground(trio: PenroseTrio, path: string): ColorRGBA;
export declare function setLabelBackground(trio: PenroseTrio, path: string, color: ColorRGBA): PenroseTrio;
export declare function removeLabelBackgrounds(trio: PenroseTrio, paths: readonly string[]): PenroseTrio;
export declare function copyLabelBackground(source: PenroseTrio, sourcePath: string, target: PenroseTrio, targetPath: string): PenroseTrio;
/**
 * Penrose's Text and Equation shapes do not expose a rectangular background.
 * Add one without changing the Style program by filtering the titled SVG owner:
 * feFlood paints the owner's bounding box and SourceGraphic is merged above it.
 */
export declare function appendLabelBackgroundsToSvg(svg: SVGSVGElement, style: string): void;
