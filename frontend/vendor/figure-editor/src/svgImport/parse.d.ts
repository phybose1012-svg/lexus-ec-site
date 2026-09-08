import { type SvgImportLimits } from "./limits.js";
import type { ImportedDocument } from "./model.js";
export interface ParseOptions {
    readonly limits?: SvgImportLimits;
}
/**
 * SVG を中間モデルへ読む。危険な内容はここで例外になる
 * （`SvgImportRejection`）。
 */
export declare function parseSvgDocument(source: string, options?: ParseOptions): ImportedDocument;
