import { type ColorRGBA } from "../lib/styleParser";
import type { CanvasDimensions } from "../lib/canvasViewport";
export interface SmoothnessControls {
    level: number;
    canUp: boolean;
    canDown: boolean;
    onUp: () => void;
    onDown: () => void;
}
export declare function readRectangleRoundness(body: string): number;
export declare function writeRectangleRoundness(body: string, value: number): string;
interface PropertyEditorProps {
    body: string;
    shapeType: string;
    onChange: (newBody: string) => void;
    minPointsCount?: number;
    smoothness?: SmoothnessControls;
    allowedFields?: readonly string[];
    hiddenFields?: readonly string[];
    canvasDimensions?: CanvasDimensions | null;
}
export declare function PropertyEditor({ body, shapeType, onChange, minPointsCount, smoothness, allowedFields, hiddenFields, canvasDimensions, }: PropertyEditorProps): import("react").JSX.Element;
export declare function labelFor(name: string, shapeType: string): string;
export declare function NumberInput({ value, onChange, step, min, max, }: {
    value: number;
    onChange: (n: number) => void;
    step?: number | "any";
    min?: number;
    max?: number;
}): import("react").JSX.Element;
export declare function ColorInput({ value, onChange, activateTransparentOnColorPick, }: {
    value: ColorRGBA | null;
    onChange: (c: ColorRGBA) => void;
    activateTransparentOnColorPick?: boolean;
}): import("react").JSX.Element;
export {};
