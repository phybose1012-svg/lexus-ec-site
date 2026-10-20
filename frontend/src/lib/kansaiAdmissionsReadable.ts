import type {UniversityAdmissions} from './universityAdmissions.ts';
import canonical from '../data/universityAdmissions/kansai.json' with {type:'json'};
import {escapeAdmissionText as esc,admissionFactAttributes as attrs,renderAdmissionReaderTable as table,renderAdmissionReaderConditions as conditions,renderAdmissionReaderSources as sourceList,type AdmissionReaderRow as Row} from './admissionsReaderPrimitives.ts';

export function kansaiAdmissionsMetadata(data:UniversityAdmissions){return{
 title:'関西医科大学医学部｜2027年度入試情報',displayTitle:'関西医科大学 医学部2027年度入試情報',displayTitleLines:['関西医科大学 医学部','2027年度入試情報'],
 description:'関西医科大学医学部医学科の2027年度入試情報。学校推薦型・特色・一般・共通テスト利用と併用、認可申請中の地域枠の人数、日程、資格、科目配点、面接、提出書類を紹介。地域枠の貸与と勤務条件、資料間の相違、検定料免除と大学基本情報も掲載しています。',
 lead:'関西医科大学医学部医学科の2027年度入試を、選抜方式ごとにまとめています。募集人数、日程、出願条件、科目・配点、面接、会場と書類を掲載しています。地域枠は認可申請中の予定です。出願前には大学の最新要項と変更のお知らせをご確認ください。',modified:data.verifiedAt.slice(0,10),categories:['関西','私立医学部'],
 keyPoints:['一般選抜は前期55名・後期8名。共通テスト利用は前期12名・後期2名、併用は13名です。地域枠と研究医枠の臨時定員増は申請中です。','共通テスト利用は前期800点・後期600点。併用は共通テスト600点と個別600点の合計で選考し、両試験の受験が必要です。','推薦型は特別枠10名・一般枠8名・特色3型合計2名で、出願できるのは1種類。特別枠は専願で、奨学金の受給・返還とは独立した卒後の勤務条件があります。']};}

