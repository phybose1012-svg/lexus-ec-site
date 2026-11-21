export const privateMedicalDirectoryPath = "/top/information-shiritsu/";
export const privateMedicalPrepPath = `${privateMedicalDirectoryPath}exam-prep/`;

// 文科省「大学別医学部入学定員等一覧」（2026年10月9日）と日本私立医科大学協会の会員名簿で照合。
export const privateMedicalRosterSource = "https://www.mext.go.jp/content/20261009-mxt_koutou02-000052444_04.pdf";

type University = readonly [id: string, name: string, legacySlug: string];
type Region = { name: string; universities: readonly University[] };

// IDはレクサスの2027年度入試日程に合わせ、年度データには依存させない。
export const privateMedicalRegions: readonly Region[] = [
  { name: "東北", universities: [
    ["iwate-medical", "岩手医科大学", "iwateika"],
    ["tohoku-med-pharm", "東北医科薬科大学", "tohokuikaykka"],
  ] },
  { name: "関東", universities: [
    ["jichi-medical", "自治医科大学", "zichiika"],
    ["dokkyo-medical", "獨協医科大学", "dokyouika"],
    ["saitama-medical", "埼玉医科大学", "saitamaika"],
    ["iuhw", "国際医療福祉大学", "kokusaiiryoufukushi"],
    ["kyorin", "杏林大学", "kyourin"],
    ["keio", "慶應義塾大学", "keiou"],
    ["juntendo", "順天堂大学", "zyuntendou"],
    ["showa-medical", "昭和医科大学", "shouwa"],
    ["teikyo", "帝京大学", "teikyou"],
    ["tokyo-medical", "東京医科大学", "toukyouika"],
    ["jikei", "東京慈恵会医科大学", "jikei"],
    ["tokyo-womens-medical", "東京女子医科大学", "toukyoujyoshiika"],
    ["toho", "東邦大学", "touhou"],
    ["nihon", "日本大学", "nihonn"],
    ["nippon-medical", "日本医科大学", "nihinnika"],
    ["kitasato", "北里大学", "kitasato"],
    ["marianna", "聖マリアンナ医科大学", "seimariannna"],
    ["tokai", "東海大学", "toukai"],
  ] },
  { name: "中部", universities: [
    ["kanazawa-medical", "金沢医科大学", "kanazawaika"],
    ["aichi-medical", "愛知医科大学", "aichiika"],
    ["fujita", "藤田医科大学", "hujitaika"],
  ] },
  { name: "近畿", universities: [
    ["osaka-med-pharm", "大阪医科薬科大学", "oosakaikayakka"],
    ["kansai-medical", "関西医科大学", "kannsaiika"],
    ["kindai", "近畿大学", "kinnki"],
    ["hyogo-medical", "兵庫医科大学", "hyougoika"],
  ] },
  { name: "中国", universities: [
    ["kawasaki-medical", "川崎医科大学", "kawasakiika"],
  ] },
  { name: "九州", universities: [
    ["kurume", "久留米大学", "kurume"],
    ["uoeh", "産業医科大学", "sanngyouika"],
    ["fukuoka", "福岡大学", "fukuoka"],
  ] },
];

export const privateMedicalSchools = privateMedicalRegions.flatMap(({ universities }) =>
  universities.map(([id, name, legacySlug]) => ({ id, name, legacySlug })),
);

export const getPrivateMedicalSchoolPath = (id: string) => `${privateMedicalPrepPath}${id}/`;
