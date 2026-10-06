import type { Evidence, Metric, WaitlistRecord, WaitlistSchool } from "./medicalWaitlist";

export const waitlist2025AdmissionYear = 2025;
const official = (title: string, url: string): Evidence => ({ title, url, kind: "official" });
const fuji: Evidence = { title: "富士学院・2025年度合格速報", url: "https://www.fujigakuin.jp/news/?id=2152", kind: "prep" };
const mel: Evidence = { title: "メルリックス学院・2025年度繰上情報", url: "https://melurix.co.jp/blog/info/medical/c1494", kind: "prep" };
const record = (route: string, metric: Metric, result: string, asOf: string | null, source: Evidence, note?: string): WaitlistRecord => ({ route, metric, result, asOf, source, ...(note ? { note } : {}) });
const example = (route: string, result: string, date: string, metric: Metric = "rank-case") => record(route, metric, result, date, fuji);
const reportedRank = (route: string, result: string, date: string) => record(route, "rank", result, date, mel);
const aichi = official("愛知医科大学・2025年度入試結果（大学案内2026・p.16）", "https://www.aichi-med-u.ac.jp/files/igaku/ikadai_guide_2026.pdf");
const iwate = official("岩手医科大学・令和7年度入学試験実施状況", "https://www.imu-admission.jp/wp/wp-content/uploads/2025/06/results_2025.pdf");
const kurume = official("久留米大学・2025年度入試結果（医学科）", "https://best.kurume-u.ac.jp/img/admissions/2025_results.pdf");
const uoeh = official("産業医科大学・令和7年度入学試験結果", "https://www.uoeh-u.ac.jp/var/rev0/0087/7216/1264316514.pdf");
const fukuoka = official("福岡大学・令和7年度入試状況表（p.136–137）", "https://nyushi.fukuoka-u.ac.jp/cms/wp-content/uploads/2025/07/jyokyo2025.pdf");
const tokyo = official("東京医科大学・2025年3月31日の繰上順位", "https://admissions-tokyo-med.jp/news/detail/2025年度医学部医学科　一般選抜・共通テスト利用-3/");

