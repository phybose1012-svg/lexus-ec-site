import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import { parse } from 'parse5';

const data = JSON.parse(fs.readFileSync(new URL('../src/data/universityAdmissions/tsukuba.json', import.meta.url), 'utf8'));
export const attr = (node, key) => node.attrs?.find(a => a.name === key)?.value;
export const all = (node, predicate, result = []) => { if (predicate(node)) result.push(node); for (const child of node.childNodes ?? []) all(child, predicate, result); return result; };
export const text = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
export const clean = value => value.replace(/\s/gu, '');

export function verifyReadableHtml(html, candidate = data) {
  const tree = parse(html);
  const wrappers = all(tree, n => attr(n, 'data-admissions-presentation') === 'readable-v1');
  assert.equal(wrappers.length, 1);
  const wrapper = wrappers[0], sources = new Map(candidate.sources.map(s => [s.id, s]));
  let rows = 0, notes = 0;
  for (const scheme of candidate.schemes) {
    const schemes = all(wrapper, n => attr(n, 'data-admission-scheme') === scheme.id);
    assert.equal(schemes.length, 1);
    for (const [kind, field] of [['schedule', 'scheduleRows'], ['exam', 'examRows'], ['venue', 'venueRows']]) {
      for (const [index, expected] of scheme[field].entries()) {
        const origin = `${scheme.id}/${kind}/${index}`;
        const entries = all(wrapper, n => attr(n, 'data-admission-origin') === origin);
        assert.equal(entries.length, 1, `Missing/duplicate ${origin}`);
        const entry = entries[0];
        const values = all(entry, n => attr(n, 'data-admission-value') !== undefined);
        assert.equal(values.length, 1);
        assert.equal(clean(text(values[0])), clean(expected.value), `${origin}: complete value must remain`);
        const labels = all(entry, n => attr(n, 'data-admission-label') !== undefined);
        assert.equal(labels.length, 1);
        assert.equal(text(labels[0]), expected.label);
        assert.equal(attr(entry, 'data-admission-status'), expected.status);
        const anchors = all(entry, n => n.tagName === 'a' && attr(n, 'data-admission-source-id') !== undefined);
        assert.deepEqual(anchors.map(n => attr(n, 'data-admission-source-id')), expected.sourceIds);
        for (const anchor of anchors) {
          assert.equal(attr(anchor, 'href'), sources.get(attr(anchor, 'data-admission-source-id')).url);
          assert.ok(attr(anchor, 'aria-label').includes(sources.get(attr(anchor, 'data-admission-source-id')).title));
        }
        rows++;
      }
    }
    for (const [index, expected] of scheme.notes.entries()) {
      const entries = all(schemes[0], n => attr(n, 'data-admission-note') === String(index));
      assert.equal(entries.length, 1);
      const values = all(entries[0], n => attr(n, 'data-admission-note-text') !== undefined);
      assert.equal(clean(text(values[0])), clean(expected.text));
      const anchors = all(entries[0], n => n.tagName === 'a' && attr(n, 'data-admission-source-id') !== undefined);
      assert.deepEqual(anchors.map(n => attr(n, 'data-admission-source-id')), expected.sourceIds);
      notes++;
    }
  }
  assert.equal(all(wrapper, n => attr(n, 'data-admission-origin') !== undefined).length, rows, 'No unverified canonical rows');
  for (const [index, expected] of candidate.coverageNotes.entries()) {
    const entries = all(wrapper, n => attr(n, 'data-admission-coverage-note') === String(index));
    assert.equal(entries.length, 1);
    assert.equal(clean(text(entries[0])), clean(expected));
  }
  const overview = all(wrapper, n => attr(n, 'data-readable-overview') !== undefined);
  assert.deepEqual(overview.map(n => attr(n, 'data-readable-overview')), candidate.schemes.map(s => s.id));
  for (const id of ['ib-july', 'ib-october']) assert.ok(text(overview.find(n => attr(n, 'data-readable-overview') === id)).includes('7月・10月合計3人'));
  for (const id of ['general-region-national', 'general-region-ibaraki']) assert.ok(text(overview.find(n => attr(n, 'data-readable-overview') === id)).includes('地域枠全体で13人予定'));
  for (const id of ['recommendation-general', 'recommendation-region']) {
    const value = text(overview.find(n => attr(n, 'data-readable-overview') === id));
    assert.ok(value.includes('2026年10月23日～11月9日9:00'));
    assert.ok(value.includes('2026年11月2日～9日必着、持参不可'));
    assert.ok(value.includes('2026年11月26日・27日'));
  }
  for (const source of candidate.sources) {
    const references = all(wrapper, n => n.tagName === 'li' && attr(n, 'data-admission-source-id') === source.id);
    assert.equal(references.length, 1);
    assert.ok(text(references[0]).includes(source.title));
    assert.equal(attr(all(references[0], n => n.tagName === 'a')[0], 'href'), source.url);
  }
  return { rows, notes, coverage: candidate.coverageNotes.length, sources: candidate.sources.length, schemes: candidate.schemes.length };
}

// Verify either saved build HTML or the actual deployed response against canonical data.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [target, output] = process.argv.slice(2);
  if (!target) throw new Error('Use: node scripts/verify-tsukuba-readable.mjs HTML_FILE_OR_URL [EVIDENCE_JSON]');
  let html;
  if (/^https?:\/\//u.test(target)) {
    const response = await fetch(target, { signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 200);
    html = await response.text();
  } else html = fs.readFileSync(target, 'utf8');
  const result = { passed: true, target, checkedAt: new Date().toISOString(), ...verifyReadableHtml(html) };
  if (output) fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
}
