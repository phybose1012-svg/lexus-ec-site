export interface DragSelection {
    paths: string[];
    isGroup: boolean;
}
interface ResolveDragSelectionOptions {
    pickedPath: string;
    selectedPath: string | null;
    multiSelectedPaths: string[];
    groups: string[][];
    shiftKey: boolean;
}
/**
 * Resolve one pointer gesture to the logical objects that should move.
 *
 * Direct manipulation is intentionally limited to the active selection. This
 * lets a selected rear-layer object keep ownership of the next drag even when
 * another object is painted in front of it. Shift-click remains reserved for
 * selection toggling.
 */
export declare function resolveDragSelection({ pickedPath, selectedPath, multiSelectedPaths, groups, shiftKey, }: ResolveDragSelectionOptions): DragSelection | null;
export {};
