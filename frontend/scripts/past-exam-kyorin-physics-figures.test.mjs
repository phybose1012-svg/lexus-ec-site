import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,choiceValue,mechanics,bridge,diodeCurrent} from './build-kyorin-2025-general-physics-figures.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL(`../src/data/${p}`,import.meta.url)));
const close=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
test('Kyorin physics: nuclear conversion, momentum partition, significant digits and half-life',()=>{
 const u=1e-3/6.02e23;close(u/1e-27,1.6611295681,1e-9);const roundedU=1.66e-27,c=3e8,e=1.6e-19,defect=1.00728+1.00866-2.01356;close(defect,.00238);const binding=defect*roundedU*c*c/(1e6*e);assert.equal(binding.toFixed(2),'2.22');
 const massLoss=13.99925+1.00866-13.99996-1.00728;close(massLoss,.00067);const energy=massLoss*roundedU*c*c/(1e6*e),share=energy*1.00728/(13.99996+1.00728);assert.equal(energy.toPrecision(2),'0.63');assert.equal(share.toPrecision(2),'0.042');close(share/(energy-share),1.00728/13.99996);close((.3+.48)/.3*15,39);close(.5**(30/15),.25);
});
test('Kyorin physics: graph choices retain phase, sign, zeros and label order',()=>{
 // The triangle has 2.5 cycles over 0..5π, not the 5 arches of choice ②.
 close(choiceValue(3,0),.9);close(choiceValue(3,Math.PI),.25);close(choiceValue(3,2*Math.PI),.9);close(choiceValue(3,5*Math.PI),.25);
 close(choiceValue(2,0),.65);close(choiceValue(2,Math.PI/2),0);close(choiceValue(5,0),.4);assert.ok(choiceValue(5,.1)>choiceValue(5,0));close(choiceValue(6,Math.PI),0);assert.ok(choiceValue(4,.01)>choiceValue(4,0));for(let i=0;i<501;i++)for(let n=1;n<=6;n++)assert.ok(choiceValue(n,i*Math.PI/100)>=-1e-9);
 const s=fs.readFileSync(new URL(`../public/assets/past-exams/${packageId}/figures/q2-graph-choices.svg`,import.meta.url),'utf8');for(const c of ['①','②','③','④','⑤','⑥'])assert.equal(s.split(`>${c}</text>`).length-1,1);
});
test('Kyorin physics: center of mass and shifted relative equilibrium include friction',()=>{
 for(const alpha of [.4,1,3]){const m=2,k=20,L=3,mu=.4,muPrime=.2,g=10;for(const r of [2,3,3.1,4]){const a=mechanics(m,alpha,k,L,mu,muPrime,g,r);close(a.centerAcceleration,-muPrime*alpha*g/(1+alpha));close(a.relativeAcceleration,-a.omega2*(r-a.relativeCenter));close(k*(a.release-L),mu*alpha*m*g);assert.ok(a.relativeCenter>L);}
 // Stretched spring does not alone imply B accelerates positively.
 assert.ok(mechanics(m,alpha,k,L,mu,muPrime,g,L+.001).aB<0);
 const a=alpha*2,b=2;close(m*g*a,alpha*m*g*b);const W=1,beta=.5,D=W/(muPrime*alpha*m*g),amp=L*Math.sqrt((1-beta)**2-2*W/(k*L*L));close(muPrime*alpha*m*g*D,W);close(.5*k*(L-beta*L)**2-.5*k*amp**2,W);
 }
});
test('Kyorin physics: off/on diode, bridge node equations and nonideal load line',()=>{
 const off=bridge(1);close(off.current,0);close(off.b-off.a,-1.2);close(off.I1+off.I3,2.8);close(bridge(2).current,0);assert.ok(bridge(2.01).current>0);
 const ideal=bridge(7);close(ideal.current,.6);close(ideal.a,ideal.b);
 const real=bridge(12,.5,50/3);close(real.current,.15);close(real.b-real.a,3);close(diodeCurrent(real.b-real.a),real.current);close(diodeCurrent(.5),0);close(diodeCurrent(1),.03);
 for(const s of [off,ideal,real]){close(s.I1+s.current,s.I2);close(s.I3-s.current,s.I4);close(s.I1+s.I3,s.I2+s.I4);}close(5*real.current+real.b-real.a,15/4);
});
test('Kyorin physics: source keys remain imported, not silently patched to match defective choices',()=>{
 const e=read(`pastExamStagingAnswerSources/${packageId}.json`).editorial,keys=e.pages.flatMap(p=>p.blocks).filter(b=>b.type==='answer_key').flatMap(b=>b.items);
 assert.equal(keys.length,12);assert.equal(keys[5].value,'キ ⑦／ク ⓪／ケ ⓪／コ ⑤／サ ④／シ ⓪／ス ⑧');assert.equal(keys.at(-1).value,'ツテ 15');assert.equal(e.provenance,'editorial_adaptation');assert.equal(e.review.needs_human_review,true);
});
test('Kyorin physics: both prerequisite failures retain deferred targets and provisional distribution',()=>{
 const e=read(`pastExamAnalysisEvidence/${packageId}.json`),s=read(`pastExamAnalysisSources/${packageId}.json`),qs=e.majorQuestions.flatMap(m=>m.subquestions);assert.equal(qs.length,12);assert.equal(qs.reduce((a,q)=>a+q.points,0),75);assert.equal(e.targetAnalysis,null);assert.equal(s.targetReviewStatus,'source-repair-required');
 for(const [profile,key,actions] of [['weak_subject','weak',['今解く！','後回し']],['strong_subject','strong',['今解く！']]]){const selected=qs.filter(q=>actions.includes(q[key])),ids=selected.map(q=>q.id),bad=selected.flatMap(q=>q.prerequisites[profile].filter(id=>!ids.includes(id)).map(id=>[q.id,id]));assert.deepEqual(bad,[['phys-q2-c','phys-q2-b']]);}
 const counts={};for(const q of qs)counts[q.difficulty]=(counts[q.difficulty]??0)+q.points;assert.equal(Object.values(counts).reduce((a,b)=>a+b,0),75);
});
test('Kyorin physics: all eight self-contained SVGs are deployed; source review gates remain visible',()=>{
 const m=read(`pastExamFigures/${packageId}.json`);assert.equal(m.items.length,8);assert.equal(m.restrictedSourceCopied,false);assert.equal(m.review.needsHumanReview,true);
 for(const x of m.items){const svg=fs.readFileSync(new URL(`../public${x.src}`,import.meta.url),'utf8');assert.match(svg,/KaTeX_Main/);assert.match(svg,/KaTeX_Math/);assert.match(svg,new RegExp(`viewBox="0 0 ${x.width} ${x.height}"`));assert.doesNotMatch(svg.replace(/<style>[\s\S]*?<\/style>/g,''),/<image|foreignObject|NaN|[≤≥]/);assert.equal(svg,fs.readFileSync(new URL(`../dist${x.src}`,import.meta.url),'utf8'));}
 for(const [role,count]of[['questions',4],['answers',4],['analysis',0]]){const h=fs.readFileSync(new URL(`../dist/past-exam-library/kyorin/2025/physics/${role}/index.html`,import.meta.url),'utf8');assert.equal((h.match(/data-figure-id=/g)||[]).length,count);assert.equal((h.match(/<h1\b/g)||[]).length,1);assert.match(h,/noindex/);assert.equal((h.match(/data-source-review="required"/g)||[]).length,role==='analysis'?1:3);}
});
