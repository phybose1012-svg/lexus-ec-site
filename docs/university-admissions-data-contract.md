# 大学別の2027年度入試データ

81大学の旧入試表を、大学公式資料で確認できた大学から復元するための共通契約です。大学ごとに `frontend/src/data/universityAdmissions/{slug}.json` を置きます。`/information-yamanashi/` は `yamanashi.json` です。JSONがない大学は、そのブランチの現在の本文・メタ情報をそのまま表示します。

公開は **stagingへ反映 → stagingで実際に公開された表を公式資料と再照合 → 合格した大学だけmainへ反映** の順です。JSONの存在や構文検証だけで本番反映可とは判断しません。ユーザーから、この手順を満たした大学の本番反映は承認済みです。毎大学の追加承認を求める必要はありません。

## JSON契約

次は形式の例です。値とURLは説明用で、実際の入試情報ではありません。

```json
{
  "path": "/information-yamanashi/",
  "university": "山梨大学",
  "admissionYear": 2027,
  "verifiedAt": "2026-10-09T15:00:00+09:00",
  "sources": [
    {
      "id": "guideline-2027",
      "url": "https://www.yamanashi.ac.jp/replace-with-real-official-source.pdf",
      "title": "令和9年度 医学部医学科 学生募集要項（説明用）",
      "publishedAt": "2026-10-01",
      "retrievedAt": "2026-10-09T14:00:00+09:00",
      "sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "pages": [4, 5]
    }
  ],
  "schemes": [
    {
      "id": "general-late",
      "name": "一般選抜（後期）",
      "scheduleRows": [
        {
          "label": "出願期間・書類提出締切",
          "value": "説明用の値。実際の日付と締切条件へ置き換える。",
          "sourceIds": ["guideline-2027"],
          "status": "confirmed"
        }
      ],
      "examRows": [
        {
          "label": "面接の評価方法",
          "value": "未公表（最新の公式入試案内では確認できない）",
          "sourceIds": ["guideline-2027"],
          "status": "unpublished"
        }
      ],
      "venueRows": [
        {
          "label": "二次試験会場・集合場所",
          "value": "要確認（受験票の指定を確認）",
          "sourceIds": ["guideline-2027"],
          "status": "needs-confirmation"
        }
      ],
      "notes": [
        {
          "text": "対象の選抜方式にだけ適用される公式の注意点を記載する。",
          "sourceIds": ["guideline-2027"]
        }
      ]
    }
  ],
  "coverageNotes": [
    "掲載した方式と、今回掲載していない方式を明記する。",
    "募集要項の公表待ちや別資料での確認が必要な項目を明記する。"
  ]
}
```

必須の最上位項目は `path`, `university`, `admissionYear`, `verifiedAt`, `sources`, `schemes`, `coverageNotes` です。配列の順序がそのまま公開順になります。日付は `YYYY-MM-DD`、または時差を含むISO8601日時を使います。日時を使う場合は日本時間の記録を推奨します。`verifiedAt` はすべての原典の `retrievedAt` 以降にします。

出典の `id`, `url`, `title`, `retrievedAt` は必須です。`publishedAt`, `sha256`, `pages` は任意です。`sha256` を記録する場合は、取得した原典ファイルのバイト列のSHA256です。PDFは参照箇所を追えるよう `pages` を付けます。ページ指定は `[4, 5]` のような正のページ番号配列、または `"PDF pp.4–5（冊子 p.2–3）"` のような文字列です。

各方式の `id`, `name`, `scheduleRows`, `examRows`, `venueRows`, `notes` は必須です。方式ID・出典IDは小文字英数字とハイフンのslugにします。同じIDを重複させません。日程・科目配点・会場の各配列は最低1行です。未公表でも配列を空にせず、何が未公表かを行に明記します。`notes` は空配列でも構いません。`coverageNotes` は最低1項目です。

表の行は `label`, `value`, `sourceIds` が必須です。値はHTMLを含まない通常の文章です。改行は `\n` で入れられます。1行に複数の公式資料が必要な場合は、`sourceIds` に複数のIDを入れます。注記は `text`, `sourceIds` が必須です。

行の `status` は任意で `confirmed`, `unpublished`, `needs-confirmation` を使います。未公表は `value` に「未公表」等、確認が必要な値は「要確認」等を必ず書きます。既知の期間・配点と不明な締切時刻・試験時間が同じ行にある場合は、`needs-confirmation` とし「締切時刻は未公表」「試験時間は未公表」のように未確定部分を具体的に示す文言でも構いません。statusだけで状態を伝えません。未公表の根拠には、その大学の最新公式入試案内・募集要項のURLと確認日を使います。アクセス障害で原典を確認できないことを、「大学が未公表」と読み替えません。

