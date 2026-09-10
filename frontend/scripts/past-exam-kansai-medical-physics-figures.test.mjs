import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,intervalsCm,totalCm,fitIntervals,dcOrbit,blankAxes} from './build-kansai-medical-2025-physics-figures.mjs';
import {reviewNotices,analysisReviewNotices} from '../src/lib/pastExamReviewNotices.mjs';
const near=(a,b,e=1e-8)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url)));
test('Kansai physics: measured cumulative/interval distances and timing agree',()=>{
 const expected=[0,2,5.5,10.5,17.1,25.1,34.8,46,58.8,72.9,88.7];
 expected.forEach((x,i)=>near(totalCm[i],x));
 for(let i=0;i<10;i++)near(totalCm[i+1]-totalCm[i],intervalsCm[i]);
 near(1/50,.02);near(totalCm[1]/100/.04,.5);near(totalCm[4]/100/.16,1.06875);
});
test('Kansai physics: interval fit uses the data, not an invented g=9.8 line',()=>{
 const {slope,intercept}=fitIntervals();
 near(intervalsCm.reduce((s,y,i)=>s+y-(intercept+slope*(i+1)),0),0);
 near(intervalsCm.reduce((s,y,i)=>s+(i+1)*(y-intercept-slope*(i+1)),0),0);
 assert.ok(slope>1.5&&slope<1.6);
 const a=(.158-.02)/9/.04**2;near(a,9.58333333333,1e-7);
 assert.notEqual(Number(a.toPrecision(2)),9.8);
});
test('Kansai physics: incompatible zero-initial-speed model remains explicitly gated',()=>{
 const t=.04,a=9.6;assert.ok(a*t<.02/t);assert.ok(.5*a*t*t<.02);
 assert.match(reviewNotices[packageId]['major-question-01'].message,/整合しない/);
});
test('Kansai physics: positive charge in +z field turns clockwise, first x-axis force is -x',()=>{
 const cross=([x,y,z],[u,v,w])=>[y*w-z*v,z*u-x*w,x*v-y*u];
 assert.deepEqual(cross([1,0,0],[0,0,1]),[0,-1,0]);
 const force=cross([0,-1,0],[0,0,1]);near(force[0],-1);near(force[1],0);
 assert.match(reviewNotices[packageId]['major-question-02'].message,/原本ではx軸/);
});
test('Kansai physics: DC orbit has exactly three clockwise semicircles and four crossings',()=>{
 for(const r0 of [.4,1,2])for(const gain of [.05,.4,1]){
  const rp=r0+gain,{arcs,crossings}=dcOrbit(r0,rp);assert.equal(arcs.length,3);assert.equal(crossings.length,4);
  arcs.forEach((a,i)=>{near(a.cy+a.radius*Math.sin(a.a),crossings[i]);near(a.cy+a.radius*Math.sin(a.b),crossings[i+1]);near(Math.cos(a.a),0);near(Math.cos(a.b),0);near(a.a-a.b,Math.PI);});
  near(arcs[0].radius,arcs[2].radius);assert.ok(arcs[0].radius>arcs[1].radius);
  // q=B=m=1: entering D2 adds V=(rp²-r0²)/2, returning to D1 removes it.
  const V=(rp*rp-r0*r0)/2;near(Math.sqrt(r0*r0+2*V),rp);near(Math.sqrt(rp*rp-2*V),r0);
 }
});
test('Kansai physics: answer axes contain no solution curve or directional force',()=>{
 const svg=blankAxes();assert.doesNotMatch(svg,/<path|class="blue"|class="gold"/);assert.equal((svg.match(/<circle/g)||[]).length,1);assert.equal((svg.match(/<line/g)||[]).length,2);
});
test('Kansai physics: double Doppler inversion and signed thickness change',()=>{
 const c=1500,f0=1000,v1=3,v2=1,T=.8;
 const f=v=>(c+v)/(c-v)*f0,inv=f=>(f-f0)/(f+f0)*c;
 near(inv(f(v1)),v1);near(inv(f(v2)),v2);assert.ok(f(v1)>f(v2));
 near((v2-v1)*T/2,-.8);near((v1-v2)*T/2,.8);
 // Thin spherical shell: outward inner velocity is larger at equal volume rate.
 const ri=3,ro=4;near(ri*ri*v1,ro*ro*(ri/ro)**2*v1);
 assert.match(reviewNotices[packageId]['major-question-03'].message,/減少量/);
});
test('Kansai physics: isotope balance and specified approximate logarithms are distinct',()=>{
 near(72-1,71);near(176+0,176);
 const fromGiven=372*(2.04-2)/.301,precise=372*Math.log2(1.09);
 assert.equal(Number(fromGiven.toPrecision(2)),49);assert.ok(precise>46&&precise<47);
 assert.match(reviewNotices[packageId]['major-question-04'].message,/71/);
});
test('Kansai physics: target dependency failure is not silently removed',()=>{
 const status=read('../src/data/pastExamBatch/status.json').packages.find(p=>p.id===packageId);
 assert.equal(status.analysis,'targets-deferred');assert.ok(status.issues.some(i=>i.message?.includes('phys-q1-4: requires absent phys-q1-3')));
 assert.match(analysisReviewNotices[packageId].message,/前提小問/);
 assert.ok(62.2>60);
});
test('Kansai physics: all six editable originals retain provenance, fonts and print limits',()=>{
 const m=read(`../src/data/pastExamFigures/${packageId}.json`);assert.equal(m.items.length,6);assert.equal(m.restrictedSourceCopied,false);assert.equal(m.review.needsHumanReview,true);
 for(const f of m.items){const svg=fs.readFileSync(new URL('../public'+f.src,import.meta.url),'utf8');assert.match(svg,/KaTeX_Main/);assert.match(svg,/KaTeX_Math/);assert.doesNotMatch(svg,/<image|<foreignObject|<script|https?:\/\/(?!www.w3.org)/);assert.ok(f.alt.length>20);}
 const css=fs.readFileSync(new URL('../src/styles/past-exam-figures.css',import.meta.url),'utf8');assert.ok(css.includes(`${packageId}/"] { max-height: 200mm; max-width: 150mm; width: auto; }`));
});
test('Kansai physics: image replacement keeps the measurement table exactly once',()=>{
 const q=read(`../src/data/generated/pastExamQuestions/${packageId}.json`).document.questions.find(q=>q.id==='major-question-01');
 assert.equal((q.html.match(/<table\b/g)||[]).length,1);assert.equal((q.html.match(/<tr\b/g)||[]).length,12);
 for(const value of ['17.1','34.8','88.7','15.8'])assert.ok(q.html.includes(value));
 assert.ok(q.html.includes('q1-apparatus-tape.svg'));assert.ok(q.html.includes('q1-interval-graph.svg'));
});
