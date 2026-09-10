// Geometry from physical conditions; no source pixels or traced crop paths.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,mi,rm,sub,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='keio-2025-general-physics';
const center='text-anchor="middle"',end='text-anchor="end"',arrow='marker-end="url(#arrow)"';
const style='<style>text{font-size:20px}.math{font-size:28px}.blue{stroke:#426e91;stroke-width:2.5}.added{stroke:#a37522;stroke-width:2.6}.minor{stroke:#dce3e8;stroke-width:.65}.major{stroke:#a7b9c6;stroke-width:1}</style>';
const poly=(p,a='')=>`<path d="${pointsPath(p)}" ${a}/>`;
const sample=(f,a,b,n=90)=>Array.from({length:n+1},(_,i)=>f(a+(b-a)*i/n));
const label=(x,y,s,a='')=>math(x,y,[mi(s)],a);
const h0=(x,y)=>math(x,y,[mi('H'),sub('0')]);
const current=(x,y)=>math(x,y,[mi('I'),rm('('),mi('t'),rm(')')]);
const terminal=(x,y,s,dx=-15)=>`<circle cx="${x}" cy="${y}" r="4" fill="white"/>`+label(x+dx,y-10,s,dx<0?end:'');
const rule=y=>line(24,y,496,y,'stroke="#dce3e8"');
export function bounceModel({v0=10,theta=Math.PI*55/180,e=.64,g=9.8,count=3}={}){
 if(!(v0>0&&theta>0&&theta<Math.PI/2&&e>0&&e<1&&g>0))throw Error('Invalid bounce model');
 const vx=v0*Math.cos(theta),vy0=v0*Math.sin(theta);let x=0,t=0;
 return Array.from({length:count},(_,n)=>{const vy=vy0*e**n,dt=2*vy/g;
  const segment={n,x,t,vx,vy,dt,points:sample(tau=>[x+vx*tau,vy*tau-g*tau*tau/2],0,dt)};x+=vx*dt;t+=dt;return segment;});
}
function projectile(){
 const s=bounceModel(),scale=21,X=x=>58+scale*x,Y=y=>190-scale*y;
 let out=line(35,190,490,190,'class="axis" '+arrow)+line(58,207,58,34,'class="axis" '+arrow);
 for(const b of s)out+=poly(b.points.map(([x,y])=>[X(x),Y(y)]),'class="blue" data-flight="'+b.n+'"');
 const th=55*Math.PI/180;
 out+=line(58,190,58+105*Math.cos(th),190-105*Math.sin(th),arrow)+poly(sample(a=>[58+45*Math.cos(a),190-45*Math.sin(a)],0,th));
 out+=label(109,181,'θ')+math(95,81,[mi('v'),sub('0')])+label(34,220,'O')+label(486,221,'x')+label(33,42,'y');
 out+=`<circle cx="58" cy="190" r="6" fill="#18334c"/>`+label(16,167,'m');
 out+=line(438,55,438,115,arrow)+label(453,93,'g')+text(489,179,'…');
 return out+text(260,265,'水平な床で反発を繰り返す小球（模式図）',center);
}
function rotating(){
 let s=text(260,32,'図1　正方形コイル',center);
 s+=poly([[238,306],[238,260],[155,260],[155,90],[325,90],[325,260],[262,260],[262,306]]);
 s+=line(240,85,240,320,'class="guide"')+text(259,119,'回転軸');
 s+=line(155,177,91,177,arrow)+line(325,177,389,177,arrow)+label(96,160,'F')+label(373,160,'F');
 s+=line(155,50,325,50,'marker-start="url(#arrow)" '+arrow)+label(240,79,'h',center);
 s+=line(350,90,350,260,'marker-start="url(#arrow)" '+arrow)+label(366,230,'h');
 s+=terminal(238,306,'X',-14)+terminal(262,306,'Y',15)+rule(352);
 s+=text(260,393,'図2　端子X・Y側から見た配置',center);
 const th=Math.PI/6,c=[260,558],d=[Math.cos(th),-Math.sin(th)];
 s+=line(81,558,460,558,'class="axis"')+text(412,590,'水平面',center);
 s+=poly([[c[0]-150*d[0],c[1]-150*d[1]],[c[0]+150*d[0],c[1]+150*d[1]]],'class="blue"');
 s+=poly(sample(a=>[260+83*Math.cos(a),558-83*Math.sin(a)],0,th))+label(357,536,'θ');
 s+=line(100,463,184,463,arrow)+h0(114,446);
 s+=dot(240,570)+dot(280,546)+label(227,610,'X')+label(278,520,'Y');
 s+=text(154,673,'コイル面',center)+line(174,649,169,614);
 return s+text(260,722,'回転軸に垂直な面で角度を定義する',center);
}
// Front half of each helix runs left-to-right while descending: positive
// terminal-top -> terminal-bottom current makes the axial field point up.
export function helixPoints(cx,yt,yb,r,turns,phaseStart=0,phaseEnd=turns*2*Math.PI){
 return sample(u=>[cx-r*Math.cos(u),yt+(yb-yt)*u/(turns*2*Math.PI)],phaseStart,phaseEnd,Math.max(2,Math.ceil((phaseEnd-phaseStart)*20)));
}
function physicalCore(cx,yt,yb,names,measure=false,tx=cx-105){
 const coreR=37;let s=`<rect x="${cx-coreR}" y="${yt-14}" width="${2*coreR}" height="${yb-yt+28}" fill="#edf2f5"/>`;
 s+=`<ellipse cx="${cx}" cy="${yt-14}" rx="37" ry="7" fill="white"/>`;
 function winding(top,bottom,r,turns,first,last,kind){
  let v='';
  for(let i=0;i<turns;i++)v+=poly(helixPoints(cx,top,bottom,r,turns,(2*i+1)*Math.PI,(2*i+2)*Math.PI),'stroke="#99aeba" stroke-dasharray="3 3"');
  for(let i=0;i<turns;i++)v+=poly(helixPoints(cx,top,bottom,r,turns,2*i*Math.PI,(2*i+1)*Math.PI),kind);
  v+=line(tx,top,cx-r,top,kind)+line(tx,bottom,cx-r,bottom,kind)+terminal(tx,top,first)+terminal(tx,bottom,last);
  return v;
 }
 s+=winding(yt,yb,44,8,names[0],names[1],'');
 if(measure)s+=winding(yt+32,yb-32,58,4,names[2],names[3],'class="blue"');
 return s;
}
function ac(x,y){return `<circle cx="${x}" cy="${y}" r="25" fill="white"/>`+poly(sample(t=>[x-17+34*t,y-8*Math.sin(t*2*Math.PI)],0,1));}
function meter(x,y){return `<circle cx="${x}" cy="${y}" r="25" fill="white"/>`+math(x,y+9,[rm('V')],center)+math(x-35,y-33,[rm('+')])+math(x-35,y+48,[rm('−')]);}
function schematicCoil(x,y1,y2,first,last){
 let s='';const top=y1+13,step=(y2-y1-26)/5;
 s+=line(x,y1,x,top)+line(x,y2-13,x,y2);
 for(let i=0;i<5;i++)s+=`<path d="M${x} ${top+i*step} C${x-19} ${top+i*step} ${x-19} ${top+(i+1)*step} ${x} ${top+(i+1)*step}"/>`;
 return s+terminal(x,y1,first,14)+terminal(x,y2,last,14);
}
function coreSetup(){
 let s=text(260,30,'図3　交流電流による励磁',center)+physicalCore(290,92,310,['A','B']);
 s+=ac(85,201)+poly([[85,176],[85,92],[185,92]])+poly([[85,226],[85,310],[185,310]]);
 s+=line(52,171,52,124,arrow)+current(25,112)+line(418,248,418,157,arrow)+h0(435,201)+text(363,73,'磁気コア',center);
 s+=rule(357)+text(260,393,'図4(a)　測定コイルを重ねる',center)+physicalCore(326,465,697,['A','B','E','F'],true,218);
 s+=ac(58,579)+poly([[58,554],[58,465],[218,465]])+poly([[58,604],[58,697],[218,697]]);
 s+=meter(133,579)+poly([[133,554],[133,497],[218,497]],'class="blue"')+poly([[133,604],[133,665],[218,665]],'class="blue"');
 s+=line(28,543,28,504,arrow)+current(35,442)+line(452,616,452,543,arrow)+h0(465,579);
 s+=rule(743)+text(260,781,'図4(b)　同じ接続の回路表示',center);
 s+=ac(72,911)+schematicCoil(206,852,1012,'A','B')+poly([[72,886],[72,852],[206,852]])+poly([[72,936],[72,1012],[206,1012]]);
 s+=line(100,835,165,835,arrow)+current(105,819);
 s+=meter(326,911)+schematicCoil(460,852,1012,'E','F')+poly([[326,886],[326,852],[460,852]],'class="blue"')+poly([[326,936],[326,1012],[460,1012]],'class="blue"');
 return s+text(260,1062,'巻き数・寸法は模式化。端子と接続を保持。',center);
}
export const wiring={given:[['source−','D'],['meter−','H']],added:[['source+','B'],['A','C'],['meter+','E'],['F','G']]};
function wiringFigure(answer=false){
 let s=text(260,33,answer?'問4(l)　結線例':'問4(l)　解答用（未記入）',center);
 for(const [offset,names,isMeter] of [[0,['A','B','C','D'],false],[395,['E','F','G','H'],true]]){
  const x=333,tx=112,ys=[95,188,258,351].map(y=>y+offset),cy=218+offset;
  s+=text(260,70+offset,isMeter?'測定コイル':'励磁コイル',center)+schematicCoil(x,ys[0],ys[1],names[0],names[1])+schematicCoil(x,ys[2],ys[3],names[2],names[3]);
  s+=isMeter?meter(tx,cy):ac(tx,cy);
  s+=poly([[tx,cy+25],[tx,ys[3]],[x,ys[3]]],'data-connection="'+(isMeter?'meter− H':'source− D')+'"');
  s+=line(tx,cy-25,tx,ys[0]);
  if(!isMeter)s+=line(79,cy-42,79,cy-88,arrow)+current(26,cy-103);
  if(answer){
   if(isMeter)s+=poly([[tx,ys[0]],[x,ys[0]]],'class="added" data-connection="meter+ E"')+line(x,ys[1],x,ys[2],'class="added" data-connection="F G"');
   else s+=poly([[tx,ys[0]],[x,ys[1]]],'class="added" data-connection="source+ B"')+poly([[x,ys[0]],[425,ys[0]],[425,ys[2]],[x,ys[2]]],'class="added" data-connection="A C"');
  }
 }
 s+=rule(386);
 if(answer){s+=line(90,802,148,802,'class="added"')+text(168,810,'金色：追加する配線');s+=text(260,850,'励磁電流は逆向き、測定電圧は加算。',center);}
 else s+=text(260,802,'既設の線を残し、不足する配線を記入する。',center);
 return s;
}
function dual(){
 let s=text(260,33,'図5　2組の検出器',center);
 s+=physicalCore(150,113,365,['A','B','E','F'],true,53)+physicalCore(416,113,365,['C','D','G','H'],true,317);
 s+=line(251,298,251,198,arrow)+h0(266,248);
 s+=line(51,434,106,434)+text(120,442,'励磁コイル');
 s+=line(51,477,106,477,'class="blue"')+text(120,485,'測定コイル');
 s+=text(260,537,'各コア内に2つのコイルを重ねる模式図',center);
 return s+text(260,576,'異なる検出器間の磁気的な結合は無視する',center);
}
// NIST Chemistry WebBook, water, Stull (1947), 255.9–373 K.
// https://webbook.nist.gov/cgi/cbook.cgi?ID=C7732185&Type=ANTOINE
// log10(P/bar)=A-B/(T/K+C). This wide-range fit avoids stitching gaps.
export function saturationPressure(celsius){
 const kelvin=celsius+273.15;if(kelvin<255.9||kelvin>373)throw Error('Outside Antoine fit range');
 return 1e5*10**(4.6543-1435.264/(kelvin-64.848));
}
export const maxGraphCelsius=373-273.15; // Stop at the published fit boundary, not an extrapolation.
function vapor(){
 const X=t=>91+3.8*t,Y=p=>450-p*.0038;let s=text(280,31,'図1　水の飽和蒸気圧',center);
 for(let i=0;i<=40;i++){s+=line(X(i*2.5),70,X(i*2.5),450,i%8?'class="minor"':'class="major"');s+=line(91,Y(i*2500),471,Y(i*2500),i%8?'class="minor"':'class="major"');}
 for(let i=0;i<=5;i++)s+=math(X(i*20),485,[rm(i*20)],center)+math(78,Y(i*20000)+8,[rm((i*.2).toFixed(1))],end);
 s+=poly(sample(t=>[X(t),Y(saturationPressure(t))],0,maxGraphCelsius,250),'class="blue" data-vapor-curve="antoine-stull"');
 s+=text(282,526,'温度［℃］',center)+text(23,274,'飽和蒸気圧［10⁵ Pa］','text-anchor="middle" transform="rotate(-90 23 274)"');
 s+=text(260,568,'物性式から独立計算した読み取り用の曲線',center);
 return s+text(260,602,'NIST Chemistry WebBook / Stull (1947)',center);
}
function atmosphere(){
 let s=text(260,33,'図2　薄い仮想大気層',center)+line(130,315,130,85,'class="axis" '+arrow)+text(72,77,'高度');
 s+='<rect x="153" y="154" width="275" height="98" fill="#edf2f5"/>';
 s+=line(125,154,151,154)+line(125,252,151,252)+math(113,163,[mi('h'),rm('+Δ'),mi('h')],end)+label(111,262,'h',end);
 s+=math(291,133,[mi('p'),rm('+Δ'),mi('p')],center)+label(293,285,'p',center)+text(318,208,'仮想大気層',center);
 s+=line(183,160,183,246,'marker-start="url(#arrow)" '+arrow)+math(206,226,[rm('Δ'),mi('h')]);
 s+=line(465,103,465,159,arrow)+label(482,130,'g')+rule(344);
 s+=text(260,383,'図3　ゆっくり上昇する空気塊',center)+line(130,716,130,435,'class="axis" '+arrow)+text(72,425,'高度');
 s+=line(125,490,138,490)+line(125,654,138,654)+math(113,499,[mi('h'),rm('+Δ'),mi('h')],end)+label(110,664,'h',end);
 s+='<rect x="274" y="480" width="70" height="19" fill="#edf2f5"/><rect x="274" y="644" width="70" height="19" fill="#edf2f5"/>';
 s+=math(304,457,[mi('p'),rm('+Δ'),mi('p'),rm(', '),mi('T'),rm('+Δ'),mi('T')],center)+math(307,698,[mi('p'),rm(', '),mi('T')],center);
 s+=line(309,621,309,525,arrow)+text(338,578,'空気塊');
 return s+text(260,760,'同じ高度の大気と圧力が等しいとみなす',center);
}
export function build(){
 const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('q1-projectile',520,290,'床から角θ、速さv0で投射した小球m。xは右、yは上、重力は下。床での反発後も水平速度は一定で、放物線の高さと幅が順次小さくなる。','反発投射の模式図。角度・反発係数は代表例。',style+projectile());
 pack.add('q3-rotating-coil',520,750,'上は辺hの1回巻き正方形コイルと回転軸、外向きの力F、端子X/Y。下はXY側から見たコイル面と水平な磁場H0の角θ。','図1・図2：回転コイルと角度の定義。',style+rotating());
 pack.add('q4-core-setup',520,1090,'図3は交流電源と励磁コイルAB。図4(a)は測定コイルEFを重ね、Eを電圧計の正側、Fを負側へ接続。図4(b)は同じ端子接続を回路記号で示す。H0はコア軸の上向き。','励磁・測定コイルの実配置と等価回路。巻き数は模式化。',style+coreSetup());
 pack.add('q4-wiring-template',520,828,'未記入の解答用回路。励磁コイルAB/CDのDと交流電源下端、測定コイルEF/GHのHと電圧計負側だけが既設線でつながり、その他の端子は開放されている。','解答用の枠。未記入の端子へ正解配線を追加していない。',style+wiringFigure(false));
 pack.add('q4-dual-detectors',520,602,'2本のコアに同じ巻き向きの励磁AB/CDと測定EF/GHを重ねる。静磁場H0はコアに平行で上向き。2検出器間の磁気結合は無視する。','図5：同じ構造の検出器を2組用意する。',style+dual());
 pack.add('q1-vapor-pressure-graph',520,628,'水の飽和蒸気圧の独立計算曲線。横軸は0〜100℃、縦軸は0〜10万Pa、補助格子は2.5℃と2500Pa。解答温度の点や読み取り値は示していない。','NISTのAntoine式（Stull, 1947）から再計算した参考曲線。',style+vapor());
 pack.add('q3-atmosphere-diagrams',520,790,'上は高度hからh+Δhの薄層で下側圧力p、上側p+Δp、重力gは下向き。下は気塊が(p,T)から(p+Δp,T+ΔT)へゆっくり上昇する模式図。','図2・図3：仮想大気層と上昇する空気塊。',style+atmosphere());
 pack.add('ans-q4-wiring',520,879,'既設の電源下端-Dと電圧計負側-Hを維持し、電源上端-B、A-C、電圧計正側-E、F-Gを追加。励磁はB→AとC→Dで逆向き、測定電圧はEFとGHの和。','問4(l)：金色が追加配線。交差のない結線例。',style+wiringFigure(true));
 return pack.save('原本18ページの意味を照合し、投射は運動方程式、コイルは同一巻き向きと端子接続、気体図は与条件から独自生成。蒸気圧はNISTのStull係数から独立計算。原本cropを埋込・トレースしない。元HTMLの式・定数・解答欠落と分析の前提依存不備は別途修復待ち、人間レビュー未承認。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))build();
