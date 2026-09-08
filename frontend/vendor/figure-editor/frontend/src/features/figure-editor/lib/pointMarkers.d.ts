export type PointMarkerShape = "circle" | "star" | "triangle" | "square";
export type PointMarkerShapeType = "Circle" | "Polygon";
export interface PointMarkerState {
    center: {
        x: number;
        y: number;
    };
    size: number;
    shape: PointMarkerShape;
    colorRaw: string;
}
export declare const POINT_MARKER_OPTIONS: readonly {
    id: PointMarkerShape;
    label: string;
    symbol: string;
}[];
export declare function stepPointMarkerSize(size: number, delta: 1 | -1): number;
export declare function markerPoints(center: {
    x: number;
    y: number;
}, radius: number, count: number, startAngle?: number, alternatingRadiusRatio?: number): {
    x: number;
    y: number;
}[];
export declare function buildPointMarker(center: {
    x: number;
    y: number;
}, size?: number, shape?: PointMarkerShape, colorRaw?: string): {
    shapeType: PointMarkerShapeType;
    body: string;
};
export declare function readPointMarker(shapeType: string, body: string): PointMarkerState | null;
export declare function isPointMarkerPath(path: string): boolean;
export declare function isPointMarkerName(name: string): boolean;
