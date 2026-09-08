import type { PenroseTrio } from "./types";
import { type RenderedShapePlacement } from "./trio";
export interface CropRect {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}
/** ビットマップに対する相対座標 (0..1)。y=0 がビットマップ上端。 */
export interface ImageCropSourceRect {
    x: number;
    y: number;
    w: number;
    h: number;
}
/**
 * ビットマップ画像 1 枚の切り出し予約。
 *
 * cropTrioToRect は表示上の新しい center/width/height までを trio へ書き込み、
 * 実体（ビットマップ）の切り出しと href の差し替えは canvas・保管庫を使う
 * 非同期処理なので applyImageCrops (imageCrop.ts) に委ねる。
 */
export interface PendingImageCrop {
    path: string;
    source: ImageCropSourceRect;
}
export interface UncroppableImage {
    path: string;
    /** rotated: 回転した画像は軸平行の切り出しに未対応 / reference: 実体を取り出せない href */
    reason: "rotated" | "reference";
}
export interface CropResult {
    trio: PenroseTrio;
    changedPaths: string[];
    logicallyDeletedPaths: string[];
    skippedPaths: string[];
    imageCrops: PendingImageCrop[];
    uncroppableImages: UncroppableImage[];
    removed: number;
    clipped: number;
    added: number;
    examined: number;
    unchanged: number;
    skipped: number;
}
export interface CropOptions {
    /**
     * Concrete paths obtained from rendered SVG titles or the object catalog.
     * When omitted, shared forall blocks are expanded by enumerateResolvedShapes.
     */
    paths?: readonly string[];
    /**
     * Effective SVG placements converted back to Penrose coordinates. Symbolic
     * Style expressions and optimizer-selected positions cannot be reconstructed
     * from source text alone.
     */
    placements?: ReadonlyMap<string, RenderedShapePlacement | null>;
}
export type CropResultDisposition = "empty" | "skipped" | "unchanged" | "changed";
export declare function cropCandidatePaths(paths: readonly string[], deletedPaths: ReadonlySet<string>): string[];
export declare function cropResultDisposition(result: Pick<CropResult, "examined" | "skipped" | "removed" | "clipped" | "added" | "logicallyDeletedPaths">): CropResultDisposition;
/**
 * 切り出しに対応できる Image.href の値。対応外は null。
 *
 * 実体を取り出せるのは保管庫参照 (fibona-bg:) と data: URL だけ。それ以外の
 * href はそもそも描画されない作りだが、対応外と分かった時点で触らずに残す。
 */
export declare function croppableImageHref(raw: string | null): string | null;
/** 切り抜けなかった画像の状況文言。無ければ空文字列。 */
export declare function describeUncroppableImages(images: readonly UncroppableImage[]): string;
export declare function cropTrioToRect(trio: PenroseTrio, rect: CropRect, options?: CropOptions): CropResult;
