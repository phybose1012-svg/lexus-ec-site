/**
 * ドラッグ中に選択枠を図形へ追従させるための計算。
 *
 * 拡縮・回転・寸法変更は、overlay から見れば「外接矩形がどう変わったか」に
 * 還元できる。開始時の矩形と今の矩形から、当てるべき平行移動と倍率を出す。
 *
 * 端点ハンドルはここでは扱わない。端点は矩形の変形では位置が決まらないので
 * （矩形が同じでも端点は入れ替わりうる）、実測で置き直す側の担当。
 */
export interface FollowRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
}
export interface FollowTransform {
    dx: number;
    dy: number;
    sx: number;
    sy: number;
}
/** 面積がこれ未満なら倍率が発散するので追従しない。 */
export declare const MIN_FOLLOW_SIZE_PX = 0.5;
export declare function followSize(r: FollowRect): {
    w: number;
    h: number;
};
export declare function canFollow(r: FollowRect | null | undefined): boolean;
/**
 * 平行移動ぶんだけを取り出す。
 *
 * 倍率と違って割り算をしないので、**潰れた矩形でも出せる**。水平な線分は高さ 0
 * の矩形になり overlayFollowTransform が使えないが、平行移動なら枠もハンドルも
 * 図形と同じ量だけ動かしてよい（実機で「水平な線分を動かすと黄色い点線の枠が
 * 置き去りになる」と報告されたのがこれ）。
 */
export declare function overlayFollowTranslation(base: FollowRect | null | undefined, now: FollowRect | null | undefined): {
    dx: number;
    dy: number;
} | null;
/**
 * 開始時の矩形 base から現在の矩形 now への変換。
 * どちらかが潰れていれば null（＝この回は倍率を出せない）。
 */
export declare function overlayFollowTransform(base: FollowRect | null | undefined, now: FollowRect | null | undefined): FollowTransform | null;
/**
 * ドラッグ中に overlay を図形へどこまで追従させるか。
 *
 * - "transform": 外接矩形の変化（平行移動 + 倍率）をそのまま当てる。
 * - "rigid": **剛体変換だけ**当てる（平行移動と回転）。拡縮では触らない。
 * - "none": 追従させない。確定時に置き直す側の担当。
 *
 * "rigid" が要るのは、端点・頂点のたぐいが**外接矩形では位置が決まらない**から。
 * 矩形が同じでも頂点は入れ替わるので、倍率を当てると誤った位置へ行く。ところが
 * 平行移動と回転は矩形を経由せずに書ける——ピボットの周りに同じ角だけ回せば、
 * 確定後の位置と一致する（実測で誤差 1px 未満）。拡縮だけが「確定時に測り直す」
 * 側に残る。
 */
export type OverlayFollowMode = "transform" | "rigid" | "none";
/**
 * 追従したときに、その overlay の**大きさ**をどう扱うか（`mode: "transform"` だけ）。
 *
 * - `"box"` — 図形の外接矩形そのものを表す箱。倍率ぶん**寸法を作り直す**。
 *   `scale()` で引き伸ばすと、2px の線と破線のピッチまで倍率ぶん歪む。
 * - `"point"` — 大きさの決まった目印（ハンドル・回転マーク・中心のバツ印）。
 *   **位置だけ**写して、寸法も縦横比も変えない。
 *
 * 「拡大したら黄色い点線や回転マークまで伸び縮みして歪む」という実機報告
 * （2026-08-28）で分けた。それまでは全部に `translate() scale()` を丸ごと
 * 当てていたので、点状の目印まで sx ≠ sy で潰れていた。
 */
export type OverlayFollowSizing = "box" | "point";
/**
 * ドラッグの種類。追従の強さと、実測で置き直す担当をこれで決める。
 *
 * 新しいドラッグを足したら必ずここへ足す（beginOverlayFollow が要求する）。
 */
export declare const OVERLAY_DRAG_KINDS: readonly ["move", "scale", "rotate", "rectangleDimension", "ellipseRadius", "endpoint", "polygonVertex", "curveAnchor", "curveBulge", "curveControl"];
export type OverlayDragKind = (typeof OVERLAY_DRAG_KINDS)[number];
/** 平行移動だけは、端点系も図形と同じ量だけ動く。 */
export declare const TRANSLATE_DRAG_KIND: OverlayDragKind;
/**
 * 図形の形を変えないドラッグ。**剛体なので端点系も正確に追従させられる。**
 *
 * 平行移動は同じ量だけずらす。回転はピボットの周りに同じ角だけ回す。どちらも
 * 外接矩形を経由しないので、「矩形が同じでも頂点は入れ替わる」問題に当たらない。
 * 拡縮がここに居ないのはそのため（倍率は矩形からしか出せない）。
 */
export declare const RIGID_DRAG_KINDS: readonly OverlayDragKind[];
/** そのドラッグは剛体変換か（＝端点系も追従させてよいか）。 */
export declare function dragIsRigid(kind: OverlayDragKind): boolean;
export interface FollowPoint {
    x: number;
    y: number;
}
/**
 * pivot のまわりに degrees だけ回した点。
 *
 * 画面座標（y が下向き）で使う。回転ドラッグの角度は client 座標の atan2 の差
 * なので、同じ向き——y 下向きで「正の角＝画面上の時計回り」——で回す。SVG 側の
 * rotate(deg cx cy) と符号が揃っていることは実測で確かめた（回した先の予測と、
 * 確定後に測り直したハンドル位置が 1px 未満で一致する）。
 */
