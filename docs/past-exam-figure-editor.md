# 過去問の図版をその場で直す

過去問ページの図（`figure.past-exam-figure`）に「✏️ 直す」が出る。押すと
`/admin/figures/edit` が開き、その図が FIBONA（図形エディタ）に読み込まれる。
直して保存すると、リポジトリの SVG と manifest の寸法がまとめて書き変わる。

**手元でしか動かない。** 書き戻し先はリポジトリのファイルで、それを触れるのは
127.0.0.1 で動く管理 API だけ。門は 3 つある。

| どこ | 門 | 結果 |
| --- | --- | --- |
| ビルド時 | `CF_PAGES_BRANCH === "main"` | エディタの経路ごと作らない。React も島も dist に出ない |
| ビルド時 | `vendor/figure-editor/` があるか | 無ければ経路もボタンも作らない（押した先が 404 になる組み合わせを作らない） |
| 実行時 | `location.hostname` が 127.0.0.1 / localhost / ::1 か | ステージングの配信先では印を出さない |

判定は `astro.config.mjs` の `withFigureEditor` 1 箇所で決めて配っている。
ボタン側で別に判定すると、ビルド時の `import.meta.url` がソースの場所を指さず
黙って食い違う（実測でボタンが消えた）。

確かめ方（3 通りとも実測済み）:

| 構成 | ページ数 | 直すボタン | エディタ資産 |
| --- | --- | --- | --- |
| `CF_PAGES_BRANCH=main` ＋ vendor あり | 897 | 0 | 0 |
| ブランチ指定なし ＋ vendor あり | 898 | 6ページ | あり |
| vendor 無し（クリーンな clone） | 897 | 0 | 0 |

```bash
CF_PAGES_BRANCH=main npm run build
grep -rl past-exam-figure__edit dist | wc -l        # 0
ls dist/_astro | grep -icE 'figureeditor|client\.'  # 0 ← ここも見る
```

`_astro` まで見るのは、ページをリダイレクトに変えるだけでは足りないから。
`client:only` の島は、HTML から参照されなくなっても資産としては出る（配布物の
ある機械で main をビルドしたとき、どこからも参照されない 7.3MB が出た）。

## 使い方

```bash
# 1. FIBONA 側で配布物を作る（別リポジトリ / frontend で）
npm run build:lib

# 2. こちらへ写す
npm run figure-editor:sync

# 3. 保存先の API と、開発サーバを上げる
npm run admin:api
npm run dev
```

FIBONA が `C:/dev/math` に無いときは場所を渡す。

```bash
FIBONA_REPO=/path/to/math npm run figure-editor:sync   # bash
$env:FIBONA_REPO="C:\path\to\math"; npm run figure-editor:sync   # PowerShell
```

過去問ページを開き、図の下の「✏️ 直す」を押す。エディタで直して
**ファイル ▸ SVG画像として保存** で書き戻る。画面の上の帯に、どのチェックアウトへ
書くのかが出る。島は最初に応答した管理 API を採るので、**別のワークツリーの
`admin:api` が上がっているとそちらへ書く**。帯の表示で気づける。

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

置く SVG も見る。`<script>` / `<foreignObject>` / `on...` 属性 / `javascript:` /
外部への `href`（`#id` と `data:image/` 以外）が入っていたら断る。落として直すの
ではなく断るのは、直したはずの図が黙って変わるのを避けるため。

## 置き場

- `vendor/figure-editor/` … FIBONA の配布物。**履歴には入れない**（`.gitignore`）。
  必要になったら 2. で取り直す。
- `src/local-tools/figure-editor/` … エディタのページと島。`src/pages/` の下に
  置いていないのは、**vendor が無い環境ではページごと作らないため**。
  `src/pages/` に置いたままだと、クリーンな clone（Cloudflare Pages）で
  `Cannot find module '@phybose1012-svg/figure-editor'` が出てサイト全体のビルドが
  落ちる（実測）。同じ理由で `tsconfig.json` からも除外してあるので、型検査は
  `npm run figure-editor:check` で別に走らせる（`edit.astro` はこの検査にも
  入らない。中身はほぼマウントするだけなので、そこは手で見る）。
- `scripts/lib/past-exam-figure-handoff.mjs` … 控えの有無を見る側。生成スクリプトと
  管理 API の両方がこれを使う。
- `src/lib/svgSize.mjs` … SVG の寸法の読み方。
- `scripts/admin-local-api.mjs` の `/api/past-exam-figures` … `GET` で図と控えを渡し、
  `POST` で控え・SVG・manifest を書く。

## 承知しておくこと

編集タブの名前には、読み込んだ中身の印を混ぜてある。ファイルが変われば別のタブに
なるので、**保存していない下書きは、その図のファイルが変わった時点で拾えなくなる**。
ファイルを正本にするための割り切り。

検査は `npm run past-exam:figure-handoff:test`。
