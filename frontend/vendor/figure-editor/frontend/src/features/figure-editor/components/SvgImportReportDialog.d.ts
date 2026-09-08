import type { SvgImportResult } from "../lib/svgImport";
interface SvgImportReportDialogProps {
    fileName: string;
    result: SvgImportResult;
    onOpen: () => void;
    onCancel: () => void;
}
/**
 * SVG を読み込んだ結果を、開く前に見せる画面。
 *
 * 「例外が出なかった」ではなく「何がどう変わったか」を伝えるのが役目なので、
 * 開発者向けのログではなく、編集担当者が読んで判断できる言葉で並べる。
 *
 * 見た目に影響する未対応があるときは **黙って開かない**。何が落ちるかを見せた
 * 上で、開くかどうかを人に決めてもらう。
 */
export declare function SvgImportReportDialog({ fileName, result, onOpen, onCancel, }: SvgImportReportDialogProps): import("react").JSX.Element;
export {};
