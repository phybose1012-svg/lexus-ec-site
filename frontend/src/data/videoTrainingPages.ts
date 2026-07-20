export type VideoTrainingItem = {
  title: string;
  youtubeId: string;
  category?: string;
  note?: string;
  material?: {
    label: string;
    url: string;
  };
};

export type VideoTrainingPageData = {
  slug: "penguin-geometry" | "penguin-integral" | "english-training";
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  eyebrow: string;
  label: string;
  heading: string;
  lead: string;
  heroImage: string;
  heroAlt: string;
  characterImage?: string;
  characterAlt?: string;
  theme: string;
  format: string;
  outcome: string;
  introTitle: string;
  introBody: string;
  sections: {
    id: string;
    label: string;
    title: string;
    description: string;
    videos: VideoTrainingItem[];
  }[];
};

const numberedVideos = (prefix: string, ids: string[], category = prefix): VideoTrainingItem[] =>
  ids.map((youtubeId, index) => ({
    title: `${prefix} ${String(index + 1).padStart(2, "0")}`,
    youtubeId,
    category,
  }));

const geometryVideos = numberedVideos("平面図形", [
  "KB1nuPTF1mQ",
  "4g4TPxPeggc",
  "nDd04LTpu2k",
  "IOYgkrGeO3U",
  "Dnl_-MybmdA",
  "LBDcp4nAVjY",
  "l52QrOkKGUY",
  "0hNr2Zcx7GE",
  "mXxPFrSrlk4",
  "HPq2SofLikQ",
  "9eD-doMv6Tk",
  "FTB6i2n5wSs",
  "Kf2_UIshW1w",
  "VK0QhRecZa4",
  "JiMh6Iholxg",
  "AmiNO6zLVjE",
  "sfncnfIEdSM",
  "r4B5H4x1Jck",
  "cCBIjCBPE8o",
  "wpbq5YynE9s",
]);

const integralVideos = numberedVideos("積分計算", [
  "Uph9_xNc1xQ",
  "2IMM6ipJKgA",
  "W1RxSrZBOSQ",
  "ZHifW77oOe4",
  "f-JXO2T6cmQ",
  "wGoc_862ahI",
  "SBV05LZmezk",
  "jJZ-4zOUjL0",
  "pJiAiSSDmwg",
  "yRrKCjEbxxs",
  "wspdTu8F00o",
  "h0_9Y_ChMvA",
  "4qL3F7XQKaI",
  "owNIQ9zP7tw",
  "QgWPGGnD9ag",
  "HD8Rgi-DekI",
  "kh94O126T3c",
  "xiSQz0WPLpo",
  "y4HQYD7DCn4",
  "u9eIlEfQiNE",
  "rS53B6hXwWI",
]);

const englishGrammarMaterial = {
  label: "PDF ダウンロード",
  url: "https://drive.google.com/file/d/1_gk05WfQQ4s-jN3mlwJcCChBpb9F1l_g/view?usp=sharing",
};

const englishGrammarVideos: VideoTrainingItem[] = [
  { title: "英文法 SVOCと品詞 01", youtubeId: "X1-ns_nsTj8", category: "英文法", material: englishGrammarMaterial },
  { title: "英文法 SVOCと品詞 02", youtubeId: "5cLZ1Q0ngPI", category: "英文法", material: englishGrammarMaterial },
];

const englishReadingVideos: VideoTrainingItem[] = [
  { title: "英文解釈の修行 01-1", youtubeId: "G7qeTP1pmDw", category: "英文解釈" },
  { title: "英文解釈の修行 01-2", youtubeId: "gfVQAgoc1cw", category: "英文解釈" },
  { title: "英文解釈の修行 02-1", youtubeId: "DOvszmJzhiI", category: "英文解釈" },
  { title: "英文解釈の修行 02-2", youtubeId: "r4joGIlCpOs", category: "英文解釈" },
  { title: "英文解釈の修行 03-1", youtubeId: "Go8LmlaYcnc", category: "英文解釈" },
  { title: "英文解釈の修行 03-2", youtubeId: "Y0MfPSO_dpE", category: "英文解釈" },
  { title: "英文解釈の修行 04-1", youtubeId: "q-XEdXkHPLo", category: "英文解釈" },
  { title: "英文解釈の修行 04-2", youtubeId: "P9hjrkBiYFY", category: "英文解釈" },
  { title: "英文解釈の修行 05-1", youtubeId: "vBkBaPR8Tck", category: "英文解釈" },
  { title: "英文解釈の修行 05-2", youtubeId: "qYtNdltBJso", category: "英文解釈" },
];

