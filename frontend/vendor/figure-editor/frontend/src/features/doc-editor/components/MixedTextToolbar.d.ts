import type { Editor } from "@tiptap/react";
interface Props {
    editor: Editor;
    compact?: boolean;
    defaultFontSizePt?: number;
    defaultLineHeight?: number;
}
/**
 * 教材エディターの文章／数式ツールだけを切り出したツールバー。
 *
 * MathNodeView と同じグローバル編集セッションへ接続するため、数式キーボードの
 * お気に入り、行列・場合分け、複数行数式の操作感は教材エディターと共通になる。
 */
export declare function MixedTextToolbar({ editor, compact, defaultFontSizePt, defaultLineHeight, }: Props): import("react").JSX.Element;
export {};
