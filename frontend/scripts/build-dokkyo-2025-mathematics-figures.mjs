// Original answer diagrams derived from the question's incidence/equations.
// Circular colour chips show the order of SIDE FACES, not a perspective view.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,mi,rm,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';

export const colourCases={
 seven:{bases:['A','B'],sides:['C','D','E','F','G']},
 flip:{bases:['A','A'],sides:['B','C','D','E','F']},
 flipped:{bases:['A','A'],sides:['B','F','E','D','C']},
 six:{bases:['B','F'],sides:['A','C','A','D','E']},
 fiveFirst:{bases:['A','A'],sides:['B','C','B','D','E']},
 fiveSecond1:{bases:['C','D'],sides:['E','A','B','A','B']},
 fiveSecond2:{bases:['C','D'],sides:['E','B','A','B','A']},
 sevenPrism:{bases:['F','G'],sides:['B','A','C','A','D','A','E']},
};
export const commonCircle={k:1-Math.sqrt(3),center:[1,0],radius:2};
export const tangentPoints={O:[0,0],P:[2*Math.SQRT2,Math.SQRT2],A:[3*Math.SQRT2,3*Math.SQRT2],B:[Math.SQRT2,-Math.SQRT2]};
const a=Math.sqrt(3+6*Math.sqrt(10)/5),b=Math.sqrt(-3+6*Math.sqrt(10)/5);
export const commonNormal={P:[a,b],Q:[3/a,-3/b]};
export const sectionAt=k=>({pr:Math.exp(Math.sqrt(k)),qr:Math.exp(2),radius:Math.max(Math.exp(Math.sqrt(k)),Math.exp(2))});
const arrow='marker-end="url(#arrow)"';
const centered='text-anchor="middle"';
const sup=parts=>`<tspan baseline-shift="super" font-size="65%">${parts.join('')}</tspan>`;
const e2=[mi('e'),sup([rm('2')])],ek=[mi('e'),sup([rm('√'),mi('k')])];
const palette={A:'#f4d9a6',B:'#d6e7f3',C:'#daebde',D:'#eadcf0',E:'#f1d8dd',F:'#d9e9e9',G:'#e9e5cf'};
const axes=(cx,cy,left,right,top,bottom,xLabel='x',yLabel='y')=>
 line(left,cy,right,cy,`class="axis" ${arrow}`)+line(cx,bottom,cx,top,`class="axis" ${arrow}`)+
 math(right+12,cy+7,[mi(xLabel)])+math(cx+12,top+4,[mi(yLabel)]);

