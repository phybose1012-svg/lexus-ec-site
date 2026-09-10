/** Describe changes to a target route without inventing an empty destination.
 * @param {{label: string}[]} replaced
 * @param {{label: string}[]} additional
 */
export function describeTargetReplacement(replaced = [], additional = []) {
  const removed = replaced.map((q) => q.label).join("・");
  const added = additional.map((q) => q.label).join("・");
  if (removed && added) return `${removed}を外し、${added}を追加`;
  if (removed) return `${removed}を外す`;
  if (added) return `${added}を追加`;
  return "選択する問題を変更";
}
