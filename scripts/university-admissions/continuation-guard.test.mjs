import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createGuard, LIMITS } from './continuation-guard.mjs';

async function fixture(t) {
  const parent = path.resolve(os.tmpdir()), workspace = await fs.mkdtemp(path.join(parent, 'lexus-continuation-guard-'));
  t.after(async () => { assert.equal(path.dirname(path.resolve(workspace)), parent); assert.match(path.basename(workspace), /^lexus-continuation-guard-/); await fs.rm(workspace, { recursive: true, force: true }); });
  const directory = path.join(workspace, 'reports/university-admissions'); await fs.mkdir(path.join(directory, 'items'), { recursive: true }); await fs.mkdir(path.join(directory, 'workers'));
  const write = async (file, value) => { const target = path.join(directory, file); await fs.mkdir(path.dirname(target), { recursive: true }); await fs.writeFile(target, typeof value === 'string' ? value : JSON.stringify(value)); };
  const read = async file => JSON.parse(await fs.readFile(path.join(directory, file), 'utf8'));
  const candidate = { path: '/information-alpha/', university: 'alpha大学', admissionYear: 2027, verifiedAt: '2026-10-09T10:00:00Z', rows: [{ label: '試験日', value: '2027年1月10日' }] };
  await write('manifest.json', { version: 1, workers: [{ id: 1, slugs: ['alpha', 'beta'], automationId: 'worker-one', threadId: 'thread-one' }, { id: 2, slugs: ['gamma'] }], universities: [['alpha', 1], ['beta', 1], ['gamma', 2]].map(([slug, worker]) => ({ slug, worker, name: `${slug}大学`, path: `/information-${slug}/` })) });
  await write('bootstrap.json', { status: 'ready' });
  await write('items/alpha.json', { version: 1, slug: 'alpha', worker: 1, name: 'alpha大学', path: '/information-alpha/', state: 'researching', updatedAt: '2026-10-09T10:00:00Z', candidate: { file: 'reports/university-admissions/alpha/candidate.json', sha256: 'a'.repeat(64) } });
  await write('workers/1.json', { worker: 1, currentSlug: 'alpha' }); await write('alpha/candidate.json', candidate);
  let time = Date.parse('2026-10-09T10:00:00Z'); const clock = milliseconds => { time += milliseconds; };
  const api = createGuard({ workspaceDir: workspace, stateDir: directory, now: () => time });
  const updateItem = async patch => write('items/alpha.json', { ...(await read('items/alpha.json')), ...patch });
  const prepareRepair = async key => write('bootstrap.json', { status: 'ready', sharedRepairs: { [key]: { status: 'ready', stagingCommit: 'b'.repeat(40), mainCommit: 'c'.repeat(40), verifiedAt: new Date(time).toISOString() } } });
  return { api, write, read, clock, workspace, directory, candidate, updateItem, prepareRepair };
}

test('three completed no-progress wakes pause; timestamps, logs and inspect/report outputs do not count', async t => {
  const { api, write, updateItem, clock, candidate } = await fixture(t);
  await api.resume({ worker: 1, reason: 'root approved original research', requestedBy: 'root' });
  let last;
  for (let i = 1; i <= 3; i++) {
    const id = `wake-${i}`; assert.equal((await api.check({ worker: 1, attemptId: id })).action, 'continue');
    clock(1000); await updateItem({ updatedAt: `2026-10-09T10:00:0${i}Z`, history: [{ at: new Date().toISOString(), event: 'inspected' }], candidate: { file: 'reports/university-admissions/alpha/candidate.json', sha256: String(i).repeat(64) } });
    await write('alpha/candidate.json', { ...candidate, verifiedAt: `2026-10-09T10:00:0${i}Z` });
    await write(`alpha/candidate-copy-${i}.json`, { ...candidate, verifiedAt: `2026-10-09T10:00:0${i}Z` });
    await write('alpha/build.log', `build log ${i}`); await write('alpha/inspect-state.json', { random: i }); await write('alpha/summary.json', { kind: 'inspection', inspectedAt: new Date().toISOString(), output: i });
    last = await api.check({ worker: 1, phase: 'finish', attemptId: id });
  }
  assert.equal(last.action, 'pause'); assert.equal(last.category, 'stalled'); assert.equal(last.noProgressWakes, 3);
  assert.equal(last.automationPause.id, 'worker-one'); assert.equal(last.automationPause.requestedStatus, 'PAUSED'); assert.equal(last.automationPause.performedByGuard, false);
  await write('alpha/candidate.json', { ...candidate, rows: [{ label: '試験日', value: '2027年1月11日' }] });
  assert.equal((await api.check({ worker: 1, attemptId: 'still-paused' })).action, 'pause');
  await assert.rejects(api.resume({ worker: 1, reason: 'self retry', requestedBy: 'worker' }), { code: 'EXPLICIT_RESUME_REQUIRED' });
  await api.resume({ worker: 1, reason: 'user reviewed the stalled work and instructed a concrete correction', requestedBy: 'user' });
  assert.equal((await api.check({ worker: 1, attemptId: 'explicit-resumed' })).action, 'continue');
});

