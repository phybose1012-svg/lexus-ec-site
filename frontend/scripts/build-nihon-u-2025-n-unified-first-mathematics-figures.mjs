import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,math,mi,rm,sub,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';

export const packageId='nihon-u-2025-n-unified-first-mathematics';
const mid='text-anchor="middle"',arrow='marker-end="url(#arrow)"';
const M=(x,y,s,extra='')=>math(x,y,[mi(s)],extra);
const R=(x,y,s,extra='')=>math(x,y,[rm(s)],extra);
const index=(x,y,s,n,extra='')=>math(x,y,[mi(s),sub(n)],extra);
const stroke=pts=>`<path d="${pointsPath(pts)}"/>`;
export function triangleGeometry(){
 const A=[0,0],B=[Math.sqrt(7),0],H=[6/Math.sqrt(7),0],O=[H[0],Math.sqrt(27/7)],P=[H[0],O[1]*2/9];
 // Foot F of the altitude from A to OB: OB is perpendicular to AP.
 const F=[O[0]+(B[0]-O[0])*3/4,O[1]/4];
 return {A,B,H,O,P,F};
}
export function squareGeometry(a=1,k=0){
 const slope=Math.sqrt(3)-1,x=a/Math.sqrt(3)**k,next=x/Math.sqrt(3);
 return {A:[x,0],nextA:[next,0],nextB:[next,slope*next],C:[x,slope*next],B:[x,slope*x],area:(x-next)**2};
}
export const logCurve=x=>Math.log(x)**2;
export const tangent=x=>4*x/Math.E**2;
export const washer=y=>({outer:Math.exp(Math.sqrt(y)),inner:Math.E**2*y/4});

