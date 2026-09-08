import { type SvgImportOptions, type SvgImportResult } from "./svgImport";
export declare function importSvgForEditor(svgSource: string, options?: Omit<SvgImportOptions, "measure" | "compile">): Promise<SvgImportResult>;