function chip(x,y,label){
 return `<rect x="${x-21}" y="${y-19}" width="42" height="38" rx="8" fill="${palette[label]}" stroke="#8ca1b0"/>`+math(x,y+8,[rm(label)],centered);
}
function ring(cx,cy,r,layout,title){
 const n=layout.sides.length,pts=layout.sides.map((_,i)=>[cx+r*Math.sin(i*2*Math.PI/n),cy-r*Math.cos(i*2*Math.PI/n)]);
 return text(cx,36,title,centered)+`<path class="guide" d="${pointsPath([...pts,pts[0]])}"/>`+
 pts.map(([x,y],i)=>chip(x,y,layout.sides[i])).join('')+text(cx,cy-5,'側面',centered)+text(cx,cy+21,'周回順',centered)+
 text(cx-63,cy+r+57,'底面')+chip(cx+6,cy+r+51,layout.bases[0])+chip(cx+63,cy+r+51,layout.bases[1]);
}
function colourNote(width,y){return text(width/2,y,'文字が同じ面は同じ色。線で結んだ側面どうしが隣接。',centered);}
function curvePath(fn,t0,t1,project,count=150){
 return `<path d="${pointsPath(Array.from({length:count+1},(_,i)=>project(...fn(t0+(t1-t0)*i/count))))}"/>`;
}
function hyperbolaBody({normal=false}={}){
 const cx=350,cy=285,scale=43,to=(x,y)=>[cx+scale*x,cy-scale*y];
 let body=`<defs><clipPath id="plot"><rect x="85" y="46" width="530" height="460"/></clipPath></defs>`+
 axes(cx,cy,75,635,35,516)+math(cx-60,cy+25,[rm('O')]);
 body+='<g clip-path="url(#plot)">';
 if(!normal){
  body+=line(...to(-7,-7),...to(7,7),'class="guide"')+line(...to(-7,7),...to(7,-7),'class="guide"');
  body+=`<path d="${pointsPath([to(0,0),to(...tangentPoints.A),to(...tangentPoints.B)])} Z" fill="#eaf1f5" stroke="none"/>`;
 }
 for(const sign of [-1,1])body+=curvePath(t=>[sign*Math.sqrt(6)*Math.cosh(t),Math.sqrt(6)*Math.sinh(t)],-1.65,1.65,to);
 if(normal){
  body+='<g stroke="#7d637d">';
  for(const sign of [-1,1])body+=curvePath(t=>[Math.sqrt(10)*Math.sinh(t),sign*Math.sqrt(10)*Math.cosh(t)],-1.5,1.5,to);
  body+='</g>';
  body+=line(...to(-1,(a*-1-6)/b),...to(5,(a*5-6)/b),'class="accent"');
  body+=line(...to(0,0),...to(...commonNormal.P))+line(...to(0,0),...to(...commonNormal.Q));
  const [p,q]=[commonNormal.P,commonNormal.Q],lp=Math.hypot(...p),lq=Math.hypot(...q),u=p.map(v=>v/lp*.33),v=q.map(w=>w/lq*.33);
  body+=`<path d="${pointsPath([to(...u),to(u[0]+v[0],u[1]+v[1]),to(...v)])}"/>`;
 }else body+=line(...to(-1,-2-3*Math.SQRT2),...to(6,12-3*Math.SQRT2),'class="accent"');
 body+='</g>';
 if(normal){
  for(const p of Object.values(commonNormal))body+=dot(...to(...p));
  body+=math(...to(a+.22,b-.42),[rm('P'),rm('('),mi('a'),rm(', '),mi('b'),rm(')')]);
  body+=math(...to(commonNormal.Q[0]+.35,commonNormal.Q[1]-.15),[rm('Q'),rm('('),mi('c'),rm(', '),mi('d'),rm(')')]);
  body+=math(450,30,[mi('ℓ'),rm(' = '),mi('m')]);
  body+=math(545,165,[mi('C'),'<tspan baseline-shift="sub" font-size="70%">1</tspan>']);
  body+=math(411,93,[mi('C'),'<tspan baseline-shift="sub" font-size="70%">2</tspan>']);
 }else{
  for(const name of ['A','B','P'])body+=dot(...to(...tangentPoints[name]));
  body+=math(602,125,[rm('A')])+line(590,115,...to(...tangentPoints.A),'class="guide"');
  body+=math(460,381,[rm('B')])+line(452,369,...to(...tangentPoints.B),'class="guide"');
  body+=math(421,259,[rm('P')])+line(446,244,...to(...tangentPoints.P),'class="guide"');
  body+=math(528,54,[mi('ℓ')])+math(565,215,[mi('C'),'<tspan baseline-shift="sub" font-size="70%">1</tspan>']);
  body+=math(150,72,[mi('y'),rm(' = −'),mi('x')])+math(450,78,[mi('y'),rm(' = '),mi('x')]);
 }
 return body;
}
function planarSection({k,rotate=false,title}){
 const {pr,qr,radius}=sectionAt(k),scale=150/radius,cx=285,cy=240,px=cx+pr*scale,qy=cy-qr*scale;
 let body=text(330,34,title,centered)+axes(cx,cy,75,570,62,423,'x','z');
 if(rotate)body+=`<circle cx="${cx}" cy="${cy}" r="150" fill="#edf3f6" stroke="#a8bcc8"/>`;
 body+=`<path d="M${cx},${cy} L${px},${cy} L${cx},${qy} Z" fill="#f8ebd5" stroke="#b28736"/>`;
 body+=`<path d="M${cx+14},${cy} v-14 h-14"/>`;
 body+=dot(cx,cy)+dot(px,cy)+dot(cx,qy)+math(cx-30,cy+28,[rm('R')])+math(px+10,cy+31,[rm('P')])+math(cx-31,qy-12,[rm('Q')]);
 // Dimension labels are off the axes/triangle; no text crosses an edge.
 body+=line(cx,cy+64,px,cy+64,'class="guide"')+math((cx+px)/2,cy+97,ek,centered);
 body+=line(cx-75,qy,cx-75,cy,'class="guide"')+math(cx-96,(cy+qy)/2+6,e2,'text-anchor="end"');
 body+=math(330,461,[mi('y'),rm(' = '),mi('k')],centered);
 return body;
}

