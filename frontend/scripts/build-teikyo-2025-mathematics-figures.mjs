// Independent mathematical constructions; no restricted crop content is embedded.
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {mi,rm,math,text,line,dot,pointsPath,createSvgPackage} from './lib/past-exam-svg-author.mjs';
export const packageId='teikyo-2025-general-mathematics';
export const learnerSha='640d2172a211da3b6cb6996708b310ac38820ab0712b5221ec03a97c90ad36ff';
export const g=t=>-3*t*t+3*t+2,absolute=x=>Math.abs(x*x-1)-2,F=x=>x*x*x-3*x*x-6*x;
export const derivative=x=>3*x*x-6*x-6,alpha=1-Math.sqrt(3),beta=1+Math.sqrt(3);
export const sine=x=>Math.sin(x)+Math.sqrt(3)*Math.cos(x);
export const triangle={A:[0,0],B:[7,0],C:[5,Math.sqrt(5)]};
const sup=n=>`<tspan class="rm" font-size="70%" baseline-shift="super">${n}</tspan>`;
const label=(x,y,s,attr='')=>math(x,y,[rm(s)],attr);
const curve=(pts,attr='')=>`<path d="${pointsPath(pts)}" ${attr}/>`;
const sample=(lo,hi,fn,p,n=160)=>Array.from({length:n+1},(_,i)=>{const x=lo+(hi-lo)*i/n;return p([x,fn(x)]);});
const axes=(p,x0,x1,y0,y1)=>line(...p([x0,0]),...p([x1,0]),'class="axis" marker-end="url(#arrow)"')+line(...p([0,y0]),...p([0,y1]),'class="axis" marker-end="url(#arrow)"');
export function parabola(){
 const p=([x,y])=>[290+190*x,250-43*y];
 let b=text(30,32,'数学① 第2問：t = cos θ と置き換えた後のグラフ');
 b+=math(50,78,[mi('y'),rm(' = −3'),mi('t'),sup(2),rm(' + 3'),mi('t'),rm(' + 2')]);
 b+=axes(p,-1.25,1.35,-4.8,3.45)+math(555,257,[mi('t')])+math(270,99,[mi('y')])+label(265,279,'O');
 b+=curve(sample(-1,1,g,p),'stroke-width="2.6"');
 for(const x of [-1,.5,1])b+=line(...p([x,0]),...p([x,g(x)]),'class="guide"')+label(p([x,0])[0]+(x===-1?-26:0),281,x===.5?'1/2':String(x),'text-anchor="middle"');
 [[-1,-4],[.5,11/4],[1,2],[0,2]].forEach((v,i)=>{const [x,y]=p(v);b+=dot(x,y)+label(x+[ -22,12,12,-30][i],y+[-8,-13,-5,-5][i],'ABCD'[i]);});
 b+=line(585,105,585,438,'class="guide"')+text(614,124,'点の座標（t, y）');
 ['A (−1, −4)','B (1/2, 11/4)','C (1, 2)','D (0, 2)'].forEach((s,i)=>b+=label(614,175+i*53,s));
 b+=text(30,484,'定義域は −1 から 1。端点は両方とも含みます。');
 b+=text(30,515,'t の解を数えた後、対応する θ の個数へ戻します。');return b;
}
export function absoluteGraph(){
 const p=([x,y])=>[400+125*x,215-73*y];
 let b=text(30,32,'数学① 第4問(2)：絶対値を含むグラフ');
 b+=math(48,77,[mi('y'),rm(' = |'),mi('x'),sup(2),rm(' − 1| − 2')])+axes(p,-2.7,2.7,-2.7,1.65);
 for(const [a,z] of [[-2.1,-1],[-1,1],[1,2.1]])b+=curve(sample(a,z,absolute,p),'stroke-width="2.6"');
 b+=math(745,222,[mi('x')])+math(380,91,[mi('y')])+label(375,243,'O');
 for(const x of [-Math.sqrt(3),Math.sqrt(3)])b+=dot(...p([x,0]))+label(p([x,0])[0]+(x<0?28:-25),192,x<0?'−√3':'√3','text-anchor="middle"');
 for(const x of [-1,1]){b+=line(...p([x,0]),...p([x,-2]),'class="guide"')+dot(...p([x,-2]));b+=label(p([x,-2])[0],399,`(${x<0?'−1':'1'}, −2)`,'text-anchor="middle"');}
 b+=dot(...p([0,-1]))+label(419,287,'−1');
 b+=text(30,453,'最小点は2つ。中央では下向き、外側では上向きの放物線です。');
 b+=text(30,487,'曲線は左右に続きます。図の両端は定義域の端点ではありません。');return b;
}
export function cubicGraph(){
 const p=([x,y])=>[290+108*x,180-17*y];
 let b=text(30,32,'数学② 第1問(1)：水平線との交点を数える');
 b+=math(45,78,[mi('F'),rm('('),mi('x'),rm(') = '),mi('x'),sup(3),rm(' − 3'),mi('x'),sup(2),rm(' − 6'),mi('x')]);
 b+=axes(p,-2.25,4.35,-19.9,4.6)+curve(sample(-2.2,4.25,F,p),'stroke-width="2.6"');
 for(const [x,name] of [[alpha,'α'],[beta,'β']]){b+=line(...p([x,0]),...p([x,F(x)]),'class="guide"')+dot(...p([x,F(x)]))+math(p([x,0])[0]+(x===beta?25:0),212,[mi(name)],'text-anchor="middle"');}
 b+=label(185,125,'A')+label(599,478,'B');
 b+=line(...p([-2.1,-5]),...p([4.3,-5]),'class="accent" stroke-dasharray="8 5"')+math(685,252,[mi('y'),rm(' = '),mi('k')]);
 b+=math(772,186,[mi('x')])+math(270,94,[mi('y')])+label(266,208,'O');
 b+=math(35,559,[mi('α'),rm(' = 1 − √3,   '),mi('F'),rm('('),mi('α'),rm(') = −8 + 6√3')]);
 b+=math(35,601,[mi('β'),rm(' = 1 + √3,   '),mi('F'),rm('('),mi('β'),rm(') = −8 − 6√3')]);
 b+=text(35,643,'破線は k = −5 の例。極小値と極大値の間では3点で交わります。');return b;
}
export function triangleAndSine(){
 const p=([x,y])=>[125+70*x,290-70*y],A=p(triangle.A),B=p(triangle.B),C=p(triangle.C);
 let b=text(30,32,'数学② 第4問(1)：辺と対角の対応');
 b+=curve([A,B,C,A],'stroke-width="2.4"')+label(A[0]-26,A[1]+9,'A')+label(B[0]+15,B[1]+9,'B')+label(C[0]+1,C[1]-16,'C');
 b+=label(365,325,'7')+math(287,192,[mi('x')])+label(571,199,'3');
 const arc=(v,r,start,end)=>curve(Array.from({length:30},(_,i)=>{const t=start+(end-start)*i/29;return [v[0]+r*Math.cos(t),v[1]-r*Math.sin(t)];}));
 const ang=Math.atan(Math.sqrt(5)/5);b+=arc(A,64,0,ang)+arc(B,49,Math.PI-2*ang,Math.PI);
 b+=math(208,276,[mi('α')])+math(533,268,[rm('2'),mi('α')]);
 b+=text(45,370,'C は直角ではありません。長さと角の条件に合わせて作図しています。');
 b+=line(30,394,810,394,'class="guide"')+text(30,428,'数学② 第4問(2)：合成した三角関数のグラフ');
 const q=([x,y])=>[100+103*x,623-66*y];b+=axes(q,-.25,6.75,-2.4,2.5)+curve(sample(0,2*Math.PI,sine,q),'stroke-width="2.6"');
 b+=math(799,630,[mi('x')])+math(79,461,[mi('y')])+label(73,651,'O');
 for(const x of [0,2*Math.PI])b+=dot(...q([x,sine(x)]));
 for(const [x,s,dx] of [[2*Math.PI/3,'2π/3',-31],[5*Math.PI/3,'5π/3',32],[2*Math.PI,'2π',0]])b+=label(q([x,0])[0]+dx,655,s,'text-anchor="middle"');
 b+=line(...q([2*Math.PI,0]),...q([2*Math.PI,Math.sqrt(3)]),'class="guide"')+label(770,509,'√3');
 b+=label(38,511,'√3')+line(82,508,...q([0,Math.sqrt(3)]),'class="guide"');
 for(const [x,y] of [[Math.PI/6,2],[7*Math.PI/6,-2]]){b+=dot(...q([x,y]))+line(...q([0,y]),...q([x,y]),'class="guide"');if(y<0)b+=label(50,q([0,y])[1]+7,'−2');}
 b+=math(226,477,[mi('y'),rm(' = 2 sin('),mi('x'),rm(' + π/3)')]);
 b+=label(45,824,'最大点 (π/6, 2)     最小点 (7π/6, −2)');return b;
}
export function supplement(){const M=s=>`\\(${s}\\)`,major='major-question-05';return {schemaVersion:'lexus-answer-supplement.v1',packageId,sourceSha256:learnerSha,contentProvenance:'original_editorial',restrictedSourceCopied:false,review:{needsHumanReview:true,notes:'Fの導関数の符号から独立計算。図と表を分離し、取込解説の出典状態は変更しない。'},operations:[{type:'insert-after',expectedMatches:1,anchor:{type:'prose',major_question_id:major,text:"\\(F'(x)=0\\) より \\(x=1\\pm\\sqrt3\\) です。\\(\\alpha=1-\\sqrt3\\)、\\(\\beta=1+\\sqrt3\\) とおくと、増減表は原本の次の表のようになります。"},blocks:[{type:'table',major_question_id:major,variant:'variation',caption:'3次関数Fの増減表',headers:[M('x'),'…',M('\\alpha'),'…',M('\\beta'),'…'],rows:[[M("F'(x)"),'+','0','−','0','+'],[M('F(x)'),'↗',M('F(\\alpha)'),'↘',M('F(\\beta)'),'↗']]}]}]};}
export function build(){const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('a-math1-q2-parabola',830,540,'y=−3t²+3t+2、−1から1の放物線。頂点は(1/2,11/4)、両端は(−1,−4)と(1,2)。','置き換えたtと元の角θの解の個数を区別します。',parabola());
 pack.add('a-math1-q4-graph',800,510,'y=|x²−1|−2。x切片は±√3、y切片は−1、最小点は(−1,−2)と(1,−2)。','絶対値の中身の符号で、2つの放物線をつなぎます。',absoluteGraph());
 pack.add('a-math2-q1-variation',820,665,'F(x)=x³−3x²−6x。α=1−√3で極大値−8+6√3、β=1+√3で極小値−8−6√3。両極値の間に水平線を引くと交点は3個。','増減表はHTMLで掲載し、ここには交点を読むグラフを示します。',cubicGraph());
 pack.add('a-math2-q4-graphs',850,850,'上はAB=7、BC=3、角B=2角Aを満たす三角形。下は0から2πにおけるy=sin x+√3 cos x。切片は2π/3、5π/3と√3。','(1)の三角形と(2)の三角関数は、別々の図です。',triangleAndSine());
 pack.save('条件の関数・辺長・角度から独立生成。数式だけのcrop5点はSVGへ変換せず、元HTMLの意味構造修復を待つ。');
 fs.writeFileSync(new URL(`../src/data/pastExamBatch/answer-supplements/${packageId}.json`,import.meta.url),JSON.stringify(supplement(),null,2)+'\n');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)build();
