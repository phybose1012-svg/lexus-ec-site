import raw from '../data/universityAdmissions/kurume.json' with {type:'json'};
import type {UniversityAdmissions} from './universityAdmissions.ts';
import {admissionFactAttributes as attrs,escapeAdmissionText as esc,renderAdmissionReaderTable as table,renderAdmissionReaderConditions as conditions,renderAdmissionReaderSources as sources} from './admissionsReaderPrimitives.ts';
import type {AdmissionReaderRow as Row} from './admissionsReaderPrimitives.ts';

export const kurumeMetadata={
 title:'久留米大学医学部｜2027年度入試情報',displayTitle:'久留米大学 医学部2027年度入試情報',displayTitleLines:['久留米大学 医学部','2027年度入試情報'],
 description:'久留米大学医学部医学科2027年度の8方式。出願・試験・手続日程、科目・配点、推薦の条件、福岡県枠の奨学金と勤務義務、自己推薦の資格審査、会場・アクセス・在籍学生統計を掲載。',
 lead:'久留米大学医学部医学科の2027年度入試を、推薦型3方式・自己推薦・一般前期と後期・共通テスト利用A日程とB日程に分けてまとめます。日程、会場、科目・時間・配点・出題範囲、出願資格と大学基本情報を掲載しています。出願前に当該年度の正式募集要項と変更通知をご確認ください。',
 keyPoints:[
  '一般前期は約67人、後期は約5人。共通テスト利用Aは約5人・Bは約3人で、どちらも医学科では小論文・面接の二次試験があります。',
  '推薦等4方式は2026年11月14日に試験。Web登録・支払は11月5日23:59、書類は11月6日必着です。自己推薦は出願前の資格審査が必要です。',
  '大学特別枠は県内で臨床研修2年後に大学病院で4年勤務。福岡県枠は奨学金への応募と、通常9年の県内指定診療科での勤務などが条件です。'
 ]
};
const h2=(id:string,title:string)=>`<h2 id="kurume-${id}">${esc(title)}</h2>`;
const h3=(id:string,title:string)=>`<h3 id="kurume-${id}">${esc(title)}</h3>`;

