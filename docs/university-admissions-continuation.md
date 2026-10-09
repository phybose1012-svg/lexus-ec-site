# 入試表復元の自動継続・停止

ユーザーの「仕事が完了した場合、または捗っていない場合は自動で止める。エンドレスのpromptを送らない」という指示を、保存された実内容と上限回数で判定します。`continuation-guard.mjs` はローカルの判定と記録だけを行います。**automation自体のPAUSED更新は、判定を受けた担当がCodexのautomation_updateツールで実行し、適用結果を確認します。** guardの記録だけでautomationを停止済みとは報告しません。

調査・公開の順序と必須ゲートは [状態CLIと公開手順](university-admissions-workflow.md)、公式再照合は [検証手順](university-admissions-verification.md) に従います。今回の4heartbeatはrootが一旦全PAUSEDにしています。修正後の再開はroot/ユーザーの明示指示が必要です。

## 一回の実行と1分の意味

一回の実行は、担当の**1大学を公開確認完了まで連続して進める仕事**です。公式調査に数時間かかっても、その途中を1分で切り上げません。確認だけ、ログの再生成だけ、次のheartbeatを待つだけで実行を終えません。1分は本番確認完了後に次大学を開始するまでの待機です。

途中で外部依存や共通修正が必要と判明したら、候補・原典・残作業・失敗の根拠を保存し、guardへ入力して停止します。共通担当の状態を毎分見に行く自動巡回は続けません。停止後は同じpromptを繰り返したり、次の大学へ勝手に移ったりしません。

## CLIと正本

共有状態とguard記録は `C:/---hp-seo/reports/university-admissions` が正本です。worktreeから実行してもworkspaceは固定します。

```powershell
$guardCli = 'C:/---hp-seo/scripts/university-admissions/continuation-guard.mjs'
$attemptId = '今回のCodex実行を一意に識別するturn-ID'
node $guardCli check --worker 1 --phase wake --attempt-id $attemptId --workspace C:/---hp-seo
node $guardCli check --worker 1 --phase checkpoint --attempt-id $attemptId --workspace C:/---hp-seo
node $guardCli check --worker 1 --phase finish --attempt-id $attemptId --workspace C:/---hp-seo
```

wakeは新しい実行の開始、checkpointは同じ実行の途中、finishは仕事の区切りです。同じ実行内では同じattempt-idを使い、次の実行では新しいIDを使います。finish済みのIDを次のwakeへ再使用するとCLIは拒否します。checkpointは長時間の調査や再検証の途中で実内容を記録し、wake回数を増やしません。毎分のcheckpointは不要です。

`check --worker N` だけでも使えますが、各呼び出しを新しいwakeとして数えます。人が状況を見るだけなら `status --worker N` を使います。statusは台帳・回数を書き換えません。

保存先は `guards/worker-N.json` です。当該担当ごとに別ファイルへ原子的に書き込み、manifest/items/workersや他担当のguardを変更しません。記録にはcurrentSlug、fingerprint、根拠ファイル数とhash、最新研究ファイル、wakeAttempts、noProgressWakes、repeatedErrorWakes、paused、category、reason、resumeCondition、checkedAt、pausedAt/resumedAtを残します。plannedCandidateFileやdestinationは保存予定先として読み飛ばします。実ファイル宣言のfrontend相対パスは、その大学状態のworktreeRoot/worktree/worktreePathから解決し、reports相対パスは正本workspaceから解決します。candidate snapshotなど実根拠の欠落は停止対象です。

## 継続・待機・停止の判定

| action/category | 判定と次の動作 |
|---|---|
| continue/progress・working | 同じ大学の実作業を続ける。確認巡回だけで終了しない。 |
| wait/cooldown | 公開完了から60秒未満。remainingMsが経過してから状態CLIのnextを実行する。新大学は未開始。 |
| pause/completed | 担当リストがpublished/deferredだけになった。担当automationを停止。deferredは公開完了件数へ含めない。 |
| pause/blocked | 明示失敗、未解消の共通依存、台帳異常、参照根拠の読み取り失敗、または同一retryable errorが2実行で反復。担当automationを停止。 |
| pause/stalled | 実内容の変化がない実行が3回連続、または同大学のwake上限3回を超える4回目。担当automationを停止しroot/ユーザーの確認へ渡す。 |

