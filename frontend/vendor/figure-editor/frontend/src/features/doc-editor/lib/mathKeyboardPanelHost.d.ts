type OpenPanel = () => void;
/** ホストを登録する。戻り値は解除関数（useEffect の cleanup にそのまま返せる） */
export declare function registerMathKeyboardPanelHost(open: OpenPanel): () => void;
/** いちばん内側のホストにパネルを開かせる。ホストが居なければ false */
export declare function requestMathKeyboardPanel(): boolean;
/** 登録中のホスト数（テスト用） */
export declare function mathKeyboardPanelHostCount(): number;
export {};
