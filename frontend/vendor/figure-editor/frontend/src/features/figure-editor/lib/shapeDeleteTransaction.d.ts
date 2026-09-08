import type { PenroseTrio } from "./types";
export type ShapeDeleteTransaction = {
    ok: true;
    trio: PenroseTrio;
    /** Paths that were removed from the Trio source. */
    deletedPaths: string[];
    /**
     * Concrete shared paths that remain as Penrose dependency anchors but
     * must be treated as deleted by the editor.
     */
    logicallyDeletedPaths: string[];
} | {
    ok: false;
    trio: PenroseTrio;
    failedPath: string;
};
/**
 * Delete a set of objects as one transaction.
 *
 * `deleteShapeByPath` deliberately returns the original Trio when an
 * individual deletion would make a shared Style definition ambiguous. Such a
 * path is still a valid editor object: keep its Penrose source as a dependency
 * anchor and return it in `logicallyDeletedPaths` so the caller can remove it
 * from the editor-facing object set. Only a path that did not resolve in the
 * source Trio makes the whole transaction fail.
 */
export declare function deleteShapesAtomically(source: PenroseTrio, paths: readonly string[]): ShapeDeleteTransaction;
