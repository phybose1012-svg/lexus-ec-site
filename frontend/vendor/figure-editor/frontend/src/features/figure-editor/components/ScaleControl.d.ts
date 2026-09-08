interface ScaleControlProps {
    count: number;
    pivotLabel?: string;
    onScale: (factor: number) => void;
}
export declare function ScaleControl({ count, pivotLabel, onScale, }: ScaleControlProps): import("react").JSX.Element;
export {};
