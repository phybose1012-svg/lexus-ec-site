// Independent analytic constructions; no crop tracing or embedded source images.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,mi,rm,sub,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='kawasaki-medical-2025-general-regional-quota-mathematics';
export const q1={A:[2,8],B:[6,0],C:[-2/5,16/5],D:[2,0],E:[2,16/5],K:[4,4],r:2*Math.sqrt(5)};
export const arcBC=(n=180)=>Array.from({length:n+1},(_,i)=>{
 const t0=Math.atan2(-.8,-4.4),t1=Math.atan2(-4,2),t=t0+(t1-t0)*i/n;
 return[4+q1.r*Math.cos(t),4+q1.r*Math.sin(t)];
});
export const maximum=a=>a<-5.5?-.4*(a+8):a<.5?4*a-4+2*Math.sqrt(5)*Math.hypot(a,1):6*a;
export const tangentPoint=a=>[4+q1.r*a/Math.hypot(a,1),4-q1.r/Math.hypot(a,1)];
export const normal=x=>-2*x+2+Math.log(2),c1=x=>Math.log(1+x);
export const c2=(x,p=-1)=>p*Math.log(1+x)+(1-p)*Math.log(2);
export const absoluteLog=(x,a)=>Math.abs(Math.log(x+a));
export const g=a=>(a+1)*Math.log(a+1)+a*Math.log(a)-2*a+1;
export const q3={A:[2,4],B:[1,-3],C1:[4/5,-22/5],r:Math.sqrt(2),P1:[5/3,5/3],P2:[5/4,-5/4],Q1:[3,-3],Q2:[4,4]};
export const inverse=([x,y])=>[10*x/(x*x+y*y),-10*y/(x*x+y*y)];
export const area=(a,b,c)=>Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))/2;
const center='text-anchor="middle"',end='text-anchor="end"',arrow='marker-end="url(#arrow)"';
const style='<style>text{font-size:21px}.math{font-size:31px}.curve{stroke-width:2.4}.warm{stroke:#b28736}.cool{stroke:#527c99}.fine{stroke:#aabac4;stroke-width:1.2}</style>';
const sample=(fn,a,b,n=160)=>Array.from({length:n+1},(_,i)=>{const x=a+(b-a)*i/n;return[x,fn(x)];});
const poly=(pts,to,attrs='')=>`<path d="${pointsPath(pts.map(p=>to(...p)))}" ${attrs}/>`;
const circle=(to,c,r)=>`<circle cx="${to(...c)[0]}" cy="${to(...c)[1]}" r="${Math.abs(to(c[0]+r,c[1])[0]-to(...c)[0])}" class="curve"/>`;
const label=(to,p,name,dx=12,dy=-12,index)=>dot(...to(...p))+math(to(...p)[0]+dx,to(...p)[1]+dy,[mi(name),...(index?[sub(index)]:[])]);
const axes=(to,x0,x1,y0,y1)=>line(...to(x0,0),...to(x1,0),`class="axis" ${arrow}`)+line(...to(0,y0),...to(0,y1),`class="axis" ${arrow}`);
const angle=(to,p,r,t0,t1)=>poly(Array.from({length:40},(_,i)=>{const t=t0+(t1-t0)*i/39;return[p[0]+r*Math.cos(t),p[1]+r*Math.sin(t)];}),to,'class="warm"');
function circleAngles(){
 const to=(x,y)=>[110+40*x,480-40*y],{A,B,C,D,E,K,r}=q1;
 let s=style+text(260,32,'円周角と補助線 CE',center)+axes(to,-1.5,9.1,-.7,10.3);
 s+=circle(to,K,r)+poly(sample(x=>2*x+4,-1,3),to,'class="cool"')+poly(sample(x=>-2*x+12,1,6.5),to,'class="curve"');
 s+=poly([A,D,B,C,D],to,'class="curve"')+poly([C,E],to,'class="guide"');
 s+=poly([[E[0]-.25,E[1]],[E[0]-.25,E[1]-.25],[E[0],E[1]-.25]],to);
 s+=poly([[D[0],.28],[D[0]+.28,.28],[D[0]+.28,0]],to);
 s+=angle(to,D,1.2,Math.PI/2,Math.atan2(3.2,-2.4))+angle(to,A,1.5,-Math.PI/2,Math.atan2(-8,4));
 s+=angle(to,C,1.3,Math.atan2(-3.2,2.4),Math.atan2(-3.2,6.4));
 s+=math(244,466,[mi('α')])+line(239,451,178,436,'class="guide"')+math(208,279,[mi('β')])+math(151,410,[mi('β')]);
 s+=label(to,A,'A',-34,-14)+label(to,B,'B',12,32)+label(to,C,'C',-32,5)+label(to,D,'D',-23,35)+label(to,E,'E',12,-11)+label(to,K,'K',14,-3);
 s+=math(216,83,[mi('ℓ')])+math(397,520,[mi('m')])+math(478,510,[mi('x')])+math(85,64,[mi('y')])+math(86,510,[rm('O')],end);
 s+=math(260,571,[mi('AD'),rm(' ⟂ '),mi('CE'),rm('、'),mi('AD'),rm(' ⟂ '),mi('DB')],center);
 s+=math(260,616,[rm('∠'),mi('ADC'),rm(' = '),mi('α')],center);
 s+=math(260,661,[rm('∠'),mi('BCD'),rm(' = ∠'),mi('BAD'),rm(' = '),mi('β')],center);
 return s;
}
function sineTriangle(){
 const to=(x,y)=>[48+37*x,185-37*y];
 let s=style+text(260,32,'差の角の三角比',center)+poly([[0,0],[11,0],[11,2],[0,0]],to,'class="curve"');
 s+=poly([[10.65,0],[10.65,.35],[11,.35]],to)+angle(to,[0,0],3.2,0,Math.atan2(2,11));
 s+=math(300,172,[mi('α'),rm(' − '),mi('β')])+math(250,224,[rm('11')],center)+math(481,159,[rm('2')]);
 s+=math(250,91,[rm('5√5')],center)+text(260,272,'底辺 11、高さ 2 の相似な直角三角形',center);
 return s;
}
function region(){
 const to=(x,y)=>[110+40*x,460-40*y],{A,B,C,D,K,r}=q1;
 let s=style+text(260,32,'領域 L と両端での接線',center);
 s+=poly([A,C,...arcBC(),B,A],to,'fill="#f2e4c5" stroke="none"')+'<!-- region: A-C, arc C-D-B, B-A -->';
 s+=axes(to,-1.5,9.1,-1.4,9.65)+circle(to,K,r)+poly([A,C],to,'class="curve"')+poly([A,B],to,'class="curve"');
 s+=poly(sample(x=>-5.5*x+1,-1.32,.48),to,'class="warm"')+poly(sample(x=>.5*x-3,2.5,8.5),to,'class="cool"');
 s+=poly([K,C],to,'class="guide"')+poly([K,B],to,'class="guide"');
 s+=label(to,A,'A',10,-14)+label(to,B,'B',10,33)+label(to,C,'C',-39,-7)+label(to,D,'D',-10,37)+label(to,K,'K',18,-5);
 s+=math(187,377,[mi('L')])+math(478,491,[mi('x')])+math(86,66,[mi('y')])+math(90,492,[rm('O')],end);
 s+=text(40,565,'C で接する傾き')+math(380,565,[rm('−11/2')],center);
 s+=text(40,609,'B で接する傾き')+math(380,609,[rm('1/2')],center);
 s+=line(30,632,490,632,'class="fine"');
 s+=math(260,673,[mi('y'),rm(' = '),mi('ax'),rm(' − '),mi('k')],center);
 s+=text(260,715,'k を大きくすると直線は下へ動く。',center);
 return s;
}
function logArea(second=false){
 const to=(x,y)=>[170+120*x,455-120*y],f=second?x=>c2(x,-1):c1;
 let s=style+text(260,32,second?'C₂ と法線・y 軸の囲み':'C₁ と法線・y 軸の囲み',center);
 s+=poly([...sample(normal,0,1),...sample(f,1,0)],to,'fill="#f2e4c5" stroke="none"');
 s+=axes(to,-.7,2.55,-.35,3.17)+poly(sample(f,-.36,2.25),to,'class="curve cool"')+poly(sample(normal,-.13,1.55),to,'class="curve warm"');
 s+=poly([[1,0],[1,Math.log(2)],[0,Math.log(2)]],to,'class="guide"')+label(to,[1,Math.log(2)],'T',15,-20);
 s+=math(142,484,[rm('O')],end)+math(480,486,[mi('x')])+math(145,69,[mi('y')]);
 s+=math(290,492,[rm('1')],center)+math(373,509,[mi('ℓ')]);
 s+=math(433,second?379:300,[mi('C'),sub(second?'2':'1')]);
 s+=math(194,112,[rm('2 + log 2')])+math(147,378,[rm('log 2')],end);
 if(second)s+=math(195,276,[mi('q')]);
 s+=math(260,542,[mi('T'),rm('(1, log 2)')],center);
 if(second)s+=text(260,587,'p = −1 の形状例（求める p の値ではない）。',center);
 return s;
}
function absGraph(){
 const a=.45,to=(x,y)=>[92+300*x,369-185*y];
 let s=style+text(260,32,'絶対値を外す境界で積分を分ける',center);
 s+=poly([[0,0],...sample(x=>absoluteLog(x,a),0,1-a),[1-a,0]],to,'fill="#dbe8f0" stroke="none"');
 s+=poly([[1-a,0],...sample(x=>absoluteLog(x,a),1-a,1),[1,0]],to,'fill="#f2e4c5" stroke="none"');
 s+=axes(to,-.12,1.31,-.1,1.43)+poly(sample(x=>absoluteLog(x,a),0,1-a),to,'class="curve cool"')+poly(sample(x=>absoluteLog(x,a),1-a,1.15),to,'class="curve warm"');
 s+=poly([[1,0],[1,Math.log(1+a)],[0,Math.log(1+a)]],to,'class="guide"');
 s+=math(59,401,[rm('O')],end)+math(473,403,[mi('x')])+math(65,83,[mi('y')]);
 s+=math(392,404,[rm('1')],center)+math(257,405,[rm('1 − '),mi('a')],center);
 s+=math(110,204,[rm('−log '),mi('a')])+math(274,282,[rm('log(1 + '),mi('a'),rm(')')]);
 s+=math(305,94,[mi('y'),rm(' = |log('),mi('x'),rm(' + '),mi('a'),rm(')|')],center);
 s+=text(260,458,'0 < a < 1 の一例。左は −f、右は f。',center);
 s+=text(260,499,'a = 1 では左の区間がなくなる。',center);
 return s;
}
function farthest(){
 const to=(x,y)=>[200+45*x,338-45*y],{A,B,C1,r}=q3,C=[1+r*Math.cos(Math.PI/6),-3+r*Math.sin(Math.PI/6)];
 let s=style+text(260,32,'A から円周上の点までの最大距離',center);
 s+=axes(to,-2.7,5.25,-5.1,5.35)+circle(to,B,r)+poly([A,C1],to,'class="warm curve"');
 s+=poly([B,C],to,'class="guide"');
 s+=label(to,A,'A',16,-11)+label(to,B,'B',30,36)+label(to,C1,'C',-33,39,'1')+label(to,C,'C',18,-9);
 s+=math(454,369,[mi('x')])+math(176,85,[mi('y')])+math(181,369,[rm('O')],end);
 s+=math(260,614,[mi('A'),rm('(2, 4)　'),mi('B'),rm('(1, −3)')],center);
 s+=text(260,655,'A・B・C₁ の順に一直線。円の半径は √2。',center);
 return s;
}
function ratio(){
 const {P1,P2,Q1,Q2}=q3;
 let s=style;
 const panel=(which,oy)=>{
  const to=(x,y)=>[70+75*x,oy-75*y],first=which===1,P=first?P1:P2,Q=first?Q1:Q2,R=first?P2:P1;
  let b=poly([[0,0],P,R,[0,0]],to,'fill="#f2e4c5" stroke="none"')+poly([P,R,Q,P],to,'fill="#dbe8f0" stroke="none"');
  b+=axes(to,-.25,5,-(first?3.6:1.8),first?2.3:4.45);
  b+=poly([[0,0],P,Q,[0,0]],to,'class="curve"');
  b+=poly(sample(x=>7*x-10,first?.9:1.15,first?1.75:2.08),to,'class="curve warm"');
  b+=label(to,P1,'P',first?12:18,first?-15:-65,'1')+label(to,P2,'P',-54,15,'2')+label(to,Q,'Q',15,12,first?'1':'2');
  b+=math(47,oy+30,[rm('O')],end)+math(455,oy+31,[mi('x')]);
  b+=math(43,to(0,first?2.3:4.45)[1]-12,[mi('y')]);
  b+=text(first?258:262,first?116:688,'直線 AB')+line(first?251:257,first?127:700,...to(first?1.67:2,first?1.7:4),'class="guide"');
  // The point where AB cuts OQ is R; the triangles share the altitude from P.
  return b;
 };
 s+=text(260,32,'① P = P₁、Q = Q₁',center)+panel(1,253);
 s+=math(260,559,[mi('OP'),sub('2'),rm(' : '),mi('P'),sub('2'),mi('Q'),sub('1'),rm(' = 5 : 7')],center);
 s+=line(25,592,495,592,'class="fine"');
 s+=text(260,634,'② P = P₂、Q = Q₂',center)+panel(2,1009);
 s+=math(260,1190,[mi('OP'),sub('1'),rm(' : '),mi('P'),sub('1'),mi('Q'),sub('2'),rm(' = 5 : 7')],center);
 s+=text(260,1234,'金色と青色の三角形は、高さが共通。',center);
 return s;
}
export function buildFigures(){
 const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('ans-q1-circle-angles',520,690,'円Kの直径はA(2,8)B(6,0)。C(−2/5,16/5)とD(2,0)も円周上。CEはADに垂直でE(2,16/5)。角ADCがα、角BCDと角BADがβ。','第1問(2)：補助線CEと、同じ弧BDに対する円周角。',circleAngles());
 pack.add('ans-q1-sine-triangle',520,297,'底辺11、高さ2、斜辺5√5の直角三角形。底辺と斜辺のなす角はα−βで、tan(α−β)=2/11に対応する。','第1問(2)：正の鋭角α−βの三角比を読むための相似な三角形。',sineTriangle());
 pack.add('ans-q1-region',520,743,'領域Lは線分AC、円K上でDを含む弧CB、線分BAに囲まれ境界を含む。CとBでの接線の傾きは−11/2と1/2。ax−y=kのkを大きくすると直線y=ax−kは下へ動く。','第1問(3)：両端で接する傾きが場合分けの境界。円の全体を可動領域としない。',region());
 pack.add('ans-q2-c1-area',520,573,'C1はy=log(x+1)、法線ℓはy=−2x+2+log2。交点T(1,log2)とy軸の間で、ℓが上側、C1が下側。','第2問(1)(i)：0から1まで「法線−曲線」を積分する領域。',logArea());
 pack.add('ans-q2-c2-area',520,616,'C2はp=−1、q=2log2とした形状例。T(1,log2)を通り、0から1で法線ℓより下にある。パラメータの答えp=−1/2を先取りした図ではない。','第2問(1)(ii)：p=−1は形状説明の一例。実際の係数は面積条件から決める。',logArea(true));
 pack.add('ans-q2-absolute-value',520,528,'0<a<1の代表例a=0.45におけるy=|log(x+a)|。x=1−aで0、左は−log(x+a)、右はlog(x+a)。区間0から1の両側の面積を足す。a=1では左区間がなくなる。','第2問(2)：絶対値の積分はx=1−aで分割。図は0<a<1の形状例。',absGraph());
 pack.add('ans-q3-farthest-point',520,684,'複素平面のA(2,4)、B(1,−3)、B中心で半径√2の円。Aから最遠の点C1(4/5,−22/5)はABをB側へ延長した位置。円周上の別の点Cも示す。','第3問(2)：AB=5√2、BC₁=√2なので最大距離は6√2。',farthest());
 pack.add('ans-q3-area-ratio',520,1263,'面積最大の2場合を分けて表示。P1=(5/3,5/3)、P2=(5/4,−5/4)は直線AB上。上段ではQ1=(3,−3)とP1、下段ではQ2=(4,4)とP2を結ぶ。直線ABが各三角形を5:7に分ける。','第3問(3)：どちらも共有する高さを使い、面積比をOQ上の線分比で求める。',ratio());
 return pack.save('全8図は問題条件と独立した座標・積分・複素数計算から作図。等縮尺は円・角・法線・面積比で維持。絶対値関数の概形のみ軸の縮尺が異なる。原本クロップのトレース・埋込なし。学習者版の方向誤記、導出・増減表の欠落は修復依頼と注記を維持し、権利・人間レビューを自動承認しない。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildFigures();
