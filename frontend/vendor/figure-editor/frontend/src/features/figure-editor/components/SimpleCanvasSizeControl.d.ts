import { type CanvasDimensions, type CanvasFormat, type CanvasGuideSettings } from "../lib/canvasViewport";
interface SimpleCanvasSizeControlProps {
    dimensions: CanvasDimensions | null;
    format: CanvasFormat;
    guides: CanvasGuideSettings;
    disabled?: boolean;
    onApply: (dimensions: CanvasDimensions, format: CanvasFormat, guides: CanvasGuideSettings) => boolean | void | Promise<boolean | void>;
}
export type SimplePreset = "a4-landscape" | "a4-portrait" | "square";
/**
 * プリセットを選んだときに適用する寸法と format。
 *
 * **format は必ず作り直す。** 正方形は現在の寸法から縦横比だけ変えるので、
 * A4 から来たときに用紙の印 (paper: "a4") がそのまま残ると、画面は 1:1 なのに
 * 書き出しだけ A4 の比 (2480x3508) になり、図が縦に 1.41 倍伸びる。
 * canvasMillimetreSize は format.paper を最優先するため、寸法をいくら正方形に
 * しても印が残っている限り紙の実寸が勝つ。しかも updateCanvasFormat が印を
 * Style へ書き戻すので、保存すると伸びた状態が固定される。
 *
 * 印は寸法から引き直す（フル UI の CanvasSizeControl と同じ流儀）。
 */
export declare function simpleCanvasPresetTarget(preset: SimplePreset, dimensions: CanvasDimensions, format: CanvasFormat): {
    dimensions: CanvasDimensions;
    format: CanvasFormat;
};
export declare function SimpleCanvasSizeControl({ dimensions, format, guides, disabled, onApply, }: SimpleCanvasSizeControlProps): import("react").JSX.Element | null;
export {};
