// Independent coordinates from the problem conditions. Never copies a source crop.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,mi,rm,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='kanazawa-medical-2025-general-early-mathematics';
export const q2={A:[4,-5],B:[2,-1],C:[6,7],D:[3,-2]};
export const parabola=x=>x*x-6*x+7;
export const firstParabola=x=>-x*x+10*x-33;
export const leftTangent=x=>-2*x+3,rightTangent=x=>6*x-29;
export const q4={A:[2,2*Math.sqrt(3)],r:4,p:1.5};
export const sideways=x=>Math.sqrt(6*x),semicircle=x=>Math.sqrt(16-x*x);
export const circleTangent=x=>(8-x)/Math.sqrt(3);
export const parabolaTangent=x=>Math.sqrt(3)*x/2+Math.sqrt(3);
export const areas={q2:16/3,circleGap:4*Math.PI/3-2*Math.sqrt(3)/3,tangentGap:4*Math.sqrt(3)/3};
export const triangleArea=(a,b,c)=>Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))/2;
const center='text-anchor="middle"',arrow='marker-end="url(#arrow)"';
const style='<style>text{font-size:20px}.math{font-size:29px}.curve{stroke-width:2.5}.warm{stroke:#b28736}.cool{stroke:#527c99}</style>';
const sample=(fn,a,b,n=160)=>Array.from({length:n+1},(_,i)=>{const x=a+(b-a)*i/n;return[x,fn(x)];});
const poly=(pts,to,extra='')=>`<path d="${pointsPath(pts.map(p=>to(...p)))}" ${extra}/>`;
const mark=(to,p,n,dx,dy)=>{const [x,y]=to(...p);return dot(x,y)+math(x+dx,y+dy,[mi(n)]);};
const superscript=v=>`<tspan class="rm" font-size="70%" baseline-shift="super">${v}</tspan>`;
const frac=(x,y,a,b,w=36)=>math(x,y,a,center)+line(x-w/2,y+8,x+w/2,y+8)+math(x,y+38,b,center);
function parabolaArea(){
 const to=(x,y)=>[65+60*x,350-28*y],{A,B,C,D}=q2;
 let out=style+text(250,32,'放物線③と2本の接線で囲む領域',center);
 out+=poly([...sample(parabola,2,6),A,B],to,'fill="#f2e4c5" stroke="none"')+'<!-- area-q2: x=2..4 then x=4..6 -->';
 out+=line(...to(-.35,0),...to(6.8,0),`class="axis" ${arrow}`)+line(...to(0,-6.1),...to(0,10.1),`class="axis" ${arrow}`);
 out+=poly([B,C],to,'class="guide"')+poly([A,D],to,'class="guide"');
 out+=poly(sample(parabola,0,6.48),to,'class="curve"');
 out+=poly(sample(leftTangent,.05,4.55),to,'class="curve warm"');
 out+=poly(sample(rightTangent,3.83,6.37),to,'class="curve cool"');
 out+=poly([[4,0],A],to,'class="guide"');
 out+=mark(to,A,'A',45,35)+mark(to,B,'B',-36,22)+mark(to,C,'C',15,-9)+mark(to,D,'D',-50,40);
 out+=math(476,377,[mi('x')])+math(40,62,[mi('y')])+math(37,376,[rm('O')]);
 out+=math(305,337,[rm('4')],center);
 out+=text(133,293,'①')+text(387,431,'②')+text(112,157,'③');
 out+=text(250,554,'接点・頂点の座標',center);
 out+=math(48,595,[mi('A'),rm('(4, −5)')])+math(270,595,[mi('B'),rm('(2, −1)')]);
 out+=math(48,637,[mi('C'),rm('(6, 7)')])+math(270,637,[mi('D'),rm('(3, −2)')]);
 out+=text(35,686,'③')+math(70,686,[mi('y'),rm(' = '),mi('x'),superscript('2'),rm(' − 6'),mi('x'),rm(' + 7')]);
 out+=text(250,729,'①・②の交点 A で積分区間を分ける。',center);
 return out;
}
function semicircleAreas(){
 const to=(x,y)=>[245+43*x,345-43*y],A=q4.A;
 let out=style+text(250,32,'前半：①・②と y 軸に囲まれる面積',center);
 out+=text(35,72,'①')+math(66,72,[mi('y'),superscript('2'),rm(' = 6'),mi('x')]);
 out+=text(231,72,'②')+math(264,72,[mi('x'),superscript('2'),rm(' + '),mi('y'),superscript('2'),rm(' = 16')]);
 out+=text(250,104,'いずれも上半分を描画',center);
 out+=poly([...sample(semicircle,0,2),...sample(sideways,2,0)],to,'fill="#f2e4c5" stroke="none"')+'<!-- area-circle-gap: semicircle minus parabola over x=0..2 -->';
 out+=line(...to(-4.7,0),...to(5.1,0),`class="axis" ${arrow}`)+line(...to(0,-.4),...to(0,4.75),`class="axis" ${arrow}`);
 // Parameter sampling includes both endpoints of the semicircle exactly.
 out+=poly(Array.from({length:181},(_,i)=>{const t=Math.PI*i/180;return[4*Math.cos(t),4*Math.sin(t)];}),to,'class="curve cool"');
 out+=poly(sample(sideways,0,4.1),to,'class="curve"');
 out+=poly(sample(circleTangent,-.05,4.9),to,'class="curve warm"');
 out+=poly([[0,0],A],to,'class="guide"')+poly([A,[2,0]],to,'class="guide"');
 out+=poly(Array.from({length:31},(_,i)=>{const t=Math.PI/3+i*Math.PI/180;return[1.35*Math.cos(t),1.35*Math.sin(t)];}),to,'stroke="#b28736"');
 out+=mark(to,A,'A',10,82)+line(350,252,336,203,'class="guide"')+math(239,374,[rm('O')],'text-anchor="end"');
 out+=math(469,374,[mi('x')])+math(225,138,[mi('y')]);
 for(const x of [-4,2,4])out+=math(to(x,0)[0],376,[rm(x)],center);
 out+=text(387,139,'①')+text(83,234,'②');
 out+=frac(194,270,[mi('π')],[rm('6')],28)+line(221,281,268,287,'class="guide"');
 out+=math(250,422,[mi('A'),rm('(2, 2√3)')],center);
 out+=text(250,460,'A は①と②の交点。2曲線は接しない。',center);
 out+=text(250,493,'金色の直線は②の接線。',center);
 out+=line(25,520,475,520,'stroke="#d6dfe5"');
 const lower=(x,y)=>[220+58*x,855-58*y];
 out+=text(250,557,'後半：①・③と x 軸に囲まれる面積',center);
 out+=poly([...sample(parabolaTangent,-2,2),...sample(sideways,2,0),[-2,0]],lower,'fill="#dbe8f0" stroke="none"')+'<!-- area-tangent-gap: tangent over -2..0 and tangent minus parabola over 0..2 -->';
 out+=line(...lower(-2.8,0),...lower(4.2,0),`class="axis" ${arrow}`)+line(...lower(0,-.35),...lower(0,4.55),`class="axis" ${arrow}`);
 out+=poly(sample(sideways,0,3.3),lower,'class="curve"');
 out+=poly(sample(parabolaTangent,-2.35,2.95),lower,'class="curve cool"');
 out+=poly([A,[2,0]],lower,'class="guide"');
 out+=mark(lower,A,'A',13,29)+dot(...lower(-2,0));
 out+=math(465,883,[mi('x')])+math(200,605,[mi('y')])+math(198,883,[rm('O')],'text-anchor="end"');
 out+=math(lower(-2,0)[0],883,[rm('−2')],center)+math(lower(2,0)[0],883,[rm('2')],center);
 out+=text(398,631,'①')+text(166,728,'③');
 out+=text(250,934,'青い直線③は①の接線。',center);
 out+=text(250,970,'x = 0 で、下側の境界が切り替わる。',center);
 return out;
}
export function buildFigures(){
 const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('ans-q2-parabola-area',500,754,'放物線③ y=x²−6x+7の接点B(2,−1)、C(6,7)と頂点D(3,−2)。接線① y=−2x+3と② y=6x−29の交点はA(4,−5)。放物線を上側、2本の接線を下側として囲まれる領域を示す。','第2問：x=4で下側の直線が替わる。囲み面積は16/3。破線BC・ADは三角形の面積を考える補助線。',parabolaArea());
 pack.add('ans-q4-parabola-semicircle',500,995,'上段は放物線① y²=6xの上半分、半円② x²+y²=16とy軸の囲み。交点A(2,2√3)での円の接線とOAを示す。下段は放物線①、点Aでの接線③、x軸の囲み。2種類の領域と接線を別々に示す。','第4問：前半の面積は4π/3−2√3/3、後半は4√3/3。Aは2曲線の交点で、それぞれの接線は異なる。',semicircleAreas());
 return pack.save('問題条件から座標・接線・積分を独立計算。第2問は上下の縮尺が異なる。第4問は等縮尺で、円と放物線の交点を接点と混同しない。原本クロップはトレース・埋込なし。元データの権利・人間レビュー未了を維持。第3問のマーク枠と第4問の見出し等は別途修復依頼。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildFigures();
