import { type XmlElement } from "./xml.js";
export interface StableIdentity {
    /** 表示・対応表に使う元 ID（元 SVG の値をそのまま保つ）。 */
    readonly sourceId: string;
    /** どこから採ったか。 */
    readonly origin: "data-edit-id" | "id" | "title" | "derived";
    /** Penrose の Substance 名（`/^\w+$/`・一意）。 */
    readonly name: string;
}
/**
 * 元 SVG 内の場所を表す文字列。`svg > g[0] > line[4]` の形。
 * 兄弟内での「同じタグの何番目か」で数えるので、無関係な要素が増えても
 * 近くの要素の場所は変わりにくい。
 */
export declare function locationOf(element: XmlElement): string;
export interface IdentityAssigner {
    assign(element: XmlElement): StableIdentity;
}
/**
 * 1 回の取り込みで使う採番器を作る。
 *
 * 枝番は「同じ候補名が何度目に出たか」で決まるので、文書順が同じなら
 * 何度取り込んでも同じ結果になる。
 */
export declare function createIdentityAssigner(): IdentityAssigner;