export function buildFigures(){
 const pack=createSvgPackage('dokkyo-medical-2025-general-early-mathematics',import.meta.url);
 pack.add('a1-seven-colors',570,418,
  '正5角柱の7面を7色AからGで塗る配置例。底面はAとB、側面はC、D、E、F、Gの周回順。模式図である。',
  '底面の2色を選び、残る5色を側面の円順列にする。',
  ring(285,180,100,colourCases.seven,'7色を1回ずつ使う')+colourNote(570,392));
 pack.add('a1-six-colors-flip',740,418,
  '底面をともにAにした正5角柱。側面の周回順B C D E Fは上下反転でB F E D Cと一致する。',
  '上下の底面が同色なら、側面の逆向きの並びも同一視する。',
  ring(185,180,98,colourCases.flip,'反転前')+ring(555,180,98,colourCases.flipped,'上下反転後')+
  line(327,168,411,168,arrow)+text(370,213,'同じ塗り方',centered)+colourNote(740,392));
 pack.add('a1-six-colors-placement',570,418,
  '底面をBとF、側面をA C A D Eの順にした正5角柱。2回使うAの側面は互いに隣り合わない。',
  '2回使う色Aを、隣り合わない2側面へ配置する例。',
  ring(285,180,100,colourCases.six,'側面に同じ色を2回使う')+colourNote(570,392));
 pack.add('a2-five-colors-first',570,418,
  '底面をともにA、側面をB C B D Eの順にした正5角柱。2回使うBどうしは離れ、残り3色C D Eを並べる。',
  '同色の底面A・Aを選ぶ場合。側面のB・Bを隣り合わせにしない。',
  ring(285,180,100,colourCases.fiveFirst,'底面に同じ色を使う場合')+colourNote(570,392));
 pack.add('a2-five-colors-second',740,418,
  '底面C Dを固定した正5角柱の2つの側面配置。Eを基準に、E A B A BとE B A B Aの2通り。',
  '側面のEを固定すると、AとBを交互に並べる2通りになる。',
  ring(185,180,98,colourCases.fiveSecond1,'配置1')+ring(555,180,98,colourCases.fiveSecond2,'配置2')+colourNote(740,392));
 const gaps=[['B',185,85],['C',280,180],['D',185,275],['E',90,180]];
 let insertion=text(185,36,'4色の円順列',centered)+`<path class="guide" d="M185 85 L280 180 L185 275 L90 180 Z"/>`;
 insertion+=gaps.map(([s,x,y])=>chip(x,y,s)).join('');
 insertion+=[[247,117],[247,243],[123,243]].map(([x,y])=>chip(x,y,'A')).join('');
 insertion+=text(185,342,'4つの隙間から3つを選ぶ',centered)+line(329,178,406,178,arrow);
 pack.add('a2-seven-prism',740,452,
  '正7角柱の側面で、B C D Eの円順列の3つの隙間へAを挿入。側面B A C A D A E、底面F Gの配置例。',
  '3回使うAを、異なる色の間へ1個ずつ挿入する。',
  insertion+ring(555,189,101,colourCases.sevenPrism,'挿入後の7側面')+colourNote(740,425));

 const k=commonCircle.k,cx=295,cy=224,scale=80,to=(x,y)=>[cx+scale*x,cy-scale*y];
 pack.add('a4-complex-plane',720,458,
  '共円となる場合の複素数平面。A=k+i、B=k−i、C=−1、D=3。縦の弦ABと実軸上の弦CDはE=kで交わる。',
  '共円となる配置。AE・BEは1、CEはk+1、EDは3−k。',
  `<circle cx="${cx+scale}" cy="${cy}" r="160" class="guide"/>`+
  axes(cx,cy,95,617,38,410)+line(...to(k,1),...to(k,-1),'class="accent"')+line(...to(-1,0),...to(3,0),'class="accent"')+
  [[k,1],[k,-1],[-1,0],[3,0],[k,0]].map(p=>dot(...to(...p))).join('')+
  math(...to(k-.25,1.27),[rm('A ('),mi('k'),rm(' + '),mi('i'),rm(')')],'text-anchor="end"')+
  math(...to(k-.25,-1.48),[rm('B ('),mi('k'),rm(' − '),mi('i'),rm(')')],'text-anchor="end"')+
  math(...to(-1.3,-.42),[rm('C (−1)')],'text-anchor="end"')+
  math(...to(3.13,-.42),[rm('D (3)')])+math(...to(k+.17,.17),[rm('E')])+
  math(cx+12,cy+30,[rm('O')])+math(...to(k+.17,.48),[rm('1')])+math(...to(k+.17,-.65),[rm('1')])+
  text(360,440,'横軸：実軸　縦軸：虚軸',centered));
 pack.add('a6-hyperbola-tangent',720,550,
  '双曲線C1の点P=(2√2,√2)での接線と漸近線y=x、y=−x。交点A=(3√2,3√2)、B=(√2,−√2)を結び三角形OABを示す。',
  '接線ℓと2本の漸近線の交点で、三角形OABを作る。',hyperbolaBody());
 pack.add('a6-hyperbola-normal',720,550,
  'C1上のPにおける接線ℓが、C2上の第4象限のQにおける法線mと一致。OPとOQが直交する実際の座標配置。',
  'ℓ=mとなる配置。原点OでOPとOQが直交する。',hyperbolaBody({normal:true}));
 pack.add('a8-cross-section',660,490,
  '平面y=kのx-z断面。R=(0,k,0)、P=(eの√k乗,k,0)、Q=(0,k,e二乗)の直角三角形。辺PR=eの√k乗、QR=e二乗。',
  '立体Aの断面は、Rを直角の頂点とする三角形PQR。',
  planarSection({k:6.25,title:'平面 y = k の断面'}));
 pack.add('a9-pr-qr',660,345,
  '直角三角形PQRの直角頂点Rからの2辺を比較。PR=eの√k乗、QR=e二乗。k=4で2辺が等しくなる。模式図。',
  '回転半径はPRとQRの長い方。k=4で大小が入れ替わる。',
  `<path d="M225 230 L475 230 L225 75 Z" fill="#f8ebd5" stroke="#b28736"/>`+
  `<path d="M225 214 h16 v16"/>`+dot(225,230)+dot(475,230)+dot(225,75)+
  math(197,256,[rm('R')])+math(486,241,[rm('P')])+math(215,55,[rm('Q')])+
  math(350,279,[rm('PR = '),...ek],centered)+math(193,158,[rm('QR = '),...e2],'text-anchor="end"')+
  text(350,326,'k = 4 で PR = QR',centered));
 pack.add('a9-low-section',660,490,
  '0から4までの高さkでの回転体Bの断面。三角形PQRをR中心に回転すると、長い辺QR=e二乗を半径とする円板になる。',
  '下部の断面。QRが外半径となる円板（k=1の配置例）。',
  planarSection({k:1,rotate:true,title:'下部：QR を半径に回転'}));
 pack.add('a9-cylinder',620,440,
  '回転体Bの高さ0から4までの部分。すべての高さで半径e二乗の円板なので、半径e二乗、高さ4の円柱となる。模式図。',
  '半径e²、高さ4の円柱部分。体積は4πe⁴。',
  `<path d="M145 118 L145 332 A145 45 0 0 0 435 332 L435 118" fill="#edf3f6"/>`+
  `<ellipse cx="290" cy="118" rx="145" ry="45" fill="#e2edf3"/>`+
  `<path d="M145 332 A145 45 0 0 1 435 332" class="guide"/>`+
  line(290,118,435,118,'class="accent"')+math(353,103,e2,centered)+dot(290,118)+
  line(492,118,492,332)+line(481,118,503,118)+line(481,332,503,332)+math(512,234,[rm('4')])+
  line(290,332,290,44,`class="guide" ${arrow}`)+math(303,47,[mi('y')])+
  math(104,128,[rm('4')])+math(104,343,[rm('0')])+text(290,414,'高さ方向は見やすく拡大',centered));
 pack.add('a9-high-section',660,490,
  '4から9までの高さkでの回転体Bの断面。三角形PQRをR中心に回転すると、長い辺PR=eの√k乗を半径とする円板になる。',
  '上部の断面。PRが外半径となる円板（k=6.25の配置例）。',
  planarSection({k:6.25,rotate:true,title:'上部：PR を半径に回転'}));
 return pack.save('14図を公開問題の条件・編集済み解説の数式から独自描画。色の配置図は側面の隣接と周回順を表す模式図。共円・接線法線・回転半径は座標で検証。restricted source cropは参照・複製していない。担当者による最終確認待ち。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildFigures();
