interface Props {
    onClose: () => void;
    /** このパネルで隠したくない領域 (数式編集ダイアログなど)。 */
    avoidRect?: () => DOMRect | null;
}
export declare function MathKeyboard({ onClose, avoidRect }: Props): import("react").ReactPortal;
export {};
