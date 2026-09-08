import type { PenroseTrio } from "./types";
export { compileStandardSvgPathsInStyle } from "./svgPath";
export interface ResolvedShape {
    shapeType: string;
    body: string;
    isShared: boolean;
    sharedTypeName?: string;
    bodyStart: number;
    bodyEnd: number;
}
export interface SharedShapeInfo {
    typeName: string;
    fieldName: string;
    affectedPaths: string[];
}
export declare function lookupShape(trio: PenroseTrio, path: string): ResolvedShape | null;
/**
 * 選択 shape が共有 forall テンプレート由来なら、そのテンプレートを共有する
 * 実オブジェクトのパスを返す。同じ型でも別 field / 別ブロックは混ぜない。
 */
export declare function getSharedShapeInfo(trio: PenroseTrio, path: string): SharedShapeInfo | null;
export declare function updateShapeBody(trio: PenroseTrio, path: string, newBody: string): PenroseTrio;
export declare function replaceShapeTypeAndBody(trio: PenroseTrio, path: string, newShapeType: string, newBody: string): PenroseTrio;
/** 選択個体に実際に適用される property 値（個別 override 優先）を返す。 */
export declare function getEffectiveShapePropertyValue(trio: PenroseTrio, path: string, property: string): string | null;
/** 個別 override を反映した、選択オブジェクトの実効 shape body を返す。 */
export declare function getEffectiveShapeBody(trio: PenroseTrio, path: string): string | null;
export declare function hasInstanceShapePropertyOverride(trio: PenroseTrio, path: string, properties: string[]): boolean;
/**
 * 1 個体のプロパティを、他の個体を巻き込まずに書き換える。
 *
 * 共有 forall の body を書き換えると同じテンプレートの全個体が動いてしまう。
 * 個別 override が既に効いている場合も、body だけ直しても表示は変わらない。
 * どちらかに当てはまるときは override として、そうでなければ body の
 * 書き換えとして反映する。
 */
export declare function writeShapePropertyValues(trio: PenroseTrio, path: string, resolved: ResolvedShape, values: Record<string, string>): PenroseTrio;
/**
 * 選択個体の shape property を override する。
 * 既存の個別 override があれば値だけを置換し、無ければ引用 binder の
 * instance-specific forall を追加する。共有テンプレート本体は変更しない。
 */
export declare function setShapePropertyOverrides(trio: PenroseTrio, path: string, values: Record<string, string>): PenroseTrio;
/** 指定した shape property の個別 override を全て除去する。 */
export declare function clearShapePropertyOverrides(trio: PenroseTrio, paths: string[], properties: string[]): PenroseTrio;
export declare function getShapeBody(style: string, path: string): string | null;
export declare function getShapeType(style: string, path: string): string | null;
export declare function replaceShapeBody(style: string, path: string, newBody: string): string;
/**
 * 実効 d 値が「標準 SVG Path を意図しているのに壊れている」場合に、
 * UI 表示用のエラー文 (文字位置・命令・期待パラメータ数付き) を返す。
 * タプル座標形式や pathFromPoints(...) などの式は対象外 (null)。
 */
export declare function getSvgPathIssue(trio: PenroseTrio, path: string): string | null;
export declare function offsetCoords(body: string, dx: number, dy: number): string;
export interface RenderedShapePlacement {
    shapeType: string;
    points?: {
        x: number;
        y: number;
    }[];
    center?: {
        x: number;
        y: number;
    };
    /**
     * Style-compatible scalar values read from the rendered SVG primitive.
     * They are used when a dimension is omitted or is expressed through a
     * variable that cannot be rewritten safely in the source Style.
     */
    properties?: Record<string, string>;
}
/**
 * shape を平行移動する共通入口。
 *
 * 通常の個別 shape は従来どおり body の座標を更新する。共有 forall や
 * instance override で実効座標が決まる shape は、描画済みの実効座標から
 * 選択個体専用 override を作る。これにより共有テンプレートや同型要素を
 * 巻き込まず、画面で掴んだ shape だけが移動する。
 */
