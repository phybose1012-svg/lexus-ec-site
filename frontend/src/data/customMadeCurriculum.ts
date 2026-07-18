export const customMadePlanLevels = {
  foundation: {
    id: "foundation",
    slug: "foundation",
    rank: 0,
    title: "前提レベル演習プラン",
    currentLabel: "未習科目あり・高校入試レベルから",
    priceLabel: "¥30,000〜 / 科目",
    monthlyPrice: 30_000,
    focus: "前提知識を確認し、高校内容へ進む土台を作る",
  },
  beginner: {
    id: "beginner",
    slug: "beginner",
    rank: 1,
    title: "初歩レベル演習プラン",
    currentLabel: "高校教科書レベルから",
    priceLabel: "¥30,000〜 / 科目",
    monthlyPrice: 30_000,
    focus: "定義・公式・基本例題を順に積み上げる",
  },
  basic: {
    id: "basic",
    slug: "basic",
    rank: 2,
    title: "基礎レベル演習プラン",
    currentLabel: "偏差値50相当",
    priceLabel: "¥30,000〜 / 科目",
    monthlyPrice: 30_000,
    focus: "基礎問題を反復し、標準問題へ接続する",
  },
  standard: {
    id: "standard",
    slug: "standard",
    rank: 3,
    title: "標準レベル演習プラン",
    currentLabel: "偏差値55相当",
    priceLabel: "¥28,000〜 / 科目",
    monthlyPrice: 28_000,
    focus: "標準問題の正答率と解き直し精度を高める",
  },
  high: {
    id: "high",
    slug: "high-level",
    rank: 4,
    title: "ハイレベル演習プラン",
    currentLabel: "偏差値60相当",
    priceLabel: "¥22,500〜 / 科目",
    monthlyPrice: 22_500,
    focus: "標準問題を取り切り、発展問題へ接続する",
  },
  top: {
    id: "top",
    slug: "top-level",
    rank: 5,
    title: "トップレベル演習プラン",
    currentLabel: "偏差値65以上相当",
    priceLabel: "¥18,000〜 / 科目",
    monthlyPrice: 18_000,
    focus: "最難関の過去問と答案精度を集中的に磨く",
  },
} as const;

export type CustomMadePlanLevelId = keyof typeof customMadePlanLevels;

export const customMadePlanLevelOptions = Object.values(customMadePlanLevels);

export const curriculumSubjects = [
  { id: "english", label: "英語" },
  { id: "math", label: "数学" },
  { id: "chemistry", label: "化学" },
  { id: "physics", label: "物理" },
  { id: "biology", label: "生物" },
] as const;

export type CurriculumSubjectId = (typeof curriculumSubjects)[number]["id"];

export const curriculumPurposes = [
  { id: "total", label: "医学部合格までの総合設計" },
  { id: "rebuild", label: "苦手科目の立て直し" },
  { id: "advance", label: "学校より先の範囲へ進む" },
  { id: "past-paper", label: "過去問・得点力を強化する" },
  { id: "management", label: "課題と学習ペースを管理する" },
] as const;

export const curriculumGrades = [
  { id: "junior", label: "中学生", contactLabel: "中学生", urgency: 0 },
  { id: "high-1", label: "高校1年生", contactLabel: "高1生", urgency: 0 },
  { id: "high-2", label: "高校2年生", contactLabel: "高2生", urgency: 1 },
  { id: "high-3", label: "高校3年生", contactLabel: "高3生", urgency: 2 },
  { id: "graduate", label: "既卒生", contactLabel: "既卒生", urgency: 2 },
  { id: "repeater", label: "再受験生", contactLabel: "再受験生", urgency: 2 },
] as const;

export const curriculumTargets = [
  { id: "top", label: "東大・慶應など最難関医学部", shortLabel: "最難関医学部", goalRank: 5 },
  { id: "high", label: "国公立・慈恵・順天など難関医学部", shortLabel: "難関医学部", goalRank: 4 },
  { id: "standard", label: "昭和・東医など上位私立医学部", shortLabel: "上位私立医学部", goalRank: 3 },
  { id: "open", label: "未定・その他", shortLabel: "未定・その他", goalRank: 3 },
] as const;

export const curriculumStyles = [
  {
    id: "practice",
    label: "演習中心",
    description: "問題演習と解き直しを厚くする",
  },
  {
    id: "balance",
    label: "バランス",
    description: "演習・添削・質問を均等に進める",
  },
  {
    id: "lesson",
    label: "授業多め",
    description: "個別授業を加えて理解を補強する",
  },
  {
    id: "question",
    label: "質問重視",
    description: "質問整理と添削フィードバックを厚くする",
  },
] as const;

export const curriculumBudgets = [
  { id: "under-30", label: "3万円未満", max: 29_999 },
  { id: "30-50", label: "3〜5万円", max: 50_000 },
  { id: "50-80", label: "5〜8万円", max: 80_000 },
  { id: "80-120", label: "8〜12万円", max: 120_000 },
  { id: "over-120", label: "12万円以上", max: null },
] as const;

export const curriculumTaskLoads = [
  { id: "light", label: "軽め" },
  { id: "standard", label: "標準" },
  { id: "priority", label: "重点" },
] as const;

export const curriculumIndividualHours = [0, 1, 2, 3, 4, 6, 8] as const;
export const individualLessonHourlyPrice = 11_000;
export const curriculumPlannerStorageKey = "lexus:custom-made-curriculum:v1";
