import type { JSONContent } from "@tiptap/core";
interface FigureTextEditorDialogProps {
    initialContent?: JSONContent | null;
    defaultFontSizePt: number;
    defaultLineHeight: number;
    onCommit: (content: JSONContent) => void;
    onCancel: () => void;
}
export declare function FigureTextEditorDialog({ initialContent, defaultFontSizePt, defaultLineHeight, onCommit, onCancel, }: FigureTextEditorDialogProps): import("react").JSX.Element;
export {};
