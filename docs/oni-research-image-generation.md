# 鬼研究：過去問を読み比べる鬼

## 現在の採用画像（v2、2026-11-09）

利用者の指摘を受け、虫眼鏡を完全に外し、手元を数式・図形・解答欄のある入試問題に変更。複数年度の問題冊子と背面の集計資料で、過去問研究というテーマを伝える。内蔵image_genでv1を編集し、背景透過・キャラクター・画風を維持した。装飾イラスト内の問題・集計値は架空で、記事の分析結果を表すものではない。

- 採用：`frontend/public/assets/oni-research/yuki-sensei-exam-research-v2-720.webp`（720×720、alpha最小0・最大255）
- 生成PNG原稿：`C:/---hp/materials/oni-research/images/yuki-sensei-data-analysis-v2.png`（1254×1254）
- ツール保存元：`C:/Users/phybo/.codex/generated_images/01a1baae-3a9c-7b63-8746-361947677af3/exec-073e29c9-2d51-46c3-a3df-f6bdec700f00.png`
- 編集対象：下記v1 PNG。PNGからWebPへの表示用縮小・符号化のみsharpで実施。
- v1原稿・ツール出力・旧表示用画像は比較と修正履歴のため保持。数学本文は変更していない。

### v2最終プロンプト（内蔵image_gen、transparent_background=true）

```text
Edit this existing Lexus red oni mascot illustration. Keep the same lovable red oni identity, two small yellow horns, red spiky hair, thick eyebrows, pointed ears, bold clean outlines and soft shaded cartoon rendering. Preserve the square transparent-background cutout composition and light wooden research desk. Make this a natural scene of studying and comparing mathematics entrance examination papers across years. COMPLETELY REMOVE THE MAGNIFYING GLASS. In the foreground, the oni holds and reads an actual examination-like sheet in one hand, while the other hand rests on or traces an equation on a second exam paper on the desk. The oni's eyes should look toward the examination sheet. All papers immediately in its hands and on the working area must look like entrance exam question pages: numbered question blocks, short algebra and calculus expressions, a small triangle or coordinate geometry problem diagram, and rows of square answer blanks. These foreground sheets must NOT be statistical charts, dashboards, pie charts or bar charts. Use convincing mathematical notation and restrained page typography; no need for extensive Japanese text or exact real exam reproduction. Keep several organized bundles of older exam papers and restrained supporting data-analysis sheets farther behind the oni, communicating extensive cross-year research. The pose must be anatomically clear and physically natural, with exactly two hands and no extra fingers. Keep the overall cute, energetic, intelligent character and existing brand-compatible warm palette. No grading marks, no checkmarks, no teacher paddle, no stamp, no magnifier anywhere, no large headline, no logo, no watermark. Fully transparent background outside the character, desk and research materials.
```

## v1履歴

2026-11-08、利用者の「たくさんのデータを見て分析している鬼」という依頼による新規場面の生成。内蔵image_genを使用し、既存の赤鬼をキャラクター・画風の参照にした。記事以外の画像は変更していない。

- 参照：`frontend/public/assets/optimized/yuki-sensei-default-480.webp`
- 採用：`frontend/public/assets/oni-research/yuki-sensei-data-analysis-720.webp`
- 採用画像：720×720、146,470 bytes、alphaあり（最小0・最大255）。PNGから表示用の縮小・WebP符号化のみ実施。内容の再描画や背景の塗り足しはない。
- 生成PNG原稿：`C:/---hp/materials/oni-research/images/yuki-sensei-data-analysis-v1.png`（1254×1254、背景透過）。生成ツールの保存元も保持。
- 利用ページ：`/oni-research/saitama-medical/2025/early/mathematics/`

## 最終生成プロンプト

```text
Use case: identity-preserve illustration / website mascot asset.
Image 1 is the CHARACTER IDENTITY AND DRAWING STYLE REFERENCE. Create a new illustration of this same recognizable red oni mascot for a Japanese medical entrance-exam research article, changing the scene and action completely.
Primary request: the oni is deeply analyzing a large collection of past-exam data, finding patterns across many papers and charts. Preserve the cute stocky chibi proportions, red skin, red spiky hair, two short warm yellow horns, thick eyebrows, expressive dark eyes, small pointed ears, bold clean dark outlines, warm soft cel shading, and orange flame accents of the reference. He looks absorbed, thoughtful and clever, slightly leaning forward as a researcher rather than checking somebody's homework.
Scene and pose: a compact cutout composition with the oni at the center behind a small light-wood research desk. One hand holds a magnifying glass over a printed statistical chart, the other hand points at another chart to compare it. A small open laptop shows a simple trend graph and a color-coded matrix; several substantial pages with bar charts, line graphs, tables and a pie chart fan around him at different heights. Two modest stacks of past-exam books or bound documents have color-coded page tabs. Give a strong instant impression of studying MANY DATASETS and comparing them, with clear medium-sized chart shapes legible as charts at a small website hero size. Keep visual hierarchy clean, with the oni face and analytical gesture dominant; props should support the scene rather than conceal the character. Maintain a cohesive warm red, orange, cream, gold and muted blue/green palette compatible with the reference.
Composition: approximately square, complete silhouette with all horns, charts, desk and props inside frame; comfortable transparent margin around the subject, polished professional mascot illustration. Transparent background with real alpha, not white, not a checkered pattern. No room or backdrop, no opaque background rectangle, only the character, research desk and analysis props. Keep any ground shadow subtle and translucent.
Avoid: club/wooden paddle, grading or corrections, red ticks, check marks, GOOD WORK stamp, homework-checking gesture, holding a pen over an open exercise book, school blackboard, extra characters, photorealism, 3D rendering, scary violence, cluttered tiny text, logos, watermarks, title lettering. No readable words, numbers, slogans or labels on the papers or computer; communicate analysis through abstract chart shapes only.
```

## 保存と再利用

大きい原稿は上記の既存プロジェクト内に1本だけ保存し、worktreeには表示用WebPだけを入れた。今後の画像修正は原稿を参照してimage_genを使う。画像の差替えだけのため、数学本文の再作成・全問テストの追加は行わず、サイトビルドと実際のステージング表示で確認する。
