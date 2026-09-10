import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,height,intersectionFunction,parabolaPoint,rotate,section} from './build-kansai-medical-2025-mathematics-figures.mjs';
const near=(a,b,e=1e-8)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url)));
test('Kansai mathematics: circle diameter and polar radius agree with a right angle',()=>{
 for(let theta=-1.5;theta<1.5;theta+=.013){const r=2*Math.cos(theta),x=r*Math.cos(theta),y=r*Math.sin(theta);near((x-1)**2+y*y,1);near((-x)*(2-x)+y*y,0);}
});
test('Kansai mathematics: positive and negative directrices preserve equal distances',()=>{
 for(const a of [-9,-4,-.5,.5,4,9])for(let y=-4;y<=4;y+=.08){const [x]=parabolaPoint(a,y),r=Math.hypot(x,y),theta=Math.atan2(y,x);near(r,Math.abs(x-a/2));near(r,a>0?a/(2*(1+Math.cos(theta))):-a/(2*(1-Math.cos(theta))));}
});
test('Kansai mathematics: boundary values and open endpoints give 0/1/2/4 intersections',()=>{
 near(intersectionFunction(Math.PI/3),1);near(intersectionFunction(5*Math.PI/3),1);near(intersectionFunction(Math.PI),-8);near(intersectionFunction(0),0);near(intersectionFunction(2*Math.PI),0);
 // Solve 4u²−4u+k=0 first, then count cos x=u on the OPEN interval.
 const count=k=>k>1?0:[...new Set([(1+Math.sqrt(1-k))/2,(1-Math.sqrt(1-k))/2])].reduce((n,u)=>n+(u<-1||u>=1?0:Math.abs(u+1)<1e-12?1:2),0);
 for(const [k,n] of [[-9,0],[-8,1],[-4,2],[0,2],[.5,4],[1,2],[1.1,0]])assert.equal(count(k),n);
});
test('Kansai mathematics: integer factor pairs and consecutive sums retain all cases',()=>{
 const diff=N=>{const result=[];for(let m=1;m<N;m++){const n=Math.sqrt(m*m+N);if(Number.isInteger(n))result.push([m,n]);}return result;};
 assert.equal(diff(2024).length,4);assert.equal(diff(2025).length,7);
 let count=0;for(let m=1;m<=1012;m++){let sum=m;for(let n=m+1;sum<2025;n++){sum+=n;if(sum===2025)count++;}}assert.equal(count,14);
});
test('Kansai mathematics: roulette recurrence includes initial case and terminal probabilities',()=>{
 for(let m=3;m<=12;m++){let survival=1,wins=0,losses=0;for(let n=1;n<=400;n++){const a=survival/m,b=n===1?0:survival/m;survival-=a+b;wins+=a;losses+=b;near(wins-losses,1/m);near(wins+losses,1-survival);near(survival,(m-1)/m*((m-2)/m)**(n-1));}near(wins/losses,(m+1)/(m-1));}
});
test('Kansai mathematics: height stays nonnegative and rectangular slice has the right area',()=>{
 for(let x=-1;x<=1;x+=.005){near(height(x),4*(x+1)*(x-.5)**2);assert.ok(height(x)>-1e-12);}
 for(const x of [.5,.6,.8,.9,1]){const {A,B,C,D}=section(x);near(A[0]**2+A[1]**2,1);near(B[0]**2+B[1]**2,1);near(C[2],height(x));near(D[2],height(x));near(B[1]-A[1],2*Math.sqrt(1-x*x));}
 const n=20000,simpson=(f,a,b)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=(i%2?4:2)*f(a+h*i);return s*h/3;};
 const volume=simpson(t=>2*Math.sin(t)**2*(Math.cos(3*t)+1),0,Math.PI/3);
 near(volume,Math.PI/3-9*Math.sqrt(3)/20);near(simpson(t=>2*Math.sin(t)**2*(Math.cos(3*t)+1),0,Math.PI),Math.PI);
});
test('Kansai mathematics: rotated T is contained in S, but S is NOT rotation invariant',()=>{
 for(let alpha=0;alpha<=Math.PI/3+1e-10;alpha+=Math.PI/180){const x=Math.cos(alpha),b=Math.sin(alpha);for(let i=0;i<=100;i++){const y=-b+2*b*i/100,[u,v]=rotate([x,y]);near(u*u+v*v,x*x+y*y);assert.ok(height(u)+1e-10>=height(x));}}
 const [u]=rotate([-.5,0]);near(u,.25);assert.ok(1<height(-.5)&&1>height(u));
});
test('Kansai mathematics: independently enumerate dependency-closed target plans',()=>{
 const evidence=read('../src/data/pastExamAnalysisEvidence/kansai-medical-2025-general-early-mathematics.json');
 // The canonical ordering is stable; this calculation does not call the site optimizer.
 const ids=['q1-1','q1-2','q2-1','q2-2','q2-3','q3-1','q3-2','q3-3','q3-4','q4-1','q4-2','q4-3','q4-4'];
 const execution=[8,12,6,7,10,6,6,5,8,2,18,5,12],points=ids.map((_,i)=>i<9?8:7),requires={4:[2,3],6:[5],7:[5],8:[5,6,7],10:[9],12:[9]};
 for(const weak of [true,false]){let best={points:0,minutes:Infinity};for(let mask=0;mask<8192;mask++){if(weak&&[4,8,10,12].some(i=>mask&(1<<i)))continue;if(Object.entries(requires).some(([i,deps])=>(mask&(1<<i))&&deps.some(d=>!(mask&(1<<d)))))continue;
  let p=0,t=weak?46:11.5;for(let i=0;i<13;i++)if(mask&(1<<i)){p+=points[i];t+=execution[i]*(weak?1.5:1);}if(t<=90&&(p>best.points||(p===best.points&&t<best.minutes)))best={points:p,minutes:t};}
  assert.equal(best.points,weak?39:86);near(best.minutes,weak?83.5:86.5);assert.equal(Math.floor(best.points*(weak?1:.8)),weak?39:68);
 }assert.ok(evidence);
});
test('Kansai mathematics: six manifest slots remain separate from source approval',()=>{
 const manifest=read('../src/data/pastExamFigures/'+packageId+'.json');assert.equal(manifest.items.length,6);assert.equal(manifest.restrictedSourceCopied,false);assert.equal(manifest.review.needsHumanReview,true);
 assert.deepEqual(manifest.items.map(i=>i.id),['a1-circle-figure','a1-parabola-figures','a3-intersection-graph','a9-solid-height-graph','a10-cross-section-figure','a12-rotation-figure']);
 for(const item of manifest.items){const svg=fs.readFileSync(new URL('../public'+item.src,import.meta.url),'utf8');assert.match(svg,/KaTeX_Main/);assert.match(svg,/KaTeX_Math/);assert.doesNotMatch(svg,/<image\b|<foreignObject\b|<script\b/);}
});
