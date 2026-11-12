export type AdmissionRouteStatus = "official" | "preliminary" | "pending";
export type AdmissionRouteCategory = "general" | "common";

type SupplementalScheduleEvent2027 = {
  date: string;
  column: Exclude<FullScheduleColumnKey2027, "firstExam">;
  detail: string;
  conditional?: boolean;
};

export type AdmissionRoute = {
  name: string;
  category: AdmissionRouteCategory;
  application: string;
  applicationDeadlineDateDetails?: string[];
  firstExam: string;
  secondExam: string;
  result?: string;
  procedure: string;
  procedureDateDetails?: string[];
  supplementalScheduleEvents?: SupplementalScheduleEvent2027[];
  status: AdmissionRouteStatus;
  sourceUrl?: string;
};

export type PrivateMedicalUniversity = {
  id: string;
  name: string;
  region: "北海道・東北" | "関東" | "中部" | "近畿" | "中国・四国" | "九州";
  prefecture: string;
  strategyPath: string;
  routes: AdmissionRoute[];
};

type PublishedRoute = Omit<AdmissionRoute, "status">;

const officialRoute = (route: PublishedRoute): AdmissionRoute => ({
  ...route,
  status: "official",
});

const privateMedicalUniversitiesSource2027: PrivateMedicalUniversity[] = [
  {
    id: "iwate-medical",
    name: "岩手医科大学",
    region: "北海道・東北",
    prefecture: "岩手県",
    strategyPath: "/iwateika-university-entrance-exam-measures2027/",
    routes: [
      officialRoute({
        name: "一般選抜",
        category: "general",
        application: "Web登録 2026/12/4 9:00〜2027/1/8（最終日登録分の検定料は23:59、書類は同日消印有効）",
        firstExam: "2/3",
        secondExam: "2/12・13の選択日",
        result: "一次 2/9 18:00・最終 2/18 12:00",
        procedure: "2/26までに学納金を納入し、手続書類必着",
        sourceUrl: "https://www.imu-admission.jp/wp/wp-content/uploads/2026/09/00_ALL.pdf",
        applicationDeadlineDateDetails: ["Web登録の最終日（終了時刻は要項に記載なし）・最終日登録分の検定料23:59・書類消印有効"],
      }),
    ],
  },
  {
    id: "tohoku-med-pharm",
    name: "東北医科薬科大学",
    region: "北海道・東北",
    prefecture: "宮城県",
    strategyPath: "/touhokuikayakka-university-entrance-exam-measures2027/",
    routes: [
      officialRoute({
        name: "一般選抜",
        category: "general",
        application: "Web登録 2026/12/24 10:00〜2027/1/15 13:00（書類1/17必着）",
        firstExam: "2/4",
        secondExam: "2/20・21の指定日",
        result: "一次 2/12 16:00予定・最終 2/25 16:00予定",
        procedure: "納付金 3/5まで・書類提出期限 3/11",
        procedureDateDetails: ["納付金の納入期限", "入学手続書類の提出期限"],
        sourceUrl:
          "https://www.tohoku-mpu.ac.jp/doc/application_omnibus.pdf",
      }),
      officialRoute({
        name: "共通テスト利用",
        category: "common",
        application: "Web登録 2027/1/5 10:00〜1/22 13:00（書類1/24必着）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "3/3",
        result: "一次 2/12 16:00予定・最終 3/10 16:00予定",
        procedure: "納付金 3/18まで・書類提出期限 3/23",
        procedureDateDetails: ["納付金の納入期限", "入学手続書類の提出期限"],
        sourceUrl:
          "https://www.tohoku-mpu.ac.jp/doc/application_omnibus.pdf",
      }),
    ],
  },
  {
    id: "jichi-medical",
    name: "自治医科大学",
    region: "関東",
    prefecture: "栃木県",
    strategyPath: "/jichiika-university-entrance-exam-measures2027/",
    routes: [
      officialRoute({
        name: "一般選抜",
        category: "general",
        application: "書類受付 2027/1/4〜1/20 17:00必着（郵送は1/19消印有効。検定料払込は2026年11月9日〜2027年1月20日）",
        firstExam: "1/25（学力）・1/26（学力試験及第者のみ面接。面接対象者は同日9:00までに発表）",
        secondExam: "2/3",
        result: "一次 1/29 13:00・最終 2/12 17:00",
        procedure: "2/25・3/12の両日（本人が出願都道府県庁で手続）",
        sourceUrl:
          "https://www.jichi.ac.jp/assets/pdf/exam/medicine/exam/exam_youkou_R9.pdf",
        applicationDeadlineDateDetails: ["書類17:00必着・検定料払込期限", "郵送の消印期限"],
        procedureDateDetails: ["本人が出願先都道府県庁で第1回手続", "本人が出願先都道府県庁で第2回手続"],
        supplementalScheduleEvents: [
          { date: "2027-01-26", column: "firstResult", detail: "学力試験及第者（当日の一次面接対象者）の発表：9:00まで" },
        ],
      }),
    ],
  },
  {
    id: "dokkyo-medical",
    name: "獨協医科大学",
    region: "関東",
    prefecture: "栃木県",
    strategyPath: "/dokkyouika-university-entrance-exam-measures2027/",
    routes: [
      officialRoute({
        name: "一般選抜 前期（栃木県・新潟県地域枠を含む）",
        category: "general",
        application: "Web登録 2026/12/23〜2027/1/31 12:00（書類2/1 17:00必着）",
        firstExam: "2/12・13（両日受験可）",
        secondExam: "2/19・20のいずれか1日（出願時に希望・受付順に決定、変更不可）",
        result: "一次 2/16 10:00・最終 2/26 17:00",
        procedure: "3/4までに納付・Web入学手続",
        sourceUrl: "https://www.dokkyomed.ac.jp/upload/CommonFile/files/dokkyo_20261026130911.pdf",
      }),
      officialRoute({
        name: "一般選抜 後期",
        category: "general",
        application: "Web登録 2027/2/8〜2/28 12:00（書類3/1 17:00必着）",
        firstExam: "3/8",
        secondExam: "3/15",
        result: "一次 3/11 10:00・最終 3/17 17:00",
        procedure: "3/24までに納付・Web入学手続",
        sourceUrl: "https://www.dokkyomed.ac.jp/upload/CommonFile/files/dokkyo_20261026130911.pdf",
      }),
    ],
  },
  {
    id: "saitama-medical",
    name: "埼玉医科大学",
    region: "関東",
    prefecture: "埼玉県",
    strategyPath: "/saitamaika-university-entrance-exam-measures2027/",
    routes: [
      officialRoute({
        name: "一般選抜 前期",
        category: "general",
        application: "Web 2026/12/14 9:00〜2027/1/20（検定料は書類締切日まで。書類1/21必着）",
        firstExam: "2/4",
        secondExam: "2/14",
        result: "一次 2/10 13:00・最終 2/18 16:00",
        procedure: "2/18〜2/25に学納金等一括納入・書類郵送",
        sourceUrl:
          "https://adm.saitama-med.ac.jp/wp-content/uploads/2026/07/fa58cf881ba4ac57b5c60b69b2ac25d2.pdf",
        applicationDeadlineDateDetails: ["Web登録締切（終了時刻は要項に記載なし）", "検定料納入・書類必着"],
      }),
      officialRoute({
        name: "一般選抜 後期",
        category: "general",
        application: "Web 2027/2/1 9:00〜2/17（検定料は書類締切日まで。書類2/18必着）",
        firstExam: "2/28",
        secondExam: "3/7（共テ利用と双方一次合格の場合は1回のみ）",
        result: "一次 3/4 13:00・最終 3/11 16:00",
        procedure: "3/11〜3/17に学納金等一括納入・書類郵送",
        sourceUrl:
          "https://adm.saitama-med.ac.jp/wp-content/uploads/2026/07/fa58cf881ba4ac57b5c60b69b2ac25d2.pdf",
        applicationDeadlineDateDetails: ["Web登録締切（終了時刻は要項に記載なし）", "検定料納入・書類必着"],
      }),
      officialRoute({
        name: "大学入学共通テスト利用選抜",
        category: "common",
        application: "Web 2026/12/14 9:00〜2027/1/15（検定料は書類締切日まで。書類1/16必着）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "3/7（一般後期と双方一次合格の場合は1回のみ）",
        result: "一次 3/4 13:00・最終 3/11 16:00",
        procedure: "3/11〜3/17に学納金等一括納入・書類郵送",
        sourceUrl:
          "https://adm.saitama-med.ac.jp/wp-content/uploads/2026/07/fa58cf881ba4ac57b5c60b69b2ac25d2.pdf",
        applicationDeadlineDateDetails: ["Web登録締切（終了時刻は要項に記載なし）", "検定料納入・書類必着"],
      }),
    ],
  },
  {
    id: "iuhw",
    name: "国際医療福祉大学",
    region: "関東",
    prefecture: "千葉県",
    strategyPath: "/iuhw-medical-school-exam-guide-2027/",
    routes: [
      officialRoute({
        name: "一般選抜",
        category: "general",
        application: "Web登録 2026/12/21 9:00〜2027/1/7 23:00（検定料23:59・書類は国内消印有効／海外発送必着）",
        firstExam: "1/25",
        secondExam: "2/1〜6（希望をもとに大学が指定）",
        result: "一次 1/29 15:00・最終 2/12 15:00",
        procedure: "2/12〜2/18（消印有効）",
        sourceUrl: "https://narita.iuhw.ac.jp/gakubu/igakubu/admission/doc/guideline_app.pdf?ver=3",
        applicationDeadlineDateDetails: ["Web登録23:00・検定料23:59・書類は国内消印有効／海外発送必着"],
      }),
      officialRoute({
        name: "大学入学共通テスト利用選抜",
        category: "common",
        application: "Web登録 2026/12/21 9:00〜2027/1/14 23:00（検定料23:59・書類は国内消印有効／海外発送必着）",
        firstExam: "共通テスト 1/16・17",
        secondExam:
          "2/16（学力・小論文）・2/20（面接）の両日受験（一般選抜受験者は一部免除あり）",
        result: "一次 2/12 15:00・最終 3/1 15:00",
        procedure: "3/1〜3/11（消印有効）",
        sourceUrl: "https://narita.iuhw.ac.jp/gakubu/igakubu/admission/doc/guideline_app.pdf?ver=3",
        applicationDeadlineDateDetails: ["Web登録23:00・検定料23:59・書類は国内消印有効／海外発送必着"],
      }),
    ],
  },
  {
    id: "kyorin",
    name: "杏林大学",
    region: "関東",
    prefecture: "東京都",
    strategyPath: "/kyorin-university-medicine-exam-guide2027/",
    routes: [
      officialRoute({
        name: "一般選抜",
        category: "general",
        application: "Web登録・検定料 2026/12/1 9:00〜2027/1/15 17:00（書類1/15必着）",
        firstExam: "2/2",
        secondExam: "2/11・12（希望をもとに大学が指定）",
        result: "一次 2/8 17:00・最終 2/17 17:00",
        procedure: "2/25まで（書類必着。オンライン手続は合格発表翌日10:00開始）",
        sourceUrl: "https://www.kyorin-u.ac.jp/univ/center/nyugaku/web_youkou/PDF/2027youkou.pdf",
        applicationDeadlineDateDetails: ["Web登録・検定料17:00・書類必着"],
      }),
      officialRoute({
        name: "大学入学共通テスト利用選抜",
        category: "common",
        application: "Web登録・検定料 2026/12/15 9:00〜2027/1/15 17:00（書類1/15必着）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "2/20（小論文・面接）",
        result: "一次 2/15 17:00・最終 2/24 17:00",
        procedure: "3/3まで（書類必着。オンライン手続は合格発表翌日10:00開始）",
        sourceUrl: "https://www.kyorin-u.ac.jp/univ/center/nyugaku/web_youkou/PDF/2027youkou.pdf",
        applicationDeadlineDateDetails: ["Web登録・検定料17:00・書類必着"],
      }),
    ],
  },
  {
    id: "keio",
    name: "慶應義塾大学",
    region: "関東",
    prefecture: "東京都",
    strategyPath: "/keio-university-entrance-exam2027-measures/",
    routes: [
      officialRoute({
        name: "一般選抜",
        category: "general",
        application:
          "Web登録・検定料 2026/12/24 10:00〜2027/1/18 17:00（書類郵送は1月4日開始、1/18国内消印有効・国外必着）",
        firstExam: "2/9",
        secondExam: "3/1",
        result: "一次 2/19 10:00・最終 3/5 10:00",
        procedure: "3/12（入学金等支払・入学手続情報確定）。延納者は3月24日13:00、卒業・修了証明書の提出対象者は3月24日消印有効",
        sourceUrl: "https://www.keio.ac.jp/fixed-files/2027_ippan_youkou.pdf",
        applicationDeadlineDateDetails: ["Web登録・検定料17:00・書類は国内消印有効／国外必着"],
        procedureDateDetails: ["入学金等の支払・入学手続情報の確定"],
        supplementalScheduleEvents: [
          { date: "2027-03-24", column: "procedureDeadline", detail: "延納者のみ：授業料等の納付13:00。卒業・修了証明書の提出対象者は同日消印有効", conditional: true },
        ],
      }),
    ],
  },
  {
    id: "juntendo",
    name: "順天堂大学",
    region: "関東",
    prefecture: "東京都",
    strategyPath: "/juntendo-medical-entrance-exam2027-measures/",
    routes: [
      officialRoute({
        name: "一般選抜 A方式",
        category: "general",
        application: "2026/12/14〜2027/1/15（Web締切時刻の記載なし・出願書類必着）",
        firstExam: "2/3（学力・小論文）",
        secondExam: "2/14〜16（①〜③の希望をもとに大学が指定・希望どおりにならない場合あり）（一般A・共テ前期の双方で一次合格した場合は二次を1回のみ受験）",
        result: "一次 2/10 12:00・最終 2/20 12:00",
        procedure: "2/20 12:00〜2/26 17:00",
        sourceUrl: "https://www.juntendo.ac.jp/assets/2027_Juntendo_Med_NyugakuShikenYoukou.pdf",
      }),
      officialRoute({
        name: "一般選抜 B方式",
        category: "general",
        application: "2026/12/14〜2027/1/15（Web締切時刻の記載なし・出願書類必着）",
        firstExam: "2/3（学力）",
        secondExam: "3/2（小論文・英作文）・3/3（面接）（両日受験。一般B・共テ併用・共テ後期で複数一次合格した場合は、この2日間の二次試験を1組として受験）",
        result: "一次 2/20 12:00・最終 3/6 12:00",
        procedure: "3/6 12:00〜3/12 17:00",
        sourceUrl: "https://www.juntendo.ac.jp/assets/2027_Juntendo_Med_NyugakuShikenYoukou.pdf",
      }),
      officialRoute({
        name: "共通テスト利用 前期",
        category: "common",
        application: "2026/12/14〜2027/1/15（Web締切時刻の記載なし・出願書類必着）",
        firstExam: "共通テスト 1/16・17＋2/3（小論文）",
        secondExam: "2/14〜16（①〜③の希望をもとに大学が指定・希望どおりにならない場合あり）（一般A・共テ前期の双方で一次合格した場合は二次を1回のみ受験）",
        result: "一次 2/10 12:00・最終 2/20 12:00",
        procedure: "2/20 12:00〜2/26 17:00",
        sourceUrl: "https://www.juntendo.ac.jp/assets/2027_Juntendo_Med_NyugakuShikenYoukou.pdf",
      }),
      officialRoute({
        name: "共通テスト・一般併用選抜",
        category: "common",
        application: "2026/12/14〜2027/1/15（Web締切時刻の記載なし・出願書類必着）",
        firstExam: "共通テスト 1/16・17＋2/3（学力）",
        secondExam: "3/2（小論文・英作文）・3/3（面接）（両日受験。一般B・共テ併用・共テ後期で複数一次合格した場合は、この2日間の二次試験を1組として受験）",
        result: "一次 2/20 12:00・最終 3/6 12:00",
        procedure: "3/6 12:00〜3/12 17:00",
        sourceUrl: "https://www.juntendo.ac.jp/assets/2027_Juntendo_Med_NyugakuShikenYoukou.pdf",
      }),
      officialRoute({
        name: "共通テスト利用 後期",
        category: "common",
        application: "2026/12/14〜2027/1/15（Web締切時刻の記載なし・出願書類必着）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "3/2（小論文・英作文）・3/3（面接）（両日受験。一般B・共テ併用・共テ後期で複数一次合格した場合は、この2日間の二次試験を1組として受験）",
        result: "一次 2/20 12:00・最終 3/6 12:00",
        procedure: "3/6 12:00〜3/12 17:00",
        sourceUrl: "https://www.juntendo.ac.jp/assets/2027_Juntendo_Med_NyugakuShikenYoukou.pdf",
      }),
    ],
  },
  {
    id: "showa-medical",
    name: "昭和医科大学",
    region: "関東",
    prefecture: "東京都",
    strategyPath: "/showa-university-medicine-strategy2027/",
    routes: [
      officialRoute({
        name: "一般選抜 Ⅰ期",
        category: "general",
        application: "2026/12/7〜2027/1/21（Web締切時刻の記載なし・出願書類必着）",
        firstExam: "2/5",
        secondExam: "2/13・14から出願時に1日選択（出願後の変更不可）",
        result: "一次 2/10 12:00・最終 2/15 12:00",
        procedure:
          "入学手続・分納第1段階 2/22 12:00まで（納付・書類必着）。分納対象者の残額は3月3日12:00まで。入学金負担軽減の申請対象者は3月5日書類必着",
        sourceUrl: "https://adm.showa-u.ac.jp/albums/abm.php?d=2405&f=abm00073368.pdf",
        procedureDateDetails: ["入学手続・分納第1段階 12:00（書類必着）"],
        supplementalScheduleEvents: [
          { date: "2027-03-05", column: "procedureDeadline", detail: "対象者のみ：入学金の負担軽減申請書類必着", conditional: true },
          { date: "2027-03-03", column: "procedureDeadline", detail: "分納選択者のみ：残額納付12:00", conditional: true },
        ],
      }),
      officialRoute({
        name: "一般選抜 Ⅱ期",
        category: "general",
        application: "2027/2/1〜2/23（Web締切時刻の記載なし・出願書類必着）",
        firstExam: "3/6",
        secondExam: "3/13",
        result: "一次 3/10 12:00・最終 3/15 12:00",
        procedure: "3/23 12:00まで（書類必着・学生納付金等の納入完了）",
        sourceUrl: "https://adm.showa-u.ac.jp/albums/abm.php?d=2405&f=abm00073368.pdf",
      }),
    ],
  },
  {
    id: "teikyo",
    name: "帝京大学",
    region: "関東",
    prefecture: "東京都",
    strategyPath: "/teikyo-university-entrance-exam-measures2027/",
    routes: [
      officialRoute({
        name: "一般選抜",
        category: "general",
        application: "2026/12/17 9:00〜2027/1/13 16:30（必着）",
        firstExam: "1/21〜23（自由選択・1〜3日受験可）",
        secondExam: "2/4・5の選択日",
        result: "一次 1/28 11:00・最終 2/13 11:00",
        procedure: "2/19までに着金（医学部奨学特待生は2月26日までに書面で利用意思を確認し、3月5日までに入学手続）",
        sourceUrl: "https://www.teikyo-u.ac.jp/application/files/2417/8409/4616/02_2027.pdf",
        procedureDateDetails: ["通常の納入金着金期限"],
        supplementalScheduleEvents: [
          { date: "2027-02-26", column: "procedureDeadline", detail: "医学部奨学特待生のみ：利用意思の書面確認期限", conditional: true },
          { date: "2027-03-05", column: "procedureDeadline", detail: "医学部奨学特待生のみ：入学手続期限", conditional: true },
        ],
      }),
      officialRoute({
        name: "共通テスト利用 前期",
        category: "common",
        application: "2026/12/17 9:00〜2027/1/15 16:30（必着）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "2/17（3科目方式が必須、5科目方式は追加出願。両方の一次合格者は3科目方式の受験番号で二次を1回のみ受験）",
        result: "一次 2/13 11:00・最終 2/19 11:00",
        procedure: "3/8までに納入金着金",
        sourceUrl: "https://www.teikyo-u.ac.jp/application/files/2417/8409/4616/02_2027.pdf",
      }),
    ],
  },
  {
    id: "tokyo-medical",
    name: "東京医科大学",
    region: "関東",
    prefecture: "東京都",
    strategyPath: "/tokyo-university-medicine-strategy2027/",
    routes: [
      officialRoute({
        name: "一般選抜",
        category: "general",
        application: "2026/12/14 00:00〜2027/1/13 23:59（書類は消印有効）",
        firstExam: "2/6（一次・小論文）",
        secondExam: "2/13・14の指定日（出願が早い順）（一般・共テ利用の双方一次合格者は一般の受験番号で1回のみ受験）",
        result: "一次 2/11 10:00・最終 2/18 10:00",
        procedure: "2/18 10:00〜3/1 15:00（納付・書類到着）",
        sourceUrl: "https://admissions-tokyo-med.jp/wp-content/uploads/2024/12/2027bosyuyoukou_ippan.pdf",
        supplementalScheduleEvents: [
          { date: "2027-03-03", column: "finalResult", detail: "補欠合格発表 10:00（対象者のみ）", conditional: true },
          { date: "2027-03-10", column: "procedureDeadline", detail: "補欠合格者のみ：納付・書類到着15:00", conditional: true },
        ],
      }),
      officialRoute({
        name: "共通テスト利用",
        category: "common",
        application: "2026/12/14 00:00〜2027/1/13 23:59（書類は消印有効）",
        firstExam: "共通テスト 1/16・17＋2/6（小論文）",
        secondExam: "2/13・14の指定日（出願が早い順）（一般・共テ利用の双方一次合格者は一般の受験番号で1回のみ受験）",
        result: "一次 2/11 10:00・最終 2/18 10:00",
        procedure: "2/18 10:00〜3/1 15:00（納付・書類到着）",
        sourceUrl: "https://admissions-tokyo-med.jp/wp-content/uploads/2024/12/2027bosyuyoukou_ippan.pdf",
        supplementalScheduleEvents: [
          { date: "2027-03-03", column: "finalResult", detail: "補欠合格発表 10:00（対象者のみ）", conditional: true },
          { date: "2027-03-10", column: "procedureDeadline", detail: "補欠合格者のみ：納付・書類到着15:00", conditional: true },
        ],
      }),
    ],
  },
  {
    id: "jikei",
    name: "東京慈恵会医科大学",
    region: "関東",
    prefecture: "東京都",
    strategyPath: "/jikei-medical-entrance-exam2027-strategy/",
    routes: [
      officialRoute({
        name: "一般選抜",
        category: "general",
        application: "Web登録 2026/12/21〜2027/1/25（終了時刻の記載なし）。書類受付は1月4日開始、締切日消印有効。検定料は登録翌日23:59、最終日登録分は17:00まで",
        firstExam: "2/11",
        secondExam: "2/20〜22の大学指定日（都合のつかない日を1日申請可・希望に添えない場合あり）",
        result: "一次 2/17 13:00・最終 3/1 10:00",
        procedure: "3/4 第1段階・入学金　3/10 15:00 第2段階・授業料、誓約書等は同日消印有効",
        sourceUrl: "https://www.jikei.ac.jp/wp-content/uploads/2026/10/Application_Guidelines_for_Admission_2027.pdf",
        applicationDeadlineDateDetails: ["Web登録の最終日（終了時刻記載なし）・最終日登録分の検定料17:00・書類消印有効"],
        procedureDateDetails: ["第1段階：入学金納入", "第2段階：授業料納入15:00・誓約書等は同日消印有効"],
      }),
    ],
  },
  {
    id: "tokyo-womens-medical",
    name: "東京女子医科大学",
    region: "関東",
    prefecture: "東京都",
    strategyPath: "/twmu-medicine-exam-guide-2027/",
    routes: [
      officialRoute({
        name: "一般選抜（地域枠含む）",
        category: "general",
        application: "Web登録・検定料 2026/12/21〜2027/1/18 23:00・書類1/20簡易書留必着（千葉県地域枠も日程共通）",
        firstExam: "2/1（学科・小論文）",
        secondExam: "2/13〜15から希望日を提出（希望に添えない場合あり）",
        result: "一次 2/8 14:00・最終 2/19 14:00",
        procedure: "2/20〜3/2 16:00（学納金納付・書類必着）",
        sourceUrl: "https://www.twmu-u.jp/wp-content/uploads/2026/08/30cfa9d6198a1f4ca4a002eee2df2651.pdf",
        applicationDeadlineDateDetails: ["Web登録・検定料23:00", "書類簡易書留必着"],
      }),
    ],
  },
  {
    id: "toho",
    name: "東邦大学",
    region: "関東",
    prefecture: "東京都",
    strategyPath: "/tohoi-university-entrance-exam-measures2027/",
    routes: [
      officialRoute({
        name: "一般入試",
        category: "general",
        application:
          "Web登録 2026/12/14 10:00〜2027/1/26 13:00（検定料15:00・書類同日必着。窓口は1月25日・26日9:00〜17:00。千葉県・新潟県地域枠も日程共通）",
        firstExam: "2/7（学科・基礎学力）",
        secondExam: "2/15・16（出願時に希望日を選択し大学が指定・希望に添えない場合あり）",
        result: "一次 2/10 12:00・最終 2/18 12:00",
        procedure: "2/25 15:00までに納付・所定書類提出",
        sourceUrl: "https://www.toho-u.ac.jp/info_exam/med_2027ippan.pdf",
        applicationDeadlineDateDetails: ["Web登録13:00・検定料15:00・書類必着"],
      }),
      officialRoute({
        name: "統一入試",
        category: "general",
        application:
          "Web登録 2026/12/14 10:00〜2027/2/15 13:00（検定料15:00・書類同日必着）",
        firstExam: "2/23（学科・基礎学力）",
        secondExam: "3/3（面接）",
        result: "一次 2/26 12:00・最終 3/4 12:00",
        procedure: "3/10 15:00までに納付・所定書類提出",
        sourceUrl: "https://www.toho-u.ac.jp/info_exam/med_2027tnyushi.pdf",
        applicationDeadlineDateDetails: ["Web登録13:00・検定料15:00・書類必着"],
      }),
    ],
  },
  {
    id: "nihon",
    name: "日本大学",
    region: "関東",
    prefecture: "東京都",
    strategyPath: "/nihon-university-entrance-exam-measures2027/",
    routes: [
      officialRoute({
        name: "一般選抜 N全学統一方式 第1期",
        category: "general",
        application:
          "Web・書類 2027/1/5〜1/22 16:00（Web登録は16:00、書類は同日簡易書留必着。検定料は登録完了3日後23:59まで、支払い後に書類提出）",
        firstExam: "2/1",
        secondExam: "2/11",
        result: "一次 2/8 16:00・最終 2/17 13:00",
        procedure: "2/24（入学手続締切）・3/11（二段階最終入学手続締切）",
        procedureDateDetails: ["入学手続締切", "二段階最終入学手続締切"],
        sourceUrl: "https://exam.nihon-u.ac.jp/export/sites/default/guidance/net-nihon-u/gid/pdf/nihon_yoko_ippan_all.pdf",
        applicationDeadlineDateDetails: ["Web登録16:00・書類簡易書留必着（支払い後に郵送）"],
      }),
      officialRoute({
        name: "一般選抜 N全学統一方式 第2期",
        category: "general",
        application:
          "Web・書類 2027/1/5〜2/25 16:00（Web登録は16:00、書類は同日簡易書留必着。検定料は登録完了3日後23:59まで、支払い後に書類提出）",
        firstExam: "3/4",
        secondExam: "3/17",
        result: "一次 3/12 16:00・最終 3/23 13:00",
        procedure: "3/26（入学手続締切）",
        procedureDateDetails: ["入学手続締切"],
        sourceUrl: "https://exam.nihon-u.ac.jp/export/sites/default/guidance/net-nihon-u/gid/pdf/nihon_yoko_ippan_all.pdf",
        applicationDeadlineDateDetails: ["Web登録16:00・書類簡易書留必着（支払い後に郵送）"],
      }),
      {
        name: "地域枠選抜（2027年度の方式・日程は未公表）",
        category: "general",
        application: "2027年度の方式・日程は未公表",
        firstExam: "2027年度の方式・日程は未公表",
        secondExam: "2027年度の方式・日程は未公表",
        result: "2027年度の方式・日程は未公表",
        procedure: "2027年度の方式・日程は未公表",
        status: "pending",
        sourceUrl:
          "https://www.med.nihon-u.ac.jp/RegionalSelection/",
      },
    ],
  },
  {
    id: "nippon-medical",
    name: "日本医科大学",
    region: "関東",
    prefecture: "東京都",
    strategyPath: "/nihonikadaigaku-exam-guide-2027/",
    routes: [
      officialRoute({
        name: "一般選抜 前期",
        category: "general",
        application:
          "Web登録 2026/12/21〜2027/1/21（登録終了時刻の記載なし・受験料は登録翌日23:59まで、締切日登録は当日23:59／書類1/21簡易書留・消印有効）",
        firstExam: "2/1",
        secondExam: "2/10・12の希望日（希望に沿えない場合あり）",
        result: "一次 2/8 18:00・最終 2/16 12:00",
        procedure: "入学金 2/19・初年度学費／手続書類 2/24",
        procedureDateDetails: [
          "入学金納入期限",
          "初年度学費納入・手続書類提出期限",
        ],
        sourceUrl: "https://www.nms.ac.jp/college/nyushi-book/pdf_2027/guidelines_2027.pdf",
      }),
      officialRoute({
        name: "一般選抜（地域枠）前期",
        category: "general",
        application:
          "Web登録 2026/12/21〜2027/1/21（登録終了時刻の記載なし・受験料は登録翌日23:59まで、締切日登録は当日23:59／書類1/21簡易書留・消印有効）",
        firstExam: "2/1",
        secondExam:
          "2/10・12の希望日（希望に沿えない場合あり／東京都地域枠は2/10指定）",
        result: "一次 2/8 18:00・最終 2/16 12:00",
        procedure: "入学金 2/19・学費／手続書類 2/24（東京都地域枠は納付不要）",
        procedureDateDetails: [
          "入学金納入期限（東京都地域枠は納付不要）",
          "学費納入・手続書類提出期限（東京都地域枠は学費納付不要）",
        ],
        sourceUrl: "https://www.nms.ac.jp/college/nyushi-book/pdf_2027/guidelines_2027.pdf",
      }),
      officialRoute({
        name: "グローバル特別選抜（前期）",
        category: "common",
        application:
          "Web登録 2026/12/21〜2027/1/21（登録終了時刻の記載なし・受験料は登録翌日23:59まで、締切日登録は当日23:59／書類1/21簡易書留・消印有効）",
        firstExam: "共通テスト（国語）1/16＋個別一次 2/1",
        secondExam: "2/10・12の希望日（希望に沿えない場合あり）",
        result: "一次 2/8 18:00・最終 2/16 12:00",
        procedure: "入学金 2/19・初年度学費／手続書類 2/24",
        procedureDateDetails: [
          "入学金納入期限",
          "初年度学費納入・手続書類提出期限",
        ],
        sourceUrl: "https://www.nms.ac.jp/college/nyushi-book/pdf_2027/guidelines_2027.pdf",
      }),
      officialRoute({
        name: "一般選抜 後期",
        category: "general",
        application:
          "Web登録 2027/2/1〜2/19（登録終了時刻の記載なし・受験料は登録翌日23:59まで、締切日登録は当日23:59／書類2/19簡易書留・消印有効）",
        firstExam: "2/28",
        secondExam: "3/9",
        result: "一次 3/6 18:00・最終 3/15 12:00",
        procedure: "入学金・初年度学費／手続書類 3/18",
        procedureDateDetails: ["入学金・初年度学費納入／手続書類提出期限"],
        sourceUrl: "https://www.nms.ac.jp/college/nyushi-book/pdf_2027/guidelines_2027.pdf",
      }),
      officialRoute({
        name: "一般選抜（地域枠）後期",
        category: "general",
        application:
          "Web登録 2027/2/1〜2/19（登録終了時刻の記載なし・受験料は登録翌日23:59まで、締切日登録は当日23:59／書類2/19簡易書留・消印有効）",
        firstExam: "2/28",
        secondExam: "3/9",
        result: "一次 3/6 18:00・最終 3/15 12:00",
        procedure: "入学金・初年度学費／手続書類 3/18",
        procedureDateDetails: ["入学金・初年度学費納入／手続書類提出期限"],
        sourceUrl: "https://www.nms.ac.jp/college/nyushi-book/pdf_2027/guidelines_2027.pdf",
      }),
    ],
  },
  {
    id: "kitasato",
    name: "北里大学",
    region: "関東",
    prefecture: "神奈川県",
    strategyPath: "/kitasato-university-entrance-exam-measures2027/",
    routes: [
      officialRoute({
        name: "一般選抜",
        category: "general",
        application:
          "Web登録 2026/12/17 10:00〜2027/1/19 17:00（書類受付は12月24日から、同日消印有効・国外必着。検定料は登録2日後または締切日の早い方の23:59）。相模原市修学資金枠は市へ12月24日〜1月14日に別途出願",
        firstExam: "2/2",
        secondExam:
          "2/13〜15の選択日（出願時に1日選択／相模原市修学資金枠は2/13・14から選択）",
        result: "一次 2/8 15:00・最終 2/17 15:00",
        procedure: "2/24までに納入・マイページ登録・書類必着",
        procedureDateDetails: ["納入・マイページ登録・書類必着"],
        sourceUrl:
          "https://www.kitasato-u.ac.jp/jp/goukaku/undergraduate_ad/application/application.html",
        applicationDeadlineDateDetails: ["Web登録17:00・検定料は締切日23:59まで（登録後の期限にも注意）・書類消印有効／国外必着"],
        supplementalScheduleEvents: [
          { date: "2027-01-14", column: "applicationDeadline", detail: "相模原市修学資金枠のみ：市への別途出願期限", conditional: true },
        ],
      }),
      {
        name: "地域枠一般選抜（2027年度は実施未定）",
        category: "general",
        application: "2027年度は実施未定（推薦枠に欠員がある場合に実施。詳細は12月1日以降に公表）",
        firstExam: "2027年度は実施未定（実施時は大学公式サイトで公表）",
        secondExam: "2027年度は実施未定（実施時は大学公式サイトで公表）",
        result: "2027年度は実施未定（実施時は大学公式サイトで公表）",
        procedure: "2027年度は実施未定（実施時は大学公式サイトで公表）",
        status: "pending",
        sourceUrl:
          "https://www.kitasato-u.ac.jp/med/admission/index_1.html",
      },
      officialRoute({
        name: "共通テスト利用 前期",
        category: "common",
        application:
          "Web登録 2026/12/17 10:00〜2027/1/15 17:00（書類受付は12月24日から、同日消印有効・国外必着。検定料は登録2日後または締切日の早い方の23:59）",
        firstExam: "共通テスト 1/16・17",
        secondExam:
          "2/13〜15の選択日（出願時に1日選択／一般選抜との併願者は同じ日を選択）",
        result: "一次 2/8 15:00・最終 2/17 15:00",
        procedure: "2/24までに納入・マイページ登録・書類必着",
        procedureDateDetails: ["納入・マイページ登録・書類必着"],
        sourceUrl:
          "https://www.kitasato-u.ac.jp/jp/goukaku/undergraduate_ad/application/application.html",
        applicationDeadlineDateDetails: ["Web登録17:00・検定料は締切日23:59まで（登録後の期限にも注意）・書類消印有効／国外必着"],
      }),
      officialRoute({
        name: "共通テスト利用 後期",
        category: "common",
        application:
          "Web登録 2026/12/17 10:00〜2027/1/15 17:00（書類受付は12月24日から、同日消印有効・国外必着。検定料は登録2日後または締切日の早い方の23:59）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "3/6",
        result: "一次 3/1 15:00・最終 3/10 15:00",
        procedure: "3/17までに納入・マイページ登録・書類必着",
        procedureDateDetails: ["納入・マイページ登録・書類必着"],
        sourceUrl:
          "https://www.kitasato-u.ac.jp/jp/goukaku/undergraduate_ad/application/application.html",
        applicationDeadlineDateDetails: ["Web登録17:00・検定料は締切日23:59まで（登録後の期限にも注意）・書類消印有効／国外必着"],
      }),
    ],
  },
  {
    id: "marianna",
    name: "聖マリアンナ医科大学",
    region: "関東",
    prefecture: "神奈川県",
    strategyPath: "/saint-marianna-university-entrance-exam-measures2027/",
    routes: [
      officialRoute({
        name: "一般選抜 前期",
        category: "general",
        application: "2026/12/14〜2027/1/20（検定料は出願期間内。書類1/21必着）",
        firstExam: "2/4",
        secondExam:
          "2/13・14（Web出願時に希望調査・一次合格発表時に大学が指定）",
        result: "一次 2/10 10:00・最終 2/18 10:00",
        procedure: "2/25 17:00必着",
        procedureDateDetails: ["入学手続締切 17:00必着"],
        sourceUrl: "https://www.marianna-u.ac.jp/univ/ent_info/pdf/selection_guidelines_2027.pdf",
        applicationDeadlineDateDetails: ["Web登録・検定料の締切日（終了時刻は要項に記載なし）", "出願書類必着"],
      }),
      officialRoute({
        name: "一般選抜 後期",
        category: "general",
        application: "2027/2/15〜2/20（検定料は出願期間内。書類2/22必着）",
        firstExam: "3/2",
        secondExam: "3/12（共テ利用と併願・両方一次合格時は1回のみ受験）",
        result: "一次 3/9 10:00・最終 3/18 10:00",
        procedure: "3/24 17:00必着",
        procedureDateDetails: ["入学手続締切 17:00必着"],
        sourceUrl: "https://www.marianna-u.ac.jp/univ/ent_info/pdf/selection_guidelines_2027.pdf",
        applicationDeadlineDateDetails: ["Web登録・検定料の締切日（終了時刻は要項に記載なし）", "出願書類必着"],
      }),
      officialRoute({
        name: "共通テスト利用",
        category: "common",
        application: "2026/12/14〜2027/1/14（検定料は出願期間内。書類1/15必着）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "3/12（一般後期と併願・両方一次合格時は1回のみ受験）",
        result: "一次 3/9 10:00・最終 3/18 10:00",
        procedure: "3/24 17:00必着",
        procedureDateDetails: ["入学手続締切 17:00必着"],
        sourceUrl: "https://www.marianna-u.ac.jp/univ/ent_info/pdf/selection_guidelines_2027.pdf",
        applicationDeadlineDateDetails: ["Web登録・検定料の締切日（終了時刻は要項に記載なし）", "出願書類必着"],
      }),
    ],
  },
  {
    id: "tokai",
    name: "東海大学",
    region: "関東",
    prefecture: "神奈川県",
    strategyPath: "/toukai-university-entrance-exam-measures2027/",
    routes: [
      officialRoute({
        name: "一般選抜",
        category: "general",
        application: "Web 2027/1/4〜1/16 23:59（書類1/19必着）",
        firstExam: "2/2・3（1日または両日受験可・両日受験は高得点日で判定）",
        result: "一次 2/7 9:30・最終 2/18 9:30",
        secondExam: "2/13・14（出願時選択。複数方式の一次に合格した場合は同一日受験も可能）",
        procedure: "Web入学手続 2/18〜2/24 17:00（登録・全額納付、分割は入学金のみ。分割選択者は3月9日17:00までにWeb情報登録・残額納入）",
        sourceUrl:
          "https://www.u-tokai.ac.jp/uploads/2021/02/ad9026c1801ebd0045d9d2534dcb5b07.pdf",
        procedureDateDetails: ["手続開始", "Web入学手続17:00・納付（分割は入学金）"],
        supplementalScheduleEvents: [
          { date: "2027-03-09", column: "procedureDeadline", detail: "分割納付を選択した人のみ：Web情報登録・残額納入17:00", conditional: true },
        ],
      }),
      officialRoute({
        name: "共通テスト利用",
        category: "common",
        application: "Web 2027/1/4〜1/15 23:59（書類1/18必着）",
        firstExam: "共通テスト 1/16・17",
        result: "一次 2/7 9:30・最終 2/18 9:30",
        secondExam: "2/13・14（出願時選択。複数方式の一次に合格した場合は同一日受験も可能）",
        procedure: "Web入学手続 2/18〜2/24 17:00（登録・全額納付、分割は入学金のみ。分割選択者は3月9日17:00までにWeb情報登録・残額納入）",
        sourceUrl:
          "https://www.u-tokai.ac.jp/uploads/2021/02/ad9026c1801ebd0045d9d2534dcb5b07.pdf",
        procedureDateDetails: ["手続開始", "Web入学手続17:00・納付（分割は入学金）"],
        supplementalScheduleEvents: [
          { date: "2027-03-09", column: "procedureDeadline", detail: "分割納付を選択した人のみ：Web情報登録・残額納入17:00", conditional: true },
        ],
      }),
      officialRoute({
        name: "神奈川県地域枠選抜（大学入学共通テスト利用型）",
        category: "common",
        application: "Web 2027/1/4〜1/15 23:59（書類1/18必着）",
        firstExam: "共通テスト 1/16・17",
        result: "一次 2/7 9:30・最終 2/18 9:30",
        secondExam: "2/13・14（出願時選択。複数方式の一次に合格した場合は同一日受験も可能）",
        procedure: "Web入学手続 2/18〜2/24 17:00（登録・全額納付、分割は入学金のみ。分割選択者は3月9日17:00までにWeb情報登録・残額納入）",
        sourceUrl:
          "https://www.u-tokai.ac.jp/uploads/2021/02/ad9026c1801ebd0045d9d2534dcb5b07.pdf",
        procedureDateDetails: ["手続開始", "Web入学手続17:00・納付（分割は入学金）"],
        supplementalScheduleEvents: [
          { date: "2027-03-09", column: "procedureDeadline", detail: "分割納付を選択した人のみ：Web情報登録・残額納入17:00", conditional: true },
        ],
      }),
      officialRoute({
        name: "静岡県地域枠選抜（大学入学共通テスト利用型）",
        category: "common",
        application: "Web 2027/1/4〜1/15 23:59（書類1/18必着）",
        firstExam: "共通テスト 1/16・17",
        result: "一次 2/7 9:30・最終 2/18 9:30",
        secondExam: "2/13・14（出願時選択。複数方式の一次に合格した場合は同一日受験も可能）",
        procedure: "Web入学手続 2/18〜2/24 17:00（登録・全額納付、分割は入学金のみ。分割選択者は3月9日17:00までにWeb情報登録・残額納入）",
        sourceUrl:
          "https://www.u-tokai.ac.jp/uploads/2021/02/ad9026c1801ebd0045d9d2534dcb5b07.pdf",
        procedureDateDetails: ["手続開始", "Web入学手続17:00・納付（分割は入学金）"],
        supplementalScheduleEvents: [
          { date: "2027-03-09", column: "procedureDeadline", detail: "分割納付を選択した人のみ：Web情報登録・残額納入17:00", conditional: true },
        ],
      }),
    ],
  },
  {
    id: "kanazawa-medical",
    name: "金沢医科大学",
    region: "中部",
    prefecture: "石川県",
    strategyPath: "/kanazawaika-university-entrance-exam-measures2027/",
    routes: [
      officialRoute({
        name: "一般選抜 前期",
        category: "general",
        application: "Web 2026/12/14 9:00〜2027/1/15 15:00（書類消印有効。検定料は登録翌日23:59、最終日登録は当日16:00）",
        firstExam: "2/3・4（1日または両日受験可・両日受験は高得点日で判定）",
        secondExam: "2/17・18のうち希望する1日",
        result: "一次 2/10 17:30・最終 2/22 17:30",
        procedure: "3/1 15:00まで",
        sourceUrl: "https://www.kanazawa-med.ac.jp/medicine_exam/assets/m_examguidelines.pdf",
        applicationDeadlineDateDetails: ["Web登録15:00・最終日登録分の検定料16:00・書類消印有効"],
      }),
      officialRoute({
        name: "一般選抜 後期",
        category: "general",
        application: "Web 2027/1/12 9:00〜2/24 15:00（書類消印有効。検定料は登録翌日23:59、最終日登録は当日16:00）",
        firstExam: "3/4",
        secondExam: "3/12",
        result: "一次 3/9 17:30・最終 3/16 17:30",
        procedure: "3/23 15:00まで",
        sourceUrl: "https://www.kanazawa-med.ac.jp/medicine_exam/assets/m_examguidelines.pdf",
        applicationDeadlineDateDetails: ["Web登録15:00・最終日登録分の検定料16:00・書類消印有効"],
      }),
    ],
  },
  {
    id: "aichi-medical",
    name: "愛知医科大学",
    region: "中部",
    prefecture: "愛知県",
    strategyPath: "/aichi-medical-university-entrance-exam2027-measures/",
    routes: [
      officialRoute({
        name: "一般選抜",
        category: "general",
        application: "Web登録・検定料 2026/12/14 9:00〜2027/1/22 17:00（書類1/22消印有効）",
        firstExam: "2/9（小論文も実施）",
        secondExam:
          "2/18〜20のうち出願時に希望日を選択（共テ利用と両方で二次資格を得た場合も面接は1回）。併願時は両方式で同じ日を選択し、出願後の変更不可",
        result: "一次 2/15 18:00ごろ・最終 2/24 11:00ごろ",
        procedure: "2/25〜3/3",
        sourceUrl: "https://www.aichi-med-u.ac.jp/files/igaku/2027nenndogakuseibosyuuyoukou_0731.pdf",
        applicationDeadlineDateDetails: ["Web登録・検定料17:00・書類消印有効"],
      }),
      officialRoute({
        name: "共通テスト利用",
        category: "common",
        application: "Web登録・検定料 2026/12/14 9:00〜2027/1/15 17:00（書類1/15消印有効）",
        firstExam: "共通テスト 1/16・17",
        secondExam:
          "2/18〜20のうち出願時に希望日を選択（一般選抜と両方で二次資格を得た場合も面接は1回）。併願時は両方式で同じ日を選択し、出願後の変更不可",
        result: "一次 2/15 18:00ごろ・最終 2/24 11:00ごろ",
        procedure: "2/25〜3/3",
        sourceUrl: "https://www.aichi-med-u.ac.jp/files/igaku/2027nenndogakuseibosyuuyoukou_0731.pdf",
        applicationDeadlineDateDetails: ["Web登録・検定料17:00・書類消印有効"],
      }),
      officialRoute({
        name: "大学入学共通テスト利用選抜（愛知県地域特別枠B方式）",
        category: "common",
        application: "Web登録・検定料 2026/12/14 9:00〜2027/2/26 17:00（書類2/26消印有効）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "3/10",
        result: "一次 3/8 11:00ごろ・最終 3/18 18:00ごろ",
        procedure: "3/19〜3/24",
        sourceUrl: "https://www.aichi-med-u.ac.jp/files/igaku/2027nenndogakuseibosyuuyoukou_0731.pdf",
        applicationDeadlineDateDetails: ["Web登録・検定料17:00・書類消印有効"],
      }),
    ],
  },
  {
    id: "fujita",
    name: "藤田医科大学",
    region: "中部",
    prefecture: "愛知県",
    strategyPath: "/hujitaika-university-entrance-exam-measures2027/",
    routes: [
      officialRoute({
        name: "一般入試（愛知県地域枠を含む）",
        category: "general",
        application: "2026/12/7〜2027/1/22（Web登録終了時刻は要項に記載なし。書類1/25必着）",
        firstExam: "2/4",
        secondExam: "2/14・15の午前・午後から希望順位を出願時に登録（出願日時順に決定・変更不可。共テ利用との面接は1回）",
        result: "一次 2/9 9:00頃・最終 2/18 9:00頃",
        procedure: "1次（入学金）2/24 23:59・2次（授業料等）3/10 23:59",
        procedureDateDetails: ["1次：入学金の納入期限23:59", "2次：入学金以外の授業料等の納入期限23:59"],
        sourceUrl:
          "https://www.fujita-hu.ac.jp/admission/vsfo8q0000007l3n-att/tedb9e000000p7j6.pdf",
      }),
      officialRoute({
        name: "共通テスト利用入試",
        category: "common",
        application: "2026/12/7〜2027/1/15（Web登録終了時刻は要項に記載なし。書類1/18必着）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "2/14・15の午前・午後から希望順位を出願時に登録（出願日時順に決定・変更不可。一般との面接は1回）",
        result: "一次 2/9 9:00頃・最終 2/18 9:00頃",
        procedure: "1次（入学金）2/24 23:59・2次（授業料等）3/10 23:59",
        procedureDateDetails: ["1次：入学金の納入期限23:59", "2次：入学金以外の授業料等の納入期限23:59"],
        sourceUrl:
          "https://www.fujita-hu.ac.jp/admission/vsfo8q0000007l3n-att/tedb9e000000p7j6.pdf",
      }),
    ],
  },
  {
    id: "osaka-med-pharm",
    name: "大阪医科薬科大学",
    region: "近畿",
    prefecture: "大阪府",
    strategyPath: "/oosakaikayakka-university-entrance-exam-measures2027/",
    routes: [
      officialRoute({
        name: "一般選抜 前期（大阪府地域枠含む）",
        category: "general",
        application: "Web登録 2026/12/9〜2027/1/20 13:00（検定料15:00、書類同日消印有効。大阪府地域枠2名も同日程）",
        applicationDeadlineDateDetails: ["Web登録13:00・検定料15:00・書類同日消印有効"],
        firstExam: "2/10（小論文も実施）",
        secondExam: "2/19（面接）",
        result: "一次 2/17 13:00・最終 2/20 13:00",
        procedure: "2/27 15:00まで",
        sourceUrl:
          "https://www.ompu.ac.jp/admission/undergraduate/medical/qt931k0000005db0-att/cc9f84000000fmbf.pdf",
      }),
      officialRoute({
        name: "一般選抜 後期",
        category: "general",
        application: "Web登録 2026/12/9〜2027/2/22 13:00（検定料15:00、書類同日消印有効）",
        applicationDeadlineDateDetails: ["Web登録13:00・検定料15:00・書類同日消印有効"],
        firstExam: "3/10",
        secondExam: "3/18（小論文・面接）",
        result: "一次 3/16 13:00・最終 3/19 13:00",
        procedure: "3/26 15:00まで",
        sourceUrl:
          "https://www.ompu.ac.jp/admission/undergraduate/medical/qt931k0000005db0-att/cc9f84000000fmbf.pdf",
      }),
      officialRoute({
        name: "大学入学共通テスト利用選抜",
        category: "common",
        application: "Web登録 2026/12/9〜2027/1/15 13:00（検定料15:00、書類同日消印有効）",
        applicationDeadlineDateDetails: ["Web登録13:00・検定料15:00・書類同日消印有効"],
        firstExam: "共通テスト 1/16・17",
        secondExam: "2/28（小論文・面接）",
        result: "一次 2/17 13:00・最終 3/1 13:00",
        procedure: "3/8 15:00まで",
        sourceUrl:
          "https://www.ompu.ac.jp/admission/undergraduate/medical/qt931k0000005db0-att/cc9f84000000fmbf.pdf",
      }),
    ],
  },
  {
    id: "kansai-medical",
    name: "関西医科大学",
    region: "近畿",
    prefecture: "大阪府",
    strategyPath: "/kansaiika-university-entrance-exam-measures2027/",
    routes: [
      officialRoute({
        name: "一般選抜 前期",
        category: "general",
        application: "Web 2026/12/10〜2027/1/15 23:59（検定料は登録翌日23:59、最終日登録は当日23:59。書類1/16消印有効）",
        firstExam: "2/2",
        secondExam:
          "2/20・21から出願時に希望日を選択し大学が指定。地域枠の一次にも合格した場合は地域枠面接の評価を使用",
        result: "一次 2/15 12:00・最終 3/1 10:00",
        procedure: "3/8 15:00まで",
        sourceUrl: "https://www.kmu.ac.jp/juk/fom/information/m3v58f00000036sx-att/R09_admission-requirements.pdf",
      }),
      {
        name: "地域枠一般選抜（大阪府2名・静岡県2名）",
        category: "general",
        application: "Web 2026/12/10〜2027/1/15 23:59（検定料は登録翌日23:59、最終日登録は当日23:59。書類1/16消印有効）",
        firstExam: "2/2（一般前期と同日）",
        secondExam: "2/20（必ず地域枠面接。他の前期方式にも一次合格した場合はその評価を共用）",
        result: "一次 2/15 12:00・最終 3/1 10:00",
        procedure: "3/8 15:00まで",
        status: "official",
        sourceUrl: "https://www.kmu.ac.jp/juk/fom/exam/prefecture.html",
      },
      officialRoute({
        name: "一般選抜 後期",
        category: "general",
        application: "Web 2027/2/1〜2/19 23:59（検定料は登録翌日23:59、最終日登録は当日23:59。書類2/20消印有効）",
        firstExam: "3/6",
        secondExam: "3/16",
        result: "一次 3/12 10:00・最終 3/19 10:00",
        procedure: "3/25 15:00まで",
        sourceUrl: "https://www.kmu.ac.jp/juk/fom/information/m3v58f00000036sx-att/R09_admission-requirements.pdf",
      }),
      officialRoute({
        name: "共通テスト利用 前期",
        category: "common",
        application: "Web 2026/12/10〜2027/1/15 23:59（検定料は登録翌日23:59、最終日登録は当日23:59。書類1/16消印有効）",
        firstExam: "共通テスト 1/16・17",
        secondExam:
          "2/21（一般前期にも重複合格した場合は一般前期の指定日）。地域枠の一次にも合格した場合は地域枠面接の評価を使用",
        result: "一次 2/15 12:00・最終 3/1 10:00",
        procedure: "3/8 15:00まで",
        sourceUrl: "https://www.kmu.ac.jp/juk/fom/information/m3v58f00000036sx-att/R09_admission-requirements.pdf",
      }),
      officialRoute({
        name: "共通テスト・一般併用選抜",
        category: "common",
        application: "Web 2026/12/10〜2027/1/15 23:59（検定料は登録翌日23:59、最終日登録は当日23:59。書類1/16消印有効）",
        firstExam: "共通テスト 1/16・17＋2/2",
        secondExam:
          "2/21（一般前期にも重複合格した場合は一般前期の指定日）。地域枠の一次にも合格した場合は地域枠面接の評価を使用",
        result: "一次 2/15 12:00・最終 3/1 10:00",
        procedure: "3/8 15:00まで",
        sourceUrl: "https://www.kmu.ac.jp/juk/fom/information/m3v58f00000036sx-att/R09_admission-requirements.pdf",
      }),
      officialRoute({
        name: "共通テスト利用 後期",
        category: "common",
        application: "Web 2027/2/1〜2/19 23:59（検定料は登録翌日23:59、最終日登録は当日23:59。書類2/20消印有効）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "3/16",
        result: "一次 3/12 10:00・最終 3/19 10:00",
        procedure: "3/25 15:00まで",
        sourceUrl: "https://www.kmu.ac.jp/juk/fom/information/m3v58f00000036sx-att/R09_admission-requirements.pdf",
      }),
    ],
  },
  {
    id: "kindai",
    name: "近畿大学",
    region: "近畿",
    prefecture: "大阪府",
    strategyPath: "/kinnki-university-entrance-exam-measures2027/",
    routes: [
      officialRoute({
        name: "一般選抜 前期",
        category: "general",
        application:
          "Web・書類 2026/12/18〜2027/1/14（検定料は締切日23:59。Web登録単独の終了時刻は要項に記載なし・書類1/14消印有効）",
        firstExam: "1/31",
        secondExam: "2/14",
        result:
          "一次 2/10（前日21:00からUCARO）・最終 2/23（前日21:00からUCARO）",
        procedure: "入学時納入金・インターネット入学手続 3/5まで",
        sourceUrl: "https://kindai.jp/assets/pdf/exam/2027_nyushiyoko_a4.pdf",
        applicationDeadlineDateDetails: ["Web登録の最終日・検定料23:59・書類消印有効"],
      }),
      officialRoute({
        name: "地域枠入試 一般前期型（和歌山県・静岡県・茨城県・長野県）",
        category: "general",
        application:
          "Web・書類 2026/12/18〜2027/1/14（検定料は締切日23:59。Web登録単独の終了時刻は要項に記載なし・書類1/14消印有効）。茨城県・長野県枠は県への別申請が必要",
        firstExam: "1/31（一般前期と同日）",
        secondExam: "2/14（一般前期と同日）",
        result:
          "一次 2/10（前日21:00からUCARO）・最終 2/23（前日21:00からUCARO）",
        procedure: "入学時納入金・インターネット入学手続 3/5まで",
        sourceUrl: "https://www.kindai.ac.jp/medicine/admissions/exam/region/",
        applicationDeadlineDateDetails: ["Web登録の最終日・検定料23:59・書類消印有効"],
      }),
      officialRoute({
        name: "一般選抜 後期",
        category: "general",
        application:
          "Web・書類 2027/2/1〜2/15（検定料は締切日23:59。Web登録単独の終了時刻は要項に記載なし・書類2/15消印有効）",
        firstExam: "2/28",
        secondExam: "3/11",
        result:
          "一次 3/7（前日21:00からUCARO）・最終 3/19（前日21:00からUCARO）",
        procedure: "入学時納入金・インターネット入学手続 3/25まで",
        sourceUrl: "https://kindai.jp/assets/pdf/exam/2027_nyushiyoko_a4.pdf",
        applicationDeadlineDateDetails: ["Web登録の最終日・検定料23:59・書類消印有効"],
      }),
      officialRoute({
        name: "地域枠入試 一般後期型（静岡県）",
        category: "general",
        application:
          "Web・書類 2027/2/1〜2/15（検定料は締切日23:59。Web登録単独の終了時刻は要項に記載なし・書類2/15消印有効）",
        firstExam: "2/28（一般後期と同日）",
        secondExam: "3/11（一般後期と同日）",
        result:
          "一次 3/7（前日21:00からUCARO）・最終 3/19（前日21:00からUCARO）",
        procedure: "入学時納入金・インターネット入学手続 3/25まで",
        sourceUrl: "https://www.kindai.ac.jp/medicine/admissions/exam/region/",
        applicationDeadlineDateDetails: ["Web登録の最終日・検定料23:59・書類消印有効"],
      }),
      officialRoute({
        name: "共通テスト利用 前期",
        category: "common",
        application:
          "Web・書類 2027/1/3〜1/15（検定料は締切日23:59。Web登録単独の終了時刻は要項に記載なし・書類1/15消印有効）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "2/21",
        result:
          "一次 2/17（前日21:00からUCARO）・最終 3/2（前日21:00からUCARO）",
        procedure: "入学時納入金・インターネット入学手続 3/11まで",
        sourceUrl: "https://kindai.jp/assets/pdf/exam/2027_nyushiyoko_a4.pdf",
        applicationDeadlineDateDetails: ["Web登録の最終日・検定料23:59・書類消印有効"],
      }),
      officialRoute({
        name: "共通テスト利用 中期",
        category: "common",
        application:
          "Web・書類 2027/1/3〜2/1（検定料は締切日23:59。Web登録単独の終了時刻は要項に記載なし・書類2/1消印有効）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "2/21",
        result:
          "一次 2/17（前日21:00からUCARO）・最終 3/2（前日21:00からUCARO）",
        procedure: "入学時納入金・インターネット入学手続 3/11まで",
        sourceUrl: "https://kindai.jp/assets/pdf/exam/2027_nyushiyoko_a4.pdf",
        applicationDeadlineDateDetails: ["Web登録の最終日・検定料23:59・書類消印有効"],
      }),
      officialRoute({
        name: "共通テスト利用 後期",
        category: "common",
        application:
          "Web・書類 2027/2/3〜2/25（検定料は締切日23:59。Web登録単独の終了時刻は要項に記載なし・書類2/25消印有効）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "3/11",
        result:
          "一次 3/7（前日21:00からUCARO）・最終 3/19（前日21:00からUCARO）",
        procedure: "入学時納入金・インターネット入学手続 3/25まで",
        sourceUrl: "https://kindai.jp/assets/pdf/exam/2027_nyushiyoko_a4.pdf",
        applicationDeadlineDateDetails: ["Web登録の最終日・検定料23:59・書類消印有効"],
      }),
    ],
  },
  {
    id: "hyogo-medical",
    name: "兵庫医科大学",
    region: "近畿",
    prefecture: "兵庫県",
    strategyPath: "/https-lexus-ec-com-hyougoika-university-entrance-exam-measures2027/",
    routes: [
      officialRoute({
        name: "一般選抜 A（4科目型／兵庫県推薦入学制度枠を含む）",
        category: "general",
        application:
          "Web・書類 2026/12/14 0:00〜2027/1/20 15:00（検定料は登録翌日23:59まで、最終日登録分は16:00まで。書類は1/20消印有効。兵庫県推薦入学制度枠は県への別途出願が必要。県の受付期限は県の案内で確認）",
        firstExam: "2/4 9:00",
        secondExam:
          "2/17・18の選択日（Web出願登録時に選択・検定料支払後は変更不可／集合時刻は一次合格発表時に案内。兵庫県推薦入学制度枠は別に2月19日の県選考あり）",
        result:
          "一次 2/15 17:00・最終 2/24 10:00（兵庫県推薦入学制度枠の県選考結果は2027年度日程公表待ち）",
        procedure:
          "Post@net登録・手続金納入後、手続書類を郵送：2/24〜3/3消印有効（正規合格者は期間内に入学金を納入すれば、残額と手続書類を3月10日まで猶予可）",
        sourceUrl: "https://www.hyo-med.ac.jp/files/20260703/c737f86c1b3de8f37133c3de2c8031853ac51fff.pdf",
        procedureDateDetails: ["手続開始", "手続金納入・書類消印有効"],
        supplementalScheduleEvents: [
          { date: "2027-03-10", column: "procedureDeadline", detail: "正規合格者のうち猶予の対象者のみ：残額と手続書類の期限", conditional: true },
          { date: "2027-02-19", column: "secondExam", detail: "兵庫県推薦入学制度枠のみ：県選考", conditional: true },
        ],
      }),
      officialRoute({
        name: "一般選抜 B（英語資格試験活用型）",
        category: "general",
        application:
          "Web・書類 2026/12/14 0:00〜2027/1/20 15:00（検定料は登録翌日23:59まで、最終日登録分は16:00まで。書類は1/20消印有効）",
        firstExam: "2/4（B単願は11:10開始／A・B併願は9:00開始）",
        secondExam: "2/27（集合時刻は一次合格発表時に案内）",
        result: "一次 2/24 10:00・最終 3/5 10:00",
        procedure:
          "Post@net登録と手続金納入後に書類郵送：3/5〜3/12消印有効",
        sourceUrl: "https://www.hyo-med.ac.jp/files/20260703/c737f86c1b3de8f37133c3de2c8031853ac51fff.pdf",
      }),
    ],
  },
  {
    id: "kawasaki-medical",
    name: "川崎医科大学",
    region: "中国・四国",
    prefecture: "岡山県",
    strategyPath: "/kawasakiika-university-entrance-exam-measures2027/",
    routes: [
      officialRoute({
        name: "一般選抜・地域枠選抜（岡山県・静岡県・長崎県）",
        category: "general",
        application:
          "Web登録・検定料 2026/12/1 9:00〜2027/1/7 15:00（検定料は登録翌日23:59まで、最終日登録分は15:00まで）・1/7 17:00書類必着（書類受付はWeb登録と同期間）",
        applicationDeadlineDateDetails: ["Web登録15:00・書類17:00必着"],
        firstExam: "2/1（8:00開場・9:15着席）",
        secondExam:
          "2/10・11のうち大学指定日（集合時刻は一次合格発表時に案内）",
        result: "一次 2/4 12:00・最終 2/13 12:00",
        procedure:
          "入学金・学費等振込／書類郵送 2/17消印有効・諸会費振込／証明書郵送 3/31消印有効",
        procedureDateDetails: [
          "入学金・学費等振込／書類郵送（消印有効）",
          "諸会費振込／証明書郵送（消印有効）",
        ],
        sourceUrl: "https://edu.career-tasu.jp/p/digital_pamph/frame.aspx?FL=0&id=7806900-2-15",
      }),
    ],
  },
  {
    id: "kurume",
    name: "久留米大学",
    region: "九州",
    prefecture: "福岡県",
    strategyPath: "/kurume-university-entrance-exam-measures2027/",
    routes: [
      officialRoute({
        name: "一般選抜 前期",
        category: "general",
        application:
          "出願・検定料納付 2026/12/15〜2027/1/7（書類は速達簡易書留・必着。方式別の書類必着日とWebの終了時刻は公開済み要項で確認）",
        applicationDeadlineDateDetails: ["出願・検定料納付締切（書類必着日とWeb終了時刻は募集要項を参照）"],
        firstExam: "2/1",
        secondExam: "2/13（小論文・面接）",
        result: "一次 2/8・最終 2/19",
        procedure: "入学申込締切 3/3・入学手続締切 3/19",
        procedureDateDetails: ["入学申込締切", "入学手続締切"],
        sourceUrl: "https://best.kurume-u.ac.jp/admissions/type/exam-first/",
      }),
      officialRoute({
        name: "一般選抜 後期",
        category: "general",
        application:
          "出願・検定料納付 2027/2/6〜2/25（書類は速達簡易書留・必着。方式別の書類必着日とWebの終了時刻は公開済み要項で確認）",
        applicationDeadlineDateDetails: ["出願・検定料納付締切（書類必着日とWeb終了時刻は募集要項を参照）"],
        firstExam: "3/8",
        secondExam: "3/16（小論文・面接）",
        result: "一次 3/12・最終 3/19",
        procedure: "入学手続締切 3/24",
        procedureDateDetails: ["入学手続締切"],
        sourceUrl: "https://best.kurume-u.ac.jp/admissions/type/exam-second/",
      }),
      officialRoute({
        name: "共通テスト利用 A日程",
        category: "common",
        application:
          "出願・検定料納付 2026/12/15〜2027/1/7（書類は速達簡易書留・必着。方式別の書類必着日とWebの終了時刻は公開済み要項で確認）",
        applicationDeadlineDateDetails: ["出願・検定料納付締切（書類必着日とWeb終了時刻は募集要項を参照）"],
        firstExam: "大学入学共通テスト 1/16・17",
        secondExam: "2/13（小論文・面接）",
        result: "一次 2/8・最終 2/19",
        procedure: "入学申込締切 3/3・入学手続締切 3/19",
        procedureDateDetails: ["入学申込締切", "入学手続締切"],
        sourceUrl: "https://best.kurume-u.ac.jp/admissions/type/common/a/",
      }),
      officialRoute({
        name: "共通テスト利用 B日程",
        category: "common",
        application:
          "出願・検定料納付 2027/2/6〜2/25（書類は速達簡易書留・必着。方式別の書類必着日とWebの終了時刻は公開済み要項で確認）",
        applicationDeadlineDateDetails: ["出願・検定料納付締切（書類必着日とWeb終了時刻は募集要項を参照）"],
        firstExam: "大学入学共通テスト 1/16・17",
        secondExam: "3/16（小論文・面接）",
        result: "一次 3/12・最終 3/19",
        procedure: "入学手続締切 3/24",
        procedureDateDetails: ["入学手続締切"],
        sourceUrl: "https://best.kurume-u.ac.jp/admissions/type/common/b/",
      }),
    ],
  },
  {
    id: "uoeh",
    name: "産業医科大学",
    region: "九州",
    prefecture: "福岡県",
    strategyPath: "/https-lexus-ec-com-sanngyouika-university-entrance-exam-measures2027/",
    routes: [
      officialRoute({
        name: "一般選抜 A方式",
        category: "common",
        application:
          "2026/12/11〜2027/1/15（郵送書類は締切日消印有効。検定料は登録翌日23:59、最終日登録は当日23:59。Web終了時刻は出願サイトで確認）",
        applicationDeadlineDateDetails: ["Web登録・検定料支払いは期間内（最終日登録分の検定料23:59）・書類消印有効"],
        firstExam: "大学入学共通テスト 1/16・17＋個別 2/14",
        secondExam: "3/12（小論文120分・面接1人約20分）",
        result: "二次受験資格（小論文・面接）2/26 16:00頃・最終 3/19 16:00頃",
        procedure:
          "入学手続期間 3/24〜3/25（事前振込・書面提出、受付9:00〜11:30／13:00〜14:30。原則本人、やむを得ない場合は保護者可）",
        procedureDateDetails: ["入学手続開始", "入学手続締切14:30（原則本人来学、やむを得ない場合は保護者可）"],
        sourceUrl: "https://www.uoeh-u.ac.jp/library/nyusi/R9_igaku_ippan_bosyuyoko.pdf",
      }),
      officialRoute({
        name: "一般選抜 B方式",
        category: "general",
        application:
          "2026/12/11〜2027/1/25（郵送書類は締切日消印有効。検定料は登録翌日23:59、最終日登録は当日23:59。Web終了時刻は出願サイトで確認）",
        applicationDeadlineDateDetails: ["Web登録・検定料支払いは期間内（最終日登録分の検定料23:59）・書類消印有効"],
        firstExam: "2/14（個別学力検査）",
        secondExam: "3/12（小論文120分・面接1人約20分）",
        result: "二次受験資格（小論文・面接）2/26 16:00頃・最終 3/19 16:00頃",
        procedure:
          "入学手続期間 3/24〜3/25（事前振込・書面提出、受付9:00〜11:30／13:00〜14:30。原則本人、やむを得ない場合は保護者可）",
        procedureDateDetails: ["入学手続開始", "入学手続締切14:30（原則本人来学、やむを得ない場合は保護者可）"],
        sourceUrl: "https://www.uoeh-u.ac.jp/library/nyusi/R9_igaku_ippan_bosyuyoko.pdf",
      }),
      officialRoute({
        name: "一般選抜 C方式",
        category: "common",
        application:
          "2026/12/11〜2027/2/21（郵送書類は締切日消印有効。検定料は登録翌日23:59、最終日登録は当日23:59。Web終了時刻は出願サイトで確認）",
        applicationDeadlineDateDetails: ["Web登録・検定料支払いは期間内（最終日登録分の検定料23:59）・書類消印有効"],
        firstExam: "大学入学共通テスト 1/16・17",
        secondExam: "3/12（小論文120分・面接1人約20分）",
        result: "二次受験資格（小論文・面接）3/4（発表時刻は大学に確認）・最終 3/19 16:00頃",
        procedure:
          "入学手続期間 3/24〜3/25（事前振込・書面提出、受付9:00〜11:30／13:00〜14:30。原則本人、やむを得ない場合は保護者可）",
        procedureDateDetails: ["入学手続開始", "入学手続締切14:30（原則本人来学、やむを得ない場合は保護者可）"],
        sourceUrl: "https://www.uoeh-u.ac.jp/library/nyusi/R9_igaku_ippan_bosyuyoko.pdf",
      }),
    ],
  },
  {
    id: "fukuoka",
    name: "福岡大学",
    region: "九州",
    prefecture: "福岡県",
    strategyPath: "/hukuoka-university-entrance-exam-measures2027/",
    routes: [
      officialRoute({
        name: "一般選抜 系統別日程",
        category: "general",
        application:
          "Web登録 2026/12/18 10:00〜2027/1/12（検定料23:59・書類同日消印有効。Web登録単独の終了時刻は要項に記載なし）",
        applicationDeadlineDateDetails: ["Web登録最終日（終了時刻の記載なし）・検定料23:59・書類消印有効"],
        firstExam: "2/2（英語・数学・理科2科目＋小論文50分）",
        secondExam:
          "2/14（面接。調査書等と一次選考日に実施した小論文を面接評価に活用）（両方式で一次合格した場合は系統別の面接を1回のみ受験し、原則共テⅠ期にも評価を使用）",
        result: "一次 2/9 10:00・最終 2/23 10:00",
        procedure:
          "入学申込金 2/28・第一期分学費等の納入とWeb入学手続 3/8・卒業証明書等 3/23必着（併願者は3月5日10:00〜3月8日23:59に延納申請すると、申込金以外の納入・Web手続を3月23日まで延期可）",
        procedureDateDetails: ["入学申込金締切", "第一期分学費等の納入・Web入学手続締切", "卒業証明書等必着（延納者は学費等の納入・Web手続も締切）"],
        sourceUrl:
          "https://nyushi.fukuoka-u.ac.jp/cms/wp-content/uploads/2026/11/ippan.pdf",
      }),
      officialRoute({
        name: "共通テスト利用型 Ⅰ期",
        category: "common",
        application:
          "Web登録 2026/12/18 10:00〜2027/1/12（検定料23:59・書類同日消印有効。Web登録単独の終了時刻は要項に記載なし）",
        applicationDeadlineDateDetails: ["Web登録最終日（終了時刻の記載なし）・検定料23:59・書類消印有効"],
        firstExam: "大学入学共通テスト 1/16・17（700点満点）",
        secondExam:
          "2/14（面接50点。調査書等を面接評価に活用）（両方式で一次合格した場合は系統別の面接を1回のみ受験し、原則共テⅠ期にも評価を使用）",
        result: "一次 2/9 10:00・最終 2/23 10:00",
        procedure:
          "入学申込金 2/28・第一期分学費等の納入とWeb入学手続 3/8・卒業証明書等 3/23必着（併願者は3月5日10:00〜3月8日23:59に延納申請すると、申込金以外の納入・Web手続を3月23日まで延期可）",
        procedureDateDetails: ["入学申込金締切", "第一期分学費等の納入・Web入学手続締切", "卒業証明書等必着（延納者は学費等の納入・Web手続も締切）"],
        sourceUrl:
          "https://nyushi.fukuoka-u.ac.jp/cms/wp-content/uploads/2026/11/ippan.pdf",
      }),
    ],
  },
];

