# 鬼研究：データ分析の鬼

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
