import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,quartic,derivative,sectionX,sectionZ,hexagon,surface,clippedDisk,dandelin,answerSupplement} from './build-kyorin-2025-general-mathematics-figures.mjs';
const close=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
const integrate=(f,a,b,n=20000)=>{let s=0;for(let i=0;i<n;i++)s+=f(a+(i+.5)*(b-a)/n);return s*(b-a)/n;};
const area=pts=>Math.abs(pts.reduce((s,p,i)=>{const q=pts[(i+1)%pts.length];return s+p[0]*q[1]-p[1]*q[0];},0))/2;
test('Kyorin I: extrema, double roots and polynomial quotient are independent identities',()=>{
 for(const [x,y]of [[-1,-1],[0,1],[.5,11/16]]){close(derivative(x),0);close(quartic(x),y);}
 assert.deepEqual([-2,-.5,.25,1].map(x=>Math.sign(derivative(x))),[-1,1,-1,1]);
 for(const x of [-2,-.7,0,.5,1,2]){
  close(quartic(x),(x*x+2*x+3)*(3*x*x-4*x-4)+20*x+13);
  close(quartic(x)-11/16,3*(x-.5)**2*(x*x+5*x/3+5/12));
  close(quartic(x)-10*x/9-2/27,3*(x*x+x/3-5/9)**2);
 }
});
test('Kyorin II: one-sided derivative, intersection and integral',()=>{
 const f=x=>x<0?Math.sin(x)/x-2*Math.sin(x)/3:(-2*x+3)/Math.sqrt(x*x+9);
 for(const x of [-1e-5,1e-5])close((f(x)-1)/x,-2/3,1e-5);
 close(f(1.5),1-2*1.5/3);
 close(integrate(f,0,1.5),6-3*Math.sqrt(5)+3*Math.log((1+Math.sqrt(5))/2),1e-8);
 close(Math.tan(Math.atan(.5)),.5);
});
test('Kyorin III: curved surface is unrolled, never a yz projection',()=>{
 for(let j=0;j<=20;j++){const t=j*Math.PI/40,c=Math.cos(t);for(const x of [-c,0,c]){const p=surface(t,x);close(p[1]**2+p[2]**2,1);assert.ok(p[0]**2+p[2]**2<1+1e-12);}}
 close(4*integrate(t=>2*Math.cos(t),0,Math.PI/2),8,1e-8);
 close(Math.SQRT2*Math.PI,Math.PI*Math.sqrt(2));
});
test('Kyorin III: independent polygon areas, volumes and maximal cross-section',()=>{
 for(const u of [.05,.25,.55,.9,.99]){close(area(hexagon(u)),2*(1-u*u));close(area(clippedDisk(u))-area(hexagon(u)),sectionX(u),.0002);}
 // Midpoint error over [-1, 1] for this piecewise quadratic is 16/(3*n^2).
 close(integrate(sectionZ,-1,1),8/3,2e-8);
 close(2*integrate(sectionX,0,1),8/3,2e-5);
 close(sectionX(Math.SQRT1_2),Math.PI/2);
 assert.ok(sectionX(.65)<Math.PI/2&&sectionX(.75)<Math.PI/2);
});
test('Kyorin III: Dandelin sphere contacts and tangent lengths',()=>{
 for(const m of [.3,.6,1]){const {c,F,G,P}=dandelin(m),dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);close(F[1],m*F[0]);close(G[1],m*G[0]);close(dist(F,[0,c]),1);close(dist(G,[0,-c]),1);close(dist(P,F),c-m);close(dist(P,G),c+m);}
});
test('Kyorin III: six-state chain includes the original E/F initial moves',()=>{
 let p=[0,0,0,0,1,0],maxQ=0;
 for(let n=1;n<=100;n++){
  const q=[0,0,0,0,0,0];for(let j=0;j<4;j++){q[(j+1)%4]+=p[j]/4;q[(j+3)%4]+=p[j]/4;q[4]+=p[j]/3;q[5]+=p[j]/6;}
  for(let j=0;j<4;j++)q[j]+=(p[4]+p[5])/4;p=q;
  close(p.reduce((a,b)=>a+b),1);close(p[0],(2+(-.5)**(n-1))/12);close(p[5],(2+(-.5)**(n-2))/18);maxQ=Math.max(maxQ,p[5]);if(n===4)close(p[0],5/32);
 }close(maxQ,1/6);close(p[4],2/9);
});
test('Kyorin targets: all 256 subsets respect rounded time and prerequisites',()=>{
 const ev=JSON.parse(fs.readFileSync(new URL(`../src/data/pastExamAnalysisEvidence/${packageId}.json`,import.meta.url))).targetAnalysis;
 const points=[12,12,13,12,13,13,12,13],scan=[.8,.6,.9,.5,.9,1,1.5,1.2],exec=[6,4.5,7,3,8,9,20,12],ids=['math-q1-a','math-q1-b','math-q1-c','math-q2-a','math-q2-b','math-q2-c','math-q3-1','math-q3-2'];
 for(const profile of ev.profiles){const weak=profile.id==='weak',allowed=weak?[0,1,3,4]:[0,1,2,3,4,5,6,7],round=x=>Math.round(x*10)/10;let best={points:-1,minutes:Infinity};
  const scanning=scan.reduce((s,t)=>s+round(t*(weak?4:1)),0);close(scanning,profile.scanMinutes);
  for(let mask=0;mask<256;mask++){const picked=ids.map((_,i)=>i).filter(i=>mask&(1<<i));if(picked.some(i=>!allowed.includes(i))||picked.includes(4)&&!picked.includes(3)||picked.includes(5)&&!picked.includes(4))continue;
   const minutes=round(scanning+picked.reduce((s,i)=>s+round(exec[i]*(weak?1.5:1)),0)),pts=picked.reduce((s,i)=>s+points[i],0);if(minutes>70)continue;if(pts>best.points||pts===best.points&&minutes<best.minutes)best={points:pts,minutes,questionIds:picked.map(i=>ids[i])};
  }assert.deepEqual(best,profile.maximum);close(profile.targetPoints,weak?best.points:Math.floor(best.points*.8));
 }
});
test('Kyorin assets and supplements preserve provenance and eleven stable slots',()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL(`../src/data/pastExamFigures/${packageId}.json`,import.meta.url)));assert.equal(manifest.items.length,11);assert.equal(manifest.restrictedSourceCopied,false);assert.equal(manifest.review.needsHumanReview,true);
 for(const fig of manifest.items){const svg=fs.readFileSync(new URL(`../public${fig.src}`,import.meta.url),'utf8');assert.match(svg,/KaTeX_Main/);assert.match(svg,/KaTeX_Math/);assert.doesNotMatch(svg,/<(?:image|foreignObject|script)\b/);assert.ok(fig.alt.length>20);}
 const supplement=answerSupplement();assert.equal(supplement.operations.length,2);const tables=supplement.operations.flatMap(op=>op.blocks).filter(b=>b.type==='table');assert.equal(tables.length,2);for(const t of tables)assert.ok(t.rows.every(row=>row.length===t.headers.length));assert.equal(JSON.stringify(tables).match(/\[\[no-value\]\]/g).length,4);
});
