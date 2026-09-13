import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {packageId,buoyancy,submergedPeak,separation} from './build-teikyo-2025-physics-figures.mjs';
import {analysisHtmlLocation} from './lib/past-exam-analysis-location.mjs';
import {renderProjection} from './build-past-exam-staging-answers.mjs';
import {unsafeSvgReason} from '../src/lib/svgSafety.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../src/data/'+p,import.meta.url)));
const near=(a,b,e=1e-8)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
test('Teikyo physics: formal pendulum calculation keeps unrounded intermediate values',()=>{
 const L=.5,A=.9,g=9.8,m=10,v=A*Math.sqrt(g/L),K=m*v*v/2;
 near(2*Math.PI*Math.sqrt(L/g),1.4192268951137284);near(v,3.984469852,1e-8);near(K,79.38);near(K*4*5000/4200,378);
 assert.ok(A>L,'given amplitude violates pendulum geometry');assert.equal(Number(K.toPrecision(2)),79);assert.notEqual(m*Number(v.toPrecision(2))**2/2,79);
});
test('Teikyo physics: buoyancy work includes the full initial depth, rejecting 11l/3',()=>{
 near(buoyancy(0),1);near(buoyancy(.25),.75);near(buoyancy(1),0);near(buoyancy(2),0);
 let area=0;for(let i=0;i<10000;i++)area+=buoyancy((i+.5)/10000)/10000;near(area,.5);
 near(submergedPeak(1),1);near(submergedPeak(5/3),3);
 const work=2/3+.5;near(work-(5/3+3)/4,0);assert.ok(Math.abs(work-(5/3+11/3)/4)>.1);
 // Independent stage-energy method: v^2=4gl at top reaching surface, then 6gl at exit.
 near(2*(3*(2/3)+1),6);near(6/2,3);
});
test('Teikyo physics: lens conjugates, radiation units, four-stroke engine',()=>{
 const a=220/11,b=10*a;near(a,20);near(b,200);near(1/(1/a+1/b),200/11);
 near(1/45+1/90,1/30);near((b/a)*(90/45),20);near(4/20,.2);
 const Egamma=364e3*1.6e-19,dose=Egamma*1e8*3600*.4*1.7/(4*Math.PI*70);
 near(Egamma,5.824e-14,1e-25);assert.equal(Number(dose.toPrecision(3)),1.62e-5);assert.ok(dose*1e3>.01&&dose*1e3<.1);
 const stroke=(2460/4)/(3.14*(9.95/2)**2);near(stroke*4,31.6533215,1e-7);near(2000/4,500);
 near(300*10**.4,753.56592945,1e-7);near(1-10**(-.4),.60189282945,1e-8);near(6000/60/2,50);near(250*2*3.14*(6000/60),157000);near(157000/735,213.60544218,1e-7);
});
test('Teikyo physics: repulsive force gives positive separation curvature and return time',()=>{
 const m=1,k=2,F=1,v0=2,R=10,tMin=k*m*v0/((1+k)*F),t0=2*tMin;
 near(separation(0),R);near(separation(t0),R);near(separation(tMin),R-k*m*v0*v0/(2*(1+k)*F));
 assert.ok(separation(tMin-1)>separation(tMin)&&separation(tMin+1)>separation(tMin));
 near(m*(v0-F*t0/m)+k*m*(F*t0/(k*m)),m*v0);
});
test('Teikyo physics: ten safe independent figures, nine question diagrams and one answer graph',()=>{
 const m=read(`pastExamFigures/${packageId}.json`);assert.equal(m.items.length,10);assert.equal(m.restrictedSourceCopied,false);
 for(const f of m.items){const svg=fs.readFileSync(new URL('../public'+f.src,import.meta.url),'utf8');assert.ok(!unsafeSvgReason(svg));assert.match(svg,/KaTeX_Main/);assert.match(svg,/KaTeX_Math/);assert.ok(!/<image|foreignObject/.test(svg));assert.ok(f.alt.length>15);}
 const blank=fs.readFileSync(new URL('../public'+m.items.find(f=>f.id==='q2-force-graph').src,import.meta.url),'utf8');assert.ok(!blank.includes('ρSlg'));assert.ok(!blank.includes('完全に水面から出た後'));
 const s=read(`pastExamStagingAnswerSources/${packageId}.json`),p=renderProjection(s),html=p.document.majorQuestions.map(q=>q.html).join('');
 assert.equal((html.match(/class="past-exam-figure"/g)||[]).length,1);assert.equal((html.match(/data-figure-placeholder/g)||[]).length,0);assert.equal(p.source.independentlyReauthored,false);
 assert.match(m.items.find(f=>f.id==='q6-repulsive-spheres').alt,/直径は2r0/);
});
test('Teikyo physics: combined two-day evidence is retained, not sold as a one-day target',()=>{
 const e=read(`pastExamAnalysisEvidence/${packageId}.json`),d=read(`pastExamAnalysisSources/${packageId}.json`);
 assert.equal(e.majorQuestions.length,6);assert.equal(e.majorQuestions.flatMap(m=>m.subquestions).length,39);
 for(const majors of [e.majorQuestions.slice(0,3),e.majorQuestions.slice(3)])near(majors.flatMap(m=>m.subquestions).reduce((s,q)=>s+q.points,0),50);
 assert.equal(e.targetAnalysis,null);assert.equal(d.targetReviewStatus,'source-repair-required');assert.deepEqual(d.targets,[]);assert.match(d.targetReviewNote,/正規化/);assert.ok(read('pastExamBatch/target-review-holds.json')[packageId]);
 assert.ok(d.majorQuestions.flatMap(m=>m.subquestions).every(q=>q.title.length<25));assert.match(e.source.html,/generated\/public-preview/);
});
test('analysis layout fallback prefers preview-html, supports generated, and never guesses a third layout',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'teikyo-analysis-location-'));
 try{assert.equal(analysisHtmlLocation(dir),'preview-html/public-preview/index.html');for(const variant of ['generated','preview-html']){const file=path.join(dir,variant,'public-preview','index.html');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,'<html></html>');assert.equal(analysisHtmlLocation(dir),variant+'/public-preview/index.html');}}
 finally{assert.ok(path.resolve(dir).startsWith(path.join(path.resolve(os.tmpdir()),'teikyo-analysis-location-')));fs.rmSync(dir,{recursive:true});}
});
