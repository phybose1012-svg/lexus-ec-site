/// <reference types="astro/client" />

declare module "node:fs" {
  export function existsSync(file: string): boolean;
  export function readFileSync(file: string, encoding: BufferEncoding): string;
}

declare module "node:path" {
  const path: {
    join: (...segments: string[]) => string;
  };
  export default path;
}

declare module "node:url" {
  export function fileURLToPath(url: URL | string): string;
}
