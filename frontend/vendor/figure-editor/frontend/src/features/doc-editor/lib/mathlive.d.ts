import "mathlive/fonts.css";
import "mathlive/static.css";
import { MathfieldElement } from "mathlive";
export declare function setupMathlive(): void;
/**
 * dx / dy / dt を upright な微分記号（\differentialD）へ自動変換する MathLive
 * 既定のインラインショートカットを無効化する。日本語の数学教材では dx は斜体
 * （変数と同じ italic）で書くのが自然で、勝手にブロック体になるのを防ぐ。
 * 他のショートカット（\alpha 等）はそのまま残す。math-field のマウント後に呼ぶ。
 */
export declare function disableDifferentialShortcuts(mf: MathfieldElement): void;
/**
 * math-field のコンテキストメニュー（≡）を、確実に効くフラット項目
 * （切り取り・コピー・貼り付け・すべて選択）だけに絞る。サブメニューは
 * 全撤去して位置ずれバグを根絶する。math-field のマウント後に呼ぶ。
 */
export declare function customizeMathMenu(mf: MathfieldElement): void;
/** rows×cols の行列（pmatrix, 丸括弧）。縦ベクトル=cols 1、横ベクトル=rows 1。 */
export declare function buildMatrixLatex(rows: number, cols: number): string;
/** n 個の場合分け（cases）。各行は「式 & 条件」の2列。 */
export declare function buildCasesLatex(n: number): string;
/** LaTeX に行・列を増減できる配列環境（行列・場合分け）が含まれるか。aligned は除く。 */
export declare function hasEditableArray(latex: string): boolean;
/** カーソルの属する環境名が「行・列を増減できる行列/場合分け」か */
export declare function isEditableArrayEnv(name: unknown): boolean;
/**
 * 行列・場合分けの「空セル」を \placeholder{}（□）で埋める。
 * こうすると確定後も欄の箱が必ず表示され、未入力が一目で分かる。
 * ネストした環境のセル区切り（& \\）は splitTopLevel で保護する。
 */
export declare function fillEmptyArrayCells(latex: string): string;
/** 確定済みの式に未入力の欄（\placeholder{}）が残っているか（エラー表示用） */
export declare function hasEmptyPlaceholder(latex: string): boolean;
/** LaTeX → 静的 HTML（表示用）。編集時と同じ MathLive エンジンなので見た目が一致する。 */
export declare function latexToMarkup(latex: string): string;
export type MathRowKind = "eq" | "iff" | "then" | "plain";
/**
 * 新しい行を末尾に追加した LaTeX を返す。既存行は今の揃え（左端 or = 揃え）を
 * 保ったまま整え直す（編集中もリアルタイムで揃う）。= の自動挿入はしないので、
 * ユーザーが続けて式を打っても二重イコールにならない。
 * ネスト環境入りなら null（呼び出し側は確定動作にフォールバック）。
 */
export declare function withNewMathRow(latex: string, kind: MathRowKind): string | null;
/** 確定時などに全行を今の揃え（左端 or = 揃え）で整える。1行なら素通し。 */
export declare function normalizeMathRows(latex: string): string;
/** 「＝で揃える」ボタン: 左端揃え ⇔ = 揃え をトグルする（複数行のときのみ）。 */
export declare function toggleMathAlign(latex: string): string;
/** いま = 揃えか（ボタンのアクティブ表示用） */
export declare function isEqAligned(latex: string): boolean;
/** 1行ぶんの LaTeX から行の種類を推定する */
export declare function rowKindOf(row: string): MathRowKind;
/** Enter で繰り返すために、最後の行の種類を推定する */
export declare function detectLastRowKind(latex: string): MathRowKind;
/**
 * 空行（アンカーや接続記号だけで中身のない行）を取り除く。
 * 1行だけ残ったら aligned 環境を外して素の数式に戻す。
 */
export declare function cleanupMathRows(latex: string): string;