export declare function moveShapeByDelta(trio: PenroseTrio, path: string, delta: {
    x: number;
    y: number;
}, rendered: RenderedShapePlacement | null): PenroseTrio;
export declare function scaleCoords(body: string, cx: number, cy: number, s: number): string;
/**
 * 1 つの shape を pivot まわりに一様拡大縮小する共通入口。
 *
 * 通常の個別 shape は body 自体を更新する。共有 forall や個別 override を
 * 持つ shape は、選択したインスタンスの座標・寸法だけを override する。
 * これにより、複数選択に同じ共有テンプレート由来の shape が含まれても、
 * テンプレートを選択数ぶん重複変更したり、未選択の同型 shape を巻き込まない。
 */
export declare function scaleShapeAround(trio: PenroseTrio, path: string, pivot: {
    x: number;
    y: number;
}, factor: number, rendered: RenderedShapePlacement | null): PenroseTrio;
export type RectangleResizeDimension = "width" | "height";
/**
 * Rectangle の横幅または縦幅をマウス操作で確定する。
 *
 * 描画済み SVG から得た中心と絶対寸法を使うため、元の値が式でも編集できる。
 * 共有 shape は選択インスタンスだけに override を作り、テンプレートや兄弟を
 * 巻き込まない。
 */
export declare function resizeRectangleDimension(trio: PenroseTrio, path: string, dimension: RectangleResizeDimension, size: number, center: {
    x: number;
    y: number;
}): PenroseTrio;
export type EllipseResizeAxis = "rx" | "ry";
/**
 * Ellipse の横半径・縦半径を片方ずつ確定する。
 *
 * 中心は動かさない。回転済み楕円は SVG transform passthrough で回しており、
 * その基準点を center から作っている（ellipseRotationOverrides）。center を
 * 据え置く限り transform を貼り直す必要はなく、半径だけを書けばよい。
 *
 * 共有 shape や個別 override が効いている場合は、選択インスタンスだけに
 * override を作る。テンプレートや兄弟は巻き込まない。
 */
export declare function resizeEllipseRadius(trio: PenroseTrio, path: string, axis: EllipseResizeAxis, radius: number): PenroseTrio;
/**
 * 正円 (Circle) を、見た目の変わらない Ellipse へ作り替える。
 *
 * 縦横を別々に変えるための入口。r を rx / ry の 2 本へ開くだけで、色や線幅は
 * そのまま残す。逆向き（rx == ry の Ellipse を Circle へ戻す）はやらない。
 * 点マーカー判定・切り抜き・シンプルモードの dot 判定が Circle を見ているので、
 * 戻せてしまうとそちらの意味が変わる。
 *
 * 共有 forall で定義された Circle は個体だけを作り替えられない
 * （findInstanceShapeBlock が null を返す）。その場合は trio を素通しで返すので、
 * 呼び出し側は「変えられなかった」と伝えること。黙って効かないのは駄目。
 */
export declare function convertCircleToEllipse(trio: PenroseTrio, path: string): PenroseTrio;
/** Normalize an editor rotation to the numeric-control range. */
export declare function normalizeRotationDegrees(degrees: number): number;
/**
 * Rotate a Penrose point by an editor angle.
 *
 * The editor follows the convention used by common design tools: positive
 * values rotate clockwise on screen. Penrose coordinates use an upward Y axis,
 * so the mathematical angle is the negative of the editor angle.
 */
export declare function rotatePointAround(point: {
    x: number;
    y: number;
}, pivot: {
    x: number;
    y: number;
}, degrees: number): {
    x: number;
    y: number;
};
/** Rotate every coordinate tuple in a shape body without touching literals/comments. */
export declare function rotateCoords(body: string, cx: number, cy: number, degrees: number): string;
/** Re-anchor an editor-rotated Ellipse after its center or canvas changes. */
export declare function syncEllipseRotationTransform(trio: PenroseTrio, path: string): PenroseTrio;
/**
 * Rotate one shape around a shared pivot.
 *
 * Coordinate-based shapes are materialized as exact per-instance coordinates,
 * while Rectangle/Text/Equation/Image use Penrose's native rotation property.
 * Ellipse lacks native rotation in Penrose, so an SVG transform passthrough is
 * maintained together with its center.
 */
