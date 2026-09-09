// Original diagrams from the problem's physical conditions, not source crops.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,mi,rm,sub,math,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
const arrow='marker-end="url(#arrow)"',center='text-anchor="middle"';
export const doppler={observer:105,source:310,reflector:590,reflectorDirection:-1};
export const rail={theta:Math.atan2(185,230),a:[150,365],c:[350,295],b:[380,180],d:[580,110],rodFraction:.45,positiveTerminal:'a',negativeTerminal:'c'};
export const rodPoint=(start,end,t=rail.rodFraction)=>start.map((v,i)=>v+(end[i]-v)*t);
export const balance=theta=>({F:Math.tan(theta),N:1/Math.cos(theta),weight:1});
export const rebound=e=>({vx:(3+e)/2,vy:(3-e)/2});
export const beatPeriod=(V,vR,f)=>(V-vR)/(2*vR*f);
const label=(x,y,name)=>math(x,y,[mi(name)]);
const arc=(x,y,r,a,b)=>`<path d="${pointsPath(Array.from({length:31},(_,i)=>{const t=a+(b-a)*i/30;return[x+r*Math.cos(t),y+r*Math.sin(t)];}))}"/>`;

function dopplerSetup(){
 const {observer:o,source:s,reflector:r}=doppler;
 let body=text(o,52,'観測者',center)+text(s,52,'音源',center)+text(r,52,'反射板',center);
 body+=`<circle cx="${o}" cy="132" r="16" fill="#edf3f7"/>`+line(o,149,o,208)+line(o,168,o-23,183)+line(o,168,o+23,183)+line(o,208,o-21,245)+line(o,208,o+21,245);
 body+=`<rect x="${s-21}" y="156" width="30" height="55" fill="#edf3f7"/><path d="M${s+9} 158 L${s+29} 147 L${s+29} 220 L${s+9} 209 Z" fill="#dce7ee"/>`+line(s,211,s,245)+line(s-25,245,s+25,245);
 body+=`<rect x="${r-6}" y="91" width="12" height="133" fill="#dce7ee"/><rect x="${r-37}" y="224" width="74" height="10" fill="#edf3f7"/>`;
 for(const x of[r-24,r+24])body+=`<circle cx="${x}" cy="242" r="8" fill="white"/>`;
 body+=line(52,251,666,251,'class="axis"')+line(550,112,444,112,arrow)+math(491,94,[mi('v'),sub('R')],center);
 body+=text(o,290,'静止',center)+text(s,290,'静止',center)+math(s,123,[mi('f')],center);
 body+=text(360,333,'反射板は、音源と観測者の側へ近づく。',center);
 return body;
}
function railSetup(){
 const {a,b,c,d}=rail,p=rodPoint(a,b),q=rodPoint(c,d),pL=rodPoint(a,b,.8),qL=rodPoint(c,d,.8);
 let body=`<path d="${pointsPath([a,b,d,c])} Z" fill="#f4f7f9" stroke="none"/>`;
 body+=line(...a,...b,'stroke-width="3"')+line(...c,...d,'stroke-width="3"');
 body+=line(...p,...q,'stroke-width="8" stroke="#aac0cf"')+line(...p,...q);
 for(const [name,pt,xy]of[['a',a,[126,375]],['b',b,[358,171]],['c',c,[367,307]],['d',d,[590,101]],['p',p,[216,270]],['q',q,[475,214]]])body+=dot(...pt)+label(...xy,name);
 body+=line(...a,110,450)+line(310,380,...c);
 // A serial ac branch. The battery's long (+) plate is toward a, so the
 // rod current p->q gives a horizontal uphill magnetic force in upward B.
 const len=Math.hypot(200,70),angle=Math.atan2(-70,200)*180/Math.PI;
 body+=`<g transform="translate(110 450) rotate(${angle})">`+line(0,0,30,0)+`<rect x="30" y="-9" width="48" height="18" fill="white"/>`+line(78,0,124,0)+line(124,-19,124,19,'stroke-width="2.5"')+line(135,-10,135,10,'stroke-width="2.5"')+line(135,0,len,0)+math(54,-23,[mi('R')],center)+math(130,46,[mi('E')],center)+math(105,-25,[rm('+')])+math(143,-15,[rm('−')])+'</g>';
 body+=line(...pL,...qL,'class="axis"')+line(pL[0]-3,pL[1]-8,pL[0]+3,pL[1]+8)+line(qL[0]-3,qL[1]-8,qL[0]+3,qL[1]+8)+math((pL[0]+qL[0])/2,(pL[1]+qL[1])/2-17,[mi('L')],center);
 body+=math(333,292,[mi('m')],center)+line(615,286,615,175,arrow)+math(637,229,[mi('B')]);
 body+=line(...a,270,365,'class="guide"')+arc(...a,53,0,-rail.theta)+math(216,350,[mi('θ')]);
 body+=text(347,35,'傾いたレールと導体棒（接続の模式図）',center);
 body+=text(347,509,'磁場は鉛直上向き。電池と抵抗は a–c 側に直列接続。',center);
 return body;
}
function inclineSetup(){
 const o=[240,135];
 let body=`<path d="M60 135 H240 L550 445 L60 445 Z" fill="#f1f5f7" stroke="none"/>`;
 body+=line(60,135,...o,'stroke-width="2.7"')+line(...o,550,445,'stroke-width="2.7"');
 for(let x=65;x<220;x+=23)body+=line(x,136,x-13,149,'class="axis"');
 body+=line(...o,600,135,`class="axis" ${arrow}`)+line(...o,240,451,`class="axis" ${arrow}`);
 body+=math(615,144,[mi('x')])+math(249,472,[mi('y')])+math(218,114,[rm('O')]);
 body+=`<circle cx="107" cy="123" r="11" fill="#dce7ee"/>`+line(101,87,182,87,arrow)+math(139,69,[mi('v'),sub('0')],center);
 body+=arc(...o,58,0,Math.PI/4)+math(313,174,[rm('45°')]);
 body+=text(520,363,'斜面',center)+line(500,372,490,384,'class="guide"');
 body+=line(584,292,584,358,arrow)+math(603,335,[mi('g')]);
 body+=text(350,510,'x 軸は右向き、y 軸は下向きが正。',center);
 return body;
}
function forceBalance(){
 const theta=Math.PI/6,{F,N}=balance(theta),o=[310,252],scale=125;
 let body=line(96,376,566,105,'stroke-width="2.4"')+line(96,376,268,376,'class="guide"')+arc(96,376,52,0,-theta)+math(161,363,[mi('θ')]);
 // Forces are drawn to a common scale at equilibrium: N+F+mg=0.
 body+=line(...o,o[0]+scale*F,o[1],`stroke="#326e94" ${arrow}`)+math(425,259,[mi('I'),sub('0'),mi('B'),mi('L')]);
 body+=line(...o,o[0],o[1]+scale,arrow)+math(325,382,[mi('m'),mi('g')]);
 body+=line(...o,o[0]-scale*N*Math.sin(theta),o[1]-scale*N*Math.cos(theta),arrow)+math(218,111,[mi('N')]);
 body+=`<circle cx="${o[0]}" cy="${o[1]}" r="7" fill="white"/>`;
 body+=line(586,225,586,122,'class="guide" marker-end="url(#arrow)"')+math(608,178,[mi('B')]);
 body+=text(350,38,'導体棒を横から見た力のつり合い',center);
 body+=text(350,450,'N：レールから受ける垂直抗力',center);
 body+=text(350,484,'磁力は水平。レール方向の成分でつり合いを考える。',center);
 return body;
}
export function buildFigures(){
 const pack=createSvgPackage('fukuoka-2025-general-keitobetsu-physics',import.meta.url);
 pack.add('q1-doppler-setup',720,360,'左から静止した観測者、振動数fの静止音源、移動する反射板が一直線に並ぶ。板は直線に垂直で、速さv_Rで左へ近づく。','〔Ⅰ〕(ii)：観測者と音源は静止し、反射板だけが近づく。',dopplerSetup());
 pack.add('q2-inclined-rail-circuit',700,540,'間隔Lの傾斜レールabとcdに質量mの水平な棒pqを渡す。下端a–c側に抵抗Rと電池を直列接続し、電池の正極はa側。磁場Bは鉛直上向き。図は静止条件と整合する接続の模式図。','〔Ⅱ〕：レールは水平面と角θをなす。電池の起電力は(i)でE、(ii)でE₁。',railSetup());
 pack.add('q3-incline-45-setup',700,540,'水平な床の右端Oから右下へ45度の斜面が続く。小球を右向き初速度v₀で打ち出す。x軸は右向き、y軸は下向き、重力gも下向き。衝突点や解答の軌道は描かれていない。','〔Ⅲ〕：小球がOを通過した時刻をt=0とする。',inclineSetup());
 pack.add('ans2-force-balance',700,510,'斜面上の導体棒の側面図。磁力I₀BLは水平方向の上り坂側、重力mgは下向き、垂直抗力Nは斜面に垂直な外向き。磁場Bの矢印は力とは分けて示す。','〔Ⅱ〕(3)：レール方向でmg sinθ=I₀BL cosθ。角θ=30度の配置例。',forceBalance());
 return pack.save('公開問題の配置と静止条件から独自作図。電池の正極a側は上向き磁場と静止条件に基づく。解説の周期式・速度の大きさの不整合は修正依頼と読者向けゲートに分離。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildFigures();
