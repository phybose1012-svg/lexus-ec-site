import type { WaitlistRecord, WaitlistSchool } from "./medicalWaitlist.ts";
import { waitlistTableValue, waitlistValueMeaning } from "./medicalWaitlistPresentation.ts";

export function publicWaitlistResult(record: WaitlistRecord) {
  if (record.metric === "rank-case" || record.metric === "group-case") {
    return `${record.result.replace(/^合格例：/, "")}での合格報告`;
  }
  return record.result;
}

// Research provenance stays in the repository, not on public page/data endpoints.
export function publicWaitlistSchool(school: WaitlistSchool) {
  return {
    id: school.id, name: school.name,
    records: school.records.map((record) => ({
      route: record.route, metric: record.metric, result: publicWaitlistResult(record),
      displayValue: waitlistTableValue(record), valueMeaning: waitlistValueMeaning(record),
      asOf: record.asOf, ...(record.note ? { note: record.note } : {}),
    })),
    ...(school.note ? { note: publicWaitlistNote(school.note) } : {}),
  };
}

export function publicWaitlistNote(note: string) {
  return note
    .replace("大学サイトの発表を予備校が報告した順位です。", "公表順位についての報告です。")
    .replace("予備校記事で前期・後期を特定できない報告は、方式を推測していません。", "前期・後期が不明な報告は、表の下に掲載しています。")
    .replace("公式の人数と、予備校が報告した補欠番号は別の数値です。", "人数と、合格が報告された補欠番号は別の数値です。")
    .replace("予備校の指導生全員が繰り上がったという報告を、大学の補欠者全員の合格とは扱いません。", "個別の合格報告は、大学の補欠者全員が合格したことを示すものではありません。");
}

// Keep the research notes intact; omit repeated definitions from the visible table.
export function publicWaitlistTableNote(note: string): string | null {
  const compactNotes: Record<string, string | null> = {
    "3月31日15時の順位と、年度全体の繰上合格者数を掲載しています。一般79位／83人、共テ38位／39人と異なるため、順位と人数は区別してください。": null,
    "大学サイトの発表を予備校が報告した順位です。終了の報告もありますが、大学の終了案内の原文は未確認です。": "繰上げ終了との報告あり（公式の終了案内は未確認）。",
    "後期の人数・到達順位は未確認です。": "後期は未確認。",
    "医学科の数値です。全学合計や補欠順位とは区別しています。": null,
    "公式の人数と、予備校が報告した補欠番号は別の数値です。": null,
    "3月31日に入学許可を打ち切り。47人は順位ではなく、入学を許可された補欠者の人数です。": "3/31に繰上げ終了。",
    "C群全員や、大学全体の補欠者全員の合格を示す報告ではありません。": null,
    "大学の2026年度入学者選抜結果に掲載された順位です。繰上合格した人数ではありません。": null,
    "大学公式の「追加合格者数」。医学部以外の追加合格者は含めていません。": "表の2025・2026年度は一般選抜A。",
    "公式の合格者数には繰上・追加合格を含みます。この総数を繰上合格者数として掲載しません。旧称：昭和大学。": "繰上げだけの人数は未確認。旧称：昭和大学。",
    "共テ15番は4月8日の訂正前の報告です。訂正後の最終順位は未確認。追加の1人は年間の繰上合格者総数ではありません。": "共テ15は4/8の訂正前。訂正後の順位は未確認。",
    "大学が3月31日に発表した時点の順位です。繰上合格した人数ではありません。": null,
    "大学が公表した、繰上合格の連絡をした人数です。入学者数ではありません。": null,
    "予備校の指導生全員が繰り上がったという報告を、大学の補欠者全員の合格とは扱いません。": null,
    "第2期など、ここに掲載のない方式の人数・最終順位は未確認です。": "第2期などは未確認。",
    "公式の追加合格者数です。補欠順位28番・25番という意味ではありません。": null,
    "3月18日の順位の後にも合格報告があります。89番・50番を最終順位とは扱いません。予備校記事で前期・後期を特定できない報告は、方式を推測していません。": "3/18以降も繰上げあり。前期・後期が不明な報告は注記に掲載。",
    "2026年度要項には補欠者への電話・郵送による連絡を記載。都道府県別の選抜を全国共通の補欠順位として比較しないでください。": "都道府県ごとの選抜。全国共通の順位はありません。",
    "鹿児島県の個別報告です。全国共通の到達順位ではありません。": "鹿児島県のみの報告。",
    "2026年度要項では「繰上合格」は行わないとされていますが、欠員時の「追加合格」が案内されています。補欠発表がないことと、追加合格がないことは別です。": "補欠発表はなく、欠員時に追加合格あり。",
    "公式表に掲載された一次合格者数・入学者数から、繰上合格者数は算出していません。": null,
  };
  if (Object.hasOwn(compactNotes, note)) return compactNotes[note];
  return publicWaitlistNote(note)
    .replace("表記の数値は補欠番号です。", "繰り上がった順位。")
    .replace(/(?:公表されている|上記の)?繰上合格者(?:数)?には入学辞退者が含まれていません。/, "入学辞退者を含まない人数。")
    .replace("補欠番号が何番まで回ったかは非公表です。", "順位は非公表。");
}
