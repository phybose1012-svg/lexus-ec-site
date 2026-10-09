# 大学別入試表の状態CLIと公開手順

81大学を4担当で調査し、1担当につき1大学を進めます。大学別の公開順序は、調査・候補作成 → staging公開 → **公開された全セルと注記を公式資料へ再照合** → 合格した同一候補だけmainへ反映 → 本番公開確認 → 60秒待機です。ユーザーはこの条件を満たした本番反映を承認しています。

調査範囲は [4セッションの実行契約](university-admissions-orchestration.md)、候補JSONは [データ契約](university-admissions-data-contract.md)、公開HTMLと公式資料の確認は [検証手順](university-admissions-verification.md) に従います。このCLIは状態と証拠の整合を検証します。Git操作、デプロイ、公式資料の取得、画像の目視は実行しません。

## 正本の場所と書き込み範囲

共有状態は常に **`C:/---hp-seo/reports/university-admissions`** です。worktree内に別の進捗台帳を作りません。

| ファイル | 用途・所有者 |
|---|---|
| `manifest.json` | rootが作成する担当表。worker 1〜4に21・20・20・20大学を割り当てる。進捗更新では上書きしない。 |
| `items/{slug}.json` | 大学1件の状態・候補・証拠・履歴。当該workerだけがCLIで更新する。 |
| `workers/{1..4}.json` | 当該担当のcurrentSlug、lastPublishedAt、nextEligibleAt。CLIで更新する。 |
| `{slug}/` | 確定候補snapshot、原典、公式比較JSON、検証結果、PC/スマホ画像。当該workerの証拠領域。 |
| `publish.lock/owner.json` | 全担当共通の公開ロック。CLIだけで取得・解除する。 |

どのworktreeから実行しても、正本のCLIとworkspaceを明示します。

```powershell
$workflowCli = 'C:/---hp-seo/scripts/university-admissions/workflow-state.mjs'
node $workflowCli next --worker 1 --workspace C:/---hp-seo
node $workflowCli status --worker 1 --workspace C:/---hp-seo
node $workflowCli status --worker 1 --slug yamanashi --workspace C:/---hp-seo
```

worktree内のCLIを使う場合も `--workspace C:/---hp-seo` を必ず付けます。証拠の相対パスはこのworkspaceが基準です。`--state-dir` はテスト・別年度の独立台帳向けで、今回の4担当は変更しません。CLIはJSONを標準出力し、拒否時は `ok:false` とエラーコードを返して終了コード1で終了します。

## nextと更新

`next --worker N` はその担当のリストだけを選びます。進行中大学があれば `action:"resume"`、開始可能なら `action:"start"`、公開完了後60秒未満なら `action:"wait"` と `remainingMs` を返します。waitでは次大学の状態ファイルを作らず、新しい大学を開始しません。待機時間が経過してからnextを再実行します。1分間隔のheartbeatは公開から60秒経過したことの代用になりません。

状態は `pending` → `researching` → `draft` → `staging-published` → `staging-verified` → `main-published` → `main-verified` → `published` です。draftやstaging-publishedは途中経過です。**mainへpushする前にstaging-verifiedのCLI成功が必須**で、main-published、main-verified、publishedの必須ゲートを飛び越せません。候補を変更する場合はstaging確認からやり直します。

更新JSONを大学別領域へ保存し、1件だけ渡します。

```powershell
node $workflowCli update --worker 1 --slug yamanashi `
  --file C:/---hp-seo/reports/university-admissions/yamanashi/draft-state.json `
  --workspace C:/---hp-seo
```

draft-state.jsonの例は `{"state":"draft","researchNotes":"公式資料の確認範囲と残作業"}` です。大学名・path・worker・履歴・公開時刻・待機時刻は直接変更できません。publishedの記録は上書きできず、別年度は別manifestと状態領域で管理します。

## 候補を固定して公開する

