import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,math,mi,rm,sub,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='kitasato-2025-general-physics';
const mid='text-anchor="middle"',arrow='marker-end="url(#arrow)"';
const M=(x,y,s)=>math(x,y,[mi(s)]),N=(x,y,s)=>math(x,y,[rm(s)]);
const indexed=(x,y,s,i)=>math(x,y,[mi(s),sub(i)]);
const rect=(x,y,w,h,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" ${extra}/>`;
const dim=(x1,y1,x2,y2)=>line(x1,y1,x2,y2,'class="axis" marker-start="url(#arrow)" marker-end="url(#arrow)"');
export const magneticRadius=a=>5*a/4;
export const magneticHit=(a,ell)=>a/2+(ell-a/2)*4/3;
export function magneticPoints(a=1,n=65){const R=magneticRadius(a);return Array.from({length:n},(_,i)=>{const z=a*i/(n-1);return[z,R-Math.sqrt(R*R-z*z)];});}
export function oscillator(m,k,a){const w=Math.sqrt(k/m),A=m*a/k,T=3*Math.PI/w;return{w,A,T,elastic:2*m*m*a*a/k,afterAmplitude:2*A,maxSpeed:2*A*w,deceleration:2*a,stopTime:T/2,stopX:2*A,stopV:-4*A*w,finalAmplitude:Math.sqrt(20)*A,distance:17*a*T*T/12};}
function rods(){
 const foot=[150,395],top=[350,395-200*Math.sqrt(3)],contact=[250,395-100*Math.sqrt(3)],right=[350,395];
 let s=line(75,395,525,395);for(let x=85;x<520;x+=16)s+=line(x,395,x-10,409,'class="axis"');
 s+=line(...foot,...top,'stroke-width="6"')+line(...right,...contact,'stroke-width="6"')+dot(...contact);
 s+=M(287,93,'A')+M(358,296,'B')+math(400,328,[rm('2'),mi('W')])+M(182,220,'W');
 // Equal ticks identify the two halves of A without introducing an answer force.
 for(const t of [.25,.75]){const x=150+200*t,y=395-200*Math.sqrt(3)*t;s+=line(x-9,y-5,x+9,y+5);}
 s+=`<path d="M192 395 A42 42 0 0 0 171 358.627"/>`+N(192,374,'60°');
 s+=`<path d="M308 395 A42 42 0 0 1 329 358.627"/>`+N(265,374,'60°');
 s+=text(300,447,'粗い水平面',mid)+text(300,30,'棒Aの中点に棒Bの上端が接する',mid);
 return s;
}
function capacitor(){
 let s='';for(let i=0;i<3;i++){const x=45+250*i,top=i===0?150:95,bottom=240;
  if(i===2)s+=rect(x,top,145,bottom-top,'fill="#eaf0f4" stroke="none"');
  s+=line(x,top,x+145,top,'stroke-width="4"')+line(x,bottom,x+145,bottom,'stroke-width="4"');
  s+=dim(x+178,top,x+178,bottom)+indexed(x+190,(top+bottom)/2+8,'d',i===0?'1':'2');
  if(i===1)s+=line(x,150,x+145,150,'class="guide"');
  if(i===2)s+=math(x+70,170,[mi('D')],mid)+math(x+70,210,[mi('ε'),sub('r')],mid);
  s+=text(x+75,300,['(a) 充電後','(b) 極板を移動','(c) 誘電体を充填'][i],mid);
 }return s+text(410,38,'外部と接続しないコンデンサー',mid);
}
function doppler(){
 let s=line(90,200,670,200,'class="guide"');
 s+=dot(95,200)+M(85,180,'O')+text(95,245,'観測者',mid);
 s+=rect(267,183,34,34,'fill="#eaf0f4"')+M(277,167,'S')+text(285,245,'音源',mid);
 s+=line(315,157,395,157,arrow)+M(346,141,'v');
 s+=dot(485,200)+M(478,179,'p')+text(485,245,'ここから速さが半分',mid);
 s+=line(665,85,665,270,'stroke-width="4"');for(let y=88;y<270;y+=17)s+=line(666,y,680,y-10,'class="axis"');
 return s+text(665,62,'壁',mid)+text(380,310,'位置関係の模式図',mid);
}
function vessels(){
 let s=rect(90,110,180,200,'fill="#f7f9fb" stroke-width="5"')+rect(460,90,220,240,'fill="#f7f9fb" stroke-width="5"');
 s+=line(270,200,348,200)+line(382,200,460,200)+line(270,214,348,214)+line(382,214,460,214);
 s+=`<path d="M348 189 L382 225 L382 189 L348 225 Z" fill="white"/>`+line(365,189,365,164)+line(351,164,379,164);
 s+=text(365,142,'コック',mid)+M(174,80,'A')+M(564,60,'B');
 s+=math(180,181,[mi('P'),rm(' , '),mi('V')],mid)+math(180,239,[mi('T')],mid)+math(570,181,[rm('2'),mi('P'),rm(' , 2'),mi('V')],mid);
 return s+text(385,375,'断熱容器と細い管（混合前・模式図）',mid);
}
function cart(){
 let s=rect(110,85,440,215)+line(65,341,620,341);
 for(const x of [185,480])s+=`<circle cx="${x}" cy="320" r="20" fill="#edf2f6"/><circle cx="${x}" cy="320" r="5"/>`;
 s+=line(110,256,153,256);const coil=Array.from({length:121},(_,i)=>[153+i*1.15,256+16*Math.sin(i*Math.PI/10)]);
 s+=`<path d="${pointsPath(coil)}"/>`+line(291,256,333,256)+rect(333,230,64,70,'fill="#edf2f6"')+M(355,274,'A');
 s+=M(208,213,'K')+M(260,190,'k')+M(404,265,'m')+text(121,125,'壁')+text(466,282,'床');
 s+=line(568,167,676,167,arrow)+M(610,147,'a')+text(622,204,'正の向き',mid);
 return s+text(330,55,'台車',mid)+text(350,389,'なめらかな床・初めはばねの自然長',mid);
}
function electric(){
 // yz side elevation: x points into the page; no answer trajectory is drawn.
 let s=line(45,250,703,250,'class="axis" '+arrow)+line(600,389,600,59,'class="axis" '+arrow);
 s+=rect(594,82,12,285,'fill="#eaf0f4"')+line(600,389,600,59,'class="axis" '+arrow)+M(690,279,'z')+M(612,56,'y')+M(618,93,'S');
 s+=line(127,177,127,323,'stroke-width="4"')+line(191,177,191,237,'stroke-width="4"')+line(191,263,191,323,'stroke-width="4"');
 s+=M(115,152,'A')+M(179,152,'B')+dot(137,250)+M(145,232,'P');
 s+=line(330,181,465,181,'stroke-width="4"')+line(330,319,465,319,'stroke-width="4"')+M(379,148,'C')+M(362,351,'D');
 s+=dot(397.5,250)+M(401,278,'p')+line(397.5,184,397.5,317,'class="guide"');
 s+=dim(85,177,85,323)+M(58,288,'a')+dim(127,355,191,355)+indexed(148,389,'d','1');
 s+=dim(294,181,294,319)+indexed(250,288,'d','2')+dim(330,110,465,110)+M(391,99,'a');
 s+=dim(397.5,424,600,424)+M(490,414,'ℓ')+line(397.5,327,397.5,434,'class="guide"')+line(600,370,600,434,'class="guide"');
 s+=`<circle cx="600" cy="250" r="9" fill="white"/>`+line(594,244,606,256)+line(594,256,606,244)+M(574,280,'O')+M(618,238,'x');
 return s+text(375,32,'電場を加える場合（側面図）',mid)+text(375,478,'下側の極板が高電位（軌道は未記入）',mid);
}
function magnetic(answer=false){
 const a=answer?120:110,start=answer?220:250,base=answer?420:330,screen=answer?520:490;
 const R=magneticRadius(a),end=start+a,top=base-a/2,center=base-R;
 const S=(z,x)=>[start+z,base-x],trajectory=magneticPoints(a).map(p=>S(...p));
 let s=rect(start,base-a/2,a,a,'fill="#f7f9fb" stroke="#92a5b5"')+line(70,base,screen+86,base,'class="axis" '+arrow);
 s+=rect(screen-4,answer?85:63,8,base+65-(answer?85:63),'fill="#eaf0f4"')+line(screen,base+70,screen,answer?58:40,'class="axis" '+arrow);
 s+=M(screen+68,base+30,'z')+M(screen+28,65,'x')+M(screen+17,99,'S')+M(screen-30,base+30,'O');
 s+=dot(start+a/2,base)+M(start+a/2-7,base+30,'p')+M(start+a/2-7,base+a/2+28,'C');
 s+=`<path data-trajectory="magnetic" d="${pointsPath(trajectory)}" stroke-width="2.7"/>`+dot(end,top)+M(answer?end-20:end+13,answer?top+35:top+25,'r');
 s+=line(start,base,start,center,'class="guide"');
 s+=dim(start+a/2,base+a/2+64,screen,base+a/2+64)+M((start+a/2+screen)/2,base+a/2+55,'ℓ');
 if(!answer){
  s+=line(110,base-62,110,base+62,'stroke-width="4"')+line(175,base-62,175,base-12,'stroke-width="4"')+line(175,base+12,175,base+62,'stroke-width="4"');
  s+=M(97,base-82,'A')+M(161,base-82,'B')+dot(123,base)+math(125,base-17,[mi('P'),rm('′')]);
  s+=line(end,top,end+55,top-55*4/3,arrow)+dim(start,base-a/2-44,end,base-a/2-44)+M(start+a/2-7,base-a/2-56,'a');
  s+=line(end+4,top,screen-17,top,'class="guide"')+math(screen+20,top+8,[mi('a'),rm('/2')]);
  s+=`<circle cx="${screen}" cy="${base}" r="8" fill="white"/>`+dot(screen,base)+M(screen+18,base-8,'y');
  return s+text(380,31,'磁場を加える場合（上側から見る）',mid);
 }
 const hit=base-(a/2+(screen-end)*4/3);
 s+=line(end,top,screen,hit,'stroke-width="2.7"')+dot(screen,hit)+line(start,center,end,top,'class="accent"')+dot(start,center);
 s+=line(start,center,end,center,'class="guide"')+line(end,center,end,top,'class="guide"')+line(end,top,screen,top,'class="guide"');
 s+=text(start-13,center-28,'円の中心','text-anchor="end"')+M(start-38,base-56,'R')+M(start+38,center+66,'R');
 s+=`<path d="M${start} ${center+31} A31 31 0 0 0 ${start+24.8} ${center+18.6}"/>`+M(start+15,center+52,'θ');
 s+=line(end,top,end+72,top,'class="accent" '+arrow)+line(end+72,top,end+72,top-96,'class="accent" '+arrow);
 s+=math(end+77,top-46,[mi('v'),sub('1'),rm(' sin '),mi('θ')])+math(end+26,top+35,[mi('v'),sub('1'),rm(' cos '),mi('θ')]);
 s+=`<path d="M${end+29} ${top} A29 29 0 0 0 ${end+17.4} ${top-23.2}"/>`+M(end+38,top-13,'θ');
 s+=line(end,top,end+72,top-96,arrow)+math(end+130,top-145,[mi('v'),sub('1')])+math(screen+105,top+40,[mi('a'),rm('/2')]);
 s+=dim(screen+90,top,screen+90,base)+line(screen+6,base,screen+98,base,'class="guide"')+line(screen+48,top,screen+98,top,'class="guide"');
 s+=math(start+a/2,center-18,[mi('a')],mid)+math(screen+60,center+20,[mi('R'),rm(' − '),mi('a'),rm('/2')]);
 s+=line(end+4,center,screen+44,center,'class="guide"')+line(end+4,top,screen+44,top,'class="guide"')+dim(screen+45,center,screen+45,top);
 return s+text(380,29,'円弧の半径と出口での接線（独立計算した補助図）',mid);
}
export function build(){const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('q1-rods-equilibrium',600,475,'長さが2対1の棒AとB。両方が粗い水平面と60度をなし、B上端はA中点に接触する。重さはAがW、Bが2W。','図1　2本の棒のつり合い',rods());
 pack.add('q3-capacitor-stages',825,335,'孤立コンデンサーの極板間隔をd1からd2に変え、次に間隔d2全体を比誘電率εrの誘電体Dで満たす3段階。','図2　極板移動と誘電体の挿入（模式図）',capacitor());
 pack.add('q4-doppler-layout',760,345,'観測者O、右向きに進む音源S、速度変更点p、壁の順に一直線に並ぶ。音源はpで速さをvからv/2に変える。','図3　音源・観測者・壁の位置関係',doppler());
 pack.add('q5-insulated-vessels',760,410,'断熱容器Aは圧力P・体積V・温度T、容器Bは圧力2P・体積2V。細い管のコックでつながる混合前の配置。','図4　断熱容器とコック（模式図）',vessels());
 pack.add('q6-spring-cart',735,420,'台車の左壁にばねKを固定し、なめらかな床上の小物体Aをつなぐ。初めは自然長で、台車の加速度aと正方向は右。','図5　台車上のばね振り子（初期状態）',cart());
 pack.add('q7-electric-plates-screen',755,510,'yz平面での配置。極板A、穴のあるB、上側Cと下側D、スクリーンSの順に並び、CD中央pから原点Oまでがℓ。Dの電位がCより高く、xの正方向は紙面の奥。軌道は未記入。','図6　電場とスクリーンの配置（側面模式図）',electric());
 pack.add('q7-magnetic-arc',755,485,'y軸正側から見たxz平面。粒子P′はCD内を円弧で進み、x=a/2の点rで出て接線方向へ進む。半径とスクリーン到達座標は示さない。','図7　磁場内の円弧と出口r（模式図）',magnetic());
 pack.add('ans-q7-magnetic-geometry',755,575,'入射点の真上に円の中心がある。出口rまでのz方向の長さaとx方向の変位a/2から、半径RとR−a/2の直角三角形を作る。出口の接線の角θを速度成分とスクリーンへの直線に対応させる。','円弧から直線運動への接続（解説用補助図）',magnetic(true));
 return pack.save('問題条件と独立計算から作図。原本画像・原本文章は複製していない。元HTMLの転記・解説補足・権利と科目担当レビューは未完了。');}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))build();
