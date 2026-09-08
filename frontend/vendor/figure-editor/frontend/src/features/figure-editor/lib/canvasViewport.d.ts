export interface CanvasDimensions {
    width: number;
    height: number;
}
export type CanvasUnit = "px" | "mm";
export type CanvasPrintDpi = 150 | 300 | 600;
export interface CanvasFormat {
    unit: CanvasUnit;
    dpi: CanvasPrintDpi;
    /**
     * 印刷用紙の指定。
     *
     * 用紙のキャンバスは座標を px で持ち (他のプリセットと同じ桁)、
     * 「実際の紙の寸法」はこの印だけが持つ。書き出しの画素数と mm 単位の
     * 余白ガイドはここから引く。
     *
     * unit を "mm" にして mm をそのまま座標にすると、A4 は 210x297 = フルHD の
     * 約 1/9 の座標系になり、線幅・文字・許容量が用紙のときだけ別物になる。
     * 比率さえ合っていれば紙として成立し、実寸は書き出しのときに要るだけ
     * なので、座標と実寸を分けてある。
     */
    paper?: PrintCanvasPreset;
}
export type CanvasDimensionAnchor = "width" | "height";
export type CanvasFitAxis = "width" | "height";
export type CanvasMarginPreset = "narrow" | "standard" | "wide" | "custom";
export type PrintPaperSize = "a3" | "a4" | "b4" | "b5";
export type PrintPaperOrientation = "portrait" | "landscape";
export type PrintCanvasPreset = `${PrintPaperSize}-${PrintPaperOrientation}`;
export type WebCanvasPreset = "full-hd" | "youtube-thumbnail" | "hd-thumbnail" | "ogp" | "social-square" | "social-portrait" | "social-vertical" | "ad-inline" | "ad-leaderboard" | "ad-mobile";
export type FixedCanvasPreset = PrintCanvasPreset | WebCanvasPreset;
export interface FixedCanvasPresetDefinition {
    readonly dimensions: Readonly<CanvasDimensions>;
    readonly unit: CanvasUnit;
    readonly displayName: string;
    /** 印刷用紙のプリセットだけが持つ。書き出しの実寸はここから引く。 */
    readonly paper?: PrintCanvasPreset;
}
export interface CanvasContentFit {
    scale: number;
    axis: CanvasFitAxis;
}
export interface CanvasContentBounds {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}
export interface CanvasViewBox {
    x: number;
    y: number;
    width: number;
    height: number;
}
/**
 * Fit visible content against the immutable logical canvas frame.
 *
 * Using a previously expanded viewBox as the base makes auto-fit unable to
 * shrink after an outlying object is hidden or logically deleted. Always
 * derive the next frame from the original canvas plus the current visible
 * bounds instead.
 */
export declare function fitCanvasViewBoxToVisibleContent(base: Readonly<CanvasViewBox>, content: Readonly<CanvasContentBounds>, padding?: number): CanvasViewBox;
/**
 * 表示から除外されている path 集合が同じ内容かを判定する。
 *
 * Undo/Redo は補助状態（非表示・論理削除）を毎回クローンして適用するため、
 * 内容が同じでも Set の参照は必ず変わる。参照比較で「変わった」と判断すると
 * 拡大中に Undo しただけでズームが解除されてしまうので、再フィットの要否は
 * 中身の一致で判定する。
 */
export declare function isSameCanvasPathSet(a: ReadonlySet<string>, b: ReadonlySet<string>): boolean;
/**
 * A uniform transform that fits the currently rendered content into a new
 * canvas. `pivot` is the content centre before the transform and `translation`
 * moves that centre onto the Penrose canvas origin after scaling.
 */
export interface CanvasContentTransform extends CanvasContentFit {
    pivot: {
        x: number;
        y: number;
    };
    translation: {
        x: number;
        y: number;
    };
}
export interface CanvasMargins {
    top: number;
    right: number;
    bottom: number;
    left: number;
}
export interface CanvasGuideSettings {
    showCenter: boolean;
    showMargins: boolean;
    marginPreset: CanvasMarginPreset;
    customMargins: CanvasMargins;
}
export declare const MIN_CANVAS_DIMENSION = 32;
export declare const MAX_CANVAS_DIMENSION = 8192;
export declare const DEFAULT_CANVAS_FORMAT: Readonly<CanvasFormat>;
export declare const CANVAS_MARGIN_PRESETS_MM: Readonly<Record<Exclude<CanvasMarginPreset, "custom">, Readonly<CanvasMargins>>>;
export declare const DEFAULT_CANVAS_GUIDE_SETTINGS: Readonly<CanvasGuideSettings>;
export declare const PRINT_PAPER_SIZES_MM: Readonly<Record<PrintPaperSize, CanvasDimensions>>;
export declare function readCanvasDimensions(style: string): CanvasDimensions | null;
/**
 * Read editor-only output metadata from a Penrose line comment.
 *
 * Older trio files do not contain this marker and remain px-based. This keeps
 * their canvas dimensions and PNG output interpretation backward-compatible.
 */
export declare function readCanvasFormat(style: string): CanvasFormat;
/**
 * Store output-unit metadata in a Style comment so it survives undo/redo,
 * local sessions and trio.json download/upload without affecting compilation.
 */
export declare function updateCanvasFormat(style: string, format: CanvasFormat): string;
/**
 * Read editor-only guide settings. Older Trio files simply start with guides
 * hidden, while files saved by the editor retain their per-canvas settings.
 */
export declare function readCanvasGuideSettings(style: string): CanvasGuideSettings;
/**
 * Persist guides in a Penrose comment. The marker survives Trio/session
 * round-trips but is never emitted as SVG geometry by the compiler.
 */
