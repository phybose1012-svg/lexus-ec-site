# 過去問の図版をその場で直す

過去問ページの図（`figure.past-exam-figure`）に「✏️ 直す」が出る。押すと
`/admin/figures/edit` が開き、その図が FIBONA（図形エディタ）に読み込まれる。
直して保存すると、リポジトリの SVG と manifest の寸法がまとめて書き変わる。

書き戻し先は 2 つあり、開いている場所で決まる。

| 開いた場所 | 書き戻し口 | 何が起きるか |
| --- | --- | --- |
| 手元（127.0.0.1） | ローカル管理 API | 作業ツリーのファイルを直接書く |
| ステージング | Pages Function | GitHub の staging へ **1 コミット**として送る。Pages が作り直す |
| 本番（main） | なし | ページ自体が作られない |

門は 2 つ。判定は `astro.config.mjs` の `withFigureEditor` 1 箇所で決めて配っている。

| 門 | 結果 |
| --- | --- |
| `CF_PAGES_BRANCH === "main"` | エディタの経路ごと作らない。React も島も dist に出ない |
| `vendor/figure-editor/` があるか | 無ければ経路もボタンも作らない（押した先が 404 になる組み合わせを作らない） |

ボタン側で別に判定すると、ビルド時の `import.meta.url` がソースの場所を指さず
黙って食い違う（実測でボタンが消えた）。

確かめ方（3 通りとも実測済み）:

| 構成 | ページ数 | 直すボタン | エディタ資産 |
| --- | --- | --- | --- |
| `CF_PAGES_BRANCH=main` | 901 | 0 | 0 |
| ブランチ指定なし（＝ステージング） | 902 | 6ページ | あり |

```bash
CF_PAGES_BRANCH=main npm run build
grep -rl past-exam-figure__edit dist | wc -l        # 0
ls dist/_astro | grep -ic figureeditor              # 0 ← ここも見る
```

`_astro` まで見るのは、ページをリダイレクトに変えるだけでは足りないから。
`client:only` の島は、HTML から参照されなくなっても資産としては出る（配布物の
ある機械で main をビルドしたとき、どこからも参照されない 7.3MB が出た）。

## 使い方（手元）

リポジトリ直下の **「図版を直す.cmd」をダブルクリック**する。それだけ。

必要なものを入れる → 保存先を上げる → ページを組み立てる → ブラウザで開く、
までを 1 つでやる。終わるときは開いた黒い画面を閉じる（サーバも一緒に止まる）。

端末から動かすなら同じものが `npm run figure-editor:start`。

止まったときは黒い画面に日本語で理由が出る。よくあるのは 2 つ。

- **Node.js が入っていません** … <https://nodejs.org/ja> の LTS 版を入れて再起動
- **別のフォルダの保存先が動いています** … 画面は最初に応答した保存先へ書くので、
  別のフォルダのものが先に動いていると**そちらへ書き込まれる**。止めて開き直す

配布物（`vendor/figure-editor/`）は履歴に入っているので、取り直す必要はない。
FIBONA 側を作り直したときだけ、こちらへ写して commit する。

```bash
# FIBONA 側（別リポジトリ / frontend で）
npm run build:lib

# こちらへ写す（既定は C:/dev/math）
npm run figure-editor:sync
```

FIBONA が `C:/dev/math` に無いときは場所を渡す。

```bash
FIBONA_REPO=/path/to/math npm run figure-editor:sync   # bash
$env:FIBONA_REPO="C:\path\to\math"; npm run figure-editor:sync   # PowerShell
```

エディタは**シンプルモード**（`uiProfile="simple"`）で開く。右パネルは出さず、
選んだものの上にミニバーが出る。ここでやるのは出来上がった図の手直しなので、
作図の道具一式は要らない。ファイルメニューは同じなので保存の場所は変わらない。

過去問ページを開き、図の下の「✏️ 直す」を押す。エディタで直して
**ファイル ▸ SVG画像として保存** で書き戻る。画面の上の帯に、どのチェックアウトへ
書くのかが出る。島は最初に応答した管理 API を採るので、**別のワークツリーの
`admin:api` が上がっているとそちらへ書く**。帯の表示で気づける。

## ステージングで直す

`https://staging.lexus-ec.pages.dev/` の過去問ページにも「直す」が出る。保存すると
Pages Function が **GitHub の `staging` へ 1 コミット**を送り、Pages がそれを拾って
サイトを作り直す。SVG・manifest・控えは同じコミットに入るので、途中の半端な状態が
枝に残らない。

手元と違って**画面に出るのは 1〜2 分後**（ビルドを待つ）。保存の知らせには
コミットの短縮 SHA が出る。

