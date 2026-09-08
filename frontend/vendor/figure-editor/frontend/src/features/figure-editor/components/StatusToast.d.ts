export interface StatusToastProps {
    message: string;
    /**
     * 同じ文言が続けて出たことを見分ける番号。文字列だけだと、消えたあとに
     * 同じ操作をもう一度しても出てこない（React が同じ値で止める）。
     */
    messageKey: number;
    /** 置き場所の Tailwind クラス（例: "bottom-16 right-4"）。 */
    anchorClass: string;
}
export declare function StatusToast({ message, messageKey, anchorClass, }: StatusToastProps): import("react").JSX.Element | null;
