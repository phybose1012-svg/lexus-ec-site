import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { createWorkflow, COOLDOWN_MS } from './workflow-state.mjs';

const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
async function fixture(t) {
  const temporaryParent = path.resolve(os.tmpdir());
  const root = await fs.mkdtemp(path.join(temporaryParent, 'lexus-university-state-'));
  t.after(async () => {
    // Verify the computed absolute deletion target before removing this fixture.
    assert.equal(path.dirname(path.resolve(root)), temporaryParent);
    assert.match(path.basename(root), /^lexus-university-state-/);
    await fs.rm(root, { recursive: true, force: true });
  });
  const stateDir = path.join(root, 'reports/university-admissions');
  await fs.mkdir(stateDir, { recursive: true });
  const universities = [['alpha', 1], ['beta', 1], ['gamma', 2], ['delta', 2]].map(([slug, worker]) => ({ slug, worker, name: `${slug}大学`, path: `/information-${slug}/`, officialUrl: `https://${slug}.example.edu/` }));
  await fs.writeFile(path.join(stateDir, 'manifest.json'), JSON.stringify({ version: 1, createdAt: '2026-10-09T00:00:00Z', workers: [{ id: 1, slugs: ['alpha', 'beta'] }, { id: 2, slugs: ['gamma', 'delta'] }], universities }));
  let time = Date.parse('2026-10-09T01:00:00Z');
  const api = createWorkflow({ workspaceDir: root, stateDir, now: () => time });
  const clock = milliseconds => { time += milliseconds; };
  async function proofs(slug) {
    const checkedAt = new Date(time).toISOString();
    const source = { id: 'guide', url: `https://${slug}.example.edu/guide.pdf`, title: '2027年度医学部募集要項', retrievedAt: checkedAt };
    const rows = { scheduleRows: [{ label: '試験日', value: '2027年1月10日', sourceIds: ['guide'] }], examRows: [{ label: '数学', value: '100点', sourceIds: ['guide'] }], venueRows: [{ label: '試験会場', value: '大学キャンパス', sourceIds: ['guide'] }], notes: [{ text: '受験票を持参する。', sourceIds: ['guide'] }] };
    const data = { path: `/information-${slug}/`, university: `${slug}大学`, admissionYear: 2027, verifiedAt: checkedAt, sources: [source], schemes: [{ id: 'general', name: '一般選抜', ...rows }], coverageNotes: ['一般選抜のみ掲載し、学校推薦型選抜は掲載していません。'] };
    const candidateFile = `${slug}.json`; const candidateBytes = Buffer.from(JSON.stringify(data));
    await fs.writeFile(path.join(root, candidateFile), candidateBytes); const candidateSha256 = hash(candidateBytes);
    const comparisons = [['schedule', 'scheduleRows'], ['exam', 'examRows'], ['venue', 'venueRows'], ['note', 'notes']].flatMap(([type, field]) => rows[field].map((row, i) => ({ target: `general/${type}/${i}`, ...row, officialEvidence: [{ sourceId: 'guide', url: source.url, page: 'p.3', officialQuote: type === 'schedule' ? '試験日は1月10日' : type === 'exam' ? '数学100点' : type === 'venue' ? '大学キャンパス' : '受験票を持参する', checkedAt }], reviewer: 'fixture reviewer', checkedAt, conclusion: 'match', reason: '対象年度・医学科・一般選抜の該当欄と照合した。' })));
    const comparison = { version: 1, candidateFile, candidateSha256, path: data.path, university: data.university, admissionYear: 2027, reviewedAt: checkedAt, reviewer: 'fixture reviewer', sources: [{ sourceId: source.id, url: source.url, title: source.title, retrievedAt: checkedAt }], comparisons, coverageReview: { confirmed: true, notes: data.coverageNotes }, passed: true };
    const comparisonFile = `${slug}-comparison.json`; const comparisonBytes = Buffer.from(JSON.stringify(comparison)); await fs.writeFile(path.join(root, comparisonFile), comparisonBytes);
    const pcFile = `${slug}-pc.png`, mobileFile = `${slug}-mobile.png`;
    await fs.writeFile(path.join(root, pcFile), Buffer.from('PNG fixture PC')); await fs.writeFile(path.join(root, mobileFile), Buffer.from('PNG fixture mobile'));
    const base = { candidateFile, candidateSha256, checkedAt, httpStatus: 200, responseHash: 'd'.repeat(64), tableHash: 'a'.repeat(64), passed: true, checks: [{ id: 'fixture-rendering', passed: true }], failedChecks: [], pc: { passed: true, screenshotFile: pcFile }, mobile: { passed: true, screenshotFile: mobileFile }, officialComparison: { passed: true, file: comparisonFile, sha256: hash(comparisonBytes) } };
    return { candidate: { file: candidateFile, sha256: candidateSha256 }, commit: 'c'.repeat(40), stagingEvidence: { ...base, url: `https://staging.lexus-ec.pages.dev/information-${slug}/`, commit: 'b'.repeat(40) }, mainEvidence: { ...base, url: `https://lexus-ec.com/information-${slug}/`, commit: 'c'.repeat(40) } };
  }
  async function advanceToMainVerified(slug, proof) {
    const worker = universities.find(item => item.slug === slug).worker;
    await api.update({ worker, slug, patch: { state: 'staging-verified', candidate: proof.candidate, stagingEvidence: proof.stagingEvidence } });
    await api.update({ worker, slug, patch: { state: 'main-published', commit: proof.commit } });
    await api.update({ worker, slug, patch: { state: 'main-verified', mainEvidence: proof.mainEvidence } });
  }
  return { api, root, stateDir, clock, proofs, advanceToMainVerified };
}

