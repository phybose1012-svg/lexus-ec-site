import { type CanvasDimensions, type CanvasFormat } from "../lib/canvasViewport";
interface NewBlankCanvasDialogProps {
    onConfirm: (dimensions: CanvasDimensions, format: CanvasFormat) => void;
    onCancel: () => void;
}
/**
 * 白紙から描き始めるときのサイズ選択。
 *
 * 用途によって必要な寸法が大きく違う (印刷物 mm / 画面 px) ので、代表的な
 * ものだけを提示して即座に描き始められるようにする。細かい寸法は作成後に
 * 「キャンバス」パネルで調整できるため、ここでは直接入力を持たせない。
 */
export declare function NewBlankCanvasDialog({ onConfirm, onCancel, }: NewBlankCanvasDialogProps): import("react").JSX.Element;
export {};
