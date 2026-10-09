import { waitlistSchools, waitlistAdmissionYear } from "./medicalWaitlist.ts";
import type { WaitlistRecord } from "./medicalWaitlist.ts";
import { waitlist2025ById, waitlist2025AdmissionYear } from "./medicalWaitlist2025.ts";
import { historicalWaitlistById } from "./medicalWaitlistHistory.ts";
import { waitlistNumericNotes, waitlistTableValue } from "./medicalWaitlistPresentation.ts";
import { normalizedWaitlistCellValue } from "./medicalWaitlistMissingValues.ts";

export type WaitlistTableCell = { legacyValue?: string; records: WaitlistRecord[] };
export type WaitlistTableRow = { year: string; legacy: boolean; cells: WaitlistTableCell[] };

// Columns describe routes, not sources/metrics/notices. Meanings go below the table.
// null is an annotation: do not guess a first/second period when it is unspecified.
const columnRoutes: Record<string, Record<string, number | string | null>> = {
  "school-1": { "一般選抜": 1, "共通テスト利用": 2, "共テ利用・愛知県地域特別枠B方式": 3 },
  "school-2": { "一般選抜": 0, "地域枠C": 1, "地域枠D": 2, "地域枠D（全国枠・診療科指定枠）": 2 },
  "school-3": { "一般前期": 0, "一般後期": 1, "共通テスト利用": 2 },
  "school-4": { "一般前期": 0, "一般後期": 1 },
  "school-5": { "一般前期": 0, "一般後期": "一般後期", "共通テスト・一般併用": "共テ・一般併用" },
  "school-6": { "一般選抜": 0 },
  "school-7": { "一般選抜": 0, "共通テスト利用": 2 },
  "school-8": { "一般前期": 0, "一般後期": "一般選抜（後期）", "共通テスト利用・前期": "共テ利用（前期）" },
  "school-9": { "一般前期": 0, "一般後期": 1 },
  "school-10": { "一般選抜・医学部": 0 },
  "school-11": { "一般選抜": 0 },
  "school-12": { "一般前期": 0, "一般後期": 1, "共通テスト利用": "共テ利用" },
  "school-13": { "一般選抜A": 0, "一般選抜B": 0, "一般選抜C": 0 },
  "school-14": { "医学部・2026年度結果": null, "一般Ⅰ期（当時：昭和大学）": 0 },
  "school-15": { "一般前期": 0, "一般後期": "一般後期", "共通テスト利用": "共テ利用" },
  "school-16": { "一般選抜": 0, "共通テスト利用": 1, "共通テスト利用・神奈川県地域枠": 2, "神奈川県地域枠": null },
  "school-17": { "一般選抜": 0, "共通テスト利用": 1 },
  "school-18": { "一般選抜": 0 },
  "school-19": { "一般選抜": 0 },
  "school-20": { "一般選抜": 0, "一般選抜・一般枠": 0 },
  "school-21": { "一般前期": 0, "一般後期": "一般後期" },
  "school-22": { "一般前期": 0, "一般後期": 1, "一般前期・千葉県地域枠": 0, "一般後期・千葉県地域枠": 1, "グローバル特別選抜": null },
  "school-23": { "N全学統一方式・第1期": 0 },
  "school-24": { "一般A": 0, "一般A・四科目型（一般枠）": 0, "一般B・英語資格試験活用型": null },
  "school-25": { "一般選抜・系統別日程": 0, "共通テスト利用型・I期": 1, "共通テスト利用型・Ⅰ期": 1 },
  "school-26": { "一般前期": 0, "一般前期・愛知県地域枠": 0, "一般選抜": null, "一般枠": null, "愛知県地域枠": null, "共通テスト利用": null, "ふじた未来入試・一般枠": null },
  jichi: { "医学部・一般選抜": "一般選抜", "医学部・鹿児島県": "一般選抜" },
  juntendo: { "一般A方式": "一般選抜", "一般B方式": "一般選抜", "静岡県地域枠": "一般選抜" },
  teikyo: { "一般選抜": "一般選抜" },
  toho: { "一般選抜": "一般選抜" },
  kawasaki: { "一般選抜・地域枠": "一般選抜・地域枠" },
};

// Neutral route headings avoid labeling counts as ranks (or vice versa).
// Historical source values and notes remain unchanged; Iwate is transposed below.
const columnLabels: Record<string, string[]> = {
  "school-1": ["第1補欠（一般）", "繰上げ（一般）", "繰上げ（共テ）", "繰上げ（共テ地域枠）"],
  "school-2": ["一般", "地域枠C", "地域枠D"], "school-5": ["一般前期"],
  "school-6": ["一般選抜"], "school-10": ["一般選抜"],
  "school-13": ["一般選抜"], "school-15": ["一般前期"],
  "school-18": ["一般選抜"], "school-19": ["一般選抜"],
  "school-20": ["一般選抜"], "school-21": ["一般前期"], "school-24": ["一般A"],
};

