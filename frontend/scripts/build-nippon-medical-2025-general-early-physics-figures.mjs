import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,math,mi,rm,sub,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='nippon-medical-2025-general-early-physics';
const mid='text-anchor="middle"',end='text-anchor="end"',arrow='marker-end="url(#arrow)"';
const M=(x,y,v,e='')=>math(x,y,[mi(v)],e);
const L=(x,y,v,e='')=>math(x,y,[rm(v)],e);
const ix=(x,y,v,i,e='')=>math(x,y,[mi(v),sub(i)],e);
const poly=(p,e='')=>`<path d="${pointsPath(p)}" ${e}/>`;
const arc=(x,y,r,a,b,e='')=>poly(Array.from({length:81},(_,i)=>[x+r*Math.cos(a+(b-a)*i/80),y+r*Math.sin(a+(b-a)*i/80)]),e);
const dim=(x1,y1,x2,y2)=>line(x1,y1,x2,y2,'marker-start="url(#arrow)" '+arrow);
export const potentialVertices=[[0,0],[1.5,1],[3,1],[6,0]];
export const potential=x=>x<1.5?x/1.5:x<=3?1:(6-x)/3;
export function electricMotion(m=1,q=1.5,v0=2){
 const fields=potentialVertices.slice(1).map((p,i)=>-(p[1]-potentialVertices[i][1])/(p[0]-potentialVertices[i][0]));
 const speeds=potentialVertices.map(([,V])=>Math.sqrt(v0*v0-2*q*V/m));
 const times=fields.map((E,i)=>E===0?(potentialVertices[i+1][0]-potentialVertices[i][0])/speeds[i]:(speeds[i+1]-speeds[i])/(q*E/m));
 return {fields,speeds,times,accelerations:fields.map(E=>q*E/m),threshold:Math.sqrt(2*q/m)};
}
export const cycle=()=>{const pressure=243/32,volume=pressure**(3/5),heatIn=1.5*(pressure-1),workAdiabatic=1.5*(pressure-volume),heatOut=2.5*(volume-1);return{pressure,volume,heatIn,workAdiabatic,heatOut,efficiency:1-heatOut/heatIn};};
export const departure=(R=1)=>{const c=2/3;return{x:R*Math.sqrt(1-c*c),height:R*c,theta:Math.acos(c)};};
function halfCylinder(){const x=430,y=220,r=145;return line(70,365,627,365)+arc(x,y,r,Math.PI/2,-Math.PI/2)+line(x,75,x,365,'class="guide"')+line(x,y,x+r,y,'class="guide"')+line(x,y,x+103,y+103,arrow)+M(x+64,y+32,'r')+dot(x,y)+dot(x,75)+dot(x,365)+dot(x+r,y)+dot(140,365)+line(145,330,247,330,arrow)+text(193,309,'放つ向き',mid)+L(140,400,'O',mid)+L(x,400,'A',mid)+L(x,54,'C',mid)+L(x+r+19,y+8,'B')+text(545,432,'断面ABC',mid);}
function hemisphere(){const x=340,y=325,r=190;return arc(x,y,r,Math.PI,2*Math.PI)+line(90,y,590,y)+`<circle cx="${x}" cy="${y-r-8}" r="8" fill="#18334c"/>`+L(x,103,'D',mid)+dot(x,y)+line(x,y,x+130,y-138,arrow)+M(x+74,y-49,'R')+text(340,383,'半球の頂点に小球を置く',mid);}
function graph(){const X=x=>90+90*x,Y=v=>300-180*v;let s='';for(let i=1;i<=12;i++)s+=line(X(i*.5),Y(0),X(i*.5),Y(1),'class="guide"');for(let i=1;i<=2;i++)s+=line(X(0),Y(i*.5),X(6),Y(i*.5),'class="guide"');s+=line(90,330,90,64,arrow)+line(68,300,664,300,arrow)+poly(potentialVertices.map(([x,V])=>[X(x),Y(V)]),'stroke-width="2.8"')+M(62,74,'V')+M(664,332,'x')+L(71,329,'O',end)+text(345,384,'1マス：横 0.500 m ／ 縦 0.500 V',mid);return s;}
function shell(){const x=300,y=280,R=166,r1=110,a=-.7,p=[x+R*Math.cos(a),y+R*Math.sin(a)],out=[x+(R+75)*Math.cos(a),y+(R+75)*Math.sin(a)];let s=`<circle cx="${x}" cy="${y}" r="${R}" fill="#edf2f6"/><circle cx="${x}" cy="${y}" r="${r1}" fill="white"/>`+dot(x,y)+M(x,y+34,'Q',mid)+line(x,y,x+r1*Math.cos(-1.95),y+r1*Math.sin(-1.95),arrow)+ix(250,227,'r','1')+line(x,y,x+R*Math.cos(-2.73),y+R*Math.sin(-2.73),arrow)+M(181,205,'R');s+=dot(...p)+math(p[0]-4,p[1]-26,[rm('−'),mi('q')],mid)+line(p[0]+7,p[1]-6,...out,arrow)+M(out[0]+10,out[1]+26,'h')+text(507,335,'導体球殻')+line(490,324,443,316)+text(340,505,'球の中心から外側へ打ち出す（断面模式図）',mid);return s;}
function pvCycle(){const c=cycle(),X=v=>65+130*v,Y=p=>455-47*p;let s=line(65,460,65,42,arrow)+line(60,455,617,455,arrow);s+=line(65,Y(1),X(c.volume),Y(1),'class="guide"')+line(65,Y(c.pressure),X(1),Y(c.pressure),'class="guide"')+line(X(1),Y(c.pressure),X(1),455,'class="guide"')+line(X(c.volume),Y(1),X(c.volume),455,'class="guide"');const curve=v=>[X(v),Y(c.pressure/v**(5/3))];s+=line(X(1),Y(1),X(1),Y(c.pressure))+poly(Array.from({length:121},(_,i)=>curve(1+(c.volume-1)*i/120)))+line(X(c.volume),Y(1),X(1),Y(1));s+=line(X(1),Y(3.5),X(1),Y(4.8),arrow)+poly([curve(1.60),curve(1.70),curve(1.80)],arrow)+line(X(2.4),Y(1),X(2),Y(1),arrow);s+=dot(X(1),Y(1))+dot(X(1),Y(c.pressure))+dot(X(c.volume),Y(1))+L(X(1)+19,Y(1)-18,'A')+L(X(1)+20,Y(c.pressure)+2,'B')+L(X(c.volume)+16,Y(1)-16,'C')+M(42,45,'P')+M(622,480,'V')+ix(47,Y(1)+8,'P','1',end)+ix(47,Y(c.pressure)+8,'P','2',end)+ix(X(1),493,'V','1',mid)+ix(X(c.volume),493,'V','2',mid);return s;}
function detach(){const x=360,y=350,R=210,d=departure(R),E=[x+d.x,y-d.height],top=y-R;let s=arc(x,y,R,Math.PI,2*Math.PI)+line(75,y,653,y)+line(x,top-20,x,y,'class="guide"')+line(x,y,...E,'class="guide"')+line(89,top,x,top,'class="guide"')+line(169,E[1],E[0],E[1],'class="guide"')+dim(90,top,90,y)+dim(170,E[1],170,y)+M(67,255,'R',end)+math(200,314,[mi('R'),rm(' cos '),mi('θ')])+arc(x,y,61,-Math.PI/2,-Math.PI/2+d.theta)+M(378,279,'θ')+M(461,295,'R')+dot(x,top)+dot(...E)+dot(x,y)+L(x,top-22,'D',mid)+L(x-17,y+31,'P')+L(E[0]+19,E[1]-17,'E');const vx=Math.cos(d.theta),vy=Math.sin(d.theta);s+=line(E[0],E[1],E[0]+85*vx,E[1]+85*vy,arrow)+ix(E[0]+80,E[1]+32,'v','E')+text(360,420,'中心Pから測る角θと、床からの高さ',mid);return s;}
export function build(){const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('q1-fig1-half-cylinder',680,455,'水平な床のOから小球を右に放ち、半径rの半円筒内面をA、B、Cの順に進む。ACは鉛直、Bは弧の中間。初速度や落下軌道の解答は示さない。','第Ⅰ問 図1　半円筒内面の断面。',halfCylinder());
 pack.add('q1-fig2-hemisphere',680,417,'床に固定した半径Rの半球。頂点Dに小球を置く。離脱位置や高さは示さない。','第Ⅰ問 図2　半球と頂点の小球。',hemisphere());
 pack.add('q2-fig1-potential-graph',700,419,'電位Vと位置xの折れ線グラフ。原点から横3マス・縦2マス上昇し、横3マス水平、横6マスで元の高さへ戻る。1マスは横0.500 m、縦0.500 V。','第Ⅱ問 図1　電位と位置の関係。',graph());
 pack.add('q2-fig2-conducting-shell',680,535,'内半径r1、外半径Rの導体球殻の中心に正電荷Q、外表面に負電荷−qを置く。外向きの移動距離hは外表面から測る。hを見やすく強調した断面模式図。','第Ⅱ問 図2　球殻と外表面からの移動距離h。',shell());
 pack.add('q3-fig-pv-cycle',680,527,'PV図。A(P1,V1)からB(P2,V1)へ定積加熱、BからC(P1,V2)へ断熱膨張、CからAへ定圧圧縮。矢印はA、B、C、Aの順。数値解答は記入しない。','第Ⅲ問　等積・断熱・等圧のサイクル。',pvCycle());
 pack.add('a-fig-hemisphere-detach',720,451,'半球の中心P、頂点D、離脱点E。θはPDとPEのなす角で、Eの床からの高さはR cosθ。vEはEで球面に接する速度。解答条件cosθ=2/3を使って独立に配置した。','離脱点Eの高さと接線方向の速度。',detach());
 return pack.save('問題3ページ・解答8ページを照合し、条件と独立計算から6図を作成。元画像の転用なし。電位グラフの第一傾きは−2/3 V/m、learner本文のE1誤記は元修復待ち。目標割合の丸め・解答欄構造・前問依存も元修復待ち。権利・人間レビューは未承認。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))build();
