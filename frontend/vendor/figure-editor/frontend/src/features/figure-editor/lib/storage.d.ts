import type { PenroseTrio, PenroseLLMState } from "./types";
export declare const DEFAULT_SESSION_BYTE_BUDGET = 750000;
export type FigureStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export interface PersistedSession {
    trio: PenroseTrio;
    llmState: PenroseLLMState | null;
    hiddenPaths?: string[];
    deletedPaths?: string[];
    originalPointCounts?: Record<string, number>;
    originalPoints?: Record<string, {
        x: number;
        y: number;
    }[]>;
    smoothnessLevel?: Record<string, number>;
    arcMetadata?: Record<string, {
        start: {
            x: number;
            y: number;
        };
        end: {
            x: number;
            y: number;
        };
        angleU?: number;
        flipped?: boolean;
        curvature?: number;
    }>;
    regularPolygonMetadata?: Record<string, {
        sides: number;
    }>;
    /** 対称に補正した図形の「どの対称か」。画面のガイド専用。 */
    symmetryGuides?: Record<string, "mirror" | "point">;
    history?: PersistedHistoryEntry[];
    future?: PersistedHistoryEntry[];
    layerOrder?: string[];
    groups?: string[][];
    savedAt: string;
}
export interface PersistedGeometryMetadata {
    originalPointCounts: Record<string, number>;
    originalPoints: Record<string, {
        x: number;
        y: number;
    }[]>;
    smoothnessLevel: Record<string, number>;
    arcMetadata: NonNullable<PersistedSession["arcMetadata"]>;
    regularPolygonMetadata?: NonNullable<PersistedSession["regularPolygonMetadata"]>;
    symmetryGuides?: NonNullable<PersistedSession["symmetryGuides"]>;
}
export interface PersistedHistoryEntry extends PersistedGeometryMetadata {
    trio: PenroseTrio;
    hiddenPaths?: string[];
    deletedPaths?: string[];
    layerOrder?: string[];
    groups?: string[][];
}
export type SaveSessionResult = {
    ok: true;
    persistedBytes: number;
    droppedHistory: number;
    droppedFuture: number;
} | {
    ok: false;
    persistedBytes: number;
    droppedHistory: number;
    droppedFuture: number;
    reason: string;
};
/**
 * Keep the live Trio and current editor state authoritative, then discard only
 * the farthest timeline entries until the per-tab session fits its byte budget.
 * History is ordered oldest -> newest; future is ordered next redo -> farthest.
 *
 * Sizes are measured once per entry and then tracked by subtraction. UTF-8 byte
 * length is additive over concatenation, so the running total is exact rather
 * than an estimate. Re-serializing the whole session after every drop instead
 * made this quadratic: a MAX precision figure carries its background as a
 * multi-megabyte data URI inside the Style, and with a full undo history one
 * save took 3.3s on the main thread and ran again on the next keystroke.
 */
export declare function fitSessionToByteBudget(source: PersistedSession, byteBudget?: number): {
    session: PersistedSession;
    raw: string;
    bytes: number;
    droppedHistory: number;
    droppedFuture: number;
};
export declare function loadSession(storage?: FigureStorage): PersistedSession | null;
export declare function saveSession(trio: PenroseTrio, _llmState: PenroseLLMState | null, hiddenPaths?: string[], originalPointCounts?: Record<string, number>, arcMetadata?: PersistedSession["arcMetadata"], originalPoints?: PersistedSession["originalPoints"], smoothnessLevel?: Record<string, number>, storage?: FigureStorage, timeline?: {
    history?: PersistedHistoryEntry[];
    future?: PersistedHistoryEntry[];
    deletedPaths?: string[];
    layerOrder?: string[];
    groups?: string[][];
    regularPolygonMetadata?: PersistedSession["regularPolygonMetadata"];
    symmetryGuides?: PersistedSession["symmetryGuides"];
}, byteBudget?: number): SaveSessionResult;
export declare function clearSession(): void;
export declare function loadGrayscale(): boolean;
export declare function saveGrayscale(on: boolean): void;
export declare function loadLayerOrder(storage?: FigureStorage): string[];
export declare function saveLayerOrder(order: string[], storage?: FigureStorage): boolean;
export declare function loadGroups(storage?: FigureStorage): string[][];
export declare function saveGroups(groups: string[][], storage?: FigureStorage): boolean;
export interface PanelLayout {
    asideWidth?: number;
    listHeight?: number;
}
export declare function loadPanelLayout(): PanelLayout;
export declare function savePanelLayout(layout: PanelLayout): void;
export declare function loadTrioFromFile(file: File): Promise<PenroseTrio>;
export declare function downloadTrioAsFile(trio: PenroseTrio, filename: string): void;
