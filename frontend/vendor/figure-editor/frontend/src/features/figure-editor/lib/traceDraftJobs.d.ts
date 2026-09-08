import type { TraceDraft } from "../../../../../src/traceDraftSchema";
export type TraceDraftJobStatus = "running" | "done" | "error";
export interface TraceDraftJob {
    tabId: string;
    status: TraceDraftJobStatus;
    /** 下書きの図形。置き方は受け取った側が今の trio から決める。 */
    shapes?: TraceDraft["shapes"];
    error?: string;
    startedAt: number;
}
/** タブを持たない使われ方（単体の図形エディタ）用の置き場。 */
export declare const STANDALONE_TRACE_DRAFT_KEY = "__standalone__";
/**
 * 下書き作りを始める。**すでに走っているタブでは何もしない**（二重に頼めない）。
 *
 * run が投げても握りつぶさず job へ残す。受け取る側が画面に出す。
 */
export declare function startTraceDraftJob(tabId: string, run: () => Promise<TraceDraft>): void;
/** 受け取った（または捨てた）ので片付ける。 */
export declare function clearTraceDraftJob(tabId: string): void;
export declare function getTraceDraftJob(tabId: string): TraceDraftJob | undefined;
/** このタブの下書き作りの状態。走っていなければ undefined。 */
export declare function useTraceDraftJob(tabId: string | undefined): TraceDraftJob | undefined;