// 「official」は、一般選抜・共通テスト利用選抜の完全版要項を確認できた大学のみ。
// 公式の概要・予告日程に基づく大学は、日付を掲載しつつ「preliminary」として区別する。
const fullGuidelineUniversityIds2027 = new Set([
  "iwate-medical",
  "keio",
  "jikei",
  "toho",
  "nihon",
  "kitasato",
  "tokai",
  "kindai",
  "fukuoka",
  "tohoku-med-pharm",
  "dokkyo-medical",
  "jichi-medical",
  "saitama-medical",
  "iuhw",
  "kyorin",
  "juntendo",
  "showa-medical",
  "teikyo",
  "tokyo-medical",
  "tokyo-womens-medical",
  "nippon-medical",
  "marianna",
  "kanazawa-medical",
  "aichi-medical",
  "fujita",
  "osaka-med-pharm",
  "kansai-medical",
  "hyogo-medical",
  "kawasaki-medical",
  "uoeh",
]);

export const privateMedicalUniversities2027: PrivateMedicalUniversity[] =
  privateMedicalUniversitiesSource2027.map((university) => ({
    ...university,
    routes: university.routes.map((route) => {
      if (route.status === "pending" || fullGuidelineUniversityIds2027.has(university.id)) {
        return route;
      }

      return { ...route, status: "preliminary" };
    }),
  }));

