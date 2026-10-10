import type { UniversityAdmissions, UniversityAdmissionScheme } from './universityAdmissions';
import overview from '../data/yamanashiUniversityOverview.json' with { type: 'json' };

const escape = (value: string) => value.replace(/[&<>"']/gu, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[character]!);
type Entry = { label: string; value: string; origins: string[]; sourceIds: string[]; status?: string };
const fact = (entry: Entry) => `data-admission-origins="${escape(JSON.stringify(entry.origins))}" data-admission-source-ids="${escape(JSON.stringify(entry.sourceIds))}"${entry.status === 'unpublished' ? ' data-admission-status="unpublished"' : ''}`;
const readable = (value: string) => value.split(/(?<=[。])/u).filter(Boolean).map((sentence, index) => `<p class="${index ? 'admission-value-detail' : 'admission-value-main'}">${escape(sentence).replace(/(?=[①②③④⑤])/gu,'<br>')}</p>`).join('');
const value = (entry: Entry) => `<div data-admission-value>${readable(entry.value)}</div>`;
const definitions = (entries: Entry[]) => `<dl class="admission-facts">${entries.map(e=>`<div class="admission-fact" ${fact(e)}><dt>${escape(e.label)}</dt><dd>${value(e)}</dd></div>`).join('')}</dl>`;
const heading = (title: string) => `<h4 class="admission-group-title">${title}</h4>`;
const dates = (entries: Entry[], name: string) => `<table class="admission-dates-table"><caption class="admission-sr-only">${escape(name)}の日程</caption><thead><tr><th scope="col">項目</th><th scope="col">日程・提出条件</th></tr></thead><tbody>${entries.map(e=>`<tr ${fact(e)}><th scope="row">${escape(e.label)}</th><td>${value(e)}</td></tr>`).join('')}</tbody></table>`;
const notes = (entries: Entry[]) => `<ul class="admission-conditions">${entries.map(e=>`<li ${fact(e)}>${value(e)}</li>`).join('')}</ul>`;
const origin = (scheme: UniversityAdmissionScheme, kind: string, index: number) => `${scheme.id}/${kind}/${index}`;
const entries = (scheme: UniversityAdmissionScheme, kind: 'schedule'|'exam'|'venue'|'note'): Entry[] => {
  const rows = kind === 'note' ? scheme.notes.map(n=>({label:'',value:n.text,sourceIds:n.sourceIds})) : scheme[`${kind}Rows`];
  return rows.map((r,index)=>({...r,origins:[origin(scheme,kind,index)]}));
};
// Merge only exactly equal facts from the two recommendation routes.
const shared = (left: Entry[], right: Entry[]) => left.map((e,i)=>{
  if (e.label !== right[i].label || e.value !== right[i].value) throw new Error(`Yamanashi shared fact differs: ${e.origins[0]}`);
  return {...e,origins:[...e.origins,...right[i].origins],sourceIds:[...new Set([...e.sourceIds,...right[i].sourceIds])]};
});
const sourceHint = '<a class="admission-source-hint" href="#admission-sources">情報ソースはこちら</a>';

function scores(common: Entry[], individual: Entry[], name: string) {
  const remainder: Entry[]=[];
  const score = (entry: Entry|undefined) => {
    if (!entry) return '課さない';
    const match=entry.value.match(/^(\d[\d,]*点)(?:。|$)(.*)$/u);
    if (!match) throw new Error(`Yamanashi numeric score needs a reviewed split: ${entry.origins[0]}`);
    if (match[2]) remainder.push({...entry,value:match[2]});
    return `<span ${fact(entry)} data-admission-score-prefix data-admission-value>${escape(match[1])}</span>`;
  };
  const subjects=['国語','地理歴史・公民','数学','理科','外国語','情報','面接'];
  const rows=subjects.filter(label=>common.some(e=>e.label===`共通テスト ${label}`)||individual.some(e=>e.label===`個別 ${label==='外国語'?'英語':label}`));
  const body=rows.map(label=>`<tr><th scope="row">${label}</th><td>${score(common.find(e=>e.label===`共通テスト ${label}`))}</td>${individual.length?`<td>${score(individual.find(e=>e.label===`個別 ${label==='外国語'?'英語':label}`))}</td>`:''}</tr>`).join('');
  const total=`<tr class="admission-score-total"><th scope="row">合計</th><td>${score(common.find(e=>e.label==='共通テスト 合計'))}</td>${individual.length?`<td>${score(individual.find(e=>e.label==='個別 合計・総配点'))}</td>`:''}</tr>`;
  return `<table class="admission-score-table"><caption>${escape(name)}の配点</caption><thead><tr><th scope="col">教科・検査</th><th scope="col">共通テスト</th>${individual.length?'<th scope="col">個別試験</th>':''}</tr></thead><tbody>${body}${total}</tbody></table>${remainder.map(e=>`<div class="admission-fact" ${fact(e)} data-admission-score-remainder><div>${escape(e.label)}</div>${value(e)}</div>`).join('')}`;
}

export const yamanashiMetadata = {
  title:'山梨大学 医学部2027年度入試情報', displayTitle:'山梨大学 医学部2027年度入試情報',
  categories:['大学別入試情報','大学別基本情報','国公立医学部','中部'],
  displayTitleLines:['山梨大学 医学部','2027年度入試情報'],
  lead:'山梨大学医学部医学科の2027年度入試情報（試験日程、会場、科目、配点、出題範囲等）を、大学公式資料に基づき選抜方式別にまとめています。出願前には、該当年度の学生募集要項と大学の変更通知をご確認ください。',
  description:'山梨大学医学部医学科の2027年度入試情報。後期日程90人、地域枠推薦の県内5人以内・全国10人以内の募集、日程、科目・配点、出願条件を紹介。医学部の所在地・アクセスと2026年度医学科入学者の男女比も掲載しています。',
  keyPoints:[
    '一般選抜は後期日程のみで90人募集。個別試験は2027年3月12日・13日の両日を受験します。',
    '後期日程は共通テスト1,000点＋個別試験2,300点＝計3,300点。個別理科は2科目で1,000点です。',
    '地域枠推薦は県内5人以内・全国10人以内。調査書の学習成績概評Aと、修学資金第二種の利用・県内勤務・合格時の入学確約が必要です。',
  ],
};

export function renderYamanashiAdmissionsReadable(data: UniversityAdmissions): string {
  const [general,prefecture,national]=data.schemes;
  if (general.id!=='general-late'||prefecture.id!=='recommendation-prefecture'||national.id!=='recommendation-national') throw new Error('Unexpected Yamanashi routes');
  const generalDates=entries(general,'schedule'),generalExam=entries(general,'exam'),generalVenue=entries(general,'venue'),generalNotes=entries(general,'note');
  const prefExam=entries(prefecture,'exam'),nationalExam=entries(national,'exam');
  const commonDates=shared(entries(prefecture,'schedule'),entries(national,'schedule'));
  const commonExam=shared(prefExam.slice(2,11),nationalExam.slice(2,11));
  const commonVenue=shared(entries(prefecture,'venue'),entries(national,'venue'));
  const commonNotes=shared(entries(prefecture,'note'),entries(national,'note'));
  const mobile = (label:string,content:string)=>`<td><span class="admission-mobile-label" aria-hidden="true">${label}</span>${content}</td>`;
  const population = (e:Entry)=>`<td ${fact(e)}><span class="admission-mobile-label" aria-hidden="true">募集人数</span><span data-admission-value>${escape(e.value)}</span></td>`;
  const overviewRows=data.schemes.map((s,i)=>{
    const quota=entries(s,'exam')[0];
    return `<tr><th scope="row"><a href="#admission-scheme-${s.id}">${i===0?'一般選抜（後期）':i===1?'地域枠推薦（県内）':'地域枠推薦（全国）'}</a></th>${population(quota)}${mobile('出願',i===0?'2027年1月25日〜2月3日':'2026年12月10日〜17日<br>16時30分必着')}${mobile('試験日',i===0?'2027年3月12日・13日<br>両日受験':'2027年2月8日（面接）')}</tr>`;
  }).join('');
  const overviewHtml=`<h3 id="admission-overview">入試方式・募集人数・主要日程</h3><table class="admission-overview-table" data-admission-coverage-note="0"><caption class="admission-sr-only">医学科2027年度入試一覧</caption><thead><tr><th scope="col">入試方式</th><th scope="col">募集人数</th><th scope="col">出願</th><th scope="col">試験日</th></tr></thead><tbody>${overviewRows}</tbody></table><p class="admission-overview-sources">${sourceHint}</p><div class="admission-important" data-admission-coverage-note="3">${escape(data.coverageNotes[3])}</div>`;
  const g=`<section data-admission-scheme="${general.id}" class="admission-readable-scheme"><h3 id="admission-scheme-${general.id}">${escape(general.name)}</h3>${heading('出願・試験・手続の日程')}${dates(generalDates.filter(e=>e.status!=='unpublished'),'後期日程')}${heading('試験科目・配点')}${scores(generalExam.filter(e=>e.label.startsWith('共通テスト ')),generalExam.filter(e=>e.label.startsWith('個別 ')),'後期日程')}${definitions(generalExam.filter(e=>['小論文','第1段階選抜'].includes(e.label)))}${heading('試験会場')}${definitions(generalVenue.filter(e=>e.status!=='unpublished'))}${heading('出願・合格判定の注意')}${notes(generalNotes)}<p class="admission-section-links">${sourceHint}<a href="#admission-overview">入試方式の一覧へ戻る ↑</a></p></section>`;
  const route=(s:UniversityAdmissionScheme,e:Entry[])=>`<section data-admission-scheme="${s.id}" class="admission-readable-scheme"><h3 id="admission-scheme-${s.id}">${escape(s.name)}</h3>${heading('出願資格')}${definitions([e[1]])}${heading('第1段階選抜')}${definitions([e[11]])}<p class="admission-section-links"><a href="#admission-recommendation-common">日程・共通の出願条件はこちら ↑</a></p></section>`;
  const recommendation=`<section class="admission-readable-scheme"><h3 id="admission-recommendation-common">学校推薦型選抜Ⅱに共通する日程・条件</h3>${heading('出願・試験・手続の日程')}${dates(commonDates,'地域枠推薦（県内・全国共通）')}${heading('両枠に共通する出願条件')}${definitions([commonExam[0]])}${route(prefecture,prefExam)}${route(national,nationalExam)}${heading('試験科目・配点（県内・全国共通）')}${scores(commonExam.filter(e=>e.label.startsWith('共通テスト ')),[],'地域枠推薦')}${definitions(commonExam.filter(e=>e.label==='最終選抜の検査・配点'))}${heading('試験会場・受験票')}${definitions(commonVenue)}${notes([commonNotes[7]])}${heading('併願・出願書類の注意')}${notes(commonNotes.filter((_,i)=>![2,5,7].includes(i)))}<p class="admission-section-links">${sourceHint}<a href="#admission-overview">入試方式の一覧へ戻る ↑</a></p></section>`;
  const region=`<h3 id="admission-region-duty">地域枠の修学資金と県内勤務</h3>${notes([commonNotes[2]])}<p class="admission-section-links">${sourceHint}</p>`;
  const unpublished=[...generalDates.filter(e=>e.status==='unpublished'),...generalExam.filter(e=>e.status==='unpublished'),...generalVenue.filter(e=>e.status==='unpublished')];
  const publication=`<h3 id="admission-publication">一般選抜募集要項の公開予定</h3><p data-admission-coverage-note="2">${escape(data.coverageNotes[2])}</p>${definitions(unpublished)}<p data-admission-coverage-note="1">${escape(data.coverageNotes[1])}</p>`;
  const sourceFooter=`<details class="admission-source-footer"><summary>情報ソースはこちら</summary><div id="admission-sources"><p>公式資料確認日：<time data-university-admissions-verified-at datetime="${escape(data.verifiedAt)}">${data.verifiedAt.slice(0,10)}</time></p><ul data-admission-source-list class="admission-source-list">${data.sources.map(s=>`<li data-admission-source-id="${s.id}"><a href="${escape(s.url)}">${escape(s.title)}</a><small>参照：${escape(Array.isArray(s.pages)?s.pages.join('、'):s.pages??'募集要項一覧')}／確認日：${s.retrievedAt.slice(0,10)}</small></li>`).join('')}</ul></div></details>`;
  return `<h2 id="最新の入試情報">2027年度の入試情報</h2><section class="admission-readable" data-university-admissions-year="2027" data-admissions-presentation="yamanashi-readable-v2">${overviewHtml}${g}${recommendation}${region}${publication}${sourceFooter}</section>`;
}

export function renderYamanashiUniversityOverview(): string {
  const {entrants,address}=overview;
  if (entrants.male+entrants.female!==entrants.total)throw new Error('Yamanashi medical entrants total differs');
  return `<h2 id="大学基本情報">大学基本情報</h2><section class="admission-readable" data-yamanashi-overview><h3 id="所在地">所在地</h3><p>〒${address.postalCode} ${escape(address.street)}<br>山梨大学医学部キャンパス<br>電話：${escape(address.phone)}</p><h3 id="アクセス">アクセス</h3><p>${escape(overview.access)}</p><h3 id="男女比">男女比</h3><table class="admission-score-table"><caption>${entrants.year}年度 医学科入学者（${entrants.total}人）</caption><thead><tr><th scope="col">区分</th><th scope="col">人数</th><th scope="col">割合</th></tr></thead><tbody>${[['男性',entrants.male],['女性',entrants.female]].map(([label,count])=>`<tr><th scope="row">${label}</th><td>${count}人</td><td>${(Number(count)/entrants.total*100).toFixed(1)}%</td></tr>`).join('')}</tbody></table><h3 id="現浪比">現浪比</h3><p>${escape(overview.currentGraduate)}</p><details class="admission-source-footer"><summary>情報ソースはこちら</summary><ul class="admission-source-list">${overview.sources.map(s=>`<li><a href="${escape(s.url)}">${escape(s.title)}</a><small>確認日：${s.retrievedAt.slice(0,10)}</small></li>`).join('')}</ul></details></section>`;
}
