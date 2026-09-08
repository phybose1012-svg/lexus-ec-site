import type { JSONContent } from "@tiptap/core";
export interface MixedTextEditorProps {
    /** Tiptap / ProseMirror JSON。省略時は空の1段落で開始する。 */
    initialContent?: JSONContent | null;
    /** 編集のたびに呼ばれる。保存前プレビューなどに利用できる。 */
    onChange?: (content: JSONContent) => void;
    /** 「適用」または Ctrl/Cmd+Enter で呼ばれる。 */
    onCommit: (content: JSONContent) => void;
    /** 「キャンセル」または本文編集中の Escape で呼ばれる。 */
    onCancel: () => void;
    autofocus?: boolean;
    /** 図形エディターの小さなオーバーレイ向けに余白を詰める。 */
    compact?: boolean;
    className?: string;
    /** 編集領域の最小高。数値は px、文字列なら CSS 値として扱う。 */
    minHeight?: number | string;
    /** 未指定の文字が継承する基準サイズ（pt）。 */
    defaultFontSizePt?: number;
    /** 未指定の段落が継承する基準行高。 */
    defaultLineHeight?: number;
}
/**
 * 日本語本文と MathLive 数式を同じ領域で編集する自己完結型エディター。
 *
 * 教材エディターと同じ MathInline / MathNodeView / MathKeyboard および
 * mathEditingState を直接使うため、文章⇄数式の切替、Alt+=、お気に入り、
 * 数式キーボードの配置・サイズ設定が共通になる。
 */
export declare function MixedTextEditor({ initialContent, onChange, onCommit, onCancel, autofocus, compact, className, minHeight, defaultFontSizePt, defaultLineHeight, }: MixedTextEditorProps): import("react").JSX.Element;
