// Original figures calculated from the question and preserved source methods.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,mi,rm,sub,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
const center='text-anchor="middle"',arrow='marker-end="url(#arrow)"';
const sup=v=>`<tspan class="rm" font-size="70%" baseline-shift="super">${v}</tspan>`;
export const roots=[-8+4*Math.sqrt(5),8-4*Math.sqrt(3),8+4*Math.sqrt(3)];
export const square={A:[0,0],B:[10,0],C:[10,-10],D:[0,-10],E:[5,-5],F:[18/5,24/5]};
export const complex={O:[0,0],A:[1,0],B:[Math.sqrt(3),3],C:[.5,2-Math.sqrt(3)/6]};
export const radius=Math.hypot(complex.A[0]-complex.C[0],complex.A[1]-complex.C[1]);
export const startAngle=Math.atan2(-complex.C[1],.5);
export const orbitPoint=n=>[complex.C[0]+radius*Math.cos(startAngle+n*Math.PI/4),complex.C[1]+radius*Math.sin(startAngle+n*Math.PI/4)];
const sample=(fn,a,b,n=160)=>Array.from({length:n+1},(_,i)=>{const x=a+(b-a)*i/n;return[x,fn(x)];});
const pathOf=(points,to,extra='')=>`<path d="${pointsPath(points.map(p=>to(...p)))}" ${extra}/>`;
const arc=(to,c,r,a,b,extra='')=>pathOf(Array.from({length:51},(_,i)=>{const t=a+(b-a)*i/50;return[c[0]+r*Math.cos(t),c[1]+r*Math.sin(t)];}),to,extra);
const label=(x,y,n)=>math(x,y,[rm(n)]);

