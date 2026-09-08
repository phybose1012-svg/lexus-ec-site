interface LabelInputDialogProps {
    initialValue?: string;
    /** ダイアログ見出し（省略時は新規追加用の「ラベルを入力」）。 */
    title?: string;
    /** 確定ボタンの文言（省略時は「追加」）。 */
    confirmLabel?: string;
    onConfirm: (value: string) => void;
    onCancel: () => void;
}
export declare function LabelInputDialog({ initialValue, title, confirmLabel, onConfirm, onCancel, }: LabelInputDialogProps): import("react").JSX.Element;
export {};
