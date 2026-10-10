import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {verifyYamanashiReadable} from './verify-yamanashi-readable.mjs';
import {renderUniversityAdmissions,applyUniversityAdmissionsFromIndex} from '../src/lib/universityAdmissions.ts';
const data=JSON.parse(fs.readFileSync(new URL('../src/data/universityAdmissions/yamanashi.json',import.meta.url),'utf8'));
test('every Yamanashi fact survives the score split and the shared recommendation layout',()=>{
 const html=renderUniversityAdmissions(data),result=verifyYamanashiReadable(html);assert.equal(result.facts,92);
 assert.throws(()=>verifyYamanashiReadable(html.replaceAll('16時30分必着','16時30分')));
 assert.throws(()=>verifyYamanashiReadable(html.replace('約1.2倍','約1.5倍')));
});
test('source-qualified ticket recipients and fee exemptions remain visible once',()=>{
 const html=renderUniversityAdmissions(data);verifyYamanashiReadable(html);
 assert.throws(()=>verifyYamanashiReadable(html.replace('第1段階選抜の合格者には','志願者には')));
 assert.throws(()=>verifyYamanashiReadable(html.replace('（免除対象者を除く）','')));
 assert.throws(()=>verifyYamanashiReadable(html.replace('一般選抜（後期）','一般選抜（前期）')));
});
test('the Yamanashi page is escaped, stable, and changes only its own route',()=>{
 const raw=JSON.parse(fs.readFileSync(new URL('../src/data/generated/admissionInfoPosts.json',import.meta.url),'utf8'));
 const index=new Map([[data.path,data]]),before=raw.find(p=>p.path===data.path),after=applyUniversityAdmissionsFromIndex(before,index);
 assert.equal(after.infoItems.find(item=>item.label==='地域').value,'山梨県');
 assert.deepEqual(applyUniversityAdmissionsFromIndex(after,index),after);
 for(const post of raw.filter(p=>p.path!==data.path))assert.equal(applyUniversityAdmissionsFromIndex(post,index),post);
 const altered=structuredClone(data);altered.schemes[0].notes[0].text='<script>alert("x")</script>';
 const html=renderUniversityAdmissions(altered);assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>'));
});
