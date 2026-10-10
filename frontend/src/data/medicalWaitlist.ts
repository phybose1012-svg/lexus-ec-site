// Source dates describe the evidence, not the day this page was checked.
export const waitlistCheckedAt = "2026-10-10";
export const waitlistAdmissionYear = 2026;
export type EvidenceKind = "official" | "prep";
export type Metric = "count" | "rank" | "rank-case" | "group-case" | "report" | "notice" | "unknown";
export type Evidence = { title: string; url: string; kind: EvidenceKind };
export type WaitlistRecord = {
  route: string; metric: Metric; result: string; asOf: string | null;
  source: Evidence; note?: string;
  evidenceBasis?: "university-announcement" | "university-confirmation" | "student-report" | "unconfirmed";
};
export type WaitlistSchool = {
  id: string; name: string; records: WaitlistRecord[]; note?: string; noteSources?: Evidence[];
};
const official = (title: string, url: string): Evidence => ({ title, url, kind: "official" });
const fuji: Evidence = { title: "富士学院・2026年度合格速報", url: "https://www.fujigakuin.jp/news/?id=2588", kind: "prep" };
const mel: Evidence = { title: "メルリックス学院・2026年度繰上情報", url: "https://melurix.co.jp/blog/c1493", kind: "prep" };
const daikanyama: Evidence = { title: "代官山MEDICAL・2026年度繰り上げ状況（4/2時点）", url: "https://daikanyamamedical.com/blog/2026/04/02/kuriage2026/", kind: "prep" };
const record = (route: string, metric: Metric, result: string, asOf: string | null, source: Evidence, note?: string): WaitlistRecord => ({ route, metric, result, asOf, source, ...(note ? { note } : {}) });
const example = (route: string, result: string, date: string, metric: Metric = "rank-case") => record(route, metric, result, date, fuji);
// These reports explicitly cite a university announcement or a university inquiry.
const reportedRank = (route: string, result: string, date: string, evidenceBasis: WaitlistRecord["evidenceBasis"] = "university-announcement"): WaitlistRecord => ({
  ...record(route, "rank", result, date, mel),
  evidenceBasis,
});
const aichi = official("愛知医科大学・2026年度入試結果", "https://www.aichi-med-u.ac.jp/su11/su1107/su110706/index.html");
const aichiMarch = official("愛知医科大学・2026年3月31日15時の繰上合格状況", "https://www.aichi-med-u.ac.jp/su11/su1101/su110101/1236862_1888.html");
const saitama = official("埼玉医科大学・2026年度入学者選抜結果", "https://adm.saitama-med.ac.jp/admission/examdata/");
const tokyo = official("東京医科大学・2026年3月31日の繰上順位", "https://admissions-tokyo-med.jp/news/detail/医学部医学科-一般選抜・共通テスト利用選抜-繰り/");
const kurume = official("久留米大学・2026年度入試結果（医学科）", "https://best.kurume-u.ac.jp/img/admissions/2026_results.pdf");
const uoeh = official("産業医科大学・令和8年度入学試験結果", "https://www.uoeh-u.ac.jp/var/rev0/0087/7212/12682491622.pdf");
const fukuoka = official("福岡大学・2026年度入試結果", "https://nyushi.fukuoka-u.ac.jp/cms/wp-content/uploads/2026/05/jyokyo2026.pdf");

