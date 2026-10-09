import { waitlistAdmissionYear, waitlistCheckedAt, waitlistSchools } from "../../data/medicalWaitlist";
import { publicWaitlistSchool } from "../../data/medicalWaitlistPublic";
export const GET = () => new Response(JSON.stringify({
  admissionYear: waitlistAdmissionYear,
  checkedAt: waitlistCheckedAt,
  scope: "私立医学部医学科。掲載のない選抜方式の結果は未確認であり、0人を意味しない。",
  warning: "displayValueは表用の簡略値。人数か補欠番号かはmetric・valueMeaningを確認。個別の合格報告は最終到達順位とは限らない。",
  schools: waitlistSchools.map(publicWaitlistSchool),
}, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
