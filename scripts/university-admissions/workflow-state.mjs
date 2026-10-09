/** University-level state files; no Git, deployment, browser or network actions. */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const workspaceDefault = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const COOLDOWN_MS = 60_000;
export const STATES = ['pending', 'researching', 'draft', 'staging-published', 'staging-verified', 'main-published', 'main-verified', 'published', 'deferred'];
const TERMINAL = new Set(['published', 'deferred']);
const isHash = v => typeof v === 'string' && /^[a-f0-9]{64}$/i.test(v);
const isCommit = v => typeof v === 'string' && /^[a-f0-9]{40}$/i.test(v);
const hasText = v => typeof v === 'string' && !!v.trim();
const validDate = v => hasText(v) && /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/.test(v) && Number.isFinite(Date.parse(v));
const validUrl = v => { try { return ['https:', 'http:'].includes(new URL(v).protocol); } catch { return false; } };
const sameFile = (a, b) => hasText(a) && hasText(b) && a.replaceAll('\\', '/') === b.replaceAll('\\', '/');
const withoutToken = lease => lease ? Object.fromEntries(Object.entries(lease).filter(([key]) => key !== 'token')) : null;

export class WorkflowError extends Error {
  constructor(code, message, details) { super(message); this.name = 'WorkflowError'; this.code = code; if (details) this.details = details; }
}
function requireValue(test, code, message, details) { if (!test) throw new WorkflowError(code, message, details); }
async function readJson(file, fallback) {
  try { return JSON.parse((await fs.readFile(file, 'utf8')).replace(/^\uFEFF/, '')); }
  catch (error) { if (error.code === 'ENOENT' && fallback !== undefined) return fallback; throw new WorkflowError('STATE_READ_FAILED', `JSONを読み取れません: ${file}`, { cause: error.message }); }
}
async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  try { await fs.rename(temporary, file); }
  catch (error) { await fs.unlink(temporary).catch(() => {}); throw error; }
}

