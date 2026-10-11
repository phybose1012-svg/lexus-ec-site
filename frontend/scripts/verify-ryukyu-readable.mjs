import fs from 'node:fs';import assert from 'node:assert/strict';import {parse} from 'parse5';import {pathToFileURL} from 'node:url';
import {applyUniversityAdmissionsFromIndex,renderUniversityAdmissions} from '../src/lib/universityAdmissions.ts';
// Use the real main safety transform; staging validates against the pinned main source fixture.
const safetyUrl=new URL('../src/lib/universityInfoSafety.ts',import.meta.url);
const mainSafetyReferenceUrl=new URL('./fixtures/ryukyu-main-safety-reference.ts',import.meta.url);
const {transformUniversityInfoPost}=await import(fs.existsSync(safetyUrl)?safetyUrl.href:mainSafetyReferenceUrl.href);
import {ryukyuReaderText,ryukyuCommonScoreModel,ryukyuIndividualScoreModel} from '../src/lib/ryukyuAdmissionsReadable.ts';
const data=JSON.parse(fs.readFileSync(new URL('../src/data/universityAdmissions/ryukyu.json',import.meta.url),'utf8'));
const overview=JSON.parse(fs.readFileSync(new URL('../src/data/ryukyuUniversityOverview.json',import.meta.url),'utf8'));
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const all=(n,p,r=[])=>{if(p(n))r.push(n);for(const c of n.childNodes??[])all(c,p,r);return r;};
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const clean=s=>s.replace(/\s/gu,'');
const value=n=>text(all(n,c=>attr(c,'data-admission-value')!==undefined)[0]??n);
const rows=n=>all(n,c=>c.tagName==='tbody')[0].childNodes.filter(c=>c.tagName==='tr').map(r=>r.childNodes.filter(c=>['td','th'].includes(c.tagName)).map(text));
const points=n=>n.toLocaleString('en-US')+'点';
export function verifyRyukyuReadable(html,candidate=data){
 const tree=parse(html),wrappers=all(tree,n=>attr(n,'data-admissions-presentation')==='ryukyu-readable-v1');assert.equal(wrappers.length,1);
 const wrapper=wrappers[0],rendered=all(wrapper,n=>attr(n,'data-admission-origins')!==undefined),mappings=[];
 const known=new Set(candidate.schemes.flatMap(s=>[['schedule',s.scheduleRows],['exam',s.examRows],['venue',s.venueRows],['note',s.notes]].flatMap(([k,rs])=>rs.map((_,i)=>`${s.id}/${k}/${i}`))));
 for(const n of rendered)for(const id of JSON.parse(attr(n,'data-admission-origins')))assert.ok(known.has(id),`Unknown origin ${id}`);
 for(const s of candidate.schemes)for(const [kind,key]of [['schedule','scheduleRows'],['exam','examRows'],['venue','venueRows'],['note','notes']])for(const [i,r]of s[key].entries()){
  const id=`${s.id}/${kind}/${i}`,raw=r.value??r.text,nodes=rendered.filter(n=>JSON.parse(attr(n,'data-admission-origins')).includes(id));assert.equal(nodes.length,1,`Missing or repeated ${id}`);
  const n=nodes[0],scoreKind=attr(n,'data-admission-score-block');
  if(scoreKind){
   const model=scoreKind==='common'?ryukyuCommonScoreModel(raw):ryukyuIndividualScoreModel(raw),table=all(n,c=>c.tagName==='table');assert.equal(table.length,1);
   assert.deepEqual(rows(table[0]),[...model.rows.map(([l,p])=>[l,points(p)]),['合計',points(model.total)]],`Score matrix differs ${id}`);
   if(scoreKind==='common'){
    assert.ok(value(n).includes('6教科8科目'));
    const d=all(n,c=>c.tagName==='dd').map(c=>clean(text(c)));assert.deepEqual(d,model.choices.map(([,t])=>clean(t)),`Subject choice differs ${id}`);
   }else{
    assert.ok(value(n).includes(`共通テストと個別の総合計：${points(model.overall)}`),`Total differs ${id}`);
    assert.ok(clean(value(n)).endsWith(clean(model.detail)),`Scope or evaluation differs ${id}`);
   }
  }else assert.equal(clean(value(n)),clean(ryukyuReaderText(raw)),`Value differs ${id}`);
  const sourceIds=JSON.parse(attr(n,'data-admission-source-ids'));for(const sourceId of r.sourceIds)assert.ok(sourceIds.includes(sourceId),`Lost source ${id}`);
  if(r.status)assert.equal(attr(n,'data-admission-status'),r.status,`Lost status ${id}`);
  mappings.push({id,label:r.label??'注記',value:raw,displayText:value(n),sourceIds:r.sourceIds,displayTarget:scoreKind?'score-table-and-conditions':n.tagName,action:scoreKind?'split-subjects-scores-and-conditions':JSON.parse(attr(n,'data-admission-origins')).length>1?'merge-identical-facts':'retain'});
 }
 assert.equal(mappings.length,61);
 const coverageMappings=candidate.coverageNotes.map((v,i)=>{const nodes=all(wrapper,n=>attr(n,'data-admission-coverage-note')===String(i));assert.equal(nodes.length,1);assert.equal(clean(text(nodes[0])),clean(ryukyuReaderText(v)));return {index:i,value:v,displayText:text(nodes[0])};});
 for(const t of all(tree,n=>n.tagName==='table')){assert.equal(all(t,n=>n.tagName==='a'&&/^https?:/u.test(attr(n,'href')??'')).length,0);assert.doesNotMatch(text(t),/資料\d|PDF\s*pp|原典/u);assert.ok(all(t,n=>n.tagName==='caption').length);assert.equal(all(t,n=>n.tagName==='th'&&attr(n,'scope')===undefined).length,0);}
 const details=all(wrapper,n=>n.tagName==='details'),visible=text(wrapper).replace(text(details[0]),'');assert.doesNotMatch(visible,/要確認|照合済|ご依頼|JSON|監査済/u);
 const extraFacts=[['recommendation-late-arrival','試験開始時刻（面接は集合時刻）から30分を超えて遅刻した場合は受験できません。面接は受験者全員が集合次第、開始する場合があります。'],['geography-combined-subject','「地理総合／歴史総合／公共」を選択する場合は、出題範囲の「地理総合」「歴史総合」「公共」から2つを選択解答して1科目とします。']];
 for(const [id,expected]of extraFacts){const nodes=all(wrapper,n=>attr(n,'data-ryukyu-extra-fact')===id);assert.equal(nodes.length,1);assert.equal(text(nodes[0]),expected);}
 for(const term of ['17:00必着','消印有効ではない','9:30までに集合','集合12:40','開始13:00','17,000円','900円','650円','2026年12月4日','2027年1月15日','第1解答科目','受験資格を失う','リスニング0点','免除者','約5倍','約10倍','4.3以上','2025年4月1日','石垣市・宮古島市・久米島町・大宜味村・今帰仁村・本部町・名護市・宜野座村','6年間','2年以内','9年以上','4年間','最短9・10・11年','不同意離脱','法定代理人','生計維持者','千原1番地','西普天間','294は土日運行なし','1大学・学部のみ','未公表'])assert.ok(visible.includes(term),`Lost important exception: ${term}`);
 assert.deepEqual(all(wrapper,n=>attr(n,'data-admission-scheme')!==undefined).map(n=>attr(n,'data-admission-scheme')),candidate.schemes.map(s=>s.id));
 const sourceItems=all(wrapper,n=>attr(n,'data-admission-source-id')!==undefined);assert.equal(sourceItems.length,candidate.sources.length);
 for(const s of candidate.sources){const item=sourceItems.find(n=>attr(n,'data-admission-source-id')===s.id);assert.ok(item);assert.equal(attr(all(item,n=>n.tagName==='a')[0],'href'),s.url);}
 const ids=all(tree,n=>attr(n,'id')!==undefined).map(n=>attr(n,'id'));assert.equal(new Set(ids).size,ids.length);for(const a of all(wrapper,n=>n.tagName==='a'&&(attr(n,'href')??'').startsWith('#')))assert.ok(ids.includes(decodeURIComponent(attr(a,'href').slice(1))));
 const summary=all(wrapper,n=>n.tagName==='table'&&attr(n,'class')==='admission-overview-table')[0];assert.deepEqual(rows(summary).map(r=>r.map(clean)),[['一般選抜（前期）','70人','2027年1月25日～2月3日','2027年2月25日・26日'],['一般選抜（後期）','23人','2027年1月25日～2月3日','2027年3月12日'],['学校推薦型選抜Ⅱ離島・北部枠','7人','2026年11月1日～6日17:00必着','2026年12月2日']].map(r=>r.map((v,i)=>i?v:clean(v))).map(r=>r.map((v,i)=>i?['','公表募集人数','書類提出期間','大学の試験日'][i]+v:v)));
 if(html.includes('data-ryukyu-overview')){
  const basic=all(tree,n=>attr(n,'data-ryukyu-overview')!==undefined)[0],tables=all(basic,n=>n.tagName==='table');assert.equal(tables.length,2);
  assert.deepEqual(tables.map(t=>text(all(t,n=>n.tagName==='caption')[0])),['2026年度 医学科入学者（全選抜・110人）：男女別','2026年度 医学科入学者（全選抜・110人）：現役・既卒別']);
  assert.deepEqual(rows(tables[0]),[['男性','61人','55.5%'],['女性','49人','44.5%']]);assert.deepEqual(rows(tables[1]),[['現役','59人','53.6%'],['既卒','50人','45.5%'],['その他','1人','0.9%']]);
  assert.deepEqual(all(basic,n=>n.tagName==='a').map(n=>attr(n,'href')),overview.sources.map(s=>s.url));
  for(const term of ['2026年度 医学科入学者（全選抜・110人）','901-2720','喜友名1076番地','2025年4月1日','25番','125番','294番','病院正面玄関前','北方向に徒歩約6分','土日の運行がありません','私費外国人留学生特別選抜と追加合格者','県内・県外','その他'])assert.ok(text(basic).includes(term),`Overview differs ${term}`);
 }
 return {passed:true,checkedAt:new Date().toISOString(),facts:mappings.length,coverage:coverageMappings.length,tables:all(tree,n=>n.tagName==='table').length,mappings,coverageMappings,extraFacts:extraFacts.map(([id,displayText])=>({id,displayText}))};
}
export function verifyRyukyuTransforms(){
 const raw=JSON.parse(fs.readFileSync(new URL('../src/data/generated/admissionInfoPosts.json',import.meta.url),'utf8')),post=raw.find(p=>p.path===data.path),index=new Map([[data.path,data]]);
 const a=applyUniversityAdmissionsFromIndex(post,index),b=applyUniversityAdmissionsFromIndex(transformUniversityInfoPost(post),index);assert.deepEqual(a,b);assert.equal(a.displayTitle,'琉球大学 医学部2027年度入試情報');assert.equal(a.keyPoints.length,3);assert.equal(a.infoItems.find(i=>i.label==='年度').value,'2027年度（入試情報）');assert.equal(a.infoItems.find(i=>i.label==='地域').value,'九州・沖縄');assert.equal(a.infoItems.find(i=>i.label==='種別').value,'入試情報');assert.doesNotMatch(a.contentHtml,/data-university-info-safety/u);assert.ok(a.toc.some(n=>n.id==='admission-region-duty'));assert.deepEqual(applyUniversityAdmissionsFromIndex(a,index),a);for(const other of raw.filter(p=>p.path!==data.path))assert.equal(applyUniversityAdmissionsFromIndex(other,index),other);assert.ok(a.contentHtml.startsWith(renderUniversityAdmissions(data)));return a;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const [target,output]=process.argv.slice(2),post=verifyRyukyuTransforms(),result=verifyRyukyuReadable(target?fs.readFileSync(target,'utf8'):post.contentHtml);if(output)fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,mappings:undefined,coverageMappings:undefined,rawAndMainTransformsIdentical:true,otherUniversitiesUnchanged:true}));}
