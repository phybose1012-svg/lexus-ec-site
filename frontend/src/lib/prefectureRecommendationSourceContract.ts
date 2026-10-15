export type PrefectureRecommendationOwnership = {publisher: 'prefecture-recommendation'; university: string; admissionYear: 2027; schemeId: string; ownerPageUrl: string; ownerPageSha256: string};
export type PrefectureRecommendationBinding = {path: string; sourceId: string; document: {url: string; sha256: string; title: string; pages: number[]}; ownership: PrefectureRecommendationOwnership; universitySource: {id: string; url: string; sha256: string; page: number}; claims: {kind: string; label: string; value: string}[]};
// Unapplied, candidate-specific proposal. County publishers are separate from
// university ownership and cannot replace university admission evidence.
// The owner HTML/PDF bytes and university referral pages are pinned in the
// accompanying proposal evidence; this pure validator does not fetch sources.
export const prefectureRecommendationBindings: readonly PrefectureRecommendationBinding[] = [
  {
    "path": "/information-nagasaki/",
    "sourceId": "pref-nagasaki-guide",
    "document": {
      "url": "https://www.pref.nagasaki.jp/fs/4/3/3/8/2/_/__9____________2B_________.pdf",
      "sha256": "898142680e549cb223c9d512d603ee555eedd5de8d5916b005f08871ada0c548",
      "title": "令和9年度長崎大学医学部学校推薦型選抜ⅡB・長崎県推薦選考試験募集要項",
      "pages": [
        2,
        3
      ]
    },
    "ownership": {
      "publisher": "prefecture-recommendation",
      "university": "長崎大学",
      "admissionYear": 2027,
      "schemeId": "recommendation-b",
      "ownerPageUrl": "https://www.pref.nagasaki.jp/doc/53157.html",
      "ownerPageSha256": "02e20b94e9c533c4bca076190ac8cde67b3bc85e405979f4047bf9d8a838b71f"
    },
    "universitySource": {
      "id": "recommendation-guide",
      "url": "https://www.nagasaki-u.ac.jp/nyugaku/admission/selection/file/R09/2027_Suisen-Youkou.pdf",
      "sha256": "68c134e29d1eed053276fabae1e33ac0e455dabc2a6b4af71fa138b554cc09fd",
      "page": 31
    },
    "claims": [
      {
        "kind": "exam",
        "label": "県の推薦",
        "value": "長崎県の推薦が必要です。県での事前選考と大学への出願は別の手続です。大学出願時に県の推薦書を提出します。"
      },
      {
        "kind": "schedule",
        "label": "長崎県・事前選考の申請",
        "value": "2026年10月1日～10月23日。県医療人材対策室へ書留速達・簡易書留速達で郵送、または平日9～17時に持参します。大学への12月の出願とは別です。"
      },
      {
        "kind": "schedule",
        "label": "長崎県・面談と結果通知",
        "value": "面談は2026年11月7日・8日予定、長崎県庁で実施します。10月30日までに日時等の通知がなければ県へ連絡。結果は11月下旬に全受験者へ通知し、推薦者には推薦書を交付します。"
      },
      {
        "kind": "venue",
        "label": "長崎県の選考会場",
        "value": "長崎県庁（長崎市尾上町3番1号）。日時と場所の詳細は県の通知で確認します。"
      }
    ]
  },
  {
    "path": "/information-nagasaki/",
    "sourceId": "pref-miyazaki-guide",
    "document": {
      "url": "https://www.pref.miyazaki.lg.jp/documents/112330/112330_20260909174251-1.pdf",
      "sha256": "085710095573944c6e33366392dbf37ddf94517e0761aa4d130b27fda6462438",
      "title": "令和9年度長崎大学医学部医学科学校推薦型選抜ⅡC・宮崎県推薦選考試験募集要項",
      "pages": [
        1,
        3
      ]
    },
    "ownership": {
      "publisher": "prefecture-recommendation",
      "university": "長崎大学",
      "admissionYear": 2027,
      "schemeId": "recommendation-c-miyazaki",
      "ownerPageUrl": "https://www.pref.miyazaki.lg.jp/iryoseisaku/kurashi/iryo/ishikakuho/20260907094524.html",
      "ownerPageSha256": "dfe3bbab0c5c1ded9f230e5bd6dbc57f7f40c3e5915199a9ff8cd5a6ee0afbf2"
    },
    "universitySource": {
      "id": "recommendation-guide",
      "url": "https://www.nagasaki-u.ac.jp/nyugaku/admission/selection/file/R09/2027_Suisen-Youkou.pdf",
      "sha256": "68c134e29d1eed053276fabae1e33ac0e455dabc2a6b4af71fa138b554cc09fd",
      "page": 33
    },
    "claims": [
      {
        "kind": "exam",
        "label": "県の推薦",
        "value": "宮崎県の推薦が必要です。県での事前選考と大学への出願は別の手続です。大学出願時に県の推薦書を提出します。"
      },
      {
        "kind": "schedule",
        "label": "宮崎県・事前選考の申請",
        "value": "2026年10月14日～10月23日17時15分。郵送は一般書留速達または簡易書留速達で17時15分必着。持参は県防災庁舎2階の医療政策課へ、平日8時30分～17時15分（12～13時を除く）に提出します。"
      },
      {
        "kind": "schedule",
        "label": "宮崎県・面接と結果通知",
        "value": "個人面接は2026年11月26日。11月19日までに面接時間等の通知がなければ県へ連絡してください。結果は12月4日付けで本人と出身学校長へ文書通知し、推薦者には推薦書を交付します。"
      },
      {
        "kind": "venue",
        "label": "宮崎県の選考会場",
        "value": "宮崎県防災庁舎53号室。詳細は県からの面接通知で確認します。"
      }
    ]
  }
];
