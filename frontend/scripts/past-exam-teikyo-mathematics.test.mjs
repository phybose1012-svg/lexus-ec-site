import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,g,absolute,F,derivative,alpha,beta,sine,triangle,supplement} from './build-teikyo-2025-mathematics-figures.mjs';
import {applyAnswerSupplement} from './lib/past-exam-answer-supplements.mjs';
import {renderProjection} from './build-past-exam-staging-answers.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../src/data/'+p,import.meta.url)));
const near=(a,b,e=1e-8)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
test('Teikyo: dice enumeration, sum bounds, divisor sums and log domain',()=>{
 let ascending=0,multiple=0,reciprocal=0;const counts={};
 for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)for(let c=1;c<=6;c++){if(a<b&&b<c)ascending++;if(a*b*c%20===0)multiple++;const n=a*b*c/(a*b+b*c+c*a);if(Number.isInteger(n)){reciprocal++;counts[n]=(counts[n]||0)+1;}assert.ok(1/a+1/b+1/c>=.5-1e-10&&1/a+1/b+1/c<=3);}
 assert.equal(ascending,20);assert.equal(multiple,42);assert.equal(reciprocal,11);assert.deepEqual(counts,{1:10,2:1});
 let sum=0,inv=0;for(let a=0;a<=3;a++)for(let b=0;b<=2;b++)for(let c=0;c<=1;c++){sum+=2**a*3**b*5**c;inv+=1/(2**a*3**b*5**c);}near(sum,1170);near(inv,13/4);
 for(const x of [-.9,0,4,5,7])assert.equal(Math.log(x+1)/Math.log(Math.sqrt(2))-Math.log(5*x+11)/Math.log(2)<-1e-10,x<5);
});
test('Teikyo: plotted extrema, endpoints and cubic derivative identity',()=>{
 near(g(-1),-4);near(g(1),2);near(g(.5),11/4);for(let i=0;i<=200;i++){const t=-1+i/100;assert.ok(g(t)>=-4&&g(t)<=11/4);}
 near(absolute(-1),-2);near(absolute(1),-2);near(absolute(0),-1);near(absolute(Math.sqrt(3)),0);
 for(const x of [alpha,beta])near(derivative(x),0);near(F(alpha),-8+6*Math.sqrt(3));near(F(beta),-8-6*Math.sqrt(3));
 for(let i=-40;i<=60;i++){const x=i/10;near(F(x),derivative(x)*(x-1)/3-6*x-2);near(F(x)-2,(x+1)*(x*x-4*x-2));}
 assert.ok(derivative(alpha-1)>0&&derivative(1)<0&&derivative(beta+1)>0);
});
test('Teikyo: integral coefficients and vector length bridge',()=>{
 // Substitute f(x)=Ax+B into the original identity, not only its derivative.
 const A=1,B=.75,k1=A/2+B,k2=2*B,a=2/3;
 near(A,4-2*k2);near(B,-3+3*k1);near(A+B,7/4);
 for(const x of [-3,-1,0,.5,1,4])near(A*x*x/2+B*x-3*x*k1+x*x*k2+2*A/3,2*x*x-3*x+a);
 const p=-3,q=13/6;near(15/4+7*p/3+3*q/2,0);near(7/3+3*p/2+q,0);
 const t=(4-Math.sqrt(7))/4;assert.ok(t>0&&t<1);near(25*(1-t)**2+18*t*(1-t)+9*t*t,16);
 let count=0,joint=0;for(let i=1;i<=6;i++)for(let j=1;j<=6;j++)for(let k=1;k<=6;k++)if(i!==j&&j!==k&&i!==k&&k>i&&k>j){count++;if(k===6)joint++;}assert.equal(count,40);assert.equal(joint,20);near(joint/count,.5);
 let sum=0;for(let k=1;k<=21;k++)sum+=1/(Math.sqrt(3*k+1)+Math.sqrt(3*k-2));near(sum,7/3);
});
test('Teikyo: triangle is not right angled and sine interval is closed',()=>{
 const {A,B,C}=triangle,len=(p,q)=>Math.hypot(p[0]-q[0],p[1]-q[1]);near(len(A,B),7);near(len(B,C),3);near(len(A,C),Math.sqrt(30));
 const angA=Math.acos(5/Math.sqrt(30)),angB=Math.acos(2/3);near(angB,2*angA);assert.ok(Math.PI-angA-angB>Math.PI/2);near(Math.cos(angA),Math.sqrt(30)/6);
 for(let i=0;i<=200;i++){const x=2*Math.PI*i/200;near(sine(x),2*Math.sin(x+Math.PI/3));}
 near(sine(0),Math.sqrt(3));near(sine(2*Math.PI),Math.sqrt(3));near(sine(2*Math.PI/3),0);near(sine(5*Math.PI/3),0);near(sine(Math.PI/6),2);near(sine(7*Math.PI/6),-2);
});
test('Teikyo: one HTML table, four independent SVGs and five unresolved semantic crops',()=>{
 const s=read(`pastExamStagingAnswerSources/${packageId}.json`),original=JSON.stringify(s),a=applyAnswerSupplement(s,supplement());assert.equal(JSON.stringify(s),original);const ts=a.pages.flatMap(p=>p.blocks).filter(b=>b.type==='table');assert.equal(ts.length,1);assert.equal(ts[0].variant,'variation');assert.deepEqual(ts[0].rows[0].slice(1),['+','0','−','0','+']);assert.throws(()=>applyAnswerSupplement({...s,sha256:'new'},supplement()),/hash mismatch/);
 const m=read(`pastExamFigures/${packageId}.json`);assert.equal(m.items.length,4);assert.equal(m.restrictedSourceCopied,false);for(const f of m.items){const svg=fs.readFileSync(new URL('../public'+f.src,import.meta.url),'utf8');assert.match(svg,/KaTeX_Main/);assert.match(svg,/KaTeX_Math/);assert.ok(!/<image|foreignObject|[≤≥]/.test(svg));}
 const p=renderProjection(s),html=p.document.majorQuestions.map(q=>q.html).join('');assert.equal((html.match(/class="past-exam-figure"/g)||[]).length,4);assert.equal((html.match(/data-figure-placeholder/g)||[]).length,3);assert.equal(p.source.independentlyReauthored,false);
 const e=read(`pastExamAnalysisEvidence/${packageId}.json`);assert.equal(e.targetAnalysis,null);assert.equal(e.majorQuestions.flatMap(m=>m.subquestions).length,25);const d=read(`pastExamAnalysisSources/${packageId}.json`);assert.equal(d.targetReviewStatus,'source-repair-required');assert.ok(d.majorQuestions.flatMap(m=>m.subquestions).every(q=>q.title.length<25));
});
test('Teikyo: aggregate 119.9 minute plan violates the separate 60 minute day budgets',()=>{
 const qs=read(`pastExamAnalysisEvidence/${packageId}.json`).majorQuestions.flatMap(m=>m.subquestions);
 const judge=[.5,1,1.5,.7,.8,1,.2,.2,.7,.5,1.2,.6,.4,.8,1.2,.3,1.3,.7,.7,.7,.8,.7,.3,.3,.5];
 const execute=[1.5,6,7,4,3.5,4,.8,1,3,2.5,7,3.5,2,5,5.5,1.2,6.5,4,2.5,2.5,4,2.5,2,1,3],round=x=>Math.round((x+1e-9)*10)/10;
 const selected=['math1-q1-1','math1-q1-4','math1-q2-1','math1-q2-2','math1-q2-3','math1-q2-4','math1-q3-1','math1-q3-2','math2-q1-1','math2-q3-1','math2-q3-2','math2-q4-1','math2-q4-2','math2-q4-3'];
 const dayMinutes=day=>round(qs.reduce((s,q,i)=>s+(q.id.startsWith(day)?round(judge[i]*4)+(selected.includes(q.id)?round(execute[i]*1.5):0):0),0));
 near(dayMinutes('math1'),66.2);near(dayMinutes('math2'),53.7);near(dayMinutes('math1')+dayMinutes('math2'),119.9);assert.equal(qs.filter(q=>selected.includes(q.id)).reduce((s,q)=>s+q.points,0),107);
 for(const day of ['math1','math2'])assert.equal(qs.filter(q=>q.id.startsWith(day)).reduce((s,q)=>s+q.points,0),100);
 for(const q of qs.filter(q=>selected.includes(q.id)))for(const dep of q.prerequisites.weak_subject)assert.ok(selected.includes(dep));assert.ok(dayMinutes('math1')>60);assert.ok(read('pastExamBatch/target-review-holds.json')[packageId]);
});