test('real research content supports a long uninterrupted attempt; total wake attempts still have a hard cap', async t => {
  const { api, write, clock } = await fixture(t);
  for (let wake = 1; wake <= LIMITS.sameUniversityWakes; wake++) {
    const id = `research-${wake}`; assert.equal((await api.check({ worker: 1, attemptId: id })).action, 'continue');
    for (let checkpoint = 0; checkpoint < 5; checkpoint++) {
      clock(15 * 60_000); await write('research/alpha/official-notes.json', { sources: ['https://alpha.example.edu/guide.pdf'], checkedAt: new Date().toISOString(), evidence: `verified page and admission condition ${wake}:${checkpoint}` });
      const result = await api.check({ worker: 1, phase: 'checkpoint', attemptId: id }); assert.equal(result.action, 'continue'); assert.equal(result.wakeAttempts, wake);
    }
    const result = await api.check({ worker: 1, phase: 'finish', attemptId: id }); assert.equal(result.noProgressWakes, 0);
  }
  const result = await api.check({ worker: 1, attemptId: 'over-cap' }); assert.equal(result.action, 'pause'); assert.equal(result.category, 'stalled'); assert.match(result.reason, /wake上限3/);
});

test('all assigned published/deferred items stop their own automation without marking deferrals published', async t => {
  const { api, write, updateItem, directory } = await fixture(t);
  await updateItem({ state: 'published', commit: 'a'.repeat(40) }); await write('items/beta.json', { slug: 'beta', worker: 1, state: 'deferred' });
  const result = await api.check({ worker: 1, attemptId: 'completion' }); assert.equal(result.action, 'pause'); assert.equal(result.category, 'completed'); assert.equal(result.counts.published, 1); assert.equal(result.counts.deferred, 1);
  await assert.rejects(fs.stat(path.join(directory, 'guards/worker-2.json')), { code: 'ENOENT' });
});

test('shared failures pause immediately; a newer root repair permits exactly one explicit revalidation attempt', async t => {
  const { api, updateItem, clock, prepareRepair } = await fixture(t);
  await updateItem({ resumeStage: 'awaiting-root-common-fix-and-explicit-resume', failure: { stage: 'local-mobile-layout', summary: 'shared mobile layout overflow', at: '2026-10-09T10:00:00Z' } });
  const blocked = await api.check({ worker: 1, attemptId: 'blocked' }); assert.equal(blocked.action, 'pause'); assert.equal(blocked.category, 'blocked');
  clock(1000); await prepareRepair('mobileAdmissionTables');
  assert.equal((await api.check({ worker: 1, attemptId: 'automatic-retry-forbidden' })).action, 'pause');
  const resumed = await api.resume({ worker: 1, reason: 'root deployed and verified shared CSS repair' }); assert.ok(resumed.repairRevalidation); assert.equal(resumed.automationResumed, false);
  assert.equal((await api.check({ worker: 1, attemptId: 'one-revalidation' })).category, 'repair-revalidation');
  assert.equal((await api.check({ worker: 1, phase: 'checkpoint', attemptId: 'one-revalidation' })).action, 'continue');
  await api.check({ worker: 1, phase: 'finish', attemptId: 'one-revalidation' });
  assert.equal((await api.check({ worker: 1, attemptId: 'legacy-still-unresolved' })).action, 'pause');
  const again = await api.resume({ worker: 1, reason: 'same repair retry cannot grant a second allowance' }); assert.equal(again.repairRevalidation, null);
  assert.equal((await api.check({ worker: 1, attemptId: 'not-another-grace' })).action, 'pause');
});

