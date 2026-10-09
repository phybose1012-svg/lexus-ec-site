/** Local continuation decisions only: no automation, Git, deployment or network actions. */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const LIMITS = Object.freeze({ noProgressWakes: 3, repeatedErrorWakes: 2, sameUniversityWakes: 3 });
const TERMINAL = new Set(['published', 'deferred']);
const ACTIVE = new Set(['researching', 'draft', 'staging-published', 'staging-verified', 'main-published', 'main-verified']);
const hasText = value => typeof value === 'string' && Boolean(value.trim());
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const isCommit = value => typeof value === 'string' && /^[a-f0-9]{40}$/i.test(value);
const iso = value => hasText(value) && Number.isFinite(Date.parse(value));
const volatileKeys = /^(?:history|updatedAt|createdAt|startedAt|checkedAt|retrievedAt|fetchedAt|generatedAt|verifiedAt|reviewedAt|modifiedAt|inspectedAt|requestedAt|lastCheckedAt|timestamp|mtime|pid|elapsed|elapsedMs|duration|durationMs|runtime|responseHash|htmlHash|candidateSha256|candidateFile|screenshotFile|dataHash|draftSha256|sha256)$/i;
const ignoredName = /(?:inspect|probe|diagnos|report|progress|coordination|resume[-_]?state|state[-_]?patch|(?:^|[-_])patch(?:[-_.]|$)|(?:^|[-_])build(?:[-_.]|$)|capture|draft-transformed|draft-admissions-fragment)/i;
const allowedExtension = new Set(['.json', '.pdf', '.html', '.htm', '.txt', '.md', '.png', '.jpg', '.jpeg', '.webp']);

export class GuardError extends Error { constructor(code, message) { super(message); this.code = code; } }
const insist = (test, code, message) => { if (!test) throw new GuardError(code, message); };
async function readJson(file, fallback) {
  try { return JSON.parse((await fs.readFile(file, 'utf8')).replace(/^\uFEFF/, '')); }
  catch (error) { if (error.code === 'ENOENT' && fallback !== undefined) return fallback; throw new GuardError('READ_FAILED', `${file}: ${error.message}`); }
}
async function atomicJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  try { await fs.rename(temporary, file); }
  catch (error) { await fs.unlink(temporary).catch(() => {}); throw error; }
}
export function meaningful(value) {
  if (Array.isArray(value)) return value.map(meaningful);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).filter(key => !volatileKeys.test(key)).sort().map(key => [key, meaningful(value[key])]));
  return value;
}
function pngContent(bytes) {
  if (bytes.length < 8 || bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') return bytes;
  const parts = [bytes.subarray(0, 8)];
  for (let offset = 8; offset + 12 <= bytes.length;) {
    const length = bytes.readUInt32BE(offset), end = offset + length + 12;
    if (end > bytes.length) return bytes;
    const type = bytes.subarray(offset + 4, offset + 8).toString('ascii');
    if (!['tIME', 'tEXt', 'iTXt', 'zTXt'].includes(type)) parts.push(bytes.subarray(offset, end));
    offset = end;
  }
  return Buffer.concat(parts);
}
function contentDigest(bytes, extension) {
  if (extension === '.json') {
    try { return hash(JSON.stringify(meaningful(JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, ''))))); }
    catch { return hash(bytes); }
  }
  if (['.txt', '.md', '.html', '.htm'].includes(extension)) {
    let text = bytes.toString('utf8').replace(/\r\n?/g, '\n');
    // Official dates in prose remain intact. Only generated metadata lines/scripts are ignored.
    text = text.replace(/^\s*(?:updatedAt|generatedAt|checkedAt|inspectedAt|最終更新日時|生成日時)\s*[:：].*$/gmi, '');
    if (['.html', '.htm'].includes(extension)) text = text.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
    return hash(text.trim());
  }
  return hash(extension === '.png' ? pngContent(bytes) : bytes);
}
const repairFor = text => /dnc\.ac\.jp|source host|domain-validation|nationalSourceValidation|大学入試センター|公式出典.*拒否/.test(text) ? 'nationalSourceValidation' : /mobile|layout|overflow|スマホ|モバイル|共通CSS|shared-layout/i.test(text) ? 'mobileAdmissionTables' : null;
function stableError(value) { return String(value || '').replace(/\d{4}-\d{2}-\d{2}T[^\s]+/g, '<time>').replace(/0x[a-f0-9]+/gi, '<address>').trim(); }

