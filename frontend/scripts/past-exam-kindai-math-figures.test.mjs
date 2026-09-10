import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {packageId,g,H,sectionRadius,project,circlePoint,markSupplement} from './build-kindai-2025-general-first-a-mathematics-figures.mjs';
import {isHandEditedFigure} from './lib/past-exam-figure-handoff.mjs';
import {reviewNotices,analysisReviewNotices} from '../src/lib/pastExamReviewNotices.mjs';
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
const near=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<e,`${a} vs ${b}`);
test('Kindai math: log domain, quadratic maximum and integer-angle counts',()=>{
 near(g(-1),3);near(g(.5),0);near(g(-.75),25/8);
 for(let x=0;x<2*Math.PI;x+=.002){near(g(Math.cos(x)),1-Math.cos(2*x)-3*Math.cos(x));assert.equal(g(Math.cos(x))>0,x>Math.PI/3&&x<5*Math.PI/3);}
 const anglesFor=value=>{const roots=[(-3-Math.sqrt(25-8*value))/4,(-3+Math.sqrt(25-8*value))/4];return roots.filter(t=>t>=-1&&t<.5).flatMap(t=>t===-1?[Math.PI]:[Math.acos(t),2*Math.PI-Math.acos(t)]);};
 const a=[1,2,3].flatMap(anglesFor);assert.equal(a.length,7);near(a.reduce((s,x)=>s+x,0),7*Math.PI);
 const exponent=Math.log(20)/Math.log(5);assert.ok((25/8)**exponent>8&&(25/8)**exponent<9);assert.ok(3**exponent>7&&3**exponent<8);
 const b=Array.from({length:8},(_,i)=>anglesFor((i+1)**(1/exponent))).flat();assert.equal(b.length,18);near(b.reduce((s,x)=>s+x,0),18*Math.PI);
 for(const x of [2*Math.PI/3,Math.PI,4*Math.PI/3]){const [t,y]=circlePoint(x);near(t*t+y*y,1);near(g(t),3);}
});
test('Kindai math: independent enumeration confirms coin cases and endpoint restrictions',()=>{
 const counts=n=>{let a=0,b=0;for(let mask=0;mask<2**n;mask++){const s=mask.toString(2).padStart(n,'0');if(!s.includes('11'))s.endsWith('1')?a++:b++;}return[a,b];};
 assert.deepEqual([2,3,4,5,10].map(counts),[[1,2],[2,3],[3,5],[5,8],[55,89]]);
 const cases=[];for(let m=0;m<32;m++){const s=m.toString(2).padStart(5,'0');if(s.includes('111')&&!s.includes('1111'))cases.push(s);}
 assert.deepEqual(cases.sort(),['00111','01110','10111','11100','11101']);
 const prob=(k,p)=>{let c=1;for(let j=1;j<=k;j++)c=c*(16-j)/j;return c*p**k*(1-p)**(15-k);};
 for(const p of [.751,.77,.777])assert.ok(prob(12,p)>prob(11,p)&&prob(12,p)>prob(13,p));
 near(prob(11,.75),prob(12,.75));near(prob(12,13/16),prob(13,13/16));
});
test('Kindai math: affine projection, perpendicular foot and section circle preserve geometry',()=>{
 near(H.reduce((a,b)=>a+b),4);const norm=v=>Math.hypot(...v),sub=(a,b)=>a.map((x,i)=>x-b[i]);
 near(norm(H),4*Math.sqrt(3)/3);near(norm(H)**2+sectionRadius**2,8);
 near(sectionRadius,4*Math.sqrt(2)*Math.sqrt(3)/6);
 const vertices=[[4,0,0],[0,4,0],[0,0,4]];
 const hp=project(H);hp.forEach((v,i)=>near(v,vertices.reduce((s,p)=>s+project(p)[i],0)/3));
 for(const v of vertices)near(norm(sub(v,H)),2*sectionRadius);
 const ab=sub(vertices[1],vertices[0]),ac=sub(vertices[2],vertices[0]);for(const v of [ab,ac])near(v.reduce((s,x,i)=>s+x*H[i],0),0);
});
test('Kindai math: area identity, admissible p and boundary extrema',()=>{
 const F=p=>-2*p**3+8*p*p-8*p+4;
 for(let p=0;p<=8/3;p+=.002){const d=p*(8-3*p),q=(4-p+Math.sqrt(d))/2,r=(4-p-Math.sqrt(d))/2;near(p*p+q*q+r*r,8);near(q*r,(p-2)**2);near(((p*p+q*q)*(p*p+r*r)-p**4)/4,F(p));assert.ok(F(p)>=44/27-1e-10);}
 near(F(0),4);near(F(2),4);near(F(2/3),44/27);near(F(8/3),44/27);near(Math.sqrt(44/27),2*Math.sqrt(33)/9);
});
test('Kindai math: 15 questions, point pie and target maxima agree with independent subset enumeration',()=>{
 const e=JSON.parse(read(`../src/data/pastExamAnalysisEvidence/${packageId}.json`)),qs=e.majorQuestions.flatMap(m=>m.subquestions),labels=['基本レベル','基本＋αレベル','標準レベル','発展レベル'];
 assert.equal(qs.length,15);assert.deepEqual(labels.map(d=>qs.filter(q=>q.difficulty===d).length),[4,4,4,3]);assert.deepEqual(labels.map(d=>qs.filter(q=>q.difficulty===d).reduce((s,q)=>s+q.points,0)),[23,24,28,25]);
 const times=[[.3,2.7],[.4,2.6],[.4,3.6],[.7,4.3],[.8,5.2],[.3,2.2],[.4,3.1],[.5,3.5],[.8,5.2],[.3,2.2],[.4,2.1],[.3,2.2],[.4,2.6],[.5,3.5],[.9,6.1]];
 for(const profile of ['weak','strong']){
  const scan=times.reduce((s,t)=>s+Math.round(t[0]*(profile==='weak'?4:1)*10),0),exec=times.map(t=>Math.round((t[1]*(profile==='weak'?1.5:1)+Number.EPSILON)*10));let best=0,minTime=Infinity;
  for(let mask=0;mask<2**15;mask++){let points=0,time=scan,valid=true;for(let i=0;i<15;i++)if(mask&(1<<i)){points+=qs[i].points;time+=exec[i];for(const id of qs[i].prerequisites[`${profile}_subject`])if(!(mask&(1<<qs.findIndex(q=>q.id===id))))valid=false;}if(valid&&time<=600&&(points>best||points===best&&time<minTime)){best=points;minTime=time;}}
  assert.equal(best,profile==='weak'?48:100);assert.equal(minTime,profile==='weak'?599:585);assert.equal(scan,profile==='weak'?296:74);
 }
 assert.ok(e.targetAnalysis); // Arithmetic is consistent; editorial review remains separate.
});
test('Kindai math: two semantic mark examples retain exact scoped mappings',()=>{
 const s=markSupplement();assert.equal(s.operations.length,2);for(const o of s.operations){assert.equal(o.scope,'shared');assert.equal(o.expectedMatches,1);assert.match(o.to,/<table/);assert.doesNotMatch(o.to,/<img|<svg/);}
 assert.match(s.operations[0].to,/>ア<\/th><td>−/);assert.match(s.operations[0].to,/>イ<\/th><td>8/);
 for(const [a,b] of [['ウ','−'],['エ','4'],['オ','5']])assert.ok(s.operations[1].to.includes(`>${a}</th><td>${b}`));
 const q=JSON.parse(read(`../src/data/generated/pastExamQuestions/${packageId}.json`));assert.equal((q.document.sharedInstructionsHtml.match(/data-kindai-mark-example/g)||[]).length,2);assert.doesNotMatch(q.document.sharedInstructionsHtml,/pending_redraw|replacement-pending/);
 assert.match(read('../src/styles/past-exam-batch.css'),/\.source-table\[data-kindai-mark-example\]\s*\{\s*max-width: 30rem;\s*margin-inline: auto;/);
});
test('Kindai math: original figure package retains fonts and unapproved source gates',()=>{
 const m=JSON.parse(read(`../src/data/pastExamFigures/${packageId}.json`));assert.equal(m.items.length,6);assert.equal(m.restrictedSourceCopied,false);assert.equal(m.review.needsHumanReview,true);
 const root=fileURLToPath(new URL('..',import.meta.url));for(const item of m.items){const svg=read(`../public${item.src}`);assert.doesNotMatch(svg,/<image|<foreignObject|<script|[≤≥]/);if(!isHandEditedFigure(root,packageId,item.id)){assert.match(svg,/KaTeX_Main/);assert.match(svg,/KaTeX_Math/);}}
 assert.equal(Object.keys(reviewNotices[packageId]).length,3);assert.match(analysisReviewNotices[packageId].message,/29.6分/);
});
