export interface LatestRequest<T> {
    token: number;
    value: T;
}
export interface LatestRequestGate<T> {
    begin(value: T): LatestRequest<T>;
    isCurrent(request: LatestRequest<T>): boolean;
    markPublished(request: LatestRequest<T>): boolean;
    isPublished(value: T): boolean;
    invalidate(): void;
}
/**
 * Coordinates async work that may finish out of order. Starting newer work or
 * publishing a result through another path invalidates every older token.
 */
export declare function createLatestRequestGate<T>(): LatestRequestGate<T>;
