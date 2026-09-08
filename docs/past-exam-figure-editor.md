# 過去問の図版をその場で直す

過去問ページの図（`figure.past-exam-figure`）に「✏️ 直す」が出る。押すと
`/admin/figures/edit` が開き、その SVG が FIBONA（図形エディタ）に読み込まれる。
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

## 置き場

- `vendor/figure-editor/` … FIBONA の配布物。**履歴には入れない**（`.gitignore`）。
  ビルド成果物なので、必要になったら 2. で取り直す。
- `src/components/past-exam/FigureEditorIsland.tsx` … エディタを載せるアイランド。
  どの図を開くかは URL のクエリ（`?package=&figure=`）から自分で読む。静的出力では
  ページはビルド時に 1 枚しか作られないので、Astro の props では渡せない。
- `scripts/admin-local-api.mjs` の `POST /api/past-exam-figures` … 書き戻し口。
  SVG と manifest は必ず一緒に書く。`loadFigureManifest` が両者を突き合わせていて、
  食い違うとビルドごと落ちるため。

## 承知しておくこと

図版 SVG と manifest は `scripts/build-*-figures.mjs` の出力でもある。ここで
直したものは、次にその生成スクリプトを流した時点で上書きされて消える。