export const commonTestDates2027 = {
  account: "マイページ作成：2026年7月1日（水）〜10月2日（金）",
  application: "出願：2026年9月15日（火）〜10月2日（金）",
  exam: "2027年1月16日（土）・17日（日）",
  makeup: "追試験：2027年1月23日（土）・24日（日）",
  sourceUrl:
    "https://www.dnc.ac.jp/albums/abm.php?d=753&f=abm00017382.pdf&n=%E4%BB%A4%E5%92%8C9%E5%B9%B4%E5%BA%A6%E5%A4%A7%E5%AD%A6%E5%85%A5%E5%AD%A6%E8%80%85%E9%81%B8%E6%8A%9C%E3%81%AB%E4%BF%82%E3%82%8B%E5%A4%A7%E5%AD%A6%E5%85%A5%E5%AD%A6%E5%85%B1%E9%80%9A%E3%83%86%E3%82%B9%E3%83%88%E5%AE%9F%E6%96%BD%E8%A6%81%E9%A0%85.pdf",
};

const examCalendarEvents2027 = [
  {
    date: "1/16",
    weekday: "土",
    first: ["大学入学共通テスト（共テ利用・併用方式）"],
    second: [],
  },
  {
    date: "1/17",
    weekday: "日",
    first: ["大学入学共通テスト（共テ利用・併用方式）"],
    second: [],
  },
  {
    date: "1/21",
    weekday: "木",
    first: ["帝京①（一般／①〜③から1〜3日受験可）"],
    second: [],
  },
  {
    date: "1/22",
    weekday: "金",
    first: ["帝京②（一般／①〜③から1〜3日受験可）"],
    second: [],
  },
  {
    date: "1/23",
    weekday: "土",
    first: ["帝京③（一般／①〜③から1〜3日受験可）"],
    second: [],
  },
  {
    date: "1/25",
    weekday: "月",
    first: ["国際医療福祉（一般）", "自治医科①（一般・学力）"],
    second: [],
  },
  {
    date: "1/26",
    weekday: "火",
    first: ["自治医科②（一般・面接／学力試験及第者のみ）"],
    second: [],
  },
  {
    date: "1/31",
    weekday: "日",
    first: ["近畿（一般・前期／地域枠・前期型）"],
    second: [],
  },
  {
    date: "2/1",
    weekday: "月",
    first: [
      "川崎医科（一般・地域枠〔岡山・静岡・長崎〕）",
      "日大（N全学統一方式・第1期）",
      "日本医科（一般・地域枠前期／グローバル）",
      "久留米（一般・前期）",
      "東京女子医科（一般・地域枠／学科・小論文）",
    ],
    second: ["国際医療福祉①（一般／①〜⑥の希望をもとに大学指定）"],
  },
  {
    date: "2/2",
    weekday: "火",
    first: [
      "杏林（一般）",
      "関西医科（一般・前期）",
      "関西医科（地域枠）",
      "関西医科（共テ＋一般併用）",
      "東海①（一般／①〜②の1日または両日受験可・高得点日で判定）",
      "福岡（系統別／小論文も実施）",
      "北里（一般）",
    ],
    second: ["国際医療福祉②（一般／①〜⑥の希望をもとに大学指定）"],
  },
  {
    date: "2/3",
    weekday: "水",
    first: [
      "岩手医科（一般）",
      "金沢医科①（一般・前期／①〜②の1日または両日受験可・高得点日で判定）",
      "順天堂（一般A／学力・小論文）",
      "順天堂（一般B／学力）",
      "順天堂（共テ・前期／小論文）",
      "順天堂（共テ＋一般併用／学力）",
      "東海②（一般／①〜②の1日または両日受験可・高得点日で判定）",
    ],
    second: [
      "自治医科（一般）",
      "国際医療福祉③（一般／①〜⑥の希望をもとに大学指定）",
    ],
  },
  {
    date: "2/4",
    weekday: "木",
    first: [
      "東北医科薬科（一般）",
      "藤田医科（一般）",
      "聖マリアンナ医科（一般・前期）",
      "埼玉医科（一般・前期）",
      "兵庫医科（一般A〔兵庫県推薦入学制度枠含む〕・B）",
      "金沢医科②（一般・前期／①〜②の1日または両日受験可・高得点日で判定）",
    ],
    second: [
      "帝京①（一般／①〜②から受験者が選択）",
      "国際医療福祉④（一般／①〜⑥の希望をもとに大学指定）",
    ],
  },
  {
    date: "2/5",
    weekday: "金",
    first: ["昭和医科（一般・Ⅰ期）"],
    second: [
      "帝京②（一般／①〜②から受験者が選択）",
      "国際医療福祉⑤（一般／①〜⑥の希望をもとに大学指定）",
    ],
  },
  {
    date: "2/6",
    weekday: "土",
    first: ["東京医科（一般／一次・小論文）", "東京医科（共テ／小論文）"],
    second: ["国際医療福祉⑥（一般／①〜⑥の希望をもとに大学指定）"],
  },
  {
    date: "2/7",
    weekday: "日",
    first: ["東邦（一般／千葉県・新潟県地域枠）"],
    second: [],
  },
  {
    date: "2/9",
    weekday: "火",
    first: ["愛知医科（一般）", "慶應義塾（一般）"],
    second: [],
  },
  {
    date: "2/10",
    weekday: "水",
    first: ["大阪医科薬科（一般・前期／大阪府地域枠）"],
    second: [
      "日本医科①（一般・地域枠前期／グローバル／①〜②から希望日を提出・東京都地域枠は①指定）",
      "川崎医科①（一般・地域枠〔岡山・静岡・長崎〕／①〜②から大学指定）",
    ],
  },
  {
    date: "2/11",
    weekday: "木・祝",
    first: ["東京慈恵会医科（一般）"],
    second: [
      "日大（N全学統一方式・第1期）",
      "杏林①（一般／①〜②の希望をもとに大学指定）",
      "川崎医科②（一般・地域枠〔岡山・静岡・長崎〕／①〜②から大学指定）",
    ],
  },
  {
    date: "2/12",
    weekday: "金",
    first: ["獨協医科①（一般・前期／1日または両日受験可）"],
    second: [
      "岩手医科①（一般／①〜②から受験者が選択）",
      "杏林②（一般／①〜②の希望をもとに大学指定）",
      "日本医科②（一般・地域枠前期／グローバル／①〜②から希望日を提出）",
    ],
  },
  {
    date: "2/13",
    weekday: "土",
    first: ["獨協医科②（一般・前期／1日または両日受験可）"],
    second: [
      "岩手医科②（一般／①〜②から受験者が選択）",
      "昭和医科①（一般・Ⅰ期／①〜②から受験者が選択）",
      "東京医科①（一般・共テ／①〜②を出願順に大学指定）",
      "東京女子医科①（一般・地域枠／①〜③から希望日を提出・希望に添えない場合あり）",
      "北里①（一般・共テ前期／①〜③から出願時選択・両方式併願は同日・相模原市枠は①〜②）",
      "聖マリアンナ医科①（一般・前期／①〜②から希望日を提出・大学が指定）",
      "東海①（一般・共テ・地域枠／①〜②から出願時選択）",
      "久留米（一般・前期／共テA／小論文・面接）",
    ],
  },
  {
    date: "2/14",
    weekday: "日",
    first: [
      "産業医科（一般A・B／個別学力）",
    ],
    second: [
      "埼玉医科（一般・前期）",
      "順天堂①（一般A・共テ前期／①〜③の希望をもとに大学が指定）",
      "昭和医科②（一般・Ⅰ期／①〜②から受験者が選択）",
      "東京医科②（一般・共テ／①〜②を出願順に大学指定）",
      "東京女子医科②（一般・地域枠／①〜③から希望日を提出・希望に添えない場合あり）",
      "北里②（一般・共テ前期／①〜③から出願時選択・両方式併願は同日・相模原市枠は①〜②）",
      "聖マリアンナ医科②（一般・前期／①〜②から希望日を提出・大学が指定）",
      "東海②（一般・共テ・地域枠／①〜②から出願時選択）",
      "藤田医科①（一般・共テ／午前・午後の希望順位を出願日時順に決定・変更不可・面接1回）",
      "近畿（一般・前期／地域枠・前期型）",
      "福岡（系統別・共テⅠ期／面接）",
    ],
  },
  {
    date: "2/15",
    weekday: "月",
    first: [],
    second: [
      "順天堂②（一般A・共テ前期／①〜③の希望をもとに大学が指定）",
      "東京女子医科③（一般・地域枠／①〜③から希望日を提出・希望に添えない場合あり）",
      "北里③（一般・共テ前期／①〜③から出願時選択・両方式併願は同日・相模原市枠は選択不可）",
      "東邦①（一般・地域枠／①〜②から出願時に希望・大学指定）",
      "藤田医科②（一般・共テ／午前・午後の希望順位を出願日時順に決定・変更不可・面接1回）",
    ],
  },
  {
    date: "2/16",
    weekday: "火",
    first: [],
    second: [
      "国際医療福祉①（共テ／①・②の両日受験／学力・小論文／一般選抜受験者は免除あり）",
      "順天堂③（一般A・共テ前期／①〜③の希望をもとに大学が指定）",
      "東邦②（一般・地域枠／①〜②から出願時に希望・大学指定）",
    ],
  },
  {
    date: "2/17",
    weekday: "水",
    first: [],
    second: [
      "帝京（共テ・前期）",
      "金沢医科①（一般・前期／①〜②のうち受験者が希望する1日）",
      "兵庫医科①（一般A／①〜②からWeb出願登録時に選択・支払後変更不可）",
    ],
  },
  {
    date: "2/18",
    weekday: "木",
    first: [],
    second: [
      "金沢医科②（一般・前期／①〜②のうち受験者が希望する1日）",
      "兵庫医科②（一般A／①〜②からWeb出願登録時に選択・支払後変更不可）",
      "愛知医科①（一般・共テ／①〜③のうち希望する1日・両方式で二次資格なら面接1回）",
    ],
  },
  {
    date: "2/19",
    weekday: "金",
    first: [],
    second: [
      "兵庫医科（兵庫県推薦入学制度枠のみ／県選考）",
      "愛知医科②（一般・共テ／①〜③のうち希望する1日・両方式で二次資格なら面接1回）",
      "獨協医科①（一般・前期／①〜②の希望を出願受付順に決定・変更不可）",
      "大阪医科薬科（一般・前期／大阪府地域枠）",
    ],
  },
  {
    date: "2/20",
    weekday: "土",
    first: [],
    second: [
      "東北医科薬科①（一般／①〜②から大学指定）",
      "獨協医科②（一般・前期／①〜②の希望を出願受付順に決定・変更不可）",
      "国際医療福祉②（共テ／①・②の両日受験／面接／一般選抜受験者は免除あり）",
      "杏林（共テ／小論文・面接）",
      "東京慈恵会医科①（一般／①〜③から大学指定・都合のつかない日を1日申請可）",
      "愛知医科③（一般・共テ／①〜③のうち希望する1日・両方式で二次資格なら面接1回）",
      "関西医科①（一般・前期／①〜②から出願時に希望選択・大学指定）",
      "関西医科（地域枠／必ず地域枠面接）",
    ],
  },
  {
    date: "2/21",
    weekday: "日",
    first: [],
    second: [
      "東北医科薬科②（一般／①〜②から大学指定）",
      "東京慈恵会医科②（一般／①〜③から大学指定・都合のつかない日を1日申請可）",
      "関西医科②（一般・前期／①〜②から出願時に希望選択・大学指定）",
      "関西医科（共テ前期・共テ＋一般併用／一般前期と重複合格時は大学指定日）",
      "近畿（共テ・前期／中期）",
    ],
  },
  {
    date: "2/22",
    weekday: "月",
    first: [],
    second: ["東京慈恵会医科③（一般／①〜③から大学指定・都合のつかない日を1日申請可）"],
  },
  {
    date: "2/23",
    weekday: "火・祝",
    first: ["東邦（統一入試・大学独自／学科・基礎学力）"],
    second: [],
  },
  {
    date: "2/27",
    weekday: "土",
    first: [],
    second: ["兵庫医科（一般B）"],
  },
  {
    date: "2/28",
    weekday: "日",
    first: [
      "埼玉医科（一般・後期）",
      "日本医科（一般・地域枠後期）",
      "近畿（一般・後期／地域枠・後期型）",
    ],
    second: ["大阪医科薬科（共テ／小論文・面接）"],
  },
  {
    date: "3/1",
    weekday: "月",
    first: [],
    second: ["慶應義塾（一般）"],
  },
  {
    date: "3/2",
    weekday: "火",
    first: ["聖マリアンナ医科（一般・後期）"],
    second: [
      "順天堂①（一般B・共テ併用・共テ後期／①・②の両日受験／小論文・英作文）",
    ],
  },
  {
    date: "3/3",
    weekday: "水",
    first: [],
    second: [
      "東北医科薬科（共テ）",
      "順天堂②（一般B・共テ併用・共テ後期／①・②の両日受験／面接）",
      "東邦（統一入試・大学独自／面接）",
      "大阪医科薬科（一般・前期／大阪府地域枠／繰り上げ合格候補対象者のみ）",
    ],
  },
  {
    date: "3/4",
    weekday: "木",
    first: [
      "日大（N全学統一方式・第2期）",
      "金沢医科（一般・後期）",
    ],
    second: [],
  },
  {
    date: "3/6",
    weekday: "土",
    first: ["昭和医科（一般・Ⅱ期）", "関西医科（一般・後期）"],
    second: ["北里（共テ・後期）"],
  },
  {
    date: "3/7",
    weekday: "日",
    first: [],
    second: ["埼玉医科（一般・後期／共テ／双方一次合格者は1回のみ）"],
  },
  {
    date: "3/8",
    weekday: "月",
    first: [
      "獨協医科（一般・後期）",
      "久留米（一般・後期）",
    ],
    second: [],
  },
  {
    date: "3/9",
    weekday: "火",
    first: [],
    second: ["日本医科（一般・地域枠後期）"],
  },
  {
    date: "3/10",
    weekday: "水",
    first: ["大阪医科薬科（一般・後期）"],
    second: ["愛知医科（共テ・地域枠B）"],
  },
  {
    date: "3/11",
    weekday: "木",
    first: [],
    second: ["近畿（一般・後期／地域枠・後期型／共テ・後期）"],
  },
  {
    date: "3/12",
    weekday: "金",
    first: [],
    second: [
      "聖マリアンナ医科（一般・後期／共テ）",
      "金沢医科（一般・後期）",
      "産業医科（一般A・B・C／小論文120分・面接約20分）",
    ],
  },
  {
    date: "3/13",
    weekday: "土",
    first: [],
    second: ["昭和医科（一般・Ⅱ期）"],
  },
  {
    date: "3/14",
    weekday: "日",
    first: [],
    second: [],
  },
  {
    date: "3/15",
    weekday: "月",
    first: [],
    second: ["獨協医科（一般・後期）"],
  },
  {
    date: "3/16",
    weekday: "火",
    first: [],
    second: [
      "関西医科（一般・後期／共テ・後期）",
      "久留米（一般・後期／共テB／小論文・面接）",
    ],
  },
  {
    date: "3/17",
    weekday: "水",
    first: [],
    second: ["日大（N全学統一方式・第2期）"],
  },
  {
    date: "3/18",
    weekday: "木",
    first: [],
    second: ["大阪医科薬科（一般・後期）"],
  },
] as const;

