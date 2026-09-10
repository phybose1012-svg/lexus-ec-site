// Independent schematics from the stated conditions, not traced source crops.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,mi,rm,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='kanazawa-medical-2025-general-early-physics';
export const single={center:[295,204],radius:125,phase:Math.PI/4};
// An illustrative radius ratio only. The ratio to be solved is NOT supplied here.
export const binary={center:[295,209],outer:128,inner:65,phase:Math.PI/4};
export const orbitPoint=(center,r,t)=>[center[0]+r*Math.cos(t),center[1]-r*Math.sin(t)];
export const block={A:[105,130],B:[177,290],C:[248,290],D:[425,170],scale:160,angle:42};
export const endControl=[365,170+60*Math.tan(block.angle*Math.PI/180)];
export const orbitalValues=()=>{const omega=2*3.14/3.14e4,V=3e8*2.4e-3/2,r=V/omega,M=V*V*r/6.67e-11;return{omega,V,r,M,vP:1.5*V,vQ:.5*V,rP:1.5*r,rQ:.5*r,mPrime:2*M,MPrime:6*M};};
export const blockValues=()=>{const VB=-Math.sqrt(19.6/90),VD=-Math.sqrt(4.9/171);return{VB,vB:-9*VB,L:-.2,l:1.8,VD,vx:-9*VD,vy:-9*VD};};
const mid='text-anchor="middle"',end='text-anchor="end"',arrow='marker-end="url(#arrow)"';
const style='<style>text{font-size:20px}.math{font-size:30px}.orbit{stroke:#52758b;stroke-width:2}.body{fill:#eef3f6}.dimension{stroke:#7e8e9b;stroke-width:1.2}</style>';
const circle=(cx,cy,r,extra='')=>`<circle cx="${cx}" cy="${cy}" r="${r}" ${extra}/>`;
function arc(center,r,a,b,extra=''){
 const ps=Array.from({length:31},(_,i)=>orbitPoint(center,r,a+(b-a)*i/30));
 return `<path d="${pointsPath(ps)}" ${extra}/>`;
}
const body=(p,r=7)=>circle(...p,r,'fill="white" stroke="#18334c" stroke-width="2"');
function singleStar(){
 const {center:c,radius:r,phase:t}=single,P=orbitPoint(c,r,t);
 let s=style+text(250,30,'図1　天体Qを中心とする円運動',mid);
 s+=circle(...c,r,'class="orbit"')+line(...c,...P,'class="guide"');
 s+=line(c[0]-10,c[1],35,c[1],arrow)+text(100,176,'O の方向',mid);
 s+=arc(c,r+14,.32,1.17,arrow)+text(314,69,'反時計回り',mid);
 s+=body(c,9)+body(P)+math(269,246,[rm('Q')])+math(406,111,[rm('P')]);
 s+=math(350,199,[mi('r')]);
 s+=math(170,379,[rm('P: '),mi('m')],mid)+math(340,379,[rm('Q: '),mi('M')],mid);
 return s;
}
function binaryStar(){
 const {center:c,outer,inner,phase:t}=binary,P=orbitPoint(c,outer,t),Q=orbitPoint(c,inner,t+Math.PI);
 let s=style+text(250,30,'図2　共通重心Cのまわりの円運動',mid);
 s+=circle(...c,outer,'class="orbit"')+circle(...c,inner,'class="orbit"')+line(...P,...Q,'class="guide"');
 s+=line(c[0]-9,c[1],35,c[1],arrow)+text(102,180,'O の方向',mid);
 s+=arc(c,outer+14,.32,1.12,arrow)+arc(c,inner+12,4.15,5.08,arrow);
 s+=dot(...c)+body(P)+body(Q,9);
 s+=math(406,116,[rm('P′')])+math(165,268,[rm('Q′')],end)+line(178,259,234,255,'class="guide"')+math(276,195,[rm('C')],end);
 s+=text(250,383,'P′とQ′は同じ周期で回る。',mid);
 s+=math(165,426,[rm('P′: '),mi('m'),rm('′')],mid)+math(345,426,[rm('Q′: '),mi('M'),rm('′')],mid);
 s+=text(250,465,'軌道半径の比・天体の大きさは模式的。',mid);
 return s;
}
function dimension(x1,y1,x2,y2){
 const dx=y1===y2?0:5,dy=y1===y2?5:0;
 return line(x1,y1,x2,y2,'class="dimension"')+line(x1-dx,y1-dy,x1+dx,y1+dy,'class="dimension"')+line(x2-dx,y2-dy,x2+dx,y2+dy,'class="dimension"');
}
function blockAndBall(){
 const {A,B,C,D}=block;
 let s=style+text(280,30,'小球と自由に動く台',mid);
 // The curve shape is schematic. Its endpoint tangent, heights and span are exact.
 s+=`<path d="M${A} C105,239 124,290 ${B} L${C} C310,290 ${endControl} ${D} L425,348 L105,348 Z" class="body"/>`;
 s+=line(22,348,538,348)+text(503,378,'床',mid);
 s+=circle(112,118,10,'fill="white" stroke="#18334c" stroke-width="2"');
 s+=text(161,77,'小球',mid)+math(161,111,[rm('1.0 kg')],mid)+line(132,120,125,120,'class="guide"');
 for(const [p,label,dx,dy] of [[A,'A',-21,-13],[B,'B',0,30],[C,'C',0,30],[D,'D',-18,-20]])s+=dot(...p)+math(p[0]+dx,p[1]+dy,[rm(label)],mid);
 s+=text(335,321,'台',mid)+math(334,379,[rm('9.0 kg')],mid);
 s+=line(29,A[1],96,A[1],'class="guide"')+line(29,B[1],165,B[1],'class="guide"');
 s+=dimension(85,A[1],85,B[1])+math(64,199,[rm('1.0')],end)+math(64,235,[rm('m')],end);
 s+=line(D[0]+6,D[1],523,D[1],'class="guide"')+line(D[0]+6,B[1],523,B[1],'class="guide"');
 s+=dimension(511,D[1],511,B[1])+math(493,232,[rm('0.75')],end)+math(493,270,[rm('m')],end);
 const tangentEnd=orbitPoint(D,114,block.angle*Math.PI/180);
 s+=line(...D,...tangentEnd,'class="accent"')+arc(D,40,0,block.angle*Math.PI/180,'class="accent"');
 s+=math(508,142,[rm('42°')],mid)+text(472,70,'接線',mid);
 s+=line(A[0],358,A[0],421,'class="guide"')+line(D[0],358,D[0],421,'class="guide"');
 s+=dimension(A[0],410,D[0],410)+math(265,447,[rm('2.0 m')],mid);
 s+=line(405,480,491,480,arrow)+text(390,487,'右向きが正',end);
 return s;
}
export function buildFigures(){
 const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('q1-fig1-single-star',500,406,'質量mの天体Pが質量Mの天体Qを中心に半径rで反時計回りに等速円運動する。観測者Oは円運動と同じ平面上の左方、十分遠方にあり、図には方向だけを示す。','図1：天体の大きさは模式的。観測者Oの位置そのものは描いていません。',singleStar());
 pack.add('q1-fig2-binary-star',500,492,'軽い天体P′と重い天体Q′が共通重心Cを挟んだ反対側にあり、同じ周期・同じ向きで円運動する。P′の軌道は外側、Q′は内側。観測者Oは左方の十分遠方。軌道半径の比は解答値を表さない。','図2：2天体は常にCを挟む反対側。半径比は模式的であり、図から測って求めるものではありません。',binaryStar());
 pack.add('q2-fig-block-and-ball',560,510,'摩擦のない水平床上の質量9.0 kgの台。質量1.0 kgの小球をAから静かにはなす。ABは下り曲面、BCは水平、CDは上り曲面。BCよりAは1.0 m、Dは0.75 m高く、ADの水平距離は2.0 m。Dでの曲面の接線は台の水平方向と42度をなす。','AB・CDの曲線形状と小球の大きさは模式的。42°は台の水平方向と接線のなす角で、床から見た射出角ではありません。',blockAndBall());
 return pack.save('問題条件から独立作図。単一天体の中心、共通重心を挟む点の順序と回転方向、BCの水平・高低差・ADの水平距離・Dの接線42度を保存。解答値となる半径比、質量、速度、床基準の射出角は先出ししない。原本クロップのトレース/埋込なし。元の権利/人間レビューは未了のまま。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildFigures();
