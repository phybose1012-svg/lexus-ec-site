import fs from 'node:fs/promises';import assert from 'node:assert/strict';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {renderUniversityAdmissions,validateUniversityAdmissions,applyUniversityAdmissionsFromIndex} from '../src/lib/universityAdmissions.ts';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),d=JSON.parse(await fs.readFile(root+'/src/data/universityAdmissions/kokusai.json','utf8'));
const html=renderUniversityAdmissions(d),origins=new Set([...html.matchAll(/data-admission-origins="([^"]+)"/g)].flatMap(m=>m[1].split(' '))),expected=[];
for(const s of d.schemes)for(const[k,key]of [['schedule','scheduleRows'],['exam','examRows'],['venue','venueRows'],['note','notes']])s[key].forEach((_,i)=>expected.push(`${s.id}/${k}/${i}`));d.coverageNotes.forEach((_,i)=>expected.push(`coverage/${i}`));d.basicInfoRows.forEach((_,i)=>expected.push(`basic/${i}`));
assert.deepEqual([...origins].sort(),expected.sort(),'All edited facts must be visible, with no unknown origin');
assert.equal(d.schemes.length,7);assert.equal((html.match(/<table\b/g)||[]).length,24);
for(const text of ['1,700万円','1,680万円','寮費全額','家賃分','大学へ確認','オルタンシアハイツ','入寮状況','上位50位以内','上位70位以内','5月6日郵送必着','125人','143人'])assert.ok(html.includes(text),text);
const source=d.sources.find(s=>s.id==='eju-syllabus-index');assert.ok(source);
for(const mutation of [s=>s.sha256='0'.repeat(64),s=>s.url=s.url+'?other=1',s=>s.url='https://example.com/syllabus']){const c=structuredClone(d);mutation(c.sources.find(s=>s.id===source.id));assert.throws(()=>validateUniversityAdmissions(c),/source host/);}
const ungrounded=structuredClone(d);ungrounded.schemes.find(s=>s.id==='foreign-1').examRows[7].sourceIds=['eju-syllabus-index'];assert.throws(()=>validateUniversityAdmissions(ungrounded),/supplementary sources/);
const wrongClaim=structuredClone(d);wrongClaim.schemes[0].examRows[0].sourceIds=['guide','eju-syllabus-index'];assert.throws(()=>validateUniversityAdmissions(wrongClaim),/supplementary sources/);
const wrongUniversity=structuredClone(d);wrongUniversity.path='/information-kurume/';wrongUniversity.university='久留米大学';assert.throws(()=>validateUniversityAdmissions(wrongUniversity),/source host/);
const base={path:d.path,template:'admission-info',contentHtml:'<h2>old</h2>',title:'old',lead:'old',categories:['関東'],infoItems:[{label:'年度',value:'2026年度'},{label:'地域',value:'関東'},{label:'種別',value:'大学概要'}],toc:[]};
const updated=applyUniversityAdmissionsFromIndex(base,new Map([[d.path,d]]));assert.equal(updated.contentHtml,html);assert.equal(updated.displayTitle,'国際医療福祉大学 医学部2027年度入試情報');assert.equal(updated.infoItems.find(r=>r.label==='地域').value,'関東（千葉）');assert.equal(updated.keyPoints.length,3);assert.ok(updated.toc.length>=10);
const untouched={...base,path:'/information-keio/'};assert.equal(applyUniversityAdmissionsFromIndex(untouched,new Map([[d.path,d]])),untouched);
console.log(JSON.stringify({passed:true,facts:expected.length,tables:24,sourceScopeNegativeCases:6,transformationCases:2}));
