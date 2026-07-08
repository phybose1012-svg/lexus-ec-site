# 引き継ぎプロンプト：固定3ページを本番準拠＋デザイン一貫性で高品質に仕上げる

あなたは Claude Code として `C:\---hp`（リポジトリ `phybose1012-svg/lexus-ec-site`、Astro 製サイト）で作業します。
このプロンプトだけで自走できるよう、背景・原因・手順・品質基準をすべて記載しています。**推測でコードだけ見て作らないこと。必ず本番ページのスクショと自分の出力を並べて比較しながら直すこと。** これが最重要です。

---

## 0. ゴール（Definition of Done）

対象3ページを **本番ページ（lexus-ec.com）の見た目に十分近づけ**、かつ **ブランド基準（ステージングのトップページ）と矛盾する一貫性の欠けたデザインは是正** する。

| 対象 | 本番URL | ステージングURL | 実装 |
|---|---|---|---|
| 鬼監理とは | https://lexus-ec.com/study-support-system/ | https://staging.lexus-ec.pages.dev/study-support-system/ | 抽出流し込み（fixed-source） |
| 国公立医学部情報 | https://lexus-ec.com/top/information-kokuritsu/ | https://staging.lexus-ec.pages.dev/top/information-kokuritsu/ | 抽出流し込み（fixed-source） |
| 私立医学部情報 | https://lexus-ec.com/top/information-shiritsu/ | https://staging.lexus-ec.pages.dev/top/information-shiritsu/ | 抽出流し込み（fixed-source） |

**完了の判定**：本番とステージングをデスクトップ(1366幅)・モバイル(390幅)で**フルページ並べて**見たとき、
1. セクションの順序・構成・主要ビジュアル（カード/帯/グリッド/画像）が本番と概ね一致している
2. ウィジェット（ボタン・見出し・画像・リスト）の**位置揃え（中央寄せ等）と余白**が整っている
3. ブランド配色（赤 #8b0000 / 紺 #12356a・#225e9d / 緑 #22845d / 金 #d4af37 / 墨）に統一され、原色ネオン・ホットピンク等のブランド外色が無い
4. 重複表示・空白の塊・横スクロールが無い
5. desktop / mobile 両方で破綻が無い

「とりあえず並べただけ」「これで完成」は不可。**本番に対する残差を自分で列挙し、潰し切ってから**完了とすること。

---

## 1. 絶対に最初に読むべき「これまでに判明した根本原因」

前任者が苦労して突き止めた、抽出パイプライン由来の崩れの真因。これを知らないと同じ轍を踏む。

1. **抽出処理は `<style>` ブロックを全削除する。** そのため、ページ内 `<style>` で定義された**独自コンポーネントのCSSがまるごと消える**＝のっぺり表示の主因。
   - 例：study-support の「鬼監理」セクションは独自コンポーネント `.lexus-manage-wrapper`（`manage-grid` の2カラム比較、`quote-box`、`circle-visual-img` 等）。本番ではこのCSSが `<style>` にあった。
   - **対処**：`baseline/pages/<file>.html` の生HTMLには `<style>` が残っている。そこから該当CSSを抽出し、`.<コンポーネントクラス>` スコープで `pages.css` に追加して復元する（グローバルの `--font-serif`/`--font-sans` は**上書きしない**＝ローカル変数化する）。study-support は復元済みだが、**他ページにも同種の `<style>` コンポーネントが残っている可能性**。各ページの baseline で `<style>` 内のカスタムクラス（`elementor`/`swiper`/`wp-` 以外）を必ず確認すること。

2. **Elementor のナビメニューは「本体＋aria-hiddenのドロップダウン複製」の二重出力。** 抽出で Elementor の `display:none` が消え、**複製が丸見え**になる＝密な羅列・重複の主因。
   - 大学リンクは `elementor-nav-menu`。本体は `.elementor-nav-menu--main`、複製は `.elementor-nav-menu--dropdown`（＋ `.elementor-menu-toggle`）。
   - **対処**：`.elementor-nav-menu--dropdown` と `.elementor-menu-toggle` を `display:none`。本物の `--main` のみ整形する。

