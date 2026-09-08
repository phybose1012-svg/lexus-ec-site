import type { PenroseTrio } from "./types";
export interface SubstanceLabels {
    /** 明示された Label / AutoLabel で決まった文字列。NoLabel は空文字。 */
    byName: Map<string, string>;
    /** `AutoLabel All` が効いているか（未登場の名前はオブジェクト名になる）。 */
    autoAll: boolean;
}
/**
 * Substance のラベル命令を読んで、オブジェクト名 → 表示文字列を作る。
 *
 * Penrose は後から書いた命令が勝つので、行の順に上書きしていく。
 * `Label A "文字"` は平文ラベル、`Label A $A_1$` は数式ラベル（Penrose は
 * `$` を外して中身だけを label にする）。`AutoLabel` はオブジェクト名を、
 * `NoLabel` は空文字を割り当てる。
 */
export declare function resolveSubstanceLabels(substance: string): SubstanceLabels;
/**
 * ラベルを「数式として編集できる形」へ正規化する。
 *
 * 取り込み経路（AI 生成・ライブラリ・保存データ・なぞり下書き）はすべて
 * normalizeTrio を通るので、ここに置けば全部に効く。
 */
export declare function normalizeLabelShapes(trio: PenroseTrio): PenroseTrio;
