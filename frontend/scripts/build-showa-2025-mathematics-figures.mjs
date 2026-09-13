// Condition-derived geometry. Source crops are never embedded or traced.
import {pathToFileURL} from 'node:url';
import {mi,rm,math,text,line,dot,pointsPath,createSvgPackage} from './lib/past-exam-svg-author.mjs';
export const id='showa-medical-2025-general-i-mathematics';
export const s=1/Math.sqrt(2);
export const tetra=t=>{const q=1/(2*t);return {O:[0,0,0],A:[Math.sqrt(1-q*q),q,0],B:[0,t,Math.sqrt(1-t*t)],C:[0,t,-Math.sqrt(1-t*t)]};};
export const bounds=x=>x<=1?[1/(2*x),2*x]:[x/2,2/x];
export const section=(axis,k)=>axis==='x'?[[k,0],[s,s-k],[s,-(s-k)]]:[[0,k],[s-k,s],[0,s]];
export const radii=k=>({inner:k,outer:Math.sqrt(s*s+(s-k)**2)});
const sup=v=>`<tspan class="rm" font-size="70%" baseline-shift="super">${v}</tspan>`;
const frac=(x,y,n,d,w=55)=>math(x,y-9,[n],'text-anchor="middle"')+line(x-w/2,y,x+w/2,y)+math(x,y+29,[d],'text-anchor="middle"');
// A radical includes its entire radicand; a standalone √ glyph has no extensible bar.
const rootFraction=(x,y,radicand,w)=>math(x,y-10,[rm('1')],'text-anchor="middle"')+line(x-w/2-3,y,x+w/2+3,y)+`<path d="M${x-w/2} ${y+23} l5 -3 l7 15 l8 -25 h${w-20}" stroke-width="1.4"/>`+math(x-w/2+23,y+33,[radicand]);
const poly=(p,fill='#eaf1f5')=>`<path d="${pointsPath(p)} Z" fill="${fill}"/>`;
const sample=(a,b,f,n=90)=>Array.from({length:n+1},(_,i)=>{const x=a+(b-a)*i/n;return [x,f(x)];});
const curve=(p,extra='')=>`<path d="${pointsPath(p)}" ${extra}/>`;
const centered=(x,y,p)=>math(x,y,p,'text-anchor="middle"');
export function build(){
 const pack=createSvgPackage(id,import.meta.url);
 // Rotating the entire complex plane makes alpha positive real, without changing lengths.
 let b=text(32,32,'複素数の比から、2辺のなす角を読む');
 const O=[120,335],A=[260,335],B=[400,55];
 b+=poly([O,A,B])+line(...O,510,335,'class="guide"');
 b+=`<path d="M 171 335 A 51 51 0 0 0 156.06 298.94"/>`;
 b+=centered(206,303,[rm('π/4')])+math(186,374,[rm('√2')])+math(211,170,[rm('4')]);
 b+=dot(...O)+dot(...A)+dot(...B)+math(93,366,[rm('O')])+math(260,368,[mi('α')])+math(414,60,[mi('β')]);
 b+=text(470,155,'反射した配置でも')+text(470,186,'角の大きさと面積は同じ');
 b+=text(32,419,'全体を回転し、αを正の実軸上に置いた場合。');
 pack.add('ans-q1-complex-triangle',760,455,'原点Oと複素数α、βの三角形。Oαは√2、Oβは4、なす角はπ/4。反射した配置も面積は等しい。','全体の回転・反射では、辺の長さと面積は変わりません。',b);
 // Four exact boundary arcs; hatching is clipped to the closed region only.
 const p=([x,y])=>[90+190*x,485-190*y];
 const region=[...sample(.5,1,x=>2*x),...sample(1,2,x=>2/x).slice(1),...sample(2,1,x=>x/2).slice(1),...sample(1,.5,x=>1/(2*x)).slice(1)];
 const path=pointsPath(region.map(p))+' Z';
 b=`<defs><pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M-2 2 L2 -2 M0 10 L10 0 M8 12 L12 8" stroke="#91aaba" stroke-width="1"/></pattern></defs>`;
 b+=text(32,30,'領域 E：斜線部と、実線で示した境界');
 b+=line(62,485,590,485,'class="axis" marker-end="url(#arrow)"')+line(90,512,90,61,'class="axis" marker-end="url(#arrow)"');
 for(const n of [.5,1,2]){const X=p([n,0])[0],Y=p([0,n])[1];b+=line(90,Y,p([2,0])[0],Y,'class="guide"')+line(X,485,X,105,'class="guide"');b+=centered(X,522,[rm(n===.5?'1/2':n)])+math(68,Y+8,[rm(n===.5?'1/2':n)],'text-anchor="end"');}
 b+=`<path d="${path}" fill="white"/><path d="${path}" fill="url(#hatch)" stroke-width="2.4"/>`;
 for(const q of [[.5,1],[1,2],[2,1],[1,.5]])b+=dot(...p(q));
 b+=math(598,491,[mi('x')])+math(73,57,[mi('y')])+math(66,515,[rm('O')]);
 b+=math(140,75,[mi('y'),rm(' = 2'),mi('x')])+line(220,90,...p([.9,1.8]),'class="guide"');
 b+=math(547,172,[mi('y'),rm(' = 2/'),mi('x')])+line(534,180,...p([1.5,2/1.5]),'class="guide"');
 b+=math(547,375,[mi('y'),rm(' = '),mi('x'),rm('/2')])+line(535,365,...p([1.5,.75]),'class="guide"');
 b+=math(315,446,[mi('y'),rm(' = 1/(2'),mi('x'),rm(')')])+line(303,428,...p([.75,1/1.5]),'class="guide"');
 pack.add('ans-q2-region',760,558,'対数不等式の領域E。頂点は(1/2,1)、(1,2)、(2,1)、(1,1/2)。境界はy=2x、2/x、x/2、1/(2x)の各区間で、すべて含む。','境界を含む斜線部。補助線は座標の読み取り用です。',b);
 // Exact decreasing curve and upper/lower rectangles on [k,k+1], drawn at k=2.
 const g=([x,y])=>[150+125*x,440-290*y],k=2,lo=1/Math.sqrt(k+1),hi=1/Math.sqrt(k);
 b=text(32,32,'単調減少を使い、積分を2つの長方形ではさむ');
 b+=poly([g([k,0]),g([k+1,0]),g([k+1,hi]),g([k,hi])],'#faf5e8');
 b+=poly([g([k,0]),g([k+1,0]),g([k+1,lo]),g([k,lo])],'#e5eff5');
 b+=line(124,440,675,440,'class="axis" marker-end="url(#arrow)"')+line(150,465,150,73,'class="axis" marker-end="url(#arrow)"');
 b+=curve(sample(.72,4,x=>1/Math.sqrt(x)).map(g),'stroke-width="2.5"');
 b+=line(150,g([0,hi])[1],g([k,hi])[0],g([k,hi])[1],'class="guide"')+line(150,g([0,lo])[1],g([k,lo])[0],g([k,lo])[1],'class="guide"');
 b+=rootFraction(78,g([0,hi])[1]-35,mi('k'),42)+rootFraction(78,g([0,lo])[1]+28,mi('k')+rm('+1'),78);
 b+=line(126,g([0,hi])[1],126,g([0,hi])[1]-30,'class="guide"')+line(135,g([0,lo])[1],135,g([0,lo])[1]+30,'class="guide"');
 b+=math(325,85,[mi('y'),rm(' = ')])+rootFraction(407,81,mi('x'),42);
 b+=centered(g([k,0])[0],480,[mi('k')])+centered(g([k+1,0])[0],480,[mi('k'),rm('+1')]);
 b+=math(681,447,[mi('x')])+math(132,69,[mi('y')])+math(125,470,[rm('O')]);
 b+=text(32,528,'下の長方形 ＜ 曲線の下の面積 ＜ 上の長方形');
 pack.add('ans-q2-integral-graph',760,560,'y=1/√xの単調減少曲線と区間kからk+1の2つの長方形。下側の高さは1/√(k+1)、上側は1/√k。積分の面積は両者の間にある。','区間の幅は1。端点以外では高さが異なるため、面積の不等号は厳密です。',b);
 // General tetrahedron, not the maximizing special case.
 const T=tetra(.8),project=([x,y,z])=>[240-190*x+350*y,280+135*x-35*y-250*z];
 b=text(32,32,'座標表示と、y軸に関する対称配置');
 for(const [v,l] of [[[1.1,0,0],'x'],[[0,1.15,0],'y'],[[0,0,.8],'z']]){const e=project(v);b+=line(...project(T.O),...e,'class="axis" marker-end="url(#arrow)"')+math(e[0]+9,e[1]-9,[mi(l)]);}
 b+=poly([project(T.A),project(T.B),project(T.C)]);
 b+=line(...project(T.O),...project(T.C),'class="guide"')+line(...project(T.O),...project(T.B))+line(...project(T.O),...project(T.A));
 for(const v of Object.values(T))b+=dot(...project(v));
 b+=math(215,309,[rm('O')])+math(172,420,[rm('A('),mi('p'),rm(', '),mi('q'),rm(', 0)')]);
 b+=math(538,103,[rm('B(0, '),mi('t'),rm(', '),mi('u'),rm(')')])+math(538,413,[rm('C(0, '),mi('t'),rm(', −'),mi('u'),rm(')')]);
 b+=text(32,476,'p、t、u が正の場合の模式図。符号が異なる配置は反射で対応。');
 b+=text(32,512,'Aはxy平面上、B・Cはyz平面上。OA・OB・ABは等しい。');
 pack.add('ans-q3-tetrahedron',760,550,'A(p,q,0)、B(0,t,u)、C(0,t,−u)の四面体。BとCはy軸について対称で、OABは正三角形。一般の正符号の代表配置を射影した模式図。','p²+q²=1、t²+u²=1、qt=1/2。図は正符号の代表配置です。',b);
 // Separate pre-rotation triangle and post-rotation annulus: no double meaning for shading.
 for(const axis of ['x','z']){
  const kval=s*.36,rad=radii(kval),sc=178/rad.outer;
  const center=axis==='x'?[100,290]:[200,407];
  const map=([a,c])=>[center[0]+sc*a,center[1]-sc*c];
  const hor=axis==='x'?'y':'x',ver=axis==='x'?'z':'y';
  b=text(26,31,axis==='x'?'x = k で切った断面':'z = k で切った断面（上半分）');
  b+=text(505,31,'回転後：内側を除いた円環');
  b+=math(26,77,[mi('s'),rm(' = ')])+rootFraction(109,69,rm('2'),42)+math(161,77,[rm('0 < '),mi('k'),rm(' < '),mi('s')]);
  b+=line(26,center[1],422,center[1],'class="axis" marker-end="url(#arrow)"')+line(center[0],459,center[0],122,'class="axis" marker-end="url(#arrow)"');
  b+=math(426,center[1]+8,[mi(hor)])+math(center[0]-22,117,[mi(ver)]);
  const tri=section(axis,kval).map(map); b+=poly(tri);
  tri.forEach(q=>b+=dot(...q));
  if(axis==='x'){
   b+=centered(tri[0][0],center[1]+34,[mi('k')])+math(tri[1][0]+16,tri[1][1]+5,[rm('('),mi('s'),rm(', '),mi('s'),rm('−'),mi('k'),rm(')')]);
   b+=math(tri[2][0]+16,tri[2][1]+16,[rm('('),mi('s'),rm(', −('),mi('s'),rm('−'),mi('k'),rm('))')]);
  }else{
   b+=math(tri[0][0]-20,tri[0][1]+8,[mi('k')],'text-anchor="end"');
   b+=math(tri[2][0]-20,tri[2][1]+8,[mi('s')],'text-anchor="end"');
   b+=math(tri[1][0]+17,tri[1][1]+3,[rm('('),mi('s'),rm('−'),mi('k'),rm(', '),mi('s'),rm(')')]);
  }
  b+=math(center[0]-25,center[1]+30,[rm('O')]);
  b+=line(458,110,458,453,'class="guide"');
  const cx=693,cy=291,outer=178,inner=sc*kval;
  b+=`<circle cx="${cx}" cy="${cy}" r="${outer}" fill="#eaf1f5"/><circle cx="${cx}" cy="${cy}" r="${inner}" fill="white"/>`;
  b+=line(cx,cy,cx+outer*.6,cy-outer*.8)+math(cx+52,cy-87,[mi('R')]);
  b+=line(cx,cy,cx-inner,cy)+math(548,366,[mi('r'),rm(' = '),mi('k')])+line(602,347,cx-inner+5,cy+19,'class="guide"');
  b+=dot(cx,cy)+math(cx+10,cy+27,[rm('O')]);
  b+=math(492,492,[mi('R'),sup('2'),rm(' = '),mi('s'),sup('2'),rm(' + ('),mi('s'),rm('−'),mi('k'),rm(')'),sup('2')]);
  b+=text(26,538,axis==='x'?'回転前の三角形の各点が、原点を中心に一周します。':'負のz側は対称。上半分の体積を2倍します。');
  pack.add(`ans-q3-${axis}-cross-section`,940,573,`${axis}=kの切断面と回転後の円環。s=1/√2、0<k<s。内半径k、外半径の2乗s²+(s−k)²。${axis==='z'?'下半分は対称で体積を2倍する。':'区間0からsで断面積を積分する。'}`,'s=1/√2 とした代表配置。端では円環の穴または厚みが消えます。',b);
 }
 return pack.save(['全6図を問題条件から独立生成。元crop未使用。','区間端・対称移動・円環の内半径を区別。掲載元の解説省略は別途修復待ち。']);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)build();
