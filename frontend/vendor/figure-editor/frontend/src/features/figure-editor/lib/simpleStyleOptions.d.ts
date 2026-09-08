import type { CanvasDimensions } from "./canvasViewport";
import { type ColorRGBA } from "./styleParser";
export interface SimpleColorOption {
    id: string;
    label: string;
    /** スウォッチ表示用 (#rrggbb)。 */
    hex: string;
    /** Penrose の rgba(r, g, b, a) 0..1 値。 */
    rgba: ColorRGBA;
}
export declare const SIMPLE_COLORS: readonly SimpleColorOption[];
/** 塗り「なし」を選んだときに fillColor へ書き込む Penrose 生値。 */
export declare const SIMPLE_FILL_NONE_RAW = "none()";
/** ColorRGBA → Penrose の色生値（styleParser.writeColor と同じ形式）。 */
export declare function simpleColorRaw(color: ColorRGBA): string;
export declare const SIMPLE_OPACITY_MIN_PERCENT = 5;
export declare const SIMPLE_OPACITY_MAX_PERCENT = 100;
export declare const SIMPLE_OPACITY_STEP_PERCENT = 5;
/** 色の a (0..1) → スライダーの % 値（5 刻み・5〜100 に収める）。 */
export declare function opacityPercentFromAlpha(alpha: number): number;
/** スライダーの % 値 → 色の a (0..1)。 */
export declare function alphaFromOpacityPercent(percent: number): number;
/** 色みはそのままに濃さだけ差し替える。 */
export declare function withAlpha(color: ColorRGBA, alpha: number): ColorRGBA;
export type SimpleStrokeWidthOption = "thin" | "normal" | "thick";
export declare const SIMPLE_STROKE_WIDTH_PERCENTS: Readonly<Record<SimpleStrokeWidthOption, number>>;
export declare const SIMPLE_STROKE_WIDTH_LABELS: Readonly<Record<SimpleStrokeWidthOption, string>>;
export declare const SIMPLE_STROKE_WIDTH_OPTIONS: readonly SimpleStrokeWidthOption[];
/** 現在の%値に最も近い3択を返す（選択状態のハイライト用）。 */
export declare function strokeWidthOptionFromPercent(percent: number): SimpleStrokeWidthOption;
export declare const SIMPLE_DASH_RAW = "\"5 5\"";
export declare const SIMPLE_SOLID_RAW = "\"\"";
/**
 * 点線の細かさの段。左ほど細かい。
 *
 * 線と間を同じ長さにしてある。太さのステッパーと同じく「1 段ずつ動かして、
 * 画面に px で出す」ためで、"8 5" のような非対称を混ぜると出せる数字が
 * 2 つになり、「− 数値 ＋」に収まらない。
 * 既定（従来のトグルが置く "5 5"）は必ずこの並びに含めること。
 */
export declare const SIMPLE_DASH_LENGTHS: readonly number[];
export declare function simpleDashRaw(length: number): string;
/**
 * いまの strokeDasharray が何段目か。読めない値や並びに無い値は、いちばん
 * 近い段に丸める（AI が置いた "4 2" のような値でも ± が効くように）。
 */
export declare function simpleDashStep(raw: string | undefined): number;
/** 段を delta ぶん動かす。端は超えない。 */
export declare function stepSimpleDash(raw: string | undefined, delta: 1 | -1): string;
export type SimpleArrowOption = "none" | "start" | "end" | "both";
export declare const SIMPLE_ARROW_KIND = "straight";
export declare const SIMPLE_ARROW_LABELS: Readonly<Record<SimpleArrowOption, string>>;
export declare const SIMPLE_ARROW_OPTIONS: readonly SimpleArrowOption[];
/**
 * 3択 → startArrowhead / endArrowhead へ書き込む生値。
 * 「なし」「終点」は始点矢印を明示的に消し、どの状態からでも決定的になる。
 */
