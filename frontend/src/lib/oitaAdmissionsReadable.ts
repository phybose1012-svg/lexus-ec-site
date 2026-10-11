import type {UniversityAdmissions, UniversityAdmissionScheme} from './universityAdmissions';
import canonical from '../data/universityAdmissions/oita.json' with {type:'json'};
import {admissionFactAttributes as attrs, escapeAdmissionText as esc, renderAdmissionReaderTable as table, renderAdmissionReaderConditions as conditions, renderAdmissionReaderSources as sources} from './admissionsReaderPrimitives.ts';
import type {AdmissionReaderRow as Row} from './admissionsReaderPrimitives.ts';

export function oitaAdmissionsMetadata(data:UniversityAdmissions) {
 return {title:'大分大学医学部｜2027年度入試情報',displayTitle:'大分大学 医学部2027年度入試情報',displayTitleLines:['大分大学 医学部','2027年度入試情報'],description:'大分大学医学部医学科の2027年度入試情報。一般選抜前期と総合型選抜Ⅱの日程、資格、科目・配点、会場、地域枠の勤務条件を掲載。最新の大学基本情報も紹介しています。',lead:'大分大学医学部医学科の2027年度入試情報を選抜方式別にまとめています。日程、出願資格、科目・配点、会場と地域枠の条件を確認し、出願前には大学の正式募集要項と変更通知をご確認ください。',modified:data.verifiedAt.slice(0,10),categories:['九州・沖縄','国公立医学部'],keyPoints:['一般選抜前期の試験は2027年2月25日・26日。一般枠55人、地元出身者枠10人で、一般枠は増員申請が非承認の場合45人になる予定です。','共通テストは両方式とも500点。一般選抜は個別試験550点を加えて計1,050点、総合型は面接300点を加えて計800点です。','総合型の出願書類は2026年11月6日17時必着、試験は2027年2月7日。地域枠は県内小・中学校卒業と病院体験活動が必要で、卒業後の勤務義務があります。']};
}
const merge=(rows:Row[])=>{
 const map=new Map<string,Row>();
 for(const row of rows){const key=row.label+'\0'+row.value;const prior=map.get(key);if(prior){prior.origins.push(...row.origins);prior.sourceIds=[...new Set([...prior.sourceIds,...row.sourceIds])];}else map.set(key,{...row,origins:[...row.origins]});}
 return [...map.values()];
};
const schemeRows=(schemes:UniversityAdmissionScheme[],kind:'schedule'|'exam'|'venue'|'note'):Row[]=>schemes.flatMap(s=>{
 const items=kind==='schedule'?s.scheduleRows:kind==='exam'?s.examRows:kind==='venue'?s.venueRows:s.notes;
 return items.map((item,i)=>({label:'label' in item?item.label:'注意',value:'value' in item?item.value:item.text,origins:[`${s.id}/${kind}/${i}`],sourceIds:item.sourceIds,...('status'in item?{status:item.status}:{})}));
});
const subset=(all:Row[],labels:string[])=>merge(all.filter(r=>labels.includes(r.label)));
const withLabel=(row:Row,label:string)=>({...row,label});
const sectionSources=(data:UniversityAdmissions,rows:Row[])=>sources(data.sources.filter(s=>rows.some(r=>r.sourceIds.includes(s.id))));
const anchor=(ids:string[])=>ids.map(id=>`<span id="admission-scheme-${esc(id)}" class="oita-frame-anchor"></span>`).join('');
const back='<p class="admission-section-links"><a href="#admission-overview">入試方式の一覧へ戻る ↑</a></p>';

