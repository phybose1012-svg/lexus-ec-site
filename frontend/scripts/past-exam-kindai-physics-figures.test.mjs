import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,springGeometry,ringPoints,magneticMotion,isotopeCandidates,focusingGeometry} from './build-kindai-2025-general-first-a-physics-figures.mjs';
import {reviewNotices,analysisReviewNotices} from '../src/lib/pastExamReviewNotices.mjs';
const near=(a,b,eps=1e-9)=>assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const diff=(a,b)=>a.map((v,i)=>v-b[i]);
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
test('Kindai physics: the two right triangles preserve Q on y and distinct O/O-prime',()=>{
 const {O,Op,Q,P,R,t1,t2}=springGeometry();near(dot(diff(O,P),diff(Q,P)),0,1e-8);near(dot(diff(Op,R),diff(Q,R)),0,1e-8);near(Q[0],O[0]);assert.notEqual(Op[1],O[1]);
 near(Math.atan2(O[0]-P[0],O[1]-P[1]),t1);near(Math.atan2(R[0]-Op[0],Op[1]-R[1]),t2);
 assert.ok(P[1]>Q[1]&&R[1]>Q[1]);
});
test('Kindai physics: spring magnitudes, signed sum, and long-spring approximation are different',()=>{
 const k=3,l=.2,x1=1,x2=3,x3=6,F1=-k*(x2-x1-l),F2=k*(x3-x2-l);assert.ok(F1<0&&F2>0);near(F1+F2,k*(x1+x3)-2*k*x2);
 // A fixed nonzero angle remains nonzero as l / length tends to zero.
 for(const a of [.3,.8]){const length=100,natural=.001;near(k*(length-natural)*Math.sin(a)/(k*length*Math.sin(a)),1-natural/length);assert.ok(Math.sin(a)>.2);}
});
test('Kindai physics: ring geometry and linear restoring coefficient',()=>{
 for(const theta of [.03,.1,.5]){const r=2,k=4,pout=1,pin0=pout+2*k*(1-Math.cos(theta))/theta;const pts=ringPoints(r,theta);near(pts[0][1],r*Math.cos(theta));near(pts[1][1],r);near(pts[2][1],pts[0][1]);near(pts[0][0],-pts[2][0]);
 const force=x=>-2*k*x*(1-Math.cos(theta))+(pin0*(r/x)**2-pout)*x*theta;near(force(r),0);const h=1e-5;near((force(r+h)-force(r-h))/(2*h),-2*pin0*theta,1e-8);}
});
test('Kindai physics: magnetic arc, tangent and electric displacement pass independent checks',()=>{
 for(const v0 of [4,7,12]){const m=2,q=1,B=1,E=1.5,d=2,L=8,p=magneticMotion({m,q,B,E,v0,d,L});near(p.R*Math.sin(p.phi),d);near(p.l/p.R,p.phi);near(p.vx*p.vx+p.vz*p.vz,v0*v0);near(q*v0*B,m*v0*v0/p.R);near(p.z2,p.vz*L/p.vx);near(p.y1,.5*q*E/m*p.t*p.t);near(p.y2,q*E*L*p.l/(m*v0*v0*Math.cos(p.phi)));assert.ok(p.y1>0&&p.y2>0&&p.z1>0);}
 assert.throws(()=>magneticMotion({d:9}));
 // Omitting l is dimensionally wrong and fails this scaling identity.
 const p=magneticMotion();assert.notEqual(p.y2,8/(2*4*4*Math.cos(p.phi)));
});
test('Kindai physics: isotope options retain distinct relations without answer emphasis',()=>{
 assert.deepEqual(isotopeCandidates.points.map(p=>p[0]),['ア','イ','ウ','エ','オ','カ','キ','ク']);
 const on=isotopeCandidates.points.filter(([,z,y])=>Math.abs(y-z*z)<1e-9).map(([n])=>n);assert.deepEqual(on,['イ','キ']);
 const f=Object.fromEntries(isotopeCandidates.curves);near(f['コ'](0),0);near(f['サ'](0),0);assert.ok(f['コ'](1)>1&&f['サ'](1)<1);assert.ok(f['ケ'](0)>0);near(f['シ'](.34),0);
 const m=2,q=1,E=3,B=4,d=.01,L=40,v=30,z=q*B*d*L/(m*v),y=q*E*d*L/(m*v*v);near(y,m*E*z*z/(q*B*B*d*L));
});
test('Kindai physics: focusing schematic has two distinct bends and one intersection',()=>{
 const g=focusingGeometry();assert.ok(g.theta>g.thetaFast&&g.thetaFast>0);assert.ok(g.phi>g.phiFast&&g.phiFast>0);assert.notDeepEqual(g.P,g.Q);assert.ok(g.F[0]>g.Q[0]);
});
test('Kindai physics: all 13 stable slots are original, editable and review-gated',()=>{
 const m=JSON.parse(read(`../src/data/pastExamFigures/${packageId}.json`));assert.equal(m.items.length,13);assert.equal(new Set(m.items.map(i=>i.id)).size,13);assert.equal(m.restrictedSourceCopied,false);
 for(const item of m.items){const s=read(`../public${item.src}`);assert.match(s,/aria-labelledby="title"/);assert.doesNotMatch(s,/<(?:image|foreignObject|script)\b/);assert.equal((s.match(/data:font\/woff2;base64/g)||[]).length,2);}
 assert.equal(Object.keys(reviewNotices[packageId]).length,2);assert.ok(analysisReviewNotices[packageId]);
 const a=JSON.parse(read(`../src/data/pastExamAnalysisSources/${packageId}.json`));assert.equal(a.targetReviewStatus,'source-repair-required');assert.deepEqual(a.targets,[]);
});

test('Kindai physics: math glyphs and Japanese annotations use their separate font faces',()=>{
 const m=JSON.parse(read(`../src/data/pastExamFigures/${packageId}.json`));
 for(const item of m.items){const s=read(`../public${item.src}`);assert.doesNotMatch(s,/<tspan\b[^>]*>[\s\S]*?[ぁ-んァ-ン一-龠][^<]*<\/tspan>/);}
 const s=read(`../public/assets/past-exams/${packageId}/figures/q2-apparatus-diagrams.svg`);
 assert.match(s,/>ϕ<\/tspan>/);assert.match(s,/>D<\/tspan>/);assert.doesNotMatch(s,/>φ<\/tspan>/);
});

test('Kindai physics: tall figures remain legible without widening the whole mobile page',()=>{
 const css=read('../src/styles/past-exam-figures.css');
 assert.ok(css.includes(`[data-past-exam-package="${packageId}"] .past-exam-figure { overflow-x: auto; }`));
 const screen=css.slice(css.indexOf('@media screen'),css.indexOf('@media print'));
 assert.ok(screen.includes(`/assets/past-exams/${packageId}/`));assert.match(screen,/min-width: 560px/);
 const print=css.slice(css.indexOf('@media print'));assert.ok(print.includes(`/assets/past-exams/${packageId}/`));assert.match(print,/max-height: 200mm/);assert.doesNotMatch(print,/min-width: 560px/);
});

test('Kindai physics: both rendered documents expose the package scope used by the figure scroller',()=>{
 for(const mode of ['questions','answers']){
  const html=read(`../dist/past-exam-library/kindai/2025/physics/${mode}/index.html`);
  const main=html.match(/<main\b[^>]*>/)?.[0];
  assert.ok(main?.includes(`data-past-exam-package="${packageId}"`),`${mode}: figure overflow rules must match the rendered page`);
 }
});
