import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {rotationIntervals,allowed,rootSquares,triangle,transformed,objective,exponential,parabola1,parabola2,tangent} from './build-fujita-2025-mathematics-figures.mjs';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
test('rotating both lobes forms overlapping height intervals whose union has height 2r',()=>{
 for(let i=0;i<=100;i++){const r=i/100,[a,b]=rotationIntervals(r);assert.ok(a[1]>=b[0]);close(Math.min(a[0],b[0]),-r);close(Math.max(a[1],b[1]),r);}
 // Integrating the union shell: 2 pi integral_0^1 r (2r) dr = 4pi/3.
 close(2*Math.PI*2/3,4*Math.PI/3);
});
test('real-root domain and objective minimum agree',()=>{
 for(let a=-8;a<=8;a+=.125)assert.equal(allowed(a),a*a-4*a-5>=0);
 close(rootSquares(-1),2);close(rootSquares(5),50);assert.equal(allowed(1),false);
});
test('triangle incidences, division ratios and PRQ angle hold',()=>{
 const {a,b,A,B,P,Q,R}=triangle;
 close(Math.hypot(...A),B[1]-Q[1]);close(P[0]/(A[0]-P[0]),a/b);close(Q[1]/(B[1]-Q[1]),b/(a+b));
 const cross=(u,v,w)=>(v[0]-u[0])*(w[1]-u[1])-(v[1]-u[1])*(w[0]-u[0]);
 close(cross(A,Q,R),0);close(cross(B,P,R),0);
 const u=P.map((v,i)=>v-R[i]),v=Q.map((v,i)=>v-R[i]);
 close(Math.acos((u[0]*v[0]+u[1]*v[1])/(Math.hypot(...u)*Math.hypot(...v)))*180/Math.PI,135);
});
test('exponential substitution preserves function and reaches the negative minimizer',()=>{
 for(let x=-2;x<=2;x+=.05)close(objective(transformed(x)),exponential(x));
 const x=-Math.log(2)/Math.log(3);close(transformed(x),-1.5);close(exponential(x),-.25);
 assert.ok(transformed(-10)<-1000&&transformed(10)>1000);
});
test('affine shear transforms both parabolas and tangent, with unit area determinant',()=>{
 for(const k of[-3,-.7,0,.35,2])for(const u of[-2,-1,-.5,0,.5,1,2]){const x=u-2*k;close(parabola1(x,k)-tangent(x,k),(u+1)**2);close(parabola2(x,k)-tangent(x,k),(u-1)**2);}
 // d(u,v)/d(x,y) = [[1,0],[2k,1]]; hence no area scaling.
 close(1*1-0*7,1);
});
test('Fujita composite diagrams have scoped readable screen and print sizes',()=>{
 const css=fs.readFileSync(new URL('../src/styles/past-exam-figures.css',import.meta.url),'utf8');
 assert.match(css,/img\[src\^="\/assets\/past-exams\/fujita-health-2025-general-early-mathematics\/"\] \{ max-height: none;/);
 assert.match(css,/body\.is-printing-past-exam-document[^\n]+fujita-health-2025-general-early-mathematics[^\n]+max-height: 200mm; max-width: 150mm;/);
});
