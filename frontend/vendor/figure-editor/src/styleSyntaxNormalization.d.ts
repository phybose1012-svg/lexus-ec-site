/**
 * Penrose Style list literals only accept horizontal whitespace between `[`
 * and `]`; a physical newline anywhere in the list is a syntax error.
 *
 * This scanner flattens only balanced list expressions in executable Style
 * code. Brackets in strings and comments are ignored, unmatched lists are
 * left intact, and lists containing line comments fail closed because removing
 * their newline would extend the comment over later values.
 */
export declare function collapseMultilineStyleLists(style: string): string;
