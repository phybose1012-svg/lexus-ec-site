export type AdmissionRouteStatus = "official" | "preliminary" | "pending";
export type AdmissionRouteCategory = "general" | "common";

export type AdmissionRoute = {
  name: string;
  category: AdmissionRouteCategory;
  application: string;
  firstExam: string;
  secondExam: string;
  result?: string;
  procedure: string;
  procedureDateDetails?: string[];
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
        application: "2026/12/4〜2027/1/8（消印有効）",
        firstExam: "2/3",
        secondExam: "2/12・13の選択日",
        result: "一次 2/9・最終 2/18",
        procedure: "2/26まで",
        sourceUrl: "https://www.imu-admission.jp/guidelines/gl_gaiyou/",
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
        application: "2026/12/24〜2027/1/15（書類1/17必着）",
        firstExam: "2/4",
        secondExam: "2/20・21の指定日",
        result: "一次 2/12・最終 2/25",
        procedure: "納付金 3/5まで・書類提出期限 3/11",
        sourceUrl:
          "https://www.tohoku-mpu.ac.jp/wp/wp-content/uploads/2026/05/963a4d3c20d5c1e17605bf8aa1e7293c-1.pdf",
      }),
      officialRoute({
        name: "共通テスト利用",
        category: "common",
        application: "2027/1/5〜1/22（書類1/24必着）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "3/3",
        result: "一次 2/12・最終 3/10",
        procedure: "納付金 3/18まで・書類提出期限 3/23",
        sourceUrl:
          "https://www.tohoku-mpu.ac.jp/wp/wp-content/uploads/2026/05/963a4d3c20d5c1e17605bf8aa1e7293c-1.pdf",
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
        application: "2027/1/4〜1/20 17:00必着（1/19消印有効）",
        firstExam:
          "1/25（学力）・1/26（学力試験及第者のみ面接／出願都道府県指定会場）",
        secondExam: "2/3（自治医科大学）",
        result: "一次 1/29 13:00・最終 2/12 17:00",
        procedure: "2/25・3/12の両日（本人が出願都道府県庁で手続）",
        sourceUrl:
          "https://www.jichi.ac.jp/assets/pdf/exam/medicine/exam/exam_youkou_R9.pdf",
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
        application: "2026/12/23〜2027/2/1",
        firstExam: "2/12・13（両日受験可）",
        secondExam: "2/19・20のいずれか1日（指定方法未公表）",
        result: "一次 2/16 10:00・最終 2/26 17:00",
        procedure: "3/4",
        sourceUrl: "https://www.dokkyomed.ac.jp/dusm/exam/entrance/",
      }),
      officialRoute({
        name: "一般選抜 後期",
        category: "general",
        application: "2027/2/8〜3/1",
        firstExam: "3/8",
        secondExam: "3/15",
        result: "一次 3/11 10:00・最終 3/17 17:00",
        procedure: "3/24",
        sourceUrl: "https://www.dokkyomed.ac.jp/dusm/exam/entrance/",
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
        application: "2026/12/14〜2027/1/20（書類1/21必着）",
        firstExam: "2/4",
        secondExam: "2/14",
        result: "一次 2/10 13:00・最終 2/18 16:00",
        procedure: "2/18〜2/25",
        sourceUrl:
          "https://adm.saitama-med.ac.jp/wp-content/uploads/2026/07/fa58cf881ba4ac57b5c60b69b2ac25d2.pdf",
      }),
      officialRoute({
        name: "一般選抜 後期",
        category: "general",
        application: "2027/2/1〜2/17（書類2/18必着）",
        firstExam: "2/28",
        secondExam: "3/7（共テ利用と双方一次合格の場合は1回のみ）",
        result: "一次 3/4 13:00・最終 3/11 16:00",
        procedure: "3/11〜3/17",
        sourceUrl:
          "https://adm.saitama-med.ac.jp/wp-content/uploads/2026/07/fa58cf881ba4ac57b5c60b69b2ac25d2.pdf",
      }),
      officialRoute({
        name: "大学入学共通テスト利用選抜",
        category: "common",
        application: "2026/12/14〜2027/1/15（書類1/16必着）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "3/7（一般後期と双方一次合格の場合は1回のみ）",
        result: "一次 3/4 13:00・最終 3/11 16:00",
        procedure: "3/11〜3/17",
        sourceUrl:
          "https://adm.saitama-med.ac.jp/wp-content/uploads/2026/07/fa58cf881ba4ac57b5c60b69b2ac25d2.pdf",
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
        application: "2026/12/21〜2027/1/7（国内消印有効・海外発送必着）",
        firstExam: "1/25",
        secondExam: "2/1〜6（希望をもとに大学が指定・試験場も指定）",
        result: "一次 1/29 15:00・最終 2/12 15:00",
        procedure: "2/12〜2/18（消印有効）",
        sourceUrl: "https://narita.iuhw.ac.jp/gakubu/igakubu/admission/doc/guideline_app.pdf?ver=3",
      }),
      officialRoute({
        name: "大学入学共通テスト利用選抜",
        category: "common",
        application: "2026/12/21〜2027/1/14（国内消印有効・海外発送必着）",
        firstExam: "共通テスト 1/16・17",
        secondExam:
          "2/16（学力・小論文）・2/20（面接）の両日受験（一般選抜受験者は一部免除あり）",
        result: "一次 2/12 15:00・最終 3/1 15:00",
        procedure: "3/1〜3/11（消印有効）",
        sourceUrl: "https://narita.iuhw.ac.jp/gakubu/igakubu/admission/doc/guideline_app.pdf?ver=3",
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
        application: "Web 2026/12/1 9:00〜2027/1/15 17:00（書類1/15必着）",
        firstExam: "2/2",
        secondExam: "2/11・12（希望をもとに大学が指定）",
        result: "一次 2/8 17:00・最終 2/17 17:00",
        procedure: "2/25（必着）",
        sourceUrl: "https://www.kyorin-u.ac.jp/univ/center/nyugaku/exam/",
      }),
      officialRoute({
        name: "大学入学共通テスト利用選抜",
        category: "common",
        application: "Web 2026/12/15 9:00〜2027/1/15 17:00（書類1/15必着）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "2/20（小論文・面接）",
        result: "一次 2/15 17:00・最終 2/24 17:00",
        procedure: "3/3（必着）",
        sourceUrl: "https://www.kyorin-u.ac.jp/univ/center/nyugaku/exam/",
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
          "Web登録 2026/12/24 10:00〜2027/1/18 17:00（書類郵送は2027年1月4日開始・1/18消印有効）",
        firstExam: "2/9",
        secondExam: "3/1",
        result: "一次 2/19・最終 3/5",
        procedure: "3/12（入学金等支払・入学手続とも締切）",
        sourceUrl: "https://www.keio.ac.jp/ja/admissions/faculty/examinations/general-admissions/",
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
        secondExam: "2/14〜16（①〜③の希望をもとに大学が指定・希望どおりにならない場合あり）",
        result: "一次 2/10 12:00・最終 2/20 12:00",
        procedure: "2/20〜2/26 17:00",
        sourceUrl: "https://www.juntendo.ac.jp/assets/2027_Juntendo_Med_NyugakuShikenYoukou.pdf",
      }),
      officialRoute({
        name: "一般選抜 B方式",
        category: "general",
        application: "2026/12/14〜2027/1/15（Web締切時刻の記載なし・出願書類必着）",
        firstExam: "2/3（学力）",
        secondExam: "3/2（小論文・英作文）・3/3（面接）",
        result: "一次 2/20 12:00・最終 3/6 12:00",
        procedure: "3/6〜3/12 17:00",
        sourceUrl: "https://www.juntendo.ac.jp/assets/2027_Juntendo_Med_NyugakuShikenYoukou.pdf",
      }),
      officialRoute({
        name: "共通テスト利用 前期",
        category: "common",
        application: "2026/12/14〜2027/1/15（Web締切時刻の記載なし・出願書類必着）",
        firstExam: "共通テスト 1/16・17＋2/3（小論文）",
        secondExam: "2/14〜16（①〜③の希望をもとに大学が指定・希望どおりにならない場合あり）",
        result: "一次 2/10 12:00・最終 2/20 12:00",
        procedure: "2/20〜2/26 17:00",
        sourceUrl: "https://www.juntendo.ac.jp/assets/2027_Juntendo_Med_NyugakuShikenYoukou.pdf",
      }),
      officialRoute({
        name: "共通テスト・一般併用選抜",
        category: "common",
        application: "2026/12/14〜2027/1/15（Web締切時刻の記載なし・出願書類必着）",
        firstExam: "共通テスト 1/16・17＋2/3（学力）",
        secondExam: "3/2（小論文・英作文）・3/3（面接）",
        result: "一次 2/20 12:00・最終 3/6 12:00",
        procedure: "3/6〜3/12 17:00",
        sourceUrl: "https://www.juntendo.ac.jp/assets/2027_Juntendo_Med_NyugakuShikenYoukou.pdf",
      }),
      officialRoute({
        name: "共通テスト利用 後期",
        category: "common",
        application: "2026/12/14〜2027/1/15（Web締切時刻の記載なし・出願書類必着）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "3/2（小論文・英作文）・3/3（面接）",
        result: "一次 2/20 12:00・最終 3/6 12:00",
        procedure: "3/6〜3/12 17:00",
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
        secondExam: "2/13・14の選択日",
        result: "一次 2/10 12:00・最終 2/15 12:00",
        procedure:
          "入学手続・分納第1段階 2/22 12:00まで（書類必着）・分納第2段階 3/3 12:00まで",
        sourceUrl: "https://adm.showa-u.ac.jp/albums/abm.php?d=2405&f=abm00072419.pdf",
      }),
      officialRoute({
        name: "一般選抜 Ⅱ期",
        category: "general",
        application: "2027/2/1〜2/23（Web締切時刻の記載なし・出願書類必着）",
        firstExam: "3/6",
        secondExam: "3/13",
        result: "一次 3/10 12:00・最終 3/15 12:00",
        procedure: "3/23 12:00まで（書類必着・学生納付金等の納入完了）",
        sourceUrl: "https://adm.showa-u.ac.jp/albums/abm.php?d=2405&f=abm00072419.pdf",
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
        result: "一次 1/28・最終 2/13",
        procedure: "2/19まで（医学部奨学特待生は3/5まで）",
        sourceUrl: "https://www.teikyo-u.ac.jp/application/files/2417/8409/4616/02_2027.pdf",
      }),
      officialRoute({
        name: "共通テスト利用 前期",
        category: "common",
        application: "2026/12/17 9:00〜2027/1/15 16:30（必着）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "2/17",
        result: "一次 2/13・最終 2/19",
        procedure: "3/8まで",
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
        secondExam: "2/13・14の指定日（出願が早い順）",
        result: "一次 2/11 10:00・最終 2/18 10:00",
        procedure: "2/18 10:00〜3/1 15:00（納付・書類到着）",
        sourceUrl: "https://admissions-tokyo-med.jp/wp-content/uploads/2024/12/2027bosyuyoukou_ippan.pdf",
      }),
      officialRoute({
        name: "共通テスト利用",
        category: "common",
        application: "2026/12/14 00:00〜2027/1/13 23:59（書類は消印有効）",
        firstExam: "共通テスト 1/16・17＋2/6（小論文）",
        secondExam: "2/13・14の指定日（出願が早い順）",
        result: "一次 2/11 10:00・最終 2/18 10:00",
        procedure: "2/18 10:00〜3/1 15:00（納付・書類到着）",
        sourceUrl: "https://admissions-tokyo-med.jp/wp-content/uploads/2024/12/2027bosyuyoukou_ippan.pdf",
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
        application: "2027/1/4〜1/25（締切日消印有効／Web締切時刻未公表）",
        firstExam: "2/11",
        secondExam: "2/20〜22のいずれか1日（指定方法未公表）",
        result: "一次 2/17 13:00・最終 3/1 10:00",
        procedure: "3/4 第1段階・入学金　3/10 15:00 第2段階・授業料、誓約書等は同日消印有効",
        sourceUrl: "https://www.jikei.ac.jp/university/medicine/admission/summary/",
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
        application: "Web 2026/12/21〜2027/1/18 23:00・書類 1/20必着",
        firstExam: "2/1（学科・小論文）",
        secondExam: "2/13〜15から希望日を提出（希望に添えない場合あり）",
        result: "一次 2/8 14:00・最終 2/19 14:00",
        procedure: "2/20〜3/2 16:00（学納金納付・書類必着）",
        sourceUrl: "https://www.twmu-u.jp/wp-content/uploads/2026/07/c9586e74cb77a02ee36ecf565fb6264f.pdf",
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
          "郵送 2026/12/14〜2027/1/26必着（Webは12/14 10:00開始・締切日時は要項待ち／窓口1/25・26 9:00〜17:00）",
        firstExam: "2/7（学科・基礎学力／五反田TOCビル）",
        secondExam: "2/15・16のいずれか1日（指定方法未公表／大森キャンパス）",
        result: "一次 2/10 12:00・最終 2/18 12:00",
        procedure: "2/25（締切時刻・完了条件は要項公開待ち）",
        sourceUrl: "https://www.toho-u.ac.jp/med/info_exam/ippan.html",
      }),
      officialRoute({
        name: "統一入試",
        category: "general",
        application:
          "郵送 2026/12/14〜2027/2/15必着（Webは12/14 10:00開始・締切日時は要項待ち）",
        firstExam: "2/23（学科・基礎学力／五反田TOCビル）",
        secondExam: "3/3（面接／大森キャンパス）",
        result: "一次 2/26 12:00・最終 3/4 12:00",
        procedure: "3/10（締切時刻・完了条件は要項公開待ち）",
        sourceUrl: "https://www.toho-u.ac.jp/med/info_exam/touitsu.html",
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
          "Web・書類 2027/1/5〜1/22（Web終了時刻未公表・書類は簡易書留で必着）",
        firstExam: "2/1（全国20会場から希望受験地を選択・希望に添えない場合あり）",
        secondExam: "2/11（医学部校舎）",
        result: "一次 2/8 16:00・最終 2/17 13:00",
        procedure: "2/24（入学手続締切）・3/11（二段階最終入学手続締切）",
        procedureDateDetails: ["入学手続締切", "二段階最終入学手続締切"],
        sourceUrl: "https://www.nihon-u.ac.jp/admission_info/application/general_information/general/n_system/",
      }),
      officialRoute({
        name: "一般選抜 N全学統一方式 第2期",
        category: "general",
        application:
          "Web・書類 2027/1/5〜2/25（Web終了時刻未公表・書類は簡易書留で必着）",
        firstExam: "3/4（郡山・千葉・東京・湘南）",
        secondExam: "3/17（医学部校舎）",
        result: "一次 3/12 16:00・最終 3/23 13:00",
        procedure: "3/26（入学手続締切）",
        procedureDateDetails: ["入学手続締切"],
        sourceUrl: "https://www.nihon-u.ac.jp/admission_info/application/general_information/general/n_system/",
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
          "https://www.nihon-u.ac.jp/assets/%E7%AC%AC11%E5%9B%9E%E7%90%86%E4%BA%8B%E4%BC%9A%E8%AD%B0%E4%BA%8B%E9%8C%B2%E8%A6%81%E6%97%A8.pdf",
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
        firstExam:
          "2/1（武蔵境校舎・ベルサール渋谷ファースト／定員超過時は千駄木校舎も使用）",
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
        firstExam:
          "2/1（東京・千葉・埼玉・静岡・新潟／武蔵境校舎・ベルサール渋谷ファースト、定員超過時は千駄木校舎も使用）",
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
        firstExam:
          "共通テスト（国語）1/16＋個別一次 2/1（武蔵境校舎・ベルサール渋谷ファースト／定員超過時は千駄木校舎も使用）",
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
        firstExam: "2/28（武蔵境校舎／定員超過時は千駄木校舎も使用）",
        secondExam: "3/9（千駄木校舎）",
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
        firstExam:
          "2/28（千葉・埼玉・静岡・新潟／武蔵境校舎、定員超過時は千駄木校舎も使用）",
        secondExam: "3/9（千駄木校舎）",
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
          "Web・書類 2026/12/24〜2027/1/19（Web終了時刻は学生募集要項公開待ち・書類1/19消印有効／国外発送は必着）",
        firstExam:
          "2/2（横浜会場／定員超過時は相模原キャンパスも使用）",
        secondExam:
          "2/13〜15の選択日（出願時に1日選択／相模原市修学資金枠は2/13・14から選択）",
        result: "一次 2/8 15:00・最終 2/17 15:00",
        procedure: "2/24（入学手続期限）",
        procedureDateDetails: ["入学手続期限"],
        sourceUrl:
          "https://www.kitasato-u.ac.jp/jp/goukaku/albums/abm.php?f=abm00048868.pdf",
      }),
      {
        name: "地域枠一般選抜（2027年度は実施未定）",
        category: "general",
        application: "2027年度は実施未定（実施時は大学公式サイトで公表）",
        firstExam: "2027年度は実施未定（実施時は大学公式サイトで公表）",
        secondExam: "2027年度は実施未定（実施時は大学公式サイトで公表）",
        result: "2027年度は実施未定（実施時は大学公式サイトで公表）",
        procedure: "2027年度は実施未定（実施時は大学公式サイトで公表）",
        status: "pending",
        sourceUrl:
          "https://www.kitasato-u.ac.jp/jp/goukaku/albums/abm.php?f=abm00048868.pdf",
      },
      officialRoute({
        name: "共通テスト利用 前期",
        category: "common",
        application:
          "Web・書類 2026/12/24〜2027/1/15（Web終了時刻は学生募集要項公開待ち・書類1/15消印有効／国外発送は必着）",
        firstExam: "共通テスト 1/16・17",
        secondExam:
          "2/13〜15の選択日（出願時に1日選択／一般選抜との併願者は同じ日を選択）",
        result: "一次 2/8 15:00・最終 2/17 15:00",
        procedure: "2/24（入学手続期限）",
        procedureDateDetails: ["入学手続期限"],
        sourceUrl:
          "https://www.kitasato-u.ac.jp/jp/goukaku/albums/abm.php?f=abm00048868.pdf",
      }),
      officialRoute({
        name: "共通テスト利用 後期",
        category: "common",
        application:
          "Web・書類 2026/12/24〜2027/1/15（Web終了時刻は学生募集要項公開待ち・書類1/15消印有効／国外発送は必着）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "3/6（相模原キャンパス）",
        result: "一次 3/1 15:00・最終 3/10 15:00",
        procedure: "3/17（入学手続期限）",
        procedureDateDetails: ["入学手続期限"],
        sourceUrl:
          "https://www.kitasato-u.ac.jp/jp/goukaku/albums/abm.php?f=abm00048868.pdf",
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
        application: "2026/12/14〜2027/1/20（書類1/21必着）",
        firstExam: "2/4",
        secondExam:
          "2/13・14（Web出願時に希望調査・一次合格発表時に大学が指定）",
        result: "一次 2/10 10:00・最終 2/18 10:00",
        procedure: "2/25 17:00必着",
        procedureDateDetails: ["入学手続締切 17:00必着"],
        sourceUrl: "https://www.marianna-u.ac.jp/univ/ent_info/pdf/selection_guidelines_2027.pdf",
      }),
      officialRoute({
        name: "一般選抜 後期",
        category: "general",
        application: "2027/2/15〜2/20（書類2/22必着）",
        firstExam: "3/2",
        secondExam: "3/12（共テ利用と併願・両方一次合格時は1回のみ受験）",
        result: "一次 3/9 10:00・最終 3/18 10:00",
        procedure: "3/24 17:00必着",
        procedureDateDetails: ["入学手続締切 17:00必着"],
        sourceUrl: "https://www.marianna-u.ac.jp/univ/ent_info/pdf/selection_guidelines_2027.pdf",
      }),
      officialRoute({
        name: "共通テスト利用",
        category: "common",
        application: "2026/12/14〜2027/1/14（書類1/15必着）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "3/12（一般後期と併願・両方一次合格時は1回のみ受験）",
        result: "一次 3/9 10:00・最終 3/18 10:00",
        procedure: "3/24 17:00必着",
        procedureDateDetails: ["入学手続締切 17:00必着"],
        sourceUrl: "https://www.marianna-u.ac.jp/univ/ent_info/pdf/selection_guidelines_2027.pdf",
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
        result: "2027年度入学試験要項で公表待ち",
        secondExam: "2/13・14（出願時選択）",
        procedure: "2027年度入学試験要項で公表待ち（9月上旬掲載予定）",
        sourceUrl:
          "https://www.u-tokai.ac.jp/examination-admissions/examination-system/undergraduate-academic-medicine/",
      }),
      officialRoute({
        name: "共通テスト利用",
        category: "common",
        application: "Web 2027/1/4〜1/15 23:59（書類1/18必着）",
        firstExam: "共通テスト 1/16・17",
        result: "2027年度入学試験要項で公表待ち",
        secondExam: "2/13・14（出願時選択）",
        procedure: "2027年度入学試験要項で公表待ち（9月上旬掲載予定）",
        sourceUrl:
          "https://www.u-tokai.ac.jp/examination-admissions/examination-system/undergraduate-academic-medicine/",
      }),
      officialRoute({
        name: "神奈川県地域枠選抜（大学入学共通テスト利用型）",
        category: "common",
        application: "Web 2027/1/4〜1/15 23:59（書類1/18必着）",
        firstExam: "共通テスト 1/16・17",
        result: "2027年度入学試験要項で公表待ち",
        secondExam: "2/13・14（出願時選択）",
        procedure: "2027年度入学試験要項で公表待ち（9月上旬掲載予定）",
        sourceUrl:
          "https://www.u-tokai.ac.jp/examination-admissions/examination-system/undergraduate-academic-medicine/",
      }),
      officialRoute({
        name: "静岡県地域枠選抜（大学入学共通テスト利用型）",
        category: "common",
        application: "Web 2027/1/4〜1/15 23:59（書類1/18必着）",
        firstExam: "共通テスト 1/16・17",
        result: "2027年度入学試験要項で公表待ち",
        secondExam: "2/13・14（出願時選択）",
        procedure: "2027年度入学試験要項で公表待ち（9月上旬掲載予定）",
        sourceUrl:
          "https://www.u-tokai.ac.jp/examination-admissions/examination-system/undergraduate-academic-medicine/",
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
        application: "Web 2026/12/14 9:00〜2027/1/15 15:00（書類消印有効）",
        firstExam:
          "2/3・4（1日または両日受験可・両日受験は高得点日で判定／本学・東京・大阪・名古屋・福岡）",
        secondExam: "2/17・18のうち希望する1日（本学）",
        result: "一次 2/10 17:30・最終 2/22 17:30",
        procedure: "3/1 15:00まで",
        sourceUrl: "https://www.kanazawa-med.ac.jp/medicine_exam/assets/m_admissionguide.pdf.pdf",
      }),
      officialRoute({
        name: "一般選抜 後期",
        category: "general",
        application: "Web 2027/1/12 9:00〜2/24 15:00（書類消印有効）",
        firstExam: "3/4（本学・東京・大阪）",
        secondExam: "3/12（本学）",
        result: "一次 3/9 17:30・最終 3/16 17:30",
        procedure: "3/23 15:00まで",
        sourceUrl: "https://www.kanazawa-med.ac.jp/medicine_exam/assets/m_admissionguide.pdf.pdf",
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
        application: "2026/12/14〜2027/1/22",
        firstExam: "2/9（名古屋・東京・大阪・福岡／小論文も実施）",
        secondExam:
          "2/18〜20のうち出願時に希望日を選択（本学／共テ利用と両方で二次資格を得た場合も面接は1回）",
        result: "一次 2/15・最終 2/24",
        procedure: "2/25〜3/3",
        sourceUrl: "https://www.aichi-med-u.ac.jp/su11/su1107/su110701/su11070101/03.html",
      }),
      officialRoute({
        name: "共通テスト利用",
        category: "common",
        application: "2026/12/14〜2027/1/15",
        firstExam: "共通テスト 1/16・17（共通テスト受験会場）",
        secondExam:
          "2/18〜20のうち希望日を選択（本学／一般選抜と両方で二次資格を得た場合も面接は1回）",
        result: "一次 2/15・最終 2/24",
        procedure: "2/25〜3/3",
        sourceUrl: "https://www.aichi-med-u.ac.jp/su11/su1107/su110701/su11070101/04.html",
      }),
      officialRoute({
        name: "共通テスト利用 地域枠B",
        category: "common",
        application: "2026/12/14〜2027/2/26",
        firstExam: "共通テスト 1/16・17（共通テスト受験会場）",
        secondExam: "3/10（本学）",
        result: "一次 3/8・最終 3/18",
        procedure: "3/19〜3/24",
        sourceUrl: "https://www.aichi-med-u.ac.jp/su11/su1107/su110701/su11070101/06.html",
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
        application: "2026/12/7〜2027/1/22（書類1/25必着）",
        firstExam: "2/4（東京・名古屋・大阪）",
        secondExam: "2/14・15のいずれか1日（本学／指定方法未公表・要項公開待ち）",
        result: "一次 2/9・最終 2/18",
        procedure: "2027年度学生募集要項で確認",
        sourceUrl:
          "https://www.fujita-hu.ac.jp/admission/exam-med/dubv6r0000001ec6-att/j93sdv000000ub7u.pdf",
      }),
      officialRoute({
        name: "共通テスト利用入試",
        category: "common",
        application: "2026/12/7〜2027/1/15（書類1/18必着）",
        firstExam: "共通テスト 1/16・17（共通テスト受験会場）",
        secondExam: "2/14・15のいずれか1日（本学／指定方法未公表・要項公開待ち）",
        result: "一次 2/9・最終 2/18",
        procedure: "2027年度学生募集要項で確認",
        sourceUrl:
          "https://www.fujita-hu.ac.jp/admission/exam-med/dubv6r0000001ec6-att/j93sdv000000ub7x.pdf",
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
        application: "2026/12/9〜2027/1/20（消印有効）",
        firstExam: "2/10（大阪・愛知・東京／小論文も実施）",
        secondExam: "2/19（本部キャンパス／面接）",
        result: "一次 2/17・最終 2/20",
        procedure: "2/27まで",
        sourceUrl:
          "https://www.ompu.ac.jp/admission/undergraduate/qt931k000000801q-att/afif3u000000fsvj.pdf",
      }),
      officialRoute({
        name: "一般選抜 後期",
        category: "general",
        application: "2026/12/9〜2027/2/26（消印有効）",
        firstExam: "3/10（大阪・東京）",
        secondExam: "3/18（本部キャンパス／小論文・面接）",
        result: "一次 3/16・最終 3/19",
        procedure: "3/26まで",
        sourceUrl:
          "https://www.ompu.ac.jp/admission/undergraduate/qt931k000000801q-att/afif3u000000fsvj.pdf",
      }),
      officialRoute({
        name: "大学入学共通テスト利用選抜",
        category: "common",
        application: "2026/12/9〜2027/1/15（消印有効）",
        firstExam: "共通テスト 1/16・17（共通テスト指定試験場）",
        secondExam: "2/28（本部キャンパス／小論文・面接）",
        result: "一次 2/17・最終 3/1",
        procedure: "3/8まで",
        sourceUrl:
          "https://www.ompu.ac.jp/admission/undergraduate/qt931k000000801q-att/afif3u000000fsvj.pdf",
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
        application: "Web 2026/12/10〜2027/1/15 23:59（書類1/16消印有効）",
        firstExam:
          "2/2（大阪ATC・東京TRC・名古屋コンベンションホール・福岡南近代ビル）",
        secondExam:
          "2/20・21から出願時に希望日を選択し大学が指定（枚方キャンパス医学部棟）",
        result: "一次 2/15 12:00・最終 3/1 10:00",
        procedure: "3/8 15:00まで",
        sourceUrl: "https://www.kmu.ac.jp/juk/fom/information/m3v58f00000036sx-att/R09_admission-requirements.pdf",
      }),
      {
        name: "地域枠一般選抜（大阪府3名予定・静岡県2名予定／臨時定員増設置構想中）",
        category: "general",
        application: "Web 2026/12/10〜2027/1/15 23:59（書類1/16消印有効）",
        firstExam:
          "2/2（一般前期と同日・同一会場／大阪ATC・東京TRC・名古屋コンベンションホール・福岡南近代ビル）",
        secondExam: "2/20（必ず地域枠面接／枚方キャンパス医学部棟）",
        result: "一次 2/15 12:00・最終 3/1 10:00",
        procedure: "3/8 15:00まで",
        status: "preliminary",
        sourceUrl: "https://www.kmu.ac.jp/juk/fom/information/m3v58f00000036sx-att/R09_admission-requirements.pdf",
      },
      officialRoute({
        name: "一般選抜 後期",
        category: "general",
        application: "Web 2027/2/1〜2/19 23:59（書類2/20消印有効）",
        firstExam: "3/6（枚方キャンパス医学部棟）",
        secondExam: "3/16（枚方キャンパス医学部棟）",
        result: "一次 3/12 10:00・最終 3/19 10:00",
        procedure: "3/25 15:00まで",
        sourceUrl: "https://www.kmu.ac.jp/juk/fom/information/m3v58f00000036sx-att/R09_admission-requirements.pdf",
      }),
      officialRoute({
        name: "共通テスト利用 前期",
        category: "common",
        application: "Web 2026/12/10〜2027/1/15 23:59（書類1/16消印有効）",
        firstExam: "共通テスト 1/16・17（共通テスト受験地）",
        secondExam:
          "2/21（一般前期にも重複合格した場合は一般前期の指定日／枚方キャンパス医学部棟）",
        result: "一次 2/15 12:00・最終 3/1 10:00",
        procedure: "3/8 15:00まで",
        sourceUrl: "https://www.kmu.ac.jp/juk/fom/information/m3v58f00000036sx-att/R09_admission-requirements.pdf",
      }),
      officialRoute({
        name: "共通テスト・一般併用選抜",
        category: "common",
        application: "Web 2026/12/10〜2027/1/15 23:59（書類1/16消印有効）",
        firstExam:
          "共通テスト 1/16・17＋2/2（一般前期は大阪ATC・東京TRC・名古屋コンベンションホール・福岡南近代ビル）",
        secondExam:
          "2/21（一般前期にも重複合格した場合は一般前期の指定日／枚方キャンパス医学部棟）",
        result: "一次 2/15 12:00・最終 3/1 10:00",
        procedure: "3/8 15:00まで",
        sourceUrl: "https://www.kmu.ac.jp/juk/fom/information/m3v58f00000036sx-att/R09_admission-requirements.pdf",
      }),
      officialRoute({
        name: "共通テスト利用 後期",
        category: "common",
        application: "Web 2027/2/1〜2/19 23:59（書類2/20消印有効）",
        firstExam: "共通テスト 1/16・17（共通テスト受験地）",
        secondExam: "3/16（枚方キャンパス医学部棟）",
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
        application: "2026/12/18〜2027/1/14（消印有効）",
        firstExam: "1/31",
        secondExam: "2/14",
        result: "一次 2/10・最終 2/23",
        procedure: "3/5まで",
        sourceUrl: "https://kindai.jp/exam/system/",
      }),
      officialRoute({
        name: "一般選抜 後期",
        category: "general",
        application: "2027/2/1〜2/15（消印有効）",
        firstExam: "2/28",
        secondExam: "3/11",
        result: "一次 3/7・最終 3/19",
        procedure: "3/25まで",
        sourceUrl: "https://kindai.jp/exam/system/",
      }),
      officialRoute({
        name: "共通テスト利用 前期",
        category: "common",
        application: "2027/1/3〜1/15（消印有効）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "2/21",
        result: "一次 2/17・最終 3/2",
        procedure: "3/11まで",
        sourceUrl: "https://kindai.jp/exam/system/",
      }),
      officialRoute({
        name: "共通テスト利用 中期",
        category: "common",
        application: "2027/1/3〜2/1（消印有効）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "2/21",
        result: "一次 2/17・最終 3/2",
        procedure: "3/11まで",
        sourceUrl: "https://kindai.jp/exam/system/",
      }),
      officialRoute({
        name: "共通テスト利用 後期",
        category: "common",
        application: "2027/2/3〜2/25（消印有効）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "3/11",
        result: "一次 3/7・最終 3/19",
        procedure: "3/25まで",
        sourceUrl: "https://kindai.jp/exam/system/",
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
        name: "一般選抜 A（4科目型）",
        category: "general",
        application: "2026/12/14〜2027/1/20（消印有効）",
        firstExam: "2/4",
        secondExam: "2/17・18の選択日",
        result: "一次 2/15 17:00・最終 2/24 10:00",
        procedure: "2/24〜3/3（消印有効）",
        sourceUrl: "https://www.hyo-med.ac.jp/files/20260703/c737f86c1b3de8f37133c3de2c8031853ac51fff.pdf",
      }),
      officialRoute({
        name: "一般選抜 B（英語資格活用型）",
        category: "general",
        application: "2026/12/14〜2027/1/20（消印有効）",
        firstExam: "2/4",
        secondExam: "2/27",
        result: "一次 2/24 10:00・最終 3/5 10:00",
        procedure: "3/5〜3/12（消印有効）",
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
        name: "一般選抜",
        category: "general",
        application: "Web・書類 2026/12/1 9:00〜2027/1/7 17:00必着",
        firstExam: "2/1",
        secondExam: "2/10・11の指定日",
        result: "一次 2/4 12:00・最終 2/13 12:00",
        procedure: "2/13〜2/17",
        sourceUrl: "https://m.kawasaki-m.ac.jp/examination/youkou.php",
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
        application: "2026/12/15〜2027/1/7",
        firstExam: "2/1",
        secondExam: "2/13",
        result: "一次 2/8・最終 2/19",
        procedure: "入学申込 3/3・手続 3/19",
        sourceUrl: "https://best.kurume-u.ac.jp/admissions/type/exam-first/",
      }),
      officialRoute({
        name: "一般選抜 後期",
        category: "general",
        application: "2027/2/6〜2/25",
        firstExam: "3/8",
        secondExam: "3/16",
        result: "一次 3/12・最終 3/19",
        procedure: "3/24まで",
        sourceUrl: "https://best.kurume-u.ac.jp/admissions/type/exam-second/",
      }),
      officialRoute({
        name: "共通テスト利用 A日程",
        category: "common",
        application: "2026/12/15〜2027/1/7",
        firstExam: "共通テスト 1/16・17",
        secondExam: "2/13",
        result: "一次 2/8・最終 2/19",
        procedure: "入学申込 3/3・手続 3/19",
        sourceUrl: "https://best.kurume-u.ac.jp/admissions/type/common/a/",
      }),
      officialRoute({
        name: "共通テスト利用 B日程",
        category: "common",
        application: "2027/2/6〜2/25",
        firstExam: "共通テスト 1/16・17",
        secondExam: "3/16",
        result: "一次 3/12・最終 3/19",
        procedure: "3/24まで",
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
        application: "2026/12/11〜2027/1/15（消印有効）",
        firstExam: "共通テスト 1/16・17＋個別 2/14",
        secondExam: "3/12（小論文・面接）",
        result: "二次受験資格 2/26・最終 3/19",
        procedure: "3/24〜3/25",
        sourceUrl: "https://www.uoeh-u.ac.jp/library/nyusi/R9_jissiyoko.pdf",
      }),
      officialRoute({
        name: "一般選抜 B方式",
        category: "general",
        application: "2026/12/11〜2027/1/25（消印有効）",
        firstExam: "2/14（個別学力検査）",
        secondExam: "3/12（小論文・面接）",
        result: "二次受験資格 2/26・最終 3/19",
        procedure: "3/24〜3/25",
        sourceUrl: "https://www.uoeh-u.ac.jp/library/nyusi/R9_jissiyoko.pdf",
      }),
      officialRoute({
        name: "一般選抜 C方式",
        category: "common",
        application: "2026/12/11〜2027/2/21（消印有効）",
        firstExam: "共通テスト 1/16・17",
        secondExam: "3/12（小論文・面接）",
        result: "二次受験資格 3/4・最終 3/19",
        procedure: "3/24〜3/25",
        sourceUrl: "https://www.uoeh-u.ac.jp/library/nyusi/R9_jissiyoko.pdf",
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
        application: "2026/12/18〜2027/1/12",
        firstExam: "2/2",
        secondExam: "2/14",
        result: "一次 2/9・最終 2/23",
        procedure: "WEB入学手続 3/8まで",
        sourceUrl: "https://nyushi.fukuoka-u.ac.jp/nyushi/type-3/",
      }),
      officialRoute({
        name: "共通テスト利用型 Ⅰ期",
        category: "common",
        application: "2026/12/18〜2027/1/12",
        firstExam: "共通テスト 1/16・17",
        secondExam: "2/14",
        result: "一次 2/9・最終 2/23",
        procedure: "WEB入学手続 3/8まで",
        sourceUrl: "https://nyushi.fukuoka-u.ac.jp/nyushi/type-3/",
      }),
    ],
  },
];

