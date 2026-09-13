import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../frontend/',import.meta.url),id='teikyo-2025-general-physics';
const origin=process.argv[2]||'https://staging.lexus-ec.pages.dev',base='/past-exam-library/teikyo/2025/physics/';
for(const role of ['questions','answers','analysis']){
 const r=await fetch(origin+base+role+'/',{signal:AbortSignal.timeout(30000)}),h=await r.text();assert.equal(r.status,200);assert.equal((h.match(/<h1\b/g)||[]).length,1);assert.match(h,/<meta[^>]*name="robots"[^>]*noindex/);assert.ok(h.includes('https://lexus-ec.com'+base+role+'/'));
 assert.equal((h.match(/data-figure-placeholder/g)||[]).length,0);
 if(role==='questions'){assert.equal((h.match(/class="past-exam-figure"/g)||[]).length,9);assert.ok(h.includes('(7)の解答値に誤り'));assert.ok(h.includes('表1 放射線加重係数'));assert.ok(h.includes('表2 等価線量'));}
 if(role==='answers'){assert.equal((h.match(/class="past-exam-figure"/g)||[]).length,1);assert.ok(h.includes('h₂＝3l'));assert.ok(h.includes('排気量の切替'));}
 if(role==='analysis'){assert.ok(h.includes('日ごとに、短い基本問題から。'));assert.ok(h.includes('1回の試験の配点ではありません'));assert.ok(h.includes('39'));}
 console.log(role+': HTTP200, h1, noindex, canonical and new content verified');
}
const m=JSON.parse(fs.readFileSync(new URL('src/data/pastExamFigures/'+id+'.json',root)));
const human=[['dokkyo-medical-2025-general-early-physics','q5-molecular-selector'],['kyorin-2025-general-mathematics','ans-ii-triangle'],['saitama-medical-2025-general-early-mathematics','ans-q3-geometry-2']];
for(const f of [...m.items,...human.map(([p,id])=>({id:'human-'+id,src:`/assets/past-exams/${p}/figures/${id}.svg`}))]){
 const local=fs.readFileSync(new URL('public'+f.src,root));assert.ok(local.equals(fs.readFileSync(new URL('dist'+f.src,root))));const r=await fetch(origin+f.src,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200);assert.ok(local.equals(Buffer.from(await r.arrayBuffer())));console.log(f.id+': public, dist and served bytes match');
}
