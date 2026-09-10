// Independent constructions from the physical givens. Source diagrams were
// consulted only for terminal/choice order, never for pixel/path coordinates.
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,mi,rm,sub,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
const mid='text-anchor="middle"',end='text-anchor="end"',arr='marker-end="url(#arrow)"';
const deg=Math.PI/180;
const label=(x,y,s,extra='')=>math(x,y,[rm(s)],extra);
const variable=(x,y,s,extra='')=>math(x,y,[mi(s)],extra);
const index=(x,y,s,n,extra='')=>math(x,y,[mi(s),sub(n)],extra);
const circle=(x,y,r,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" ${extra}/>`;
const rect=(x,y,w,h,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" ${extra}/>`;
const vector=(x,y,s,n='')=>line(x-2,y-31,x+22,y-31,arr)+math(x,y,[mi(s),...(n?[sub(n)]:[])]);
const arc=(x,y,r,a,b)=>`<path d="${pointsPath(Array.from({length:25},(_,i)=>{const t=(a+(b-a)*i/24)*deg;return[x+r*Math.cos(t),y+r*Math.sin(t)];}))}"/>`;
const dimension=(x1,y1,x2,y2)=>line(x1,y1,x2,y2,`class="axis" marker-start="url(#arrow)" ${arr}`);
export const ratio=Math.sqrt(2-Math.sqrt(3));
export const thermo={gamma:1.4,alpha:3,beta:3**(1/1.4)};
export const diffraction={red:25*deg,blue:Math.asin(Math.sin(25*deg)/2)};
export const separationLimit=4/(Math.tan(diffraction.red)-Math.tan(diffraction.blue));
export const choices=[{length:.58,arReverse:true,aReverse:false},{length:1,arReverse:true,aReverse:true},{length:1.42,arReverse:false,aReverse:true},{length:.58,arReverse:true,aReverse:true},{length:1,arReverse:true,aReverse:false},{length:1.42,arReverse:false,aReverse:false}];
export const trigRows=Array.from({length:12},(_,i)=>{const a=10+5*i;return[a,Math.sin(a*deg).toFixed(2),Math.cos(a*deg).toFixed(2),Math.tan(a*deg).toFixed(2)];});
export const trigTable=()=>'<div class="table-scroll"><table class="source-table" data-iuhw-trig-table><caption>三角関数表（小数第2位まで）</caption><thead><tr><th scope="col">θ</th><th scope="col">sin θ</th><th scope="col">cos θ</th><th scope="col">tan θ</th></tr></thead><tbody>'+trigRows.map(([a,...values])=>`<tr><th scope="row">${a}°</th>${values.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')+'</tbody></table></div>';
function disk(){
 let b=text(350,32,'上から見た円盤',mid)+circle(310,215,155,'fill="#f4f7fa"');
 b+=rect(310,207,150,16,'fill="white" stroke="#92a5b5"')+line(310,215,446,215,'stroke-width="2.8"');
 for(const [x,s] of [[310,'O'],[378,'P'],[446,'Q']])b+=dot(x,215)+label(x,192,s,mid);
 b+=variable(378,250,'m',mid)+variable(446,250,'m',mid);
 b+=dimension(310,286,378,286)+dimension(378,286,446,286)+variable(344,317,'l',mid)+variable(412,317,'l',mid);
 b+=text(350,404,'半径方向の溝に小球を置き、O―P、P―Qを糸で結ぶ。',mid);
 return b;
}
function bulb(x,y){return circle(x,y,21,'fill="white"')+line(x-14,y-14,x+14,y+14)+line(x-14,y+14,x+14,y-14);}
function battery(x,y){return line(x-10,y-17,x-10,y+17)+line(x+9,y-10,x+9,y+10)+label(x,y+48,'100 V',mid);}
function bulbs(){
 let b=text(180,36,'直列につなぐ',mid)+text(520,36,'並列につなぐ',mid);
 b+=`<path d="M70 130 H290 V300 H189 M170 300 H70 V130"/>`+bulb(125,130)+bulb(235,130)+battery(180,300);
 b+=label(125,96,'60 W',mid)+label(235,96,'100 W',mid);
 b+=`<path d="M410 130 H630 V300 H529 M510 300 H410 V130 M410 215 H630"/>`+bulb(520,130)+bulb(520,215)+battery(520,300);
 b+=label(520,97,'60 W',mid)+label(520,182,'100 W',mid);
 b+=text(350,404,'いずれも100 V用。電球の抵抗値は一定とする。',mid);
 return b;
}
function lens(){
 let b='';
 for(const [j,x,s] of [[0,245,'a'],[1,455,'b']]){
  const y=150+j*240;
  b+=text(350,y-120,`${j+1}回目の結像位置`,mid)+line(70,y,638,y,'class="guide"');
  b+=line(95,y,95,y-45,arr)+text(95,y-60,'光源',mid)+line(605,y-65,605,y+50,'stroke-width="4"')+text(605,y-82,'スクリーン',mid);
  b+=`<path d="M${x} ${y-64} Q${x+28} ${y} ${x} ${y+64} Q${x-28} ${y} ${x} ${y-64}Z" fill="#edf3f7"/>`;
  b+=text(x,y-82,'凸レンズ',mid)+dimension(95,y+88,x,y+88)+variable((95+x)/2,y+118,s,mid);
 }
 b+=text(350,542,'光源とスクリーンの位置は固定。a < b。',mid);return b;
}
function gasBox(x,y,w,h,piston){
 let b=rect(x,y,w,h,'fill="#f2f6f8" stroke-width="4"');
 if(piston==='initial')b+=rect(x+w/2,y,w/2,h,'fill="white" stroke="none"')+line(x+w/2,y,x+w/2,y+h,'stroke-width="4"')+text(x+w/4,y+55,'理想気体',mid)+text(x+3*w/4,y+55,'真空',mid);
 else if(piston==='hole')b+=line(x+w/2,y,x+w/2,y+28,'stroke-width="4"')+line(x+w/2,y+67,x+w/2,y+h,'stroke-width="4"')+text(x+w/2,y+54,'穴',mid);
 return b;
}
function expansion(){
 let b=text(350,32,'同じ初期状態から、別々に操作する',mid)+gasBox(200,72,300,100,'initial');
 b+=text(350,202,'断熱容器・中央の仕切り',mid)+line(290,220,180,273,arr)+line(410,220,520,273,arr);
 b+=text(180,306,'操作I：仕切りをゆっくり移動',mid)+gasBox(55,335,250,100,'moved');
 b+=line(300,347,300,423,'stroke-width="5"')+line(300,381,335,381)+line(342,349,314,349,arr)+text(325,452,'外力を調節',mid);
 b+=index(130,485,'P','1')+index(203,485,'v','1');
 b+=text(520,306,'操作II：穴を開けて自由膨張',mid)+gasBox(395,335,250,100,'hole')+index(470,485,'P','2')+index(540,485,'v','2');
 return b+text(350,534,'操作Iでは仕切りを右端へ。操作IIでは穴を通って全体へ広がる。',mid);
}
function wedgeState(y,moving=false){
 const left=100,top=390,base=y+168,slope=Math.tan(30*deg),height=290*slope;
 let b=line(55,base,655,base,'stroke-width="3"')+rect(620,y-23,16,base-y+23,'fill="#e3e9ee"');
 b+=`<path d="M${left} ${base} H${top} V${base-height} Z" fill="#f2f6f8"/>`;
 b+=circle(top,base-height-8,9,'fill="white"')+line(top+9,base-height-8,620,base-height-8);
 const px=moving?275:367,py=base-(px-left)*slope;
 b+=line(px,py-9,top-5,base-height-14)+`<g transform="translate(${px} ${py}) rotate(-30)">${rect(-13,-27,26,27,'fill="white"')}</g>`;
 b+=math(px-24,py-42,[rm('P ('),mi('m'),rm(')')],mid)+math(290,base-43,[rm('Q ('),mi('M'),rm(')')],mid);
 b+=arc(left,base,56,-30,0)+label(left+76,base-12,'30°');
 if(moving)b+=line(420,base-50,495,base-50,arr)+vector(451,base-68,'A');
 else b+=dimension(540,base-height,540,base)+variable(557,base-height/2+8,'h')+text(650,y-44,'固定壁',end);
 return b;
}
function wedge(){return text(350,35,'外力で静止させた状態',mid)+wedgeState(108)+text(350,365,'外力を取り除いた後',mid)+wedgeState(435,true)+text(350,659,'Pの加速度と相対加速度の関係は、問2以降で考える。',mid);}
function vectorChoices(){
 let b=text(320,34,'加速度ベクトルの選択肢',mid);
 choices.forEach((c,n)=>{
  const ox=60+(n%2)*300,oy=220+Math.floor(n/2)*235,L=140;
  const O=[ox,oy],B=[ox+L,oy],C=[ox+L*c.length*Math.cos(30*deg),oy-L*c.length*.5];
  const directed=(p,q,rev)=>line(...(rev?q:p),...(rev?p:q),arr);
  b+=text(ox-16,oy-151,'①②③④⑤⑥'[n])+directed(O,B,false)+directed(O,C,c.arReverse)+directed(C,B,c.aReverse)+arc(ox,oy,34,-30,0);
  b+=label(ox+43,oy-7,'30°')+vector(ox+60,oy+52,'A')+vector((ox+C[0])/2-20,(oy+C[1])/2-21,'a','r')+vector((B[0]+C[0])/2+24,(B[1]+C[1])/2+6,'a');
 });
 return b;
}
function balance(){
 let b=text(350,35,'P・Q・滑車をまとめた系の、外力だけを表示',mid);
 b+=rect(230,153,240,170,'fill="#f1f5f8" stroke-dasharray="7 5"')+text(350,242,'P ＋ Q ＋ 滑車',mid);
 b+=line(470,194,615,194,arr)+variable(545,172,'T')+text(548,222,'壁につながる糸',mid);
 b+=line(230,277,84,277,arr)+variable(145,257,'f');
 b+=line(350,153,350,75,arr)+variable(373,109,'N')+line(350,323,350,420,arr)+math(374,390,[rm('('),mi('m'),rm(' + '),mi('M'),rm(')'),mi('g')]);
 return b+text(350,472,'内部の張力・接触力は、系全体では相殺する。',mid);
}
function coils(){
 const P=(u,v,y)=>[350+150*u+85*v,y+43*u-58*v];
 let b=text(350,31,'対応する頂点を上下にそろえた正方形コイル',mid);
 for(const [u,v] of [[1,1],[-1,1],[-1,-1]])b+=line(...P(u,v,176),...P(u,v,418),'class="guide"');
 for(const [base,turns,s,t,n] of [[176,2,'c','d','2'],[418,1,'a','b','1']]){
  for(let i=0;i<turns;i++){
   const y=base+i*7;
   const pts=[[.13,-1],[1,-1],[1,1],[-1,1],[-1,-1],[-.13,-1]].map(([u,v])=>P(u,v,y));
   b+=`<path d="${pointsPath(pts)}" stroke-width="2.2"/>`;
  }
  const start=P(.13,-1,base),finish=P(-.13,-1,base+(turns-1)*7);
  if(turns===2)b+=line(...P(-.13,-1,base),...P(.13,-1,base+7));
  b+=line(...start,start[0]+14,start[1]+33)+line(...finish,finish[0]-20,finish[1]+33);
  b+=circle(start[0]+14,start[1]+33,4,'fill="white"')+circle(finish[0]-20,finish[1]+33,4,'fill="white"');
  b+=variable(start[0]+27,start[1]+52,s)+variable(finish[0]-34,finish[1]+52,t);
  b+=line(...P(.42,-1,base+31),...P(.78,-1,base+31),arr)+index(...P(.98,-1,base+47),'I',n);
  b+=text(603,base-53,`コイル${n}（${turns}巻き）`,end);
 }
 b+=line(350,171,350,69,arr)+math(371,68,[rm('Φ')])+text(437,83,'鉛直上向きが正');
 return b+text(350,616,'a→b、c→d にコイル内を流れる向きを電流の正方向とする。',mid);
}
export const pvPressure=v=>thermo.alpha/v**thermo.gamma;
function pv(){
 const X=v=>110+180*v,Y=p=>426-108*p, {alpha,beta}=thermo;
 let b=line(110,450,110,62,arr)+line(87,426,622,426,arr)+variable(81,65,'P')+variable(629,434,'V');
 b+=line(X(1),426,X(1),Y(alpha),'class="guide"')+line(X(beta),426,X(beta),Y(1),'class="guide"')+line(110,Y(alpha),X(1),Y(alpha),'class="guide"')+line(110,Y(1),X(beta),Y(1),'class="guide"');
 b+=index(X(1),464,'V','0',mid)+math(X(beta),464,[mi('β'),mi('V'),sub('0')],mid)+index(91,Y(1)+9,'P','0',end)+math(90,Y(alpha)+9,[mi('α'),mi('P'),sub('0')],end);
 b+=line(X(1),Y(1),X(1),Y(alpha))+line(X(beta),Y(1),X(1),Y(1));
 const pts=Array.from({length:121},(_,i)=>{const v=1+(beta-1)*i/120;return[X(v),Y(pvPressure(v))];});
 b+=`<path d="${pointsPath(pts)}" class="accent"/>`+line(X(1),Y(1.7),X(1),Y(2),arr)+line(X(1.8),Y(1),X(1.5),Y(1),arr)+line(...pts[55],...pts[62],arr);
 b+=dot(X(1),Y(1))+dot(X(1),Y(alpha))+dot(X(beta),Y(1))+variable(X(1)-23,Y(1)+29,'a')+variable(X(1)-23,Y(alpha)-13,'b')+variable(X(beta)+16,Y(1)+4,'c');
 return b+text(350,519,'a → b：定積　 b → c：断熱　 c → a：定圧',mid);
}
function setup(){
 const O=[350,155],R=235;
 let b=text(350,31,'CDを上から見た配置（回折角は模式的）',mid)+rect(185,138,330,16,'fill="#e6edf2"')+text(539,152,'CD面');
 b+=line(350,449,350,180,arr)+text(389,440,'入射光');
 for(const [a,n] of [[-60,2],[-25,1],[0,0],[25,1],[60,2]]){
  const to=[O[0]+R*Math.sin(a*deg),O[1]+R*Math.cos(a*deg)];
  const dx=a===0?-9:0;b+=line(O[0]+dx,O[1],to[0]+dx,to[1],arr)+text(to[0]+(a<0?-18:a>0?18:-25),to[1]+(a===0?12:23),`${n}次`,mid);
 }
 b+=arc(...O,82,65,90)+arc(...O,120,90,115)+label(388,310,'25°',mid)+label(305,340,'25°',mid);
 b+=arc(...O,47,30,90)+index(408,219,'θ','2');
 return b+text(350,505,'波長800 nm。図の寸法や2次光の開きから数値を読み取らない。',mid);
}
function geometry(){
 const P=[210,329],Q=[390,329],a=35*deg,len=263;
 let b=text(350,34,'隣り合うトラックからの反射回折光',mid)+line(110,329,625,329,'stroke-width="4"');
 for(const [p,name] of [[P,'a'],[Q,'b']]){
  b+=line(p[0],69,p[0],310,arr)+line(...p,p[0]+len*Math.sin(a),p[1]-len*Math.cos(a),arr);
  b+=variable(p[0]+len*Math.sin(a)-18,p[1]-len*Math.cos(a)-21,name);
 }
 b+=dot(...P)+dot(...Q)+arc(...Q,67,-90,-55)+variable(408,240,'θ');
 b+=dimension(210,385,390,385)+variable(300,416,'d',mid)+text(555,358,'CD面',mid)+text(136,77,'垂直入射',end);
 return b+text(350,462,'光路差は問1で求めるため、図に書き込んでいない。',mid);
}
function rainbows(){
 let b=text(350,31,'スクリーンの正面（色順は問3で考える）',mid);
 b+=rect(171,53,358,284,'fill="#fbfcfd"')+circle(350,195,117,'stroke="#c0cad2" stroke-width="21"')+circle(350,195,73,'stroke="#e0e6eb" stroke-width="18"')+circle(350,195,39,'fill="white" stroke-dasharray="4 5"');
 b+=line(350,195,478,195,'class="axis"')+variable(437,182,'R')+line(350,195,350,113,'class="axis"')+variable(328,144,'r')+text(331,221,'穴',mid);
 b+=text(550,182,'外側の虹')+text(550,240,'内側の虹');
 b+=text(350,388,'中心軸を含む断面（長さ・角度は模式的）',mid);
 const screen=150,cd=568,cy=690,p=[cd,610],q1=[screen,425],q2=[screen,795];
 b+=line(screen,415,screen,594,'stroke-width="4"')+line(screen,786,screen,858,'stroke-width="4"')+line(screen,594,screen,786,'class="guide"');
 b+=line(cd,594,cd,786,'stroke-width="5"')+line(screen-40,cy,cd+25,cy,'class="guide"')+label(cd+11,cy+26,'O');
 b+=line(...p,...q1,arr)+line(...p,...q2,arr)+line(63,610,550,610,arr)+text(90,591,'入射光');
 b+=dot(...p)+label(cd+12,604,'P')+math(103,425,[rm('Q'),sub('1')])+math(103,816,[rm('Q'),sub('2')]);
 b+=dimension(screen,875,cd,875)+variable((screen+cd)/2,907,'L',mid)+text(screen,934,'スクリーン',mid)+text(cd,934,'CD',mid);
 b+=dimension(627,594,627,786)+math(646,697,[mi('D'),sub('1')])+dimension(700,658,700,722)+math(709,646,[mi('D'),sub('2')]);
 b+=text(392,838,'Q₁：外向き　Q₂：中心向き',mid);
 return b;
}
function limit(){
 const cx=135,sx=615,cy=345,scale=30,r=2,h=(r+separationLimit*Math.tan(diffraction.blue))*scale,y=cy-h;
 let b=text(370,32,'2つの境界が同じ半径に届く分離限界',mid)+line(cx,214,cx,438,'stroke-width="4"')+line(sx,83,sx,438,'stroke-width="4"');
 b+=line(70,cy,652,cy,'class="guide"')+label(106,cy+26,'O');
 b+=line(cx,cy-r*scale,sx,y,'stroke="#756398" stroke-width="2.4" marker-end="url(#arrow)"')+line(cx,cy+r*scale,sx,y,'stroke="#b05050" stroke-width="2.4" marker-end="url(#arrow)"');
 b+=dot(cx,cy-r*scale)+dot(cx,cy+r*scale)+dot(sx,y);
 b+=text(364,185,'400 nm：外側の虹の最小半径',mid)+text(408,380,'800 nm：内側の虹の最大半径',mid);
 b+=dimension(81,cy-r*scale,81,cy+r*scale)+math(53,cy+8,[mi('D'),sub('2')],end);
 b+=dimension(cx,480,sx,480)+math(375,510,[mi('L'),sub('max')],mid)+text(cx,552,'CDの内側トラック',mid)+text(sx,552,'スクリーン',mid);
 return b+text(370,595,'2つの境界が一致するところでLを求める。縦横の縮尺は異なる。',mid);
}
export function buildFigures(){
 const supplementsDir=new URL('../src/data/pastExamBatch/question-supplements/',import.meta.url);
 fs.mkdirSync(supplementsDir,{recursive:true});
 const anchor='図1の三角関数表を必要に応じて用いる。</p>';
 fs.writeFileSync(new URL('international-health-welfare-2025-general-physics.json',supplementsDir),JSON.stringify({packageId:'international-health-welfare-2025-general-physics',provenance:'original_editorial',basis:'原図で表の角度範囲10〜65度を確認し、三角関数から小数2桁を独立計算。問題本文・選択肢は変更しない。',operations:[{type:'replace-text',scope:'major-question-05',from:anchor,to:anchor+trigTable(),expectedMatches:1}]},null,2)+'\n');
 const pack=createSvgPackage('international-health-welfare-2025-general-physics',import.meta.url);
 pack.add('q1-disk',700,435,'上から見た円盤。中心O、小球P、小球Qが半径方向の溝に並び、OP=PQ=l。小球の質量はともにm。','第1問・問1：張力の値は描き込んでいない。',disk());
 pack.add('q1-bulbs',700,435,'100 V用の60 W電球と100 W電球を、左では直列、右では並列につなぎ、各回路を100 V電源に接続する。','第1問・問2：直列回路と並列回路。',bulbs());
 pack.add('q1-lens',700,568,'固定された光源とスクリーンの間で、凸レンズが光源からa、bの2か所にある。a<b。','第1問・問3：2つのレンズ位置。像倍率は未記入。',lens());
 pack.add('q1-expansion',700,562,'同じ初期状態の断熱容器で左半分は気体、右半分は真空。操作Iは外力を調節し仕切りを右端へ移し、操作IIは穴を開けて自由膨張させる。','第1問・問4：操作の違い。圧力・速度の大小は未記入。',expansion());
 pack.add('q2-wedge',700,690,'左へ下る30度斜面の三角台Q、質量mのP、頂点の滑車、右側固定壁。Pから滑車、滑車から壁へ張った糸。初期高さhと台の右向き加速度Aを表示。','第2問：静止時と運動中の配置。加速度記号の原文不整合は注意書きを参照。',wedge());
 pack.add('q2-vectors',640,775,'6つの加速度ベクトル選択肢。Aはすべて右向き。斜辺arの向き、aの向き、およびAとarの長さの関係が異なる。選択肢は左から右へ①②、③④、⑤⑥の2列。','第2問・問3：30度のベクトル三角形を独立作図。',vectorChoices());
 pack.add('q3-coils',740,650,'下に1巻きコイル1、上に2巻きコイル2。対応頂点は同じ鉛直線上。コイル内の電流正方向はaからb、cからd。正の磁束は鉛直上向き。','第3問：各巻きと開放端子。線間隔・上下間隔は模式的。',coils());
 pack.add('q4-pv',700,548,'P-V図のa(V0,P0)からb(V0,αP0)へ定積変化、bからc(βV0,P0)へ断熱膨張、cからaへ定圧圧縮。','第4問：状態と進行方向。α・βの関係式は問5で求める。',pv());
 pack.add('q5-setup',700,535,'CD面への垂直入射と5本の反射回折光。0次は入射側へ戻り、左右の1次光は法線から25度、2次光の角度はθ2。','第5問[A]：上面図。付属の三角関数表はHTMLで別掲。',setup());
 pack.add('q5-geometry',700,490,'間隔dの隣接トラックに光が垂直入射し、反射回折光a、bは法線から同じ角θで平行に進む。','第5問・問1：光路差を考えるための模式図。',geometry());
 pack.add('q5-rainbows',760,963,'上は穴のあるスクリーン上の内外2つの環と外縁半径r、R。下は入射点Pから外向きにQ1、中心向きにQ2へ届く1次回折光とCD直径D1、D2、間隔L。色順は未記入。','第5問[B]：正面図と断面図。図は縮尺どおりではない。',rainbows());
 pack.add('ans-q2-balance',700,505,'P・Q・滑車を一体として見た自由物体図。水平な張力Tは右、外力fは左。床からの垂直抗力Nは上、重力(m+M)gは下。','第2問・問1：系全体の水平つり合いからf=T。',balance());
 pack.add('ans-q5-limit',740,625,'CDの内側トラックの互いに反対の点から、400 nmの外向き光と800 nmの中心向き光が、同じスクリーン半径へ届く。初期の点間隔D2が2本の横ずれの差に等しい。','第5問・問4：虹の境界の一致。縦横の縮尺は異なる。',limit());
 return pack.save('問題・原解答・学習者版の全ページを読解。図の原本から選択肢の順序/向き、コイル端子/巻き方向、三角関数表の角度範囲を意味情報として確認。独立した座標・物理式で描画し、原画像・輪郭・ピクセルは複製していない。第2問aの定義、第4問問5の指数落ちなどは修正担当へ分離しレビューを維持。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildFigures();
