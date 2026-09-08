export interface LogLine {
    id: number;
    text: string;
}
export declare function GenerationOverlay({ title, log, percent, etaText, etaNote, }: {
    title: string;
    log: LogLine[];
    /** 0..100。実完了まで 100 にならない（ProgressEstimator が保証）。 */
    percent?: number;
    /** 「残り約3分」等。 */
    etaText?: string;
    /** 修復・作り直しで ETA が伸びたときの理由。 */
    etaNote?: string | null;
}): import("react").JSX.Element;
