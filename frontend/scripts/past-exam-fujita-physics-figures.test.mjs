import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {rigid,ropeTangent,lens,sag,forcePoint,requiredIds,deferredIds,signedRatio,mathematicalHeight} from './build-fujita-2025-physics-figures.mjs';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
test('Both ropes descend to tangent pulleys; theta2 exceeds theta1',()=>{
 const{A,B,pulley1,pulley2,radius:r}=rigid,ts=[ropeTangent(A,pulley1,r,1),ropeTangent(B,pulley2,r,-1)];
 for(const[a,o,t]of[[A,pulley1,ts[0]],[B,pulley2,ts[1]]]){close(Math.hypot(t[0]-o[0],t[1]-o[1]),r);close((a[0]-t[0])*(t[0]-o[0])+(a[1]-t[1])*(t[1]-o[1]),0);assert.ok(t[1]>a[1]);}
 const angle=(p,t)=>Math.atan2(Math.abs(t[0]-p[0]),t[1]-p[1]);assert.ok(angle(B,ts[1])>angle(A,ts[0]));
});
test('Lens surfaces touch only on axis and the upper smaller-radius surface leaves a positive gap',()=>{
 close(sag(lens.R,0),0);for(const x of[20,80,170,215]){assert.ok(sag(lens.R,x)>sag(lens.R0,x));close((lens.R-sag(lens.R,x))**2+x*x,lens.R**2);}
});
test('At x=L/4 the Lorentz force is normal to velocity and points toward the center',()=>{
 const p=forcePoint;close((p.x-.5)**2+p.y*p.y,.25);close(Math.hypot(p.fx,p.fy),1);close(p.fx*Math.sqrt(3)/2+p.fy*.5,0);assert.ok(p.fx>0&&p.fy<0);
});
test('Ten required originals distinguish mathematical graph interpretation from unresolved physical applicability',()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL('../src/data/pastExamFigures/fujita-health-2025-general-early-physics.json',import.meta.url)));
 assert.equal(manifest.items.length,10);assert.deepEqual([...manifest.items.map(i=>i.id),...deferredIds].sort(),requiredIds.toSorted());
 for(const id of['a4-answer-graph','a4-solution-graph'])assert.match(manifest.items.find(i=>i.id===id).caption,/確認/);
 const apparatus=fs.readFileSync(new URL('../public'+manifest.items.find(i=>i.id==='q3-charged-particle-apparatus').src,import.meta.url),'utf8');
 assert.doesNotMatch(apparatus,/ローレンツ|半円|B₁/);assert.match(apparatus,/向き・軌道は未記入/);
 const blank=fs.readFileSync(new URL('../public'+manifest.items.find(i=>i.id==='q4-answer-grid').src,import.meta.url),'utf8');
 const labels=[...blank.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)].map(m=>m[1].replace(/<[^>]+>/g,'')).join(' ');
 assert.doesNotMatch(labels,/3x|9H|4H|1\/3/);
});
test('Mathematical height graph retains endpoints and exposes the negative-velocity range',()=>{
 close(mathematicalHeight(0),1);close(mathematicalHeight(1/3),0);close(mathematicalHeight(3),4);
 assert.ok(signedRatio(.1)<0&&mathematicalHeight(.1)>0);assert.ok(signedRatio(1)>0);
});
