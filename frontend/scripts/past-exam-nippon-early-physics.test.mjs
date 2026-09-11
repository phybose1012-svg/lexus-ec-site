import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,potentialVertices,potential,electricMotion,cycle,departure} from './build-nippon-medical-2025-general-early-physics-figures.mjs';
import {reviewNotices,analysisReviewNotices} from '../src/lib/pastExamReviewNotices.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const read=p=>JSON.parse(fs.readFileSync(new URL(`../src/data/${p}`,import.meta.url)));
test('Nippon early physics I: energy, normal forces, flight and hemisphere departure',()=>{
 for(const g of [1,9.8])for(const r of [1,3]){const vc=Math.sqrt(g*r),v0=Math.sqrt(vc*vc+4*g*r),vB=Math.sqrt(v0*v0-2*g*r),t=Math.sqrt(4*r/g);near(vc*t,2*r);near(v0*v0/(r*g)+1,6);near(vB*vB/(r*g),3);}
 for(const R of [1,7]){const p=departure(R),g=9.8,v2=2*g*(R-p.height);near(p.x*p.x+p.height*p.height,R*R);near(v2/R,g*Math.cos(p.theta));near(p.height/R,2/3);near(p.x*Math.cos(p.theta)-p.height*Math.sin(p.theta),0);}
 near(Math.sqrt(4**3),8);const G=2,M=5,r=3,v=Math.sqrt(G*M/r);near(v*v/r,G*M/r**2);
});
test('Nippon early physics II: correct graph slopes, force conversion and time',()=>{
 assert.deepEqual(potentialVertices,[[0,0],[1.5,1],[3,1],[6,0]]);
 const e=electricMotion();e.fields.forEach((v,i)=>near(v,[-2/3,0,1/3][i]));e.accelerations.forEach((v,i)=>near(v,[-1,0,.5][i]));assert.deepEqual(e.speeds,[2,1,1,2]);e.times.forEach((v,i)=>near(v,[1,1.5,2][i]));near(e.times.reduce((s,t)=>s+t,0),4.5);near(e.threshold,Math.sqrt(3));
 for(let x=0;x<=6;x+=.25){const v=Math.sqrt(4-3*potential(x));near(.5*v*v+1.5*potential(x),2);}
 // At the threshold the plateau speed is zero: it is a boundary, not finite-time passage.
 near(3-3*potential(2),0);assert.ok(e.fields[0]!==-1);
});
test('Nippon early physics II: shell approximation and escape energy are distinct',()=>{
 const k=2,q=3,Q=5,m=2,R=10,A=k*q*Q/(m*R*R),v0=.02;
 const hExact=1/(1/R-m*v0*v0/(2*k*q*Q))-R,hApprox=v0*v0/(2*A);
 assert.ok(Math.abs(hExact/hApprox-1)<.001);const escape=Math.sqrt(2*A*R);near(.5*m*escape*escape-k*q*Q/R,0);assert.ok(hApprox/R<.001);
});
test('Nippon early physics III: adiabatic invariant, all six blanks and cycle signs',()=>{
 const c=cycle();near(c.volume,27/8);near(c.pressure,c.volume**(5/3));near(c.heatIn,633/64);near(c.workAdiabatic,405/64);near(c.heatOut,95/16);near(c.efficiency,253/633);
 const Wca=1-c.volume,Uab=c.heatIn,Ubc=-c.workAdiabatic,Uca=1.5*(1-c.volume);near(Uab+Ubc+Uca,0);near(Uca+Wca,-c.heatOut);near(c.workAdiabatic+Wca,c.heatIn-c.heatOut);assert.ok(Wca<0&&c.efficiency>0&&c.efficiency<1);
});
test('Nippon early physics: independent 128-subset target audit does not clear the source gate',()=>{
 const e=read(`pastExamAnalysisEvidence/${packageId}.json`),qs=e.majorQuestions.flatMap(m=>m.subquestions),exec=[10,3.6,8.1,8.1,3.6,6.3,6.3],judge=[1,.4,.9,.9,.4,.7,.7],round=x=>Math.round((x+1e-9)*10)/10;
 for(const [key,jm,em,points,minutes] of [['weak_subject',4,1.5,125,58],['strong_subject',1,1,200,51]]){
  const scan=judge.reduce((s,x)=>s+round(x*jm),0);let best={points:0,minutes:Infinity};
  for(let mask=0;mask<128;mask++){const selected=qs.filter((_,i)=>mask>>i&1),ids=selected.map(q=>q.id);if(selected.some(q=>q.prerequisites[key].some(id=>!ids.includes(id))))continue;
   const p=selected.reduce((s,q)=>s+q.points,0),t=scan+qs.reduce((s,q,i)=>s+(mask>>i&1?round(exec[i]*em):0),0);
   if(t<=60&&(p>best.points||p===best.points&&t<best.minutes))best={points:p,minutes:t};
  }near(best.points,points);near(best.minutes,minutes);
 }
 near(125/200*100,62.5);assert.notEqual(62,62.5);assert.equal(Math.floor(200*.8),160);
 const s=read(`pastExamAnalysisSources/${packageId}.json`);assert.equal(s.targetReviewStatus,'source-repair-required');assert.deepEqual(s.targets,[]);
 // Source evidence stays unchanged; the missing efficiency prerequisite is explicitly flagged.
 assert.deepEqual(qs.at(-1).prerequisites.weak_subject,['phys-q3-2']);assert.match(s.majorQuestions.at(-1).subquestions.at(-1).note,/\(1\).*\(2\)/);
 assert.deepEqual(qs.reduce((a,q)=>(a[q.difficulty]=(a[q.difficulty]||0)+q.points,a),{}),{'標準レベル':160,'基本レベル':40});
});
test('Nippon early physics: six original assets and retained review gates',()=>{
 const m=read(`pastExamFigures/${packageId}.json`);assert.equal(m.items.length,6);assert.equal(m.restrictedSourceCopied,false);assert.equal(m.review.needsHumanReview,true);
 for(const f of m.items){const svg=fs.readFileSync(new URL(`../public${f.src}`,import.meta.url),'utf8');assert.match(svg,/KaTeX_Main/);assert.match(svg,/KaTeX_Math/);assert.doesNotMatch(svg,/<(?:image|foreignObject|script)\b/);}
 assert.equal(Object.keys(reviewNotices[packageId]).length,3);assert.match(reviewNotices[packageId]['major-question-02'].message,/E₁/);assert.match(analysisReviewNotices[packageId].message,/20/);
 const s=read(`pastExamStagingAnswerSources/${packageId}.json`),keys=s.editorial.pages.flatMap(p=>p.blocks).filter(b=>b.type==='answer_key').flatMap(b=>b.items);
 assert.equal(keys.length,7);assert.equal(keys.map(k=>k.value).join('／').split('／').length,20);assert.equal(s.editorial.provenance,'editorial_adaptation');
 const css=fs.readFileSync(new URL('../src/styles/past-exam-figures.css',import.meta.url),'utf8');assert.ok(css.includes(`img[src^="/assets/past-exams/${packageId}/"] { min-width: 620px; }`));assert.ok(css.includes(`body.is-printing-past-exam-document .past-exam-figure img[src^="/assets/past-exams/${packageId}/"] { max-height: 200mm; max-width: 150mm; width: auto; }`));
});
