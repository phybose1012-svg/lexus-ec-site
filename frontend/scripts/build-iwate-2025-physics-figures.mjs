// Original vector diagrams from the stated physical/geometric conditions.
// No source crop, tracing data, embedded raster, font or external resource is copied.
import fs from "node:fs";
const packageId = "iwate-medical-2025-general-physics";
const output = new URL(`../public/assets/past-exams/${packageId}/figures/`, import.meta.url);
const figures = [];
const esc = (s) => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;");
const fontData = (name) => fs.readFileSync(new URL(`../public/assets/vendor/katex/fonts/${name}.woff2`, import.meta.url)).toString("base64");
// SVGs loaded through <img> do not reliably inherit the page's web fonts. Embed
// the same KaTeX faces used by the surrounding formulas so print stays aligned.
const katexFonts = `@font-face{font-family:'KaTeX_Main';font-style:normal;font-weight:400;src:url(data:font/woff2;base64,${fontData("KaTeX_Main-Regular")}) format('woff2')}@font-face{font-family:'KaTeX_Math';font-style:italic;font-weight:400;src:url(data:font/woff2;base64,${fontData("KaTeX_Math-Italic")}) format('woff2')}`;
const line = (x1,y1,x2,y2,extra="") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}/>`;
const text = (x,y,value,extra="") => `<text x="${x}" y="${y}" ${extra}>${esc(value)}</text>`;
const span = (value, klass) => `<tspan class="${klass}">${esc(value)}</tspan>`;
const mi = (value) => span(value, "mi");
const rm = (value) => span(value, "rm");
const jp = (value) => span(value, "jp");
const sub = (value, klass="rm") => `<tspan class="sub ${klass}">${esc(value)}</tspan>`;
const mathText = (x,y,parts,extra="",small=false) => `<text x="${x}" y="${y}" class="math${small ? " small" : ""}" ${extra}>${parts.join("")}</text>`;
const arrow = (x1,y1,x2,y2,extra="") => line(x1,y1,x2,y2,`marker-end="url(#arrow)" ${extra}`);
const dim = (x1,y1,x2,y2) => line(x1,y1,x2,y2,'marker-start="url(#arrow)" marker-end="url(#arrow)"');
const circle = (x,y,r,extra="") => `<circle cx="${x}" cy="${y}" r="${r}" ${extra}/>`;
const rect = (x,y,w,h,extra="") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${extra}/>`;
function add(id,width,height,alt,caption,body) {
  figures.push({id,width,height,alt,caption,src:`/assets/past-exams/${packageId}/figures/${id}.svg`});
  const mathStyles=body.includes('class="math') ? `${katexFonts}.math{font-family:'KaTeX_Main','Times New Roman',serif;font-size:22px}.math .mi{font-family:'KaTeX_Math','Times New Roman',serif;font-style:italic}.math .rm{font-family:'KaTeX_Main','Times New Roman',serif;font-style:normal}.math .jp{font-family:'Yu Gothic','Meiryo',sans-serif;font-style:normal}.math .sub{font-size:70%;baseline-shift:sub}` : "";
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title"><title id="title">${esc(alt)}</title><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#18334c"/></marker></defs><style>text{font-family:'Yu Gothic','Meiryo',sans-serif;font-size:20px;fill:#18334c;stroke:none}${mathStyles}line,path,circle,ellipse,rect{vector-effect:non-scaling-stroke}.dash{stroke-dasharray:5 5}.glass{fill:#edf2f6}.small{font-size:17px}</style><rect width="100%" height="100%" fill="white"/><g stroke="#18334c" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
  fs.writeFileSync(new URL(`${id}.svg`,output),svg);
}
fs.mkdirSync(output,{recursive:true});

add("q1-orbit-circle",650,370,"半径2Rの円軌道と地球。拡大したロケットは左からA、B、Cの順。","円軌道とロケットの配置（模式図）",
  circle(180,210,115,'class="dash"')+circle(180,210,57,'class="glass"')+circle(180,210,2,'fill="#18334c"')+text(160,245,"地球")+dim(180,210,295,210)+mathText(246,197,[rm("2"),mi("R")])+
  rect(164,91,32,8,'fill="white"')+arrow(198,92,363,64,'class="dash"')+text(423,39,"拡大図")+
  '<path d="M408 64 H550 V108 H408 A22 22 0 0 1 408 64 Z" fill="#edf2f6"/>'+line(490,64,490,108)+line(521,64,521,108)+mathText(439,93,[mi("A")])+mathText(498,93,[mi("B")])+mathText(529,93,[mi("C")])+mathText(430,140,[rm("3"),mi("m")])+mathText(496,140,[mi("m")])+mathText(527,140,[mi("m")]));

add("q1-orbit-ellipse",640,430,"地球の中心を右側の焦点とするだ円軌道。近地点は中心から2R、遠地点は7R。","だ円軌道の近地点と遠地点",
  '<ellipse cx="310" cy="215" rx="202.5" ry="168.3746" class="dash"/>'+circle(422.5,215,45,'class="glass"')+circle(422.5,215,2,'fill="#18334c"')+dim(107.5,215,422.5,215)+dim(422.5,215,512.5,215)+mathText(248,200,[rm("7"),mi("R")])+mathText(470,200,[rm("2"),mi("R")])+text(402,240,"地球")+text(50,286,"遠地点")+text(506,286,"近地点"));

let directions="";
for(const [i,angle] of [-90,-135,-180,135,90,45,0,-45].entries()) {
  const r=angle*Math.PI/180;
  directions+=arrow(300,220,300+82*Math.cos(r),220+82*Math.sin(r));
  directions+=text(300+105*Math.cos(r),227+105*Math.sin(r),String.fromCodePoint(0x2460+i),'text-anchor="middle"');
}
add("q1-velocity-directions",600,385,"選択肢は上が①、左上②、左③、左下④、下⑤、右下⑥、右⑦、右上⑧。分離前の速度は上、地球の中心は左。","問8の方向の選択肢",
  directions+arrow(300,88,300,40,'class="dash"')+text(300,23,"切り離し前の速度の向き",'text-anchor="middle"')+arrow(163,220,74,220,'class="dash"')+text(39,260,"地球の中心"));

function coils() {
  let body=rect(72,80,602,96,'rx="18" class="glass"')+text(630,60,"鉄心");
  for(const base of [176,466]) {
    // Identical winding orientation and terminal order on the two coils.
    body+=`<path d="M${base-16} 176 L${base-16} 250 M${base+108} 176 L${base+108} 250"/>`;
    for(let j=0;j<9;j++) body+=`<path d="M${base+j*12} 80 C${base+j*12+20} 89 ${base+j*12+20} 167 ${base+j*12-1} 176"/>`;
    body+=line(base-16,176,base-1,176)+line(base+95,176,base+108,176);
  }
  for(const [x,label,dx] of [[160,"b",-20],[284,"a",12],[450,"d",-20],[574,"c",12]]) body+=circle(x,250,4,'fill="white"')+mathText(x+dx,255,[mi(label)]);
  return body+mathText(204,60,[rm("K"),sub("1"),jp("（"),mi("N"),sub("1"),jp("巻）")])+mathText(489,60,[rm("K"),sub("2"),jp("（"),mi("N"),sub("2"),jp("巻）")])+line(160,254,160,294)+rect(149,294,22,42,'fill="white"')+mathText(177,322,[mi("R")])+arrow(126,335,126,295)+mathText(105,319,[mi("I")]);
}
add("q2-core-circuit-switch",760,440,"同じ向きに巻いたK1とK2。K1の左端bに電池の正極と抵抗R、右端aにスイッチと負極を接続。K2の左端dと右端cは開放。Iの正は抵抗を下から上。","スイッチ・電池を接続した回路",
  coils()+line(160,336,160,382)+line(160,382,212,382)+line(212,365,212,399)+line(225,374,225,390)+line(225,382,284,382)+mathText(200,354,[mi("V")])+line(284,382,284,325)+circle(284,325,3,'fill="white"')+line(284,325,304,292)+circle(284,281,3,'fill="white"')+line(284,281,284,254)+mathText(315,315,[mi("S")]));
add("q2-core-circuit-source",760,445,"K1に電源Eと抵抗R、K2のcとdに抵抗rを接続。Iの正はbへ流れ込む向き、iの正は抵抗をcからdへ流れる向き。磁束φの正は鉄心内を右へ。","電源Eと抵抗rを接続した回路・正の向き",
  coils()+line(160,336,160,382)+line(160,382,202,382)+rect(202,363,52,38,'fill="white"')+mathText(220,389,[mi("E")])+line(254,382,284,382)+line(284,382,284,254)+line(450,254,450,330)+line(450,330,494,330)+rect(494,319,56,22,'fill="white"')+mathText(518,308,[mi("r")])+line(550,330,574,330)+line(574,330,574,254)+arrow(551,366,494,366)+mathText(520,394,[mi("i")])+arrow(342,127,411,127)+mathText(369,114,[mi("φ")]));

add("q2-current-graph",640,345,"電流iは0からTまで−i0、Tから3Tまで0、3Tから4Tまでi0、4Tより後は0。","電流iの時間変化",
  arrow(44,175,589,175)+arrow(70,305,70,28)+mathText(601,182,[mi("t")])+mathText(54,20,[mi("i")])+mathText(46,195,[rm("0")])+
  line(70,80,430,80,'class="dash"')+line(160,175,160,270,'class="dash"')+line(340,80,340,175,'class="dash"')+line(430,80,430,175,'class="dash"')+
  line(70,270,160,270,'stroke-width="3"')+line(160,175,340,175,'stroke-width="3"')+line(340,80,430,80,'stroke-width="3"')+line(430,175,560,175,'stroke-width="3"')+mathText(35,86,[mi("i"),sub("0")])+mathText(21,277,[rm("−"),mi("i"),sub("0")])+mathText(168,203,[mi("T")])+mathText(348,203,[rm("3"),mi("T")])+mathText(438,203,[rm("4"),mi("T")]));

add("q3-plane-wave-glass",680,300,"2枚の平板ガラスの間の左右端に弾力のある板を挟み、上方から平面波を入射する装置の模式図。傾きや厚さは拡大・省略している。","2枚の平板ガラスと入射光（傾き・厚さは模式的）",
  text(295,34,"平面波")+[140,220,300,380,460,540].map(x=>arrow(x,56,x,122)).join("")+rect(80,146,520,36,'class="glass"')+rect(80,207,520,36,'class="glass"')+rect(80,182,26,25,'fill="#9aabb7"')+rect(574,182,26,25,'fill="#9aabb7"')+text(73,274,"左")+text(578,274,"右"));

add("q3-dark-fringes",520,360,"正方形のガラスに縦方向の暗線が等間隔に並んでいる。描いた本数と間隔は実際の値を表さない。","暗線の様子（本数・間隔は模式的）",
  rect(125,28,270,270)+Array.from({length:10},(_,j)=>line(149+j*24,28,149+j*24,298,'stroke-width="2.5"')).join("")+arrow(281,326,269,282)+text(286,343,"暗線"));

add("q3-lens-pair",720,390,"光軸を一致させて接触するレンズの断面。上は下面が凸の平凸レンズ、下は上面が凹の平凹レンズ。中心で接触し、周辺には隙間がある。","接触させた平凸レンズと平凹レンズ",
  '<path d="M90 170 A450 450 0 0 0 630 170 V300 H90 Z" class="glass"/><path d="M170 160 H550 A230.5 230.5 0 0 1 170 160 Z" class="glass"/>'+
  line(360,43,360,345,'class="dash"')+text(340,28,"光軸")+text(496,111,"平凸レンズ")+line(535,119,522,163)+text(504,355,"平凹レンズ")+line(542,331,542,283));

// The geometry is calculated, not traced: common vertex P, R1=350, R2=240, r=175.
const x0=235, y0=400, r=175, R1=350, R2=240;
const d1=R1-Math.sqrt(R1*R1-r*r),d2=R2-Math.sqrt(R2*R2-r*r);
const arc=(R)=>Array.from({length:71},(_,i)=>{const x=-r+2*r*i/70;return `${i?"L":"M"}${x0+x},${y0-R+Math.sqrt(R*R-x*x)}`;}).join(" ");
add("ans-q3-lens-geometry",640,470,"共通の接点Pから測る球面の高さはd1とd2。各球面の中心O1、O2から半径R1、R2を引き、横の長さr、縦の長さRj−djの直角三角形を作る。空隙dはd2−d1。","球面の高さd₁・d₂と、空隙d = d₂ − d₁",
  `<path d="${arc(R1)}"/><path d="${arc(R2)}"/>`+line(x0,28,x0,423,'class="dash"')+line(44,y0,587,y0,'class="dash"')+
  circle(x0,y0-R1,3,'fill="#18334c"')+circle(x0,y0-R2,3,'fill="#18334c"')+mathText(195,y0-R1+7,[mi("O"),sub("1")])+mathText(195,y0-R2+7,[mi("O"),sub("2")])+
  line(x0,y0-R1,x0+r,y0-d1)+line(x0,y0-R2,x0+r,y0-d2)+mathText(328,175,[mi("R"),sub("1")])+mathText(356,246,[mi("R"),sub("2")])+
  line(x0,y0-d1,x0+r,y0-d1,'class="dash"')+line(x0,y0-d2,x0+r,y0-d2,'class="dash"')+line(x0+r,y0-d2,x0+r,y0,'class="dash"')+
  dim(x0,y0+31,x0+r,y0+31)+mathText(x0+r/2-5,y0+58,[mi("r")])+mathText(x0-24,y0+25,[mi("P")])+
  line(x0+r,y0-d1,570,y0-d1,'class="dash"')+line(x0+r,y0-d2,570,y0-d2,'class="dash"')+
  dim(455,y0-d2,455,y0-d1)+mathText(464,y0-(d1+d2)/2+6,[mi("d")])+dim(514,y0-d1,514,y0)+mathText(523,y0-d1/2+6,[mi("d"),sub("1")])+dim(581,y0-d2,581,y0)+mathText(590,y0-d2/2+6,[mi("d"),sub("2")])+
  mathText(74,267,[mi("R"),sub("1"),rm(" − "),mi("d"),sub("1")],"",true)+mathText(244,266,[mi("R"),sub("2"),rm(" − "),mi("d"),sub("2")],"",true));

const manifest={schemaVersion:"lexus-past-exam-figures.v1",packageId,contentProvenance:"original_editorial",restrictedSourceCopied:false,review:{needsHumanReview:true,notes:"物理条件・端子・選択肢方向を確認するための独自ベクトル作図。原本の権利承認状態は変更しない。"},items:figures};
fs.mkdirSync(new URL("../src/data/pastExamFigures/",import.meta.url),{recursive:true});
fs.writeFileSync(new URL(`../src/data/pastExamFigures/${packageId}.json`,import.meta.url),JSON.stringify(manifest,null,2)+"\n");
console.log(`Built ${figures.length} original physics diagrams`);
