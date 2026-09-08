import { type CssStylesheet } from "./css.js";
import type { XmlElement } from "./xml.js";
/** 解決済みの色。r/g/b は 0..1、a も 0..1。`none` は null で表す。 */
export interface Rgba {
    readonly r: number;
    readonly g: number;
    readonly b: number;
    readonly a: number;
}
export interface ComputedProperties {
    readonly fill: Rgba | null;
    readonly stroke: Rgba | null;
    readonly strokeWidth: number;
    readonly strokeDasharray: string;
    readonly strokeLinecap: string;
    readonly strokeLinejoin: string;
    readonly opacity: number;
    readonly fontSize: number;
    readonly fontFamily: string;
    readonly fontStyle: string;
    readonly fontWeight: string;
    readonly textAnchor: "start" | "middle" | "end";
    readonly dominantBaseline: string;
    readonly baselineShift: string;
    readonly visibility: string;
    readonly display: string;
    readonly markerStart: string | null;
    readonly markerEnd: string | null;
    readonly markerMid: string | null;
    readonly clipPath: string | null;
    readonly vectorEffect: string;
    /** 実際に値が書かれていた性質の名前（継承だけで来たものは含まない）。 */
    readonly declared: ReadonlySet<string>;
}
/** 単位付きの長さを px（= SVG のユーザー単位）へ直す。 */
export declare function parseLength(raw: string | null | undefined, relativeTo?: number): number | null;
/**
 * 色を解く。`none` は null、`currentColor` は color 性質の値。
 * 解けない指定（グラデーション参照など）は undefined を返し、呼び出し側が
 * 「未対応」として記録する。
 */
export declare function parseColor(raw: string, currentColor: Rgba | null): Rgba | null | undefined;
/** 生の性質値（文字列）の集合。継承の計算はこの層で行う。 */
export type RawProperties = Readonly<Record<string, string>>;
export interface ResolvedProperties {
    readonly raw: RawProperties;
    readonly computed: ComputedProperties;
}
/**
 * 1 要素分の性質を確定する。`inherited` には親の解決結果を渡す
 * （根の場合は `INITIAL`）。
 */
export declare function resolveProperties(element: XmlElement, stylesheet: CssStylesheet, inherited: RawProperties): ResolvedProperties;
export declare const INITIAL_PROPERTIES: RawProperties;
/** 解けなかった塗り指定（グラデーション・パターン参照など）を見分ける。 */
export declare function unresolvedPaint(raw: string | undefined): string | null;
