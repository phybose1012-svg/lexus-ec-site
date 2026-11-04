import type { PrivateMedicalExamVenue2027, PrivateMedicalExamVenueAssignment2027 } from "./privateMedicalExamVenues2027.ts";

export const novemberVenueVerifiedAt2027 = "2026-11-04T00:00:00+09:00";
export const novemberGuidelines2027 = {
  iwate: "https://www.imu-admission.jp/wp/wp-content/uploads/2026/09/00_ALL.pdf",
  tokai: "https://www.u-tokai.ac.jp/uploads/2021/02/ad9026c1801ebd0045d9d2534dcb5b07.pdf",
  kindai: "https://kindai.jp/assets/pdf/exam/2027_nyushiyoko_a4.pdf",
  nihon: "https://exam.nihon-u.ac.jp/export/sites/default/guidance/net-nihon-u/gid/pdf/nihon_yoko_ippan_all.pdf",
  toho: "https://www.toho-u.ac.jp/info_exam/med_2027ippan.pdf",
  tohoUnified: "https://www.toho-u.ac.jp/info_exam/med_2027tnyushi.pdf",
  jikei: "https://www.jikei.ac.jp/wp-content/uploads/2026/10/Application_Guidelines_for_Admission_2027.pdf",
  kitasato: "https://www.kitasato-u.ac.jp/jp/goukaku/albums/abm.php?f=abm00050193.pdf&n=2027%E5%B9%B4%E5%BA%A6%E4%B8%80%E8%88%AC%E9%81%B8%E6%8A%9C%E5%8B%9F%E9%9B%86%E8%A6%81%E9%A0%85_%E5%85%A8%E9%A0%81.pdf",
  kurume: "https://storage.googleapis.com/p_638f0121169658622e1dd8f6/bca25fbe-80c8-4d37-9ec6-edec393ee1ab/2027%E4%B8%80%E8%88%AC%E5%85%B1%E3%83%86_%E5%8B%9F%E9%9B%86%E8%A6%81%E9%A0%85_%E5%85%B1%E9%80%9A.pdf",
  showa: "https://adm.showa-u.ac.jp/albums/abm.php?d=2405&f=abm00073368.pdf",
  fujita: "https://www.fujita-hu.ac.jp/admission/vsfo8q0000007l3n-att/tedb9e000000p7j6.pdf",
} as const;

