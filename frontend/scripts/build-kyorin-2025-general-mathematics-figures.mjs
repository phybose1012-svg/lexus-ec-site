import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,math,mi,rm,sub,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='kyorin-2025-general-mathematics';
export const quartic=x=>3*x**4+2*x**3-3*x*x+1;
export const derivative=x=>6*x*(x+1)*(2*x-1);
export const sectionZ=t=>8*Math.abs(t)-8*t*t;
export const sectionX=u=>2*Math.acos(u)+2*u*Math.sqrt(1-u*u)-2*(1-u*u);
export const hexagon=u=>[[-1,0],[-u,1-u],[u,1-u],[1,0],[u,-(1-u)],[-u,-(1-u)]];
export const surface=(theta,x)=>[x,Math.cos(theta),Math.sin(theta)];
const mid='text-anchor="middle"',end='text-anchor="end"';
const label=(x,y,s,extra='')=>math(x,y,[mi(s)],extra);
const num=(x,y,s,extra='')=>math(x,y,[rm(s)],extra);
const curve=(pts,extra='')=>`<path d="${pointsPath(pts)}" ${extra}/>`;
const polygon=(pts,extra='')=>`<path d="${pointsPath(pts)} Z" ${extra}/>`;
const sample=(fn,a,b,n=160)=>Array.from({length:n+1},(_,i)=>fn(a+(b-a)*i/n));
const axes=(P,x0,x1,y0,y1)=>line(...P(x0,0),...P(x1,0),'class="axis" marker-end="url(#arrow)"')+line(...P(0,y0),...P(0,y1),'class="axis" marker-end="url(#arrow)"');
function quarticPanels(){
 let s='';
 for(const [index,k]of [.85,11/16].entries()){
  const top=35+index*440,P=(x,y)=>[440+210*x,top+260-92*y];
  s+=text(36,top,index===0?'異なる4点で交わる場合':'右の極小点で接する場合');
  s+=math(36,top+37,index===0?[rm('11/16 < '),mi('k'),rm(' < 1')]:[mi('k'),rm(' = 11/16')]);
  s+=axes(P,-1.7,1.1,-1.4,2.1);
  s+=curve(sample(x=>P(x,quartic(x)),-1.45,.87),'stroke-width="2.5"');
  s+=line(...P(-1.58,k),...P(.96,k),'class="accent"');
  s+=math(658,P(0,k)[1]+7,[mi('y'),rm(' = '),mi('k')]);
  s+=label(683,P(0,0)[1]+28,'x')+label(457,top+70,'y')+label(419,P(0,0)[1]+28,'O');
  for(const x of [-1,0,.5])s+=dot(...P(x,quartic(x)));
  s+=line(...P(-1,-1),...P(-1,0),'class="guide"')+num(P(-1,0)[0],P(0,0)[1]+29,'−1',mid);
  s+=line(...P(.5,k),...P(.5,-.65),'class="guide"')+num(P(.5,0)[0],P(0,-.65)[1]+25,'1/2',mid);
  s+=num(426,P(0,1)[1]-13,'1',end)+num(P(-1,-1)[0],P(-1,-1)[1]+31,'−1',mid);
 }
 return s;
}
function triangle(){
 const A=[110,320],B=[590,320],C=[590,80];
 return polygon([A,B,C])+line(566,320,566,296)+line(566,296,590,296)+
  curve(sample(t=>[110+85*Math.cos(t),320-85*Math.sin(t)],0,Math.atan(.5),30))+
  label(217,301,'α')+num(350,359,'2',mid)+num(620,210,'1')+num(328,155,'√5')+
  text(90,40,'三角置換の上端を表す直角三角形')+math(220,410,[rm('tan '),mi('α'),rm(' = 1/2')]);
}
function xy(){
 const P=(x,y)=>[350+170*x,315-170*y];let s='';
 s+=polygon([[1,1],[-1,1],[-1,-1],[1,-1]].map(p=>P(...p)),'fill="#edf3f7"');
 s+=axes(P,-1.5,1.6,-1.4,1.5)+line(...P(-1,-1),...P(1,1),'class="guide"')+line(...P(-1,1),...P(1,-1),'class="guide"');
 for(const [x,y,name,dx,dy]of [[1,1,'A',20,-18],[-1,1,'B',-20,-18],[-1,-1,'C',-20,33],[1,-1,'D',20,33]]){const p=P(x,y);s+=dot(...p)+label(p[0]+dx,p[1]+dy,name,mid);}
 s+=label(635,338,'x')+label(366,59,'y');
 s+=num(530,343,'1')+num(157,343,'−1',end)+num(334,136,'1',end)+num(334,507,'−1',end);
 s+=text(35,39,'座標は A(1,1,0)、B(−1,1,0)、C(−1,−1,0)、D(1,−1,0)');
 return s;
}
function ellipse(){
 const a=Math.SQRT2,P=(s,z)=>[360+s*175,300-z*175];let b=axes(P,-1.7,1.8,-1.3,1.3);
 b+=`<ellipse cx="360" cy="300" rx="${175*a}" ry="175" fill="#edf3f7"/>`;
 // Axes are redrawn above the fill for the intrinsic plane coordinates.
 b+=axes(P,-1.7,1.8,-1.3,1.3);
 for(const [s,z,n,dx,dy]of [[a,0,'A',30,36],[-a,0,'C',-30,36],[0,1,'E',25,-15],[0,-1,'F',25,32]])b+=dot(...P(s,z))+label(P(s,z)[0]+dx,P(s,z)[1]+dy,n,mid);
 b+=label(676,326,'s')+label(375,66,'z')+label(335,328,'O');
 b+=text(35,35,'平面 y = x の中で見た楕円')+math(160,565,[mi('s'),rm(' = √2 '),mi('x'),rm(' ,    '),mi('s'),rm('²/2 + '),mi('z'),rm('² = 1')])+text(205,604,'長半径 √2、短半径 1');
 return b;
}
const project=(x,y,z)=>[360+150*x-130*y,340+60*x+70*y-210*z];
function curvedSurface(){
 const P=project;let s=text(35,37,'円柱面の 1/4：y、z ともに非負の部分');
 const border=[...sample(t=>P(...surface(t,Math.cos(t))),0,Math.PI/2),...sample(t=>P(...surface(t,-Math.cos(t))),Math.PI/2,0)];
 s+=polygon(border,'fill="#edf3f7"');
 for(const t of [0,.25,.5,.75,1,1.25])s+=line(...P(...surface(t,-Math.cos(t))),...P(...surface(t,Math.cos(t))),'class="guide"');
 for(const f of [-.5,0,.5])s+=curve(sample(t=>P(...surface(t,f*Math.cos(t))),0,Math.PI/2),'class="guide"');
 const t=.65,c=Math.cos(t);s+=line(...P(...surface(t,-c)),...P(...surface(t,c)),'class="accent"');
 for(const [p,n,dx,dy]of [[P(1,1,0),'A',22,24],[P(-1,1,0),'B',-20,15],[P(0,0,1),'E',0,-18],[P(0,1,0),'X',0,33]])s+=dot(...p)+label(p[0]+dx,p[1]+dy,n,mid);
 const a=P(...surface(t,c)),b=P(...surface(t,-c)),x=P(...surface(t,0));
 s+=dot(...a)+dot(...b)+dot(...x)+math(a[0]+24,a[1]+8,[mi('A'),sub('k')])+math(b[0]-15,b[1]-17,[mi('B'),sub('k')],end);
 s+=line(...x,468,232,'class="guide"')+math(479,235,[mi('X'),sub('k')]);
 s+=text(38,515,'金色の線：一定の角度 θ で切った線分')+math(90,560,[mi('x'),rm(' = ±cos '),mi('θ'),rm(' ,  '),mi('y'),rm(' = cos '),mi('θ'),rm(' ,  '),mi('z'),rm(' = sin '),mi('θ')]);
 s+=text(38,606,'円柱面を開いて面積を求めます。平面への正射影ではありません。');
 return s;
}
function development(){
 const P=(t,x)=>[115+t*300,290-x*160];let s=text(34,35,'円柱面を開く：横軸は弧の長さ θ（半径1）');
 s+=polygon([...sample(t=>P(t,Math.cos(t)),0,Math.PI/2),...sample(t=>P(t,-Math.cos(t)),Math.PI/2,0)],'fill="#e4edf3"');
 s+=axes(P,-.13,1.82,-1.35,1.35);
 s+=curve(sample(t=>P(t,Math.cos(t)),0,Math.PI/2),'stroke-width="2.5"')+curve(sample(t=>P(t,-Math.cos(t)),0,Math.PI/2),'stroke-width="2.5"');
 const t=.65;s+=line(...P(t,-Math.cos(t)),...P(t,Math.cos(t)),'class="accent"');
 s+=math(305,109,[mi('x'),rm(' = cos '),mi('θ')])+math(305,495,[mi('x'),rm(' = −cos '),mi('θ')]);
 s+=label(666,318,'θ')+label(128,66,'x')+label(94,317,'O');
 s+=num(90,139,'1',end)+num(90,459,'−1',end)+num(586,325,'π/2',mid)+math(328,323,[mi('θ'),sub('k')]);
 s+=text(38,558,'青い部分が円柱面の1/4に対応。曲線は余弦（正弦の位相移動）です。');
 s+=text(160,604,'青い部分の面積 2 × 4 = 全体の面積 8');
 return s;
}
function octahedron(){
 const P=(x,y,z)=>[350+155*x-110*y,310+55*x+75*y-230*z];
 const V={A:[1,1,0],B:[-1,1,0],C:[-1,-1,0],D:[1,-1,0],E:[0,0,1],F:[0,0,-1]};let s=text(34,34,'八面体 M と平面 z = t（図は 0 < t < 1）');
 for(const [a,b]of [['A','B'],['B','C'],['C','D'],['D','A'],...['A','B','C','D'].flatMap(v=>[[v,'E'],[v,'F']])])s+=line(...P(...V[a]),...P(...V[b]),a==='C'||b==='C'?'class="guide"':'');
 const t=.45,b=1-t;s+=polygon([[b,b,t],[-b,b,t],[-b,-b,t],[b,-b,t]].map(v=>P(...v)),'fill="#f3ead6" fill-opacity="0.6" stroke="#b28736" stroke-width="2.5"');
 for(const [n,v]of Object.entries(V)){const p=P(...v);const offsets={A:[15,27],B:[-20,5],C:[-70,-70],D:[20,5],E:[0,-20],F:[0,34]};s+=dot(...p)+label(p[0]+offsets[n][0],p[1]+offsets[n][1],n,mid);if(n==='C')s+=line(...p,p[0]-54,p[1]-60,'class="guide"');}
 s+=line(...P(0,0,t),600,148,'class="guide"')+math(605,150,[mi('z'),rm(' = '),mi('t')]);
 s+=text(35,603,'断面は正方形。中心から各辺までの距離は 1 − t。');return s;
}
function squareSection(){
 const t=.45,a=Math.sqrt(1-t*t),b=1-t,P=(x,y)=>[350+220*x,315-220*y];
 let s=text(35,35,'平面 z = t で切った K：青い部分が断面');
 s+=polygon([[-a,-a],[a,-a],[a,a],[-a,a]].map(p=>P(...p)),'fill="#e4edf3"');
 s+=polygon([[-b,-b],[b,-b],[b,b],[-b,b]].map(p=>P(...p)),'fill="white" stroke="#b28736"');
 s+=axes(P,-1.23,1.4,-1.15,1.15)+label(665,340,'x')+label(367,60,'y')+label(330,343,'O');
 s+=line(350,550,P(a,0)[0],550,'marker-start="url(#arrow)" marker-end="url(#arrow)"')+label(448,579,'a',mid);
 s+=line(350,368,P(b,0)[0],368,'marker-start="url(#arrow)" marker-end="url(#arrow)"')+label(410,399,'b',mid);
 s+=math(72,605,[mi('a'),rm(' = √(1 − '),mi('t'),rm('²),   '),mi('b'),rm(' = 1 − |'),mi('t'),rm('|')]);
 return s;
}
export function clippedDisk(u){const h=Math.sqrt(1-u*u),alpha=Math.asin(h);return [...sample(t=>[Math.cos(t),Math.sin(t)],-alpha,alpha),...sample(t=>[-Math.cos(t),Math.sin(t)],alpha,-alpha)];}
function circleSection(){
 const u=.55,h=Math.sqrt(1-u*u),P=(y,z)=>[350+205*y,330-205*z];let s=text(35,35,'平面 x = u：円板を上下から切り取った断面');
 s+=`<circle cx="350" cy="330" r="205" class="guide"/>`+polygon(clippedDisk(u).map(p=>P(...p)),'fill="#e4edf3"');
 s+=axes(P,-1.3,1.5,-1.27,1.25)+label(665,358,'y')+label(365,77,'z')+label(327,360,'O');
 for(const sign of [-1,1])s+=line(...P(-1.25,sign*h),...P(1.25,sign*h),'class="guide"');
 s+=line(...P(u,0),...P(u,h),'class="guide"')+num(576,360,'1')+label(P(u,0)[0],359,'u',mid)+label(335,P(0,h)[1]-12,'h',end)+math(333,P(0,-h)[1]+27,[rm('−'),mi('h')],end);
 s+=math(115,633,[mi('h'),rm(' = √(1 − '),mi('u'),rm('²),   0 < '),mi('u'),rm(' < 1')]);return s;
}
function areaSection(){
 const u=.55,h=Math.sqrt(1-u*u);let s='';
 for(const [i,filled]of [false,true].entries()){
  const P=(y,z)=>[350+180*y,275+i*495-180*z];s+=text(35,40+i*495,i?'K の断面：円板の帯から六角形を除く':'M の断面：六角形');
  if(filled)s+=polygon(clippedDisk(u).map(p=>P(...p)),'fill="#e4edf3"');
  s+=polygon(hexagon(u).map(p=>P(...p)),`fill="${filled?'white':'#f3ead6'}" stroke="#b28736"`)+axes(P,-1.25,1.55,filled?-1.1:-.7,1.2);
  s+=label(642,302+i*495,'y')+label(363,62+i*495,'z')+label(329,303+i*495,'O');
  s+=num(P(1,0)[0]+8,P(1,0)[1]+28,'1')+num(P(-1,0)[0]-8,P(-1,0)[1]+28,'−1',end);
  if(!filled){s+=line(...P(u,0),...P(u,1-u),'class="guide"')+label(P(u,0)[0],P(u,0)[1]+29,'u',mid)+math(335,P(0,1-u)[1]-15,[rm('1 − '),mi('u')],end);s+=math(160,435,[rm('六角形の面積 = 2(1 − '),mi('u'),rm('²)')]);}
  else {s+=line(...P(0,0),...P(u,h),'class="accent"')+curve(sample(t=>P(.32*Math.cos(t),.32*Math.sin(t)),0,Math.acos(u),35));s+=label(405,744,'θ')+math(170,1010,[mi('u'),rm(' = cos '),mi('θ'),rm(' ,   '),mi('h'),rm(' = sin '),mi('θ')]);}
 }return s;
}
export function dandelin(m=.6){const c=Math.sqrt(1+m*m);return {m,c,F:[m/c,m*m/c],G:[-m/c,-m*m/c],P:[1,m]};}
function cylinderNote(){
 const {m,c,F,G,P:p}=dandelin(),P=(x,z)=>[355+150*x,375-150*z];let s=text(35,35,'補足：円柱の軸を含む断面で見るダンデランの球');
 s+=line(...P(-1,-2.15),...P(-1,2.15))+line(...P(1,-2.15),...P(1,2.15));
 for(const sign of [-1,1])s+=`<circle cx="355" cy="${P(0,sign*c)[1]}" r="150" fill="#edf3f7"/>`;
 s+=line(...P(-1.65,-1.65*m),...P(1.65,1.65*m),'class="accent"');
 s+=line(...P(1,-c),...P(1,c),'stroke-width="3"');
 for(const [v,n,dx,dy]of [[F,'1',25,40],[G,'2',-50,-32],[p,'P',25,5],[[1,c],'Q',25,6],[[1,-c],'Q′',25,6]])s+=dot(...P(...v))+(n==='1'||n==='2'?math(P(...v)[0]+dx,P(...v)[1]+dy,[mi('F'),sub(n)]):label(P(...v)[0]+dx,P(...v)[1]+dy,n));
 s+=text(45,739,'円は球の断面、金色の直線は切断平面。F₁・F₂は接点です。');
 s+=math(86,787,[mi('PF'),sub('1'),rm(' = '),mi('PQ'),rm(' ,   '),mi('PF'),sub('2'),rm(' = '),mi('PQ′')]);
 s+=text(45,831,'同じ点から球へ引く接線の長さは等しく、2焦点からの距離の和は一定。');return s;
}
const M=s=>`\\(${s}\\)`;
export function answerSupplement(){
 const first='major-question-01',third='major-question-03';return {schemaVersion:'lexus-answer-supplement.v1',packageId,sourceSha256:'9b4ba15e01d3eef976cabc1961f376f1e4fd03c6c908aebba1da0cd5f1ca3473',contentProvenance:'original_editorial',restrictedSourceCopied:false,review:{needsHumanReview:true,notes:'関数と断面積の式から独立に検算した増減表。原本画像は複製しない。本文修復と人間レビューは保留。'},operations:[
  {type:'insert-after',expectedMatches:1,anchor:{major_question_id:first,type:'formula',latex:"f'(x)=6x(x+1)(2x-1)"},blocks:[{type:'prose',major_question_id:first,text:'導関数の符号と3つの停留点の値を表にすると、水平線との交点数を判断できます。'},{type:'table',major_question_id:first,caption:'増減表',headers:[M('x'),'…',M('-1'),'…',M('0'),'…',M('1/2'),'…'],rows:[[M("f'(x)"),M('-'),M('0'),M('+'),M('0'),M('-'),M('0'),M('+')],[M('f(x)'),'↘',M('-1'),'↗',M('1'),'↘',M('11/16'),'↗']]}]},
  {type:'insert-after',expectedMatches:1,anchor:{major_question_id:third,type:'formula',latex:'\\frac{dS}{d\\theta}=2+2\\cos2\\theta-2\\sin2\\theta'},blocks:[{type:'prose',major_question_id:third,text:'導関数は \\(4\\cos\\theta(\\cos\\theta-\\sin\\theta)\\) と整理できます。\\(0<\\theta<\\pi/2\\) で符号を調べます。端点は対象範囲に含まれないので斜線にします。'},{type:'table',major_question_id:third,caption:'断面積の増減表',headers:[M('\\theta'),M('0'),'…',M('\\pi/4'),'…',M('\\pi/2')],rows:[[M('dS/d\\theta'),'[[no-value]]',M('+'),M('0'),M('-'),'[[no-value]]'],[M('S'),'[[no-value]]','↗',M('\\pi/2'),'↘','[[no-value]]']]}]},
 ]};
}
export function build(){
 const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('ans-i-quartic-graphs',760,885,'四次関数の極小値は−1と11/16、極大値は1。11/16と1の間の水平線とは4点で交わり、11/16ではx=1/2で接する。','増減表に対応する2つの水平線。',quarticPanels());
 pack.add('ans-ii-triangle',720,450,'直角三角形の底辺は2、高さは1、斜辺は√5。底辺と斜辺の角αについてtanα=1/2。','置換積分の上端の角度α。',triangle());
 pack.add('ans-iii-xy-coordinates',720,570,'z=0上でA,B,C,Dは一辺2の正方形をなす。対角線はy=xとy=−x。','八面体の赤道にあたる正方形。',xy());
 pack.add('ans-iii-a-ellipse',720,650,'平面y=xの固有座標s=√2xで、楕円の長半径は√2、短半径は1。A,Cが長軸端、E,Fが短軸端。','平面内の長さで表した楕円。',ellipse());
 pack.add('ans-iii-solid-projection',760,640,'x軸から距離1の円柱面のうちy,zが非負の部分。一定角θでの両端はx=±cosθ。金色の線分を展開図へ移す。','展開する円柱面の1/4。投影面積ではありません。',curvedSurface());
 pack.add('ans-iii-projection-development',760,640,'円柱面を開くとθ=0からπ/2の間でx=cosθとx=−cosθに囲まれる。青い部分の面積2を4倍して全体8。','曲面を開いた図。青い部分の上半分が、本文で8倍する1/8の領域です。',development());
 pack.add('ans-iii-octahedron-section',740,640,'八面体の上半分をz=tで切ると半辺1−tの正方形。下半分はz=0に関して対称。','八面体を水平に切る（斜めから見た模式図）。',octahedron());
 pack.add('ans-iii-z-section-square',740,640,'z=tでのKの断面は半辺√(1−t²)の正方形から半辺1−|t|の正方形を除いた青い領域。','外側の正方形から八面体の断面を引きます。',squareSection());
 pack.add('ans-iii-x-section-circle',740,670,'x=uの断面で共通円柱の内部は単位円板のうち|z|が√(1−u²)以下の帯状領域。','まず円柱の共通部分の断面を求めます。',circleSection());
 pack.add('ans-iii-x-section-area',740,1050,'上段は八面体の六角形断面、下段の青い領域は円板の帯から六角形を除いたKの断面。u=cosθ。','2つの断面の差を面積として扱います。',areaSection());
 pack.add('ans-iii-cylinder-note',760,870,'円柱に接する2球と切断平面の接点F1,F2。円柱軸断面で球は円として示す。同じ点Pから各球への接線長が等しい。','補足：楕円の焦点を説明するダンデランの球（軸断面）。',cylinderNote());
 const dir=new URL('../src/data/pastExamBatch/answer-supplements/',import.meta.url);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(new URL(`${packageId}.json`,dir),JSON.stringify(answerSupplement(),null,2)+'\n');
 return pack.save('全図は問題条件と独立計算による新規作図。投影/展開の元転記と確率条件などは修復待ち。権利・人間レビューは未承認。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))build();
