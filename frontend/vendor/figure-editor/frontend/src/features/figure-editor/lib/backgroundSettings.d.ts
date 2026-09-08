import type { PenroseTrio } from "./types";
export interface BackgroundSettings {
    /** 選択もドラッグもできない状態。上に描くときに誤って動かさないための既定。 */
    locked: boolean;
    /** PNG/SVG へ書き出すときに含めるか。false なら画面上の下絵として残る。 */
    includeInExport: boolean;
    /** 0〜1。1 ではっきり、下げるとなぞりやすい薄さになる。 */
    opacity: number;
}
export declare const DEFAULT_BACKGROUND_SETTINGS: Readonly<BackgroundSettings>;
/** 不透明度の刻み。UI の −/＋ 1 回分。 */
export declare const BACKGROUND_OPACITY_STEP = 0.1;
export declare const MIN_BACKGROUND_OPACITY = 0.1;
/**
 * 「なぞる」に切り替えたときの濃さ。
 *
 * なぞる目的では、下の絵が見えつつ自分で引いた線と区別が付く濃さが要る。
 * 100% のままだと、どれが下絵でどれが自分の線か分からなくなる。
 */
export declare const TRACE_BACKGROUND_OPACITY = 0.2;
export declare function clampBackgroundOpacity(value: number): number;
/**
 * 背景として扱うオブジェクト。
 *
 * 「敷いた画像」と MAX 精度モードの背景、つまり保管庫の参照 (fibona-bg:) を
 * 指している Image だけを背景とみなす。Image をすべて背景扱いにすると、
 * 生成物にたまたま含まれる画像まで既定でロックされてしまい、利用者から見て
 * 動かせない理由の分からないオブジェクトが生まれる。
 *
 * 一度でも設定を変えたものは、参照が実体へ差し替わった後 (trio.json の往復)
 * でも背景であり続けるよう、記録済みのパスも背景として扱う。
 */
export declare function listBackgroundPaths(trio: PenroseTrio | null): string[];
/**
 * 背景画像の保管庫キー (sha256)。実体を取り出したいときに使う。
 * 実体が直接埋め込まれている (data URI) 図では null。
 */
export declare function readBackgroundDigest(trio: PenroseTrio, path: string): string | null;
/** 保存された設定。未設定の項目は既定値 (ロック・書き出しに含める・不透明) 。 */
export declare function readBackgroundSettings(trio: PenroseTrio, path: string): BackgroundSettings;
/** 設定を書き戻した新しい trio。opacity だけはシェイプ本体へ反映する。 */
export declare function writeBackgroundSettings(trio: PenroseTrio, path: string, patch: Partial<BackgroundSettings>): PenroseTrio;
/**
 * ロックされている背景のパス。選択・ドラッグの抑止に使う。
 *
 * paths を渡せる形にしてあるのは、背景の探索 (enumerateResolvedShapes) が
 * 図の大きさに比例して重く、trio 変更のたびに何度も走らせたくないため。
 * 呼び出し側は listBackgroundPaths の結果を 1 回だけ求めて使い回す。
 */
export declare function lockedBackgroundPaths(trio: PenroseTrio | null, paths?: readonly string[]): ReadonlySet<string>;
/** 書き出しから外す背景のパス。画面には残るが PNG/SVG には出ない。 */
export declare function exportExcludedBackgroundPaths(trio: PenroseTrio | null, paths?: readonly string[]): ReadonlySet<string>;
