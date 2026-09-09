import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {doppler,rail,rodPoint,balance,rebound,beatPeriod} from './build-fukuoka-2025-physics-figures.mjs';
test('Fukuoka Doppler setup preserves observer-source-reflector order and approach',()=>{
 assert.ok(doppler.observer<doppler.source&&doppler.source<doppler.reflector);
 assert.equal(doppler.reflectorDirection,-1);
 assert.equal(beatPeriod(340,10,100),.165);
 assert.notEqual(beatPeriod(340,10,100),1/100);
});
test('Fukuoka rod joins equal rail positions, with polarity consistent with uphill force',()=>{
 const p=rodPoint(rail.a,rail.b),q=rodPoint(rail.c,rail.d);
 assert.deepEqual(q.map((v,i)=>v-p[i]),rail.c.map((v,i)=>v-rail.a[i]));
 assert.equal(rail.positiveTerminal,'a');assert.equal(rail.negativeTerminal,'c');
 // World axes: x horizontally uphill, y from p to q, z vertically upward.
 const J=[0,1,0],B=[0,0,1],force=[J[1]*B[2]-J[2]*B[1],J[2]*B[0]-J[0]*B[2],J[0]*B[1]-J[1]*B[0]];
 assert.deepEqual(force,[1,0,0]);
});
test('Fukuoka equilibrium vectors sum to zero and rebound magnitude is not signed velocity',()=>{
 for(const theta of [.2,.5,.9]){const {F,N}=balance(theta);assert.ok(Math.abs(F-N*Math.sin(theta))<1e-12);assert.ok(Math.abs(N*Math.cos(theta)-1)<1e-12);}
 assert.equal(rebound(4).vy,-.5);assert.equal(Math.abs(rebound(4).vy),.5);
});
test('Fukuoka registers all four stable IDs and keeps solved trajectories out of question SVG',()=>{
 const m=JSON.parse(fs.readFileSync(new URL('../src/data/pastExamFigures/fukuoka-2025-general-keitobetsu-physics.json',import.meta.url)));
 assert.deepEqual(m.items.map(i=>i.id),['q1-doppler-setup','q2-inclined-rail-circuit','q3-incline-45-setup','ans2-force-balance']);
 assert.equal(m.restrictedSourceCopied,false);
 const svg=fs.readFileSync(new URL('../public'+m.items[2].src,import.meta.url),'utf8');
 const labels=[...svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)].map(m=>m[1].replace(/<[^>]+>/g,'')).join(' ');
 assert.doesNotMatch(labels,/t₁|2v|衝突点|3[+−]e/);
});
