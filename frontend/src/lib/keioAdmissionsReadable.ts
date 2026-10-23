import type {UniversityAdmissions} from './universityAdmissions.ts';
import canonical from '../data/universityAdmissions/keio.json' with {type:'json'};
import {escapeAdmissionText as esc, admissionFactAttributes as attrs, renderAdmissionReaderTable as table, renderAdmissionReaderConditions as conditions, renderAdmissionReaderSources as sources, type AdmissionReaderRow as Row} from './admissionsReaderPrimitives.ts';

export function keioAdmissionsMetadata(data:UniversityAdmissions) {
  return {
    title:'慶應義塾大学医学部｜2027年度入試情報', displayTitle:'慶應義塾大学 医学部2027年度入試情報', displayTitleLines:['慶應義塾大学 医学部','2027年度入試情報'],
    description:'慶應義塾大学医学部医学科の2027年度入試情報。一般選抜の人数・日程・科目配点、栃木県地域枠の資格・修学資金・勤務条件、帰国生と外国人留学生の出願条件や手続、学費の公開予定、大学基本情報を紹介します。',
    lead:'慶應義塾大学医学部医学科の2027年度入試を、選抜方式ごとにまとめています。一般選抜の公表済み日程・科目と、栃木県地域枠の2027年度条件を掲載しています。帰国生・外国人留学生の出願と選考は終了しています。出願・手続前には、大学と県の最新要項をご確認ください。',
    modified:data.verifiedAt.slice(0,10), categories:['関東（東京）','私立医学部'],
    keyPoints:[
      '一般選抜は66名で、栃木県地域枠1名を含みます。一次は2027年2月9日、二次は3月1日です。',
      '一般選抜の一次は理科200点・数学150点・英語150点の合計500点。二次は小論文と面接です。',
      '帰国生・外国人留学生は2027年4月入学向けの出願・選考が終了しています。合格者の入学手続期間は2026年11月30日～12月11日です。'
    ]
  };
}