test('two attempts repeating the same retryable error stop; checkpoints cannot inflate or evade the error cap', async t => {
  const { api, updateItem } = await fixture(t);
  await updateItem({ continuation: { error: { code: 'FETCH_FAILED', message: 'network GET failed', retryable: true, at: '2026-10-09T10:00:00Z' } } });
  assert.equal((await api.check({ worker: 1, attemptId: 'first' })).repeatedErrorWakes, 1);
  for (let i = 0; i < 3; i++) assert.equal((await api.check({ worker: 1, phase: 'checkpoint', attemptId: 'first' })).action, 'continue');
  await api.check({ worker: 1, phase: 'finish', attemptId: 'first' });
  const result = await api.check({ worker: 1, attemptId: 'second' }); assert.equal(result.action, 'pause'); assert.equal(result.category, 'blocked'); assert.equal(result.repeatedErrorWakes, 2);
});

test('fresh verification failure after a repair stops even within its one-time grace attempt', async t => {
  const { api, write, updateItem, prepareRepair, clock } = await fixture(t);
  await updateItem({ dependencies: ['大学入試センター www.dnc.ac.jp を共通source host検証で拒否'] });
  await write('alpha/renderer-validation.json', { passed: false, error: 'source host www.dnc.ac.jp is not official', checkedAt: '2026-10-09T10:00:00Z' });
  await api.check({ worker: 1, attemptId: 'legacy-failure' }); clock(1000); await prepareRepair('nationalSourceValidation');
  await api.resume({ worker: 1, reason: 'root added verified national official source support' });
  assert.equal((await api.check({ worker: 1, attemptId: 'revalidate' })).action, 'continue');
  clock(1000); await write('alpha/renderer-validation.json', { passed: false, error: 'source host www.dnc.ac.jp is still rejected', checkedAt: '2026-10-09T10:00:02Z' });
  const result = await api.check({ worker: 1, phase: 'checkpoint', attemptId: 'revalidate' }); assert.equal(result.action, 'pause'); assert.equal(result.category, 'blocked');
});

test('cooldown is a wait, not another attempt; meaningful state and verification changes count', async t => {
  const { api, updateItem, write, clock } = await fixture(t);
  await updateItem({ state: 'published' }); await write('workers/1.json', { worker: 1, currentSlug: null, nextEligibleAt: '2026-10-09T10:01:00Z' });
  let result = await api.check({ worker: 1, attemptId: 'cooldown' }); assert.equal(result.action, 'wait'); assert.equal(result.remainingMs, 60_000); assert.equal(result.wakeAttempts, 0);
  clock(60_000); result = await api.check({ worker: 1, attemptId: 'new-school' }); assert.equal(result.currentSlug, 'beta'); assert.equal(result.wakeAttempts, 1);
  await write('items/beta.json', { slug: 'beta', worker: 1, state: 'draft', commit: 'd'.repeat(40) });
  result = await api.check({ worker: 1, phase: 'finish', attemptId: 'new-school' }); assert.equal(result.meaningfulChanged, true); assert.equal(result.noProgressWakes, 0);
  await assert.rejects(api.check({ worker: 1, attemptId: 'new-school' }), { code: 'ATTEMPT_ALREADY_FINISHED' });
});

