import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,math,mi,rm,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='kurume-2025-general-early-mathematics';
const mid='text-anchor="middle"',sqrt2=Math.SQRT2;
const label=(x,y,s)=>math(x,y,[mi(s)]);
const polygon=(pts,fill='#edf3f6',extra='')=>`<path d="${pointsPath(pts)} Z" fill="${fill}" ${extra}/>`;
const M=s=>`\\(${s}\\)`;
export const f=x=>4*x**3+9*x*x+6*x+3;
export const g=x=>3*x**4-8*x**3+12*x;
export const gp=x=>12*x**3-24*x*x+12;
export const remainder=x=>-4*x*x+9*x+2;
export const crossSection=r=>4*(10*(1+sqrt2)*r-(2+2*sqrt2-Math.PI)*r*r);
export const volume=(76/3+20*sqrt2)*Math.PI-32/3*(1+sqrt2);
export const vertices={O:[0,0,0],A:[1,0,0],B:[.5,Math.sqrt(3)/2,0],C:[.5,Math.sqrt(3)/6,Math.sqrt(2/3)]};
export const add=(a,b)=>a.map((x,i)=>x+b[i]);
export const mul=(a,s)=>a.map(x=>x*s);
export const sub=(a,b)=>add(a,mul(b,-1));
export const dot3=(a,b)=>a.reduce((sum,x,i)=>sum+x*b[i],0);
export const H=add(add(mul(vertices.A,-.1),mul(vertices.B,.1)),mul(vertices.C,.3));
export const R=mul(sub(vertices.B,vertices.A),1/7);
// Disjoint pieces derived from the union of four radius-r capsules.
// 1: two trapezia; 2: horizontal rectangle; 3: two vertical rectangles;
// 4: four diagonal rectangles; 5: eight outward semicircles.
export function sectionPieces(r){
  const d=(1+sqrt2)*r,polygons=[];
  polygons.push({kind:2,pts:[[-5,-r],[5,-r],[5,r],[-5,r]]});
  for(const sy of [-1,1]){
    polygons.push({kind:1,pts:[[-d,r],[d,r],[r,d],[-r,d]].map(([x,y])=>[x,sy*y])});
    polygons.push({kind:3,pts:[[-r,d],[r,d],[r,5],[-r,5]].map(([x,y])=>[x,sy*y])});
  }
  for(const sx of [-1,1])for(const sy of [-1,1]){
    const uv=(u,v)=>[sx*(u-v)/sqrt2,sy*(u+v)/sqrt2];
    polygons.push({kind:4,pts:[uv(d,-r),uv(5*sqrt2,-r),uv(5*sqrt2,r),uv(d,r)]});
  }
  const caps=[];
  for(let i=0;i<8;i++){
    const theta=i*Math.PI/4,len=i%2?5*sqrt2:5,center=[len*Math.cos(theta),len*Math.sin(theta)];
    const pts=Array.from({length:65},(_,k)=>{const a=theta-Math.PI/2+Math.PI*k/64;return [center[0]+r*Math.cos(a),center[1]+r*Math.sin(a)];});
    caps.push({kind:5,pts,center,theta});
  }
  return {polygons,caps};
}
export function operationCount(n,c){let steps=0;while(n>1){n=n%c===0?n/c:n+c-n%c;if(++steps>200)throw Error('Nonterminating input');}return steps;}
export function answerSupplement(){
  const major='major-question-03';
  return {schemaVersion:'lexus-answer-supplement.v1',packageId,sourceSha256:'d9629d8ce2735e4225c615eec23a69dbf9d618a3da0763e8dfad7985c31536c5',contentProvenance:'original_editorial',restrictedSourceCopied:false,review:{needsHumanReview:true,notes:'導関数の因数と各停留点への代入から独立に作成した増減表2件。学習者版で欠落した表を補う。元の途中式と権利・人間レビューは修復待ち。'},operations:[
    {type:'insert-after',expectedMatches:1,anchor:{major_question_id:major,type:'formula',latex:"f'(x)=6(x+1)(2x+1)"},blocks:[
      {type:'prose',major_question_id:major,text:'導関数の符号は次のように変わります。極大・極小を確認してから、2点を通る直線を求めます。'},
      {type:'table',major_question_id:major,caption:'3次関数の増減表',headers:[M('x'),'…',M('-1'),'…',M('-\\dfrac12'),'…'],rows:[[M("f'(x)"),M('+'),M('0'),M('-'),M('0'),M('+')],[M('f(x)'),'↗',M('2'),'↘',M('\\dfrac74'),'↗']]},
    ]},
    {type:'insert-after',expectedMatches:1,anchor:{major_question_id:major,type:'formula',latex:"g'(x)=12(x-1)(x^2-x-1)"},blocks:[
      {type:'table',major_question_id:major,caption:'4次関数の増減表',headers:[M('x'),'…',M('\\dfrac{1-\\sqrt5}{2}'),'…',M('1'),'…',M('\\dfrac{1+\\sqrt5}{2}'),'…'],rows:[[M("g'(x)"),M('-'),M('0'),M('+'),M('0'),M('-'),M('0'),M('+')],[M('g(x)'),'↘','極小','↗',M('7'),'↘','極小','↗']]},
    ]},
  ]};
}
function planeAPQ(){
  let s=polygon([[150,290],[550,290],[630,125],[230,125]]);
  s+=line(275,385,275,70,'marker-end="url(#arrow)" data-line="OD"');
  s+=line(560,205,350,255,'marker-end="url(#arrow)"')+line(560,205,355,160,'marker-end="url(#arrow)"');
  s+=line(275,215,325,215,'class="guide"')+`<path d="M275 201 H289 V215" data-right-angle="OH-plane"/>`;
  for(const [x,y] of [[275,385],[275,215],[560,205],[350,255],[355,160]])s+=dot(x,y);
  s+=label(254,418,'O')+label(253,59,'D')+label(241,222,'H')+label(548,185,'A')+label(328,275,'P')+label(333,152,'Q');
  s+=text(407,97,'平面 APQ',mid)+text(360,453,'OH は平面 APQ に垂直',mid);
  return s;
}
function planeOAB(){
  const O=[275,410],A=[580,370],B=[345,370],R2=[O[0]+(B[0]-A[0])/7,O[1]],C=[235,65],H2=add(mul(R2,.7),mul(C,.3));
  let s=polygon([[140,470],[595,470],[650,340],[195,340]]);
  s+=line(...C,...R2,'data-line="CHR"')+line(...O,...A)+line(...O,...B)+line(...A,...B,'class="accent"')+line(...O,...R2,'class="accent"');
  for(const p of [O,A,B,R2,C,H2])s+=dot(...p);
  s+=label(O[0]+1,O[1]+28,'O')+label(A[0]+12,A[1]+6,'A')+label(B[0]-10,320,'B')+line(B[0],329,B[0],360,'class="guide"')+label(R2[0]-26,R2[1]+8,'R')+label(C[0]-6,C[1]-16,'C')+label(H2[0]-30,H2[1]+2,'H');
  s+=text(428,320,'平面 OAB',mid)+text(390,522,'C・H・R は一直線上 ／ OR と AB は平行',mid);
  return s;
}
function tetrahedron(){
  const O=[150,390],A=[580,390],B=[550,190],C=[320,70],P=mul(add(O,B),.5),Q=add(O,mul(sub(C,O),1/3));
  let s='';for(const [a,b] of [[O,A],[A,B],[B,C],[C,O],[A,C]])s+=line(...a,...b);
  s+=line(...O,...B,'class="guide"')+line(...A,...P,'class="accent" marker-end="url(#arrow)"')+line(...A,...Q,'class="accent" marker-end="url(#arrow)"');
  for(const p of [O,A,B,C,P,Q])s+=dot(...p);
  s+=label(124,417,'O')+label(584,419,'A')+label(565,190,'B')+label(310,53,'C')+label(P[0]-7,P[1]-19,'P')+label(Q[0]-30,Q[1]+4,'Q');
  s+=math(375,463,[rm('OP = PB')],mid)+math(375,503,[rm('OQ : QC = 1 : 2')],mid);
  return s;
}
function division(){
  let s=math(25,126,[rm('12'),mi('x'),rm('³ − 24'),mi('x'),rm('² + 12')]);
  s+=`<path d="M292 102 Q307 120 292 143 M292 102 H756"/>`;
  s+=math(425,66,[mi('x'),rm('/4 − 1/6')],mid);
  const cols=[342,438,535,629,720],rows=[[3,-8,0,12,0],[3,-6,0,3,0],[null,-2,0,9,0],[null,-2,4,0,-2],[null,null,-4,9,2]],ys=[137,193,265,321,395];
  rows.forEach((row,i)=>row.forEach((v,j)=>{if(v===null)return;const first=row.findIndex(x=>x!==null)===j;const exponent=4-j;const parts=[rm(`${v<0?'−':first?'':'+ '}${Math.abs(v)}`)];if(exponent)parts.push(mi('x'),rm(['','','²','³','⁴'][exponent]));s+=math(cols[j],ys[i],parts,mid);}));
  s+=math(280,193,[rm('−')])+math(311,193,[rm('(')])+math(767,193,[rm(')')]);
  s+=math(361,321,[rm('−')])+math(394,321,[rm('(')])+math(767,321,[rm(')')]);
  s+=line(315,215,756,215)+line(407,343,756,343);
  s+=text(400,451,'同じ次数を縦にそろえ、掛けた式を引く',mid);
  return s;
}
function sphere(){
  const O=[300,300],rad=175,t=.6,F=[300,300-rad*t],T=[300+rad*Math.sqrt(1-t*t),F[1]];
  let s=`<circle cx="${O[0]}" cy="${O[1]}" r="${rad}"/>`;
  s+=line(70,300,550,300,'class="axis" marker-end="url(#arrow)"')+line(300,510,300,65,'class="axis" marker-end="url(#arrow)"');
  s+=polygon([O,F,T],'#e5edf4','stroke="none"')+line(75,F[1],555,F[1],'class="accent"')+line(...O,...T)+line(...O,...F,'class="guide"');
  s+=`<path d="M300 ${F[1]+14} H314 V${F[1]}"/>`+dot(...O)+dot(...T);
  s+=label(564,307,'x')+label(309,58,'z')+label(274,327,'O');
  s+=math(270,255,[rm('|'),mi('t'),rm('|')],'text-anchor="end"')+math(390,270,[rm('1')]);
  s+=math(353,178,[mi('r')])+math(84,178,[mi('z'),rm(' = '),mi('t')]);
  s+=math(340,557,[mi('r'),rm(' = √(1 − '),mi('t'),rm('²)')],mid)+text(340,595,'球の中心を通る鉛直断面（t > 0 の例）',mid);
  return s;
}
const colors={1:'#eadbb9',2:'#e8f0f6',3:'#d9e9e5',4:'#dfe1ef',5:'#f4eee1'};
function badge(x,y,n){return `<circle cx="${x}" cy="${y}" r="14" fill="white"/>`+math(x,y+8,[rm(String(n))],mid);}
function section(){
  const r=.75,pts=sectionPieces(r),P=([x,y])=>[375+x*43,325-y*43];let s='';
  for(const p of [...pts.polygons,...pts.caps])s+=polygon(p.pts.map(P),colors[p.kind],`data-region="${p.kind}"`);
  s+=line(80,325,675,325,'class="axis" marker-end="url(#arrow)"')+line(375,595,375,47,'class="axis" marker-end="url(#arrow)"');
  s+=label(684,334,'x')+label(384,42,'y')+label(348,354,'O');
  s+=badge(...P([0,1.28]),1)+badge(...P([3.7,0]),2)+badge(...P([0,3.55]),3)+badge(...P([3.55,3.55]),4)+badge(...P([5.38,0]),5);
  s+=math(375,631,[mi('r'),rm(' = √(1 − '),mi('t'),rm('²)')],mid);
  s+=text(375,669,'① 台形 ×2　② 長方形 ×1　③ 長方形 ×2',mid)+text(375,700,'④ 長方形 ×4　⑤ 半円 ×8',mid);
  return s;
}
function zoom(){
  const r=.75,d=(1+sqrt2)*r,P=([x,y])=>[90+x*61,460-y*61],pieces=sectionPieces(r);let s='';
  // A true magnified extract of the same disjoint geometry, not a new shape.
  s+='<defs><clipPath id="zoom-window"><rect x="35" y="88" width="448" height="425"/></clipPath></defs><g clip-path="url(#zoom-window)">';
  for(const piece of [...pieces.polygons,...pieces.caps])s+=polygon(piece.pts.map(P),colors[piece.kind]);
  s+='</g>';
  s+=line(48,460,483,460,'class="axis" marker-end="url(#arrow)"')+line(90,498,90,79,'class="axis" marker-end="url(#arrow)"');
  s+=label(489,468,'x')+label(100,73,'y')+label(62,489,'O');
  s+=line(...P([5,-.8]),...P([5,-1.2]),'class="guide"')+math(...P([5,-1.55]),[rm('5')],mid)+math(32,P([0,5])[1]+8,[rm('5')],'text-anchor="end"');
  s+=line(...P([r,r]),...P([r,d]),'class="guide"')+line(...P([r,d]),...P([d,r]),'class="accent"');
  s+=badge(...P([.32,1.23]),1)+badge(...P([3,.36]),2)+badge(...P([.32,3.65]),3)+badge(...P([3.6,3.6]),4)+badge(...P([5.38,0]),5);
  s+=line(...P([0,-1.05]),...P([r,-1.05]))+line(...P([r,-1.05]),...P([d,-1.05]));
  for(const x of [0,r,d])s+=line(...P([x,-.95]),...P([x,-1.15]));
  s+=math(...P([r/2,-1.55]),[mi('r')],mid)+math(...P([(r+d)/2,-1.55]),[rm('√2'),mi('r')],mid);
  s+=text(553,150,'③ 縦の長方形')+math(553,191,[rm('長さ：5 − '),mi('r'),rm(' − √2'),mi('r')])+math(553,232,[rm('幅：2'),mi('r')]);
  s+=text(553,299,'④ 斜めの長方形')+math(553,340,[rm('長さ：5√2 − '),mi('r'),rm(' − √2'),mi('r')])+math(553,381,[rm('幅：2'),mi('r')]);
  s+=math(553,466,[mi('r'),rm(' = √(1 − '),mi('t'),rm('²)')]);
  s+=text(460,586,'右上の構造を拡大。原点から分割点までの長さは r + √2r。',mid);
  return s;
}
export function build(){
  const pack=createSvgPackage(packageId,import.meta.url);
  pack.add('q2-plane-apq',740,490,'平面APQ上にA、P、Q、Hがあり、Oからの垂線がHを通ってD方向へ延びる。AからPとQへのベクトルを示す。長さや角度は模式的。','平面 APQ と垂線 OH（模式図）。',planeAPQ());
  pack.add('q2-plane-oab',740,560,'C、H、Rは一直線上で、Rだけが平面OABとの交点。Hはこの平面上の点ではない。ORとABは平行。位置関係を示す模式図。','直線 CH と平面 OAB の交点 R（模式図）。',planeOAB());
  pack.add('a2-tetrahedron-opqab',740,540,'正四面体OABC。PはOBの中点、QはOCを1対2に内分する。AからP、Qへのベクトルを強調した見取り図。','内分点 P・Q と、ベクトル AP・AQ。',tetrahedron());
  pack.add('a3-polynomial-long-division',800,490,'3xの4乗−8xの3乗＋12xを12xの3乗−24xの2乗＋12で割る筆算。最初にx/4倍、次に−1/6倍を引き、余り−4x²＋9x＋2を得る。','商 x/4 − 1/6 と余りを求める筆算。',division());
  pack.add('a5-sphere-cross-section',680,625,'半径1の球の鉛直断面。高さtの水平断面の半径r、高さの絶対値|t|、半径1が直角三角形を作り、r²＋t²＝1となる。正のtの例。','球の切り口の半径 r を求める。',sphere());
  pack.add('a5-w-cross-section',750,735,'高さz=tでのWの断面。半径rの円が軸方向2線分と対角方向2線分を動く。重複しない台形①2個、横長方形②1個、縦長方形③2個、斜め長方形④4個、端の半円⑤8個へ分ける。','断面を①〜⑤へ分割。数字は解説の丸数字と対応。',section());
  pack.add('a5-w-cross-section-zoom',930,620,'断面右上の拡大。縦の長方形③は長さ5−r−√2r、斜めの長方形④は長さ5√2−r−√2rで幅はいずれも2r。軸上の長さrと√2rが分割点を決める。','右上の拡大と、長方形③・④の寸法。',zoom());
  const dir=new URL('../src/data/pastExamBatch/answer-supplements/',import.meta.url);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(new URL(`${packageId}.json`,dir),JSON.stringify(answerSupplement(),null,2)+'\n');
  return pack.save('問題の条件と独立した座標・多項式演算・カプセル領域の分割から作図。原本クロップは複製していない。増減表は意味HTMLで補足。元学習者版の論理補足・分析モデル・権利・人間レビューは未完了。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))build();