export function renderOitaAdmissionsReadable(data:UniversityAdmissions):string {
 if(data.path!=='/information-oita/'||data.schemes.map(s=>s.id).join('|')!=='general-early|general-local|comprehensive-general|comprehensive-regional')throw new Error('Oita requires its four official frames');
 const general=data.schemes.slice(0,2),comprehensive=data.schemes.slice(2);
 const row=(s:UniversityAdmissionScheme,kind:'schedule'|'exam'|'venue'|'note',i:number)=>schemeRows([s],kind)[i];
 const cattrs=(i:number)=>`data-admission-origins="coverage/${i}" data-admission-source-ids="selection-2027 medicine-comprehensive-2027"`;
 const overview=`<h2 id="最新の入試情報">2027年度の入試情報</h2><section class="admission-readable oita-readable" data-university-admissions-year="2027" data-admissions-presentation="oita-readable-v1"><h3 id="admission-overview">入試方式・募集人数・主要日程</h3><table class="admission-overview-table" data-admission-table="overview"><caption>大分大学医学科の4区分（2027年4月入学）</caption><thead><tr><th scope="col">入試方式</th><th scope="col">現在の募集人数</th><th scope="col">出願</th><th scope="col">試験日</th></tr></thead><tbody>${data.schemes.map((s,i)=>`<tr ${attrs(row(s,'schedule',0))}><th scope="row"><a href="#admission-scheme-${esc(s.id)}">${esc(s.name)}</a></th><td><span class="admission-mobile-label">現在の募集人数</span>${[55,10,22,3][i]}人</td><td><span class="admission-mobile-label">出願</span>${i<2?'2027年1月25日～2月3日':'2026年11月2日～6日'}</td><td><span class="admission-mobile-label">試験日</span>${i<2?'2027年2月25日・26日':'2027年2月7日'}</td></tr>`).join('')}</tbody></table><h4>増員申請による募集人数の変更予定</h4><table data-admission-table="quota" ${attrs({...row(general[0],'note',1),origins:['coverage/1',...general.map(s=>`${s.id}/note/1`)]})}><caption>臨時定員増の審議前・承認時・非承認時</caption><thead><tr><th scope="col">区分</th><th scope="col">現在</th><th scope="col">承認時</th><th scope="col">非承認時</th></tr></thead><tbody>${[['一般選抜・一般枠',55,55,45],['一般選抜・地元出身者枠',10,10,10],['総合型・一般枠',22,22,22],['総合型・地域枠',3,13,13],['医学科合計',90,100,90]].map(r=>`<tr><th scope="row">${r[0]}</th>${r.slice(1).map(v=>`<td>${v}人</td>`).join('')}</tr>`).join('')}</tbody></table><p ${cattrs(1)}>地域枠は承認・非承認のいずれの場合も13人へ変更予定。審議結果は2026年10月下旬～11月上旬に大学が公表予定です。</p>${sources(data.sources.filter(s=>s.id==='selection-2027'))}`;
 const scores=(isGeneral:boolean,rows:Row[])=>{
 const records=subset(rows,isGeneral?['共通テスト配点','個別試験配点']:['共通テスト・面接配点']);
 const scoreRows:[string,number|null,number|null][]=[['国語',100,null],['地歴・公民',50,null],['数学（共通テスト2科目）',100,isGeneral?100:null],['理科（2科目）',100,isGeneral?200:null],['外国語',100,isGeneral?100:null],['情報Ⅰ',50,null],['個人面接',null,isGeneral?150:null]];
 if(!isGeneral){scoreRows.pop();scoreRows.push(['個人面接・グループディスカッション',null,300]);}
 const n=(v:number|null)=>v===null?'課さない':`${v}点`;
 return `<table class="admission-score-table" data-admission-table="scores" ${attrs({...records[0],origins:records.flatMap(r=>r.origins),sourceIds:[...new Set(records.flatMap(r=>r.sourceIds))]})}><caption>${isGeneral?'一般選抜前期':'総合型選抜Ⅱ'}の配点（両枠共通）</caption><thead><tr><th scope="col">教科・試験</th><th scope="col">共通テスト</th><th scope="col">${isGeneral?'個別試験':'第2次選考'}</th></tr></thead><tbody>${scoreRows.map(([l,c,i])=>`<tr><th scope="row">${esc(l)}</th><td>${n(c)}</td><td>${n(i)}</td></tr>`).join('')}<tr class="admission-score-total"><th scope="row">合計</th><td>500点</td><td>${isGeneral?550:300}点</td></tr><tr class="admission-score-total"><th scope="row">総合計</th><td colspan="2">${isGeneral?'1,050':'800'}点</td></tr></tbody></table>`;
 };
 const groups=[general,comprehensive].map((schemes,g)=>{
  const isGeneral=g===0,allSchedule=schemeRows(schemes,'schedule'),allExam=schemeRows(schemes,'exam'),allVenue=schemeRows(schemes,'venue'),allNotes=schemeRows(schemes,'note');
  const schedule=subset(allSchedule,isGeneral?['出願期間','Web登録・検定料・書類締切','大学入学共通テスト（本試験）','個別試験','第1段階選抜結果・受験票','合格発表','入学手続']:['Web登録・検定料支払い','出願書類提出','共通テスト成績請求登録','大学入学共通テスト（本試験）','第1次選考結果・受験票','第2次選考','合格発表','入学手続']);
  const qualification=subset(allSchedule,['出願資格']);
  if(isGeneral)qualification.forEach((r,i)=>r.label=i===0?'一般枠の出願資格':'地元出身者枠の追加条件');
  const exams=merge(allExam.filter(r=>!['共通テスト配点','個別試験配点','共通テスト・面接配点'].includes(r.label)));
  const notes=merge(allNotes.filter(r=>!r.value.startsWith('地域枠増員が')&&!r.origins.some(o=>o==='comprehensive-regional/note/2'||o==='comprehensive-regional/note/3'||o==='comprehensive-regional/note/4')));
  let body=`<section class="admission-readable-scheme">${anchor(schemes.map(s=>s.id))}<h3 id="oita-${isGeneral?'general':'comprehensive'}">${isGeneral?'一般選抜（前期日程）':'総合型選抜Ⅱ'}</h3><h4>出願・試験・手続の日程（両枠共通）</h4>${table(isGeneral?'一般選抜前期の日程':'総合型選抜Ⅱの日程',schedule)}<h4>出願資格・枠ごとの条件</h4>${conditions(qualification)}${!isGeneral?conditions(subset(allSchedule,['地域枠の追加資格'])):''}<h4>試験科目・配点</h4>${scores(isGeneral,allExam)}${conditions(exams)}${!isGeneral?conditions(subset(allSchedule,['指定科目の受験'])):''}<h4>試験会場・受験票</h4>${table(isGeneral?'一般選抜前期の会場':'総合型選抜Ⅱの会場・集合',merge(allVenue.filter(r=>r.label!=='事前体験活動の病院')),'venue')}<h4>併願・出願時の注意</h4>${conditions(notes.map(r=>withLabel(r,r.value.startsWith('総合型の一般枠')?'併願・入学辞退':r.value.startsWith('総合型の入学')?'募集人員に満たない場合':'一般枠・地元出身者枠の選抜')))}${!isGeneral?`<h4>検定料・入学料の免除と猶予</h4>${conditions(subset(allSchedule,['検定料の免除・返還','入学料の徴収猶予']))}`:''}${sectionSources(data,[...allSchedule,...allExam,...allVenue,...allNotes])}${back}</section>`;
  return body;
 }).join('');
 const regionalSchedule=schemeRows([comprehensive[1]],'schedule');
 const region=[...subset(regionalSchedule,['体験活動の申込・実施','地域枠の修学資金・卒業後']),...subset(schemeRows([comprehensive[1]],'venue'),['事前体験活動の病院']),...schemeRows([comprehensive[1]],'note').slice(2).map((r,i)=>withLabel(r,['卒業後の勤務・研修','返還免除の例外','勤務コースと留意点','貸与契約の解除・一括返還'][i]))];
 const county=subset(regionalSchedule,['地域枠の大分県面接・同意書']);
 const regions=`<h2 id="oita-regional">総合型地域枠の体験活動・卒業後の勤務</h2>${table('地域枠のみの県面接・同意書提出',county)}${conditions(region)}<p data-admission-origins="coverage/3">2026年の病院体験活動の申込・実施は終了しています。2024年又は2025年8月に受講し、日誌・感想文を提出済みの場合は再受講不要です。</p>${sectionSources(data,[...region,...county])}`;
 const publication=`<h3 id="oita-publication">一般選抜募集要項の公開予定・選抜の範囲</h3><p ${cattrs(2)}>${esc(data.coverageNotes[2])}</p><p ${cattrs(0)}>${esc(data.coverageNotes[0])}</p>${sources(data.sources.filter(s=>['selection-2027','general-index'].includes(s.id)))}`;
 const basic:Row[]=canonical.basicInfoRows.map((r,i)=>({...r,origins:[`basic/${i}`]}));
 const gender=basic[2];
 const basics=`<h2 id="大学基本情報">大学基本情報</h2>${conditions(basic.slice(0,2))}<h3 id="oita-gender">2026年度医学科入学者の男女比</h3><table data-admission-table="gender" ${attrs(gender)}><caption>2026年4月1日現在の医学科入学者100人（第2年次編入学者7人を除く）</caption><thead><tr><th scope="col">区分</th><th scope="col">人数</th><th scope="col">割合</th></tr></thead><tbody><tr><th scope="row">男性</th><td>60人</td><td>60.0%</td></tr><tr><th scope="row">女性</th><td>40人</td><td>40.0%</td></tr><tr><th scope="row">合計</th><td>100人</td><td>100.0%</td></tr></tbody></table>${conditions(basic.slice(3))}${sectionSources(data,basic)}<p class="admission-verification-date">公式資料確認日：<time datetime="${esc(data.verifiedAt)}">${esc(data.verifiedAt.slice(0,10))}</time></p>`;
 return (overview+groups+publication+regions+basics+'</section>').replace(/<h4>(出願・試験・手続の日程（両枠共通）|出願資格・枠ごとの条件|試験科目・配点|試験会場・受験票|併願・出願時の注意)<\/h4>/g,(heading,title,offset,html)=>`<h4>${html.lastIndexOf('id="oita-comprehensive"',offset)>html.lastIndexOf('id="oita-general"',offset)?'総合型':'一般選抜'}：${title}</h4>`);
}
