import {pathToFileURL} from 'node:url';
import {createSvgPackage,mi,rm,sub,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='st-marianna-2025-general-early-physics';
const arrow='marker-end="url(#arrow)"';
const path=(points,extra='')=>`<path d="${pointsPath(points)}" ${extra}/>`;
const label=(x,y,s,extra='')=>math(x,y,[mi(s)],extra);
const indexed=(x,y,s,index,extra='')=>math(x,y,[mi(s),sub(index)],extra);
const distance=(x,y,n)=>math(x,y,[rm(n===1?'':n),mi('d')]);
const earth=(x,y)=>line(x,y,x,y+15)+line(x-17,y+15,x+17,y+15)+line(x-11,y+22,x+11,y+22)+line(x-5,y+29,x+5,y+29);
export const pulley={m1:9,m2:11,g:9.8,F:196};
pulley.T=pulley.F/2;
pulley.A1=pulley.T/pulley.m1-pulley.g;
pulley.A2=pulley.T/pulley.m2-pulley.g;
pulley.A=(pulley.A1+pulley.A2)/2;
pulley.a0=(pulley.A1-pulley.A2)/2;
// Dimensionless u=x/d. Potential is in V0; field magnitude is in E0=V0/(5d).
export const initialPotential=u=>u/5;
export const isolatedPotential=u=>u<=2?u/5:u<=3?2/5+(u-2)/10:1/2+(u-3)/5;
export const isolatedField=u=>u>2&&u<3?.5:1;
export const reconnectedPotential=u=>isolatedPotential(u)*10/9;
export const capacitanceRatio=10/9;
export const conjugatePositions=(L,f)=>[(L-Math.sqrt(L*L-4*L*f))/2,(L+Math.sqrt(L*L-4*L*f))/2];

// Grids are blank by default: the public question must not reveal the answer.
export function graph({x=110,y=345,w=430,h=250,potential=true,answer=false,dielectric=false,heading=''}){
 const max=potential?1:2,px=u=>x+w*u/5,py=v=>y-h*v/max;
 let b=heading?text(x-48,y-h-57,heading,'font-weight="700"'):'';
 for(let i=0;i<=10;i++)b+=line(x+w*i/10,y,x+w*i/10,y-h,'stroke="#c6d3dd" stroke-width=".8"');
 for(let i=0;i<=10;i++)b+=line(x,y-h*i/10,x+w,y-h*i/10,'stroke="#c6d3dd" stroke-width=".8"');
 b+=line(x,y,x+w+26,y,arrow)+line(x,y,x,y-h-24,arrow);
 b+=text(x-45,y-h-31,potential?'電位':'電場の強さ')+label(x+w+27,y+27,'x');
 b+=math(x-26,y+28,[rm('O')]);
 for(let i=1;i<=5;i++)b+=distance(px(i)-12,y+30,i);
 b+=indexed(x-47,py(1)+7,potential?'V':'E','0');
 if(answer){
  if(potential){
   const values=dielectric?[0,2,3,5]:[0,5];
   b+=path(values.map(u=>[px(u),py((dielectric?isolatedPotential:initialPotential)(u))]),'class="accent"');
  }else{
   const segments=dielectric?[[0,2,1],[2,3,.5],[3,5,1]]:[[0,5,1]];
   for(const [a,z,v]of segments)b+=line(px(a),py(v),px(z),py(v),'class="accent"');
   if(dielectric)for(const u of [2,3]){
    b+=line(px(u),py(.5),px(u),py(1),'class="guide"');
    for(const v of [.5,1])b+=`<circle cx="${px(u)}" cy="${py(v)}" r="3" fill="white" stroke="#b28736"/>`;
   }
  }
 }
 return b;
}
export function build(){
 const pack=createSvgPackage(packageId,import.meta.url);
 {
  let b=`<circle cx="340" cy="200" r="65" fill="#f1f5f7"/>`+dot(340,200);
  b+=path([[275,200],[275,375]])+path([[405,200],[405,400]])+`<path d="M275 200 A65 65 0 0 1 405 200"/>`;
  b+=line(340,200,340,140)+line(340,140,340,50,arrow)+label(354,77,'F');
  b+=line(230,135,230,75,arrow)+label(196,106,'A');
  b+=line(222,350,222,283,arrow)+indexed(171,320,'a','0');
  b+=`<rect x="247" y="375" width="56" height="58" rx="8" fill="#eef3f7"/><rect x="377" y="400" width="56" height="58" rx="8" fill="#eef3f7"/>`;
  b+=indexed(256,411,'m','1')+indexed(386,436,'m','2')+text(237,468,'物体1')+text(369,492,'物体2');
  b+=text(435,116,'鉛直上向きを正')+indexed(75,538,'a','0')+text(107,538,'：滑車から見た物体1の加速度（本文の表記）');
  pack.add('q2-moving-pulley',680,580,'質量の無視できる滑車を上向きの力Fで引き、糸の左端にm1、右端にm2。上向きのAは滑車の加速度の正方向、a0は物体1の相対加速度の正方向。物体の地上加速度の答えは示さない。','第2問[3]の配置と正方向（模式図）',b);
 }
 {
  let b=path([[150,208],[150,90],[303,90]])+line(307,90,363,70)+path([[370,90],[495,90],[495,222]]);
  b+=`<circle cx="307" cy="90" r="4" fill="white"/><circle cx="370" cy="90" r="4" fill="white"/>`;
  b+=line(120,208,180,208,'stroke-width="3"')+line(132,228,168,228,'stroke-width="3"')+path([[150,228],[150,365],[495,365],[495,265]]);
  b+=line(443,222,547,222,'stroke-width="3"')+line(443,265,547,265,'stroke-width="3"')+earth(495,365);
  b+=indexed(78,247,'V','0')+text(192,211,'＋')+text(182,242,'−')+text(553,229,'極板B')+text(553,272,'極板A')+text(265,45,'スイッチ');
  pack.add('q3-capacitor-circuit',690,430,'電源V0の正極は上側の極板Bへスイッチを介して接続。下側の極板Aは電源負極と接地へ接続する。図は開いたスイッチを示し、各設問で開閉を指定する。','図1　電源・スイッチ・平行板コンデンサー',b);
 }
 for(const dielectric of [false,true]){
  const y=u=>390-60*u;
  let b=line(140,y(0),485,y(0),'stroke-width="3"')+line(140,y(5),485,y(5),'stroke-width="3"')+earth(235,y(0));
  b+=line(545,410,545,42,arrow)+label(565,57,'x')+text(68,y(5)-16,'極板B')+text(68,y(0)+29,'極板A');
  for(let i=0;i<=5;i++)b+=line(537,y(i),553,y(i))+(i?distance(566,y(i)+8,i):math(567,y(i)+8,[rm('0')]));
  if(dielectric){
   b+=`<rect x="140" y="${y(3)}" width="345" height="60" fill="#e6edf3" stroke="#8ca2b2"/>`;
   b+=text(165,y(2.5)+6,'誘電体')+math(279,y(2.5)+8,[rm('2'),mi('ε'),sub('0')]);
   for(const [u,s]of [[4,'a'],[3,'b'],[2,'c']])b+=line(370,y(u),535,y(u),'class="guide"')+dot(385,y(u))+text(407,y(u)-11,'点')+label(434,y(u)-10,s);
  }else b+=text(221,228,'極板面積')+label(318,229,'S')+text(196,282,'極板間は空気');
  pack.add(dielectric?'q3-dielectric-layout':'q3-coordinate-axis',650,450,dielectric?'Aをx=0、Bをx=5dとする。2dから3dに厚さd・誘電率2ε0の誘電体、点aは4d、bは3d、cは2dに置く。Aは接地。':'極板Aは接地されx=0、上側の極板Bはx=5d。極板に垂直なx軸を上向きにとる。',dielectric?'図3　誘電体と点a・b・cの位置':'図2　極板と座標軸',b);
 }
 for(const [id,potential]of [['q3-potential-grid',true],['q3-field-grid',false],['q3-dielectric-field-grid',false],['q3-dielectric-potential-grid',true]]){
  pack.add(id,630,420,`横軸xは0から5d、縦軸は${potential?'電位でV0を上端':'電場の強さでE0を中央'}とするグラフ記入欄。解答の曲線は描かれていない。`,'グラフ記入欄',graph({potential}));
 }
 {
  let b=line(88,195,660,195,arrow)+line(150,195,150,130,arrow)+math(136,228,[rm('0')])+text(95,108,'光源');
  b+=`<path d="M340 72 Q308 195 340 318 Q372 195 340 72" fill="#edf4f8"/>`+line(562,67,562,325,'stroke-width="3"');
  b+=text(299,355,'レンズ')+text(507,355,'スクリーン')+label(660,226,'x');
  pack.add('q4-lens-layout',715,395,'x=0の光源、右側の凸レンズ、さらに右側のスクリーンを同じ光軸上に置く。レンズやスクリーンの位置は設問ごとに変えるため固定寸法・結像光線・像は示さない。','光源・凸レンズ・スクリーンの配置（模式図）',b);
 }
 {
  let b='';
  const settings=[{x:86,y:327,potential:true,dielectric:false,heading:'[4]　空気だけ：電位'},
   {x:552,y:327,potential:false,dielectric:false,heading:'[5]　空気だけ：電場'},
   {x:86,y:709,potential:false,dielectric:true,heading:'[6]　挿入後・開放：電場'},
   {x:552,y:709,potential:true,dielectric:true,heading:'[7]　挿入後・開放：電位'}];
  for(const s of settings)b+=graph({...s,w:300,h:215,answer:true});
  b+=text(52,795,'誘電体の境界では電場が不連続。電位は連続し、傾きの大きさだけが変わります。');
  pack.add('a3-answer-graphs',930,830,'第3問[4]電位は0からV0へ直線的に上昇、[5]電場の強さはE0で一定。[6]開放状態で誘電体を挿入すると2dと3dの間だけE0/2、他はE0。[7]電位は2dで2V0/5、3dでV0/2、5dで9V0/10となる連続な折れ線。','第3問[4]〜[7]　電場と電位のグラフ',b);
 }
 return pack.save(['公開問題の条件・境界条件から独立作成。原本クロップを複製していない。','問題の4記入枠は空欄。解答の電場はベクトル成分ではなく強さ。','滑車図のa0は現サイト本文の記号。原本aとの相違・空欄⑫と解説の不整合は修復依頼へ分離。','元HTMLの符号・選択肢・比熱の定義はレビュー待ち。独立図の完成は元資料承認を意味しない。']);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)build();