// 「official」は、一般選抜・共通テスト利用選抜の完全版要項を確認できた大学のみ。
// 公式の概要・予告日程に基づく大学は、日付を掲載しつつ「preliminary」として区別する。
const fullGuidelineUniversityIds2027 = new Set([
  "jichi-medical",
  "saitama-medical",
  "iuhw",
  "juntendo",
  "showa-medical",
  "teikyo",
  "tokyo-womens-medical",
  "nippon-medical",
  "marianna",
  "kansai-medical",
  "hyogo-medical",
  "kawasaki-medical",
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
    first: ["近畿（一般・前期）"],
    second: [],
  },
  {
    date: "2/1",
    weekday: "月",
    first: [
      "川崎医科（一般）",
      "日大（N全学統一方式・第1期／全国20会場から希望受験地を選択）",
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
      "関西医科（地域枠・構想中）",
      "関西医科（共テ＋一般併用）",
      "東海①（一般／①〜②の1日または両日受験可・高得点日で判定）",
      "福岡（一般）",
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
      "兵庫医科（一般A・B）",
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
    first: ["東邦（一般）"],
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
      "川崎医科①（一般／①〜②から大学指定）",
    ],
  },
  {
    date: "2/11",
    weekday: "木・祝",
    first: ["東京慈恵会医科（一般）"],
    second: [
      "日大（N全学統一方式・第1期／医学部校舎）",
      "杏林①（一般／①〜②の希望をもとに大学指定）",
      "川崎医科②（一般／①〜②から大学指定）",
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
      "久留米（一般・前期／共テA）",
    ],
  },
  {
    date: "2/14",
    weekday: "日",
    first: ["産業医科（一般A・B／個別学力）"],
    second: [
      "埼玉医科（一般・前期）",
      "順天堂①（一般A・共テ前期／①〜③の希望をもとに大学が指定）",
      "昭和医科②（一般・Ⅰ期／①〜②から受験者が選択）",
      "東京医科②（一般・共テ／①〜②を出願順に大学指定）",
      "東京女子医科②（一般・地域枠／①〜③から希望日を提出・希望に添えない場合あり）",
      "北里②（一般・共テ前期／①〜③から出願時選択・両方式併願は同日・相模原市枠は①〜②）",
      "聖マリアンナ医科②（一般・前期／①〜②から希望日を提出・大学が指定）",
      "東海②（一般・共テ・地域枠／①〜②から出願時選択）",
      "藤田医科①（一般・共テ／①〜②のいずれか1日・指定方法未公表）",
      "近畿（一般・前期）",
      "福岡（一般・共テⅠ期）",
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
      "東邦①（一般入試／①〜②のいずれか1日・指定方法未公表）",
      "藤田医科②（一般・共テ／①〜②のいずれか1日・指定方法未公表）",
    ],
  },
  {
    date: "2/16",
    weekday: "火",
    first: [],
    second: [
      "国際医療福祉①（共テ／①・②の両日受験／学力・小論文／一般選抜受験者は免除あり）",
      "順天堂③（一般A・共テ前期／①〜③の希望をもとに大学が指定）",
      "東邦②（一般入試／①〜②のいずれか1日・指定方法未公表）",
    ],
  },
  {
    date: "2/17",
    weekday: "水",
    first: [],
    second: [
      "帝京（共テ・前期）",
      "金沢医科①（一般・前期／①〜②のうち受験者が希望する1日）",
      "兵庫医科①（一般A／①〜②から受験者が選択）",
    ],
  },
  {
    date: "2/18",
    weekday: "木",
    first: [],
    second: [
      "金沢医科②（一般・前期／①〜②のうち受験者が希望する1日）",
      "兵庫医科②（一般A／①〜②から受験者が選択）",
      "愛知医科①（一般・共テ／①〜③のうち希望する1日・両方式で二次資格なら面接1回）",
    ],
  },
  {
    date: "2/19",
    weekday: "金",
    first: [],
    second: [
      "愛知医科②（一般・共テ／①〜③のうち希望する1日・両方式で二次資格なら面接1回）",
      "獨協医科①（一般・前期／①〜②のいずれか1日・指定方法未公表）",
      "大阪医科薬科（一般・前期／大阪府地域枠）",
    ],
  },
  {
    date: "2/20",
    weekday: "土",
    first: [],
    second: [
      "東北医科薬科①（一般／①〜②から大学指定）",
      "獨協医科②（一般・前期／①〜②のいずれか1日・指定方法未公表）",
      "国際医療福祉②（共テ／①・②の両日受験／面接／一般選抜受験者は免除あり）",
      "杏林（共テ／小論文・面接）",
      "東京慈恵会医科①（一般／①〜③のいずれか1日・指定方法未公表）",
      "愛知医科③（一般・共テ／①〜③のうち希望する1日・両方式で二次資格なら面接1回）",
      "関西医科①（一般・前期／①〜②から出願時に希望選択・大学指定）",
      "関西医科（地域枠・構想中／必ず地域枠面接）",
    ],
  },
  {
    date: "2/21",
    weekday: "日",
    first: [],
    second: [
      "東北医科薬科②（一般／①〜②から大学指定）",
      "東京慈恵会医科②（一般／①〜③のいずれか1日・指定方法未公表）",
      "関西医科②（一般・前期／①〜②から出願時に希望選択・大学指定）",
      "関西医科（共テ前期・共テ＋一般併用／一般前期と重複合格時は大学指定日）",
      "近畿（共テ・前期／中期）",
    ],
  },
  {
    date: "2/22",
    weekday: "月",
    first: [],
    second: ["東京慈恵会医科③（一般／①〜③のいずれか1日・指定方法未公表）"],
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
      "近畿（一般・後期）",
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
      "日大（N全学統一方式・第2期／郡山・千葉・東京・湘南）",
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
    first: ["獨協医科（一般・後期）", "久留米（一般・後期）"],
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
    second: ["近畿（一般・後期／共テ・後期）"],
  },
  {
    date: "3/12",
    weekday: "金",
    first: [],
    second: [
      "聖マリアンナ医科（一般・後期／共テ）",
      "金沢医科（一般・後期）",
      "産業医科（一般A・B・C／小論文・面接）",
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
      "久留米（一般・後期／共テB）",
    ],
  },
  {
    date: "3/17",
    weekday: "水",
    first: [],
    second: ["日大（N全学統一方式・第2期／医学部校舎）"],
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
    routes: "一般選抜",
    webDeadline: "1/7 15:00",
    documentDeadline: "1/7 17:00 必着",
    sourceUrl: "https://m.kawasaki-m.ac.jp/examination/youkou.php",
  },
  {
    date: "1/7",
    dateTime: "2027-01-07",
    university: "久留米大学",
    routes: "一般前期",
    webDeadline: "1/7（時刻未公表）",
    documentDeadline: "提出方法・期限は要項公開待ち",
    sourceUrl: "https://best.kurume-u.ac.jp/admissions/type/exam-first/",
  },
  {
    date: "1/7",
    dateTime: "2027-01-07",
    university: "久留米大学",
    routes: "共テA日程",
    webDeadline: "1/7（時刻未公表）",
    documentDeadline: "提出方法・期限は要項公開待ち",
    sourceUrl: "https://best.kurume-u.ac.jp/admissions/type/common/a/",
  },
  {
    date: "1/7",
    dateTime: "2027-01-07",
    university: "国際医療福祉大学",
    routes: "一般選抜",
    webDeadline: "1/7 23:00",
    documentDeadline: "1/7 消印有効（海外発送は必着）",
    sourceUrl: "https://narita.iuhw.ac.jp/gakubu/igakubu/admission/doc/guideline_app.pdf?ver=3",
  },
  {
    date: "1/8",
    dateTime: "2027-01-08",
    university: "岩手医科大学",
    routes: "一般選抜",
    webDeadline: "登録時刻は要項公開待ち",
    documentDeadline: "1/8 消印有効",
    sourceUrl: "https://www.imu-admission.jp/guidelines/gl_gaiyou/",
  },
  {
    date: "1/12",
    dateTime: "2027-01-12",
    university: "福岡大学",
    routes: "一般（系統別）／共テ利用型Ⅰ期",
    webDeadline: "1/12（時刻未公表）",
    documentDeadline: "提出方法・期限は要項公開待ち",
    sourceUrl: "https://nyushi.fukuoka-u.ac.jp/nyushi/type-3/",
  },
  {
    date: "1/13",
    dateTime: "2027-01-13",
    university: "帝京大学",
    routes: "一般選抜",
    webDeadline: "1/13 16:30",
    documentDeadline: "1/13 16:30 必着",
    sourceUrl: "https://www.teikyo-u.ac.jp/application/files/2417/8409/4616/02_2027.pdf",
  },
  {
    date: "1/13",
    dateTime: "2027-01-13",
    university: "東京医科大学",
    routes: "一般／共テ利用",
    webDeadline: "1/13 23:59",
    documentDeadline: "1/13 消印有効",
    sourceUrl: "https://admissions-tokyo-med.jp/wp-content/uploads/2024/12/2027bosyuyoukou_ippan.pdf",
  },
  {
    date: "1/14",
    dateTime: "2027-01-14",
    university: "国際医療福祉大学",
    routes: "共テ利用",
    webDeadline: "1/14 23:00",
    documentDeadline: "1/14 消印有効（海外発送は必着）",
    sourceUrl: "https://narita.iuhw.ac.jp/gakubu/igakubu/admission/doc/guideline_app.pdf?ver=3",
  },
  {
    date: "1/14",
    dateTime: "2027-01-14",
    university: "聖マリアンナ医科大学",
    routes: "共テ利用",
    webDeadline: "1/14（出願登録の終了時刻は記載なし）",
    documentDeadline: "1/15 必着",
    sourceUrl: "https://www.marianna-u.ac.jp/univ/ent_info/pdf/selection_guidelines_2027.pdf",
  },
  {
    date: "1/14",
    dateTime: "2027-01-14",
    university: "近畿大学",
    routes: "一般前期",
    webDeadline: "登録時刻は要項公開待ち",
    documentDeadline: "1/14 消印有効",
    sourceUrl: "https://kindai.jp/exam/system/",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "東北医科薬科大学",
    routes: "一般選抜",
    webDeadline: "1/15（時刻未公表）",
    documentDeadline: "1/17 必着",
    sourceUrl:
      "https://www.tohoku-mpu.ac.jp/wp/wp-content/uploads/2026/05/963a4d3c20d5c1e17605bf8aa1e7293c-1.pdf",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "埼玉医科大学",
    routes: "共テ利用",
    webDeadline: "1/15（終了時刻の記載なし）",
    documentDeadline: "1/16 必着",
    sourceUrl: "https://adm.saitama-med.ac.jp/wp-content/uploads/2026/07/fa58cf881ba4ac57b5c60b69b2ac25d2.pdf",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "杏林大学",
    routes: "一般／共テ利用",
    webDeadline: "1/15 17:00",
    documentDeadline: "1/15 必着",
    sourceUrl: "https://www.kyorin-u.ac.jp/univ/center/nyugaku/exam/",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "順天堂大学",
    routes: "一般A・B／共テ前期・後期／共テ・一般併用",
    webDeadline: "1/15（時刻未公表）",
    documentDeadline: "1/15 必着",
    sourceUrl: "https://www.juntendo.ac.jp/assets/2027_Juntendo_Med_NyugakuShikenYoukou.pdf",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "帝京大学",
    routes: "共テ利用 前期",
    webDeadline: "1/15 16:30",
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
    sourceUrl: "https://www.u-tokai.ac.jp/examination-admissions/examination-system/undergraduate-academic-medicine/",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "金沢医科大学",
    routes: "一般前期",
    webDeadline: "1/15 15:00",
    documentDeadline: "1/15 消印有効",
    sourceUrl: "https://www.kanazawa-med.ac.jp/medicine_exam/assets/m_admissionguide.pdf.pdf",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "愛知医科大学",
    routes: "共テ利用",
    webDeadline: "1/15（時刻未公表）",
    documentDeadline: "提出方法・期限は要項公開待ち",
    sourceUrl: "https://www.aichi-med-u.ac.jp/files/igaku/nyuusigaido2027.pdf",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "藤田医科大学",
    routes: "共通テスト利用入試",
    webDeadline: "1/15（時刻未公表）",
    documentDeadline: "1/18 必着",
    sourceUrl: "https://www.fujita-hu.ac.jp/admission/exam-med/schedule.html",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "大阪医科薬科大学",
    routes: "大学入学共通テスト利用選抜",
    webDeadline: "登録時刻は要項公開待ち",
    documentDeadline: "1/15 消印有効",
    sourceUrl: "https://www.ompu.ac.jp/admission/undergraduate/medical/afif3u000000fsz9-att/afif3u000000ft1c.pdf",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "関西医科大学",
    routes: "一般前期／地域枠（構想中）／共テ前期／共テ・一般併用",
    webDeadline: "1/15 23:59",
    documentDeadline: "1/16 消印有効",
    sourceUrl: "https://www.kmu.ac.jp/juk/fom/information/m3v58f00000036sx-att/R09_admission-requirements.pdf",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "近畿大学",
    routes: "共テ利用 前期",
    webDeadline: "登録時刻は要項公開待ち",
    documentDeadline: "1/15 消印有効",
    sourceUrl: "https://kindai.jp/exam/system/",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "産業医科大学",
    routes: "一般A方式",
    webDeadline: "登録時刻は要項公開待ち",
    documentDeadline: "1/15 消印有効",
    sourceUrl: "https://www.uoeh-u.ac.jp/library/nyusi/R9_jissiyoko.pdf",
  },
  {
    date: "1/15",
    dateTime: "2027-01-15",
    university: "北里大学",
    routes: "共テ利用 前期・後期",
    webDeadline: "1/15（終了時刻は学生募集要項公開待ち）",
    documentDeadline: "1/15 消印有効（国外発送は必着）",
    sourceUrl:
      "https://www.kitasato-u.ac.jp/jp/goukaku/albums/abm.php?f=abm00048868.pdf",
  },
  {
    date: "1/16",
    dateTime: "2027-01-16",
    university: "東海大学",
    routes: "一般選抜",
    webDeadline: "1/16 23:59",
    documentDeadline: "1/19 必着",
    sourceUrl: "https://www.u-tokai.ac.jp/examination-admissions/examination-system/undergraduate-academic-medicine/",
  },
  {
    date: "1/18",
    dateTime: "2027-01-18",
    university: "慶應義塾大学",
    routes: "一般選抜",
    webDeadline: "1/18 17:00",
    documentDeadline: "1/18 消印有効",
    sourceUrl: "https://www.keio.ac.jp/ja/admissions/faculty/examinations/general-admissions/",
  },
  {
    date: "1/18",
    dateTime: "2027-01-18",
    university: "東京女子医科大学",
    routes: "一般選抜（地域枠含む）",
    webDeadline: "1/18 23:00",
    documentDeadline: "1/20 必着（簡易書留）",
    sourceUrl: "https://www.twmu-u.jp/wp-content/uploads/2026/07/c9586e74cb77a02ee36ecf565fb6264f.pdf",
  },
  {
    date: "1/19",
    dateTime: "2027-01-19",
    university: "北里大学",
    routes: "一般選抜",
    webDeadline: "1/19（終了時刻は学生募集要項公開待ち）",
    documentDeadline: "1/19 消印有効（国外発送は必着）",
    sourceUrl:
      "https://www.kitasato-u.ac.jp/jp/goukaku/albums/abm.php?f=abm00048868.pdf",
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
    documentDeadline: "1/21 必着",
    sourceUrl: "https://adm.saitama-med.ac.jp/wp-content/uploads/2026/07/fa58cf881ba4ac57b5c60b69b2ac25d2.pdf",
  },
  {
    date: "1/20",
    dateTime: "2027-01-20",
    university: "聖マリアンナ医科大学",
    routes: "一般前期",
    webDeadline: "1/20（出願登録の終了時刻は記載なし）",
    documentDeadline: "1/21 必着",
    sourceUrl: "https://www.marianna-u.ac.jp/univ/ent_info/pdf/selection_guidelines_2027.pdf",
  },
  {
    date: "1/20",
    dateTime: "2027-01-20",
    university: "大阪医科薬科大学",
    routes: "一般前期（大阪府地域枠含む）",
    webDeadline: "登録時刻は要項公開待ち",
    documentDeadline: "1/20 消印有効",
    sourceUrl: "https://www.ompu.ac.jp/admission/undergraduate/medical/afif3u000000fsz9-att/afif3u000000ft1c.pdf",
  },
  {
    date: "1/20",
    dateTime: "2027-01-20",
    university: "兵庫医科大学",
    routes: "一般A・B",
    webDeadline: "1/20 15:00",
    documentDeadline: "1/20 消印有効",
    sourceUrl: "https://www.hyo-med.ac.jp/files/20260703/c737f86c1b3de8f37133c3de2c8031853ac51fff.pdf",
  },
  {
    date: "1/21",
    dateTime: "2027-01-21",
    university: "昭和医科大学",
    routes: "一般Ⅰ期",
    webDeadline: "1/21（時刻未公表）",
    documentDeadline: "1/21 必着",
    sourceUrl: "https://adm.showa-u.ac.jp/albums/abm.php?d=2405&f=abm00072419.pdf",
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
    webDeadline: "1/22（時刻未公表）",
    documentDeadline: "1/24 必着",
    sourceUrl:
      "https://www.tohoku-mpu.ac.jp/wp/wp-content/uploads/2026/05/963a4d3c20d5c1e17605bf8aa1e7293c-1.pdf",
  },
  {
    date: "1/22",
    dateTime: "2027-01-22",
    university: "日本大学",
    routes: "一般選抜 N全学統一方式 第1期",
    webDeadline: "1/22（終了時刻は募集要項公開待ち）",
    documentDeadline: "1/22 必着（簡易書留）",
    sourceUrl: "https://www.nihon-u.ac.jp/admission_info/application/general_information/general/n_system/",
  },
  {
    date: "1/22",
    dateTime: "2027-01-22",
    university: "愛知医科大学",
    routes: "一般選抜",
    webDeadline: "1/22（時刻未公表）",
    documentDeadline: "提出方法・期限は要項公開待ち",
    sourceUrl: "https://www.aichi-med-u.ac.jp/files/igaku/nyuusigaido2027.pdf",
  },
  {
    date: "1/22",
    dateTime: "2027-01-22",
    university: "藤田医科大学",
    routes: "一般入試（愛知県地域枠含む）",
    webDeadline: "1/22（時刻未公表）",
    documentDeadline: "1/25 必着",
    sourceUrl: "https://www.fujita-hu.ac.jp/admission/exam-med/schedule.html",
  },
  {
    date: "1/25",
    dateTime: "2027-01-25",
    university: "東京慈恵会医科大学",
    routes: "一般選抜",
    webDeadline: "1/25（時刻未公表）",
    documentDeadline: "1/25 消印有効",
    sourceUrl: "https://www.jikei.ac.jp/university/medicine/admission/summary/",
  },
  {
    date: "1/25",
    dateTime: "2027-01-25",
    university: "産業医科大学",
    routes: "一般B方式",
    webDeadline: "登録時刻は要項公開待ち",
    documentDeadline: "1/25 消印有効",
    sourceUrl: "https://www.uoeh-u.ac.jp/library/nyusi/R9_jissiyoko.pdf",
  },
  {
    date: "1/26",
    dateTime: "2027-01-26",
    university: "東邦大学",
    routes: "一般入試",
    webDeadline: "終了日時は要項公開待ち",
    documentDeadline: "1/26 必着（窓口1/25・26 9:00〜17:00）",
    sourceUrl: "https://www.toho-u.ac.jp/med/info_exam/ippan.html",
  },
  {
    date: "2/1",
    dateTime: "2027-02-01",
    university: "獨協医科大学",
    routes: "一般前期（栃木・新潟地域枠を含む）",
    webDeadline: "登録方法・時刻は要項公開待ち",
    documentDeadline: "提出方法・期限は要項公開待ち",
    sourceUrl: "https://www.dokkyomed.ac.jp/dusm/exam/entrance/",
  },
  {
    date: "2/1",
    dateTime: "2027-02-01",
    university: "近畿大学",
    routes: "共テ利用 中期",
    webDeadline: "登録時刻は要項公開待ち",
    documentDeadline: "2/1 消印有効",
    sourceUrl: "https://kindai.jp/exam/system/",
  },
  {
    date: "2/15",
    dateTime: "2027-02-15",
    university: "東邦大学",
    routes: "統一入試",
    webDeadline: "終了日時は要項公開待ち",
    documentDeadline: "2/15 必着",
    sourceUrl: "https://www.toho-u.ac.jp/med/info_exam/touitsu.html",
  },
  {
    date: "2/15",
    dateTime: "2027-02-15",
    university: "近畿大学",
    routes: "一般後期",
    webDeadline: "登録時刻は要項公開待ち",
    documentDeadline: "2/15 消印有効",
    sourceUrl: "https://kindai.jp/exam/system/",
  },
  {
    date: "2/17",
    dateTime: "2027-02-17",
    university: "埼玉医科大学",
    routes: "一般後期",
    webDeadline: "2/17（終了時刻の記載なし）",
    documentDeadline: "2/18 必着",
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
    webDeadline: "2/19 23:59",
    documentDeadline: "2/20 消印有効",
    sourceUrl: "https://www.kmu.ac.jp/juk/fom/information/m3v58f00000036sx-att/R09_admission-requirements.pdf",
  },
  {
    date: "2/20",
    dateTime: "2027-02-20",
    university: "聖マリアンナ医科大学",
    routes: "一般後期",
    webDeadline: "2/20（出願登録の終了時刻は記載なし）",
    documentDeadline: "2/22 必着",
    sourceUrl: "https://www.marianna-u.ac.jp/univ/ent_info/pdf/selection_guidelines_2027.pdf",
  },
  {
    date: "2/21",
    dateTime: "2027-02-21",
    university: "産業医科大学",
    routes: "一般C方式",
    webDeadline: "登録時刻は要項公開待ち",
    documentDeadline: "2/21 消印有効",
    sourceUrl: "https://www.uoeh-u.ac.jp/library/nyusi/R9_jissiyoko.pdf",
  },
  {
    date: "2/23",
    dateTime: "2027-02-23",
    university: "昭和医科大学",
    routes: "一般Ⅱ期",
    webDeadline: "2/23（時刻未公表）",
    documentDeadline: "2/23 必着",
    sourceUrl: "https://adm.showa-u.ac.jp/albums/abm.php?d=2405&f=abm00072419.pdf",
  },
  {
    date: "2/24",
    dateTime: "2027-02-24",
    university: "金沢医科大学",
    routes: "一般後期",
    webDeadline: "2/24 15:00",
    documentDeadline: "2/24 消印有効",
    sourceUrl: "https://www.kanazawa-med.ac.jp/medicine_exam/assets/m_admissionguide.pdf.pdf",
  },
  {
    date: "2/25",
    dateTime: "2027-02-25",
    university: "日本大学",
    routes: "一般選抜 N全学統一方式 第2期",
    webDeadline: "2/25（終了時刻は募集要項公開待ち）",
    documentDeadline: "2/25 必着（簡易書留）",
    sourceUrl: "https://www.nihon-u.ac.jp/admission_info/application/general_information/general/n_system/",
  },
  {
    date: "2/25",
    dateTime: "2027-02-25",
    university: "久留米大学",
    routes: "一般後期",
    webDeadline: "2/25（時刻未公表）",
    documentDeadline: "提出方法・期限は要項公開待ち",
    sourceUrl: "https://best.kurume-u.ac.jp/admissions/type/exam-second/",
  },
  {
    date: "2/25",
    dateTime: "2027-02-25",
    university: "久留米大学",
    routes: "共テB日程",
    webDeadline: "2/25（時刻未公表）",
    documentDeadline: "提出方法・期限は要項公開待ち",
    sourceUrl: "https://best.kurume-u.ac.jp/admissions/type/common/b/",
  },
  {
    date: "2/25",
    dateTime: "2027-02-25",
    university: "近畿大学",
    routes: "共テ利用 後期",
    webDeadline: "登録時刻は要項公開待ち",
    documentDeadline: "2/25 消印有効",
    sourceUrl: "https://kindai.jp/exam/system/",
  },
  {
    date: "2/26",
    dateTime: "2027-02-26",
    university: "愛知医科大学",
    routes: "共テ利用 地域枠B",
    webDeadline: "2/26（時刻未公表）",
    documentDeadline: "提出方法・期限は要項公開待ち",
    sourceUrl: "https://www.aichi-med-u.ac.jp/files/igaku/nyuusigaido2027.pdf",
  },
  {
    date: "2/26",
    dateTime: "2027-02-26",
    university: "大阪医科薬科大学",
    routes: "一般後期",
    webDeadline: "登録時刻は要項公開待ち",
    documentDeadline: "2/26 消印有効",
    sourceUrl: "https://www.ompu.ac.jp/admission/undergraduate/medical/afif3u000000fsz9-att/afif3u000000ft1c.pdf",
  },
  {
    date: "3/1",
    dateTime: "2027-03-01",
    university: "獨協医科大学",
    routes: "一般後期",
    webDeadline: "登録方法・時刻は要項公開待ち",
    documentDeadline: "提出方法・期限は要項公開待ち",
    sourceUrl: "https://www.dokkyomed.ac.jp/dusm/exam/entrance/",
  },
];

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
    const year = Number(match[1] ?? 2027);
    const month = Number(match[2]);
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
  const firstDateIndex = parseScheduleDates(value)[0]?.index ?? value.length;
  const prefix = value.slice(0, firstDateIndex);

  if (prefix.includes("Web・書類")) return "Web・書類受付開始";
  if (prefix.includes("Web") || prefix.includes("登録")) return "Web出願開始";
  if (prefix.includes("郵送")) return "郵送受付開始";
  return "出願開始";
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
    .replace(/^[〜・（(]+|[）)]+$/g, "")
    .trim();

  if (localContext.length > 0 && localContext.length <= 30) {
    return localContext;
  }

  return value;
};

