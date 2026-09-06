// Japanese school mathematics writes the inequalities as ≦ and ≧: the inequality
// sign sits over a full equals sign. The international forms ≤ and ≥, which
// abbreviate that equals sign to a single rule, are not used anywhere up to
// university entrance level, so no Lexus past-exam page may publish them.
//
// KaTeX spells the Japanese forms \leqq and \geqq; both come from the AMS font
// that this site already ships at public/assets/vendor/katex/fonts.
//
// Every past-exam generator runs source text through normalizeInequalities, so a
// page cannot inherit ≤ from an upstream transcription or from an author's habit.

// Ordered longest-first: \leqq must win before \leq, and \leq before bare \le.
// The negative lookaheads keep \left and \gets intact.
const INEQUALITY_PATTERN =
  /\\leqslant|\\geqslant|\\leqq|\\geqq|\\leq|\\geq|\\le(?![a-zA-Z])|\\ge(?![a-zA-Z])|≤|≥/g;

const REPLACEMENTS = new Map([
  ["\\leqslant", "\\leqq"],
  ["\\geqslant", "\\geqq"],
  ["\\leqq", "\\leqq"],
  ["\\geqq", "\\geqq"],
  ["\\leq", "\\leqq"],
  ["\\geq", "\\geqq"],
  ["\\le", "\\leqq"],
  ["\\ge", "\\geqq"],
  ["≤", "≦"],
  ["≥", "≧"],
]);

/** Forms that must never reach a published page. */
const FORBIDDEN = new Set(["\\leqslant", "\\geqslant", "\\leq", "\\geq", "\\le", "\\ge", "≤", "≥"]);

/** Rewrite every inequality to the Japanese ≦ / ≧ form. Non-strings pass through. */
export function normalizeInequalities(value) {
  if (typeof value !== "string" || value.length === 0) return value;
  return value.replace(INEQUALITY_PATTERN, (match) => REPLACEMENTS.get(match) ?? match);
}

/** Recursively normalize every string in a JSON-like structure. */
export function normalizeInequalitiesDeep(value) {
  if (typeof value === "string") return normalizeInequalities(value);
  if (Array.isArray(value)) return value.map(normalizeInequalitiesDeep);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalizeInequalitiesDeep(item)]));
  }
  return value;
}

/** Report each forbidden inequality with its offset, for tests and audits. */
export function findForbiddenInequalities(value) {
  if (typeof value !== "string") return [];
  const found = [];
  for (const match of value.matchAll(INEQUALITY_PATTERN)) {
    if (FORBIDDEN.has(match[0])) found.push({ form: match[0], index: match.index });
  }
  return found;
}
