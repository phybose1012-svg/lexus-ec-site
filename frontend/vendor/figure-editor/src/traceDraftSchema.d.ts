/**
 * 「なぞりの下書き」の受け渡し形式。sidecar と frontend の両方が参照する。
 *
 * AI に Penrose の Style を書かせるのはやめて、置きたい図形の一覧だけを
 * 返させる。理由は 2 つある:
 *
 * 1. AI 編集は Style しか差し戻せないため、新しいオブジェクトを足すのに必要な
 *    Substance の宣言が入らず、追加は構造的に成立しなかった。
 * 2. 図形の作り方はエディタが既に持っている (手で追加するのと同じ経路)。
 *    そちらへ渡せば、文法も参照整合性も機械的に保証される。
 *
 * 図形の種類は、エディタが手で描けるもの (点・線分・折れ線・長方形・円弧・
 * 楕円・曲線・ラベル) と 1 対 1 に対応させてある。テキスト領域だけは中身が
 * リッチテキストで、なぞりの下書きから作る意味がないので入れていない。
 *
 * 座標はすべて「下敷きにした画像の左上を (0,0)、右下を (1,1) とする正規化値」。
 * キャンバスの寸法や単位 (mm/px)、Penrose の原点の取り方を AI に理解させない。
 */
export interface TraceDraftPoint {
    x: number;
    y: number;
}
/**
 * 点 1 つ。交点・格子点・質点など。
 *
 * radius は「画像の長辺に対する割合」= 縦横の尺度差を受けない 1 つの尺度
 * (circle と同じ取り方)。省略してよく、そのときは配置側がキャンバスの
 * 大きさから妥当な半径を決める。絶対 px で受けると大きなキャンバスで
 * また極小になる。
 */
export interface TraceDraftDot {
    kind: "point";
    at: TraceDraftPoint;
    radius?: number;
}
/** 直線 1 本。始点と終点。 */
export interface TraceDraftLine {
    kind: "line";
    points: [TraceDraftPoint, TraceDraftPoint];
}
/** 折れ線。closed が真なら最後の点から最初の点へ戻して閉じる (三角形など)。 */
export interface TraceDraftPolyline {
    kind: "polyline";
    points: TraceDraftPoint[];
    closed?: boolean;
}
/** 長方形。向かい合う 2 隅で表す。 */
export interface TraceDraftRectangle {
    kind: "rectangle";
    corners: [TraceDraftPoint, TraceDraftPoint];
}
/**
 * 楕円・円。外接する長方形の向かい合う 2 隅で表す。
 *
 * 半径を数値で書かせると、画像が正方形でないときに縦横どちらの割合なのかが
 * 曖昧になる。囲みで表せばその曖昧さが消え、円も正しく円のまま戻る。
 */
export interface TraceDraftEllipse {
    kind: "ellipse";
    bounds: [TraceDraftPoint, TraceDraftPoint];
}
/**
 * 正円。中心と半径で表す。
 *
 * 半径は「画像の長辺に対する割合」= 縦横で尺度が違う正規化座標の影響を受けない
 * 1 つの尺度。囲み (ellipse) で円を書かせると、正方形でない画像では Δx=Δy の
 * 囲みが必ず rx≠ry になり、正円が楕円へ潰れる。円はこちらで受ける。
 */
export interface TraceDraftCircle {
    kind: "circle";
    center: TraceDraftPoint;
    radius: number;
}
/** 円弧。始点・弧の上の点・終点の 3 点で表す。 */
export interface TraceDraftArc {
    kind: "arc";
    points: [TraceDraftPoint, TraceDraftPoint, TraceDraftPoint];
}
/** 3 次ベジェ 1 本。始点・制御点 2 つ・終点。 */
export interface TraceDraftCurve {
    kind: "curve";
    points: [
        TraceDraftPoint,
        TraceDraftPoint,
        TraceDraftPoint,
        TraceDraftPoint
    ];
}
/** 短いラベル。math が真なら数式 (TeX) として組む。 */
export interface TraceDraftLabel {
    kind: "label";
    at: TraceDraftPoint;
    text: string;
    math?: boolean;
}
export type TraceDraftShape = TraceDraftDot | TraceDraftLine | TraceDraftPolyline | TraceDraftRectangle | TraceDraftEllipse | TraceDraftCircle | TraceDraftArc | TraceDraftCurve | TraceDraftLabel;
export interface TraceDraft {
    shapes: TraceDraftShape[];
    /** 利用者へ見せる 1〜2 文の説明。 */
    note?: string;
}
/** 1 回の下書きで置く図形数の上限。多すぎる応答は手直しの負担になる。 */
export declare const MAX_TRACE_DRAFT_SHAPES = 60;
/** ラベル文字列の上限。図の中の短い注記しか想定しない。 */
export declare const MAX_TRACE_DRAFT_LABEL_LENGTH = 120;
/** 折れ線 1 本の頂点数の上限。これを超える点列は曲線として描くべきもの。 */
export declare const MAX_TRACE_DRAFT_POLYLINE_POINTS = 40;
/**
 * AI の応答を下書きとして受け取れる形に整える。
 *
 * 読めない図形は個別に捨てて、残りを活かす。1 つの座標ミスで下書き全体を
 * 失うより、置けたものを手直しできる方が使える。
 */
export declare function parseTraceDraft(value: unknown): TraceDraft;