function triangle(){
 const g=triangleGeometry(),xy=([x,y])=>[95+x*190,445-y*190];
 const {A,B,H,O,P,F}=Object.fromEntries(Object.entries(g).map(([k,v])=>[k,xy(v)]));
 let s=stroke([O,A,B,O])+stroke([O,H])+stroke([A,F]);
 s+=stroke([[H[0]-13,H[1]],[H[0]-13,H[1]-13],[H[0],H[1]-13]]);
 // Right angle at F, using orthonormal directions towards A and O.
 const u=[A[0]-F[0],A[1]-F[1]],v=[O[0]-F[0],O[1]-F[1]],nu=Math.hypot(...u),nv=Math.hypot(...v);
 s+=stroke([[F[0]+13*u[0]/nu,F[1]+13*u[1]/nu],[F[0]+13*u[0]/nu+13*v[0]/nv,F[1]+13*u[1]/nu+13*v[1]/nv],[F[0]+13*v[0]/nv,F[1]+13*v[1]/nv]]);
 for(const [p,n,dx,dy] of [[O,'O',0,-23],[A,'A',-18,5],[B,'B',20,5],[H,'H',0,31],[P,'P',-24,-14]])s+=dot(...p)+M(p[0]+dx,p[1]+dy,n,mid);
 s+=R(281,245,'3')+R(584,254,'2');
 for(const [left,right,parts] of [[A,H,[mi('t')]],[H,B,[rm('1 − '),mi('t')]]]){
  s+=line(left[0],486,left[0],520,'class="guide"')+line(right[0],486,right[0],520,'class="guide"')+line(left[0]+2,506,right[0]-2,506,'marker-start="url(#arrow)" '+arrow)+math((left[0]+right[0])/2,547,parts,mid);
 }
 return s+text(350,592,'P は垂心。OH と A からの垂線の交点。',mid);
}
function squares(){
 const X=x=>80+500*x,Y=y=>455-500*y;
 let s=line(44,455,666,455,'class="axis" '+arrow)+line(80,480,80,36,'class="axis" '+arrow);
 for(let k=0;k<2;k++){
  const g=squareGeometry(1,k),pts=[g.A,g.nextA,g.nextB,g.C].map(([x,y])=>[X(x),Y(y)]);
  s+=`<path d="${pointsPath(pts)} Z" fill="${k?'#faf2df':'#eaf2f8'}"/>`;
  s+=index((X(g.A[0])+X(g.nextA[0]))/2,(Y(0)+Y(g.C[1]))/2+8,'S',k,mid);
 }
 s+=line(X(0),Y(0),X(1.1),Y((Math.sqrt(3)-1)*1.1))+line(X(1),Y(0),X(1),50,'class="guide"');
 s+=M(55,489,'O')+M(676,465,'x')+M(57,40,'y')+M(627,40,'l')+math(555,29,[mi('x'),rm(' = '),mi('a')],mid);
 for(let k=0;k<3;k++){
  const g=squareGeometry(1,k);
  s+=dot(X(g.A[0]),Y(0))+index(X(g.A[0]),490,'A',k,mid)+dot(X(g.B[0]),Y(g.B[1]))+index(X(g.B[0])-20,Y(g.B[1])-16,'B',k,mid);
  if(k<2)s+=dot(X(g.C[0]),Y(g.C[1]))+index(X(g.C[0])+19,Y(g.C[1])+8,'C',k+1);
 }
 return s+text(370,538,'最初の2つの正方形。以後も原点に向かって同じ構成を繰り返す。',mid);
}
function region(){
 const X=x=>95+61*x,Y=y=>491-85*y,P=[Math.E**2,4];
 const bottom=Array.from({length:181},(_,i)=>{const x=P[0]-(P[0]-1)*i/180;return[X(x),Y(logCurve(x))]});
 let s=`<path d="${pointsPath([[X(0),Y(0)],[X(P[0]),Y(4)],...bottom,[X(0),Y(0)]])} Z" fill="#eaf2f8" stroke="none"/>`;
 s+=line(45,Y(0),715,Y(0),'class="axis" '+arrow)+line(X(0),550,X(0),40,'class="axis" '+arrow);
 s+=line(X(0),Y(0),X(9.05),Y(tangent(9.05)),'class="accent"');
 // Sample only within the viewBox; x=0 is excluded, not bridged.
 const xs=Array.from({length:501},(_,i)=>Math.exp(-Math.sqrt(5.2))+(9.05-Math.exp(-Math.sqrt(5.2)))*i/500);
 s+=stroke(xs.map(x=>[X(x),Y(logCurve(x))]));
 s+=line(X(0),Y(4),X(P[0]),Y(4),'class="guide"')+line(X(P[0]),Y(0),X(P[0]),Y(4),'class="guide"');
 s+=dot(X(P[0]),Y(4))+M(X(P[0])-4,Y(4)-27,'P',mid)+dot(X(1),Y(0));
 s+=R(X(0)-19,Y(4)+8,'4','text-anchor="end"')+R(X(1),Y(0)+36,'1',mid)+math(X(P[0]),Y(0)+36,[mi('e'),'<tspan class="rm" font-size="70%" baseline-shift="super">2</tspan>'],mid);
 s+=M(66,520,'O')+M(724,499,'x')+M(67,40,'y')+M(666,68,'l');
 s+=math(384,359,[mi('y'),rm(' = (log '),mi('x'),rm(')'),'<tspan class="rm" font-size="70%" baseline-shift="super">2</tspan>']);
 s+=M(X(2.65),Y(1.2)+7,'D',mid);
 // Rotation arrow lives below the axis labels, not through O or the curve.
 s+=`<path d="M69 555 C29 541 31 578 95 578 C157 578 157 551 130 549" class="accent" ${arrow}/>`;
 return s+text(215,572,'y軸のまわりに1回転')+text(395,614,'青い領域 D：直線 OP と曲線（xが1以上）、x軸の間。',mid);
}
export function build(){
 const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('ans-q3-triangle',700,620,'OA=3、OB=2、内積3の三角形OAB。OからABへの垂線の足HはAH対HBが6対1の位置。OHとAからOBへの垂線が交わる点Pが垂心。下側のt対1−tは問1の内分比。','第Ⅲ問　垂線の足Hと垂心P。',triangle());
 pack.add('ans-q5-square-series',740,568,'直線l上にB0、B1、B2、x軸上にA0、A1、A2を置く。正方形A0A1B1C1とA1A2B2C2の辺長比は1対1/√3、面積比は1対1/3。C1はA0B0上、C2はA1B1上。','第Ⅴ問　相似な正方形の列（最初の2個）。',squares());
 pack.add('ans-q6-rotation-region',765,646,'曲線y=(log x)^2と原点Oを通る正の傾きの接線lはP=(e²,4)で接する。青いDはOPの下、xが1以上の曲線の上とx軸で囲まれる。Dをy軸のまわりに回転すると、高さ0から4の断面は円環になる。','第Ⅵ問　接線と領域D。曲線の0<x<1の部分はDに含まない。',region());
 return pack.save('3図は問題条件と独立計算から作成。元のrestricted cropをコピーしない。第Ⅳ問の指数・第Ⅵ問の解答欄、解説の省略・表現は元HTML修復待ち。人間レビューと権利確認は未了。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))build();
