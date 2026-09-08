/** MathJax がこの文字の字形を持っているか。 */
export declare function mathjaxHasGlyph(codePoint: number): boolean;
/**
 * 文字列を丸ごと Equation（MathJax）で組めるか。
 * 1 文字でも字形が無ければ false。
 */
export declare function mathjaxCanTypeset(text: string): boolean;
/** 組めない文字だけを取り出す（警告の文面に使う）。 */
export declare function unsupportedGlyphs(text: string): string[];
