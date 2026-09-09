import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {charges,phaseAt,rectangleDirection} from './build-aichi-2025-physics-figures.mjs';
test('Aichi electrostatic diagram fixes only given points and signs',()=>{
 assert.deepEqual(Object.keys(charges),['A','B','C','D']);
 assert.equal(charges.A.q,-9);assert.equal(charges.D.q,1);
 assert.equal(charges.A.x,-1);assert.equal(charges.C.x,3);
 assert.ok(Math.abs(Math.hypot(charges.B.x-charges.A.x,charges.B.y)-3)<1e-12);
});
test('Aichi SHM starts at negative displacement and moves clockwise in x-p',()=>{
 assert.deepEqual(phaseAt(0),{x:-1,p:0});
 assert.ok(phaseAt(.001).p>0);
 for(let t=0;t<Math.PI*2;t+=.1){
  const {x,p}=phaseAt(t),next=phaseAt(t+.00001);
  assert.ok(Math.abs(x*x+p*p-1)<1e-12);
  assert.ok(x*next.p-p*next.x<0,'clockwise determinant');
 }
 assert.deepEqual(rectangleDirection,[[0,1],[1,1],[1,-1],[0,-1],[0,1]]);
});
test('Aichi question answer-axes stays blank while only answer figure carries ellipse',()=>{
 const root=new URL('../public/assets/past-exams/aichi-medical-2025-general-physics/figures/',import.meta.url);
 const blank=fs.readFileSync(new URL('q2-answer-axes.svg',root),'utf8');
 assert.doesNotMatch(blank,/<ellipse\b|初期点|時計回り/);
 assert.match(fs.readFileSync(new URL('ans-q2-phase-ellipse.svg',root),'utf8'),/<ellipse\b/);
});
