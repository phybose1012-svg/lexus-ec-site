// Year/route-specific findings, not a blanket inference from a university's
// current policy. Evidence remains internal; the public table has short values.
export const unnumberedWaitlistFindings = [
  {
    id: "school-3", years: [2019, 2020], columns: [2],
    reason: "医学部は2021年度から補欠番号を表示。それ以前の共テ欄も番号なし。",
    urls: ["https://melurix.co.jp/blog/c348"],
  },
  {
    id: "teikyo", years: [2025, 2026], columns: [0],
    reason: "医学部は繰上合格候補者を発表せず、欠員時に追加合格を通知する。",
    urls: [
      "https://www.teikyo-u.ac.jp/application/files/9017/2499/0172/02_2025.pdf",
      "https://www.teikyo-u.ac.jp/application/files/5017/5496/5079/02_2026.pdf",
    ],
  },
];

export function normalizedWaitlistCellValue(id: string, year: string, column: number, value?: string): string {
  const original = value?.trim();
  if (original && !/^(?:[—−–―ー-]+|非公[開表]|不明|なし[？?])$/.test(original)) return original;
  if (unnumberedWaitlistFindings.some((finding) => finding.id === id
    && finding.years.includes(Number(year.slice(0, 4))) && finding.columns.includes(column))) return "番号なし";
  // Unknown counts, undisclosed reached ranks, missing route reports, and
  // omitted ranks in a student report do NOT establish an unnumbered system.
  return "不明";
}
