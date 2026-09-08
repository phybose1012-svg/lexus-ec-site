import type { PenroseTrio, SelectedElement } from "../lib/types";
import type { CanvasDimensions } from "../lib/canvasViewport";
import type { LayerOrderCommand } from "../lib/layerOrder";
import { type ColorRGBA } from "../lib/styleParser";
import { type BatchFieldName, type BatchTextFieldName } from "../lib/batchEdit";
import { type PointMarkerShapeType } from "../lib/pointMarkers";
import { type MidlineMarkerSetting } from "../lib/midlineMarkers";
export interface SimpleMiniBarProps {
    trio: PenroseTrio;
    selection: SelectedElement | null;
    multiSelPaths: string[];
    richTextBoxPaths: ReadonlySet<string>;
    canvasDimensions: CanvasDimensions;
    /** 選択中が円弧のときの曲がり具合 (0.05〜1.95)。円弧以外は null。 */
    arcAngleU: number | null;
    onArcAngleChange: (angleU: number) => void;
    /** ユーザーが置いた正多角形の辺数。その他の図形は null。 */
    regularPolygonSides: number | null;
    onRegularPolygonSidesChange: (sides: number) => void;
    /** 単一選択の見た目フィールドをまとめて適用（1回で 1 Undo 単位）。 */
    onApplyFields: (path: string, fields: Record<string, string>) => void;
    onMidlineMarkerChange: (path: string, setting: MidlineMarkerSetting | null) => void;
    onPointMarkerChange: (shapeType: PointMarkerShapeType, newBody: string) => void;
    onRichTextStyle: (path: string, style: {
        fontSize?: number;
        color?: string;
        backgroundColor?: string;
    }) => void;
    /**
     * ラベル (Text / Equation) の背景色。文字色とは独立していて、a=0 が透明。
     * 詳細モードの右パネルと同じ FigureEditor 側のハンドラへ委譲する。
     */
    onLabelBackgroundChange: (path: string, color: ColorRGBA) => void;
    onEditText: (path: string) => void;
    onDuplicate: () => void;
    onDuplicateAll: () => void;
    /** 選択中の図形をその場で裏返す。基準は選択全体の外接矩形の中心。 */
    onFlip: (axis: "horizontal" | "vertical") => void;
    onDeleteRequest: (path: string) => void;
    onDeleteAll: () => void;
    onLayerOrderCommand: (command: LayerOrderCommand) => void;
    onBatchStrokeColor: (raw: string) => void;
    /**
     * 複数選択の一括編集。詳細モードの MultiEditPanel と同じ入り口を使う。
     * 効くのは batchEdit が定める見た目のフィールドだけで、そのフィールドを
     * 既に持つ図形にしか当たらない（無い図形へ勝手に足さない）。
     */
    onBatchField: (name: BatchFieldName, raw: string) => void;
    /** 破線にする / 実線に戻す。線種を持てる型にだけ当たる。 */
    onBatchDash: (dashed: boolean) => void;
    /**
     * 文字（ラベル・数式）の一括編集。図形の一括とは別の入り口。
     * ラベルの「文字の色」は fillColor で、図形の fillColor は「塗り」だから
     * 一緒に流せない（batchEdit の注記）。
     */
    onBatchTextField: (name: BatchTextFieldName, raw: string) => void;
    /** 複数選択が囲む閉領域を塗る（詳細モードの「領域を塗る」と同じ処理）。 */
    onFillRegion: () => void;
    onGroup: () => void;
    onUngroup: () => void;
    /**
     * 現在の複数選択がちょうど1つのグループと一致するか。詳細モードの右パネルと
     * 同じ判定（FigureEditor の selectionIsGroup）をそのまま受け取る。
     */
    selectionIsGroup: boolean;
}
export declare function SimpleMiniBar({ trio, selection, multiSelPaths, richTextBoxPaths, canvasDimensions, arcAngleU, onArcAngleChange, regularPolygonSides, onRegularPolygonSidesChange, onApplyFields, onMidlineMarkerChange, onPointMarkerChange, onRichTextStyle, onLabelBackgroundChange, onEditText, onDuplicate, onDuplicateAll, onFlip, onDeleteRequest, onDeleteAll, onLayerOrderCommand, onBatchStrokeColor, onBatchField, onBatchDash, onBatchTextField, onFillRegion, onGroup, onUngroup, selectionIsGroup, }: SimpleMiniBarProps): import("react").JSX.Element | null;
