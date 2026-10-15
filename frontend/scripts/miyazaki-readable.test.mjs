import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'parse5';
import {validateUniversityAdmissions,renderUniversityAdmissions,applyUniversityAdmissionsFromIndex} from '../src/lib/universityAdmissions.ts';
const candidate=JSON.parse(fs.readFileSync(new URL('../src/data/universityAdmissions/miyazaki.json',import.meta.url)));
const all=n=>[n,...(n.childNodes||[]).flatMap(all)],attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
test('All Miyazaki facts survive grouping; external citations are outside tables',()=>{
 const html=renderUniversityAdmissions(candidate),nodes=all(parse(html));
 const origins=new Set(nodes.flatMap(n=>(attr(n,'data-admission-origins')||'').split(/\s+/)));
 for(const s of candidate.schemes)for(const [kind,key] of [['schedule','scheduleRows'],['exam','examRows'],['venue','venueRows'],['note','notes']])s[key].forEach((_,i)=>assert(origins.has(`${s.id}/${kind}/${i}`)));
 candidate.coverageNotes.forEach((_,i)=>assert(origins.has(`coverage/${i}`)));
 candidate.basicInfoRows.forEach((_,i)=>assert(origins.has(`basic/${i}`)));
 for(const t of nodes.filter(n=>n.tagName==='table'))assert.equal(all(t).filter(n=>/^https?:/.test(attr(n,'href')||'')).length,0);
 const ids=nodes.map(n=>attr(n,'id')).filter(Boolean);assert.equal(new Set(ids).size,ids.length);
});
test('Miyazaki shared deadlines retain separate province/university delivery rules and scoring exceptions',()=>{
 const html=renderUniversityAdmissions(candidate);
 for(const fact of ['12:00～13:00','簡易書留','一般書留','17:00必着','第1解答科目','リーディングを200点に換算','約6倍','約14倍','1,600点','1,150点','20～30分','4年以上','公衆衛生医','高校長','学長'])assert(html.includes(fact),fact);
 assert.match(html,/数学Bは「数列」「統計的な推測」/);
 assert.match(html,/Web登録だけでは完了しません/);
});
test('Miyazaki province sources are scoped to that university',()=>{
 assert.doesNotThrow(()=>validateUniversityAdmissions(candidate));
 const wrong=structuredClone(candidate);wrong.sources.find(s=>s.id==='career-2026').url='https://untrusted.example/program.pdf';assert.throws(()=>validateUniversityAdmissions(wrong),/not official/);
 const unrelated=structuredClone(candidate);unrelated.path='/information-mie/';unrelated.university='三重大学';assert.throws(()=>validateUniversityAdmissions(unrelated),/not official/);
});
test('Miyazaki replaces stale production content and metadata with current admissions and medical entrant counts',()=>{
 const raw=JSON.parse(fs.readFileSync(new URL('../src/data/generated/admissionInfoPosts.json',import.meta.url))).find(p=>p.path===candidate.path);
 const post={...raw,title:'stale',lead:'stale',categories:['stale'],contentHtml:'old',infoItems:[{label:'年度',value:'2024'},{label:'地域',value:'old'},{label:'種別',value:'old'}]};
 const result=applyUniversityAdmissionsFromIndex(post,new Map([[candidate.path,validateUniversityAdmissions(candidate)]]));
 assert.equal(result.displayTitle,'宮崎大学 医学部2027年度入試情報');
 assert.equal(result.infoItems.find(r=>r.label==='地域').value,'九州・沖縄');
 assert.equal(result.keyPoints.length,3);assert(result.toc.some(r=>r.id==='miyazaki-obligations'));
 for(const fact of ['入学者103人','60人','43人','58.3%','41.7%','47人','56人','45.6%','54.4%'])assert(result.contentHtml.includes(fact),fact);
 assert(!result.contentHtml.includes('old'));
});
