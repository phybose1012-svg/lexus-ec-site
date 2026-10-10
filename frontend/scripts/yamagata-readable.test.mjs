import fs from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {applyUniversityAdmissionsFromIndex} from '../src/lib/universityAdmissions.ts';
import {classifyArticlePost} from '../src/data/articleTaxonomy.js';
import {verifyYamagataHtml,all,text} from './verify-yamagata-readable.mjs';
import {parse,serialize} from 'parse5';
const read=n=>JSON.parse(fs.readFileSync(new URL('../src/data/'+n,import.meta.url),'utf8'));
const data=read('universityAdmissions/yamagata.json'),posts=read('generated/admissionInfoPosts.json'),raw=posts.find(p=>p.path===data.path),index=new Map([[data.path,data]]);
test('Yamagata preserves original facts, added conditions and latest medical entrant statistics',()=>{
 const output=applyUniversityAdmissionsFromIndex(raw,index),verified=verifyYamagataHtml(output.contentHtml);
 assert.equal(verified.mappedItems,51);assert.equal(verified.originalFacts,33);assert.equal(verified.sources,11);
 assert.deepEqual(verified.tables,['overview','dates','scores','男女比']);
 for(const [before,after] of [['5倍を超え、かつ','5倍を超え、または'],['総合点にかかわらず不合格','総合点によって合格'],['2月1日（月）までの消印がある書留速達に限り','2月3日（水）までの消印があれば'],['論理・表現Ⅰ。','論理・表現Ⅰ・Ⅱ・Ⅲ。'],['第150条（第6号を除く）','第150条'],['2027年1月13日（水）必着','2027年2月13日（土）消印有効']])assert.throws(()=>verifyYamagataHtml(output.contentHtml.replaceAll(before,after)),before);
 const changed=structuredClone(data);changed.schemes[0].examRows[0].value='75人。変更は要確認。';assert.throws(()=>applyUniversityAdmissionsFromIndex(raw,new Map([[data.path,changed]])),/canonical facts changed/);
});
test('Yamagata distinguishes OR qualification and exemption routes from AND consultation requirements',()=>{
 const output=applyUniversityAdmissionsFromIndex(raw,index),tree=parse(output.contentHtml);
 const routes=all(tree,n=>n.tagName==='dt'&&text(n)==='基本となる資格')[0].parentNode;
 assert.equal(all(routes,n=>n.tagName==='li').length,3);
 for(const [before,after] of [['相談書と医師の診断書の両方','相談書または診断書'],['障害者手帳を所持している場合','全員'],['準備ができ次第、写しを追加提出','決定通知書は不要'],['申請を断る場合もあります','必ず受け付けます'],['2027年3月31日までに18歳','2027年3月31日までに17歳'],['出願時まで引き続き無職','出願時に再就職していても可'],['所得・非課税証明書のすべて','所得証明書のいずれか']])assert.throws(()=>verifyYamagataHtml(output.contentHtml.replaceAll(before,after)),before);
 const first=all(routes,n=>n.tagName==='li')[0];first.parentNode.childNodes=first.parentNode.childNodes.filter(n=>n!==first);assert.throws(()=>verifyYamagataHtml(serialize(tree)));
});
test('Yamagata replaces stale production metadata, body, region and TOC idempotently',()=>{
 const stale={...raw,title:'大学概要',lead:'過年度参考',contentHtml:'<h2 id="最新の入試情報">公式情報を確認する</h2><p>古い大学基本情報</p>',infoItems:raw.infoItems.map(i=>i.label==='年度'?{...i,value:'過年度参考'}:i.label==='地域'?{...i,value:'古い地域'}:i.label==='種別'?{...i,value:'大学概要・公式入試情報'}:i)};
 const expected=applyUniversityAdmissionsFromIndex(raw,index),actual=applyUniversityAdmissionsFromIndex(stale,index);
 for(const key of ['title','displayTitle','displayTitleLines','description','lead','modified','keyPoints','contentHtml','infoItems','toc'])assert.deepEqual(actual[key],expected[key],key);
 assert.equal(actual.infoItems.find(i=>i.label==='年度').value,'2027年度（入試情報）');assert.equal(actual.infoItems.find(i=>i.label==='種別').value,'医学部入試情報');assert.equal(actual.infoItems.find(i=>i.label==='地域').value,'東北');
 assert.equal(classifyArticlePost(actual).facets.region,'東北');assert.deepEqual(applyUniversityAdmissionsFromIndex(actual,index),actual);
});
test('Yamagata registration leaves unrelated universities and templates unchanged',()=>{
 for(const p of posts.filter(p=>p.path!==data.path))assert.equal(applyUniversityAdmissionsFromIndex(p,index),p);
 assert.equal(applyUniversityAdmissionsFromIndex({...raw,template:'university-strategy'},index).template,'university-strategy');
});
