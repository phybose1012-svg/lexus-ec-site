import type { PenroseTrio } from "../lib/types";
import { type BatchFieldName } from "../lib/batchEdit";
import type { CanvasDimensions } from "../lib/canvasViewport";
interface MultiEditPanelProps {
    trio: PenroseTrio;
    paths: string[];
    canvasDimensions: CanvasDimensions;
    onBatchField: (name: Exclude<BatchFieldName, "strokeDasharray">, raw: string) => void;
    onBatchDash: (dashed: boolean) => void;
    onFillRegion: () => void;
    onGroup: () => void;
    onUngroup: () => void;
    onEnableShared: () => void;
    onDetachShared: () => void;
    isGroup: boolean;
    /** 選択した形状を控える（別のタブへ貼り付けるため）。 */
    onCopyAll: () => void;
    onDuplicateAll: () => void;
    onHideAll: () => void;
    onDeleteAll: () => void;
    onClear: () => void;
}
export declare function MultiEditPanel({ trio, paths, canvasDimensions, onBatchField, onBatchDash, onFillRegion, onGroup, onUngroup, onEnableShared, onDetachShared, isGroup, onCopyAll, onDuplicateAll, onHideAll, onDeleteAll, onClear, }: MultiEditPanelProps): import("react").JSX.Element;
export {};
