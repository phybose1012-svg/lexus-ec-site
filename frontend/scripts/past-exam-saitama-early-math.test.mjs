import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {geometry,minimumDisplacement,ratioDerivative,exponential,exponentialDerivative,supplement,packageId,draw} from './build-saitama-medical-2025-general-early-mathematics-figures.mjs';
import {applyAnswerSupplement} from './lib/past-exam-answer-supplements.mjs';
import {renderProjection} from './build-past-exam-staging-answers.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
const read=p=>JSON.parse(fs.readFileSync(new URL('../src/data/'+p,import.meta.url)));
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const area=(a,b,c)=>Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))/2;
test('Saitama early math: exponential minimum and translated complex rotation',()=>{
 const a=Math.log(3)/2;near(exponentialDerivative(a),0);near(exponential(a),2*Math.sqrt(3));
 for(const x of [-3,-1,0,1,3]){assert.ok(exponential(x)>=2*Math.sqrt(3));assert.equal(exponentialDerivative(x)>0,x>a);}
 const r=Math.SQRT1_2,real=(1-3)*r+1,imag=(1+3)*r-2;near(real,-(Math.sqrt(2)-1));near(imag,2*(Math.sqrt(2)-1));
});
test('Saitama early math: moving points and ratio maximum, not the misprinted slot',()=>{
 for(const k of [.1,.4,1,2,3,6]){const d=minimumDisplacement(k),f=a=>(10-a)**2+(20-k*a)**2;near(-2*(10-d)-2*k*(20-k*d),0);assert.ok(f(d-1)>f(d));assert.ok(f(d+1)>f(d));}
 near(minimumDisplacement(1),15);near(minimumDisplacement(3),7);
 near(Math.hypot(10-15,20-15),5*Math.sqrt(2));near(Math.hypot(10-7,20-21),Math.sqrt(10));
 const k=(Math.sqrt(5)-1)/2;near(ratioDerivative(k),0);assert.ok(ratioDerivative(k-.1)>0);assert.ok(ratioDerivative(k+.1)<0);
});
test('Saitama early math: all incidences, perpendicularity, point order and similarity',()=>{
 for(const t of [1.1,Math.sqrt(3),2.2,3,5]){const g=geometry(t);near(g.P[0]**2+g.P[1]**2,1);for(const key of ['C','Q','P','R'])near(g[key][1],t*g[key][0]-1);for(const key of ['B','P','T','S'])near(g[key][1],1-g[key][0]/t);
 near((g.B[0]-g.P[0])*(g.C[0]-g.P[0])+(g.B[1]-g.P[1])*(g.C[1]-g.P[1]),0);
 assert.ok(g.Q[0]<g.A[0]&&g.A[0]<g.S[0]);assert.ok(g.P[0]<g.T[0]&&g.R[1]>g.T[1]);
 near(area(g.P,g.B,g.C)/area(g.P,g.Q,g.S),4*t*t/(t*t-1)**2);near(dist(g.B,g.C)/dist(g.Q,g.S),dist(g.P,g.B)/dist(g.P,g.Q));}
 const g=geometry(Math.sqrt(3));near(area(g.P,g.B,g.C)/area(g.P,g.Q,g.S),3);near(dist(g.P,g.T),(2*Math.sqrt(3)-3)/3);
 const ta=[g.A[0]-g.T[0],g.A[1]-g.T[1]],tp=[g.P[0]-g.T[0],g.P[1]-g.T[1]];near((ta[0]*tp[0]+ta[1]*tp[1])/(Math.hypot(...ta)*Math.hypot(...tp)),-.5);
 assert.throws(()=>geometry(1));assert.ok(!draw('question').includes('α'));assert.ok(!draw('question').includes('β'));
});
test('Saitama early math: enumerate 1001 candy distributions and all fixed-A cases',()=>{
 const counts=Array(11).fill(0);for(let a=0;a<=10;a++)for(let b=0;b<=10-a;b++)for(let c=0;c<=10-a-b;c++)for(let d=0;d<=10-a-b-c;d++)counts[a]++;
 assert.equal(counts.reduce((s,x)=>s+x,0),1001);counts.forEach((n,k)=>assert.equal(n,(11-k)*(12-k)*(13-k)/6));assert.equal(counts[10],1);
});
test('Saitama early math: exact SHA-bound semantic tables and imported provenance',()=>{
 const s=read(`pastExamStagingAnswerSources/${packageId}.json`),before=JSON.stringify(s),e=applyAnswerSupplement(s,supplement());assert.equal(JSON.stringify(s),before);
 const ts=e.pages.flatMap(p=>p.blocks).filter(b=>b.type==='table');assert.equal(ts.length,2);ts.forEach(t=>t.rows.forEach(r=>assert.equal(r.length,t.headers.length)));assert.equal(ts[1].rows[0][1],'[[no-value]]');
 assert.throws(()=>applyAnswerSupplement({...s,sha256:'changed'},supplement()),/hash mismatch/);
 const p=renderProjection(s),html=p.document.majorQuestions.map(q=>q.html).join('');assert.equal((html.match(/class="past-exam-figure"/g)||[]).length,2);assert.ok(!html.includes('data-figure-placeholder'));assert.match(html,/scope="row"/);assert.equal(p.source.independentlyReauthored,false);
});
test('Saitama early math: all 1024 subsets verify targets, timing and dependencies',()=>{
 const e=read(`pastExamAnalysisEvidence/${packageId}.json`),qs=e.majorQuestions.flatMap(q=>q.subquestions),exec=[2.5,3.5,2.5,3,5.5,2.5,6.5,4,3,2.5],judge=[.5,.6,.5,.5,.8,.5,.8,.6,.4,.4],round=x=>Math.round((x+1e-9)*10)/10;
 for(const p of e.targetAnalysis.profiles){const key=p.id==='weak'?'weak_subject':'strong_subject',scan=judge.reduce((s,x)=>s+round(x*p.judgmentMultiplier),0);near(scan,p.scanMinutes);let max=0;
 const duration=ids=>scan+qs.reduce((s,q,i)=>s+(ids.includes(q.id)?round(exec[i]*p.executionMultiplier):0),0);
 for(let mask=0;mask<1024;mask++){const selected=qs.filter((_,i)=>mask>>i&1),ids=selected.map(q=>q.id);if(p.id==='weak'&&ids.some(id=>['math-q2-3','math-q3-2','math-q3-3'].includes(id)))continue;if(selected.some(q=>q.prerequisites[key].some(id=>!ids.includes(id))))continue;if(duration(ids)<=50+1e-8)max=Math.max(max,selected.reduce((s,q)=>s+q.points,0));}
 assert.equal(max,p.maximum.points);near(duration(p.maximum.questionIds),p.maximum.minutes);near(duration(p.now.questionIds),p.now.minutes);assert.equal(p.targetPoints,p.id==='weak'?60:80);
 }
 assert.deepEqual(qs.reduce((a,q)=>(a[q.difficulty]=(a[q.difficulty]||0)+q.points,a),{}),{'基本＋αレベル':60,'基本レベル':10,'標準レベル':20,'発展レベル':10});
});
