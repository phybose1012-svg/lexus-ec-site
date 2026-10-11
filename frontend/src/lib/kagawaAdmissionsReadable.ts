import type {UniversityAdmissions} from './universityAdmissions.ts';
import canonical from '../data/universityAdmissions/kagawa.json' with {type:'json'};
import {admissionFactAttributes,escapeAdmissionText as esc,renderAdmissionReaderTable as table,renderAdmissionReaderConditions as conditions,renderAdmissionReaderSources as sourceList} from './admissionsReaderPrimitives.ts';
import type {AdmissionReaderRow} from './admissionsReaderPrimitives.ts';

const origin=(id:string,kind:string,i:number)=>`${id}/${kind}/${i}`;
const scheme=(id:string)=>canonical.schemes.find(s=>s.id===id)!;
function row(origins:string[],label?:string,value?:string):AdmissionReaderRow {
  const values=origins.map(o=>{
    const [id,kind,n]=o.split('/');
    if(id==='coverage')return {label:'',value:canonical.coverageNotes[+kind],sourceIds:[] as string[]};
    if(id==='basic')return canonical.basicInfoRows[+kind];
    const s=scheme(id);
    const a=kind==='schedule'?s.scheduleRows:kind==='exam'?s.examRows:kind==='venue'?s.venueRows:s.notes;
    const r=a[+n];
    if(!r)throw new Error('Unknown Kagawa fact '+o);
    return {label:'label' in r?r.label:'',value:'value' in r?r.value:r.text,sourceIds:r.sourceIds,status:'status' in r?r.status:undefined};
  });
  return {label:label??values[0].label,value:value??values[0].value,origins,sourceIds:[...new Set(values.flatMap(v=>v.sourceIds))],status:values.flatMap(v=>'status' in v&&v.status?[v.status]:[]).includes('needs-confirmation')?'needs-confirmation':values.some(v=>'status' in v&&v.status==='unpublished')?'unpublished':undefined};
}
const fact=(id:string,kind:string,i:number,label?:string,value?:string)=>row([origin(id,kind,i)],label,value);
function merged(id:string,kind:string,i:number,label?:string,value?:string) {
  const regional=id==='general-early'?'general-regional':id==='recommendation-ii'?'recommendation-regional':null;
  const target=regional&&kind==='schedule'?i+(id==='recommendation-ii'?1:0):i;
  const origins=[origin(id,kind,i)];
  if(regional)origins.push(origin(regional,kind,target));
  return row(origins,label,value);
}
const attrs=(r:AdmissionReaderRow)=>admissionFactAttributes(r);
const title=(id:string,text:string)=>`<h3 id="${id}">${esc(text)}</h3>`;
const paragraph=(r:AdmissionReaderRow)=>`<p ${attrs(r)}>${esc(r.value)}</p>`;
const sources=(ids:string[])=>sourceList(canonical.sources.filter(s=>ids.includes(s.id)).map(s=>({id:s.id,url:s.url,title:`${s.title}${s.pages?`（${Array.isArray(s.pages)?`PDF内p.${s.pages.join('・')}`:`参照箇所：${s.pages}`}）`:''}／確認日 ${s.retrievedAt.slice(0,10)}`})));
const section=(id:string,text:string,body:string)=>`<section class="admission-readable-scheme" data-admission-scheme="${id}"><h2 id="kagawa-${id}">${esc(text)}</h2>${body}</section>`;
const pointConditions=(r:AdmissionReaderRow)=>({...r,value:r.value.replace(/^\d+点。/u,'').replace(/^2科目合計\d+点。/u,'')});
const cells=(r:AdmissionReaderRow,values:string[])=>`<tr ${attrs(r)}>${values.map((v,i)=>`<${i?'td':'th scope="row"'}>${esc(v)}</${i?'td':'th'}>`).join('')}</tr>`;
const numericTable=(caption:string,headers:string[],rows:{fact:AdmissionReaderRow,values:string[]}[],kind='scores')=>`<table data-admission-table="${kind}" class="admission-scores-table"><caption>${esc(caption)}</caption><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>cells(r.fact,r.values)).join('')}</tbody></table>`;
const scopedTableStyles='<style>.article-content .kagawa-readable table:not(.admission-overview-table) tr > :first-child{width:29%}.article-content .kagawa-readable table:not(.admission-overview-table) tr > :last-child{width:71%}.article-content .kagawa-readable .admission-scores-table tr:has(> :nth-child(3)) > :nth-child(2),.article-content .kagawa-readable .admission-scores-table tr:has(> :nth-child(3)) > :nth-child(3){width:35.5%}</style>';

