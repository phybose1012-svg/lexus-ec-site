import { Node } from "@tiptap/core";
/** Alt+= 相当か（キーボード配列に依存しない判定）。
 *  US 配列: Alt + "="（code=Equal）。JIS 配列: "=" は Shift+"-" なので
 *  Alt+Shift+（code=Minus）でも成立させる。MathNodeView 側の判定と対で使う */
export declare function isMathToggleKey(ev: KeyboardEvent): boolean;
declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        mathInline: {
            /** インライン数式を挿入する。latex 省略時は空で挿入し即編集モードに入る。 */
            insertMathInline: (latex?: string) => ReturnType;
        };
    }
}
export declare function stopEventInMathfield({ event }: {
    event: Event;
}): boolean;
export declare const MathInline: Node<any, any>;