type VenueSeed = [slug: string, name: string, prefecture: string, municipality: string, address: string, station: string, source: keyof typeof novemberGuidelines2027, access: string];
// 学部・段階の適用を原本表で確認した施設のみ。地図の内部ラベルは住所・入口の根拠にしない。
const seeds: VenueSeed[] = [
  ["osaka-garden-palace", "大阪ガーデンパレス", "大阪府", "大阪市淀川区", "大阪府大阪市淀川区西宮原1-3-35", "新大阪駅", "iwate", "岩手医科大学の一般一次・二次に使用。指定階・室は受験票で確認。"],
  ["sapporo-garden-palace", "ホテル札幌ガーデンパレス", "北海道", "札幌市中央区", "北海道札幌市中央区北1条西6丁目", "札幌駅・さっぽろ駅・大通駅", "iwate", "岩手医科大学の一般一次のみ。冬季の積雪・凍結を見込んで移動。"],
  ["tkp-premium-meieki-nishiguchi", "TKPガーデンシティPREMIUM名駅西口", "愛知県", "名古屋市中村区", "愛知県名古屋市中村区則武1-6-3", "名古屋駅", "iwate", "名古屋駅前・名古屋新幹線口のTKPとは別施設。"],
  ["tkp-premium-tenjin-skyhall", "TKPガーデンシティPREMIUM天神スカイホール", "福岡県", "福岡市中央区", "福岡県福岡市中央区天神1-4-1 西日本新聞会館16階", "天神駅・天神南駅", "iwate", "天神ブリッククロスは歯学部向けで、医学部一次と混同しない。"],
  ["bellesalle-kanda", "ベルサール神田", "東京都", "千代田区", "東京都千代田区神田美土代町7 住友不動産神田ビル", "小川町駅・淡路町駅・神田駅", "iwate", "岩手医科大学の一般二次東京会場。一次の高田馬場・渋谷とは別。"],
  ["tkp-premium-minatomirai", "TKPガーデンシティPREMIUMみなとみらい", "神奈川県", "横浜市西区", "神奈川県横浜市西区みなとみらい3-6-3 MMパークビル5階", "みなとみらい駅4a出口", "tokai", "駅4a出口より徒歩約1分。桜木町駅北1出口より徒歩約15分。"],
  ["shuei-nagoya", "秀英予備校 名古屋本部校", "愛知県", "名古屋市千種区", "愛知県名古屋市千種区内山3-23-12", "千種駅3番出口", "tokai", "千種駅3番出口より徒歩約1分。名古屋駅周辺の会場ではない。"],
  ["civi-shinosaka-east", "CIVI研修センター新大阪東", "大阪府", "大阪市東淀川区", "大阪府大阪市東淀川区東中島1-19-4 ルーシッドスクエア新大阪5・6階", "新大阪駅東口", "tokai", "JR新大阪駅東口より徒歩約1分。旧新大阪NLCビル。"],
  ["papillon24", "パピヨン24", "福岡県", "福岡市博多区", "福岡県福岡市博多区千代1-17-1", "千代県庁口駅4番出口", "tokai", "地下鉄箱崎線千代県庁口駅4番出口直結。使用室は受験票で確認。"],
  ["tokai-shonan", "東海大学 湘南キャンパス", "神奈川県", "平塚市", "神奈川県平塚市北金目4-1-1", "東海大学前駅南口", "tokai", "医学部一次の予備試験場。各会場の収容状況により選択可能となる場合のみ。駅より徒歩約15分、北門経由のバスも案内。二次の伊勢原とは異なる。"],
  ["tokai-isehara", "東海大学 伊勢原キャンパス", "神奈川県", "伊勢原市", "神奈川県伊勢原市下糟屋143", "伊勢原駅北口", "tokai", "医学部二次。伊勢原駅北口から徒歩約15分または東海大学病院行きバス。東海大学前駅ではない。"],
  ["kindai-higashiosaka", "近畿大学 東大阪キャンパス", "大阪府", "東大阪市", "大阪府東大阪市小若江3-4-1", "近鉄大阪線長瀬駅・近鉄奈良線八戸ノ里駅", "kindai", "医学部一般一次の大阪会場。二次は堺市のおおさかメディカルキャンパスで、東大阪ではない。長瀬駅より徒歩約10分。"],
  ["tkp-shinshiodome", "TKP新橋汐留カンファレンスセンター", "東京都", "港区", "東京都港区東新橋1-1-16 汐留FSビル4〜8・10〜11階", "新橋駅・汐留駅", "kindai", "医学部一般前期の東京会場。TKP新橋カンファレンスセンターとは別。"],
  ["yozemi-honbu", "代々木ゼミナール 本部校代ゼミタワー", "東京都", "渋谷区", "東京都渋谷区代々木2-25-7", "新宿駅・南新宿駅", "kindai", "医学部一般後期の東京会場。前期のTKP新橋汐留とは別。"],
  ["tkp-nagoya-ekimae-cc", "TKP名古屋駅前カンファレンスセンター", "愛知県", "名古屋市中村区", "愛知県名古屋市中村区名駅2-41-5 CK20名駅前ビル5〜6・8階", "名古屋駅", "kindai", "医学部一般前期のみ。名称にPREMIUMが付く別施設へ取り違えない。"],
  ["hiroshima-ja-building", "広島県JAビル", "広島県", "広島市中区", "広島県広島市中区大手町4-7-3", "市役所前停留場", "kindai", "医学部一般前期のみ。使用室・受験生入口は受験票で確認。"],
  ["kitayobi-hakata", "北九州予備校 博多駅校", "福岡県", "福岡市博多区", "福岡県福岡市博多区博多駅前1-21-4", "博多駅博多口", "kindai", "医学部一般前期のみ。小倉駅校など他校舎とは別。"],
  ["tkp-premium-sendai-west", "TKPガーデンシティPREMIUM仙台西口", "宮城県", "仙台市青葉区", "宮城県仙台市青葉区花京院1-2-15 ソララプラザ4・6階", "仙台駅西口", "nihon", "N第1期。仙台駅西口より徒歩3分。"],
  ["nihon-koriyama", "日本大学 工学部校舎1号館", "福島県", "郡山市", "福島県郡山市田村町徳定字中河原1", "安積永盛駅・郡山駅", "nihon", "N第1・2期。安積永盛駅より徒歩15分、郡山駅からバス約20分。医学部の板橋校舎とは別。"],
  ["tsukuba-congress", "つくば国際会議場", "茨城県", "つくば市", "茨城県つくば市竹園2-20-3", "つくば駅A3出口", "nihon", "N第1期。つくば駅A3出口から歩行者専用道路を直進し徒歩10分。"],
  ["sano-junior-college", "佐野日本大学短期大学", "栃木県", "佐野市", "栃木県佐野市高萩町1297", "佐野駅から佐野短大停留所", "nihon", "N第1期。佐野駅からバス約15分。佐野日本大学高校・中等教育学校とは異なる。"],
  ["eterna-takasaki", "エテルナ高崎", "群馬県", "高崎市", "群馬県高崎市栄町22-30", "高崎駅東口", "nihon", "N第1期。高崎駅東口より徒歩3分。"],
  ["nihon-tsudanuma", "日本大学 生産工学部津田沼校舎", "千葉県", "習志野市", "千葉県習志野市泉町1-2-1", "京成大久保駅", "nihon", "N第1・2期。京成大久保駅から徒歩経路。特急は停車しない。実際の校舎・教室は受験票で確認。"],
  ["nihon-bunri", "日本大学 文理学部校舎", "東京都", "世田谷区", "東京都世田谷区桜上水3-25-40", "桜上水駅・下高井戸駅", "nihon", "N第1期の医学部志願者用東京会場。両駅より徒歩8分。他学部の東京会場を無条件に医学部用へ流用しない。"],
  ["nihon-commerce", "日本大学 商学部校舎", "東京都", "世田谷区", "東京都世田谷区砧5-2-1", "祖師ヶ谷大蔵駅", "nihon", "N第2期の医学部志願者用東京会場。祖師ヶ谷大蔵駅より徒歩12分。"],
  ["tokyo-tama-messe", "東京たま未来メッセ", "東京都", "八王子市", "東京都八王子市明神町3-19-2", "京王八王子駅中央口・八王子駅北口", "nihon", "N第1期。京王八王子駅中央口から2分、JR八王子駅北口から5分。"],
  ["vision-yokohama-minatomirai", "ビジョンセンター横浜みなとみらい", "神奈川県", "横浜市西区", "神奈川県横浜市西区みなとみらい3-6-1 センタービル7階", "みなとみらい駅4b出口", "nihon", "N第1期。4番出口から4b出口直結。試験室は受験票で確認。"],
  ["nihon-shonan", "日本大学 生物資源科学部校舎", "神奈川県", "藤沢市", "神奈川県藤沢市亀井野1866", "六会日大前駅", "nihon", "N第1・2期。小田急江ノ島線六会日大前駅より徒歩3分。東海大学湘南キャンパスとは別。"],
  ["toki-messe", "朱鷺メッセ 新潟コンベンションセンター", "新潟県", "新潟市中央区", "新潟県新潟市中央区万代島6-1", "新潟駅から朱鷺メッセ停留所", "nihon", "N第1期。新潟駅からバス約15分。指定入口・室は受験票で確認。"],
  ["chateraise-nagano", "シャトレーゼホテル長野", "長野県", "長野市", "長野県長野市七瀬1-1", "長野駅東口", "nihon", "N第1期。長野駅より徒歩約5分。"],
  ["nihon-mishima", "日本大学 国際関係学部三島駅北口校舎", "静岡県", "三島市", "静岡県三島市文教町1-9-18", "三島駅北口", "nihon", "N第1期。JR三島駅北口より徒歩1分。三島校舎など別の棟と混同しない。"],
  ["nagoya-chamber", "名古屋商工会議所", "愛知県", "名古屋市中区", "愛知県名古屋市中区栄2-10-19 名古屋商工会議所ビル", "伏見駅5番出口", "nihon", "N第1期。伏見駅5番出口より徒歩5分。"],
  ["ap-osaka-chayamachi", "AP大阪茶屋町", "大阪府", "大阪市北区", "大阪府大阪市北区茶屋町1-27 ABC-MART梅田ビル8階", "阪急大阪梅田駅・大阪駅御堂筋北口", "nihon", "N第1期。阪急大阪梅田駅1分、JR大阪駅御堂筋北口3分。"],
  ["hiroshima-sangyo-west", "広島県立広島産業会館 西展示館", "広島県", "広島市南区", "広島県広島市南区比治山本町16-31 広島産業文化センター1階", "南区役所前停留場", "nihon", "N第1期。南区役所前停留場から徒歩1分。本館・東展示館とは別。"],
  ["fukuoka-chamber", "福岡商工会議所", "福岡県", "福岡市博多区", "福岡県福岡市博多区博多駅前2-9-28", "博多駅博多口・祇園駅5番出口", "nihon", "N第1期。博多駅博多口から8分、祇園駅5番出口から3分。"],
  ["nagasaki-nihon-high", "長崎日本大学高等学校", "長崎県", "諫早市", "長崎県諫早市貝津町1555", "西諫早駅", "nihon", "N第1期。西諫早駅から徒歩10分。長崎駅周辺の会場ではない。"],
  ["miyazaki-nihon-high", "宮崎日本大学高等学校", "宮崎県", "宮崎市", "宮崎県宮崎市島之内6822-2", "日向住吉駅", "nihon", "N第1期。日向住吉駅から南へ徒歩15分。宮崎駅ではない。"],
];

