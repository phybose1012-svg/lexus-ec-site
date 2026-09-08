/**
 * Add display-only defaults for arrow controls when older or generated shapes
 * omit Penrose's optional arrowhead fields. The caller should still write edits
 * against the original body so untouched defaults are not persisted.
 */
export declare function withEditableArrowheadFields(body: string, shapeType: string): string;
