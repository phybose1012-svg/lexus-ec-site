import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,f,g,gp,remainder,vertices,H,R,add,mul,sub,dot3,sectionPieces,crossSection,volume,operationCount,answerSupplement} from './build-kurume-2025-general-early-mathematics-figures.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL(`../src/data/${p}`,import.meta.url)));
const close=(a,b,e=1e-8)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
test('Kurume: logarithmic constraints and simultaneous equality cases',()=>{
 const x=.75,y=1.5;close(1/x+1/y,2);close((1/x+1/y)*(4*x+y),9);close(4*x+y,4.5);
 for(const a of [.2,2,7]){const b=a**.5;close(a**x,b**y);close(a**x,Math.sqrt(a*b));}
 const [u,v,w]=[2,1,2];close(1/u+1/v+1/w,2);close(u+4*v+w,8);
 for(const a of [.5,2,3]){const b=a*a,c=a;close(a**u*b**v,a*b*c);close(b**v*c**w,a*b*c);}
});
test('Kurume: tetrahedron inner products, foot and CH intersection',()=>{
 const {O,A,B,C}=vertices;for(const [a,b] of [[O,A],[O,B],[O,C],[A,B],[B,C],[C,A]])close(dot3(sub(a,b),sub(a,b)),1);
 const P=mul(B,.5),Q=mul(C,1/3),ap=sub(P,A),aq=sub(Q,A);
 close(dot3(H,ap),0);close(dot3(H,aq),0);close(-.1+.2+.9,1);
 for(const x of [1,-.1,3]){const OD=add(add(mul(A,x),mul(P,-2*x)),mul(Q,-9*x));close(dot3(OD,ap),0);close(dot3(OD,aq),0);}
 const hit=add(C,mul(sub(H,C),10/7));hit.forEach((v,i)=>close(v,R[i]));close(R[2],0);assert.ok(H[2]>0);
});
test('Kurume: polynomial quotient, extrema and interpolating curves',()=>{
 for(const x of [-3,-1,-.5,0,1,2,4])close(g(x),gp(x)*(x/4-1/6)+remainder(x));
 close(f(-1),2);close(f(-.5),7/4);close(-.5*(-1)+1.5,f(-1));close(-.5*(-.5)+1.5,f(-.5));
 for(const sign of [-1,1]){const x=(1+sign*Math.sqrt(5))/2;close(gp(x),0);close(g(x),(1+sign*5*Math.sqrt(5))/2);close(g(x),remainder(x));assert.ok(gp(x-.01)<0&&gp(x+.01)>0);}
 close(g(1),7);assert.ok(gp(.99)>0&&gp(1.01)<0);close(remainder(1),7);
 const tables=answerSupplement().operations.flatMap(o=>o.blocks).filter(b=>b.type==='table');assert.equal(tables.length,2);for(const t of tables)t.rows.forEach(r=>assert.equal(r.length,t.headers.length));
});
test('Kurume: integer operations are counted forward, not from the proposed answer',()=>{
 assert.deepEqual(Array.from({length:15},(_,i)=>i+2).filter(n=>operationCount(n,2)===4),[6,7,16]);
 for(const c of [2,3,7]){const counts=Array(6).fill(0);for(let n=2;n<=c**5;n++){const steps=operationCount(n,c);if(steps<=5)counts[steps]++;}
 close(counts[1],1);close(counts[2],c-1);for(let n=3;n<=5;n++)close(counts[n],counts[n-1]+(c-1)*counts[n-2]);
 if(c===7)for(let n=1;n<=5;n++)close(counts[n],(8*3**(n-1)-3*(-2)**(n-1))/5);}
});
const polyArea=pts=>Math.abs(pts.reduce((s,[x,y],i)=>s+x*pts[(i+1)%pts.length][1]-y*pts[(i+1)%pts.length][0],0))/2;
const inside=(p,pts)=>{let yes=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const [x,y]=pts[i],[u,v]=pts[j];if((y>p[1])!==(v>p[1])&&p[0]<(u-x)*(p[1]-y)/(v-y)+x)yes=!yes;}return yes;};
test('Kurume: disjoint region areas and union of four moving-disk capsules',()=>{
 for(const r of [.2,.75,1]){const {polygons,caps}=sectionPieces(r);assert.deepEqual([1,2,3,4].map(k=>polygons.filter(p=>p.kind===k).length),[2,1,2,4]);assert.equal(caps.length,8);
 const area=polygons.reduce((s,p)=>s+polyArea(p.pts),0)+8*Math.PI*r*r/2;close(area,crossSection(r));
 for(let i=0;i<85;i++)for(let j=0;j<85;j++){const p=[-6+(i+.321)*12/85,-6+(j+.217)*12/85];
 const union=[0,Math.PI/4,Math.PI/2,3*Math.PI/4].some((a,k)=>{const len=k%2?5*Math.SQRT2:5,u=p[0]*Math.cos(a)+p[1]*Math.sin(a),v=-p[0]*Math.sin(a)+p[1]*Math.cos(a);return v*v+Math.max(0,Math.abs(u)-len)**2<r*r;});
 const count=polygons.filter(q=>inside(p,q.pts)).length+caps.filter(c=>{const d=sub(p,c.center);return dot3(d,d)<r*r&&d[0]*Math.cos(c.theta)+d[1]*Math.sin(c.theta)>0;}).length;
 assert.equal(count,Number(union),`r=${r}, point=${p}`);}}
 // Substitute t=sin(u) to integrate smoothly through both end sections.
 const n=4000,h=Math.PI/n;let sum=0;for(let i=0;i<=n;i++){const u=-Math.PI/2+i*h;sum+=(i===0||i===n?1:i%2?4:2)*crossSection(Math.cos(u))*Math.cos(u);}close(sum*h/3,volume,1e-6);
});
test('Kurume: every answer-key slot retains its independently checked value',()=>{
 const e=read(`pastExamStagingAnswerSources/${packageId}.json`),values=e.editorial.pages.flatMap(p=>p.blocks).filter(b=>b.type==='answer_key').flatMap(b=>b.items).map(i=>i.value);
 assert.deepEqual(values,['ア 2／イ 9／ウ 3／エ 4／オ 3／カ 2／キ 9／ク 2','ケ 2／コ 1／サ 2／シ 8','ス 1／セ 2／ソ 1／タ 3／チ 9／ツ 2','テ 1／ト 1／ナ 3／ニ 7','ヌ 1／ネ 3','ノ 1／ハ 1／ヒ 4／フ 9／ヘ 2','ホ 1／マ 7／ミ 1／ム 5／メ 1／モ 5／ヤ 5','ユ 4／ヨ 9／ラ 2','リ 3','ル ②／レ ④／ロ ②','ワ 4／ヲ 3／ン 1／あ 5／い 8／う 3／え 3／お 2','か 4／き 1／く 2／け 2／こ 2','さし 76／すせ 32／そ 1']);assert.equal(e.editorial.review.needs_human_review,true);
});
test('Kurume: all 8192 target subsets respect rounded times and dependencies',()=>{
 const e=read(`pastExamAnalysisEvidence/${packageId}.json`),qs=e.majorQuestions.flatMap(m=>m.subquestions),exec=[7.8,9.6,8.9,10.6,4.3,4.4,7,9.8,2.4,5.9,11.5,10.6,7.1],judge=[1.2,1.4,1.1,1.4,.7,.6,1,1.2,.6,1.1,1.5,1.4,.9],round=x=>Math.round((x+1e-10)*10)/10;
 assert.equal(qs.length,13);assert.equal(qs.reduce((s,q)=>s+q.points,0),100);
 for(const p of e.targetAnalysis.profiles){const scan=round(judge.reduce((s,v)=>s+round(v*p.judgmentMultiplier),0));close(scan,p.scanMinutes);let best=0,time=Infinity;
 for(let mask=0;mask<8192;mask++){let points=0,minutes=scan,valid=true;for(let i=0;i<13;i++)if(mask&(1<<i)){const q=qs[i];if(q[p.id]==='捨てる！'||q.prerequisites[`${p.id}_subject`].some(id=>!(mask&(1<<qs.findIndex(t=>t.id===id))))){valid=false;break;}points+=q.points;minutes+=round(exec[i]*p.executionMultiplier);}minutes=round(minutes);if(!valid||minutes>90)continue;if(points>best){best=points;time=minutes;}else if(points===best)time=Math.min(time,minutes);}
 close(best,p.maximum.points);close(time,p.maximum.minutes);close(Math.floor(best*p.reliabilityFactor),p.targetPoints);
 for(const plan of [p.maximum,p.now,p.nowPlusLater]){close(plan.points,qs.filter(q=>plan.questionIds.includes(q.id)).reduce((s,q)=>s+q.points,0));close(plan.minutes,round(scan+qs.reduce((s,q,i)=>s+(plan.questionIds.includes(q.id)?round(exec[i]*p.executionMultiplier):0),0)));}}
});
test('Kurume: seven original, self-contained SVGs match the build',()=>{
 const manifest=read(`pastExamFigures/${packageId}.json`);assert.equal(manifest.items.length,7);assert.equal(manifest.restrictedSourceCopied,false);
 for(const item of manifest.items){const raw=fs.readFileSync(new URL(`../public${item.src}`,import.meta.url)),svg=raw.toString();assert.match(svg,/KaTeX_Main/);assert.match(svg,/KaTeX_Math/);assert.doesNotMatch(svg.replace(/<style>[\s\S]*?<\/style>/g,''),/<image|foreignObject|NaN|[≤≥]/);assert.deepEqual(raw,fs.readFileSync(new URL(`../dist${item.src}`,import.meta.url)));}
 for(const [role,count] of [['questions',2],['answers',5],['analysis',0]]){const h=fs.readFileSync(new URL(`../dist/past-exam-library/kurume/2025/mathematics/${role}/index.html`,import.meta.url),'utf8');assert.equal((h.match(/data-figure-id=/g)||[]).length,count);assert.match(h,/noindex/);assert.equal((h.match(/<h1\b/g)||[]).length,1);assert.equal((h.match(/data-source-review="required"/g)||[]).length,role==='analysis'?1:5);if(role==='answers')assert.equal((h.match(/<table class="source-table answer-table answer-table--variation"/g)||[]).length,2);}
});
