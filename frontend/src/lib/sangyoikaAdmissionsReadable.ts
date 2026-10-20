import type {UniversityAdmissions} from './universityAdmissions.ts';
import canonical from '../data/universityAdmissions/sangyoika.json' with {type:'json'};
import {admissionFactAttributes as attrs,escapeAdmissionText as esc,renderAdmissionReaderTable as sharedTable,renderAdmissionReaderConditions as conditions,renderAdmissionReaderSources as sources} from './admissionsReaderPrimitives.ts';
import type {AdmissionReaderRow} from './admissionsReaderPrimitives.ts';

export function sangyoikaAdmissionsMetadata(data:UniversityAdmissions) {
 return {title:'産業医科大学医学部医学科｜2027年度入試情報',displayTitle:'産業医科大学 医学部医学科2027年度入試情報',displayTitleLines:['産業医科大学 医学部医学科','2027年度入試情報'],modified:data.verifiedAt.slice(0,10),description:'産業医科大学医学科の2027年度入試。総合型・学校推薦型・一般A/B/Cの日程、科目・配点、推薦の資格、修学資金と産業医の勤務条件、2026年度入学者統計を掲載します。',lead:'産業医科大学医学部医学科の2027年度入試について、5方式の出願・試験日程、科目・配点、資格条件をまとめています。全医学部生が対象となる修学資金と卒業後の勤務条件も掲載しています。出願前に大学の最新の募集要項・変更通知をご確認ください。',keyPoints:['一般Aは約60人。共通テスト300点と大学独自の学力検査600点で、小論文・面接の対象者約400人を選びます。','一般Bは学力検査70％以上かつ上位20人以内、一般Cは共通テスト80％以上かつ上位20人以内が小論文・面接の受験条件です。','総合型は10人以内、学校推薦型は25人以内。全医学部生が修学資金を借り、返還免除には所定の職務期間と産業医として2年以上の勤務等が必要です。']};
}

