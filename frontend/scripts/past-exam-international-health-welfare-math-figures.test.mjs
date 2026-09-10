import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {hexPoint,midpoint,locus,integralValue} from './build-international-health-welfare-2025-mathematics-figures.mjs';
import {withReviewNotice,analysisReviewNotices} from '../src/lib/pastExamReviewNotices.mjs';
const near=(x,y,tol=1e-10)=>assert.ok(Math.abs(x-y)<tol,`${x} != ${y}`);
const id='international-health-welfare-2025-general-mathematics';
test('IUHW regular hexagon has unit edges and source-confirmed counterclockwise labels',()=>{
 for(let n=0;n<6;n++){const p=hexPoint(n),q=hexPoint(n+1);near(Math.hypot(...p),1);near(Math.hypot(p[0]-q[0],p[1]-q[1]),1);assert.ok(p[0]*q[1]-p[1]*q[0]>0);}
 assert.ok(hexPoint(1)[0]<0&&hexPoint(5)[0]>0);near(hexPoint(3)[1],-1);
});
test('IUHW tangent-contact midpoint matches all four transformed boundaries',()=>{
 for(let i=0;i<=30;i++){
  const s=i/10,v=3-2*s/3,r=Math.sqrt(s*s+(v+1)/2),ts=[s-r,s+r];
  near(ts.reduce((n,t)=>n+t,0)/2,s);near(ts.reduce((n,t)=>n-2*t*t-1,0)/2,midpoint([s,v])[1]);near(midpoint([s,v])[1],locus.AD(s));
 }
 near(midpoint([1,0])[1],locus.AB(1));near(locus.AB(1),locus.BC(1));near(locus.AD(0),locus.AB(0));
 near(midpoint([3,0])[1],-38);near(midpoint([3,1])[1],-39);
});
test('IUHW enclosed area is 9/2; curve mapping has unit absolute Jacobian',()=>{
 const n=3000,dx=3/n;let area=0;
 for(let i=0;i<n;i++){const x=(i+.5)*dx;area+=((x<1?locus.AB(x):locus.BC(x))-locus.AD(x))*dx;}
 near(area,4.5,1e-8);near(midpoint([1,2.000001])[1]-midpoint([1,2])[1],-.000001,1e-12);
});
function pathProbability(path){
 let vertex=0,probability=1,visited=[];
 for(const token of path){const step=token==='T'?-1:1,count=token==='T'?2:1;probability*=token==='T'?1/3:2/3;for(let k=0;k<count;k++){vertex=(vertex+step+6)%6;visited.push(vertex);}}
 return{vertex,probability,visited};
}
test('IUHW passing D includes traversed intermediate vertices, not only stopping positions',()=>{
 const routes=Array.from({length:8},(_,i)=>pathProbability(i.toString(2).padStart(3,'0').replaceAll('0','T').replaceAll('1','H')));
 const sum=f=>routes.filter(f).reduce((n,p)=>n+p.probability,0);
 near(sum(p=>p.vertex===0),13/27);near(sum(p=>p.vertex===0&&!p.visited.includes(3)),12/27);
 near(sum(p=>p.vertex===3&&!p.visited.slice(0,-1).includes(3)),4/9);
 near(pathProbability('TH').vertex,5);near(pathProbability('HT').vertex,5);
});
test('IUHW reported source discrepancies are independently reproducible',()=>{
 near(3*(2*Math.SQRT2)**2-2*2**2+24,40);near(Math.sqrt(12+8),2*Math.sqrt(5));assert.ok(Math.log2(81/4)<8);
 near(2*Math.log(1+Math.sqrt(3))-Math.log(2+Math.sqrt(3)),Math.log(2));
 let sum=0,n=10000,dx=Math.sqrt(3)/n;for(let i=0;i<n;i++){const x=(i+.5)*dx;sum+=(Math.hypot(x,1)-(x+1)/2)*dx;}
 near(sum,integralValue,1e-8);assert.ok(Math.abs(sum-.5*(Math.log(1+Math.sqrt(3))+Math.sqrt(3)))>.5);
 const x=.7,alpha=Math.atan(x)/2,sign=t=>Math.sin(2*t)-x*Math.cos(2*t);
 assert.ok(sign(alpha/2)<0);assert.ok(sign((alpha+Math.PI/4)/2)>0);
});
test('IUHW scoped source notices cover all four majors and the analysis only',()=>{
 const original='<h2>問題</h2><p>unchanged source</p>';
 for(const n of['01','02','03','04'])assert.match(withReviewNotice(original,id,'major-question-'+n),/data-source-review="required"/);
 assert.ok(analysisReviewNotices[id]);assert.equal(analysisReviewNotices['iwate-medical-2025-general-mathematics'],undefined);
 const dist=fs.readFileSync(new URL('../dist/past-exam-library/international-health-welfare/2025/mathematics/analysis/index.html',import.meta.url),'utf8');
 assert.match(dist,/分析の前提となる問題・解説を照合中/);assert.match(dist,/data-source-review="required"/);
});
test('IUHW manifest registers all three content diagrams without source crops',()=>{
 const m=JSON.parse(fs.readFileSync(new URL(`../src/data/pastExamFigures/${id}.json`,import.meta.url)));
 assert.deepEqual(m.items.map(x=>x.id),['q3-regular-hexagon','ans-q2-locus','ans-q4-triangle']);assert.equal(m.restrictedSourceCopied,false);
});
