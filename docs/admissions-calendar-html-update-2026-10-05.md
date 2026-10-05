# HTML化した2027年度募集要項からの入試カレンダー更新

確認日: 2026-10-05（JST）

## 反映範囲と判断

一般・共通テスト利用ページは6大学を更新。東北医科薬科・獨協医科・藤田医科・大阪医科薬科・産業医科の12方式について、完成版要項で確認できた締切・時刻・手続条件等を反映した。川崎医科は地域枠の申請状況の注記を改訂版に合わせた。

総合型・学校推薦型等ページは東北医科薬科・藤田医科・大阪医科薬科・産業医科の4大学を更新した。実質一般・共テ利用方式の除外と昭和医科の卒業生推薦の「その他」分類は維持する。

31大学全体を今回改めて監査完了したという意味ではない。確認できない年度・条件・時刻を推定で補わない。HTMLの制作済み／利用者承認済みと、本作業での個別項目の原本照合は別扱いとし、HTML側の承認状態は変更しない。

## 主な差分

| 大学 | 反映した内容 |
|---|---|
| 東北医科薬科 | Web出願開始10時・締切13時、合格発表16時予定。総合型の対象卒業年・推薦者条件を明確化。納付金と書類提出の期限を分離 |
| 獨協医科 | 一般前期Web締切1/31正午・書類2/1 17時必着、後期Web締切2/28正午・書類3/1 17時必着。前期二次の希望日を出願受付順に決定 |
| 藤田医科 | 一般・共テの手続を入学金2/24、授業料等3/10（各23:59）として掲載。面接日時の希望順位・出願日時順、発表9時頃。特別選抜12/7 23:59納入、IB資格見込者の最終書類1/29、帰国生の国公立医学科進学時の辞退例外等 |
| 大阪医科薬科 | 一般後期締切を2/26→2/22に訂正。Web13時・検定料15時・書類消印。公募推薦の評定4.0、TEAP CBTを含む英語資格・取得期間。至誠仁術と公募推薦は完成版確認、指定校2方式の詳細は未公表扱いを維持 |
| 産業医科 | 一般・ラマツィーニ・学校推薦の発表16時頃、手続の本人来学と9:00〜11:30／13:00〜14:30。一般の最終期限3/25 14:30。Web登録の終了時刻自体は要項から断定しない |
| 川崎医科 | 9/30改訂版PDF p.23で静岡県10名・長崎県4名は「認可申請中」。既存の「設置協議中」注記を更新。日程は変更なし |

大学別表だけでなく、別管理の締切順一覧・試験日順カレンダー・派生全日程・公開JSONも整合させる。全日程の合格発表欄では、正本にある時刻および「頃」「予定」を保持する。藤田・獨協の面接希望条件をplannerへ渡す際、両日必須と誤判定しない。川崎の表示名変更後もcanonical IDと保存済みプランIDを維持する。

## 原資料と照合箇所

ページ番号はPDFの物理ページ。下記HTMLルート内の最新版だけを利用し、旧版・未制作案内は根拠にしない。表の重要な日付・区分は原本ページ画像も確認した。

### 東北医科薬科

