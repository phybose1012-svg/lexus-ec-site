// Independent coordinates and counting; never embed or trace restricted source crops.
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {mi,rm,sub,math,text,line,dot,pointsPath,createSvgPackage} from './lib/past-exam-svg-author.mjs';
export const packageId='st-marianna-2025-general-early-mathematics';
export const learnerSha='3226b5a28f0c0d1ac661f7c48791211ef85831de6827f93edff567c0d7048dd2';
export const a=Math.sqrt(3)/2,alpha=-2-2*Math.sqrt(2),beta=-2+2*Math.sqrt(2);
export const g=t=>4*t+Math.abs(3-4*t*t),parabola=x=>x*x/4-1,reflect=([x,y])=>[-y,-x];
export const critical=[[-1,-3],[-a,-2*Math.sqrt(3)],[0,3],[.5,4],[a,2*Math.sqrt(3)],[1,5]];
export function words(counts,prefix=''){if(counts.every(n=>n===0))return [prefix];return counts.flatMap((n,i)=>{if(!n)return [];const next=[...counts];next[i]--;return words(next,prefix+'abc'[i]);});}
export const equalNeighbors=w=>[...w].slice(1).filter((c,i)=>c===w[i]).length;
export const cores=()=>words([3,4,0]).filter(w=>w[0]==='a'&&w.at(-1)==='b');
export function insertions(w){const result=[];for(let mask=0;mask<64;mask++){if(mask.toString(2).replaceAll('0','').length!==3)continue;let s=w[0];for(let i=0;i<6;i++)s+=((mask&(1<<i))?'c':'')+w[i+1];if(!equalNeighbors(s))result.push(s);}return result;}
export function tRoots(k){const q=[];for(const [A,B,C,valid] of [[-4,4,3-k,t=>Math.abs(t)<=a+1e-9],[4,4,-3-k,t=>Math.abs(t)>=a-1e-9]]){const D=B*B-4*A*C;if(D< -1e-9)continue;for(const sign of [-1,1]){const t=(-B+sign*Math.sqrt(Math.max(0,D)))/(2*A);if(t>=-1-1e-9&&t<=1+1e-9&&valid(t)&&!q.some(x=>Math.abs(x-t)<1e-8))q.push(t);}}return q.sort((a,b)=>a-b);}
export const xCount=k=>tRoots(k).reduce((s,t)=>s+(Math.abs(t)<1e-8?3:Math.abs(Math.abs(t)-1)<1e-8?1:2),0);
const sample=(lo,hi,f,n=110)=>Array.from({length:n+1},(_,i)=>{const x=lo+(hi-lo)*i/n;return [x,f(x)];});
const curve=(pts,attr='')=>`<path d="${pointsPath(pts)}" ${attr}/>`;
const polygon=(pts,fill)=>curve(pts,`fill="${fill}"`);
const label=(x,y,s,attr='')=>math(x,y,[rm(s)],attr);
const sup=n=>`<tspan class="rm" font-size="70%" baseline-shift="super">${n}</tspan>`;
export function graph(){
 const p=([t,y])=>[325+225*t,345-48*y];
 let b=text(30,31,'第3問：置き換えた変数 t のグラフ');
 b+=math(70,75,[mi('g'),rm('('),mi('t'),rm(') = 4'),mi('t'),rm(' + |3 − 4'),mi('t'),sup(2),rm('|')]);
 b+=line(47,345,599,345,'class="axis" marker-end="url(#arrow)"')+line(325,540,325,92,'class="axis" marker-end="url(#arrow)"');
 b+=math(602,352,[mi('t')])+math(306,104,[mi('y')])+label(300,374,'O');
 for(const n of [-1,1]){b+=line(...p([n,0]),...p([n,g(n)]),'class="guide"')+label(p([n,0])[0]+(n<0?-24:0),376,String(n),'text-anchor="middle"');}
 for(const [lo,hi] of [[-1,-a],[-a,a],[a,1]])b+=curve(sample(lo,hi,g).map(p),'stroke-width="2.6"');
 const offsets=[[-29,-8],[-9,31],[12,16],[-12,-17],[-28,29],[12,-8]];
 critical.forEach((pt,i)=>{const v=p(pt);b+=dot(...v)+label(v[0]+offsets[i][0],v[1]+offsets[i][1],'ABCDEF'[i]);});
 b+=line(620,96,620,522,'class="guide"');
 b+=text(650,115,'点の座標（t, y）');
 ['A  (−1, −3)','B  (−√3/2, −2√3)','C  (0, 3)','D  (1/2, 4)','E  (√3/2, 2√3)','F  (1, 5)'].forEach((s,i)=>b+=label(650,162+i*51,s));
 b+=text(650,492,'B：最小値　F：最大値');
 b+=text(30,570,'実線は −1 ≦ t ≦ 1 のみ。元の変数 x のグラフではありません。');
 // Inequalities are ordinary Japanese prose here, not math labels.
 return b;
}
export function areaGraph(){
 const p=([x,y])=>[447+57*x,401-57*y],arc=sample(alpha,beta,parabola),upper=arc.map(reflect);
 let b=text(30,31,'第4問(4)：対称な2つの部分の面積を足す');
 b+=polygon([...arc,...upper.toReversed(),arc[0]].map(p),'#f6f1e6');
 b+=polygon([...arc,arc[0]].map(p),'#e4eef5');
 b+=line(...p([-5.6,0]),...p([3.7,0]),'class="axis" marker-end="url(#arrow)"')+line(...p([0,-2.6]),...p([0,5.7]),'class="axis" marker-end="url(#arrow)"');
 b+=curve(sample(-5.1,3.6,parabola).map(p),'stroke-width="2.3"');
 b+=curve(sample(-2.8,5.1,y=>1-y*y/4).map(([y,x])=>p([x,y])),'stroke-width="2.3"');
 b+=line(...p([-5.25,5.25]),...p([2.4,-2.4]),'class="guide"');
 for(const x of [alpha,beta]){b+=line(...p([x,0]),...p([x,-x]),'class="guide"')+dot(...p([x,-x]));}
 b+=math(p([alpha,0])[0],433,[mi('α')],'text-anchor="middle"');
 b+=math(529,382,[mi('β')])+line(522,384,...p([beta,0]),'class="guide"');
 b+=label(420,428,'O')+math(663,407,[mi('x')])+math(428,76,[mi('y')]);
 b+=math(674,269,[mi('C'),sub(1)])+math(393,575,[mi('C'),sub(2)]);
 b+=math(612,551,[mi('y'),rm(' = −'),mi('x')]);
 b+=math(...p([-1.5,.5]),[mi('S'),rm('/2')],'text-anchor="middle"')+math(...p([-2.1,2.8]),[mi('S'),rm('/2')],'text-anchor="middle"');
 b+=math(32,612,[mi('α'),rm(' = −2 − 2√2')])+math(383,612,[mi('β'),rm(' = −2 + 2√2')]);
 b+=text(32,650,'青い部分：直線 y = −x と C₁ の間。反射すると薄い金色の部分。');
 return b;
}
export function unitCircle(){
 const s=1/Math.sqrt(2),p=([x,y])=>[260+168*x,278-168*y];
 let b=text(30,31,'第4問(1)：sin θ = −cos θ を単位円で読む');
 b+=line(...p([-1.3,0]),...p([1.34,0]),'class="axis" marker-end="url(#arrow)"')+line(...p([0,-1.28]),...p([0,1.28]),'class="axis" marker-end="url(#arrow)"');
 b+=`<circle cx="260" cy="278" r="168"/>`+line(...p([-1.13,1.13]),...p([1.13,-1.13]),'class="guide"');
 for(const pt of [[-s,s],[s,-s]]){b+=line(...p([pt[0],0]),...p(pt),'class="guide"')+line(...p([0,pt[1]]),...p(pt),'class="guide"')+dot(...p(pt));}
 b+=label(96,165,'P')+label(407,399,'Q');
 b+=label(237,305,'O')+label(448,310,'1')+label(50,310,'−1');
 b+=math(489,285,[mi('x')])+math(239,64,[mi('y')]);
 b+=line(512,92,512,444,'class="guide"');
 b+=text(539,109,'点の座標')+label(539,153,'P (−1/√2, 1/√2)')+label(539,205,'Q (1/√2, −1/√2)');
 b+=text(539,272,'正のx軸からの偏角');
 b+=math(539,316,[rm('P：'),mi('θ'),rm(' = 3π/4')])+math(539,363,[rm('Q：'),mi('θ'),rm(' = 7π/4')]);
 b+=math(60,508,[mi('x'),rm(' = cos '),mi('θ'),rm(',   '),mi('y'),rm(' = sin '),mi('θ')]);
 b+=text(30,550,'円は半径1、破線の直線は y = −x。面積を求める図とは別の図です。');
 return b;
}
export function supplement(){const M=s=>`\\(${s}\\)`,prose=(major,text)=>({type:'prose',major_question_id:major,text}),table=(major,caption,headers,rows)=>({type:'table',major_question_id:major,caption,headers,rows});return {schemaVersion:'lexus-answer-supplement.v1',packageId,sourceSha256:learnerSha,contentProvenance:'original_editorial',restrictedSourceCopied:false,review:{needsHumanReview:true,notes:'文字列は全列挙、解の個数は区分二次方程式から独立検算。元HTMLの省略を補う限定的な表で、取込解説全体を独自解説へ変更しない。'},operations:[
 {type:'insert-after',expectedMatches:1,anchor:{type:'prose',major_question_id:'major-question-02',text:'(5) 先頭a・末尾bを固定し、残るa2個とb3個の並び10通りを、同じ文字の隣接箇所数で分類します。'},blocks:[prose('major-question-02','両端の外側にはcを置けず、内部の6つのすき間には各1個までです。同じ文字が続くすき間へ必ずcを入れ、合計3個になるよう残りを選びます。'),table('major-question-02','cを除いた10通りと、条件を満たす復元数',['a・bの並び','同じ文字の隣接箇所','cの入れ方'],cores().map(w=>[w,String(equalNeighbors(w)),String(insertions(w).length)]))]},
 {type:'insert-after',expectedMatches:1,anchor:{type:'formula',major_question_id:'major-question-03',latex:'f(x)=4t+|3-4t^2|'},blocks:[prose('major-question-03',M('-1\\leqq t\\leqq1')+'が定義域です。'+M('|t|\\leqq\\sqrt3/2')+'では'+M('g(t)=-4(t-1/2)^2+4')+'、残る2区間では'+M('g(t)=4t^2+4t-3')+'になります。各区間の端点と頂点を比べます。')]},
 {type:'insert-after',expectedMatches:1,anchor:{type:'prose',major_question_id:'major-question-03',text:'t=0には0≤x≤2πで3個のxが対応するため、y=3との共有点は3個です。'},blocks:[table('major-question-03','置き換えた値1個に対応する元の解の個数',[M('t=\\sin x'),'対応する'+M('x')+'の個数'],[[M('t=0'),'3個（'+M('0,\\pi,2\\pi')+'）'],[M('t=1')+' または '+M('t=-1'),'各1個'],[M('-1<t<0')+' または '+M('0<t<1'),'各2個']]),prose('major-question-03','(4)は横線と上のグラフの交点を数え、その'+M('t')+'に対応する'+M('x')+'の個数へ戻します。3交点がすべて'+M('0<t<1')+'にあるとき、'+M('2+2+2=6')+'個です。境界では2交点に減るので除きます。'),table('major-question-03','6個になる範囲と、両端での確認',[M('k'),'異なる'+M('t')+'の個数','元の共有点数'],[[M('k=2\\sqrt3'),'2個','4個'],[M('2\\sqrt3<k<4'),'3個','6個'],[M('k=4'),'2個','4個']])]}
 ]};}
