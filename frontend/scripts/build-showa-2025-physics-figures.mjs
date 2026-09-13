import {pathToFileURL} from 'node:url';
import {createSvgPackage,mi,rm,sub,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='showa-medical-2025-general-i-physics';
const arrow='marker-end="url(#arrow)"',dim='marker-start="url(#arrow)" marker-end="url(#arrow)"';
const path=(p,e='')=>`<path d="${pointsPath(p)}" ${e}/>`;
const label=(x,y,s)=>math(x,y,[mi(s)]);
const named=(p,s,dx=10,dy=-12)=>dot(...p)+label(p[0]+dx,p[1]+dy,s);
const circle=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}"/>`;
const arc=(x,y,r,a,b)=>Array.from({length:50},(_,i)=>{const t=a+(b-a)*i/49;return[x+r*Math.cos(t),y-r*Math.sin(t)];});
const fraction=(x,y,num,den,w=70)=>math(x,y-10,num,'text-anchor="middle"')+line(x-w/2,y,x+w/2,y)+math(x,y+29,den,'text-anchor="middle"');
export const sourcePoint=u=>[Math.cos(u),Math.sin(u)];
export const distance=u=>Math.sqrt(5-4*Math.cos(u));
export const recession=u=>2*Math.sin(u)/distance(u);
export const frequency=(u,beta=.35)=>1/(1+beta*recession(u));
export const springState={separationTime:Math.PI/Math.sqrt(2),speed:1/Math.sqrt(2),collisionTime:Math.PI/2,amplitude:1/Math.sqrt(2),wall:(2+Math.PI)/(4*Math.sqrt(2))};
export const film={i:Math.PI/4,n1:1.5,n2:1.2,d:110};
film.r=Math.asin(Math.sin(film.i)/film.n1);
export function filmGeometry(){
 const A=[265,245],Q=[A[0]+2*film.d*Math.tan(film.r),A[1]],B=[(A[0]+Q[0])/2,A[1]+film.d];
 const v=[Math.sin(film.i),Math.cos(film.i)],s=(Q[0]-A[0])*v[0];
 return {A,Q,B,A2:[Q[0]-s*v[0],Q[1]-s*v[1]],v};
}
export function draw(){
 const pack=createSvgPackage(packageId,import.meta.url);
 const O=[245,240],r=145,P=[535,240],map=p=>[O[0]+r*p[0],O[1]-r*p[1]];
 const A=map([1,0]),B=map(sourcePoint(5*Math.PI/3)),C=map(sourcePoint(Math.PI/3)),D=map([-1,0]);
 const base=()=>circle(...O,r)+line(...O,...P,'class="guide"')+named(O,'O',-29,20)+named(A,'A',12,24)+named(P,'P',13,8);
 {
  const S=map(sourcePoint(.8));let b=base()+line(...O,...S,'class="guide"')+named(S,'S',12,-10)+path(arc(...O,r,.87,1.35),arrow);
  b+=label(370,95,'ω')+label(282,178,'r')+label(306,268,'r')+label(459,268,'r');
  pack.add('q1-circular-source-layout',660,430,'中心O、半径rの円を音源Sが反時計回りに回る。Oから距離2rにPがあり、AはOP上の円周点。','音源と観測点の配置（B・Cの位置は問題で求める）',b);
 }
 {
  let b=line(105,325,640,325,arrow)+line(105,325,105,65,arrow)+line(105,195,615,195,'class="guide"')+math(24,205,[mi('f'),sub('0')])+math(48,40,[mi('f'),rm('('),mi('t'),rm(') [Hz]')])+math(635,365,[mi('t'),rm(' [s]')]);
  pack.add('q1-frequency-graph-answer-field',740,390,'振動数f(t)を記入する空欄。縦軸は振動数、横軸は発音時刻t、f0の水平基準線だけを示す。','グラフ記入欄',b);
 }
 {
  let b=base()+named(D,'D',-30,8)+named(B,'B',-8,30)+named(C,'C',-10,-17);
  for(const [p,u]of [[B,5*Math.PI/3],[C,Math.PI/3]]){
   b+=line(...O,...p,'class="guide"')+line(...p,...P,'class="guide"');
   const v=[-Math.sin(u),-Math.cos(u)];b+=line(p[0],p[1],p[0]+v[0]*80,p[1]+v[1]*80,arrow);
   const inward=[-Math.cos(u),Math.sin(u)],toward=[(P[0]-p[0])/(r*Math.sqrt(3)),(P[1]-p[1])/(r*Math.sqrt(3))];
   b+=path([[p[0]+inward[0]*14,p[1]+inward[1]*14],[p[0]+(inward[0]+toward[0])*14,p[1]+(inward[1]+toward[1])*14],[p[0]+toward[0]*14,p[1]+toward[1]*14]]);
  }
  b+=label(398,345,'rω')+label(220,57,'rω')+label(260,335,'r')+path(arc(...O,45,-Math.PI/3,0),'class="accent"')+fraction(317,285,[mi('π')],[rm('3')],28)+text(410,402,'B：近づく ／ C：遠ざかる');
  pack.add('ans-q1-tangent-geometry',690,450,'Pから円への接点B・C。OBとBP、OCとCPが直交する。反時計回りの速度はBでPへ向かい、CでPから離れる。','接線方向と観測点方向が一致する2点',b);
 }
 {
  const origin=[120,360],scale=230,u=.55,sv=sourcePoint(u),pv=[2,0],dv=[pv[0]-sv[0],-sv[1]],dd=dv[0]**2+dv[1]**2;
  const coeff=-(sv[0]*dv[0]+sv[1]*dv[1])/dd,h=[sv[0]+coeff*dv[0],sv[1]+coeff*dv[1]],m=p=>[origin[0]+scale*p[0],origin[1]-scale*p[1]],S=m(sv),H=m(h),HP=m([sv[0],0]),PP=m(pv);
  let b=path(arc(...origin,scale,0,1.25),'class="guide"')+line(...origin,...PP,'class="guide"')+line(...origin,...S)+line(...H,...PP)+line(...origin,...H,'class="guide"')+line(...S,...HP,'class="guide"');
  b+=named(origin,'O',-27,20)+named(PP,'P',15,8)+named(S,'S',15,-5)+named(H,'H',-22,-15)+named(HP,'H′',-10,32);
  b+=line(...S,S[0]-55*Math.sin(u),S[1]-55*Math.cos(u),arrow)+label(S[0]-16,S[1]-70,'rω')+label(437,287,'x');
  b+=path(arc(...origin,65,0,u),'class="accent"')+label(195,345,'ωt');
  const theta=Math.atan2(sv[1],2-sv[0]);b+=path(arc(...PP,65,Math.PI-theta,Math.PI),'class="accent"')+label(489,345,'θ');
  const hx=H[0],hy=H[1],e1=[-h[0]/Math.hypot(...h),h[1]/Math.hypot(...h)],e2=[dv[0]/Math.sqrt(dd),-dv[1]/Math.sqrt(dd)];
  b+=path([[hx+14*e1[0],hy+14*e1[1]],[hx+14*(e1[0]+e2[0]),hy+14*(e1[1]+e2[1])],[hx+14*e2[0],hy+14*e2[1]]])+path([[HP[0]-12,HP[1]],[HP[0]-12,HP[1]-12],[HP[0],HP[1]-12]]);
  b+=text(38,435,'H：Oから直線PSへの垂線の足　 H′：SからOPへの垂線の足');
  pack.add('ans-q1-projection-geometry',710,470,'OSの長さr、OPの長さ2r、PSの長さx。角SOPはωt、角SPOはθ。HとH′はそれぞれOからPS、SからOPへの垂線の足。','距離と視線方向の速度を求める補助図',b);
 }
 {
  const beta=.35,x=u=>200+520*u/(2*Math.PI),y=f=>335-260*(f-1),y0=y(1);let b=line(200,410,200,82,arrow)+line(200,y0,758,y0,arrow)+math(38,55,[mi('f'),rm('('),mi('t'),rm(') [Hz]')])+math(745,320,[mi('t'),rm(' [s]')]);
  b+=path(Array.from({length:361},(_,i)=>{const u=2*Math.PI*i/360;return[x(u),y(frequency(u,beta))];}),'stroke-width="2.8"');
  for(const[u,den,mult]of [[Math.PI/3,'3ω','π'],[Math.PI,'ω','π'],[5*Math.PI/3,'3ω','5π'],[2*Math.PI,'ω','2π']]){
   const yy=y(frequency(u,beta));b+=line(x(u),y0,x(u),yy,'class="guide"')+fraction(x(u),443,[rm(mult.replace('π','')),mi('π')],[rm(den.replace('ω','')),mi('ω')],42);
  }
  for(const [u,sign]of [[Math.PI/3,'+'],[5*Math.PI/3,'−']]){const yy=y(frequency(u,beta));b+=line(200,yy,x(u),yy,'class="guide"')+fraction(90,yy-6,[mi('V')],[mi('V'),rm(sign),mi('rω')],112)+math(151,yy+5,[mi('f'),sub('0')]);}
  b+=math(153,y0+6,[mi('f'),sub('0')])+text(200,523,'横軸は発音時刻。到達時刻のグラフではありません。');
  pack.add('ans-q1-frequency-graph',830,565,'発音時刻tで表すf(t)。π/(3ω)で最小、π/ωでf0、5π/(3ω)で最大、2π/ωでf0。曲線はrω/V=0.35を例示し、極値と時刻は一般式。','観測振動数と発音時刻（亜音速の場合）',b);
 }
 {
  let b=line(65,220,680,220)+line(65,155,65,220)+line(680,115,680,220);
  for(let y=120;y<220;y+=12)b+=line(680,y,695,y-12);
  const pts=[[65,195],[95,195]];for(let i=0;i<=100;i++)pts.push([95+180*i/100,195+13*Math.sin(16*Math.PI*i/100)]);pts.push([310,195]);b+=path(pts)+circle(335,195,25)+math(321,204,[mi('m')])+label(325,150,'A')+label(180,162,'k')+line(65,255,713,255,arrow)+line(335,248,335,262)+math(328,290,[rm('0')])+label(710,285,'x')+text(140,340,'ばねは自然長。物体Bを接触させる前の状態。');
  pack.add('q2-spring-masses-layout',760,380,'左端固定の自然長ばねkの右端に質量mのAがある。Aの位置をx=0とし、右向きが正。右側には壁がある。','ばねと物体Aの初期配置（模式図）',b);
 }
 {
  let b=line(75,130,150,130)+`<rect x="150" y="114" width="90" height="32"/>`+line(240,130,305,130);
  b+='<path d="M305 130 q12 -32 24 0 q12 -32 24 0 q12 -32 24 0 q12 -32 24 0"/>'+line(401,130,480,130)+line(480,100,480,160)+line(497,100,497,160)+line(497,130,625,130)+line(625,130,625,335)+line(625,335,383,335)+circle(350,335,33)+path(Array.from({length:50},(_,i)=>[328+i*.9,335-9*Math.sin(2*Math.PI*i/49)]))+line(317,335,75,335)+line(75,335,75,130);
  for(const[x,s]of [[100,'a'],[275,'b'],[440,'c'],[560,'d']])b+=named([x,130],s,-7,-22);
  b+=label(185,85,'R')+label(340,85,'L')+label(479,70,'C')+label(338,403,'E')+line(135,186,233,186,arrow)+text(148,214,'電流の正方向');
  pack.add('q3-rlc-series-circuit',710,440,'aとbの間に抵抗R、bとcの間にコイルL、cとdの間にコンデンサーC。dから交流電源Eを経てaへ戻る直列回路。','図1　端子順と素子の対応',b);
 }
 {
  const x=t=>120+t*450,y=v=>240-v*105;let b=line(120,395,120,60,arrow)+line(120,240,692,240,arrow)+text(34,47,'電圧')+label(692,268,'t');
  b+=path(Array.from({length:250},(_,i)=>{const t=1.15*i/249;return[x(t),y(Math.sin(2*Math.PI*t))];}),'stroke-width="2.6"');
  for(const v of [-1,1])b+=line(120,y(v),x(v===1?1.25:.75),y(v),'class="guide"')+math(v===1?65:49,y(v)+6,[rm(v===1?'':'−'),mi('V'),sub('0')]);
  b+=math(87,263,[rm('0')])+fraction(x(.5),282,[mi('T')],[rm('2')],27)+label(x(1)-8,276,'T');
  pack.add('q3-ab-voltage-graph',750,430,'ab間の電圧は時刻0に0から増加する正弦波。周期T、最大値V0、最小値−V0で、T/2とTでも0になる。','図2　抵抗両端の電圧',b);
 }
 {
  let b=text(35,180,'空気')+math(112,182,[rm('1')])+`<rect x="30" y="235" width="620" height="120" fill="#eef3f7"/><rect x="30" y="355" width="620" height="70" fill="#d9e4ec"/>`+text(50,290,'薄膜')+math(110,292,[mi('n'),sub('1')])+text(50,396,'ガラス板')+math(154,398,[mi('n'),sub('2')]);
  b+=line(290,100,290,355)+line(290,120,290,178,arrow)+`<path d="M290 235 L320 235 L320 96"/>`+line(320,180,320,127,arrow)+`<path d="M290 355 L360 355 L360 96"/>`+line(360,183,360,127,arrow)+text(266,68,'入射光')+label(317,95,'A')+label(358,95,'B')+line(554,241,554,348,dim)+label(569,303,'d')+text(49,469,'光路を横にずらして表示。実際の入射・反射は垂直。');
  pack.add('q4-normal-incidence-film',710,505,'空気、薄膜n1、ガラスn2の順に並ぶ。n1はn2より大きい。垂直入射光Aは上面、Bは下面で反射。膜厚d。横ずれは光路を区別するための模式表示。','図1　垂直入射の2つの反射光',b);
 }
 {
  const {A,Q,B,A2,v}=filmGeometry();let b=`<rect x="40" y="245" width="655" height="110" fill="#eef3f7"/><rect x="40" y="355" width="655" height="75" fill="#d9e4ec"/>`+text(55,215,'空気')+math(118,217,[rm('1')])+text(55,308,'薄膜')+math(118,310,[mi('n'),sub('1')])+text(55,402,'ガラス板')+math(160,404,[mi('n'),sub('2')]);
  for(const [p,s]of [[A,'C'],[Q,'D']]){const start=[p[0]-145*v[0],p[1]-145*v[1]];b+=line(...start,...p)+line(start[0]+20*v[0],start[1]+20*v[1],start[0]+65*v[0],start[1]+65*v[1],arrow)+label(start[0]-16,start[1]-15,s)+line(p[0],p[1]-105,p[0],p[1]+55,'class="guide"')+path(arc(...p,45,Math.PI/2,Math.PI/2+film.i),'class="accent"')+label(p[0]-24,p[1]-55,'i');}
  b+=line(...A,...B)+line(...B,...Q)+line((A[0]+B[0])/2,(A[1]+B[1])/2,...B,arrow)+line((B[0]+Q[0])/2,(B[1]+Q[1])/2,...Q,arrow)+line(...Q,Q[0]+150*v[0],Q[1]-150*v[1],arrow);
  b+=line(...A,...A2,'class="guide"')+dot(...A)+math(A[0]-40,A[1]+28,[mi('A'),sub('1')])+dot(...A2)+math(A2[0]+22,A2[1]-27,[mi('A'),sub('2')]);
  b+=path(arc(...A,45,-Math.PI/2,-Math.PI/2+film.r),'class="accent"')+label(A[0]+13,A[1]+66,'r')+line(623,251,623,349,dim)+label(641,308,'d')+text(49,479,'A₁・A₂は同一波面上。角度と膜厚は一般条件の模式例。');
  pack.add('q4-oblique-incidence-film',760,515,'CはA1から薄膜内へ屈折し下面で反射、Dは上面で反射してCと同じ方向へ出る。A1とA2を結ぶ線は入射光線に垂直な同一波面。入射角i、屈折角r。','図2　斜入射の光路（問7の数値条件は確認待ち）',b);
 }
 {
  const O=[200,300],R=260,L=180,C=90;let b=line(...O,520,300,arrow)+text(546,307,'電流の位相')+line(...O,O[0]+R,O[1],arrow)+math(470,330,[mi('V'),sub('0')])+line(...O,200,300-L,arrow)+math(78,113,[mi('ωLI'),sub('0')])+line(...O,200,300+C,arrow)+fraction(107,369,[mi('I'),sub('0')],[mi('ωC')],70);
  b+=line(...O,460,210,'marker-end="url(#arrow)" class="accent"')+math(474,205,[mi('V'),sub('3')])+line(460,300,460,210,'class="guide"')+line(200,210,460,210,'class="guide"')+dot(...O)+text(47,461,'上：コイル電圧　 下：コンデンサー電圧')+text(47,491,'右：抵抗電圧と電流（長さは別尺度）');
  b+=text(350,75,'誘導性の場合の模式例');
  pack.add('ans-q3-voltage-phasor',770,535,'電流を右向き基準とし、抵抗電圧V0は同相、コイル電圧ωLI0は上、コンデンサー電圧I0/(ωC)は下。差の縦成分とV0の合成が電源電圧V3。','電圧の位相とベクトル合成（問6）',b);
 }
 return pack.save('問題条件と独立計算から作図。restricted crop転用なし。発音時刻と到達時刻を区別し、問題図へ未解答の極値位置を入れない。薄膜問7の実現不能条件は元データ修復待ち。');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)draw();