同じ大学に3回のwakeまでを許すのは、終了した実行を無制限に再開しないためです。少しずつ報告だけを書き換えても4回目を許しません。長時間の実調査は一つのwake内で続けられます。必要な研究を中断する前提の時間制限ではありません。3回のno-progressは開始前の基準snapshotではなく、各実行の開始から終了までの実変化で数えます。終了記録のない旧実行は、次wakeで区切って判定します。

fingerprintは大学のstate・commit・候補・公式根拠・検証内容と、大学別reports/research領域の実ファイル内容から作ります。JSONのupdatedAt・checkedAt・generatedAt等の時刻、history、処理時間、PID、応答の変動hash、候補の申告hashだけの変更は除外します。実際の原稿本文・日程・配点などの値は除外しません。候補・原典・比較JSONの内容、資料数、研究ノートの内容、検証成功/失敗や公開commitの変化を記録します。

ログ、実行スクリプト、inspect/probe/report/progress/coordination等の生成物、inspectionOnly・diagnosticOnlyのJSONは進捗へ数えません。PNGの生成日時などの付属metadataも除きます。診断JSONが共通不具合を示す場合は、進捗には数えなくても停止の根拠として読みます。ファイルを別名でコピーすることや申告hashを書き換えることを、実作業の進展として使いません。

guardは大学のfailure/error/lastError/continuation.error、dependencies/blockers/sharedDependencies、pendingCommonFix、共通修正待ちのstage、失敗した検証JSONを読みます。`passed:false`という未実施フラグだけでは停止理由にせず、具体的なerror/failedChecks等と組み合わせます。実際の再検証に合格したら、新しい成功検証ファイルを保存し、当該workerが状態CLIのupdateで古いfailureやwaiting/dependenciesを解消することが必須です。履歴として保存する旧失敗JSONもresolved=trueまたはstatus=resolvedを付け、resolvedByEvidenceFile等で新しい実検証を参照します。旧証拠のファイル・fingerprintは保持し、解消済み失敗を停止根拠から外します。新しい成功事実なしにresolvedを付けたり、guardが修正readyだけを理由に自動解消したりしません。これにより再検証後の公開lock待ち等で別turnになっても、解消した旧失敗だけを理由に再停止しません。

反復可能な一時エラーは、例えば大学状態へ `continuation.error={code,message,retryable:true,at}` と記録します。同じエラーは別のwakeで2回になったら停止します。同じwake内のcheckpointだけで反復回数を増やしません。retryableを付けない明示failureや共通依存は即停止です。

rootが共通障害を明示する場合は `continuation-dependencies.json` に `blockers:[{id,status,reason,affectedWorkers?,affectedSlugs?,checkedAt,evidenceFile?,repairKey?}]` を置けます。status=resolved/readyは解消済み、それ以外は未解消として扱います。対象指定がなければ全担当が対象です。

## 新しい共通修正後の一度だけの再検証

古い `localMobilePassed:false` や旧DNCドメイン拒否が大学状態に残っていても、新しい共通修正を再検証する機会を確保します。rootは両公開環境で修正を確認して、bootstrap.sharedRepairsに次を保存します。

```json
{
  "mobileAdmissionTables": {
    "status": "ready",
    "stagingCommit": "修正を公開した40桁commit",
    "mainCommit": "修正を公開した40桁commit",
    "verifiedAt": "実際に確認したISO8601日時"
  },
  "nationalSourceValidation": {
    "status": "ready",
    "stagingCommit": "修正を公開した40桁commit",
    "mainCommit": "修正を公開した40桁commit",
    "verifiedAt": "実際に確認したISO8601日時"
  }
}
```

