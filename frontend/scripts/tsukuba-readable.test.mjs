import fs from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse } from 'parse5';
import { renderUniversityAdmissions, applyUniversityAdmissionsFromIndex } from '../src/lib/universityAdmissions.ts';
import { readableAdmissionValue } from '../src/lib/tsukubaAdmissionsReadable.ts';

import { verifyReadableHtml, attr, all, text, clean } from './verify-tsukuba-readable.mjs';
const data = JSON.parse(fs.readFileSync(new URL('../src/data/universityAdmissions/tsukuba.json', import.meta.url), 'utf8'));

test('all 130 canonical rows are represented without editorial instructions, redundant notes or inline sources', () => {
  assert.deepEqual(verifyReadableHtml(renderUniversityAdmissions(data)), { rows: 130, notes: 8, coverage: 2, sources: 11, schemes: 9 });
});
test('dates, mandatory conditions and unknown values are not hidden in disclosure controls', () => {
  const html = renderUniversityAdmissions(data);
  const tree = parse(html);
  for (const node of all(tree, n => attr(n, 'data-admission-value') !== undefined || attr(n, 'data-admission-note-text') !== undefined)) {
    for (let ancestor = node; ancestor; ancestor = ancestor.parentNode) {
      assert.equal(attr(ancestor, 'hidden'), undefined);
      assert.notEqual(attr(ancestor, 'aria-hidden'), 'true');
      assert.notEqual(ancestor.tagName, 'details');
    }
  }
  assert.ok(html.includes('次の全条件が必要。'));
  assert.equal(all(parse(html), n => n.tagName === 'li' && n.parentNode?.tagName === 'ul' && attr(n.parentNode, 'class') === 'admission-conditions').length, 5);
});
test('score summary binds to canonical scores and rejects inconsistent totals', () => {
  const html = renderUniversityAdmissions(data);
  assert.ok(html.includes('950点') && html.includes('1,400点') && html.includes('2,350点'));
  const changed = structuredClone(data);
  changed.schemes[0].examRows.find(r => r.label === '共通テスト配点').value = changed.schemes[0].examRows.find(r => r.label === '共通テスト配点').value.replace('計950点', '計900点');
  assert.throws(() => renderUniversityAdmissions(changed), /score totals/);
});
test('formatting escapes HTML and keeps nested comma-separated alternatives intact', () => {
  const value = '①条件（例A、例B）、②条件。<script>alert(1)</script>';
  assert.equal(clean(text(parse(readableAdmissionValue(value, true)))), clean(value));
  assert.ok(!readableAdmissionValue(value).includes('<script>'));
});
test('admissions precede the university overview, key points summarize the entrance exams and repeated transformation remains stable', () => {
  const posts = JSON.parse(fs.readFileSync(new URL('../src/data/generated/admissionInfoPosts.json', import.meta.url), 'utf8'));
  const raw = posts.find(p => p.path === data.path), index = new Map([[data.path, data]]);
  const first = applyUniversityAdmissionsFromIndex(raw, index), second = applyUniversityAdmissionsFromIndex(first, index);
  assert.ok(first.contentHtml.indexOf('id="最新の入試情報"') < first.contentHtml.indexOf('大学基本情報'));
  assert.deepEqual(first.keyPoints, [
    '一般選抜（一般枠）は前期44人。個別試験は2027年2月25日・26日で、後期日程はありません。',
    '一般枠の配点は共通テスト950点＋個別試験1,400点＝計2,350点。個別試験には筆記の適性試験と面接を含みます。',
    '推薦入試（一般）は44人募集、試験日は2026年11月26日・27日。共通テストは課しません。',
  ]);
  assert.deepEqual(second, first);
});

test('conditional acceptance announcements and result submission stay in the timeline', () => {
  const tree = parse(renderUniversityAdmissions(data));
  const section = all(tree, n => attr(n, 'data-admission-scheme') === 'ib-october')[0];
  for (const label of ['合格・条件付合格発表', '条件付合格後の成績提出']) {
    const node = all(section, n => attr(n, 'data-admission-label') !== undefined && text(n) === label)[0];
    assert.equal(node.parentNode.tagName, 'tr');
  }
});