1. 専用worktreeで当該大学の `frontend/src/data/universityAdmissions/{slug}.json` を作り、データ検証・必要なビルドを通します。共通レンダラーや他大学のデータを担当判断で変更しません。
2. 実バイトを `C:/---hp-seo/reports/university-admissions/{slug}/candidate.json` へ確定snapshotとして保存し、SHA-256を計算します。stagingとmainの検証CLIの `--data`、状態の `candidate.file`、公式比較の `candidateFile` に**同じsnapshotのパス**を使います。candidate.sha256はこの実ファイルの64桁hashです。
3. 公開ロックを取得してから最新 `origin/staging` をfetchし、staging用worktreeへ**当該大学JSONだけ**を適用します。コピー先の実バイトhashもsnapshotと一致させます。`CF_PAGES_BRANCH=staging` で必要なビルドを通し、差分を確認して通常pushします。force pushは使いません。
4. 当該staging commitのCloudflare Pages check-runs成功を確認します。Git push成功やcombined statusだけで公開成功とは扱いません。公開URL `https://staging.lexus-ec.pages.dev/information-{slug}/` を新しくGETしてverify-pageを実行し、PCとスマホの表全体を確認します。
5. **そのGET後**に、表示された全行・全注記を当該年度・大学・医学科・方式の大学公式資料へ再照合します。比較記録に原典URL、ページ/節、短い引用、確認者、日時、判断理由を残します。掲載範囲も全文を確認します。不一致があれば候補を直してstaging公開からやり直します。
6. 完成したstaging証拠を含むstate patchで `update ... state=staging-verified` を実行します。CLIが成功するまでmainへpushしません。
7. 最新 `origin/main` をfetchし、本番用worktreeへ**検証済みsnapshotと同一hashの当該大学JSONだけ**を選択移植します。stagingブランチ全体をmainへmergeしません。既存10月表示・過去問の公開制御・他担当の差分を保ち、`CF_PAGES_BRANCH=main` で必要な検証・本番ビルドを通します。直前にリモート更新があれば最新mainへ取り込み直して差分を再確認し、通常pushします。
8. mainへpushした40桁commitを `update ... state=main-published` で記録します。この更新は直前がstaging-verified、または同じ大学のmain-published再開であること、同一候補、最新staging証拠の成功を要求します。CLIがmainPublishedAtを自動記録します。
9. 当該main commitのCloudflare Pages check-runs成功を確認し、**main-published記録後**に本番URL `https://lexus-ec.com/information-{slug}/` を新しくGETします。verify-page、公開表全体のPC/スマホ確認を行い、main証拠を完成させます。
10. `update ... state=main-verified` を成功させ、`published` を所有token付きで記録して公開ロックを解除します。CLIが本番確認完了の記録時刻をlastPublishedAtとし、nextEligibleAtを60秒後へ設定します。途中で止まった場合は同じ大学を再開し、完了扱いにしません。

候補が1文字でも変わるとhashが変わります。stagingの公式再照合が済んだ候補をmain側で書き直したり、以前の証拠を別候補へ付け替えたりしません。各worktreeでのビルド時だけブランチに対応するCF_PAGES_BRANCHを設定し、他の作業へ設定を持ち越さないでください。

## 必須ゲートのpatch

staging-verifiedへ渡すpatchは次の形です。stagingEvidenceにはverify-pageの実出力を使い、後続の画面確認・公式比較を完成させた全objectを埋め込みます。

```json
{
  "state": "staging-verified",
  "candidate": {
    "file": "reports/university-admissions/{slug}/candidate.json",
    "sha256": "実ファイルの64桁SHA-256"
  },
  "stagingEvidence": { "説明": "完成したstaging検証object全体" }
}
```

これは形式の説明例です。説明文字列やプレースホルダーのまま渡しても成功しません。公開証拠にはpassed、HTTP 200、正しいHTTPS公開URL、40桁commit、checkedAt、responseHash、tableHash、全checks成功、空のfailedChecks、同一candidateFile/candidateSha256を要求します。pc/mobileはpassed=trueと異なる実画像ファイルが必要です。公式比較はpassed=trueだけでは足りず、比較JSON実ファイルのfile/sha256を要求します。

公式比較JSONは候補と同じ大学名・2027年度・path・candidateFile/hashを持ち、候補の全出典ID・URL・題名を網羅します。全方式の全schedule/exam/venue行と全noteを、同じ項目名・値・本文・sourceIdsで照合します。各出典に対応するページ/節と短い原典引用、確認日時・確認者・理由が必要です。needs-correctionは拒否します。unpublished行は公式確認によるnot-published-confirmedが必要です。coverageReview.notesはcandidate.coverageNotesの全文・全件・同順です。公式比較の日時はstaging公開GET後で、最終reviewedAt以前に揃えます。

