import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
// In frontend/scripts this resolves the current frontend; the isolated report-only
// test may point it at the actual staging frontend without editing that worktree.
const frontendRoot=process.env.SAPPORO_FRONTEND_ROOT
 ? pathToFileURL(process.env.SAPPORO_FRONTEND_ROOT.replace(/[\\/]?$/u,'/')).href
 : new URL('../',import.meta.url).href;
const src=file=>new URL(file,frontendRoot);
const {parse}=createRequire(src('package.json'))('parse5');
const {applyUniversityAdmissionsFromIndex,renderUniversityAdmissions,validateUniversityAdmissions}=await import(src('src/lib/universityAdmissions.ts').href);

const candidateBytes=fs.readFileSync(src('src/data/universityAdmissions/sapporoika.json'));
assert.equal(crypto.createHash('sha256').update(candidateBytes).digest('hex'),'5d1ebd96805eab4628a1781809fcb7a6995544a6e6afe69b51675e81893ab376','Exact Sapporo candidate changed');
if(process.env.SAPPORO_ROOT_SCOPE_FILE){
const scopeBytes=fs.readFileSync(process.env.SAPPORO_ROOT_SCOPE_FILE);
assert.equal(crypto.createHash('sha256').update(scopeBytes).digest('hex'),'4966d401a958fc8cbb5d2188ff0d6f3d1d3b7d70540d528f679148dcdcdbafa7','ROOT visible-unresolved scope decision changed');
const scope=JSON.parse(scopeBytes.toString('utf8'));
assert.equal(scope.pins.candidate,'5d1ebd96805eab4628a1781809fcb7a6995544a6e6afe69b51675e81893ab376');
assert.equal(scope.publicationAuthorized,false);
}
const data=JSON.parse(candidateBytes.toString('utf8'));
const overview=JSON.parse(fs.readFileSync(src('src/data/sapporoikaUniversityOverview.json'),'utf8'));
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const all=(n,p,r=[])=>{if(p(n))r.push(n);for(const c of n.childNodes??[])all(c,p,r);return r;};
const text=n=>n?.nodeName==='#text'?n.value:(n?.childNodes??[]).map(text).join('');
const clean=s=>s.replace(/\s/gu,'');
const canonicalFacts=candidate=>candidate.schemes.flatMap(s=>[['schedule',s.scheduleRows],['exam',s.examRows],['venue',s.venueRows],['note',s.notes]].flatMap(([kind,rs])=>rs.map((r,i)=>({id:`${s.id}/${kind}/${i}`,label:r.label??'',value:r.value??r.text,sourceIds:r.sourceIds,status:r.status??'confirmed'}))));
const numeric=s=>Number(s.replaceAll(',','').match(/\d+/u)?.[0]);
export function verifySapporoikaArithmetic(candidate=data){
 for(const s of candidate.schemes.slice(0,4)){
  const get=l=>{const row=s.examRows.find(r=>r.label===l);assert.ok(row,`Missing scoring ${s.id}/${l}`);return row.value;};
  if(s.id.startsWith('general-')){
   const final=['国語','地歴公民','数学','理科','外国語','情報'].map(l=>numeric(get('最終判定・'+l)));
   const individual=['数学','理科2科目','英語','個人面接'].map(l=>numeric(get('個別・'+l)));
   assert.equal(final.reduce((a,b)=>a+b),numeric(get('最終判定・共通テスト合計')));
   assert.equal(individual.reduce((a,b)=>a+b),numeric(get('個別合計')));
   assert.equal(numeric(get('最終判定・共通テスト合計'))+numeric(get('個別合計')),numeric(get('総合計')));
   assert.deepEqual(final,[150,50,150,200,150,50]);assert.deepEqual(individual,[200,200,200,200]);
  }else{
   const individual=['小作文','面接','自己推薦書'].map(l=>numeric(get(l)));
   assert.deepEqual(individual,s.id==='comprehensive-domin'?[200,250,50]:[200,200,100]);
   assert.equal(individual.reduce((a,b)=>a+b)+1000,numeric(get('総合計')));
  }
  const common=get(s.id.startsWith('general-')?'第1段階の配点':'共通テスト配点');
  const points=[...common.matchAll(/(?:国語|地歴公民|数学|理科|外国語|情報)([\d,]+)点/gu)].map(m=>numeric(m[1]));
  assert.deepEqual(points,[200,100,200,200,200,100]);assert.equal(points.reduce((a,b)=>a+b),1000);
 }
}
export function verifySapporoikaReadable(html,candidate=data,basic=overview){
 validateUniversityAdmissions(candidate);verifySapporoikaArithmetic(candidate);
 const tree=parse(html),wrappers=all(tree,n=>attr(n,'data-admissions-presentation')==='sapporoika-readable-v1');
 assert.equal(wrappers.length,1);assert.equal(all(tree,n=>attr(n,'data-sapporoika-overview')!==undefined).length,1);
 const rendered=all(tree,n=>attr(n,'data-admission-origins')!==undefined),facts=[...canonicalFacts(candidate),...basic.facts.map(f=>({...f,id:'overview/'+f.id}))];
 const known=new Map(facts.map(f=>[f.id,f])),mappings=[];
 for(const n of rendered){
  const ids=JSON.parse(attr(n,'data-admission-origins'));assert.ok(ids.length);assert.equal(new Set(ids).size,ids.length);
  const union=new Set();
  for(const id of ids){const f=known.get(id);assert.ok(f,`Unknown origin ${id}`);for(const sid of f.sourceIds)union.add(sid);}
  assert.deepEqual(JSON.parse(attr(n,'data-admission-source-ids')).sort(),[...union].sort(),'Merged sources differ');
 }
 for(const f of facts){
  const nodes=rendered.filter(n=>JSON.parse(attr(n,'data-admission-origins')).includes(f.id));assert.equal(nodes.length,1,`Missing or duplicated ${f.id}`);
  const n=nodes[0],values=all(n,c=>attr(c,'data-admission-value')!==undefined);assert.equal(values.length,1,`Missing value ${f.id}`);
  assert.equal(clean(text(values[0])),clean(f.value),`Value differs ${f.id}`);assert.equal(attr(n,'data-admission-status'),f.status,`Status differs ${f.id}`);
  if(f.label){const labels=all(n,c=>c.tagName==='dt'||(c.tagName==='th'&&attr(c,'scope')==='row'));assert.equal(labels.length,1);assert.equal(text(labels[0]),f.label,`Label differs ${f.id}`);}
  mappings.push({...f,displayText:text(values[0]),displayTarget:n.tagName,action:JSON.parse(attr(n,'data-admission-origins')).length>1?'merge-identical-facts':'retain'});
 }
 const coverageMappings=candidate.coverageNotes.map((v,i)=>{const nodes=all(tree,n=>attr(n,'data-admission-coverage-note')===String(i));assert.equal(nodes.length,1);assert.equal(clean(text(nodes[0])),clean(v));return {id:`coverage/${i}`,value:v,displayText:text(nodes[0])};});
 const held=mappings.filter(f=>f.status==='needs-confirmation');assert.deepEqual(held.map(f=>f.id).sort(),['foreign/schedule/0','foreign/schedule/1','foreign/schedule/4']);
 for(const f of held)assert.doesNotMatch(f.displayText,/\d{4}年\d+月\d+日/u,'Uncertain numeric date must stay absent');
 assert.doesNotMatch(text(tree),/2027年1月19日|2027年1月26日|令和9年1月19日|令和9年1月26日|3月10日（火）|初期臨床研修修了後、北海道内の医療機関で9年/u);
 assert.equal(known.get('foreign/schedule/2').value,'出願最終日の受付は17:00必着。');assert.equal(known.get('foreign/schedule/3').value,'2027年2月25日（木）。');
 const rec=candidate.schemes.find(s=>s.id==='recommendation-special');
 assert.ok(rec.scheduleRows.find(r=>r.label==='配慮の事前相談').value.startsWith('2026年9月30日'));
 assert.ok(rec.examRows.find(r=>r.label==='卒後の地域医療義務').value.includes('本学卒業後'));
 const tables=all(tree,n=>n.tagName==='table');
 for(const t of tables){assert.equal(all(t,n=>n.tagName==='caption').length,1);assert.equal(all(t,n=>n.tagName==='th'&&attr(n,'scope')===undefined).length,0);assert.equal(all(t,n=>n.tagName==='a'&&/^https?:/u.test(attr(n,'href')??'')).length,0);}
 const routeIds=all(tree,n=>attr(n,'data-admission-scheme')!==undefined).map(n=>attr(n,'data-admission-scheme'));assert.deepEqual(routeIds,candidate.schemes.map(s=>s.id));
 const sources=[...candidate.sources,...basic.sources],sourceItems=all(tree,n=>attr(n,'data-admission-source-id')!==undefined);assert.equal(sourceItems.length,sources.length);
 for(const s of sources){const n=sourceItems.find(n=>attr(n,'data-admission-source-id')===s.id);assert.ok(n);assert.equal(attr(all(n,c=>c.tagName==='a')[0],'href'),s.url);}
 const ids=all(tree,n=>attr(n,'id')!==undefined).map(n=>attr(n,'id'));assert.equal(new Set(ids).size,ids.length);
 for(const a of all(tree,n=>n.tagName==='a'&&(attr(n,'href')??'').startsWith('#')))assert.ok(ids.includes(decodeURIComponent(attr(a,'href').slice(1))),`Broken section link ${attr(a,'href')}`);
 assert.doesNotMatch(text(tree),/candidate\.json|candidateSha256|sourceId|worktree|publish\.lock|TODO|FIXME|監査済|照合済|ご依頼|修正しました/u);
 const summary=all(tree,n=>attr(n,'class')==='admission-overview-table')[0];assert.ok(summary);assert.equal(all(summary,n=>n.tagName==='tbody')[0].childNodes.filter(n=>n.tagName==='tr').length,5);
 for(const t of ['2027年1月25日〜2月3日','2026年10月1日〜8日','2026年11月2日〜6日','開始日・締切日は確認待ち','15人（認可申請中8人を含む）','若干名'])assert.ok(text(summary).includes(t));
 assert.ok(text(tree).includes('2026年度 医学科入学者110人：男女別'));assert.ok(text(tree).includes('2026年度 医学科入学者110人：新卒・既卒別'));
 assert.equal(numeric(basic.facts.find(f=>f.id==='entrant-male').value)+numeric(basic.facts.find(f=>f.id==='entrant-female').value),110);
 assert.equal(numeric(basic.facts.find(f=>f.id==='entrant-current').value)+numeric(basic.facts.find(f=>f.id==='entrant-previous').value),110);
 return {version:1,passed:true,checkedAt:new Date().toISOString(),admissionFacts:canonicalFacts(candidate).length,coverage:coverageMappings.length,overviewFacts:basic.facts.length,totalFacts:facts.length+coverageMappings.length,displayFactNodes:rendered.length,tables:tables.length,heldDateOrigins:held.map(f=>f.id),mappings,coverageMappings,officialAccuracyEstablished:false,independentAuditPassed:false,publicationAuthorized:false};
}
export function verifySapporoikaTransforms(){
 const raw=JSON.parse(fs.readFileSync(src('src/data/generated/admissionInfoPosts.json'),'utf8')),post=raw.find(p=>p.path===data.path);assert.ok(post);
 const index=new Map([[data.path,data]]),a=applyUniversityAdmissionsFromIndex(post,index);
 const stale={...post,contentHtml:'<article data-university-info-safety="obsolete">旧本文</article>',infoItems:post.infoItems.map(x=>['年度','地域','種別'].includes(x.label)?{...x,value:'旧情報'}:x)};
 assert.deepEqual(applyUniversityAdmissionsFromIndex(stale,index),a);
 assert.deepEqual(applyUniversityAdmissionsFromIndex(a,index),a);
 assert.equal(a.displayTitle,'札幌医科大学 医学部2027年度入試情報');assert.equal(a.keyPoints.length,3);assert.equal(a.infoItems.find(i=>i.label==='年度').value,'2027年度（入試情報）');assert.equal(a.infoItems.find(i=>i.label==='地域').value,'北海道');assert.equal(a.infoItems.find(i=>i.label==='種別').value,'入試情報');
 assert.doesNotMatch(a.contentHtml,/data-university-info-safety/u);assert.ok(a.contentHtml.startsWith(renderUniversityAdmissions(data)));
 for(const other of raw.filter(p=>p.path!==data.path))assert.equal(applyUniversityAdmissionsFromIndex(other,index),other);
 return a;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const [target,output]=process.argv.slice(2),post=verifySapporoikaTransforms(),result=verifySapporoikaReadable(target?fs.readFileSync(target,'utf8'):post.contentHtml);
 const report={...result,currentRawAndStaleTransformsIdentical:true,otherUniversitiesUnchanged:true};if(output)fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({...report,mappings:undefined,coverageMappings:undefined}));
}
