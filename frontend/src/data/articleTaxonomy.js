export const primaryCategoryOrder = [
  {
    id: "admission-info",
    label: "大学別入試情報",
    description: "大学ごとの基本情報、共通テスト配点、二次試験傾向を整理します。",
  },
  {
    id: "university-strategy",
    label: "大学別対策",
    description: "私立医学部の一般選抜対策、日程・会場、科目別の戦略記事をまとめます。",
  },
  {
    id: "interview-prep",
    label: "面接・志望理由対策",
    description: "大学別の面接、志望理由、出願準備、ポリシー理解をまとめます。",
  },
  {
    id: "success-interview",
    label: "合格者インタビュー",
    description: "合格者の背景や逆転合格、再受験、学習法のストーリーを整理します。",
  },
  {
    id: "exam-column",
    label: "保護者・受験コラム",
    description: "大学別ではない医学部受験の考え方、Q&A、保護者向け記事をまとめます。",
  },
];

export const primaryCategoryByLabel = Object.fromEntries(
  primaryCategoryOrder.map((item) => [item.label, item]),
);

const regionOrder = [
  "北海道",
  "東北",
  "関東（東京）",
  "関東（東京以外）",
  "中部",
  "近畿",
  "中国",
  "四国",
  "九州・沖縄",
  "全国",
];

const normalizeRegion = (value = "") => {
  const normalized = value.trim();
  if (normalized === "関西") return "近畿";
  if (normalized === "九州") return "九州・沖縄";
  if (normalized === "関東") return "関東（東京以外）";
  return regionOrder.includes(normalized) ? normalized : "";
};

const universityProfiles = [
  ["北海道大学", "国公立", "北海道"],
  ["札幌医科大学", "国公立", "北海道"],
  ["旭川医科大学", "国公立", "北海道"],
  ["弘前大学", "国公立", "東北"],
  ["東北大学", "国公立", "東北"],
  ["秋田大学", "国公立", "東北"],
  ["山形大学", "国公立", "東北"],
  ["福島県立医科大学", "国公立", "東北"],
  ["筑波大学", "国公立", "関東（東京以外）"],
  ["群馬大学", "国公立", "関東（東京以外）"],
  ["千葉大学", "国公立", "関東（東京以外）"],
  ["東京大学", "国公立", "関東（東京）"],
  ["東京科学大学", "国公立", "関東（東京）"],
  ["横浜市立大学", "国公立", "関東（東京以外）"],
  ["山梨大学", "国公立", "中部"],
  ["信州大学", "国公立", "中部"],
  ["新潟大学", "国公立", "中部"],
  ["富山大学", "国公立", "中部"],
  ["金沢大学", "国公立", "中部"],
  ["福井大学", "国公立", "中部"],
  ["岐阜大学", "国公立", "中部"],
  ["浜松医科大学", "国公立", "中部"],
  ["名古屋大学", "国公立", "中部"],
  ["名古屋市立大学", "国公立", "中部"],
  ["三重大学", "国公立", "中部"],
  ["滋賀医科大学", "国公立", "近畿"],
  ["京都大学", "国公立", "近畿"],
  ["京都府立医科大学", "国公立", "近畿"],
  ["大阪大学", "国公立", "近畿"],
  ["大阪公立大学", "国公立", "近畿"],
  ["神戸大学", "国公立", "近畿"],
  ["奈良県立医科大学", "国公立", "近畿"],
  ["和歌山県立医科大学", "国公立", "近畿"],
  ["鳥取大学", "国公立", "中国"],
  ["島根大学", "国公立", "中国"],
  ["岡山大学", "国公立", "中国"],
  ["広島大学", "国公立", "中国"],
  ["山口大学", "国公立", "中国"],
  ["徳島大学", "国公立", "四国"],
  ["香川大学", "国公立", "四国"],
  ["愛媛大学", "国公立", "四国"],
  ["高知大学", "国公立", "四国"],
  ["九州大学", "国公立", "九州・沖縄"],
  ["佐賀大学", "国公立", "九州・沖縄"],
  ["長崎大学", "国公立", "九州・沖縄"],
  ["熊本大学", "国公立", "九州・沖縄"],
  ["大分大学", "国公立", "九州・沖縄"],
  ["宮崎大学", "国公立", "九州・沖縄"],
  ["鹿児島大学", "国公立", "九州・沖縄"],
  ["琉球大学", "国公立", "九州・沖縄"],
  ["岩手医科大学", "私立", "東北"],
  ["東北医科薬科大学", "私立", "東北"],
  ["自治医科大学", "私立", "関東（東京以外）"],
  ["獨協医科大学", "私立", "関東（東京以外）"],
  ["埼玉医科大学", "私立", "関東（東京以外）"],
  ["国際医療福祉大学", "私立", "関東（東京以外）"],
  ["北里大学", "私立", "関東（東京以外）"],
  ["聖マリアンナ医科大学", "私立", "関東（東京以外）"],
  ["東海大学", "私立", "関東（東京以外）"],
  ["金沢医科大学", "私立", "中部"],
  ["愛知医科大学", "私立", "中部"],
  ["藤田医科大学", "私立", "中部"],
  ["旧大阪医科大学", "私立", "近畿"],
  ["大阪医科薬科大学", "私立", "近畿"],
  ["関西医科大学", "私立", "近畿"],
  ["近畿大学", "私立", "近畿"],
  ["兵庫医科大学", "私立", "近畿"],
  ["川崎医科大学", "私立", "中国"],
  ["久留米大学", "私立", "九州・沖縄"],
  ["産業医科大学", "私立", "九州・沖縄"],
  ["福岡大学", "私立", "九州・沖縄"],
  ["慶應義塾大学", "私立", "関東（東京）"],
  ["順天堂大学", "私立", "関東（東京）"],
  ["東京医科大学", "私立", "関東（東京）"],
  ["東京慈恵会医科大学", "私立", "関東（東京）"],
  ["東京女子医科大学", "私立", "関東（東京）"],
  ["東邦大学", "私立", "関東（東京）"],
  ["日本医科大学", "私立", "関東（東京）"],
  ["日本大学", "私立", "関東（東京）"],
  ["昭和医科大学", "私立", "関東（東京）"],
  ["昭和大学", "私立", "関東（東京）"],
  ["帝京大学", "私立", "関東（東京）"],
  ["杏林大学", "私立", "関東（東京）"],
].map(([name, universityType, region]) => ({ name, universityType, region }));

