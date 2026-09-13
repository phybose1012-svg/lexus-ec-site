import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,tetra,circle,tangency,integerPairs,eatingWays,supplement} from './build-sangyo-medical-2025-general-a-b-mathematics-figures.mjs';
import {applyAnswerSupplement} from './lib/past-exam-answer-supplements.mjs';
import {renderProjection} from './build-past-exam-staging-answers.mjs';
import {withReviewNotice} from '../src/lib/pastExamReviewNotices.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`),diff=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),dist=(a,b)=>Math.hypot(...diff(a,b));
const read=p=>JSON.parse(fs.readFileSync(new URL('../src/data/'+p,import.meta.url)));
test('Sangyo: oxygen quantities, rounding and all independent algebra/counting answers',()=>{
 const hb=5*10*15,oxygen=hb*6e-5,used=oxygen*.2,inhaled=6*.2/22.4;
 near(hb,750);near(oxygen,.045);near(used,.009);near(inhaled,3/56);near(used/inhaled*100,16.8);assert.equal(Number((used/inhaled*100).toPrecision(2)),17);
 for(const x of [-3,-1,0,1,2,5])near(x**5-2*x**4+5*x**3-10*x*x+4*x-8,(x-2)*(x*x+1)*(x*x+4));
 assert.equal((25n**119n).toString().length,167);assert.equal((25n**29n).toString().length,41);
 assert.equal(integerPairs().length,6);for(const {x,y}of integerPairs())assert.equal(2*x*y+4*x-9*y,36);
 const brute=[];for(let x=-50;x<=50;x++)for(let y=-100;y<=100;y++)if(2*x*y+4*x-9*y===36)brute.push([x,y]);assert.deepEqual(brute,integerPairs().map(({x,y})=>[x,y]));
 near(2*3*2/3,4);near(4*(1/8)**2*(7/8)**3,343/8192);
 const u=Math.PI/4;near(Math.sin(2*u-u)+Math.sin(u-2*u),-Math.sin(u)+Math.sin(u));near(2*Math.cos(u),2*Math.sin(u));
 const logp=1-2*Math.log(2);near(Math.exp(logp),Math.E/4);near(2*(logp+2*Math.log(2)-1),0);
});
test('Sangyo: tangent minimum and exact tetrahedral lengths, volume and projections',()=>{
 const A=[5,5],B=[-1,-3],C=[2,1],P=[-2,4],X=[-5,0];near(dist(A,C),5);near(dot(diff(P,A),diff(P,B)),0);near(dot(diff(X,P),diff(P,C)),0);assert.ok(dist(X,C)>5);
 const g=tetra;for(const[a,b,sq]of[['O','A',8],['O','B',5],['A','B',9],['C','B',8],['C','A',5],['C','O',9]])near(dist(g[a],g[b])**2,sq);
 near(dist(g.O,g.H),2);near(dist(g.C,g.S),2);near(dist(g.A,g.S),1);near(dist(g.S,g.B),2);near(dist(g.S,g.T),1);near(dist(g.C,g.T)**2,5);
 near(dot(diff(g.C,g.S),diff(g.A,g.B)),0);near(dot(diff(g.C,g.S),diff(g.S,g.T)),0);near(dot(diff(g.S,g.T),diff(g.A,g.B)),0);
 const a=g.A,b=g.B,c=g.C,det=a[0]*(b[1]*c[2]-b[2]*c[1])-a[1]*(b[0]*c[2]-b[2]*c[0])+a[2]*(b[0]*c[1]-b[1]*c[0]);near(Math.abs(det)/6,2);
});
test('Sangyo: distinct common tangencies, radii and similarity',()=>{
 const g=tangency;near(dist(g.O1,g.O2),8);near(dist(g.O1,g.P),2);near(dist(g.O2,g.Q),6);near(dist(g.P,g.Q),4*Math.sqrt(3));near(dist(g.R,g.P),2*Math.sqrt(3));near(dist(g.R,g.Q)/dist(g.R,g.P),3);
 near(dot(diff(g.O1,g.P),diff(g.Q,g.P)),0);near(dot(diff(g.O2,g.Q),diff(g.P,g.Q)),0);
 near(g.O1[1]/g.O1[0],g.O2[1]/g.O2[0]);assert.ok(g.R[0]<g.P[0]&&g.P[0]<g.Q[0]);
});
test('Sangyo: circle family with correct positive y coefficient and diameter area',()=>{
 const g=circle;for(const t of [-5,0,1,8/5,5]){for(const[x,y]of[g.A,g.B])near(x*x+y*y-2*(t-1)*x+t*y+2*t-3,0);const r2=1.25*t*t-4*t+4;near(r2,1.25*(t-1.6)**2+.8);assert.ok(r2>0);}
 for(const n of ['A','B','P'])near(dist(g[n],g.D),g.radius);
 near(dot(diff(g.A,g.B),diff(g.P,g.B)),0);near(dist(g.A,g.P),Math.sqrt(5));near(dist(g.A,g.B)*dist(g.P,g.B)/2,6/5);
 const [x,y]=g.A;near(-2*x+y+2,0);assert.notEqual(-2*x-y+2,0);
});
test('Sangyo: all eating sequences, geometric transforms and limit',()=>{
 const alpha=(1-Math.sqrt(5))/2,beta=(1+Math.sqrt(5))/2,an=n=>(beta**(n+1)-alpha**(n+1))/Math.sqrt(5);
 for(let n=1;n<=12;n++){const seq=eatingWays(n);near(an(n),seq.length);assert.equal(new Set(seq.map(a=>a.join(','))).size,seq.length);seq.forEach(a=>assert.equal(a.reduce((s,x)=>s+x,0),n));near(an(n+1)-alpha*an(n),beta**(n+1));if(n>2)near(an(n),an(n-1)+an(n-2));}
 assert.equal(eatingWays(5).length,8);near(an(31)/an(30),beta);
});
test('Sangyo: SHA-bound tables, figure registration and import provenance',()=>{
 const s=read(`pastExamStagingAnswerSources/${packageId}.json`),before=JSON.stringify(s),e=applyAnswerSupplement(s,supplement());assert.equal(JSON.stringify(s),before);
 const tables=e.pages.flatMap(p=>p.blocks).filter(b=>b.type==='table');assert.equal(tables.length,2);assert.equal(tables[0].rows.length,6);tables.forEach(t=>t.rows.forEach(r=>assert.equal(r.length,t.headers.length)));
 assert.throws(()=>applyAnswerSupplement({...s,sha256:'changed'},supplement()),/hash mismatch/);
 const p=renderProjection(s),html=p.document.majorQuestions.map(q=>withReviewNotice(q.html,packageId,q.id)).join('');assert.equal((html.match(/class="past-exam-figure"/g)||[]).length,4);assert.equal((html.match(/data-source-review="required"/g)||[]).length,4);assert.ok(!html.includes('data-figure-placeholder'));assert.equal(p.source.independentlyReauthored,false);
});
test('Sangyo: enumerate dependency-closed plans for all 23 items without changing targets',()=>{
 const e=read(`pastExamAnalysisEvidence/${packageId}.json`),qs=e.majorQuestions.flatMap(q=>q.subquestions),execution=[2,3,2,2.5,2.5,5,7,4,4,4,8,11,3.5,11,7,4,4,6,7,2,2,10,3.5],judgment=[.5,.5,.4,.5,.4,.8,1.2,.7,.8,.8,1.2,1.5,.6,1.5,1.2,.8,.7,1,1,.4,.5,1.2,.6],round=x=>Math.round((x+1e-9)*10)/10;
 assert.equal(qs.length,23);
 for(const p of e.targetAnalysis.profiles){const key=p.id==='weak'?'weak_subject':'strong_subject',scan=judgment.reduce((s,x)=>s+round(x*p.judgmentMultiplier),0),cost=execution.map(x=>round(x*p.executionMultiplier)),deps=qs.map(q=>q.prerequisites[key].reduce((s,id)=>s|(1<<qs.findIndex(q=>q.id===id)),0));near(scan,p.scanMinutes);let best=0;
  function visit(i,mask,minutes,points){if(minutes>100+1e-8)return;if(i===23){best=Math.max(best,points);return;}visit(i+1,mask,minutes,points);if(p.id==='weak'&&[11,13].includes(i))return;if((mask&deps[i])===deps[i])visit(i+1,mask|(1<<i),minutes+cost[i],points+qs[i].points);}
  visit(0,0,scan,0);assert.equal(best,p.maximum.points);const duration=ids=>scan+qs.reduce((s,q,i)=>s+(ids.includes(q.id)?cost[i]:0),0);near(duration(p.maximum.questionIds),p.maximum.minutes);near(duration(p.now.questionIds),p.now.minutes);assert.ok(p.now.minutes>100);assert.equal(p.targetPoints,p.id==='weak'?30:67);
 }
 assert.deepEqual(qs.reduce((a,q)=>(a[q.difficulty]=(a[q.difficulty]||0)+q.points,a),{}),{'基本レベル':26,'基本＋αレベル':35,'標準レベル':31,'発展レベル':8});
});
