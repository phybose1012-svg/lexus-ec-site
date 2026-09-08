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

/** ローカル管理 API を探す範囲（admin/editor と同じ 4335 から 10 個）。 */
const API_PORTS = Array.from({ length: 11 }, (_, index) => 4335 + index);

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
 * 読み込んだ中身から作る短い印（FNV-1a）。
 *
 * これを編集タブの名前に混ぜる。エディタは同じタブ名の編集途中の状態を
 * localStorage から復元し、**あるときは initialTrio を無視する**ので、
 * 名前を図の ID だけにするとファイルを直しても古い状態が出続ける。
 * 中身が変われば名前も変わる、という形にしておけばファイルが正本になる。
 */
function contentKey(source: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36);
}

type Loaded = {
  trio: PenroseTrio;
  /** SVG から取り込んだときの報告。控えから戻したときは null。 */
  report: SvgImportResult | null;
  /** 控え（.trio.json）から戻したか。 */
  fromSidecar: boolean;
  key: string;
};

async function findApiBase(): Promise<string | null> {
  for (const port of API_PORTS) {
    const base = `http://127.0.0.1:${port}`;
    try {
      const response = await fetch(`${base}/api/local-admin/health`, { cache: "no-store" });
      if (response.ok) return base;
    } catch {
      /* 次のポートを試す */
    }
  }
  return null;
}

/**
 * 過去問の図版を、その場で直すためのエディタ。
 *
 * FIBONA（図形エディタ）を React のアイランドとして載せている。
 *
 * **ローカルでしか動かない。** 書き戻し先はリポジトリのファイルで、それを
 * 触れるのは 127.0.0.1 で動く管理 API だけ。デプロイされたページからは
 * その API へ届かないので、その旨を出して編集させない。
 */
export default function FigureEditorIsland() {
  const [target] = useState(figureFromQuery);
  const packageId = target?.packageId ?? "";
  const figureId = target?.figureId ?? "";
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("読み込んでいます…");
  const [apiBase, setApiBase] = useState<string | null>(null);
  const [apiSearched, setApiSearched] = useState(false);

  const isLocal = ["127.0.0.1", "localhost", "::1"].includes(
    typeof window === "undefined" ? "" : window.location.hostname
  );

  useEffect(() => {
    if (!isLocal) return;
    let cancelled = false;
    void (async () => {
      const base = await findApiBase();
      if (cancelled) return;
      setApiBase(base);
      setApiSearched(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [isLocal]);

  // 図を読む。管理 API があれば控え（trio）ごと受け取り、無ければ SVG を
  // 読んで取り込む。控えを優先するのは、SVG から読み直すと編集の履歴
  // （レイヤ順・グループ・非表示）が失われるため。
  useEffect(() => {
    if (!target || !isLocal || !apiSearched) return;
    let cancelled = false;

    void (async () => {
      try {
        if (apiBase) {
          const response = await fetch(
            `${apiBase}/api/past-exam-figures?package=${encodeURIComponent(packageId)}&figure=${encodeURIComponent(figureId)}`,
            { cache: "no-store" }
          );
          const payload = await response.json();
          if (!response.ok) throw new Error(payload?.error ?? `HTTP ${response.status}`);
          if (payload.trio) {
            if (cancelled) return;
            setLoaded({
              trio: payload.trio as PenroseTrio,
              report: null,
              fromSidecar: true,
              key: contentKey(JSON.stringify(payload.trio)),
            });
            setStatus("");
            return;
          }
          const result = await importSvgForEditor(payload.svg as string);
          if (cancelled) return;
          setLoaded({
            trio: result.trio,
            report: result,
            fromSidecar: false,
            key: contentKey(payload.svg as string),
          });
          setStatus("");
          return;
        }

        // 管理 API が無いときも、読むだけならできる（保存はできない）。
        const svgResponse = await fetch(
          `/assets/past-exams/${packageId}/figures/${figureId}.svg`,
          { cache: "no-store" }
        );
        if (!svgResponse.ok) throw new Error(`SVG を取得できません (${svgResponse.status})`);
        const svg = await svgResponse.text();
        const result = await importSvgForEditor(svg);
        if (cancelled) return;
        setLoaded({ trio: result.trio, report: result, fromSidecar: false, key: contentKey(svg) });
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
  }, [target, isLocal, apiSearched, apiBase, packageId, figureId]);

  const save = useCallback(
    (svg: string, trio: PenroseTrio) => {
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
            // trio も一緒に送る。これが控えになり、生成スクリプトが
            // この図を上書きしなくなる（scripts/lib/past-exam-figure-handoff.mjs）。
            body: JSON.stringify({ packageId, figureId, svg, trio }),
          });
          const payload = await response.json();
          if (!response.ok) throw new Error(payload?.error ?? `HTTP ${response.status}`);
          setStatus(
            `保存しました（${payload.file}${
              payload.manifestUpdated ? " / manifest の寸法も更新" : ""
            }${payload.trioFile ? " / 控えも更新（生成スクリプトは上書きしません）" : ""}）`
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

  const report = loaded?.report ?? null;

  return (
    <div className="figure-editor-island">
      <div className="figure-editor-island__bar">
        <span>
          {packageId} / {figureId}
        </span>
        {loaded?.fromSidecar && <span>控えから復元（前回の編集の続き）</span>}
        {report && (
          <span>
            {report.status === "complete" ? "すべて変換できました" : "一部は変換できませんでした"}
            ・編集できるオブジェクト {report.objectCount} 個
            {report.warnings.length > 0 ? `・注意 ${report.warnings.length} 件` : ""}
          </span>
        )}
        <span>
          {!apiSearched
            ? "ローカル管理 API を探しています…"
            : apiBase
              ? "保存先: ローカル管理 API"
              : "保存できません（npm run admin:api）"}
        </span>
        {status && <strong>{status}</strong>}
      </div>

      <div className="figure-editor-island__editor">
        {loaded ? (
          <FigureEditor
            // 図ごと・中身ごとに編集途中の状態を分けて持つ。中身の印を混ぜて
            // いるのは、ファイルが変わったら古い編集状態を持ち出さないため。
            workspaceTabId={`lexus-${packageId}-${figureId}-${loaded.key}`}
            initialTrio={loaded.trio}
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
