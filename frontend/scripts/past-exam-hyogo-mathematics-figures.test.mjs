import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {roots,square,complex,radius,orbitPoint} from './build-hyogo-2025-mathematics-figures.mjs';
const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const near=(x,y)=>assert.ok(Math.abs(x-y)<1e-10,`${x} != ${y}`);
test('Hyogo logarithmic inequality boundaries and open intervals are exact',()=>{
 near(roots[0]**2,16-16*roots[0]);
 for(const x of roots.slice(1))near(x*x,16*x-16);
 assert.ok(roots[0]>0&&roots[0]<1&&roots[1]>1);
 for(let i=1;i<2000;i++){const x=i/100;if(x===1)continue;const expected=x<roots[0]||(x>roots[1]&&x<roots[2]);assert.equal(16*Math.abs(x-1)>x*x,expected);}
});
test('Hyogo square, external right triangle, circle and Ptolemy agree',()=>{
 const {A,B,E,F}=square;near(distance(A,F),6);near(distance(B,F),8);near(distance(A,B),10);near(distance(E,F),7*Math.SQRT2);
 for(const p of[A,B,E,F])near(distance(p,[5,0]),5);
 near(distance(A,B)*distance(E,F),distance(A,E)*distance(B,F)+distance(A,F)*distance(B,E));
 assert.ok(E[1]<0&&F[1]>0);
});
test('Hyogo circumcenter and signed central rotation match the stated complex numbers',()=>{
 for(const p of[complex.O,complex.A,complex.B])near(distance(p,complex.C),radius);
 const u=complex.A.map((v,i)=>v-complex.C[i]),v=complex.B.map((v,i)=>v-complex.C[i]);
 near(Math.atan2(u[0]*v[1]-u[1]*v[0],u[0]*v[0]+u[1]*v[1]),2*Math.PI/3);
});
test('Hyogo eight-point orbit is periodic and residue 3 is uniquely closest',()=>{
 const ds=Array.from({length:8},(_,n)=>distance(orbitPoint(n),complex.B));
 assert.equal(ds.indexOf(Math.min(...ds)),3);
 for(let n=-8;n<8;n++)near(distance(orbitPoint(n),orbitPoint(n+8)),0);
});
test('Hyogo original manifest covers all five deferred source IDs',()=>{
 const m=JSON.parse(fs.readFileSync(new URL('../src/data/pastExamFigures/hyogo-medical-2025-general-a-b-mathematics.json',import.meta.url)));
 assert.deepEqual(m.items.map(i=>i.id),['a02-inequality-graphs','a06-geometry-diagrams','a07-geometry-alternatives','a13-complex-geometry','a14-eight-points']);
 assert.equal(m.restrictedSourceCopied,false);
});
