export declare function uniqueSelectedPaths(paths: readonly string[]): string[];
export declare function filterSelectablePaths(paths: readonly string[], deletedPaths: ReadonlySet<string>, exists: (path: string) => boolean): string[];
export declare function toggleSelectedPaths(currentPaths: readonly string[], targetPaths: readonly string[]): string[];
