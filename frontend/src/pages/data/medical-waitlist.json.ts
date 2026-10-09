import { waitlistAdmissionYear, waitlistCheckedAt, waitlistSchools } from "../../data/medicalWaitlist";
import { waitlist2025AdmissionYear, waitlist2025Schools } from "../../data/medicalWaitlist2025";
import { historicalWaitlistSchools } from "../../data/medicalWaitlistHistory";
import { publicWaitlistSchool } from "../../data/medicalWaitlistPublic";
import { waitlistTableSchools } from "../../data/medicalWaitlistTables";

export const GET = () => new Response(JSON.stringify({
  checkedAt: waitlistCheckedAt,
  scope: "私立医学部の補欠・繰上げ合格情報。2025・2026年度と2024年度以前の従来掲載分。",
  warning: "tablesがページと同じ表示値。番号なしは補欠番号なし、不明は人数・到達順位等を確認できない欄。数値の意味はmetric・valueMeaningや注記を確認。個別の合格報告は最終到達順位とは限らない。historicalは表示加工前の保存用原表。",
  tables: waitlistTableSchools.map(({ id, name, columns, rows }) => ({
    id, name, columns,
    rows: rows.map(({ year, cells }) => ({ year, values: cells.map(({ displayValue }) => displayValue) })),
  })),
  years: [
    { admissionYear: waitlistAdmissionYear, schools: waitlistSchools.map(publicWaitlistSchool) },
    { admissionYear: waitlist2025AdmissionYear, schools: waitlist2025Schools.map(publicWaitlistSchool) },
  ],
  historical: {
    yearRange: "2012–2024",
    verificationStatus: "legacy-unverified",
    warning: "従来掲載時の数値・列名・補足をそのまま保存。今回出典・数値を再検証していない。latest・notesも当時の表記であり現在の状況ではない。",
    schools: historicalWaitlistSchools,
  },
}, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
