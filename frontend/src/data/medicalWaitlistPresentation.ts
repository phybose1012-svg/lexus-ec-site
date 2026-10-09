import type { WaitlistRecord } from "./medicalWaitlist.ts";

// Table cells follow the historical table: values only, with meanings below it.
// Keep ranges/groups; an approximate rank must never become an exact number.
export function waitlistTableValue(record: WaitlistRecord): string {
  if (record.metric === "count") {
    const match = record.result.match(/(\d+)人/);
    if (!match) throw new Error(`Waitlist count has no numeric value: ${record.result}`);
    return match[1];
  }
  if (record.metric === "rank" || record.metric === "rank-case") {
    const match = record.result.match(/(?:補欠(?:順位)?|繰上順位)(\d+)(番台(?:前半|後半)?|前後)?/);
    if (!match) throw new Error(`Waitlist rank has no numeric value: ${record.result}`);
    return `${match[1]}${match[2]?.replace("番台", "台") ?? ""}`;
  }
  if (record.metric === "group-case") {
    const match = record.result.match(/補欠([A-D](?:群|ランク))/);
    if (!match) throw new Error(`Waitlist group has no value: ${record.result}`);
    return match[1];
  }
  return "不明";
}

export function waitlistValueMeaning(record: WaitlistRecord): string {
  if (record.metric === "rank-case") return "繰り上がった順位（報告分）。";
  if (record.metric === "group-case") return "繰り上がった補欠ランク（報告分）。";
  if (record.metric === "rank") return "繰り上がった順位。";
  if (record.metric !== "count") return "数値未確認。";
  if (record.result.includes("連絡者")) return "繰上合格の連絡を受けた人数。";
  if (record.result.includes("入学許可")) return "繰上合格の許可人数。";
  if (record.result.includes("初回発表後")) return "初回発表後の追加合格者数（辞退者を含むか不明）。";
  return "繰上合格者数（辞退者を含むか不明）。";
}

export function waitlistEvidenceDate(record: WaitlistRecord): string | null {
  if (!record.asOf) return null;
  const monthDay = `${Number(record.asOf.slice(5, 7))}/${Number(record.asOf.slice(8, 10))}`;
  return `${monthDay}${record.note?.startsWith("15時時点") ? " 15時" : ""}`;
}

export function waitlistNumericNotes(entries: { record: WaitlistRecord; column: string }[]): string[] {
  const groups = new Map<string, typeof entries>();
  for (const entry of entries) {
    const meaning = waitlistValueMeaning(entry.record);
    const group = groups.get(meaning) ?? [];
    group.push(entry);
    groups.set(meaning, group);
  }
  return [...groups].map(([meaning, group]) => {
    const columns = [...new Set(group.map(({ column }) => column))];
    const scope = groups.size > 1 ? `${columns.join("・")}：` : "";
    const dates = [...new Set(group.map(({ record }) => waitlistEvidenceDate(record)))];
    let dateNote = "";
    if (dates.length === 1 && dates[0]) dateNote = `（${dates[0]}時点）`;
    else if (dates.some(Boolean)) {
      dateNote = `（${group.filter(({ record }) => record.asOf).map(({ record }) => `${record.route.replace("一般選抜", "一般").replace(/共通テスト(?:・一般併用|利用)?/, "共テ").replace(/地域枠([CD])(?:（.*）)?/, "地域$1")} ${waitlistEvidenceDate(record)}`).join("、")}時点）`;
    }
    return `${scope}${meaning}${dateNote}`;
  });
}
