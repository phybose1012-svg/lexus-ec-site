import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { parse } from 'parse5';
const load=name=>JSON.parse(fs.readFileSync(new URL('../src/data/'+name,import.meta.url),'utf8'));
const admissions=load('universityAdmissions/tokushima.json'), copy=load('tokushimaReaderCopy.json'), overview=load('tokushimaUniversityOverview.json');
export const all=(n,p)=>[...(p(n)?[n]:[]),...(n.childNodes??[]).flatMap(c=>all(c,p))];
export const attr=(n,key)=>n.attrs?.find(a=>a.name===key)?.value;
export const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const clean=value=>value.replace(/\s/gu,'');
export function verifyTokushimaHtml(html){
 const tree=parse(html),wrapper=all(tree,n=>attr(n,'data-admissions-presentation')==='tokushima-readable-v1');
 assert.equal(wrapper.length,1);
 const basic=all(tree,n=>attr(n,'data-tokushima-university-overview')!==undefined);
 assert.equal(basic.length,1);
 assert.ok(html.indexOf('id="最新の入試情報"')<html.indexOf('id="大学基本情報"'),'Admission information must precede the overview');
 const h1=all(tree,n=>n.tagName==='h1');if(h1.length)assert.equal(clean(text(h1[0])),clean('徳島大学 医学部2027年度入試情報'));
 const keypoints=all(tree,n=>(attr(n,'class')??'').split(' ').includes('article-keypoints'));
 if(keypoints.length){const list=all(keypoints[0],n=>n.tagName==='li');assert.equal(list.length,3);for(const [i,value] of copy.keyPoints.entries())assert.equal(clean(text(list[i])),clean(value));}
 const rendered=all(wrapper[0],n=>attr(n,'data-tokushima-origins')!==undefined);
 const groups=['dates','timetable','facts','notes','venue','publication','quotaNotes'];
 for(const group of groups)for(const expected of copy[group]){
  const matches=rendered.filter(n=>attr(n,'data-tokushima-origins')===JSON.stringify(expected.origins)&&clean(text(n)).includes(clean(expected.text)));
  assert.equal(matches.length,1,`${group}: ${expected.origins}`);
 }
 assert.equal(rendered.filter(n=>clean(text(n)).includes(clean(copy.selection.text))).length,1);
 const quota=all(wrapper[0],n=>attr(n,'data-tokushima-quota-notes')!==undefined);
 assert.equal(quota.length,1);assert.equal(quota[0].tagName,'p');
 assert.equal(quota[0].parentNode,wrapper[0],'Quota conditions must remain outside tables and disclosures');
 const overviewTable=all(wrapper[0],n=>attr(n,'data-tokushima-table')==='overview')[0];
 assert.ok(wrapper[0].childNodes.indexOf(quota[0])>wrapper[0].childNodes.indexOf(overviewTable));
 const quotaText=clean(text(quota[0]));
 for(const value of ['私費外国人留学生選抜の若干名','原則として一般選抜前期の募集人数に含まれます','総合型・学校推薦型選抜で合格者が募集人数に満たない場合','一般選抜で補充します'])assert.ok(quotaText.includes(clean(value)),value);
 const score=all(wrapper[0],n=>attr(n,'data-tokushima-table')==='scores')[0];
 const scoreRows=all(score,n=>n.tagName==='tr');
 const point=v=>v===null?'課さない':typeof v==='number'?v.toLocaleString('ja-JP')+'点':v;
 for(const r of copy.scores){
  const row=scoreRows.find(n=>text(all(n,c=>c.tagName==='th')[0]??{})===r.label);
  assert.ok(row);const cells=all(row,n=>n.tagName==='td');
  assert.equal(text(cells[0]),point(r.common));assert.equal(text(cells[1]),point(r.individual)+(r.label==='外国語'?'英語':''));
 }
 assert.ok(text(score).includes('合計950点400点'));assert.ok(text(score).includes('総合計1,350点'));
 // The independent coverage ledger includes every original row, note and scope note.
 const scheme=admissions.schemes[0],mapping=[];
 for(const [kind,rows] of [['schedule',scheme.scheduleRows],['exam',scheme.examRows],['venue',scheme.venueRows],['note',scheme.notes],['coverage',admissions.coverageNotes]]){
  for(const [index,row] of rows.entries()){
   const origin=kind+'/'+index,matched=rendered.filter(n=>JSON.parse(attr(n,'data-tokushima-origins')).includes(origin));
   assert.ok(matched.length,`Lost fact ${origin}`);
   for(const node of matched){
    const ids=JSON.parse(attr(node,'data-admission-source-ids'));
    for(const id of row.sourceIds??[])assert.ok(ids.includes(id));
    if(row.status)assert.ok(JSON.parse(attr(node,'data-admission-statuses')).includes(row.status));
   }
   mapping.push({origin,original:typeof row==='string'?row:row.value??row.text,sourceIds:row.sourceIds??[],status:row.status,display:matched.map(text)});
  }
 }
 const admissionText=clean(text(wrapper[0]));
 for(const value of ['2月3日（水）15時','2月3日（水）17時必着','2月1日（月）以前','場合に限り','950点中630点未満','630点以上でも','5倍を超えた','すべてが必要','成績にかかわらず不合格','リスニング免除者','R160点・L40点','第2解答科目で受験した場合は0点','全教科・科目','過年度','未公表','11月下旬','（予定）'])assert.ok(admissionText.includes(clean(value)),value);
 const basicText=clean(text(basic[0]));
 for(const value of [...overview.access,overview.entrants.excluded,overview.address.street,overview.address.phone,'2026年度／医学科入学者／111人','男性51人45.9%','女性60人54.1%','現役68人61.3%','既卒者43人38.7%','その他0人0.0%'])assert.ok(basicText.includes(clean(value)),value);
 for(const section of [...wrapper,...basic]){
  for(const table of all(section,n=>n.tagName==='table')){
   assert.equal(all(table,n=>n.tagName==='a'&&/^https?:/u.test(attr(n,'href')??'')).length,0,'Sources in table');
   assert.doesNotMatch(text(table),/資料\d|出典|PDF|選抜要項/u);
  }
  const footer=all(section,n=>n.tagName==='details');assert.equal(footer.length,1);
  assert.equal(text(all(footer[0],n=>n.tagName==='summary')[0]),'情報ソースはこちら');
  const body=(section.childNodes??[]).filter(n=>n!==footer[0]).map(text).join('');
  assert.doesNotMatch(body,/今回の表|本表|対象外|転用しない|流用しない|原典|調査完了|確認した内容|2024年度|参考情報|資料\d/u);
  for(const anchor of all(section,n=>n.tagName==='a'&&/^https?:/u.test(attr(n,'href')??''))){let p=anchor;while(p&&p!==footer[0])p=p.parentNode;assert.equal(p,footer[0]);}
 }
 for(const source of [...admissions.sources,...overview.sources]){
  const entries=all(tree,n=>n.tagName==='li'&&attr(n,'data-admission-source-id')===source.id);
  assert.equal(entries.length,1,source.id);assert.equal(attr(all(entries[0],n=>n.tagName==='a')[0],'href'),source.url);
 }
 const ids=all(tree,n=>attr(n,'id')).map(n=>attr(n,'id'));assert.equal(new Set(ids).size,ids.length,'Duplicate anchors');
 const links=all(tree,n=>n.tagName==='a'&&(attr(n,'href')??'').startsWith('#'));
 for(const link of links){const target=attr(link,'href').slice(1);assert.ok(ids.includes(target),`Broken anchor ${target}`);}
 return {mappedItems:mapping.length,mapping,tables:all(tree,n=>attr(n,'data-tokushima-table')).map(n=>attr(n,'data-tokushima-table')),sources:7};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const [target,output]=process.argv.slice(2);let html;
 if(/^https?:/u.test(target)){const r=await fetch(target,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200);html=await r.text();}else html=fs.readFileSync(target,'utf8');
 const result={passed:true,checkedAt:new Date().toISOString(),target,htmlSha256:crypto.createHash('sha256').update(html).digest('hex'),...verifyTokushimaHtml(html)};
 if(output)fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({...result,mapping:undefined},null,2));
}
