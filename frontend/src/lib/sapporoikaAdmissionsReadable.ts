import type {UniversityAdmissions,UniversityAdmissionScheme} from './universityAdmissions';
import canonical from '../data/universityAdmissions/sapporoika.json' with {type:'json'};
import {admissionFactAttributes as attrs,escapeAdmissionText as esc,renderAdmissionReaderTable as table,renderAdmissionReaderConditions as conditions,renderAdmissionReaderSources as sourceList} from './admissionsReaderPrimitives.ts';
import type {AdmissionReaderRow} from './admissionsReaderPrimitives.ts';

type Entry=AdmissionReaderRow&{kind:string;group:string};
const noteLabels=['出願の完了条件','検定料・返還条件','願書・写真・記入方法','方式別の提出書類','居住歴・氏名の証明','調査書を発行できない場合','併願と入学確約','入学辞退','受験票・入学手続書類','追試験・受験上の注意','個人情報'];
const heading=(id:string,text:string)=>`<h3 id="sapporoika-${id}">${esc(text)}</h3>`;
const section=(id:string,text:string,body:string,scheme?:string)=>`<section class="admission-readable-scheme"${scheme?` data-admission-scheme="${scheme}"`:''}><h2 id="sapporoika-${id}">${esc(text)}</h2>${body}</section>`;
const paragraph=(r:AdmissionReaderRow)=>`<p ${attrs(r)}>${esc(r.value)}</p>`;
const scopedStyles='<style>.article-content .sapporoika-editorial table:not(.admission-overview-table) tr > :first-child{width:30%}.article-content .sapporoika-editorial table:not(.admission-overview-table) tr > :last-child{width:70%}.article-content .sapporoika-editorial table.admission-scores-table tr > :first-child{width:32%}.article-content .sapporoika-editorial table.admission-scores-table tr > :nth-child(2),.article-content .sapporoika-editorial table.admission-scores-table tr > :nth-child(3){width:34%}</style>';
function sources(ids:string[]){return sourceList(canonical.sources.filter(s=>ids.includes(s.id)).map(s=>({id:s.id,url:s.url,title:`${s.title}${'pages' in s&&s.pages?`（PDF内p.${s.pages.join('・')}）`:''}／確認日 ${s.retrievedAt.slice(0,10)}`})));}
function entries(s:UniversityAdmissionScheme):Entry[]{
 const raw=canonical.schemes.find(r=>r.id===s.id)!;
 return (['schedule','exam','venue','note'] as const).flatMap(kind=>{
  const key=kind==='note'?'notes':`${kind}Rows` as 'examRows'|'scheduleRows'|'venueRows';
  return s[key].map((r,i)=>{
   const row=r as {label?:string;value?:string;text?:string;sourceIds:string[];status?:string},original=raw[key][i] as {group?:string};
   let label=row.label??noteLabels[i]??'出願・受験上の注意';
   if(s.id==='general-standard')label=row.label??'出願枠の選択';
   if(s.id==='general-training')label=row.label??(i===0?'卒後の確約書・離脱時の扱い':'出願枠の選択');
   if(s.id==='recommendation-special'&&kind==='note')label=['出願の完了条件','検定料・返還条件','願書・写真・記入方法','方式別の提出書類','居住歴・氏名の証明','併願と入学確約','入学辞退','推薦の取扱い','受験票・入学手続書類','追試験・受験上の注意','個人情報'][i];
   if(s.id==='foreign'&&kind==='note')label=i===0?'出願方法':'募集要項・書類の入手';
   return {label,value:row.value??row.text!,sourceIds:row.sourceIds,status:row.status,origins:[`${s.id}/${kind}/${i}`],kind,group:original.group??'出願・受験・手続の注意'};
  });
 });
}
const same=(a:Entry,b:Entry)=>a.label===b.label&&a.value===b.value&&a.status===b.status&&a.kind===b.kind&&a.group===b.group;
const merged=(rows:Entry[],label?:string,value?:string):Entry=>({...rows[0],label:label??rows[0].label,value:value??rows[0].value,origins:rows.flatMap(r=>r.origins),sourceIds:[...new Set(rows.flatMap(r=>r.sourceIds))]});
const numericTable=(caption:string,headers:string[],rows:{fact:Entry;values:string[]}[])=>`<table data-admission-table="scores" class="admission-scores-table"><caption>${esc(caption)}（単位：点）</caption><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr ${attrs(r.fact)}>${r.values.map((v,i)=>`<${i?'td':'th scope="row"'}>${esc(v)}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table>`;
const order=['出願・試験日程','受験上の配慮','募集人数・出願資格','卒後の条件','卒後の条件・修学資金','試験科目・判定','個別試験の範囲','合否判定','会場','出願・受験・手続の注意','成績開示・疑義申立','学費・その他の費用'];
function groups(rows:Entry[],prefix:string,label:string){
 return [...new Set(rows.map(r=>r.group))].sort((a,b)=>order.indexOf(a)-order.indexOf(b)).map((group,i)=>{
  const items=rows.filter(r=>r.group===group),title=group==='出願・受験・手続の注意'?'出願・受験・入学手続の注意':group;
  return heading(`${prefix}-group-${i}`,`${label}の${title}`)+(items[0].kind==='schedule'||group==='学費・その他の費用'?table(`${label}：${title}`,items):conditions(items));
 }).join('');
}
export const sapporoikaMetadata={
 title:'札幌医科大学医学部｜2027年度入試情報',displayTitle:'札幌医科大学 医学部2027年度入試情報',displayTitleLines:['札幌医科大学 医学部','2027年度入試情報'],
 lead:'札幌医科大学医学部医学科の2027年度入試を、募集枠ごとにまとめています。出願・試験日程、会場、科目・配点・出題範囲、卒後の研修・勤務条件、所在地・アクセスと2026年度入学者統計を掲載します。一般選抜と私費外国人留学生選抜には未公表の詳細があります。出願前に大学公式の募集要項と変更通知をご確認ください。',
 description:'札幌医科大学医学部医学科の2027年度入試情報。一般・総合型・学校推薦型・私費外国人留学生選抜の募集人数、日程、科目・配点、出願資格、卒後の条件、所在地・アクセス、2026年度入学者統計。',
 keyPoints:[
  '募集人数は一般枠20人・卒後研修枠55人・道民枠20人・特別枠15人。特別枠には認可申請中の臨時増員8人を含みます。',
  '一般選抜の個別試験は2027年2月25日・26日。最終判定は共通テスト750点＋個別試験800点の計1,550点です。',
  '道民枠・特別枠の大学での試験は2026年11月29日。特別枠は原則共通テスト775点以上で、卒後は道内9年以上・うち指定機関5年以上の勤務条件があります。',
 ]
};
export function renderSapporoikaAdmissionsReadable(data:UniversityAdmissions):string{
 const ids=['general-standard','general-training','comprehensive-domin','recommendation-special','foreign'];
 if(data.path!=='/information-sapporoika/'||data.schemes.map(s=>s.id).join(',')!==ids.join(','))throw new Error('Unexpected Sapporo admissions routes');
 const routes=data.schemes.map(entries),used=new Set<string>();
 const take=(rows:Entry[])=>{rows.flatMap(r=>r.origins).forEach(o=>used.add(o));return rows;};
 const row=(id:string,kind:string,i:number)=>routes[ids.indexOf(id)].find(r=>r.origins.includes(`${id}/${kind}/${i}`))!;
 const common=(a:Entry[],b:Entry[])=>take(a.flatMap(r=>{const found=b.find(x=>same(r,x));return found?[merged([r,found])]:[];}));
 const general=common(routes[0].filter(r=>r.group!=='共通テストの指定科目'),routes[1]);
 const regional=common(routes[2].filter(r=>r.group!=='共通テストの指定科目'),routes[3]);
 const subjectRows=take(routes[0].filter(r=>r.group==='共通テストの指定科目').map(r=>merged([r,...routes.slice(1,4).map(rs=>{const found=rs.find(x=>same(r,x));if(!found)throw new Error('Common Test subjects differ');return found;})])));
 const coverage=(i:number,value?:string):Entry=>({label:'',value:value??data.coverageNotes[i],origins:[`coverage/${i}`],sourceIds:i===4?['change-2028']:i===5?['selection-2027']:['selection-2027','general-index','foreign-index'],kind:'coverage',group:''});
 const overviewRows=ids.map((id,i)=>{
  const quota=row(id,'exam',0);take([quota]);
  const dates=[['2027年1月25日～2月3日17:00必着','2027年2月25日・26日'],['2027年1月25日～2月3日17:00必着','2027年2月25日・26日'],['2026年10月1日～8日17:00必着','2026年11月29日'],['2026年11月2日～6日17:00必着','2026年11月29日'],['開始日・締切日は確認待ち','2027年2月25日']][i];
  const target=i===0?'general':i===1?'training':i===2?'domin':i===3?'special':'foreign';
  const cell=(label:string,value:string)=>`<td><span class="admission-mobile-label" aria-hidden="true">${esc(label)}</span>${esc(value)}</td>`;
  return `<tr ${attrs(quota)}><th scope="row"><a href="#sapporoika-${target}">${esc(['一般前期・一般枠','一般前期・卒後研修枠','総合型・道民枠','学校推薦型・特別枠','私費外国人留学生'][i])}</a></th>${cell('募集人数',['20人','55人','20人','15人（臨時増員8人を含む・認可申請中）','若干名'][i])}${cell('書類受付',dates[0])}${cell('大学での試験日',dates[1])}</tr>`;
 });
 const overview=section('overview','入試方式・募集人数・主要日程',paragraph(coverage(0,'掲載対象は医学部医学科です。保健医療学部・大学院の選抜は含みません。'))+`<table class="admission-overview-table" data-admission-table="overview"><caption>2027年度医学科の募集枠と主要日程</caption><thead><tr><th scope="col">入試方式</th><th scope="col">募集人数</th><th scope="col">出願書類の受付</th><th scope="col">大学での試験日</th></tr></thead><tbody>${overviewRows.join('')}</tbody></table>`+paragraph(coverage(1,'募集計110人は、特別枠の臨時増員が認可された場合の人数です。'))+sources(['selection-2027','comprehensive-2027','recommendation-2027']));
 const selected=(rows:Entry[],test:(r:Entry)=>boolean)=>{const result=rows.filter(test);take(result);return result;};
 const first=merged([row(ids[0],'exam',18),row(ids[1],'exam',19),row(ids[2],'exam',23),row(ids[3],'exam',23)]);take([first]);
 const firstScores=numericTable('共通テストの配点（一般選抜の第1段階・道民枠・特別枠）',['教科','配点'],[['国語','200'],['地歴公民','100'],['数学','200'],['理科','200'],['外国語','200'],['情報','100'],['合計','1,000']].map(values=>({fact:first,values})));
 const finalIndices=[[19],[20],[21,26],[22,27],[23,28],[24],[29],[25,30],[31]];
 const generalScores=numericTable('一般選抜2枠の最終判定配点',['教科・試験','共通テスト','個別試験'],[['国語','150','課さない'],['地歴公民','50','課さない'],['数学','150','200'],['理科2科目','200','200'],['外国語','150','200（英語）'],['情報Ⅰ','50','課さない'],['個人面接','課さない','200'],['各試験合計','750','800'],['総合計','1,550','共通＋個別']].map((values,i)=>{const rs=finalIndices[i].flatMap(n=>[row(ids[0],'exam',n),row(ids[1],'exam',n+1)]);take(rs);return {fact:merged(rs),values};}));
 const regionalScores=numericTable('道民枠・特別枠の第2段階選抜配点',['評価項目','道民枠','特別枠'],[['小作文','200（ミニ講義）','200（ミニ講義）'],['面接','250（個人・集団）','200（個人）'],['自己推薦書','50','100'],['共通テスト','1,000','1,000'],['総合計','1,500','1,500']].map((values,i)=>{const n=i===3?23:i===4?24:20+i;const rs=[row(ids[2],'exam',n),row(ids[3],'exam',n)];take(rs);return {fact:merged(rs),values};}));
 const generalDates=selected(general,r=>r.kind==='schedule'&&r.status!=='unpublished');
 const generalUnpublished=selected(general,r=>r.status==='unpublished');
 const generalOther=general.filter(r=>r.kind!=='schedule'&&r.group!=='配点'&&r.status!=='unpublished');
 const generalBody=heading('general-dates','一般前期の出願・試験日程')+table('一般前期2枠に共通する日程',generalDates)+groups(generalOther,'general','一般前期')+heading('general-scores','一般前期の科目別配点')+generalScores+'<p><a href="#sapporoika-common-subjects">共通テストの指定科目・得点採用と第1段階の配点</a>、<a href="#sapporoika-future">未公表の詳細と公開予定</a>もご確認ください。</p>'+sources(['selection-2027','general-index']);
 const trainingBody='<p>出願資格・日程・科目・配点は、<a href="#sapporoika-general">一般選抜2枠の共通内容</a>をご覧ください。卒後研修枠では、以下の追加条件も必要です。</p>'+groups(routes[1].filter(r=>!used.has(r.origins[0])),'training','卒後研修枠')+sources(['selection-2027','program-index']);
 const sharedDates=selected(regional,r=>r.kind==='schedule');
 const sharedOther=regional.filter(r=>r.kind!=='schedule'&&r.group!=='配点');take(sharedOther);
 const regionalBody=heading('regional-dates','道民枠・特別枠に共通する試験・入学手続日程')+table('両方式の試験・入学手続・成績開示日程',sharedDates.map(r=>r.label==='入学料の納付'?{...r,value:'2027年2月10日13:00以降、本学電子申請サイトから納付します。'}:r))+heading('regional-scores','道民枠・特別枠の配点の違い')+regionalScores+groups(sharedOther,'regional-common','道民枠・特別枠共通')+sources(['comprehensive-2027','recommendation-2027']);
 const specific=(i:number,id:string,label:string)=>{const rows=routes[i].filter(r=>!used.has(r.origins[0]));take(rows);return section(id,label,`<p>${i===2?'道民枠':'特別枠'}は、<a href="#sapporoika-regional-common">両方式の共通条件・手続</a>と、以下の方式固有の条件をすべて満たす必要があります。</p>`+groups(rows,id,label)+sources(i===2?['comprehensive-2027']:['recommendation-2027']),ids[i]);};
 const domin=specific(2,'domin','総合型選抜・道民枠');
 const special=specific(3,'special','学校推薦型選抜・特別枠');
 const subjectKeys=['国語','地理歴史・公民','数学','理科','外国語','情報'];
 const subjects=table('国内4方式の共通テスト指定科目（6教科8科目）',subjectRows.filter(r=>subjectKeys.includes(r.label)))+conditions(subjectRows.filter(r=>!subjectKeys.includes(r.label)))+firstScores+sources(['selection-2027','comprehensive-2027','recommendation-2027']);
 const foreign=routes[4],uncertain=foreign.filter(r=>r.status==='needs-confirmation'),foreignUnpublished=foreign.filter(r=>r.status==='unpublished');take([...uncertain,...foreignUnpublished]);
 const foreignBody=paragraph(merged([...uncertain,coverage(3)],'','出願開始日・締切日・合格発表日は確認待ちです。公式選抜要項の日付と曜日が一致しないため、大学への確認が必要です。訂正通知・2027年度募集要項を確認してください。'))+`<p>国籍・学校教育等の資格、身元保証人、日本留学試験の要件をすべて満たす必要があります。学校教育等の資格は記載のいずれかが必要です。</p>`+groups(foreign.filter(r=>!uncertain.includes(r)&&!foreignUnpublished.includes(r)),'foreign','私費外国人留学生選抜')+'<p><a href="#sapporoika-future">募集要項の公開予定と未公表の詳細</a>はこちらをご覧ください。</p>'+sources(['selection-2027','foreign-index']);
 const future=paragraph(coverage(2,'一般選抜と私費外国人留学生選抜の募集要項は、2026年10月下旬頃に公表予定です。未公表の詳細は募集要項の公開後に更新します。'))+conditions([merged(generalUnpublished,'一般選抜の未公表項目','出願登録・検定料の詳細、科目別試験時刻、試験会場、入学手続期間・提出物は未公表です。募集要項と受験票をご確認ください。'),merged(foreignUnpublished,'私費外国人留学生選抜の未公表項目','科目別時刻・面接日詳細、配点の詳細、試験場・集合指定、入学手続期間等は未公表です。外国人募集要項と受験票をご確認ください。')])+paragraph(coverage(4))+sources(['general-index','foreign-index','change-2028']);
 return `${scopedStyles}<div class="admission-readable sapporoika-editorial" data-university-admissions-year="2027" data-admissions-presentation="sapporoika-editorial-v1">${overview}${section('general','一般選抜（前期日程）',generalBody,'general-standard')}${section('training','札医大卒後研修枠の追加条件',trainingBody,'general-training')}${section('regional-common','道民枠・特別枠に共通する条件と手続',regionalBody)}${domin}${special}${section('common-subjects','国内4方式の共通テスト指定科目',subjects)}${section('foreign','私費外国人留学生選抜',foreignBody,'foreign')}${section('future','募集要項の公開予定・次年度の変更',future)}${paragraph(coverage(5))}${sources(['selection-2027'])}</div>`;
}
export function renderSapporoikaUniversityOverview():string{
 const rows=canonical.basicInfoRows.map((r,i)=>({...r,origins:[`basic/${i}`]}));
 const stats=(caption:string,indices:number[])=>`<table data-admission-table="statistics" class="admission-scores-table"><caption>${esc(caption)}</caption><thead><tr><th scope="col">区分</th><th scope="col">人数</th><th scope="col">割合</th></tr></thead><tbody>${indices.map(i=>{const r=rows[i],m=r.value.match(/(\d+)人（([\d.]+)%）/u)!;return `<tr ${attrs(r)}><th scope="row">${esc(r.label)}</th><td>${m[1]}人</td><td>${m[2]}%</td></tr>`;}).join('')}</tbody></table>`;
 return `<div class="admission-readable sapporoika-editorial">${section('basic','大学基本情報',heading('access','所在地・アクセス')+table('所在地・アクセス・医学部在籍者',rows.slice(0,4),'basic')+sources(['current-access','current-numbers'])+heading('statistics','医学科入学者の男女比・新卒既卒比')+paragraph(rows[4])+stats('2026年度医学科入学者110人：男女別',[5,6])+stats('2026年度医学科入学者110人：新卒・既卒別',[7,8])+paragraph(rows[9])+sources(['results-2026','results-index']))}</div>`;
}