3. **`.fixed-source` の基底CSSは `.e-con-inner` を `display:flex; flex-wrap:wrap` の横並びにし、各ウィジェットに `flex:1 1 300px` を与える。** そのため、本来「縦積み」のはずのコンテンツが **300px幅の横カラムに潰れて左寄せ崩壊**する。
   - **対処**：固有CSSが無いページは `.fixed-page--unstack`（`[...slug].astro` で付与）で縦積み化済み。だが unstack は「全部1カラム」なので、**本番で2カラムのカード等は潰れる**。本来横並びにすべき箇所は個別に復元（コンポーネントCSS復元 or 2カラムグリッド指定）すること。

4. **抽出ページのCTAボタン等は全幅ウィジェット内で左寄せになりやすい。** `.elementor-widget-button`/`.elementor-button-wrapper` を中央寄せする（unstack 系で対応済みだが、要目視確認）。

5. **本番の大学一覧は五十音グループ（ア行/カ行…）。** 各グループは `<p>○行の大学</p>`（text-editor）＋ `elementor-nav-menu--main`。現状は `[...slug].astro` の is:inline スクリプトでセクション単位にタブ化している。タブの並び順・ラベル・デザインは要見直し。

---

## 2. 制約・運用ルール（厳守）

- **ブランチは `staging`** で作業。`main` には絶対に push しない。作業前に `git branch --show-current` を確認（過去に別ブランチへ切り替わっていた事故あり。違ったら `git switch staging`）。
- **ユーザーの並行作業に触らない。** 作業ツリーには投稿データ再生成・voice写真台帳・mobile改行監査スクリプト・`fixedPageSource.ts` のローカライズ追加など**ユーザー自身の未コミット変更**が混在する。`git add` は**自分が変更したファイルだけを明示指定**し、それ以外は stage しない・revert しない。
- **commit/push は staging。** push 後は必ず `https://staging.lexus-ec.pages.dev/<path>` のデプロイ反映を待ち、新しい `_astro/*.css` バンドルが配信されたか確認。
- 一時スクリプトは `frontend/scripts/_*.mjs` に作って良いが、**コミット前に削除**（明示 stage しているので紛れ込みはしないが片付ける）。
- URL/canonical/title/description/H1/主要本文/内部リンクは不用意に変えない。送信先・フォーム実装も変えない。
- 進捗は `docs/fixed-page-repair-ledger.md` に追記。

---

## 3. 必須ワークフロー（本番↔ステージングの並列比較ループ）

**このループを各ページで回すこと。コードだけ見て直さない。**

1. ビルド：
   ```powershell
   Set-Location C:\---hp\frontend
   npm.cmd run build   # astro check + build。~5s / 564ページ。0 errors を確認
   ```