export declare function rotateShapeAround(trio: PenroseTrio, path: string, pivot: {
    x: number;
    y: number;
}, degrees: number, rendered: RenderedShapePlacement | null): PenroseTrio;
export declare function grayscaleStyle(style: string): string;
export declare function appendShape(trio: PenroseTrio, shapeType: string, body: string, prefix?: string): {
    trio: PenroseTrio;
    path: string;
    substanceName: string;
};
export declare function prependShape(trio: PenroseTrio, shapeType: string, body: string, prefix?: string): {
    trio: PenroseTrio;
    path: string;
    substanceName: string;
};
interface SplitOptions {
    path: string;
    subPaths: {
        x: number;
        y: number;
    }[][];
    pathData?: string[];
}
export declare function splitShapeAt(trio: PenroseTrio, opts: SplitOptions): {
    trio: PenroseTrio;
    newPaths: string[];
} | null;
export declare function deleteShapeByPath(trio: PenroseTrio, path: string): PenroseTrio;
export declare function deleteShapeByName(trio: PenroseTrio, substanceName: string): PenroseTrio;
export declare function validateStyleBraces(style: string): {
    ok: true;
} | {
    ok: false;
    reason: string;
};
export declare function enumeratePaths(trio: PenroseTrio): string[];
export interface ResolvedShapeCatalogEntry {
    path: string;
    shapeType: string;
}
/**
 * Enumerate concrete, editor-resolvable Shape paths.
 *
 * `enumeratePaths` intentionally reflects identifiers written in Style, so a
 * shared block produces `p.icon`.  The object catalog and recognition audit
 * need the instantiated paths (`A.icon`, `B.icon`) instead.  Expand applicable
 * forall scopes against typed Substance objects and retain the source block
 * order for a deterministic fallback when SVG paint order is unavailable.
 */
export declare function enumerateResolvedShapes(trio: PenroseTrio): ResolvedShapeCatalogEntry[];
export type DuplicateShapeResult = {
    ok: true;
    trio: PenroseTrio;
    path: string;
} | {
    ok: false;
    reason: string;
};
/** どの Style へでも移せる、1 個で完結した shape。 */
export interface PortableShape {
    shapeType: string;
    /** 全 override を畳み込んだ実効 body。外部への参照を残さない。 */
    body: string;
    /** appendShape へ渡す substance 名の接頭辞（点の目印だけ別枠にしてある）。 */
    prefix: string;
}
export type PortableShapeResult = {
    ok: true;
    shape: PortableShape;
} | {
    ok: false;
    reason: string;
};
/**
 * 選択個体を「どの Style へでも移せる 1 個のブロック」へ畳む。
 *
 * 共有 forall 由来や個別 override 持ちの個体は、テンプレート値ではなく選択個体の
 * 「実効値」(位置・形状・寸法・色・線・矢印など全 override) を body へ実体化する。
 * こうしておくと、貼り付け先には **この 1 個だけ**が渡る——同じ型の他の実体を
 * 連れて行かないし、コピー元の型宣言・Substance 名も持ち込まないので、
 * 貼り付け先の同名オブジェクトを巻き添えにする余地がそもそも無い。
 *
 * 安全に実体化できない場合は ok: false と理由を返す。
 */
export declare function portableShape(trio: PenroseTrio, path: string): PortableShapeResult;
/**
 * source の shape を target へ独立ブロックとして足す（座標は dx, dy ぶんずらす）。
 *
 * source と target が同じ trio なら「複製」、別の trio なら「別の図への貼り付け」。
 * どちらも同じ経路を通る——名前は **target 側で** genUniqueName が採り直し、
 * `type UserShape` も target の domain へ ensureUserShapeType が足すので、
 * 貼り付け先の既存 Substance 名・型名と衝突しない。
 *
 * 失敗時は ok: false と理由を返し、target を一切変更しない。
 */
export declare function copyShapeInto(source: PenroseTrio, path: string, target: PenroseTrio, dx?: number, dy?: number): DuplicateShapeResult;
export declare function duplicateShape(trio: PenroseTrio, path: string, dx?: number, dy?: number): DuplicateShapeResult;
