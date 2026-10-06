import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import {
  waitlistSchools, alphabeticalWaitlistSchools, waitlistCheckedAt,
  waitlistAdmissionYear, waitlistFaqs, waitlistMetricLabels,
} from '../src/data/medicalWaitlist.ts';

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
    assert.deepEqual(school(name).records.map((row) => row.result), results);
    assert.ok(school(name).records.every((row) => row.metric === 'count' && row.source.kind === 'official'));
  }
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

const builtPage = new URL('../dist/kuriage-information/index.html', import.meta.url);
test('built page, JSON and structured data describe the same visible evidence', { skip: !existsSync(builtPage) }, () => {
  const html = readFileSync(builtPage, 'utf8');
  const data = JSON.parse(readFileSync(new URL('../dist/data/medical-waitlist-2026.json', import.meta.url), 'utf8'));
  assert.equal(data.admissionYear, 2026);
  assert.deepEqual(data.schools, JSON.parse(JSON.stringify(waitlistSchools)));
  assert.equal((html.match(/class="result-card"/g) ?? []).length, 31);
  for (const entry of waitlistSchools) {
    assert.ok(html.includes(`id="${entry.id}"`), entry.id);
    for (const row of entry.records) assert.ok(html.includes(row.result), `${entry.name}: ${row.result}`);
  }
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  const faq = schema['@graph'].find((item) => item['@type'] === 'FAQPage');
  assert.deepEqual(faq.mainEntity.map((item) => item.name), waitlistFaqs.map((item) => item.question));
  const dataset = schema['@graph'].find((item) => item['@type'] === 'Dataset');
  assert.equal(dataset.distribution.contentUrl, 'https://lexus-ec.com/data/medical-waitlist-2026.json');
  assert.ok(html.includes('2027年度の補欠・繰上げ合格状況は、各大学の入試後に判明します。'));
  assert.ok(html.includes('https://lexus-ec.com/kuriage-information/'));
  const sitemap = readFileSync(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
  assert.ok(sitemap.includes(`<loc>https://lexus-ec.com/kuriage-information/</loc>\n    <lastmod>${waitlistCheckedAt}</lastmod>`));
});
