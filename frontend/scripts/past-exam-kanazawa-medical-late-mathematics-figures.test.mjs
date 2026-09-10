import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,triangle,movingPoints,area,equilateral,pyramid,cutValue,project} from './build-kanazawa-medical-2025-late-mathematics-figures.mjs';
import {withReviewNotice,analysisReviewNotices} from '../src/lib/pastExamReviewNotices.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const minus=(a,b)=>a.map((v,i)=>v-b[i]),norm=a=>Math.hypot(...a),dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
test('Kanazawa late: all dice outcomes confirm four probabilities and integer boundary counts',()=>{
 const counts=[0,0,0,0],noRoots=Array(6).fill(0),quadrant=Array(6).fill(0),tangent=Array(6).fill(0);
 for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)for(let c=1;c<=6;c++){
  const x=a-b+c,y=-a*a+2*a*(b-c);
  if(x===6)counts[0]++;
  if(y>0){counts[1]++;noRoots[a-1]++;if(x>0){counts[2]++;quadrant[a-1]++;}}
  if((x-1)**2-(b-c)**2-9===0){counts[3]++;tangent[a-1]++;}
 }
 assert.deepEqual(counts,[21,50,15,8]);assert.deepEqual(noRoots,[15,10,10,6,6,3]);assert.deepEqual(quadrant,[0,0,4,3,5,3]);assert.deepEqual(tangent,[0,2,0,6,0,0]);
});
test('Kanazawa late: exact moving points preserve direction, edge transitions and area on all intervals',()=>{
 near(norm(minus(triangle.B,triangle.C)),25);near((15+20+25)/3,20);
 for(let t=.05;t<20;t+=.05){
  const {P,Q}=movingPoints(t);near(Math.abs(P[0]*Q[1]-P[1]*Q[0])/2,area(t));assert.ok(area(t)>0);
  if(t>15)assert.ok(P[0]<Q[0]&&P[1]>Q[1]);
 }
 const final=movingPoints(20);near(norm(minus(final.P,final.Q)),0);near(norm(minus(movingPoints(15).P,triangle.B)),0);near(norm(minus(movingPoints(10).Q,triangle.C)),0);
});
test('Kanazawa late: graph is continuous, excluded endpoints zero, global maximum interior',()=>{
 near(area(0),0);near(area(20),0);near(area(10),100);near(area(15),90);near(area(45/4),405/4);
 for(let t=0;t<=20;t+=.001)assert.ok(area(t)<=405/4+1e-8);
 near(-.8*10**2+18*10,100);near(-18*15+360,90);
});
test('Kanazawa late: both slopes are negative and n selects the correct equilateral orientation',()=>{
 const k=Math.sqrt(3)/2,slopes=[(k+Math.sqrt(3))/(1-k*Math.sqrt(3)),(k-Math.sqrt(3))/(1+k*Math.sqrt(3))];
 near(slopes[0],-3*Math.sqrt(3));near(slopes[1],-Math.sqrt(3)/5);assert.ok(slopes.every(v=>v<0));
 const {A,B,C}=equilateral;
 for(const p of [A,B])near(p[1],k*p[0]+1);
 for(const p of [A,C])near(p[1],slopes[0]*p[0]-20);
 for(const p of [B,C])near(p[1],slopes[1]*p[0]+22);
 for(const p of [[A,B],[A,C],[B,C]])near(norm(minus(...p)),6*Math.sqrt(21));
 const ab=minus(B,A),ac=minus(C,A);near(Math.abs(ab[0]*ac[1]-ab[1]*ac[0])/2,189*Math.sqrt(3));
 near(Math.abs(5*22+16),126);near(Math.abs(5*(-142/5)+16),126);
});
test('Kanazawa late: pyramid has eight length-2 edges and correct centroids',()=>{
 const {O,A,B,C,D,G1,G2}=pyramid;
 for(const [u,v] of [[O,A],[A,D],[D,B],[B,O],[C,O],[C,A],[C,D],[C,B]])near(norm(minus(u,v)),2);
 for(let i=0;i<3;i++){near(G1[i],(A[i]+C[i]+D[i])/3);near(G2[i],(B[i]+C[i]+D[i])/3);near(G2[i]-G1[i],(B[i]-A[i])/3);}
 near(norm(G1),2);near(norm(G2),2);near(dot(G1,G2),32/9);near(norm(cross(G1,G2))/2,2*Math.sqrt(17)/9);
});
test('Kanazawa late: cut is OLNM, not triangle OG1G2; intersections and solid volume match',()=>{
 const {O,A,B,C,D,L,M,N,G1,G2}=pyramid;
 for(const p of [O,L,M,N,G1,G2])near(cutValue(p),0);
 assert.ok(cutValue(C)<0&&cutValue(A)>0&&cutValue(B)>0&&cutValue(D)>0);
 near(norm(minus(A,L)),.5);near(norm(minus(B,M)),.5);near(norm(minus(D,N)),.8);
 near(norm(minus(C,L))/norm(minus(C,A)),.75);near(norm(minus(C,N))/norm(minus(C,D)),.6);
 near(norm(cross(minus(L,C),minus(N,C)))/norm(cross(minus(A,C),minus(D,C))),9/20);
 near(Math.abs(dot(C,cross(L,N)))/6+Math.abs(dot(C,cross(M,N)))/6,3*Math.sqrt(2)/5);
 for(const p of Object.values(pyramid))assert.ok(project(p).every(Number.isFinite));
});
test('Kanazawa late: seven-item scoring model reproduces targets with prerequisites and one-time judgement',()=>{
 const pts=[14,14,14,14,14,15,15],exec=[3.5,5,5,5,8.5,9,11];
 const solve=weak=>{let best={p:0,t:Infinity};for(let mask=0;mask<128;mask++){
  if(weak&&(mask&64)||((mask&4)&&!(mask&2)))continue;
  let p=0,t=weak?18.8:4.7;for(let i=0;i<7;i++)if(mask&(1<<i)){p+=pts[i];t+=weak?Math.round(exec[i]*15)/10:exec[i];}
  if(t<=60&&(p>best.p||p===best.p&&t<best.t))best={p,t};
 }return best;};
 const weak=solve(true),strong=solve(false);assert.equal(weak.p,70);near(weak.t,59.4);assert.equal(strong.p,100);near(strong.t,51.7);assert.equal(Math.floor(strong.p*.8),80);
 near(18.8+5.3+12.8,36.9);near(4.7+3.5+5+5+5+8.5+9,40.7);
});
test('Kanazawa late: original figure contracts, all placements, and explicit review boundaries',()=>{
 const m=JSON.parse(read(`../src/data/pastExamFigures/${packageId}.json`));assert.equal(m.items.length,7);assert.equal(m.restrictedSourceCopied,false);assert.equal(m.review.needsHumanReview,true);
 for(const item of m.items){const svg=read(`../public${item.src}`);assert.equal((svg.match(/@font-face/g)||[]).length,2);assert.doesNotMatch(svg,/<image\b|<foreignObject\b/);}
 const q=JSON.parse(read(`../src/data/generated/pastExamQuestions/${packageId}.json`));
 const a=JSON.parse(read(`../src/data/generated/pastExamAnswers/${packageId}.json`));
 assert.equal((JSON.stringify(q).match(/data-figure-id=/g)||[]).length,2);assert.equal((JSON.stringify(a).match(/data-figure-id=/g)||[]).length,5);
 for(const major of ['major-question-01','major-question-03','major-question-04'])assert.match(withReviewNotice('<h2>題</h2>',packageId,major),/data-source-review/);
 assert.match(analysisReviewNotices[packageId].message,/7つ/);
 const questionTexts=m.items.filter(i=>!i.id.startsWith('ans-')).map(i=>read(`../public${i.src}`).replace(/<style[\s\S]*?<\/style>/g,'').replace(/<[^>]*>/g,'')).join('');
 assert.doesNotMatch(questionTexts,/405|45\/4|9 : 20|√2|G₁/);
});
