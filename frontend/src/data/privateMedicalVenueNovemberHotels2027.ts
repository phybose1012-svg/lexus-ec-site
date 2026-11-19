import type { HotelAmenity2027, HotelTravelMode2027, PrivateMedicalVenueHotel2027 } from "./privateMedicalVenueHotels2027.ts";
import { novemberGuidelines2027, novemberVenues2027, novemberVenueVerifiedAt2027, novemberCampusPolicies2027 } from "./privateMedicalVenueNovember2027.ts";

const checkedAt = novemberVenueVerifiedAt2027;
const a = (key: HotelAmenity2027["key"], label: string, detail: string, evidenceUrl: string): HotelAmenity2027 => ({ key, label, detail, evidenceUrl });
const wifi = (url: string) => a("wifi", "客室インターネット", "当施設公式の客室案内で無線LAN接続を確認。回線速度・利用条件は予約時に確認してください。", url);
const breakfast = (url: string, time: string, detail: string) => a("breakfast", `朝食${time}〜`, detail, url);
const desk = (url: string) => a("desk", "客室デスク", "当施設公式でデスクの記載を確認。部屋タイプごとの寸法・照明は予約前に確認してください。", url);
type HotelSeed = [id: string, name: string, prefecture: string, municipality: string, address: string, station: string, url: string, amenities: HotelAmenity2027[], note?: string];
const iseheraPartner = "https://www.apahotel.com/hotel/partners/syutoken/kanagawa/iseharadaiichi/";
const hotelSeeds: HotelSeed[] = [
  ["hotel-osaka-garden-palace", "大阪ガーデンパレス", "大阪府", "大阪市淀川区", "大阪府大阪市淀川区西宮原1-3-35", "新大阪駅北口（ホテル公式徒歩10分）", "https://www.hotelgp-osaka.com/", [wifi("https://www.hotelgp-osaka.com/guestroom/"), desk("https://www.hotelgp-osaka.com/guestroom/"), breakfast("https://www.hotelgp-osaka.com/restaurant/breakfast/", "7:00", "朝食7:00〜9:30。試験当日の提供・混雑と利用プランを確認してください。")], "岩手医科大学の一次・二次試験会場と同一施設。宿泊予約で当該会場が指定されるわけではありません。"],
  ["isehara-daiichi-hotel", "伊勢原第一ホテル", "神奈川県", "伊勢原市", "神奈川県伊勢原市桜台1-11-22", "小田急伊勢原駅南口（徒歩3分）", iseheraPartner, [breakfast(iseheraPartner, "6:00", "公式提携予約ページは朝食6:00〜9:00を案内。予約プランと当日の提供を確認。"), a("coin_laundry", "コインランドリー", "当施設の公式提携ページで館内コインランドリーを確認。", iseheraPartner)], "独立系ホテル。ホテル独自サイトは今回接続できなかったため、掲載先は当施設を扱う公式提携予約ページです。系列アパホテル共通の客室仕様は流用していません。客室ネット・学習机は要問い合わせ。"],
  ["apa-hotel-isehara-ekimae", "アパホテル〈伊勢原駅前〉", "神奈川県", "伊勢原市", "神奈川県伊勢原市桜台1-11-3", "小田急伊勢原駅南口（徒歩2分）", "https://www.apahotel.com/hotel/syutoken/kanagawa/isehara-ekimae/", [wifi("https://www.apahotel.com/hotel/syutoken/kanagawa/isehara-ekimae/"), breakfast("https://www.apahotel.com/hotel/syutoken/kanagawa/isehara-ekimae/", "6:30", "公式の当館朝食案内は6:30開始。朝食付きか別途利用か確認。"), a("washer_dryer", "館内洗濯乾燥機", "当館4階の洗濯乾燥機を公式確認。", "https://www.apahotel.com/hotel/syutoken/kanagawa/isehara-ekimae/")]],
  ["daiwa-roynet-hotel-osaka-uehonmachi", "ダイワロイネットホテル大阪上本町", "大阪府", "大阪市天王寺区", "大阪府大阪市天王寺区上本町6-7-5", "近鉄大阪上本町駅14番出口（徒歩約2分）", "https://www.daiwaroynet.jp/osaka-uehonmachi/", [wifi("https://www.daiwaroynet.jp/osaka-uehonmachi/room/"), desk("https://www.daiwaroynet.jp/osaka-uehonmachi/room/"), breakfast("https://www.daiwaroynet.jp/osaka-uehonmachi/breakfast/", "7:00", "朝食7:00〜10:30、最終入店10:00。利用プランを確認。")]],
  ["sheraton-miyako-hotel-osaka", "シェラトン都ホテル大阪", "大阪府", "大阪市天王寺区", "大阪府大阪市天王寺区上本町6-1-55", "近鉄大阪上本町駅直結", "https://www.miyakohotels.ne.jp/osaka/", [wifi("https://www.miyakohotels.ne.jp/osaka/stay/"), breakfast("https://www.miyakohotels.ne.jp/osaka/stay/breakfast/", "6:30", "レストランeuの朝食は6:30〜10:00、9:30までに入店。9:00開始の別店舗と混同しないでください。")]],
  ["comfort-hotel-koriyama", "コンフォートホテル郡山", "福島県", "郡山市", "福島県郡山市方八町2-2-22", "JR郡山駅東口（徒歩約2分）", "https://www.choice-hotels.jp/hotel/koriyama/", [desk("https://www.choice-hotels.jp/hotel/koriyama/rooms/"), breakfast("https://www.choice-hotels.jp/hotel/koriyama/breakfast/", "6:00", "無料朝食6:00〜9:30。試験日の提供を確認。"), a("humidifier", "加湿空気清浄機", "当館客室の設置備品として公式掲載。", "https://www.choice-hotels.jp/hotel/koriyama/rooms/")]],
  ["daiwa-roynet-hotel-koriyama-ekimae", "ダイワロイネットホテル郡山駅前", "福島県", "郡山市", "福島県郡山市駅前1-6-10", "JR郡山駅西口（徒歩約1分）", "https://www.daiwaroynet.jp/koriyamaekimae/", [wifi("https://www.daiwaroynet.jp/koriyamaekimae/room/"), desk("https://www.daiwaroynet.jp/koriyamaekimae/room/"), breakfast("https://www.daiwaroynet.jp/koriyamaekimae/breakfast/", "6:00", "朝食6:00〜10:00、ラストオーダー9:45。利用プランを確認。")]],
  ["hotel-nikko-tsukuba", "ホテル日航つくば", "茨城県", "つくば市", "茨城県つくば市吾妻1-1364-1", "つくば駅A3出口（徒歩2分）", "https://www.nikko-tsukuba.com/", [wifi("https://www.nikko-tsukuba.com/stay/room/"), breakfast("https://www.nikko-tsukuba.com/stay/room/", "6:30", "客室案内は朝食6:30〜9:00（9:30終了）を掲載。利用条件を確認。"), a("humidifier", "加湿器貸出", "客室案内でフロントへの貸出申出を案内。数量・確保可否は問い合わせ。", "https://www.nikko-tsukuba.com/stay/room/")]],
  ["daiwa-roynet-hotel-tsukuba", "ダイワロイネットホテルつくば", "茨城県", "つくば市", "茨城県つくば市吾妻1-5-7", "つくば駅A5出口（徒歩約1分）", "https://www.daiwaroynet.jp/tsukuba/", [desk("https://www.daiwaroynet.jp/tsukuba/room/"), breakfast("https://www.daiwaroynet.jp/tsukuba/breakfast/", "6:30", "朝食6:30〜10:00、最終入店9:30。利用プランを確認。")]],
  ["hotel-sunroute-sano", "ホテルサンルート佐野", "栃木県", "佐野市", "栃木県佐野市朝日町702-27", "JR・東武佐野駅（徒歩5分）", "https://sunroute-sano.com/", [wifi("https://sunroute-sano.com/Guest_Room.html")], "朝食開始時刻・学習机・未成年者のみの宿泊条件は問い合わせてください。禁煙室には限りがあるため、予約時に指定が必要です。"],
  ["hotel-miyoshino-bekkan", "ホテル三吉野別館", "栃木県", "佐野市", "栃木県佐野市富岡町324", "JR・東武佐野駅（徒歩15分）", "https://www.hotelmiyoshino.co.jp/", [wifi("https://www.hotelmiyoshino.co.jp/")], "本館・別館・離れ等の部屋条件が異なります。朝食の有無・開始時刻、机、未成年者のみの宿泊条件は予約前に問い合わせてください。"],
  ["hotel-metropolitan-takasaki", "ホテルメトロポリタン高崎", "群馬県", "高崎市", "群馬県高崎市八島町222", "JR高崎駅西口側・駅ビル直結", "https://takasaki.metropolitan.jp/", [breakfast("https://takasaki.metropolitan.jp/stay/breakfast/202405breakfast.html", "6:30", "朝食6:30〜10:00、ラストオーダー9:30。利用プランを確認。")]],
  ["hotel-coco-grand-takasaki", "ホテル ココ・グラン高崎", "群馬県", "高崎市", "群馬県高崎市東町3-5", "JR高崎駅東口（徒歩3分・デッキ経由）", "https://www.cocogrand.co.jp/takasaki/", [breakfast("https://www.cocogrand.co.jp/takasaki/restaurant/", "6:30", "朝食6:30〜10:00、ラストオーダー9:30。利用プランを確認。")]],
  ["toyoko-inn-fujisan-mishima-eki", "東横INN富士山三島駅", "静岡県", "三島市", "静岡県三島市文教町1-5-7", "JR三島駅北口（公式英文案内徒歩2分）", "https://www.toyoko-inn.com/search/detail/00215/", [wifi("https://www.toyoko-inn.com/search/detail/00215/"), breakfast("https://www.toyoko-inn.com/search/detail/00215/", "6:30", "無料朝食6:30〜9:00。6:00〜6:30は軽朝食の案内で、通常朝食と区別してください。")], "公式ページが今回英語版へ転送されたため、その当店舗案内を照合。南口発着の送迎は北口の試験場への朝の移動に流用しません。"],
  ["fujisan-mishima-tokyu-hotel", "富士山三島東急ホテル", "静岡県", "三島市", "静岡県三島市一番町17-1", "JR三島駅南口（徒歩1分）", "https://www.tokyuhotels.co.jp/mishima-h/", [a("coin_laundry", "館内コインランドリー", "公式施設案内は14階、5:00〜10:00／15:00〜25:00を掲載。", "https://www.tokyuhotels.co.jp/mishima-h/facility/index.html")], "試験場は駅北口です。南北移動の経路を前日に確認。朝食・客室ネット・学習机は予約プランと部屋タイプごとに確認してください。"],
  ["almont-inn-shonan-fujisawa", "アルモントイン湘南藤沢", "神奈川県", "藤沢市", "神奈川県藤沢市藤沢110-4", "小田急藤沢駅北口（徒歩約3分）", "https://www.almont.jp/shonan/", [wifi("https://www.almont.jp/shonan/room.html"), breakfast("https://www.almont.jp/shonan/breakfast.html", "7:00", "朝食7:00〜10:00、入店9:30まで。早い集合なら利用余裕を確認。"), a("humidifier", "加湿機能付空気清浄機", "当館客室設備に掲載。", "https://www.almont.jp/shonan/room.html")]],
  ["hotel-hokke-club-shonan-fujisawa", "ホテル法華クラブ湘南藤沢", "神奈川県", "藤沢市", "神奈川県藤沢市鵠沼石上1-6-1", "小田急藤沢駅南口（徒歩約5分）", "https://www.hokke.co.jp/shonan-fujisawa/", [wifi("https://www.hokke.co.jp/shonan-fujisawa/room.html"), desk("https://www.hokke.co.jp/shonan-fujisawa/room.html"), a("humidifier", "加湿機能付空気清浄機", "当館客室設備に掲載。", "https://www.hokke.co.jp/shonan-fujisawa/room.html")], "公式朝食詳細ページは今回取得できなかったため、提供有無・開始時刻は予約前に要問い合わせ。系列他店の朝食情報は使っていません。"],
  ["vessel-inn-keisei-tsudanuma-ekimae", "ベッセルイン京成津田沼駅前", "千葉県", "習志野市", "千葉県習志野市津田沼5-12-4", "京成津田沼駅南口（徒歩1分）", "https://www.vessel-hotel.jp/inn/tsudanuma/", [wifi("https://www.vessel-hotel.jp/inn/tsudanuma/room/"), breakfast("https://www.vessel-hotel.jp/inn/tsudanuma/breakfast/", "6:00", "朝食6:00〜9:30、10階ラウンジ。利用プランを確認。"), a("humidifier", "加湿機能付空気清浄機", "当館公式客室案内に全室設置と掲載。", "https://www.vessel-hotel.jp/inn/tsudanuma/room/")]],
  ["keio-plaza-hotel-hachioji", "京王プラザホテル八王子", "東京都", "八王子市", "東京都八王子市旭町14-1", "JR八王子駅北口前・京王八王子駅（徒歩3分）", "https://www.keioplaza.co.jp/hachioji/", [wifi("https://www.keioplaza.co.jp/hachioji/faq/stay/")], "新宿の京王プラザホテルとは別施設です。朝食開始時刻・机の仕様・未成年者のみの宿泊条件は要問い合わせ。公式には2026年9月30日付の館内Wi-Fi告知もあるため、必要な回線環境は予約前に再確認してください。"],
  ["the-b-hachioji", "the b 八王子", "東京都", "八王子市", "東京都八王子市明神町4-6-12", "京王八王子駅中央口（徒歩1分）", "https://www.theb-hotels.com/theb/hachioji", [wifi("https://www.theb-hotels.com/theb/hachioji"), desk("https://www.theb-hotels.com/theb/hachioji"), breakfast("https://www.theb-hotels.com/theb/hachioji", "6:30", "朝食6:30〜10:00、最終入店9:30。提供方法・時刻の変更可能性あり。")]],
  ["hotel-mielparque-nagoya", "ホテルメルパルク名古屋", "愛知県", "名古屋市東区", "愛知県名古屋市東区葵3-16-16", "千種駅1番出口（徒歩約1分）", "https://www.mielparque.jp/nagoya/", [wifi("https://www.mielparque.jp/nagoya/stay/")], "会場の秀英予備校は千種駅3番出口側です。朝食開始時刻、机、未成年者のみの宿泊手続きは予約前に確認してください。"],
];

