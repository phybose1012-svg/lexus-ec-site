import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,q1,q3,arcBC,maximum,tangentPoint,normal,c1,c2,absoluteLog,g,inverse,area} from './build-kawasaki-medical-2025-mathematics-figures.mjs';
import {reviewNotices,analysisReviewNotices} from '../src/lib/pastExamReviewNotices.mjs';
import {isHandEditedFigure} from './lib/past-exam-figure-handoff.mjs';
import {fileURLToPath} from 'node:url';
const near=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
const integrate=(f,a,b,n=30000)=>{let s=0,h=(b-a)/n;for(let i=0;i<n;i++)s+=h*f(a+(i+.5)*h);return s;};
test('Kawasaki: all circle points, diameter and perpendicular foot satisfy the givens',()=>{
 const {A,B,C,D,E,K,r}=q1;
 for(const [x,y] of [A,B,C,D])near((x-K[0])**2+(y-K[1])**2,r*r);
 for(const [x,y] of [A,C])near(y,2*x+4);for(const [x,y] of [A,B])near(y,-2*x+12);
 near((A[0]+B[0])/2,K[0]);near((A[1]+B[1])/2,K[1]);near(E[0],D[0]);near(E[1],C[1]);
 near((A[0]-C[0])*(B[0]-C[0])+(A[1]-C[1])*(B[1]-C[1]),0);
});
test('Kawasaki: inscribed angles and the positive difference are independently verified',()=>{
 const alpha=Math.atan(.75),beta=Math.atan(.5);assert.ok(alpha>beta&&alpha<Math.PI/2);
 near(Math.tan(alpha-beta),2/11);near(Math.sin(alpha-beta),2*Math.sqrt(5)/25);
 near(Math.hypot(11,2),5*Math.sqrt(5));
});
test('Kawasaki: support point moves along arc C-D-B; outer branches and minimum agree',()=>{
 const pts=arcBC(20000);near(pts[0][0],q1.C[0]);near(pts.at(-1)[0],q1.B[0]);
 assert.ok(pts.some(p=>Math.hypot(p[0]-2,p[1])<.001));
 for(const a of [-12,-5.5,-4,-2,0,.5,3]){
  const numerical=Math.max(...pts.map(([x,y])=>a*x-y),a*q1.A[0]-q1.A[1]);near(numerical,maximum(a),1e-6);
 }
 near(maximum(-5.5),-1);near(maximum(.5),3);near(maximum(-2),-2);
 for(const a of [-5.5,-2,0,.5]){const [x,y]=tangentPoint(a);near((x-4)+a*(y-4),0);near(a*x-y,maximum(a));}
 for(let a=-20;a<20;a+=.03)assert.ok(maximum(a)>=-2-1e-9);
 assert.match(reviewNotices[packageId]['major-question-01'].message,/下へ/);
});
test('Kawasaki: normal is perpendicular and the two log areas use the correct boundaries',()=>{
 near(.5*(-2),-1);near(normal(1),c1(1));near(integrate(x=>normal(x)-c1(x),0,1),2-Math.log(2));
 for(const p of [-2.8,-1,-.5,-.01]){near(c2(1,p),Math.log(2));for(let x=0;x<1;x+=.02)assert.ok(normal(x)>c2(x,p));}
 near(integrate(x=>normal(x)-c2(x,-.5),0,1),(1+Math.log(2))/2);
 // p=-1 is an explicit representative, not the solved p=-1/2.
 assert.notEqual(c2(0,-1),c2(0,-.5));
});
test('Kawasaki: absolute integral needs both pieces and has an interior minimum',()=>{
 for(const a of [.1,.45,(Math.sqrt(5)-1)/2,1]){
  near(integrate(x=>absoluteLog(x,a),0,1),g(a),1e-8);near(absoluteLog(1-a,a),0);
 }
 const a=(Math.sqrt(5)-1)/2;near(a*(a+1),1);near(g(a),Math.log((Math.sqrt(5)+1)/2)+2-Math.sqrt(5));
 assert.ok(Math.log(.4**2+.4)<0&&Math.log(.8**2+.8)>0);
});
test('Kawasaki: farthest point is beyond B, and its distance is six root two',()=>{
 const {A,B,C1,r}=q3;near(Math.hypot(A[0]-B[0],A[1]-B[1]),5*r);
 near(Math.hypot(B[0]-C1[0],B[1]-C1[1]),r);near(Math.hypot(A[0]-C1[0],A[1]-C1[1]),6*r);
 near((C1[0]-B[0])/(B[0]-A[0]),.2);near((C1[1]-B[1])/(B[1]-A[1]),.2);
 let z=[1,0];for(let i=0;i<20;i++)z=[-z[0]-z[1],z[0]-z[1]];assert.deepEqual(z,[-1024,0]);
});
test('Kawasaki: inversion excludes zero and both maximum-area cases split in the ratio 5:7',()=>{
 const {P1,P2,Q1,Q2}=q3,O=[0,0];
 for(const x of [-4,-1,0,1,1.3,2,10]){const y=7*x-10,w=inverse([x,y]);near((w[0]-3.5)**2+(w[1]-.5)**2,12.5);assert.ok(Math.hypot(...w)>0);}
 for(const [p,q,r] of [[P1,Q1,P2],[P2,Q2,P1]]){
  const w=inverse(p);near(w[0],q[0]);near(w[1],q[1]);near(p[1],7*p[0]-10);near(p[0]*q[0]+p[1]*q[1],0);
  near(area(O,p,q),5);near(area(O,p,r)/area(p,r,q),5/7);
 }
 // The source's theta=abs(2arg z) is not a global angle formula.
 const t=Math.atan2(-17,-1);assert.ok(Math.abs(2*t)>Math.PI);
 near(area(O,[-1,-17],inverse([-1,-17])),5*Math.abs(Math.sin(2*t)));
});
test('Kawasaki: source provisional targets reproduce 11/62 without approving the 60-minute judgment model',()=>{
 const pts=[10,10,14,11,11,11,11,11,11],ex=[7,8,14,8,11,13,7,7,16];
 const solve=weak=>{let best=0;for(let mask=0;mask<512;mask++){
  if(mask&256)continue;if(weak&&(mask&(4|16|32)))continue;
  if((mask&2||mask&4)&&!(mask&1))continue;if(mask&16&&!(mask&8))continue;
  let p=0,t=weak?60:15;for(let i=0;i<9;i++)if(mask&(1<<i)){p+=pts[i];t+=ex[i]*(weak?1.5:1);}
  if(t<=80)best=Math.max(best,p);
 }return best;};
 assert.equal(solve(true),11);assert.equal(solve(false),78);assert.equal(Math.floor(78*.8),62);assert.equal(60+10.5*2,81);
 assert.match(analysisReviewNotices[packageId].message,/合格に必要な点数ではありません/);
});
test('Kawasaki: all eight registered originals preserve review, fonts, safe assets and print constraints',()=>{
 const m=JSON.parse(read(`../src/data/pastExamFigures/${packageId}.json`));assert.equal(m.items.length,8);assert.equal(m.restrictedSourceCopied,false);assert.equal(m.review.needsHumanReview,true);
 const front=fileURLToPath(new URL('..',import.meta.url));
 for(const f of m.items){const s=read('../public'+f.src);assert.doesNotMatch(s,/<image\b|<foreignObject\b|<script\b/);
  if(!isHandEditedFigure(front,packageId,f.id)){assert.match(s,/KaTeX_Main/);assert.match(s,/KaTeX_Math/);assert.match(s,/role="img"/);}assert.ok(f.alt.length>20);
 }
 const answer=JSON.parse(read(`../src/data/generated/pastExamAnswers/${packageId}.json`)).document.majorQuestions.map(q=>q.html).join('');assert.equal((answer.match(/data-figure-id=/g)||[]).length,8);assert.doesNotMatch(answer,/data-figure-placeholder/);
 assert.ok(read('../src/styles/past-exam-figures.css').includes(`${packageId}/"] { max-height: 200mm; max-width: 150mm; width: auto; }`));
});
