import { waitlistAdmissionYear, waitlistCheckedAt, waitlistSchools } from "../../data/medicalWaitlist";
import { publicWaitlistSchool } from "../../data/medicalWaitlistPublic";
export const GET = () => new Response(JSON.stringify({
  admissionYear: waitlistAdmissionYear,
  checkedAt: waitlistCheckedAt,
  scope: "私立医学部医学科。掲載のない選抜方式の結果は未確認であり、0人を意味しない。",
  warning: "個別の合格例は大学全体の最終到達順位ではない。",
  schools: waitlistSchools.map(publicWaitlistSchool),
}, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