export declare function simpleArrowFieldRaws(option: SimpleArrowOption): {
    startArrowhead: string;
    endArrowhead: string;
};
export declare const SIMPLE_ARROW_TARGET_PERCENT = 3;
export declare function simpleArrowheadSize(strokeWidth: number, dimensions: CanvasDimensions): number;
/** 矢印の見た目の長さ。markerUnits="strokeWidth" なので太さに比例する。 */
export declare function arrowheadLength(size: number, strokeWidth: number): number;
/**
 * 手で決められる矢印の大きさの下限・上限。
 *
 * **下限は自動計算の下限 (1) より下げてある。** 自動計算は「細い線でも矢印が
 * 見えるように」大きくする側の仕組みで、下限 1 は Penrose 既定の比率。
 * ところが用紙キャンバスでは自動値がその 1 に張り付くので、下限を揃えると
 * 既定より小さくできない（「− を押しても何も起きない」になる）。
 *
 * 0.5 = 既定比率の半分まで。既定の太さ 3px なら 30px → 15px、いちばん細い
 * 1px でも 10px → 5px で、矢印だと分かる大きさは残る。
 */
export declare const SIMPLE_ARROWHEAD_SIZE_MIN = 0.5;
export declare const SIMPLE_ARROWHEAD_SIZE_MAX = 20;
/**
 * 矢印の大きさの ±。
 *
 * size を比で動かす（見た目の長さは size に比例するので、長さを比で動かすのと
 * 同じ）。1px 刻みのような絶対量で動かすと、細い線では大きすぎ・太い線では
 * 何度押しても変わらない、という点の大きさで踏んだのと同じ穴に落ちる。
 */
export declare function stepArrowheadSize(size: number, delta: 1 | -1): number;
/**
 * 保存されている大きさが「手で決めた値」か。
 *
 * 自動計算（太さとキャンバスから逆算した値）と一致していれば自動のまま、
 * 違えばユーザーが ± で決めた値とみなす。手動なら太さを変えても勝手に
 * 書き換えない。状態を別に持たずに済むので、保存形式も増えない。
 */
export declare function isManualArrowheadSize(size: number, strokeWidth: number, dimensions: CanvasDimensions): boolean;
/** 現在の始点/終点矢印（パース済み文字列）から4択の選択状態を推定する。 */
export declare function simpleArrowOptionFromValues(startArrowhead: string, endArrowhead: string): SimpleArrowOption;
export type SimpleTextSizeOption = "small" | "medium" | "large";
export declare const SIMPLE_FONT_SIZE_PX: Readonly<Record<SimpleTextSizeOption, number>>;
export declare const SIMPLE_TEXT_SIZE_LABELS: Readonly<Record<SimpleTextSizeOption, string>>;
export declare const SIMPLE_TEXT_SIZE_OPTIONS: readonly SimpleTextSizeOption[];
/** fontSize の px 数値から最も近い3択を返す。 */
export declare function textSizeOptionFromPx(px: number): SimpleTextSizeOption;
/** fontSize フィールドへ書き込む生値（"16px" 形式の文字列リテラル）。 */
export declare function simpleFontSizeRaw(option: SimpleTextSizeOption): string;
export declare const SIMPLE_STROKE_WIDTH_MIN_PX = 1;
export declare const SIMPLE_STROKE_WIDTH_MAX_PX = 20;
/**
 * 1px 刻みのステップ。小数の現在値 (生成図は 0.65px 等) は最寄りの整数へ
 * スナップしてから進める: + は floor+1、− は ceil−1。
 */
export declare function stepStrokeWidthPx(current: number, delta: 1 | -1): number;
/** 表示用: 整数はそのまま、小数は1桁で表示する。 */
export declare function strokeWidthDisplayPx(px: number): string;
export declare const SIMPLE_FONT_PT_MIN = 6;
export declare const SIMPLE_FONT_PT_MAX = 72;
export declare function fontPtFromPx(px: number): number;
export declare function fontPxFromPt(pt: number): number;
/** pt 値から fontSize フィールドへ書き込む生値 ("16px" 形式)。 */
export declare function fontSizeRawFromPt(pt: number): string;
export declare const SIMPLE_POINT_SIZE: Readonly<Record<SimpleTextSizeOption, number>>;
/** 点マーカーの現在の半径から最も近い3択を返す。 */
export declare function pointSizeOptionFromRadius(radius: number): SimpleTextSizeOption;
