export type PickCategory = "label" | "shape" | null;
export interface TitledBBoxCandidate {
    path: string;
    substanceName: string;
    fieldName: string;
    owner: SVGElement;
    area: number;
}
export type ImageBBoxCandidate = TitledBBoxCandidate;
export interface OrderedPickCandidate {
    path: string;
    owner: SVGElement;
    area: number;
}
export declare function collectLabelBBoxCandidates(clientX: number, clientY: number, host: HTMLElement, getCategory: (path: string) => PickCategory): TitledBBoxCandidate[];
export declare function collectImageBBoxCandidates(clientX: number, clientY: number, host: HTMLElement, getCategory: (path: string) => PickCategory): ImageBBoxCandidate[];
export declare function svgPaintOrder(host: HTMLElement): Map<SVGElement, number>;
export declare function comparePickPriority(a: OrderedPickCandidate, b: OrderedPickCandidate, getCategory: (path: string) => PickCategory, paintOrder: ReadonlyMap<SVGElement, number>): number;
