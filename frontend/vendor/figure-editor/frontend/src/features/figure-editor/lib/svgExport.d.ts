export declare const EDITOR_ONLY_SVG_SELECTOR = "[data-mp-editor-only=\"true\"]";
/**
 * Remove editor overlays from a cloned SVG before any save, PNG conversion or
 * library upload. The live preview is intentionally left untouched.
 */
export declare function removeEditorOnlySvgElements(root: ParentNode): void;
/** Remove logical tombstones from an export clone without mutating preview DOM. */
export declare function removeDeletedSvgShapes(root: ParentNode, deletedPaths: ReadonlySet<string>): void;
