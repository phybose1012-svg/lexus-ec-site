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

test('Kagoshima consolidates repeated facts while retaining all origins and unique sections',()=>{
 const html=applyUniversityAdmissionsFromIndex(raw,index).contentHtml;
 const visible=html.replace(/<details\b[\s\S]*?<\/details>/gu,'');
 const origins=[...html.matchAll(/data-admission-origins="([^"]+)"/gu)].flatMap(m=>m[1].split(' '));
 const expected=[...data.coverageNotes.map((_,i)=>`coverage/${i}`),...data.basicInfoRows.map((_,i)=>`basic/${i}`),...data.schemes.flatMap(s=>['schedule','exam','venue','note'].flatMap(kind=>(kind==='note'?s.notes:s[`${kind}Rows`]).map((_,i)=>`${s.id}/${kind}/${i}`)))];
 assert.equal(expected.length,132);assert.equal(origins.length,132);
 assert.deepEqual([...origins].sort(),expected.sort());
 const ids=[...html.matchAll(/(?:^|\s)id="([^"]+)"/gu)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
 for(const text of ['医学科の入学定員110人には地域枠の臨時増員20人','欠員は一般後期の募集人員に含めます','一般選抜の合格者数が募集人員より少なくなる','2026年11月中旬公表予定','2027年度の入学料・授業料免除と徴収猶予の制度は未定'])assert.equal(visible.split(text).length-1,1,text);
 assert.ok(visible.includes('推薦は1校5人以内'));
 assert.ok(visible.includes('2027年2月予定の公式案内'));
 assert.ok(visible.includes('2026年度時点のもの'));
 assert.ok(!visible.includes('確認日：'));
 assert.equal((html.match(/確認日：/gu)||[]).length,14);
 assert.ok(!html.includes('id="admission-publication"'));
 assert.ok(!visible.includes('合格発表の条件'));
 assert.ok(!visible.includes('入学手続の条件'));
});
