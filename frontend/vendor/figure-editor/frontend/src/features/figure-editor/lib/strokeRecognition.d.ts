import type { Point2D } from "./shapeBuilders";
import type { SymmetryGuideKind } from "./symmetryGuides";
/**
 * 認識のしきい値。**決め打ちを散らさないため、ここが唯一の定義元。**
 *
 * 比で持っているものは、断りがなければ「その軌跡自身の外接矩形の対角線」に
 * 対する割合。軌跡の大きさに追随するので、キャンバスの解像度や拡大率が
 * 変わっても同じ絵は同じように読める。
 */
export declare const STROKE_RECOGNITION: {
    /** 認識にかける前に軌跡を等間隔へ引き直す点数。ペンの速さを結果から外す。 */
    readonly RESAMPLE_COUNT: 64;
    /** キャンバス短辺に対する割合。これ未満の長さ・大きさはタップであって図形ではない。 */
    readonly MIN_PATH_LENGTH_FRACTION: 0.02;
    readonly MIN_DIAGONAL_FRACTION: 0.01;
    /** 始点と終点がこれだけ近ければ「閉じた」と読む。 */
    readonly CLOSING_GAP_FRACTION: 0.28;
    /** 閉じた輪が外接矩形のうち囲む面積の下限。線を往復しただけの軌跡を弾く。 */
    readonly MIN_LOOP_AREA_FRACTION: 0.04;
    /**
     * 角を探す粗さ（Douglas-Peucker の許容量 / 対角線）。
     *
     * 手描きの輪には正しい読みが 1 つに決まらない。細かく読めば六角形、粗く読めば
     * 五角形。**どちらが本意かは幾何には分からない**ので、出てきた頂点数はすべて
     * 候補にして選ばせる。先頭の値は開いた軌跡の「折り返し」判定にも使う。
     */
    readonly CORNER_TOLERANCE_SWEEP: readonly [0.05, 0.03, 0.08, 0.12];
    /** 連鎖曲線の通過点を決める許容量。 */
    readonly CURVE_TOLERANCE_FRACTION: 0.015;
    /** 曲線の通過点の上限。つまみが重なって狙えなくなるので欲張らない。 */
    readonly MAX_CURVE_POINTS: 8;
    /** どの読みにも当てはまらなかった軌跡を、なぞったまま残すときの上限。 */
    readonly MAX_TRACED_CURVE_POINTS: 16;
    /** 当てはまりの悪さ（残差 / 対角線）がここまで来ると点数 0。 */
    readonly ACCURACY_SPAN: 0.06;
    /** 1 つでもこれだけ折れていないと、角の連なりとは読まない。 */
    readonly CORNER_TURN_DEGREES: 48;
    /** 折れ具合を測る、頂点の前後の標本数。 */
    readonly CORNER_WINDOW: 4;
    /** 角の前後の直線区間が、直線からどれだけ外れてよいか（自身の長さ比）。 */
    readonly CORNER_RUN_STRAIGHTNESS: 0.06;
    /** 折れが頂点の近くにどれだけ集中しているか。円弧の途中を角と読まないため。 */
    readonly CORNER_CONCENTRATION: 0.8;
    /** ここまで折れているのは角ではなく折り返し（自分の線をなぞり返した）。 */
    readonly REVERSAL_TURN_DEGREES: 155;
    /** 多角形の頂点として残す最小の折れ角。これ未満は辺の途中。 */
    readonly POLYGON_VERTEX_TURN_DEGREES: 20;
    /** この距離（中央値の辺に対する割合）より近い 2 頂点は、1 つの角を割ったもの。 */
    readonly VERTEX_MERGE_FRACTION: 0.3;
    /** 水平・鉛直からこれだけのずれなら、まっすぐ立て直す。 */
    readonly AXIS_SNAP_DEGREES: 10;
    /** 長半径と短半径の比がここまでなら「円」。 */
    readonly CIRCLE_RATIO: 1.12;
    /** 多角形の辺数の上限。 */
    readonly MAX_POLYGON_VERTICES: 8;
    /** ペンが置き際・離し際に汚した区間として切ってよい長さ（対角線比）。 */
    readonly ENDPOINT_SPAN_FRACTION: 0.07;
    /** 走り出しの向きからこれだけ外れた一歩は、描いたのではなく引っかけた跡。 */
    readonly HOOK_TURN_DEGREES: 55;
    /** 進んだ距離のこの倍も彷徨っていたら、そこは描き始めではなくペンの落ち着き。 */
    readonly DWELL_ARC_RATIO: 1.8;
    /** 曲線の通過点を決めるときだけかける平滑化の半径。手の震えと曲がりを分ける。 */
    readonly CURVE_SMOOTHING_RADIUS: 2;
    /** これに届く読みが 1 つも無ければ、なぞったままを先頭に出す。 */
    readonly CONFIDENCE_FLOOR: 0.4;
    /** 出す候補の数。1 つが採用、残りが「他の読み」。 */
    readonly MAX_CANDIDATES: 5;
    /**
     * 対称・周期の補正候補をいくつまで足すか。
     *
     * 足すのは**なぞったままが採用されたとき**だけ（読みが図形名に落ちた軌跡に
     * 対称の話をしても意味がない）。合計が MAX_CANDIDATES を超えないよう、
     * 足したぶんだけ読みの側を削る。削っても「なぞったまま」は必ず先頭に残る
     * ——足す条件がそれなので。
     */
    readonly MAX_CORRECTION_CANDIDATES: 3;
    /** 制御点 1 つあたりの減点。震えを余分な自由度で拾う読みを勝たせない。 */
    readonly PARAMETER_PENALTY: 0.02;
    /** 生の点列を取り込むときの最小間隔（画面 px）。iPad の数百点を減らす。 */
    readonly INPUT_MIN_STEP_PX: 2;
    /** 取り込む点数の上限。長くなぞっても計算量を頭打ちにする。 */
    readonly INPUT_MAX_POINTS: 600;
};
/**
 * 対称・周期の補正の札を、候補バーに出すか。
 *
 * 2026-08-30、実機の評価で 2 件——明らかに対称でない図にまで札が出ること、
 * 左右対称を選んでも左右の端点の高さが揃わないこと——が出て、いったん false に
 * して隠した。判定を作り直して（lib/strokeCorrection.ts の冒頭を見よ）戻した
 * ので、いまは true。
 *
 * **消さずに残してある。** 判定の作り直しは実機で確かめるほかない類の直しで、
 * 次に何かあったときも「本体に触らずに札だけ止める」が最初の一手になる。
 */
