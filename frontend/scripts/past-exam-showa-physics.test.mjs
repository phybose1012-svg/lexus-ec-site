import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,sourcePoint,distance,recession,frequency,springState,film,filmGeometry} from './build-showa-2025-physics-figures.mjs';
import {reviewNotices,analysisReviewNotices} from '../src/lib/pastExamReviewNotices.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const close=(a,b,e=1e-8)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
test('Showa: tangency, recession and emission-time graph are independently consistent',()=>{
 for(const u of [Math.PI/3,5*Math.PI/3]){const s=sourcePoint(u),p=[2-s[0],-s[1]];close(s[0]*p[0]+s[1]*p[1],0);close(Math.hypot(...p),Math.sqrt(3));}
 close(recession(Math.PI/3),1);close(recession(5*Math.PI/3),-1);
 for(const beta of [.1,.35,.8]){
  close(frequency(Math.PI/3,beta),1/(1+beta));close(frequency(5*Math.PI/3,beta),1/(1-beta));
  for(let i=0;i<=200;i++){const u=i*Math.PI/100,s=sourcePoint(u),v=[-Math.sin(u),Math.cos(u)],away=[s[0]-2,s[1]],component=(v[0]*away[0]+v[1]*away[1])/Math.hypot(...away);close(component,recession(u));close(frequency(u,beta),1/(1+beta*component));assert.ok(1+beta*component>0);}
 }
 close(distance(Math.PI)-distance(0),2);close(5*Math.PI/3-Math.PI/3,4*Math.PI/3);
});
test('Showa: spring separation, elastic return and energy conditions',()=>{
 const s=springState;close(Math.cos(s.separationTime/Math.sqrt(2)),0);close(.5,2*.5*s.speed**2);close(s.speed,s.amplitude);
 close((2*s.wall-s.amplitude)/s.speed,s.collisionTime);assert.ok(s.wall>s.amplitude);
 for(let i=1;i<100;i++){const t=s.collisionTime*i/100,xA=s.amplitude*Math.sin(t),xB=t<=s.wall/s.speed?s.speed*t:2*s.wall-s.speed*t;assert.ok(xB>xA);}
 close(s.amplitude*Math.cos(s.collisionTime),0);
});
test('Showa: RLC polarity, phasor sum, resonance and mean power',()=>{
 const R=3,L=2,C=.4,w=1.7,V0=6,I0=V0/R,amplitude=I0*Math.hypot(R,w*L-1/(w*C));let max=0,p=0;
 for(let j=0;j<100000;j++){const u=2*Math.PI*j/100000,I=I0*Math.sin(u),VL=w*L*I0*Math.cos(u),VC=-I0/(w*C)*Math.cos(u);max=Math.max(max,Math.abs(R*I+VL+VC));p+=R*I*I/100000;}
 close(max,amplitude,1e-7);close(p,V0*V0/(2*R));const resonance=1/Math.sqrt(L*C);close(resonance*L-1/(resonance*C),0);
 for(const u of [Math.PI/2,3*Math.PI/2])close(Math.cos(u),0);
});
test('Showa: film wavefront and optical path, impossible source condition stays gated',()=>{
 const {A,Q,B,A2,v}=filmGeometry();close((A2[0]-A[0])*v[0]+(A2[1]-A[1])*v[1],0);
 close(Math.sin(film.i),film.n1*Math.sin(film.r));const inside=2*Math.hypot(B[0]-A[0],B[1]-A[1]),outside=Math.hypot(Q[0]-A2[0],Q[1]-A2[1]);close(film.n1*inside-outside,2*film.n1*film.d*Math.cos(film.r));
 assert.ok(1.5*Math.sin(Math.PI/3)>1);assert.match(reviewNotices[packageId]['major-question-04'].message,/1を超え/);
 // The printed wavelengths are rounded: exact arithmetic does NOT give k=6.
 close((600+508)/(2*(600-508)),277/46);assert.notEqual(277/46,6);close(600*11/13,507.6923076923077);close((6-.5)*600/4,825);
});
test('Showa: all eleven originals preserve source roles and safe labels',()=>{
 const m=read(`src/data/pastExamFigures/${packageId}.json`);assert.equal(m.items.length,11);assert.equal(m.restrictedSourceCopied,false);assert.equal(m.review.needsHumanReview,true);
 const texts=new Map(m.items.map(i=>[i.id,fs.readFileSync(new URL('../public'+i.src,import.meta.url),'utf8')]));
 for(const s of texts.values()){assert.match(s,/KaTeX_Main/);assert.match(s,/KaTeX_Math/);assert.doesNotMatch(s,/<image|foreignObject|<script|[≤≥]/);}
 const q=texts.get('q1-circular-source-layout');assert.doesNotMatch(q,/<tspan[^>]*>[BCD]<\/tspan>/);
 assert.doesNotMatch(texts.get('q1-frequency-graph-answer-field').replace(/<defs>[\s\S]*?<\/defs>/,''),/<path d="M[0-9]/);
 assert.match(texts.get('ans-q1-frequency-graph'),/到達時刻のグラフではありません/);
 assert.match(texts.get('q2-spring-masses-layout'),/物体Bを接触させる前/);
 assert.match(texts.get('q4-oblique-incidence-film'),/一般条件/);
 assert.equal(Object.keys(reviewNotices[packageId]).length,4);assert.ok(analysisReviewNotices[packageId]);
});
test('Showa: all 25 difficulty rows and prerequisite defects retained; targets withheld',()=>{
 const e=read(`src/data/pastExamAnalysisEvidence/${packageId}.json`),a=read(`src/data/pastExamAnalysisSources/${packageId}.json`),rows=e.majorQuestions.flatMap(q=>q.subquestions);
 assert.equal(rows.length,25);assert.equal(rows.reduce((s,q)=>s+q.points,0),100);assert.equal(a.targetReviewStatus,'source-repair-required');assert.deepEqual(a.targets,[]);
 const totals={};for(const q of rows)totals[q.difficulty]=(totals[q.difficulty]??0)+q.points;
 assert.deepEqual(totals,{'基本＋αレベル':34,'基本レベル':30,'標準レベル':30,'発展レベル':6});
 const now=new Set(rows.filter(q=>q.weak==='今解く！').map(q=>q.id)),missing=[];for(const q of rows.filter(q=>now.has(q.id)))for(const p of q.prerequisites.weak_subject)if(!now.has(p))missing.push([q.id,p]);
 assert.deepEqual(missing,[['phys-q2-3','phys-q2-2'],['phys-q4-7','phys-q4-6']]);
 assert.deepEqual(a.majorQuestions.flatMap(q=>q.subquestions.map(s=>s.id)),rows.map(s=>s.id));assert.match(a.targetReviewNote,/屈折|薄膜/);
});