export function renderKansaiAdmissionsReadable(data:UniversityAdmissions):string{
 const ids=['recommend-special','recommend-general','feature','general-early','general-late','common-early','common-late','combined','regional-osaka','regional-shizuoka'];
 if(data.path!=='/information-kansai/'||data.schemes.map(s=>s.id).join('|')!==ids.join('|'))throw Error('Kansai requires its ten reviewed routes');
 const entries=new Map<string,Row>(),seen=new Set<string>();
 for(const s of data.schemes)for(const [kind,key] of [['schedule','scheduleRows'],['exam','examRows'],['venue','venueRows'],['note','notes']] as const)s[key].forEach((r,i)=>entries.set(`${s.id}/${kind}/${i}`,{label:'label'in r?r.label:'注意事項',value:'value'in r?r.value:r.text,origins:[`${s.id}/${kind}/${i}`],sourceIds:r.sourceIds,...('status'in r?{status:r.status}:{})}));
 const coverageSources:Record<number,string[]>={0:['guidelines-2027','regional-index'],1:['quota-application','regional-index'],2:['regional-index'],3:['correction-notice','guidelines-2027'],4:['future-changes','guidelines-2027'],5:['special-pledge'],6:['guidelines-2027'],7:['guidelines-2027'],8:['eligibility-guide','regional-index'],9:['accommodation-index','accommodation-form'],10:['regional-details-2027','guidelines-2027'],11:['guidelines-2027'],12:['disaster-index'],13:['guidelines-2027'],14:['guidelines-2027'],15:['guidelines-2027'],16:['guidelines-2027'],19:['disaster-index'],20:['guidelines-2027'],21:['guidelines-2027'],22:['guidelines-2027'],23:['eligibility-guide','regional-index'],24:['accommodation-form','accommodation-index']};
 data.coverageNotes.forEach((v,i)=>entries.set(`coverage/${i}`,{label:'案内',value:v,origins:[`coverage/${i}`],sourceIds:coverageSources[i]??[]}));
 canonical.basicInfoRows.forEach((v,i)=>entries.set(`basic/${i}`,{...v,origins:[`basic/${i}`]}));
 const get=(origin:string)=>{const r=entries.get(origin);if(!r)throw Error('Missing Kansai fact '+origin);return r;};
 const take=(origins:string[]|string,label?:string,value?:string):Row=>{const rows=(Array.isArray(origins)?origins:[origins]).map(get);rows.forEach(r=>r.origins.forEach(o=>seen.add(o)));return{label:label??rows[0].label,value:value??rows[0].value,origins:rows.flatMap(r=>r.origins),sourceIds:[...new Set(rows.flatMap(r=>r.sourceIds))],...(rows.some(r=>r.status==='needs-confirmation')?{status:'needs-confirmation'}:rows[0].status?{status:rows[0].status}:{})};};
 const matching=(origin:string,label?:string,value?:string)=>take([...entries].filter(([,r])=>r.value===get(origin).value).map(([k])=>k),label,value);
 const group=(ss:string[],kind:string,i:number,label?:string,value?:string)=>take(ss.map(s=>`${s}/${kind}/${i}`),label,value);
 const p=(r:Row)=>`<p ${attrs(r)}>${esc(r.value)}</p>`,list=(rows:Row[])=>conditions(rows),h=(id:string,title:string)=>`<h3 id="${id}">${esc(title)}</h3>`,back='<p class="admission-section-links"><a href="#admission-overview">入試方式の一覧へ戻る ↑</a></p>';
 const pages:Record<string,string>={'guidelines-2027':'冊子1～38ページ（PDF物理ページは6ページ後）','overview-2027':'1～3ページ','regional-details-2027':'1～3ページ','osaka-loan':'1～2ページ','shizuoka-loan':'1ページ','eligibility-guide':'1～3ページ','accommodation-form':'1～2ページ','recommendation-form':'1～2ページ','reason-form':'1ページ','special-pledge':'1ページ','activity-form':'1ページ'};
 const src=(sourceIds:string[],locations:Record<string,string>={})=>sourceList(data.sources.filter(s=>sourceIds.includes(s.id)).map(s=>({...s,title:s.title+(locations[s.id]??pages[s.id]?`（${locations[s.id]??pages[s.id]}）`:'')+'／確認日 '+data.verifiedAt.slice(0,10)})));
 const rec=ids.slice(0,3),general=ids.slice(3,8),regions=ids.slice(8),nonRegional=ids.slice(0,8);
 const score=(caption:string,headers:string[],rows:{label:string;cells:string[];fact:Row}[],kind:string)=>`<table data-admission-table="${kind}"><caption>${esc(caption)}</caption><thead><tr>${headers.map(v=>`<th scope="col">${esc(v)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr ${attrs(r.fact)}><th scope="row">${esc(r.label)}</th>${r.cells.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
 const quota=['10名','8名','3型合計2名','55名','8名','12名','2名','13名','2名（申請中）','2名（申請中）'],apply=['2026年11月1日～11日','2026年11月1日～11日','2026年11月1日～11日','2026年12月10日～2027年1月15日','2027年2月1日～19日','2026年12月10日～2027年1月15日','2027年2月1日～19日','2026年12月10日～2027年1月15日','2026年12月10日～2027年1月15日（予定）','2026年12月10日～2027年1月15日（予定）'];
 let html=`<section class="admission-readable kansai-readable" data-university-admissions-year="2027" data-admissions-presentation="kansai-readable-v1"><h2 id="最新の入試情報">2027年度の入試情報</h2>${p(take('coverage/0'))}${h('admission-overview','入試方式・募集人数・主な日程')}<table class="admission-overview-table" data-admission-table="overview"><caption>医学科の10方式（地域枠2枠は認可申請中）</caption><thead><tr><th scope="col">入試方式</th><th scope="col">募集人数</th><th scope="col">出願登録</th><th scope="col">一次／二次</th></tr></thead><tbody>${data.schemes.map((s,i)=>{const f=take(`${s.id}/exam/0`);return`<tr ${attrs(f)}><th scope="row"><a href="#admission-scheme-${s.id}">${esc(s.name)}</a></th><td><span class="admission-mobile-label">募集人数</span>${quota[i]}</td><td><span class="admission-mobile-label">出願登録</span>${apply[i]}</td><td><span class="admission-mobile-label">一次／二次</span>${i<3?'11月28日／12月5日':i===4?'3月6日／3月16日':i===6?'共通テスト／3月16日':i>=8?'2月2日／2月20日（予定）':i===5?'共通テスト／2月21日':i===7?'共通テストと2月2日／2月21日':'2月2日／2月20日又は21日'}</td></tr>`;}).join('')}</tbody></table>${p(take(['coverage/1','general-early/note/5'],'臨時定員増と研究医枠','地域枠と研究医枠は臨時定員増を申請中です。9月16日の申請人数は大阪府2名・静岡県2名・研究医2名で、総合要項に残る大阪府3名・研究医3名の旧予定から変更されています。研究医枠は一般枠で入学した学生から入学後に選抜する予定です。一般前期への上乗せ人数は、認可後の案内で確認してください。'))}${src(['guidelines-2027','quota-application','regional-index','research-course-index'],{'guidelines-2027':'冊子1・9ページ'})}`;

 html+=h('kansai-application','出願登録・支払い・書類郵送')+p(take(['coverage/11','coverage/21'],'出願の完了','出願にはWeb登録、検定料納入、必要書類の郵送のすべてが必要です。Web入学志願票と宛名シートは拡大・縮小せずA4片面カラー印刷し、市販の角2封筒に必要書類を同封して簡易書留・速達で郵送します。大学への持込はできません。'))+table('出願登録と書類の期限（地域枠は予定）',[
 take([...rec.map(s=>`${s}/schedule/0`),...rec.map(s=>`${s}/schedule/2`)],'推薦2枠・特色','登録：2026年11月1日～11日23:59。書類：11月12日消印有効。'),
 take(['general-early/schedule/0','common-early/schedule/0','combined/schedule/0','general-early/schedule/2','common-early/schedule/2','combined/schedule/2',...regions.flatMap(s=>[`${s}/schedule/1`,`${s}/schedule/2`])],'前期・併用・地域枠','登録：2026年12月10日～2027年1月15日23:59。書類：1月16日消印有効。地域枠は認可前の予定。'),
 take(['general-late/schedule/0','common-late/schedule/0','general-late/schedule/2','common-late/schedule/2'],'後期2方式','登録：2027年2月1日～19日23:59。書類：2月20日消印有効。')],'application')+
 list([group(nonRegional,'schedule',1,'コンビニ納入期限'),matching('general-early/note/1','一般・共通テスト・併用の出願書類','Web入学志願票と調査書・証明書が必要です。同時出願では各1通、個別に出願した場合や前期と後期では別々に提出します。調査書は2026年10月1日以降発行。高校卒業後5年以上で取得できない場合は卒業証明書と単位修得証明書、単位修得証明書も発行できない場合はその旨の証明を提出します。高卒認定等の証明は2026年4月1日以降発行。氏名変更時は新旧氏名と変更を証する書類を添えます。'),take(['common-early/note/4','common-late/note/4','combined/note/5'],'共通テスト成績請求チケット','共通テスト利用・併用は、Web入学志願票に2027年度私立大学用の成績請求チケットを貼付します。未貼付、他年度、私立大学用以外のチケットは無効です。')])+
 table('受験票は出願サイトから各自で印刷',[
 matching('recommend-special/note/2','推薦2枠・特色','11月16日になっても受験票を確認できない場合は入試センターへ連絡してください。推薦書・調査書は2026年8月1日以降発行のもの。'),matching('general-early/note/2','前期・併用','2027年1月25日になっても受験票を確認できない場合は入試センターへ連絡してください。'),matching('general-late/note/2','後期2方式','2027年3月1日になっても受験票を確認できない場合は入試センターへ連絡してください。')],'tickets')+src(['guidelines-2027','regional-details-2027'],{'guidelines-2027':'冊子1～3・10～12・27～32ページ'});

 html+=h('kansai-recommendation-dates','推薦2枠・特色：試験と入学手続')+table('推薦2枠・特色に共通する選考日程',[
 group(rec,'schedule',3,'一次試験'),group(rec,'schedule',4,'一次合格発表'),group(rec,'schedule',5,'二次面接'),group(rec,'schedule',6,'二次合格発表'),group(rec,'schedule',7,'入学手続期限')],'recommendation-dates')+
 table('一次試験の内容',[
 take(['recommend-special/exam/6','recommend-general/exam/6','feature/exam/12'],'小論文'),take(['recommend-special/exam/7','recommend-general/exam/7','feature/exam/13'],'適性能力試験'),take(['recommend-special/exam/8','recommend-general/exam/8','feature/exam/14'],'配点','小論文・適性能力試験の配点は非公表です。')],'recommendation-tests')+
 list([take(['recommend-special/exam/10','recommend-general/exam/10','feature/exam/16'],'総合選考','一次・二次の成績と、推薦書・調査書・志望理由書等を総合して判定します。特色では活動報告書も対象。一次合格者だけが二次を受験できます。基準を満たす者がいない場合、募集人数を満たさないことがあります。'),group(rec,'note',0,'出願できる種類'),group(rec,'note',1,'志望理由書'),group(rec,'note',3,'合格後の入学前課題')])+src(['guidelines-2027','overview-2027','reason-form'],{'guidelines-2027':'冊子1～8ページ'});

 html+=h('kansai-recommendation-eligibility','推薦2枠・特色英語型/科学型の高校等資格')+p(group(rec,'exam',1,'高校等の条件'))+list([group(['recommend-special','recommend-general'],'exam',3,'学校推薦型2枠の履修条件'),group(rec,'schedule',8,'配慮申請の期限','推薦型の配慮申請は2026年10月1日までの受付です。現在は期限を経過しています。新たな事情がある場合の対応は入試センターへ確認してください。')])+src(['guidelines-2027','recommendation-form','accommodation-index'],{'guidelines-2027':'冊子4～7・35ページ'});
 html+=h('admission-scheme-recommend-special','学校推薦型：特別枠（専願）')+list([take('recommend-special/exam/2','評定・推薦条件'),take('recommend-special/exam/4','受験と入学の確約'),take('recommend-special/exam/5','出願時の提出書類'),take('recommend-special/note/4','推薦書の履修証明')])+
 p(take(['recommend-special/exam/12','recommend-special/note/5','coverage/5'],'卒後の勤務義務','卒業後、指定の医師臨床研修を2年、その後ただちに本学専攻医となり、医師不足診療科で本学に3年以上勤務する計5年以上の条件があります。本人と保護者が連名で誓約し、奨学金を受けない場合や返還した場合も勤務条件を遵守します。'))+
 list([take('recommend-special/note/6','特別枠奨学金'),{label:'指定の研修先・診療科',value:'臨床研修は本学附属病院・総合医療センター又は近畿2府4県の臨床研修指定病院。研修後は産婦人科・救急医学科・外科・麻酔科・内科・小児科が対象です。外科・内科では選択できる講座・診療科が指定されているため、誓約書と要項の詳細をご確認ください。',origins:['recommend-special/exam/12'],sourceIds:['special-pledge','guidelines-2027']}])+src(['guidelines-2027','special-pledge','recommendation-form'],{'guidelines-2027':'冊子4～5ページ'})+back;
 html+=h('admission-scheme-recommend-general','学校推薦型：一般枠（併願）')+list([take('recommend-general/exam/2','評定・学校長推薦'),take('recommend-general/exam/4','他大学との併願'),take('recommend-general/exam/5','出願時の提出書類'),take('recommend-general/note/4','履修科目証明'),take(['recommend-general/note/5','coverage/4'],'2028年度からの変更予告','全体の評定を4.3以上とする予告は2028年度入学者選抜からです。この2027年度の基準は3.5以上です。')])+src(['guidelines-2027','future-changes','recommendation-form'],{'guidelines-2027':'冊子5ページ'})+back;

 html+=h('admission-scheme-feature','特色選抜：英語型・国際型・科学型')+'<p>3型のいずれかで出願します。型別の募集人数は示されていません。他大学との併願が可能です。</p><h4>英語型</h4>';
 const ef=take('feature/exam/2','英語資格基準'),tf=take(['feature/exam/3','coverage/6'],'TOEFL');
 html+=score('英語資格・検定試験の基準',[ '試験','基準'],[['ケンブリッジ','160点以上'],['英検','CSE2,300点以上'],['GTEC CBT','1,180点以上'],['IELTS Academic','5.5以上'],['TEAP4技能','309点以上'],['TOEFL iBT','4（72）点以上・取扱い要確認'],['TOEIC L&R＋S&W×2.5','1,560点以上']].map(([label,value])=>({label,cells:[value],fact:label==='TOEFL iBT'?tf:ef})),'english-certificates')+
 list([take('feature/exam/4','スコアの有効期間・組合せ'),take('feature/note/4','実施形式・証明方法'),{...tf,label:'TOEFLの尺度・受理方法',value:'受験日ごとのスコア尺度と受理方法は入試センターへ確認してください。'},take('feature/exam/18','英語型の追加面接')])+ '<h4>国際型（IB）</h4>'+list([take('feature/exam/5','すべて必要な基本要件'),take('feature/exam/6','日本語はいずれか'),take('feature/exam/7','英語はいずれか'),take('feature/exam/8','指定科目・成績'),take(['feature/exam/9','coverage/7'],'見込み出願者の証明提出期限','資格取得見込みの終期は2027年3月31日ですが、合格者は資格証書の写しと出願要件を満たす証明を3月1日までに提出する旨が記載されています。期限までに提出できない場合は入学取消しとなります。該当者は提出可否・方法を大学へ確認してください。')])+
 '<h4>科学型</h4>'+list([take('feature/exam/10','対象大会・選出期間'),take('feature/exam/11','型ごとの出願書類'),take('feature/note/5','活動報告書')])+src(['guidelines-2027','activity-form','reason-form'],{'guidelines-2027':'冊子2・6～8ページ'})+back;

 html+=h('kansai-general-eligibility','一般・共通テスト利用・併用・地域枠の出願資格');
 const qual=take([...general,...regions].map(s=>`${s}/exam/1`));
 html+=`<div ${attrs(qual)}><p>次のいずれかの入学資格が必要です。地域枠の条件は認可前の予定です。</p><ul class="admission-conditions"><li>高校（中等教育学校後期課程を含む）卒業又は2027年3月卒業見込み。</li><li>通常の12年課程の学校教育修了又は2027年3月修了見込み。</li><li>2027年3月31日までに次の同等資格のいずれかに該当又は該当見込み。<ul><li>外国の12年課程修了又は修了見込み、又は大臣指定のこれに準ずる者。</li><li>大臣認定の在外教育施設の当該課程修了又は修了見込み。</li><li>修業年限3年以上等の基準を満たす大臣指定の専修学校高等課程を指定日以後に修了又は修了見込み。</li><li>文部科学大臣の指定者。</li><li>高卒認定（旧大学入学資格検定を含む）合格又は合格見込み。</li><li>本学の個別入学資格審査で高校卒業相当と認められ、18歳に達する者。</li></ul></li></ul></div>`+src(['guidelines-2027','regional-details-2027'],{'guidelines-2027':'冊子10ページ'});

 html+=h('kansai-general-dates','一般・共通テスト利用・併用：選考日程')+score('一次・二次・入学手続の時刻',['段階','前期・併用','後期'],[
 {label:'一次合格発表',cells:['2027年2月15日12:00','2027年3月12日10:00'],fact:take(['general-early/schedule/3','common-early/schedule/3','combined/schedule/3','general-late/schedule/3','common-late/schedule/3'])},
 {label:'二次合格発表',cells:['2027年3月1日10:00','2027年3月19日10:00'],fact:take(['general-early/schedule/4','common-early/schedule/4','combined/schedule/4','general-late/schedule/4','common-late/schedule/4'])},
 {label:'入学手続期限',cells:['2027年3月8日15:00','2027年3月25日15:00'],fact:take(['general-early/schedule/5','common-early/schedule/5','combined/schedule/5','general-late/schedule/5','common-late/schedule/5'])}
 ],'general-dates')+p(take(['combined/note/4','coverage/3'],'併用の発表訂正','併用試験の一次合格発表は、7月28日の訂正により印刷要項の15時から12時へ変更されています。'))+src(['guidelines-2027','correction-notice'],{'guidelines-2027':'冊子14～19ページ'});
 html+=h('admission-scheme-general-early','一般選抜：前期')+list([take('general-early/schedule/8','一次試験日・着席'),take('general-early/schedule/9','二次面接日'),take('general-early/note/4','前期の重複合格時の面接')])+'<p><a href="#kansai-individual-tests">個別試験の科目・配点・時間</a>／<a href="#kansai-venues">一次会場と定員</a></p>'+src(['guidelines-2027'],{'guidelines-2027':'冊子14ページ'})+back;
 html+=h('admission-scheme-general-late','一般選抜：後期')+list([take('general-late/schedule/8','一次試験日・着席'),take(['general-late/schedule/9','common-late/schedule/9'],'二次面接日')])+'<p>一次・二次とも枚方キャンパス医学部棟で実施します。<a href="#kansai-individual-tests">科目・配点・時間</a></p>'+src(['guidelines-2027'],{'guidelines-2027':'冊子15ページ'})+back;
 html+=h('admission-scheme-common-early','共通テスト利用：前期')+p(take(['common-early/schedule/8','common-late/schedule/8','combined/schedule/8'],'共通テスト日程'))+p(take('common-early/schedule/9','二次面接日'))+p(take('common-early/note/5','重複一次合格時の面接'))+'<p><a href="#kansai-common-tests">採用科目・配点と換算</a></p>'+src(['guidelines-2027','dnc-2027'],{'guidelines-2027':'冊子16ページ'})+back;
 html+=h('admission-scheme-common-late','共通テスト利用：後期')+'<p>共通テスト受験後に出願できる方式です。二次面接は一般後期と共通の3月16日です。<a href="#kansai-common-tests">採用科目・配点と換算</a></p>'+src(['guidelines-2027'],{'guidelines-2027':'冊子17ページ'})+back;
 html+=h('admission-scheme-combined','共通テスト・一般選抜併用')+list([take('combined/schedule/9','必須となる2つの試験'),take('combined/schedule/10','二次面接日'),take('combined/note/6','一般前期にも一次合格した場合')])+'<p><a href="#kansai-common-tests">共通テストの配点・換算</a>／<a href="#kansai-individual-tests">個別試験の配点・換算</a></p>'+src(['guidelines-2027'],{'guidelines-2027':'冊子18～19ページ'})+back;

 html+=h('kansai-individual-tests','一般・併用・地域枠の個別試験')+score('一般前後期・地域枠（予定）と併用の個別配点',['教科','時間','一般・地域','併用'],[
 {label:'理科2科目',cells:['9:30～11:30（120分）','200点','200点'],fact:take(['general-early/exam/2','general-late/exam/2','combined/exam/8',...regions.map(s=>`${s}/exam/5`)])},
 {label:'英語',cells:['12:50～14:10（80分）','150点','200点'],fact:take(['general-early/exam/3','general-late/exam/3','combined/exam/9',...regions.map(s=>`${s}/exam/6`)])},
 {label:'数学',cells:['14:50～16:20（90分）','150点','200点'],fact:take(['general-early/exam/4','general-late/exam/4','combined/exam/10',...regions.map(s=>`${s}/exam/7`)])},
 {label:'個別の合計',cells:['―','500点','600点'],fact:take(['general-early/exam/7','general-late/exam/7',...regions.map(s=>`${s}/exam/8`)])}
 ],'individual-scores')+
 list([{...take(['general-early/exam/2','general-late/exam/2','combined/exam/8',...regions.map(s=>`${s}/exam/5`)]),label:'理科の選択',value:'物理基礎・物理、化学基礎・化学、生物基礎・生物から2科目を問題配付後に選びます。各100点です。'},
 {...take(['general-early/exam/3','general-late/exam/3','combined/exam/9']),label:'英語の範囲',value:'英語コミュニケーションⅠ・Ⅱ・Ⅲ、論理・表現Ⅰ・Ⅱ・Ⅲ。地域枠の別紙には表記差があるため、地域枠の注意事項もご確認ください。'},
 {...take(['general-early/exam/4','general-late/exam/4','combined/exam/10',...regions.map(s=>`${s}/exam/7`)]),label:'数学の範囲',value:'数学Ⅰ・Ⅱ・Ⅲ・A・B・C。Aの「数学と人間の活動」、Bの「数学と社会生活」「統計的な推測」、Cの「数学的な表現の工夫」を除きます。'},
 take(['general-early/exam/5','general-late/exam/5','combined/exam/11',...regions.map(s=>`${s}/note/${s==='regional-osaka'?4:2}`)],'解答形式・理科の調整','一部記述式、英語は一部マークシートです。理科の科目間に差が生じた場合、得点調整を行うことがあります。地域枠は認可前の予定です。'),
 {...take(['combined/exam/9','combined/exam/10']),label:'併用の個別得点の換算',value:'併用の英語・数学は、一般前期の各150点満点の得点を各200点満点へ換算します。'}])+src(['guidelines-2027','regional-details-2027'],{'guidelines-2027':'冊子14～15・19・21ページ'});

 html+=h('kansai-common-tests','共通テストの採用科目・配点・換算')+score('3方式の共通テスト配点',['教科','前期','後期','併用'],[
 {label:'国語',cells:['100点','採用なし','100点'],fact:take(['common-early/exam/2','combined/exam/2'])},
 {label:'地歴・公民1科目',cells:['100点','採用なし','100点'],fact:take(['common-early/exam/3','combined/exam/3'])},
 {label:'数学2科目',cells:['200点','200点','100点'],fact:take(['common-early/exam/4','common-late/exam/2','combined/exam/4'])},
 {label:'理科2科目',cells:['200点','200点','200点'],fact:take(['common-early/exam/5','common-late/exam/3','combined/exam/5'])},
 {label:'英語',cells:['200点','200点','100点'],fact:take(['common-early/exam/6','common-late/exam/4','combined/exam/6'])},
 {label:'共通テスト合計',cells:['800点','600点','600点'],fact:take(['common-early/exam/8','common-late/exam/6','combined/exam/12'])}
 ],'common-scores')+
 list([{...take(['common-early/exam/2','combined/exam/2']),label:'国語の範囲・換算',value:'近代以降の文章だけを採用し、110点満点の得点を100点満点へ換算します。'},
 take(['common-early/exam/3','combined/exam/3'],'地歴・公民の選択','地理総合・地理探究、歴史総合・日本史探究、歴史総合・世界史探究、公共・倫理、公共・政治・経済、地理総合／歴史総合／公共から1科目。2科目受験した場合は高得点を採用します。最後の組合せ科目は2出題範囲を選択して解答します。'),
 take(['common-early/exam/4','common-late/exam/2','combined/exam/4'],'数学の指定科目・併用の換算','数学Ⅰ・数学Aと数学Ⅱ・数学B・数学Cの両方が必要です。併用では各科目の100点満点を50点満点へ換算します。'),
 take(['common-early/exam/5','common-late/exam/3','combined/exam/5'],'理科の指定科目','物理・化学・生物から2科目を採用します。'),
 take(['common-early/exam/6','common-late/exam/4','combined/exam/6'],'英語の換算','リスニングを含み、リーディングとリスニングの配分は3対1です。'),
 take(['common-early/exam/7','common-late/exam/5','combined/exam/7'],'情報Ⅰ','情報Ⅰは採用科目に含まれていません。'),
 {...take('combined/exam/12'),label:'併用の総合計',value:'併用は共通テストと個別試験の合計1,200点で選考します。'}])+src(['guidelines-2027'],{'guidelines-2027':'冊子16～19ページ'});

 html+=h('kansai-interview','二次面接・合格判定・補欠')+list([
 take(['recommend-special/exam/9','recommend-general/exam/9','feature/exam/15','general-early/exam/6','general-late/exam/6','common-early/exam/9','common-late/exam/7','combined/exam/13',...regions.map(s=>`${s}/exam/9`)],'個別面接の評価','個別面接は段階評価で、課題解決型面接を含みます。2回受験する場合があり、面接は録音されます。調査書等も参考に学力の三要素と医師としての資質・適性を評価します。地域枠は認可前の予定で、必ず地域枠として面接を受け、その結果を重複合格している他方式にも用います。'),
 matching('general-early/note/3','補欠繰上げ'),
 {label:'指定日・集合時刻',value:'一次合格者だけが二次を受験できます。前期の複数方式に一次合格しても大学指定の1日で判定し、指定日に受験しない場合はすべての二次の受験資格を放棄した扱いとなります。指定日の変更はできません。集合時刻・受験室は一次合格発表時の案内と受験票をご確認ください。',origins:['general-early/note/4','common-early/note/5','combined/note/6'],sourceIds:['guidelines-2027']}
 ])+src(['guidelines-2027'],{'guidelines-2027':'日程表・冊子8・12～21ページ'});

 html+=h('kansai-regional','地域枠：認可申請中の予定')+p(take(['coverage/2',...regions.map(s=>`${s}/schedule/0`),...regions.map(s=>`${s}/note/0`)],'認可前の案内','以下の地域枠の日程・試験・貸与制度は、臨時定員増認可申請中の予定です。認可後に正式な試験の詳細と同意書が公表される予定です。'))+
 table('両地域枠に共通する予定日程',[
 group(regions,'schedule',3,'一次試験','2027年2月2日。8:30入室、9:10着席。'),group(regions,'schedule',4,'一次合格発表','2027年2月15日12:00。'),group(regions,'schedule',5,'地域枠の二次面接','2027年2月20日。集合時刻は一次合格発表時に通知。'),group(regions,'schedule',6,'二次合格発表','2027年3月1日10:00。'),group(regions,'schedule',7,'入学手続','2027年3月8日15:00。')],'regional-dates')+
 list([group(regions,'exam',2,'出身地・高校所在地の条件','出身地・出身高校所在地による制限はありません。地域医療への従事等の条件を理解する必要があります。'),group(regions,'exam',3,'選択する地域・併願・入学確約','出願できる地域は一方だけです。一般前期・共通テスト前期・併用との併願ができますが、地域枠に合格した場合は地域枠で入学します。他方式に合格しても、後期を受験して合格しても他方式での入学はできません。'),group(regions,'exam',4,'府県所定の同意書','Web入学志願票、調査書・証明書等に加え、府県所定の同意書を提出します。同意書は認可後の公開予定です。'),take(['regional-osaka/note/3','regional-shizuoka/note/1','coverage/10'],'英語科目の表記差','英語の論理・表現は、総合要項がⅠ・Ⅱ・Ⅲ、地域枠別紙がⅠ・Ⅲ・Ⅲと記載しており相違があります。個別試験の範囲表は総合要項によるものです。受験前に大学の最新案内で確認してください。')])+src(['guidelines-2027','regional-index','regional-details-2027'],{'guidelines-2027':'冊子20～24ページ'});
 html+=score('地域枠の修学資金（認可前の制度予定）',['項目','大阪府','静岡県'],[
 {label:'貸与額',cells:['月10万円・年120万円','月20万円・年240万円'],fact:take(['regional-osaka/exam/11','regional-shizuoka/exam/11'])},
 {label:'貸与期間',cells:['6年間・必須','6年間・必須'],fact:take(['regional-osaka/exam/11','regional-shizuoka/exam/11'])},
 {label:'貸与利息',cells:['年率10%','年率10%'],fact:take(['regional-osaka/exam/11','regional-shizuoka/exam/11'])}
 ],'regional-loans')+'<p>留年した年度は貸与されません。返還免除には、それぞれの所定条件をすべて満たす必要があります。</p>';
 html+=h('admission-scheme-regional-osaka','地域枠：大阪府（認可申請中）')+list([take('regional-osaka/note/1','申請人数の変更','9月16日に大阪府の申請人数は旧予定3名から2名へ変更されています。'),take('regional-osaka/exam/12','返還免除の全5必須条件'),take('regional-osaka/note/5','⑤ア：周産期医療'),take('regional-osaka/note/6','⑤イ：小児医療と3年間の勤務先'),take('regional-osaka/note/7','⑤ウ：救急医療'),take('regional-osaka/note/8','⑤エ：総合診療'),take('regional-osaka/note/9','⑤オ：総合診療・内科と感染症診療'),take('regional-osaka/note/10','指定診療業務・医療機関の変更'),take('regional-osaka/note/2','勤務先の指定・離脱と免許取得条件')])+src(['regional-index','osaka-loan','regional-details-2027','guidelines-2027'],{'guidelines-2027':'冊子22ページ'})+back;
 html+=h('admission-scheme-regional-shizuoka','地域枠：静岡県（認可申請中）')+list([take('regional-shizuoka/exam/12','返還免除の必須条件')])+src(['shizuoka-loan','regional-index'])+back;

 html+=h('kansai-venues','試験会場・受験票の指定')+list([
 take(['general-early/venue/0','combined/venue/1',...regions.map(s=>`${s}/venue/0`)],'個別一次の4会場','一般前期・併用の個別一次は大阪ATCホール、東京TRC東京流通センター、名古屋コンベンションホール、福岡南近代ビルで実施します。地域枠も同会場の予定です。'),take(['general-early/venue/1','combined/venue/2',...regions.map(s=>`${s}/venue/1`)],'地方会場の予定定員','東京500名、名古屋280名、福岡360名。地域枠は予定です。定員を超過した会場には出願できません。'),
 take([...entries].filter(([key,r])=>key.includes('/venue/')&&r.value.includes('枚方キャンパス')).map(([key])=>key),'枚方キャンパス医学部棟','推薦2枠・特色と一般後期の一次、本学での二次面接は、枚方キャンパス医学部棟（大阪府枚方市新町2-5-1）です。入試会場案内は京阪「枚方市」駅から徒歩5分と案内しています。個別の試験室・集合時刻は受験票等をご確認ください。'),
 take(['common-early/venue/0','common-late/venue/0','combined/venue/0'],'共通テスト会場','共通テストは大学入試センターが指定する受験地です。')])+src(['guidelines-2027'],{'guidelines-2027':'冊子8・14～21・33～34ページ'});

 html+=h('kansai-fees','検定料・同時出願の料金')+table('単願時の検定料と併願時の取扱い',[
 take(['recommend-special/exam/11','recommend-general/exam/11','feature/exam/17','general-early/exam/8','general-late/exam/8','combined/exam/14'],'推薦2枠・特色・一般・併用','各60,000円。'),take(['common-early/exam/10','common-late/exam/8'],'共通テスト利用前後期','各30,000円。'),matching('general-early/note/0','同時出願の割引','前期3方式のうち2種類を同時出願する場合、又は一般後期と共通テスト後期を同時出願する場合は90,000円。前期3種類を同時出願する場合は120,000円です。個別出願・追加出願では割引は適用されません。別途手数料が必要です。'),group(regions,'exam',10,'地域枠の予定検定料','60,000円。併願する場合は他方式の検定料へ60,000円を加算する予定です。')],'fees')+src(['guidelines-2027','regional-details-2027'],{'guidelines-2027':'冊子3・12・20ページ'});
 html+=h('kansai-eligibility-accommodation','個別資格審査・受験上の配慮')+list([
 take([...general.map(s=>`${s}/schedule/6`),...regions.map(s=>`${s}/schedule/8`),'coverage/8','coverage/23'],'個別資格審査','高校段階をもつ修業年限12年の外国人学校の卒業・卒業見込み者は、2027年3月31日までに満18歳かつ高校3年相当の学習歴が必要です。申請は2026年12月1日必着で、所定申請書、卒業・卒業見込み証明、成績証明、学校の課程・単位・認定等の資料と返信用封筒・760円分切手を簡易書留で郵送します。認定者は出願時に大学提出用認定書を添えます。取得できる申請書には地域枠の選択欄がないため、地域枠での記載方法は大学へ確認してください。'),
 take(['general-early/schedule/7','common-early/schedule/7','combined/schedule/7','general-late/schedule/7','common-late/schedule/7',...regions.map(s=>`${s}/schedule/9`)],'配慮申請の試験別期限','一般・共通テスト利用・併用の前期は2026年11月2日、後期は12月1日まで。地域枠の公式ページは11月2日必着と案内しています。推薦型の10月1日の期限は経過しています。地域枠の選択欄がないため、記載方法と事情が生じた場合の対応は大学へ確認してください。'),
 take('coverage/24','配慮申請の書類・方法'),take('coverage/9','取得できる書式と公開待ちの記載','配慮申請ページや地域枠の資格審査案内には、後日公開・ダウンロード不可という記載が残っていますが、リンク先の資格審査要領と配慮申請書は取得できます。配慮申請書にも地域枠の選択欄がないため、その適用・提出方法を入試センターへ確認してください。')])+src(['eligibility-guide','accommodation-form','accommodation-index','regional-index','guidelines-2027'],{'guidelines-2027':'冊子10・35ページ'});
 html+=h('kansai-disaster','被災した志願者の検定料免除')+list([take('coverage/12','対象となる災害・被害'),take('coverage/19','申請書類・審査・事後申請')])+src(['disaster-index']);
 html+=h('kansai-enrollment','入学手続・学納金・辞退返還')+p(take('coverage/22','入学手続の完了'))+table('2027年度の通常学生の学納金・諸費用',[
 take('coverage/13','学納金','初年度290万円、6年間総計2,100万円。'),take('coverage/13','別途諸費用','初年度27万円、次年度以降毎年5.6万円。初年度に含む電子教科書代等は予定額です。'),take(['general-early/note/6','coverage/14'],'特待生','一般前期合格者の上位30名は、初年度の授業料・実験実習費・施設設備費・教育充実費の計190万円が免除されます。')],'tuition')+
 list([take('coverage/16','辞退による納入金返還'),take('coverage/20','入学金半額返還の対象'),take('coverage/15','一般一次不合格者の成績開示')])+src(['guidelines-2027'],{'guidelines-2027':'冊子36～38ページ'});

 html+='<h2 id="大学基本情報">大学基本情報</h2>'+list([take('basic/0'),take('basic/1')])+src(['university-contact','university-access','admission-access','guidelines-2027'],{'guidelines-2027':'冊子33ページ'})+h('kansai-statistics','2026年度医学科入学者：男女別・現役既卒');
 const stats=(kind:string,fact:Row,rows:[string,number][])=>score('2026年度・医学科入学者117人（入試FAQ掲載）',['区分','人数','割合'],rows.map(([label,n])=>({label,cells:[n+'人',(n/117*100).toFixed(1)+'%'],fact})),kind);
 html+=stats('gender',take('basic/2'),[['男性',62],['女性',55],['合計',117]])+stats('school-years',take('basic/3'),[['現役',49],['既卒',68],['合計',117]])+'<p>割合は同じFAQの入学者総数を母数に、小数第1位へ丸めています。現役数は括弧内の男性21人と女性28人の合計、既卒数は総数から現役数を引いて算出しています。</p>'+p(take('basic/4'))+src(['faq-current','medical-data'])+`<p class="admission-verification-date">公式資料確認日：<time datetime="${esc(data.verifiedAt)}">${esc(data.verifiedAt.slice(0,10))}</time></p></section>`;
 const missing=[...entries.keys()].filter(o=>!seen.has(o)&&!['coverage/17','coverage/18'].includes(o));if(missing.length)throw Error('Kansai facts not placed: '+missing.join(', '));
 return html;
}
