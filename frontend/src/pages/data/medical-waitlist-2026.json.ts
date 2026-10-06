import { waitlistAdmissionYear, waitlistCheckedAt, waitlistSchools } from "../../data/medicalWaitlist";
export const GET = () => new Response(JSON.stringify({
  admissionYear: waitlistAdmissionYear,
  checkedAt: waitlistCheckedAt,
  scope: "私立医学部医学科。掲載のない選抜方式の結果は未確認であり、0人を意味しない。",
  warning: "予備校情報は大学公式の確定結果ではない。個別の合格例は大学全体の最終到達順位ではない。",
  schools: waitlistSchools,
}, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
