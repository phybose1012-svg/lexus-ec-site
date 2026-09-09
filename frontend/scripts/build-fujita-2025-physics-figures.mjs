// Public conditions -> editable diagrams; no restricted image copied/traced.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,mi,rm,sub,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
const arrow='marker-end="url(#arrow)"',center='text-anchor="middle"';
const label=(x,y,name,n)=>math(x,y,[rm(name),...(n===undefined?[]:[sub(n)])]);
const variable=(x,y,name,n)=>math(x,y,[mi(name),...(n===undefined?[]:[sub(n)])]);
const polygon=(pts,fill)=>`<path d="${pointsPath(pts)} Z" fill="${fill}" stroke="none"/>`;
const samples=(fn,a,b,n=100)=>Array.from({length:n+1},(_,i)=>{const x=a+(b-a)*i/n;return[x,fn(x)];});
const curve=(pts,extra='')=>`<path d="${pointsPath(pts)}" ${extra}/>`;
const dimH=(x1,x2,y,parts)=>line(x1,y,x2,y,'class="axis"')+line(x1,y-5,x1,y+5)+line(x2,y-5,x2,y+5)+math((x1+x2)/2,y+28,parts,center);
const dimV=(x,y1,y2,parts)=>line(x,y1,x,y2,'class="axis"')+line(x-5,y1,x+5,y1)+line(x-5,y2,x+5,y2)+math(x+14,(y1+y2)/2+8,parts);
export const sag=(R,x)=>R-Math.sqrt(R*R-x*x);
export const lens={R:800,R0:860,verticalScale:3};
export const rigid={A:[445,112],B:[315,112],C:[315,340],D:[445,340],pulley1:[580,356],pulley2:[80,356],radius:16};
export function ropeTangent(a,o,r,side){
 const dx=a[0]-o[0],dy=a[1]-o[1],d2=dx*dx+dy*dy,c=r*Math.sqrt(d2-r*r)/d2;
 return[o[0]+r*r*dx/d2+side*c*-dy,o[1]+r*r*dy/d2+side*c*dx];
}
export const forcePoint={x:.25,y:Math.sqrt(3)/4,fx:.5,fy:-Math.sqrt(3)/2}; // L=1, |F|=1.
export const signedRatio=x=>(3*x-1)/(x+1);
export const mathematicalHeight=x=>signedRatio(x)**2;
export const deferredIds=[];
export const requiredIds=['q1-rigid-body-setup','q2-newton-rings-figure1','q2-newton-rings-figure2','q3-charged-particle-apparatus','q4-two-ball-setup','q4-answer-grid','a2-lens-geometry','a3-force-components','a4-answer-graph','a4-solution-graph'];

