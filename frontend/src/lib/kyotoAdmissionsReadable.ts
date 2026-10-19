import type {UniversityAdmissions} from './universityAdmissions.ts';
import canonical from '../data/universityAdmissions/kyoto.json' with {type:'json'};
import {admissionFactAttributes as attrs, escapeAdmissionText as esc, renderAdmissionReaderTable as sharedTable, renderAdmissionReaderConditions as conditions, renderAdmissionReaderSources as sources} from './admissionsReaderPrimitives.ts';
import type {AdmissionReaderRow} from './admissionsReaderPrimitives.ts';

export function kyotoAdmissionsMetadata(data:UniversityAdmissions) {
 return {title:'京都大学医学部医学科｜2027年度入試情報',displayTitle:'京都大学 医学部医学科2027年度入試情報',displayTitleLines:['京都大学 医学部医学科','2027年度入試情報'],modified:data.verifiedAt.slice(0,10),description:'京都大学医学科の2027年度入試。一般前期100人の掲載値と定員増申請、特色5人、日程、科目・配点、IB・科学オリンピック資格の例外、2026年度入学者統計を掲載します。',lead:'京都大学医学部医学科の2027年度入試について、一般前期と特色入試の出願・試験日程、科目と配点、資格別の要件をまとめています。一般選抜の正式学生募集要項は2026年12月中旬の公表予定です。出願前に大学の最新の募集要項・変更通知をご確認ください。',keyPoints:['一般前期は100人の掲載値。共通テスト275点＋個別1000点で判定し、2027年2月25日・26日に筆記、27日に面接を実施します。','特色入試は学校推薦型で5人。出願は2026年11月5日10時～11日17時必着、12月12日に口頭試問、13日に面接を実施します。','特色の口頭試問160点・面接240点で計400点。共通テストの得点は合否に使いませんが、資格1・5には指定科目の受験・結果提出が必要です。']};
}

