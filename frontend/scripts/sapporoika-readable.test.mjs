import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {pathToFileURL} from 'node:url';
import {verifySapporoikaReadable,verifySapporoikaTransforms,verifySapporoikaArithmetic} from './verify-sapporoika-readable.mjs';
const frontendRoot=process.env.SAPPORO_FRONTEND_ROOT?pathToFileURL(process.env.SAPPORO_FRONTEND_ROOT.replace(/[\\/]?$/u,'/')).href:new URL('../',import.meta.url).href;
const data=JSON.parse(fs.readFileSync(new URL('src/data/universityAdmissions/sapporoika.json',frontendRoot),'utf8'));
test('all Sapporo routes, merged sources, held dates, overview and main safety wrappers retain their meaning',()=>{const r=verifySapporoikaReadable(verifySapporoikaTransforms().contentHtml);assert.equal(r.totalFacts,243);assert.equal(r.heldDateOrigins.length,3);});
test('losing a required source, origin, exact deadline or status fails',()=>{
 const html=verifySapporoikaTransforms().contentHtml;
 for(const changed of [html.replaceAll('17:00必着','17:00消印有効'),html.replace('general-standard/exam/0','general-standard/exam/999'),html.replace('data-admission-status="needs-confirmation"','data-admission-status="confirmed"'),html.replace('recommendation-2027&quot;','invented-source&quot;')])assert.throws(()=>verifySapporoikaReadable(changed));
});
test('foreign held dates cannot leak into a summary or the article',()=>{const html=verifySapporoikaTransforms().contentHtml;assert.throws(()=>verifySapporoikaReadable(html+'<p>2027年1月19日</p>'));});
test('route-specific score errors fail independently of a rendered row matching its candidate',()=>{
 for(const [sid,label]of [['general-standard','最終判定・国語'],['general-training','個別・英語'],['comprehensive-domin','面接'],['recommendation-special','自己推薦書']]){
  const changed=structuredClone(data),row=changed.schemes.find(s=>s.id===sid).examRows.find(r=>r.label===label);row.value='999点。';assert.throws(()=>verifySapporoikaArithmetic(changed));
 }
});
