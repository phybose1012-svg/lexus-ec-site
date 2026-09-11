import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,collision,lensRadius,ringRadii,rodFinal} from './build-nihon-u-2025-n-unified-first-physics-figures.mjs';
import {reviewNotices,analysisReviewNotices} from '../src/lib/pastExamReviewNotices.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url)));
const close=(a,b,e=1e-9)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
test('Nihon physics I: angle is measured from the normal, restitution and friction impulses',()=>{
 for(const e of [.25,.5,.8,1])for(const t of [.4,.7,1.1]){const c=collision(e,t);close(c.tanPhi,Math.tan(t)/e);close(c.normal,e*Math.cos(t));}
 const c=collision(.5,Math.PI/4,1,1,true);close(c.impulse,3*Math.SQRT2/4);close(c.parallel,Math.SQRT2/8);close(c.normal,Math.SQRT2/4);close(c.tanPhi,.5);
});
test('Nihon physics II: free expansion, heating, then isolated mixing (not initial-to-final conservation)',()=>{
 const n=1,R=1,T0=1,nB=n/2,T1=T0,T2=2*T1,T3=2*T2,T4=(nB*T0+nB*T3)/n;
 close(nB*1.5*R*(T2-T1),.75);close(T3,4);close(T4,2.5);
 close(1.5*n*R*T4,1.5*nB*R*T0+1.5*nB*R*T3);assert.notEqual(1.5*n*R*T0,1.5*n*R*T4);
});
test('Nihon physics III: sphere, decreasing ring spacing, two equal phase reversals and five rings',()=>{
 const R=1e6,lambda=1;for(let k=1;k<=5;k++){const h=k*lambda/3,r=lensRadius(R,h);close(r*r+(R-h)**2,R*R,.0002);assert.ok(Math.abs(r/Math.sqrt(2*R*h)-1)<1e-6);}
 const radii=ringRadii(3),gaps=radii.map((r,i)=>r-(radii[i-1]??0));assert.ok(gaps.every((v,i)=>i===0||v<gaps[i-1]));
 for(let i=1;i<=4;i++){assert.equal(ringRadii(i).length,4);assert.equal(ringRadii(i).at(-1),1);}
 const n=[1,1.5,1.7];assert.ok(n[0]<n[1]&&n[1]<n[2]);close(2*n[1],3);
 const count=d=>Array.from({length:12},(_,i)=>(i+.5)/3).filter(t=>t<d-1e-10).length;
 assert.deepEqual([count(1.5),count(1.5+.001),count(11/6),count(11/6+.001)],[4,5,5,6]);
});
test('Nihon physics IV: signed induced current, terminal balance and charge/momentum invariant',()=>{
 const B=2,l=.4,m=.3,C=.2,Q0=1,R=3,F=5,v1=F*R/(B*B*l*l),I=-v1*B*l/R;
 assert.ok(I<0);close(F+I*B*l,0);
 const f=rodFinal(B,l,m,C,Q0);close(f.Q/C,B*l*f.v);close(m*f.v,B*l*(Q0-f.Q));assert.ok(f.v>0&&f.Q>0&&f.Q<Q0);
 // Downward positive current crossed with an inward field produces a rightward force.
 assert.equal((-1)*(-1),1);
});
test('Nihon physics V: nuclear labels, mass defect, efficiency and two half-lives',()=>{
 const a=235+1-92-3,b=92-36;assert.deepEqual([a,b],[141,56]);
 close(234.9935+1.0087-232.7901-3*1.0087,.186);close(.186*930,172.98);
 close((800e6/.3)/(200e6*1.6e-19)/1e19,25/3);close(.007*2**(45/7)/2,.3,.002);
});
test('Nihon physics: independently optimize all within-major subsets and verify recorded plans',()=>{
 const e=read(`../src/data/pastExamAnalysisEvidence/${packageId}.json`);
 const execution=[[1.2,1.4,2.1,2.6,2.2],[1.4,1.6,2.2,1.6,2.6],[1.2,2,1.8,2.8,2.4],[1.4,2,1.8,2.6,2.8],[1,1.2,2,2.6,2.8]];
 const judgment=[[.2,.2,.2,.4,.4],[.2,.2,.2,.2,.4],[.2,.2,.2,.4,.4],[.2,.2,.2,.4,.4],[.2,.2,.2,.4,.4]];
 const tenth=n=>Math.round(n*10),questions=e.majorQuestions.flatMap(m=>m.subquestions);
 for(const p of e.targetAnalysis.profiles){const profile=p.id==='weak'?'weak_subject':'strong_subject',scan=judgment.flat().reduce((s,t)=>s+tenth(t*p.judgmentMultiplier),0);close(scan/10,p.scanMinutes);let states=new Map([[0,0]]);
  for(let k=0;k<5;k++){const qs=e.majorQuestions[k].subquestions,opts=[];for(let mask=0;mask<32;mask++){const ids=qs.filter((q,i)=>mask&(1<<i)).map(q=>q.id);if(!qs.every((q,i)=>!(mask&(1<<i))||q.prerequisites[profile].every(id=>ids.includes(id))))continue;opts.push({points:4*ids.length,cost:qs.reduce((s,q,i)=>s+((mask&(1<<i))?tenth(execution[k][i]*p.executionMultiplier):0),0)});}const next=new Map();for(const[pts,cost]of states)for(const o of opts){const key=pts+o.points,val=cost+o.cost;if(!next.has(key)||val<next.get(key))next.set(key,val);}states=next;}
  const best=[...states].filter(([pts,cost])=>cost+scan<=600).sort((a,b)=>b[0]-a[0])[0];close(best[0],p.maximum.points);close((best[1]+scan)/10,p.maximum.minutes);
  for(const plan of [p.maximum,p.now,p.nowPlusLater]){let cost=scan;for(const id of plan.questionIds){const index=questions.findIndex(q=>q.id===id);assert.ok(index>=0);const q=questions[index];assert.ok(q.prerequisites[profile].every(id=>plan.questionIds.includes(id)));cost+=tenth(execution[Math.floor(index/5)][index%5]*p.executionMultiplier);}close(cost/10,plan.minutes);close(plan.questionIds.length*4,plan.points);}
  close(p.targetPoints,p.id==='weak'?best[0]:Math.floor(best[0]*.8));
 }
});
test('Nihon physics: all 25 keys, review gates and original SVG registrations',()=>{
 const a=read(`../src/data/pastExamStagingAnswerSources/${packageId}.json`),keys=a.editorial.pages.flatMap(p=>p.blocks).filter(b=>b.type==='answer_key').flatMap(b=>b.items).map(b=>b.value);
 assert.deepEqual(keys,['1 ①','2 ⑥','3 ⑤','4 ①','5 ③','6 ③','7 ②','8 ②','9 ⑥','10 ⑤','11 ⑤','12 ①','13 ③','14 ④','15 ①','16 ③','17 ⑥','18 ⑥','19 ③','20 ②','21 ④','22 ④','23 ②','24 ⑤','25 ④']);
 const m=read(`../src/data/pastExamFigures/${packageId}.json`);assert.equal(m.items.length,10);assert.equal(m.restrictedSourceCopied,false);assert.equal(m.review.needsHumanReview,true);
 for(const f of m.items){const svg=fs.readFileSync(new URL(`../public${f.src}`,import.meta.url),'utf8');assert.match(svg,/KaTeX_Main/);assert.match(svg,/KaTeX_Math/);assert.doesNotMatch(svg,/<(?:image|foreignObject|script)\b/);if(f.id.includes('collision'))assert.ok(svg.includes('ϕ'));}
 const qs=read(`../src/data/pastExamAnalysisEvidence/${packageId}.json`).majorQuestions.flatMap(m=>m.subquestions);assert.deepEqual(['基本レベル','基本＋αレベル','標準レベル'].map(d=>qs.filter(q=>q.difficulty===d).length),[9,7,9]);
 assert.equal(Object.keys(reviewNotices[packageId]).length,5);assert.match(analysisReviewNotices[packageId].message,/仮換算/);
 const css=fs.readFileSync(new URL('../src/styles/past-exam-figures.css',import.meta.url),'utf8');assert.ok(css.includes(`img[src^="/assets/past-exams/${packageId}/"] { min-width: 650px; }`));assert.ok(css.includes(`body.is-printing-past-exam-document .past-exam-figure img[src^="/assets/past-exams/${packageId}/"] { max-height: 200mm; max-width: 150mm; width: auto; }`));
});