## 調査と値の書き方

2027年度（令和9年度）の当該学部・学科・方式を1つずつ確認します。2026年度の値をそのまま転用したり、日付に1年を加えたりしません。前期・後期、一般・共通テスト利用、地域枠・推薦等は別方式にします。まだ確認できない項目は推測で埋めません。

行名は柔軟に作れます。少なくとも、対象資料にある次の条件を取り違えないよう分けて記録します。

- Web登録・検定料支払い・書類提出の各締切、時刻、必着／消印有効。
- 一次・二次試験、合格発表、入学手続の期間と期限。
- 共通テストと個別試験の科目・選択条件・配点、情報Ⅰの扱い。
- 第一段階選抜・足切りの条件、面接や小論文の配点と不合格判定条件。
- 試験会場、大学指定・希望選択・受験票で確定する条件。
- 出願資格、専願・併願、地域枠の条件、大学が出した訂正・変更通知。

数値を含む表と注記は、対応する原典の頁・表・記述に照合できるようにします。集約記事や大学名を含む非公式サイトを根拠にしません。`coverageNotes` に含まれる事実上の主張も原典を確認し、確認範囲の説明と推測を混ぜません。

## buildで検出する不備

共通レンダラー `frontend/src/lib/universityAdmissions.ts` は、81大学の固定path・名称・大学公式ドメインと、後述の共通テスト実施機関に照合します。別大学のドメイン、非公式URL、HTTP、認証情報付きURL、重複path・ID、旧年度、空の値、参照先が存在しない出典ID、不正な日付・SHA256、未公表／要確認statusと本文の不整合はエラーです。壊れたJSONはViteの読み込み段階で失敗します。どちらも黙って古い案内へ戻しません。

固定profileはSafetyを持たないstagingでも使えるよう、rendererに独立して置いています。大学が別の公式入試ドメインを運営する場合は共通側の許可リストで管理します。現在は岩手医大の `imu-admission.jp`、東京医大の `admissions-tokyo-med.jp`、東京女子医大の `twmu-u.jp` を許可しています。共有ベンダーや第三者サイトの「公式」自己申告では許可しません。新しい公式ドメインが必要なら、大学との対応を原典で確認してから共通側を更新します。

### 大学入試センターの共通テスト資料

