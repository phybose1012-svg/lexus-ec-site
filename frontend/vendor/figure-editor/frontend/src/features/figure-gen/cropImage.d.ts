import type { RegionRect } from "./types";
/** 画像 1 回ロードで複数領域をまとめて切り出す（rects と同順の Blob 配列） */
export declare function cropRegionsToPng(imageUrl: string, rects: RegionRect[]): Promise<Blob[]>;
