// Geometry is calculated from the problem, never from crop pixels.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,mi,rm,sub,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='kawasaki-medical-2025-general-regional-quota-physics';
const center='text-anchor="middle"',arrow='marker-end="url(#arrow)"';
const style='<style>text{font-size:20px}.math{font-size:29px}.choice-mark{font-size:28px}.blue{stroke:#4c7796;stroke-width:2.3}.gold{stroke:#b28736;stroke-width:2.3}</style>';
const poly=(pts,attrs='')=>`<path d="${pointsPath(pts)}" ${attrs}/>`;
const sample=(f,a,b,n=90)=>Array.from({length:n+1},(_,i)=>f(a+(b-a)*i/n));
const add=(a,b)=>a.map((v,i)=>v+b[i]),mul=(a,t)=>a.map(v=>v*t),subtract=(a,b)=>a.map((v,i)=>v-b[i]);
const scalar=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
export function filmGeometry(i=42*Math.PI/180,n=1.45,d=1){
 if(!(i>0&&i<Math.PI/2&&n>1&&d>0))throw Error('Invalid thin-film model');
 const r=Math.asin(Math.sin(i)/n),u=[Math.sin(i),Math.cos(i)],v=[Math.sin(r),Math.cos(r)];
 const B=[0,0],D=[d*Math.tan(r),d],E=[2*d*Math.tan(r),0];
 const Bp=add(E,mul(u,-scalar(E,u))),C=mul(v,scalar(E,v)),Ep=[E[0],2*d],H=[E[0],d];
 return {i,n,d,r,u,v,B,D,E,Bp,C,Ep,H};
}
export function wavefrontAt(f,g=filmGeometry()){
 if(f<0||f>1)throw Error('Wavefront fraction outside interval');
 return {G:mul(g.C,f),Gp:add(g.Bp,mul(subtract(g.E,g.Bp),f)),J:mul(g.E,f)};
}
export function graphValue(id,t){
 const z=t-.5;
 switch(id){
  case 1:return .57;
  case 2:return .10+.78*t;
  case 3:return .20+.60/(1+Math.exp(-24*z));
  case 4:return .88-.78*t;
  case 5:return .80-.60/(1+Math.exp(-24*z));
  case 6:return .18+1.25*(Math.sqrt(z*z+.015)-Math.sqrt(.015));
  case 7:return .77-.60*Math.exp(-Math.abs(z)*18);
  case 8:return .87-1.35*(Math.sqrt(z*z+.008)-Math.sqrt(.008));
  case 9:return .16+.66*Math.exp(-Math.abs(z)*18);
  default:throw Error('Unknown graph choice');
 }
}
function choices(){
 let s=text(260,32,'カ〜ケの選択肢（同じものを選択可）',center);
 for(let id=1;id<=9;id++){
  const col=(id-1)%2,row=Math.floor((id-1)/2),x=24+col*256,y=60+row*228;
  s+=text(x+3,y+23,'①②③④⑤⑥⑦⑧⑨'[id-1],'class="choice-mark"');
  s+=line(x+20,y+192,x+218,y+192,'class="axis" '+arrow)+line(x+20,y+192,x+20,y+42,'class="axis" '+arrow);
  s+=poly(sample(t=>[x+40+158*t,y+188-139*graphValue(id,t)],0,1,160),'class="blue"');
  s+=math(x+206,y+220,[mi('t')]);
 }
 return s+text(260,1233,'縦軸の数値・縮尺は指定しない概形',center);
}
function spring(x1,x2,y,turns=12){
 const lead=17,a=x1+lead,b=x2-lead;
 return line(x1,y,a,y)+poly(sample(t=>[a+(b-a)*t,y+12*Math.sin(turns*2*Math.PI*t)],0,1,turns*30))+line(b,y,x2,y);
}
function chamber(piston,top=146,bottom=326){
 return `<rect x="57" y="${top}" width="${piston-57}" height="${bottom-top}" fill="#f1f5f7" stroke="none"/>`+poly([[470,top],[57,top],[57,bottom],[470,bottom]])+`<rect x="${piston}" y="${top}" width="12" height="${bottom-top}" fill="#d9e2e7"/>`;
}
function container(){
 let s=text(260,32,'図1　初期状態（模式図）',center)+chamber(285);
 s+=spring(57,285,240)+text(72,100,'単原子分子理想気体')+math(162,181,[mi('T'),sub('0')]);
 s+=text(380,215,'大気圧',center)+math(380,252,[mi('p'),sub('0')],center);
 s+=line(303,175,343,111)+text(369,96,'断面積',center)+math(432,96,[mi('S')]);
 s+=poly([[23,283],[87,283]])+poly(sample(t=>[87+14*Math.sin(8*Math.PI*t),283+32*t],0,1,100))+poly([[87,315],[23,315]]);
 s+=line(98,310,126,362)+text(135,376,'ヒーター');
 s+=line(57,407,285,407,'marker-start="url(#arrow)" '+arrow)+line(57,340,57,416,'class="guide"')+line(285,339,285,416,'class="guide"')+math(166,400,[mi('L')]);
 s+=text(378,354,'断熱容器',center)+text(260,458,'ばねは自然長。ピストンは軽く、なめらかに動く。',center);
 return s;
}
function pistonForces(){
 let s=text(260,32,'途中の状態とピストンに働く力',center)+chamber(305,119,292)+spring(57,305,221);
 s+=math(163,168,[mi('p')])+math(381,201,[mi('p'),sub('0')])+line(305,114,348,74)+text(361,70,'断面積')+math(455,70,[mi('S')]);
 s+=line(57,340,458,340,'class="axis" '+arrow)+math(468,349,[mi('x')]);
 for(const [x,name] of [[57,'0'],[179,'L'],[305,'x']])s+=line(x,302,x,347,'class="guide"')+math(x,379,[name==='0'?rm(name):mi(name)],center);
 s+=line(179,405,305,405,'marker-start="url(#arrow)" '+arrow)+math(242,441,[mi('x'),rm('−'),mi('L')],center)+text(107,407,'自然長',center);
 s+='<rect x="262" y="476" width="13" height="129" fill="#d9e2e7"/>';
 s+=line(126,513,260,513,'class="blue" '+arrow)+math(172,494,[mi('p'),mi('S')]);
 s+=line(429,513,277,513,'class="gold" '+arrow)+math(361,494,[mi('p'),sub('0'),mi('S')]);
 s+=line(429,581,277,581,'class="gold" '+arrow)+math(343,624,[mi('k'),rm('('),mi('x'),rm('−'),mi('L'),rm(')')],center);
 s+=math(260,680,[mi('p'),mi('S'),rm(' = '),mi('p'),sub('0'),mi('S'),rm(' + '),mi('k'),rm('('),mi('x'),rm('−'),mi('L'),rm(')')],center);
 return s;
}
export const pistonState=v=>({pressure:v,temperature:v*v,initialEnergy:1.5,work:(v*v-1)/2,deltaEnergy:1.5*(v*v-1),heat:2*(v*v-1)});
function pv(){
 const to=(v,p)=>[95+105*v,414-105*p];let s=text(260,32,'気体の仕事は斜線部の面積',center);
 s+=poly([to(1,0),to(1,1),to(3,3),to(3,0),to(1,0)],'fill="#f8eed4" stroke="none"');
 for(let v=1.07;v<3;v+=.18)s+=line(...to(v,0),...to(v,v),'stroke="#c9b77f" stroke-width="1"');
 s+=line(...to(0,0),...to(3.62,0),'class="axis" '+arrow)+line(...to(0,0),...to(0,3.45),'class="axis" '+arrow);
 s+=line(...to(0,0),...to(1,1),'class="guide"')+line(...to(1,1),...to(3,3),'class="blue" '+arrow);
 for(const v of [1,3])s+=line(...to(v,0),...to(v,v),'class="guide"')+line(...to(0,v),...to(v,v),'class="guide"')+dot(...to(v,v))+math(to(v,0)[0],450,[...(v===3?[rm('3')]:[]),mi('S'),mi('L')],center)+math(80,to(0,v)[1]+8,[...(v===3?[rm('3')]:[]),mi('p'),sub('0')],'text-anchor="end"');
 s+=math(63,447,[mi('O')])+math(480,424,[mi('V')])+math(77,48,[mi('p')]);
 return s+math(260,502,[mi('W'),rm(' = 4'),mi('p'),sub('0'),mi('S'),mi('L')],center);
}
const tag=(p,name,dx=10,dy=-10)=>dot(...p)+math(p[0]+dx,p[1]+dy,[mi(name)]);
function rightAngle(p,a,b,size=10){const norm=v=>mul(v,1/Math.hypot(...v)),u=mul(norm(subtract(a,p)),size),v=mul(norm(subtract(b,p)),size);return poly([add(p,u),add(add(p,u),v),add(p,v)],'stroke-width="1.2"');}
function arcMark(p,start,end,radius,label,lp){return poly(sample(t=>[p[0]+radius*Math.cos(t),p[1]+radius*Math.sin(t)],start,end,30),'class="gold"')+math(lp[0],lp[1],[mi(label)]);}
function thinFilm(){
 const g=filmGeometry(),scale=155,to=p=>[170+scale*p[0],251+scale*p[1]];
 const B=to(g.B),D=to(g.D),E=to(g.E),Bp=to(g.Bp),C=to(g.C);
 const A=to(mul(g.u,-1.35)),Ap=to(add(g.E,mul(g.u,-1.35))),F=to(add(g.E,[1.22*Math.sin(g.i),-1.22*Math.cos(g.i)]));
 let s=text(260,32,'図2　薄膜で反射する2光線',center);
 s+=`<rect x="40" y="251" width="440" height="155" fill="#f0f5f7" stroke="none"/><rect x="40" y="406" width="440" height="72" fill="#f7f4ec" stroke="none"/>`+line(40,251,480,251)+line(40,406,480,406);
 s+=line(...A,...B,'class="blue" '+arrow)+line(...Ap,...E,'class="gold" '+arrow)+line(...B,...D,'class="blue" '+arrow)+line(...D,...E,'class="blue" '+arrow);
 // E→F is the common outgoing direction; do not tilt one ray to separate labels.
 s+=line(...E,...F,'class="blue" '+arrow)+text(414,73,'観測点')+math(F[0]+5,F[1]-10,[mi('F')]);
 s+=line(...B,...Bp,'class="guide"')+line(...C,...E,'class="guide"')+rightAngle(Bp,B,E)+rightAngle(C,D,E)+line(B[0],B[1]-101,B[0],B[1]+49,'class="guide"');
 s+=arcMark(B,-Math.PI/2-g.i,-Math.PI/2,49,'i',[B[0]-26,B[1]-64]);
 s+=tag(A,'A',-9,-11)+tag(Ap,'A′',-9,-11)+tag(B,'B',-27,28)+tag(Bp,'B′',12,-8)+tag(C,'C',-29,21)+tag(D,'D',-10,32)+tag(E,'E',10,29);
 s+=text(44,185,'空気')+math(60,290,[mi('n')])+text(45,322,'薄膜')+text(43,441,'ガラス')+math(134,442,[mi('n'),rm('′')]);
 s+=line(449,255,449,403,'marker-start="url(#arrow)" '+arrow)+math(461,341,[mi('d')]);
 return s+text(260,520,'光①：A → B → D → E → F',center)+text(260,555,'光②：A′ → E → F',center)+text(260,590,'厚さ・入射角は代表例。 n′ > n > 1',center);
}
function wavefrontDiagram(){
 const g=filmGeometry(),scale=184,to=p=>[160+scale*p[0],254+scale*p[1]];
 const B=to(g.B),C=to(g.C),E=to(g.E),Bp=to(g.Bp),w=wavefrontAt(.43,g);
 let s=text(260,32,'① 同じ時刻の波面を追う',center);
 s+=`<rect x="36" y="254" width="448" height="160" fill="#f0f5f7" stroke="none"/>`+line(36,254,484,254);
 s+=line(...to(mul(g.u,-1.15)),...B,arrow)+line(...B,...to(mul(g.v,1.04)),arrow)+line(...to(add(g.E,mul(g.u,-1.15))),...E,arrow);
 s+=line(...B,...Bp,'class="guide"')+poly([to(w.G),to(w.J),to(w.Gp)],'class="gold"')+line(...C,...E,'class="blue"')+rightAngle(Bp,B,E)+rightAngle(C,B,E);
 s+=tag(B,'B',-28,18)+tag(Bp,'B′',12,-10)+tag(C,'C',-34,26)+tag(E,'E',10,27)+tag(to(w.G),'G',-28,4)+tag(to(w.Gp),'G′',16,4);
 s+=text(55,205,'空気')+text(50,382,'薄膜')+text(260,454,'BB′ → GG′（屈折した波面）→ CE',center);
 s+=math(260,499,[mi('B'),rm('′'),mi('E'),rm(' = '),mi('n'),mi('B'),mi('C')],center);
 s+=line(32,530,488,530,'stroke="#cbd6de" stroke-width="1"');
 const off=593,sc=156,tr=p=>[151+sc*p[0],off+169+sc*p[1]];
 const b=tr(g.B),c=tr(g.C),d=tr(g.D),e=tr(g.E),ep=tr(g.Ep),h=tr(g.H);
 s+=text(260,off,'② 反射経路を展開する',center);
 s+=`<rect x="37" y="${b[1]}" width="445" height="${sc}" fill="#f0f5f7" stroke="none"/>`+line(37,b[1],482,b[1])+line(37,d[1],482,d[1]);
 s+=line(...tr(mul(g.u,-.68)),...b,arrow)+poly([b,d,e],'class="blue"')+line(...e,...tr(add(g.E,[.7*Math.sin(g.i),-.7*Math.cos(g.i)])),arrow);
 s+=line(...d,...ep,'class="gold"')+line(...e,...ep,'class="guide"')+line(...c,...e,'class="guide"')+line(d[0],d[1]-80,d[0],d[1]+53,'class="guide"');
 s+=rightAngle(c,d,e)+rightAngle(h,d,e)+tag(b,'B',-29,20)+tag(c,'C',-32,29)+tag(d,'D',-24,34)+tag(e,'E',-29,-20)+tag(h,'H',12,30)+tag(ep,'E′',-7,38);
 const theta=Math.PI/2-g.r;
 s+=arcMark(d,-Math.PI/2,-theta,62,'r',[d[0]+19,d[1]-76]);
 s+=line(397,e[1]+3,397,h[1]-3,'marker-start="url(#arrow)" '+arrow)+line(397,h[1]+3,397,ep[1]-3,'marker-start="url(#arrow)" '+arrow);
 s+=math(411,(e[1]+h[1])/2,[mi('d')])+math(411,(h[1]+ep[1])/2,[mi('d')]);
 s+=math(260,1165,[mi('D'),mi('E'),rm(' = '),mi('D'),mi('E'),rm('′')],center)+math(260,1207,[mi('C'),mi('E'),rm('′ = 2'),mi('d'),rm(' cos '),mi('r')],center)+math(260,1250,[rm('Δ'),mi('l'),rm(' = '),mi('n'),mi('C'),mi('E'),rm('′ = 2'),mi('n'),mi('d'),rm(' cos '),mi('r')],center);
 return s;
}
export function build(){
 const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('q2-graph-options',520,1258,'カ〜ケ共通の9グラフ。①一定、②直線増加、③急増後一定、④直線減少、⑤急減後一定、⑥谷を経てほぼ直線増加、⑦両端一定の鋭い谷、⑧山型、⑨鋭い山。番号順に左から右、上から下。','9つの概形を番号順に表示。各グラフの横軸は時間t。',style+choices());
 pack.add('q3-container-diagram',520,485,'水平な断熱容器の底と軽いピストンをばねでつなぎ、内部の単原子分子理想気体をヒーターで加熱する。初期距離Lでばねは自然長、温度T0、外側は大気圧p0。','初期状態の装置。ばねは容器の底とピストンにつながる。',style+container());
 pack.add('q4-thin-film-diagram',520,616,'屈折率nの薄膜の上に空気、下に屈折率n′のガラス。光①はA B D E F、光②はA′ E Fの順に進む。BB′は入射光に、CEはBDに垂直。厚さd、入射角i、n′>n>1。','2本の光の経路と直角条件。EからFへの光は共通の方向に進む模式図。',style+thinFilm());
 pack.add('a3-piston-diagram',520,708,'距離xまで動いたピストン。ばねの伸びはx−L。気体の力pSが右向き、大気圧の力p0Sとばねの力k(x−L)が左向きでつり合う。','自然長Lと伸びx−Lを区別し、ピストンに働く3つの力を別掲。',style+pistonForces());
 pack.add('a3-pv-diagram',520,530,'p-V平面で状態が(SL,p0)から(3SL,3p0)へ直線的に変化。仕事の領域はV=SLから3SLまでの線の下の台形で、面積4p0SL。','原点からではなく、SLから3SLまでの台形が気体の仕事。',style+pv());
 pack.add('a4-wavefront-diagram',520,1278,'上段は同時刻の波面BB′、屈折して折れたGG′、CEで、空気のB′Eと薄膜のnBCが等しい。下段はBDを延長したE′と垂線の足HによりDE=DE′、CE′=2d cos r、光路差2nd cos rを示す。','上段：等光路長。下段：反射経路の展開。図の角度と寸法は代表例。',style+wavefrontDiagram());
 return pack.save('原本17ページを意味照合し、装置の接続・9選択肢の順・薄膜のスネル則と波面直交から独自生成。原本cropのパス/画素をコピーしない。元HTMLには選択肢欠落、⓪/符号の誤転記、速度と速さの混同、半減期条件の矛盾があり、別の修復依頼と読者ゲートを維持する。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))build();
