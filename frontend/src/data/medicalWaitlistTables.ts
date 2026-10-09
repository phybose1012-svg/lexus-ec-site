import { waitlistSchools, waitlistAdmissionYear } from "./medicalWaitlist.ts";
import type { WaitlistRecord } from "./medicalWaitlist.ts";
import { waitlist2025ById, waitlist2025AdmissionYear } from "./medicalWaitlist2025.ts";
import { historicalWaitlistById } from "./medicalWaitlistHistory.ts";

export type WaitlistTableCell = { legacyValue?: string; records: WaitlistRecord[] };
export type WaitlistTableRow = { year: string; legacy: boolean; cells: WaitlistTableCell[] };

// A number reuses an original column; a string appends a missing field.
// Explicit routing avoids silently mixing headcount with a legacy rank column,
// or assigning evidence without a period to a first-/second-period column.
const columnRoutes: Record<string, Record<string, number | string>> = {
  "school-1": {
    "一般選抜": "繰上合格者数（一般）", "共通テスト利用": "繰上合格者数（共テ利用）",
    "共テ利用・愛知県地域特別枠B方式": "繰上合格者数（愛知県地域枠B）",
  },
  "school-2": { "一般選抜": "補欠順位（合格例）", "地域枠C": "補欠順位（合格例）", "地域枠D": "補欠順位（合格例）", "地域枠D（全国枠・診療科指定枠）": "補欠順位（合格例）" },
  "school-3": { "一般前期": 0, "一般後期": 1, "共通テスト利用": 2 },
  "school-4": { "一般前期": 0, "一般後期": 1 },
  "school-5": { "一般前期": 0, "一般後期": "一般後期", "共通テスト・一般併用": "共テ・一般併用" },
  "school-6": { "一般選抜": "補欠順位（合格例）" },
  "school-7": { "一般選抜": 0, "共通テスト利用": 2 },
  "school-8": { "一般前期": 0, "一般後期": "一般選抜（後期）", "共通テスト利用・前期": "共テ利用（前期）" },
  "school-9": { "一般前期": 0, "一般後期": 1 },
  "school-10": { "一般選抜・医学部": "補欠からの入学許可者数" },
  "school-11": { "一般選抜": 0 },
  "school-12": { "一般前期": 0, "一般後期": 1, "共通テスト利用": "共テ利用" },
  "school-13": { "一般選抜A": "追加合格者数（一般A）", "一般選抜B": "追加合格者数（一般B）", "一般選抜C": "追加合格者数（一般C）" },
  "school-14": { "医学部・2026年度結果": "人数・順位の確認状況", "一般Ⅰ期（当時：昭和大学）": 0 },
  "school-15": { "一般前期": 0, "一般後期": "一般後期", "共通テスト利用": "共テ利用" },
  "school-16": { "一般選抜": 0, "共通テスト利用": 1, "共通テスト利用・神奈川県地域枠": 2, "神奈川県地域枠": "神奈川県地域枠（方式未特定）" },
  "school-17": { "一般選抜": 0, "共通テスト利用": 1 },
  "school-18": { "一般選抜": "繰上合格連絡者数" },
  "school-19": { "一般選抜": "補欠順位（一般）" },
  "school-20": { "一般選抜": "一般選抜（合格報告）", "一般選抜・一般枠": "一般選抜（合格報告）" },
  "school-21": { "一般前期": 0, "一般後期": "一般後期" },
  "school-22": { "一般前期": 0, "一般後期": 1, "一般前期・千葉県地域枠": "千葉県地域枠（前期）", "一般後期・千葉県地域枠": "千葉県地域枠（後期）", "グローバル特別選抜": "グローバル特別選抜" },
  "school-23": { "N全学統一方式・第1期": 0 },
  "school-24": { "一般A": "一般A（補欠順位・合格報告）", "一般A・四科目型（一般枠）": "一般A（補欠順位・合格報告）", "一般B・英語資格試験活用型": "一般B（合格報告）" },
  "school-25": { "一般選抜・系統別日程": 0, "共通テスト利用型・I期": 1, "共通テスト利用型・Ⅰ期": 1 },
  "school-26": { "一般前期": 0, "一般前期・愛知県地域枠": "愛知県地域枠", "一般選抜": "一般（期別未確認）", "一般枠": "一般（期別未確認）", "愛知県地域枠": "愛知県地域枠", "共通テスト利用": "共テ利用（期別未確認）", "ふじた未来入試・一般枠": "ふじた未来入試" },
  jichi: { "医学部・一般選抜": "一般選抜", "医学部・鹿児島県": "鹿児島県（合格報告）" },
  juntendo: { "一般A方式": "一般A方式", "一般B方式": "一般B方式", "静岡県地域枠": "静岡県地域枠" },
  teikyo: { "一般選抜": "一般選抜" },
  toho: { "一般選抜": "一般選抜" },
  kawasaki: { "一般選抜・地域枠": "一般選抜・地域枠" },
};

function targetColumn(id: string, record: WaitlistRecord): number | string {
  if (record.metric === "notice") return "終了・お知らせ";
  if (id === "school-2" && record.metric === "count") return 0;
  if (id === "school-9" && record.metric === "rank-case") return "補欠順位（前期の合格例）";
  const target = columnRoutes[id]?.[record.route];
  if (target === undefined) throw new Error(`Waitlist table column missing: ${id} / ${record.route}`);
  return target;
}

function rowLabel(id: string, year: number, record: WaitlistRecord): string {
  // Iwate's original table already uses separate rows for general/C/D routes.
  if (id === "school-2") {
    const route = record.route.startsWith("地域枠C") ? "地域C" : record.route.startsWith("地域枠D") ? "地域D" : "一般";
    return `${year}（${route}）`;
  }
  return String(year);
}

export const waitlistTableSchools = waitlistSchools.map((school, index) => {
  const historical = historicalWaitlistById[school.id];
  const columns = [...(historical?.columns ?? [])];
  const years = [
    { year: waitlistAdmissionYear, data: school },
    { year: waitlist2025AdmissionYear, data: waitlist2025ById[school.id] },
  ];
  const assignments = years.flatMap(({ year, data }) => data.records.map((record) => {
    const target = targetColumn(school.id, record);
    if (typeof target === "string" && !columns.includes(target)) columns.push(target);
    const columnIndex = typeof target === "number" ? target : columns.indexOf(target);
    if (columnIndex < 0 || columnIndex >= columns.length) throw new Error(`Invalid waitlist table column: ${school.id}`);
    return { label: rowLabel(school.id, year, record), columnIndex, record };
  }));
  const rows: WaitlistTableRow[] = [];
  for (const assignment of assignments) {
    let row = rows.find((entry) => entry.year === assignment.label);
    if (!row) {
      row = { year: assignment.label, legacy: false, cells: columns.map(() => ({ records: [] })) };
      rows.push(row);
    }
    row.cells[assignment.columnIndex].records.push(assignment.record);
  }
  // Legacy columns, row order and values stay unchanged; new columns are empty.
  rows.push(...(historical?.rows ?? []).map((row) => ({
    year: row.year, legacy: true,
    cells: columns.map((_, columnIndex) => ({ records: [], ...(columnIndex < row.values.length ? { legacyValue: row.values[columnIndex] } : {}) })),
  })));
  return {
    id: school.id, name: school.name, number: index + 1, tone: (index % 4) + 1,
    columns, rows, years, historical,
    latest: `${waitlistAdmissionYear}年度：${school.records[0].route}／${school.records[0].result}`,
  };
});
