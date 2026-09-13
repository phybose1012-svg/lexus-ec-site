import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {packageId,track,crestNormal,hollowNormal,cycles,gamma,processPoints,grating} from './build-sangyo-medical-2025-general-a-b-physics-figures.mjs';
import {renderProjection} from './build-past-exam-staging-answers.mjs';
import {withReviewNotice} from '../src/lib/pastExamReviewNotices.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
const read=p=>JSON.parse(fs.readFileSync(new URL('../src/data/'+p,import.meta.url)));
const ctx={};vm.runInNewContext(fs.readFileSync(new URL('../public/assets/vendor/katex/katex.min.js',import.meta.url),'utf8'),ctx);const katex=ctx.katex;
test('Sangyo physics: energy, radial-force signs and all six contact answers',()=>{
 for(const t of [0,.2,.5]){const h=2.5,d=1.25,a=1,v2=2*(h-d-a*Math.cos(t));near(crestNormal(h,d,a,t),Math.cos(t)-v2/a);const vi2=2*(h-a-a*Math.cos(t));near(hollowNormal(h,a,t),vi2/a-Math.cos(t));}
 const cos=8/9,phi=Math.acos(cos),upper=(a,d)=>(3*a*cos+2*d)/2;
 near(upper(1,1.25),31/12);near(crestNormal(upper(1,1.25),1.25,1,phi),0);
 near(1+8/9,17/9);near(hollowNormal(7/3,1,phi),0);near(hollowNormal(2.5,1,0),0);
 for(const h of [7/3,2.5]){assert.ok(h>2.25&&h<=31/12);assert.ok(crestNormal(h,1.25,1,phi)>=0);}
 near(upper(1,2),10/3);for(const h of [3.01,3.2,10/3])assert.ok(hollowNormal(h,1,0)>=0);near(1.5*(2/3),1);
 assert.ok(crestNormal(10/3+.01,2,1,phi)<0);assert.ok(hollowNormal(2.5-.01,1,0)<0);
});
test('Sangyo physics: track tangent, half-circle and KaTeX varphi convention',()=>{
 const {a,d,phi,C,O}=track,B=[C[0]+a*Math.sin(phi),C[1]-a*Math.cos(phi)],base=C[1]+d;
 near(O[1]+a,base);const controlX=B[0]+(base-B[1])/Math.tan(phi);assert.ok(controlX>B[0]&&controlX<O[0]);near((base-B[1])/(controlX-B[0]),Math.tan(phi));
 assert.ok(katex.renderToString('\\varphi').includes('φ'));assert.ok(katex.renderToString('\\phi').includes('ϕ'));
 const manifest=read(`pastExamFigures/${packageId}.json`);assert.equal(manifest.items.length,7);assert.equal(manifest.restrictedSourceCopied,false);assert.equal(manifest.review.needsHumanReview,true);
 for(const f of manifest.items){const svg=fs.readFileSync(new URL('../public'+f.src,import.meta.url),'utf8');assert.ok(svg.includes('KaTeX_Main')&&svg.includes('KaTeX_Math'));assert.ok(!/[≤≥]/.test(svg));assert.ok(!/<image|foreignObject/.test(svg));}
});
test('Sangyo physics: four PV loops obey each process and energy/efficiency identities',()=>{
 const Cv=1/(gamma-1),Cp=Cv+1;
 cycles.forEach((c,k)=>{
  const names=['A','B','C','D'],Ts=Object.fromEntries(Object.entries(c.states).map(([n,[V,P]])=>[n,V*P]));let W=0,Qin=0,Qout=0;
  for(let i=0;i<4;i++){
   const pts=processPoints(c,i),p=c.states[names[i]],q=c.states[names[(i+1)%4]],type=c.types[i];near(pts[0][0],p[0]);near(pts[64][1],q[1]);
   pts.forEach(([V,P])=>{if(type==='adiabatic')near(P*V**gamma,p[1]*p[0]**gamma);if(type==='isothermal')near(P*V,p[1]*p[0]);if(type==='isobaric')near(P,p[1]);if(type==='isochoric')near(V,p[0]);});
   const deltaT=q[0]*q[1]-p[0]*p[1],work=type==='adiabatic'?-Cv*deltaT:type==='isothermal'?p[0]*p[1]*Math.log(q[0]/p[0]):type==='isobaric'?p[1]*(q[0]-p[0]):0,heat=Cv*deltaT+work;
   W+=work;if(heat>1e-9)Qin+=heat;if(heat<-1e-9)Qout-=heat;
  }
  const {A:a,B:b,C:cc,D:d}=Ts;assert.ok(W>0);near(W,Qin-Qout);
  const expected=[1-(d-a)/(cc-b),1-(a-b)/(d-cc),1-Cv*(d-a)/(Cp*(cc-b)),1-b/d][k];near(W/Qin,expected);
  if(k===0)near(Qin,Cv*(cc-b));if(k===1)near(W,Cp*(b-a+d-cc));if(k===3)near(Qin/d,Qout/b);
 });
});
test('Sangyo physics: alternating phases, screen order and all optical answers',()=>{
 assert.deepEqual(grating.plateIndices,[0,2,4]);assert.deepEqual(grating.screenOrders,[3,2,1,0,1,2,3]);for(let i=1;i<5;i++)near(grating.slits[i]-grating.slits[i-1],60);
 const amplitude=(phase,alpha)=>{let re=0,im=0;for(let j=0;j<64;j++){const p=j*phase+(j%2)*alpha;re+=Math.cos(p);im+=Math.sin(p);}return Math.hypot(re,im);};
 near(amplitude(2*Math.PI,0),64);near(amplitude(2*Math.PI,Math.PI),0);near(amplitude(0,Math.PI),0);near(amplitude(Math.PI,Math.PI),64);
 const d=2e-5,L=.4,n=1.5,x=.003,lambda=2*n*d*x/L;near(lambda,4.5e-7);near(L*(lambda/(2*d))/n,x);near(lambda/d,2*(lambda/(2*d)));
});
test('Sangyo physics: imported provenance and two registered answer figures retained',()=>{
 const s=read(`pastExamStagingAnswerSources/${packageId}.json`),p=renderProjection(s),html=p.document.majorQuestions.map(q=>withReviewNotice(q.html,packageId,q.id)).join('');
 assert.equal((html.match(/class="past-exam-figure"/g)||[]).length,2);assert.equal((html.match(/data-source-review="required"/g)||[]).length,3);assert.ok(!html.includes('data-figure-placeholder'));assert.equal(p.source.independentlyReauthored,false);
 const a=read(`pastExamAnalysisSources/${packageId}.json`);assert.equal(a.majorQuestions.flatMap(m=>m.subquestions).length,19);assert.ok(a.majorQuestions.flatMap(m=>m.subquestions).every(q=>q.title.length<35));assert.equal(a.format,'式・数値を記入');
});
test('Sangyo physics: exhaustive dependency-closed target plans preserve all source inputs',()=>{
 const e=read(`pastExamAnalysisEvidence/${packageId}.json`),qs=e.majorQuestions.flatMap(q=>q.subquestions),execution=[3.5,2.2,3.2,2.4,2.4,1.2,1.5,3,2.3,2.6,2.8,.7,1.2,1.4,1.8,1.6,1.8,1.8,1.8],round=x=>Math.round((x+1e-9)*10)/10;
 assert.equal(qs.length,19);assert.deepEqual(qs.reduce((a,q)=>(a[q.difficulty]=(a[q.difficulty]||0)+q.points,a),{}),{'標準レベル':41,'基本＋αレベル':21,'基本レベル':26,'発展レベル':12});
 for(const p of e.targetAnalysis.profiles){const key=p.id==='weak'?'weak_subject':'strong_subject',scan=19*round(.3*p.judgmentMultiplier),cost=execution.map(x=>round(x*p.executionMultiplier)),deps=qs.map(q=>q.prerequisites[key].reduce((s,id)=>s|(1<<qs.findIndex(q=>q.id===id)),0));near(scan,p.scanMinutes);let best=0;
  function visit(i,mask,minutes,points){if(minutes>50+1e-8)return;if(i===19){best=Math.max(best,points);return;}visit(i+1,mask,minutes,points);if(p.id==='weak'&&[7,10].includes(i))return;if((mask&deps[i])===deps[i])visit(i+1,mask|(1<<i),minutes+cost[i],points+qs[i].points);}
  visit(0,0,scan,0);assert.equal(best,p.maximum.points);
  for(const plan of [p.maximum,p.now]){const mask=qs.reduce((s,q,i)=>s|(plan.questionIds.includes(q.id)?1<<i:0),0);near(scan+qs.reduce((s,q,i)=>s+(plan.questionIds.includes(q.id)?cost[i]:0),0),plan.minutes);near(qs.reduce((s,q)=>s+(plan.questionIds.includes(q.id)?q.points:0),0),plan.points);qs.forEach((q,i)=>{if(mask&(1<<i))assert.equal(mask&deps[i],deps[i]);});if(plan.questionIds.includes('phys-q1-d'))assert.ok(plan.questionIds.includes('phys-q1-a'));}
  assert.equal(p.targetPoints,p.id==='weak'?52:80);near(p.maximum.minutes,p.id==='weak'?48.6:44.9);near(p.now.minutes,p.id==='weak'?30.1:39.1);
 }
});
