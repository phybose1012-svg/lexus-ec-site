import type { RegionRect } from "./types";
import type { FigureGenerationMode } from "../figure-editor/lib/types";
import { type ExStyleId } from "../../../../shared/exStyles";
export interface CropRegion {
    key: string;
    rect: RegionRect;
    /** OCR の figureRegion 由来なら対応する figurePlaceholder の id */
    placeholderId?: string;
}
interface Props {
    mode: "select" | "progress";
    imageUrl: string;
    initialRegions: {
        rect: RegionRect;
        placeholderId?: string;
    }[];
    /** いま受け付けられる領域数（図形タブの空き）。超過時は確定不可 */
    maxRegions: number;
    /** 「n 件の図を生成」。確定処理（切り出し→生成開始）は親が行う */
    onConfirm: (regions: CropRegion[]) => void;
    /** 親側で切り出し・生成開始を処理中。二重確定を防ぐ。 */
    confirming?: boolean;
    /** 「描画なし」/ ✕。モーダルを閉じるだけ（進行中の生成は止めない） */
    onClose: () => void;
    /** 図形エディターなど、生成対象を1領域だけ選ぶ場合に使う。 */
    selectionMode?: "multiple" | "single";
    /** 選択モードの見出しを用途に合わせて差し替える。 */
    selectionTitle?: string;
    /** 選択せず元画像をそのまま使う「画像全体」ボタンを表示する。 */
    showWholeImage?: boolean;
    /** 切り出し処理で失敗したとき、モーダル内に表示するメッセージ。 */
    selectionError?: string | null;
    /** 図形エディターの単一画像生成でだけ表示する生成モード。 */
    generationMode?: FigureGenerationMode;
    onGenerationModeChange?: (mode: FigureGenerationMode) => void;
    /**
     * ✨MAX精度モードの切替を見せるか（省略時 true）。false のときはトグルの
     * 代わりにプラン案内を1行表示する（入り口は見せる方針）。
     */
    allowMaxMode?: boolean;
    /** MAX の背景の絵のタッチ。MAX選択中だけセレクタを表示する。 */
    exStyle?: ExStyleId;
    onExStyleChange?: (style: ExStyleId) => void;
}
export declare function RegionCropModal({ mode, imageUrl, initialRegions, maxRegions, onConfirm, confirming, onClose, selectionMode, selectionTitle, showWholeImage, selectionError, generationMode, onGenerationModeChange, allowMaxMode, exStyle, onExStyleChange, }: Props): import("react").JSX.Element;
export {};
