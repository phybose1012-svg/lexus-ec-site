import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildAnalysis} from './build-past-exam-analyses.mjs';
import {pointOnCylinder,departure,thermodynamics,electricMotion,pistonTop,thermalLayerY} from './build-saitama-medical-2025-general-early-physics-figures.mjs';
import {targetReviewHold} from './lib/past-exam-target-review-holds.mjs';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
test('Slot-based evidence retains 100 points but does not invent 31 independent questions or target scores',()=>{
 const read=name=>JSON.parse(fs.readFileSync(new URL(`../src/data/${name}/saitama-medical-2025-general-early-physics.json`,import.meta.url)));
 const evidence=read('pastExamAnalysisEvidence'),editorial=read('pastExamAnalysisSources');
 const page=buildAnalysis(evidence,editorial);
 assert.equal(page.questionStructure.numberedSubquestions,16);
 const rows=page.majorQuestions.flatMap(m=>m.subquestions);
 assert.equal(rows.length,31);assert.deepEqual(page.difficultyCounts,[10,6,15,0]);
 assert.deepEqual([0,1,2,3].map(l=>rows.filter(q=>q.difficulty===l).reduce((s,q)=>s+q.points,0)),[31,22,47,0]);
 assert.deepEqual(page.targets.profiles,[]);assert.equal(page.targets.totalPoints,100);
 assert.match(page.targetReviewNote,/前問/);
 assert.throws(()=>buildAnalysis(evidence,{...editorial,questionStructure:{assessmentUnit:'answer_slot',numberedSubquestions:32}}));
});
test('A semantic target hold remains active across source updates and is package-scoped',()=>{
 const registry={example:{analysisSha256:'a'.repeat(64),reason:'前問依存が不足',handoff:'docs/handoffs/example.md'}};
 assert.match(targetReviewHold(registry,'example','a'.repeat(64)),/前問依存/);
 assert.match(targetReviewHold(registry,'example','b'.repeat(64)),/更新を検出/);
 assert.equal(targetReviewHold(registry,'other','a'.repeat(64)),null);
 assert.throws(()=>targetReviewHold({example:{...registry.example,reason:''}},'example','a'.repeat(64)));
});
test('Cylinder endpoints and 120-degree departure preserve geometry and motion',()=>{
 assert.deepEqual(pointOnCylinder(0),[0,0]);close(pointOnCylinder(Math.PI)[1],2);
 const d=departure();close(d.x,Math.sqrt(3)/2);close(d.y,1.5);assert.ok(d.vx<0&&d.vy>0);
 close(d.v*d.v,.5);close(d.landing,0);close(d.maximumHeight,27/16);close(d.t,Math.sqrt(6));close(d.floorSpeed**2,3.5);
});
test('Thermal processes distinguish quasi-static compression from sudden loading',()=>{
 close(374-pistonTop(true)-12,(374-pistonTop(false)-12)/2);
 for(const compressed of [false,true])close(thermalLayerY(compressed)+5,pistonTop(compressed)+12);
 const t=thermodynamics();close(t.pressureII*(.5)**(5/3),1);close(t.energyII-t.handWork,.5);
 close((1+t.massIII)*.5,t.temperatureIII);close(1.5*(t.temperatureIII-1),(1+t.massIII)*.5);
 close(t.temperatureIV,t.temperatureIII*(.5)**(2/3));
});
test('Electric motion reaches the zero-potential line with signed components',()=>{
 const t=electricMotion();close(t.potential,.005);close(t.time,.001);close(t.velocity[0],-1.2);close(t.velocity[1],-1.6);
 close(t.position[0],.0024);close(t.position[1],-.0018);close(3*t.position[0]+4*t.position[1],0);
 close(t.energy/1e-10,2);close(t.impulse[0]/1e-10,-1.2);close(t.impulse[1]/1e-10,-1.6);
});
