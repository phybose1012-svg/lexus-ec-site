// Independently positioned schematics. Source pages establish meaning, never SVG coordinates.
import {pathToFileURL} from 'node:url';
import {createSvgPackage,math,mi,rm,sub,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
const id='jikei-2025-general-physics';
const type='<style>text{font-size:24px}.math{font-size:32px}</style>';
const arrow=(x,y,u,v,extra='')=>line(x,y,u,v,`marker-end="url(#arrow)" ${extra}`);
const path=(d,extra='')=>`<path d="${d}" ${extra}/>`;
const variable=(x,y,v,extra='')=>math(x,y,[mi(v)],extra);
const indexed=(x,y,v,s,extra='')=>math(x,y,[mi(v),sub(s)],extra);
const power=v=>`<tspan class="mi" font-size="70%" baseline-shift="super">${v}</tspan>`;
const pvLabel=(x,y,extra='')=>math(x,y,[mi('PV'),power('γ')],extra);
export const gamma=5/3;
// Normalized endpoint illustration: V_A=1, P_A=2, V_B=2, P_B=1.
// The hypothetical I→II is NOT a quasistatic P(V) path: never integrate a drawn chord.
export const cycle={I:{v:2,p:1},II:{v:1,p:2},III:{v:1,p:2**gamma}};
export const adiabat=v=>(2/v)**gamma;
export const cart={detectorX:155,crystalX:485,accelerationSign:1,photonSign:-1};
export const recoilMomentum=(M,m,c)=>2*m*c/(1+Math.sqrt(1+2*m/(M-m)));

export function buildFigures(){
 const pack=createSvgPackage(id,import.meta.url);
 // Initial state only: the right piston is at the bottom, with no gas below it.
 let b=text(340,39,'初めの状態','text-anchor="middle"');
 b+=text(198,97,'容器A','text-anchor="middle"')+text(498,97,'容器B','text-anchor="middle"');
 b+='<rect x="132" y="231" width="132" height="153" fill="#eaf1f5" stroke="none"/>';
 for(const x of [125,425])b+=path(`M${x} 153 V394 H${x+145} V153`,'stroke-width="3"');
 b+='<rect x="132" y="219" width="132" height="12" fill="#cbd7e0"/>';
 b+='<rect x="432" y="382" width="132" height="12" fill="#cbd7e0"/>';
 b+=path('M172 219 L181 184 H215 L224 219 Z','fill="#dce6ed"')+path('M472 382 L481 347 H515 L524 382 Z','fill="#dce6ed"');
 b+=text(55,130,'おもりA')+line(137,141,182,185,'class="axis"')+text(498,293,'おもりB','text-anchor="middle"')+line(498,302,498,341,'class="axis"');
 b+=indexed(198,273,'P','A','text-anchor="middle"')+math(198,321,[mi('T'),sub('A'),rm(' , '),mi('V'),sub('A')],'text-anchor="middle"');
 b+=text(498,215,'気体なし','text-anchor="middle"')+indexed(595,358,'P','B');
 // Tube is under both pistons; a light stipple is semantic porous material, not a crop texture.
 b+=path('M192 394 V427 H503 V394 M207 394 V413 H488 V394');
 for(let x=223;x<480;x+=22)b+=dot(x,420);
 b+=arrow(294,457,389,457)+text(342,504,'多孔質体を詰めた断熱管','text-anchor="middle"');
 b+=math(340,553,[mi('P'),sub('B'),rm(' < '),mi('P'),sub('A')],'text-anchor="middle"');
 pack.add('q1-fig-insulated-cylinders',680,590,'初めは断熱容器Aだけに温度TA、圧力PA、体積VAの気体があり、容器Bは空。両底部を多孔質体入りの断熱管でつなぐ。おもりで保つPBはPAより低く、気体はAからBへ移る。寸法は模式的。','断熱容器と気体の移動（初めの状態・模式図）',b+type);

 const d=cart.detectorX,c=cart.crystalX;
 b=line(d,100,c,100,'marker-start="url(#arrow)" marker-end="url(#arrow)" class="axis"')+math((d+c)/2,78,[rm('Δ'),mi('x')],'text-anchor="middle"');
 b+=line(d,108,d,145,'class="guide"')+line(c,108,c,145,'class="guide"');
 b+='<rect x="110" y="272" width="450" height="18" fill="#dce6ed"/>';
 b+='<circle cx="182" cy="310" r="20" fill="#eef3f6"/><circle cx="486" cy="310" r="20" fill="#eef3f6"/>';
 b+=line(75,334,619,334,'class="axis"')+arrow(85,395,620,395,'class="axis"')+variable(637,404,'x');
 b+=path(`M${d-16} 272 V177 H${d+16} V272`,'fill="#eef3f6"')+path(`M${c-25} 272 L${c-16} 183 H${c+16} L${c+25} 272 Z`,'fill="#eef3f6"');
 b+=text(d,160,'検出器','text-anchor="middle"')+text(c,160,'結晶','text-anchor="middle"');
 b+=arrow(c-44,221,d+42,221)+text(320,260,'ガンマ線','text-anchor="middle"');
 b+=arrow(539,207,632,207)+variable(585,186,'a','text-anchor="middle"');
 pack.add('q2-fig-accelerating-cart',680,435,'台車はx軸正方向に加速度aで進む。結晶は右、検出器はその後方の左にあり間隔はΔx。ガンマ線は結晶からx軸負方向へ進む。力や観測エネルギーは問題で求めるため示さない。','加速する台車とガンマ線（模式図）',b+type);

 // The impossible transition is listed separately, not fabricated as a thermodynamic path.
 const X=v=>122+216*v,Y=p=>460-109*p;
 b=text(151,34,'仮定：断熱で')+pvLabel(330,34)+text(413,34,'が減少');
 b+=arrow(122,460,636,460,'class="axis"')+arrow(122,460,122,64,'class="axis"')+variable(650,470,'V')+variable(110,58,'P')+variable(97,490,'O');
 for(const [v,s]of [[1,'A'],[2,'B']])b+=line(X(v),460,X(v),Y(v===1?cycle.III.p:1),'class="guide"')+indexed(X(v),499,'V',s,'text-anchor="middle"');
 for(const [p,s,v]of [[2,'A',1],[1,'B',2]])b+=line(122,Y(p),X(v),Y(p),'class="guide"')+indexed(103,Y(p)+8,'P',s,'text-anchor="end"');
 b+=arrow(X(1),Y(2),X(1),Y(cycle.III.p));
 const curve=Array.from({length:100},(_,i)=>{const v=1+i/99;return [X(v),Y(adiabat(v))];});
 b+=path(pointsPath(curve),'class="accent"')+arrow(X(1.47),Y(adiabat(1.47)),X(1.57),Y(adiabat(1.57)));
 for(const [name,{v,p}]of Object.entries(cycle))b+=dot(X(v),Y(p))+math(X(v)+16,Y(p)+(name==='II'?9:-14),[rm(name)]);
 b+=text(460,131,'可逆断熱')+pvLabel(486,174,'text-anchor="middle"')+text(570,174,'一定');
 b+=text(182,174,'定積吸熱')+line(285,185,323,192,'class="axis"');
 b+=line(50,530,630,530,'class="axis"');
 b+=math(60,574,[rm('I → II')])+text(226,574,'仮定した断熱移動')+math(580,574,[mi('Q'),rm(' = 0')],'text-anchor="middle"');
 b+=text(226,610,'（図内には経路を描かない）');
 b+=math(60,660,[rm('II → III')])+text(226,660,'定積で吸熱')+math(580,660,[mi('Q'),rm(' > 0')],'text-anchor="middle"');
 b+=math(60,710,[rm('III → I')])+text(226,710,'可逆断熱で戻す')+math(580,710,[mi('Q'),rm(' = 0')],'text-anchor="middle"');
 pack.add('a1-fig-pv-cycle',680,755,'第二法則の反証用の仮想サイクル。IはVB,PB、IIはVA,PAで両者のPVは等しい。IからIIへP×Vのγ乗が減る断熱移動を仮定し、その経路は描かない。IIからIIIへ定積吸熱、IIIからIへP×Vのγ乗が一定の可逆断熱膨張を行う。実現できる熱機関を示す図ではない。','反証のための仮想サイクル（I→IIの経路は未指定）',b+type);

 b=text(340,43,'放出前','text-anchor="middle"')+'<circle cx="340" cy="139" r="49" fill="#edf3f6"/>';
 b+=variable(340,150,'M','text-anchor="middle"')+text(340,222,'静止（全運動量は0）','text-anchor="middle"');
 b+=line(50,257,630,257,'class="axis"')+text(340,305,'放出後','text-anchor="middle"');
 b+=arrow(249,368,105,368)+arrow(464,368,608,368)+variable(180,350,'P','text-anchor="middle"')+variable(535,350,'P','text-anchor="middle"');
 b+='<circle cx="495" cy="446" r="55" fill="#edf3f6"/>'+math(495,457,[mi('M'),rm(' − '),mi('m')],'text-anchor="middle"');
 b+=path(pointsPath(Array.from({length:100},(_,i)=>[100+i*1.6,446+12*Math.sin(i*Math.PI/12)])),'class="accent"');
 b+=text(180,521,'ガンマ線光子','text-anchor="middle"')+text(495,541,'反跳する粒子','text-anchor="middle"');
 b+=text(340,595,'運動量：逆向き・同じ大きさ','text-anchor="middle"');
 pack.add('a2-fig-gamma-recoil',680,640,'放出前は質量Mの粒子が静止。放出後はガンマ線光子が左、質量M−mの粒子が右へ進み、運動量の大きさはともにPで全運動量0を保つ。波形は光子の進行方向を示す模式表現。','ガンマ線放出と粒子の反跳（模式図）',b+type);
 return pack.save('原本の問題4ページ・解答8ページを意味照合し、問題条件と独立計算から生成。原図の画素/座標/パスは複製していない。PV図は第二法則の反証であり、実在する不可逆過程の逆再生を主張しない。問1の問3/5、問2の近似条件など元HTMLの欠落は別の修復依頼に記録。原本解答p003の定圧吸熱による別解図は元manifest自体から欠落しており別途修復待ち。人間レビューと権利承認は未完了。');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)buildFigures();