export function createWorkflow({ workspaceDir = workspaceDefault, stateDir = path.join(workspaceDir, 'reports/university-admissions'), now = () => Date.now() } = {}) {
  const workspace = path.resolve(workspaceDir);
  const directory = path.resolve(stateDir);
  const lockDirectory = path.join(directory, 'publish.lock');
  const lockFile = path.join(lockDirectory, 'owner.json');
  const stamp = () => new Date(now()).toISOString();
  const itemFile = slug => path.join(directory, 'items', `${slug}.json`);
  const workerFile = worker => path.join(directory, 'workers', `${worker}.json`);
  const resolveEvidence = value => path.isAbsolute(value) ? value : path.resolve(workspace, value);

  async function manifest() {
    const document = await readJson(path.join(directory, 'manifest.json'));
    requireValue(document.version === 1 && Array.isArray(document.workers) && Array.isArray(document.universities), 'INVALID_MANIFEST', 'manifestにはversion=1、workers、universitiesが必要です。');
    const workers = new Map(), universities = new Map(), owners = new Map();
    for (const worker of document.workers) {
      requireValue(Number.isInteger(worker.id) && worker.id >= 1 && worker.id <= 4 && !workers.has(worker.id) && Array.isArray(worker.slugs), 'INVALID_MANIFEST', 'workerは1〜4の重複しないidとslugsを持つ必要があります。');
      workers.set(worker.id, worker);
      for (const slug of worker.slugs) {
        requireValue(typeof slug === 'string' && /^[a-z0-9][a-z0-9_-]*$/.test(slug) && !owners.has(slug), 'INVALID_MANIFEST', '大学slugは安全な文字列で、担当が重複しない必要があります。');
        owners.set(slug, worker.id);
      }
    }
    for (const university of document.universities) {
      requireValue(owners.get(university.slug) === university.worker && !universities.has(university.slug), 'INVALID_MANIFEST', '大学のworkerと担当リストが一致しません。');
      universities.set(university.slug, university);
    }
    requireValue(universities.size === owners.size, 'INVALID_MANIFEST', '担当大学の情報がmanifestに揃っていません。');
    return { document, workers, universities, owners };
  }
  async function assigned(worker, slug) {
    const data = await manifest();
    requireValue(Number.isInteger(worker) && data.workers.has(worker), 'UNKNOWN_WORKER', 'manifestに存在するworkerを指定してください。');
    if (slug !== undefined) requireValue(data.owners.get(slug) === worker, 'NOT_ASSIGNED', 'この大学は指定workerの担当ではありません。');
    return { ...data, worker: data.workers.get(worker), university: data.universities.get(slug) };
  }
  async function readItem(university) {
    const item = await readJson(itemFile(university.slug), { version: 1, slug: university.slug, worker: university.worker, name: university.name, path: university.path, state: 'pending' });
    requireValue(item.slug === university.slug && item.worker === university.worker && STATES.includes(item.state), 'INVALID_ITEM', '大学の状態ファイルの担当または状態が不正です。');
    return item;
  }
  async function readWorker(worker) {
    const record = await readJson(workerFile(worker), { version: 1, worker, currentSlug: null, lastPublishedAt: null, nextEligibleAt: null });
    requireValue(record.worker === worker, 'INVALID_WORKER_STATE', 'worker状態ファイルの番号が不正です。');
    return record;
  }
  async function reconcileWorker(worker, assignedData) {
    const record = await readWorker(worker);
    const items = await Promise.all(assignedData.worker.slugs.map(slug => readItem(assignedData.universities.get(slug))));
    const publicationTimes = items.filter(item => item.state === 'published' && validDate(item.publishedAt)).map(item => Date.parse(item.publishedAt));
    if (validDate(record.lastPublishedAt)) publicationTimes.push(Date.parse(record.lastPublishedAt));
    if (publicationTimes.length) {
      const latest = Math.max(...publicationTimes);
      record.lastPublishedAt = new Date(latest).toISOString();
      // Never shorten a saved waiting period; recover it after a partial state write.
      record.nextEligibleAt = new Date(Math.max(latest + COOLDOWN_MS, validDate(record.nextEligibleAt) ? Date.parse(record.nextEligibleAt) : 0)).toISOString();
    }
    if (record.currentSlug && !assignedData.worker.slugs.includes(record.currentSlug)) throw new WorkflowError('INVALID_WORKER_STATE', '現在の大学が担当リストにありません。');
    if (record.currentSlug && TERMINAL.has(items.find(item => item.slug === record.currentSlug)?.state)) record.currentSlug = null;
    return { record, items };
  }
  async function saveWorker(record) { record.updatedAt = stamp(); await writeJson(workerFile(record.worker), record); }
  async function currentLock() {
    const lease = await readJson(lockFile, null);
    if (lease) return lease;
    const stat = await fs.stat(lockDirectory).catch(() => null);
    return stat?.isDirectory() ? { incomplete: true, policy: 'Owner metadata missing; do not automatically remove this lock.' } : null;
  }
  async function verifyArtifact(file, sha256, label) {
    requireValue(hasText(file) && isHash(sha256), 'MISSING_VERIFICATION', `${label}のfileとSHA-256が必要です。`);
    let bytes;
    try { bytes = await fs.readFile(resolveEvidence(file)); }
    catch { throw new WorkflowError('MISSING_ARTIFACT', `${label}の実ファイルがありません: ${file}`); }
    requireValue(bytes.length > 0 && crypto.createHash('sha256').update(bytes).digest('hex') === sha256.toLowerCase(), 'ARTIFACT_HASH_MISMATCH', `${label}の実ファイルとSHA-256が一致しません。`);
    return bytes;
  }
  async function verifyScreenshot(proof, label) {
    requireValue(proof?.passed === true && hasText(proof.screenshotFile), 'MISSING_VERIFICATION', `${label}の公開画面確認とscreenshotFileが必要です。`);
    const stat = await fs.stat(resolveEvidence(proof.screenshotFile)).catch(() => null);
    requireValue(stat?.isFile() && stat.size > 0, 'MISSING_ARTIFACT', `${label}のスクリーンショット実ファイルがありません。`);
  }
  async function verifyComparison(proof, candidate, item, label) {
    requireValue(proof?.passed === true, 'MISSING_VERIFICATION', `${label}の公式資料再照合が完了していません。`);
    const bytes = await verifyArtifact(proof.file, proof.sha256, `${label}の公式再照合記録`);
    let comparison;
    try { comparison = JSON.parse(bytes.toString('utf8')); } catch { throw new WorkflowError('INVALID_COMPARISON', '公式再照合記録はJSONにしてください。'); }
    requireValue(comparison.version === 1 && comparison.passed === true && comparison.coverageReview?.confirmed === true && validDate(comparison.reviewedAt) && hasText(comparison.reviewer), 'INVALID_COMPARISON', '公式再照合記録の確認者・日時・全体確認が不足しています。');
    requireValue(sameFile(comparison.candidateFile, candidate.file) && comparison.candidateSha256?.toLowerCase() === candidate.sha256.toLowerCase() && comparison.path === item.path, 'INVALID_COMPARISON', '公式再照合記録が同一候補・大学を参照していません。');
    let data;
    try { data = JSON.parse((await verifyArtifact(candidate.file, candidate.sha256, '公開候補')).toString('utf8').replace(/^\uFEFF/, '')); }
    catch (error) { if (error instanceof WorkflowError) throw error; throw new WorkflowError('INVALID_CANDIDATE', '公開候補はJSONにしてください。'); }
    requireValue(data.path === item.path && data.university === item.name && data.admissionYear === 2027 && comparison.university === data.university && comparison.admissionYear === data.admissionYear, 'INVALID_COMPARISON', '候補と公式再照合記録の大学名・パス・対象年度が一致しません。');
    requireValue(Array.isArray(data.sources) && data.sources.length > 0 && Array.isArray(data.schemes) && data.schemes.length > 0 && Array.isArray(data.coverageNotes) && data.coverageNotes.length > 0 && data.coverageNotes.every(hasText), 'INVALID_CANDIDATE', '公開候補には出典・方式・掲載範囲の配列が必要です。');
    requireValue(JSON.stringify(comparison.coverageReview.notes) === JSON.stringify(data.coverageNotes), 'INVALID_COMPARISON', 'coverageReview.notesは候補のcoverageNotes全件を同じ文面・同じ順で記録してください。');
    const expectedSources = new Map(), expectedTargets = new Map();
    for (const source of data.sources) {
      requireValue(hasText(source.id) && !expectedSources.has(source.id) && validUrl(source.url) && hasText(source.title), 'INVALID_CANDIDATE', '候補の出典ID・URL・題名が不正です。');
      expectedSources.set(source.id, source);
    }
    const schemeIds = new Set();
    for (const scheme of data.schemes) {
      requireValue(hasText(scheme.id) && !schemeIds.has(scheme.id) && hasText(scheme.name), 'INVALID_CANDIDATE', '候補の方式ID・名称が不正です。'); schemeIds.add(scheme.id);
      for (const [type, field] of [['schedule', 'scheduleRows'], ['exam', 'examRows'], ['venue', 'venueRows'], ['note', 'notes']]) {
        requireValue(Array.isArray(scheme[field]) && (type === 'note' || scheme[field].length > 0), 'INVALID_CANDIDATE', '候補には日程・科目配点・会場の各行と注記配列が必要です。');
        for (const [index, row] of scheme[field].entries()) {
          requireValue(row && hasText(type === 'note' ? row.text : row.value) && (type === 'note' || hasText(row.label)) && Array.isArray(row.sourceIds) && row.sourceIds.length > 0 && new Set(row.sourceIds).size === row.sourceIds.length && row.sourceIds.every(id => expectedSources.has(id)), 'INVALID_CANDIDATE', '候補の各行・注記には本文と重複しない実在出典IDが必要です。');
          expectedTargets.set(`${scheme.id}/${type}/${index}`, { ...row, type });
        }
      }
    }
    requireValue(Array.isArray(comparison.sources) && comparison.sources.length > 0 && Array.isArray(comparison.comparisons) && comparison.comparisons.length > 0, 'INVALID_COMPARISON', '公式再照合記録には原典一覧と比較行が必要です。');
    const sources = new Map();
    for (const source of comparison.sources) {
      requireValue(hasText(source.sourceId) && validUrl(source.url) && hasText(source.title) && validDate(source.retrievedAt) && !sources.has(source.sourceId), 'INVALID_COMPARISON', '原典には重複しないsourceId、URL、題名、取得日時が必要です。');
      requireValue(expectedSources.get(source.sourceId)?.url === source.url && expectedSources.get(source.sourceId)?.title === source.title, 'INVALID_COMPARISON', '再照合記録の原典ID・URL・題名が候補の出典一覧と一致しません。');
      sources.set(source.sourceId, source);
    }
    requireValue(sources.size === expectedSources.size, 'INVALID_COMPARISON', '再照合記録の原典一覧が候補の出典を網羅していません。');
    const targets = new Set();
    for (const row of comparison.comparisons) {
      requireValue(hasText(row.target) && !targets.has(row.target) && hasText(row.reviewer) && validDate(row.checkedAt) && hasText(row.reason) && ['match', 'not-published-confirmed'].includes(row.conclusion), 'INVALID_COMPARISON', '比較行には重複しないtarget、確認者、日時、理由、合格する結論が必要です。');
      targets.add(row.target);
      const expected = expectedTargets.get(row.target);
      requireValue(expected && (expected.type === 'note' ? row.text === expected.text : row.label === expected.label && row.value === expected.value) && JSON.stringify(row.sourceIds) === JSON.stringify(expected.sourceIds), 'INVALID_COMPARISON', '比較targetの項目名・値・注記本文・出典IDが候補と一致しません。');
      if (expected.status === 'unpublished') requireValue(row.conclusion === 'not-published-confirmed', 'INVALID_COMPARISON', '未公表行は公式確認によるnot-published-confirmedとして記録してください。');
      requireValue(Array.isArray(row.sourceIds) && row.sourceIds.length > 0 && row.sourceIds.every(id => sources.has(id)) && Array.isArray(row.officialEvidence) && row.officialEvidence.length > 0, 'INVALID_COMPARISON', '比較行には原典IDと公式資料の引用箇所が必要です。');
      requireValue(row.value !== undefined || hasText(row.text), 'INVALID_COMPARISON', '比較対象のvalueまたはtextが必要です。');
      for (const evidence of row.officialEvidence) requireValue(row.sourceIds.includes(evidence.sourceId) && evidence.url === sources.get(evidence.sourceId)?.url && hasText(evidence.page) && hasText(evidence.officialQuote) && validDate(evidence.checkedAt), 'INVALID_COMPARISON', '公式の根拠には原典ID・同一URL・ページ/節・短い引用・確認日時が必要です。');
      requireValue(row.sourceIds.every(id => row.officialEvidence.some(evidence => evidence.sourceId === id)), 'INVALID_COMPARISON', '行の各出典IDに対応する公式根拠が必要です。');
    }
    requireValue(targets.size === expectedTargets.size, 'INVALID_COMPARISON', '比較記録が候補の全行・全注記を網羅していません。');
    requireValue(Date.parse(comparison.reviewedAt) <= now() && comparison.comparisons.every(row => Date.parse(row.checkedAt) <= Date.parse(comparison.reviewedAt) && row.officialEvidence.every(evidence => Date.parse(evidence.checkedAt) <= Date.parse(comparison.reviewedAt))), 'INVALID_COMPARISON', '公式再照合の行・根拠の確認日時が最終確認日時より後、または未来になっています。');
    return comparison;
  }
  async function verifyEvidence(evidence, candidate, item, label) {
    requireValue(evidence?.passed === true && evidence.httpStatus === 200 && validUrl(evidence.url) && isCommit(evidence.commit) && validDate(evidence.checkedAt) && isHash(evidence.tableHash), 'MISSING_VERIFICATION', `${label}には成功した公開GET、URL、40桁commit、確認日時、tableHashが必要です。`);
    const target = new URL(evidence.url);
    requireValue(target.pathname === item.path && !target.search && !target.hash && !target.username && !target.password, 'WRONG_VERIFICATION_PAGE', `${label}のURLが担当大学ページと一致しません。`);
    requireValue(target.origin === (label === 'staging' ? 'https://staging.lexus-ec.pages.dev' : 'https://lexus-ec.com'), 'WRONG_VERIFICATION_ENVIRONMENT', `${label}は指定された公開環境のHTTPS URLを記録してください。`);
    requireValue(sameFile(evidence.candidateFile, candidate.file) && evidence.candidateSha256?.toLowerCase() === candidate.sha256.toLowerCase(), 'CANDIDATE_MISMATCH', `${label}の候補ファイル・hashが一致しません。`);
    requireValue(Array.isArray(evidence.checks) && evidence.checks.length > 0 && evidence.checks.every(check => hasText(check.id) && check.passed === true) && Array.isArray(evidence.failedChecks) && evidence.failedChecks.length === 0 && isHash(evidence.responseHash), 'FAILED_VERIFICATION', `${label}には全checks成功・空のfailedChecks・GET応答hashが必要です。`);
    requireValue(Date.parse(evidence.checkedAt) <= now(), 'INVALID_VERIFICATION_DATE', `${label}の確認日時が未来になっています。`);
    await verifyScreenshot(evidence.pc, `${label} PC`); await verifyScreenshot(evidence.mobile, `${label} スマートフォン`);
    requireValue(!sameFile(evidence.pc.screenshotFile, evidence.mobile.screenshotFile), 'MISSING_VERIFICATION', 'PCとスマートフォンは別スクリーンショットにしてください。');
    const comparison = await verifyComparison(evidence.officialComparison, candidate, item, label);
    if (label === 'staging') requireValue(Date.parse(comparison.reviewedAt) >= Date.parse(evidence.checkedAt) && comparison.comparisons.every(row => Date.parse(row.checkedAt) >= Date.parse(evidence.checkedAt) && row.officialEvidence.every(proof => Date.parse(proof.checkedAt) >= Date.parse(evidence.checkedAt))), 'INVALID_COMPARISON', '公式再照合はstagingの公開GET確認後に実施してください。');
  }
  async function verifyPublication(item) {
    requireValue(item.candidate && hasText(item.candidate.file) && isHash(item.candidate.sha256) && isCommit(item.commit), 'MISSING_VERIFICATION', 'candidateのfile/sha256と本番40桁commitが必要です。');
    requireValue(validDate(item.stagingVerifiedAt) && validDate(item.mainPublishedAt) && Date.parse(item.mainPublishedAt) >= Date.parse(item.stagingVerifiedAt) && Date.parse(item.mainPublishedAt) <= now(), 'INVALID_PUBLICATION_SEQUENCE', 'staging-verified成功後のmain-published記録が必要です。');
    await verifyArtifact(item.candidate.file, item.candidate.sha256, '公開候補');
    await verifyEvidence(item.stagingEvidence, item.candidate, item, 'staging');
    await verifyEvidence(item.mainEvidence, item.candidate, item, 'main');
    requireValue(item.mainEvidence.commit.toLowerCase() === item.commit.toLowerCase(), 'COMMIT_MISMATCH', '本番commitとmainEvidence.commitが一致しません。');
    requireValue(item.stagingEvidence.tableHash.toLowerCase() === item.mainEvidence.tableHash.toLowerCase(), 'TABLE_HASH_MISMATCH', 'stagingとmainの公開表が同一ではありません。');
    requireValue(Date.parse(item.mainEvidence.checkedAt) >= Date.parse(item.stagingEvidence.checkedAt), 'INVALID_VERIFICATION_DATE', '本番確認がstaging確認より前になっています。');
    requireValue(Date.parse(item.mainEvidence.checkedAt) >= Date.parse(item.mainPublishedAt), 'INVALID_PUBLICATION_SEQUENCE', 'main-published記録後に本番公開URLを新しくGETして確認してください。');
    requireValue(new URL(item.mainEvidence.url).origin === 'https://lexus-ec.com' && new URL(item.stagingEvidence.url).origin !== 'https://lexus-ec.com', 'WRONG_VERIFICATION_ENVIRONMENT', 'mainはhttps://lexus-ec.com、stagingはそれ以外の公開URLを記録してください。');
  }
  async function requireActive(worker, item, assignedData) {
    const { record } = await reconcileWorker(worker, assignedData);
    requireValue(record.currentSlug === item.slug || (!record.currentSlug && item.startedAt && !TERMINAL.has(item.state) && item.state !== 'pending'), 'NOT_CURRENT', 'まずnextで選ばれた大学だけを更新してください。');
    return record;
  }
  function patched(item, patch) {
    requireValue(patch && typeof patch === 'object' && !Array.isArray(patch), 'INVALID_PATCH', '更新JSONはobjectにしてください。');
    const reserved = ['version', 'slug', 'worker', 'name', 'path', 'createdAt', 'history', 'publishedAt', 'lastPublishedAt', 'nextEligibleAt', 'startedAt', 'stagingVerifiedAt', 'mainPublishedAt'];
    requireValue(!reserved.some(key => Object.hasOwn(patch, key)), 'RESERVED_FIELD', '担当・履歴・公開時刻などの管理フィールドは直接変更できません。');
    return { ...item, ...patch };
  }
  function transition(item, state, event, previousState = item.state) {
    const updatedAt = stamp();
    return { ...item, state, createdAt: item.createdAt || updatedAt, updatedAt, history: [...(item.history || []), { at: updatedAt, from: previousState, to: state, event }] };
  }

  async function next({ worker }) {
    const assignedData = await assigned(worker);
    const { record, items } = await reconcileWorker(worker, assignedData);
    const active = items.filter(item => item.state !== 'pending' && !TERMINAL.has(item.state));
    requireValue(active.length <= 1, 'MULTIPLE_ACTIVE_ITEMS', '同じworkerに複数の進行中大学があります。状態を確認してください。');
    const running = record.currentSlug ? items.find(item => item.slug === record.currentSlug) : active[0];
    if (running && !TERMINAL.has(running.state) && running.state !== 'pending') {
      record.currentSlug = running.slug; await saveWorker(record);
      return { action: 'resume', worker, item: running, university: assignedData.universities.get(running.slug), remainingMs: 0 };
    }
    record.currentSlug = null;
    const remainingMs = validDate(record.nextEligibleAt) ? Math.max(0, Date.parse(record.nextEligibleAt) - now()) : 0;
    if (remainingMs > 0) { await saveWorker(record); return { action: 'wait', worker, remainingMs, nextEligibleAt: record.nextEligibleAt, item: null, newUniversityStarted: false }; }
    const pending = items.find(item => item.state === 'pending');
    if (!pending) {
      await saveWorker(record);
      return { action: 'complete', worker, item: null, remainingMs: 0, counts: { published: items.filter(item => item.state === 'published').length, deferred: items.filter(item => item.state === 'deferred').length } };
    }
    const item = transition({ ...pending, startedAt: stamp() }, 'researching', 'next selected this university');
    await writeJson(itemFile(item.slug), item); record.currentSlug = item.slug; await saveWorker(record);
    return { action: 'start', worker, item, university: assignedData.universities.get(item.slug), remainingMs: 0, newUniversityStarted: true };
  }
  async function status({ worker, slug } = {}) {
    if (worker === undefined) { const data = await manifest(); return { manifest: data.document, publishLock: withoutToken(await currentLock()) }; }
    const assignedData = await assigned(worker, slug); const { record, items } = await reconcileWorker(worker, assignedData);
    return { worker: record, item: slug ? items.find(item => item.slug === slug) : null, assignedItems: slug ? undefined : items, publishLock: withoutToken(await currentLock()) };
  }
  async function update({ worker, slug, patch }) {
    requireValue(hasText(slug), 'INVALID_ARGUMENT', '更新する大学のslugが必要です。');
    const assignedData = await assigned(worker, slug); const previous = await readItem(assignedData.university);
    requireValue(previous.state !== 'published', 'ITEM_ALREADY_PUBLISHED', '公開確認済みの記録は上書きできません。新年度は別manifest/状態領域で管理してください。');
    let item = patched(previous, patch); const state = item.state || previous.state;
    requireValue(STATES.includes(state) && state !== 'published', 'INVALID_TRANSITION', 'publishedはpublishedコマンドでのみ記録できます。');
    let record;
    if (state === 'deferred') {
      requireValue(hasText(item.deferredReason) && Array.isArray(item.deferredEvidence) && item.deferredEvidence.length > 0, 'MISSING_DEFERRAL_EVIDENCE', '保留にはdeferredReasonとdeferredEvidenceが必要です。');
      for (const evidence of item.deferredEvidence) requireValue((validUrl(evidence.url) || hasText(evidence.file)) && validDate(evidence.checkedAt) && hasText(evidence.summary), 'MISSING_DEFERRAL_EVIDENCE', '保留の根拠には公式URL/ファイル、確認日時、要再調査の説明が必要です。');
      if (item.nextReviewAt !== undefined && item.nextReviewAt !== null) requireValue(validDate(item.nextReviewAt), 'INVALID_DEFERRAL_DATE', 'nextReviewAtは日時またはnullにしてください。');
      record = (await reconcileWorker(worker, assignedData)).record; item.deferredAt = stamp();
    } else if (state === 'pending' && previous.state === 'deferred') record = (await reconcileWorker(worker, assignedData)).record;
    else record = await requireActive(worker, previous, assignedData);
    if (state === 'staging-verified') {
      requireValue(item.candidate, 'MISSING_VERIFICATION', '候補記録が必要です。'); await verifyArtifact(item.candidate.file, item.candidate.sha256, '公開候補');
      await verifyEvidence(item.stagingEvidence, item.candidate, item, 'staging');
      item.stagingVerifiedAt = stamp();
    }
    if (state === 'main-published') {
      requireValue(['staging-verified', 'main-published'].includes(previous.state), 'INVALID_TRANSITION', 'main-publishedはstaging-verified成功後にだけ記録できます。');
      requireValue(sameFile(previous.candidate?.file, item.candidate?.file) && previous.candidate?.sha256?.toLowerCase() === item.candidate?.sha256?.toLowerCase(), 'CANDIDATE_MISMATCH', 'mainへ移す候補はstaging-verified時と同じファイル・SHA-256にしてください。');
      requireValue(isCommit(item.commit), 'MISSING_VERIFICATION', 'main-publishedには本番40桁commitが必要です。');
      await verifyArtifact(item.candidate.file, item.candidate.sha256, '公開候補'); await verifyEvidence(item.stagingEvidence, item.candidate, item, 'staging');
      item.mainPublishedAt = previous.state === 'main-published' && previous.commit === item.commit ? previous.mainPublishedAt : stamp();
    }
    if (state === 'main-verified') {
      requireValue(['main-published', 'main-verified'].includes(previous.state), 'INVALID_TRANSITION', 'main-verifiedはmain-published記録後にだけ設定できます。');
      requireValue(sameFile(previous.candidate?.file, item.candidate?.file) && previous.candidate?.sha256?.toLowerCase() === item.candidate?.sha256?.toLowerCase() && previous.commit === item.commit, 'CANDIDATE_MISMATCH', 'main-published時の候補と本番commitを変更せず確認してください。');
      await verifyPublication(item);
    }
    item = transition(item, state, 'update', previous.state); await writeJson(itemFile(slug), item);
    if (TERMINAL.has(state) || state === 'pending') { if (record.currentSlug === slug) record.currentSlug = null; } else record.currentSlug = slug;
    await saveWorker(record); return { updated: true, item, worker: record };
  }
  async function acquirePublishLock({ worker, slug }) {
    requireValue(hasText(slug), 'INVALID_ARGUMENT', '公開する大学のslugが必要です。');
    await assigned(worker, slug); await fs.mkdir(directory, { recursive: true });
    try { await fs.mkdir(lockDirectory); }
    catch (error) { if (error.code === 'EEXIST') return { acquired: false, reason: 'busy', owner: withoutToken(await currentLock()) }; throw error; }
    const lease = { version: 1, token: crypto.randomBytes(32).toString('hex'), worker, slug, acquiredAt: stamp(), pid: process.pid, policy: 'No automatic expiration or timeout release; exact owner token is required.' };
    try { await fs.writeFile(lockFile, `${JSON.stringify(lease, null, 2)}\n`, { flag: 'wx' }); }
    catch (error) { await fs.rmdir(lockDirectory).catch(() => {}); throw error; }
    return { acquired: true, ...lease };
  }
  async function releasePublishLock({ token }) {
    const lease = await currentLock();
    if (!lease) return { released: false, reason: 'not-held' };
    requireValue(hasText(token) && token === lease.token, 'LOCK_TOKEN_MISMATCH', '所有者tokenが一致しないため公開ロックを解除できません。');
    // Non-recursive deletion: only the verified owner's metadata and empty lock dir.
    await fs.unlink(lockFile); await fs.rmdir(lockDirectory);
    return { released: true, owner: withoutToken(lease) };
  }
  async function published({ worker, slug, patch = {}, token }) {
    requireValue(hasText(slug), 'INVALID_ARGUMENT', '公開確認した大学のslugが必要です。');
    const assignedData = await assigned(worker, slug); const previous = await readItem(assignedData.university);
    if (previous.state === 'published') return { published: true, alreadyPublished: true, item: previous, worker: (await reconcileWorker(worker, assignedData)).record };
    const lease = await currentLock();
    requireValue(lease && lease.token === token && lease.worker === worker && lease.slug === slug, 'PUBLISH_LOCK_REQUIRED', '担当大学の公開ロック所有者tokenが必要です。');
    const record = await requireActive(worker, previous, assignedData); let item = patched(previous, patch);
    requireValue(previous.state === 'main-verified', 'INVALID_TRANSITION', 'publishedはstaging-verified → main-published → main-verifiedを終えてから記録してください。');
    requireValue(sameFile(previous.candidate?.file, item.candidate?.file) && previous.candidate?.sha256?.toLowerCase() === item.candidate?.sha256?.toLowerCase() && previous.commit === item.commit, 'CANDIDATE_MISMATCH', 'main-verified時の候補と本番commitは変更できません。');
    await verifyPublication(item); item = transition(item, 'published', 'staging + main + official comparison verified', previous.state); item.publishedAt = stamp();
    await writeJson(itemFile(slug), item);
    record.currentSlug = null; record.lastPublishedAt = item.publishedAt; record.nextEligibleAt = new Date(now() + COOLDOWN_MS).toISOString(); await saveWorker(record);
    return { published: true, alreadyPublished: false, item, worker: record, remainingMs: COOLDOWN_MS, lockMustStillBeReleased: true };
  }
  return { next, status, update, published, acquirePublishLock, releasePublishLock };
}

