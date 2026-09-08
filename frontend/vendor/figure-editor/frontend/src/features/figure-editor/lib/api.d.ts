import type { GenerateExResponse, GenerateResponse, PenroseLLMState, CompileFailure } from "./types";
import { type ExStyleId } from "../../../../../shared/exStyles";
export type ErrorKind = "upstream" | "config" | "quality" | "app" | "auth" | "access" | "session" | "rate_limit" | "input" | "edition" | "usage_limit";
export declare class SidecarError extends Error {
    readonly kind: ErrorKind;
    readonly status?: number;
    constructor(message: string, kind: ErrorKind, status?: number);
}
export declare function shouldResetFigureAiSession(error: unknown): boolean;
export type FigureAiTokenProvider = () => Promise<string | null>;
/**
 * Supplies the short-lived access token used by figure AI requests.
 *
 * The standalone app wires this to its authenticated session. Package hosts
 * must provide their own token callback; the figure-editor bundle deliberately
 * has no direct dependency on a particular authentication SDK.
 */
export declare function setFigureAiTokenProvider(provider: FigureAiTokenProvider | null): void;
export declare function errorKindLabel(err: unknown): string;
export declare function generateFromUpload(opts: {
    file?: File;
    prompt?: string;
    model?: string;
}): Promise<GenerateResponse>;
/**
 * 待ち行列で待っているあいだの状態。呼び出し側は進捗表示にだけ使う。
 */
export interface ExJobProgress {
    status: "queued" | "running";
    /** 自分より前に並んでいるジョブ数。サーバーが算出できたときだけ入る。 */
    queuePosition?: number;
    /** 出来上がるまでの見込み秒数。サーバーが算出できたときだけ入る。 */
    etaSeconds?: number;
}
export type ExJobErrorReason = "auth" | "expired" | "failed" | "invalid_response" | "not_found" | "timeout" | "unavailable";
/**
 * 受付済みEXジョブの取得に固有の失敗。
 * recoverable=true の場合、同じjobIdを後からpollしてよい。
 */
export declare class ExJobError extends SidecarError {
    readonly jobId: string;
    readonly reason: ExJobErrorReason;
    readonly recoverable: boolean;
    constructor(opts: {
        message: string;
        kind: ErrorKind;
        jobId: string;
        reason: ExJobErrorReason;
        recoverable: boolean;
        status?: number;
    });
}
export interface ExJobPollOptions {
    onProgress?: (progress: ExJobProgress) => void;
    signal?: AbortSignal;
    /** テストやホスト統合用。未指定時は4秒。 */
    pollIntervalMs?: number;
    /** 1回のpollセッションの上限。ジョブ自体は停止しない。 */
    timeoutMs?: number;
    /** jobIdが永続化済みで、利用者が後から再開できるか。 */
    resumeAvailable?: boolean;
}
export interface GenerateExUploadOptions extends ExJobPollOptions {
    /** 新規受付時だけ必要。resumeJobId指定時は送信しない。 */
    file?: File;
    /**
     * 背景の絵のタッチ。新規受付でだけ送る（再開はサーバー側に保存済み）。
     * 省略時はサーバー既定（線画風）。
     */
    style?: ExStyleId;
    /** 受付済みジョブを再開する場合に指定する。 */
    resumeJobId?: string;
    /** 新規受付直後に呼ばれる。trueならjobIdの永続化に成功したことを表す。 */
    onJobAccepted?: (jobId: string) => boolean | void;
}
/**
 * 高精度なEX生成。受付と取得に分かれている。
 *
 * 生成は約2分かかり、そのうちサーバが働くのは1%で残りは Gemini の応答待ち。
 * 応答を待たせる作りだと、接続が切れた瞬間に出来上がったものが捨てられ、混雑時は
 * 順番待ちではなくエラーになっていた。受け付けてから取りに行く形にすると、
 * 混雑は待ち時間になり、リロードしても結果は残る。
 *
 * 通常生成とはレスポンス契約が異なり、AIセッションは返さない。
 * The response keeps only the browser-safe EX marker; pipeline state stays server-side.
 */
export declare function generateExFromUpload(opts: GenerateExUploadOptions): Promise<GenerateExResponse>;
/**
 * ジョブが終わるまで取りに行く。結果はサーバに残っているので、途中で
 * このループが止まっても（リロード・タブを閉じる）作ったものは失われない。
 */
export declare function pollExJob(jobId: string, options?: ExJobPollOptions): Promise<GenerateExResponse>;
export interface FigureVerdict {
    ok: boolean;
    reason: string;
}
export declare function judgeFigure(opts: {
    sourceBase64: string;
    sourceMime: string;
    renderedPngBase64: string;
}): Promise<FigureVerdict>;
export declare function repairTrio(opts: {
    state: PenroseLLMState;
    failure: CompileFailure;
    model?: string;
}): Promise<GenerateResponse>;
export interface ChatMessage {
    role: "user" | "model";
    content: string;
}
export interface EditResponse {
    trio: import("./types").PenroseTrio;
    reply: string;
    state: PenroseLLMState;
}
/**
 * 下敷きの画像から「なぞりの下書き」を作る。
 *
 * 返るのは置きたい図形の一覧だけで、trio は返らない。書き込みはエディタ側が
 * 手動追加と同じ経路で行う（AI に Penrose を書かせると、新規オブジェクトに
 * 必要な Substance の宣言が入らず成立しないため）。
 *
 * 添付画像の画素寸法も一緒に送る。正規化座標は x を画像幅・y を画像高で
 * 割った非等方な系なので、寸法を伝えないと「正円」を指示する手掛かりが
 * モデル側に無い。
 *
 * 幅と高さは 1 欄 ("1024x768") にまとめる。multipart のパーサが fields:3 /
 * parts:4 で固定されており、file + instruction + model で既に埋まりかけて
 * いるため。
 */
export declare function requestTraceDraft(opts: {
    image: Blob;
    instruction?: string;
    model?: string;
}): Promise<import("../../../../../src/traceDraftSchema").TraceDraft>;
export declare function editTrio(opts: {
    trio: import("./types").PenroseTrio;
    message: string;
    sessionId?: string;
    model?: string;
}): Promise<EditResponse>;
