import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import {
  waitlistSchools, alphabeticalWaitlistSchools, waitlistCheckedAt,
  waitlistAdmissionYear, waitlistFaqs, waitlistMetricLabels,
} from '../src/data/medicalWaitlist.ts';
import { waitlist2025AdmissionYear, waitlist2025Schools } from '../src/data/medicalWaitlist2025.ts';
import { historicalWaitlistSchools } from '../src/data/medicalWaitlistHistory.ts';
import { waitlistTableSchools } from '../src/data/medicalWaitlistTables.ts';
import { publicWaitlistInformation, publicWaitlistResult, publicWaitlistSchool, publicWaitlistTableNote } from '../src/data/medicalWaitlistPublic.ts';
import { waitlistTableValue, waitlistValueMeaning } from '../src/data/medicalWaitlistPresentation.ts';
import { waitlistFootnotes } from '../src/data/medicalWaitlistFootnotes.ts';
import { normalizedWaitlistCellValue, unnumberedWaitlistFindings } from '../src/data/medicalWaitlistMissingValues.ts';

const expectedNames = [
  '岩手医科大学', '東北医科薬科大学', '自治医科大学', '獨協医科大学', '埼玉医科大学',
  '国際医療福祉大学', '杏林大学', '慶應義塾大学', '順天堂大学', '昭和医科大学',
  '帝京大学', '東京医科大学', '東京慈恵会医科大学', '東京女子医科大学', '東邦大学',
  '日本大学', '日本医科大学', '北里大学', '聖マリアンナ医科大学', '東海大学',
  '金沢医科大学', '愛知医科大学', '藤田医科大学', '大阪医科薬科大学', '関西医科大学',
  '近畿大学', '兵庫医科大学', '川崎医科大学', '久留米大学', '産業医科大学', '福岡大学',
];
const school = (name) => waitlistSchools.find((entry) => entry.name === name);
const iwateHistoricalRows = () => [
  { year: '2024', values: ['43', '3', '5'] },
  ...historicalWaitlistSchools.find((entry) => entry.name === '岩手医科大学').rows
    .filter((row) => Number(row.year) <= 2023)
    .map((row) => ({ year: row.year, values: [row.values[0], '—', '—'] })),
];
const expectedLegacyDisplay = (schoolIndex, year, column, value) => {
  if (schoolIndex === 2 && ['2019', '2020'].includes(year) && column === 2) return '番号なし';
  return /^(?:—|-|非公開|なし？)$/.test(value) ? '不明' : value;
};

test('missing values distinguish a verified unnumbered route from an unknown result', () => {
  const value = (id, year, column) => waitlistTableSchools.find((entry) => entry.id === id)
    .rows.find((row) => row.year === year).cells[column].displayValue;
  assert.equal(value('school-3', '2020', 2), '番号なし');
  assert.equal(value('school-3', '2019', 2), '番号なし');
  assert.equal(value('teikyo', '2026', 0), '番号なし');
  assert.equal(value('teikyo', '2025', 0), '番号なし');
  assert.equal(value('school-4', '2018', 0), '不明', 'non-public reached rank does not prove an unnumbered system');
  assert.equal(value('school-7', '2018', 0), '不明');
  assert.equal(value('school-20', '2024', 0), '不明', 'an unknown headcount stays unknown even when candidates have no rank');
  assert.equal(value('school-21', '2026', 0), '不明', 'a report omitting rank cannot establish no-number policy');
  assert.equal(value('school-2', '2023', 1), '不明', 'missing historical regional results are not zero');
  assert.equal(value('school-12', '2023', 1), '不明', 'an uncertain なし？ is not an exact zero');
  assert.equal(value('school-26', '2026', 0), '不明', 'a route-unspecified number must not be assigned to the early period');
  assert.equal(value('school-16', '2025', 2), '不明', 'a regional report must not be assigned to a different common-test route');
  assert.equal(value('school-3', '2024', 0), '0', 'verified zero remains zero');
  assert.equal(normalizedWaitlistCellValue('teikyo', '2024', 0), '不明', 'findings are bounded to the researched year');
  assert.equal(normalizedWaitlistCellValue('school-3', '2020', 2, '7'), '7', 'numeric values always take priority');
  for (const finding of unnumberedWaitlistFindings) {
    assert.ok(finding.reason && finding.urls.length && finding.years.length && finding.columns.length);
    assert.ok(finding.urls.every((url) => new URL(url).protocol === 'https:'));
  }
});

test('every table cell has an explicit display value without changing the raw archive', () => {
  for (const table of waitlistTableSchools) for (const row of table.rows) for (const cell of row.cells) {
    assert.ok(cell.displayValue, `${table.name} ${row.year}`);
    assert.doesNotMatch(cell.displayValue, /^(?:[—−–―ー-]+|非公[開表]|なし[？?])$/);
    if (cell.records.length) assert.equal(cell.displayValue, waitlistTableValue(cell.records[0]));
    if (cell.legacyValue && !/^(?:[—−–―ー-]+|非公[開表]|なし[？?])$/.test(cell.legacyValue)) {
      assert.equal(cell.displayValue, cell.legacyValue, 'every numeric/group/approximate original value stays intact');
    }
  }
});