mainへpushした後のpatchは `{"state":"main-published","commit":"実際にpushした40桁SHA"}` です。main確認後のpatchは `{"state":"main-verified","mainEvidence":{...完成した本番証拠...}}` です。mainEvidence.commitは記録した本番commitと一致し、staging/mainは同じ候補hashとtableHashを持ちます。同じ候補なら、stagingで完成した公式比較JSONをmain証拠でも参照できます。本番GET・画面確認は新しく実施します。

```powershell
node $workflowCli update --worker 1 --slug yamanashi `
  --file C:/---hp-seo/reports/university-admissions/yamanashi/staging-verified-state.json `
  --workspace C:/---hp-seo
node $workflowCli update --worker 1 --slug yamanashi `
  --file C:/---hp-seo/reports/university-admissions/yamanashi/main-published-state.json `
  --workspace C:/---hp-seo
node $workflowCli update --worker 1 --slug yamanashi `
  --file C:/---hp-seo/reports/university-admissions/yamanashi/main-verified-state.json `
  --workspace C:/---hp-seo
node $workflowCli published --worker 1 --slug yamanashi `
  --token $publishToken --workspace C:/---hp-seo
```

上の各コマンドの間には該当する公開・検証作業があります。一度に連続実行して公開確認を省略しません。証拠は同じ大学のstateへ保存されるため、最後のpublishedでファイルを再渡しする必要はありません。

## 公開ロック

公開ロックはstaging push開始前からmainの新しいGET・画面確認・published記録まで保持します。その間も他workerは自分の大学を調査できます。取得失敗は即時に返り、ロックが空くまで別大学の公開を始めません。

```powershell
$publishLease = node $workflowCli publish-lock acquire --worker 1 --slug yamanashi `
  --workspace C:/---hp-seo | ConvertFrom-Json
```

`ok=true` かつ `acquired=true` のときだけ公開を進め、返されたtokenを `$publishToken` として担当内に保持します。busyの場合はownerのworker/slug/取得日時が表示されます。statusとbusy応答にはtokenを表示しません。

```powershell
$publishToken = $publishLease.token
node $workflowCli publish-lock release --token $publishToken --workspace C:/---hp-seo
```

mkdirの原子的な成功で所有者を決めます。時間切れで自動解除しません。別担当はowner.jsonを消したり、tokenを変更したりしません。中断した所有者は状態・デプロイ進行を確認して再開し、自分の同じtokenで解除します。公開作業を停止した場合は未完了状態と理由を残し、Git操作やデプロイが動いていないことを確認してから所有tokenで解除します。所有者情報が不完全なlockも勝手に期限切れとして消しません。

## 未公表・矛盾・アクセス障害の保留

調査しても必要な公式資料が揃わない大学は、deferredReasonと確認日時付きdeferredEvidenceを保存します。アクセス障害を「未公表」と判断せず、具体的な障害・不足・再確認条件を区別します。

```json
{
  "state": "deferred",
  "deferredReason": "2027年度の医学科一般選抜募集要項が公表待ち",
  "deferredEvidence": [
    {
      "url": "実際に確認した大学公式資料のURL",
      "checkedAt": "実際のISO8601確認日時",
      "summary": "確認した掲載年度・告知・不足項目と再調査条件"
    }
  ],
  "nextReviewAt": null
}
```

deferは `defer --worker N --slug X --file ... --workspace C:/---hp-seo`、またはstate=deferredのupdateで実行します。CLIがdeferredAtを記録し、次のnextはその大学を飛ばします。publishedとdeferredを全て消化するとaction=completeと件数を返しますが、deferredは公開完了件数に含めません。公式資料が揃ったら理由を確認し、当該大学をstate=pendingで再投入できます。

## 意味テスト

```powershell
node --check C:/---hp-seo/scripts/university-admissions/workflow-state.mjs
node --test C:/---hp-seo/scripts/university-admissions/workflow-state.test.mjs
```

一時ディレクトリのfixtureだけで、2担当のロック競合、token所有、60秒境界、進行中大学の再開、保留の根拠とskip、担当違反、実ファイルhash、画面証拠不足、公式比較の全件網羅、main前の必須ゲート、候補差し替え拒否、本番GETの時間順序、途中のstate書き込みからの待機時刻復元を確認します。ネット・Git・公開操作は行いません。
