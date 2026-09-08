import type { PenroseTrio } from "./lib/types";
export interface FigureEditorProps {
    onSave?: (svg: string, trio: PenroseTrio) => void;
    onSaveToCloud?: (svg: string, trio: PenroseTrio) => void;
    onRegisterLibrary?: (svg: string, trio: PenroseTrio) => void;
    onInsertToDoc?: (svg: string, trio: PenroseTrio) => void;
    initialTrio?: PenroseTrio;
    externalTrio?: PenroseTrio | null;
    externalTrioNonce?: number;
    onExternalTrioConsumed?: (nonce: number) => void;
    workspaceTabId?: string;
    onNewTab?: () => void;
    onDuplicateTab?: () => void;
    onImportTrioAsNewTab?: (trio: PenroseTrio, title?: string) => boolean;
    allowSvgImport?: boolean;
    className?: string;
    allowGenerate?: boolean;
    allowMaxMode?: boolean;
    allowAiEdit?: boolean;
    exportFormats?: ("png" | "svg" | "trio")[];
    uiProfile?: "simple" | "full";
}
export declare function FigureEditor({ onSave, onSaveToCloud, onRegisterLibrary, onInsertToDoc, initialTrio, onImportTrioAsNewTab, allowSvgImport, externalTrio, externalTrioNonce, onExternalTrioConsumed, workspaceTabId, onNewTab, onDuplicateTab, className, allowGenerate, allowMaxMode, allowAiEdit, exportFormats, uiProfile, }?: FigureEditorProps): import("react").JSX.Element;
