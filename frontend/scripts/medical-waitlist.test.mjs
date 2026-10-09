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
import { publicWaitlistResult, publicWaitlistSchool } from '../src/data/medicalWaitlistPublic.ts';

const expectedNames = [
  '岩手医科大学', '東北医科薬科大学', '自治医科大学', '獨協医科大学', '埼玉医科大学',
  '国際医療福祉大学', '杏林大学', '慶應義塾大学', '順天堂大学', '昭和医科大学',
  '帝京大学', '東京医科大学', '東京慈恵会医科大学', '東京女子医科大学', '東邦大学',
  '日本大学', '日本医科大学', '北里大学', '聖マリアンナ医科大学', '東海大学',
  '金沢医科大学', '愛知医科大学', '藤田医科大学', '大阪医科薬科大学', '関西医科大学',
  '近畿大学', '兵庫医科大学', '川崎医科大学', '久留米大学', '産業医科大学', '福岡大学',
];
const school = (name) => waitlistSchools.find((entry) => entry.name === name);

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
        assert.ok(['www.fujigakuin.jp', 'melurix.co.jp'].includes(url.hostname));
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
        assert.ok(['www.fujigakuin.jp', 'melurix.co.jp'].includes(url.hostname));
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

test('2025 and 2026 are prepended to each existing table without removing or rearranging its legacy data', () => {
  assert.equal(waitlistTableSchools.length, 31);
  assert.deepEqual(waitlistTableSchools.map(({ id, name }) => ({ id, name })), waitlistSchools.map(({ id, name }) => ({ id, name })));
  historicalWaitlistSchools.forEach((legacy, index) => {
    const table = waitlistTableSchools[index];
    assert.ok(table.columns.length >= legacy.columns.length);
    assert.deepEqual(table.rows.filter((row) => row.legacy).map((row) => ({year:row.year, values:row.cells.slice(0, legacy.columns.length).map((cell) => cell.legacyValue)})), legacy.rows);
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
  const additionalRouteColumns = new Map([['school-5', 2], ['school-8', 2], ['school-12', 1], ['school-15', 2], ['school-21', 1]]);
  for (const [index, original] of historicalWaitlistSchools.entries()) {
    const id = `school-${index + 1}`;
    assert.equal(table(id).columns.length, original.columns.length + (additionalRouteColumns.get(id) ?? 0), id);
    assert.ok(table(id).columns.every((name) => !/お知らせ|合格例|合格報告|未確認/.test(name)), id);
  }
  const iwate = table('school-2');
  assert.equal(iwate.rows.find((row) => row.year === '2025（地域C）').cells[0].records[0].result, '初回発表後の追加分4人');
  assert.equal(iwate.rows.find((row) => row.year === '2026（地域C）').cells[0].records[0].result, '合格例：補欠1番');
  const fujita = table('school-26');
  assert.ok(fujita.rows[0].cells.every((cell) => cell.records.length === 0));
  assert.equal(fujita.annotations.find((entry) => entry.year === 2026).records.length, 6);
  assert.equal(fujita.rows[1].cells[0].records.length, 2, 'explicitly first-period routes share a cell with route labels');
  assert.equal(fujita.annotations.find((entry) => entry.year === 2025).records[0].route, '共通テスト利用');
  const kurume = table('school-9');
  assert.equal(kurume.rows[1].cells[0].records[0].result, '繰上合格者19人');
  assert.equal(kurume.rows[1].cells[0].records[1].result, '合格例：補欠43番');
  assert.equal(table('school-1').rows[0].cells[0].records[0].result, '第1補欠79位まで');
  assert.equal(table('school-1').rows[0].cells[1].records[0].result, '繰上合格者83人');
  assert.ok(table('school-16').annotations.find((entry) => entry.year === 2025).records.some((row) => row.route === '神奈川県地域枠'));
});

test('public result labels put reported status after the original number or group', () => {
  for (const entry of [...waitlistSchools, ...waitlist2025Schools]) {
    for (const record of entry.records) {
      const result = publicWaitlistResult(record);
      if (['rank-case', 'group-case'].includes(record.metric)) {
        assert.equal(result, `${record.result.replace(/^合格例：/, '')}（報告あり）`);
        assert.equal((result.match(/（報告あり）/g) ?? []).length, 1);
      } else {
        assert.equal(result, record.result);
        assert.doesNotMatch(result, /（報告あり）/);
      }
      assert.doesNotMatch(result, /合格例/);
    }
  }
  assert.equal(publicWaitlistResult(school('岩手医科大学').records.find((row) => row.route === '一般選抜')), '補欠82番（報告あり）');
  assert.equal(publicWaitlistResult(waitlist2025Schools.find((entry) => entry.name === '久留米大学').records.find((row) => row.metric === 'rank-case')), '補欠43番（報告あり）');
});

test('public records retain facts/units/dates but never expose source names or links', () => {
  for (const entry of [...waitlistSchools, ...waitlist2025Schools]) {
    const data = publicWaitlistSchool(entry);
    assert.equal(data.records.length, entry.records.length);
    data.records.forEach((record, index) => {
      for (const key of ['route', 'metric', 'asOf']) assert.equal(record[key], entry.records[index][key]);
      assert.equal(record.result, publicWaitlistResult(entry.records[index]));
      assert.ok(!Object.hasOwn(record, 'source'));
    });
    assert.doesNotMatch(JSON.stringify(data), /合格例|富士学院|メルリックス|fujigakuin|melurix|https?:\/\//);
    assert.ok(!Object.hasOwn(data, 'noteSources'));
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
    for (const row of entry.records) assert.ok(html.includes(publicWaitlistResult(row)), `${entry.name}: ${publicWaitlistResult(row)}`);
  }
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  const faq = schema['@graph'].find((item) => item['@type'] === 'FAQPage');
  assert.deepEqual(faq.mainEntity.map((item) => item.name), waitlistFaqs.map((item) => item.question));
  const dataset = schema['@graph'].find((item) => item['@type'] === 'Dataset');
  assert.equal(dataset.distribution.contentUrl, 'https://lexus-ec.com/data/medical-waitlist.json');
  assert.equal(dataset.temporalCoverage, '2012/2026');
  const data2025 = JSON.parse(readFileSync(new URL('../dist/data/medical-waitlist-2025.json', import.meta.url), 'utf8'));
  assert.equal(data2025.admissionYear, 2025);
  assert.deepEqual(data2025.schools, JSON.parse(JSON.stringify(waitlist2025Schools.map(publicWaitlistSchool))));
  const archive = JSON.parse(readFileSync(new URL('../dist/data/medical-waitlist.json', import.meta.url), 'utf8'));
  assert.deepEqual(archive.years.map((entry) => entry.admissionYear), [2026, 2025]);
  assert.deepEqual(archive.historical.schools, historicalWaitlistSchools);
  assert.equal(archive.historical.verificationStatus, 'legacy-unverified');
  for (const output of [html, JSON.stringify(data), JSON.stringify(data2025), JSON.stringify(archive)]) {
    assert.doesNotMatch(output, /合格例|富士学院|メルリックス|fujigakuin|melurix/);
  }
  const main = html.match(/<main id="kuriage-main"[\s\S]*?<\/main>/)[0];
  assert.doesNotMatch(main, /<a[^>]+href="https?:/);
  assert.doesNotMatch(main, /waitlist-source|出典/);
  assert.ok(!Object.hasOwn(dataset, 'citation'));
  assert.ok(html.includes('2025・2026年度を、各大学の表の先頭に追加しています。'));
  assert.ok(html.includes('2027年度の補欠・繰上げ合格状況は、各大学の入試後に判明します。'));
  assert.ok(html.includes('https://lexus-ec.com/kuriage-information/'));
  const sitemap = readFileSync(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
  assert.ok(sitemap.includes(`<loc>https://lexus-ec.com/kuriage-information/</loc>\n    <lastmod>${waitlistCheckedAt}</lastmod>`));
});

test('new years and all 281 legacy rows share the original tables, not separate annual cards', { skip: !existsSync(builtPage) }, () => {
  const html = readFileSync(builtPage, 'utf8');
  const decode = (value) => value.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  const cells = (row) => [...row.matchAll(/<(?:th|td)\b[^>]*>([\s\S]*?)<\/(?:th|td)>/g)].map((match) => decode(match[1].replace(/<[^>]+>/g, '').trim()));
  historicalWaitlistSchools.forEach((entry, index) => {
    const article = html.match(new RegExp(`<article id="school-${index + 1}"[\\s\\S]*?</article>`))?.[0];
    assert.ok(article, entry.name);
    const table = article.match(/<table\b[^>]*class="kuriage-data-table"[\s\S]*?<\/table>/)?.[0];
    assert.ok(table, entry.name);
    const rows = [...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)].map((match) => cells(match[1]));
    assert.deepEqual(rows[0], ['年度', ...waitlistTableSchools[index].columns], `${entry.name}: column headings`);
    const legacyRows = [...table.matchAll(/<tr\b[^>]*data-legacy="true"[^>]*>([\s\S]*?)<\/tr>/g)].map((match) => cells(match[1]).slice(0, entry.columns.length + 1));
    assert.deepEqual(legacyRows, entry.rows.map((row) => [row.year, ...row.values]), `${entry.name}: all original values`);
    assert.match(rows[1][0], /^2026/);
    assert.ok(rows.some((row) => /^2025/.test(row[0])));
  });
  assert.equal((html.match(/class="kuriage-data-table"/g) ?? []).length, 31);
  assert.doesNotMatch(html, /class="(?:result-year|history-table|history-details|result-card)"/);
  assert.ok(html.includes('class="kuriage-school-grid"'));
  assert.ok(html.includes('class="kuriage-section kuriage-section--definition"'));
  assert.ok(html.includes('class="kuriage-section kuriage-section--count"'));
});
