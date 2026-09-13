import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {isHandEditedFigure,handEditedTrioPath} from './lib/past-exam-figure-handoff.mjs';
import {packageId,A,B,P,Q,R,S,M,radius,parallelSlope,overviewSlope,intersections,slopeBounds,theta1,theta2,theta} from './build-jichi-medical-2025-second-stage-mathematics-figures.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
const delta=(a,b)=>a.map((v,i)=>v-b[i]);
const cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1];
const dist=(a,b)=>Math.hypot(...delta(a,b));
const angle=(o,a,b)=>Math.acos(dot(delta(a,o),delta(b,o))/(dist(a,o)*dist(b,o)));
const area=(points)=>Math.abs(points.reduce((sum,a,i)=>sum+cross(a,points[(i+1)%points.length]),0))/2;
test('Jichi second-stage intersections preserve the circle, line and near/far order',()=>{
 for(const p of[P,Q,R,S])near(dist(p,B),radius);
 for(const p of[Q,R])near(p[0]+p[1],9);
 for(const p of[P,S])near(p[1],parallelSlope*(p[0]-1)+8);
 assert.ok(dist(A,P)<dist(A,S)&&dist(A,Q)<dist(A,R));
 near(P[0],131/37);near(P[1],342/37);near(S[0],272/37);near(S[1],411/37);
});
test('The overview intentionally does not assume the later parallel condition',()=>{
 const [p,s]=intersections(overviewSlope);
 for(const v of[p,s])near(dist(v,B),radius);
 assert.ok(Math.abs(cross(delta(p,Q),delta(s,R)))>.1);
});
test('The strict two-intersection interval and zero absolute value are handled',()=>{
 for(const m of slopeBounds)near(19*m*m+12*m-16,0);
 for(let i=0;i<200;i++){
  const m=-1+1e-6+i*.01;
  assert.equal(intersections(m).length===2,m<slopeBounds[1]);
 }
 const m=-1/6;near(Math.abs(6*m+1),0);assert.ok(intersections(m).length===2);
});
test('Parallel chords, equal base angles, and the bisector follow independently',()=>{
 near(cross(delta(P,Q),delta(S,R)),0);near(dist(A,P),dist(A,Q));near(dist(A,R),dist(A,S));
 const angles=[angle(Q,A,P),angle(R,A,S),angle(P,A,Q),angle(S,A,R)];
 angles.forEach(a=>near(a,angles[0]));near(angle(A,B,P),angle(A,B,Q));
});
test('Midpoint, perpendicular and both area computations agree',()=>{
 near(dist(M,P),dist(M,Q));near(dot(delta(M,A),delta(P,Q)),0);
 near(dist(A,M),14/Math.sqrt(37));near(dist(Q,M),10/Math.sqrt(37));
 near(area([A,Q,P]),140/37);near(area([A,R,S])/area([A,Q,P]),25/4);
 near(area([P,Q,R,S]),735/37);near(area([A,R,S])-area([A,Q,P]),735/37);
});
test('Signed inclination angles are negative while the geometric half-angle is positive',()=>{
 assert.ok(theta1<theta2&&theta2<0&&theta>0);
 near(Math.tan(theta1),-1);near(Math.tan(theta2),-1/6);near(Math.tan(theta),5/7);
 near(Math.tan(theta2+theta),parallelSlope);near(42*Math.sin(theta)*Math.cos(theta),735/37);
});
test('Five second-stage assets cannot overwrite the independently authored first-stage figures',()=>{
 const m=JSON.parse(fs.readFileSync(new URL(`../src/data/pastExamFigures/${packageId}.json`,import.meta.url)));
 assert.equal(m.packageId,packageId);assert.equal(m.restrictedSourceCopied,false);assert.equal(m.review.needsHumanReview,true);
 assert.deepEqual(m.items.map(i=>i.id),['ans-overview-diagram','ans-proof-diagram','ans-midpoint-diagram','ans-alternative-diagram','ans-trig-triangle']);
 for(const item of m.items){
  assert.ok(item.src.includes(`${packageId}/figures/`));
  const svg=fs.readFileSync(new URL(`../public${item.src}`,import.meta.url),'utf8');
  const root=fileURLToPath(new URL('../',import.meta.url));
  if(isHandEditedFigure(root,packageId,item.id)){
   // The editor renders TeX as local vector outlines, not embedded KaTeX fonts.
   // Validate the editable source identity and outline representation; do not regenerate it.
   const trio=JSON.parse(fs.readFileSync(handEditedTrioPath(root,packageId,item.id),'utf8'));
   assert.equal(trio.schemaVersion,'lexus-past-exam-figure-trio.v1');assert.equal(trio.packageId,packageId);assert.equal(trio.figureId,item.id);
   assert.match(trio.trio.style,/Equation\s*\{/);assert.match(svg,/data-mml-node="math"/);assert.match(svg,/data-c="[A-F0-9]+"/);
  }else{assert.match(svg,/KaTeX_Main/);assert.match(svg,/KaTeX_Math/);}
  assert.doesNotMatch(svg,/<(?:image|foreignObject|script)\b|[≤≥]/);
  assert.doesNotMatch(svg,/\s(?:href|xlink:href|src)=["'](?:https?:|\/\/)|\son[a-z]+\s*=/i);
 }
});
