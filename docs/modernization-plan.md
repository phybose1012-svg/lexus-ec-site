# lexus-ec.com modernization plan

作成日: 2026-06-19

## 目的

既存SEOを守りながら、Elementor Pro依存、WordPress依存、CSS不統一を段階的に減らす。ドメインとURL構造は維持し、Google Search Consoleの「サイト移転」扱いになるような変更は避ける。

## 現状の実測

監査対象: `https://lexus-ec.com/`

- サイトマップから発見したページ: 757件
- サイトマップファイル: 8件
- HTML内リソース参照: 133,621件
- `/wp-content/` 参照: 121,069件
- `elementor` を含むリソース参照: 25,619件
- `wpr_t=` 付き参照: 997件
- 取得したユニークアセット: 900件
- 取得アセット総量: 36.6MB
- 取得CSS総量: 31.5MB
- 取得JS総量: 4.28MB
- CSS構成のバリエーション: 757種類。つまり、監査対象757ページすべてでCSSセットが異なる。

ホームページ:

- HTML: 472,078 bytes
- 外部CSS: 40件
- 外部JS: 21件
- 画像/メディア参照: 80件
- iframe: 4件
- `style` 属性: 45件
- `style` タグ: 13件
- `script` タグ: 41件
- `elementor-` 出現: 3,307回
- Elementor系アセット: 45件
- WordPress系アセット: 139件

主な依存シグナル:

- Plugin: `elementor` 16,016 refs
- Plugin: `elementor-pro` 10,768 refs
- Plugin: `all-in-one-seo-pack-pro` 4,542 refs
- Plugin: `aioseo-eeat` 4,542 refs
- Plugin: `wp-rocket` 3,405 refs
- Theme: `hello-elementor` 6,813 refs

重い代表アセット:

- MathJax `tex-svg.js`: 2.1MB
- MathJax `tex-chtml.js`: 1.16MB
- Google Fonts cache CSS: 約600KBのCSSが複数
- GTM script: 477KB
- Elementor page CSS: 100KB-330KB級が多数

Cloudflare/CDN:

- DNS NS: `ns1.dns.ne.jp`, `ns2.dns.ne.jp`
- A record: `133.167.10.120`
- 代表レスポンス: `server: nginx`
- `cf-cache-status` / `cf-ray`: 監査では0件
- 現時点ではCloudflareプロキシ配下ではない可能性が高い。

フォーム/予約系:

- `/online-guidance/`: Google Forms iframe
- `/request-documents/`: Google Forms iframe
- `/top/contact/`: Google Forms iframe
- `/top/reservation/`: 個別説明会予約ページ。別途実フォーム挙動の確認対象。

PageSpeed Insights APIは429で取得不可。代替として、直接取得したHTML/アセット/HTTPヘッダーで初期診断した。

## 方針

大改造は一気にやらない。SEOを守るため、URL・canonical・title・meta description・構造化データ・robots・sitemap・HTTP statusを固定したまま、内側の実装だけ差し替える。

優先順位:

1. Cloudflareを前段に入れて、DNS/SSL/キャッシュ/計測の土台を作る。
2. WordPressのままでも効く「即効性のある重さ」を削る。
3. 主要テンプレートをElementorから剥がし、共通CSSとコンポーネントへ移す。
4. URLを維持したまま静的生成または軽量CMSへ段階移行する。
5. WordPressは最後に管理画面/CMSとして残すか、完全停止するか判断する。

## Elementor / WordPress脱却

推奨ルートは「同一ドメイン・同一URLのまま段階移行」。

### Phase 1: WordPress上でElementorを減らす

- `hello-elementor` 依存を前提に、子テーマまたは独自テーマを作る。
- Header/Footer/CTA/カード/表/大学情報テンプレートをPHPテンプレートまたはブロックではなくコードで固定化する。
- Elementorのページ別CSS `post-*.css` を読み込むページを減らす。
- MathJaxは数式があるページだけ遅延読み込みにする。全ページ共通読み込みは禁止。
- YouTube iframeはlite-youtube相当のサムネイル置換にする。
- AIOSEOのtitle/meta/canonical/schemaは一旦維持する。

### Phase 2: 静的生成を併用する

- まずホーム、コース、合格実績、講師、アクセス、資料請求周辺などCVに近いページを静的HTMLで再実装する。
- URLは既存のまま。`/top/teacher/` などのパスも変えない。
- Cloudflare Worker/Rulesまたはoriginのrewriteで、完成したページだけ静的版を返す。
- 未移行の757ページはWordPressが返す。
- sitemap/canonical/meta/schemaの差分監査を必須にする。

### Phase 3: WordPress停止またはCMS化

- 757ページの本文、カテゴリ、画像、meta、schemaをエクスポート。
- Astro/Next/static generatorなどに移行する場合も、出力URLは完全一致させる。
- WordPressは管理用サブドメインに隔離するか廃止。
- `/wp-content/uploads/` の画像URLは当面維持する。画像URL変更はSEO/画像検索/外部リンクへの影響があるため後回し。

## Cloudflare導入

Cloudflare導入は、URL移転ではなくDNS/CDN層の追加。Googleの「サイト移転」にはしない。

初期作業:

- Cloudflareにzoneを追加。
- 現DNSレコードを全量インポート。
- `A lexus-ec.com 133.167.10.120` と必要な `www` を確認。
- Proxy statusをオレンジ雲にする。
- SSL/TLSはFull (strict)を目標にする。origin証明書が不十分なら先に整える。
- HTTP/2, HTTP/3, Brotli, Early Hintsを有効化候補にする。

