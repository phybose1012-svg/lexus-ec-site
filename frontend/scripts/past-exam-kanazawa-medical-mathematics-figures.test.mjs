import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,q2,q4,parabola,firstParabola,leftTangent,rightTangent,sideways,semicircle,circleTangent,parabolaTangent,areas,triangleArea} from './build-kanazawa-medical-2025-mathematics-figures.mjs';
import {withReviewNotice,analysisReviewNotices} from '../src/lib/pastExamReviewNotices.mjs';
const near=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
const integral=(f,a,b,n=30000)=>{const h=(b-a)/n;let s=0;for(let i=0;i<n;i++)s+=h*f(a+(i+.5)*h);return s;};
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
test('Kanazawa: both common tangents pass through A and have the correct double roots',()=>{
 for(const [t,x] of [[leftTangent,6],[rightTangent,2]]){near(t(4),-5);near(t(x),firstParabola(x));}
 for(const [p,t] of [[q2.B,leftTangent],[q2.C,rightTangent]]){near(parabola(p[0]),p[1]);near(t(p[0]),p[1]);}
 near(2*q2.B[0]-6,-2);near(2*q2.C[0]-6,6);near(parabola(3),-2);
});
test('Kanazawa: parabola is above the switched lower boundary and triangle areas are 1:6:9',()=>{
 const {A,B,C,D}=q2;
 for(let x=2.01;x<6;x+=.07)assert.ok(parabola(x)>(x<4?leftTangent(x):rightTangent(x)));
 near(integral(x=>parabola(x)-leftTangent(x),2,4)+integral(x=>parabola(x)-rightTangent(x),4,6),areas.q2,1e-7);
 near(triangleArea(A,B,C),16);near(triangleArea(A,B,D),1);near(triangleArea(B,C,D),6);near(triangleArea(C,A,D),9);
});
test('Kanazawa: circle and sideways parabola intersect, but their tangents are different',()=>{
 const [x,y]=q4.A;near(x*x+y*y,q4.r*q4.r);near(y*y,4*q4.p*x);near(x+Math.sqrt(3)*y,8);
 near(circleTangent(x),y);near(parabolaTangent(x),y);near(parabolaTangent(-2),0);
 const circleSlope=-x/y,parabolaSlope=3/y;assert.ok(circleSlope<0&&parabolaSlope>0);
 near(circleSlope,-1/Math.sqrt(3));near(parabolaSlope,Math.sqrt(3)/2);
 near(Math.PI/2-Math.atan2(y,x),Math.PI/6);
});
test('Kanazawa: the two shaded regions have the intended boundaries and exact areas',()=>{
 for(let x=.01;x<2;x+=.03){assert.ok(semicircle(x)>sideways(x));assert.ok(parabolaTangent(x)>sideways(x));}
 // Integrate in y for the parabola segment to avoid a numerical endpoint singularity.
 const y=q4.A[1],parabolaUnder=2*y-y**3/18;
 near(integral(semicircle,0,2)-parabolaUnder,areas.circleGap,1e-7);
 near(integral(parabolaTangent,-2,2)-parabolaUnder,areas.tangentGap,1e-7);
});
test('Kanazawa: all 216 ordered dice outcomes independently confirm every probability answer',()=>{
 let n5=0,perp=0,parallel=0,obtuse=0,min=Infinity,max=0;
 for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)for(let c=1;c<=6;c++){
  const norm=(a-b)**2+c*c,inner=(a-b)*a+c*(b-1),cross=(a-b)*(b-1)-a*c;
  min=Math.min(min,norm);max=Math.max(max,norm);if(norm===25)n5++;if(inner===0)perp++;if(cross===0)parallel++;if(inner<0)obtuse++;
 }
 assert.deepEqual([min,max,n5,perp,parallel,obtuse],[1,61,16,15,2,6]);
});
test('Kanazawa: group data reproduce the mean, variance, and the two-digit answer 18',()=>{
 for(let n=1;n<=22;n++){
  const start=2*n*n-2*n+1,values=Array.from({length:2*n},(_,i)=>start+2*i),mean=values.reduce((a,b)=>a+b)/values.length;
  near(mean,2*n*n);near(values.reduce((s,v)=>s+(v-mean)**2,0)/values.length,(4*n*n-1)/3);
 }
 assert.ok(6*7<50&&50<=7*8);assert.equal(50-6*7,8);
 assert.ok((4*17**2-1)/3<400);assert.ok((4*18**2-1)/3>400);
});
test('Kanazawa: source target maxima 66/100 remain feasible with dependency closure',()=>{
 const pts=[11,11,11,12,10,11,11,11,12],exec=[4,7,6,10,1.5,1.5,5,1.5,9];
 const solve=weak=>{let max=0;for(let mask=0;mask<512;mask++){
  if(weak&&(mask&4))continue;
  if((mask&64)&&!(mask&32)||(mask&128)&&!(mask&64))continue;
  let p=0,t=weak?20.4:5.1;
  for(let i=0;i<9;i++)if(mask&(1<<i)){p+=pts[i];t+=weak?Math.round(exec[i]*1.5*10)/10:exec[i];}
  if(t<=60+1e-9)max=Math.max(max,p);
 }return max;};
 assert.equal(solve(true),66);assert.equal(solve(false),100);assert.equal(Math.floor(solve(false)*.8),80);
});
test('Kanazawa: two original figure slots and source-review boundaries remain registered',()=>{
 const m=JSON.parse(read(`../src/data/pastExamFigures/${packageId}.json`));assert.equal(m.items.length,2);assert.equal(m.restrictedSourceCopied,false);assert.equal(m.review.needsHumanReview,true);
 for(const item of m.items){const svg=read(`../public${item.src}`);assert.equal((svg.match(/@font-face/g)||[]).length,2);assert.match(svg,/role="img"/);assert.doesNotMatch(svg,/<image\b|<foreignObject\b/);}
 assert.match(m.items[1].alt,/交点/);assert.match(m.items[1].caption,/接線は異なる/);
 for(const major of ['major-question-03','major-question-04'])assert.match(withReviewNotice('<h2>題</h2>',packageId,major),/data-source-review="required"/);
 assert.match(analysisReviewNotices[packageId].message,/分散/);
 const a=JSON.parse(read(`../src/data/generated/pastExamAnswers/${packageId}.json`)).document.majorQuestions.map(q=>q.html).join('');assert.equal((a.match(/data-figure-id=/g)||[]).length,2);assert.doesNotMatch(a,/data-figure-placeholder/);
});
