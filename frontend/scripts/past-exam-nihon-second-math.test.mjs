import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,f,df,ddf,x0,roots,volume,answerSupplement} from './build-nihon-u-2025-n-unified-first-mathematics-second-stage-figures.mjs';
import {applyAnswerSupplement} from './lib/past-exam-answer-supplements.mjs';
import {renderProjection} from './build-past-exam-staging-answers.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../src/data/'+p,import.meta.url)));
const near=(a,b,t=1e-7)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
function integral(fn,a,b,n=10000){let sum=0;for(let i=0;i<n;i++)sum+=fn(a+(i+.5)*(b-a)/n);return sum*(b-a)/n;}
test('Nihon second math: four definite integrals independently checked, including reversed limits',()=>{
 near(integral(x=>(x+Math.abs(x)+2)**2,-1,2),116/3,1e-6);
 near(integral(x=>Math.exp(2*x),1,Math.log(2)),2-Math.E**2/2);
 near(integral(x=>Math.sin(x)**2,0,Math.PI/6),Math.PI/12-Math.sqrt(3)/8);
 near(integral(x=>1/(x*x+9),0,3),Math.PI/12);
});
test('Nihon second math: tangent, extraneous negative-k root, and disk region',()=>{
 near(Math.sqrt(1/16),2/16+1/8);near(1/(2*Math.sqrt(1/16)),2);
 assert.deepEqual(roots(0),[0,.25]);for(const k of [0,.01,.08,.124]){const [a,b]=roots(k);assert.ok(a>=0&&b>a);near(Math.sqrt(a),2*a+k);near(Math.sqrt(b),2*b+k);near(integral(x=>Math.PI*x,a,b),volume(k));}
 const [a]=roots(-.1);assert.ok(2*a-.1<0);near(volume(0),Math.PI/32);near(volume(.125),0);
});
test('Nihon second math: derivative, inflection and both volume methods',()=>{
 for(const x of [0,.2,x0,1,2]){const h=1e-4;near((f(x+h)-f(x-h))/(2*h),df(x));near((df(x+h)-df(x-h))/(2*h),ddf(x));}
 near(ddf(x0),0);assert.ok(ddf(.5)<0&&ddf(1)>0);near(f(x0),Math.sqrt(6)/3);
 near(integral(f,0,x0),Math.log((Math.sqrt(6)+Math.sqrt(2))/2));
 const expected=(Math.sqrt(6)-2)*Math.PI;
 near(integral(x=>2*Math.PI*x*f(x),0,x0),expected);
 near(Math.PI*x0*x0*f(x0)+integral(y=>Math.PI*(1/(y*y)-1),f(x0),1),expected);
});
test('Crop-to-table supplement is exact, immutable and fails closed',()=>{
 const s=read(`pastExamStagingAnswerSources/${packageId}.json`),orig=JSON.stringify(s),supp=answerSupplement(),out=applyAnswerSupplement(s,supp);
 assert.equal(JSON.stringify(s),orig);assert.equal(out.pages.flatMap(p=>p.blocks).filter(b=>b.type==='crop').length,5);
 const table=out.pages.flatMap(p=>p.blocks).find(b=>b.type==='table');assert.equal(table.headers.length,5);assert.equal(table.rows.length,3);
 assert.throws(()=>applyAnswerSupplement({...s,sha256:'wrong'},supp),/hash mismatch/);
 for(const alteration of ['missing','duplicate','non-table','different-major']){const a=structuredClone(s),b=structuredClone(supp);if(alteration==='missing')b.operations[0].anchor.asset_id='other';if(alteration==='duplicate')a.editorial.pages[3].blocks.push({...b.operations[0].anchor});if(alteration==='non-table')b.operations[0].blocks[0].type='prose';if(alteration==='different-major')b.operations[0].blocks[0].major_question_id='major-question-01';assert.throws(()=>applyAnswerSupplement(a,b));}
});
test('Projected concavity table uses established compact curve arrows, not text markers',()=>{
 const s=read(`pastExamStagingAnswerSources/${packageId}.json`),p=renderProjection(s),html=p.document.majorQuestions.map(q=>q.html).join('');
 assert.equal((html.match(/class="past-exam-figure"/g)||[]).length,5);assert.ok(!html.includes('data-figure-placeholder'));assert.ok(!html.includes('[[trend:'));
 assert.match(html,/減少・上に凸/);assert.match(html,/減少・下に凸/);assert.match(html,/scope="row"/);assert.equal(p.source.independentlyReauthored,false);
});
test('Nihon second math: 512 subsets verify both target plans and replacement route',()=>{
 const e=read(`pastExamAnalysisEvidence/${packageId}.json`),qs=e.majorQuestions.flatMap(q=>q.subquestions),times=[3,2,2.4,3.2,5,6.3,3.2,5.4,7.5],judgments=[.3,.2,.2,.4,.6,.7,.3,.6,.9];
 for(const p of e.targetAnalysis.profiles){const scan=judgments.reduce((s,t)=>s+Math.round(t*p.judgmentMultiplier*10)/10,0);near(scan,p.scanMinutes);let max=0;const duration=ids=>scan+qs.reduce((s,q,i)=>s+(ids.includes(q.id)?Math.round(times[i]*p.executionMultiplier*10)/10:0),0);
 for(let mask=0;mask<512;mask++){const selected=qs.filter((q,i)=>mask>>i&1),ids=selected.map(q=>q.id);if(selected.some(q=>q.prerequisites[p.id==='weak'?'weak_subject':'strong_subject'].some(id=>!ids.includes(id))))continue;const score=selected.reduce((s,q)=>s+q.points,0);if(duration(ids)<=60+1e-8)max=Math.max(max,score);}
 assert.equal(max,p.maximum.points);near(duration(p.maximum.questionIds),p.maximum.minutes);assert.equal(p.targetPoints,p.id==='weak'?max:Math.floor(max*.8));
 }
 const w=e.targetAnalysis.profiles[0];assert.ok(w.now.questionIds.includes('math-q1-4')&&!w.maximum.questionIds.includes('math-q1-4'));
 assert.deepEqual(qs.reduce((a,q)=>(a[q.difficulty]=(a[q.difficulty]||0)+q.points,a),{}),{'基本＋αレベル':10,'基本レベル':15,'標準レベル':27,'発展レベル':8});
});
