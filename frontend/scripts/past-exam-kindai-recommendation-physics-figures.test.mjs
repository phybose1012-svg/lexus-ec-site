import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {collision,orbit,rc,packageId} from './build-kindai-2025-recommendation-general-public-physics-figures.mjs';
import {reviewNotices,analysisReviewNotices} from '../src/lib/pastExamReviewNotices.mjs';
const near=(a,b,e=1e-8)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
test('Kindai recommendation physics: reflection preserves speed and reverses only the normal component',()=>{
 for(let k=0;k<89;k++){
  const t=k*Math.PI/180,g=collision(t,2,7,3,4),n=[-Math.cos(t),Math.sin(t)],normalIn=3*n[0],normalOut=g.out[0]*n[0]+g.out[1]*n[1];
  near(Math.hypot(...g.out),3);near(normalOut,-normalIn);
  near(4*Math.hypot(g.out[0]-3,g.out[1]),g.impulse);
  assert.equal(g.wall!==null,k>45);
 }
 near(collision(Math.PI/3,2,7).wall,Math.sqrt(3)*9);
});
test('Kindai recommendation physics: arrivals correspond to outer quarter and half of the incident area',()=>{
 near(1-Math.SQRT1_2**2,.5);near(1-(Math.sqrt(3)/2)**2,.25);
 let previous=Infinity;for(let i=1;i<=400;i++){
  const a=Math.SQRT1_2+(1-Math.SQRT1_2)*i/401,g=collision(Math.asin(a));
  assert.ok(g.wall<previous);previous=g.wall;assert.ok(g.wall>1);
  assert.equal(g.wall<Math.sqrt(3)*4,a>Math.sqrt(3)/2);
 }
});
test('Kindai recommendation physics: hyperbola obeys both invariants, asymptotes and reflection symmetry',()=>{
 const o=orbit(),mu=.7,v0=1,b=2.4,h=b*v0;
 near(2*o.theta2+o.beta,Math.PI);near(o.r2,1/(1/o.r1+o.vr1/(2*o.S)));
 assert.ok(o.r2<o.r1);near(Math.cos(o.theta2),2*o.S/(o.vr1*o.r1));
 for(let t=-2;t<=2;t+=.1){
  const p=o.point(t),q=o.point(-t),r=Math.hypot(...p),u=o.tangent(t),cross=p[0]*u[1]-p[1]*u[0],speed=-h/cross;
  near(.5*speed**2-mu/r,.5*v0**2);near(cross*speed,-h);
  const theta=Math.atan2(p[1],p[0]);near(1/r,1/o.r1+o.vr1/(2*o.S)*Math.cos(theta-o.theta2));
  const pd=p[0]*o.d[0]+p[1]*o.d[1];near(q[0],2*pd*o.d[0]-p[0]);near(q[1],2*pd*o.d[1]-p[1]);
 }
 near(o.point(12)[1],b,1e-5);const p=o.point(-12);near(p[1],o.outY(p[0]),1e-5);
});
test('Kindai recommendation physics: RC phasor and mean power use amplitudes, not instantaneous Ohm law for C',()=>{
 const g=rc();near(g.IR/g.IC,Math.tan(.2));near(g.P+g.Pr,g.Pt);
 let p=0,c=0;const n=10000;for(let k=0;k<n;k++){const t=2*Math.PI*k/n,V=4*Math.sin(t);p+=V*V/g.R/n;c+=V*g.IC*Math.cos(t)/n;}
 near(p,g.P);near(c,0);
 near((1+.2*3*5*Math.tan(.2))/(2*5)*16,g.Pt);
});
test('Kindai recommendation physics: all 2048 subsets independently reproduce both time-constrained maxima',()=>{
 const ids=['phys-q1-a1','phys-q1-a2','phys-q1-b','phys-q1-c1','phys-q1-c2','phys-q1-c3','phys-q2-a1','phys-q2-a2','phys-q2-b1','phys-q2-b2','phys-q2-c'];
 const judge=[.3,.5,.4,.4,.8,.7,.3,.3,.4,.5,.5],exec=[2.7,4.3,3.6,3.1,6.2,4.8,2.7,2.7,3.6,3.9,4.1],deps=[null,0,1,null,3,4,null,6,null,8,9];
 const e=JSON.parse(fs.readFileSync(new URL(`../src/data/pastExamAnalysisEvidence/${packageId}.json`,import.meta.url)));
 const r=x=>Math.round((x+1e-10)*10)/10;
 for(const profile of e.targetAnalysis.profiles){
  const scan=r(judge.reduce((s,x)=>s+r(x*profile.judgmentMultiplier),0));near(scan,profile.scanMinutes);
  const times=exec.map(x=>r(x*profile.executionMultiplier)),calc=indices=>({points:indices.reduce((s,i)=>s+(i===4?10:9),0),minutes:r(scan+indices.reduce((s,i)=>s+times[i],0))});
  let max=-1,fastest=Infinity;
  for(let mask=0;mask<2048;mask++){
   const selected=ids.flatMap((_,i)=>mask&(1<<i)?[i]:[]);
   if(selected.some(i=>deps[i]!==null&&!selected.includes(deps[i])))continue;
   const v=calc(selected);if(v.minutes>60)continue;
   if(v.points>max){max=v.points;fastest=v.minutes;}else if(v.points===max)fastest=Math.min(fastest,v.minutes);
  }
  near(profile.maximum.points,max);near(profile.maximum.minutes,fastest);
  for(const name of ['maximum','now','nowPlusLater']){
   const plan=profile[name],v=calc(plan.questionIds.map(id=>ids.indexOf(id)));near(plan.points,v.points);near(plan.minutes,v.minutes);
  }
 }
});
test('Kindai recommendation physics: all 19 original figures retain meaning, font faces and review gates',()=>{
 const m=JSON.parse(fs.readFileSync(new URL(`../src/data/pastExamFigures/${packageId}.json`,import.meta.url)));
 assert.equal(m.items.length,19);assert.equal(m.items.filter(i=>i.id.startsWith('q-')).length,9);
 assert.equal(m.restrictedSourceCopied,false);assert.equal(m.review.needsHumanReview,true);
 for(const a of m.items){const svg=fs.readFileSync(new URL(`../public${a.src}`,import.meta.url),'utf8');assert.match(svg,/KaTeX_Main/);assert.match(svg,/KaTeX_Math/);assert.doesNotMatch(svg,/<image|<foreignObject|<script|≤|≥/);}
 const conic=m.items.find(i=>i.id==='q-i-c-fig4');assert.match(fs.readFileSync(new URL(`../public${conic.src}`,import.meta.url),'utf8'),/ϕ/);
 assert.equal(Object.keys(reviewNotices[packageId]).length,2);assert.ok(analysisReviewNotices[packageId]);
});
test('Kindai recommendation physics: built questions and answers retain source-review boundaries',()=>{
 const base=new URL('../dist/past-exam-library/kindai/2025/physics-recommendation-general-public-first-stage/',import.meta.url);
 for(const role of ['questions','answers','analysis']){
  const html=fs.readFileSync(new URL(`${role}/index.html`,base),'utf8');assert.match(html,/noindex/);
  assert.match(html,/修復待ち|確認待ち/);
  if(role!=='analysis')assert.equal((html.match(/data-source-review="required"/g)||[]).length,2);
 }
});
