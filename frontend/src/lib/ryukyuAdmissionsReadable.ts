import type { UniversityAdmissions, UniversityAdmissionScheme } from './universityAdmissions';
import overview from '../data/ryukyuUniversityOverview.json' with { type: 'json' };

const escape=(s:string)=>s.replace(/[&<>"']/gu,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]!);
type Entry={label:string;value:string;origins:string[];sourceIds:string[];status?:string};
export const ryukyuReaderText=(text:string)=>text
 .replaceAll('12月公表予定の募集要項で要確認。','2026年12月公表予定の募集要項で確認してください。')
 .replaceAll('確定時の公式発表を要確認。','確定後の大学の発表を確認してください。')
 .replaceAll('個別の詳細は合格者に送る入学手続案内で要確認。','詳しい手続は合格者に送る入学手続案内で確認してください。')
 .replaceAll('最新の運行は各バス会社で要確認。','最新の運行は各バス会社で確認してください。')
 .replaceAll('はこの表の対象外。','は別の募集要項を確認してください。')
 .replaceAll('原典で確認する。','公式資料で確認してください。');
const fact=(e:Entry)=>`data-admission-origins="${escape(JSON.stringify(e.origins))}" data-admission-source-ids="${escape(JSON.stringify(e.sourceIds))}"${e.status?` data-admission-status="${escape(e.status)}"`:''}`;
const value=(e:Entry)=>`<div data-admission-value>${ryukyuReaderText(e.value).split(/(?<=。)/u).filter(Boolean).map((s,i)=>`<p class="${i?'admission-value-detail':'admission-value-main'}">${escape(s)}</p>`).join('')}</div>`;
const entries=(s:UniversityAdmissionScheme,kind:'schedule'|'exam'|'venue'|'note'):Entry[]=>{
 const rows=kind==='note'?s.notes.map(n=>({label:'',value:n.text,sourceIds:n.sourceIds})):s[`${kind}Rows`];
 return rows.map((e,i)=>({...e,origins:[`${s.id}/${kind}/${i}`]}));
};
const merge=(a:Entry,b:Entry):Entry=>{
 if(a.value!==b.value||a.label!==b.label||a.status!==b.status)throw new Error(`Ryukyu shared condition differs: ${a.origins[0]}`);
 return {...a,origins:[...a.origins,...b.origins],sourceIds:[...new Set([...a.sourceIds,...b.sourceIds])]};
};
const definitions=(es:Entry[])=>`<dl class="admission-facts">${es.map(e=>`<div class="admission-fact" ${fact(e)}><dt>${escape(e.label)}</dt><dd>${value(e)}</dd></div>`).join('')}</dl>`;
const notes=(es:Entry[])=>`<ul class="admission-conditions">${es.map(e=>`<li ${fact(e)}>${value(e)}</li>`).join('')}</ul>`;
const heading=(s:string)=>`<h4 class="admission-group-title">${escape(s)}</h4>`;
const hint='<a class="admission-source-hint" href="#admission-sources">情報ソースはこちら</a>';
const links=`<p class="admission-section-links">${hint}<a href="#admission-overview">入試方式の一覧へ戻る ↑</a></p>`;
const dates=(es:Entry[],name:string)=>`<table class="admission-dates-table"><caption class="admission-sr-only">${escape(name)}の日程</caption><thead><tr><th scope="col">項目</th><th scope="col">日程・提出条件</th></tr></thead><tbody>${es.map(e=>`<tr ${fact(e)}><th scope="row">${escape(e.label)}</th><td>${value(e)}</td></tr>`).join('')}</tbody></table>`;

// Parse the preserved canonical sentences. A changed subject, choice or total must
// fail instead of silently reusing this university's current display model.
export function ryukyuCommonScoreModel(text:string){
 const m=text.match(/^6教科8科目。国語(\d+)点。地理歴史・公民は(.+)から1科目(\d+)点。数学は(.+)の2科目で(\d+)点。理科は(.+)から2科目で(\d+)点。英語(\d+)点。情報Ⅰ(\d+)点。共通テスト合計([\d,]+)点。$/u);
 if(!m)throw new Error('Ryukyu common test subjects differ');
 const rows:[string,number][]=[['国語',+m[1]],['地理歴史・公民',+m[3]],['数学（2科目）',+m[5]],['理科（2科目）',+m[7]],['英語',+m[8]],['情報Ⅰ',+m[9]]];
 const total=Number(m[10].replaceAll(',',''));
 if(rows.reduce((sum,r)=>sum+r[1],0)!==total)throw new Error('Ryukyu common test total differs');
 return {rows,total,choices:[['地理歴史・公民',`${m[2]}から1科目。`],['数学',`${m[4]}の2科目。`],['理科',`${m[6]}から2科目。`]]};
}
export function ryukyuIndividualScoreModel(text:string){
 const early=text.match(/^英語(\d+)点、数学（甲）(\d+)点、理科は(.+)から2科目で(\d+)点、面接(\d+)点。個別合計(\d+)点、総合計([\d,]+)点。(.+)$/u);
 const other=text.match(/^小論文(\d+)点、面接(\d+)点。個別合計(\d+)点、総合計([\d,]+)点。(.+)$/u);
 if(!early&&!other)throw new Error('Ryukyu individual subjects differ');
 const rows:[string,number][]=early?[['英語',+early[1]],['数学（甲）',+early[2]],['理科（2科目）',+early[4]],['面接',+early[5]]]:[['小論文',+other![1]],['面接',+other![2]]];
 const total=early?+early[6]:+other![3],overall=Number((early?early[7]:other![4]).replaceAll(',',''));
 if(rows.reduce((sum,r)=>sum+r[1],0)!==total)throw new Error('Ryukyu individual total differs');
 return {rows,total,overall,detail:early?`理科は${early[3]}から2科目。${early[8]}`:other![5]};
}
const scoreTable=(rows:[string,number][],total:number,caption:string)=>`<table class="admission-score-table"><caption>${escape(caption)}</caption><thead><tr><th scope="col">教科・検査</th><th scope="col">配点</th></tr></thead><tbody>${rows.map(([label,points])=>`<tr><th scope="row">${escape(label)}</th><td>${points.toLocaleString('en-US')}点</td></tr>`).join('')}<tr class="admission-score-total"><th scope="row">合計</th><td>${total.toLocaleString('en-US')}点</td></tr></tbody></table>`;
const scores=(common:Entry,individual:Entry,name:string)=>{
 const c=ryukyuCommonScoreModel(common.value),i=ryukyuIndividualScoreModel(individual.value);
 if(c.total+i.total!==i.overall)throw new Error('Ryukyu overall score differs');
 return `<div ${fact(common)} data-admission-score-block="common"><div data-admission-value><p>6教科8科目</p>${scoreTable(c.rows,c.total,`${name}：共通テスト`)}<dl class="admission-facts">${c.choices.map(([label,text])=>`<div class="admission-fact"><dt>${label}の指定科目</dt><dd>${escape(text).replaceAll('」「','」<br>「')}</dd></div>`).join('')}</dl></div></div><div ${fact(individual)} data-admission-score-block="individual"><div data-admission-value>${scoreTable(i.rows,i.total,`${name}：個別学力検査等`)}<p><strong>共通テストと個別の総合計：${i.overall.toLocaleString('en-US')}点</strong></p><p>${escape(i.detail)}</p></div></div>`;
};
export const ryukyuMetadata={
 title:'琉球大学医学部｜2027年度入試情報',displayTitle:'琉球大学 医学部2027年度入試情報',displayTitleLines:['琉球大学 医学部','2027年度入試情報'],
 lead:'琉球大学医学科の2027年度入試について、一般選抜の前期・後期、学校推薦型選抜Ⅱ（離島・北部枠）の日程、科目・配点、出願資格、試験会場をまとめています。西普天間キャンパスへのアクセスと2026年度医学科入学者の統計も掲載しています。',
 description:'琉球大学医学科の2027年度一般選抜・学校推薦型選抜Ⅱの出願日程、試験科目・配点、地域枠条件と会場。未公表の一般選抜の詳細、臨時増員、現在の所在地・アクセス、2026年度医学科入学者の統計も掲載。',
 keyPoints:[
 '公表されている募集人数は前期70人・後期23人・推薦Ⅱ7人。臨時増員を申請予定で、増員後の人数・枠は未公表です。',
 '前期の個別試験は2027年2月25日・26日で、英語・数学・理科2科目・面接。後期は3月12日で、小論文と面接です。',
 '推薦Ⅱ（離島・北部枠）の試験日は2026年12月2日。評定4.3以上、指定地域の高校等の卒業・卒業見込みと、地域医療・修学資金の確約が必要です。',
 ],
};
export function renderRyukyuAdmissionsReadable(data:UniversityAdmissions):string{
 const [g,l,r]=data.schemes;
 if(data.path!=='/information-ryukyu/'||[g.id,l.id,r.id].join(',')!=='general-early,general-late,recommendation-island-north')throw new Error('Unexpected Ryukyu routes');
 const [ge,le,re]=[g,l,r].map(s=>entries(s,'exam'));
 const [gs,ls,rs]=[g,l,r].map(s=>entries(s,'schedule'));
 const [gn,ln,rn]=[g,l,r].map(s=>entries(s,'note'));
 const coverage=(i:number)=>`<p data-admission-coverage-note="${i}">${escape(ryukyuReaderText(data.coverageNotes[i]))}</p>`;
 const overviewDates=[['2027年1月25日～2月3日','2027年2月25日・26日'],['2027年1月25日～2月3日','2027年3月12日'],['2026年11月1日～6日<br>17:00必着','2026年12月2日']];
 const shortNames=['一般選抜（前期）','一般選抜（後期）','学校推薦型選抜Ⅱ<br>離島・北部枠'];
 const mobile=(label:string,content:string)=>`<td><span class="admission-mobile-label" aria-hidden="true">${label}</span>${content}</td>`;
 const overviewHtml=`<h3 id="admission-overview">入試方式・募集人数・主要日程</h3>${coverage(0)}<table class="admission-overview-table"><caption class="admission-sr-only">医学科2027年度入試一覧</caption><thead><tr><th scope="col">入試方式</th><th scope="col">公表募集人数</th><th scope="col">書類提出期間</th><th scope="col">大学の試験日</th></tr></thead><tbody>${data.schemes.map((s,i)=>`<tr><th scope="row"><a href="#admission-scheme-${s.id}">${shortNames[i]}</a></th>${mobile('公表募集人数',[70,23,7][i]+'人')}${mobile('書類提出期間',overviewDates[i][0])}${mobile('大学の試験日',overviewDates[i][1])}</tr>`).join('')}</tbody></table><div class="admission-important">${coverage(1)}</div><p class="admission-overview-sources">${hint}</p>`;
 const section=(s:UniversityAdmissionScheme,inside:string)=>`<section class="admission-readable-scheme" data-admission-scheme="${s.id}"><h3 id="admission-scheme-${s.id}">${escape(s.name)}</h3>${inside}${links}</section>`;
 const general=(s:UniversityAdmissionScheme,e:Entry[],schedule:Entry[],note:Entry[],early:boolean)=>section(s,`${heading('募集人数')}${definitions([e[0]])}${heading('試験・合格発表・入学手続の日程')}${dates(schedule.slice(4),s.name)}<p><a href="#admission-general-common">前期・後期に共通する出願日程・資格・会場はこちら ↓</a></p>${heading('試験科目・配点')}${scores(e[1],e[3],early?'前期日程':'後期日程')}${heading('2段階選抜')}${definitions([e[4]])}${early?heading('推薦Ⅱの欠員補充')+notes([note[1]]):''}`);
 const recommendation=section(r,`${heading('募集人数・出願資格')}${definitions(re.slice(0,3))}${heading('出願・試験・手続の日程')}${dates(rs,r.name)}<p data-ryukyu-extra-fact="recommendation-late-arrival">試験開始時刻（面接は集合時刻）から30分を超えて遅刻した場合は受験できません。面接は受験者全員が集合次第、開始する場合があります。</p>${heading('試験科目・配点')}${scores(re[3],re[5],'推薦Ⅱ（離島・北部枠）')}${heading('合否判定')}${definitions([re[6]])}${heading('試験場・交通・下見')}${definitions(entries(r,'venue'))}${heading('出願書類・郵送先・併願')}${notes(rn.slice(0,3))}<p><a href="#admission-region-duty">地域医療への確約・卒後の従事要件はこちら ↓</a></p>`);
 const common=`<h3 id="admission-general-common">前期・後期に共通する出願日程・資格・会場</h3>${dates(gs.slice(0,4).map((e,i)=>merge(e,ls[i])),'前期・後期共通')}${heading('出願資格・合否判定')}${definitions([merge(ge[6],le[6]),merge(ge[5],le[5])])}${heading('試験会場')}${definitions([merge(entries(g,'venue')[0],entries(l,'venue')[0])])}${notes([merge(gn[0],ln[0]),merge(gn[2],ln[1])])}${coverage(4)}${links}`;
 const scoring=`<h3 id="admission-score-common">全方式に共通する共通テストの得点採用</h3>${definitions([merge(merge(ge[2],le[2]),re[4])])}<p data-ryukyu-extra-fact="geography-combined-subject">「地理総合／歴史総合／公共」を選択する場合は、出題範囲の「地理総合」「歴史総合」「公共」から2つを選択解答して1科目とします。</p>${links}`;
 const regional=`<h3 id="admission-region-duty">推薦Ⅱ：地域医療への確約・卒後の従事要件</h3>${definitions(re.slice(7))}${notes(rn.slice(3))}${coverage(5)}${links}`;
 const publication=`<h3 id="admission-publication">募集要項の公表予定・訂正</h3>${coverage(2)}${coverage(3)}${links}`;
 const sourceFooter=`<details class="admission-source-footer"><summary>情報ソースはこちら</summary><div id="admission-sources"><p>公式資料確認日：<time data-university-admissions-verified-at datetime="${escape(data.verifiedAt)}">${data.verifiedAt.slice(0,10)}</time></p><ul class="admission-source-list" data-admission-source-list>${data.sources.map(s=>`<li data-admission-source-id="${s.id}"><a href="${escape(s.url)}">${escape(s.title)}</a><small>参照ページ：${escape(Array.isArray(s.pages)?s.pages.join('、'):s.pages??'該当選抜の掲載欄')}／確認日：${s.retrievedAt.slice(0,10)}</small></li>`).join('')}</ul></div></details>`;
 return `<h2 id="最新の入試情報">2027年度の入試情報</h2><section class="admission-readable" data-university-admissions-year="2027" data-admissions-presentation="ryukyu-readable-v1">${overviewHtml}${general(g,ge,gs,gn,true)}${general(l,le,ls,ln,false)}${recommendation}${common}${scoring}${regional}${publication}${sourceFooter}</section>`;
}
export function renderRyukyuUniversityOverview():string{
 const {address,entrants:e}=overview;
 if(e.male+e.female!==e.total||e.current+e.previous+e.other!==e.total)throw new Error('Ryukyu entrant population differs');
 const table=(label:string,rows:[string,number][])=>`<table class="admission-score-table"><caption>${e.year}年度 医学科入学者（全選抜・${e.total}人）：${label}</caption><thead><tr><th scope="col">区分</th><th scope="col">人数</th><th scope="col">割合</th></tr></thead><tbody>${rows.map(([label,n])=>`<tr><th scope="row">${label}</th><td>${n}人</td><td>${(n/e.total*100).toFixed(1)}%</td></tr>`).join('')}</tbody></table>`;
 return `<h2 id="大学基本情報">大学基本情報</h2><section class="admission-readable" data-ryukyu-overview><h3 id="所在地">所在地</h3><p>〒${address.postalCode} ${escape(address.street)}<br>${escape(address.campus)}</p><p>医学部は${address.moveCompletedAt}に西普天間への移転を完了しました。</p><h3 id="アクセス">アクセス</h3><ul>${overview.access.map(text=>`<li>${escape(text)}</li>`).join('')}</ul><h3 id="男女比">男女比</h3>${table('男女別',[['男性',e.male],['女性',e.female]])}<h3 id="現浪比">現役・既卒の割合</h3>${table('現役・既卒別',[['現役',e.current],['既卒',e.previous],['その他',e.other]])}<p>${escape(e.scope)}</p><details class="admission-source-footer"><summary>情報ソースはこちら</summary><ul class="admission-source-list">${overview.sources.map(s=>`<li><a href="${escape(s.url)}">${escape(s.title)}</a><small>${s.pages?'参照ページ：'+s.pages.join('、')+'／':''}確認日：${s.retrievedAt.slice(0,10)}</small></li>`).join('')}</ul></details></section>`;
}