type AccessGroup = {
  venue: string;
  hotels: string[];
  modes: HotelTravelMode2027[];
  route: string;
  transfers?: number;
  evidence?: string[];
  caution?: string;
};
// 総所要時間は計測していない。ホテルの駅アクセスと大学の会場図、交通機関の路線案内を分けて示す。
const accessGroups: AccessGroup[] = [
  {venue:"osaka-garden-palace",hotels:["hotel-osaka-garden-palace"],modes:["walk"],route:"宿泊棟から同じ大阪ガーデンパレス内の試験指定階・室へ。館内の経路と受付は受験票で確認。",transfers:0},
  {venue:"osaka-garden-palace",hotels:["karaksa-hotel-grande-shin-osaka-tower"],modes:["walk"],route:"ホテル公式の新大阪駅への案内を逆向きにたどり、新大阪駅北口から大阪ガーデンパレスへ（施設公式は北口から徒歩10分）。出口間の移動は別に見込む。",transfers:0,evidence:["https://www.hotelgp-osaka.com/access/"]},
  {venue:"sapporo-garden-palace",hotels:["hotel-sapporo-garden-palace"],modes:["walk"],route:"宿泊先と同じ札幌ガーデンパレス内で、試験指定階・室へ移動。",transfers:0},
  {venue:"sapporo-garden-palace",hotels:["hotel-gracery-sapporo"],modes:["walk"],route:"ホテル公式の札幌駅南口アクセスを逆向きにたどり、大学要項の札幌ガーデンパレス会場図へ接続。凍結時は地下通路と地上出口を事前確認。",transfers:0},
  {venue:"tkp-premium-meieki-nishiguchi",hotels:["comfort-hotel-nagoya-shinkansenguchi","daiwa-roynet-hotel-nagoya-shinkansenguchi"],modes:["walk"],route:"各ホテルの公式アクセスで名古屋駅太閤通口側へ出て、大学要項の名駅西口会場図に沿って則武1-6-3へ。別の名古屋駅前TKPに向かわない。",transfers:0},
  {venue:"tkp-premium-tenjin-skyhall",hotels:["comfort-inn-fukuoka-tenjin","fukuoka-garden-palace"],modes:["walk"],route:"ホテル公式の天神・天神南駅アクセスを接続点とし、大学要項の会場図で天神1-4-1西日本新聞会館へ。16階の指定会場までの館内移動を別に確保。",transfers:0},
  {venue:"bellesalle-kanda",hotels:["tokyo-garden-palace","ochanomizu-inn"],modes:["walk","rail"],route:"ホテル公式案内で丸ノ内線御茶ノ水駅へ。東京方面の列車で淡路町駅に下車し、大学要項の会場図に従いベルサール神田へ。JR御茶ノ水駅とは改札が異なる。",transfers:0,evidence:["https://www.tokyometro.jp/station/line_marunouchi/index.html"]},
  {venue:"tkp-premium-minatomirai",hotels:["hilton-garden-inn-yokohama-minatomirai","yokohama-tokyu-rei-hotel"],modes:["walk","rail"],route:"ホテル公式の新高島駅アクセスを逆向きにたどり、みなとみらい線元町・中華街方面でみなとみらい駅へ1駅。4a出口からMMパークビルへ（大学案内は徒歩約1分）。",transfers:0,evidence:["https://www.mm21railway.co.jp/station/minatomirai/"]},
  {venue:"shuei-nagoya",hotels:["hotel-mielparque-nagoya"],modes:["walk"],route:"ホテル公式の千種駅1番出口への案内を逆向きにたどり、大学要項の3番出口側へ。3番出口から秀英予備校名古屋本部校まで徒歩約1分。出口間の移動を別に確保。",transfers:0},
  {venue:"shuei-nagoya",hotels:["ab-hotel-nagoya-sakae"],modes:["walk","rail"],route:"ホテル公式案内で栄駅へ。地下鉄東山線藤が丘方面で千種駅へ、3番出口から秀英予備校へ（大学案内は徒歩約1分）。",transfers:0,evidence:["https://www.kotsu.city.nagoya.jp/jp/pc/subway/"]},
  {venue:"civi-shinosaka-east",hotels:["comfort-hotel-shin-osaka","karaksa-hotel-grande-shin-osaka-tower"],modes:["walk"],route:"ホテル公式案内で新大阪駅へ出て、駅の公共通路でJR東口へ。東口からCIVI研修センター新大阪東まで大学案内は徒歩約1分。ホテル最寄り出口と東口は同一ではない。",transfers:0},
  {venue:"papillon24",hotels:["mars-garden-hotel-hakata","the-b-hakata"],modes:["walk","rail"],route:"ホテル公式案内で博多駅へ。地下鉄空港線で中洲川端駅、箱崎線貝塚方面へ乗換えて千代県庁口駅4番出口直結のパピヨン24へ。",transfers:1,evidence:["https://subway.city.fukuoka.lg.jp/eki/stations/nakasu.php"]},
  {venue:"tokai-shonan",hotels:["isehara-daiichi-hotel","apa-hotel-isehara-ekimae"],modes:["walk","rail"],route:"ホテルから伊勢原駅へ。小田急小田原方面の東海大学前停車列車で東海大学前駅南口へ。大学要項の徒歩約15分の経路で湘南キャンパスへ。",transfers:0,evidence:["https://www.odakyu.jp/station/"]},
  {venue:"tokai-isehara",hotels:["isehara-daiichi-hotel","apa-hotel-isehara-ekimae"],modes:["walk"],route:"ホテルの伊勢原駅南口アクセスを逆向きにたどり、駅の公共通路で北口へ。大学要項の徒歩約15分の経路で伊勢原キャンパスの指定棟へ。南北口の移動は別。",transfers:0,caution:"二次は9:30開始・9:10までに着席。東海大学前駅や湘南キャンパスへ向かわないでください。"},
  {venue:"kindai-higashiosaka",hotels:["daiwa-roynet-hotel-osaka-uehonmachi","sheraton-miyako-hotel-osaka"],modes:["walk","rail"],route:"ホテル公式案内で近鉄大阪上本町駅へ。大阪線の長瀬停車の普通列車で長瀬駅、大学要項の徒歩約10分の経路で東大阪キャンパスへ。JR長瀬駅ではない。",transfers:0,evidence:["https://www.kintetsu.co.jp/station/","https://www.kintetsu.co.jp/soukatsu/kounai/nagase.html"],caution:"医学部一般一次のみ。一般前期は9:30集合、10:00開始。二次は堺市の別キャンパスです。"},
  {venue:"tkp-shinshiodome",hotels:["ginza-kokusai-hotel","hotel-check-in-shimbashi"],modes:["walk"],route:"ホテル公式の新橋駅アクセスを接続点とし、大学の医学部会場図で東新橋1-1-16汐留FSビルへ。指定階・室へ移動。",transfers:0},
  {venue:"yozemi-honbu",hotels:["keio-plaza-hotel-tokyo","hotel-rose-garden-shinjuku"],modes:["walk"],route:"ホテル公式の新宿駅への案内を接続点とし、公共通路で南口方面へ。大学の医学部会場図に従い代々木2-25-7代ゼミタワーへ。西側ホテルからの最短徒歩所要は未計測。",transfers:0},
  {venue:"tkp-nagoya-ekimae-cc",hotels:["meitetsu-inn-nagoya-sakuradori","sotetsu-fresa-inn-nagoya-sakuradoriguchi"],modes:["walk"],route:"ホテル公式の名古屋駅桜通口アクセスを接続点とし、医学部会場図で名駅2-41-5 CK20名駅前ビルへ。PREMIUM付きの別施設とは異なる。",transfers:0},
  {venue:"hiroshima-ja-building",hotels:["hotel-mielparque-hiroshima","hotel-livemax-hiroshima-heiwa-koen"],modes:["walk","rail"],route:"ホテル公式案内の紙屋町西・袋町停留場から広電3号線広電本社前方面または7号線広島港方面で市役所前へ。大学の医学部会場図で大手町4-7-3広島県JAビルへ。",transfers:0,evidence:["https://www.hiroden.co.jp/train/route-guide/stop-guide/search-route.html"]},
  {venue:"kitayobi-hakata",hotels:["mars-garden-hotel-hakata","the-b-hakata"],modes:["walk"],route:"ホテル公式案内で博多駅へ。公共通路で博多口側へ出て、大学の医学部会場図に従い博多駅前1-21-4北九州予備校博多駅校へ。筑紫口からの移動は別。",transfers:0},
  {venue:"tkp-premium-sendai-west",hotels:["comfort-hotel-sendai-west","mitsui-garden-hotel-sendai"],modes:["walk"],route:"ホテル公式の仙台駅西口方面への徒歩案内を接続点とし、大学要項のソララプラザ会場図へ。会場は仙台駅西口より徒歩3分。ホテルからの直接徒歩時間は未計測。",transfers:0},
  {venue:"nihon-koriyama",hotels:["comfort-hotel-koriyama","daiwa-roynet-hotel-koriyama-ekimae"],modes:["walk","rail"],route:"ホテル公式案内でJR郡山駅へ。東北本線の安積永盛停車の普通列車で安積永盛駅へ、大学要項の徒歩15分の経路で工学部校舎1号館へ。",transfers:0,evidence:["https://www.jreast.co.jp/map/"]},
  {venue:"tsukuba-congress",hotels:["hotel-nikko-tsukuba","daiwa-roynet-hotel-tsukuba"],modes:["walk"],route:"ホテル公式案内でつくば駅A3出口側へ。大学要項の歩行者専用道路を進み、つくば国際会議場へ（A3出口から徒歩10分）。A5側ホテルは出口間の移動を別に確保。",transfers:0},
  {venue:"sano-junior-college",hotels:["hotel-sunroute-sano","hotel-miyoshino-bekkan"],modes:["walk","bus"],route:"ホテル公式の徒歩案内を逆向きにたどり佐野駅へ。大学要項の佐野駅発バスで佐野短大停留所へ（バス約15分）。佐野日本大学短期大学の指定試験室へ。",transfers:0,caution:"佐野日本大学高校とは別施設。受験日朝に間に合うバス時刻・乗場・運行日を予約前に確認し、合わない場合は予約制タクシー等を手配してください。"},
  {venue:"eterna-takasaki",hotels:["hotel-metropolitan-takasaki","hotel-coco-grand-takasaki"],modes:["walk"],route:"各ホテル公式の高崎駅アクセスを逆向きにたどって東口へ。大学要項の徒歩3分の経路でエテルナ高崎へ。西口側ホテルは駅の公共通路の移動を別に見込む。",transfers:0},
  {venue:"nihon-tsudanuma",hotels:["vessel-inn-keisei-tsudanuma-ekimae"],modes:["walk","rail"],route:"ホテルから京成津田沼駅南口へ（公式徒歩1分）。京成本線成田方面の京成大久保停車列車で京成大久保駅、大学要項の徒歩経路で生産工学部津田沼校舎へ。",transfers:0,evidence:["https://keisei.ekitan.com/search/timetable"]},
  {venue:"nihon-tsudanuma",hotels:["daiwa-roynet-hotel-chiba-chuo"],modes:["walk","rail"],route:"ホテル公式案内で京成千葉中央駅へ。京成千葉線で京成津田沼駅、京成本線成田方面の京成大久保停車列車に乗換え、駅から大学要項の徒歩経路で津田沼校舎へ。",transfers:1,evidence:["https://keisei.ekitan.com/search/timetable"],caution:"千葉中央の候補は京成津田沼で乗換えが必要。近さを優先する場合は京成津田沼駅前の候補を比較してください。JR津田沼駅と京成津田沼駅は別駅です。"},
  {venue:"nihon-bunri",hotels:["keio-plaza-hotel-tokyo","hotel-rose-garden-shinjuku"],modes:["walk","rail"],route:"ホテル公式案内で新宿駅へ。京王線の桜上水停車列車で桜上水駅へ、大学要項の徒歩8分の経路で文理学部校舎へ。",transfers:0,evidence:["https://www.keio.co.jp/global/routes/"]},
  {venue:"nihon-commerce",hotels:["hotel-molino-shin-yurigaoka","forbell-stay-yurigaoka"],modes:["walk","rail"],route:"ホテル公式案内で小田急の新百合ヶ丘駅・百合ヶ丘駅へ。新宿方面の祖師ヶ谷大蔵停車の各駅停車を利用し、駅から大学要項の徒歩12分の経路で商学部校舎へ。",transfers:0,evidence:["https://www.odakyu.jp/station/"],caution:"祖師ヶ谷大蔵は急行通過駅です。各駅停車を利用し、N第1期の文理学部とは区別してください。"},
  {venue:"tokyo-tama-messe",hotels:["keio-plaza-hotel-hachioji","the-b-hachioji"],modes:["walk"],route:"ホテル公式案内で京王八王子駅中央口側へ。大学要項の徒歩2分の経路で東京たま未来メッセへ。JR八王子駅北口を使う場合は大学案内の徒歩5分の経路。",transfers:0},
  {venue:"vision-yokohama-minatomirai",hotels:["hilton-garden-inn-yokohama-minatomirai","yokohama-tokyu-rei-hotel"],modes:["walk","rail"],route:"ホテル公式案内で新高島駅へ。みなとみらい線元町・中華街方面でみなとみらい駅へ1駅。4番出口から4b出口直結のセンタービル7階へ。TKPの4a出口とは異なる。",transfers:0,evidence:["https://www.mm21railway.co.jp/station/minatomirai/"]},
  {venue:"nihon-shonan",hotels:["almont-inn-shonan-fujisawa","hotel-hokke-club-shonan-fujisawa"],modes:["walk","rail"],route:"ホテル公式案内で小田急藤沢駅へ。江ノ島線相模大野方面の六会日大前停車の各駅停車で六会日大前駅へ、大学要項の徒歩3分の経路で生物資源科学部校舎へ。",transfers:0,evidence:["https://www.odakyu.jp/station/fujisawa/","https://www.odakyu.jp/station/mutsuai_nichidai_mae/"]},
  {venue:"toki-messe",hotels:["art-hotel-niigata-station","comfort-hotel-niigata-station"],modes:["walk","bus"],route:"ホテル公式案内で新潟駅のバス乗場へ。大学要項の朱鷺メッセ方面のバスで朱鷺メッセ下車（バス約15分）。指定ホール・受験生入口までの移動は別。",transfers:0,caution:"新潟駅のバス乗場再編後の乗場・時刻を確認。南口側ホテルからは駅構内の移動を別に確保し、降雪・道路混雑を見込んでください。"},
  {venue:"chateraise-nagano",hotels:["sotetsu-fresa-inn-nagano-zenkojiguchi","hotel-new-nagano-next"],modes:["walk"],route:"ホテル公式案内で長野駅へ。公共通路で東口側へ出て、大学要項の徒歩約5分の経路でシャトレーゼホテル長野へ。善光寺口と東口の移動は別に見込む。",transfers:0},
  {venue:"nihon-mishima",hotels:["toyoko-inn-fujisan-mishima-eki","fujisan-mishima-tokyu-hotel"],modes:["walk"],route:"ホテル公式案内で三島駅北口側へ。大学要項の徒歩1分の経路で国際関係学部三島駅北口校舎へ。南口側の東急ホテルは南北移動の経路を別に確認。",transfers:0,caution:"三島駅の南北移動に新幹線・在来線の改札内通行を前提としないでください。前日に通行できる経路を確認し、必要時間を別に確保。"},
  {venue:"nagoya-chamber",hotels:["meitetsu-inn-nagoya-sakuradori","sotetsu-fresa-inn-nagoya-sakuradoriguchi"],modes:["walk","rail"],route:"ホテル公式案内で名古屋駅へ。地下鉄東山線藤が丘方面で伏見駅へ1駅、5番出口から大学要項の徒歩5分の経路で名古屋商工会議所へ。",transfers:0,evidence:["https://www.kotsu.city.nagoya.jp/jp/pc/subway/"]},
  {venue:"ap-osaka-chayamachi",hotels:["hotel-hankyu-respire-osaka","hotel-binario-umeda"],modes:["walk"],route:"ホテル公式案内で阪急大阪梅田駅側へ。大学要項の茶屋町1-27 ABC-MART梅田ビル8階の会場図へ接続。阪急駅から徒歩1分、JR御堂筋北口から3分は駅からの区間のみ。",transfers:0},
  {venue:"hiroshima-sangyo-west",hotels:["hotel-mielparque-hiroshima","hotel-livemax-hiroshima-heiwa-koen"],modes:["walk","rail"],route:"紙屋町西から6号線、袋町から1号線の広島駅方面で稲荷町へ。5号線広島港方面へ乗換えて南区役所前下車、大学要項の徒歩1分の経路で西展示館へ。ホテルから停留場へは各ホテル公式の動線を利用。",transfers:1,evidence:["https://www.hiroden.co.jp/train/route-guide/stop-guide/search-route.html"],caution:"産業会館は西展示館を指定。本館・東展示館とは区別し、受験票で階・室を確認。広島電鉄は新線・系統変更があるため試験日直前に乗場と系統を確認してください。"},
  {venue:"fukuoka-chamber",hotels:["daiwa-roynet-hotel-hakata-gion","skyheart-hotel-hakata"],modes:["walk"],route:"ホテル公式の祇園駅アクセスを接続点とし、大学要項の5番出口側の徒歩経路で福岡商工会議所へ（出口から徒歩3分）。ホテル最寄り3番出口との移動を別に見込む。",transfers:0},
  {venue:"nagasaki-nihon-high",hotels:["hotel-cuore-nagasaki-ekimae","coruscant-hotel-nagasaki-station-1"],modes:["walk","rail"],route:"ホテル公式案内でJR長崎駅へ。長崎本線の市布経由・西諫早停車の普通列車で西諫早駅へ。大学要項の徒歩10分の経路で長崎日本大学高校へ。",transfers:0,evidence:["https://www.jrkyushu.co.jp/railway/station/map.html"],caution:"会場は諫早市です。長崎駅周辺の宿泊候補なので列車移動が必要。西諫早停車・市布経由の便を確認し、新幹線や長与経由の列車の時刻を流用しないでください。"},
  {venue:"miyazaki-nihon-high",hotels:["comfort-hotel-miyazaki","green-rich-hotel-miyazaki-tachibanadori-2"],modes:["walk","rail"],route:"ホテル公式案内でJR宮崎駅へ。日豊本線延岡方面の日向住吉停車の普通列車で日向住吉駅、大学要項の南へ徒歩15分の経路で宮崎日本大学高校へ。",transfers:0,evidence:["https://www.jrkyushu.co.jp/railway/station/map.html"],caution:"市街地から列車移動が必要です。本数・停車駅を確認し、宮崎駅で降りたまま徒歩圏の会場と誤認しないでください。"},
];

