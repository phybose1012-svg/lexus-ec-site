import type { Content } from "@google/genai";
export interface PenroseTrio {
    domain: string;
    substance: string;
    style: string;
    variation?: string;
    /**
     * エディタ専用メタデータ（フロント figure-editor の PenroseEditorState と互換）。
     * イラスト経路(traceIllustration)が「制御点で編集し直せる・部品単位で選択できる」
     * 状態を渡すために使う。描画そのものには影響しない。
     */
    editorState?: PenroseEditorState;
}
export interface PenroseEditorState {
    version: 1;
    hiddenPaths?: string[];
    /** Shapes kept only as internal dependency anchors after logical deletion. */
    deletedPaths?: string[];
    originalPoints?: Record<string, Array<{
        x: number;
        y: number;
    }>>;
    originalPointCounts?: Record<string, number>;
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
    layerOrder?: string[];
    groups?: string[][];
    /** EX生成時に除外した注釈と、編集オブジェクトとの対応を保持する。 */
    ex?: InternalFibonaExEditorState;
}
/**
 * Browser-safe EX marker. The editor currently needs only `mode`; the other
 * fields are non-sensitive identifiers kept for document/background
 * compatibility. Pipeline diagnostics and source provenance never belong in
 * this contract.
 */
export interface PublicFibonaExEditorState {
    mode: "ex";
    schemaVersion?: "fibona-ex/1";
    documentId?: string;
    backgroundPath?: string;
    backgroundLocked?: false;
}
export interface InternalFibonaExEditorState extends PublicFibonaExEditorState {
    schemaVersion: "fibona-ex/1";
    mode: "ex";
    documentId: string;
    backgroundPath: string;
    /** v1の背景は通常Imageとして編集できるためfalse。 */
    backgroundLocked: false;
    source: {
        fileName: string;
        mimeType: string;
        width: number;
        height: number;
        sha256: string;
    };
    cleanBackground: {
        mimeType: string;
        bytes: number;
        sha256: string;
    };
    /** manifest annotation ID -> Penrose shape path */
    objectMap: Record<string, string>;
    /** 除外した文字・数式・矢印等の可逆なannotation manifest全文。 */
    manifest: unknown;
    /**
     * 模写画像に消え残った注釈の画素判定結果。residual と判定された注釈は
     * objectMap に載らない（背景に写っている文字へ同じ文字を重ねないため）。
     * 閾値調整用の診断値なのでサーバー専用。
     */
    residual?: unknown;
    warnings?: string[];
    provenance: {
        annotationModel: string;
        imageModel: string;
        /**
         * 主モデルが枠切れで降格したときだけ、実際に描いたモデルID。
         * 降格の記録はここ一箇所で、DB に専用の列は持たない。
         */
        degradedImageModel?: string;
        /** 背景を描いた絵のタッチ (line/cel/botanical)。背景生成を省略した図には無い。 */
        cleanStyle?: string;
        promptVersion: string;
        generatedAt: string;
    };
}
export type PublicPenroseEditorState = Omit<PenroseEditorState, "ex"> & {
    ex?: PublicFibonaExEditorState;
};
export type PublicPenroseTrio = Omit<PenroseTrio, "editorState"> & {
    editorState?: PublicPenroseEditorState;
};
export interface PenroseTrioWithVariation extends PenroseTrio {
    variation: string;
}
export interface CompileFailure {
    stage: "compile" | "optimize" | "toSVG";
    message: string;
}
export interface AttemptRecord {
    attempt: number;
    trio: PenroseTrio;
    failure: CompileFailure | null;
}
export interface PenroseLLMState {
    systemInstruction: string;
    contents: Content[];
}
