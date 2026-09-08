import type { Point2D } from "./shapeBuilders";
export declare function segmentIntersect(p1: Point2D, p2: Point2D, q1: Point2D, q2: Point2D): {
    point: Point2D;
    t: number;
    s: number;
} | null;
export declare function arcLengthParams(points: Point2D[]): number[];
export declare function findIntersectionsBetweenPolylines(selectedPoints: Point2D[], otherPoints: Point2D[], selectedSourceParameters?: number[]): {
    point: Point2D;
    tNorm: number;
    sourceParameter?: number;
    segmentIndex: number;
    segmentT: number;
}[];
export declare function splitPolylineAtParams(points: Point2D[], cuts: {
    point: Point2D;
    tNorm: number;
}[]): Point2D[][];
