// Positions and time directions derived from the public question, not crops.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,mi,rm,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const charges={A:{x:-1,y:0,q:-9},B:{x:0,y:2*Math.sqrt(2)},C:{x:3,y:0},D:{x:1,y:0,q:1}};
export const phaseAt=t=>({x:-Math.cos(t),p:Math.sin(t)});
export const rectangleDirection=[[0,1],[1,1],[1,-1],[0,-1],[0,1]];
const arrow='marker-end="url(#arrow)"';
const axis=(x1,y1,x2,y2)=>line(x1,y1,x2,y2,`class="axis" ${arrow}`);

export function buildFigures(){
 const pack=createSvgPackage('aichi-medical-2025-general-physics',import.meta.url);
 const {A,B,C,D}=charges,px=x=>235+85*x,py=y=>315-85*y;
 pack.add('q1-xy-figure-1',680,405,
  '図1。A=(-a,0)に電気量−9Qを固定し、B=(0,2√2a)、C=(3a,0)をx-y平面に配置。aとQは正。距離の縮尺を共通にして点の位置を表す。',
  '図1　点A・B・Cの配置',
  axis(55,315,624,315)+axis(235,375,235,28)+
  dot(px(A.x),py(A.y))+dot(px(B.x),py(B.y))+dot(px(C.x),py(C.y))+dot(235,315)+
  math(639,324,[mi('x')])+math(247,31,[mi('y')])+math(214,344,[mi('O')])+
  math(px(A.x)-8,295,[mi('A')])+math(px(A.x),265,[rm('−9'),mi('Q')],'text-anchor="middle"')+
  math(px(A.x),349,[rm('−'),mi('a')],'text-anchor="middle"')+
  math(px(B.x)+18,py(B.y)-5,[mi('B')])+math(px(B.x)-20,py(B.y)+7,[rm('2√2'),mi('a')],'text-anchor="end"')+
  math(px(C.x)-8,295,[mi('C')])+math(px(C.x),349,[rm('3'),mi('a')],'text-anchor="middle"')
 );
 const dx=x=>270+110*x;
 pack.add('q1-xy-figure-2',680,335,
  '図2。A=(-a,0)に−9Q、D=(a,0)にQの点電荷を固定。考察する領域はDより右のx>a。求める点E・Fの位置は問題図には示さない。',
  '図2　2つの固定電荷と、考察する領域x>a',
  `<rect x="380" y="61" width="242" height="215" fill="#f5f7fa" stroke="none"/>`+
  axis(54,210,643,210)+axis(270,292,270,34)+
  dot(dx(A.x),210)+dot(dx(D.x),210)+dot(270,210)+
  math(654,219,[mi('x')])+math(283,38,[mi('y')])+math(248,239,[mi('O')])+
  math(dx(A.x)-8,191,[mi('A')])+math(dx(A.x),150,[rm('−9'),mi('Q')],'text-anchor="middle"')+
  math(dx(A.x),246,[rm('−'),mi('a')],'text-anchor="middle"')+
  math(dx(D.x)-8,191,[mi('D')])+math(dx(D.x),150,[mi('Q')],'text-anchor="middle"')+
  math(dx(D.x),246,[mi('a')],'text-anchor="middle"')+math(506,99,[mi('x'),rm('>'),mi('a')],'text-anchor="middle"')
 );
 const coil=[[100,186],[124,186],...Array.from({length:13},(_,i)=>[130+i*10,i%2?198:174]),[262,186],[275,186]];
 pack.add('q2-spring-figure',700,370,
  '壁に固定したばね定数kの水平ばねと質量mの小物体C。実線のCは初期位置x=−L、破線のCはばね自然長となる原点Oを示す。xの正方向は右。床の摩擦条件は各設問の指定に従う。',
  '図1　実線：初期位置x=−L／破線：自然長の位置O',
  `<rect x="75" y="92" width="25" height="130" fill="#eef2f6" stroke="none"/>`+
  line(100,92,100,222)+Array.from({length:7},(_,i)=>line(75,111+i*17,100,95+i*17,'stroke="#a8b9c6"')).join('')+
  `<path d="${pointsPath(coil)}"/>`+line(100,220,640,220)+
  `<rect x="275" y="165" width="50" height="55" fill="#edf2f6"/>`+
  `<rect x="465" y="165" width="50" height="55" class="guide"/>`+
  math(300,144,[mi('C')],'text-anchor="middle"')+math(300,202,[mi('m')],'text-anchor="middle"')+
  math(200,150,[mi('k')])+
  line(300,222,300,288,'class="guide"')+line(490,222,490,288,'class="guide"')+
  axis(140,286,644,286)+math(658,294,[mi('x')])+dot(490,286)+
  math(300,321,[rm('−'),mi('L')],'text-anchor="middle"')+math(490,321,[mi('O')],'text-anchor="middle"')
 );
 const rx=u=>160+320*u,ry=p=>210-90*p;
 pack.add('q2-phase-rectangle',650,390,
  '図2。等速運動する物体の位置xは0からLの間、運動量pは正負の一定値。位相図は長方形。上辺は右向き、右辺は下向き、下辺は左向き、左辺は上向きに進み、両端で運動量の符号が反転する。',
  '図2　等速運動と、両端での弾性衝突の位相図',
  axis(70,210,578,210)+axis(160,351,160,48)+
  `<path d="${pointsPath(rectangleDirection.map(([x,p])=>[rx(x),ry(p)]))}" stroke-width="2.4"/>`+
  line(278,120,365,120,arrow)+line(480,151,480,186,arrow)+line(365,300,278,300,arrow)+line(160,271,160,235,arrow)+
  math(593,220,[mi('x')])+math(173,54,[mi('p')])+math(138,236,[rm('0')])+
  math(493,235,[mi('L')])
 );
 pack.add('q2-answer-axes',640,370,
  '問4の解答用x-p座標軸。横軸の正方向は右、縦軸の正方向は上。軌跡、切片の値、時間の向きを書き込むための空欄で、解答の曲線は描いていない。',
  '問4　解答用の座標軸',
  axis(61,193,577,193)+axis(320,329,320,34)+math(591,202,[mi('x')])+math(333,38,[mi('p')])+math(294,222,[mi('O')])
 );
 const phasePt=t=>{const p=phaseAt(t);return[340+196*p.x,245-142*p.p];};
 const arc=(from,to)=>`<path d="${pointsPath(Array.from({length:24},(_,i)=>phasePt(from+(to-from)*i/23)))}" stroke-width="2.5" ${arrow}/>`;
 pack.add('ans-q2-phase-ellipse',680,490,
  '単振動のx-p位相図。x切片は−LとL、p切片は−L/aとL/a。初期点は左端(−L,0)で、直後にpが正になり左端から上側へ進む時計回りの楕円。式x²+(ap)²=L²を満たす。',
  '問4　切片と時間変化の向き（時計回り）',
  axis(70,245,618,245)+axis(340,440,340,33)+
  `<ellipse cx="340" cy="245" rx="196" ry="142" stroke-width="2.4"/>`+
  arc(.43,.86)+arc(1.98,2.41)+arc(3.58,4.01)+arc(5.12,5.55)+
  [0,Math.PI/2,Math.PI,3*Math.PI/2].map(t=>{const p=phasePt(t);return dot(p[0],p[1]);}).join('')+
  math(633,254,[mi('x')])+math(353,38,[mi('p')])+math(315,273,[mi('O')])+
  math(129,275,[rm('−'),mi('L')],'text-anchor="end"')+math(551,275,[mi('L')])+
  math(359,99,[mi('L'),rm('/'),mi('a')])+math(359,407,[rm('−'),mi('L'),rm('/'),mi('a')])+
  text(125,220,'初期点','text-anchor="end"')
 );
 return pack.save('公開問題の点電荷の座標、ばねの初期条件、dx/dt=p/m・dp/dt=−kxから図と時間方向を構成。元画像の参照・トレース・埋め込みなし。軌跡の縦横縮尺は模式的。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildFigures();
