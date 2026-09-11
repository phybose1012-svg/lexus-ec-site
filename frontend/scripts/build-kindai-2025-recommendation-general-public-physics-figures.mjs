// Geometry is derived from the problem, never traced from restricted pixels.
import {pathToFileURL} from 'node:url';
import {createSvgPackage,mi,rm,sub,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='kindai-2025-recommendation-general-public-physics';
const circle=(x,y,r,a='')=>`<circle cx="${x}" cy="${y}" r="${r}" ${a}/>`;
const rect=(x,y,w,h,a='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" ${a}/>`;
const path=(p,a='')=>`<path d="${pointsPath(p)}" ${a}/>`;
const arrow=(a,b,extra='')=>line(...a,...b,`marker-end="url(#arrow)" ${extra}`);
const guide=(a,b)=>line(...a,...b,'class="guide"');
const dim=(a,b)=>line(...a,...b,'class="axis" marker-start="url(#arrow)" marker-end="url(#arrow)"');
const M=(x,y,...p)=>math(x,y,p,'text-anchor="middle"');
const V=(x,y,t)=>M(x,y,mi(t));
const VS=(x,y,t,s)=>M(x,y,mi(t),sub(s));
const T=(x,y,t)=>text(x,y,t,'text-anchor="middle"');
const vec=(x,y,t,s='')=>M(x,y,mi(t),...(s?[sub(s)]:[]))+arrow([x-10,y-30],[x+13,y-30]);
const add=(p,q)=>p.map((x,i)=>x+q[i]);
const mul=(p,k)=>p.map(x=>x*k);
const unit=p=>mul(p,1/Math.hypot(...p));
const sample=(f,a,b,n=60)=>Array.from({length:n+1},(_,i)=>f(a+(b-a)*i/n));
const arc=(p,r,a,b)=>path(sample(t=>[p[0]+r*Math.cos(t),p[1]-r*Math.sin(t)],a,b,32),'class="accent"');
const axes=(O,xmin,xmax,ymin,ymax)=>arrow([xmin,O[1]],[xmax,O[1]],'class="axis"')+arrow([O[0],ymax],[O[0],ymin],'class="axis"')+V(xmax+16,O[1]+7,'x')+V(O[0],ymin-15,'y')+V(O[0]-18,O[1]+26,'O');
const hatch='<defs><pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M-2 2 L2 -2 M0 9 L9 0 M7 11 L11 7" stroke="#a8bbca" stroke-width="1"/></pattern></defs>';
const right=(p,a,b)=>{const u=mul(unit([a[0]-p[0],a[1]-p[1]]),10),v=mul(unit([b[0]-p[0],b[1]-p[1]]),10);return path([add(p,u),add(add(p,u),v),add(p,v)]);};
export function collision(theta,R=1,L=3,v=1,m=1){
 const a=R*Math.sin(theta),A=[-R*Math.cos(theta),a],alpha=Math.PI-2*theta;
 const out=[v*Math.cos(alpha),v*Math.sin(alpha)];
 return {a,A,alpha,out,impulse:2*m*v*Math.cos(theta),wall:out[0]>1e-12?a+(L-A[0])*out[1]/out[0]:null};
}
export function orbit({mu=.7,b=2.4,v0=1}={}){
 const A=mu/(v0*v0),e=Math.hypot(1,b/A),beta=2*Math.atan(A/b),theta2=(Math.PI-beta)/2;
 const d=[Math.cos(theta2),Math.sin(theta2)],n=[-d[1],d[0]];
 const point=t=>add(mul(d,A*(e-Math.cosh(t))),mul(n,b*Math.sinh(t)));
 const tangent=t=>unit(add(mul(d,A*Math.sinh(t)),mul(n,-b*Math.cosh(t))));
 const r1=b*b/A,S=b*v0/2,vr1=Math.hypot(v0,mu/(2*S));
 return {A,e,b,beta,theta2,d,n,point,tangent,r1,S,vr1,r2:A*(e-1),K:[A,b],outY:x=>b-(x-A)*Math.tan(beta)};
}
export function rc({V0=4,C=.2,omega=3,delta=.2,r=5}={}){
 const R=1/(C*omega*Math.tan(delta)),IR=V0/R,IC=V0*C*omega;
 return {R,IR,IC,P:V0*V0/(2*R),Pr:V0*V0/(2*r),Pt:V0*V0/2*(1/R+1/r)};
}

function scatter(distance=false){
 const R=65,L=260,O=[285,360],th=70*Math.PI/180,g=collision(th,R,L),A=add(O,[g.A[0],-g.A[1]]),B=[O[0]+L,O[1]],C=[B[0],O[1]-g.wall],P=[O[0],A[1]],Q=[B[0],A[1]];
 let s=axes(O,45,625,40,425)+circle(...O,R,'fill="#eef3f6"')+line(B[0],35,B[0],430,'stroke-width="4" stroke="#b0bdc6"')+T(B[0]+15,23,'壁')+guide([50,A[1]],Q)+guide(A,C)+line(...O,...A)+dot(...A)+V(A[0]-19,A[1]-15,'A')+V(B[0]+15,B[1]+24,'B')+V(C[0]+18,C[1],'C');
 s+=arrow([70,A[1]],[150,A[1]])+dot(70,A[1])+vec(112,A[1]-21,'v')+V(69,A[1]-27,'m');
 const outPoint=add(A,mul([Math.cos(g.alpha),-Math.sin(g.alpha)],128));
 s+=arrow(add(A,mul([Math.cos(g.alpha),-Math.sin(g.alpha)],50)),outPoint)+vec(outPoint[0]+46,outPoint[1]+28,'v','A');
 s+=dim([190,O[1]],[190,A[1]])+V(172,(O[1]+A[1])/2+6,'a')+dim([O[0],446],[B[0],446])+V(418,437,'L');
 s+=arc(O,34,Math.PI-th,Math.PI)+VS(O[0]-46,O[1]-11,'θ','A')+arc(A,40,0,g.alpha)+V(A[0]+57,A[1]-11,'α');
 const rad=[O[0]+R*.71,O[1]+R*.71];s+=arrow(O,rad,'class="axis"')+V(O[0]+85,O[1]+50,'R')+dot(...O)+V(O[0]-18,O[1]+28,'O');
 if(distance){s+=dot(...P)+dot(...Q)+V(P[0]+12,P[1]+25,'P')+V(Q[0]+15,Q[1]+23,'Q')+right(Q,A,B)+dim([595,B[1]],[595,Q[1]])+M(599,280,mi('R'),rm(' sin '),mi('θ'),sub('A'));}
 return s;
}
function floorCollision(answer=false){
 const A=[320,295],th=70*Math.PI/180,alpha=Math.PI-2*th,tan=20*Math.PI/180;
 const n=[-Math.cos(th),-Math.sin(th)],t=[Math.cos(tan),-Math.sin(tan)],out=[Math.cos(alpha),-Math.sin(alpha)];
 let s=path([[60,390],add(A,mul(t,-270)),add(A,mul(t,280)),[610,405],[60,405]],'fill="#eef3f6" stroke="none"')+line(...add(A,mul(t,-275)),...add(A,mul(t,280)))+guide([70,A[1]],[605,A[1]])+guide(add(A,mul(n,-110)),add(A,mul(n,170)))+dot(...A)+V(354,328,'A')+T(508,382,'なめらかな面');
 s+=arrow([90,295],[240,295])+dot(110,295)+vec(170,266,'v')+V(104,269,'m')+arrow(add(A,mul(out,20)),add(A,mul(out,190)))+vec(487,151,'v','A');
 s+=arc(A,48,Math.PI-th,Math.PI)+VS(246,263,'θ','A')+arc(A,42,0,alpha)+line(366,302,380,310,'class="axis"')+V(395,332,'α')+right(A,add(A,t),add(A,n));
 if(answer){s+=arc(A,62,alpha,Math.PI-th)+VS(336,214,'θ','A')+T(190,50,'法線成分は反転')+M(190,88,rm('−'),mi('v'),rm(' cos '),mi('θ'),sub('A'),rm(' → '),mi('v'),rm(' cos '),mi('θ'),sub('A'))+T(500,50,'接線成分は一定')+M(500,88,mi('v'),rm(' sin '),mi('θ'),sub('A'));}
 return s;
}
function wallThreshold(){
 const O=[305,320],R=100,a=R/Math.sqrt(2),A=[O[0]-a,O[1]-a];
 let s=axes(O,65,620,110,435)+circle(...O,R,'fill="#eef3f6"')+line(575,60,575,425,'stroke-width="4" stroke="#b0bdc6"')+T(575,43,'壁')+arrow([80,A[1]],A)+arrow(A,[A[0],130],'class="accent"')+line(...O,...A)+dot(...A)+V(A[0]-39,A[1]+22,'A')+arc(O,43,3*Math.PI/4,Math.PI)+M(O[0]-57,O[1]-14,rm('45°'))+dim([140,320],[140,A[1]])+V(124,286,'a')+dot(...O)+V(O[0]-18,O[1]+28,'O');
 s+=T(320,33,'境界では反射後の速度が鉛直になる')+M(140,92,mi('a'),rm(' = (√2/2)'),mi('R'));
 s+=T(320,470,'壁に届くのは、この境界より外側から衝突した小球');
 return s;
}
function flow(){
 const O=[440,250];let s=axes(O,50,630,60,385)+circle(...O,57,'fill="#eef3f6"')+line(590,70,590,385,'stroke="#a9b7c2" stroke-width="4"')+T(590,48,'壁')+V(607,278,'B');
 s+=`<ellipse cx="95" cy="250" rx="22" ry="88"/><ellipse cx="290" cy="250" rx="22" ry="88"/>`+line(95,162,290,162)+line(95,338,290,338)+dim([O[0],410],[590,410])+V(515,438,'L');
 for(const [x,y] of [[125,190],[178,220],[115,280],[185,310]])s+=dot(x,y)+arrow([x+9,y],[x+56,y]);
 s+=vec(205,132,'v')+VS(347,226,'R','0')+dim([317,250],[317,162])+arrow(O,[477,287],'class="axis"')+V(496,298,'R')+circle(440,250,8,'fill="white"')+circle(440,250,2.5,'fill="#18334c"')+V(465,245,'z')+V(419,279,'O')+T(192,385,'一様な小球流（数密度 n）');return s;
}
function wallFront(){const O=[310,260];return circle(...O,145)+circle(...O,72,'fill="#eef3f6"')+arrow([105,260],[555,260],'class="axis"')+arrow([310,445],[310,65],'class="axis"')+V(572,268,'z')+V(310,44,'y')+dim(O,[310+145*.7,260-145*.7])+VS(418,208,'R','1')+dim(O,[238,260])+V(272,288,'R')+circle(...O,9,'fill="white"')+line(304,254,316,266)+line(304,266,316,254)+V(331,285,'B')+V(283,237,'x')+T(325,482,'x の正の向き：紙面の表から裏へ');}
function countCylinder(){return hatch+`<ellipse cx="145" cy="230" rx="38" ry="90" fill="url(#hatch)"/>`+rect(145,140,285,180,'fill="url(#hatch)" stroke="none"')+line(145,140,430,140)+line(145,320,430,320)+`<ellipse cx="430" cy="230" rx="38" ry="90" fill="#edf3f7"/>`+circle(570,230,90,'fill="#f6f8fa"')+arrow([470,230],[550,230],'class="axis"')+dim([145,90],[430,90])+M(285,69,mi('v'),rm('Δ'),mi('t'))+dim([430,230],[430,140])+V(450,198,'R')+T(315,385,'断面積 πR² × 長さ vΔt の領域')+M(315,421,mi('N'),rm(' = π'),mi('R'),rm('²'),mi('vn'),rm('Δ'),mi('t'));}
function arrivals(){
 const O=[320,220],R=135,k1=Math.SQRT1_2,k2=Math.sqrt(3)/2;
 let s=circle(...O,R,'fill="#dce9f4"')+circle(...O,R*k2,'fill="#f5ebd3"')+circle(...O,R*k1,'fill="#fff"')+guide([140,220],[505,220])+guide([320,60],[320,380])+dot(...O)+V(302,246,'O');
 s+=dim(O,[320+R,220])+V(489,242,'R')+line(320-R*k1,220,170,408,'class="guide"')+M(153,440,mi('a'),rm(' = (√2/2)'),mi('R'))+line(320+R*k2,220,490,408,'class="guide"')+M(511,440,mi('a'),rm(' = (√3/2)'),mi('R'));
 s+=T(320,30,'球に衝突する小球の、入射前の断面');
 s+=rect(75,475,17,17,'fill="white"')+text(109,490,'内側：衝突後、壁には届かない');
 s+=rect(75,513,17,17,'fill="#f5ebd3"')+text(109,528,'中間の環：壁の半径 R₁ より外に到達');
 s+=rect(75,551,17,17,'fill="#dce9f4"')+text(109,566,'外側の環：壁の半径 R と R₁ の間に到達');
 s+=T(320,612,'a > R の小球は球に衝突せず、集計には含めない');return s;
}
function conicFigure(detailed=false){
 const o=orbit(),O=detailed?[300,390]:[445,380],scale=detailed?48:75,tP=detailed?1.03:1.4,to=p=>[O[0]+scale*p[0],O[1]-scale*p[1]],D=to(o.point(0)),K=to(o.K),X=detailed?7.3:2.4,F=to([X,o.b]),H=to([X,o.outY(X)]),P=to(o.point(tP));
 const farX=detailed?-5.25:-5.2,topY=to([0,o.b])[1];
 let s=axes(O,30,675,62,510)+path(sample(t=>to(o.point(t)),1.6,detailed?-1.78:-.72),'stroke="#b28736" stroke-width="2.7"')+guide(to([farX,o.b]),to([X,o.b]))+T(145,topY-44,'直線1')+circle(...O,8,'fill="#eddeb9"')+T(O[0]+51,O[1]+28,'太陽');
 const vt=o.tangent(tP),sv=[vt[0],-vt[1]],rad=unit([O[0]-P[0],O[1]-P[1]]);
 s+=guide(O,P)+dot(...P)+V(P[0]-18,P[1]+26,'P')+arrow(P,add(P,mul(sv,83)))+vec(P[0]+62,P[1]-30,'v')+V((O[0]+P[0])/2-26,(O[1]+P[1])/2+19,'r');
 s+=dot(...D)+guide(O,D);
 s+=arrow(to([farX,o.b]),to([farX+1.05,o.b]))+VS(106,topY-13,'v','0')+dim([42,O[1]],[42,topY])+V(25,(O[1]+topY)/2+8,'b');
 if(detailed){s+=guide(H,to([-.3,o.outY(-.3)]))+line(F[0],72,F[0],533,'stroke="#a9b7c2" stroke-width="3"')+T(F[0],45,'平面1')+V(F[0]+19,F[1]-7,'F')+V(H[0]+19,H[1]+6,'H')+V(F[0],563,'X')+dot(...K)+V(K[0]+22,K[1]-18,'K')+guide(O,to(mul(o.d,6.1)))+T(421,95,'直線2')+T(530,510,'直線3')+arc(O,43,0,o.theta2)+VS(O[0]+65,O[1]-15,'θ','2')+arc(O,91,0,Math.atan2(o.point(tP)[1],o.point(tP)[0]))+V(O[0]+104,O[1]-9,'θ')+arc(K,58,-o.beta,0)+V(K[0]+78,K[1]+20,'β')+right(F,K,H)+line(D[0]+4,D[1]+8,340,320,'class="axis"')+V(342,348,'D');}
 else {const angleRad=Math.atan2(-rad[1],rad[0]),angleV=Math.atan2(-sv[1],sv[0]);s+=arrow(P,add(P,mul(rad,75)),'class="accent"')+VS(P[0]+9,P[1]+87,'v','r')+arc(P,46,angleRad,angleV)+line(P[0]+55,P[1]+16,P[0]+75,P[1]+63,'class="axis"')+V(P[0]+86,P[1]+90,'ϕ')+V(D[0]+22,D[1]+33,'D')+VS(D[0]+44,(D[1]+O[1])/2+7,'r','2')+T(340,544,'軌道は条件を満たす一例。距離・偏向角は模式的。');}
 return s;
}
function area(){
 const O=[120,330],P=[365,130],v=[120,35],Q=add(P,v),rad=unit([O[0]-P[0],O[1]-P[1]]),proj=add(P,mul(rad,v[0]*rad[0]+v[1]*rad[1]));
 let s=path([O,P,Q,O],'fill="#e9f0f5"')+arrow(P,Q)+guide(Q,proj)+right(proj,P,Q)+dot(...O)+dot(...P)+V(99,350,'O')+V(P[0]-18,P[1]-18,'P')+V(222,219,'r')+M(480,80,mi('v'),rm('Δ'),mi('t'))+M(474,267,mi('v'),rm('Δ'),mi('t'),rm(' sin '),mi('ϕ'))+M(310,226,rm('Δ'),mi('A'));
 const a=Math.atan2(-rad[1],rad[0]),b=Math.atan2(-v[1],v[0]);s+=arc(P,43,a,b)+V(P[0]+16,P[1]+60,'ϕ');
 s+=T(315,34,'十分短い時間 Δt に掃く面積')+M(320,398,rm('Δ'),mi('A'),rm(' ≈ (1/2)'),mi('rv'),rm(' sin '),mi('ϕ'),rm(' Δ'),mi('t'))+M(320,442,mi('S'),rm(' = (1/2)'),mi('rv'),rm(' sin '),mi('ϕ'));
 return s;
}
function symmetry(){
 const theta=75*Math.PI/180,beta=Math.PI-2*theta,O=[215,360],K=[280,117.4],X=590,F=[X,K[1]],H=[X,K[1]+(X-K[0])*Math.tan(beta)];
 let s=axes(O,70,622,38,426)+guide([65,K[1]],F)+guide([140,K[1]-(K[0]-140)*Math.tan(beta)],H)+guide(O,[303,32])+line(X,55,X,425)+dot(...K)+V(K[0]-20,K[1]+25,'K')+V(X+17,F[1]+3,'F')+V(X+17,H[1]+6,'H')+T(315,25,'直線2')+T(104,106,'直線1')+T(508,290,'直線3')+right(F,K,H);
 s+=arc(O,43,0,theta)+VS(285,344,'θ','2')+arc(K,43,-beta,0)+V(K[0]+63,K[1]+22,'β')+arc(K,35,theta,Math.PI-beta)+VS(K[0]-9,K[1]-48,'θ','2')+arc(K,59,0,theta)+VS(K[0]+60,K[1]-44,'θ','2')+M(320,477,rm('2'),mi('θ'),sub('2'),rm(' + '),mi('β'),rm(' = π'));
 return s;
}
function battery(x,y){return line(x-45,y,x-8,y)+line(x+8,y,x+45,y)+line(x-8,y-24,x-8,y+24)+line(x+8,y-13,x+8,y+13)+M(x-28,y-29,rm('+'))+M(x+29,y-24,rm('−'))+V(x,y+49,'V');}
function ac(x,y){return circle(x,y,19)+path(sample(t=>[x-12+t*24,y-7*Math.sin(2*Math.PI*t)],0,1));}
function capacitor(x,y,dielectric=false,label='C'){
 let s=line(x-80,y,x-18,y)+line(x+18,y,x+80,y)+line(x-18,y-39,x-18,y+39)+line(x+18,y-39,x+18,y+39);
 if(dielectric)s+=rect(x-16,y-38,32,76,'fill="#eadbb9" stroke="none"');
 return s+(label==='C0'?VS(x,y-59,'C','0'):V(x,y-59,label));
}
function dielectricPair(){let s='';for(let i=0;i<2;i++){const x=175+i*315,y=162;s+=T(x,36,i?'誘電体を挿入（電池は接続したまま）':'挿入前（真空）')+capacitor(x,y,!!i,'C0')+line(x-80,y,x-80,320)+line(x+80,y,x+80,320)+line(x-80,320,x-45,320)+line(x+45,320,x+80,320)+battery(x,320)+dim([x-18,231],[x+18,231])+V(x,261,'d');if(i)s+=VS(x+51,y+20,'ε','r');}return s;}
function circuit({physical=false,extra=false,question=false}={}){
 const left=125,rightX=515,cx=320,top=115,bot=410,branches=extra?[115,235,320]:[115,265];
 let s=line(left,top,left,bot)+line(rightX,top,rightX,bot)+line(left,bot,cx-19,bot)+line(cx+19,bot,rightX,bot)+ac(cx,bot);
 s+=line(left,top,cx-80,top)+capacitor(cx,top,physical,physical?'C0':'C')+line(cx+80,top,rightX,top);
 if(physical)s+=T(cx+92,183,'誘電体');
 if(!physical||extra){const y=branches[1];s+=line(left,y,cx-45,y)+rect(cx-45,y-12,90,24,'fill="white"')+line(cx+45,y,rightX,y)+V(cx,y+(extra?45:63),physical?'r':'R');}
 if(extra&&!physical){const y=branches[2];s+=line(left,y,cx-45,y)+rect(cx-45,y-12,90,24,'fill="white"')+line(cx+45,y,rightX,y)+V(cx,y+42,'r');}
 s+=dot(left,bot)+dot(rightX,bot)+V(left,459,'a')+V(rightX,459,'b')+M(cx,488,mi('V'),rm(' = '),mi('V'),sub('0'),rm(' sin('),mi('ω'),sub('δ'),mi('t'),rm(')'));
 s+=arrow([92,365],[92,293])+V(67,334,'I');
 if(!question&&!physical){s+=arrow([165,87],[230,87])+VS(191,63,'I','C')+arrow([165,branches[1]-28],[230,branches[1]-28])+VS(190,branches[1]-50,'I','R');}
 return s;
}
function phasor(){
 // x is chosen along V, so IR is horizontal and IC leads by pi/2.
 const O=[190,340],IR=[112,0],IC=[0,-235],I=add(IR,IC),r=46;
 let s=arrow([90,340],[555,340],'class="axis"')+arrow([190,400],[190,47],'class="axis"')+V(577,348,'x')+V(190,30,'y')+V(167,365,'O')+arrow(O,add(O,IR))+arrow(O,add(O,IC))+arrow(O,add(O,I),'class="accent"')+arrow([190,373],[442,373])+vec(463,389,'V')+vec(271,320,'I','R')+vec(159,121,'I','C')+vec(329,88,'I')+guide(add(O,IR),add(O,I))+guide(add(O,IC),add(O,I))+right(O,add(O,IR),add(O,IC));
 s+=arc(O,r,Math.atan2(-I[1],I[0]),Math.PI/2)+V(213,251,'δ')+T(333,450,'電圧を基準に、電流ベクトルを並べた図')+T(320,491,'合成電流は、二つの枝電流のベクトル和');return s;
}
// The visible vector arrows are drawn separately above each label.

export function buildFigures(){
 const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('q-i-a-fig1a',680,480,'原点Oを中心とする半径Rの球へ、距離aの水平線に沿い小球が入射する。点Aから反射し、x=Lの壁の点Cへ向かう例。角度θAとα、BとCを示す。','図1a：球への入射と壁への到達（配置の一例）',scatter());
 pack.add('q-i-a-fig1b',660,430,'点Aでの接平面に対する斜め衝突。入射速度は水平右向き、反射後の速度は右上向き。法線と入射側のなす角がθA、反射速度と水平右向きのなす角がα。','図1b：接平面での弾性衝突',floorCollision());
 pack.add('q-i-b-fig2',680,470,'半径R0の円柱を満たす一様な小球流が、半径Rの球へx正方向に進む。壁はx=L。yは上、zは紙面から手前。','図2：一様な小球流と球・壁の配置',flow());
 pack.add('q-i-b-fig3',640,505,'壁面を正面から見た図。Bを中心に半径RとR1の同心円がある。y正方向は上、z正方向は右、x正方向は紙面の奥。','図3：壁面上の二つの円（半径比は模式的）',wallFront());
 pack.add('q-i-c-fig4',720,570,'太陽Oへ接近する双曲線軌道の一例。遠方で速度v0、x軸からの距離b。点Pの半径r、接線速度v、内向き成分vrと角ϕ、近日点Dの距離r2を区別する。','図4：接線速度と内向き成分（軌道は模式例）',conicFigure());
 pack.add('q-i-c-fig5',720,585,'直線1と3は双曲線の入射・出射漸近線で、ODを通る直線2に関して対称。Kは漸近線の交点、FとHはx=X平面との交点。β、θ、θ2を示す。','図5：軌道・対称軸・遠方平面（偏向角は拡大）',conicFigure(true));
 pack.add('q-ii-a-fig1',680,405,'同じ電池Vを接続した平行板コンデンサー。左は真空、右は厚さdの誘電体が隙間なく入る。C0は挿入前の容量、εrは比誘電率。','図1：電池につないだまま誘電体を挿入',dielectricPair());
 pack.add('q-ii-b-fig2-3',680,950,'上段は誘電体入りの実コンデンサーと、その損失を表すCとRの並列等価回路。下段は電圧と同相のIR、90度進むIC、合成IとICの間の遅れδ。aはbに対して正。','図2・3：実素子と等価回路、電流の位相（δは拡大）',T(177,27,'誘電体入りの実素子')+T(500,27,'RC並列等価回路')+`<style>#mini text{font-size:32px}#mini text.math{font-size:40px}</style><g id="mini"><g transform="translate(5 35) scale(.5)">${circuit({physical:true,question:true})}</g><g transform="translate(330 35) scale(.5)">${circuit({question:true})}</g></g>`+arrow([315,176],[342,176])+`<g transform="translate(0 300)">${phasor()}</g>`+T(320,860,'C は理想容量、R が誘電損失を表す')+T(320,905,'ベクトルの向きは電圧を基準に回転して表示'));
 pack.add('q-ii-c-fig4',640,520,'誘電体入りの実コンデンサーと追加抵抗rを交流電源に並列接続。内部損失はこの実素子に含まれ、図ではまだRへ展開していない。','図4：誘電体入り実素子と追加抵抗 r',circuit({physical:true,extra:true,question:true}));
 pack.add('a-i-a-q2-collision',660,435,'接平面で接線成分は変わらず、法線成分は−v cosθAからv cosθAへ反転する。二つの角θAと反射方向の角αが一直線を分ける。','弾性衝突：法線・接線方向に分ける',floorCollision(true));
 pack.add('a-i-a-q4-wall-condition',680,495,'入射距離a=R/√2では反射速度が鉛直となり、右側の壁に届かない。これより大きくR未満の距離から衝突した小球のみ右へ進む。','壁に到達する条件の境界',wallThreshold());
 pack.add('a-i-a-q5-wall-distance',680,480,'PはAからy軸へ下ろした水平線の足、Qはその水平線と壁の交点。BQ=R sinθA、AQ=OB+AP=L+R cosθA、BC=BQ+QC。','壁までの水平距離と高さを分ける',scatter(true));
 pack.add('a-i-b-q8-cylinder',700,450,'時間Δtに球へ入る粒子を数えるための円柱。半径R、長さvΔt、数密度n。体積にnを掛ければπR²vnΔt個となる。','衝突個数：断面積 × 通過距離 × 数密度',countCylinder());
 pack.add('a-i-b-q9-q10-arrivals',650,635,'入射断面をa=R/√2、a=√3R/2、a=Rで区分。内側は壁に届かず、中間の環は壁上の半径R1の外、外側の環は半径RとR1の間へ届く。a>Rは未衝突なので数えない。','入射側の環状領域と壁上の到達範囲',arrivals());
 pack.add('a-i-c-q12-area',640,480,'十分短い時間ΔtにPから接線方向へvΔt進む近似図。Oからの距離rに垂直な移動成分はvΔt sinϕ。微小面積をΔtで割る極限が面積速度S。','微小三角形から面積速度を求める',area());
 pack.add('a-i-c-q17-symmetry',660,510,'入射・出射漸近線は直線2に関して鏡映対称。Kに集まる角から2θ2+β=πとなる。FはKと同じ高さ、Hは出射漸近線と平面の交点。','対称性から θ₂ と β を対応させる',symmetry());
 pack.add('a-ii-b-q6-equivalent',640,520,'同じa,b端子間に理想容量Cと損失抵抗Rを並列接続。電流ICとIRはa側からb側へ流れ、供給電流Iはその和。','損失抵抗 R と理想容量 C の並列等価回路',circuit());
 pack.add('a-ii-b-q7-phasor',640,525,'電圧Vを横方向の基準とする。抵抗電流IRはVと同相、容量電流ICは90度進む。I=IC+IRで、ICからIへの遅れがδ。','電流の直交成分と位相の遅れ δ（拡大）',phasor());
 pack.add('a-ii-c-q10-circuit',640,520,'a,b端子間へ理想容量C、誘電損失抵抗R、追加抵抗rをすべて並列に接続。電力はRとrで消費され、理想容量Cの周期平均消費電力は0。','実コンデンサーを C と R に分け、r を加える',circuit({extra:true}));
 return pack.save('問題条件と独立計算から19図を再構成。元HTMLの角度・符号・空欄因子・解説の転記を修復待ち。原図は埋め込まず、問題図に未指定の解答値を追加しない。人間編集保護を維持。');
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)buildFigures();
