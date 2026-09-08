import type { PenroseTrio } from "./types";
export interface SharedAppearanceInfo {
    id: string;
    kind: "managed" | "native";
    affectedPaths: string[];
    editableFields: string[];
}
export type EnableSharedAppearanceResult = {
    ok: true;
    trio: PenroseTrio;
    info: SharedAppearanceInfo;
} | {
    ok: false;
    trio: PenroseTrio;
    reason: string;
};
export declare function getSharedAppearanceInfo(trio: PenroseTrio, path: string): SharedAppearanceInfo | null;
export declare function listSharedAppearanceGroups(trio: PenroseTrio, paths?: string[]): SharedAppearanceInfo[];
/**
 * 選択集合を1つの共通設定へまとめる。既存グループのメンバーを1つ選んで
 * 新しいオブジェクトと一緒にONにした場合は、既存グループへ追加する。
 */
export declare function enableSharedAppearance(trio: PenroseTrio, selectedPaths: string[]): EnableSharedAppearanceResult;
/** 共通設定の変更を、紐づいた全オブジェクトの個別 override へ反映する。 */
export declare function applyManagedSharedAppearanceValues(trio: PenroseTrio, info: SharedAppearanceInfo, values: Record<string, string>): PenroseTrio;
/** 選択オブジェクトを現在値のまま共通設定から独立させる。 */
export declare function detachSharedAppearance(trio: PenroseTrio, selectedPaths: string[]): PenroseTrio;
/** 一括編集時も共通設定のメンバーを漏らさないよう対象を展開する。 */
export declare function expandSharedAppearancePaths(trio: PenroseTrio, paths: string[]): string[];
