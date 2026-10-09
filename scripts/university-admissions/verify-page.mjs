/** Check a single candidate against delivered HTML. This does not certify its official facts. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(import.meta.dirname, '../..');
const require = createRequire(path.join(root, 'frontend/package.json'));
const { parse } = require('parse5');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const attr = (node, name) => node?.attrs?.find(a => a.name === name)?.value;
const all = node => node ? [node, ...(node.childNodes || []).flatMap(all)] : [];
const text = node => !node || ['script', 'style', 'template', 'noscript'].includes(node.tagName) ? '' : node.nodeName === '#text' ? node.value : node.tagName === 'br' ? '\n' : (node.childNodes || []).map(text).join('');
const tidy = value => String(value ?? '').replace(/\s+/g, ' ').trim();
const hasClass = (node, name) => (attr(node, 'class') || '').split(/\s+/).includes(name);
const hidden = node => attr(node, 'hidden') !== undefined || attr(node, 'aria-hidden') === 'true' || /display\s*:\s*none|visibility\s*:\s*hidden/i.test(attr(node, 'style') || '');
const visible = node => node && ![node, ...ancestors(node)].some(hidden);
function ancestors(node) { const parents = []; for (let p = node?.parentNode; p; p = p.parentNode) parents.push(p); return parents; }
const rowTypes = [['schedule', 'scheduleRows', '日程'], ['exam', 'examRows', '試験科目・配点'], ['venue', 'venueRows', '試験会場']];
const unknownValue = value => /未公表|未公開|未確認|不明|要確認|確認中|確認が必要|公表されてい|公表してい|確認できない|公式(?:の)?(?:要項|資料|案内)で確認/.test(value);
const identifier = value => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
function isoDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/.test(value) || !Number.isFinite(Date.parse(value))) return false;
  const [y, m, d] = value.slice(0, 10).split('-').map(Number), date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}
const sameList = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const issue = (id, passed, expected, actual, detail) => ({ id, passed: Boolean(passed), ...(expected !== undefined ? { expected } : {}), ...(actual !== undefined ? { actual } : {}), ...(detail ? { detail } : {}) });

export function expectedMetadata(data) {
  const u = data.university, y = data.admissionYear;
  return {
    title: `${u}医学部｜${y}年度入試情報・大学概要`,
    displayTitle: `${u} 医学部 ${y}年度入試情報・大学概要`,
    displayTitleLines: [`${u} 医学部`, `${y}年度入試情報・大学概要`],
    description: `${u}医学部の${y}年度入試情報。大学公式資料で確認した選抜方式別の日程、試験科目・配点、試験会場を掲載しています。未公表・要確認の項目と掲載範囲を明記。大学概要の統計・学納金は過年度の参考情報です。`,
    lead: `${u}医学部の${y}年度入試情報を、大学公式資料に基づき選抜方式別にまとめています。出願前には、該当年度の学生募集要項と大学の変更通知をご確認ください。`,
  };
}

export function validateData(data) {
  const checks = [], add = (id, ok, expected, actual) => checks.push(issue(`data:${id}`, ok, expected, actual));
  add('object', data && typeof data === 'object' && !Array.isArray(data), 'object', typeof data);
  if (!data || typeof data !== 'object') return checks;
  add('path', typeof data.path === 'string' && /^\/information-[a-z0-9-]+\/$/.test(data.path) && data.path !== '/information-faq/', '/information-{slug}/', data.path);
  add('university', typeof data.university === 'string' && data.university.trim().length > 0, 'named university', data.university);
  add('year', data.admissionYear === 2027, 2027, data.admissionYear);
  add('verified-at', isoDate(data.verifiedAt), 'ISO8601 date or timezone-qualified datetime', data.verifiedAt);
  add('sources', Array.isArray(data.sources) && data.sources.length > 0, 'nonempty source array', data.sources?.length);
  add('schemes', Array.isArray(data.schemes) && data.schemes.length > 0, 'nonempty scheme array', data.schemes?.length);
  add('coverage-notes', Array.isArray(data.coverageNotes) && data.coverageNotes.length > 0 && data.coverageNotes.every(n => typeof n === 'string' && n.trim()), 'nonempty string array', data.coverageNotes);
  const sourceIds = new Set();
  for (const [i, source] of (Array.isArray(data.sources) ? data.sources : []).entries()) {
    add(`source-${i}-object`, source && typeof source === 'object' && !Array.isArray(source), 'source object', typeof source);
    if (!source || typeof source !== 'object' || Array.isArray(source)) continue;
    add(`source-${i}-id`, identifier(source.id) && !sourceIds.has(source.id), 'unique stable id', source.id); sourceIds.add(source.id);
    let secure = false; try { const u = new URL(source.url); secure = u.protocol === 'https:' && !u.username && !u.password; } catch {}
    add(`source-${i}-url`, secure, 'absolute HTTPS URL', source.url);
    add(`source-${i}-title`, typeof source.title === 'string' && source.title.trim(), 'source title', source.title);
    add(`source-${i}-retrieved-at`, isoDate(source.retrievedAt) && Date.parse(source.retrievedAt) <= Date.parse(data.verifiedAt), 'retrieval date no later than verifiedAt', source.retrievedAt);
  }
  const schemeIds = new Set();
  for (const [i, scheme] of (Array.isArray(data.schemes) ? data.schemes : []).entries()) {
    add(`scheme-${i}-object`, scheme && typeof scheme === 'object' && !Array.isArray(scheme), 'scheme object', typeof scheme);
    if (!scheme || typeof scheme !== 'object' || Array.isArray(scheme)) continue;
    add(`scheme-${i}-id`, identifier(scheme.id) && !schemeIds.has(scheme.id), 'unique stable id', scheme.id); schemeIds.add(scheme.id);
    add(`scheme-${i}-name`, typeof scheme.name === 'string' && scheme.name.trim(), 'scheme name', scheme.name);
    for (const [type, field] of rowTypes) {
      add(`${scheme.id}-${type}-rows`, Array.isArray(scheme[field]) && scheme[field].length > 0, 'nonempty row array (unknown rows stay explicit)', scheme[field]?.length);
      for (const [j, row] of (Array.isArray(scheme[field]) ? scheme[field] : []).entries()) {
        add(`${scheme.id}-${type}-${j}-object`, row && typeof row === 'object' && !Array.isArray(row), 'row object', typeof row);
        if (!row || typeof row !== 'object' || Array.isArray(row)) continue;
        add(`${scheme.id}-${type}-${j}-label`, typeof row.label === 'string' && row.label.trim(), 'nonempty label', row.label);
        add(`${scheme.id}-${type}-${j}-value`, typeof row.value === 'string' && row.value.trim(), 'explicit value or unknown wording', row.value);
        add(`${scheme.id}-${type}-${j}-sources`, Array.isArray(row.sourceIds) && row.sourceIds.length > 0 && new Set(row.sourceIds).size === row.sourceIds.length && row.sourceIds.every(id => sourceIds.has(id)), 'existing source ids for this row', row.sourceIds);
        add(`${scheme.id}-${type}-${j}-status`, row.status === undefined || ['confirmed', 'unpublished', 'needs-confirmation'].includes(row.status), 'optional known status', row.status);
        if (['unpublished', 'needs-confirmation'].includes(row.status)) add(`${scheme.id}-${type}-${j}-unknown`, typeof row.value === 'string' && unknownValue(row.value), 'explicit unknown wording; no inferred fact', row.value);
      }
    }
    add(`${scheme.id}-notes`, Array.isArray(scheme.notes), 'note array', scheme.notes);
    for (const [j, note] of (Array.isArray(scheme.notes) ? scheme.notes : []).entries()) {
      add(`${scheme.id}-note-${j}-object`, note && typeof note === 'object' && !Array.isArray(note), 'note object', typeof note);
      if (!note || typeof note !== 'object' || Array.isArray(note)) continue;
      add(`${scheme.id}-note-${j}-text`, typeof note.text === 'string' && note.text.trim(), 'nonempty note', note.text);
      add(`${scheme.id}-note-${j}-sources`, Array.isArray(note.sourceIds) && note.sourceIds.length > 0 && new Set(note.sourceIds).size === note.sourceIds.length && note.sourceIds.every(id => sourceIds.has(id)), 'existing source ids for this note', note.sourceIds);
    }
  }
  return checks;
}

/** Pure DOM/data comparison. A passed result establishes rendering consistency, never official accuracy. */
export function verifyHtml({ data, html, url, status = 200, contentType = 'text/html', knownUniversities = [] }) {
  const checks = validateData(data), add = (id, ok, expected, actual, detail) => checks.push(issue(id, ok, expected, actual, detail));
  add('http-status', status === 200, 200, status);
  add('html-content-type', /^text\/html(?:;|$)/i.test(contentType), 'text/html', contentType);
  let target; try { target = new URL(url); } catch {}
  add('url', target?.protocol === 'https:' && ['lexus-ec.com', 'staging.lexus-ec.pages.dev'].includes(target.hostname) && target.pathname === data?.path && !target.search && !target.hash, `https://{staging or main}${data?.path}`, url);
  if (checks.some(c => !c.passed)) return { passed: false, checks, failedChecks: checks.filter(c => !c.passed), tableHash: null, tables: [], sourceChecks: [] };
  const nodes = all(parse(html)), main = nodes.filter(n => n.tagName === 'main');
  add('main', main.length === 1, 1, main.length);
  const canonical = nodes.filter(n => n.tagName === 'link' && (attr(n, 'rel') || '').split(/\s+/).includes('canonical'));
  add('canonical', canonical.length === 1 && attr(canonical[0], 'href') === `https://lexus-ec.com${data.path}`, `https://lexus-ec.com${data.path}`, canonical.map(n => attr(n, 'href')));
  const meta = expectedMetadata(data), titles = nodes.filter(n => n.tagName === 'title'), descriptions = nodes.filter(n => n.tagName === 'meta' && attr(n, 'name') === 'description'), h1s = nodes.filter(n => n.tagName === 'h1'), leads = nodes.filter(n => hasClass(n, 'article-hero__lead'));
  add('title', titles.length === 1 && tidy(text(titles[0])) === meta.title, meta.title, titles.map(n => tidy(text(n))));
  add('description', descriptions.length === 1 && attr(descriptions[0], 'content') === meta.description, meta.description, descriptions.map(n => attr(n, 'content')));
  const h1Lines = all(h1s[0]).filter(n => hasClass(n, 'article-hero__title-line')).map(n => tidy(text(n)));
  const h1Matches = h1s.length === 1 && (h1Lines.length ? sameList(h1Lines, meta.displayTitleLines) && attr(h1s[0], 'aria-label') === meta.displayTitle : tidy(text(h1s[0])) === meta.displayTitle);
  add('h1', h1Matches && visible(h1s[0]), meta.displayTitleLines, h1Lines.length ? h1Lines : h1s.map(n => tidy(text(n))));
  add('lead', leads.length === 1 && visible(leads[0]) && tidy(text(leads[0])) === meta.lead, meta.lead, leads.map(n => tidy(text(n))));
  const gridItems = all(main[0]).filter(n => n.tagName === 'div' && ancestors(n).some(p => hasClass(p, 'article-info-grid')));
  for (const [label, value] of [['年度', `${data.admissionYear}年度（入試情報）`], ['種別', `大学概要・${data.admissionYear}年度入試情報`]]) {
    const items = gridItems.filter(n => (n.childNodes || []).some(c => c.tagName === 'dt' && tidy(text(c)) === label));
    const values = items.flatMap(n => (n.childNodes || []).filter(c => c.tagName === 'dd'));
    add(`info-item:${label}`, items.length === 1 && values.length === 1 && tidy(text(values[0])) === value && visible(values[0]), value, values.map(n => tidy(text(n))));
  }
  const identityText = [...titles.map(text), ...descriptions.map(n => attr(n, 'content') || ''), ...h1s.map(text), ...leads.map(text)].join(' ');
  const otherNames = knownUniversities.filter(name => name !== data.university && identityText.includes(name));
  add('university-identity', identityText.includes(data.university) && !otherNames.length, data.university, otherNames, 'Only metadata and the lead are checked for another known university; source accuracy is a separate review.');
  const safety = all(main[0]).filter(n => attr(n, 'data-university-info-safety') !== undefined);
  add('safety-placeholder-absent', !safety.some(visible), 'no visible old safety placeholder', safety.filter(visible).map(n => tidy(text(n))));
  const sections = all(main[0]).filter(n => attr(n, 'data-university-admissions-year') !== undefined);
  add('admissions-section', sections.length === 1 && attr(sections[0], 'data-university-admissions-year') === String(data.admissionYear) && visible(sections[0]), String(data.admissionYear), sections.map(n => attr(n, 'data-university-admissions-year')));
  const section = sections[0], sectionNodes = all(section), introHeadings = all(main[0]).filter(n => n.tagName === 'h2' && attr(n, 'id') === '最新の入試情報');
  add('admissions-heading', introHeadings.length === 1 && tidy(text(introHeadings[0])) === `${data.admissionYear}年度の入試情報` && visible(introHeadings[0]), `${data.admissionYear}年度の入試情報`, introHeadings.map(n => tidy(text(n))));
  const verifiedTimes = sectionNodes.filter(n => n.tagName === 'time' && attr(n, 'data-university-admissions-verified-at') !== undefined);
  add('verification-date', verifiedTimes.length === 1 && attr(verifiedTimes[0], 'datetime') === data.verifiedAt && tidy(text(verifiedTimes[0])) === data.verifiedAt.slice(0, 10) && visible(verifiedTimes[0]), data.verifiedAt, verifiedTimes.map(n => ({ datetime: attr(n, 'datetime'), text: tidy(text(n)) })));
  const sourceById = new Map(data.sources.map(s => [s.id, s])), tables = [], sourceChecks = [];
  function checkLinks(scope, ids, prefix) {
    const anchors = all(scope).filter(n => n.tagName === 'a' && attr(n, 'data-admission-source-id') !== undefined);
    const actual = anchors.map(n => ({ id: attr(n, 'data-admission-source-id'), url: attr(n, 'href') }));
    add(`${prefix}:source-links`, sameList(actual.map(a => a.id), ids) && actual.every(a => a.url === sourceById.get(a.id)?.url) && anchors.every(visible), ids.map(id => ({ id, url: sourceById.get(id)?.url })), actual);
    return actual;
  }
  const wrappers = sectionNodes.filter(n => attr(n, 'data-admission-scheme') !== undefined);
  add('scheme-order', sameList(wrappers.map(n => attr(n, 'data-admission-scheme')), data.schemes.map(s => s.id)), data.schemes.map(s => s.id), wrappers.map(n => attr(n, 'data-admission-scheme')));
  for (const scheme of data.schemes) {
    const candidates = wrappers.filter(n => attr(n, 'data-admission-scheme') === scheme.id), wrapper = candidates[0], descendants = all(wrapper), headings = descendants.filter(n => /^h[2-6]$/.test(n.tagName || ''));
    add(`${scheme.id}:heading`, candidates.length === 1 && headings.some(n => tidy(text(n)) === scheme.name && visible(n)), scheme.name, headings.map(n => tidy(text(n))));
    const schemeTables = descendants.filter(n => n.tagName === 'table');
    add(`${scheme.id}:table-types`, sameList(schemeTables.map(n => attr(n, 'data-admission-table')), rowTypes.map(([t]) => t)), rowTypes.map(([t]) => t), schemeTables.map(n => attr(n, 'data-admission-table')));
    for (const [type, field, name] of rowTypes) {
      const prefix = `${scheme.id}/${type}`, table = schemeTables.find(n => attr(n, 'data-admission-table') === type), descendants = all(table), captions = descendants.filter(n => n.tagName === 'caption'), caption = `${data.university} 医学部 ${data.admissionYear}年度 ${scheme.name} ${name}`;
      add(`${prefix}:caption`, captions.length === 1 && tidy(text(captions[0])) === caption && visible(captions[0]), caption, captions.map(n => tidy(text(n))));
      const columnHeaders = descendants.filter(n => n.tagName === 'th' && ancestors(n).some(p => p.tagName === 'thead'));
      add(`${prefix}:column-scope`, columnHeaders.length > 0 && columnHeaders.every(n => attr(n, 'scope') === 'col'), 'column headers with scope=col', columnHeaders.map(n => attr(n, 'scope')));
      const bodies = descendants.filter(n => n.tagName === 'tbody'), rows = all(bodies[0]).filter(n => n.tagName === 'tr');
      add(`${prefix}:rows`, bodies.length === 1 && sameList(rows.map(n => attr(n, 'data-admission-row')), scheme[field].map((_, i) => String(i))), scheme[field].map((_, i) => String(i)), rows.map(n => attr(n, 'data-admission-row')));
      const actualRows = [];
      for (const [i, expected] of scheme[field].entries()) {
        const row = rows[i], descendants = all(row), labels = descendants.filter(n => attr(n, 'data-admission-label') !== undefined), values = descendants.filter(n => attr(n, 'data-admission-value') !== undefined), sources = descendants.filter(n => attr(n, 'data-admission-sources') !== undefined), actualLabel = tidy(text(labels[0])), actualValue = tidy(text(values[0])), cell = `${prefix}/${i}`;
        add(`${cell}:cell-count`, (row?.childNodes || []).filter(n => ['th', 'td'].includes(n.tagName)).length === 3, 3, (row?.childNodes || []).filter(n => ['th', 'td'].includes(n.tagName)).length);
        add(`${cell}:status`, attr(row, 'data-admission-status') === expected.status, expected.status ?? null, attr(row, 'data-admission-status') ?? null);
        add(`${cell}:label`, labels.length === 1 && labels[0].tagName === 'th' && attr(labels[0], 'scope') === 'row' && actualLabel === tidy(expected.label) && visible(labels[0]), expected.label, actualLabel);
        add(`${cell}:value`, values.length === 1 && values[0].tagName === 'td' && actualValue === tidy(expected.value) && visible(values[0]), expected.value, actualValue);
        add(`${cell}:source-cell`, sources.length === 1 && sources[0].tagName === 'td', 'one source td', sources.length);
        if (unknownValue(expected.value) || ['unpublished', 'needs-confirmation'].includes(expected.status)) add(`${cell}:unknown-not-filled`, actualValue === tidy(expected.value) && unknownValue(actualValue), expected.value, actualValue, 'An unknown candidate field must remain unknown; matching does not establish that the official data is unpublished.');
        const sourceLinks = checkLinks(sources[0], expected.sourceIds, cell);
        actualRows.push({ label: actualLabel, value: actualValue, sourceLinks });
      }
      tables.push({ schemeId: scheme.id, type, caption: tidy(text(captions[0])), rows: actualRows });
    }
    const notes = descendants.filter(n => attr(n, 'data-admission-note') !== undefined);
    add(`${scheme.id}:notes`, sameList(notes.map(n => attr(n, 'data-admission-note')), scheme.notes.map((_, i) => String(i))), scheme.notes.map((_, i) => String(i)), notes.map(n => attr(n, 'data-admission-note')));
    for (const [i, note] of scheme.notes.entries()) {
      const n = notes[i], noteTexts = all(n).filter(n => attr(n, 'data-admission-note-text') !== undefined);
      add(`${scheme.id}/note/${i}:text`, noteTexts.length === 1 && tidy(text(noteTexts[0])) === tidy(note.text) && visible(noteTexts[0]), note.text, noteTexts.map(text));
      checkLinks(n, note.sourceIds, `${scheme.id}/note/${i}`);
    }
  }
  const markedTables = sectionNodes.filter(n => n.tagName === 'table');
  add('all-admissions-tables-covered', markedTables.length === tables.length, tables.length, markedTables.length, 'Additional tables in the admissions section must not escape row verification.');
  const coverage = sectionNodes.filter(n => attr(n, 'data-admission-coverage-note') !== undefined);
  add('coverage-notes', sameList(coverage.map(n => attr(n, 'data-admission-coverage-note')), data.coverageNotes.map((_, i) => String(i))) && sameList(coverage.map(n => tidy(text(n))), data.coverageNotes.map(tidy)) && coverage.every(visible), data.coverageNotes, coverage.map(n => tidy(text(n))));
  for (const source of data.sources) {
    const items = sectionNodes.filter(n => n.tagName === 'li' && attr(n, 'data-admission-source-id') === source.id), links = all(items[0]).filter(n => n.tagName === 'a' && attr(n, 'href') === source.url), times = all(items[0]).filter(n => n.tagName === 'time');
    const passed = items.length === 1 && links.length === 1 && tidy(text(links[0])) === tidy(source.title) && visible(links[0]) && times.some(n => attr(n, 'datetime') === source.retrievedAt && tidy(text(n)) === source.retrievedAt.slice(0, 10) && visible(n)) && visible(items[0]);
    add(`source/${source.id}:reference`, passed, { url: source.url, title: source.title, retrievedAt: source.retrievedAt }, items.map(n => tidy(text(n))));
    sourceChecks.push({ sourceId: source.id, url: source.url, referencePresent: passed, officialAccuracyChecked: false });
  }
  const failedChecks = checks.filter(c => !c.passed);
  return { passed: !failedChecks.length, checks, failedChecks, tableHash: sha(JSON.stringify(tables)), tables, sourceChecks };
}

