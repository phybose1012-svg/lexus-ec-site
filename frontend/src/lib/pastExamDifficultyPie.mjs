// SVG sectors use exact weights (question counts or provisional points).
/** @param {number[]} values */
export function buildDifficultyPie(values) {
  if (!values.length || values.some((n) => !Number.isFinite(n) || n < 0)) throw new Error("Invalid difficulty weights");
  const total = values.reduce((sum, n) => sum + n, 0);
  if (!Number.isFinite(total) || total === 0) throw new Error("Empty difficulty distribution");
  const point = (angle, radius) => [110 + Math.cos(angle) * radius, 110 + Math.sin(angle) * radius].map((n) => Number(n.toFixed(4)));
  let preceding = 0;
  return values.map((value, level) => {
    const fraction = value / total;
    const start = preceding / total * Math.PI * 2 - Math.PI / 2;
    preceding += value;
    const end = preceding / total * Math.PI * 2 - Math.PI / 2;
    const [labelX, labelY] = point((start + end) / 2, 72);
    const path = value === 0 ? "" : value === total
      ? "M 110 6 A 104 104 0 1 1 110 214 A 104 104 0 1 1 110 6 Z"
      : `M 110 110 L ${point(start, 104).join(" ")} A 104 104 0 ${fraction > 0.5 ? 1 : 0} 1 ${point(end, 104).join(" ")} Z`;
    return { level, value, fraction, percent: Math.round(fraction * 1000) / 10, path, labelX, labelY };
  });
}