const G='general-early',S='special-recommendation';
export function renderKyotoAdmissionsReadable(data:UniversityAdmissions):string {
 if(data.path!==canonical.path||data.schemes.map(s=>s.id).join(',')!==`${G},${S}`)throw new Error('Kyoto requires its two reviewed medicine routes');
 const used=new Set<string>();
 const r=(id:string,kind:string,...indexes:number[])=>indexes.map(n=>`${id}/${kind}/${n}`);
 const b=(...indexes:number[])=>indexes.map(i=>`basic/${i}`);
 const row=(origin:string):AdmissionReaderRow=>{
  if(origin==='coverage/0')return {label:'',value:data.coverageNotes[0],origins:[origin],sourceIds:['selection-2027','special-2027']};
  if(origin.startsWith('basic/'))return {...canonical.basicInfoRows[Number(origin.split('/')[1])],origins:[origin]};
  const [id,kind,n]=origin.split('/'),s=data.schemes.find(s=>s.id===id)!;
  const item=kind==='schedule'?s.scheduleRows[Number(n)]:kind==='exam'?s.examRows[Number(n)]:kind==='venue'?s.venueRows[Number(n)]:s.notes[Number(n)];
  if(!item)throw new Error(`Missing Kyoto fact ${origin}`);
  return {label:'text' in item?'':item.label,value:'text' in item?item.text:item.value,origins:[origin],sourceIds:item.sourceIds};
 };
 const claim=(origins:string[])=>{for(const origin of origins){if(used.has(origin))throw new Error(`Repeated Kyoto origin ${origin}`);used.add(origin);}return attrs({label:'',value:'',origins,sourceIds:[...new Set(origins.flatMap(o=>row(o).sourceIds))]});};
 const group=(origins:string[],html:string)=>`<div class="admission-fact-group" ${claim(origins)}>${html}</div>`;
 const c=(label:string,value:string):AdmissionReaderRow=>({label,value,origins:[],sourceIds:[]});
 const table=(caption:string,rows:AdmissionReaderRow[],kind='schedule')=>sharedTable(caption,rows,kind).replace('<table ','<table class="kyoto-fact-table" ');
 const para=(label:string,value:string)=>conditions([c(label,value)]);
 const noted=(id:string,i:number,label:string)=>group(r(id,'note',i),para(label,row(`${id}/note/${i}`).value));
 const panel=(ids:string[])=>sources(canonical.sources.filter(s=>ids.includes(s.id)).map(s=>({...s,title:`${s.title}／確認 ${s.retrievedAt.slice(0,10)}`})));
 const overview=group(['coverage/0',...r(G,'exam',0),...r(S,'exam',0),...r(G,'note',0)],`
 <h3 id="admission-overview">入試方式と募集人数</h3><p>掲載対象は医学部医学科の一般前期と特色入試です。特色入試のIB・国際科学オリンピックは、出願資格の区分として掲載しています。</p>
 <table class="kyoto-overview-table" data-admission-table="overview"><caption>2027年度 医学科の2方式</caption><thead><tr><th scope="col">方式</th><th scope="col">募集人数</th><th scope="col">個別試験</th></tr></thead><tbody>
 <tr><th scope="row"><a href="#admission-general">一般選抜<br>前期日程</a></th><td>100人<br>（選抜要項の掲載値）</td><td>2027年2月25日・26日 筆記<br>27日 面接</td></tr>
 <tr><th scope="row"><a href="#admission-special">特色入試<br>学校推薦型選抜</a></th><td>5人</td><td>2026年12月12日 口頭試問<br>13日 面接</td></tr></tbody></table>
 <p>医学科全体の定員は105人と掲載され、105人から108人への臨時増員は認可申請中です。認可後の募集人数は大学から周知されます。特色入試の最終入学手続者が募集人数に満たない場合、その残余は一般前期に加えます。</p>${panel(['selection-index','selection-2027','special-guide-index','special-2027'])}`);
 const common=group([...r(G,'schedule',0),...r(S,'schedule',6),...r(G,'exam',2),...r(S,'exam',6),...r(G,'note',1)],`
 <h3 id="admission-common-test">共通テストの科目選択</h3><p>本試験は2027年1月16日（土）・17日（日）。一般前期と特色の資格1・5は、次の6教科8科目を指定しています。特色の資格2・3・4の扱いは<a href="#admission-special-qualification">資格別の要件</a>をご覧ください。</p>
 ${table('医学科の指定6教科8科目',[
 c('国語','「国語」。'),c('地理歴史・公民','「地理総合，地理探究」「歴史総合，日本史探究」「歴史総合，世界史探究」「公共，倫理」「公共，政治・経済」から1科目。'),c('数学','「数学Ⅰ，数学A」と「数学Ⅱ，数学B，数学C」の両方。'),c('理科','物理・化学・生物から2科目。'),c('外国語','英語・ドイツ語・フランス語・中国語・韓国語から1科目。'),c('情報','「情報Ⅰ」。')
 ],'subjects')}${para('一般前期の地理歴史・公民','2科目受験時は第1解答科目を使用します。第1解答科目が指定科目でなければ出願資格を認めません。「地理総合・歴史総合・公共」は医学科の指定科目に含まれません。')}${panel(['selection-2027','special-2027','dnc-dates-2027'])}`);
 const firstScores=[200,100,200,200,200,100],finalScores=[50,50,50,50,50,25],labels=['国語','地理歴史・公民','数学','理科','外国語','情報'];
 const generalScores=group(r(G,'exam',3,4,5,11),`
 <h4 id="admission-general-scores">一般前期の配点・第1段階選抜</h4>
 <table class="kyoto-score-table" data-admission-table="scores"><caption>一般前期 共通テストの換算配点（点）</caption><thead><tr><th scope="col">教科</th><th scope="col">第1段階</th><th scope="col">最終判定</th></tr></thead><tbody>${labels.map((label,i)=>`<tr><th scope="row">${label}</th><td>${firstScores[i]}</td><td>${finalScores[i]}</td></tr>`).join('')}<tr><th scope="row">合計</th><td>1000</td><td>275</td></tr></tbody></table>
 ${para('第1段階選抜','1000点満点で700点以上の者から、総得点の順位に従い募集人数の約3倍までを合格者とします。')}
 ${para('英語の換算','リーディング100点を150点、リスニング100点を50点に換算した200点を利用します（3対1）。最終判定では外国語50点へ換算します。リスニング免除者はリーディングを200点へ換算し、リスニング欠席者はリスニングを0点とします。')}
 ${para('最終判定','共通テスト275点＋個別学力検査1000点＝1275点。面接も含めて総合判定します。')}`);
 const generalDates=group(r(G,'schedule',1,2,3,4,5,6,7,9),`
 <h4 id="admission-general-dates">一般前期の出願・試験日程</h4>${table('一般前期の主な日程',[
 c('Web登録・検定料納入・書類受理','2027年1月25日（月）～2月3日（水）。時刻・郵送条件等は下の「一般選抜の未公表事項」をご覧ください。'),
 c('第1段階選抜の発表','2027年2月10日（水）。'),c('筆記・第1日','2027年2月25日（木）。国語9:30～11:00、数学13:30～16:00。'),c('筆記・第2日','2027年2月26日（金）。外国語9:30～11:30、理科13:30～16:30。'),c('面接','2027年2月27日（土）9:00～17:30の時間帯。受験者ごとの時刻は受験上の諸注意で案内。'),c('合格発表','2027年3月10日（水）。')
 ])}`);
 const generalSubjects=group(r(G,'exam',6,7,8,9),`
 <h4 id="admission-general-subjects">一般前期の個別科目・出題範囲</h4>${table('個別学力検査 1000点の内訳',[
 c('国語','150点・90分。現代の国語、言語文化、論理国語、文学国語、古典探究を併せて出題。'),c('数学','250点・150分。数学Ⅰ・Ⅱ・Ⅲ・Aは全範囲。数学Bは数列、数学Cはベクトル・平面上の曲線と複素数平面。'),c('理科','物理・化学・生物から2科目、計300点・180分。物理基礎＋物理、化学基礎＋化学、生物基礎＋生物の範囲。共通テストと同じ科目を選べます。'),c('外国語','300点・120分。英語・ドイツ語・フランス語・中国語から1か国語（韓国語は個別試験の選択肢にありません）。英語は英語コミュニケーションⅠ・Ⅱ・Ⅲ、論理・表現Ⅰ・Ⅱ・Ⅲ。')
 ],'subjects')}`);
 const generalConditions=group([...r(G,'exam',1,10),...r(G,'schedule',8),...r(G,'note',2)],`
 <h4 id="admission-general-qualification">一般前期の資格・面接書類</h4>${para('出願資格','高等学校等の卒業・2027年3月卒業見込み、12年課程修了、外国の課程、高卒認定、個別資格審査など、大学所定の8区分のいずれかに該当し、2027年度共通テストの指定科目を受験する必要があります。高卒認定・個別資格審査は2027年3月31日までに18歳に達することなど、各号の条件があります。過年度の共通テスト成績は利用しません。')}
 ${para('面接の評価','面接は数値配点を設けず、医師・医学研究者としての適性や人間性等を評価します。学科試験の成績にかかわらず不合格となる場合があります。')}
 ${para('第1段階選抜合格後の書類','受験までの経緯・志望理由等を記す面接参考書類の提出が必要です。様式・提出指示はWeb出願システムに受験上の諸注意とともに掲載されるため、合格後速やかに確認してください。')}
 ${para('調査書の利用','氏名・性別・住所等、個人を特定する情報や属性情報を除いて面接の参考資料とします。記載のない場合や不明確・疑義がある場合等には、卒業学校等に別途書類を求めることがあります。')}`);
 const generalVenue=group(r(G,'venue',0,1),para('一般前期の試験会場','吉田キャンパス（京都市左京区）で実施予定です。志願者数によっては別の場所で実施する場合があります。具体的な実施場所・経路は第1段階選抜結果発表・受験票ダウンロード時に案内されます。集合時刻・試験室は受験票と受験上の諸注意を確認してください。'));
 const pending=group([...r(G,'schedule',10,11),...r(G,'exam',12)],`
 <h4 id="admission-pending">一般選抜の未公表事項</h4><p>2027年度一般選抜の正式学生募集要項は、2026年12月中旬の公表予定です。次の事項は公開後に更新します。</p>${conditions([
 c('出願の細目','Web登録・検定料納入の開始締切時刻、検定料の金額・納入方法、書類受理の締切時刻、必着・消印条件と郵送方法は未公表です。'),c('発表と入学手続','第1段階選抜・最終合格の発表時刻と方法、入学手続期間・締切は未公表です。'),c('面接の細目','個人ごとの面接所要時間、人数構成は未公表です。')
 ])}`);
 const general=`<section data-admission-scheme="${G}"><h3 id="admission-general">一般前期の日程・選抜</h3>${generalDates}${generalScores}${generalSubjects}${generalConditions}${noted(G,3,'高卒認定合格者の情報免除')}${noted(G,4,'個別入学資格審査')}${generalVenue}${pending}${noted(G,6,'受験上の合理的配慮')}${panel(['selection-2027','general-guide-index','general-procedure-index','general-changes-index'])}</section>`;
 const qualification=group(r(S,'exam',1,2,3,4,7,8),`
 <h4 id="admission-special-qualification">特色入試の資格別の要件</h4><p>次のいずれかの資格に該当することに加え、学校長推薦、TOEFL iBTの所定の提出、医学科への強い志望と合格時の入学確約が必要です。求める人物像には、医学・生命科学への関心や医学研究者としての資質、MD-PhDコースへの進学希望を掲げています。</p>
 ${table('特色入試の出願資格と共通テスト・IB',[
 c('資格1','高校・中等教育学校を2027年3月卒業見込み。指定の共通テストを受験し、結果を提出。'),c('資格2','国内IB認定校（DP）を2026年4月～2027年3月に卒業・卒業見込み。共通テストに代えてIBディプロマスコアを参考とします。'),c('資格3','数学・物理・化学・生物の国際科学オリンピック日本代表として世界大会に出場し、高校・中等教育学校を2028年3月卒業見込み。飛び級のため共通テストは受験できず、自然科学で傑出した能力が必要。'),c('資格4','同じ国際科学オリンピック日本代表として世界大会に出場し、国内IB認定校（DP）を2027年4月～2028年3月卒業見込み。共通テストに代えてIBディプロマスコアを参考とします。'),c('資格5','文部科学大臣が認定・指定した在外教育施設の該当課程を2026年4月～2027年3月に修了・修了見込み。指定の共通テストを受験し、結果を提出。')
 ],'qualification')}${para('学校長推薦の人数','人格・識見等に優れ、学校長が責任をもって推薦できる者が対象です。各校1人。国際科学オリンピック日本代表で世界大会に出場した2028年3月卒業見込み者は、別枠で1人推薦できます。')}
 ${para('IBの予想点で出願する場合','資格2・4は最終スコアを後日提出します。')}
 ${para('共通テスト受験・結果提出の位置づけ','共通テストの得点は合否判定に使いません。該当資格者の受験・結果提出は推薦要件で、不受験や科目誤り等が判明した場合、理由を確認し入学を認めない場合があります。')}`);
 const specialDates=group([...r(S,'schedule',0,1,2,3,4,5,7),...r(S,'venue',0,1),...r(S,'note',3)],`
 <h4 id="admission-special-dates">特色入試の出願・試験日程</h4>${table('特色入試の日程・出願完了条件',[
 c('Web登録・検定料納入・書類到着','2026年11月5日（木）10:00～11月11日（水）17:00必着。期間内に3手続すべてを完了してください。印刷した宛名票を貼って簡易書留速達で郵送。持参不可。'),c('第1次選考結果・受験票','2026年11月27日（金）正午頃、Web出願システムで発表。掲載は12月11日（金）17:00まで。合格者は受験票・受験上の諸注意をダウンロードし、受験票をA4カラー印刷・指定部分を持参。'),c('口頭試問','2026年12月12日（土）8:50～17:00の時間帯。京都大学医学部医学科。'),c('面接','2026年12月13日（日）9:00～13:30の時間帯。京都大学医学部医学科。'),c('最終合格発表','2027年1月22日（金）正午頃、Web出願システムで発表。医学科は第2次選考結果と最終合格発表が同時です。掲載は2月17日（水）17:00まで。')
 ])}${para('集合時刻・試験室','個人ごとの時間、集合場所等は11月27日の結果発表・受験票ダウンロード時に案内されます。')}`);
 const specialSelection=group(r(S,'exam',9,10,11,12,15),`
 <h4 id="admission-special-selection">特色入試の選考・配点</h4><p>第1次選考は提出書類で選考し、合格者に口頭試問・面接による第2次選考を実施します。</p>
 <table class="kyoto-score-table" data-admission-table="scores"><caption>特色入試 第2次選考の配点</caption><thead><tr><th scope="col">口頭試問</th><th scope="col">面接</th><th scope="col">合計</th></tr></thead><tbody><tr><td>160点</td><td>240点</td><td>400点</td></tr></tbody></table>
 ${para('口頭試問の内容','物理・化学・生物の資料を読み、レポートを作成したうえで口頭試問を行い、論理的思考力・文章構成力等を評価します。公式FAQでは3科目から2科目を十分準備すること、2科目を組み合わせた問題もあり得ることを示しています。')}
 ${para('面接の内容','医学研究者・医師としての適性、社会的能力、科学的能力等を評価し、提出書類と口頭試問・面接の成績を総合して判定します。')}
 ${para('個人ごとの試験時間','口頭試問・面接の所要時間や人数構成は未公表です。各日の公表時間帯は、受験者全体の実施時間帯です。')}`);
 const specialDocuments=group([...r(S,'exam',5,13),...r(S,'note',0,2),...r(S,'schedule',8)],`
 <h4 id="admission-special-documents">特色入試の出願書類・結果提出</h4>${conditions([
 c('主な出願書類','Webで印刷する入学願書、厳封の調査書等、学校の推薦書、医学科所定の学びの設計書、TOEFL iBTスコアレポート、特色事項の資料。資格3・4は特色事項の資料が必須です。資格2・4で調査書を提出できない場合は、IB成績証明書の原本（取得見込み者は学校長発行のPredicted Grades）を提出してください。'),
 c('一条校のIB認定校','学校教育法第1条の学校に当たるIB認定校の卒業見込み者は資格1で出願します。調査書に加え、IB成績証明書の写し、又は学校長発行の予想成績の写しを参考資料として提出します。'),
 c('TOEFL iBT','Home Editionは利用できません。ETSから京都大学へ公式スコアを直接送付する手続（登録コード9501）を行い、出願時には直送手続済みの旨を付記した受験者用控えのコピーも提出します（この控えはオンライン出力可）。代替としてETSから郵送された受験者用スコアレポートの原本も利用できます。代替の原本提出にオンライン出力した控えは使えません。医学科欄に最低スコアの数値は示されていません。'),
 c('本人作成の書類','学びの設計書等は志願者本人が考え、自筆で作成します。生成AIを含む本人以外が作成した文章等は利用できません。学校側も全提出書類を事実確認してください。'),
 c('共通テスト成績請求チケット','該当者は「国公立推薦型選抜用」を指定台紙に貼り、指定の宛名票を付けて医学科教務掛へ提出します。提出日は受験上の諸注意で指定されます。未提出では受験者としての権利を失うため、資格別の例外も含め案内を確認してください。')
 ])}`);
 const enrollment=group([...r(S,'schedule',9),...r(S,'note',1,7)],`
 <h4 id="admission-special-enrollment">特色入試の入学手続・併願</h4>${para('入学手続書類','2027年2月17日（水）17:00必着。所定の書類と宛名票を使い、医学科教務担当へ簡易書留速達で郵送してください。')}
 ${para('併願','特色入試の学部・学科等を複数併願できません。一般選抜との併願は可能です。')}
 ${para('やむを得ない入学辞退',row(`${S}/note/7`).value)}`);
 const special=`<section data-admission-scheme="${S}"><h3 id="admission-special">特色入試の資格・日程・選考</h3>${qualification}${specialDates}${specialSelection}${specialDocuments}${enrollment}${noted(S,6,'MD-PhD進学者の奨学金')}${noted(S,10,'受験上の合理的配慮')}${panel(['special-2027','special-faq-2027','special-procedure-2027','special-changes-index'])}</section>`;
 const fees=group([...r(G,'note',5),...r(S,'exam',14),...r(S,'note',4,5,8,9)],`
 <h3 id="admission-fees">検定料・入学料と免除</h3>${table('特色入試で公表された費用（2027年度）',[
 c('入学検定料','17000円。別途決済手数料が必要です。最終額はWeb出願システムで確認してください。'),c('入学料','282000円（予定）。合格発表後から入学手続時までに指定の方法で納入。既納入学料は返還しません。入学料免除を希望する場合は納入しないでください。'),c('前期授業料','267900円（予定）。入学後に口座振替で納入。入学時や在学中に改定される場合があります。')
 ],'fees')}${para('特色の検定料返還',row(`${S}/note/4`).value)}
 ${para('一般前期・特色の災害による検定料免除','東日本大震災、熊本地震、平成30年7月豪雨、北海道胆振東部地震、令和元年台風19号、令和2年7月豪雨、令和6年能登半島地震による災害救助法適用地域で、主たる家計支持者が被災し、罹災証明書等を得られる場合は、検定料を免除することがあります。相談先は一般前期が075-753-2521、特色が075-753-2522です。')}
 ${para('入学料・授業料の減免',row(`${S}/note/9`).value)}${panel(['selection-2027','special-2027','special-procedure-2027'])}`);
 const location=group(b(0,1,2),`<h3 id="admission-campus">医学科の所在地・アクセス</h3>${table('医学研究科・医学部への交通',[0,1,2].map(i=>c(canonical.basicInfoRows[i].label,canonical.basicInfoRows[i].value)),'campus')}${panel(['medical-access'])}`);
 const statTable=(caption:string,rows:[string,number,number][])=>`<table class="kyoto-score-table" data-admission-table="statistics"><caption>${caption}（一般前期・105人）</caption><thead><tr><th scope="col">区分</th><th scope="col">人数</th><th scope="col">割合</th></tr></thead><tbody>${rows.map(([label,n,i])=>`<tr ${claim(b(i))}><th scope="row">${esc(label)}</th><td>${n}人</td><td>${(n/105*100).toFixed(1)}％</td></tr>`).join('')}<tr><th scope="row">合計</th><td>105人</td><td>100％</td></tr></tbody></table>`;
 const stats=`<h3 id="admission-entrants">2026年度医学科の入学者</h3>${group(b(7,8),`${table('2026年度 医学科の方式別入学者',[
 c('一般前期','105人。'),c('特色入試','4人。')
 ],'entrants')}<p>以下の男女別・卒業年別は、一般前期入学者105人の内訳です。特色入試入学者は含みません。割合は105人を母数に小数第1位へ四捨五入しています。</p>`)}${statTable('2026年度 医学科入学者の男女別',[['男子',83,3],['女子',22,4]])}${statTable('2026年度 医学科入学者の卒業年別',[['現役（2026年3月卒業）',68,5],['既卒（2025年3月以前）',37,6]])}${panel(['results-index','results-2026','guide-index','guide-results-2026'])}`;
 const expected=data.schemes.flatMap(s=>[['schedule',s.scheduleRows],['exam',s.examRows],['venue',s.venueRows],['note',s.notes]].flatMap(([kind,rows])=>(rows as unknown[]).map((_,i)=>`${s.id}/${kind}/${i}`))).concat(canonical.basicInfoRows.map((_,i)=>`basic/${i}`),data.coverageNotes.map((_,i)=>`coverage/${i}`));
 if(used.size!==expected.length||expected.some(o=>!used.has(o)))throw new Error(`Kyoto origin coverage: ${expected.filter(o=>!used.has(o)).join(',')}`);
 return `<h2 id="最新の入試情報">2027年度の入試情報</h2><section class="admission-readable kyoto-readable" data-admissions-presentation="kyoto-readable-v1" data-university-admissions-year="2027">${overview}${common}${general}${special}${fees}</section><h2 id="大学基本情報">大学基本情報</h2><section class="admission-readable kyoto-readable">${location}${stats}</section>`;
}