これだけでは停止を解除しません。root/ユーザーが具体的な再開理由を明示して、rootが次を実行します。

```powershell
node $guardCli resume --worker 1 --requested-by root `
  --reason '両branchへ共通CSS修正を配備・確認したので、保存済み候補でPC/スマホを再検証して大学1件の公開を続ける' `
  --workspace C:/---hp-seo
```

resumeは回数と基準snapshotをリセットし、帰属と理由を保存します。修正の両commit・verifiedAtが揃い、旧失敗より新しく、その修正の再検証枠が未使用であれば、一度だけのgraceを発行します。この1実行で最新修正を取り込み、同じ候補を再ビルドして実画面を検証します。同じ実行のcheckpointでは古い失敗だけを理由に再停止しません。**修正後の新しい検証でも失敗したらその場で停止**します。旧failureを残したまま次のwakeへ移ると再停止し、同じ修正commitでresumeを繰り返しても新しいgraceは発行しません。

genericなroot再開待ち表示は、同じ大学の具体的な共通障害から修正keyを対応づけます。CSSとDNC両方が残る場合は両方の新しいready修正を要求します。具体的な対応がないgeneric shared-fix待ちは両修正readyと明示resumeを要求します。単に待機文言を変えて停止を抜けません。

worker自身はresume/resetを実行しません。止まった後に「もう一度やれば進むかもしれない」と自動解除する運用は禁止です。guardのresumeはautomationをACTIVEにせず、rootの明示的なautomation更新・メッセージで再開します。

## 担当automationへ追加する具体的なprompt

各担当の既存promptを保ち、worker番号に応じて次を追加します。automationIdとthreadIdは正本manifestのそのworkerを使い、他担当や無関係のautomationを変更しません。

> 一回の実行で担当の1大学を公開確認完了まで連続して進めてください。1分は大学完了後の待機用です。起動時に正本continuation-guardのcheck --worker N --phase wakeを今回固有のattempt-idと--workspace C:/---hp-seo付きで実行してください。途中と終了時は同じIDのcheckpoint/finishを使ってください。action=pauseならreasonとresumeConditionを保存し、正本manifestにある自分のautomationIdを対象にCodexのautomation_updateでstatus=PAUSEDへ更新してください。既存name/prompt/rrule/targetThreadId/通知設定は保存して更新し、ツールの適用結果でPAUSEDを確認してください。guard自体はautomationを変更しません。止めたら同じ確認promptの再実行、別大学の開始、自分によるguard resume/reset、automation ACTIVEへの自動変更を行わず終了してください。pause/completedではpublishedとdeferredの件数を分けて報告します。pause/blockedまたはstalledでは原因と必要な再開条件を一度だけ報告します。未解消共通問題は毎分確認せず止めます。root/ユーザーが明示resumeした場合だけ同じ大学を再開してください。continueなら確認巡回だけで終わらず公式調査・候補作成・staging公開・公式再照合・main確認を続けてください。実作業の根拠を大学別reportsへ保存してください。

更新ツールのエラーでPAUSEDを適用できない場合もその実行の作業は止め、automation停止が未適用であることとエラーをrootへ伝えます。停止できたと装いません。rootが既に全PAUSEDへ変更した状態では、rootの再開指示が来るまで自動promptを再追加しません。

## テスト

```powershell
node --check C:/---hp-seo/scripts/university-admissions/continuation-guard.mjs
node --test C:/---hp-seo/scripts/university-admissions/continuation-guard.test.mjs
```

tmpdirのfixtureで10件を検証します。時刻・ログ・inspect・同内容コピーだけの3連続停止、sticky pauseと明示resume、根拠内容が増える長時間研究、同大学wake上限、published/deferred全消化、同一エラー2回、共通修正後の一度だけのgraceと新しい失敗、60秒待機、実状態変化、予定パスの除外、worktree実ファイル解決、genericな両修正待ち、解消済み旧失敗の証拠保存を確認します。テストはネット・Git・デプロイ・automationを実行しません。
