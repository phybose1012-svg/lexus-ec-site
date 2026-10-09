/**
 * Public safety layer for the 81 migrated university overview pages.
 * Their schedule/subject tables mix old years and have not been verified as a
 * current admissions guide. Keep the overview, but route current applications
 * to the named university. Do not advance dates or certify the archived numbers.
 */
export const universityInfoOfficialSources = [
  ["yamanashi", "山梨大学", "https://www.yamanashi.ac.jp/"],
  ["tokushima", "徳島大学", "https://www.tokushima-u.ac.jp/"],
  ["saga", "佐賀大学", "https://www.saga-u.ac.jp/"],
  ["hirosaki", "弘前大学", "https://www.hirosaki-u.ac.jp/"],
  ["asahikawaika", "旭川医科大学", "https://www.asahikawa-med.ac.jp/"],
  ["shimane", "島根大学", "https://www.shimane-u.ac.jp/"],
  ["yamaguchi", "山口大学", "https://www.yamaguchi-u.ac.jp/"],
  ["miyazaki", "宮崎大学", "https://www.miyazaki-u.ac.jp/"],
  ["akita", "秋田大学", "https://www.akita-u.ac.jp/"],
  ["yamagata", "山形大学", "https://www.yamagata-u.ac.jp/jp/"],
  ["tottori", "鳥取大学", "https://www.tottori-u.ac.jp/"],
  ["fukui", "福井大学", "https://www.u-fukui.ac.jp/"],
  ["toyama", "富山大学", "https://www.u-toyama.ac.jp/"],
  ["ryukyu", "琉球大学", "https://www.u-ryukyu.ac.jp/"],
  ["nara", "奈良県立医科大学", "https://www.naramed-u.ac.jp/"],
  ["shigaika", "滋賀医科大学", "https://www.shiga-med.ac.jp/"],
  ["kagawa", "香川大学", "https://www.kagawa-u.ac.jp/"],
  ["sapporoika", "札幌医科大学", "https://web.sapmed.ac.jp/"],
  ["gunma", "群馬大学", "https://www.gunma-u.ac.jp/"],
  ["fukushima", "福島県立医科大学", "https://www.fmu.ac.jp/"],
  ["kagoshima", "鹿児島大学", "https://www.kagoshima-u.ac.jp/"],
  ["kochi", "高知大学", "https://www.kochi-u.ac.jp/"],
  ["wakayama", "和歌山県立医科大学", "https://www.wakayama-med.ac.jp/"],
  ["mie", "三重大学", "https://www.mie-u.ac.jp/"],
  ["oita", "大分大学", "https://www.oita-u.ac.jp/"],
  ["osakakouritsu", "大阪公立大学", "https://www.omu.ac.jp/"],
  ["kobe", "神戸大学", "https://www.kobe-u.ac.jp/"],
  ["kyotofuritsu", "京都府立医科大学", "https://www.kpu-m.ac.jp/"],
  ["gifu", "岐阜大学", "https://www.gifu-u.ac.jp/"],
  ["shinsyu", "信州大学", "https://www.shinshu-u.ac.jp/"],
  ["yokohama", "横浜市立大学", "https://www.yokohama-cu.ac.jp/"],
  ["kyusyu", "九州大学", "https://www.kyushu-u.ac.jp/ja/"],
  ["tsukuba", "筑波大学", "https://www.tsukuba.ac.jp/"],
  ["ehime", "愛媛大学", "https://www.ehime-u.ac.jp/"],
  ["hamamatsu", "浜松医科大学", "https://www.hama-med.ac.jp/"],
  ["nigata", "新潟大学", "https://www.niigata-u.ac.jp/"],
  ["hokkaido", "北海道大学", "https://www.hokudai.ac.jp/"],
  ["nagasaki", "長崎大学", "https://www.nagasaki-u.ac.jp/"],
  ["nagoya", "名古屋大学", "https://www.nagoya-u.ac.jp/"],
  ["tokyokagaku", "東京科学大学", "https://www.isct.ac.jp/ja"],
  ["hiroshima", "広島大学", "https://www.hiroshima-u.ac.jp/"],
  ["kumamoto", "熊本大学", "https://www.kumamoto-u.ac.jp/"],
  ["nagoyaishiritu", "名古屋市立大学", "https://www.nagoya-cu.ac.jp/"],
  ["okayama", "岡山大学", "https://www.okayama-u.ac.jp/"],
  ["chiba", "千葉大学", "https://www.m.chiba-u.ac.jp/"],
  ["kanazawa", "金沢大学", "https://www.kanazawa-u.ac.jp/"],
  ["osaka", "大阪大学", "https://www.osaka-u.ac.jp/ja"],
  ["kyoto", "京都大学", "https://www.kyoto-u.ac.jp/ja"],
  ["tohoku", "東北大学", "https://www.tohoku.ac.jp/"],
  ["tokyo", "東京大学", "https://www.u-tokyo.ac.jp/ja/admissions/"],
  ["fujita", "藤田医科大学", "https://www.fujita-hu.ac.jp/"],
  ["fukuoka", "福岡大学", "https://www.fukuoka-u.ac.jp/"],
  ["hyogo", "兵庫医科大学", "https://www.hyo-med.ac.jp/"],
  ["nichidai", "日本大学", "https://www.med.nihon-u.ac.jp/"],
  ["nihonika", "日本医科大学", "https://www.nms.ac.jp/"],
  ["dokkyo", "獨協医科大学", "https://www.dokkyomed.ac.jp/dmu/"],
  ["tohokuika", "東北医科薬科大学", "https://www.tohoku-mpu.ac.jp/"],
  ["toho", "東邦大学", "https://www.toho-u.ac.jp/"],
  ["jyoshiika", "東京女子医科大学", "https://www.twmu.ac.jp/univ/"],
  ["jikei", "東京慈恵会医科大学", "https://www.jikei.ac.jp/"],
  ["tokyoika", "東京医科大学", "https://www.tokyo-med.ac.jp/"],
  ["tokai", "東海大学", "https://www.u-tokai.ac.jp/"],
  ["teikyo", "帝京大学", "https://www.teikyo-u.ac.jp/"],
  ["saint", "聖マリアンナ医科大学", "https://www.marianna-u.ac.jp/"],
  ["showa", "昭和医科大学", "https://www.showa-u.ac.jp/"],
  ["jyunten", "順天堂大学", "https://www.juntendo.ac.jp/"],
  ["jichi", "自治医科大学", "https://www.jichi.ac.jp/"],
  ["sangyoika", "産業医科大学", "https://www.uoeh-u.ac.jp/"],
  ["saitama", "埼玉医科大学", "https://www.saitama-med.ac.jp/"],
  ["kokusai", "国際医療福祉大学", "https://www.iuhw.ac.jp/"],
  ["keio", "慶應義塾大学", "https://www.keio.ac.jp/ja/"],
  ["kurume", "久留米大学", "https://www.kurume-u.ac.jp/"],
  ["kinki", "近畿大学", "https://www.kindai.ac.jp/medicine/admissions/exam/"],
  ["kyorin", "杏林大学", "https://www.kyorin-u.ac.jp/"],
  ["kitasato", "北里大学", "https://www.kitasato-u.ac.jp/jp/index.html"],
  ["kansai", "関西医科大学", "https://www.kmu.ac.jp/"],
  ["kawasaki", "川崎医科大学", "https://m.kawasaki-m.ac.jp/"],
  ["osakaika", "大阪医科薬科大学", "https://www.ompu.ac.jp/"],
  ["iwate", "岩手医科大学", "https://www.iwate-med.ac.jp/"],
  ["aichi", "愛知医科大学", "https://www.aichi-med-u.ac.jp/"],
  ["kanazawaika", "金沢医科大学", "https://www.kanazawa-med.ac.jp/medicine_exam/"],
].map(([slug, university, officialUrl]) => ({
  path: `/information-${slug}/`, university, officialUrl,
}));

