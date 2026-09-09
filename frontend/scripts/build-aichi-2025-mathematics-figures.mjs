// Original diagrams calculated from the question's circles, plane and sphere.
// No restricted crop has been read, traced or embedded by this generator.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createFigureHandoff} from './lib/past-exam-figure-handoff.mjs';

export const geometry={
 circle:{C:[1,0],B:[2,Math.sqrt(3)],P:[23/11,12*Math.sqrt(3)/11],r:2/11},
 space:{A:[-1,0,1],B:[0,1,1],C:[0,-1,-1],P:[3,0,-1],H:[7/3,2/3,-5/3],normal:[1,-1,1],
  e1:[1/Math.sqrt(2),1/Math.sqrt(2),0],e2:[1/Math.sqrt(6),-1/Math.sqrt(6),-2/Math.sqrt(6)],radius:Math.sqrt(10),sectionRadius:Math.sqrt(26/3)}
};
const packageId='aichi-medical-2025-general-mathematics';
const esc=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const line=(a,b,extra='')=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" ${extra}/>`;
const circle=(p,r,extra='')=>`<circle cx="${p[0]}" cy="${p[1]}" r="${r}" ${extra}/>`;
const dot=p=>circle(p,3.3,'fill="#18334c" stroke="white" stroke-width="1"');
const pathPoints=pts=>pts.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(3)},${p[1].toFixed(3)}`).join(' ');
const mi=v=>`<tspan class="mi">${esc(v)}</tspan>`;
const rm=v=>`<tspan class="rm">${esc(v)}</tspan>`;
const sub=v=>`<tspan class="rm" font-size="70%" baseline-shift="sub">${esc(v)}</tspan>`;
const math=(p,parts,extra='')=>`<text x="${p[0]}" y="${p[1]}" class="math" ${extra}>${parts.join('')}</text>`;
const text=(p,value,extra='')=>`<text x="${p[0]}" y="${p[1]}" ${extra}>${esc(value)}</text>`;
const polygon=pts=>`<path d="${pathPoints(pts)} Z" fill="#f5f7fa" stroke="#aebfcb"/>`;
const sum=(a,b)=>a.map((v,i)=>v+b[i]);
const subtract=(a,b)=>a.map((v,i)=>v-b[i]);
const dot3=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);

export function buildFigures(){
 const output=new URL(`../public/assets/past-exams/${packageId}/figures/`,import.meta.url);
 fs.mkdirSync(output,{recursive:true});
 const handoff=createFigureHandoff(packageId,import.meta.url);
 const font=name=>fs.readFileSync(new URL(`../public/assets/vendor/katex/fonts/${name}.woff2`,import.meta.url)).toString('base64');
 const fonts=`@font-face{font-family:'KaTeX_Main';font-style:normal;font-weight:400;src:url(data:font/woff2;base64,${font('KaTeX_Main-Regular')}) format('woff2')}@font-face{font-family:'KaTeX_Math';font-style:italic;font-weight:400;src:url(data:font/woff2;base64,${font('KaTeX_Math-Italic')}) format('woff2')}`;
 const items=[];
 const add=(id,width,height,alt,caption,body)=>{
  const kept=handoff.keep(id);
  items.push({id,src:`/assets/past-exams/${packageId}/figures/${id}.svg`,width:kept?.width??width,height:kept?.height??height,alt,caption});
  if(kept)return;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title"><title id="title">${esc(alt)}</title><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#18334c"/></marker></defs><style>${fonts}text{font-family:'Yu Gothic','Meiryo',sans-serif;font-size:18px;fill:#18334c;stroke:none}.math{font-family:'KaTeX_Main',serif;font-size:23px}.math .mi{font-family:'KaTeX_Math',serif;font-style:italic}.math .rm{font-family:'KaTeX_Main',serif;font-style:normal}line,path,circle,ellipse{vector-effect:non-scaling-stroke}.guide{stroke:#92a5b5;stroke-dasharray:5 5;stroke-width:1.3}.accent{stroke:#b28736;stroke-width:2.3}.axis{stroke-width:1.2;stroke:#768f9f}</style><rect width="100%" height="100%" fill="white"/><g fill="none" stroke="#18334c" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;
  fs.writeFileSync(new URL(`${id}.svg`,output),svg);
 };

 // I-3: O2 touches O1 internally at A; O3 is small, with exact r=2/11.
 // Keep B and P on opposite label sides instead of enlarging O3 misleadingly.
 const xy=([x,y])=>[320+87*x,325-87*y];
 const O=xy([0,0]),A=xy([3,0]),C=xy(geometry.circle.C),B=xy(geometry.circle.B),P=xy(geometry.circle.P);
 add('a1-three-circles',760,640,
  '原点中心・半径3の円O1と、C=(1,0)を中心とする半径2の円O2がA=(3,0)で内接。O3はP=(23/11,12√3/11)を中心とする半径2/11の円で、B=(2,√3)でO2に外接しO1に内接する。C、B、Pはこの順に一直線上に並ぶ。',
  '3円の接触関係（同一縮尺。小円の半径は2/11）',
  circle(O,261)+circle(C,174)+circle(P,87*geometry.circle.r,'class="accent"')+
  line([34,325],[667,325],'class="axis" marker-end="url(#arrow)"')+line([320,602],[320,35],'class="axis" marker-end="url(#arrow)"')+
  line(C,P,'class="accent"')+[O,A,C,B,P].map(dot).join('')+
  math([681,333],[mi('x')])+math([331,39],[mi('y')])+math([299,353],[mi('O')])+
  math([605,353],[mi('A')])+math([401,355],[mi('C')])+math([531,174],[mi('P')])+
  math([448,220],[mi('B')])+line([470,204],B,'class="guide"')+
  math([104,110],[mi('O'),sub('1')])+math([511,414],[mi('O'),sub('2')])+
  math([569,123],[mi('O'),sub('3')])+line([551,133],[514,154],'class="guide"')+
  text([380,621],'小円を拡大せず、接点・中心の位置関係を保持', 'text-anchor="middle"')
 );

 // The diagram is an orthographic projection of the actual plane coordinates.
 // Unit e1 projects horizontally; unit e2 has half vertical scale (60° tilt).
 const s=geometry.space;
 const project=(point,origin,scale)=>{
  const d=subtract(point,s.H),u=dot3(d,s.e1),v=dot3(d,s.e2),w=dot3(d,s.normal)/Math.sqrt(3);
  return [origin[0]+scale*u,origin[1]-scale*(v/2+Math.sqrt(3)*w/2)];
 };
 const H0=[440,270],toScreen=p=>project(p,H0,60);
 const points={A:toScreen(s.A),B:toScreen(s.B),C:toScreen(s.C),P:toScreen(s.P),H:H0};
 add('a3-plane-foot',520,280,
  '平面α上のA=(-1,0,1)、B=(0,1,1)、C=(0,-1,-1)と球の中心P=(3,0,-1)。垂線の足H=(7/3,2/3,-5/3)は三角形ABCの外側にある。PHは平面に垂直。実座標を平面内の直交基底へ射影した図。',
  '中心Pから平面αへの垂線。Hは三角形ABCの外側',
  '<g transform="translate(-130 -160)">'+polygon([[200,390],[530,390],[530,215],[200,215]])+
  `<path d="${pathPoints([points.A,points.B,points.C])} Z" fill="#eaf0f5"/>`+
  line(points.P,H0,'class="accent"')+line(H0,[493,270],'class="guide"')+
  `<path d="M440 256 H454 V270" stroke-width="1.2"/>`+
  Object.values(points).map(dot).join('')+
  math(sum(points.A,[-21,26]),[mi('A')])+math(sum(points.B,[11,27]),[mi('B')])+
  math(sum(points.C,[-29,-4]),[mi('C')])+math(sum(points.P,[15,-9]),[mi('P')])+
  math(sum(H0,[13,28]),[mi('H')])+math([548,368],[mi('α')])+'</g>'
 );

 const H1=[360,310],P1=project(s.P,H1,70),r=s.sectionRadius;
 const q1=[H1[0]+70*r*Math.cos(-Math.PI/7),H1[1]-35*r*Math.sin(-Math.PI/7)];
 add('a3-sphere-plane-circle',720,515,
  '半径√10の球面Sを平面αで切った交円K。中心Pから平面への垂線の足HがKの中心で、PH=2/√3、交円の半径HQ=√(26/3)。PHとHQは垂直で、P、H、Qは直角三角形を作る。',
  '交円Kの半径は、直角三角形PHQに三平方の定理を適用して求める',
  circle(P1,70*s.radius,'stroke="#bdc9d2"')+
  polygon([[90,188],[622,188],[665,433],[105,433]])+
  `<ellipse cx="360" cy="310" rx="${70*r}" ry="${35*r}" fill="white"/>`+
  line(P1,H1,'class="accent"')+line(H1,q1,'class="accent"')+line(P1,q1)+
  `<path d="M360 296 L374 299.36 L374 313.36" stroke-width="1.2"/>`+
  [P1,H1,q1].map(dot).join('')+
  math(sum(P1,[14,-9]),[mi('P')])+math([340,338],[mi('H')])+math(sum(q1,[17,15]),[mi('Q')])+
  math([168,99],[mi('S')])+math([119,415],[mi('α')])+math([506,398],[mi('K')])+
  math([338,283],[rm('2/√3')],'text-anchor="end"')+
  math([461,324],[mi('r'),sub('K')])+math([465,276],[rm('√10')])
 );

 // View within alpha: two orthonormal axes, left unit circle and right circle K.
 // The radius is not confused with a coordinate in 3D; the caption identifies
 // the local e1/e2 coordinate system explicitly.
 const theta=Math.PI/5,at=(center,radius,angle)=>[center[0]+radius*Math.cos(angle),center[1]-radius*Math.sin(angle)];
 const unit=[165,235],K=[525,235],U=at(unit,90,theta),Q=at(K,135,theta);
 const localCircle=(center,radius,point)=>circle(center,radius)+
  line([center[0]-radius-18,center[1]],[center[0]+radius+30,center[1]],'class="axis" marker-end="url(#arrow)"')+
  line([center[0],center[1]+radius+18],[center[0],center[1]-radius-30],'class="axis" marker-end="url(#arrow)"')+
  line(center,point,'class="accent"')+
  `<path d="${pathPoints(Array.from({length:25},(_,i)=>at(center,31,theta*i/24)))}"/>`+
  math(sum(center,[42,-8]),[mi('θ')])+dot(center)+dot(point);
 add('a3-unit-circle-parameterization',760,450,
  '平面αを正面から見た局所座標。左は直交単位ベクトルe1、e2方向の単位円、右は中心H、半径rKの円K。同じ角θに対し、HQ=rK(e1 cosθ+e2 sinθ)。三次元のx軸・y軸ではなく平面内の2方向を示す。',
  '平面α内の正規直交基底で見る：単位円をrK倍し、中心をHへ移す',
  text([165,40],'単位円','text-anchor="middle"')+text([525,40],'平面α内の円K','text-anchor="middle"')+
  localCircle(unit,90,U)+localCircle(K,135,Q)+
  math([141,261],[rm('0')])+math([501,262],[mi('H')])+math(sum(Q,[12,-12]),[mi('Q')])+
  math([282,261],[mi('e'),sub('1')])+math([177,116],[mi('e'),sub('2')])+
  math([690,261],[mi('e'),sub('1')])+math([538,75],[mi('e'),sub('2')])+
  math([193,188],[rm('1')])+math([579,176],[mi('r'),sub('K')])+
  line([337,235],[366,235],'marker-end="url(#arrow)"')+
  text([380,420],'矢印は平面α内の基底方向（空間のx・y軸ではない）','text-anchor="middle"')
 );
 const manifest={schemaVersion:'lexus-past-exam-figures.v1',packageId,contentProvenance:'original_editorial',restrictedSourceCopied:false,
  review:{needsHumanReview:true,notes:'公開問題の条件から接円の中心・半径、平面の基底、球の切断面を独自に計算。元画像のトレースや複製なし。'},items};
 fs.writeFileSync(new URL(`../src/data/pastExamFigures/${packageId}.json`,import.meta.url),JSON.stringify(manifest,null,2)+'\n');
 handoff.report();
 return manifest;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildFigures();
