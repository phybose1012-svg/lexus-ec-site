import type { CompileFailure, PenroseTrio } from "./types";
import { type RenderedShapeTitleScan } from "./renderedShapeTitles";
export interface ShapeTypeMismatch {
    path: string;
    editorShapeType: string;
    renderedShapeType: string;
}
export interface UnsupportedShape {
    path: string;
    shapeType: string;
}
export type CompiledShapeDescriptor = string | {
    shapeType: string;
};
export interface ObjectRecognitionAuditOptions {
    /**
     * Optional authoritative output from Penrose
     * `state.interactivityInfo.shapesByPath`.  Passing it makes expected-path
     * and shape-type checks independent of SVG serialization details.
     */
    compiledShapesByPath?: Iterable<readonly [string, CompiledShapeDescriptor]>;
}
export interface ObjectRecognitionAudit extends RenderedShapeTitleScan {
    expectedPaths: string[];
    resolvedPaths: string[];
    unresolvedPaths: string[];
    missingPaths: string[];
    unexpectedPaths: string[];
    shapeTypeMismatches: ShapeTypeMismatch[];
    unsupportedShapes: UnsupportedShape[];
    complete: boolean;
}
export declare function isEditableShapeType(shapeType: string): boolean;
/**
 * Penrose が実際に描画した Shape と、エディターの編集対象解決を照合する。
 * SVG title と具体化したソース期待値を双方向に照合する。コンパイラーの
 * shapesByPath が利用できる呼び出し元は options で渡すと、それを期待値とする。
 */
export declare function auditRenderedObjectRecognition(trio: PenroseTrio, svg: string, options?: ObjectRecognitionAuditOptions): ObjectRecognitionAudit;
/**
 * 既存の生成修復ループへ渡せる診断へ変換する。
 * コンパイル成功後の検査なので stage は toSVG とし、図形内容を変えず
 * Substance/Style の所有関係だけを標準形へ直すよう明示する。
 */
export declare function objectRecognitionFailure(trio: PenroseTrio, svg: string, options?: ObjectRecognitionAuditOptions): CompileFailure | null;
