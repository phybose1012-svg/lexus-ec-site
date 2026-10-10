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
 assert.equal(after.infoItems.find(item=>item.label==='種別').value,'入試情報');
 assert.deepEqual(after.categories,['大学別入試情報','大学別基本情報','国公立医学部','中部']);
 assert.deepEqual(applyUniversityAdmissionsFromIndex(after,index),after);
 for(const post of raw.filter(p=>p.path!==data.path))assert.equal(applyUniversityAdmissionsFromIndex(post,index),post);
 const altered=structuredClone(data);altered.schemes[0].notes[0].text='<script>alert("x")</script>';
 const html=renderUniversityAdmissions(altered);assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>'));
});
test('production metadata resolves to the same Yamanashi display as staging',()=>{
 const raw=JSON.parse(fs.readFileSync(new URL('../src/data/generated/admissionInfoPosts.json',import.meta.url),'utf8'));
 const index=new Map([[data.path,data]]),original=raw.find(post=>post.path===data.path);
 const productionInput={...original,categories:['大学別入試情報','大学別基本情報','国公立医学部','関東（東京以外）'],infoItems:original.infoItems.map(item=>item.label==='種別'?{...item,value:'大学概要・公式入試情報'}:item)};
 const staging=applyUniversityAdmissionsFromIndex(original,index),production=applyUniversityAdmissionsFromIndex(productionInput,index);
 assert.deepEqual(production.categories,staging.categories);
 assert.deepEqual(production.infoItems,staging.infoItems);
 assert.equal(production.contentHtml,staging.contentHtml);
 assert.deepEqual(production.toc,staging.toc);
 assert.equal(production.displayTitle,staging.displayTitle);
 assert.deepEqual(applyUniversityAdmissionsFromIndex(production,index),production);
});