export type ApplicationDeadlineEntry2027 = {
  date: string;
  dateTime?: string;
  university: string;
  routes: string;
  webDeadline: string;
  documentDeadline: string;
  sourceUrl: string;
};

export const applicationDeadlineEntries2027: ApplicationDeadlineEntry2027[] = [
  {
    date: "1/7",
    dateTime: "2027-01-07",
    university: "川崎医科大学",
    routes: "一般選抜／地域枠（岡山県・静岡県・長崎県）",
    webDeadline: "1/7 15:00",
    documentDeadline: "1/7 17:00 必着",
    sourceUrl: "https://edu.career-tasu.jp/p/digital_pamph/frame.aspx?FL=0&id=7806900-2-15",
  },
  {
    date: "1/7",
    dateTime: "2027-01-07",
    university: "久留米大学",
    routes: "一般前期",
    webDeadline: "1/7（終了時刻は要項を参照）",
    documentDeadline: "速達簡易書留・必着（方式別の期限は要項を参照）",
    sourceUrl: "https://best.kurume-u.ac.jp/admissions/description/",
  },
  {
    date: "1/7",
    dateTime: "2027-01-07",
    university: "久留米大学",
    routes: "共テA日程",
    webDeadline: "1/7（終了時刻は要項を参照）",
    documentDeadline: "速達簡易書留・必着（方式別の期限は要項を参照）",
    sourceUrl: "https://best.kurume-u.ac.jp/admissions/description/",
  },
  {
    date: "1/7",
    dateTime: "2027-01-07",
    university: "国際医療福祉大学",
    routes: "一般選抜",
    webDeadline: "1/7 23:00（検定料23:59まで）",
    documentDeadline: "1/7 消印有効（海外発送は必着）",
    sourceUrl: "https://guidance-iuhw.campus-gate.com/",
  },
  {
    date: "1/8",
    dateTime: "2027-01-08",
    university: "岩手医科大学",
    routes: "一般選抜",
    webDeadline: "1/8（終了時刻は要項に記載なし。最終日登録分の検定料23:59まで）",
    documentDeadline: "1/8 消印有効",
    sourceUrl: "https://www.imu-admission.jp/wp/wp-content/uploads/2026/09/00_ALL.pdf",
  },
  {
    date: "1/12",
    dateTime: "2027-01-12",
    university: "福岡大学",
    routes: "一般（系統別）／共テ利用型Ⅰ期",
    webDeadline: "1/12（終了時刻は要項に記載なし。検定料23:59まで）",
    documentDeadline: "1/12 消印有効",
    sourceUrl: "https://nyushi.fukuoka-u.ac.jp/cms/wp-content/uploads/2026/11/ippan.pdf",
  },
  {
    date: "1/13",
    dateTime: "2027-01-13",
    university: "帝京大学",
    routes: "一般選抜",
    webDeadline: "1/13 16:30（検定料も同時刻）",
    documentDeadline: "1/13 16:30 必着",
    sourceUrl: "https://www.teikyo-u.ac.jp/application/files/2417/8409/4616/02_2027.pdf",
  },
  {
    date: "1/13",
    dateTime: "2027-01-13",
    university: "東京医科大学",
    routes: "一般／共テ利用",
    webDeadline: "1/13 23:59（検定料も同時刻）",
    documentDeadline: "1/13 消印有効",
    sourceUrl: "https://admissions-tokyo-med.jp/wp-content/uploads/2024/12/2027bosyuyoukou_ippan.pdf",
  },
  {
    date: "1/14",
    dateTime: "2027-01-14",
    university: "国際医療福祉大学",
    routes: "共テ利用",
    webDeadline: "1/14 23:00（検定料23:59まで）",
    documentDeadline: "1/14 消印有効（海外発送は必着）",
    sourceUrl: "https://guidance-iuhw.campus-gate.com/",
  },
  {
    date: "1/14",
    dateTime: "2027-01-14",
    university: "聖マリアンナ医科大学",
    routes: "共テ利用",
    webDeadline: "1/14（Web登録・検定料は期間内。終了時刻は要項に記載なし）",
    documentDeadline: "1/15 必着",
    sourceUrl: "https://www.marianna-u.ac.jp/univ/ent_info/pdf/selection_guidelines_2027.pdf",
  },
  {
    date: "1/14",
    dateTime: "2027-01-14",
    university: "近畿大学",
    routes: "一般前期／地域枠・前期型",
    webDeadline: "1/14（Web単独の終了時刻は要項に記載なし。検定料23:59まで）",
    documentDeadline: "1/14 消印有効",
    sourceUrl: "https://www.kindai.ac.jp/medicine/admissions/exam/region/",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "東北医科薬科大学",
    routes: "一般選抜",
    webDeadline: "1/15 13:00",
    documentDeadline: "1/17 必着",
    sourceUrl:
      "https://www.tohoku-mpu.ac.jp/doc/application_omnibus.pdf",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "埼玉医科大学",
    routes: "共テ利用",
    webDeadline: "1/15（終了時刻の記載なし）",
    documentDeadline: "1/16 必着（検定料は同日まで）",
    sourceUrl: "https://adm.saitama-med.ac.jp/wp-content/uploads/2026/07/fa58cf881ba4ac57b5c60b69b2ac25d2.pdf",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "杏林大学",
    routes: "一般／共テ利用",
    webDeadline: "1/15 17:00（検定料も同時刻）",
    documentDeadline: "1/15 必着",
    sourceUrl: "https://www.kyorin-u.ac.jp/univ/center/nyugaku/web_youkou/PDF/2027youkou.pdf",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "順天堂大学",
    routes: "一般A・B／共テ前期・後期／共テ・一般併用",
    webDeadline: "1/15（終了時刻は要項に記載なし）",
    documentDeadline: "1/15 必着",
    sourceUrl: "https://www.juntendo.ac.jp/assets/2027_Juntendo_Med_NyugakuShikenYoukou.pdf",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "帝京大学",
    routes: "共テ利用 前期",
    webDeadline: "1/15 16:30（検定料も同時刻）",
    documentDeadline: "1/15 16:30 必着",
    sourceUrl: "https://www.teikyo-u.ac.jp/application/files/2417/8409/4616/02_2027.pdf",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "東海大学",
    routes: "共テ利用／神奈川県・静岡県地域枠（共テ利用型）",
    webDeadline: "1/15 23:59",
    documentDeadline: "1/18 必着",
    sourceUrl: "https://www.u-tokai.ac.jp/uploads/2021/02/ad9026c1801ebd0045d9d2534dcb5b07.pdf",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "金沢医科大学",
    routes: "一般前期",
    webDeadline: "1/15 15:00（最終日登録分の検定料16:00まで）",
    documentDeadline: "1/15 消印有効",
    sourceUrl: "https://www.kanazawa-med.ac.jp/medicine_exam/assets/m_examguidelines.pdf",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "愛知医科大学",
    routes: "共テ利用",
    webDeadline: "1/15 17:00（検定料も同時刻）",
    documentDeadline: "1/15 消印有効",
    sourceUrl: "https://www.aichi-med-u.ac.jp/files/igaku/2027nenndogakuseibosyuuyoukou_0731.pdf",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "藤田医科大学",
    routes: "共通テスト利用入試",
    webDeadline: "1/15（終了時刻は要項に記載なし）",
    documentDeadline: "1/18 必着",
    sourceUrl: "https://www.fujita-hu.ac.jp/admission/vsfo8q0000007l3n-att/tedb9e000000p7j6.pdf",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "大阪医科薬科大学",
    routes: "大学入学共通テスト利用選抜",
    webDeadline: "1/15 13:00（検定料15:00まで）",
    documentDeadline: "1/15 消印有効",
    sourceUrl: "https://www.ompu.ac.jp/admission/undergraduate/medical/qt931k0000005db0-att/cc9f84000000fmbf.pdf",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "関西医科大学",
    routes: "一般前期／地域枠／共テ前期／共テ・一般併用",
    webDeadline: "1/15 23:59（最終日登録分の検定料も23:59）",
    documentDeadline: "1/16 消印有効",
    sourceUrl: "https://www.kmu.ac.jp/juk/fom/information/m3v58f00000036sx-att/R09_admission-requirements.pdf",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "近畿大学",
    routes: "共テ利用 前期",
    webDeadline: "1/15（Web単独の終了時刻は要項に記載なし。検定料23:59まで）",
    documentDeadline: "1/15 消印有効",
    sourceUrl: "https://kindai.jp/assets/pdf/exam/2027_nyushiyoko_a4.pdf",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "産業医科大学",
    routes: "一般A方式",
    webDeadline: "終了時刻はWeb出願サイトで確認（最終日登録分の検定料23:59まで）",
    documentDeadline: "1/15 消印有効",
    sourceUrl: "https://www.uoeh-u.ac.jp/library/nyusi/R9_igaku_ippan_bosyuyoko.pdf",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "北里大学",
    routes: "共テ利用 前期・後期",
    webDeadline: "1/15 17:00（検定料は登録2日後または締切日の早い方の23:59）",
    documentDeadline: "1/15 消印有効（国外発送は必着）",
    sourceUrl:
      "https://www.kitasato-u.ac.jp/jp/goukaku/undergraduate_ad/application/application.html",
  },
  {
    date: "1/16",
    dateTime: "2027-01-16",
    university: "東海大学",
    routes: "一般選抜",
    webDeadline: "1/16 23:59",
    documentDeadline: "1/19 必着",
    sourceUrl: "https://www.u-tokai.ac.jp/uploads/2021/02/ad9026c1801ebd0045d9d2534dcb5b07.pdf",
  },
  {
    date: "1/18",
    dateTime: "2027-01-18",
    university: "慶應義塾大学",
    routes: "一般選抜",
    webDeadline: "1/18 17:00（検定料も同時刻）",
    documentDeadline: "1/18 国内消印有効／国外必着",
    sourceUrl: "https://www.keio.ac.jp/fixed-files/2027_ippan_youkou.pdf",
  },
  {
    date: "1/18",
    dateTime: "2027-01-18",
    university: "東京女子医科大学",
    routes: "一般選抜（千葉県地域枠を含む）",
    webDeadline: "1/18 23:00（検定料も同時刻）",
    documentDeadline: "1/20 必着（簡易書留）",
    sourceUrl: "https://www.twmu-u.jp/wp-content/uploads/2026/08/30cfa9d6198a1f4ca4a002eee2df2651.pdf",
  },
  {
    date: "1/19",
    dateTime: "2027-01-19",
    university: "北里大学",
    routes: "一般選抜",
    webDeadline: "1/19 17:00（検定料は登録2日後または締切日の早い方の23:59）",
    documentDeadline: "1/19 消印有効（国外発送は必着）",
    sourceUrl:
      "https://www.kitasato-u.ac.jp/jp/goukaku/undergraduate_ad/application/application.html",
  },
  {
    date: "1/20",
    dateTime: "2027-01-20",
    university: "自治医科大学",
    routes: "一般選抜",
    webDeadline: "Web出願なし",
    documentDeadline: "1/20 17:00 必着（1/19消印有効）",
    sourceUrl:
      "https://www.jichi.ac.jp/assets/pdf/exam/medicine/exam/exam_youkou_R9.pdf",
  },
  {
    date: "1/20",
    dateTime: "2027-01-20",
    university: "埼玉医科大学",
    routes: "一般前期",
    webDeadline: "1/20（終了時刻の記載なし）",
    documentDeadline: "1/21 必着（検定料は同日まで）",
    sourceUrl: "https://adm.saitama-med.ac.jp/wp-content/uploads/2026/07/fa58cf881ba4ac57b5c60b69b2ac25d2.pdf",
  },
  {
    date: "1/20",
    dateTime: "2027-01-20",
    university: "聖マリアンナ医科大学",
    routes: "一般前期",
    webDeadline: "1/20（Web登録・検定料は期間内。終了時刻は要項に記載なし）",
    documentDeadline: "1/21 必着",
    sourceUrl: "https://www.marianna-u.ac.jp/univ/ent_info/pdf/selection_guidelines_2027.pdf",
  },
  {
    date: "1/20",
    dateTime: "2027-01-20",
    university: "大阪医科薬科大学",
    routes: "一般前期（大阪府地域枠含む）",
    webDeadline: "1/20 13:00（検定料15:00まで）",
    documentDeadline: "1/20 消印有効",
    sourceUrl: "https://www.ompu.ac.jp/admission/undergraduate/medical/qt931k0000005db0-att/cc9f84000000fmbf.pdf",
  },
  {
    date: "1/20",
    dateTime: "2027-01-20",
    university: "兵庫医科大学",
    routes: "一般A（兵庫県推薦入学制度枠を含む）・B",
    webDeadline:
      "1/20 15:00（検定料は登録翌日23:59まで、最終日登録分は16:00まで）",
    documentDeadline:
      "1/20 消印有効（大学宛の通常出願。兵庫県推薦入学制度枠は県の受付期限を別途確認）",
    sourceUrl: "https://www.hyo-med.ac.jp/files/20260703/c737f86c1b3de8f37133c3de2c8031853ac51fff.pdf",
  },
  {
    date: "1/21",
    dateTime: "2027-01-21",
    university: "昭和医科大学",
    routes: "一般Ⅰ期",
    webDeadline: "1/21（終了時刻は要項に記載なし）",
    documentDeadline: "1/21 必着",
    sourceUrl: "https://adm.showa-u.ac.jp/albums/abm.php?d=2405&f=abm00073368.pdf",
  },
  {
    date: "1/21",
    dateTime: "2027-01-21",
    university: "日本医科大学",
    routes: "一般前期／地域枠前期／グローバル特別選抜（前期）",
    webDeadline: "1/21（志願者情報登録の終了時刻は記載なし・受験料支払いは同日23:59）",
    documentDeadline: "1/21 消印有効（簡易書留）",
    sourceUrl: "https://www.nms.ac.jp/college/nyushi-book/pdf_2027/guidelines_2027.pdf",
  },
  {
    date: "1/22",
    dateTime: "2027-01-22",
    university: "東北医科薬科大学",
    routes: "共テ利用",
    webDeadline: "1/22 13:00",
    documentDeadline: "1/24 必着",
    sourceUrl:
      "https://www.tohoku-mpu.ac.jp/doc/application_omnibus.pdf",
  },
  {
    date: "1/22",
    dateTime: "2027-01-22",
    university: "日本大学",
    routes: "一般選抜 N全学統一方式 第1期",
    webDeadline: "1/22 16:00（検定料は登録完了3日後23:59まで。書類必着に間に合うよう納入）",
    documentDeadline: "1/22 必着（簡易書留）",
    sourceUrl: "https://exam.nihon-u.ac.jp/export/sites/default/guidance/net-nihon-u/gid/pdf/nihon_yoko_ippan_all.pdf",
  },
  {
    date: "1/22",
    dateTime: "2027-01-22",
    university: "愛知医科大学",
    routes: "一般選抜",
    webDeadline: "1/22 17:00（検定料も同時刻）",
    documentDeadline: "1/22 消印有効",
    sourceUrl: "https://www.aichi-med-u.ac.jp/files/igaku/2027nenndogakuseibosyuuyoukou_0731.pdf",
  },
  {
    date: "1/22",
    dateTime: "2027-01-22",
    university: "藤田医科大学",
    routes: "一般入試（愛知県地域枠含む）",
    webDeadline: "1/22（終了時刻は要項に記載なし）",
    documentDeadline: "1/25 必着",
    sourceUrl: "https://www.fujita-hu.ac.jp/admission/vsfo8q0000007l3n-att/tedb9e000000p7j6.pdf",
  },
  {
    date: "1/25",
    dateTime: "2027-01-25",
    university: "東京慈恵会医科大学",
    routes: "一般選抜",
    webDeadline: "1/25（終了時刻は要項に記載なし。最終日登録分の検定料17:00まで）",
    documentDeadline: "1/25 消印有効",
    sourceUrl: "https://www.jikei.ac.jp/wp-content/uploads/2026/10/Application_Guidelines_for_Admission_2027.pdf",
  },
  {
    date: "1/25",
    dateTime: "2027-01-25",
    university: "産業医科大学",
    routes: "一般B方式",
    webDeadline: "終了時刻はWeb出願サイトで確認（最終日登録分の検定料23:59まで）",
    documentDeadline: "1/25 消印有効",
    sourceUrl: "https://www.uoeh-u.ac.jp/library/nyusi/R9_igaku_ippan_bosyuyoko.pdf",
  },
  {
    date: "1/26",
    dateTime: "2027-01-26",
    university: "東邦大学",
    routes: "一般入試／千葉県・新潟県地域枠",
    webDeadline: "1/26 13:00（検定料15:00まで）",
    documentDeadline: "1/26 必着（窓口1/25・26 9:00〜17:00）",
    sourceUrl: "https://www.toho-u.ac.jp/info_exam/med_2027ippan.pdf",
  },
  {
    date: "1/31",
    dateTime: "2027-01-31",
    university: "獨協医科大学",
    routes: "一般前期（栃木・新潟地域枠を含む）",
    webDeadline: "1/31 12:00",
    documentDeadline: "2/1 17:00 必着",
    sourceUrl: "https://www.dokkyomed.ac.jp/upload/CommonFile/files/dokkyo_20261026130911.pdf",
  },
  {
    date: "2/1",
    dateTime: "2027-02-01",
    university: "近畿大学",
    routes: "共テ利用 中期",
    webDeadline: "2/1（Web単独の終了時刻は要項に記載なし。検定料23:59まで）",
    documentDeadline: "2/1 消印有効",
    sourceUrl: "https://kindai.jp/assets/pdf/exam/2027_nyushiyoko_a4.pdf",
  },
  {
    date: "2/15",
    dateTime: "2027-02-15",
    university: "東邦大学",
    routes: "統一入試",
    webDeadline: "2/15 13:00（検定料15:00まで）",
    documentDeadline: "2/15 必着",
    sourceUrl: "https://www.toho-u.ac.jp/info_exam/med_2027tnyushi.pdf",
  },
  {
    date: "2/15",
    dateTime: "2027-02-15",
    university: "近畿大学",
    routes: "一般後期／地域枠・後期型",
    webDeadline: "2/15（Web単独の終了時刻は要項に記載なし。検定料23:59まで）",
    documentDeadline: "2/15 消印有効",
    sourceUrl: "https://www.kindai.ac.jp/medicine/admissions/exam/region/",
  },
  {
    date: "2/17",
    dateTime: "2027-02-17",
    university: "埼玉医科大学",
    routes: "一般後期",
    webDeadline: "2/17（終了時刻の記載なし）",
    documentDeadline: "2/18 必着（検定料は同日まで）",
    sourceUrl: "https://adm.saitama-med.ac.jp/wp-content/uploads/2026/07/fa58cf881ba4ac57b5c60b69b2ac25d2.pdf",
  },
  {
    date: "2/19",
    dateTime: "2027-02-19",
    university: "日本医科大学",
    routes: "一般後期／地域枠後期",
    webDeadline: "2/19（志願者情報登録の終了時刻は記載なし・受験料支払いは同日23:59）",
    documentDeadline: "2/19 消印有効（簡易書留）",
    sourceUrl: "https://www.nms.ac.jp/college/nyushi-book/pdf_2027/guidelines_2027.pdf",
  },
  {
    date: "2/19",
    dateTime: "2027-02-19",
    university: "関西医科大学",
    routes: "一般後期／共テ後期",
    webDeadline: "2/19 23:59（最終日登録分の検定料も23:59）",
    documentDeadline: "2/20 消印有効",
    sourceUrl: "https://www.kmu.ac.jp/juk/fom/information/m3v58f00000036sx-att/R09_admission-requirements.pdf",
  },
  {
    date: "2/20",
    dateTime: "2027-02-20",
    university: "聖マリアンナ医科大学",
    routes: "一般後期",
    webDeadline: "2/20（Web登録・検定料は期間内。終了時刻は要項に記載なし）",
    documentDeadline: "2/22 必着",
    sourceUrl: "https://www.marianna-u.ac.jp/univ/ent_info/pdf/selection_guidelines_2027.pdf",
  },
  {
    date: "2/21",
    dateTime: "2027-02-21",
    university: "産業医科大学",
    routes: "一般C方式",
    webDeadline: "終了時刻はWeb出願サイトで確認（最終日登録分の検定料23:59まで）",
    documentDeadline: "2/21 消印有効",
    sourceUrl: "https://www.uoeh-u.ac.jp/library/nyusi/R9_igaku_ippan_bosyuyoko.pdf",
  },
  {
    date: "2/23",
    dateTime: "2027-02-23",
    university: "昭和医科大学",
    routes: "一般Ⅱ期",
    webDeadline: "2/23（終了時刻は要項に記載なし）",
    documentDeadline: "2/23 必着",
    sourceUrl: "https://adm.showa-u.ac.jp/albums/abm.php?d=2405&f=abm00073368.pdf",
  },
  {
    date: "2/24",
    dateTime: "2027-02-24",
    university: "金沢医科大学",
    routes: "一般後期",
    webDeadline: "2/24 15:00（最終日登録分の検定料16:00まで）",
    documentDeadline: "2/24 消印有効",
    sourceUrl: "https://www.kanazawa-med.ac.jp/medicine_exam/assets/m_examguidelines.pdf",
  },
  {
    date: "2/25",
    dateTime: "2027-02-25",
    university: "日本大学",
    routes: "一般選抜 N全学統一方式 第2期",
    webDeadline: "2/25 16:00（検定料は登録完了3日後23:59まで。書類必着に間に合うよう納入）",
    documentDeadline: "2/25 必着（簡易書留）",
    sourceUrl: "https://exam.nihon-u.ac.jp/export/sites/default/guidance/net-nihon-u/gid/pdf/nihon_yoko_ippan_all.pdf",
  },
  {
    date: "2/25",
    dateTime: "2027-02-25",
    university: "久留米大学",
    routes: "一般後期",
    webDeadline: "2/25（終了時刻は要項を参照）",
    documentDeadline: "速達簡易書留・必着（方式別の期限は要項を参照）",
    sourceUrl: "https://best.kurume-u.ac.jp/admissions/description/",
  },
  {
    date: "2/25",
    dateTime: "2027-02-25",
    university: "久留米大学",
    routes: "共テB日程",
    webDeadline: "2/25（終了時刻は要項を参照）",
    documentDeadline: "速達簡易書留・必着（方式別の期限は要項を参照）",
    sourceUrl: "https://best.kurume-u.ac.jp/admissions/description/",
  },
  {
    date: "2/25",
    dateTime: "2027-02-25",
    university: "近畿大学",
    routes: "共テ利用 後期",
    webDeadline: "2/25（Web単独の終了時刻は要項に記載なし。検定料23:59まで）",
    documentDeadline: "2/25 消印有効",
    sourceUrl: "https://kindai.jp/assets/pdf/exam/2027_nyushiyoko_a4.pdf",
  },
  {
    date: "2/26",
    dateTime: "2027-02-26",
    university: "愛知医科大学",
    routes: "大学入学共通テスト利用選抜（愛知県地域特別枠B方式）",
    webDeadline: "2/26 17:00（検定料も同時刻）",
    documentDeadline: "2/26 消印有効",
    sourceUrl: "https://www.aichi-med-u.ac.jp/files/igaku/2027nenndogakuseibosyuuyoukou_0731.pdf",
  },
  {
    date: "2/22",
    dateTime: "2027-02-22",
    university: "大阪医科薬科大学",
    routes: "一般後期",
    webDeadline: "2/22 13:00（検定料15:00まで）",
    documentDeadline: "2/22 消印有効",
    sourceUrl: "https://www.ompu.ac.jp/admission/undergraduate/medical/qt931k0000005db0-att/cc9f84000000fmbf.pdf",
  },
  {
    date: "2/28",
    dateTime: "2027-02-28",
    university: "獨協医科大学",
    routes: "一般後期",
    webDeadline: "2/28 12:00",
    documentDeadline: "3/1 17:00 必着",
    sourceUrl: "https://www.dokkyomed.ac.jp/upload/CommonFile/files/dokkyo_20261026130911.pdf",
  },
].sort((a, b) => (a.dateTime ?? "9999").localeCompare(b.dateTime ?? "9999"));