const sortedUniversityProfiles = [...universityProfiles].sort((a, b) => b.name.length - a.name.length);

const unique = (items) => [...new Set(items.filter(Boolean))];

export const displayPostTitle = (post) =>
  post.displayTitleLines?.filter(Boolean).join(" / ") || post.displayTitle || post.title;

const fullText = (post) =>
  [
    post.path,
    post.slug,
    post.title,
    post.displayTitle,
    ...(post.displayTitleLines || []),
    post.description,
    ...(post.categories || []),
    ...(post.tags || []),
  ]
    .filter(Boolean)
    .join(" ");

const classificationText = (post) =>
  [
    post.path,
    post.slug,
    post.title,
    post.displayTitle,
    ...(post.displayTitleLines || []),
    ...(post.categories || []),
    ...(post.tags || []),
  ]
    .filter(Boolean)
    .join(" ");

const extractYear = (post, text) => {
  const targetYear = text.match(/20\d{2}(?=年度|年|[-_/]|$)/)?.[0] || "";
  const articleYear = (post.date || post.modified || "").match(/^20\d{2}/)?.[0] || "";
  return targetYear || articleYear || "年度未設定";
};

const sourceCategories = (post) =>
  unique((post.categories || []).map((category) => category.trim()).filter((category) => category && category !== "未分類"));

const extractUniversities = (text) =>
  sortedUniversityProfiles.filter((profile) => text.includes(profile.name));

const categoryUniversityType = (categories) => {
  if (categories.includes("国公立医学部")) return "国公立";
  if (categories.includes("私立医学部")) return "私立";
  return "";
};

