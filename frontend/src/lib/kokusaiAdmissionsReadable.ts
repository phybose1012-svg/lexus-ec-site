import raw from '../data/universityAdmissions/kokusai.json' with {type:'json'};
import type {UniversityAdmissions} from './universityAdmissions.ts';
import {admissionFactAttributes as attrs,escapeAdmissionText as esc,renderAdmissionReaderTable as table,renderAdmissionReaderSources as sources} from './admissionsReaderPrimitives.ts';
import type {AdmissionReaderRow as Row} from './admissionsReaderPrimitives.ts';

export function kokusaiAdmissionsMetadata(data:UniversityAdmissions){return {
 title:'国際医療福祉大学医学部｜2027年度入試情報',displayTitle:'国際医療福祉大学 医学部2027年度入試情報',displayTitleLines:['国際医療福祉大学 医学部','2027年度入試情報'],
 description:'国際医療福祉大学医学部医学科2027年度の一般・共通テスト利用・総合型・特別選抜。日程、科目・配点、資格、会場、学費・奨学金の条件と成田キャンパスの基本情報を掲載。',
 lead:'国際医療福祉大学医学部医学科の2027年度入試を、一般選抜・大学入学共通テスト利用選抜・総合型選抜と、留学生・帰国生等の特別選抜各2回に分けてまとめます。日程、科目・時間・配点・範囲、出願資格、会場、学費・奨学金の条件、大学基本情報を掲載しています。出願前に当該年度の募集要項と変更通知をご確認ください。',
 modified:new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(data.verifiedAt)),
 keyPoints:[
  '一般選抜は95人で一次試験は2027年1月25日。共通テスト利用は15人で、二次に英語100点・小論文・面接があります。',
  '2027年度新設の総合型選抜は専願で10人。出願書類は2026年11月9日必着、本人の指定説明会等への参加または動画視聴と証明が必要です。',
  '留学生特別選抜は第1・2回合わせて20人、帰国生等は両回合わせて若干名。出願前に履歴のWeb送信と資格確認書類の郵送が必要です。'
 ]
};}
const h2=(id:string,title:string)=>`<h2 id="kokusai-${id}">${esc(title)}</h2>`;
const sub=(title:string)=>`<p class="kokusai-subtitle">${esc(title)}</p>`;

