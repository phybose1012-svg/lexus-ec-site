export declare const API_BASE: string;
/**
 * ロッカールームだけは**別のサーバー**にいる（正本 §5-五「全アプリ共通の基盤」）。
 * FIBONA の sidecar とは住所が違うので、専用に持つ。
 *
 * **空のままなら、これまでどおり sidecar を見る。** 切り替えの前後で
 * 壊れないようにするため——env を入れた瞬間だけ向き先が変わる。
 */
export declare const LOCKER_API_BASE: string;
export declare function sidecarBase(devProxyPrefix: string, directPrefix?: string): string;
