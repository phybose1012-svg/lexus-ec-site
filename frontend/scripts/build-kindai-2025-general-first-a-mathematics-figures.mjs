// Independent geometry from the problem's equations, not traced source pixels.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,mi,rm,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='kindai-2025-general-first-a-mathematics';
export const g=t=>-2*t*t-3*t+2;
export const H=[4/3,4/3,4/3];
export const sectionRadius=Math.sqrt(8/3);
export const project=([x,y,z])=>[105+62.5*x+87.5*y+2.5*z,375+23.75*x-16.25*y-76.25*z];
export const circlePoint=theta=>[Math.cos(theta),Math.sin(theta)];
const center='text-anchor="middle"',end='text-anchor="end"',arrow='marker-end="url(#arrow)"';
const style='<style>text{font-size:21px}.math{font-size:28px}.selected{stroke:#a37522;stroke-width:4}.blue{stroke:#426e91;stroke-width:2.6}</style>';
const poly=(p,attrs='')=>`<path d="${pointsPath(p)}" ${attrs}/>`;
const label=(x,y,s,attrs='')=>math(x,y,[mi(s)],attrs);
const number=(x,y,s,attrs='')=>math(x,y,[rm(s)],attrs);
const frac=(x,y,top,bottom,w=46)=>number(x,y-9,top,center)+line(x-w/2,y-2,x+w/2,y-2)+number(x,y+27,bottom,center);
const open=(x,y)=>`<circle cx="${x}" cy="${y}" r="5" fill="white" stroke="#a37522" stroke-width="2.4"/>`;
const sample=(f,a,b,n=180)=>Array.from({length:n+1},(_,i)=>f(a+(b-a)*i/n));