export const novemberVenues2027: PrivateMedicalExamVenue2027[] = seeds.map(([slug,name,prefecture,municipality,address,station,source,access]) => ({
  venueId: `venue-${slug}`, academicYear: 2027, name, shortName: name, address, prefecture, municipality,
  nearestStations: [station], officialUrl: novemberGuidelines2027[source], officialUrlLabel: "大学公式2027年度募集要項の会場案内",
  accessNote: `${access} 記載は大学募集要項の案内です。施設の一般受付・営業時間を試験指定とみなさず、受験票と大学の最終案内で階・室・入口・時刻を確認してください。`,
  reviewState: "verified", verifiedAt: novemberVenueVerifiedAt2027,
}));

// 施設の一般アクセスと新要項の試験指定を分離。旧「要項公開待ち」を残さない。
export const novemberCampusPolicies2027: Record<string, {source: keyof typeof novemberGuidelines2027; note: string}> = {
  "venue-jikei-nishishimbashi-campus": {source:"jikei", note:"御成門駅A5出口から大学公式徒歩約3分。一般二次の使用棟は西新橋キャンパス大学1号館です。2月20〜22日の大学指定日で、都合のつかない日を1日申請可（希望に添えない場合あり）。個人の集合日時・場所は一次合格発表時に指定、受付は集合時刻30分前から。使用棟・階・試験室のうち、棟は公表済みですが、指定室・受験生入口は合格者案内で確認し、附属病院入口を試験入口とみなさないでください。"},
  "venue-toho-omori-campus": {source:"toho", note:"梅屋敷駅から大学公式徒歩約8分。一般一次はTOCの定員超過時のみ大森も使用。一般二次2月15日・16日は出願時の希望日をもとに大学指定（希望に添えない場合あり）、集合時刻は一次合格発表時に通知。統一二次は3月3日。TOCの入室開始時刻を大森へ転用せず、指定棟・試験室・受付・受験生入口は各方式の合格者案内と受験票で確認。附属病院入口は試験入口ではありません。"},
  "venue-kindai-osaka-medical-campus": {source:"kindai", note:"泉ケ丘駅から大学公式のキャンパスへの案内を確認。医学部一般・共通テスト利用の二次は堺市のおおさかメディカルキャンパスのみ。一般前期2月14日、共テ前期・中期2月21日、一般後期・共テ後期3月11日。9:00開場、10:00集合、10:30開始。一次の東大阪キャンパスとは別です。指定棟・室・受験生入口はUCARO受験票で確認。"},
  "venue-kitasato-sagamihara-campus": {source:"kitasato", note:"一般一次2月2日は横浜会場の収容定員超過時のみ相模原を追加。一般・共テ前期二次2月13〜15日は出願時に1日登録（相模原市修学資金枠は13・14日）、共テ後期二次は3月6日。二次は9:00開場予定、9:30集合、10:00論文開始。キャンパス内の指定棟・階・室・入口は受験票で確認。病院・バス停を試験室や入口とみなさず、通常学生用スクールバスを受験経路に使わないでください。"},
  "venue-iwate-medical-yahaba-campus": {source:"iwate", note:"大学公式の最寄りはJR矢幅駅。病院側の医大通2丁目と、試験会場の医大通1丁目を区別。一般一次2月3日は9:30開始、二次2月12日・13日は出願時に1日選択、9:00以降の大学指定時刻に面接。開場・個人集合・指定試験室・入口は受験票で確認し、積雪・凍結と構内移動を見込んでください。"},
  "venue-kurume-mii-campus": {source:"kurume", note:"JR久留米大学前駅から大学公式徒歩約3分。御井は一般前期一次2月1日、前期・共テA二次2月13日、一般後期一次3月8日。前期一次の東京希望者も収容約1000名超過時は書類受付順で御井へ変更の場合あり。一次は9:00集合・9:30開始、前期・共テA二次は9:30着席・10:00開始（一般前期二次の開場8:30）。御井のみ前日16:30〜18:00に建物外の下見可。受験票の指定棟・室・集合時刻を確認。後期・共テB二次の旭町とは別です。"},
  "venue-kurume-asahimachi-campus": {source:"kurume", note:"一般後期・共テB二次3月16日は旭町キャンパス。8:30着席・9:00開始（一般後期二次の開場8:00）。御井ではありません。大学公式の大学病院・医学部前バス停への動線を接続し、キャンパス内の医学科試験指定棟・室・集合時刻・入口は受験票と当日案内で確認してください。病院の一般入口やバス停を受験生入口とみなさないでください。"},
};

