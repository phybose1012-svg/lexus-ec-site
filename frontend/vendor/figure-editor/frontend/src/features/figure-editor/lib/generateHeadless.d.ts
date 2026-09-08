import type { ExJobProgress, FigureVerdict } from "./api";
import type { ExStyleId } from "../../../../../shared/exStyles";
import type { EtaPhase } from "./etaModel";
import type { FigureGenerationMode, PenroseLLMState, PenroseTrio } from "./types";
export interface HeadlessFigureResult {
    trio: PenroseTrio;
    /** 通常生成だけが継続用セッションを持つ。EX生成では null。 */
    llmState: PenroseLLMState | null;
    /** compileAndRender の自己完結 SVG 文字列 */
    svg: string;
    verdict: FigureVerdict;
}
export interface HeadlessFigureOptions {
    /** 未指定の既存呼び出し（OCRを含む）は通常モードを維持する。 */
    mode?: FigureGenerationMode;
    /** MAX の背景の絵のタッチ。未指定はサーバー既定（線画風）。 */
    exStyle?: ExStyleId;
    /** 自己採点で不出来なら 1 回だけ作り直す（runUpload の autoRetry と同じ） */
    autoRetry?: boolean;
    onProgress?: (message: string) => void;
    /** MAXジョブの受付直後。trueを返すと、安全に永続化できたことをAPIへ伝える。 */
    onExJobAccepted?: (jobId: string) => boolean | void;
    /** サーバーが返した待ち行列情報（未算出の値はundefined）。 */
    onExJobProgress?: (progress: ExJobProgress) => void;
    /** ローカルのpollだけを止める。受付済みサーバージョブは停止しない。 */
    signal?: AbortSignal;
    /**
     * フェーズ遷移の通知。進捗率・残り時間の推定に使う（ProgressEstimator）。
     * 表示専用で、生成の挙動には一切影響しない。
     */
    onPhase?: (phase: EtaPhase) => void;
}
/**
 * 画像 1 枚から図を生成して {trio, llmState, svg, verdict} を返す。
 * runUpload と違い最終試行でもコンパイルできなければ throw する
 * （呼び出し側でタスク失敗 → 再試行として扱う）。
 */
export declare function generateFigureHeadless(file: File, opts?: HeadlessFigureOptions): Promise<HeadlessFigureResult>;
/**
 * リロード後に、永続化されたMAXジョブを元画像なしで再開する。
 * 元画像は保存しないため、完成後のビジョン自己照合だけは省略して要確認にする。
 */
export declare function resumeFigureHeadless(jobId: string, opts?: HeadlessFigureOptions): Promise<HeadlessFigureResult>;
