import type { ImportedText } from "./model.js";
import type { Rgba } from "./properties.js";
export declare function containsJapanese(text: string): boolean;
/**
 * 文字の実寸。**3 つの幅を区別する**のが要点。
 *
 *  width   … インク（実際に色の付く範囲）の幅。Penrose の Text / Equation は
 *            この箱の中心に `center` が来るので、置き場所の計算はこれで行う。
 *  advance … 送り幅。次の文字がどこから始まるか。**並びの計算はこれ**。
 *  bearing … 原点からインク左端までの距離。`（` のように左に大きな空きを持つ
 *            字で効く。
 *
 * この 3 つを混ぜると和文の混ざったラベルがずれる。実測（2026-09-06）:
 * 22px の `（` は送り幅 22 に対しインク幅 35.7（Penrose の measureText は
 * `|左| + |右|` で足すため）。送り幅のつもりでインク幅を使うと、後ろの断片が
 * 13px ずれる。
 */
export interface TextMeasurement {
    readonly width: number;
    readonly advance: number;
    readonly bearing: number;
    readonly ascent: number;
    readonly descent: number;
}
export type MeasureText = (text: string, cssFont: string) => TextMeasurement;
/** 1 つの `<text>` から生まれるラベル 1 個ぶん。 */
export interface LabelPiece {
    readonly shapeType: "Text" | "Equation";
    /** Text なら素の文字列、Equation なら TeX。 */
    readonly content: string;
    /** 元の文字列（対応表と警告の表示に使う）。 */
    readonly sourceText: string;
    readonly fontSize: number;
    readonly fontFamily: string;
    readonly fontStyle: string;
    readonly fontWeight: string;
    readonly fill: Rgba | null;
    /** 1 回目の配置に使う推定寸法。仕上げ計算で実測へ置き換える。 */
    readonly measured: TextMeasurement;
    /**
     * ラベル全体の先頭から、この断片の先頭までの**送り幅**（元 SVG の座標）。
     *
     * 断片を順に並べていく方式だと、前の断片の幅の狂いが後ろへ積み上がる。
     * 実測でそうなった（和文と数式が 4 つに分かれるラベルで、最後の「巻）」が
     * 前の字に重なった）。断片ごとに元の位置へ据えれば積み上がらない。
     */
    readonly sourceOffset: number;
    /** この断片の元 SVG での送り幅。位置合わせの基準はインク幅ではなくこちら。 */
    readonly sourceAdvance: number;
}
export interface LabelWarning {
    readonly code: string;
    readonly message: string;
}
export interface LabelLayout {
    readonly pieces: readonly LabelPiece[];
    /** 元 SVG の寄せ方。組み直したラベルもこの寄せ方で元の箱へ合わせる。 */
    readonly textAnchor: "start" | "middle" | "end";
    /** ラベル全体の外接矩形の左端（元 SVG 座標）。 */
    readonly left: number;
    /** ベースラインの y（元 SVG 座標）。 */
    readonly baseline: number;
    readonly rotationDeg: number;
    readonly warnings: readonly LabelWarning[];
}
/** CSS の font 短縮形。Penrose の measureText と同じ書式で渡す。 */
export declare function cssFontOf(run: {
    fontStyle: string;
    fontWeight: string;
    fontSize: number;
    fontFamily: string;
}): string;
/**
 * 実測できないときの当て推量。半角は 0.5em、和文と全角は 1em。
 * 仕上げの位置合わせ（refine.ts）が実測で上書きするので、ここは
 * 「桁が合っていればよい」程度でよい。
 */
export declare const estimateText: MeasureText;
/**
 * Penrose の Style 文字列リテラルに入れられる形へ整える。
 *
 * Penrose の字句解析は `"(?:[^\n"]|\\["\\ntbfr])*"`。エスケープした引用符でも
 * トークンが切れて **図全体のコンパイルが落ちる**ので、引用符は別の字へ置き換える。
 * 改行・制御文字も同じ理由で潰す。
 */
export declare function sanitizeForStyle(text: string): {
    value: string;
    changed: boolean;
};
export interface BuildLabelOptions {
    readonly measure?: MeasureText;
}
/**
 * `<text>` 1 個をラベルの並びへ開く。
 *
 * 返す `left` / `baseline` は元 SVG 座標。Penrose 座標への変換と、実測に
 * よる仕上げは呼び出し側（toTrio / refine）が行う。
 */
export declare function buildLabelLayout(text: ImportedText, options?: BuildLabelOptions): LabelLayout;
/**
 * 組み直したラベル 1 個を、元 SVG の同じ位置へ合わせるときの中心を出す。
 *
 * 基準は**送り幅の箱**。インクの箱ではない。Penrose の Text は
 * `text-anchor="middle"` で書き出されるので、実際に中央へ来るのは送り幅の箱で
 * あり、Penrose が報告する width（インク幅）ではない。混同すると、左右に
 * 大きな余白を持つ字（全角の `（` など）で隣のラベルに重なる（実測）。
 *
 * 書体が変わる数式（元は KaTeX、編集画面は MathJax）は幅が必ず食い違うので、
 * **元 SVG の寄せ方**に合わせて端を揃える。右寄せのラベルの左端を合わせると
 * 右端が飛び出す（実測: 関数グラフの軸ラベルが 10px ずれた）。
 */
export declare function alignedCenterX(anchor: "start" | "middle" | "end", sourceLeft: number, sourceAdvance: number, renderedWidth: number): number;
/**
 * 各ラベル断片の外接矩形の中心（元 SVG 座標）。実測寸法を渡し直せば、
 * そのまま仕上げにも使える。
 */
export declare function layoutCenters(layout: LabelLayout, measured: readonly TextMeasurement[]): {
    x: number;
    y: number;
}[];