### 用意するもの（一度だけ）

1. **GitHub の fine-grained personal access token**
   - Repository access はこのリポジトリ 1 つだけ
   - Permissions は **Contents: Read and write** だけでよい（他は不要）
2. **Cloudflare Pages の環境変数**（Settings ▸ Environment variables）
   - `FIGURE_GIT_TOKEN` … 上のトークン（**Secret** にする）
   - `FIGURE_GIT_REPO` … `phybose1012-svg/lexus-ec-site`
   - `FIGURE_GIT_BRANCH` … `staging`
   - `ADMIN_API_TOKEN` … 自分で決めた合言葉（**Secret**）
   - **Preview 側にも入れること。** staging は Preview 環境なので、Production
     にだけ入れても効かない
3. ステージングで図を開くと、帯に合言葉の入力欄が出る。一度入れれば
   そのブラウザに残る（`localStorage`）。違うものを入れてしまったら
   「合言葉を入れ直す」から入れ替える

**この口は合言葉だけで判定する。** 既存の管理 API は
`Cf-Access-Authenticated-User-Email` でも通すが、ここでは使わない。あのヘッダは
Cloudflare Access が前段に立っているときしか意味が無く、**名乗るだけで通って
しまう**（実測）。Pages はプレビューごとに別のホスト名でも同じ Function と同じ
環境変数を配るので、Access を 1 つのホスト名にだけ掛けても守れない。

### 承知しておくこと

- **`ADMIN_API_TOKEN` を入れないと書けない。** 未設定なら 503 で断る。
  ステージングは誰でも開けるので、ここは開けたままにしない
- **本番の枝へは書けない。** `FIGURE_GIT_BRANCH` に `main` を入れても口が断る
- **1 保存 = 1 ビルド。** Cloudflare の無料枠は月 500 ビルド。続けて直すと効く
- 図を読むのも合言葉が要る（GET も認可を通している）
- **この口の上限は 512KB**（手元の口は 2MB）。Workers は 1 回の呼び出しで使える
  CPU が短く、base64 化がそこを食う（512KB で 18.9ms、64KB で 2.9ms＝実測）。
  実際の図版は 20〜60KB なので足りるが、それより大きい図は手元から保存する

## 手で直した図は、生成スクリプトから守られる

図版 SVG は `scripts/build-*-figures.mjs` の出力でもある。放っておけば、手で
直したものは次にそれを流した時点で消える。そこで、保存したときに trio の控えを
残している。

```
frontend/src/data/pastExamFigures/<packageId>/<figureId>.trio.json
```

この控えがある図は「もう手が正本」と見なす。生成スクリプトは SVG を書かず、
manifest の寸法だけ現物の SVG から取り直して、何を飛ばしたかを出す。

```
$ node scripts/build-iwate-2025-mathematics-figures.mjs
手で直した図なので上書きしませんでした (1): q3-adjacency-layout
Built 3 original mathematics diagrams
```

**生成スクリプトへ返したくなったら、控えを消すだけでよい。** 次に流したときから、
また計算した図が書かれる。控えがあるのに SVG が無いときは、黙って作り直さずに
止まる（消えたことに気づけないまま manifest だけ整うのを避けるため）。

控えは次に開いたときの復元にも使う。SVG から読み直しても形は戻るが、レイヤ順・
グループ・非表示は SVG に書かれていないので失われる。控えがあるときは
「控えから復元（前回の編集の続き）」と出る。

書く順は **控え → SVG → manifest**。3 つ続けて書くので、途中で落ちたときに
どちらへ倒れるかを選んである。控えを最後にすると「公開ファイルは差し替わったのに
手が正本という印だけ無い」で終わり、次の生成スクリプトが警告ひとつ無く元へ戻す
（実測）。先に書けば、最悪でも「印はあるが SVG は古い」で止まり、直した trio は
残る。

`alt` と `caption` は manifest に残ったまま（生成スクリプトの文言）で、エディタでは
変えられない。図の中身と説明文がずれたら、生成スクリプト側を直す。

なお `npm run build` は図版生成スクリプトを呼ばない（実測：ビルド前後で SVG 15 枚
＋ manifest 3 枚が md5 で不変）。CI も無い。消えるのは、手で
`npm run past-exam:figures:*` か `node scripts/build-*-figures.mjs` を流したときだけ。

## 寸法は破れたら鳴る

manifest の `width` / `height` はページの `<img>` にそのまま出るので、実ファイルと
ずれると図が伸び縮みして表示される。`loadFigureManifest`（`src/lib/pastExamFigures.mjs`）
が SVG の実寸と突き合わせていて、食い違うとビルドが止まる。

