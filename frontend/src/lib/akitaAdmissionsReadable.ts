import type { UniversityAdmissions, UniversityAdmissionScheme } from './universityAdmissions';
import overview from '../data/akitaUniversityOverview.json' with { type: 'json' };

type Entry={label:string;value:string;origins:string[];sourceIds:string[];status?:string};
const escape=(s:string)=>s.replace(/[&<>"']/gu,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]!);
const attributes=(e:Entry)=>`data-admission-origins="${escape(JSON.stringify(e.origins))}" data-admission-source-ids="${escape(JSON.stringify(e.sourceIds))}"${e.status?` data-admission-status="${escape(e.status)}"`:''}`;
const value=(e:Entry)=>`<div data-admission-value>${e.value.split(/(?<=。)/u).filter(Boolean).map((s,i)=>`<p class="${i?'admission-value-detail':'admission-value-main'}">${escape(s)}</p>`).join('')}</div>`;
const entries=(s:UniversityAdmissionScheme,kind:'schedule'|'exam'|'venue'|'note'):Entry[]=>{
 const rows=kind==='note'?s.notes.map(n=>({label:'',value:n.text,sourceIds:n.sourceIds})):s[`${kind}Rows`];
 return rows.map((e,i)=>({...e,origins:[`${s.id}/${kind}/${i}`]}));
};
function combine(es:Entry[]):Entry{
 const first=es[0];if(es.some(e=>e.value!==first.value||e.status!==first.status))throw new Error(`Akita common fact differs: ${first.origins[0]}`);
 return {...first,origins:es.flatMap(e=>e.origins),sourceIds:[...new Set(es.flatMap(e=>e.sourceIds))]};
}
const heading=(s:string)=>`<h4 class="admission-group-title">${escape(s)}</h4>`;
const definitions=(es:Entry[],marker='')=>`<dl class="admission-facts">${es.map(e=>`<div class="admission-fact" ${attributes(e)} ${marker}><dt>${escape(e.label)}</dt><dd>${value(e)}</dd></div>`).join('')}</dl>`;
const notes=(es:Entry[])=>`<ul class="admission-conditions">${es.map(e=>`<li ${attributes(e)}>${value(e)}</li>`).join('')}</ul>`;
const hint='<a class="admission-source-hint" href="#admission-sources">情報ソースはこちら</a>';
const links=`<p class="admission-section-links">${hint}<a href="#admission-overview">入試方式の一覧へ戻る ↑</a></p>`;
const dates=(es:Entry[],name:string,extra='')=>`<table class="admission-dates-table"><caption>${escape(name)}</caption><thead><tr><th scope="col">項目</th><th scope="col">日程・提出条件</th></tr></thead><tbody>${es.map(e=>`<tr ${attributes(e)} ${extra==='data-admission-payment-period'&&e.origins.includes('general-early/schedule/1')?'data-admission-value-part="0"':''}><th scope="row">${escape(e.label)}</th><td>${value(e)}</td></tr>`).join('')}</tbody></table>`;
const number=(e:Entry)=>{const m=e.value.match(/^(\d+)点。/u);if(!m)throw new Error(`Akita score is missing: ${e.origins[0]}`);return Number(m[1]);};
const remainder=(e:Entry):Entry=>({...e,value:e.value.slice(`${number(e)}点。`.length)});
const prefix=(e:Entry)=>`<span ${attributes(e)} data-admission-score-prefix data-admission-value>${number(e)}点</span>`;
const deduplicate=(es:Entry[])=>{
 const groups=new Map<string,Entry[]>();for(const e of es.filter(e=>e.value)){const key=JSON.stringify([e.label,e.value,e.status]);groups.set(key,[...(groups.get(key)??[]),e]);}return [...groups.values()].map(combine);
};
const dateJp=(date:string)=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(date));
export const akitaMetadata={
 title:'秋田大学 医学部2027年度入試情報',displayTitle:'秋田大学 医学部2027年度入試情報',displayTitleLines:['秋田大学 医学部','2027年度入試情報'],
 categories:['大学別入試情報','大学別基本情報','国公立医学部','東北'],
 lead:'秋田大学医学部医学科の2027年度入試情報（日程、会場、科目、配点、出題範囲等）を選抜方式別にまとめています。学校推薦型・私費外国人留学生入試の試験時間も掲載しています。出願前には、該当年度の学生募集要項と大学の変更通知をご確認ください。',
 description:'秋田大学医学部医学科の2027年度入試情報。前期45人、後期一般20人、推薦一般20人・東北地域10人と申請予定の秋田県地域枠、留学生入試の日程・配点・条件を紹介。2026年度医学科入学者の統計と所在地・アクセスも掲載。',
 keyPoints:[
  '一般前期は45人（私費外国人留学生を含む）、後期一般枠は20人。秋田県地域枠は後期5人・学校推薦型24人を申請予定で、未確定です。',
  '前期の大学の試験は数学・英語・面接、後期は小論文・面接。学校推薦型は共通テスト500点＋小論文100点＋面接150点＝750点です。',
  '学校推薦型の書類は2026年12月15日17:00必着。12月14日以前の発信局消印があり、速達簡易書留で送った場合に限り、12月16日17:00到着まで受理されます。',
 ],
};
export function renderAkitaAdmissionsReadable(data:UniversityAdmissions):string{
 if(data.schemes.map(s=>s.id).join(',')!=='general-early,general-late,general-late-akita,recommendation-general,recommendation-tohoku,recommendation-akita,international-private')throw new Error('Unexpected Akita routes');
 const schemes=data.schemes,exams=schemes.map(s=>entries(s,'exam')),schedules=schemes.map(s=>entries(s,'schedule')),venues=schemes.map(s=>entries(s,'venue')),ns=schemes.map(s=>entries(s,'note'));
 const generals=exams.slice(0,3),recs=exams.slice(3,6),foreign=exams[6],scoreConditions:Entry[]=[];
 const point=(e:Entry)=>{const rest=remainder(e);if(rest.value)scoreConditions.push(rest);return prefix(e);};
 const row=(label:string,es:(Entry|undefined)[])=>`<tr><th scope="row">${escape(label)}</th>${es.map(e=>`<td>${e?point(e):'課さない'}</td>`).join('')}</tr>`;
 const scoreTable=(caption:string,headers:string[],body:string)=>`<table class="admission-score-table"><caption>${escape(caption)}</caption><thead><tr><th scope="col">教科・検査</th>${headers.map(h=>`<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table>`;
 const short=['一般前期','一般後期（一般枠）','一般後期（秋田県地域枠）','学校推薦型Ⅱ（一般枠）','学校推薦型Ⅱ（東北地域枠）','学校推薦型Ⅱ（秋田県地域枠）','私費外国人留学生'];
 const overviewDates=[['2027年1月25日～2月3日 必着','2027年2月25日・26日'],['2027年1月25日～2月3日 必着','2027年3月12日'],['2027年1月25日～2月3日 必着','2027年3月12日'],['2026年12月9日～15日 17:00必着','2027年1月21日'],['2026年12月9日～15日 17:00必着','2027年1月21日・22日'],['2026年12月9日～15日 17:00必着','2027年1月21日・22日'],['2027年1月25日～27日 必着','2027年2月25日・26日']];
 const quotas=exams.map(e=>e[0]);
 const quotaCell=(e:Entry,i:number)=>{
  const split=[0,2,5,6].includes(i);return `<td ${attributes(e)} ${split?'data-admission-quota-prefix':''}><span class="admission-mobile-label" aria-hidden="true">募集人数</span><span data-admission-value>${escape(split?e.value.split('。')[0]:e.value)}</span></td>`;
 };
 const quotaShared:Entry={label:'共有人数',value:'私費外国人留学生入試の若干名は、前期45名に含まれます。',origins:[...quotas[0].origins,...quotas[6].origins],sourceIds:[...new Set([...quotas[0].sourceIds,...quotas[6].sourceIds])],status:'confirmed'};
 const pending=combine([2,5].map(i=>({...quotas[i],value:quotas[i].value.slice(quotas[i].value.indexOf('。')+1)})));
 const overviewHtml=`<h3 id="admission-overview">入試方式・募集人数・主要日程</h3><table class="admission-overview-table" data-admission-coverage-note="0"><caption class="admission-sr-only">医学科2027年度入試一覧</caption><thead><tr><th scope="col">入試方式</th><th scope="col">募集人数</th><th scope="col">書類提出期間</th><th scope="col">大学の試験日</th></tr></thead><tbody>${schemes.map((s,i)=>`<tr><th scope="row"><a href="#admission-scheme-${s.id}">${short[i]}</a></th>${quotaCell(quotas[i],i)}${overviewDates[i].map((v,j)=>`<td><span class="admission-mobile-label" aria-hidden="true">${j?'大学の試験日':'書類提出期間'}</span>${v}</td>`).join('')}</tr>`).join('')}</tbody></table>${definitions([quotaShared],'data-admission-merged-quota')}<div ${attributes(pending)} data-admission-quota-remainder data-admission-coverage-note="1"><p data-admission-value>${escape(data.coverageNotes[1])}</p></div><p>${hint}</p>`;
 const payment=combine(schedules.slice(0,3).map(es=>es[1])),paymentPeriod=payment.value.split('。')[0]+'。',paymentAmount=payment.value.slice(paymentPeriod.length);
 const generalDates=dates(Array.from({length:5},(_,i)=>i===1?{...payment,label:'検定料の支払期間',value:paymentPeriod}:combine(schedules.slice(0,3).map(es=>es[i]))),'一般選抜に共通する日程','data-admission-payment-period')+dates([0,1].flatMap(i=>[5,6,7].map(j=>({... (i===0?schedules[0][j]:combine([schedules[1][j],schedules[2][j]])),label:(i===0?'前期：':'後期（両枠）：')+schedules[i][j].label}))),'一般選抜の試験・合格発表・入学手続');
 const generalHeaders=['前期','後期一般','後期県枠'],subjects=['国語','地理歴史・公民','数学','理科','外国語','情報'];
 for(const [i,expected] of [600,750,500].entries())if(generals[i].slice(2,8).reduce((n,e)=>n+number(e),0)!==expected||number(generals[i][8])!==expected)throw new Error('Akita common total differs');
 const commonScores=scoreTable('一般選抜：共通テストの配点',generalHeaders,subjects.map((name,i)=>row(name,generals.map(es=>es[2+i]))).join('')+row('共通テスト合計',generals.map(es=>es[8])));
 const individualRows=[row('数学',[generals[0][9],undefined,undefined]),row('英語',[generals[0][10],undefined,undefined]),row('小論文',[undefined,generals[1][9],generals[2][9]]),row('面接',[generals[0][11],generals[1][10],generals[2][10]]),row('個別合計',generals.map(es=>es.at(-1))),row('総点',[generals[0][12],generals[1][11],generals[2][11]])].join('');
 for(const [i,own] of [400,300,250].entries()){const es=generals[i],actual=(i===0?es.slice(9,12):es.slice(9,11)).reduce((n,e)=>n+number(e),0);if(actual!==own||number(es.at(-1)!)!==own||number(es[i===0?12:11])!==own+number(es[8]))throw new Error('Akita individual total differs');}
 const individualScores=scoreTable('一般選抜：大学の試験・総点',generalHeaders,individualRows);
 const generalEligibility=generals.map((es,i)=>`${heading(short[i])}<div id="admission-scheme-${schemes[i].id}" data-admission-scheme="${schemes[i].id}">${definitions([es[1]])}</div>`).join('');
 const stageOne=definitions([{...generals[0][13],label:'前期：第1段階選抜'},{...combine([generals[1][12],generals[2][12]]),label:'後期（一般枠・秋田県地域枠）：第1段階選抜',value:generals[1][12].value.replace('未確定・要確認。','未確定です。確定後に更新します。')}]);
 const generalOwn=deduplicate([generals[0][11],generals[1][9],generals[2][9],generals[1][10],generals[2][10],generals[0][12]].map(remainder)).map(e=>({...e,label:e.origins.includes('general-early/exam/12')?'理科（前期の個別試験）':e.origins.includes('general-late/exam/9')?'小論文の詳細（後期：一般枠・秋田県地域枠）':'面接の詳細（一般選抜：前期・後期）'}));
 const general= `<section class="admission-readable-scheme"><h3 id="admission-general">一般選抜：前期・後期</h3>${heading('出願・試験・手続の日程')}${generalDates}${definitions([{...payment,label:'検定料の金額（一般選抜：前期・後期）',value:paymentAmount}],'data-admission-value-part="1"')}${heading('出願資格')}${generalEligibility}${heading('試験科目・配点')}${commonScores}${individualScores}${stageOne}${definitions(generalOwn,'data-admission-score-remainder')}${heading('試験会場・受験票')}${definitions([combine(venues.map(es=>es[0])),combine(venues.slice(0,3).map(es=>es[1]))])}${heading('併願・共通テストの注意')}${notes([combine(ns.slice(0,3).map(es=>es[1]))])}<p><a href="#admission-common-subjects">共通テストの科目選択・換算と出題範囲はこちら ↓</a></p>${links}</section>`;
 const recDates=dates([0,1,2,3,4].map(i=>combine(schedules.slice(3,6).map(es=>es[i]))).concat([{...schedules[3][5],label:'面接：一般枠'},{...combine([schedules[4][5],schedules[5][5]]),label:'面接：東北・秋田県地域枠'},... [6,7,8].map(i=>combine(schedules.slice(3,6).map(es=>es[i])))]),'学校推薦型選抜Ⅱ：3枠の日程');
 const recCommon=recs[0].slice(4,10).reduce((n,e)=>n+number(e),0);if(recCommon!==500||recs.some(es=>number(es[10])!==500||number(es[11])+number(es[12])!==250))throw new Error('Akita recommendation total differs');
 const recScores=scoreTable('学校推薦型選抜Ⅱ：3枠共通の配点',['共通テスト','大学の試験'],subjects.map((name,i)=>row(name,[combine(recs.map(es=>es[4+i])),undefined])).join('')+row('小論文',[undefined,combine(recs.map(es=>es[11]))])+row('面接',[undefined,combine(recs.map(es=>({...es[12],value:'150点。'})))])+`<tr class="admission-score-total"><th scope="row">合計</th><td>${point(combine(recs.map(es=>es[10])))}</td><td>250点</td></tr><tr class="admission-score-total"><th scope="row">総点</th><td colspan="2">${point(combine(recs.map(es=>({...es[13],value:'750点。'}))))}</td></tr>`);
 const recInterviews=[recs[0][12],combine([recs[1][12],recs[2][12]])].map(e=>({...remainder(e),label:e.origins[0].includes('recommendation-general')?'一般枠の面接':'東北・秋田県地域枠の面接'}));
 const recTotals=recs.map(es=>{const e=es[13];if(!e.value.startsWith('共通テスト500点＋小論文100点＋面接150点＝750点。'))throw new Error('Akita recommendation overall differs');return {...e,value:e.value.replace('共通テスト500点＋小論文100点＋面接150点＝750点。','750点。')};});
 const splitCommon=(es:Entry[])=>{const base=es[0].value;if(es.some(e=>!e.value.startsWith(base)))throw new Error('Akita common condition prefix differs');return [combine(es.map(e=>({...e,value:base}))),combine(es.slice(1).map(e=>({...e,value:e.value.slice(base.length)})))];};
 const [recDocsCommon,recDocsRegion]=splitCommon(recs.map(es=>es[3]));
 const recDocs=definitions([{...recDocsCommon,label:'提出書類（推薦3枠共通）'}],'data-admission-value-part="0"')+definitions([{...recDocsRegion,label:'同意書（東北・秋田県地域枠）'}],'data-admission-value-part="1"');
 const [recJudgmentCommon,recJudgmentRegion]=splitCommon(recTotals.map(remainder));
 const recJudgment=definitions([{...recJudgmentCommon,label:'面接による不合格条件（推薦3枠共通）'}],'data-admission-score-condition-part="0"')+definitions([{...recJudgmentRegion,label:'地域医療への貢献意欲（東北・秋田県地域枠）'}],'data-admission-score-condition-part="1"');
 const recEssay=definitions([{...combine(recs.map(es=>remainder(es[11]))),label:'小論文の評価（推薦3枠共通）'}],'data-admission-score-remainder');
 const recommendation=`<section class="admission-readable-scheme"><h3 id="admission-recommendation">学校推薦型選抜Ⅱ</h3>${heading('出願・試験・手続の日程')}${recDates}${heading('推薦・卒業年度の条件')}<p>志望する枠の卒業年度・地域条件に加え、下記の評定・推薦・併願条件をすべて満たす必要があります。地域枠では、卒後の従事要件等への確約と同意書も必要です。</p>${recs.map((es,i)=>`<div id="admission-scheme-${schemes[i+3].id}" data-admission-scheme="${schemes[i+3].id}">${heading(short[i+3])}${definitions([es[1]])}</div>`).join('')}${definitions([combine(recs.map(es=>es[2]))])}${recDocs}<p><a href="#admission-region-duty">地域枠の修学資金・勤務義務・離脱条件はこちら ↓</a></p>${heading('試験科目・配点')}${recScores}${recEssay}${definitions(recInterviews,'data-admission-score-remainder')}${recJudgment}<p><a href="#admission-common-subjects">共通テストの科目選択・換算はこちら ↓</a></p>${heading('試験会場・受験票')}<p><a href="#admission-general">試験会場は、一般選抜と同じ本道キャンパスです。</a></p>${definitions([combine(venues.slice(3,6).map(es=>es[1]))])}${notes([combine(ns.slice(3,6).map(es=>es[1]))])}${heading('入学手続・入学辞退の注意')}${notes([combine(ns.slice(3,6).map(es=>es.at(-1)!))])}${links}</section>`;
 const eju=`<div ${attributes(foreign[3])} data-admission-eju-thresholds><table class="admission-score-table"><caption>日本留学試験の出願得点基準</caption><thead><tr><th scope="col">科目</th><th scope="col">満点</th><th scope="col">必要得点</th></tr></thead><tbody><tr><th scope="row">日本語（読解・聴解・聴読解）</th><td>400点</td><td>360点以上<br>（90％以上）</td></tr><tr><th scope="row">数学＋理科2科目の合計</th><td>400点</td><td>320点以上<br>（80％以上）</td></tr></tbody></table><p>両方の基準を満たす必要があります。日本語の記述得点は、この400点満点には含みません。</p></div>`;
 const foreignHtml=`<section class="admission-readable-scheme" data-admission-scheme="${schemes[6].id}"><h3 id="admission-scheme-${schemes[6].id}">私費外国人留学生入試</h3>${heading('出願・試験・手続の日程')}${dates(schedules[6],'私費外国人留学生入試の日程')}${heading('出願資格・日本留学試験')}${definitions(foreign.slice(1,3))}${eju}${heading('大学の試験・出題範囲')}${definitions([foreign[6]])}<p><a href="#admission-common-subjects">数学・英語の出題範囲はこちら ↓</a></p>${heading('試験会場・集合')}<p><a href="#admission-general">試験会場は、一般選抜と同じ本道キャンパスです。</a></p>${definitions([venues[6][1]])}${notes(ns[6])}${links}</section>`;
 const sharedMath=remainder(generals[0][9]),sharedEnglish=remainder(generals[0][10]);
 if(sharedMath.value!==foreign[4].value||sharedEnglish.value!==foreign[5].value)throw new Error('Akita common written range differs');
 const written=[{...combine([sharedMath,foreign[4]]),label:'数学（一般前期・私費外国人留学生）'},{...combine([sharedEnglish,foreign[5]]),label:'英語（一般前期・私費外国人留学生）'}];
 const commonOrigins=new Set([...generals.flatMap(es=>es.slice(2,9)),...recs.flatMap(es=>es.slice(4,11))].flatMap(e=>e.origins));
 const conditions=deduplicate(scoreConditions.filter(e=>e.origins.every(id=>commonOrigins.has(id))));
 const math=conditions.filter(e=>e.label==='共通テスト：数学'),science=conditions.filter(e=>e.label==='共通テスト：理科');
 const mathParts=math.map(e=>{const match=e.value.match(/^(.*。)(各(?:50|75)点。)$/u);if(!match)throw new Error('Akita math conversion differs');return {base:{...e,value:match[1]},weight:{...e,value:match[2]}};});
 const scienceParts=science.map(e=>{const match=e.value.match(/^(.*。)(各(?:50|100)点。)(基礎科目・地学は利用しない。)$/u);if(!match)throw new Error('Akita science conversion differs');return {base:{...e,value:match[1]},weight:{...e,value:match[2]},excluded:{...e,value:match[3]}};});
 const mathHtml=heading('共通テスト：数学')+definitions([{...combine(mathParts.map(e=>e.base)),label:'科目選択（全方式共通）'}],'data-admission-score-condition-part="0"')+definitions(mathParts.map(({weight:e})=>({...e,label:e.value==='各75点。'?'後期（一般枠）：数学の換算':'前期・後期（秋田県地域枠）・推薦3枠：数学の換算'})),'data-admission-score-condition-part="1"');
 const scienceHtml=heading('共通テスト：理科')+definitions([{...combine(scienceParts.map(e=>e.base)),label:'科目選択（全方式共通）'}],'data-admission-score-condition-part="0"')+definitions([{...combine(scienceParts.map(e=>e.excluded)),label:'利用しない科目（全方式共通）'}],'data-admission-score-condition-part="2"')+definitions(scienceParts.map(({weight:e})=>({...e,label:e.value==='各100点。'?'前期・後期（一般枠）：理科の換算':'後期（秋田県地域枠）・推薦3枠：理科の換算'})),'data-admission-score-condition-part="1"');
 const otherConditions=conditions.filter(e=>!['共通テスト：数学','共通テスト：理科'].includes(e.label));
 const common=`<h3 id="admission-common-subjects">共通テストの科目選択・換算と出題範囲</h3><p>以下の共通テストの科目選択は、一般選抜（前期・後期の両枠）と学校推薦型選抜Ⅱの3枠に共通です。</p>${definitions(otherConditions,'data-admission-score-remainder')}${mathHtml}${scienceHtml}${notes([combine(ns.slice(0,6).map(es=>es[0]))])}${heading('大学の数学・英語の出題範囲')}${definitions(written,'data-admission-score-remainder')}${links}`;
 const regional=`<h3 id="admission-region-duty">地域枠の修学資金・勤務義務・離脱条件</h3>${heading('学校推薦型Ⅱ：東北地域枠')}${definitions(recs[1].slice(14))}${heading('学校推薦型Ⅱ：秋田県地域枠')}${definitions(recs[2].slice(14))}${notes([combine([ns[2][3],ns[5][2]])])}${links}`;
 const publicationEntry=combine(ns.slice(0,3).map(es=>es[2]));
 const publication=`<h3 id="admission-publication">募集人数の確定・一般選抜要項の公開予定</h3><div ${attributes(publicationEntry)} data-admission-coverage-note="2">${value(publicationEntry)}</div><p data-admission-coverage-note="3">${escape(data.coverageNotes[3])}</p>${hint}`;
 const sourceFooter=`<details class="admission-source-footer"><summary>情報ソースはこちら</summary><div id="admission-sources"><p>公式資料確認日：<time data-university-admissions-verified-at datetime="${escape(data.verifiedAt)}">${dateJp(data.verifiedAt)}</time></p><ul class="admission-source-list" data-admission-source-list>${data.sources.map(s=>`<li data-admission-source-id="${s.id}"><a href="${escape(s.url)}">${escape(s.title)}</a><small>参照：${escape(Array.isArray(s.pages)?s.pages.join('、'):s.pages??'該当選抜の掲載欄')}／確認日：${dateJp(s.retrievedAt)}</small></li>`).join('')}</ul></div></details>`;
 return `<h2 id="最新の入試情報">2027年度の入試情報</h2><section class="admission-readable" data-university-admissions-year="2027" data-admissions-presentation="akita-readable-v4">${overviewHtml}${general}${recommendation}${foreignHtml}${common}${regional}${publication}${sourceFooter}</section>`;
}
export function renderAkitaUniversityOverview():string{
 const {address,mailing,entrants}=overview;
 if(entrants.male+entrants.female!==entrants.total||entrants.current+entrants.previous+entrants.other!==entrants.total)throw new Error('Akita entrant denominator differs');
 const table=(label:string,rows:[string,number][])=>`<table class="admission-score-table"><caption>${entrants.year}年度 医学科入学者（${entrants.total}人）：${label}</caption><thead><tr><th scope="col">区分</th><th scope="col">人数</th><th scope="col">割合</th></tr></thead><tbody>${rows.map(([name,n])=>`<tr><th scope="row">${name}</th><td>${n}人</td><td>${(n/entrants.total*100).toFixed(1)}%</td></tr>`).join('')}</tbody></table>`;
 return `<h2 id="大学基本情報">大学基本情報</h2><section class="admission-readable" data-akita-overview><h3 id="所在地">所在地・入試の問い合わせ</h3><p>${address.campus}<br>〒${address.postalCode} ${escape(address.street)}<br>医学科担当：${address.medicinePhone}<br>入試課：${address.admissionsPhone}</p><p>${escape(mailing.scope)}：<br>〒${mailing.postalCode} ${escape(mailing.street)} ${mailing.office}</p><h3 id="アクセス">アクセス</h3><ul>${overview.access.map(s=>`<li>${escape(s)}</li>`).join('')}</ul><h3 id="男女比">男女比</h3>${table('男女別',[['男性',entrants.male],['女性',entrants.female]])}<h3 id="現浪比">卒業年別の割合</h3>${table('卒業年別',[['2026年卒業',entrants.current],['2025年以前卒業',entrants.previous],['その他',entrants.other]])}<p>${escape(entrants.scope)}統計は2026年5月1日現在です。</p><details class="admission-source-footer"><summary>情報ソースはこちら</summary><ul class="admission-source-list">${overview.sources.map(s=>`<li><a href="${escape(s.url)}">${escape(s.title)}</a><small>参照：${escape(Array.isArray(s.pages)?s.pages.join('、'):s.pages)}／確認日：${dateJp(s.retrievedAt)}</small></li>`).join('')}</ul></details></section>`;
}