export function createGuard({ workspaceDir = DEFAULT_ROOT, stateDir = path.join(workspaceDir, 'reports/university-admissions'), now = () => Date.now() } = {}) {
  const workspace = path.resolve(workspaceDir), directory = path.resolve(stateDir);
  const guardFile = worker => path.join(directory, 'guards', `worker-${worker}.json`);
  const stamp = () => new Date(now()).toISOString();
  const resolveFile = file => path.isAbsolute(file) ? path.resolve(file) : path.resolve(workspace, file);
  function shownFile(file) { const relative = path.relative(workspace, file); return relative && !relative.startsWith('..') && !path.isAbsolute(relative) ? relative.replaceAll('\\', '/') : file.replaceAll('\\', '/'); }

  async function snapshot(worker) {
    insist(Number.isInteger(worker) && worker >= 1 && worker <= 4, 'INVALID_WORKER', 'workerは1〜4で指定してください。');
    const manifest = await readJson(path.join(directory, 'manifest.json'));
    const assignment = manifest.workers?.find(entry => entry.id === worker);
    insist(manifest.version === 1 && assignment && Array.isArray(assignment.slugs) && assignment.slugs.length > 0, 'INVALID_MANIFEST', 'manifestのworker担当を確認してください。');
    insist(new Set(assignment.slugs).size === assignment.slugs.length && assignment.slugs.every(slug => typeof slug === 'string' && /^[a-z0-9][a-z0-9_-]*$/.test(slug)), 'INVALID_MANIFEST', '担当slugは安全な重複しない値にしてください。');
    const profiles = new Map((manifest.universities || []).map(entry => [entry.slug, entry]));
    const items = [];
    for (const slug of assignment.slugs) {
      insist(profiles.get(slug)?.worker === worker, 'INVALID_MANIFEST', '大学の担当とworkerリストが一致しません。');
      const item = await readJson(path.join(directory, 'items', `${slug}.json`), { slug, worker, state: 'pending' });
      insist(item.slug === slug && item.worker === worker && (item.state === 'pending' || ACTIVE.has(item.state) || TERMINAL.has(item.state)), 'INVALID_ITEM', '大学状態の担当またはstateが不正です。');
      items.push(item);
    }
    const workerState = await readJson(path.join(directory, 'workers', `${worker}.json`), { worker, currentSlug: null });
    const active = items.filter(item => ACTIVE.has(item.state));
    insist(active.length <= 1, 'MULTIPLE_ACTIVE_ITEMS', '1担当で複数大学が進行中です。root確認が必要です。');
    const current = active[0] || items.find(item => item.state === 'pending') || null;
    if (workerState.currentSlug) insist(assignment.slugs.includes(workerState.currentSlug), 'INVALID_WORKER_STATE', 'currentSlugが担当外です。');
    const counts = { assigned: items.length, published: items.filter(item => item.state === 'published').length, deferred: items.filter(item => item.state === 'deferred').length, pending: items.filter(item => item.state === 'pending').length, active: active.length };
    const bootstrap = await readJson(path.join(directory, 'bootstrap.json'), {});
    const dependencyState = await readJson(path.join(directory, 'continuation-dependencies.json'), { blockers: [] });
    const repairs = Object.fromEntries(Object.entries(bootstrap.sharedRepairs || {}).filter(([, repair]) => repair?.status === 'ready' && isCommit(repair.stagingCommit) && isCommit(repair.mainCommit) && iso(repair.verifiedAt)).map(([key, repair]) => [key, { ...repair, signature: hash(`${key}|${repair.stagingCommit}|${repair.mainCommit}|${repair.verifiedAt}`) }]));
    const artifactPaths = new Set(), directoryPaths = new Set(), errors = [], blockers = [], artifacts = [], artifactDocuments = [];
    const addBlock = (id, reason, sourceAt, file, repairKey = repairFor(`${id} ${reason}`), retryable = false) => blockers.push({ id, reason, sourceAt: iso(sourceAt) ? sourceAt : null, ...(file ? { file } : {}), repairKey, retryable, resumeCondition: repairKey ? `rootが${repairKey}の修正をstaging/mainへ公開・確認し、明示resumeした後に実ページを再検証する。` : '原因を解消し根拠を保存してから、rootまたはユーザーの明示resumeで同じ大学を再開する。' });
    if (current) {
      const worktreeRoot = current.worktreeRoot || current.worktree || current.worktreePath;
      const resolveItemFile = file => /^frontend[\\/]/.test(file) && hasText(worktreeRoot) ? path.resolve(resolveFile(worktreeRoot), file) : resolveFile(file);
      const walkReferences = (value, key = '') => {
        if (/^planned|^destination$/i.test(key)) return;
        if (typeof value === 'string') {
          if (/(?:file|files|evidence|researchFiles)$/i.test(key) && !/^https?:\/\//i.test(value) && allowedExtension.has(path.extname(value).toLowerCase())) artifactPaths.add(resolveItemFile(value));
          if (/director(?:y|ies)$/i.test(key)) directoryPaths.add(resolveFile(value));
        } else if (Array.isArray(value)) value.forEach(entry => walkReferences(entry, key));
        else if (value && typeof value === 'object') for (const [childKey, entry] of Object.entries(value)) walkReferences(entry, childKey);
      };
      walkReferences(current);
      directoryPaths.add(path.join(directory, current.slug)); directoryPaths.add(path.join(directory, 'research', current.slug));
      for (const value of [current.failure, current.error, current.lastError, current.continuation?.error]) {
        if (!value || value.resolved === true || value.status === 'resolved') continue;
        const reason = typeof value === 'string' ? value : value.message || value.summary || value.reason || value.code;
        if (hasText(reason)) addBlock(value.id || value.code || value.stage || 'explicit-failure', stableError(reason), value.at || value.checkedAt || current.updatedAt, value.evidence || value.file, repairFor(`${value.stage || ''} ${reason}`), value.retryable === true);
      }
      for (const dependency of [...(Array.isArray(current.dependencies) ? current.dependencies : []), ...(Array.isArray(current.blockers) ? current.blockers : []), ...(Array.isArray(current.sharedDependencies) ? current.sharedDependencies : [])]) {
        if (dependency?.resolved === true || ['ready', 'resolved'].includes(dependency?.status)) continue;
        const reason = typeof dependency === 'string' ? dependency : dependency.reason || dependency.message || dependency.summary;
        if (hasText(reason)) addBlock(dependency.id || 'shared-dependency', reason, dependency.checkedAt || dependency.at || current.updatedAt, dependency.file, dependency.repairKey || repairFor(reason));
      }
      if (current.pendingCommonFix && current.pendingCommonFix.readyToPublish !== true) addBlock('pending-common-fix', current.pendingCommonFix.summary || 'root共通修正待ち', current.pendingCommonFix.checkedAt || current.updatedAt, current.pendingCommonFix.proposedCssFile, 'mobileAdmissionTables');
      const waiting = [current.waitingFor, current.currentStage, current.resumeStage, current.resumeFrom, current.publicationPendingReason].filter(hasText).join(' ');
      if (/shared.*(?:fix|repair)|awaiting-shared|common.*fix|共通.*(?:不具合|修正)/i.test(waiting)) addBlock('awaiting-shared-repair', waiting, current.updatedAt, current.sharedLayoutIssueFile || current.localLayoutIssue, repairFor(waiting));
      if (['draft', 'staging-published', 'staging-verified', 'main-published', 'main-verified'].includes(current.state) && bootstrap.status !== 'ready') addBlock('bootstrap-not-ready', '共通公開基盤がreadyではありません。調査結果を保存し、rootの基盤完成後に再開します。', bootstrap.createdAt, 'reports/university-admissions/bootstrap.json');
    }
    for (const dependency of Array.isArray(dependencyState.blockers) ? dependencyState.blockers : []) {
      if (['ready', 'resolved'].includes(dependency.status) || dependency.resolved === true) continue;
      if (dependency.affectedWorkers?.length && !dependency.affectedWorkers.includes(worker)) continue;
      if (dependency.affectedSlugs?.length && !dependency.affectedSlugs.includes(current?.slug)) continue;
      addBlock(dependency.id || 'shared-dependency', dependency.reason || '未解消の共通依存', dependency.checkedAt || dependency.openedAt, dependency.evidenceFile, dependency.repairKey);
    }
    const scan = async folder => {
      let entries; try { entries = await fs.readdir(folder, { withFileTypes: true }); } catch (error) { if (error.code !== 'ENOENT') errors.push({ file: shownFile(folder), reason: error.message }); return; }
      for (const entry of entries) {
        if (entry.isSymbolicLink()) continue;
        const file = path.join(folder, entry.name);
        if (entry.isDirectory()) { if (!['node_modules', '.git', 'guards', 'publish.lock'].includes(entry.name)) await scan(file); }
        else if (entry.isFile() && allowedExtension.has(path.extname(entry.name).toLowerCase()) && !ignoredName.test(entry.name)) artifactPaths.add(file);
      }
    };
    for (const folder of directoryPaths) {
      // Directory traversal is confined to the common report root; file references may point to a worker candidate.
      const relative = path.relative(directory, folder);
      if (!relative.startsWith('..') && !path.isAbsolute(relative)) await scan(folder);
    }
    for (const file of [...artifactPaths].sort()) {
      if (ignoredName.test(path.basename(file)) || !allowedExtension.has(path.extname(file).toLowerCase())) continue;
      try {
        const stat = await fs.stat(file); if (!stat.isFile()) continue;
        const bytes = await fs.readFile(file), extension = path.extname(file).toLowerCase(); let ignoredOutput = false;
        if (extension === '.json') {
          try {
            const value = JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, ''));
            const ignoredInspection = value.inspectionOnly === true || /^(?:inspection|inspect|progress-report|status-report|report-summary)$/.test(value.kind || '');
            artifactDocuments.push({ file: shownFile(file), value, modifiedAt: stat.mtime.toISOString(), ignoredInspection });
            ignoredOutput = ignoredInspection || value.diagnosticOnly === true;
          } catch {}
        }
        if (!ignoredOutput) artifacts.push({ file: shownFile(file), contentHash: contentDigest(bytes, extension), bytes: stat.size, modifiedAt: stat.mtime.toISOString() });
      } catch (error) { errors.push({ file: shownFile(file), reason: error.code || error.message }); }
    }
    for (const document of artifactDocuments) {
      if (document.ignoredInspection) continue;
      const value = document.value;
      if (value.passed === false && value.resolved !== true && value.status !== 'resolved' && (hasText(value.error) || value.failedChecks?.length || value.errors?.length)) {
        const reason = value.error || JSON.stringify(value.failedChecks || value.errors);
        addBlock('verification-failed', reason, value.checkedAt || value.verifiedAt || document.modifiedAt, document.file, repairFor(reason), value.retryable === true);
      }
      if (/requires-shared|awaiting-shared/.test(value.status || '') && value.resolved !== true) addBlock('shared-evidence-failure', value.rootCause || value.summary || value.status, value.checkedAt || document.modifiedAt, document.file, repairFor(JSON.stringify(value)));
    }
    if (errors.length) addBlock('evidence-unreadable', '参照している根拠ファイルを読めません。missing/rejected fileを解消してください。', stamp(), errors[0].file);
    // A generic root-resume label inherits its concrete common dependencies; it is not an unrelated failure.
    for (const blocker of blockers.filter(entry => entry.id === 'awaiting-shared-repair' && !entry.repairKey)) {
      const keys = new Set(blockers.filter(entry => entry !== blocker && entry.repairKey).map(entry => entry.repairKey));
      for (const entry of blockers) {
        if (/mobile|layout|スマホ|モバイル|共通CSS/i.test(entry.reason)) keys.add('mobileAdmissionTables');
        if (/dnc\.ac\.jp|nationalSourceValidation|大学入試センター/.test(entry.reason)) keys.add('nationalSourceValidation');
      }
      blocker.repairKeys = keys.size ? [...keys].sort() : ['mobileAdmissionTables', 'nationalSourceValidation'];
      if (blocker.repairKeys.length === 1) blocker.repairKey = blocker.repairKeys[0];
      blocker.resumeCondition = `rootが${blocker.repairKeys.join(' / ')}の共通修正を公開・確認し、明示resume後に一度だけ再検証する。`;
    }
    const semanticItem = current ? {
      slug: current.slug, state: current.state, commit: current.commit || null,
      proofs: meaningful({ staging: current.stagingEvidence || null, main: current.mainEvidence || null }),
      localChecks: meaningful({ localBuildPassed: current.localBuildPassed, localPcPassed: current.localPcPassed, localMobilePassed: current.localMobilePassed, localValidation: current.localValidation, localVerification: current.localVerification }),
    } : null;
    const content = { assignment: items.map(item => ({ slug: item.slug, state: item.state, commit: item.commit || null })), item: semanticItem, artifacts: [...new Set(artifacts.map(entry => entry.contentHash))].sort() };
    return { worker, automationId: assignment.automationId || null, threadId: assignment.threadId || null, currentSlug: current?.slug || null, itemState: current?.state || null, counts, completed: counts.published + counts.deferred === counts.assigned, waitingMs: !active.length && iso(workerState.nextEligibleAt) ? Math.max(0, Date.parse(workerState.nextEligibleAt) - now()) : 0, fingerprint: hash(JSON.stringify(meaningful(content))), evidence: { artifactCount: artifacts.length, newestResearchFile: artifacts.filter(entry => /[\\/]research[\\/]/.test(entry.file)).sort((a, b) => Date.parse(b.modifiedAt) - Date.parse(a.modifiedAt))[0] || null, artifacts, readErrors: errors }, blockers, repairs };
  }
  function automation(record, sample) { return { required: record.paused === true, id: sample?.automationId || record.automationId || null, threadId: sample?.threadId || record.threadId || null, requestedStatus: record.paused ? 'PAUSED' : null, performedByGuard: false }; }
  function result(record, sample) { return { ok: true, action: record.paused ? 'pause' : record.action || 'continue', category: record.category || 'progress', reason: record.reason, worker: record.worker, currentSlug: record.currentSlug, counts: sample?.counts || record.counts, fingerprint: sample?.fingerprint || record.fingerprint, meaningfulChanged: record.meaningfulChanged === true, wakeAttempts: record.wakeAttempts || 0, noProgressWakes: record.noProgressWakes || 0, repeatedErrorWakes: record.repeatedErrorWakes || 0, limits: LIMITS, remainingMs: sample?.waitingMs || 0, resumeCondition: record.resumeCondition || null, automationPause: automation(record, sample), stateFile: shownFile(guardFile(record.worker)), evidence: sample?.evidence || record.evidence, blockers: record.blockers || [], repairRevalidation: record.repairRevalidation || null }; }
  function pause(record, category, reason, condition, sample) {
    record.paused = true; record.action = 'pause'; record.category = category; record.reason = reason; record.resumeCondition = condition; record.pausedAt = stamp();
    record.history = [...(record.history || []), { at: stamp(), action: 'pause', category, reason }].slice(-50);
    if (sample) record.blockers = sample.blockers;
  }
  function concludeAttempt(record, sample) {
    const attempt = record.currentAttempt;
    if (!attempt || attempt.finished) return;
    const changed = attempt.changed || attempt.startFingerprint !== sample.fingerprint;
    record.noProgressWakes = changed ? 0 : (record.noProgressWakes || 0) + 1;
    attempt.finished = true; attempt.finishedAt = stamp(); attempt.changed = changed;
  }
  async function check({ worker, phase = 'wake', attemptId } = {}) {
    insist(Number.isInteger(worker) && worker >= 1 && worker <= 4, 'INVALID_WORKER', 'workerは1〜4で指定してください。');
    insist(['wake', 'checkpoint', 'finish'].includes(phase), 'INVALID_PHASE', 'phaseはwake/checkpoint/finishで指定してください。');
    let record = await readJson(guardFile(worker), { version: 1, worker, paused: false, wakeAttempts: 0, noProgressWakes: 0, repeatedErrorWakes: 0, consumedRepairs: {}, history: [] });
    let sample;
    try { sample = await snapshot(worker); }
    catch (error) { pause(record, 'blocked', error.message, '台帳・参照ファイルの異常を修正し、rootまたはユーザーが明示resumeする。'); record.checkedAt = stamp(); await atomicJson(guardFile(worker), record); return result(record); }
    if (record.paused) { record.checkedAt = stamp(); record.lastObservedFingerprint = sample.fingerprint; await atomicJson(guardFile(worker), record); return result(record, sample); }
    const originalFingerprint = record.fingerprint;
    if (sample.currentSlug !== record.currentSlug) {
      record.wakeAttempts = 0; record.noProgressWakes = 0; record.repeatedErrorWakes = 0; record.currentAttempt = null; record.errorFingerprint = null; record.errorCountedAttempt = null; record.repairRevalidation = null;
    }
    Object.assign(record, { worker, currentSlug: sample.currentSlug, counts: sample.counts, automationId: sample.automationId, threadId: sample.threadId, fingerprint: sample.fingerprint, checkedAt: stamp(), meaningfulChanged: Boolean(originalFingerprint && originalFingerprint !== sample.fingerprint), evidence: sample.evidence, blockers: sample.blockers });
    if (record.meaningfulChanged) { record.lastMeaningfulAt = stamp(); if (record.currentAttempt) record.currentAttempt.changed = true; }
    if (sample.completed) pause(record, 'completed', `担当${sample.counts.assigned}大学を消化済み（published ${sample.counts.published}、deferred ${sample.counts.deferred}）。自動継続を停止します。`, '新たな年度・追加担当、またはdeferred再調査をユーザー/rootが明示し、必要なpendingを設定してresumeする。', sample);
    else if (sample.waitingMs > 0) { record.action = 'wait'; record.category = 'cooldown'; record.reason = '直前の本番確認後60秒の待機中。次大学はまだ開始しません。'; }
    else {
      const id = attemptId || (phase === 'wake' ? crypto.randomUUID() : record.currentAttempt?.id);
      insist(hasText(id), 'ATTEMPT_ID_REQUIRED', 'checkpoint/finishはwakeのattempt-idを再利用してください。');
      insist(!(phase === 'wake' && record.currentAttempt?.id === id && record.currentAttempt.finished), 'ATTEMPT_ALREADY_FINISHED', '完了したwakeのIDを次回実行で再使用できません。新しいturn IDを指定してください。');
      const newWake = phase === 'wake' && record.currentAttempt?.id !== id;
      if (newWake) {
        concludeAttempt(record, sample);
        record.wakeAttempts += 1;
        record.currentAttempt = { id, startedAt: stamp(), startFingerprint: sample.fingerprint, changed: false, finished: false };
      } else if (record.currentAttempt?.id !== id) throw new GuardError('ATTEMPT_ID_MISMATCH', '進行中wakeと同じattempt-idを使ってください。');
      record.action = 'continue'; record.category = record.meaningfulChanged ? 'progress' : 'working'; record.reason = record.meaningfulChanged ? '候補・公式根拠・検証・状態の実内容が変化しています。同じ大学を完了まで継続してください。' : '同じ大学の実作業を続けます。状態確認だけで実行を終えません。';
      const grace = record.repairRevalidation;
      if (grace && !grace.used && phase === 'wake') { grace.used = true; grace.attemptId = id; grace.startedAt = stamp(); }
      const allowedByRepair = blocker => {
        const keys = blocker.repairKeys || (blocker.repairKey ? [blocker.repairKey] : []);
        return keys.length > 0 && keys.every(key => {
          const allowance = grace?.repairs?.[key];
          return Boolean(allowance && grace.attemptId === id && sample.repairs[key]?.signature === allowance.signature && (!blocker.sourceAt || Date.parse(blocker.sourceAt) <= Date.parse(allowance.verifiedAt)));
        });
      };
      const unresolved = sample.blockers.filter(blocker => !allowedByRepair(blocker));
      const hard = unresolved.filter(blocker => !blocker.retryable);
      const retryable = unresolved.filter(blocker => blocker.retryable);
      if (hard.length) pause(record, 'blocked', hard.map(blocker => blocker.reason).join('\n'), hard.map(blocker => blocker.resumeCondition).join('\n'), sample);
      else if (retryable.length) {
        const errorFingerprint = hash(JSON.stringify(retryable.map(blocker => ({ id: blocker.id, reason: stableError(blocker.reason) })).sort((a, b) => a.id.localeCompare(b.id))));
        if (record.errorCountedAttempt !== id) { record.repeatedErrorWakes = record.errorFingerprint === errorFingerprint ? record.repeatedErrorWakes + 1 : 1; record.errorFingerprint = errorFingerprint; record.errorCountedAttempt = id; }
        if (record.repeatedErrorWakes >= LIMITS.repeatedErrorWakes) pause(record, 'blocked', `同じエラーが${record.repeatedErrorWakes}実行で反復しています: ${retryable.map(blocker => blocker.reason).join('; ')}`, '同じコマンドを無制限に再試行せず、原因を変更・解消した根拠とroot/ユーザーの明示resumeが必要です。', sample);
      } else { record.repeatedErrorWakes = 0; record.errorFingerprint = null; record.errorCountedAttempt = null; }
      if (!record.paused && phase === 'finish') concludeAttempt(record, sample);
      if (!record.paused && record.noProgressWakes >= LIMITS.noProgressWakes) pause(record, 'stalled', `実内容の変化がない実行が${record.noProgressWakes}回連続しました。時刻・ログ・報告再生成は進捗として数えていません。`, 'root/ユーザーが候補・根拠・残作業・障害を確認し、具体的な次の作業を指示して明示resumeする。', sample);
      if (!record.paused && record.wakeAttempts > LIMITS.sameUniversityWakes) pause(record, 'stalled', `同じ大学の自動wake上限${LIMITS.sameUniversityWakes}回を超えました。実内容が少し変わる場合も無制限継続はしません。`, '保存済みの研究・候補・検証結果をroot/ユーザーが確認し、長時間研究の必要性と再開する作業を明示してresumeする。', sample);
      if (!record.paused && grace?.attemptId === id) { record.category = 'repair-revalidation'; record.reason = 'rootの新しい共通修正を取り込み、この1実行で実ページを再検証します。古い失敗表示は再検証後に大学状態から解消してください。'; }
      if (phase === 'finish' && grace?.attemptId === id) grace.finished = true;
    }
    await atomicJson(guardFile(worker), record); return result(record, sample);
  }
  async function resume({ worker, reason, requestedBy = 'root' } = {}) {
    insist(Number.isInteger(worker) && worker >= 1 && worker <= 4, 'INVALID_WORKER', 'workerは1〜4で指定してください。');
    insist(hasText(reason) && ['root', 'user'].includes(requestedBy), 'EXPLICIT_RESUME_REQUIRED', 'root/userの明示再開理由を指定してください。workerは自分の判断で解除しません。');
    const sample = await snapshot(worker), previous = await readJson(guardFile(worker), {}), consumed = previous.consumedRepairs || {}, allowances = {};
    for (const blocker of sample.blockers) {
      for (const key of blocker.repairKeys || (blocker.repairKey ? [blocker.repairKey] : [])) {
        const repair = sample.repairs[key];
        if (repair && consumed[key] !== repair.signature && (!blocker.sourceAt || Date.parse(repair.verifiedAt) > Date.parse(blocker.sourceAt))) allowances[key] = repair;
      }
    }
    for (const [key, repair] of Object.entries(allowances)) consumed[key] = repair.signature;
    const record = { version: 1, worker, currentSlug: sample.currentSlug, paused: false, action: 'continue', category: 'explicit-resume', reason, requestedBy, resumedAt: stamp(), resumeCondition: null, fingerprint: sample.fingerprint, wakeAttempts: 0, noProgressWakes: 0, repeatedErrorWakes: 0, currentAttempt: null, consumedRepairs: consumed, repairRevalidation: Object.keys(allowances).length ? { issuedAt: stamp(), used: false, repairs: allowances } : null, counts: sample.counts, automationId: sample.automationId, threadId: sample.threadId, evidence: sample.evidence, blockers: sample.blockers, history: [...(previous.history || []), { at: stamp(), action: 'explicit-resume', requestedBy, reason }].slice(-50) };
    await atomicJson(guardFile(worker), record);
    return { ...result(record, sample), automationResumed: false, requiresExplicitAutomationUpdate: true };
  }
  async function status({ worker } = {}) { insist(Number.isInteger(worker) && worker >= 1 && worker <= 4, 'INVALID_WORKER', 'workerは1〜4で指定してください。'); const record = await readJson(guardFile(worker), null); return record ? result(record) : { ok: true, action: 'not-initialized', worker, stateFile: shownFile(guardFile(worker)), limits: LIMITS }; }
  return { check, resume, status, snapshot };
}
function args(argv) {
  const positional = [], options = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) { positional.push(argv[i]); continue; }
    const [key, inline] = argv[i].slice(2).split('=', 2); options[key] = inline ?? argv[++i];
    insist(options[key] !== undefined && !String(options[key]).startsWith('--'), 'INVALID_ARGUMENT', `${key}には値が必要です。`);
  }
  return { positional, options };
}
export async function runCli(argv = process.argv.slice(2)) {
  const { positional, options } = args(argv), worker = Number(options.worker);
  const api = createGuard({ workspaceDir: options.workspace || DEFAULT_ROOT, stateDir: options['state-dir'] || undefined });
  if (positional[0] === 'check') return api.check({ worker, phase: options.phase || 'wake', attemptId: options['attempt-id'] });
  if (['resume', 'reset'].includes(positional[0])) return api.resume({ worker, reason: options.reason, requestedBy: options['requested-by'] || 'root' });
  if (positional[0] === 'status') return api.status({ worker });
  throw new GuardError('INVALID_COMMAND', 'check/status/resumeを指定してください。');
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(await runCli(), null, 2)); }
  catch (error) { console.log(JSON.stringify({ ok: false, error: { code: error.code || 'UNEXPECTED_ERROR', message: error.message } }, null, 2)); process.exitCode = 1; }
}
