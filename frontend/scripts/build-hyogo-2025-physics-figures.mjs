// Independent geometry from the transcribed physical conditions; no source crops.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,mi,rm,sub,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
const arrow='marker-end="url(#arrow)"',center='text-anchor="middle"';
const lab=(x,y,s)=>math(x,y,[rm(s)]);
const arc=(x,y,r,a,b)=>`<path d="${pointsPath(Array.from({length:41},(_,i)=>{const t=a+(b-a)*i/40;return[x+r*Math.cos(t),y+r*Math.sin(t)];}))}"/>`;
export const circle={h:170,r:165,beta:Math.PI/15};
export const circlePoint=(t,beta=0)=>[circle.r*Math.cos(t)*Math.cos(beta),circle.r*Math.sin(t),circle.r*Math.cos(t)*Math.sin(beta)];
export const projection=([x,y,z])=>[350+x+.35*y,292+.36*y-z];
export const contactSpeedSquared=(h,g,alpha,beta=0)=>g*h*Math.sin(alpha-beta)/Math.sin(alpha)*Math.tan(alpha)**2;
export const pv={a:2,b:4,gamma:1.4};
export const adiabatic=(v,k)=>k/v**pv.gamma;
// a=n0=c=1, n1=1.5 is a drawing example, not extra examination data.
export const optics={a:1,n0:1,n1:1.5,elapsed:.4};
export function wavePoint(theta,{a,n0,n1,elapsed}=optics){
 const x=a*(1-Math.cos(theta)),y=a*Math.sin(theta),travel=(elapsed-n0*x)/n1;
 const direction=-theta+Math.asin(n0/n1*Math.sin(theta));
 return[x+travel*Math.cos(direction),y+travel*Math.sin(direction)];
}
export function ray(theta,{a,n0,n1}=optics){
 const T=[a*(1-Math.cos(theta)),a*Math.sin(theta)];
 const theta1=Math.asin(n0/n1*Math.sin(theta)),slope=theta-theta1;
 const D=[a,T[1]-(a-T[0])*Math.tan(slope)];
 const theta2=Math.asin(n1/n0*Math.sin(slope));
 return{T,D,theta1,theta2,F:[T[0]+T[1]/Math.tan(slope),0],trueF:[a+D[1]/Math.tan(theta2),0]};
}
function circleSetup(tilted){
 const beta=tilted?circle.beta:0,at=(x,y)=>projection([x*Math.cos(beta),y,x*Math.sin(beta)]),O=projection([0,0,0]),top=projection([-circle.h*Math.sin(beta),0,circle.h*Math.cos(beta)]);
 let b=`<path d="${pointsPath([at(-235,-190),at(235,-190),at(235,190),at(-235,190)])} Z" fill="#f4f7f9" stroke="#afc0cd"/>`;
 b+=`<path d="${pointsPath(Array.from({length:181},(_,i)=>projection(circlePoint(i*Math.PI/90,beta))))}" class="guide"/>`;
 b+=line(...O,...top,'stroke-width="4"')+dot(...O)+lab(O[0]+12,O[1]+25,'O');
 const A=projection(circlePoint(tilted?Math.PI:0,beta));
 b+=line(...top,...A,'stroke-width="2.5"')+`<circle cx="${A[0]}" cy="${A[1]}" r="8" fill="#dbe6ed"/>`;
 b+=math((O[0]+top[0])/2-27,(O[1]+top[1])/2,[mi('h')]);
 if(tilted){
  const Q=projection(circlePoint(0,beta));b+=dot(...Q)+lab(A[0]-27,A[1]+25,'P')+lab(Q[0]+10,Q[1]-8,'Q');
  b+=line(...A,Q[0],Q[1],'class="guide"')+line(...A,A[0]+130,A[1],'class="guide"')+arc(...A,70,-beta,0)+math(A[0]+80,A[1]-35,[mi('β')]);
  b+=text(350,423,'P：最下点　Q：最上点',center)+math(350,463,[rm('P'),rm(' での速さ '),mi('v'),sub('0')],center);
 }else{
  b+=lab(A[0]+15,A[1]+28,'A')+math(A[0]+15,A[1]-15,[mi('m')]);
  const angle=Math.atan2(A[1]-top[1],A[0]-top[0]);b+=arc(...top,55,angle,Math.PI/2)+math(top[0]+22,top[1]+78,[mi('α')]);
  b+=text(350,423,'A は、O を中心に水平面内で円運動する。',center)+math(350,463,[rm('速さ '),mi('v')],center);
 }
 b+=text(350,43,tilted?'図1b　板と棒を角 β だけ傾ける':'図1a　水平な平面板',center);
 return b;
}
function forces(){
 const beta=circle.beta,alpha=Math.PI/3,P=[270,265],normal=-Math.PI/2-beta,ta=normal+alpha;
 let b=line(85,305,590,198,'stroke-width="2.5"')+line(85,305,228,305,'class="guide"')+arc(85,305,65,-beta,0)+math(162,336,[mi('β')]);
 const end=(len,angle)=>[P[0]+len*Math.cos(angle),P[1]+len*Math.sin(angle)];
 b+=line(...P,...end(145,normal),arrow)+math(224,110,[mi('R')]);
 b+=line(...P,...end(190,ta),arrow)+math(423,128,[mi('S')]);
 b+=line(...P,270,407,arrow)+math(290,412,[mi('m'),mi('g')]);
 b+=arc(...P,64,normal,ta)+math(290,178,[mi('α')]);
 b+=`<circle cx="270" cy="265" r="7" fill="white"/>`+lab(238,297,'P');
 b+=text(350,42,'最下点 P の小球に働く力（側面図）',center)+text(350,468,'R：面に垂直　S：糸に沿う　mg：鉛直下向き',center);
 return b;
}
function cycle(){
 const X=v=>90+125*v,Y=p=>425-330*p,A=[1,1],B=[pv.a,1],C=[pv.b,adiabatic(pv.b,pv.a**pv.gamma)],D=[pv.b,adiabatic(pv.b,1)],xy=([v,p])=>[X(v),Y(p)];
 let b=line(75,425,645,425,`class="axis" ${arrow}`)+line(75,425,75,48,`class="axis" ${arrow}`)+math(657,435,[mi('V')])+math(64,31,[mi('p')])+lab(54,449,'O');
 const sample=(lo,hi,k)=>Array.from({length:81},(_,i)=>{const v=lo+(hi-lo)*i/80;return xy([v,adiabatic(v,k)]);});
 b+=line(...xy(A),...xy(B))+`<path d="${pointsPath(sample(pv.a,pv.b,pv.a**pv.gamma))}"/>`+line(...xy(C),...xy(D))+`<path d="${pointsPath(sample(1,pv.b,1))}"/>`;
 b+=line(X(1.35),Y(1),X(1.65),Y(1),arrow)+line(...xy([2.65,adiabatic(2.65,pv.a**pv.gamma)]),...xy([2.85,adiabatic(2.85,pv.a**pv.gamma)]),arrow)+line(X(4),Y(.32),X(4),Y(.24),arrow)+line(...xy([2.45,adiabatic(2.45,1)]),...xy([2.23,adiabatic(2.23,1)]),arrow);
 for(const [name,pt,dx,dy]of[['A',A,-26,-12],['B',B,10,-12],['C',C,14,-5],['D',D,14,10]])b+=dot(...xy(pt))+lab(X(pt[0])+dx,Y(pt[1])+dy,name);
 for(const [v,s]of[[1,'A'],[2,'B'],[4,'C']])b+=line(X(v),425,X(v),v===4?Y(C[1]):95,'class="guide"')+math(X(v),459,[mi('V'),sub(s)],center);
 b+=text(275,66,'定圧',center)+text(470,162,'断熱',center)+text(290,366,'断熱',center)+text(628,322,'定積',center);
 b+=text(350,505,'A → B → C → D → A',center);
 return b;
}
const optMap=([x,y])=>[235+205*x,310-205*y];
function hemisphere({points=false,wave=false,geometry=false,blank=false}={}){
 const M=optMap,A=M([1,1]),B=M([1,-1]),C=M([1,0]),O=M([0,0]);
 let b=`<path d="${pointsPath(Array.from({length:121},(_,i)=>{const t=-Math.PI/2+Math.PI*i/120;return M([1-Math.cos(t),Math.sin(t)]);}))} Z" fill="#f3f7f9" stroke="#53728a"/>`;
 b+=line(70,310,620,310,`class="axis" ${arrow}`)+line(235,560,235,47,`class="axis" ${arrow}`)+math(635,319,[mi('x')])+math(224,30,[mi('y')]);
 for(const[name,pt,dx,dy]of[['A',A,13,-9],['B',B,13,24],['C',C,13,27],['O',O,-32,27]])b+=dot(...pt)+lab(pt[0]+dx,pt[1]+dy,name);
 b+=math(139,425,[mi('n'),sub('0')])+math(380,425,[mi('n'),sub('1')]);
 if(!blank&&!geometry){b+=line(86,156,166,156,arrow)+text(126,130,'入射光',center);}
 if(!points||(!blank&&!wave&&!geometry)){b+=line(...C,...A,'class="guide"')+math(457,204,[mi('a')]);}
 if(points){
  const s=optics.elapsed/optics.n0,yp=Math.sqrt(s*(2-s)),P=M([s,yp]),Q=M([s,-yp]);
  b+=dot(...P)+lab(P[0]-33,P[1]-13,'P')+dot(...Q)+lab(Q[0]+13,Q[1]+44,'Q');
  if(wave){
   const thetaMax=Math.acos(1-s),coords=Array.from({length:181},(_,i)=>M(wavePoint(-thetaMax+2*thetaMax*i/180)));
   b+=`<path d="${pointsPath(coords)}" class="accent"/>`+line(P[0],60,...P,'class="accent"')+line(...Q,Q[0],553,'class="accent"');
   const R=M([optics.elapsed/optics.n1,0]);b+=dot(...R)+lab(R[0]+18,R[1]+32,'R');
   b+=text(547,190,'外側の波面',center)+line(486,183,334,95,'class="guide"');
   b+=text(119,250,'半球内の波面',center)+line(180,254,291,261,'class="guide"');
  }
  if(geometry){
   const S=M([s,0]);b+=line(...P,...Q,'class="guide"')+line(...P,...C)+dot(...S)+lab(S[0]+9,S[1]+28,'S');
   b+=`<path d="M${S[0]} ${S[1]-14} h14 v14"/>`+math(397,214,[mi('a')]);
   b+=math(349,590,[rm('PS² + SC² = '),mi('a'),rm('²')],center);
  }
 }
 return b;
}
function rays(){
 const r=ray(.1),M=([x,y])=>[84+187*x,293-910*y],T=M(r.T),D=M(r.D),F=M(r.F),G=M(r.trueF),O=M([0,0]),C=M([1,0]);
 let b=text(350,35,'光軸近傍の屈折（縦方向を拡大）',center);
 const edge=Array.from({length:61},(_,i)=>{const y=-.06+i*.25/60;return M([1-Math.sqrt(1-y*y),y]);});
 b+=`<path d="${pointsPath(edge)} L${M([1,.19]).join(',')} L${M([1,-.06]).join(',')} Z" fill="#f4f7f9" stroke="none"/>`+`<path d="${pointsPath(edge)}"/>`+line(...M([1,.19]),...M([1,-.06]));
 b+=line(30,293,682,293,`class="axis" ${arrow}`)+math(688,302,[mi('x')]);
 b+=line(24,T[1],...T,arrow)+line(...T,...D)+line(...D,...G,arrow)+line(...D,...F,'class="guide"');
 b+=line(...T,...C,'class="guide"')+line(...T,...M([r.T[0],0]),'class="guide"')+line(...D,419,D[1],'class="guide"');
 for(const[name,pt,dx,dy]of[['T',T,-26,-13],['D',D,12,-18],['C',C,13,29],['F',F,-7,30]])b+=dot(...pt)+lab(pt[0]+dx,pt[1]+dy,name);
 b+=dot(...G)+text(G[0]-12,339,'真の焦点',center)+line(G[0]-10,320,G[0],299,'class="guide"');
 b+=lab(O[0]-32,O[1]+28,'O')+lab(O[0]+40,O[1]+62,'U')+line(O[0]+41,O[1]+40,...M([r.T[0],0]),'class="guide"');
 b+=math(161,112,[mi('n'),sub('1')])+math(443,112,[mi('n'),sub('0')]);
 b+=text(138,168,'入射光',center)+math(383,220,[mi('θ'),sub('2')]);
 b+=text(350,399,'球面で θ₀ → θ₁、平面で (θ₀ − θ₁) → θ₂',center);
 b+=text(350,437,'破線の延長先 F は、平面で屈折しないと仮定した焦点。',center);
 return b;
}
export function buildFigures(){
 const pack=createSvgPackage('hyogo-medical-2025-general-a-b-physics',import.meta.url);
 pack.add('q1-figure-1a',700,495,'水平な板のOに高さhの棒が垂直に立つ。上端から糸を結んだ質量mの小球AがOを中心に速さvで円運動し、棒と糸の角はα。','図1a：配置の模式図。破線は円軌道。',circleSetup(false));
 pack.add('q1-figure-1b',700,495,'板と棒を一緒にβ傾ける。棒は板に垂直。円軌道の左側Pが最下点、右側Qが最上点で、Pでの速さはv₀。','図1b：立体配置の模式図。高さや円軌道を投影して示す。',circleSetup(true));
 pack.add('q3-figure-3',700,535,'p–V図でAからBへ定圧膨張、BからCへ断熱膨張、CからDへ定積冷却、DからAへ断熱圧縮する時計回りのサイクル。','図3：体積と圧力の比率は配置例。断熱曲線はpV^γ=一定から作図。',cycle());
 pack.add('q4-figure-4',700,590,'中心C、半径aの半球の左端をOとし、右の平面ABはx軸に垂直。半球内n₁、外側n₀。光は左から入射し、球面上のPとQはx軸対称。','図4：半球の断面と座標。A・Pは上側、B・Qは下側。',hemisphere({points:true}));
 pack.add('q4-answer-frame',700,590,'半球と座標軸、球面上の上側Pと下側Qだけを示す。解答する波面は描かれていない。','問4(1) 解答用：P・Qに到達した時刻の波面を書き込む。',hemisphere({points:true,blank:true}));
 pack.add('a1-forces-at-p',700,500,'最下点Pで、張力Sは糸に沿って右上、垂直抗力Rは面に垂直な左上、重力mgは下へ働く。RとSの角はα。','問1(5)：力の方向を示す側面図。矢印の長さは力の比率ではない。',forces());
 pack.add('a4-wavefront',700,590,'Δt後の波面は外側ではPQを含む縦の直線、半球内では屈折してx軸付近ほど後ろへ遅れた曲線。軸上Rはx=cΔt/n₁。','問4(1)：金色が波面。n₁/n₀=1.5、cΔt/n₀=0.4aの配置例。',hemisphere({points:true,wave:true}));
 pack.add('a4-wavefront-geometry',700,620,'PとQを結んだ直線とx軸の交点をSとする。PSCはSで直角、PC=a、OS=cΔt/n₀。','問4(2)：直角三角形PSCで点Pの高さを求める。',hemisphere({points:true,geometry:true}));
 pack.add('a4-ray-diagram',720,465,'上側球面のTで屈折し、平面のDで再び屈折して真の焦点へ進む。Dから内部光線をそのまま延長した破線の交点Fは真の焦点より右。UはTから軸への垂足。','問4(4)〜(5)：スネルの法則による光線。縦方向を拡大しており、角度は図から測らない。',rays());
 return pack.save('問題と解説を分離した独自作図。波面は各球面点への入射時刻・屈折後の進行時間から計算し、任意の円弧では代用しない。屈折図はn1/n0=1.5、θ0=0.1radの配置例。A上/B下は解説のAC上のDと正のyPに合わせる。電子のa/b方向と電極対応はHTMLだけでは確定できずq2-figure-2を保留。円運動の速度上限・屈折の中間式にある不整合は読者向け注意書きと修復依頼で管理。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildFigures();