type Patch = { routeIds: string[]; stage: "first" | "second"; values: Partial<PrivateMedicalExamVenueAssignment2027> };
export const novemberAssignmentUpdates2027: Patch[] = [];
const oldNames: Record<string,string> = {
  "venue-iwate-medical-yahaba-campus":"岩手医科大学 矢巾キャンパス", "venue-bellesalle-takadanobaba":"ベルサール高田馬場", "venue-bellesalle-shibuya-first":"ベルサール渋谷ファースト",
  "venue-ariake-toc-building":"有明TOCビル", "venue-acu-a-asty45":"ACU-A（アスティ45）", "venue-vision-center-tokyo-kyobashi":"ビジョンセンター東京京橋",
};
const add = (routeIds: string[], stage: "first" | "second", venueIds: string[], source: keyof typeof novemberGuidelines2027, pages: string, note: string, conditions: PrivateMedicalExamVenueAssignment2027["conditions"] = ["fixed","admission_ticket"]) => {
  const venues = venueIds.map(venueId => ({venueId, role: (venueIds.length>1?"choice":"fixed") as "choice"|"fixed"}));
  novemberAssignmentUpdates2027.push({routeIds, stage, values:{
    venueLinks:venues, announcedVenueText:venueIds.map(id=>novemberVenues2027.find(v=>v.venueId===id)?.name??oldNames[id]??id).join("・"),
    publicationState:"confirmed", conditions, officialAdmissionUrl:novemberGuidelines2027[source],
    evidenceLabel:"大学公式2027年度募集要項（11月4日再照合）", evidenceLocator:pages, reviewState:"verified", verifiedAt:novemberVenueVerifiedAt2027, note,
  }});
};
const iwate=["iwate-medical--general--general"];
add(iwate,"first",["venue-iwate-medical-yahaba-campus","venue-bellesalle-takadanobaba","venue-bellesalle-shibuya-first","venue-osaka-garden-palace","venue-tkp-premium-meieki-nishiguchi","venue-tkp-premium-tenjin-skyhall","venue-sapporo-garden-palace"],"iwate","PDF7〜8・58〜60ページ（冊子5〜6・56〜58）","2月3日。東京の高田馬場・渋谷のどちらになるかは大学が指定し、受験票で確認します。本学以外は定員超過時に会場変更の場合あり。一次9:30開始。出願後の試験場・日変更不可。歯学部の天神ブリッククロス等を混同しないでください。",["applicant_preference","university_assigned","capacity_overflow","admission_ticket"]);
for (const link of novemberAssignmentUpdates2027.at(-1)!.values.venueLinks!) {
  if (["venue-bellesalle-takadanobaba", "venue-bellesalle-shibuya-first"].includes(link.venueId)) link.role = "assigned";
}
add(iwate,"second",["venue-iwate-medical-yahaba-campus","venue-bellesalle-kanda","venue-osaka-garden-palace"],"iwate","PDF7〜8・58〜60ページ","2月12日・13日のいずれか1日を出願時に選択します。東京二次はベルサール神田で、一次会場ではありません。面接9:00から、個人時刻は大学指定。本学以外は定員状況により変更の場合あり。受験票の個人集合時刻を確認してください。",["applicant_preference","university_assigned","capacity_overflow","admission_ticket"]);

