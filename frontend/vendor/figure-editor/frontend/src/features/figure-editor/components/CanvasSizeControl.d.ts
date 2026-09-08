import { type CanvasDimensions, type CanvasFormat, type CanvasGuideSettings } from "../lib/canvasViewport";
interface CanvasSizeControlProps {
    dimensions: CanvasDimensions | null;
    format: CanvasFormat;
    guides: CanvasGuideSettings;
    disabled?: boolean;
    onApply: (dimensions: CanvasDimensions, format: CanvasFormat, guides: CanvasGuideSettings) => boolean | void | Promise<boolean | void>;
}
export declare function CanvasSizeControl({ dimensions, format, guides, disabled, onApply, }: CanvasSizeControlProps): import("react").JSX.Element | null;
export {};
