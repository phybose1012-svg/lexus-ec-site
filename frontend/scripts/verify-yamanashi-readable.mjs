import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'parse5';
import {pathToFileURL} from 'node:url';
import {renderUniversityAdmissions,applyUniversityAdmissionsFromIndex} from '../src/lib/universityAdmissions.ts';
const data=JSON.parse(fs.readFileSync(new URL('../src/data/universityAdmissions/yamanashi.json',import.meta.url),'utf8'));
const overview=JSON.parse(fs.readFileSync(new URL('../src/data/yamanashiUniversityOverview.json',import.meta.url),'utf8'));
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const all=(n,p,r=[])=>{if(p(n))r.push(n);for(const c of n.childNodes??[])all(c,p,r);return r;};
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const clean=s=>s.replace(/\s/gu,'');
export function verifyYamanashiReadable(html,candidate=data){
 const tree=parse(html),wrappers=all(tree,n=>attr(n,'data-admissions-presentation')==='yamanashi-readable-v1');assert.equal(wrappers.length,1);
 const wrapper=wrappers[0],rendered=all(wrapper,n=>attr(n,'data-admission-origins')!==undefined),mappings=[];
 for(const scheme of candidate.schemes)for(const [kind,key] of [['schedule','scheduleRows'],['exam','examRows'],['venue','venueRows'],['note','notes']])for(const [index,row] of scheme[key].entries()){
  const id=`${scheme.id}/${kind}/${index}`,value=row.value??row.text;
  const nodes=rendered.filter(n=>JSON.parse(attr(n,'data-admission-origins')).includes(id));
  if(kind==='note'&&index===5&&scheme.id.startsWith('recommendation-')){
   assert.equal(nodes.length,0);const coverage=all(wrapper,n=>attr(n,'data-admission-coverage-note')==='3')[0];
   for(const detail of ['2027年度','全国募集枠','臨時定員増','承認','変更通知'])assert.ok(text(coverage).includes(detail));
   mappings.push({id,displayTarget:'admission-overview / coverage3',action:'merged-duplicate',value});continue;
  }
  assert.ok(nodes.length>=1,`Missing ${id}`);
  const parts=nodes.map(n=>text(all(n,c=>attr(c,'data-admission-value')!==undefined)[0]??n));
  if(nodes.some(n=>attr(n,'data-admission-score-prefix')!==undefined)){
   const prefix=nodes.find(n=>attr(n,'data-admission-score-prefix')!==undefined),remainder=nodes.find(n=>attr(n,'data-admission-score-remainder')!==undefined);
   assert.equal(nodes.length,remainder?2:1);
   const joined=text(prefix)+(remainder?'。'+text(all(remainder,n=>attr(n,'data-admission-value')!==undefined)[0]):'');
   assert.equal(clean(joined),clean(value),`Score scope differs ${id}`);
  }else {assert.equal(nodes.length,1,`Repeated ${id}`);assert.equal(clean(parts[0]),clean(value),`Value differs ${id}`);}
  if(row.status==='unpublished')assert.equal(attr(nodes[0],'data-admission-status'),'unpublished');
  for(const node of nodes)assert.deepEqual(JSON.parse(attr(node,'data-admission-source-ids')),row.sourceIds);
  mappings.push({id,displayTarget:nodes.map(n=>n.tagName),action:nodes.length===2?'split-score-and-scope':JSON.parse(attr(nodes[0],'data-admission-origins')).length>1?'merge-identical-routes':'retain',value});
 }
 for(const table of all(tree,n=>n.tagName==='table'))assert.equal(all(table,n=>n.tagName==='a'&&/^https?:/u.test(attr(n,'href')??'')).length,0);
 const publishedText=text(wrapper).replace(text(all(wrapper,n=>n.tagName==='details')[0]),'');
 assert.doesNotMatch(publishedText,/推測していません|転用|本表|募集要項p\.|要項\d+頁|原典の記載|照合済み/u);
 for(const term of ['16時30分必着','12時〜13時を除く','15年以内に9年間','約1.2倍','約1.5倍','2026年10月1日','全範囲','出願無資格','リスニング免除','県内枠を先','1つの大学・学部','いずれか','すべて'])assert.ok(publishedText.includes(term),`Lost critical condition: ${term}`);
 const schemeIds=all(wrapper,n=>attr(n,'data-admission-scheme')!==undefined).map(n=>attr(n,'data-admission-scheme'));assert.deepEqual(schemeIds,candidate.schemes.map(s=>s.id));
 const ids=all(tree,n=>attr(n,'id')!==undefined).map(n=>attr(n,'id'));assert.equal(new Set(ids).size,ids.length,'Duplicate anchors');
 assert.equal(overview.entrants.male+overview.entrants.female,125);
 if(html.includes('data-yamanashi-overview')){for(const term of ['2026年度 医学科入学者（125人）','89人','36人','71.2%','28.8%','409-3898','3番乗り場'])assert.ok(text(tree).includes(term));}
 return {passed:true,checkedAt:new Date().toISOString(),facts:mappings.length,tables:all(tree,n=>n.tagName==='table').length,mappings};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const [target,output]=process.argv.slice(2);
 const raw=JSON.parse(fs.readFileSync(new URL('../src/data/generated/admissionInfoPosts.json',import.meta.url),'utf8'));
 const original=raw.find(p=>p.path===data.path),post=applyUniversityAdmissionsFromIndex(original,new Map([[data.path,data]]));
 const result=verifyYamanashiReadable(target?fs.readFileSync(target,'utf8'):post.contentHtml);
 assert.ok(post.contentHtml.indexOf('最新の入試情報')<post.contentHtml.indexOf('大学基本情報'));
 assert.equal(post.displayTitle,'山梨大学 医学部2027年度入試情報');assert.equal(post.keyPoints.length,3);
 if(output)fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({...result,mappings:undefined}));
}
