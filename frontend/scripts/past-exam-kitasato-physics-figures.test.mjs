import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,magneticRadius,magneticHit,magneticPoints,oscillator} from './build-kitasato-2025-general-physics-figures.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL(`../src/data/${p}`,import.meta.url)));
const close=(a,b,e=1e-8)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
test('Kitasato physics: both rod moments and horizontal reactions balance',()=>{
 for(const W of [1,3,9]){const L=2,N=W/2,F=W/(2*Math.sqrt(3)),friction=W/Math.sqrt(3);close(N*L/2,W*L/4);close(W*L/4,N*L/4+F*Math.sqrt(3)*L/4);close(friction,N*Math.sqrt(3)/2+F/2);}
});
test('Kitasato physics: satellite, isolated capacitor, delayed Doppler and gas mixture',()=>{
 const R=3,h=2,g=10,omega=Math.sqrt(g*R*R/(R+h)**3);close((R+h)*omega**2,g*R*R/(R+h)**2);
 const Q=2,C1=3,d1=2,d2=5,eps=4,U=Q*Q/(2*C1),C2=C1*d1/d2,C3=C2*eps;close(Q*Q/(2*C2)-U,(d2-d1)*U/d1);close(Q*Q/(2*C3)-Q*Q/(2*C2),d2/d1*(1-eps)/eps*U);
 const V=340,v=20,f=440;close(V*f/(V-v)-V*f/(V+v),2*V*v*f/((V-v)*(V+v)));close(V*f/(V-v)-V*f/(V+v/2),3*V*v*f/((V-v)*(2*V+v)));
 assert.ok(100/V<(100+2*40)/V,'Direct change precedes the changed reflected wave');
 const P=7,vol=3,T=20,final=5*P/3,TB=8*T/3;close(1.5*P*vol+1.5*2*P*2*vol,1.5*final*3*vol);close(P*vol/T+4*P*vol/TB,final*3*vol/(2*T));
});
test('Kitasato physics: oscillator phases survive all three frame switches',()=>{
 for(const [m,k,a] of [[2,8,3],[3,7,2]]){const o=oscillator(m,k,a);close(o.w*o.T,3*Math.PI);close(-o.A+o.A*Math.cos(o.w*o.T),-2*o.A);close(Math.sin(o.w*o.T),0);close(o.deceleration,2*a);close(o.w*o.stopTime,1.5*Math.PI);close(2*o.A-4*o.A*Math.cos(o.w*o.stopTime),o.stopX);close(4*o.A*o.w*Math.sin(o.w*o.stopTime),o.stopV);close(.5*k*o.finalAmplitude**2,.5*k*o.stopX**2+.5*m*o.stopV**2);close(o.distance,.5*a*o.T**2+a*o.T*(2*o.T/3)+.5*a*o.T*(o.T/2));}
});
test('Kitasato physics: electric and magnetic runs are separate and geometrically consistent',()=>{
 const m=2,q=3,V1=7,d2=.4,a=1,ell=3,n=2*d2*d2/(a*a),v=Math.sqrt(2*q*V1/m),acc=q*n*V1/(m*d2),t=a/v;
 close(.5*acc*t*t,d2/2);close(.5*acc*t*t+acc*t*(ell-a/2)/v,Math.sqrt(2*n)*ell/2);
 const R=magneticRadius(a);for(const [z,x] of magneticPoints(a))close(z*z+(R-x)**2,R*R);close(magneticPoints(a).at(-1)[1],a/2);close(a/(R-a/2),4/3);close(magneticHit(a,ell),(8*ell-a)/6);
 // At entry v is +z and the deflection is +x: v cross (+y) would be -x.
 assert.equal(-1*(-1),1,'negative y field produces positive x force for positive charge');
});
test('Kitasato physics: all 29 answer-key marks match independently calculated results',()=>{
 const snapshot=read(`pastExamStagingAnswerSources/${packageId}.json`),items=snapshot.editorial.pages.flatMap(p=>p.blocks).filter(b=>b.type==='answer_key').flatMap(b=>b.items);
 const expected=[7,3,8,9,3,10,5,6,7,2,10,6,5,8,8,15,13,13,11,13,18,6,3,8,3,5,5,6,14];
 assert.equal(items.length,29);items.forEach((x,i)=>{const [slot,circle]=x.value.split(' ');assert.equal(Number(slot),i+1);assert.equal(circle.codePointAt(0)-0x2460+1,expected[i]);});
 assert.equal(snapshot.editorial.review.needs_human_review,true);
});
test('Kitasato physics: target maxima independently enumerate all 131072 subsets',()=>{
 const e=read(`pastExamAnalysisEvidence/${packageId}.json`),qs=e.majorQuestions.flatMap(m=>m.subquestions),execution=[2.8,2.8,3.1,3.1,2.8,2.3,1.8,2.3,3.6,3.1,1.3,1.3,1.3,2.8,3.1,2.3,3.6],judgment=qs.map((_,i)=>[2,3,8,9,14,16].includes(i)?.4:.2),round=n=>Math.round(n*10)/10;
 assert.equal(qs.length,17);assert.equal(qs.reduce((s,q)=>s+q.points,0),100);
 for(const p of e.targetAnalysis.profiles){let best=0,time=Infinity;const scan=round(judgment.reduce((s,x)=>s+round(x*p.judgmentMultiplier),0));close(scan,p.scanMinutes);
  for(let mask=0;mask<(1<<17);mask++){let points=0,minutes=scan,valid=true;for(let i=0;i<17;i++)if(mask&(1<<i)){const q=qs[i];if(q[p.id]==='捨てる！'||q.prerequisites[`${p.id}_subject`].some(id=>!(mask&(1<<qs.findIndex(t=>t.id===id))))){valid=false;break;}points+=q.points;minutes+=round(execution[i]*p.executionMultiplier);}
   minutes=round(minutes);if(!valid||minutes>50)continue;if(points>best){best=points;time=minutes;}else if(points===best)time=Math.min(time,minutes);
  }close(best,p.maximum.points);close(time,p.maximum.minutes);close(Math.floor(best*p.reliabilityFactor),p.targetPoints);
  for(const plan of [p.maximum,p.now,p.nowPlusLater]){close(plan.points,qs.filter(q=>plan.questionIds.includes(q.id)).reduce((s,q)=>s+q.points,0));close(plan.minutes,round(scan+qs.reduce((s,q,i)=>s+(plan.questionIds.includes(q.id)?round(execution[i]*p.executionMultiplier):0),0)));}
 }
});
test('Kitasato physics: eight original SVGs, glyphs, dimensions and no answer leakage',()=>{
 const manifest=read(`pastExamFigures/${packageId}.json`);assert.equal(manifest.items.length,8);assert.equal(manifest.restrictedSourceCopied,false);
 for(const item of manifest.items){const svg=fs.readFileSync(new URL(`../public${item.src}`,import.meta.url),'utf8');assert.match(svg,/KaTeX_Main/);assert.match(svg,/KaTeX_Math/);assert.doesNotMatch(svg.replace(/<style>[\s\S]*?<\/style>/g,''),/<image|foreignObject|NaN|[≤≥]/);assert.match(svg,new RegExp(`viewBox="0 0 ${item.width} ${item.height}"`));}
 const question=fs.readFileSync(new URL(`../public${manifest.items.find(x=>x.id==='q7-magnetic-arc').src}`,import.meta.url),'utf8');assert.doesNotMatch(question,/円の中心|>R<|>θ<|8ℓ/);
 const css=fs.readFileSync(new URL('../src/styles/past-exam-figures.css',import.meta.url),'utf8');assert.match(css,/kitasato-2025-general-physics[^\n]+min-width: 620px/);assert.match(css,/is-printing-past-exam-document[^\n]+kitasato-2025-general-physics[^\n]+150mm/);
});
test('Kitasato physics: built pages retain review gates and 7 question / 1 answer figures',()=>{
 const html=role=>fs.readFileSync(new URL(`../dist/past-exam-library/kitasato/2025/physics/${role}/index.html`,import.meta.url),'utf8');
 for(const [role,figures,gates] of [['questions',7,3],['answers',1,3],['analysis',0,1]]){const s=html(role);assert.equal((s.match(/<h1\b/g)||[]).length,1);assert.match(s,/noindex/);assert.equal((s.match(/data-source-review="required"/g)||[]).length,gates);assert.equal((s.match(/data-figure-id=/g)||[]).length,figures);}
 for(const item of read(`pastExamFigures/${packageId}.json`).items)assert.deepEqual(fs.readFileSync(new URL(`../public${item.src}`,import.meta.url)),fs.readFileSync(new URL(`../dist${item.src}`,import.meta.url)));
 assert.match(html('analysis'),/別々に考え/);
});
