import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import { parse } from 'parse5';

const data = JSON.parse(fs.readFileSync(new URL('../src/data/universityAdmissions/tsukuba.json', import.meta.url), 'utf8'));
const readerCopy = JSON.parse(fs.readFileSync(new URL('../src/data/tsukubaReaderCopy.json', import.meta.url), 'utf8'));
export const attr = (node, key) => node.attrs?.find(a => a.name === key)?.value;
export const all = (node, predicate, result = []) => { if (predicate(node)) result.push(node); for (const child of node.childNodes ?? []) all(child, predicate, result); return result; };
export const text = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
export const clean = value => value.replace(/\s/gu, '');

export function verifyReadableHtml(html, candidate = data) {
  const tree = parse(html);
  const wrappers = all(tree, n => attr(n, 'data-admissions-presentation') === 'readable-v1');
  assert.equal(wrappers.length, 1);
  const wrapper = wrappers[0];
  const sentences = value => value.match(/[^。]+。?|。/gu) ?? [value];
  const displayText = value => readerCopy.sentenceReplacements.reduce((text, [from, to]) => text.replaceAll(from, to), value);
  const canonicalText = JSON.stringify(candidate);
  for (const [from] of readerCopy.sentenceReplacements) assert.ok(canonicalText.includes(from), `Review stale reader copy: ${from}`);
  const scoreTable = all(wrapper, n => attr(n, 'data-readable-scores') !== undefined)[0];
  assert.ok(scoreTable);
  const scoreRows = all(scoreTable, n => n.tagName === 'tr');
  const point = value => `${Number(value).toLocaleString('ja-JP')}点`;
  const general = candidate.schemes.find(s => s.id === 'general-early');
  for (const [canonicalLabel, column, pairs] of [
    ['共通テスト配点', 0, [['国語','国語'], ['地歴・公民','地歴・公民'], ['数学','数学'], ['理科','理科'], ['外国語','外国語'], ['情報Ⅰ','情報Ⅰ'], ['合計','計']]],
    ['個別試験科目・配点', 1, [['数学','数学'], ['理科','理科'], ['外国語','英語'], ['適性試験①・筆記','適性試験（1）'], ['適性試験②・面接','適性試験（2）'], ['合計','計']]],
  ]) {
    const original = general.examRows.find(r => r.label === canonicalLabel).value;
    for (const [tableLabel, originalLabel] of pairs) {
      const row = scoreRows.find(n => text(all(n, c => c.tagName === 'th')[0] ?? {}) === tableLabel);
      const match = original.match(new RegExp(`${originalLabel.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')}(\\d+)点`, 'u'));
      assert.ok(match, originalLabel);
      assert.ok(text(all(row, n => n.tagName === 'td')[column]).startsWith(point(match[1])));
    }
  }
  assert.ok(text(scoreTable).includes('総合計2,350点'));
  // All external sources live in the quiet footer, never in a table or fact row.
  const footer = all(wrapper, n => attr(n, 'class') === 'admission-source-footer');
  assert.equal(footer.length, 1);
  const applicantText = (wrapper.childNodes ?? []).filter(n => n !== footer[0]).map(text).join('');
  assert.doesNotMatch(applicantText, /転用しない|流用しない|取り違えない|保留欄|推測していません|重複計上していない|加算していない|本表は|要項の図|図の小論文|要項\d+頁|要項\d+～\d+頁|要項に示されていない|と記載し|当該/u, 'Editorial instructions and source reports must not reach applicants');
  for (const anchor of all(wrapper, n => n.tagName === 'a' && /^https?:/u.test(attr(n, 'href') ?? ''))) {
    let parent = anchor;
    while (parent && parent !== footer[0]) parent = parent.parentNode;
    assert.equal(parent, footer[0]);
  }
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
        if (attr(entry, 'data-admission-population') !== undefined) {
          const populationText = clean(text(entry)).replace(/^募集人数/u, '');
          const expectedMain = scheme.id.startsWith('general-region-') ? '地域枠全体で13人予定全国・県内別は未公表'
            : scheme.id.startsWith('ib-') ? '7月・10月合計3人募集月別の人数は未公表' : sentences(expected.value)[0].replace(/。$/u, '');
          assert.equal(populationText, clean(expectedMain));
          const extras = all(wrapper, n => attr(n, 'data-admission-extra-origin') === origin);
          const extraValue = scheme.id.startsWith('general-region-') ? sentences(expected.value)[2]
            : ['general-early','recommendation-region'].includes(scheme.id) ? sentences(expected.value).slice(1).join('') : '';
          assert.equal(extras.length, extraValue ? 1 : 0);
          if (extraValue) {
            const value = all(extras[0], n => attr(n, 'data-admission-value') !== undefined)[0];
            assert.equal(clean(text(value)), clean(displayText(extraValue)));
          }
        } else if (entry === scoreTable) {
          assert.equal(expected.label, '共通テスト配点');
        } else {
          const values = all(entry, n => attr(n, 'data-admission-value') !== undefined);
          assert.equal(values.length, 1);
          const individual = scheme.id === 'general-early' && kind === 'exam' && expected.label === '個別試験科目・配点';
          const expectedValue = individual ? sentences(expected.value).slice(2).join('') : displayText(expected.value);
          assert.equal(clean(text(values[0])), clean(expectedValue), `${origin}: unique conditions must remain`);
          const labels = all(entry, n => attr(n, 'data-admission-label') !== undefined);
          assert.equal(labels.length, 1);
          assert.equal(text(labels[0]), individual ? '個別理科の選択' : expected.label);
        }
        assert.equal(attr(entry, 'data-admission-status'), expected.status);
        assert.deepEqual(JSON.parse(attr(entry, 'data-admission-source-ids')), expected.sourceIds);
        rows++;
      }
    }
    for (const [index, expected] of scheme.notes.entries()) {
      const entries = all(schemes[0], n => attr(n, 'data-admission-note') === String(index));
      if (scheme.id.startsWith('general-region-') || (scheme.id === 'overseas' && index === 1)) {
        assert.equal(entries.length, 0, 'Redundant quota or source audit prose must not be repeated');
        continue;
      }
      assert.equal(entries.length, 1);
      const values = all(entries[0], n => attr(n, 'data-admission-note-text') !== undefined);
      assert.equal(clean(text(values[0])), clean(displayText(expected.text)));
      assert.deepEqual(JSON.parse(attr(entries[0], 'data-admission-source-ids')), expected.sourceIds);
      notes++;
    }
  }
  assert.equal(all(wrapper, n => attr(n, 'data-admission-origin') !== undefined).length, rows, 'No unverified canonical rows');
  for (const [index, expected] of candidate.coverageNotes.entries()) {
    const entries = all(wrapper, n => attr(n, 'data-admission-coverage-note') === String(index));
    if ([0, 1, 2, 4].includes(index)) { assert.equal(entries.length, 0); continue; }
    assert.equal(entries.length, 1);
    const value = index === 3 ? '一般選抜の2027年度募集要項は2026年10月下旬に公開予定です。詳細が公表され次第、このページを更新します。' : displayText(expected);
    assert.equal(clean(text(entries[0])), clean(value));
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
  return { rows, notes, coverage: all(wrapper, n => attr(n, 'data-admission-coverage-note') !== undefined).length, sources: candidate.sources.length, schemes: candidate.schemes.length };
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
