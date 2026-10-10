import fs from 'node:fs';import assert from 'node:assert/strict';import {parse} from 'parse5';import {pathToFileURL} from 'node:url';
import {applyUniversityAdmissionsFromIndex} from '../src/lib/universityAdmissions.ts';
const data=JSON.parse(fs.readFileSync(new URL('../src/data/universityAdmissions/akita.json',import.meta.url),'utf8'));
const overview=JSON.parse(fs.readFileSync(new URL('../src/data/akitaUniversityOverview.json',import.meta.url),'utf8'));
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const all=(n,p,r=[])=>{if(p(n))r.push(n);for(const c of n.childNodes??[])all(c,p,r);return r;};
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const clean=s=>s.replace(/\s/gu,'');
const v=n=>text(all(n,c=>attr(c,'data-admission-value')!==undefined)[0]??n);
export function verifyAkitaReadable(html,candidate=data){
 const tree=parse(html),wrappers=all(tree,n=>attr(n,'data-admissions-presentation')==='akita-readable-v1');assert.equal(wrappers.length,1);
 const wrapper=wrappers[0],rendered=all(wrapper,n=>attr(n,'data-admission-origins')!==undefined),mappings=[];
 const knownIds=new Set(candidate.schemes.flatMap(s=>[['schedule',s.scheduleRows],['exam',s.examRows],['venue',s.venueRows],['note',s.notes??[]]].flatMap(([kind,rows])=>rows.map((_,i)=>`${s.id}/${kind}/${i}`))));
 for(const node of rendered)for(const id of JSON.parse(attr(node,'data-admission-origins')))assert.ok(knownIds.has(id),`Unknown origin ${id}`);
 for(const scheme of candidate.schemes)for(const [kind,key]of [['schedule','scheduleRows'],['exam','examRows'],['venue','venueRows'],['note','notes']])for(const [index,row]of (scheme[key]??[]).entries()){
  const id=`${scheme.id}/${kind}/${index}`,rawExpected=row.value??row.text;
  const expected=kind==='exam'&&row.label==='総点・合否判定'?rawExpected.replace('共通テスト500点＋小論文100点＋面接150点＝750点。','750点。'):rawExpected;
  const nodes=rendered.filter(n=>JSON.parse(attr(n,'data-admission-origins')).includes(id));assert.ok(nodes.length>=1,`Missing ${id}`);
  if(id==='international-private/exam/3'){
   assert.equal(nodes.length,1);assert.ok(attr(nodes[0],'data-admission-eju-thresholds')!==undefined);
   assert.equal(expected,'日本語の読解・聴解・聴読解は400点満点の90％以上（360点以上）。数学＋理科2科目の合計は400点満点の80％以上（320点以上）。両方の基準を満たす必要があります。日本語の記述得点は、この400点満点には含みません。');
   const rows=all(nodes[0],n=>n.tagName==='tbody')[0].childNodes.filter(n=>n.tagName==='tr').map(n=>n.childNodes.filter(n=>['th','td'].includes(n.tagName)).map(text));
   assert.deepEqual(rows,[['日本語（読解・聴解・聴読解）','400点','360点以上（90％以上）'],['数学＋理科2科目の合計','400点','320点以上（80％以上）']]);assert.equal(text(all(nodes[0],n=>n.tagName==='p')[0]),'両方の基準を満たす必要があります。日本語の記述得点は、この400点満点には含みません。');
  }else if(nodes.some(n=>attr(n,'data-admission-quota-prefix')!==undefined)){
   const p=nodes.find(n=>attr(n,'data-admission-quota-prefix')!==undefined),r=nodes.find(n=>attr(n,'data-admission-merged-quota')!==undefined||attr(n,'data-admission-quota-remainder')!==undefined);
   assert.equal(nodes.length,2);assert.ok(r);assert.equal(clean(v(p)),clean(expected.split('。')[0]));
   if(attr(r,'data-admission-merged-quota')!==undefined){assert.equal(v(r),'私費外国人留学生入試の若干名は、前期45名に含まれます。');assert.deepEqual(JSON.parse(attr(r,'data-admission-origins')),['general-early/exam/0','international-private/exam/0']);assert.equal(expected,id==='general-early/exam/0'?'45名。私費外国人留学生入試の若干名を含む。':'若干名。医学科の前期日程45名に含む。');}
   else assert.equal(clean(v(p)+'。'+v(r)),clean(expected));
  }else if(nodes.some(n=>attr(n,'data-admission-score-prefix')!==undefined)){
   const p=nodes.find(n=>attr(n,'data-admission-score-prefix')!==undefined),r=nodes.find(n=>attr(n,'data-admission-score-remainder')!==undefined);
   assert.equal(nodes.length,r?2:1,`Repeated score ${id}`);assert.equal(clean(v(p)+'。'+(r?v(r):'')),clean(expected),`Score or condition differs ${id}`);
  }else{assert.equal(nodes.length,1,`Repeated ${id}`);assert.equal(clean(v(nodes[0])),clean(expected),`Value differs ${id}`);}
  for(const node of nodes){const ids=JSON.parse(attr(node,'data-admission-source-ids'));for(const sourceId of row.sourceIds)assert.ok(ids.includes(sourceId),`Lost source ${id}/${sourceId}`);if(row.status)assert.equal(attr(node,'data-admission-status'),row.status);}
  mappings.push({id,value:rawExpected,displayTarget:nodes.map(n=>n.tagName),action:nodes.some(n=>attr(n,'data-admission-merged-quota')!==undefined)?'merge-shared-quota':nodes.length===2?'split-numeric-value-and-condition':JSON.parse(attr(nodes[0],'data-admission-origins')).length>1?'merge-identical-facts':'retain'});
 }
 assert.equal(mappings.length,189);
 for(const table of all(tree,n=>n.tagName==='table')){assert.equal(all(table,n=>n.tagName==='a'&&/^https?:/u.test(attr(n,'href')??'')).length,0);assert.doesNotMatch(text(table),/資料\d|PDF\s*pp|原典/u);}
 const details=all(wrapper,n=>n.tagName==='details'),visible=text(wrapper).replace(text(details[0]),'');
 assert.doesNotMatch(visible,/転用して|推測して|確定値として扱|補完して|原典の記載|記載なし|照合済|本表の掲載対象/u);
 for(const term of ['13:00','17:00必着','12月14日（月）以前の発信局消印','12月16日（水）17:00到着','速達簡易書留','第1解答科目','各75点','リーディング100点満点の素点を200点満点','5倍を超えた','10倍を超えた','素点計','面接評価が「不可」','2026年3月以降','青森・岩手・宮城・山形・福島','4.3以上','自筆記名','いずれか','すべてが必要','両方の基準','数学コース2','90％以上','80％以上','記述得点','1年6か月','猶予期間','医学部長','知事が同意','同意を得ず','6年間','9年間','4年間（臨床研修期間を除く）','少なくとも5年間','入学手続最終日','学長が許可','国立大学入学確認票','11月下旬公表予定','未公表','2028年度','2026年度以前'])assert.ok(visible.includes(term),`Lost critical condition: ${term}`);
 assert.equal([...visible.matchAll(/リーディング100点満点の素点を200点満点/gu)].length,1);
 assert.equal(all(wrapper,n=>attr(n,'data-admission-merged-quota')!==undefined).length,1);
 for(const [i,e]of candidate.coverageNotes.entries()){const nodes=all(wrapper,n=>attr(n,'data-admission-coverage-note')===String(i));assert.equal(nodes.length,1);if(i!==0)assert.equal(clean(text(nodes[0])),clean(e));else assert.equal(all(nodes[0],n=>n.tagName==='tbody')[0].childNodes.filter(n=>n.tagName==='tr').length,7);}
 assert.deepEqual(all(wrapper,n=>attr(n,'data-admission-scheme')!==undefined).map(n=>attr(n,'data-admission-scheme')),candidate.schemes.map(s=>s.id));
 const sourceItems=all(wrapper,n=>attr(n,'data-admission-source-id')!==undefined);assert.equal(sourceItems.length,candidate.sources.length);
 for(const s of candidate.sources){const item=sourceItems.find(n=>attr(n,'data-admission-source-id')===s.id);assert.ok(item);assert.equal(attr(all(item,n=>n.tagName==='a')[0],'href'),s.url);}
 const ids=all(tree,n=>attr(n,'id')!==undefined).map(n=>attr(n,'id'));assert.equal(new Set(ids).size,ids.length);
 const anchors=all(wrapper,n=>n.tagName==='a'&&(attr(n,'href')??'').startsWith('#'));for(const a of anchors)assert.ok(ids.includes(decodeURIComponent(attr(a,'href').slice(1))));
 if(html.includes('data-akita-overview')){
  const entrants=overview.entrants;assert.equal(entrants.male+entrants.female,124);assert.equal(entrants.current+entrants.previous+entrants.other,124);
  for(const term of ['2026年度 医学科入学者（124人）','77人','47人','88人','36人','0人','62.1%','37.9%','71.0%','29.0%','0.0%','010-8543','010-8502','本道一丁目1番1号','手形学園町1番1号','018-884-6030','018-889-2256','約10～20分','西口11番','西口12番','東口2番','大学病院前','国際バカロレア入試・外国人留学生を含みません'])assert.ok(text(tree).includes(term),`Overview differs: ${term}`);
  const basic=all(tree,n=>attr(n,'data-akita-overview')!==undefined)[0];assert.deepEqual(all(basic,n=>n.tagName==='a').map(n=>attr(n,'href')),overview.sources.map(s=>s.url));
 }
 return {passed:true,checkedAt:new Date().toISOString(),facts:mappings.length,tables:all(tree,n=>n.tagName==='table').length,mappings,coverageMappings:candidate.coverageNotes.map((value,index)=>({index,value,displayTarget:index===0?'admission-overview table':`coverage${index}`}))};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const [target,output]=process.argv.slice(2),raw=JSON.parse(fs.readFileSync(new URL('../src/data/generated/admissionInfoPosts.json',import.meta.url),'utf8'));const post=applyUniversityAdmissionsFromIndex(raw.find(p=>p.path===data.path),new Map([[data.path,data]]));const result=verifyAkitaReadable(target?fs.readFileSync(target,'utf8'):post.contentHtml);assert.equal(post.displayTitle,'秋田大学 医学部2027年度入試情報');assert.equal(post.keyPoints.length,3);if(output)fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,mappings:undefined}));}
