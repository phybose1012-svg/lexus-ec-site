/**
 * MAX精度モード（EX）の「絵のタッチ」の単一の定義元。
 *
 * frontend のセレクタ、sidecar の受付検証、ジョブ行の正規化は必ずここを参照する。
 * 画風ごとのプロンプト本文はサーバー専用（src/exCleanStyles.ts）に置き、
 * クライアントへ配布される此のファイルには載せない。
 * 2つのファイルの ID 一覧が一致することは sidecar のテストで固定している。
 *
 * 背景: MAX は元画像を寸分たがわず複製するのではなく、内容と構図を保ったまま
 * タッチを意図的に変えて描き直す（2026-08-28 決裁）。忠実な複製は著作権上も
 * 望ましくないため、「完全再現」を目指す画風は提供しない。
 */
export declare const EX_STYLE_IDS: readonly ["line", "cel", "botanical"];
export type ExStyleId = (typeof EX_STYLE_IDS)[number];
/** 教材用途に最も自然なため、既定は線画風。 */
export declare const DEFAULT_EX_STYLE: ExStyleId;
/** 表示専用。永続化・API には必ず内部 ID (line/cel/botanical) を使う。 */
export declare const EX_STYLE_LABELS: Record<ExStyleId, string>;
/** セレクタ横の1行説明。 */
export declare const EX_STYLE_HINTS: Record<ExStyleId, string>;
export declare function isExStyleId(value: unknown): value is ExStyleId;
/**
 * 保存済みジョブ行など、由来の怪しい値を既定へ倒す寛容な正規化。
 * 受付（HTTP）では使わない — 受付は不正値を 400 で弾き、UIの配線ミスを隠さない。
 */
export declare function normalizeExStyle(value: unknown): ExStyleId;