// Retain the original school-1…school-26 deep links when adding the missing five schools.
export const waitlistSchools: WaitlistSchool[] = [
  { id: "school-1", name: "愛知医科大学", records: [
    record("一般選抜", "count", "繰上合格者83人", null, aichi),
    record("共通テスト利用", "count", "繰上合格者39人", null, aichi),
    record("共テ利用・愛知県地域特別枠B方式", "count", "繰上合格者5人", null, aichi),
    record("一般選抜", "rank", "第1補欠79位まで", "2026-03-31", aichiMarch, "15時時点。年度全体の繰上合格者数ではありません。"),
    record("共通テスト利用", "rank", "第1補欠38位まで", "2026-03-31", aichiMarch, "15時時点。年度全体の繰上合格者数ではありません。"),
    record("共テ利用・愛知県地域特別枠B方式", "rank", "補欠5位まで", "2026-03-31", aichiMarch, "15時時点。"),
  ], note: "3月31日15時の順位と、年度全体の繰上合格者数を掲載しています。一般79位／83人、共テ38位／39人と異なるため、順位と人数は区別してください。" },
  { id: "school-2", name: "岩手医科大学", records: [
    example("一般選抜", "合格例：補欠82番", "2026-03-31"),
    record("地域枠C", "rank-case", "合格例：補欠1番", "2026-02-13", mel),
    example("地域枠D（全国枠・診療科指定枠）", "合格例：補欠12番", "2026-03-23"),
  ] },
  { id: "school-3", name: "大阪医科薬科大学", records: [
    reportedRank("一般前期", "補欠44番までとの報告", "2026-03-31"),
    reportedRank("一般後期", "補欠2番までとの報告", "2026-03-31"),
    reportedRank("共通テスト利用", "補欠21番までとの報告", "2026-03-31"),
  ], note: "大学サイトの発表を予備校が報告した順位です。終了の報告もありますが、大学の終了案内の原文は未確認です。" },
  { id: "school-4", name: "金沢医科大学", records: [
    record("一般前期", "rank-case", "合格例：補欠98番", "2026-04-01", mel),
    reportedRank("一般後期", "補欠3番までとの報告", "2026-03-31"),
  ] },
  { id: "school-5", name: "関西医科大学", records: [
    { ...record("一般前期", "rank-case", "合格例：補欠110番前後", "2026-04-02", daikanyama, "複数の報告をもとにした概数。正確な最終順位ではありません。"), evidenceBasis: "unconfirmed" },
    example("一般後期", "合格例：補欠3番", "2026-03-31"),
    example("共通テスト・一般併用", "合格例：補欠40番", "2026-03-24"),
  ] },
  { id: "school-6", name: "北里大学", records: [
    example("一般選抜", "合格例：補欠29番", "2026-03-30"),
    record("終了案内", "notice", "2026年度の繰上合格は終了", "2026-03-31", official("北里大学・繰上合格終了の公式案内", "https://www.kitasato-u.ac.jp/med/albums/abm.php?f=abm00048511.pdf&n=2026年度北里大学医学部選抜試験繰上合格終了について.pdf")),
  ] },
  { id: "school-7", name: "杏林大学", records: [
    example("一般選抜", "合格例：補欠4番", "2026-03-30"),
    example("共通テスト利用", "合格例：補欠32番", "2026-03-23"),
    record("終了案内", "notice", "2026年度の補欠繰上は終了", "2026-04-06", official("杏林大学・医学部補欠繰上終了のお知らせ", "https://www.kyorin-u.ac.jp/univ/center/nyugaku/news/3631/")),
  ] },
  { id: "school-8", name: "近畿大学", records: [
    example("一般前期", "合格例：補欠46番", "2026-03-31"),
    example("共通テスト利用・前期", "合格例：補欠9番", "2026-03-27"),
  ] },
  { id: "school-9", name: "久留米大学", records: [
    record("一般前期", "count", "繰上合格者41人", null, kurume),
    record("一般後期", "count", "繰上合格者2人", null, kurume),
    example("一般前期", "合格例：補欠72番", "2026-03-30"),
  ], note: "医学科の数値です。全学合計や補欠順位とは区別しています。" },
  { id: "school-10", name: "慶應義塾大学", records: [
    record("一般選抜・医学部", "count", "補欠から入学許可47人", "2026-03-31", official("慶應義塾大学・2026年度一般選抜統計総括", "https://www.keio.ac.jp/files/32d7248026715b4d0ee6aa84b49c136bd32cd6fe3e25c6cc126df449e852b3a1")),
  ], note: "3月31日に入学許可を打ち切り。47人は順位ではなく、入学を許可された補欠者の人数です。" },
  { id: "school-11", name: "国際医療福祉大学", records: [
    example("一般選抜", "合格例：補欠C群", "2026-03-27", "group-case"),
  ], note: "C群全員や、大学全体の補欠者全員の合格を示す報告ではありません。" },
  { id: "school-12", name: "埼玉医科大学", records: [
    record("一般前期", "rank", "繰上順位104位", null, saitama),
    record("一般後期", "rank", "繰上順位8位", null, saitama),
    record("共通テスト利用", "rank", "繰上順位17位", null, saitama),
  ], note: "大学の2026年度入学者選抜結果に掲載された順位です。繰上合格した人数ではありません。" },
  { id: "school-13", name: "産業医科大学", records: [
    record("一般選抜A", "count", "追加合格者20人", null, uoeh),
    record("一般選抜B", "count", "追加合格者0人", null, uoeh),
    record("一般選抜C", "count", "追加合格者0人", null, uoeh),
  ], note: "大学公式の「追加合格者数」。医学部以外の追加合格者は含めていません。" },
  { id: "school-14", name: "昭和医科大学", records: [
    record("医学部・2026年度結果", "unknown", "繰上・追加だけの人数／最終順位は未確認", null, official("昭和医科大学・令和8年度入学試験結果", "https://adm.showa-u.ac.jp/admission/data/")),
  ], note: "公式の合格者数には繰上・追加合格を含みます。この総数を繰上合格者数として掲載しません。旧称：昭和大学。" },
  { id: "school-15", name: "聖マリアンナ医科大学", records: [
    reportedRank("一般前期", "補欠123番までとの報告", "2026-04-02", "university-confirmation"),
    reportedRank("一般後期", "補欠8番までとの報告", "2026-04-02", "university-confirmation"),
    reportedRank("共通テスト利用", "補欠15番までとの報告（訂正前）", "2026-04-02", "university-confirmation"),
    record("共テ利用・訂正発表", "notice", "連絡順の誤りを訂正し、追加で1人に連絡", "2026-04-08", official("聖マリアンナ医科大学・繰上合格の連絡に関するお詫び", "https://www.marianna-u.ac.jp/univ/news/20260408_01.html")),
  ], note: "共テ15番は4月8日の訂正前の報告です。訂正後の最終順位は未確認。追加の1人は年間の繰上合格者総数ではありません。" },
  { id: "school-16", name: "東海大学", records: [
    example("一般選抜", "合格例：補欠10番", "2026-03-17"),
    record("共通テスト利用", "rank-case", "合格例：補欠10番台前半", "2026-03-10", mel),
    example("共通テスト利用・神奈川県地域枠", "合格例：補欠4番", "2026-03-23"),
  ] },
  { id: "school-17", name: "東京医科大学", records: [
    record("一般選抜", "rank", "補欠順位151位まで", "2026-03-31", tokyo),
    record("共通テスト利用", "rank", "補欠順位70位まで", "2026-03-31", tokyo),
  ], note: "大学が3月31日に発表した時点の順位です。繰上合格した人数ではありません。" },
  { id: "school-18", name: "東京慈恵会医科大学", records: [
    record("一般選抜", "count", "繰上合格連絡者118人", null, official("東京慈恵会医科大学・2026年度医学科入試結果", "https://www.jikei.ac.jp/wp-content/uploads/2026/04/result2026-nyushi-igakuka.pdf")),
  ], note: "大学が公表した、繰上合格の連絡をした人数です。入学者数ではありません。" },
  { id: "school-19", name: "東京女子医科大学", records: [
    example("一般選抜", "合格例：補欠56番", "2026-03-26"),
  ] },
  { id: "school-20", name: "東北医科薬科大学", records: [
    example("一般選抜", "繰上合格の報告あり（順位なし）", "2026-03-26", "report"),
  ] },
  { id: "school-21", name: "獨協医科大学", records: [
    example("一般前期", "繰上合格の報告あり（順位記載なし）", "2026-03-31", "report"),
    example("一般後期", "合格例：補欠4番", "2026-03-27"),
  ] },
  { id: "school-22", name: "日本医科大学", records: [
    { ...record("一般前期", "rank-case", "合格例：補欠90番台前半", "2026-03-23", mel), evidenceBasis: "unconfirmed" },
    { ...record("一般後期", "rank-case", "合格例：補欠40番台前半", "2026-04-02", daikanyama, "複数の報告をもとにした概数。正確な最終順位ではありません。"), evidenceBasis: "unconfirmed" },
    example("一般前期・千葉県地域枠", "合格例：補欠5番", "2026-03-17"),
  ] },
  { id: "school-23", name: "日本大学", records: [
    { ...record("N全学統一方式・第1期", "rank-case", "合格例：補欠170番前後", "2026-04-02", daikanyama, "複数の報告をもとにした概数。正確な最終順位ではありません。"), evidenceBasis: "unconfirmed" },
  ], note: "第2期など、ここに掲載のない方式の人数・最終順位は未確認です。" },
  { id: "school-24", name: "兵庫医科大学", records: [
    example("一般A・四科目型（一般枠）", "合格例：補欠91番", "2026-03-31"),
    example("一般A・四科目型（一般枠）", "順位のない候補者にも合格報告", "2026-04-01", "report"),
    example("一般B・英語資格試験活用型", "繰上合格の報告あり（順位記載なし）", "2026-03-31", "report"),
  ] },
  { id: "school-25", name: "福岡大学", records: [
    record("一般選抜・系統別日程", "count", "追加合格者28人", null, fukuoka),
    record("共通テスト利用型・I期", "count", "追加合格者25人", null, fukuoka),
  ], note: "公式の追加合格者数です。補欠順位28番・25番という意味ではありません。" },
  { id: "school-26", name: "藤田医科大学", records: [
    reportedRank("一般選抜", "補欠89番までとの報告", "2026-03-18"),
    reportedRank("愛知県地域枠", "補欠19番までとの報告", "2026-03-18"),
    reportedRank("共通テスト利用", "補欠50番までとの報告", "2026-03-18"),
    reportedRank("ふじた未来入試・一般枠", "補欠6番までとの報告", "2026-03-18", "student-report"),
    example("一般枠", "順位のない候補者にも合格報告", "2026-03-31", "report"),
    record("共通テスト利用", "report", "二次不合格者にも合格報告", "2026-03-30", mel),
  ], note: "3月18日の順位の後にも合格報告があります。89番・50番を最終順位とは扱いません。予備校記事で前期・後期を特定できない報告は、方式を推測していません。" },
  { id: "jichi", name: "自治医科大学", records: [
    record("医学部・一般選抜", "unknown", "2026年度の繰上人数／最終順位は未確認", null, official("自治医科大学・2026年度募集要項（p.20）", "https://www.jichi.ac.jp/assets/pdf/exam/medicine/exam/exam_youkou_2026.pdf")),
  ], note: "2026年度要項には補欠者への電話・郵送による連絡を記載。都道府県別の選抜を全国共通の補欠順位として比較しないでください。" },
  { id: "juntendo", name: "順天堂大学", records: [
    example("一般A方式", "繰上合格の報告あり（順位記載なし）", "2026-03-30", "report"),
    example("一般B方式", "繰上合格の報告あり（順位記載なし）", "2026-03-18", "report"),
    example("静岡県地域枠", "繰上合格の報告あり（順位記載なし）", "2026-03-16", "report"),
  ] },
  { id: "teikyo", name: "帝京大学", records: [
    example("一般選抜", "追加合格の報告あり", "2026-03-31", "report"),
  ], note: "2026年度要項では「繰上合格」は行わないとされていますが、欠員時の「追加合格」が案内されています。補欠発表がないことと、追加合格がないことは別です。", noteSources: [official("帝京大学・2026年度入学試験要項（p.69）", "https://www.teikyo-u.ac.jp/application/files/5017/5496/5079/02_2026.pdf")] },
  { id: "toho", name: "東邦大学", records: [
    example("一般選抜", "合格例：補欠Bランク", "2026-03-27", "group-case"),
  ] },
  { id: "kawasaki", name: "川崎医科大学", records: [
    record("一般選抜・地域枠", "unknown", "2026年度の繰上人数／最終順位は未確認", null, official("川崎医科大学・2026年度入試データ", "https://m.kawasaki-m.ac.jp/examination/data.php")),
  ], note: "公式表に掲載された一次合格者数・入学者数から、繰上合格者数は算出していません。" },
];

