import test from 'node:test';
import assert from 'node:assert/strict';
import canonical from '../src/data/universityAdmissions/kagawa.json' with {type:'json'};
import {applyUniversityAdmissionsFromIndex,validateUniversityAdmissions} from '../src/lib/universityAdmissions.ts';
import {verifyKagawaHtml} from './verify-kagawa-readable.mjs';
const input={path:canonical.path,template:'admission-info',contentHtml:'legacy',title:'old',lead:'old',infoItems:[{label:'地域',value:'旧地域'},{label:'年度',value:'2026年度'},{label:'種別',value:'大学概要'}],toc:[]};
const index=new Map([[canonical.path,canonical]]),post=applyUniversityAdmissionsFromIndex(input,index);
test('Kagawa preserves route-specific conditions, all fact origins, score totals and current statistics',()=>{validateUniversityAdmissions(canonical);const r=verifyKagawaHtml(post.contentHtml);assert.equal(r.mappedFacts,153);assert.equal(r.tables,15);});
test('Kagawa replaces legacy region/year/kind and is idempotent',()=>{assert.equal(post.infoItems.find(i=>i.label==='地域').value,'四国');assert.equal(post.infoItems.find(i=>i.label==='年度').value,'2027年度（入試情報）');assert.equal(post.infoItems.find(i=>i.label==='種別').value,'医学部入試情報');assert.deepEqual(applyUniversityAdmissionsFromIndex(post,index),post);const other={...input,path:'/information-yamagata/'};assert.equal(applyUniversityAdmissionsFromIndex(other,index),other);assert.equal(applyUniversityAdmissionsFromIndex({...input,template:'interview-prep'},index).contentHtml,'legacy');});
const mutations=[
 ['11月7日までの消印かつ簡易書留・速達','11月9日までの消印有効'],
 ['3つをすべて完了','いずれかを完了'],
 ['英語以外の外国語は利用できません','英語以外も利用できます'],
 ['総合問題・面接の両方を受験','総合問題又は面接を受験'],
 ['リスニング免除者を除く','例外なし'],
 ['2月3日17時必着','2月3日消印有効'],
 ['3月27日17時必着','3月15日17時必着'],
 ['本人及び保護者又は法定代理人','本人だけ'],
 ['半分以上は高松圏域以外','県内ならどこでもよい'],
 ['15分以上遅刻','15分を超えて遅刻'],
 ['原則として専門医認定を受けられません','専門医認定に影響しません'],
 ['2027年度以降の学士課程','すべての在学生の学士課程'],
 ['<td>52人</td>','<td>53人</td>'],
 ['<td>720</td>','<td>700</td>']
];
for(const [before,after] of mutations)test('rejects changed condition: '+before,()=>{assert.ok(post.contentHtml.includes(before));assert.throws(()=>verifyKagawaHtml(post.contentHtml.replaceAll(before,after)));});
