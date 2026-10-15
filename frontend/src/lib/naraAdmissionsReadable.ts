import type {UniversityAdmissions} from './universityAdmissions.ts';
import canonical from '../data/universityAdmissions/nara.json' with {type:'json'};
import {admissionFactAttributes as attrs, renderAdmissionReaderTable as sharedTable, renderAdmissionReaderConditions as conditions, renderAdmissionReaderSources as sources} from './admissionsReaderPrimitives.ts';
import type {AdmissionReaderRow} from './admissionsReaderPrimitives.ts';

export function naraAdmissionsMetadata(data:UniversityAdmissions) {
 return {title:'奈良県立医科大学医学部｜2027年度入試情報',displayTitle:'奈良県立医科大学 医学部2027年度入試情報',displayTitleLines:['奈良県立医科大学 医学部','2027年度入試情報'],modified:data.verifiedAt.slice(0,10),description:'奈良県立医科大学医学科の2027年度入試。一般前期22人・後期53人、推薦2方式の予定人数、日程、科目・配点、出願条件、地域医療の要件と2026年度医学科入学者統計を掲載します。',lead:'奈良県立医科大学医学部医学科の2027年度入試について、方式別の日程、科目・配点、出題範囲と出願条件をまとめています。会場などの未公表事項は正式募集要項・受験案内の公開後に更新します。出願前には大学の正式資料と変更通知をご確認ください。',keyPoints:['一般前期は22人、個別試験は2027年2月25日・26日の小論文と面接。共通テスト900点＋小論文100点で判定します。','一般後期は53人、個別試験は2027年3月12日・13日の数学・英語・理科2科目と面接。共通テストを300点に換算し、個別学科900点と合わせます。','推薦は緊急医師確保15人・地域枠20人の予定。学校長推薦と入学確約が必要で、学科試験・面接は2027年1月30日・31日です。']};
}

