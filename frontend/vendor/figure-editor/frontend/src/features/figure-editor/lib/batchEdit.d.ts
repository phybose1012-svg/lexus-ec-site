import type { PenroseTrio } from "./types";
export declare const BATCH_FIELDS: readonly ["strokeColor", "fillColor", "strokeWidth", "strokeDasharray"];
export type BatchFieldName = (typeof BATCH_FIELDS)[number];
export type BatchKind = "color" | "number" | "dash";
export interface BatchFieldInfo {
    name: BatchFieldName;
    kind: BatchKind;
    applicable: number;
    uniform: boolean;
    commonRaw: string | null;
}
export declare function computeBatchFields(trio: PenroseTrio, paths: string[]): BatchFieldInfo[];
export declare function applyBatchField(trio: PenroseTrio, paths: string[], name: BatchFieldName, raw: string): PenroseTrio;
export declare function applyBatchDash(trio: PenroseTrio, paths: string[], dashed: boolean): PenroseTrio;
export type BatchTextFieldName = "fillColor" | "fontSize";
export interface BatchTextInfo {
    /** 選択のうち、ラベル・数式だった数。0 なら文字の一括編集は出さない。 */
    applicable: number;
    /** 文字の大きさが全員同じか。 */
    sizeUniform: boolean;
    /** 揃っているときの px。揃っていなくても足場として先頭の値を返す。 */
    sizePx: number;
    /** 文字の色が全員同じか。 */
    colorUniform: boolean;
    /** 揃っているときの生値。揃っていなければ null。 */
    colorRaw: string | null;
}
export declare function computeBatchTextFields(trio: PenroseTrio, paths: string[]): BatchTextInfo;
/** ラベル・数式にだけ当てる。図形が混ざっていても素通りする。 */
export declare function applyBatchTextField(trio: PenroseTrio, paths: string[], name: BatchTextFieldName, raw: string): PenroseTrio;
