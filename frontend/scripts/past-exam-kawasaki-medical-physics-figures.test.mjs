import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {packageId,filmGeometry,wavefrontAt,graphValue,pistonState} from './build-kawasaki-medical-2025-physics-figures.mjs';
import {reviewNotices,analysisReviewNotices} from '../src/lib/pastExamReviewNotices.mjs';
import {isHandEditedFigure} from './lib/past-exam-figure-handoff.mjs';
import {fileURLToPath} from 'node:url';
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
const near=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const norm=a=>Math.hypot(...a),dist=(a,b)=>norm(sub(a,b));
test('Kawasaki physics: the nine schematic graph choices preserve order and extrema',()=>{
 for(let i=1;i<=9;i++)for(let j=0;j<=100;j++)assert.ok(graphValue(i,j/100)>0&&graphValue(i,j/100)<1);
 for(let t=0;t<1;t+=.01){near(graphValue(1,t),.57);for(const i of [2,3])assert.ok(graphValue(i,t+.01)>graphValue(i,t));for(const i of [4,5])assert.ok(graphValue(i,t+.01)<graphValue(i,t));}
 for(const i of [6,7,8,9])for(let t=0;t<.5;t+=.01){near(graphValue(i,t),graphValue(i,1-t));assert.ok((graphValue(i,t)-graphValue(i,t+.01))*(i<8?1:-1)>0);}
 const slope=(i,a,b)=>(graphValue(i,b)-graphValue(i,a))/(b-a);
 assert.ok(Math.abs(slope(6,0,.01))>1);assert.ok(Math.abs(slope(7,0,.01))<.01);
 assert.ok(Math.abs(slope(8,0,.01))>1);assert.ok(Math.abs(slope(9,0,.01))<.01);
 assert.throws(()=>graphValue(10,0));
});
test('Kawasaki physics: refraction, projection feet and reflection satisfy the stated geometry',()=>{
 for(const i of [.05,.3,.8,1.4])for(const n of [1.01,1.45,2.3])for(const d of [.5,1,3]){
  const g=filmGeometry(i,n,d);near(Math.sin(i),n*Math.sin(g.r));
  near(dot(sub(g.B,g.Bp),g.u),0);near(dot(sub(g.E,g.C),g.v),0);
  near(dist(g.B,g.D),dist(g.D,g.E));near(g.D[0],g.E[0]/2);near(g.D[1],d);
  near(sub(g.D,g.B)[0],sub(g.E,g.D)[0]);near(sub(g.D,g.B)[1],-sub(g.E,g.D)[1]);
  near(dist(g.Bp,g.E),n*dist(g.B,g.C));
 }
 assert.throws(()=>filmGeometry(0));assert.throws(()=>filmGeometry(.3,1));
});
test('Kawasaki physics: the bent wavefront is perpendicular to both rays and keeps travel time',()=>{
 const g=filmGeometry();for(const f of [0,.2,.43,.8,1]){
  const w=wavefrontAt(f,g);near(dot(sub(w.J,w.G),g.v),0);near(dot(sub(w.Gp,w.J),g.u),0);
  near(numericAirTime(w,g),g.n*dist(g.B,w.G));
 }
 assert.throws(()=>wavefrontAt(-.1));assert.throws(()=>wavefrontAt(1.1));
 function numericAirTime(w,g){return dist(g.Bp,w.Gp);}
});
test('Kawasaki physics: unfolding proves the optical path difference for multiple incident angles',()=>{
 for(const i of [.1,.4,.9,1.45]){
  const g=filmGeometry(i,1.45,1.3);near(dist(g.D,g.E),dist(g.D,g.Ep));
  near(dist(g.E,g.Ep),2*g.d);near(dist(g.C,g.Ep),2*g.d*Math.cos(g.r));
  const delta=g.n*(dist(g.B,g.D)+dist(g.D,g.E))-dist(g.Bp,g.E);
  near(delta,g.n*dist(g.C,g.Ep));near(delta,2*g.n*g.d*Math.cos(g.r));
 }
});
test('Kawasaki physics: gas, atmosphere and spring obey force and energy balance',()=>{
 for(const v of [1,1.4,2,3]){const s=pistonState(v);near(s.pressure,1+(v-1));near(s.temperature,s.pressure*v);near(s.heat,s.deltaEnergy+s.work);near(s.work,(1+v)*(v-1)/2);near(s.work,(v-1)+(v-1)**2/2);}
 assert.deepEqual(pistonState(3),{pressure:3,temperature:9,initialEnergy:1.5,work:4,deltaEnergy:12,heat:16});
});
test('Kawasaki physics: Coulomb closest approach uses relative motion, not equal speed',()=>{
 const m1=4,m2=12,v1=1,k=2,K=.5*m1*v1*v1,V=m1*v1/(m1+m2),r=k*(m1+m2)/(m2*K);
 near(K,.5*(m1+m2)*V*V+k/r);near((m1-m2)/(m1+m2)*v1,-.5);
 const ev=8.988e9*(2*1.602e-19)*(6*1.602e-19)/(3.2e-15)*(m1+m2)/m2/1.602e-19;
 near(ev/1e6,7.199388,1e-6);
});
test('Kawasaki physics: half lives produce the required signed times and ratios',()=>{
 const N=t=>2**(-t),M=t=>2**(-t/6);near(N(3),1/8);near(M(3),1/Math.sqrt(2));near(N(-6),64);near(M(-6),2);near(N(-6)/M(-6),32);near(N(-12/5)/M(-12/5),4);
});
test('Kawasaki physics: provisional points and profile plans are independently summed',()=>{
 const e=JSON.parse(read(`../src/data/pastExamAnalysisEvidence/${packageId}.json`));
 const qs=e.majorQuestions.flatMap(q=>q.subquestions),labels=['基本レベル','基本＋αレベル','標準レベル','発展レベル'];
 assert.equal(qs.length,17);assert.deepEqual(labels.map(d=>qs.filter(q=>q.difficulty===d).reduce((s,q)=>s+q.points,0)),[27,17,27,4]);
 const times=[[.3,.8],[.6,2.8],[.7,4.2],[.6,2.3],[.3,.8],[.4,1.2],[.5,2.2],[.3,.7],[.4,1.6],[.5,1.4],[.6,2.8],[.3,.6],[.5,1.6],[.2,.4],[.3,.7],[.3,.8],[.5,2]];
 const round=x=>Math.round((x+Number.EPSILON)*10)/10;
 for(const profile of e.targetAnalysis.profiles){
  const jt=times.map(t=>round(t[0]*profile.judgmentMultiplier)),xt=times.map(t=>round(t[1]*profile.executionMultiplier)),scan=round(jt.reduce((s,t)=>s+t,0));near(scan,profile.scanMinutes);
  for(const key of ['maximum','now','nowPlusLater']){const plan=profile[key];const ix=plan.questionIds.map(id=>qs.findIndex(q=>q.id===id));assert.ok(ix.every(i=>i>=0));near(ix.reduce((s,i)=>s+qs[i].points,0),plan.points);near(round(scan+ix.reduce((s,i)=>s+xt[i],0)),plan.minutes);}
  let best=0;for(let mask=0;mask<(1<<qs.length);mask++){let points=0,minutes=scan,valid=true;for(let i=0;i<qs.length;i++)if(mask&(1<<i)){const q=qs[i];if(q[profile.id]==='捨てる！'){valid=false;break;}for(const id of q.prerequisites[`${profile.id}_subject`])if(!(mask&(1<<qs.findIndex(x=>x.id===id))))valid=false;points+=q.points;minutes+=xt[i];}if(valid&&minutes<=60+1e-8)best=Math.max(best,points);}
  assert.equal(best,profile.maximum.points);assert.equal(profile.targetPoints,profile.id==='weak'?66:60);
 }
});
test('Kawasaki physics: all six originals preserve hand edits and scoped source gates',()=>{
 const m=JSON.parse(read(`../src/data/pastExamFigures/${packageId}.json`));assert.equal(m.items.length,6);assert.equal(m.restrictedSourceCopied,false);
 assert.equal(Object.keys(reviewNotices[packageId]).length,5);assert.match(analysisReviewNotices[packageId].message,/75点・60分/);
 const front=fileURLToPath(new URL('..',import.meta.url));
 for(const item of m.items){const svg=read(`../public${item.src}`);assert.doesNotMatch(svg,/<image|<foreignObject|<script|[≤≥]/);if(!isHandEditedFigure(front,packageId,item.id)){assert.match(svg,/KaTeX_Main/);assert.match(svg,/KaTeX_Math/);}}
 const q=read(`../public${m.items.find(x=>x.id==='q4-thin-film-diagram').src}`);assert.doesNotMatch(q,/Δ|cos/);
});