const T='comprehensive',R='recommendation',A='general-a',B='general-b',C='general-c',general=[A,B,C],all=[T,R,...general];
export function renderSangyoikaAdmissionsReadable(data:UniversityAdmissions):string {
 if(data.path!==canonical.path||data.schemes.map(s=>s.id).join(',')!==all.join(','))throw Error('Sangyoika requires five reviewed medicine routes');
 const used=new Set<string>(),r=(id:string,kind:string,...ns:number[])=>ns.map(n=>`${id}/${kind}/${n}`),cov=(...ns:number[])=>ns.map(n=>`coverage/${n}`),basic=(...ns:number[])=>ns.map(n=>`basic/${n}`);
 const row=(o:string):AdmissionReaderRow=>{
  if(o.startsWith('coverage/'))return {label:'',value:data.coverageNotes[Number(o.split('/')[1])],sourceIds:['guidelines-index'],origins:[o]};
  if(o.startsWith('basic/'))return {...canonical.basicInfoRows[Number(o.split('/')[1])],origins:[o]};
  const [id,k,n]=o.split('/'),s=data.schemes.find(s=>s.id===id)!;
  const v=(k==='schedule'?s.scheduleRows:k==='exam'?s.examRows:k==='venue'?s.venueRows:s.notes)[Number(n)];
  if(!v)throw Error(`Missing fact ${o}`);
  return {label:'text' in v?'':v.label,value:'text' in v?v.text:v.value,sourceIds:v.sourceIds,origins:[o],...('status' in v?{status:v.status}:{})};
 };
 const claim=(os:string[])=>{for(const o of os){if(used.has(o))throw Error(`Repeated Sangyoika origin ${o}`);used.add(o);}return attrs({label:'',value:'',origins:os,sourceIds:[...new Set(os.flatMap(o=>row(o).sourceIds))]});};
 const group=(os:string[],html:string)=>`<div class="admission-fact-group" ${claim(os)}>${html}</div>`;
 const item=(label:string,value:string):AdmissionReaderRow=>({label,value,origins:[],sourceIds:[]});
 const table=(caption:string,rows:AdmissionReaderRow[],kind='schedule')=>sharedTable(caption,rows,kind).replace('<table ','<table class="sangyoika-fact-table" ');
 const para=(label:string,value:string)=>conditions([item(label,value)]);
 const list=(os:string[],label:string)=>group(os,para(label,row(os[0]).value));
 const rows=(os:string[])=>os.map(o=>{const v=row(o);claim([o]);return v;});
 const panel=(ids:string[])=>sources(canonical.sources.filter(s=>ids.includes(s.id)).map(s=>({...s,title:`${s.title}${'pages' in s?'／'+s.pages:''}／確認 ${s.retrievedAt.slice(0,10)}`})));
 const matrix=(caption:string,heads:string[],body:string[][],kind='scores')=>`<table class="sangyoika-matrix cols-${heads.length}" data-admission-table="${kind}"><caption>${esc(caption)}</caption><thead><tr>${heads.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${body.map(c=>`<tr><th scope="row">${c[0]}</th>${c.slice(1).map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
 const overview=group([...cov(0),...all.flatMap(id=>[...r(id,'exam',0),...r(id,'schedule',0)])],`<h3 id="admission-overview">5方式の募集人数・出願・試験日</h3><p>医学部医学科の入学定員は105人です。以下の募集人数は、すべて105人の内数です。</p>${matrix('2027年度 医学科の入試方式',['方式','募集人数','出願期間','主な試験日'],[
 ['<a href="#admission-comprehensive">総合型</a>','10人以内','2026年10月1日～16日','11月21日 発表試験<br>2027年1月16日・17日 共通テスト'],
 ['<a href="#admission-recommendation">学校推薦型</a>','25人以内','2026年11月1日～7日','12月2日 総合問題・面接'],
 ['<a href="#admission-general-a">一般A</a>','約60人','2026年12月11日～2027年1月15日','1月16日・17日 共通テスト<br>2月14日 学力検査<br>3月12日 小論文・面接'],
 ['<a href="#admission-general-b">一般B</a>','5人以内','2026年12月11日～2027年1月25日','2月14日 学力検査<br>3月12日 小論文・面接'],
 ['<a href="#admission-general-c">一般C</a>','5人以内','2026年12月11日～2027年2月21日','1月16日・17日 共通テスト<br>3月12日 小論文・面接']
 ],'overview')}<p>郵送書類は各方式の出願締切日の消印有効です。試験は、各段階の対象者に実施します。</p>${panel(['guidelines-index','comprehensive-2027','recommendation-2027','general-2027'])}`);
 const comprehensive=`<section data-admission-scheme="${T}"><h3 id="admission-comprehensive">総合型｜資格・発表試験・共通テスト</h3>
 <h4>総合型の出願資格</h4>${group(r(T,'exam',1,2),`<p>次のすべてが必要です。</p>${conditions([item('卒業年','2027年3月に高校・中等教育学校を卒業見込み、または2026年3月卒業。'),item('志望・受験・入学の確約','産業医学へ進む強い意志と使命感があり、2027年度共通テストの指定科目を受験し、合格時に入学を確約できること。学習成績4.3等の数値要件は示されていません。')])}`)}
 <h4>総合型の選考日程</h4>${table('総合型の日程',rows(r(T,'schedule',4,6,7,8,9,10,11,12)))}
 ${list(r(T,'schedule',5),'第1段階選抜を行う場合')}
 ${group(r(T,'exam',4,5,6),`<h4>プレゼンテーション試験の内容</h4>${conditions([item('資料作成','産業保健の指定課題について90分で作成。日本語または英語で作成でき、文具等は大学が用意します。パソコンは使えません。'),item('発表・質疑応答','発表10分（10分で打切り）、質疑応答約20分。いずれも日本語で行います。'),item('判定','提出書類・作成資料・発表・質疑応答等を総合評価し、上位10人以内を合格者とします。数値配点は示されていません。')])}`)}
 ${group(r(T,'exam',7,8,9,10),`<h4>総合型の共通テスト</h4>${matrix('総合型 指定3教科・600点',['教科','指定科目','配点'],[['数学','数学Ⅰ・Aと数学Ⅱ・B・Cの両方','200点'],['理科','物理・化学・生物から2科目','計200点'],['英語','リーディング・リスニングの両方','200点'],['合計','指定科目をすべて受験','600点']])}${para('最終合格の条件','プレゼンテーション試験合格者のうち、指定3教科600点で80％以上（480点以上）が合格。指定科目を一つでも受験しない場合は判定対象外です。')}${para('英語の換算','リーディングとリスニングの換算比率は、総合型の正式要項の配点表に示されていません。必要な場合は入試課に確認してください。')}`)}
 ${list(r(T,'exam',3),'総合型の出願書類')}${panel(['comprehensive-2027'])}</section>`;
 const recommendation=`<section data-admission-scheme="${R}"><h3 id="admission-recommendation">学校推薦型｜推薦条件・地域ブロック</h3>
 <h4>学校推薦型の日程</h4>${table('学校推薦型の試験・手続',rows(r(R,'schedule',5,6,7,8)))}
 <h4>学校推薦型の資格と評定</h4>${list(r(R,'exam',4),'卒業年・学校長推薦')}
 ${group(r(R,'exam',5),`<p>次の評定平均の<strong>いずれかが4.3以上</strong>であることが必要です。</p>${conditions([item('全体','全体の学習成績の状況。'),item('5教科','国語・数学・理科・社会・英語の平均。'),item('3教科','数学・理科・英語の平均。')])}`)}
 ${list(r(R,'exam',6),'2026年3月卒業者の代替条件')}
 ${group(r(R,'exam',7),`${table('推薦の既卒者資格に使える2026年度共通テスト',[
 item('国語','200点。'),item('地理歴史・公民','100点。「地理総合，地理探究」「歴史総合，日本史探究」「歴史総合，世界史探究」「公共，倫理」「公共，政治・経済」から1科目。2科目受験時は第1解答科目。'),item('数学','数学Ⅰ・Aと数学Ⅱ・B・Cの両方、計200点。'),item('理科','物理・化学・生物から2科目、計200点。'),item('英語','200点（リーディング100点・リスニング100点）。リスニング免除時はリーディングを200点に換算。')
 ],'qualification')}`)}
 ${list(r(R,'exam',8),'高校での履修要件')}${list(r(R,'schedule',4),'履修不足・留学等の事前相談')}
 ${group(r(R,'exam',1,2,3),`<h4>出身学校の所在地による3ブロック</h4><p>各ブロック20人以内、3ブロックの合計25人以内です。海外の学校は入試課へ問い合わせてください。</p>${table('学校推薦型の地域ブロック',[1,2,3].map(i=>item(row(`${R}/exam/${i}`).label,row(`${R}/exam/${i}`).value.replace('海外の学校は入試課へ問い合わせる。',''))),'blocks')}`)}
 ${group(r(R,'exam',10,11,12),`<h4>学校推薦型の選考</h4>${conditions([item('総合問題','120分。英語の読解力・思考力・表現力と、自然科学の論理的思考力・基礎知識等を問います。'),item('面接・総合評価','面接は1人約20分。推薦書・調査書・志望理由書・特別活動記録等と総合問題・面接を総合評価します。試験全体・面接の数値配点は示されていません。'),item('共通テスト','2027年度共通テストは免除です。')])}`)}
 ${list(r(R,'exam',9),'学校推薦型の出願書類')}${panel(['recommendation-2027'])}</section>`;
 const generalSelection=group([...r(A,'exam',4),...r(B,'exam',4,9),...r(C,'exam',4,10)],`<h3 id="admission-general-selection">一般A・B・Cの選抜の違い</h3>${matrix('小論文・面接の対象者を決める条件',['方式','利用する試験','対象者の条件'],[['<span id="admission-general-a">一般A</span>','共通テスト300点＋学力検査600点','約400人'],['<span id="admission-general-b">一般B</span>','学力検査600点。共通テストは課しません','70％以上かつ上位20人以内'],['<span id="admission-general-c">一般C</span>','共通テスト900点。大学独自の学力検査は課しません','80％以上（720点以上）かつ上位20人以内']])}<p>最終判定は、各方式の利用試験、小論文、面接、提出書類の総合評価です。B・Cは、得点率だけで小論文・面接の受験や合格が確約されるわけではありません。</p>`);
 const generalDates=group([...r(A,'schedule',4,8,10,11),...r(B,'schedule',4,6,8,9),...r(C,'schedule',4,5,7,8)],`<h4>一般選抜の日程</h4>${matrix('一般A・B・Cの発表・手続（2027年）',['項目','一般A・B','一般C'],[['受験票メール','2月1日頃。2月3日までに未着なら入試課へ連絡','3月1日頃。3月3日までに未着なら入試課へ連絡'],['小論文・面接対象者発表','2月26日16:00頃','3月4日16:00頃'],['最終合格発表','3月19日16:00頃','3月19日16:00頃'],['通常の入学手続','3月24日・25日','3月24日・25日']],'schedule')}<p>入学手続の受付は各日9:00～11:30／13:00～14:30。入学料・諸会費等の納入と書類提出が必要です。原則本人来学で、やむを得ない場合は保護者も可能です。</p>`);
 const generalFirst=`${list(r(A,'schedule',5),'一般Aの第1段階選抜')}${list(r(A,'schedule',6),'一般Aの第1段階結果・検定料返還')}`;
 const commonTest=group([...r(A,'exam',5,6,7,8,9),...r(C,'exam',5,6,7,8,9)],`<h4>一般A・Cの共通テスト</h4><p>2027年度の5教科7科目を利用します。2027年度共通テストの成績請求チケット（私立大学用）を志願票に貼り付けて出願してください。</p>${matrix('一般A・C 共通テストの換算配点（点）',['教科','一般A','一般C'],[['国語','60','200'],['地理歴史・公民','40','100'],['数学','60','200'],['理科','80','200'],['英語','60（R48・L12）','200（R160・L40）'],['合計','300','900']])}${conditions([item('国語・地理歴史・公民','国語は「国語」。地理歴史・公民は「地理総合，地理探究」「歴史総合，日本史探究」「歴史総合，世界史探究」「公共，倫理」「公共，政治・経済」から1科目。2科目受験時は第1解答科目を使います。'),item('数学・理科・英語','数学Ⅰ・Aと数学Ⅱ・B・Cの両方、理科は物理・化学・生物から2科目、英語はリーディング・リスニングの両方が必要です。指定科目を一つでも欠くと判定対象外です。')])}`);
 const independent=group([...r(A,'schedule',7),...r(B,'schedule',5),...r(A,'exam',10,11,12,13),...r(B,'exam',5,6,7,8)],`<h4>一般A・Bの学力検査</h4><p>2027年2月14日（日）に実施します。</p>${matrix('一般A・Bの時間・配点',['教科','入室時刻','試験時間','配点'],[['数学','9:30～9:50','10:20～12:00<br>100分','200点'],['理科','13:00','13:20～15:00<br>2科目で計100分','計200点'],['外国語','15:40','16:00～17:40<br>100分','200点'],['合計','—','—','600点']],'subjects')}${conditions([item('数学の範囲','数学Ⅰ・Ⅱ・Ⅲ・A、数学Bの数列、数学Cのベクトル・平面上の曲線と複素数平面。'),item('理科の選択','物理基礎・物理、化学基礎・化学、生物基礎・生物から2科目。出願時に選択し、試験当日の変更はできません。'),item('外国語の範囲','英語コミュニケーションⅠ・Ⅱ・Ⅲ、論理・表現Ⅰ・Ⅱ・Ⅲ。')])}`);
 const essay=group([...r(A,'schedule',9),...r(B,'schedule',7),...r(C,'schedule',6),...r(A,'exam',14,15),...r(B,'exam',10,11),...r(C,'exam',11,12)],`<h4>一般3方式の小論文・面接</h4>${table('2027年3月12日（金）小論文・面接',[item('入室','8:10～8:40。'),item('小論文','9:00～11:00。120分・50点。'),item('面接','12:20～17:00頃。1人約20分で、2回行う場合があります。')])}<p>面接は重要な判定資料です。数値配点は示されていません。調査書・志望理由書・特別活動記録等も評価します。</p>`);
 const generalQualifications=`<h4>一般3方式の資格・出願書類</h4>${list(general.flatMap(id=>r(id,'exam',1)),'出願資格')}${list(general.flatMap(id=>r(id,'exam',2)),'方式ごとに必要な書類')}${list(general.flatMap(id=>r(id,'exam',3)),'志望理由書・特別活動記録')}`;
 const generalVenue=group([...[A,B].flatMap(id=>r(id,'venue',0,1,2))],`<h4>一般A・Bの学力検査会場</h4>${table('出願時に選ぶ2会場',[item('北九州','北九州メッセ（旧西日本総合展示場 新館）。福岡県北九州市小倉北区浅野3-8-1。'),item('東京','ベルサール汐留。東京都中央区銀座8-21-1 住友不動産汐留浜離宮ビル。')],'venue')}<p>出願時に北九州・東京から選び、選択後は変更できません。東京会場が収容人数を超える場合は北九州会場となることがあり、受験票ダウンロードメールと併せて通知されます。</p>`);
 const generalAdditional=`<h4>一般Aの補欠・追加合格</h4>${list([...r(A,'schedule',12),...r(B,'schedule',10),...r(C,'schedule',9)],'対象・連絡')}${list(r(A,'schedule',13),'追加合格者の回答・手続')}${list(general.flatMap(id=>r(id,'note',0)),'一般選抜を併願する場合')}${list(general.flatMap(id=>r(id,'note',1)),'入学辞退時の返還手続')}`;
 const generalBlock=`<section data-admission-schemes="general-a general-b general-c">${generalSelection}${generalDates}${generalFirst}${commonTest}${independent}${essay}${generalQualifications}${generalVenue}${generalAdditional}${panel(['general-2027'])}</section>`;
 const commonApplication=`<h3 id="admission-application">共通の出願・検定料・受験上の注意</h3>${list([...cov(2),...all.flatMap(id=>r(id,'schedule',1))],'出願完了までの3手続')}${list([T,R].flatMap(id=>r(id,'note',1)),'支払期限・変更できる時期')}${list([T,R].flatMap(id=>r(id,'note',0)),'5方式の併願と判定')}${list(cov(5),'併願割引の登録')}
 ${group([...all.flatMap(id=>r(id,'schedule',2)),...general.flatMap(id=>r(id,'note',2))],`${matrix('検定料（別途払込手数料）',['出願数','C方式を含まない','C方式を含む'],[['1方式','60,000円','40,000円'],['2方式','110,000円','90,000円'],['3方式','160,000円','140,000円'],['4方式','210,000円','190,000円'],['5方式','対象なし','240,000円']],'fees')}`)}${list(cov(14),'検定料の返還')}${list(cov(9),'出願用の顔写真')}
 ${group(all.flatMap(id=>r(id,'schedule',3)),`${table('受験上の配慮の事前連絡期限',[item('総合型','2026年9月4日（金）。'),item('学校推薦型','2026年9月30日（水）。'),item('一般A・B・C','2026年10月30日（金）。')],'accommodation')}<p>期限までに入試課へ電話で連絡し、必要書類を提出してください。期限後の事故等で新たに配慮が必要になった場合は、速やかに相談してください。</p>`)}
 ${list(cov(10),'熊本地震の被災者への対応')}${list(cov(4),'受験票の印刷・持参')}${list(cov(11),'遅刻時の扱い')}${list(cov(3),'合否の確認方法')}
 ${group([...r(T,'venue',0,1),...r(R,'venue',0,1),...r(A,'venue',3,4),...r(B,'venue',3,4),...r(C,'venue',0,1)],`${table('大学で実施する試験の会場',[item('対象の試験','総合型のプレゼンテーション、学校推薦型の総合問題・面接、一般A・B・Cの小論文・面接。'),item('所在地','産業医科大学。福岡県北九州市八幡西区医生ケ丘1-1。')],'venue')}<p>試験室・座席は受験票と大学の案内で確認してください。発表・面接の個別の順番は当日の指定によります。会場入口は志願者数等で変更する場合があります。</p>`)}
 ${group([...r(T,'venue',2),...r(R,'venue',2),...r(A,'venue',5),...r(B,'venue',5),...r(C,'venue',2)],para('出願書類の送付先','〒807-8555 福岡県北九州市八幡西区医生ケ丘1-1 産業医科大学入試課。各方式の書類を提出してください。'))}${panel(['web-guide-2027','comprehensive-2027','recommendation-2027','general-2027','disaster-notice'])}`;
 const enrollment=`<h3 id="admission-enrollment">入学手続に必要な書類</h3>${list(cov(6),'来学・納入・書類提出')}${list([...r(T,'venue',3),...r(R,'venue',3),...r(A,'venue',6),...r(B,'venue',6),...r(C,'venue',3)],'手続書類')}${list(cov(13),'手続当日に必要な書類')}${panel(['guidelines-index','comprehensive-2027','recommendation-2027','general-2027'])}`;
 const loanNotes=all.flatMap(id=>r(id,'note',id===T||id===R?2:3)),careerNotes=all.flatMap(id=>r(id,'note',id===T||id===R?3:4));
 const obligations=`<h3 id="admission-funding">修学資金と卒業後の勤務条件</h3>${group([...cov(7),...loanNotes],para('全医学部生の貸与・返還条件','全医学部生が修学資金の貸与対象です。返還免除には、貸与期間の1.5倍の期間、所定の職務に従事し、その期間内に産業医の職務を2年以上含むことが必要です。連帯保証人は2人。対象職に就かない、又は所定期間勤務しない場合、貸与額と貸与利息を一括返還します。連帯保証等の契約内容を含めて資金計画を立てる必要があります。'))}
 ${group(cov(12),`${matrix('医学部6年間の費用（2027年度予定）',['区分','金額'],[['納入総額','30,490,000円'],['修学資金貸与額','19,193,200円'],['納入総額と貸与額の差額','11,296,800円'],['別途必要な諸会費・保険料','257,800円']],'funding')}`)}
 ${list(careerNotes,'医師免許取得後の課程・勤務')}${list(cov(15),'修練・大学院等の期間算入')}${list(cov(8),'キャリア形成プログラムの契約')}${panel(['comprehensive-2027','general-2027','career-program'])}`;
 const future=`<h3 id="admission-future">2028年度入試の変更予告</h3>${list(cov(1),'次年度の予定')}${panel(['future-changes'])}`;
 const location=`<h3 id="admission-campus">所在地・アクセス・問い合わせ</h3>${table('医学部の所在地・連絡先',rows(basic(0,1,2)),'campus')}${panel(['overview-2027','access','guidelines-index','disaster-notice'])}`;
 const stat=(caption:string,entries:[string,number,number][])=>matrix(caption,['区分','人数','割合'],[...entries.map(([label,n,i])=>{claim(basic(i));return [`<span ${attrs(row(`basic/${i}`))}>${esc(label)}</span>`,`${n}人`,`${(n/105*100).toFixed(1)}％`];}),['合計','105人','100％']],'statistics');
 const stats=`<h3 id="admission-entrants">2026年度医学部の入学者</h3><p>医学部入学者105人を母数に、小数第1位へ四捨五入しています。</p>${stat('2026年度 医学部入学者の男女別（105人）',[['男性',53,3],['女性',52,4]])}${stat('2026年度 医学部入学者の現浪別（105人）',[['現役',26,5],['1浪以上',79,6]])}<p>1浪以上の内訳は、1浪53人・2浪13人・3浪8人・4浪以上5人です。</p>${panel(['admission-results-2026','medical-data-2026'])}`;
 const expected=data.schemes.flatMap(s=>[['schedule',s.scheduleRows],['exam',s.examRows],['venue',s.venueRows],['note',s.notes]].flatMap(([k,rs])=>(rs as unknown[]).map((_,i)=>`${s.id}/${k}/${i}`))).concat(data.coverageNotes.map((_,i)=>`coverage/${i}`),canonical.basicInfoRows.map((_,i)=>`basic/${i}`));
 if(used.size!==expected.length||expected.some(o=>!used.has(o)))throw Error(`Sangyoika origin coverage: ${expected.filter(o=>!used.has(o)).join(',')}`);
 return `<h2 id="最新の入試情報">2027年度の入試情報</h2><section class="admission-readable sangyoika-readable" data-admissions-presentation="sangyoika-readable-v1" data-university-admissions-year="2027">${overview}${comprehensive}${recommendation}${generalBlock}${commonApplication}${enrollment}${obligations}${future}</section><h2 id="大学基本情報">大学基本情報</h2><section class="admission-readable sangyoika-readable">${location}${stats}</section>`;
}
