interface SvgLibraryDialogProps {
    onPick: (file: File) => void;
    onPickFromDisk: () => void;
    onCancel: () => void;
}
/**
 * SVG を置いてあるフォルダの中身を、アプリの中に一覧する。
 *
 * ブラウザは OS のファイル選択ダイアログの初期フォルダを指定できないので、
 * 「毎回そのフォルダが開く」は作れない。代わりにフォルダを 1 回だけ覚えて、
 * 次からはここに並べる。OS のダイアログを開かない分だけ速い。
 *
 * 対応していないブラウザでは、そもそもこのダイアログを出さずに従来の
 * ファイル選択へ落とす（呼び出し側の責任）。
 */
export declare function SvgLibraryDialog({ onPick, onPickFromDisk, onCancel, }: SvgLibraryDialogProps): import("react").JSX.Element;
export {};
