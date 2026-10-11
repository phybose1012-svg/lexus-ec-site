import type { UniversityAdmissions } from './universityAdmissions.ts';
import canonical from '../data/universityAdmissions/kagoshima.json' with { type: 'json' };
import { admissionFactAttributes as attrs, escapeAdmissionText as esc, renderAdmissionReaderTable, renderAdmissionReaderConditions as conditions, renderAdmissionReaderSources } from './admissionsReaderPrimitives.ts';
import type { AdmissionReaderRow } from './admissionsReaderPrimitives.ts';

export function kagoshimaAdmissionsMetadata(data:UniversityAdmissions) {
 return {title:'鹿児島大学医学部｜2027年度入試情報',displayTitle:'鹿児島大学 医学部2027年度入試情報',displayTitleLines:['鹿児島大学 医学部','2027年度入試情報'],modified:data.verifiedAt.slice(0,10),description:'鹿児島大学医学科の2027年度入試情報。一般前期・後期、地域枠推薦Ⅱ、IB、私費留学生の募集人数、日程、科目・配点、出願条件、卒後勤務と2026年度医学科入学者統計を紹介します。',lead:'鹿児島大学医学部医学科の2027年度入試について、選抜方式別の日程、会場、科目・配点、出題範囲と出願条件をまとめています。試験時刻などの未公表項目は募集要項・受験案内の公開後に更新します。出願前には大学の正式募集要項と変更通知をご確認ください。',keyPoints:['一般前期は数学・理科・英語と面接、一般後期は小論文と面接を課します。','一般前期は共通テスト925点＋個別920点、後期は925点＋個別320点。後期の第1段階選抜は約11倍へ変更されています。','地域枠推薦Ⅱは県内高校の卒業・卒業見込み者が対象。面接は2026年12月12日で、県修学資金の貸与と卒後の県内勤務等が必要です。']};
}

