import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,math,mi,rm,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='saitama-medical-2025-general-early-mathematics';
export const learnerSha='88a08b4aeed67ae0987e752af08dca9d03901eb03ebf4067d0cccf52fa37ffb8';
export function geometry(t=2.2){
 if(!(t>1))throw Error('The construction requires an interior arc point, t > 1');
 return {O:[0,0],A:[1,0],B:[0,1],C:[0,-1],P:[2*t/(1+t*t),(t*t-1)/(1+t*t)],Q:[1/t,0],S:[t,0],R:[1,t-1],T:[1,1-1/t]};
}
export const minimumDisplacement=k=>10*(2*k+1)/(k*k+1);
export const ratioDerivative=k=>-2*(k*k+k-1)/(k*k+1)**2;
export const exponential=x=>Math.exp(x)+3*Math.exp(-x);
export const exponentialDerivative=x=>Math.exp(x)-3*Math.exp(-x);
const M=s=>`\\(${s}\\)`;
const P=([x,y])=>[120+230*x,385-230*y];
const segment=(a,b,extra='')=>line(...P(a),...P(b),extra);
const polygon=(pts,extra='')=>`<path d="${pointsPath(pts.map(P))} Z" ${extra}/>`;
const unit=(a,b)=>{const d=[b[0]-a[0],b[1]-a[1]],n=Math.hypot(...d);return d.map(v=>v/n);};
function rightAngle(v,a,b){const u=unit(v,a),w=unit(v,b),r=.065;return `<path d="${pointsPath([u.map((x,i)=>v[i]+r*x),u.map((x,i)=>v[i]+r*(x+w[i])),w.map((x,i)=>v[i]+r*x)].map(P))}" class="axis"/>`;}
function angle(v,a,b,name,r=25,labelRadius=47){
 const c=P(v),aa=P(a),bb=P(b);let start=Math.atan2(aa[1]-c[1],aa[0]-c[0]),delta=Math.atan2(bb[1]-c[1],bb[0]-c[0])-start;
 while(delta>Math.PI)delta-=2*Math.PI;while(delta<-Math.PI)delta+=2*Math.PI;
 const pts=Array.from({length:25},(_,i)=>[c[0]+r*Math.cos(start+delta*i/24),c[1]+r*Math.sin(start+delta*i/24)]);
 const mid=start+delta/2;
 return `<path d="${pointsPath(pts)}" class="accent"/>`+math(c[0]+labelRadius*Math.cos(mid),c[1]+labelRadius*Math.sin(mid)+7,[mi(name)],'text-anchor="middle"');
}
export function draw(mode){
 const g=geometry(),t=2.2;let s='';
 if(mode==='similarity')s+=polygon([g.P,g.B,g.C],'fill="#edf3f7" stroke="none"')+polygon([g.P,g.Q,g.S],'fill="#faf4e7" stroke="none"');
 s+=segment([-.16,0],[2.55,0],'class="axis" marker-end="url(#arrow)"')+segment([0,-1.12],[0,1.48],'class="axis" marker-end="url(#arrow)"');
 const arc=Array.from({length:101},(_,i)=>P([Math.cos(i*Math.PI/200),Math.sin(i*Math.PI/200)]));
 s+=`<path d="${pointsPath(arc)}" stroke-width="2.3"/>`;
 s+=segment(g.C,[1.12,t*1.12-1])+segment(g.B,[2.4,1-2.4/t])+segment(g.A,[1,1.36]);
 if(mode!=='question')s+=rightAngle(g.P,g.B,g.C);
 if(mode==='similarity'){
  s+=rightAngle(g.O,g.B,g.S)+rightAngle(g.A,g.T,g.S);
  s+=angle(g.B,g.P,g.C,'α')+angle(g.C,g.P,g.B,'β',34,70);
  s+=angle(g.Q,g.P,g.S,'α',23,44)+angle(g.S,g.P,g.Q,'β',36,67);
  s+=angle(g.T,g.R,g.P,'α',20,43)+angle(g.R,g.P,g.T,'β',31,69);
 }
 for(const[name,dx,dy]of[['O',-26,27],['A',8,30],['B',-29,0],['C',-28,8],['P',-32,-30],['Q',-46,36],['R',16,-7],['S',8,30],['T',20,-8]]){
  const p=P(g[name]);s+=dot(...p)+math(p[0]+dx,p[1]+dy,[mi(name)]);
 }
 s+=math(718,412,[mi('x')])+math(94,45,[mi('y')])+math(400,54,[mi('ℓ')])+math(575,305,[mi('ℓ'),rm('′')]);
 s+=text(42,680,mode==='question'?'円弧ABと、点C・Bを通る2直線':mode==='orthogonal'?'直径BCに対する円周角は直角':'青：△PBC　　薄い金：△PQS');
 s+=text(42,710,mode==='similarity'?'αとβの対応を確認するための配置例です。':'点Pは円弧ABの内側の一点を例示しています。');
 return s;
}
export function supplement(){
 const major=n=>`major-question-0${n}`;
 const table=(n,caption,headers,rows)=>({type:'table',major_question_id:major(n),caption,headers,rows});
 return {schemaVersion:'lexus-answer-supplement.v1',packageId,sourceSha256:learnerSha,contentProvenance:'original_editorial',restrictedSourceCopied:false,review:{needsHumanReview:true,notes:'導関数から独立に再構成した2つのHTML増減表。元の解答欄20と説明の欠落は別途修復待ち。'},operations:[
  {type:'insert-after',expectedMatches:1,anchor:{type:'formula',major_question_id:major(1),latex:'x=\\log\\sqrt3=\\frac12\\log3'},blocks:[table(1,'指数関数の増減表',[M('x'),'…',M('\\frac12\\log3'),'…'],[[M("f'(x)"),M('-'),M('0'),M('+')],[M('f(x)'),'↘','最小','↗']])]},
  {type:'insert-after',expectedMatches:1,anchor:{type:'formula',major_question_id:major(2),latex:"f'(k)=\\frac{-2(k^2+k-1)}{(k^2+1)^2}"},blocks:[{type:'prose',major_question_id:major(2),text:'ここでは'+M('k>0')+'の範囲だけを比較します。'+M('k_1=(-1+\\sqrt5)/2')+'と置くと、増減は次の表になります。'},table(2,'移動量を決める関数の増減表',[M('k'),M('0'),'…',M('k_1'),'…'],[[M("f'(k)"),'[[no-value]]',M('+'),M('0'),M('-')],[M('f(k)'),'[[no-value]]','↗','最大','↘']])]}
 ]};
}
export function build(){
 const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('q3-geometry',800,740,'単位円の四分円弧AB上のP。CPとBPがx軸と交わるQ、Sと、x=1の直線との交点R、T。数値や求める角の答えを示さない配置例。','円弧と2直線の配置',draw('question'));
 pack.add('ans-q3-geometry-1',800,740,'直径BCと円周上の点Pが作る直角BPC。CPとBPの直交を確かめる図。','円周角と直交',draw('orthogonal'));
 pack.add('ans-q3-geometry-2',800,740,'三角形PBCとPQSの対応する角α・βを示す。BとQがα、CとSがβで、平行なBCとRTにも同じ角が現れる。','相似と角の対応',draw('similarity'));
 pack.save('全点はt=2.2の独立座標計算。問題図に解答値なし。円弧、直交、相似、点順と角の対応を検証する。原本画像の転用なし。');
 fs.writeFileSync(new URL(`../src/data/pastExamBatch/answer-supplements/${packageId}.json`,import.meta.url),JSON.stringify(supplement(),null,2)+'\n');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))build();