const examCalendarEventByDate2027 = new Map<
  string,
  (typeof examCalendarEvents2027)[number]
>(examCalendarEvents2027.map((event) => [event.date, event]));
const examCalendarStart2027 = Date.UTC(2027, 0, 16);
const examCalendarEnd2027 = Date.UTC(2027, 2, 18);
const millisecondsPerDay = 24 * 60 * 60 * 1000;
const weekdayLabels = ["日", "月", "火", "水", "木", "金", "土"] as const;

export const examCalendar2027 = Array.from(
  {
    length:
      Math.floor(
        (examCalendarEnd2027 - examCalendarStart2027) / millisecondsPerDay,
      ) + 1,
  },
  (_, index) => {
    const currentDate = new Date(
      examCalendarStart2027 + index * millisecondsPerDay,
    );
    const date = `${currentDate.getUTCMonth() + 1}/${currentDate.getUTCDate()}`;
    const event = examCalendarEventByDate2027.get(date);

    return {
      date,
      weekday: event?.weekday ?? weekdayLabels[currentDate.getUTCDay()],
      first: event?.first ?? [],
      second: event?.second ?? [],
    };
  },
);

export type FullScheduleColumnKey2027 =
  | "applicationStart"
  | "applicationDeadline"
  | "firstExam"
  | "firstResult"
  | "secondExam"
  | "finalResult"
  | "procedureDeadline";