export function renderKurumeAdmissionsReadable(data:UniversityAdmissions){
 const all:Row[]=[];
 for(const s of data.schemes)for(const[k,key]of [['schedule','scheduleRows'],['exam','examRows'],['venue','venueRows'],['note','notes']] as const)s[key].forEach((r,i)=>all.push({label:'label'in r?r.label:'出願・受験の注意',value:'value'in r?r.value:r.text,sourceIds:r.sourceIds,status:'status'in r?r.status:undefined,origins:[`${s.id}/${k}/${i}`]}));
 data.coverageNotes.forEach((value,i)=>all.push({label:'掲載範囲・確認事項',value,sourceIds:['guidelines-index'],origins:[`coverage/${i}`]}));
 raw.basicInfoRows.forEach((r,i)=>all.push({...r,origins:[`basic/${i}`]}));
 const used=new Set<string>(),get=(id:string)=>{const r=all.find(x=>x.origins.includes(id));if(!r)throw new Error('Missing Kurume fact '+id);return r;};
 const combine=(ids:string[],label?:string,value?:string):Row=>{const rs=ids.map(get);ids.forEach(x=>used.add(x));if(value===undefined&&new Set(rs.map(r=>r.value)).size!==1)throw new Error('Unresolved merge '+ids.join(','));return{label:label??rs[0].label,value:value??rs[0].value,origins:ids,sourceIds:[...new Set(rs.flatMap(r=>r.sourceIds))],...(rs.some(r=>r.status==='needs-confirmation')?{status:'needs-confirmation'}:{})};};
 const one=(id:string,label?:string,value?:string)=>combine([id],label,value);
 const take=(ids:string[])=>ids.map(id=>one(id));
 const by=(s:string,k:string,ns:number[])=>ns.map(n=>`${s}/${k}/${n}`);
 const qualificationRows=(s:string,ns:number[])=>ns.map(n=>n===1?combine([`${s}/exam/1`,'coverage/2'],get(`${s}/exam/1`).label,get(`${s}/exam/1`).value):one(`${s}/exam/${n}`));
 const rec=['recommendation','kurume-special','fukuoka-special','self'],gen=['general-early','common-a','general-late','common-b'];
 const allOf=(ss:string[],kind:string,n:number)=>ss.map(s=>`${s}/${kind}/${n}`);
 const recSchedule=(n:number)=>rec.map((s,i)=>`${s}/schedule/${n+(i===3?1:0)}`);
 const recExam=(offset:number)=>rec.map((s,i)=>`${s}/exam/${[5,4,6,4][i]+offset}`);
 const sourceList=(ids:string[])=>sources(data.sources.filter(s=>ids.includes(s.id)).map(s=>({...s,title:`${s.title}${s.pages?`／${Array.isArray(s.pages)?s.pages.join('、'):s.pages}`:''}／確認日 ${new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(s.retrievedAt))}`})));
 const numTable=(caption:string,headers:string[],rs:{fact:Row;cells:string[]}[],kind='scores')=>`<table data-admission-table="${kind}" class="kurume-numbers kurume-cols-${headers.length}"><caption>${esc(caption)}</caption><thead><tr>${headers.map(s=>`<th scope="col">${esc(s)}</th>`).join('')}</tr></thead><tbody>${rs.map(({fact,cells})=>`<tr ${attrs(fact)}>${cells.map((c,i)=>`<${i?'td':'th scope="row"'}>${esc(c)}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table>`;
 const p=(r:Row)=>`<p ${attrs(r)}><strong>${esc(r.label)}</strong> ${esc(r.value)}</p>`;
 const branch=(r:Row,intro:string,items:string[])=>`<div ${attrs(r)}><p><strong>${esc(r.label)}</strong> ${esc(intro)}</p><ul>${items.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div>`;
 const overviewRows=data.schemes.map((s,i)=>({fact:combine([`${s.id}/exam/0`,...(i<4?['coverage/1']:[])],get(`${s.id}/exam/0`).label,get(`${s.id}/exam/0`).value),cells:[['公募A推薦','大学特別枠推薦','福岡県特別枠推薦','自己推薦','一般前期','共通テストA','一般後期','共通テストB'][i],['約8人','約20人','3人','約2人','約67人','約5人','約5人','約3人'][i],i<4?'2026/11/1～5':i<6?'2026/12/15～2027/1/7':'2027/2/6～25',i<4?'2026/11/14':i<6?(i===4?'一次2/1・二次2/13':'共テ1/16・17／二次2/13'):(i===6?'一次3/8・二次3/16':'共テ1/16・17／二次3/16')]}));
 let overview=numTable('2027年度 医学科の8方式',['方式','人数','Web登録・支払期間','試験日'],overviewRows,'overview').replace('kurume-cols-4','kurume-cols-4 kurume-overview');
 overviewRows.forEach((r,i)=>{const dest=i<4?data.schemes[i].id:i<6?'early':'late';overview=overview.replace(`${esc(r.cells[0])}</th>`,`<a href="#kurume-${dest}">${esc(r.cells[0])}</a></th>`);});
 const intro=combine(['coverage/0','coverage/1'],'方式の範囲','医学部医学科の8方式です。募集人数の「約」は大学の公表表記です。公募B日程・指定校選抜は医学科の募集対象ではありません。共通テスト利用A・Bは2027年度から医学科に導入されます。');
 const accessIds=data.schemes.map(s=>`${s.id}/venue/${s.venueRows.length-1}`);
 const accommodation=combine([...rec.map(s=>`${s}/schedule/${s==='self'?8:7}`),...gen.map(s=>`${s}/schedule/${s==='general-early'||s==='common-a'?10:9}`),'coverage/4'],'受験上の配慮','各入試の出願開始日の2週間前までに、所定申請書・診断書等を入試課へ郵送して申請します。通常の入試出願も別に行ってください。配慮内容によって本学（久留米）会場の指定があります。不慮の事故・急病等は速やかに相談してください。');
 const completion=combine([...rec.map(s=>`${s}/note/${s==='self'?1:2}`),...gen.map(s=>`${s}/note/0`),'coverage/3'],'出願と入学手続の完了','出願はWeb登録・検定料支払・書類の期限内到着がすべて必要です。郵送は簡易書留・速達で、締切日の消印だけでは受け付けません。入学手続も納付・学籍情報登録・必要書類の提出をすべて完了してください。');
 const notification=one('coverage/6','合格通知・手続書類','合否はマイページで確認し、合格通知書・入学手続書類を各自ダウンロード・印刷します。書類の郵送はありません。');
 const common=conditions([completion,combine(accessIds,'通常の出願書類送付先'),notification,accommodation]);
 const recSch=table('推薦型3方式・自己推薦の共通日程',[
  combine([...recSchedule(0),'coverage/3'],'Web登録・支払','2026年11月1日（日）～5日（木）23:59'),combine([...recSchedule(1),'coverage/3'],'書類提出','2026年11月6日（金）必着'),
  combine(recSchedule(3),'受験票','2026年11月11日（水）10:00～12月17日（木）23:59。マイページからA4で印刷して持参。画面提示では受験できません。'),
  combine(recSchedule(4),'試験・集合','2026年11月14日（土）。8:40までに指定席に着席。'),combine(recSchedule(5),'合格発表','2026年12月1日（火）10:00から、マイページ。'),combine(recSchedule(6),'入学手続','2026年12月17日（木）17:00。一括納入と必要書類の必着締切。')
 ]);
 const fee=numTable('推薦等の検定料',['出願する方式','検定料'],[
  {fact:combine([...rec.slice(0,3).map(s=>`${s}/schedule/2`),...rec.slice(0,3).map(s=>`${s}/note/0`)],'推薦3方式の検定料','単願60,000円、2併願90,000円、3併願100,000円'),cells:['公募A・大学特別枠・県特別枠','単願60,000円／2併願90,000円／3併願100,000円']},
  {fact:one('self/schedule/3'),cells:['自己推薦','60,000円']}
 ]);
 const recFeeNotes=conditions([{...combine([...rec.slice(0,3).map(s=>`${s}/schedule/2`),'self/schedule/3'],get('recommendation/schedule/2').label,get('recommendation/schedule/2').value),label:'サービス利用料',value:'1回の出願ごとに1,250円が別途必要です。'},combine(rec.slice(0,3).map(s=>`${s}/note/0`),'併願と書類','公募A・大学特別枠・福岡県特別枠は併願できますが、合格はいずれか1方式のみです。必要書類をそろえ、共用書類の提出は1通で構いません。'),combine(rec.map(s=>`${s}/note/${s==='self'?0:1}`),'本人による書類作成')]);
 const recTest=numTable('2026年11月14日 推薦等4方式の試験',['試験','配点','時間'],[
  {fact:combine(recExam(0)),cells:['英語','100点','9:00～10:00']},{fact:combine(recExam(1)),cells:['数学','100点','10:30～11:30']},{fact:combine(recExam(2)),cells:['小論文','50点','12:00～13:00']},{fact:combine(recExam(3)),cells:['面接','50点','14:00から']}
 ]);
 const recScopes=conditions([
  combine(recExam(0),'英語の範囲','英語コミュニケーションⅠ・Ⅱ・Ⅲ、論理・表現Ⅰ・Ⅱ・Ⅲ。'),combine(recExam(1),'数学の範囲','数学Ⅰ・Ⅱ・A・B（数列）。'),combine(recExam(2),'小論文','与えられたテーマについて800字以内で論述します。'),
  combine(recExam(4),'段階選考'),combine(recExam(3),'面接の評価','面接評価が著しく低い場合、他の試験結果にかかわらず不合格になることがあります。'),combine(recExam(5),'選考基準・面接時間')
 ]);
 const recVenue=conditions([combine(allOf(rec,'venue',0),'共通の試験会場'),combine(allOf(rec,'venue',1),'試験室・面接順')]);
 const recQualifications=h3('recommendation','学校推薦型選抜（公募）A日程')+conditions(qualificationRows('recommendation',[1,2,3,4]))
 +h3('kurume-special','久留米大学特別枠推薦型選抜')+p(one('kurume-special/exam/0','枠の区分','厚生労働省の地域枠の定義では大学独自枠に該当します。'))+conditions(qualificationRows('kurume-special',[1,2,3]))
 +h3('fukuoka-special','福岡県特別枠推薦型選抜の資格・奨学金・勤務条件')+p(combine(['fukuoka-special/exam/0','coverage/10'],'枠の区分','県の地域枠です。次の出願資格、奨学金貸与と勤務条件を確認してください。'))
 +conditions(qualificationRows('fukuoka-special',[1,2]))
 +branch(one('fukuoka-special/exam/3'),'次のいずれかに該当し、かつ同種の貸与金を他から借り受ける予定がないこと。',[
  '本人が福岡県内に住所を有する。',
  '県内の高校・中等教育学校後期課程・特別支援学校高等部・高等専門学校第3学年課程・専修学校高等課程を卒業・修了、又はその見込み。',
  '県外居住者で、未成年者は親権者又は後見人が県内に住所を有する。成年者は、成年となる日に親権者又は後見人であった人が県内に住所を有する。本人の該当区分は県へ確認してください。'
 ])+conditions([combine(['fukuoka-special/exam/4','coverage/10'],get('fukuoka-special/exam/4').label,get('fukuoka-special/exam/4').value),one('fukuoka-special/exam/5'),combine(['fukuoka-special/note/3','coverage/10'],'キャリア形成プログラム',get('fukuoka-special/note/3').value),one('fukuoka-special/note/5','返還免除を満たさない場合'),combine(['fukuoka-special/note/4','coverage/10'],'義務離脱の扱いと例外',get('fukuoka-special/note/4').value),one('fukuoka-special/note/6','欠員時の追加募集')])
 +sourceList(['recommendation-2027','pref-loan-index','fukuoka-forms'])
 +h3('self','自己推薦型選抜の事前審査・出願資格')+table('自己推薦は通常出願より前に資格審査が必要',[one('self/schedule/0')])+conditions([combine(['self/exam/1','self/note/2','coverage/2'],'大学卒業等の資格',get('self/exam/1').value),...take(by('self','exam',[2,3])),one('self/note/3','自己推薦用の面接票')]);
 const recScope=p(one('coverage/2','学校の所在地・卒業年','推薦型3方式は日本国内の高校・中等教育学校が対象で、インターナショナルスクール等は対象外です。公募Aと大学・県特別枠では対象となる卒業年が異なります。各方式の資格をすべて満たす必要があります。'));
 const generalEligibility=conditions([combine(allOf(gen,'exam',1),'4方式の出願資格')]);
 const generalDocs=conditions([
  combine(allOf(['general-early','general-late'],'exam',2),'一般前期・後期の提出書類'),combine(allOf(['common-a','common-b'],'exam',2),'共通テストA・Bの提出書類'),
  combine(['common-a/exam/3','common-b/exam/3','coverage/9'],'共通テスト方式の面接票','要確認。募集要項の共通テスト利用A・Bの出願書類一覧に面接票がありませんが、公式面接票の様式にはA・B用とあります。提出の時期・要否は入試課へ確認してください。'),
  combine(allOf(gen,'note',3),'面接票の履歴記入期間'),
  combine(['common-a/exam/4','common-b/exam/4','coverage/8'],'共通テスト成績請求','Web方式です。出願画面で成績請求情報を登録してください。登録しないと検定料支払に進めず、出願は完了しません。チケットの送付は不要です。出願前に最新の公式ガイダンスを確認してください。'),one('coverage/5','同時出願と共通書類')
 ]);
 const primary=numTable('一般前期・後期の一次試験',['教科','配点','時間'],[
  {fact:combine(allOf(['general-early','general-late'],'exam',3)),cells:['英語','100点','9:30～11:00（90分）']},
  {fact:combine(allOf(['general-early','general-late'],'exam',4)),cells:['理科・2科目','200点','12:10～14:10（120分）']},
  {fact:combine(allOf(['general-early','general-late'],'exam',5)),cells:['数学','100点','15:00～16:30（90分）']}
 ]);
 const primaryScope=conditions([
  combine(allOf(['general-early','general-late'],'exam',3),'英語の範囲','英語コミュニケーションⅠ・Ⅱ・Ⅲ、論理・表現Ⅰ・Ⅱ・Ⅲ。'),combine(allOf(['general-early','general-late'],'exam',4),'理科の選択','物理基礎・物理、化学基礎・化学、生物基礎・生物の3組から2科目。'),combine(allOf(['general-early','general-late'],'exam',5),'数学の範囲','数学Ⅰ・Ⅱ・Ⅲ・A、数学B（数列）、数学C（数学的な表現の工夫の章を除く）。'),combine(allOf(['general-early','general-late'],'exam',6),'一次判定・理科の得点調整')
 ]);
 const ctTable=numTable('共通テスト利用A日程・一次',['教科','利用点','指定科目・換算'],[
  {fact:one('common-a/exam/6'),cells:['英語','200点','リーディング・リスニング']},
  {fact:one('common-a/exam/7'),cells:['数学','200点','数学Ⅰ・A、数学Ⅱ・B・Cを各100点']},
  {fact:one('common-a/exam/8'),cells:['理科','300点','物理・化学・生物から2科目。各100点を150点に換算']},
  {fact:one('common-a/exam/9'),cells:['国語','100点','近代以降の文章のみ。110点を100点に換算']},
  {fact:one('common-a/exam/5'),cells:['一次合計','800点','2027年度共通テストの成績']}
 ]);
 const ctBTable=numTable('共通テスト利用B日程・一次',['区分・教科','利用点','指定科目・換算'],[
  {fact:one('common-b/exam/6'),cells:['必須・英語','200点','リーディング・リスニング']},
  {fact:one('common-b/exam/7'),cells:['必須・数学','200点','数学Ⅰ・A、数学Ⅱ・B・Cを各100点']},
  {fact:one('common-b/exam/8'),cells:['必須・理科','200点','物理・化学・生物から最高得点の1科目。100点を200点に換算']},
  {fact:one('common-b/exam/9'),cells:['選択・2科目','200点','追加の理科、国語、地歴公民、情報Ⅰから高得点2科目。各100点']},
  {fact:one('common-b/exam/5'),cells:['一次合計','800点','必須600点＋選択200点']}
 ]);
 const ctNotes=conditions([
  combine(['common-a/exam/6','common-b/exam/6'],'英語のR/L換算比率','要確認。医学科の配点表にR/L換算比率の明記がありません。入試課へ確認してください。'),
  combine(['common-b/exam/9','common-b/note/5'],'B日程の選択科目','追加の理科は物理・化学・生物・地学の2科目目。国語は全体200点を100点に換算します。必須理科の1科目に加え、国語・地歴公民・情報Ⅰと追加理科から高得点の2科目を用います。'),
  one('common-b/exam/10','B日程の地理歴史・公民'),
  combine(['common-a/note/5','common-b/note/5','coverage/7'],'医学科の二次試験・受験票','医学科は一次合格者に小論文・面接を行います。一次の受験番号照会と二次の受験票印刷は別です。共通テスト利用だけの一次合格者も、二次受験票をマイページから印刷して持参してください。')
 ]);
 const pairSchedule=(early:boolean)=>{const ss=early?['general-early','common-a']:['general-late','common-b'],g=ss[0],c=ss[1],rs=[combine([...allOf(ss,'schedule',0),'coverage/3'],'Web登録・支払',get(`${g}/schedule/0`).value),combine([...allOf(ss,'schedule',1),'coverage/3'],'書類提出',get(`${g}/schedule/1`).value),one(`${g}/schedule/4`,'一般の一次試験'),one(`${c}/schedule/4`,'共通テスト'),combine(allOf(ss,'schedule',5),'一次合格発表'),combine(allOf(ss,'schedule',6),'二次試験・集合'),combine(allOf(ss,'schedule',7),'最終合格発表')];if(early)rs.push(combine(allOf(ss,'schedule',8),'入学申込・入学金'),combine(allOf(ss,'schedule',9),'残金・入学手続'));else rs.push(combine(allOf(ss,'schedule',8),'一括納入・入学手続'));return table(early?'一般前期・共通テストAの日程':'一般後期・共通テストBの日程',rs)+table('受験票・一次受験番号',[one(`${g}/schedule/3`,early?'一般前期の受験票':'一般後期の受験票'),one(`${c}/schedule/3`,early?'共通テストAの番号照会':'共通テストBの番号照会')])+conditions([combine(allOf(ss,'note',4),'併願で両方の一次に合格した場合')]);};
 const generalFee=numTable('一般・共通テスト利用の検定料',['方式','検定料'],[
  {fact:combine(allOf(['general-early','general-late'],'schedule',2),'一般の検定料'),cells:['一般前期・一般後期（各出願）','60,000円']},
  {fact:combine(allOf(['common-a','common-b'],'schedule',2),'共通テストの検定料'),cells:['共通テストA・B（各出願）','30,000円']}
 ]);
 const generalFeeNotes=conditions([combine([...allOf(gen,'schedule',2)],'手数料と割引','1回の出願ごとにサービス利用料1,250円が別途必要です。医学部は文系学部向けの併願割引の対象外です。')]);
 const earlyVenue=conditions(take(by('general-early','venue',[0,1,2]))),lateVenue=conditions(take(by('general-late','venue',[0,1])));
 // The CT routes use the corresponding general route's second examination venue.
 const ctVenues=conditions([one('common-a/venue/0','共通テストAの二次会場'),one('common-b/venue/0','共通テストBの二次会場'),combine(['general-early/venue/3','general-late/venue/2','common-a/venue/1','common-b/venue/1'],'確定会場・試験室')]);
 const finalExam=numTable('4方式共通の二次試験',['試験','配点','内容'],[
  {fact:combine(['general-early/exam/7','general-late/exam/7','common-a/exam/10','common-b/exam/11']),cells:['小論文','50点','60分。テーマについて800字以内で論述']},
  {fact:combine(['general-early/exam/8','general-late/exam/8','common-a/exam/11','common-b/exam/12']),cells:['面接','50点','医師の適性、コミュニケーション能力、表現力、倫理観、使命感等を評価']}
 ]);
 const finalNotes=conditions([combine(['general-early/exam/9','general-late/exam/9','common-a/exam/12','common-b/exam/13'],'最終判定'),combine(['general-early/exam/8','general-late/exam/8','common-a/exam/11','common-b/exam/12'],'個別の面接時間','1人あたりの時間・開始時刻は当日の指示等で確認してください。')]);
 const generalAfter=conditions([
  combine(allOf(gen,'note',0),'支払後の変更','一般選抜は検定料納入後の選択科目・試験地等の変更ができません。共通テスト利用は志望学部・学科の変更ができません。出願書類は簡易書留・速達で期限内必着です。'),combine(allOf(gen,'note',1),'繰上合格'),combine(allOf(gen,'note',2),'入学辞退・返還')
 ]);
 // Basic facts are kept in the candidate with their own source bindings.
 const basicTable=table('所在地・問い合わせ・アクセス',take(['basic/0','basic/1','basic/2','basic/3']));
 const gender=numTable('2026年5月1日・医学科全学年の在籍学生736人',['区分','人数','割合'],[
  {fact:one('basic/4'),cells:['男性','460人','62.5％']},{fact:one('basic/5'),cells:['女性','276人','37.5％']},{fact:one('basic/6'),cells:['合計','736人','100％']}
 ]);
 const basicNotes=conditions([one('basic/7','2026年度の医学科入学者'),one('basic/8','医学科の入学定員')]);
 const scope=p(one('coverage/11','掲載対象'));
 const body=`<section class="admission-readable kurume-editorial" data-university-admissions-year="2027">
 ${h2('overview','入試方式・募集人数・主要日程')}${overview}${p(intro)}${sourceList(['recommendation-2027','general-2027','common-new-notice'])}
 ${h2('application','出願・合格確認の共通事項')}${common}${sourceList(['recommendation-2027','general-2027','special-notice'])}
 ${h2('recommendation-common','推薦型3方式・自己推薦の日程と試験')}${recSch}${fee}${recFeeNotes}${h3('recommendation-test','推薦等の英語・数学・小論文・面接')}${recTest}${recScopes}${recVenue}${recScope}${sourceList(['recommendation-2027'])}
 ${h2('qualifications','推薦型・自己推薦の出願資格と固有条件')}${recQualifications}${sourceList(['recommendation-2027','self-forms','fukuoka-forms'])}
 ${h2('general-application','一般・共通テスト利用の出願資格・書類')}${generalEligibility}${generalDocs}${generalFee}${generalFeeNotes}${sourceList(['general-2027','general-forms'])}
 ${h2('early','一般前期・共通テストA日程')}${pairSchedule(true)}${earlyVenue}${sourceList(['general-2027'])}
 ${h2('late','一般後期・共通テストB日程')}${pairSchedule(false)}${lateVenue}${sourceList(['general-2027'])}
 ${h2('general-exams','一般選抜の一次試験・科目と範囲')}${primary}${primaryScope}${sourceList(['general-2027'])}
 ${h2('common-test','共通テスト利用A・Bの科目と配点')}${ctTable}${ctBTable}${ctNotes}${sourceList(['general-2027'])}
 ${h2('second','一般・共通テスト利用の二次試験と会場')}${finalExam}${finalNotes}${ctVenues}${generalAfter}${sourceList(['general-2027'])}
 ${h2('basic','大学基本情報・医学科在籍学生の男女比')}${basicTable}${gender}${basicNotes}${sourceList(['campus-access','medicine-profile','basic-disclosure-index'])}${scope}
 </section>`;
 const omitted=all.flatMap(r=>r.origins).filter(id=>!used.has(id));if(omitted.length)throw new Error('Unrendered Kurume origins: '+omitted.join(','));
 return body+`<style>
 .article-content .kurume-editorial table{display:table;width:100%;table-layout:fixed;min-width:0;white-space:normal;overflow:visible}
 .article-content .kurume-editorial table :is(th,td):nth-child(n){width:auto;min-width:0;white-space:normal;overflow-wrap:anywhere;vertical-align:top}
 .article-content .kurume-editorial table:not(.kurume-numbers) thead th:first-child{width:27%}
 .article-content .kurume-editorial table:not(.kurume-numbers) thead th:nth-child(2){width:73%}
 .article-content .kurume-editorial .kurume-numbers thead th:first-child{width:29%}
 .article-content .kurume-editorial .kurume-numbers thead th:nth-child(2){width:20%}
 .article-content .kurume-editorial .kurume-numbers thead th:nth-child(3){width:51%}
 .article-content .kurume-editorial .kurume-cols-2 thead th:first-child{width:43%}
 .article-content .kurume-editorial .kurume-cols-2 thead th:nth-child(2){width:57%}
 .article-content .kurume-editorial .kurume-overview thead th:first-child{width:25%}
 .article-content .kurume-editorial .kurume-overview thead th:nth-child(2){width:18%}
 .article-content .kurume-editorial .kurume-overview thead th:nth-child(n+3){width:28.5%}
 .article-content .kurume-editorial .admission-conditions{padding-left:1.3em}
 .article-content .kurume-editorial .admission-conditions li{margin-bottom:.7em}
 .article-content .kurume-editorial .admission-sources{font-size:.82em;margin:.7rem 0 1.6rem}
 .article-content .kurume-editorial .admission-sources summary{cursor:pointer}
 .article-content .kurume-editorial .admission-sources a{overflow-wrap:anywhere}
 .article-content .kurume-editorial caption{text-align:left;font-weight:700;margin-bottom:.5rem}
 @media(max-width:480px){.article-content .kurume-editorial table{font-size:.85rem}.article-content .kurume-editorial th,.article-content .kurume-editorial td{padding:.5rem .35rem;line-height:1.65}}
 </style>`;
}
