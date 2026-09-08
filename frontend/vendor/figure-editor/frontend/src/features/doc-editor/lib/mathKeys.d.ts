export interface MathKey {
    /** 安定 id。お気に入りは id で保存するので、既存キーの id は変えないこと */
    id: string;
    /** math-field に挿入する LaTeX。#@ = 選択範囲を取り込む、#? = 空欄（□） */
    insert: string;
    /**
     * キーキャップの表示用 LaTeX。省略時は insert をそのまま描画する。
     * insert にプレースホルダ（#@ #?）を含むキーは、□（\square）を使った
     * 表示用 LaTeX か、コンパクトな記号（\sum など）を必ず指定する。
     */
    display?: string;
    /** LaTeX でなくプレーン文字で表示したいとき（° など） */
    label?: string;
    tooltip: string;
}
export interface MathKeyCategory {
    id: string;
    label: string;
    keys: MathKey[];
}
export declare const MATH_KEY_CATEGORIES: MathKeyCategory[];
/** 全キーの id → 定義。お気に入り（id 保存）の解決に使う */
export declare const MATH_KEY_BY_ID: ReadonlyMap<string, MathKey>;
/**
 * お気に入りの初期値。先頭10個（= 1段目）は数式入力モードのメニューバーにも
 * 表示される（旧 MATH_TEMPLATES 相当の並び）。
 */
export declare const DEFAULT_FAVORITE_IDS: string[];
/** キーキャップの表示用 LaTeX（display 省略時は insert をそのまま使う） */
export declare function keyDisplayLatex(k: MathKey): string;
/** メニューバーに出す個数（お気に入りの1段目） */
export declare const MENU_BAR_KEY_COUNT = 10;
