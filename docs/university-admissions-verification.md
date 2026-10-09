# 大学入試表の公開検証と公式再照合

1校ずつ、公式調査 → 原稿JSON → staging表示 → **表示された表を公式資料へ再照合** → main反映 → main表示確認の順に進めます。4セッションで調査を分担しても、公開する候補JSONと証拠のSHA256を学校ごとに固定します。データの形とHTML属性は [データ契約](university-admissions-data-contract.md) に従います。

`verify-page.mjs` が確認するのは、原稿JSONと公開HTMLの一致です。日付や配点が一致しても、JSONの調査が誤っていれば両方とも誤りです。このCLIの成功を、公式情報の正確性やmain公開の許可に読み替えてはいけません。CLIは公式資料を取得せず、`officialDataAccuracy: "not-assessed"` と `mainReady: false` を出力します。

## 機械検証

Node.jsと既存の `frontend/node_modules/parse5` を使います。学校別の公開原稿は `frontend/src/data/universityAdmissions/{slug}.json` に置きます。公開対象が固まったら、shared rootの `reports/university-admissions/{slug}/candidate.json` に同じUTF-8バイト列の確定snapshotを保存し、staging/main両方の検証でこのsnapshotを `--data` に使います。別worktreeのパス差異を候補の差異と混同しません。公開原稿とsnapshotのhashが異なる場合は同じ候補として扱えません。

```powershell
$publishCommit = git rev-parse HEAD
node scripts/university-admissions/verify-page.mjs `
  --data reports/university-admissions/kitasato/candidate.json `
  --url https://staging.lexus-ec.pages.dev/information-kitasato/ `
  --commit $publishCommit `
  --output reports/university-admissions/kitasato/staging-verification.json
```

mainへの反映後は同じ `--data` を使い、`--url https://lexus-ec.com/information-kitasato/` とmain用の `--output` を指定します。`--commit` はこのURLへ配備したGit SHAを明示する項目です。CLIはURLとSHAの配備関係を認定しないため、配備成功と対象コミットは公開担当が別途確認します。

CLIはHTTPSの `staging.lexus-ec.pages.dev` または `lexus-ec.com` の、原稿と同じパスだけをGETします。HTTP 200・HTML応答・mainの正しいcanonicalを要求し、リダイレクトを追いません。失敗時も可能な範囲の証拠JSONを保存し、終了コード1を返します。原稿JSONやサイトコードは変更しません。

照合対象は次のとおりです。

- 大学名・2027年度・タイトル・description・h1・冒頭説明。既存81大学のルートと大学名の対応も確認します。
- 年度付きセクション、見出し、確認日、選抜方式の順番と名称。
- 各方式の日程・試験科目配点・試験会場の3表。caption、列の `th scope="col"`、行の `th scope="row"`、項目名・値・順番・出典IDとURLを照合します。
- 行ごとの出典リンク、方式ごとの注記と出典、掲載範囲の説明、出典一覧のタイトル・URL・取得日。
- 不明欄の勝手な補完、原稿にない行や表、可視の旧安全措置placeholder。未公表・要確認の値は原稿と同じ文言のまま表示される必要があります。

DOMの `hidden`・`aria-hidden`・インライン非表示指定は確認します。CSSによる表示崩れ、狭い画面の横スクロール、ブラウザでの実際の可読性はスクリーンショットを使って別途確認します。

出力には `candidateFile`、原稿のUTF-8バイトSHA256である `candidateSha256` / `dataHash`、GET応答の `responseHash` / `htmlHash`、表の正規化内容の `tableHash`、`checkedAt` / `verifiedAt`、`httpStatus`、全 `checks` と `failedChecks` を保存します。応答HTMLのhashはCloudflareのメール保護属性などで応答ごとに変化することがあるため、stagingとmainの一致は `candidateSha256` と `tableHash` を使います。

`tableHash` は選抜方式の順番、3表のcaption、項目名、値、行に対応する出典IDとURLを含みます。注記・metadata等の一致は別のchecksで確認します。hashの一致だけでchecksの失敗を無視してはいけません。

## 公式資料への再照合はmain反映前に必須

stagingへ表示した後、担当AIは大学公式の対象年度・対象学部・対象方式の資料を再度開き、**stagingの各セルと注記を原典へ戻して確認**します。調査時の記憶や原稿JSONだけを読み直す作業は再照合として扱いません。ページ番号はPDFの印刷ページ番号とPDF内のページ位置が異なる場合、その違いも残します。

学校ごとに `reports/university-admissions/{slug}/reconciliation-{slug}.json` を保存します。最低限の形は次のとおりです。

