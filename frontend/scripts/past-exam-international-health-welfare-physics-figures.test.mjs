import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ratio,thermo,pvPressure,diffraction,separationLimit,choices,trigRows,trigTable} from './build-international-health-welfare-2025-physics-figures.mjs';
import {withReviewNotice,analysisReviewNotices} from '../src/lib/pastExamReviewNotices.mjs';
const near=(a,b,tol=1e-10)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
const id='international-health-welfare-2025-general-physics';
const asset=name=>fs.readFileSync(new URL(`../public/assets/past-exams/${id}/figures/${name}.svg`,import.meta.url),'utf8');
test('IUHW disk radii give the stated independent tension ratio',()=>{const m=2,l=3,w=4,T2=m*2*l*w*w,T1=T2+m*l*w*w;near(T1/T2,1.5);assert.match(asset('q1-disk'),/OP=PQ=l/);});
test('IUHW bulbs have connected left rails and correct series/parallel power',()=>{near(10000/(10000/60+10000/100),37.5);near(10000/(10000/60)+10000/(10000/100),160);const svg=asset('q1-bulbs');assert.match(svg,/M170 300 H70 V130/);assert.match(svg,/M510 300 H410 V130 M410 215 H630/);});
test('IUHW lens fixed object-screen distance permits exchanged image positions',()=>{const a=150,b=360,f=a*b/(a+b);near(1/f,1/a+1/b);near(((a/b)**2)/((a/b)**4),(b/a)**2);assert.match(asset('q1-lens'),/像倍率は未記入|固定された光源/);});
test('IUHW vector alternatives preserve order, arrows, angle and unique equal-length closure',()=>{
 const valid=choices.flatMap((c,i)=>c.arReverse&&!c.aReverse&&c.length===1?[i+1]:[]);assert.deepEqual(valid,[5]);
 const A=[1,0],ar=[-Math.sqrt(3)/2,-.5],a=[A[0]+ar[0],ar[1]];near(Math.hypot(...a),ratio);near(ratio,(Math.sqrt(6)-Math.sqrt(2))/2);
 assert.equal(choices.length,6);assert.match(asset('q2-vectors'),/640 775/);
});
test('IUHW coil winding sign and one-turn flux differ from flux linkage',()=>{
 const loop=[[1,-1],[1,1],[-1,1],[-1,-1]],signed=loop.reduce((s,p,i)=>{const q=loop[(i+1)%4];return s+p[0]*q[1]-p[1]*q[0];},0)/2;near(signed,4);
 const phi=.03,k=.7;near((2**2*phi)/phi,4);near((2*k*phi)/(k*phi),2);
 const svg=asset('q3-coils');assert.match(svg,/aからb、cからd/);assert.match(svg,/Φ/);assert.doesNotMatch(svg,/φ|ϕ/);
});
test('IUHW adiabatic curve obeys PV^gamma with correct a-b-c orientation',()=>{
 const {alpha,beta,gamma}=thermo;near(pvPressure(1),alpha);near(pvPressure(beta),1);for(let i=0;i<=100;i++){const v=1+(beta-1)*i/100;near(pvPressure(v)*v**gamma,alpha);}
 const efficiency=1-gamma*(beta-1)/(alpha-1);assert.ok(efficiency>0&&efficiency<1);assert.notEqual(alpha,beta*gamma);
});
test('IUHW diffraction angles and separation boundary are independently calculated',()=>{
 near(Math.sin(diffraction.blue)/Math.sin(diffraction.red),.5);const theta2=Math.asin(2*Math.sin(diffraction.red))*180/Math.PI;assert.ok(theta2>57&&theta2<58);
 assert.ok(separationLimit>15.7&&separationLimit<16.1);near(2+separationLimit*Math.tan(diffraction.blue),-2+separationLimit*Math.tan(diffraction.red));
 assert.doesNotMatch(asset('q5-setup'),/>57°|>58°/);assert.doesNotMatch(asset('q5-rainbows'),/紫→|赤→|#b05050/);
});
test('IUHW trig table is HTML, with 12 independently rounded rows and stable scope',()=>{
 assert.equal(trigRows.length,12);assert.deepEqual(trigRows[3],[25,'0.42','0.91','0.47']);assert.deepEqual(trigRows.at(-1),[65,'0.91','0.42','2.14']);
 assert.match(trigTable(),/<caption>/);assert.equal((trigTable().match(/scope="row"/g)||[]).length,12);
 const supp=JSON.parse(fs.readFileSync(new URL(`../src/data/pastExamBatch/question-supplements/${id}.json`,import.meta.url)));assert.equal(supp.packageId,id);assert.equal(supp.operations[0].scope,'major-question-05');assert.equal(supp.operations[0].expectedMatches,1);
});
test('IUHW all thirteen figures are registered and imported without dropping review gates',()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL(`../src/data/pastExamFigures/${id}.json`,import.meta.url)));assert.equal(manifest.items.length,13);assert.equal(manifest.restrictedSourceCopied,false);
 const q=JSON.parse(fs.readFileSync(new URL(`../src/data/generated/pastExamQuestions/${id}.json`,import.meta.url))),html=q.document.questions.map(x=>x.html).join('');assert.equal((html.match(/data-figure-id=/g)||[]).length,11);assert.equal((html.match(/data-iuhw-trig-table/g)||[]).length,1);assert.doesNotMatch(html,/data-figure-placeholder/);
 for(const n of ['02','04'])assert.match(withReviewNotice('<h2>第'+n+'問</h2>',id,'major-question-'+n),/data-source-review="required"/);assert.ok(analysisReviewNotices[id]);
 const dist=fs.readFileSync(new URL('../dist/past-exam-library/international-health-welfare/2025/physics/analysis/index.html',import.meta.url),'utf8');assert.match(dist,/一部の問題表記は元データを照合中です/);
});