Cache Rules案:

1. 管理/動的処理のバイパス

```text
(http.request.method ne "GET" and http.request.method ne "HEAD")
or starts_with(http.request.uri.path, "/wp-admin")
or http.request.uri.path eq "/wp-login.php"
or http.request.uri.path eq "/xmlrpc.php"
or starts_with(http.request.uri.path, "/wp-json")
or http.request.uri.path contains "admin-ajax.php"
or http.cookie contains "wordpress_logged_in_"
or http.cookie contains "wordpress_sec_"
or http.cookie contains "wp-postpass_"
or http.request.uri.query contains "preview=true"
```

Action: Bypass cache.

2. 静的アセットの長期キャッシュ

```text
http.host eq "lexus-ec.com"
and (
  starts_with(http.request.uri.path, "/wp-content/")
  or starts_with(http.request.uri.path, "/wp-includes/")
)
and http.request.uri.path.extension in {"css" "js" "jpg" "jpeg" "png" "webp" "avif" "svg" "gif" "woff" "woff2" "ico"}
```

Action:

- Eligible for cache
- Edge TTL: 1 year
- Browser TTL: 1 year
- Cache key: 可能なら `wpr_t` を除外。プラン上できなければ `/wp-content/cache/background-css/` だけqueryを無視するか、Worker/Transformで `wpr_t` を落とす。

3. 公開HTMLの短期edge cache

```text
http.host eq "lexus-ec.com"
and http.request.method in {"GET" "HEAD"}
and not starts_with(http.request.uri.path, "/wp-admin")
and not starts_with(http.request.uri.path, "/wp-json")
and http.request.uri.path ne "/wp-login.php"
and not http.cookie contains "wordpress_logged_in_"
and not http.cookie contains "wordpress_sec_"
and not http.request.uri.query contains "preview=true"
```

Action:

- Eligible for cache
- Edge TTL: 1 hourから開始。問題がなければ4-24 hoursへ延長。
- Browser TTL: Respect originまたは短め。
- WordPress運用を続ける間はCloudflare APOも候補。ただしCloudflare for WordPress pluginが必要。

検証:

- `cf-cache-status: HIT` が出ること。
- ログイン中、プレビュー、資料請求/問い合わせ/予約ページ、管理画面が事故らないこと。
- Google Forms iframe自体はGoogle側だが、埋め込みページHTMLのTTLは短めから始める。
- `robots.txt`, `sitemap.xml`, canonicalが変わらないこと。
- 404/301/カテゴリ/投稿ページのステータスが変わらないこと。

## CSS最適化

現状はCSSの一貫性が崩れているというより、ページごとのビルダーCSSがサイト構造そのものになっている。757ページでCSSセットが757種類なので、共通スタイルへ寄せるほど効果が出る。

作業順:

1. デザイントークン定義

- color
- typography
- spacing
- radius
- shadow
- breakpoint
- z-index

2. 共通コンポーネント定義

- Header
- Mega nav
- Footer
- CTA buttons
- Section headings
- Result/stat cards
- Course cards
- Voice/interview cards
- University information table
- FAQ accordion
- Form layout

3. CSS削減ルール

- ページ固有CSSは原則禁止。
- 例外はLP単位で1ファイルまで。
- `style` 属性は禁止。必要ならutility tokenへ移す。
- フォントは使用ウェイト/ファミリーを絞る。
- YouTube/MathJax/Swiperは使うページだけ読み込む。

4. 移行順

- まずホーム。
- 次にCV直前ページ: コース、資料請求、個別説明会、アクセス。
- 次に大量テンプレート: 大学別情報、入試情報、カテゴリ。

## SEO維持チェックリスト

- ドメイン維持: `https://lexus-ec.com/`
- URL維持: trailing slashも含めて現状に合わせる。
- canonical維持。
- title/meta description維持。
- AIOSEO由来の構造化データを新実装にも移植。
- OGP/Twitter meta維持。
- robots.txt維持。
- sitemap.xmlのURL集合とlastmod方針を維持。
- 既存301/404を棚卸し。
- internal linksのhrefを既存URLへ統一。
- 画像URLは当面維持。
- Search Consoleの「アドレス変更」は使わない。
- 必要なら通常のsitemap再送信だけに留める。

## 次の実装候補

1. Cloudflare移行前のDNS/フォーム/管理画面リスク一覧を作る。
2. ホームページだけを静的HTML/CSSでプロトタイプ化し、同等コンテンツ・軽量アセットで比較する。
3. 757ページをテンプレート種別に分類し、共通化できるページ群を特定する。
4. MathJax/YouTube/Swiper/GTMの読み込み条件を洗い出す。
5. `reports/page-inventory.csv` をもとに、上位20ページの優先改修リストを作る。

## 参考にした公式情報

- Cloudflare Cache Rules: https://developers.cloudflare.com/cache/how-to/cache-rules/
- Cloudflare Cache Rules settings: https://developers.cloudflare.com/cache/how-to/cache-rules/settings/
- Cloudflare Cache Everything while ignoring query strings: https://developers.cloudflare.com/cache/how-to/cache-rules/examples/cache-everything-ignore-query-strings/
- Cloudflare Bypass Cache on Cookie: https://developers.cloudflare.com/cache/how-to/cache-rules/examples/bypass-cache-on-cookie/
- Cloudflare APO: https://developers.cloudflare.com/automatic-platform-optimization/
