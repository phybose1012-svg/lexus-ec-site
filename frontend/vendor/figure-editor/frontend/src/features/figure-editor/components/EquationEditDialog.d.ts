interface EquationEditDialogProps {
    initialLatex: string;
    /** 見出し（省略時は既存の数式を直すときの文言）。 */
    title?: string;
    /** 確定ボタンの文言（省略時は「適用」）。 */
    confirmLabel?: string;
    onCommit: (latex: string) => void;
    onCancel: () => void;
}
export declare function EquationEditDialog({ initialLatex, title, confirmLabel, onCommit, onCancel, }: EquationEditDialogProps): import("react").JSX.Element;
export {};
