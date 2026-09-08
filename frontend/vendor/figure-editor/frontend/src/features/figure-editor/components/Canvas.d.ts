import { type ShapeCategoryFn } from "../lib/pickMapping";
import type { SelectedElement } from "../lib/types";
import { type SymmetryGuideMap } from "../lib/symmetryGuides";
import { type LassoMode } from "../lib/lassoSelection";
import { type DrawKind, type Point2D } from "../lib/shapeBuilders";
import type { CurveHandleKind, CurveHandles } from "../lib/curveGeometry";
import { type CurveChain } from "../lib/curveChain";
import { type PolygonVertexHandle } from "../lib/polygonHandles";
import { type EllipseResizeAxis, type RectangleResizeAxis } from "../lib/selectionFrame";
import type { SplitCandidate, SplitCandidateRadii } from "../lib/splitCandidates";
import type { CanvasDimensions, CanvasFormat, CanvasGuideSettings } from "../lib/canvasViewport";
/**
 * 曲線連鎖のどの編集で確定したか。状況表示の文言はここを見て決めるので、
 * FigureEditor と共有する（片方だけ増やして分岐を書き忘れないように）。
 */
export type CurveChainEditKind = "anchor" | "bulge" | "control" | "insert" | "remove" | "corner" | "smooth";
interface CanvasProps {
    svg: string | null;
    fitResetKey: number;
    canvasDimensions: CanvasDimensions;
    canvasFormat: CanvasFormat;
    canvasGuides: CanvasGuideSettings;
    hiddenPaths: ReadonlySet<string>;
    richTextBoxPaths: ReadonlySet<string>;
    selection: SelectedElement | null;
    /**
     * 対称に補正した図形の、どの対称かの覚え書き（図形ごと）。
     *
     * **座標は入っていない。** 軸も中心も、選んでいる図形の両端から
     * そのつど引き直す（lib/symmetryGuides.ts）。
     */
    symmetryGuides?: SymmetryGuideMap;
    getCategory: ShapeCategoryFn;
    onPick: (path: string, substanceName: string, fieldName: string, element: SVGElement) => void;
    onObjectDoubleClick?: (path: string) => void;
    onClearSelection: () => void;
    drawMode: {
        kind: DrawKind;
        clicks: Point2D[];
    } | null;
    onDrawClick: (point: Point2D) => void;
    onDrawFinish: () => void;
    onDrawDrag: (start: Point2D, end: Point2D) => void;
    onFreehandStroke: (points: Point2D[]) => void;
    onDrawTapWithoutDrag: () => void;
    /**
     * なぞりの読みが未確定のまま、キャンバスへ次の入力が来たときの確定。
     *
     * null なら未確定のものは無い。非 null かつ道具を持っているときの
     * **1 回目の入力は「これでよい」と同じ**で、線は引かない（5h 節）。
     */
    onCommitPendingChoice?: (() => void) | null;
    /**
     * なぞって置いたばかりで、まだ確定していない図形の path。
     *
     * この 1 個だけは、**道具を持ったままでも普通に選んでいるのと同じに扱う**
     * （掴む的を出し、本体を掴めば動かせる）。詳しくは freehandEditPath の注記。
     */
    freehandPendingPath?: string | null;
    canDrag: (path: string) => boolean;
    onDragEnd: (path: string, delta: Point2D) => void;
    onDragDuplicate: (path: string, delta: Point2D) => void;
    onGroupDragEnd: (paths: string[], delta: Point2D) => void;
    onGroupDragDuplicate: (paths: string[], delta: Point2D) => void;
    multiSelPaths: string[];
    groups: string[][];
    onMultiPick: (path: string) => void;
    layerOrder: string[];
    onRenderOrder: (paths: string[]) => void;
    endpointHandles: CurveHandles | null;
    polygonHandles: readonly PolygonVertexHandle[] | null;
    polygonHandlesRevision: string | null;
    curveChain: CurveChain | null;
    curveChainRevision: string | null;
    onEndpointDragEnd: (which: CurveHandleKind, point: Point2D) => void;
    onEndpointPreview: (which: CurveHandleKind, point: Point2D) => Point2D[];
    onPolygonVertexDragEnd: (path: string, points: Point2D[]) => void;
    onCurveChainDragEnd: (path: string, chain: CurveChain, kind: CurveChainEditKind) => void;
    onCurveChainRejected: (reason: "maxAnchors") => void;
    onMarqueeSelect: (paths: string[]) => void;
    cropMode: boolean;
    onCropRect: (rect: {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
    }) => void;
    lassoMode?: LassoMode | null;
    splitMode?: boolean;
    findSplitCandidate?: (cursor: Point2D, radii: SplitCandidateRadii) => SplitCandidate | null;
    onSplitAt?: (candidate: SplitCandidate) => void;
    onScaleEnd: (paths: string[], factor: number, pivot: Point2D) => void;
    onRectangleResizeEnd: (path: string, axis: RectangleResizeAxis, size: number, center: Point2D) => void;
    onEllipseResizeEnd: (path: string, axis: EllipseResizeAxis, radius: number) => void;
    onRotateEnd: (paths: string[], degrees: number, pivot: Point2D) => void;
    regionPreview?: {
        candidates: Point2D[][];
        activeIndex: number;
    } | null;
}
export declare function Canvas({ svg, fitResetKey, canvasDimensions, canvasFormat, canvasGuides, hiddenPaths, richTextBoxPaths, selection, symmetryGuides, getCategory, onPick, onObjectDoubleClick, onClearSelection, drawMode, onDrawClick, onDrawFinish, onDrawDrag, onFreehandStroke, onDrawTapWithoutDrag, onCommitPendingChoice, freehandPendingPath, canDrag, onDragEnd, onDragDuplicate, onGroupDragEnd, onGroupDragDuplicate, multiSelPaths, groups, onMultiPick, layerOrder, onRenderOrder, endpointHandles, polygonHandles, polygonHandlesRevision, curveChain, curveChainRevision, onEndpointDragEnd, onEndpointPreview, onPolygonVertexDragEnd, onCurveChainDragEnd, onCurveChainRejected, onMarqueeSelect, onScaleEnd, onRectangleResizeEnd, onEllipseResizeEnd, onRotateEnd, cropMode, onCropRect, lassoMode, splitMode, findSplitCandidate, onSplitAt, regionPreview, }: CanvasProps): import("react").JSX.Element;
export {};
