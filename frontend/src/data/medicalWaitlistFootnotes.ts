import type { WaitlistRecord } from "./medicalWaitlist.ts";
import type { waitlistTableSchools } from "./medicalWaitlistTables.ts";
import { waitlistEvidenceDate, waitlistValueMeaning } from "./medicalWaitlistPresentation.ts";
import { publicWaitlistInformation, publicWaitlistTableNote } from "./medicalWaitlistPublic.ts";

type SchoolTable = (typeof waitlistTableSchools)[number];
type Entry = { year: number; column: number; meaning: string; record?: WaitlistRecord };
export type WaitlistFootnote = { label: string; text: string };

function yearLabel(years: number[]): string {
  const sorted = [...new Set(years)].sort((a, b) => a - b);
  const ranges: number[][] = [];
  for (const year of sorted) {
    const previous = ranges.at(-1);
    if (previous && previous.at(-1)! + 1 === year) previous.push(year);
    else ranges.push([year]);
  }
  return ranges.map((range) => range.length >= 3 ? `${range[0]}〜${range.at(-1)}` : range.join("・")).join("・") + "年度";
}

// Merge identical meanings across ALL years, not only the latest annual records.
// Add a year/route scope only when another meaning exists in the same table.
function scopedNotes(entries: Entry[], columns: string[]): string[] {
  const meanings = [...new Set(entries.map((entry) => entry.meaning))];
  return meanings.map((meaning) => {
    if (meanings.length === 1) return meaning;
    const scopeGroups = new Map<string, number[]>();
    for (const year of [...new Set(entries.filter((entry) => entry.meaning === meaning).map((entry) => entry.year))]) {
      const annual = entries.filter((entry) => entry.year === year);
      const matching = annual.filter((entry) => entry.meaning === meaning);
      const routes = annual.every((entry) => entry.meaning === meaning) ? ""
        : [...new Set(matching.map((entry) => columns[entry.column]))].join("・");
      scopeGroups.set(routes, [...(scopeGroups.get(routes) ?? []), year]);
    }
    const scope = [...scopeGroups].map(([routes, years]) => `${yearLabel(years)}${routes ? `の${routes}` : ""}`).join("、");
    return `${scope}：${meaning}`;
  });
}

function archivedMeaning(school: SchoolTable): string {
  const notes = school.historical?.notes ?? [];
  if (notes.some((note) => note.includes("入学辞退者が含まれていません"))) return "入学辞退者を含まない人数。";
  if (notes.includes("表記の数値は補欠番号です。")) return "繰り上がった順位。";
  if (school.id === "school-11") return "繰り上がった補欠ランク。";
  if (school.id === "school-20") return "繰上合格者数（辞退者を含むか不明）。";
  // Some archived tables do not define whether numbers are ranks or headcounts.
  // A column heading or a later year's meaning cannot resolve that ambiguity.
  return "人数・順位の区分は未確認。";
}

export function waitlistFootnotes(school: SchoolTable): WaitlistFootnote[] {
  const entries: Entry[] = school.rows.flatMap((row) => row.cells.flatMap((cell, column) => {
    if (cell.records.length) return cell.records.map((record) => ({
      year: Number(row.year), column, record,
      meaning: waitlistValueMeaning(record).replace("（報告分）", ""),
    }));
    // Do not describe dashes/non-public values as numbers or infer a zero.
    if (cell.legacyValue !== undefined && /\d|補欠[A-D]|[A-D](?:群|ランク)/.test(cell.legacyValue)) {
      return [{ year: Number(row.year.slice(0, 4)), column, meaning: archivedMeaning(school) }];
    }
    return [];
  }));
  const notes: WaitlistFootnote[] = [{ label: "数値", text: scopedNotes(entries, school.columns).join(" ") || "未確認。" }];

  const current = entries.filter((entry) => entry.record);
  const information = current.map((entry) => ({ ...entry, meaning: publicWaitlistInformation(entry.record!) + "。" }));
  // An unqualified source label must never imply it also verifies archived data.
  information.push(...school.rows.filter((row) => row.legacy).flatMap((row) => row.cells.flatMap((cell, column) =>
    cell.legacyValue !== undefined ? [{ year: Number(row.year.slice(0, 4)), column, meaning: "出典未確認。" }] : [])));
  if (information.length) notes.push({ label: "情報", text: scopedNotes(information, school.columns).join(" ") });

  const evidenceDates: string[] = [];
  for (const { year } of school.years) {
    const dated = current.filter((entry) => entry.year === year && entry.record!.asOf);
    if (!dated.length) continue;
    const dates = [...new Set(dated.map((entry) => waitlistEvidenceDate(entry.record!)))];
    const text = dates.length === 1 ? `${year}年度 ${dates[0]}`
      : `${year}年度（${dated.map((entry) => `${school.columns[entry.column]} ${waitlistEvidenceDate(entry.record!)}`).join("、")}）`;
    evidenceDates.push(text);
  }
  if (evidenceDates.length) notes.push({ label: "時点", text: evidenceDates.join("、") + "時点。" });

  const supplements = new Map<string, number[]>();
  for (const { year, data } of school.years) {
    const text = data.note && publicWaitlistTableNote(data.note);
    if (text) supplements.set(text, [...(supplements.get(text) ?? []), year]);
  }
  notes.push(...[...supplements].map(([text, years]) => ({ label: "補足", text: `${yearLabel(years)}：${text}` })));
  for (const original of school.historical?.notes ?? []) {
    if (original === "表記の数値は補欠番号です。" || original.includes("入学辞退者が含まれていません")) continue;
    const text = publicWaitlistTableNote(original);
    if (!text) continue;
    // Historical statements about non-disclosure/number allocation need their
    // actual date scope; dated historical facts already identify their own scope.
    const dated = /\d{4}/.test(text);
    const scope = !dated && school.id !== "school-11"
      ? `${yearLabel(school.rows.filter((row) => row.legacy).map((row) => Number(row.year.slice(0, 4))))}：` : "";
    notes.push({ label: "補足", text: scope + text });
  }
  return notes;
}
