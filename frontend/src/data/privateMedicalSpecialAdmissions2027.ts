export type SpecialAdmissionPublicationStatus =
  | "complete"
  | "partial"
  | "outline"
  | "unpublished"
  | "previous-year-only"
  | "not-offered";

export type SpecialAdmissionScopeStatus = "available" | "unpublished" | "not-offered";

export type SpecialAdmissionCategory =
  | "comprehensive"
  | "recommendation"
  | "designated"
  | "regional"
  | "returnee"
  | "ib"
  | "international"
  | "special";

export type SpecialAdmissionEventStage =
  | "application-start"
  | "application-deadline"
  | "first-exam"
  | "first-result"
  | "second-exam"
  | "final-result"
  | "procedure-deadline";

export type SpecialAdmissionEvent = {
  stage: SpecialAdmissionEventStage;
  date: string;
  label: string;
  time?: string;
  deadlineRule?: "必着" | "消印有効" | "Web登録" | "大学指定";
  sequence?: number;
  choiceRule?: string;
};

export type CurrentStudentEligibility = true | "conditional" | "unconfirmed";

export type SpecialAdmissionRoute = {
  id: string;
  officialName: string;
  category: SpecialAdmissionCategory;
  quota: string | null;
  publicationStatus: SpecialAdmissionPublicationStatus;
  currentStudentEligible: CurrentStudentEligibility;
  eligibility: string;
  exclusive: "専願" | "併願可" | "条件付き" | "未公表";
  principalRecommendation: "必要" | "不要" | "方式による" | "未公表";
  gradeRequirement: string;
  restrictions: string[];
  events: SpecialAdmissionEvent[];
  sourceUrls: string[];
  note?: string;
};

export type PrivateMedicalSpecialAdmissionsUniversity2027 = {
  id: string;
  name: string;
  region: "北海道・東北" | "関東" | "中部" | "近畿" | "中国・四国" | "九州";
  prefecture: string;
  strategyPath: string;
  scopeStatus: SpecialAdmissionScopeStatus;
  publicationStatus: SpecialAdmissionPublicationStatus;
  statusNote: string;
  officialUrl: string;
  routes: SpecialAdmissionRoute[];
  excludedRoutes?: string[];
};

const event = (
  stage: SpecialAdmissionEventStage,
  date: string,
  label: string,
  options: Omit<SpecialAdmissionEvent, "stage" | "date" | "label"> = {},
): SpecialAdmissionEvent => ({ stage, date, label, ...options });

const route = (input: SpecialAdmissionRoute): SpecialAdmissionRoute => input;

const university = (
  input: PrivateMedicalSpecialAdmissionsUniversity2027,
): PrivateMedicalSpecialAdmissionsUniversity2027 => input;

const saitamaSchedule: SpecialAdmissionEvent[] = [
  event("application-start", "2026-11-05", "Web出願開始", { time: "9:00" }),
  event("application-deadline", "2026-11-12", "Web出願締切"),
  event("application-deadline", "2026-11-13", "出願書類締切", { deadlineRule: "必着" }),
  event("first-exam", "2026-11-22", "試験（適性検査・小論文・面接）", { time: "9:00～17:00頃" }),
  event("final-result", "2026-12-01", "合格発表", { time: "16:00" }),
  event("procedure-deadline", "2026-12-11", "入学手続締切"),
];

const saitamaOfficialGuideUrl =
  "https://adm.saitama-med.ac.jp/wp-content/uploads/2026/07/fa58cf881ba4ac57b5c60b69b2ac25d2.pdf";
const saitamaAdmissionsOverviewUrl = "https://adm.saitama-med.ac.jp/admission/examination/";
const saitamaRecommendationUrl = "https://adm.saitama-med.ac.jp/admission/recommendation/";
const saitamaFaqUrl = "https://adm.saitama-med.ac.jp/faq/";
const saitamaScholarshipUrl = "https://adm.saitama-med.ac.jp/payment/";

const iuhwInternationalFirstSchedule: SpecialAdmissionEvent[] = [
  event("application-deadline", "2026-08-04", "出願資格確認締切", { deadlineRule: "必着" }),
  event("application-start", "2026-08-12", "Web出願開始", { time: "9:00" }),
  event("application-deadline", "2026-08-20", "Web出願登録締切", { time: "23:00", deadlineRule: "Web登録" }),
  event("application-deadline", "2026-08-20", "入学検定料納入締切", { time: "23:59" }),
  event("application-deadline", "2026-08-20", "出願書類締切", { deadlineRule: "必着" }),
  event("first-exam", "2026-09-01", "一次選考（学力試験・小論文）"),
  event("first-result", "2026-09-07", "一次合格発表", { time: "15:00" }),
  event("second-exam", "2026-09-12", "二次選考（面接試験）"),
  event("final-result", "2026-09-24", "最終合格発表", { time: "15:00" }),
  event("procedure-deadline", "2026-09-30", "入学手続締切", { deadlineRule: "消印有効" }),
];

const iuhwInternationalSecondSchedule: SpecialAdmissionEvent[] = [
  event("application-deadline", "2026-10-22", "出願資格確認締切", { deadlineRule: "必着" }),
  event("application-start", "2026-11-02", "Web出願開始", { time: "9:00" }),
  event("application-deadline", "2026-11-09", "Web出願登録締切", { time: "23:00", deadlineRule: "Web登録" }),
  event("application-deadline", "2026-11-09", "入学検定料納入締切", { time: "23:59" }),
  event("application-deadline", "2026-11-09", "出願書類締切", { deadlineRule: "必着" }),
  event("first-exam", "2026-11-21", "一次選考（学力試験・小論文）"),
  event("first-result", "2026-11-30", "一次合格発表", { time: "15:00" }),
  event("second-exam", "2026-12-05", "二次選考（面接試験）"),
  event("final-result", "2026-12-14", "最終合格発表", { time: "15:00" }),
  event("procedure-deadline", "2026-12-21", "入学手続締切", { deadlineRule: "消印有効" }),
];

const iuhwAdmissionsDownloadUrl = "https://narita.iuhw.ac.jp/gakubu/igakubu/admission/download.html";
const iuhwSpecialAdmissionsUrl = "https://narita.iuhw.ac.jp/gakubu/igakubu/admission/special.html";
const iuhwSpecialGuideUrl = "https://narita.iuhw.ac.jp/gakubu/igakubu/admission/doc/guideline_app.pdf?ver=3";
const iuhwComprehensiveUrl = "https://narita.iuhw.ac.jp/gakubu/igakubu/admission/sogo.html";
const iuhwComprehensiveGuideUrl =
  "https://narita.iuhw.ac.jp/gakubu/igakubu/admission/doc/guideline_app_sogo.pdf";

const iuhwSpecialSources = [iuhwSpecialGuideUrl, iuhwSpecialAdmissionsUrl, iuhwAdmissionsDownloadUrl];
const iuhwComprehensiveSources = [
  iuhwComprehensiveGuideUrl,
  iuhwSpecialGuideUrl,
  iuhwComprehensiveUrl,
  iuhwAdmissionsDownloadUrl,
];

const tokyoMedicalRecommendationGuideUrl =
  "https://admissions-tokyo-med.jp/wp-content/uploads/2024/12/2027bosyuyoukou_suisen.pdf";
const tokyoMedicalRegionalGuideUrl =
  "https://admissions-tokyo-med.jp/wp-content/uploads/2024/12/2027bosyuyoukou_chiikiwaku.pdf";
const tokyoMedicalAdmissionsOverviewUrl = "https://admissions-tokyo-med.jp/med/exam/";
const tokyoMedicalAdmissionsDownloadUrl = "https://admissions-tokyo-med.jp/med/youkou-dl/";

const tokyoMedicalStandardSchedule: SpecialAdmissionEvent[] = [
  event("application-start", "2026-11-02", "Web出願開始", { time: "0:00" }),
  event("application-deadline", "2026-11-13", "Web出願登録締切", {
    time: "23:59",
    deadlineRule: "Web登録",
  }),
  event("application-deadline", "2026-11-13", "入学検定料納入締切", { time: "23:59" }),
  event("application-deadline", "2026-11-13", "出願書類郵送締切", {
    deadlineRule: "消印有効",
  }),
  event("first-exam", "2026-11-28", "試験（日本語・英語小論文・基礎学力検査・個人面接）", {
    time: "8:20集合、18:00頃終了予定",
  }),
  event("final-result", "2026-12-03", "合格発表", { time: "10:00" }),
  event("procedure-deadline", "2026-12-10", "入学手続締切", { time: "12:00" }),
];

const tokyoMedicalEnglishSchedule: SpecialAdmissionEvent[] = [
  ...tokyoMedicalStandardSchedule.slice(0, 4),
  event("first-exam", "2026-11-28", "試験（日本語小論文・基礎学力検査・個人面接）", {
    time: "8:20集合、18:00頃終了予定",
  }),
  ...tokyoMedicalStandardSchedule.slice(5),
];

const tokyoMedicalNationalBlockSchedule: SpecialAdmissionEvent[] = [
  ...tokyoMedicalStandardSchedule.slice(0, 4),
  event("first-exam", "2026-11-28", "基礎学力検査（日本語・英語小論文・基礎学力検査）", {
    time: "8:20集合、12:40終了",
    sequence: 1,
  }),
  event("first-result", "2026-12-03", "基礎学力検査合格発表", { time: "10:00" }),
  event("second-exam", "2026-12-12", "面接（MMI）", {
    sequence: 2,
    choiceRule: "基礎学力検査合格者のみ。実施時刻は合格発表時に通知",
  }),
  event("final-result", "2026-12-17", "最終合格発表", { time: "10:00" }),
  event("procedure-deadline", "2026-12-24", "入学手続締切", { time: "12:00" }),
];

const tokyoMedicalRecommendationSources = [
  tokyoMedicalRecommendationGuideUrl,
  tokyoMedicalAdmissionsOverviewUrl,
  tokyoMedicalAdmissionsDownloadUrl,
];
const tokyoMedicalRegionalSources = [
  tokyoMedicalRegionalGuideUrl,
  tokyoMedicalAdmissionsOverviewUrl,
  tokyoMedicalAdmissionsDownloadUrl,
];

const iwateSpecialSchedule: SpecialAdmissionEvent[] = [
  event("application-start", "2026-11-02", "出願開始"),
  event("application-deadline", "2026-11-11", "出願締切", { deadlineRule: "消印有効" }),
  event("first-exam", "2026-11-21", "試験日"),
  event("final-result", "2026-12-02", "合格発表"),
  event("procedure-deadline", "2026-12-11", "入学手続締切"),
];

const iwateOfficialSources = [
  "https://www.imu-admission.jp/guidelines/gl_med/",
  "https://www.imu-admission.jp/guidelines/gl_gaiyou/",
];

const iwateSelectionNote =
  "選考は英語・数学、理科2科目、個人面接・課題型面接を同日に実施します。";

const kitasatoAdmissionsOverviewUrl =
  "https://www.kitasato-u.ac.jp/jp/goukaku/undergraduate_ad/system/search.html";
const kitasatoGuideUrl =
  "https://www.kitasato-u.ac.jp/jp/goukaku/albums/abm.php?f=abm00048841.pdf&n=%E5%85%A5%E8%A9%A6%E3%82%AC%E3%82%A4%E3%83%89_%E8%A1%A8%E7%B4%99%EF%BD%9E%E8%A9%A6%E9%A8%93%E6%95%99%E7%A7%91%E4%B8%80%E8%A6%A7.pdf";
const kitasatoQuotaUrl =
  "https://www.kitasato-u.ac.jp/jp/goukaku/albums/abm.php?f=abm00048736.pdf&n=2027%E5%B9%B4%E5%BA%A6%E5%85%A5%E5%AD%A6%E8%A9%A6%E9%A8%93%E5%88%B6%E5%BA%A6%E5%8F%8A%E3%81%B3%E5%8B%9F%E9%9B%86%E4%BA%BA%E5%93%A1%EF%BC%88%E5%AD%A6%E9%83%A8%EF%BC%89.pdf";
const kitasatoScheduleUrl =
  "https://www.kitasato-u.ac.jp/jp/goukaku/albums/abm.php?f=abm00048817.pdf&n=2027%E5%B9%B4%E5%BA%A6%E5%90%84%E5%AD%A6%E9%83%A8%E5%85%A5%E5%AD%A6%E8%A9%A6%E9%A8%93%E6%97%A5%E7%A8%8B%E4%B8%80%E8%A6%A7%EF%BC%88%E5%AD%A6%E9%83%A8%EF%BC%89.pdf";
const kitasatoApplicationUrl =
  "https://www.kitasato-u.ac.jp/jp/goukaku/undergraduate_ad/application/application.html";
const kitasatoAdmissionPolicyUrl =
  "https://www.kitasato-u.ac.jp/jp/goukaku/undergraduate_ad/flow/admission-policy.html";
const kitasatoRegionalProgramUrl = "https://www.kitasato-u.ac.jp/med/admission/index_1.html";
const kitasatoRecommendationSources = [
  kitasatoAdmissionsOverviewUrl,
  kitasatoGuideUrl,
  kitasatoScheduleUrl,
  kitasatoQuotaUrl,
  kitasatoApplicationUrl,
  kitasatoAdmissionPolicyUrl,
];

const mariannaGuideUrl =
  "https://www.marianna-u.ac.jp/univ/ent_info/pdf/selection_guidelines_2027.pdf";
const mariannaRecommendationUrl = "https://www.marianna-u.ac.jp/univ/ent_info/ent_exam.html";
const mariannaAdmissionsOverviewUrl =
  "https://www.marianna-u.ac.jp/univ/ent_info/ent_outline.html";
const mariannaWebGuideUrl =
  "https://www.marianna-u.ac.jp/univ/ent_info/pdf/web_entry_guide_2027.pdf";
const mariannaRegionalProgramUrl =
  "https://www.marianna-u.ac.jp/univ/ent_info/pdf/ent_exam_04_2026.pdf";
const mariannaRecommendationSources = [
  mariannaGuideUrl,
  mariannaRecommendationUrl,
  mariannaAdmissionsOverviewUrl,
  mariannaWebGuideUrl,
];
const mariannaRecommendationSchedule: SpecialAdmissionEvent[] = [
  event("application-deadline", "2026-10-02", "出願資格個別審査相談・書類送付期限", {
    deadlineRule: "大学指定",
    choiceRule: "外国12年課程・認定教育施設等の該当者のみ",
  }),
  event("application-start", "2026-11-02", "Web出願開始"),
  event("application-deadline", "2026-11-05", "Web出願登録締切", {
    deadlineRule: "Web登録",
  }),
  event("application-deadline", "2026-11-05", "入学検定料支払締切", { time: "23:59" }),
  event("application-deadline", "2026-11-06", "出願書類郵送締切", {
    deadlineRule: "必着",
  }),
  event("first-exam", "2026-11-14", "試験（基礎学力試験・小論文・個人面接）", {
    time: "8:30集合",
  }),
  event("final-result", "2026-12-01", "合格発表", { time: "10:00" }),
  event("procedure-deadline", "2026-12-08", "入学手続締切", {
    time: "17:00",
    deadlineRule: "必着",
  }),
];

const tohoAdmissionsOverviewUrl = "https://www.toho-u.ac.jp/med/info_exam/sum.html";
const tohoAdmissionsChangesUrl =
  "https://www.toho-u.ac.jp/info_exam/toho_nyushi2027_web_apply.html";
const tohoAdmissionsGuideStatusUrl = "https://www.toho-u.ac.jp/info_exam/web_apply.html";
const tohoPublishedSchedule: SpecialAdmissionEvent[] = [
  event("application-start", "2026-11-02", "Web出願登録・郵送受付開始", {
    time: "10:00（Web出願）",
  }),
  event("application-deadline", "2026-11-11", "郵送受付締切", { deadlineRule: "必着" }),
  event("application-deadline", "2026-11-11", "窓口受付（当日のみ）", {
    time: "9:00～17:00",
    deadlineRule: "大学指定",
  }),
  event("first-exam", "2026-11-20", "第1次試験", { sequence: 1 }),
  event("first-result", "2026-11-27", "第1次試験合格発表", { time: "12:00" }),
  event("second-exam", "2026-12-05", "第2次試験", {
    choiceRule: "第1次試験合格者のみ",
    sequence: 2,
  }),
  event("final-result", "2026-12-09", "最終合格発表", { time: "12:00" }),
  event("procedure-deadline", "2026-12-15", "入学手続期限"),
];

const tohoPublishedSources = [
  tohoAdmissionsOverviewUrl,
  tohoAdmissionsChangesUrl,
  tohoAdmissionsGuideStatusUrl,
];

const kanazawaMedicalGuideUrl =
  "https://www.kanazawa-med.ac.jp/medicine_exam/assets/m_admissionguide.pdf.pdf";
const kanazawaMedicalOverviewNewsUrl =
  "https://www.kanazawa-med.ac.jp/medicine_exam/news/001268.html";
const kanazawaMedicalDownloadUrl =
  "https://www.kanazawa-med.ac.jp/medicine_exam/application/download.html";
const kanazawaMedicalScheduleUrl =
  "https://www.kanazawa-med.ac.jp/medicine_exam/summary/post-3.html";
const kanazawaMedicalChangesUrl =
  "https://www.kanazawa-med.ac.jp/medicine_exam/summary/post-4.html";
const kanazawaMedicalSubjectsUrl =
  "https://www.kanazawa-med.ac.jp/medicine_exam/summary/post-5.html";
const kanazawaMedicalQaUrl =
  "https://www.kanazawa-med.ac.jp/medicine_exam/qa/qa.html";
const kanazawaMedicalDesignatedRegionUrl =
  "https://www.kanazawa-med.ac.jp/medicine_exam/guidelines/siteitiki.html";
const kanazawaMedicalPublishedSources = [
  kanazawaMedicalGuideUrl,
  kanazawaMedicalOverviewNewsUrl,
  kanazawaMedicalDownloadUrl,
  kanazawaMedicalScheduleUrl,
  kanazawaMedicalChangesUrl,
  kanazawaMedicalSubjectsUrl,
  kanazawaMedicalQaUrl,
];
const kanazawaMedicalSchedule: SpecialAdmissionEvent[] = [
  event("application-start", "2026-11-09", "Web出願開始", { time: "9:00" }),
  event("application-deadline", "2026-11-14", "Web出願締切", { time: "15:00" }),
  event("application-deadline", "2026-11-14", "出願書類提出締切", {
    deadlineRule: "消印有効",
  }),
  event("first-exam", "2026-11-21", "第1次選抜（基礎学力テスト・自己推薦書）", {
    time: "9:30～12:40",
    sequence: 1,
  }),
  event("first-result", "2026-11-26", "第1次選抜合格発表", { time: "17:30" }),
  event("second-exam", "2026-12-06", "第2次選抜（個人面接・約15分）", {
    sequence: 2,
  }),
  event("final-result", "2026-12-10", "最終合格発表", { time: "17:30" }),
  event("procedure-deadline", "2026-12-17", "入学手続締切", { time: "15:00" }),
];