test('the waitlist-count FAQ explains that counts excluding decliners can understate actual offers', () => {
  assert.equal(waitlistFaqs[1].question, '繰り上げ合格者が50人なら、補欠50番までしか回ってないってこと？');
  assert.match(waitlistFaqs[1].answer, /入学を辞退した人が含まれていない場合/);
  assert.match(waitlistFaqs[1].answer, /実際に合格の連絡を受けた人は掲載人数より多く/);
  assert.match(waitlistFaqs[1].answer, /補欠50番より先/);
});

test('the general-admission rank examples use ranks, not headcounts or common-test routes', () => {
  const kitasato = waitlistTableSchools.find((entry) => entry.id === 'school-6');
  assert.deepEqual(kitasato.columns, ['一般選抜']);
  assert.equal(kitasato.rows.find((row) => row.year === '2021').cells[0].legacyValue, '275');
  assert.ok(kitasato.historical.notes.includes('表記の数値は補欠番号です。'));
  const osaka = waitlistTableSchools.find((entry) => entry.id === 'school-3');
  const minimumExample = osaka.rows.find((row) => row.year === '2025').cells[1].records[0];
  assert.equal(minimumExample.route, '一般後期');
  assert.equal(minimumExample.metric, 'rank');
  assert.equal(waitlistTableValue(minimumExample), '1');
});

test('all 31 private medical schools appear exactly once in both the data and index', () => {
  assert.equal(waitlistSchools.length, 31);
  assert.equal(new Set(waitlistSchools.map((entry) => entry.id)).size, 31);
  assert.deepEqual(new Set(waitlistSchools.map((entry) => entry.name)), new Set(expectedNames));
  assert.deepEqual(new Set(alphabeticalWaitlistSchools.map((entry) => entry.id)), new Set(waitlistSchools.map((entry) => entry.id)));
  assert.equal(alphabeticalWaitlistSchools.length, 31);
});

test('legacy deep links keep their original universities', () => {
  const originalNames = ['愛知医科大学', '岩手医科大学', '大阪医科薬科大学', '金沢医科大学', '関西医科大学', '北里大学', '杏林大学', '近畿大学', '久留米大学', '慶應義塾大学', '国際医療福祉大学', '埼玉医科大学', '産業医科大学', '昭和医科大学', '聖マリアンナ医科大学', '東海大学', '東京医科大学', '東京慈恵会医科大学', '東京女子医科大学', '東北医科薬科大学', '獨協医科大学', '日本医科大学', '日本大学', '兵庫医科大学', '福岡大学', '藤田医科大学'];
  originalNames.forEach((name, index) => assert.equal(school(name)?.id, `school-${index + 1}`));
});

test('each record carries explicit provenance, a metric and a valid evidence date', () => {
  assert.equal(waitlistAdmissionYear, 2026);
  assert.match(waitlistCheckedAt, /^2026-\d{2}-\d{2}$/);
  for (const entry of waitlistSchools) {
    assert.ok(entry.records.length > 0);
    for (const row of entry.records) {
      assert.ok(row.route && row.result && row.source.title, entry.name);
      assert.ok(Object.hasOwn(waitlistMetricLabels, row.metric), entry.name);
      const url = new URL(row.source.url);
      assert.equal(url.protocol, 'https:');
      assert.ok(['official', 'prep'].includes(row.source.kind));
      if (row.source.kind === 'prep') {
        assert.ok(['www.fujigakuin.jp', 'melurix.co.jp', 'daikanyamamedical.com'].includes(url.hostname));
        assert.ok(row.asOf, `${entry.name}: secondary evidence needs its own date`);
        assert.notEqual(row.metric, 'count', 'individual student reports must not become university-wide counts');
      }
      if (row.asOf) {
        assert.match(row.asOf, /^2026-\d{2}-\d{2}$/);
        assert.equal(new Date(row.asOf).toISOString().slice(0, 10), row.asOf);
        assert.ok(row.asOf <= waitlistCheckedAt);
      }
      if (['rank-case', 'group-case'].includes(row.metric)) assert.match(row.result, /合格例/);
      if (row.metric === 'count') { assert.match(row.result, /\d+人/); assert.doesNotMatch(row.result, /\d+番/); }
      if (row.metric === 'unknown') { assert.match(row.result, /未確認/); assert.doesNotMatch(row.result, /0人|なし|非公表/); }
    }
  }
});

test('verified official counts are not mislabeled as ranks', () => {
  const expected = new Map([
    ['愛知医科大学', ['繰上合格者83人', '繰上合格者39人', '繰上合格者5人']],
    ['慶應義塾大学', ['補欠から入学許可47人']],
    ['久留米大学', ['繰上合格者41人', '繰上合格者2人']],
    ['東京慈恵会医科大学', ['繰上合格連絡者118人']],
    ['産業医科大学', ['追加合格者20人', '追加合格者0人', '追加合格者0人']],
    ['福岡大学', ['追加合格者28人', '追加合格者25人']],
  ]);
  for (const [name, results] of expected) {
    const counts = school(name).records.filter((row) => row.metric === 'count');
    assert.deepEqual(counts.map((row) => row.result), results);
    assert.ok(counts.every((row) => row.source.kind === 'official'));
  }
});

