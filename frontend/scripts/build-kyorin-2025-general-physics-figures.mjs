import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,math,mi,rm,sub,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='kyorin-2025-general-physics';
const mid='text-anchor="middle"',arrow='marker-end="url(#arrow)"';
const M=(x,y,s,extra='')=>math(x,y,[mi(s)],extra);
const ix=(x,y,s,i,extra='')=>math(x,y,[mi(s),sub(i)],extra);
const rect=(x,y,w,h,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" ${extra}/>`;
const curve=pts=>`<path d="${pointsPath(pts)}" class="accent"/>`;
function spring(x1,x2,y){const p=[[x1,y],[x1+15,y]];for(let i=0;i<=48;i++)p.push([x1+15+(x2-x1-30)*i/48,y+(i===0||i===48?0:i%2?9:-9)]);p.push([x2,y]);return `<path d="${pointsPath(p)}"/>`;}
// Coordinates of choice curves are normalized; amplitude and time scales are not given.
export function choiceValue(choice,u){switch(choice){case 1:return .65;case 2:return .65*Math.abs(Math.cos(u));case 3:return .25+.65*Math.abs(1-2*((u/(2*Math.PI))%1));case 4:return .65+.3*Math.sin(u);case 5:return .65-.25*Math.cos(u);case 6:return .35*(1+Math.cos(u));default:throw Error('Unknown choice');}}
export function mechanics(m,alpha,k,L,mu,muPrime,g,r){const omega2=(1+1/alpha)*k/m,aA=k*(L-r)/m,aB=k*(r-L)/(alpha*m)-muPrime*g;return{aA,aB,centerAcceleration:(aA+alpha*aB)/(1+alpha),relativeAcceleration:aA-aB,omega2,relativeCenter:L+muPrime*g/omega2,release:L+mu*alpha*m*g/k};}
export function bridge(R,threshold=0,slopeResistance=0){const openA=3,openB=9*R/(4+R),theveninR=2+4*R/(4+R),current=Math.max(0,(openB-openA-threshold)/(theveninR+slopeResistance));const a=openA+2*current,b=openB-4*R/(4+R)*current;return{openA,openB,current,a,b,I1:(9-a)/6,I2:a/3,I3:(9-b)/4,I4:b/R};}
export const diodeCurrent=V=>Math.max(0,.06*(V-.5));
function setup(){let s=rect(65,80,28,100,'fill="#edf2f6"');for(let y=95;y<180;y+=12)s+=line(65,y,90,y-15,'class="axis"');s+=line(93,180,655,180,arrow)+spring(133,489,160)+`<circle cx="113" cy="160" r="20" fill="#edf2f6"/><circle cx="509" cy="160" r="20" fill="#edf2f6"/>`;
 return s+M(102,126,'B')+M(503,126,'A')+M(652,211,'x')+M(97,213,'O')+math(111,61,[mi('α'),mi('m')],mid)+M(509,61,'m',mid)+math(306,125,[mi('k'),rm(' , '),mi('L')],mid)+text(305,251,'初期配置：B は壁に接している',mid);}
function choices(){let s='';for(let i=1;i<=6;i++){const x=60+(i-1)%2*330,y=174+Math.floor((i-1)/2)*190;s+=text(x+125,y-116,['①','②','③','④','⑤','⑥'][i-1],mid)+line(x,y,x+265,y,arrow)+line(x,y+8,x,y-100,arrow)+M(x-14,y+30,'O');const pts=Array.from({length:241},(_,j)=>[x+j*245/240,y-choiceValue(i,j/240*5*Math.PI)*90]);s+=curve(pts);}return s;}
function force(){const x=120,y=180;let s=line(x,y,685,y,arrow)+line(x,296,x,57,arrow)+ix(61,49,'f','A')+M(689,211,'t')+M(92,209,'O');s+=curve(Array.from({length:301},(_,j)=>[x+535*j/300,y-90*Math.cos(5*Math.PI*j/300)]));return s+math(385,339,[mi('f'),sub('A'),rm(' = '),mi('k'),rm('('),mi('L'),rm(' − '),mi('x'),sub('0'),rm(') cos '),mi('ωt')],mid)+text(385,379,'符号つきの力。設問で選ぶのは、その絶対値。',mid);}
function center(){const B=100,A=640,G=280;let s=spring(B+18,A-18,165)+line(B,165,A,165,'class="guide"');for(const [x,n] of [[B,'B'],[A,'A']])s+=`<circle cx="${x}" cy="165" r="14" fill="#edf2f6"/>`+M(x,129,n,mid);s+=dot(G,165)+M(G,205,'G',mid);for(const [x1,x2,v] of [[B,G,'b'],[G,A,'a']])s+=line(x1,66,x2,66,'marker-start="url(#arrow)" '+arrow)+line(x1,77,x1,108,'class="guide"')+line(x2,77,x2,108,'class="guide"')+M((x1+x2)/2,47,v,mid);s+=line(B,184,B,264,arrow)+line(A,184,A,264,arrow)+math(B,304,[mi('αmg')],mid)+M(A,304,'mg',mid);return s+text(370,351,'AG：GB = α：1（位置関係の模式図）',mid)+text(370,383,'重力のモーメントで重心の位置を説明する補助図',mid);}
function resistor(x,y,label,value,{variable=false,left=false}={}){return line(x,y-52,x,y-35)+rect(x-13,y-35,26,70,'fill="white"')+line(x,y+35,x,y+52)+ix(left?x-70:x+26,y+6,'R',label)+(value?math(left?x-32:x+26,y-14,[rm(value),rm(' Ω')],left?'text-anchor="end"':''):'')+(variable?line(x-25,y+43,x+32,y-44,arrow):'');}
// Positive terminal at top; D conducts from right node b (anode) to a (cathode).
function circuit(mode){const detailed=mode==='conducting',off=mode==='off',x0=100,x1=340,x2=675,top=75,bottom=505,cy=290;let s=line(x0,top,x2,top)+line(x0,bottom,x2,bottom)+line(x0,top,x0,cy-8)+line(x0,cy+8,x0,bottom)+line(x0-28,cy-8,x0+28,cy-8,'stroke-width="3"')+line(x0-16,cy+8,x0+16,cy+8,'stroke-width="3"')+M(48,cy+8,'E')+math(47,238,[rm('9.0 V')],mid)+math(138,276,[rm('+')])+math(137,326,[rm('−')]);
 for(const [x,i,j]of[[x1,1,2],[x2,3,4]]){s+=line(x,top,x,128)+resistor(x,180,i,i===1?'6.0':'4.0',{left:detailed})+line(x,232,x,cy)+line(x,cy,x,348)+resistor(x,400,j,j===2?'3.0':off?'1.0':detailed?'7.0':'',{left:detailed,variable:!off&&!detailed&&j===4})+line(x,452,x,bottom)+dot(x,cy);}
 s+=M(x1-30,cy+6,'a')+M(x2+17,cy+6,'b');
 if(!off){s+=line(x1,cy,480,cy)+line(518,cy,x2,cy)+`<path d="M518 ${cy-19} L480 ${cy} L518 ${cy+19} Z" fill="white"/>`+line(480,cy-23,480,cy+23)+M(494,cy-36,'D');}
 if(off){s+=dot(x0,bottom)+M(x0-28,bottom+9,'c');for(const [x,n]of[[x1,'1'],[x2,'2']])s+=line(x-50,144,x-50,216,arrow)+ix(x-86,188,'I',n);s+=text(418,561,'D は逆バイアス：中央の枝は開放として扱う',mid);}
 if(detailed){for(const [x,y,n]of[[x0,bottom,'c'],[x0,top,'d'],[x1,top,'e'],[x2,top,'f'],[x1,bottom,'g'],[x2,bottom,'h']])s+=dot(x,y)+M(x,y===top?y-20:y+34,n,mid);for(const[x,n]of[[x1,'1'],[x2,'3']])s+=line(x+49,142,x+49,215,arrow)+ix(x+62,185,'I',n);s+=line(601,325,546,325,arrow)+ix(540,352,'I','D');s+=line(x1+49,365,x1+49,433,arrow)+math(x1+62,407,[mi('I'),sub('1'),rm(' + '),mi('I'),sub('D')])+line(x2+49,365,x2+49,433,arrow)+math(x2+62,407,[mi('I'),sub('3'),rm(' − '),mi('I'),sub('D')])+text(448,582,'（2）（c）は R₄ = 7.0 Ω ／（3）では 12 Ω に変更',mid);}
 if(mode==='question')s+=text(420,563,'図1　抵抗・可変抵抗・ダイオードの接続',mid);
 return s;}
function diode(){const x=145,y=370,X=v=>x+330*v,Y=i=>y-6000*i;let s=line(85,y,670,y,arrow)+line(x,y+22,x,60,arrow)+math(82,43,[mi('I'),sub('D'),rm(' [A]')])+math(680,y+6,[mi('V'),sub('D'),rm(' [V]')])+M(119,y+32,'O');s+=curve([[X(-.12),Y(0)],[X(.5),Y(0)],[X(1.25),Y(.045)]])+line(x,Y(.03),X(1),Y(.03),'class="guide"')+line(X(1),y,X(1),Y(.03),'class="guide"')+math(128,Y(.03)+7,[rm('0.030')],'text-anchor="end"')+math(X(.5),y+35,[rm('0.50')],mid)+math(X(1),y+35,[rm('1.0')],mid);return s+text(410,460,'図2　順方向の電圧と電流（直線近似）',mid);}
export function build(){const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('q2-spring-wall',710,285,'壁の右に質量αmのB、ばね定数k・自然長Lのばね、質量mのA。初期のBを原点Oとし、Aへ向かう向きをx軸正方向にとる。','第Ⅱ問 図1　ばねと2つの小球（模式図）。',setup());
 pack.add('q2-graph-choices',720,610,'グラフ選択肢①〜⑥。①正の定数、②余弦の絶対値形、③折れ線の振動、④正の中心の周りで初め増加、⑤正の最小値から滑らかに増加、⑥最大値からゼロまで滑らかに減少する反復。時間・振幅の数値指定はない。','第Ⅱ問（a）ア・イの解答群。番号順は①②／③④／⑤⑥。',choices());
 pack.add('ans-q2-force-graph',760,415,'Aに働く符号つき弾性力fAは初め正の最大値で、ゼロを横切る余弦波。Bの垂直抗力と静止摩擦力の和の大きさはこの力の絶対値。','符号つきの力と、力の大きさを区別する。',force());
 pack.add('ans-q2-center-of-mass',740,418,'BとAの間の重心G。GB=b、GA=a。Bにはαmg、Aにはmgの重力が下向きに働き、モーメントよりma=αmb。距離比はAG対GBがα対1。模式的な位置でありαの数値は指定していない。','重心の内分比を求める補助図。運動中の全ての力を描いた図ではありません。',center());
 pack.add('q3-bridge-circuit',850,600,'9.0V電池の正極につながる上側にR1とR3、下側にR2と可変抵抗R4。R1・R2間のaとR3・R4間のbをダイオードDで結び、カソードはa側、アノードはb側。','第Ⅲ問 図1　ダイオードを含むブリッジ回路。',circuit('question'));
 pack.add('q3-diode-graph',800,495,'横軸VD[V]、縦軸ID[A]。0.50Vまでは電流0。直線部分は0.50V・0Aと1.0V・0.030Aを通る。','第Ⅲ問 図2　ダイオードの電圧―電流特性。',diode());
 pack.add('ans-q3-bridge-current',850,600,'R4が1.0Ωの回路。逆バイアスでダイオード枝を開放する。左枝I1はR1とR2を下向きに、右枝I2はR3とR4を下向きに流れる。電池負極につながる下側cを0Vとする。','第Ⅲ問（2）（a）中央の枝を開放した等価回路。',circuit('off'));
 pack.add('ans-q3-kirchhoff-circuit',870,620,'上側d-e-f、下側c-g-h、中央a-b。左上電流I1、右上I3は下向き。ダイオード電流IDはbからaへ。左下はI1+ID、右下はI3−ID。R4は7.0Ω、（3）では12Ωに置き換える。','第Ⅲ問（2）（c）枝電流と閉回路の記号。',circuit('conducting'));
 return pack.save('8図は問題条件・独立計算から構成し原本クロップをコピーしない。第Ⅱ問の選択肢と式、解説の途中式・摩擦条件、目標点依存関係は元HTML修復待ち。図の追加は本文・権利・人間レビューの承認を意味しない。');}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))build();
