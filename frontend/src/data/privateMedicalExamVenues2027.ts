import {
  privateMedicalUniversities2027,
  type AdmissionRouteCategory,
  type AdmissionRouteStatus,
} from "./privateMedicalAdmissions2027.ts";
import { privateMedicalCanonicalRouteIds2027 } from "./privateMedicalCanonicalRouteIds2027.ts";

export type VenuePublicationState =
  | "confirmed"
  | "city_or_campus_only"
  | "ticket_assigned"
  | "unpublished"
  | "conflict";

export type VenueAssignmentCondition =
  | "fixed"
  | "applicant_preference"
  | "university_assigned"
  | "admission_ticket"
  | "capacity_overflow";

export type VenueReviewState = "verified" | "needs_review" | "monitoring";
export type ExamStage2027 = "first" | "second";
export type VenueLinkRole = "fixed" | "choice" | "primary" | "overflow";
export type JichiExamPart2027 = "written" | "interview";

export type PrivateMedicalExamVenue2027 = {
  venueId: string;
  academicYear: 2027;
  name: string;
  shortName: string;
  postalCode?: string;
  address: string;
  prefecture: string;
  municipality: string;
  nearestStations: string[];
  officialUrl: string;
  officialUrlLabel?: string;
  accessNote?: string;
  reviewState: VenueReviewState;
  verifiedAt: string;
};

export type PrivateMedicalVenueLink2027 = {
  venueId: string;
  role: VenueLinkRole;
  applicantPrefecture?: string;
  examPart?: JichiExamPart2027;
  examDate?: string;
  officialVenueText?: string;
};

export type PrivateMedicalJichiVenueRelation2027 = PrivateMedicalVenueLink2027 & {
  role: "fixed";
  applicantPrefecture: string;
  examPart: JichiExamPart2027;
  examDate: "2027-01-25" | "2027-01-26";
  officialVenueText: string;
};

export type PrivateMedicalExamVenueAssignment2027 = {
  assignmentId: string;
  academicYear: 2027;
  universityId: string;
  universityName: string;
  region: string;
  prefecture: string;
  routeId: string;
  routeName: string;
  routeCategory: AdmissionRouteCategory;
  routeStatus: AdmissionRouteStatus;
  examStage: ExamStage2027;
  examStageLabel: string;
  examDateLabel: string;
  venueLinks: PrivateMedicalVenueLink2027[];
  announcedPrefectures: string[];
  announcedVenueText: string;
  publicationState: VenuePublicationState;
  conditions: VenueAssignmentCondition[];
  sharedWithRouteIds: string[];
  officialAdmissionUrl?: string;
  evidenceLabel: string;
  evidenceLocator?: string;
  knowledgeBaseIds: string[];
  reviewState: VenueReviewState;
  verifiedAt: string;
  note?: string;
};

export const venuePublicationStateLabels: Record<VenuePublicationState, string> = {
  confirmed: "正式会場・住所を確認",
  city_or_campus_only: "都市・キャンパスまで公表",
  ticket_assigned: "受験票等で指定",
  unpublished: "正式会場は未公表",
  conflict: "公式資料間を確認中",
};

export const venueAssignmentConditionLabels: Record<VenueAssignmentCondition, string> = {
  fixed: "試験地・会場は固定",
  applicant_preference: "受験日または試験地の希望・選択あり",
  university_assigned: "大学指定あり",
  admission_ticket: "受験票で最終確認",
  capacity_overflow: "定員状況による制限・変更あり",
};

const VERIFIED_AT = "2026-08-12T00:00:00+09:00";
const JICHI_VERIFIED_AT = "2026-08-15T00:00:00+09:00";
const MARIANNA_VERIFIED_AT = "2026-08-18T00:00:00+09:00";
const JICHI_2027_GUIDELINE_URL =
  "https://www.jichi.ac.jp/assets/pdf/exam/medicine/exam/exam_youkou_R9.pdf";

type JichiVenueSpec = {
  venueId: string;
  officialVenueText: string;
  localityAddress: string;
};

type JichiVenueRelationSeed = PrivateMedicalJichiVenueRelation2027 & {
  address: string;
  prefecture: string;
};

const jichiVenueSpec = (
  slug: string,
  officialVenueText: string,
  localityAddress: string,
): JichiVenueSpec => ({
  venueId: `venue-jichi-first-${slug}`,
  officialVenueText,
  localityAddress,
});

const jichiPrefectureVenuePair = (
  applicantPrefecture: string,
  writtenVenue: JichiVenueSpec,
  interviewVenue: JichiVenueSpec = writtenVenue,
): JichiVenueRelationSeed[] => [
  {
    venueId: writtenVenue.venueId,
    role: "fixed",
    applicantPrefecture,
    examPart: "written",
    examDate: "2027-01-25",
    officialVenueText: writtenVenue.officialVenueText,
    address: `${applicantPrefecture}${writtenVenue.localityAddress}`,
    prefecture: applicantPrefecture,
  },
  {
    venueId: interviewVenue.venueId,
    role: "fixed",
    applicantPrefecture,
    examPart: "interview",
    examDate: "2027-01-26",
    officialVenueText: interviewVenue.officialVenueText,
    address: `${applicantPrefecture}${interviewVenue.localityAddress}`,
    prefecture: applicantPrefecture,
  },
];

const jichiVenueRelationSeeds2027: JichiVenueRelationSeed[] = [
  ...jichiPrefectureVenuePair(
    "北海道",
    jichiVenueSpec(
      "hokkaido-tkp-sapporo-kita3jo",
      "TKP札幌カンファレンスセンター北3条",
      "札幌市中央区北3条西3丁目1-6 札幌小暮ビル",
    ),
    jichiVenueSpec(
      "hokkaido-kaderu27",
      "北海道立道民活動センター（かでる2・7）",
      "札幌市中央区北2条西7丁目",
    ),
  ),
  ...jichiPrefectureVenuePair(
    "青森県",
    jichiVenueSpec(
      "aomori-toonippo-news",
      "東奥日報新町ビルNew's TO-O・New'sホール（3階）",
      "青森市新町2-2-11",
    ),
  ),
  ...jichiPrefectureVenuePair(
    "岩手県",
    jichiVenueSpec("iwate-espoir", "エスポワールいわて", "盛岡市中央通1-1-38"),
  ),
  ...jichiPrefectureVenuePair(
    "宮城県",
    jichiVenueSpec("miyagi-jichikaikan", "宮城県自治会館", "仙台市青葉区上杉1-2-3"),
  ),
  ...jichiPrefectureVenuePair(
    "秋田県",
    jichiVenueSpec("akita-ja-building", "秋田県JAビル", "秋田市八橋南2-10-16"),
  ),
  ...jichiPrefectureVenuePair(
    "山形県",
    jichiVenueSpec(
      "yamagata-training-center",
      "山形県総合研修センター",
      "山形市松波3-7-1",
    ),
    jichiVenueSpec("yamagata-prefectural-office", "山形県庁", "山形市松波2-8-1"),
  ),
  ...jichiPrefectureVenuePair(
    "福島県",
    jichiVenueSpec("fukushima-nakamachi", "ふくしま中町会館", "福島市中町7-17"),
  ),
  ...jichiPrefectureVenuePair(
    "茨城県",
    jichiVenueSpec("ibaraki-auditorium-9f", "茨城県庁 講堂（9階）", "水戸市笠原町978-6"),
    jichiVenueSpec(
      "ibaraki-meeting-1101",
      "茨城県庁 1101共用会議室（11階）",
      "水戸市笠原町978-6",
    ),
  ),
  ...jichiPrefectureVenuePair(
    "栃木県",
    jichiVenueSpec("tochigi-prefectural-office", "栃木県庁", "宇都宮市塙田1-1-20"),
  ),
  ...jichiPrefectureVenuePair(
    "群馬県",
    jichiVenueSpec("gunma-meeting-291", "群馬県庁 291会議室", "前橋市大手町1-1-1"),
    jichiVenueSpec("gunma-meeting-293", "群馬県庁 293会議室", "前橋市大手町1-1-1"),
  ),
  ...jichiPrefectureVenuePair(
    "埼玉県",
    jichiVenueSpec("saitama-education-hall", "埼玉教育会館", "さいたま市浦和区高砂3-12-24"),
    jichiVenueSpec(
      "saitama-regional-medical-education-center",
      "埼玉県総合医局機構地域医療教育センター（埼玉県立小児医療センター南玄関8階）",
      "さいたま市中央区新都心1-2",
    ),
  ),
  ...jichiPrefectureVenuePair(
    "千葉県",
    jichiVenueSpec("chiba-plaza-nanohana", "ホテルプラザ菜の花", "千葉市中央区長洲1-8-1"),
  ),
  ...jichiPrefectureVenuePair(
    "東京都",
    jichiVenueSpec("tokyo-todofuken-kaikan", "都道府県会館", "千代田区平河町2-6-3"),
  ),
  ...jichiPrefectureVenuePair(
    "神奈川県",
    jichiVenueSpec("kanagawa-workpia-yokohama", "ワークピア横浜", "横浜市中区山下町24-1"),
    jichiVenueSpec(
      "kanagawa-prefectural-office-new-5f",
      "神奈川県庁 新庁舎5階会議室",
      "横浜市中区日本大通1",
    ),
  ),
  ...jichiPrefectureVenuePair(
    "新潟県",
    jichiVenueSpec("niigata-jichikaikan", "新潟県自治会館", "新潟市中央区新光町4-1"),
  ),
  ...jichiPrefectureVenuePair(
    "富山県",
    jichiVenueSpec("toyama-kenminkaikan", "富山県民会館", "富山市新総曲輪4-18"),
  ),
  ...jichiPrefectureVenuePair(
    "石川県",
    jichiVenueSpec("ishikawa-meeting-1105", "石川県庁 1105会議室（11階）", "金沢市鞍月1-1"),
    jichiVenueSpec("ishikawa-meeting-1103", "石川県庁 1103会議室（11階）", "金沢市鞍月1-1"),
  ),
  ...jichiPrefectureVenuePair(
    "福井県",
    jichiVenueSpec("fukui-international-exchange", "福井県国際交流会館", "福井市宝永3-1-1"),
    jichiVenueSpec("fukui-meeting-2f", "福井県庁 2階中会議室", "福井市大手3-17-1"),
  ),
  ...jichiPrefectureVenuePair(
    "山梨県",
    jichiVenueSpec("yamanashi-onshirin", "恩賜林記念館", "甲府市丸の内1-5-4"),
  ),
  ...jichiPrefectureVenuePair(
    "長野県",
    jichiVenueSpec("nagano-jichikaikan", "長野県自治会館", "長野市大字西長野字加茂北143-8"),
    jichiVenueSpec("nagano-prefectural-office", "長野県庁", "長野市大字南長野字幅下692-2"),
  ),
  ...jichiPrefectureVenuePair(
    "岐阜県",
    jichiVenueSpec(
      "gifu-meeting-301-302",
      "岐阜県庁 共用会議室301・302",
      "岐阜市薮田南2-1-1",
    ),
    jichiVenueSpec("gifu-meeting-301", "岐阜県庁 共用会議室301", "岐阜市薮田南2-1-1"),
  ),
  ...jichiPrefectureVenuePair(
    "静岡県",
    jichiVenueSpec("shizuoka-prefectural-office", "静岡県庁", "静岡市葵区追手町9-6"),
  ),
  ...jichiPrefectureVenuePair(
    "愛知県",
    jichiVenueSpec(
      "aichi-winc-aichi",
      "愛知県産業労働センター（ウインクあいち）",
      "名古屋市中村区名駅4-4-38",
    ),
  ),
  ...jichiPrefectureVenuePair(
    "三重県",
    jichiVenueSpec("mie-workers-welfare", "三重県勤労者福祉会館", "津市栄町1-891"),
  ),
  ...jichiPrefectureVenuePair(
    "滋賀県",
    jichiVenueSpec("shiga-east-7f", "滋賀県庁東館 7階大会議室", "大津市京町4-1-1"),
    jichiVenueSpec("shiga-collab-3f", "コラボしが21 3階中会議室2", "大津市打出浜2-1"),
  ),
  ...jichiPrefectureVenuePair(
    "京都府",
    jichiVenueSpec("kyoto-medical-association", "京都府医師会館", "京都市中京区西ノ京東栂尾町6"),
    jichiVenueSpec(
      "kyoto-prefectural-office-building-3",
      "京都府庁第3号館",
      "京都市上京区下立売通新町西入薮ノ内町",
    ),
  ),
  ...jichiPrefectureVenuePair(
    "大阪府",
    jichiVenueSpec("osaka-primrose", "プリムローズ大阪", "大阪市中央区大手前3-1-43"),
  ),
  ...jichiPrefectureVenuePair(
    "兵庫県",
    jichiVenueSpec("hyogo-nosai", "兵庫県農業共済会館", "神戸市中央区下山手通4-15-3"),
    jichiVenueSpec("hyogo-kyosai", "ひょうご共済会館", "神戸市中央区中山手通4-17-13"),
  ),
  ...jichiPrefectureVenuePair(
    "奈良県",
    jichiVenueSpec("nara-nobotel", "ノボテル奈良", "奈良市大宮町7-1-45"),
  ),
  ...jichiPrefectureVenuePair(
    "和歌山県",
    jichiVenueSpec("wakayama-kenmin-bunka", "和歌山県民文化会館", "和歌山市小松原通一丁目1番地"),
  ),
  ...jichiPrefectureVenuePair(
    "鳥取県",
    jichiVenueSpec("tottori-auditorium", "鳥取県庁 講堂ほか", "鳥取市東町1-220"),
    jichiVenueSpec(
      "tottori-meeting-15",
      "鳥取県庁 第15会議室（県議会棟3階）ほか",
      "鳥取市東町1-220",
    ),
  ),
  ...jichiPrefectureVenuePair(
    "島根県",
    jichiVenueSpec("shimane-sunport-murakumo", "サンラポーむらくも", "松江市殿町369"),
  ),
  ...jichiPrefectureVenuePair(
    "岡山県",
    jichiVenueSpec(
      "okayama-convention-center",
      "岡山コンベンションセンター",
      "岡山市北区駅元町14-1",
    ),
  ),
  ...jichiPrefectureVenuePair(
    "広島県",
    jichiVenueSpec("hiroshima-mielparque", "ホテル メルパルク広島", "広島市中区基町6-36"),
  ),
  ...jichiPrefectureVenuePair(
    "山口県",
    jichiVenueSpec("yamaguchi-av-room", "山口県庁 視聴覚室（1階）", "山口市滝町1-1"),
    jichiVenueSpec(
      "yamaguchi-meeting-2-3",
      "山口県庁 共用第2・第3会議室（4階）",
      "山口市滝町1-1",
    ),
  ),
  ...jichiPrefectureVenuePair(
    "徳島県",
    jichiVenueSpec("tokushima-auditorium", "徳島県庁 講堂", "徳島市万代町1-1"),
    jichiVenueSpec("tokushima-meeting-room", "徳島県庁 会議室", "徳島市万代町1-1"),
  ),
  ...jichiPrefectureVenuePair(
    "香川県",
    jichiVenueSpec("kagawa-north-3f", "香川県庁 北館会議室（3階）", "高松市番町4-1-10"),
    jichiVenueSpec("kagawa-main-12f", "香川県庁 本館会議室（12階）", "高松市番町4-1-10"),
  ),
  ...jichiPrefectureVenuePair(
    "愛媛県",
    jichiVenueSpec("ehime-annex-2", "愛媛県庁第二別館", "松山市一番町4丁目4番地2"),
  ),
  ...jichiPrefectureVenuePair(
    "高知県",
    jichiVenueSpec("kochi-kyosai-sakura", "高知共済会館（桜）", "高知市本町5-3-20"),
    jichiVenueSpec("kochi-kyosai-fuji", "高知共済会館（藤）", "高知市本町5-3-20"),
  ),
  ...jichiPrefectureVenuePair(
    "福岡県",
    jichiVenueSpec("fukuoka-yoshizuka", "吉塚合同庁舎", "福岡市博多区吉塚本町13-50"),
    jichiVenueSpec("fukuoka-prefectural-office", "福岡県庁 行政棟", "福岡市博多区東公園7-7"),
  ),
  ...jichiPrefectureVenuePair(
    "佐賀県",
    jichiVenueSpec("saga-prefectural-office", "佐賀県庁", "佐賀市城内1丁目1番59号"),
  ),
  ...jichiPrefectureVenuePair(
    "長崎県",
    jichiVenueSpec("nagasaki-meeting-302-305", "長崎県庁 302～305会議室（3階）", "長崎市尾上町3-1"),
    jichiVenueSpec("nagasaki-meeting-312", "長崎県庁 312会議室（3階）", "長崎市尾上町3-1"),
  ),
  ...jichiPrefectureVenuePair(
    "熊本県",
    jichiVenueSpec("kumamoto-basement-hall", "熊本県庁 地下大会議室", "熊本市中央区水前寺6-18-1"),
    jichiVenueSpec("kumamoto-hotel-terza", "ホテル熊本テルサ", "熊本市中央区水前寺公園28-51"),
  ),
  ...jichiPrefectureVenuePair(
    "大分県",
    jichiVenueSpec("oita-new-large-meeting", "大分県庁舎・新館大会議室", "大分市大手町3-1-1"),
    jichiVenueSpec("oita-meeting-room", "大分県庁舎・会議室", "大分市大手町3-1-1"),
  ),
  ...jichiPrefectureVenuePair(
    "宮崎県",
    jichiVenueSpec("miyazaki-mrt-micc", "MRTmiccダイヤモンドホール（2階）", "宮崎市橘通西4-6-3"),
    jichiVenueSpec("miyazaki-disaster-71", "宮崎県庁防災庁舎 防71号室（7階）", "宮崎市橘通東2-10-1"),
  ),
  ...jichiPrefectureVenuePair(
    "鹿児島県",
    jichiVenueSpec("kagoshima-auditorium-2f", "鹿児島県庁 行政庁舎 講堂（2階）", "鹿児島市鴨池新町10-1"),
    jichiVenueSpec(
      "kagoshima-meeting-16a1",
      "鹿児島県庁 行政庁舎 16-A-1会議室（16階）",
      "鹿児島市鴨池新町10-1",
    ),
  ),
  ...jichiPrefectureVenuePair(
    "沖縄県",
    jichiVenueSpec("okinawa-municipal-autonomy", "沖縄県市町村自治会館", "那覇市旭町116-37"),
  ),
];

export const privateMedicalJichiVenueRelations2027: PrivateMedicalJichiVenueRelation2027[] =
  jichiVenueRelationSeeds2027.map(({ address: _address, prefecture: _prefecture, ...relation }) => relation);

const municipalityFromAddress = (address: string, prefecture: string) => {
  const locality = address.startsWith(prefecture) ? address.slice(prefecture.length) : address;
  return (
    locality.match(/^(.+?市.+?区)/u)?.[1] ??
    locality.match(/^(.+?郡.+?[町村])/u)?.[1] ??
    locality.match(/^(.+?[市区町村])/u)?.[1] ??
    locality
  );
};