export type FullScheduleCalendarEntry2027 = {
  university: string;
  routes: string[];
  category: AdmissionRouteCategory;
  sequenceLabel?: string;
  detail?: string;
  conditional?: boolean;
  status: AdmissionRouteStatus;
  sourceUrl?: string;
};

export type FullScheduleCalendarDay2027 = {
  date: string;
  dateTime: string;
  weekday: string;
  isWeekend: boolean;
  isMonthStart: boolean;
  hasEvents: boolean;
  events: Record<FullScheduleColumnKey2027, FullScheduleCalendarEntry2027[]>;
};

export type FullSchedulePendingItem2027 = {
  university: string;
  route: string;
  category: AdmissionRouteCategory;
  fields: FullScheduleColumnKey2027[];
};

type ParsedScheduleDate = {
  key: string;
  year: number;
  month: number;
  day: number;
  raw: string;
  index: number;
  endIndex: number;
};

const fullScheduleColumnKeys2027: FullScheduleColumnKey2027[] = [
  "applicationStart",
  "applicationDeadline",
  "firstExam",
  "firstResult",
  "secondExam",
  "finalResult",
  "procedureDeadline",
];

const emptyFullScheduleEvents2027 = (): Record<
  FullScheduleColumnKey2027,
  FullScheduleCalendarEntry2027[]
