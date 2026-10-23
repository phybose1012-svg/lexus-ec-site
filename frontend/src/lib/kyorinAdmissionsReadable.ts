import raw from '../data/universityAdmissions/kyorin.json' with {type:'json'};
import type {UniversityAdmissions} from './universityAdmissions.ts';
import {admissionFactAttributes as attrs,escapeAdmissionText as esc,renderAdmissionReaderTable as table,renderAdmissionReaderSources as sources} from './admissionsReaderPrimitives.ts';
import type {AdmissionReaderRow as Row} from './admissionsReaderPrimitives.ts';

export const kyorinSupplementarySources:Record<string,{url:string;sha256:string}>={
  "gunma-pref-guide": {
    "url": "https://www.pref.gunma.jp/uploaded/attachment/708802.pdf",
    "sha256": "047dd3f1d3a0828c8cc27395d3f6a11e14814e59982d15176fd459830b98bca4"
  },
  "gunma-pref-rule": {
    "url": "https://ops-jg.d1-law.com/opensearch/SrJbF01/init?houcd=H421902100033&jbnJiten=5080611&jctcd=8A7FE9A39A&no=2&totalCount=2",
    "sha256": "40e06d22c43a1fa9061cf3ac08c4da63d31c8a6ccbb8580bfac5482c176673d2"
  }
};
export function kyorinAdmissionsMetadata(data:UniversityAdmissions){return {
 title:'杏林大学医学部｜2027年度入試情報',displayTitle:'杏林大学 医学部2027年度入試情報',displayTitleLines:['杏林大学 医学部','2027年度入試情報'],
 description:'杏林大学医学部医学科2027年度の一般・共通テスト利用・外国人留学生・地域枠。日程、科目・配点、資格、会場、学費と修学資金の条件、三鷹キャンパスの基本情報を掲載。',
 lead:'杏林大学医学部医学科の2027年度入試を、一般選抜・共通テスト利用・外国人留学生選抜と、東京都・新潟県・群馬県の地域枠に分けてまとめます。日程、科目・時間・配点・範囲、出願資格、会場、学費・修学資金と卒業後の勤務条件、大学基本情報を掲載しています。出願前に当該年度の募集要項と変更通知をご確認ください。',
 modified:new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(data.verifiedAt)),
 keyPoints:[
  '一般選抜は地域枠を含め79人、一次試験は2027年2月2日。英語・数学・理科2科目で350点です。',
  '共通テスト利用は25人・600点。数学2科目と理科2科目、英語または国語を使い、大学の二次試験も受験します。大学の二次は小論文60分・面接です。',
  '地域枠は東京都8人・新潟県4人・群馬県1人の認可申請予定。一般選抜と同時出願し、合格時の入学確約と修学資金・指定勤務の条件があります。'
 ]
};}
const h2=(id:string,title:string)=>`<h2 id="kyorin-${id}">${esc(title)}</h2>`,sub=(title:string)=>`<p class="kyorin-subtitle">${esc(title)}</p>`;
export function renderKyorinAdmissionsReadable(data:UniversityAdmissions){
 const all:Row[]=[];
 for(const s of data.schemes)for(const[k,key]of [['schedule','scheduleRows'],['exam','examRows'],['venue','venueRows'],['note','notes']] as const)s[key].forEach((r,i)=>all.push({label:'label'in r?r.label:'条件・注意',value:'value'in r?r.value:r.text,sourceIds:r.sourceIds,status:'status'in r?r.status:undefined,origins:[`${s.id}/${k}/${i}`]}));
 const coverageLabels=['募集方式','地域枠の募集人数','大学二次の案内','留学生の書類提出','群馬県の貸与条件','学納金以外の費用','出願の完了条件','地域枠の入学確約と辞退','東京都の受給条件','県別の指定勤務','留学生の日本語試験','成績開示','外国籍者の居住・在留資格','遅刻・感染症','合否照会と通知','入学手続書類の持参','地域枠の貸与継続','東京都の返還猶予'];
 const covSources=[['guide'],['guide','index'],['guide','index'],['foreign-guide'],['gunma-guide','gunma-4','gunma-pref-guide','gunma-pref-rule'],['guide'],['guide'],['guide','tokyo-forms','niigata-forms','gunma-forms'],['tokyo-4','tokyo-7-seiyaku'],['niigata-3','gunma-4'],['foreign-guide'],['guide'],['guide','foreign-guide'],['guide'],['guide'],['guide'],['tokyo-guide','niigata-guide','gunma-guide','niigata-5-kitei'],['tokyo-4']];
 data.coverageNotes.forEach((value,i)=>all.push({label:coverageLabels[i],value,sourceIds:covSources[i],origins:[`coverage/${i}`]}));raw.basicInfoRows.forEach((r,i)=>all.push({...r,origins:[`basic/${i}`]}));
 const used=new Set<string>(),get=(id:string)=>{const r=all.find(r=>r.origins[0]===id);if(!r)throw Error('Unknown Kyorin fact '+id);return r;},ids=(s:string,k:string,ns:number[])=>ns.map(n=>`${s}/${k}/${n}`);
 const mark=(originIds:string[],label?:string,value?:string):Row=>{const rs=originIds.map(get);originIds.forEach(id=>used.add(id));return{label:label??rs[0].label,value:value??rs[0].value,origins:originIds,sourceIds:[...new Set(rs.flatMap(r=>r.sourceIds))],...(rs.some(r=>r.status==='needs-confirmation')?{status:'needs-confirmation'}:{})};};
 const take=(s:string,k:string,ns:number[])=>ids(s,k,ns).map(id=>mark([id]));
 const cond=(rows:Row[])=>rows.map(r=>`<div class="kyorin-condition" ${attrs(r)}><p><strong>${esc(r.label)}</strong></p><p>${esc(r.value)}</p></div>`).join('');
 const wrap=(origins:string[],html:string)=>`<div ${attrs(mark(origins))}>${html}</div>`;
 const src=(sourceIds:string[])=>sources(data.sources.filter(s=>sourceIds.includes(s.id)).map(s=>({...s,title:`${s.title}${s.pages?`／${Array.isArray(s.pages)?'PDF物理p.'+s.pages.join('、'):s.pages}`:''}／確認日 ${new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(s.retrievedAt))}`})));
 const num=(caption:string,headers:string[],rows:string[][],origins:string[][])=>`<table class="kyorin-numbers kyorin-cols-${headers.length}" data-admission-table="scores"><caption>${esc(caption)}</caption><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((cells,i)=>`<tr ${attrs(mark(origins[i]))}>${cells.map((v,k)=>`<${k?'td':'th scope="row"'}>${esc(v)}</${k?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table>`;
 const regions=['tokyo-region','niigata-region','gunma-region'],academic=['general','foreign',...regions],names=Object.fromEntries(data.schemes.map(s=>[s.id,s.name.replace('（認可申請予定）','')]));
 let html=h2('overview','入試方式・募集人数・主要日程')+cond([mark(['coverage/0','coverage/1','general/exam/0'],'募集人数の内訳','医学科の募集は合計105人。地域枠は一般選抜の内数で、認可申請予定として案内されています。')]);
 html+=`<table class="kyorin-overview" data-admission-table="overview"><caption>2027年度医学部医学科 6方式の主要日程</caption><thead><tr><th scope="col">入試方式</th><th scope="col">募集人数</th><th scope="col">出願</th><th scope="col">試験日</th></tr></thead><tbody>${data.schemes.map(s=>{const quota=s.id==='general'?'79人（地域枠を含む）':s.id==='common-test'?'25人':s.id==='foreign'?'1人':s.id==='tokyo-region'?'8人（予定・一般の内数）':s.id==='niigata-region'?'4人（予定・一般の内数）':'1人（予定・一般の内数）';return`<tr ${attrs(mark([`${s.id}/exam/0`,`${s.id}/schedule/0`]))}><th scope="row"><a href="#kyorin-${s.id}">${esc(names[s.id])}</a></th><td data-label="募集人数">${quota}</td><td data-label="出願">${s.id==='common-test'?'2026/12/15 9:00':'2026/12/1 9:00'}～2027/1/15 17:00</td><td data-label="試験日">${s.id==='common-test'?'共通テスト1/16・17／二次2/20':s.id==='general'||s.id==='foreign'?'一次2/2／二次2/11・12の指定日':'一次2/2／二次2/11'}</td></tr>`;}).join('')}</tbody></table>`+src(['guide','foreign-guide','index']);
 html+=h2('general','一般選抜')+table('一般選抜の出願・試験・入学手続日程',take('general','schedule',[0,4,5,6,7,8]))+sub('一般選抜の出願資格')+cond(take('general','venue',[4]));
 const aIds=(general:number[],foreign:number[],regional:number[])=>[...ids('general','exam',general),...ids('foreign','exam',foreign),...regions.flatMap(s=>ids(s,'exam',regional))];
 html+=sub('一般・外国人留学生・地域枠の学力試験')+num('一次試験350点・マークシート方式',['教科','配点','時間'],[['理科2科目','各75点','10:30～12:10（100分）'],['数学','100点','13:30～14:40（70分）'],['英語','100点','15:40～16:40（60分）']],[aIds([1,4],[2,5],[3,6]),aIds([1,4],[2,5],[3,6]),aIds([1,4],[2,5],[3,6])]);
 html+=wrap(aIds([2,3],[3,4],[4,5]),'<ul><li>理科は物理基礎・物理、化学基礎・化学、生物基礎・生物から、問題配付後に2科目を選択します。</li><li>数学はⅠ・Ⅱ・Ⅲ・A・B・C。数学Bの「統計的な推測」は出題範囲に含みません。</li><li>英語は英語コミュニケーションⅠ～Ⅲ、論理・表現Ⅰ～Ⅲ。</li></ul>');
 html+=num('一般・外国人留学生・地域枠の二次試験',['試験','時間'],[['小論文','9:00～10:00（60分）'],['面接','10:30～17:00のうち指定された時刻。受験番号等により開始・終了が異なります。']],[aIds([5],[6],[7]),aIds([5],[6],[7])]);
 html+=cond([mark(aIds([6],[7],[8]),'合否判定'),mark([...aIds([7],[8],[9]),'common-test/exam/7'],'6方式共通のWeb志願票'),mark(['general/note/0'],'二次試験当日の面接資料')]);
 html+=table('一般・外国人留学生・地域枠の試験会場',[mark(academic.map(s=>`${s}/venue/0`),'一次会場'),mark(academic.map(s=>`${s}/venue/1`),'二次会場')],'venue')+src(['guide','foreign-guide','tokyo-guide','niigata-guide','gunma-guide']);
 html+=h2('common-test','大学入学共通テスト利用選抜')+table('共通テスト利用の出願・試験・入学手続日程',take('common-test','schedule',[0,4,5,6,7,8]))+sub('共通テスト利用の出願資格')+wrap(['common-test/venue/3'],'<p><a href="#kyorin-general">一般選抜と同じ大学入学資格</a>が必要です。加えて、2027年度大学入学共通テストの指定教科・科目を受験してください。</p>');
 html+=num('共通テスト600点の指定科目',['教科','配点','指定科目'],[['数学','各100点','数学Ⅰ・A、数学Ⅱ・B・Cの両方'],['理科','各100点','物理・化学・生物から2科目'],['英語または国語','200点','英語はR100点＋L100点。国語は近代以降の文章のみ']],[ids('common-test','exam',[1,2]),ids('common-test','exam',[1,2]),ids('common-test','exam',[1,3])]);
 html+=wrap(ids('common-test','exam',[3]),'<p>国語は110点満点を200点へ換算します。英語と国語を両方受験した場合は、高得点の科目を採用します。</p>');
 html+=cond([mark(['common-test/exam/4','common-test/exam/5','common-test/note/0','coverage/2'],'大学の二次試験','二次は小論文（60分）と面接です。入室8:00～8:20、面接資料作成8:20～8:45、諸注意8:45～9:00、小論文9:00～10:00、面接10:30～17:00の指定時刻。面接の開始は受験番号等により異なり、終了が遅くなる場合があります。Web一覧の表記は「教科・科目に係る個別テスト」です。受験前に最新の募集要項・変更通知と大学の指定をご確認ください。'),...take('common-test','exam',[6])]);
 html+=table('共通テスト利用の会場と成績請求',take('common-test','venue',[0,5]),'venue')+src(['guide','index']);
 html+=h2('foreign','外国人留学生選抜')+table('外国人留学生の出願・試験・入学手続日程',take('foreign','schedule',[0,3,4,5,6,7]));
 html+=sub('外国人留学生の出願資格・書類')+cond([...take('foreign','exam',[1]),mark(['coverage/10'],'日本語試験の扱い'),...take('foreign','venue',[2,3,4]),mark(['foreign/schedule/2','foreign/note/1','coverage/3'],'出願書類の提出先・持参可否')]);
 html+='<p>試験科目・配点・出題範囲・会場は、上の<a href="#kyorin-general">一般・外国人留学生・地域枠の学力試験</a>をご覧ください。</p>'+src(['foreign-guide']);
 html+=h2('regional-common','地域枠3都県の共通日程・選考')+table('東京都・新潟県・群馬県地域枠の出願・試験・入学手続日程',[0,1,2,3,4,6,7].map(n=>mark(regions.map(s=>`${s}/schedule/${n}`))));
 html+=cond([mark(regions.map(s=>`${s}/schedule/5`),'地域枠の二次試験','二次は2027年2月11日に小論文・面接を受験します。東京都地域枠は大学の面接に加えて東京都の面接も受けます。'),mark(regions.map(s=>`${s}/exam/2`),'入学確約・地域枠の併願'),mark(regions.map(s=>`${s}/venue/4`),'3都県共通の大学誓約書'),mark(regions.map(s=>`${s}/note/0`),'一般選抜への選考'),mark(['coverage/9'],'県別の勤務条件'),mark(['coverage/16'],'修学資金の継続')]);
 html+='<p>学力試験・出題範囲・会場は<a href="#kyorin-general">一般選抜と共通</a>です。地域枠の出願には一般選抜の書類と、以下の都県別書類の両方が必要です。</p>'+src(['tokyo-guide','niigata-guide','gunma-guide','niigata-5-kitei']);
 for(const id of regions){const region=id.split('-')[0];html+=h2(id,names[id]) +sub(names[id]+'の資格・提出書類')+cond([mark([`${id}/exam/1`]),...take(id,'venue',[3])]);
  if(id==='tokyo-region')html+=table('東京都修学資金の貸与説明会',take(id,'schedule',[8]));
  html+=sub(names[id]+'の貸与・勤務・返還条件')+cond(take(id,'exam',[10,11,12,13]))+cond([mark([`${id}/note/1`,...(region==='tokyo'?['coverage/8','coverage/17']:region==='gunma'?['coverage/4']:[])],region==='tokyo'?'返還猶予と契約の確認':region==='gunma'?'規則本文と適用条件':'返還猶予・勤務中断',region==='tokyo'?`${get('coverage/17').value}${get(id+'/note/1').value}`:get(id+'/note/1').value)]);
  html+=src(data.sources.filter(s=>s.id.startsWith(region+'-')).map(s=>s.id));
 }
 html+=h2('procedures','出願・受験・入学手続の共通条件');
 html+=sub('検定料・出願書類・受験票');
 const feeRows=[...take('general','schedule',[2]),...take('common-test','schedule',[2]),...take('foreign','schedule',[1]),mark(['general/schedule/3','common-test/schedule/3'],'一般・共通テスト利用：支払期限')].map(r=>({...r,label:r.origins[0]==='general/schedule/3'?r.label:(r.origins[0].startsWith('foreign')?'外国人留学生':r.origins[0].startsWith('common-test')?'共通テスト利用':'一般選抜')+'：'+r.label}));html+=table('方式別の検定料と支払期限',feeRows);
 html+=cond([mark(['general/schedule/1','common-test/schedule/1'],'一般・共通テスト利用の書類郵送'),mark(['general/venue/3','common-test/venue/2'],'一般・共通テスト利用の出願書類'),mark(['general/venue/2','common-test/venue/1','foreign/venue/5',...regions.map(s=>`${s}/venue/2`)],'受験票'),mark(['general/venue/5','common-test/venue/4'],'受験上の配慮'),mark(['coverage/6'],'出願完了の条件'),mark(['coverage/12'],'外国籍者の居住・在留資格')]);
 html+=sub('受験当日・合否照会・補欠・入学手続')+cond([mark(['coverage/13'],'遅刻・感染症'),mark(['coverage/14'],'合否照会'),mark(['general/schedule/9','common-test/schedule/9','foreign/schedule/8'],'補欠連絡'),mark(['coverage/15'],'入学手続書類の持参')])+src(['guide','foreign-guide']);
 const feeOrigins=(ns:number[])=>[...ids('general','exam',ns),...ids('common-test','exam',ns),...ids('foreign','exam',ns.map(n=>n+1)),...regions.flatMap(s=>ids(s,'exam',ns.map(n=>n+6)))];
 html+=h2('fees','2027年度の学費・諸費・辞退時の返還')+num('学納金の内訳（単位：万円）',['項目','初年度','2～6年次・各年'],[['入学金','150','入学時のみ'],['授業料','300','300'],['実験実習費','100','100'],['施設設備費','400','150'],['年額合計','950','550']],[feeOrigins([8,10]),feeOrigins([8,10]),feeOrigins([8,10]),feeOrigins([8,10]),feeOrigins([8,10])]);
 html+=wrap(feeOrigins([8,10]),'<p>初年度は入学手続時550万円・9月400万円、2年次以降は前期と後期に各275万円を納入します。6年間の学納金は3,700万円です。</p>');
 html+=num('入学手続時に別途納入する諸費（初年度のみ）',['項目','金額'],[['杏会（保護者会）','350,000円'],['同窓会','300,000円'],['学生会','136,000円'],['学生教育研究災害傷害保険','4,700円'],['合計','790,700円']],[feeOrigins([9]),feeOrigins([9]),feeOrigins([9]),feeOrigins([9]),feeOrigins([9])]);
 html+=cond([mark(['coverage/5'],'その他の費用','学納金と諸費の6年間合計は37,790,700円。PC・教材・生活費等は別途必要で、保険料等は変更される場合があります。'),mark(['foreign/note/0'],'外国人留学生の学費・個別条件'),mark(feeOrigins([11]),'入学辞退・納付金返還'),mark(['coverage/7'],'地域枠の確約・貸与義務'),mark(['general/note/1'],'在学中の医学部優秀賞')])+src(['guide','foreign-guide','tokyo-guide','niigata-guide','gunma-guide']);
 html+=h2('disclosure','入試成績の開示')+cond([mark(['coverage/11'])])+src(['guide']);
 html+=h2('basic','医学科の所在地・アクセス・公表統計')+table('三鷹キャンパスの所在地・問い合わせ・交通',Array.from({length:7},(_,i)=>mark([`basic/${i}`])),'basic')+table('最新公表の医学科入学者・医学部学生数',[mark(['basic/7']),mark(['basic/8'])],'basic')+src(['access','mitaka-access','basic-data','guide']);
 const missing=all.filter(r=>!used.has(r.origins[0]));if(missing.length)throw Error('Unplaced Kyorin facts: '+missing.map(r=>r.origins[0]).join(','));
 return `<div class="admission-readable kyorin-readable" data-admission-reader="kyorin">${html}</div><style>
 .article-content .kyorin-readable table{margin:18px 0 22px;font-size:14px;line-height:1.75}
 .article-content .kyorin-readable caption{text-align:left;font-weight:750;padding:0 0 10px}
 .article-content .kyorin-readable :is(th,td){padding:11px 12px;vertical-align:top;overflow-wrap:anywhere}
 .article-content .kyorin-readable thead th{background:#edf3f5;color:#234c62}
 .article-content .kyorin-readable tbody th{background:#faf8f3;text-align:left;font-weight:650}
 .article-content .kyorin-readable table:not(.kyorin-numbers):not(.kyorin-overview) :is(thead th:first-child,tbody th){width:28%}
 .article-content .kyorin-readable table:not(.kyorin-overview) thead th:last-child{width:auto}
 .article-content .kyorin-readable .kyorin-subtitle{font-weight:800;margin:24px 0 10px;color:#234c62}
 .article-content .kyorin-readable .kyorin-condition{margin:18px 0;overflow-wrap:anywhere}
 .article-content .kyorin-readable .kyorin-condition p{margin:5px 0}
 .article-content .kyorin-readable [data-admission-status="needs-confirmation"]{border-left:3px solid #c78b36;padding-left:12px}
 .article-content .kyorin-readable .admission-sources{margin:12px 0 28px;font-size:12px;color:#686055}
 .article-content .kyorin-readable .admission-sources summary{cursor:pointer}
 .article-content .kyorin-readable .kyorin-numbers th:first-child{width:30%}
 .article-content .kyorin-readable .kyorin-numbers thead th:nth-child(2){width:22%}
 @media(max-width:600px){
 .article-content .kyorin-readable table{font-size:12px}
 .article-content .kyorin-readable :is(th,td){padding:9px 7px}
 .article-content .kyorin-readable .kyorin-overview :is(thead,thead th){position:absolute;width:1px;height:1px;padding:0;border:0;overflow:hidden;clip-path:inset(50%)}
 .article-content .kyorin-readable .kyorin-overview :is(tbody,tr){display:block;width:100%}
 .article-content .kyorin-readable .kyorin-overview tr{border:1px solid #ddd4c5;margin:12px 0}
 .article-content .kyorin-readable .kyorin-overview :is(th,td){display:block;width:auto;border:0;border-bottom:1px solid #eee6dc}
 .article-content .kyorin-readable .kyorin-overview td:before{content:attr(data-label);font-weight:700;display:inline-block;width:5em;color:#61584b}
 }
 </style>`;
}
