// Original analytic constructions. Only the hexagon label order was read from
// the source figure; no pixels, paths, sizes or coordinates were copied.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,mi,rm,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
const center='text-anchor="middle"',arrow='marker-end="url(#arrow)"';
export const hexPoint=n=>[Math.cos(Math.PI/2+n*Math.PI/3),Math.sin(Math.PI/2+n*Math.PI/3)];
export const midpoint=([s,v])=>[s,-4*s*s-v-2];
export const locus={AB:x=>-4*x*x+3*x-5,BC:x=>-4*x*x-2,AD:x=>-4*x*x+2*x/3-5};
export const integralValue=.5*Math.log(2+Math.sqrt(3))+Math.sqrt(3)/2-.75;
const lab=(x,y,v)=>math(x,y,[rm(v)]);
const sample=(f,lo,hi,n=160)=>Array.from({length:n+1},(_,i)=>{const x=lo+(hi-lo)*i/n;return[x,f(x)];});
function hexagon(){
 const M=([x,y])=>[350+155*x,241-155*y],pts=Array.from({length:6},(_,n)=>M(hexPoint(n)));
 let b=text(350,37,'一辺の長さが 1 の正六角形',center);
 b+=`<path d="${pointsPath(pts)} Z" fill="#f5f8fa" stroke-width="2.2"/>`;
 for(let n=0;n<6;n++){
  const [x,y]=hexPoint(n),p=M([x,y]),label=M([1.2*x,1.2*y]);
  b+=dot(...p)+math(label[0],label[1]+8,[rm('ABCDEF'[n])],center);
 }
 b+=text(350,465,'P は最初、頂点 A にある。',center);
 // Directions are stated givens, not paths solving any probability item.
 b+=text(350,505,'2以下：時計回りに2　　3以上：反時計回りに1',center);
 return b;
}
function locusPlot(){
 const X=x=>125+140*x,Y=y=>85-11*y,M=([x,y])=>[X(x),Y(y)];
 let b=text(350,33,'接点 R・S の中点 M が描く軌跡',center);
 const upper=[...sample(locus.AB,0,1),...sample(locus.BC,1,3).slice(1)],lower=sample(locus.AD,0,3).reverse();
 b+=`<path d="${pointsPath([...upper,...lower].map(M))} Z" fill="#e7eef4" stroke="none"/>`;
 b+=line(125,554,125,51,`class="axis" ${arrow}`)+line(99,85,607,85,`class="axis" ${arrow}`)+math(617,94,[mi('x')])+math(99,57,[mi('y')])+lab(99,80,'O');
 for(const x of[1,2,3])b+=line(X(x),81,X(x),89,'class="axis"')+math(X(x),71,[rm(x)],center);
 for(const y of[-10,-20,-30,-40])b+=line(121,Y(y),129,Y(y),'class="axis"')+math(109,Y(y)+8,[rm('−'+Math.abs(y))],'text-anchor="end"');
 b+=`<path d="${pointsPath(upper.map(M))}" stroke-width="2.5"/>`+`<path d="${pointsPath(lower.map(M))}" class="accent"/>`+line(...M([3,-38]),...M([3,-39]),'stroke-width="2.5"');
 const coords=[['A′',[0,-5],[81,133]],['B′',[1,-6],[274,137]],['C′',[3,-38],[586,474]],['D′',[3,-39],[586,551]]];
 for(const [name,p,label] of coords){const pt=M(p);b+=dot(...pt)+lab(...label,name);if(name==='C′'||name==='D′')b+=line(label[0]-6,label[1]-7,pt[0]+7,pt[1],'class="guide"');}
 b+=text(350,592,'青：Q が AB・BC・CD 上　　金：Q が AD 上',center);
 b+=text(350,628,'A′・B′・C′・D′ は、Q が各頂点にあるときの M。',center);
 return b;
}
function triangle(){
 const A=[125,306],B=[550,306],C=[550,91],alpha=Math.atan2(215,425);
 let b=text(350,37,'tan 2α = x を表す直角三角形（x > 0）',center);
 b+=`<path d="${pointsPath([A,B,C])} Z" fill="#f5f8fa"/>`+`<path d="M530 306 v-20 h20"/>`;
 b+=`<path d="${pointsPath(Array.from({length:41},(_,i)=>[125+78*Math.cos(-alpha*i/40),306+78*Math.sin(-alpha*i/40)]))}"/>`+math(231,285,[rm('2'),mi('α')]);
 b+=math(338,343,[rm('1')],center)+math(577,211,[mi('x')]);
 // A true vector radical with a vinculum, avoiding unsupported Unicode √.
 b+=`<g transform="translate(277 167) rotate(${-alpha*180/Math.PI})"><path d="M0 0 l6 -5 l8 16 l8 -39 h99"/>`+math(28,-3,[mi('x'),rm('² + 1')])+'</g>';
 b+=text(350,394,'角 2α の隣辺を 1、対辺を x と置く。',center);
 return b;
}
export function buildFigures(){
 const pack=createSvgPackage('international-health-welfare-2025-general-mathematics',import.meta.url);
 pack.add('q3-regular-hexagon',700,535,'一辺1の正六角形。AからB、C、D、E、Fが反時計回りに並び、Aの反対側がD。点PはAから出発する。','第3問：頂点の順序と移動規則。解答の経路は描き込んでいない。',hexagon());
 pack.add('ans-q2-locus',700,655,'Qが四角形ABCDを一周すると、接点R・Sの中点Mは3つの放物線弧とx=3の線分で囲まれた領域の境界をたどる。A′=(0,−5)、B′=(1,−6)、C′=(3,−38)、D′=(3,−39)。','第2問(2)：縦横の目盛りは異なる。囲まれる面積は9/2。',locusPlot());
 pack.add('ans-q4-triangle',700,425,'角2αの隣辺が1、対辺がx、斜辺が√(x²+1)の直角三角形。x>0、0<2α<π/2なので各辺の長さは正。','第4問(2)(ii)：三角比をxで表すための補助図。辺の比率は配置例。',triangle());
 return pack.save('正六角形のラベル順のみ原図から意味情報として確認し、単位円上の座標から独立生成。軌跡はQ=(s,v)と接線方程式からM=(s,−4s²−v−2)を導出し描画。原文・原解説に対数/双曲線/確率の定義/定積分の不整合があるため、本文と分析を要確認のまま維持し修正依頼へ分離。原図クロップは複製・トレースしていない。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildFigures();
