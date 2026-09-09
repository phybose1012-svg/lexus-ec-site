/** Escape prose; only explicit TeX delimiters create local renderer targets. */
export const escapeHtml = value => String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
export function inline(value) {
  return String(value??'').split(/(\\\([\s\S]*?\\\))/g).map(part=>part.startsWith('\\(')
    ? `<span class="math-inline" data-katex="${escapeHtml(part.slice(2,-2))}" data-display-mode="false"></span>` : escapeHtml(part)).join('');
}
