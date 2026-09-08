import type { RecognizedCandidate } from "../lib/strokeRecognition";
export interface FreehandPickerBarProps {
    /** 差し替え対象の図形。バーの置き場所はこの図形の外接矩形から決める。 */
    path: string;
    candidates: RecognizedCandidate[];
    index: number;
    onChoose: (index: number) => void;
    onConfirm: () => void;
    /** 置いたばかりの図形を取り消してバーを閉じる（1 タップで無かったことに）。 */
    onDiscard: () => void;
}
export declare function FreehandPickerBar({ path, candidates, index, onChoose, onConfirm, onDiscard, }: FreehandPickerBarProps): import("react").JSX.Element;
