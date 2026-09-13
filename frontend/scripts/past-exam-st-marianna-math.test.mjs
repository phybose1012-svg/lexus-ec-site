import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,a,alpha,beta,g,parabola,reflect,critical,words,cores,equalNeighbors,insertions,tRoots,xCount,supplement} from './build-st-marianna-2025-mathematics-figures.mjs';
import {applyAnswerSupplement} from './lib/past-exam-answer-supplements.mjs';
import {renderProjection} from './build-past-exam-staging-answers.mjs';
import {withReviewNotice} from '../src/lib/pastExamReviewNotices.mjs';
const near=(a,b,eps=1e-8)=>assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`);
const read=p=>JSON.parse(fs.readFileSync(new URL('../src/data/'+p,import.meta.url)));
test('St Marianna math: positive nth root and exponent bridge',()=>{
 for(const x of [.1,.5,1,2,7])for(let n=2;n<=7;n++)for(let m=2;m<=7;m++){near(Math.log((x**m)**(1/n)),m*Math.log(x**(1/n)));assert.ok(x**(m/n)>0);near(Math.log((x**m)**n),Math.log(x)*(m*n));}
 // The bridge uses mn=nm; equality of nth powers alone is insufficient for even n.
 assert.equal((-2)**4,2**4);assert.notEqual(-2,2);
});
test('St Marianna math: exhaustive words, six insertion gaps and all answer slots',()=>{
 const all=words([3,4,3]);assert.equal(all.length,4200);assert.equal(new Set(all).size,4200);
 const left=all.filter(w=>w[0]==='a'),ends=left.filter(w=>w.at(-1)==='b'),valid=ends.filter(w=>!equalNeighbors(w));
 assert.equal(left.length,1260);assert.equal(ends.length,560);assert.equal(valid.length,36);
 const cs=cores();assert.equal(cs.length,10);assert.deepEqual(cs.map(equalNeighbors),[5,3,3,3,3,1,1,3,1,3]);
 for(const w of cs){const matches=valid.filter(s=>s.replaceAll('c','')===w);assert.deepEqual(insertions(w).sort(),matches.sort());}
 assert.equal(insertions('aabbbab').length,1);assert.equal(insertions('ababbab').length,10);
 assert.equal(cs.reduce((n,w)=>n+insertions(w).length,0),36);
});
test('St Marianna math: piecewise branches, extrema and original-x multiplicities',()=>{
 for(const [t,y] of critical)near(g(t),y);
 for(let i=0;i<=10000;i++){const x=2*Math.PI*i/10000,t=Math.sin(x),y=4*Math.sin(x)+Math.abs(2*Math.cos(2*x)+1);near(y,g(t));assert.ok(y>=-2*Math.sqrt(3)-1e-9&&y<=5+1e-9);}
 assert.ok(g(a-.001)>g(a)&&g(a+.001)>g(a));assert.ok(g(.5-.001)<4&&g(.5+.001)<4);
 assert.equal(tRoots(3).length,1);near(tRoots(3)[0],0);near(xCount(3),3);
 for(const [k,n] of [[-4,0],[-2*Math.sqrt(3),2],[-3.2,4],[-3,3],[0,2],[2*Math.sqrt(3),4],[3.6,6],[4,4],[4.5,2],[5,1],[6,0]])assert.equal(xCount(k),n,`k=${k}`);
 for(const k of [3.5,3.6,3.8,3.99]){assert.equal(tRoots(k).length,3);assert.ok(tRoots(k).every(t=>t>0&&t<1));}
});
test('St Marianna math: polar coordinates, reflection, equivalent squaring and area',()=>{
 for(const [theta,r] of [[3*Math.PI/4,4+2*Math.sqrt(2)],[7*Math.PI/4,4-2*Math.sqrt(2)]]){near(2/(1-Math.sin(theta)),r);near(2/(1+Math.cos(theta)),r);const x=r*Math.cos(theta),y=r*Math.sin(theta);near(y,parabola(x));near(x,1-y*y/4);near(y,-x);}
 for(let i=0;i<=100;i++){const x=-6+i/10,y=parabola(x),[X,Y]=reflect([x,y]);near(Math.hypot(x,y),y+2);assert.ok(y>=-1);near(X,1-Y*Y/4);near(Math.hypot(X,Y),2-X);assert.ok(X<=1);near((x+X)/2+(y+Y)/2,0);near((X-x)-(Y-y),0);assert.deepEqual(reflect([X,Y]),[x,y]);}
 let area=0;const N=20000;for(let i=0;i<N;i++){const x=alpha+(beta-alpha)*(i+.5)/N,h=-x-parabola(x);assert.ok(h>0);near(h,(x-alpha)*(beta-x)/4);area+=2*h*(beta-alpha)/N;}near(area,32*Math.sqrt(2)/3,1e-7);
 near(beta-alpha,4*Math.sqrt(2));near((beta-alpha)**3/12,32*Math.sqrt(2)/3);
 const s=1/Math.sqrt(2);for(const [x,y] of [[-s,s],[s,-s]]){near(x*x+y*y,1);near(y,-x);}
});
test('St Marianna math: SHA-bound tables, all diagrams and preserved review provenance',()=>{
 const s=read(`pastExamStagingAnswerSources/${packageId}.json`),before=JSON.stringify(s),adapted=applyAnswerSupplement(s,supplement());assert.equal(JSON.stringify(s),before);
 const tables=adapted.pages.flatMap(p=>p.blocks).filter(b=>b.type==='table');assert.deepEqual(tables.map(t=>t.rows.length),[10,3,3]);tables.forEach(t=>t.rows.forEach(r=>assert.equal(r.length,t.headers.length)));
 assert.throws(()=>applyAnswerSupplement({...s,sha256:'changed'},supplement()),/hash mismatch/);
 const m=read(`pastExamFigures/${packageId}.json`);assert.equal(m.items.length,3);assert.equal(m.restrictedSourceCopied,false);assert.equal(m.review.needsHumanReview,true);
 for(const f of m.items){const svg=fs.readFileSync(new URL('../public'+f.src,import.meta.url),'utf8');assert.ok(svg.includes('KaTeX_Main')&&svg.includes('KaTeX_Math'));assert.ok(!/[≤≥]/.test(svg));assert.ok(!/<image|foreignObject/.test(svg));}
 const p=renderProjection(s),html=p.document.majorQuestions.map(q=>withReviewNotice(q.html,packageId,q.id)).join('');assert.equal((html.match(/class="past-exam-figure"/g)||[]).length,3);assert.equal((html.match(/data-source-review="required"/g)||[]).length,4);assert.ok(!html.includes('data-figure-placeholder'));assert.equal(p.source.independentlyReauthored,false);
 const authored=read(`pastExamAnalysisSources/${packageId}.json`);assert.equal(authored.majorQuestions.flatMap(m=>m.subquestions).length,15);assert.ok(authored.majorQuestions.flatMap(m=>m.subquestions).every(q=>q.title.length<25));
});
test('St Marianna math: all 32768 subsets, dependency closure and honest replacement timing',()=>{
 const e=read(`pastExamAnalysisEvidence/${packageId}.json`),qs=e.majorQuestions.flatMap(m=>m.subquestions),judgment=[.5,1.5,.5,.5,.5,1.5,2,1,1,1.5,2,1,1,1,2],execution=[2.5,8,2.5,3,3,7,12,5,7,7,9,5,6,6,13],round=x=>Math.round((x+1e-9)*10)/10;
 assert.equal(qs.length,15);assert.deepEqual(qs.reduce((d,q)=>(d[q.difficulty]=(d[q.difficulty]||0)+q.points,d),{}),{'基本レベル':13,'標準レベル':40,'基本＋αレベル':25,'発展レベル':22});
 for(const p of e.targetAnalysis.profiles){const key=p.id==='weak'?'weak_subject':'strong_subject',scan=judgment.reduce((n,x)=>n+round(x*p.judgmentMultiplier),0),cost=execution.map(x=>round(x*p.executionMultiplier)),deps=qs.map(q=>q.prerequisites[key].reduce((s,id)=>s|(1<<qs.findIndex(q=>q.id===id)),0));near(scan,p.scanMinutes);near(scan,p.id==='weak'?70:17.5);let best=0;
  for(let mask=0;mask<32768;mask++){if(p.id==='weak'&&[6,10,14].some(i=>mask&(1<<i)))continue;let minutes=scan,points=0,valid=true;for(let i=0;i<15;i++)if(mask&(1<<i)){if((mask&deps[i])!==deps[i]){valid=false;break;}minutes+=cost[i];points+=qs[i].points;}if(valid&&minutes<=90+1e-8)best=Math.max(best,points);}
  assert.equal(best,p.maximum.points);for(const plan of [p.maximum,p.now,p.nowPlusLater]){near(scan+qs.reduce((s,q,i)=>s+(plan.questionIds.includes(q.id)?cost[i]:0),0),plan.minutes);near(qs.reduce((s,q)=>s+(plan.questionIds.includes(q.id)?q.points:0),0),plan.points);for(const q of qs)if(plan.questionIds.includes(q.id))for(const d of q.prerequisites[key])assert.ok(plan.questionIds.includes(d));}
  assert.equal(p.targetPoints,p.id==='weak'?26:68);near(p.maximum.minutes,p.id==='weak'?89.6:88.5);near(p.now.minutes,p.id==='weak'?101.6:79.5);
  if(p.id==='weak'){assert.ok(p.now.minutes>90);assert.ok(p.now.questionIds.some(q=>!p.maximum.questionIds.includes(q)));}else assert.ok(p.now.minutes<=90&&p.now.points>=p.targetPoints);
 }
});
