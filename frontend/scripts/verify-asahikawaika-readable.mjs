import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'parse5';
import {pathToFileURL} from 'node:url';
import {applyUniversityAdmissionsFromIndex} from '../src/lib/universityAdmissions.ts';
const data=JSON.parse(fs.readFileSync(new URL('../src/data/universityAdmissions/asahikawaika.json',import.meta.url),'utf8'));
const overview=JSON.parse(fs.readFileSync(new URL('../src/data/asahikawaikaUniversityOverview.json',import.meta.url),'utf8'));
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const all=(n,p,r=[])=>{if(p(n))r.push(n);for(const c of n.childNodes??[])all(c,p,r);return r;};
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const clean=s=>s.replace(/\s/gu,'');
export function verifyAsahikawaikaReadable(html,candidate=data){
 const tree=parse(html),wrappers=all(tree,n=>attr(n,'data-admissions-presentation')==='asahikawaika-readable-v1');assert.equal(wrappers.length,1);
 const wrapper=wrappers[0],rendered=all(wrapper,n=>attr(n,'data-admission-origins')!==undefined),mappings=[];
 for(const scheme of candidate.schemes)for(const [kind,key]of [['schedule','scheduleRows'],['exam','examRows'],['venue','venueRows'],['note','notes']])for(const [index,row]of scheme[key].entries()){
  const id=`${scheme.id}/${kind}/${index}`,expected=row.value??row.text;
  const mergedPublication=kind==='note'&&(scheme.id==='general-first'&&index===4||scheme.id==='international-private'&&index===0);
  const mergedNoLate=kind==='note'&&scheme.id==='general-first'&&index===0;
  const nodes=rendered.filter(n=>JSON.parse(attr(n,'data-admission-origins')).includes(id));
  if(mergedPublication||mergedNoLate){
   assert.equal(nodes.length,0);
   const target=all(wrapper,n=>attr(n,'data-admission-coverage-note')===(mergedPublication?'2':'1'))[0];assert.ok(target);
   if(mergedPublication)for(const term of ['一般選抜','私費外国人留学生選抜','2026年11月上旬','未公表','募集要項の公開後に更新'])assert.ok(text(target).includes(term));
   else for(const term of ['2026年度から廃止','2027年度','前期日程のみ','看護学科','第2年次編入学'])assert.ok(text(target).includes(term));
   mappings.push({id,value:expected,displayTarget:mergedPublication?'admission-publication / coverage2':'admission-overview / coverage1',action:'merge-duplicate-explanation'});continue;
  }
  assert.ok(nodes.length>=1,`Missing ${id}`);
  if(nodes.some(n=>attr(n,'data-admission-quota-prefix')!==undefined)){
   const prefix=nodes.find(n=>attr(n,'data-admission-quota-prefix')!==undefined),remainder=nodes.find(n=>attr(n,'data-admission-merged-quota')!==undefined);
   assert.equal(nodes.length,2);assert.ok(remainder);assert.equal(clean(text(all(prefix,n=>attr(n,'data-admission-value')!==undefined)[0])),clean(expected.split('。')[0]));
   assert.deepEqual(JSON.parse(attr(remainder,'data-admission-origins')),['general-first/exam/0','international-private/exam/0']);
   assert.equal(text(all(remainder,n=>attr(n,'data-admission-value')!==undefined)[0]),'私費外国人留学生選抜の募集人員は、一般選抜（前期日程）の48名に含まれます。特別選抜の欠員は前期日程に加算されます。');
   assert.equal(expected,id==='general-first/exam/0'?'48名。特別選抜の欠員は前期日程に加算。私費外国人留学生選抜の募集人員は前期日程に含む。':'若干名。募集人員は一般前期日程の48名に含む。');
  }else if(id==='international-private/exam/6'){
   const prefix=nodes.find(n=>attr(n,'data-admission-score-prefix')!==undefined),remainder=nodes.find(n=>attr(n,'data-admission-score-remainder')!==undefined),total=nodes.find(n=>attr(n,'data-admission-derived-total')!==undefined);
   assert.equal(nodes.length,3);assert.ok(prefix&&remainder&&total);
   assert.equal(text(total),'350点');assert.equal(total.parentNode.parentNode.attrs.some(a=>a.name==='class'&&a.value==='admission-score-total'),true);
   const joined=text(prefix)+'。'+text(all(remainder,n=>attr(n,'data-admission-value')!==undefined)[0]);
   assert.equal(clean(joined),clean(expected.replace('個別試験等の合計は350点。','')));assert.ok(expected.includes('個別試験等の合計は350点。'));
  }else if(nodes.some(n=>attr(n,'data-admission-score-prefix')!==undefined)){
   const quota=nodes.some(n=>attr(n,'data-admission-quota-prefix')!==undefined);
   const prefix=nodes.find(n=>attr(n,quota?'data-admission-quota-prefix':'data-admission-score-prefix')!==undefined),remainder=nodes.find(n=>attr(n,quota?'data-admission-quota-remainder':'data-admission-score-remainder')!==undefined);
   assert.equal(nodes.length,remainder?2:1);
   const joined=text(all(prefix,n=>attr(n,'data-admission-value')!==undefined)[0]??prefix)+(remainder?'。'+text(all(remainder,n=>attr(n,'data-admission-value')!==undefined)[0]):'');
   assert.equal(clean(joined),clean(expected),`Score or condition differs ${id}`);
  }else{assert.equal(nodes.length,1,`Repeated ${id}`);assert.equal(clean(text(all(nodes[0],n=>attr(n,'data-admission-value')!==undefined)[0])),clean(expected),`Value differs ${id}`);}
  for(const node of nodes){const ids=JSON.parse(attr(node,'data-admission-source-ids'));for(const sourceId of row.sourceIds)assert.ok(ids.includes(sourceId),`Lost source ${id}/${sourceId}`);if(row.status)assert.equal(attr(node,'data-admission-status'),row.status);}
  mappings.push({id,value:expected,displayTarget:nodes.map(n=>n.tagName),action:nodes.some(n=>attr(n,'data-admission-merged-quota')!==undefined)?'merge-shared-quota-condition':id==='international-private/exam/6'?'split-score-condition-and-total-table':nodes.length===2?'split-score-and-condition':JSON.parse(attr(nodes[0],'data-admission-origins')).length>1?'merge-identical-routes':'retain'});
 }
 assert.equal(mappings.length,102);
 for(const table of all(tree,n=>n.tagName==='table'))assert.equal(all(table,n=>n.tagName==='a'&&/^https?:/u.test(attr(n,'href')??'')).length,0);
 const visible=text(wrapper).replace(text(all(wrapper,n=>n.tagName==='details')[0]),'');
 assert.doesNotMatch(visible,/前年から補完|混ぜていません|本表|転用|照合済み|原典の記載|表の日程は入学年度/u);
 for(const term of ['すべて満たす','両方を満たす','いずれか','2026年11月1日時点で継続3年以上','上川中部','北空知・中空知','13:20','9:45～11:45','9:00まで','120分','試験当日に選択','中央値以上','5月','学長が了承','17:00必着','免除・徴収猶予','最下位同点者は全員合格','1週間前','試験5日前','2025年度の成績','各得点率が80％以上'])assert.ok(visible.includes(term),`Lost critical condition: ${term}`);
 assert.equal([...visible.matchAll(/共通テストの数学Ⅱ・B・Cでは/gu)].length,2,'General and shared special rules each occur once');
 assert.equal(all(wrapper,n=>attr(n,'data-admission-merged-quota')!==undefined).length,1);
 assert.equal([...visible.matchAll(/特別選抜の欠員は前期日程に加算/gu)].length,1);
 assert.doesNotMatch(visible,/個別試験等の合計は350点|正式募集要項と受験票の指定を確認する|正式募集要項と受験票を確認する|持参する。|入場する。/u);
 for(const [i,value]of candidate.coverageNotes.entries()){
  const matches=all(wrapper,n=>attr(n,'data-admission-coverage-note')===String(i));assert.equal(matches.length,1);
  if(i!==0)assert.equal(clean(text(matches[0])),clean(value));else for(const s of candidate.schemes)assert.ok(text(matches[0]).includes(s.id==='general-first'?'一般選抜':s.id==='comprehensive-hokkaido'?'総合型':s.id==='recommendation-north-east'?'学校推薦型':'私費外国人留学生'));
 }
 assert.deepEqual(all(wrapper,n=>attr(n,'data-admission-scheme')!==undefined).map(n=>attr(n,'data-admission-scheme')),candidate.schemes.map(s=>s.id));
 const sourceItems=all(wrapper,n=>attr(n,'data-admission-source-id')!==undefined);assert.equal(sourceItems.length,candidate.sources.length);
 for(const s of candidate.sources){const item=sourceItems.find(n=>attr(n,'data-admission-source-id')===s.id);assert.ok(item);assert.equal(attr(all(item,n=>n.tagName==='a')[0],'href'),s.url);}
 const ids=all(tree,n=>attr(n,'id')!==undefined).map(n=>attr(n,'id'));assert.equal(new Set(ids).size,ids.length);
 const entrants=overview.entrants;for(const key of ['total','male','female','current','previous'])assert.equal(entrants.routes.reduce((n,r)=>n+r[key],0),entrants[key]);
 if(html.includes('data-asahikawaika-overview'))for(const term of ['2026年度 医学科1年次入学者（95人）','58人','37人','53人','42人','61.1%','38.9%','55.8%','44.2%','078-8510','27番','約35分','医大病院前','第2年次編入学を除く'])assert.ok(text(tree).includes(term),`Overview differs: ${term}`);
 return {passed:true,checkedAt:new Date().toISOString(),facts:mappings.length,tables:all(tree,n=>n.tagName==='table').length,mappings,coverageMappings:candidate.coverageNotes.map((value,index)=>({index,value,displayTarget:index===0?'admission-overview table':`coverage${index}`,action:index===0?'merge-into-overview':'retain'}))};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const [target,output]=process.argv.slice(2),raw=JSON.parse(fs.readFileSync(new URL('../src/data/generated/admissionInfoPosts.json',import.meta.url),'utf8'));
 const post=applyUniversityAdmissionsFromIndex(raw.find(p=>p.path===data.path),new Map([[data.path,data]]));
 const result=verifyAsahikawaikaReadable(target?fs.readFileSync(target,'utf8'):post.contentHtml);
 assert.equal(post.displayTitle,'旭川医科大学 医学部2027年度入試情報');assert.equal(post.keyPoints.length,3);
 if(output)fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,mappings:undefined}));
}
