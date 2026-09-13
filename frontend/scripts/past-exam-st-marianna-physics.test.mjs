import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,pulley,initialPotential,isolatedPotential,isolatedField,reconnectedPotential,capacitanceRatio,conjugatePositions,graph} from './build-st-marianna-2025-physics-figures.mjs';
import {renderProjection} from './build-past-exam-staging-answers.mjs';
import {withReviewNotice,analysisReviewNotices} from '../src/lib/pastExamReviewNotices.mjs';
const near=(a,b,e=1e-8)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
const read=p=>JSON.parse(fs.readFileSync(new URL('../src/data/'+p,import.meta.url)));
test('St Marianna physics: spring, magnetic field strength, Doppler and source classical wavelength',()=>{
 const k=100/.007,extension=140/k;near(extension,.0098);near(k*extension**2/2,.686);assert.equal(Number(k.toPrecision(2)),14000);
 near(.628/(2*3.14*.025),4);near(.40/(2*.010),20);near(100/.25*.030,12);
 near(840*340/(340+17),800);near(840*(340+17)/340,882);near(840*(340-17)/(340-17),840);
 const E=2e-19*2e8,lambda=7e-34/Math.sqrt(2*2e-27*E);near(E/2e-19,2e8);near(lambda/1e-15,1.75);assert.equal(Number(lambda.toPrecision(1)),2e-15);
});
test('St Marianna physics: pulley forces and signed relative accelerations',()=>{
 const {m1,m2,g,F,T,A1,A2,A,a0}=pulley,a=(m2-m1)*g/(m1+m2),fixedT=m1*(g+a);
 near(a,.98);near(fixedT,97.02);near(m2*(g-a),fixedT);near((F-(m1+m2)*g)/(m1+m2),0);
 near(F-2*T,0);near(m1*A1,T-m1*g);near(m2*A2,T-m2*g);near(A1+A2,2*A);near(A1,A+a0);near(A2,A-a0);
 near(A,9.8/99);near(a0,98/99);assert.ok(A1>0&&A2<0);assert.notEqual(A1,A-a0);
 // A is the pulley acceleration, not the center-of-mass acceleration.
 near(m1*A1+m2*A2,F-(m1+m2)*g);assert.ok(A>0);
});
test('St Marianna physics: dielectric displacement, potential continuity and reconnection',()=>{
 near(initialPotential(0),0);near(initialPotential(5),1);
 for(const [u,v]of [[0,0],[2,.4],[3,.5],[5,.9]])near(isolatedPotential(u),v);
 for(const u of [2,3])near(isolatedPotential(u-1e-7),isolatedPotential(u+1e-7),1e-6);
 for(const u of [.5,1.5,2.5,3.5,4.5]){
  const relativeEpsilon=u>2&&u<3?2:1;near(relativeEpsilon*isolatedField(u),1);
  near((isolatedPotential(u+.00001)-isolatedPotential(u-.00001))/.00002,isolatedField(u)/5);
 }
 near(capacitanceRatio,5/(2+1/2+2));near(reconnectedPotential(5),1);near(reconnectedPotential(3),5/9);near(reconnectedPotential(2),4/9);
 const Eair=2/9,Ediel=1/9;near(5/9-Ediel,4/9);near(2*Eair,4/9);assert.notEqual(5/9+Eair,4/9);
 // E_x is negative, whereas plotted |E| and dV/dx are positive.
 assert.ok(-isolatedField(1)<0);
});
test('St Marianna physics: conjugate lens roots, magnification and conditional virtual image',()=>{
 for(const f of [.5,1,3])for(const multiple of [4.01,5,8]){
  const L=multiple*f,[a,b]=conjugatePositions(L,f);assert.ok(a>f&&a<b&&b<L);near(a+b,L);near(a*b,L*f);near(1/a+1/(L-a),1/f);near(1/b+1/(L-b),1/f);
  near(((L-b)/b)/((L-a)/a),(a/(L-a))**2);
 }
 assert.deepEqual(conjugatePositions(4,1),[2,2]);
 for(const m of [1.1,2,5]){const f=2,u=(m-1)*f/m,v=-m*u;assert.ok(u>0&&u<f&&v<0);near(1/u+1/v,1/f);}
 // A real image can also be observed directly beyond its image plane:
 // removing a screen alone is not a proof that the image is virtual.
 near(1/3+1/6,1/2);
});
test('St Marianna physics: heat sign in both directions and fixed-mass heat capacity',()=>{
 for(const dt of [-20,-1,1,20]){const n=2,R=8.3,A=1.5,Cv=A*R,W=n*R*dt,Q=n*Cv*dt+W,C=Q/(n*dt);near(C,(A+1)*R);assert.ok(W/dt>0&&C>Cv);near((Q-W)/(n*dt),Cv);}
 // Specific heat is Q/(mass*delta T), not the heat for arbitrary mass.
 near(100/(2*5),10);near(200/(4*5),10);
});
test('St Marianna physics: ten diagrams, blank answer fields and explicit review gates',()=>{
 const manifest=read(`pastExamFigures/${packageId}.json`);assert.equal(manifest.items.length,10);assert.equal(manifest.contentProvenance,'original_editorial');assert.equal(manifest.restrictedSourceCopied,false);
 for(const item of manifest.items){const svg=fs.readFileSync(new URL('../public'+item.src,import.meta.url),'utf8');assert.ok(svg.includes('KaTeX_Main')&&svg.includes('KaTeX_Math'));assert.ok(!/[≤≥]|<image|foreignObject|<script|\son\w+=/.test(svg));}
 for(const potential of [false,true])assert.ok(!graph({potential}).includes('class="accent"'));
 const curves=graph({answer:true,potential:true,dielectric:true});assert.ok(curves.includes('L282.000,245.000 L368.000,220.000 L540.000,120.000'));
 const src=read(`pastExamStagingAnswerSources/${packageId}.json`),p=renderProjection(src),html=p.document.majorQuestions.map(q=>withReviewNotice(q.html,packageId,q.id)).join('');
 assert.equal((html.match(/class="past-exam-figure"/g)||[]).length,1);assert.equal((html.match(/data-source-review="required"/g)||[]).length,5);assert.ok(!html.includes('data-figure-placeholder'));assert.equal(p.source.independentlyReauthored,false);
 assert.ok(analysisReviewNotices[packageId].message.includes('34.4'));
 const qs=read(`pastExamAnalysisSources/${packageId}.json`).majorQuestions.flatMap(m=>m.subquestions);assert.equal(qs.length,18);assert.ok(qs.every(q=>q.title.length<25));
});
test('St Marianna physics: exhaustive 262144 target sets and practical replacement plan',()=>{
 const e=read(`pastExamAnalysisEvidence/${packageId}.json`),qs=e.majorQuestions.flatMap(m=>m.subquestions);
 const judgment=[.3,.3,.4,.5,.4,.4,.7,.3,.4,.6,.7,.4,.6,.4,.5,.7,.4,.6],execution=[3,3,3.4,4.2,3.6,3,6,2.7,3,4.6,5.8,3.3,4.8,2.6,3.8,6,3.4,4.6],round=x=>Math.round((x+1e-9)*10)/10;
 assert.equal(qs.length,18);assert.deepEqual(qs.reduce((d,q)=>(d[q.difficulty]=(d[q.difficulty]||0)+q.points,d),{}),{'基本レベル':33,'基本＋αレベル':20,'標準レベル':47});
 for(const p of e.targetAnalysis.profiles){const key=p.id==='weak'?'weak_subject':'strong_subject',scan=judgment.reduce((s,x)=>s+round(x*p.judgmentMultiplier),0),cost=execution.map(x=>round(x*p.executionMultiplier)),deps=qs.map(q=>q.prerequisites[key].reduce((s,id)=>s|(1<<qs.findIndex(q=>q.id===id)),0));near(scan,p.scanMinutes);let best=0;
  for(let mask=0;mask<262144;mask++){let points=0,minutes=scan,valid=true;for(let i=0;i<18;i++)if(mask&(1<<i)){if((mask&deps[i])!==deps[i]){valid=false;break;}points+=qs[i].points;minutes+=cost[i];}if(valid&&minutes<=75+1e-8)best=Math.max(best,points);}
  assert.equal(best,p.maximum.points);assert.equal(best,p.id==='weak'?44:94);assert.equal(p.targetPoints,p.id==='weak'?44:75);
  for(const plan of [p.maximum,p.now,p.nowPlusLater]){near(plan.minutes,scan+qs.reduce((s,q,i)=>s+(plan.questionIds.includes(q.id)?cost[i]:0),0));near(plan.points,qs.reduce((s,q)=>s+(plan.questionIds.includes(q.id)?q.points:0),0));for(const q of qs)if(plan.questionIds.includes(q.id))for(const dep of q.prerequisites[key])assert.ok(plan.questionIds.includes(dep));}
  near(p.maximum.minutes,p.id==='weak'?73.8:73.4);near(p.now.minutes,p.id==='weak'?81:73.6);
  if(p.id==='weak'){assert.ok(p.now.minutes>75);assert.ok(p.maximum.questionIds.some(id=>!p.now.questionIds.includes(id)));assert.ok(p.now.questionIds.some(id=>!p.maximum.questionIds.includes(id)));}else assert.ok(p.now.minutes<=75&&p.now.points>=p.targetPoints);
 }
});
