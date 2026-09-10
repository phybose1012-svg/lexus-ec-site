import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {circuitEdges,pv,springState,lensImages} from './build-jichi-medical-2025-physics-figures.mjs';
import {withReviewNotice} from '../src/lib/pastExamReviewNotices.mjs';
import {summarizeQuestionLabels} from '../src/lib/pastExamSeo.mjs';
const id='jichi-medical-2025-general-physics',near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
const asset=n=>fs.readFileSync(new URL(`../public/assets/past-exams/${id}/figures/${n}.svg`,import.meta.url),'utf8');
test('Jichi physics: charging path includes R and isolated LC loop does not',()=>{
 const active=switches=>circuitEdges.filter(e=>!/^S[12]$/.test(e[2])||switches.includes(e[2]));
 const reach=(edges,start)=>{const found=new Set([start]);for(let changed=true;changed;){changed=false;for(const [a,b]of edges)for(const [u,v]of [[a,b],[b,a]])if(found.has(u)&&!found.has(v)){found.add(v);changed=true;}}return found;};
 assert.ok(active(['S1']).some(e=>e[2]==='R'));assert.ok(reach(active(['S1']),'plus').has('top'));
 // With S1 open the battery/R branch is a dangling path, not part of the C/S2/L cycle.
 const loop=circuitEdges.filter(e=>['C','S2','L'].includes(e[2]));assert.equal(loop.length,3);assert.equal(new Set(loop.flatMap(e=>e.slice(0,2))).size,3);assert.ok(!loop.some(e=>e[2]==='R'));
 const qRatio=.5;near(Math.sqrt(1-qRatio*qRatio),Math.sqrt(3)/2);near(Math.acos(qRatio),Math.PI/3);
 assert.match(asset('q1-3-circuit'),/両スイッチは開いている/);
});
test('Jichi physics: positive charge in minus-z field initially bends to minus-x',()=>{
 const v=[0,1,0],B=[0,0,-1],force=[v[1]*B[2]-v[2]*B[1],v[2]*B[0]-v[0]*B[2],v[0]*B[1]-v[1]*B[0]];assert.deepEqual(force,[-1,0,0]);
 const m=2,q=3,bb=4,speed=5,r=m*speed/(q*bb);near(Math.PI*r/speed,Math.PI*m/(q*bb));
 assert.match(asset('q4-particle-diagram'),/軌道は描いていない/);assert.doesNotMatch(asset('q4-particle-diagram'),/π|半周期/);
});
test('Jichi physics: wavefront styles match and the next open-pipe resonance gives 1700 Hz',()=>{
 const wave=asset('q10-wave-interference');for(const r of [32,64,96,128,160,192,224,256]){assert.match(wave,new RegExp(`cx="280" cy="260" r="${r}"`));assert.match(wave,new RegExp(`cx="480" cy="260" r="${r}"`));}
 near(340/(2*(.4-.3)),1700);assert.match(asset('q11-open-pipe'),/M180 120 H480 M180 190 H480/);assert.doesNotMatch(asset('q11-open-pipe'),/>1700/);
});
test('Jichi physics: reflection threshold and signed second-lens object distance',()=>{
 const critical=Math.asin(1/Math.sqrt(2));near(Math.tan(critical),1);assert.doesNotMatch(asset('q13-total-reflection'),/45°|r=D/);
 const {b,a2,b2,distance}=lensImages();near(b,30);near(a2,-5);near(b2,10);near(distance,95);assert.doesNotMatch(asset('q14-lenses'),/>95/);
});
test('Jichi physics: PV endpoints, equal temperature, heat and work balance',()=>{
 for(let n=0;n<=50;n++){const v=1+2*n/50;near(v*pv(v),3);}near(pv(1),3);near(pv(3),1);
 const Q=3*Math.log(3),qAB=3,qCA=-5,wCA=-2;near(qAB+Q+qCA,Q+wCA);assert.ok((Q-2)/(Q+3)>0);
 assert.match(asset('q15-pv-cycle'),/AはV,p、BはV,3p、Cは3V,p/);
});
test('Jichi physics: separate rod experiments use moments, not simultaneous applied forces',()=>{
 const W=49,l=1,x=40/49;near(40*l,W*x);near(9*l,W*(l-x));near(W/9.8,5);
 assert.match(asset('q18-rod'),/上段では左端が接地し右端を40N/);assert.match(withReviewNotice('<h2>問題18</h2>',id,'major-question-14'),/別々の実験/);
});
test('Jichi physics: spring center shifts only for one direction; static start is independent',()=>{
 const a=1,p=.8,q=.4,g=9.8,m=2,k=m*g/a,s=springState(a,p,q,g);
 near(.5*k*p*p,.5*k*q*q+s.muK*m*g*(p+q));near(s.center,-a*s.muK);near(s.amplitude,(p+q)/2);near(s.halfPeriod,Math.PI*Math.sqrt(a/g));
 const badP=.5,mu=.8,muK=.2;assert.ok(badP>2*a*muK);assert.ok(!(badP>a*mu));
 assert.match(withReviewNotice('<h2>問題20〜25</h2>',id,'major-question-16'),/始める条件/);assert.doesNotMatch(asset('q20-25-spring'),/>O′|最大速さ|摩擦力/);
});
test('Jichi physics: all nine slots imported with no change to 25-question/16-section contract',()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL(`../src/data/pastExamFigures/${id}.json`,import.meta.url)));assert.equal(manifest.items.length,9);assert.equal(manifest.restrictedSourceCopied,false);
 const d=JSON.parse(fs.readFileSync(new URL(`../src/data/generated/pastExamQuestions/${id}.json`,import.meta.url)));assert.equal(d.document.questions.length,16);const html=d.document.questions.map(x=>x.html).join('');assert.equal((html.match(/data-figure-id=/g)||[]).length,9);assert.doesNotMatch(html,/data-figure-placeholder/);
 const summary=summarizeQuestionLabels(d.document.questions.map(x=>x.label));assert.equal(summary.count,25);assert.equal(summary.label,'問題');assert.equal(summary.print,'問題25問');
 const ledger=JSON.parse(fs.readFileSync(new URL('../src/data/pastExamBatch/status.json',import.meta.url))).packages.find(x=>x.id===id);assert.equal(ledger.questionFigures,0);assert.equal(ledger.analysis,'targets-deferred');
});
test('Numbered question lists are counted consistently without changing major-question fallback',()=>{
 assert.equal(summarizeQuestionLabels(['問題1〜3','問題4・5']).count,5);assert.equal(summarizeQuestionLabels(['問題1・2〜4']).count,4);
 assert.equal(summarizeQuestionLabels(['第1問','第2問']).label,'大問');assert.equal(summarizeQuestionLabels(['問題3〜1']).label,'大問');assert.equal(summarizeQuestionLabels(['問題1・']).label,'大問');
});