export function renderKokusaiAdmissionsReadable(data:UniversityAdmissions){
 const all:Row[]=[];
 for(const s of data.schemes)for(const[k,key]of [['schedule','scheduleRows'],['exam','examRows'],['venue','venueRows'],['note','notes']] as const)s[key].forEach((r,i)=>all.push({label:'label'in r?r.label:'出願・受験の注意',value:'value'in r?r.value:r.text,sourceIds:r.sourceIds,status:'status'in r?r.status:undefined,origins:[`${s.id}/${k}/${i}`]}));
 const coverageSources:Record<number,string[]>={1:['correction','guide'],2:['guide','fees','medical-faq'],4:['guide'],5:['guide'],6:['guide','sogo-guide'],7:['sogo','sogo-guide'],8:['guide'],9:['guide'],10:['guide','fees'],11:['guide','fees'],12:['guide','fees','correction'],13:['guide','fees'],14:['guide','fees'],15:['guide','fees'],16:['guide'],17:['accommodations','accommodations-form'],18:['guide','sogo-guide'],19:['grade-disclosure-guide'],20:['appeal-guide'],21:['grade-disclosure-guide','appeal-guide'],22:['guide'],23:['guide','sogo-guide']};
 const coverageLabels=['掲載する方式','在留資格を示す書類','特待Sの寮費給付の資料差','総合型の新設','外国語書類の翻訳と成績基準','特別選抜の資格確認','Web登録・検定料納付・書類の期限','総合型の説明会・動画視聴','共通テスト利用の受験と免除','共通テストの教科・科目','留学生奨学金の勤務義務','特待S・Aの継続条件','特待S・Aの負担額と入学金返還','留学生奨学金の語学力・成績と推薦','留学生奨学金の給付額と生活支援','留学生奨学金の寮・海外臨床実習','必要な試験・遅刻の扱い','配慮申請の提出書類','在留資格の証明と期限','得点通知の対象と申請期限','疑義申し立ての対象と申請期限','得点通知・疑義申し立ての郵送書類','出願書類・受理後の変更','合否通知・補欠・繰り上げ','学納金の内訳と分割納付','政府等の推薦がある留学生の試験調整','合否の判定方法'];
 data.coverageNotes.forEach((value,i)=>all.push({label:coverageLabels[i],value,sourceIds:coverageSources[i]??['guide','sogo-guide'],origins:[`coverage/${i}`],...(/^要確認/.test(value)?{status:'needs-confirmation'}:{})}));
 raw.basicInfoRows.forEach((r,i)=>all.push({...r,origins:[`basic/${i}`]}));
 const used=new Set<string>(),get=(id:string)=>{const r=all.find(x=>x.origins.includes(id));if(!r)throw Error('Missing Kokusai fact '+id);return r;};
 const mark=(ids:string[]):Row=>{const rs=ids.map(get);ids.forEach(id=>used.add(id));return{label:rs[0].label,value:rs[0].value,sourceIds:[...new Set(rs.flatMap(r=>r.sourceIds))],origins:ids,...(rs.some(r=>r.status==='needs-confirmation')?{status:'needs-confirmation'}:{})};};
 const one=(id:string)=>{used.add(id);const r=get(id),[scheme,kind,n]=id.split('/');let label=r.label;
  if(kind==='exam'&&scheme==='general'&&[7,8,9].includes(Number(n)))label='一般・共通テスト利用：'+label;
  if(kind==='exam'&&scheme==='center'&&n==='8')label='共通テスト利用：'+label;
  if(kind==='exam'&&scheme.startsWith('foreign-')&&[6,8,9].includes(Number(n)))label='留学生：'+label;
  if(kind==='exam'&&scheme.startsWith('returnee-')&&[6,8,9].includes(Number(n)))label='帰国生等：'+label;
  return{...r,label};};
 const wrap=(ids:string[],html:string)=>`<div ${attrs(mark(ids))}>${html}</div>`;
 const ids=(s:string,k:string,ns:number[])=>ns.map(n=>`${s}/${k}/${n}`);
 const take=(s:string,k:string,ns:number[])=>ids(s,k,ns).map(one);
 const group=(rows:Row[])=>{const groups=new Map<string,Row>();for(const r of rows){const key=r.label+'\0'+r.value+'\0'+(r.status??'');const existing=groups.get(key);if(existing){existing.origins.push(...r.origins);existing.sourceIds=[...new Set([...existing.sourceIds,...r.sourceIds])];}else groups.set(key,{...r,origins:[...r.origins],sourceIds:[...r.sourceIds]});}return[...groups.values()];};
 const cond=(rows:Row[],showScope=false)=>group(rows).map(r=>{const parts=r.value.split(/(?=[①②③④⑤])/u);const sentences=parts.length>1?parts:r.value.split(/(?<=。)/u).filter(x=>x.trim());const scope=[...new Set(r.origins.map(id=>id.split('/')[0].replace(/-\d$/u,'')).map(id=>({general:'一般選抜',center:'共通テスト利用',sogo:'総合型',foreign:'留学生特別選抜',returnee:'帰国生等特別選抜'}[id])).filter(Boolean))];const label=showScope&&!/^(?:一般・共通テスト利用|共通テスト利用)：/u.test(r.label)?`${scope.length===5?'全方式':scope.join('・')}：${r.label}`:r.label;return`<div class="kokusai-condition" ${attrs(r)}><p><strong>${esc(label)}</strong></p>${sentences.length>1?`<ul>${sentences.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:`<p>${esc(r.value)}</p>`}</div>`;}).join('');
 const src=(sourceIds:string[])=>sources(data.sources.filter(s=>sourceIds.includes(s.id)).map(s=>({...s,title:`${s.title}${s.pages?`／物理ページ ${Array.isArray(s.pages)?s.pages.join('、'):s.pages}`:''}／確認日 ${new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(s.retrievedAt))}`})));
 const num=(caption:string,headers:string[],rows:string[][],origins:string[][])=>`<table data-admission-table="scores" class="kokusai-numbers kokusai-cols-${headers.length}"><caption>${esc(caption)}</caption><thead><tr>${headers.map(x=>`<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${rows.map((cells,i)=>`<tr ${attrs(mark(origins[i]))}>${cells.map((c,k)=>`<${k?'td':'th scope="row"'}>${esc(c)}</${k?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table>`;
 const special=['foreign-1','foreign-2','returnee-1','returnee-2'];
 const overviewRows=data.schemes.map(s=>{const exam=s.id==='general'?2:s.id==='center'?2:s.id==='sogo'?1:3;const application=s.id.startsWith('foreign')||s.id.startsWith('returnee')?1:0;const r=mark([`${s.id}/exam/0`,`${s.id}/schedule/${application}`,`${s.id}/schedule/${exam}`]);const quota=s.id==='general'?'95人':s.id==='center'?'15人':s.id==='sogo'?'10人':s.id.startsWith('foreign')?'20人（2回合計）':'若干名（2回合計）';const target=s.id.replace(/-\d$/,'');return`<tr ${attrs(r)}><th scope="row"><a href="#kokusai-${target}">${esc(s.name)}</a></th><td data-label="募集人数">${quota}</td><td data-label="出願">${esc(s.scheduleRows[application].value.split('。')[0])}</td><td data-label="試験日">${esc(s.scheduleRows[exam].value.split('。')[0])}${s.id==='center'?'<br>二次2月16日・20日':''}</td></tr>`;}).join('');
 let html=`${h2('overview','入試方式・募集人数・主要日程')}${wrap(['coverage/0','coverage/3'],`<p>医学部医学科の入学定員は140人。総合型選抜は2027年度から新設されます。</p>`)}<table class="kokusai-overview" data-admission-table="overview"><caption>2027年度医学部医学科 7区分の主要日程</caption><thead><tr><th scope="col">入試方式</th><th scope="col">募集人数</th><th scope="col">出願</th><th scope="col">試験日</th></tr></thead><tbody>${overviewRows}</tbody></table>${src(['guide','sogo-guide','correction'])}`;
 html+=h2('general','一般選抜')+table('一般選抜の出願・試験・手続日程',take('general','schedule',[0,1,2,3,4,5,6]));
 html+=sub('一般選抜の出願資格')+cond(take('general','exam',[1]));
 html+=sub('一般選抜の科目・時間・配点')+num('一般選抜 一次学力試験600点（マーク式）',['試験','配点','時間'],[
  ['理科2科目','各100点','9:40～11:40（120分）'],['数学','200点','12:50～14:10（80分）'],['英語','200点','15:00～16:20（80分）'],['小論文','段階評価','17:10～18:10（60分）'],['二次個人面接','段階評価','9:00～18:30の指定時刻、約30分×2回']
 ],[ids('general','exam',[2,3]),ids('general','exam',[4]),ids('general','exam',[4]),ids('general','exam',[5]),ids('general','exam',[6])]);
 html+=wrap(['general/note/0'],`<ul><li>理科は物理基礎・物理、化学基礎・化学、生物基礎・生物から2科目を試験時間内に選びます。</li><li>数学はⅠ・Ⅱ・Ⅲ、A全範囲、Bの数列・統計的な推測、Cのベクトル・平面上の曲線と複素数平面。</li><li>英語はコミュニケーションⅠ～Ⅲ・論理表現Ⅰ～Ⅲ。</li><li>小論文は600字以内。一次試験日に受験し、評価は二次の合否判定に使用します。</li><li>面接は希望者に一部英語を実施し、出願時に入力します。追加の面接を行う場合があります。</li></ul>`);
 html+=sub('一般選抜の試験会場')+table('一般選抜の会場',take('general','venue',[0,1,2]),'venue')+src(['guide','individual-qualification']);
 html+=h2('center','大学入学共通テスト利用選抜')+table('共通テスト利用の出願・試験・手続日程',take('center','schedule',[0,1,2,3,4,5,6,7]));
 html+=sub('共通テスト利用の出願資格')+cond(take('center','exam',[1]));
 html+=num('共通テスト 5教科7科目・900点',['教科','配点','指定科目'],[
  ['国語','200点','近代以降の文章・古文・漢文'],['地理歴史・公民','100点','指定5科目から1科目'],['数学','各100点','数学Ⅰ・A、数学Ⅱ・B・Cの両方'],['理科','各100点','物理・化学・生物から2科目'],['英語','200点','リスニングを含む']
 ],[ids('center','exam',[2,4]),ids('center','exam',[3]),ids('center','exam',[4]),ids('center','exam',[4]),ids('center','exam',[2])]);
 html+=wrap(['coverage/9'],`<p>地理歴史・公民の選択肢は、歴史総合・世界史探究、歴史総合・日本史探究、地理総合・地理探究、公共・政治経済、公共・倫理。指定5科目のうち2科目を受験した場合は、高得点の1科目を使います。</p>`);
 html+=num('共通テスト利用 二次選考',['試験','配点','時間'],[['英語（記述式）','100点','10:00～11:00（60分）'],['小論文（600字以内）','段階評価','11:40～12:40（60分）'],['個人面接','段階評価','9:00～18:30の指定時刻、約30分×2回']],[ids('center','exam',[5]),ids('center','exam',[6]),ids('center','exam',[6])]);
 html+=wrap(['center/note/0','center/note/1','coverage/8'],cond(take('center','exam',[7]))+'<p>必要な共通テスト科目をすべて受験してください。面接は希望者に一部英語を実施し、追加面接を行う場合があります。</p>');
 html+=table('共通テスト利用の会場',take('center','venue',[0,1,2]),'venue')+src(['guide','individual-qualification']);
 html+=h2('sogo','総合型選抜（専願制）')+table('総合型の出願・試験・手続日程',take('sogo','schedule',[0,1,2,3,4,5]));
 html+=sub('総合型の出願資格・専願条件')+wrap(['sogo/note/0','sogo/note/1','coverage/7'],cond(take('sogo','exam',[1,13,12])));
 html+=num('総合型 一次学力試験600点（マーク式）',['試験','配点','時間'],[['理科2科目','各100点','9:40～11:00（80分）'],['数学','200点','11:30～12:30（60分）'],['英語','200点','13:30～14:30（60分）'],['小論文・集団面接','段階評価','15:00～18:45、順序・時刻を指定'],['二次個人面接','段階評価','9:00～18:00の指定時刻、約30分×2回']],[ids('sogo','exam',[2,3]),ids('sogo','exam',[4]),ids('sogo','exam',[4]),ids('sogo','exam',[5]),ids('sogo','exam',[6])]);
 html+='<ul><li>理科は物理基礎・物理（交流回路・原子を除く）、化学基礎・化学（高分子化合物を除く）、生物基礎・生物（生態と環境を除く）から2科目。</li><li>数学はⅠ・Ⅱ、A全範囲、Bの数列、Cのベクトル。英語はコミュニケーションⅠ・Ⅱ、論理表現Ⅰ・Ⅱ。</li><li>小論文は70分・1,200字以内で、二次の判定に使用します。集団面接は約40分。受験者数等で順序・時刻を指定し、終了時刻が変わる場合があります。二次で追加面接を行う場合があります。</li></ul>';
 html+=sub('総合型の書類・会場')+cond(take('sogo','exam',[7,8]))+table('総合型の試験会場',take('sogo','venue',[0]),'venue')+src(['sogo-guide','sogo','guide']);
 const rounds=(family:string)=>[1,2].map(n=>{const s=`${family}-${n}`;return table(`${family==='foreign'?'留学生':'帰国生等'}特別選抜 第${n}回の日程`,take(s,'schedule',[0,1,2,3,4,5,6,7]))+table(`${family==='foreign'?'留学生':'帰国生等'}特別選抜 第${n}回の会場`,take(s,'venue',[0]),'venue');}).join('');
 html+=h2('foreign','留学生特別選抜（第1回・第2回）')+wrap(['foreign-1/note/0','foreign-2/note/0','foreign-1/note/1','foreign-2/note/1'],rounds('foreign'));
 html+=sub('留学生特別選抜の出願資格')+cond(group([...take('foreign-1','exam',[1,2]),...take('foreign-2','exam',[1,2])]));
 html+=h2('returnee','帰国生および外国人学校卒業生特別選抜（第1回・第2回）')+wrap(['returnee-1/note/0','returnee-2/note/0','returnee-1/note/1','returnee-2/note/1'],rounds('returnee'));
 html+=sub('帰国生等特別選抜の出願資格')+cond(group([...take('returnee-1','exam',[1,2]),...take('returnee-2','exam',[1,2])]));
 html+=h2('special-tests','特別選抜の試験・事前資格確認')+num('特別選抜4区分の一次試験（学力600点）',['試験','配点','時間'],[['理科2科目','各100点','10:00～11:20（80分）'],['数学','200点','11:50～13:10（80分）'],['英語','200点','14:10～15:00（50分）'],['小論文','段階評価','15:30～16:30（60分）']],[special.flatMap(s=>ids(s,'exam',[4,5])),special.flatMap(s=>ids(s,'exam',[4])),special.flatMap(s=>ids(s,'exam',[4])),special.flatMap(s=>ids(s,'exam',[5]))]);
 html+='<p>入室は9:00～9:30。理科は物理・化学・生物から2科目を試験当日に選択します。学力試験はマーク式で、小論文の評価は二次判定に使います。</p>';
 html+=cond(group(special.flatMap(s=>take(s,'exam',[6,7,8]))))+cond([one('coverage/25')])+src(['guide','eju-syllabus-index']);
 html+=sub('事前資格確認と出願書類')+wrap(['coverage/5'],cond(group(special.flatMap(s=>take(s,'exam',[3,9,10,11,12,13])))))+src(['guide','correction']);
 const remaining=all.filter(r=>!used.has(r.origins[0])&&!r.origins[0].startsWith('coverage/')&&!r.origins[0].startsWith('basic/'));
 const financial=remaining.filter(r=>/学納金|学生納付金|別途費用|特待|留学生.*奨学金|入学辞退|入学後・非公開|手続詳細/.test(r.label));
 financial.forEach(r=>r.origins.forEach(x=>used.add(x)));
 const procedural=remaining.filter(r=>!financial.includes(r));procedural.forEach(r=>r.origins.forEach(x=>used.add(x)));
 const procedureRows=procedural.map(r=>{let label=r.label;const id=r.origins[0];if(/^general\/exam\/[789]$/.test(id))label='一般・共通テスト利用：'+label;if(id==='center/exam/8')label='共通テスト利用：'+label;return{...r,label};});
 html+=h2('procedures','出願・受験の共通手続と方式別の提出条件')+cond(group(procedureRows),true)+cond([4,6,16,17,18,22,23,26].map(i=>one(`coverage/${i}`)))+src(['guide','sogo-guide','correction','accommodations','accommodations-form']);
 const regularTuition=financial.filter(r=>r.label==='学生納付金'&&!r.origins[0].startsWith('sogo/')).flatMap(r=>r.origins);
 html+=h2('fees','学納金・奨学金・辞退時の返還')+num('学納金の負担額（別途費用を除く）',['区分','初年度','2～6年次各年','6年間'],[
  ['一般入学者','430万円','280万円','1,830万円'],['総合型入学者','340万円','280万円','1,740万円'],['特待S','0円','0円','0円'],['特待A','30万円','50万円','280万円']
 ],[regularTuition,['sogo/exam/10'],['coverage/12'],['coverage/12']]);
 html+=wrap(['coverage/12'],`<p>特待S・Aは、入学手続時に入学金150万円をいったん納入し、実際の入学後に返還されます。特待・留学生特別奨学金の受給者は分割納入できません。</p>`);
 html+=cond([one('coverage/24')])+cond(group(financial.filter(r=>r.label!=='学生納付金')),true)+cond([1,2,10,11,13,14,15].map(i=>one(`coverage/${i}`)))+src(['guide','sogo-guide','correction','fees','english-guide','medical-faq','medical-scholarship-support']);
 html+=h2('disclosure','得点通知・疑義申し立て')+cond([19,20,21].map(i=>one(`coverage/${i}`)))+src(['grade-disclosure','grade-disclosure-guide','appeal-guide']);
 html+=h2('basic','医学科の所在地・アクセス・公表統計')+table('医学科の所在地・アクセス',[0,1,2,3,10].map(i=>one(`basic/${i}`)),'basic');
 html+=wrap(['basic/9'],num('2026年度医学科 入学者143人の男女別',['区分','人数','割合'],[['男性','81人','56.6％'],['女性','62人','43.4％']],[['basic/4'],['basic/5']]));
 html+=num('2026年度医学科 入学者125人の高校卒年別（留学生特別選抜を除く）',['高校卒業年','人数','割合'],[['2026年','53人','42.4％'],['2025年','56人','44.8％'],['2024年以前','16人','12.8％']],[['basic/6'],['basic/7'],['basic/8']])+src(['narita-access','entrants','enrolment','medical-2026-results','medical-age-statistics']);
 const missing=all.filter(r=>!used.has(r.origins[0]));if(missing.length)throw Error('Unplaced Kokusai facts: '+missing.map(r=>r.origins[0]).join(','));
 return `<div class="admission-readable kokusai-readable" data-admission-reader="kokusai">${html}</div><style>
 .article-content .kokusai-readable table{margin:18px 0 22px;font-size:14px;line-height:1.75}
 .article-content .kokusai-readable caption{text-align:left;font-weight:750;padding:0 0 10px}
 .article-content .kokusai-readable :is(th,td){padding:11px 12px;vertical-align:top}
 .article-content .kokusai-readable thead th{background:#edf3f5;color:#234c62}
 .article-content .kokusai-readable tbody th{background:#faf8f3;text-align:left;font-weight:650}
 .article-content .kokusai-readable table:not(.kokusai-numbers):not(.kokusai-overview) :is(thead th:first-child,tbody th){width:28%}
 .article-content .kokusai-readable table:not(.kokusai-overview) thead th:last-child{width:auto}
 .article-content .kokusai-readable .kokusai-subtitle{font-weight:800;margin:24px 0 10px;color:#234c62}
 .article-content .kokusai-readable .kokusai-condition{margin:18px 0;overflow-wrap:anywhere}
 .article-content .kokusai-readable .kokusai-condition p{margin:5px 0}
 .article-content .kokusai-readable .kokusai-condition ul{margin:6px 0;padding-left:1.4em}
 .article-content .kokusai-readable .kokusai-condition li{margin:5px 0}
 .article-content .kokusai-readable [data-admission-status="needs-confirmation"]{border-left:3px solid #c78b36;padding-left:12px}
 .article-content .kokusai-readable .admission-sources{margin:12px 0 28px;font-size:12px;color:#686055}
 .article-content .kokusai-readable .admission-sources summary{cursor:pointer}
 .article-content .kokusai-readable .kokusai-numbers thead th:nth-child(2){width:23%}
 .article-content .kokusai-readable .kokusai-numbers th:first-child{width:34%}
 .article-content .kokusai-readable .kokusai-cols-4 :is(th:first-child,thead th:nth-child(2)){width:25%}
 @media(max-width:600px){
 .article-content .kokusai-readable table{font-size:12px}
 .article-content .kokusai-readable :is(th,td){padding:9px 7px}
 .article-content .kokusai-readable .kokusai-overview :is(thead,thead th){position:absolute;width:1px;height:1px;padding:0;border:0;overflow:hidden;clip-path:inset(50%)}
 .article-content .kokusai-readable .kokusai-overview :is(tbody,tr){display:block;width:100%}
 .article-content .kokusai-readable .kokusai-overview tr{border:1px solid #ddd4c5;margin:12px 0}
 .article-content .kokusai-readable .kokusai-overview :is(th,td){display:block;width:auto;border:0;border-bottom:1px solid #eee6dc}
 .article-content .kokusai-readable .kokusai-overview td:before{content:attr(data-label);font-weight:700;display:inline-block;width:5em;color:#61584b}
 }
 </style>`;
}
