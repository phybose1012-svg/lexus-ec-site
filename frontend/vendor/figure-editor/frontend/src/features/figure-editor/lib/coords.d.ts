import type { Point2D } from "./shapeBuilders";
export declare function clientToSvgUser(svg: SVGSVGElement, clientX: number, clientY: number): Point2D;
export declare function svgToClient(svg: SVGSVGElement, svgX: number, svgY: number): {
    clientX: number;
    clientY: number;
};
export declare function svgToPenrose(svg: SVGSVGElement, svgX: number, svgY: number): Point2D;
export declare function penroseToSvg(svg: SVGSVGElement, px: number, py: number): Point2D;
export declare function clientToPenrose(svg: SVGSVGElement, clientX: number, clientY: number): Point2D;
export declare function penroseToClient(svg: SVGSVGElement, px: number, py: number): {
    clientX: number;
    clientY: number;
};