function fixture(data) {
  const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replace(/\r?\n/g, '<br>');
  const metadata = expectedMetadata(data), sources = new Map(data.sources.map(s => [s.id, s]));
  const links = ids => ids.map(id => `<a data-admission-source-id="${escape(id)}" href="${escape(sources.get(id).url)}">${escape(sources.get(id).title)}</a>`).join(' ');
  const schemes = data.schemes.map(s => `<section data-admission-scheme="${s.id}"><h3>${escape(s.name)}</h3>${rowTypes.map(([type, field, name]) => `<table data-admission-table="${type}"><caption>${escape(`${data.university} 医学部 ${data.admissionYear}年度 ${s.name} ${name}`)}</caption><thead><tr><th scope="col">項目</th><th scope="col">内容</th><th scope="col">出典</th></tr></thead><tbody>${s[field].map((r, i) => `<tr data-admission-row="${i}"${r.status ? ` data-admission-status="${r.status}"` : ''}><th scope="row" data-admission-label>${escape(r.label)}</th><td data-admission-value>${escape(r.value)}</td><td data-admission-sources>${links(r.sourceIds)}</td></tr>`).join('')}</tbody></table>`).join('')}${s.notes.map((n, i) => `<p data-admission-note="${i}"><span data-admission-note-text>${escape(n.text)}</span> ${links(n.sourceIds)}</p>`).join('')}</section>`).join('');
  return `<html><head><title>${escape(metadata.title)}</title><meta name="description" content="${escape(metadata.description)}"><link rel="canonical" href="https://lexus-ec.com${data.path}"></head><body><main><h1 aria-label="${escape(metadata.displayTitle)}">${metadata.displayTitleLines.map(l => `<span class="article-hero__title-line">${escape(l)}</span>`).join('')}</h1><p class="article-hero__lead">${escape(metadata.lead)}</p><dl class="article-info-grid"><div><dt>年度</dt><dd>${data.admissionYear}年度（入試情報）</dd></div><div><dt>種別</dt><dd>大学概要・${data.admissionYear}年度入試情報</dd></div></dl><h2 id="最新の入試情報">${data.admissionYear}年度の入試情報</h2><section data-university-admissions-year="${data.admissionYear}"><time data-university-admissions-verified-at datetime="${data.verifiedAt}">${data.verifiedAt.slice(0, 10)}</time>${schemes}<ul>${data.coverageNotes.map((n, i) => `<li data-admission-coverage-note="${i}">${escape(n)}</li>`).join('')}</ul><ol>${data.sources.map(s => `<li data-admission-source-id="${s.id}"><a href="${escape(s.url)}">${escape(s.title)}</a><time datetime="${s.retrievedAt}">${s.retrievedAt.slice(0, 10)}</time></li>`).join('')}</ol></section></main></body></html>`;
}

