export declare function activeSelectionPaths(selectedPath: string | null, multiSelectedPaths: readonly string[], groups: readonly (readonly string[])[]): string[];
/**
 * Repeated clicks walk front-to-back through all objects under the pointer.
 * A logical group or multi-selection is treated as one active unit and skipped
 * together when choosing the next object.
 */
export declare function nextSelectionPath(candidatePaths: readonly string[], activePaths: readonly string[]): string | null;
/** The active object wins drag gestures even when another layer is in front. */
export declare function preferredDragPath(candidatePaths: readonly string[], activePaths: readonly string[]): string | null;
