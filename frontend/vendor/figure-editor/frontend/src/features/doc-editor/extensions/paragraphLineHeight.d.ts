import { Extension } from "@tiptap/core";
declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        paragraphLineHeight: {
            /** カーソルのある段落の行の高さを設定する */
            setParagraphLineHeight: (lineHeight: string) => ReturnType;
            /** 行の高さを既定（用紙設定の値）に戻す */
            unsetParagraphLineHeight: () => ReturnType;
        };
    }
}
export declare const ParagraphLineHeight: Extension<any, any>;