> => ({
  applicationStart: [],
  applicationDeadline: [],
  firstExam: [],
  firstResult: [],
  secondExam: [],
  finalResult: [],
  procedureDeadline: [],
});

const toScheduleDateKey = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const parseScheduleDates = (
  value: string | undefined,
  expandSameMonthRanges = false,
): ParsedScheduleDate[] => {
  if (!value) return [];

  const dates: ParsedScheduleDate[] = [];
  const pattern =
    /(?:(20\d{2})\/)?(\d{1,2})\/(\d{1,2})(?:\s*(・|〜|または)\s*(\d{1,2})(?![\d:/]))?/g;

  for (const match of value.matchAll(pattern)) {
    const month = Number(match[2]);
    const year = Number(match[1] ?? (month >= 7 ? 2026 : 2027));
    const day = Number(match[3]);
    const index = match.index ?? 0;
    const raw = match[0];
    const baseDate = new Date(Date.UTC(year, month - 1, day));

    if (
      baseDate.getUTCFullYear() !== year ||
      baseDate.getUTCMonth() !== month - 1 ||
      baseDate.getUTCDate() !== day
    ) {
      continue;
    }

    dates.push({
      key: toScheduleDateKey(year, month, day),
      year,
      month,
      day,
      raw,
      index,
      endIndex: index + raw.length,
    });

    const separator = match[4];
    const shortDay = Number(match[5]);
    if (!separator || !shortDay) continue;

    const rangeDays =
      separator === "〜" && expandSameMonthRanges
        ? Array.from(
            { length: Math.max(shortDay - day, 0) },
            (_, rangeIndex) => day + rangeIndex + 1,
          )
        : [shortDay];

    rangeDays.forEach((rangeDay) => {
      const rangeDate = new Date(Date.UTC(year, month - 1, rangeDay));
      if (
        rangeDate.getUTCFullYear() !== year ||
        rangeDate.getUTCMonth() !== month - 1 ||
        rangeDate.getUTCDate() !== rangeDay
      ) {
        return;
      }

      dates.push({
        key: toScheduleDateKey(year, month, rangeDay),
        year,
        month,
        day: rangeDay,
        raw: String(rangeDay),
        index: index + raw.lastIndexOf(String(shortDay)),
        endIndex: index + raw.length,
      });
    });
  }

  return dates.filter(
    (date, dateIndex, allDates) =>
      allDates.findIndex((candidate) => candidate.key === date.key) === dateIndex,
  );
};

