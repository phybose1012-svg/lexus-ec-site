import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,circular,descent,descendingPoints,balloon,circuit} from './build-kurume-2025-general-early-physics-figures.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL(`../src/data/${p}`,import.meta.url)));
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
test('Kurume physics: circular force components and mass/height scaling',()=>{
 for(const theta of [.3,.6,1]){const m=2,g=9.8,v=3,a=circular(m,g,theta,v);close(a.normal*Math.sin(theta),m*g);close(a.normal*Math.cos(theta),m*v*v/a.radius);close(a.radius/a.height,Math.tan(theta));close(a.period*v,2*Math.PI*a.radius);
 const b=circular(m,g,theta,v*Math.sqrt(2)),c=circular(2*m,g,theta,v*Math.sqrt(8));close(b.potential,2*a.potential);close(b.kinetic,m*v*v);close(c.kinetic+c.potential,16*(a.kinetic+a.potential));close(c.height,8*v*v/g);}
});
test('Kurume physics: descending endpoints conserve energy and satisfy the extra product condition',()=>{
 for(const [h1,h2] of [[3,1.5],[6,2],[4,3]]){const g=10,d=descent(h1,h2,g);close(h1*Math.sqrt(d.v1sq),h2*Math.sqrt(d.v2sq));close(d.v1sq/2+g*h1,d.v2sq/2+g*h2);}
 const g=9.8,v1=2,h1=3*v1*v1/g,h2=h1/2;close(descent(h1,h2,g).v1sq,v1*v1);close(g*h1,6*v1*v1/2);
 const pts=descendingPoints();assert.ok(pts[0][2]>pts.at(-1)[2]);for(let i=1;i<pts.length;i++){assert.ok(pts[i][2]<=pts[i-1][2]);assert.ok(Math.abs(pts[i][0]-315)<=(500-pts[i][1])*210/430+1);}
});
test('Kurume physics: open balloon density, threshold and final equilibrium; volume is required in n',()=>{
 for(const V of [2,5,11]){const rho0=1.2,M1=.4*V,M2=.2*V,T0=300,g=9.8,b=balloon(rho0,V,M1,M2,T0);close(rho0*V*g,(M1+b.rho1*V)*g);close((b.T1-T0)/b.T1,M1/(rho0*V));close(b.rhoh-b.rho2,M2/V);close(b.rhoh/b.rho2,b.T1/T0);assert.ok(b.rhoh<rho0&&b.rho2<b.rho1);
 const R=8.314,m=.029,P=rho0*R*T0/m;close(P*V,(rho0*V/m)*R*T0);assert.notEqual(P*V,(rho0/m)*R*T0);close(b.rho1/rho0,T0/b.T1);}
});
test('Kurume physics: terminal voltage, maximum power, measurements and parallel resistance',()=>{
 const r=(1.50-1.30)/(.60-.20),E=1.50+.20*r;close(r,.5);close(E,1.6);close(E-1.20*r,1);close((E-1.20*r)*1.20,1.20);const ext=(E-1.20*r)/1.20;close(1/(1/ext-1),5);
 for(const R of [.1,.3,.5,.8,2,10]){const c=circuit(E,r,R);close(c.V,E-r*c.I);close(c.P,c.I*c.I*R);close(c.P,E*E/((Math.sqrt(R)-r/Math.sqrt(R))**2+4*r));assert.ok(c.P<=circuit(E,r,r).P+1e-9);}close(E-r*0,E);
});
test('Kurume physics: all 28 source answer keys retained without treating imported prose as approved',()=>{
 const e=read(`pastExamStagingAnswerSources/${packageId}.json`).editorial,items=e.pages.flatMap(p=>p.blocks).filter(x=>x.type==='answer_key').flatMap(x=>x.items);
 const normalize=s=>s.replaceAll('\\(','').replaceAll('\\)','').replaceAll('{}','').replace(/\s/g,'');
 const expected=String.raw`\frac{mg}{\sin\theta}|\frac{mg}{\tan\theta}|（カ）|\frac{v_0^2\tan\theta}{g}|\frac{2\pi v_0\tan\theta}{g}|mv_0^2|\frac{8v_0^2}{g}|\sqrt{v_1^2+2g(h_1-h_2)}|\frac{2gh_2^2}{h_1+h_2}|h_1=\frac{3v_1^2}{g},\qquad h_2=\frac{3v_1^2}{2g}|n_0RT_0|\frac{mP_g}{RT_0}|小さくなる|\frac{T_0}{T}\rho_0|(M_1+\rho_1V)g|\frac{\rho_0V}{\rho_0V-M_1}T_0|\frac{M_1}{\rho_0V}|\frac{M_2}{V}|\frac{T_1}{T_0}|\frac{M_2T_0}{M_1T_1}\rho_0|E|\frac{RE}{R+r}|\frac{E}{R+r}|\frac{E^2R}{(R+r)^2}|r|0.50\,\Omega|1.20\,\mathrm{W}|5.00\,\Omega`.split('|');
 assert.deepEqual(items.map(x=>normalize(x.value)),expected.map(normalize));assert.equal(e.provenance,'editorial_adaptation');assert.equal(e.review.needs_human_review,true);
});
test('Kurume physics: target prerequisite failure stays deferred; independent model calculation is not publication approval',()=>{
 const e=read(`pastExamAnalysisEvidence/${packageId}.json`),s=read(`pastExamAnalysisSources/${packageId}.json`),qs=e.majorQuestions.flatMap(m=>m.subquestions);assert.equal(qs.length,28);assert.equal(qs.reduce((v,q)=>v+q.points,0),100);assert.equal(e.targetAnalysis,null);assert.equal(s.targetReviewStatus,'source-repair-required');
 const now=qs.filter(q=>q.weak==='今解く！').map(q=>q.id),bad=qs.filter(q=>now.includes(q.id)).flatMap(q=>q.prerequisites.weak_subject.filter(id=>!now.includes(id)).map(id=>[q.id,id]));assert.deepEqual(bad,[['phys-q2-7','phys-q2-6']]);
 // Enumerate every local subset and combine minimum execution costs by points.
 const execution=[1.4,1.3,.8,1.8,1.2,1.8,2.4,1.3,2.5,2.7,.8,1.2,1,1.1,1.5,2.2,1.5,1.2,1.5,2.3,.7,1,.9,1.1,2.2,1.5,1.6,1.5];
 const judgment=[.2,.2,.2,.3,.2,.3,.4,.2,.4,.4,.2,.2,.2,.2,.3,.4,.3,.2,.3,.4,.2,.2,.2,.2,.4,.3,.3,.3];const round=n=>Math.round((n+1e-9)*10)/10;
 for(const [profile,mult,scan,expectedPts,expectedTime] of [['weak_subject',1.5,30.4,63,58.9],['strong_subject',1,7.6,100,49.6]]){close(judgment.reduce((a,b)=>a+b,0)*(profile==='weak_subject'?4:1),scan);let best=new Map([[0,0]]),offset=0;
 for(const major of e.majorQuestions){const local=new Map();for(let mask=0;mask<2**major.subquestions.length;mask++){const chosen=major.subquestions.filter((_,i)=>mask&(1<<i));if(chosen.some(q=>q.prerequisites[profile].some(id=>!chosen.some(p=>p.id===id))))continue;let pts=0,time=0;major.subquestions.forEach((q,i)=>{if(mask&(1<<i)){pts+=q.points;time+=round(execution[offset+i]*mult);}});local.set(pts,Math.min(local.get(pts)??Infinity,round(time)));}offset+=major.subquestions.length;
 const next=new Map();for(const [p,t] of best)for(const [p2,t2] of local)next.set(p+p2,Math.min(next.get(p+p2)??Infinity,round(t+t2)));best=next;}
 const viable=[...best].filter(([,t])=>round(t+scan)<=60).sort((a,b)=>b[0]-a[0]);assert.equal(viable[0][0],expectedPts);close(viable[0][1]+scan,expectedTime);
 }
});
test('Kurume physics: four editable self-contained figures and scoped published review boundaries',()=>{
 const m=read(`pastExamFigures/${packageId}.json`);assert.equal(m.items.length,4);assert.equal(m.restrictedSourceCopied,false);assert.equal(m.review.needsHumanReview,true);
 for(const x of m.items){const svg=fs.readFileSync(new URL(`../public${x.src}`,import.meta.url),'utf8');assert.match(svg,/KaTeX_Main/);assert.match(svg,/KaTeX_Math/);assert.match(svg,new RegExp(`viewBox="0 0 ${x.width} ${x.height}"`));assert.doesNotMatch(svg.replace(/<style>[\s\S]*?<\/style>/g,''),/<image|foreignObject|NaN|[≤≥]/);assert.equal(svg,fs.readFileSync(new URL(`../dist${x.src}`,import.meta.url),'utf8'));}
 for(const [role,count] of [['questions',4],['answers',0],['analysis',0]]){const h=fs.readFileSync(new URL(`../dist/past-exam-library/kurume/2025/physics/${role}/index.html`,import.meta.url),'utf8');assert.equal((h.match(/data-figure-id=/g)||[]).length,count);assert.equal((h.match(/<h1\b/g)||[]).length,1);assert.match(h,/noindex/);assert.equal((h.match(/data-source-review="required"/g)||[]).length,role==='analysis'?1:3);}
});
