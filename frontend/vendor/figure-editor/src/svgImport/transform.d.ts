export interface Matrix {
    readonly a: number;
    readonly b: number;
    readonly c: number;
    readonly d: number;
    readonly e: number;
    readonly f: number;
}
export declare const IDENTITY: Matrix;
export declare function multiply(left: Matrix, right: Matrix): Matrix;
export declare function applyMatrix(matrix: Matrix, point: {
    x: number;
    y: number;
}): {
    x: number;
    y: number;
};
export declare function isIdentity(matrix: Matrix): boolean;
/** 平行移動のみか（回転・拡縮・せん断が無いか）。 */
export declare function isTranslationOnly(matrix: Matrix): boolean;
/** 回転・せん断が無く、x と y の倍率が等しい相似変換か。 */
export declare function uniformScaleOf(matrix: Matrix, epsilon?: number): number | null;
/**
 * 線幅など「長さ」に掛かる倍率。
 * 非等方な変形では SVG も一意には決めていない（面積の平方根が慣例）ので、
 * 行列式の平方根を使う。
 */
export declare function lengthScaleOf(matrix: Matrix): number;
/** 回転角（度・SVG の画面座標での時計回りが正）。せん断があるときは近似。 */
export declare function rotationDegreesOf(matrix: Matrix): number;
/**
 * `transform` 属性を 1 つの行列へ畳む。左から順に適用（SVG の規定どおり）。
 * 未知の関数は無視せず拒否する（黙って位置がずれるより、読めないと言うほうがよい）。
 */
export declare function parseTransform(source: string, index?: number): Matrix;
/**
 * viewBox と width/height から、外側の座標系へ載せる行列を作る。
 * preserveAspectRatio は既定 (`xMidYMid meet`) と `none` のみ解釈する。
 */
export declare function viewBoxMatrix(viewBox: {
    x: number;
    y: number;
    width: number;
    height: number;
}, width: number, height: number, preserveAspectRatio: string | null): Matrix;
