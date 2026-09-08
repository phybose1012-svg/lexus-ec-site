import type { PenroseTrio, PenroseLLMState } from "../figure-editor/lib/types";
import type { FigureVerdict } from "../figure-editor/lib/api";
/** 元画像に対する相対座標 0..1 の矩形（OCR bbox と同じ流儀・左上原点） */
export interface RegionRect {
    x: number;
    y: number;
    w: number;
    h: number;
}
export type RegionStatus = "queued" | "generating" | "done" | "done-pending" | "error";
export interface RegionTask {
    id: string;
    rect: RegionRect;
    pngBlob: Blob;
    /** サムネイル用 objectURL（revoke は orchestrator が管理） */
    pngUrl: string;
    file: File;
    /** 書き込み先の図形タブ（createFigureTab で確保済み） */
    tabId: string;
    tabTitle: string;
    /**
     * Reservation-time serialized tab bundle. Completion may auto-write only
     * when storage still has this exact revision.
     */
    reservedBundleRevision?: string;
    /** 対応する figurePlaceholder の id（自動差し込み先）。無ければタブのみ */
    placeholderId?: string;
    /** placeholder が属する教材。別教材に同じ placeholder id があっても誤配送しない。 */
    documentId: string;
    status: RegionStatus;
    error?: string;
    /** upstream エラーの自動再キュー回数 */
    autoRetryCount: number;
    /** 「図を調整中 (2/3)…」のような進捗文言 */
    progress?: string;
    result?: {
        trio: PenroseTrio;
        llmState: PenroseLLMState | null;
        svg: string;
        verdict: FigureVerdict;
    };
}
export interface FigureGenSession {
    id: string;
    createdAt: number;
    tasks: RegionTask[];
}
/** startSession に渡す 1 領域分の入力 */
export interface RegionInput {
    rect: RegionRect;
    pngBlob: Blob;
    placeholderId?: string;
    documentId: string;
}
export type FigureGenEvent = {
    type: "tabs-created";
} | {
    type: "figure-ready";
    documentId: string;
    placeholderId?: string;
    svg: string;
    /** 図の作り方。文書へ svg と一緒に同梱して自己完結させる */
    trio: PenroseTrio;
} | {
    type: "open-fig-tab";
    tabId: string;
} | {
    type: "apply-live";
    tabId: string;
} | {
    type: "doc-applied";
};
