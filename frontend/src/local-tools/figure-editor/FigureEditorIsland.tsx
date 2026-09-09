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

/** ステージングの書き戻し口（Cloudflare Pages Function）。 */
const REMOTE_ENDPOINT = "/admin/api/past-exam-figures";

/** 管理 API の合言葉の置き場。admin/editor では使っていない、この機能だけのもの。 */
const TOKEN_KEY = "lexus.figure-editor.adminToken";

const readToken = () => {
  try {
    return window.localStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
};

const writeToken = (value: string) => {
  try {
    if (value) window.localStorage.setItem(TOKEN_KEY, value);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* 保存できなくても、その場では使える */
  }
};

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
  /**
   * 書き戻し先の名前。手元なら作業ツリーの場所、ステージングなら
   * `owner/repo@branch`。島は最初に応答した管理 API を採るので、別の
   * ワークツリーの API が上がっていればそちらへ書く。見えている必要がある。
   */
  repoRoot: string | null;
};

/**
 * 応答を読む。**JSON でないことがある。**
 *
 * Cloudflare は Function が落ちたとき（CPU 超過・502・524）HTML のページを
 * 返す。それを JSON として読もうとすると `Unexpected token '<'` になり、
 * 何が起きたのか分からなくなる。状態番号から言い直す。
 */
async function readResponse(response: Response): Promise<Record<string, unknown>> {
  const text = await response.text();
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    if (response.ok) throw new Error("応答が JSON ではありませんでした。");
    throw new Error(
      response.status >= 500
        ? `書き戻し口が応答しませんでした (HTTP ${response.status})。図が大きすぎるのかもしれません。`
        : `HTTP ${response.status}`
    );
  }
}

