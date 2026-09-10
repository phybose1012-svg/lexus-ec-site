import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,single,binary,orbitPoint,block,endControl,orbitalValues,blockValues} from './build-kanazawa-medical-2025-physics-figures.mjs';
import {withReviewNotice,analysisReviewNotices} from '../src/lib/pastExamReviewNotices.mjs';
const near=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
test('Kanazawa physics: attracting center, opposite binary positions and counterclockwise sense',()=>{
 const P=orbitPoint(single.center,single.radius,single.phase);near(Math.hypot(P[0]-single.center[0],P[1]-single.center[1]),single.radius);
 const c=binary.center,p=orbitPoint(c,binary.outer,binary.phase),q=orbitPoint(c,binary.inner,binary.phase+Math.PI);
 near((p[0]-c[0])/binary.outer,-(q[0]-c[0])/binary.inner);near((p[1]-c[1])/binary.outer,-(q[1]-c[1])/binary.inner);
 assert.ok(binary.outer>binary.inner);assert.notEqual(binary.outer/binary.inner,3);
 const a=orbitPoint([0,0],1,0),b=orbitPoint([0,0],1,.01);assert.equal(a[0],1);assert.ok(b[1]<0); // rightmost point moves UP
});
test('Kanazawa physics: block heights, horizontal span and endpoint tangent are exact',()=>{
 const {A,B,C,D,scale}=block;near((B[1]-A[1])/scale,1);near((C[1]-D[1])/scale,.75);near((D[0]-A[0])/scale,2);near(B[1],C[1]);
 assert.ok(A[0]<B[0]&&B[0]<C[0]&&C[0]<D[0]);
 near(Math.atan2(endControl[1]-D[1],D[0]-endControl[0])*180/Math.PI,42);
});
test('Kanazawa physics: independent Doppler and circular-motion values',()=>{
 const v=orbitalValues();near(v.omega,.0002);near(v.V,360000);near(v.r,1.8e9,1e-5);
 near(v.M/1e30,3.4974512743628186);assert.equal(v.M.toPrecision(2),'3.5e+30');assert.equal(v.mPrime.toPrecision(2),'7.0e+30');assert.equal(v.MPrime.toPrecision(2),'2.1e+31');
 near(2*v.vP/3e8,3.6e-3);near(2*v.vQ/3e8,1.2e-3);
 near(v.mPrime*v.rP/(v.MPrime*v.rQ),1);
 near(6.67e-11*v.MPrime/(v.rP+v.rQ)**2,v.vP**2/v.rP,1e-8);
});
test('Kanazawa physics: moving-observer amplitude holds even when it never approaches',()=>{
 const c=3e8,V=3.6e5;
 for(const v0 of [1e5,7e5]){
  const fMax=1-(v0-V)/c,fMin=1-(v0+V)/c;near(fMax-fMin,2*V/c);
  const eps=v0/c;assert.ok(Math.abs(1/(1-eps)-(1+eps))<2*eps**2);
  // Source inverse correction and 1-eps agree only through first order.
  assert.ok(Math.abs(1/(1+eps)-(1-eps))<eps**2);
 }
});
test('Kanazawa physics: block conservation laws and the relative, not laboratory, angle',()=>{
 const v=blockValues();near(v.vB+9*v.VB,0);near(.5*v.vB**2+4.5*v.VB**2,9.8);near(v.vB,4.2);
 near(v.l+9*v.L,0);near(v.l-v.L,2);near(v.vx+9*v.VD,0);near(.5*(v.vx**2+v.vy**2)+4.5*v.VD**2,2.45);
 near(v.vy/(v.vx-v.VD),.90);near(v.vy/v.vx,1);assert.ok(v.VD<0&&v.vx>0&&v.vy>0);
 // Follow the problem's explicitly prescribed sqrt(190)=14 for the printed answers.
 const prescribedVD=-7/(3*14);assert.equal((-9*prescribedVD).toPrecision(2),'1.5');assert.equal(prescribedVD.toPrecision(2),'-0.17');
});
test('Kanazawa physics: point shares and feasible targets respect the source assumptions',()=>{
 const a=JSON.parse(read(`../src/data/pastExamAnalysisEvidence/${packageId}.json`));
 // Verify optimization independently from the published source assumptions.
 const points=[13,12,13,12,12,13],times=[7.5,5,6.5,5,4.5,7];
 function solve(weak){let best=0,bestMask=0,bestTime=Infinity;for(let mask=0;mask<64;mask++){
  if(weak&&(mask&6))continue;if((mask&6)&&!(mask&1))continue;
  let p=0,t=weak?10.4:2.6;for(let i=0;i<6;i++)if(mask&(1<<i)){p+=points[i];t+=weak?Math.round(times[i]*15)/10:times[i];}
  if(t<=45&&(p>best||p===best&&t<bestTime)){best=p;bestMask=mask;bestTime=t;}
 }return[best,bestMask];}
 assert.deepEqual(solve(true),[38,49]);assert.equal(solve(false)[0],75);assert.equal(Math.floor(75*.8),60);
 near(10.4+11.3+6.8+10.5,39);near(2.6+7.5+5+5+4.5+7,31.6);assert.ok(10.4+11.3+7.5+6.8+10.5>45);
 assert.equal(points.reduce((a,b)=>a+b),75);
 assert.deepEqual(a.majorQuestions.flatMap(q=>q.subquestions.map(s=>s.points)),points);
 assert.deepEqual(a.targetAnalysis.profiles.map(p=>[p.targetPoints,p.maximum.points,p.maximum.minutes]),[[38,38,39],[60,75,38.1]]);
 assert.deepEqual(a.targetAnalysis.profiles[0].maximum.questionIds,['phys-q1-1','phys-q2-2','phys-q2-3']);
});
test('Kanazawa physics: original assets, no leaked solutions and scoped review boundaries',()=>{
 const m=JSON.parse(read(`../src/data/pastExamFigures/${packageId}.json`));assert.equal(m.items.length,3);assert.equal(m.restrictedSourceCopied,false);assert.equal(m.review.needsHumanReview,true);
 for(const i of m.items){const s=read(`../public${i.src}`);assert.equal((s.match(/@font-face/g)||[]).length,2);assert.doesNotMatch(s,/<image\b|<foreignObject\b/);const labels=[...s.matchAll(/<text\b[\s\S]*?<\/text>/g)].map(x=>x[0].replace(/<[^>]+>/g,'')).join(' ');assert.doesNotMatch(labels,/1\.5|7\.0|3:1|45°|v_x|v_y/);}
 assert.match(m.items[1].caption,/半径比は模式的/);assert.match(m.items[2].caption,/床から見た射出角ではありません/);
 const q=JSON.parse(read(`../src/data/generated/pastExamQuestions/${packageId}.json`));const html=JSON.stringify(q);
 assert.equal((html.match(/data-figure-id=/g)||[]).length,3);assert.doesNotMatch(html,/data-figure-placeholder/);
 assert.match(withReviewNotice('<h2>第1問</h2>',packageId,'major-question-01'),/data-source-review="required"/);
 assert.match(analysisReviewNotices[packageId].message,/近似/);
});
test('Kanazawa physics: all 49 mathematical answer boxes and both choice groups survive import',()=>{
 const q=JSON.parse(read(`../src/data/generated/pastExamQuestions/${packageId}.json`));
 const html=q.document.questions.map(x=>x.html).join('');
 const formulas=[...html.matchAll(/data-katex="([^"]*)"/g)].map(x=>x[1]).join(' ');
 const slots=[...formulas.matchAll(/\\boxed\{\\text\{(\d+)\}\}/g)].map(x=>Number(x[1]));
 assert.deepEqual(slots,Array.from({length:49},(_,i)=>i+1));
 // A source page split still separates choices 1..3 and 4..5; none may be dropped.
 const marks=[...html.matchAll(/class="structured-list__label">([^<]+)/g)].map(x=>x[1]);
 assert.deepEqual(marks,['①','②','③','④','⑤','①','②','③','④','⑤','⑥','⑦','⑧']);
 assert.equal((html.match(/structured-list--values/g)||[]).length,3);
});
