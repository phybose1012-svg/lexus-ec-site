/**
 * "normal" generates an editable Trio conversationally. "max" runs the
 * annotation-separation pipeline: a traced background image with the text,
 * formulas and arrows re-added as editable objects on top.
 */
export type FigureGenerationMode = "normal" | "max";
/** Browser-safe EX marker. Pipeline diagnostics remain server-side. */
export interface PenroseExEditorState {
    schemaVersion?: "fibona-ex/1";
    mode: "ex";
    documentId?: string;
    backgroundPath?: string;
    backgroundLocked?: false;
}
export interface PenroseTrio {
    domain: string;
    substance: string;
    style: string;
    variation?: string;
    /** Optional editor-only data that keeps semantic controls portable. */
    editorState?: PenroseEditorState;
}
export interface PenroseEditorState {
    version: 1;
    hiddenPaths?: string[];
    /** Shapes kept only as internal dependency anchors after logical deletion. */
    deletedPaths?: string[];
    originalPointCounts?: Record<string, number>;
    originalPoints?: Record<string, {
        x: number;
        y: number;
    }[]>;
    smoothnessLevel?: Record<string, number>;
    arcMetadata?: Record<string, {
        start: {
            x: number;
            y: number;
        };
        end: {
            x: number;
            y: number;
        };
        angleU?: number;
        flipped?: boolean;
        curvature?: number;
    }>;
    regularPolygonMetadata?: Record<string, {
        sides: number;
    }>;
    /** 対称に補正した図形の「どの対称か」。画面のガイド専用（座標は持たない）。 */
    symmetryGuides?: Record<string, "mirror" | "point">;
    layerOrder?: string[];
    groups?: string[][];
    /** Browser-safe EX mode and background identity. */
    ex?: PenroseExEditorState;
}
export interface PenroseLLMState {
    /** Opaque server-side AI session reference. Prompt and conversation stay server-side. */
    sessionId: string;
}
export interface CompileFailure {
    stage: "compile" | "optimize" | "toSVG";
    message: string;
}
export interface GenerateResponse {
    trio: PenroseTrio;
    state: PenroseLLMState;
}
/** EX生成はサーバー側で完結し、継続用AIセッションをブラウザーへ返さない。 */
export interface GenerateExResponse {
    trio: PenroseTrio;
    /**
     * 通常と違う条件で作ったときだけ届く一文（例: 混雑で簡易モデルへ降格）。
     * 文面はサーバーが決める。エラーではないので生成は成功として扱う。
     */
    notice?: string;
}
export interface SelectedElement {
    path: string;
    substanceName: string;
    fieldName: string;
    shapeType: string;
    element: SVGElement;
}
