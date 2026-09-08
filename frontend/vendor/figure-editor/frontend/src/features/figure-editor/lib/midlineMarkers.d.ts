import type { PenroseTrio } from "./types";
import { type MidlineMarkerSetting } from "../../../../../src/midlineMarkerEngine";
export type { MidlineMarkerCount, MidlineMarkerKind, MidlineMarkerSetting, } from "../../../../../src/midlineMarkerEngine";
export declare function getMidlineMarker(trio: PenroseTrio, path: string): MidlineMarkerSetting | null;
export declare function setMidlineMarker(trio: PenroseTrio, path: string, setting: MidlineMarkerSetting | null): PenroseTrio;
export declare function removeMidlineMarkers(trio: PenroseTrio, paths: readonly string[]): PenroseTrio;
export declare function copyMidlineMarker(source: PenroseTrio, sourcePath: string, target: PenroseTrio, targetPath: string): PenroseTrio;