test('Aichi March 31 15:00 ranks are not equated with annual headcounts', () => {
  const records = school('愛知医科大学').records;
  const ranks = records.filter((row) => row.metric === 'rank');
  assert.deepEqual(ranks.map((row) => row.result), ['第1補欠79位まで', '第1補欠38位まで', '補欠5位まで']);
  assert.ok(ranks.every((row) => row.asOf === '2026-03-31' && row.note.startsWith('15時時点') && row.source.kind === 'official'));
  assert.ok(ranks.every((row) => row.source.url === 'https://www.aichi-med-u.ac.jp/su11/su1101/su110101/1236862_1888.html'));
});

test('official year-end Saitama result supersedes the March snapshot', () => {
  assert.deepEqual(school('埼玉医科大学').records.map((row) => row.result), ['繰上順位104位', '繰上順位8位', '繰上順位17位']);
  assert.deepEqual(school('東京医科大学').records.map((row) => row.result), ['補欠順位151位まで', '補欠順位70位まで']);
});

test('later official correction and later unnumbered reports remain visible', () => {
  const marianna = school('聖マリアンナ医科大学');
  assert.ok(marianna.records.some((row) => row.metric === 'notice' && row.asOf === '2026-04-08' && row.source.kind === 'official'));
  assert.match(marianna.records.find((row) => row.route === '共通テスト利用').result, /訂正前/);
  assert.match(marianna.note, /訂正後の最終順位は未確認/);
  assert.ok(school('藤田医科大学').records.some((row) => row.metric === 'report' && row.asOf === '2026-03-31'));
  assert.ok(school('帝京大学').noteSources.some((source) => source.kind === 'official'));
});

test('all 2025 records are dated for the correct year and linked to the same 31 universities', () => {
  assert.equal(waitlist2025AdmissionYear, 2025);
  assert.equal(waitlist2025Schools.length, 31);
  assert.deepEqual(waitlist2025Schools.map(({ id, name }) => ({ id, name })), waitlistSchools.map(({ id, name }) => ({ id, name })));
  for (const entry of waitlist2025Schools) {
    assert.ok(entry.records.length);
    for (const row of entry.records) {
      assert.ok(row.route && row.result && row.source.title);
      assert.ok(Object.hasOwn(waitlistMetricLabels, row.metric));
      const url = new URL(row.source.url);
      assert.equal(url.protocol, 'https:');
      assert.ok(['official', 'prep'].includes(row.source.kind));
      if (row.source.kind === 'prep') {
        assert.ok(['www.fujigakuin.jp', 'melurix.co.jp', 'daikanyamamedical.com'].includes(url.hostname));
        assert.ok(row.asOf);
        assert.notEqual(row.metric, 'count');
      }
      if (row.asOf) {
        assert.match(row.asOf, /^2025-\d{2}-\d{2}$/);
        assert.equal(new Date(row.asOf).toISOString().slice(0, 10), row.asOf);
      }
      if (['rank-case', 'group-case'].includes(row.metric)) assert.match(row.result, /合格例/);
      if (row.metric === 'count') { assert.match(row.result, /\d+人/); assert.doesNotMatch(row.result, /\d+番/); }
      if (row.metric === 'unknown') { assert.match(row.result, /未確認/); assert.doesNotMatch(row.result, /0人|なし|非公表/); }
    }
  }
});

test('2025 official counts and official ranks remain distinct from individual cases', () => {
  const school2025 = (name) => waitlist2025Schools.find((entry) => entry.name === name);
  const expected = new Map([
    ['愛知医科大学', ['繰上合格者27人', '繰上合格者8人', '繰上合格者0人']],
    ['岩手医科大学', ['初回発表後の追加分17人', '初回発表後の追加分4人', '初回発表後の追加分4人']],
    ['慶應義塾大学', ['補欠から入学許可33人']],
    ['東京慈恵会医科大学', ['繰上合格連絡者67人']],
    ['産業医科大学', ['追加合格者10人', '追加合格者0人', '追加合格者0人']],
    ['福岡大学', ['追加合格者51人', '追加合格者13人']],
  ]);
  for (const [name, results] of expected) {
    assert.deepEqual(school2025(name).records.map((row) => row.result), results);
    assert.ok(school2025(name).records.every((row) => row.metric === 'count' && row.source.kind === 'official'));
  }
  const kurume = school2025('久留米大学').records;
  assert.deepEqual(kurume.filter((row) => row.metric === 'count').map((row) => row.result), ['繰上合格者19人', '繰上合格者2人']);
  assert.equal(kurume.find((row) => row.metric === 'rank-case').result, '合格例：補欠43番');
  assert.deepEqual(school2025('東京医科大学').records.map((row) => row.result), ['補欠順位89位まで', '補欠順位49位まで']);
});

test('the complete original archive stays intact (26 schools, 281 rows, columns and notes)', () => {
  assert.equal(historicalWaitlistSchools.length, 26);
  assert.equal(historicalWaitlistSchools.reduce((count, entry) => count + entry.rows.length, 0), 281);
  // Snapshot independently compared to the original page in ed6a28c3, not the replacement dataset.
  assert.equal(createHash('sha256').update(JSON.stringify(historicalWaitlistSchools)).digest('hex'), 'f4b38ce684eff526060bf2b0fffc646db419c514c1488bd4f8986c38cf513180');
});

