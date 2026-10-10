import type { UniversityAdmissions, UniversityAdmissionRow, UniversityAdmissionScheme } from './universityAdmissions';

const escape = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
const sentences = (value: string) => value.match(/[^。]+。?|。/gu) ?? [value];
const firstSentence = (value: string) => sentences(value)[0].replace(/。$/, '');
// Keep the pending status, while moving the provenance itself to the source footer.
const displayText = (value: string) => value.replaceAll('（医学群の2027年度予定概要）', '（予定）');

function rowPresentation(scheme: UniversityAdmissionScheme, kind: string, row: UniversityAdmissionRow) {
  let label = row.label, value = row.value;
  if (kind === 'schedule' && /募集人員|募集・人数/u.test(label)) {
    // The overview already carries the quota. Only distinct conditions remain below it.
    if (scheme.id.startsWith('general-region-')) value = sentences(value)[2];
    else if (['general-early', 'recommendation-region'].includes(scheme.id)) value = sentences(value).slice(1).join('');
    else return undefined;
    label = '募集人数の補足';
  }
  if (scheme.id === 'general-early' && kind === 'exam') {
    if (label === '共通テスト配点') return undefined; // Fully represented in the score matrix.
    if (label === '個別試験科目・配点') {
      label = '個別理科の選択';
      value = sentences(value).slice(2).join(''); // Scores and the total are already in the matrix.
    }
  }
  return { label, value: displayText(value) };
}

function notePresentation(scheme: UniversityAdmissionScheme, index: number, value: string) {
  if (scheme.id.startsWith('general-region-')) return ''; // Shared quota is explicit in the overview.
  if (scheme.id === 'overseas' && index === 1) return ''; // Source-page weekday discrepancy is an audit note.
  return value;
}

function coveragePresentation(value: string, index: number) {
  if (index === 0) return sentences(value).slice(2).join(''); // Listed schemes and no late admission are already stated.
  if (index === 1) return ''; // Pending quotas and approval conditions are in the overview and scheme details.
  if (index === 2) return '総合選抜は1年次に総合学域群へ所属し、医学類の2年次受入人数は入学者数等により変わる。';
  if (index === 3) return sentences(value)[0];
  if (index === 4) return sentences(value).at(-1)!;
  return value;
}

/** Formatting keeps every source value, including AND/OR conditions and exceptions. */
export function readableAdmissionValue(value: string, separateChoices = false): string {
  const enumeration = value.match(/^(次の全条件が必要。)([\s\S]+)$/u);
  if (enumeration) {
    const items = enumeration[2].split(/(?=[①②③④⑤⑥⑦⑧⑨])/u).filter(Boolean);
    return `<p class="admission-value-main">${escape(enumeration[1])}</p><ul class="admission-conditions">${items.map(item => `<li>${escape(item)}</li>`).join('')}</ul>`;
  }
  const parts = sentences(value);
  return parts.map((part, index) => {
    let content = escape(part);
    if (part.startsWith('①')) content = content.replace(/(?=[②③④⑤])/gu, '<br>');
    if (separateChoices) {
      let depth = 0;
      const chunks: string[] = [];
      let chunk = '';
      for (const character of part) {
        if ('（(「'.includes(character)) depth++;
        if ('）)」'.includes(character)) depth--;
        chunk += character;
        if (character === '、' && depth === 0) { chunks.push(chunk); chunk = ''; }
      }
      if (chunk) chunks.push(chunk);
      content = chunks.map(chunk => `<span class="admission-choice">${escape(chunk)}</span>`).join('');
    }
    return `<p class="${index === 0 ? 'admission-value-main' : 'admission-value-detail'}">${content}</p>`;
  }).join('');
}

const shortNames: Record<string, string> = {
  'general-early': '一般選抜・前期（一般枠）',
  'general-region-national': '一般選抜・前期（地域枠／全国）',
  'general-region-ibaraki': '一般選抜・前期（地域枠／茨城県内）',
  'recommendation-general': '推薦入試（一般）',
  'recommendation-region': '推薦入試（茨城県地域枠）',
  research: '研究型人材入試',
  'ib-july': '国際バカロレア（7月募集）',
  'ib-october': '国際バカロレア（10月募集）',
  overseas: '海外教育プログラム',
};