export const privateMedicalSpecialAdmissionsUniversities2027: PrivateMedicalSpecialAdmissionsUniversity2027[] = [
  university({
    id: "iwate-medical",
    name: "岩手医科大学",
    region: "北海道・東北",
    prefecture: "岩手県",
    strategyPath: "/iwateika-university-entrance-exam-measures2027/",
    scopeStatus: "available",
    publicationStatus: "outline",
    statusNote: "2027年度公式概要・医学部ページで対象5方式と日程・資格を確認。地域枠A・Bの募集人員は認可後の予定で、完成版要項は9月末までに公開予定です。",
    officialUrl: "https://www.imu-admission.jp/guidelines/gl_med/",
    routes: [
      route({
        id: "comprehensive-regional-doctor",
        officialName: "総合型選抜（地域医療医師育成特別枠）",
        category: "comprehensive",
        quota: "15名以内",
        publicationStatus: "outline",
        currentStudentEligible: true,
        eligibility: "高校・中等教育学校を2025年3月以降に卒業した者、または2027年3月卒業見込みで、評定・推薦・勤務要件を満たす者",
        exclusive: "専願",
        principalRecommendation: "不要",
        gradeRequirement: "学習成績の状況3.8以上",
        restrictions: [
          "圭陵会正会員（本学職員および志願者の2親等以内を除く）の推薦",
          "卒業後、本学附属病院・関連病院に通算7年以上勤務（本学附属病院での臨床研修2年を含む）",
        ],
        events: [...iwateSpecialSchedule],
        sourceUrls: [...iwateOfficialSources],
        note: iwateSelectionNote + " 学校長推薦は不要ですが、自己推薦書を提出します。",
      }),
      route({
        id: "recommendation-public",
        officialName: "学校推薦型選抜（公募制）",
        category: "recommendation",
        quota: "12名程度",
        publicationStatus: "outline",
        currentStudentEligible: true,
        eligibility: "高校・中等教育学校等を2026年3月に卒業した者、または2027年3月卒業見込みで、学校長推薦を受ける者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "学習成績の状況4.0以上",
        restrictions: ["学校長が推薦できるのは1校2名以内"],
        events: [...iwateSpecialSchedule],
        sourceUrls: [...iwateOfficialSources],
        note: iwateSelectionNote,
      }),
      route({
        id: "regional-a",
        officialName: "学校推薦型選抜地域枠A（岩手県出身者枠）",
        category: "regional",
        quota: "15名",
        publicationStatus: "outline",
        currentStudentEligible: true,
        eligibility: "岩手県医師修学資金の貸与候補生で、2026年3月卒業または2027年3月卒業見込み、出身校・居住地等の要件を満たす者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "学習成績の状況4.3以上",
        restrictions: [
          "岩手県内校、または本人・保護者等が2023年12月1日以前から岩手県内に在住する県外校の卒業者・卒業見込み者",
          "岩手県医師修学資金を6年間受給し、卒後は臨床研修2年を含む11年間、県内公的病院等に勤務",
        ],
        events: [...iwateSpecialSchedule],
        sourceUrls: [...iwateOfficialSources],
        note: iwateSelectionNote + " 面接では岩手県による面接も行います。",
      }),
      route({
        id: "regional-b",
        officialName: "学校推薦型選抜地域枠B（東北出身者枠）",
        category: "regional",
        quota: "8名（岩手県4名を含む）",
        publicationStatus: "outline",
        currentStudentEligible: true,
        eligibility: "医療局医師奨学資金の貸与候補生で、2026年3月卒業または2027年3月卒業見込み、出身校・居住地等の要件を満たす者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "学習成績の状況4.0以上",
        restrictions: [
          "岩手県内校、岩手県在住要件を満たす県外校、または青森・秋田・宮城・山形・福島県内校",
          "医療局医師奨学資金を卒業月まで受給し、卒後は臨床研修2年を含む9年間、岩手県立病院等に勤務",
        ],
        events: [...iwateSpecialSchedule],
        sourceUrls: [...iwateOfficialSources],
        note: iwateSelectionNote + " 面接では岩手県による面接も行います。",
      }),
      route({
        id: "akita-regional",
        officialName: "学校推薦型選抜秋田県地域枠（秋田県出身者枠）",
        category: "regional",
        quota: "2名",
        publicationStatus: "outline",
        currentStudentEligible: true,
        eligibility: "秋田県内高校を2026年3月に卒業した者、または2027年3月卒業見込みで、学校長推薦・評定・勤務要件を満たす者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "学習成績の状況4.0以上",
        restrictions: [
          "秋田県内高校出身者",
          "秋田県医師修学資金を6年間受給し、卒後9年間勤務（臨床研修2年を含み、うち4年間は指定医師不足地域の公的医療機関等）",
        ],
        events: [...iwateSpecialSchedule],
        sourceUrls: [...iwateOfficialSources],
        note: iwateSelectionNote + " 面接では秋田県による面接も行います。",
      }),
    ],
    excludedRoutes: ["一般選抜地域枠C・D、学士編入学者選抜（現役高校生は出願不可）を除外"],
  }),
  university({
    id: "tohoku-med-pharm",
    name: "東北医科薬科大学",
    region: "北海道・東北",
    prefecture: "宮城県",
    strategyPath: "/touhokuikayakka-university-entrance-exam-measures2027/",
    scopeStatus: "available",
    publicationStatus: "outline",
    statusNote: "2027年度公式概要と5月14日改訂の入学者選抜ガイドで総合型選抜（東北地域定着枠）を確認。完成版募集要項は9月頃公開予定です。",
    officialUrl: "https://www.tohoku-mpu.ac.jp/admission/medicine-application/",
    routes: [route({
      id: "comprehensive-tohoku-retention",
      officialName: "総合型選抜（東北地域定着枠）",
      category: "comprehensive",
      quota: "20名",
      publicationStatus: "outline",
      currentStudentEligible: true,
      eligibility: "高校・中等教育学校・高等専門学校・専修学校高等課程を2027年3月卒業見込み、または2022年3月以降に卒業し、入学までに18歳に達する者",
      exclusive: "専願",
      principalRecommendation: "未公表",
      gradeRequirement: "全体の学習成績の状況3.8以上（現役は3年次1学期・前期まで、既卒は3年次修了時まで）",
      restrictions: [
        "本人および保護者等の保証人の同意が必要",
        "卒業後、宮城県以外の東北5県（青森・岩手・秋田・山形・福島）の医療機関等に一定期間勤務",
        "入学後1年次に東北5県いずれかの修学資金制度へ必ず応募（貸与は各県の審査による）",
        "修学資金採用時は各県の規程に従い9年程度勤務。すべて不採用でも東北5県の医療機関に臨床研修を含む5年間勤務",
        "推薦書の提出が必要（推薦者要件は完成版募集要項で確認）",
      ],
      events: [
        event("application-start", "2026-09-14", "出願開始"),
        event("application-deadline", "2026-10-02", "出願登録締切", { deadlineRule: "Web登録" }),
        event("application-deadline", "2026-10-04", "出願書類提出期限", { deadlineRule: "必着" }),
        event("first-result", "2026-10-16", "第一次選考結果発表"),
        event("second-exam", "2026-10-24", "第二次選考①（理科・数学・英語小論文）", { sequence: 1, choiceRule: "2日間とも受験" }),
        event("second-exam", "2026-10-25", "第二次選考②（グループ面接）", { sequence: 2, choiceRule: "2日間とも受験" }),
        event("final-result", "2026-11-02", "合格発表"),
        event("procedure-deadline", "2026-11-16", "入学金等納付期限"),
        event("procedure-deadline", "2026-11-16", "手続書類提出期限"),
      ],
      sourceUrls: [
        "https://www.tohoku-mpu.ac.jp/admission/medicine-application/",
        "https://www.tohoku-mpu.ac.jp/wp/wp-content/uploads/2026/05/963a4d3c20d5c1e17605bf8aa1e7293c-1.pdf",
        "https://www.tohoku-mpu.ac.jp/about/information/admissions_policy/",
        "https://www.tohoku-mpu.ac.jp/medicine/scholarship/",
      ],
      note: "一次試験は推薦書・活動実績書・調査書などの提出書類による書類選考です。二次試験は10月24日に理科・数学・英語小論文、10月25日にグループ面接を行い、両日受験が必要です。大学入学共通テストは利用しません。",
    })],
    excludedRoutes: ["一般選抜（修学資金枠宮城A・東北5県定着枠・一般枠）、大学入学共通テスト利用選抜（一般枠）を除外"],
  }),
  university({
    id: "jichi-medical",
    name: "自治医科大学",
    region: "関東",
    prefecture: "栃木県",
    strategyPath: "/jichiika-university-entrance-exam-measures2027/",
    scopeStatus: "available",
    publicationStatus: "complete",
    statusNote: "2027年度完成版募集要項（2026年7月3日公表）で、総合型選抜5県と学校推薦型選抜（富山県）を確認。医学部総定員100名は臨時定員増の認可申請中です。",
    officialUrl: "https://www.jichi.ac.jp/exam/medicine/exam/special/",
    routes: [
      route({
        id: "comprehensive-prefectural",
        officialName: "総合型選抜",
        category: "comprehensive",
        quota: "栃木2名・富山1名・山梨2名・山口2名・佐賀2名",
        publicationStatus: "complete",
        currentStudentEligible: true,
        eligibility: "2027年3月卒業見込みを含む大学入学資格者（既卒、他大学・専修学校在籍、高認、外国課程、社会経験者等を含む）で、対象5県のいずれかを公式の出願地要件により選択できる者",
        exclusive: "条件付き",
        principalRecommendation: "不要",
        gradeRequirement: "調査書の全体の学習成績の状況4.0以上",
        restrictions: [
          "実施県：栃木県・富山県・山梨県・山口県・佐賀県（出願地は1県のみ）",
          "高校・中等教育学校卒業者等が本人・父母等の住所地を出願地にする場合、原則として2024年4月1日以前から同一都道府県内に継続して居住",
          "高卒認定は2027年3月31日までの合格見込みを含み、同日までに18歳到達が必要",
          "合格時は入学を確約。他大学への出願自体は可",
          "卒業後、出願都道府県のキャリア形成プログラムに基づき、一定期間、指定公立病院等へ勤務",
          "学校推薦型選抜との重複出願不可",
          "志願者を客観的に評価できる者が記入・厳封する志願者評価書と活動報告書の提出が必要",
        ],
        events: [
          event("application-start", "2026-10-14", "出願開始"),
          event("application-deadline", "2026-10-19", "郵送消印有効期限", { deadlineRule: "消印有効" }),
          event("application-deadline", "2026-10-20", "出願締切", { time: "17:00", deadlineRule: "必着" }),
          event("first-result", "2026-11-13", "書類選考合格発表", { time: "13:00" }),
          event("first-exam", "2026-11-18", "基礎学力検査（数学・英語）・個人面接", { time: "9:00～16:00" }),
          event("final-result", "2026-12-01", "基礎学力検査・面接試験合格発表", { time: "13:00" }),
          event("procedure-deadline", "2027-02-25", "入学手続①", { sequence: 1, choiceRule: "両日とも本人手続" }),
          event("procedure-deadline", "2027-03-12", "入学手続②", { sequence: 2, choiceRule: "両日とも本人手続" }),
        ],
        sourceUrls: [
          "https://www.jichi.ac.jp/exam/medicine/exam/special/",
          "https://www.jichi.ac.jp/assets/pdf/exam/medicine/exam/exam_youkou_R9.pdf",
          "https://www.jichi.ac.jp/exam/medicine/exam/",
          "https://www.jichi.ac.jp/news/exam/2026070301/",
        ],
        note: "出願書類で受験者を選ぶ書類選考を行います。11月18日は受付8:20～8:30、数学9:00～10:00、英語10:20～11:20、都道府県・大学の個人面接12:20～16:00です。郵送は書留速達または簡易書留速達、持参は出願期間内の平日9:00～17:00です。共通テスト利用選抜ではありませんが、調査書を発行できない既卒者は学力参考資料として共通テスト成績等を提出します。",
      }),
      route({
        id: "recommendation-toyama",
        officialName: "学校推薦型選抜",
        category: "recommendation",
        quota: "1名",
        publicationStatus: "complete",
        currentStudentEligible: true,
        eligibility: "高校・中等教育学校を2026年3月から2027年3月までに卒業または卒業見込みで、富山県を公式の出願地要件により選択できる者",
        exclusive: "条件付き",
        principalRecommendation: "必要",
        gradeRequirement: "調査書の全体の学習成績の状況4.0以上",
        restrictions: [
          "実施県：富山県（出願地は1県のみ）",
          "富山県は出身校所在地、または本人・父母等の住所地により選択（住所地は原則2024年4月1日以前から県内に継続）",
          "高校・中等教育学校長の推薦が必要（1校1名）",
          "合格時は入学を確約。他大学への出願自体は可",
          "卒業後、富山県のキャリア形成プログラムに基づき、一定期間、指定公立病院等へ勤務",
          "総合型選抜との重複出願不可",
        ],
        events: [
          event("application-start", "2026-11-01", "出願開始"),
          event("application-deadline", "2026-11-06", "郵送消印有効期限", { deadlineRule: "消印有効" }),
          event("application-deadline", "2026-11-07", "出願締切", { time: "17:00", deadlineRule: "必着" }),
          event("first-result", "2026-11-13", "書類選考合格発表", { time: "13:00" }),
          event("first-exam", "2026-11-18", "基礎学力検査（数学・英語）・個人面接", { time: "9:00～16:00" }),
          event("final-result", "2026-12-01", "基礎学力検査・面接試験合格発表", { time: "13:00" }),
          event("procedure-deadline", "2027-02-25", "入学手続①", { sequence: 1, choiceRule: "両日とも本人手続" }),
          event("procedure-deadline", "2027-03-12", "入学手続②", { sequence: 2, choiceRule: "両日とも本人手続" }),
        ],
        sourceUrls: [
          "https://www.jichi.ac.jp/exam/medicine/exam/special/",
          "https://www.jichi.ac.jp/assets/pdf/exam/medicine/exam/exam_youkou_R9.pdf",
          "https://www.jichi.ac.jp/exam/medicine/exam/",
          "https://www.jichi.ac.jp/news/exam/2026070301/",
        ],
        note: "出願書類で受験者を選ぶ書類選考を行います。11月18日は受付8:20～8:30、数学9:00～10:00、英語10:20～11:20、都道府県・大学の個人面接12:20～16:00です。郵送は書留速達または簡易書留速達、持参は出願期間内の平日9:00～17:00です。大学入学共通テストは利用しません。",
      }),
    ],
    excludedRoutes: ["一般選抜（全都道府県）を除外。医学部医学科で大学入学共通テスト利用選抜の実施なし"],
  }),
  university({
    id: "dokkyo-medical",
    name: "獨協医科大学",
    region: "関東",
    prefecture: "栃木県",
    strategyPath: "/dokkyouika-university-entrance-exam-measures2027/",
    scopeStatus: "available",
    publicationStatus: "partial",
    statusNote: "2027年度公式概要と公募（地域特別枠）の完成版要項を確認。指定校制・県別指定校地域枠・系列校の出願資格詳細は対象校向けに案内され、3県地域枠の募集人員は認可申請予定です。",
    officialUrl: "https://www.dokkyomed.ac.jp/dusm/exam/entrance/",
    routes: [
      route({
        id: "recommendation-public-regional",
        officialName: "学校推薦型選抜（公募（地域特別枠））",
        category: "regional",
        quota: "10名",
        publicationStatus: "complete",
        currentStudentEligible: true,
        eligibility: "高校等を2027年3月卒業見込みで、対象地域、評定、学校長推薦、卒後の地域医療従事意思など、すべての要件を満たす者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "在学期間（3年次は1学期まで）を通して全体の学習成績の状況4.0以上",
        restrictions: [
          "栃木・群馬・茨城・埼玉・福島・東京の高校等を卒業見込み、または本人・保護者が2024年4月1日から当該地域に継続居住",
          "卒業後、栃木・群馬・茨城・埼玉・福島のいずれかで医療に従事する意思",
          "合格した場合は必ず入学",
          "指定校制との併願は双方の資格を満たす指定校生のみ可。県別指定校地域枠とは併願不可",
        ],
        events: [
          event("application-start", "2026-11-02", "出願開始"),
          event("application-deadline", "2026-11-09", "出願締切", { time: "17:00", deadlineRule: "必着" }),
          event("first-exam", "2026-11-14", "第1次試験（小論文・基礎適性・書類審査）", { time: "8:50～12:20" }),
          event("first-result", "2026-11-18", "第1次合格発表", { time: "10:00" }),
          event("second-exam", "2026-11-20", "第2次試験（MMI面接）", { time: "9:30～" }),
          event("final-result", "2026-12-01", "最終合格発表", { time: "10:00" }),
          event("procedure-deadline", "2026-12-08", "入学手続締切"),
        ],
        sourceUrls: [
          "https://www.dokkyomed.ac.jp/dusm/exam/entrance/",
          "https://www.dokkyomed.ac.jp/dusm/exam/entrance/recommendation.html",
          "https://www.dokkyomed.ac.jp/files/dusm/jyuken/form_requirements-area.pdf?v=4d94d4a48697e063dd1c9cc02ae0beae",
        ],
        note: "第1次試験は小論文、基礎適性（英語・数学）と書類審査、第2次試験はMMI方式の面接です。入学後は地域医療に関する所定科目の履修が必須です。",
      }),
      route({
        id: "recommendation-designated",
        officialName: "学校推薦型選抜（指定校制）",
        category: "designated",
        quota: "約20名",
        publicationStatus: "partial",
        currentStudentEligible: "conditional",
        eligibility: "大学が指定する高校の生徒が対象。出願資格の詳細は各指定校へ通知",
        exclusive: "未公表",
        principalRecommendation: "必要",
        gradeRequirement: "指定校へ通知",
        restrictions: ["指定校のみ", "出願資格・評定等の詳細は各指定校へ通知"],
        events: [
          event("application-start", "2026-11-02", "出願開始"),
          event("application-deadline", "2026-11-09", "出願締切"),
          event("first-exam", "2026-11-14", "選考日"),
          event("final-result", "2026-12-01", "合格発表", { time: "10:00" }),
          event("procedure-deadline", "2026-12-08", "入学手続締切"),
        ],
        sourceUrls: ["https://www.dokkyomed.ac.jp/dusm/exam/entrance/"],
        note: "募集要項等は各指定校へ送付され、公開ページでは詳細条件が公表されていません。",
      }),
      route({
        id: "recommendation-tochigi",
        officialName: "学校推薦型選抜（指定校制（栃木県地域枠））",
        category: "regional",
        quota: "7名以内",
        publicationStatus: "partial",
        currentStudentEligible: "conditional",
        eligibility: "学校推薦型選抜（指定校制）の出願資格を満たし、栃木県医師修学資金の貸与と卒後勤務要件を受け入れる者",
        exclusive: "条件付き",
        principalRecommendation: "必要",
        gradeRequirement: "指定校へ通知",
        restrictions: [
          "指定校制の対象校のみ（出身地域は不問）",
          "卒業まで栃木県医師修学資金の貸与を受ける",
          "卒後は貸与期間の1.5倍（通常9年、初期臨床研修を含む）、栃木県指定の公的医療機関等に勤務",
          "指定校制との併願可。埼玉・茨城の指定校地域枠および公募（地域特別枠）とは併願不可",
        ],
        events: [
          event("application-start", "2026-11-02", "出願開始"),
          event("application-deadline", "2026-11-09", "出願締切"),
          event("first-exam", "2026-11-14", "選考日"),
          event("final-result", "2026-12-01", "合格発表", { time: "10:00" }),
          event("procedure-deadline", "2026-12-08", "入学手続締切"),
        ],
        sourceUrls: [
          "https://www.dokkyomed.ac.jp/dusm/exam/entrance/",
          "https://www.dokkyomed.ac.jp/dusm/exam/entrance/designated_tochigi.html",
        ],
        note: "募集人員は医学部臨時定員増の認可申請予定で、変更される場合があります。大学の面接に加えて栃木県の面接を実施し、入学後は地域医療に関する所定科目を履修します。",
      }),
      route({
        id: "recommendation-saitama",
        officialName: "学校推薦型選抜（指定校制（埼玉県地域枠））",
        category: "regional",
        quota: "2名",
        publicationStatus: "partial",
        currentStudentEligible: "conditional",
        eligibility: "学校推薦型選抜（指定校制）の出願資格を満たし、埼玉県医師育成奨学金の貸与と卒後勤務要件を受け入れる者",
        exclusive: "条件付き",
        principalRecommendation: "必要",
        gradeRequirement: "指定校へ通知",
        restrictions: [
          "指定校制の対象校のみ（出身地域は不問）",
          "卒業まで埼玉県医師育成奨学金（指定大学奨学金）の貸与を受ける",
          "医師免許取得後、県内病院等に9年間勤務し、特定診療科・特定医療機関等の追加要件を満たす",
          "指定校制との併願可。栃木・茨城の指定校地域枠および公募（地域特別枠）とは併願不可",
        ],
        events: [
          event("application-start", "2026-11-02", "出願開始"),
          event("application-deadline", "2026-11-09", "出願締切"),
          event("first-exam", "2026-11-14", "選考日"),
          event("final-result", "2026-12-01", "合格発表", { time: "10:00" }),
          event("procedure-deadline", "2026-12-08", "入学手続締切"),
        ],
        sourceUrls: [
          "https://www.dokkyomed.ac.jp/dusm/exam/entrance/",
          "https://www.dokkyomed.ac.jp/dusm/exam/entrance/saitama.html",
        ],
        note: "募集人員は医学部臨時定員増の認可申請予定で、変更される場合があります。入学後は地域医療に関する所定科目を履修します。",
      }),
      route({
        id: "recommendation-ibaraki",
        officialName: "学校推薦型選抜（指定校制（茨城県地域枠））",
        category: "regional",
        quota: "2名",
        publicationStatus: "partial",
        currentStudentEligible: "conditional",
        eligibility: "学校推薦型選抜（指定校制）の出願資格を満たし、茨城県地域医療医師修学資金の貸与と卒後勤務要件を受け入れる者",
        exclusive: "条件付き",
        principalRecommendation: "必要",
        gradeRequirement: "指定校へ通知",
        restrictions: [
          "指定校制の対象校のみ（出身地域は不問）",
          "卒業まで茨城県地域医療医師修学資金の貸与を受ける",
          "卒後1年6か月以内に医師免許を取得し、県指定の公的医療機関等に9年間勤務（うち医師不足地域内の医療機関に4.5年以上）",
          "指定校制との併願可。栃木・埼玉の指定校地域枠および公募（地域特別枠）とは併願不可",
        ],
        events: [
          event("application-start", "2026-10-01", "茨城県への応募開始"),
          event("application-deadline", "2026-10-23", "茨城県への応募締切"),
          event("application-deadline", "2026-10-30", "茨城県eラーニング回答期限"),
          event("application-start", "2026-11-02", "大学出願開始"),
          event("application-deadline", "2026-11-09", "大学出願締切"),
          event("first-exam", "2026-11-14", "選考日"),
          event("final-result", "2026-12-01", "合格発表", { time: "10:00" }),
          event("procedure-deadline", "2026-12-08", "入学手続締切"),
        ],
        sourceUrls: [
          "https://www.dokkyomed.ac.jp/dusm/exam/entrance/",
          "https://www.dokkyomed.ac.jp/dusm/exam/entrance/ibaraki.html",
        ],
        note: "募集人員は医学部臨時定員増の認可申請予定で、変更される場合があります。大学出願前に茨城県への応募とeラーニング回答が必要で、入学後は地域医療に関する所定科目を履修します。",
      }),
      route({
        id: "recommendation-affiliated",
        officialName: "学校推薦型選抜（系列校）",
        category: "designated",
        quota: "約10名",
        publicationStatus: "partial",
        currentStudentEligible: "conditional",
        eligibility: "系列校の生徒が対象。出願資格の詳細は系列校向け資料で案内",
        exclusive: "未公表",
        principalRecommendation: "必要",
        gradeRequirement: "系列校へ通知",
        restrictions: ["系列校（獨協中学・高等学校、獨協埼玉中学高等学校）のみ"],
        events: [
          event("application-start", "2026-11-02", "出願開始"),
          event("application-deadline", "2026-11-09", "出願締切"),
          event("first-exam", "2026-11-14", "試験1日目", { sequence: 1, choiceRule: "2日間とも受験" }),
          event("first-exam", "2026-11-20", "試験2日目", { sequence: 2, choiceRule: "2日間とも受験" }),
          event("final-result", "2026-12-01", "合格発表", { time: "10:00" }),
          event("procedure-deadline", "2026-12-08", "入学手続締切"),
        ],
        sourceUrls: [
          "https://www.dokkyomed.ac.jp/dusm/exam/entrance/",
          "https://www.dokkyomed.ac.jp/files/dusm/jyuken/00180-004.pdf?v=7300b15d73d0e739df2abb183fb32e21",
        ],
        note: "書類審査、小論文、基礎適性試験、面接試験の成績を総合して選考し、試験は2日間に分けて実施します。",
      }),
    ],
    excludedRoutes: [
      "総合型選抜は4年制大学卒業・卒業見込み、または大学2年次修了者等が対象で、現役高校生は出願できないため除外",
      "一般選抜（前期・後期）は対象外",
      "栃木県地域枠・新潟県地域枠は一般選抜（前期）に準じるため対象外",
      "大学入学共通テスト利用選抜は2025年度入試から廃止され、2027年度は実施なし",
    ],
  }),
  university({
    id: "saitama-medical",
    name: "埼玉医科大学",
    region: "関東",
    prefecture: "埼玉県",
    strategyPath: "/saitamaika-university-entrance-exam-measures2027/",
    scopeStatus: "available",
    publicationStatus: "partial",
    statusNote: "2027年度完成版要項で指定校枠・一般公募枠・特別枠・帰国生選抜を確認。埼玉県地域枠19名は臨時定員増の認可申請予定で、出願資格・必要書類は参考掲載、認可後に正式要項を公開予定です。",
    officialUrl: saitamaAdmissionsOverviewUrl,
    routes: [
      route({
        id: "recommendation-designated",
        officialName: "学校推薦型選抜（指定校枠）",
        category: "designated",
        quota: "5名",
        publicationStatus: "complete",
        currentStudentEligible: "conditional",
        eligibility: "本学医学部が指定する高校・中等教育学校を2026年3月卒業または2027年3月卒業見込みで、評定、学校長推薦、入学確約の要件を満たす者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "全体、および数学・理科・外国語がそれぞれ3.8以上（卒業見込み者は最終学年1学期まで）",
        restrictions: [
          "本学医学部の指定校のみ。指定校名は非公表",
          "学校長が推薦できる人数は4名まで",
          "指定校枠へ出願すると一般公募枠にも自動出願",
          "埼玉県地域枠・特別枠・帰国生選抜との併願不可",
        ],
        events: [...saitamaSchedule],
        sourceUrls: [saitamaOfficialGuideUrl, saitamaRecommendationUrl, saitamaFaqUrl],
        note: "適性検査（数学・理科2領域・英語）、小論文、面接と出願書類を用いる1日完結の選抜です。合格後は入学を辞退できません。",
      }),
      route({
        id: "recommendation-public",
        officialName: "学校推薦型選抜（一般公募枠）",
        category: "recommendation",
        quota: "14名",
        publicationStatus: "complete",
        currentStudentEligible: true,
        eligibility: "高校・中等教育学校を2026年3月卒業または2027年3月卒業見込みで、評定、学校長推薦、入学確約の要件を満たす者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "全体、および数学・理科・外国語がそれぞれ4.0以上（卒業見込み者は最終学年1学期まで）",
        restrictions: [
          "学校長が推薦できる人数は2名まで",
          "埼玉県地域枠・特別枠・帰国生選抜との併願不可",
        ],
        events: [...saitamaSchedule],
        sourceUrls: [saitamaOfficialGuideUrl, saitamaRecommendationUrl, saitamaFaqUrl],
        note: "適性検査（数学・理科2領域・英語）、小論文、面接と出願書類を用いる1日完結の選抜です。合格後は入学を辞退できません。",
      }),
      route({
        id: "recommendation-saitama",
        officialName: "学校推薦型選抜（埼玉県地域枠）",
        category: "regional",
        quota: "19名申請予定",
        publicationStatus: "outline",
        currentStudentEligible: true,
        eligibility: "高校・中等教育学校を2026年3月卒業または2027年3月卒業見込みで、評定、学校長推薦、入学確約、奨学金貸与と卒後勤務の要件を満たす者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "全体、および数学・理科・外国語がそれぞれ4.0以上。指定校出身者はそれぞれ3.8以上（卒業見込み者は最終学年1学期まで）",
        restrictions: [
          "学校長が推薦できる人数は2名まで（指定校は4名まで）",
          "埼玉県地域枠医学生奨学金を月20万円・6年間受給",
          "卒業後9年間、県指定の特定地域の公的医療機関等、特定診療科等または準特定診療科で勤務",
          "一般公募枠・特別枠・帰国生選抜との併願不可",
        ],
        events: [...saitamaSchedule],
        sourceUrls: [saitamaOfficialGuideUrl, saitamaRecommendationUrl, saitamaScholarshipUrl, saitamaFaqUrl],
        note: "19名は臨時定員増の認可申請予定数です。出願資格と必要書類は参考掲載で、認可後に正式な学生募集要項・書類が公表されます。",
      }),
      route({
        id: "recommendation-special",
        officialName: "学校推薦型選抜（特別枠）",
        category: "recommendation",
        quota: "2名",
        publicationStatus: "complete",
        currentStudentEligible: true,
        eligibility: "高校・中等教育学校を2026年3月卒業または2027年3月卒業見込みで、学校長推薦、入学確約、所定の英語資格または科学競技等の実績要件を満たす者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "数値基準なし（所定の英語資格または科学オリンピック等の実績が必要）",
        restrictions: [
          "英検1級、TOEFL iBT 100以上、TOEIC 900以上、IELTS 7.0以上などの英語資格、または所定の科学競技等の実績",
          "学校長の推薦人数に制限なし",
          "一般公募枠・埼玉県地域枠・帰国生選抜との併願不可",
        ],
        events: [...saitamaSchedule],
        sourceUrls: [saitamaOfficialGuideUrl, saitamaRecommendationUrl, saitamaFaqUrl],
        note: "公式の選抜区分は学校推薦型選抜です。適性検査、小論文、面接と出願書類を用いる1日完結の選抜で、合格後は入学を辞退できません。",
      }),
      route({
        id: "returnee",
        officialName: "帰国生選抜",
        category: "returnee",
        quota: "若干名",
        publicationStatus: "complete",
        currentStudentEligible: "conditional",
        eligibility: "日本国籍、永住者または特別永住者で大学入学資格を有し、海外の高校相当校に卒業年次を含め2学年以上在籍して、2025年4月から2027年3月までに卒業または卒業見込みの者",
        exclusive: "専願",
        principalRecommendation: "不要",
        gradeRequirement: "数値基準なし（成績証明書等を選考資料として評価）",
        restrictions: [
          "日本国籍、永住者または特別永住者のいずれか",
          "海外の高校相当校に卒業年次を含め2学年以上在籍",
          "学校推薦型選抜との併願不可",
        ],
        events: [...saitamaSchedule],
        sourceUrls: [saitamaOfficialGuideUrl, saitamaFaqUrl, saitamaAdmissionsOverviewUrl],
        note: "適性検査（数学・理科2領域・英語）、小論文、面接と成績証明書等を用いる1日完結の選抜です。合格後は入学を辞退できません。",
      }),
    ],
    excludedRoutes: [
      "一般選抜（前期・後期）は対象外",
      "大学入学共通テスト利用選抜は通常の共通テスト利用方式のため対象外",
      "研究医枠は入学後に募集・選抜される制度で、入試方式ではないため対象外",
    ],
  }),
  university({
    id: "iuhw",
    name: "国際医療福祉大学",
    region: "関東",
    prefecture: "千葉県",
    strategyPath: "/iuhw-medical-school-exam-guide-2027/",
    scopeStatus: "available",
    publicationStatus: "complete",
    statusNote: "総合型選抜の分冊要項と、本冊の留学生・帰国生および外国人学校卒業生特別選抜を確認。",
    officialUrl: iuhwAdmissionsDownloadUrl,
    routes: [
      route({
        id: "comprehensive-exclusive",
        officialName: "総合型選抜（専願制）",
        category: "comprehensive",
        quota: "10名",
        publicationStatus: "complete",
        currentStudentEligible: true,
        eligibility: "高等学校または中等教育学校を2026年3月に卒業、または2027年3月卒業見込みで、本学医学部を第一志望とし、指定説明会等への参加・視聴条件を満たす者",
        exclusive: "専願",
        principalRecommendation: "不要",
        gradeRequirement: "数値基準なし（調査書を選考資料として使用）",
        restrictions: [
          "指定する医学部説明会・オープンキャンパスへの本人参加、または指定Web説明動画等の本人視聴が必要",
          "高等学校・中等教育学校のみが対象で、他の学校・教育課程は含まれない",
          "合格後は他大学および本学の他入試に出願できず、入学辞退不可",
        ],
        events: [
          event("application-start", "2026-10-26", "Web出願開始", { time: "9:00" }),
          event("application-deadline", "2026-11-09", "Web出願登録締切", { time: "23:00", deadlineRule: "Web登録" }),
          event("application-deadline", "2026-11-09", "入学検定料納入締切", { time: "23:59" }),
          event("application-deadline", "2026-11-09", "出願書類締切", { deadlineRule: "必着" }),
          event("first-exam", "2026-11-21", "一次選考（学力試験・小論文・集団面接）"),
          event("first-result", "2026-11-30", "一次合格発表", { time: "15:00" }),
          event("second-exam", "2026-12-05", "二次選考（個別面接）"),
          event("final-result", "2026-12-14", "最終合格発表", { time: "15:00" }),
          event("procedure-deadline", "2026-12-21", "入学手続締切", { deadlineRule: "消印有効" }),
        ],
        sourceUrls: iuhwComprehensiveSources,
        note: "一次選考は学力試験・小論文・集団面接、二次選考は個別面接を実施します。大学入学共通テストは利用しません。入学手続期間は2026年12月14日から12月21日です。",
      }),
      ...(["留学生特別選抜", "帰国生および外国人学校卒業生特別選抜"] as const).flatMap((officialName, routeIndex) => [
        route({
          id: routeIndex === 0 ? "international-first" : "returnee-first",
          officialName: `${officialName}（第1回）`,
          category: routeIndex === 0 ? "international" : "returnee",
          quota: routeIndex === 0 ? "20名（第1・2回合計）" : "若干名（第1・2回合計）",
          publicationStatus: "complete",
          currentStudentEligible: "conditional",
          eligibility: routeIndex === 0
            ? "日本国籍・日本の永住許可を持たず、日本在住通算6年以内で、外国の12年課程を2027年3月31日までに修了見込みを含み、在留資格・英語力等の条件を満たす者"
            : "日本国籍を有する者または日本の永住許可を得た外国人で、日本の大学入学資格があり、海外学校歴・海外在住歴・外国人学校歴・IBのいずれかの条件を満たす者（2027年3月31日までの修了・資格取得見込みを含む）",
          exclusive: "併願可",
          principalRecommendation: "不要",
          gradeRequirement: routeIndex === 0
            ? "一律の評定基準なし。英語力の目安はTOEFL iBT 80以上またはIELTS 6.0以上（望ましい水準）"
            : "一律の評定基準なし（IB資格経路は総合32点以上および指定3科目の成績条件あり）",
          restrictions: routeIndex === 0
            ? [
                "日本の学校教育法上の小学校・中学校・高等学校・中等教育学校の在籍期間は通算3年以内",
                "入学までに在留資格「留学」を取得できる見込みが必要",
                "出願資格の事前確認を完了しないと出願不可",
              ]
            : [
                "外国の12年課程等に最終学年を含む4年以上、海外大学・大学院に2年以上、6年以上の海外在住、外国人学校に最終学年を含む2年以上、または所定のIB資格のいずれか",
                "海外在住歴は満6歳未満の期間を算入しない",
                "出願資格の事前確認を完了しないと出願不可",
              ],
          events: iuhwInternationalFirstSchedule,
          sourceUrls: iuhwSpecialSources,
          note: routeIndex === 0
            ? "数学・理科・小論文は日本語または英語を選択できます。協定に基づく自国政府等の推薦を得た者で本学が認めた場合、試験日・試験地を個別調整することがあります。二次選考後に個人面接のみの三次選考を行う場合があります。入学手続期間は2026年9月24日から9月30日です。"
            : "筆記試験はすべて英語、面接は英語で実施し、日本語での質疑応答もあります。二次選考後に個人面接のみの三次選考を行う場合があります。入学手続期間は2026年9月24日から9月30日です。",
        }),
        route({
          id: routeIndex === 0 ? "international-second" : "returnee-second",
          officialName: `${officialName}（第2回）`,
          category: routeIndex === 0 ? "international" : "returnee",
          quota: routeIndex === 0 ? "20名（第1・2回合計）" : "若干名（第1・2回合計）",
          publicationStatus: "complete",
          currentStudentEligible: "conditional",
          eligibility: routeIndex === 0
            ? "日本国籍・日本の永住許可を持たず、日本在住通算6年以内で、外国の12年課程を2027年3月31日までに修了見込みを含み、在留資格・英語力等の条件を満たす者"
            : "日本国籍を有する者または日本の永住許可を得た外国人で、日本の大学入学資格があり、海外学校歴・海外在住歴・外国人学校歴・IBのいずれかの条件を満たす者（2027年3月31日までの修了・資格取得見込みを含む）",
          exclusive: "併願可",
          principalRecommendation: "不要",
          gradeRequirement: routeIndex === 0
            ? "一律の評定基準なし。英語力の目安はTOEFL iBT 80以上またはIELTS 6.0以上（望ましい水準）"
            : "一律の評定基準なし（IB資格経路は総合32点以上および指定3科目の成績条件あり）",
          restrictions: routeIndex === 0
            ? [
                "日本の学校教育法上の小学校・中学校・高等学校・中等教育学校の在籍期間は通算3年以内",
                "入学までに在留資格「留学」を取得できる見込みが必要",
                "出願資格の事前確認を完了しないと出願不可",
              ]
            : [
                "外国の12年課程等に最終学年を含む4年以上、海外大学・大学院に2年以上、6年以上の海外在住、外国人学校に最終学年を含む2年以上、または所定のIB資格のいずれか",
                "海外在住歴は満6歳未満の期間を算入しない",
                "出願資格の事前確認を完了しないと出願不可",
              ],
          events: iuhwInternationalSecondSchedule,
          sourceUrls: iuhwSpecialSources,
          note: routeIndex === 0
            ? "数学・理科・小論文は日本語または英語を選択できます。協定に基づく自国政府等の推薦を得た者で本学が認めた場合、試験日・試験地を個別調整することがあります。第1回二次選考受験者が第2回一次選考に合格した場合、第2回二次選考は免除されます。二次選考後に個人面接のみの三次選考を行う場合があります。入学手続期間は2026年12月14日から12月21日です。"
            : "筆記試験はすべて英語、面接は英語で実施し、日本語での質疑応答もあります。第1回二次選考受験者が第2回一次選考に合格した場合、第2回二次選考は免除されます。二次選考後に個人面接のみの三次選考を行う場合があります。入学手続期間は2026年12月14日から12月21日です。",
        }),
      ]),
    ],
    excludedRoutes: [
      "一般選抜は対象外",
      "大学入学共通テスト利用選抜は通常の共通テスト利用方式のため対象外",
      "国際バカロレア資格は帰国生および外国人学校卒業生特別選抜の出願資格の一つで、独立した入試方式ではない",
    ],
  }),
  university({
    id: "kyorin",
    name: "杏林大学",
    region: "関東",
    prefecture: "東京都",
    strategyPath: "/kyorin-university-medicine-exam-guide2027/",
    scopeStatus: "not-offered",
    publicationStatus: "not-offered",
    statusNote: "2027年度入試概要と入試インフォメーションを確認。医学部の外国人留学生選抜および3地域枠はいずれも一般選抜と同一日程・同一試験で実施されるため、このページの対象外です。",
    officialUrl: "https://www.kyorin-u.ac.jp/univ/center/nyugaku/exam/",
    routes: [],
    excludedRoutes: [
      "外国人留学生選抜は日程・選考方法・試験会場が一般選抜と同じで、実質的に一般選抜として実施されるため対象外",
      "東京都地域枠選抜は一般選抜への出願が必須で、一般選抜の一次・二次試験を用いて選抜するため対象外",
      "新潟県地域枠選抜は一般選抜への出願が必須で、一般選抜の一次・二次試験を用いて選抜するため対象外",
      "群馬県地域枠選抜は一般選抜への出願が必須で、一般選抜の一次・二次試験を用いて選抜するため対象外",
    ],
  }),
  university({
    id: "keio",
    name: "慶應義塾大学",
    region: "関東",
    prefecture: "東京都",
    strategyPath: "/keio-university-entrance-exam2027-measures/",
    scopeStatus: "available",
    publicationStatus: "complete",
    statusNote: "2027年度完成版要項で、医学部外国人留学生対象入学試験と帰国生対象入学試験を確認。いずれも書類選考と大学独自の総合問題・模擬講義・面接で選考します。",
    officialUrl: "https://www.keio.ac.jp/ja/med/admission/exam/",
    routes: [route({
      id: "international-student",
      officialName: "医学部外国人留学生対象入学試験",
      category: "international",
      quota: "若干名",
      publicationStatus: "complete",
      currentStudentEligible: "conditional",
      eligibility: "2027年3月31日までに、通常の学校教育12年以上を修め、日本国外で外国制度による中高6学年をすべて修了し、当該国の大学入学資格を得る見込みを含む者。国籍・在留資格は不問",
      exclusive: "併願可",
      principalRecommendation: "不要",
      gradeRequirement: "評定の数値基準なし。EJU（日本語・数学コース2・理科2科目、日本語出題）とTOEFL iBTまたはIELTS Academicの提出が必須（基準点なし）",
      restrictions: [
        "日本の高校への交換留学等は1年以内",
        "過去に本方式へ出願した者は不可",
        "同年度の医学部帰国生対象入学試験とは併願不可",
        "出身高校の異なる校長・教員・スクールカウンセラー等2名による推薦状が必要",
      ],
      events: [
        event("application-start", "2026-07-03", "Webエントリー・入学検定料支払開始", { time: "10:00" }),
        event("application-deadline", "2026-07-14", "Webエントリー締切", { time: "16:00", deadlineRule: "Web登録" }),
        event("application-deadline", "2026-07-14", "入学検定料支払締切", { time: "16:00" }),
        event("application-deadline", "2026-07-15", "出願書類郵送締切", { deadlineRule: "必着" }),
        event("first-result", "2026-09-08", "第1次選考合格発表", { time: "10:00" }),
        event("second-exam", "2026-09-27", "第2次選考（総合問題・模擬講義・面接）", { time: "9:00" }),
        event("final-result", "2026-09-29", "最終合格発表", { time: "10:00" }),
        event("procedure-deadline", "2026-12-11", "入学手続期間最終日"),
      ],
      sourceUrls: [
        "https://www.keio.ac.jp/ja/med/admission/exam/",
        "https://www.keio.ac.jp/ja/admissions/faculty/examinations/international-student/",
        "https://www.keio.ac.jp/fixed-files/ryugaku_medicine_youkou.pdf",
      ],
      note: "第1次選考は書類選考のため試験日なし。第2次選考は9月27日8:45集合・9:00開始で、面接終了が17:00を超える場合があります。出願書類は速達・簡易書留（国外は追跡可能な方法）で7月15日必着。入学手続期間は11月30日～12月11日。",
    }), route({
      id: "returnee",
      officialName: "帰国生対象入学試験",
      category: "returnee",
      quota: "若干名",
      publicationStatus: "complete",
      currentStudentEligible: "conditional",
      eligibility: "2027年3月31日までに12年以上の学校教育課程を修め、海外の外国制度による高校に最終学年を含め2年以上連続在籍して卒業し、滞在国・地域の大学入学資格を得る見込みを含む、日本国籍者・永住者・特別永住者",
      exclusive: "併願可",
      principalRecommendation: "不要",
      gradeRequirement: "評定・語学試験の数値基準なし。TOEFL iBTまたはIELTS Academicと、数学・自然科学系科目を含む国別統一試験の確定成績が必須",
      restrictions: [
        "国別統一試験は見込み点・予測点不可",
        "過去に帰国生対象入学試験へ出願した者は不可",
        "同年度の医学部外国人留学生対象入学試験とは併願不可",
        "外国の出身高校の校長・教員・スクールカウンセラー等1名による推薦状が必要",
      ],
      events: [
        event("application-start", "2026-07-03", "Webエントリー・入学検定料支払開始", { time: "10:00" }),
        event("application-deadline", "2026-07-14", "Webエントリー締切", { time: "16:00", deadlineRule: "Web登録" }),
        event("application-deadline", "2026-07-14", "入学検定料支払締切", { time: "16:00" }),
        event("application-deadline", "2026-07-15", "出願書類郵送締切", { deadlineRule: "必着" }),
        event("first-result", "2026-09-08", "第1次選考合格発表", { time: "10:00" }),
        event("second-exam", "2026-09-27", "第2次選考（総合問題・模擬講義・面接）", { time: "9:00" }),
        event("final-result", "2026-09-29", "最終合格発表", { time: "10:00" }),
        event("procedure-deadline", "2026-12-11", "入学手続期間最終日"),
      ],
      sourceUrls: [
        "https://www.keio.ac.jp/ja/med/admission/exam/",
        "https://www.keio.ac.jp/ja/admissions/faculty/examinations/japanese-returnees/",
        "https://www.keio.ac.jp/fixed-files/kikoku_youkou.pdf",
      ],
      note: "第1次選考は書類選考のため試験日なし。第2次選考は9月27日8:45集合・9:00開始で、面接終了が17:00を超える場合があります。出願書類は速達・簡易書留（国外は追跡可能な方法）で7月15日必着。入学手続期間は11月30日～12月11日。",
    })],
    excludedRoutes: [
      "栃木県地域枠は2027年度医学部一般選抜66名のうち1名として募集されるため対象外",
    ],
  }),
  university({
    id: "juntendo",
    name: "順天堂大学",
    region: "関東",
    prefecture: "東京都",
    strategyPath: "/juntendo-medical-entrance-exam2027-measures/",
    scopeStatus: "available",
    publicationStatus: "partial",
    statusNote: "外国人選抜・帰国生選抜・国際バカロレア／ケンブリッジ・インターナショナル選抜は2027年度学生募集要項が公表済みです。研究医特別選抜は日程・資格が公表されていますが、入学定員増員認可後に最終版学生募集要項が掲載予定です。",
    officialUrl: "https://www.juntendo.ac.jp/admission/exam/nyushi/med/exam_info/boshu_youkou.html",
    routes: [
      route({
        id: "research-doctor",
        officialName: "研究医特別選抜",
        category: "comprehensive",
        quota: "2名（入学定員増員認可申請予定）",
        publicationStatus: "outline",
        currentStudentEligible: true,
        eligibility: "高等学校等を卒業した者・2027年3月卒業見込みの者等で、合格時の入学を確約し、入学後に基礎研究医養成プログラムの特別コースへ進学して基礎医学研究者養成奨学金の貸与を受ける者",
        exclusive: "専願",
        principalRecommendation: "不要",
        gradeRequirement: "評定の数値基準なし。大学入学共通テスト7科目を必須利用し、外部英語資格は任意で最大25点加点",
        restrictions: [
          "合格時に入学を確約",
          "基礎研究医養成プログラム特別コースへの進学",
          "基礎医学研究者養成奨学金の貸与を受けること",
          "地域枠選抜との併願不可",
        ],
        events: [
          event("application-start", "2026-12-14", "出願開始"),
          event("application-deadline", "2027-01-15", "Web出願登録・入学検定料納入期限"),
          event("application-deadline", "2027-01-15", "出願書類締切", { deadlineRule: "必着" }),
          event("first-exam", "2027-01-16", "大学入学共通テスト1日目", { sequence: 1, choiceRule: "2日間とも受験" }),
          event("first-exam", "2027-01-17", "大学入学共通テスト2日目", { sequence: 2, choiceRule: "2日間とも受験" }),
          event("second-exam", "2027-02-03", "小論文試験（二次判定資料）", { time: "17:30～18:40", sequence: 1, choiceRule: "小論文は全志願者、面接・プレゼンテーションは一次合格者が受験" }),
          event("first-result", "2027-02-10", "一次試験合格発表", { time: "12:00" }),
          event("second-exam", "2027-02-16", "二次試験（面接約20分・プレゼンテーション約20分）", { sequence: 2, choiceRule: "小論文は全志願者、面接・プレゼンテーションは一次合格者が受験" }),
          event("final-result", "2027-02-20", "二次試験合格発表", { time: "12:00" }),
          event("procedure-deadline", "2027-02-26", "入学手続期間最終日", { time: "17:00" }),
        ],
        sourceUrls: [
          "https://www.juntendo.ac.jp/admission/exam/nyushi/med/exam_info/boshu_youkou.html",
          "https://www.juntendo.ac.jp/assets/2027_Juntendo_Med_NyugakuShikenYoukou.pdf",
          "https://www.juntendo.ac.jp/kenkyui/",
        ],
        note: "小論文は一次合否には使いませんが、未受験者は一次選抜対象外となり、二次合否の判定に使われます。面接・プレゼンテーションの実施時刻は一次試験合格発表時に通知されます。地域枠以外の本学医学部方式とは併願できますが、研究医特別選抜に合格した場合は本方式で入学手続を行います。入学検定料は出願登録後2日以内、かつ出願期間内の納入が必要です。入学手続期間は2月20日12:00～2月26日17:00です。",
      }),
      route({
        id: "international",
        officialName: "外国人選抜",
        category: "international",
        quota: "5名",
        publicationStatus: "complete",
        currentStudentEligible: "conditional",
        eligibility: "外国籍を有し、日本国外の12年課程、指定された外国の大学入学資格、または認定教育施設の12年課程のいずれかを修了済み、または2027年3月31日までに修了・取得見込みで、日本の大学入学資格を満たす者",
        exclusive: "併願可",
        principalRecommendation: "不要",
        gradeRequirement: "評定の数値基準なし。JLPT N1、またはN2かつ総合112点以上。TOEFL iBT新4.0／旧72、IELTS 5.5、英検2304、TEAP 309、GTEC CBT 1180、ケンブリッジ英語160のいずれかを必須",
        restrictions: [
          "外国籍であること",
          "国際臨床医・研究医選抜3方式から1方式のみ出願可",
          "第二次選考はEJUの日本語・理科2科目・数学コース2を利用",
        ],
        events: [
          event("application-start", "2026-09-01", "出願開始"),
          event("application-deadline", "2026-09-17", "Web出願登録・入学検定料納入期限"),
          event("application-deadline", "2026-09-17", "出願書類締切", { deadlineRule: "必着" }),
          event("first-exam", "2026-10-13", "一次試験（小論文・英作文）", { time: "14:30～16:30", sequence: 1, choiceRule: "2日間とも受験" }),
          event("first-exam", "2026-10-14", "一次試験（面接）", { sequence: 2, choiceRule: "2日間とも受験" }),
          event("first-result", "2026-11-01", "一次試験合格発表", { time: "12:00" }),
          event("final-result", "2026-11-01", "二次試験免除者合格発表", { time: "12:00" }),
          event("second-exam", "2026-06-21", "日本留学試験（第1回）", { sequence: 1, choiceRule: "EJU第1回または第2回から1回を選択" }),
          event("second-exam", "2026-11-08", "日本留学試験（第2回）", { sequence: 2, choiceRule: "EJU第1回または第2回から1回を選択" }),
          event("application-deadline", "2026-11-13", "EJU第2回受験票写し提出期限（利用者のみ）"),
          event("procedure-deadline", "2026-11-13", "二次試験免除者 入学手続期間最終日", { time: "17:00" }),
          event("application-deadline", "2027-01-14", "IB取得見込みの一次合格者 最終6科目成績証明書発送期限"),
          event("final-result", "2027-01-20", "二次試験合格発表", { time: "12:00" }),
          event("procedure-deadline", "2027-02-02", "二次試験合格者 入学手続期間最終日", { time: "17:00" }),
          event("procedure-deadline", "2027-02-05", "二次試験免除見込み者 入学手続期間最終日", { time: "17:00" }),
        ],
        sourceUrls: [
          "https://www.juntendo.ac.jp/admission/exam/nyushi/med/exam_info/boshu_youkou.html",
          "https://www.juntendo.ac.jp/assets/2027_Juntendo_Med_GakuseiBoshuYoukou_Kokusai.pdf",
        ],
        note: "二次試験免除は、IB最終40点以上、AレベルA*・A・A以上、SAT 1450以上と所定のAP／EJU、またはACT 33以上等が条件です。面接受験時間は10月2日12:00に発表され、免除者・免除見込み者は一次発表時に通知されます。入学検定料は出願登録後2日以内、かつ出願期間内の納入が必要です。手続期間の開始は、免除者が11月1日12:00、通常合格者が1月20日12:00、免除見込み者の条件充足時が1月25日12:00です。",
      }),
      route({
        id: "returnee",
        officialName: "帰国生選抜",
        category: "returnee",
        quota: "2名",
        publicationStatus: "complete",
        currentStudentEligible: "conditional",
        eligibility: "日本国籍または日本国の永住許可を有し、日本国外の12年課程、指定された外国の大学入学資格、または認定教育施設の12年課程のいずれかを修了済み、または2027年3月31日までに修了・取得見込みで、国外の最終学校に最終学年を含めて継続在学し、その学校を修了済みまたは同日までに修了見込みの者",
        exclusive: "併願可",
        principalRecommendation: "不要",
        gradeRequirement: "評定の数値基準なし。TOEFL iBT新4.0／旧72、IELTS 5.5、英検2304、TEAP 309、GTEC CBT 1180、ケンブリッジ英語160のいずれかを必須。第二次選考ではEJUまたは大学入学共通テストを選択",
        restrictions: [
          "日本国籍または日本国の永住許可を有すること",
          "国外の最終学校に最終学年を含めて継続在学",
          "国際臨床医・研究医選抜3方式から1方式のみ出願可",
          "第二次選考はEJUの理科2科目・数学コース2、または共通テストの理科2科目・数学2科目を利用",
        ],
        events: [
          event("application-start", "2026-09-01", "出願開始"),
          event("application-deadline", "2026-09-17", "Web出願登録・入学検定料納入期限"),
          event("application-deadline", "2026-09-17", "出願書類締切", { deadlineRule: "必着" }),
          event("first-exam", "2026-10-13", "一次試験（小論文・英作文）", { time: "14:30～16:30", sequence: 1, choiceRule: "2日間とも受験" }),
          event("first-exam", "2026-10-14", "一次試験（面接）", { sequence: 2, choiceRule: "2日間とも受験" }),
          event("first-result", "2026-11-01", "一次試験合格発表", { time: "12:00" }),
          event("final-result", "2026-11-01", "二次試験免除者合格発表", { time: "12:00" }),
          event("second-exam", "2026-06-21", "日本留学試験（第1回）", { sequence: 1, choiceRule: "EJUを選ぶ場合は第1回または第2回から1回を選択" }),
          event("second-exam", "2026-11-08", "日本留学試験（第2回）", { sequence: 2, choiceRule: "EJUを選ぶ場合は第1回または第2回から1回を選択" }),
          event("application-deadline", "2026-11-13", "EJU第2回受験票写し提出期限（利用者のみ）"),
          event("application-deadline", "2026-12-23", "共通テスト成績請求チケット提出期限（利用者のみ）"),
          event("application-deadline", "2027-01-14", "IB取得見込みの一次合格者 最終6科目成績証明書発送期限"),
          event("second-exam", "2027-01-16", "大学入学共通テスト1日目", { sequence: 1, choiceRule: "共通テストを選ぶ場合は2日間とも受験" }),
          event("second-exam", "2027-01-17", "大学入学共通テスト2日目", { sequence: 2, choiceRule: "共通テストを選ぶ場合は2日間とも受験" }),
          event("procedure-deadline", "2026-11-06", "二次試験免除者 入学手続期間最終日", { time: "17:00" }),
          event("procedure-deadline", "2027-01-29", "二次試験免除見込み者 入学手続期間最終日", { time: "17:00" }),
          event("final-result", "2027-02-10", "二次試験合格発表", { time: "12:00" }),
          event("procedure-deadline", "2027-02-18", "二次試験合格者 入学手続期間最終日", { time: "17:00" }),
        ],
        sourceUrls: [
          "https://www.juntendo.ac.jp/admission/exam/nyushi/med/exam_info/boshu_youkou.html",
          "https://www.juntendo.ac.jp/assets/2027_Juntendo_Med_GakuseiBoshuYoukou_Kokusai.pdf",
        ],
        note: "第二次選考はEJU（第1回または第2回の1回）か共通テスト（2日間）を出願時に選択します。二次試験免除は、IB最終40点以上、AレベルA*・A・A以上、SAT 1450以上と所定のAP／EJU、またはACT 33以上等が条件です。面接受験時間は10月2日12:00に発表されます。入学検定料は出願登録後2日以内、かつ出願期間内の納入が必要です。手続期間の開始は、免除者が11月1日12:00、免除見込み者の条件充足時が1月25日12:00、通常合格者が2月10日12:00です。",
      }),
      route({
        id: "ib-cambridge",
        officialName: "国際バカロレア／ケンブリッジ・インターナショナル選抜（総合型選抜）",
        category: "ib",
        quota: "2名",
        publicationStatus: "complete",
        currentStudentEligible: "conditional",
        eligibility: "IB Diplomaを取得済みまたは2027年3月31日までに取得見込みで、物理・化学・生物のうち1科目以上と数学を履修する者、または国際／GCE Aレベルを修了済みまたは同日までに修了見込みで、3科目中に同理科1科目以上と数学を含む者。あわせて日本の大学入学資格を満たすこと",
        exclusive: "併願可",
        principalRecommendation: "不要",
        gradeRequirement: "通常出願ではIB・Aレベルの総合点下限なし。指定理科・数学の履修に加え、TOEFL iBT新4.0／旧72、IELTS 5.5、英検2304、TEAP 309、GTEC CBT 1180、ケンブリッジ英語160のいずれかを必須",
        restrictions: [
          "IB Diplomaまたは国際／GCE Aレベルの資格・取得見込み",
          "指定理科と数学の履修",
          "国際臨床医・研究医選抜3方式から1方式のみ出願可",
          "日本の教育制度による高校卒業・卒業見込み者は共通テスト必須",
          "外国教育制度の学校卒業・修了見込み者は共通テストまたはEJUを選択",
        ],
        events: [
          event("application-start", "2026-09-01", "出願開始"),
          event("application-deadline", "2026-09-17", "Web出願登録・入学検定料納入期限"),
          event("application-deadline", "2026-09-17", "出願書類締切", { deadlineRule: "必着" }),
          event("first-exam", "2026-10-13", "一次試験（小論文・英作文）", { time: "14:30～16:30", sequence: 1, choiceRule: "2日間とも受験" }),
          event("first-exam", "2026-10-14", "一次試験（面接）", { sequence: 2, choiceRule: "2日間とも受験" }),
          event("first-result", "2026-11-01", "一次試験合格発表", { time: "12:00" }),
          event("final-result", "2026-11-01", "二次試験免除者合格発表", { time: "12:00" }),
          event("second-exam", "2026-06-21", "日本留学試験（第1回）", { sequence: 1, choiceRule: "EJUを選ぶ場合は第1回または第2回から1回を選択" }),
          event("second-exam", "2026-11-08", "日本留学試験（第2回）", { sequence: 2, choiceRule: "EJUを選ぶ場合は第1回または第2回から1回を選択" }),
          event("application-deadline", "2026-11-13", "EJU第2回受験票写し提出期限（利用者のみ）"),
          event("application-deadline", "2026-12-23", "共通テスト成績請求チケット提出期限（利用者のみ）"),
          event("application-deadline", "2027-01-14", "IB取得見込みの一次合格者 最終6科目成績証明書発送期限"),
          event("second-exam", "2027-01-16", "大学入学共通テスト1日目", { sequence: 1, choiceRule: "共通テストを選ぶ場合は2日間とも受験" }),
          event("second-exam", "2027-01-17", "大学入学共通テスト2日目", { sequence: 2, choiceRule: "共通テストを選ぶ場合は2日間とも受験" }),
          event("procedure-deadline", "2026-11-06", "二次試験免除者 入学手続期間最終日", { time: "17:00" }),
          event("procedure-deadline", "2027-01-29", "二次試験免除見込み者 入学手続期間最終日", { time: "17:00" }),
          event("final-result", "2027-02-10", "二次試験合格発表", { time: "12:00" }),
          event("procedure-deadline", "2027-02-18", "二次試験合格者 入学手続期間最終日", { time: "17:00" }),
        ],
        sourceUrls: [
          "https://www.juntendo.ac.jp/admission/exam/nyushi/med/exam_info/boshu_youkou.html",
          "https://www.juntendo.ac.jp/assets/2027_Juntendo_Med_GakuseiBoshuYoukou_Kokusai.pdf",
        ],
        note: "二次試験免除は、IB最終40点以上、AレベルA*・A・A以上、SAT 1450以上と所定のAP／EJU、またはACT 33以上等が条件です。面接受験時間は10月2日12:00に発表されます。入学検定料は出願登録後2日以内、かつ出願期間内の納入が必要です。手続期間の開始は、免除者が11月1日12:00、免除見込み者の条件充足時が1月25日12:00、通常合格者が2月10日12:00です。",
      }),
    ],
    excludedRoutes: [
      "東京都地域枠選抜は一般選抜相当の地域枠として対象外",
      "新潟県地域枠選抜は一般選抜相当の地域枠として対象外",
      "千葉県地域枠選抜は一般選抜相当の地域枠として対象外",
      "埼玉県地域枠選抜は一般選抜相当の地域枠として対象外",
      "静岡県地域枠選抜は一般選抜相当の地域枠として対象外",
      "茨城県地域枠選抜は一般選抜相当の地域枠として対象外",
      "群馬県地域枠選抜は一般選抜相当の地域枠として対象外",
    ],
  }),
  university({
    id: "showa-medical",
    name: "昭和医科大学",
    region: "関東",
    prefecture: "東京都",
    strategyPath: "/showa-university-medicine-strategy2027/",
    scopeStatus: "available",
    publicationStatus: "complete",
    statusNote: "学校推薦型選抜入試（公募・指定校・特別協定校）と卒業生推薦入試を掲載しています。指定校・特別協定校の詳細は対象高校に案内されます。",
    officialUrl: "https://adm.showa-u.ac.jp/admission/info/web-apply.html",
    routes: [
      route({
        id: "school-recommendation",
        officialName: "学校推薦型選抜入試（公募・指定校・特別協定校）",
        category: "recommendation",
        quota: "17名",
        publicationStatus: "complete",
        currentStudentEligible: true,
        eligibility: "2027年3月卒業見込みの現役生、または認定在外教育施設を所定期間に修了・修了見込みで、公募は学校長推薦を受ける者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "公募は全体の評定平均4.3以上（高校1年～3年1学期・前期、中等教育学校4年～6年1学期・前期）。指定校・特別協定校は対象高校へ通知",
        restrictions: ["合格した場合は入学を確約", "卒業生推薦入試との併願不可", "指定校・特別協定校の資格は対象高校へ別途通知"],
        events: [
          event("application-start", "2026-11-01", "Web出願登録開始", { time: "10:00" }),
          event("application-deadline", "2026-11-08", "Web出願登録締切", { time: "16:00", deadlineRule: "Web登録" }),
          event("application-deadline", "2026-11-08", "出願書類締切", { deadlineRule: "必着" }),
          event("first-exam", "2026-11-14", "試験（基礎学力試験・小論文・面接）", { time: "8:30～（入場7:30～8:00）" }),
          event("final-result", "2026-12-01", "合格発表", { time: "15:00" }),
          event("procedure-deadline", "2026-12-08", "入学手続締切", { time: "12:00", deadlineRule: "必着" }),
        ],
        sourceUrls: [
          "https://adm.showa-u.ac.jp/albums/abm.php?d=2405&f=abm00072419.pdf",
          "https://adm.showa-u.ac.jp/admission/info/web-apply.html",
          "https://adm.showa-u.ac.jp/admission/info/schedule.html",
        ],
        note: "大学入学共通テストは利用しません。基礎学力試験、小論文、面接を同日に実施します。入学検定料は出願登録時に指定される期限までに支払い、入学手続期間は2026年12月1日15:00～12月8日12:00です。",
      }),
      route({
        id: "graduate-recommendation",
        officialName: "卒業生推薦入試",
        category: "special",
        quota: "10名",
        publicationStatus: "complete",
        currentStudentEligible: true,
        eligibility: "2027年3月までの高校卒業・12年課程修了等の見込み者で、祖父母または両親のいずれかが本学の医・歯・薬・保健医療学部または昭和大学医療短期大学の卒業生である者",
        exclusive: "専願",
        principalRecommendation: "不要",
        gradeRequirement: "評定の数値基準なし（調査書は提出）",
        restrictions: [
          "合格した場合は入学を確約",
          "学校推薦型選抜入試との併願不可",
          "法定血族の場合は2024年3月31日以前に養子縁組",
          "本学の卒業証明書と卒業生との続柄を示す公的証明書が必要",
        ],
        events: [
          event("application-deadline", "2026-10-30", "個別入学資格審査申請期限（該当者のみ）", {
            deadlineRule: "必着",
            choiceRule: "外国の高校・中等教育学校に在籍した該当者のみ",
          }),
          event("application-start", "2026-11-01", "Web出願登録開始", { time: "10:00" }),
          event("application-deadline", "2026-11-08", "Web出願登録締切", { time: "16:00", deadlineRule: "Web登録" }),
          event("application-deadline", "2026-11-08", "出願書類締切", { deadlineRule: "必着" }),
          event("first-exam", "2026-11-14", "試験（基礎学力試験・小論文・面接）", { time: "8:30～（入場7:30～8:00）" }),
          event("final-result", "2026-12-01", "合格発表", { time: "15:00" }),
          event("procedure-deadline", "2026-12-08", "入学手続締切", { time: "12:00", deadlineRule: "必着" }),
        ],
        sourceUrls: [
          "https://adm.showa-u.ac.jp/albums/abm.php?d=2405&f=abm00072419.pdf",
          "https://adm.showa-u.ac.jp/admission/info/web-apply.html",
          "https://adm.showa-u.ac.jp/admission/info/schedule.html",
        ],
        note: "大学入学共通テストは利用しません。基礎学力試験、小論文、面接を同日に実施します。入学検定料は出願登録時に指定される期限までに支払い、入学手続期間は2026年12月1日15:00～12月8日12:00です。",
      }),
    ],
    excludedRoutes: ["医学部地域枠選抜は実質的に一般選抜として実施されるため対象外"],
  }),
  university({
    id: "teikyo",
    name: "帝京大学",
    region: "関東",
    prefecture: "東京都",
    strategyPath: "/teikyo-university-entrance-exam-measures2027/",
    scopeStatus: "available",
    publicationStatus: "complete",
    statusNote: "2027年度の完成版要項で総合型・学校推薦型（公募制）を確認。総合型は独自の一次選考後、二次選考で共通テストを利用します。",
    officialUrl: "https://www.teikyo-u.ac.jp/applicants/faculty/medicine_d",
    routes: [
      route({
        id: "comprehensive",
        officialName: "総合型選抜",
        category: "comprehensive",
        quota: "10名",
        publicationStatus: "complete",
        currentStudentEligible: true,
        eligibility: "高等学校または中等教育学校を2026年3月に卒業した者、または2027年3月卒業見込みの者で、実習を含む6年間の医学教育に適応できる者",
        exclusive: "併願可",
        principalRecommendation: "不要",
        gradeRequirement: "学習成績の状況に数値基準なし（調査書等は面接資料として使用）",
        restrictions: [
          "募集対象者A〜D（医学への志望、他分野での活動、国際的コミュニケーション、社会奉仕・スポーツ・芸術等）のいずれかに該当",
          "二次選考は大学入学共通テストの英語必須・数学1科目・理科2科目を利用",
          "本学の学校推薦型選抜（指定校制）を除く本学入試および他大学と併願可",
        ],
        events: [
          event("application-start", "2026-09-28", "Web出願開始", { time: "9:00" }),
          event("application-deadline", "2026-10-07", "Web出願登録締切", { time: "16:30", deadlineRule: "Web登録" }),
          event("application-deadline", "2026-10-07", "入学検定料納入締切", { time: "16:30" }),
          event("application-deadline", "2026-10-07", "出願書類締切", { time: "16:30", deadlineRule: "必着" }),
          event("first-exam", "2026-10-17", "一次選考（論述課題・グループディスカッション・面接）", { time: "9:00〜15:30頃" }),
          event("first-result", "2026-11-02", "一次選考合格発表", { time: "11:00" }),
          event("application-start", "2026-12-14", "二次選考 Web出願開始（一次合格者のみ）", { time: "9:00" }),
          event("application-deadline", "2026-12-21", "二次選考 Web出願登録締切", { time: "16:30", deadlineRule: "Web登録" }),
          event("second-exam", "2027-01-16", "大学入学共通テスト（英語）", { time: "15:20〜18:20", sequence: 1, choiceRule: "指定科目受験のため2日間とも受験" }),
          event("second-exam", "2027-01-17", "大学入学共通テスト（理科2科目・数学1科目）", { time: "9:30〜16:10", sequence: 2, choiceRule: "指定科目受験のため2日間とも受験" }),
          event("final-result", "2027-02-13", "最終合格発表", { time: "11:00" }),
          event("procedure-deadline", "2027-02-19", "入学手続締切"),
        ],
        sourceUrls: [
          "https://www.teikyo-u.ac.jp/application/files/4017/8409/4615/01_2027.pdf",
          "https://www.teikyo-u.ac.jp/applicants/faculty/medicine_d",
          "https://www.teikyo-u.ac.jp/applicants/download",
          "https://www.dnc.ac.jp/kyotsu/shiken_jouhou/r9/index.html",
        ],
        note: "一次選考合格者は二次選考のWeb出願登録と共通テスト成績請求情報の提供が必要です。紙の成績請求チケットと追加の入学検定料は不要です。入学手続締切日までに納入金を本学へ着金させる必要があります。",
      }),
      route({
        id: "recommendation-public",
        officialName: "学校推薦型選抜（公募制）",
        category: "recommendation",
        quota: "15名",
        publicationStatus: "complete",
        currentStudentEligible: true,
        eligibility: "高等学校または中等教育学校を2027年3月卒業見込みで、実習を含む6年間の医学教育に適応でき、高等学校長または中等教育学校長から推薦された者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "最終学年第1学期までの調査書全体の学習成績の状況4.0以上（二期制で第3学年前期入りの調査書を提出できない場合は第2学年後期まで）",
        restrictions: ["合格した場合に入学を確約", "大学入学共通テストは利用しない"],
        events: [
          event("application-start", "2026-11-02", "Web出願開始", { time: "9:00" }),
          event("application-deadline", "2026-11-11", "Web出願登録締切", { time: "16:30", deadlineRule: "Web登録" }),
          event("application-deadline", "2026-11-11", "入学検定料納入締切", { time: "16:30" }),
          event("application-deadline", "2026-11-11", "出願書類締切", { time: "16:30", deadlineRule: "必着" }),
          event("first-exam", "2026-11-21", "試験（基礎能力適性検査・小論文・面接・書類審査）", { time: "8:30〜17:00頃" }),
          event("final-result", "2026-12-01", "合格発表", { time: "11:00" }),
          event("procedure-deadline", "2026-12-09", "入学手続締切"),
        ],
        sourceUrls: [
          "https://www.teikyo-u.ac.jp/application/files/4017/8409/4615/01_2027.pdf",
          "https://www.teikyo-u.ac.jp/applicants/faculty/medicine_d",
          "https://www.teikyo-u.ac.jp/applicants/download",
          "https://www.teikyo-u.ac.jp/application/files/4317/8409/6891/dl_02-1_2027.pdf",
        ],
        note: "英語・数学・理科1科目の基礎能力適性検査、小論文、個人面接、書類審査により同日で選考します。申請者は英語外部試験の結果も合否判定で考慮されます。入学手続締切日までに納入金を本学へ着金させる必要があります。",
      }),
    ],
    excludedRoutes: [
      "一般選抜（各特別地域枠を含む）は対象外。各県の特別地域枠は一般選抜の募集人員に含まれる",
      "大学入学共通テスト利用選抜は通常の共通テスト利用方式のため対象外",
    ],
  }),
  university({
    id: "tokyo-medical",
    name: "東京医科大学",
    region: "関東",
    prefecture: "東京都",
    strategyPath: "/tokyo-university-medicine-strategy2027/",
    scopeStatus: "available",
    publicationStatus: "partial",
    statusNote: "2027年度募集要項で対象7方式を確認。4県地域枠は入学定員増員認可申請中で、募集人員・内容が変更される場合があります。",
    officialUrl: tokyoMedicalAdmissionsDownloadUrl,
    routes: [
      route({
        id: "recommendation-public",
        officialName: "学校推薦型選抜（一般公募）",
        category: "recommendation",
        quota: "20名以内",
        publicationStatus: "complete",
        currentStudentEligible: true,
        eligibility: "高等学校等、12年の学校教育、指定在外教育施設または専修学校高等課程を2026年4月1日から2027年3月31日までに卒業（修了）または卒業（修了）見込みで、学校長推薦等の要件を満たす者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "調査書全体の学習成績の状況4.0以上（2027年3月卒業見込み者は第3学年第1学期まで）",
        restrictions: [
          "合格した場合に入学を確約し、入学前準備教育を受講して課題を提出",
          "同一高等学校等から2名以内",
          "県地域枠・全国ブロック別または英語検定試験利用との学内併願可",
          "大学入学共通テストは利用しない",
        ],
        events: tokyoMedicalStandardSchedule,
        sourceUrls: tokyoMedicalRecommendationSources,
        note: "基礎学力検査、日本語・英語小論文、個人面接、書類審査により11月28日の一段階で選考します。入学手続期間は12月3日10:00から12月10日12:00までです。",
      }),
      route({
        id: "recommendation-ibaraki",
        officialName: "学校推薦型選抜（茨城県地域枠）",
        category: "regional",
        quota: "8名以内",
        publicationStatus: "partial",
        currentStudentEligible: true,
        eligibility: "高等学校等、12年の学校教育、指定在外教育施設または専修学校高等課程を2025年4月1日から2027年3月31日までに卒業（修了）または卒業（修了）見込みで、茨城県地域医療医師修学資金等の要件を満たす者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "調査書全体の学習成績の状況4.0以上（2027年3月卒業見込み者は第3学年第1学期まで）",
        restrictions: [
          "出身地・高等学校等の所在地は不問",
          "出願前に茨城県の修学資金へ応募し、県実施のeラーニングを受講",
          "医師免許取得後、臨床研修を含む9年間を県指定医療機関で勤務",
          "4県地域枠相互・英語検定試験利用とは併願不可。一般公募・全国ブロック別とは併願可",
          "一般公募との併願者は2026年4月1日以降の卒業（修了）者等に限り、同一校の一般公募専願と合わせ2名以内",
          "入学定員増員認可申請予定。大学入学共通テストは利用しない",
        ],
        events: tokyoMedicalStandardSchedule,
        sourceUrls: tokyoMedicalRegionalSources,
        note: "合格後は茨城県のキャリア形成プログラムに基づく契約を締結し、入学後は地域医療リーダーズコースを受講します。選考と入学手続期間は一般公募と同じです。",
      }),
      route({
        id: "recommendation-niigata",
        officialName: "学校推薦型選抜（新潟県地域枠）",
        category: "regional",
        quota: "3名以内",
        publicationStatus: "partial",
        currentStudentEligible: true,
        eligibility: "高等学校等、12年の学校教育、指定在外教育施設または専修学校高等課程を2025年4月1日から2027年3月31日までに卒業（修了）または卒業（修了）見込みで、新潟県地域枠の要件を満たす者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "調査書全体の学習成績の状況4.0以上（2027年3月卒業見込み者は第3学年第1学期まで）",
        restrictions: [
          "出身地・高等学校等の所在地は不問",
          "新潟県修学資金を受給し、在学中は県の卒前支援プランに基づく実習等へ参加",
          "卒業後直ちに県内指定医療機関で9年間勤務し、県のキャリア形成プログラムに従事",
          "4県地域枠相互・英語検定試験利用とは併願不可。一般公募・全国ブロック別とは併願可",
          "一般公募との併願者は2026年4月1日以降の卒業（修了）者等に限り、同一校の一般公募専願と合わせ2名以内",
          "入学定員増員認可申請予定。大学入学共通テストは利用しない",
        ],
        events: tokyoMedicalStandardSchedule,
        sourceUrls: tokyoMedicalRegionalSources,
        note: "合格時に入学を確約し、入学前準備教育と入学後の地域医療リーダーズコースを受講します。選考と入学手続期間は一般公募と同じです。",
      }),
      route({
        id: "recommendation-saitama",
        officialName: "学校推薦型選抜（埼玉県地域枠）",
        category: "regional",
        quota: "2名以内",
        publicationStatus: "partial",
        currentStudentEligible: true,
        eligibility: "高等学校等、12年の学校教育、指定在外教育施設または専修学校高等課程を2025年4月1日から2027年3月31日までに卒業（修了）または卒業（修了）見込みで、埼玉県地域枠の要件を満たす者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "調査書全体の学習成績の状況4.0以上（2027年3月卒業見込み者は第3学年第1学期まで）",
        restrictions: [
          "出身地・高等学校等の所在地は不問",
          "埼玉県奨学金の受給を希望し、県のキャリア形成プログラムに基づく診療に従事",
          "医師免許取得後、特定地域の公的医療機関等または特定・準特定診療科で勤務する意思が必要",
          "4県地域枠相互・英語検定試験利用とは併願不可。一般公募・全国ブロック別とは併願可",
          "一般公募との併願者は2026年4月1日以降の卒業（修了）者等に限り、同一校の一般公募専願と合わせ2名以内",
          "入学定員増員認可申請予定。大学入学共通テストは利用しない",
        ],
        events: tokyoMedicalStandardSchedule,
        sourceUrls: tokyoMedicalRegionalSources,
        note: "合格時に入学を確約し、入学前準備教育と入学後の地域医療リーダーズコースを受講します。選考と入学手続期間は一般公募と同じです。",
      }),
      route({
        id: "recommendation-gunma",
        officialName: "学校推薦型選抜（群馬県地域枠）",
        category: "regional",
        quota: "2名以内",
        publicationStatus: "partial",
        currentStudentEligible: true,
        eligibility: "高等学校等、12年の学校教育、指定在外教育施設または専修学校高等課程を2025年4月1日から2027年3月31日までに卒業（修了）または卒業（修了）見込みで、群馬県地域枠の要件を満たす者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "調査書全体の学習成績の状況4.0以上（2027年3月卒業見込み者は第3学年第1学期まで）",
        restrictions: [
          "出身地・高等学校等の所在地は不問",
          "群馬県修学資金の貸与を希望し、ぐんま地域医療リーダー養成キャリアパスへ参加",
          "医師免許取得後、臨床研修を含む10年間を県内指定病院で勤務",
          "4県地域枠相互・英語検定試験利用とは併願不可。一般公募・全国ブロック別とは併願可",
          "一般公募との併願者は2026年4月1日以降の卒業（修了）者等に限り、同一校の一般公募専願と合わせ2名以内",
          "入学定員増員認可申請予定。大学入学共通テストは利用しない",
        ],
        events: tokyoMedicalStandardSchedule,
        sourceUrls: tokyoMedicalRegionalSources,
        note: "臨床研修後の4年以上は医師不足地域または不足診療科で勤務すること等が求められます。選考と入学手続期間は一般公募と同じです。",
      }),
      route({
        id: "recommendation-english",
        officialName: "学校推薦型選抜（英語検定試験利用）",
        category: "recommendation",
        quota: "3名以内",
        publicationStatus: "complete",
        currentStudentEligible: true,
        eligibility: "高等学校等、12年の学校教育、指定在外教育施設または専修学校高等課程を2025年4月1日から2027年3月31日までに卒業（修了）または卒業（修了）見込みで、学校長推薦とCEFR B1以上の英語資格基準等を満たす者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "調査書全体の学習成績の状況4.0以上（2027年3月卒業見込み者は第3学年第1学期まで）。出願締切日から2年以内に取得したCEFR B1以上の指定英語資格が必要",
        restrictions: [
          "一般公募とのみ学内併願可。両方式に合格した場合は英語検定試験利用で入学",
          "一般公募との併願者は2026年4月1日以降の卒業（修了）者等に限り、同一校の一般公募専願と合わせ2名以内",
          "入学後はUSMLE受験準備コースまたはリサーチ・コースを受講",
          "大学入学共通テストは利用しない",
        ],
        events: tokyoMedicalEnglishSchedule,
        sourceUrls: tokyoMedicalRecommendationSources,
        note: "英語小論文の代わりに指定英語資格の得点を評価し、基礎学力検査、日本語小論文、個人面接、書類審査により11月28日の一段階で選考します。入学手続期間は12月3日10:00から12月10日12:00までです。",
      }),
      route({
        id: "recommendation-national-block",
        officialName: "全国ブロック別学校推薦型選抜",
        category: "recommendation",
        quota: "12名以内（6ブロック各2名以内）",
        publicationStatus: "complete",
        currentStudentEligible: true,
        eligibility: "高等学校等、12年の学校教育、指定在外教育施設または専修学校高等課程を2025年4月1日から2027年3月31日までに卒業（修了）または卒業（修了）見込みで、学校長推薦と高校所在地または保護者居住地のブロック条件等を満たす者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "調査書全体の学習成績の状況4.0以上（2027年3月卒業見込み者は第3学年第1学期まで）",
        restrictions: [
          "高校所在地または出願締切日時点で保護者が3年以上居住する全国6ブロックのうち1ブロックへ出願",
          "卒後の勤務地・勤務年限の義務なし。入学後は地域医療リーダーズコースを受講",
          "一般公募・4県地域枠とは併願可。英語検定試験利用とは併願不可",
          "一般公募との併願者は2026年4月1日以降の卒業（修了）者等に限り、同一校の一般公募専願と合わせ2名以内",
          "大学入学共通テストは利用しない",
        ],
        events: tokyoMedicalNationalBlockSchedule,
        sourceUrls: tokyoMedicalRecommendationSources,
        note: "11月28日の基礎学力検査・日本語英語小論文で面接受験者を選び、基準点到達者のみ12月12日のMMIを受験します。入学手続期間は12月17日10:00から12月24日12:00までです。",
      }),
    ],
    excludedRoutes: [
      "一般選抜・共通テスト利用選抜は対象外",
      "学士選抜は国内大学卒業（見込み）等が要件で、2027年3月高校卒業見込み者は出願できないため対象外",
    ],
  }),
  university({
    id: "jikei",
    name: "東京慈恵会医科大学",
    region: "関東",
    prefecture: "東京都",
    strategyPath: "/jikei-medical-entrance-exam2027-strategy/",
    scopeStatus: "not-offered",
    publicationStatus: "not-offered",
    statusNote: "2027年度医学科の公式概要で確認できるのは一般選抜で、本ページの対象方式は確認できません。",
    officialUrl: "https://www.jikei.ac.jp/university/medicine/admission/summary/",
    routes: [],
    excludedRoutes: ["医学科一般選抜は対象外"],
  }),
  university({
    id: "tokyo-womens-medical",
    name: "東京女子医科大学",
    region: "関東",
    prefecture: "東京都",
    strategyPath: "/twmu-medicine-exam-guide-2027/",
    scopeStatus: "available",
    publicationStatus: "partial",
    statusNote:
      "2026年8月4日更新の2027年度完成版要項で対象3方式を確認。外国医療人人材育成促進事業は日程のみ公表され、出願資格・選考方法等の詳細は別途公表待ちです。",
    officialUrl: "https://www.twmu-u.jp/wp-content/uploads/2026/08/30cfa9d6198a1f4ca4a002eee2df2651.pdf",
    routes: [
      route({
        id: "comprehensive",
        officialName: "総合型選抜（一般枠）",
        category: "comprehensive",
        quota: "約19名",
        publicationStatus: "complete",
        currentStudentEligible: true,
        eligibility:
          "高等学校等・12年課程・所定の外国学校課程を2022年3月以降に卒業・修了した者、または2027年3月までに卒業・修了見込みの者。IB資格も同期間で対象",
        exclusive: "専願",
        principalRecommendation: "不要",
        gradeRequirement:
          "第3学年1学期・前期まで、または卒業時の全体の学習成績の状況3.8以上（IB資格は出願時の総合点34点以上）",
        restrictions: [
          "女子に限る",
          "2027年4月1日までに18歳に達する者",
          "外国学校課程等の資格者は2026年8月31日までに事前相談・書類提出",
          "他大学との併願不可",
          "入学前教育の受講・課題提出",
          "共通テストは利用しない",
        ],
        events: [
          event("application-deadline", "2026-08-31", "外国学校課程等の出願資格事前相談書類提出期限"),
          event("application-start", "2026-09-16", "出願開始（Web登録・検定料支払・郵送受付）"),
          event("application-deadline", "2026-09-28", "Web出願登録締切", {
            time: "23:00",
            deadlineRule: "Web登録",
          }),
          event("application-deadline", "2026-09-28", "入学検定料支払締切", { time: "23:00" }),
          event("application-deadline", "2026-09-30", "出願書類締切", { deadlineRule: "必着" }),
          event("first-exam", "2026-10-18", "第1次試験（思考力試験・小論文）", {
            time: "8:40集合、9:00～12:10",
            sequence: 1,
          }),
          event("first-result", "2026-10-27", "第1次試験合格発表", { time: "14:00" }),
          event("second-exam", "2026-10-31", "第2次試験（プレゼンテーションを含む個人面接）", {
            sequence: 2,
            choiceRule: "第1次試験合格者のみ。集合時刻は第1次試験合格発表時に通知",
          }),
          event("final-result", "2026-11-06", "最終合格発表", { time: "14:00" }),
          event("procedure-deadline", "2026-11-17", "入学手続締切", {
            time: "16:00",
            deadlineRule: "必着",
          }),
        ],
        sourceUrls: [
          "https://www.twmu-u.jp/wp-content/uploads/2026/08/30cfa9d6198a1f4ca4a002eee2df2651.pdf",
          "https://www.twmu-u.jp/wp-content/uploads/2026/08/4ce351a52448d061c7add286862b2e9b.pdf",
          "https://www.twmu-u.jp/medical-ent-suisen/",
        ],
        note:
          "第1次は思考力試験・小論文、第2次はプレゼンテーションを含む個人面接。提出書類と両試験を総合して判定します。",
      }),
      route({
        id: "foreign-healthcare-human-resources",
        officialName: "総合型選抜（外国医療人人材育成促進事業）",
        category: "comprehensive",
        quota: "最大1名",
        publicationStatus: "partial",
        currentStudentEligible: "conditional",
        eligibility: "ASEAN地域の大学の医学部に在籍する女子。詳細な出願資格は別途大学ホームページで告知予定",
        exclusive: "未公表",
        principalRecommendation: "未公表",
        gradeRequirement: "未公表",
        restrictions: [
          "女子に限る",
          "ASEAN地域の大学医学部在籍者のみ",
          "詳細な出願資格・選考方法は別途大学ホームページで告知予定",
          "2027年度は共通テストを利用しない",
        ],
        events: [
          event("application-start", "2026-10-01", "出願開始"),
          event("application-deadline", "2026-10-20", "出願締切"),
          event("first-exam", "2026-10-26", "試験（10月26日～11月4日の間で受験生と調整した1日）"),
          event("final-result", "2026-11-06", "合格発表", { time: "14:00（日本時間）" }),
        ],
        sourceUrls: [
          "https://www.twmu-u.jp/wp-content/uploads/2026/08/30cfa9d6198a1f4ca4a002eee2df2651.pdf",
          "https://www.twmu-u.jp/wp-content/uploads/2026/08/4ce351a52448d061c7add286862b2e9b.pdf",
          "https://www.twmu-u.jp/medical-ent-suisen/",
        ],
        note:
          "募集人員と出願・試験・合格発表の日程のみ公表済みです。専願・推薦・評定条件、選考内容、入学手続期限は別途告知を確認してください。",
      }),
      route({
        id: "school-recommendation",
        officialName: "学校推薦型選抜（一般推薦）",
        category: "recommendation",
        quota: "約40名",
        publicationStatus: "complete",
        currentStudentEligible: true,
        eligibility:
          "高等学校等・12年課程・所定の外国学校課程を2026年3月に卒業・修了した者、または2027年3月までに卒業・修了見込みの者で、出身学校長の推薦がある者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "第3学年1学期・前期まで、または卒業時の全体の学習成績の状況4.0以上",
        restrictions: [
          "女子に限る",
          "英語・数学IIIを含む所定の数学・理科2科目を単位修得または修得見込み",
          "高等学校等で課外活動に積極的に参加し、諸行事で重要な役割を果たした者",
          "外国学校課程等の資格者は2026年9月30日までに事前相談・書類提出",
          "他大学との併願不可",
          "入学前教育の受講・課題提出",
          "共通テストは利用しない",
        ],
        events: [
          event("application-deadline", "2026-09-30", "外国学校課程等の出願資格事前相談書類提出期限"),
          event("application-start", "2026-11-02", "出願開始（Web登録・検定料支払・郵送受付）"),
          event("application-deadline", "2026-11-10", "Web出願登録締切", {
            time: "23:00",
            deadlineRule: "Web登録",
          }),
          event("application-deadline", "2026-11-10", "入学検定料支払締切", { time: "23:00" }),
          event("application-deadline", "2026-11-12", "出願書類締切", { deadlineRule: "必着" }),
          event("first-exam", "2026-11-21", "選考1日目（思考力試験・小論文・小グループ討論）", {
            time: "8:40集合、9:00～17:30頃",
            sequence: 1,
            choiceRule: "2日間とも受験",
          }),
          event("first-exam", "2026-11-22", "選考2日目（個人面接）", {
            sequence: 2,
            choiceRule: "2日間とも受験。集合時刻は1日目に通知",
          }),
          event("final-result", "2026-12-04", "合格発表", { time: "14:00" }),
          event("procedure-deadline", "2026-12-15", "入学手続締切", {
            time: "16:00",
            deadlineRule: "必着",
          }),
        ],
        sourceUrls: [
          "https://www.twmu-u.jp/wp-content/uploads/2026/08/30cfa9d6198a1f4ca4a002eee2df2651.pdf",
          "https://www.twmu-u.jp/wp-content/uploads/2026/08/4ce351a52448d061c7add286862b2e9b.pdf",
          "https://www.twmu-u.jp/medical-ent-suisen/",
        ],
        note:
          "思考力試験・小論文・小グループ討論・個人面接と提出書類を総合して判定する一段階選抜です。",
      }),
    ],
    excludedRoutes: ["一般選抜（地域枠を含む）は対象外"],
  }),
  university({
    id: "toho",
    name: "東邦大学",
    region: "関東",
    prefecture: "東京都",
    strategyPath: "/tohoi-university-entrance-exam-measures2027/",
    scopeStatus: "available",
    publicationStatus: "partial",
    statusNote:
      "2027年度公式情報で対象5方式を確認。千葉県・新潟県の推薦地域枠は設置認可構想中で、医学部の2027年度完成版募集要項は作成中です。",
    officialUrl: tohoAdmissionsOverviewUrl,
    routes: [
      route({
        id: "comprehensive",
        officialName: "総合入試",
        category: "comprehensive",
        quota: "約10名",
        publicationStatus: "partial",
        currentStudentEligible: true,
        eligibility:
          "高等学校・中等教育学校・所定の在外教育施設を2026年3月に卒業した者、または2027年3月卒業見込みの者",
        exclusive: "専願",
        principalRecommendation: "不要",
        gradeRequirement:
          "全体の学習成績の状況3.8以上、かつ数学・理科の学習成績の状況がそれぞれ4.0以上（卒業見込み者は高校3年1学期まで）",
        restrictions: [
          "合格した場合は入学を確約",
          "同窓生子女入試・推薦入試（付属校制）との併願不可",
          "共通テストは利用しない",
        ],
        events: tohoPublishedSchedule,
        sourceUrls: ["https://www.toho-u.ac.jp/med/info_exam/sogo.html", ...tohoPublishedSources],
        note:
          "第1次は出願書類・適性試験・基礎学力、第2次は面接で選考します。基礎学力は70分、面接は約30分です。",
      }),
      route({
        id: "alumni-children",
        officialName: "同窓生子女入試",
        category: "comprehensive",
        quota: "約5名",
        publicationStatus: "partial",
        currentStudentEligible: true,
        eligibility:
          "高等学校・中等教育学校・所定の在外教育施設を2022年3月以降に卒業した者、または2027年3月卒業見込みで、本学医学部卒業生の血族2親等までの者",
        exclusive: "専願",
        principalRecommendation: "不要",
        gradeRequirement: "2027年度公式情報に数値基準の記載なし",
        restrictions: [
          "法定血族は2024年4月1日以前に養子縁組していること",
          "建学の精神に則り社会に貢献できる医師となる資質を有し、合格時に入学を確約",
          "総合入試・推薦入試（付属校制）との併願不可",
          "共通テストは利用しない",
        ],
        events: tohoPublishedSchedule,
        sourceUrls: ["https://www.toho-u.ac.jp/med/info_exam/doso.html", ...tohoPublishedSources],
        note:
          "第1次は出願書類・適性試験・基礎学力、第2次は面接で選考します。基礎学力は70分、面接は約30分です。",
      }),
      route({
        id: "affiliated-school",
        officialName: "推薦入試（付属校制）",
        category: "designated",
        quota: "約20名",
        publicationStatus: "partial",
        currentStudentEligible: "conditional",
        eligibility:
          "東邦大学付属東邦高等学校または駒場東邦高等学校から推薦された者。詳細な出願資格は各付属校へ通知",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "対象校へ通知",
        restrictions: [
          "東邦大学付属東邦高等学校・駒場東邦高等学校のみ",
          "出願・合格発表は学校長を経由",
          "合格した場合は入学を確約",
          "総合入試・同窓生子女入試との併願不可",
          "共通テストは利用しない",
        ],
        events: [
          event("first-exam", "2026-11-20", "第1次試験", { sequence: 1 }),
          event("second-exam", "2026-12-05", "第2次試験", {
            choiceRule: "第1次試験合格者のみ",
            sequence: 2,
          }),
          event("procedure-deadline", "2026-12-15", "入学手続期限"),
        ],
        sourceUrls: [
          "https://www.toho-u.ac.jp/med/info_exam/fuzoku.html",
          tohoAdmissionsOverviewUrl,
          tohoAdmissionsGuideStatusUrl,
        ],
        note:
          "出願書類・適性試験・基礎学力・面接で選考します。出願日、合格発表日、評定等の詳細は対象校を通じて確認してください。",
      }),
      ...[
        ["chiba-regional", "推薦入試（公募制－千葉県地域枠）", "千葉県", "3名"],
        ["niigata-regional", "推薦入試（公募制－新潟県地域枠）", "新潟県", "5名"],
      ].map(([id, officialName, prefecture, quota]) => route({
        id,
        officialName,
        category: "regional",
        quota,
        publicationStatus: "partial",
        currentStudentEligible: true,
        eligibility:
          "高等学校・中等教育学校・所定の在外教育施設を2022年3月以降に卒業した者、または2027年3月卒業見込みの者。そのほかの出願資格は2027年度募集要項待ち",
        exclusive: "未公表",
        principalRecommendation: "未公表",
        gradeRequirement: "未公表",
        restrictions: [
          `${prefecture}地域枠（募集人員は設置認可構想中）`,
          "推薦・地域・修学資金・卒後勤務等の詳細条件は2027年度募集要項待ち",
          "共通テストは利用しない",
        ],
        events: tohoPublishedSchedule,
        sourceUrls: tohoPublishedSources,
        note:
          "2027年度完成版募集要項は作成中です。前年要項の推薦条件・評定・地域要件・修学資金条件は転用していません。",
      })),
    ],
    excludedRoutes: [
      "一般入試（千葉県・新潟県地域枠を含む）は対象外",
      "統一入試は一般選抜として実施されるため対象外",
    ],
  }),
  university({
    id: "nihon",
    name: "日本大学",
    region: "関東",
    prefecture: "東京都",
    strategyPath: "/nihon-university-entrance-exam-measures2027/",
    scopeStatus: "available",
    publicationStatus: "outline",
    statusNote:
      "2027年度学校推薦型選抜資料と医学部GUIDEBOOK 2027で公募制1方式を確認。詳細募集要項は未公表で、地域枠ページは令和8年度情報のため2027年度データへ転用していません。",
    officialUrl: "https://www.nihon-u.ac.jp/assets/gakkou_i_260518.pdf",
    routes: [
      route({
        id: "recommendation-public",
        officialName: "学校推薦型選抜（公募制）",
        category: "recommendation",
        quota: "10名",
        publicationStatus: "outline",
        currentStudentEligible: true,
        eligibility:
          "高等学校または中等教育学校を2026年3月に卒業した者、または2027年3月卒業見込みの者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement:
          "全体の学習成績の状況4.0以上（2027年3月卒業見込み者は第3学年9月30日まで）",
        restrictions: [
          "医学科を第一志望とし、合格した場合は入学を確約",
          "物理基礎・物理、化学基礎・化学、生物基礎・生物の3組から2組以上を履修",
          "入学前教育を受講し、課題を提出することを確約",
          "共通テストは利用しない",
        ],
        events: [
          event("application-start", "2026-11-17", "出願開始"),
          event("application-deadline", "2026-11-27", "出願締切"),
          event("first-exam", "2026-12-12", "選考日"),
          event("final-result", "2026-12-23", "合格発表", { time: "16:00" }),
          event("procedure-deadline", "2027-01-13", "入学手続締切"),
        ],
        sourceUrls: [
          "https://www.nihon-u.ac.jp/assets/gakkou_i_260518.pdf",
          "https://www.med.nihon-u.ac.jp/resource/pdf/examinee/igakubuGUIDEBOOK2027.pdf",
          "https://www.nihon-u.ac.jp/admission_info/application/general_information/recommendation/",
        ],
        note:
          "選考は1日・一段階で、個人面接、基礎学力検査（数学・英語）、小論文を実施します。出願時刻、必着・消印の別、選考時刻、手続締切時刻は2027年度詳細募集要項の公表待ちです。",
      }),
    ],
    excludedRoutes: [
      "校友枠選抜はN全学統一方式第1期と同じ一次試験を使う実質一般選抜のため対象外",
      "N全学統一方式第1期・第2期と地域枠選抜（一般選抜利用）は一般選抜のため対象外",
      "学校推薦型選抜（公募制・新潟県地域枠／埼玉県地域枠）を含む地域枠情報はGUIDEBOOK 2027でも令和8年度実績のため、2027年度方式として転用しない",
      "2027年度の医学部指定校制・付属校系推薦は公式実施一覧で確認できないため掲載しない",
    ],
  }),
  university({
    id: "nippon-medical",
    name: "日本医科大学",
    region: "関東",
    prefecture: "東京都",
    strategyPath: "/nihonikadaigaku-exam-guide-2027/",
    scopeStatus: "not-offered",
    publicationStatus: "not-offered",
    statusNote: "2027年度完成版要項の全選抜区分を確認しました。掲載対象となる独立した総合型選抜・学校推薦型選抜等はありません。",
    officialUrl: "https://www.nms.ac.jp/college/nyushi-book/pdf_2027/guidelines_2027.pdf",
    routes: [],
    excludedRoutes: [
      "グローバル特別選抜（前期）は公式要項の「一般入学者選抜 概要」に含まれ、共通テスト国語と一般選抜（前期）と同日・同一の英語・数学・理科試験を使うため対象外",
      "一般選抜（前期・後期・地域枠）は一般選抜のため対象外",
    ],
  }),
  university({
    id: "kitasato",
    name: "北里大学",
    region: "関東",
    prefecture: "神奈川県",
    strategyPath: "/kitasato-university-entrance-exam-measures2027/",
    scopeStatus: "available",
    publicationStatus: "partial",
    statusNote: "2027年度入試ガイド・日程一覧で医学科の指定校（38名）・系列校推薦を確認しました。対象校向け要項は8月下旬案内予定で、出願資格・評定・締切等の詳細は対象校への通知のみです。地域枠指定校は実施未定です。",
    officialUrl: kitasatoAdmissionsOverviewUrl,
    routes: [
      route({
        id: "recommendation-designated",
        officialName: "学校推薦型選抜試験（指定校）",
        category: "designated",
        quota: "38名",
        publicationStatus: "partial",
        currentStudentEligible: "unconfirmed",
        eligibility: "大学が指定する学校の生徒。卒業見込み可否等の詳細は対象校へ通知",
        exclusive: "専願",
        principalRecommendation: "未公表",
        gradeRequirement: "対象校へ通知（数値基準は未公表）",
        restrictions: ["指定校のみ", "第1志望・合格時は必ず入学"],
        events: [
          event("application-start", "2026-11-02", "出願受付開始"),
          event("first-exam", "2026-11-15", "試験日"),
        ],
        sourceUrls: [...kitasatoRecommendationSources],
        note: "2027年度対象校向け要項は8月下旬案内予定です。選考は11月15日の1日で、一次・二次には分かれません。出願締切・合格発表・入学手続期限・選考内容は未公表です。",
      }),
      route({
        id: "recommendation-affiliated",
        officialName: "学校推薦型選抜試験（系列校）",
        category: "designated",
        quota: null,
        publicationStatus: "partial",
        currentStudentEligible: "unconfirmed",
        eligibility: "系列校の生徒。卒業見込み可否等の詳細は対象校へ通知",
        exclusive: "専願",
        principalRecommendation: "未公表",
        gradeRequirement: "対象校へ通知（数値基準は未公表）",
        restrictions: ["系列校のみ", "第1志望・合格時は必ず入学"],
        events: [
          event("application-start", "2026-11-02", "出願受付開始"),
          event("first-exam", "2026-11-15", "試験日"),
        ],
        sourceUrls: [...kitasatoRecommendationSources],
        note: "2027年度対象校向け要項は8月下旬案内予定です。選考は11月15日の1日で、一次・二次には分かれません。募集人員・出願締切・合格発表・入学手続期限・選考内容は未公表です。",
      }),
      route({
        id: "regional-designated",
        officialName: "学校推薦型選抜試験（地域枠指定校）",
        category: "regional",
        quota: null,
        publicationStatus: "unpublished",
        currentStudentEligible: "unconfirmed",
        eligibility: "実施する場合は対象の指定校へ通知。卒業見込み可否等の詳細は未公表",
        exclusive: "専願",
        principalRecommendation: "未公表",
        gradeRequirement: "実施する場合は対象校へ通知（数値基準は未公表）",
        restrictions: [
          "2027年度は実施未定",
          "指定校のみ",
          "当該地域の修学資金制度を利用",
          "卒業後は指定地域内の病院で勤務",
          "第1志望・合格時は必ず入学",
        ],
        events: [event("first-exam", "2026-11-15", "試験日（実施する場合）")],
        sourceUrls: [...kitasatoRecommendationSources, kitasatoRegionalProgramUrl],
        note: "2027年度の実施は未定です。公式日程一覧には実施する場合の試験日として11月15日が示されていますが、出願期間・募集人員・選考内容等は公表されていません。",
      }),
    ],
    excludedRoutes: [
      "一般選抜試験（地域枠一般選抜を含む）は一般選抜のため対象外",
      "大学入学共通テスト利用選抜試験（前期・後期）は通常の共通テスト利用選抜のため対象外",
      "医学部学士入学者選抜試験は現役高校生が出願できないため対象外",
    ],
  }),
  university({
    id: "marianna",
    name: "聖マリアンナ医科大学",
    region: "関東",
    prefecture: "神奈川県",
    strategyPath: "/saint-marianna-university-entrance-exam-measures2027/",
    scopeStatus: "available",
    publicationStatus: "complete",
    statusNote: "2027年度完成版要項で、一般公募制は約20名、神奈川県地域枠は7名と確認済みです。地域枠は臨時定員増認可申請中です。",
    officialUrl: mariannaGuideUrl,
    routes: [
      route({
        id: "recommendation-public",
        officialName: "学校推薦型選抜（一般公募制）",
        category: "recommendation",
        quota: "約20名",
        publicationStatus: "complete",
        currentStudentEligible: true,
        eligibility: "日本国内の全日制高校・中等教育学校を2027年3月卒業見込み、または外国の12年課程・認定教育施設等を2026年6月から2027年3月までに修了・修了見込みで、評定基準を満たし、合格時の入学を確約できる者",
        exclusive: "条件付き",
        principalRecommendation: "必要",
        gradeRequirement: "3年1学期までの全体3.8以上、数学・理科・外国語各4.0以上",
        restrictions: [
          "国内課程は全日制に限り、国内既卒者は出願不可",
          "外国12年課程・認定教育施設等の該当者は出願開始1か月前までに個別審査が必要",
          "合格時に入学を確約",
          "神奈川県地域枠と相互併願可。両方合格した場合は神奈川県地域枠を優先",
        ],
        events: [...mariannaRecommendationSchedule],
        sourceUrls: [...mariannaRecommendationSources],
        note: "11月14日に基礎学力試験（数学・理科、英語）、小論文、個人面接Ⅰ・Ⅱを行う一段階選考です。大学入学共通テストは利用しません。",
      }),
      route({
        id: "recommendation-kanagawa",
        officialName: "学校推薦型選抜（神奈川県地域枠）",
        category: "regional",
        quota: "7名（臨時定員増認可申請中）",
        publicationStatus: "complete",
        currentStudentEligible: true,
        eligibility: "日本国内の全日制高校・中等教育学校を2027年3月卒業見込み、または外国の12年課程・認定教育施設等を2026年6月から2027年3月までに修了・修了見込みで、評定基準を満たし、2027年4月1日までに神奈川県内に通算1年以上の居住歴がある、または神奈川県内の高校を卒業見込みの者",
        exclusive: "条件付き",
        principalRecommendation: "必要",
        gradeRequirement: "3年1学期までの全体3.8以上、数学・理科・外国語各4.0以上",
        restrictions: [
          "国内課程は全日制に限り、国内既卒者は出願不可",
          "外国12年課程・認定教育施設等の該当者は出願開始1か月前までに個別審査が必要",
          "合格時に入学を確約。一般公募制と相互併願可で、両方合格した場合は地域枠を優先",
          "神奈川県地域医療医師修学資金（月額10万円）の利用を確約",
          "神奈川県キャリア形成プログラム・卒前支援プランに同意",
          "卒業直後に県内基幹型臨床研修病院で初期研修を開始し、初期研修を含め9年以上、県指定医療機関・指定診療科に継続勤務",
          "9年間のうち4年間は、原則として卒後6年目から9年目に医師不足地域で勤務",
          "臨時定員増認可申請中",
        ],
        events: [...mariannaRecommendationSchedule],
        sourceUrls: [...mariannaRecommendationSources, mariannaRegionalProgramUrl],
        note: "11月14日に一般公募制と同じ一段階選考を行い、大学入学共通テストは利用しません。入学後は神奈川県の修学資金制度とキャリア形成プログラムが適用されます。",
      }),
    ],
    excludedRoutes: [
      "一般選抜（前期・後期）は一般選抜のため対象外",
      "大学入学共通テスト利用選抜は通常の共通テスト利用選抜のため対象外",
      "学校推薦型選抜（指定校制）は2023年度入試から廃止され、2027年度も実施なし",
    ],
  }),
  university({
    id: "tokai",
    name: "東海大学",
    region: "関東",
    prefecture: "神奈川県",
    strategyPath: "/toukai-university-entrance-exam-measures2027/",
    scopeStatus: "available",
    publicationStatus: "complete",
    statusNote: "2027年度完成版要項で、書類審査・大学独自の第二次選考・大学入学共通テストによる最終選考を行う総合型選抜1方式を確認しました。",
    officialUrl: "https://www.med.u-tokai.ac.jp/faculty/medicine/exam/",
    routes: [route({
      id: "star-development",
      officialName: "総合型選抜 医学部医学科（希望の星育成）",
      category: "comprehensive",
      quota: "10名",
      publicationStatus: "complete",
      currentStudentEligible: true,
      eligibility: "東海大学の建学の精神・教育方針を理解し、高校・中等教育学校を2027年3月卒業見込み、特別支援学校高等部・高等専門学校第3学年を同月修了見込み、または外国の12年課程・在外教育施設・文部科学大臣指定等の大学入学資格を2026年4月1日～2027年3月31日に取得・取得見込みで、令和9年度大学入学共通テストの指定教科・科目を受験する者",
      exclusive: "併願可",
      principalRecommendation: "不要",
      gradeRequirement: "評定要件なし（調査書は書類審査資料）",
      restrictions: [
        "国内の高校・中等教育学校は2027年3月卒業見込み、特別支援学校高等部・高等専門学校第3学年は同月修了見込み",
        "外国12年課程・在外教育施設・文部科学大臣指定等は2026年4月1日～2027年3月31日の資格取得・取得見込み",
        "令和9年度大学入学共通テストで英語（リスニングを含む）・数学I A・数学II B C・物理／化学／生物から2科目を受験",
        "活動報告書は必須だが、活動・資格実績がない場合は「特になし」と記入可",
        "他大学との併願可",
      ],
      events: [
        event("application-start", "2026-09-01", "第一次選考出願開始"),
        event("application-deadline", "2026-09-14", "第一次選考出願締切", { deadlineRule: "必着" }),
        event("first-result", "2026-10-05", "第一次選考結果発表", { time: "9:30" }),
        event("application-start", "2026-10-05", "第二次選考出願開始", { choiceRule: "第一次選考合格者のみ" }),
        event("application-deadline", "2026-10-12", "第二次選考出願締切", { time: "23:59" }),
        event("second-exam", "2026-10-24", "第二次選考（小論文・オブザベーション評価・個人面接）", {
          time: "9:00開始",
        }),
        event("final-result", "2026-10-30", "第二次選考合格発表", { time: "9:30" }),
        event("application-start", "2026-12-11", "最終選考出願開始", { choiceRule: "第二次選考合格者のみ" }),
        event("application-deadline", "2026-12-18", "最終選考出願締切", { deadlineRule: "必着" }),
        event("first-exam", "2027-01-16", "大学入学共通テスト①", { sequence: 1, choiceRule: "最終選考として2日間とも受験" }),
        event("first-exam", "2027-01-17", "大学入学共通テスト②", { sequence: 2, choiceRule: "最終選考として2日間とも受験" }),
        event("final-result", "2027-02-07", "最終合格発表", { time: "9:30" }),
        event("procedure-deadline", "2027-02-13", "Web入学手続締切", { time: "17:00", deadlineRule: "Web登録" }),
      ],
      sourceUrls: [
        "https://www.u-tokai.ac.jp/uploads/2026/07/65834d7e0d45140addd0835093f90a58.pdf",
        "https://www.med.u-tokai.ac.jp/faculty/medicine/exam/",
        "https://www.u-tokai.ac.jp/examination-admissions/exam/",
        "https://www.med.u-tokai.ac.jp/news/",
      ],
      note: "第一次選考は志望理由書・調査書・活動報告書等による書類審査です。第二次選考は10月24日に小論文（60分・800字以内）、オブザベーション評価（約120分）、個人面接（約20～30分）を行います。最終選考は指定する大学入学共通テスト科目600点で、本学独自試験はありません。Web入学手続期間は2月7日から2月13日17:00までです。",
    })],
    excludedRoutes: [
      "一般選抜は対象外",
      "医学部神奈川県地域枠選抜・静岡県地域枠選抜は大学入学共通テスト利用型のため対象外",
      "医学部医学科特別選抜（展学のすすめ）は大学2年以上・62単位等が要件で、通常の現役高校生は出願できないため対象外",
      "プレトクは医学部医学科を募集対象としていないため対象外",
    ],
  }),
  university({
    id: "kanazawa-medical",
    name: "金沢医科大学",
    region: "中部",
    prefecture: "石川県",
    strategyPath: "/kanazawaika-university-entrance-exam-measures2027/",
    scopeStatus: "available",
    publicationStatus: "outline",
    statusNote: "2027年度入試ガイドで4方式の概要と共通日程を公表しています。研究医枠・新潟県地域枠は認可申請中で、2027年度の募集人員・資格・日程は未公表です。完成版要項の公開後に必ず確認してください。",
    officialUrl: kanazawaMedicalGuideUrl,
    routes: [
      route({
        id: "ao",
        officialName: "総合型選抜（AO入試）",
        category: "comprehensive",
        quota: "15名",
        publicationStatus: "outline",
        currentStudentEligible: true,
        eligibility: "2026年4月1日現在25歳以下で、高校等を卒業した者、2027年3月卒業見込みの者または同等以上の学力があると認められた者",
        exclusive: "専願",
        principalRecommendation: "不要",
        gradeRequirement: "評定の数値基準なし（調査書等を評価）",
        restrictions: [
          "2026年4月1日現在25歳以下",
          "本人を熟知する者（近親者・教員等を問わず）の推薦書が必要",
          "卒業後5年間の指定臨床研修を確約",
        ],
        events: [...kanazawaMedicalSchedule],
        sourceUrls: [...kanazawaMedicalPublishedSources],
        note: "第1次選抜は基礎学力テスト（英語・数学・理科基礎2科目）と自己推薦書、第2次選抜は個人面接です。共通テストは使用しません。第2次選抜の集合時間は第1次選抜合格者へ通知されます。",
      }),
      route({
        id: "graduate-child",
        officialName: "総合型選抜（卒業生子女入試）",
        category: "comprehensive",
        quota: "8名",
        publicationStatus: "outline",
        currentStudentEligible: true,
        eligibility: "本学医学部卒業生の子女で、2026年4月1日現在25歳以下。高校等卒業者、2027年3月卒業見込みまたは同等以上の学力があると認められた者。法定血族は2024年4月1日以前の養子縁組が必要",
        exclusive: "専願",
        principalRecommendation: "不要",
        gradeRequirement: "評定の数値基準なし（調査書等を評価）",
        restrictions: [
          "本人を熟知する者（近親者・教員等を問わず）の推薦書が必要",
          "卒業後5年間の指定臨床研修と、その後4年間の継続勤務を確約",
        ],
        events: [...kanazawaMedicalSchedule],
        sourceUrls: [...kanazawaMedicalPublishedSources],
        note: "第1次選抜は基礎学力テストと自己推薦書、第2次選抜は個人面接です。共通テストは使用しません。第2次選抜の集合時間は第1次選抜合格者へ通知されます。",
      }),
      route({
        id: "designated-region",
        officialName: "総合型選抜（指定地域）",
        category: "regional",
        quota: "1名",
        publicationStatus: "outline",
        currentStudentEligible: true,
        eligibility: "富山県氷見市在住で氷見市長および高校長の推薦を受け、2027年3月高校卒業見込みまたは2026年3月卒業、2027年4月1日現在19歳以下の者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "評定の数値基準なし（調査書等を評価）",
        restrictions: [
          "富山県氷見市在住",
          "高校長・氷見市長の推薦",
          "氷見市修学資金と指定期間の地域勤務条件",
          "卒業後5年間の指定臨床研修を確約",
        ],
        events: [...kanazawaMedicalSchedule],
        sourceUrls: [...kanazawaMedicalPublishedSources, kanazawaMedicalDesignatedRegionUrl],
        note: "第1次選抜は基礎学力テストと自己推薦書、第2次選抜は個人面接です。共通テストは使用しません。第2次選抜の集合時間は第1次選抜合格者へ通知されます。",
      }),
      route({
        id: "designated-school",
        officialName: "学校推薦型選抜（指定校）",
        category: "designated",
        quota: "4名",
        publicationStatus: "outline",
        currentStudentEligible: true,
        eligibility: "本学指定高校を2027年3月卒業見込み、または2026年3月卒業し、2027年4月1日現在19歳以下で、高校長から推薦された者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "評定の数値基準なし（調査書等を評価）",
        restrictions: [
          "指定高校",
          "2027年4月1日現在19歳以下",
          "卒業後5年間の指定臨床研修を確約",
        ],
        events: [...kanazawaMedicalSchedule],
        sourceUrls: [...kanazawaMedicalPublishedSources],
        note: "第1次選抜は基礎学力テストと自己推薦書、第2次選抜は個人面接です。共通テストは使用しません。第2次選抜の集合時間は第1次選抜合格者へ通知されます。",
      }),
      route({
        id: "research-doctor",
        officialName: "総合型選抜（研究医枠）",
        category: "comprehensive",
        quota: null,
        publicationStatus: "unpublished",
        currentStudentEligible: "unconfirmed",
        eligibility: "2027年度は認可申請中。募集人員・出願資格は未公表",
        exclusive: "未公表",
        principalRecommendation: "未公表",
        gradeRequirement: "未公表",
        restrictions: ["認可申請中", "2027年度の募集人員・資格・日程は未公表"],
        events: [],
        sourceUrls: [
          kanazawaMedicalOverviewNewsUrl,
          kanazawaMedicalDownloadUrl,
          kanazawaMedicalSubjectsUrl,
          kanazawaMedicalQaUrl,
        ],
        note: "2027年度の実施は認可申請中です。2026年度の募集人員・資格・日程は転用していません。",
      }),
      route({
        id: "niigata-regional",
        officialName: "総合型選抜（新潟県地域枠）",
        category: "regional",
        quota: null,
        publicationStatus: "unpublished",
        currentStudentEligible: "unconfirmed",
        eligibility: "2027年度は認可申請中。募集人員・出願資格は未公表",
        exclusive: "未公表",
        principalRecommendation: "未公表",
        gradeRequirement: "未公表",
        restrictions: ["認可申請中", "2027年度の募集人員・資格・日程は未公表"],
        events: [],
        sourceUrls: [
          kanazawaMedicalOverviewNewsUrl,
          kanazawaMedicalDownloadUrl,
          kanazawaMedicalSubjectsUrl,
          kanazawaMedicalQaUrl,
        ],
        note: "2027年度の実施は認可申請中です。2026年度の募集人員・資格・日程は転用していません。",
      }),
    ],
    excludedRoutes: ["一般選抜（前期・後期）は対象外"],
  }),
  university({
    id: "aichi-medical",
    name: "愛知医科大学",
    region: "中部",
    prefecture: "愛知県",
    strategyPath: "/aichi-medical-university-entrance-exam2027-measures/",
    scopeStatus: "available",
    publicationStatus: "complete",
    statusNote: "2027年度本冊・別冊で4方式の詳細を確認済みです。",
    officialUrl: "https://www.aichi-med-u.ac.jp/files/igaku/2027nenndogakuseibosyuuyoukou_0731.pdf",
    routes: [
      ...[
      ["recommendation-public", "学校推薦型選抜（公募制）", "recommendation", "約20名（IB若干名を内数に含む）", "日本国内の高校等を2026年3月に卒業または2027年3月卒業見込みで、学校長推薦・評定・指定科目の履修要件を満たす者"],
      ["ib", "国際バカロレア選抜", "ib", "若干名（公募制の内数）", "2025年4月から2027年3月にIBフルディプロマを取得・取得見込みで、2027年3月31日までに18歳に達し、科目・成績要件を満たす者"],
      ["aichi-regional-a", "学校推薦型選抜（愛知県地域特別枠A方式）", "regional", "約5名（臨時定員増の認可申請予定）", "日本国内の高校等を2026年3月に卒業または2027年3月卒業見込みで、愛知県内校出身または本人・保護者が県内居住し、学校長推薦・評定・地域医療要件を満たす者"],
    ].map(([id, officialName, category, quota, eligibility]) => route({
      id,
      officialName,
      category: category as SpecialAdmissionCategory,
      quota,
      publicationStatus: "complete",
      currentStudentEligible: true,
      eligibility,
      exclusive: category === "ib" ? "未公表" : "専願",
      principalRecommendation: category === "ib" ? "不要" : "必要",
      gradeRequirement: category === "ib"
        ? "言語A（日本語）4以上、数学・理科2科目を履修し、計3科目中1科目以上HLかつ全科目5以上"
        : "全体・数学・理科・外国語各3.7以上",
      restrictions: category === "regional"
        ? [
            "愛知県内校出身または本人・保護者が県内居住",
            "愛知県・本学の修学資金を受給",
            "卒後に本学5年と愛知県指定医療機関等5年の勤務",
            "公募制と併願不可",
            "臨時定員増の認可申請予定",
          ]
        : category === "ib"
          ? [
              "IB取得時期・年齢・科目成績条件",
              "英語外部試験（IELTS・TOEIC・TOEFL iBT）のスコア提出",
            ]
          : ["指定科目の履修要件", "愛知県地域特別枠A方式と併願不可"],
      events: [
        event("application-start", "2026-11-01", "Web出願開始", { time: "9:00" }),
        event("application-deadline", "2026-11-13", "Web出願締切", { time: "17:00" }),
        event("application-deadline", "2026-11-13", "出願書類締切", { deadlineRule: "消印有効" }),
        event(
          "first-exam",
          "2026-11-28",
          category === "ib"
            ? "試験（日本語小論文・個人面接）"
            : "試験（基礎学力試験・小論文・個人面接）",
          { time: "8:30～8:45受付" },
        ),
        event("final-result", "2026-12-10", "合格発表", { time: "18:00頃" }),
        event("procedure-deadline", "2026-12-22", "入学手続締切"),
        ...(category === "ib"
          ? [
              event(
                "application-deadline",
                "2027-02-19",
                "IB取得見込み合格者 最終試験成績証明書提出期限",
              ),
            ]
          : []),
      ],
      sourceUrls: [
        "https://www.aichi-med-u.ac.jp/files/igaku/2027nenndogakuseibosyuuyoukou_0731.pdf",
        "https://www.aichi-med-u.ac.jp/su11/su1107/su110701/index.html",
        category === "regional"
          ? "https://www.aichi-med-u.ac.jp/su11/su1107/su110701/su11070101/1201061_2725.html"
          : category === "ib"
            ? "https://www.aichi-med-u.ac.jp/su11/su1107/su110701/su11070101/1201064_2725.html"
            : "https://www.aichi-med-u.ac.jp/su11/su1107/su110701/su11070101/02.html",
      ],
      note: category === "ib"
        ? "日本語小論文と個人面接による一段階選抜で、大学入学共通テストは利用しません。公式要項には専願・併願の記載がありません。"
        : category === "regional"
          ? "基礎学力試験（数学・外国語）、小論文、個人面接による一段階選抜で、大学入学共通テストは利用しません。入学手続期間は2026年12月11日から12月22日です。"
          : "基礎学力試験（数学・外国語）、小論文、個人面接による一段階選抜で、大学入学共通テストは利用しません。",
    })),
      route({
        id: "foreign-roots",
        officialName: "外国にルーツを持つ生徒特別選抜",
        category: "international",
        quota: "若干名（一般選抜募集人員の内数）",
        publicationStatus: "complete",
        currentStudentEligible: "conditional",
        eligibility: "日本の高校等を卒業または卒業見込みで、国籍・在留資格・在留期間、科学オリンピック等、日本語能力の要件をすべて満たす者",
        exclusive: "条件付き",
        principalRecommendation: "不要",
        gradeRequirement: "数値評定基準なし（科学オリンピック等の所定成績基準あり）",
        restrictions: [
          "非日本国籍または2027年3月31日時点で日本国籍取得6年以内",
          "小学校入学前を除く入国後在留期間が通算9年以内",
          "日本国内在留・大学入学に支障のない在留資格（留学・短期滞在を除く）",
          "日本語能力試験N2以上（2027年度に限り未取得者も受験可）",
          "公募制・愛知県地域特別枠A方式と併願不可",
        ],
        events: [
          event("application-deadline", "2026-10-09", "出願資格事前審査締切", { deadlineRule: "必着" }),
          event("application-start", "2026-11-01", "郵送出願開始"),
          event("application-deadline", "2026-11-13", "出願書類締切", { deadlineRule: "消印有効" }),
          event("first-exam", "2026-11-28", "試験（基礎学力試験・小論文・個人面接）", {
            time: "8:30～8:45受付",
          }),
          event("final-result", "2026-12-10", "合格発表", { time: "18:00頃" }),
          event("procedure-deadline", "2026-12-22", "入学手続期間最終日"),
        ],
        sourceUrls: [
          "https://www.aichi-med-u.ac.jp/files/igaku/2027igakubugakuseibosyuuyoukou.pdf",
          "https://www.aichi-med-u.ac.jp/su11/su1107/su110701/index.html",
          "https://www.aichi-med-u.ac.jp/su11/su1101/su110101/1238055_1888.html",
        ],
        note: "科学オリンピック等の成績、基礎学力試験（数学・外国語）、小論文、個人面接、書類審査による一段階選抜で、大学入学共通テストは利用しません。入学手続期間は2026年12月11日から12月22日です。",
      }),
    ],
    excludedRoutes: ["愛知県地域特別枠Bは通常の大学入学共通テスト利用選抜のため対象外"],
  }),
  university({
    id: "fujita",
    name: "藤田医科大学",
    region: "中部",
    prefecture: "愛知県",
    strategyPath: "/hujitaika-university-entrance-exam-measures2027/",
    scopeStatus: "available",
    publicationStatus: "outline",
    statusNote: "2027年度入試概要で対象2方式を確認済みです。完成版学生募集要項は公式案内上8月公開予定で、入学手続日などは未公表です。",
    officialUrl: "https://www.fujita-hu.ac.jp/admission/exam-med/dubv6r0000001ec6-att/j93sdv000000ub7q.pdf",
    routes: [
      route({
        id: "fujita-future",
        officialName: "ふじた未来入試（一般枠／独創一理枠）",
        category: "comprehensive",
        quota: "一般枠と独創一理枠を合わせて12名（独創一理枠は最大3名）",
        publicationStatus: "outline",
        currentStudentEligible: true,
        eligibility: "日本国内の高校3年課程または中等教育学校6年課程を2027年3月に卒業見込みで、枠ごとの入学確約・卒後研修要件を満たす者",
        exclusive: "条件付き",
        principalRecommendation: "不要",
        gradeRequirement: "2027年度概要に数値評定基準の記載なし",
        restrictions: [
          "一般枠・独創一理枠とも現役のみ",
          "一般枠は入学確約（国公立大学医学科の総合型・学校推薦型・一般前期合格時のみ辞退可）",
          "独創一理枠は本学（大学・短大）卒業生の2親等以内の親族",
          "独創一理枠は入学確約（辞退例外の記載なし）",
          "本学講座が基幹となる専門研修プログラムへの参加を確約",
        ],
        events: [
          event("application-start", "2026-10-01", "Web出願開始"),
          event("application-deadline", "2026-10-30", "Web出願締切"),
          event("application-deadline", "2026-11-02", "出願書類締切", { deadlineRule: "必着" }),
          event("first-exam", "2026-11-08", "一次試験（英語・数学・小論文）"),
          event("first-result", "2026-11-13", "一次試験結果発表"),
          event("second-exam", "2026-11-22", "二次試験（講義課題・個人面接・グループディスカッション）"),
          event("final-result", "2026-11-30", "最終合格発表"),
        ],
        sourceUrls: [
          "https://www.fujita-hu.ac.jp/admission/exam-med/dubv6r0000001ec6-att/j93sdv000000ub7q.pdf",
          "https://www.fujita-hu.ac.jp/admission/exam-med/requirement.html",
          "https://www.fujita-hu.ac.jp/admission/exam-med/schedule.html",
          "https://www.fujita-hu.ac.jp/admission/admission_infoi.html",
          "https://www.fujita-hu.ac.jp/admission/q-and-a.html",
        ],
        note: "大学入学共通テストは利用しません。一次選考は英語・数学の200点で行い、小論文は講義課題・面接とともに二次判定へ使用します。一般枠と独創一理枠では辞退条件が異なります。",
      }),
      route({
        id: "returnee-ib",
        officialName: "帰国生・国際バカロレア入試",
        category: "returnee",
        quota: "若干名（一般入試一般枠90名に含む）",
        publicationStatus: "outline",
        currentStudentEligible: "conditional",
        eligibility: "日本国籍・日本の永住許可等を有し、外国高校を2024年4月以降に卒業または2027年3月までに卒業見込み、もしくはIB資格を同期間に取得・取得見込みで、英語資格・年齢要件を満たす者",
        exclusive: "条件付き",
        principalRecommendation: "不要",
        gradeRequirement: "2027年度概要に数値評定・IB得点基準の記載なし（TOEFL iBTまたはIELTS Academic Moduleの結果提出が必要）",
        restrictions: [
          "日本国籍・日本の永住許可等",
          "帰国生は外国の一般的な高校に最終学年を含め2年以上継続在籍（日本人学校等を除く）",
          "IB資格は国内外を問わず2024年4月以降に取得または2027年3月までに取得見込み",
          "TOEFL iBTまたはIELTS Academic Moduleの結果提出",
          "2006年4月2日～2009年4月1日生まれ（二浪相当まで）",
          "入学確約（国公立大学医学科の国際バカロレア入試合格時のみ辞退可）",
        ],
        events: [
          event("application-start", "2026-10-01", "Web出願開始"),
          event("application-deadline", "2026-10-23", "Web出願締切"),
          event("application-deadline", "2026-10-26", "出願書類締切", { deadlineRule: "必着" }),
          event("first-exam", "2026-11-08", "一次選考（英語・数学・小論文）"),
          event("first-result", "2026-11-13", "一次選考結果発表"),
          event("second-exam", "2026-11-22", "二次試験（講義課題・個人面接・グループディスカッション）"),
          event("final-result", "2026-11-30", "最終合格発表"),
        ],
        sourceUrls: [
          "https://www.fujita-hu.ac.jp/admission/exam-med/dubv6r0000001ec6-att/j93sdv000000ub7q.pdf",
          "https://www.fujita-hu.ac.jp/admission/exam-med/requirement.html",
          "https://www.fujita-hu.ac.jp/admission/exam-med/schedule.html",
          "https://www.fujita-hu.ac.jp/admission/admission_infoi.html",
          "https://www.fujita-hu.ac.jp/admission/q-and-a.html",
        ],
        note: "募集人員は一般入試一般枠の内数ですが、固有の出願資格と独立日程を持つ特別選抜です。大学入学共通テストは利用しません。一次選考は英語・数学の200点で行い、小論文は講義課題・面接とともに二次判定へ使用します。英語資格の最低点・有効期限と入学手続日は完成版要項の公表待ちです。",
      }),
    ],
    excludedRoutes: ["一般入試（愛知県地域枠を含む）と共通テスト利用入試は対象外"],
  }),
  university({
    id: "osaka-med-pharm",
    name: "大阪医科薬科大学",
    region: "近畿",
    prefecture: "大阪府",
    strategyPath: "/oosakaikayakka-university-entrance-exam-measures2027/",
    scopeStatus: "available",
    publicationStatus: "outline",
    statusNote: "2027年度入試概要・変更予告で対象4方式を確認。完成版入試要項は未公表のため、学習成績・指定校・推薦者等の詳細は断定していません。",
    officialUrl: "https://www.ompu.ac.jp/admission/undergraduate/qt931k000000801q-att/afif3u000000fsvj.pdf",
    routes: [
      route({
        id: "shisei-jinjutsu",
        officialName: "総合型選抜「至誠仁術」入試（併願制）",
        category: "comprehensive",
        quota: "5名",
        publicationStatus: "outline",
        currentStudentEligible: true,
        eligibility: "2027年3月卒業見込み、または卒業後1年以内で、指定共通テスト科目を受験する者",
        exclusive: "併願可",
        principalRecommendation: "未公表",
        gradeRequirement: "学習成績の数値基準は2027年度概要で未公表",
        restrictions: [
          "卒業後1年以内",
          "共通テストを第一次選考に利用",
          "活動報告書と志願者評価書2通を提出",
        ],
        events: [
          event("application-start", "2026-12-09", "出願開始"),
          event("application-deadline", "2027-01-15", "出願締切", { deadlineRule: "消印有効" }),
          event("first-exam", "2027-01-16", "第一次選考（大学入学共通テスト）①", { sequence: 1, choiceRule: "2日間とも受験" }),
          event("first-exam", "2027-01-17", "第一次選考（大学入学共通テスト）②", { sequence: 2, choiceRule: "2日間とも受験" }),
          event("first-result", "2027-02-17", "第一次選考合格者発表"),
          event("second-exam", "2027-03-14", "第二次選考（小論文・面接）"),
          event("final-result", "2027-03-16", "最終合格発表"),
          event("procedure-deadline", "2027-03-23", "入学手続締切"),
        ],
        sourceUrls: [
          "https://www.ompu.ac.jp/admission/undergraduate/qt931k000000801q-att/afif3u000000fsvj.pdf",
          "https://www.ompu.ac.jp/admission/undergraduate/medical.html",
          "https://www.ompu.ac.jp/admission/undergraduate/medical/index.html",
        ],
        note: "大学入学共通テスト（国語100点・数学200点・理科200点・英語200点）を第一次選考に使用し、第二次選考で小論文・面接を行う独立した総合型選抜です。通常の共通テスト利用選抜とは異なります。",
      }),
      ["recommendation-public", "学校推薦型選抜 公募制推薦入試（専願制）", "recommendation", "10名", "既卒者は出願不可。所定の英語資格・検定試験スコアを満たす者。卒業見込み時期・推薦者要件等は完成版要項で未公表"],
      ["recommendation-designated", "学校推薦型選抜 指定校制推薦入試（専願制）", "designated", "5名", "本学指定の高校から出願する者。卒業見込み時期・既卒可否・推薦者要件等は完成版要項で未公表"],
      ["recommendation-regional-designated", "学校推薦型選抜 指定校制推薦入試（地域指定・専願制）", "regional", "1名", "医師少数県を対象とする本学指定の高校から出願する者。対象県・卒業見込み時期・既卒可否・推薦者要件等は完成版要項で未公表"],
    ].flatMap((item) => Array.isArray(item) ? [route({
      id: item[0] as string,
      officialName: item[1] as string,
      category: item[2] as SpecialAdmissionCategory,
      quota: item[3] as string,
      publicationStatus: "outline",
      currentStudentEligible: item[2] === "recommendation" ? true : "unconfirmed",
      eligibility: item[4] as string,
      exclusive: "専願",
      principalRecommendation: "未公表",
      gradeRequirement: "学習成績の数値基準は2027年度資料で未公表。英語資格・検定試験は原則2026年11月1日時点で所定スコアが必要",
      restrictions: [
        item[2] === "regional" ? "医師少数県を対象とする本学指定校" : item[2] === "designated" ? "本学指定校のみ" : "既卒者は出願不可",
        "英語資格は受験後2年以内かつ運営機関の有効期限内",
        "TOEFL iBT 3以上（2026年1月21日以降受験）または42以上（同年1月20日以前受験）",
        "IELTS Academic 4.0以上、英検CSE 1980以上、TEAP 4技能225以上、GTEC CBT 930以上、ケンブリッジ英語検定140以上のいずれか",
        "TOEFL iBTのMyBestスコア・Home Editionは対象外",
        "志望理由書を提出し、入学前教育を受講",
      ],
      events: [
        event("application-start", "2026-11-01", "出願開始"),
        event("application-deadline", "2026-11-07", "出願締切", { deadlineRule: "消印有効" }),
        event("first-exam", "2026-11-21", "試験（数学・理科・小論文・面接）"),
        event("final-result", "2026-12-01", "合格発表"),
        event("procedure-deadline", "2026-12-11", "入学手続締切"),
      ],
      sourceUrls: [
        "https://www.ompu.ac.jp/admission/undergraduate/qt931k000000801q-att/afif3u000000fsvj.pdf",
        "https://www.ompu.ac.jp/admission/undergraduate/qt931k000000801q-att/hphm900000000alu.pdf",
        "https://www.ompu.ac.jp/admission/undergraduate/medical.html",
        "https://www.ompu.ac.jp/admission/undergraduate/medical/index.html",
      ],
      note: "数学100点・理科2科目150点・小論文・面接による一段階選考です。大学入学共通テストは利用しません。",
    })] : [item as SpecialAdmissionRoute]),
    excludedRoutes: ["一般選抜（前期・大阪府地域枠・後期）と大学入学共通テスト利用選抜は対象外"],
  }),
  university({
    id: "kansai-medical",
    name: "関西医科大学",
    region: "近畿",
    prefecture: "大阪府",
    strategyPath: "/kansaiika-university-entrance-exam-measures2027/",
    scopeStatus: "available",
    publicationStatus: "complete",
    statusNote: "2027年度完成版募集要項で3方式の詳細が公表されています。特色選抜は英語型・国際型・科学型で資格要件が異なるため、出願前に該当要件を確認してください。",
    officialUrl: "https://www.kmu.ac.jp/juk/fom/exam/i8fca0000000026n-att/R09_admission-requirements.pdf",
    routes: [
      route({
        id: "recommendation-general",
        officialName: "一般枠学校推薦型選抜試験",
        category: "recommendation",
        quota: "8名",
        publicationStatus: "complete",
        currentStudentEligible: true,
        eligibility: "日本国内の普通科等を2027年3月卒業見込みまたは2026年3月卒業、もしくは認定在外教育施設を2027年3月31日までに修了見込みまたは2025年4月1日～2026年3月31日に修了し、指定科目を履修した者",
        exclusive: "併願可",
        principalRecommendation: "必要",
        gradeRequirement: "全体の学習成績の状況3.5以上",
        restrictions: [
          "数学Ⅰ・Ⅱ・Ⅲ・A・B・C、物理・化学・生物から2科目以上、指定の英語科目を履修",
          "推薦型選抜試験で出願できる試験種別は1つのみ",
        ],
        events: [
          event("application-start", "2026-11-01", "インターネット出願開始"),
          event("application-deadline", "2026-11-11", "インターネット出願締切", { deadlineRule: "Web登録" }),
          event("application-deadline", "2026-11-12", "出願書類郵送締切", { deadlineRule: "消印有効" }),
          event("first-exam", "2026-11-28", "第1次試験（小論文・適性能力試験）", { time: "8:00入室開始・8:45着席" }),
          event("first-result", "2026-12-02", "第1次試験合格者発表", { time: "10:00" }),
          event("second-exam", "2026-12-05", "第2次試験（個別面接）"),
          event("final-result", "2026-12-10", "第2次試験合格者発表", { time: "10:00" }),
          event("procedure-deadline", "2026-12-18", "入学手続期限", { time: "15:00" }),
        ],
        sourceUrls: [
          "https://www.kmu.ac.jp/juk/fom/exam/i8fca0000000026n-att/R09_admission-requirements.pdf",
          "https://www.kmu.ac.jp/juk/fom/exam/recommend.html",
          "https://www.kmu.ac.jp/juk/fom/exam/nyushigaiyou.html",
        ],
        note: "第1次試験は小論文と適性能力試験、第2次試験は個別面接です。大学入学共通テストは利用しません。",
      }),
      route({
        id: "recommendation-special",
        officialName: "特別枠学校推薦型選抜試験（専願制）",
        category: "recommendation",
        quota: "10名",
        publicationStatus: "complete",
        currentStudentEligible: true,
        eligibility: "日本国内の普通科等を2027年3月卒業見込みまたは2026年3月卒業、もしくは認定在外教育施設を2027年3月31日までに修了見込みまたは2025年4月1日～2026年3月31日に修了し、指定科目・評定・卒後勤務条件を満たす者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "全体および6教科（国語、地理・歴史、公民、数学、理科、外国語）の学習成績の状況がともに4.0以上",
        restrictions: [
          "本人・保護者が入学を確約し、出願後の辞退不可",
          "数学Ⅰ・Ⅱ・Ⅲ・A・B・C、物理・化学・生物から2科目以上、指定の英語科目を履修",
          "指定病院での臨床研修2年と、医師不足診療科で本学に3年以上勤務（計5年以上）",
          "奨学金受給の有無にかかわらず卒後勤務条件を適用",
          "推薦型選抜試験で出願できる試験種別は1つのみ",
        ],
        events: [
          event("application-start", "2026-11-01", "インターネット出願開始"),
          event("application-deadline", "2026-11-11", "インターネット出願締切", { deadlineRule: "Web登録" }),
          event("application-deadline", "2026-11-12", "出願書類郵送締切", { deadlineRule: "消印有効" }),
          event("first-exam", "2026-11-28", "第1次試験（小論文・適性能力試験）", { time: "8:00入室開始・8:45着席" }),
          event("first-result", "2026-12-02", "第1次試験合格者発表", { time: "10:00" }),
          event("second-exam", "2026-12-05", "第2次試験（個別面接）"),
          event("final-result", "2026-12-10", "第2次試験合格者発表", { time: "10:00" }),
          event("procedure-deadline", "2026-12-18", "入学手続期限", { time: "15:00" }),
        ],
        sourceUrls: [
          "https://www.kmu.ac.jp/juk/fom/exam/i8fca0000000026n-att/R09_admission-requirements.pdf",
          "https://www.kmu.ac.jp/juk/fom/exam/detail.html",
          "https://www.kmu.ac.jp/juk/fom/exam/nyushigaiyou.html",
        ],
        note: "第1次試験は小論文と適性能力試験、第2次試験は個別面接です。大学入学共通テストは利用しません。",
      }),
      route({
        id: "distinctive",
        officialName: "特色選抜試験",
        category: "special",
        quota: "2名",
        publicationStatus: "complete",
        currentStudentEligible: true,
        eligibility: "英語型・科学型は日本国内の普通科等を2027年3月卒業見込みまたは2026年3月卒業、もしくは認定在外教育施設を2027年3月31日までに修了見込みまたは2025年4月1日～2026年3月31日に修了した者。国際型はIB Diplomaを2025年4月1日～2027年3月31日に取得（見込み）かつ2027年3月31日までに18歳となる者。いずれも型別要件と学校長推薦が必要",
        exclusive: "併願可",
        principalRecommendation: "必要",
        gradeRequirement: "英語型は指定英語資格、国際型はIB総合36点以上・指定HL科目の成績、科学型は指定大会への選出が必要（全体評定の数値基準なし）",
        restrictions: [
          "英語型：ケンブリッジ160、英検CSE 2300、GTEC CBT 1180、IELTS 5.5、TEAP 309、TOEFL iBT 4（旧表記72）、TOEIC L&R／S&W 1560のいずれか",
          "英語型の資格・スコアは出願開始日から遡って2年以内かつ各試験の有効期間内で、1種類・1回のみ提出（TOEFL Home Edition・MyBest、TOEIC IPは不可）",
          "国際型：日本語・英語の指定履修成績、IB総合36点以上、数学HL6以上と生物・化学・物理HLから2科目各6以上",
          "科学型：2024年4月～2026年10月に指定された科学・数学・情報系大会の本選等へ選出",
          "推薦型選抜試験で出願できる試験種別は1つのみ",
        ],
        events: [
          event("application-start", "2026-11-01", "インターネット出願開始"),
          event("application-deadline", "2026-11-11", "インターネット出願締切", { deadlineRule: "Web登録" }),
          event("application-deadline", "2026-11-12", "出願書類郵送締切", { deadlineRule: "消印有効" }),
          event("first-exam", "2026-11-28", "第1次試験（小論文・適性能力試験）", { time: "8:00入室開始・8:45着席" }),
          event("first-result", "2026-12-02", "第1次試験合格者発表", { time: "10:00" }),
          event("second-exam", "2026-12-05", "第2次試験（個別面接。英語型は英語面接も実施）"),
          event("final-result", "2026-12-10", "第2次試験合格者発表", { time: "10:00" }),
          event("procedure-deadline", "2026-12-18", "入学手続期限", { time: "15:00" }),
          event("procedure-deadline", "2027-03-01", "国際型・IB資格取得見込み合格者の証明書提出期限"),
        ],
        sourceUrls: [
          "https://www.kmu.ac.jp/juk/fom/exam/i8fca0000000026n-att/R09_admission-requirements.pdf",
          "https://www.kmu.ac.jp/juk/fom/exam/Special.html",
          "https://www.kmu.ac.jp/juk/fom/exam/nyushigaiyou.html",
        ],
        note: "3つの受験区分の募集人員は合計2名です。第1次試験は小論文と適性能力試験、第2次試験は個別面接で、英語型は別途英語面接があります。大学入学共通テストは利用しません。",
      }),
    ],
  }),
  university({
    id: "kindai",
    name: "近畿大学",
    region: "近畿",
    prefecture: "大阪府",
    strategyPath: "/kinnki-university-entrance-exam-measures2027/",
    scopeStatus: "available",
    publicationStatus: "outline",
    statusNote: "2027年度入試ガイドの予定値を掲載。完成版要項は9月公表予定です。",
    officialUrl: "https://kindai.jp/assets/pdf/exam/exam-guide-2027.pdf",
    routes: [route({
      id: "recommendation-public",
      officialName: "推薦入試（一般公募）",
      category: "recommendation",
      quota: "30名予定",
      publicationStatus: "outline",
      currentStudentEligible: true,
      eligibility: "2026年3月以降卒業、または2027年3月卒業見込みで、出身学校長の推薦を受ける者",
      exclusive: "併願可",
      principalRecommendation: "必要",
      gradeRequirement: "完成版要項で確認",
      restrictions: ["2027年度ガイドの予定情報"],
      events: [
        event("application-start", "2026-11-01", "出願開始"),
        event("application-deadline", "2026-11-13", "出願締切", { deadlineRule: "消印有効" }),
        event("first-exam", "2026-11-22", "第一次試験"),
        event("first-result", "2026-12-02", "第一次試験合格発表"),
        event("second-exam", "2026-12-06", "第二次試験"),
        event("final-result", "2026-12-16", "最終合格発表"),
        event("procedure-deadline", "2026-12-24", "入学手続締切"),
      ],
      sourceUrls: ["https://kindai.jp/assets/pdf/exam/exam-guide-2027.pdf"],
    })],
  }),
  university({
    id: "hyogo-medical",
    name: "兵庫医科大学",
    region: "近畿",
    prefecture: "兵庫県",
    strategyPath: "/https-lexus-ec-com-hyougoika-university-entrance-exam-measures2027/",
    scopeStatus: "available",
    publicationStatus: "complete",
    statusNote: "2027年度完成版要項で総合型4区分・学校推薦型2区分を確認。一般A内の県推薦制度枠は除外しています。",
    officialUrl: "https://www.hyo-med.ac.jp/files/20260703/c737f86c1b3de8f37133c3de2c8031853ac51fff.pdf",
    routes: [
      ...[
      ["comprehensive-general", "総合型選抜（一般枠）", "comprehensive", "約5名", "2026年3月卒業または2027年3月卒業見込みで、医療従事者の推薦を受ける者"],
      ["comprehensive-alumni", "総合型選抜（卒業生子女枠）", "special", "3名以内", "親または祖父母が本学医学部卒業生で、2026年3月卒業または2027年3月卒業見込みの者"],
      ["comprehensive-ib", "総合型選抜（国際バカロレア枠）", "ib", "約2名", "2025年4月から2027年3月にIB取得・取得見込みで年齢・科目成績条件を満たす者"],
      ["expert", "エキスパート養成入試（総合型選抜）", "special", "3名以内", "2027年3月卒業見込み可。指定診療科志望・医療従事者推薦等の条件を満たす者"],
    ].map(([id, officialName, category, quota, eligibility]) => route({
      id,
      officialName,
      category: category as SpecialAdmissionCategory,
      quota,
      publicationStatus: "complete",
      currentStudentEligible: true,
      eligibility,
      exclusive: "専願",
      principalRecommendation: category === "ib" ? "不要" : "方式による",
      gradeRequirement: category === "ib" ? "IB科目成績条件" : "要項で確認",
      restrictions: category === "ib" ? ["IB取得時期・年齢・科目条件"] : category === "special" ? ["卒業生子女または指定診療科等の区分別条件"] : [],
      events: [
        event("application-start", "2026-10-01", "出願開始"),
        event("application-deadline", "2026-10-15", "Web出願締切", { time: "15:00" }),
        event("application-deadline", "2026-10-15", "出願書類締切", { deadlineRule: "消印有効" }),
        event("first-exam", "2026-11-15", "第一次試験"),
        event("first-result", "2026-12-01", "第一次試験合格発表", { time: "10:00" }),
        event("second-exam", "2026-12-06", "第二次試験"),
        event("final-result", "2026-12-11", "最終合格発表", { time: "10:00" }),
        event("procedure-deadline", "2026-12-18", "入学手続締切", { deadlineRule: "消印有効" }),
      ],
      sourceUrls: ["https://www.hyo-med.ac.jp/files/20260703/c737f86c1b3de8f37133c3de2c8031853ac51fff.pdf"],
    })),
      ...[
      ["recommendation-public", "学校推薦型選抜（一般公募制）", "recommendation", "約23名", "2026年3月卒業または2027年3月卒業見込みで、学校長推薦・評定要件を満たす者"],
      ["recommendation-regional", "学校推薦型選抜（地域指定制）", "regional", "5名以内", "一般公募資格に加え、兵庫県内居住または県内高校等の地域条件を満たす者"],
    ].map((item) => route({
      id: item[0] as string,
      officialName: item[1] as string,
      category: item[2] as SpecialAdmissionCategory,
      quota: item[3] as string,
      publicationStatus: "complete",
      currentStudentEligible: true,
      eligibility: item[4] as string,
      exclusive: "専願",
      principalRecommendation: "必要",
      gradeRequirement: "学習成績の状況4.0以上",
      restrictions: item[2] === "regional" ? ["兵庫県内居住または県内高校条件", "一般公募制との併願可"] : [],
      events: [
        event("application-start", "2026-11-01", "出願開始"),
        event("application-deadline", "2026-11-06", "Web出願締切", { time: "15:00" }),
        event("application-deadline", "2026-11-06", "出願書類締切", { deadlineRule: "消印有効" }),
        event("first-exam", "2026-11-15", "試験日"),
        event("final-result", "2026-12-01", "合格発表", { time: "10:00" }),
        event("procedure-deadline", "2026-12-08", "入学手続締切", { deadlineRule: "消印有効" }),
      ],
      sourceUrls: ["https://www.hyo-med.ac.jp/files/20260703/c737f86c1b3de8f37133c3de2c8031853ac51fff.pdf"],
    })),
    ],
    excludedRoutes: ["一般選抜Aに含まれる兵庫県推薦入学制度枠は選抜分類が一般選抜のため対象外"],
  }),
  university({
    id: "kawasaki-medical",
    name: "川崎医科大学",
    region: "中国・四国",
    prefecture: "岡山県",
    strategyPath: "/kawasakiika-university-entrance-exam-measures2027/",
    scopeStatus: "available",
    publicationStatus: "complete",
    statusNote: "2027年度完成版要項で総合型3枠と附属高校推薦を確認。すべて専願です。",
    officialUrl: "https://pamphlet.adplat.jp/document/pamphlet/7806900-2-15-1/book.pdf",
    routes: [
      ...[
      ["chugoku-shikoku", "総合型選抜（中国・四国地域出身者枠）", "regional", "約20名", "2023年3月以降卒業または2027年3月卒業見込みで、年齢・地域・推薦条件を満たす者"],
      ["kirishima", "総合型選抜（霧島市地域枠）", "regional", "約1名", "卒業年・年齢条件に加え、霧島市の出身校または住民条件等を満たす者"],
      ["clinical-specialty", "総合型選抜（特定診療科専攻枠）", "special", "約4名", "卒業年・年齢条件に加え、指定診療科志望・推薦・勤務条件を満たす者"],
    ].map(([id, officialName, category, quota, eligibility]) => route({
      id,
      officialName,
      category: category as SpecialAdmissionCategory,
      quota,
      publicationStatus: "complete",
      currentStudentEligible: true,
      eligibility,
      exclusive: "専願",
      principalRecommendation: "方式による",
      gradeRequirement: "要項で確認",
      restrictions: ["2027年4月1日時点22歳以下", category === "regional" ? "地域条件・卒後勤務条件" : "指定診療科の勤務条件", "保護者以外の医療関係者推薦"],
      events: [
        event("application-start", "2026-10-19", "Web出願開始", { time: "9:00" }),
        event("application-deadline", "2026-10-30", "Web出願締切", { time: "15:00" }),
        event("application-deadline", "2026-10-30", "出願書類締切", { time: "17:00", deadlineRule: "必着" }),
        event("first-exam", "2026-11-07", "第一次試験"),
        event("first-result", "2026-11-10", "第一次試験合格発表", { time: "12:00" }),
        event("second-exam", "2026-11-14", "第二次試験"),
        event("final-result", "2026-11-17", "最終合格発表", { time: "12:00" }),
        event("procedure-deadline", "2026-11-25", "入学手続締切", { deadlineRule: "消印有効" }),
      ],
      sourceUrls: ["https://pamphlet.adplat.jp/document/pamphlet/7806900-2-15-1/book.pdf"],
    })),
      route({
        id: "affiliated-high-school",
        officialName: "学校推薦型選抜（附属高等学校）",
        category: "designated",
        quota: "約30名",
        publicationStatus: "complete",
        currentStudentEligible: "conditional",
        eligibility: "川崎医科大学附属高等学校を2027年3月卒業見込み、または2026年3月卒業し、校長推薦を受ける者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "附属高校要件",
        restrictions: ["川崎医科大学附属高等学校のみ"],
        events: [
          event("application-start", "2026-12-03", "Web出願開始", { time: "9:00" }),
          event("application-deadline", "2026-12-09", "Web出願締切", { time: "15:00" }),
          event("application-deadline", "2026-12-09", "出願書類締切", { time: "17:00", deadlineRule: "必着" }),
          event("first-exam", "2026-12-17", "試験日"),
          event("final-result", "2027-01-05", "合格発表", { time: "12:00" }),
          event("procedure-deadline", "2027-01-13", "入学手続締切", { deadlineRule: "消印有効" }),
        ],
        sourceUrls: ["https://pamphlet.adplat.jp/document/pamphlet/7806900-2-15-1/book.pdf"],
      }),
    ],
  }),
  university({
    id: "kurume",
    name: "久留米大学",
    region: "九州",
    prefecture: "福岡県",
    strategyPath: "/kurume-university-entrance-exam-measures2027/",
    scopeStatus: "available",
    publicationStatus: "outline",
    statusNote: "2027年度公式方式ページの日程を掲載。完成版募集要項は9月公表予定です。",
    officialUrl: "https://best.kurume-u.ac.jp/admissions/description/",
    routes: [
      ["recommendation-a", "学校推薦型選抜（公募制A日程）", "recommendation", "約8名", "2027年3月卒業見込みまたは2026年3月卒業で、学校長推薦を受ける者"],
      ["kurume-special", "学校推薦型選抜（久留米大学特別枠）", "regional", "約20名", "2027年3月卒業見込み、または2025年・2026年3月卒業で、福岡県内での研修・勤務を確約する者"],
      ["fukuoka-special", "学校推薦型選抜（福岡県特別枠）", "regional", "4名", "2027年3月卒業見込み、または2025年・2026年3月卒業で、県奨学金・地域医療要件を満たす者"],
    ].map(([id, officialName, category, quota, eligibility]) => route({
      id,
      officialName,
      category: category as SpecialAdmissionCategory,
      quota,
      publicationStatus: "outline",
      currentStudentEligible: true,
      eligibility,
      exclusive: "専願",
      principalRecommendation: "必要",
      gradeRequirement: id === "recommendation-a" ? "学習成績の状況を出願資格としない" : "完成版要項で確認",
      restrictions: category === "regional" ? ["福岡県内の研修・勤務または県奨学金等の条件"] : [],
      events: [
        event("application-start", "2026-11-01", "出願開始"),
        event("application-deadline", "2026-11-05", "出願締切"),
        event("first-exam", "2026-11-14", "試験日"),
        event("final-result", "2026-12-01", "合格発表"),
        event("procedure-deadline", "2026-12-17", "入学手続締切"),
      ],
      sourceUrls: [id === "recommendation-a" ? "https://best.kurume-u.ac.jp/admissions/type/recommend/a/" : id === "kurume-special" ? "https://best.kurume-u.ac.jp/admissions/type/recommend/k/" : "https://best.kurume-u.ac.jp/admissions/type/recommend/f/"],
    })),
    excludedRoutes: ["自己推薦型は理系大学卒業者等のみが対象で、現役高校生は出願できないため対象外"],
  }),
  university({
    id: "uoeh",
    name: "産業医科大学",
    region: "九州",
    prefecture: "福岡県",
    strategyPath: "/https-lexus-ec-com-sanngyouika-university-entrance-exam-measures2027/",
    scopeStatus: "available",
    publicationStatus: "outline",
    statusNote: "2027年度入学者選抜実施要項で方式・日程を確認。方式別の詳細募集要項は公表待ちです。",
    officialUrl: "https://www.uoeh-u.ac.jp/library/nyusi/R9_jissiyoko.pdf",
    routes: [
      route({
        id: "ramazzini",
        officialName: "総合型選抜（ラマツィーニ選抜）",
        category: "comprehensive",
        quota: "10名以内",
        publicationStatus: "outline",
        currentStudentEligible: true,
        eligibility: "2027年3月卒業見込みまたは2026年3月卒業で、産業医学への強い意思を持ち、指定共通テスト科目を受験する者",
        exclusive: "専願",
        principalRecommendation: "不要",
        gradeRequirement: "詳細要項で確認",
        restrictions: ["共通テスト指定3教科80%以上", "2028年度入試から廃止予定（2027年度は実施）"],
        events: [
          event("application-start", "2026-10-01", "出願開始"),
          event("application-deadline", "2026-10-16", "出願締切", { deadlineRule: "消印有効" }),
          event("first-exam", "2026-11-21", "プレゼンテーション試験"),
          event("first-result", "2026-11-27", "プレゼンテーション試験合格発表"),
          event("second-exam", "2027-01-16", "大学入学共通テスト①", { sequence: 1, choiceRule: "2日間とも受験" }),
          event("second-exam", "2027-01-17", "大学入学共通テスト②", { sequence: 2, choiceRule: "2日間とも受験" }),
          event("final-result", "2027-02-12", "最終合格発表"),
          event("procedure-deadline", "2027-02-26", "入学手続締切"),
        ],
        sourceUrls: ["https://www.uoeh-u.ac.jp/library/nyusi/R9_jissiyoko.pdf"],
      }),
      route({
        id: "school-recommendation",
        officialName: "学校推薦型選抜",
        category: "recommendation",
        quota: "25名以内",
        publicationStatus: "outline",
        currentStudentEligible: true,
        eligibility: "2027年3月卒業見込みまたは2026年3月卒業で、学校長から専願推薦を受ける者",
        exclusive: "専願",
        principalRecommendation: "必要",
        gradeRequirement: "現役は全体・主要5教科・数理英のいずれか4.3以上",
        restrictions: ["高校所在地による全国3ブロック制", "指定科目履修"],
        events: [
          event("application-start", "2026-11-01", "出願開始"),
          event("application-deadline", "2026-11-07", "出願締切", { deadlineRule: "消印有効" }),
          event("first-exam", "2026-12-02", "総合問題・面接"),
          event("final-result", "2026-12-11", "合格発表"),
          event("procedure-deadline", "2026-12-17", "入学手続締切"),
        ],
        sourceUrls: ["https://www.uoeh-u.ac.jp/library/nyusi/R9_jissiyoko.pdf"],
      }),
    ],
  }),
  university({
    id: "fukuoka",
    name: "福岡大学",
    region: "九州",
    prefecture: "福岡県",
    strategyPath: "/hukuoka-university-entrance-exam-measures2027/",
    scopeStatus: "available",
    publicationStatus: "partial",
    statusNote: "2027年度入試ガイドの推薦3方式と、国際センター公開の学部留学生選抜（後期日程）を掲載。推薦の完成版要項は9月中旬公表予定です。",
    officialUrl: "https://www.fukuoka-u.ac.jp/pdf/entrance-examinations/guidebook-entrance-examinations2027.pdf",
    routes: [
      ...[
      ["recommendation-a", "学校推薦型選抜 A方式推薦", "recommendation", "40名（地域枠10名・附属校最大8名を内数に含む）", "2027年3月卒業見込みまたは2026年3月卒業で、学校長推薦を受ける者"],
      ["recommendation-regional", "学校推薦型選抜 地域枠推薦", "regional", "10名（A方式40名の内数）", "A方式資格に加え、九州・沖縄・山口の出身校または居住条件、地域医療条件を満たす者"],
      ["recommendation-affiliated", "学校推薦型選抜 附属校推薦", "designated", "最大8名（A方式40名の内数）", "附属高等学校の2027年3月卒業見込み者。詳細は対象校へ通知"],
    ].map(([id, officialName, category, quota, eligibility]) => route({
      id,
      officialName,
      category: category as SpecialAdmissionCategory,
      quota,
      publicationStatus: "outline",
      currentStudentEligible: category === "designated" ? "conditional" : true,
      eligibility,
      exclusive: "専願",
      principalRecommendation: "必要",
      gradeRequirement: category === "designated" ? "対象校へ通知" : "医学科は学習成績の状況3.7以上",
      restrictions: category === "regional" ? ["九州・沖縄・山口の出身校または居住条件", "卒後の地域医療条件"] : category === "designated" ? ["附属校のみ"] : [],
      events: [
        event("application-start", "2026-11-01", "インターネット出願開始"),
        event("application-deadline", "2026-11-10", "インターネット出願締切"),
        event("first-exam", "2026-11-29", "試験日"),
        event("final-result", "2026-12-09", "合格発表"),
        event("procedure-deadline", "2026-12-23", "入学申込金締切"),
        event("procedure-deadline", "2027-03-08", "Web入学手続締切"),
      ],
      sourceUrls: ["https://www.fukuoka-u.ac.jp/pdf/entrance-examinations/guidebook-entrance-examinations2027.pdf"],
    })),
      route({
        id: "international-student-late",
        officialName: "学部留学生選抜（後期日程）",
        category: "international",
        quota: "若干名",
        publicationStatus: "complete",
        currentStudentEligible: "conditional",
        eligibility: "外国籍で外国の12年課程等を2027年3月までに修了見込みを含み、所定の日本語能力・日本留学試験等の要件を満たす者",
        exclusive: "併願可",
        principalRecommendation: "不要",
        gradeRequirement: "日本語能力・日本留学試験等の資格基準あり",
        restrictions: ["外国籍・外国学校教育歴", "授業を受けられる日本語能力（B2以上）", "日本留学試験の指定科目"],
        events: [
          event("application-start", "2026-11-30", "出願開始"),
          event("application-deadline", "2026-12-04", "出願締切", { deadlineRule: "必着" }),
          event("first-exam", "2027-02-08", "本学実施試験"),
          event("final-result", "2027-02-23", "合格発表"),
          event("procedure-deadline", "2027-03-01", "入学申込金締切"),
          event("procedure-deadline", "2027-03-08", "入学手続締切"),
        ],
        sourceUrls: ["https://www.kokusai.fukuoka-u.ac.jp/inbound/undergraduate/undergraduate_admission/exam/"],
      }),
    ],
    excludedRoutes: ["福岡大学の総合型選抜は医学科を対象としないため除外"],
  }),
];

