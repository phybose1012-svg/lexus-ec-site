import type {UniversityAdmissions, UniversityAdmissionScheme} from './universityAdmissions';
import canonical from '../data/universityAdmissions/sapporoika.json' with {type:'json'};
import overview from '../data/sapporoikaUniversityOverview.json' with {type:'json'};

type Entry={label:string;value:string;origins:string[];sourceIds:string[];status:string;group:string;kind:string};
const escape=(s:string)=>s.replace(/[&<>"']/gu,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]!);
const attributes=(e:Entry)=>`data-admission-origins="${escape(JSON.stringify(e.origins))}" data-admission-source-ids="${escape(JSON.stringify(e.sourceIds))}" data-admission-status="${escape(e.status)}"`;
const value=(e:Entry)=>`<div data-admission-value>${e.value.split(/(?<=。)/u).filter(Boolean).map((p,i)=>`<p class="${i?'admission-value-detail':'admission-value-main'}">${escape(p)}</p>`).join('')}</div>`;
const entries=(s:UniversityAdmissionScheme):Entry[]=>{
 const raw=canonical.schemes.find(r=>r.id===s.id);
 if(!raw)throw new Error('Unknown Sapporo route');
 return (['exam','schedule','venue','note'] as const).flatMap(kind=>{
  const key=kind==='note'?'notes':`${kind}Rows` as 'examRows'|'scheduleRows'|'venueRows';
  return s[key].map((r,i)=>{
   const row=r as {label?:string;value?:string;text?:string;sourceIds:string[];status?:string};
   const original=raw[key][i] as {label?:string;group?:string};
   if(!original||original.label!==row.label)throw new Error('Sapporo section layout differs');
   return {label:row.label??'',value:row.value??row.text!,sourceIds:row.sourceIds,status:row.status??'confirmed',origins:[`${s.id}/${kind}/${i}`],kind,group:original.group??'出願・受験・手続の注意'};
  });
 });
};
const same=(a:Entry,b:Entry)=>a.label===b.label&&a.value===b.value&&a.status===b.status&&a.kind===b.kind&&a.group===b.group;
const merge=(a:Entry,b:Entry):Entry=>{
 if(!same(a,b))throw new Error('Different Sapporo facts cannot share a display row');
 return {...a,origins:[...a.origins,...b.origins],sourceIds:[...new Set([...a.sourceIds,...b.sourceIds])]};
};
const definitions=(es:Entry[])=>`<dl class="admission-facts">${es.map(e=>`<div class="admission-fact" ${attributes(e)}><dt>${escape(e.label)}</dt><dd>${value(e)}</dd></div>`).join('')}</dl>`;
const table=(es:Entry[],caption:string,score=false)=>`<table class="${score?'admission-score-table':'admission-dates-table'}"><caption${score?'':' class="admission-sr-only"'}>${escape(caption)}</caption><thead><tr><th scope="col">項目</th><th scope="col">${score?'配点・内容':'日程・提出条件'}</th></tr></thead><tbody>${es.map(e=>`<tr ${attributes(e)}><th scope="row">${escape(e.label)}</th><td>${value(e)}</td></tr>`).join('')}</tbody></table>`;
const notes=(es:Entry[])=>`<ul class="admission-conditions">${es.map(e=>`<li ${attributes(e)}>${value(e)}</li>`).join('')}</ul>`;
const groupOrder=['募集人数・出願資格','卒後の条件','卒後の条件・修学資金','出願・試験日程','受験上の配慮','試験科目・判定','個別試験の範囲','配点','合否判定','会場','出願・受験・手続の注意','成績開示・疑義申立','学費・その他の費用'];
const renderGroups=(es:Entry[],name:string)=>[...new Set(es.map(e=>e.group))].sort((a,b)=>groupOrder.indexOf(a)-groupOrder.indexOf(b)).map(group=>{
 const rows=es.filter(e=>e.group===group),kind=rows[0].kind;
 return `<h4 class="admission-group-title">${escape(group)}</h4>${kind==='schedule'?table(rows,`${name}：${group}`):kind==='note'?notes(rows):group==='配点'?table(rows,`${name}：配点`,true):definitions(rows)}`;
}).join('');
const hint='<a class="admission-source-hint" href="#admission-sources">情報ソースはこちら</a>';
const links=`<p class="admission-section-links">${hint}<a href="#admission-overview">方式の一覧へ戻る ↑</a></p>`;
export const sapporoikaMetadata={
 title:'札幌医科大学医学部｜2027年度入試情報',
 displayTitle:'札幌医科大学 医学部2027年度入試情報',displayTitleLines:['札幌医科大学 医学部','2027年度入試情報'],
 lead:'札幌医科大学医学科の2027年度入試について、一般選抜の2枠、総合型選抜の道民枠、学校推薦型選抜の特別枠、私費外国人留学生選抜の出願条件・日程・科目をまとめています。所在地・アクセスと2026年度医学科入学者の統計も掲載しています。',
 description:'札幌医科大学医学科の2027年度一般・総合型・推薦・私費外国人留学生選抜。募集人数、日程、科目・配点、地域医療の条件、未公表の詳細と外国人選抜の日付確認待ちを明記。所在地と2026年度入学者統計も掲載。',
 keyPoints:[
  '一般枠20人、札医大卒後研修枠55人、道民枠20人、特別枠15人。特別枠は認可申請中の臨時増員8人を含みます。',
  '一般選抜の個別試験は2027年2月25日・26日。共通テスト750点と個別800点の総合計1,550点です。',
  '道民枠・特別枠の大学の試験は2026年11月29日。外国人選抜の出願開始・締切・合格発表は、公式資料の日付と曜日が一致しないため確認待ちです。',
 ],
};
export function renderSapporoikaAdmissionsReadable(data:UniversityAdmissions):string{
 const routeIds=['general-standard','general-training','comprehensive-domin','recommendation-special','foreign'];
 if(data.path!=='/information-sapporoika/'||data.schemes.map(s=>s.id).join(',')!==routeIds.join(','))throw new Error('Unexpected Sapporo admissions routes');
 const byRoute=data.schemes.map(entries),commonSubjects:Entry[]=[],generalCommon:Entry[]=[];
 // These eleven rows have the same subject choices and exception wording in all
 // four domestic routes. Preserve every origin and the complete union of sources.
 for(const row of byRoute[0].filter(e=>e.group==='共通テストの指定科目')){
  let merged=row;
  for(let i=1;i<4;i++){
   const matches=byRoute[i].filter(e=>same(row,e));
   if(matches.length!==1)throw new Error(`Common Test condition differs: ${row.label}`);
   merged=merge(merged,matches[0]);
  }
  commonSubjects.push(merged);
 }
 const used=new Set(commonSubjects.flatMap(e=>e.origins));
 for(const row of byRoute[0].filter(e=>!used.has(e.origins[0]))){
  const matching=byRoute[1].filter(e=>same(row,e));
  if(matching.length===1){const shared=merge(row,matching[0]);generalCommon.push(shared);shared.origins.forEach(id=>used.add(id));}
 }
 const coverage=(i:number)=>`<p data-admission-coverage-note="${i}">${escape(data.coverageNotes[i])}</p>`;
 const shortNames=['一般選抜（前期）一般枠','一般選抜（前期）札医大卒後研修枠','総合型選抜 道民枠','学校推薦型選抜 特別枠','私費外国人留学生選抜'];
 const summaryDates=[['2027年1月25日〜2月3日／17:00必着','2027年2月25日・26日'],['2027年1月25日〜2月3日／17:00必着','2027年2月25日・26日'],['2026年10月1日〜8日／17:00必着','2026年11月29日'],['2026年11月2日〜6日／17:00必着','2026年11月29日'],['開始日・締切日は確認待ち／出願最終日17:00必着','2027年2月25日（木）']];
 const mobile=(l:string,v:string)=>`<td><span class="admission-mobile-label" aria-hidden="true">${l}</span>${escape(v)}</td>`;
 const intro=`<h3 id="admission-overview">方式・募集人数・主な日程</h3>${coverage(0)}<table class="admission-overview-table"><caption class="admission-sr-only">2027年度 医学科入試一覧</caption><thead><tr><th scope="col">入試方式</th><th scope="col">公表募集人数</th><th scope="col">書類受付</th><th scope="col">大学の試験日</th></tr></thead><tbody>${data.schemes.map((s,i)=>`<tr><th scope="row"><a href="#admission-scheme-${s.id}">${escape(shortNames[i])}</a></th>${mobile('公表募集人数',['20人','55人','20人','15人（認可申請中8人を含む）','若干名'][i])}${mobile('書類受付',summaryDates[i][0])}${mobile('大学の試験日',summaryDates[i][1])}</tr>`).join('')}</tbody></table><div class="admission-important">${coverage(1)}</div>${coverage(2)}<div class="admission-important">${coverage(3)}</div>${coverage(4)}<p class="admission-overview-sources">${hint}</p>`;
 const sections=data.schemes.map((s,i)=>`<section class="admission-readable-scheme" data-admission-scheme="${s.id}"><h3 id="admission-scheme-${s.id}">${escape(s.name)}</h3>${i<2?'<p><a href="#admission-general-common">2枠共通の出願日程・資格・配点はこちら ↓</a></p>':''}${renderGroups(byRoute[i].filter(e=>!used.has(e.origins[0])),s.name)}${i<4?'<p><a href="#admission-common-subjects">共通テストの指定科目・得点採用はこちら ↓</a></p>':''}${links}</section>`).join('');
 const common=`<h3 id="admission-general-common">一般選抜の2枠に共通する日程・資格・配点</h3>${renderGroups(generalCommon,'一般選抜2枠共通')}${links}<h3 id="admission-common-subjects">国内4方式：共通テストの指定科目・得点採用</h3>${definitions(commonSubjects)}${links}<h3 id="admission-contact">出願前の確認・問い合わせ</h3>${coverage(5)}${links}`;
 return `<h2 id="最新の入試情報">2027年度の入試情報</h2><section class="admission-readable" data-university-admissions-year="2027" data-admissions-presentation="sapporoika-readable-v1">${intro}${sections}${common}</section>`;
}
export function renderSapporoikaUniversityOverview():string{
 const es:Entry[]=overview.facts.map(f=>({...f,origins:[`overview/${f.id}`],group:'大学基本情報',kind:'overview'}));
 const pick=(...ids:string[])=>ids.map(id=>{const e=es.find(e=>e.origins[0]===`overview/${id}`);if(!e)throw new Error('Missing Sapporo overview fact');return e;});
 const allSources=[...canonical.sources,...overview.sources];
 const footer=`<details class="admission-source-footer"><summary>情報ソースはこちら</summary><div id="admission-sources"><p>公式資料確認日：<time data-university-admissions-verified-at datetime="${escape(canonical.verifiedAt)}">${canonical.verifiedAt.slice(0,10)}</time></p><ul class="admission-source-list" data-admission-source-list>${allSources.map(s=>`<li data-admission-source-id="${s.id}"><a href="${escape(s.url)}">${escape(s.title)}</a><small>${'pages' in s&&s.pages?`参照ページ：${s.pages.join('、')}／`:''}確認日：${s.retrievedAt.slice(0,10)}</small></li>`).join('')}</ul></div></details>`;
 const statistics=(rows:Entry[],label:string)=>`<table class="admission-score-table"><caption>2026年度 医学科入学者110人：${label}</caption><thead><tr><th scope="col">区分</th><th scope="col">人数・割合</th></tr></thead><tbody>${rows.map(e=>`<tr ${attributes(e)}><th scope="row">${escape(e.label)}</th><td>${value(e)}</td></tr>`).join('')}</tbody></table>`;
 return `<h2 id="大学基本情報">大学基本情報</h2><section class="admission-readable" data-sapporoika-overview><h3 id="所在地とアクセス">所在地・アクセス</h3>${definitions(pick('address','access-subway','access-streetcar','students'))}<h3 id="入学者統計">2026年度医学科入学者の統計</h3>${definitions(pick('entrant-scope'))}${statistics(pick('entrant-male','entrant-female'),'男女別')}${statistics(pick('entrant-current','entrant-previous'),'新卒・既卒別')}${definitions(pick('statistics-correction'))}${footer}</section>`;
}
