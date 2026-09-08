export type SvgPathCommand = {
    readonly type: "M";
    readonly x: number;
    readonly y: number;
} | {
    readonly type: "L";
    readonly x: number;
    readonly y: number;
} | {
    readonly type: "C";
    readonly x1: number;
    readonly y1: number;
    readonly x2: number;
    readonly y2: number;
    readonly x: number;
    readonly y: number;
} | {
    readonly type: "Q";
    readonly x1: number;
    readonly y1: number;
    readonly x: number;
    readonly y: number;
} | {
    readonly type: "A";
    readonly rx: number;
    readonly ry: number;
    readonly xAxisRotation: number;
    readonly largeArcFlag: 0 | 1;
    readonly sweepFlag: 0 | 1;
    readonly x: number;
    readonly y: number;
} | {
    readonly type: "Z";
};
export interface SvgPathParseError {
    message: string;
    /** source 内の 0 始まり文字位置 (入力検証など位置が無い場合は -1) */
    index: number;
    /** エラーが起きた命令文字 (分かる場合) */
    command?: string;
    /** その命令が要求するパラメータ数 (分かる場合) */
    expectedParams?: number;
}
export type SvgPathParseResult = {
    ok: true;
    commands: SvgPathCommand[];
} | {
    ok: false;
    error: SvgPathParseError;
};
export type SvgPathDataResult = {
    ok: true;
    value: string;
} | {
    ok: false;
    error: SvgPathParseError;
};
/** 対応済みの変形。将来のアフィン拡張はこの union に追加する。 */
export type SvgPathTransform = {
    readonly kind: "translate";
    readonly dx: number;
    readonly dy: number;
} | {
    readonly kind: "uniformScale";
    readonly cx: number;
    readonly cy: number;
    /** 正の値のみ。負・0 (鏡映・退化) は円弧の sweep-flag 反転が必要なため未対応。 */
    readonly factor: number;
} | {
    readonly kind: "rotate";
    readonly cx: number;
    readonly cy: number;
    /** Mathematical angle in degrees (positive is counter-clockwise). */
    readonly degrees: number;
};
export declare function parseSvgPathData(source: string): SvgPathParseResult;
export declare function serializeSvgPathData(commands: readonly SvgPathCommand[]): string;
/**
 * 正規化済みコマンド列へ変形を適用する。
 * - translate: 全ての点・制御点・円弧終点を移動。rx/ry/回転角/フラグは不変。
 * - uniformScale (factor > 0): 全ての点・制御点を pivot 中心に拡縮し、
 *   円弧の rx/ry も同倍率で拡縮。回転角とフラグは正の均等拡縮では不変。
 */
export declare function transformSvgPathCommands(commands: readonly SvgPathCommand[], transform: SvgPathTransform): SvgPathCommand[];
/**
 * Path データ文字列へ変形を適用して文字列で返す共通入口。
 * 入力パラメータと変形後の全数値を検証し、失敗時は元 Path を一切変更しない
 * 構造化エラーを返す。
 */
export declare function transformSvgPathDataString(source: string, transform: SvgPathTransform): SvgPathDataResult;
/** Path データ文字列を (dx, dy) だけ平行移動する。パース失敗時は構造化エラー。 */
export declare function translateSvgPathData(source: string, dx: number, dy: number): SvgPathDataResult;
/**
 * Path データ文字列を pivot 中心に factor 倍へ均等拡縮する。
 * factor は正の値のみ (負・0 は円弧の sweep-flag 反転を伴うため未対応)。
 */
export declare function scaleSvgPathDataAround(source: string, pivotX: number, pivotY: number, factor: number): SvgPathDataResult;
/** Path データ文字列を pivot 中心に回転する。正の角度は反時計回り。 */
export declare function rotateSvgPathDataAround(source: string, pivotX: number, pivotY: number, degrees: number): SvgPathDataResult;
/**
 * 正規化済みコマンド列を、Penrose Style が受け付ける PathData 式へ変換する。
 *
 * Penrose の Path.d は PathDataV 型で、生の SVG Path 文字列 (StrV) を
 * 受け付けない。そこでコンパイル直前に d の標準 SVG 文字列をこの式へ
 * 置き換えて描画可能にする (格納形式・編集対象はあくまで元の文字列)。
 *
 * 変換規則:
 *   - 連続する L は 1 つの pathFromPoints にまとめる
 *   - C → cubicCurveFromPoints / Q → quadraticCurveFromPoints / A → arc
 *   - サブパス内の連結は joinPaths (後続フラグメントの M を除去して継続)
 *   - Z はサブパス最後のフラグメントを pathType "closed" にすることで、
 *     Penrose の PathBuilder が実際の Z (closepath) を出力する。連結後の
 *     サブパスには M が 1 つしか無いため、Z はサブパス開始点へ正しく閉じる
 *     (真の closepath: line join で閉じ、太線・破線でも L と描画が変わらない)
 *   - 複数サブパスは concatenatePaths (各サブパスの M を保持)
 *   - 空 Path / M のみのサブパスは「同一点 2 つの零長パス」で表現する。
 *     SVG 仕様どおり何も描画せず、1 点だけの pathFromPoints が Penrose の
 *     BBox 計算 (空配列 reduce) を落とす問題も回避する (実測で決定)
 */
export declare function svgPathCommandsToPenroseExpression(commands: readonly SvgPathCommand[]): string;
export declare function maskProtectedSegments(source: string): string;
/**
 * コンパイル直前の変換: Style 中の「Path shape の d プロパティ」の標準 SVG
 * Path 文字列を、Penrose が受け付ける PathData 式へ置き換える。
 *
 * Penrose の Path.d は PathDataV 型で文字列を受け付けないため、この変換が
 * ないと標準 SVG Path を含む trio は描画できない。編集・保存対象の trio は
 * 元の文字列のまま保持し、compile へ渡す style だけを変換する。
 *
 * 変換対象は Path コンテキストに限定する:
 *   (a) `… = Path { d: "…" }` — direct / forall 共有 / 1 行ブロックすべて
 *   (b) `override x.shape.d = "…"` などのドット付き .d 代入 (instance override)
 * ローカル変数 `d = "…"`、他 shape のプロパティ、Text / Equation / Image の
 * 文字列、コメント、URL は変換しない (マスクとブロック解析で除外)。
 *
 * 空文字列の d は「何も描かない」有効な Path として零長 PathData 式へ変換する。
 * 標準 SVG としてパースできない文字列はそのまま残し、従来どおり Penrose の
 * 型エラーとして表面化させる (推測で書き換えない)。
 */
export declare function compileStandardSvgPathsInStyle(style: string): string;
/** UI 表示・ログ用のエラー文 (文字位置・命令・期待パラメータ数を含む)。 */
export declare function svgPathParseErrorMessage(error: SvgPathParseError): string;
