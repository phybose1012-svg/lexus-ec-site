import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {circle,circlePoint,contactSpeedSquared,pv,adiabatic,optics,wavePoint,ray} from './build-hyogo-2025-physics-figures.mjs';
import {withReviewNotice} from '../src/lib/pastExamReviewNotices.mjs';
const near=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
test('Hyogo tilted circle maintains radius, rod normal, and P/Q height difference',()=>{
 const normal=[-Math.sin(circle.beta),0,Math.cos(circle.beta)];
 for(let i=0;i<36;i++){const p=circlePoint(i*Math.PI/18,circle.beta);near(Math.hypot(...p),circle.r);near(p.reduce((s,x,j)=>s+x*normal[j],0),0);}
 near(circlePoint(0,circle.beta)[2]-circlePoint(Math.PI,circle.beta)[2],2*circle.r*Math.sin(circle.beta));
});
test('Hyogo contact limit contains tan squared, unlike the source answer',()=>{
 const alpha=Math.PI/3,beta=.1,v2=contactSpeedSquared(1,1,alpha,beta);
 near(Math.sin(alpha-beta)/Math.sin(alpha)-v2/Math.tan(alpha)**2,0);
 near(contactSpeedSquared(1,1,alpha),Math.tan(alpha)**2);
 const boundary=Math.atan(Math.tan(alpha)/6);
 near(contactSpeedSquared(1,1,alpha,boundary),5*Math.tan(alpha)*Math.sin(boundary));
});
test('Hyogo p–V cycle preserves adiabats and positive clockwise engine work',()=>{
 const pc=adiabatic(pv.b,pv.a**pv.gamma),pd=adiabatic(pv.b,1);
 near(pc*pv.b**pv.gamma,pv.a**pv.gamma);near(pd*pv.b**pv.gamma,1);assert.ok(pc>pd&&pc<1);
 const eta=1-(pv.a**pv.gamma-1)/((pv.a-1)*pv.gamma*pv.b**(pv.gamma-1));assert.ok(eta>0&&eta<1);
});
test('Hyogo wavefront endpoints, symmetry and normals follow travel time and Snell',()=>{
 const {elapsed:t,n0,n1}=optics,max=Math.acos(1-t/n0),p=wavePoint(max);
 near(p[0],t/n0);near(p[1],Math.sqrt((2-t/n0)*t/n0));near(wavePoint(0)[0],t/n1);
 for(let i=1;i<50;i++){
  const angle=max*i/50,a=wavePoint(angle),b=wavePoint(-angle);near(a[0],b[0]);near(a[1],-b[1]);
  const e=1e-6,lo=wavePoint(angle-e),hi=wavePoint(angle+e),dir=-angle+Math.asin(n0/n1*Math.sin(angle));
  near((hi[0]-lo[0])/(2*e)*Math.cos(dir)+(hi[1]-lo[1])/(2*e)*Math.sin(dir),0,1e-7);
 }
});
test('Hyogo ray focuses converge to both paraxial expressions, CD stays positive',()=>{
 const {a,n0,n1}=optics,r=ray(1e-4);
 near(r.F[0],n1*a/(n1-n0),1e-6);near(r.trueF[0],a*(1+n0*n0/(n1*(n1-n0))),1e-6);
 assert.ok(r.D[1]>0&&r.trueF[0]<r.F[0]);near(n1*Math.sin(.0001-r.theta1),n0*Math.sin(r.theta2));
});
test('Hyogo keeps uncertain electron mapping pending and answer wave out of question frame',()=>{
 const m=JSON.parse(fs.readFileSync(new URL('../src/data/pastExamFigures/hyogo-medical-2025-general-a-b-physics.json',import.meta.url)));
 assert.equal(m.items.length,9);assert.ok(!m.items.some(x=>x.id==='q2-figure-2'));assert.equal(m.restrictedSourceCopied,false);
 const blank=fs.readFileSync(new URL('../public'+m.items.find(x=>x.id==='q4-answer-frame').src,import.meta.url),'utf8');
 assert.doesNotMatch(blank,/class="accent"/);assert.doesNotMatch(blank,/>R<\/tspan>/);
 const original='<h2>問</h2><p>unchanged</p>',id=m.packageId;
 for(const n of['01','02','04'])assert.match(withReviewNotice(original,id,'major-question-'+n),/data-source-review="required"/);
 for(const n of['03','05'])assert.equal(withReviewNotice(original,id,'major-question-'+n),original);
});
