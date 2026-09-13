import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../frontend/',import.meta.url);
// This QA file is under qa/past-exam-batch, so the project frontend is two levels up.
const id='st-marianna-2025-general-early-mathematics';
const origin=process.argv[2]||'https://staging.lexus-ec.pages.dev';
const base='/past-exam-library/st-marianna/2025/mathematics/';
for(const role of ['questions','answers','analysis']){
 const r=await fetch(origin+base+role+'/',{signal:AbortSignal.timeout(30000)}),h=await r.text();
 assert.equal(r.status,200);assert.equal((h.match(/<h1\b/g)||[]).length,1);assert.ok(/<meta[^>]*name="robots"[^>]*noindex/.test(h));assert.ok(h.includes('https://lexus-ec.com'+base+role+'/'));
 if(role==='answers'){assert.ok(h.includes('cを除いた10通りと、条件を満たす復元数'));assert.ok(h.includes('6個になる範囲と、両端での確認'));assert.equal((h.match(/class="past-exam-figure"/g)||[]).length,3);}
 if(role==='analysis'){assert.ok(h.includes('定義と端の固定から、確実に。'));assert.ok(h.includes('判断だけで70分'));}
 console.log(role+': HTTP200, one h1, noindex, canonical, expected content');
}
const manifest=JSON.parse(fs.readFileSync(new URL('src/data/pastExamFigures/'+id+'.json',root)));
for(const f of manifest.items){const r=await fetch(origin+f.src,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200);assert.ok(Buffer.from(await r.arrayBuffer()).equals(fs.readFileSync(new URL('public'+f.src,root))));console.log(f.id+': served bytes match');}
for(const src of ['/assets/past-exams/iwate-medical-2025-general-mathematics/figures/q1-function-graph.svg','/assets/past-exams/iwate-medical-2025-general-physics/figures/ans-q3-lens-geometry.svg','/assets/past-exams/jichi-medical-2025-general-mathematics-second-stage/figures/ans-overview-diagram.svg']){
 const local=fs.readFileSync(new URL('public'+src,root));assert.ok(local.equals(fs.readFileSync(new URL('dist'+src,root))));const r=await fetch(origin+src,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200);assert.ok(Buffer.from(await r.arrayBuffer()).equals(local));console.log(src+': merged human asset preserved');
}
