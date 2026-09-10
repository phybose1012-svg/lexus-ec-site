// Original constructions from the mathematical conditions; no crop tracing.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,mi,rm,sub,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='kanazawa-medical-2025-general-late-mathematics';
export const triangle={A:[0,0],B:[0,15],C:[20,0]};
export const movingPoints=t=>({P:t<=15?[0,t]:[.8*(t-15),15-.6*(t-15)],Q:t<=10?[2*t,0]:[20-.8*(2*t-20),.6*(2*t-20)]});
export const area=t=>t<=10?t*t:t<=15?-.8*t*t+18*t:-18*t+360;
export const equilateral={A:[-2*Math.sqrt(3),-2],B:[10*Math.sqrt(3),16],C:[-5*Math.sqrt(3),25]};
export const pyramid={O:[0,0,0],A:[2,0,0],D:[2,2,0],B:[0,2,0],C:[1,1,Math.sqrt(2)],H:[1,1,0],G1:[5/3,1,Math.sqrt(2)/3],G2:[1,5/3,Math.sqrt(2)/3],L:[7/4,1/4,Math.sqrt(2)/4],M:[1/4,7/4,Math.sqrt(2)/4],N:[8/5,8/5,2*Math.sqrt(2)/5]};
export const cutValue=([x,y,z])=>Math.sqrt(2)*(x+y)-8*z;
export const project=([x,y,z])=>[90+98*x+42*y,305+34*x-46*y-160*z];
const center='text-anchor="middle"',arrow='marker-end="url(#arrow)"';
const style='<style>text{font-size:19px}.math{font-size:28px}.warm{stroke:#a57925;stroke-width:2.4}.blue{stroke:#507e9f;stroke-width:2.4}</style>';
const poly=(points,extra='')=>`<path d="${pointsPath(points)}" ${extra}/>`;
const label=(p,name,dx,dy)=>dot(...p)+math(p[0]+dx,p[1]+dy,[mi(name)]);
const right=(x,y,dx=10,dy=-10)=>poly([[x,y+dy],[x+dx,y+dy],[x+dx,y]],'stroke-width="1.2"');
const closed=points=>[...points,points[0]];
const edge=(a,b,extra='')=>line(...a,...b,extra);
function movingPanel(t,baseY,{given=false,late=false}={}){
 const to=([x,y])=>[110+14*x,baseY-14*y],{A,B,C}=triangle,{P,Q}=movingPoints(t);
 let out='';
 if(!given)out+=poly(closed([A,P,Q].map(to)),'fill="#e7edf2" stroke="none"');
 out+=poly(closed([A,B,C].map(to)))+right(...to(A));
 out+=label(to(A),'A',-27,27)+label(to(B),'B',-9,-15)+label(to(C),'C',12,11);
 out+=label(to(P),'P',late?18:given?15:-32,late?-15:8)+label(to(Q),'Q',late?24:12,late?8:-18);
 if(!given)out+=poly(closed([A,P,Q].map(to)),'stroke="#507e9f" stroke-width="2.3"');
 if(t>10){
  const H=[Q[0],0];out+=edge(to(Q),to(H),'class="guide"')+right(...to(H));
  out+=math(to(H)[0],baseY+29,[mi('H')],center);
 }
 if(late){
  const I=[0,P[1]];out+=edge(to(P),to(I),'class="guide"')+right(...to(I),10,-10);
  out+=math(73,to(I)[1]+10,[mi('I')]);
  out+=line(to(Q)[0]+8,to(Q)[1]+2,to(Q)[0]+20,to(Q)[1]+4,'class="guide"');
 }else if(!given){
  out+=math(53,baseY-7*t,[mi('t')],center);
  if(t<10)out+=math(110+14*t,baseY+32,[rm('2'),mi('t')],center);
 }
 if(given){
  out+=line(83,baseY-25,83,baseY-92,arrow)+line(139,baseY+55,239,baseY+55,arrow);
  out+=math(46,baseY-128,[rm('15 cm')],center)+math(261,baseY+96,[rm('20 cm')],center);
  out+=math(320,baseY-133,[rm('25 cm')],center);
  out+=text(250,baseY+137,'P：毎秒1 cm　／　Q：毎秒2 cm',center);
 }
 return out;
}
function questionTriangle(){
 return style+text(250,32,'出発点 A と、2点の進む向き',center)+movingPanel(6,315,{given:true});
}
function earlyStages(){
 return style+text(250,31,'出発から10秒まで',center)+movingPanel(6,280)
  +math(250,351,[mi('AP'),rm(' = '),mi('t'),rm('， '),mi('AQ'),rm(' = 2'),mi('t')],center)
  +line(30,385,470,385,'stroke="#d6dfe5"')
  +text(250,422,'10秒を過ぎ、15秒まで',center)+movingPanel(12.5,680)
  +math(250,758,[mi('QH'),rm(' ⊥ '),mi('AC')],center)
  +math(250,801,[mi('QC'),rm(' = 2'),mi('t'),rm(' − 20')],center)
  +text(250,842,'相似比から CH を求め、AH を高さにする。',center);
}
function lateAndGraph(){
 let out=style+text(250,31,'15秒を過ぎ、再会する20秒まで',center)+movingPanel(18.5,280,{late:true});
 out+=math(250,343,[mi('PI'),rm(' ⊥ '),mi('AB'),rm('， '),mi('QH'),rm(' ⊥ '),mi('AC')],center);
 out+=text(250,383,'△ABC から △ABP と △ACQ を引く。',center);
 out+=line(30,417,470,417,'stroke="#d6dfe5"')+text(250,454,'面積 S の変化',center);
 const to=(t,s)=>[70+18*t,762-2*s];
 out+=line(...to(0,0),...to(21,0),`class="axis" ${arrow}`)+line(...to(0,0),...to(0,123),`class="axis" ${arrow}`);
 for(const [a,b,cls] of [[0,10,'blue'],[10,15,'warm'],[15,20,'blue']]){
  out+=poly(Array.from({length:101},(_,i)=>{const t=a+(b-a)*i/100;return to(t,area(t));}),`class="${cls}"`);
 }
 for(const t of [10,15]){out+=line(...to(t,0),...to(t,area(t)),'class="guide"')+dot(...to(t,area(t)))+math(to(t,0)[0],794,[rm(t)],center);}
 for(const t of [0,20])out+=`<circle cx="${to(t,0)[0]}" cy="${to(t,0)[1]}" r="4.3" fill="white"/>`;
 const peak=to(45/4,405/4);out+=dot(...peak)+line(336,525,peak[0]+6,peak[1]-7,'class="guide"');
 out+=math(346,508,[rm('(45/4, 405/4)')],center);
 out+=math(465,797,[mi('t')])+math(47,521,[mi('S')])+math(50,794,[rm('O')])+math(430,794,[rm('20')],center);
 out+=text(250,839,'両端 t = 0, 20 は範囲に含まない。',center)+text(250,875,'10秒・15秒で式が切り替わる。',center);
 return out;
}
function threeLines(){
 const {A,B,C}=equilateral,to=([x,y])=>[204+11*x,383-11*y];
 const extend=(a,b)=>[-.14,1.15].map(t=>to(a.map((v,i)=>v+t*(b[i]-v))));
 let out=style+text(250,32,'3直線の交点でできる正三角形',center);
 out+=poly(closed([A,B,C].map(to)),'fill="#e7edf2" stroke="none"');
 out+=poly(extend(A,B))+poly(extend(A,C))+poly(extend(C,B));
 out+=label(to(A),'A',22,34)+label(to(B),'B',48,5)+label(to(C),'C',-42,-24);
 out+=text(441,143,'①')+text(86,51,'②')+text(465,239,'③');
 out+=math(250,499,[mi('AB'),rm(' = '),mi('BC'),rm(' = '),mi('CA'),rm(' = 6√21')],center);
 out+=math(250,543,[mi('A'),rm('(−2√3, −2)')],center)+math(250,585,[mi('B'),rm('(10√3, 16)')],center)+math(250,627,[mi('C'),rm('(−5√3, 25)')],center);
 out+=text(250,673,'③の傾きは負。n > 0 の側を描く。',center);
 return out;
}
function wireframe(){
 let out='';
 for(const [a,b] of [['O','B'],['B','D'],['B','C']])out+=edge(project(pyramid[a]),project(pyramid[b]),'class="guide"');
 for(const [a,b] of [['O','A'],['A','D'],['D','C'],['C','A'],['C','O']])out+=edge(project(pyramid[a]),project(pyramid[b]));
 return out;
}
function pyramidNames(){
 let out='';for(const [n,dx,dy] of [['O',-28,12],['A',-6,30],['D',13,12],['B',-29,15],['C',-8,-8]])out+=label(project(pyramid[n]),n,dx,dy);return out;
}
function questionPyramid(){
 return style+text(250,23,'底面は正方形、側面は4つの正三角形',center)+wireframe()+pyramidNames()
  +math(250,448,[mi('OA'),rm(' = '),mi('AD'),rm(' = '),mi('DB'),rm(' = '),mi('BO'),rm(' = 2')],center);
}
function coordinateModel(){
 let out=style+text(250,23,'O を原点にとる座標モデル',center)+wireframe();
 out+=edge(project(pyramid.O),project([2.8,0,0]),`class="axis" ${arrow}`)+edge(project(pyramid.O),project([0,2.8,0]),`class="axis" ${arrow}`)+edge(project(pyramid.O),project([0,0,1.65]),`class="axis" ${arrow}`);
 out+=edge(project(pyramid.O),project(pyramid.D),'class="guide"')+edge(project(pyramid.A),project(pyramid.B),'class="guide"')+edge(project(pyramid.C),project(pyramid.H),'class="guide"');
 out+=pyramidNames()+label(project(pyramid.H),'H',-50,33)+line(...project(pyramid.H),210,307,'class="guide"');
 out+=math(369,420,[mi('x')])+math(213,171,[mi('y')])+math(65,56,[mi('z')]);
 out+=math(250,473,[mi('A'),rm('(2, 0, 0)， '),mi('B'),rm('(0, 2, 0)')],center);
 out+=math(250,515,[mi('D'),rm('(2, 2, 0)， '),mi('H'),rm('(1, 1, 0)')],center);
 out+=math(250,557,[mi('C'),rm('(1, 1, √2)')],center);
 out+=text(250,603,'破線 CH は底面への垂線。空間の平行投影。',center);
 return out;
}
function sectioned(){
 const pt=n=>project(pyramid[n]);
 let out=style+text(250,23,'切断面は四角形 O L N M',center);
 out+=poly(closed(['O','L','N','M'].map(pt)),'fill="#e7edf2" stroke="none"')+wireframe();
 for(const [a,b] of [['O','L'],['L','N']])out+=edge(pt(a),pt(b),'class="warm"');
 for(const [a,b] of [['O','M'],['M','N']])out+=edge(pt(a),pt(b),'class="warm" stroke-dasharray="5 5"');
 out+=pyramidNames();
 for(const [n,dx,dy] of [['L',138,64],['M',-77,-21],['N',13,-9]])out+=label(pt(n),n,dx,dy);
 out+=line(...pt('L'),398,351,'class="guide"')+line(...pt('M'),138,153,'class="guide"');
 out+=dot(...pt('G1'))+dot(...pt('G2'));
 out+=line(...pt('G1'),384,250,'class="guide"')+math(395,260,[mi('G'),sub('1')]);
 out+=line(...pt('G2'),190,133,'class="guide"')+math(145,125,[mi('G'),sub('2')]);
 out+=text(250,443,'G₁ は LN 上、G₂ は MN 上。',center);
 out+=line(30,472,470,472,'stroke="#d6dfe5"')+text(250,511,'側面 CAD で、面積比を確認する',center);
 const C=[250,550],A=[95,550+155*Math.sqrt(3)],D=[405,A[1]],at=(p,t)=>C.map((v,i)=>v+t*(p[i]-v));
 const L=at(A,.75),N=at(D,.6),G=[250,550+310*Math.sqrt(3)/3];
 out+=poly(closed([C,L,N]),'fill="#f3e7cb" stroke="none"')+poly(closed([C,A,D]))+edge(L,N,'class="warm"');
 for(const [p,n,dx,dy] of [[C,'C',-7,-16],[A,'A',-22,25],[D,'D',12,25],[L,'L',-26,5],[N,'N',14,4]])out+=label(p,n,dx,dy);
 out+=dot(...G)+line(G[0],G[1]+7,G[0],G[1]+34,'class="guide"')+math(G[0],G[1]+61,[mi('G'),sub('1')],center);
 out+=math(250,878,[mi('CL'),rm('/'),mi('CA'),rm(' = 3/4， '),mi('CN'),rm('/'),mi('CD'),rm(' = 3/5')],center);
 out+=text(250,921,'△CLN : △CAD = 9 : 20',center)+text(250,961,'同じ高さの三角錐の体積比も 9 : 20。',center);
 return out;
}
export function buildFigures(){
 const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('q2-right-triangle',500,470,'直角はA、AB=15 cm、AC=20 cm、BC=25 cm。PはAからBへ時計回りに毎秒1 cm、QはAからCへ反時計回りに毎秒2 cmで進む。','第2問：P・Qの位置は出発後の一例。矢印は進む向きを示す。',questionTriangle());
 pack.add('q4-square-pyramid',500,476,'底面の頂点はO、A、D、Bの順。底面は一辺2の正方形、頂点Cからの4側面は正三角形。奥側の辺OB、BD、BCを破線で示す。','第4問：正四角錐の平行投影。画面上の長さや角度を測って求めるものではありません。',questionPyramid());
 pack.add('ans-q2-early-stages',500,866,'上段は0<t≦10でPがAB、QがACにあり、AP=t、AQ=2t。下段は10<t≦15でQがCBへ進み、ACへの垂線の足がH。三角形APQを塗り分ける。','第2問：区間内の代表位置。QHとCHを区別し、APを底辺とした高さAHを求める。',earlyStages());
 pack.add('ans-q2-late-stage-and-graph',500,903,'上段は15<t<20でB、P、Q、Cの順。PIはABへの垂線、QHはACへの垂線。下段はS=t²、S=−4t²/5+18t、S=−18t+360を各区間だけ描き、最大点は(45/4,405/4)。','第2問：三角形APQの面積。端点0秒・20秒は除外、10秒・15秒では連続。',lateAndGraph());
 pack.add('ans-q3-equilateral-lines',500,703,'直線① y=√3x/2+1、② y=−3√3x−20、③ y=−√3x/5+22。交点A(−2√3,−2)、B(10√3,16)、C(−5√3,25)は一辺6√21の正三角形をなす。','第3問：等縮尺。傾きの負号は問題原本と独立計算に基づく。元HTMLの符号欠落は修復待ち。',threeLines());
 pack.add('ans-q4-coordinate-model',500,632,'Oを原点、OA方向をx、OB方向をy、底面に垂直な上向きをzとする。A(2,0,0)、B(0,2,0)、D(2,2,0)、底面中心H(1,1,0)、頂点C(1,1,√2)。','第4問：底面の対角線の交点Hから頂点Cへ垂線を引く。',coordinateModel());
 pack.add('ans-q4-sectioned-pyramid',500,990,'平面OG1G2と四角錐の交わりはOLNM。LはAC上、MはBC上、NはDC上。G1はLN、G2はMN上。下段の等縮尺の側面CADではCL/CA=3/4、CN/CD=3/5、三角形CLNとCADの面積比9:20。','第4問：上段は平行投影、下段は側面CAD。切断面は三角形OG₁G₂そのものではない。',sectioned());
 return pack.save('問題条件から動点の座標、区分面積、正三角形、四角錐の3次元座標と切断面を独立計算した。原本クロップのトレース・埋込なし。第3問の負号、第4問のベクトル矢印等は元HTML修復待ち。元データの権利・人間レビュー未了を維持。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildFigures();
