import type { LayerOrderCommand } from "./layerOrder";
export interface DeleteShortcutContext {
    key: string;
    ctrlKey: boolean;
    metaKey: boolean;
    altKey: boolean;
    shiftKey: boolean;
    isEditingText: boolean;
    hasSelection: boolean;
    blocked: boolean;
}
export declare function shouldTriggerFigureDeleteShortcut(context: DeleteShortcutContext): boolean;
export interface ClipboardShortcutContext {
    /** 文字入力中か（入力欄の中の Ctrl+C/V は横取りしない）。 */
    isEditingText: boolean;
    /** ダイアログ・切り抜き・生成中など、編集を受け付けない状態か。 */
    blocked: boolean;
}
/**
 * 図形のコピーを図形エディタが引き受けてよいか。
 *
 * `copy` / `paste` イベントで判定する（keydown ではなく）。Windows の Ctrl+C と
 * macOS/iPad の Cmd+C、右クリックメニューのコピーが同じ 1 本にまとまるうえ、
 * 「OS のクリップボードの画像を貼る」既存の経路と同じ土俵で順番を決められる。
 */
export declare function shouldHandleFigureCopy(context: ClipboardShortcutContext & {
    hasSelection: boolean;
}): boolean;
/** 図形の貼り付けを引き受けてよいか。**選択は要らない**（貼るだけなので）。 */
export declare function shouldHandleFigurePaste(context: ClipboardShortcutContext & {
    hasClipboard: boolean;
}): boolean;
export interface LayerOrderShortcutContext {
    key: string;
    code?: string;
    ctrlKey: boolean;
    metaKey: boolean;
    altKey: boolean;
    shiftKey: boolean;
    isEditingText: boolean;
    hasSelection: boolean;
    blocked: boolean;
}
export declare function resolveLayerOrderShortcut(context: LayerOrderShortcutContext): LayerOrderCommand | null;