export const specialAdmissionCategoryLabels: Record<SpecialAdmissionCategory, string> = {
  comprehensive: "総合型",
  recommendation: "学校推薦型",
  designated: "指定校・系列校",
  regional: "地域枠・地域指定",
  returnee: "帰国生",
  ib: "IB",
  international: "外国人・国際",
  special: "その他特別選抜",
};

export const specialAdmissionStageLabels: Record<SpecialAdmissionEventStage, string> = {
  "application-start": "出願開始",
  "application-deadline": "出願締切",
  "first-exam": "一次・試験",
  "first-result": "一次発表",
  "second-exam": "二次・最終選考",
  "final-result": "最終発表",
  "procedure-deadline": "手続締切",
};

export type SpecialAdmissionFlatEvent = SpecialAdmissionEvent & {
  universityId: string;
  university: string;
  routeId: string;
  routeName: string;
  category: SpecialAdmissionCategory;
  publicationStatus: SpecialAdmissionPublicationStatus;
  sourceUrl: string;
};

const stageOrder: Record<SpecialAdmissionEventStage, number> = {
  "application-start": 0,
  "application-deadline": 1,
  "first-exam": 2,
  "first-result": 3,
  "second-exam": 4,
  "final-result": 5,
  "procedure-deadline": 6,
};

