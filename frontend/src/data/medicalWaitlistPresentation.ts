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
  return "—";
}

export function waitlistValueMeaning(record: WaitlistRecord): string {
  if (record.metric === "rank-case") return "合格が報告された補欠番号。最終到達順位とは限りません。";
  if (record.metric === "group-case") return "合格が報告された補欠の群・ランク。全員の合格を示すものではありません。";
  if (record.metric === "rank") return "補欠番号（順位）。合格者の人数ではありません。";
  if (record.metric !== "count") return "人数・補欠順位の数値は未確認です。";
  if (record.result.includes("連絡者")) return "繰上合格の連絡を受けた人数。入学辞退者を除いた入学者数ではありません。";
  if (record.result.includes("入学許可")) return "補欠から入学を許可された人数。実際に入学した人数ではありません。";
  if (record.result.includes("初回発表後")) return "初回発表後に増えた合格者数（合格者数−初回合格者数）。入学者数ではありません。辞退者を含むかは公表資料に記載がありません。";
  if (record.result.includes("追加合格者")) return "大学公表の追加合格者数。入学者数ではありません。辞退者を含むかは公表資料に記載がありません。";
  return "大学公表の繰上合格者数。辞退者を含むかは公表資料に記載がありません。";
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
      dateNote = `（${group.filter(({ record }) => record.asOf).map(({ record }) => `${record.route} ${waitlistEvidenceDate(record)}時点`).join("、")}）`;
    }
    return `${scope}${meaning}${dateNote}`;
  });
}
