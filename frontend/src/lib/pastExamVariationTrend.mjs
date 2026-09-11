export function renderVariationTrend(value, label) {
  const match = value.match(/^\[\[trend:(increase|decrease):(concave-down|concave-up)\]\]$/);
  if (!match) return null;

  const [, direction, concavity] = match;
  const labels = {
    "increase:concave-down": "増加・上に凸",
    "decrease:concave-down": "減少・上に凸",
    "decrease:concave-up": "減少・下に凸",
    "increase:concave-up": "増加・下に凸",
  };
  const paths = {
    "increase:concave-down": {
      curve: "M6 30 C18 15 37 7 58 6",
      head: "M50 3 L59 6 L53 13",
    },
    "decrease:concave-down": {
      curve: "M6 6 C29 7 48 17 58 30",
      head: "M50 27 L59 31 L56 22",
    },
    "decrease:concave-up": {
      curve: "M6 6 C16 20 35 29 58 30",
      head: "M51 25 L59 30 L52 34",
    },
    "increase:concave-up": {
      curve: "M6 30 C29 29 48 19 58 6",
      head: "M50 9 L59 5 L57 14",
    },
  };
  const key = `${direction}:${concavity}`;
  const trend = paths[key];
  if (!trend) throw new Error(`${label} has an unsupported variation trend`);

  return `<span class="answer-trend" role="img" aria-label="${labels[key]}"><svg viewBox="0 0 64 36" aria-hidden="true" focusable="false"><path class="answer-trend__curve" d="${trend.curve}"/><path class="answer-trend__head" d="${trend.head}"/></svg></span>`;
}