function inequality(){
 let body=text(350,34,'放物線が直線より下になる x の範囲',center);
 for(const [index,top,xmax,ymax,left,right,lineFn,title] of [[1,62,1.1,3,0,roots[0],x=>16-16*x,'① 0 < x < 1：交点付近を拡大'],[2,495,16.6,272,roots[1],roots[2],x=>16*x-16,'② x > 1：2つの交点の間']]){
  const to=(x,y)=>[95+510*x/xmax,top+270-215*y/ymax],id=`graph-${index}`;
  body+=text(350,top+17,title,center)+`<defs><clipPath id="${id}"><rect x="95" y="${top+52}" width="510" height="218"/></clipPath></defs>`;
  body+=`<g clip-path="url(#${id})">`+pathOf([...sample(x=>x*x,left,right),...sample(lineFn,right,left)],to,'fill="#f3e7ce" stroke="none"')+
   pathOf(sample(x=>x*x,0,xmax),to,'stroke-width="2.4"')+pathOf(sample(lineFn,0,xmax),to,'stroke="#4e7895" stroke-width="2.4"')+'</g>';
  body+=line(...to(0,0),625,top+270,`class="axis" ${arrow}`)+line(95,top+285,95,top+45,`class="axis" ${arrow}`)+math(639,top+279,[mi('x')])+math(105,top+48,[mi('y')]);
  body+=math(63,top+297,[rm('O')]);
  body+=math(index===1?227:390,index===1?top+211:top+120,[mi('y'),rm(' = '),mi('x'),sup('2')]);
  body+=math(index===1?170:180,top+75,[mi('y'),rm(index===1?' = 16 − 16':' = 16'),mi('x'),...(index===1?[]:[rm(' − 16')])]);
  for(const root of index===1?[roots[0]]:[roots[1],roots[2]])body+=dot(...to(root,root*root))+line(...to(root,0),...to(root,root*root),'class="guide"');
  const lo=to(left,0)[0],hi=to(right,0)[0],band=top+321;
  body+=line(lo,band,hi,band,'stroke="#b28736" stroke-width="5"');
  for(const xx of[lo,hi])body+=`<circle cx="${xx}" cy="${band}" r="5" fill="white" stroke="#b28736"/>`;
  if(index===1){body+=math(lo-5,band+33,[rm('0')])+math(hi-12,band+34,[mi('r'),sub('1')])+math(350,top+408,[mi('r'),sub('1'),rm(' = −8 + 4√5')],center);}
  else{body+=math(lo-11,band+34,[mi('r'),sub('2')])+math(hi-12,band+34,[mi('r'),sub('3')])+math(350,top+408,[mi('r'),sub('2'),rm(' = 8 − 4√3,  '),mi('r'),sub('3'),rm(' = 8 + 4√3')],center);}
 }
 body+=text(350,947,'金色の区間が解。白丸の端点は含めない。',center);
 return body;
}
function geometry(coordinates=false){
 const to=(x,y)=>[105+43*x,(coordinates?330:305)-43*y],s=square;
 let body=text(340,35,coordinates?'同じ円に内接する四角形 A–F–B–E':'正方形と、その外側の直角三角形',center);
 body+=`<circle cx="320" cy="${coordinates?330:305}" r="215" fill="#f8fafb" class="guide"/>`;
 if(!coordinates){
  body+=pathOf([s.A,s.B,s.C,s.D,s.A],to,'fill="#f1f5f7"')+pathOf([s.A,s.C],to,'class="guide"')+pathOf([s.B,s.D],to,'class="guide"');
 }else{
  body+=line(60,330,615,330,`class="axis" ${arrow}`)+line(105,589,105,75,`class="axis" ${arrow}`)+math(630,339,[mi('x')])+math(118,76,[mi('y')]);
 }
 body+=pathOf([s.A,s.F,s.B,s.E,s.A],to)+pathOf([s.E,s.F],to,'class="accent"')+pathOf([s.A,s.B],to);
 for(const n of coordinates?['A','B','E','F']:['A','B','C','D','E','F'])body+=dot(...to(...s[n]));
 if(coordinates){
  body+=label(15,370,'A(0, 0)')+label(546,377,'B(10, 0)')+label(344,582,'E(5, −5)');
  body+=label(325,90,'F(18/5, 24/5)')+line(320,99,269,120,'class="guide"');
  body+=text(340,630,'AB・EF は対角線、AF・FB・BE・EA は4辺。',center);
 }else{
  for(const [n,xy]of[['A',[75,316]],['B',[553,316]],['C',[554,758]],['D',[77,758]],['E',[328,565]],['F',[240,79]]])body+=label(...xy,n);
  body+=math(150,191,[rm('6')])+math(421,182,[rm('8')])+math(151,444,[rm('5√2')]);
  const fa=Math.atan2(-s.F[1],-s.F[0]),fe=Math.atan2(s.E[1]-s.F[1],s.E[0]-s.F[0]);
  body+=arc(to,s.F,.85,fa,fe)+math(211,220,[rm('45°')]);
  body+=text(340,801,'E と F は、ともに直径 AB の円周上にある。',center);
 }
 return body;
}
function complexGeometry(){
 const to=(x,y)=>[300+125*(x-.5),325-125*(y-complex.C[1])],c=complex.C;
 let body=text(350,34,'α = 1、β = √3 + 3i の配置',center);
 body+=`<circle cx="300" cy="325" r="${125*radius}" class="guide"/>`;
 const [ox,oy]=to(0,0);
 body+=line(63,oy,616,oy,`class="axis" ${arrow}`)+line(ox,580,ox,66,`class="axis" ${arrow}`)+text(631,oy+7,'Re')+text(ox+14,76,'Im');
 body+=pathOf([complex.O,complex.A,complex.B,complex.O],to)+pathOf([complex.O,c],to,'class="guide"')+pathOf([complex.A,c,complex.B],to,'class="accent"');
 body+=arc(to,c,.66,startAngle,startAngle+2*Math.PI/3,arrow)+math(436,346,[mi('θ')]);
 body+=arc(to,complex.O,.39,0,Math.PI/3)+math(296,512,[rm('60°')]);
 for(const [n,xy]of[['O',[212,566]],['A',[379,566]],['B',[473,159]],['C',[265,318]]])body+=dot(...to(...complex[n]))+label(...xy,n);
 body+=text(350,622,'C を中心に CA から CB へ反時計回りに 120°。',center);
 return body;
}
function eightPoints(){
 const to=(x,y)=>[330+175*(x-complex.C[0])/radius,305-175*(y-complex.C[1])/radius],c=complex.C;
 let body=text(350,35,'45°ずつ回転すると、8つの点を一周する',center)+`<circle cx="330" cy="305" r="175" class="guide"/>`;
 const coords=Array.from({length:8},(_,n)=>to(...orbitPoint(n)));
 for(let n=0;n<8;n++){
  body+=line(330,305,...coords[n],'class="guide"')+dot(...coords[n]);
  const a=startAngle+n*Math.PI/4,x=330+205*Math.cos(a),y=305-205*Math.sin(a);
  if(n!==3)body+=math(x,y+8,[mi('z'),sub(n)],center);
 }
 const b=to(...complex.B),p3=coords[3];
 body+=line(...b,...p3,'class="accent"')+dot(...b)+`<circle cx="${p3[0]}" cy="${p3[1]}" r="6" fill="#b28736" stroke="white"/>`;
 body+=math(387,92,[mi('z'),sub('3')],center)+line(390,106,...p3,'class="guide"');
 body+=math(560,131,[mi('β'),rm(' (B)')],center)+line(516,133,...b,'class="guide"');
 body+=dot(330,305)+label(316,364,'C');
 body+=arc(to,c,radius*.43,startAngle,startAngle+Math.PI/4,arrow)+math(426,413,[rm('45°')]);
 body+=text(350,557,'B は A = z₀ から120°、z₃は135°回転した位置。',center);
 body+=text(350,594,'最も近い点は z₃。n = 8m + 3（m は整数）。',center);
 return body;
}
export function buildFigures(){
 const pack=createSvgPackage('hyogo-medical-2025-general-a-b-mathematics',import.meta.url);
 pack.add('a02-inequality-graphs',700,975,'放物線y=x²と直線y=16−16x、y=16x−16を場合別に比較。0<x<1側は交点付近を拡大し、解の区間0<x<−8+4√5と8−4√3<x<8+4√3を白丸の開区間で示す。','第1問(1)：真数条件との共通範囲を取る。上下のグラフは尺度が異なる。',inequality());
 pack.add('a06-geometry-diagrams',680,830,'一辺10の正方形ABCDの外側に、AF=6、BF=8の直角三角形ABFを配置。正方形の中心EとFは直径ABの同じ円周上にあり、角AFEは45度、AEは5√2。','第1問(5)：円周角を使い、三角形AEFに余弦定理を適用する。',geometry());
 pack.add('a07-geometry-alternatives',680,660,'A(0,0)、B(10,0)、E(5,−5)、F(18/5,24/5)は直径ABの円周上。四角形AFBEの対角線ABとEFを示す。','第1問(5)の別解：トレミーの定理と、座標による距離計算に共通する配置。',geometry(true));
 pack.add('a13-complex-geometry',700,650,'複素数平面上のO=0、A=1、B=√3+3iと外心C。角AOBは60度、CAからCBへの反時計回りの回転角θは120度。O、A、Bは同じ外接円上にある。','第3問(3)(a)：θ=2π/3。円周角だけでなく回転の向きも確認する。',complexGeometry());
 pack.add('a14-eight-points',700,625,'外心Cの周りにA=z₀から反時計回り45度ずつ並ぶz₀〜z₇。BはAから120度、z₃は135度の位置で、Bに最も近い点z₃を強調する。','第3問(3)(b)：点は8周期で重なり、答えはn≡3 (mod 8)。',eightPoints());
 return pack.save('問題の関数・長さ・複素数から独自に算出。座標別解は元解説と同じ向き（正方形がABの下側）。制限付き原図は複製していない。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildFigures();
