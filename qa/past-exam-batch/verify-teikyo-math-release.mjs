import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../frontend/',import.meta.url),id='teikyo-2025-general-mathematics';
const origin=process.argv[2]||'https://staging.lexus-ec.pages.dev',base='/past-exam-library/teikyo/2025/mathematics/';
for(const role of ['questions','answers','analysis']){
 const r=await fetch(origin+base+role+'/',{signal:AbortSignal.timeout(30000)}),h=await r.text();assert.equal(r.status,200);assert.equal((h.match(/<h1\b/g)||[]).length,1);assert.match(h,/<meta[^>]*name="robots"[^>]*noindex/);assert.ok(h.includes('https://lexus-ec.com'+base+role+'/'));
 if(role==='questions'){assert.ok(h.includes('(1)の恒等式は元HTMLの修復待ちです'));assert.equal((h.match(/data-figure-placeholder/g)||[]).length,2);}
 if(role==='answers'){assert.equal((h.match(/class="past-exam-figure"/g)||[]).length,4);assert.ok(h.includes('3次関数Fの増減表'));assert.ok(h.includes('answer-table--variation'));assert.equal((h.match(/data-figure-placeholder/g)||[]).length,3);}
 if(role==='analysis'){assert.ok(h.includes('日ごとに分けて、取れる問題を確保。'));assert.ok(h.includes('合計を半分にして1日分の目安にはしません'));}
 console.log(role+': HTTP200, h1, noindex, canonical and new content verified');
}
const m=JSON.parse(fs.readFileSync(new URL('src/data/pastExamFigures/'+id+'.json',root)));
for(const f of [...m.items,{id:'human-ans-q7-tetrahedron',src:'/assets/past-exams/jichi-medical-2025-general-mathematics/figures/ans-q7-tetrahedron.svg'}]){
 const local=fs.readFileSync(new URL('public'+f.src,root));assert.ok(local.equals(fs.readFileSync(new URL('dist'+f.src,root))));const r=await fetch(origin+f.src,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200);assert.ok(local.equals(Buffer.from(await r.arrayBuffer())));console.log(f.id+': public, dist and served bytes match');
}