const categoryRegion = (categories) => {
  for (const category of categories) {
    const region = normalizeRegion(category);
    if (region) return region;
  }
  return "";
};

const subjectTags = (text) =>
  [
    /英語|english|eng\b/i.test(text) && "英語",
    /数学|math\b/i.test(text) && "数学",
    /化学|chemi|chemistry/i.test(text) && "化学",
    /物理|physic|physics/i.test(text) && "物理",
    /生物|biology|bio\b/i.test(text) && "生物",
  ].filter(Boolean);

const voiceStoryTags = (text, universityType) => {
  const tags = [];
  if (/再受験|社会人|大学卒|中退|文系|外資系/.test(text)) tags.push("再受験・社会人");
  if (/多浪|浪人|浪人生/.test(text)) tags.push("多浪・浪人生");
  if (/現役/.test(text)) tags.push("現役生");
  if (/逆転|E判定|Ｅ判定|偏差値|可能性|全滅|ゼロ|基礎|失敗|特待/.test(text)) tags.push("逆転合格");
  if (/推薦/.test(text)) tags.push("推薦入試");
  if (/特待/.test(text)) tags.push("特待合格");
  if (/国公立/.test(text) || universityType === "国公立") tags.push("国公立医学部合格");
  if (universityType === "私立") tags.push("私立医学部合格");
  return unique(tags.length ? tags : ["合格ストーリー"]);
};

const primaryCategory = (post, text) => {
  if (post.path === "/information-faq/") return "保護者・受験コラム";
  if (post.template === "admission-info") return "大学別入試情報";
  if (post.template === "university-entrance-strategy") return "大学別対策";
  if (post.template === "interview-prep-guide") return "面接・志望理由対策";
  if (post.template === "voice-interview") return "合格者インタビュー";
  if (/保護者|親|Q&A|コラム/.test(text)) return "保護者・受験コラム";
  return "大学別対策";
};

const admissionSubCategory = (text) => {
  if (/共通テスト|kyoute/i.test(text)) return "共通テスト配点・ボーダー";
  if (/二次試験|niji/i.test(text)) return "二次試験傾向";
  return "大学別基本情報";
};

const strategySubCategory = (text) => {
  if (/Q&A|よくある質問|information-faq/i.test(text)) return "医学部入試Q&A";
  if (/日程・会場|ippan01/i.test(text)) return "一般選抜 日程・会場";
  const subjects = subjectTags(text);
  if (subjects.length) return `科目別対策: ${subjects.join("・")}`;
  return "私立医学部 一般選抜対策";
};

const interviewSubCategory = (text) => {
  if (/出願準備|entry/i.test(text)) return "出願準備・志望理由";
  if (/ポリシー|policy/i.test(text)) return "アドミッションポリシー・志望理由";
  if (/大学の特徴|feature/i.test(text)) return "大学の特徴・志望理由";
  return "本学志望理由・面接対策";
};

const voiceSubCategory = (storyTags) => {
  const priority = ["再受験・社会人", "多浪・浪人生", "現役生", "逆転合格", "推薦入試", "特待合格"];
  return priority.find((tag) => storyTags.includes(tag)) || "合格ストーリー";
};

const subCategory = (post, text, storyTags) => {
  if (post.path === "/information-faq/") return "医学部入試Q&A";
  if (post.template === "admission-info") return admissionSubCategory(text);
  if (post.template === "university-entrance-strategy") return strategySubCategory(text);
  if (post.template === "interview-prep-guide") return interviewSubCategory(text);
  if (post.template === "voice-interview") return voiceSubCategory(storyTags);
  return "受験コラム";
};

const examType = (post, text, subCategoryValue) => {
  if (/共通テスト|kyoute/i.test(text)) return "共通テスト";
  if (/二次試験|niji/i.test(text)) return "二次試験";
  if (/面接|志望理由|feature|policy|entry|interview/i.test(text)) return "面接・志望理由";
  if (/日程・会場|一般選抜|ippan|exam/i.test(text)) return "一般選抜";
  if (/Q&A/.test(subCategoryValue)) return "Q&A";
  if (post.template === "voice-interview") return "合格体験記";
  return "大学別情報";
};