export function applyNovemberHotelUpdates2027(hotels: PrivateMedicalVenueHotel2027[]) {
  // 複数会場で共用する宿の共通注記に旧会場の「徒歩のみ」「同じ建物」等を残さない。
  // 各会場の交通経路・集合条件は venueAccess 側で案内する。
  const venueSpecificNotePatterns: Record<string, RegExp> = {
    "ginza-kokusai-hotel": /産業医科大学|使用階・試験室/u,
    "keio-plaza-hotel-tokyo": /試験会場の棟/u,
    "hotel-rose-garden-shinjuku": /東京医科大学/u,
    "comfort-hotel-sendai-west": /一般選抜第1次|使用階・試験室/u,
    "hotel-gracery-sapporo": /東北医科薬科大学|使用階・試験室/u,
    "ab-hotel-nagoya-sakae": /ウインクあいちへ|いずれも2027/u,
    "hotel-hankyu-respire-osaka": /藤田医科大学|使用階・試験室/u,
    "comfort-inn-fukuoka-tenjin": /福大前|福岡大学/u,
    "daiwa-roynet-hotel-nagoya-shinkansenguchi": /福岡大学/u,
    "meitetsu-inn-nagoya-sakuradori": /名古屋会場は大学公式/u,
    "mitsui-garden-hotel-sendai": /試験朝は鉄道/u,
    "daiwa-roynet-hotel-chiba-chuo": /試験会場へは/u,
    "comfort-hotel-niigata-station": /試験朝はC1/u,
    "sotetsu-fresa-inn-nagoya-sakuradoriguchi": /会場と同じ名駅/u,
    "hotel-mielparque-hiroshima": /試験会場と同じ|試験当日の使用室/u,
    "mars-garden-hotel-hakata": /試験朝は博多駅/u,
    "the-b-hakata": /試験朝は博多駅/u,
    "hotel-cuore-nagasaki-ekimae": /試験朝は公共交通/u,
    "comfort-hotel-miyazaki": /学力試験・面接の朝/u,
    "karaksa-hotel-grande-shin-osaka-tower": /大阪会場は希望者数/u,
    "comfort-hotel-shin-osaka": /大阪会場は希望者数/u,
  };
  for (const hotel of hotels) {
    const oldVenuePattern = venueSpecificNotePatterns[hotel.hotelId];
    if (oldVenuePattern && hotel.note) hotel.note = hotel.note.split(/(?<=。)/u).filter((sentence) => !oldVenuePattern.test(sentence)).join("");
    if (hotel.hotelId === "fukuoka-garden-palace") hotel.note = hotel.note?.replace("会場と同じ建物にある73室のホテルです。", "天神北にある73室のホテルです。");
    if (hotel.hotelId === "hotel-sapporo-garden-palace") hotel.note = hotel.note?.replace("北1条西6丁目にある164室の地域型ホテルで、鉄道に乗らず面接会場へ向かえます。", "北1条西6丁目にある164室の地域型ホテルです。");
    if (hotel.hotelId === "meitetsu-inn-nagoya-sakuradori") hotel.note = hotel.note?.replace("9:30開始の試験に向けて", "受験票の集合時刻に向けて");
    if (hotel.hotelId === "daiwa-roynet-hotel-chiba-chuo") hotel.note = `${hotel.note ?? ""} 2区間の分数を単純合算せず、鉄道・乗換・待ち時間・指定受付までを含む通し所要は会場別に確認してください。`;
    if (hotel.hotelId === "comfort-hotel-niigata-station") hotel.note = `${hotel.note ?? ""} 降雪・道路遅延を見込み、会場別のバス系統・乗場・2027年ダイヤを直前に確認してください。`;
    for (const access of hotel.venueAccess) {
      const policy = novemberCampusPolicies2027[access.venueId];
      if (!policy) continue;
      // 交通区間の数値は旧調査のまま維持。試験指定だけを新要項で差し替える。
      const prior = (access.caution ?? "").split(/2027(?:年|年度)/u)[0];
      const routeCaution = prior.slice(0, prior.lastIndexOf("。") + 1);
      access.caution = `${routeCaution} ${policy.note} 各交通区間は通し所要時間ではありません。試験日朝のダイヤ・運行を直前に再確認してください。`;
      access.evidenceUrls = [...new Set([...access.evidenceUrls, novemberGuidelines2027[policy.source]])];
      access.verifiedAt = checkedAt;
    }
    if (["sotetsu-fresa-inn-nagano-zenkojiguchi", "sotetsu-fresa-inn-nagoya-sakuradoriguchi"].includes(hotel.hotelId)) {
      // 詳細URLは404だが、正規ドメインの現行施設一覧に名称・最寄駅を掲載。閉館とは断定しない。
      hotel.officialUrl = "https://sotetsu-hotels.com/hotel/";
      hotel.officialBookingUrl = hotel.officialUrl;
      hotel.operatingStatusEvidenceUrl = hotel.officialUrl;
      hotel.note = `${hotel.note ?? ""} 11月4日時点で店舗詳細ページが取得できないため、リンク先は名称・駅アクセスを掲載する運営元公式の施設一覧です。設備は従前の確認記録であり今回の再確認済みとはせず、予約可否と最新設備・朝食時間は当店舗へお問い合わせください。`;
    }
    if (["keikyu-ex-inn-keikyu-kamata-ekimae", "grand-park-hotel-panex-tokyo", "kurume-station-hotel"].includes(hotel.hotelId)) {
      hotel.note = hotel.note?.replace(/完成版募集要項の集合時刻/gu,"受験票・一次合格者案内の集合時刻")
        .replace(/完成版募集要項で集合時刻/gu,"受験票・一次合格者案内で集合時刻")
        .replace(/10月中旬公開予定の学生募集要項で当日の入室・集合時刻が判明してから再判断してください/gu,"現行募集要項・受験票の入室・集合時刻を確認して判断してください");
    }
  }
  for (const [hotelId,name,prefecture,municipality,address,nearestStation,officialUrl,amenities,note] of hotelSeeds) {
    if (hotels.some((hotel) => hotel.hotelId === hotelId)) throw new Error(`Duplicate November hotel: ${hotelId}`);
    hotels.push({hotelId,name,prefecture,municipality,address,nearestStation,officialUrl,officialBookingUrl:officialUrl,amenities,venueAccess:[],
      operatingStatus:"official_site_active",operatingStatusEvidenceUrl:officialUrl,reviewState:"verified",verifiedAt:checkedAt,
      note:[note,"空室・料金・試験日の提供サービスは保証しません。禁煙室、机の広さ・照明、未成年者のみの宿泊可否・同意書、取消条件は当店舗へ予約前に確認してください。"].filter(Boolean).join(" "),});
  }
  for (const group of accessGroups) {
    const venueId = `venue-${group.venue}`;
    const venue = novemberVenues2027.find((entry) => entry.venueId === venueId);
    if (!venue) throw new Error(`Missing November venue: ${venueId}`);
    for (const hotelId of group.hotels) {
      const hotel = hotels.find((entry) => entry.hotelId === hotelId);
      if (!hotel) throw new Error(`Missing November hotel: ${hotelId}`);
      if (hotel.venueAccess.some((access) => access.venueId === venueId)) throw new Error(`Duplicate November access: ${hotelId}/${venueId}`);
      hotel.venueAccess.push({venueId,modes:group.modes,routeSummary:group.route,transferCount:group.transfers,
        measurementBasis:"route_only",reviewState:["verified_with_caveat","venue_pdf_visual_review"],verifiedAt:checkedAt,
        caution:[group.caution,venue.accessNote,"各徒歩・鉄道・バスの区間案内であり、待ち時間・構内移動・受付までを足した通し所要時間ではありません。試験日朝の運行と受験票を確認してください。"].filter(Boolean).join(" "),
        evidenceUrls:[...new Set([hotel.officialUrl,venue.officialUrl,...(group.evidence??[])])],});
    }
  }
}
