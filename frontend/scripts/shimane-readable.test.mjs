import fs from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {applyUniversityAdmissionsFromIndex} from '../src/lib/universityAdmissions.ts';
import {classifyArticlePost} from '../src/data/articleTaxonomy.js';
import {verifyShimaneHtml} from './verify-shimane-readable.mjs';
const read=n=>JSON.parse(fs.readFileSync(new URL('../src/data/'+n,import.meta.url),'utf8'));
const data=read('universityAdmissions/shimane.json'),posts=read('generated/admissionInfoPosts.json'),raw=posts.find(p=>p.path===data.path),index=new Map([[data.path,data]]);
test('Shimane retains every restored fact, added pre-application conditions and medical-only statistics',()=>{
 const output=applyUniversityAdmissionsFromIndex(raw,index),verified=verifyShimaneHtml(output.contentHtml);
 assert.equal(verified.mappedItems,71);assert.equal(verified.originalFacts,58);assert.equal(verified.sources,8);
 assert.deepEqual(verified.tables,['overview','dates','scores','男女比','現浪比']);
 for(const [before,after] of [['6つの要件をすべて','6つの要件のいずれか'],['研修期間を含めて9年間','研修期間を含めて8年間'],['そのうち4年以上','そのうち3年以上'],['2027年1月20日（水）','2027年2月20日（水）']])assert.throws(()=>verifyShimaneHtml(output.contentHtml.replaceAll(before,after)));
 const changed=structuredClone(data);changed.schemes[0].examRows[0].value='前期全体60人。確定内訳は要確認。';assert.throws(()=>applyUniversityAdmissionsFromIndex(raw,new Map([[data.path,changed]])),/canonical facts changed/);
});
test('Shimane overrides stale production metadata, replaces the whole body, and remains idempotent',()=>{
 const stale={...raw,title:'大学概要',lead:'過年度参考',contentHtml:'<h2 id="最新の入試情報">公式情報を確認する</h2><p>古い大学基本情報</p>',infoItems:raw.infoItems.map(i=>i.label==='年度'?{...i,value:'過年度参考'}:i.label==='地域'?{...i,value:'古い地域'}:i.label==='種別'?{...i,value:'大学概要・公式入試情報'}:i)};
 const expected=applyUniversityAdmissionsFromIndex(raw,index),actual=applyUniversityAdmissionsFromIndex(stale,index);
 for(const key of ['title','displayTitle','displayTitleLines','description','lead','modified','keyPoints','contentHtml','infoItems','toc'])assert.deepEqual(actual[key],expected[key],key);
 assert.equal(actual.infoItems.find(i=>i.label==='年度').value,'2027年度（入試情報）');assert.equal(actual.infoItems.find(i=>i.label==='種別').value,'医学部入試情報');assert.equal(actual.infoItems.find(i=>i.label==='地域').value,'中国');
 assert.equal(classifyArticlePost(actual).facets.region,'中国');assert.deepEqual(applyUniversityAdmissionsFromIndex(actual,index),actual);
});
test('Shimane registration leaves other universities and other templates unchanged',()=>{
 for(const p of posts.filter(p=>p.path!==data.path))assert.equal(applyUniversityAdmissionsFromIndex(p,index),p);
 const other={...raw,template:'university-strategy'};assert.equal(applyUniversityAdmissionsFromIndex(other,index),other);
});
