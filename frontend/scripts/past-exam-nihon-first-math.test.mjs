import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {reviewNotices,analysisReviewNotices} from '../src/lib/pastExamReviewNotices.mjs';
import {packageId,triangleGeometry,squareGeometry,logCurve,tangent,washer} from './build-nihon-u-2025-n-unified-first-mathematics-figures.mjs';
const close=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
const sub=(a,b)=>a.map((v,i)=>v-b[i]),dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const integrate=(f,a,b,n=40000)=>{let s=0;for(let i=0;i<n;i++)s+=f(a+(i+.5)*(b-a)/n);return s*(b-a)/n;};
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url)));
test('Nihon I: endpoints, two completions of square, logarithm and complex argument',()=>{
 for(const x of [-2,-1,0,3,3.01,7.99,8,9]){const A=-x-5<=-3*x+1&&-3*x+1<3-x,U=x*x-7*x-8<0;assert.equal(U&&!A,x>3&&x<8);}
 for(const a of [-3,0,.5,2])for(const x of [-4,0,a,7])close(x*x-2*a*x+a+1,(x-a)**2-(a-.5)**2+1.25);
 assert.equal(Math.floor(30*(1+.4771))+1,45);
 const re=-6,im=6*Math.sqrt(3),real=(re+im)/2,imag=(im-re)/2;
 close(Math.hypot(real,imag),6*Math.SQRT2);close(Math.atan2(imag,real),5*Math.PI/12);
 close(Math.atan(3/7)+Math.atan(2/5),Math.PI/4);
});
test('Nihon II: enumerate all unordered ball pairs',()=>{
 const balls=[...Array(3).fill('R'),...Array(4).fill('B'),...Array(5).fill('W')];let all=0,diff=0,red=0;
 for(let i=0;i<12;i++)for(let j=i+1;j<12;j++){all++;if(balls[i]!==balls[j]){diff++;if(balls[i]==='R'||balls[j]==='R')red++;}}
 assert.deepEqual([all,diff,red],[66,47,27]);
});
test('Nihon III: exact triangle lengths, two altitudes and orthocenter coefficients',()=>{
 const {O,A,B,H,P,F}=triangleGeometry(),OA=sub(A,O),OB=sub(B,O);
 close(dot(OA,OA),9);close(dot(OB,OB),4);close(dot(OA,OB),3);close(H[0]/B[0],6/7);
 close(dot(sub(P,A),OB),0);close(dot(sub(P,O),sub(B,A)),0);close(dot(sub(F,A),OB),0);
 for(let i=0;i<2;i++){close(P[i]-O[i],OA[i]/9+OB[i]*2/3);close(P[i]-O[i],(H[i]-O[i])*7/9);}
 assert.ok(F[0]>O[0]&&F[0]<B[0]&&P[1]>0&&P[1]<O[1]);
});
test('Nihon IV: signed distance and inclusive lattice point enumeration',()=>{
 for(let z=1;z<2;z+=.01)assert.ok(Math.abs(z*z-2*z)<=1);
 assert.equal(101**2-2*101,9999);assert.ok(2**6<101&&101<2**7);
 let count=0;for(let k=1;k<=6;k++)for(let y=2**(k+1);y<=4**k;y++)count++;
 assert.equal(count,5214);
});
test('Nihon V: every square, similarity, finite and infinite sums',()=>{
 for(const a of [.3,1,2])for(let k=0;k<6;k++){
  const g=squareGeometry(a,k),next=squareGeometry(a,k+1);
  close(g.A[0]-g.nextA[0],g.nextB[1]);close(g.nextB[1],g.C[1]);close(g.C[0],g.A[0]);close(next.area/g.area,1/3);
 }
 const total=n=>Array.from({length:n+1},(_,k)=>squareGeometry(1,k).area).reduce((a,b)=>a+b,0);
 close(total(7)/total(3),82/81);close(total(60),2-Math.sqrt(3));
 const a=(Math.sqrt(6)+Math.sqrt(2))/2;close((2-Math.sqrt(3))*a*a,1);
});
test('Nihon VI: tangent, shaded area and annular (not disk) sections',()=>{
 const e2=Math.E**2;close(logCurve(e2),4);close(2*Math.log(e2)/e2,4/e2);
 for(let x=1;x<=e2;x+=.05)assert.ok(tangent(x)>=logCurve(x)-1e-12);
 close(integrate(tangent,0,e2)-integrate(logCurve,1,e2),2,1e-8);
 for(const y of [.1,1,2,3.9]){const {outer,inner}=washer(y);assert.ok(outer>inner&&inner>0);close(logCurve(outer),y);close(tangent(inner),y);}
 // y=u² removes the integrable derivative singularity at y=0.
 close(integrate(u=>{const w=washer(u*u);return 2*u*Math.PI*(w.outer**2-w.inner**2);},0,2),Math.PI*(Math.E**4/6+.5),1e-7);
});
test('Nihon targets: all 262144 subsets, time rounding, replacements and prerequisites',()=>{
 const ev=read(`../src/data/pastExamAnalysisEvidence/${packageId}.json`),qs=ev.majorQuestions.flatMap(m=>m.subquestions),ids=qs.map(q=>q.id);
 const points=[6,5,5,6,5,6,5,6,7,4,5,7,5,6,6,5,5,6],scan=[.4,.3,.3,.4,.3,.4,.3,.6,.7,.4,.5,.7,.9,.5,.5,.5,.5,.7],exec=[2.1,1.7,1.2,3.1,1.2,2.6,1.7,3.9,4.3,1.6,1.5,4.3,2.6,3,3,2.6,3.4,4.4];
 assert.deepEqual(qs.map(q=>q.points),points);assert.equal(qs.length,18);
 for(const p of ev.targetAnalysis.profiles){const weak=p.id==='weak',round=x=>Math.round((x+Number.EPSILON)*10)/10,judgment=round(scan.reduce((s,x)=>s+round(x*(weak?4:1)),0));close(judgment,p.scanMinutes);
  const allowed=qs.map(q=>q[p.id]!=='捨てる！'),required=qs.map(q=>q.prerequisites[`${p.id}_subject`].map(id=>ids.indexOf(id)));let best={points:-1,minutes:Infinity};
  for(let mask=0;mask<2**18;mask++){let pts=0,time=judgment,valid=true;const selected=[];
   for(let i=0;i<18;i++)if(mask&(1<<i)){if(!allowed[i]||required[i].some(j=>!(mask&(1<<j)))){valid=false;break;}pts+=points[i];time+=round(exec[i]*(weak?1.5:1));selected.push(ids[i]);}
   time=round(time);if(valid&&time<=60&&(pts>best.points||pts===best.points&&time<best.minutes))best={points:pts,minutes:time,questionIds:selected};
  }close(best.points,p.maximum.points);close(best.minutes,p.maximum.minutes);
  // Equal-point/equal-time optima need not have a unique ID set. Validate the saved optimum too.
  const picked=p.maximum.questionIds.map(id=>ids.indexOf(id));assert.ok(picked.every(i=>i>=0&&allowed[i]&&required[i].every(j=>picked.includes(j))));
  close(picked.reduce((s,i)=>s+points[i],0),best.points);close(round(judgment+picked.reduce((s,i)=>s+round(exec[i]*(weak?1.5:1)),0)),best.minutes);
  close(p.targetPoints,weak?best.points:Math.floor(best.points*.8));
 }
});
test('Nihon figure manifest: three original slots with local math fonts and review retained',()=>{
 const m=read(`../src/data/pastExamFigures/${packageId}.json`);
 assert.deepEqual(m.items.map(x=>x.id),['ans-q3-triangle','ans-q5-square-series','ans-q6-rotation-region']);assert.equal(m.restrictedSourceCopied,false);assert.equal(m.review.needsHumanReview,true);
 for(const f of m.items){const svg=fs.readFileSync(new URL(`../public${f.src}`,import.meta.url),'utf8');assert.match(svg,/KaTeX_Main/);assert.match(svg,/KaTeX_Math/);assert.doesNotMatch(svg,/<(?:image|foreignObject|script)\b/);assert.ok(f.alt.length>30);}
});
test('Nihon editorial coverage: 53 answer slots, 17 printed parts, 18 assessment units and gates',()=>{
 const snapshot=read(`../src/data/pastExamStagingAnswerSources/${packageId}.json`),keys=snapshot.editorial.pages.flatMap(p=>p.blocks).filter(b=>b.type==='answer_key').flatMap(b=>b.items);
 assert.equal(keys.length,17);const entries=keys.flatMap(k=>k.value.split('／').map(s=>s.trim().split(/\s+/).map(Number)));
 assert.deepEqual(entries.map(x=>x[0]),Array.from({length:53},(_,i)=>i+1));
 assert.deepEqual(entries.map(x=>x[1]),[3,8,5,4,4,5,6,2,5,1,2,1,4,4,7,6,6,2,7,4,7,6,7,1,9,2,3,1,0,1,6,1,5,2,1,4,3,3,8,2,8,1,6,2,2,2,4,2,1,6,4,1,2]);
 const ev=read(`../src/data/pastExamAnalysisEvidence/${packageId}.json`),a=read(`../src/data/pastExamAnalysisSources/${packageId}.json`);
 assert.equal(a.majorQuestions.flatMap(m=>m.subquestions).length,18);assert.match(a.summary,/17小問/);assert.match(a.summary,/18項目/);assert.deepEqual(a.examTotal,{points:400,subjectCount:4});
 assert.deepEqual(ev.majorQuestions.map(m=>m.subquestions.reduce((s,q)=>s+q.points,0)),[27,11,13,16,17,16]);
 assert.equal(Object.keys(reviewNotices[packageId]).length,6);assert.match(analysisReviewNotices[packageId].message,/標準化得点/);
 const css=fs.readFileSync(new URL('../src/styles/past-exam-figures.css',import.meta.url),'utf8');
 assert.ok(css.includes(`img[src^="/assets/past-exams/${packageId}/"] { min-width: 620px; }`));
 assert.ok(css.includes(`body.is-printing-past-exam-document .past-exam-figure img[src^="/assets/past-exams/${packageId}/"] { max-height: 200mm; max-width: 150mm; width: auto; }`));
});
