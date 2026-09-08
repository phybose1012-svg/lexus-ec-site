import type { Point2D } from "./shapeBuilders";
/**
 * 頂点ハンドルの丸の直径（px）。Canvas が実際にこの大きさで描く。下の最小間隔
 * の根拠でもあるので、描く側と判定する側が同じ値を見るようにここへ置く。
 */
export declare const VERTEX_HANDLE_SIZE_PX = 13;
/**
 * 頂点ハンドルを出してよい、隣り合う頂点どうしの最小の**画面**間隔（CSS px）。
 *
 * 根拠。丸は直径 13px、1px のふち（box-shadow）を入れて見た目 15px。中心が
 * 15px しか離れていないと丸が隙間なく触れ合い、どれを掴んでいるのか目でも指
 * でも分けられない。指・ペンの当たりは狙いから数 px ずれる（`lib/pointerInput`
 * のタップ判定は指 6px / マウス・ペン 2px）ので、丸の半径ぶん（7.5px）のすき間
 * を足した 22.5px を切り上げて 24px を下限とする。
 *
 * **画面 px で測る**のが肝。図形の座標系で測ると、用紙のキャンバス（座標が
 * Full HD の約 1/9。`lib/canvasViewport.ts` の `CanvasFormat` を見よ）だけ別の
 * 手触りになるし、拡大しても判定が変わらない。画面 px なら「密で掴めない →
 * 拡大すれば掴める」が自然に効く。
 */
export declare const MIN_VERTEX_HANDLE_SPACING_PX = 24;
/**
 * ハンドルを出す点数の安全弁。
 *
 * 掴めるかどうかは間隔で決めるので、上限そのものは本来要らない。ただし AI 由来
 * の折れ線は数百〜数千点になりうるので、DOM を作りすぎない歯止めだけ残す。
 *
 * 根拠（chromium・蛇行グリッドの折れ線・同条件 2 回。ズームのたびに走る
 * 「ハンドル全部の作り直し」／ドラッグ／確定／読み込みの順に ms）:
 *
 *     20 点   79-97    130,334    63,71    約 1.0 秒
 *    100 点  103-125   159,199    64,64    0.8-1.2 秒
 *    200 点  121-316   228,731    94,128   1.4-1.7 秒
 *    400 点  140-237   201,202   107,115   約 1.9 秒
 *    800 点  192-239   255,269   145,220   7.6-8.3 秒
 *   1600 点  --（60 秒待っても図形自体が描画されない）
 *
 * ハンドルの重さは点数にほぼ比例で、800 点でも 0.25 秒に収まる。効いてくるのは
 * ハンドルではなく **Penrose の描画**のほうで、800 点で読み込み 8 秒、1600 点
 * では描画が返ってこない。つまり、そこまで行くとハンドル以前に図形が使えない。
 * 一連の操作（読み込み・選択・ドラッグ・確定）が 1 秒前後で回る最大が 400 点
 * だったので、そこで止める。超えた図形は切り詰めずハンドル自体を出さない
 * （全体変形は従来どおり効く）。
 *
 * 参考: 交換形式の折れ線上限は 64 点（docs/INTEROP-EXCHANGE-V1.md）、手で置ける
 * 折れ線は 20 点なので、この安全弁に当たるのは取り込んだ図形だけ。
 */
export declare const MAX_VERTEX_HANDLE_COUNT = 400;
export type PolygonVertexShapeType = "Polygon" | "Polyline";
export interface PolygonVertexHandle {
    index: number;
    point: Point2D;
}
/**
 * Return an independent N-vertex handle model for point-list shapes. Never
 * truncate: returning the first N vertices of a longer shape could silently
 * delete the remainder on commit.
 *
 * ここは「そもそも点編集できる形か」だけを見る。どの頂点を出すかは画面
 * 座標が要るので、`visibleVertexHandleIndices` が Canvas 側で選ぶ。
 */
export declare function polygonVertexHandles(shapeType: string, points: readonly Point2D[]): PolygonVertexHandle[] | null;
/**
 * ハンドルを出す頂点を選ぶ。座標は**画面 (client) px**。返すのは昇順の頂点
 * 番号で、空なら 1 つも出さない。
 *
 * **間引きは図形単位ではなく頂点単位**（2026-09-01 の本人指摘）。以前は一番
 * 狭い 1 か所で図形全体を決めていたが、それだと折れ線のどこか 1 か所が詰んで
 * いるだけで、ゆったり離れた残りの頂点まで掴めなくなる。
 *
 * 選び方は先頭からの貪欲な走査。**直前に「出した」点**から
 * `minimumSpacingPx` 以上離れていれば出し、足りなければ飛ばす。直前の点では
 * なく直前に出した点から測るのが肝で、これで**画面に出た丸どうしが必ず
 * 24px 以上離れる**——守りたいのは「元の点列が疎か」ではなく「出した丸を
 * 目と指で分けられるか」なので、測る相手は出した丸のほう。
 *
 * 出さなかった頂点は掴めないままでよい（ドラッグは番号で 1 点だけ動かすので、
 * 隠した隣の頂点はその場に留まる）。**出ているのに掴めない／出ていないのに
 * 掴める**を作らないよう、Canvas はここが返した番号だけ dot を作り、その dot
 * だけがドラッグを受ける。
 *
 * 多角形は最後→最初の辺も隣り合わせなので、末尾が先頭の丸と触れ合うなら
 * 末尾側から外す（先頭を外すと走査全体の起点が変わってやり直しになる）。
 *
 * 生き残りが 1 つだけなら何も出さない。図形のどこも掴み分けられない状態で
 * 丸が 1 つだけ浮くのは、編集できる合図ではなく壊れて見える。拡大すれば
 * 間隔が開いて増える（判定は画面 px なので拡大がそのまま効く）。
 *
 * 見るのは**走査順で隣り合う丸だけ**。折り返して画面上で重なる離れた番号どうし
 * は従来どおり見ない（全点どうしの最近傍は点数の二乗になる）。
 */
export declare function visibleVertexHandleIndices(shapeType: PolygonVertexShapeType, screenPoints: readonly Point2D[], minimumSpacingPx?: number): number[];
/** Replace exactly one vertex without mutating the source point list. */
export declare function movePolygonVertex(points: Point2D[], index: number, point: Point2D): Point2D[];
/**
 * Recover exact vertices from the straight SVG path emitted for an arrowed
 * Penrose Polyline. Curves, closed paths, and multiple subpaths are rejected:
 * sampled path points must never be mistaken for user-authored vertices.
 */
export declare function straightPathVertexPoints(pathData: string): Point2D[] | null;