export function selfTest() {
  const data = { path: '/information-test/', university: '検証大学', admissionYear: 2027, verifiedAt: '2026-10-09', sources: [{ id: 'guide', url: 'https://official.example/guide.pdf', title: '2027年度公式要項', retrievedAt: '2026-10-09' }], schemes: [{ id: 'general', name: '一般選抜', scheduleRows: [{ label: '試験日', value: '2027年2月1日', sourceIds: ['guide'] }], examRows: [{ label: '科目・配点', value: '未公表\n正式発表後に確認', status: 'unpublished', sourceIds: ['guide'] }], venueRows: [{ label: '試験会場', value: '本学', sourceIds: ['guide'] }], notes: [{ text: '正式発表後の変更通知も確認する。', sourceIds: ['guide'] }] }], coverageNotes: ['一般選抜の掲載範囲を確認した。'] };
  const html = fixture(data), url = `https://staging.lexus-ec.pages.dev${data.path}`, run = (value = html, extra = {}) => verifyHtml({ data, html: value, url, ...extra });
  const ok = run(); assert.equal(ok.passed, true, JSON.stringify(ok.failedChecks)); let count = 1;
  const reject = (name, badHtml, expectedId, extra = {}) => { const result = run(badHtml, extra); assert.equal(result.passed, false, name); assert.ok(result.failedChecks.some(c => c.id === expectedId), `${name}: missing ${expectedId}`); count++; };
  reject('Wrong date is rejected', html.replace('2027年2月1日', '2027年2月2日'), 'general/schedule/0:value');
  reject('Wrong source URL in a claimed row is rejected', html.replace('href="https://official.example/guide.pdf"', 'href="https://other.example/guide.pdf"'), 'general/schedule/0:source-links');
  reject('Missing caption is rejected', html.replace(/<caption>[\s\S]*?<\/caption>/, ''), 'general/schedule:caption');
  reject('Missing row header semantics is rejected', html.replace('scope="row"', 'scope="col"'), 'general/schedule/0:label');
  reject('Unknown score cannot be filled', html.replace('>未公表<', '>英語100点<'), 'general/exam/0:unknown-not-filled');
  reject('Wrong canonical is rejected', html.replace('href="https://lexus-ec.com/information-test/"', 'href="https://lexus-ec.com/information-other/"'), 'canonical');
  reject('Old safety placeholder remains visible', html.replace('</main>', '<p data-university-info-safety="overview">確認中</p></main>'), 'safety-placeholder-absent');
  reject('Another university in metadata is rejected', html.replace('<title>', '<title>他大学 '), 'university-identity', { knownUniversities: ['検証大学', '他大学'] });
  reject('Changed note is rejected', html.replace('正式発表後の変更通知も確認する。', '確認不要。'), 'general/note/0:text');
  reject('Extra unverified row is rejected', html.replace('</tbody>', '<tr data-admission-row="1"><th scope="row">追加</th><td>推測値</td></tr></tbody>'), 'general/schedule:rows');
  reject('Non-200 is rejected', html, 'http-status', { status: 404 });
  return { passed: true, fixtureTests: count, networkRequests: 0, filesWritten: 0, officialAccuracyAssessed: false };
}