export const privateMedicalSpecialAdmissionsRoutes2027 =
  privateMedicalSpecialAdmissionsUniversities2027.flatMap((entry) =>
    entry.routes.map((admissionRoute) => ({ university: entry, route: admissionRoute })),
  );

export const privateMedicalSpecialAdmissionsEvents2027: SpecialAdmissionFlatEvent[] =
  privateMedicalSpecialAdmissionsRoutes2027
    .flatMap(({ university: entry, route: admissionRoute }) =>
      admissionRoute.events.map((admissionEvent) => ({
        ...admissionEvent,
        universityId: entry.id,
        university: entry.name,
        routeId: admissionRoute.id,
        routeName: admissionRoute.officialName,
        category: admissionRoute.category,
        publicationStatus: admissionRoute.publicationStatus,
        sourceUrl: admissionRoute.sourceUrls[0] ?? entry.officialUrl,
      })),
    )
    .sort((a, b) => a.date.localeCompare(b.date) || stageOrder[a.stage] - stageOrder[b.stage] || a.university.localeCompare(b.university, "ja"));

export const privateMedicalSpecialAdmissionsDeadlines2027 =
  privateMedicalSpecialAdmissionsEvents2027.filter((entry) => entry.stage === "application-deadline");

export const privateMedicalSpecialAdmissionsExamEvents2027 =
  privateMedicalSpecialAdmissionsEvents2027.filter((entry) => entry.stage === "first-exam" || entry.stage === "second-exam");

