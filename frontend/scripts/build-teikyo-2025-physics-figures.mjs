import {pathToFileURL} from 'node:url';
import {createSvgPackage,math,mi,rm,sub,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='teikyo-2025-general-physics';
const arrow=(a,b,extra='')=>line(...a,...b,`marker-end="url(#arrow)" ${extra}`);
const dim=(a,b)=>line(...a,...b,'marker-start="url(#arrow)" marker-end="url(#arrow)" class="axis"');
const path=(p,extra='')=>`<path d="${pointsPath(p)}" ${extra}/>`;
const label=(x,y,s,extra='')=>math(x,y,[rm(s)],extra);
const v=(x,y,s,extra='')=>math(x,y,[mi(s)],extra);
const rect=(x,y,w,h,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" ${extra}/>`;
const circle=(x,y,r,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" ${extra}/>`;
export const buoyancy=x=>Math.max(0,Math.min(1,1-x)); // units rho*S*l*g, x/l
export const submergedPeak=depth=>4*(depth-1+.5)-depth; // bottom depth/l > 1
export const separation=(t,{R=10,v0=2,F=1,m=1,k=2}={})=>R-v0*t+F*(1+k)*t*t/(2*k*m);
function walking(){
 let b=text(40,36,'図1　歩行の1サイクル（模式図）');
 for(let i=0;i<3;i++){const x=140+i*260,y=125;b+=circle(x,y,16)+line(x,y+16,x,y+94)+line(x,y+44,x-35,y+67)+line(x,y+94,x-52,y+170)+line(x,y+94,x+52,y+170,'class="accent"');}
 b+=line(45,295,795,295,'class="axis"')+arrow([218,190],[303,190])+arrow([478,190],[563,190]);
 b+=text(224,158,'左足の半周期')+text(484,158,'右足の半周期');
 b+=dim([140,343],[400,343])+dim([400,343],[660,343])+v(265,332,'A')+v(525,332,'A');
 b+=dim([140,400],[660,400])+math(375,438,[rm('2'),mi('A')])+text(40,485,'左足・右足の半周期を合わせて1サイクル。進む距離は歩幅の2倍。');return b;
}
function pendulum(){
 const O=[380,75],L=270,theta=.29,amp=.51,P=t=>[O[0]+L*Math.sin(t),O[1]+L*Math.cos(t)];
 const C=P(theta),left=P(-amp),right=P(amp),bottom=P(0);let b=text(35,36,'図2　単振り子モデル（角度は模式的に拡大）');
 b+=line(315,75,445,75)+line(...O,...bottom,'class="guide"')+line(...O,...left,'class="guide"')+line(...O,...right,'class="guide"');
 b+=path(Array.from({length:61},(_,i)=>P(-amp+2*amp*i/60)),'class="guide"')+line(...O,...C)+circle(...C,12,'fill="white"')+dot(...O);
 b+=path(Array.from({length:21},(_,i)=>[O[0]+70*Math.sin(theta*i/20),O[1]+70*Math.cos(theta*i/20)]));
 b+=v(391,198,'θ')+v(495,244,'L')+line(483,240,433,250,'class="axis"')+label(350,369,'O');
 b+=line(C[0],C[1]+12,C[0],387,'marker-end="url(#arrow)"')+math(C[0]+18,384,[mi('m'),mi('g')]);
 b+=dim([380,405],[C[0],405])+v(407,437,'x');
 for(const point of [left,right])b+=circle(...point,9,'stroke-dasharray="3 3"')+line(point[0],point[1]+12,point[0],473,'class="guide"');
 b+=line(380,450,380,478,'class="guide"')+dim([left[0],470],[380,470])+dim([380,470],[right[0],470])+v(307,508,'A')+v(437,508,'A');return b;
}
function wood(x,bottom,surface=300){let b=rect(x-34,surface,68,Math.max(125,bottom-surface+15),'fill="#f0f7fb" stroke="none"');b+=rect(x-28,bottom-110,56,110,'fill="#f1ede2"')+`<ellipse cx="${x}" cy="${bottom-110}" rx="28" ry="7" fill="#f8f5ee"/>`;return b;}
function water(a,b,y){return line(a,y,b,y,'stroke="#508095" stroke-width="2.2"');}
function woodStates(){let b=text(35,36,'図1　静止状態')+text(300,36,'図2　押し下げてから放す');
 b+=wood(125,327.5)+water(40,205,300)+dim([180,217.5],[180,327.5])+v(194,270,'l');
 b+=text(50,390,'断面積 S・高さ l')+text(50,422,'木片の密度 ρ/4');
 b+=wood(365,410)+water(285,450,300)+arrow([277,433],[277,140])+v(257,128,'x')+label(253,420,'0')+dim([417,300],[417,410])+v(429,361,'l');
 b+=arrow([472,284],[518,284])+wood(615,226)+water(536,712,300)+dim([691,226],[691,300])+v(705,273,'h');
 b+=line(284,410,403,410,'class="guide"')+text(300,468,'原点：放す瞬間の木片の底面');return b;
}
function forceGraph(answer){let b=text(35,36,answer?'(2)　浮力と底面の位置':'(2)　浮力のグラフ記入欄');
 b+=arrow([160,353],[160,95])+arrow([120,325],[694,325])+text(100,76,'浮力')+v(713,333,'x')+label(130,353,'0');
 if(answer){b+=path([[160,130],[450,325],[665,325]],'stroke="#235c86" stroke-width="3"')+math(46,139,[mi('ρSlg')])+v(445,360,'l')+text(450,390,'完全に水面から出た後は浮力0');}
 return b;
}
function submerged(){let b=text(35,36,'図3　より深い位置から放す（高さは模式図）');
 b+=wood(205,430,247)+water(70,325,247)+dim([100,247],[100,430])+math(38,350,[rm('5'),mi('l'),rm('/3')])+dim([261,320],[261,430])+v(280,381,'l');
 b+=arrow([355,278],[420,278])+wood(560,196,300)+water(455,723,300)+dim([653,196],[653,300])+math(673,253,[mi('h'),sub('2')]);
 b+=text(66,480,'初期位置：底面が水面下 5l/3')+text(455,420,'到達高さは底面から測る');return b;
}
function optics(){
 let b=text(35,36,'顕微鏡の光学配置（距離・倍率は模式的）');const cx=340,ys=[710,600,400,265,115];
 b+=line(cx,77,cx,743,'class="guide"');
 for(const [i,y] of ys.entries()){if(i===1||i===3)b+=`<path d="M250 ${y} Q340 ${y-25} 430 ${y} Q340 ${y+25} 250 ${y} Z" fill="#f0f7fb"/>`;else b+=line(275,y,405,y);}
 // Boundary rays meet at object, intermediate image and detector, not at a lens.
 for(const sign of [-1,1])b+=path([[cx,710],[cx+sign*68,600],[cx,400],[cx-sign*68,265],[cx,115]],'class="accent"');
 const names=['物体','対物レンズ','対物レンズの像','結像レンズ','撮像素子上の像'];
 ys.forEach((y,i)=>{b+=line(445,y,488,y,'class="axis"')+text(505,y+7,names[i]);});
 b+=dim([140,400],[140,710])+label(44,563,'220 mm')+text(40,790,'中間像が次のレンズの物体になります。');return b;
}
function radiation(){let b=text(35,36,'点状線源と長方形の板によるモデル');
 b+=circle(210,247,142,'class="guide"')+dot(210,247)+text(45,72,'放射性物質')+math(65,110,[mi('I'),rm(' [Bq]')]);
 b+=`<path d="M505 169 L574 133 L574 357 L505 394 Z" fill="#eef3f6"/>`;
 b+=dim([210,247],[491,247])+math(369,292,[mi('R'),rm(' [m]')]);
 b+=line(505,408,574,371,'marker-start="url(#arrow)" marker-end="url(#arrow)"')+math(555,431,[mi('x'),rm(' [m]')]);
 b+=dim([616,133],[616,357])+math(635,249,[mi('y'),rm(' [m]')])+math(469,95,[mi('W'),rm(' [kg]')]);
 b+=text(35,473,'試験問題の近似モデルです。実際の被ばく評価には用いません。');return b;
}
function engine(){let b=text(35,36,'A　4気筒と4行程（配置・形状は模式図）');
 const labels=['1 圧縮','3 吸気','2 排気','4 燃焼'];
 for(let i=0;i<4;i++){const x=70+i*190,cy=[140,190,140,190][i];
 b+=text(x,80,labels[i])+path([[x,115],[x,245],[x+115,245],[x+115,115]])+line(x,115,x+115,115);
 b+=rect(x+8,cy,99,19,'fill="#e3eaf0"')+line(x+57,cy+19,x+57,313)+circle(x+57,325,12,'fill="white"');
 b+=arrow([x+138,i%2===0?226:140],[x+138,i%2===0?140:226]);
 if(i===1)b+=arrow([x+25,98],[x+25,158],'stroke="#337f99"');
 if(i===2)b+=arrow([x+87,158],[x+87,98],'stroke="#337f99"');
 if(i===3)b+=path([[x+45,101],[x+60,127],[x+54,138],[x+70,155]],'class="accent"');
 }
 b+=line(95,325,750,325,'stroke-width="4"')+text(302,361,'共通のクランクシャフト');
 b+=text(35,403,'点火順序 1 → 3 → 2 → 4。各気筒で吸気・圧縮・燃焼・排気を繰り返す。');
 b+=line(35,433,820,433,'class="guide"')+text(35,472,'B　往復運動を回転運動へ変える機構');
 const center=[617,659],pin=[658,597],piston=[281,659];
 b+=path([[160,593],[348,593],[348,725],[160,725]])+rect(261,600,40,118,'fill="#e3eaf0"')+line(...piston,...pin,'stroke-width="8"')+circle(...center,86)+line(...center,...pin)+dot(...center)+circle(...pin,7,'fill="white"');
 b+=dim([186,766],[336,766])+text(195,798,'ピストンの往復');
 b+=text(369,553,'コネクティングロッド')+line(493,568,485,624,'class="axis"');
 b+=text(625,806,'回転中心')+line(655,780,617,671,'class="axis"');
 b+=`<path d="M 692 700 A86 86 0 0 1 574 733" marker-end="url(#arrow)"/>`;return b;
}
function spheres(){let b=text(35,36,'力が働き始める前：Aは原点Oへ向かう');
 const y=230,A=174,O=363,B=612,r=24;
 b+=arrow([75,y],[785,y])+v(800,238,'x')+circle(A,y,r,'fill="white"')+circle(B,y,r,'fill="#eef3f6"')+dot(O,y);
 b+=text(A-7,291,'A')+text(B-7,291,'B')+label(O-9,271,'O');
 b+=v(A-9,173,'m')+math(B-20,173,[mi('k'),mi('m')]);
 b+=arrow([A+r+10,197],[A+133,197])+math(A+61,178,[mi('v'),sub('0')]);
 b+=dim([O,115],[B,115])+math(477,99,[mi('R'),sub('0')]);
 for(const x of [A,B]){b+=dim([x-r,334],[x+r,334])+math(x-19,376,[rm('2'),mi('r'),sub('0')]);}
 b+=text(35,429,'球の半径は r₀。図の 2r₀ は直径です。Bは初め静止しています。');return b;
}
export function build(){const p=createSvgPackage(packageId,import.meta.url);
 p.add('q1-walking-cycle',840,520,'左足と右足の半周期を合わせた歩行1サイクル。歩幅Aずつ進み、1サイクルの移動距離は2A。','図1：歩行を単振り子運動で考える模式図。',walking());
 p.add('q1-pendulum-model',760,545,'長さLの単振り子。鉛直からの角θ、最下点Oからの水平変位x、左右の振幅A、おもりに働く重力mg。','図2：角度は模式的に拡大。数値条件のモデル上の注意は本文上部に記載。',pendulum());
 p.add('q2-wood-states',780,505,'円柱状木片の静止状態と、上面が水面と一致した位置から放して底面が水面上hまで上昇する状態。xの原点は放す瞬間の底面。','図1・図2：深さと高さはいずれも木片の底面を基準にします。',woodStates());
 p.add('q2-force-graph',760,425,'縦軸が浮力、横軸が木片の底面位置xの空の座標軸。原点0のみを示し、解答曲線や交点は記入していない。','(2)の記入用座標軸。',forceGraph(false));
 p.add('q2-submerged-rise',780,515,'底面が水面下5l/3にある長さlの円柱を放す。右は底面が水面上h2にある最高点。数値的な到達高さは図に記入しない。','図3：(7)の解答値は元データの誤りがあり確認中です。',submerged());
 p.add('q3-microscope-optics',800,825,'物体、対物レンズ、中間像、結像レンズ、撮像素子の順に配置。物体から中間像まで220mm。光は各レンズを通って次の像へ集まる。','光学配置の模式図。求める距離や倍率の答えは記入していません。',optics());
 p.add('q4-radiation-geometry',810,510,'点状の放射性物質Iから距離Rに、幅x、高さy、質量Wの長方形の板を配置した放射線量の近似モデル。','図1：試験で与えられた幾何モデル。係数は続くHTML表を参照。',radiation());
 p.add('q5-engine-diagrams',870,850,'四気筒の吸気・圧縮・燃焼・排気と共通クランクシャフト。点火順1、3、2、4。下はピストンと連接棒が回転クランクに接続する機構。','A：4気筒の状態。B：往復運動と回転運動の対応。',engine());
 p.add('q6-repulsive-spheres',850,465,'原点Oより左にある質量mの球Aが初速度v0で右へ進む。質量kmの球BはR0で静止。両球の直径は2r0。','斥力が働き始める前の配置。座標は球の中心です。',spheres());
 p.add('ans-q2-force-graph',800,430,'浮力は底面位置xが0からlの間でρSlgから0まで直線的に減少し、完全に水面から出た後は0になる。','(2)：浮力の仕事は、グラフとx軸の間の面積です。',forceGraph(true));
 p.save('公開問題の条件から独立作図。原本cropの複製・トレースなし。問題用グラフは空欄、解答図だけに曲線を描く。');}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)build();
