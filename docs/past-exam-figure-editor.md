# 過去問の図版をその場で直す

過去問ページの図（`figure.past-exam-figure`）に「✏️ 直す」が出る。押すと
`/admin/figures/edit` が開き、その図が FIBONA（図形エディタ）に読み込まれる。
直して保存すると、リポジトリの SVG と manifest の寸法がまとめて書き変わる。

**手元でしか動かない。** 書き戻し先はリポジトリのファイルで、それを触れるのは
127.0.0.1 で動く管理 API だけ。門は 2 つある。

| どこ | 門 | 結果 |
| --- | --- | --- |
| ビルド時 | `CF_PAGES_BRANCH === "main"` | 「直す」の script も style も出力に入らない。`/admin/figures/edit` は `/` へ飛ぶ |
| 実行時 | `location.hostname` が 127.0.0.1 / localhost / ::1 か | ステージングの配信先では印を出さない |

本番ビルドで確かめたいときは `CF_PAGES_BRANCH=main npm run build` のあと
`grep -rl past-exam-figure__edit dist`（0 件になる）。

## 使い方

```
# 1. FIBONA 側で配布物を作る（別リポジトリ / frontend で）
npm run build:lib

# 2. こちらへ写す
npm run figure-editor:sync            # 既定は C:/dev/math
FIBONA_REPO=/path/to/math npm run figure-editor:sync

# 3. 保存先の API と、開発サーバを上げる
npm run admin:api
npm run dev
```

過去問ページを開き、図の下の「✏️ 直す」を押す。エディタで直して
**ファイル ▸ SVG画像として保存** で書き戻る。

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

## 置き場

- `vendor/figure-editor/` … FIBONA の配布物。**履歴には入れない**（`.gitignore`）。
  必要になったら 2. で取り直す。
- `src/local-tools/figure-editor/` … エディタのページと島。`src/pages/` の下に
  置いていないのは、**vendor が無い環境ではページごと作らないため**。
  `astro.config.mjs` が vendor の有無を見て `injectRoute` する。
  `src/pages/` に置いたままだと、クリーンな clone（Cloudflare Pages）で
  `Cannot find module '@phybose1012-svg/figure-editor'` が出てサイト全体のビルドが
  落ちる（実測）。同じ理由で `tsconfig.json` からも除外してあるので、型検査は
  `npm run figure-editor:check` で別に走らせる。
- `scripts/lib/past-exam-figure-handoff.mjs` … 控えの有無を見る側。生成スクリプトと
  管理 API の両方がこれを使う。
- `src/lib/svgSize.mjs` … SVG の寸法の読み方。manifest の検査・生成スクリプト・
  書き戻し API で同じ答えが要るので 1 箇所に置いてある。
- `scripts/admin-local-api.mjs` の `/api/past-exam-figures` … `GET` で図と控えを渡し、
  `POST` で SVG・manifest・控えを書く。

検査は `npm run past-exam:figure-handoff:test`。
