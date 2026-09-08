import { type ImageCropSourceRect, type PendingImageCrop } from "./crop";
import type { PenroseTrio } from "./types";
/**
 * 相対矩形 (0..1) を実ピクセルの切り出し範囲へ。
 * 丸めで 0 幅・範囲外にならないよう固定する（figure-gen/cropImage.ts と同じ丸め方）。
 */
export declare function sourcePixelRect(natural: {
    width: number;
    height: number;
}, source: ImageCropSourceRect): {
    sx: number;
    sy: number;
    sw: number;
    sh: number;
};
/** テスト用の継ぎ目。ブラウザ以外では canvas も保管庫も無い。 */
export interface ImageCropHooks {
    /** href の指す実体から source の範囲を PNG で切り出す。 */
    cropHref(href: string, source: ImageCropSourceRect): Promise<Uint8Array>;
    /** 切り出した PNG を保管し、参照キー (sha256) を返す。 */
    storePng(png: Uint8Array): Promise<string>;
}
/**
 * 予約された切り出しを実行し、Image.href を新しい実体の参照へ差し替える。
 *
 * 1 件でも失敗したら例外を投げる。呼び出し側は切り抜き全体を中止すること
 * （幾何だけ縮んでビットマップが元のまま、という中途半端を残さない）。
 */
export declare function applyImageCrops(trio: PenroseTrio, crops: readonly PendingImageCrop[], hooks?: ImageCropHooks): Promise<PenroseTrio>;
