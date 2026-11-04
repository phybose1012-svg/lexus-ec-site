/** Presentation-only reorganization of the existing, source-mapped Osakaika reader. */
type Route = {id:string; group:string; label:string; quota:string; subtitle:string; deadline:string; period:string; postal:string; first:string; firstLabel:string; second:string; points:string[]; alert?:string; score:'general'|'common'|'recommendation';};
const routes:Route[] = [
 {id:'general-early',group:'general',label:'一般前期',quota:'64人',subtitle:'大学独自の学力試験で受験',deadline:'2027.1.20（水）13:00',period:'2026.12.9（水）から',postal:'書類は1月20日消印有効・書留速達',first:'2.10（水）',firstLabel:'一次試験',second:'2.19（金）',score:'general',points:['英語・数学・理科2科目の記述式、計400点。','小論文は一次試験日に実施し、二次判定に使用。','二次試験日は選択不可。繰り上げ候補者の面接は3月3日。']},
 {id:'general-late',group:'general',label:'一般後期',quota:'15人',subtitle:'前期と日程・小論文の実施日が異なります',deadline:'2027.2.22（月）13:00',period:'2026.12.9（水）から',postal:'書類は2月22日消印有効・書留速達',first:'3.10（水）',firstLabel:'一次試験',second:'3.18（木）',score:'general',points:['英語・数学・理科2科目の記述式、計400点。','小論文は二次試験日に実施。個人面接も受験。','入学手続は3月26日15:00まで。']},
 {id:'common-test',group:'common',label:'共通テスト利用選抜',quota:'10人',subtitle:'指定の共通テストと大学の二次試験で選抜',deadline:'2027.1.15（金）13:00',period:'2026.12.9（水）から',postal:'書類は1月15日消印有効・書留速達',first:'1.16（土）・17（日）',firstLabel:'共通テスト',second:'2.28（日）',score:'common',points:['国語・数学・理科・英語を計700点に換算。','二次は小論文（400字程度）と個人面接。','一次の基準得点率は未公表。「至誠仁術」の約80％とは別。'],alert:'旧課程数学について資料間に記載差があります。利用できると判断せず、詳細と大学の案内を確認してください。'},
 {id:'shisei',group:'shisei',label:'総合型「至誠仁術」',quota:'5人',subtitle:'併願制／共通テストと小論文・複数回の面接',deadline:'2027.1.15（金）13:00',period:'2026.12.9（水）から',postal:'書類は1月15日消印有効・窓口から書留速達',first:'1.16（土）・17（日）',firstLabel:'共通テスト',second:'3.14（日）',score:'common',points:['一次は指定共通テスト700点の得点率おおむね80％が基準。','活動報告書と、客観的に評価できる2名の評価書が必要。','二次は小論文と複数回の面接。卒業時期などの資格条件も確認。'],alert:'旧課程数学の扱いは資料間に記載差があります。専願推薦への合格後は、併願制でも受験制限があります。'},
 {id:'recommendation',group:'recommendation',label:'公募制推薦',quota:'10人',subtitle:'専願制／学校長の推薦と英語資格が必要',deadline:'2026.11.7（土）13:00',period:'2026.11.1（日）9:00から',postal:'書類は11月7日消印有効・書留速達',first:'11.21（土）',firstLabel:'試験日（2026年）',second:'12.1（火）',score:'recommendation',points:['2027年3月卒業見込みの現役生が対象。評定は4.0以上。','英語資格の基準と、数学・理科の履修条件があります。','数学100点＋理科2科目150点。小論文・面接も実施。'],alert:'英語資格の有効期間に資料差があります。境界となるスコアは大学への確認が必要です。合格時は入学を確約する専願制です。'},
 {id:'designated',group:'recommendation',label:'指定校制推薦',quota:'一般5人＋地域指定1人',subtitle:'専願制／対象校と学校別の条件は在籍高校へ',deadline:'2026.11.7（土）',period:'2026.11.1（日）から',postal:'郵送は11月7日消印有効。Web締切時刻等は高校配布要項で確認',first:'11.21（土）',firstLabel:'試験日（2026年）',second:'12.1（火）',score:'recommendation',points:['一般枠と地域指定枠の2区分。どちらも専願制。','対象校・学校別条件・必要書類は高校配布要項で確認。','公募推薦の資格条件や提出方法を、そのまま当てはめないでください。'],alert:'公開資料だけでは学校別の出願条件が揃いません。Web登録・支払の時刻、入学手続の詳細は、必ず高校と大学で確認してください。'},
 {id:'regional-osaka',group:'regional',label:'大阪府地域枠',quota:'2人・認可申請中',subtitle:'一般前期と共通の試験／修学資金と卒業後の勤務条件あり',deadline:'2027.1.20（水）13:00',period:'2026.12.9（水）から',postal:'書類は1月20日消印有効・書留速達',first:'2.10（水）',firstLabel:'一次試験',second:'2.19（金）',score:'general',points:['日程・学力試験・一次会場は一般前期と共通。','地域医療への従事、入学確約と修学資金の条件があります。','貸与額だけでなく、返還免除・利子・勤務条件まで確認。'],alert:'2人は臨時定員増の認可申請中として掲載されています。募集の確定内容を大学の最新通知で確認してください。'},
];
const groups = [
 {id:'general',label:'一般選抜',sub:'前期・後期'}, {id:'common',label:'共通テスト利用',sub:'10人'},
 {id:'shisei',label:'総合型',sub:'至誠仁術'}, {id:'recommendation',label:'学校推薦型',sub:'公募・指定校'},
 {id:'regional',label:'大阪府地域枠',sub:'認可申請中'},
];
// Split complete direct children, preserving the canonical markup and fact attributes.
function children(html:string):string[] {
 const result:string[]=[];let depth=0,start=-1;
 const voids=new Set(['br','hr','img','input','meta','link','wbr','source','area','base','col','embed','param','track']);
 for(const m of html.matchAll(/<\/?([a-z][\w-]*)\b[^>]*>/gi)) {
  const token=m[0],tag=m[1].toLowerCase(),closing=token.startsWith('</');
  if(!closing){if(depth===0)start=m.index!;if(!voids.has(tag)&&!token.endsWith('/>'))depth++;}
  else depth--;
  if(depth===0&&start>=0){result.push(html.slice(start,m.index!+token.length));start=-1;}
 }
 if(depth!==0)throw new Error('Unbalanced Osakaika content');
 return result;
}
export function renderOsakaikaAdmissionsTabs(original:string):string {
 const start=original.indexOf('>')+1,end=original.lastIndexOf('</div><style>');
 if(end<start)throw new Error('Unexpected Osakaika reader wrapper');
 const body=original.slice(start,end), headings=[...body.matchAll(/<h2\b[^>]*id="osakaika-([^"]+)"[^>]*>[\s\S]*?<\/h2>/g)];
 const sections=new Map(headings.map((h,i)=>[h[1],children(body.slice(h.index!+h[0].length,headings[i+1]?.index??body.length))]));
 const get=(id:string)=>{const value=sections.get(id);if(!value)throw new Error('Missing Osakaika section '+id);return value;};
 const section=(id:string)=>get(id).join('');
 const raw=(id:string,indices:number[])=>indices.map(i=>get(id)[i]??'').join('');
 const disclosure=(title:string,desc:string,content:string,cls='')=>`<details class="oat-detail ${cls}"><summary><span>${title}<small>${desc}</small></span><span class="oat-plus" aria-hidden="true"></span></summary><div class="oat-detail-body">${content}</div></details>`;
 const source=(id:string)=>get(id).filter(b=>b.startsWith('<details')).join('');
 const compactScore=(r:Route)=>{
  const rows=r.score==='general'?[['数学','100点','90分'],['理科2科目','200点','120分'],['英語','100点','80分']]:r.score==='common'?[['国語','100点','近代以降の文章'],['数学','200点','2科目必須'],['理科','200点','2科目選択'],['英語','200点','R：L＝4：1']]:[['数学','100点','60分'],['理科2科目','150点','90分']];
  const total=r.score==='general'?'400':r.score==='common'?'700':'250';
  return `<div class="oat-score-head"><h3>試験科目・配点</h3><span>${r.score==='common'?'共通テスト換算':r.score==='recommendation'?'基礎学力試験':'学力試験'} <strong>${total}</strong>点</span></div><dl class="oat-scores">${rows.map(x=>`<div><dt>${x[0]}</dt><dd><strong>${x[1]}</strong><small>${x[2]}</small></dd></div>`).join('')}</dl>`;
 };
 const routeHtml=(r:Route)=>{
  const own=get(r.id),schedule=r.id==='designated'?own[3]:r.id==='regional-osaka'?get('general-early')[0]:own[0];
  let exam='',eligibility='';
  if(['general-early','general-late','regional-osaka'].includes(r.id)) {
   exam=raw('general-early',[2,3,5,6,7])+raw(r.id==='general-late'?'general-late':'general-early',[r.id==='general-late'?1:4]);
   eligibility=raw('general-early',[1]);
  }else if(r.id==='common-test') {exam=section('common-subjects')+raw(r.id,[1,2,3]);eligibility=raw('general-early',[1]);}
  else if(r.id==='shisei'){exam=section('common-subjects')+raw(r.id,[6,7,8]);eligibility=raw(r.id,[1,2,3,4,5,9]);}
  else if(r.id==='recommendation'){exam=raw(r.id,[12,13,14]);eligibility=raw(r.id,[1,2,3,4,5,6,7,8,9,10,11,15,16]);}
  else {exam=raw(r.id,[7,8]);eligibility=raw(r.id,[0,1,2,4,5,6,9,10,11]);}
  const endLabel=['recommendation','designated'].includes(r.id)?'合格発表（2026年）':'二次試験（2027年）';
  return `<section class="oat-route" id="osakaika-${r.id}" data-oat-route="${r.id}" aria-labelledby="oat-heading-${r.id}"${r.id==='general-early'?'':' hidden'}>
   <header class="oat-route-head"><div><p class="oat-eyebrow">選択中の入試方式</p><h2 id="oat-heading-${r.id}" tabindex="-1">${r.label}</h2><p>${r.subtitle}</p></div><div class="oat-quota"><small>募集人員</small><strong>${r.quota}</strong></div></header>
   ${r.alert?`<p class="oat-alert"><strong>出願前に確認</strong>${r.alert}</p>`:''}
   <div class="oat-dates"><div class="oat-deadline"><span>${r.id==='designated'?'出願・郵送期限':'Web出願締切'}</span><strong>${r.deadline}</strong><small>${r.period}</small></div><div><span>${r.firstLabel}${r.firstLabel.includes('2026')?'':'（2027年）'}</span><strong>${r.first}</strong></div><div><span>${endLabel}</span><strong>${r.second}</strong></div></div>
   <p class="oat-postal">${r.postal}</p>
   <div class="oat-points"><h3>まず押さえる3点</h3><ol>${r.points.map((p,i)=>`<li><span aria-hidden="true">0${i+1}</span>${p}</li>`).join('')}</ol></div>
   ${disclosure('日程をすべて確認','出願・受験票・合格発表・入学手続',schedule+source(r.id),'oat-schedule')}
   <section class="oat-exams">${compactScore(r)}${disclosure('出題範囲・小論文・面接の詳細','科目の指定・評価方法・注意事項',exam+source(r.id))}</section>
   ${disclosure('出願資格・提出書類を確認','受験できる条件・必要な証明書など',eligibility+`<p>検定料・調査書・併願などは、<button type="button" class="oat-text-button" data-oat-open="procedures">出願の共通ルール</button>も確認してください。</p>`+source(r.id))}
   ${r.id==='regional-osaka'?disclosure('修学資金・勤務義務を確認','返還免除・利子・保証人・例外条件',section('regional-osaka')):''}
   <div class="oat-next"><p>最後に、方式共通の条件も確認</p><div><button type="button" data-oat-open="procedures">検定料・出願ルール <span>↗</span></button><button type="button" data-oat-open="venues">試験会場・当日の注意 <span>↗</span></button><button type="button" data-oat-open="fees">学費・入学手続 <span>↗</span></button></div></div>
  </section>`;
 };
 const dialog=(id:string,title:string,content:string)=>`<dialog class="oat-dialog" id="oat-dialog-${id}" aria-labelledby="oat-dialog-title-${id}"><header><div><small>大阪医科薬科大学 医学科</small><h2 id="oat-dialog-title-${id}">${title}</h2></div><button type="button" data-oat-close aria-label="閉じる">×</button></header><div class="oat-dialog-body">${content}</div><footer><button type="button" data-oat-close>確認を終えて戻る</button></footer></dialog>`;
 let result=`<div class="oat-root" data-osakaika-tabs><div class="oat-intro"><div><p class="oat-eyebrow">2027 ADMISSIONS</p><h2 id="oat-selection">入試方式を選ぶ</h2><p>日程・配点・出願条件を、方式ごとにまとめました。</p></div><button type="button" class="oat-compare" data-oat-open="overview">全方式を比較 <span aria-hidden="true">↗</span></button></div>
 <div class="oat-tabs-wrap"><div class="oat-tabs" role="tablist" aria-label="入試形式">${groups.map((g,i)=>`<button type="button" role="tab" id="oat-tab-${g.id}" aria-controls="oat-group-${g.id}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-oat-group-tab="${g.id}"><span>${g.label}</span><small>${g.sub}</small></button>`).join('')}</div></div>
 <p class="oat-sr" aria-live="polite" data-oat-live></p>
 ${groups.map(g=>{const chosen=routes.filter(r=>r.group===g.id);return `<div id="oat-group-${g.id}" class="oat-group" role="tabpanel" aria-labelledby="oat-tab-${g.id}" data-oat-group="${g.id}"${g.id==='general'?'':' hidden'}>${chosen.length>1?`<div class="oat-subtabs" role="group" aria-label="${g.label}の区分">${chosen.map((r,i)=>`<button type="button" data-oat-route-tab="${r.id}" aria-pressed="${i===0}">${r.label}<small>${r.quota}</small></button>`).join('')}</div>`:''}${chosen.map(routeHtml).join('')}</div>`;}).join('')}
 <section class="oat-university"><div><h2>大学情報・掲載資料</h2><p>医学科の所在地・入学者データもこちらから。</p></div><button type="button" data-oat-open="basic">大学情報を見る <span>↗</span></button></section>
 <p class="oat-notice">掲載内容は大学の変更通知・受験票とあわせて確認してください。資料の確認日は各「情報ソースはこちら」に掲載しています。</p>
 ${dialog('overview','全方式の募集人員・主要日程',raw('overview',[2])+disclosure('募集人員について','医学科110人／府地域枠2人は認可申請中',raw('overview',[0,1]))+source('overview'))}${dialog('procedures','検定料・出願の共通ルール',section('procedures'))}${dialog('venues','試験会場・当日の注意',section('venues'))}${dialog('fees','学費・奨学金・入学手続',section('fees'))}${dialog('basic','医学科の所在地・入学者データ',section('basic'))}
 <noscript><style>.oat-root [hidden]{display:block!important}.oat-root .oat-tabs-wrap,.oat-root .oat-subtabs,.oat-root .oat-dialog>header button,.oat-root .oat-dialog>footer{display:none}.oat-root .oat-dialog{display:block;position:static;width:100%;max-height:none;border:1px solid #d9e2e4;box-shadow:none;margin:30px 0}</style></noscript></div>`;
 // Cross references now open the relevant tab/dialog; replace directional prose.
 result=result.replace(/上の指定共通テスト/g,'本方式の指定共通テスト');
 const before=[...new Set([...original.matchAll(/data-admission-origins="([^"]+)"/g)].flatMap(m=>m[1].split(/\s+/)))];
 const after=new Set([...result.matchAll(/data-admission-origins="([^"]+)"/g)].flatMap(m=>m[1].split(/\s+/)));
 const missing=before.filter(id=>!after.has(id));
 if(missing.length)throw new Error('Missing tabbed Osakaika facts: '+missing.join(','));
 return result;
}
