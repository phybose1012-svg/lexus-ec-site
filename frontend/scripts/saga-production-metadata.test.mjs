import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {applyUniversityAdmissionsFromIndex} from '../src/lib/universityAdmissions.ts';
import {classifyArticlePost} from '../src/data/articleTaxonomy.js';

const read=name=>JSON.parse(fs.readFileSync(new URL(`../src/data/${name}`,import.meta.url),'utf8'));
const admissions=read('universityAdmissions/saga.json');
const raw=read('generated/admissionInfoPosts.json').find(post=>post.path===admissions.path);
assert.ok(raw);
const index=new Map([[admissions.path,admissions]]);
// Main's safety layer changes these fields before verified admission rendering.
// Use its production shape even when the main-only module is absent on staging.
const production={...raw,infoItems:raw.infoItems.map(item=>item.label==='年度'
  ? {...item,value:'過年度参考（最新は大学公式要項）'}
  : item.label==='種別'?{...item,value:'大学概要・公式入試情報'}:item),
  contentHtml:'<p data-university-info-safety="overview">大学概要の参考情報。</p><h2 id="最新の入試情報">最新の入試情報を確認する</h2>'};

test('Saga keeps the same kind, region, metadata and article on staging and production input',()=>{
  const before=structuredClone(production);
  const staging=applyUniversityAdmissionsFromIndex(raw,index);
  const main=applyUniversityAdmissionsFromIndex(production,index);
  assert.equal(main.infoItems.find(item=>item.label==='種別')?.value,'入試情報');
  assert.deepEqual(main.infoItems,staging.infoItems);
  assert.equal(classifyArticlePost(main).facets.region,'九州・沖縄');
  assert.equal(classifyArticlePost(main).facets.region,classifyArticlePost(staging).facets.region);
  assert.equal(main.contentHtml,staging.contentHtml);
  for(const key of ['title','displayTitle','displayTitleLines','description','lead','keyPoints','toc','modified'])assert.deepEqual(main[key],staging[key],key);
  assert.deepEqual(production,before,'The input is not mutated');
});

test('Saga metadata correction requires its reviewed path, template and indexed data',()=>{
  assert.equal(applyUniversityAdmissionsFromIndex({...production,template:'exam-column'},index).infoItems,production.infoItems);
  const other={...production,path:'/information-toyama/'};
  assert.equal(applyUniversityAdmissionsFromIndex(other,index),other);
  assert.equal(applyUniversityAdmissionsFromIndex(production,new Map()),production);
});
