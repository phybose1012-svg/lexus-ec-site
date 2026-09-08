export interface MathSvgOptions {
    /** 出力先の document。返す要素はここへ import して返す。 */
    target?: Document;
    /** MathJax を動かす window。省略時は globalThis.window。 */
    window?: unknown;
}
/**
 * 使う数式をまとめて組む。DOM を組み立てる前に 1 回だけ呼ぶ。
 *
 * 組めなかった数式は表に入れない。呼び出し側は引けなかったものを従来の
 * 文字表示へ落とせばよく、1 つの数式のせいで図全体を失うことはない。
 * 同じ式が複数回出てきても組むのは 1 回。
 */
export declare function renderMathSvgBatch(latexes: Iterable<string>, options?: MathSvgOptions): Promise<Map<string, SVGElement>>;