function parseArgs(argv) {
  const positionals = [], options = {};
  for (let index = 0; index < argv.length; index++) {
    const value = argv[index];
    if (!value.startsWith('--')) { positionals.push(value); continue; }
    const [key, inline] = value.slice(2).split('=', 2);
    options[key] = inline ?? argv[++index];
    requireValue(options[key] !== undefined && !String(options[key]).startsWith('--'), 'INVALID_ARGUMENT', `${key}には値が必要です。`);
  }
  return { positionals, options };
}
export async function runCli(argv = process.argv.slice(2)) {
  const { positionals, options } = parseArgs(argv); const command = positionals[0];
  const worker = options.worker === undefined ? undefined : Number(options.worker);
  const api = createWorkflow({ workspaceDir: options.workspace || workspaceDefault, stateDir: options['state-dir'] || undefined });
  if (command === 'next') return api.next({ worker });
  if (command === 'status') return api.status({ worker, slug: options.slug });
  if (command === 'publish-lock' && positionals[1] === 'acquire') return api.acquirePublishLock({ worker, slug: options.slug });
  if (command === 'publish-lock' && positionals[1] === 'release') return api.releasePublishLock({ token: options.token });
  if (['update', 'published', 'defer'].includes(command)) {
    const patch = options.file ? await readJson(path.resolve(options.file)) : {};
    if (command === 'defer') patch.state = 'deferred';
    if (command === 'published') return api.published({ worker, slug: options.slug, patch, token: options.token });
    requireValue(options.file, 'INVALID_ARGUMENT', '更新するJSONの--fileを指定してください。');
    return api.update({ worker, slug: options.slug, patch });
  }
  throw new WorkflowError('INVALID_COMMAND', 'next/status/update/defer/published/publish-lock acquire|release を指定してください。');
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify({ ok: true, ...(await runCli()) }, null, 2)); }
  catch (error) { console.log(JSON.stringify({ ok: false, error: { code: error.code || 'UNEXPECTED_ERROR', message: error.message, ...(error.details ? { details: error.details } : {}) } }, null, 2)); process.exitCode = 1; }
}