全国共通の大学入学共通テストの実施期日・実施ルールは、大学入試センターの一次資料を使えます。たとえば [大学入試センター・令和9年度試験](https://www.dnc.ac.jp/kyotsu/shiken_jouhou/r9/) は本試験・追再試験の実施期日と受験案内を掲載しています。許可するhostは `dnc.ac.jp` とそのサブドメインです。`dnc.ac.jp.evil`、`not-dnc.ac.jp`、他大学・他予備校のURLは許可しません。

これは大学固有の募集条件の根拠を置き換える許可ではありません。各大学のJSONには、当該大学自身または当該大学の許可済み入試サイトの公式出典を最低1件必要とします。DNC資料だけのJSONはbuildに失敗します。

DNCの出典IDを使う行の `label`、または注記の `text` は、「共通テスト」を明示します。大学の出願締切や独自試験会場など、共通テストと明示されていない項目へのDNC引用は、大学の資料を併記してもエラーです。

DNCのみを1行の根拠にできるのは、`scheduleRows` の「大学入学共通テスト（本試験）」「共通テスト本試験日」「大学入学共通テスト（追・再試験）」等の、全国共通の実施日だけを書く行です。値は「2027年1月16日（土）・17日（日）。」のような日付だけとし、大学固有の成績利用年度や指定教科を同じ行に加える場合は大学公式の出典IDも併記します。

`examRows`、`venueRows`、注記、および日付以外の共通テスト条件にDNCを引用する場合は、当該大学の公式出典を同じ行・注記に必須とします。大学が採用する教科科目・換算配点・利用方法・出願条件・選抜方式・地域枠・独自試験会場は大学の一次資料で確認します。たとえば弘前大学の「共通テスト実施日＋2027年度の成績利用／指定6教科8科目」の行は、DNCの実施期日と弘前大学の選抜要項・総合型要項をそれぞれの主張に対応させます。

このラベル・出典範囲の検査は、大学固有条件をDNCだけで埋める誤りを防ぐための機械的な契約です。資料の中身の正しさを認定するものではありません。staging表示後の公式再照合では、同じ行に併記した大学資料とDNC資料のどちらが各主張を支えるかを分けて記録します。

build検証はJSONの形と対応関係の検証です。URLの存在、資料の最新性、値の正しさ、全方式の網羅を保証するものではありません。

## stagingと本番の確認

1. 1大学の原典を取得・読み込み、JSONを作り、出典・ページ・未公表・確認範囲を記録する。
2. 共通テストとbuildを通し、stagingへ反映する。この時点でmainへ同じJSONを入れない。
3. stagingの公開URLをGETして、実際の見出し・方式・全セル・注記・出典・確認日・年度表示をJSONと照合する。
4. その公開表の全セル・全注記を、再取得または再閲覧した最新公式資料へ再照合する。検証対象は `{scheme.id}/schedule/{index}`, `{scheme.id}/exam/{index}`, `{scheme.id}/venue/{index}`, `{scheme.id}/note/{index}`。coverageの事実上の主張も確認する。
5. stagingの公開URL、取得HTMLのhash、JSONのhash、原典と比較した対象・結果を検証記録へ残す。公開表に不合格の値がある大学は修正後に再確認し、合格までmainへ進めない。
6. 合格した大学だけ、同じ検証済みJSONと共通rendererをmainへ反映する。本番URLでも年度・主要表・出典が配信されていることを確認する。

## 共通APIと検証用属性

`applyVerifiedUniversityAdmissions(post)` はeager globで読んだ確認データのある大学だけ変更します。mainの分類前ではSafetyの後に、stagingでは分類前に単独で呼びます。データ0件または対象外の記事は同じオブジェクトを返し、HTML・metadata・年度を変更しません。

純粋関数は `validateUniversityAdmissions`, `createUniversityAdmissionsIndex`, `renderUniversityAdmissions`, `universityAdmissionsMetadata`, `applyUniversityAdmissionsFromIndex` です。NodeではVite globを評価せず、テストは明示的な入力を使います。

rendererは原記事の「一般選抜情報」「一次選抜情報」、またはmainの「最新の入試情報を確認する」を、新しい入試欄へ置換します。旧募集要項の独立blockも除き、大学概要と大学の魅力は維持します。旧Safety導入文は現在の入試表と過年度の大学概要を区別する案内へ置換し、学納金見出しを掲載時点の参考情報として扱います。全見出しから目次を作り直します。

公開属性は次の通りです。

| 対象 | 属性 |
|---|---|
| 入試section | `data-university-admissions-year="2027"` |
| 公式確認日time | `data-university-admissions-verified-at`, `datetime=verifiedAt` |
| 方式section | `data-admission-scheme=scheme.id` |
| table | `data-admission-table="schedule"` / `"exam"` / `"venue"` |
| tbody行 | `data-admission-row=index`、status指定時は `data-admission-status` |
| 行の項目 | `th scope="row" data-admission-label` |
| 行の内容 | `td data-admission-value` |
| 行の出典 | `td data-admission-sources`、各aに `data-admission-source-id` |
| 注記li / 本文span | `data-admission-note=index` / `data-admission-note-text` |
| coverage本文span | `data-admission-coverage-note=index` |
| 出典一覧ol / 各li | `data-admission-source-list` / `data-admission-source-id=source.id` |

h2はsection直前に `id="最新の入試情報"`、本文は「2027年度の入試情報」です。方式h3は `id="admission-scheme-{id}"`。captionは「{大学} 医学部 2027年度 {方式名} {日程／試験科目・配点／試験会場}」。表の列見出しは「項目」「内容」「公式出典」で、各列は `th scope="col"` です。出典リンクは直接公式URLを指します。すべてのJSONの文章はHTMLescapeして出力します。

該当大学の表示仕様は以下で固定します。

- title：`{大学}医学部｜2027年度入試情報・大学概要`
- displayTitle：`{大学} 医学部 2027年度入試情報・大学概要`
- displayTitleLines：`["{大学} 医学部", "2027年度入試情報・大学概要"]`
- description：`{大学}医学部の2027年度入試情報。大学公式資料で確認した選抜方式別の日程、試験科目・配点、試験会場を掲載しています。未公表・要確認の項目と掲載範囲を明記。大学概要の統計・学納金は過年度の参考情報です。`
- lead：`{大学}医学部の2027年度入試情報を、大学公式資料に基づき選抜方式別にまとめています。出願前には、該当年度の学生募集要項と大学の変更通知をご確認ください。`
- 年度カード：`2027年度（入試情報）`
- 種別カード：`大学概要・2027年度入試情報`
- modifiedと確認日表示：`verifiedAt.slice(0, 10)`。元の公開日は維持。

共通の意味テストは `cd frontend` のうえ `node --test scripts/university-admissions.test.mjs` で実行します。
