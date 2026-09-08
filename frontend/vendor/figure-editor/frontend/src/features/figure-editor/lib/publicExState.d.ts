import type { PenroseTrio } from "./types";
/** Defense in depth: never persist private EX fields from an old backend. */
export declare function toPublicExTrio(trio: PenroseTrio): PenroseTrio;
