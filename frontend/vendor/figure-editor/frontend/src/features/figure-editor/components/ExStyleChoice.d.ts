import { type ExStyleId } from "../../../../../shared/exStyles";
export interface ExStyleChoiceProps {
    value: ExStyleId;
    onChange: (value: ExStyleId) => void;
    /**
     * 見出しと 1 行説明を省いて、ボタンだけを出す。説明は title に入る。
     * 帯（生成後の知らせ）のように横幅が限られる場所で使う。
     */
    compact?: boolean;
    disabled?: boolean;
}
export declare function ExStyleChoice({ value, onChange, compact, disabled, }: ExStyleChoiceProps): import("react").JSX.Element;
