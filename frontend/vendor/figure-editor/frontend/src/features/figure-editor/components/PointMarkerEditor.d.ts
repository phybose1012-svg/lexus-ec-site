import { type PointMarkerShapeType } from "../lib/pointMarkers";
interface PointMarkerEditorProps {
    body: string;
    shapeType: string;
    onChange: (shapeType: PointMarkerShapeType, body: string) => void;
}
export declare function PointMarkerEditor({ body, shapeType, onChange, }: PointMarkerEditorProps): import("react").JSX.Element | null;
export {};