const officialSourceByPath = new Map(universityInfoOfficialSources.map(source => [source.path, source]));

type UniversityOverviewPost = {
  path: string;
  template?: string;
  title: string;
  displayTitle?: string;
  displayTitleLines?: string[];
  description: string;
  lead: string;
  keyPoints: string[];
  infoItems: { label: string; value: string }[];
  toc: { id: string; text: string; level?: number }[];
  contentHtml: string;
  modified: string;
};

const plainText = (value: string) => value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const officialSectionId = "最新の入試情報";

export function transformUniversityInfoPost<T extends UniversityOverviewPost>(post: T): T {
  const source = officialSourceByPath.get(post.path);
  if (!source || post.template !== "admission-info") return post;

  const name = escapeHtml(source.university);
  const url = escapeHtml(source.officialUrl);
  const overviewNotice = `<p data-university-info-safety="overview"><strong>掲載情報について</strong>　このページは${name}医学部の大学概要を知るための参考情報です。男女比・現浪比などは本文に示した過年度の数値です。学納金や教育内容も変更されることがあるため、現在の情報は大学公式サイトでご確認ください。</p>`;
  const admissionSection = `<h2 id="${officialSectionId}">最新の入試情報を確認する</h2><p>出願期間、試験日、会場、受験科目・配点、出願資格は、受験する年度と選抜方式によって異なります。出願や受験計画には、${name}が公表する該当年度の学生募集要項と変更のお知らせをご確認ください。</p><p><a href="${url}">${name}公式サイトで入試情報を確認する</a></p><ul><li>医学部医学科の対象年度・選抜方式を確認する。</li><li>出願締切の時刻、必着・消印有効、必要書類の提出期限を確認する。</li><li>一次・二次試験の日時・会場、科目・配点、合格発表と入学手続の期限を確認する。</li><li>大学の変更通知と、受験票に記載された指定を確認する。</li></ul>`;

  // Each migrated overview has top-level h2 blocks. Replace the entire old
  // admissions block, including its schedule, venues, scores and nested tables.
  // University overview and university-characteristics blocks stay separate.
  let admissionsReplaced = false;
  let html = post.contentHtml.replace(/<h2\b[^>]*>[\s\S]*?<\/h2>[\s\S]*?(?=<h2\b|$)/gi, block => {
    const heading = plainText(block.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i)?.[1] ?? "");
    if (heading === "一般選抜情報" || heading === "一次選抜情報" || heading === "最新の入試情報を確認する") {
      if (admissionsReplaced) return "";
      admissionsReplaced = true;
      return admissionSection;
    }
    if (heading === "募集要項") return "";
    return block;
  });
  if (!admissionsReplaced) html += admissionSection;
  // The Tokai overview incorrectly pointed to Juntendo's student portal.
  // Preserve the surrounding text, but never retain the wrong university link.
  if (post.path === "/information-tokai/") {
    html = html.replace(/<a\b[^>]*href=["']https?:\/\/[^"']*juntendo\.ac\.jp[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi, "$1");
  }
  html = html.replace(/<h3\b([^>]*)>([\s\S]*?)<\/h3>/gi, (tag, attrs, inner) =>
    plainText(inner) === "学納金" ? `<h3${attrs}>学納金（掲載時点の参考情報）</h3>` : tag);
  // Idempotent when callers run the transformation more than once.
  html = html.replace(/<p\b[^>]*data-university-info-safety=["']overview["'][^>]*>[\s\S]*?<\/p>/gi, "");
  html = overviewNotice + html;
  const toc = [...html.matchAll(/<h([23])\b[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map(match => ({id: match[2], text: plainText(match[3]), level: Number(match[1]) as 2 | 3}));

  return {
    ...post,
    modified: "2026-10-09",
    title: `${source.university}医学部｜大学概要・公式入試情報`,
    displayTitle: `${source.university} 医学部 大学概要・公式入試情報`,
    displayTitleLines: [`${source.university} 医学部`, "大学概要・公式入試情報"],
    description: `${source.university}医学部の大学概要と公式入試情報への案内。掲載統計・学納金は過年度の参考情報です。出願日程、受験科目・配点、出願資格は、大学公式の該当年度の学生募集要項でご確認ください。`,
    lead: `${source.university}医学部の大学概要と、入試情報の確認先をご案内します。出願や受験計画を立てる際は、大学公式の該当年度の学生募集要項をご確認ください。`,
    keyPoints: [
      `${source.university}医学部の大学概要を確認できます。`,
      "掲載統計・学納金は過年度の参考情報です。",
      "出願日程、試験科目・配点、出願資格は大学公式の該当年度の学生募集要項をご確認ください。",
    ],
    infoItems: post.infoItems.map(item => item.label === "年度"
      ? {...item, value: "過年度参考（最新は大学公式要項）"}
      : item.label === "種別" ? {...item, value: "大学概要・公式入試情報"} : item),
    toc,
    contentHtml: html,
  };
}
