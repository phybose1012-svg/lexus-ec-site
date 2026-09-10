// Original schematics from problem conditions; source crops used only to verify topology.
import {pathToFileURL} from 'node:url';
import {createSvgPackage,math,mi,rm,sub,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
const id='jichi-medical-2025-general-physics';
// Keep the mathematical labels readable when the 760px viewBox shrinks on phones.
const figureType='<style>text{font-size:22px}.math{font-size:32px}</style>';
const arrow=(a,b,c,d,extra='')=>line(a,b,c,d,`marker-end="url(#arrow)" ${extra}`);
const label=(x,y,v,extra='')=>math(x,y,[mi(v)],extra);
const dimension=(x1,x2,y,parts)=>line(x1,y,x2,y,'marker-start="url(#arrow)" marker-end="url(#arrow)" class="axis"')+math((x1+x2)/2,y-12,parts,'text-anchor="middle"');
const circle=(x,y,r,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" ${extra}/>`;
const path=(d,extra='')=>`<path d="${d}" ${extra}/>`;
export const circuitEdges=[['plus','S1-left','wire'],['S1-left','top','S1'],['top','bottom','C'],['top','coil-top','S2'],['coil-top','bottom','L'],['bottom','minus','R'],['minus','plus','E']];
export const pv=v=>3/v;
export const springState=(a,p,q,g=9.8)=>({muK:(p-q)/(2*a),center:(q-p)/2,amplitude:(p+q)/2,omega:Math.sqrt(g/a),halfPeriod:Math.PI*Math.sqrt(a/g)});
export const lensImages=()=>{const b=1/(1/20-1/60),a2=25-b,b2=1/(-1/10-1/a2);return {b,a2,b2,distance:60+25+b2};};
export function buildFigures(){
 const pack=createSvgPackage(id,import.meta.url);
 // Both switches are open. Battery positive is above negative; R is only in the charging loop.
 const sw=(x,y,name)=>dot(x,y)+dot(x+65,y)+line(x,y,x+57,y-30)+math(x+30,y-48,[mi('S'),sub(name)],'text-anchor="middle"');
 let b=path('M130 200 V105 H180 M245 105 H370 M370 105 H465 M530 105 H610 V175 M610 305 V375 H130 V265')
 +sw(180,105,'1')+sw(465,105,'2')+line(99,225,161,225)+line(111,250,149,250)+line(130,200,130,225)+line(130,250,130,265)
 +label(79,244,'E')+line(370,105,370,223)+line(340,223,400,223)+line(340,248,400,248)+line(370,248,370,375)+label(420,243,'C')
 +path('M610 175 c30 0 30 26 0 26 c30 0 30 26 0 26 c30 0 30 26 0 26 c30 0 30 26 0 26 c30 0 30 26 0 26')+label(655,247,'L')
 // A white resistance body replaces only its own bottom wire segment.
 +'<rect x="210" y="361" width="88" height="28" fill="white"/>'+label(254,348,'R','text-anchor="middle"')+dot(370,105)+dot(370,375)+text(380,431,'初めは両方のスイッチが開いた状態','text-anchor="middle"');
 pack.add('q1-3-circuit',760,470,'電池の正極からS1を通ってコンデンサーCへ、戻りに抵抗Rがある充電回路。S2を閉じるとCとLだけの閉回路になる。両スイッチは開いている。','電気振動の回路',b+figureType);
 // Question asks the return time: do not draw a solved orbit or force arrow.
 b=arrow(145,330,635,330,'class="axis"')+arrow(390,450,390,80,'class="axis"')+label(651,338,'x')+label(379,59,'y')+dot(390,330)+label(365,365,'O')+arrow(390,318,390,220)+label(411,252,'v')+math(417,366,[mi('q'),rm(' > 0')])+text(440,410,'質量')+label(490,410,'m');
 for(const [x,y] of [[210,150],[290,150],[510,150],[590,150],[210,235],[290,235],[510,235],[590,235]]) b+=circle(x,y,10)+line(x-5,y-5,x+5,y+5)+line(x-5,y+5,x+5,y-5);
 b+=math(240,478,[mi('B')])+text(270,478,'：紙面の表から裏へ');
 pack.add('q4-particle-diagram',760,515,'磁場Bは紙面の裏向き。正電荷qは原点Oからy軸正方向に速さvで発射される。解答となる軌道は描いていない。','磁場と粒子の初速度',b+figureType);
 // Identical wavefront radii preserve phase. Wavefront spacing is schematic, not a new given.
 b='<defs><clipPath id="wave-area"><rect x="58" y="58" width="644" height="410"/></clipPath></defs><g clip-path="url(#wave-area)">';
 for(const x of [280,480])for(let n=1;n<=8;n++)b+=circle(x,260,n*32,`stroke="${n%2?'#8a9ba8':'#18334c'}" ${n%2?'stroke-dasharray="6 6"':''}`);
 b+='</g>'+circle(280,260,21,'fill="white" stroke="none"')+circle(480,260,21,'fill="white" stroke="none"')+math(280,268,[mi('S'),sub('1')],'text-anchor="middle"')+math(480,268,[mi('S'),sub('2')],'text-anchor="middle"')+line(185,511,237,511)+text(250,518,'山の波面')+line(437,511,489,511,'stroke-dasharray="6 6"')+text(502,518,'谷の波面');
 pack.add('q10-wave-interference',760,565,'同位相の波源S1とS2から広がる円形波面。両波源で同じ半径の実線が山、破線が谷を表す。節線と腹線は解答する内容なので描かない。波面の間隔は模式的。','同位相の波の山と谷（模式図）',b+figureType);
 // Draw open mouths, never an end cap or solved standing-wave mode.
 b='';for(const [y,len,cm]of [[155,300,30],[355,400,40]]){
  b+=path(`M180 ${y-35} H${180+len} M180 ${y+35} H${180+len}`)+path(`M80 ${y-15} H99 L124 ${y-35} V${y+35} L99 ${y+15} H80 Z`,'fill="#eef3f6"')+path(`M138 ${y-22} Q158 ${y} 138 ${y+22}`,'class="axis"')+dimension(180,180+len,y+83,[rm(cm+' cm')])+text(180+len+25,y+7,'開口')+math(67,y-55,[mi('f'),sub('0')]);
 }
 pack.add('q11-open-pipe',760,495,'両端が開いた管の左外側に振動数f0のスピーカー。管長30cmで共鳴し、その次は40cmで共鳴する。振動の次数や波長は未記入。','開管の長さを30 cmから40 cmへ',b+figureType);
 b='<rect x="65" y="180" width="630" height="230" fill="#f3f6f8" stroke="none"/>'+line(65,180,695,180,'class="axis"')+line(205,180,555,180,'stroke-width="7"')+dot(380,365)+line(380,195,380,345,'class="guide"')+dimension(380,555,135,[mi('r')])+line(380,144,380,174,'class="guide"')+line(555,144,555,174,'class="guide"')+line(620,180,620,365,'marker-start="url(#arrow)" marker-end="url(#arrow)" class="axis"')+label(637,280,'D')+line(401,365,628,365,'class="guide"')+text(97,141,'空気（屈折率1）')+text(97,220,'油（屈折率√2）')+text(400,395,'点光源')+text(387,86,'光を通さない円盤','text-anchor="middle"')+label(716,186,'S');
 pack.add('q13-total-reflection',760,455,'水平な境界面Sの上に半径rの不透明な円盤。その中心の真下、深さDに点光源があり、上は屈折率1の空気、下は屈折率√2の油。rとDは縮尺をそろえていない。','円盤と点光源の配置（断面の模式図）',b+figureType);
 const convex=x=>path(`M${x} 120 Q${x-43} 220 ${x} 320 Q${x+43} 220 ${x} 120 Z`,'fill="#eef3f6"');
 const concave=x=>path(`M${x-18} 120 Q${x+2} 220 ${x-18} 320 H${x+18} Q${x-2} 220 ${x+18} 120 Z`,'fill="#eef3f6"');
 b=line(60,220,709,220,'class="axis"')+convex(440)+concave(600)+arrow(140,220,140,152)+text(140,125,'物体','text-anchor="middle"')+label(440,83,'A','text-anchor="middle"')+label(600,83,'B','text-anchor="middle"')+text(440,108,'凸レンズ','text-anchor="middle"')+text(600,108,'凹レンズ','text-anchor="middle"')+dimension(140,440,376,[rm('60 cm')])+dimension(440,600,376,[rm('25 cm')])+text(380,433,'焦点距離の大きさ　A：20 cm ／ B：10 cm','text-anchor="middle"');
 pack.add('q14-lenses',760,475,'物体の60cm右に焦点距離20cmの凸レンズA、さらに25cm右に焦点距離の大きさ10cmの凹レンズB。像と屈折後の光線は解答なので示さない。距離と形状は模式的。','凸レンズと凹レンズの配置（模式図）',b+figureType);
 const px=v=>135+140*v,py=p=>440-110*p;
 b=arrow(135,440,665,440,'class="axis"')+arrow(135,440,135,55,'class="axis"')+text(96,46,'圧力')+text(670,447,'体積')+label(105,468,'O');
 for(const v of [1,3])b+=line(px(v),440,px(v),py(v===1?3:1),'class="guide"')+math(px(v),475,[...(v===1?[]:[rm('3')]),mi('V')],'text-anchor="middle"');
 for(const pp of [1,3])b+=line(135,py(pp),px(pp===1?3:1),py(pp),'class="guide"')+math(115,py(pp)+7,[...(pp===1?[]:[rm('3')]),mi('p')],'text-anchor="end"');
 const curve=Array.from({length:100},(_,i)=>{const v=1+2*i/99;return [px(v),py(pv(v))];});
 b+=line(px(1),py(1),px(1),py(3))+path(pointsPath(curve))+line(px(3),py(1),px(1),py(1))+arrow(px(1),py(1.7),px(1),py(2.25))+arrow(px(1.7),py(pv(1.7)),px(1.8),py(pv(1.8)))+arrow(px(2.4),py(1),px(2.0),py(1));
 b+=label(px(1)-26,py(1)+28,'A')+label(px(1)+15,py(3)-13,'B')+label(px(3)+17,py(1)+9,'C');
 pack.add('q15-pv-cycle',760,520,'圧力体積図。AはV,p、BはV,3p、Cは3V,p。AからBへ定積加熱、BからCへ等温膨張、CからAへ定圧圧縮。','A→B→C→Aのサイクル',b+figureType);
 b='';for(const [y,right,force] of [[205,true,'40 N'],[425,false,'9.0 N']]){
  const ly=right?y:y-24,ry=right?y-24:y;
  b+=line(145,y+9,615,y+9,'class="axis"')+path(`M180 ${ly} L580 ${ry} L580 ${ry+8} L180 ${ly+8} Z`,'fill="#e8eef3"')+arrow(right?580:180,right?ry:ly,right?580:180,y-123)+text(right?608:97,y-109,force)+dimension(180,580,y-64,[rm('1.0 m')]);
 }
 pack.add('q18-rod',760,475,'同じ不均一な棒の長さは1.0m。上段では左端が接地し右端を40Nで上げ、下段では右端が接地し左端を9.0Nで上げて静止させる。傾きを誇張し、二つの実験を分けた図。','一端ずつ持ち上げる二つの実験（傾きは誇張）',b+figureType);
 const P=330,O=485,Q=610,y=290;
 b='<rect x="85" y="205" width="24" height="113" fill="#e8eef3"/>'+line(85,318,688,318,'stroke-width="3"')+path('M109 290 H127 '+Array.from({length:18},(_,i)=>`L${139+i*9} ${i%2?303:277}`).join(' ')+` L307 ${y}`)+circle(P,y,24,'fill="#edf3f6"')+label(P,y+8,'m','text-anchor="middle"')+label(P-5,244,'B');
 for(const [x,n] of [[P,'P'],[O,'O'],[Q,'Q']])b+=line(x,179,x,265,'class="guide"')+dot(x,318)+label(x,350,n,'text-anchor="middle"');
 b+=dimension(P,O,194,[mi('p')])+dimension(O,Q,194,[mi('q')])+text(486,393,'O：ばねが自然長となる位置','text-anchor="middle"')+text(130,393,'あらい水平面');
 pack.add('q20-25-spring',760,430,'壁に固定したばねにつながる質量mの小球BはPに置かれている。右側に自然長の位置O、そのさらに右にQがあり、PO=p、OQ=q。力や速さ最大の点は未記入。','P・O・Qとばねの縮み・伸び（模式図）',b+figureType);
 return pack.save('問題条件から独自座標で生成。回路の接続/電池極性、波の同位相、PV目盛、棒の左右、ばねのP-O-Q順序を原図の意味と照合。原図の画素・パス・座標は複製していない。問題20の始動条件と目標点の時間モデルは元データ修復待ち。人間によるレビューは未完了。');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)buildFigures();
