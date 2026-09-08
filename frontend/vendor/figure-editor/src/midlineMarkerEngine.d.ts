export type MidlineMarkerKind = "direction" | "parallel" | "equal" | "equal-circle" | "equal-cross";
export type MidlineMarkerCount = 1 | 2 | 3;
export interface MidlineMarkerSetting {
    kind: MidlineMarkerKind;
    count: MidlineMarkerCount;
    reversed?: boolean;
}
interface Point {
    x: number;
    y: number;
}
interface OrientedPoint extends Point {
    angle: number;
}
export declare function readMidlineMarkerSettings(style: string): Record<string, MidlineMarkerSetting>;
export declare function writeMidlineMarkerSettings(style: string, markers: Record<string, MidlineMarkerSetting>): string;
export declare function setMidlineMarkerInStyle(style: string, path: string, setting: MidlineMarkerSetting | null): string;
export declare function midpointAlongPoints(points: readonly Point[]): OrientedPoint | null;
/**
 * Penrose が生成したSVGへ、保存済み設定に従って線の中央記号を追加する。
 * 元のShape owner内へ入れるため、非表示・レイヤー移動・ドラッグにも一緒に追従する。
 */
export declare function appendMidlineMarkersToSvg(svg: SVGSVGElement, style: string): void;
export {};