export declare function rotateFollowPoint(point: FollowPoint, pivot: FollowPoint, degrees: number): FollowPoint;
export interface OverlayFollowTarget {
    /** ホスト配下から拾うための CSS セレクタ。 */
    selector: string;
    mode: OverlayFollowMode;
    /**
     * 大きさの扱い。**`mode: "transform"` では必須**（`overlayFollowRegistry.test.ts`
     * が書き忘れを拾う）。`translate` / `none` は倍率を当てないので書かない。
     */
    sizing?: OverlayFollowSizing;
    /**
     * 回転の追従で、**その要素自身も回すか**（`mode: "rigid"` だけ）。
     *
     * 既定は位置だけ写す。掴む的は回っていない前提の見た目（丸・ひし形・✕）を
     * 持っていて、傾けると壊れるため。棒のように**向きそのものが意味を持つ**
     * overlay だけ true にする。**その場合、登録するのは大きさ 0 の親**で、
     * 見た目は子に持たせること（追従は style.transform を丸ごと書き換えるので、
     * 回転を持つ要素を直接登録すると角度が消えて倒れる）。
     */
    spin?: boolean;
    /**
     * このドラッグの間、**掴んでいる本人だけ**は専用ループが実測で置き直す。
     * 追従の transform を重ねると二重に効くので、begin 時に本人の要素を
     * beginOverlayFollow の第3引数へ渡して除外する（同じクラスの仲間は
     * 追従させたままにする。楕円で rx を引いている間の ry ハンドルなど）。
     */
    selfPlacedDuring?: readonly OverlayDragKind[];
    /** なぜその強さなのか。同じ登録漏れを 5 度目に出さないための記録。 */
    reason: string;
}
export declare const HIGHLIGHT_CLASS = "mp-highlight-overlay";
export declare const MULTI_HIGHLIGHT_CLASS = "mp-multi-highlight-overlay";
export declare const SCALE_HANDLE_CLASS = "mp-scale-handle";
export declare const ROTATION_HANDLE_CLASS = "mp-rotation-handle";
export declare const RECTANGLE_DIMENSION_HANDLE_CLASS = "mp-rectangle-dimension-handle";
export declare const ELLIPSE_RADIUS_HANDLE_CLASS = "mp-ellipse-radius-handle";
export declare const ELLIPSE_GUIDE_CLASS = "mp-ellipse-guide";
export declare const SYMMETRY_GUIDE_CLASS = "mp-symmetry-guide";
export declare const ENDPOINT_CLASS = "mp-endpoint-handle";
export declare const POLYGON_VERTEX_CLASS = "mp-polygon-vertex-handle";
export declare const CURVE_ANCHOR_CLASS = "mp-curve-anchor-handle";
export declare const CURVE_BULGE_CLASS = "mp-curve-bulge-handle";
export declare const CURVE_CONTROL_CLASS = "mp-curve-control-handle";
export declare const CURVE_CONTROL_LINK_CLASS = "mp-curve-control-link";
export declare const CURVE_ANCHOR_REMOVE_CLASS = "mp-curve-anchor-remove";
export declare const REGION_PREVIEW_CLASS = "mp-region-preview";
export declare const REGION_CANDIDATE_CLASS = "mp-region-candidate";
export declare const SPLIT_DOT_CLASS = "mp-split-dot";
export declare const DRAW_DOT_CLASS = "mp-draw-dot";
export declare const DRAW_PREVIEW_CLASS = "mp-draw-preview";
export declare const RECTANGLE_DRAW_PREVIEW_CLASS = "mp-rectangle-draw-preview";
export declare const FREEHAND_PREVIEW_CLASS = "mp-freehand-preview";
export declare const MARQUEE_CLASS = "mp-marquee-box";
export declare const PEN_HOVER_CLASS = "mp-pen-hover";
export declare const LASSO_CLASS = "mp-lasso";
export declare const CANVAS_GUIDES_CLASS = "mp-canvas-guides";
export declare const CANVAS_ARTBOARD_CLASS = "mp-canvas-artboard";
/**
 * overlay のクラス名 → 追従の強さ。**全クラスをここに書く。**
 *
 * 「追従対象へ足し忘れて、ドラッグ中だけ目印が取り残される」を 3 回やっている
 * （複数選択の目印 / 楕円の半径ハンドル / 多角形の頂点ハンドル）。原因はどれも
 * 「新しい overlay を足したが FOLLOW_SELECTOR に書かなかった」で同じ。既定を
 * 「書かなければ追従しない」から「書かなければテストが落ちる」へ変えるため、
 * 追従しないものも理由つきで並べる。overlayFollowRegistry.test.ts が
 * Canvas.tsx 側の取りこぼしを見張る。
 */
export declare const OVERLAY_FOLLOW_TARGETS: readonly OverlayFollowTarget[];
/**
 * その強さで追従させる要素のセレクタ。該当なしなら null
 * （querySelectorAll に空文字を渡すと SyntaxError になるため）。
 */
export declare function overlayFollowSelector(mode: OverlayFollowMode): string | null;
/**
 * `mode: "transform"` のうち、指定した大きさの扱いのものだけのセレクタ。
 *
 * 箱（枠）と点状の目印は当てるものが違うので、まとめて拾ってから分けるのでは
 * なく、拾う時点で分ける。
 */
export declare function overlaySizingSelector(sizing: OverlayFollowSizing): string | null;
/**
 * 回転の追従で、要素自身も回すもののセレクタ。該当なしなら null。
 *
 * 位置だけ写す側との違いは overlayFollow.ts の spin が持っている。呼ぶ側は
 * 「この要素は回してよいか」を毎フレーム判定するのではなく、始める前に
 * セレクタを 1 本引いておく。
 */
export declare function overlaySpinSelector(): string | null;
/** そのドラッグでは、掴んでいる本人を追従から外す必要があるか。 */
export declare function dragPlacesItsOwnHandle(kind: OverlayDragKind): boolean;