const ids=['recommendation-emergency','recommendation-region','general-early','general-late'];
const [emergency,region,early,late]=ids;
const names=['学校推薦型選抜・緊急医師確保','学校推薦型選抜・地域枠','一般選抜・前期','一般選抜・後期'];
export function renderNaraAdmissionsReadable(data:UniversityAdmissions):string {
 if(data.path!==canonical.path||data.schemes.map(s=>s.id).join(',')!==ids.join(','))throw new Error('Nara requires its four reviewed routes');
 const used=new Set<string>();
 const table=(caption:string,rows:AdmissionReaderRow[],kind='schedule')=>sharedTable(caption,rows,kind).replace('<table ','<table class="admission-dates-table nara-fact-table" ');
 const row=(origin:string):AdmissionReaderRow=>{
  const [id,kind,index]=origin.split('/');
  if(id==='coverage')return {label:'',value:data.coverageNotes[Number(kind)],origins:[origin],sourceIds:['selection-2027','guide-index']};
  if(id==='basic')return {...canonical.basicInfoRows[Number(kind)],origins:[origin]};
  const s=data.schemes.find(s=>s.id===id)!;
  const r=kind==='note'?s.notes[Number(index)]:kind==='exam'?s.examRows[Number(index)]:kind==='schedule'?s.scheduleRows[Number(index)]:s.venueRows[Number(index)];
  if(!r)throw new Error(`Missing Nara fact ${origin}`);
  return {label:'text' in r?'':r.label,value:'text' in r?r.text:r.value,sourceIds:r.sourceIds,origins:[origin]};
 };
 const claim=(origins:string[])=>{
  for(const o of origins){if(used.has(o))throw new Error(`Duplicate Nara origin ${o}`);used.add(o);}
  return attrs({label:'',value:'',origins,sourceIds:[...new Set(origins.flatMap(o=>row(o).sourceIds))]});
 };
 const group=(origins:string[],html:string)=>`<div class="admission-fact-group" ${claim(origins)}>${html}</div>`;
 const r=(id:string,kind:string,n:number)=>`${id}/${kind}/${n}`;
 const all=(kind:string,n:number)=>ids.map(id=>r(id,kind,n));
 const rec=(kind:string,n:number)=>[emergency,region].map(id=>r(id,kind,n));
 const gen=(kind:string,n:number)=>[early,late].map(id=>r(id,kind,n));
 const c=(label:string,value:string):AdmissionReaderRow=>({label,value,origins:[],sourceIds:[]});
 const panel=(sourceIds:string[])=>sources(canonical.sources.filter(s=>sourceIds.includes(s.id)).map(s=>({...s,title:`${s.title}${'pages' in s&&s.pages?`（PDF ${s.pages.join('・')}頁）`:''}／確認 ${s.retrievedAt.slice(0,10)}`})));
 const paragraph=(label:string,value:string)=>conditions([c(label,value)]);
 const overview=group([...all('exam',0),...rec('note',1),'coverage/0','coverage/1','coverage/3'],`
 <h3 id="admission-overview">入試方式・募集人数・主要日程</h3><p>医学科の初年次入学を対象に、次の4方式を掲載しています。看護学科・大学院・第2年次編入学は、それぞれの専用案内をご確認ください。</p>
 <table class="admission-overview-table"><caption class="admission-sr-only">2027年度 医学科の募集人数・出願書類受付・個別試験</caption><thead><tr>${['方式','募集人数','出願書類の受付','個別試験'].map(t=>`<th scope="col">${t}</th>`).join('')}</tr></thead><tbody>${ids.map((id,i)=>`<tr><th scope="row"><a href="#admission-${id}">${names[i]}</a></th>${[[15,20,22,53][i]+'人'+(i<2?'（予定）':''),i<2?'2026年12月16日～18日':'2027年1月25日～2月3日',i<2?'2027年1月30日・31日':i===2?'2027年2月25日・26日':'2027年3月12日・13日'].map((v,j)=>`<td><span class="admission-mobile-label" aria-hidden="true">${['募集人数','出願書類の受付','個別試験'][j]}</span>${v}</td>`).join('')}</tr>`).join('')}</tbody></table>
 <p>推薦の臨時定員は国の正式通知前です。推薦全体の減員や、緊急医師確保・地域枠間の人数配分変更があり得ます。前期の合格者が募集人数に満たない場合は、不足数を後期の募集人数に加えることがあります。</p>${panel(['selection-2027','guide-index'])}`);
 const ctOrigins=[...all('schedule',0),r(emergency,'exam',7),r(region,'exam',8),...gen('exam',3),...[8,9,10,11,12,13].flatMap((n,i)=>[r(emergency,'exam',n),r(region,'exam',n+1),r(early,'exam',i+4),r(late,'exam',i+4)])];
 const ct=group(ctOrigins,`<h3 id="admission-common-test">全方式の共通テスト・科目選択</h3><p>本試験は2027年1月16日（土）・17日（日）。全方式で指定の6教科8科目すべての受験が必要です。</p>${table('共通テストの教科・科目と大学換算配点',[
 c('国語','「国語」必須。100点（得点を1/2倍）。'),
 c('地理歴史・公民','「地理総合，地理探究」「歴史総合，日本史探究」「歴史総合，世界史探究」「公共，倫理」「公共，政治・経済」から1科目。2科目受験時は第1解答科目を採用。50点（得点を1/2倍）。'),
 c('数学','「数学Ⅰ，数学A」「数学Ⅱ，数学B，数学C」の両方が必須。合計200点。'),
 c('理科','「物理」「化学」「生物」から2科目。合計300点（得点を3/2倍）。'),
 c('外国語','一般前期は英語のみ。推薦2方式・一般後期は英語、ドイツ語、フランス語、中国語、韓国語から1科目。200点。'),
 c('情報','「情報Ⅰ」必須。50点（得点を1/2倍）。')
 ],'scores')}${paragraph('英語の換算・リスニング免除','英語選択者はリスニングも必須。リーディング100点を150点、リスニング100点を50点に換算します。聴覚障がい等によるリスニング免除者は、リーディング100点を200点に換算します。')}${panel(['selection-2027','common-test-2027'])}`);
 const final=group([r(emergency,'exam',14),r(region,'exam',15),...gen('exam',10),r(emergency,'exam',20),r(region,'exam',21),r(early,'exam',14),r(late,'exam',16)],`<h3 id="admission-final-scores">最終判定の配点</h3>${table('方式別の共通テスト換算・個別試験・総点',[
 c('推薦2方式','共通テストの科目別換算計900点をさらに1/2倍して450点＋個別学科450点＝学力計900点。面接、学校長推薦書、調査書、志望理由書も含めて総合判定。'),
 c('一般前期','共通テスト900点＋小論文100点＝計1,000点。面接と調査書も含めて総合判定。'),
 c('一般後期','共通テストの科目別換算計900点をさらに1/3倍して300点＋個別学科900点＝計1,200点。面接と調査書も含めて総合判定。')
 ],'scores')}${panel(['selection-2027'])}`);
 const unknownOrigins=[...all('schedule',1),...all('schedule',2),...all('schedule',4),...rec('schedule',8),...gen('schedule',9),...all('venue',0),...all('venue',1),...gen('schedule',5),...rec('exam',3),r(emergency,'exam',6),r(region,'exam',7),...gen('exam',2),...all('note',0),'coverage/2'];
 const unknown=group(unknownOrigins,`<h3 id="admission-pending">出願の共通条件・募集要項の公開予定</h3><p>正式学生募集要項は推薦が2026年11月中旬、一般が12月上旬の公表予定です。次の細目は未公表のため、公開後に更新します。</p>${conditions([
 c('Web登録','全方式でインターネット出願サイトへの事前登録が必要です。登録開始日と締切日時は未公表。'),
 c('検定料と出願書類','検定料の金額・支払方法・期限、出願書類の具体的な郵送先・封筒指定は未公表。'),
 c('書類提出の細目','全方式の書類は郵送のみ・必着（持参不可）です。到着締切時刻と消印有効の例外条件は未公表。'),
 c('試験会場・第1段階結果','具体的な試験会場・試験室・集合場所は全方式で未公表。一般選抜の第1段階選抜結果の発表日・時刻・確認方法も未公表。正式受験案内で確認してください。'),
 c('入学手続','全方式の入学手続期間・締切日時は未公表。必要書類と方法は正式募集要項で確認してください。'),
 c('推薦・併願の細目','推薦の評定平均・高校別推薦人数、推薦2方式間や他大学との併願条件、一般前期・後期等の併願条件の細目は未公表。')
 ])}${panel(['selection-2027','guide-index'])}`);
 const recDates=group([...rec('schedule',3),...rec('schedule',5),...rec('schedule',6),...rec('schedule',7)],`<h3 id="admission-recommendation-dates">推薦2方式の日程</h3>${table('緊急医師確保・地域枠に共通の日程',[
 c('出願書類','2026年12月16日（水）～18日（金）。郵送のみ・必着。'),
 c('学科試験','2027年1月30日（土）9:00～12:00。数学・英語・理科1科目を同じ180分で解答。'),
 c('面接','2027年1月31日（日）。時間は志願者に別途指定。'),
 c('合格発表','2027年2月9日（火）予定。正式募集要項で詳細を確認してください。')
 ])}${panel(['selection-2027'])}`);
 const recQual=group([...rec('exam',1),...rec('exam',2),r(emergency,'exam',4),r(region,'exam',4),r(region,'exam',5)],`<h3 id="admission-recommendation-qualification">推薦の資格・地域医療の要件</h3>${paragraph('2方式共通の必須要件','高等学校（中等教育学校を含む）長が責任をもって推薦でき、2027年3月卒業見込み、または2025年3月以降の卒業者であること。指定の共通テストをすべて受験し、合格時に本学へ入学することを確約する必要があります。')}<h4 id="admission-${emergency}" class="admission-group-title">緊急医師確保の出願要件</h4>${paragraph('卒後に希望する医療従事','知事が貸与を受ける者ごとに指定する医療機関の特定診療科等・特定専攻課程、またはへき地医療機関で医療に従事することを希望する必要があります。県の緊急医師確保修学資金貸与条例・施行規則に基づく要件です。')}<h4 id="admission-${region}" class="admission-group-title">地域枠の出願要件</h4>${paragraph('学校・住所の条件','共通の卒業時期要件に加え、奈良県内の高等学校等の卒業・卒業見込み、または本人・一親等の親族・本人の配偶者のいずれかが出願開始日の1年前から引き続き奈良県内に住所を有することが必要です。')}${paragraph('卒業後の意思','奈良県内の地域医療に貢献しようとする強い意欲が必要です。')}${panel(['selection-2027'])}`);
 const recIndividual=group([r(emergency,'exam',16),r(region,'exam',17),r(emergency,'exam',17),r(region,'exam',18),r(emergency,'exam',18),r(region,'exam',19)],`<h3 id="admission-recommendation-subjects">推薦の個別科目・出題範囲</h3>${table('推薦2方式の個別学科試験',[
 c('数学','150点。数学Ⅰ・Ⅱ・Ⅲ・Aは全範囲、数学Bは数列、数学Cはベクトル・平面上の曲線と複素数平面。'),
 c('英語','150点。英語コミュニケーションⅠ・Ⅱ・Ⅲ、論理・表現Ⅰ・Ⅱ・Ⅲ。個別試験の外国語は英語。'),
 c('理科','150点。物理基礎・物理、化学基礎・化学、生物基礎・生物から1科目。')
 ],'scores')}${panel(['selection-2027'])}`);
 const recEvaluation=group([r(emergency,'exam',15),r(region,'exam',16),r(emergency,'exam',19),r(region,'exam',20)],`${paragraph('推薦2方式の面接・第1段階選抜','推薦では第1段階選抜を実施しません。面接の配点はなく、アドミッション・ポリシーに照らして人物面を評価します。規定時間内で判断が難しい場合は再面接を行うことがあります。適性を欠くと判断された場合は、共通テスト・学科試験の成績にかかわらず不合格です。')}${paragraph('緊急医師確保の面接','県内医療への熱意や、へき地への定着等も評価します。制度理解が不足すると判断された場合も、共通テスト・学科試験の成績にかかわらず不合格です。')}${panel(['selection-2027'])}`);
 const generalQualification=group([...gen('exam',1),...gen('schedule',12)],`<h3 id="admission-general-qualification">一般選抜の出願資格・資格審査</h3>${paragraph('前期・後期に共通','高等学校等の卒業・2027年3月卒業見込み、高卒認定合格など、選抜要項の出願資格8区分のいずれかに該当し、指定の共通テストをすべて受験することが必要です。')}${paragraph('個別入学資格審査（出願資格8）','共通テスト出願のための申請期限は2026年8月17日（月）。他大学の資格審査認定で共通テストを受験して本学へ出願する場合は2027年1月4日（月）です。')}${panel(['selection-2027'])}`);
 const generalRoutes=[early,late].map((id,i)=>{
  const dates=group([3,6,7,8].map(n=>r(id,'schedule',n)),table(`${names[i+2]}の出願・試験日程`,[
   c('出願書類','2027年1月25日（月）～2月3日（水）。郵送のみ・必着。'),
   c(i===0?'小論文':'学科試験',i===0?'2027年2月25日（木）9:30～11:30（120分）。':'2027年3月12日（金）。理科9:00～12:00（180分）、数学13:00～15:00（120分）、英語15:45～17:30（105分）。'),
   c('面接',i===0?'2027年2月26日（金）。時間は志願者に別途指定。':'2027年3月13日（土）。時間は志願者に別途指定。'),
   c('合格発表',i===0?'2027年3月9日（火）予定。':'2027年3月23日（火）予定。')
  ]));
  const gate=group([r(id,'exam',11),r(id,'note',1)],paragraph('第1段階選抜',i===0?'大学換算した共通テストが概ね730点／900点（概ね81％）以上であることが必要です。基準を満たす者が15倍（330人）を超えた場合は上位330人であることも必要。志願者数にかかわらず、得点基準を満たさなければ不合格です。':'志願者数が募集人数の12倍（636人）を超える場合、大学換算した共通テストの成績により実施することがあります。'));
  const individual=i===0?group([r(id,'exam',12)],table('一般前期の小論文',[
   c('配点','100点。'),c('出題・評価','医療に限らない広い分野の和文課題文2題。論理的思考力、着想力・構想力、説明力・表現力、文章構成力を評価。'),c('得点の目安','基準60点。優（上位2％程度）は20点以上を加点、良（優に次ぐ上位2％程度）は10点を加点。評価4項目の多くで劣る場合は減点。')
  ],'scores')):group([12,13,14].map(n=>r(id,'exam',n)),table('一般後期の個別学科試験',[
   c('数学','225点。数学Ⅰ・Ⅱ・Ⅲ・Aは全範囲、数学Bは数列、数学Cはベクトル・平面上の曲線と複素数平面。'),c('英語','225点。英語コミュニケーションⅠ・Ⅱ・Ⅲ、論理・表現Ⅰ・Ⅱ・Ⅲ。'),c('理科','450点。物理基礎・物理、化学基礎・化学、生物基礎・生物から2科目。')
  ],'scores'));
  const interview=group([r(id,'exam',i===0?13:15)],paragraph('面接の評価','配点はなく、アドミッション・ポリシーに照らして人物面を評価します。規定時間内で判断が難しい場合は再面接を行うことがあります。適性を欠くと判断された場合は、共通テスト・'+(i===0?'小論文':'学科試験')+'の成績にかかわらず不合格です。'));
  return `<section class="admission-readable-scheme" data-admission-scheme="${id}"><h3 id="admission-${id}">${names[i+2]}の日程・選抜</h3>${dates}${gate}${individual}${interview}${panel(['selection-2027'])}</section>`;
 }).join('');
 const consultation=group([...rec('schedule',9),...gen('schedule',10),...rec('schedule',10),...gen('schedule',11)],`<h3 id="admission-consultation">障がい等による配慮の事前相談</h3>${table('医学科の配慮申請期限',[
 c('学校推薦型選抜','2026年11月16日（月）必着。'),c('一般選抜','2026年12月14日（月）必着。')
 ])}${paragraph('申請方法・書類','所定の配慮申請書と障がい等の内容が分かる診断書（コピー可）を、簡易書留で医学科入学試験担当へ送付してください。必要に応じて本人または本人の立場を代弁し得る方との面談があります。')}${paragraph('共通テストの配慮通知書','別掲の事前相談案内は「令和9年度」の受験上の配慮事項審査結果通知書（コピー可）を提出書類に挙げています。一方、選抜要項の別紙は「令和8年度」と記載しています。必要な通知書の年度と提出書類は、申請前に医学科入学試験担当へ確認してください。')}${panel(['selection-2027','pre-consultation-2027'])}`);
 const institution=group([r(emergency,'exam',5),r(region,'exam',6)],`<h3 id="admission-regional-system">緊急医師確保の修学資金制度</h3><p>緊急医師確保の修学資金制度について、県の現行制度資料・条例・規則は公表されています。2027年度入学者に適用される個別の貸与額・勤務期間・返還起算日・免除条件は、今後の大学の正式募集要項と県の制度資料を合わせて確認してください。</p><p>地域枠に適用される制度の詳細は、地域枠の正式募集要項の公開後に更新します。</p>${panel(['selection-2027','guide-index','county-emergency-current','county-ordinance-current','county-rules-current','county-work-guidelines-current'])}`);
 const basicRows=[0,1,2,3].map(i=>{const b=row(`basic/${i}`);return {...b,origins:[],value:b.value};});
 const location=group([...all('venue',2),...[0,1,2,3].map(i=>`basic/${i}`)],`<h3 id="admission-campus">所在地・アクセス・問い合わせ</h3>${conditions(basicRows)}${panel(['access-index','new-campus','selection-2027'])}`);
 const statsTable=(caption:string,rows:[string,number,string?][])=>`<table class="admission-score-table"><caption>${caption}・総人数111人</caption><thead><tr><th scope="col">区分</th><th scope="col">人数</th><th scope="col">割合</th></tr></thead><tbody>${rows.map(([label,n,origin])=>`<tr${origin?' '+claim([origin]):''}><th scope="row">${label}</th><td>${n}人</td><td>${(n/111*100).toFixed(1)}％</td></tr>`).join('')}<tr><th scope="row">合計</th><td>111人</td><td>100％</td></tr></tbody></table>`;
 const statistics=group(['basic/8'],`<h3 id="admission-entrants">2026年度医学科入学者の内訳</h3>${statsTable('2026年度 医学科入学者の男女別',[['男子',74,'basic/4'],['女子',37,'basic/5']])}${statsTable('2026年度 医学科入学者の高校卒業状況',[['高校卒業見込者',58,'basic/6'],['高校卒業者',53,'basic/7'],['その他',0]])}<p>一般選抜と学校推薦型選抜の「入学者」欄を合算しています。割合は表の総人数を母数に小数第1位へ四捨五入しました。高校卒業状況は大学公式資料の分類です。</p>${panel(['results-index','results-2026-general','results-2026-recommendation'])}`);
 const expected=data.schemes.flatMap(s=>[['schedule',s.scheduleRows],['exam',s.examRows],['venue',s.venueRows],['note',s.notes]].flatMap(([kind,rows])=>(rows as unknown[]).map((_,i)=>`${s.id}/${kind}/${i}`))).concat(data.coverageNotes.map((_,i)=>`coverage/${i}`),canonical.basicInfoRows.map((_,i)=>`basic/${i}`));
 if(expected.some(o=>!used.has(o))||used.size!==expected.length)throw new Error(`Nara origin coverage: ${expected.filter(o=>!used.has(o)).join(',')}`);
 return `<h2 id="最新の入試情報">2027年度の入試情報</h2><section class="admission-readable nara-readable" data-admissions-presentation="nara-readable-v1" data-university-admissions-year="2027">${overview}${ct}${final}${unknown}${generalQualification}${generalRoutes}${recDates}${recQual}${recIndividual}${recEvaluation}${institution}${consultation}</section><h2 id="大学基本情報">大学基本情報</h2><section class="admission-readable nara-readable">${location}${statistics}</section>`;
}
