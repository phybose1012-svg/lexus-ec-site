import type { FigureGenEvent, FigureGenSession, RegionInput } from "./types";
export declare function getSession(): FigureGenSession | null;
export declare function subscribe(fn: () => void): () => void;
export declare function onEvent(fn: (e: FigureGenEvent) => void): () => void;
/** OcrPanel の「エディタに反映」後に呼ぶ（App が未差し込み分の再試行を仕掛ける） */
export declare function notifyDocApplied(): void;
/** 「確認」ボタン → 対応する図形タブへ移動（App が openFigReq へ変換） */
export declare function requestOpenTab(taskId: string): void;
/** いま何個まで領域を受け付けられるか（図形タブの空き数） */
export declare function availableSlots(): number;
export declare function startSession(regions: RegionInput[]): {
    ok: true;
} | {
    ok: false;
    reason: string;
};
/** error タスクの手動リトライ（同じタブ・同じ切り抜きを再利用） */
export declare function retryTask(taskId: string): void;
/** done-pending（タブ競合で保留）の結果をタブへ適用する */
export declare function applyPending(taskId: string): void;
