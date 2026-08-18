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
for (const seed of jichiVenueRelationSeeds2027) {
  const existing = jichiVenueEntityById.get(seed.venueId);
  if (existing && (existing.name !== seed.officialVenueText || existing.address !== seed.address)) {
    throw new Error(`Conflicting Jichi venue normalization: ${seed.venueId}`);
  }
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
    address: "北海道札幌市中央区北4条西5丁目 アスティ45 16階",
    prefecture: "北海道",
    municipality: "札幌市中央区",
    nearestStations: ["JR札幌駅", "札幌市営地下鉄 さっぽろ駅"],
    officialUrl: "https://www.acu-h.jp/sapporo/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
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
    officialUrl: "https://narita.iuhw.ac.jp/access/",
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
    officialUrl: "https://akasaka.iuhw.ac.jp/access/",
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
    name: "国際医療福祉大学大学院 福岡キャンパス",
    shortName: "国際医療福祉大学 福岡キャンパス",
    postalCode: "814-0001",
    address: "福岡県福岡市早良区百道浜2-4-16",
    prefecture: "福岡県",
    municipality: "福岡市早良区",
    nearestStations: ["福岡市地下鉄空港線 西新駅から路線バス"],
    officialUrl: "https://www.iuhw.ac.jp/daigakuin/access/",
    accessNote: "2027年度要項では福岡国際医療福祉大学 看護学部2号館建物内と案内されています。",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
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
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
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
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
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
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
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
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
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
    nearestStations: ["京急本線 梅屋敷駅"],
    officialUrl: "https://www.toho-u.ac.jp/accessmap/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
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
    nearestStations: ["東武東上線 大山駅", "池袋駅から路線バス"],
    officialUrl: "https://www.med.nihon-u.ac.jp/access/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
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
    nearestStations: ["JR・名鉄・近鉄・地下鉄 名古屋駅"],
    officialUrl: "https://www.kashikaigishitsu.net/facilitys/gcp-nagoya-ekimae/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
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
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
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
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
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
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
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
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
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
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
  },
  {
    venueId: "venue-kawasaki-medical-general-gymnasium",
    academicYear: 2027,
    name: "川崎医科大学 総合体育館",
    shortName: "川崎医科大学 総合体育館",
    postalCode: "701-0192",
    address: "岡山県倉敷市松島577",
    prefecture: "岡山県",
    municipality: "倉敷市",
    nearestStations: ["JR山陽本線 中庄駅"],
    officialUrl: "https://m.kawasaki-m.ac.jp/access/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
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
    officialUrl: "https://m.kawasaki-m.ac.jp/access/",
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
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
    reviewState: "verified",
    verifiedAt: VERIFIED_AT,
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
  venueLinks: [link("venue-toc-gotanda")],
  announcedVenueText: "五反田TOCビル",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: showaVenueUrl,
  evidenceLabel: "2027年度入学試験要項",
  evidenceLocator: "PDF 試験会場欄（一般選抜Ⅰ期・Ⅱ期）",
  reviewState: "verified",
});
officialVenuePlan(showaRoutes, "second", {
  venueLinks: [link("venue-showa-medical-hatanodai-campus")],
  announcedVenueText: "昭和医科大学 旗の台キャンパス",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: showaVenueUrl,
  evidenceLabel: "2027年度入学試験要項",
  evidenceLocator: "PDF 試験会場欄（一般選抜Ⅰ期・Ⅱ期）",
  reviewState: "verified",
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

const tokyoMedicalVenueUrl = "https://admissions-tokyo-med.jp/med/exam/";
officialVenuePlan(["tokyo-medical--general--general"], "first", {
  venueLinks: [
    link("venue-tokyo-medical-shinjuku-campus", "primary"),
    link("venue-bellesalle-shinjuku-grand", "primary"),
  ],
  announcedVenueText: "東京医科大学 本学又はベルサール新宿グランド",
  publicationState: "ticket_assigned",
  conditions: ["university_assigned", "admission_ticket"],
  officialAdmissionUrl: tokyoMedicalVenueUrl,
  evidenceLabel: "2027年度一般選抜・共通テスト利用選抜",
  evidenceLocator: "公式入試ページ「試験会場」",
  reviewState: "verified",
  note: "大学が会場を指定し、受験票に表示します。",
});
officialVenuePlan(["tokyo-medical--common--common-test"], "first", {
  venueLinks: [link("venue-tokyo-medical-shinjuku-campus")],
  announcedVenueText: "東京医科大学 本学（大学実施の小論文）",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: tokyoMedicalVenueUrl,
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
  note: "2月20日〜22日のうち1日に実施されます。割当方法は2027年度の現行公式概要では公表されていません。",
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
  note: "希望日を提出しますが、大学指定日は希望に沿わない場合があります。",
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
officialVenuePlan(["toho--general--general", "toho--general--unified"], "second", {
  venueLinks: [link("venue-toho-omori-campus")],
  announcedVenueText: "東邦大学 大森キャンパス",
  publicationState: "confirmed",
  conditions: ["fixed"],
  evidenceLabel: "大学公式2027年度入試概要",
  evidenceLocator: "各方式公式ページ「試験会場」",
  reviewState: "verified",
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
officialVenuePlan(["nihon--general--unified-phase-1", "nihon--general--unified-phase-2"], "second", {
  venueLinks: [link("venue-nihon-medical-school-building")],
  announcedVenueText: "日本大学 医学部校舎",
  publicationState: "confirmed",
  conditions: ["fixed"],
  officialAdmissionUrl: nihonVenueUrl,
  evidenceLabel: "2027年度N全学統一方式 試験場案内",
  evidenceLocator: "医学部 二次試験会場欄",
  reviewState: "verified",
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
  announcedVenueText: "金沢医科大学・TOCビル本館・大阪アカデミア・TKP名古屋駅前・福岡ガーデンパレス",
  publicationState: "confirmed",
  conditions: ["applicant_preference"],
  officialAdmissionUrl: kanazawaVenueUrl,
  evidenceLabel: "金沢医科大学 医学部guide2027",
  evidenceLocator: "PDF 3ページ「一般選抜 前期 試験場」",
  reviewState: "verified",
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
officialVenuePlan(
  ["aichi-medical--general--general", "aichi-medical--common--common-test", "aichi-medical--common--common-test-regional-quota"],
  "second",
  {
    venueLinks: [link("venue-aichi-medical-main-building")],
    announcedVenueText: "愛知医科大学 1号館（大学本館）",
    publicationState: "confirmed",
    conditions: ["fixed", "applicant_preference"],
    officialAdmissionUrl: aichiVenueUrl,
    evidenceLabel: "2027年度医学部学生募集要項（7月31日訂正版）",
    evidenceLocator: "PDF 11・25ページ",
    reviewState: "verified",
    note: "一般・共通テスト利用は出願時に希望日を選択します。地域特別枠B方式は指定日です。会場は1号館で固定です。",
  },
);

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
  note: "会場は本学で固定です。2月14日・15日の割当方法は2027年度の現行公式概要では公表されていません。",
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
  note: "公式資料では同一所在地内の「総合体育館等」まで公表されています。使用施設の割当方法は明記されていません。",
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
  note: "試験日は大学が指定します。",
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
  note: "希望会場の収容人数を超えた場合は別会場になります。出願確認票・受験票で最終会場を確認してください。",
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
  conditions: ["fixed", "applicant_preference"],
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
  { conditions: ["fixed", "applicant_preference"] },
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
