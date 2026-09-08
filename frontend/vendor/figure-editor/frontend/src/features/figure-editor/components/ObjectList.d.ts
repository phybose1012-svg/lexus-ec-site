import type { PenroseTrio } from "../lib/types";
interface ObjectListProps {
    trio: PenroseTrio | null;
    orderedPaths: string[];
    groups: string[][];
    selectedPath: string | null;
    multiSelPaths: string[];
    hiddenPaths: Set<string>;
    lockedPaths?: ReadonlySet<string>;
    onSelect: (path: string, additive: boolean) => void;
    onToggleHide: (path: string) => void;
    onReorder: (draggedPath: string, targetPath: string, position: "before" | "after") => void;
}
export declare function ObjectList({ trio, orderedPaths, groups, selectedPath, multiSelPaths, hiddenPaths, lockedPaths, onSelect, onToggleHide, onReorder, }: ObjectListProps): import("react").JSX.Element;
export {};
