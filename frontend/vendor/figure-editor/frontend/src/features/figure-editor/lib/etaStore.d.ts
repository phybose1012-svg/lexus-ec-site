import type { EtaObservation } from "./etaModel";
export interface Calibration {
    generateRatio: number;
    repairRatio: number;
    judgeRatio: number;
}
/** 推定器の生成時に 1 回だけ読む。 */
export declare function getCalibration(): Calibration;
/** 完了後に呼ぶ。書き込みは次のタスクへ逃がすので呼び出し側は待たない。 */
export declare function recordObservation(obs: EtaObservation): void;
