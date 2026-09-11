// Independent schematic constructions from the stated geometry and equations.
// No source pixels are embedded or traced. Source defects remain review-gated.
import {pathToFileURL} from 'node:url';
import {createSvgPackage,mi,rm,sub,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='kindai-2025-general-first-a-physics';
const c=(x,y,r,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" ${extra}/>`;
const rect=(x,y,w,h,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" ${extra}/>`;
const arrow=(a,b,extra='')=>line(...a,...b,`marker-end="url(#arrow)" ${extra}`);
const path=(pts,extra='')=>`<path d="${pointsPath(pts)}" ${extra}/>`;
const M=(x,y,...parts)=>math(x,y,parts,'text-anchor="middle"');
const V=(x,y,v)=>M(x,y,mi(v));
const label=(x,y,t)=>text(x,y,t,'text-anchor="middle"');
const num=(x,y,n)=>M(x,y,rm(n));
const small=(x,y,t)=>text(x,y,t,'font-size="16"');
const vsub=(x,y,v,s)=>M(x,y,mi(v),sub(s));
const guide=(a,b)=>line(...a,...b,'class="guide"');
const sample=(fn,a,b,n=80)=>Array.from({length:n+1},(_,i)=>fn(a+(b-a)*i/n));
const arc=(x,y,r,a,b,extra='')=>path(sample(t=>[x+r*Math.cos(t),y+r*Math.sin(t)],a,b,32),extra);
const unit=v=>{const n=Math.hypot(...v);return v.map(x=>x/n);};
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const mul=(a,k)=>a.map(v=>v*k);
const body=(p,n,dx=0,dy=-20)=>c(...p,10,'fill="#e5edf3"')+num(p[0]+dx,p[1]+dy,n);
const into=(x,y)=>c(x,y,8,'fill="white"')+line(x-5,y-5,x+5,y+5)+line(x-5,y+5,x+5,y-5);
const out=(x,y)=>c(x,y,8,'fill="white"')+c(x,y,2.5,'fill="#18334c"');
const dim=(a,b)=>line(...a,...b,'class="axis" marker-start="url(#arrow)" marker-end="url(#arrow)"');
function spring(a,b){const u=unit([b[0]-a[0],b[1]-a[1]]),v=[-u[1],u[0]],len=Math.hypot(b[0]-a[0],b[1]-a[1]);const pts=[a,add(a,mul(u,16))];for(let i=0;i<=18;i++)pts.push(add(add(a,mul(u,20+(len-40)*i/18)),mul(v,i%2?5:-5)));pts.push(add(b,mul(u,-16)),b);return path(pts);}
function rightAngle(p,a,b){const u=mul(unit([a[0]-p[0],a[1]-p[1]]),10),v=mul(unit([b[0]-p[0],b[1]-p[1]]),10);return path([add(p,u),add(add(p,u),v),add(p,v)]);}
export function springGeometry(){const O=[310,360],Op=[310,405],Q=[310,130],t1=.57,t2=.42;const P=[310-230*Math.cos(t1)*Math.sin(t1),360-230*Math.cos(t1)**2];const R=[310+275*Math.cos(t2)*Math.sin(t2),405-275*Math.cos(t2)**2];return {O,Op,Q,P,R,t1,t2};}
export function ringPoints(r=150,theta=Math.PI/6){return [-1,0,1].map(i=>[r*Math.sin(i*theta),r*Math.cos(i*theta)]);}
export function magneticMotion({m=2,q=1,B=1,v0=4,E=1,d=2,L=8}={}){
 const R=m*v0/(q*B);if(!(d>0&&d<R))throw Error('The ion must cross x=d before a quarter turn');
 const phi=Math.asin(d/R),l=R*phi,t=l/v0,vx=v0*Math.cos(phi),vz=v0*Math.sin(phi),vy=q*E*t/m;
 return {R,phi,l,t,vx,vy,vz,z1:R*(1-Math.cos(phi)),z2:L*Math.tan(phi),y1:q*E*t*t/(2*m),y2:vy*L/vx};
}
export const isotopeCandidates={
 points:[['ア',.62,1.4],['イ',Math.sqrt(1.4),1.4],['ウ',1.43,1.4],['エ',.62,1],['オ',1.43,1],['カ',.62,.6],['キ',Math.sqrt(.6),.6],['ク',1.43,.6]],
 // Only relations are prescribed in the source: shifted/not through O or
 // steeper/flatter through O. Coefficients are illustrative, not measured data.
 curves:[['ケ',z=>z*z+.22],['コ',z=>1.1*z*z],['サ',z=>.9*z*z],['シ',z=>(z-.34)**2]],
};
export function focusingGeometry(){const O=[65,310],F=[645,260],P=[310,170],Q=[400,194];const angle=p=>Math.atan2(O[1]-p[1],p[0]-O[0]);const bend=p=>angle(p)+Math.atan2(F[1]-p[1],F[0]-p[0]);return {O,F,P,Q,theta:angle(P),thetaFast:angle(Q),phi:bend(P),phiFast:bend(Q)};}

function lineSprings(answer=false){const P=[160,150],Q=[340,150],R=[540,150];return arrow([55,150],[650,150],'class="axis"')+arrow([65,190],[65,50],'class="axis"')+V(662,158,'x')+V(65,38,'y')+V(45,178,'O')+spring(P,Q)+spring(Q,R)+[P,Q,R].map((p,i)=>body(p,i+1)+M(p[0],74,mi(['P','Q','R'][i]),rm('('),mi('x'),sub(i+1),rm(', 0)'))).join('')+label(250,113,'ばね1')+label(440,113,'ばね2')+V(208,260,'k')+text(228,260,'：ばね定数')+V(405,260,'l')+text(425,260,'：自然長')+arrow([325,192],[265,192],'class="accent"')+arrow([355,192],[415,192],'class="accent"')+vsub(276,226,'F',answer?'1x':'1')+vsub(412,226,'F',answer?'2x':'2')+(answer?label(340,297,'左向きの成分は負、右向きの成分は正'):label(340,297,'小物体の質量はすべて m（位置・長さは模式的）'));}
function ringDiagram(answer=false){const ox=300,oy=290,r=155,t=Math.PI/6,P=ringPoints(r,t).map(([x,y])=>[ox+x,oy-y]);let s=c(ox,oy,r,'stroke="#9eb0bd"')+c(ox,oy,125,'class="guide"')+arrow([95,oy],[630,oy],'class="axis"')+arrow([ox,445],[ox,55],'class="axis"')+V(644,297,'x')+V(300,40,'y')+V(279,312,'O');
 for(let i=0;i<12;i++){const a=i*t-t,b=a+t,pa=[ox+r*Math.sin(a),oy-r*Math.cos(a)],pb=[ox+r*Math.sin(b),oy-r*Math.cos(b)];s+=spring(pa,pb);if(i>2)s+=c(...pa,5,'fill="#e5edf3"');}
 s+=P.map((p,i)=>guide([ox,oy],p)+body(p,i+1,[-29,-23,29][i],[-20,-46,-20][i])).join('');
 s+=arrow([300,125],[300,80],'class="accent"')+vsub(337,102,'f','p')+arrow([315,147],[315,210])+vsub(380,229,'f','k')+line(357,220,322,207,'class="guide"');
 s+=arc(ox,oy,55,-Math.PI/2-t,-Math.PI/2)+arc(ox,oy,82,-Math.PI/2,-Math.PI/2+t)+V(282,220,'θ')+V(337,191,'θ');
 const A=[ox-r*Math.sin(t/2),oy-r*Math.cos(t/2)],B=[ox+r*Math.sin(t/2),A[1]];
 s+=dot(...A)+dot(...B)+V(A[0]-9,A[1]-26,'A')+V(B[0]+37,B[1]-26,'B');
 s+=guide(P[0],[515,P[0][1]])+guide(P[1],[565,P[1][1]])+dim([515,oy],[515,P[0][1]])+dim([565,oy],[565,P[1][1]])+M(495,235,mi('y'),sub(1),rm(', '),mi('y'),sub(3))+vsub(593,220,'y',2);
 s+=dim([ox,oy+25],[ox+125,oy+25])+vsub(362,346,'r',0)+V(463,325,'r')+line(455,308,448,294);
 s+=M(157,94,mi('p'),sub('out'))+M(211,366,mi('p'),sub('in'))+label(340,488,answer?'半径と y 座標の関係（角度・伸びは誇張）':'円環の一部をばねと小物体で表す（模式図）');
 return s;
}
function magneticPanel(ox=95,oy=100,scale=1,answer=false){
 const R=215*scale,phi=.66,d=R*Math.sin(phi),z=R*(1-Math.cos(phi)),L=245*scale,px=ox+d,py=oy+z,fx=px+L,fy=py+L*Math.tan(phi),cy=oy+R;
 let s=rect(ox,oy,d,150*scale,'fill="#f0f4f7" stroke="#b9c8d3"')+arrow([ox-15,oy],[fx+20,oy],'class="axis"')+arrow([ox,oy-15],[ox,cy+30],'class="axis"')+V(fx+34,oy-12,'x')+V(ox,cy+53,'z')+out(ox,oy)+V(ox-23,oy-8,'y')+V(ox-21,oy+26,'O');
 s+=path(sample(a=>[ox+R*Math.sin(a),cy-R*Math.cos(a)],0,phi),'class="accent"')+arrow([px,py],[fx,fy],'class="accent"')+guide([ox,cy],[px,py])+dot(ox,cy)+V(ox-25,oy+R/2,'R');
 s+=dim([ox,oy-35],[px,oy-35])+V((ox+px)/2,oy-47,'d')+dim([px,oy-35],[fx,oy-35])+V((px+fx)/2,oy-47,'L');
 s+=dim([ox-45,oy],[ox-45,oy+150*scale])+V(ox-67,oy+75*scale+9,'D');
 s+=line(fx,oy-10,fx,fy+24)+label(fx,fy+53,'フィルム')+guide([px,oy],[px,py]);
 const ph=answer?'ϕ′':'ϕ';s+=arc(px,py,48,0,phi)+V(px+67,py+25,ph)+arc(ox,cy,42,-Math.PI/2,-Math.PI/2+phi)+V(ox+28,cy-54,ph)+V(ox+d/2,oy+z/2-18,'l');
 s+=arrow([ox+20,oy+16],[ox+67,oy+16])+vsub(ox+48,oy+48,'v',0)+label(ox+d/2,oy+127*scale,'領域A');
 if(answer)s+=guide([px,py],[fx,py])+vsub(fx+35,oy+z/2,'z',1)+vsub(fx+35,(py+fy)/2,'z',2)+label(325,440,'xz 平面への射影：+y が手前');
 return s;
}
export function buildFigures(){const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('q1-spring-line',700,315,'x軸上でP、Q、Rの順に並ぶ質量mの小物体を、伸びたばね1と2がつなぐ。Qへの力は左向きと右向き。','図1｜一直線上のばねと小物体',lineSprings());
 pack.add('ans-a1-spring-force',700,315,'中央の小物体に対し、左ばねの力は負のx方向、右ばねの力は正のx方向。両者を符号付き成分で加える。','ばね力の向きと成分',lineSprings(true));
 {
 const {O,Op,Q,P,R,t1,t2}=springGeometry();let s=arrow([90,360],[590,360],'class="axis"')+arrow([310,425],[310,55],'class="axis"')+V(607,370,'x')+V(310,38,'y')+V(287,384,'O')+M(341,421,mi('O'),rm('′'));
 s+=line(...O,...P)+line(...Op,...R)+spring(P,Q)+spring(Q,R)+rightAngle(P,O,Q)+rightAngle(R,Op,Q)+body(P,1)+body(Q,2,-26,-18)+body(R,3);
 s+=M(150,166,mi('P'),rm('('),mi('x'),sub(1),rm(', '),mi('y'),sub(1),rm(')'))+M(389,75,mi('Q'),rm('(0, '),mi('y'),sub(2),rm(')'))+M(508,163,mi('R'),rm('('),mi('x'),sub(3),rm(', '),mi('y'),sub(3),rm(')'));
 s+=arc(...O,48,-Math.PI/2-t1,-Math.PI/2)+arc(...Op,61,-Math.PI/2,-Math.PI/2+t2)+vsub(295,291,'θ',1)+vsub(331,322,'θ',2)+label(210,116,'ばね1')+label(455,111,'ばね2')+arrow([310,146],[310,218],'class="accent"')+vsub(342,222,'f','y')+label(340,468,'原本の直角条件を満たす配置（長さ・角度は模式的）');
 pack.add('q1-spring-angles',680,500,'Qはy軸上。OPとPQ、O′RとRQがそれぞれ直交し、OとO′で定めた角がθ1とθ2。原本の条件から構成した模式図。','図2｜斜めのばねと角度',s);
 }
 {
 let s=label(160,32,'(a) 円筒状の薄膜')+label(515,32,'(b) 半径方向の変化');
 s+=`<ellipse cx="150" cy="110" rx="63" ry="23" fill="#f4f7f9"/>`+line(87,110,87,353)+line(213,110,213,353)+`<ellipse cx="150" cy="353" rx="63" ry="23"/>`+guide([150,68],[150,386])+label(150,74,'上面：ゴム膜')+label(150,415,'下面：ゴム膜')+label(150,250,'気体')+arrow([235,344],[235,122])+text(248,238,'長さは一定')+arrow([150,110],[206,110])+label(280,87,'半径方向');
 const O=[510,207];s+=c(...O,66,'class="guide"')+c(...O,102,'stroke="#557b94" stroke-dasharray="9 4"')+c(...O,122,'class="accent"')+label(510,214,'気体');for(let i=0;i<8;i++){const t=i*Math.PI/4;s+=arrow([510+121*Math.cos(t),207+121*Math.sin(t)],[510+104*Math.cos(t),207+104*Math.sin(t)]);}
 s+=line(384,381,414,381,'class="guide"')+text(425,387,'封入前')+line(384,413,414,413,'stroke="#557b94" stroke-dasharray="9 4"')+text(425,419,'封入後の静止半径')+line(384,445,414,445,'class="accent"')+text(425,451,'引き伸ばした直後')+label(510,351,'矢印：放した直後の運動');
 pack.add('q1-membrane-setup',710,480,'長さ一定の円筒薄膜。封入前、封入後につり合った半径、さらに引き伸ばした半径を区別し、放すと初めは内向きに動く。変化は誇張。','図3｜円筒状薄膜と半径の変化（模式図）',s);
 }
 {
 // Split spatial model: xy cross-section + unrolled unit-length patch.
 const O=[195,260],r=133,t=Math.PI/6,p=ringPoints(r,t).map(([x,y])=>[O[0]+x,O[1]-y]);let s=label(195,35,'xy 平面の断面')+label(526,35,'面 CDEF の展開図');
 s+=c(...O,r,'stroke="#9eb0bd"')+arrow([30,260],[366,260],'class="axis"')+arrow([195,410],[195,71],'class="axis"')+V(376,270,'x')+V(195,59,'y')+V(176,285,'O');
 s+=spring(p[0],p[1])+spring(p[1],p[2])+p.map((q,i)=>guide(O,q)+body(q,i+1,[-26,-25,26][i],[4,-19,4][i])).join('');
 const A=[O[0]-r*Math.sin(t/2),O[1]-r*Math.cos(t/2)],B=[O[0]+r*Math.sin(t/2),A[1]];
 s+=guide(O,A)+guide(O,B)+dot(...A)+dot(...B)+V(A[0]-17,A[1]-25,'A')+V(B[0]+17,B[1]-25,'B')+arc(...O,65,-Math.PI/2-t/2,-Math.PI/2+t/2)+V(246,196,'θ')+line(232,190,209,195,'class="guide"')+V(291,236,'r');
 s+=rect(442,116,170,245,'fill="#eef3f6"')+guide([430,239],[628,239])+dot(442,239)+dot(612,239)+body([527,239],2)+V(428,106,'C')+V(625,106,'D')+V(625,389,'E')+V(428,389,'F')+V(422,246,'A')+V(637,246,'B')+dim([657,116],[657,361])+num(678,246,'1');
 s+=small(470,95,'z = 0.5')+small(467,413,'z = −0.5')+label(522,447,'AB は円筒面と z = 0 の交線')+label(195,447,'各部分の中心に質量 m の小物体');
 pack.add('q1-membrane-model',710,485,'円周を等分した各円筒面部分を質量mの小物体へ置き換える。小物体2はy軸上。面CDEFの高さは1、ABはz=0の交線。右は曲面の展開図。','図4｜円環モデルと単位長さの面（模式図）',s);
 }
 pack.add('q1-membrane-forces',680,510,'円環上の小物体1と3はy軸に対称。小物体2には外向きの圧力差の力fpと内向きのばね合力fkが働く。実半径rとつり合い半径r0を区別する。','図5｜小物体2に働く力',ringDiagram());
 pack.add('ans-a2-membrane-force',680,510,'半径rの円環上に小物体1、2、3を配置。隣接する半径のなす角はθで、y座標を射影して比べる。圧力差の力は外向き、ばね力は内向き。','円環の幾何と半径方向の力',ringDiagram(true));
 {
 let s=label(345,32,'図1　トムソン型の配置（xy 平面）')+rect(100,110,150,45,'fill="#e5edf3"')+rect(100,285,150,45,'fill="#e5edf3"')+num(175,141,'S')+num(175,315,'N')+line(100,166,250,166)+line(100,270,250,270)+arrow([90,220],[627,220],'class="axis"')+arrow([100,295],[100,65],'class="axis"')+V(641,230,'x')+V(100,52,'y')+out(100,220)+V(81,242,'z')+V(78,211,'O')+arrow([120,220],[184,220])+vsub(153,208,'v',0)+label(192,255,'領域A');
 s+=arrow([224,250],[224,183],'class="accent"')+M(280,196,mi('E'),rm(', '),mi('B'))+label(377,291,'電場・磁場はともに +y 向き')+line(590,151,590,274)+label(568,315,'感光フィルム')+dim([100,86],[250,86])+V(175,72,'d')+dim([250,86],[590,86])+V(420,72,'L');
 s+=line(40,370,655,370,'stroke="#d5dfe6"')+label(344,409,'図2(a) 電場のみ：xy 平面');
 s+=arrow([80,594],[612,594],'class="axis"')+arrow([100,639],[100,440],'class="axis"')+V(628,602,'x')+V(100,430,'y')+out(100,594)+V(78,618,'z')+V(77,578,'O')+line(100,455,300,455)+line(100,632,300,632)+guide([300,455],[300,632]);
 const epts=sample(x=>[100+x,594-.0014*x*x],0,200);s+=path(epts,'class="accent"')+arrow([300,538],[520,414.8],'class="accent"')+guide([300,538],[416,538])+arc(300,538,66,-Math.atan(.56),0)+V(387,519,'θ')+dim([100,662],[300,662])+V(204,651,'d');
 s+=line(40,706,655,706,'stroke="#d5dfe6"')+label(344,746,'図2(b) 磁場のみ：xz 平面（+y が手前）');
 s+=`<g transform="translate(0 700)">${magneticPanel(105,118,.9,false)}</g>`;
 pack.add('q2-apparatus-diagrams',700,1150,'図1はEとBがともに+y方向のトムソン型配置。図2(a)はxy平面の電場偏向、図2(b)はxz平面の円弧と出口後の直進。座標と角度の定義を分けて示す。','図1・図2｜質量分析器と2方向の偏向（模式図）',s);
 }
 {
 let s=label(190,38,'(a) 速さを変えたときの候補')+label(550,38,'(b) 同位体の曲線の候補');
 for(const ox of [65,415]){s+=arrow([ox,405],[ox+270,405],'class="axis"')+arrow([ox,405],[ox,80],'class="axis"')+V(ox+283,414,'z')+V(ox,67,'y')+into(ox,405)+V(ox-20,421,'x')+M(ox+55,450,rm('('),mi('d'),rm('+'),mi('L'),rm(', 0, 0)'));const pts=sample(z=>[ox+166*z,405-185*z*z],0,Math.sqrt(1.5));s+=path(pts,'stroke-width="2.8"')+rect(ox+162,216,8,8,'fill="#18334c"');}
 for(const [name,z,y]of isotopeCandidates.points){const x=65+166*z,sy=405-185*y;s+=c(x,sy,4.5,'fill="white"')+text(x-17,sy-13,name);}
 for(const [name,fn]of isotopeCandidates.curves){const pts=sample(z=>[415+166*z,405-185*fn(z)],name==='シ'?.34:0,1.5).filter(([,y])=>y>104);s+=path(pts,'stroke-dasharray="5 5" stroke-width="1.6"');const end=pts.at(-1);const idx=['ケ','コ','サ','シ'].indexOf(name);s+=line(end[0],end[1],491+idx*47,78,'class="guide"')+label(491+idx*47,66,name);}
 s+=label(357,491,'実線・黒四角：基準の同位体と像（目盛のない概形）');
 pack.add('q2-isotope-graphs',740,520,'感光フィルムのy-z平面。左はアからクの8点と基準の黒四角、右は基準放物線に対するケからシの4曲線。正答を強調しない選択肢図。','図3｜像の位置と放物線の選択肢（概形）',s);
 }
 {
 const ox=70,oy=296,theta=Math.atan(.0029*88),entry=[344,oy-.00145*88**2-(344-158)*Math.tan(theta)],rad=300,bend=.4,exit=[entry[0]+rad*(Math.sin(theta)-Math.sin(theta-bend)),entry[1]+rad*(Math.cos(theta)-Math.cos(theta-bend))];
 const fieldCenter=mul(add(entry,exit),.5),fieldRadius=Math.hypot(exit[0]-entry[0],exit[1]-entry[1])/2,filmY=exit[1]-Math.tan(theta-bend)*(629-exit[0]);
 let s=arrow([45,355],[660,355],'class="axis"')+arrow([70,377],[70,83],'class="axis"')+V(674,363,'x')+V(70,72,'y')+out(70,355)+V(49,350,'z')+V(52,380,'O')+line(70,270,158,270)+line(70,327,158,327)+label(116,349,'領域A')+arrow([91,310],[91,278])+V(45,290,'E')+dim([70,244],[158,244])+V(112,232,'d');
 s+=path(sample(x=>[ox+x,oy-.00145*x*x],0,88),'class="accent"')+line(158,oy-.00145*88**2,...entry,'class="accent"')+c(...fieldCenter,fieldRadius,'fill="#f0f4f7"')+path(sample(a=>[entry[0]+rad*(Math.sin(theta)-Math.sin(theta-a)),entry[1]+rad*(Math.cos(theta)-Math.cos(theta-a))],0,bend),'class="accent"')+arrow(exit,[629,filmY],'class="accent"');
 s+=label(fieldCenter[0],fieldCenter[1]-30,'領域B')+out(fieldCenter[0],fieldCenter[1]+34)+V(fieldCenter[0]+27,fieldCenter[1]+42,'B')+line(612,filmY+8,658,filmY-8,'stroke-width="4"')+label(592,filmY+51,'感光フィルム')+guide(exit,[555,exit[1]-Math.tan(theta)*(555-exit[0])])+arc(...exit,44,-theta,-theta+bend)+V(exit[0]+63,exit[1]-18,'ϕ')+guide([158,285],[252,285])+arc(158,285,55,-theta,0)+V(227,277,'θ')+arrow([72,296],[130,296])+vsub(111,318,'v',0);
 s+=label(350,424,'電場で上向きに偏向し、磁場で逆向きに曲がる')+label(350,455,'距離と曲がりは模式的（領域B内の曲率半径は大きい）');
 pack.add('q2-aston-apparatus',710,485,'アストン型配置。領域Aに+y方向の電場、離れた円形領域Bに+z方向の磁場を置き、陽イオンを逆向きに偏向させる。偏向角は現行HTMLに合わせてϕと表記。','図4｜アストン型の質量分析器（模式図）',s);
 }
 pack.add('ans-a4-magnetic-trajectory',700,470,'xz平面の円弧と接線。領域内の変位z1と領域外の直進によるz2を分け、円の半径Rと偏向角ϕ′を示す。+yは手前。','円弧と直進区間の変位',magneticPanel(95,105,1,true));
 {
 // Orthographic oblique projection: +x right, +y up, +z down-left.
 const O=[180,275],proj=([x,y,z])=>[O[0]+x-.55*z,O[1]-y+.55*z],v=[240,115,130],X=proj([240,0,0]),Y=proj([0,115,0]),Z=proj([0,0,130]),H=proj([240,0,130]),T=proj(v);
 let s=arrow(O,proj([360,0,0]),'class="axis"')+arrow(O,proj([0,210,0]),'class="axis"')+arrow(O,proj([0,0,225]),'class="axis"')+V(552,283,'x')+V(180,49,'y')+V(49,410,'z')+V(153,266,'O');
 const K=proj([240,115,0]);s+=guide(T,H)+guide(H,Z)+guide(H,X)+guide(K,X)+guide(Y,K)+guide(K,T)+arrow(O,X)+arrow(O,Y)+arrow(O,Z)+arrow(O,H,'stroke="#b28736" stroke-width="2.5"')+arrow(O,T,'stroke-width="2.7"');
 s+=vsub(X[0]+17,X[1]+30,'v','x')+vsub(Y[0]-30,Y[1]+8,'v','y')+vsub(Z[0]-29,Z[1]+11,'v','z')+vsub(H[0]+32,H[1]+8,'v',0)+V(T[0]+27,T[1]+27,'v');
 const pa=Math.atan2(H[1]-O[1],H[0]-O[0]),va=Math.atan2(K[1]-O[1],K[0]-O[0]);s+=guide(O,K)+arc(...O,64,0,pa)+V(268,296,'ϕ′')+arc(...O,100,va,0)+V(274,210,'θ′');
 s+=label(460,75,'出口での速度ベクトル')+label(460,111,'角度は射影先の平面で定義')+label(354,452,'xz 成分の合成速度は v₀。y 成分を加えて速度 v になる。');
 pack.add('ans-a5-velocity-geometry',700,490,'出口速度vをvx、vy、vzに分ける。xz平面の合成速度はv0で、x軸との角がϕ′。xy平面への射影で定めた角がθ′。模式投影で実角度・実長さとは異なる。','速度の成分と射影（模式図）',s);
 }
 {
 const {O,F,P,Q,theta,thetaFast,phi,phiFast}=focusingGeometry();let s=guide([45,O[1]],[180,O[1]])+path([O,P,F],'stroke-width="2.5"')+path([O,Q,F],'stroke="#b28736" stroke-width="2.5"')+guide(P,add(P,mul(unit([P[0]-O[0],P[1]-O[1]]),135)))+guide(Q,add(Q,mul(unit([Q[0]-O[0],Q[1]-O[1]]),130)))+dot(...F)+rect(F[0]-45,F[1]+12,83,8,'fill="#e5edf3"')+label(F[0]-5,F[1]+48,'フィルム');
 s+=arc(...O,80,-theta,0)+V(161,294,'θ')+arc(...O,131,-theta,-thetaFast)+M(223,205,rm('|Δ'),mi('θ'),rm('|'))+arc(...P,43,-theta,phi-theta)+V(370,162,'ϕ')+arc(...Q,49,-thetaFast,phiFast-thetaFast)+M(477,155,mi('ϕ'),rm('+Δ'),mi('ϕ'));
 s+=vsub(150,196,'v',0)+M(243,327,mi('v'),sub(0),rm('+Δ'),mi('v'),sub(0))+label(354,53,'電場の偏向が小さい経路も、同じ点へ')+label(355,392,'折れ線は偏向の概念図（領域内の円弧を省略）')+label(355,426,'速いイオンの磁場偏向も小さくなる配置');
 pack.add('ans-a6-focusing-rays',710,455,'速いイオンは電場による角が小さい。磁場での曲がりも小さくなると、基準の経路と同じフィルム上の点へ集束できる。折れ線は偏向のみを示す概念図。','速度の異なる2経路の集束条件',s);
 }
 return pack.save('13 independent native SVG schematics. Geometry and signs independently checked; source transcription, approximations, notation and target prerequisites remain explicitly review-gated. No restricted source pixels copied.');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)buildFigures();