export declare function updateCanvasGuideSettings(style: string, settings: CanvasGuideSettings): string;
export declare function canvasGuideMargins(settings: CanvasGuideSettings): CanvasMargins;
export declare function validateCanvasGuideSettings(settings: CanvasGuideSettings, dimensions: CanvasDimensions, format: CanvasFormat): string | null;
/**
 * 書き出す画素数。
 *
 * 印刷用紙のキャンバスは、座標が px でも紙の実寸 (mm) と dpi から決める。
 * これで「キャンバス座標は他プリセットと同じ桁・書き出しは厳密に A4」が
 * 両立する。用紙でなければ座標をそのまま画素数として使う。
 */
export declare function canvasPixelDimensions(dimensions: CanvasDimensions, format: CanvasFormat): CanvasDimensions;
export declare function validateCanvasDimensions(dimensions: CanvasDimensions): string | null;
/**
 * Uniformly fit the old canvas coordinate space inside a new canvas.
 *
 * Choosing the smaller axis ratio is equivalent to CSS/SVG `contain`:
 * - landscape -> portrait is normally width-limited
 * - portrait -> landscape is normally height-limited
 *
 * Penrose canvases are centered at (0, 0), so no translation is required.
 */
export declare function canvasContentFit(from: CanvasDimensions, to: CanvasDimensions): CanvasContentFit;
/**
 * Fit actual content bounds into a canvas while preserving how much of the
 * previous canvas the artwork occupied.
 *
 * A small drawing must not suddenly fill a large canvas merely because the
 * preset changed.  When `from` is supplied, the largest old-axis occupancy is
 * carried to the new canvas. Full-size/overflowing content is capped at one
 * canvas and therefore fitted safely. This also makes opposite-aspect round
 * trips stable without ratcheting the artwork smaller.
 */
export declare function canvasContentTransformFromBounds(bounds: CanvasContentBounds, to: CanvasDimensions, from?: CanvasDimensions): CanvasContentTransform;
export declare function applyCanvasContentTransform(point: {
    x: number;
    y: number;
}, transform: CanvasContentTransform): {
    x: number;
    y: number;
};
/** 用紙の実寸 (mm)。書き出しの画素数と余白ガイドはここから引く。 */
export declare function printPaperMillimetres(size: PrintPaperSize, orientation: PrintPaperOrientation): CanvasDimensions;
/**
 * 用紙プリセットのキャンバス座標 (px)。
 *
 * mm をそのまま座標にすると A4 は 210x297 になり、フルHD の約 1/9・正方形SNS の
 * 約 1/5 の座標系になる。線幅はキャンバス短辺の割合で決まるので用紙のときだけ
 * 極端に細くなり、敷いた画像 (長辺 最大4096) は紙の十数倍になってはみ出す。
 * 紙として要るのは縦横比だけなので、A4 の短辺を 1000px として全用紙を同じ
 * 倍率で px へ写す。A3 の短辺が A4 の長辺と一致するので、用紙どうしの
 * 相対関係 (A3 = A4 の 2 倍面積) もそのまま残る。
 */
export declare const PRINT_PAPER_CANVAS_PX_PER_MM: number;
export declare function printPaperCanvasDimensions(size: PrintPaperSize, orientation: PrintPaperOrientation): CanvasDimensions;
/** "a4-portrait" → 用紙と向き。用紙のプリセットでなければ null。 */
export declare function printPaperFromPreset(preset: string | undefined): {
    size: PrintPaperSize;
    orientation: PrintPaperOrientation;
} | null;
/**
 * キャンバスの実寸 (mm)。印刷用紙でなければ null。
 *
 * 新しい用紙キャンバスは format.paper から、mm を座標にしていた古いファイルは
 * 座標そのものから引く。書き出しと余白ガイドはどちらもこれを見る。
 */
export declare function canvasMillimetreSize(dimensions: Readonly<CanvasDimensions>, format: CanvasFormat): CanvasDimensions | null;
export declare const FIXED_CANVAS_PRESETS: Readonly<Record<FixedCanvasPreset, Readonly<FixedCanvasPresetDefinition>>>;
export declare function detectFixedCanvasPreset(dimensions: Readonly<CanvasDimensions>, unit: CanvasUnit): FixedCanvasPreset | null;
/**
 * プリセットに対応する format。用紙なら paper の印が付く。
 * 印が落ちると書き出しが紙の実寸でなくなるので、プリセットの適用は
 * かならずここを通す。
 */
export declare function canvasFormatForPreset(preset: FixedCanvasPreset, dpi: CanvasPrintDpi): CanvasFormat;
/**
 * 寸法と単位から format を組む。プリセットと寸法がぴたり一致すれば用紙の印を
 * 付け、利用者が数値を触って外れたら印も外す。
 */
export declare function canvasFormatFor(dimensions: Readonly<CanvasDimensions>, unit: CanvasUnit, dpi: CanvasPrintDpi): CanvasFormat;
export declare function canvasPresetDisplayName(dimensions: Readonly<CanvasDimensions>, unit: CanvasUnit): string | null;
/**
 * Update only the Penrose canvas declaration. Shape coordinates and all other
 * Style source remain unchanged, so changing the aspect ratio changes the
 * visible/output frame rather than scaling or moving objects.
 */
export declare function updateCanvasDimensions(style: string, dimensions: CanvasDimensions): string;
export declare function applyCanvasAspectRatio(current: CanvasDimensions, ratioWidth: number, ratioHeight: number, anchor?: CanvasDimensionAnchor): CanvasDimensions;
export declare function describeCanvasDimensions(dimensions: CanvasDimensions): string;