```
Figure size mismatch /assets/.../q1.svg: manifest 760x500, file 760x499
```

だから書き戻し API は SVG と manifest を必ず一緒に書く。片方だけ書ける口は開けない。

寸法を読むのは `src/lib/svgSize.mjs` の 1 箇所だけ。**書く側と検査する側が同じ
関数なので、ここが間違うと誰も鳴らない。**実際に 2 つ踏んだので、検査を置いてある
（`npm run past-exam:figure-handoff:test`）。

- `\bwidth` は `stroke-width="2"` にも当たる（ハイフンの後ろは語境界）
- `parseFloat` は `124.35mm` や `100%` から数字だけ取る

## 管理 API を上げている間の口

`admin:api` は 127.0.0.1 でしか待たないが、**閲覧中のページからは届く**。
そのままだと、開いている任意のサイトからリポジトリの図版を書き換えられる。
書き込みには 2 つの門を置いた。

- `Content-Type: application/json` 以外は 415。これで CORS の preflight が要る
  ようになり、preflight はローカル以外に許可を返さないのでブラウザが止める。
  （`text/plain` は単純リクエストなので preflight が無く、実際に別オリジンの
  ページから公開アセットへ `<script>` 入りの SVG を書けた）
- `Origin` があってローカルでなければ 403

置く SVG も見る（`src/lib/svgSafety.mjs`、両方の口が同じものを使う）。
`script` / `foreignObject` / `animate` などの要素、`on...` 属性、`javascript:`、
外部への `href` や CSS の `url()`（`#id` と `data:` 以外）が入っていたら断る。
落として直すのではなく断るのは、直したはずの図が黙って変わるのを避けるため。

**接頭辞を無視して名前で見る。** XML では要素は「名前空間 + 名前」で決まり、
接頭辞は書き手が好きに付けられる。`<script>` だけを見ていたころは
`<x:script xmlns:x="http://www.w3.org/2000/svg">` が素通りし、置いた SVG を直接
開くとサイトのオリジンで JS が動いた（実測）。引用符の種類でも抜けた。

検査だけに頼らない。`public/_headers` が `/assets/past-exams/*` へ
`Content-Security-Policy: default-src 'none'; … sandbox` を付けているので、
ここを抜けたものがあってもブラウザ側でもう一度止まる。図版は自己完結
（外部を読まない）なので、表示は変わらない。

## 置き場

- `vendor/figure-editor/` … FIBONA の配布物。ビルド成果物だが **履歴に入れている**。
  Cloudflare は git の中身しか持たないので、無いとステージングでエディタが作れない
  （それどころかサイト全体のビルドが落ちる）。更新は `npm run figure-editor:sync`
  のあと commit。
- `src/local-tools/figure-editor/` … エディタのページと島。`src/pages/` の下に
  置いていないのは、**vendor が無い環境ではページごと作らないため**。
  `src/pages/` に置いたままだと、クリーンな clone（Cloudflare Pages）で
  `Cannot find module '@phybose1012-svg/figure-editor'` が出てサイト全体のビルドが
  落ちる（実測）。同じ理由で `tsconfig.json` からも除外してあるので、型検査は
  `npm run figure-editor:check` で別に走らせる（`edit.astro` はこの検査にも
  入らない。中身はほぼマウントするだけなので、そこは手で見る）。
- `scripts/lib/past-exam-figure-handoff.mjs` … 控えの有無を見る側。生成スクリプトと
  管理 API の両方がこれを使う。
- `src/lib/svgSize.mjs` … SVG の寸法の読み方。`.d.ts` を並べてあるのは、
  Pages Function（TypeScript）からも読むため。
- `src/lib/svgSafety.mjs` … 置けない SVG の検査。
- `scripts/admin-local-api.mjs` の `/api/past-exam-figures` … 手元の口。
- `functions/admin/api/past-exam-figures.ts` … ステージングの口。
  `public/_routes.json` にこのパスを足してある（Functions はここに書いた
  パスでしか動かない）。

**寸法の読み方と SVG の検査は、2 つの口が同じものを読む。** 別々に持つと
「手元では保存できたのに公開できない」が起きるので、検査で縛ってある
（`npm run past-exam:figure-handoff:test`）。

## 承知しておくこと

編集タブの名前には、読み込んだ中身の印を混ぜてある。ファイルが変われば別のタブに
なるので、**保存していない下書きは、その図のファイルが変わった時点で拾えなくなる**。
ファイルを正本にするための割り切り。

検査は `npm run past-exam:figure-handoff:test`。
