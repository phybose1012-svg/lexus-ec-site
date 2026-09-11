import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,math,mi,rm,sub,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='kurume-2025-general-early-physics';
const mid='text-anchor="middle"',arrow='marker-end="url(#arrow)"';
const M=(x,y,s)=>math(x,y,[mi(s)]),indexed=(x,y,s,i)=>math(x,y,[mi(s),sub(i)]);
const rect=(x,y,w,h,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" ${extra}/>`;
export function circular(m,g,theta,v){const radius=v*v*Math.tan(theta)/g,height=v*v/g;return{normal:m*g/Math.sin(theta),centripetal:m*g/Math.tan(theta),radius,height,period:2*Math.PI*radius/v,kinetic:m*v*v/2,potential:m*g*height};}
export function descent(h1,h2,g){const v1sq=2*g*h2*h2/(h1+h2);return{v1sq,v2sq:v1sq+2*g*(h1-h2)};}
// A topology illustration, not a numerical integration of the equations of motion.
export function descendingPoints(n=201){return Array.from({length:n},(_,i)=>{const t=i/(n-1),h=1.35+1.7*(1+Math.cos(Math.PI*t))/2,phi=.65+3.4*Math.PI*t,r=52*h;return[315+r*Math.cos(phi),500-108*h+.22*r*Math.sin(phi),h];});}
export function balloon(rho0,V,M1,M2,T0){const T1=rho0*V*T0/(rho0*V-M1),rho1=rho0*T0/T1,rho2=M2*T0*rho0/(M1*T1),rhoh=rho2*T1/T0;return{T1,rho1,rho2,rhoh};}
export const circuit=(E,r,R)=>({I:E/(R+r),V:E*R/(R+r),P:E*E*R/(R+r)**2});
function coneBase(){return line(105,70,315,500)+line(525,70,315,500)+line(315,43,315,500,'class="guide"')+M(302,531,'O')+text(315,29,'鉛直軸',mid)+`<path d="M315 435 A65 65 0 0 1 343.5 441.6"/>`+M(326,416,'θ');}
function orbit(){const cy=262,rx=(500-cy)*210/430,ry=29;return coneBase()+`<ellipse cx="315" cy="${cy}" rx="${rx}" ry="${ry}" class="accent"/>`+dot(315,cy+ry)+M(334,315,'A')+line(310,cy+ry,243,cy+ry,arrow)+indexed(264,327,'v','0')+text(315,564,'一定の高さを保つ等速円運動（模式図）',mid);}
function descending(){const p=descendingPoints(),E=p[0],F=p.at(-1);let s=coneBase();for(const [pt,i,x] of [[E,'1',590],[F,'2',635]]){const yy=500-108*pt[2];s+=`<ellipse cx="315" cy="${yy}" rx="${52*pt[2]}" ry="${.22*52*pt[2]}" class="guide"/>`+line(315,yy,x,yy,'class="guide"')+line(315,500,x,500,'class="guide"')+line(x,yy,x,500,'class="axis" marker-start="url(#arrow)" '+arrow)+indexed(x+13,(yy+500)/2+7,'h',i);}
 s+=`<path d="${pointsPath(p)}" class="accent"/>`+dot(E[0],E[1])+dot(F[0],F[1])+M(534,206,'E')+line(E[0]+6,E[1],522,199,'class="axis"')+M(425,336,'F')+line(F[0]+6,F[1],413,329,'class="axis"');
 const t=p[45],u=p[52];s+=line(t[0],t[1],u[0],u[1],arrow);
 return s+text(345,571,'小球 D：E から F へ降下（軌道は模式的）',mid);}
function hotAir(){const cx=285,cy=198,r=130,gap=.12,a=Math.PI/2+gap,b=Math.PI/2-gap;const start=[cx+r*Math.cos(a),cy+r*Math.sin(a)],end=[cx+r*Math.cos(b),cy+r*Math.sin(b)];let s=`<path d="M${start} A130 130 0 1 1 ${end}" fill="#f4f7fa"/>`+line(start[0],start[1],start[0],351)+line(end[0],end[1],end[0],351);
 s+=M(279,207,'V')+text(285,43,'体積一定の風船',mid)+text(485,353,'開口部')+line(470,346,313,342,'class="axis"');
 s+=line(185,280,245,403)+line(385,280,325,403)+rect(245,403,80,59,'fill="#edf2f6"')+rect(275,430,23,32,'fill="#c8d6df"')+text(487,414,'ゴンドラ')+line(474,408,334,408,'class="axis"')+text(487,445,'おもり')+line(473,439,310,445,'class="axis"');
 s+=line(100,463,645,463);for(let x=110;x<640;x+=18)s+=line(x,463,x-11,478,'class="axis"');
 return s+text(352,523,'地表にある初めの状態（模式図）',mid)+text(352,554,'開口部を通じ、内部と外部の圧力は等しい',mid);}
function battery(){let s=line(145,125,275,125)+rect(275,108,100,34,'fill="#f4f7fa"')+line(375,125,620,125)+line(620,125,620,345)+line(620,345,512,345)+rect(442,328,70,34,'fill="#f4f7fa"')+line(442,345,366,345);
 s+=line(356,315,356,375,'stroke-width="3"')+line(366,329,366,361,'stroke-width="3"')+line(356,345,240,345)+line(145,125,145,345)+line(145,345,180,345)+dot(180,345)+dot(240,345)+line(180,345,229,314,'stroke-width="2.5"');
 s+=rect(318,283,232,128,'class="guide"')+M(316,87,'R')+M(470,312,'r')+M(348,400,'E')+M(199,387,'S')+math(329,316,[rm('+')])+math(381,325,[rm('−')])+text(439,451,'電池（点線内）',mid);
 return s+text(382,500,'内部抵抗 r を電池内部の直列抵抗として表示',mid)+text(382,534,'図は S が開いた状態。指定のない設問では閉じる。',mid);}
export function build(){const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('q1-cone-circular-motion',650,600,'頂点Oを下にしたなめらかな円すい。鉛直軸と側面の角はθ。小球Aは一定の高さの水平円周上を速さv₀で進む。加速度や力の解答は図示していない。','図1-1　円すい内面の等速円運動（模式図）。',orbit());
 pack.add('q1-cone-descending-path',720,610,'小球Dが円すい内面の高い点Eから低い点Fへ回りながら降下する。h₁とh₂はともに頂点Oの水平面から測る。曲線は位置関係を示す模式線で、計算した軌道ではない。','図1-2　高さの異なるEとFを結ぶ降下運動（模式図）。',descending());
 pack.add('q2-hot-air-balloon',720,590,'体積Vの風船の下に開口部があり、内外の圧力が等しい。風船にゴンドラとおもりをつけ、地表に置いた初期状態。','図2　開口部・ゴンドラ・おもりの位置（模式図）。',hotAir());
 pack.add('q3-battery-circuit',760,570,'外部抵抗R、スイッチS、起電力Eと内部抵抗rからなる電池の直列回路。点線枠は電池内部で、rは外部抵抗ではない。Sは開いた状態で示す。','図3　内部抵抗を含む電池と外部抵抗の回路。',battery());
 return pack.save('全図を問題条件から独立構成。原本クロップは複製していない。降下曲線は模式線、電池内部は等価回路で明示。元解説の途中式・状態方程式の原本誤植・分析の依存関係は修復待ち。権利と人間レビューは未承認。');}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))build();
