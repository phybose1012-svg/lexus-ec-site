import type { CanvasDimensions } from "./canvasViewport";
import type { RecognizedShape } from "./strokeRecognition";
export interface Point2D {
    x: number;
    y: number;
}
/** 点マーカーの既定半径 5 @ 400x400 と同じ割合。 */
export declare const DEFAULT_POINT_RADIUS_PERCENT = 1.25;
/** ラベルの既定 16px @ 400x400 と同じ割合。 */
export declare const DEFAULT_LABEL_FONT_PERCENT = 4;
/** 手で置くものの既定サイズを、キャンバスの大きさから引く。 */
export declare function defaultShapeSizing(dimensions: CanvasDimensions): {
    pointRadius: number;
    fontSize: string;
};
export declare function buildLineBody(p1: Point2D, p2: Point2D, strokeWidth?: number): string;
export declare function buildRectangleBody(corner1: Point2D, corner2: Point2D, strokeWidth?: number): string;
export declare function buildPointBody(p: Point2D, size?: number): string;
export declare function buildCircleBody(center: Point2D, radius: number, strokeWidth?: number): string;
export declare function buildEllipseRadiiBody(center: Point2D, rx: number, ry: number, strokeWidth?: number): string;
export declare function buildPolygonBody(points: Point2D[], strokeWidth?: number): string;
export declare function buildEllipseBody(center: Point2D, edge: Point2D, strokeWidth?: number): string;
export declare function flatBottomStartAngle(sides: number): number;
export declare function regularPolygonPoints(center: Point2D, vertex: Point2D, sides?: number): Point2D[];
export declare function regenerateRegularPolygonPoints(currentPoints: Point2D[], sides: number): Point2D[];
export declare function buildRegularPolygonBody(center: Point2D, vertex: Point2D, sides?: number, strokeWidth?: number): string;
export declare function circularEdgePoint(center: Point2D, edge: Point2D): Point2D;
export declare function buildCurveChainBody(throughPoints: Point2D[], strokeWidth?: number): string | null;
export declare function buildCubicCurveBody(start: Point2D, control1: Point2D, control2: Point2D, end: Point2D, strokeWidth?: number): string | null;
export declare function buildPolylinePointsBody(points: Point2D[], strokeWidth?: number): string;
export declare function buildPolylineBody(points: Point2D[], closed?: boolean, strokeWidth?: number): string;
export declare function buildLabelBody(p: Point2D, text?: string, fontSize?: string): string;
export declare function buildEquationBody(p: Point2D, latex?: string, fontSize?: string): string;
export declare function buildTextBoxBody(corner1: Point2D, corner2: Point2D): string;
export declare function angleToCurvature(u: number): number;
export declare function curvatureToAngle(curvature: number): number;
export declare function generateArcPoints(start: Point2D, end: Point2D, curvature?: number, n?: number, flipped?: boolean): Point2D[];
export declare function buildArcBody(p1: Point2D, p2: Point2D, curvature?: number, n?: number, flipped?: boolean, strokeWidth?: number): string;
export declare function regenerateArcPoints(start: Point2D, end: Point2D, curvature: number, currentCount: number, flipped?: boolean): string;
export declare function regenerateArcD(start: Point2D, end: Point2D, curvature: number, currentCount: number, flipped?: boolean): string;
export declare function countPointsInPathD(raw: string): number;
export declare const REQUIRED_CLICKS: {
    readonly point: 1;
    readonly line: 2;
    readonly rectangle: 2;
    readonly arc: 2;
    readonly ellipse: 2;
    readonly polygon: 2;
    readonly bezier: number;
    readonly polyline: 20;
    readonly label: 1;
    readonly textBox: 2;
    readonly freehand: 2;
};
export type DrawKind = keyof typeof REQUIRED_CLICKS;
export declare function isTrailDrawKind(kind: DrawKind | null | undefined): boolean;
export declare function isDragDrawKind(kind: DrawKind | null | undefined): boolean;
export declare function isVariableLengthDrawKind(kind: DrawKind | null | undefined): boolean;
export declare function isPersistentDrawKind(kind: DrawKind | null | undefined): boolean;
export declare const SHAPE_TYPE_FOR: Record<DrawKind, "Circle" | "Line" | "Rectangle" | "Path" | "Ellipse" | "Polygon" | "Polyline" | "Equation" | "Text">;
/**
 * なぞりの道具を持ち続けることの説明。
 *
 * なぞりは 1 つ描いても外れない。外れるのは「別の道具を選ぶ」か「同じボタンを
 * もう一度押す」かの 2 つだけで、キャンバスを触っても外れない。ツールバーの
 * 表示・状態行・タップしただけのときの案内が同じ言い回しになるよう、文言は
 * ここ 1 箇所に置く。
 */
export declare const DRAW_PERSIST_HINT = "\u7D9A\u3051\u3066\u63CF\u3051\u307E\u3059\uFF08\u540C\u3058\u30DC\u30BF\u30F3\u3092\u3082\u3046\u4E00\u5EA6\u62BC\u3059\u3068\u7D42\u308F\u308A\uFF09";
/**
 * なぞり以外の道具の説明。1 つ置いたら選ぶ操作へ戻る。
 *
 * **必ず出すこと。** 出さないと「なぜ 2 つ目が置けないのか」がどこにも書いて
 * いない画面になる（道具は消えていて、押し戻す先も無い）。
 */
export declare const DRAW_ONCE_HINT = "1 \u3064\u7F6E\u304F\u3068\u3001\u9078\u3076\u64CD\u4F5C\u306B\u623B\u308A\u307E\u3059";
/** その道具の持ち方の説明。持続するかどうかで文言が変わる。 */
export declare function drawToolHint(kind: DrawKind): string;
export declare function drawInstruction(kind: DrawKind, completedClicks?: number): string;
/** 道具を持った直後・1 つ描き終えた直後に出す案内（引き方＋持ち方の説明）。 */
export declare function drawInstructionWithToolHint(kind: DrawKind, completedClicks?: number): string;
export declare function buildBodyFor(kind: DrawKind, clicks: Point2D[], strokeWidth?: number, 
/** キャンバスの大きさ。省略すると 400x400 相当の既定値で置く。 */
canvas?: CanvasDimensions): string | null;
/**
 * 認識した幾何を、そのまま置ける Penrose の shape へ。
 *
 * **新しい図形種は作らない。** 円は Circle、楕円は Ellipse、線分は Line、
 * 多角形は Polygon、折れ線と曲線は Path。どれも手で置いたものと同じ形なので、
 * 移動・拡縮・回転・端点編集がそのまま効く。
 *
 * 傾いた楕円だけは body に収まらない（Penrose の Ellipse に回転が無いため）。
 * 角度を返すので、呼び出し側が rotation の override を書いてから
 * syncEllipseRotationTransform を通すこと。
 */
export declare function buildRecognizedShape(shape: RecognizedShape, strokeWidth?: number): {
    shapeType: (typeof SHAPE_TYPE_FOR)[DrawKind];
    body: string;
    /** 正多角形として読んだときの辺数。エディタの辺数メタへ渡す。 */
    regularSides: number | null;
    /**
     * 傾いた楕円の回転角（エディタ準拠・画面で時計回りが正）。傾き無しなら null。
     */
    ellipseRotationDegrees: number | null;
} | null;