function unitCircle(domain){
 const cx=230,cy=220,r=140,point=a=>circlePoint(a).map((v,i)=>i?cy-r*v:cx+r*v);
 let s=`<circle cx="${cx}" cy="${cy}" r="${r}" stroke="#a7b9c6"/>`+line(45,cy,465,cy,`class="axis" ${arrow}`)+line(cx,395,cx,38,`class="axis" ${arrow}`);
 s+=label(207,254,'O')+number(62,255,'−1',center)+number(388,255,'1',center)+label(482,229,'t')+math(405,427,[mi('t'),rm(' = cos '),mi('x')],center);
 if(domain){
  const a=point(Math.PI/3),b=point(5*Math.PI/3);
  s+=poly(sample(point,Math.PI/3,5*Math.PI/3),'class="selected"')+line(a[0],a[1],b[0],b[1],'class="guide"')+open(...a)+open(...b);
  s+=frac(352,88,'π','3',30)+frac(361,344,'5π','3',45)+frac(300,405,'1','2',28);
  s+=text(230,465,'金色の弧：端点を含まない定義域',center);
 }else{
  const a=point(2*Math.PI/3),b=point(4*Math.PI/3),c=point(Math.PI);
  s+=line(a[0],a[1],a[0],234,'class="guide"')+line(b[0],316,b[0],b[1],'class="guide"')+dot(...a)+dot(...b)+dot(...c);
  s+=frac(130,63,'2π','3',46)+frac(128,369,'4π','3',46)+label(57,203,'π')+frac(160,273,'−1','2',45);
  s+=text(230,465,'真数が3になる角は3個',center);
 }
 return s;
}
function parabola(){
 const px=t=>400+260*t,py=v=>350-82*v;
 let s=line(75,350,550,350,`class="axis" ${arrow}`)+line(400,382,400,42,`class="axis" ${arrow}`);
 for(const y of [1,2,3])s+=line(px(-1.03),py(y),px(.48),py(y),'class="guide"')+number(112,py(y)+8,String(y),end);
 s+=poly(sample(t=>[px(t),py(g(t))],-1,.5),'class="blue"')+dot(px(-1),py(3))+open(px(.5),py(0))+dot(px(-.75),py(25/8));
 s+=line(px(-.75),py(25/8),px(-.75),350,'class="guide"')+line(211,86,240,58,'class="guide"');
 s+=frac(253,45,'25','8',43)+number(385,385,'0',end)+number(px(-1),385,'−1',center)+frac(px(-.75),413,'−3','4',42)+frac(px(-.5),400,'−1','2',42)+frac(px(.5),400,'1','2',26);
 s+=math(425,45,[mi('g'),rm('('),mi('t'),rm(')')])+label(553,338,'t',end);
 return s;
}
function space(){
 const o=project([0,0,0]),a=project([4,0,0]),b=project([0,4,0]),c=project([0,0,4]),h=project(H),m=project([0,2,2]);
 let s=poly([a,b,c,a],'fill="#f2f6f8"')+line(...o,...project([4.5,0,0]),arrow)+line(...o,...project([0,4.45,0]),arrow)+line(...o,...project([0,0,4.45]),arrow);
 s+=line(...o,...h,'class="accent"')+line(...o,...m,'class="guide"');
 for(const p of [o,a,b,c,h,m])s+=dot(...p);
 s+=label(83,398,'O')+label(352,499,'A')+label(476,347,'B')+label(83,62,'C')+label(329,283,'H')+label(285,171,'M',center);
 s+=label(405,490,'x')+label(508,291,'y')+label(139,36,'z');
 return s+text(260,545,'座標の投影図。金色のOHは平面ABCに垂直。',center);
}
function plane(){
 const cx=260,cy=280,r=112,R=2*r,A=[cx-Math.sqrt(3)*r,cy+r],B=[cx+Math.sqrt(3)*r,cy+r],C=[cx,cy-R];
 const theta=130*Math.PI/180,X=[cx+r*Math.cos(theta),cy-r*Math.sin(theta)];
 let s=poly([A,B,C,A],'fill="#f6f8fa"')+`<circle cx="${cx}" cy="${cy}" r="${r}" fill="white" class="blue"/>`+line(cx,cy,...X,'class="accent"');
 for(const p of [A,B,C,[cx,cy],X])s+=dot(...p);
 s+=label(A[0]-20,A[1]+28,'A')+label(B[0]+8,B[1]+28,'B')+label(260,36,'C',center)+label(279,304,'H')+label(X[0]-30,X[1]-13,'X')+line(367,247,438,224,'class="guide"')+label(451,234,'D');
 return s+text(260,460,'平面ABCの正面図。Dの中心はH。',center);
}
function rightTriangle(){
 const o=[80,300],h=[365,300],x=[365,300-285/Math.sqrt(2)];
 return poly([o,h,x,o])+poly([[350,300],[350,285],[365,285]])+label(54,325,'O')+label(381,326,'H')+label(381,89,'X')+number(192,182,'2√2',center)+frac(222,343,'4√3','3',60)+frac(437,202,'2√6','3',60);
}
export const markExamples=[{id:'notice-mark-example-1',caption:'−8を答える場合',rows:[['ア','−'],['イ','8']],sourceCaption:'注意事項（1）のマークシート記入例。ア欄で−、イ欄で8を塗りつぶす例。（差し替え待ち）'},{id:'notice-mark-example-2',caption:'−4/5を答える場合',rows:[['ウ','−'],['エ','4'],['オ','5']],sourceCaption:'注意事項（2）の分数のマークシート記入例。ウ欄で−、エ欄で4、オ欄で5を塗りつぶす例。（差し替え待ち）'}];
export function markSupplement(){
 return {packageId,provenance:'original_editorial',basis:'原本の解答欄と選択記号の対応（−8、−4/5）を確認。クロップは複製せず、同じ対応を意味HTML表にする。注意文や試験問題は改変しない。',operations:markExamples.map(e=>({type:'replace-text',scope:'shared',from:`<figure class="crop-card" data-crop-id="${e.id}" data-replacement-status="pending_redraw"><div class="replacement-pending">図版の模写差し替え待ち<br>原本クロップは公開候補へ含めていません</div><figcaption>${e.sourceCaption}</figcaption></figure>`,to:`<div class="table-scroll"><table class="source-table" data-kindai-mark-example="${e.id}"><caption>${e.caption}</caption><thead><tr><th scope="col">解答欄</th><th scope="col">塗りつぶす記号</th></tr></thead><tbody>${e.rows.map(([a,b])=>`<tr><th scope="row">${a}</th><td>${b}</td></tr>`).join('')}</tbody></table></div>`,expectedMatches:1}))};
}
export function build(){
 const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('a1-domain-circle',520,490,'t=cos xの単位円。tが−1以上1/2未満となる金色の弧はπ/3から5π/3までで、両端を含まない。','定義域を単位円で確認する。',style+unitCircle(true));
 pack.add('a1-parabola',570,460,'真数g(t)=−2t²−3t+2を−1以上1/2未満で描く。頂点は(−3/4,25/8)、左端(−1,3)を含み右端(1/2,0)を除く。','真数の最大値と整数水平線。',style+parabola());
 pack.add('a2-unit-circle',520,490,'真数が3のときcos xは−1または−1/2。単位円上の角はπ、2π/3、4π/3の3個。','整数値3に対応する3つの角。',style+unitCircle(false));
 pack.add('a5-coordinate-space',540,570,'A(4,0,0)、B(0,4,0)、C(0,0,4)を結ぶ平面と原点Oの投影図。BCの中点Mと平面への垂足Hを示す。投影上の角度は実際の角度とは異なる。','座標空間のABCと垂足H。',style+space());
 pack.add('a5-plane-circle',520,480,'正三角形ABCを正面から見た図。球の切り口円Dの中心Hは三角形の重心で、Dは内接円に一致。XはD上の一般の点。','平面ABCと切り口の円D。',style+plane());
 pack.add('a6-right-triangle',520,405,'Hで直角の三角形OXH。OXは2√2、OHは4√3/3、切り口の半径HXは2√6/3。','三平方で切り口の半径を求める。',style+rightTriangle());
 fs.writeFileSync(new URL(`../src/data/pastExamBatch/question-supplements/${packageId}.json`,import.meta.url),JSON.stringify(markSupplement(),null,2)+'\n');
 return pack.save('問題条件から関数・単位円・空間座標・切り口を独立計算。原本クロップは埋込・トレースしていない。元解説の論理の省略と増減表は修復待ち、権利・人間レビューは未承認。共通注意2件は別の意味HTML表で対応。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))build();