async function findLocalApi(): Promise<string | null> {
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
 * 書き戻し先は 2 つあり、開いている場所で決まる。
 *
 * - 手元（127.0.0.1）… ローカル管理 API が作業ツリーのファイルを直接書く
 * - ステージング … Pages Function が GitHub へ 1 コミットとして送る
 *
 * 本番（main）ではこのページ自体が作られない（astro.config.mjs）。
 */
export default function FigureEditorIsland() {
  const [target] = useState(figureFromQuery);
  const packageId = target?.packageId ?? "";
  const figureId = target?.figureId ?? "";
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("読み込んでいます…");
  const [localApi, setLocalApi] = useState<string | null>(null);
  const [apiSearched, setApiSearched] = useState(false);
  const [token, setToken] = useState("");
  const [tokenDraft, setTokenDraft] = useState("");
  /**
   * 手元で保存したが、まだ送っていない。
   *
   * 手元の口は作業ツリーのファイルを書き換えるだけで、誰にも見えない。
   * ここを黙っていると「保存したのに直っていない」になる。
   */
  const [pending, setPending] = useState(false);

  const isLocal =
    typeof window !== "undefined" &&
    ["127.0.0.1", "localhost", "::1"].includes(window.location.hostname);

  useEffect(() => {
    setToken(readToken());
  }, []);

  // 手元のときだけローカル API を探す。ステージングでは同じページの
  // /admin/api/... を使うので、探す相手はいない。
  useEffect(() => {
    if (!isLocal) {
      setApiSearched(true);
      return;
    }
    let cancelled = false;
    void (async () => {
      const base = await findLocalApi();
      if (cancelled) return;
      setLocalApi(base);
      setApiSearched(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [isLocal]);

  const forgetToken = useCallback(() => {
    writeToken("");
    setToken("");
  }, []);

  const authHeaders = useCallback((): Record<string, string> => {
    if (isLocal || !token) return {};
    return { Authorization: `Bearer ${token}` };
  }, [isLocal, token]);

  const endpoint = isLocal
    ? localApi
      ? `${localApi}/api/past-exam-figures`
      : null
    : REMOTE_ENDPOINT;

  // 図を読む。控え（trio）があればそれを使う。無ければ SVG を取り込む。
  // 控えを優先するのは、SVG から読み直すと編集の履歴（レイヤ順・グループ・
  // 非表示）が失われるため。
  useEffect(() => {
    if (!target || !apiSearched) return;
    let cancelled = false;

    void (async () => {
      try {
        if (endpoint) {
          const response = await fetch(
            `${endpoint}?package=${encodeURIComponent(packageId)}&figure=${encodeURIComponent(figureId)}`,
            { cache: "no-store", headers: authHeaders() }
          );
          const payload = await readResponse(response);
          if (!response.ok) throw new Error(String(payload?.error ?? `HTTP ${response.status}`));
          if (payload.trio) {
            if (cancelled) return;
            setLoaded({
              trio: payload.trio as PenroseTrio,
              report: null,
              fromSidecar: true,
              key: contentKey(JSON.stringify(payload.trio)),
              repoRoot: (payload.repoRoot as string) ?? null,
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
            repoRoot: (payload.repoRoot as string) ?? null,
          });
          setStatus("");
          return;
        }

        // 書き戻し口が無いときも、読むだけならできる（保存はできない）。
        const svgResponse = await fetch(
          `/assets/past-exams/${packageId}/figures/${figureId}.svg`,
          { cache: "no-store" }
        );
        if (!svgResponse.ok) throw new Error(`SVG を取得できません (${svgResponse.status})`);
        const svg = await svgResponse.text();
        const result = await importSvgForEditor(svg);
        if (cancelled) return;
        setLoaded({
          trio: result.trio,
          report: result,
          fromSidecar: false,
          key: contentKey(svg),
          repoRoot: null,
        });
        setStatus("");
      } catch (cause) {
        if (cancelled) return;
        const message = cause instanceof Error ? cause.message : String(cause);
        // 合言葉が違うなら、覚えているものを捨てて入れ直させる。
        // 持ったままだと、何度読み込んでも同じ失敗が出続ける。
        if (/401|authorized/i.test(message)) forgetToken();
        setError(message);
        setStatus("");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [target, apiSearched, endpoint, packageId, figureId, authHeaders]);

  const save = useCallback(
    (svg: string, trio: PenroseTrio) => {
      if (!endpoint) {
        setStatus(
          isLocal
            ? "ローカル管理 API が見つかりません（npm run admin:api）"
            : "書き戻し口がありません。"
        );
        return;
      }
      setStatus("保存しています…");
      void (async () => {
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            // trio も一緒に送る。これが控えになり、生成スクリプトが
            // この図を上書きしなくなる（scripts/lib/past-exam-figure-handoff.mjs）。
            body: JSON.stringify({ packageId, figureId, svg, trio }),
          });
          const payload = await readResponse(response);
          if (!response.ok) throw new Error(String(payload?.error ?? `HTTP ${response.status}`));
          setStatus(
            payload.commit
              ? // ステージングの口は commit まで済ませる。あとはビルドを待つだけ。
                `保存しました（commit ${String(payload.commit).slice(0, 7)} を ${payload.branch} へ。1〜2分で画面に出ます）`
              : // 手元の口はファイルを書き換えただけ。**これでは誰にも見えない。**
                // 送るまでが 1 仕事なので、終わったふりをしない。
                "保存しました（このパソコンの中だけ。まだ公開されていません）"
          );
          if (!payload.commit) setPending(true);
        } catch (cause) {
          const message = cause instanceof Error ? cause.message : String(cause);
          if (/401|authorized/i.test(message)) forgetToken();
          setStatus(`保存できませんでした: ${message}`);
        }
      })();
    },
    [endpoint, isLocal, authHeaders, packageId, figureId]
  );

  /** 直したものを staging へ送る（commit して push する）。 */
  const publish = useCallback(() => {
    if (!localApi) return;
    setStatus("ステージングへ送っています…");
    void (async () => {
      try {
        const response = await fetch(`${localApi}/api/past-exam-figures/publish`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ packageId, figureId }),
        });
        const payload = await readResponse(response);
        if (!response.ok) throw new Error(String(payload?.error ?? `HTTP ${response.status}`));
        setPending(false);
        const files = Array.isArray(payload.files) ? payload.files.length : 0;
        setStatus(`送りました（${payload.branch} へ ${files} 件。1〜2分で画面に出ます）`);
      } catch (cause) {
        setStatus(`送れませんでした: ${cause instanceof Error ? cause.message : String(cause)}`);
      }
    })();
  }, [localApi, packageId, figureId]);

  if (!target) {
    return (
      <p className="figure-editor-island__notice">
        図の指定がありません。過去問ページの図の「直す」から開いてください。
      </p>
    );
  }

  if (error) {
    return (
      <div className="figure-editor-island__notice">
        <p>読み込めません: {error}</p>
        {!isLocal && <TokenField draft={tokenDraft} onDraft={setTokenDraft} onSave={saveToken} />}
      </div>
    );
  }

  const report = loaded?.report ?? null;

  function saveToken(value: string) {
    writeToken(value.trim());
    setToken(value.trim());
    setTokenDraft("");
    setError(null);
    setStatus("読み込んでいます…");
  }

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
        {/* どこへ書くのかを出す。手元では別のワークツリーの管理 API を掴んで
            いることがあり、ステージングではどの枝へコミットするかが要る。 */}
        <span title={loaded?.repoRoot ?? undefined}>
          {!apiSearched
            ? "ローカル管理 API を探しています…"
            : endpoint
              ? `保存先: ${loaded?.repoRoot ?? endpoint}`
              : "保存できません（npm run admin:api）"}
        </span>
        {status && <strong>{status}</strong>}
        {/* 保存はゴールではない。送るまでが 1 仕事なので、ここに出しておく。 */}
        {pending && (
          <button type="button" className="figure-editor-island__publish" onClick={publish}>
            ステージングへ送る
          </button>
        )}
        {!isLocal &&
          (token ? (
            <button type="button" className="figure-editor-island__forget" onClick={forgetToken}>
              合言葉を入れ直す
            </button>
          ) : (
            <TokenField draft={tokenDraft} onDraft={setTokenDraft} onSave={saveToken} />
          ))}
      </div>

      <div className="figure-editor-island__editor">
        {loaded ? (
          <FigureEditor
            // 図ごと・中身ごとに編集途中の状態を分けて持つ。中身の印を混ぜて
            // いるのは、ファイルが変わったら古い編集状態を持ち出さないため。
            workspaceTabId={`lexus-${packageId}-${figureId}-${loaded.key}`}
            initialTrio={loaded.trio}
            onSave={save}
            // 右パネルを持たない簡易編集 UI。選んだものの上にミニバーが出る。
            // ここでやるのは出来上がった図の手直しなので、作図の道具一式は要らない。
            uiProfile="simple"
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

/**
 * 管理 API の合言葉の入力欄。
 *
 * ステージングは誰でも開けるので、書き込みには合言葉が要る（Cloudflare の
 * ADMIN_API_TOKEN）。入れた値はこのブラウザにだけ残る。Cloudflare Access で
 * メールを許可している場合は要らない。
 */
function TokenField({
  draft,
  onDraft,
  onSave,
}: {
  draft: string;
  onDraft: (value: string) => void;
  onSave: (value: string) => void;
}) {
  return (
    <form
      className="figure-editor-island__token"
      onSubmit={(event) => {
        event.preventDefault();
        onSave(draft);
      }}
    >
      <label>
        管理APIの合言葉
        <input
          type="password"
          value={draft}
          autoComplete="off"
          onChange={(event) => onDraft(event.target.value)}
          placeholder="ADMIN_API_TOKEN"
        />
      </label>
      <button type="submit">覚える</button>
    </form>
  );
}
