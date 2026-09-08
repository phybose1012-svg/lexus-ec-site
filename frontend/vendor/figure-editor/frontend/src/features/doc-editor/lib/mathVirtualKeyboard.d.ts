import type { VirtualKeyboardLayout, VirtualKeyboardName } from "mathlive";
export declare const MATHLIVE_KEYBOARD_Z_INDEX = 105;
/** 仮想キーボードとその候補パネル(106)より確実に手前。アプリ内の最大は 80（数式ダイアログ）。 */
export declare const MATH_PANEL_Z_INDEX = 200;
export declare const FORMULA_LAYER_ID = "fibona-formula-tab";
export declare const BASIC_LAYER_ID = "fibona-basic";
export declare const ALPHA_LAYER_ID = "fibona-alpha";
/** 仮想キーボードに載せるタブ（この 3 つだけ）。 */
export declare const FIBONA_KEYBOARD_LAYOUTS: readonly (VirtualKeyboardName | VirtualKeyboardLayout)[];
/** handleFormulaTabPointerDown が必要とする最小の形（PointerEvent はこれを満たす）。 */
export interface FormulaTabPointerEvent {
    button: number;
    target: EventTarget | null;
    preventDefault: () => void;
    stopPropagation: () => void;
}
/**
 * 「数式」タブのタップを捕まえて、面を切り替える代わりに自前パネルを開く。
 *
 * MathLive はキーボード要素の **バブル** で pointerdown を拾い、祖先をたどって
 * data-layer を持つ要素が見つかると currentLayer を差し替える
 * （mathlive.mjs の handlePointerDown）。なので document の **キャプチャ** で
 * 先回りして stopPropagation すれば、MathLive のハンドラは動かず面は
 * 直前のまま留まる（＝空白の壊れた面にならない）。
 *
 * data-layer が載るのはレイアウト切り替えタブだけで、面の中の切り替えキー
 * （ABC / 123）は command 経由なので data-layer を持たない。取り違えは起きない。
 */
export declare function handleFormulaTabPointerDown(event: FormulaTabPointerEvent): boolean;
/**
 * 仮想キーボードのタブ構成を差し込む。setupMathlive から 1 回だけ呼ぶ。
 * math-field を作る前に呼んでおくこと（MathLive はキーボード生成時に layouts を読む）。
 */
export declare function installFibonaVirtualKeyboard(): void;