test('two workers contend for one atomic publish lock; wrong token cannot release it', async t => {
  const { api } = await fixture(t);
  await api.next({ worker: 1 }); await api.next({ worker: 2 });
  const attempts = await Promise.all([api.acquirePublishLock({ worker: 1, slug: 'alpha' }), api.acquirePublishLock({ worker: 2, slug: 'gamma' })]);
  assert.equal(attempts.filter(result => result.acquired).length, 1);
  const winner = attempts.find(result => result.acquired), loser = attempts.find(result => !result.acquired);
  assert.equal(loser.reason, 'busy'); assert.equal(loser.owner.token, undefined);
  await assert.rejects(api.releasePublishLock({ token: 'wrong-token' }), { code: 'LOCK_TOKEN_MISMATCH' });
  assert.equal((await api.status()).publishLock.worker, winner.worker);
  await api.releasePublishLock({ token: winner.token });
  const retry = await api.acquirePublishLock({ worker: winner.worker === 1 ? 2 : 1, slug: winner.worker === 1 ? 'gamma' : 'alpha' });
  assert.equal(retry.acquired, true); await api.releasePublishLock({ token: retry.token });
});

test('resume, proof-gated publication and exact 60-second boundary keep the next university unstarted', async t => {
  const { api, clock, stateDir, proofs, advanceToMainVerified } = await fixture(t);
  assert.equal((await api.next({ worker: 1 })).item.slug, 'alpha');
  assert.equal((await api.next({ worker: 1 })).action, 'resume');
  const lease = await api.acquirePublishLock({ worker: 1, slug: 'alpha' });
  await assert.rejects(api.published({ worker: 1, slug: 'alpha', token: lease.token }), { code: 'INVALID_TRANSITION' });
  await assert.rejects(api.update({ worker: 1, slug: 'alpha', patch: { state: 'staging-verified' } }), { code: 'MISSING_VERIFICATION' });
  const proof = await proofs('alpha');
  await advanceToMainVerified('alpha', proof);
  const result = await api.published({ worker: 1, slug: 'alpha', token: lease.token, patch: proof });
  assert.equal(result.item.state, 'published'); assert.equal(result.remainingMs, COOLDOWN_MS);
  assert.equal((await api.next({ worker: 1 })).action, 'wait');
  await assert.rejects(fs.stat(path.join(stateDir, 'items/beta.json')), { code: 'ENOENT' });
  // Other workers may continue research while publication and cooldown are active.
  assert.equal((await api.next({ worker: 2 })).item.slug, 'gamma');
  clock(COOLDOWN_MS - 1); assert.equal((await api.next({ worker: 1 })).remainingMs, 1);
  clock(1); const next = await api.next({ worker: 1 }); assert.equal(next.action, 'start'); assert.equal(next.item.slug, 'beta');
  await api.releasePublishLock({ token: lease.token });
});

