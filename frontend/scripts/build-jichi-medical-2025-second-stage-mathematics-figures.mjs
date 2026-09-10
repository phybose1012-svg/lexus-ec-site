// Independent geometry from the second-stage question, not the first-stage package.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,mi,rm,sub,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='jichi-medical-2025-general-mathematics-second-stage';
export const A=[1,8],B=[7,7],Q=[3,6],R=[6,3],radius=Math.sqrt(17);
export const parallelSlope=23/47,overviewSlope=1/5;
export const slopeBounds=[(-6-2*Math.sqrt(85))/19,(-6+2*Math.sqrt(85))/19];
export function intersections(m){
 const aa=1+m*m,bb=-12+2*m,discriminant=bb*bb-80*aa;
 if(discriminant<0)return [];
 return [-1,1].map(sign=>{const t=(-bb+sign*Math.sqrt(discriminant))/(2*aa);return [1+t,8+m*t];});
}
export const [P,S]=intersections(parallelSlope),M=P.map((v,i)=>(v+Q[i])/2);
export const theta1=-Math.PI/4,theta2=Math.atan(-1/6),theta=theta2-theta1;
const center='text-anchor="middle"',arrow='marker-end="url(#arrow)"';
const style='<style>text{font-size:20px}.math{font-size:32px}</style>';
const poly=(pts,to,extra='')=>`<path d="${pointsPath(pts.map(p=>to(...p)))}" ${extra}/>`;
const label=(to,p,name,dx=0,dy=0)=>{const [x,y]=to(...p);return dot(x,y)+math(x+dx,y+dy,[mi(name)]);};
const rad=(p,q)=>Math.atan2(q[1]-p[1],q[0]-p[0]);
function arc(to,c,r,a,b,extra=''){
 return poly(Array.from({length:41},(_,i)=>{const t=a+(b-a)*i/40;return[c[0]+r*Math.cos(t),c[1]+r*Math.sin(t)];}),to,extra);
}
function angle(to,v,a,b,name,index){
 const start=rad(v,a);let end=rad(v,b);while(end-start>Math.PI)end-=2*Math.PI;while(end-start< -Math.PI)end+=2*Math.PI;
 const mid=(start+end)/2,p=[v[0]+1.02*Math.cos(mid),v[1]+1.02*Math.sin(mid)];
 const [x,y]=to(...p);
 const dx=name==='α'?(index==='1'?-18:-8):(index==='1'?-12:0);
 const dy=name==='α'?(index==='1'?-24:-8):0;
 return arc(to,v,.53,start,end,'stroke="#b28736"')+math(x+dx,y+8+dy,[mi(name),sub(index)],center);
}
function parallelMark(to,a,b){
 const p=a.map((v,i)=>(v+b[i])/2),d=b.map((v,i)=>v-a[i]),len=Math.hypot(...d),u=d.map(v=>v/len),n=[-u[1],u[0]];
 return [-.09,.09].map(s=>poly([p.map((v,i)=>v+(s-.13)*u[i]-.1*n[i]),p.map((v,i)=>v+(s+.04)*u[i]),p.map((v,i)=>v+(s-.13)*u[i]+.1*n[i])],to,'stroke="#b28736"')).join('');
}
function tick(to,a,b){
 const p=a.map((v,i)=>(v+b[i])/2),d=b.map((v,i)=>v-a[i]),len=Math.hypot(...d);
 return poly([[p[0]-.14*d[1]/len,p[1]+.14*d[0]/len],[p[0]+.14*d[1]/len,p[1]-.14*d[0]/len]],to,'stroke="#b28736"');
}
function overview(){
 const to=(x,y)=>[83+45*x,602-45*y],[p,s]=intersections(overviewSlope);
 let out=style+text(350,34,'円と、A を通る2本の直線',center);
 out+=`<circle cx="${to(...B)[0]}" cy="${to(...B)[1]}" r="${45*radius}" fill="#f8fafb"/>`;
 out+=line(...to(-.3,0),...to(12.5,0),`class="axis" ${arrow}`)+line(...to(0,-.3),...to(0,12.2),`class="axis" ${arrow}`);
 out+=math(...to(12.65,-.2),[mi('x')])+math(...to(-.65,12),[mi('y')])+math(...to(-.7,-.65),[rm('O')]);
 out+=poly([[0,9],[9.5,-.5]],to)+poly([[.3,8+overviewSlope*(.3-1)],[12,8+overviewSlope*11]],to);
 out+=poly([A,B],to,'class="guide"');
 for(const [pt,n,dx,dy] of [[A,'A',-29,38],[B,'B',8,34],[p,'P',-28,-22],[Q,'Q',-47,25],[R,'R',-25,38],[s,'S',6,-18]])out+=label(to,pt,n,dx,dy);
 out+=math(...to(9.9,1),[mi('ℓ'),sub('1')])+math(...to(11.8,10.85),[mi('ℓ'),sub('2')])+math(...to(10.5,4),[mi('C')]);
 out+=text(350,658,'ℓ₂は2交点をもつ配置の一例。まだ平行の条件は置かない。',center);
 return out;
}
const toFull=(x,y)=>[76+49*x,625-49*y];
function fullBase(){
 return style+`<circle cx="${toFull(...B)[0]}" cy="${toFull(...B)[1]}" r="${49*radius}" fill="#f8fafb"/>`+
 poly([P,Q,R,S,P],toFull,'fill="#eef3f6"')+poly([Q,A,S],toFull)+poly([A,B],toFull,'class="guide"');
}
function proof(){
 let out=fullBase()+text(350,32,'平行線の同位角と、円に内接する四角形',center);
 out+=poly([P,B,Q],toFull,'class="guide"');
 out+=parallelMark(toFull,P,Q)+parallelMark(toFull,S,R);
 out+=angle(toFull,Q,A,P,'α','1')+angle(toFull,R,A,S,'α','2')+angle(toFull,P,A,Q,'β','1')+angle(toFull,S,A,R,'β','2');
 for(const [pt,n,dx,dy] of [[A,'A',-38,9],[B,'B',13,28],[P,'P',-29,-16],[Q,'Q',-34,27],[R,'R',-3,41],[S,'S',7,-17]])out+=label(toFull,pt,n,dx,dy);
 out+=math(576,493,[mi('C')]);
 out+=text(350,603,'同じ印の弦は平行。点の配置は問題条件から計算。',center);
 out+=math(350,649,[mi('PQ'),rm(' ∥ '),mi('SR')],center);
 return out;
}
function midpoint(){
 let out=fullBase()+text(350,32,'角の二等分線が、弦の中点を垂直に通る',center);
 out+=poly([A,B],toFull,'class="accent"')+poly([P,Q],toFull,'class="accent"');
 const u=[-6/Math.sqrt(37),1/Math.sqrt(37)],v=[1/Math.sqrt(37),6/Math.sqrt(37)],r=.3;
 out+=poly([M.map((x,i)=>x+r*u[i]),M.map((x,i)=>x+r*(u[i]+v[i])),M.map((x,i)=>x+r*v[i])],toFull);
 out+=tick(toFull,M,P)+tick(toFull,M,Q);
 for(const [pt,n,dx,dy] of [[A,'A',-38,9],[B,'B',13,27],[P,'P',-29,-16],[Q,'Q',-34,27],[R,'R',-3,41],[S,'S',7,-17],[M,'M',15,-16]])out+=label(toFull,pt,n,dx,dy);
 out+=math(576,493,[mi('C')]);
 out+=math(195,600,[mi('MP'),rm(' = '),mi('MQ')],center)+math(505,600,[mi('AM'),rm(' ⊥ '),mi('PQ')],center);
 out+=math(195,648,[mi('AM'),rm(' = 14/√37')],center)+math(505,648,[mi('QM'),rm(' = 10/√37')],center);
 return out;
}
function alternative(){
 // Enlarged rays preserve direction, not segment lengths. Separate unsigned
 // geometric angles from signed inclination angles instead of conflating them.
 const top=(x,y)=>[95+x,180-y],bottom=(x,y)=>[95+x,480-y];
 let out=style+text(350,33,'① 二等分された角 θ（正の角）',center);
 const ray=(to,a,len,extra='')=>line(...to(0,0),...to(len*Math.cos(a),len*Math.sin(a)),extra);
 out+=ray(top,theta2+theta,295)+ray(top,theta2,445,'class="accent"')+ray(top,theta1,228);
 out+=dot(...top(0,0))+math(57,187,[mi('A')]);
 out+=math(385,86,[mi('AS'),rm(' ('),mi('ℓ'),sub('2'),rm(')')])+math(554,263,[mi('AB')])+math(272,369,[mi('AR'),rm(' ('),mi('ℓ'),sub('1'),rm(')')]);
 out+=arc(top,[0,0],73,theta2,theta2+theta,'stroke="#b28736"')+arc(top,[0,0],73,theta1,theta2,'stroke="#b28736"');
 out+=math(207,170,[mi('θ')])+math(192,245,[mi('θ')]);
 out+=line(50,405,650,405,'class="guide"')+text(350,445,'② 水平右向きを基準にした、符号付きの角',center);
 out+=ray(bottom,0,490,'class="guide"')+ray(bottom,theta2,450,'class="accent"')+ray(bottom,theta1,333);
 out+=dot(...bottom(0,0))+math(53,490,[mi('A')]);
 out+=math(586,490,[mi('x')])+math(557,567,[mi('AB')])+math(335,735,[mi('AR')]);
 out+=arc(bottom,[0,0],110,0,theta2,arrow)+arc(bottom,[0,0],192,0,theta1,arrow);
 out+=math(380,591,[mi('θ'),sub('2')])+line(368,573,208,491,'class="guide"');
 out+=math(292,603,[mi('θ'),sub('1')]);
 out+=text(350,774,'θ₁・θ₂ は時計回りなので負。線分の長さは模式的。',center);
 out+=math(350,817,[mi('θ'),rm(' = '),mi('θ'),sub('2'),rm(' − '),mi('θ'),sub('1'),rm(' > 0')],center);
 return out;
}
function trigTriangle(){
 const to=(x,y)=>[100+60*x,368-60*y];
 let out=style+text(325,34,'tan θ = 5/7 を、直角三角形で表す',center);
 out+=poly([[0,0],[7,0],[7,5],[0,0]],to,'fill="#f8fafb"');
 out+=poly([[6.7,0],[6.7,.3],[7,.3]],to)+arc(to,[0,0],.85,0,theta);
 out+=math(182,347,[mi('θ')])+math(310,412,[rm('7')])+math(553,225,[rm('5')])+math(285,176,[rm('√74')]);
 return out;
}
export function buildFigures(){
 const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('ans-overview-diagram',700,685,'中心B(7,7)、半径√17の円Cと点A(1,8)を通る2直線。ℓ₁上はA,Q(3,6),R(6,3)の順、ℓ₂上はA,P,Sの順。ℓ₂はm=1/5の一例で、PQとSRの平行は仮定していない。','1）・2）：円と2直線の全体像。ℓ₂の傾きは例示。',overview());
 pack.add('ans-proof-diagram',700,675,'PQとSRが平行な円内接四角形PQRS。∠AQP=α₁、∠ARS=α₂、∠APQ=β₁、∠ASR=β₂を各頂点に示す。ABは共通辺、BPとBQは円の半径。','3）：角の等しさから二等辺三角形と合同を示す。',proof());
 pack.add('ans-midpoint-diagram',700,675,'Aと円の中心Bを結ぶ直線が弦PQとMで直交し、MP=MQ。AM=14/√37、QM=10/√37。四角形PQRSと、面積差に用いる大小の三角形を同じ配置に示す。','4）・5）：中点・垂線から弦の長さと面積を求める。',midpoint());
 pack.add('ans-alternative-diagram',700,845,'上段はABで二等分された∠SARの正の角θ。下段は水平右向きからARとABへの時計回りの角θ₁とθ₂で、θ₁=−π/4、θ₂=arctan(−1/6)、θ=θ₂−θ₁>0。方向は正確で線分長は模式的。','別解4）：図形の角θと、符号付きの傾き角を区別する。',alternative());
 pack.add('ans-trig-triangle',650,445,'角θの隣辺が7、対辺が5、斜辺が√74の直角三角形。tan θ=5/7、sin θ cos θ=35/74となる。','別解5）：三角比を辺の比として計算する。',trigTriangle());
 return pack.save('二次試験の円と直線から交点・角・距離を独立計算。全体図は平行条件を先取りしない。制限付きcropは参照・複製せず、傾き角は符号付きで作図。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildFigures();
