import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {id,s,tetra,bounds,section,radii} from './build-showa-2025-mathematics-figures.mjs';
import {renderProjection} from './build-past-exam-staging-answers.mjs';
import {withReviewNotice} from '../src/lib/pastExamReviewNotices.mjs';
const near=(a,b,eps=1e-8)=>assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`);
const read=p=>JSON.parse(fs.readFileSync(new URL('../src/data/'+p,import.meta.url)));
const norm=v=>Math.hypot(...v),sub=(a,b)=>a.map((x,i)=>x-b[i]);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const area=(a,b,c)=>norm(cross(sub(b,a),sub(c,a)))/2;
test('Showa math: complex constraints and positive/negative integer powers',()=>{
 const alpha=[Math.sqrt(2),0];for(const sign of [-1,1]){const beta=[2*Math.sqrt(2),sign*2*Math.sqrt(2)];near(norm(beta),4);near(norm(sub(alpha.map(x=>4*x),beta)),4);near(norm(alpha.map((x,i)=>x+beta[i])),Math.sqrt(26));near(Math.abs(alpha[0]*beta[1])/2,2);
  for(const n of [-13,3,19]){const r=(2*Math.sqrt(2))**n,theta=sign*n*Math.PI/4,actual=Math.hypot(1+r*Math.cos(theta),r*Math.sin(theta)),expected=Math.sqrt(1-2**((3*n+1)/2)+2**(3*n));near(actual/expected,1);}
 }
 near((2*Math.sqrt(2))**4*Math.cos(Math.PI),-64);
});
test('Showa math: Euclid, all integer factor cases, region and integral squeeze',()=>{
 const gcd=(a,b)=>b?gcd(b,a%b):a;assert.equal(gcd(2025,1928),1);near(1+1/(19+1/(1+1/(7+1/12))),2025/1928);
 const pairs=[];for(let a=-30;a<30;a++)for(let b=a+1;b<31;b++){const f=x=>(x-a/2)*(x-b/2);if(f(a*a/4-2)===0&&f(b*b/4-2)===0)pairs.push([a,b]);}
 assert.deepEqual(pairs,[[-4,4],[-2,2],[-2,4]]);
 // The mutually cross-mapped case gives (a-b)(a+b+2)=0 and a²+2a−4=0, not integers.
 for(const x of [-1-Math.sqrt(5),-1+Math.sqrt(5)])near(x*x+2*x-4,0);
 for(let i=0;i<=100;i++){const x=.5+1.5*i/100;const [l,u]=bounds(x);for(const y of [l,u])near(Math.abs(Math.log2(x))+Math.abs(Math.log2(y)),1);}
 let integral=0;const N=10000;for(let i=0;i<N;i++){const x=.5+1.5*(i+.5)/N,[l,u]=bounds(x);integral+=(u-l)*1.5/N;}near(integral,1.5*Math.log(2),1e-7);
 const sum=Array.from({length:2025},(_,i)=>1/Math.sqrt(i+1)).reduce((a,b)=>a+b,0);assert.ok(2*(Math.sqrt(2026)-1)<sum&&sum<89&&sum>88);assert.equal(Math.floor(sum),88);
});
test('Showa math: tetrahedron incidences, equilateral faces and maximal surface',()=>{
 for(const t of [-.98,-.8,-.51,.51,.8,.98,s]){const {O,A,B,C}=tetra(t);near(A[2],0);near(B[0],0);near(C[0],0);near(B[1],C[1]);near(B[2],-C[2]);near(norm(A),1);near(norm(B),1);near(norm(sub(A,B)),1);near(norm(sub(A,C)),1);near(area(O,A,B),Math.sqrt(3)/4);near(area(O,B,C),area(A,B,C));const surface=area(O,A,B)+area(O,A,C)+area(O,B,C)+area(A,B,C);near(surface,Math.sqrt(3)/2+2*Math.sqrt(t*t*(1-t*t)));assert.ok(surface<=(Math.sqrt(3)+2)/2+1e-9);}
 near(Math.sqrt(3)/2+2*Math.sqrt(s*s*(1-s*s)),(Math.sqrt(3)+2)/2);
});
test('Showa math: triangle to annulus and all three rotation volumes',()=>{
 for(const k of [0,s*.1,s*.36,s*.8,s]){const {inner,outer}=radii(k);near(outer*outer-inner*inner,1-Math.sqrt(2)*k);for(const axis of ['x','z']){const pts=section(axis,k);near(Math.min(...pts.map(norm)),inner);near(Math.max(...pts.map(norm)),outer);for(let i=0;i<=20;i++)for(let j=0;j<=20-i;j++){const a=i/20,b=j/20,c=1-a-b;const q=pts[0].map((x,n)=>a*x+b*pts[1][n]+c*pts[2][n]);assert.ok(norm(q)>=inner-1e-8&&norm(q)<=outer+1e-8);}}}
 let vx=0,vy=0;const N=10000;for(let i=0;i<N;i++){const k=s*(i+.5)/N,{inner,outer}=radii(k);vx+=Math.PI*(outer*outer-inner*inner)*s/N;vy+=Math.PI*k*k*s/N;}
 near(vx,Math.sqrt(2)*Math.PI/4);near(vy,Math.sqrt(2)*Math.PI/12);near(2*vx,Math.sqrt(2)*Math.PI/2);
});
test('Showa math: last trial fixed and two equal probability modes',()=>{
 const choose=(n,k)=>{let p=1;for(let i=1;i<=k;i++)p=p*(n-i+1)/i;return p;},P=n=>choose(n+4,5)*(1/3)**6*(2/3)**(n-1);
 [1/729,4/729,28/2187].forEach((x,i)=>near(P(i+1),x));
 for(let n=1;n<80;n++){near(P(n+1)/P(n),2*(n+5)/(3*n));if(n<10)assert.ok(P(n)<P(n+1));else if(n===10)near(P(n),P(n+1));else assert.ok(P(n)>P(n+1));}
});
test('Showa math: all six original figures, review/provenance and concise analysis',()=>{
 const m=read(`pastExamFigures/${id}.json`);assert.equal(m.items.length,6);assert.equal(m.restrictedSourceCopied,false);assert.equal(m.review.needsHumanReview,true);
 for(const f of m.items){const svg=fs.readFileSync(new URL('../public'+f.src,import.meta.url),'utf8');assert.ok(svg.includes('KaTeX_Main')&&svg.includes('KaTeX_Math'));assert.ok(!/[≤≥]/.test(svg));assert.ok(!/<image|foreignObject/.test(svg));}
 const p=renderProjection(read(`pastExamStagingAnswerSources/${id}.json`)),html=p.document.majorQuestions.map(q=>withReviewNotice(q.html,id,q.id)).join('');assert.equal((html.match(/class="past-exam-figure"/g)||[]).length,6);assert.equal((html.match(/data-source-review="required"/g)||[]).length,4);assert.ok(!html.includes('data-figure-placeholder'));assert.equal(p.source.independentlyReauthored,false);
 const a=read(`pastExamAnalysisSources/${id}.json`);assert.equal(a.majorQuestions.flatMap(m=>m.subquestions).length,16);assert.ok(a.majorQuestions.flatMap(m=>m.subquestions).every(q=>q.title.length<25));assert.equal(a.format,'結果記入・領域の図示');
});
test('Showa math: all 65536 subsets, source timings and dependency-closed replacement',()=>{
 const e=read(`pastExamAnalysisEvidence/${id}.json`),qs=e.majorQuestions.flatMap(m=>m.subquestions),judgment=[.5,.3,.8,.3,.2,.4,.7,.7,.4,.6,.7,.8,1.2,.3,.4,.4],execution=[3.5,2.7,4.2,2.7,1.8,2.6,4.3,4.3,3.6,4.4,4.3,5.2,7.8,2.7,3.6,2.6],round=x=>Math.round((x+1e-9)*10)/10;
 assert.deepEqual(qs.reduce((a,q)=>(a[q.difficulty]=(a[q.difficulty]||0)+q.points,a),{}),{'標準レベル':45,'基本＋αレベル':20,'発展レベル':23,'基本レベル':12});
 for(const p of e.targetAnalysis.profiles){const key=p.id==='weak'?'weak_subject':'strong_subject',scan=judgment.reduce((s,x)=>s+round(x*p.judgmentMultiplier),0),cost=execution.map(x=>round(x*p.executionMultiplier)),deps=qs.map(q=>q.prerequisites[key].reduce((s,id)=>s|(1<<qs.findIndex(q=>q.id===id)),0));near(scan,p.scanMinutes);let best=0;
  for(let mask=0;mask<65536;mask++){let minutes=scan,points=0,valid=true;for(let i=0;i<16;i++)if(mask&(1<<i)){if((mask&deps[i])!==deps[i]){valid=false;break;}minutes+=cost[i];points+=qs[i].points;}if(valid&&minutes<=70+1e-8)best=Math.max(best,points);}
  assert.equal(best,p.maximum.points);for(const plan of [p.maximum,p.now,p.nowPlusLater]){near(scan+qs.reduce((s,q,i)=>s+(plan.questionIds.includes(q.id)?cost[i]:0),0),plan.minutes);near(qs.reduce((s,q)=>s+(plan.questionIds.includes(q.id)?q.points:0),0),plan.points);for(const q of qs)if(plan.questionIds.includes(q.id))for(const d of q.prerequisites[key])assert.ok(plan.questionIds.includes(d));}
  assert.equal(p.targetPoints,p.id==='weak'?40:80);near(p.maximum.minutes,p.id==='weak'?68:69);near(p.now.minutes,p.id==='weak'?81.4:57);
  if(p.id==='weak'){assert.ok(p.now.minutes>70);assert.ok(p.now.questionIds.some(q=>!p.maximum.questionIds.includes(q)));}
 }
});
