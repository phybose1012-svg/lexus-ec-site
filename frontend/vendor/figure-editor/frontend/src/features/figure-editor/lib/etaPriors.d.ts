/** 0,5,…,100 パーセンタイルの所要ミリ秒（21 点）。線形補間して CDF を復元する。 */
export interface QuantileGrid {
    readonly ms: readonly number[];
}
/** 生成フェーズ（POST /generate）の実測分布。n=130 */
export declare const GENERATE_GRID: QuantileGrid;
/** 修復 1 回あたり（POST /repair）の実測分布。n=51 */
export declare const REPAIR_GRID: QuantileGrid;
/** ブラウザ側 Penrose コンパイルの目安（中央値）。 */
export declare const COMPILE_MS = 96;
/** 修復が k 回以上発生する確率。index 0 が「1 回以上」。 */
export declare const REPAIR_TAIL_P: readonly number[];
/**
 * 自己採点（POST /judge-figure）の所要時間。
 * ベンチ（CLI）は判定を実行しないため実測が無い。暫定の事前分布を置き、
 * 実運用の観測で etaStore が上書き補正する。
 */
export declare const JUDGE_PRIOR_MS = 15000;
/**
 * 自己採点が不合格になり丸ごと作り直す確率。実測が無いため暫定値。
 * etaStore の観測で補正される。
 */
export declare const RETRY_PRIOR_P = 0.15;
