/**
 * Recreate only the groups whose complete member set was duplicated.
 * Partial selections remain independent and cannot accidentally link a copy
 * to an original object.
 */
export declare function duplicatedGroupsForPathMap(groups: readonly (readonly string[])[], pathMap: ReadonlyMap<string, string>): string[][];
