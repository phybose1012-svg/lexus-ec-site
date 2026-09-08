export interface MathSessionControls {
    /** 数式行（ブロック）か。行ボタン（＝揃え等）の表示判定に使う */
    isBlock: boolean;
    /** カーソル位置に LaTeX を挿入（分数・√ などのテンプレ） */
    insert: (latex: string) => void;
    /** 数式行に指定種別の行を追加 */
    addRow: (kind: string) => boolean;
    /** MathLive の画面キーボードを表示/非表示 */
    toggleKeyboard: () => void;
    /** 選択範囲（無ければ以降の入力）にスタイルを適用。色は "none" で解除、
     *  fontSize は 1〜10（5=標準）か "auto" でリセット、fontSeries は "b"=太字。
     *  opts.toggle で同じスタイルの当て外し（太字トグルなど）ができる */
    applyStyle: (style: {
        color?: string;
        backgroundColor?: string;
        fontSize?: number | "auto";
        fontSeries?: string;
    }, opts?: {
        toggle?: boolean;
    }) => void;
    /** 現在の数式の基準文字サイズ（pt）。サイズメニューの数値表示に使う */
    currentFontPt: () => number | null;
    /** 編集中の数式行の doc 位置（数式行のみ。インライン数式は null） */
    blockPos: () => number | null;
    /** いま編集中の内容を確定して編集を閉じる（セクションハンドル操作の前に呼ぶ） */
    commit: () => void;
    /** 「＝で揃える」ボタン: 左端揃え ⇔ = 揃え をトグル */
    toggleAlign: () => void;
    /** いま = 揃えか（ボタンのアクティブ表示用） */
    isEqAligned: () => boolean;
    /** MathLive のコマンドを実行（行列の行・列の増減など）。実行後 math-field へ再フォーカス */
    execCommand: (cmd: string) => void;
}
/** MathNodeView が編集セッションの開始/終了で呼ぶ（終了は null） */
export declare function setMathSession(s: MathSessionControls | null): void;
export declare function getMathSession(): MathSessionControls | null;
export declare function isMathEditing(): boolean;
/** 変化を購読する。戻り値は解除関数 */
export declare function subscribeMathEditing(fn: (editing: boolean) => void): () => void;
/** = 揃えのオン/オフ状態を更新（MathNodeView が編集開始・揃え変更のたびに呼ぶ） */
export declare function setMathEqAligned(on: boolean): void;
export declare function getMathEqAligned(): boolean;
/** = 揃え状態の変化を購読する。戻り値は解除関数 */
export declare function subscribeMathEqAligned(fn: (on: boolean) => void): () => void;
/** カーソルが行列/場合分けの中にいるかを更新（MathNodeView がカーソル移動のたびに呼ぶ） */
export declare function setMathInArray(on: boolean): void;
export declare function getMathInArray(): boolean;
/** 行列コンテキストの変化を購読する。戻り値は解除関数 */
export declare function subscribeMathInArray(fn: (on: boolean) => void): () => void;