const tokai=["tokai--general--general","tokai--common--common-test","tokai--common--common-test-regional-quota-kanagawa","tokai--common--common-test-regional-quota-c5d34"];
add([tokai[0]],"first",["venue-ariake-toc-building","venue-tkp-premium-minatomirai","venue-shuei-nagoya","venue-civi-shinosaka-east","venue-papillon24","venue-tokai-shonan"],"tokai","PDF5・10〜12ページ（A-3・A-8〜10）","2月2日・3日は1日または両日受験可。試験場を出願時に選択し、満員の会場は選択不可。湘南キャンパスは収容状況により選択可能となる予備試験場のみです。検定料支払い後は試験日・会場変更不可。10:00開始、9:40までに着席。受験票の会場を確認してください。",["applicant_preference","capacity_overflow","admission_ticket"]);
novemberAssignmentUpdates2027.at(-1)!.values.venueLinks!.at(-1)!.role="overflow";
add(tokai,"second",["venue-tokai-isehara"],"tokai","PDF5・13〜14ページ（A-3・A-11〜12）","2月13日・14日のいずれか1日を出願時に選択。一般・共通テスト利用・地域枠は伊勢原キャンパスで実施。複数方式の一次に合格した場合は同一日受験も可能で、当日の大学指示に従います。9:30小論文開始、20分前の9:10までに着席。検定料支払い後の試験日変更不可。伊勢原駅が最寄りで東海大学前駅ではありません。",["applicant_preference","admission_ticket"]);

