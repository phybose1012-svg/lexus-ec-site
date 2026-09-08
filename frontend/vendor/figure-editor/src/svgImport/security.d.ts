import { type XmlParseResult } from "./xml.js";
/**
 * 危険な要素・属性が 1 つでもあれば取り込みを中止する。
 * 呼び出しは解析より前（= 何も生成する前）に置くこと。
 */
export declare function assertSvgIsSafe(parsed: XmlParseResult): void;
