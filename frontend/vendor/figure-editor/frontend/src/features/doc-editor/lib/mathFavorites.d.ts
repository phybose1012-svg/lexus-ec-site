export declare function getFavoriteIds(): string[];
export declare function setFavoriteIds(next: string[]): void;
/** 末尾に追加（既登録の id は無視） */
export declare function addFavoriteIds(add: string[]): void;
export declare function removeFavoriteId(id: string): void;
/** draggedId を targetId の前（after=true なら後ろ）へ移動 */
export declare function moveFavoriteId(draggedId: string, targetId: string | null, after?: boolean): void;
/** 変化を購読する。戻り値は解除関数 */
export declare function subscribeFavorites(fn: (ids: string[]) => void): () => void;