const examSelectionDetail = (value: string) => {
  if (value.includes("希望順位") && value.includes("出願日時順")) {
    return "午前・午後の希望順位を出願日時順に決定・変更不可・併願時の面接1回";
  }
  if (value.includes("希望") && value.includes("受付順")) {
    return "希望を出願受付順に決定・変更不可";
  }
  if (value.includes("双方一次合格") || value.includes("1回のみ")) {
    return "両方式一次合格者は1回のみ";
  }
  if (value.includes("両日受験可")) return "1日または両日受験可";
  if (value.includes("指定方法未公表")) return "いずれか1日・指定方法未公表";
  if (value.includes("一般選抜受験者は一部免除")) {
    return "両日受験・一般選抜受験者は一部免除あり";
  }
  if (value.includes("両日受験")) return "両日受験";
  if (value.includes("1〜3日受験可")) return "1〜3日受験可";
  if (value.includes("自由選択")) return "自由選択";
  if (value.includes("希望をもとに大学が指定")) return "希望をもとに大学指定";
  if (value.includes("希望日を選択し大学が指定")) {
    return "出願時に希望選択・大学指定";
  }
  if (value.includes("希望日")) return "希望日を提出";
  if (value.includes("必ず地域枠面接")) return "必ず地域枠面接";
  if (value.includes("出願が早い順")) return "出願順に大学指定";
  if (value.includes("指定日")) return "大学指定";
  if (value.includes("選択日")) return "受験日を選択";
  if (value.includes("または")) return "いずれかの日程";
  return undefined;
};

const fullScheduleSequenceLabels = [
  "",
  "①",
  "②",
  "③",
  "④",
  "⑤",
  "⑥",
  "⑦",
  "⑧",
  "⑨",
  "⑩",
] as const;

const fullScheduleSequenceLabel = (index: number) =>
  fullScheduleSequenceLabels[index] ?? `(${index})`;

const applicationStartDetail = (value: string) => {
  const firstDate = parseScheduleDates(value)[0];
  const prefix = value.slice(0, firstDate?.index ?? value.length);
  const label = prefix.includes("Web・書類") ? "Web・書類受付開始"
    : prefix.includes("Web") || prefix.includes("登録") ? "Web出願開始"
      : prefix.includes("郵送") ? "郵送受付開始"
        : prefix.includes("書類") ? "書類受付開始" : "出願開始";
  const time = firstDate && value.slice(firstDate.endIndex).match(/^\s*(\d{1,2}:\d{2})/)?.[1];
  return time ? `${label}・${time}` : label;
};

const applicationDeadlineDetail = (
  value: string,
  date: ParsedScheduleDate,
  dates: ParsedScheduleDate[],
  dateIndex: number,
) => {
  const previousEnd = dates[dateIndex - 1]?.endIndex ?? 0;
  const nextStart = dates[dateIndex + 1]?.index ?? value.length;
  const localContext = value.slice(previousEnd, nextStart);
  const afterDate = value.slice(date.index + date.raw.length, nextStart);
  const sourcePrefix = value.slice(0, dates[0]?.index ?? 0);
  const labels: string[] = [];

  if (
    dateIndex === 1 &&
    (sourcePrefix.includes("Web") || sourcePrefix.includes("登録"))
  ) {
    labels.push(
      localContext.includes("登録終了時刻の記載なし")
        ? "Web登録締切（終了時刻記載なし）"
        : "Web登録締切",
    );
  } else if (dateIndex === 1 && sourcePrefix.includes("郵送")) {
    labels.push("郵送締切");
  }

  if (/書類[^）)]*(?:必着|消印|締切)/.test(localContext)) {
    labels.push("書類");
  }

  const time = afterDate.match(/\d{1,2}:\d{2}/)?.[0];
  if (time && !localContext.includes("受験料")) labels.push(time);
  if (localContext.includes("締切日登録は当日23:59")) {
    labels.push("締切日登録分の受験料は23:59まで");
  }
  if (localContext.includes("消印有効") || localContext.includes("消印）")) {
    labels.push("消印有効");
  } else if (localContext.includes("必着")) {
    labels.push("必着");
  }

  return labels.length > 0 ? [...new Set(labels)].join("・") : "出願締切";
};

const procedureDateDetail = (
  value: string,
  dates: ParsedScheduleDate[],
  dateIndex: number,
) => {
  if (value.includes("医学部奨学特待生")) {
    return dateIndex === 0
      ? "通常の入学手続締切"
      : "医学部奨学特待生の入学手続締切";
  }

  const previousEnd = dates[dateIndex - 1]?.endIndex ?? 0;
  const nextStart = dates[dateIndex + 1]?.index ?? value.length;
  const localContext = value
    .slice(previousEnd, nextStart)
    .replace(/^[〜・]+/, "")
    .trim();

  if (localContext.length > 0 && localContext.length <= 30) {
    return localContext;
  }

  return value;
};

// Preserve the time attached to this date, without borrowing another result's time.
const resultTimeDetail = (value: string | undefined, date: ParsedScheduleDate) =>
  value?.slice(date.endIndex).match(/^\s*(\d{1,2}:\d{2}(?:頃|予定)?)/)?.[1];

const fullScheduleEventMap2027 = new Map<
  string,
  Record<FullScheduleColumnKey2027, FullScheduleCalendarEntry2027[]>
>();

const addFullScheduleEvent2027 = (
  date: Pick<ParsedScheduleDate, "key">,
  column: FullScheduleColumnKey2027,
  entry: Omit<FullScheduleCalendarEntry2027, "routes"> & { route: string },
) => {
  const dayEvents =
    fullScheduleEventMap2027.get(date.key) ?? emptyFullScheduleEvents2027();
  const matchingEntry = dayEvents[column].find(
    (candidate) =>
      candidate.university === entry.university &&
      candidate.category === entry.category &&
      candidate.sequenceLabel === entry.sequenceLabel &&
      candidate.detail === entry.detail &&
      candidate.conditional === entry.conditional &&
      candidate.status === entry.status &&
      candidate.sourceUrl === entry.sourceUrl,
  );

  if (matchingEntry) {
    if (!matchingEntry.routes.includes(entry.route)) {
      matchingEntry.routes.push(entry.route);
    }
  } else {
    dayEvents[column].push({
      university: entry.university,
      routes: [entry.route],
      category: entry.category,
      sequenceLabel: entry.sequenceLabel,
      detail: entry.detail,
      ...(entry.conditional ? { conditional: true } : {}),
      status: entry.status,
      sourceUrl: entry.sourceUrl,
    });
  }

  fullScheduleEventMap2027.set(date.key, dayEvents);
};

export const fullSchedulePendingItems2027: FullSchedulePendingItem2027[] = [];

privateMedicalUniversities2027.forEach((university) => {
  university.routes.forEach((route) => {
    const entryBase = {
      university: university.name,
      route: route.name,
      category: route.category,
      status: route.status,
      sourceUrl: route.sourceUrl,
    };
    const pendingFields: FullScheduleColumnKey2027[] = [];
    const applicationDates = parseScheduleDates(route.application);

    if (applicationDates.length > 0) {
      addFullScheduleEvent2027(applicationDates[0], "applicationStart", {
        ...entryBase,
        detail: applicationStartDetail(route.application),
      });

      applicationDates.slice(1).forEach((date, index) => {
        addFullScheduleEvent2027(date, "applicationDeadline", {
          ...entryBase,
          detail:
            route.applicationDeadlineDateDetails?.[index] ??
            applicationDeadlineDetail(
              route.application,
              date,
              applicationDates,
              index + 1,
            ),
        });
      });
    } else {
      pendingFields.push("applicationStart", "applicationDeadline");
    }

    const firstExamDates = parseScheduleDates(route.firstExam, true);
    const individualFirstExamDates = firstExamDates.filter(
      (date) =>
        !(
          route.firstExam.includes("共通テスト") &&
          date.year === 2027 &&
          date.month === 1 &&
          (date.day === 16 || date.day === 17)
        ),
    );

    individualFirstExamDates.forEach((date, dateIndex) => {
      addFullScheduleEvent2027(date, "firstExam", {
        ...entryBase,
        sequenceLabel:
          individualFirstExamDates.length > 1
            ? fullScheduleSequenceLabel(dateIndex + 1)
            : undefined,
        detail: examSelectionDetail(route.firstExam),
      });
    });

    if (firstExamDates.length === 0 && !route.firstExam.includes("共通テスト")) {
      pendingFields.push("firstExam");
    }

    const secondExamDates = parseScheduleDates(route.secondExam, true);
    secondExamDates.forEach((date, dateIndex) => {
      addFullScheduleEvent2027(date, "secondExam", {
        ...entryBase,
        sequenceLabel:
          secondExamDates.length > 1
            ? fullScheduleSequenceLabel(dateIndex + 1)
            : undefined,
        detail: examSelectionDetail(route.secondExam),
      });
    });
    if (secondExamDates.length === 0) pendingFields.push("secondExam");

    const resultParts = route.result?.split("最終") ?? [];
    const firstResultDates = parseScheduleDates(resultParts[0]);
    const finalResultDates = parseScheduleDates(resultParts.slice(1).join("最終"));

    firstResultDates.forEach((date) => {
      addFullScheduleEvent2027(date, "firstResult", {
        ...entryBase,
        detail: [
          route.result?.startsWith("二次受験資格") ? "二次受験資格発表" : "一次合格発表",
          resultTimeDetail(resultParts[0], date),
        ].filter(Boolean).join("・"),
      });
    });
    finalResultDates.forEach((date) => {
      addFullScheduleEvent2027(date, "finalResult", {
        ...entryBase,
        detail: ["最終合格発表", resultTimeDetail(resultParts.slice(1).join("最終"), date)]
          .filter(Boolean).join("・"),
      });
    });
    if (firstResultDates.length === 0) pendingFields.push("firstResult");
    if (finalResultDates.length === 0) pendingFields.push("finalResult");

    const procedureDates = parseScheduleDates(route.procedure);
    const procedureDeadlineDates =
      route.procedure.includes("〜") &&
      !route.procedure.includes("・") &&
      !route.procedure.includes("第")
        ? procedureDates.slice(-1)
        : procedureDates;

    procedureDeadlineDates.forEach((date) => {
      const procedureDateIndex = procedureDates.findIndex(
        (candidate) => candidate.key === date.key,
      );
      const detail = route.procedureDateDetails?.[procedureDateIndex];
      if (detail === "手続開始" || detail === "入学手続開始") return;

      addFullScheduleEvent2027(date, "procedureDeadline", {
        ...entryBase,
        detail:
          detail ??
          procedureDateDetail(route.procedure, procedureDates, procedureDateIndex),
      });
    });
    if (procedureDates.length === 0) pendingFields.push("procedureDeadline");

    for (const event of route.supplementalScheduleEvents ?? []) {
      addFullScheduleEvent2027({ key: event.date }, event.column, {
        ...entryBase,
        detail: event.detail,
        ...(event.conditional ? { conditional: true } : {}),
      });
    }

    if (pendingFields.length > 0) {
      fullSchedulePendingItems2027.push({
        university: university.name,
        route: route.name,
        category: route.category,
        fields: pendingFields,
      });
    }
  });
});

addFullScheduleEvent2027(
  {
    key: "2027-03-03",
  },
  "secondExam",
  {
    university: "大阪医科薬科大学",
    route: "一般選抜 前期・大阪府地域枠（繰り上げ合格候補対象者）",
    category: "general",
    detail: "繰り上げ合格候補対象者のみ",
    status: "official",
    sourceUrl:
      "https://www.ompu.ac.jp/admission/undergraduate/medical/qt931k0000005db0-att/cc9f84000000fmbf.pdf",
  },
);

const commonTestCalendarEntry2027: FullScheduleCalendarEntry2027 = {
  university: "大学入学共通テスト",
  routes: ["共通テスト利用・併用方式"],
  category: "common",
  detail: "本試験",
  status: "official",
  sourceUrl: commonTestDates2027.sourceUrl,
};

["2027-01-16", "2027-01-17"].forEach((dateKey) => {
  const events =
    fullScheduleEventMap2027.get(dateKey) ?? emptyFullScheduleEvents2027();
  events.firstExam.unshift({ ...commonTestCalendarEntry2027 });
  fullScheduleEventMap2027.set(dateKey, events);
});

const fullScheduleDateKeys2027 = [...fullScheduleEventMap2027.keys()].sort();
const fullScheduleStart2027 = new Date(
  `${fullScheduleDateKeys2027[0] ?? "2026-12-01"}T00:00:00Z`,
);
const fullScheduleEnd2027 = new Date(
  `${fullScheduleDateKeys2027.at(-1) ?? "2027-03-26"}T00:00:00Z`,
);
const holidayLabels2027 = new Map([
  ["2027-01-01", "祝"],
  ["2027-01-11", "祝"],
  ["2027-02-11", "祝"],
  ["2027-02-23", "祝"],
  ["2027-03-20", "祝"],
]);

export const fullScheduleCalendar2027: FullScheduleCalendarDay2027[] =
  Array.from(
    {
      length:
        Math.floor(
          (fullScheduleEnd2027.getTime() - fullScheduleStart2027.getTime()) /
            millisecondsPerDay,
        ) + 1,
    },
    (_, index) => {
      const currentDate = new Date(
        fullScheduleStart2027.getTime() + index * millisecondsPerDay,
      );
      const year = currentDate.getUTCFullYear();
      const month = currentDate.getUTCMonth() + 1;
      const day = currentDate.getUTCDate();
      const dateTime = toScheduleDateKey(year, month, day);
      const events =
        fullScheduleEventMap2027.get(dateTime) ?? emptyFullScheduleEvents2027();
      const holidayLabel = holidayLabels2027.get(dateTime);

      return {
        date: `${month}/${day}`,
        dateTime,
        weekday: `${weekdayLabels[currentDate.getUTCDay()]}${holidayLabel ? `・${holidayLabel}` : ""}`,
        isWeekend:
          currentDate.getUTCDay() === 0 ||
          currentDate.getUTCDay() === 6 ||
          Boolean(holidayLabel),
        isMonthStart: day === 1,
        hasEvents: fullScheduleColumnKeys2027.some(
          (column) => events[column].length > 0,
        ),
        events,
      };
    },
  );
