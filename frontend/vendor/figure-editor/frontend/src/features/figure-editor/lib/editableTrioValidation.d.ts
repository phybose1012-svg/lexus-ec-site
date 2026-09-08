import type { PenroseTrio } from "./types";
import type { CompileResult } from "./render";
export type TrioCompiler = (trio: PenroseTrio) => Promise<CompileResult>;
type SuccessfulCompileResult = Extract<CompileResult, {
    ok: true;
}>;
export type RestorableTrioResult = {
    status: "editable";
    result: SuccessfulCompileResult;
} | {
    status: "read-only";
    result: SuccessfulCompileResult;
    failure: Extract<CompileResult, {
        ok: false;
    }>["failure"];
} | {
    status: "invalid";
    failure: Extract<CompileResult, {
        ok: false;
    }>["failure"];
};
/**
 * Compile a saved Trio without making unsupported content editable.
 *
 * Older sessions may contain Penrose shapes that the current direct-manipulation
 * layer cannot safely recognize. A successful render is still useful for
 * previewing and exporting that data, so restoration distinguishes it from a
 * genuinely invalid Trio instead of discarding access to the saved asset.
 */
export declare function compileRestorableTrio(trio: PenroseTrio, compile: TrioCompiler): Promise<RestorableTrioResult>;
/**
 * The single acceptance gate for editable Trio data.
 *
 * A successful Penrose compile is necessary but not sufficient: every shape
 * that was expected from the source must also be represented by an editable,
 * uniquely titled rendered object. Keeping both checks here prevents imports,
 * AI edits, tab restoration, and direct manipulation from drifting apart.
 */
export declare function compileEditableTrio(trio: PenroseTrio, compile: TrioCompiler): Promise<CompileResult>;
/**
 * 片付け系の変更（削除）向けの受け入れ判定。「元より悪くしない」ことだけ求める。
 *
 * compileEditableTrio は図**全体**が編集可能であることを要求する。追加や書き換え
 * ではそれで正しいが、削除に当てると「消したい図形とは無関係な 1 つに不備がある
 * だけで、何も消せない」状態になる。不備のある図形を消して直すこともできない。
 *
 * ここでは判定を 2 段にする。
 * - Penrose のコンパイルが通らない → 本当に壊した。従来どおり却下
 * - コンパイルは通るが認識に不備 → **元の図にも不備があったなら通す**。
 *   削除で不備を増やしていないので、守るべきものは守れている
 *
 * 元の図を compile し直すのは不備が出た回だけなので、通常の削除は 1 回のまま。
 */
export declare function compileNonRegressingTrio(source: PenroseTrio | null, candidate: PenroseTrio, compile: TrioCompiler): Promise<CompileResult>;
export {};