function targetColumn(id: string, record: WaitlistRecord): number | string | null {
  if (["notice", "report", "unknown"].includes(record.metric)) return null;
  if (id === "school-1" && record.route === "一般選抜" && record.metric === "rank") return 0;
  // Supplemental routes belong in notes, not as unlabeled numbers in one cell.
  if (id === "school-13" && record.route !== "一般選抜A") return null;
  if (id === "school-22" && record.route.includes("千葉県地域枠")) return null;
  if (id === "school-26" && record.route.includes("愛知県地域枠")) return null;
  const target = columnRoutes[id]?.[record.route];
  if (target === undefined) throw new Error(`Waitlist table column missing: ${id} / ${record.route}`);
  return target;
}

function historicalTableRows(id: string, columns: string[], historicalRows: { year: string; values: string[] }[]): WaitlistTableRow[] {
  if (id !== "school-2") return historicalRows.map((row) => ({
    year: row.year, legacy: true,
    cells: columns.map((_, columnIndex) => ({ records: [], ...(columnIndex < row.values.length ? { legacyValue: row.values[columnIndex] } : {}) })),
  }));

  // One row per year. The user identifies all pre-2024 figures as general-route counts.
  const rows: WaitlistTableRow[] = [];
  for (const original of historicalRows) {
    const year = original.year.slice(0, 4);
    const column = Number(year) <= 2023 ? 0 : original.year.includes("地域C") ? 1 : original.year.includes("地域D") ? 2 : 0;
    let row = rows.find((entry) => entry.year === year);
    if (!row) {
      row = { year, legacy: true, cells: columns.map(() => ({ records: [] })) };
      rows.push(row);
    }
    if (row.cells[column].legacyValue !== undefined) throw new Error(`Duplicate Iwate historical value: ${original.year}`);
    row.cells[column].legacyValue = original.values[0];
  }
  return rows;
}

export const waitlistTableSchools = waitlistSchools.map((school, index) => {
  const historical = historicalWaitlistById[school.id];
  const columns = [...(columnLabels[school.id] ?? historical?.columns ?? [])];
  // Keep missing routes in their declared order (first period, second period, CT),
  // rather than letting the first available annual report determine the order.
  for (const target of Object.values(columnRoutes[school.id])) {
    if (typeof target === "string" && !columns.includes(target)) columns.push(target);
  }
  const years = [
    { year: waitlistAdmissionYear, data: school },
    { year: waitlist2025AdmissionYear, data: waitlist2025ById[school.id] },
  ];
  const annotations: { year: number; records: WaitlistRecord[] }[] = [];
  const addAnnotation = (year: number, record: WaitlistRecord) => {
    let annotation = annotations.find((entry) => entry.year === year);
    if (!annotation) { annotation = { year, records: [] }; annotations.push(annotation); }
    annotation.records.push(record);
  };
  const assignments = years.flatMap(({ year, data }) => data.records.map((record) => {
    const target = targetColumn(school.id, record);
    if (target === null) {
      addAnnotation(year, record);
      return { label: String(year), columnIndex: null, record };
    }
    if (typeof target === "string" && !columns.includes(target)) columns.push(target);
    const columnIndex = typeof target === "number" ? target : columns.indexOf(target);
    if (columnIndex < 0 || columnIndex >= columns.length) throw new Error(`Invalid waitlist table column: ${school.id}`);
    return { label: String(year), columnIndex, record };
  }));
  const rows: WaitlistTableRow[] = [];
  for (const assignment of assignments) {
    let row = rows.find((entry) => entry.year === assignment.label);
    if (!row) {
      row = { year: assignment.label, legacy: false, cells: columns.map(() => ({ records: [] })) };
      rows.push(row);
    }
    if (assignment.columnIndex !== null) row.cells[assignment.columnIndex].records.push(assignment.record);
  }
  // One comparable value per cell. Keep an alternate rank/count in the notes.
  for (const row of rows) {
    for (const cell of row.cells) {
      if (cell.records.length < 2) continue;
      const primary = cell.records.find((record) => record.metric === "count") ?? cell.records[0];
      cell.records.filter((record) => record !== primary).forEach((record) => addAnnotation(Number(row.year.slice(0, 4)), record));
      cell.records = [primary];
    }
  }
  const numericNotes = years.map(({ year }) => ({
    year,
    notes: waitlistNumericNotes(rows.filter((row) => row.year.startsWith(String(year))).flatMap((row) =>
      row.cells.flatMap((cell, columnIndex) => cell.records.map((record) => ({ record, column: columns[columnIndex] }))))),
  }));
  rows.push(...historicalTableRows(school.id, columns, historical?.rows ?? []));
  const displayRows = rows.map((row) => ({ ...row, cells: row.cells.map((cell, column) => ({
    ...cell,
    displayValue: normalizedWaitlistCellValue(school.id, row.year, column,
      cell.legacyValue ?? (cell.records.length ? waitlistTableValue(cell.records[0]) : undefined)),
  })) }));
  return { id: school.id, name: school.name, number: index + 1, tone: (index % 4) + 1, columns, rows: displayRows, years, historical, annotations, numericNotes };
});