const prefix=['general-early','general-late','recommendation-ii-regional'];
const routeNames=['一般選抜 前期','一般選抜 後期','学校推薦型選抜Ⅱ 地域枠','国際バカロレア選抜','私費外国人学部留学生選抜'];
export function renderKagoshimaAdmissionsReadable(data:UniversityAdmissions):string {
 if(data.path!==canonical.path||data.schemes.map(s=>s.id).join(',')!==canonical.schemes.map(s=>s.id).join(','))throw new Error('Kagoshima requires the reviewed five routes');
 const row=(origin:string):AdmissionReaderRow=>{
  const [id,kind,n]=origin.split('/');
  if(id==='coverage')return {label:'',value:data.coverageNotes[Number(kind)],origins:[origin],sourceIds:[]};
  if(id==='basic')return {...canonical.basicInfoRows[Number(kind)],origins:[origin]};
  const s=data.schemes.find(s=>s.id===id)!;
  const r=kind==='note'?s.notes[Number(n)]:kind==='schedule'?s.scheduleRows[Number(n)]:kind==='exam'?s.examRows[Number(n)]:s.venueRows[Number(n)];
  if(!r)throw new Error(`Missing reviewed fact ${origin}`);
  const labels:Record<string,string[]>={
   'general-early':['募集人数の調整'],'general-late':['募集人数の調整'],
   'recommendation-ii-regional':['卒後の免許・研修・勤務','地域枠ガイドブック','併願の制約','面接の変更','在学中・卒業後の離脱','県の同意に関する例外','検定料等の返還'],
   'international-baccalaureate':['最終成績の確認','検定料等の返還'],
   'international-private':['確認書と志望理由書','翻訳証明','私費留学生の免除・猶予','検定料等の返還']};
  return {...r,label:'label' in r?r.label:labels[id][Number(n)],value:'value' in r?r.value:r.text,origins:[origin]};
 };
 const merged=(origins:string[],label?:string)=>{
  const rows=origins.map(row);
  if(rows.some(r=>r.value!==rows[0].value))throw new Error('Different route conditions must not be merged');
  return {...rows[0],label:label??rows[0].label,origins,sourceIds:[...new Set(rows.flatMap(r=>r.sourceIds))]};
 };
 const groupAttrs=(origins:string[])=>attrs({label:'',value:'',origins,sourceIds:[...new Set(origins.flatMap(o=>row(o).sourceIds))]});
 // Composite facts have one marker on the smallest container holding their parts.
 const withoutMarkers=(html:string,origins:string[])=>html.replace(/ data-admission-origins="([^"]+)"/gu,(_,value:string)=>{
  const remaining=value.split(' ').filter(o=>!origins.includes(o));
  return remaining.length?` data-admission-origins="${remaining.join(' ')}"`:'';
 });
 const sourcePanel=(ids:string[])=>{
  const sourceHtml=renderAdmissionReaderSources(data.sources.filter(s=>ids.includes(s.id)).map(s=>({...s,title:`${s.title}${s.pages?`（${Array.isArray(s.pages)?`PDF p.${s.pages.join('、')}`:s.pages}）`:''}`})));
  return `<div class="admission-source-footer">${sourceHtml.replace('</details>',`<p class="admission-source-date">確認日：${data.verifiedAt.slice(0,10)}</p></details>`)}</div>`;
 };
 const heading=(text:string)=>`<h4 class="admission-group-title">${esc(text)}</h4>`;
 const table=(title:string,rows:AdmissionReaderRow[])=>renderAdmissionReaderTable(title,rows,'schedule').replace('<table ','<table class="admission-dates-table" ');
 const score=(caption:string,headers:string[],scores:string[][],origins:string[])=>`<table class="admission-score-table" ${groupAttrs(origins)}><caption>${esc(caption)}</caption><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${scores.map((cells,i)=>`<tr${i>=scores.length-1?' class="admission-score-total"':''}>${cells.map((v,j)=>j===0?`<th scope="row">${esc(v)}</th>`:`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

 const quotaOrigins=['coverage/0','coverage/1','general-early/schedule/0','general-late/schedule/0','general-early/note/0','general-late/note/0','international-baccalaureate/schedule/0','international-private/schedule/0','basic/3'];
 const quotas=['69人（要確認）','19人（要確認）','20人（申請中・要確認）','2人','若干人'];
 const dates=[['2027年1月25日～2月3日','2027年2月25日・26日'],['2027年1月25日～2月3日','2027年3月12日'],['2026年11月20日～25日 17時必着','面接：2026年12月12日'],['2026年11月20日～25日 17時必着','面接：2026年12月12日'],['2026年11月2日～5日 17時必着','作文・面接：2026年12月12日']];
 const overview=`<div class="admission-overview" ${groupAttrs(quotaOrigins)}><h3 id="admission-overview">入試方式・募集人数・主要日程</h3><p>下表の5方式を掲載しています。学校推薦型選抜Ⅱは地域枠のみで、別の通常推薦枠はありません。医学科の総合型選抜・学校推薦型選抜Ⅰは実施されません。</p><table class="admission-overview-table"><caption class="admission-sr-only">医学科2027年度の募集人数・出願書類受付・個別試験</caption><thead><tr>${['方式','募集人数','出願書類の受付','個別試験'].map(s=>`<th scope="col">${s}</th>`).join('')}</tr></thead><tbody>${data.schemes.map((s,i)=>`<tr><th scope="row"><a href="#admission-${s.id}">${routeNames[i]}</a></th>${[quotas[i],...dates[i]].map((v,j)=>`<td><span class="admission-mobile-label" aria-hidden="true">${['募集人数','出願書類の受付','個別試験'][j]}</span>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table><div class="admission-important"><p>医学科の入学定員110人には地域枠の臨時増員20人を含みます。2027年度の臨時定員増は申請中で、人数は確定前です。</p><p>IB選抜で入学手続完了者が募集人数に満たない場合、欠員は一般後期の募集人員に含めます。私費留学生の入学手続完了者がいる場合、一般選抜の合格者数が募集人員より少なくなることがあります。</p></div><p>出願前に正式募集要項、募集人数の確定告知、訂正通知を確認してください。</p>${sourcePanel(['selection-2027','recommendation-2027','ib-2027','international-2027'])}</div>`;
 const common=prefix.map(id=>`${id}/exam/0`);
 const ct=`<h3 id="admission-common-test">一般前期・後期・推薦Ⅱの共通テスト</h3>${score('2027年度・医学科 共通テスト6教科8科目',['教科','配点'],[['国語','200点'],['地歴・公民（1科目）','100点'],['数学（2科目）','200点'],['理科（2科目）','200点'],['英語','200点'],['情報Ⅰ','25点'],['合計','925点']],common)}${conditions([1,2,3].map(n=>merged(prefix.map(id=>`${id}/exam/${n}`))))}${sourcePanel(['selection-2027','recommendation-2027'])}`;
 const english=`<h3 id="admission-english-benefit">一般前期・後期・推薦Ⅱの外部英語優遇</h3>${conditions([0,1,2].map(n=>merged([`general-early/exam/${9+n}`,`general-late/exam/${7+n}`,`recommendation-ii-regional/exam/${7+n}`])))}${sourcePanel(['selection-2027','recommendation-2027'])}`;
 const generalUnpublished=`<h3 id="admission-general-unpublished">一般選抜の未公表事項</h3><p>日程・科目・配点は公表されています。以下の未公表事項は一般前期・後期に共通です。</p>${conditions([3,6].map(n=>merged([`general-early/schedule/${n}`,`general-late/schedule/${n}`])))}${sourcePanel(['guide-index','venue-index','selection-2027'])}`;
 const attentionLabels:Record<string,string>={
  'Web登録・検定料支払い':'検定料・追加料金','出願書類の提出':'提出方法・出願完了','個別試験':'受験する試験',
  '合格発表':'発表時刻','入学手続':'書類提出方法・必要書類','共通テスト成績請求情報の提供':'成績請求情報の提供手続',
  '大学入学共通テスト（本試験）':'受験する共通テスト','IB最終成績の提出':'IB成績の登録期限',
  '面接・集合':'面接で用いる言語','作文・面接・集合':'作文・面接の時刻','見込み取得者の資格証書':'資格証書の未提出'
 };
 const routes=data.schemes.map((s,i)=>{
  const origins=(kind:string,indices:number[])=>indices.map(n=>row(`${s.id}/${kind}/${n}`));
  const qualification=i<2?[1]:i===2?[0,1,2,6]:i===3?[1,2]:[1];
  const omittedDates=i<2?[0,3,6]:i===2?[3]:[0];
  const dateIndices=s.scheduleRows.map((_,n)=>n).filter(n=>!qualification.includes(n)&&!omittedDates.includes(n));
  const attention:AdmissionReaderRow[]=[];
  const dateRows=origins('schedule',dateIndices).map(r=>{
   if(r.status==='unpublished')return r;
   const split=r.value.indexOf('。');
   if(split<0||split===r.value.length-1)return r;
   attention.push({...r,label:attentionLabels[r.label]??r.label,value:r.value.slice(split+1)});
   return {...r,value:r.value.slice(0,split+1)};
  });
  const dateOrigins=dateRows.flatMap(r=>r.origins);
  const procedure=`<div class="admission-procedure" ${groupAttrs(dateOrigins)}>${withoutMarkers(table(`${routeNames[i]}の日程`,dateRows)+(attention.length?conditions(attention):''),dateOrigins)}</div>`;
  const qualifications=origins('schedule',qualification).map(r=>i===2&&r.origins[0].endsWith('/schedule/0')?{...r,label:'推薦の上限',value:r.value.slice(r.value.indexOf('対象は')),status:'confirmed'}:r);
  let scores='',examRows:AdmissionReaderRow[]=[],scoreOrigins:string[]=[];
  if(i===0){scoreOrigins=[5,6,7,8].map(n=>`${s.id}/exam/${n}`);scores=score('一般前期 個別試験・総合点',['教科・試験','配点'],[['数学','200点'],['理科（2科目）','400点'],['英語','200点'],['面接','120点'],['個別合計','920点'],['共通テスト＋個別','1,845点']],scoreOrigins);examRows=origins('exam',[4,5,6,7,8,12]);}
  else if(i===1){scoreOrigins=[5,6].map(n=>`${s.id}/exam/${n}`);scores=score('一般後期 個別試験・総合点',['試験','配点'],[['小論文','200点'],['面接','120点'],['個別合計','320点'],['共通テスト＋個別','1,245点']],scoreOrigins);examRows=origins('exam',[4,5,6,10]);}
  else if(i===2){scoreOrigins=[`${s.id}/exam/4`];scores=score('地域枠推薦Ⅱ 個別試験・総合点',['試験','配点'],[['面接','80点'],['共通テスト＋面接','1,005点']],scoreOrigins);examRows=origins('exam',[4,5,6,10]);}
  else if(i===3){scoreOrigins=[`${s.id}/exam/0`];scores=score('医学科IB選抜の配点',['審査・試験','配点'],[['書類審査','200点'],['面接','160点'],['合計','360点']],scoreOrigins);examRows=origins('exam',[1,2,3,4]);examRows.unshift({...row(scoreOrigins[0]),label:'受験する試験',value:'共通テスト・独自教科試験は課しません。'});}
  else {scoreOrigins=[`${s.id}/exam/3`];scores=score('私費留学生 EJU・面接の配点',['教科・試験','配点'],[['EJU日本語（記述を除く）','400点'],['EJU日本語記述','50点'],['EJU理科（2科目各100点）','200点'],['EJU数学コース2','200点'],['面接','160点'],['合計','1,010点']],scoreOrigins);examRows=origins('exam',[0,1,2,4,5]);examRows.push({...row(scoreOrigins[0]),label:'TOEFLの扱い',value:'TOEFLは出願資格の判定に使用し、総合点には加えません。'});}
  examRows=examRows.map(r=>({...r,value:r.value.replace(/^200点。|^面接120点。|^面接80点、共通テストと合計1005点。/u,'').replace(/2科目計400点。|個別試験920点、共通テストとの総点1845点。|個別試験320点、共通テストとの総点1245点。/u,'')}));
  const exam=`<div class="admission-exam-group" ${groupAttrs(scoreOrigins)}>${withoutMarkers(scores+conditions(examRows),scoreOrigins)}</div>`;
  const noteIndices=s.notes.map((_,n)=>n).filter(n=>!(i<2&&n===0)&&!(i===2&&[0,1,4,5].includes(n))&&!(i===4&&n===2));
  return `<section class="admission-readable-scheme" data-admission-scheme="${s.id}"><h3 id="admission-${s.id}">${routeNames[i]}</h3>${heading(`${routeNames[i]}の出願・試験・手続`)}${i<2?'<p><a href="#admission-general-unpublished">一般選抜の未公表事項</a></p>':''}${procedure}${heading(`${routeNames[i]}の出願資格・募集条件`)}${withoutMarkers(conditions(qualifications),['recommendation-ii-regional/schedule/0'])}${heading(`${routeNames[i]}の科目・配点・判定`)}${i<3?'<p><a href="#admission-common-test">共通テストの科目・配点</a>と<a href="#admission-english-benefit">外部英語優遇の基準</a></p>':''}${exam}${heading(`${routeNames[i]}の会場・受験票`)}${conditions(origins('venue',s.venueRows.map((_,n)=>n)))}${noteIndices.length?heading(`${routeNames[i]}の併願・書類・検定料の注意`)+conditions(origins('note',noteIndices)):''}${i===4?'<p><a href="#admission-fees">入学料・授業料の制度</a></p>':''}${sourcePanel([...new Set([...s.scheduleRows,...s.examRows,...s.venueRows,...s.notes].flatMap(r=>r.sourceIds))])}</section>`;
 }).join('');
 const regional=`<h3 id="admission-regional-career">地域枠の修学資金・卒後勤務・離脱条件</h3>${conditions([row('recommendation-ii-regional/schedule/3'),...[0,4,5,1].map(n=>row(`recommendation-ii-regional/note/${n}`))])}${sourcePanel(['recommendation-2027','recommendation-pledge','venue-index'])}`;
 const basic=(n:number)=>row(`basic/${n}`);
 const ageTable=score('2026年度 医学科入学者110人・年齢別（2026年4月1日）',['年齢','人数','割合'],[['18歳','48人','43.6％'],['19歳','41人','37.3％'],['20歳','15人','13.6％'],['21歳','2人','1.8％'],['22歳以上','4人','3.6％'],['合計','110人','100％']],['basic/5']);
 const studentTable=score('2026年度 医学科全学年727人・2026年5月1日時点',['区分','人数','割合'],[['女子（総数の内数）','293人','40.3％'],['在学生総数','727人','100％']],['basic/6']);
 const statistics=`<h3 id="admission-entrants">2026年度医学科入学者の男女・年齢</h3>${score('2026年度 医学科入学者110人・2026年4月1日時点',['区分','人数','割合'],[['男性','58人','52.7％'],['女性','52人','47.3％'],['合計','110人','100％']],['basic/4'])}<div class="admission-statistic" ${groupAttrs(['basic/5'])}>${withoutMarkers(ageTable,['basic/5'])}<p>年齢の区分であり、現役・浪人の区分ではありません。割合は110人を母数として計算し、端数を四捨五入しています。</p></div>${sourcePanel(['results-index','results-2026'])}<h3 id="admission-students">2026年度医学科の在学生</h3><div class="admission-statistic" ${groupAttrs(['basic/6'])}>${withoutMarkers(studentTable,['basic/6'])}<p>在学生全学年の統計で、入学者の統計とは対象が異なります。</p></div>${sourcePanel(['overview-index','overview-2026'])}`;
 const overviewBasic=`<h2 id="大学基本情報">大学基本情報</h2><section class="admission-readable kagoshima-readable"><h3 id="admission-campus">所在地・アクセス</h3>${conditions([0,1,2].map(basic))}${sourcePanel(['medical-home','medical-access','overview-2026'])}${statistics}<h3 id="admission-fees">入学料・授業料と方式別の支援制度</h3>${conditions([7,8,9].map(basic))}${conditions([row('international-private/note/2')])}${sourcePanel(['recommendation-2027','ib-2027','international-2027'])}</section>`;
 const aggregateOrigins=['coverage/2','coverage/3','coverage/4','recommendation-ii-regional/schedule/0'];
 return `<h2 id="最新の入試情報">2027年度の入試情報</h2><section class="admission-readable kagoshima-readable" data-admissions-presentation="kagoshima-readable-v2" data-university-admissions-year="2027" ${groupAttrs(aggregateOrigins)}>${overview}${ct}${english}${generalUnpublished}${routes}${regional}</section>${overviewBasic}`;
}
