import { waitlistAdmissionYear, waitlistCheckedAt, waitlistSchools } from "../../data/medicalWaitlist";
import { waitlist2025AdmissionYear, waitlist2025Schools } from "../../data/medicalWaitlist2025";
import { historicalWaitlistSchools } from "../../data/medicalWaitlistHistory";
import { publicWaitlistSchool } from "../../data/medicalWaitlistPublic";

export const GET = () => new Response(JSON.stringify({
  checkedAt: waitlistCheckedAt,
  scope: "私立医学部の補欠・繰上げ合格情報。2025・2026年度と2024年度以前の従来掲載分。",
  warning: "人数と順位は異なる指標。未確認や過去表の「-」を0人と解釈しない。「報告あり」の番号は、大学全体の最終到達順位とは限らない。",
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
