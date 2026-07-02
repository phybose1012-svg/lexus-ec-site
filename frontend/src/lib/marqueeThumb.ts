// Map a legacy marquee photo to its optimized WebP thumbnail.
// Thumbnails are pre-generated into public/assets/marquee-thumb/ by
// scripts/gen-marquee-thumbs.mjs (run when the marquee image set changes).
// The filename is a deterministic djb2 hash of the source path, so the
// helper and the generator must hash the identical string.
const djb2 = (str: string): string => {
  let hash = 5381;
  for (let i = 0; i < str.length; i += 1) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36);
};

export const marqueeThumb = (src: string): string =>
  src.startsWith("/assets/legacy/") ? `/assets/marquee-thumb/${djb2(src)}.webp` : src;
