export type MathEnterSide = "start" | "end";
/** MathNodeView がマウント時に登録する。戻り値は解除関数 */
export declare function registerMathEnter(el: Element, fn: (side: MathEnterSide) => void): () => void;
/**
 * nodeDOM(pos) の要素（またはその子孫のラッパー）に登録された編集開始を呼ぶ。
 * 見つからなければ false（呼び出し側はデフォルトのキャレット移動に任せる）。
 */
export declare function requestMathEnter(root: Element, side: MathEnterSide): boolean;
