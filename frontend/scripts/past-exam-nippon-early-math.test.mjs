import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,tetrahedron,minus,dot3,scale,F,dF,rotate,inverse,minimumPoint,answerSupplement} from './build-nippon-medical-2025-general-early-mathematics-figures.mjs';
import {applyAnswerSupplement} from './lib/past-exam-answer-supplements.mjs';
import {renderProjection} from './build-past-exam-staging-answers.mjs';
const near=(a,b,t=1e-7)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
const norm=a=>Math.sqrt(dot3(a,a));
const read=p=>JSON.parse(fs.readFileSync(new URL('../src/data/'+p,import.meta.url)));
test('Nippon early math: probability mode and 507 pure-imaginary cases',()=>{
 for(let k=0;k<2025;k++){const ratio=2*(2025-k)/(k+1);assert.equal(ratio>1,k<1350);}
 const ks=Array.from({length:2026},(_,k)=>k).filter(k=>((3*k-2025)%8+8)%8===2||((3*k-2025)%8+8)%8===6);
 assert.equal(ks.length,507);assert.equal(ks[0],1);assert.equal(ks.at(-1),2025);assert.ok(ks.every(k=>k%4===1));
 for(let n=1;n<=12;n++)for(let k=0;k<=n;k++){const angle=(3*k-n)*Math.PI/4,r=2**((2*k-n)/2);near(r,Math.sqrt(2)**k/Math.sqrt(2)**(n-k));near(Math.cos(angle),Math.cos(k*Math.PI/2-(n-k)*Math.PI/4));}
});
test('Nippon early math: all six edge lengths, foot, incenter and collinearity',()=>{
 const p=tetrahedron();for(const [a,b,length] of [['O','A',1],['O','B',1],['A','B',1],['A','C',2],['O','C',Math.sqrt(3)],['B','C',Math.sqrt(3)]])near(norm(minus(p[a],p[b])),length);
 for(const v of [minus(p.B,p.A),minus(p.C,p.A)])near(dot3(p.H,v),0);
 near(norm(p.H),Math.sqrt(6)/3);near(norm(minus(p.A,p.H)),Math.sqrt(3)/3);
 const AI=minus(p.I,p.A),AH=minus(p.H,p.A);AI.forEach((v,i)=>near(v,(3-Math.sqrt(3))*AH[i]));
 const distanceLine=(q,a,b)=>{const v=minus(b,a),w=minus(q,a);return norm(minus(w,scale(v,dot3(w,v)/dot3(v,v))));};
 const r=distanceLine(p.I,p.A,p.B);near(r,distanceLine(p.I,p.B,p.C));near(r,distanceLine(p.I,p.C,p.A));
});
test('Nippon early math: projected height and required area determine x',()=>{
 const x=(2-Math.sqrt(3))/4,p=tetrahedron(x);near(dot3(minus(p.D,p.J),p.H),0);
 near(norm(minus(p.H,p.J))/norm(p.H),1-x);
 const area=norm(minus(p.I,p.H))*norm(minus(p.H,p.J))/2;near(area,Math.sqrt(2)/24);
});
test('Nippon early math: rotation, global distance minimum and endpoint',()=>{
 assert.deepEqual(rotate([1,3,4]),[1,5,-4.440892098500626e-16]);
 inverse([2,1,0]).forEach((x,i)=>near(x,minimumPoint[i]));near(norm(minus([1,3,4],minimumPoint)),Math.sqrt(17));
 for(const p of [0,.1,.5,1,1.6,3]){near((F(p+1e-5)-F(p-1e-5))/2e-5,dF(p),1e-5);assert.ok(F(p)>=17);}
 near(F(0),26);near(F(1),17);near(dF(0),-10);
 for(let k=0;k<=5;k+=.25)for(let theta=0;theta<2*Math.PI;theta+=.2){const r=Math.sqrt(k/2),X=[k,r*Math.cos(theta),r*Math.sin(theta)];assert.ok(dot3(minus([1,3,4],X),minus([1,3,4],X))>=17-1e-10);}
});
test('Nippon early math: integral equation, primitive, even part and integral',()=>{
 const f=x=>(3+Math.cos(x))/(1+Math.exp(x)),g=x=>Math.exp(x)/(1+Math.exp(x))+Math.sin(x)/(3+Math.cos(x));
 const G=x=>Math.log(2*(1+Math.exp(x))/(3+Math.cos(x)));
 near(f(0),2);near(G(0),0);
 for(const x of [-3,-1,0,1,3]){near((f(x+1e-5)-f(x-1e-5))/2e-5,-g(x)*f(x));near((G(x+1e-5)-G(x-1e-5))/2e-5,g(x));near(Math.exp(G(x))*f(x),2);near(f(x)+f(-x),3+Math.cos(x));}
 let sum=0;const n=10000;for(let i=0;i<n;i++)sum+=f(-Math.PI+(i+.5)*2*Math.PI/n);near(sum*2*Math.PI/n,3*Math.PI);
});
test('Nippon early math: exact supplement keeps source immutable and semantic table readable',()=>{
 const s=read(`pastExamStagingAnswerSources/${packageId}.json`),before=JSON.stringify(s),supp=answerSupplement(),e=applyAnswerSupplement(s,supp);
 assert.equal(JSON.stringify(s),before);const t=e.pages.flatMap(p=>p.blocks).find(b=>b.type==='table');assert.equal(t.headers.length,5);assert.equal(t.rows.length,2);assert.equal(t.rows[0][1],'\\(-10\\)');
 assert.throws(()=>applyAnswerSupplement({...s,sha256:'changed'},supp),/hash mismatch/);
 const bad=structuredClone(supp);bad.operations[0].anchor.latex='missing';assert.throws(()=>applyAnswerSupplement(s,bad));
 const p=renderProjection(s),html=p.document.majorQuestions.map(q=>q.html).join('');assert.equal((html.match(/class="past-exam-figure"/g)||[]).length,5);assert.ok(!html.includes('data-figure-placeholder'));assert.match(html,/scope="row"/);assert.equal(p.source.independentlyReauthored,false);
});
test('Nippon early math: all 16384 subsets verify target points, times and prerequisites',()=>{
 const e=read(`pastExamAnalysisEvidence/${packageId}.json`),qs=e.majorQuestions.flatMap(q=>q.subquestions);
 const exec=[6.2,4.5,7.2,2.7,6.3,7.2,10.8,3.5,1.8,2.7,10.8,3.6,7,4.4],judge=[.8,.5,.8,.3,.7,.8,1.2,.5,.2,.3,1.2,.4,1,.6],round=x=>Math.round((x+1e-9)*10)/10;
 for(const p of e.targetAnalysis.profiles){const key=p.id==='weak'?'weak_subject':'strong_subject',scan=judge.reduce((s,x)=>s+round(x*p.judgmentMultiplier),0);near(scan,p.scanMinutes);let max=0;
 const duration=ids=>scan+qs.reduce((s,q,i)=>s+(ids.includes(q.id)?round(exec[i]*p.executionMultiplier):0),0);
 for(let mask=0;mask<2**qs.length;mask++){const selected=qs.filter((_,i)=>mask>>i&1),ids=selected.map(q=>q.id);if(selected.some(q=>q.prerequisites[key].some(id=>!ids.includes(id))))continue;if(duration(ids)<=90+1e-8)max=Math.max(max,selected.reduce((s,q)=>s+q.points,0));}
 assert.equal(max,p.maximum.points);near(duration(p.maximum.questionIds),p.maximum.minutes);near(duration(p.now.questionIds),p.now.minutes);assert.equal(p.targetPoints,p.id==='weak'?max:Math.floor(max*.8));
 }
 const w=e.targetAnalysis.profiles[0];assert.deepEqual(w.now.questionIds.filter(id=>!w.maximum.questionIds.includes(id)),['math-q2-2','math-q3-3']);assert.ok(w.now.minutes>90);
 assert.deepEqual(qs.reduce((a,q)=>(a[q.difficulty]=(a[q.difficulty]||0)+q.points,a),{}),{'標準レベル':145,'基本＋αレベル':35,'基本レベル':50,'発展レベル':70});
});
