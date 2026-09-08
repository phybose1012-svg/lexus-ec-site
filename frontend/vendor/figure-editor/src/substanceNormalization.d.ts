/**
 * Put explicit `Label ...` statements after the last `AutoLabel All`.
 *
 * Penrose applies label directives in source order, so a trailing
 * `AutoLabel All` silently replaces every explicit label that precedes it.
 * This normalization keeps the broad automatic default first and the explicit
 * labels last, without reformatting the rest of the Substance program.
 *
 * Only physical line contents are reordered. Existing LF/CRLF separators,
 * comments, blank lines, and the presence or absence of a trailing newline are
 * retained exactly. Moved labels and all untouched lines keep their relative
 * order, making the transform idempotent.
 */
export declare function normalizeSubstanceLabelOrder(substance: string): string;