function rigidSetup(){
 const {A,B,C,D,pulley1,pulley2,radius:r}=rigid;
 const t1=ropeTangent(A,pulley1,r,1),t2=ropeTangent(B,pulley2,r,-1);
 let body=`<rect x="99" y="340" width="462" height="24" fill="#e3e9ec"/>`+polygon([A,B,C,D],'#f0f5f7')+curve([A,B,C,D,A]);
 for(const[o,t,a,side]of[[pulley1,t1,A,1],[pulley2,t2,B,-1]]){
  const x=o[0]+side*r;
  body+=`<circle cx="${o[0]}" cy="${o[1]}" r="${r}" fill="white"/>`+dot(...o)+line(...a,...t)+`<path d="M${t[0]},${t[1]} A${r},${r} 0 0 ${side>0?1:0} ${x},${o[1]} V446"/>`;
  body+=`<rect x="${x-21}" y="446" width="42" height="39" rx="3" fill="#e8eff4"/>`;
 }
 const thetaArc=(a,t,n)=>{
  const theta=Math.atan2(Math.abs(t[0]-a[0]),t[1]-a[1]),sign=t[0]>a[0]?1:-1,r=44;
  return curve(Array.from({length:30},(_,i)=>{const z=theta*i/29;return[a[0]+sign*r*Math.sin(z),a[1]+r*Math.cos(z)];}),'class="accent"')+
   math(a[0]+(sign>0?14:-45),a[1]+90,[mi('θ'),sub(n)]);
 };
 body+=thetaArc(A,t1,1)+thetaArc(B,t2,2);
 for(const[n,p,dx,dy]of[['A',A,8,-15],['B',B,-28,-15],['C',C,-29,-5],['D',D,14,-5]])body+=dot(...p)+label(p[0]+dx,p[1]+dy,n);
 body+=variable(365,265,'M')+variable(579,519,'m',1)+variable(49,519,'m',2);
 body+=text(541,410,'滑車1')+text(43,410,'滑車2');
 body+=text(510,180,'ひも1')+text(155,177,'ひも2');
 body+=dimH(315,445,388,[mi('d')])+dimV(252,112,340,[mi('H')]);
 body+=text(330,36,'滑車2側が左、滑車1側が右',center);
 return body;
}
function lensFigure(concave=false){
 const cx=280,oy=345,w=215,{R,R0,verticalScale:v}=lens;
 const top=x=>oy-v*sag(R,x),bottom=x=>concave?oy-v*sag(R0,x):oy;
 const up=samples(top,-w,w).map(([x,y])=>[cx+x,y]),low=samples(bottom,-w,w).map(([x,y])=>[cx+x,y]);
 let body=polygon([[cx-w,155],[cx+w,155],...up.toReversed()],'#e7f0f5')+curve([[cx-w,155],[cx+w,155],...up.toReversed(),[cx-w,155]]);
 body+=polygon([...low,[cx+w,403],[cx-w,403]],'#e7f0f5')+curve([...low,[cx+w,403],[cx-w,403],low[0]]);
 body+=polygon([...up,...low.toReversed()],'#f6e6be');
 body+=line(cx,92,cx,438,'class="guide"')+dot(cx,oy)+label(cx-30,oy+25,'O');
 body+=variable(123,219,'n')+variable(117,382,'n');
 body+=text(75,128,'平凸レンズ')+variable(437,128,'R');
 body+=text(75,457,concave?'平凹レンズ':'平面ガラス')+(concave?variable(435,457,'R',0):'');
 for(const x of[340,402])body+=line(x,37,x,143,arrow);
 body+=text(507,53,'入射光')+variable(551,84,'λ');
 const px=170,py=top(px),by=bottom(px);
 body+=dot(cx+px,py)+label(cx+px+13,py-40,'P')+line(cx+px+14,py-28,cx+px+2,py-6,'class="guide"')+line(cx+px,py,cx+px,438,'class="guide"');
 body+=dimH(cx,cx+px,485,[mi('x')]);
 // A separated inset makes the real thin gap readable without changing d/d'.
 body+=line(cx+px+4,(py+by)/2,576,260,'class="guide"');
 body+=text(638,200,'空気層（拡大）',center)+line(580,229,695,229)+line(580,296,695,296);
 body+=`<rect x="580" y="230" width="115" height="65" fill="#f6e6be" stroke="none"/>`+dimV(652,231,294,concave?[mi('d'),rm('′')]:[mi('d')]);
 body+=text(370,550,'厚さと曲率は見やすさのため縦方向に拡大。',center);
 return body;
}
function lensGeometry(){
 const R=370,c=[310,65],o=[310,435],x=200,p=[510,c[1]+Math.sqrt(R*R-x*x)],k=[310,p[1]];
 let body=curve(samples(u=>c[1]+Math.sqrt(R*R-u*u),-240,240).map(([u,y])=>[c[0]+u,y]));
 body+=line(50,o[1],615,o[1])+line(...c,...o,'class="guide"')+line(...c,...p)+line(...k,...p,'class="guide"')+line(...p,p[0],o[1],'class="guide"');
 body+=curve([[k[0],k[1]-13],[k[0]+13,k[1]-13],[k[0]+13,k[1]]]);
 body+=dot(...c)+dot(...o)+dot(...p)+label(c[0]-31,c[1]-13,'C')+label(o[0]-29,o[1]+31,'O')+label(p[0]+20,p[1]-47,'P')+line(p[0]+22,p[1]-34,p[0]+2,p[1]-5,'class="guide"');
 body+=variable(430,224,'R')+math(234,242,[mi('R'),rm(' − '),mi('d')]);
 body+=dimV(551,p[1],o[1],[mi('d')])+dimH(o[0],p[0],495,[mi('x')]);
 body+=text(330,564,'半径と空気層厚さを結ぶ直角三角形',center);
 return body;
}
function apparatus(){
 let body=`<rect x="102" y="64" width="560" height="284" fill="#f2f7fa" stroke="none"/>`;
 body+=text(468,99,'磁場のある領域',center)+text(468,127,'向きは問3で考える',center)+variable(563,183,'B');
 body+=line(200,559,200,36,`class="axis" ${arrow}`)+variable(215,42,'y')+line(103,349,686,349,`class="axis" ${arrow}`)+variable(692,357,'x');
 // No orbit and no B-direction sign in a question illustration.
 for(const y of[349,473])body+=line(105,y,190,y,'stroke-width="5"')+line(210,y,382,y,'stroke-width="5"');
 body+=label(390,340,'I')+label(391,500,'II')+label(175,336,'O');
 body+=dimV(425,356,466,[mi('d')]);
 body+=line(105,349,47,349)+line(47,349,47,383)+dot(47,383)+dot(47,423)+line(47,383,26,413)+line(47,423,47,437);
 body+=line(30,437,64,437)+line(22,448,72,448)+line(47,448,47,473)+line(47,473,105,473)+variable(75,445,'V');
 body+=text(50,321,'電源・スイッチ');
 body+=`<rect x="164" y="553" width="72" height="34" rx="6" fill="#f8ebd4"/>`+line(200,545,200,487,arrow)+text(262,578,'荷電粒子源')+math(239,531,[mi('e'),rm(' > 0')]);
 body+=`<rect x="551" y="333" width="16" height="32" rx="3" fill="#d7e4ed"/>`+text(553,311,'検出器',center)+math(561,398,[rm('('),mi('L'),rm(', 0)')],center);
 body+=text(512,565,'z 軸正方向：紙面の手前',center);
 body+=text(369,634,'スイッチは開いた状態で図示。磁場の向き・軌道は未記入。',center);
 return body;
}
function balls(){
 let body=line(65,439,568,439,'stroke-width="2.7"')+text(592,445,'床');
 body+=line(271,73,271,436,'class="guide"');
 body+=`<circle cx="271" cy="125" r="15" fill="#f5e4bd"/><circle cx="271" cy="258" r="23" fill="#dfebf3"/>`;
 body+=label(307,133,'P')+variable(365,133,'m')+label(309,266,'Q')+variable(365,266,'M');
 body+=dimV(179,125,258,[mi('h')])+dimV(114,258,439,[mi('H')]);
 body+=line(487,238,487,315,arrow)+variable(505,283,'g');
 body+=text(330,36,'2球を同時に、初速度0で放す',center);
 return body;
}
function blankGrid(){
 let body='';
 for(let i=0;i<=12;i++)body+=line(90+37*i,45,90+37*i,332,'stroke="#d7e1e8" stroke-width=".7"');
 for(let j=0;j<=7;j++)body+=line(90,45+41*j,534,45+41*j,'stroke="#d7e1e8" stroke-width=".7"');
 body+=line(90,332,568,332,`class="axis" ${arrow}`)+line(90,332,90,23,`class="axis" ${arrow}`);
 body+=variable(580,340,'x')+math(102,25,[mi('Y'),sub('max')]);
 for(let i=0;i<=3;i++)body+=math(90+148*i,367,[rm(i)],center);
 return body;
}
function forces(){
 const to=(x,y)=>[100+520*x,421-520*y],p=to(forcePoint.x,forcePoint.y),scale=165;
 const fx=[p[0]+scale*forcePoint.fx,p[1]],fy=[p[0],p[1]-scale*forcePoint.fy],end=[fx[0],fy[1]];
 let body=`<rect x="76" y="103" width="577" height="318" fill="#f3f7fa" stroke="none"/>`;
 body+=curve(Array.from({length:140},(_,i)=>{const t=Math.PI*(1-i/139);return to(.5+.5*Math.cos(t),.5*Math.sin(t));}));
 body+=line(82,421,663,421,`class="axis" ${arrow}`)+variable(679,429,'x')+line(100,447,100,60,`class="axis" ${arrow}`)+variable(111,68,'y');
 body+=line(...p,...fx,`stroke="#557e99" ${arrow}`)+line(...p,...fy,`stroke="#557e99" ${arrow}`)+line(...p,...end,`class="accent" ${arrow}`);
 body+=line(...fx,...end,'class="guide"')+line(...fy,...end,'class="guide"')+line(...p,p[0],421,'class="guide"');
 body+=line(...p,p[0]+80*Math.sqrt(3)/2,p[1]-40,arrow)+variable(p[0]+77,p[1]-60,'v');
 body+=math(p[0]+47,p[1]+35,[mi('f'),sub('x')])+math(p[0]-56,p[1]+86,[mi('f'),sub('y')])+variable(end[0]+20,end[1]-25,'F');
 body+=dot(...p)+dot(...to(.5,0))+label(72,450,'O')+variable(625,452,'L')+math(p[0]-35,462,[mi('L'),rm('/4')])+math(343,456,[mi('L'),rm('/2')]);
 body+=`<circle cx="570" cy="63" r="11"/>`+dot(570,63)+math(590,71,[mi('B'),rm('（+'),mi('z'),rm('）')]);
 body+=text(369,511,'力は円の中心へ向き、x 成分は正、y 成分は負。',center);
 return body;
}
function heightGraph({top=0,signed=false}={}){
 const fn=signed?signedRatio:mathematicalHeight,ymin=signed?-1.4:-.4,ymax=signed?2.5:4.5;
 const to=(x,y)=>[115+145*x,top+340-(y-ymin)*(signed?60:46)];
 let body=text(340,top+30,signed?'① 平方する前の式':'数式としてのグラフ（元解答の扱い）',center);
 body+=math(340,top+66,signed?[mi('u'),rm(' = 3 − 4/('),mi('x'),rm(' + 1)')]:[mi('Y'),sub('max'),rm('/'),mi('H'),rm(' = (3 − 4/('),mi('x'),rm(' + 1))'),'<tspan class="rm" font-size="70%" baseline-shift="super">2</tspan>'],center);
 body+=line(...to(0,0),...to(3.35,0),`class="axis" ${arrow}`)+line(...to(0,ymin),...to(0,ymax),`class="axis" ${arrow}`)+variable(609,to(0,0)[1]+7,'x');
 body+=math(127,to(0,ymax)[1]+3,signed?[mi('u')]:[mi('Y'),sub('max'),rm('/'),mi('H')]);
 body+=curve(samples(fn,0,3).map(p=>to(...p)),'stroke="#285879" stroke-width="2.4"');
 for(const x of[0,1/3,3])body+=dot(...to(x,fn(x)));
 body+=math(92,to(0,0)[1]+28,[rm('0')])+math(to(1/3,0)[0]-15,to(0,0)[1]+(signed?52:35),[rm('1/3')])+math(to(3,0)[0]-4,to(0,0)[1]+29,[rm('3')]);
 for(const x of[0,3])body+=math(to(x,fn(x))[0]+(x===0?-34:14),to(x,fn(x))[1]+8,[rm(fn(x))]);
 body+=line(...to(3,0),...to(3,fn(3)),'class="guide"');
 return body;
}
function solutionGraphs(){
 return heightGraph({signed:true})+line(55,409,620,409,'class="guide"')+heightGraph({top:430})+
 text(340,830,'平方すると負の値も正になります。',center)+
 text(340,858,'運動の向き・再衝突の条件は、数式とは別に確認が必要です。',center);
}
export function buildFigures(){
 const pack=createSvgPackage('fujita-health-2025-general-early-physics',import.meta.url);
 pack.add('q1-rigid-body-setup',660,549,'粗い水平な台上の直方体。上右Aからひも1が右の滑車1と質量m₁のおもりへ、上左Bからひも2が左の滑車2と質量m₂のおもりへつながる。下左C、下右D。ひもは下向きに傾き、鉛直との角θ₂はθ₁より大きい。','点・ひもの対応と鉛直から測る角度を示す配置図。',rigidSetup());
 pack.add('q2-newton-rings-figure1',740,581,'平凸レンズの凸面を下にして平面ガラスへ置き、中心Oで接触させる。中心軸から距離xのレンズ面Pと平面との間に厚さdの空気層がある。上から垂直に光を入射する。','図1：空気層は拡大表示。中心Oでは両面が接触する。',lensFigure());
 pack.add('q2-newton-rings-figure2',740,581,'半径Rの平凸レンズを、半径R₀の平凹レンズに重ねる。RはR₀より小さく、中心Oだけで接触し、外側に薄い空気層d′ができる。','図2：RとR₀は近い。空気層の厚さと曲率は模式的に拡大。',lensFigure(true));
 pack.add('q3-charged-particle-apparatus',740,666,'極板Iはy=0、極板IIはy=−dにあり、同じy軸上の穴を通って正電荷の粒子を上へ加速する。検出器は(L,0)。磁場はyが正の領域にあり、向きと軌道は問題図には記入していない。','極板・電源・スイッチ・粒子源と検出器の配置。',apparatus());
 pack.add('q4-two-ball-setup',660,491,'床から高さHの位置に質量Mの小球Qがあり、その真上hに質量mの小球Pがある。2球は同時に静かに放され、重力gは下向き。','小球の位置は中心で示す。球の大きさは模式的な表示。',balls());
 pack.add('q4-answer-grid',620,394,'問10の空欄グラフ。横軸xは0から3、縦軸はYmax。解答曲線や縦軸の数値は描かれていない。','解答用グラフ：曲線と縦軸の数値は未記入。',blankGrid());
 pack.add('a2-lens-geometry',660,600,'球面中心C、接点O、球面上のPを結ぶ幾何関係。CP=CO=R、水平距離x、Pから平面までdで、直角三角形の縦の長さはR−d。','球面の半径・水平距離・空気層厚さの関係。',lensGeometry());
 pack.add('a3-force-components',740,544,'x=L/4の粒子は半径L/2の半円上にあり、ローレンツ力Fは円の中心へ向く。力のx成分は正、y成分は負。磁場は紙面手前の+z方向、速度は軌道の接線方向。','第3問・問4：力の方向と成分。問題図とは別に解説へ掲載。',forces());
 pack.add('a4-answer-graph',680,394,'元解答が数式として扱ったYmax/H=((3x−1)/(x+1))²のグラフ。xは0から3。値はx=0で1、x=1/3で0、x=3で4。全域で物理的な最高点となると確認した図ではない。','第4問・問10：元解答の数式グラフ。物理的な適用範囲は確認中。',heightGraph());
 pack.add('a4-solution-graph',680,890,'u=3−4/(x+1)と、その平方Ymax/H=u²を上下に比較する。0<x<1/3ではuが負だが二乗値は正になるため、最高点の物理解釈とは区別する。','元解答末尾の数学的グラフという限定を明示。運動条件は別途確認が必要。',solutionGraphs());
 return pack.save('10図は条件・式から独自描画。第4問の2図はreconstruction解答p009末尾注記の「数学的グラフ」に限定し、物理的適用範囲を確認済みとしない。学習者版で欠落した注記は修正依頼へ。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildFigures();
