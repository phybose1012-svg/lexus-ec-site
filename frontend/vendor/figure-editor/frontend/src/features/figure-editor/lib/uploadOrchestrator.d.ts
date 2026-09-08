import { type HeadlessFigureResult } from "./generateHeadless";
import type { FigureGenerationMode } from "./types";
import type { ExStyleId } from "../../../../../shared/exStyles";
export type FigureUploadStatus = "queued" | "generating" | "done-pending" | "done" | "error";
export interface FigureUploadLog {
    id: number;
    text: string;
}
export interface FigureUploadJob {
    id: string;
    tabId: string;
    /** リロード後は元画像を復元しない（機密性とlocalStorage容量のため）。 */
    file?: File;
    fileName: string;
    status: FigureUploadStatus;
    progress?: string;
    /** 進捗率 0..100。実完了まで 100 にならない。 */
    percent?: number;
    /** 「残り約3分」等。ProgressEstimator が整形済み。 */
    etaText?: string;
    /** 修復・作り直しで ETA が伸びたときの理由。 */
    etaNote?: string | null;
    logs: FigureUploadLog[];
    result?: HeadlessFigureResult;
    error?: string;
    errorStage?: string;
    /** 結果がliveまたは非アクティブタブのbundleへ反映済み。 */
    applied: boolean;
    /** ユーザーが対象タブを開き、完了結果を確認できる状態になった。 */
    seen: boolean;
    mode: FigureGenerationMode;
    /** MAX の背景の絵のタッチ。通常モードでは undefined。 */
    exStyle?: ExStyleId;
    autoRetry: boolean;
    /** MAXキューが発行した不透明ID。JWTや元画像は一緒に保存しない。 */
    serverJobId?: string;
    serverJobAcceptedAt?: number;
    /** 生成結果bundleをタブ領域へ保存できたか。 */
    resultPersisted?: boolean;
}
export interface FigureUploadOptions {
    /** 既存呼び出しは通常モード。 */
    mode?: FigureGenerationMode;
    /** MAX の背景の絵のタッチ。未指定はサーバー既定（線画風）。 */
    exStyle?: ExStyleId;
    autoRetry?: boolean;
}
export type FigureUploadJobs = Readonly<Record<string, FigureUploadJob>>;
export declare const FIGURE_EX_JOB_STORAGE_KEY = "fibona:figure-ex-jobs:v1";
export interface FigureExJobStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}
export interface PersistedFigureExJob {
    version: 1;
    tabId: string;
    localJobId: string;
    serverJobId: string;
    fileName: string;
    acceptedAt: number;
    status: "queued" | "running";
    queuePosition?: number;
    etaSeconds?: number;
}
/** 壊れた行は無視し、画面へ持ち込む値を明示的に再構築する。 */
export declare function readPersistedFigureExJobs(storage?: FigureExJobStorage | null): Record<string, PersistedFigureExJob>;
export declare function writePersistedFigureExJob(record: PersistedFigureExJob, storage?: FigureExJobStorage | null): boolean;
export declare function removePersistedFigureExJob(tabId: string, localJobId?: string, storage?: FigureExJobStorage | null): void;
/**
 * 生成結果を図形タブへ原子的に保存するためのポータブルbundleに変換する。
 * EX pipeline details and conversation state are removed before tab persistence.
 */
export declare function buildFigureUploadResultBundle(result: HeadlessFigureResult): Record<string, string>;
export declare function getFigureUploadJobs(): FigureUploadJobs;
export declare function subscribeFigureUploads(fn: () => void): () => void;
export declare function useFigureUploadJobs(): FigureUploadJobs;
/** 同じタブの旧ジョブは結果到着時の id 不一致で無視される。 */
export declare function startFigureUpload(tabId: string, file: File, options?: FigureUploadOptions): string;
/** アクティブな FigureEditor が result を直接 state/live へ取り込んだ後に呼ぶ。 */
export declare function markFigureUploadApplied(tabId: string, jobId: string): void;
/** 非アクティブ中に完了した結果を、対象タブを開いて確認済みにする。 */
export declare function markFigureUploadSeen(tabId: string, jobId: string): void;
/** auth/通信/15分上限で止まったローカルpollを、同じサーバージョブから再開する。 */
export declare function resumeFigureUpload(tabId: string): boolean;
/** タブ削除時など、以後そのジョブの結果を採用しない。fetch自体は自然完了する。 */
export declare function discardFigureUpload(tabId: string): void;
