import type { PenroseTrio } from "../figure-editor/lib/types";
export declare const MAX_FIGS = 8;
export declare const figTabKey: (id: string) => string;
export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
/**
 * Returns the exact serialized bundle currently stored for a tab. The raw
 * value acts as an optimistic-concurrency revision; unreadable or missing
 * bundles deliberately have no revision and therefore cannot be auto-written.
 */
export declare function readFigTabBundleRevision(id: string, storage?: StorageLike): string | undefined;
/** FigureEditor がタブ固有の3キーを直接読み書きするためのStorage互換口。 */
export declare function createFigureTabStorage(id: string, storage?: StorageLike): StorageLike;
export interface FigMeta {
    id: string;
    title: string;
    savedAt: string;
}
export interface FigWorkspace {
    version: 1;
    docs: FigMeta[];
    activeId: string;
}
export declare function newFigId(): string;
export declare function readFigWs(): FigWorkspace | null;
export declare function writeFigWs(ws: FigWorkspace, storage?: StorageLike): boolean;
/**
 * 旧版の共通live保存を、初回だけアクティブタブの専用領域へ移す。
 * 複数タブで専用bundleが空の場合、liveがどのタブの内容か判定できないため
 * 自動適用せず復元候補として保全する。既存bundleがある場合は新しい方を採用する。
 */
export declare function migrateLegacyActiveTabStorage(ws: FigWorkspace, storage?: StorageLike): boolean;
export declare function loadFigWorkspace(): FigWorkspace;
/** live キー → タブ退避（スナップショット保存） */
export declare function stashLive(id: string, storage?: StorageLike): void;
/**
 * 生成結果がbundleへ先行保存された直後に再読み込みされても古いliveを使わない。
 * 新しい側の3キーを原子的にliveへ反映する。
 */
export declare function restoreNewerTabBundle(id: string, storage?: StorageLike): boolean;
/** タブ退避 → live キー（無ければ空にする） */
export declare function restoreLive(id: string | null): void;
export declare function nextFigTitle(docs: FigMeta[]): string;
/**
 * 空の図タブを「非アクティブ」で追加する（アクティブ＝live は触らない）。
 * 非アクティブタブは空スナップショットで表現できるため、現在編集中の図に影響しない。
 * 返り値: 追加後のワークスペースと新規 id。上限超過時は null。
 */
export declare function createFigureTab(ws: FigWorkspace, title?: string, storage?: StorageLike): {
    ws: FigWorkspace;
    id: string;
} | null;
export type CreateFigureTabsResult = {
    ok: true;
    ws: FigWorkspace;
    tabs: Array<{
        id: string;
        title: string;
    }>;
} | {
    ok: false;
    reason: "capacity" | "storage";
    rollbackSucceeded: boolean;
};
/**
 * 複数の空タブを一括で確保する。途中で保存に失敗した場合は元の workspace
 * へ戻し、復元できた場合に限って途中作成 bundle を削除する。
 *
 * workspace の復元にも失敗した場合、保存済み workspace が途中作成タブを
 * 参照している可能性があるため、その bundle は削除しない。
 */
export declare function createFigureTabsAtomically(ws: FigWorkspace, titles: string[], storage?: StorageLike): CreateFigureTabsResult;
/**
 * 外部から取得した図を、既存タブとは独立した新規タブとして取り込む。
 *
 * externalTrio を FigureEditor へ渡し続けると、タブを切り替えてエディターが
 * 再マウントされるたびに同じ図が各タブへ再適用される。そこで、新しいタブの
 * scoped storage へ先にセッションを書き込み、そのタブだけをアクティブにする。
 */
export declare function importFigureAsNewTab(ws: FigWorkspace, trio: PenroseTrio, title?: string): {
    ws: FigWorkspace;
    id: string;
} | null;
/**
 * 図タブを削除する。各タブは専用保存のため、次タブの内容へ触れる必要はない。
 * 全て消えたら空の「図 1」を1つ用意する（FigureEditor は常に1タブ前提）。
 */
export declare function deleteFigureTab(ws: FigWorkspace, id: string): FigWorkspace | null;
export declare function renameFigureTab(ws: FigWorkspace, id: string, title: string): FigWorkspace;
/** タブ専用bundleを直接書き込む（新規作成・複製・自動生成結果の反映用）。 */
export declare function writeFigTabBundle(id: string, bundle: Record<string, string | null>, storage?: StorageLike): boolean;
/** タブの savedAt を現在時刻に更新する（ホーム一覧の並び・表示用） */
export declare function touchFigMeta(id: string): void;
/** 図タブを切り替える。内容は各タブ専用領域にあるためIDだけを変更する。 */
export declare function openFigureTab(ws: FigWorkspace, id: string): FigWorkspace;
