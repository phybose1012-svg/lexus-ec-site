import { type CanvasDimensions, type CanvasFormat, type PrintPaperOrientation, type PrintPaperSize } from "./canvasViewport";
import type { PenroseTrio } from "./types";
/**
 * 白紙を選んだときの初期サイズ。A4 縦を既定にする。
 * 印刷して配る図が最も多く、Web 用途は後から用紙より直しやすい。
 *
 * 座標は px (他のプリセットと同じ桁)。紙の実寸は format の paper が持つので、
 * 書き出しは従来どおり厳密な A4 になる。
 */
export declare const DEFAULT_BLANK_CANVAS: Readonly<CanvasDimensions>;
export declare const DEFAULT_BLANK_CANVAS_FORMAT: Readonly<CanvasFormat>;
/**
 * 新規作成の trio に入れる variation。
 *
 * Penrose のレイアウト乱数の種で、白紙には最適化対象の図形が無いため
 * どの値でも結果は同じ。生成物と区別が付くよう固定文字列にしておく。
 */
export declare const NEW_DOCUMENT_VARIATION = "fibona-new-document";
/** 白紙キャンバス 1 枚だけの trio。 */
export declare function buildBlankTrio(dimensions?: Readonly<CanvasDimensions>, format?: Readonly<CanvasFormat>): PenroseTrio;
/**
 * 敷いた画像に付ける Substance 名。
 *
 * 生成物の名前 (userShape1 など) とぶつからない固有の名前にしておくと、
 * 後から図形を足しても背景がどれかを見失わない。
 */
export declare const BACKGROUND_SHAPE_NAME = "backgroundImage";
/** 背景オブジェクトのパス。ロックや書き出し除外の対象を指すのに使う。 */
export declare const BACKGROUND_SHAPE_PATH = "backgroundImage.shape";
/**
 * 背景画像として保管する最長辺 (px)。
 *
 * キャンバスは画像の実寸に合わせるが、スマートフォンの写真をそのまま敷くと
 * 数千万画素になる。背景は描画のたびに base64 へ展開されるため、実用的な
 * 上限で抑える。印刷 300dpi でも A4 の長辺に十分足りる大きさ。
 */
export declare const MAX_BACKGROUND_EDGE = 4096;
/**
 * 画像の元サイズから、キャンバス (= 背景の表示サイズ) を決める。
 * 縦横比は保ち、Penrose のキャンバス上限と最小寸法の中へ収める。
 */
export declare function backgroundCanvasSize(natural: Readonly<CanvasDimensions>, maxEdge?: number): CanvasDimensions;
/**
 * 敷いた画像 1 枚だけの trio。
 *
 * 画像の実体は Style に入れず、内容ハッシュへの参照 (`fibona-bg:<sha256>`)
 * だけを置く。実体は保管庫から描画時に解決される。数MBの画像を Style に
 * 直接持たせると、Undo 履歴もセッション保存もその重さを丸ごと抱えてしまう。
 */
export declare function buildImageCanvasTrio(digest: string, dimensions: Readonly<CanvasDimensions>): PenroseTrio;
/**
 * キャンバスへ収まる最大の表示サイズ。縦横比は保つ。
 * 途中から画像を足すときの配置に使う（キャンバス寸法は変えない）。
 */
export declare function containedImageSize(natural: Readonly<CanvasDimensions>, canvas: Readonly<CanvasDimensions>): CanvasDimensions;
/**
 * 既存の図へ足す画像シェイプの body。
 * キャンバス中央に、収まる最大の大きさで置く。
 */
export declare function buildBackgroundImageBody(digest: string, size: Readonly<CanvasDimensions>): string;
/** 白紙作成ダイアログに並べる用紙サイズ (mm)。 */
export declare const BLANK_PAPER_CHOICES: readonly {
    readonly paper: PrintPaperSize;
    readonly orientation: PrintPaperOrientation;
    readonly label: string;
}[];
/** 白紙作成ダイアログに並べる画面向けサイズ (px)。 */
export declare const BLANK_SCREEN_CHOICES: readonly {
    readonly dimensions: Readonly<CanvasDimensions>;
    readonly label: string;
}[];
