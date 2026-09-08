/** ルートの内側に必ず残す余白。ここより外へは何も出さない。 */
export declare const MINI_BAR_MARGIN = 4;
/** バーとドロップダウンの隙間。Tailwind の mt-1 / mb-1 と同じ 4px。 */
export declare const MINI_BAR_MENU_GAP = 4;
export declare const FRAME_CLEARANCE_ABOVE: number;
export declare const FRAME_CLEARANCE_BELOW: number;
/**
 * どちら側にも余白が無いときでも、これだけは高さを与える。
 * 選択枠がキャンバスをほぼ埋めている場合にしか効かない保険で、
 * 「潰れて見えない」より「小さくても中でスクロールできる」を選ぶ。
 */
export declare const MENU_MIN_HEIGHT = 88;
/**
 * ルートの上端・下端に、別のバーが貼り付いているぶんの高さ (px)。
 *
 * なぞりの候補バー（`FreehandPickerBar`）は同じ領域の上端か下端に帯で出る。
 * ミニバーは選択枠の脇に出るので、なぞりで置いた図形が端に近いと**2 つの
 * バーが重なる**。帯の高さをここへ渡して、置ける範囲をその分だけ内側へ詰める。
 *
 * **候補バー側は詰めない。** あちらは「描いた図形に被らない側の端を選ぶ」
 * （`freehandBarPlacement.ts`）で決まっていて、そこへミニバーを見に行かせると
 * 互いを避け合って落ち着かない。避けるのは後から出る側だけ、と一方向にする。
 */
export interface ReservedBands {
    reservedTop?: number;
    reservedBottom?: number;
}
export interface MiniBarGeometry extends ReservedBands {
    /** ルートの内寸。 */
    rootWidth: number;
    rootHeight: number;
    /** 選択枠の矩形 (ルート座標)。 */
    boxTop: number;
    boxBottom: number;
    boxLeft: number;
    boxRight: number;
    /** バー自身の実測サイズ。 */
    barWidth: number;
    barHeight: number;
}
export interface MiniBarPlacement {
    left: number;
    top: number;
    /** true ならバーは選択枠の上。ドロップダウンも上向き (bottom-full) に開く。 */
    above: boolean;
    /** 選んだ側の実余白から出したドロップダウンの高さ上限。 */
    menuMaxHeight: number;
}
/**
 * バーの位置と、そこから開くメニューの向き・高さ上限を決める。
 *
 * `menuHeight` はいま開いているドロップダウンの実測高さ。閉じているときは 0。
 * メニューは必ずバーから見て図形の反対側へ開くので、図形を隠さない。
 */
export declare function computeMiniBarPlacement(geom: MiniBarGeometry, menuHeight?: number): MiniBarPlacement;
export interface PanelPlacementInput extends ReservedBands {
    /** ルートの内寸。 */
    rootWidth: number;
    rootHeight: number;
    /** 親（バー、または上位のメニュー項目）の矩形。ルート座標。 */
    anchorTop: number;
    anchorBottom: number;
    /** 左右の基準（押したボタンの中心）。ルート座標。 */
    anchorCenterX: number;
    /** 中身をそのまま描いたときの実測サイズ（高さの制限をかける前）。 */
    panelWidth: number;
    panelHeight: number;
    /** 親から見て上へ開きたいか。入らなければ反対側へ回す。 */
    above: boolean;
}
export interface PanelPlacement {
    /** ルート座標。呼び出し側で親からの相対へ直す。 */
    left: number;
    top: number;
    maxHeight: number;
}
/**
 * 開いたパネル（1 段目のドロップダウンでも、その中からさらに開く 2 段目でも）を
 * ルートの内側へ必ず収める。
 *
 * **段数に依存しない。** 親が何であれ「親の矩形・開きたい向き・自分の実測サイズ」
 * だけで決まる。2 段目を足すときは anchor に親の項目の矩形を渡せばよい。
 *
 * `top` を自分で返すのが要点。CSS の top-full / bottom-full（親にぴったり付ける）
 * だけに任せると、親がルートの端にいるときに外側へ押し出されて切り取られる。
 * 実際、縦に長い図形を選ぶとバーが下端に貼り付き、そこから下へ開いたメニューが
 * まるごとキャンバスの外へ出ていた。
 */
export declare function computePanelPlacement({ rootWidth, rootHeight, anchorTop, anchorBottom, anchorCenterX, panelWidth, panelHeight, above, reservedTop, reservedBottom, }: PanelPlacementInput): PanelPlacement;
