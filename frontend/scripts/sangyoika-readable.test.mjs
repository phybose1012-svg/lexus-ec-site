import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {renderUniversityAdmissions,createUniversityAdmissionsIndex,applyUniversityAdmissionsFromIndex} from '../src/lib/universityAdmissions.ts';
const candidate=JSON.parse(fs.readFileSync(new URL('../src/data/universityAdmissions/sangyoika.json',import.meta.url)));
test('Sangyoika preserves every fact once with source panels outside tables',()=>{
 const h=renderUniversityAdmissions(candidate),origins=[...h.matchAll(/data-admission-origins="([^"]+)"/g)].flatMap(m=>m[1].split(' '));
 const n=candidate.schemes.reduce((n,s)=>n+s.scheduleRows.length+s.examRows.length+s.venueRows.length+s.notes.length,0)+candidate.coverageNotes.length+candidate.basicInfoRows.length;
 assert.equal(origins.length,n);assert.equal(new Set(origins).size,n);
 for(const t of h.matchAll(/<table\b[\s\S]*?<\/table>/g))assert.doesNotMatch(t[0],/https?:|data-admission-source-id=/);
 candidate.sources.forEach(s=>assert.ok(h.includes(`data-admission-source-id="${s.id}"`),s.id));
});
test('Sangyoika keeps B and C conjunctive thresholds and route-specific English',()=>{
 const h=renderUniversityAdmissions(candidate),comp=h.slice(h.indexOf('id="admission-comprehensive"'),h.indexOf('id="admission-recommendation"'));
 for(const t of ['70％以上かつ上位20人以内','80％以上（720点以上）かつ上位20人以内','R48・L12','R160・L40','リスニング免除時はリーディングを200点','480点以上'])assert.ok(h.includes(t),t);
 assert.match(comp,/換算比率[\s\S]*示されていません/);assert.doesNotMatch(comp,/R160|R100|R48|4対1/);
});
test('Sangyoika retains document corrections, obligations and proxy exception',()=>{
 const h=renderUniversityAdmissions(candidate);
 for(const t of ['黒または青のインク','学生身上書','連帯保証書','連絡先','1.5倍','産業医の職務を2年以上','連帯保証人は2人','貸与利息を一括返還','本人が来学','本人が速やかにFAXまたはメール','翌日から起算して2日以内','1月15日（金）17:00必着','消印有効'])assert.ok(h.includes(t),t);
 assert.doesNotMatch(h,/学生情報連絡票/);
});
test('Sangyoika statistics use medical entrants, and route ids cannot be reassigned',()=>{
 const h=renderUniversityAdmissions(candidate);
 for(const t of ['入学者105人','53人','52人','26人','79人','50.5％','49.5％','24.8％','75.2％'])assert.ok(h.includes(t),t);
 const d=structuredClone(candidate);d.schemes.reverse();assert.throws(()=>renderUniversityAdmissions(d),/five reviewed medicine routes/);
});
test('Sangyoika replaces old metadata after a safety article and leaves other routes alone',()=>{
 const index=createUniversityAdmissionsIndex({'../data/universityAdmissions/sangyoika.json':candidate});
 const p={path:candidate.path,template:'admission-info',contentHtml:'<p>旧年度</p>',infoItems:[{label:'年度',value:'2026年度'},{label:'種別',value:'大学基本情報'},{label:'地域',value:'旧地域'}],toc:[]};
 const a=applyUniversityAdmissionsFromIndex(p,index);
 assert.deepEqual(a.infoItems.map(x=>x.value),['2027年度（入試情報）','入試情報','九州']);
 assert.ok(a.title.includes('2027年度'));assert.ok(a.toc.length>10);assert.equal(a.contentHtml,renderUniversityAdmissions(candidate));
 assert.deepEqual(applyUniversityAdmissionsFromIndex(a,index),a);
 const other={...p,path:'/information-kyoto/'};assert.equal(applyUniversityAdmissionsFromIndex(other,index),other);
});