const fullScheduleEventMap2027 = new Map<
  string,
  Record<FullScheduleColumnKey2027, FullScheduleCalendarEntry2027[]>
>();

const addFullScheduleEvent2027 = (
  date: ParsedScheduleDate,
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
          detail: applicationDeadlineDetail(
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
        detail: route.result?.startsWith("二次受験資格")
          ? "二次受験資格発表"
          : "一次合格発表",
      });
    });
    finalResultDates.forEach((date) => {
      addFullScheduleEvent2027(date, "finalResult", {
        ...entryBase,
        detail: "最終合格発表",
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

      addFullScheduleEvent2027(date, "procedureDeadline", {
        ...entryBase,
        detail:
          route.procedureDateDetails?.[procedureDateIndex] ??
          procedureDateDetail(route.procedure, procedureDates, procedureDateIndex),
      });
    });
    if (procedureDates.length === 0) pendingFields.push("procedureDeadline");

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
    year: 2027,
    month: 3,
    day: 3,
    raw: "3/3",
    index: 0,
    endIndex: 3,
  },
  "secondExam",
  {
    university: "大阪医科薬科大学",
    route: "一般選抜 前期・大阪府地域枠（繰り上げ合格候補対象者）",
    category: "general",
    detail: "繰り上げ合格候補対象者のみ",
    status: "preliminary",
    sourceUrl:
      "https://www.ompu.ac.jp/admission/undergraduate/qt931k000000801q-att/afif3u000000fsvj.pdf",
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
