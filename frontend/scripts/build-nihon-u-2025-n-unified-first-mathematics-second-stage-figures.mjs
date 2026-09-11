import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,math,mi,rm,sub,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='nihon-u-2025-n-unified-first-mathematics-second-stage';
export const f=x=>1/Math.sqrt(1+x*x);
export const df=x=>-x/(1+x*x)**1.5;
export const ddf=x=>(2*x*x-1)/(1+x*x)**2.5;
export const x0=1/Math.sqrt(2);
export const roots=k=>[(1-4*k-Math.sqrt(1-8*k))/8,(1-4*k+Math.sqrt(1-8*k))/8];
export const volume=k=>Math.PI*(1-4*k)*Math.sqrt(1-8*k)/32;
const M=s=>`\\(${s}\\)`,mid='text-anchor="middle"';
const curve=(P,g,a,b,n=150)=>Array.from({length:n+1},(_,i)=>{const x=a+(b-a)*i/n;return P(x,g(x));});
const draw=ps=>`<path d="${pointsPath(ps)}"/>`;
function axes(P,xmax,ymax){return line(...P(-.03,0),...P(xmax,0),'class="axis" marker-end="url(#arrow)"')+line(...P(0,-.05),...P(0,ymax),'class="axis" marker-end="url(#arrow)"')+math(P(xmax,0)[0]+16,P(xmax,0)[1]+8,[mi('x')])+math(P(0,ymax)[0]-13,P(0,ymax)[1]-12,[mi('y')])+math(P(0,0)[0]-23,P(0,0)[1]+27,[mi('O')]);}
export function answerSupplement(){const major='major-question-03';return {schemaVersion:'lexus-answer-supplement.v1',packageId,sourceSha256:'944824dfbd242d60d57ede5b03c8b5196ddf9792cf1861dd2e91836e36dff8b4',contentProvenance:'original_editorial',restrictedSourceCopied:false,review:{needsHumanReview:true,notes:'f(x)=(1+x²)^(-1/2)の導関数から独立計算したHTML凹凸表。元画像を複製せず、表用crop一箇所だけを置換。'},operations:[{type:'replace-crop-with-table',expectedMatches:1,anchor:{type:'crop',major_question_id:major,asset_id:'ans-q3-convexity-table'},blocks:[{type:'table',major_question_id:major,caption:'増減・凹凸表',headers:[M('x'),M('0'),'…',M('1/\\sqrt2'),'…'],rows:[[M("f'(x)"),M('0'),M('-'),M('-'),M('-')],[M("f''(x)"),M('-'),M('-'),M('0'),M('+')],[M('f(x)'),M('1'),'[[trend:decrease:concave-down]]',M('\\sqrt6/3'),'[[trend:decrease:concave-up]]']]}]}]};}
export function build(){
 const pack=createSvgPackage(packageId,import.meta.url);
 {
  const P=(x,y)=>[90+950*x,340-370*y];
  let s=axes(P,.43,.75)+draw(curve(P,Math.sqrt,0,.34));
  s+=line(...P(0,0),...P(.33,.66),'class="accent"')+line(...P(0,.125),...P(.28,.685),'class="guide"');
  s+=dot(...P(1/16,1/4))+dot(...P(1/4,1/2));
  s+=line(...P(1/16,1/4),140,149,'class="guide"')+text(105,96,'接点')+math(105,128,[rm('(1/16, 1/4)')]);
  s+=line(445,58,475,58,'class="accent"')+math(490,66,[mi('y'),rm(' = 2'),mi('x')]);
  s+=line(445,102,475,102,'class="guide"')+math(490,110,[mi('y'),rm(' = 2'),mi('x')]);
  s+=math(515,143,[rm('+ 1/8')]);
  s+=line(445,182,475,182)+math(490,190,[mi('y'),rm(' = √'),mi('x')]);
  s+=text(90,400,'原点を通る直線と接線が、共有点数の境界。');
  pack.add('ans-q2-k-range-graph',650,425,'平方根曲線と傾き2の直線。k=0では原点と(1/4,1/2)で交わり、k=1/8では(1/16,1/4)で接する。','共有点数が変わる二つの境界',s);
 }
 {
  const k=.08,[a,b]=roots(k),P=(x,y)=>[100+2250*x,340-590*y];
  let s=`<path data-region="under-root" d="${pointsPath([P(a,0),...curve(P,Math.sqrt,a,b),P(b,0)])} Z" fill="#e4edf3" stroke="none"/>`;
  s+=axes(P,.205,.47)+draw(curve(P,Math.sqrt,0,.20))+line(...P(0,k),...P(.18,.36+k),'class="accent"');
  for(const [x,label]of [[a,'α'],[b,'β']]){s+=line(...P(x,0),...P(x,Math.sqrt(x)),'class="guide"')+dot(...P(x,Math.sqrt(x)))+math(P(x,0)[0],373,[mi(label)],mid);}
  s+=math(480,46,[mi('y'),rm(' = 2'),mi('x'),rm(' + '),mi('k')])+math(465,146,[mi('y'),rm(' = √'),mi('x')]);
  s+=text(185,291,'回転する領域')+text(100,410,'直線との間ではなく、曲線から x 軸まで。');
  pack.add('ans-q2-rotation-region',650,435,'αからβの間で平方根曲線の下側全体を薄青で表示。下端はx軸であり、直線y=2x+kではない。k=0.08の例。','x軸まわりに回す領域（k=0.08の例）',s);
 }
 {
  const g=x=>.55+.18*x*x,P=(x,y)=>[75+140*x,310-110*y],a=.7,b=2.7,x=1.8;
  let s=`<path d="${pointsPath([P(a,0),...curve(P,g,a,b),P(b,0)])} Z" fill="#e4edf3" stroke="none"/>`+axes(P,3.5,2.35)+draw(curve(P,g,.15,2.95));
  for(const [t,l]of [[a,'a'],[b,'b']])s+=line(...P(t,0),...P(t,g(t)),'class="guide"')+math(P(t,0)[0],340,[mi(l)],mid);
  s+=line(...P(x,0),...P(x,g(x)),'class="accent"')+math(P(x,0)[0],340,[mi('x')],mid)+math(345,251,[mi('f'),rm('('),mi('x'),rm(')')]);
  s+=math(442,58,[mi('y'),rm(' = '),mi('f'),rm('('),mi('x'),rm(')')])+text(75,390,'円板の半径 f(x) → 断面積 π{f(x)}²');
  pack.add('ans-q2-volume-explanation',650,420,'正の関数の下でaからbの領域をx軸まわりに回転する一般模式図。縦の線分f(x)が円板の半径となる。','円板法：縦の線分をx軸まわりに回す（一般図）',s);
 }
 {
  const P=(x,y)=>[120+370*x,335-250*y],h=f(x0);
  let s=`<path data-region="cylinder-part" d="${pointsPath([P(0,0),P(x0,0),P(x0,h),P(0,h)])} Z" fill="#e4edf3" stroke="none"/><path data-region="variable-discs" d="${pointsPath([P(0,h),...curve(P,f,0,x0)])} Z" fill="#f8efd9" stroke="none"/>`;
  s+=axes(P,1.25,1.13)+draw(curve(P,f,0,1.22))+line(...P(x0,0),...P(x0,h))+line(...P(0,h),...P(x0,h),'class="guide"');
  s+=math(90,P(0,1)[1]+6,[rm('1')])+math(93,P(0,h)[1]+7,[rm('√6/3')],'text-anchor="end"')+math(P(x0,0)[0],368,[mi('x'),sub('0')],mid)+math(440,230,[mi('y'),rm(' = '),mi('f'),rm('('),mi('x'),rm(')')]);
  s+=text(145,245,'一定半径の円板')+line(247,108,290,52,'class="guide"')+text(303,49,'曲線までの円板');
  s+=text(105,412,'y = √6/3 を境に、円板の半径を切り替える。');
  pack.add('ans-q3-y-axis-rotation',650,440,'f(x)=1/√(1+x²)の下、0からx0=1/√2までの領域。高さ√6/3以下は半径x0、上側は曲線までの半径となるy軸回転。','y軸回転：二種類の円板に分ける',s);
 }
 {
  const g=x=>.3+x*x/3,P=(x,y)=>[100+155*x,340-125*y],a=.55,b=1.85,xa=Math.sqrt(3*(a-.3)),xb=Math.sqrt(3*(b-.3)),y=1.1,x=Math.sqrt(3*(y-.3));
  let s=`<path d="${pointsPath([P(0,a),...curve(P,g,xa,xb),P(0,b)])} Z" fill="#e4edf3" stroke="none"/>`+axes(P,3,2.35)+draw(curve(P,g,0,2.45));
  for(const [t,u,l,j]of [[a,xa,'a','a'],[b,xb,'b','b']])s+=line(...P(0,t),...P(u,t),'class="guide"')+line(...P(u,0),...P(u,t),'class="guide"')+math(75,P(0,t)[1]+7,[mi(l)],'text-anchor="end"')+math(P(u,0)[0],376,[mi('x'),sub(j)],mid);
  s+=line(...P(0,y),...P(x,y),'class="accent"')+math(75,P(0,y)[1]+7,[mi('y')],'text-anchor="end"')+math(197,191,[mi('x'),rm(' = '),mi('g'),rm('('),mi('y'),rm(')')]);
  s+=math(457,31,[mi('y'),rm(' = '),mi('f'),rm('('),mi('x'),rm(')')])+text(100,423,'横の線分を y 軸まわりに回す円板法。');
  pack.add('ans-q3-shell-explanation',650,450,'高さaからbまで曲線とy軸の間を回転する一般模式図。円板半径x=g(y)、対応するx座標はxaとxb。円筒殻法ではない。','y軸まわりの円板法（増加関数の一般図）',s);
 }
 pack.save('問題の関数・境界・回転軸から独立作図。一般図は本問の曲線と区別。凹凸表は別途HTMLに置換。元HTMLの説明・配点根拠の修復、権利・人間レビューは継続。');
 const dir=new URL('../src/data/pastExamBatch/answer-supplements/',import.meta.url);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(new URL(`${packageId}.json`,dir),JSON.stringify(answerSupplement(),null,2)+'\n');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))build();
