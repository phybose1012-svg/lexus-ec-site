# 過去問ライブラリー 一括ステージング引き継ぎ

対象：30大学 / 67パッケージ / 201ルート。2026-09-09のユーザー依頼で、元HTMLから直列取り込み。

## 完成度を混同しない

- 既存独自解説5件は保護。新規62件はステージングレビュー版。
- 本文あり：問題67件 / 解説65件 / 分析64件。
- 目標点保留：19件。図版の予約領域：220箇所。これらは完成扱いではない。
- 本文欠損：iwate-medical-2025-general-chemistry、nippon-medical-2022-general-late-mathematics、teikyo-2025-general-physics。
- 既存学習者向け解説の取り込みは独立した再解答・論理検証ではない。ページ注記とメタデータでその違いを明記。

## 修正担当に渡すプロンプト

まずリポジトリの AGENTS.md と .agents/skills/past-exam-staging-batch/SKILL.md を読み、下の大学別Markdownを開いてください。元データ修正は C:/---hp/shidai-igakubu-gokaku-dokuhon の該当packageだけで行います。reconstruction.json、editorial-explanations.json、analysis.json、derived.jsonの関係を保ち、生成HTMLだけを直さないでください。各パッケージの全問・全解答欄・図表・元ページを監査し、前問依存・同値変形・代入先・符号・単位まで確認してください。以下の台帳は機械検出できた不備であり、誤りを網羅した数学的監査ではありません。

元データ不足は推測せず未解決として残すこと。検証不能な目標点を埋めず、本文の図を不用意に削除しないこと。SVGは条件から独自に描き、制限付きクロップをコピーしないこと。修正後に再生成・validator・TeX・PC/モバイル・印刷確認を行い、変更前後と根拠を報告してください。元ソースの修復後、ライブラリーへ対象packageだけを再取り込みます。独自解説に昇格済みファイルは上書き禁止です。

## 一覧