const jichiVenueEntityById = new Map<string, PrivateMedicalExamVenue2027>();
const jichiVenueSeedFingerprintById = new Map<string, string>();
for (const seed of jichiVenueRelationSeeds2027) {
  const seedFingerprint = JSON.stringify([seed.officialVenueText, seed.address]);
  const existingSeedFingerprint = jichiVenueSeedFingerprintById.get(seed.venueId);
  const existing = jichiVenueEntityById.get(seed.venueId);
  if (existingSeedFingerprint && existingSeedFingerprint !== seedFingerprint) {
    throw new Error(`Conflicting Jichi venue normalization: ${seed.venueId}`);
  }
  jichiVenueSeedFingerprintById.set(seed.venueId, seedFingerprint);
  if (!existing) {
    jichiVenueEntityById.set(seed.venueId, {
      venueId: seed.venueId,
      academicYear: 2027,
      name: seed.officialVenueText,
      shortName: seed.officialVenueText,
      address: seed.address,
      prefecture: seed.prefecture,
      municipality: municipalityFromAddress(seed.address, seed.prefecture),
      nearestStations: [],
      officialUrl: JICHI_2027_GUIDELINE_URL,
      officialUrlLabel: "自治医科大学 2027年度募集要項（都道府県別試験場一覧）",
      accessNote: "自治医科大学の公式募集要項に掲載された試験場です。施設個別の公式アクセスは受験票と施設案内で確認してください。",
      reviewState: "verified",
      verifiedAt: JICHI_VERIFIED_AT,
      ...(seed.venueId === "venue-jichi-first-hokkaido-tkp-sapporo-kita3jo"
        ? {
            postalCode: "060-0003",
            address: "北海道札幌市中央区北3条西3丁目1-6 札幌小暮ビル6〜7階",
            nearestStations: ["札幌市営地下鉄南北線 さっぽろ駅", "JR札幌駅"],
            officialUrl: "https://www.kashikaigishitsu.net/facilitys/cc-sapporo/access/",
            officialUrlLabel: "TKP札幌カンファレンスセンター北3条 公式アクセス",
            accessNote:
              "北海道から出願する受験者の2027年1月25日（月）の学力試験会場です。受付は8:20〜8:40、試験は9:00〜14:10です。施設公式は、さっぽろ駅地下歩行空間1番出口から徒歩1分、9番出口から徒歩4分、JR札幌駅南口から徒歩5分と案内しています。施設は札幌小暮ビル6〜7階にありますが、試験の使用階・室、受付位置、受験生入口は未公表です。翌1月26日（火）の面接は北海道立道民活動センター（かでる2・7）で行われるため、同じ会場と取り違えないでください。受験票、北海道から交付される案内、当日掲示を確認し、名称の似たTKP札幌駅カンファレンスセンター等とも取り違えないでください。",
            verifiedAt: "2026-08-19T00:00:00+09:00",
          }
        : seed.venueId === "venue-jichi-first-hokkaido-kaderu27"
          ? {
              postalCode: "060-0002",
              address: "北海道札幌市中央区北2条西7丁目 道民活動センタービル",
              nearestStations: ["札幌市営地下鉄南北線・東豊線 さっぽろ駅", "JR札幌駅"],
              officialUrl: "https://homepage.kaderu27.or.jp/intoro/access/index.html",
              officialUrlLabel: "北海道立道民活動センター かでる2・7 公式アクセス",
              accessNote:
                "北海道から出願し、1月25日の学力試験に合格した受験者の2027年1月26日（火）の面接会場です。受付は9:00〜9:20、面接は10:00〜16:00で、個人ごとの時間は北海道から指定されます。施設公式はJR札幌駅南口から徒歩13分、地下鉄さっぽろ駅10番出口から徒歩9分、公共地下歩道1番出口から徒歩4分と案内しています。試験の使用階・室、受付位置、受験生入口は未公表です。かでるホール・展示ホールは改修休止中ですが、自治医科大学の2027年度募集要項は北海道の面接会場を当施設と指定しています。休止中のホールを使用すると推測せず、北海道から交付される案内、受験票、当日掲示で指定室を確認してください。前日の学力試験会場TKP札幌カンファレンスセンター北3条とは別会場です。",
              verifiedAt: "2026-08-19T00:00:00+09:00",
            }
          : seed.venueId === "venue-jichi-first-aomori-toonippo-news"
            ? {
                postalCode: "030-0801",
                address: "青森県青森市新町2丁目2-11 東奥日報新町ビル3階",
                nearestStations: ["JR奥羽本線・青い森鉄道線 青森駅"],
                officialUrl: "https://www.atca.info/mice-facility/mice-facility-1505/",
                officialUrlLabel: "青森観光コンベンション協会 東奥日報新町ビルNew’s 公式施設案内",
                accessNote:
                  "青森県から出願する受験者の2027年1月25日（月）の学力試験と、学力試験に及第した受験者の翌1月26日（火）の面接に使われる会場です。学力試験は受付8:20〜8:40、試験9:00〜14:10、面接は受付9:00〜9:20、10:00〜16:00のうち青森県が指定する時間です。施設案内はJR青森駅から徒歩10分、会場を東奥日報新町ビル3階のNew’sホールと案内しています。3階にはホールA〜Eがありますが、試験で使うホール・室、受付位置、受験生入口は未公表です。施設の通常利用時間9:00〜18:00を試験日の開場時刻とみなさず、受験票、青森県から交付される案内、当日掲示を確認してください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-iwate-espoir"
            ? {
                postalCode: "020-0021",
                address: "岩手県盛岡市中央通1丁目1-38",
                nearestStations: ["JR東北本線・東北新幹線 盛岡駅"],
                officialUrl: "https://espoir-iwate.com/access/",
                officialUrlLabel: "エスポワールいわて 公式アクセス",
                accessNote:
                  "岩手県から出願する受験者の2027年1月25日（月）の学力試験と、学力試験に及第した受験者の翌1月26日（火）の面接に使われる会場です。学力試験は受付8:20〜8:40、試験9:00〜14:10、面接は受付9:00〜9:20、10:00〜16:00のうち岩手県が指定する時間です。施設公式はJR盛岡駅から徒歩20分、路線バスの中央通一丁目停留所から徒歩5分と案内しています。館内には複数の会議室・ホールと宿泊客室がありますが、試験で使う階・室、受付位置、受験生入口は未公表です。一般宿泊の正面玄関が24:00〜6:00に施錠される案内や施設の通常利用時間を試験日の開場・受験生入口とみなさず、受験票、岩手県から交付される案内、当日掲示を確認してください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-miyagi-jichikaikan"
            ? {
                postalCode: "980-0011",
                address: "宮城県仙台市青葉区上杉1丁目2番3号",
                nearestStations: ["仙台市営地下鉄南北線 勾当台公園駅"],
                officialUrl: "https://miyagi-mayors.jp/access/",
                officialUrlLabel: "宮城県市長会 宮城県自治会館 公式アクセス",
                accessNote:
                  "宮城県から出願する受験者の2027年1月25日（月）の学力試験と、学力試験に及第した受験者の翌1月26日（火）の面接に使われる会場です。学力試験は受付8:20〜8:40、試験9:00〜14:10、面接は受付9:00〜9:20、10:00〜16:00のうち宮城県が指定する時間です。会館内団体の公式アクセスは、仙台市営地下鉄南北線の勾当台公園駅北2番出口から徒歩5分、県庁市役所前バス停から徒歩5分と案内しています。会館には複数階の事務所・会議室がありますが、試験で使う階・室、受付位置、受験生入口は未公表です。宮城県市長会の通常受付時間8:30〜17:15を試験日の開場時刻とみなさず、受験票、宮城県から交付される案内、当日掲示を確認してください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-akita-ja-building"
            ? {
                postalCode: "010-0976",
                address: "秋田県秋田市八橋南二丁目10番16号",
                nearestStations: ["JR奥羽本線・秋田新幹線 秋田駅"],
                officialUrl: "https://www.akita-jab.co.jp/access/",
                officialUrlLabel: "秋田県JAビル 公式アクセス・駐車場",
                accessNote:
                  "秋田県から出願する受験者の2027年1月25日（月）の学力試験と、学力試験に及第した受験者の翌1月26日（火）の面接に使われる会場です。学力試験は受付8:20〜8:40、試験9:00〜14:10、面接は受付9:00〜9:20、10:00〜16:00のうち秋田県が指定する時間です。施設公式はJR秋田駅西口2・3番乗り場から路線バスを利用し、山王交番前停留所で下車して徒歩2分と案内しています。2027年1月のバス時刻は未公表です。館内には複数の会議室・ホールがありますが、試験で使う階・室、受付位置、受験生入口は未公表です。施設の通常利用案内や一般来館者用の玄関を試験当日の指定動線とみなさず、受験票、秋田県から交付される案内、当日掲示を確認してください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-yamagata-training-center"
            ? {
                postalCode: "990-0023",
                address: "山形県山形市松波三丁目7番1号",
                nearestStations: ["JR奥羽本線・山形新幹線 山形駅"],
                officialUrl:
                  "https://www.pref.yamagata.jp/021001/kensei/recruit/shokuinikusei/shisetsugaiyou28.html",
                officialUrlLabel: "山形県総合研修センター 公式施設概要",
                accessNote:
                  "山形県から出願する受験者の2027年1月25日（月）の学力試験会場です。受付は8:20〜8:40、試験は9:00〜14:10です。施設公式案内は、JR山形駅前から県庁行きバスで約15分、県総合研修センター前停留所から徒歩約1分、または県庁前停留所から徒歩約10分と案内しています。2027年1月のバス時刻は未公表です。研修棟は地上3階で、講堂、研修室、演習室、会議室等がありますが、試験で使う階・室、受付位置、受験生入口は未公表です。翌1月26日（火）の面接は山形県庁で行われるため、同じ会場と取り違えないでください。施設の通常開庁時間や1階ロビーを試験日の開場・指定入口とみなさず、受験票、山形県から交付される案内、当日掲示を確認してください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-yamagata-prefectural-office"
            ? {
                postalCode: "990-8570",
                address: "山形県山形市松波二丁目8番1号",
                nearestStations: ["JR奥羽本線・山形新幹線 山形駅"],
                officialUrl:
                  "https://www.pref.yamagata.jp/020026/kensei/shoukai/about/access.html",
                officialUrlLabel: "山形県庁 公式アクセス",
                accessNote:
                  "山形県から出願し、前日の学力試験に及第した受験者の2027年1月26日（火）の面接会場です。受付は9:00〜9:20、面接は10:00〜16:00のうち山形県が指定する時間です。県庁公式案内は、山形駅前4番バス停から県庁前停留所まで約20分と案内しています。2027年1月のバス時刻は未公表です。県庁舎は16階建てで複数の講堂・会議室等がありますが、面接で使う階・室、受付位置、受験生入口は未公表です。前日1月25日（月）の学力試験は山形県総合研修センターで行われるため、同じ会場と取り違えないでください。県庁の通常開庁時間8:30〜17:15や一般来庁者用の玄関を面接日の開場・指定入口とみなさず、山形県から交付される案内と当日掲示を確認してください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-fukushima-nakamachi"
            ? {
                postalCode: "960-8043",
                address: "福島県福島市中町7番17号",
                nearestStations: ["JR東北本線・東北新幹線 福島駅"],
                officialUrl: "https://www.fm-so.org/conference-room-rental",
                officialUrlLabel: "ふくしま中町会館 公式会議室案内",
                accessNote:
                  "福島県から出願する受験者の2027年1月25日（月）の学力試験と、学力試験に及第した受験者の翌1月26日（火）の面接に使われる会場です。学力試験は受付8:20〜8:40、試験9:00〜14:10、面接は受付9:00〜9:20、10:00〜16:00のうち福島県が指定する時間です。施設公式は所在地を福島市中町7番17号とし、4階から6階に収容人数の異なる6会議室を案内していますが、試験で使う階・室、受付位置、受験生入口は未公表です。会議室の通常利用開始9:00や鍵の受渡し8:30を入試の開場・受付時刻とみなさず、受験票、福島県から交付される案内、当日掲示を確認してください。会議室利用者用の駐車場はないため、徒歩で向かえる宿泊拠点を優先しています。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-ibaraki-auditorium-9f"
            ? {
                postalCode: "310-8555",
                address: "茨城県水戸市笠原町978番6",
                nearestStations: ["JR常磐線・水郡線 水戸駅"],
                officialUrl:
                  "https://www.pref.ibaraki.jp/bugai/koho/kenmin/info/divishion/index6.html",
                officialUrlLabel: "茨城県庁 公式アクセス",
                accessNote:
                  "茨城県から出願する受験者の2027年1月25日（月）の学力試験会場です。受付は8:20〜8:40、試験は9:00〜14:10です。茨城県庁公式は、JR水戸駅南口から県庁舎への直行バスで15〜20分と案内していますが、2027年1月のダイヤは未公表です。会場は県庁舎9階の講堂まで公表され、施設資料では可動席・定員375人の講堂と案内されていますが、受付位置、受験生入口、利用するエレベーター、座席は未公表です。翌1月26日（火）の面接は同じ県庁舎の11階1101共用会議室という別会場のため、9階講堂と取り違えないでください。来庁者駐車場の通常利用時間や一般来庁者用の入口を試験日の開場・指定動線とみなさず、受験票、茨城県から交付される案内、当日掲示を確認してください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-ibaraki-meeting-1101"
            ? {
                postalCode: "310-8555",
                address: "茨城県水戸市笠原町978番6",
                nearestStations: ["JR常磐線・水郡線 水戸駅"],
                officialUrl:
                  "https://www.pref.ibaraki.jp/bugai/koho/kenmin/info/divishion/sannomaru.html",
                officialUrlLabel: "茨城県庁 公式フロア案内",
                accessNote:
                  "茨城県から出願し、前日の学力試験に及第した受験者の2027年1月26日（火）の面接会場です。受付は9:00〜9:20、面接は10:00〜16:00のうち茨城県が指定する時間です。茨城県庁公式フロア案内は11階に1101共用会議室があることを示し、施設資料は同室の定員を36人と案内しています。JR水戸駅南口から県庁舎への直行バスは公式15〜20分ですが、2027年1月のダイヤは未公表です。面接の受付位置、受験生入口、利用するエレベーター、待機場所は未公表です。前日1月25日（月）の学力試験は同じ県庁舎の9階講堂という別会場のため、11階1101共用会議室と取り違えないでください。11階アトリウムや一般来庁者用の入口を面接の受付・指定動線とみなさず、受験票、茨城県から交付される案内、当日掲示を確認してください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-tochigi-prefectural-office"
            ? {
                postalCode: "320-8501",
                address: "栃木県宇都宮市塙田1丁目1番20号",
                nearestStations: [
                  "JR宇都宮線・東北新幹線 宇都宮駅",
                  "東武宇都宮線 東武宇都宮駅",
                ],
                officialUrl:
                  "https://www.pref.tochigi.lg.jp/b06/system/gaido/annai/access.html",
                officialUrlLabel: "栃木県庁 公式アクセス",
                accessNote:
                  "栃木県から出願する受験者の2027年1月25日（月）の学力試験と、学力試験に及第した受験者の翌1月26日（火）の面接に使われる会場です。学力試験は受付8:20〜8:40、試験9:00〜14:10、面接は受付9:00〜9:20、10:00〜16:00のうち栃木県が指定する時間です。県庁公式は、JR宇都宮駅西口の1・2・6・7・11・12・13番乗り場から県庁前停留所へ進み下車後徒歩5分、または38番乗り場から栃木県庁舎前停留所へ進み下車後徒歩0分と案内しています。東武宇都宮駅東口からは徒歩約12分です。2027年1月のバスダイヤは未公表です。県庁敷地には本館、東館、北別館、研修館等と複数の会議室・講堂がありますが、試験で使う棟・階・室、受付位置、受験生入口は未公表です。一般来庁者向けの入口、駐車場利用時間、特定の講堂を試験日の指定動線・会場とみなさず、受験票、栃木県から交付される案内、当日掲示を確認してください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-gunma-meeting-291"
            ? {
                postalCode: "371-8570",
                address: "群馬県前橋市大手町1丁目1番1号",
                nearestStations: [
                  "JR両毛線 前橋駅",
                  "JR上越線・両毛線 新前橋駅",
                  "上毛電気鉄道 中央前橋駅",
                ],
                officialUrl: "https://www.pref.gunma.jp/page/1023.html",
                officialUrlLabel: "群馬県庁 公式フロア案内・利用時間",
                accessNote:
                  "群馬県から出願する受験者の2027年1月25日（月）の学力試験会場です。受付は8:20〜8:40、試験は9:00〜14:10です。群馬県庁公式フロア案内は291会議室が本庁舎29階にあることを示しています。県庁公式はJR前橋駅からバス約6分、新前橋駅・中央前橋駅からバス約7分と案内していますが、2027年1月25日のダイヤは未公表です。県庁の通常開庁は平日8:30からで、試験受付8:20開始より遅いため、一般来庁者向けの開庁時刻・入口を試験日の入館条件に転用せず、群馬県から交付される試験専用案内を必ず確認してください。29階291会議室までは公表済みですが、試験当日の受付位置、受験生入口、利用するエレベーター、待機場所は未公表です。翌1月26日（火）の面接は同じ29階の293会議室という別会場のため取り違えないでください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-gunma-meeting-293"
            ? {
                postalCode: "371-8570",
                address: "群馬県前橋市大手町1丁目1番1号",
                nearestStations: [
                  "JR両毛線 前橋駅",
                  "JR上越線・両毛線 新前橋駅",
                  "上毛電気鉄道 中央前橋駅",
                ],
                officialUrl: "https://www.pref.gunma.jp/page/1023.html",
                officialUrlLabel: "群馬県庁 公式フロア案内・利用時間",
                accessNote:
                  "群馬県から出願し、前日の学力試験に及第した受験者の2027年1月26日（火）の面接会場です。受付は9:00〜9:20、面接は10:00〜16:00のうち群馬県が指定する時間です。群馬県庁公式フロア案内は293会議室が本庁舎29階にあることを示しています。県庁公式はJR前橋駅からバス約6分、新前橋駅・中央前橋駅からバス約7分と案内していますが、2027年1月26日のダイヤは未公表です。29階293会議室までは公表済みですが、試験当日の受付位置、受験生入口、利用するエレベーター、待機場所は未公表です。前日1月25日（月）の学力試験は同じ29階の291会議室という別会場のため取り違えないでください。通常開庁時刻や一般来庁者向けの入口を面接日の指定動線とみなさず、受験票、群馬県から交付される案内、当日掲示を確認してください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-saitama-education-hall"
            ? {
                postalCode: "330-0063",
                address: "埼玉県さいたま市浦和区高砂3丁目12番24号",
                nearestStations: ["JR京浜東北線・宇都宮線・高崎線 浦和駅"],
                officialUrl: "https://stib.jp/convention/conventions/271/",
                officialUrlLabel: "さいたま観光国際協会 公式施設案内",
                accessNote:
                  "埼玉県から出願する受験者の2027年1月25日（月）の学力試験会場です。受付は8:20〜8:40、試験は9:00〜14:10です。さいたま観光国際協会の施設案内は、JR浦和駅西口から徒歩10分、会議室12室、通常開館9:00〜21:00と案内しています。通常開館9:00は試験受付8:20開始より遅いため、一般利用者向けの開館時刻・入口を試験日の入館条件に転用せず、埼玉県から交付される試験専用案内を必ず確認してください。試験で使う階・室、受付位置、受験生入口、待機場所は未公表です。別の催事資料に掲載された201会議室を入試会場とみなさないでください。翌1月26日（火）の面接は埼玉県総合医局機構地域医療教育センター（埼玉県立小児医療センター南玄関8階）という別会場のため取り違えないでください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-saitama-regional-medical-education-center"
            ? {
                postalCode: "330-8777",
                address:
                  "埼玉県さいたま市中央区新都心1番地2 埼玉県立小児医療センター南玄関側8階",
                nearestStations: [
                  "JR京浜東北線・宇都宮線・高崎線 さいたま新都心駅",
                  "JR埼京線 北与野駅",
                ],
                officialUrl: "https://kobaton-med.jp/educationcenter/",
                officialUrlLabel: "地域医療教育センター 公式アクセス・利用時間",
                accessNote:
                  "埼玉県から出願し、前日の学力試験に及第した受験者の2027年1月26日（火）の面接会場です。受付は9:00〜9:20、面接は10:00〜16:00のうち埼玉県が指定する時間です。地域医療教育センター公式は、埼玉県立小児医療センター南玄関（ホテルブリランテ武蔵野側）からエレベーターで8階へ上がり、病院正面玄関からは入れないと案内しています。JRさいたま新都心駅から徒歩5分、JR北与野駅から徒歩6分です。南玄関側8階までは公表済みですが、使用する研修室、試験当日の受付位置、待機場所は未公表です。通常の施設利用時間は平日9:00〜21:00ですが、これを面接日の入館方法・受付場所の根拠にせず、受験票、埼玉県から交付される案内、当日掲示を確認してください。前日1月25日（月）の学力試験は浦和の埼玉教育会館という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-chiba-plaza-nanohana"
            ? {
                postalCode: "260-0854",
                address: "千葉県千葉市中央区長洲1丁目8番1号",
                nearestStations: [
                  "千葉都市モノレール1号線 県庁前駅",
                  "JR内房線・外房線 本千葉駅",
                  "京成千葉線・千原線 千葉中央駅",
                ],
                officialUrl: "https://www.hotelplaza-nanohana.com/access/",
                officialUrlLabel: "ホテルプラザ菜の花 公式アクセス",
                accessNote:
                  "千葉県から出願する受験者の2027年1月25日（月）の学力試験と、これに及第した受験者の翌1月26日（火）の面接に共通する会場です。学力試験は受付8:20〜8:40、試験9:00〜14:10、面接は受付9:00〜9:20、10:00〜16:00のうち千葉県が指定する時間です。ホテル公式は千葉都市モノレール県庁前駅から徒歩1分、JR本千葉駅から徒歩3分と案内し、千葉県の公的会場図は京成千葉中央駅から徒歩約15分と案内しています。自治医科大学の2027年度募集要項は施設名と住所までを公表していますが、学力・面接それぞれの使用階・会議室、受付位置、受験生入口、待機場所は未公表です。ホテル公式に掲載される大会議室「菜の花」などを入試会場とみなさず、受験票、千葉県から交付される試験専用案内、当日掲示を確認してください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-tokyo-todofuken-kaikan"
            ? {
                postalCode: "102-0093",
                address: "東京都千代田区平河町2丁目6番3号",
                nearestStations: [
                  "東京メトロ有楽町線・半蔵門線・南北線 永田町駅",
                  "東京メトロ銀座線・丸ノ内線 赤坂見附駅",
                ],
                officialUrl: "https://www.tkai.jp/information/access.html",
                officialUrlLabel: "都道府県会館 公式アクセス",
                accessNote:
                  "東京都から出願する受験者の2027年1月25日（月）の学力試験と、これに及第した受験者の翌1月26日（火）の面接に共通する会場です。学力試験は受付8:20〜8:40、試験9:00〜14:10、面接は受付9:00〜9:20、10:10〜16:00のうち東京都が指定する時間です。都道府県会館公式は、有楽町線・半蔵門線の永田町駅5番出口および南北線の同駅9番b出口から地下連絡通路を経て徒歩約1分、赤坂見附駅D番出口から徒歩約5分と案内しています。これらは一般来館者向け動線であり、2027年入試の使用階・会議室、受付位置、受験生入口、待機場所は未公表です。地下連絡通路や一般出入口を試験指定入口とみなさず、受験票、東京都から交付される試験専用案内、当日掲示を確認してください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-kanagawa-workpia-yokohama"
            ? {
                postalCode: "231-0023",
                address: "神奈川県横浜市中区山下町24番地1",
                nearestStations: [
                  "みなとみらい線 日本大通り駅",
                  "JR京浜東北・根岸線 関内駅",
                  "JR京浜東北・根岸線 石川町駅",
                ],
                officialUrl:
                  "https://business.yokohamajapan.com/mice/ja/plan/venues/detail/?venue_id=425",
                officialUrlLabel: "横浜市観光協会 公式施設案内",
                accessNote:
                  "神奈川県から出願する受験者の2027年1月25日（月）の学力試験会場です。受付は8:20〜8:40、試験は9:00〜14:10です。横浜市観光協会の公式施設案内は、みなとみらい線日本大通り駅から徒歩5分、JR関内駅・石川町駅および市営地下鉄関内駅から徒歩15分と案内しています。ワークピア横浜には大小10会場がありますが、試験で使う階・室、受付位置、受験生入口、待機場所は未公表です。「おしどり」「くじゃく」など施設公式に掲載される一般会議室名を入試会場とみなさず、受験票、神奈川県から交付される試験専用案内、当日掲示を確認してください。翌1月26日（火）の面接は神奈川県庁新庁舎5階会議室という別会場のため取り違えないでください。施設の通常営業時間や一般来館者用入口を試験日の開場・指定入口に転用しないでください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-kanagawa-prefectural-office-new-5f"
            ? {
                postalCode: "231-8588",
                address: "神奈川県横浜市中区日本大通1",
                nearestStations: [
                  "みなとみらい線 日本大通り駅",
                  "JR京浜東北・根岸線・横浜市営地下鉄ブルーライン 関内駅",
                ],
                officialUrl: "https://www.pref.kanagawa.jp/access/new-building.html",
                officialUrlLabel: "神奈川県庁 公式新庁舎案内",
                accessNote:
                  "神奈川県から出願し、前日の学力試験に及第した受験者の2027年1月26日（火）の面接会場です。受付は9:00〜9:20、面接は10:00〜16:00のうち神奈川県が指定する時間です。自治医科大学の募集要項は新庁舎5階会議室までを公表していますが、会議室番号、受付位置、待機場所は未公表です。県庁公式は、みなとみらい線日本大通り駅県庁口出口からすぐ、JR・市営地下鉄関内駅から徒歩約10分と案内しています。通常来庁者は新庁舎の1か所の出入口でQR入庁証を発券してセキュリティゲートを通りますが、これを入試当日の受験生入口・受付手順とみなさず、受験票、神奈川県から交付される試験専用案内、当日掲示を優先してください。前日1月25日（月）の学力試験はワークピア横浜という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-niigata-jichikaikan"
            ? {
                postalCode: "950-0965",
                address: "新潟県新潟市中央区新光町4番地1",
                nearestStations: [
                  "新潟交通 C1県庁線 県庁停留所",
                  "新潟交通 C1県庁線 県庁前停留所",
                  "JR越後線 関屋駅",
                ],
                officialUrl: "https://ngtsogo.jp/facility/",
                officialUrlLabel: "新潟県自治会館 公式施設案内",
                accessNote:
                  "新潟県から出願する受験者の2027年1月25日（月）の学力試験と、これに及第した受験者の翌1月26日（火）の面接に共通する会場です。学力試験は受付8:20〜8:40、試験9:00〜14:10、面接は受付9:00〜9:20、10:00〜16:00のうち新潟県が指定する時間です。会館を運営する新潟県市町村総合事務組合の公式会場案内は、新潟交通の県庁・県庁前停留所、またはJR越後線関屋駅から徒歩約22分と案内しています。新潟交通の現行C1県庁線は新潟駅と県庁・県庁前を結びますが、2027年1月25日・26日のダイヤは未公表です。自治会館は本館と別館からなり複数の会議室がありますが、2027年入試の使用棟・階・室、受付位置、受験生入口、待機場所は未公表です。2026年度の別の試験資料に掲載された201会議室を2027年度へ流用せず、受験票、新潟県から交付される試験専用案内、当日掲示を確認してください。近隣の新潟自治労会館（新光町6番地7）とは別施設です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-toyama-kenminkaikan"
            ? {
                postalCode: "930-0006",
                address: "富山県富山市新総曲輪4番18号",
                nearestStations: [
                  "JR北陸新幹線・高山本線 富山駅南口",
                  "あいの風とやま鉄道 富山駅南口",
                  "富山地方鉄道 電鉄富山駅",
                  "富山地方鉄道バス 富山市役所前停留所",
                ],
                officialUrl:
                  "https://www.bunka-toyama.jp/kenminkaikan/access-parking/index.html",
                officialUrlLabel: "富山県民会館 公式アクセス",
                accessNote:
                  "富山県から出願する受験者の2027年1月25日（月）の学力試験と、これに及第した受験者の翌1月26日（火）の面接に共通する会場です。学力試験は受付8:20〜8:40、試験9:00〜14:10、面接は受付9:00〜9:20、10:00〜16:00のうち富山県が指定する時間です。会館公式は、JR・あいの風とやま鉄道の富山駅南口と富山地方鉄道富山駅から徒歩10分、主要路線バスの富山市役所前停留所下車と案内しています。館内には地下1階から8階までホール・展示室・多数の会議室がありますが、2027年入試の使用階・室、受付位置、受験生入口、待機場所は未公表です。公式の通常開館時間は9:00ですが、学力試験の受付は8:20からのため、通常開館時刻や一般入口を試験日の開場・指定入口に転用せず、受験票、富山県から交付される試験専用案内、当日掲示を確認してください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-ishikawa-meeting-1105"
            ? {
                postalCode: "920-8580",
                address: "石川県金沢市鞍月1丁目1番地",
                nearestStations: [
                  "北陸鉄道バス 県庁前停留所",
                  "JR北陸新幹線・IRいしかわ鉄道 金沢駅金沢港口（西口）",
                ],
                officialUrl:
                  "https://www.pref.ishikawa.lg.jp/kanzai/sinkentyou/sinnkenntyousya/koutuu.html",
                officialUrlLabel: "石川県庁 公式交通案内",
                accessNote:
                  "石川県から出願する受験者の2027年1月25日（月）の学力試験会場です。受付は8:20〜8:40、試験は9:00〜14:10です。自治医科大学の2027年度募集要項は石川県庁行政庁舎11階1105会議室までを公表しています。県庁公式はJR金沢駅金沢港口（西口）から北陸鉄道バス約10分、県庁前停留所下車と案内していますが、2027年1月25日の確定ダイヤ・乗り場・積雪時運行は未公表です。受験生入口、受付位置、待機場所、入館手順は未公表のため、県庁前停留所、行政庁舎の一般入口、通常来庁者向け案内を試験指定とみなさず、受験票、石川県から交付される試験専用案内、当日掲示を確認してください。翌1月26日（火）の面接は同庁舎11階1103会議室という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-ishikawa-meeting-1103"
            ? {
                postalCode: "920-8580",
                address: "石川県金沢市鞍月1丁目1番地",
                nearestStations: [
                  "北陸鉄道バス 県庁前停留所",
                  "JR北陸新幹線・IRいしかわ鉄道 金沢駅金沢港口（西口）",
                ],
                officialUrl:
                  "https://www.pref.ishikawa.lg.jp/kanzai/sinkentyou/sinnkenntyousya/koutuu.html",
                officialUrlLabel: "石川県庁 公式交通案内",
                accessNote:
                  "石川県から出願し、前日の学力試験に及第した受験者の2027年1月26日（火）の面接会場です。受付は9:00〜9:20、面接は10:00〜16:00のうち石川県が指定する時間です。自治医科大学の2027年度募集要項は石川県庁行政庁舎11階1103会議室までを公表しています。県庁公式はJR金沢駅金沢港口（西口）から北陸鉄道バス約10分、県庁前停留所下車と案内していますが、2027年1月26日の確定ダイヤ・乗り場・積雪時運行は未公表です。受験生入口、受付位置、待機場所、入館手順は未公表のため、県庁前停留所、行政庁舎の一般入口、通常来庁者向け案内を試験指定とみなさず、受験票、石川県から交付される試験専用案内、当日掲示を確認してください。前日1月25日（月）の学力試験は同庁舎11階1105会議室という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-fukui-international-exchange"
            ? {
                postalCode: "910-0004",
                address: "福井県福井市宝永3丁目1番1号",
                nearestStations: [
                  "JR北陸新幹線・越美北線 福井駅",
                  "ハピラインふくい 福井駅",
                ],
                officialUrl:
                  "https://www.f-i-a.or.jp/ja/plaza/facilitys/facilitys/about/",
                officialUrlLabel: "福井県国際交流会館 公式施設案内",
                accessNote:
                  "福井県から出願する受験者の2027年1月25日（月）の学力試験会場です。受付は8:20〜8:40、試験は9:00〜14:10です。会館公式はJR福井駅から徒歩約15分、タクシー約5分と案内しています。会館は地下1階から地上3階まで多目的ホール、会議室、研修室などを備えますが、2027年入試の使用階・室、受付位置、受験生入口、待機場所は未公表です。通常開館は9:00で学力試験の受付開始より遅いため、通常開館時刻、公式写真の正面玄関、一般来館者向け案内を試験日の開場・指定入口とみなさず、受験票、福井県から交付される試験専用案内、当日掲示を確認してください。1月の積雪・凍結、信号待ち、館内移動を見込み、徒歩経路は前日に確認してください。翌1月26日（火）の面接は福井県庁2階中会議室という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-fukui-meeting-2f"
            ? {
                postalCode: "910-8580",
                address: "福井県福井市大手3丁目17番1号",
                nearestStations: [
                  "JR北陸新幹線・越美北線 福井駅西口",
                  "ハピラインふくい 福井駅西口",
                ],
                officialUrl:
                  "https://www.pref.fukui.lg.jp/doc/about/map.html",
                officialUrlLabel: "福井県庁 公式アクセス",
                accessNote:
                  "福井県から出願し、前日の学力試験に及第した受験者の2027年1月26日（火）の面接会場です。受付は9:00〜9:20、面接は10:00〜16:00のうち福井県が指定する時間です。自治医科大学の2027年度募集要項と福井県庁公式フロア案内で2階中会議室まで確認できます。県庁公式はJR福井駅西口からの徒歩経路を案内していますが、徒歩分数は公表していません。受験生入口、受付位置、待機場所、入庁手順は未公表です。通常の開庁時間、1階の総合案内・県庁ホール、一般来庁者向け入口を試験指定とみなさず、受験票、福井県から交付される試験専用案内、当日掲示を確認してください。1月の積雪・凍結、信号待ち、庁舎内移動を見込み、徒歩経路は前日に確認してください。前日1月25日（月）の学力試験は福井県国際交流会館という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-yamanashi-onshirin"
            ? {
                postalCode: "400-0031",
                address: "山梨県甲府市丸の内1丁目5番4号",
                nearestStations: [
                  "JR中央本線・身延線 甲府駅南口",
                ],
                officialUrl: "https://www.onshirin.or.jp/",
                officialUrlLabel: "恩賜林記念館 公式施設案内",
                accessNote:
                  "山梨県から出願する受験者の2027年1月25日（月）の学力試験と、学力試験に及第した受験者の1月26日（火）の面接会場です。学力試験は受付8:20〜8:40、試験9:00〜14:10、面接は受付9:00〜9:20、10:00〜16:00のうち山梨県が指定する時間です。山梨県の2026年度公式会場案内はJR甲府駅南口から徒歩約8分、階段を上り、県庁東の横断歩道を渡って門をくぐる経路を示しています。施設公式は大会議室と特別会議室を案内していますが、2027年入試の使用階・室、受付位置、受験生入口、待機場所は未公表です。通常は土・日・祝日を原則休館としていますが、両試験日は平日です。一般利用時の門・入口や他催事の2階大会議室を試験指定とみなさず、受験票、山梨県から交付される試験専用案内、当日掲示を確認してください。1月の積雪・凍結、階段、横断歩道、館内移動を見込み、経路は前日に確認してください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-nagano-jichikaikan"
            ? {
                postalCode: "380-0871",
                address: "長野県長野市大字西長野字加茂北143番地8",
                nearestStations: [
                  "アルピコ交通 41合同庁舎線 自治会館前停留所",
                  "JR北陸新幹線・信越本線・篠ノ井線・しなの鉄道北しなの線 長野駅善光寺口",
                ],
                officialUrl:
                  "https://unionnagano-map.resv.jp/reserve/res_plan_list.php?kind=main_plan&x=1648181137",
                officialUrlLabel: "長野県自治会館 公式会議室案内",
                accessNote:
                  "長野県から出願する受験者の2027年1月25日（月）の学力試験会場です。受付は8:20〜8:40、試験は9:00〜14:10です。ながの観光コンベンションビューローはJR長野駅からバス約10分、徒歩約30分と案内し、アルピコ交通の41合同庁舎線は長野駅4番のりばから自治会館まで平日に運行しています。ただし2027年1月25日の確定ダイヤ・乗り場・積雪時運行は未公表です。会館公式は大会議室、第一・第二特別会議室、小会議室を案内していますが、2027年入試の使用階・室、受付位置、受験生入口、待機場所は未公表です。通常の施設受付は平日9:00開始で学力試験受付より遅いため、通常受付時刻、一般利用時の入口、小会議室側の駐車場入口を試験日の開場・指定入口とみなさず、受験票、長野県から交付される試験専用案内、当日掲示を確認してください。翌1月26日（火）の面接は長野県庁という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-nagano-prefectural-office"
            ? {
                postalCode: "380-8570",
                address: "長野県長野市大字南長野字幅下692番地2",
                nearestStations: [
                  "アルピコ交通 県庁前停留所",
                  "JR北陸新幹線・信越本線・篠ノ井線・しなの鉄道北しなの線 長野駅善光寺口",
                ],
                officialUrl:
                  "https://www.pref.nagano.lg.jp/zaikatsu/kensei/gaiyo/kotsu/access.html",
                officialUrlLabel: "長野県庁 公式アクセス",
                accessNote:
                  "長野県から出願し、前日の学力試験に及第した受験者の2027年1月26日（火）の面接会場です。受付は9:00〜9:20、面接は10:00〜16:00のうち長野県が指定する時間です。長野県公式はJR長野駅から徒歩約15分、バス約6分と案内していますが、2027年1月26日の確定ダイヤ・系統・乗り場・積雪時運行は未公表です。県庁は本館棟、西庁舎、議会棟などに分かれますが、自治医科大学の2027年度募集要項は試験棟・階・室、受付位置、受験生入口、待機場所を公表していません。通常開庁は8:30〜17:15で面接受付開始前ですが、通常開庁時刻、本館1階の受付案内・県民ホール、一般来庁者向け入口を試験指定とみなさず、受験票、長野県から交付される試験専用案内、当日掲示を確認してください。前日1月25日（月）の学力試験は長野県自治会館という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-gifu-meeting-301-302"
            ? {
                postalCode: "500-8570",
                address: "岐阜県岐阜市薮田南2丁目1番1号",
                nearestStations: [
                  "岐阜バス 県庁停留所",
                  "JR東海道本線・高山本線 岐阜駅",
                  "名鉄名古屋本線・各務原線 名鉄岐阜駅",
                ],
                officialUrl:
                  "https://www.pref.gifu.lg.jp/site/ken-shisetsu/2965.html",
                officialUrlLabel: "岐阜県庁 公式庁舎・アクセス案内",
                accessNote:
                  "岐阜県から出願する受験者の2027年1月25日（月）の学力試験会場です。受付は8:20〜8:40、試験は9:00〜14:10で、自治医科大学の2027年度募集要項は岐阜県庁3階の共用会議室301・302までを公表しています。県庁公式はJR岐阜駅・名鉄岐阜駅から岐阜バス加納島線で約20分、県庁停留所下車と案内し、岐阜バス公式はJR岐阜5番のりば・名鉄岐阜1番のりばからE31・E32・W32系統を案内しています。ただし2027年1月25日の確定ダイヤ・道路状況・臨時運行は未公表です。受験生入口、受付位置、待機列、入庁手順は未公表のため、通常開庁8:30、一般来庁者向けの入庁証手続・入口・3階経路を試験指定とみなさず、受験票、岐阜県から交付される試験専用案内、当日掲示を確認してください。翌1月26日（火）の面接は同庁舎の共用会議室301のみを使う別会場扱いです。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-gifu-meeting-301"
            ? {
                postalCode: "500-8570",
                address: "岐阜県岐阜市薮田南2丁目1番1号",
                nearestStations: [
                  "岐阜バス 県庁停留所",
                  "JR東海道本線・高山本線 岐阜駅",
                  "名鉄名古屋本線・各務原線 名鉄岐阜駅",
                ],
                officialUrl:
                  "https://www.pref.gifu.lg.jp/site/ken-shisetsu/2965.html",
                officialUrlLabel: "岐阜県庁 公式庁舎・アクセス案内",
                accessNote:
                  "岐阜県から出願し、前日の学力試験に及第した受験者の2027年1月26日（火）の面接会場です。受付は9:00〜9:20、面接は10:00〜16:00のうち岐阜県が指定する時間で、自治医科大学の2027年度募集要項は岐阜県庁3階の共用会議室301までを公表しています。県庁公式はJR岐阜駅・名鉄岐阜駅から岐阜バス加納島線で約20分、県庁停留所下車と案内し、岐阜バス公式はJR岐阜5番のりば・名鉄岐阜1番のりばからE31・E32・W32系統を案内しています。ただし2027年1月26日の確定ダイヤ・道路状況・臨時運行は未公表です。受験生入口、受付位置、待機列、入庁手順は未公表のため、通常開庁8:30、一般来庁者向けの入庁証手続・入口・3階経路を試験指定とみなさず、受験票、岐阜県から交付される試験専用案内、当日掲示を確認してください。前日1月25日（月）の学力試験は同庁舎の共用会議室301・302という別会場扱いです。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-shizuoka-prefectural-office"
            ? {
                postalCode: "420-8601",
                address: "静岡県静岡市葵区追手町9番6号",
                nearestStations: [
                  "JR東海道新幹線・東海道本線 静岡駅北口",
                ],
                officialUrl:
                  "https://www.pref.shizuoka.jp/kensei/introduction/kenchosha/1002011/1009017.html",
                officialUrlLabel: "静岡県庁 公式アクセス・庁舎案内",
                accessNote:
                  "静岡県から出願する受験者の2027年1月25日（月）の学力試験と、学力試験に及第した受験者の翌1月26日（火）の面接は、いずれも自治医科大学の2027年度募集要項で「静岡県庁」と公表されています。学力試験は受付8:20〜8:40・試験9:00〜14:10、面接は受付9:00〜9:20・10:00〜16:00のうち静岡県が指定する時間です。静岡県公式はJR静岡駅から徒歩10分と案内しています。県庁は本館・東館・西館・別館に分かれますが、募集要項は両日とも試験棟・階・室、受付位置、受験生入口、待機場所を公表していません。県庁公式の各庁舎案内、一般来庁者向け案内所・県民サービスセンター、通常の庁舎入口を試験指定とみなさず、受験票、静岡県から交付される試験専用案内、当日掲示を確認してください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-aichi-winc-aichi"
            ? {
                postalCode: "450-0002",
                address: "愛知県名古屋市中村区名駅4丁目4番38号",
                nearestStations: [
                  "JR東海道新幹線・東海道本線・中央本線・関西本線 名古屋駅桜通口",
                  "名古屋駅 ユニモール地下街5番出口",
                ],
                officialUrl: "https://www.winc-aichi.jp/access/",
                officialUrlLabel: "ウインクあいち 公式アクセス・施設案内",
                accessNote:
                  "愛知県から出願する受験者の2027年1月25日（月）の学力試験と、学力試験に及第した受験者の翌1月26日（火）の面接は、いずれも自治医科大学の2027年度募集要項で「愛知県産業労働センター（ウインクあいち）」と公表されています。学力試験は受付8:20〜8:40・試験9:00〜14:10、面接は受付9:00〜9:20・10:00〜16:00のうち愛知県が指定する時間です。施設公式はJR名古屋駅桜通口から徒歩5分、ユニモール地下街5番出口から徒歩2分と案内しています。施設は地下3階〜地上18階にホール、展示場、会議室などを持ちますが、募集要項は両日とも使用階・室名、受付位置、受験生入口、待機場所を公表していません。施設公式の受付時間9:00〜20:00、1階エントランスホール、一般来館者向け受付を試験指定とみなさず、受験票、愛知県から交付される試験専用案内、当日掲示を確認してください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-mie-workers-welfare"
            ? {
                postalCode: "514-0004",
                address: "三重県津市栄町1丁目891番地",
                nearestStations: [
                  "近鉄名古屋線 津駅東口",
                  "JR紀勢本線・伊勢鉄道伊勢線 津駅東口",
                ],
                officialUrl:
                  "https://www.mie-kinfukukyo.or.jp/kaikan/hall.php",
                officialUrlLabel: "三重県勤労者福祉会館 公式施設・アクセス案内",
                accessNote:
                  "三重県から出願する受験者の2027年1月25日（月）の学力試験と、学力試験に及第した受験者の翌1月26日（火）の面接は、いずれも自治医科大学の2027年度募集要項で「三重県勤労者福祉会館」と公表されています。学力試験は受付8:20〜8:40・試験9:00〜14:10、面接は受付9:00〜9:20・10:00〜16:00のうち三重県が指定する時間です。三重県公式はJR紀勢本線・近鉄名古屋線の津駅から徒歩約10分と案内しています。会館は地階から6階に会議室や県関係機関を持ちますが、募集要項は両日とも使用階・室名、受付位置、受験生入口、待機場所を公表していません。過年度・他催事の会場、6階の講堂・研修室、1階管理事務所、通常の会館入口を試験指定とみなさず、受験票、三重県から交付される試験専用案内、当日掲示を確認してください。駐車場はおもいやり駐車場3台のみのため、会館公式の案内どおり公共交通機関を基本にしてください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-shiga-east-7f"
            ? {
                postalCode: "520-8577",
                address: "滋賀県大津市京町4丁目1番1号",
                nearestStations: [
                  "JR琵琶湖線 大津駅北口（びわこ口）",
                  "京阪石山坂本線 島ノ関駅",
                ],
                officialUrl:
                  "https://www.pref.shiga.lg.jp/kensei/gaiyou/annai/300434.html",
                officialUrlLabel: "滋賀県庁 公式アクセス・庁舎案内",
                accessNote:
                  "滋賀県から出願する受験者の2027年1月25日（月）の学力試験会場です。受付は8:20〜8:40、試験は9:00〜14:10で、自治医科大学の2027年度募集要項は滋賀県庁東館7階大会議室までを公表しています。滋賀県公式も東館7階を大会議室と案内し、JR琵琶湖線の大津駅から東へ徒歩5分、京阪石山坂本線の島ノ関駅から南南西へ徒歩7分としています。ただし受験生入口、受付位置、待機列、入庁手順は未公表です。県庁の通常開庁8:30は学力試験の受付開始8:20より遅いため、通常開庁時刻、一般来庁者向け入口・総合案内、通常の東館7階経路を試験日の開場・指定動線とみなさず、受験票、滋賀県から交付される試験専用案内、当日掲示を確認してください。翌1月26日（火）の面接はコラボしが21の3階中会議室2という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-shiga-collab-3f"
            ? {
                postalCode: "520-0806",
                address: "滋賀県大津市打出浜2番1号",
                nearestStations: [
                  "京阪石山坂本線 石場駅",
                  "JR琵琶湖線 膳所駅",
                ],
                officialUrl:
                  "https://www.shigaplaza.or.jp/service/bizbase-collabo21-top/bizbase-collabo21-access/",
                officialUrlLabel: "コラボしが21 公式施設・アクセス案内",
                accessNote:
                  "滋賀県から出願し、前日の学力試験に及第した受験者の2027年1月26日（火）の面接会場です。受付は9:00〜9:20、面接は10:00〜16:00のうち滋賀県が指定する時間で、自治医科大学の2027年度募集要項はコラボしが21の3階中会議室2までを公表しています。施設運営者の公式案内は京阪石山坂本線の石場駅から徒歩3分とし、滋賀県公式はJR琵琶湖線の膳所駅から徒歩15分と案内しています。ただし受験生入口、受付位置、待機場所、入館手順は未公表です。施設内のBiz Baseは1階の一般利用施設で、貸会議室の通常利用時間や一般来館者向け入口・受付を試験指定とみなさず、受験票、滋賀県から交付される試験専用案内、当日掲示を確認してください。前日の学力試験は滋賀県庁東館7階大会議室という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-kyoto-medical-association"
            ? {
                postalCode: "604-8585",
                address: "京都府京都市中京区西ノ京東栂尾町6番地",
                nearestStations: [
                  "JR嵯峨野線 二条駅東側出口",
                  "京都市営地下鉄東西線 二条駅JR連絡通路出口",
                ],
                officialUrl: "https://www.kyoto.med.or.jp/business/access",
                officialUrlLabel: "京都府医師会館 公式案内・アクセス",
                accessNote:
                  "京都府から出願する受験者の2027年1月25日（月）の学力試験会場です。受付は8:20〜8:40、試験は9:00〜14:10で、自治医科大学の2027年度募集要項は会場を京都府医師会館と公表しています。京都府医師会公式はJR嵯峨野線の二条駅東側出口から南へすぐ、京都市営地下鉄東西線の二条駅からはJR連絡通路出口を経て同じ東側出口へ向かうと案内しています。ただし使用階・会議室、受験生入口、受付位置、待機場所、入館手順は未公表です。館内の3階会議室、2階ラウンジ、6階情報センターなど一般利用・他催事の施設や通常入口を試験指定とみなさず、受験票、京都府から交付される試験専用案内、当日掲示を確認してください。翌1月26日（火）の面接は京都府庁第3号館という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-kyoto-prefectural-office-building-3"
            ? {
                postalCode: "602-8570",
                address: "京都府京都市上京区下立売通新町西入薮ノ内町",
                nearestStations: [
                  "京都市営地下鉄烏丸線 丸太町駅",
                  "京都市バス 文化庁前・府庁前停留所",
                ],
                officialUrl: "https://www.pref.kyoto.jp/chosha.html",
                officialUrlLabel: "京都府庁 公式庁舎・アクセス案内",
                accessNote:
                  "京都府から出願し、前日の学力試験に及第した受験者の2027年1月26日（火）の面接会場です。受付は9:00〜9:20、面接は10:00〜16:00のうち京都府が指定する時間で、自治医科大学の2027年度募集要項は京都府庁第3号館までを公表しています。京都府公式は京都市営地下鉄烏丸線の丸太町駅から徒歩10分、京都市バスの文化庁前・府庁前停留所から徒歩5分と案内しています。京都府公式の現行庁舎案内では第3号館の1〜3階に文化庁、4〜6階に教育庁、2階に人事委員会が入りますが、これらは通常の庁舎利用情報で、面接の使用階・室名を示すものではありません。受験生入口、受付位置、待機場所、入庁手順も未公表です。一般来庁者向けの門・総合案内・通常業務時間や現行の各階入居部署を試験指定とみなさず、受験票、京都府から交付される試験専用案内、当日掲示を確認してください。前日の学力試験は京都府医師会館という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-osaka-primrose"
            ? {
                postalCode: "540-0008",
                address: "大阪府大阪市中央区大手前3丁目1番43号",
                nearestStations: [
                  "Osaka Metro谷町線・中央線 谷町四丁目駅1-A・1-B出口",
                ],
                officialUrl: "https://www.primrose-osaka.com/access/",
                officialUrlLabel: "プリムローズ大阪 公式アクセス・施設案内",
                accessNote:
                  "大阪府から出願する受験者の2027年1月25日（月）の学力試験と、これに及第した受験者の翌1月26日（火）の面接に共通する会場です。学力試験は受付8:20〜8:40、試験9:00〜14:10、面接は受付9:00〜9:20、10:00〜16:00のうち大阪府が指定する時間です。施設公式はOsaka Metro谷町線・中央線の谷町四丁目駅1-A・1-B出口から徒歩約1分と案内しています。施設は宿泊客室26室を備えるホテルで、1〜4階に宴会・会議室がありますが、2027年入試の使用階・室、受付位置、受験生入口、待機場所は未公表です。通常の2階正面玄関、宿泊フロント、各宴会場、一般利用時間を試験指定とみなさず、受験票、大阪府から交付される試験専用案内、当日掲示を確認してください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-hyogo-nosai"
            ? {
                postalCode: "650-0011",
                address: "兵庫県神戸市中央区下山手通4丁目15番3号",
                nearestStations: [
                  "神戸市営地下鉄西神・山手線 県庁前駅",
                  "JR神戸線・阪神本線 元町駅",
                ],
                officialUrl: "https://www.nosai-hyogo.or.jp/i4/",
                officialUrlLabel: "NOSAIひょうご 公式会館・会議室案内",
                accessNote:
                  "兵庫県から出願する受験者の2027年1月25日（月）の学力試験会場です。受付は8:20〜8:40、試験は9:00〜14:10で、自治医科大学の2027年度募集要項は会場を兵庫県農業共済会館と公表しています。会館内の公式入居団体は神戸市営地下鉄西神・山手線の県庁前駅から徒歩2分、JR神戸線・阪神本線の元町駅から徒歩5分と案内しています。NOSAIひょうご公式は7階大会議室と4階第1〜3会議室・和室を案内していますが、募集要項は使用階・室名、受付位置、受験生入口、待機場所を公表していません。会議室の通常受付は平日9:00開始で学力試験の受付8:20より遅いため、通常受付時間、一般来館者向け入口、7階・4階の各会議室を試験指定とみなさず、受験票、兵庫県から交付される試験専用案内、当日掲示を確認してください。翌1月26日（火）の面接は、ひょうご共済会館という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-hyogo-kyosai"
            ? {
                postalCode: "650-0004",
                address: "兵庫県神戸市中央区中山手通4丁目17番13号",
                nearestStations: [
                  "神戸市営地下鉄西神・山手線 県庁前駅",
                  "JR神戸線・阪神本線 元町駅",
                ],
                officialUrl: "https://www.h-kyosai.or.jp/hk-kaikan/",
                officialUrlLabel: "ひょうご共済会館 公式施設・アクセス案内",
                accessNote:
                  "兵庫県から出願し、前日の学力試験に及第した受験者の2027年1月26日（火）の面接会場です。受付は9:00〜9:20、面接は10:00〜16:00のうち兵庫県が指定する時間で、自治医科大学の2027年度募集要項は会場をひょうご共済会館と公表しています。施設公式は神戸市営地下鉄西神・山手線の県庁前駅から徒歩5分、JR神戸線・阪神本線の元町駅から徒歩10分と案内しています。施設は宿泊客室のほか、定員108名のツツジなど複数の会議室・宴会場を備えますが、募集要項は面接の使用階・室名、受付位置、受験生入口、待機場所、宿泊者向け館内動線を公表していません。公式施設案内にある正面玄関、宿泊フロント、一般会議室、通常利用時間を面接指定とみなさず、受験票、兵庫県から交付される試験専用案内、当日掲示を確認してください。前日の学力試験は兵庫県農業共済会館という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-nara-nobotel"
            ? {
                postalCode: "630-8115",
                address: "奈良県奈良市大宮町7丁目1番45号",
                nearestStations: [
                  "近鉄奈良線 新大宮駅",
                  "奈良交通 奈良市庁前停留所",
                  "JR関西本線 奈良駅",
                ],
                officialUrl: "https://www.novotelnara.com/",
                officialUrlLabel: "ノボテル奈良 公式施設・アクセス案内",
                accessNote:
                  "奈良県から出願する受験者の2027年1月25日（月）の学力試験と、これに及第した受験者の翌1月26日（火）の面接に共通する会場です。学力試験は受付8:20〜8:40、試験9:00〜14:10、面接は受付9:00〜9:20、10:00〜16:00のうち奈良県が指定する時間です。施設公式は近鉄奈良線の新大宮駅から徒歩約8分、奈良交通の奈良市庁前停留所から徒歩1〜2分、JR奈良駅から徒歩約19分と案内しています。ホテルは264室の宿泊客室と宴会場Earth・Water、会議室Windを備えますが、自治医科大学の2027年度募集要項は試験の使用階・室名、受付位置、受験生入口、待機場所、宿泊者向け館内動線を公表していません。ホテル正面玄関、宿泊フロント、各宴会・会議室、通常利用時間を試験指定とみなさず、受験票、奈良県から交付される試験専用案内、当日掲示を確認してください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-wakayama-kenmin-bunka"
            ? {
                postalCode: "640-8269",
                address: "和歌山県和歌山市小松原通一丁目1番地",
                nearestStations: ["和歌山バス 県庁前停留所"],
                officialUrl: "https://www.wacaf.or.jp/culturehall/",
                officialUrlLabel: "和歌山県民文化会館 公式施設案内",
                accessNote:
                  "和歌山県から出願する受験者の2027年1月25日（月）の学力試験と、これに及第した受験者の翌1月26日（火）の面接に共通する会場です。学力試験は受付8:20〜8:40、試験9:00〜14:10、面接は受付9:00〜9:20、10:00〜16:00のうち和歌山県が指定する時間です。施設は和歌山県庁正門前にあり、県公式の現行案内では和歌山バス県庁前停留所から徒歩約4分です。地下1階・地上6階に大・小ホール、22会議室、4展示室、和室がありますが、自治医科大学の2027年度募集要項は使用階・室名、受付位置、受験生入口、待機場所を公表していません。施設の通常開館8:45は学力試験の受付8:20より遅いため、一般開館時刻、1階総合受付、正面玄関、各ホール・会議室を試験指定とみなさず、受験票、和歌山県から交付される試験専用案内、当日掲示を確認してください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-tottori-auditorium"
            ? {
                postalCode: "680-8570",
                address: "鳥取県鳥取市東町一丁目220番地",
                nearestStations: [
                  "JR山陰本線・因美線 鳥取駅",
                  "日本交通・日ノ丸自動車 県庁前停留所",
                  "日本交通・日ノ丸自動車 県庁日赤前停留所",
                ],
                officialUrl: "https://www.pref.tottori.lg.jp/9064.htm",
                officialUrlLabel: "鳥取県 公式本庁舎・アクセス案内",
                accessNote:
                  "鳥取県から出願する受験者の2027年1月25日（月）の学力試験会場です。受付は8:20〜8:40、試験は9:00〜14:10で、自治医科大学の2027年度募集要項は会場を鳥取県庁の『講堂ほか』と公表しています。県公式はJR鳥取駅から徒歩約20分、県庁前停留所からすぐ、県庁日赤前停留所から徒歩2〜3分と案内しています。現行の県公式情報で講堂は本庁舎1階と確認できますが、『ほか』に含まれる追加室、受付位置、受験生入口、待機場所、講堂への試験当日動線は未公表です。過去の別イベントが案内した裏玄関、本庁舎1階の一般受付、県民室、各一般窓口を2027年入試の指定入口・受付とみなさず、受験票、鳥取県から交付される試験専用案内、当日掲示を確認してください。翌1月26日（火）の面接は県議会棟3階の第15会議室ほかという別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-tottori-meeting-15"
            ? {
                postalCode: "680-8570",
                address: "鳥取県鳥取市東町一丁目220番地",
                nearestStations: [
                  "JR山陰本線・因美線 鳥取駅",
                  "日本交通・日ノ丸自動車 県庁前停留所",
                  "日本交通・日ノ丸自動車 県庁日赤前停留所",
                ],
                officialUrl: "https://www.pref.tottori.lg.jp/81443.htm",
                officialUrlLabel: "鳥取県 公式議会棟・議会棟別館案内",
                accessNote:
                  "鳥取県から出願し、2027年1月25日（月）の学力試験に及第した受験者が翌1月26日（火）に受ける面接会場です。受付は9:00〜9:20、面接は10:00〜16:00のうち鳥取県が指定する時間で、自治医科大学の2027年度募集要項は会場を鳥取県庁の『第15会議室（県議会棟3階）ほか』と公表しています。県公式は第15会議室を議会棟本館3階に掲載し、同階に第12〜14会議室と特別会議室も掲載していますが、募集要項の『ほか』に含まれる室、受付位置、受験生入口、待機場所、面接順は未公表です。県庁敷地内では本庁舎、第二庁舎、議会棟、議会棟別館を取り違えず、議会棟1階の一般案内、玄関ホール、衛視、一般来庁者向けの傍聴動線を入試指定とみなさないでください。受験票、鳥取県から交付される面接専用案内、当日掲示を確認してください。前日の学力試験は本庁舎1階の講堂ほかという別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-shimane-sunport-murakumo"
            ? {
                postalCode: "690-0887",
                address: "島根県松江市殿町369番地",
                nearestStations: [
                  "松江市営バス・一畑バス 県民会館前停留所",
                  "JR山陰本線 松江駅",
                ],
                officialUrl: "https://www.sunrapport-murakumo.com/",
                officialUrlLabel: "サンラポーむらくも 公式施設案内",
                accessNote:
                  "島根県から出願する受験者の2027年1月25日（月）の学力試験と、これに及第した受験者の翌1月26日（火）の面接に共通する会場です。学力試験は受付8:20〜8:40、試験9:00〜14:10、面接は受付9:00〜9:20、10:00〜16:00のうち島根県が指定する時間です。施設公式はJR松江駅2番バス乗場から県民会館前停留所まで約12分、同停留所下車すぐと案内し、館内2階に瑞雲、祥雲、彩雲、八雲、白雲、興雲などの会議・宴会場があることを確認できます。ただし自治医科大学の2027年度募集要項は使用階・室名、受付位置、受験生入口、待機場所、面接順を公表していません。会議室の一般利用案内や早朝料金区分、1階フロント・ラウンジ、正面玄関を試験指定とみなさず、受験票、島根県から交付される試験専用案内、当日掲示を確認してください。施設内には一般向け宿泊客室もありますが、客室から試験室までの館内動線・所要は未公表です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-okayama-convention-center"
            ? {
                postalCode: "700-0024",
                address: "岡山県岡山市北区駅元町14番1号",
                nearestStations: ["JR山陽本線・山陽新幹線 岡山駅"],
                officialUrl: "https://www.mamakari.net/access/",
                officialUrlLabel: "岡山コンベンションセンター 公式交通アクセス",
                accessNote:
                  "岡山県から出願する受験者の2027年1月25日（月）の学力試験と、これに及第した受験者の翌1月26日（火）の面接に共通する会場です。学力試験は受付8:20〜8:40、試験9:00〜14:10、面接は受付9:00〜9:20、10:00〜16:00のうち岡山県が指定する時間です。施設公式はJR岡山駅中央改札口から徒歩約3分と案内し、1階イベントホール、2階レセプションホール・201会議室・展示ホール、3階コンベンションホール・301・302会議室、4階401〜407会議室等を掲載しています。ただし自治医科大学の2027年度募集要項は使用階・ホール・会議室、受付位置、受験生入口、待機場所、面接順を公表していません。施設の通常受付時間9:00〜17:00、一般来館者用の入口・ロビー・管理事務室を試験日の開場・指定受付とみなさず、受験票、岡山県から交付される試験専用案内、当日掲示を確認してください。愛称のママカリフォーラムは同じ施設です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-hiroshima-mielparque"
            ? {
                postalCode: "730-0011",
                address: "広島県広島市中区基町6番36号",
                nearestStations: [
                  "広島電鉄 紙屋町西停留場",
                  "広島バスセンター",
                ],
                officialUrl: "https://www.mielparque.jp/hiroshima/",
                officialUrlLabel: "ホテルメルパルク広島 公式施設・交通アクセス",
                accessNote:
                  "広島県から出願する受験者の2027年1月25日（月）の学力試験と、これに及第した受験者の翌1月26日（火）の面接に共通する会場です。学力試験は受付8:20〜8:40、試験9:00〜14:10、面接は受付9:00〜9:20、10:00〜16:00のうち広島県が指定する時間です。施設公式は紙屋町西停留場と広島バスセンターから徒歩1分と案内し、館内に複数の宴会場・会議室があることを確認できます。ただし自治医科大学の2027年度募集要項は使用階・室名、受付位置、受験生入口、待機場所、面接順を公表していません。施設公式の一般フロアガイド、1階フロント、3階バスセンター連絡通路、宴会・会議の通常受付・営業時間を試験日の指定入口・開場・使用室とみなさず、受験票、広島県から交付される試験専用案内、当日掲示を確認してください。施設内には一般向け宿泊客室もありますが、客室から試験室までの館内動線・所要は未公表です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-yamaguchi-av-room"
            ? {
                postalCode: "753-8501",
                address: "山口県山口市滝町1番1号",
                nearestStations: [
                  "防長交通・中国JRバス 県庁前停留所",
                  "JR山口線 山口駅",
                ],
                officialUrl: "https://www.pref.yamaguchi.lg.jp/soshiki/4/12333.html",
                officialUrlLabel: "山口県 公式庁舎フロア案内",
                accessNote:
                  "山口県から出願する受験者の2027年1月25日（月）の学力試験会場です。受付は8:20〜8:40、試験は9:00〜14:10で、自治医科大学の2027年度募集要項は会場を山口県庁の『視聴覚室（1階）』と公表しています。県公式フロア案内は視聴覚室を本館高層棟1階に掲載し、県庁前停留所から県庁舎玄関まで約300mと案内しています。ただし試験日の受付位置、受験生入口、待機場所、視聴覚室までの指定動線は未公表です。低層棟1階の一般受付・正面玄関、本館高層棟の一般窓口、県政資料館連絡を試験指定とみなさず、受験票、山口県から交付される試験専用案内、当日掲示を確認してください。翌1月26日（火）の面接は低層棟4階の共用第2・第3会議室という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-yamaguchi-meeting-2-3"
            ? {
                postalCode: "753-8501",
                address: "山口県山口市滝町1番1号",
                nearestStations: [
                  "防長交通・中国JRバス 県庁前停留所",
                  "JR山口線 山口駅",
                ],
                officialUrl: "https://www.pref.yamaguchi.lg.jp/soshiki/4/12333.html",
                officialUrlLabel: "山口県 公式庁舎フロア案内",
                accessNote:
                  "山口県から出願し、2027年1月25日（月）の学力試験に及第した受験者が翌1月26日（火）に受ける面接会場です。受付は9:00〜9:20、面接は10:00〜16:00のうち山口県が指定する時間で、自治医科大学の2027年度募集要項は会場を山口県庁の『共用第2・第3会議室（4階）』と公表しています。県公式フロア案内は共用第1〜第5会議室を本館低層棟4階に掲載し、県庁前停留所から県庁舎玄関まで約300mと案内しています。ただし第2・第3会議室の使い分け、受付位置、受験生入口、待機場所、面接順、低層棟4階までの指定動線は未公表です。低層棟1階の一般受付・正面玄関、4階の正庁会議室や他の共用会議室を面接指定とみなさず、受験票、山口県から交付される面接専用案内、当日掲示を確認してください。前日の学力試験は本館高層棟1階の視聴覚室という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-tokushima-auditorium"
            ? {
                postalCode: "770-8570",
                address: "徳島県徳島市万代町1丁目1番地",
                nearestStations: [
                  "徳島バス・徳島市営バス 県庁前停留所",
                  "JR高徳線・牟岐線 徳島駅",
                ],
                officialUrl: "https://www.pref.tokushima.lg.jp/floormap/",
                officialUrlLabel: "徳島県 公式県庁内フロアマップ",
                accessNote:
                  "徳島県から出願する受験者の2027年1月25日（月）の学力試験会場です。受付は8:20〜8:40、試験は9:00〜14:10で、自治医科大学の2027年度募集要項は会場を徳島県庁の『講堂』と公表しています。県公式フロアマップは講堂を庁舎11階北側に掲載し、県公式アクセスはJR徳島駅から徒歩約20分、または県庁前停留所までバス約7分と案内しています。ただし試験日の受付位置、受験生入口、待機場所、11階講堂までの指定動線は未公表です。1階の県庁ふれあいセンター・一般窓口、展望者ロビー、食堂、会議室1107を試験指定とみなさず、受験票、徳島県から交付される試験専用案内、当日掲示を確認してください。翌1月26日（火）の面接は徳島県庁の会議室という別会場で、使用階・室名は公開募集要項では未公表です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-tokushima-meeting-room"
            ? {
                postalCode: "770-8570",
                address: "徳島県徳島市万代町1丁目1番地",
                nearestStations: [
                  "徳島バス・徳島市営バス 県庁前停留所",
                  "JR高徳線・牟岐線 徳島駅",
                ],
                officialUrl: "https://www.pref.tokushima.lg.jp/floormap/",
                officialUrlLabel: "徳島県 公式県庁内フロアマップ",
                accessNote:
                  "徳島県から出願し、2027年1月25日（月）の学力試験に及第した受験者が翌1月26日（火）に受ける面接会場です。受付は9:00〜9:20、面接は10:00〜16:00のうち徳島県が指定する時間で、自治医科大学の2027年度募集要項は会場を徳島県庁の『会議室』とのみ公表しています。県公式フロアマップには複数階に多数の会議室がありますが、面接の使用階・室名、受付位置、受験生入口、待機場所、面接順、指定動線は未公表です。1階の一般窓口、各階の大会議室・中会議室・番号付き会議室を面接会場と推定せず、受験票、徳島県から交付される面接専用案内、当日掲示を確認してください。前日の学力試験は11階講堂という別会場で、講堂や11階の一般施設を翌日の面接会場とみなさないでください。県公式アクセスはJR徳島駅から徒歩約20分、または県庁前停留所までバス約7分と案内しています。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-kagawa-north-3f"
            ? {
                postalCode: "760-8570",
                address: "香川県高松市番町4丁目1番10号",
                nearestStations: [
                  "ことでんバス 県庁・日赤前停留所",
                  "高松琴平電気鉄道 瓦町駅",
                  "JR予讃線・高徳線 高松駅",
                ],
                officialUrl: "https://www.pref.kagawa.lg.jp/kocho/shokai/kencho/accessmap.html",
                officialUrlLabel: "香川県 公式県庁アクセス案内",
                accessNote:
                  "香川県から出願する受験者の2027年1月25日（月）の学力試験会場です。受付は8:20〜8:40、試験は9:00〜14:10で、自治医科大学の2027年度募集要項は会場を香川県庁の『北館会議室（3階）』と公表しています。県公式資料には北館3階の303〜306会議室が現行の会議場所として掲載されていますが、試験で使う個別会議室番号、受付位置、受験生入口、待機場所、北館3階までの指定動線は未公表です。303〜306のいずれかを試験室と推定せず、受験票、香川県から交付される試験専用案内、当日掲示を確認してください。県公式アクセスはJR高松駅から徒歩約20分、または琴電瓦町駅から徒歩約10分と案内しています。翌1月26日（火）の面接は香川県庁本館12階の会議室という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-kagawa-main-12f"
            ? {
                postalCode: "760-8570",
                address: "香川県高松市番町4丁目1番10号",
                nearestStations: [
                  "ことでんバス 県庁・日赤前停留所",
                  "高松琴平電気鉄道 瓦町駅",
                  "JR予讃線・高徳線 高松駅",
                ],
                officialUrl: "https://www.pref.kagawa.lg.jp/kocho/shokai/kencho/haichizu.html",
                officialUrlLabel: "香川県 公式県庁内フロア案内",
                accessNote:
                  "香川県から出願し、2027年1月25日（月）の学力試験に及第した受験者が翌1月26日（火）に受ける面接会場です。受付は9:00〜9:20、面接は10:00〜16:00のうち香川県が指定する時間で、自治医科大学の2027年度募集要項は会場を香川県庁の『本館会議室（12階）』と公表しています。県公式フロア案内は本館12階に大会議室と第1〜第7会議室があることを示しますが、面接で使う個別会議室、受付位置、受験生入口、待機場所、面接順、エレベーター、指定動線は未公表です。特定の会議室を面接会場と推定せず、受験票、香川県から交付される面接専用案内、当日掲示を確認してください。前日の学力試験は北館3階会議室という別会場で、北館や303〜306会議室を翌日の面接会場とみなさないでください。県公式アクセスはJR高松駅から徒歩約20分、または琴電瓦町駅から徒歩約10分と案内しています。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-ehime-annex-2"
            ? {
                postalCode: "790-8570",
                address: "愛媛県松山市一番町4丁目4番地2",
                nearestStations: [
                  "伊予鉄道市内電車 県庁前停留場",
                  "伊予鉄バス 県庁前停留所",
                  "伊予鉄道 松山市駅",
                  "JR予讃線 松山駅",
                ],
                officialUrl: "https://www.pref.ehime.jp/page/2417.html",
                officialUrlLabel: "愛媛県 公式本庁舎配置図",
                accessNote:
                  "愛媛県から出願する受験者の2027年1月25日（月）の学力試験と、学力試験に及第した受験者が翌1月26日（火）に受ける面接の共通会場です。学力試験は受付8:20〜8:40・試験9:00〜14:10、面接は受付9:00〜9:20・10:00〜16:00のうち愛媛県が指定する時間です。自治医科大学の2027年度募集要項は会場を『愛媛県庁第二別館』と公表し、県公式の現行本庁舎配置図も新しい第二別館を11階建ての庁舎として案内しています。ただし、学力・面接それぞれの使用階・会議室、受付位置、受験生入口、待機場所、面接順、エレベーター、指定動線は未公表です。県公式配置図にある3階・10階の会議室や11階大会議室を試験室と推定せず、受験票、愛媛県から交付される試験専用案内、当日掲示を確認してください。県公式アクセスはJR松山駅から徒歩約20分、伊予鉄道松山市駅から徒歩約15分、または市内電車・バスの県庁前下車と案内しています。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-kochi-kyosai-sakura"
            ? {
                postalCode: "780-0870",
                address: "高知県高知市本町5丁目3番20号",
                nearestStations: [
                  "とさでん交通 グランド通停留場",
                  "とさでん交通 県庁前停留場",
                  "JR土讃線 高知駅",
                ],
                officialUrl: "https://www.kochi-cs.jp/meeting-rooms/index.html",
                officialUrlLabel: "高知共済会館 公式会議室案内",
                accessNote:
                  "高知県から出願する受験者の2027年1月25日（月）の学力試験会場です。受付は8:20〜8:40、試験は9:00〜14:10で、自治医科大学の2027年度募集要項は会場を高知共済会館の『桜』と公表しています。会館公式の現行会議室案内は『桜』を3階の大ホールとし、全室182平方メートル・スクール形式126名、2/3・1/3の分割利用も可能と案内しています。ただし、試験で使う区画、受付位置、受験生入口、待機場所、エレベーター、指定動線は未公表です。全室または分割区画のいずれかを試験室と推定せず、受験票、高知県から交付される試験専用案内、当日掲示を確認してください。翌1月26日（火）の面接は同じ3階の中会議室『藤』という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-kochi-kyosai-fuji"
            ? {
                postalCode: "780-0870",
                address: "高知県高知市本町5丁目3番20号",
                nearestStations: [
                  "とさでん交通 グランド通停留場",
                  "とさでん交通 県庁前停留場",
                  "JR土讃線 高知駅",
                ],
                officialUrl: "https://www.kochi-cs.jp/meeting-rooms/index.html",
                officialUrlLabel: "高知共済会館 公式会議室案内",
                accessNote:
                  "高知県から出願し、2027年1月25日（月）の学力試験に及第した受験者が翌1月26日（火）に受ける面接会場です。受付は9:00〜9:20、面接は10:00〜16:00のうち高知県が指定する時間で、自治医科大学の2027年度募集要項は会場を高知共済会館の『藤』と公表しています。会館公式の現行会議室案内は『藤』を3階の中会議室とし、全室100平方メートル・スクール形式60名、1/2の分割利用も可能と案内しています。ただし、面接で使う区画、受付位置、受験生入口、待機場所、面接順、エレベーター、指定動線は未公表です。全室または分割区画のいずれかを面接室と推定せず、受験票、高知県から交付される面接専用案内、当日掲示を確認してください。前日の学力試験は同じ3階の大ホール『桜』という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-fukuoka-yoshizuka"
            ? {
                postalCode: "812-0046",
                address: "福岡県福岡市博多区吉塚本町13番50号",
                nearestStations: [
                  "JR鹿児島本線・福北ゆたか線 吉塚駅",
                  "福岡市地下鉄箱崎線 馬出九大病院前駅",
                  "西鉄バス 吉塚駅前停留所",
                ],
                officialUrl: "https://www.pref.fukuoka.lg.jp/contents/koutsu-yoshiduka.html",
                officialUrlLabel: "福岡県 公式吉塚合同庁舎アクセス",
                accessNote:
                  "福岡県から出願する受験者の2027年1月25日（月）の学力試験会場です。受付は8:20〜8:40、試験は9:00〜14:10で、自治医科大学の2027年度募集要項は会場を『吉塚合同庁舎』と公表しています。福岡県公式はJR吉塚駅から徒歩3分、地下鉄馬出九大病院前駅から徒歩7分、西鉄バス吉塚駅前から徒歩3分と案内しています。県公式の現行平面図には6階の603A・603B・604B、7階の特5・特6、8階の801〜804など複数の会議室がありますが、2027年学力試験の使用階・試験室、受付位置、受験生入口、待機場所、エレベーター、指定動線は未公表です。いずれの会議室も試験室と推定せず、受験票、福岡県から交付される試験専用案内、当日掲示を確認してください。翌1月26日（火）の面接は福岡県庁行政棟という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-fukuoka-prefectural-office"
            ? {
                postalCode: "812-8577",
                address: "福岡県福岡市博多区東公園7番7号",
                nearestStations: [
                  "JR鹿児島本線・福北ゆたか線 吉塚駅",
                  "福岡市地下鉄箱崎線 馬出九大病院前駅",
                  "西鉄バス 県庁前停留所",
                ],
                officialUrl: "https://www.pref.fukuoka.lg.jp/contents/koutuu-kenntyousha.html",
                officialUrlLabel: "福岡県 公式県庁舎アクセス",
                accessNote:
                  "福岡県から出願し、2027年1月25日（月）の学力試験に及第した受験者が翌1月26日（火）に受ける面接会場です。受付は9:00〜9:20、面接は10:00〜16:00のうち福岡県が指定する時間で、自治医科大学の2027年度募集要項は会場を『福岡県庁 行政棟』と公表しています。福岡県公式はJR吉塚駅から徒歩8分、地下鉄馬出九大病院前駅から徒歩5分、西鉄バス県庁前から徒歩1分と案内しています。県庁舎公式の現行案内には地下1階・8階・10階など複数の会議室がありますが、2027年面接の使用階・面接室、受付位置、受験生入口、待機場所、面接順、エレベーター、指定動線は未公表です。県庁バス通り側・東公園側の一般出入口や、地下1階・8階・10階の個別会議室を面接入口・面接室と推定せず、受験票、福岡県から交付される面接専用案内、当日掲示を確認してください。前日の学力試験は吉塚合同庁舎という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-saga-prefectural-office"
            ? {
                postalCode: "840-8570",
                address: "佐賀県佐賀市城内1丁目1番59号",
                nearestStations: [
                  "JR長崎本線・唐津線 佐賀駅",
                  "佐賀市営バス・昭和バス・祐徳バス 県庁前停留所",
                ],
                officialUrl: "https://www.pref.saga.lg.jp/kiji00347052/index.html",
                officialUrlLabel: "佐賀県 公式県庁アクセス案内",
                accessNote:
                  "佐賀県から出願する受験者の2027年1月25日（月）の学力試験と、学力試験に及第した受験者が翌1月26日（火）に受ける面接の共通会場です。学力試験は受付8:20〜8:40・試験9:00〜14:10、面接は受付9:00〜9:20・10:00〜16:00のうち佐賀県が指定する時間です。自治医科大学の2027年度募集要項は会場を『佐賀県庁』と公表し、県公式はJR佐賀駅から徒歩約20分、県庁前停留所から徒歩約1分と案内しています。ただし、本庁舎には旧館・新館・南館・議会棟があり、新館4階の特別会議室や11階の大会議室・番号付き会議室など複数の会議室があります。2027年の学力・面接それぞれの使用館・階・試験室・面接室、受付位置、受験生入口、待機場所、面接順、エレベーター、指定動線は未公表です。新館1階総合案内や県民ホール、個別会議室を試験指定と推定せず、受験票、佐賀県から交付される試験専用案内、当日掲示を確認してください。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-nagasaki-meeting-302-305"
            ? {
                postalCode: "850-8570",
                address: "長崎県長崎市尾上町3番1号",
                nearestStations: ["JR西九州新幹線・長崎本線 長崎駅"],
                officialUrl: "https://www.pref.nagasaki.jp/pages/page-319423.html",
                officialUrlLabel: "長崎県 公式県庁舎フロア案内",
                accessNote:
                  "長崎県から出願する受験者の2027年1月25日（月）の学力試験会場です。受付は8:20〜8:40、試験は9:00〜14:10で、自治医科大学の2027年度募集要項は会場を長崎県庁3階の『302～305会議室』と公表しています。長崎県公式はJR長崎駅から県庁まで徒歩約10分と案内し、県庁舎フロア案内でも3階に301～321会議室があることを確認できます。ただし、302～305のうち受験者ごとに使う部屋、受付位置、受験生入口、待機場所、エレベーター、指定動線は未公表です。1階の一般総合案内や公開会議の来庁手順を入試動線に転用せず、受験票、長崎県から交付される試験専用案内、当日掲示を確認してください。翌1月26日（火）の面接は同じ3階の312会議室という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-nagasaki-meeting-312"
            ? {
                postalCode: "850-8570",
                address: "長崎県長崎市尾上町3番1号",
                nearestStations: ["JR西九州新幹線・長崎本線 長崎駅"],
                officialUrl: "https://www.pref.nagasaki.jp/pages/page-319423.html",
                officialUrlLabel: "長崎県 公式県庁舎フロア案内",
                accessNote:
                  "長崎県から出願し、2027年1月25日（月）の学力試験に及第した受験者が翌1月26日（火）に受ける面接会場です。受付は9:00〜9:20、面接は10:00〜16:00のうち長崎県が指定する時間で、自治医科大学の2027年度募集要項は会場を長崎県庁3階の『312会議室』と公表しています。長崎県公式はJR長崎駅から県庁まで徒歩約10分と案内し、県庁舎フロア案内でも3階に301～321会議室があることを確認できます。ただし、受付位置、受験生入口、待機場所、面接順、エレベーター、指定動線は未公表です。1階の一般総合案内や公開会議の来庁手順を面接動線に転用せず、受験票、長崎県から交付される面接専用案内、当日掲示を確認してください。前日の学力試験は同じ3階の302～305会議室という別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : seed.venueId === "venue-jichi-first-kumamoto-basement-hall"
            ? {
                postalCode: "862-8570",
                address: "熊本県熊本市中央区水前寺6丁目18番1号",
                nearestStations: [
                  "熊本市電 市立体育館前停留場",
                  "路線バス・空港リムジンバス 熊本県庁前停留所",
                ],
                officialUrl: "https://www.pref.kumamoto.jp/uploaded/attachment/303254.pdf",
                officialUrlLabel: "熊本県 公式本館・新館地下配置図",
                accessNote:
                  "熊本県から出願する受験者の2027年1月25日（月）の学力試験会場です。受付は8:20〜8:40、試験は9:00〜14:10で、自治医科大学の2027年度募集要項は会場を『熊本県庁 地下大会議室』と公表しています。熊本県公式の現行配置図で地下大会議室が本館地下1階にあり最大450名収容であること、本館地下1階エレベーターホール、新館地下1階への地下通路、1階へ上がる階段があることを目視確認しました。ただし、2027年入試の受付位置、受験生入口、待機場所、使用する階段・エレベーター、指定動線は未公表です。本館1階受付、地下の巡視室側出入口、県庁前停留所を試験入口と推定せず、受験票、熊本県から交付される試験専用案内、当日掲示を確認してください。熊本県公式は市立体育館前停留場から県庁まで徒歩約10分と案内しています。翌1月26日（火）の面接はホテル熊本テルサという別会場です。",
                verifiedAt: "2026-08-19T00:00:00+09:00",
              }
          : {}),
    });
  }
}

export const privateMedicalJichiExamVenues2027 = [...jichiVenueEntityById.values()];

export const privateMedicalExamVenues2027: PrivateMedicalExamVenue2027[] = [
  ...privateMedicalJichiExamVenues2027,
  {
    venueId: "venue-jichi-medical-yakushiji-campus",
    academicYear: 2027,
    name: "自治医科大学",
    shortName: "自治医科大学",
    postalCode: "329-0498",
    address: "栃木県下野市薬師寺3311-1",
    prefecture: "栃木県",
    municipality: "下野市",
    nearestStations: ["JR宇都宮線 自治医大駅"],
    officialUrl: "https://www.jichi.ac.jp/access/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-tokyo-ryutsu-center",
    academicYear: 2027,
    name: "東京流通センター 第一展示場・第二展示場",
    shortName: "東京流通センター",
    postalCode: "143-0006",
    address: "東京都大田区平和島6-1-1",
    prefecture: "東京都",
    municipality: "大田区",
    nearestStations: ["東京モノレール 流通センター駅"],
    officialUrl: "https://www.trc-inc.co.jp/access/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-saitama-medical-katolosta-tower",
    academicYear: 2027,
    name: "埼玉医科大学 毛呂山キャンパス カタロスタワー",
    shortName: "毛呂山キャンパス カタロスタワー",
    postalCode: "350-0495",
    address: "埼玉県入間郡毛呂山町毛呂本郷38",
    prefecture: "埼玉県",
    municipality: "入間郡毛呂山町",
    nearestStations: ["JR八高線 毛呂駅", "東武越生線 東毛呂駅"],
    officialUrl: "https://www.saitama-med.ac.jp/access.html",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-toc-gotanda",
    academicYear: 2027,
    name: "TOCビル",
    shortName: "五反田TOC",
    postalCode: "141-0031",
    address: "東京都品川区西五反田7-22-17",
    prefecture: "東京都",
    municipality: "品川区",
    nearestStations: ["東急池上線 大崎広小路駅", "東急目黒線 不動前駅", "JR・都営浅草線 五反田駅"],
    officialUrl: "https://www.toc.co.jp/new1/access.html",
    accessNote: "施設公式では大崎広小路駅から徒歩5分、不動前駅から徒歩6分、五反田駅から徒歩8分。土日祝は五反田駅発の直通バスが運休です。",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-kyorin-mitaka-campus",
    academicYear: 2027,
    name: "杏林大学 三鷹キャンパス",
    shortName: "杏林大学 三鷹キャンパス",
    postalCode: "181-8611",
    address: "東京都三鷹市新川6-20-2",
    prefecture: "東京都",
    municipality: "三鷹市",
    nearestStations: ["三鷹駅・吉祥寺駅・仙川駅から路線バス"],
    officialUrl: "https://www.kyorin-u.ac.jp/univ/access/mitaka.html",
    accessNote: "鉄道駅から路線バスを利用する会場です。受験前日に利用系統と朝の時刻を確認してください。",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-makuhari-messe",
    academicYear: 2027,
    name: "幕張メッセ 国際展示場1～3ホール",
    shortName: "幕張メッセ",
    postalCode: "261-8550",
    address: "千葉県千葉市美浜区中瀬2-1",
    prefecture: "千葉県",
    municipality: "千葉市美浜区",
    nearestStations: ["JR京葉線 海浜幕張駅"],
    officialUrl: "https://www.m-messe.co.jp/access/",
    accessNote: "施設公式では海浜幕張駅から徒歩約5分。施設が広いため、受験票で使用棟・入口も確認してください。",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-juntendo-hongo-century-tower",
    academicYear: 2027,
    name: "順天堂大学 本郷・お茶の水キャンパス センチュリータワー",
    shortName: "順天堂大学 センチュリータワー",
    postalCode: "113-8421",
    address: "東京都文京区本郷2-1-1",
    prefecture: "東京都",
    municipality: "文京区",
    nearestStations: ["JR・東京メトロ丸ノ内線 御茶ノ水駅", "東京メトロ千代田線 新御茶ノ水駅"],
    officialUrl: "https://www.juntendo.ac.jp/access/index.html?newwindow=true",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-kansai-medical-atc-hall",
    academicYear: 2027,
    name: "ATCホール",
    shortName: "大阪 ATCホール",
    postalCode: "559-0034",
    address: "大阪府大阪市住之江区南港北2-1-10",
    prefecture: "大阪府",
    municipality: "大阪市住之江区",
    nearestStations: ["Osaka Metroニュートラム トレードセンター前駅"],
    officialUrl: "https://atchall.com/access/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-nagoya-convention-hall",
    academicYear: 2027,
    name: "名古屋コンベンションホール",
    shortName: "名古屋コンベンションホール",
    postalCode: "453-6102",
    address: "愛知県名古屋市中村区平池町4-60-12 グローバルゲート",
    prefecture: "愛知県",
    municipality: "名古屋市中村区",
    nearestStations: ["あおなみ線 ささしまライブ駅"],
    officialUrl: "https://www.nagoya.conventionhall.jp/access.html",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-fukuoka-minami-kindai-building",
    academicYear: 2027,
    name: "南近代ビル",
    shortName: "福岡 南近代ビル",
    postalCode: "812-0016",
    address: "福岡県福岡市博多区博多駅南4-2-10",
    prefecture: "福岡県",
    municipality: "福岡市博多区",
    nearestStations: ["西鉄バス 山王公園前", "JR・地下鉄 博多駅"],
    officialUrl: "https://www.minamikindai.com/access/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-kansai-medical-hirakata-medicine-building",
    academicYear: 2027,
    name: "関西医科大学 枚方キャンパス 医学部棟",
    shortName: "関西医科大学 枚方キャンパス",
    postalCode: "573-1010",
    address: "大阪府枚方市新町2-5-1",
    prefecture: "大阪府",
    municipality: "枚方市",
    nearestStations: ["京阪本線・交野線 枚方市駅"],
    officialUrl: "https://www.kmu.ac.jp/info/campus/access/",
    accessNote: "大学公式では枚方市駅から徒歩3分。試験当日の入口は募集要項・受験票を優先してください。",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-hyogo-medical-nishinomiya-campus",
    academicYear: 2027,
    name: "兵庫医科大学 西宮キャンパス 教育研究棟",
    shortName: "兵庫医科大学 西宮キャンパス",
    postalCode: "663-8501",
    address: "兵庫県西宮市武庫川町1-1",
    prefecture: "兵庫県",
    municipality: "西宮市",
    nearestStations: ["阪神本線 武庫川駅"],
    officialUrl: "https://www.hyo-med.ac.jp/about/access/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-teikyo-itabashi-campus",
    academicYear: 2027,
    name: "帝京大学 板橋キャンパス",
    shortName: "帝京大学 板橋キャンパス",
    postalCode: "173-8605",
    address: "東京都板橋区加賀2-11-1",
    prefecture: "東京都",
    municipality: "板橋区",
    nearestStations: ["JR埼京線 十条駅"],
    officialUrl: "https://www.teikyo-u.ac.jp/campus/access/itabashi",
    accessNote: "大学公式資料では十条駅北口から徒歩約12分。駐車場はありません。",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-pacifico-yokohama-north",
    academicYear: 2027,
    name: "パシフィコ横浜ノース",
    shortName: "パシフィコ横浜ノース",
    postalCode: "220-0012",
    address: "神奈川県横浜市西区みなとみらい1-1-2",
    prefecture: "神奈川県",
    municipality: "横浜市西区",
    nearestStations: ["みなとみらい線 みなとみらい駅", "JR・横浜市営地下鉄 桜木町駅"],
    officialUrl: "https://www.pacifico.co.jp/access",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-marianna-sugao-campus",
    academicYear: 2027,
    name: "聖マリアンナ医科大学 本学校舎",
    shortName: "聖マリアンナ医科大学 本学校舎",
    postalCode: "216-8511",
    address: "神奈川県川崎市宮前区菅生2-16-1",
    prefecture: "神奈川県",
    municipality: "川崎市宮前区",
    nearestStations: [
      "向ヶ丘遊園駅・生田駅・百合ヶ丘駅・新百合ヶ丘駅から路線バス",
      "あざみ野駅・宮前平駅・鷺沼駅・溝の口駅から路線バス",
    ],
    officialUrl: "https://www.marianna-u.ac.jp/houjin/access/univ/",
    accessNote: "各駅から路線バスを利用する会場です。道路状況による遅延を見込み、最新ダイヤと受験票記載の試験会場入口を確認してください。",
    reviewState: "verified",
    verifiedAt: MARIANNA_VERIFIED_AT,
  },
  {
    venueId: "venue-uoeh-main-campus",
    academicYear: 2027,
    name: "産業医科大学",
    shortName: "産業医科大学 本学",
    postalCode: "807-8555",
    address: "福岡県北九州市八幡西区医生ケ丘1-1",
    prefecture: "福岡県",
    municipality: "北九州市八幡西区",
    nearestStations: ["JR鹿児島本線 折尾駅から路線バス"],
    officialUrl: "https://www.uoeh-u.ac.jp/University/College/access.html",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-kitakyushu-messe",
    academicYear: 2027,
    name: "北九州メッセ",
    shortName: "北九州メッセ",
    postalCode: "802-0001",
    address: "福岡県北九州市小倉北区浅野3-8-1",
    prefecture: "福岡県",
    municipality: "北九州市小倉北区",
    nearestStations: ["JR小倉駅"],
    officialUrl: "https://hello-kitakyushu.or.jp/messe/access/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-bellesalle-shiodome",
    academicYear: 2027,
    name: "ベルサール汐留",
    shortName: "ベルサール汐留",
    postalCode: "104-0061",
    address: "東京都中央区銀座8-21-1 住友不動産汐留浜離宮ビル B1・1F・2F",
    prefecture: "東京都",
    municipality: "中央区",
    nearestStations: ["都営大江戸線・ゆりかもめ 汐留駅", "JR・東京メトロ・都営浅草線 新橋駅"],
    officialUrl: "https://www.bellesalle.co.jp/shisetsu/higashiginza/bs_shiodome/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-iwate-medical-yahaba-campus",
    academicYear: 2027,
    name: "岩手医科大学 矢巾キャンパス",
    shortName: "岩手医科大学 矢巾キャンパス",
    postalCode: "028-3694",
    address: "岩手県紫波郡矢巾町医大通1-1-1",
    prefecture: "岩手県",
    municipality: "紫波郡矢巾町",
    nearestStations: ["JR東北本線 矢幅駅"],
    officialUrl: "https://www.iwate-med.ac.jp/access/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-tohoku-med-pharm-komatsushima-campus",
    academicYear: 2027,
    name: "東北医科薬科大学 小松島キャンパス",
    shortName: "東北医科薬科大学 小松島キャンパス",
    postalCode: "981-8558",
    address: "宮城県仙台市青葉区小松島4-4-1",
    prefecture: "宮城県",
    municipality: "仙台市青葉区",
    nearestStations: ["JR仙山線 東照宮駅", "仙台市営地下鉄南北線 台原駅"],
    officialUrl: "https://www.tohoku-mpu.ac.jp/access/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-bellesalle-shibuya-garden",
    academicYear: 2027,
    name: "ベルサール渋谷ガーデン",
    shortName: "ベルサール渋谷ガーデン",
    postalCode: "150-0036",
    address: "東京都渋谷区南平台町16-17 住友不動産渋谷ガーデンタワー",
    prefecture: "東京都",
    municipality: "渋谷区",
    nearestStations: ["京王井の頭線 神泉駅", "JR・東京メトロ・東急 渋谷駅"],
    officialUrl: "https://www.bellesalle.co.jp/shisetsu/shibuya/bs_shibuyagarden/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-grand-cube-osaka",
    academicYear: 2027,
    name: "グランキューブ大阪（大阪府立国際会議場）",
    shortName: "グランキューブ大阪",
    postalCode: "530-0005",
    address: "大阪府大阪市北区中之島5-3-51",
    prefecture: "大阪府",
    municipality: "大阪市北区",
    nearestStations: ["京阪中之島線 中之島駅"],
    officialUrl: "https://www.gco.co.jp/visitor/access/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-acu-a-asty45",
    academicYear: 2027,
    name: "ACU-A（アスティ45）",
    shortName: "札幌 ACU-A",
    postalCode: "060-0004",
    address: "北海道札幌市中央区北4条西5丁目 アスティ45",
    prefecture: "北海道",
    municipality: "札幌市中央区",
    nearestStations: ["JR札幌駅", "札幌市営地下鉄 さっぽろ駅"],
    officialUrl: "https://www.acu-h.jp/sapporo/koutsu_access",
    reviewState: "verified",
    verifiedAt: MARIANNA_VERIFIED_AT,
  },
  {
    venueId: "venue-iuhw-narita-campus",
    academicYear: 2027,
    name: "国際医療福祉大学 成田キャンパス（公津の杜校舎）",
    shortName: "国際医療福祉大学 成田キャンパス",
    postalCode: "286-8686",
    address: "千葉県成田市公津の杜4-3",
    prefecture: "千葉県",
    municipality: "成田市",
    nearestStations: ["京成本線 公津の杜駅"],
    officialUrl: "https://narita.iuhw.ac.jp/about/map/index.html",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-iuhw-tokyo-akasaka-campus",
    academicYear: 2027,
    name: "国際医療福祉大学 東京赤坂キャンパス",
    shortName: "国際医療福祉大学 東京赤坂キャンパス",
    postalCode: "107-8402",
    address: "東京都港区赤坂4-1-26",
    prefecture: "東京都",
    municipality: "港区",
    nearestStations: ["東京メトロ 赤坂見附駅", "東京メトロ 赤坂駅"],
    officialUrl: "https://akasaka.iuhw.ac.jp/about/access/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-tkp-osaka-riverside-hotel",
    academicYear: 2027,
    name: "TKPガーデンシティ大阪リバーサイドホテル",
    shortName: "TKP大阪リバーサイドホテル",
    postalCode: "534-0027",
    address: "大阪府大阪市都島区中野町5-12-30 大阪リバーサイドホテル会館棟2〜6階",
    prefecture: "大阪府",
    municipality: "大阪市都島区",
    nearestStations: ["JR大阪環状線 桜ノ宮駅"],
    officialUrl: "https://www.kashikaigishitsu.net/facilitys/gc-riverside-osaka/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-iuhw-graduate-school-fukuoka-campus",
    academicYear: 2027,
    name: "国際医療福祉大学 大学院 福岡キャンパス（福岡国際医療福祉大学 看護学部2号館建物内）",
    shortName: "国際医療福祉大学 福岡キャンパス",
    postalCode: "814-0001",
    address: "福岡県福岡市早良区百道浜2-4-16",
    prefecture: "福岡県",
    municipality: "福岡市早良区",
    nearestStations: ["西鉄バス 医師会館・ソフトリサーチパーク前", "福岡市地下鉄空港線 西新駅"],
    officialUrl: "https://www.iuhw.ac.jp/daigakuin/access/",
    accessNote: "2027年度要項では看護学部2号館建物内まで確定しています。使用階・試験室・受験生入口は未公表です。",
    reviewState: "verified",
    verifiedAt: MARIANNA_VERIFIED_AT,
  },
  {
    venueId: "venue-showa-medical-hatanodai-campus",
    academicYear: 2027,
    name: "昭和医科大学 旗の台キャンパス",
    shortName: "昭和医科大学 旗の台キャンパス",
    postalCode: "142-8555",
    address: "東京都品川区旗の台1-5-8",
    prefecture: "東京都",
    municipality: "品川区",
    nearestStations: ["東急大井町線・池上線 旗の台駅"],
    officialUrl: "https://www.showa-u.ac.jp/access/hatanodai.html",
    accessNote: "東急大井町線・池上線の旗の台駅東口から徒歩5分です。医学部一般選抜Ⅰ期・Ⅱ期の一次では五反田TOCビルの定員超過時に限り受験票で割り当てられる可能性があり、二次は同キャンパスで固定です。試験室は当日朝掲示で、使用棟・受付位置・受験生入口は未公表です。",
    reviewState: "verified",
    verifiedAt: "2026-08-19T00:00:00+09:00",
  },
  {
    venueId: "venue-tokyo-medical-shinjuku-campus",
    academicYear: 2027,
    name: "東京医科大学 新宿キャンパス",
    shortName: "東京医科大学 本学",
    postalCode: "160-8402",
    address: "東京都新宿区新宿6-1-1",
    prefecture: "東京都",
    municipality: "新宿区",
    nearestStations: ["東京メトロ丸ノ内線 新宿御苑前駅", "都営新宿線 新宿三丁目駅"],
    officialUrl: "https://www.tokyo-med.ac.jp/access/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-bellesalle-shinjuku-grand",
    academicYear: 2027,
    name: "ベルサール新宿グランド イベントホール",
    shortName: "ベルサール新宿グランド",
    postalCode: "160-0023",
    address: "東京都新宿区西新宿8-17-3 住友不動産新宿グランドタワー1階",
    prefecture: "東京都",
    municipality: "新宿区",
    nearestStations: ["東京メトロ丸ノ内線 西新宿駅", "都営大江戸線 都庁前駅"],
    officialUrl: "https://www.bellesalle.co.jp/shisetsu/shinjuku/bs_shinjukugrand/",
    accessNote: "東京メトロ丸ノ内線の西新宿駅1番出口から徒歩約4分です。東京医科大学の2027年度一般選抜一次では、受験番号によって本学またはベルサール新宿グランドが指定されます。施設は住友不動産新宿グランドタワー1階のイベントホールですが、使用区画・受付位置・受験生入口は未公表です。受験票と当日案内を確認し、同施設の5階会議室や近隣の別ベルサールと取り違えないでください。",
    reviewState: "verified",
    verifiedAt: "2026-08-19T00:00:00+09:00",
  },
  {
    venueId: "venue-jikei-nishishimbashi-campus",
    academicYear: 2027,
    name: "東京慈恵会医科大学 西新橋キャンパス",
    shortName: "慈恵医大 西新橋キャンパス",
    postalCode: "105-8461",
    address: "東京都港区西新橋3-25-8",
    prefecture: "東京都",
    municipality: "港区",
    nearestStations: ["都営三田線 御成門駅", "東京メトロ日比谷線 虎ノ門ヒルズ駅"],
    officialUrl: "https://www.jikei.ac.jp/access/nishi-shimbashi/",
    accessNote: "大学公式アクセス図では、都営三田線の御成門駅A5出口から徒歩約3分、東京メトロ日比谷線の神谷町駅3番出口から徒歩約7分、虎ノ門ヒルズ駅A1出口から徒歩約9分などと案内しています。2027年度一般選抜二次の会場は西新橋キャンパスで確定していますが、個別の試験日・集合時刻、使用棟・階・試験室・受付位置・受験生入口は未公表です。現行キャンパスマップの大学1号館や附属病院入口を試験会場・入口とみなさず、学生募集要項・受験票・当日案内を確認してください。",
    reviewState: "verified",
    verifiedAt: "2026-08-19T00:00:00+09:00",
  },
  {
    venueId: "venue-keio-plaza-hotel-tokyo",
    academicYear: 2027,
    name: "京王プラザホテル（東京）",
    shortName: "京王プラザホテル東京",
    postalCode: "160-8330",
    address: "東京都新宿区西新宿2-2-1",
    prefecture: "東京都",
    municipality: "新宿区",
    nearestStations: ["都営大江戸線 都庁前駅", "JR・私鉄・地下鉄 新宿駅"],
    officialUrl: "https://www.keioplaza.co.jp/access/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-twmu-yayoi-memorial-education-building",
    academicYear: 2027,
    name: "東京女子医科大学 彌生記念教育棟",
    shortName: "東京女子医科大学 彌生記念教育棟",
    postalCode: "162-8666",
    address: "東京都新宿区河田町8-1",
    prefecture: "東京都",
    municipality: "新宿区",
    nearestStations: ["都営大江戸線 若松河田駅", "都営新宿線 曙橋駅"],
    officialUrl: "https://twmu.ac.jp/univ/access.php",
    accessNote: "大学公式は都営大江戸線 若松河田駅若松口から徒歩5分と案内しています。曙橋駅側は大学の公式資料に徒歩8分・約10分の表記差があるため、余裕を見込んでください。2027年度一般選抜二次は彌生記念教育棟まで確定していますが、個別の試験日・集合場所・集合時刻は一次試験合格発表時に公表され、使用階・試験室・受付位置・受験生入口は未公表です。会場の下見と写真撮影は行わず、大学の案内を確認してください。",
    reviewState: "verified",
    verifiedAt: "2026-08-19T00:00:00+09:00",
  },
  {
    venueId: "venue-toho-omori-campus",
    academicYear: 2027,
    name: "東邦大学 大森キャンパス",
    shortName: "東邦大学 大森キャンパス",
    postalCode: "143-8540",
    address: "東京都大田区大森西5-21-16",
    prefecture: "東京都",
    municipality: "大田区",
    nearestStations: ["京急本線 梅屋敷駅", "京急本線 大森町駅", "JR京浜東北線 蒲田駅から路線バス"],
    officialUrl: "https://www.toho-u.ac.jp/accessmap/omori_campus.html",
    accessNote: "大学公式は京急本線 梅屋敷駅から徒歩約8分、大森町駅から徒歩約10分と案内しています。JR蒲田駅東口からは2番のりばの大森駅行きバスで約4分、『東邦大学』下車後徒歩約2分です。2027年度医学部一般入試二次は2月15日・16日のいずれか1日、統一入試二次は3月3日に大森キャンパスで実施されますが、一般入試二次の日付決定方法、集合・入場時刻、使用棟・階・試験室・受付位置・受験生入口は現時点で未公表です。附属病院の入口や通常のキャンパスマップ上の門を試験入口とみなさず、後日公開される学生募集要項、受験票、一次試験合格者向け案内、当日掲示を確認してください。",
    reviewState: "verified",
    verifiedAt: "2026-08-19T00:00:00+09:00",
  },
  {
    venueId: "venue-nihon-medical-school-building",
    academicYear: 2027,
    name: "日本大学 医学部校舎",
    shortName: "日本大学 医学部校舎",
    postalCode: "173-8610",
    address: "東京都板橋区大谷口上町30-1",
    prefecture: "東京都",
    municipality: "板橋区",
    nearestStations: ["東武東上線 大山駅", "池袋駅西口から路線バス", "東京メトロ有楽町線 千川駅"],
    officialUrl: "https://www.med.nihon-u.ac.jp/access.php",
    accessNote: "大学公式は池袋駅から東武東上線の各駅停車で大山駅まで約5分、大山駅から医学部まで徒歩約15分と案内しています。池袋駅西口からは4番のりばの日大病院行き路線バスで終点まで約25分、千川駅からは徒歩約20分です。2027年度N方式第1期二次は2月11日、第2期二次は3月17日に医学部校舎で実施されますが、集合・入場・開始時刻、使用棟・階・試験室・受付位置・受験生入口は現時点で未公表です。日大病院停留所や通常の構内案内図上の入口を試験入口とみなさず、募集要項、受験票、一次試験合格者向け案内、当日掲示を確認してください。",
    reviewState: "verified",
    verifiedAt: "2026-08-19T00:00:00+09:00",
  },
  {
    venueId: "venue-nippon-medical-musashisakai-campus",
    academicYear: 2027,
    name: "日本医科大学 武蔵境校舎",
    shortName: "日本医科大学 武蔵境校舎",
    postalCode: "180-0023",
    address: "東京都武蔵野市境南町1-7-1",
    prefecture: "東京都",
    municipality: "武蔵野市",
    nearestStations: ["JR中央線・西武多摩川線 武蔵境駅"],
    officialUrl: "https://www.nms.ac.jp/college/introduction/access.html",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-bellesalle-shibuya-first",
    academicYear: 2027,
    name: "ベルサール渋谷ファースト",
    shortName: "ベルサール渋谷ファースト",
    postalCode: "150-0011",
    address: "東京都渋谷区東1-2-20 住友不動産渋谷ファーストタワーB1・2階",
    prefecture: "東京都",
    municipality: "渋谷区",
    nearestStations: ["JR・東京メトロ・東急 渋谷駅", "東京メトロ 表参道駅"],
    officialUrl: "https://www.bellesalle.co.jp/shisetsu/shibuya/bs_shibuyafirst/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-nippon-medical-sendagi-campus",
    academicYear: 2027,
    name: "日本医科大学 千駄木校舎",
    shortName: "日本医科大学 千駄木校舎",
    postalCode: "113-8602",
    address: "東京都文京区千駄木1-1-5",
    prefecture: "東京都",
    municipality: "文京区",
    nearestStations: ["東京メトロ南北線 東大前駅", "東京メトロ千代田線 千駄木駅"],
    officialUrl: "https://www.nms.ac.jp/college/introduction/access.html",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-kitasato-sagamihara-campus",
    academicYear: 2027,
    name: "北里大学 相模原キャンパス",
    shortName: "北里大学 相模原キャンパス",
    postalCode: "252-0373",
    address: "神奈川県相模原市南区北里1-15-1",
    prefecture: "神奈川県",
    municipality: "相模原市南区",
    nearestStations: ["小田急線 相模大野駅から路線バス", "JR横浜線 相模原駅から路線バス"],
    officialUrl: "https://www.kitasato-u.ac.jp/jp/campus-guide/sagamihara.html",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-kanazawa-medical-main-campus",
    academicYear: 2027,
    name: "金沢医科大学",
    shortName: "金沢医科大学 本学",
    postalCode: "920-0293",
    address: "石川県河北郡内灘町大学1-1",
    prefecture: "石川県",
    municipality: "河北郡内灘町",
    nearestStations: ["北陸鉄道浅野川線 内灘駅から路線バス"],
    officialUrl: "https://www.kanazawa-med.ac.jp/other/accessmap.html",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-osaka-academia",
    academicYear: 2027,
    name: "大阪アカデミア",
    shortName: "大阪アカデミア",
    postalCode: "559-0034",
    address: "大阪府大阪市住之江区南港北1-3-5",
    prefecture: "大阪府",
    municipality: "大阪市住之江区",
    nearestStations: ["Osaka Metroニュートラム ポートタウン西駅", "コスモスクエア駅から送迎バス"],
    officialUrl: "https://osakaacademia.com/access/index.html",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-tkp-premium-nagoya-ekimae",
    academicYear: 2027,
    name: "TKPガーデンシティPREMIUM名古屋駅前",
    shortName: "TKP名古屋駅前",
    postalCode: "451-0045",
    address: "愛知県名古屋市西区名駅1-1-17 名駅ダイヤメイテツビル3階",
    prefecture: "愛知県",
    municipality: "名古屋市西区",
    nearestStations: ["名古屋市営地下鉄 名古屋駅10番出入口", "JR・名鉄・近鉄 名古屋駅"],
    officialUrl: "https://www.kashikaigishitsu.net/facilitys/gcp-nagoya-ekimae/",
    accessNote: "施設公式は名古屋市営地下鉄 名古屋駅10番出入口から徒歩3分、名鉄名古屋駅・近鉄名古屋駅・JR線／新幹線連絡改札口から徒歩5分と案内しています。会場は名駅ダイヤメイテツビル3階ですが、2027年度の使用室・受付位置・受験生入口・開場時刻は未公表です。大学の2027年度ガイドと『昨年度からの変更点』は本施設への変更を明記する一方、一般選抜（前期）ページには旧会場の名古屋ルーセントタワー表記が残るため、受験票で最終会場を必ず確認してください。名古屋駅周辺の別TKP施設と取り違えないでください。",
    reviewState: "monitoring",
    verifiedAt: "2026-08-19T00:00:00+09:00",
  },
  {
    venueId: "venue-fukuoka-garden-palace",
    academicYear: 2027,
    name: "福岡ガーデンパレス",
    shortName: "福岡ガーデンパレス",
    postalCode: "810-0001",
    address: "福岡県福岡市中央区天神4-8-15",
    prefecture: "福岡県",
    municipality: "福岡市中央区",
    nearestStations: ["福岡市地下鉄空港線 天神駅"],
    officialUrl: "https://www.hotelgp-fukuoka.com/access/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-tokyo-ryutsu-center-center-building",
    academicYear: 2027,
    name: "東京流通センター センタービル",
    shortName: "東京流通センター センタービル",
    postalCode: "143-0006",
    address: "東京都大田区平和島6-1-1",
    prefecture: "東京都",
    municipality: "大田区",
    nearestStations: ["東京モノレール 流通センター駅"],
    officialUrl: "https://www.trc-inc.co.jp/access/",
    accessNote: "金沢医科大学の2027年度ガイドは一般選抜（後期）一次の東京会場を東京流通センター センタービルと公表しています。施設公式では東京モノレール流通センター駅から徒歩1分です。開場・入場時刻、使用階・室、受付位置、受験生入口は未公表のため、受験票と当日掲示を確認し、東京流通センター内の別棟と取り違えないでください。",
    reviewState: "verified",
    verifiedAt: "2026-08-19T00:00:00+09:00",
  },
  {
    venueId: "venue-temma-training-center",
    academicYear: 2027,
    name: "天満研修センター",
    shortName: "天満研修センター",
    postalCode: "530-0034",
    address: "大阪府大阪市北区錦町2-21",
    prefecture: "大阪府",
    municipality: "大阪市北区",
    nearestStations: ["JR大阪環状線 天満駅", "Osaka Metro堺筋線 扇町駅"],
    officialUrl: "https://www.temmacenter.com/tenma/access/",
    accessNote: "金沢医科大学の2027年度ガイドは一般選抜（後期）一次の大阪会場を天満研修センターと公表しています。施設公式ではJR大阪環状線天満駅から徒歩約2分です。開場・入場時刻、使用階・室、受付位置、受験生入口は未公表のため、受験票と当日掲示を確認してください。",
    reviewState: "verified",
    verifiedAt: "2026-08-19T00:00:00+09:00",
  },
  {
    venueId: "venue-bellesalle-takadanobaba",
    academicYear: 2027,
    name: "ベルサール高田馬場",
    shortName: "ベルサール高田馬場",
    postalCode: "169-0072",
    address: "東京都新宿区大久保3-8-2 住友不動産新宿ガーデンタワーB2・1階",
    prefecture: "東京都",
    municipality: "新宿区",
    nearestStations: ["JR・西武新宿線・東京メトロ東西線 高田馬場駅", "東京メトロ副都心線 西早稲田駅"],
    officialUrl: "https://www.bellesalle.co.jp/shisetsu/shinjuku/bs_takadanobaba/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-congres-convention-center",
    academicYear: 2027,
    name: "ナレッジキャピタル コングレコンベンションセンター",
    shortName: "コングレコンベンションセンター",
    postalCode: "530-0011",
    address: "大阪府大阪市北区大深町3-1 グランフロント大阪 北館B2階",
    prefecture: "大阪府",
    municipality: "大阪市北区",
    nearestStations: ["JR大阪駅", "Osaka Metro・阪急・阪神 大阪梅田駅"],
    officialUrl: "https://www.congre-cc.jp/access/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-fukuoka-fashion-building",
    academicYear: 2027,
    name: "福岡ファッションビル 8階",
    shortName: "福岡ファッションビル",
    postalCode: "812-0011",
    address: "福岡県福岡市博多区博多駅前2-10-19",
    prefecture: "福岡県",
    municipality: "福岡市博多区",
    nearestStations: ["福岡市地下鉄空港線 祇園駅", "JR・地下鉄 博多駅"],
    officialUrl: "https://www.ffb.jp/access/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-aichi-medical-main-building",
    academicYear: 2027,
    name: "愛知医科大学 1号館（大学本館）",
    shortName: "愛知医科大学 本学",
    postalCode: "480-1195",
    address: "愛知県長久手市岩作雁又1-1",
    prefecture: "愛知県",
    municipality: "長久手市",
    nearestStations: ["名鉄瀬戸線 尾張旭駅から路線バス", "名古屋市営地下鉄東山線 藤が丘駅から路線バス"],
    officialUrl: "https://www.aichi-med-u.ac.jp/su11/su1101/index.html",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-fujita-health-toyoake-campus",
    academicYear: 2027,
    name: "藤田医科大学 豊明キャンパス",
    shortName: "藤田医科大学 本学",
    postalCode: "470-1192",
    address: "愛知県豊明市沓掛町田楽ケ窪1-98",
    prefecture: "愛知県",
    municipality: "豊明市",
    nearestStations: ["名鉄名古屋本線 前後駅から路線バス", "名古屋市営地下鉄桜通線 徳重駅から路線バス"],
    officialUrl: "https://www.fujita-hu.ac.jp/access.html",
    accessNote: "2027年度の一般入試・共通テスト利用入試の二次は本学のみです。前後駅1番のりばから大学病院方面の対象便を利用し、学生・職員専用スクールバスは使いません。試験の使用棟・階・受付・受験生入口は未公表です。",
    reviewState: "verified",
    verifiedAt: "2026-08-18T00:00:00+09:00",
  },
  {
    venueId: "venue-osaka-med-pharm-takatsuki-campus",
    academicYear: 2027,
    name: "大阪医科薬科大学 本部キャンパス",
    shortName: "大阪医科薬科大学 本部キャンパス",
    postalCode: "569-8686",
    address: "大阪府高槻市大学町2-7",
    prefecture: "大阪府",
    municipality: "高槻市",
    nearestStations: ["阪急京都線 高槻市駅", "JR京都線 高槻駅"],
    officialUrl: "https://www.ompu.ac.jp/access.html",
    accessNote: "2027年度医学部一般選抜（前期・大阪府地域枠）の二次は2月19日、一般選抜（後期）の二次は3月16日、共通テスト利用選抜の二次は2月28日に本部キャンパスで実施予定です。一般前期の繰上合格候補対象者の二次は3月3日です。阪急高槻市駅出口1からは大学公式で『すぐ』、JR高槻駅南口からは徒歩8分ですが、出口1は試験当日の受験生入口ではありません。2027年度の開場・集合・開始時刻、使用棟・階・試験室、受付位置、受験生入口は未公表です。完成版募集要項、受験票、一次試験合格者向け案内、当日掲示を確認し、大学病院の入口と取り違えないでください。",
    reviewState: "verified",
    verifiedAt: "2026-08-19T00:00:00+09:00",
  },
  {
    venueId: "venue-kindai-osaka-medical-campus",
    academicYear: 2027,
    name: "近畿大学 おおさかメディカルキャンパス",
    shortName: "近畿大学 おおさかメディカルキャンパス",
    postalCode: "590-0197",
    address: "大阪府堺市南区三原台1丁14番1号",
    prefecture: "大阪府",
    municipality: "堺市南区",
    nearestStations: ["南海泉北線 泉ケ丘駅"],
    officialUrl: "https://www.kindai.ac.jp/medicine/access/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-tkp-shimbashi-conference-center",
    academicYear: 2027,
    name: "TKP新橋カンファレンスセンター",
    shortName: "TKP新橋カンファレンスセンター",
    postalCode: "100-0011",
    address: "東京都千代田区内幸町1-3-1 幸ビルディング10〜16階",
    prefecture: "東京都",
    municipality: "千代田区",
    nearestStations: ["都営三田線 内幸町駅", "JR・東京メトロ・都営浅草線 新橋駅"],
    officialUrl: "https://www.kashikaigishitsu.net/facilitys/cc-shimbashi-uchisaiwaicho/",
    accessNote: "兵庫医科大学の2027年度一般選抜A（4科目型）一次は2月4日に実施され、A・Bを両方出願する場合も東京会場を選択できます。ただし東京会場が収容定員を超えると大阪会場へ変更されるため、受験票で確定会場を確認してください。最初の英語は9:00開始で、大学の共通注意事項に従い8:45までに受験室へ入室する必要があります。施設は幸ビルディング10〜16階ですが、使用階・室、受付位置、受験生入口は当日通知です。内幸町駅A5出口から施設までは大学・施設公式徒歩1分ですが、指定受験室までの時間ではありません。下見目的で会場内へ立ち入らず、交通機関・道順だけを事前確認してください。",
    reviewState: "verified",
    verifiedAt: "2026-08-19T00:00:00+09:00",
  },
  {
    venueId: "venue-kawasaki-medical-general-gymnasium",
    academicYear: 2027,
    name: "川崎医科大学 総合体育館等",
    shortName: "川崎医科大学 総合体育館等",
    postalCode: "701-0192",
    address: "岡山県倉敷市松島577",
    prefecture: "岡山県",
    municipality: "倉敷市",
    nearestStations: ["JR山陽本線 中庄駅"],
    officialUrl: "https://m.kawasaki-m.ac.jp/outline/access.php",
    accessNote: "川崎医科大学の2027年度一般選抜・地域枠選抜の第一次試験は2月1日に実施され、公式会場表記は『総合体育館等』です。使用施設、受付位置、受験生入口、受験室は未公表のため、受験票と大学の受験生向け案内・当日掲示で確認してください。大学公式はJR山陽本線・伯備線の中庄駅から徒歩10分と案内していますが、これは大学までの一般アクセスで、指定受験室までの時間ではありません。試験会場と周辺への自家用車・タクシー・バス等の乗り入れ、無断駐車、送迎は禁止されています。",
    reviewState: "verified",
    verifiedAt: "2026-08-19T00:00:00+09:00",
  },
  {
    venueId: "venue-kawasaki-medical-school-building",
    academicYear: 2027,
    name: "川崎医科大学 校舎棟",
    shortName: "川崎医科大学 校舎棟",
    postalCode: "701-0192",
    address: "岡山県倉敷市松島577",
    prefecture: "岡山県",
    municipality: "倉敷市",
    nearestStations: ["JR山陽本線 中庄駅"],
    officialUrl: "https://m.kawasaki-m.ac.jp/outline/access.php",
    accessNote: "川崎医科大学の2027年度一般選抜・地域枠選抜の第二次試験は2月10日・11日のうち大学が指定する1日に実施され、会場は校舎棟です。面接時刻、受付位置、使用階・室、受験生入口は未公表のため、第一次試験合格後の大学案内と受験票で確認してください。校舎棟は附属病院より東側にあり、附属病院玄関とは異なります。大学公式は中庄駅から徒歩10分と案内していますが、これは大学までの一般アクセスで、指定受付までの時間ではありません。試験会場と周辺への自家用車・タクシー・バス等の乗り入れ、無断駐車、送迎は禁止されています。",
    reviewState: "verified",
    verifiedAt: "2026-08-19T00:00:00+09:00",
  },
  {
    venueId: "venue-kurume-mii-campus",
    academicYear: 2027,
    name: "久留米大学 御井キャンパス",
    shortName: "久留米大学 御井キャンパス",
    postalCode: "839-8502",
    address: "福岡県久留米市御井町1635",
    prefecture: "福岡県",
    municipality: "久留米市",
    nearestStations: ["JR久大本線 久留米大学前駅"],
    officialUrl: "https://www.kurume-u.ac.jp/access/mii/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-kurume-asahimachi-campus",
    academicYear: 2027,
    name: "久留米大学 旭町キャンパス",
    shortName: "久留米大学 旭町キャンパス",
    postalCode: "830-0011",
    address: "福岡県久留米市旭町67",
    prefecture: "福岡県",
    municipality: "久留米市",
    nearestStations: ["JR・西鉄 久留米駅から路線バス"],
    officialUrl: "https://www.kurume-u.ac.jp/access/asahi/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-fukuoka-university-nanakuma-campus",
    academicYear: 2027,
    name: "福岡大学",
    shortName: "福岡大学 本学",
    postalCode: "814-0180",
    address: "福岡県福岡市城南区七隈8-19-1",
    prefecture: "福岡県",
    municipality: "福岡市城南区",
    nearestStations: ["福岡市地下鉄七隈線 福大前駅"],
    officialUrl: "https://www.fukuoka-u.ac.jp/help/map/",
    accessNote: "福大前駅1番出口は入学センター・入試事務室方面の大学公式案内です。2027年度系統別日程の本学試験場は福岡大学まで確定していますが、使用棟・試験室・受付・受験生入口・集合時刻は未公表です。",
    reviewState: "verified",
    verifiedAt: "2026-08-18T00:00:00+09:00",
  },
  {
    venueId: "venue-time24-building",
    academicYear: 2027,
    name: "タイム24ビル",
    shortName: "タイム24ビル",
    postalCode: "135-8073",
    address: "東京都江東区青海2-4-32",
    prefecture: "東京都",
    municipality: "江東区",
    nearestStations: ["ゆりかもめ テレコムセンター駅"],
    officialUrl: "https://www.bigsight.jp/organizer/buildings/time/access/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-tkp-premium-nagoya-shinkansenguchi",
    academicYear: 2027,
    name: "TKPガーデンシティPREMIUM名古屋新幹線口",
    shortName: "TKP名古屋新幹線口",
    postalCode: "453-0015",
    address: "愛知県名古屋市中村区椿町1-16 井門名古屋ビル",
    prefecture: "愛知県",
    municipality: "名古屋市中村区",
    nearestStations: ["JR・名鉄・近鉄・地下鉄 名古屋駅"],
    officialUrl: "https://www.kashikaigishitsu.net/facilitys/gc-nagoya-shinkansenguchi/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-tkp-shinosaka-conference-center",
    academicYear: 2027,
    name: "TKP新大阪カンファレンスセンター",
    shortName: "TKP新大阪カンファレンスセンター",
    postalCode: "532-0003",
    address: "大阪府大阪市淀川区宮原4-3-39 J.NODE新大阪 4～5階",
    prefecture: "大阪府",
    municipality: "大阪市淀川区",
    nearestStations: ["JR・Osaka Metro御堂筋線 新大阪駅"],
    officialUrl: "https://www.kashikaigishitsu.net/facilitys/cc-shinosaka/",
    accessNote: "2026年6月30日に入居ビル名が「新大阪NKビル」から「J.NODE新大阪」へ変更されました。福岡大学の2027年度入試ガイドには旧ビル名で掲載されています。",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
];

export const privateMedicalExamRouteIds2027 = privateMedicalCanonicalRouteIds2027;

type AssignmentPlan = Partial<
  Pick<
    PrivateMedicalExamVenueAssignment2027,
    | "examStageLabel"
    | "venueLinks"
    | "announcedPrefectures"
    | "announcedVenueText"
    | "publicationState"
    | "conditions"
    | "sharedWithRouteIds"
    | "officialAdmissionUrl"
    | "evidenceLabel"
    | "evidenceLocator"
    | "knowledgeBaseIds"
    | "reviewState"
    | "note"
  >
>;

const assignmentPlans = new Map<string, AssignmentPlan>();
const stageKey = (routeId: string, examStage: ExamStage2027) => `${routeId}::${examStage}`;
const setPlan = (routeId: string, examStage: ExamStage2027, plan: AssignmentPlan) => {
  assignmentPlans.set(stageKey(routeId, examStage), plan);
};
const setPlans = (routeIds: string[], examStage: ExamStage2027, plan: AssignmentPlan) => {
  for (const routeId of routeIds) setPlan(routeId, examStage, plan);
};
const link = (venueId: string, role: VenueLinkRole = "fixed"): PrivateMedicalVenueLink2027 => ({
  venueId,
  role,
});

setPlan("jichi-medical--general--general", "first", {
  announcedVenueText: "出願都道府県が指定する学力試験場・面接試験場",
  publicationState: "ticket_assigned",
  conditions: ["university_assigned", "admission_ticket"],
  evidenceLabel: "2027年度学生募集要項 都道府県別試験場一覧",
  knowledgeBaseIds: [
    "fact:jichi-medical--2027--general--prefecture-venue-coverage",
    "fact:jichi-medical--2027--general--first-exam-interview",
  ],
  reviewState: "verified",
  note: "47都道府県で会場が異なります。ホテルは受験票等で試験場を確認してから選んでください。",
});
setPlan("jichi-medical--general--general", "second", {
  venueLinks: [link("venue-jichi-medical-yakushiji-campus")],
  announcedVenueText: "自治医科大学",
  publicationState: "confirmed",
  conditions: ["fixed"],
  evidenceLabel: "2027年度学生募集要項",
  knowledgeBaseIds: ["fact:jichi-medical--2027--general--second-exam"],
  reviewState: "verified",
});

setPlans(
  ["saitama-medical--general--general-early", "saitama-medical--general--general-late"],
  "first",
  {
    venueLinks: [link("venue-tokyo-ryutsu-center")],
    announcedVenueText: "東京流通センター 第一展示場・第二展示場",
    publicationState: "confirmed",
    conditions: ["fixed"],
    evidenceLabel: "2027年度学生募集要項 試験会場",
    knowledgeBaseIds: [
      "fact:saitama-medical--2027--fact--general-early-venues",
      "fact:saitama-medical--2027--fact--general-late-venues",
    ],
    reviewState: "verified",
  },
);
setPlans(
  [
    "saitama-medical--general--general-early",
    "saitama-medical--general--general-late",
    "saitama-medical--common--common-test",
  ],
  "second",
  {
    venueLinks: [link("venue-saitama-medical-katolosta-tower")],
    announcedVenueText: "埼玉医科大学 毛呂山キャンパス カタロスタワー",
    publicationState: "confirmed",
    conditions: ["fixed"],
    evidenceLabel: "2027年度学生募集要項 試験会場",
    knowledgeBaseIds: ["fact:saitama-medical--2027--fact--common-test-venues"],
    reviewState: "verified",
  },
);

setPlan("iuhw--general--general", "second", {
  announcedVenueText: "希望を考慮して大学が試験場を指定",
  publicationState: "ticket_assigned",
  conditions: ["applicant_preference", "university_assigned", "admission_ticket"],
  evidenceLabel: "2027年度学生募集要項",
  knowledgeBaseIds: ["fact:iuhw-2027-general-second-exam-01"],
  reviewState: "verified",
  note: "日程だけでなく試験場も大学指定です。指定前に特定会場向けのホテルを予約しないでください。",
});

setPlan("kyorin--general--general", "first", {
  venueLinks: [link("venue-toc-gotanda", "primary"), link("venue-kyorin-mitaka-campus", "overflow")],
  announcedVenueText: "五反田TOC（定員超過時は三鷹キャンパス）",
  publicationState: "confirmed",
  conditions: ["university_assigned", "admission_ticket", "capacity_overflow"],
  evidenceLabel: "2027年度学生募集要項 試験会場",
  knowledgeBaseIds: ["fact:kyorin-2027-general--venues"],
  reviewState: "verified",
  note: "最終会場は受験票発行時に大学が指定します。",
});
setPlans(["kyorin--general--general", "kyorin--common--common-test"], "second", {
  venueLinks: [link("venue-kyorin-mitaka-campus")],
  announcedVenueText: "杏林大学 三鷹キャンパス",
  publicationState: "confirmed",
  conditions: ["fixed"],
  evidenceLabel: "2027年度学生募集要項 試験会場",
  knowledgeBaseIds: ["fact:kyorin-2027-general--venues", "fact:kyorin-2027-common--venue"],
  reviewState: "verified",
});

setPlans(
  [
    "juntendo--general--general-method-a",
    "juntendo--general--general-method-b",
    "juntendo--common--common-test-early",
    "juntendo--common--common-general-combined",
  ],
  "first",
  {
    venueLinks: [link("venue-makuhari-messe")],
    announcedVenueText: "幕張メッセ 国際展示場1～3ホール",
    publicationState: "confirmed",
    conditions: ["fixed"],
    evidenceLabel: "2027年度医学部学生募集要項 試験会場",
    knowledgeBaseIds: ["fact:juntendo-2027-fact-venue-makuhari"],
    reviewState: "verified",
  },
);
setPlans(
  [
    "juntendo--general--general-method-a",
    "juntendo--general--general-method-b",
    "juntendo--common--common-test-early",
    "juntendo--common--common-general-combined",
    "juntendo--common--common-test-late",
  ],
  "second",
  {
    venueLinks: [link("venue-juntendo-hongo-century-tower")],
    announcedVenueText: "順天堂大学 本郷・お茶の水キャンパス センチュリータワー",
    publicationState: "confirmed",
    conditions: ["fixed"],
    evidenceLabel: "2027年度医学部学生募集要項 試験会場",
    knowledgeBaseIds: ["fact:juntendo-2027-fact-venue-hongo"],
    reviewState: "verified",
  },
);

setPlans(["toho--general--general", "toho--general--unified"], "first", {
  venueLinks: [link("venue-toc-gotanda")],
  announcedVenueText: "五反田TOCビル",
  publicationState: "confirmed",
  conditions: ["fixed"],
  evidenceLabel: "大学公式2027年度入試概要",
  reviewState: "monitoring",
  note: "完成版募集要項の公開後に、使用フロア・入口を再確認してください。",
});
setPlans(["toho--general--general", "toho--general--unified"], "second", {
  announcedVenueText: "東邦大学 大森キャンパス",
  publicationState: "city_or_campus_only",
  conditions: ["fixed"],
  evidenceLabel: "大学公式2027年度入試概要",
  reviewState: "monitoring",
  note: "キャンパスまでは公表済みです。完成版募集要項で棟・入口を確認してください。",
});

setPlans(["teikyo--general--general", "teikyo--common--common-test-early"], "second", {
  venueLinks: [link("venue-teikyo-itabashi-campus")],
  announcedVenueText: "帝京大学 板橋キャンパス",
  publicationState: "confirmed",
  conditions: ["fixed"],
  evidenceLabel: "2027年度入学試験要項 医学部適用試験場",
  knowledgeBaseIds: ["fact:teikyo-2027--university--itabashi-venue"],
  reviewState: "verified",
});

setPlans(["marianna--general--general-early", "marianna--general--general-late"], "first", {
  venueLinks: [link("venue-pacifico-yokohama-north")],
  announcedVenueText: "パシフィコ横浜ノース 1階",
  publicationState: "confirmed",
  conditions: ["fixed"],
  evidenceLabel: "2027年度選抜要項 試験会場・時間割",
  knowledgeBaseIds: ["fact:st_marianna__fact_general_venues_timetable"],
  reviewState: "verified",
});
setPlans(
  ["marianna--general--general-early", "marianna--general--general-late", "marianna--common--common-test"],
  "second",
  {
    venueLinks: [link("venue-marianna-sugao-campus")],
    announcedVenueText: "聖マリアンナ医科大学 本学校舎",
    publicationState: "confirmed",
    conditions: ["fixed"],
    evidenceLabel: "2027年度選抜要項 試験会場・時間割",
    knowledgeBaseIds: ["fact:st_marianna__fact_general_venues_timetable"],
    reviewState: "verified",
  },
);

const kansaiFirstVenueLinks = [
  link("venue-kansai-medical-atc-hall", "choice"),
  link("venue-tokyo-ryutsu-center", "choice"),
  link("venue-nagoya-convention-hall", "choice"),
  link("venue-fukuoka-minami-kindai-building", "choice"),
];
setPlans(
  [
    "kansai-medical--general--general-early",
    "kansai-medical--general--general-regional-quota-c5d34-385a3",
    "kansai-medical--common--common-general-combined",
  ],
  "first",
  {
    venueLinks: kansaiFirstVenueLinks,
    announcedVenueText: "大阪ATCホール・東京流通センター・名古屋コンベンションホール・福岡南近代ビル",
    publicationState: "confirmed",
    conditions: ["applicant_preference"],
    evidenceLabel: "2027年度入学試験要項 第1次試験会場",
    evidenceLocator: "PDF 13〜26ページの方式別会場欄",
    knowledgeBaseIds: ["fact:kansai-medical-2027--general-early--first-exam-venues"],
    reviewState: "verified",
    note: "予定定員を超えた会場は出願できません。出願画面と受験票で最終確認してください。",
  },
);
setPlans(
  [
    "kansai-medical--general--general-early",
    "kansai-medical--general--general-regional-quota-c5d34-385a3",
    "kansai-medical--general--general-late",
    "kansai-medical--common--common-test-early",
    "kansai-medical--common--common-general-combined",
    "kansai-medical--common--common-test-late",
  ],
  "second",
  {
    venueLinks: [link("venue-kansai-medical-hirakata-medicine-building")],
    announcedVenueText: "関西医科大学 枚方キャンパス 医学部棟",
    publicationState: "confirmed",
    conditions: ["fixed"],
    evidenceLabel: "2027年度入学試験要項 第2次試験会場",
    knowledgeBaseIds: ["fact:kansai-medical-2027--university--main-campus-venue"],
    reviewState: "verified",
  },
);
setPlan("kansai-medical--general--general-late", "first", {
  venueLinks: [link("venue-kansai-medical-hirakata-medicine-building")],
  announcedVenueText: "関西医科大学 枚方キャンパス 医学部棟",
  publicationState: "confirmed",
  conditions: ["fixed"],
  evidenceLabel: "2027年度入学試験要項 第1次試験会場",
  knowledgeBaseIds: ["fact:kansai-medical-2027--general-late--first-exam"],
  reviewState: "verified",
});

setPlans(
  ["hyogo-medical--general--general-regional-quota-3470a", "hyogo-medical--general--general"],
  "first",
  {
    announcedVenueText: "大阪・東京・福岡（西宮キャンパスでは実施なし）",
    publicationState: "city_or_campus_only",
    conditions: ["applicant_preference", "capacity_overflow"],
    evidenceLabel: "2027年度入学試験要項",
    evidenceLocator: "PDF 7・13〜26・39ページ",
    knowledgeBaseIds: ["fact:hyogo-medical--2027--fact--first-exam--general-a-b"],
    reviewState: "needs_review",
    note: "都市と出願条件は公表済みですが、この台帳では会場施設・住所の最終照合中です。",
  },
);
setPlans(
  ["hyogo-medical--general--general-regional-quota-3470a", "hyogo-medical--general--general"],
  "second",
  {
    venueLinks: [link("venue-hyogo-medical-nishinomiya-campus")],
    announcedVenueText: "兵庫医科大学 西宮キャンパス",
    publicationState: "confirmed",
    conditions: ["fixed"],
    evidenceLabel: "2027年度入学試験要項",
    knowledgeBaseIds: [
      "fact:hyogo-medical--2027--fact--second-exam--general-a--01",
      "fact:hyogo-medical--2027--fact--second-exam--general-b",
    ],
    reviewState: "verified",
  },
);

setPlans(["uoeh--common--general-method-a", "uoeh--general--general-method-b"], "first", {
  venueLinks: [link("venue-kitakyushu-messe", "choice"), link("venue-bellesalle-shiodome", "choice")],
  announcedVenueText: "北九州メッセ・ベルサール汐留から希望",
  publicationState: "confirmed",
  conditions: ["applicant_preference", "capacity_overflow", "university_assigned"],
  evidenceLabel: "2027年度入学者選抜実施要項",
  reviewState: "monitoring",
  note: "東京会場が定員超過の場合、一部受験者は北九州会場へ変更されます。完成版募集要項でも再確認してください。",
});
setPlans(
  ["uoeh--common--general-method-a", "uoeh--general--general-method-b", "uoeh--common--general-method-c"],
  "second",
  {
    venueLinks: [link("venue-uoeh-main-campus")],
    announcedVenueText: "産業医科大学 本学",
    publicationState: "confirmed",
    conditions: ["fixed"],
    evidenceLabel: "2027年度入学者選抜実施要項",
    reviewState: "monitoring",
  },
);

const setAreaPlan = (
  routeIds: string[],
  examStage: ExamStage2027,
  announcedVenueText: string,
  conditions: VenueAssignmentCondition[],
  note?: string,
) =>
  setPlans(routeIds, examStage, {
    announcedVenueText,
    publicationState: "city_or_campus_only",
    conditions,
    evidenceLabel: "大学公式2027年度入試資料",
    reviewState: "monitoring",
    note,
  });

setAreaPlan(
  ["kanazawa-medical--general--general-early"],
  "first",
  "本学・東京・大阪・名古屋・福岡",
  ["applicant_preference"],
  "都市・本学までは公表済みです。各都市の正式施設名と住所は募集要項・受験票で確認してください。",
);
setAreaPlan(
  ["kanazawa-medical--general--general-late"],
  "first",
  "本学・東京・大阪",
  ["applicant_preference"],
  "各都市の正式施設名と住所は募集要項・受験票で確認してください。",
);
setAreaPlan(
  ["kanazawa-medical--general--general-early", "kanazawa-medical--general--general-late"],
  "second",
  "金沢医科大学 本学",
  ["fixed"],
  "本学の使用棟・入口を受験票で確認してください。",
);
setAreaPlan(
  ["aichi-medical--general--general"],
  "first",
  "名古屋・東京・大阪・福岡",
  ["applicant_preference"],
  "正式施設名は募集要項・受験票の会場欄を確認してください。",
);
setAreaPlan(
  [
    "aichi-medical--general--general",
    "aichi-medical--common--common-test",
    "aichi-medical--common--common-test-regional-quota",
  ],
  "second",
  "愛知医科大学 本学",
  ["applicant_preference"],
  "一般・共テ利用は希望日を出願時に選択します。使用棟・入口は受験票を確認してください。",
);
setAreaPlan(
  ["fujita--general--general-regional-quota-17148"],
  "first",
  "東京・名古屋・大阪",
  ["applicant_preference"],
  "完成版学生募集要項の正式施設名を確認後にホテルを選んでください。",
);
setAreaPlan(
  ["fujita--general--general-regional-quota-17148", "fujita--common--common-test"],
  "second",
  "藤田医科大学 本学",
  ["university_assigned"],
  "日付の指定方法と使用棟は完成版学生募集要項・受験票で確認してください。",
);
setAreaPlan(
  ["osaka-med-pharm--general--general-regional-quota-385a3-early"],
  "first",
  "大阪・愛知・東京",
  ["applicant_preference"],
  "正式施設名は完成版入学試験要項で確認してください。",
);
setAreaPlan(["osaka-med-pharm--general--general-late"], "first", "大阪・東京", ["applicant_preference"]);
setAreaPlan(
  [
    "osaka-med-pharm--general--general-regional-quota-385a3-early",
    "osaka-med-pharm--general--general-late",
    "osaka-med-pharm--common--common-test",
  ],
  "second",
  "大阪医科薬科大学 本部キャンパス",
  ["fixed"],
  "使用棟・入口は完成版入学試験要項・受験票で確認してください。",
);
setAreaPlan(
  ["kindai--general--general-early", "kindai--general--general-regional-quota-c5d34-385a3-3f44f-early"],
  "first",
  "大阪・東京・名古屋・広島・福岡",
  ["applicant_preference"],
  "2027年度入学試験要項で正式施設名が公表されるまで、特定会場向けホテルは掲載しません。",
);
setAreaPlan(
  ["kindai--general--general-late", "kindai--general--general-regional-quota-c5d34-late"],
  "first",
  "大阪・東京",
  ["applicant_preference"],
);
setAreaPlan(
  [
    "kindai--general--general-early",
    "kindai--general--general-regional-quota-c5d34-385a3-3f44f-early",
    "kindai--general--general-late",
    "kindai--general--general-regional-quota-c5d34-late",
    "kindai--common--common-test-early",
    "kindai--common--common-test-middle",
    "kindai--common--common-test-late",
  ],
  "second",
  "近畿大学 おおさかメディカルキャンパス",
  ["fixed"],
  "キャンパスの使用棟・入口を2027年度入学試験要項・受験票で確認してください。",
);
setAreaPlan(
  ["fukuoka--general--general"],
  "first",
  "福岡・東京・名古屋・大阪",
  ["applicant_preference"],
  "2027年度入試ガイドは都市まで公表。正式施設名の公表前は特定ホテルを案内しません。",
);
setAreaPlan(
  ["fukuoka--general--general", "fukuoka--common--common-test-phase-1"],
  "second",
  "福岡会場",
  ["fixed"],
  "正式施設名・住所の公表後にホテル案内を追加します。",
);

// 2026-08-12に2027年度の大学公式一次資料を再照合した全方式・実地段階の最終値。
// 上の初期調査値を残しつつ、同じroute/stageキーをここで上書きする。
const officialVenuePlan = (
  routeIds: string[],
  examStage: ExamStage2027,
  plan: AssignmentPlan,
) => setPlans(routeIds, examStage, plan);

const unpublishedVenuePlan = (
  routeIds: string[],
  examStage: ExamStage2027,
  officialAdmissionUrl: string,
  note = "2027年度の正式会場は未公表です。前年会場を推測せず、募集要項または受験票の公表を待ってください。",
  publicationState: VenuePublicationState = "unpublished",
) =>
  setPlans(routeIds, examStage, {
    announcedVenueText: publicationState === "conflict" ? "方式の実施・会場とも確認中" : "2027年度の正式会場は未公表",
    publicationState,
    conditions: [],
    officialAdmissionUrl,
    evidenceLabel: "大学公式2027年度入試ページ",
    reviewState: publicationState === "conflict" ? "needs_review" : "monitoring",
    note,
  });

const areaVenuePlan = (
  routeIds: string[],
  examStage: ExamStage2027,
  announcedVenueText: string,
  announcedPrefectures: string[],
  conditions: VenueAssignmentCondition[],
  officialAdmissionUrl: string,
  evidenceLocator: string,
  note: string,
  venueLinks: PrivateMedicalVenueLink2027[] = [],
) =>
  setPlans(routeIds, examStage, {
    venueLinks,
    announcedPrefectures,
    announcedVenueText,
    publicationState: "city_or_campus_only",
    conditions,
    officialAdmissionUrl,
    evidenceLabel: "大学公式2027年度入試資料",
    evidenceLocator,
    reviewState: "verified",
    note,
  });

const iwateVenueUrl = "https://www.imu-admission.jp/guidelines/gl_gaiyou/";
officialVenuePlan(["iwate-medical--general--general"], "first", {
  venueLinks: [link("venue-iwate-medical-yahaba-campus", "choice")],
  announcedPrefectures: ["岩手県", "東京都", "大阪府", "北海道", "愛知県", "福岡県"],
  announcedVenueText: "岩手医科大学 矢巾キャンパス・東京・大阪・札幌・名古屋・福岡",
  publicationState: "confirmed",
  conditions: ["applicant_preference"],
  officialAdmissionUrl: iwateVenueUrl,
  evidenceLabel: "大学公式2027年度入試概要・FAQ",
  evidenceLocator: "医学部 一般選抜一次「試験会場」・FAQ「希望の会場で受験できるか」",
  reviewState: "verified",
  note: "矢巾キャンパスは正式会場として公表済みです。東京・大阪・札幌・名古屋・福岡は都市までの公表で、学外施設名は後続の公式資料で確認してください。",
});
officialVenuePlan(["iwate-medical--general--general"], "second", {
  venueLinks: [link("venue-iwate-medical-yahaba-campus", "choice")],
  announcedPrefectures: ["岩手県", "東京都", "大阪府"],
  announcedVenueText: "岩手医科大学 矢巾キャンパス・東京・大阪",
  publicationState: "confirmed",
  conditions: ["applicant_preference"],
  officialAdmissionUrl: iwateVenueUrl,
  evidenceLabel: "大学公式2027年度入試概要・FAQ",
  evidenceLocator: "医学部 一般選抜二次「試験会場」・FAQ「二次試験の受験日・試験地」",
  reviewState: "verified",
  note: "矢巾キャンパスは正式会場として公表済みです。東京・大阪の正式施設と、二次試験の会場選択・指定方法は学生募集要項で確認してください。",
});

const tohokuVenueUrl = "https://www.tohoku-mpu.ac.jp/admission/medicine-application/";
officialVenuePlan(["tohoku-med-pharm--general--general"], "first", {
  venueLinks: [
    link("venue-tohoku-med-pharm-komatsushima-campus", "choice"),
    link("venue-grand-cube-osaka", "choice"),
    link("venue-acu-a-asty45", "choice"),
  ],
  announcedPrefectures: ["宮城県", "東京都", "大阪府", "北海道"],
  announcedVenueText: "仙台：東北医科薬科大学（小松島キャンパス）／東京：正式施設は現在調整中／大阪：グランキューブ大阪（大阪府立国際会議場）／札幌：ACU-A（アスティ45）",
  publicationState: "city_or_campus_only",
  conditions: ["admission_ticket"],
  officialAdmissionUrl: tohokuVenueUrl,
  evidenceLabel: "大学公式2027年度 医学部募集概要",
  evidenceLocator: "一般選抜「一次試験期日」「実施都市」",
  reviewState: "monitoring",
  note: "2027年度入学者選抜ガイドでは一般選抜一次の試験地を宮城・東京・大阪・北海道と公表しています。募集概要で正式施設を確認できるのは小松島キャンパス、グランキューブ大阪、ACU-Aで、東京は現在調整中です。試験地の選択・指定方法と東京の正式施設は、9月頃公開予定の学生募集要項および受験票で確認してください。年次表示のない会場一覧に残るベルサール渋谷ガーデン・TOCビルは2027会場として結合していません。",
});
officialVenuePlan(
  ["tohoku-med-pharm--general--general", "tohoku-med-pharm--common--common-test"],
  "second",
  {
    venueLinks: [link("venue-tohoku-med-pharm-komatsushima-campus")],
    announcedVenueText: "東北医科薬科大学 小松島キャンパス",
    publicationState: "confirmed",
    conditions: ["fixed"],
    officialAdmissionUrl: tohokuVenueUrl,
    evidenceLabel: "2027年度 医学部入学試験会場一覧",
    evidenceLocator: "公式ページ「一般選抜 第2次試験」「大学入学共通テスト利用選抜 第2次試験」",
    reviewState: "verified",
  },
);

officialVenuePlan(["jichi-medical--general--general"], "first", {
  venueLinks: privateMedicalJichiVenueRelations2027,
  announcedPrefectures: [...new Set(privateMedicalJichiVenueRelations2027.map((relation) => relation.applicantPrefecture))],
  announcedVenueText: "出願都道府県別の学力試験場・面接試験場（正式施設・試験室を公表済み）",
  publicationState: "confirmed",
  conditions: ["fixed", "admission_ticket"],
  officialAdmissionUrl: JICHI_2027_GUIDELINE_URL,
  evidenceLabel: "令和9年度入学者募集要項 都道府県別試験場一覧",
  evidenceLocator: "PDF 29〜30ページ",
  knowledgeBaseIds: [
    "fact:jichi-medical--2027--general--prefecture-venue-coverage",
    "fact:jichi-medical--2027--general--first-exam-interview",
  ],
  reviewState: "verified",
  note: "出願した都道府県ごとの学力試験場・面接試験場が公式一覧で確定しています。やむを得ない事情による変更は大学・都道府県の案内と受験票を優先してください。",
});

const dokkyoVenueUrl = "https://www.dokkyomed.ac.jp/dusm/exam/";
const dokkyoRoutes = [
  "dokkyo-medical--general--general-regional-quota-3ffd7-71665-early",
  "dokkyo-medical--general--general-late",
];
unpublishedVenuePlan(dokkyoRoutes, "first", dokkyoVenueUrl);
unpublishedVenuePlan(dokkyoRoutes, "second", dokkyoVenueUrl);

const iuhwVenueUrl = "https://narita.iuhw.ac.jp/gakubu/igakubu/admission/doc/guideline_app.pdf?ver=3";
officialVenuePlan(["iuhw--general--general"], "first", {
  venueLinks: [
    link("venue-iuhw-narita-campus", "choice"),
    link("venue-toc-gotanda", "choice"),
    link("venue-iuhw-tokyo-akasaka-campus", "overflow"),
    link("venue-tkp-osaka-riverside-hotel", "choice"),
    link("venue-iuhw-graduate-school-fukuoka-campus", "choice"),
  ],
  announcedVenueText: "成田キャンパス・五反田TOC・大阪リバーサイドホテル・福岡キャンパス（東京超過時は赤坂）",
  publicationState: "confirmed",
  conditions: ["applicant_preference", "university_assigned", "admission_ticket", "capacity_overflow"],
  officialAdmissionUrl: iuhwVenueUrl,
  evidenceLabel: "2027年度医学部学生募集要項",
  evidenceLocator: "PDF 10・32〜33ページ",
  reviewState: "verified",
  note: "出願時に試験地を選択します。収容人数を超えた場合は東京赤坂キャンパス又は選択地域近隣へ変更されるため、受験票で最終確認してください。",
});
officialVenuePlan(["iuhw--general--general"], "second", {
  venueLinks: [link("venue-iuhw-narita-campus", "choice"), link("venue-iuhw-tokyo-akasaka-campus", "choice")],
  announcedVenueText: "成田キャンパス又は東京赤坂キャンパス",
  publicationState: "ticket_assigned",
  conditions: ["applicant_preference", "university_assigned", "admission_ticket"],
  officialAdmissionUrl: iuhwVenueUrl,
  evidenceLabel: "2027年度医学部学生募集要項",
  evidenceLocator: "PDF 10ページ（第2次選考）",
  knowledgeBaseIds: ["fact:iuhw-2027-general-second-exam-01"],
  reviewState: "verified",
  note: "希望を考慮して大学が試験日と会場を指定し、マイページ・受験票で通知します。",
});
officialVenuePlan(["iuhw--common--common-test"], "second", {
  venueLinks: [link("venue-iuhw-tokyo-akasaka-campus")],
  announcedVenueText: "国際医療福祉大学 東京赤坂キャンパス",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: iuhwVenueUrl,
  evidenceLabel: "2027年度医学部学生募集要項",
  evidenceLocator: "PDF 12〜13・33ページ",
  reviewState: "verified",
  note: "2/16の学力・小論文と2/20の面接はいずれも東京赤坂キャンパスです。",
});

const keioVenueUrl = "https://www.keio.ac.jp/ja/admissions/faculty/examinations/general-admissions/";
unpublishedVenuePlan(["keio--general--general"], "first", keioVenueUrl);
unpublishedVenuePlan(["keio--general--general"], "second", keioVenueUrl);

const showaVenueUrl = "https://adm.showa-u.ac.jp/albums/abm.php?d=2405&f=abm00072419.pdf";
const showaRoutes = ["showa-medical--general--general-phase-1", "showa-medical--general--general-phase-1-phase-2"];
officialVenuePlan(showaRoutes, "first", {
  venueLinks: [
    link("venue-toc-gotanda", "primary"),
    link("venue-showa-medical-hatanodai-campus", "overflow"),
  ],
  announcedVenueText: "五反田TOCビル（定員超過時は昭和医科大学 旗の台キャンパス）",
  publicationState: "confirmed",
  conditions: ["university_assigned", "admission_ticket", "capacity_overflow"],
  officialAdmissionUrl: showaVenueUrl,
  evidenceLabel: "2027年度入学試験要項",
  evidenceLocator: "PDF 13ページ（冊子10ページ）医学部一般選抜Ⅰ期・Ⅱ期〈一次試験〉試験場",
  reviewState: "verified",
  note: "試験場は選択できません。五反田TOCビルの定員を超過した場合に旗の台キャンパスとなる可能性があるため、受験票で指定会場を確認してください。",
});
officialVenuePlan(showaRoutes, "second", {
  venueLinks: [link("venue-showa-medical-hatanodai-campus", "fixed")],
  announcedVenueText: "昭和医科大学 旗の台キャンパス",
  publicationState: "confirmed",
  conditions: ["fixed", "admission_ticket"],
  officialAdmissionUrl: showaVenueUrl,
  evidenceLabel: "2027年度入学試験要項",
  evidenceLocator: "PDF 14ページ（冊子11ページ）医学部一般選抜Ⅰ期・Ⅱ期〈二次試験〉",
  reviewState: "verified",
  note: "Ⅰ期は2月13日または14日を出願時に選択し、Ⅱ期は3月13日です。試験室は当日朝掲示のため、受験票と現地案内を確認してください。",
});
officialVenuePlan(["teikyo--general--general"], "first", {
  venueLinks: [link("venue-teikyo-itabashi-campus")],
  announcedVenueText: "帝京大学 板橋キャンパス",
  publicationState: "confirmed",
  conditions: ["fixed", "applicant_preference"],
  officialAdmissionUrl: "https://www.teikyo-u.ac.jp/application/files/2417/8409/4616/02_2027.pdf",
  evidenceLabel: "2027年度入学試験要項",
  evidenceLocator: "PDF 79〜80ページ",
  reviewState: "verified",
  note: "一般選抜は1〜3日を自由選択できますが、会場は板橋キャンパスで固定です。",
});

const tokyoMedicalVenueUrl =
  "https://admissions-tokyo-med.jp/wp-content/uploads/2024/12/2027bosyuyoukou_ippan.pdf";
officialVenuePlan(["tokyo-medical--general--general"], "first", {
  venueLinks: [
    link("venue-tokyo-medical-shinjuku-campus", "primary"),
    link("venue-bellesalle-shinjuku-grand", "primary"),
  ],
  announcedVenueText: "東京医科大学 本学又はベルサール新宿グランド",
  publicationState: "ticket_assigned",
  conditions: ["university_assigned", "admission_ticket"],
  officialAdmissionUrl: tokyoMedicalVenueUrl,
  evidenceLabel: "2027年度一般選抜・共通テスト利用選抜 学生募集要項",
  evidenceLocator: "PDF 3・14〜15ページ「一般選抜 第1次試験」「試験会場」「受験にあたっての主な注意事項」",
  reviewState: "verified",
  note: "一次は2027年2月6日で、8:30開門、9:10集合です。大学が受験番号で本学またはベルサール新宿グランドを指定するため、受験票に記載された会場を確認してください。ベルサールは1階イベントホールまで公表されていますが、使用区画・受付位置・受験生入口は未公表です。",
});
officialVenuePlan(["tokyo-medical--common--common-test"], "first", {
  venueLinks: [link("venue-tokyo-medical-shinjuku-campus")],
  announcedVenueText: "東京医科大学 本学（大学実施の小論文）",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: "https://admissions-tokyo-med.jp/med/exam/",
  evidenceLabel: "2027年度一般選抜・共通テスト利用選抜",
  evidenceLocator: "公式入試ページ「共通テスト利用選抜 試験会場」",
  reviewState: "verified",
  note: "共通テスト本試験会場はこの台帳の対象外です。大学が実施する2/6の小論文会場のみ収録しています。",
});
officialVenuePlan(["tokyo-medical--general--general", "tokyo-medical--common--common-test"], "second", {
  venueLinks: [link("venue-tokyo-medical-shinjuku-campus")],
  announcedVenueText: "東京医科大学 本学",
  publicationState: "confirmed",
  conditions: ["fixed", "university_assigned"],
  officialAdmissionUrl:
    "https://admissions-tokyo-med.jp/wp-content/uploads/2024/12/2027bosyuyoukou_ippan.pdf",
  evidenceLabel: "2027年度一般選抜学生募集要項",
  evidenceLocator: "PDF 3・12ページ「二次試験」",
  reviewState: "verified",
  note: "会場は本学で固定です。面接日は出願の早い方から2月13日・14日の順に割り振られ、一次合格発表時にUCAROで日程・集合時間が通知されます。",
});

const jikeiVenueUrl = "https://www.jikei.ac.jp/university/medicine/admission/summary/";
officialVenuePlan(["jikei--general--general"], "first", {
  venueLinks: [link("venue-toc-gotanda")],
  announcedVenueText: "五反田TOCビル本館",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: jikeiVenueUrl,
  evidenceLabel: "2027年度医学科入学試験概要",
  evidenceLocator: "公式ページ「一次試験」",
  reviewState: "verified",
});
officialVenuePlan(["jikei--general--general"], "second", {
  venueLinks: [link("venue-jikei-nishishimbashi-campus")],
  announcedVenueText: "東京慈恵会医科大学 西新橋キャンパス",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: jikeiVenueUrl,
  evidenceLabel: "2027年度医学科入学試験概要",
  evidenceLocator: "公式ページ「二次試験」",
  reviewState: "verified",
  note: "2027年2月20日・21日・22日のうち1日に西新橋キャンパスで実施されます。個別の試験日・集合時刻、使用棟・階・試験室・受付位置・受験生入口は現行の2027年度入試概要では未公表です。医学科の学生募集要項ページには2026年度版だけが掲載されているため、後日公開される2027年度学生募集要項と受験票を確認してください。",
});

const twmuVenueUrl = "https://www.twmu-u.jp/wp-content/uploads/2026/07/c9586e74cb77a02ee36ecf565fb6264f.pdf";
officialVenuePlan(["tokyo-womens-medical--general--general-regional-quota"], "first", {
  venueLinks: [link("venue-keio-plaza-hotel-tokyo")],
  announcedVenueText: "京王プラザホテル（東京）",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: twmuVenueUrl,
  evidenceLabel: "2027年度医学部学生募集要項",
  evidenceLocator: "PDF 23ページ「試験会場」",
  reviewState: "verified",
});
officialVenuePlan(["tokyo-womens-medical--general--general-regional-quota"], "second", {
  venueLinks: [link("venue-twmu-yayoi-memorial-education-building")],
  announcedVenueText: "東京女子医科大学 彌生記念教育棟",
  publicationState: "confirmed",
  conditions: ["fixed", "applicant_preference", "university_assigned"],
  officialAdmissionUrl: twmuVenueUrl,
  evidenceLabel: "2027年度医学部学生募集要項",
  evidenceLocator: "PDF 23ページ「試験会場」",
  reviewState: "verified",
  note: "2027年2月13日・14日・15日のうち1日に実施されます。Web出願時に希望日を選択できますが、希望に沿わない場合があり、どの日でも受験できる場合は希望日を選択しないよう大学が案内しています。個別の試験日・集合場所・集合時刻は一次試験合格発表時に公表され、指定時刻に遅れると原則受験できません。会場は彌生記念教育棟まで確定していますが、使用階・試験室・受付位置・受験生入口は未公表です。会場の下見と写真撮影は行わず、一次試験合格発表時の案内と当日掲示を確認してください。",
});

officialVenuePlan(["toho--general--general"], "first", {
  venueLinks: [link("venue-toc-gotanda")],
  announcedVenueText: "五反田TOCビル",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: "https://www.toho-u.ac.jp/med/info_exam/ippan.html",
  evidenceLabel: "大学公式2027年度一般入試概要",
  evidenceLocator: "公式ページ「試験会場」",
  reviewState: "verified",
  note: "公式入試概要で五反田TOCビルまで確定しています。使用フロア・入口は受験票で確認してください。",
});
officialVenuePlan(["toho--general--unified"], "first", {
  venueLinks: [link("venue-toc-gotanda")],
  announcedVenueText: "五反田TOCビル",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: "https://www.toho-u.ac.jp/med/info_exam/sum.html",
  evidenceLabel: "大学公式2027年度統一入試概要",
  evidenceLocator: "公式ページ「試験会場」",
  reviewState: "verified",
  note: "公式入試概要で五反田TOCビルまで確定しています。使用フロア・入口は受験票で確認してください。",
});
officialVenuePlan(["toho--general--general"], "second", {
  venueLinks: [link("venue-toho-omori-campus")],
  announcedVenueText: "東邦大学 大森キャンパス",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: "https://www.toho-u.ac.jp/med/info_exam/ippan.html",
  evidenceLabel: "大学公式2027年度一般入試概要",
  evidenceLocator: "公式ページ「試験日」「試験場」",
  reviewState: "verified",
  note: "2027年2月15日・16日のいずれか1日に大森キャンパスで実施されます。現時点の公式入試概要は、受験者ごとの日付決定方法、集合・入場時刻、使用棟・階・試験室・受付位置・受験生入口を公表していません。医学部の2027年度学生募集要項は作成中のため、公開後の要項、受験票、一次試験合格者向け案内、当日掲示で確認してください。",
});
officialVenuePlan(["toho--general--unified"], "second", {
  venueLinks: [link("venue-toho-omori-campus")],
  announcedVenueText: "東邦大学 大森キャンパス",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: "https://www.toho-u.ac.jp/med/info_exam/sum.html",
  evidenceLabel: "大学公式2027年度統一入試概要",
  evidenceLocator: "公式ページ「試験日」「試験場」",
  reviewState: "verified",
  note: "2027年3月3日に大森キャンパスで実施されます。現時点の公式入試概要は、集合・入場時刻、使用棟・階・試験室・受付位置・受験生入口を公表していません。医学部の2027年度学生募集要項は作成中のため、公開後の要項、受験票、一次試験合格者向け案内、当日掲示で確認してください。",
});

const nihonVenueUrl = "https://www.nihon-u.ac.jp/admission_info/application/general_information/general/n_system/";
areaVenuePlan(
  ["nihon--general--unified-phase-1"],
  "first",
  "札幌・仙台・郡山・つくば・佐野・高崎・千葉・東京・東京（八王子）・横浜・湘南・新潟・長野・三島・名古屋・大阪・広島・福岡・長崎・宮崎",
  [
    "北海道",
    "宮城県",
    "福島県",
    "茨城県",
    "栃木県",
    "群馬県",
    "千葉県",
    "東京都",
    "神奈川県",
    "新潟県",
    "長野県",
    "静岡県",
    "愛知県",
    "大阪府",
    "広島県",
    "福岡県",
    "長崎県",
    "宮崎県",
  ],
  ["applicant_preference", "university_assigned", "capacity_overflow"],
  nihonVenueUrl,
  "N全学統一方式 第1期「試験場」",
  "試験都市までの公表です。収容人数等により希望試験場以外に指定される場合があります。",
);
areaVenuePlan(
  ["nihon--general--unified-phase-2"],
  "first",
  "郡山・千葉・東京・湘南",
  ["福島県", "千葉県", "東京都", "神奈川県"],
  [],
  nihonVenueUrl,
  "N全学統一方式 第2期「試験場」",
  "試験都市までの公表です。個別施設名と試験場の選択・指定条件は、2027年度の現行公式資料では確認できません。",
);
officialVenuePlan(["nihon--general--unified-phase-1"], "second", {
  venueLinks: [link("venue-nihon-medical-school-building")],
  announcedVenueText: "日本大学 医学部校舎",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: nihonVenueUrl,
  evidenceLabel: "2027年度N全学統一方式 試験場案内",
  evidenceLocator: "N方式第1期 医学部二次試験日・試験場欄",
  reviewState: "verified",
  note: "一次試験合格者を対象に、2027年2月11日に医学部校舎で実施されます。現行の2027年度N方式公式案内は、集合・入場・開始時刻、使用棟・階・試験室・受付位置・受験生入口を公表していません。募集要項、受験票、一次試験合格者向け案内、当日掲示で確認してください。",
});
officialVenuePlan(["nihon--general--unified-phase-2"], "second", {
  venueLinks: [link("venue-nihon-medical-school-building")],
  announcedVenueText: "日本大学 医学部校舎",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: nihonVenueUrl,
  evidenceLabel: "2027年度N全学統一方式 試験場案内",
  evidenceLocator: "N方式第2期 医学部二次試験日・試験場欄",
  reviewState: "verified",
  note: "一次試験合格者を対象に、2027年3月17日に医学部校舎で実施されます。現行の2027年度N方式公式案内は、集合・入場・開始時刻、使用棟・階・試験室・受付位置・受験生入口を公表していません。募集要項、受験票、一次試験合格者向け案内、当日掲示で確認してください。",
});
unpublishedVenuePlan(
  ["nihon--general--general-route-regional-quota"],
  "first",
  nihonVenueUrl,
  "2027年度の地域枠選抜は方式・日程・会場とも未公表です。",
);
unpublishedVenuePlan(
  ["nihon--general--general-route-regional-quota"],
  "second",
  nihonVenueUrl,
  "2027年度の地域枠選抜は方式・日程・会場とも未公表です。",
);

const nmsVenueUrl = "https://www.nms.ac.jp/college/nyushi-book/pdf_2027/guidelines_2027.pdf";
const nmsEarlyRoutes = [
  "nippon-medical--general--general-early",
  "nippon-medical--general--general-regional-quota-early",
  "nippon-medical--common--global-special-early",
];
const nmsLateRoutes = [
  "nippon-medical--general--general-late",
  "nippon-medical--general--general-regional-quota-late",
];
officialVenuePlan(nmsEarlyRoutes, "first", {
  venueLinks: [
    link("venue-nippon-medical-musashisakai-campus", "primary"),
    link("venue-bellesalle-shibuya-first", "primary"),
    link("venue-nippon-medical-sendagi-campus", "overflow"),
  ],
  announcedVenueText: "武蔵境校舎・ベルサール渋谷ファースト（定員超過時は千駄木校舎）",
  publicationState: "confirmed",
  conditions: ["university_assigned", "admission_ticket", "capacity_overflow"],
  officialAdmissionUrl: nmsVenueUrl,
  evidenceLabel: "令和9年度入学者選抜実施要項",
  evidenceLocator: "PDF 48〜50ページ",
  knowledgeBaseIds: [
    "fact:fact--2027--nippon-medical--nippon-medical--general--general-early--first-exam--01",
    "relation:nippon-medical-2027--rel--early-first-exam-venues",
  ],
  reviewState: "verified",
  note: "受験票で指定会場を確認してください。定員超過時は千駄木校舎も使用します。",
});
officialVenuePlan(nmsLateRoutes, "first", {
  venueLinks: [link("venue-nippon-medical-musashisakai-campus", "primary"), link("venue-nippon-medical-sendagi-campus", "overflow")],
  announcedVenueText: "武蔵境校舎（定員超過時は千駄木校舎）",
  publicationState: "confirmed",
  conditions: ["university_assigned", "admission_ticket", "capacity_overflow"],
  officialAdmissionUrl: nmsVenueUrl,
  evidenceLabel: "令和9年度入学者選抜実施要項",
  evidenceLocator: "PDF 48〜50ページ",
  knowledgeBaseIds: ["fact:fact--2027--nippon-medical--nippon-medical--general--general-late--first-exam--01"],
  reviewState: "verified",
});
officialVenuePlan([...nmsEarlyRoutes, ...nmsLateRoutes], "second", {
  venueLinks: [link("venue-nippon-medical-sendagi-campus")],
  announcedVenueText: "日本医科大学 千駄木校舎",
  publicationState: "confirmed",
  conditions: ["applicant_preference", "university_assigned"],
  officialAdmissionUrl: nmsVenueUrl,
  evidenceLabel: "令和9年度入学者選抜実施要項",
  evidenceLocator: "PDF 48〜50ページ",
  reviewState: "verified",
  note: "前期は希望日を提出しますが希望に沿えない場合があります。後期は指定日です。",
});

const kitasatoVenueUrl = "https://www.kitasato-u.ac.jp/jp/goukaku/undergraduate_ad/system/newfolder/changes_med.html";
officialVenuePlan(["kitasato--general--general"], "first", {
  venueLinks: [
    link("venue-pacifico-yokohama-north", "primary"),
    link("venue-kitasato-sagamihara-campus", "overflow"),
  ],
  announcedVenueText: "パシフィコ横浜ノース（定員超過時は北里大学 相模原キャンパス）",
  publicationState: "confirmed",
  conditions: ["university_assigned", "admission_ticket", "capacity_overflow"],
  officialAdmissionUrl: "https://www.kitasato-u.ac.jp/jp/goukaku/place/place/tokyo.html",
  evidenceLabel: "北里大学公式 2027年度試験会場案内",
  evidenceLocator: "横浜会場・医学部一般選抜一次試験欄",
  reviewState: "verified",
  note: "定員超過時は一部受験者を相模原キャンパスに指定します。最終会場は受験票で確認してください。",
});
officialVenuePlan(["kitasato--general--general"], "second", {
  venueLinks: [link("venue-kitasato-sagamihara-campus")],
  announcedVenueText: "北里大学 相模原キャンパス",
  publicationState: "confirmed",
  conditions: ["fixed", "applicant_preference"],
  officialAdmissionUrl:
    "https://www.kitasato-u.ac.jp/jp/goukaku/albums/abm.php?f=abm00048838.pdf&n=%E5%85%A5%E8%A9%A6%E3%82%AC%E3%82%A4%E3%83%89_%E8%A9%A6%E9%A8%93%E6%A6%82%E8%A6%81.pdf",
  evidenceLabel: "北里大学公式 2027年度入試ガイド（試験概要）",
  evidenceLocator: "PDF 24ページ 医学部一般選抜二次試験欄",
  reviewState: "verified",
  note: "会場は相模原キャンパスです。2月13日〜15日から受験日を出願時に選択します。",
});
unpublishedVenuePlan(
  ["kitasato--general--general-regional-quota"],
  "first",
  kitasatoVenueUrl,
  "地域枠一般選抜は2027年度の実施自体が未定で、会場も確定していません。",
  "conflict",
);
unpublishedVenuePlan(
  ["kitasato--general--general-regional-quota"],
  "second",
  kitasatoVenueUrl,
  "地域枠一般選抜は2027年度の実施自体が未定で、会場も確定していません。",
  "conflict",
);
officialVenuePlan(["kitasato--common--common-test-early", "kitasato--common--common-test-late"], "second", {
  venueLinks: [link("venue-kitasato-sagamihara-campus")],
  announcedVenueText: "北里大学 相模原キャンパス",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: kitasatoVenueUrl,
  evidenceLabel: "2027年度医学部入試変更点",
  evidenceLocator: "大学入学共通テスト利用選抜 二次試験会場欄",
  reviewState: "verified",
});

const tokaiVenueUrl = "https://www.u-tokai.ac.jp/examination-admissions/examination-system/undergraduate-academic-medicine/";
const tokaiRoutes = [
  "tokai--general--general",
  "tokai--common--common-test",
  "tokai--common--common-test-regional-quota-kanagawa",
  "tokai--common--common-test-regional-quota-c5d34",
];
unpublishedVenuePlan(["tokai--general--general"], "first", tokaiVenueUrl);
unpublishedVenuePlan(tokaiRoutes, "second", tokaiVenueUrl);

const kanazawaVenueUrl = "https://www.kanazawa-med.ac.jp/medicine_exam/assets/m_admissionguide.pdf.pdf";
officialVenuePlan(["kanazawa-medical--general--general-early"], "first", {
  venueLinks: [
    link("venue-kanazawa-medical-main-campus", "choice"),
    link("venue-toc-gotanda", "choice"),
    link("venue-osaka-academia", "choice"),
    link("venue-tkp-premium-nagoya-ekimae", "choice"),
    link("venue-fukuoka-garden-palace", "choice"),
  ],
  announcedVenueText: "金沢医科大学・TOCビル本館・大阪アカデミア・TKP名古屋駅前・福岡ガーデンパレス（名古屋は一般選抜ページに旧会場表記が残るため受験票確認）",
  publicationState: "confirmed",
  conditions: ["applicant_preference", "admission_ticket"],
  officialAdmissionUrl: kanazawaVenueUrl,
  evidenceLabel: "金沢医科大学 医学部guide2027",
  evidenceLocator: "PDF 3ページ「一般選抜 前期 試験場」",
  reviewState: "monitoring",
  note: "2027年度医学部ガイドと大学公式『昨年度からの変更点』は、名古屋試験場をTKPガーデンシティPREMIUM名古屋駅前へ変更すると明記しています。一方、一般選抜（前期）の大学公式ページには旧会場のTKPガーデンシティPREMIUM名古屋ルーセントタワー表記が残っています。名古屋会場は出願時と受験票で施設名・住所を再確認し、駅前会場が指定された場合だけ本ページの宿泊候補を利用してください。2027年度の開場・入場時刻、使用室・受付位置・受験生入口は未公表です。",
});
officialVenuePlan(["kanazawa-medical--general--general-late"], "first", {
  venueLinks: [
    link("venue-kanazawa-medical-main-campus", "choice"),
    link("venue-tokyo-ryutsu-center-center-building", "choice"),
    link("venue-temma-training-center", "choice"),
  ],
  announcedVenueText: "金沢医科大学・東京流通センター センタービル・天満研修センター",
  publicationState: "confirmed",
  conditions: ["applicant_preference"],
  officialAdmissionUrl: kanazawaVenueUrl,
  evidenceLabel: "金沢医科大学 医学部guide2027",
  evidenceLocator: "PDF 4ページ「一般選抜 後期 試験場」",
  reviewState: "verified",
});
officialVenuePlan(["kanazawa-medical--general--general-early", "kanazawa-medical--general--general-late"], "second", {
  venueLinks: [link("venue-kanazawa-medical-main-campus")],
  announcedVenueText: "金沢医科大学",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: kanazawaVenueUrl,
  evidenceLabel: "金沢医科大学 医学部guide2027",
  evidenceLocator: "PDF 3〜4ページ「第2次選抜 試験場」",
  reviewState: "verified",
});

const aichiVenueUrl = "https://www.aichi-med-u.ac.jp/files/igaku/2027nenndogakuseibosyuuyoukou_0731.pdf";
officialVenuePlan(["aichi-medical--general--general"], "first", {
  venueLinks: [
    link("venue-nagoya-convention-hall", "choice"),
    link("venue-bellesalle-takadanobaba", "choice"),
    link("venue-congres-convention-center", "choice"),
    link("venue-fukuoka-fashion-building", "choice"),
  ],
  announcedVenueText: "名古屋コンベンションホール2階・ベルサール高田馬場・コングレコンベンションセンター・福岡ファッションビル8階",
  publicationState: "confirmed",
  conditions: ["applicant_preference"],
  officialAdmissionUrl: aichiVenueUrl,
  evidenceLabel: "2027年度医学部学生募集要項（7月31日訂正版）",
  evidenceLocator: "PDF 11・25〜27ページ",
  knowledgeBaseIds: ["guideline--aichi-medical--aichi-medical-2027-main-and-other"],
  reviewState: "verified",
  note: "出願時に試験会場を選択し、検定料支払後は変更できません。",
});
officialVenuePlan(["aichi-medical--general--general", "aichi-medical--common--common-test"], "second", {
  venueLinks: [link("venue-aichi-medical-main-building")],
  announcedVenueText: "愛知医科大学 1号館（大学本館）",
  publicationState: "confirmed",
  conditions: ["fixed", "applicant_preference", "university_assigned"],
  officialAdmissionUrl: aichiVenueUrl,
  evidenceLabel: "2027年度医学部学生募集要項（7月31日訂正版）",
  evidenceLocator: "PDF 11・25ページ",
  reviewState: "verified",
  note: "2027年2月18日・19日・20日から出願時に希望日を1日選び、出願後は変更できません。午前・午後の部は大学がPost@netで通知します。会場は1号館で固定です。",
});
officialVenuePlan(["aichi-medical--common--common-test-regional-quota"], "second", {
  venueLinks: [link("venue-aichi-medical-main-building")],
  announcedVenueText: "愛知医科大学 1号館（大学本館）",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: aichiVenueUrl,
  evidenceLabel: "2027年度医学部学生募集要項（7月31日訂正版）",
  evidenceLocator: "PDF 11・25ページ",
  reviewState: "verified",
  note: "愛知県地域特別枠B方式の第2次は2027年3月10日で、受付8:30〜8:45、面接9:00開始です。会場は1号館で固定です。",
});

const fujitaVenueUrl = "https://www.fujita-hu.ac.jp/admission/exam-med/dubv6r0000001ec6-att/j93sdv000000ub7u.pdf";
areaVenuePlan(
  ["fujita--general--general-regional-quota-17148"],
  "first",
  "東京・名古屋・大阪",
  ["東京都", "愛知県", "大阪府"],
  [],
  fujitaVenueUrl,
  "2027年度医学部入試概要「試験地」",
  "都市までの公表です。正式施設名と選択・指定条件は、完成版要項等の公表後に確認してください。",
);
officialVenuePlan(["fujita--general--general-regional-quota-17148", "fujita--common--common-test"], "second", {
  venueLinks: [link("venue-fujita-health-toyoake-campus")],
  announcedVenueText: "藤田医科大学 本学（豊明キャンパス）",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: fujitaVenueUrl,
  evidenceLabel: "2027年度医学部入試概要",
  evidenceLocator: "各方式 二次試験会場欄",
  reviewState: "verified",
  note: "会場は本学で固定です。二次試験日は2027年2月14日または15日ですが、受験者ごとの日付・集合時刻・使用棟・受付・受験生入口は現行の公式概要では公表されていません。10月頃公開予定の学生募集要項、受験票、当日案内で確認してください。",
});

const ompuVenueUrl = "https://www.ompu.ac.jp/admission/undergraduate/qt931k000000801q-att/afif3u000000fsvj.pdf";
areaVenuePlan(
  ["osaka-med-pharm--general--general-regional-quota-385a3-early"],
  "first",
  "大阪・愛知・東京",
  ["大阪府", "愛知県", "東京都"],
  [],
  ompuVenueUrl,
  "2027年度医学部入試概要「試験地」",
  "都市までの公表です。正式施設名と選択・指定条件は、完成版要項等の公表後に確認してください。",
);
areaVenuePlan(
  ["osaka-med-pharm--general--general-late"],
  "first",
  "大阪・東京",
  ["大阪府", "東京都"],
  [],
  ompuVenueUrl,
  "2027年度医学部入試概要「試験地」",
  "都市までの公表です。正式施設名と選択・指定条件は、完成版要項等の公表後に確認してください。",
);
officialVenuePlan(
  [
    "osaka-med-pharm--general--general-regional-quota-385a3-early",
    "osaka-med-pharm--general--general-late",
    "osaka-med-pharm--common--common-test",
  ],
  "second",
  {
    venueLinks: [link("venue-osaka-med-pharm-takatsuki-campus")],
    announcedVenueText: "大阪医科薬科大学 本部キャンパス",
    publicationState: "confirmed",
    conditions: ["fixed"],
    officialAdmissionUrl: ompuVenueUrl,
    evidenceLabel: "2027年度医学部入試概要",
    evidenceLocator: "各方式 二次試験会場欄",
    reviewState: "verified",
    note: "一般選抜（前期・大阪府地域枠）の二次は2027年2月19日、一般選抜（後期）の二次は3月16日、共通テスト利用選抜の二次は2月28日で、会場は本部キャンパスに固定されています。一般前期の繰上合格候補対象者の二次は3月3日です。開場・集合・開始時刻、使用棟・階・試験室、受付位置、受験生入口は現行の入試概要では未公表のため、完成版募集要項、受験票、一次試験合格者向け案内、当日掲示を確認してください。",
  },
);

const kindaiVenueUrl = "https://kindai.jp/assets/pdf/exam/exam-guide-2027.pdf";
areaVenuePlan(
  ["kindai--general--general-early", "kindai--general--general-regional-quota-c5d34-385a3-3f44f-early"],
  "first",
  "大阪・東京・名古屋・広島・福岡",
  ["大阪府", "東京都", "愛知県", "広島県", "福岡県"],
  [],
  kindaiVenueUrl,
  "2027年度入試ガイド 医学部一般前期「試験地」",
  "都市までの公表です。正式施設名と選択・指定条件は、入学試験要項の公表後に確認してください。",
);
areaVenuePlan(
  ["kindai--general--general-late", "kindai--general--general-regional-quota-c5d34-late"],
  "first",
  "大阪・東京",
  ["大阪府", "東京都"],
  [],
  kindaiVenueUrl,
  "2027年度入試ガイド 医学部一般後期「試験地」",
  "都市までの公表です。正式施設名と選択・指定条件は、入学試験要項の公表後に確認してください。",
);
officialVenuePlan(
  [
    "kindai--general--general-early",
    "kindai--general--general-regional-quota-c5d34-385a3-3f44f-early",
    "kindai--general--general-late",
    "kindai--general--general-regional-quota-c5d34-late",
    "kindai--common--common-test-early",
    "kindai--common--common-test-middle",
    "kindai--common--common-test-late",
  ],
  "second",
  {
    venueLinks: [link("venue-kindai-osaka-medical-campus")],
    announcedVenueText: "近畿大学 おおさかメディカルキャンパス",
    publicationState: "confirmed",
    conditions: ["fixed"],
    officialAdmissionUrl: kindaiVenueUrl,
    evidenceLabel: "2027年度入試ガイド",
    evidenceLocator: "医学部 各方式 二次試験会場欄",
    reviewState: "verified",
  },
);

const hyogoVenueUrl = "https://www.hyo-med.ac.jp/files/20260703/c737f86c1b3de8f37133c3de2c8031853ac51fff.pdf";
officialVenuePlan(["hyogo-medical--general--general-regional-quota-3470a"], "first", {
  venueLinks: [
    link("venue-kansai-medical-atc-hall", "choice"),
    link("venue-tkp-shimbashi-conference-center", "choice"),
    link("venue-fukuoka-minami-kindai-building", "choice"),
  ],
  announcedVenueText: "ATCホール・TKP新橋カンファレンスセンター・南近代ビル",
  publicationState: "confirmed",
  conditions: ["applicant_preference", "capacity_overflow"],
  officialAdmissionUrl: hyogoVenueUrl,
  evidenceLabel: "2027年度入学試験要項",
  evidenceLocator: "PDF 22〜25・31〜33ページ",
  knowledgeBaseIds: ["fact:hyogo-medical--2027--fact--first-exam--general-a-b"],
  reviewState: "verified",
  note: "東京・福岡会場が定員超過の場合は大阪会場へ変更されます。",
});
officialVenuePlan(["hyogo-medical--general--general"], "first", {
  venueLinks: [
    link("venue-kansai-medical-atc-hall", "primary"),
    link("venue-tkp-shimbashi-conference-center", "choice"),
    link("venue-fukuoka-minami-kindai-building", "choice"),
  ],
  announcedVenueText: "B単願はATCホール、A・B併願はATC・TKP新橋・南近代ビルから選択",
  publicationState: "confirmed",
  conditions: ["fixed", "applicant_preference", "capacity_overflow"],
  officialAdmissionUrl: hyogoVenueUrl,
  evidenceLabel: "2027年度入学試験要項",
  evidenceLocator: "PDF 22〜25・31〜33ページ",
  knowledgeBaseIds: ["fact:hyogo-medical--2027--fact--first-exam--general-a-b"],
  reviewState: "verified",
  note: "B単願は大阪ATC固定です。A・B併願者のみA方式で選んだ会場を使用し、東京・福岡の超過時は大阪へ変更されます。",
});
officialVenuePlan(
  ["hyogo-medical--general--general-regional-quota-3470a", "hyogo-medical--general--general"],
  "second",
  {
    venueLinks: [link("venue-hyogo-medical-nishinomiya-campus")],
    announcedVenueText: "兵庫医科大学 西宮キャンパス 教育研究棟",
    publicationState: "confirmed",
    conditions: ["fixed"],
    officialAdmissionUrl: hyogoVenueUrl,
    evidenceLabel: "2027年度入学試験要項",
    evidenceLocator: "PDF 22・25ページ",
    knowledgeBaseIds: [
      "fact:hyogo-medical--2027--fact--second-exam--general-a--01",
      "fact:hyogo-medical--2027--fact--second-exam--general-b",
    ],
    reviewState: "verified",
  },
);

const kawasakiVenueUrl = "https://m.kawasaki-m.ac.jp/examination/youkou.php";
officialVenuePlan(["kawasaki-medical--general--general-regional-quota-c5d34-491fd-bf01d"], "first", {
  venueLinks: [link("venue-kawasaki-medical-general-gymnasium")],
  announcedVenueText: "川崎医科大学 総合体育館等",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: kawasakiVenueUrl,
  evidenceLabel: "2027年度一般選抜・地域枠選抜要項",
  evidenceLocator: "試験会場案内「第一次試験」",
  reviewState: "verified",
  note: "公式資料では同一所在地内の『総合体育館等』まで公表されています。使用施設、受付位置、受験生入口、受験室と割当方法は未公表のため、受験票と大学案内で確認してください。試験会場と周辺への車・タクシー・バス等の乗り入れ、無断駐車、送迎は禁止されています。",
});
officialVenuePlan(["kawasaki-medical--general--general-regional-quota-c5d34-491fd-bf01d"], "second", {
  venueLinks: [link("venue-kawasaki-medical-school-building")],
  announcedVenueText: "川崎医科大学 校舎棟",
  publicationState: "confirmed",
  conditions: ["fixed", "university_assigned"],
  officialAdmissionUrl: kawasakiVenueUrl,
  evidenceLabel: "2027年度一般選抜・地域枠選抜要項",
  evidenceLocator: "試験会場案内「第二次試験」",
  reviewState: "verified",
  note: "2027年2月10日・11日のうち試験日は大学が指定します。面接時刻、受付位置、使用階・室、受験生入口は未公表のため、第一次試験合格後の大学案内と受験票で確認してください。附属病院玄関は校舎棟玄関とは異なり、試験会場周辺への車・タクシー・バス等の乗り入れ、無断駐車、送迎は禁止されています。",
});

const kurumeEarlyVenueUrl = "https://best.kurume-u.ac.jp/admissions/type/exam-first/";
const kurumeLateVenueUrl = "https://best.kurume-u.ac.jp/admissions/type/exam-second/";
officialVenuePlan(["kurume--general--general-early"], "first", {
  venueLinks: [link("venue-kurume-mii-campus", "choice"), link("venue-bellesalle-shiodome", "choice")],
  announcedVenueText: "久留米大学 御井キャンパス又はベルサール汐留",
  publicationState: "confirmed",
  conditions: ["applicant_preference"],
  officialAdmissionUrl: kurumeEarlyVenueUrl,
  evidenceLabel: "2027年度一般選抜 前期",
  evidenceLocator: "公式ページ「試験会場」",
  reviewState: "verified",
});
officialVenuePlan(["kurume--general--general-early"], "second", {
  venueLinks: [link("venue-kurume-mii-campus")],
  announcedVenueText: "久留米大学 御井キャンパス",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: kurumeEarlyVenueUrl,
  evidenceLabel: "2027年度一般選抜 前期",
  evidenceLocator: "公式ページ「試験会場」",
  reviewState: "verified",
});
officialVenuePlan(["kurume--general--general-late"], "first", {
  venueLinks: [link("venue-kurume-mii-campus")],
  announcedVenueText: "久留米大学 御井キャンパス",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: kurumeLateVenueUrl,
  evidenceLabel: "2027年度一般選抜 後期",
  evidenceLocator: "公式ページ「試験会場」",
  reviewState: "verified",
});
officialVenuePlan(["kurume--general--general-late"], "second", {
  venueLinks: [link("venue-kurume-asahimachi-campus")],
  announcedVenueText: "久留米大学 旭町キャンパス",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: kurumeLateVenueUrl,
  evidenceLabel: "2027年度一般選抜 後期",
  evidenceLocator: "公式ページ「試験会場」",
  reviewState: "verified",
});
unpublishedVenuePlan(
  ["kurume--common--common-test-method-a"],
  "second",
  "https://best.kurume-u.ac.jp/admissions/type/common/a/",
  "共通テスト利用A日程の二次試験日は公表済みですが、公式ページに会場欄がありません。一般前期と同日でも会場を推測しません。",
);
unpublishedVenuePlan(
  ["kurume--common--common-test-method-b"],
  "second",
  "https://best.kurume-u.ac.jp/admissions/type/common/b/",
  "共通テスト利用B日程の二次試験日は公表済みですが、公式ページに会場欄がありません。",
);

officialVenuePlan(["uoeh--common--general-method-a", "uoeh--general--general-method-b"], "first", {
  venueLinks: [link("venue-kitakyushu-messe", "choice"), link("venue-bellesalle-shiodome", "choice")],
  announcedVenueText: "北九州メッセ又はベルサール汐留",
  publicationState: "confirmed",
  conditions: ["applicant_preference", "capacity_overflow", "university_assigned"],
  officialAdmissionUrl: "https://www.uoeh-u.ac.jp/library/nyusi/R9_jissiyoko.pdf",
  evidenceLabel: "2027年度入学者選抜実施要項",
  evidenceLocator: "PDF 一般選抜A・B方式 試験会場欄",
  reviewState: "verified",
  note: "東京会場が定員超過の場合、一部受験者は北九州会場へ変更されます。",
});
officialVenuePlan(
  ["uoeh--common--general-method-a", "uoeh--general--general-method-b", "uoeh--common--general-method-c"],
  "second",
  {
    venueLinks: [link("venue-uoeh-main-campus")],
    announcedVenueText: "産業医科大学 本学",
    publicationState: "confirmed",
    conditions: ["fixed"],
    officialAdmissionUrl: "https://www.uoeh-u.ac.jp/library/nyusi/R9_jissiyoko.pdf",
    evidenceLabel: "2027年度入学者選抜実施要項",
    evidenceLocator: "PDF 一般選抜A・B・C方式 二次試験会場欄",
    reviewState: "verified",
  },
);

const fukuokaVenueUrl = "https://www.fukuoka-u.ac.jp/pdf/entrance-examinations/guidebook-entrance-examinations2027.pdf";
officialVenuePlan(["fukuoka--general--general"], "first", {
  venueLinks: [
    link("venue-fukuoka-university-nanakuma-campus", "choice"),
    link("venue-time24-building", "choice"),
    link("venue-tkp-premium-nagoya-shinkansenguchi", "choice"),
    link("venue-tkp-shinosaka-conference-center", "choice"),
  ],
  announcedVenueText: "福岡大学・タイム24ビル・TKP名古屋新幹線口・TKP新大阪カンファレンスセンター",
  publicationState: "confirmed",
  conditions: ["applicant_preference", "admission_ticket", "capacity_overflow"],
  officialAdmissionUrl: fukuokaVenueUrl,
  evidenceLabel: "2027年度入試ガイド",
  evidenceLocator: "系統別日程 試験地・会場案内",
  reviewState: "verified",
  note: "希望会場の収容人数を超えた場合は別会場になります。2027年度入試ガイドは本学試験場を福岡大学まで公表していますが、使用棟・試験室・受付・受験生入口・集合時刻は未公表です。完成版の入学試験要項、出願確認票、受験票、当日案内で最終会場と入室案内を確認してください。",
});
areaVenuePlan(
  ["fukuoka--general--general", "fukuoka--common--common-test-phase-1"],
  "second",
  "福岡",
  ["福岡県"],
  ["fixed", "admission_ticket"],
  fukuokaVenueUrl,
  "医学部二次試験「試験地：福岡」",
  "試験地は福岡まで公表済みですが、二次試験の正式施設名・住所は公表されていません。福岡大学本学とは推測せず、受験票で最終会場を確認してください。",
);

// 会場そのものの固定／選択と、受験日だけの希望・大学指定を方式ごとに分ける。
const refineAssignmentPlan = (
  routeIds: string[],
  examStage: ExamStage2027,
  patch: AssignmentPlan,
) => {
  for (const routeId of routeIds) {
    const key = stageKey(routeId, examStage);
    assignmentPlans.set(key, { ...(assignmentPlans.get(key) ?? {}), ...patch });
  }
};

refineAssignmentPlan(["kyorin--general--general"], "second", {
  conditions: ["fixed", "applicant_preference", "university_assigned"],
});
refineAssignmentPlan(
  ["juntendo--general--general-method-a", "juntendo--common--common-test-early"],
  "second",
  { conditions: ["fixed", "applicant_preference", "university_assigned"] },
);
refineAssignmentPlan(["showa-medical--general--general-phase-1"], "second", {
  conditions: ["fixed", "applicant_preference", "admission_ticket"],
});
refineAssignmentPlan(["teikyo--general--general"], "second", {
  conditions: ["fixed", "applicant_preference"],
});
refineAssignmentPlan(["jikei--general--general"], "second", {
  conditions: ["fixed"],
});
refineAssignmentPlan(["toho--general--general"], "second", {
  conditions: ["fixed"],
});
refineAssignmentPlan(["marianna--general--general-early"], "second", {
  conditions: ["fixed", "applicant_preference", "university_assigned"],
});
refineAssignmentPlan(nmsEarlyRoutes, "second", {
  conditions: ["fixed", "applicant_preference", "university_assigned"],
});
refineAssignmentPlan(nmsLateRoutes, "second", { conditions: ["fixed"] });
refineAssignmentPlan(["kitasato--common--common-test-early"], "second", {
  conditions: ["fixed", "applicant_preference"],
});
refineAssignmentPlan(["kanazawa-medical--general--general-early"], "second", {
  conditions: ["fixed", "applicant_preference"],
});
refineAssignmentPlan(
  ["aichi-medical--general--general", "aichi-medical--common--common-test"],
  "second",
  { conditions: ["fixed", "applicant_preference", "university_assigned"] },
);
refineAssignmentPlan(["aichi-medical--common--common-test-regional-quota"], "second", {
  conditions: ["fixed"],
});
refineAssignmentPlan(["fujita--general--general-regional-quota-17148", "fujita--common--common-test"], "second", {
  conditions: ["fixed"],
});
refineAssignmentPlan(["kansai-medical--general--general-early"], "second", {
  conditions: ["fixed", "applicant_preference", "university_assigned"],
});
refineAssignmentPlan(["hyogo-medical--general--general-regional-quota-3470a"], "second", {
  conditions: ["fixed", "applicant_preference"],
});

// 2027年度公式要項の実ページと方式別見出しを目視照合した会場証拠位置。
refineAssignmentPlan(["jichi-medical--general--general"], "second", {
  evidenceLocator: "PDF 15ページ（冊子11ページ）「一般選抜／試験会場 ◆第2次試験」",
});

refineAssignmentPlan(
  ["saitama-medical--general--general-early", "saitama-medical--general--general-late"],
  "first",
  { evidenceLocator: "PDF 46ページ（冊子42ページ）「一般選抜（前期・後期）7 試験会場」" },
);
refineAssignmentPlan(
  ["saitama-medical--general--general-early", "saitama-medical--general--general-late"],
  "second",
  { evidenceLocator: "PDF 46ページ（冊子42ページ）「一般選抜（前期・後期）7 試験会場」" },
);
refineAssignmentPlan(["saitama-medical--common--common-test"], "second", {
  evidenceLocator: "PDF 55ページ（冊子51ページ）「共通テスト利用選抜 7 試験会場」",
});

refineAssignmentPlan(["kyorin--general--general"], "first", {
  evidenceLocator: "PDF 46ページ（Ⅰ-43）「医学部 一般選抜／試験会場」",
});
refineAssignmentPlan(["kyorin--general--general"], "second", {
  evidenceLocator: "PDF 46ページ（Ⅰ-43）「医学部 一般選抜／試験会場」",
});
refineAssignmentPlan(["kyorin--common--common-test"], "second", {
  evidenceLocator: "PDF 47ページ（Ⅰ-44）「医学部 大学入学共通テスト利用選抜／試験会場」",
});

refineAssignmentPlan(["juntendo--general--general-method-a"], "first", {
  evidenceLocator: "PDF 31ページ（冊子29ページ）「一般選抜A方式／試験日程」",
});
refineAssignmentPlan(["juntendo--general--general-method-a"], "second", {
  evidenceLocator: "PDF 31ページ（冊子29ページ）「一般選抜A方式／試験日程」",
});
refineAssignmentPlan(["juntendo--general--general-method-b"], "first", {
  evidenceLocator: "PDF 36ページ（冊子34ページ）「一般選抜B方式／試験日程」",
});
refineAssignmentPlan(["juntendo--general--general-method-b"], "second", {
  evidenceLocator: "PDF 36ページ（冊子34ページ）「一般選抜B方式／試験日程」",
});
refineAssignmentPlan(["juntendo--common--common-test-early"], "first", {
  evidenceLocator: "PDF 33ページ（冊子31ページ）「前期共通テスト利用選抜／試験日程」",
});
refineAssignmentPlan(["juntendo--common--common-test-early"], "second", {
  evidenceLocator: "PDF 33ページ（冊子31ページ）「前期共通テスト利用選抜／試験日程」",
});
refineAssignmentPlan(["juntendo--common--common-general-combined"], "first", {
  evidenceLocator: "PDF 38ページ（冊子36ページ）「共通テスト・一般併用選抜／試験日程」",
});
refineAssignmentPlan(["juntendo--common--common-general-combined"], "second", {
  evidenceLocator: "PDF 38ページ（冊子36ページ）「共通テスト・一般併用選抜／試験日程」",
});
refineAssignmentPlan(["juntendo--common--common-test-late"], "second", {
  evidenceLocator: "PDF 41ページ（冊子39ページ）「後期共通テスト利用選抜／試験日程」",
});

refineAssignmentPlan(["teikyo--general--general"], "second", {
  evidenceLocator: "PDF 28ページ（冊子26ページ）「医学部 一般選抜／一次選考・二次選考 1.日程」",
});
refineAssignmentPlan(["teikyo--common--common-test-early"], "second", {
  evidenceLocator: "PDF 33ページ（冊子31ページ）「医学部 大学入学共通テスト利用選抜／1.日程」",
});

refineAssignmentPlan(
  ["marianna--general--general-early", "marianna--general--general-late"],
  "first",
  { evidenceLocator: "PDF 23ページ（冊子22ページ）「一般選抜（前期・後期）7.試験場／8.試験期日および試験時間」" },
);
refineAssignmentPlan(
  ["marianna--general--general-early", "marianna--general--general-late"],
  "second",
  { evidenceLocator: "PDF 23ページ（冊子22ページ）「一般選抜（前期・後期）7.試験場／8.試験期日および試験時間」" },
);
refineAssignmentPlan(["marianna--common--common-test"], "second", {
  evidenceLocator: "PDF 18ページ（冊子17ページ）「大学入学共通テスト利用選抜 7.試験場／8.試験期日および試験時間」",
});

refineAssignmentPlan(["kansai-medical--general--general-early"], "second", {
  evidenceLocator: "PDF 20ページ（冊子14ページ）「一般選抜試験（前期）／第2次試験」",
});
refineAssignmentPlan(["kansai-medical--general--general-regional-quota-c5d34-385a3"], "second", {
  evidenceLocator: "PDF 27ページ（冊子21ページ）「地域枠一般選抜試験／第2次試験」",
});
refineAssignmentPlan(["kansai-medical--general--general-late"], "first", {
  evidenceLocator: "PDF 21ページ（冊子15ページ）「一般選抜試験（後期）／第1次試験」",
});
refineAssignmentPlan(["kansai-medical--general--general-late"], "second", {
  evidenceLocator: "PDF 21ページ（冊子15ページ）「一般選抜試験（後期）／第2次試験」",
});
refineAssignmentPlan(["kansai-medical--common--common-test-early"], "second", {
  evidenceLocator: "PDF 22ページ（冊子16ページ）「大学入学共通テスト利用選抜試験（前期）／第2次試験」",
});
refineAssignmentPlan(["kansai-medical--common--common-general-combined"], "second", {
  evidenceLocator: "PDF 25ページ（冊子19ページ）「大学入学共通テスト・一般選抜試験併用試験／第2次試験」",
});
refineAssignmentPlan(["kansai-medical--common--common-test-late"], "second", {
  evidenceLocator: "PDF 23ページ（冊子17ページ）「大学入学共通テスト利用選抜試験（後期）／第2次試験」",
});

const allRouteRecords = privateMedicalUniversities2027.flatMap((university) =>
  university.routes.map((route) => {
    const routeKey = `${university.id}::${route.name}` as keyof typeof privateMedicalExamRouteIds2027;
    const routeId = privateMedicalExamRouteIds2027[routeKey];
    if (!routeId) throw new Error(`Missing stable route ID: ${routeKey}`);
    return { university, route, routeId };
  }),
);

const firstExamIsOnlyCommonTest = (value: string) =>
  /^(?:大学入学)?共通テスト/u.test(value) && !/[＋+]|個別|小論文|学力/u.test(value);

const createAssignment = (
  record: (typeof allRouteRecords)[number],
  examStage: ExamStage2027,
): PrivateMedicalExamVenueAssignment2027 => {
  const { university, route, routeId } = record;
  const plan = assignmentPlans.get(stageKey(routeId, examStage)) ?? {};
  const examDateLabel = examStage === "first" ? route.firstExam : route.secondExam;
  const isPending = route.status === "pending" || /未公表|実施未定/u.test(examDateLabel);

  return {
    assignmentId: `${routeId}--${examStage}-venue`,
    academicYear: 2027,
    universityId: university.id,
    universityName: university.name,
    region: university.region,
    prefecture: university.prefecture,
    routeId,
    routeName: route.name,
    routeCategory: route.category,
    routeStatus: route.status,
    examStage,
    examStageLabel: plan.examStageLabel ?? (examStage === "first" ? "一次試験・大学独自試験" : "二次試験・面接等"),
    examDateLabel,
    venueLinks: plan.venueLinks ?? [],
    announcedPrefectures: plan.announcedPrefectures ?? [],
    announcedVenueText: plan.announcedVenueText ?? (isPending ? "2027年度の会場は未公表" : "正式会場名・住所を確認中"),
    publicationState: plan.publicationState ?? "unpublished",
    conditions: plan.conditions ?? [],
    sharedWithRouteIds: plan.sharedWithRouteIds ?? [],
    officialAdmissionUrl: plan.officialAdmissionUrl ?? route.sourceUrl,
    evidenceLabel: plan.evidenceLabel ?? "大学公式2027年度入試ページ・募集要項の公表待ち",
    evidenceLocator: plan.evidenceLocator,
    knowledgeBaseIds: plan.knowledgeBaseIds ?? [`route:${routeId}`],
    reviewState: plan.reviewState ?? "monitoring",
    verifiedAt: VERIFIED_AT,
    note:
      plan.note ??
      (isPending
        ? "会場を推測せず、大学が2027年度の正式情報を公表するまでホテル案内も掲載しません。"
        : "募集要項または受験票で正式会場を確認してから宿泊先を選んでください。"),
  };
};

export const privateMedicalExamVenueAssignments2027 = allRouteRecords.flatMap((record) => {
  const assignments: PrivateMedicalExamVenueAssignment2027[] = [];
  if (!firstExamIsOnlyCommonTest(record.route.firstExam)) {
    assignments.push(createAssignment(record, "first"));
  }
  assignments.push(createAssignment(record, "second"));
  return assignments;
});

export const privateMedicalExamVenueUniversitySummaries2027 = privateMedicalUniversities2027.map(
  (university) => ({
    universityId: university.id,
    universityName: university.name,
    region: university.region,
    prefecture: university.prefecture,
    strategyPath: university.strategyPath,
    assignments: privateMedicalExamVenueAssignments2027.filter(
      (assignment) => assignment.universityId === university.id,
    ),
  }),
);

export const privateMedicalExamVenueSummary2027 = {
  academicYear: 2027,
  universityCount: privateMedicalUniversities2027.length,
  routeCount: allRouteRecords.length,
  assignmentCount: privateMedicalExamVenueAssignments2027.length,
  uniqueVenueCount: privateMedicalExamVenues2027.length,
  confirmedAssignmentCount: privateMedicalExamVenueAssignments2027.filter(
    (assignment) => assignment.publicationState === "confirmed",
  ).length,
  areaOnlyAssignmentCount: privateMedicalExamVenueAssignments2027.filter(
    (assignment) => assignment.publicationState === "city_or_campus_only",
  ).length,
  ticketAssignedCount: privateMedicalExamVenueAssignments2027.filter(
    (assignment) => assignment.publicationState === "ticket_assigned",
  ).length,
  unpublishedOrConflictCount: privateMedicalExamVenueAssignments2027.filter(
    (assignment) => assignment.publicationState === "unpublished" || assignment.publicationState === "conflict",
  ).length,
} as const;
