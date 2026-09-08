import type { PenroseTrio, CompileFailure } from "./types";
export type CompileResult = {
    ok: true;
    svg: string;
    /** Penroseが確定した実Shape。ソース推測ではなく認識完全性の正とする。 */
    compiledShapesByPath?: ReadonlyArray<readonly [string, {
        shapeType: string;
    }]>;
} | {
    ok: false;
    failure: CompileFailure;
};
export declare function compileAndRender(trio: PenroseTrio): Promise<CompileResult>;