export function renderTsukubaAdmissionsReadable(data: UniversityAdmissions): string {
  const sourceIds = (ids: string[]) => `data-admission-source-ids="${escape(JSON.stringify(ids))}"`;
  const sourceHint = '<a class="admission-source-hint" href="#admission-sources">情報ソースはこちら</a>';
  const summaryCell = (label: string, content: string) => `<td><span class="admission-mobile-label" aria-hidden="true">${label}</span>${content}</td>`;
  const summaryValue = (row: UniversityAdmissionRow | undefined) => row ? escape(displayText(firstSentence(row.value))) : '未公表';
  const overview = data.schemes.map(scheme => {
    const region = scheme.id.startsWith('general-region-');
    const ib = scheme.id.startsWith('ib-');
    const population = scheme.scheduleRows.find(row => /募集人員|募集・人数/u.test(row.label));
    const regionCount = population?.value.match(/地域枠全体(\d+人予定)/u)?.[1];
    const ibCount = population?.value.match(/合計(\d+人)/u)?.[1];
    if ((region && !regionCount) || (ib && !ibCount)) throw new Error('Shared admission quota cannot be summarized');
    const populationText = region ? `地域枠全体で${escape(regionCount!)}<br><small>全国・県内別は未公表</small>` : ib ? `7月・10月合計${escape(ibCount!)}<br><small>募集月別の人数は未公表</small>` : escape(firstSentence(population?.value ?? '未公表'));
    // Both submission and registration are necessary; the overview never merges deadlines.
    const registration = scheme.scheduleRows.find(row => /^Web登録/u.test(row.label));
    const documents = scheme.scheduleRows.find(row => /^出願書類|^書類提出$/u.test(row.label));
    const application = region ? '未公表' : registration ? `<span class="admission-overview-date"><b>Web</b>${summaryValue(registration)}</span><span class="admission-overview-date"><b>書類</b>${summaryValue(documents)}</span>` : summaryValue(scheme.scheduleRows.find(row => row.label === '出願期間'));
    const exam = scheme.scheduleRows.find(row => /個別学力検査等|予定試験日|試験日・時間割|第2次試験/u.test(row.label));
    // A multi-day timetable remains explicit in the details linked from the row.
    const firstExamDay = exam?.value.match(/(\d{4}年\d+月\d+日)[：に]/u)?.[1];
    const secondExamDay = exam?.value.match(/[、。](\d+日)[：に]/u)?.[1];
    const examText = exam && firstExamDay && secondExamDay ? `${escape(firstExamDay)}・${escape(secondExamDay)}` : summaryValue(exam);
    return `<tr data-readable-overview="${scheme.id}"><th scope="row"><a href="#admission-scheme-${scheme.id}">${escape(shortNames[scheme.id] ?? scheme.name)}</a></th><td data-admission-origin="${scheme.id}/schedule/${scheme.scheduleRows.indexOf(population!)}" data-admission-population ${sourceIds(population!.sourceIds)}${population?.status ? ` data-admission-status="${population.status}"` : ''}><span class="admission-mobile-label" aria-hidden="true">募集人数</span>${populationText}</td>${summaryCell('出願', application)}${summaryCell('試験日', examText)}</tr>`;
  }).join('');
  const overviewHtml = `<h3 id="admission-overview">入試方式・募集人数・主要日程</h3><p class="admission-overview-intro">2027年4月入学の入試です。推薦・特別入試には2026年実施の日程を含みます。方式名から出願条件と試験内容へ移動できます。</p><table class="admission-overview-table"><caption class="admission-sr-only">筑波大学医学類 2027年度 入試方式の一覧</caption><thead><tr><th scope="col">入試方式</th><th scope="col">募集人数</th><th scope="col">出願</th><th scope="col">試験日</th></tr></thead><tbody>${overview}</tbody></table><p class="admission-overview-sources">${sourceHint}</p>`;

  const rowMarkup = (scheme: UniversityAdmissionScheme, kind: string, index: number, row: UniversityAdmissionRow, table: boolean) => {
    const presentation = rowPresentation(scheme, kind, row);
    if (!presentation) return '';
    const originAttribute = kind === 'schedule' && /募集人員|募集・人数/u.test(row.label) ? 'data-admission-extra-origin' : 'data-admission-origin';
    const attributes = `${originAttribute}="${scheme.id}/${kind}/${index}" data-admission-row="${index}" ${sourceIds(row.sourceIds)}${row.status ? ` data-admission-status="${row.status}"` : ''}`;
    const content = `<div data-admission-value>${readableAdmissionValue(presentation.value, ['共通テスト指定科目', '研究実績の要件'].includes(row.label))}</div>`;
    return table ? `<tr ${attributes}><th scope="row" data-admission-label>${escape(presentation.label)}</th><td>${content}</td></tr>` : `<div class="admission-fact" ${attributes}><dt data-admission-label>${escape(presentation.label)}</dt><dd>${content}</dd></div>`;
  };
  const heading = (title: string) => `<h4 class="admission-group-title">${title}</h4>`;
  const detailGroup = (scheme: UniversityAdmissionScheme, title: string, kind: string, entries: { row: UniversityAdmissionRow; index: number }[]) => {
    const content = entries.map(({ row, index }) => rowMarkup(scheme, kind, index, row, false)).join('');
    return content ? `${title ? heading(title) : ''}<dl class="admission-facts">${content}</dl>` : '';
  };
  const scored = data.schemes.find(scheme => scheme.id === 'general-early');
  const scoreTable = (scheme: UniversityAdmissionScheme) => {
    if (scheme.id !== 'general-early') return '';
    const common = scheme.examRows.find(row => row.label === '共通テスト配点');
    const individual = scheme.examRows.find(row => row.label === '個別試験科目・配点');
    if (!common || !individual) throw new Error('Tsukuba score rows are missing');
    const score = (row: UniversityAdmissionRow, label: string) => {
      const match = row.value.match(new RegExp(`${label}(\\d+)点`, 'u'));
      if (!match) throw new Error(`Missing score for ${label}`);
      return Number(match[1]);
    };
    const matrix = [
      ['国語', score(common, '国語'), null],
      ['地歴・公民', score(common, '地歴・公民'), null],
      ['数学', score(common, '数学'), score(individual, '数学')],
      ['理科', score(common, '理科'), score(individual, '理科')],
      ['外国語', score(common, '外国語'), score(individual, '英語')],
      ['情報Ⅰ', score(common, '情報Ⅰ'), null],
      ['適性試験①・筆記', null, score(individual, '適性試験（1）')],
      ['適性試験②・面接', null, score(individual, '適性試験（2）')],
    ] as const;
    const totalCommon = score(common, '計'), totalIndividual = score(individual, '計');
    if (matrix.reduce((sum, row) => sum + (row[1] ?? 0), 0) !== totalCommon || matrix.reduce((sum, row) => sum + (row[2] ?? 0), 0) !== totalIndividual) throw new Error('Tsukuba score totals do not match');
    const point = (value: number | null) => value === null ? '<span aria-label="課さない">—</span>' : `${value.toLocaleString('ja-JP')}点`;
    return `<table class="admission-score-table" data-readable-scores data-admission-origin="${scheme.id}/exam/${scheme.examRows.indexOf(common)}" ${sourceIds(common.sourceIds)}><caption>一般枠の教科別配点</caption><thead><tr><th scope="col">教科・試験</th><th scope="col">共通テスト</th><th scope="col">個別試験</th></tr></thead><tbody>${matrix.map(([label, c, i]) => `<tr><th scope="row">${label}</th><td>${point(c)}</td><td>${point(i)}${label === '外国語' ? '<small>英語</small>' : ''}</td></tr>`).join('')}<tr class="admission-score-total"><th scope="row">合計</th><td>${point(totalCommon)}</td><td>${point(totalIndividual)}</td></tr><tr class="admission-score-total"><th scope="row">総合計</th><td colspan="2">${point(totalCommon + totalIndividual)}</td></tr></tbody></table>`;
  };
  // Do not infer the matrix for another scheme from the general selection.
  if (!scored) throw new Error('Tsukuba general scheme is missing');
  const schemes = data.schemes.map(scheme => {
    const entries = scheme.scheduleRows.map((row, index) => ({ row, index }));
    const population = entries.filter(({ row }) => /募集人員|募集・人数/u.test(row.label));
    const eligibility = entries.filter(({ row }) => !population.some(entry => entry.row === row) && /資格|要件|推薦人数|1校|出願条件|地域条件|英語条件|修学資金|県手続/u.test(row.label));
    const dates = entries.filter(entry => !population.includes(entry) && !eligibility.includes(entry));
    const notesHtml = scheme.notes.map((note, index) => {
      const value = notePresentation(scheme, index, note.text);
      return value ? `<div data-admission-note="${index}" ${sourceIds(note.sourceIds)}><div data-admission-note-text>${readableAdmissionValue(value)}</div></div>` : '';
    }).join('');
    return `<section class="admission-readable-scheme" data-admission-scheme="${scheme.id}" aria-labelledby="admission-scheme-${scheme.id}"><h3 id="admission-scheme-${scheme.id}">${escape(scheme.name)}</h3>${detailGroup(scheme, '', 'schedule', population)}${heading('出願・試験・手続の日程')}<table class="admission-dates-table"><caption class="admission-sr-only">${escape(scheme.name)}の日程</caption><thead><tr><th scope="col">項目</th><th scope="col">日程・提出条件</th></tr></thead><tbody>${dates.map(({ row, index }) => rowMarkup(scheme, 'schedule', index, row, true)).join('')}</tbody></table>${detailGroup(scheme, '出願資格・推薦条件', 'schedule', eligibility)}${heading('試験科目・配点')}${scoreTable(scheme)}<dl class="admission-facts">${scheme.examRows.map((row, index) => rowMarkup(scheme, 'exam', index, row, false)).join('')}</dl>${detailGroup(scheme, '試験会場・受験票', 'venue', scheme.venueRows.map((row, index) => ({ row, index })))}${notesHtml ? `<div class="admission-important admission-scheme-notes"><h4>併願・出願時の注意</h4>${notesHtml}</div>` : ''}<p class="admission-section-links">${sourceHint}<a href="#admission-overview">入試方式の一覧へ戻る ↑</a></p></section>`;
  }).join('');
  const coverageHtml = data.coverageNotes.map((note, index) => {
    const value = coveragePresentation(note, index);
    return value ? `<li><div data-admission-coverage-note="${index}">${readableAdmissionValue(value)}</div></li>` : '';
  }).join('');
  const sourceFooter = `<details class="admission-source-footer"><summary>情報ソースはこちら</summary><div id="admission-sources"><p>筑波大学・関連機関の公式資料</p><ul data-admission-source-list class="admission-source-list">${data.sources.map(source => `<li data-admission-source-id="${source.id}"><a href="${escape(source.url)}">${escape(source.title)}</a>${source.pages ? `<small>参照：${escape(Array.isArray(source.pages) ? `PDF p.${source.pages.join('、')}` : source.pages)}</small>` : ''}<small>確認日：<time datetime="${escape(source.retrievedAt)}">${source.retrievedAt.slice(0, 10)}</time></small></li>`).join('')}</ul></div></details>`;
  return `<h2 id="最新の入試情報">2027年度の入試情報</h2><section class="admission-readable" data-university-admissions-year="2027" data-admissions-presentation="readable-v1" aria-labelledby="最新の入試情報"><p class="admission-verified">公式資料確認日：<time data-university-admissions-verified-at datetime="${escape(data.verifiedAt)}">${escape(data.verifiedAt.slice(0, 10))}</time></p>${overviewHtml}${schemes}<h3 id="admission-coverage">掲載範囲・未公表事項</h3><ul class="admission-coverage">${coverageHtml}</ul>${sourceFooter}</section>`;
}
