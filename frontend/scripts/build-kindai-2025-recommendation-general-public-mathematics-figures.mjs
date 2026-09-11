// Original graphs sampled from the problem's functions; no source pixels copied.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,mi,rm,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
import {markSupplement as sharedMarkSupplement} from './build-kindai-2025-general-first-a-mathematics-figures.mjs';
export const packageId='kindai-2025-recommendation-general-public-mathematics';
export const f=(x,a,b)=>(x-a)*(x-b);
export const g=(x,a,b)=>-((x-a)**2)+b;
export const intersections=(a,b)=>[(3*a+b-Math.sqrt((a-b)**2+8*b))/4,(3*a+b+Math.sqrt((a-b)**2+8*b))/4].map(x=>[x,f(x,a,b)]);
const center='text-anchor="middle"',end='text-anchor="end"';
const style='<style>.math{font-size:29px}text{font-size:19px}.curve-f{stroke:#315f87;stroke-width:2.5}.curve-g{stroke:#ad7e2d;stroke-width:2.5}</style>';
const sample=(fn,a,b,n=220)=>Array.from({length:n+1},(_,i)=>fn(a+(b-a)*i/n));
const poly=(p,attrs='')=>`<path d="${pointsPath(p)}" ${attrs}/>`;
const symbol=(x,y,s,attrs='')=>math(x,y,[mi(s)],attrs);
const num=(x,y,s,attrs='')=>math(x,y,[rm(s)],attrs);
function legend(a,b){
 return line(45,30,75,30,'class="curve-f"')+math(86,39,[mi('f'),rm('('),mi('x'),rm(') = ('),mi('x'),rm(` − ${a})(`),mi('x'),rm(` − ${b})`)])+
 line(45,72,75,72,'class="curve-g"')+math(86,81,[mi('g'),rm('('),mi('x'),rm(') = −('),mi('x'),rm(` − ${a})² + ${b}`)]);
}
export function graph(kind){
 const quadrants=kind==='quadrants',a=2,b=quadrants?6:4;
 const px=x=>140+(quadrants?60:70)*x,py=y=>(quadrants?460:425)-(quadrants?44:57)*y;
 const bottom=quadrants?645:500,right=quadrants?580:550;
 let s=style+legend(a,b)+`<defs><clipPath id="plot"><rect x="48" y="105" width="${right-48}" height="${bottom-105}"/></clipPath></defs>`;
 if(kind==='area'){
  const p=[...sample(x=>[px(x),py(g(x,a,b))],1,4),...sample(x=>[px(x),py(f(x,a,b))],4,1)];
  s+=poly(p,'fill="#e5edf4" stroke="none" data-region="between-curves"');
 }
 s+=line(48,py(0),right,py(0),'class="axis" marker-end="url(#arrow)"')+line(px(0),bottom,px(0),105,'class="axis" marker-end="url(#arrow)"');
 s+=`<g clip-path="url(#plot)">`+poly(sample(x=>[px(x),py(f(x,a,b))],-.4,quadrants?7.2:5.6),'class="curve-f" data-function="f"')+poly(sample(x=>[px(x),py(g(x,a,b))],-.4,quadrants?7.2:5.6),'class="curve-g" data-function="g"')+'</g>';
 s+=symbol(123,py(0)+31,'O',end)+symbol(right+12,py(0)+8,'x')+symbol(119,110,'y');
 s+=line(px(a),py(b),px(a),py(0),'class="guide"')+dot(px(a),py(b));
 s+=kind==='overview'?math(px(a)+15,py(b)-24,[rm('('),mi('a'),rm(', '),mi('b'),rm(')')]):num(px(a)+15,py(b)-24,'(2, '+b+')');
 for(const x of [a,b]){
  const lx=px(x)+(x===a?-12:22),anchor=x===a?end:'';
  s+=dot(px(x),py(0))+(kind==='overview'?symbol(lx,py(0)+35,x===a?'a':'b',anchor):num(lx,py(0)+35,String(x),anchor));
 }
 if(kind==='overview'){
  s+=text(310,535,'a = 2、b = 4 の例：共通の x 切片は (b, 0)',center);
 }else{
  for(const [x,y] of intersections(a,b))s+=dot(px(x),py(y));
  if(kind==='area'){
   s+=line(px(1),py(3),px(1),py(0),'class="guide"')+num(px(1),py(0)+35,'1',center);
   s+=symbol(px(2.6),py(1.5),'S',center);
   s+=text(310,535,'網かけは x が 1 から 4 までの囲まれた領域',center);
  }else{
   s+=line(px(1),py(5),px(1),py(0),'class="guide"')+line(px(5),py(-3),px(5),py(0)+52,'class="guide"');
   s+=num(px(1),py(0)+35,'1',center)+num(px(5),py(0)+35,'5',center);
   s+=num(125,py(5)-17,'(1, 5)',end)+line(126,py(5)-8,px(1)-7,py(5),'class="guide"')+num(px(5)+15,py(-3)+31,'(5, −3)');
   s+=text(310,682,'第1象限と第4象限に 1 点ずつ共有点をもつ',center);
  }
 }
 return s;
}
export function markSupplement(){return {...sharedMarkSupplement(),packageId};}
export function build(){
 const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('ans-q3-parabola-overview',620,555,'a=2、b=4の例。fのx切片は(a,0)と(b,0)、gの頂点は(a,b)で、gは(a,0)を通らず(b,0)を通る。','x軸上の共有点をもつ場合の例。',graph('overview'));
 pack.add('ans-q3-enclosed-area',620,555,'f=(x−2)(x−4)とg=−(x−2)²+4の共有点は(1,3)と(4,0)。1から4までgがfより上にあり、網かけの面積Sは9。','2つの放物線に囲まれた面積。',graph('area'));
 pack.add('ans-q3-quadrants',620,705,'a=2、b=6の2放物線。共有点(1,5)は第1象限、(5,−3)は第4象限にあり、両点の座標は整数。','条件を満たす2つの格子点共有点。',graph('quadrants'));
 fs.writeFileSync(new URL(`../src/data/pastExamBatch/question-supplements/${packageId}.json`,import.meta.url),JSON.stringify(markSupplement(),null,2)+'\n');
 return pack.save('問題の二次関数と整数条件から独立計算した3図。restricted cropは複製していない。共通注意2例はHTML表。問題のマーク欄・統計表と解説の省略は元HTML修復待ち。権利・人間レビュー未承認。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))build();
