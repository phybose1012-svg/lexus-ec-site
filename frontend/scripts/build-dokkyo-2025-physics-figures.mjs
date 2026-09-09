// Question figures, reconstructed from stated physical conditions, not crops.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,mi,rm,sub,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
const arrow='marker-end="url(#arrow)"',centered='text-anchor="middle"';
export const collision={C:{x:110,mass:2},A:{x:325,mass:1},B:{x:590,mass:1},incomingDirection:1};
export const conductor={currentDirection:1,electronDirection:-1};
export const slitGeometry={radius:170,d:40,theta:Math.PI*35/180};
export const selector={theta:Math.PI/3,rotationDirection:1}; // clockwise in front-view SVG coordinates
export const deferredIds=['q2-force-graph-options','q4-rc-circuit','q5-speed-distributions'];
export const requiredIds=['q1-collision-spring','q1-conductor-model','q1-resonance-doppler','q2-earth-satellite','q2-interior-sphere','q2-force-graph-options','q3-screen-slits','q4-rc-circuit','q5-molecular-selector','q5-speed-distributions','q5-gas-vessels'];
const label=(x,y,name,n)=>math(x,y,[rm(name),...(n===undefined?[]:[sub(n)])]);
const dimension=(x1,x2,y,parts)=>line(x1,y,x2,y,'class="axis"')+line(x1,y-6,x1,y+6)+line(x2,y-6,x2,y+6)+math((x1+x2)/2,y-12,parts,centered);
function spring(x1,x2,y){
 const pts=[[x1,y],[x1+12,y]];
 for(let j=0;j<22;j++)pts.push([x1+18+(x2-x1-36)*j/21,y+(j%2?11:-11)]);
 pts.push([x2-12,y],[x2,y]);return `<path d="${pointsPath(pts)}"/>`;
}
function tube(y,piston,moving){
 const left=100,right=460,mid=y+40;
 return line(left,y,right,y)+line(left,y+80,right,y+80)+
  `<rect x="${piston-6}" y="${y}" width="12" height="80" fill="#d6e3eb"/>`+line(46,mid,piston-6,mid)+
  dimension(piston,right,y+122,moving?[mi('L'),rm(' + Δ'),mi('L')]:[mi('L')])+
  `<circle cx="555" cy="${mid}" r="24" fill="#f7ebd8"/>`+label(548,mid+8,'S')+
  math(553,y-13,[mi('f'),sub('0')],centered)+label(195,y-12,'P')+
  (moving?line(590,mid,664,mid,arrow)+math(625,mid-15,[mi('v')],centered):text(612,mid+6,'静止',centered));
}
function screenPanel(top,double){
 const ox=190,oy=top+220,{radius:r,d,theta}=slitGeometry,qx=ox+r*Math.cos(theta),qy=oy-r*Math.sin(theta);
 let body=text(355,top+28,double?'図2　2つのスリット':'図1　1つのスリット',centered);
 // The barrier is closed at O only in the double-slit setup.
 const gaps=double?[oy-d/2,oy+d/2]:[oy];let begin=oy-r;
 for(const gap of gaps){body+=line(ox,begin,ox,gap-8,'stroke-width="2.5"');begin=gap+8;}
 body+=line(ox,begin,ox,oy+r,'stroke-width="2.5"');
 body+=`<path d="M${ox},${oy-r} A${r},${r} 0 0 1 ${ox},${oy+r}" stroke-width="2"/>`;
 body+=line(ox,oy,ox+r,oy,'class="guide"')+line(ox,oy,qx,qy,'class="guide"');
 body+=`<path d="M${ox+45},${oy} A45,45 0 0 0 ${ox+45*Math.cos(theta)},${oy-45*Math.sin(theta)}"/>`;
 body+=math(ox+80,oy-8,[mi('θ')])+math(ox+127,oy-13,[mi('L')]);
 body+=dot(qx,qy)+label(qx+15,qy-8,'Q')+label(ox+r+14,oy+8,'O′');
 body+=text(476,top+97,'半円形スクリーン',centered)+line(430,top+109,337,top+134,'class="guide"');
 body+=label(ox-28,oy+(double?8:32),'O');
 if(double){
  body+=dot(ox,oy);
  for(const [i,sy] of [[1,oy-d/2],[2,oy+d/2]])body+=line(ox,sy,qx,qy,'class="accent"')+dot(ox,sy)+label(118,sy+6,'S',i);
  body+=line(91,oy-d/2,91,oy+d/2)+line(85,oy-d/2,97,oy-d/2)+line(85,oy+d/2,97,oy+d/2)+math(62,oy+8,[mi('d')]);
 }else{
  for(const y of [oy-60,oy,oy+60])body+=line(45,y,165,y,`class="axis" ${arrow}`);
  body+=text(102,top+95,'入射する平面波',centered)+dot(ox,oy);
 }
 return body;
}
export function buildFigures(){
 const pack=createSvgPackage('dokkyo-medical-2025-general-early-physics',import.meta.url);
 let bodies='';
 for(const name of ['C','A','B']){
  const {x,mass}=collision[name];
  bodies+=`<rect x="${x-32}" y="140" width="64" height="64" rx="4" fill="${name==='C'?'#f7ebd8':'#e6eff4'}"/>`+
   label(x-9,180,name)+math(x,124,[...(mass===2?[rm('2')]:[]),mi('m')],centered);
 }
 pack.add('q1-collision-spring',710,294,
  '図1。左から質量2mのC、質量mのA、質量mのB。AとBは自然長のばねで連結され静止。Cは右向きの速度v₀でAに向かう。右向きがx軸正。',
  '図1　衝突前の配置。A・Bとばねは静止している。',
  bodies+spring(collision.A.x+32,collision.B.x-32,171)+line(55,204,657,204,'class="axis"')+
  line(159,102,264,102,arrow)+math(205,86,[mi('v'),sub('0')],centered)+text(457,128,'ばね（自然長）',centered)+
  line(55,249,660,249,`class="axis" ${arrow}`)+math(673,257,[mi('x')]));
 pack.add('q1-conductor-model',700,349,
  '図2。長さL、断面積Sの一様な導体棒に電圧Vをかける模式図。図では電流Iが右向き、自由電子のドリフト速度vが左向き。',
  '図2　電流と自由電子の移動方向は逆向き。',
  `<path d="M165 112 L525 112 A16 43 0 0 1 525 198 L165 198 A16 43 0 0 1 165 112" fill="#eaf1f5"/>`+
  `<ellipse cx="525" cy="155" rx="16" ry="43" fill="#d9e7ef"/>`+
  line(53,155,131,155,arrow)+math(88,134,[mi('I')],centered)+
  dot(374,155)+math(376,139,[rm('−'),mi('e')])+line(352,155,270,155,arrow)+math(306,139,[mi('v')],centered)+
  math(579,164,[mi('S')])+line(566,152,539,155,'class="guide"')+
  math(147,91,[rm('+')])+math(518,91,[rm('−')])+
  dimension(165,525,243,[mi('L')])+dimension(165,525,307,[mi('V')])+text(589,306,'電圧',centered));
 pack.add('q1-resonance-doppler',720,473,
  '図3は右端が開いたガラス管Pと静止音源S。ピストンから管口までの長さL。図4では音源が右向き速度vで遠ざかり、ピストンを左に動かした気柱長がL+ΔL。',
  '図3・図4　気柱の長さと、音源が遠ざかる方向。',
  text(360,31,'図3　静止している音源',centered)+tube(75,303,false)+
  text(360,255,'図4　遠ざかる音源',centered)+tube(297,253,true));
 const ox=320,oy=233,R=146,X=[ox+(R+12)*Math.cos(Math.PI/4),oy-(R+12)*Math.sin(Math.PI/4)];
 pack.add('q2-earth-satellite',690,463,
  '図1。中心O、半径Rの地球。中心を通る水平トンネルは左端B、右端A。物体Yはトンネル内、人工衛星Xは地表面のすぐ外側にある。衛星と地表の間隔は強調している。',
  '図1　中心を通るトンネルと、地表近くの人工衛星（間隔は拡大）。',
  `<circle cx="${ox}" cy="${oy}" r="${R}" fill="#eef3f6"/>`+
  `<circle cx="${ox}" cy="${oy}" r="${R+12}" class="guide"/>`+
  line(ox-R,oy,ox+R,oy,'stroke-width="6" stroke="white"')+line(ox-R,oy,ox+R,oy)+
  dot(ox,oy)+dot(ox+63,oy)+dot(...X)+label(ox-28,oy+30,'O')+label(ox+54,oy-18,'Y')+
  label(ox-R-42,oy+8,'B')+label(ox+R+16,oy+8,'A')+label(X[0]+17,X[1]-8,'X')+
  line(ox,oy,ox-R*Math.cos(Math.PI/4),oy-R*Math.sin(Math.PI/4),'class="axis"')+math(229,177,[mi('R')])+
  text(ox,425,'地球：一様な密度 ρ',centered));
 const ir=80;
 pack.add('q2-interior-sphere',690,459,
  '図2。地球の中心Oがx軸原点。BからAへ右向きが正。物体Yはx=rにあり、O中心・半径rの内部球の表面に位置する。外側の地球の半径はR。',
  '図2　物体Yの位置rと、同じ半径rの内部球。',
  `<circle cx="${ox}" cy="${oy}" r="${R}" fill="#f7f9fa"/>`+
  `<circle cx="${ox}" cy="${oy}" r="${ir}" fill="#dce9f0" stroke="#9ab1c0"/>`+
  line(104,oy,574,oy,`class="axis" ${arrow}`)+math(589,oy+8,[mi('x')])+
  [ox-R,ox,ox+ir,ox+R].map(x=>dot(x,oy)).join('')+
  label(ox-R-18,oy+33,'B')+label(ox+R+5,oy+33,'A')+label(ox-26,oy+32,'O')+label(ox+ir+10,oy-15,'Y')+
  math(ox+ir+16,oy+43,[mi('r')])+math(ox+R+20,oy-20,[mi('R')])+math(ox-R-53,oy-20,[rm('−'),mi('R')])+
  line(ox+ir+2,oy+7,ox+ir+16,oy+23,'class="guide"')+
  line(ox,oy,ox-ir/Math.SQRT2,oy-ir/Math.SQRT2,'class="axis"')+math(249,205,[mi('r')])+
  text(ox,418,'青い部分：半径 r の球の断面',centered));
 pack.add('q3-screen-slits',700,850,
  '図1はスリットO中心、半径Lの半円形スクリーンと観測点Q。OO′からOQへの角がθ。図2はOを閉じ、Oの上下に距離dだけ離したS₁とS₂。上側S₁からQまでの距離が下側S₂より短い配置例。',
  '図1・図2　スクリーンとスリット。図2のスリット間隔は見やすく拡大。',
  screenPanel(0,false)+line(60,428,640,428,'stroke="#d7e1e8"')+screenPanel(435,true));
 const scx=400,scy=474,sr=69,theta=selector.theta,s2=[scx-sr*Math.sin(theta),scy-sr*Math.cos(theta)];
 pack.add('q5-molecular-selector',760,628,
  '図1。小穴Oから円盤R₁、R₂、検出器へ向かう射線と平行な連結軸。円盤間隔はs。下の正面図はS₁が射線上にある瞬間で、S₂が射線へ達するまで時計回りにθ回る配置を示す。',
  '図1　装置の配置と、射線に対するスリットの角度（模式図）。',
  `<rect x="50" y="60" width="107" height="156" fill="#f7ebd8" stroke="none"/>`+
  `<path d="M157 100 V60 H50 V216 H157 V120"/>`+
  text(103,89,'気体',centered)+text(103,177,'容器',centered)+label(168,101,'O')+
  `<path d="M289 60 V100 M289 120 V230 M501 60 V140 M501 160 V230" stroke-width="7" stroke="#839eaf"/>`+
  line(157,110,678,110,'class="guide"')+line(289,196,501,196,'stroke-width="4"')+
  `<rect x="678" y="89" width="22" height="44" fill="#dce9f0"/>`+text(680,67,'検出器',centered)+
  label(276,39,'R',1)+label(488,39,'R',2)+text(394,219,'連結軸',centered)+text(615,140,'射線',centered)+
  dimension(289,501,281,[mi('s')])+
  text(400,336,'正面図：S₁ が射線を横切る瞬間',centered)+
  `<circle cx="${scx}" cy="${scy}" r="${sr}" fill="#edf3f6" stroke="#98b0c0"/>`+
  line(scx,scy,scx,scy-sr,'class="guide"')+line(scx,scy,...s2,'class="guide"')+
  dot(scx,scy)+`<circle cx="${scx}" cy="${scy-sr}" r="6" fill="#b28736" stroke="white"/>`+
  `<circle cx="${s2[0]}" cy="${s2[1]}" r="6" fill="#476d92" stroke="white"/>`+
  label(scx+16,scy-sr-4,'S',1)+label(s2[0]-48,s2[1]+5,'S',2)+
  `<path d="M${scx-44*Math.sin(theta)},${scy-44*Math.cos(theta)} A44 44 0 0 1 ${scx},${scy-44}" class="accent" ${arrow}/>`+
  math(scx-55,scy-76,[mi('θ')])+
  `<path d="M501 457 A103 103 0 0 1 426 573" ${arrow}/>`+math(510,533,[mi('ω')])+
  text(400,610,'S₂ が次に射線へ来るまでの回転角が θ',centered));
 pack.add('q5-gas-vessels',720,382,
  '図4。閉じたバルブと細いパイプでつながれた断熱容器AとB。AはHe、体積V₀、圧力P₀、温度T₀。BはH₂、体積2V₀、圧力2P₀、温度2T₀。',
  '図4　バルブを開く前の状態。容器・パイプ・バルブは断熱材。',
  `<path d="M294 180 V65 H64 V319 H294 V190 M422 180 V65 H654 V319 H422 V190" fill="#edf3f6"/>`+
  line(294,180,347,180)+line(371,180,422,180)+line(294,190,347,190)+line(371,190,422,190)+
  `<path d="M347 174 L371 196 L371 174 L347 196 Z" fill="white"/>`+line(359,174,359,142)+line(343,142,375,142)+
  text(359,124,'バルブ',centered)+label(169,44,'A')+label(527,44,'B')+
  math(180,108,[rm('He')],centered)+math(539,108,[rm('H'),sub('2')],centered)+
  math(180,171,[mi('V'),sub('0')],centered)+math(539,171,[rm('2'),mi('V'),sub('0')],centered)+
  math(180,216,[mi('P'),sub('0')],centered)+math(539,216,[rm('2'),mi('P'),sub('0')],centered)+
  math(180,261,[mi('T'),sub('0')],centered)+math(539,261,[rm('2'),mi('T'),sub('0')],centered)+
  text(360,360,'バルブを閉めた初期状態',centered));
 return pack.save('公開問題の条件から8図を独自描画。グラフの選択肢順・速さ分布の数値は未確定なので描かず、RC回路も設問と解説の電流条件不一致により保留。restricted画像は複製・トレースしていない。最終科目担当レビュー待ち。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildFigures();