test('deferred items require dated evidence and are skipped; assignment prevents cross-worker updates', async t => {
  const { api } = await fixture(t);
  await api.next({ worker: 1 });
  await assert.rejects(api.update({ worker: 1, slug: 'gamma', patch: { state: 'draft' } }), { code: 'NOT_ASSIGNED' });
  await assert.rejects(api.update({ worker: 1, slug: 'alpha', patch: { state: 'deferred' } }), { code: 'MISSING_DEFERRAL_EVIDENCE' });
  const result = await api.update({ worker: 1, slug: 'alpha', patch: { state: 'deferred', deferredReason: '2027年度の募集要項が未公表', deferredEvidence: [{ url: 'https://alpha.example.edu/admission/', checkedAt: '2026-10-09T00:59:00Z', summary: '公式入口に2026年度のみ掲載。新年度は推測しない。' }], nextReviewAt: null } });
  assert.ok(result.item.deferredAt); assert.equal(result.worker.currentSlug, null);
  assert.equal((await api.next({ worker: 1 })).item.slug, 'beta');
});

test('passed flags alone, changed candidate, failed official comparison and missing screen proof are rejected', async t => {
  const { api, root, proofs } = await fixture(t); await api.next({ worker: 1 }); const lease = await api.acquirePublishLock({ worker: 1, slug: 'alpha' });
  const proof = await proofs('alpha');
  await assert.rejects(api.update({ worker: 1, slug: 'alpha', patch: { state: 'staging-verified', ...proof, stagingEvidence: { ...proof.stagingEvidence, officialComparison: { passed: true } } } }), { code: 'MISSING_VERIFICATION' });
  await api.update({ worker: 1, slug: 'alpha', patch: { state: 'staging-verified', candidate: proof.candidate, stagingEvidence: proof.stagingEvidence } });
  await api.update({ worker: 1, slug: 'alpha', patch: { state: 'main-published', commit: proof.commit } });
  await assert.rejects(api.update({ worker: 1, slug: 'alpha', patch: { state: 'main-verified', mainEvidence: { ...proof.mainEvidence, pc: { passed: true, screenshotFile: 'absent.png' } } } }), { code: 'MISSING_ARTIFACT' });
  await fs.appendFile(path.join(root, proof.candidate.file), '\nchanged');
  await assert.rejects(api.update({ worker: 1, slug: 'alpha', patch: { state: 'main-verified', mainEvidence: proof.mainEvidence } }), { code: 'ARTIFACT_HASH_MISMATCH' });
  const fresh = await proofs('alpha'); const comparisonFile = path.join(root, fresh.stagingEvidence.officialComparison.file); const comparison = JSON.parse(await fs.readFile(comparisonFile, 'utf8')); comparison.comparisons[0].conclusion = 'needs-correction'; const changed = Buffer.from(JSON.stringify(comparison)); await fs.writeFile(comparisonFile, changed);
  fresh.stagingEvidence.officialComparison.sha256 = hash(changed); fresh.mainEvidence.officialComparison.sha256 = hash(changed);
  await assert.rejects(api.update({ worker: 1, slug: 'alpha', patch: { state: 'main-verified', stagingEvidence: fresh.stagingEvidence, mainEvidence: fresh.mainEvidence } }), { code: 'INVALID_COMPARISON' });
  assert.equal((await api.status({ worker: 1, slug: 'alpha' })).item.state, 'main-published');
  await api.releasePublishLock({ token: lease.token });
});

