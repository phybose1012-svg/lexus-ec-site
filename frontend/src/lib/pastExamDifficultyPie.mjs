// SVG sectors use the exact counts; only the displayed percentages are rounded.
/** @param {number[]} counts */
export function buildDifficultyPie(counts) {
  if (!counts.length || counts.some((n) => !Number.isSafeInteger(n) || n < 0)) throw new Error("Invalid difficulty counts");
  const total = counts.reduce((sum, n) => sum + n, 0);
  if (!Number.isSafeInteger(total) || total === 0) throw new Error("Empty difficulty distribution");
  const point = (angle, radius) => [110 + Math.cos(angle) * radius, 110 + Math.sin(angle) * radius].map((n) => Number(n.toFixed(4)));
  let preceding = 0;
  return counts.map((count, level) => {
    const fraction = count / total;
    const start = preceding / total * Math.PI * 2 - Math.PI / 2;
    preceding += count;
    const end = preceding / total * Math.PI * 2 - Math.PI / 2;
    const [labelX, labelY] = point((start + end) / 2, 72);
    const path = count === 0 ? "" : count === total
      ? "M 110 6 A 104 104 0 1 1 110 214 A 104 104 0 1 1 110 6 Z"
      : `M 110 110 L ${point(start, 104).join(" ")} A 104 104 0 ${fraction > 0.5 ? 1 : 0} 1 ${point(end, 104).join(" ")} Z`;
    return { level, count, fraction, percent: Math.round(fraction * 1000) / 10, path, labelX, labelY };
  });
}
