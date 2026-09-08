/**
 * 実体は svgSize.mjs。型だけこちらに置く。
 *
 * Cloudflare Pages Function（TypeScript）からも読むので、宣言が無いと
 * astro check が「型定義が見つからない」で止まり、サイト全体のビルドが落ちる。
 */
export declare function readSvgSize(svg: string): { width: number; height: number } | null;
