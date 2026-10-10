import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'parse5';
import {pathToFileURL} from 'node:url';
const read=n=>JSON.parse(fs.readFileSync(new URL(`../src/data/${n}`,import.meta.url),'utf8'));
const data=read('universityAdmissions/yamaguchi.json'),copy=read('yamaguchiReaderCopy.json'),overview=read('yamaguchiUniversityOverview.json');
export const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
export const all=(n,fn,out=[])=>{if(fn(n))out.push(n);for(const c of n.childNodes??[])all(c,fn,out);return out;};
export const text=n=>n?.nodeName==='#text'?n.value:(n?.childNodes??[]).map(text).join('');
const clean=s=>s.replace(/\s/gu,'');
export function verifyYamaguchiHtml(html){
 const tree=parse(html),wrappers=all(tree,n=>attr(n,'data-admissions-presentation')==='yamaguchi-readable-v1');assert.equal(wrappers.length,1);const w=wrappers[0];
 const expected=[];for(const s of data.schemes){for(const [kind,rows]of [['schedule',s.scheduleRows],['exam',s.examRows],['venue',s.venueRows]])for(const [i,row]of rows.entries())expected.push({origin:`${s.id}/${kind}/${i}`,sourceIds:row.sourceIds,status:row.status});for(const [i,note]of s.notes.entries())expected.push({origin:`${s.id}/note/${i}`,sourceIds:note.sourceIds});}data.coverageNotes.forEach((_,i)=>expected.push({origin:`coverage/${i}`}));
 const observed=all(w,n=>attr(n,'data-admission-provenance')).flatMap(n=>JSON.parse(attr(n,'data-admission-provenance')));assert.equal(observed.length,93);assert.equal(new Set(observed.map(r=>r.origin)).size,93);
 for(const entry of expected)assert.deepEqual(observed.find(r=>r.origin===entry.origin),entry,entry.origin);
 for(const item of copy.items){const nodes=all(w,n=>attr(n,'data-yamaguchi-fact')===item.id);assert.equal(nodes.length,1,item.id);if(item.id==='ct-4'){assert.equal(nodes[0].tagName,'tr');assert.equal(text(all(nodes[0],n=>n.tagName==='th')[0]),'国語');assert.deepEqual(all(nodes[0],n=>n.tagName==='td').map(text),['200点','課さない','課さない']);continue;}for(const line of item.body.split('\n').filter(Boolean))assert.ok(clean(text(nodes[0])).includes(clean(line.replace(/^・/u,''))),`${item.id}: ${line}`);}
 const tables=all(tree,n=>attr(n,'data-yamaguchi-table'));assert.equal(tables.length,7);for(const t of tables)assert.equal(all(t,n=>n.tagName==='a'&&/^https?:/u.test(attr(n,'href')??'')).length,0);
 const score=all(w,n=>attr(n,'data-yamaguchi-table')==='scores')[0];let common=0,early=0,late=0;
 const rows=all(score,n=>n.tagName==='tr').slice(1,9);for(const row of rows){const points=all(row,n=>n.tagName==='td').map(n=>/^\d+点$/u.test(text(n))?Number(text(n).slice(0,-1)):0);common+=points[0];early+=points[1];late+=points[2];}assert.deepEqual([common,early,late],[950,600,500]);assert.ok(clean(text(score)).includes('1,550点1,450点'));
 for(const s of ['53人','55人（予定）','7人','3人以内','合わせて10人','第1解答科目','2027年1月19日（火）〜21日（木）','年齢条件と学習歴の条件の両方','リスニング未受験は0点','160点満点','免除者は、リーディングを200点満点','募集人数の7倍を超えた','募集人数の15倍を超えた','前期日程で面接を受けた場合も','住民票等で確認','3年以上継続','直ちに','臨床研修を2年間','引き続き4年以上','県内の医療機関又はその関連施設','2026年12月8日（火）','2026年11月下旬','親権者がいない場合は未成年後見人'])assert.ok(clean(text(w)).includes(clean(s)),s);
 assert.equal(all(w,n=>n.tagName==='details').length,1);assert.equal(all(w,n=>attr(n,'data-admission-source-id')).length,3);assert.equal(all(w,n=>n.tagName==='dt'&&text(n)==='募集人数').length,0);
 const tocTargets=all(tree,n=>/^h[23]$/u.test(n.tagName??'')&&attr(n,'id')!==undefined).map(n=>attr(n,'id'));assert.equal(new Set(tocTargets).size,tocTargets.length);
 const basics=all(tree,n=>attr(n,'data-yamaguchi-university-overview')!==undefined)[0];assert.ok(basics);const stat=all(basics,n=>attr(n,'data-yamaguchi-table'));assert.equal(stat.length,2);
 for(const s of ['2026年度医学部医学科入学者・109人','男性57人52.3％','女性52人47.7％','18歳57人52.3％','19歳40人36.7％','20歳7人6.4％','21歳1人0.9％','22歳以上4人3.7％','宇部新川駅','徒歩10分','山口県宇部市南小串1丁目1番1号'])assert.ok(clean(text(basics)).includes(s),s);
 assert.equal(overview.entrants.ages.reduce((s,r)=>s+r[1],0),109);for(const s of ['転用しない','推測していない','確認完了','本表の掲載対象','2025/3/12'])assert.ok(!text(w).includes(s));
 return{passed:true,canonicalOrigins:93,readerItems:43,tables:7,commonScore:common,earlyScore:early,lateScore:late,entrants:109};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(verifyYamaguchiHtml(fs.readFileSync(process.argv[2]??'dist/information-yamaguchi/index.html','utf8')),null,2));
