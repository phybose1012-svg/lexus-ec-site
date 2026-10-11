import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import canonical from '../src/data/universityAdmissions/kagawa.json' with {type:'json'};
import {parseFragment} from 'parse5';
const compact=v=>v.replace(/\s+/gu,'').replace(/[，,]/gu,'');
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join(' ');
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)];
const expectedFacts=[];
for(const s of canonical.schemes)for(const [kind,key] of [['schedule','scheduleRows'],['exam','examRows'],['venue','venueRows'],['note','notes']])for(let i=0;i<s[key].length;i++)expectedFacts.push(`${s.id}/${kind}/${i}`);
canonical.coverageNotes.forEach((_,i)=>expectedFacts.push('coverage/'+i));canonical.basicInfoRows.forEach((_,i)=>expectedFacts.push('basic/'+i));
const criticalFragments=[
 '70人（調整予定・要確認）','2027年度募集要項では25人（調整予定）、公式Webでは30人（地域枠6人を含む）',
 '香川県内高校出身者枠10人程度は推薦募集人数の内数','欠員は、一般選抜前期で補充',
 '2026年11月2日10時～11月9日17時','17,000円＋払込手数料680円','2026年11月9日17時必着','11月7日までの消印かつ簡易書留・速達',
 'Web登録・検定料支払い・出願書類の提出の3つをすべて完了','2026年12月4日10時～2027年1月15日','2027年2月17日17時必着',
 '高校を2025年4月以降に卒業又は2027年3月卒業見込み','学習成績の状況4.0以上','旧教育課程はコミュニケーション英語Ⅲ・英語表現Ⅱ',
 '卒業見込み1校8人まで（香川県内校10人）、既卒1校1人まで（香川県内校10人）','2026年9月25日（金）必着','期限までに照会がなければ出願を受理しません',
 '英語はリーディング80点・リスニング20点','リスニング免除者はリーディング100点','志願倍率が約4倍を超えた場合',
 '共通テスト・個別試験の指定教科・科目をすべて受験','指定科目を第1解答科目として受験しなければ個別試験を受験できません','総合問題・面接の両方を受験',
 '総合問題は15分以上遅刻すると受験不可','間の時間は休憩時間ではありません','公共・倫理と公共・政治経済の組合せは選択できません',
 '2024年4月～2027年3月','総合38点以上（45点満点）','言語BのHL6以上若しくはSL7','少なくとも1科目HL',
 '2月3日17時必着','2月1日（月）までの消印があり、かつ簡易書留・速達','2月3日9～17時に限り持参可','2027年1月18日（月）～2月3日（水）（日本時間）',
 '2月3日（水）17時必着で直接送付','3月17日（水）17時までに提出','2027年3月15日17時必着','英語が母語の場合は提出免除',
 '1月8日17時必着','1月6日（水）までの消印があり、かつ簡易書留・速達','2026年12月25日（金）～2027年1月8日（金）（日本時間）',
 '両国の銀行手数料を負担','願書の受付印・出納印が必須','2026年12月18日（金）必着','申請書・履歴書・修了','国際返信切手券を同封する必要はありません',
 '2025又は2026年度の6月・11月試験','数学コース1又は2','出題言語は日本語','2025年1月31日以降に受験したTOEFL','2027年3月27日17時必着',
 '医学科の集合時刻は未公表','数学は15分以上遅刻すると受験不可。英語・理科・面接は遅刻不可',
 '本人及び保護者又は法定代理人が手書きで署名','医師免許取得後は直ちに県内で初期研修','初期研修を除く義務年限の半分以上は高松圏域以外',
 'うち2年以上は県が重点的に医師を配置','心身の故障等で業務が著しく困難','離脱回避に向けた相談が必要','不同意離脱として厚生労働省・日本専門医機構等へ報告',
 '原則として専門医認定を受けられません','2025又は2026年度の本学地域医療セミナー修了','9年間従事する意思',
 '試験実施が法適用日の属する年度末まで','出願前に必ず入試課','申請時には検定料を振り込まない','当該年度内に返還申請',
 '2026年11月上旬に公開予定','医学科の各科目・面接・EJUの配点、合計点・数値基準は2027年度募集要項に掲載されていません',
 '高田駅からバス約5分','徒歩約25分','駅前7番のりば','2026年度／医学科入学者／106人（2026年5月1日現在）',
 '2026年度医学科入学者の現役・既卒別人数は未公表','授業料前期321,480円・年額642,960円','2027年度以降の学士課程（昼間コース）入学者','在学生は改定対象外',
 '現在の2026年度案内','私費外国人留学生を除きます','徴収猶予は私費外国人留学生も対象'
];
export function verifyKagawaHtml(html) {
  const nodes=walk(parseFragment(html)),tables=nodes.filter(n=>n.tagName==='table');
  assert.equal(tables.length,15);
  const mapped=nodes.filter(n=>attr(n,'data-admission-origins'));
  const observed=new Set(mapped.flatMap(n=>attr(n,'data-admission-origins').split(/\s/u)));
  assert.deepEqual([...observed].sort(),expectedFacts.slice().sort(),'Every edited fact is mapped');
  for(const n of mapped)assert.ok(text(n).trim(),'Mapped facts must have visible text');
  const visible=compact(text(parseFragment(html.replace(/<details\b[^>]*>[\s\S]*?<\/details>/giu,''))));
  for(const fragment of criticalFragments)assert.ok(visible.includes(compact(fragment)),'Missing or changed critical fact: '+fragment);
  const scoped={
    'recommendation-ii/schedule/5':['11月9日17時必着','11月7日までの消印かつ簡易書留・速達','11月9日9～17時に限り持参可'],
    'recommendation-ii/schedule/11':['3つをすべて完了'],
    'recommendation-ii/exam/0':['英語以外の外国語は利用できません','リスニング免除者を除く','6教科8科目'],
    'general-early/exam/9':['指定教科・科目をすべて受験','リスニング免除者を除く','個別試験を受験できません'],
    'recommendation-ii/exam/5':['総合問題・面接の両方','基準未満','面接の結果','募集人数未満でも不合格'],
    'recommendation-ii/exam/6':['15分以上','休憩時間ではありません','面接は遅刻不可'],
    'international-baccalaureate/schedule/3':['2月3日17時必着','2月1日（月）までの消印','かつ簡易書留・速達','2月3日9～17時'],
    'international-baccalaureate/schedule/4':['本人名義・円建て','両国の銀行手数料','受付印・出納印'],
    'international-baccalaureate/schedule/5':['2月3日（水）17時必着で直接送付','3月17日（水）17時','入学を許可しないことがある'],
    'international-baccalaureate/schedule/9':['3月15日17時必着','教育企画課'],
    'international-baccalaureate/exam/0':['共通テストは課しません'],
    'international-baccalaureate/exam/5':['数学は15分以上','英語・理科・面接は遅刻不可'],
    'international-private/schedule/2':['1月8日17時必着','1月6日（水）までの消印','かつ簡易書留・速達'],
    'international-private/schedule/3':['本人名義・円建て','両国の銀行手数料','受付印・出納印'],
    'international-private/schedule/4':['12月18日（金）必着','履歴書','入試課（高松市幸町1番1号）','国際返信切手券'],
    'international-private/schedule/8':['3月27日17時必着'],
    'international-private/exam/6':['未公表','合計点・数値基準'],
    'recommendation-regional/note/1':['直ちに県内','初期研修を除く義務年限の半分以上','うち2年以上'],
    'recommendation-regional/note/2':['退学','死亡','国家試験不合格','知事がやむを得ない','離脱回避','不同意離脱','原則として専門医認定'],
    'coverage/5':['年度末まで','所有する自宅','死亡・行方不明'],
    'coverage/6':['出願前に必ず','振り込まない','証明書発行後に追加提出'],
    'basic/6':['2027年度以降','在学生は改定対象外','642,960円'],
    'basic/7':['現在の2026年度案内','私費外国人留学生を除き','猶予は私費外国人留学生も対象']
  };
  for(const [origin,fragments] of Object.entries(scoped)){const own=compact(mapped.filter(n=>attr(n,'data-admission-origins').split(/\s/u).includes(origin)).map(text).join(' '));for(const f of fragments)assert.ok(own.includes(compact(f)),'Changed scoped condition '+origin+': '+f);}
  const byCaption=tables.map(n=>({caption:text(n.childNodes.find(c=>c.tagName==='caption')),rows:walk(n).filter(n=>n.tagName==='tr').slice(1).map(n=>(n.childNodes??[]).filter(n=>['th','td'].includes(n.tagName)).map(n=>compact(text(n))))}));
  const general=byCaption.find(t=>t.caption.includes('一般前期（通常枠・地域枠）の配点'));
  assert.deepEqual(general.rows,[['国語','200','課さない'],['地歴公民','100','課さない'],['数学','100（ⅠA50・ⅡBC50）','200'],['理科2科目','200（各100）','200'],['外国語','100','200（英語）'],['情報Ⅰ','20','課さない'],['面接','課さない','100'],['各試験の合計','720','700'],['総合計','1420（共通＋個別）','']]);
  assert.deepEqual(byCaption.find(t=>t.caption.includes('推薦Ⅱの個別試験配点')).rows,[['総合問題','300'],['面接','150'],['合計','450']]);
  assert.deepEqual(byCaption.find(t=>t.caption.includes('IB選抜の配点')).rows,[['数学','200'],['理科2科目','200'],['英語','200'],['面接（日本語）','100'],['合計','700']]);
  assert.deepEqual(byCaption.find(t=>t.caption.includes('医学科入学者／106人')).rows,[['男性','52人','49.1%'],['女性','54人','50.9%'],['合計','106人','100%']]);
  assert.equal(Math.round(52/106*1000)/10,49.1);assert.equal(Math.round(54/106*1000)/10,50.9);
  const ids=new Set(nodes.map(n=>attr(n,'id')).filter(Boolean));for(const a of nodes.filter(n=>n.tagName==='a'&&attr(n,'href')?.startsWith('#')))assert.ok(ids.has(attr(a,'href').slice(1)),'Broken scheme link');
  const sources=new Set(nodes.filter(n=>n.tagName==='a').map(n=>attr(n,'data-admission-source-id')).filter(Boolean));assert.deepEqual([...sources].sort(),canonical.sources.map(s=>s.id).sort());
  for(const t of tables)assert.equal(walk(t).filter(n=>n.tagName==='a'&&/^http/iu.test(attr(n,'href')??'')).length,0);
  assert.ok(!/(?:転用しない|推測しない|補完しない|記録した|監査済み|照合済み)/u.test(visible));
  return{passed:true,mappedFacts:observed.size,tables:tables.length,criticalAssertions:criticalFragments.length,officialSources:sources.size};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const html=await fs.readFile(process.argv[2],'utf8');console.log(JSON.stringify(verifyKagawaHtml(html)));}
