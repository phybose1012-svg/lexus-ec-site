import { waitlistCheckedAt } from "../../data/medicalWaitlist";
import { waitlist2025AdmissionYear, waitlist2025Schools } from "../../data/medicalWaitlist2025";
import { publicWaitlistSchool } from "../../data/medicalWaitlistPublic";

export const GET = () => new Response(JSON.stringify({
  admissionYear: waitlist2025AdmissionYear,
  checkedAt: waitlistCheckedAt,
  scope: "私立医学部医学科。掲載のない選抜方式の結果は未確認であり、0人を意味しない。",
  warning: "個別の合格例は大学全体の最終到達順位ではない。岩手医科大学の追加人数は初回発表と合計の差分。",
  schools: waitlist2025Schools.map(publicWaitlistSchool),
}, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
