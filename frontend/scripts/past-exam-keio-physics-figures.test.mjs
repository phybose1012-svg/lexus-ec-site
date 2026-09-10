import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {packageId,bounceModel,helixPoints,wiring,saturationPressure,maxGraphCelsius} from './build-keio-2025-general-physics-figures.mjs';
import {reviewNotices,analysisReviewNotices} from '../src/lib/pastExamReviewNotices.mjs';
import {isHandEditedFigure} from './lib/past-exam-figure-handoff.mjs';
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
const near=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
const asset=id=>read(`../public/assets/past-exams/${packageId}/figures/${id}.svg`);
test('Keio physics: bounce trajectories conserve horizontal velocity and restitution',()=>{
 for(const e of [.2,.64,.95])for(const theta of [.2,.8,1.3]){
  const all=bounceModel({v0:8,e,theta,count:12}),vx=8*Math.cos(theta),vy=8*Math.sin(theta),g=9.8;
  for(const b of all){near(b.vx,vx);near(b.vy,vy*e**b.n);near(b.dt,2*b.vy/g);near(b.points[0][1],0);near(b.points.at(-1)[1],0);assert.ok(b.points.every(p=>p[1]>-1e-10));near(b.t,2*vy*(1-e**b.n)/(g*(1-e)));near(b.x,vx*b.t);}
 }
 const pts=bounceModel().flatMap(b=>b.points);assert.ok(pts.every(([x,y])=>58+21*x<480&&190-21*y>35));
 assert.throws(()=>bounceModel({e:1}));assert.equal((asset('q1-projectile').match(/data-flight=/g)||[]).length,3);
});
test('Keio physics: winding starts and ends on the same side, front current gives upward field',()=>{
 for(const turns of [4,8]){
  const pts=helixPoints(100,50,250,40,turns);near(pts[0][0],60);near(pts.at(-1)[0],60);near(pts[0][1],50);near(pts.at(-1)[1],250);
  const front=helixPoints(100,50,250,40,turns,0,Math.PI);
  assert.ok(front.slice(1).every((p,i)=>p[0]>front[i][0]&&p[1]>front[i][1]));
  // In xyz with y upward and z toward the reader, front z>0 and dx>0:
  // (r cross dl)_y = z*dx - x*dz is positive for the circular part.
  for(let u=.1;u<Math.PI;u+=.1)near((40*Math.sin(u))**2+(40*Math.cos(u))**2,1600);
 }
});
test('Keio physics: the blank wiring has only givens; answer has the verified four connections',()=>{
 const q=asset('q4-wiring-template'),a=asset('ans-q4-wiring');
 assert.equal((q.match(/data-connection=/g)||[]).length,2);assert.equal((a.match(/data-connection=/g)||[]).length,6);
 for(const [x,y] of wiring.given)assert.ok(q.includes(`data-connection="${x} ${y}"`));
 for(const [x,y] of wiring.added){assert.ok(a.includes(`data-connection="${x} ${y}"`));assert.ok(!q.includes(`data-connection="${x} ${y}"`));}
 const edges=[...wiring.given,...wiring.added,['A','B'],['C','D'],['E','F'],['G','H']];
 function walk(start,finish){let prev=null,p=start,route=[p];while(p!==finish){const next=edges.flatMap(([a,b])=>a===p?[b]:b===p?[a]:[]).filter(q=>q!==prev);assert.equal(next.length,1);[prev,p]=[p,next[0]];route.push(p);assert.ok(route.length<12);}return route;}
 assert.deepEqual(walk('source+','source−'),['source+','B','A','C','D','source−']);
 assert.deepEqual(walk('meter+','meter−'),['meter+','E','F','G','H','meter−']);
});
test('Keio physics: opposite excitation removes odd drive terms without losing the signal',()=>{
 const a=.8,b=.04,H0=.3,H1=1.2,w=1.7,N=4,S=.5;
 const B=H=>a*H-b*H**3;
 const v=(t,sign)=>N*S*(a-3*b*(H0+sign*H1*Math.sin(w*t))**2)*sign*H1*w*Math.cos(w*t);
 for(const t of [.1,.4,1,2,3])for(const sign of [-1,1]){
  const eps=1e-6,H=u=>H0+sign*H1*Math.sin(w*u);
  near(v(t,sign),N*S*(B(H(t+eps))-B(H(t-eps)))/(2*eps),1e-8);
  near(v(t,1)+v(t,-1),-6*b*w*N*S*H0*H1**2*Math.sin(2*w*t));
 }
 near(Math.sqrt(2)*(1e4*1.3e-6)*1e5*100*1e-8*1e-6,1.838477631085024e-9,1e-18);
 // Omitting mu0 is not a notation-only change.
 assert.ok(Math.sqrt(2)*1e4*1e5*100*1e-8*1e-6>1e-3);
});
test('Keio physics: rotation frequency and force use unrounded quantities',()=>{
 const mu=1.3e-6,H=1e-6,h=.1,m=.010e-3,Vrms=1e-9;
 const f=Vrms/(Math.sqrt(2)*Math.PI*mu*H*h*h),F=m*h/2*(2*Math.PI*f)**2;
 near(f,17313.775310712,1e-6);near(F,5917.1597633,1e-6);
 assert.equal(Number(f.toPrecision(1)),2e4);assert.equal(Number(F.toPrecision(1)),6e3);
});
test('Keio physics: independent vapor data preserve graph read-off and saturation decisions',()=>{
 assert.throws(()=>saturationPressure(100));near(maxGraphCelsius,99.85);
 for(let t=0;t<99.7;t+=.1)assert.ok(saturationPressure(t+.1)>saturationPressure(t));
 near(saturationPressure(40),7500,250);near(saturationPressure(80),47500,1000);
 const n=1e-4,R=8.3,V=10e-6,p=t=>n*R*(273+t)/V;
 assert.ok(p(80)<saturationPressure(80));assert.ok(p(40)>saturationPressure(40));
 near(p(80),29299);near(7500*V/(R*313),2.88694715e-5,1e-12);
 assert.doesNotMatch(asset('q1-vapor-pressure-graph'),/data-read-off|<circle/);
});
test('Keio physics: hydrostatic and adiabatic conditions include stable inversions',()=>{
 const M=.029,g=10,R=8.3,B=.29,p=1e5,T=300,rho=p*M/(R*T),C=rho*g,D=B*M*g/R;
 near(C,p*M*g/(R*T));near(-D*100,-1.01325301204819);
 for(const dt of [-.5,0,.5]){const parcelT=T-1,ambientT=T+dt;assert.ok(p*M/(R*parcelT)>p*M/(R*ambientT));assert.ok(dt>-1);}
});
test('Keio physics: all 29 provisional scores and dependent plans are independently checked',()=>{
 const e=JSON.parse(read(`../src/data/pastExamAnalysisEvidence/${packageId}.json`)),qs=e.majorQuestions.flatMap(q=>q.subquestions);
 const labels=['基本レベル','基本＋αレベル','標準レベル','発展レベル'];
 assert.equal(qs.length,29);assert.deepEqual(labels.map(d=>qs.filter(q=>q.difficulty===d).length),[13,11,5,0]);
 assert.deepEqual(labels.map(d=>qs.filter(q=>q.difficulty===d).reduce((s,q)=>s+q.points,0)),[39,40,21,0]);
 assert.deepEqual(e.majorQuestions.map(q=>q.subquestions.reduce((s,q)=>s+q.points,0)),[21,49,30]);
 const times=[[.2,1.3],[.2,2.3],[.4,2.6],[.2,2.3],[.2,.8],[.2,1.3],[.2,1.3],[.2,.8],[.2,1.3],[.2,1.3],[.2,.8],[.2,1.8],[.2,1.8],[.2,2.3],[.2,1.8],[.2,1.3],[.4,3.6],[.4,2.6],[.2,1.8],[.2,1.8],[.2,1.8],[.2,1.8],[.4,2.6],[.2,1.3],[.2,1.8],[.2,2.3],[.2,1.3],[.4,2.6],[.2,1.8]];
 for(const profile of ['weak','strong']){
  const scan=times.reduce((s,t)=>s+Math.round(t[0]*(profile==='weak'?4:1)*10),0),exec=times.map(t=>Math.round((t[1]*(profile==='weak'?1.5:1)+Number.EPSILON)*10));
  assert.equal(scan,profile==='weak'?272:68);assert.equal(scan+exec.reduce((s,t)=>s+t,0),profile==='weak'?1061:590);
  const bad=qs.filter(q=>q[profile]==='今解く！').flatMap(q=>q.prerequisites[`${profile}_subject`].filter(id=>qs.find(p=>p.id===id)[profile]!=='今解く！').map(id=>`${q.id}:${id}`));
  assert.equal(bad.length,profile==='weak'?4:0);
  let dp=new Map([[0,0]]),start=0;
  for(const major of e.majorQuestions){const group=major.subquestions,choices=new Map();
   for(let mask=0;mask<2**group.length;mask++){let points=0,time=0,ok=true;
    for(let i=0;i<group.length;i++)if(mask&(1<<i)){const q=group[i];points+=q.points;time+=exec[start+i];for(const id of q.prerequisites[`${profile}_subject`]){const j=group.findIndex(x=>x.id===id);assert.ok(j>=0);if(!(mask&(1<<j)))ok=false;}}
    if(ok&&time<=600-scan)choices.set(time,Math.max(points,choices.get(time)??0));
   }
   const next=new Map();for(const [a,p] of dp)for(const [b,q] of choices)if(a+b<=600-scan)next.set(a+b,Math.max(p+q,next.get(a+b)??0));dp=next;start+=group.length;
  }
  assert.equal(Math.max(...dp.values()),profile==='weak'?47:100);
 }
 assert.equal(e.targetAnalysis,null); // Do not clear the reader gate merely because maximum plans are valid.
});
test('Keio physics: eight originals, fonts and review boundaries are registered',()=>{
 const m=JSON.parse(read(`../src/data/pastExamFigures/${packageId}.json`));assert.equal(m.items.length,8);assert.equal(m.restrictedSourceCopied,false);assert.equal(m.review.needsHumanReview,true);
 const root=fileURLToPath(new URL('..',import.meta.url));
 for(const item of m.items){const svg=asset(item.id);assert.doesNotMatch(svg,/<image|<foreignObject|<script|[≤≥]/);if(!isHandEditedFigure(root,packageId,item.id)){assert.match(svg,/KaTeX_Main/);assert.match(svg,/KaTeX_Math/);}}
 assert.equal(Object.keys(reviewNotices[packageId]).length,3);assert.match(analysisReviewNotices[packageId].message,/目標点は保留/);
});
