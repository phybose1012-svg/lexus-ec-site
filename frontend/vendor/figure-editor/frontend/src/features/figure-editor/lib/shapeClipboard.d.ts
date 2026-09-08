import type { PenroseTrio } from "./types";
import type { Point2D } from "./shapeBuilders";
import type { ArcMetadata, ArcMetadataMap } from "./arcMetadata";
import type { RegularPolygonMetadata, RegularPolygonMetadataMap } from "./regularPolygonMetadata";
import type { SymmetryGuideKind, SymmetryGuideMap } from "./symmetryGuides";
/** 控えた 1 個ぶんの、trio に書かれない編集用データ。 */
export interface FigureClipboardEntry {
    /** **控えの trio の中での**パス（コピー元のパスではない）。 */
    path: string;
    arc?: ArcMetadata;
    regularPolygon?: RegularPolygonMetadata;
    symmetry?: SymmetryGuideKind;
    /** 折れ線・曲線の初回点列（「なめらか」の作り直しはここを基準にする）。 */
    originalPoints?: Point2D[];
    originalPointCount?: number;
    smoothnessLevel?: number;
}
export interface FigureClipboardPayload {
    version: 1;
    /**
     * コピー元のタブ。**同じ図へ貼るときだけ位置をずらす**判断に使う
     * （別の図へは元と同じ座標で出す方が予測しやすい）。
     */
    sourceTabId?: string;
    /** 直前に貼った先のタブ。同じ図へ続けて貼るときの段差に使う。 */
    lastPastedTabId?: string;
    /** その図へ何回目の貼り付けか。0 = まだ貼っていない。 */
    pasteSerial?: number;
    /** 控え。コピーした図形だけで完結した trio。 */
    trio: PenroseTrio;
    entries: FigureClipboardEntry[];
    /** 控えのパスで表したグループ。 */
    groups: string[][];
    copiedAt: string;
}
/** コピー時に読む、エディタ側が持っている編集用データ。 */
export interface FigureClipboardSourceMetadata {
    arcMetadata: ReadonlyMap<string, ArcMetadata>;
    regularPolygonMetadata: ReadonlyMap<string, RegularPolygonMetadata>;
    symmetryGuides: ReadonlyMap<string, SymmetryGuideKind>;
    originalPoints: ReadonlyMap<string, Point2D[]>;
    originalPointCounts: ReadonlyMap<string, number>;
    smoothnessLevel: ReadonlyMap<string, number>;
    groups: readonly (readonly string[])[];
}
export type BuildFigureClipboardResult = {
    ok: true;
    payload: FigureClipboardPayload;
} | {
    ok: false;
    reason: string;
};
/**
 * 選んだ図形を控えの trio へ畳む。1 個でも畳めなければ ok: false
 * （半分だけ控えて「貼ったら足りない」を作らない）。
 *
 * paths は**描画順**で渡すこと。貼り付けは宣言順に足していくので、その順が
 * そのまま貼り付け先の重なり順になる。
 */
export declare function buildFigureClipboard(source: PenroseTrio, paths: readonly string[], metadata?: FigureClipboardSourceMetadata, sourceTabId?: string): BuildFigureClipboardResult;
/**
 * 貼り付け位置を決める。
 *
 * **別の図へは元と同じ座標。** 位置関係がそのまま移るのがいちばん予測しやすく、
 * 複数選択でも並びが崩れない。**元と同じ図へ続けて貼るときだけ段をずらす**——
 * 真上に重なると、貼れたのかどうか画面から分からない。2 回目・3 回目も同じ場所
 * に落ちないよう、その図に貼った回数ぶん段を重ねる。
 *
 * タブを持たないホスト（workspaceTabId 無し）では図が 1 つしかないので、
 * undefined どうしも「同じ図」として扱う。
 */
export declare function pasteOffsetForFigure(payload: FigureClipboardPayload, figureId: string | undefined, step: Point2D): {
    offset: Point2D;
    serial: number;
};
/** 貼り付けたあとの控え。次の貼り付けが同じ場所に落ちないようにする。 */
export declare function clipboardAfterPaste(payload: FigureClipboardPayload, figureId: string | undefined, serial: number): FigureClipboardPayload;
export interface PastedShapes {
    trio: PenroseTrio;
    /** 貼り付けてできたパス（控えの並び順）。 */
    paths: string[];
    /** 控えのパス → 貼り付け先のパス。 */
    pathMap: Map<string, string>;
}
export type PasteFigureClipboardResult = {
    ok: true;
    result: PastedShapes;
} | {
    ok: false;
    reason: string;
};
/**
 * 控えを target へ貼る。1 個でも貼れなければ ok: false で target は無傷
 * （途中まで貼って中断する形にしない）。
 */
export declare function pasteFigureClipboard(payload: FigureClipboardPayload, target: PenroseTrio, offset?: Point2D): PasteFigureClipboardResult;
/** 貼り付け後の、trio に書かれない編集用データ一式。 */
export interface FigureClipboardMetadataMaps {
    arcMetadata: ArcMetadataMap;
    regularPolygonMetadata: RegularPolygonMetadataMap;
    symmetryGuides: SymmetryGuideMap;
    originalPoints: Map<string, Point2D[]>;
    originalPointCounts: Map<string, number>;
    smoothnessLevel: Map<string, number>;
}
/**
 * 控えの付随物を、貼り付け先のパスへ移した新しい Map 一式にする。
 * 円弧の始終点と折れ線の初回点列は、図形と同じだけずらす（ずらさないと
 * 次の円弧操作・「なめらか」の作り直しが貼る前の位置から復元してしまう）。
 */
export declare function mergePastedMetadata(payload: FigureClipboardPayload, pathMap: ReadonlyMap<string, string>, offset: Point2D, current: {
    arcMetadata: ReadonlyMap<string, ArcMetadata>;
    regularPolygonMetadata: ReadonlyMap<string, RegularPolygonMetadata>;
    symmetryGuides: ReadonlyMap<string, SymmetryGuideKind>;
    originalPoints: ReadonlyMap<string, Point2D[]>;
    originalPointCounts: ReadonlyMap<string, number>;
    smoothnessLevel: ReadonlyMap<string, number>;
}): FigureClipboardMetadataMaps;
/**
 * localStorage へ置く上限。セッション本体（750KB）と同じ桁にしてある。
 * これを超える控え（データ URI を抱えた画像など）はメモリだけに持つ——
 * 控えのせいで**編集中の図が保存できなくなる**方がずっと悪い。
 */
export declare const CLIPBOARD_BYTE_BUDGET = 750000;
export type ClipboardStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export declare function readFigureClipboard(storage?: ClipboardStorage | null): FigureClipboardPayload | null;
/**
 * 控えを置く。localStorage へ書けたら true。
 * 書けなくてもメモリには載るので、そのブラウザータブの中では貼り付けられる。
 */
export declare function writeFigureClipboard(payload: FigureClipboardPayload, storage?: ClipboardStorage | null): boolean;
export declare function clearFigureClipboard(storage?: ClipboardStorage | null): void;
/** useSyncExternalStore 用。中身が変わるたびに増える。 */
export declare function figureClipboardRevision(): number;
/** 控えの変化を購読する（別のブラウザータブでのコピーも拾う）。 */
export declare function subscribeFigureClipboard(listener: () => void): () => void;
/** テスト用。モジュール変数の控えを空にする。 */
export declare function resetFigureClipboardMemory(): void;
