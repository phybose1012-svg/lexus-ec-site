import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../frontend/',import.meta.url);
const id='st-marianna-2025-general-early-physics';
const origin=process.argv[2]||'https://staging.lexus-ec.pages.dev';
const base='/past-exam-library/st-marianna/2025/physics/';
for(const role of ['questions','answers','analysis']){
 const r=await fetch(origin+base+role+'/',{signal:AbortSignal.timeout(30000)}),h=await r.text();
 assert.equal(r.status,200);assert.equal((h.match(/<h1\b/g)||[]).length,1);assert.ok(/<meta[^>]*name="robots"[^>]*noindex/.test(h));assert.ok(h.includes('https://lexus-ec.com'+base+role+'/'));
 if(role==='questions'){assert.equal((h.match(/class="past-exam-figure"/g)||[]).length,9);assert.ok(h.includes('空欄⑫と会話文を修復待ちです'));}
 if(role==='answers'){assert.equal((h.match(/class="past-exam-figure"/g)||[]).length,1);assert.ok(h.includes('a3-answer-graphs.svg'));assert.ok(h.includes('点cの電位計算の符号を修復待ちです'));}
 if(role==='analysis'){assert.ok(h.includes('基本を確保し、条件の切替えに備える。'));assert.ok(h.includes('一巡判断に34.4分'));}
 console.log(role+': HTTP200, one h1, noindex, canonical, expected content');
}
const manifest=JSON.parse(fs.readFileSync(new URL('src/data/pastExamFigures/'+id+'.json',root)));
for(const f of manifest.items){const local=fs.readFileSync(new URL('public'+f.src,root));assert.ok(local.equals(fs.readFileSync(new URL('dist'+f.src,root))));const r=await fetch(origin+f.src,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200);assert.ok(Buffer.from(await r.arrayBuffer()).equals(local));console.log(f.id+': served bytes match');}
for(const [pkg,figure] of [['jichi-medical-2025-general-mathematics-second-stage','ans-proof-diagram'],['jichi-medical-2025-general-mathematics-second-stage','ans-midpoint-diagram'],['jichi-medical-2025-general-mathematics-second-stage','ans-alternative-diagram'],['jichi-medical-2025-general-mathematics-second-stage','ans-trig-triangle'],['jichi-medical-2025-general-mathematics','ans-q4-k-range-graph']]){
 const src='/assets/past-exams/'+pkg+'/figures/'+figure+'.svg';const local=fs.readFileSync(new URL('public'+src,root));assert.ok(local.equals(fs.readFileSync(new URL('dist'+src,root))));const r=await fetch(origin+src,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200);assert.ok(Buffer.from(await r.arrayBuffer()).equals(local));console.log(figure+': merged human asset preserved');
}
