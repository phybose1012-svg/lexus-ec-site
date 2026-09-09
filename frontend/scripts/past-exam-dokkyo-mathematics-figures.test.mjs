import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {colourCases,commonCircle,tangentPoints,commonNormal,sectionAt} from './build-dokkyo-2025-mathematics-figures.mjs';
const close=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-10,`${actual} != ${expected}`);

test('Dokkyo colour chips preserve face adjacency, counts, and flip equivalence',()=>{
 const counts={seven:7,flip:6,flipped:6,six:6,fiveFirst:5,fiveSecond1:5,fiveSecond2:5,sevenPrism:7};
 for(const [name,{bases,sides}] of Object.entries(colourCases)){
  assert.equal(new Set([...bases,...sides]).size,counts[name]);
  assert.equal(sides.length,name==='sevenPrism'?7:5);
  sides.forEach((colour,i)=>{
   assert.notEqual(colour,sides[(i+1)%sides.length]);
   for(const base of bases)assert.notEqual(colour,base);
  });
 }
 assert.deepEqual(colourCases.flipped.sides,[colourCases.flip.sides[0],...colourCases.flip.sides.slice(1).reverse()]);
 assert.deepEqual(colourCases.flipped.bases,[...colourCases.flip.bases].reverse());
 assert.equal(colourCases.sevenPrism.sides.filter(v=>v==='A').length,3);
});
test('Dokkyo E-fixed AABB arrangements number exactly two',()=>{
 const possibilities=[];
 function visit(word,a,b){if(a+b===0){if(word.every((v,i)=>v!==word[(i+1)%word.length]))possibilities.push(word);return;}
  if(a)visit([...word,'A'],a-1,b);if(b)visit([...word,'B'],a,b-1);}
 visit(['E'],2,2);
 assert.deepEqual(possibilities,[colourCases.fiveSecond1.sides,colourCases.fiveSecond2.sides]);
});
test('Dokkyo circle and intersecting chords satisfy the same power',()=>{
 const {k,center,radius}=commonCircle;
 for(const [x,y] of [[k,1],[k,-1],[-1,0],[3,0]])close((x-center[0])**2+(y-center[1])**2,radius**2);
 close((k+1)*(3-k),1);assert.ok(k>-.75&&k<.75);
});
test('Dokkyo tangent, asymptote incidence and triangle area',()=>{
 const {P,A,B}=tangentPoints;
 close(P[0]**2-P[1]**2,6);
 for(const [x,y] of [P,A,B])close(y,2*x-3*Math.SQRT2);
 close(A[0],A[1]);close(B[0],-B[1]);close(Math.abs(A[0]*B[1]-A[1]*B[0])/2,6);
});
test('Dokkyo common tangent/normal has Q in quadrant four, and OP perpendicular OQ',()=>{
 const {P:[a,b],Q:[c,d]}=commonNormal;
 close(a*a-b*b,6);close(c*c-d*d,-10);close(a*c-b*d,6);close(a*c+b*d,0);
 close(a/b,-d/c);close(a*a*b*b,27/5);assert.ok(c>0&&d<0);
 close(c*c+d*d,(a*a+b*b)*5/3);
});
test('Dokkyo rotated triangle sweeps a disk; outer radius switches at k=4',()=>{
 for(const k of [0,1,4,6.25,9]){
  const {pr,qr,radius}=sectionAt(k);
  close(radius,k<=4?qr:pr);
  // Norm is convex on the filled triangle, so its maximum is at P or Q.
  for(let u=0;u<=1;u+=.1)for(let v=0;v<=1-u;v+=.1)assert.ok(Math.hypot(u*pr,v*qr)<=radius+1e-10);
 }
 close(sectionAt(4).pr,sectionAt(4).qr);
});
test('Dokkyo manifest registers every deferred answer crop once',()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL('../src/data/pastExamFigures/dokkyo-medical-2025-general-early-mathematics.json',import.meta.url),'utf8'));
 const source=JSON.parse(fs.readFileSync(new URL('../src/data/pastExamStagingAnswerSources/dokkyo-medical-2025-general-early-mathematics.json',import.meta.url),'utf8'));
 assert.deepEqual(manifest.items.map(v=>v.id).sort(),source.assets.map(v=>v.id).sort());
 assert.equal(manifest.items.length,14);
});