export function build(){const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('a3-graph-abs-quadratic',930,600,'y=4t+|3−4t²|を−1から1で描いたグラフ。最小点は(−√3/2,−2√3)、最大点は(1,5)、局所最大は(1/2,4)、右側の折れ点は(√3/2,2√3)。','tのグラフと、元のxの解の個数を区別します。',graph());
 pack.add('a4-area-c1-c2',780,675,'C₁はy=x²/4−1、C₂はx=1−y²/4。y=−xで反射した関係にあり、囲まれた面積を等しい2部分に分ける。α=−2−2√2、β=−2+2√2は交点のx座標。','青い部分を積分し、対称な部分と合わせて2倍します。',areaGraph());
 pack.add('a4-unit-circle-line',800,575,'第4問(1)の単位円とy=−x。第2象限と第4象限の交点は(−1/√2,1/√2)、(1/√2,−1/√2)。偏角は3π/4、7π/4。','(1)の偏角を確認する単位円。元HTMLの図の配置は修復確認中です。',unitCircle());
 pack.save('条件の関数・放物線・単位円から独立生成。全図の座標・解の個数・対称面積を回帰確認。元の図説明の極大/極小の混同と図配置は修復依頼に分離。');
 fs.writeFileSync(new URL(`../src/data/pastExamBatch/answer-supplements/${packageId}.json`,import.meta.url),JSON.stringify(supplement(),null,2)+'\n');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)build();
