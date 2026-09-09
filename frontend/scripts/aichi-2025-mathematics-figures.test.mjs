import test from 'node:test';
import assert from 'node:assert/strict';
import {geometry} from './build-aichi-2025-mathematics-figures.mjs';
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const diff=(a,b)=>a.map((v,i)=>v-b[i]);
const norm=a=>Math.hypot(...a);
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
test('Aichi three-circle diagram preserves both tangencies and center order',()=>{
 const {C,B,P,r}=geometry.circle;
 near(norm(P)+r,3);
 near(norm(diff(P,C)),2+r);
 near(norm(diff(B,C)),2);
 near(norm(diff(P,B)),r);
 assert.ok(dot(diff(B,C),diff(P,B))>0);
});
test('Aichi H is the perpendicular foot on the plane through A B C',()=>{
 const {A,B,C,P,H,normal}=geometry.space;
 for(const pt of [A,B,C,H])near(dot(pt,normal),0);
 near(dot(diff(P,H),diff(B,A)),0);
 near(dot(diff(P,H),diff(C,A)),0);
 near(norm(diff(P,H)),2/Math.sqrt(3));
});
test('Aichi circle parameterization has orthonormal in-plane bases and lies on sphere',()=>{
 const {P,H,e1,e2,normal,radius,sectionRadius}=geometry.space;
 near(norm(e1),1);near(norm(e2),1);near(dot(e1,e2),0);
 near(dot(e1,normal),0);near(dot(e2,normal),0);
 for(let i=0;i<48;i++){
  const t=i*Math.PI/24,Q=H.map((v,k)=>v+sectionRadius*(e1[k]*Math.cos(t)+e2[k]*Math.sin(t)));
  near(norm(diff(P,Q)),radius);near(dot(Q,normal),0);
 }
});
