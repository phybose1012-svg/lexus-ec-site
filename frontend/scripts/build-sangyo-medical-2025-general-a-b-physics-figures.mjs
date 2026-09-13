import {pathToFileURL} from 'node:url';
import {createSvgPackage,mi,rm,sub,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='sangyo-medical-2025-general-a-b-physics';
const arrow='marker-end="url(#arrow)"',dim='class="axis" marker-start="url(#arrow)" marker-end="url(#arrow)"';
const path=(pts,extra='')=>`<path d="${pointsPath(pts)}" ${extra}/>`;
const arc=(cx,cy,r,start,end)=>Array.from({length:65},(_,i)=>{const t=start+(end-start)*i/64;return[cx+r*Math.sin(t),cy-r*Math.cos(t)];});
const label=(x,y,s)=>math(x,y,[mi(s)]);
const named=(p,s,dx=10,dy=-12)=>dot(...p)+label(p[0]+dx,p[1]+dy,s);
export const track={a:100,d:60,phi:Math.acos(.75),C:[390,320],O:[762,280]};
export const crestNormal=(h,d,a,theta)=>3*Math.cos(theta)-2*h/a+2*d/a;
export const hollowNormal=(h,a,theta)=>2*h/a-2-3*Math.cos(theta);
export const grating={x:310,slits:[120,180,240,300,360],plateIndices:[0,2,4],screenOrders:[3,2,1,0,1,2,3]};
// Dimensionless P,V examples obey the stated processes. Ratios are not exam givens.
export const gamma=5/3;
export const cycles=[
 {name:'I',states:{A:[3,1],B:[1.5,2**gamma],C:[1.5,6],D:[3,6/2**gamma]},types:['adiabatic','isochoric','adiabatic','isochoric'],notes:['A→B・C→D：断熱過程','B→C・D→A：定積過程']},
 {name:'II',states:{A:[3,1],B:[1.8,1],C:[1.8/3**(1/gamma),3],D:[3/3**(1/gamma),3]},types:['isobaric','adiabatic','isobaric','adiabatic'],notes:['A→B・C→D：定圧過程','B→C・D→A：断熱過程']},
 {name:'III',states:{A:[3,1],B:[1,3**gamma],C:[1.6,3**gamma],D:[3,1.6**gamma]},types:['adiabatic','isobaric','adiabatic','isochoric'],notes:['A→B・C→D：断熱過程','B→C：定圧　D→A：定積']},
 {name:'IV',states:{A:[3,1/3],B:[1.8,1/1.8],C:[1,1.8**(gamma-1)],D:[3/1.8,1.8**(gamma-1)/(3/1.8)]},types:['isothermal','adiabatic','isothermal','adiabatic'],notes:['A→B・C→D：等温過程','B→C・D→A：断熱過程']},
];
export function processPoints(cycle,index){
 const names=['A','B','C','D'],p=cycle.states[names[index]],q=cycle.states[names[(index+1)%4]],type=cycle.types[index];
 return Array.from({length:65},(_,i)=>{const t=i/64,V=p[0]+(q[0]-p[0])*t;return[V,type==='adiabatic'?p[1]*(p[0]/V)**gamma:type==='isothermal'?p[1]*p[0]/V:p[1]+(q[1]-p[1])*t];});
}
export function draw(){
 const pack=createSvgPackage(packageId,import.meta.url);
 {
  const {a,d,phi,C,O}=track,[cx,cy]=C,base=cy+d,A=arc(cx,cy,a,-phi,-phi)[0],B=arc(cx,cy,a,phi,phi)[0],D=[cx,cy-a],S=[80,90],G=[O[0],base],E=[O[0],base-2*a];
  // Quadratic joins have the circle's tangent slope; each connecting track is concave up in physical coordinates.
  const m=Math.tan(phi),joinX=B[0]+(base-B[1])/m;
  let b=`<path d="M${S} Q230,${A[1]+(A[0]-230)*m} ${A}" stroke-width="2.6"/>`+path(arc(cx,cy,a,-phi,phi),'stroke-width="2.6"')+`<path d="M${B} Q${joinX},${base} ${G}" stroke-width="2.6"/>`+path(arc(O[0],O[1],a,Math.PI,0),'stroke-width="2.6"');
  b+=line(50,base,890,base,'class="guide"')+line(...C,...A,'class="guide"')+line(...C,...B,'class="guide"')+line(...C,...D,'class="guide"')+line(...G,...E,'class="guide"');
  b+=line(55,S[1],55,base,dim)+label(28,240,'h')+line(55,S[1],S[0],S[1],'class="guide"');
  b+=line(cx-35,cy,cx-35,base,dim)+label(cx-63,cy+43,'d')+line(cx-35,cy,cx,cy,'class="guide"');
  b+=path(arc(cx,cy,42,-phi,0),'class="accent"')+path(arc(cx,cy,55,0,phi),'class="accent"')+label(cx-32,cy-63,'φ')+label(cx+17,cy-73,'φ');
  b+=label(cx+50,cy-15,'a')+label(O[0]-35,O[1]+58,'a');
  for(const[p,s,dx,dy]of[[S,'S',-12,-17],[A,'A',-28,-12],[B,'B',12,-12],[D,'D',-10,-18],[C,'C',8,22],[G,'G',-10,30],[O,'O',12,7],[E,'E',-28,5]])b+=named(p,s,dx,dy);
  pack.add('q1-track-diagram',940,440,'高さhのSから円弧ADBを経てGへ下る軌道。円弧の中心Cは高さd、半径a、両端の角はφ。右側の半円筒は中心O、直径GE、半径a。','図1　軌道のつながりと高さ（模式図）',b);
 }
 {
  let b='';
  cycles.forEach((c,k)=>{
   const ox=30+(k%2)*390,oy=20+Math.floor(k/2)*395,maxP=Math.max(...Object.values(c.states).map(s=>s[1])),map=([v,p])=>[ox+40+v*80,oy+280-p/maxP*210];
   b+=text(ox+185,oy+22,`(${c.name})`,'text-anchor="middle"')+line(ox+40,oy+280,ox+330,oy+280,arrow)+line(ox+40,oy+280,ox+40,oy+40,arrow)+label(ox+19,oy+48,'P')+label(ox+339,oy+287,'V')+math(ox+20,oy+307,[rm('0')]);
   for(let i=0;i<4;i++){const pts=processPoints(c,i).map(map);b+=path(pts,`data-process="${c.types[i]}"`)+line(...pts[30],...pts[36],arrow);}
   for(const[n,p]of Object.entries(c.states)){const[x,y]=map(p),left=n==='B'||n==='C',lowerLeft=n==='B'&&(k===1||k===3);b+=named([x,y],n,lowerLeft?-43:left?-28:9,lowerLeft?17:n==='A'?21:-10);}
   c.notes.forEach((s,i)=>{b+=text(ox+35,oy+334+i*28,s);});
  });
  pack.add('q2-pv-cycle-diagrams',810,810,'4種類のPVサイクルをA、B、C、D、Aの順で回る。Iは断熱と定積、IIは定圧と断熱、IIIは断熱・定圧・断熱・定積、IVは等温と断熱。','図2　4種類のサイクル（軸の尺度は模式的）',b);
 }
 function gratingBody(plates){
  const {x,slits,plateIndices}=grating;let b=text(x,60,'回折格子','text-anchor="middle"');
  const bounds=[80,...slits.flatMap(y=>[y-7,y+7]),402];for(let i=0;i<bounds.length;i+=2)b+=line(x,bounds[i],x,bounds[i+1],'stroke-width="7"');
  const angle=plates?.19:.28,dy=250*Math.tan(angle);
  for(const [i,y]of slits.entries()){
   b+=line(x,y,x+250,y-dy,arrow);
   if(plates&&plateIndices.includes(i))b+=`<rect data-plate-index="${i}" x="${x-26}" y="${y-16}" width="16" height="32" fill="#eaf0f5"/>`;
  }
  b+=line(80,240,260,240,arrow)+text(112,217,'入射光')+line(x+10,240,x+310,240,'class="guide"');
  b+=path(Array.from({length:30},(_,i)=>{const t=angle*i/29;return[x+145*Math.cos(t),240-145*Math.sin(t)];}),'class="accent"')+math(x+164,229,[mi('θ'),sub(plates?'B':'A')]);
  if(!plates)b+=line(x-47,300,x-47,360,dim)+label(x-80,338,'d')+line(x-53,300,x-10,300,'class="guide"')+line(x-53,360,x-10,360,'class="guide"');
  else b+=text(52,119,'透明平板')+line(147,124,x-32,120,'class="guide"')+text(52,145,'一つおきに挿入');
  return b;
 }
 pack.add('q3-grating-geometry',720,450,'同じ幅・等間隔dのスリットへ垂直に光が入る。1次明線へ向かう光の方向と直進方向の間の角がθA。','図3-1　回折格子と回折角（角度・幅は模式的）',gratingBody(false));
 {
  let b=text(200,80,'回折格子','text-anchor="middle"')+text(570,45,'スクリーン','text-anchor="middle"')+line(200,105,200,335,'stroke-width="5"')+line(565,70,565,365,'stroke-width="2.4"')+line(45,220,165,220,arrow)+text(55,198,'入射光')+line(205,220,565,220,'class="guide"');
  grating.screenOrders.forEach((n,i)=>{const y=100+40*i;b+=`<rect x="568" y="${y-3}" width="36" height="6" fill="#b28736" stroke="none"/>`+math(625,y+8,[mi('m'),sub(n)]);});
  b+=line(200,390,565,390,dim)+label(376,420,'L')+line(200,335,200,398,'class="guide"')+line(565,365,565,398,'class="guide"');
  pack.add('q3-screen-pattern',720,450,'回折格子と平行なスクリーンが距離Lにある。直進方向のm0を中心に、両側へm1、m2、m3の明線が対称に並ぶ。','図3-2　平板を入れる前の明線（模式図）',b);
 }
 pack.add('q3-alternate-slit-plates',720,450,'光の入射側で一つおきのスリット直前に同じ厚さの透明平板を入れる。新しい最寄り明線へ向かう光の回折角がθB。','図3-3　平板を交互に入れた回折格子（模式図）',gratingBody(true));
 {
  const C=[380,365],R=210,t=.7,P=arc(...C,R,-t,-t)[0],u=[-Math.sin(t),-Math.cos(t)];
  let b=path(arc(...C,R,-1.12,.35),'stroke-width="2.6"')+line(...C,...P,'class="guide"')+line(...C,C[0],C[1]-R,'class="guide"')+dot(...P)+named(C,'C',12,18)+label(C[0]-10,C[1]-R-18,'D');
  b+=line(...P,P[0]+u[0]*110,P[1]+u[1]*110,arrow)+label(150,105,'N');
  b+=line(...P,P[0],P[1]+130,arrow)+label(P[0]-43,P[1]+151,'mg');
  b+=line(...P,P[0]-u[0]*105,P[1]-u[1]*105,arrow)+line(315,284,536,215,'class="guide"')+math(545,224,[mi('mg'),rm(' cos '),mi('θ')]);
  b+=line(...P,P[0]+90*Math.cos(t),P[1]-90*Math.sin(t),arrow)+label(333,136,'v');
  b+=path(arc(...C,50,-t,0),'class="accent"')+label(349,303,'θ')+label(282,312,'a');
  b+=line(P[0]+5,P[1],500,P[1],'class="guide"')+line(C[0]+5,C[1],500,C[1],'class="guide"')+line(500,P[1],500,C[1],dim)+math(520,289,[mi('a'),rm(' cos '),mi('θ')]);
  b+=text(60,435,'垂直抗力は中心と反対向き。重力の中心向き成分から差し引く。');
  pack.add('a1-circular-arc-forces',780,470,'円弧外側の物体に重力mgが鉛直下向き、垂直抗力Nが中心Cと反対向きに働く。中心向きの合力はmg cosθ−N。','外側の円弧：中心向きの力を整理する',b);
 }
 {
  const O=[300,360],R=200,t=.7,P=arc(...O,R,t,t)[0],inward=[-Math.sin(t),Math.cos(t)];
  let b=path(arc(...O,R,0,1.65),'stroke-width="2.6"')+line(...O,...P,'class="guide"')+line(...O,O[0],O[1]-R,'class="guide"')+dot(...P)+named(O,'O',-28,18)+label(O[0]-10,O[1]-R-18,'E');
  b+=line(...P,P[0]+inward[0]*95,P[1]+inward[1]*95,arrow)+math(346,245,[mi('N'),rm('′')]);
  b+=line(...P,P[0],P[1]+125,arrow)+label(P[0]+13,P[1]+146,'mg');
  b+=line(P[0]+35,P[1]+10,P[0]+35+inward[0]*105,P[1]+10+inward[1]*105,'class="guide" '+arrow)+math(490,281,[mi('mg'),rm(' cos '),mi('θ'),rm('′')]);
  b+=line(...P,P[0]-95*Math.cos(t),P[1]-95*Math.sin(t),arrow)+math(332,128,[mi('v'),rm('′')]);
  b+=path(arc(...O,52,0,t),'class="accent"')+math(315,298,[mi('θ'),rm('′')])+label(370,320,'a');
  b+=line(210,P[1],P[0]-5,P[1],'class="guide"')+line(210,O[1],O[0]-5,O[1],'class="guide"')+line(210,P[1],210,O[1],dim)+math(70,290,[mi('a'),rm(' cos '),mi('θ'),rm('′')]);
  b+=text(50,418,'内側では、垂直抗力と重力の成分がともに中心向き。')+text(50,449,'点線矢印は重力の中心向き成分（見やすく平行移動）。');
  pack.add('a1-hollow-forces',780,480,'半円筒の上半分では垂直抗力N′と重力の中心向き成分mg cosθ′が同じ向き。重力成分の点線矢印は平行移動して示す。','半円筒の内側：中心向きの力を加える',b);
 }
 return pack.save(['条件から独立作図。制限付き原本cropの埋込み・トレースなし。','接続軌道・円弧・PV曲線・方向・スリット配置を数式で生成。数値比は模式図のためで問題への追加条件ではない。','φは本文のvarphiと一致。回答値は問題図へ入れない。力の大きさ・角度・平板の厚さは模式的。人間の科目・権利レビューは未完了。']);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)draw();
