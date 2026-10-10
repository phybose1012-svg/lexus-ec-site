import type { UniversityAdmissions } from './universityAdmissions';
import copy from '../data/tokushimaReaderCopy.json' with { type: 'json' };
import overview from '../data/tokushimaUniversityOverview.json' with { type: 'json' };
import canonical from '../data/universityAdmissions/tokushima.json' with { type: 'json' };

const escape = (value: string) => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const text = (value: string) => escape(value).replaceAll('\n','<br>');
const origins = (values: string[]) => {
  const scheme=canonical.schemes[0];
  const rows=values.flatMap(value=>{
    const [kind,index]=value.split('/');
    const group=kind==='schedule'?scheme.scheduleRows:kind==='exam'?scheme.examRows:kind==='venue'?scheme.venueRows:kind==='note'?scheme.notes:null;
    return group?[group[Number(index)]]:[];
  });
  const ids=[...new Set(rows.flatMap(row=>row.sourceIds))];
  const statuses=[...new Set(rows.flatMap(row=>'status' in row?[row.status]:[]))];
  return `data-tokushima-origins="${escape(JSON.stringify(values))}" data-admission-source-ids="${escape(JSON.stringify(ids))}" data-admission-statuses="${escape(JSON.stringify(statuses))}"`;
};
const heading = (title: string) => `<h4 class="admission-group-title">${escape(title)}</h4>`;
const facts = (rows: {origins: string[], label: string, text: string}[]) => `<dl class="admission-facts">${rows.map(row=>`<div class="admission-fact" ${origins(row.origins)}><dt>${escape(row.label)}</dt><dd>${text(row.text)}</dd></div>`).join('')}</dl>`;
const dates = (rows: {origins: string[], label: string, text: string}[],caption: string,id: string) => `<table class="admission-dates-table" data-tokushima-table="${id}"><caption class="admission-sr-only">${caption}</caption><thead><tr><th scope="col">項目</th><th scope="col">日程・条件</th></tr></thead><tbody>${rows.map(row=>`<tr ${origins(row.origins)}><th scope="row">${escape(row.label)}</th><td>${text(row.text)}</td></tr>`).join('')}</tbody></table>`;
const sources = (items: {id:string,title:string,url:string,retrievedAt:string,pages?:string|number[]}[],id:string) => `<details class="admission-source-footer" id="${id}"><summary>情報ソースはこちら</summary><ul id="${id}-list" style="scroll-margin-top:120px" class="admission-source-list" data-admission-source-list>${items.map(s=>`<li data-admission-source-id="${escape(s.id)}"><a href="${escape(s.url)}">${escape(s.title)}</a>${s.pages?`<small>参照：${text(Array.isArray(s.pages)?`PDF p.${s.pages.join('、')}`:s.pages)}</small>`:''}<small>確認日：${escape(s.retrievedAt.slice(0,10))}</small></li>`).join('')}</ul></details>`;

export const tokushimaMetadata = {
  title:'徳島大学医学部｜2027年度入試情報',
  displayTitle:'徳島大学 医学部2027年度入試情報',
  displayTitleLines:['徳島大学 医学部','2027年度入試情報'],
  description:'徳島大学医学部医学科の2027年度一般選抜前期の募集人数、出願・試験日程、会場、科目、時間、配点、出題範囲を掲載。所在地・アクセスと2026年度医学科入学者の男女比・現浪比も紹介します。',
  lead:'徳島大学医学部医学科の2027年度一般選抜前期について、募集人数、出願・試験日程、会場、科目、時間、配点、出題範囲をまとめています。出願前には、大学公式の学生募集要項と変更通知をご確認ください。',
  modified:copy.verifiedAt,
  keyPoints:copy.keyPoints,
};

