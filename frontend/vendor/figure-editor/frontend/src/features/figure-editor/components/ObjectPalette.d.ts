import { type ReactNode } from "react";
export interface ObjectPaletteProps {
    /** ✕ で閉じる。見出しのボタン側の開閉は呼び出し元が持つ。 */
    onClose: () => void;
    /** 道具のボタン（2 列のグリッドの升目として並べる）。 */
    children: ReactNode;
}
export declare function ObjectPalette({ onClose, children }: ObjectPaletteProps): import("react").ReactPortal;