test('2025 and 2026 prepend every table; only Iwate transposes its historical route rows', () => {
  assert.equal(waitlistTableSchools.length, 31);
  assert.deepEqual(waitlistTableSchools.map(({ id, name }) => ({ id, name })), waitlistSchools.map(({ id, name }) => ({ id, name })));
  historicalWaitlistSchools.forEach((legacy, index) => {
    const table = waitlistTableSchools[index];
    assert.ok(table.columns.length >= legacy.columns.length);
    if (legacy.name === '岩手医科大学') {
      assert.deepEqual(table.rows.filter((row) => row.legacy).map((row) => ({ year: row.year, values: row.cells.map((cell) => cell.legacyValue ?? '—') })), iwateHistoricalRows());
    } else {
      assert.deepEqual(table.rows.filter((row) => row.legacy).map((row) => ({year:row.year, values:row.cells.slice(0, legacy.columns.length).map((cell) => cell.legacyValue)})), legacy.rows);
    }
    assert.equal(table.tone, (index % 4) + 1, 'original university color order');
    const newRows = table.rows.filter((row) => !row.legacy);
    assert.match(newRows[0].year, /^2026/);
    assert.match(newRows.at(-1).year, /^2025/);
    assert.ok(table.rows.indexOf(newRows.at(-1)) < table.rows.findIndex((row) => row.legacy));
  });
});

test('every sourced record appears once in a cell or annotation without extra notice columns', () => {
  for (const table of waitlistTableSchools) {
    const renderedRecords = [...table.rows.flatMap((row) => row.cells.flatMap((cell) => cell.records)), ...table.annotations.flatMap((entry) => entry.records)];
    const originals = [...waitlistSchools.find((s) => s.id === table.id).records, ...waitlist2025Schools.find((s) => s.id === table.id).records];
    assert.equal(renderedRecords.length, originals.length, table.name);
    for (const record of originals) assert.equal(renderedRecords.filter((entry) => entry === record).length, 1, `${table.name}: ${record.result}`);
    for (const row of table.rows) assert.equal(row.cells.length, table.columns.length);
  }
});

test('minimal route columns keep counts/ranks explicit and do not guess unspecified periods', () => {
  const table = (id) => waitlistTableSchools.find((s) => s.id === id);
  const additionalRouteColumns = new Map([['school-2', 2], ['school-5', 2], ['school-8', 2], ['school-12', 1], ['school-15', 2], ['school-21', 1]]);
  for (const [index, original] of historicalWaitlistSchools.entries()) {
    const id = `school-${index + 1}`;
    assert.equal(table(id).columns.length, original.columns.length + (additionalRouteColumns.get(id) ?? 0), id);
    assert.ok(table(id).columns.every((name) => !/お知らせ|合格例|合格報告|未確認/.test(name)), id);
  }
  const iwate = table('school-2');
  assert.equal(iwate.rows.find((row) => row.year === '2025').cells[1].records[0].result, '初回発表後の追加分4人');
  assert.equal(iwate.rows.find((row) => row.year === '2026').cells[1].records[0].result, '合格例：補欠1番');
  const fujita = table('school-26');
  assert.ok(fujita.rows[0].cells.every((cell) => cell.records.length === 0));
  assert.equal(fujita.annotations.find((entry) => entry.year === 2026).records.length, 6);
  assert.equal(fujita.rows[1].cells[0].records.length, 1, 'main and regional routes must not become unlabeled numbers in one cell');
  assert.ok(fujita.annotations.find((entry) => entry.year === 2025).records.some((record) => record.route === '共通テスト利用'));
  assert.ok(fujita.annotations.find((entry) => entry.year === 2025).records.some((record) => record.route === '一般前期・愛知県地域枠'));
  const kurume = table('school-9');
  assert.equal(kurume.rows[0].cells[0].displayValue, '41', 'a reported rank must not overwrite the official count');
  const kurume2026Rank = kurume.annotations.find((entry) => entry.year === 2026).records[0];
  assert.equal(kurume2026Rank.result, '合格例：補欠72番');
  assert.equal(kurume2026Rank.asOf, '2026-03-30');
  assert.equal(kurume2026Rank.metric, 'rank-case');
  assert.equal(publicWaitlistInformation(kurume2026Rank), '受験生からの合格報告');
  assert.equal(kurume.rows[1].cells[0].records[0].result, '繰上合格者19人');
  assert.equal(kurume.rows[1].cells[0].records.length, 1);
  assert.equal(kurume.annotations.find((entry) => entry.year === 2025).records[0].result, '合格例：補欠43番');
  assert.equal(table('school-1').rows[0].cells[0].records[0].result, '第1補欠79位まで');
  assert.equal(table('school-1').rows[0].cells[1].records[0].result, '繰上合格者83人');
  assert.ok(table('school-16').annotations.find((entry) => entry.year === 2025).records.some((row) => row.route === '神奈川県地域枠'));
});

