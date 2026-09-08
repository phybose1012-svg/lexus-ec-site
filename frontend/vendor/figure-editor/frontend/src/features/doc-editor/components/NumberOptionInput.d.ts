/**
 * 数値をクリックしてそのまま打ち替えられる入力欄 + 全選択肢を出す ▾ ボタン。
 * 直接入力と選択肢は独立しており、入力内容で選択肢が絞り込まれることはない。
 * 入力欄: Enter / フォーカスアウトで確定、Esc で取り消し、空にして確定すると
 * 「既定」(onClear) に戻る。
 */
export declare function NumberOptionInput({ value, placeholder, options, min, max, digits, widthClass, ariaLabel, title, onApply, onClear, }: {
    /** 現在の設定値 (既定に従っているときは "")。 */
    value: string;
    placeholder: string;
    options: readonly string[];
    min: number;
    max: number;
    /** 丸める小数桁数。 */
    digits: number;
    widthClass: string;
    ariaLabel: string;
    title?: string;
    onApply: (value: string) => void;
    onClear: () => void;
}): import("react").JSX.Element;
