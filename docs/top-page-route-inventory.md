# トップページ遷移先リスト

現行トップページの保存HTMLとキャプチャJSONから抽出した内部リンクの棚卸しです。
最新投稿の個別記事は「投稿系」として固定ページ再現の対象から分離します。

## 固定ページ・優先実装

| Path | 表示名・用途 | 種別 |
| --- | --- | --- |
| `/top/voice/` | 合格実績 | 固定ページ |
| `/voice/` | インタビューを全て見る | 固定ページ |
| `/medical-english-training/` | “鬼特訓”とは？ / 英語の鬼特訓 | 固定ページ |
| `/medical-math-training/` | 数学の鬼特訓 | 固定ページ |
| `/study-support-system/` | “鬼監理”とは？ | 固定ページ |
| `/top/results/` | 医学部受験 攻略メソッド | 固定ページ |
| `/results/` | 合格メソッドを詳しく見る | 互換ページ |
| `/top/teacher/` | 講師紹介 / 体験授業 | 固定ページ |
| `/top/history/` | 医学部予備校としての強み / レクサスの歴史 | 固定ページ |
| `/top/faq/` | よくある質問 | 固定ページ |
| `/top/course/` | 医学部専門 コース一覧 | 固定ページ |
| `/lexus-premier/` | レクサス プレミア本科 | 固定ページ |
| `/top/course/lexus-premiere-course/` | レクサス プレミア本科 旧導線 | 互換ページ |
| `/top/course/high-level-geneki-course/` | ハイレベル現役合格コース | 固定ページ |
| `/top/course/custom-made-course/` | オーダーメード演習コース | 固定ページ |
| `/top/course/medical-prep/` | メディカル準備コース 高等部 | 固定ページ |
| `/top/course/medical-prep-junior/` | メディカル準備コース 中等部 | 固定ページ |
| `/top/access/` | アクセス | 固定ページ |
| `/top/lexus-garden/` | 生徒専用寮 レクサスガーデン | 固定ページ |
| `/entrance/` | 入学までの流れ | 固定ページ |
| `/top/information-kokuritsu/` | 国公立医学部（大学別） | 固定ページ |
| `/top/information-shiritsu/` | 私立医学部（大学別） | 固定ページ |
| `/information-faq/` | 私立医学部 入試のQ＆A | 固定ページ |
| `/kuriage-information/` | 私立医学部 繰り上げ合格データ | 固定ページ |
| `/penguin-geometry/` | ペンギン数学-図形編- | 固定ページ |
| `/penguin-integral/` | ペンギン数学-積分編- | 固定ページ |
| `/english-training/` | お餅と茄子の英語 | 固定ページ |
| `/top/line/` | 無料LINE質問対応 | 固定ページ |
| `/top/summer-plan/` | 動画コンテンツ / LINE質問対応の既存導線 | 固定ページ |
| `/mail-01/` | 保護者の声 1 | 固定ページ |
| `/mail-02/` | 保護者の声 2 | 固定ページ |
| `/mail-03/` | 保護者の声 3 | 固定ページ |
| `/past-post/` | 過去の投稿を見る | 一覧ページ |
| `/特定商取引法に基づく表記/` | 特商法に基づく表記 | 法務ページ |

## フォームページ

| Path | 用途 | 今回の方針 |
| --- | --- | --- |
| `/request-documents/` | 資料請求 | Googleフォームではなく独自フォームUIを作る |
| `/top/reservation/` | 個別相談 | 独自フォームUIを作る |
| `/reservation/` | 個別説明会 / 校舎と寮の見学 | 独自フォームUIを作る |
| `/top/contact/` | お問合せ | 独自フォームUIを作る |
| `/test-entry/` | 選抜テスト申込 | 独自フォームUIを作る |

## 投稿系リンク

以下はトップの「最新投稿記事」からの遷移です。固定ページ再現とは分けますが、トップからのリンク切れを避けるため、現時点では同じ軽量テンプレートで静的生成します。

- `/dokkyouika-university-entrance-exam-measures2027/`
- `/jichiika-university-entrance-exam-measures2027/`
- `/saitamaika-university-entrance-exam-measures2027/`
- `/touhokuikayakka-university-entrance-exam-measures2027/`
- `/toukai-university-entrance-exam-measures2027/`
- `/kanazawaika-university-entrance-exam-measures2027/`

## メニュー構造

現行サイトのメガメニューは以下の6グループです。トップ実装の `navGroups` はこの構造に合わせます。

- 実績 / メソッド / 講師
- 体験 / ガイダンス
- コース / 学費
- 校舎 / 寮
- 医学部情報
- ペンギン動画
