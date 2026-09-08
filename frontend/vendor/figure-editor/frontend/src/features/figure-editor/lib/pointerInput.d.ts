/**
 * キャンバスのドラッグを Pointer Events で扱うための土台。
 *
 * マウス専用だったキャンバスを指とペンでも動かすために置いた。マウス・ペン・指は
 * 同じ pointerdown/move/up を出すので、載せ替えても入力ごとの分岐は増えない。
 * 一方でマウスには無かった事情が 3 つあり、それをここに集める。
 *
 * 1. 2 本目の指。ドラッグ中にもう一本触れると pointerdown がもう一度来る。
 *    握っているポインタを 1 つに限らないと、1 本の指の動きで 2 つのドラッグが
 *    同時に走る。
 * 2. 追従の切れ。指は要素の外へ出ても追いかけたいが、pointerdown を受けた要素が
 *    DOM から消えると暗黙のポインタキャプチャも消える。図形エディタは再コンパイル
 *    のたびに SVG とオーバーレイを作り直すので、これは普通に起きる。キャプチャは
 *    作り直されないホスト要素へ明示的に取る。
 * 3. 中断。着信や通知で OS がジェスチャを取り上げると pointercancel だけが来て
 *    pointerup は来ない。ここで確定処理を走らせると、ユーザーが意図しない編集が
 *    入る。中断は「やめる」であって「離した」ではない。
 */
/** どれで触っているか。許容値を変えるのに使う。 */
export type PointerKind = "mouse" | "pen" | "touch";
/** イベントのうち、この層が見る部分だけ。テストから呼びやすくするため。 */
export interface PointerLike {
    pointerId: number;
    pointerType: string;
}
/** キャプチャに必要な部分だけ。実体は HTMLElement。 */
export interface CaptureTarget {
    setPointerCapture(pointerId: number): void;
    releasePointerCapture(pointerId: number): void;
    hasPointerCapture?(pointerId: number): boolean;
}
export declare function pointerKind(e: PointerLike): PointerKind;
/**
 * クリック扱いにする移動量の上限。
 *
 * 指は接触面が広く、押しただけでも数 px 動く。マウスと同じ 2px だと、タップが
 * 毎回ドラッグと判定されて選択できない。ペンはマウス並みに正確なので同じ扱い。
 */
export declare const TAP_SLOP_PX: Record<PointerKind, number>;
export declare function movedEnough(dx: number, dy: number, kind: PointerKind): boolean;
/**
 * 進行中のジェスチャを 1 つに限る門番。
 *
 * Canvas 1 つにつき 1 個作る。モジュール変数にすると、タブでキャンバスが
 * 複数開いたときに互いのジェスチャを奪い合う。
 */
export interface PointerGate {
    /**
     * ジェスチャを開始する。既に誰かが握っていれば false を返すので、呼び出し側は
     * そこで何もせずに抜ける。
     *
     * **同じポインタでも 2 度目は false。** 1 回の pointerdown を複数のハンドラが
     * 見ることがあるため。ハンドル（子要素）は自前のリスナで stopPropagation する
     * が、それが効かない経路があると、同じ指のままキャンバスホストの
     * pointerdown も走り、拡大縮小と範囲選択が同時に始まる。同一 id の再 claim を
     * 通していたせいで、その二重起動を down の時点で止められていなかった。
     */
    claim(host: CaptureTarget | null, e: PointerLike): boolean;
    /** 進行中のジェスチャのポインタか。move / up の先頭で弾くのに使う。 */
    owns(e: PointerLike): boolean;
    /**
     * ジェスチャを終える。握っていないポインタで呼ばれても何もしない。
     *
     * キャプチャはここで解くが、**owns() はこのポインタに対して真を返し続ける**。
     * 解放しきってしまうと「誰が先に pointerup を受けたか」で結果が変わる。
     * ドラッグの後片付けは document 上の複数のリスナに分かれており、その登録順は
     * React の依存配列（張り直し）で変わるので、順序に頼った設計は壊れる。
     * 実際、範囲選択の矩形が消えずに増え続ける不具合はこれで起きた。
     *
     * 握りは次の claim() で捨てる。次のジェスチャが始まるまで持っていても、
     * 他のポインタは claim() できないので害はない。
     */
    release(host: CaptureTarget | null, e: PointerLike): void;
    /** 握っている入力の種類。許容値の切り替えに使う。null なら未使用。 */
    activeKind(): PointerKind | null;
    /** 中断などで、どのイベントとも紐づかずに手放す。 */
    reset(host: CaptureTarget | null): void;
}
export declare function createPointerGate(): PointerGate;
/**
 * document 上の pointermove / pointerup / pointercancel をまとめて張る。
 *
 * onCancel を省略できないようにしてある。省略を許すと「中断でも確定してしまう」
 * 実装が静かに増える。何もしないなら空関数を明示的に渡すこと。
 *
 * ## ボタンを離したあとの pointermove は中断として配る
 *
 * マウスのドラッグは「ボタンを押している間だけ」が正で、pointerup が来た時点で
 * 終わる。ところが pointerup を取りこぼす経路が実在する。document のリスナは
 * 登録順に呼ばれ、**リスナとリスナの間ではマイクロタスクが走る**。前のリスナが
 * React の状態を更新すると、その再描画（＝エフェクトの張り直し）が同じ
 * pointerup の配送中に割り込み、まだ呼ばれていない後続ループの onUp が外されて
 * 消える。呼ばれなかったループは自分の ref を抱えたまま残る。
 *
 * 残った状態は次の pointermove で動き出す。ボタンは離れているのに範囲選択の
 * 矩形が育ち、次のクリックで確定して次のが育つ——クリックが開始／確定の
 * トグルに見える不具合はこれで出た（PC・マウス）。`release()` が owns() を
 * 真のまま残す設計（後片付けの順序に依存させないための措置）なので、残った
 * ループは弾かれずに動いてしまう。
 *
 * そこで土台側で断つ。**ボタンが押されていない pointermove は onMove ではなく
 * onCancel として配る。** 各ループの onCancel は「確定せず状態を捨てる」なので、
 * 取りこぼした pointerup の後片付けがそのまま効く。中断は「離した」ではないから、
 * 見失った操作を勝手に確定させない点でも意味が合っている。
 *
 * 配るのはポインタごとに 1 回だけ。ペンはホバー中ずっと buttons=0 の
 * pointermove を出すので、毎回配ると 9 本のループを空回しし続ける。
 */
export declare function installPointerDrag(target: Pick<EventTarget, "addEventListener" | "removeEventListener">, handlers: {
    onMove: (e: PointerEvent) => void;
    onUp: (e: PointerEvent) => void;
    onCancel: (e: PointerEvent) => void;
}): () => void;
