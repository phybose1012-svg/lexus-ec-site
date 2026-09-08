import type { MeasureText } from "./text.js";
/**
 * canvas を使う測定関数を作る。DOM が無ければ null を返すので、
 * 呼び出し側は `estimateText` へ落とせる。
 *
 * `width` は Penrose と同じ「インクの左右の絶対値の和」。`advance` は本来の
 * 送り幅。この 2 つは同じ値ではない（`（` のように片側に寄った字で 1.5 倍
 * ちがう）ので、両方返す。
 */
export declare function createCanvasMeasurer(): MeasureText | null;