- HTML: `C:/---hp/_reference/tohoku-medical-pharmaceutical-2027/projects/universities/tohoku-medical-pharmaceutical/output/production-2027/`
- ソースcommit: `3141040a6bab481da2b925f997e72c347042a54e`
- PDF SHA-256: `18e1b9e14fa9231777a9d7c449e1173cf3eb87715489c2f4b321d6b6ba83ea68`
- 参照: PDF p.4、9〜15、20〜21（総合型資格・日程・一般／共テ手続等）。p.4の日程表を原本画像でも確認。
- [2027年度募集要項](https://www.tohoku-mpu.ac.jp/doc/application_medicine.pdf)

### 獨協医科

- HTML: `C:/---hp/_reference/dokkyo-medical-2027/projects/universities/dokkyo-medical/output/production-2027/`
- ソースcommit: `550fb232899de71a366bb451081a129be0b123f8`
- 一般PDF SHA-256: `9a09260618acc84bff1336d272a6f8cddc340a1e0778bd3561e37cfc36ef67cc`
- 参照: 一般PDF p.10〜13、19〜21。公募推薦p.6、7、10の日程・条件は現行掲載と一致し変更なし。
- [一般募集要項](https://www.dokkyomed.ac.jp/upload/CommonFile/files/dokkyo_20260827100450.pdf)／[公式入試入口](https://www.dokkyomed.ac.jp/dusm/exam/entrance/)
- WebツールでPDF再取得はエラー。同期済みの本文・HTMLと公式入口を使用し、再取得できたとは扱わない。

### 藤田医科

- HTML: `C:/---hp/_reference/fujita-health-2027/projects/universities/fujita-health/output/production-2027/`
- ソースcommit: `607a3f0a754c4ff369d61fcbd2787da768ac0145`
- 10/1改訂PDF SHA-256: `b24c9ea3dfa9b1ecc84747be940bc9cc6dabaa9dd0aeecf937da298c1eea3dd7`
- 参照: PDF p.7〜9、11、13〜14、16、19、21〜22、25〜27、29、31、39。p.7の日程・手続表を原本画像でも確認。
- [2027年度募集要項](https://www.fujita-hu.ac.jp/admission/vsfo8q0000007l3n-att/tedb9e000000p7j6.pdf)
- Web出願の終了時刻を23:59とは推定しない。23:59は要項で明記された入学手続納入期限に用いる。

### 大阪医科薬科

- HTML: `C:/---hp/_reference/osaka-medical-pharmaceutical-2027/projects/universities/osaka-medical-pharmaceutical/output/production-2027/`
- ソースcommit: `e0366c5d0ef9e685a0063c67b9ada05c5f261867`
- PDF SHA-256: `ad962c2d56481f333a8f7f71892374aecc8a6d4b601e7e1779ed7978b5ad5036`
- 参照: PDF p.4〜6、8〜15、17〜22、30〜31。後期締切は原本p.17でも2/22を確認。
- [2027年度入試要項](https://www.ompu.ac.jp/admission/undergraduate/medical/qt931k0000005db0-att/cc9f84000000fmbf.pdf)
- 指定校2方式に公募制の詳細条件を流用しない。公開資料の根拠が異なるため、同日の試験表示も根拠別に集約する。

### 産業医科

- HTML: `C:/---hp/_reference/sangyo-medical-2027/projects/universities/sangyo-medical/output/production-2027/`
- ソースcommit: `e36995863d49e9735654c04e1c5e6802bc724d41`
- 一般SHA-256: `e82c3a5466f0b86385154da8ef5c7ee14e40e943888f6b9c5e6741edea89677b`
- 総合型SHA-256: `39e49ca9aca94fec0bbc7b962ff52f53450230f1a8047fa0ce649731395a0e25`
- 推薦SHA-256: `a02318e810f8f3e039cd23a413e6eb61951c09a6f92c0051cd1b9164a71981b7`
- 参照: 一般PDF p.6〜7、12〜13、16〜17、総合型p.5、7、10、12、推薦p.5〜6、11、公式Web出願ガイド。
- [一般募集要項](https://www.uoeh-u.ac.jp/library/nyusi/R9_igaku_ippan_bosyuyoko.pdf)／[総合型](https://www.uoeh-u.ac.jp/library/nyusi/R9_igaku_sogo_bosyuyoko.pdf)／[学校推薦](https://www.uoeh-u.ac.jp/library/nyusi/R9_igaku_suisen_bosyuyoko.pdf)
- [募集要項の公式入口](https://www.uoeh-u.ac.jp/Exam/_8042.html)は10/1更新を確認。

### 川崎医科

- HTML: `C:/---hp/_reference/kawasaki-medical-2027/projects/universities/kawasaki-medical/output/production-2027/`
- ソースcommit: `ff3e820fe60ff189e49f6f80e5cef5ee0c98400b`
- 9/30改訂PDF SHA-256: `848207a2b8de490e7a25a841a13984d99b2ffa76d5594438c88ef6daba170472`
- 参照: PDF p.13、15、18、20、22〜23、25、28、30〜31。p.23の地域枠申請状況は原本画像でも確認。
- [大学公式入口](https://m.kawasaki-m.ac.jp/examination/youkou.php)からリンクされる[2027年度募集要項](https://edu.career-tasu.jp/p/digital_pamph/frame.aspx?FL=0&id=7806900-2-15)を採用。入口の概要表には旧注記が残るため、改訂版要項を優先し、認可済みとは表記しない。

## 更新しなかった資料の扱い

- 順天堂: 10/1改訂のmain要項p.7、9、31、33、36、38、41、48、51、58〜59で、対象カレンダーの日程の差異は見つからなかった。一般地域枠を特別選抜側へ再追加しない。
- 昭和医科: 最新76ページ版は40ページのみHTML制作済み。医学部一般の日程・手続の主要ページは未制作のため、旧74ページ版や未制作案内から上書きしない。
- 北里の今回収録資料は学士入学用、慶應の収録資料は外国人留学生用。一般選抜の完成版公開判定へ流用しない。
- その他の大学がすべて再検証済みであることは主張しない。未確認の追加差分は別途、同じ根拠単位で照合する。

## 検証と公開

- 最終検証: `node --test tests/*.test.mjs` は83件成功・失敗0件。`npm.cmd run build` は1,136ページの生成に成功。`git diff --check` も成功。
- 既存特別選抜回帰テストに完成版の期待値を反映。
- 新規テストで、締切順の並び、Webと郵送の区別、旧2/26締切の消去、時刻・予定の保持、派生JSON、plannerの面接条件を検証。
- canonical ID／保存済みプランIDの互換性も既存回帰テストで検証。
- 公開先は `origin staging` のみ。`main` は利用者の確認後とし、この変更ではpushしない。
