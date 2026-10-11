import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createUniversityAdmissionsIndex,applyUniversityAdmissionsFromIndex} from '../src/lib/universityAdmissions.ts';
import {transformUniversityInfoPost} from '../src/lib/universityInfoSafety.ts';
import {classifyArticlePost} from '../src/data/articleTaxonomy.js';
const data=JSON.parse(fs.readFileSync(new URL('../src/data/universityAdmissions/kagoshima.json',import.meta.url)));
const posts=JSON.parse(fs.readFileSync(new URL('../src/data/generated/admissionInfoPosts.json',import.meta.url)));
const raw=posts.find(p=>p.path===data.path),index=createUniversityAdmissionsIndex({'../data/universityAdmissions/kagoshima.json':data});

test('Kagoshima restores the complete current article after the actual production safety transformation',()=>{
 const safe=transformUniversityInfoPost(raw);assert.notEqual(safe.contentHtml,raw.contentHtml);
 const expected=applyUniversityAdmissionsFromIndex(raw,index),actual=applyUniversityAdmissionsFromIndex(safe,index);
 assert.deepEqual(actual,expected);
 assert.equal(actual.title,'鹿児島大学医学部｜2027年度入試情報');
 assert.equal(actual.infoItems.find(r=>r.label==='年度').value,'2027年度（入試情報）');
 assert.equal(actual.infoItems.find(r=>r.label==='種別').value,'入試情報');
 assert.equal(classifyArticlePost(actual).facets.region,'九州・沖縄');
 assert.ok(actual.toc.some(r=>r.id==='admission-regional-career'));
});
test('Kagoshima keeps route-specific failure criteria, uncertain fees and medical-only statistics visible',()=>{
 const html=applyUniversityAdmissionsFromIndex(raw,index).contentHtml.replace(/<details\b[\s\S]*?<\/details>/gu,'');
 for(const text of ['面接10点以下','面接20点以下','65％未満','1,845点','1,245点','1,005点','360点','1,010点','52人','47.3％','727人','293人','40.3％','2027年度の入学料・授業料免除と徴収猶予の制度は未定','県の同意を得ない離脱扱い'])assert.ok(html.includes(text),text);
 assert.equal(data.basicInfoRows.length,10);
});
test('Kagoshima leaves other universities and templates unchanged',()=>{
 const other={...raw,path:'/information-saga/'};assert.equal(applyUniversityAdmissionsFromIndex(other,index),other);
 const template={...raw,template:'standard'};assert.equal(applyUniversityAdmissionsFromIndex(template,index),template);
});
