/** Local-only layout regression: real saved candidates, shared renderer and article CSS. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { renderUniversityAdmissions } from '../src/lib/universityAdmissions.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(path.join(root, 'frontend/package.json'));
const { chromium } = require('playwright-core');
const out = path.join(root, 'reports/university-admissions/shared-layout-verification');
const articleCss = fs.readFileSync(path.join(root, 'frontend/src/styles/articles.css'), 'utf8');
const globalCss = fs.readFileSync(path.join(root, 'frontend/src/styles/global.css'), 'utf8');
const baselineCss = articleCss.replace(/\/\* university-admissions-layout:start \*\/[\s\S]*?\/\* university-admissions-layout:end \*\//, '');
assert.notEqual(baselineCss, articleCss, 'The scoped admissions fix must exist.');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const normalize = value => value.replace(/\s+/g, ' ').trim();
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const preview = (data, css) => `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ローカル表示検証・${escape(data.university)}</title><style>${globalCss}\n${css}</style></head><body class="article-page article-page--tone-data"><div class="article-container article-body-grid"><article class="article-main"><p>ローカル表示検証用。公開データではありません。</p><div class="article-content">${renderUniversityAdmissions(data)}<h2>既存表の表示比較</h2><table id="legacy-table"><thead><tr><th>既存の項目</th><th>既存の内容</th></tr></thead><tbody><tr><th>既存表</th><td>この表のCSSは変更しない。</td></tr></tbody></table></div></article><aside class="article-sidebar"><div class="article-toc"><p class="article-toc__title">表示検証用のサイドバー</p></div></aside></div></body></html>`;
const dimensions = page => page.evaluate(() => {
  const styles = element => {
    const css = getComputedStyle(element);
    return { display: css.display, whiteSpace: css.whiteSpace, minWidth: css.minWidth, tableLayout: css.tableLayout };
  };
  const elements = [...document.querySelectorAll('[data-admission-table] th,[data-admission-table] td,[data-admission-table] caption,[data-admission-source-list] li')];
  const overflow = elements.filter(element => element.scrollWidth > element.clientWidth + 1).map(element => ({ tag: element.tagName, text: element.textContent.slice(0, 100), clientWidth: element.clientWidth, scrollWidth: element.scrollWidth }));
  return {
    viewportWidth: window.innerWidth, documentWidth: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth,
    sectionWidth: document.querySelector('[data-university-admissions-year]').getBoundingClientRect().width,
    tables: [...document.querySelectorAll('[data-admission-table]')].map(table => ({ kind: table.dataset.admissionTable, width: table.getBoundingClientRect().width, ...styles(table) })),
    captions: [...document.querySelectorAll('[data-admission-table] caption')].map(caption => ({ width: caption.getBoundingClientRect().width, height: caption.getBoundingClientRect().height, lineHeight: parseFloat(getComputedStyle(caption).lineHeight), whiteSpace: getComputedStyle(caption).whiteSpace })),
    sourceListWidth: document.querySelector('[data-admission-source-list]').getBoundingClientRect().width,
    sourceTitles: [...document.querySelectorAll('[data-admission-source-list] a')].map(link => ({ text: link.textContent, whiteSpace: getComputedStyle(link).whiteSpace, lineHeight: parseFloat(getComputedStyle(link).lineHeight), rectCount: (() => { const range = document.createRange(); range.selectNodeContents(link); return range.getClientRects().length; })() })),
    overflow,
    legacyTable: styles(document.querySelector('#legacy-table')),
    legacyCell: styles(document.querySelector('#legacy-table td')),
  };
});
const views = [{ name: 'pc', width: 1440, height: 1000 }, { name: 'mobile-390', width: 390, height: 844 }, { name: 'mobile-320', width: 320, height: 844 }];
fs.mkdirSync(out, { recursive: true });
const evidence = { version: 1, checkedAt: new Date().toISOString(), stage: 'local-renderer-preview', published: false,
  articleCssSha256: hash(articleCss), rendererSha256: hash(fs.readFileSync(path.join(root, 'frontend/src/lib/universityAdmissions.ts'))), universities: [] };
let browser;
try {
  browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  for (const slug of ['yamanashi', 'tokushima', 'saga', 'hirosaki']) {
    const candidateFile = path.join(root, `reports/university-admissions/${slug}/candidate.json`);
    const candidateBytes = fs.readFileSync(candidateFile);
    const data = JSON.parse(candidateBytes.toString('utf8').replace(/^\uFEFF/, ''));
    const record = { slug, university: data.university, candidateFile: path.relative(root, candidateFile), candidateSha256: hash(candidateBytes), views: [], baseline: [] };
    const correctedFile = path.join(out, `${slug}-preview.html`), oldFile = path.join(out, `${slug}-before.html`);
    fs.writeFileSync(correctedFile, preview(data, articleCss)); fs.writeFileSync(oldFile, preview(data, baselineCss));
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const view of views) {
      await page.setViewportSize({ width: view.width, height: view.height });
      await page.goto(pathToFileURL(oldFile).href, { waitUntil: 'load' });
      const before = await dimensions(page);
      record.baseline.push({ view: view.name, documentWidth: before.documentWidth, tableWidths: before.tables.map(table => table.width) });
      await page.goto(pathToFileURL(correctedFile).href, { waitUntil: 'load' });
      const actual = await dimensions(page);
      assert.ok(actual.documentWidth <= view.width, `${slug}/${view.name}: document overflow`);
      assert.ok(actual.bodyWidth <= view.width, `${slug}/${view.name}: body overflow`);
      assert.equal(actual.overflow.length, 0, `${slug}/${view.name}: clipped or overflowing cells/captions/sources`);
      assert.equal(actual.tables.length, data.schemes.length * 3);
      assert.ok(actual.tables.every(table => table.display === 'table' && table.whiteSpace === 'normal' && table.width <= actual.sectionWidth + 1));
      assert.ok(actual.captions.every(caption => caption.whiteSpace === 'normal' && caption.width <= actual.sectionWidth + 1));
      assert.ok(actual.sourceTitles.every(source => source.whiteSpace === 'normal'));
      assert.deepEqual(actual.legacyTable, before.legacyTable, 'Existing table styles must remain unchanged.');
      assert.deepEqual(actual.legacyCell, before.legacyCell, 'Existing cell styles must remain unchanged.');
      if (view.width < 400) {
        assert.ok(actual.captions.some(caption => caption.height > caption.lineHeight * 2), 'Long mobile captions should wrap.');
        assert.ok(actual.sourceTitles.some(source => source.rectCount > 1), 'Long source titles should wrap.');
      }
      let checkedRows = 0;
      for (const scheme of data.schemes) for (const [kind, rows] of [['schedule', scheme.scheduleRows], ['exam', scheme.examRows], ['venue', scheme.venueRows]]) {
        const table = page.locator(`[data-admission-scheme="${scheme.id}"] [data-admission-table="${kind}"]`);
        assert.equal(await table.locator('tbody tr').count(), rows.length);
        for (const [index, row] of rows.entries()) {
          const actualRow = table.locator(`[data-admission-row="${index}"]`);
          assert.equal(normalize(await actualRow.locator('[data-admission-label]').innerText()), normalize(row.label));
          assert.equal(normalize(await actualRow.locator('[data-admission-value]').innerText()), normalize(row.value));
          assert.deepEqual(await actualRow.locator('[data-admission-sources] a').evaluateAll(links => links.map(link => link.dataset.admissionSourceId)), row.sourceIds);
          checkedRows++;
        }
      }
      const screenshots = [];
      for (const [name, selector] of [['table', '[data-admission-table] caption'], ['sources', '[data-admission-source-list]']]) {
        await page.locator(selector).first().evaluate(element => window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 20));
        const file = path.join(out, `${slug}-${view.name}-${name}.png`);
        await page.screenshot({ path: file });
        screenshots.push(path.relative(root, file).split(path.sep).join('/'));
      }
      record.views.push({ view: view.name, ...actual, checkedRows, screenshots });
    }
    assert.deepEqual(errors, [], `${slug}: browser errors`);
    assert.ok(record.baseline.find(view => view.view === 'mobile-390').documentWidth > 390, `${slug}: baseline should reproduce the reported defect`);
    await context.close();
    evidence.universities.push(record);
  }
  evidence.passed = true;
} finally {
  await browser?.close();
  fs.writeFileSync(path.join(out, 'verification.json'), JSON.stringify(evidence, null, 2) + '\n');
}
console.log(JSON.stringify({ passed: evidence.passed, stage: evidence.stage, evidence: path.join(out, 'verification.json'), universities: evidence.universities.map(record => ({ slug: record.slug, before390: record.baseline.find(view => view.view === 'mobile-390').documentWidth, views: record.views.map(view => ({ width: view.viewportWidth, documentWidth: view.documentWidth, rows: view.checkedRows, overflow: view.overflow.length })) })) }, null, 2));
