import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,f,derivative,critical,zero,curvePoints,probabilityCases,answerSupplement} from './build-kitasato-2025-general-mathematics-figures.mjs';
import {applyAnswerSupplement} from './lib/past-exam-answer-supplements.mjs';
import {renderProjection} from './build-past-exam-staging-answers.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL(`../src/data/${p}`,import.meta.url)));
const snapshot=()=>read(`pastExamStagingAnswerSources/${packageId}.json`);
const close=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
function integrate(fn,a,b,n=10000){let s=fn(a)+fn(b);for(let i=1;i<n;i++)s+=(i%2?4:2)*fn(a+(b-a)*i/n);return s*(b-a)/(3*n);}
test('Kitasato: nearest-integer values and periodic integral',()=>{
 const N=x=>Math.floor(x+.5),distance=x=>Math.abs(x-N(x));assert.equal(N(3*Math.sqrt(7)),8);close(distance(Math.PI),Math.PI-3);
 for(let k=1;k<=100;k++){const x=Math.sqrt(k*k+k+1);assert.ok(x>k+.5&&x<k+1);assert.equal(N(x),k+1);close(distance(x),k+1-x);}
 close(integrate(distance,0,1)*2025,2025/4);
 close(3*Math.sqrt(7)-.5,Math.sqrt(252)/2-.5); // Raw reconstruction's first > must be =.
});
test('Kitasato: two orthogonality conditions and internal/external division',()=>{
 for(const x of [1,4,8,13]){const s=(x-3)/9,t=(12-x)/(3*x);close(12*s+x*(t-1),0);close(3*(s-1)+t*x,0);}
 const x=4,s=(x-3)/9,t=(12-x)/(3*x);close(t/s,6);close(1/(s+t),9/7);
 close((12-x)/(3*x),(2*x-6)/3);assert.equal(7*7-4*2*12,-47);
 const A=[0,0],B=[6,0],C=[2,2*Math.sqrt(3)],R=B.map((b,i)=>s*b+t*C[i]);
 const area=(U,V,W)=>Math.abs((V[0]-U[0])*(W[1]-U[1])-(V[1]-U[1])*(W[0]-U[0]))/2;
 close(area(B,C,R),area(A,B,C)*2/9);close(area(B,C,R),4*Math.sqrt(3)/3);
});
test('Kitasato: equally likely card identities produce five value sequences',()=>{
 assert.deepEqual(probabilityCases(),[{values:[0,3,5],count:1},{values:[1,3,4],count:1},{values:[2,3,3],count:2},{values:[3,4,1],count:1},{values:[3,5,0],count:1}]);
 close(probabilityCases().reduce((s,c)=>s+c.count,0)/64,3/32);close((1/4*1/2)/(1/4*1/2+3/4*1/4),2/5);
 let p=1/4;for(let n=1;n<=12;n++){close(p,1/3-(1/3)*(.25**n));p=p*.5+(1-p)*.25;}
});
test('Kitasato: function domain, extrema, zero and shaded region',()=>{
 close(derivative(critical),0);close(f(critical),-Math.sqrt(5));close(f(zero),0);close(f(-1),-2);close(f(1),2);
 for(const [x,y] of curvePoints()){assert.ok(x>=-1&&x<=1);close(y,f(x),1e-7);assert.ok(y>=-Math.sqrt(5)-1e-9&&y<=2);}
 for(let x=-.999;x<.999;x+=.01){assert.equal(Math.sign(derivative(x)),x<critical?-1:1);assert.ok(x+1>f(x));}
 close(integrate(t=>(1-Math.sin(t)+Math.cos(t))*Math.cos(t),0,Math.PI/2),.5+Math.PI/4);
});
test('Kitasato: x-axis discs and y-axis shells/discs agree independently',()=>{
 close(Math.PI*integrate(x=>f(x)**2,0,zero),Math.PI*(2*Math.sqrt(5)-4)/3);
 const g=y=>(2*y+Math.sqrt(5-y*y))/5;
 for(let y=-1;y<=2;y+=.02){const x=g(y);assert.ok(x>=0&&x<=1);close(f(x),y,1e-7);}
 close(Math.PI*(integrate(y=>g(y)**2,-1,2)-1/3),Math.PI);
 close(2*Math.PI*integrate(t=>Math.sin(t)*(1-Math.sin(t)+Math.cos(t))*Math.cos(t),0,Math.PI/2),Math.PI);
});
test('Kitasato: ellipse distance ratio and support-rectangle circumradius',()=>{
 for(let t=0;t<2*Math.PI;t+=.03){const x=2*Math.cos(t),y=Math.sqrt(3)*Math.sin(t);close(2*Math.hypot(x-1,y),Math.abs(4-x));}
 for(const m of [-10,-1,-.1,0,.3,1,10]){const n=Math.sqrt(4*m*m+3),a=4*m*m+3,b=8*m*n,c=4*n*n-12;close(b*b-4*a*c,0,1e-7);close((4*m*m+3)/(m*m+1)+(3*m*m+4)/(m*m+1),7);}
});
test('Kitasato: target maxima enumerate all 1024 dependency-closed subsets',()=>{
 const e=read(`pastExamAnalysisEvidence/${packageId}.json`),qs=e.majorQuestions.flatMap(m=>m.subquestions),execution=[8,10,10,5,7,10,12,4,7,12],judgment=[.6,.8,.8,.4,.5,.6,.8,.4,.5,.8];
 for(const profile of e.targetAnalysis.profiles){
  const round=n=>Math.round(n*10)/10,scan=round(judgment.reduce((s,x)=>s+round(x*profile.judgmentMultiplier),0));close(scan,profile.scanMinutes);
  let bestPoints=0,bestTime=Infinity;
  for(let mask=0;mask<1024;mask++){
   const selection=qs.filter((_,i)=>mask&(1<<i)),ids=selection.map(q=>q.id);
   if(selection.some(q=>q[profile.id]==='捨てる！'||q.prerequisites[`${profile.id}_subject`].some(id=>!ids.includes(id))))continue;
   const minutes=round(scan+qs.reduce((s,_,i)=>s+(mask&(1<<i)?round(execution[i]*profile.executionMultiplier):0),0)),points=selection.reduce((s,q)=>s+q.points,0);
   if(minutes>80)continue;if(points>bestPoints){bestPoints=points;bestTime=minutes;}else if(points===bestPoints)bestTime=Math.min(bestTime,minutes);
  }
  close(bestPoints,profile.maximum.points);close(bestTime,profile.maximum.minutes);close(Math.floor(bestPoints*profile.reliabilityFactor),profile.targetPoints);
  const selected=profile.maximum.questionIds;const minutes=round(scan+qs.reduce((s,q,i)=>s+(selected.includes(q.id)?round(execution[i]*profile.executionMultiplier):0),0));close(minutes,profile.maximum.minutes);
 }
});
test('Answer supplements: immutable, narrowly scoped and fail closed after source changes',()=>{
 const s=snapshot(),before=JSON.stringify(s),supplement=answerSupplement(),out=applyAnswerSupplement(s,supplement);
 assert.equal(JSON.stringify(s),before);assert.equal(out.pages.flatMap(p=>p.blocks).filter(b=>b.type==='table').length,2);
 assert.throws(()=>applyAnswerSupplement({...s,sha256:'changed'},supplement),/hash mismatch/);
 const missing=structuredClone(supplement);missing.operations[0].anchor.text='missing';assert.throws(()=>applyAnswerSupplement(s,missing),/got 0/);
 const duplicate=structuredClone(s);duplicate.editorial.pages[0].blocks.push({...supplement.operations[0].anchor});assert.throws(()=>applyAnswerSupplement(duplicate,supplement),/got 2/);
 const bad=structuredClone(supplement);bad.operations[0].blocks[1].rows[0].pop();assert.throws(()=>applyAnswerSupplement(s,bad),/Malformed/);
 const other=structuredClone(supplement);other.operations[0].blocks[0].major_question_id='other';assert.throws(()=>applyAnswerSupplement(s,other),/same major/);
 assert.throws(()=>applyAnswerSupplement({...s,editorial:out},supplement),/already present/);
});
test('Kitasato: projection preserves source provenance and supplies semantic table diagonals',()=>{
 const result=renderProjection(snapshot()),html=result.document.majorQuestions.map(q=>q.html).join('');
 assert.equal((html.match(/<table /g)||[]).length,2);assert.equal((html.match(/class="answer-table__diagonal"/g)||[]).length,2);
 assert.doesNotMatch(html,/\[\[no-value\]\]|>未定義</);assert.match(html,/和が8になる5種類/);assert.match(html,/scope="row"/);
 assert.equal(result.source.contentProvenance,'editorial_adaptation_import');assert.equal(result.source.independentlyReauthored,false);assert.equal(result.source.supplement.contentProvenance,'original_editorial');
 const manifest=read(`pastExamFigures/${packageId}.json`);assert.equal(manifest.items.length,1);assert.equal(manifest.restrictedSourceCopied,false);
 const svg=fs.readFileSync(new URL(`../public${manifest.items[0].src}`,import.meta.url),'utf8');assert.match(svg,/data-region="S"/);assert.match(svg,/KaTeX_Math/);assert.match(svg,/KaTeX_Main/);assert.doesNotMatch(svg,/<image|foreignObject|[≤≥]/);
});
test('Kitasato: built routes retain scoped review gates, one graph and both readable tables',()=>{
 const html=role=>fs.readFileSync(new URL(`../dist/past-exam-library/kitasato/2025/mathematics/${role}/index.html`,import.meta.url),'utf8');
 const q=html('questions'),a=html('answers'),analysis=html('analysis');
 for(const body of [q,a,analysis]){assert.equal((body.match(/<h1\b/g)||[]).length,1);assert.match(body,/noindex/);}
 assert.equal((a.match(/data-figure-id="ans-q2-function-graph"/g)||[]).length,1);assert.equal((q.match(/data-figure-id="ans-q2-function-graph"/g)||[]).length,0);
 assert.equal((a.match(/<table /g)||[]).length,2);assert.equal((a.match(/class="answer-table__diagonal"/g)||[]).length,2);
 assert.equal((a.match(/data-source-review="required"/g)||[]).length,3);assert.equal((q.match(/data-source-review="required"/g)||[]).length,3);assert.equal((analysis.match(/data-source-review="required"/g)||[]).length,1);
 const figure=read(`pastExamFigures/${packageId}.json`).items[0];assert.deepEqual(fs.readFileSync(new URL(`../public${figure.src}`,import.meta.url)),fs.readFileSync(new URL(`../dist${figure.src}`,import.meta.url)));
});
