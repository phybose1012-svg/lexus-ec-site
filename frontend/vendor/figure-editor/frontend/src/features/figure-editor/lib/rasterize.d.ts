export interface RasterizeResult {
    pngBase64: string;
    width: number;
    height: number;
}
export interface RasterTargetSize {
    width: number;
    height: number;
}
export declare function downloadPngBase64(pngBase64: string, fileName?: string): void;
export declare function getRasterCanvasSize(width: number, height: number, maxDim?: number, pixelRatio?: number): {
    width: number;
    height: number;
};
export declare function svgToPng(svg: string, maxDim?: number, pixelRatio?: number, targetSize?: RasterTargetSize): Promise<RasterizeResult>;
