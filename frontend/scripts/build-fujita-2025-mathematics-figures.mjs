// Five answer-only figures, derived from the public question's conditions.
// No source crop is copied. Formula and incidence invariants live beside geometry.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,mi,rm,sub,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';

const arrow='marker-end="url(#arrow)"',center='text-anchor="middle"';
const sup=v=>`<tspan class="rm" font-size="70%" baseline-shift="super">${v}</tspan>`;
const f=x=>x*x*x-x;
export const transformed=x=>3**x-3**(-x);
export const objective=t=>t*t+3*t+2;
export const exponential=x=>3**(2*x)+3**(-2*x)+3**(x+1)-3**(1-x);
export const allowed=a=>a<=-1||a>=5;
export const rootSquares=a=>4*(a-1)**2-14;
export const rotationIntervals=r=>[[-r,r-r**3],[r**3-r,r]];
export const triangle={a:2,b:1,O:[0,0],A:[3,0],B:[0,4],P:[2,0],Q:[0,1],R:[1.8,.4]};
export const parabola1=(x,k)=>x*x+2*(k+1)*x+4*k+3;
export const parabola2=(x,k)=>x*x+2*(k-1)*x-4*k+3;
export const tangent=(x,k)=>-2*k*x-4*k*k+2;
const samples=(fn,a,b,n=120)=>Array.from({length:n+1},(_,i)=>{const x=a+(b-a)*i/n;return[x,fn(x)];});
const curve=(fn,a,b,to,extra='')=>`<path d="${pointsPath(samples(fn,a,b).map(p=>to(...p)))}" ${extra}/>`;
const poly=(pts,to,fill)=>`<path d="${pointsPath(pts.map(p=>to(...p)))} Z" fill="${fill}" stroke="none"/>`;
function axes(to,{xmin,xmax,ymin,ymax,x='x',y='y',origin=true}){
 const [cx,cy]=to(0,0),[right]=to(xmax,0),[,top]=to(0,ymax);
 return line(...to(xmin,0),right,cy,`class="axis" ${arrow}`)+line(...to(0,ymin),cx,top,`class="axis" ${arrow}`)+
 math(right+13,cy+8,[mi(x)])+math(cx+12,top+5,[mi(y)])+(origin?math(cx-24,cy+25,[rm('O')]):'');
}
function rotation(){
 // At each radius r, rotating BOTH x signs gives the UNION [-r,r].
 // Summing shells from the two signed lobes would count their overlap twice.
 const to=(x,y)=>[310+170*x,290-170*y];
 let body=text(310,33,'① 回転する前の領域',center)+math(310,74,[mi('C'),rm(': '),mi('y'),rm(' = '),mi('x'),sup('3'),rm(' − '),mi('x')],center);
 for(const [a,b,c]of[[-1,0,'#e1ebf3'],[0,1,'#f4e6c8']])body+=poly([...samples(f,a,b),...samples(x=>x,b,a)],to,c);
 body+=axes(to,{xmin:-1.45,xmax:1.45,ymin:-1.22,ymax:1.08,origin:false});
 body+=curve(f,-1.2,1.2,to)+curve(x=>x,-1.2,1.2,to,'class="accent"');
 body+=line(...to(-1,-1),...to(-1,0))+line(...to(1,0),...to(1,1));
 body+=math(520,160,[mi('ℓ'),rm(': '),mi('y'),rm(' = '),mi('x')]);
 body+=math(94,321,[rm('−1')])+math(494,316,[rm('1')]);
 body+=text(310,520,'左右の領域を、同じ y 軸のまわりに回転します。',center);
 body+=line(50,553,570,553,'class="guide"');
 const tr=(r,y)=>[155+255*r,811-140*y];
 body+=text(310,594,'② 回転後の子午断面（半径 r の側）',center);
 body+=poly([[0,0],[1,1],[1,-1]],tr,'#e1ebf3');
 body+=axes(tr,{xmin:-.1,xmax:1.3,ymin:-1.2,ymax:1.3,x:'r'});
 body+=line(...tr(0,0),...tr(1,1),'class="accent"')+line(...tr(0,0),...tr(1,-1),'class="accent"')+line(...tr(1,-1),...tr(1,1));
 body+=line(...tr(.65,-.65),...tr(.65,.65),'stroke="#557d98" stroke-width="4"');
 body+=math(425,677,[mi('y'),rm(' = '),mi('r')])+math(425,956,[mi('y'),rm(' = −'),mi('r')]);
 body+=math(421,846,[rm('1')])+math(347,790,[rm('2'),mi('r')]);
 body+=text(310,1025,'重なった部分は一度だけ数えます。',center);
 body+=text(310,1054,'半径 r の円筒殻の高さは 2r です。',center);
 return body;
}
function realRoots(){
 const to=(a,y)=>[235+50*a,355-3*y];
 let body=math(350,38,[mi('α'),sup('2'),rm(' + '),mi('β'),sup('2'),rm(' = 4('),mi('a'),rm(' − 1)'),sup('2'),rm(' − 14')],center);
 body+='<defs><clipPath id="plot"><rect x="65" y="65" width="550" height="356"/></clipPath></defs>';
 body+='<g clip-path="url(#plot)">';
 body+=`<rect x="65" y="65" width="120" height="356" fill="#f1f5f7" stroke="none"/><rect x="485" y="65" width="130" height="356" fill="#f1f5f7" stroke="none"/>`;
 body+=curve(rootSquares,-3.4,7.6,to,'class="guide"');
 body+=curve(rootSquares,-3.4,-1,to,'stroke="#285879" stroke-width="3"')+curve(rootSquares,5,7.6,to,'stroke="#285879" stroke-width="3"');
 body+='</g>'+axes(to,{xmin:-3.4,xmax:7.7,ymin:-20,ymax:97,x:'a',origin:false});
 for(const a of[-1,5])body+=line(...to(a,0),...to(a,rootSquares(a)),'class="guide"')+dot(...to(a,rootSquares(a)));
 body+=math(270,306,[rm('(−1, 2)')])+line(270,315,...to(-1,2),'class="guide"');
 body+=math(504,196,[rm('(5, 50)')]);
 body+=dot(...to(1,-14))+math(327,433,[rm('(1, −14)')]);
 body+=math(483,387,[rm('5')]);
 body+=text(350,479,'太線：実数解をもつ範囲 ／ 破線：範囲外',center);
 body+=text(350,509,'許される範囲で最小となるのは a = −1。',center);
 return body;
}
function geometry(){
 const to=(x,y)=>[115+132*x,660-132*y],p=triangle;
 let body=poly([p.O,p.A,p.B],to,'#f5f8fa');
 body+=`<path d="${pointsPath([p.O,p.A,p.B,p.O].map(v=>to(...v)))}"/>`+line(...to(...p.A),...to(...p.Q))+line(...to(...p.B),...to(...p.P));
 body+=`<path d="${pointsPath([[0,.16],[.16,.16],[.16,0]].map(v=>to(...v)))}"/>`;
 // Angles at A/P start along the horizontal leftward ray.
 const sector=(origin,r,a,b)=>`<path d="${pointsPath(Array.from({length:31},(_,i)=>{const t=a+(b-a)*i/30;return to(origin[0]+r*Math.cos(t),origin[1]+r*Math.sin(t));}))}" class="accent"/>`;
 body+=sector(p.A,.48,Math.PI-Math.atan(1/3),Math.PI);
 body+=sector(p.P,.24,Math.PI-Math.atan(2),Math.PI);
 const theta=Math.atan2(p.P[1]-p.R[1],p.P[0]-p.R[0]);
 body+=sector(p.R,.18,theta,theta-3*Math.PI/4);
 body+=math(467,692,[mi('α')])+line(476,667,456,647,'class="guide"')+math(332,694,[mi('β')])+line(336,670,349,653,'class="guide"');
 body+=math(480,566,[rm('135°')])+line(474,574,360,629,'class="guide"');
 const labels={O:[80,690],A:[525,688],B:[94,103],P:[371,696],Q:[76,536],R:[380,587]};
 for(const n of['O','A','B','P','Q','R'])body+=dot(...to(...p[n]))+math(...labels[n],[rm(n)]);
 body+=line(81,132,81,528,'class="guide"')+math(39,341,[mi('a'),rm(' + '),mi('b')],'transform="rotate(-90 39 341)"');
 body+=math(194,714,[mi('a')],center)+math(445,733,[mi('b')],center)+math(65,605,[mi('b')]);
 body+=text(330,40,'長さを同じ単位でそろえた配置例',center);
 body+=text(330,756,'OA = QB = a+b、OQ = b、OP = a、PA = b',center);
 return body;
}
function threeGraphs(){
 let body='';
 const graph=(index,top,heading,formula,fn,{xmin,xmax,ymin,ymax,x,y,point,ticks=[]})=>{
  const left=85,right=548,base=top+295,high=top+100;
  const to=(u,v)=>[left+(u-xmin)/(xmax-xmin)*(right-left),base-(v-ymin)/(ymax-ymin)*(base-high)];
  const id=`graph-${index}`;
  body+=text(310,top+28,heading,center)+math(310,top+63,formula,center)+`<defs><clipPath id="${id}"><rect x="${left}" y="${high}" width="${right-left}" height="${base-high}"/></clipPath></defs>`;
  body+=axes(to,{xmin,xmax,ymin,ymax,x,y,origin:false});
  body+=`<g clip-path="url(#${id})">`+curve(fn,xmin,xmax,to,'stroke="#285879" stroke-width="2.3"')+'</g>';
  if(point){body+=dot(...to(...point))+line(...to(point[0],0),...to(...point),'class="guide"')+line(...to(...point),...to(0,point[1]),'class="guide"');}
  for(const[t,u,v]of ticks)body+=math(...to(u,v),[rm(t)],'font-size="22"');
 };
 graph(1,0,'① 置換変数の値域',[mi('t'),rm(' = 3'),`<tspan font-size="70%" baseline-shift="super">${mi('x')}</tspan>`,rm(' − 3'),`<tspan font-size="70%" baseline-shift="super">${rm('−')}${mi('x')}</tspan>`],transformed,{xmin:-1.55,xmax:1.55,ymin:-5,ymax:5,x:'x',y:'t'});
 body+=text(310,325,'単調に増加し、値の範囲に制限はありません。',center);
 body+=line(60,352,560,352,'class="guide"');
 graph(2,369,'② 置換後の二次関数',[mi('y'),rm(' = '),mi('t'),sup('2'),rm(' + 3'),mi('t'),rm(' + 2')],objective,{xmin:-3.5,xmax:1,ymin:-1.5,ymax:3,x:'t',y:'y',point:[-1.5,-.25],ticks:[['−3/2',-1.93,-1.08],['−1/4',.1,-1]]});
 body+=line(60,719,560,719,'class="guide"');
 graph(3,737,'③ 元の関数',[mi('y'),rm(' = '),mi('f'),rm('('),mi('x'),rm(')')],exponential,{xmin:-1.1,xmax:.65,ymin:-1.5,ymax:4,x:'x',y:'y',point:[-Math.log(2)/Math.log(3),-.25],ticks:[['−1/4',.06,-1.1]]});
 body+=text(310,1071,'t = −3/2 に対応する x で、最小値 −1/4。',center);
 return body;
}
function parabolas(){
 // The affine shear (u,v)=(x+2k, y-ell(x)) has Jacobian determinant 1.
 // Thus the diagram applies to EVERY k and preserves the required area.
 const to=(u,v)=>[330+115*u,450-80*v];
 let body=text(330,32,'接線を基準に座標を移した図',center);
 body+=math(330,70,[mi('u'),rm(' = '),mi('x'),rm(' + 2'),mi('k'),rm(',  '),mi('v'),rm(' = '),mi('y'),rm(' − '),mi('ℓ'),rm('('),mi('x'),rm(')')],center);
 body+=poly([[-1,0],...samples(u=>(u+1)**2,-1,0),...samples(u=>(u-1)**2,0,1),[1,0]],to,'#f4e6c8');
 body+='<defs><clipPath id="parabolas"><rect x="62" y="100" width="536" height="375"/></clipPath></defs>';
 body+=axes(to,{xmin:-2.3,xmax:2.3,ymin:-.25,ymax:4.4,x:'u',y:'v'});
 body+='<g clip-path="url(#parabolas)">'+curve(u=>(u+1)**2,-2.3,2.3,to)+curve(u=>(u-1)**2,-2.3,2.3,to,'stroke="#547c96"')+'</g>';
 body+=line(...to(-2.2,0),...to(2.2,0),'class="accent"');
 for(const p of[[-1,0],[0,1],[1,0]])body+=dot(...to(...p));
 body+=math(100,146,[mi('C'),sub('2')])+math(534,146,[mi('C'),sub('1')]);
 body+=math(199,486,[rm('−1')])+math(440,486,[rm('1')])+math(347,361,[rm('1')]);
 body+=math(70,496,[mi('ℓ'),rm(': '),mi('v'),rm(' = 0')]);
 body+=text(330,537,'囲まれた領域では、低い方の放物線が上端です。',center);
 body+=text(330,570,'この座標変換では面積は変わりません。',center);
 return body;
}
export function buildFigures(){
 const pack=createSvgPackage('fujita-health-2025-general-early-mathematics',import.meta.url);
 pack.add('ans-q1-1-diagrams',620,1090,'曲線y=x³−xと法線y=x、x=±1で囲まれた左右の領域と、y軸回転後の子午断面。半径rでは左右が重なり、高さは2rとなる。','左右の回転領域は重なりを除いた和集合で考える。',rotation());
 pack.add('ans-q1-3-graph',700,540,'α²+β²=4(a−1)²−14のグラフ。実数解条件を満たすaが−1以下と5以上の部分を太線にし、(−1,2)と(5,50)を示す。','太線部分での最小値は、a=−1のとき。',realRoots());
 pack.add('ans-q1-7-geometry',660,790,'直角三角形OABの辺OA上にP、辺OB上にQがあり、AQとBPはRで交わる。OA=QB=a+b、OP=a、PA=OQ=b。角α、βと角PRQ=135度を示す。','a:b=2:1の配置例。長さと角度の関係は一般の正のa,bでも共通。',geometry());
 pack.add('ans-q1-8-graphs',620,1105,'t=3ˣ−3⁻ˣの単調増加グラフ、t²+3t+2の放物線、元の関数f(x)の3図。tは実数全体を動き、t=−3/2に対応する点で最小値−1/4。','変数の置換から元の関数の最小値までを3段で確認。',threeGraphs());
 pack.add('ans-q2-parabolas',660,600,'u=x+2k、v=y−ℓ(x)により、共通接線をv=0へ移した図。C₁はv=(u+1)²、C₂はv=(u−1)²。接点u=±1、交点u=0と、低い方の放物線と接線で囲まれた領域を示す。','座標変換は面積を保つ。左半分はC₁、右半分はC₂と接線との差。',parabolas());
 return pack.save('問題条件から独自に算出。回転体では左右領域の和集合、指数置換では実数全体、放物線では面積保存の座標変換を明示。元の解説には別途修正依頼がある。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildFigures();
