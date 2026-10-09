import { waitlistCheckedAt } from "../../data/medicalWaitlist";
import { waitlist2025AdmissionYear, waitlist2025Schools } from "../../data/medicalWaitlist2025";
import { publicWaitlistSchool } from "../../data/medicalWaitlistPublic";

export const GET = () => new Response(JSON.stringify({
  admissionYear: waitlist2025AdmissionYear,
  checkedAt: waitlistCheckedAt,
  scope: "私立医学部医学科。掲載のない選抜方式の結果は未確認であり、0人を意味しない。",
  warning: "displayValueは表用の簡略値。人数か補欠番号かはmetric・valueMeaningを確認。個別の合格報告は最終到達順位とは限らない。岩手医科大学の追加人数は初回発表と合計の差分。",
  schools: waitlist2025Schools.map(publicWaitlistSchool),
}, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
