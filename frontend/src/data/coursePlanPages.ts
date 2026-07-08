export type CoursePlanGroupId = "custom-made-course" | "medical-prep" | "medical-prep-junior";

export type CoursePlanGroup = {
  id: CoursePlanGroupId;
  tone: "custom" | "senior" | "junior";
  parentHref: string;
  courseTitle: string;
  courseEnglish: string;
  courseLabel: string;
  heroLead: string;
  parentLabel: string;
};

export type CoursePlan = {
  slug: string;
  title: string;
  badge: string;
  target: string;
  level: string;
  price: string;
  lead: string;
  summary: string;
  bestFor: string[];
  outcomes: string[];
  steps: { title: string; body: string }[];
  supports: string[];
};

export type CoursePlanPage = {
  group: CoursePlanGroup;
  plan: CoursePlan & { href: string };
  siblings: (CoursePlan & { href: string })[];
};

const withHref = (group: CoursePlanGroup, plan: CoursePlan) => ({
  ...plan,
  href: `${group.parentHref}${plan.slug}/`,
});

export const coursePlanGroups: Record<CoursePlanGroupId, CoursePlanGroup & { plans: CoursePlan[] }> = {
  "custom-made-course": {
    id: "custom-made-course",
    tone: "custom",
    parentHref: "/top/course/custom-made-course/",
    courseTitle: "オーダーメード演習コース",
    courseEnglish: "Custom-made Course",
    courseLabel: "演習中心型",
    heroLead: "授業を増やす前に、演習量・復習順・質問対応を設計する。自分の現在地から医学部合格までの距離を、毎週の課題へ落とし込みます。",
    parentLabel: "オーダーメード演習コースへ戻る",
    plans: [
      {
        slug: "top-level",
        title: "トップレベル演習プラン",
        badge: "最難関医学部",
        target: "東大、慶應など、医学部のトップ",
        level: "偏差値65相当",
        price: "¥18,000〜 / 科目",
        lead: "すでに高い学力がある受験生に、最難関医学部で差がつく演習と解き直しを集中的に設計します。",
        summary: "難問をただ増やすのではなく、合格点から逆算して、失点原因の分類、答案の精度、復習サイクルを整えます。",
        bestFor: ["基礎知識は固まっている", "難問演習の優先順位を整理したい", "東大・慶應レベルの答案力を鍛えたい"],
        outcomes: ["最難関で必要な思考問題への粘り", "答案の根拠を言語化する力", "過去問演習後の復習精度"],
        steps: [
          { title: "現在地を診断", body: "科目別に失点原因を分け、演習テーマを絞ります。" },
          { title: "高密度演習", body: "難問・過去問・類題を組み合わせ、復習前提で量を確保します。" },
          { title: "答案修正", body: "解けた問題も、答案の筋道と表現を確認します。" },
        ],
        supports: ["課題管理", "質問し放題", "答案チェック", "効果測定", "過去問設計"],
      },
      {
        slug: "high-level",
        title: "ハイレベル演習プラン",
        badge: "難関医学部",
        target: "国公立、慈恵、順天など、難関医学部",
        level: "偏差値60相当",
        price: "¥22,500〜 / 科目",
        lead: "難関医学部へ届かせるため、標準問題の完成度と発展問題への接続を同時に高めます。",
        summary: "解ける問題を確実に取り切り、合否を分ける上位問題へ進めるよう、単元別に演習量を配分します。",
        bestFor: ["基礎から応用への移行で止まりやすい", "国公立・上位私立を狙いたい", "自習の質を上げたい"],
        outcomes: ["標準問題の取りこぼし削減", "発展問題へ入る前の土台作り", "復習の優先順位づけ"],
        steps: [
          { title: "弱点単元を抽出", body: "模試や演習結果から、先に潰すべき単元を決めます。" },
          { title: "標準を高速化", body: "頻出問題を反復し、解答速度と正確性を上げます。" },
          { title: "発展へ接続", body: "応用問題を少しずつ足し、過去問に耐える力を作ります。" },
        ],
        supports: ["個別カリキュラム", "課題管理", "質問し放題", "効果測定", "受験校選定"],
      },
      {
        slug: "standard",
        title: "標準レベル演習プラン",
        badge: "上位私立医学部",
        target: "昭和、東医など上位の私立医学部",
        level: "偏差値55相当",
        price: "¥28,000〜 / 科目",
        lead: "医学部受験の標準問題を取り切るため、単元ごとの穴を埋めながら演習量を安定させます。",
        summary: "理解したつもりで止まらないよう、問題演習、質問、解き直しを一つの流れにして管理します。",
        bestFor: ["標準問題でミスが多い", "復習が後回しになりやすい", "私立医学部の合格点を安定させたい"],
        outcomes: ["頻出単元の基礎定着", "演習後の解き直し習慣", "点に変わる問題処理力"],
        steps: [
          { title: "単元を整理", body: "未完成の単元を洗い出し、優先順を決めます。" },
          { title: "演習を固定", body: "毎週の課題量を明確にし、迷わず進めます。" },
          { title: "解き直しを管理", body: "正解・不正解だけでなく、復習タイミングまで追います。" },
        ],
        supports: ["課題管理", "質問し放題", "効果測定", "個別授業追加", "学習計画"],
      },
      {
        slug: "basic",
        title: "基礎レベル演習プラン",
        badge: "基礎再構築",
        target: "都内の私立医学部など",
        level: "偏差値50相当",
        price: "¥30,000〜 / 科目",
        lead: "医学部受験へ向けて、教科書レベルから標準問題へつなげる演習設計を行います。",
        summary: "抜けている知識を確認しながら、基礎問題を解ける状態へ戻し、標準問題に入る準備を整えます。",
        bestFor: ["基礎の抜けが気になる", "何から手をつけるべきか迷う", "演習量を自分で維持しにくい"],
        outcomes: ["教科書範囲の再整理", "基礎問題の正答率向上", "自習の進め方の固定"],
        steps: [
          { title: "前提知識を確認", body: "単元ごとの抜けを細かく確認します。" },
          { title: "基礎演習を反復", body: "基本問題を落とさない状態まで繰り返します。" },
          { title: "標準へ移行", body: "基礎が固まった単元から、標準問題へつなげます。" },
        ],
        supports: ["個別カリキュラム", "基礎課題", "質問し放題", "確認テスト", "個別授業追加"],
      },
      {
        slug: "beginner",
        title: "初歩レベル演習プラン",
        badge: "教科書レベル",
        target: "高校教科書レベルの知識修得",
        level: "偏差値40台",
        price: "¥30,000〜 / 科目",
        lead: "高校内容に不安がある科目を、初歩から医学部受験へ接続できる状態まで立て直します。",
        summary: "焦って難問へ進まず、定義、公式、基本例題、確認演習を順番に積み上げます。",
        bestFor: ["未完成の科目がある", "教科書内容からやり直したい", "質問できる環境で進めたい"],
        outcomes: ["基本事項の理解", "例題レベルの処理力", "学習習慣の再構築"],
        steps: [
          { title: "教科書範囲を確認", body: "どこから戻るべきかを明確にします。" },
          { title: "例題で理解", body: "理解できる単位まで分解して進めます。" },
          { title: "小テストで定着", body: "短い確認を重ね、知識を使える状態にします。" },
        ],
        supports: ["基礎設計", "課題管理", "質問し放題", "確認テスト", "学習相談"],
      },
      {
        slug: "foundation",
        title: "前提レベル演習プラン",
        badge: "未習科目対応",
        target: "高校入試レベルの知識習得",
        level: "未習科目あり",
        price: "¥30,000〜 / 科目",
        lead: "高校内容に入る前の前提知識から整え、医学部受験へ向かうための最初の土台を作ります。",
        summary: "未習・苦手のまま進ませず、学習の入口を明確にして、毎週続けられる課題へ落とし込みます。",
        bestFor: ["未習単元が多い", "何を理解していないか分からない", "学習ペースを作り直したい"],
        outcomes: ["前提知識の確認", "学習ペースの確立", "高校内容へ進む準備"],
        steps: [
          { title: "入口を決める", body: "戻るべき単元と優先順位を決めます。" },
          { title: "小さく積む", body: "短い課題で成功体験を作り、継続を重視します。" },
          { title: "高校内容へ接続", body: "前提が整った単元から、次のレベルへ進みます。" },
        ],
        supports: ["初歩設計", "課題管理", "質問し放題", "進捗確認", "個別授業追加"],
      },
    ],
  },
  "medical-prep": {
    id: "medical-prep",
    tone: "senior",
    parentHref: "/top/course/medical-prep/",
    courseTitle: "メディカル準備コース（高等部）",
    courseEnglish: "Medical Prep Course",
    courseLabel: "高校生の先取り",
    heroLead: "高校生のうちに医学部受験の準備を前倒しする。学校進度、志望校、内部進学の有無に合わせ、先取り範囲と課題量を設計します。",
    parentLabel: "高等部コースへ戻る",
    plans: [
      {
        slug: "top-level",
        title: "トップレベル先取りプラン",
        badge: "最難関医学部",
        target: "東大、慶應など、医学部のトップ",
        level: "偏差値65相当",
        price: "¥28,000〜",
        lead: "高1・高2の段階から、最難関医学部に必要な範囲と演習レベルへ早めに接続します。",
        summary: "学校の進度に余裕がある生徒へ、先取りと発展演習を組み合わせて、受験学年で過去問に入れる状態を作ります。",
        bestFor: ["学校内容に余裕がある", "東大・慶應などを早期から狙いたい", "先取りと演習を両立したい"],
        outcomes: ["高校範囲の早期完成", "発展問題への接続", "受験学年の過去問準備"],
        steps: [
          { title: "到達時期を設定", body: "志望校から逆算し、いつまでに高校範囲を終えるか決めます。" },
          { title: "先取り授業", body: "必要な単元から高校内容を前倒しで進めます。" },
          { title: "発展演習", body: "理解した単元を演習で使える形にします。" },
        ],
        supports: ["パーソナル授業", "課題管理", "効果測定", "オンライン対応", "志望校設計"],
      },
      {
        slug: "high-level",
        title: "ハイレベル先取りプラン",
        badge: "難関医学部",
        target: "国公立、慈恵、順天など、難関医学部",
        level: "偏差値60相当",
        price: "¥28,000〜",
        lead: "難関医学部を見据え、標準範囲の完成と応用への橋渡しを高校生のうちから進めます。",
        summary: "学校内容を追うだけで終わらせず、定着確認と先取りを並行し、受験学年の負担を軽くします。",
        bestFor: ["学校進度より少し先へ進みたい", "国公立・難関私立を狙いたい", "高2までに主要範囲を固めたい"],
        outcomes: ["標準範囲の早期定着", "応用問題への準備", "学習ペースの安定"],
        steps: [
          { title: "学校進度を確認", body: "定期試験とのバランスを取りながら先取り範囲を決めます。" },
          { title: "単元を先取り", body: "主要科目を中心に、受験に必要な範囲を前倒しします。" },
          { title: "確認演習", body: "理解した単元を演習と小テストで定着させます。" },
        ],
        supports: ["パーソナル授業", "課題管理", "効果測定", "質問対応", "受験校相談"],
      },
      {
        slug: "standard",
        title: "標準レベル先取りプラン",
        badge: "上位私立医学部",
        target: "昭和、東医など上位の私立医学部",
        level: "偏差値55相当",
        price: "¥44,000〜",
        lead: "高校内容を確実に理解しながら、医学部受験の標準問題へ早めに接続します。",
        summary: "先取りを急ぎすぎず、学校内容、基礎演習、定着確認の順に積み上げて、受験準備を安定させます。",
        bestFor: ["先取りしたいが基礎も不安", "私立医学部を現役で狙いたい", "定期試験と受験準備を両立したい"],
        outcomes: ["基礎から標準への接続", "定期試験との両立", "演習習慣の固定"],
        steps: [
          { title: "基礎を確認", body: "学校内容の理解度を確認し、穴を残さず進めます。" },
          { title: "先取りを追加", body: "余力のある単元から、受験範囲へ前倒しします。" },
          { title: "演習で定着", body: "小テストと課題で、使える知識へ変えます。" },
        ],
        supports: ["個別授業", "課題管理", "効果測定", "定期試験相談", "質問対応"],
      },
      {
        slug: "basic",
        title: "基礎レベル先取りプラン",
        badge: "校内上位へ",
        target: "定期試験で校内上位の成績",
        level: "偏差値50相当",
        price: "¥44,000〜",
        lead: "まずは学校内容を強くし、定期試験で上位を狙える基礎力を作ります。",
        summary: "内部進学や推薦も見据え、学校成績を安定させながら、少しずつ受験準備へ接続します。",
        bestFor: ["学校成績を上げたい", "基礎から丁寧に進めたい", "内部進学・推薦の準備もしたい"],
        outcomes: ["学校内容の定着", "定期試験対策の習慣化", "受験準備への入口作り"],
        steps: [
          { title: "学校範囲を整える", body: "授業進度に合わせ、理解不足を確認します。" },
          { title: "課題で反復", body: "定期試験に必要な演習量を確保します。" },
          { title: "次の単元へ進む", body: "安定した単元から少しずつ先取りへ移ります。" },
        ],
        supports: ["定期試験対策", "課題管理", "個別授業", "質問対応", "進捗確認"],
      },
      {
        slug: "keio-internal",
        title: "慶應内部進学プラン",
        badge: "内部進学",
        target: "慶應義塾大学 医学部",
        level: "特に制限なし",
        price: "¥28,000〜",
        lead: "慶應医学部への内部進学を見据え、学校成績、理解度、提出課題まで含めて学習を整えます。",
        summary: "内部進学では日々の学習の積み重ねが重要です。学校別の進度に合わせ、必要な科目を丁寧に支えます。",
        bestFor: ["慶應医学部への内部進学を考えている", "学校成績を安定させたい", "早めに学習管理を始めたい"],
        outcomes: ["学校進度への対応", "定期試験の安定", "内部進学へ向けた継続学習"],
        steps: [
          { title: "学校進度を把握", body: "授業・試験・提出物の流れを確認します。" },
          { title: "科目別に補強", body: "必要科目を優先して個別に支えます。" },
          { title: "成績を管理", body: "試験前だけでなく、日常の課題まで追います。" },
        ],
        supports: ["内部進学対策", "定期試験対策", "課題管理", "個別授業", "学習相談"],
      },
      {
        slug: "nichidai-internal",
        title: "日大内部進学プラン",
        badge: "内部進学",
        target: "日本大学 医学部",
        level: "特に制限なし",
        price: "¥28,000〜",
        lead: "日本大学医学部への内部進学を見据え、学校成績と学習習慣を早期から安定させます。",
        summary: "学校進度に合わせた予習復習、定期試験対策、弱点補強を組み合わせ、医学部進学に必要な土台を作ります。",
        bestFor: ["日大医学部への内部進学を考えている", "学校内容を確実にしたい", "定期試験の得点を安定させたい"],
        outcomes: ["学校内容の定着", "定期試験の安定", "内部進学へ向けた学習習慣"],
        steps: [
          { title: "進度を確認", body: "学校の授業と試験範囲を把握します。" },
          { title: "弱点を補強", body: "苦手科目を個別に対策します。" },
          { title: "試験前に仕上げる", body: "定期試験前は演習量を増やし、得点に直結させます。" },
        ],
        supports: ["内部進学対策", "定期試験対策", "個別授業", "質問対応", "課題管理"],
      },
    ],
  },
  "medical-prep-junior": {
    id: "medical-prep-junior",
    tone: "junior",
    parentHref: "/top/course/medical-prep-junior/",
    courseTitle: "メディカル準備コース（中等部）",
    courseEnglish: "Medical Prep Course",
    courseLabel: "中学生の先取り",
    heroLead: "中学生のうちから、医学部受験へ向けた基礎力と学習習慣を整える。中高一貫校の進度に合わせ、高校範囲へ自然に接続します。",
    parentLabel: "中等部コースへ戻る",
    plans: [
      {
        slug: "top-level",
        title: "トップレベル先取りプラン",
        badge: "最速先取り",
        target: "高1の9月までに高3の全範囲修了",
        level: "偏差値65相当",
        price: "¥28,000〜",
        lead: "中学生のうちから高校範囲へ進み、最難関医学部を狙うための時間的優位を作ります。",
        summary: "基礎の穴を残さず、英数を中心に先取りを進め、高1段階で高3範囲へ到達する設計です。",
        bestFor: ["中学内容に余裕がある", "最難関医学部を早期から狙いたい", "中高一貫校の進度を活かしたい"],
        outcomes: ["高校範囲への早期接続", "英数の先取り習慣", "発展演習への準備"],
        steps: [
          { title: "中学内容を確認", body: "先取りに必要な基礎の穴を確認します。" },
          { title: "高校範囲へ進む", body: "英数を中心に、理解できる単位で前倒しします。" },
          { title: "演習で固定", body: "小テストと復習で、先取り内容を定着させます。" },
        ],
        supports: ["中高一貫校対応", "パーソナル授業", "課題管理", "効果測定", "オンライン対応"],
      },
      {
        slug: "high-level",
        title: "ハイレベル先取りプラン",
        badge: "難関医学部へ",
        target: "高2の4月までに高3の範囲修了",
        level: "偏差値60相当",
        price: "¥28,000〜",
        lead: "中学内容を固めながら、高校範囲を無理なく先取りし、医学部受験の準備を早めます。",
        summary: "学校進度と本人の理解度に合わせ、基礎固めと先取りを両立するバランス型のプランです。",
        bestFor: ["難関医学部を視野に入れている", "先取りと基礎固めを両立したい", "学習習慣を安定させたい"],
        outcomes: ["主要単元の早期定着", "高校範囲への自然な接続", "継続できる学習ペース"],
        steps: [
          { title: "基礎を固める", body: "中学内容の理解を確認し、穴を潰します。" },
          { title: "単元を先取り", body: "学校進度を見ながら高校範囲へ進めます。" },
          { title: "確認を重ねる", body: "課題と小テストで定着度を追います。" },
        ],
        supports: ["先取り設計", "課題管理", "個別授業", "質問対応", "効果測定"],
      },
      {
        slug: "standard",
        title: "標準レベル先取りプラン",
        badge: "着実な準備",
        target: "高2の9月までに高3の範囲修了",
        level: "偏差値55相当",
        price: "¥44,000〜",
        lead: "中学内容の定着を重視しながら、高校範囲へ段階的につなげるプランです。",
        summary: "先取りを急ぎすぎず、学習習慣と基礎学力を整え、医学部受験へ向けた長期戦の土台を作ります。",
        bestFor: ["まずは基礎を安定させたい", "無理なく先取りしたい", "学校成績も大切にしたい"],
        outcomes: ["基礎学力の安定", "学習習慣の固定", "高校範囲への段階的接続"],
        steps: [
          { title: "学習習慣を整える", body: "毎週の課題と復習を固定します。" },
          { title: "基礎を確認", body: "英数を中心に、理解不足を丁寧に補います。" },
          { title: "先取りへ進む", body: "準備ができた単元から高校内容へ接続します。" },
        ],
        supports: ["学習習慣づくり", "課題管理", "個別授業", "質問対応", "定期試験相談"],
      },
    ],
  },
};

export const getCoursePlanPage = (groupId: CoursePlanGroupId, slug: string): CoursePlanPage | undefined => {
  const group = coursePlanGroups[groupId];
  const plan = group.plans.find((item) => item.slug === slug);
  if (!plan) return undefined;

  return {
    group,
    plan: withHref(group, plan),
    siblings: group.plans.filter((item) => item.slug !== slug).map((item) => withHref(group, item)),
  };
};

export const getCoursePlanStaticPaths = (groupId: CoursePlanGroupId) => {
  const group = coursePlanGroups[groupId];
  return group.plans.map((plan) => ({
    params: { plan: plan.slug },
    props: { planPage: getCoursePlanPage(groupId, plan.slug) },
  }));
};

export const getCoursePlanHrefs = (groupId: CoursePlanGroupId) => {
  const group = coursePlanGroups[groupId];
  return group.plans.map((plan) => withHref(group, plan).href);
};
