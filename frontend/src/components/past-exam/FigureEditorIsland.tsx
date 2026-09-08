import { useCallback, useEffect, useState } from "react";
import {
  FigureEditor,
  importSvgForEditor,
  type PenroseTrio,
  type SvgImportResult,
} from "@phybose1012-svg/figure-editor";
import "@phybose1012-svg/figure-editor/style.css";

/** ID の形。manifest 側の検査（pastExamFigures.mjs）と同じ。 */
const ID = /^[a-z0-9-]+$/;

/**
 * どの図を開くかは URL のクエリで受ける。
 *
 * **Astro の props では渡せない。** 静的出力ではページはビルド時に 1 枚だけ
 * 作られ、その時点でクエリは存在しないため。島がブラウザで自分で読む。
 */
function figureFromQuery(): { packageId: string; figureId: string } | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const packageId = params.get("package") ?? "";
  const figureId = params.get("figure") ?? "";
  if (!ID.test(packageId) || !ID.test(figureId)) return null;
  return { packageId, figureId };
}

/**
 * 過去問の図版を、その場で直すためのエディタ。
 *
 * FIBONA（図形エディタ）を React のアイランドとして載せている。SVG を読んで
 * 編集できる形へ翻訳し、保存はローカル管理 API へ返す。
 *
 * **ローカルでしか動かない。** 書き戻し先はリポジトリのファイルで、それを
 * 触れるのは 127.0.0.1 で動く管理 API だけ。デプロイされたページからは
 * その API へ届かないので、その旨を出して編集させない。
 */
export default function FigureEditorIsland() {
  const [target] = useState(figureFromQuery);
  const packageId = target?.packageId ?? "";
  const figureId = target?.figureId ?? "";
  const src = target
    ? `/assets/past-exams/${packageId}/figures/${figureId}.svg`
    : "";
  const [trio, setTrio] = useState<PenroseTrio | null>(null);
  const [report, setReport] = useState<SvgImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("読み込んでいます…");
  const [apiBase, setApiBase] = useState<string | null>(null);

  const isLocal = ["127.0.0.1", "localhost", "::1"].includes(
    typeof window === "undefined" ? "" : window.location.hostname
  );

  // ローカル管理 API を探す（admin/editor と同じ 4335 から 10 個）。
  useEffect(() => {
    if (!isLocal) return;
    let cancelled = false;
    void (async () => {
      for (let port = 4335; port <= 4345; port += 1) {
        const base = `http://127.0.0.1:${port}`;
        try {
          const response = await fetch(`${base}/api/local-admin/health`, {
            cache: "no-store",
          });
          if (!response.ok) continue;
          if (!cancelled) setApiBase(base);
          return;
        } catch {
          /* 次のポートを試す */
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLocal]);

  // SVG を読んで編集できる形へ翻訳する。
  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch(src, { cache: "no-store" });
        if (!response.ok) throw new Error(`SVG を取得できません (${response.status})`);
        const result = await importSvgForEditor(await response.text());
        if (cancelled) return;
        setReport(result);
        setTrio(result.trio);
        setStatus("");
      } catch (cause) {
        if (cancelled) return;
        setError(cause instanceof Error ? cause.message : String(cause));
        setStatus("");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [src]);

  const save = useCallback(
    (svg: string, _trio: PenroseTrio) => {
      if (!apiBase) {
        setStatus("ローカル管理 API が見つかりません（npm run admin:api）");
        return;
      }
      setStatus("保存しています…");
      void (async () => {
        try {
          const response = await fetch(`${apiBase}/api/past-exam-figures`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ packageId, figureId, svg }),
          });
          const payload = await response.json();
          if (!response.ok) throw new Error(payload?.error ?? `HTTP ${response.status}`);
          setStatus(
            `保存しました（${payload.file}${
              payload.manifestUpdated ? " / manifest の寸法も更新" : ""
            }）`
          );
        } catch (cause) {
          setStatus(
            `保存できませんでした: ${cause instanceof Error ? cause.message : String(cause)}`
          );
        }
      })();
    },
    [apiBase, packageId, figureId]
  );

  if (!target) {
    return (
      <p className="figure-editor-island__notice">
        図の指定がありません。過去問ページの図の「直す」から開いてください。
      </p>
    );
  }

  if (!isLocal) {
    return (
      <p className="figure-editor-island__notice">
        図版の編集はローカル（127.0.0.1）でのみ行えます。書き戻し先がリポジトリの
        ファイルなので、公開中のページからは触れません。
      </p>
    );
  }

  if (error) {
    return <p className="figure-editor-island__notice">読み込めません: {error}</p>;
  }

  return (
    <div className="figure-editor-island">
      <div className="figure-editor-island__bar">
        <span>
          {packageId} / {figureId}
        </span>
        {report && (
          <span>
            {report.status === "complete" ? "すべて変換できました" : "一部は変換できませんでした"}
            ・編集できるオブジェクト {report.objectCount} 個
            {report.warnings.length > 0 ? `・注意 ${report.warnings.length} 件` : ""}
          </span>
        )}
        <span>{apiBase ? "保存先: ローカル管理 API" : "ローカル管理 API を探しています…"}</span>
        {status && <strong>{status}</strong>}
      </div>

      <div className="figure-editor-island__editor">
        {trio ? (
          <FigureEditor
            // 図ごとに編集途中の状態を分けて持つ（別の図を開いても混ざらない）。
            workspaceTabId={`lexus-${packageId}-${figureId}`}
            initialTrio={trio}
            onSave={save}
            // AI 生成・MAX・AI 修正は sidecar が要る。ここでは使わない。
            allowGenerate={false}
            allowMaxMode={false}
            allowAiEdit={false}
            exportFormats={["svg"]}
          />
        ) : (
          <p className="figure-editor-island__notice">{status}</p>
        )}
      </div>

      {report && report.warnings.length > 0 && (
        <details className="figure-editor-island__warnings">
          <summary>変換で変わったところ（{report.warnings.length} 件）</summary>
          <ul>
            {report.warnings.map((warning, index) => (
              <li key={`${warning.code}-${index}`}>{warning.message}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