test('Iwate has three route columns and treats every pre-2024 figure as general', () => {
  const iwate = waitlistTableSchools.find((entry) => entry.id === 'school-2');
  assert.deepEqual(iwate.columns, ['一般', '地域枠C', '地域枠D']);
  assert.deepEqual(iwate.rows.filter((row) => !row.legacy).map((row) => [row.year, ...row.cells.map((cell) => waitlistTableValue(cell.records[0]))]), [
    ['2026', '82', '1', '12'], ['2025', '17', '4', '4'],
  ]);
  assert.deepEqual(iwate.rows.filter((row) => row.legacy).map((row) => ({ year: row.year, values: row.cells.map((cell) => cell.legacyValue ?? '—') })), iwateHistoricalRows());
  assert.equal(new Set(iwate.rows.map((row) => row.year)).size, iwate.rows.length, 'one row per year');
  assert.equal(iwate.rows.filter((row) => row.legacy).reduce((total, row) => total + row.cells.filter((cell) => cell.legacyValue !== undefined).length, 0), 14, 'all original figures retained');
  for (const row of iwate.rows.filter((row) => Number(row.year) <= 2023)) {
    assert.ok(row.cells[0].legacyValue);
    assert.ok(row.cells.slice(1).every((cell) => cell.legacyValue === undefined && cell.records.length === 0), 'unknown regional figures stay blank, not zero');
  }
});

test('table values are numeric, retaining approximate ranges/groups and keeping unknowns separate from zero', () => {
  for (const entry of [...waitlistSchools, ...waitlist2025Schools]) {
    for (const record of entry.records) {
      const result = publicWaitlistResult(record);
      if (['rank-case', 'group-case'].includes(record.metric)) {
        assert.equal(result, `${record.result.replace(/^合格例：/, '')}での合格報告`);
      } else {
        assert.equal(result, record.result);
      }
      assert.doesNotMatch(result, /合格例|（報告あり）/);
      const value = waitlistTableValue(record);
      if (record.metric === 'count') assert.match(value, /^\d+$/);
      else if (['rank', 'rank-case'].includes(record.metric)) assert.match(value, /^\d+(?:台(?:前半|後半)?|前後)?$/);
      else if (record.metric === 'group-case') assert.match(value, /^[A-D](?:群|ランク)$/);
      else assert.equal(value, '不明');
      assert.ok(waitlistValueMeaning(record));
    }
  }
  assert.equal(waitlistTableValue(school('愛知医科大学').records.find((row) => row.metric === 'rank')), '79', '第1補欠 must not yield 1');
  assert.equal(waitlistTableValue(school('東海大学').records.find((row) => row.route === '共通テスト利用')), '10台前半');
  assert.equal(waitlistTableValue(school('岩手医科大学').records[0]), '82');
  assert.equal(waitlistTableValue(waitlist2025Schools.find((entry) => entry.name === '岩手医科大学').records[0]), '17');
  assert.equal(waitlistTableValue(school('産業医科大学').records[1]), '0');
});

test('Kansai 2026 general early preserves the user-approved approximate rank', () => {
  const record = school('関西医科大学').records.find((entry) => entry.route === '一般前期');
  assert.equal(record.result, '合格例：補欠110番前後');
  assert.equal(record.metric, 'rank-case', 'an editorial approximation is not an official final rank');
  assert.equal(record.asOf, '2026-04-02');
  assert.equal(record.evidenceBasis, 'unconfirmed');
  assert.equal(new URL(record.source.url).hostname, 'daikanyamamedical.com');
  assert.equal(waitlistTableValue(record), '110前後');
  assert.equal(waitlistTableValue({ ...record, result: '合格例：補欠110前後' }), '110前後', 'both approximate forms retain the qualifier');
  assert.match(publicWaitlistSchool(school('関西医科大学')).records[0].result, /110番前後/);
  const table = waitlistTableSchools.find((entry) => entry.id === 'school-5');
  assert.deepEqual(table.rows.find((row) => row.year === '2026').cells.map((cell) => cell.displayValue), ['110前後', '3', '40']);
  assert.equal(table.rows.find((row) => row.year === '2025').cells[0].displayValue, '168');
});

test('NMS 2026 general late preserves the user-approved early-forties range', () => {
  const nms = school('日本医科大学');
  const record = nms.records.find((entry) => entry.route === '一般後期');
  assert.equal(record.result, '合格例：補欠40番台前半');
  assert.equal(record.metric, 'rank-case', 'an editorial range is not an official final rank');
  assert.equal(record.asOf, '2026-04-02');
  assert.equal(record.evidenceBasis, 'unconfirmed');
  assert.equal(new URL(record.source.url).hostname, 'daikanyamamedical.com');
  assert.equal(waitlistTableValue(record), '40台前半');
  assert.match(publicWaitlistSchool(nms).records.find((entry) => entry.route === '一般後期').result, /40番台前半/);
  const table = waitlistTableSchools.find((entry) => entry.id === 'school-22');
  assert.deepEqual(table.rows.find((row) => row.year === '2026').cells.map((cell) => cell.displayValue), ['90台前半', '40台前半']);
  const regional = nms.records.find((entry) => entry.route === '一般前期・千葉県地域枠');
  assert.equal(waitlistTableValue(regional), '5');
  assert.equal(regional.asOf, '2026-03-17');
});

