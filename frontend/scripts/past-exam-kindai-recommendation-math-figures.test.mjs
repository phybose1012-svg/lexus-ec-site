import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {f,g,intersections,packageId,markSupplement} from './build-kindai-2025-recommendation-general-public-mathematics-figures.mjs';
import {reviewNotices,analysisReviewNotices} from '../src/lib/pastExamReviewNotices.mjs';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
test('Kindai recommendation: every allowed pair has the two computed common points',()=>{
 for(let a=1;a<6;a++)for(let b=a+1;b<=6;b++){
  const points=intersections(a,b);assert.ok(points[0][0]<points[1][0]);
  for(const [x,y] of points){close(y,f(x,a,b));close(y,g(x,a,b));}
  assert.ok(points[0][0]<a&&a<points[1][0]);
 }
});
test('Kindai recommendation: x-axis condition, area and integer-quadrant condition',()=>{
 const axis=[],atOne=[],lattice=[];
 for(let a=1;a<6;a++)for(let b=a+1;b<=6;b++){
  const pts=intersections(a,b);
  if(pts.some(([,y])=>Math.abs(y)<1e-9))axis.push([a,b]);
  if(f(1,a,b)===g(1,a,b))atOne.push(a);
  if(pts.every(([x,y])=>x>0&&Number.isInteger(x)&&Number.isInteger(y))&&pts[0][1]>0&&pts[1][1]<0)lattice.push([a,b]);
 }
 assert.deepEqual(axis,[[2,4]]);assert.deepEqual([...new Set(atOne)],[2]);assert.deepEqual(lattice,[[2,6]]);
 assert.deepEqual(intersections(2,4),[[1,3],[4,0]]);assert.deepEqual(intersections(2,6),[[1,5],[5,-3]]);
 const primitive=x=>-2*x**3/3+5*x*x-8*x;close(primitive(4)-primitive(1),9);
 for(let x=1.01;x<4;x+=.05)assert.ok(g(x,2,4)>f(x,2,4));
 close(f(2,2,4),0);assert.equal(g(2,2,4),4); // (a,0) is not a common point.
});
test('Kindai recommendation: the 70 equally likely colour strings give 5/20/30 cases',()=>{
 let total=0,isolated=0,three=0,onePair=0;
 for(let mask=0;mask<256;mask++){
  const s=mask.toString(2).padStart(8,'0');if(s.replaceAll('0','').length!==4)continue;total++;
  const runs=s.match(/1+/g).map(x=>x.length);
  if(runs.every(n=>n===1))isolated++;
  if(runs.includes(3))three++;
  if(runs.filter(n=>n===2).length===1&&runs.every(n=>n<=2))onePair++;
 }
 assert.deepEqual([total,isolated,three,onePair],[70,5,20,30]);
});
test('Kindai recommendation: statistics follow the original 6, not the transcribed 0',()=>{
 const mean=a=>a.reduce((s,x)=>s+x,0)/a.length,variance=a=>mean(a.map(x=>(x-mean(a))**2));
 const known=[9,6,1,10,8,5,7,2];assert.equal(mean(known),6);assert.equal(variance(known),9);
 assert.equal(mean([...known,9,3]),6);assert.equal(variance([...known,9,3]),9);
 const ij=[];for(let i=0;i<=10;i++)for(let j=0;j<i;j++){const values=[9,0,1,10,8,5,7,2,i,j];if(mean(values)===6&&variance(values)===9)ij.push([i,j]);}
 assert.deepEqual(ij,[]);
 const bc=[];for(let b=0;b<=10;b++)for(let c=0;c<=10;c++){const values=[9,b,c,7,8,9,7,b,7,7];if(mean(values)===7&&variance(values)===2)bc.push([b,c]);}
 assert.deepEqual(bc,[[6,4]]);
 const values=[2,4,8,4,7,7,4,5,4,5,9,7];assert.equal(mean(values),5.5);assert.equal(mean(values.slice(2)),6);assert.equal(variance(values.slice(2)),3);
});
test('Kindai recommendation: trigonometry and weighted inequality retain correct values',()=>{
 close(3*(3/5)-4/5,1);close((3/5)**2+(-4/5)**2,1);close(2*(3/5)*(-4/5),-24/25);close((3/5)/(-4/5),-3/4);
 // Expansion must have 6*a3/a2 + 6*a2/a3, not a coefficient of 3.
 for(const v of [[1,1,1],[2,3,7]]){
  const [a,b,c]=v,product=(a+2*b+3*c)*(1/a+2/b+3/c);
  close(product,14+2*(a/b+b/a)+6*(b/c+c/b)+3*(a/c+c/a));assert.ok(product>=36);
 }
 assert.equal((9*10/2)**2,2025);
});
test('Kindai recommendation: original assets, mark tables and review boundaries are registered',()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL(`../src/data/pastExamFigures/${packageId}.json`,import.meta.url)));
 assert.equal(manifest.items.length,3);assert.equal(manifest.restrictedSourceCopied,false);
 for(const item of manifest.items){const svg=fs.readFileSync(new URL(`../public${item.src}`,import.meta.url),'utf8');assert.match(svg,/KaTeX_Math/);assert.match(svg,/KaTeX_Main/);assert.doesNotMatch(svg,/<image|foreignObject|[≤≥]/);assert.match(svg,/data-function="f"/);assert.match(svg,/data-function="g"/);}
 const supplement=markSupplement();assert.equal(supplement.packageId,packageId);assert.equal(supplement.operations.length,2);
 for(const op of supplement.operations){assert.equal(op.expectedMatches,1);assert.equal(op.scope,'shared');assert.match(op.to,/<caption>/);assert.match(op.to,/scope="row"/);}
 assert.equal(Object.keys(reviewNotices[packageId]).length,3);assert.match(reviewNotices[packageId]['major-question-02'].message,/原本は6/);assert.match(analysisReviewNotices[packageId].message,/仮配点/);
});
test('Kindai recommendation: built variants retain both mark tables, three figures and review notices',()=>{
 const route='../dist/past-exam-library/kindai/2025/mathematics-recommendation-general-public-first-stage/';
 const read=role=>fs.readFileSync(new URL(`${route}${role}/index.html`,import.meta.url),'utf8');
 const q=read('questions'),a=read('answers'),analysis=read('analysis');
 assert.equal((q.match(/data-kindai-mark-example=/g)||[]).length,2);
 assert.equal((a.match(/data-figure-id="ans-q3-/g)||[]).length,3);
 assert.equal((q.match(/data-source-review="required"/g)||[]).length,3);
 assert.equal((a.match(/data-source-review="required"/g)||[]).length,3);
 assert.equal((analysis.match(/data-source-review="required"/g)||[]).length,1);
 for(const html of [q,a,analysis]){assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.match(html,/noindex/);}
});
