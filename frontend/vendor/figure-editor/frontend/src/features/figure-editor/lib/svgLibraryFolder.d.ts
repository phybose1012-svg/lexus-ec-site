/** File System Access API の、ここで使う範囲だけの型。 */
interface DirectoryHandle {
    readonly kind: "directory";
    readonly name: string;
    entries(): AsyncIterableIterator<[string, DirectoryHandle | FileHandle]>;
    queryPermission?(options: {
        mode: "read";
    }): Promise<PermissionState>;
    requestPermission?(options: {
        mode: "read";
    }): Promise<PermissionState>;
}
interface FileHandle {
    readonly kind: "file";
    readonly name: string;
    getFile(): Promise<File>;
}
export interface SvgLibraryEntry {
    /** フォルダからの相対パス（`iwate-2025/figures/q1.svg`）。 */
    readonly path: string;
    /** ファイル名だけ。 */
    readonly name: string;
    /** 1 つ上のフォルダまでの相対パス。無ければ空文字。 */
    readonly folder: string;
    readonly handle: FileHandle;
}
export declare function isSvgFolderSupported(): boolean;
/** 覚えているフォルダ。まだ選んでいなければ null。 */
export declare function savedSvgFolder(): Promise<DirectoryHandle | null>;
/** フォルダを選び直す。選ばずに閉じたら null。 */
export declare function pickSvgFolder(): Promise<DirectoryHandle | null>;
/** 覚えているフォルダを忘れる。 */
export declare function forgetSvgFolder(): Promise<void>;
/**
 * 読み取りの許可を確かめる。ブラウザを開き直すと許可は消えるので、
 * **利用者の操作の中から**呼ぶこと（そうでないと確認ダイアログが出せない）。
 */
export declare function ensureReadPermission(handle: DirectoryHandle): Promise<boolean>;
/**
 * フォルダの中の `.svg` を、下の階層まで含めて名前順に並べて返す。
 *
 * 過去問の図は `<パッケージ>/figures/*.svg` の形で 2 段下にあるので、
 * 直下だけ見ても 1 件も見つからない。深さと件数には上限を置く。
 */
export declare function listSvgFiles(handle: DirectoryHandle): Promise<SvgLibraryEntry[]>;
export declare function readSvgEntry(entry: SvgLibraryEntry): Promise<File>;
export type { DirectoryHandle as SvgLibraryFolder };
