import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'parse5';
import {pathToFileURL} from 'node:url';
const read=name=>JSON.parse(fs.readFileSync(new URL(`../src/data/${name}`,import.meta.url),'utf8'));
const data=read('universityAdmissions/saga.json'), copy=read('sagaReaderCopy.json');
export const attr=(n,key)=>n.attrs?.find(a=>a.name===key)?.value;
export const all=(n,fn,out=[])=>{if(fn(n))out.push(n);for(const c of n.childNodes??[])all(c,fn,out);return out;};
export const text=n=>n?.nodeName==='#text'?n.value:(n?.childNodes??[]).map(text).join('');
const clean=s=>s.replace(/\s/gu,'');
export function verifySagaHtml(html) {
 const t=parse(html),wrapper=all(t,n=>attr(n,'data-admissions-presentation')==='saga-readable-v1');
 assert.equal(wrapper.length,1);const w=wrapper[0],scheme=data.schemes[0];
 for(const [kind,rows]of [['schedule',scheme.scheduleRows],['exam',scheme.examRows],['venue',scheme.venueRows]])for(const [i,row]of rows.entries()){
  const nodes=all(w,n=>attr(n,'data-admission-origin')===`general-early/${kind}/${i}`);assert.equal(nodes.length,1,`${kind}/${i} must have one destination`);
  assert.deepEqual(JSON.parse(attr(nodes[0],'data-admission-source-ids')),row.sourceIds);
  assert.equal(attr(nodes[0],'data-admission-status'),row.status);
  if(kind==='exam'&&i===14){assert.ok(clean(text(nodes[0])).includes('合計640点300点総合計940点'));continue;}
  assert.ok(clean(text(nodes[0])).includes(clean(copy[kind][i][0])));
  for(const line of copy[kind][i][1].split('\n'))assert.ok(clean(text(nodes[0])).includes(clean(line)),`${kind}/${i}: ${line}`);
 }
 for(const [i,entry]of copy.notes.entries()){
  if(entry.mergedInto){assert.ok(clean(text(w)).includes('2027年度から数学Aに整数の性質に関する部分が加わります。'));continue;}
  const nodes=all(w,n=>attr(n,'data-admission-note')===String(i));assert.equal(nodes.length,1);assert.equal(clean(text(nodes[0])),clean(entry.text));
 }
 for(const [i,entry]of copy.coverage.entries())if(entry.text)assert.ok(clean(text(w)).includes(clean(entry.text)));
 const tables=all(t,n=>attr(n,'data-saga-table')!==undefined);assert.equal(tables.length,6);
 for(const table of tables)assert.equal(all(table,n=>n.tagName==='a').filter(n=>/^https?:/.test(attr(n,'href')??'')).length,0);
 const scores=all(t,n=>attr(n,'data-saga-table')==='scores')[0];
 for(const [label,common,individual]of [['国語','140点','課さない'],['地歴・公民','70点','課さない'],['数学','140点','80点'],['理科','140点','80点'],['英語','140点','80点'],['情報Ⅰ','10点','課さない'],['面接','課さない','60点']]){
  const row=all(scores,n=>n.tagName==='tr').find(n=>text(all(n,c=>c.tagName==='th')[0])===label);assert.deepEqual(all(row,n=>n.tagName==='td').map(text),[common,individual]);
 }
 const plain=clean(text(t));
 for(const fact of ['51人','100点／200点未満','50点／100点未満','第1解答科目','両方必要','2025年4月1日以降','0〜120','DIコード8267','英検2250以上','TEAP235〜269','GTEC900〜999','TOEFL45〜51','2026年度医学部医学科入学者・104人','男性54人51.9％','女性50人48.1％','18歳47人45.2％','19歳53人51.0％','20歳4人3.8％','鍋島5丁目1番1号'])assert.ok(plain.includes(fact),fact);
 assert.ok(!plain.includes('本庄町'));assert.ok(!plain.includes('2024年度入学者'));assert.ok(!plain.includes('確認完了'));assert.ok(!plain.includes('2025/3/12'));
 assert.equal(all(w,n=>n.tagName==='details').length,1);
 assert.equal(all(w,n=>attr(n,'data-admission-source-id')!==undefined).length,data.sources.length);
 const h2=all(t,n=>n.tagName==='h2').map(text);assert.ok(h2.indexOf('2027年度の入試情報')<h2.indexOf('大学基本情報'));
 return {passed:true,rows:31,notes:5,coverage:3,tables:6,sources:data.sources.length};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const file=process.argv[2]??'dist/information-saga/index.html';console.log(JSON.stringify({target:file,checkedAt:new Date().toISOString(),...verifySagaHtml(fs.readFileSync(file,'utf8'))},null,2));}