test('each displayed value has a year-scoped meaning, and no cell mixes counts with ranks', () => {
  for (const table of waitlistTableSchools) {
    for (const row of table.rows.filter((row) => !row.legacy)) {
      for (const cell of row.cells) {
        assert.ok(cell.records.length <= 1, table.name);
        for (const record of cell.records) {
          assert.ok(!['report', 'notice', 'unknown'].includes(record.metric));
          assert.ok(table.numericNotes.find(({ year }) => row.year.startsWith(String(year))).notes.some((note) => note.includes(waitlistValueMeaning(record))), `${table.name}: ${row.year} / ${record.result}`);
        }
      }
    }
  }
  assert.equal(waitlistValueMeaning(school('東京慈恵会医科大学').records[0]), '繰上合格の連絡を受けた人数。');
  assert.equal(waitlistValueMeaning(school('慶應義塾大学').records[0]), '繰上合格の許可人数。');
  assert.equal(waitlistValueMeaning(school('久留米大学').records[0]), '繰上合格者数（辞退者を含むか不明）。');
  assert.match(waitlistTableSchools.find((table) => table.id === 'school-2').numericNotes.find(({ year }) => year === 2025).notes[0], /初回発表後の追加合格者数（辞退者を含むか不明）/);
});

test('table footnotes use compact positive labels without changing the archived evidence', () => {
  assert.equal(publicWaitlistTableNote('表記の数値は補欠番号です。'), '繰り上がった順位。');
  for (const note of [
    '公表されている繰上合格者には入学辞退者が含まれていません。',
    '上記の繰上合格者数には入学辞退者が含まれていません。',
    '繰上合格者には入学辞退者が含まれていません。',
  ]) assert.equal(publicWaitlistTableNote(note), '入学辞退者を含まない人数。');
  for (const record of [...waitlistSchools, ...waitlist2025Schools].flatMap((entry) => entry.records)) {
    const meaning = waitlistValueMeaning(record);
    assert.ok(meaning.length <= 30, meaning);
    assert.doesNotMatch(meaning, /ではありません|最終到達|公表資料に記載/);
    if (record.metric === 'rank') assert.equal(meaning, '繰り上がった順位。');
    if (record.metric === 'rank-case') assert.equal(meaning, '繰り上がった順位（報告分）。');
  }
  assert.equal(publicWaitlistTableNote(school('愛知医科大学').note), null, 'do not repeat the numbers/types already explained');
  assert.equal(publicWaitlistTableNote(school('聖マリアンナ医科大学').note), '共テ15は4/8の訂正前。訂正後の順位は未確認。');
});