function argumentsFrom(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i]; if (key === '--self-test') { options.selfTest = true; continue; }
    if (!['--data', '--url', '--output', '--commit'].includes(key) || !argv[i + 1] || argv[i + 1].startsWith('--')) throw new Error(`Unknown or missing CLI option: ${key}`);
    if (options[key.slice(2)]) throw new Error(`Duplicate CLI option: ${key}`);
    options[key.slice(2)] = argv[++i];
  }
  if (options.selfTest) { if (Object.keys(options).length > 1) throw new Error('--self-test runs alone.'); return options; }
  for (const key of ['data', 'url', 'output']) if (!options[key]) throw new Error(`Required option: --${key}`);
  if (options.commit && !/^[a-f0-9]{7,40}$/i.test(options.commit)) throw new Error('--commit requires a Git commit SHA.');
  return options;
}

async function main(argv) {
  const options = argumentsFrom(argv);
  if (options.selfTest) { console.log(JSON.stringify(selfTest(), null, 2)); return; }
  const dataFile = path.resolve(options.data), dataBytes = fs.readFileSync(dataFile), data = JSON.parse(dataBytes.toString('utf8').replace(/^\uFEFF/, ''));
  const candidateFile = path.relative(root, dataFile).replaceAll('\\', '/'), candidateSha256 = sha(dataBytes);
  let responseHash = null, result, httpStatus = null;
  try {
    // Validate the candidate and target before any GET. The CLI intentionally never fetches an official source.
    const initial = verifyHtml({ data, html: '', url: options.url });
    const invalidInput = initial.checks.filter(c => c.id.startsWith('data:') || c.id === 'url').filter(c => !c.passed);
    if (invalidInput.length) result = { passed: false, checks: invalidInput, failedChecks: invalidInput, tableHash: null, tables: [], sourceChecks: [] };
    else {
      const response = await fetch(options.url, { redirect: 'manual', signal: AbortSignal.timeout(45000), headers: { 'User-Agent': 'LexusUniversityAdmissionsVerifier/1.0', 'Accept': 'text/html' } });
      httpStatus = response.status;
      const bytes = Buffer.from(await response.arrayBuffer()); responseHash = sha(bytes);
      const knownData = JSON.parse(fs.readFileSync(path.join(root, 'frontend/src/data/generated/admissionInfoPosts.json'), 'utf8').replace(/^\uFEFF/, ''));
      const knownUniversities = [...new Set(knownData.map(p => p.infoItems?.find(i => i.label === '大学')?.value).filter(Boolean))];
      const routeUniversity = knownData.find(p => p.path === data.path)?.infoItems?.find(i => i.label === '大学')?.value;
      result = verifyHtml({ data, html: bytes.toString('utf8'), url: response.url, status: response.status, contentType: response.headers.get('content-type') || '', knownUniversities });
      const routeCheck = issue('route-university', routeUniversity === data.university, routeUniversity, data.university, 'The candidate must name the university assigned to this existing route.');
      result.checks.push(routeCheck); if (!routeCheck.passed) result.failedChecks.push(routeCheck); result.passed = !result.failedChecks.length;
    }
  } catch (error) {
    const check = issue('get-or-parse', false, undefined, undefined, error.message);
    result = { passed: false, checks: [check], failedChecks: [check], tableHash: null, tables: [], sourceChecks: [] };
  }
  const checkedAt = new Date().toISOString();
  const evidence = {
    version: 1, kind: 'university-admissions-render-verification', verificationScope: 'candidate-json-versus-public-html',
    path: data.path, university: data.university, admissionYear: data.admissionYear,
    url: options.url, commit: options.commit || null, checkedAt, verifiedAt: checkedAt, httpStatus,
    candidateFile, candidateSha256, dataHash: candidateSha256, responseHash, htmlHash: responseHash,
    ...result, pc: { passed: false, screenshotFile: null }, mobile: { passed: false, screenshotFile: null },
    officialComparison: { passed: false, file: null, sha256: null }, officialDataAccuracy: 'not-assessed', mainReady: false,
    requiredNextEvidence: ['PC and mobile browser screenshots of this candidate', `Cell-by-cell official-source reconciliation-${data.path?.split('/').filter(Boolean).at(-1)}.json, matching candidateSha256`],
  };
  const output = path.resolve(options.output); fs.mkdirSync(path.dirname(output), { recursive: true }); fs.writeFileSync(output, JSON.stringify(evidence, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify({ passed: evidence.passed, httpStatus, checks: evidence.checks.length, failedChecks: evidence.failedChecks, candidateSha256, tableHash: evidence.tableHash, output, mainReady: false }, null, 2));
  if (!evidence.passed) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2)).catch(error => { console.error(JSON.stringify({ passed: false, error: error.message })); process.exitCode = 1; });