export function renderKeioAdmissionsReadable(data:UniversityAdmissions):string {
  if(data.path!=='/information-keio/'||data.schemes.map(s=>s.id).join('|')!=='general|tochigi|returnee|foreign') throw Error('Keio requires its four reviewed routes');
  const entries=new Map<string,Row>(), seen=new Set<string>();
  for(const s of data.schemes) for(const [kind,key] of [['schedule','scheduleRows'],['exam','examRows'],['venue','venueRows'],['note','notes']] as const) s[key].forEach((r,i)=>entries.set(`${s.id}/${kind}/${i}`,{label:'label'in r?r.label:'注意事項',value:'value'in r?r.value:r.text,sourceIds:r.sourceIds,origins:[`${s.id}/${kind}/${i}`],...('status'in r?{status:r.status}:{})}));
  const coverageIds=[['med','general'],['general'],['prefecture-region','region'],['return-guide','returnee'],['foreign-guide','foreign'],['eligibility'],['subjects'],['math-change'],['general','foreign'],['fees','return-guide','foreign-guide']];
  data.coverageNotes.forEach((value,i)=>entries.set(`coverage/${i}`,{label:'案内',value,sourceIds:coverageIds[i],origins:[`coverage/${i}`]}));
  canonical.basicInfoRows.forEach((r,i)=>entries.set(`basic/${i}`,{...r,origins:[`basic/${i}`]}));
  const take=(ids:string|string[],label?:string,value?:string):Row=>{const rows=(Array.isArray(ids)?ids:[ids]).map(id=>{const r=entries.get(id);if(!r)throw Error('Missing Keio fact '+id);seen.add(id);return r;});return{label:label??rows[0].label,value:value??rows[0].value,origins:rows.flatMap(r=>r.origins),sourceIds:[...new Set(rows.flatMap(r=>r.sourceIds))],...(rows.some(r=>r.status==='needs-confirmation')?{status:'needs-confirmation'}:rows[0].status?{status:rows[0].status}:{})};};
  const group=(kind:string,i:number,label?:string,value?:string)=>take([`returnee/${kind}/${i}`,`foreign/${kind}/${i}`],label,value);
  const p=(r:Row)=>`<p ${attrs(r)}>${esc(r.value)}</p>`,h=(id:string,text:string)=>`<h3 id="${id}">${esc(text)}</h3>`;
  const src=(ids:string[])=>sources(data.sources.filter(s=>ids.includes(s.id)).map(s=>({...s,title:s.title+(s.pages?`（${Array.isArray(s.pages)?s.pages.join('・'):s.pages}）`:'')+'／確認日 '+data.verifiedAt.slice(0,10)})));
  const back='<p class="admission-section-links"><a href="#admission-overview">入試方式の一覧へ戻る ↑</a></p>';
  let html='<section class="admission-readable keio-readable" data-university-admissions-year="2027" data-admissions-presentation="keio-readable-v1"><h2 id="最新の入試情報">2027年度の入試情報</h2>';
  html+=p(take(['coverage/0','general/note/0']))+h('admission-overview','入試方式・募集人数・主な日程');
  const quota=['66名（地域枠1名を含む）','66名のうち1名','若干名','若干名'],registration=['Web・納入：2026年12月24日10:00～2027年1月18日17:00','一般枠に準じる','2026年7月3～14日（出願終了）','2026年7月3～14日（出願終了）'],exam=['一次2月9日／二次3月1日','大学の2027年度詳細案内を確認','書類選考／2026年9月27日（選考終了）','書類選考／2026年9月27日（選考終了）'];
  html+='<table class="admission-overview-table" data-admission-table="overview"><caption>医学科の4方式（いずれも2027年4月入学）</caption><thead><tr><th scope="col">入試方式</th><th scope="col">募集人数</th><th scope="col">出願登録・納入</th><th scope="col">一次・二次</th></tr></thead><tbody>'+data.schemes.map((s,i)=>`<tr ${attrs(take(`${s.id}/exam/0`))}><th scope="row"><a href="#admission-scheme-${s.id}">${esc(s.name)}</a></th><td><span class="admission-mobile-label">募集人数</span>${quota[i]}</td><td><span class="admission-mobile-label">出願登録・納入</span>${registration[i]}</td><td><span class="admission-mobile-label">一次・二次</span>${exam[i]}</td></tr>`).join('')+'</tbody></table>'+src(['med','general','prefecture-region','return-guide','foreign-guide']);

  html+=h('admission-scheme-general','一般選抜：日程と出願条件')+table('一般選抜の2027年度日程',data.schemes[0].scheduleRows.map((_,i)=>take(`general/schedule/${i}`)),'general-schedule')+p(take('general/note/2'))+src(['general']);
  html+=conditions([take('general/exam/1','一般選抜の出願資格'),take(['general/exam/8','coverage/5'],'個別資格審査'),take('general/venue/1','個別資格審査の書類・送付先')])+src(['eligibility']);
  html+=h('keio-general-subjects','一般選抜：科目・配点・出題範囲')+table('一般選抜の一次・二次と出題範囲',[2,3,4,5].map(i=>take(`general/exam/${i}`)),'general-subjects')+conditions([take('general/exam/6','小論文・面接の配点等'),take(['general/note/1','coverage/7'],'2029年度からの変更予告')])+src(['subjects','math-change','general']);
  html+=h('keio-general-pending','一般選抜：要項・会場の公開待ち')+conditions([take(['general/exam/7','coverage/1'],'2027年度一般選抜要項'),take('general/venue/0','2027年度の会場'),take(['general/exam/10','coverage/8'],'終了した奨学金')])+src(['general','foreign']);
  html+=h('keio-accommodation','一般選抜：受験・入学後の配慮申請')+conditions([take('general/note/3','本申請の締切'),take('general/note/4','マイページの登録と出願'),take('general/note/5','必要書類・郵送')])+src(['general-accommodation']);
  html+=h('keio-disaster-support','被災した受験生の特別措置')+p(take('general/note/6'))+src(['disaster-support','return-guide'])+back;

  html+=h('admission-scheme-tochigi','栃木県地域枠：2027年度の資格・選考')+p(take(['tochigi/note/0','coverage/2']))+table('地域枠の出願と県への貸与申請',[0,1].map(i=>take(`tochigi/schedule/${i}`)),'regional-schedule')+conditions([take('tochigi/exam/2','すべて必要な資格と県内要件'),take('tochigi/note/1','出願する枠の選択'),take('tochigi/exam/1','一次・二次の選考'),take('tochigi/venue/0','県の追加面接・会場')])+src(['prefecture-region','region-guide-2027','subjects','region']);
  html+=h('keio-regional-loan','栃木県地域枠：貸与と在学中の条件')+table('2027年度の県医師修学資金',[take('tochigi/exam/3','貸与額・返還免除の勤務期間')],'regional-loan')+conditions([take('tochigi/note/2','申請書類・保証人'),take('tochigi/note/3','継続面接と地域医療の行事'),take('tochigi/note/4','休学・停学・留年')])+src(['region-guide-2027','region-career-text','prefecture-region']);
  html+=h('keio-regional-work','栃木県地域枠：卒後の研修・勤務')+conditions([take('tochigi/note/5','初期研修と指定される勤務先'),take('tochigi/note/6','診療科の選択と制約'),take('tochigi/note/7','出産・育児・休業'),take('tochigi/note/8','県外研修・学位取得・海外留学')])+src(['region-guide-2027','region-career-text']);
  html+=h('keio-regional-repayment','栃木県地域枠：返還・免除・猶予')+conditions([take('tochigi/note/9','全額免除と申請'),take('tochigi/note/10','一部免除等'),take('tochigi/note/11','一括返還・利息・延滞金'),take('tochigi/note/12','猶予と医師国家試験'),take('tochigi/note/13','契約解除'),take('tochigi/note/14','返還による離脱'),take('tochigi/note/15','大学が掲載している2026年度参考条件'),take('tochigi/venue/1','大学への問い合わせ')])+src(['region-guide-2027','region','medical-contact'])+back;

  html+=h('keio-overseas-schedule','帰国生・外国人留学生：出願・選考と入学手続')+p(take(['returnee/note/0','foreign/note/0','coverage/3','coverage/4'],'対象年度','以下は2027年4月入学の医学部の情報です。2026年中の出願・選考は終了しています。帰国生の9月入学や他学部の10月出願とは日程が異なります。'))+table('帰国生・医学部外国人留学生の共通日程',data.schemes[2].scheduleRows.map((_,i)=>group('schedule',i)),'overseas-schedule')+p(group('note',2))+src(['returnee','foreign','return-guide','foreign-guide']);
  html+=p(group('exam',3,'同年度の医学部併願'))+src(['return-guide','foreign-guide']);
  html+=h('admission-scheme-returnee','帰国生：資格・統一試験・提出書類')+conditions([take('returnee/exam/1','共通の出願資格'),take('returnee/exam/2','医学部の国籍・在留資格条件'),take('returnee/exam/9','統一試験の共通条件')])+src(['return-guide']);
  const countryLabels=['SAT（米国・カナダ）','GCE A Level・International A Level','IB','フランス・ドイツ','オーストラリア・ニュージーランド','中国','その他の国・地域等'];
  html+=conditions(countryLabels.map((label,i)=>take(`returnee/note/${i+5}`,label)))+src(['return-guide'])+conditions([take('returnee/exam/10','医学部の出願書類・作文'),take('returnee/note/3','推薦状の執筆者と署名')])+src(['return-guide','return-reason-form','return-essay-form'])+back;
  html+=h('admission-scheme-foreign','外国人留学生：資格・EJU・提出書類')+conditions([take('foreign/exam/1','すべて必要な出願資格'),take('foreign/exam/2','国籍・在留資格'),take('foreign/exam/9','日本留学試験の科目・有効回'),take('foreign/note/5','EJU結果の提出'),take('foreign/exam/10','出願書類・作文'),take('foreign/note/3','推薦状の執筆者と署名')])+src(['foreign-guide','foreign-reason-form','foreign-essay-form'])+back;
  html+=h('keio-overseas-exams','帰国生・外国人留学生：二次試験と英語試験')+conditions([group('exam',4,'一次・二次の選考内容'),group('exam',5,'総合問題の数学範囲'),group('exam',6,'二次の時刻・配点'),group('exam',7,'英語結果の有効期間と3点の提出'),group('exam',8,'受験形態・直送コード・スコア条件')])+src(['return-guide','foreign-guide']);
  html+=h('keio-overseas-documents','帰国生・外国人留学生：証明書・写真と郵送先')+p(group('exam',11))+table('出願書類の郵送先',[take('returnee/venue/2','帰国生'),take('foreign/venue/2','医学部外国人留学生')],'overseas-mail')+conditions([group('venue',0,'二次の会場・集合場所・遅刻'),group('venue',1,'信濃町へのアクセス'),group('venue',3,'両入試事務局への問い合わせ')])+src(['return-guide','foreign-guide']);
  html+=h('keio-overseas-fees','帰国生・外国人留学生：検定料と返還')+table('入試ごとの検定料',[take('returnee/exam/12','帰国生','60,000円＋事務手数料。'),take('foreign/exam/12','医学部外国人留学生','55,000円＋事務手数料。')],'examination-fees')+p(group('exam',12,'返還の条件','両入試とも、一次不合格は25,000円を返還します。それ以外の返還は誤った二重納入の重複分に限られ、出願不受理・未出願の場合も返還しません。二重納入は2026年9月4日までにメールで返還申請書を請求します。手数料は返還対象外で、返還時期は2026年11月以降の予定です。'))+src(['return-guide','foreign-guide']);
  html+=h('keio-tuition','2027年度学費の公開予定・入学辞退')+p(take(['general/exam/9','returnee/exam/13','foreign/exam/13','coverage/9'],'学費の公開予定',data.schemes[2].examRows[13].value))+conditions([group('exam',14,'辞退による納入金の返還'),take('returnee/note/4','帰国生の学費振替'),take('foreign/note/4','医学部外国人留学生の学費振替')])+src(['fees','return-guide','foreign-guide']);

  html+='<h2 id="大学基本情報">大学基本情報</h2>'+conditions([take('basic/0'),take('basic/1')])+src(['campus-shinanomachi','campus-hiyoshi'])+table('2026年度医学部・全方式の定員と入学者',[take('basic/2')],'enrollment')+src(['enrollment-current']);
  const stats=(origin:string,caption:string,total:number,counts:[string,number][])=>{const fact=take(origin);return `<table data-admission-table="gender"><caption>${esc(caption)}</caption><thead><tr><th scope="col">区分</th><th scope="col">人数</th><th scope="col">割合</th></tr></thead><tbody>${[...counts,['合計',total] as [string,number]].map(([label,n])=>`<tr ${attrs(fact)}><th scope="row">${label}</th><td>${n.toLocaleString('ja-JP')}名</td><td>${(n/total*100).toFixed(1)}%</td></tr>`).join('')}</tbody></table>`;};
  html+=h('keio-admission-statistics','2026年度一般選抜：志願者・入学許可者の男女別')+stats('basic/4','2026年度・医学部一般選抜の志願者1,182名',1182,[['男性',839],['女性',343]])+stats('basic/3','2026年度・医学部一般選抜の入学許可者189名',189,[['男性',146],['女性',43]])+'<p>割合は各表の合計を母数に小数第1位へ丸めています。入学許可者は入学者とは対象が異なり、全方式の入学者110名とは別の統計です。</p>'+src(['gender-2026'])+`<p class="admission-verification-date">公式資料確認日：<time datetime="${esc(data.verifiedAt)}">${esc(data.verifiedAt.slice(0,10))}</time></p></section>`;
  const internal=new Set(['coverage/6','returnee/note/1','foreign/note/1']);
  const missing=[...entries.keys()].filter(id=>!seen.has(id)&&!internal.has(id));
  if(missing.length) throw Error('Keio facts not placed: '+missing.join(', '));
  return html;
}
