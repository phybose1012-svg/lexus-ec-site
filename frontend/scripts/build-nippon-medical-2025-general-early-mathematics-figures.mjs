import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,math,mi,rm,sub,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='nippon-medical-2025-general-early-mathematics';
const sqrt=Math.sqrt, M=s=>`\\(${s}\\)`;
export const add=(a,b)=>a.map((v,i)=>v+b[i]);
export const scale=(a,t)=>a.map(v=>v*t);
export const minus=(a,b)=>add(a,scale(b,-1));
export const dot3=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
export function tetrahedron(x=.4){
 const O=[0,0,0],A=[1,0,0],B=[.5,sqrt(3)/2,0],C=[0,1/sqrt(3),sqrt(8/3)];
 const H=add(add(scale(A,.5),scale(B,1/3)),scale(C,1/6));
 const I=add(add(scale(A,(sqrt(3)-1)/2),scale(B,(3-sqrt(3))/3)),scale(C,(3-sqrt(3))/6));
 const D=scale(A,x),J=scale(H,x);
 return {O,A,B,C,H,I,D,J};
}
export const F=p=>4*p**4-3*p*p-10*p+26;
export const dF=p=>2*(p-1)*(8*p*p+8*p+5);
export const rotate=([x,y,z])=>[x,.6*y+.8*z,-.8*y+.6*z];
export const inverse=([x,y,z])=>[x,.6*y-.8*z,.8*y+.6*z];
export const minimumPoint=[2,.6,.8];
const segment=(a,b,extra='')=>line(...a,...b,extra);
const poly=(pts,extra='')=>`<path d="${pointsPath(pts)} Z" ${extra}/>`;
const label=(p,name,dx=12,dy=-12)=>dot(...p)+math(p[0]+dx,p[1]+dy,[mi(name)]);
const curve=(pts,extra='')=>`<path d="${pointsPath(pts)}" ${extra}/>`;
const samples=(fn,a,b,n=100)=>Array.from({length:n+1},(_,i)=>fn(a+(b-a)*i/n));
function plane(){
 const O=[475,70],H=[475,390],A=[165,390],I=[558,390],D=[351,198],J=[475,198];
 let s=poly([O,H,I],'fill="#f5f0e5" stroke="none"')+poly([D,H,I],'fill="#e4edf3" stroke="none"');
 s+=poly([O,A,I])+segment(O,H)+segment(D,I,'class="accent"')+segment(D,H,'class="guide"')+segment(D,J,'class="guide"');
 s+=poly([[475,374],[491,374],[491,390]],'class="axis"')+poly([[459,198],[459,214],[475,214]],'class="axis"');
 for(const [p,n,dx,dy] of [[O,'O',12,-8],[A,'A',-25,24],[H,'H',-12,32],[I,'I',10,24],[D,'D',-28,-8],[J,'J',14,8]])s+=label(p,n,dx,dy);
 s+=text(38,48,'共通の底辺と、高さを比べる');
 s+=math(40,108,[mi('DJ'),rm(' ∥ '),mi('AH')]);
 s+=math(40,150,[mi('JH'),rm(' : '),mi('OH'),rm(' = (1 − '),mi('x'),rm(') : 1')]);
 s+=text(38,474,'青：△DHI　　薄い金：△OHI');
 s+=text(38,506,'Dの位置は比を説明するための一例です。');
 return s;
}
function tetra(){
 // An affine projection of the independently computed coordinates, not a traced crop.
 const p=tetrahedron(), O=[270,190],A=[520,430],B=[170,450],C=[250,70];
 const u=minus(A,O),v=scale(minus(minus(B,O),scale(u,.5)),2/sqrt(3));
 const w=scale(minus(minus(C,O),scale(v,1/sqrt(3))),1/sqrt(8/3));
 const P=([x,y,z])=>add(O,add(add(scale(u,x),scale(v,y)),scale(w,z)));
 let s=poly([A,B,C],'fill="#f2f6f8"');
 for(const key of ['A','B','C'])s+=segment(O,P(p[key]),key==='C'?'class="guide"':'');
 s+=segment(O,P(p.H),'class="accent"')+segment(A,P(p.I),'class="guide"')+segment(P(p.D),P(p.I),'class="guide"');
 for(const [key,dx,dy] of [['O',-31,-2],['A',12,12],['B',-28,20],['C',0,-18],['H',16,25],['I',-28,25]])s+=label(P(p[key]),key,dx,dy);
 s+=dot(...P(p.D))+segment(P(p.D),[426,246],'class="guide"')+math(438,246,[mi('D')]);
 s+=text(35,37,'四面体の中の垂線と内心');
 s+=math(390,85,[mi('OH'),rm(' ⊥ 平面 '),mi('ABC')]);
 s+=text(390,115,'I：△ABCの内心');
 s+=text(390,145,'D：辺OA上の点');
 s+=text(35,515,'辺の長さは1・√3・2で、正四面体ではありません。');
 return s;
}
function incenter(){
 const P=([x,y])=>[220+235*x,435-235*y],r=(sqrt(3)-1)/2;
 const A=P([1,0]),B=P([0,0]),C=P([0,sqrt(3)]),I=P([r,r]),K=P([0,sqrt(3)/3]);
 let s=poly([A,B,C],'fill="#f5f8fa"')+segment(A,K,'class="accent"')+segment(C,I,'class="accent"');
 s+=poly([[220,420],[235,420],[235,435]],'class="axis"');
 for(const [p,n,dx,dy] of [[A,'A',12,12],[B,'B',-27,20],[C,'C',-28,0],[K,'K',-30,7],[I,'I',-26,24]])s+=label(p,n,dx,dy);
 s+=math(330,468,[rm('1')])+math(369,232,[rm('2')])+math(166,172,[rm('√3')]);
 s+=text(475,68,'角の二等分線を利用');
 s+=math(475,119,[mi('BK'),rm(' : '),mi('KC'),rm(' = 1 : 2')]);
 s+=math(475,164,[mi('AI'),rm(' : '),mi('IK'),rm(' = √3 : 1')]);
 s+=text(475,209,'KはAIとBCの交点');
 s+=text(40,520,'辺AB = 1、BC = √3、AC = 2から作図。');
 return s;
}
function space(){
 // Left: cross-section at x=2 as an example. Right: meridian after the same rotation.
 const P=([x,y,z])=>[67+75*x+43*y,329+13*x+11*y-49*z];
 const O=P([0,0,0]),A=P([1,3,4]),B=P([1,5,0]),H=P([1,0,0]),X=P(minimumPoint),Y=P([2,1,0]);
 let s=text(30,35,'① x軸のまわりに同じ角度だけ回転');
 s+=segment(P([-.3,0,0]),P([3.8,0,0]),'class="axis" marker-end="url(#arrow)"');
 s+=segment(O,P([0,6.1,0]),'class="axis" marker-end="url(#arrow)"')+segment(O,P([0,0,5.1]),'class="axis" marker-end="url(#arrow)"');
 s+=curve(samples(t=>P([2,Math.cos(t),Math.sin(t)]),0,2*Math.PI),'class="accent"');
 s+=curve(samples(t=>P([1,5*Math.cos(t),5*Math.sin(t)]),Math.atan2(4,3),0),'class="guide" marker-end="url(#arrow)"');
 s+=segment(A,X)+segment(B,Y)+segment(A,H,'class="guide"')+segment(B,H,'class="guide"');
 s+=label(A,'A',-22,-16)+label(B,'B',9,17)+label(H,'H',-20,24)+dot(...X)+dot(...Y);
 s+=segment(X,[280,294],'class="guide"')+math(288,295,[mi('X')]);
 s+=segment(Y,[282,335],'class="guide"')+math(290,343,[mi('Y')]);
 s+=math(365,387,[mi('x')])+math(333,418,[mi('y')])+math(52,69,[mi('z')])+math(41,342,[mi('O')]);
 s+=segment(P([2,-.7,.7]),[205,225],'class="guide"')+math(161,204,[mi('C'),sub('2')]);
 s+=text(32,472,'断面円は x = 2 を例示。青い線分は同じ長さ。');
 s+=line(462,25,462,497,'class="guide"');
 const Q=(x,y)=>[507+65*x,412-62*y];
 s+=text(488,35,'② 回転後は平面内で最小化');
 s+=line(...Q(0,0),...Q(4.4,0),'class="axis" marker-end="url(#arrow)"')+line(...Q(0,0),...Q(0,5.7),'class="axis" marker-end="url(#arrow)"');
 s+=curve(samples(p=>Q(2*p*p,p),0,1.42),'stroke-width="2.6"');
 s+=segment(Q(1,5),Q(2,1),'class="accent"')+segment(Q(2,1),Q(2,0),'class="guide"');
 s+=label(Q(1,5),'B',15,0)+math(598,128,[rm('(1, 5, 0)')]);
 s+=label(Q(2,1),'Y',17,-12)+math(650,375,[rm('(2, 1, 0)')]);
 s+=math(784,437,[mi('x')])+math(483,62,[mi('y')])+math(484,437,[mi('O')]);
 s+=math(644,271,[mi('x'),rm(' = 2'),mi('y'),rm('²')]);
 s+=text(490,472,'正のy側の断面点だけを比較します。');
 return s;
}
function yz(){
 const P=(y,z)=>[122+78*y,423-78*z],O=P(0,0),A=P(3,4),B=P(5,0),X=P(.6,.8),Y=P(1,0);
 let s=text(35,34,'回転を元へ戻す：yz平面への射影');
 s+=segment(P(-.3,0),P(6.3,0),'class="axis" marker-end="url(#arrow)"')+segment(P(0,-.35),P(0,4.9),'class="axis" marker-end="url(#arrow)"');
 s+=segment(O,A)+segment(O,B)+segment(A,[356,278],'class="guide"')+segment([356,336],P(3,0),'class="guide"')+segment(A,P(0,4),'class="guide"');
 s+=curve(samples(t=>P(5*Math.cos(t),5*Math.sin(t)),0,Math.atan2(4,3)),'class="guide" marker-end="url(#arrow)"');
 s+=curve(samples(t=>P(Math.cos(t),Math.sin(t)),0,Math.atan2(4,3)),'class="accent" marker-end="url(#arrow)"');
 s+=dot(...A)+dot(...B)+dot(...X)+dot(...Y);
 s+=math(371,100,[mi('A'),rm('′ (3, 4)')])+math(477,464,[mi('B'),rm('′ (5, 0)')]);
 s+=segment(X,[245,318],'class="guide"')+math(260,320,[mi('X'),rm('′ (3/5, 4/5)')]);
 s+=segment(Y,[283,480],'class="guide"')+math(290,501,[mi('Y'),rm('′ (1, 0)')]);
 s+=math(101,453,[mi('O')])+math(624,432,[mi('y')])+math(92,68,[mi('z')]);
 s+=math(93,119,[rm('4')])+math(346,450,[rm('3')]);
 s+=text(530,180,'同じ角度だけ回転');
 s+=text(530,214,'外側の半径：5');
 s+=text(530,248,'内側の半径：1');
 s+=text(40,545,'x座標は変化しないので、最短点Xのx座標は2のまま。');
 return s;
}
export function answerSupplement(){
 const major='major-question-03';
 return {schemaVersion:'lexus-answer-supplement.v1',packageId,sourceSha256:'c638006a24e84b01861970bda263460f3c493717001b74906825c6cf2f227cae',contentProvenance:'original_editorial',restrictedSourceCopied:false,review:{needsHumanReview:true,notes:'回転不変性・断面円の最近点と導関数から独立に補足した説明とHTML増減表。元learnerの別解と他の途中式は修復待ち。'},operations:[
 {type:'insert-after',expectedMatches:1,anchor:{type:'formula',major_question_id:major,latex:'AH=\\sqrt{3^2+4^2}=5,\\qquad B=(1,5,0)'},blocks:[{type:'prose',major_question_id:major,text:`集合${M('S')}は${M('x')}軸のまわりに回しても変わらず、距離も保たれます。回転後、各断面円で${M('B')}に最も近い点は正の${M('y')}軸方向にあります。この点を${M('Y=(2p^2,p,0)')}、${M('p\\geqq0')}と置きます。以下の距離式の${M('X_k')}はこの回転後の点${M('Y')}を表し、元の点${M('X')}とは区別します。`}]},
 {type:'insert-after',expectedMatches:1,anchor:{type:'formula',major_question_id:major,latex:'\\frac{d}{dp}|BX_k|^2=2(p-1)(8p^2+8p+5)'},blocks:[
 {type:'prose',major_question_id:major,text:`距離の2乗を${M('F(p)')}とします。${M('8p^2+8p+5=8(p+1/2)^2+3')}は正なので、導関数の符号は${M('p-1')}で決まります。${M('p=0')}は集合${M('S')}の頂点も含めて比較するための端点です。`},
 {type:'table',major_question_id:major,caption:'距離の2乗 F(p) の増減表',headers:[M('p'),M('0'),'…',M('1'),'…'],rows:[[M("F'(p)"),M('-10'),M('-'),M('0'),M('+')],[M('F(p)'),M('26'),'↘',M('17'),'↗']]},
 ]}]};
}
export function build(){
 const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('ans-q2-djhi-plane',660,540,'O,A,D,H,Iが同一平面上。JはDからOHへ下ろした垂線の足。DHIとOHIは底辺IHを共有し、高さの比はJH:OH=1−x:1。Dは説明用の位置。','△DHIと△OHIの面積を、高さの比で比較します。',plane());
 pack.add('ans-q2-tetrahedron',710,550,'辺長OA=OB=AB=1、OC=BC=√3、AC=2の四面体。HはOから平面ABCへの垂線の足、Iは三角形ABCの内心、DはOA上。','辺長から独立に構成した四面体の投影図。',tetra());
 pack.add('ans-q2-incenter',770,550,'AB=1、BC=√3、AC=2の直角三角形。内心Iと、角Aの二等分線がBCと交わる点Kを示す。BK:KC=1:2、AI:IK=√3:1。','内心の位置を、角の二等分線と内分比で求めます。',incenter());
 pack.add('ans-q3-space-geometry',835,510,'左はx=2の断面円を例にAと最短点Xを同じ角度だけ回してBとYへ移す投影図。右は回転後のxy平面でB(1,5,0)と放物線上Y(2,1,0)の最短距離を示す。','空間の回転と、回転後の平面内の最小化を分けて考えます。',space());
 pack.add('ans-q3-yz-projection',725,570,'yz平面への射影でB′(5,0)をA′(3,4)へ戻すのと同じ回転により、Y′(1,0)はX′(3/5,4/5)へ移る。半径5と1、角度が共通。','最短点の座標を、回転前の向きに戻します。',yz());
 const dir=new URL('../src/data/pastExamBatch/answer-supplements/',import.meta.url);fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(new URL(`${packageId}.json`,dir),JSON.stringify(answerSupplement(),null,2)+'\n');
 return pack.save('与えられた辺長・座標・回転の条件から独立生成。図内のX/Yは回転前/後を区別する。HTML表は独立導出。元本文の論証欠落・権利・人間承認は未完了。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))build();
