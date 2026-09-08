import type { PenroseTrio } from "./types";
import { type CanvasFormat } from "./canvasViewport";
/**
 * Rich text is editor-owned data. Penrose only keeps a transparent Rectangle
 * with this path so the object remains selectable and participates in the
 * ordinary move/resize/rotate/layer operations.
 */
export declare const RICH_TEXT_BOX_METADATA_PREFIX = "-- @math-figure-editor-rich-text-boxes-v1 ";
export declare const DEFAULT_RICH_TEXT_BOX_FONT_SIZE_PT = 12;
export declare const DEFAULT_RICH_TEXT_BOX_LINE_HEIGHT = 1.4;
export declare function cssPixelsToPointSize(cssPixels: number): number;
export interface RichTextBoxDimensions {
    /** Fallback size while the proxy Rectangle has not rendered yet. */
    width: number;
    /** Fallback size while the proxy Rectangle has not rendered yet. */
    height: number;
    /** Inner inset in SVG user units / CSS pixels. */
    padding: number;
}
export interface RichTextBoxStyle {
    fontFamily: string;
    /** Base size in CSS pixels. Inline Tiptap overrides retain their own units. */
    fontSize: number;
    lineHeight: number;
    color: string;
    backgroundColor: string;
    textAlign: "left" | "center" | "right" | "justify";
    verticalAlign: "top" | "middle" | "bottom";
    overflow: "hidden" | "visible";
}
export interface RichTextBoxMetadata {
    version: 1;
    /**
     * Tiptap / ProseMirror JSON. It deliberately remains unknown here so this
     * persistence layer does not become coupled to the document editor schema.
     */
    content: unknown;
    box: RichTextBoxDimensions;
    style: RichTextBoxStyle;
}
export type RichTextBoxInput = {
    version?: 1;
    content?: unknown;
    box?: Partial<RichTextBoxDimensions>;
    style?: Partial<RichTextBoxStyle>;
};
export type RichTextBoxPathMap = Readonly<Record<string, string | null | undefined>> | ReadonlyMap<string, string | null | undefined>;
export interface AppendRichTextBoxOptions {
    /**
     * Tests or alternate renderers can override MathLive. The production
     * default uses the same MathLive converter as the document editor.
     */
    latexToMarkup?: (latex: string) => string;
    /**
     * 数式を SVG として組む。省略時は MathJax（本番の既定）。null を返したときは
     * 従来の MathLive の HTML 経路へ落ちる。テストや別レンダラ用の差し替え口。
     */
    latexToSvg?: (latex: string) => SVGElement | null;
    /**
     * 実機調査用。数式の組版から position を全部落とす。
     *
     * iPad (WebKit) では、テキスト箱の数式だけが箱の位置とキャンバスの拡大率に
     * 応じてズレる。日本語は通常フローなので一切ズレない。position を使う要素が
     * foreignObject の中で座標系を取り違えている、という見立ての確認用で、
     * これを立てると分数や添字の縦積みは崩れる代わりに position が消える。
     * `x` のような単純な数式なら見た目はほぼ変わらないので、それでズレが
     * 止まるかを見る。`?debug=mathflat` で有効になる。
     */
    flatMathLayout?: boolean;
}
export declare const DEFAULT_RICH_TEXT_BOX_CONTENT: Readonly<Record<string, unknown>>;
export declare const DEFAULT_RICH_TEXT_BOX_DIMENSIONS: Readonly<RichTextBoxDimensions>;
export declare const DEFAULT_RICH_TEXT_BOX_STYLE: Readonly<RichTextBoxStyle>;
export declare function createRichTextBoxMetadata(input?: RichTextBoxInput): RichTextBoxMetadata;
export declare function readRichTextBoxSettings(style: string): Record<string, RichTextBoxMetadata>;
/** Short alias useful at call sites that already have a Style string. */
export declare const readRichTextBoxes: typeof readRichTextBoxSettings;
export declare function getRichTextBox(trio: PenroseTrio, path: string): RichTextBoxMetadata | null;
export declare function setRichTextBox(trio: PenroseTrio, path: string, input: RichTextBoxInput | RichTextBoxMetadata): PenroseTrio;
export declare function removeRichTextBoxes(trio: PenroseTrio, paths: readonly string[]): PenroseTrio;
export declare function copyRichTextBox(source: PenroseTrio, sourcePath: string, target: PenroseTrio, targetPath: string): PenroseTrio;
/**
 * Atomically move metadata after a bulk path rename. A null/empty destination
 * drops that entry; paths absent from the map are kept unchanged.
 */
export declare function remapRichTextBoxes(trio: PenroseTrio, pathMap: RichTextBoxPathMap): PenroseTrio;
/**
 * Scale typography for the editor's uniform object scaling / canvas-resize
 * flows. Normal Rectangle width/height handle drags should not call this:
 * those operations intentionally reflow text without changing its size.
 */
export declare function scaleRichTextBoxes(trio: PenroseTrio, paths: readonly string[], factor: number, typographyFactor?: number): PenroseTrio;
/**
 * Convert a semantic typographic point size into the SVG coordinate system.
 *
 * A foreignObject CSS pixel maps to one SVG user unit. Print canvases use
 * millimetres as their user unit, whereas web canvases use CSS pixels. We
 * therefore emit a `px` CSS length whose numeric value is already expressed in
 * the current canvas user unit. The print DPI intentionally does not
 * participate: a point is a physical vector unit, and DPI is only used while
 * rasterising the finished SVG.
 */
export declare function pointSizeToCanvasUserUnits(points: number, format: CanvasFormat): number;
/**
 * Compensate stored typography when resizing a canvas across px/mm units.
 * This preserves the same geometric relationship between text and shapes.
 */
export declare function typographyScaleForCanvasChange(geometryScale: number, previousFormat: CanvasFormat, nextFormat: CanvasFormat): number;
/**
 * Overlay stored Tiptap content on its transparent Rectangle proxy.
 *
 * The overlay ignores pointer events. The original title is preserved on a
 * wrapper that owns both the proxy and overlay, so Canvas hit-testing, live
 * transforms and layer ordering continue to treat them as one object.
 */
export declare function appendRichTextBoxesToSvg(svg: SVGSVGElement, style: string, options?: AppendRichTextBoxOptions): Promise<void>;
