// Independent geometry/data plotting. Never trace source-page pixels.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,mi,rm,sub,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='kansai-medical-2025-general-early-physics';
export const intervalsCm=[2,3.5,5,6.6,8,9.7,11.2,12.8,14.1,15.8];
export const totalCm=intervalsCm.reduce((a,x)=>[...a,a.at(-1)+x],[0]);
export function fitIntervals(){const n=intervalsCm.length,x=5.5,y=intervalsCm.reduce((a,b)=>a+b)/n;const slope=intervalsCm.reduce((s,v,i)=>s+(i+1-x)*(v-y),0)/intervalsCm.reduce((s,_,i)=>s+(i+1-x)**2,0);return {slope,intercept:y-slope*x};}
export function dcOrbit(r0=1,rPlus=1.4){
 if(!(rPlus>r0&&r0>0))throw Error('Positive charge gains energy entering D2');
 const crossings=[r0,r0-2*rPlus,3*r0-2*rPlus,3*r0-4*rPlus];
 const arcs=[{radius:rPlus,cy:r0-rPlus,a:Math.PI/2,b:-Math.PI/2},{radius:r0,cy:2*r0-2*rPlus,a:-Math.PI/2,b:-3*Math.PI/2},{radius:rPlus,cy:3*r0-3*rPlus,a:Math.PI/2,b:-Math.PI/2}];
 return {crossings,arcs};
}
const center='text-anchor="middle"',arrow='marker-end="url(#arrow)"';
const style='<style>text{font-size:20px}.math{font-size:28px}.blue{stroke:#4c7796;stroke-width:2.2}.gold{stroke:#af863e;stroke-width:2.2}</style>';
const sample=(f,a,b,n=80)=>Array.from({length:n+1},(_,i)=>f(a+(b-a)*i/n));
const poly=(pts,attr='')=>`<path d="${pointsPath(pts)}" ${attr}/>`;
const label=(x,y,s,dx=10,dy=-10)=>dot(x,y)+math(x+dx,y+dy,[mi(s)]);
function apparatus(){
 let s=text(260,34,'図1　記録装置（模式図）',center);
 s+='<rect x="60" y="412" width="116" height="14" fill="#eef3f6"/><rect x="90" y="80" width="8" height="332" fill="#eef3f6"/>';
 s+=line(94,222,231,222)+line(94,229,231,229);
 s+='<rect x="188" y="188" width="85" height="78" fill="#eaf0f4"/><rect x="221" y="82" width="15" height="301" fill="#fffdf4"/><rect x="216" y="207" width="25" height="20" fill="#fff"/>';
 s+=line(228,383,228,395)+'<circle cx="228" cy="409" r="19" fill="#eaf0f4"/>';
 s+=line(279,211,306,193)+text(316,191,'記録タイマー')+line(241,301,307,282)+text(318,284,'テープ')+line(250,409,304,383)+text(318,385,'おもり');
 s+=text(260,479,'図2　打点と測る区間',center)+'<rect x="39" y="611" width="442" height="40" fill="#fffdf4"/>';
 // Odd points interpolate measured even points; the tape is explicitly schematic.
 const xs=Array.from({length:7},(_,n)=>54+370*(n%2?(totalCm[(n-1)/2]+totalCm[(n+1)/2])/2:totalCm[n/2])/totalCm[3]);
 for(let n=0;n<7;n++)s+=dot(xs[n],625)+math(xs[n],680,[rm(n)],center);
 for(const [n,y] of [[2,585],[4,556],[6,527]])s+=line(xs[0],y,xs[n],y,'marker-start="url(#arrow)" '+arrow)+line(xs[n],y-5,xs[n],606,'class="guide"');
 s+=line(xs[0],517,xs[0],606,'class="guide"')+math(xs[0],718,[mi('O')],center)+text(272,722,'寸法線は O からの距離',center);
 return s;
}
function graph(){
 const to=(x,y)=>[78+x*37,430-y*21];let s=text(260,32,'図3　区間ごとの移動距離',center);
 for(let x=0;x<=10;x++)s+=line(...to(x,0),...to(x,16),'stroke="#dbe3e9" stroke-width="1"');
 for(let y=0;y<=16;y+=2)s+=line(...to(0,y),...to(10,y),'stroke="#dbe3e9" stroke-width="1"');
 s+=line(...to(0,0),...to(10.6,0),arrow)+line(...to(0,0),...to(0,17.1),arrow);
 for(let x=0;x<=10;x+=2)s+=math(to(x,0)[0],462,[rm(x)],center);
 for(let y=4;y<=16;y+=4)s+=math(61,to(0,y)[1]+9,[rm(y)],'text-anchor="end"');
 const fit=fitIntervals();s+=poly(sample(x=>to(x,fit.intercept+fit.slope*x),0,10),'class="gold"');
 intervalsCm.forEach((y,i)=>{const [x,py]=to(i+1,y);s+=`<circle cx="${x}" cy="${py}" r="4.3" fill="white" class="blue"/>`;});
 s+=text(89,65,'距離 [cm]')+text(260,506,'区間番号',center)+math(332,506,[mi('n')]);
 return s;
}
export function blankAxes(){return line(66,273,452,273,arrow)+line(232,480,232,53,arrow)+math(461,281,[mi('x')])+math(218,37,[mi('y')])+math(202,302,[mi('O')])+label(232,166,'P',-32,-8);}
function field(x,y){return `<circle cx="${x}" cy="${y}" r="10"/>`+dot(x,y)+math(x-39,y+10,[mi('B')]);}
function power(cx,y,dc){
 const lx=cx-68,rx=cx+68;let s=poly([[lx,y+110],[lx,y],[cx-24,y]])+poly([[cx+24,y],[rx,y],[rx,y+110]])+dot(lx,y+110)+dot(rx,y+110);
 if(dc)s+=line(cx-8,y-20,cx-8,y+20)+line(cx+8,y-10,cx+8,y+10)+line(cx-24,y,cx-8,y)+line(cx+8,y,cx+24,y)+math(cx-37,y-24,[rm('+')])+math(cx+23,y-24,[rm('−')]);
 else s+=`<circle cx="${cx}" cy="${y}" r="24" fill="white"/>`+poly(sample(t=>[cx-15+30*t,y-7*Math.sin(2*Math.PI*t)],0,1,30));
 return s;
}
function deeTop(base,dc){
 const r=164,left=247,right=273,cy=base+268;let s=text(260,base+27,dc?'図3　直流電源':'図2　高周波電源',center);
 s+=poly(sample(t=>[left+r*Math.cos(t),cy-r*Math.sin(t)],Math.PI/2,3*Math.PI/2)) +line(left,cy-r,left,cy+r);
 s+=poly(sample(t=>[right+r*Math.cos(t),cy-r*Math.sin(t)],-Math.PI/2,Math.PI/2))+line(right,cy-r,right,cy+r);
 s+=power(260,base+75,dc);
 s+=line(52,cy,465,cy,'class="axis" '+arrow)+line(right,cy+184,right,base+120,'class="axis" '+arrow);
 s+=math(476,cy+8,[mi('x')])+math(288,base+130,[mi('y')])+math(285,cy-10,[mi('O')]);
 s+=label(left,cy-60,'P',-29,-13)+field(146,cy-42)+field(405,cy-42);
 const rEnd=[r/Math.sqrt(2),r/Math.sqrt(2)];
 s+=line(left,cy,left-rEnd[0],cy+rEnd[1],arrow)+line(right,cy,right+rEnd[0],cy+rEnd[1],arrow);
 s+=math(157,cy+59,[mi('R')])+math(359,cy+60,[mi('R')]);
 s+=math(197,cy+139,[mi('D'),sub('1')])+math(295,cy+139,[mi('D'),sub('2')]);
 if(!dc){s+=line(left,cy-60,right,cy-60,'class="blue"');s+=poly(sample(t=>[right+60*Math.cos(t),cy-60*Math.sin(t)],Math.PI/2,-.38,45),'class="blue" '+arrow);}
 return s;
}
function apparatusDees(){
 // Elliptical projection of two hollow semicircular electrodes; separation exaggerated.
 const cy=204,rx=159,ry=57,left=242,right=278,depth=27;
 const pts=(c,a,b,y=cy)=>sample(t=>[c+rx*Math.cos(t),y-ry*Math.sin(t)],a,b);
 let s=text(260,29,'図1　中空の半円形電極',center);
 for(const [c,a,b] of [[left,Math.PI/2,3*Math.PI/2],[right,-Math.PI/2,Math.PI/2]]){
  s+=poly([...pts(c,a,b),...pts(c,b,a,cy+depth)],'fill="#eaf0f4"')+poly([...pts(c,a,b),[c,cy-ry*Math.sin(a)]],'fill="white"');
  s+=`<rect x="${c-3}" y="${cy-ry}" width="6" height="${2*ry+depth}" fill="#eaf0f4"/>`;
 }
 s+=line(153,293,153,130,arrow)+math(120,147,[mi('B')])+line(373,293,373,130,arrow)+math(389,148,[mi('B')]);
 s+=math(194,224,[mi('D'),sub('1')])+math(297,224,[mi('D'),sub('2')]);
 s+=poly([[210,177],[192,85],[236,85]])+poly([[284,85],[328,85],[313,177]])+dot(210,177)+dot(313,177);
 s+='<circle cx="260" cy="85" r="24" fill="white"/>'+poly(sample(t=>[245+30*t,85-7*Math.sin(2*Math.PI*t)],0,1,30));
 s+=line(260,268,299,314)+text(309,330,'隙間')+text(260,369,'磁場は電極面に垂直（+z方向）',center);
 return s+deeTop(398,false)+deeTop(875,true);
}
function heart(){
 const cx=240,cy=494,inner=142,outer=187;
 const arc=r=>sample(t=>[cx+r*Math.cos(t),cy-r*Math.sin(t)],.25,Math.PI-.25,90);
 let s=poly([...arc(outer),...arc(inner).reverse(),arc(outer)[0]],'fill="#eaf0f4"');
 s+=line(48,200,457,200)+line(cx,541,cx,52,arrow)+math(cx-15,39,[mi('x')]);
 for(const [name,y,dy] of [['C',cy,27],['I',cy-inner,28],['O',cy-outer,-12],['P',200,-13]])s+=label(cx,y,name,11,dy);
 s+=text(290,447,'内腔')+line(387,200,425,227)+text(426,251,'体表');
 s+=line(109,433,80,482)+text(51,519,'内面')+line(386,377,451,361)+text(433,345,'外面');
 s+=line(393,429,439,474)+text(411,509,'心筋層');
 s+=text(260,584,'断面と位置関係を示す模式図',center);
 return s;
}
function trajectory(){
 const {arcs,crossings}=dcOrbit(),to=([x,y])=>[215+x*110,264-y*110];
 let s=text(260,32,'直流電源：隙間を4回通過するまで',center);
 s+=line(...to([-1.48,0]),...to([2.05,0]),'class="axis" '+arrow)+line(...to([0,-3.13]),...to([0,1.63]),'class="axis" '+arrow);
 s+=math(451,273,[mi('x')])+math(201,66,[mi('y')])+math(185,292,[mi('O')]);
 arcs.forEach((a,i)=>{
  const p=t=>to([a.radius*Math.cos(t),a.cy+a.radius*Math.sin(t)]);
  s+=poly(sample(p,a.a,a.b),i===1?'class="gold"':'class="blue"');
  const angle=a.a+(a.b-a.a)*.51;s+=poly(sample(p,angle+.12,angle-.12,8),(i===1?'class="gold"':'class="blue"')+' '+arrow);
 });
 crossings.forEach((y,i)=>{const p=to([0,y]);s+=dot(...p);const offsets=[[13,-15],[-36,31],[-36,-14],[-36,29]][i];s+=math(p[0]+offsets[0],p[1]+offsets[1],[rm(i+1),...(i===0?[rm(' : '),mi('P')]:[])]);});
 s+=math(87,102,[mi('D'),sub('1')])+math(389,102,[mi('D'),sub('2')]);
 s+=text(260,661,'数字は隙間を通過する順序',center)+text(260,696,'左右でそれぞれ一定の半径',center);
 return s;
}
export function build(){
 const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('q1-apparatus-tape',520,746,'記録タイマーを通るテープにおもりを付ける装置と、点Oを0として0〜6の打点を並べ、Oから2・4・6までの距離を測る模式図。','記録装置と打点。寸法・打点間隔は模式的。測定値は別掲の表。',style+apparatus());
 pack.add('q1-interval-graph',520,536,'区間番号1から10の移動距離2.0、3.5、5.0、6.6、8.0、9.7、11.2、12.8、14.1、15.8 cmと、その近似直線。','測定表の値をプロットした点と近似直線。',style+graph());
 pack.add('q2-answer-axes',520,510,'解答用の空のxy座標軸。原点Oと正のy軸上の出発点Pのみを示す。','軌跡記入用の座標軸。',style+blankAxes());
 pack.add('q2-cyclotron-figures',520,1355,'中空の半円形電極D1とD2、および上から見た交流接続と直流接続。磁場は+z方向。直流はD1が正、D2が負。Pは左側の隙間の縁、OはD2の直線部分とx軸の交点。','サイクロトロンの配置・接続。隙間と電極の厚さは拡大した模式図。',style+apparatusDees());
 pack.add('q3-heart-cross-section',520,612,'心筋層の模式断面。中心Cから+x方向へ内面I、外面O、体表Pの順に並ぶ。内腔と内面・外面の間の心筋層を示す。','心筋層と体表の位置関係（模式図）。',style+heart());
 pack.add('a2-trajectory',520,727,'正電荷がPから右・左・右の順に時計回りの半円軌道を通り、隙間を4回通過する。右側の半径が左側より大きく、それぞれ同じ半径を反復する。','直流時の軌跡。隙間の幅を無視し、代表的な半径比で描いた模式図。',style+trajectory());
 return pack.save('問題条件、測定表と独立した円運動計算から作図。原本cropをコピーしない。4回通過は3半円。問題の解答用軸は空欄を維持。本文の軸表記・同位体番号・実験モデル・目標点の上流修復待ちは別管理。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))build();