```json
{
  "version": 1,
  "candidateFile": "reports/university-admissions/{slug}/candidate.json",
  "candidateSha256": "原稿ファイルの64桁SHA256",
  "path": "/information-{slug}/",
  "university": "当該大学の正式名称",
  "admissionYear": 2027,
  "reviewedAt": "ISO8601日時",
  "reviewer": "担当セッション・確認者",
  "sources": [
    {
      "sourceId": "guide",
      "url": "大学公式資料の完全なURL",
      "title": "資料名・対象年度",
      "retrievedAt": "ISO8601日時",
      "sha256": "取得した原典ファイルのSHA256",
      "pages": "使用したページ・節"
    }
  ],
  "comparisons": [
    {
      "target": "general/schedule/0",
      "label": "原稿の項目名",
      "value": "原稿の値",
      "sourceIds": ["guide"],
      "officialEvidence": [
        {
          "sourceId": "guide",
          "url": "原稿と同じ公式資料URL",
          "page": "PDF p.3（PDF内5ページ目）またはHTMLの節名",
          "officialQuote": "このセルを支える短い原典引用",
          "checkedAt": "ISO8601日時"
        }
      ],
      "reviewer": "確認者",
      "checkedAt": "ISO8601日時",
      "conclusion": "match",
      "reason": "対象年度・方式・段階・条件をどのように照合したか"
    }
  ],
  "coverageReview": { "confirmed": true, "notes": ["原稿のcoverageNotesと同じ本文・同じ順序"] },
  "passed": true
}
```

これは形を示す説明例です。プレースホルダーのまま証拠に使わず、実際に確認した値・原典・確認者を記入します。HTML原典でファイルhashを残す場合は、取得したHTMLファイル自体のhashを使います。

`comparisons` は全方式の全行と全注記を網羅します。`target` は `{scheme.id}/schedule/{行の0始まり番号}`、`{scheme.id}/exam/{番号}`、`{scheme.id}/venue/{番号}`、`{scheme.id}/note/{番号}` です。注記の場合は `value` の代わりに `text` を保存します。各recordの値・出典IDは、そのSHA256の原稿と一致させます。記入済みの1行だけで学校全体を確認済みと扱いません。`coverageReview` ではJSONの `coverageNotes` を一つずつ確認し、除外した方式や枠、未公表の欄をそのまま明記したことを記録します。`coverageReview.notes` はcandidateの `coverageNotes` と同じ文字列配列を同じ順で保存し、空配列や省略で確認を飛ばしません。

結論は `match`、`not-published-confirmed`、`needs-correction` のいずれかです。`needs-correction` が1件でもある場合はmain反映を止め、原稿を修正してstaging検証からやり直します。未公表は、対象年度の資料公開予定の告知や、調べた最新公式資料・節を示し、数字を推測して補完していないことを確認して `not-published-confirmed` とします。「見つからなかった」の一言や、公式サイトのトップURLだけでは十分な再照合証拠になりません。

特に日程は、入学年度と実施暦年、出願の開始・締切、必着・消印有効、オンライン登録と書類締切、一次・二次、発表、手続期限を区別します。科目配点は段階ごとの選択条件・総点・面接や調査書の扱いを確認します。会場は日程・段階・選抜方式・出願時選択・受験票指定による違いを確認します。公式PDF・変更通知に食い違いがあれば、新しいという理由だけで片方を採用せず、どの方式と条件に適用されるかを明記します。

## 公開証拠を完成させる

検証CLIが作る `pc` / `mobile` / `officialComparison` は未実施状態です。担当セッションは検証checksとhashを保ったまま、後続の公開証拠に次を記録します。

```json
{
  "pc": { "passed": true, "screenshotFile": "PCで表全体を確認した実ファイル" },
  "mobile": { "passed": true, "screenshotFile": "モバイルで表全体を確認した別の実ファイル" },
  "officialComparison": {
    "passed": true,
    "file": "reports/university-admissions/{slug}/reconciliation-{slug}.json",
    "sha256": "この再照合JSONの実バイトSHA256"
  }
}
```

stagingの公開証拠がHTTP 200・checks成功・同一candidate・PCとmobile表示成功・全セルの公式再照合成功を揃えるまでは、mainへpushしません。状態管理CLIの公開ロックを取得し、1校のmain反映と公開完了の確認を終えてから次の学校へ進みます。ロックの手順は [運用CLI](../scripts/university-admissions/) を参照します。

main反映後は新しいmain GETで機械検証し、stagingと同じcandidate hashとtableHashであること、配備コミット、PC/mobile表示を確認します。原稿が変わっていなければ、stagingで完成した公式再照合ファイルをmain証拠でも参照できます。原稿が1文字でも変わればcandidate hashが変わるため、以前の証拠を使い回さず再検証・再照合します。

`passed: true` だけを手書きして検証を省略しないでください。公式再照合JSONが空、セルを網羅しない、出典・引用・ページ位置・確認者・結論が欠ける、candidateと対応しない場合はmain反映不可です。mainの公開証拠が完成するまで学校を「公開完了」にせず、途中で止まった場合は次セッションへ候補と証拠と残作業を引き継ぎます。

## オフライン検証

```powershell
node --check scripts/university-admissions/verify-page.mjs
node scripts/university-admissions/verify-page.mjs --self-test
```

`--self-test` はfixture HTMLだけで、日付・出典URL・caption・行見出しscope・未公表欄の数値補完・canonical・旧placeholder・大学取り違え・注記・追加行・HTTP失敗を拒否することを確認します。ネットワーク要求やファイル書き込みは行いません。