// Dates belong to the 2025 evidence, not the date of this site's update.
// A reported case/rank is not silently promoted to a university-wide final count.
export const waitlist2025Schools: WaitlistSchool[] = [
  { id: "school-1", name: "愛知医科大学", records: [
    record("一般選抜", "count", "繰上合格者27人", null, aichi),
    record("共通テスト利用", "count", "繰上合格者8人", null, aichi),
    record("共テ利用・愛知県地域特別枠B方式", "count", "繰上合格者0人", null, aichi),
  ] },
  { id: "school-2", name: "岩手医科大学", records: [
    record("一般選抜", "count", "初回発表後の追加分17人", null, iwate, "公式表の合格者207人－初回合格者190人。補欠の到達順位ではありません。"),
    record("地域枠C", "count", "初回発表後の追加分4人", null, iwate, "公式表の合格者9人－初回合格者5人。"),
    record("地域枠D", "count", "初回発表後の追加分4人", null, iwate, "公式表の合格者11人－初回合格者7人。"),
  ] },
  { id: "school-3", name: "大阪医科薬科大学", records: [
    reportedRank("一般前期", "補欠71番までとの報告", "2025-03-31"),
    reportedRank("一般後期", "補欠1番までとの報告", "2025-03-31"),
    reportedRank("共通テスト利用", "補欠21番までとの報告", "2025-03-31"),
  ] },
  { id: "school-4", name: "金沢医科大学", records: [
    reportedRank("一般前期", "補欠143番までとの報告", "2025-04-03"),
  ], note: "後期の人数・到達順位は未確認です。" },
  { id: "school-5", name: "関西医科大学", records: [
    example("一般前期", "合格例：補欠168番", "2025-03-29"),
    example("共通テスト・一般併用", "合格例：補欠38番", "2025-03-24"),
  ] },
  { id: "school-6", name: "北里大学", records: [
    example("一般選抜", "合格例：補欠90番", "2025-02-21"),
    record("終了案内", "notice", "2025年度の繰上合格は終了", "2025-03-31", official("北里大学・2025年度繰上合格終了の案内", "https://www.kitasato-u.ac.jp/med/albums/abm.php?f=abm00044506.pdf&n=2025年度北里大学医学部選抜試験繰上合格終了について.pdf")),
  ] },
  { id: "school-7", name: "杏林大学", records: [
    record("一般選抜", "rank-case", "合格例：補欠20番台前半", "2025-03-28", mel),
    record("共通テスト利用", "rank-case", "合格例：補欠10番", "2025-03-31", mel),
  ] },
  { id: "school-8", name: "近畿大学", records: [
    example("一般前期", "合格例：補欠55番", "2025-03-31"),
    example("一般後期", "合格例：補欠2番", "2025-03-28"),
  ] },
  { id: "school-9", name: "久留米大学", records: [
    record("一般前期", "count", "繰上合格者19人", null, kurume),
    record("一般後期", "count", "繰上合格者2人", null, kurume),
    example("一般前期", "合格例：補欠43番", "2025-03-31"),
  ], note: "公式の人数と、予備校が報告した補欠番号は別の数値です。" },
  { id: "school-10", name: "慶應義塾大学", records: [
    record("一般選抜・医学部", "count", "補欠から入学許可33人", null, official("慶應義塾大学・2025年度一般選抜統計", "https://www.keio.ac.jp/files/1002f460ed3e02a2ca0c4ccf72aca6020d1546c95a59782ea8f6afc58c9d103c")),
  ] },
  { id: "school-11", name: "国際医療福祉大学", records: [
    example("一般選抜", "合格例：補欠B群", "2025-03-26", "group-case"),
  ] },
  { id: "school-12", name: "埼玉医科大学", records: [
    reportedRank("一般前期", "補欠62番までとの報告", "2025-03-31"),
    reportedRank("一般後期", "補欠5番までとの報告", "2025-03-31"),
    reportedRank("共通テスト利用", "補欠8番までとの報告", "2025-03-31"),
  ] },
  { id: "school-13", name: "産業医科大学", records: [
    record("一般選抜A", "count", "追加合格者10人", null, uoeh),
    record("一般選抜B", "count", "追加合格者0人", null, uoeh),
    record("一般選抜C", "count", "追加合格者0人", null, uoeh),
  ] },
  { id: "school-14", name: "昭和医科大学", records: [
    example("一般Ⅰ期（当時：昭和大学）", "追加合格の報告あり（順位記載なし）", "2025-02-18", "report"),
  ] },
  { id: "school-15", name: "聖マリアンナ医科大学", records: [
    reportedRank("一般前期", "補欠82番までとの報告", "2025-03-31"),
    reportedRank("一般後期", "補欠3番までとの報告", "2025-03-31"),
    reportedRank("共通テスト利用", "補欠2番までとの報告", "2025-03-31"),
  ] },
  { id: "school-16", name: "東海大学", records: [
    example("一般選抜", "合格例：補欠132番", "2025-03-31"),
    record("共通テスト利用", "rank-case", "合格例：補欠49番", "2025-03-18", mel),
    example("神奈川県地域枠", "合格例：補欠16番", "2025-03-24"),
  ] },
  { id: "school-17", name: "東京医科大学", records: [
    record("一般選抜", "rank", "補欠順位89位まで", "2025-03-31", tokyo),
    record("共通テスト利用", "rank", "補欠順位49位まで", "2025-03-31", tokyo),
  ] },
  { id: "school-18", name: "東京慈恵会医科大学", records: [
    record("一般選抜", "count", "繰上合格連絡者67人", null, official("東京慈恵会医科大学・2025年度医学科入試結果", "https://www.jikei.ac.jp/wp-content/uploads/2025/04/result2025.pdf")),
  ] },
  { id: "school-19", name: "東京女子医科大学", records: [
    reportedRank("一般選抜", "補欠36番までとの報告", "2025-03-31"),
  ] },
  { id: "school-20", name: "東北医科薬科大学", records: [
    example("一般選抜・一般枠", "繰上合格の報告あり（順位なし）", "2025-03-31", "report"),
  ] },
  { id: "school-21", name: "獨協医科大学", records: [
    example("一般前期", "繰上合格の報告あり（順位なし）", "2025-03-31", "report"),
    record("一般後期", "rank-case", "合格例：補欠1番", "2025-03-19", mel),
  ] },
  { id: "school-22", name: "日本医科大学", records: [
    example("一般前期", "合格例：補欠71番", "2025-03-19"),
    example("一般後期・千葉県地域枠", "繰上合格の報告あり（順位なし）", "2025-03-24", "report"),
    example("グローバル特別選抜", "繰上合格の報告あり（順位なし）", "2025-03-17", "report"),
  ], note: "予備校の指導生全員が繰り上がったという報告を、大学の補欠者全員の合格とは扱いません。" },
  { id: "school-23", name: "日本大学", records: [
    record("N全学統一方式・第1期", "rank-case", "合格例：補欠54番", "2025-02-27", mel),
  ] },
  { id: "school-24", name: "兵庫医科大学", records: [
    example("一般A", "合格例：補欠80番", "2025-03-31"),
  ] },
  { id: "school-25", name: "福岡大学", records: [
    record("一般選抜・系統別日程", "count", "追加合格者51人", null, fukuoka),
    record("共通テスト利用型・Ⅰ期", "count", "追加合格者13人", null, fukuoka),
  ] },
  { id: "school-26", name: "藤田医科大学", records: [
    reportedRank("一般前期", "補欠14番までとの報告", "2025-03-31"),
    reportedRank("一般前期・愛知県地域枠", "補欠36番までとの報告", "2025-03-25"),
    reportedRank("共通テスト利用", "補欠36番までとの報告", "2025-03-17"),
  ] },
  { id: "jichi", name: "自治医科大学", records: [
    example("医学部・鹿児島県", "繰上合格の報告あり（順位なし）", "2025-03-24", "report"),
  ], note: "鹿児島県の個別報告です。全国共通の到達順位ではありません。" },
  { id: "juntendo", name: "順天堂大学", records: [
    example("一般A方式", "繰上合格の報告あり（順位なし）", "2025-03-26", "report"),
    example("一般B方式", "繰上合格の報告あり（順位なし）", "2025-03-19", "report"),
  ] },
  { id: "teikyo", name: "帝京大学", records: [
    example("一般選抜", "合格報告あり（出典の表記：繰上合格）", "2025-02-22", "report"),
  ] },
  { id: "toho", name: "東邦大学", records: [
    example("一般選抜", "合格例：補欠B群", "2025-03-27", "group-case"),
  ] },
  { id: "kawasaki", name: "川崎医科大学", records: [
    record("一般選抜・地域枠", "unknown", "2025年度の繰上人数／到達順位は未確認", null, official("川崎医科大学・入試データ", "https://m.kawasaki-m.ac.jp/examination/data.php")),
  ] },
];

export const waitlist2025ById = Object.fromEntries(waitlist2025Schools.map((school) => [school.id, school]));
