import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {collision,conductor,slitGeometry,selector,deferredIds,requiredIds} from './build-dokkyo-2025-physics-figures.mjs';
test('Dokkyo pre-collision diagram fixes C-A-B order and mass ratio',()=>{
 assert.ok(collision.C.x<collision.A.x&&collision.A.x<collision.B.x);
 assert.equal(collision.C.mass,2);assert.equal(collision.A.mass,1);assert.equal(collision.B.mass,1);
 assert.equal(collision.incomingDirection,1);
});
test('Dokkyo electron drift is opposite to conventional current',()=>assert.equal(conductor.currentDirection,-conductor.electronDirection));
test('Dokkyo upper slit has shorter path to a positive-angle observation point',()=>{
 const {radius:L,d,theta}=slitGeometry,x=L*Math.cos(theta),y=L*Math.sin(theta);
 const upper=Math.hypot(x,y-d/2),lower=Math.hypot(x,y+d/2);
 assert.ok(upper<L&&L<lower);
 assert.ok(Math.abs((lower-upper)-d*Math.sin(theta))/(d*Math.sin(theta))<.01);
});
test('Dokkyo selector shows the next arrival angle, not its complement',()=>{
 const initial=-Math.PI/2-selector.theta,next=initial+selector.rotationDirection*selector.theta;
 assert.ok(Math.abs(next+Math.PI/2)<1e-12);
 assert.ok(selector.theta>0&&selector.theta<2*Math.PI);
});
test('Dokkyo partial manifest preserves three explicitly unresolved question figures',()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL('../src/data/pastExamFigures/dokkyo-medical-2025-general-early-physics.json',import.meta.url),'utf8'));
 assert.equal(manifest.items.length,8);
 assert.deepEqual([...manifest.items.map(i=>i.id),...deferredIds].sort(),[...requiredIds].sort());
 for(const id of deferredIds)assert.ok(!manifest.items.some(i=>i.id===id));
});
test('Dokkyo source RC condition mismatch is recorded, not hidden by an invented diagram',()=>{
 const source=JSON.parse(fs.readFileSync(new URL('../src/data/pastExamStagingAnswerSources/dokkyo-medical-2025-general-early-physics.json',import.meta.url),'utf8'));
 const question=source.question.document.questions.find(q=>q.id==='major-question-04').html;
 assert.match(question,/frac(?:1|\{1\})(?:6|\{6\})I_0/);
 assert.ok(source.editorial.pages.some(p=>p.blocks.some(b=>b.major_question_id==='major-question-04'&&b.latex==="0=RI_0-V_1'+V_2'")));
});