const kindaiEarly=["kindai--general--general-early","kindai--general--general-regional-quota-c5d34-385a3-3f44f-early"];
const kindaiLate=["kindai--general--general-late","kindai--general--general-regional-quota-c5d34-late"];
add([kindaiEarly[0]],"first",["venue-kindai-higashiosaka","venue-tkp-shinshiodome","venue-tkp-nagoya-ekimae-cc","venue-hiroshima-ja-building","venue-kitayobi-hakata"],"kindai","PDF97・114ページ（冊子96・113）","一般前期1月31日。医学部用の5会場だけを案内しています。他学部の試験地一覧を流用しません。9:00開場、9:30集合、10:00開始。大阪一次は東大阪、二次は堺市。定員等による会場変更や新設の可能性があるためUCARO受験票を確認。自動車の乗入れ不可。",["applicant_preference","capacity_overflow","admission_ticket"]);
add([kindaiEarly[1]],"first",["venue-kindai-higashiosaka","venue-tkp-shinshiodome"],"kindai","PDF97・114ページ","地域枠一般前期型の一次1月31日は大阪（東大阪）・東京のみです。一般前期の名古屋・広島・福岡を地域枠に結合しません。9:00開場、9:30集合、10:00開始。最終会場はUCARO受験票で確認。",["applicant_preference","admission_ticket"]);
add(kindaiLate,"first",["venue-kindai-higashiosaka","venue-yozemi-honbu"],"kindai","PDF97・114ページ","一般後期・地域枠一般後期型の一次2月28日は大阪（東大阪）・東京。東京は代ゼミタワーで、前期のTKP新橋汐留ではありません。9:00開場、9:30集合、10:00開始。最終会場はUCARO受験票で確認。",["applicant_preference","admission_ticket"]);
const kindaiAll=[...kindaiEarly,...kindaiLate,"kindai--common--common-test-early","kindai--common--common-test-middle","kindai--common--common-test-late"];
add(kindaiAll,"second",["venue-kindai-osaka-medical-campus"],"kindai","PDF97・114・147ページ","二次は全方式とも堺市のおおさかメディカルキャンパスのみ。一般前期2月14日、共通テスト前期・中期2月21日、一般後期・共通テスト後期3月11日。9:00開場、10:00集合、10:30開始。東大阪キャンパスへ向かわないでください。UCARO受験票の棟・室を確認。自動車の乗入れ不可。");

const nihonFirst=novemberVenues2027.filter(v=>v.officialUrl===novemberGuidelines2027.nihon&&v.venueId!=="venue-nihon-commerce").map(v=>v.venueId);
add(["nihon--general--unified-phase-1"],"first",["venue-acu-a-asty45",...nihonFirst,"venue-tkp-premium-minatomirai"],"nihon","PDF44〜50・102ページ（冊子43〜49・101）","N第1期2月1日。希望受験地を選択しますが収容人員により希望に添えない場合があります。医学部の東京は文理学部校舎の指定行を採用し、他学部の東京校舎を一律に医学部へ結合していません。理科2科目は9:00集合、9:30開始。必ず受験票で確定会場を確認し、変更に備えて取消条件を確認して予約してください。",["applicant_preference","university_assigned","capacity_overflow","admission_ticket"]);
add(["nihon--general--unified-phase-2"],"first",["venue-nihon-koriyama","venue-nihon-tsudanuma","venue-nihon-commerce","venue-nihon-shonan"],"nihon","PDF44〜50・102ページ","N第2期3月4日。医学部志願者用東京会場は商学部校舎の指定行を採用。第1期の文理学部校舎と混同しないでください。希望受験地の定員による変更あり。理科2科目は9:00集合、9:30開始。最終指定は受験票で確認。",["applicant_preference","university_assigned","capacity_overflow","admission_ticket"]);
add(["nihon--general--unified-phase-1","nihon--general--unified-phase-2"],"second",["venue-nihon-medical-school-building"],"nihon","PDF44〜45・48・102ページ","二次は第1期2月11日、第2期3月17日とも板橋区の医学部校舎。8:30集合、9:00数学開始。一次の地方会場・文理・商学部とは異なります。指定教室・入口は受験票で確認してください。");

