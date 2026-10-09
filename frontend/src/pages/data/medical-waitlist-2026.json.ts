import { waitlistAdmissionYear, waitlistCheckedAt, waitlistSchools } from "../../data/medicalWaitlist";
import { publicWaitlistSchool } from "../../data/medicalWaitlistPublic";
export const GET = () => new Response(JSON.stringify({
  admissionYear: waitlistAdmissionYear,
  checkedAt: waitlistCheckedAt,
  scope: "私立医学部医学科。掲載のない選抜方式の結果は未確認であり、0人を意味しない。",
  warning: "「報告あり」の番号は、大学全体の最終到達順位とは限らない。",
  schools: waitlistSchools.map(publicWaitlistSchool),
}, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
