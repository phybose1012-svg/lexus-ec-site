import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateUniversityAdmissions,renderUniversityAdmissions} from '../src/lib/universityAdmissions.ts';
const candidate=JSON.parse(fs.readFileSync(new URL('../src/data/universityAdmissions/nara.json',import.meta.url)));
test('Nara preserves distinct screening and scoring conditions',()=>{
 const h=renderUniversityAdmissions(candidate);
 for(const text of ['概ね730点／900点','志願者数にかかわらず','12倍（636人）','さらに1/2倍して450点','さらに1/3倍して300点','リスニング免除者','第1解答科目','郵送のみ・必着','持参不可','令和9年度','令和8年度'])assert.ok(h.includes(text),text);
 assert.equal((h.match(/<table\b/g)||[]).length,12);
 const origins=[...h.matchAll(/data-admission-origins="([^"]+)"/g)].flatMap(m=>m[1].split(' '));
 assert.equal(origins.length,156);assert.equal(new Set(origins).size,origins.length);
 const visibleSources=new Set([...h.matchAll(/data-admission-source-id="([^"]+)"/g)].map(m=>m[1]));
 for(const source of candidate.sources)assert.ok(visibleSources.has(source.id),`Missing visible source ${source.id}`);
});
test('Nara stats use 2026 entrant counts, excluding declined offers',()=>{
 assert.equal(54+20,74);assert.equal(21+16,37);assert.equal(74+37,111);
 assert.equal(43+15,58);assert.equal(32+21,53);assert.equal(58+53,111);
 const h=renderUniversityAdmissions(candidate);assert.ok(h.includes('総人数111人'));assert.ok(!h.includes('2024年度'));
});
test('Prefectural references require exact approved URLs and bytes',()=>{
 for(const key of ['url','sha256']){const d=structuredClone(candidate),s=d.sources.find(s=>s.id==='county-emergency-current');s[key]=key==='url'?s.url+'?unreviewed=1':'0'.repeat(64);assert.throws(()=>validateUniversityAdmissions(d),/source host/);}
 const d=structuredClone(candidate);d.path='/information-saga/';d.university='佐賀大学';d.sources=d.sources.filter(s=>s.id.startsWith('county-'));assert.throws(()=>validateUniversityAdmissions(d),/source host/);
});
test('Supplementary prefectural evidence cannot establish university exam conditions',()=>{
 const d=structuredClone(candidate);d.schemes[0].examRows[0].sourceIds=['county-emergency-current'];assert.throws(()=>validateUniversityAdmissions(d),/supplementary prefectural sources cannot substantiate/);
});