const audience = (post, text) => {
  const items = ["受験生"];
  if (/保護者|親/.test(text)) items.push("保護者");
  if (/再受験|社会人|大学卒|中退|外資系/.test(text)) items.push("再受験生");
  if (/現役/.test(text)) items.push("現役生");
  if (/浪人|多浪|浪人生/.test(text)) items.push("浪人生");
  if (post.template === "voice-interview") items.push("合格体験記を読みたい人");
  return unique(items);
};

export function classifyArticlePost(post) {
  const text = fullText(post);
  const classText = classificationText(post);
  const categories = sourceCategories(post);
  const universities = extractUniversities(classText);
  const mainUniversity = universities[0];
  const universityNames = universities.map((profile) => profile.name);
  const universityType = categoryUniversityType(categories) || mainUniversity?.universityType || "全医学部";
  const region = categoryRegion(categories) || mainUniversity?.region || "全国";
  const storyTags = post.template === "voice-interview" ? voiceStoryTags(text, universityType) : [];
  const primary = primaryCategory(post, classText);
  const sub = subCategory(post, classText, storyTags);
  const subjects = subjectTags(classText);

  return {
    primaryCategory: primary,
    primaryCategoryId: primaryCategoryByLabel[primary]?.id || "uncategorized",
    subCategory: sub,
    facets: {
      year: extractYear(post, text),
      articleYear: (post.date || post.modified || "").match(/^20\d{2}/)?.[0] || "",
      universityNames: universityNames.length ? universityNames : [],
      universityName: universityNames[0] || "医学部全般",
      universityType,
      region,
      examType: examType(post, classText, sub),
      subjects,
      audience: audience(post, text),
      storyTags,
      sourceCategories: categories,
    },
  };
}

const compareByOrder = (order, a, b) => {
  const aIndex = order.indexOf(a);
  const bIndex = order.indexOf(b);
  if (aIndex !== -1 || bIndex !== -1) {
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  }
  return a.localeCompare(b, "ja");
};

export function groupArticlesForDirectory(posts) {
  const classifiedPosts = posts.map((post) => ({
    ...post,
    taxonomy: classifyArticlePost(post),
  }));

  return primaryCategoryOrder
    .map((category) => {
      const postsInCategory = classifiedPosts.filter(
        (post) => post.taxonomy.primaryCategory === category.label,
      );
      const subCategoryNames = unique(postsInCategory.map((post) => post.taxonomy.subCategory)).sort((a, b) =>
        a.localeCompare(b, "ja"),
      );

      return {
        ...category,
        posts: postsInCategory,
        subCategories: subCategoryNames.map((name) => ({
          name,
          posts: postsInCategory.filter((post) => post.taxonomy.subCategory === name),
        })),
      };
    })
    .filter((group) => group.posts.length > 0);
}

export function getTaxonomyStats(posts) {
  const classifiedPosts = posts.map((post) => ({ post, taxonomy: classifyArticlePost(post) }));
  const countByPrimary = Object.fromEntries(primaryCategoryOrder.map((category) => [category.label, 0]));
  const countByRegion = Object.fromEntries(regionOrder.map((region) => [region, 0]));
  const countByExamType = {};

  for (const item of classifiedPosts) {
    countByPrimary[item.taxonomy.primaryCategory] = (countByPrimary[item.taxonomy.primaryCategory] || 0) + 1;
    countByRegion[item.taxonomy.facets.region] = (countByRegion[item.taxonomy.facets.region] || 0) + 1;
    countByExamType[item.taxonomy.facets.examType] = (countByExamType[item.taxonomy.facets.examType] || 0) + 1;
  }

  return {
    total: classifiedPosts.length,
    countByPrimary,
    countByRegion: Object.fromEntries(
      Object.entries(countByRegion)
        .filter(([, count]) => count > 0)
        .sort(([a], [b]) => compareByOrder(regionOrder, a, b)),
    ),
    countByExamType: Object.fromEntries(
      Object.entries(countByExamType).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja")),
    ),
  };
}
