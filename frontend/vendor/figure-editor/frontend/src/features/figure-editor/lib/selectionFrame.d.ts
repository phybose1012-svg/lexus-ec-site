export interface ClientRectEdges {
    left: number;
    top: number;
    right: number;
    bottom: number;
}
export declare const SELECTION_FRAME_PADDING = 16;
export declare const RICH_TEXT_SELECTION_FRAME_PADDING: number;
export declare const ROTATION_HANDLE_OFFSET = 30;
export declare const MIN_RECTANGLE_DIMENSION = 1;
export declare function selectionFramePadding(isRichTextBox: boolean): number;
export type RectangleResizeAxis = "width" | "height";
export interface RectangleLocalBox {
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare function resizeRectangleLocalBox(box: RectangleLocalBox, axis: RectangleResizeAxis, pointer: {
    x: number;
    y: number;
}, minimum?: number): RectangleLocalBox;
export type EllipseResizeAxis = "rx" | "ry";
export interface EllipseLocalRadii {
    cx: number;
    cy: number;
    rx: number;
    ry: number;
}
export declare const MIN_ELLIPSE_RADIUS = 1;
/**
 * 中心を固定したまま、掴んだ側の半径だけをポインタへ合わせる。
 *
 * ハンドルは中心から見て +x / +y 側に置く。符号付きの差をそのまま使うので、
 * 中心を通り越しても反対側へ裏返らず、最小値で止まる（距離だと通り越した先で
 * また伸び始めてしまう）。中心は動かさないので、回転済み楕円でも transform の
 * 基準はそのままでよい。
 */
export declare function resizeEllipseLocalRadii(radii: EllipseLocalRadii, axis: EllipseResizeAxis, pointer: {
    x: number;
    y: number;
}, minimum?: number): EllipseLocalRadii;
/** 掴む側のハンドルを置く、図形ローカル座標の点。 */
export declare function ellipseRadiusHandlePoint(radii: EllipseLocalRadii, axis: EllipseResizeAxis): {
    x: number;
    y: number;
};
export declare function expandSelectionFrame(box: ClientRectEdges, padding?: number): ClientRectEdges;
export declare function scaleHandlePoint(box: ClientRectEdges, padding?: number): {
    x: number;
    y: number;
};
export declare function scaleHandleStartDistance(box: ClientRectEdges, padding?: number): number;
/**
 * Corner-handle uniform scale based on the original drag direction.
 *
 * A distance-only ratio grows again after the pointer crosses the pivot. A
 * signed projection stays monotonic, so crossing the pivot clamps at the
 * minimum instead of unexpectedly re-expanding or mirroring the object.
 */
export declare function projectedUniformScaleFactor(startVector: {
    x: number;
    y: number;
}, pointerVector: {
    x: number;
    y: number;
}, minimum?: number): number;
export interface RotationHandleGeometry {
    pivot: {
        x: number;
        y: number;
    };
    anchor: {
        x: number;
        y: number;
    };
    handle: {
        x: number;
        y: number;
    };
}
export declare function rotationHandleGeometry(box: ClientRectEdges, padding?: number, offset?: number): RotationHandleGeometry;
export declare function normalizeDragRotationDegrees(degrees: number): number;
