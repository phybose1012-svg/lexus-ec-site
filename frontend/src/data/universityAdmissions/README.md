# 大学公式資料で照合した入試表

1大学1JSONで `{slug}.json` を保存する。2027年度の大学公式資料に結び付いた情報だけを記載し、未公表条件を前年から推測しない。

形式は `docs/university-admissions-data-contract.md`、担当と公開手順は `docs/university-admissions-orchestration.md` を参照する。データがない大学は既存ページを維持する。

公開はステージングの実表示と公式資料の再照合後に、同一候補の大学ファイルだけをmainへ反映する。
