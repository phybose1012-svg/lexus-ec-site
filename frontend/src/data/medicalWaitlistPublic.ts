import type { WaitlistSchool } from "./medicalWaitlist.ts";

// Research provenance stays in the repository, not on public page/data endpoints.
export function publicWaitlistSchool(school: WaitlistSchool) {
  return {
    id: school.id, name: school.name,
    records: school.records.map(({ route, metric, result, asOf, note }) => ({
      route, metric, result, asOf, ...(note ? { note } : {}),
    })),
    ...(school.note ? { note: publicWaitlistNote(school.note) } : {}),
  };
}

export function publicWaitlistNote(note: string) {
  return note
    .replace("大学サイトの発表を予備校が報告した順位です。", "公表順位についての報告です。")
    .replace("予備校記事で前期・後期を特定できない報告は、方式を推測していません。", "前期・後期が不明な報告は、表の下に掲載しています。")
    .replace("公式の人数と、予備校が報告した補欠番号は別の数値です。", "人数と、個別の合格例の補欠番号は別の数値です。")
    .replace("予備校の指導生全員が繰り上がったという報告を、大学の補欠者全員の合格とは扱いません。", "個別の合格報告は、大学の補欠者全員が合格したことを示すものではありません。");
}
