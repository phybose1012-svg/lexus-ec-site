import raw from '../data/universityAdmissions/tokyokagaku.json' with {type:'json'};
import type {UniversityAdmissions} from './universityAdmissions.ts';
import {admissionFactAttributes as attrs,escapeAdmissionText as esc,renderAdmissionReaderTable as table,renderAdmissionReaderConditions as conditions,renderAdmissionReaderSources as sources} from './admissionsReaderPrimitives.ts';
import type {AdmissionReaderRow} from './admissionsReaderPrimitives.ts';

type Entry=AdmissionReaderRow;
const heading=(id:string,title:string)=>`<h3 id="${id}">${esc(title)}</h3>`;
const h2=(id:string,title:string)=>`<h2 id="${id}">${esc(title)}</h2>`;
const merge=(rows:Entry[],label:string,value:string):Entry=>({label,value,origins:[...new Set(rows.flatMap(r=>r.origins))],sourceIds:[...new Set(rows.flatMap(r=>r.sourceIds))]});
const branches=(row:Entry,intro:string,items:string[])=>`<div ${attrs(row)}><p><strong>${esc(row.label)}</strong> ${esc(intro)}</p><ul>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`;
const numberTable=(caption:string,headers:string[],rows:{fact:Entry;cells:string[]}[])=>`<table data-admission-table="scores" class="tokyokagaku-numbers"><caption>${esc(caption)}</caption><thead><tr>${headers.map(x=>`<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr ${attrs(r.fact)}>${r.cells.map((x,i)=>`<${i?'td':'th scope="row"'}>${esc(x)}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table>`;

export const tokyokagakuMetadata={
 title:'東京科学大学医学部｜2027年度入試情報',displayTitle:'東京科学大学 医学部2027年度入試情報',displayTitleLines:['東京科学大学 医学部','2027年度入試情報'],
 description:'東京科学大学医学部医学科の2027年度入試。前期・後期・学校推薦型の日程、科目・配点、出願条件、会場と、所在地・アクセス、2026年度入学者の男女比、学費を掲載。',
 lead:'東京科学大学医学部医学科の2027年度入試を、一般選抜の前期・後期と学校推薦型に分けてまとめます。出願・試験・入学手続の日程、会場、科目・時間・配点・出題範囲、出願条件と大学基本情報を掲載しています。出願前に大学の当該年度募集要項と変更通知をご確認ください。',
 keyPoints:[
  '募集人数は前期69人、後期10人、学校推薦型5人。地域特別枠推薦と国際バカロレア選抜は別方式です。',
  '前期の配点は共通テスト180点＋個別試験360点＝540点。後期は共通テスト500点＋小論文100点＋面接100点＝700点です。',
  '学校推薦型は2026年11月6日にWeb登録・支払15時、書類17時必着。12月11日は条件付合格で、共通テスト後に最終結果を通知します。'
 ]
};

export function renderTokyokagakuAdmissionsReadable(data:UniversityAdmissions){
 const all:Entry[]=[];
 for(const s of data.schemes){for(const [kind,key] of [['schedule','scheduleRows'],['exam','examRows'],['venue','venueRows'],['note','notes']] as const){s[key].forEach((r,i)=>{const value='value' in r?r.value:r.text;all.push({label:'label' in r?r.label:'出願・受験の注意',value,sourceIds:r.sourceIds,status:'status' in r?r.status:undefined,origins:[`${s.id}/${kind}/${i}`]});});}}
 data.coverageNotes.forEach((value,i)=>all.push({label:'掲載範囲・出願前の確認',value,sourceIds:['guideline-index'],origins:[`coverage/${i}`]}));
 raw.basicInfoRows.forEach((r,i)=>all.push({...r,origins:[`basic/${i}`]}));
 const get=(id:string)=>{const r=all.find(r=>r.origins.includes(id));if(!r)throw new Error(`Missing Tokyo Science fact ${id}`);return r;};
 const take=(ids:string[])=>ids.map(get),ren=(id:string,label:string)=>({...get(id),label});
 const e=(n:number)=>get(`general-early/exam/${n}`),l=(n:number)=>get(`general-late/exam/${n}`),r=(n:number)=>get(`school-recommendation/exam/${n}`);
 const sourceList=(ids:string[],pages='')=>sources(data.sources.filter(s=>ids.includes(s.id)).map(s=>({...s,title:`${s.title}${pages&&s.id.endsWith('2027')?`（${pages}）`:''}／確認日 ${s.retrievedAt.slice(0,10)}`})));
 const overview=numberTable('2027年度 医学科の主な3方式',['方式','募集人数','出願','大学での試験'],[
  {fact:e(0),cells:['一般前期','69人','2027/1/25〜2/3','2/25・26']},
  {fact:l(0),cells:['一般後期','10人','2027/1/25〜2/3','3/12・13']},
  {fact:r(0),cells:['学校推薦型','5人','2026/11/2〜6','11/24・25']}
 ]).replace('class="tokyokagaku-numbers"','class="tokyokagaku-numbers tokyokagaku-overview-table"').replace('一般前期</th>','<a href="#tokyokagaku-early">一般前期</a></th>').replace('一般後期</th>','<a href="#tokyokagaku-late">一般後期</a></th>').replace('学校推薦型</th>','<a href="#tokyokagaku-recommendation">学校推薦型</a></th>');
 const ctFacts=[e(2),l(2),r(7)],ct=(label:string,value:string)=>merge(ctFacts,label,value);
 const ctRows=[
  ct('国語','「国語」'),
  ct('地理歴史・公民（前期・推薦）','「地理総合，地理探究」「歴史総合，日本史探究」「歴史総合，世界史探究」「公共，政治・経済」「公共，倫理」から1科目。後期は指定なし。'),
  ct('数学','「数学Ⅰ，数学A」と「数学Ⅱ，数学B，数学C」の2科目'),
  ct('理科','「物理」「化学」「生物」から2科目'),
  ct('外国語','英語（リーディング・リスニング）・ドイツ語・フランス語・中国語・韓国語から1科目'),
  ct('情報','「情報Ⅰ」')
 ];
 const ctConditions=[
  merge([e(4),l(4),r(9)],'英語の換算',e(4).value),
  merge(take(['general-early/note/0','school-recommendation/note/1']),'地理歴史・公民の選択','前期・学校推薦型で2科目を受験した場合は第1解答科目を利用。指定外科目や、第1解答科目が指定科目でない場合は受験資格がありません。「地理総合／歴史総合／公共」は医学科の指定科目に含まれません。')
 ];
 const scoreFacts=[e(3),l(3)],score=(cells:string[])=>({fact:merge(scoreFacts,'共通テスト原配点',cells.join('／')),cells});
 const scores=numberTable('一般選抜の配点（単位：点）',['教科・試験','前期','後期'],[
  score(['国語','200','200']),score(['地理歴史・公民','100','課さない']),score(['数学','200','200']),score(['理科','200','200']),score(['外国語','200','200']),score(['情報','100','100']),score(['共通テスト原点計','1,000','900']),
  score(['換算後の利用点','180','500']),
  {fact:merge([e(9),l(7)],'個別試験計','前期360点、後期200点'),cells:['個別試験計','360','200']},
  {fact:merge([e(9),l(7)],'総合計','前期540点、後期700点'),cells:['総合計','540','700']}
 ]);
 const generalUnknown=merge(take(['general-early/schedule/2','general-early/schedule/3','general-late/schedule/2','general-late/schedule/3','general-early/schedule/9','general-late/schedule/9','coverage/1']),'正式募集要項とWeb手続','医歯学系の2027年度一般選抜学生募集要項は2026年11月下旬公表予定で、10月19日現在は未掲載です。方式別のWeb登録期間・支払日程、入学手続の締切時刻・方法は公表後に確認してください。現在のWeb出願共通案内では、登録と支払は出願締切日の15時までです。');
 const generalEligibility=merge([e(1),l(1),get('general-late/note/0')],'一般選抜の出願資格',e(1).value);
 const commonDate=merge(take(['general-early/schedule/0','general-late/schedule/0','school-recommendation/schedule/8']),'大学入学共通テスト（本試験）','2027年1月16日（土）・17日（日）');
 const schedule=(scheme:string,name:string)=>table(name+'の出願・試験・入学手続',take([1,4,5,6,7,8].map(i=>`${scheme}/schedule/${i}`)));
 const earlyScope=take([5,6,7].map(i=>`general-early/exam/${i}`)).map((x,i)=>({...x,label:['数学の範囲','理科の選択・範囲','英語の範囲'][i],value:[
  '数学Ⅰ・Ⅱ・Ⅲは全範囲。数学A：図形の性質、場合の数と確率。数学B：数列。数学C：ベクトル、平面上の曲線と複素数平面。',
  '物理基礎・物理、化学基礎・化学、生物基礎・生物の3組から2科目。各組の基礎・発展科目の全範囲。',
  '英語コミュニケーションⅠ・Ⅱ・Ⅲ、論理・表現Ⅰ・Ⅱ・Ⅲの全範囲。'
 ][i]}));
 const earlyIndividual=numberTable('前期の個別学力検査',['教科','配点','時間'],[
  {fact:e(5),cells:['数学','120点','90分']},{fact:e(6),cells:['理科（2科目合計）','120点','120分']},{fact:e(7),cells:['英語','120点','90分']}
 ]);
 const lateIndividual=numberTable('後期の個別試験',['試験','配点','時間・形式'],[
  {fact:l(5),cells:['小論文','100点','120分']},{fact:l(6),cells:['面接','100点','個人面接']}
 ]);
 const venueNotice=merge(take(['general-early/venue/2','general-late/venue/1','coverage/3']),'集合時刻・試験室','各会場の集合時刻・試験室は受験票と大学の案内で確認してください。医歯学系の受験案内はWeb出願システム・郵送等で別途通知されます。');
 const recSchedule=table('学校推薦型の出願・試験日程',take([0,1,2,3,4,5,6].map(i=>`school-recommendation/schedule/${i}`)));
 const recAfter=table('学校推薦型の条件付合格後・入学手続',take([7,9,10,11].map(i=>`school-recommendation/schedule/${i}`)));
 const recRequirements=conditions([ren('school-recommendation/exam/1','卒業・修了と入学確約'),ren('school-recommendation/exam/2','学校長推薦')])+branches(ren('school-recommendation/exam/3','医学科の推薦要件'),'次の要件をすべて満たす必要があります。',r(3).value.replace('次の推薦要件をすべて満たすこと。','').split('／'));
 const recEval=conditions([ren('school-recommendation/exam/4','選考・第1段階'),ren('school-recommendation/exam/5','小論文'),ren('school-recommendation/exam/6','面接'),ren('school-recommendation/exam/8','共通テストの成績'),ren('school-recommendation/exam/10','配点・試験時間'),ren('school-recommendation/note/4','必須試験・卒業条件')]);
 const recNotes=conditions([ren('school-recommendation/exam/11','出願書類'),ren('school-recommendation/exam/12','検定料・郵送料'),ren('school-recommendation/note/3','第1段階不合格時の返還'),ren('school-recommendation/note/5','出願の完了条件'),
  {...get('school-recommendation/note/0'),label:'併願',value:'地域特別枠推薦との併願は不可。国公立大学の学校推薦型への出願は1大学・学部に限ります。'},
  {...get('school-recommendation/note/0'),label:'入学確約・辞退',value:'合格時の入学を確約し、辞退は原則認められません。辞退許可のない合格者は、他の国公立大学の一般選抜等を受験しても合格者とならない扱いです（独自日程の公立大学・学部を除く）。'},
  {...get('school-recommendation/note/0'),label:'特別な事情による辞退',value:'学校長名の理由付き辞退願を2027年2月17日（水）17時までに学長へ提出し、許可を得る必要があります。許可されれば本学・他の国公立大学の一般選抜等で合格者になり得ます。'},
  ren('school-recommendation/note/2','欠員・不合格後の一般選抜')]);
 const recVenue=conditions([ren('school-recommendation/venue/0','試験会場'),ren('school-recommendation/venue/1','受験票・試験の詳細')]);
 const base=table('所在地・アクセス',take(['basic/0','basic/1','basic/2']));
 const gender=numberTable('2026年度 医学科1年次入学者・99人',['区分','人数','割合'],[
  {fact:get('basic/4'),cells:['男性','59人','59.6％']},{fact:get('basic/5'),cells:['女性','40人','40.4％']},{fact:get('basic/3'),cells:['合計','99人','100％']}
 ]);
 const basicNotes=conditions([{...get('basic/3'),label:'統計の対象',value:'医学科の1年次入学者を集計。医学部全体（193人）や2年次学士編入学者（5人）を含みません。'},ren('basic/6','現役・既卒別')]);
 const fees=table('入学料・授業料（2026年度実績）',take(['basic/7','basic/8']));
 return `<section class="admission-readable tokyokagaku-editorial" data-university-admissions-year="2027">${h2('tokyokagaku-overview','入試方式・募集人数・主要日程')}${overview}${conditions([{...get('general-early/note/1'),label:'医学科全体の定員',value:'医学科の入学定員は97人。上表の3方式のほか、地域特別枠推薦11人（認可申請予定）と国際バカロレア選抜2人を含みます。'},ren('coverage/0','掲載する方式')])}${sourceList(['selection-2027','recommendation-2027'])}
 ${h2('tokyokagaku-common','共通テストと一般選抜の共通事項')}${table('共通テストの日程',[commonDate])}${branches(generalEligibility,'2027年度共通テストの指定全教科・科目を受験し、次のいずれかを満たすこと。',e(1).value.split(/[①②③④]/u).slice(1))}${heading('tokyokagaku-common-subjects','共通テストの指定科目')}${table('前期・推薦は6教科8科目、後期は5教科7科目',ctRows,'subjects')}${conditions(ctConditions)}${heading('tokyokagaku-general-scores','一般選抜の共通テスト・個別試験配点')}${scores}${conditions([merge(scoreFacts,'共通テストの換算','前期は原点に180／1,000、後期は500／900を掛けて利用します。')])}${heading('tokyokagaku-general-guide','一般選抜の正式募集要項・受験案内')}${conditions([generalUnknown,venueNotice])}${sourceList(['selection-2027','recommendation-2027','guideline-index','schedule-2027','venue-index','web-flow','dnc-dates-2027'])}
 ${h2('tokyokagaku-early','一般選抜・前期日程')}${schedule('general-early','前期')}${conditions([ren('general-early/exam/10','第1段階選抜')])}${heading('tokyokagaku-early-exams','前期の個別試験・出題範囲')}${earlyIndividual}${conditions([...earlyScope,ren('general-early/exam/8','面接')])}${heading('tokyokagaku-early-venue','前期の会場')}${conditions(take(['general-early/venue/0','general-early/venue/1']))}${sourceList(['selection-2027','schedule-2027'])}
 ${h2('tokyokagaku-late','一般選抜・後期日程')}${schedule('general-late','後期')}${conditions([ren('general-late/exam/8','第1段階選抜')])}${heading('tokyokagaku-late-exams','後期の小論文・面接')}${lateIndividual}${conditions([merge([l(5),l(6)],'出題・評価','小論文は英文で出題される場合があります。小論文・面接を通じ、医学・医療への適性、論理的思考、問題発見・解決能力等を評価します。')])}${heading('tokyokagaku-late-venue','後期の会場')}${conditions([ren('general-late/venue/0','小論文・面接')])}${sourceList(['selection-2027','schedule-2027'])}
 ${h2('tokyokagaku-recommendation','特別選抜Ⅰ・学校推薦型選抜')}${recSchedule}${heading('tokyokagaku-rec-eligibility','学校推薦型の出願資格・推薦条件')}${recRequirements}${heading('tokyokagaku-rec-exams','学校推薦型の選考方法')}${recEval}<p ${attrs(merge([r(7),get('school-recommendation/note/1')],'指定科目','共通節へ'))}>指定科目と英語換算は<a href="#tokyokagaku-common-subjects">共通テストの指定科目</a>に掲載しています。</p>${heading('tokyokagaku-rec-docs','学校推薦型の出願書類・併願条件')}${recNotes}${heading('tokyokagaku-rec-after','条件付合格から最終結果・入学手続へ')}${recAfter}<p ${attrs(get('coverage/2'))}>学校推薦型では、出願後も成績請求チケットの提出と最終結果後の入学手続が必要です。</p>${heading('tokyokagaku-rec-venue','学校推薦型の会場・受験票')}${recVenue}${sourceList(['recommendation-2027','web-application','web-flow'])}
 ${h2('tokyokagaku-basic','所在地・アクセス・入学者統計')}${base}${gender}${basicNotes}${sourceList(['access-index','statistics-index','medicine-results-2026','medical-brochure-2027'])}
 ${h2('tokyokagaku-fees','入学料・授業料と免除制度')}${fees}${conditions(take(['basic/9','basic/10','basic/11','basic/12']))}${sourceList(['recommendation-2027'])}<p ${attrs(get('coverage/4'))}>${esc(get('coverage/4').value)}</p>${sourceList(['changes-index','changes-2027'])}
 </section><style>
 .article-content .tokyokagaku-editorial table{display:table;width:100%;table-layout:fixed;min-width:0;white-space:normal;overflow:visible}
 .article-content .tokyokagaku-editorial table :is(th,td):nth-child(n){width:auto;min-width:0;white-space:normal;overflow-wrap:anywhere;vertical-align:top}
 .article-content .tokyokagaku-editorial table:not(.tokyokagaku-numbers) thead th:first-child{width:28%}
 .article-content .tokyokagaku-editorial table:not(.tokyokagaku-numbers) thead th:nth-child(2){width:72%}
 .article-content .tokyokagaku-editorial .tokyokagaku-numbers thead th:first-child{width:40%}
 .article-content .tokyokagaku-editorial .tokyokagaku-numbers thead th:nth-child(n+2){width:30%}
 .article-content .tokyokagaku-editorial .tokyokagaku-overview-table thead th:first-child{width:26%}
 .article-content .tokyokagaku-editorial .tokyokagaku-overview-table thead th:nth-child(2){width:16%}
 .article-content .tokyokagaku-editorial .tokyokagaku-overview-table thead th:nth-child(n+3){width:29%}
 .article-content .tokyokagaku-editorial .admission-conditions{padding-left:1.3em}
 .article-content .tokyokagaku-editorial .admission-conditions li{margin-bottom:.7em}
 .article-content .tokyokagaku-editorial .admission-sources{font-size:.82em;margin:.7rem 0 1.6rem}
 .article-content .tokyokagaku-editorial .admission-sources summary{cursor:pointer}
 .article-content .tokyokagaku-editorial .admission-sources a{overflow-wrap:anywhere}
 .article-content .tokyokagaku-editorial caption{text-align:left;font-weight:700;margin-bottom:.5rem}
 @media(max-width:480px){.article-content .tokyokagaku-editorial table{font-size:.85rem}.article-content .tokyokagaku-editorial th,.article-content .tokyokagaku-editorial td{padding:.5rem .35rem;line-height:1.65}}
 </style>`;
}