export const privateMedicalSpecialAdmissionsCalendar2027 = [
  ...new Set(privateMedicalSpecialAdmissionsEvents2027.map((entry) => entry.date)),
].map((date) => ({
  date,
  events: privateMedicalSpecialAdmissionsEvents2027.filter((entry) => entry.date === date),
}));

export const privateMedicalSpecialAdmissionsSourceUrls2027 = [
  ...new Set(privateMedicalSpecialAdmissionsUniversities2027.flatMap((entry) => [entry.officialUrl, ...entry.routes.flatMap((admissionRoute) => admissionRoute.sourceUrls)])),
];

export const privateMedicalSpecialAdmissionsSummary2027 = {
  universityCount: privateMedicalSpecialAdmissionsUniversities2027.length,
  routeCount: privateMedicalSpecialAdmissionsRoutes2027.length,
  availableUniversityCount: privateMedicalSpecialAdmissionsUniversities2027.filter((entry) => entry.scopeStatus === "available").length,
  unpublishedUniversityCount: privateMedicalSpecialAdmissionsUniversities2027.filter((entry) => entry.scopeStatus === "unpublished").length,
  noInScopeUniversityCount: privateMedicalSpecialAdmissionsUniversities2027.filter((entry) => entry.scopeStatus === "not-offered").length,
  completeUniversityCount: privateMedicalSpecialAdmissionsUniversities2027.filter((entry) => entry.publicationStatus === "complete").length,
};

const universityIds = new Set(privateMedicalSpecialAdmissionsUniversities2027.map((entry) => entry.id));
if (privateMedicalSpecialAdmissionsUniversities2027.length !== 31 || universityIds.size !== 31) {
  throw new Error("2027年度私立医学部の対象大学は31校でなければなりません。");
}

for (const { university: entry, route: admissionRoute } of privateMedicalSpecialAdmissionsRoutes2027) {
  for (const admissionEvent of admissionRoute.events) {
    if (!/^202[67]-\d{2}-\d{2}$/.test(admissionEvent.date)) {
      throw new Error(`${entry.name} ${admissionRoute.officialName}: 日付がISO形式ではありません。`);
    }
  }
}