export const videoTrainingPages: Record<VideoTrainingPageData["slug"], VideoTrainingPageData> = {
  "penguin-geometry": {
    slug: "penguin-geometry",
    title: "医学部数学 幾何ペンギン｜平面図形の動画解説 - 医学部予備校 レクサスE.C.",
    description:
      "医学部数学の平面図形を、動画で一つずつ確認できるレクサスE.C.の教材ページです。図形問題の見方、補助線、処理手順を短い単元ごとに整理します。",
    canonical: "https://lexus-ec.com/penguin-geometry/",
    ogImage: "/assets/legacy/wp-content/uploads/2025/08/ペンギン動画-1024x512.jpg",
    eyebrow: "MATH VIDEO",
    label: "幾何ペンギン",
    heading: "医学部数学 平面図形を、動画で立て直す。",
    lead: "補助線の引き方、図形の見方、計算へ落とす手順を、単元ごとに短く確認できます。",
    heroImage: "/assets/legacy/wp-content/uploads/2025/08/ペンギン動画-1024x512.jpg",
    heroAlt: "幾何ペンギン 動画コンテンツ",
    characterImage: "/assets/legacy/wp-content/uploads/2025/02/AnimazeScreenshot_cropped_2.jpg",
    characterAlt: "ペンギンのキャラクター",
    theme: "平面図形",
    format: "全20本",
    outcome: "補助線と思考手順を整理",
    introTitle: "図形が苦手な生徒ほど、まず「見方」を固定する。",
    introBody:
      "平面図形は、知識を覚えるだけでは得点に直結しません。どこに注目し、どの条件をつなぎ、どの形へ変換するかを、動画で確認しながら手元で再現してください。",
    sections: [
      {
        id: "geometry-videos",
        label: "GEOMETRY",
        title: "平面図形 動画一覧",
        description: "順番に見ても、苦手な番号だけを確認しても使える構成です。",
        videos: geometryVideos,
      },
    ],
  },
  "penguin-integral": {
    slug: "penguin-integral",
    title: "医学部数学 ペンギン積分｜積分計算の動画解説 - 医学部予備校 レクサスE.C.",
    description:
      "医学部数学の積分計算を、動画で一つずつ確認できるレクサスE.C.の教材ページです。典型処理、計算の型、ミスを減らす手順を整理します。",
    canonical: "https://lexus-ec.com/penguin-integral/",
    ogImage: "/assets/legacy/wp-content/uploads/2025/02/積分01サムネ-1024x576.jpg",
    eyebrow: "MATH VIDEO",
    label: "ペンギン積分",
    heading: "医学部数学 積分計算を、型から磨く。",
    lead: "置換、部分積分、計算整理まで、医学部入試で崩れやすい積分を動画で確認できます。",
    heroImage: "/assets/legacy/wp-content/uploads/2025/02/積分01サムネ-1024x576.jpg",
    heroAlt: "積分計算 動画コンテンツ",
    characterImage: "/assets/legacy/wp-content/uploads/2025/02/AnimazeScreenshot_cropped.jpg",
    characterAlt: "ペンギンのキャラクター",
    theme: "積分計算",
    format: "全21本",
    outcome: "計算の型とミス防止を整理",
    introTitle: "積分は、発想よりも「型」と「処理精度」で差がつく。",
    introBody:
      "積分計算で失点する原因は、方針以前の処理の雑さにあることが多いです。典型パターンを動画で確認し、同じ手順を紙面で再現できる状態まで固めてください。",
    sections: [
      {
        id: "integral-videos",
        label: "INTEGRAL",
        title: "積分計算 動画一覧",
        description: "基礎確認から入試レベルの処理まで、段階的に確認できます。",
        videos: integralVideos,
      },
    ],
  },
  "english-training": {
    slug: "english-training",
    title: "医学部対策 英語｜英文法・英文解釈の動画教材 - 医学部予備校 レクサスE.C.",
    description:
      "医学部英語の英文法と英文解釈を、動画で確認できるレクサスE.C.の教材ページです。SVOC、品詞、英文解釈の基礎を短い単元ごとに整理します。",
    canonical: "https://lexus-ec.com/english-training/",
    ogImage: "/assets/legacy/wp-content/uploads/2025/02/英文解釈1ｰ1-1024x576.jpg",
    eyebrow: "ENGLISH VIDEO",
    label: "医学部対策 英語",
    heading: "英文法と英文解釈を、再現できる形へ。",
    lead: "SVOC・品詞の基礎から英文解釈の読み方まで、動画で段階的に確認できます。",
    heroImage: "/assets/legacy/wp-content/uploads/2025/02/英文解釈1ｰ1-1024x576.jpg",
    heroAlt: "医学部対策英語 動画コンテンツ",
    characterImage: "/assets/legacy/wp-content/uploads/2025/02/processed_image_final2.jpg",
    characterAlt: "英語教材のキャラクター",
    theme: "英文法 / 英文解釈",
    format: "全12本",
    outcome: "品詞・構文・読解手順を整理",
    introTitle: "英語は「なんとなく読める」を卒業するところから始まる。",
    introBody:
      "文構造を取る、品詞を判断する、根拠を持って読む。医学部英語に必要な精度を、短い動画で確認し、授業や自習の前後に使える形へ整えます。",
    sections: [
      {
        id: "grammar-videos",
        label: "GRAMMAR",
        title: "英文法 再入門",
        description: "SVOCと品詞を、英文読解に使える知識として整理します。",
        videos: englishGrammarVideos,
      },
      {
        id: "reading-videos",
        label: "READING",
        title: "英文解釈の修行",
        description: "一文ずつ根拠を確認し、読み飛ばさずに解釈する訓練です。",
        videos: englishReadingVideos,
      },
    ],
  },
};