export const kagawaMetadata={
  title:'香川大学医学部｜2027年度入試情報',
  displayTitle:'香川大学 医学部2027年度入試情報',
  displayTitleLines:['香川大学 医学部','2027年度入試情報'],
  description:'香川大学医学部医学科の2027年度入試を方式別に紹介。募集人数、出願・試験日程、科目・配点、会場、地域枠の勤務義務、所在地・アクセスと2026年度医学科入学者の男女比を掲載します。',
  lead:'香川大学医学部医学科の2027年度入試について、日程、会場、科目、時間、配点、出題範囲と出願条件を方式別にまとめています。募集人数は調整中の項目があり、一般選抜の試験時刻などは未公表です。出願前に大学公式の募集要項と変更通知をご確認ください。',
  modified:canonical.verifiedAt.slice(0,10),
  keyPoints:[
    '一般前期は2027年2月25日・26日。共通テスト720点と個別試験700点の計1,420点で、情報Ⅰは20点です。',
    '推薦の総合問題・面接は2026年11月21日。総合問題300点・面接150点の計450点で、2027年1月の共通テストも必要です。',
    '地域枠は県内高校・地域医療セミナー等の条件に加え、修学資金と卒業後9年間の勤務に関する要件があります。'
  ]
};

function overview() {
  const entries=[
    ['general-early','一般前期','70人（調整予定・要確認）','2027年1月25日～2月3日','2027年2月25日・26日',2,5],
    ['general-regional','一般前期・地域枠','調整中・要確認（2027年度人数は未公表）','2027年1月25日～2月3日','2027年2月25日・26日',2,5],
    ['recommendation-ii','学校推薦型Ⅱ','調整予定・要確認','2026年11月2日～9日','2026年11月21日',3,7],
    ['recommendation-regional','推薦Ⅱ・地域枠','調整予定・要確認','2026年11月2日～9日','2026年11月21日',4,8],
    ['international-baccalaureate','国際バカロレア（IB）','若干人（一般の内数）','2027年1月25日～2月3日','2027年2月25日・26日',3,6],
    ['international-private','私費外国人留学生','若干人（一般の内数）','2027年1月5日～8日','2027年2月25日・26日',2,5]
  ] as const;
  return `<h2 id="kagawa-overview">入試方式・募集人数・主要日程</h2>${paragraph(row(['coverage/0','general-early/note/0']))}<table class="admission-overview-table" data-admission-table="overview"><caption>2027年度医学科・6方式の主な日程</caption><thead><tr><th scope="col">入試方式</th><th scope="col">募集人数</th><th scope="col">出願</th><th scope="col">個別試験</th></tr></thead><tbody>${entries.map(([id,label,quota,dates,exams,di,ei])=>`<tr ${attrs(row([origin(id,'schedule',di),origin(id,'schedule',ei)]))}><th scope="row"><a href="#kagawa-${id}">${esc(label)}</a></th><td ${attrs(row([origin(id,'schedule',0),...(['international-baccalaureate','international-private'].includes(id)?['coverage/2']:[])]))}>${esc(quota)}</td><td>${esc(dates)}</td><td>${esc(exams)}</td></tr>`).join('')}</tbody></table>${conditions([row(['coverage/1','recommendation-ii/schedule/0','recommendation-regional/schedule/0'],'推薦の募集人数'),row(['general-early/schedule/0'],'一般前期の内数','IB・私費外国人留学生選抜の若干人は一般前期の募集人数の内数です。'),row(['coverage/4'],'2027年度の変更')])}${sources(['selection-2027','recommendation-2027','recommendation-outline','quota-notice-2027','recommendation-change','information-use-2027','selection-index'])}`;
}
function general() {
  const id='general-early';
  const scores=numericTable('一般前期（通常枠・地域枠）の配点',['教科・試験','共通テスト','個別試験'],[
    {fact:merged(id,'exam',1),values:['国語','200','課さない']},
    {fact:merged(id,'exam',1),values:['地歴公民','100','課さない']},
    {fact:merged(id,'exam',2),values:['数学','100（ⅠA50・ⅡBC50）','200']},
    {fact:row([id+'/exam/2','general-regional/exam/2',id+'/exam/6','general-regional/exam/6']),values:['理科2科目','200（各100）','200']},
    {fact:row([id+'/exam/3','general-regional/exam/3',id+'/exam/7','general-regional/exam/7']),values:['外国語','100','200（英語）']},
    {fact:merged(id,'exam',3),values:['情報Ⅰ','20','課さない']},
    {fact:merged(id,'exam',8),values:['面接','課さない','100']},
    {fact:row([id+'/exam/0','general-regional/exam/0',id+'/exam/8','general-regional/exam/8']),values:['各試験の合計','720','700']},
    {fact:merged(id,'exam',8),values:['総合計','1,420（共通＋個別）','']}
  ]);
  return section(id,'一般選抜（前期・通常枠／地域枠）',
    title('kagawa-general-dates','一般前期の出願・試験・手続日程')+
    table('一般前期の日程（地域枠も共通）',[2,4,5,7,8].map(i=>merged(id,'schedule',i)))+
    conditions([row([id+'/schedule/3','general-regional/schedule/3','coverage/3'],'Web登録・検定料・書類締切の詳細','未公表。Web登録・検定料支払い・郵送書類の締切時刻と必着／消印条件は、2026年11月上旬に公開予定の一般選抜募集要項の公開後に更新します。'),merged(id,'schedule',6)])+
    title('kagawa-general-eligibility','一般前期の出願資格・事前審査')+
    conditions([fact(id,'schedule',1),fact(id,'schedule',9)])+
    title('kagawa-general-scores','一般前期の科目・配点・選抜条件')+scores+
    conditions([
      merged(id,'exam',0,'共通テストの科目','6教科8科目。国語、地歴公民1、数学ⅠA・ⅡBC、理科2、外国語1、情報Ⅰ。'),
      merged(id,'exam',1,'地歴公民の選択',scheme(id).examRows[1].value.split('。').slice(2).join('。')),
      merged(id,'exam',2,'共通テストの理科','物理・化学・生物から2科目。'),
      merged(id,'exam',3,'外国語の選択・英語換算','英語・独語・仏語・中国語・韓国語から1科目。英語はリーディング80点・リスニング20点（大学入試センターのリスニング免除者はリーディング100点）。'),
      merged(id,'exam',4),pointConditions(merged(id,'exam',5)),pointConditions(merged(id,'exam',6)),pointConditions(merged(id,'exam',7)),
      merged(id,'exam',8,'面接でみること','医師・医学研究者としての適性を評価します。'),merged(id,'exam',9)
    ])+
    title('kagawa-general-venue','一般前期の会場・受験票')+table('一般前期の会場',[0,1].map(i=>merged(id,'venue',i)),'venue')+
    `<section data-admission-scheme="general-regional">${title('kagawa-general-regional','一般地域枠の追加条件・併願')}${conditions([fact('general-regional','schedule',1),fact('general-regional','exam',10),fact('general-regional','note',0)])}</section>`+
    sources(['selection-2027','general-index','venue-2027','quota-notice-2027']));
}
function recommendation() {
  const id='recommendation-ii';
  return section(id,'学校推薦型選抜Ⅱ（通常枠／地域枠）',
    title('kagawa-recommendation-dates','推薦Ⅱの出願・試験・手続日程')+
    table('推薦Ⅱの日程（地域枠も共通）',[3,4,5,6,7,8,9,10].map(i=>merged(id,'schedule',i)))+
    conditions([merged(id,'schedule',11,'出願成立には3つすべて必要')])+
    title('kagawa-recommendation-eligibility','推薦Ⅱの資格・履修・推薦人数')+
    conditions([merged(id,'schedule',1),merged(id,'schedule',2),fact(id,'note',0),fact(id,'note',1)])+
    title('kagawa-recommendation-scores','推薦Ⅱの科目・配点・受験条件')+
    numericTable('推薦Ⅱの個別試験配点',['試験','配点'],[
      {fact:merged(id,'exam',3),values:['総合問題','300']},
      {fact:merged(id,'exam',4),values:['面接','150']},
      {fact:merged(id,'exam',4),values:['合計','450']}
    ])+
    conditions([merged(id,'exam',0),merged(id,'exam',1),merged(id,'exam',2),
      merged(id,'exam',3,'総合問題の内容','Ⅰは英語、Ⅱは日本語による理科系論述（3題から2題選択）。Ⅰ・Ⅱとも75分。2027年度から小論文の名称を「総合問題」に変更。'),
      merged(id,'exam',4,'面接の資料','志望理由書・推薦書・調査書を面接の重要資料として使用します。'),merged(id,'exam',5),
      row([id+'/exam/6','recommendation-regional/exam/7'])])+
    title('kagawa-recommendation-venue','推薦Ⅱの試験会場・書類提出先')+table('推薦Ⅱの会場・提出先',[0,1].map(i=>merged(id,'venue',i)),'venue')+
    `<section data-admission-scheme="recommendation-regional">${title('kagawa-recommendation-regional','推薦地域枠の追加条件・県面接')}${conditions([fact('recommendation-regional','schedule',1),fact('recommendation-regional','exam',6),fact('recommendation-regional','note',0)])}</section>`+
    sources(['recommendation-2027','recommendation-consent','recommendation-change','information-use-2027','information-score-notice']));
}
function ib() {
  const id='international-baccalaureate';
  return section(id,'国際バカロレア（IB）選抜',
    title('kagawa-ib-dates','IB選抜の出願・試験・手続日程')+
    table('IB選抜の日程',[3,4,5,6,7,8,9].map(i=>fact(id,'schedule',i)))+
    title('kagawa-ib-eligibility','IB選抜の資格・履修・成績条件')+conditions([fact(id,'schedule',1),fact(id,'schedule',2)])+
    title('kagawa-ib-scores','IB選抜の科目・配点・出題範囲')+
    numericTable('IB選抜の配点',['試験','配点'],[
      {fact:fact(id,'exam',1),values:['数学','200']},{fact:fact(id,'exam',2),values:['理科2科目','200']},
      {fact:fact(id,'exam',3),values:['英語','200']},{fact:fact(id,'exam',4),values:['面接（日本語）','100']},
      {fact:fact(id,'exam',4),values:['合計','700']}
    ])+
    conditions([fact(id,'exam',0),...[1,2,3].map(i=>pointConditions(fact(id,'exam',i))),
      fact(id,'exam',4,'書類審査','書類提出は必須ですが、点数化しません。'),fact(id,'exam',5)])+
    title('kagawa-ib-venue','IB選抜の試験会場・書類提出先')+table('IB選抜の会場・提出先',[0,1].map(i=>fact(id,'venue',i)),'venue')+
    title('kagawa-ib-application','IB選抜の併願・課題論文・英語資料')+conditions([fact(id,'note',0),fact(id,'note',1)])+sources(['ib-2027','selection-2027']));
}
function international() {
  const id='international-private';
  return section(id,'私費外国人留学生選抜',
    title('kagawa-international-dates','私費外国人の出願・試験・手続日程')+
    table('私費外国人留学生選抜の日程',[2,3,5,6,7,8].map(i=>fact(id,'schedule',i)))+
    title('kagawa-international-eligibility','私費外国人の出願資格・事前審査')+conditions([fact(id,'schedule',1),fact(id,'schedule',4)])+
    title('kagawa-international-exams','私費外国人の指定試験・出題範囲')+
    table('私費外国人の指定試験・科目',[0,1,2,3,4].map(i=>fact(id,'exam',i)),'exam')+
    conditions([fact(id,'exam',5),fact(id,'exam',6),fact(id,'exam',7)])+
    title('kagawa-international-venue','私費外国人の試験会場・書類提出先')+table('私費外国人の会場・提出先',[0,1].map(i=>fact(id,'venue',i)),'venue')+
    title('kagawa-international-documents','私費外国人の受験票・翻訳・併願')+conditions([0,1,2].map(i=>fact(id,'note',i)))+sources(['international-2027','selection-2027']));
}
export function renderKagawaAdmissionsReadable(_input:UniversityAdmissions) {
  const html=`<section class="admission-readable kagawa-readable" data-university-admissions-year="2027">${scopedTableStyles}${overview()}${general()}${recommendation()}${ib()}${international()}<h2 id="kagawa-regional-obligations">推薦地域枠の勤務義務・離脱条件</h2>${conditions([fact('recommendation-regional','note',1),fact('recommendation-regional','note',2)])}${sources(['recommendation-consent'])}<h2 id="kagawa-fee-exemption">被災者の検定料免除</h2>${conditions([5,6,7].map(i=>row(['coverage/'+i],i===5?'対象条件':i===6?'出願前の申請':'不許可・納付後の返還')))}${sources(['examination-fee-exemption'])}</section>`;
  return html.replace(/(<table class="admission-overview-table"[\s\S]*?<\/table>)/u,table=>table.replace(/<td([^>]*)>([^<]*)<\/td><td>([^<]*)<\/td><td>([^<]*)<\/td>/gu,'<td$1 data-label="募集人数"><span class="admission-mobile-label">募集人数</span>$2</td><td data-label="出願"><span class="admission-mobile-label">出願</span>$3</td><td data-label="個別試験"><span class="admission-mobile-label">個別試験</span>$4</td>'));
}
export function renderKagawaUniversityOverview() {
  const basic=(i:number)=>row(['basic/'+i]);
  return `<section class="admission-readable kagawa-readable"><h2 id="kagawa-basic">大学基本情報</h2>${title('kagawa-access','所在地・入試窓口・アクセス')}${table('医学科と大学本部の所在地・アクセス',[0,1,2,3].map(basic),'basic')}${sources(['medicine-access','international-2027','ib-2027'])}${title('kagawa-statistics','医学科入学者の男女比・現役既卒別')}${numericTable('2026年度／医学科入学者／106人（2026年5月1日現在）',['区分','人数','割合'],[
  {fact:basic(4),values:['男性','52人','49.1%']},{fact:basic(4),values:['女性','54人','50.9%']},{fact:basic(4),values:['合計','106人','100%']}
],'statistics')}${paragraph(basic(5))}${sources(['overview-index','outline-data-2026','statistics-index','statistics-2026'])}${title('kagawa-tuition','2027年度入学者の学費・減免制度')}${conditions([basic(6),basic(7)])}${sources(['recommendation-2027','international-2027','tuition-revision-announcement','tuition-revision-2027','tuition-exemption'])}</section>`;
}
