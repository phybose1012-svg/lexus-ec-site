// Original curve geometry from the stated functions; no source crop is copied.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,mi,rm,sub,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';

export const contact=Math.PI/4;
export const upper=x=>1/Math.cos(x);
export const lower=x=>2*Math.sin(x);
export const upperSlope=x=>Math.sin(x)/Math.cos(x)**2;
export const lowerSlope=x=>2*Math.cos(x);
export const area=Math.log(1+Math.SQRT2)+Math.SQRT2-2;
const to=(x,y)=>[100+340*x,425-108*y];
const sample=(fn,a,b)=>Array.from({length:161},(_,i)=>{const x=a+(b-a)*i/160;return to(x,fn(x));});
const frac=(x,y,top,bottom,width)=>math(x,y,[...top],'text-anchor="middle"')+line(x-width/2,y+9,x+width/2,y+9)+math(x,y+36,[...bottom],'text-anchor="middle"');

export function buildFigures(){
 const pack=createSvgPackage('fukuoka-2025-general-keitobetsu-mathematics',import.meta.url);
 const [tx,ty]=to(contact,Math.SQRT2);
 let body=`<path d="${pointsPath([...sample(upper,0,contact),...sample(lower,contact,0)])} Z" fill="#f2e4c5" stroke="none"/>`;
 body+=line(70,425,610,425,'class="axis" marker-end="url(#arrow)"')+line(100,445,100,35,'class="axis" marker-end="url(#arrow)"');
 body+=line(100,ty,tx,ty,'class="guide"')+line(tx,ty,tx,425,'class="guide"');
 body+=`<path d="${pointsPath(sample(upper,0,1.28))}" stroke-width="2.4"/>`;
 body+=`<path d="${pointsPath(sample(lower,0,1.4))}" stroke="#557e98" stroke-width="2.4"/>`;
 body+=dot(tx,ty)+dot(...to(0,1));
 body+=math(622,433,[mi('x')])+math(115,36,[mi('y')])+math(70,452,[rm('O')]);
 body+=math(54,324,[rm('1')])+math(36,ty+8,[rm('√2')]);
 body+=frac(tx,454,[mi('π')],[rm('4')],33);
 body+=math(330,76,[mi('C'),sub('1'),rm(': '),mi('y'),rm(' = ')]);
 body+=frac(460,57,[rm('1')],[rm('cos '),mi('x')],73);
 body+=line(499,92,514,113,'class="guide"');
 body+=math(438,290,[mi('C'),sub('2'),rm(': '),mi('y'),rm(' = 2 sin '),mi('x')]);
 body+=line(514,263,520,221,'class="guide"');
 body+=math(175,356,[mi('S')]);
 body+=text(337,515,'網かけ部分：y 軸と接点の間で、C₁が上・C₂が下。','text-anchor="middle"');
 pack.add('a7-area-shaded-region',680,540,'曲線C₁:y=1/cos xとC₂:y=2sin xが(π/4,√2)で接する。y軸から接点まで、上側のC₁と下側のC₂に挟まれた面積Sを網かけで示す。','［Ⅲ］(ii)：積分区間は0からπ/4。被積分関数は1/cos x−2sin x。',body);
 return pack.save('問題の定義域0≦x<π/2の範囲で独自描画。a=2の接点、上下関係、積分面積を数値検算。原本クロップは未使用。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildFigures();
