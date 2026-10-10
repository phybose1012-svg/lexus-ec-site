import type { UniversityAdmissions, UniversityAdmissionScheme } from './universityAdmissions';
import overview from '../data/asahikawaikaUniversityOverview.json' with { type: 'json' };

const escape=(s:string)=>s.replace(/[&<>"']/gu,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]!);
type Entry={label:string;value:string;origins:string[];sourceIds:string[];status?:string};
const fact=(e:Entry)=>`data-admission-origins="${escape(JSON.stringify(e.origins))}" data-admission-source-ids="${escape(JSON.stringify(e.sourceIds))}"${e.status?` data-admission-status="${escape(e.status)}"`:''}`;
const value=(e:Entry)=>`<div data-admission-value>${e.value.split(/(?<=。)/u).filter(Boolean).map((s,i)=>`<p class="${i?'admission-value-detail':'admission-value-main'}">${escape(s).replace(/(?=[①②])/gu,'<br>')}</p>`).join('')}</div>`;
const entries=(s:UniversityAdmissionScheme,kind:'schedule'|'exam'|'venue'|'note'):Entry[]=>{
 const rows=kind==='note'?s.notes.map(n=>({label:'',value:n.text,sourceIds:n.sourceIds})):s[`${kind}Rows`];
 return rows.map((e,i)=>({...e,origins:[`${s.id}/${kind}/${i}`]}));
};
const merge=(a:Entry,b:Entry):Entry=>{
 if(a.value!==b.value||a.label!==b.label)throw new Error(`Asahikawa identical fact differs: ${a.origins[0]}`);
 return {...a,origins:[...a.origins,...b.origins],sourceIds:[...new Set([...a.sourceIds,...b.sourceIds])]};
};
const definitions=(es:Entry[])=>`<dl class="admission-facts">${es.map(e=>`<div class="admission-fact" ${fact(e)}><dt>${escape(e.label)}</dt><dd>${value(e)}</dd></div>`).join('')}</dl>`;
const notes=(es:Entry[])=>`<ul class="admission-conditions">${es.map(e=>`<li ${fact(e)}>${value(e)}</li>`).join('')}</ul>`;
const heading=(s:string)=>`<h4 class="admission-group-title">${escape(s)}</h4>`;
const hint='<a class="admission-source-hint" href="#admission-sources">情報ソースはこちら</a>';
const links=`<p class="admission-section-links">${hint}<a href="#admission-overview">入試方式の一覧へ戻る ↑</a></p>`;
const dates=(es:Entry[],name:string)=>`<table class="admission-dates-table"><caption class="admission-sr-only">${escape(name)}の日程</caption><thead><tr><th scope="col">項目</th><th scope="col">日程・提出条件</th></tr></thead><tbody>${es.map(e=>`<tr ${fact(e)}><th scope="row">${escape(e.label)}</th><td>${value(e)}</td></tr>`).join('')}</tbody></table>`;
const scoreNumber=(e:Entry)=>{
 const m=e.value.match(/^(\d+)点。/u);if(!m)throw new Error(`Asahikawa score must start with points: ${e.origins[0]}`);return Number(m[1]);
};
function scores(common:Entry[],individual:Entry[],total:Entry,name:string,individualTotal:number){
 const remainder:Entry[]=[];
 const score=(e:Entry|undefined)=>{
  if(!e)return '課さない';
  const n=scoreNumber(e),rest=e.value.slice(`${n}点。`.length);if(rest)remainder.push({...e,value:rest});
  return `<span ${fact(e)} data-admission-score-prefix data-admission-value>${n}点</span>`;
 };
 const commonTotal=common.find(e=>e.label.startsWith('共通テスト合計'));
 const commonSubjects=common.filter(e=>!e.label.startsWith('共通テスト合計'));
 const actualCommon=commonSubjects.reduce((n,e)=>n+scoreNumber(e),0);
 if(commonTotal&&scoreNumber(commonTotal)!==actualCommon)throw new Error(`Asahikawa common total differs: ${name}`);
 if(individual.reduce((n,e)=>n+scoreNumber(e),0)!==individualTotal)throw new Error(`Asahikawa individual total differs: ${name}`);
 if(scoreNumber(total)!==actualCommon+individualTotal)throw new Error(`Asahikawa overall total differs: ${name}`);
 const labels=['国語','地理歴史・公民','数学','理科','外国語','情報','課題論文','個人面接'];
 const individualLabel=(label:string)=>label==='外国語'?'個別 英語':label==='課題論文'?label:label==='個人面接'?'個人面接':`個別 ${label}`;
 const rows=labels.filter(label=>commonSubjects.some(e=>e.label===`共通テスト ${label}`)||individual.some(e=>e.label===individualLabel(label)||e.label===`個別 ${label}`));
 const body=rows.map(label=>`<tr><th scope="row">${label}</th>${common.length?`<td>${score(commonSubjects.find(e=>e.label===`共通テスト ${label}`))}</td>`:''}<td>${score(individual.find(e=>e.label===individualLabel(label)||e.label===`個別 ${label}`))}</td></tr>`).join('');
 const sum=`<tr class="admission-score-total"><th scope="row">合計</th>${common.length?`<td>${score(commonTotal)}</td>`:''}<td>${individualTotal}点</td></tr>`;
 const overall=`<div class="admission-fact" ${fact(total)}><div>${escape(total.label)}</div>${value(total)}</div>`;
 return `<table class="admission-score-table"><caption>${escape(name)}の配点</caption><thead><tr><th scope="col">教科・検査</th>${common.length?'<th scope="col">共通テスト</th>':''}<th scope="col">大学の試験</th></tr></thead><tbody>${body}${sum}</tbody></table>${overall}${remainder.map(e=>`<div class="admission-fact" ${fact(e)} data-admission-score-remainder><div>${escape(e.label)}</div>${value(e)}</div>`).join('')}`;
}

export const asahikawaikaMetadata={
 title:'旭川医科大学 医学部2027年度入試情報',displayTitle:'旭川医科大学 医学部2027年度入試情報',displayTitleLines:['旭川医科大学 医学部','2027年度入試情報'],
 categories:['大学別入試情報','大学別基本情報','国公立医学部','北海道'],
 lead:'旭川医科大学医学部医学科の2027年度入試情報（日程、科目、配点、出題範囲等）を選抜方式別にまとめています。総合型・学校推薦型の試験時間と会場も掲載しています。出願前には、該当年度の学生募集要項と大学の変更通知をご確認ください。',
 description:'旭川医科大学医学部医学科の2027年度入試情報。前期48人、北海道特別選抜40人、道北・道東特別選抜7人と私費外国人留学生選抜の日程・科目・配点・条件を紹介。所在地・アクセスと2026年度医学科1年次入学者の統計も掲載。',
 keyPoints:[
  '一般選抜は前期日程のみで48人募集（私費外国人留学生選抜を含む）。個別試験は2027年2月25日・26日です。',
  '2027年度から前期の個別試験に理科2科目を導入。配点は共通テスト470点＋個別試験500点＝計970点です。',
  '北海道特別選抜は40人・評定平均4.0以上、道北・道東特別選抜は7人・4.3以上。両方式とも卒後の初期研修2年と、その後7年以上の地域医療への確約が必要です。',
 ],
};

export function renderAsahikawaikaAdmissionsReadable(data:UniversityAdmissions):string{
 const [g,c,r,f]=data.schemes;
 if([g.id,c.id,r.id,f.id].join(',')!=='general-first,comprehensive-hokkaido,recommendation-north-east,international-private')throw new Error('Unexpected Asahikawa routes');
 const [ge,ce,re,fe]=[g,c,r,f].map(s=>entries(s,'exam'));
 const [gn,cn,rn,fn]=[g,c,r,f].map(s=>entries(s,'note'));
 const mobile=(label:string,content:string)=>`<td><span class="admission-mobile-label" aria-hidden="true">${label}</span>${content}</td>`;
 const overviewDates=[['2027年1月25日～2月3日<br>郵送必着','2027年2月25日・26日'],['2026年9月25日～10月1日<br>17:00郵送必着','2026年10月24日'],['2026年11月4日～10日<br>17:00郵送必着','2026年11月28日'],['2027年1月18日～22日<br>郵送必着','2027年2月25日']];
 const quotas=[ge[0],ce[0],re[0],fe[0]],shortNames=['一般選抜（前期）','総合型（北海道特別）','学校推薦型（道北・道東特別）','私費外国人留学生'];
 const quota=(e:Entry,i:number)=>i===0||i===3?`<td ${fact(e)} data-admission-quota-prefix><span class="admission-mobile-label" aria-hidden="true">募集人数</span><span data-admission-value>${escape(e.value.split('。')[0])}</span></td>`:`<td ${fact(e)}><span class="admission-mobile-label" aria-hidden="true">募集人数</span><span data-admission-value>${escape(e.value)}</span></td>`;
 const quotaConditions=quotas.filter((_,i)=>i===0||i===3).map((e,i)=>`<div class="admission-fact" ${fact(e)} data-admission-quota-remainder><div>${i===0?'前期日程の募集人数について':'私費外国人留学生選抜の募集人数について'}</div>${value({...e,value:e.value.slice(e.value.indexOf('。')+1)})}</div>`).join('');
 const overviewHtml=`<h3 id="admission-overview">入試方式・募集人数・主要日程</h3><table class="admission-overview-table" data-admission-coverage-note="0"><caption class="admission-sr-only">医学科2027年度入試一覧</caption><thead><tr><th scope="col">入試方式</th><th scope="col">募集人数</th><th scope="col">書類提出期間</th><th scope="col">大学の試験日</th></tr></thead><tbody>${data.schemes.map((s,i)=>`<tr><th scope="row"><a href="#admission-scheme-${s.id}">${shortNames[i]}</a></th>${quota(quotas[i],i)}${mobile('書類提出期間',overviewDates[i][0])}${mobile('大学の試験日',overviewDates[i][1])}</tr>`).join('')}</tbody></table>${quotaConditions}<p data-admission-coverage-note="1">${escape(data.coverageNotes[1])}</p><p data-admission-coverage-note="3">${escape(data.coverageNotes[3])}</p><p class="admission-overview-sources">${hint}</p>`;
 const section=(s:UniversityAdmissionScheme,inside:string)=>`<section class="admission-readable-scheme" data-admission-scheme="${s.id}"><h3 id="admission-scheme-${s.id}">${escape(s.name)}</h3>${inside}${links}</section>`;
 const general=section(g,`${heading('出願・試験・手続の日程')}${dates(entries(g,'schedule'),'前期日程')}${heading('出願資格')}${definitions([ge[1]])}${heading('試験科目・配点')}${scores(ge.slice(2,9),ge.slice(9,13),ge[13],'前期日程',500)}${definitions([ge[14]])}${heading('試験会場・受験票')}${definitions(entries(g,'venue'))}${heading('出願・受験の注意')}${notes(gn.slice(1,4))}`);
 const special=(s:UniversityAdmissionScheme,e:Entry[],n:Entry[],index:number)=>section(s,`${heading('出願・試験・手続の日程')}${dates(entries(s,'schedule'),s.name)}${heading('出願資格・条件')}${definitions([e[1],...(s.id===r.id?[e[3]]:[])])}${s.id===c.id?notes([n[4]]):''}${heading('試験科目・配点')}${scores(e.slice(index,index+7),e.slice(index+7,index+9),e[index+9],s.id===c.id?'北海道特別選抜':'道北・道東特別選抜',s.id===c.id?400:600)}${heading('集合・受験票')}${definitions([entries(s,'venue')[1]])}${heading('併願・出願書類の注意')}${notes([n[2],n[3]])}<p><a href="#admission-special-common">共通の試験会場・共通テストの注意はこちら ↓</a></p><p><a href="#admission-region-duty">卒後の研修と地域医療への確約はこちら ↓</a></p>`);
 const international=section(f,`${heading('出願・試験・手続の日程')}${dates(entries(f,'schedule'),'私費外国人留学生選抜')}${heading('出願資格・日本留学試験')}${definitions(fe.slice(1,4))}${heading('大学の試験科目・配点')}<table class="admission-score-table"><caption>私費外国人留学生選抜の配点</caption><thead><tr><th scope="col">教科・検査</th><th scope="col">配点</th></tr></thead><tbody>${fe.slice(4,7).map(e=>`<tr><th scope="row">${escape(e.label.replace('個別 ',''))}</th><td><span ${fact(e)} data-admission-score-prefix data-admission-value>${scoreNumber(e)}点</span></td></tr>`).join('')}<tr class="admission-score-total"><th scope="row">合計</th><td>350点</td></tr></tbody></table>${fe.slice(4,7).map(e=>`<div class="admission-fact" ${fact(e)} data-admission-score-remainder><div>${escape(e.label)}</div>${value({...e,value:e.value.slice(`${scoreNumber(e)}点。`.length)})}</div>`).join('')}${heading('試験会場・集合')}${definitions(entries(f,'venue'))}`);
 const common=`<h3 id="admission-special-common">総合型・学校推薦型に共通する試験会場・注意</h3>${definitions([merge(entries(c,'venue')[0],entries(r,'venue')[0])])}${notes([merge(cn[0],rn[0]),merge(cn[1],rn[1]),merge(cn[5],rn[4])])}<p class="admission-section-links">${hint}</p>`;
 const regional=`<h3 id="admission-region-duty">卒後の研修と地域医療への確約</h3>${heading('北海道特別選抜')}${definitions([ce[2]])}${heading('道北・道東特別選抜')}${definitions([re[2]])}<p class="admission-section-links">${hint}</p>`;
 const publication=`<h3 id="admission-publication">一般選抜・留学生選抜の募集要項公開予定</h3><p data-admission-coverage-note="2">${escape(data.coverageNotes[2])}</p>`;
 const sourceFooter=`<details class="admission-source-footer"><summary>情報ソースはこちら</summary><div id="admission-sources"><p>公式資料確認日：<time data-university-admissions-verified-at datetime="${escape(data.verifiedAt)}">${data.verifiedAt.slice(0,10)}</time></p><ul class="admission-source-list" data-admission-source-list>${data.sources.map(s=>`<li data-admission-source-id="${s.id}"><a href="${escape(s.url)}">${escape(s.title)}</a><small>参照：${escape(Array.isArray(s.pages)?s.pages.join('、'):s.pages??'該当選抜の掲載欄')}／確認日：${s.retrievedAt.slice(0,10)}</small></li>`).join('')}</ul></div></details>`;
 return `<h2 id="最新の入試情報">2027年度の入試情報</h2><section class="admission-readable" data-university-admissions-year="2027" data-admissions-presentation="asahikawaika-readable-v1">${overviewHtml}${general}${special(c,ce,cn,3)}${special(r,re,rn,4)}${international}${common}${regional}${publication}${sourceFooter}</section>`;
}

export function renderAsahikawaikaUniversityOverview():string{
 const {address,entrants}=overview;
 if(entrants.male+entrants.female!==entrants.total||entrants.current+entrants.previous!==entrants.total)throw new Error('Asahikawa medical entrant denominator differs');
 const table=(label:string,rows:[string,number][])=>`<table class="admission-score-table"><caption>${entrants.year}年度 医学科1年次入学者（${entrants.total}人）：${label}</caption><thead><tr><th scope="col">区分</th><th scope="col">人数</th><th scope="col">割合</th></tr></thead><tbody>${rows.map(([label,count])=>`<tr><th scope="row">${label}</th><td>${count}人</td><td>${(count/entrants.total*100).toFixed(1)}%</td></tr>`).join('')}</tbody></table>`;
 return `<h2 id="大学基本情報">大学基本情報</h2><section class="admission-readable" data-asahikawaika-overview><h3 id="所在地">所在地・入試の問い合わせ</h3><p>〒${address.postalCode} ${escape(address.street)}<br>電話：${escape(address.phone)}<br>受付：土日祝日を除く9:00～17:00</p><h3 id="アクセス">アクセス</h3><ul>${overview.access.map(s=>`<li>${escape(s)}</li>`).join('')}</ul><h3 id="男女比">男女比</h3>${table('男女別',[['男性',entrants.male],['女性',entrants.female]])}<h3 id="現浪比">現役・既卒の割合</h3>${table('現役・既卒別',[['現役',entrants.current],['既卒',entrants.previous]])}<p>${escape(entrants.scope)}</p><details class="admission-source-footer"><summary>情報ソースはこちら</summary><ul class="admission-source-list">${overview.sources.map(s=>`<li><a href="${escape(s.url)}">${escape(s.title)}</a><small>参照：${escape(Array.isArray(s.pages)?s.pages.join('、'):s.pages)}／確認日：${s.retrievedAt.slice(0,10)}</small></li>`).join('')}</ul></details></section>`;
}
