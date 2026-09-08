/** 観測できるフェーズ。generateHeadless / runUpload の遷移と 1 対 1 に対応する。 */
export type EtaPhase = "generate" | "compile" | "repair" | "judge";
export interface ProgressSnapshot {
    /** 0..100 の整数。単調増加し、実完了まで 100 にならない。 */
    percent: number;
    /** 「残り約3分」「まもなく完了します」等。すでに人間向けに整形済み。 */
    etaText: string;
    /** 修復・作り直しが起きたときだけ入る説明。ETA が伸びた理由を必ず出す。 */
    note: string | null;
}
/** 1 回の生成の実測。完了後に etaStore へ渡して次回以降の較正に使う。 */
export interface EtaObservation {
    generateMs: number;
    repairMs: number[];
    judgeMs: number;
}
/**
 * 1 回の生成の進捗を追う。UI 非依存で副作用も持たないので、
 * FigureEditor の直書き経路と uploadOrchestrator の両方から同じものを使える。
 */
export declare class ProgressEstimator {
    private readonly startedAt;
    private phase;
    private phaseStartedAt;
    private attempt;
    private doneRepairs;
    private percent;
    private lastTickAt;
    /** 直前に表示した ETA。フェーズ内では増やさないための保持。 */
    private shownEtaMs;
    private note;
    private generateMs;
    private repairMs;
    private judgeMs;
    private readonly genGrid;
    private readonly repGrid;
    private readonly judgeMedian;
    constructor(now?: number);
    /**
     * フェーズ遷移。generateHeadless / runUpload が実際に切り替わった瞬間に呼ぶ。
     * 修復・作り直しはここで初めて分かるので、ETA の上振れを許可し理由を添える。
     */
    enterPhase(phase: EtaPhase, now?: number): void;
    /** モデル上の残り時間。フェーズ内経過で条件付けたうえで、後続フェーズを足す。 */
    private modelRemainingMs;
    /** 定期的に呼ぶ（1 秒間隔想定）。表示用の値を返すだけで副作用はない。 */
    tick(now?: number): ProgressSnapshot;
    private etaText;
    /** 完了時。100% を出せるのはここだけ。 */
    finish(now?: number): ProgressSnapshot;
    /** 完了後に etaStore へ渡す実測。記録はクリティカルパス外で行うこと。 */
    observation(): EtaObservation;
}