add(["toho--general--general"],"first",["venue-toc-gotanda","venue-toho-omori-campus"],"toho","PDF13〜14・37〜38ページ","一般2月7日。原則五反田TOCビル13階、志願者多数で定員超過時は大森キャンパスも使用。TOCは7:30入室開始（変更時は大学HPに掲載）、8:35〜8:45点呼。受験票で会場を確認し、入室時刻を別会場へ一律転用しないでください。TOCの住所は要項に未記載のため施設公式で別途照合した会場台帳を用います。",["university_assigned","capacity_overflow","admission_ticket"]);
novemberAssignmentUpdates2027.at(-1)!.values.venueLinks=[{venueId:"venue-toc-gotanda",role:"primary"},{venueId:"venue-toho-omori-campus",role:"overflow"}];
add(["toho--general--general"],"second",["venue-toho-omori-campus"],"toho","PDF13〜14・38ページ","2月15日・16日から出願時に希望日を選択し、大学が指定（希望に添えない場合あり）。集合時刻は一次合格発表時に通知。特別事情の振替えは2月10日正午〜17:00、11日9:00〜正午に受験票持参で医学部入試係へ。電話変更不可。使用棟・受付・入口は合格者案内で確認。",["applicant_preference","university_assigned","admission_ticket"]);
add(["toho--general--unified"],"first",["venue-toc-gotanda"],"tohoUnified","PDF13〜14・27ページ","統一2月23日、五反田TOCビル13階。8:00入室開始（変更時は大学HP）、9:05〜9:15点呼、9:30外国語開始。一般入試の入室時刻や大森への定員超過条件を統一へ流用しません。受験票で入口・教室を確認。");
add(["toho--general--unified"],"second",["venue-toho-omori-campus"],"tohoUnified","PDF13〜14・28ページ","3月3日、大森キャンパス。個人時刻は一次合格発表時に通知。TOCや一般入試の面接日と混同せず、受験票・合格者案内で集合・受付・入口を確認してください。");

