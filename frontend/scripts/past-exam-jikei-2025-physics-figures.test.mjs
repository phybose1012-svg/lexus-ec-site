import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gamma,cycle,adiabat,cart,recoilMomentum} from './build-jikei-2025-physics-figures.mjs';
import {withReviewNotice,analysisReviewNotices} from '../src/lib/pastExamReviewNotices.mjs';
const id='jikei-2025-general-physics';
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
const asset=n=>read(`../public/assets/past-exams/${id}/figures/${n}.svg`);
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
test('Jikei: transferred gas is isenthalpic; source Q3 asks for PVγ ratio, not volume ratio',()=>{
 const pa=2,pb=1,va=1,vb=pa*va/pb;near(pa*va-pb*vb,0);
 near(pb*vb**gamma/(pa*va**gamma),(pa/pb)**(2/3));assert.notEqual(vb/va,(pa/pb)**(2/3));
 assert.match(asset('q1-fig-insulated-cylinders'),/容器Bは空/);assert.match(asset('q1-fig-insulated-cylinders'),/気体はAからBへ移る/);
});
test('Jikei: hypothetical cycle has equal initial/final temperature and no invented return path',()=>{
 const {I,II,III}=cycle;near(I.p*I.v,II.p*II.v);assert.ok(II.p*II.v**gamma<I.p*I.v**gamma);
 near(III.p*III.v**gamma,I.p*I.v**gamma);assert.ok(III.p>II.p);near(III.v,II.v);
 for(let n=0;n<=50;n++){const v=1+n/50;near(adiabat(v)*v**gamma,2**gamma);}
 const U=s=>s.p*s.v/(gamma-1),absorbed=U(III)-U(II),expansionWork=U(III)-U(I);near(absorbed,expansionWork);assert.ok(absorbed>0);
 assert.match(asset('a1-fig-pv-cycle'),/経路を描かない/);assert.match(asset('a1-fig-pv-cycle'),/実現できる熱機関を示す図ではない/);
});
test('Jikei: detector is behind crystal, opposing the positive acceleration direction',()=>{
 assert.ok(cart.detectorX<cart.crystalX);assert.equal(cart.accelerationSign,1);assert.equal(cart.photonSign,-1);
 assert.doesNotMatch(asset('q2-fig-accelerating-cart'),/mc²|maΔx|慣性力/);
 const m=2,a=3,d=4,U=x=>m*a*x;near(U(d)-U(0),m*a*d);near(-(U(1.5)-U(.5)),-m*a);
});
test('Jikei: recoil energies conserve rest energy and photon energy approaches mc²',()=>{
 const m=1,c=10;let previous=0;
 for(const M of [10,100,1e4,1e8]){const p=recoilMomentum(M,m,c);near(p*p/(2*(M-m))+c*p,m*c*c);assert.ok(c*p<m*c*c);assert.ok(p>previous);previous=p;}
 assert.ok(Math.abs(previous-m*c)<1e-6);assert.match(asset('a2-fig-gamma-recoil'),/全運動量0/);
});
test('Jikei: all four registered slots are original and known source defects stay visibly gated',()=>{
 const manifest=JSON.parse(read(`../src/data/pastExamFigures/${id}.json`));assert.equal(manifest.items.length,4);assert.equal(manifest.restrictedSourceCopied,false);assert.equal(manifest.review.needsHumanReview,true);
 for(const major of ['major-question-01','major-question-02'])assert.match(withReviewNotice('<h2>題</h2>',id,major),/data-source-review="required"/);
 assert.match(analysisReviewNotices[id].message,/修復/);assert.match(manifest.review.notes,/定圧吸熱による別解図/);
 const q=JSON.parse(read(`../src/data/generated/pastExamQuestions/${id}.json`)).document.questions.map(q=>q.html).join('');assert.equal((q.match(/data-figure-id=/g)||[]).length,2);assert.doesNotMatch(q,/data-figure-placeholder/);
});
