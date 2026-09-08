import type { PenroseTrio } from "../lib/types";
export interface UIChatMessage {
    role: "user" | "model";
    content: string;
    at: string;
}
export interface SelectedShapeInfo {
    path: string;
    substanceName: string;
    shapeType: string;
}
interface AIChatProps {
    trio: PenroseTrio | null;
    onApplyEdit: (newTrio: PenroseTrio) => void;
    inline?: boolean;
    selectedShapes?: SelectedShapeInfo[];
    floatingLabel?: string;
    floatingAnchorClass?: string;
    onTraceDraft?: () => void | Promise<void>;
    traceDrafting?: boolean;
}
export declare function AIChat({ trio, onApplyEdit, inline, selectedShapes, onTraceDraft, traceDrafting, floatingLabel, floatingAnchorClass, }: AIChatProps): import("react").JSX.Element;
export {};