2. **本番とローカルdistを同条件でフルページ撮影**（Playwright。Chromium は `C:/Program Files/Google/Chrome/Application/chrome.exe`、`playwright-core` は frontend の依存にあり）。
   - スクリプトは `frontend/scripts/` から実行（ESM の `node_modules` 解決のため）。**ルート引数は PowerShell から渡す**（Bash ツールは `/top/x/` を `C:/Program Files/Git/...` に化けさせる）。
   - 下記テンプレを `frontend/scripts/_cmp.mjs` に作成（本番ライブURL＋ローカルdistの両方を撮る）：
     ```js
     import fs from "node:fs"; import http from "node:http"; import path from "node:path"; import { chromium } from "playwright-core";
     const root=path.resolve(process.cwd(),"dist"); const out="C:/---hp/reports/cmp"; fs.mkdirSync(out,{recursive:true});
     const pages=[ // [slug, prodURL, localRoute]
       ["sss","https://lexus-ec.com/study-support-system/","/study-support-system/"],
       ["koku","https://lexus-ec.com/top/information-kokuritsu/","/top/information-kokuritsu/"],
       ["shiri","https://lexus-ec.com/top/information-shiritsu/","/top/information-shiritsu/"]];
     const vps=[{l:"d",w:1366,h:1000},{l:"m",w:390,h:844}];
     const mime=(f)=>f.endsWith(".html")?"text/html; charset=utf-8":f.endsWith(".css")?"text/css":f.endsWith(".js")?"text/javascript":f.endsWith(".svg")?"image/svg+xml":f.endsWith(".png")?"image/png":/\.jpe?g$/.test(f)?"image/jpeg":f.endsWith(".webp")?"image/webp":"application/octet-stream";
     const srv=http.createServer((q,s)=>{const u=new URL(q.url||"/","http://127.0.0.1");let f=path.join(root,decodeURIComponent(u.pathname));if(!f.startsWith(root)){s.writeHead(403);s.end();return;}if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,"index.html");if(!fs.existsSync(f)){s.writeHead(404);s.end();return;}s.writeHead(200,{"content-type":mime(f)});fs.createReadStream(f).pipe(s);});
     await new Promise(r=>srv.listen(0,"127.0.0.1",r)); const {port}=srv.address();
     const b=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"});
     const shot=async(url,file,v)=>{const p=await b.newPage({viewport:{width:v.w,height:v.h},deviceScaleFactor:1});try{await p.goto(url,{waitUntil:"networkidle",timeout:60000});await p.evaluate(async()=>{await new Promise(r=>{let y=0;const s=()=>{scrollTo(0,y);y+=700;y<document.body.scrollHeight?setTimeout(s,25):(scrollTo(0,0),setTimeout(r,600));};s();});});await p.waitForTimeout(700);await p.screenshot({path:file,fullPage:true});console.log("ok",path.basename(file));}catch(e){console.log("ERR",file,e.message);}await p.close();};
     for(const [slug,prod,route] of pages) for(const v of vps){ await shot(prod,`${out}/${slug}-prod-${v.l}.png`,v); await shot(`http://127.0.0.1:${port}${route}`,`${out}/${slug}-stag-${v.l}.png`,v);} 
     await b.close(); srv.close(); console.log("done");
     ```
   - 実行：`Set-Location C:\---hp\frontend; node ./scripts/_cmp.mjs`
3. **Read ツールで prod 画像と stag 画像を1組ずつ開いて目視比較**。残差（位置/余白/色/有無/構成）を箇条書きで列挙する。
4. 残差を1つずつ CSS/スクリプトで潰す → 再ビルド → 再撮影 → 再比較。**残差リストが空になるまで繰り返す。**
5. DOM 由来の謎挙動（要素がどこに属するか、なぜ左寄せか等）は、Playwright で `getBoundingClientRect`/`offsetParent`/`getComputedStyle` を出力する小プローブを書いて**実測**する（推測しない）。前任者はこれで「矢印が `offsetParent=body` だった」「画像が `max-width:none` だった」等を特定した。
6. 構造把握は **baseline 生HTML** を Node（utf-8）でパースして確認（PowerShell/Bash コンソールは日本語が文字化けする＝表示だけの問題。データは正しい。`Read` ツールや JSON 書き出しで確認する）。

---

## 4. 主要ファイル

- `frontend/src/styles/pages.css` … 固定ページCSS（巨大）。各ページは `.fixed-page--<slug>` で個別指定。`.fixed-page--unstack` / `.fixed-page--directory` は再利用クラス。
- `frontend/src/pages/[...slug].astro` … 抽出ページのレンダラ。`page.contentHtml` を `set:html` で出力。`unstackPaths` / `directoryPaths` の集合、五十音タブの is:inline スクリプトを保持。
- `frontend/src/lib/fixedPageSource.ts` … 抽出パイプライン。**`stripUnsafeAttrs` で `<style>`/`style=` を除去**、`restoreGalleryImages`（ギャラリー画像復元）あり。ここを触るとギャラリー9ページ等に波及するので慎重に。
- `baseline/pages/<file>.html` … 本番HTMLスナップショット（= コンテンツと“消えたCSS”の供給源）。対応：`top_information-kokuritsu.html` / `top_information-shiritsu.html` / `study-support-system.html`。
- `docs/fixed-page-repair-ledger.md` … 進捗台帳。`docs/handoff-3-pages-prompt.md`（本書）。
- ブランド基準：`frontend/src/pages/index.astro` + `frontend/src/styles/global.css`（トップページ）。

---

## 5. 各ページの現状と「本番との残差（要対応）」

前任セッションで一定改善済みだが、ユーザー評価は「まだ甘い」。以下を本番と比較して詰めること。

### study-support-system（鬼監理とは）
- 済：`.lexus-manage-wrapper` のCSS復元（アナログ赤/デジタル紺の2カラム比較・金縁円形画像・引用ボックス）、見出し中央寄せ＋赤アクセント、図解に枠、プレミア本科の黒金バンド、ボタン中央寄せ。
- **要確認の残差**：本番との細部（カードの寸法・余白・行間、`human-grid` 等の他ブロック、画像サイズ、セクション間リズム）。本番にあって未再現の要素が無いか baseline で総点検。`manage-*` 以外の独自 `<style>` コンポーネントが残っていないか確認。

### top/information-kokuritsu ・ top/information-shiritsu（医学部情報）
- 済：重複ドロップダウン非表示、本物の大学リストを罫線グリッド化、五十音タブ化（is:inline スクリプト）、緑バンド見出し、ボタン中央寄せ。
- **要確認の残差**：
  - 本番のセクション構成（「共通テスト ボーダー・足切り情報」の更新リスト、「大学基本情報」、「更新情報」等）の**見出しスタイル・順序・ボックス装飾**が本番に一致しているか。緑バンドが本番より過剰/不足でないか。
  - タブの**ラベル正確性・並び順（あ→わ）・選択中の見やすさ・デザイン**。タブ化されるべきグループだけが対象になっているか（ヘッダ/フッタや非五十音のナビを誤って巻き込んでいないか）。
  - グリッドのセル幅・文字サイズ・行間が本番に近いか。モバイルでのタブ折返しと列数。
  - 「更新情報」「共通テスト」リスト等、nav-menu でない部分の体裁。
  - ページ全体の余白リズム・中央揃え。

---

## 6. 進め方の指針（品質を落とさないために）

- **1ページずつ**。1ページを本番と並べて残差ゼロまで詰めてから次へ（Divide and Conquer）。
- 大きく不確実な再現は、**サブエージェントで「本番HTML構造の抽出」や「残差レビュー」を並列**させ、メインで直列に適用してもよい（共有 `pages.css`/git は直列前提）。
- 迷ったら**本番に寄せる**。ただしヘッダ/フッタ/ボタン/フォント/配色はブランド基準（トップ）を優先し、本番の低品質な装飾（Elementor 由来の崩れ・原色）は再現しない。
- 各ページ完了時、本番↔ステージングの**比較スクショ2枚組を根拠として提示**し、「残差リスト→全消し」を示してから完了宣言する。早すぎる「完成しました」は禁止。

---

## 7. コミット規約

- 変更したファイルのみ明示 stage（`git add frontend/src/styles/pages.css "frontend/src/pages/[...slug].astro"` 等）。
- メッセージ末尾に：
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
- PowerShell here-string（`@'...'@`）はクォート事故が起きやすい。多行は `$msg = "...`n..."` 方式が安全。
- push 後は staging デプロイ反映を待ち、実機URLで再確認。

以上。**本番を見て、並べて、残差を潰す。** これを徹底すれば必ず本番品質に到達できる。
