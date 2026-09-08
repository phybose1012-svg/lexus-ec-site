export interface RenderedShapeTitle {
    path: string;
    substanceName: string;
    fieldName: string;
}
export interface RenderedShapeTitleScan {
    paths: string[];
    unrecognizedTitles: string[];
    duplicatePaths: string[];
    renderedShapeTypes: Record<string, string>;
}
export declare function parseRenderedShapeTitle(text: string | null | undefined): RenderedShapeTitle | null;
export declare function renderedShapePathOfElement(element: Element): string | null;
export declare function findRenderedShapeOwner(host: ParentNode, path: string): SVGElement | null;
export declare function findRenderedShapeOwners(host: ParentNode, path: string): SVGElement[];
export declare function extractRenderedShapeOrder(svgRoot: SVGSVGElement): string[];
/**
 * 生成直後の SVG 文字列から Penrose Shape の title を走査する。
 * DOM へ描画する前にも編集可能性を検証できるよう、ブラウザ固有の
 * DOMParser には依存しない。
 */
export declare function scanRenderedShapeTitles(svg: string): RenderedShapeTitleScan;