test('planned destinations are not missing evidence; actual frontend references resolve in their worker worktree', async t => {
  const { api, workspace, candidate, updateItem } = await fixture(t);
  const worktree = path.join(workspace, 'worker-checkout'), target = path.join(worktree, 'frontend/src/data/universityAdmissions/alpha.json');
  await fs.mkdir(path.dirname(target), { recursive: true }); await fs.writeFile(target, JSON.stringify(candidate));
  await updateItem({ plannedCandidateFile: 'frontend/src/data/universityAdmissions/not-created.json', draftCandidate: { destination: 'frontend/src/data/universityAdmissions/not-created.json' }, worktreeRoot: worktree, draftFile: 'frontend/src/data/universityAdmissions/alpha.json' });
  const snapshot = await api.snapshot(1); assert.deepEqual(snapshot.evidence.readErrors, []); assert.equal(snapshot.blockers.length, 0);
  assert.ok(snapshot.evidence.artifacts.some(entry => entry.file.includes('worker-checkout/frontend/src/data/universityAdmissions/alpha.json')));
  await fs.unlink(target); assert.ok((await api.snapshot(1)).blockers.some(entry => entry.id === 'evidence-unreadable'));
});

test('a generic root wait with both known shared failures requires both new repairs and only explicit resume', async t => {
  const { api, updateItem, write, clock } = await fixture(t);
  await updateItem({ state: 'draft', resumeFrom: 'root-resume-after-shared-fix-publication', dependencies: ['大学入試センター www.dnc.ac.jp 拒否とスマホ表の共通修正をrootが対応中'] });
  await api.check({ worker: 1, attemptId: 'blocked' }); clock(1000);
  const repair = { status: 'ready', stagingCommit: 'b'.repeat(40), mainCommit: 'c'.repeat(40), verifiedAt: '2026-10-09T10:00:01Z' };
  await write('bootstrap.json', { status: 'ready', sharedRepairs: { mobileAdmissionTables: repair, nationalSourceValidation: repair } });
  await api.resume({ worker: 1, reason: 'root deployed both common repairs and authorized one actual revalidation' });
  const result = await api.check({ worker: 1, attemptId: 'revalidate-both' }); assert.equal(result.action, 'continue'); assert.equal(result.category, 'repair-revalidation');
  assert.ok(result.blockers.find(entry => entry.id === 'awaiting-shared-repair').repairKeys.includes('mobileAdmissionTables'));
  assert.ok(result.blockers.find(entry => entry.id === 'awaiting-shared-repair').repairKeys.includes('nationalSourceValidation'));
});

test('an explicitly resolved historical failure remains evidence but does not block subsequent publication turns', async t => {
  const { api, write, updateItem, prepareRepair, clock } = await fixture(t);
  const oldFailure = { passed: false, error: 'source host www.dnc.ac.jp is not official', checkedAt: '2026-10-09T10:00:00Z' };
  await updateItem({ failure: { stage: 'domain-validation', summary: oldFailure.error, at: oldFailure.checkedAt } }); await write('alpha/old-renderer-validation.json', oldFailure);
  await api.check({ worker: 1, attemptId: 'blocked' }); clock(1000); await prepareRepair('nationalSourceValidation');
  await api.resume({ worker: 1, reason: 'root deployed national source support; perform a real revalidation' });
  assert.equal((await api.check({ worker: 1, attemptId: 'verified-fix' })).action, 'continue');
  clock(1000);
  await write('alpha/new-renderer-validation.json', { passed: true, checks: [{ id: 'national-official-source', passed: true }], checkedAt: '2026-10-09T10:00:02Z' });
  await write('alpha/old-renderer-validation.json', { ...oldFailure, resolved: true, status: 'resolved', resolvedByEvidenceFile: 'reports/university-admissions/alpha/new-renderer-validation.json' });
  await updateItem({ failure: { stage: 'domain-validation', summary: oldFailure.error, resolved: true, resolvedByEvidenceFile: 'reports/university-admissions/alpha/new-renderer-validation.json' } });
  const finish = await api.check({ worker: 1, phase: 'finish', attemptId: 'verified-fix' }); assert.equal(finish.action, 'continue'); assert.equal(finish.blockers.length, 0);
  assert.ok(finish.evidence.artifacts.some(entry => entry.file.endsWith('old-renderer-validation.json')));
  const next = await api.check({ worker: 1, attemptId: 'publication-after-lock-wait' }); assert.equal(next.action, 'continue'); assert.equal(next.blockers.length, 0);
});