test('an abandoned publish lease never expires automatically, and item state recovers cooldown after a partial worker write', async t => {
  const { api, clock, stateDir, proofs, advanceToMainVerified } = await fixture(t); await api.next({ worker: 1 });
  const lease = await api.acquirePublishLock({ worker: 1, slug: 'alpha' });
  clock(24 * 60 * 60 * 1000);
  const busy = await api.acquirePublishLock({ worker: 2, slug: 'gamma' }); assert.equal(busy.acquired, false);
  const proof = await proofs('alpha'); await advanceToMainVerified('alpha', proof);
  const result = await api.published({ worker: 1, slug: 'alpha', token: lease.token, patch: proof });
  // Simulate a process stopping between the item write and its worker-state write.
  await fs.writeFile(path.join(stateDir, 'workers/1.json'), JSON.stringify({ version: 1, worker: 1, currentSlug: 'alpha', lastPublishedAt: null, nextEligibleAt: null }));
  const next = await api.next({ worker: 1 }); assert.equal(next.action, 'wait'); assert.equal(next.remainingMs, COOLDOWN_MS); assert.equal(next.nextEligibleAt, result.worker.nextEligibleAt);
  await api.releasePublishLock({ token: lease.token });
});

test('official reconciliation must cover every candidate cell and note with exact values and sources', async t => {
  const { api, root, proofs } = await fixture(t); await api.next({ worker: 1 });
  const lease = await api.acquirePublishLock({ worker: 1, slug: 'alpha' });
  for (const alter of [
    document => document.comparisons.pop(),
    document => { document.comparisons[0].value = '2027年1月11日'; },
    document => { document.comparisons[0].sourceIds = ['another-source']; },
    document => { document.sources[0].url = 'https://beta.example.edu/guide.pdf'; },
    document => { document.coverageReview.notes = []; },
    document => { document.comparisons[0].officialEvidence[0].checkedAt = '2026-10-09T00:59:00Z'; }
  ]) {
    const proof = await proofs('alpha'); const file = path.join(root, proof.stagingEvidence.officialComparison.file);
    const document = JSON.parse(await fs.readFile(file, 'utf8')); alter(document);
    const bytes = Buffer.from(JSON.stringify(document)); await fs.writeFile(file, bytes);
    proof.stagingEvidence.officialComparison.sha256 = hash(bytes); proof.mainEvidence.officialComparison.sha256 = hash(bytes);
    await assert.rejects(api.update({ worker: 1, slug: 'alpha', patch: { state: 'staging-verified', ...proof } }), { code: 'INVALID_COMPARISON' });
  }
  assert.equal((await api.status({ worker: 1, slug: 'alpha' })).item.state, 'researching');
  await api.releasePublishLock({ token: lease.token });
});

test('main publication cannot skip staging verification, change its candidate, or reuse a pre-publication GET', async t => {
  const { api, clock, proofs } = await fixture(t); await api.next({ worker: 1 });
  const proof = await proofs('alpha');
  await assert.rejects(api.update({ worker: 1, slug: 'alpha', patch: { ...proof, state: 'main-published' } }), { code: 'INVALID_TRANSITION' });
  await assert.rejects(api.update({ worker: 1, slug: 'alpha', patch: { ...proof, state: 'main-verified' } }), { code: 'INVALID_TRANSITION' });
  await api.update({ worker: 1, slug: 'alpha', patch: { state: 'staging-verified', candidate: proof.candidate, stagingEvidence: proof.stagingEvidence } });
  await assert.rejects(api.update({ worker: 1, slug: 'alpha', patch: { state: 'main-published', commit: proof.commit, candidate: { ...proof.candidate, file: 'another-candidate.json' } } }), { code: 'CANDIDATE_MISMATCH' });
  clock(10);
  const publication = await api.update({ worker: 1, slug: 'alpha', patch: { state: 'main-published', commit: proof.commit } });
  await assert.rejects(api.update({ worker: 1, slug: 'alpha', patch: { state: 'main-verified', mainEvidence: proof.mainEvidence } }), { code: 'INVALID_PUBLICATION_SEQUENCE' });
  proof.mainEvidence.checkedAt = publication.item.mainPublishedAt;
  await api.update({ worker: 1, slug: 'alpha', patch: { state: 'main-verified', mainEvidence: proof.mainEvidence } });
  const lease = await api.acquirePublishLock({ worker: 1, slug: 'alpha' });
  assert.equal((await api.published({ worker: 1, slug: 'alpha', token: lease.token })).published, true);
  await api.releasePublishLock({ token: lease.token });
});
