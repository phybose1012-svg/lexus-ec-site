import type { CanvasDimensions } from "./canvasViewport";
/** PNG バイト列の SHA-256 を 16 進で返す (背景参照のキー)。 */
export declare function backgroundDigest(png: Uint8Array): Promise<string>;
/** 背景 PNG を保管し、その参照キー (sha256) を返す。 */
export declare function putLocalBackground(png: Uint8Array): Promise<string>;
/** 保管済みの背景 PNG。無ければ null。 */
export declare function getLocalBackground(digest: string): Promise<Uint8Array | null>;
/**
 * 保管してある背景 PNG を、AI へ送れる大きさへ縮めた PNG にする。
 *
 * 送るのは「どこに何があるか」を読み取ってもらうためで、原寸の解像度は要らない。
 * 長辺 1024px あれば図の骨格は十分読め、往復も軽い。
 */
export declare const TRACE_DRAFT_MAX_EDGE = 1024;
export declare function downscaleBackgroundForAi(png: Uint8Array, maxEdge?: number): Promise<Blob>;
export interface PreparedBackground {
    png: Uint8Array;
    /** 背景として敷くサイズ = キャンバスの寸法。 */
    dimensions: CanvasDimensions;
}
/**
 * 選ばれた画像ファイルを、背景として敷ける PNG に整える。
 *
 * 背景の解決器は PNG しか受け付けない (それ以外は拒否される) ため、JPEG や
 * WebP もここで PNG 化する。あわせて長辺を上限まで縮める。透過画像は白地に
 * 重ねる — 図の下敷きとして使う以上、透明のままだと書き出し先によって
 * 見え方が変わってしまう。
 */
export declare function prepareBackgroundImage(file: File, maxEdge?: number): Promise<PreparedBackground>;