|パッケージ|状態|修正依頼|ステージング|
|---|---|---|---|
|aichi-medical-2025-general-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](aichi-medical-2025-general-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/aichi-medical/2025/mathematics/questions/)|
|aichi-medical-2025-general-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: targets-deferred|[依頼](aichi-medical-2025-general-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/aichi-medical/2025/physics/questions/)|
|dokkyo-medical-2025-general-early-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: targets-deferred|[依頼](dokkyo-medical-2025-general-early-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/dokkyo-medical/2025/mathematics/questions/)|
|dokkyo-medical-2025-general-early-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](dokkyo-medical-2025-general-early-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/dokkyo-medical/2025/physics/questions/)|
|fujita-health-2025-general-early-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: targets-deferred|[依頼](fujita-health-2025-general-early-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/fujita-health/2025/mathematics/questions/)|
|fujita-health-2025-general-early-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: targets-deferred|[依頼](fujita-health-2025-general-early-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/fujita-health/2025/physics/questions/)|
|fukuoka-2025-general-keitobetsu-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](fukuoka-2025-general-keitobetsu-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/fukuoka/2025/mathematics/questions/)|
|fukuoka-2025-general-keitobetsu-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](fukuoka-2025-general-keitobetsu-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/fukuoka/2025/physics/questions/)|
|hyogo-medical-2025-general-a-b-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: targets-deferred|[依頼](hyogo-medical-2025-general-a-b-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/hyogo-medical/2025/mathematics/questions/)|
|hyogo-medical-2025-general-a-b-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](hyogo-medical-2025-general-a-b-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/hyogo-medical/2025/physics/questions/)|
|international-health-welfare-2025-general-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](international-health-welfare-2025-general-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/international-health-welfare/2025/mathematics/questions/)|
|international-health-welfare-2025-general-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](international-health-welfare-2025-general-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/international-health-welfare/2025/physics/questions/)|
|iwate-medical-2025-general-chemistry|問題: imported; 解説: source-repair-required; 分析: source-repair-required|[依頼](iwate-medical-2025-general-chemistry.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/iwate-medical/2025/chemistry/questions/)|
|iwate-medical-2025-general-mathematics|既存独自編集版を維持|既存の個別ハンドオフ参照|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/iwate-medical/2025/mathematics/questions/)|
|iwate-medical-2025-general-physics|既存独自編集版を維持|既存の個別ハンドオフ参照|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/iwate-medical/2025/physics/questions/)|
|jichi-medical-2025-general-mathematics|既存独自編集版を維持|既存の個別ハンドオフ参照|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/jichi-medical/2025/mathematics/questions/)|
|jichi-medical-2025-general-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: targets-deferred|[依頼](jichi-medical-2025-general-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/jichi-medical/2025/physics/questions/)|
|jichi-medical-2025-general-mathematics-second-stage|問題: imported; 解説: editorial-adaptation-imported; 分析: targets-deferred|[依頼](jichi-medical-2025-general-mathematics-second-stage.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/jichi-medical/2025/mathematics-general-second-stage/questions/)|
|jikei-2025-general-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](jikei-2025-general-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/jikei/2025/mathematics/questions/)|
|jikei-2025-general-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](jikei-2025-general-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/jikei/2025/physics/questions/)|
|juntendo-2025-general-a-mathematics|既存独自編集版を維持|既存の個別ハンドオフ参照|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/juntendo/2025/mathematics/questions/)|
|juntendo-2025-general-a-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: targets-deferred|[依頼](juntendo-2025-general-a-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/juntendo/2025/physics/questions/)|
|kanazawa-medical-2025-general-early-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](kanazawa-medical-2025-general-early-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/kanazawa-medical/2025/mathematics/questions/)|
|kanazawa-medical-2025-general-early-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](kanazawa-medical-2025-general-early-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/kanazawa-medical/2025/physics/questions/)|
|kanazawa-medical-2025-general-late-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](kanazawa-medical-2025-general-late-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/kanazawa-medical/2025/mathematics-general-late-first-stage/questions/)|
|kansai-medical-2025-general-early-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](kansai-medical-2025-general-early-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/kansai-medical/2025/mathematics/questions/)|
|kansai-medical-2025-general-early-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: targets-deferred|[依頼](kansai-medical-2025-general-early-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/kansai-medical/2025/physics/questions/)|
|kawasaki-medical-2025-general-regional-quota-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](kawasaki-medical-2025-general-regional-quota-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/kawasaki-medical/2025/mathematics/questions/)|
|kawasaki-medical-2025-general-regional-quota-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](kawasaki-medical-2025-general-regional-quota-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/kawasaki-medical/2025/physics/questions/)|
|keio-2025-general-mathematics|既存独自編集版を維持|既存の個別ハンドオフ参照|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/keio/2025/mathematics/questions/)|
|keio-2025-general-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: targets-deferred|[依頼](keio-2025-general-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/keio/2025/physics/questions/)|
|kindai-2025-general-first-a-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](kindai-2025-general-first-a-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/kindai/2025/mathematics/questions/)|
|kindai-2025-general-first-a-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: targets-deferred|[依頼](kindai-2025-general-first-a-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/kindai/2025/physics/questions/)|
|kindai-2025-recommendation-general-public-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](kindai-2025-recommendation-general-public-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/kindai/2025/mathematics-recommendation-general-public-first-stage/questions/)|
|kindai-2025-recommendation-general-public-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](kindai-2025-recommendation-general-public-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/kindai/2025/physics-recommendation-general-public-first-stage/questions/)|
|kitasato-2025-general-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](kitasato-2025-general-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/kitasato/2025/mathematics/questions/)|
|kitasato-2025-general-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](kitasato-2025-general-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/kitasato/2025/physics/questions/)|
|kurume-2025-general-early-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](kurume-2025-general-early-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/kurume/2025/mathematics/questions/)|
|kurume-2025-general-early-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: targets-deferred|[依頼](kurume-2025-general-early-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/kurume/2025/physics/questions/)|
|kyorin-2025-general-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](kyorin-2025-general-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/kyorin/2025/mathematics/questions/)|
|kyorin-2025-general-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: targets-deferred|[依頼](kyorin-2025-general-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/kyorin/2025/physics/questions/)|
|nihon-u-2025-n-unified-first-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](nihon-u-2025-n-unified-first-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/nihon-u/2025/mathematics/questions/)|
|nihon-u-2025-n-unified-first-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](nihon-u-2025-n-unified-first-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/nihon-u/2025/physics/questions/)|
|nihon-u-2025-n-unified-first-mathematics-second-stage|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](nihon-u-2025-n-unified-first-mathematics-second-stage.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/nihon-u/2025/mathematics-n-unified-first-second-stage/questions/)|
|nippon-medical-2022-general-late-mathematics|問題: imported; 解説: source-repair-required; 分析: source-repair-required|[依頼](nippon-medical-2022-general-late-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/nippon-medical/2022/mathematics/questions/)|
|nippon-medical-2025-general-early-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](nippon-medical-2025-general-early-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/nippon-medical/2025/mathematics/questions/)|
|nippon-medical-2025-general-early-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: targets-deferred|[依頼](nippon-medical-2025-general-early-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/nippon-medical/2025/physics/questions/)|
|saitama-medical-2025-general-early-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](saitama-medical-2025-general-early-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/saitama-medical/2025/mathematics/questions/)|
|saitama-medical-2025-general-early-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](saitama-medical-2025-general-early-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/saitama-medical/2025/physics/questions/)|
|sangyo-medical-2025-general-a-b-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](sangyo-medical-2025-general-a-b-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/sangyo-medical/2025/mathematics/questions/)|
|sangyo-medical-2025-general-a-b-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](sangyo-medical-2025-general-a-b-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/sangyo-medical/2025/physics/questions/)|
|showa-medical-2025-general-i-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](showa-medical-2025-general-i-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/showa-medical/2025/mathematics/questions/)|
|showa-medical-2025-general-i-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: targets-deferred|[依頼](showa-medical-2025-general-i-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/showa-medical/2025/physics/questions/)|
|st-marianna-2025-general-early-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](st-marianna-2025-general-early-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/st-marianna/2025/mathematics/questions/)|
|st-marianna-2025-general-early-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](st-marianna-2025-general-early-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/st-marianna/2025/physics/questions/)|
|teikyo-2025-general-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](teikyo-2025-general-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/teikyo/2025/mathematics/questions/)|
|teikyo-2025-general-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: source-repair-required|[依頼](teikyo-2025-general-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/teikyo/2025/physics/questions/)|
|toho-2025-general-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](toho-2025-general-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/toho/2025/mathematics/questions/)|
|toho-2025-general-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: targets-deferred|[依頼](toho-2025-general-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/toho/2025/physics/questions/)|
|tohoku-medical-pharmaceutical-2025-general-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](tohoku-medical-pharmaceutical-2025-general-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/tohoku-medical-pharmaceutical/2025/mathematics/questions/)|
|tohoku-medical-pharmaceutical-2025-general-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: targets-deferred|[依頼](tohoku-medical-pharmaceutical-2025-general-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/tohoku-medical-pharmaceutical/2025/physics/questions/)|
|tokai-2025-general-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](tokai-2025-general-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/tokai/2025/mathematics/questions/)|
|tokai-2025-general-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: targets-deferred|[依頼](tokai-2025-general-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/tokai/2025/physics/questions/)|
|tokyo-medical-2025-general-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](tokyo-medical-2025-general-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/tokyo-medical/2025/mathematics/questions/)|
|tokyo-medical-2025-general-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: targets-deferred|[依頼](tokyo-medical-2025-general-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/tokyo-medical/2025/physics/questions/)|
|tokyo-womens-medical-2025-general-mathematics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](tokyo-womens-medical-2025-general-mathematics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/tokyo-womens-medical/2025/mathematics/questions/)|
|tokyo-womens-medical-2025-general-physics|問題: imported; 解説: editorial-adaptation-imported; 分析: imported|[依頼](tokyo-womens-medical-2025-general-physics.md)|[問題](https://staging.lexus-ec.pages.dev/past-exam-library/tokyo-womens-medical/2025/physics/questions/)|

## 再現・検証

実装作業ツリー：C:/---hp/_worktrees/keio-2025-mathematics。詳細スクリプトはSKILL.md参照。構造化台帳はfrontend/src/data/pastExamBatch/。最新作業ログは[continuation.md](continuation.md)。ビルドは元ソースcheckoutに依存しない。

ブラウザ検査：大学一覧30件から201ルートを実際に取得。全201ページをPC幅と390px指定のモバイル幅で開き、h1が1つ・ページ横幅超過なし・KaTeXエラー/未描画なし・読み込み済み画像エラーなしを確認。愛知医科大学の解説/分析などはスクリーンショットも目視。全内容の原本対照、すべての必要図版の描画、全文論理監査や全ページの印刷目視が完了したという意味ではない。

## 追加の目視所見

修正担当は[画面点検で見つかった項目](visual-review-notes.md)も確認してください。自動生成の大学別依頼とは分離して保管しています。

元データ側の[未解決事項の同期記録](upstream-issues.md)も大学IDで確認してください。items/ issuesの両形式を対象にしています。