export declare const SHOW_STROKE_CORRECTIONS = true;
/** 認識が返す幾何。Penrose 座標（y 軸は上向き）。 */
export type RecognizedShape = {
    kind: "circle";
    center: Point2D;
    radius: number;
} | {
    kind: "ellipse";
    center: Point2D;
    rx: number;
    ry: number;
    /** エディタ準拠の回転角（画面で時計回りが正）。0 なら軸に平行。 */
    rotationDegrees: number;
} | {
    kind: "line";
    start: Point2D;
    end: Point2D;
} | {
    kind: "polyline";
    points: Point2D[];
} | {
    kind: "polygon";
    points: Point2D[];
    /** 正多角形として読んだときだけ。エディタの辺数メタへそのまま渡す。 */
    regularSides: number | null;
} | {
    kind: "curve";
    throughPoints: Point2D[];
};
export interface RecognizedCandidate {
    shape: RecognizedShape;
    /** 0..1。大きい順に並べて返す。 */
    confidence: number;
    /** 候補バーに出す名前。「円」「正五角形」など、教室で使う言い方。 */
    label: string;
    /**
     * 対称の補正だけが持つ、**どの対称か**。
     *
     * **座標は運ばない。** 画面のガイド（点線の軸・×印）は、置いたあとの図形の
     * 両端からそのつど引き直す（lib/symmetryGuides.ts）。ここで軸の座標まで
     * 渡していた頃は、図形を動かすとガイドが取り残された。
     */
    symmetryGuide?: SymmetryGuideKind | null;
}
export interface StrokeRecognitionOptions {
    /** キャンバスの寸法。小さすぎる軌跡を弾く下限をここから引く。 */
    canvas: {
        width: number;
        height: number;
    };
}
/**
 * 生の pointermove を距離で間引く。
 *
 * iPad は 1 本のなぞりで数百点を出す。全部持つと認識の前処理も下絵の描き直しも
 * 点数ぶん重くなるので、**取り込む時点**で落とす。落とすのは「前の点から
 * `minStep` も離れていない点」だけなので、形は変わらない。
 */
export declare function thinStrokeInput(points: readonly Point2D[], minStep?: number, maxPoints?: number): Point2D[];
/**
 * 軌跡が「なりうる図形」を、確からしい順に返す。
 *
 * 空の配列は「小さすぎて図形ではない」。それ以外は必ず 1 つ以上返す——名前の
 * ついた読みが 1 つも届かなくても、なぞったままの曲線が先頭に来る。**描いた
 * ものが消えるのが、この道具で一番あってはならないこと。**
 */
export declare function recognizeStroke(rawPoints: readonly Point2D[], options: StrokeRecognitionOptions): RecognizedCandidate[];
