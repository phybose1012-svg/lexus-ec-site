import type { UniversityAdmissions } from './universityAdmissions';
import copy from '../data/hirosakiReaderCopy.json' with { type: 'json' };
import overview from '../data/hirosakiUniversityOverview.json' with { type: 'json' };

const esc = (value: string) => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const prose = (value: string) => value.split(/(?<=。)/u).filter(Boolean).map((part, i) => `<p class="${i ? 'admission-value-detail' : 'admission-value-main'}">${esc(part).replace(/\n/g, '<br>')}</p>`).join('');
type Fact = { id: string; label: string; text: string; sourceIds: string[]; status?: string };
const attrs = (r: Fact) => `data-hirosaki-fact="${r.id}" data-admission-source-ids="${esc(JSON.stringify(r.sourceIds))}"${r.status ? ` data-admission-status="${r.status}"` : ''}`;
const fact = (r: Fact) => `<div class="admission-fact" ${attrs(r)}><dt>${esc(r.label)}</dt><dd data-hirosaki-value>${prose(r.text)}</dd></div>`;
const facts = (rows: Fact[]) => `<dl class="admission-facts">${rows.map(fact).join('')}</dl>`;
const hint = '<a class="admission-source-hint" href="#hirosaki-admission-sources">情報ソースはこちら</a>';
const links = () => `<p class="admission-section-links">${hint}<a href="#admission-overview">入試方式の一覧へ戻る ↑</a></p>`;

export function hirosakiAdmissionsMetadata() { return { ...copy.metadata, modified: copy.verifiedAt }; }