export function renderTokushimaAdmissionsReadable(data: UniversityAdmissions): string {
  if(data.path!=='/information-tokushima/'||data.schemes.length!==1||data.schemes[0].id!=='general-early')throw new Error('Unexpected Tokushima admission scope');
  const point=(value:number|string|null)=>value===null?'課さない':typeof value==='number'?`${value.toLocaleString('ja-JP')}点`:escape(value);
  const common=copy.scores.reduce((n,r)=>n+(typeof r.common==='number'?r.common:0),0);
  const individual=copy.scores.reduce((n,r)=>n+(typeof r.individual==='number'?r.individual:0),0);
  if(common!==950||individual!==400)throw new Error('Tokushima score totals changed');
  const summaryCell=(label:string,value:string)=>`<td><span class="admission-mobile-label" aria-hidden="true">${label}</span>${text(value)}</td>`;
  const scoreTable=`<table class="admission-score-table" data-tokushima-table="scores"><caption>教科別配点（大学の傾斜配点後）</caption><thead><tr><th scope="col">教科・試験</th><th scope="col">共通テスト</th><th scope="col">個別試験</th></tr></thead><tbody>${copy.scores.map(row=>`<tr ${origins(row.origins)}><th scope="row">${escape(row.label)}</th><td>${point(row.common)}</td><td>${point(row.individual)}${row.label==='外国語'?'<small>英語</small>':''}</td></tr>`).join('')}<tr class="admission-score-total" ${origins(['exam/7','exam/11'])}><th scope="row">合計</th><td>${point(common)}</td><td>${point(individual)}</td></tr><tr class="admission-score-total" ${origins(['exam/11'])}><th scope="row">総合計</th><td colspan="2">${point(common+individual)}</td></tr></tbody></table>`;
  return `<h2 id="最新の入試情報">2027年度の入試情報</h2><section class="admission-readable" data-university-admissions-year="2027" data-admissions-presentation="tokushima-readable-v1" aria-labelledby="最新の入試情報"><h3 id="admission-overview">入試方式・募集人数・主要日程</h3><table class="admission-overview-table" data-tokushima-table="overview"><caption class="admission-sr-only">徳島大学医学科 一般選抜前期の一覧</caption><thead><tr><th scope="col">入試方式</th><th scope="col">募集人数</th><th scope="col">出願</th><th scope="col">試験日</th></tr></thead><tbody><tr><th scope="row"><a href="#admission-scheme-general-early">一般選抜・前期</a></th><td ${origins(['exam/0'])}><span class="admission-mobile-label" aria-hidden="true">募集人数</span>${text(copy.overview.quota)}<small>確定後に更新します</small></td>${summaryCell('出願',copy.overview.application)}${summaryCell('試験日',copy.overview.exam)}</tr></tbody></table><p class="admission-overview-sources"><a class="admission-source-hint" href="#admission-sources-list">情報ソースはこちら</a></p><section class="admission-readable-scheme" data-admission-scheme="general-early"><h3 id="admission-scheme-general-early">一般選抜（前期日程）</h3>${heading('出願・合格発表・手続の日程')}${dates(copy.dates,'一般選抜前期 出願・手続の日程','dates')}${facts([copy.notes[0]])}${heading('試験日・時間')}${dates(copy.timetable,'一般選抜前期 試験時間割（予定）','timetable')}${heading('試験科目・配点')}${scoreTable}${heading('科目選択・出題範囲')}${facts(copy.facts)}${heading('第1段階選抜')}${facts([copy.selection])}${heading('試験会場')}${facts(copy.venue)}${heading('受験する科目・得点換算')}${facts(copy.notes.slice(1))}</section><h3 id="admission-publication">募集要項の公開予定</h3><ul class="admission-coverage">${copy.publication.map(row=>`<li ${origins(row.origins)}>${text(row.text)}</li>`).join('')}</ul>${sources(data.sources,'admission-sources')}<time class="admission-sr-only" data-university-admissions-verified-at datetime="${data.verifiedAt}">${data.verifiedAt}</time></section>`;
}

export function renderTokushimaUniversityOverview(): string {
  const entrants=overview.entrants;
  const table=(id:string,title:string,rows:[string,number][])=>`<h3 id="${id}">${title}</h3><table class="admission-score-table" data-tokushima-table="${id}"><caption>${entrants.year}年度／医学科入学者／${entrants.total}人<br>${entrants.asOf}現在</caption><thead><tr><th scope="col">区分</th><th scope="col">人数</th><th scope="col">割合</th></tr></thead><tbody>${rows.map(([label,count])=>`<tr><th scope="row">${label}</th><td>${count}人</td><td>${(count/entrants.total*100).toFixed(1)}%</td></tr>`).join('')}</tbody></table>`;
  if(entrants.male+entrants.female!==entrants.total||entrants.currentGraduate+entrants.previousGraduate+entrants.other!==entrants.total)throw new Error('Tokushima entrants totals changed');
  return `<h2 id="大学基本情報">大学基本情報</h2><section class="admission-readable" data-tokushima-university-overview><h3 id="所在地">所在地</h3><p>〒${overview.address.postalCode} ${escape(overview.address.street)}<br>徳島大学医学部<br>電話：${overview.address.phone}</p><h3 id="アクセス">アクセス</h3><ul>${overview.access.map(value=>`<li>${text(value)}</li>`).join('')}</ul>${table('男女比','男女比',[['男性',entrants.male],['女性',entrants.female]])}${table('現浪比','現浪比',[['現役',entrants.currentGraduate],['既卒者',entrants.previousGraduate],['その他',entrants.other]])}<p>${escape(entrants.excluded)}</p>${sources(overview.sources,'tokushima-overview-sources')}</section>`;
}
