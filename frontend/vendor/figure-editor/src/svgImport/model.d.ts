import type { SvgPathCommand } from "../svgPathEngine.js";
import type { Rgba } from "./properties.js";
export interface Point {
    readonly x: number;
    readonly y: number;
}
/** 矢印の形。交換形式 v1 の 3 種に揃える。 */
export type ArrowHeadKind = "filled" | "stealth" | "open";
export interface ImportedMarker {
    /** 元 SVG の marker 要素の id。 */
    readonly id: string;
    readonly kind: ArrowHeadKind;
    /** markerWidth などから割り出した大きさの倍率（線幅基準）。 */
    readonly size: number;
}
export interface ImportedStyle {
    readonly fill: Rgba | null;
    readonly stroke: Rgba | null;
    readonly strokeWidth: number;
    /** stroke-dasharray の数値列。実線は null。 */
    readonly dash: readonly number[] | null;
    readonly linecap: string;
    readonly linejoin: string;
    readonly markerStart: ImportedMarker | null;
    readonly markerEnd: ImportedMarker | null;
}
export type ImportedGeometry = {
    readonly kind: "line";
    readonly start: Point;
    readonly end: Point;
} | {
    readonly kind: "polyline";
    readonly points: readonly Point[];
    readonly closed: boolean;
} | {
    readonly kind: "rect";
    readonly center: Point;
    readonly width: number;
    readonly height: number;
    readonly cornerRadius: number;
    readonly rotationDeg: number;
} | {
    readonly kind: "circle";
    readonly center: Point;
    readonly r: number;
} | {
    readonly kind: "ellipse";
    readonly center: Point;
    readonly rx: number;
    readonly ry: number;
    readonly rotationDeg: number;
} | {
    readonly kind: "path";
    readonly commands: readonly SvgPathCommand[];
} | {
    readonly kind: "text";
    readonly text: ImportedText;
} | {
    readonly kind: "image";
    readonly href: string;
    readonly center: Point;
    readonly width: number;
    readonly height: number;
};
/** 1 本の書式のかたまり（`<tspan>` 1 個ぶん、または `<text>` の直下テキスト）。 */
export interface ImportedTextRun {
    readonly text: string;
    readonly fontSize: number;
    readonly fontFamily: string;
    /** "italic" / "normal" など。 */
    readonly fontStyle: string;
    /** "700" / "bold" / "normal" など。 */
    readonly fontWeight: string;
    readonly fill: Rgba | null;
    /** 添字なら "sub"、上付きなら "super"、通常は null。 */
    readonly shift: "sub" | "super" | null;
    /** tspan に書かれていた明示の位置（無ければ null）。 */
    readonly x: number | null;
    readonly y: number | null;
    readonly dx: number;
    readonly dy: number;
    /** クラス名。TeX 復元の手掛かりに使う（`mi` = 数学変数など）。 */
    readonly classes: readonly string[];
}
export interface ImportedText {
    /** アンカー点（ベースライン上）。 */
    readonly anchor: Point;
    readonly textAnchor: "start" | "middle" | "end";
    readonly dominantBaseline: string;
    readonly rotationDeg: number;
    readonly runs: readonly ImportedTextRun[];
}
/** 元 SVG の 1 要素に対応する、取り込み済みオブジェクト。 */
export interface ImportedObject {
    /** 安定 ID（同じ SVG を読み直すと同じ値になる）。 */
    readonly id: string;
    readonly geometry: ImportedGeometry;
    readonly style: ImportedStyle;
    /** 元要素のタグ名。 */
    readonly tagName: string;
    /** 元 SVG 内の場所（`svg > g[1] > line[4]` の形）。警告の表示に使う。 */
    readonly location: string;
    /** 文書順。描画順（背面→前面）と同じ。 */
    readonly order: number;
    /** 祖先の `g` の ID を根から順に。グループ復元に使う。 */
    readonly groupPath: readonly string[];
    /** display:none / visibility:hidden で見えていなかったか。 */
    readonly hidden: boolean;
    /** 要素に直接かかっていた opacity（継承ぶんを畳んだ値）。 */
    readonly opacity: number;
    /** 効いていた clipPath の id。 */
    readonly clipId: string | null;
}
/** 変換できなかった要素。黙って消さず、必ずここに載せる。 */
export interface UnsupportedElement {
    readonly tagName: string;
    readonly id: string | null;
    readonly location: string;
    readonly reason: string;
    /** 見た目に影響するか。true が 1 つでもあれば「完全変換」とは呼ばない。 */
    readonly visual: boolean;
}
export interface ImportWarning {
    readonly code: string;
    readonly message: string;
    /** 関係する場所（分かる場合）。 */
    readonly location: string | null;
    /** 見た目が変わりうる警告か。 */
    readonly visual: boolean;
}
/** 矩形の切り抜き。軸並行の矩形 1 枚だけを解釈する。 */
export interface ClipRect {
    readonly id: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}
export interface ImportedDocument {
    readonly width: number;
    readonly height: number;
    readonly viewBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    } | null;
    readonly objects: readonly ImportedObject[];
    readonly unsupported: readonly UnsupportedElement[];
    readonly warnings: readonly ImportWarning[];
    /** id → 矩形クリップ。解釈できたものだけ。 */
    readonly clipRects: ReadonlyMap<string, ClipRect>;
    /** 祖先の `g` ID → その中のオブジェクト ID 一覧。 */
    readonly groups: ReadonlyMap<string, string[]>;
}
