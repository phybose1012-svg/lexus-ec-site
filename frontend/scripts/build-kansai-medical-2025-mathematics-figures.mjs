// Original geometry from the question conditions, not from source-image pixels.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,mi,rm,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='kansai-medical-2025-general-early-mathematics';
export const height=x=>4*x**3-3*x+1;
export const intersectionFunction=x=>-4*Math.cos(x)**2+4*Math.cos(x);
export const parabolaPoint=(a,y)=>[a/4-y*y/a,y];
export const rotate=([x,y],angle=2*Math.PI/3)=>[x*Math.cos(angle)-y*Math.sin(angle),x*Math.sin(angle)+y*Math.cos(angle)];
export const section=x=>({A:[x,-Math.sqrt(1-x*x),0],B:[x,Math.sqrt(1-x*x),0],C:[x,Math.sqrt(1-x*x),height(x)],D:[x,-Math.sqrt(1-x*x),height(x)]});
const center='text-anchor="middle"',arrow='marker-end="url(#arrow)"';
const style='<style>text{font-size:19px}.math{font-size:28px}.blue{stroke:#507e9f;stroke-width:2.4}.gold{stroke:#b28736;stroke-width:2.4}</style>';
const poly=(pts,attrs='')=>`<path d="${pointsPath(pts)}" ${attrs}/>`;
const close=pts=>[...pts,pts[0]];
const sample=(f,a,b,n=160)=>Array.from({length:n+1},(_,i)=>f(a+(b-a)*i/n));
const label=(p,s,dx=10,dy=-10)=>dot(...p)+math(p[0]+dx,p[1]+dy,[mi(s)]);
const edge=(a,b,attrs='')=>line(...a,...b,attrs);
const right=(p,u,v,size=10)=>{const un=Math.hypot(...u),vn=Math.hypot(...v),a=u.map(x=>x/un*size),b=v.map(x=>x/vn*size);return poly([[p[0]+a[0],p[1]+a[1]],[p[0]+a[0]+b[0],p[1]+a[1]+b[1]],[p[0]+b[0],p[1]+b[1]]],'stroke-width="1.2"');};
const arc=(c,r,a,b,attrs='')=>poly(sample(t=>[c[0]+r*Math.cos(t),c[1]-r*Math.sin(t)],a,b,40),attrs);
function circleFigure(){
 const s=145,to=([x,y])=>[88+s*x,260-s*y],theta=Math.PI/5,r=2*Math.cos(theta),P=[r*Math.cos(theta),r*Math.sin(theta)],O=[0,0],A=[2,0];
 let out=text(250,32,'直径に対する円周角は直角',center);
 out+=edge(to([-.3,0]),to([2.45,0]),`class="axis" ${arrow}`)+edge(to([0,-1.15]),to([0,1.3]),`class="axis" ${arrow}`);
 out+=poly(sample(t=>to([1+Math.cos(t),Math.sin(t)]),0,2*Math.PI));
 out+=edge(to(O),to(P),'class="blue"')+edge(to(P),to(A),'class="guide"')+right(to(P),[-P[0],P[1]],[2-P[0],P[1]]);
 out+=arc(to(O),46,0,theta)+math(144,244,[mi('θ')]);
 out+=label(to(O),'O',-25,28)+label(to(A),'A',5,28)+label(to(P),'P',8,-14);
 out+=math(433,290,[mi('x')])+math(66,63,[mi('y')])+math(178,162,[mi('r')])+math(391,109,[mi('C')]);
 out+=math(250,454,[mi('OA'),rm(' = 2,   '),mi('OP'),rm(' = 2 cos '),mi('θ')],center);
 return out;
}
function parabolaPanel(a,base){
 const to=([x,y])=>[250+58*x,base-58*y],Q=parabolaPoint(a,2.65),H=[a/2,Q[1]],O=[0,0],angle=Math.atan2(Q[1],Q[0]);
 let out=math(250,base-218,[mi('a'),rm(a>0?' > 0':' < 0')],center);
 out+=edge(to([-3.6,0]),to([3.6,0]),`class="axis" ${arrow}`)+edge(to([0,-3.15]),to([0,3.25]),`class="axis" ${arrow}`);
 out+=poly(sample(y=>to(parabolaPoint(a,y)),-3.1,3.1),'class="blue"');
 out+=edge(to([a/2,-3.05]),to([a/2,3.05]),'class="gold"');
 out+=edge(to(O),to(Q))+edge(to(Q),to(H));
 out+=right(to(H),[a>0?-1:1,0],[0,1]);
 out+=arc(to(O),36,0,angle)+math(270,base-47,[mi('θ')]);
 out+=label(to(O),'O',-30,30)+label(to(Q),'Q',a>0?-38:18,-28)+label(to(H),'H',a>0?12:-30,-8);
 out+=math(a>0?410:96,base+33,[mi('a'),rm('/2')],center);
 out+=math(a>0?385:104,base-193,[mi('x'),rm(' = '),mi('a'),rm('/2')],center);
 out+=math(449,base+30,[mi('x')])+math(229,base-190,[mi('y')]);
 out+=math(250,base+208,[mi('OQ'),rm(' = '),mi('QH')],center);
 return out;
}
function intersectionGraph(){
 const to=([x,y])=>[66+58*x,188-35*y],k=-3;
 let out=math(250,36,[mi('h'),rm('('),mi('x'),rm(') = −4 cos² '),mi('x'),rm(' + 4 cos '),mi('x')],center+' font-size="26"');
 out+=edge(to([-.2,0]),to([6.8,0]),`class="axis" ${arrow}`)+edge(to([0,-8.7]),to([0,2.4]),`class="axis" ${arrow}`);
 for(const y of [1,-8])out+=edge(to([0,y]),to([2*Math.PI,y]),'class="guide"')+math(45,to([0,y])[1]+8,[rm(y===1?'1':'−8')],'text-anchor="end"');
 out+=edge(to([0,k]),to([2*Math.PI+.3,k]),'class="gold"')+math(371,to([0,k])[1]-14,[mi('y'),rm(' = '),mi('k')]);
 out+=poly(sample(x=>to([x,intersectionFunction(x)]),0,2*Math.PI,360),'class="blue"');
 for(const [x,lab,dy] of [[Math.PI/3,'π/3',-58],[Math.PI,'π',32],[5*Math.PI/3,'5π/3',-58]]){
  out+=edge(x===Math.PI?[to([x,0])[0],238]:to([x,0]),to([x,intersectionFunction(x)]),'class="guide"');out+=math(to([x,0])[0],188+dy,[rm(lab)],center+' style="font-size:23px"');
 }
 for(const x of [0,2*Math.PI])out+=`<circle cx="${to([x,0])[0]}" cy="188" r="4.5" fill="white"/>`;
 out+=math(43,215,[rm('0')])+math(432,218,[rm('2π')])+math(466,182,[mi('x')])+math(41,94,[mi('y')]);
 out+=math(250,526,[mi('h'),rm('('),mi('x'),rm(') = 0 : '),mi('x'),rm(' = π/2, 3π/2')],center+' style="font-size:25px"');
 out+=text(250,560,'両端の 0 と 2π は範囲に含まない',center)+text(250,591,'水平線の高さを変えて共有点を数える',center);
 return out;
}
function heightGraph(){
 const to=([x,z])=>[250+172*x,354-125*z];
 let out=math(250,36,[mi('z'),rm(' = 4'),mi('x'),rm('³ − 3'),mi('x'),rm(' + 1')],center);
 out+=poly(close([to([.5,0]),...sample(x=>to([x,height(x)]),.5,1),to([1,0])]),'fill="#f3e9cc" stroke="none"');
 out+=edge(to([-1.2,0]),to([1.3,0]),`class="axis" ${arrow}`)+edge(to([0,-.1]),to([0,2.35]),`class="axis" ${arrow}`);
 out+=edge(to([-.5,0]),to([-.5,2]),'class="guide"')+edge(to([-1,2]),to([1,2]),'class="guide"')+edge(to([1,0]),to([1,2]),'class="guide"');
 out+=poly(sample(x=>to([x,height(x)]),-1,1),'class="blue"');
 for(const x of [-1,-.5,.5,1]){out+=dot(...to([x,height(x)]))+math(to([x,0])[0],388,[rm(x===-.5?'−1/2':x===.5?'1/2':String(x))],center);}
 out+=math(228,383,[rm('0')])+math(230,112,[rm('2')])+math(475,347,[mi('x')])+math(230,64,[mi('z')]);
 out+=text(250,432,'色の部分：T の高さを調べる範囲',center)+math(250,473,[mi('h'),rm('('),mi('x'),rm(') = 4('),mi('x'),rm(' + 1)('),mi('x'),rm(' − 1/2)²')],center);
 return out;
}
function crossSection(){
 // Draw the fixed-x section front-on, using the same scale on y and z.
 const x=Math.sqrt(3)/2,s=200,h=height(x),to=([y,z])=>[250+s*y,326-s*z];
 let out=text(250,34,'x を固定し、断面を正面から見る',center);
 out+=edge(to([-.85,0]),to([.85,0]),`class="axis" ${arrow}`)+edge(to([0,0]),to([0,1.3]),`class="axis" ${arrow}`);
 const A=to([-.5,0]),B=to([.5,0]),C=to([.5,h]),D=to([-.5,h]);
 out+=poly(close([A,B,C,D]),'fill="#e8eff4" stroke="#507e9f" stroke-width="2.2"');
 out+=label(A,'A',-24,30)+label(B,'B',12,30)+label(C,'C',12,-12)+label(D,'D',-27,-12);
 out+=dot(250,326)+math(250,362,[mi('P'),rm('('),mi('x'),rm(', 0, 0)')],center);
 out+=line(125,126,125,326,'class="gold"')+line(119,126,131,126)+line(119,326,131,326);
 out+=text(90,415,'底辺')+math(286,415,[rm('2√(1 − '),mi('x'),rm('²)')],center);
 out+=text(90,457,'高さ')+math(286,457,[rm('4'),mi('x'),rm('³ − 3'),mi('x'),rm(' + 1')],center);
 out+=text(250,500,'AB は円板を切る弦、CD は上面の直線',center);
 out+=math(436,331,[mi('y')])+math(228,59,[mi('z')]);
 return out;
}
function rotationFigure(){
 const alpha=Math.PI/6,x=Math.cos(alpha),verts=section(x),to=([x,y])=>[250+158*x,252-158*y];
 const A=verts.A.slice(0,2),B=verts.B.slice(0,2),Ap=rotate(A),Bp=rotate(B),P=[x,0],Pp=rotate(P);
 let out=text(250,31,'z 軸の正の側から見た配置',center);
 out+=edge(to([-1.23,0]),to([1.27,0]),`class="axis" ${arrow}`)+edge(to([0,-1.23]),to([0,1.23]),`class="axis" ${arrow}`);
 out+=poly(sample(t=>to([Math.cos(t),Math.sin(t)]),0,2*Math.PI));
 out+=edge(to(A),to(B),'class="blue"')+edge(to(Ap),to(Bp),'class="gold"');
 out+=edge(to([0,0]),to(P),'class="guide"')+edge(to([0,0]),to(Pp),'class="guide"')+edge(to([0,0]),to(B),'class="guide"');
 out+=arc(to([0,0]),48,0,alpha)+math(314,239,[mi('α')]);
 out+=arc(to([0,0]),112,0,2*Math.PI/3,`class="gold" ${arrow}`)+math(191,214,[rm('120°')],center);
 out+=label(to(A),'A',12,26)+label(to(B),'B',12,-9)+label(to(Ap),'A′',14,-14)+label(to(Bp),'B′',-37,-12);
 out+=math(to(P)[0]-27,284,[mi('P')])+math(to(Pp)[0]-38,to(Pp)[1]+51,[mi('P′')]);
 out+=math(220,284,[mi('O')])+math(458,279,[mi('x')])+math(230,61,[mi('y')]);
 out+=text(250,461,'青：回転前の弦　金：120度回転後の弦',center);
 out+=line(34,490,466,490,'class="guide"');
 // In xz projection, both ends are on h(x), but the entire connecting segment
 // is BELOW h(x); invariance of the entire solid is not asserted.
 const left=Bp[0],rightX=Ap[0],to2=([u,z])=>[272+190*u,830-102*z],level=height(x);
 out+=text(250,527,'回転後の上辺と、S の上面を比べる',center);
 out+=poly(close([to2([left,level]),...sample(u=>to2([u,height(u)]),left,rightX),to2([rightX,level])]),'fill="#f3e9cc" stroke="none"');
 out+=edge(to2([-1.1,0]),to2([.65,0]),`class="axis" ${arrow}`)+edge(to2([0,0]),to2([0,2.4]),`class="axis" ${arrow}`);
 out+=poly(sample(u=>to2([u,height(u)]),-1,.5),'class="blue"');
 out+=edge(to2([left,level]),to2([rightX,level]),'class="gold"');
 out+=label(to2([left,level]),'C″',-40,6)+label(to2([rightX,level]),'D″',13,12);
 out+=edge(to2([left,0]),to2([left,level]),'class="guide"')+edge(to2([rightX,0]),to2([rightX,level]),'class="guide"');
 out+=math(176,604,[mi('z'),rm(' = '),mi('h'),rm('('),mi('x'),rm(')')],center);
 out+=math(402,856,[mi('x')])+math(284,590,[mi('z')])+math(272,859,[rm('0')],center);
 out+=text(250,905,'上辺の途中も上面を越えない',center);
 out+=text(250,939,'C″・D″ は C′・D′ の xz 平面への射影',center);
 return out;
}
export function build(){
 const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('a1-circle-figure',500,490,'直径OAが2の円C。円周上Pでは角OPAが直角で、OP=r、角POA=θよりr=2cosθ。','Ⅰ(1)：円の極方程式。点Pは条件を満たす一例です。',style+circleFigure());
 pack.add('a1-parabola-figures',500,958,'放物線Dの焦点は原点O、準線はx=a/2。aが正なら左向き、負なら右向きに開く。Qから準線への足HについてOQ=QH。','Ⅰ(1)：aの正負で向きと距離の式が変わります。2図は各符号の代表例です。',style+parabolaPanel(4,258)+line(35,484,465,484,'class="guide"')+parabolaPanel(-4,735));
 pack.add('a3-intersection-graph',500,602,'h(x)=−4cos²x+4cosx、0<x<2π。π/3と5π/3で最大値1、πで最小値−8。両端は除外。代表の水平線y=kとの交点を示す。','Ⅰ(2)：補助関数と水平線。元の2曲線をそのまま描いた図ではありません。',style+intersectionGraph());
 pack.add('a9-solid-height-graph',500,504,'領域Sの高さh(x)=4x³−3x+1の−1≦x≦1におけるグラフ。−1と1/2で0、−1/2と1で2。Tは1/2≦x≦1の範囲。','Ⅳ(2)：全域で高さは非負。金色はTに対応するxの範囲です。',style+heightGraph());
 pack.add('a10-cross-section-figure',500,526,'xを固定したyz平面に平行な断面ABCD。Aは負のy側、Bは正のy側、CはBの真上、DはAの真上。底辺2√(1−x²)、高さ4x³−3x+1。','Ⅳ(2)：断面を正面から表示。図はx=√3/2の代表例で、辺長の式は一般のxを表します。',style+crossSection());
 pack.add('a12-rotation-figure',500,968,'上段は円板上の弦ABをz軸周りに反時計回り120度回したA′B′。下段は回転後上辺C′D′のxz射影。両端が上面にあり途中も上面以下なので回転後TはSに含まれる。S全体の回転対称性ではない。','Ⅳ(4)：α=30度の例。上辺の両端だけでなく、線分全体が上面以下であることを確認します。',style+rotationFigure());
 return pack.save('全6図は問題条件と独立計算による新規図。円の直角、焦点/準線、共有点数、断面積、回転後の線分全体の包含を検算。元HTMLの欠落した定義域・増減表の符号位置・導出省略は別の修復依頼で管理。原本クロップのトレース/コピーなし。権利・人間レビューは未承認。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))build();