test('public records retain facts/units/dates but never expose source names or links', () => {
  for (const entry of [...waitlistSchools, ...waitlist2025Schools]) {
    const data = publicWaitlistSchool(entry);
    assert.equal(data.records.length, entry.records.length);
    data.records.forEach((record, index) => {
      for (const key of ['route', 'metric', 'asOf']) assert.equal(record[key], entry.records[index][key]);
      assert.equal(record.result, publicWaitlistResult(entry.records[index]));
      assert.equal(record.displayValue, waitlistTableValue(entry.records[index]));
      assert.equal(record.valueMeaning, waitlistValueMeaning(entry.records[index]));
      assert.equal(record.informationType, publicWaitlistInformation(entry.records[index]));
      assert.ok(!Object.hasOwn(record, 'source'));
    });
    assert.doesNotMatch(JSON.stringify(data), /合格例|富士学院|メルリックス|代官山|fujigakuin|melurix|daikanyamamedical|https?:\/\//);
    assert.ok(!Object.hasOwn(data, 'noteSources'));
  }
});

test('identical numeric meanings are merged across years; scopes only distinguish different meanings', () => {
  for (const id of ['school-3', 'school-4', 'school-5', 'school-6', 'school-7', 'school-8', 'school-12', 'school-15', 'school-17', 'school-19', 'school-22', 'school-23']) {
    const table = waitlistTableSchools.find((entry) => entry.id === id);
    assert.deepEqual(waitlistFootnotes(table).filter((note) => note.label === '数値'), [{ label: '数値', text: '繰り上がった順位。' }], table.name);
  }
  const iwate = waitlistFootnotes(waitlistTableSchools.find((entry) => entry.id === 'school-2'));
  assert.deepEqual(iwate.filter((note) => note.label === '数値').map((note) => note.text), [[
    '2026年度：繰り上がった順位。',
    '2025年度：初回発表後の追加合格者数（辞退者を含むか不明）。',
    '2013〜2024年度：入学辞退者を含まない人数。',
  ].join(' ')]);
  for (const table of waitlistTableSchools) {
    const notes = waitlistFootnotes(table);
    assert.ok(notes.length);
    for (const label of ['数値', '情報', '時点']) assert.ok(notes.filter((note) => note.label === label).length <= 1, `${table.name}: do not repeat the same category for every year`);
    assert.doesNotMatch(JSON.stringify(notes), /2024年度以前：|富士学院|メルリックス|代官山|https?:/);
    if (table.historical) {
      assert.ok(notes.some((note) => note.label === '情報' && note.text.includes('出典未確認。')), table.name);
    }
  }
  const iuhw = waitlistFootnotes(waitlistTableSchools.find((entry) => entry.id === 'school-11'));
  assert.deepEqual(iuhw.filter((note) => note.label === '数値'), [{ label: '数値', text: '繰り上がった補欠ランク。' }]);
  assert.ok(iuhw.some((note) => note.label === '情報' && note.text.includes('出典未確認。')), 'archived letter ranks must not inherit the current student-report provenance');
});

test('official data, indirect university information, student reports and unknown origins stay distinct', () => {
  assert.equal(publicWaitlistInformation(school('愛知医科大学').records[0]), '大学公式情報');
  assert.equal(publicWaitlistInformation(school('大阪医科薬科大学').records[0]), '大学発表に基づく情報（間接確認）');
  assert.equal(publicWaitlistInformation(school('聖マリアンナ医科大学').records[0]), '大学への確認に基づく情報（間接確認）');
  assert.equal(publicWaitlistInformation(school('岩手医科大学').records[0]), '受験生からの合格報告');
  assert.equal(publicWaitlistInformation(school('藤田医科大学').records[3]), '受験生からの合格報告');
  assert.equal(publicWaitlistInformation(school('日本医科大学').records[0]), '合格報告（報告者未確認）');
  assert.equal(publicWaitlistInformation(waitlist2025Schools.find((entry) => entry.name === '金沢医科大学').records[0]), '情報の由来は未確認（間接情報）');
  for (const entry of [...waitlistSchools, ...waitlist2025Schools]) {
    for (const record of entry.records) assert.ok(publicWaitlistInformation(record));
  }
});

const builtPage = new URL('../dist/kuriage-information/index.html', import.meta.url);
test('built page, JSON and structured data describe the same visible evidence', { skip: !existsSync(builtPage) }, () => {
  const html = readFileSync(builtPage, 'utf8');
  const data = JSON.parse(readFileSync(new URL('../dist/data/medical-waitlist-2026.json', import.meta.url), 'utf8'));
  assert.equal(data.admissionYear, 2026);
  assert.deepEqual(data.schools, JSON.parse(JSON.stringify(waitlistSchools.map(publicWaitlistSchool))));
  assert.equal((html.match(/class="kuriage-school-card\b/g) ?? []).length, 31);
  for (const entry of [...waitlistSchools, ...waitlist2025Schools]) {
    assert.ok(html.includes(`id="${entry.id}"`), entry.id);
    const table = waitlistTableSchools.find((table) => table.id === entry.id);
    for (const row of entry.records) {
      if (table.annotations.some(({ records }) => records.includes(row))) assert.ok(html.includes(publicWaitlistResult(row)), `${entry.name}: ${publicWaitlistResult(row)}`);
    }
  }
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  const faq = schema['@graph'].find((item) => item['@type'] === 'FAQPage');
  assert.deepEqual(faq.mainEntity.map((item) => item.name), waitlistFaqs.map((item) => item.question));
  assert.deepEqual(faq.mainEntity.map((item) => item.acceptedAnswer.text), waitlistFaqs.map((item) => item.answer));
  assert.ok(html.includes(waitlistFaqs[1].question));
  assert.ok(html.includes(waitlistFaqs[1].answer));
  assert.ok(html.includes('繰上げ合格の連絡70人 − 入学辞退20人 ＝ 掲載人数50人'));
  assert.match(html, /<h2 id="results-title"[^>]*>だいたい補欠何番まで回ってくるの？<\/h2>/);
  assert.ok(!html.includes('各大学の繰上げ合格者数は？'));
  assert.doesNotMatch(html, /補欠100番なら、100人が合格したということ？|最終合格者150人 − 正規合格者100人/);
  const dataset = schema['@graph'].find((item) => item['@type'] === 'Dataset');
  assert.equal(dataset.distribution.contentUrl, 'https://lexus-ec.com/data/medical-waitlist.json');
  assert.equal(dataset.temporalCoverage, '2012/2026');
  const data2025 = JSON.parse(readFileSync(new URL('../dist/data/medical-waitlist-2025.json', import.meta.url), 'utf8'));
  assert.equal(data2025.admissionYear, 2025);
  assert.deepEqual(data2025.schools, JSON.parse(JSON.stringify(waitlist2025Schools.map(publicWaitlistSchool))));
  const archive = JSON.parse(readFileSync(new URL('../dist/data/medical-waitlist.json', import.meta.url), 'utf8'));
  assert.deepEqual(archive.years.map((entry) => entry.admissionYear), [2026, 2025]);
  assert.deepEqual(archive.historical.schools, historicalWaitlistSchools);
  assert.deepEqual(archive.tables, waitlistTableSchools.map(({ id, name, columns, rows }) => ({
    id, name, columns, rows: rows.map(({ year, cells }) => ({ year, values: cells.map(({ displayValue }) => displayValue) })),
  })));
  assert.equal(archive.historical.verificationStatus, 'legacy-unverified');
  for (const output of [html, JSON.stringify(data), JSON.stringify(data2025), JSON.stringify(archive)]) {
    assert.doesNotMatch(output, /合格例|富士学院|メルリックス|代官山|fujigakuin|melurix|daikanyamamedical/);
  }
  const main = html.match(/<main id="kuriage-main"[\s\S]*?<\/main>/)[0];
  assert.doesNotMatch(main, /<a[^>]+href="https?:/);
  assert.doesNotMatch(main, /waitlist-source|2024年度以前：/);
  assert.ok(!Object.hasOwn(dataset, 'citation'));
  assert.doesNotMatch(html, /waitlist-cell-date|waitlist-cell-route|waitlist-inline-results|<details[^>]*class="waitlist-legacy-notes"/);
  assert.ok(main.includes('掲載している一般選抜の例では、多い年で275番まで、少ない年で1番まで。'));
  assert.ok(main.includes('繰り上げがない年もあり、大学や年度によって大きく異なります。'));
  assert.ok(main.includes('最低でも5年分のデータを同じ大学・同じ入試方式で見比べ、自分の補欠番号まで回ってきそうか予想してみてください。'));
  assert.ok(!main.includes('2025・2026年度を、各大学の表の先頭に追加しています。'));
  assert.ok(!main.includes('「—」「-」は、番号なし・不明を表します。'));
  assert.ok(!main.includes('title="番号なし・不明"'));
  assert.doesNotMatch(main, /数字の意味は、各表の下に記載しています|各表の下に、数値の意味と情報の種類を記載しています|「報告分」は最終結果とは限りません|受験生からの合格報告は最終結果とは限りません|「—」「-」は未確認で、0人ではありません|title="数値未確認。0人ではありません。"/);
  assert.ok(html.includes('2027年度の補欠・繰上げ合格状況は、各大学の入試後に判明します。'));
  assert.ok(html.includes('https://lexus-ec.com/kuriage-information/'));
  const sitemap = readFileSync(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
  assert.ok(sitemap.includes(`<loc>https://lexus-ec.com/kuriage-information/</loc>\n    <lastmod>${waitlistCheckedAt}</lastmod>`));
});

test('new years and all historical figures share the original tables, not separate annual cards', { skip: !existsSync(builtPage) }, () => {
  const html = readFileSync(builtPage, 'utf8');
  const decode = (value) => value.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  const cells = (row) => [...row.matchAll(/<(?:th|td)\b[^>]*>([\s\S]*?)<\/(?:th|td)>/g)].map((match) => decode(match[1].replace(/<[^>]+>/g, '').trim()));
  for (const school of waitlistTableSchools) {
    const article = html.match(new RegExp(`<article id="${school.id}"[\\s\\S]*?</article>`))?.[0];
    assert.ok(article);
    assert.ok(article.includes(`aria-describedby="${school.id}-notes"`));
    assert.ok(article.includes(`id="${school.id}-notes"`));
    for (const note of waitlistFootnotes(school)) assert.ok(decode(article).includes(note.text), `${school.name}: consistent footnote remains visible`);
    for (const { records } of school.annotations) for (const record of records) assert.ok(decode(article).includes(publicWaitlistInformation(record)), `${school.name}: annotation has its own information category`);
    for (const note of school.historical?.notes ?? []) assert.ok(decode(article).includes(publicWaitlistTableNote(note)), `${school.name}: original footnote meaning remains visible`);
    for (const { data } of school.years) {
      const note = data.note && publicWaitlistTableNote(data.note);
      if (note) assert.ok(decode(article).includes(note), `${school.name}: essential supplementary note remains visible`);
    }
    assert.doesNotMatch(article, /合格者の人数ではありません|繰上合格した人数ではありません|入学者数ではありません/);
    const renderedRows = [...article.matchAll(/<tr\b[^>]*data-legacy="false"[^>]*>([\s\S]*?)<\/tr>/g)].map((match) => cells(match[1]));
    assert.deepEqual(renderedRows, school.rows.filter((row) => !row.legacy).map((row) => [row.year, ...row.cells.map((cell) => cell.displayValue)]), `${school.name}: cells show only values, not explanations/dates/tags`);
    const allCells = [...article.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map((match) => decode(match[1].replace(/<[^>]+>/g, '').trim()));
    assert.ok(allCells.every((value) => value && !/^(?:[—−–―ー-]+|非公[開表]|なし[？?])$/.test(value)), `${school.name}: no placeholders/non-public labels remain in any year's table`);
  }
  historicalWaitlistSchools.forEach((entry, index) => {
    const article = html.match(new RegExp(`<article id="school-${index + 1}"[\\s\\S]*?</article>`))?.[0];
    assert.ok(article, entry.name);
    const table = article.match(/<table\b[^>]*class="kuriage-data-table"[\s\S]*?<\/table>/)?.[0];
    assert.ok(table, entry.name);
    const rows = [...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)].map((match) => cells(match[1]));
    assert.deepEqual(rows[0], ['年度', ...waitlistTableSchools[index].columns], `${entry.name}: column headings`);
    const displayedColumnCount = entry.name === '岩手医科大学' ? 3 : entry.columns.length;
    const legacyRows = [...table.matchAll(/<tr\b[^>]*data-legacy="true"[^>]*>([\s\S]*?)<\/tr>/g)].map((match) => cells(match[1]).slice(0, displayedColumnCount + 1));
    const expectedRows = entry.name === '岩手医科大学' ? iwateHistoricalRows() : entry.rows;
    assert.deepEqual(legacyRows, expectedRows.map((row) => [row.year, ...row.values.map((value, column) => expectedLegacyDisplay(index, row.year, column, value))]), `${entry.name}: numbers are preserved; missing cells explicitly classified`);
    assert.match(rows[1][0], /^2026/);
    assert.ok(rows.some((row) => /^2025/.test(row[0])));
  });
  assert.equal((html.match(/class="kuriage-data-table"/g) ?? []).length, 31);
  assert.doesNotMatch(html, /class="(?:result-year|history-table|history-details|result-card)"/);
  assert.ok(html.includes('class="kuriage-school-grid"'));
  assert.ok(html.includes('class="kuriage-section kuriage-section--definition"'));
  assert.ok(html.includes('class="kuriage-section kuriage-section--count"'));
});