/** Hirosaki's two frames within each selection share dates/scores in the official tables. */
export function renderHirosakiAdmissionsReadable(data: UniversityAdmissions): string {
  if (data.path !== '/information-hirosaki/' || data.schemes.map(s => s.id).join('|') !== copy.groups.flatMap(g => g.schemeIds).join('|')) throw new Error('Hirosaki presentation requires its exact four schemes');
  const cell = (label: string, value: string) => `<td><span class="admission-mobile-label" aria-hidden="true">${label}</span>${esc(value).replace(/\n/g, '<br>')}</td>`;
  const summary = `<h3 id="admission-overview">入試方式・募集人数・主要日程</h3><p class="admission-overview-intro">2027年4月入学の入試です。方式名から日程・出願条件へ移動できます。</p><table class="admission-overview-table" data-hirosaki-table="overview"><caption class="admission-sr-only">弘前大学医学科 2027年度入試方式</caption><thead><tr><th scope="col">入試方式</th><th scope="col">募集人数</th><th scope="col">出願</th><th scope="col">試験日</th></tr></thead><tbody>${copy.overview.map(row => `<tr data-hirosaki-overview="${row.id}"><th scope="row"><a href="#admission-scheme-${row.id}">${esc(row.name)}</a></th><td data-hirosaki-fact="quota-${row.id}"><span class="admission-mobile-label" aria-hidden="true">募集人数</span><span data-hirosaki-value>${esc(row.quota)}</span></td>${cell('出願', row.application)}${cell('試験日', row.exam)}</tr>`).join('')}</tbody></table><div class="admission-important" ${attrs(copy.capacity)}><strong>${esc(copy.capacity.label)}</strong><div data-hirosaki-value>${prose(copy.capacity.text)}</div></div><p class="admission-overview-sources">${hint}</p>`;
  const scores = (g: typeof copy.groups[number]) => {
    const s = g.scores;
    if (s.common.reduce((a,b) => a+b,0) !== s.commonTotal || s.individual.reduce((a,b) => a+Number(b[1]),0) !== s.individualTotal || s.commonTotal+s.individualTotal !== s.total) throw new Error('Hirosaki score totals differ');
    const labels = ['国語', '地歴・公民', '数学', '理科', '英語', '情報Ⅰ'];
    const rows: [string, number | null, number | null][] = labels.map((label,i) => [label,s.common[i],g.id==='general'&&['数学','英語'].includes(label)?300:null]);
    if(g.id==='comprehensive') rows.push(['個人面接',null,200],['総合論述',null,200]);
    const number = (n: number | null) => n===null ? '課さない' : `${n.toLocaleString('ja-JP')}点`;
    return `<table class="admission-score-table" data-hirosaki-table="${g.id}-scores" data-hirosaki-fact="${s.id}"><caption>${esc(g.title)}の配点（両枠共通）</caption><thead><tr><th scope="col">教科・試験</th><th scope="col">共通テスト</th><th scope="col">個別試験</th></tr></thead><tbody>${rows.map(([label,c,i])=>`<tr><th scope="row">${label}</th><td>${number(c)}</td><td>${number(i)}</td></tr>`).join('')}<tr class="admission-score-total"><th scope="row">合計</th><td>${number(s.commonTotal)}</td><td>${number(s.individualTotal)}</td></tr><tr class="admission-score-total"><th scope="row">総合計</th><td colspan="2">${number(s.total)}</td></tr></tbody></table>`;
  };
  const groups = copy.groups.map(g => `<section class="admission-readable-scheme" data-hirosaki-group="${g.id}"><h3 id="hirosaki-${g.id}">${esc(g.title)}</h3>${g.schemeIds.map(id => `<span id="admission-scheme-${id}" class="hirosaki-frame-anchor" aria-hidden="true"></span>`).join('')}<h4 class="admission-group-title">出願・試験・手続の日程（両枠共通）</h4><table class="admission-dates-table" data-hirosaki-table="${g.id}-dates"><caption class="admission-sr-only">${esc(g.title)}の日程</caption><thead><tr><th scope="col">項目</th><th scope="col">日程・提出条件</th></tr></thead><tbody>${g.dates.map(r=>`<tr ${attrs(r)}><th scope="row">${esc(r.label)}</th><td data-hirosaki-value>${prose(r.text)}</td></tr>`).join('')}</tbody></table><h4 class="admission-group-title">出願資格・枠ごとの条件</h4>${facts(g.eligibility)}${'qualificationChoices' in g ? `<p>大学入学資格は次のいずれかです。</p><ul class="admission-conditions">${g.qualificationChoices!.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>` : ''}<h4 class="admission-group-title">試験科目・配点</h4>${scores(g)}${facts(g.facts)}<h4 class="admission-group-title">試験会場・受験票</h4>${facts(g.venues)}<h4 class="admission-group-title">出願時の注意・2027年度の変更</h4>${facts(g.notes)}${links()}</section>`).join('');
  const footer = `<details class="admission-source-footer"><summary>情報ソースはこちら</summary><div id="hirosaki-admission-sources"><p>公式資料確認日：<time data-university-admissions-verified-at datetime="${esc(data.verifiedAt)}">${copy.verifiedAt}</time></p><ul class="admission-source-list" data-admission-source-list>${data.sources.map(s=>`<li data-admission-source-id="${s.id}"><a href="${esc(s.url)}">${esc(s.title)}</a>${s.pages?`<small>${esc(Array.isArray(s.pages)?s.pages.join('・'):s.pages)}</small>`:''}<small>確認日：${esc(s.retrievedAt.slice(0,10))}</small></li>`).join('')}</ul></div></details>`;
  return `<h2 id="最新の入試情報">2027年度の入試情報</h2><section class="admission-readable hirosaki-readable" data-university-admissions-year="2027" data-admissions-presentation="hirosaki-readable-v1">${summary}${groups}<h3 id="hirosaki-publication">募集要項の公開予定・その他の選抜</h3>${facts([copy.publication,copy.scope])}${footer}</section>`;
}

export function renderHirosakiRegionalConditions(): string {
  return `<h2 id="hirosaki-regional-obligations">青森県での医療従事と離脱条件</h2><section class="admission-readable hirosaki-readable">${facts([copy.regional])}<h3 id="hirosaki-withdrawal">離脱が認められる場合</h3><ul class="admission-conditions">${copy.withdrawal.map(s=>`<li>${esc(s)}</li>`).join('')}</ul><p>${esc(copy.withdrawalNote)}</p><p class="admission-overview-sources">${hint}</p></section>`;
}

export function renderHirosakiUniversityOverview(): string {
  const e=overview.entrants;
  if(e.male+e.female!==e.total||e.current+e.oneYear+e.twoOrMore+e.other!==e.total) throw new Error('Hirosaki entrant totals differ');
  const table=(id:string,title:string,rows:[string,number][])=>`<h3 id="${id}">${title}</h3><table class="admission-score-table" data-hirosaki-table="${id}"><caption>${e.year}年度 医学科入学者（${e.total}人）</caption><thead><tr><th scope="col">区分</th><th scope="col">人数</th><th scope="col">割合</th></tr></thead><tbody>${rows.map(([label,count])=>`<tr><th scope="row">${label}</th><td>${count}人</td><td>${(count/e.total*100).toFixed(1)}%</td></tr>`).join('')}</tbody></table>`;
  return `<h2 id="大学基本情報">大学基本情報</h2><section class="admission-readable hirosaki-readable" data-hirosaki-overview><h3 id="所在地">所在地</h3><p>〒${esc(overview.address.postalCode)} ${esc(overview.address.street)}<br>${esc(overview.name)}<small>${esc(overview.address.office)}</small></p><h3 id="アクセス">アクセス</h3>${overview.access.map(s=>`<p>${esc(s)}</p>`).join('')}${table('男女比','男女比',[['男性',e.male],['女性',e.female]])}${table('現浪比','現浪比',[['現役',e.current],['1浪',e.oneYear],['2浪以上',e.twoOrMore],['その他（高卒認定等）',e.other]])}<details class="admission-source-footer"><summary>情報ソースはこちら</summary><ul class="admission-source-list">${overview.sources.map(s=>`<li><a href="${esc(s.url)}">${esc(s.title)}</a>${'pages' in s?`<small>${esc(s.pages!)}</small>`:''}<small>確認日：${s.retrievedAt}</small></li>`).join('')}</ul></details></section>`;
}