// Five new universities are inserted into the existing alphabetical index.
const alphabeticalIds = ["school-1", "school-2", "school-3", "school-4", "school-5", "kawasaki", "school-6", "school-7", "school-8", "school-9", "school-10", "school-11", "school-12", "school-13", "jichi", "juntendo", "school-14", "school-15", "teikyo", "school-16", "school-17", "school-18", "school-19", "toho", "school-20", "school-21", "school-23", "school-22", "school-24", "school-25", "school-26"];
export const alphabeticalWaitlistSchools = alphabeticalIds.map((id) => waitlistSchools.find((school) => school.id === id)!);
export const waitlistMetricLabels: Record<Metric, string> = {
  count: "人数", rank: "到達順位", "rank-case": "個別の合格報告", "group-case": "個別の合格報告",
  report: "合格報告", notice: "公式のお知らせ", unknown: "数値未確認",
};
export const waitlistSourceLabels: Record<EvidenceKind, string> = { official: "大学公式", prep: "予備校情報" };
export const waitlistFaqs = [
  { question: "補欠と繰上げ合格は何が違う？", answer: "補欠は、欠員が出た場合に合格の対象になり得る状態です。まだ入学できると決まったわけではありません。繰上げ合格・追加合格の連絡を受け、指定された手続きを終えて入学が決まります。名称や運用は大学によって異なります。" },
  { question: "繰り上げ合格者が50人なら、補欠50番までしか回ってないってこと？", answer: "そうとは限りません。公表される繰り上げ合格者数に、合格後に入学を辞退した人が含まれていない場合があります。その場合、実際に合格の連絡を受けた人は掲載人数より多く、補欠50番より先まで回っていることもあります。数値の意味は各大学の表の注意書きを確認してください。" },
  { question: "繰上げ合格の連絡は、いつまで来る？", answer: "大学・年度によって異なります。藤田医科大学の公式Q&Aでは、辞退状況により4月に繰り上がる場合もあると案内しています。一律の終了日は設けず、受験した年度の募集要項、マイページ、大学の終了案内を確認してください。" },
  { question: "昨年の補欠順位から、今年の合格を予測できる？", answer: "過去の順位は参考にはなりますが、募集枠や辞退状況が変わるため、合格の保証にはなりません。合格が報告された補欠番号も、大学全体の最終順位とは限りません。2026年度の結果を、2027年度の進行状況と取り違えないようにしてください。" },
];