add(["jikei--general--general"],"first",["venue-toc-gotanda"],"jikei","PDF7〜8・17ページ（冊子5〜6・15）","2月11日、五反田TOCビル本館。8:00入室開始、9:20までに指定試験室着席、10:00理科開始。使用階・室・入口は受験票と当日案内で確認。前日の会場階下見不可。");
add(["jikei--general--general"],"second",["venue-jikei-nishishimbashi-campus"],"jikei","PDF10・18ページ（冊子8・16）","2月20〜22日のいずれか1日を大学が指定。Web出願で都合のつかない日を1日のみ申請可（希望に添えない場合あり）。西新橋キャンパス大学1号館。集合日時・場所は一次合格発表時に指定、受付は個人集合時刻30分前からです。",["applicant_preference","university_assigned","admission_ticket"]);
add(["kitasato--general--general"],"first",["venue-pacifico-yokohama-north","venue-kitasato-sagamihara-campus"],"kitasato","PDF20・52・55ページ（冊子18・50・53）","2月2日はパシフィコ横浜ノース。横浜の定員超過時のみ相模原キャンパスを追加設置。9:00開場予定、9:30集合。医学部以外の会議センターや地方会場を採用しません。受験票で確定会場を確認。",["university_assigned","capacity_overflow","admission_ticket"]);
novemberAssignmentUpdates2027.at(-1)!.values.venueLinks=[{venueId:"venue-pacifico-yokohama-north",role:"primary"},{venueId:"venue-kitasato-sagamihara-campus",role:"overflow"}];
add(["kitasato--general--general","kitasato--common--common-test-early","kitasato--common--common-test-late"],"second",["venue-kitasato-sagamihara-campus"],"kitasato","PDF20〜22・52ページ","相模原キャンパス。一般・共テ前期は2月13〜15日から出願時に1日登録、相模原市修学資金枠は13・14日のみ。共テ後期は3月6日。いずれも9:00開場予定、9:30集合、10:00論文開始。一般と前期共テの併願時は大学案内と受験票で同一受験日の扱いを確認。",["applicant_preference","admission_ticket"]);
add(["kurume--common--common-test-method-a","kurume--general--general-early"],"second",["venue-kurume-mii-campus"],"kurume","PDF16・19・22・33・63ページ","2月13日の一般前期・共通テスト利用A日程の二次は御井キャンパス。旭町ではありません。9:30までに着席、10:00小論文開始（一般前期の開場は8:30）。個人の指定室は受験票で確認してください。");
add(["kurume--common--common-test-method-b","kurume--general--general-late"],"second",["venue-kurume-asahimachi-campus"],"kurume","PDF44・49〜50・52・63・78ページ","3月16日の一般後期・共通テスト利用B日程の二次は旭町キャンパス。前期・A日程の御井とは異なります。8:30までに着席、9:00小論文開始（一般後期の開場は8:00）。医学科の指定試験棟・室は受験票で確認してください。");
add(["kurume--general--general-early"],"first",["venue-kurume-mii-campus","venue-bellesalle-shiodome"],"kurume","PDF16・63・68ページ","2月1日。御井キャンパス・東京ベルサール汐留から希望。東京の収容人数約1000名超過時は書類受付順で久留米へ変更。必ず受験票で指定会場を確認。御井のみ前日16:30〜18:00に建物外の下見可。",["applicant_preference","capacity_overflow","admission_ticket"]);
add(["kurume--general--general-late"],"first",["venue-kurume-mii-campus"],"kurume","PDF49・63ページ","3月8日の一般後期一次は御井キャンパス。3月16日の二次は旭町で別会場です。御井のみ前日16:30〜18:00に建物外の下見可。受験票の集合・指定室を確認。");

// 現行要項の方式別表と出願注意でⅡ期の超過条件の記載範囲が異なる。断定しない。
novemberAssignmentUpdates2027.push({routeIds:["showa-medical--general--general-phase-1-phase-2"],stage:"first",values:{
  officialAdmissionUrl:novemberGuidelines2027.showa, evidenceLocator:"現行76ページ版PDF14・51・64ページ", verifiedAt:novemberVenueVerifiedAt2027,
  reviewState:"needs_review", note:"現行要項の方式別表はⅠ期・Ⅱ期共通欄でTOC・旗の台と定員超過注記を掲載していますが、出願注意はⅠ期だけを明記しています。Ⅱ期への超過条件の適用は大学へ確認が必要です。TOCを基本案内とし、受験票の確定会場を優先してください。8:00〜9:00入場、9:30開始。",
}});

for (const [routeId, stage, locator] of [
  ["fujita--general--general-regional-quota-17148", "first", "現行50ページ版 PDF20・38〜39ページ（冊子19・37〜38）"],
  ["fujita--general--general-regional-quota-17148", "second", "現行50ページ版 PDF21・38〜39ページ（冊子20・37〜38）"],
  ["fujita--common--common-test", "second", "現行50ページ版 PDF28・38〜39ページ（冊子27・37〜38）"],
] as const) {
  novemberAssignmentUpdates2027.push({routeIds:[routeId], stage, values:{
    officialAdmissionUrl:novemberGuidelines2027.fujita, evidenceLabel:"2027年度募集要項 10月13日改訂50ページ版", evidenceLocator:locator,
    reviewState:"verified", verifiedAt:novemberVenueVerifiedAt2027,
  }});
}

// 会場固定と受験日の希望は別条件。後期共テは3月6日固定で希望選択ではない。
for (const patch of novemberAssignmentUpdates2027) {
  if (patch.stage !== "second" || !patch.values.conditions?.includes("applicant_preference")) continue;
  if (patch.values.venueLinks?.length === 1) patch.values.conditions.unshift("fixed");
}
novemberAssignmentUpdates2027.push({routeIds:["kitasato--common--common-test-late"], stage:"second", values:{
  conditions:["fixed", "admission_ticket"],
  note:"共通テスト利用後期の二次は3月6日、相模原キャンパス。9:00開場予定、9:30集合、10:00論文開始。一般・前期の受験日選択制を後期へ流用しません。指定棟・階・室・入口は受験票で確認してください。",
}});
