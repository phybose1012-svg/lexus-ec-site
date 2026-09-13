import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,math,mi,rm,sub,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='sangyo-medical-2025-general-a-b-mathematics';
export const learnerSha='efd9b8e422df06b924b5162a184a83afa6bec72f8632e9d1c69c31b160ced714';
const root=Math.sqrt;
export const tetra={O:[0,0,0],A:[2*root(2),0,0],B:[1/root(2),3/root(2),0],C:[3/root(2),1/root(2),2],S:[3/root(2),1/root(2),0],T:[root(2),0,0],H:[root(2),root(2),0]};
export const circle={D:[0,-.5],A:[.2,-1.6],B:[1,0],P:[-.2,.6],radius:root(5)/2};
export const tangency={R:[0,0],P:[2*root(3),0],Q:[6*root(3),0],O1:[2*root(3),2],O2:[6*root(3),6]};
export const integerPairs=()=>[-9,-3,-1,1,3,9].map(d=>({d,x:(d+9)/2,y:18/d-2}));
export function eatingWays(n){if(n===0)return [[]];if(n<0)return [];return [1,2].flatMap(k=>eatingWays(n-k).map(a=>[k,...a]));}
const label=(x,y,name,extra='')=>math(x,y,[mi(name)],extra);
const poly=(ps,extra='')=>`<path d="${pointsPath(ps)}" ${extra}/>`;
function right(v,a,b,size=12){const unit=p=>{const d=p.map((x,i)=>x-v[i]),n=Math.hypot(...d);return d.map(x=>x/n*size);},u=unit(a),w=unit(b);return poly([v.map((x,i)=>x+u[i]),v.map((x,i)=>x+u[i]+w[i]),v.map((x,i)=>x+w[i])],'class="axis"');}
export function tangentCircle(){
 const f=([x,y])=>[370+32*(x-2),270-32*(y-1)];
 const g={A:[5,5],B:[-1,-3],C:[2,1],P:[-2,4],X:[-5,0]};
 let s=`<circle cx="370" cy="270" r="160"/>`;
 s+=line(...f(g.A),...f(g.B),'class="guide"')+line(...f([-6.5,-2]),...f([.3,7.07]));
 s+=line(...f(g.C),...f(g.P),'class="accent"')+line(...f(g.C),...f(g.X),'class="guide"')+right(f(g.P),f(g.C),f(g.X));
 for(const[n,dx,dy]of[['A',16,-8],['B',-50,24],['C',12,25],['P',-30,-15],['X',-28,12]])s+=dot(...f(g[n]))+label(f(g[n])[0]+dx,f(g[n])[1]+dy,n);
 s+=math(524,147,[rm('(5, 5)')])+math(116,448,[rm('(−1, −3)')])+math(415,298,[rm('(2, 1)')])+math(310,204,[rm('5')]);
 s+=text(74,484,'CP ⟂ 接線。接線上のXがPと一致するとき距離が最小。');
 return s;
}
export function tetrahedron(){
 const f=([x,y])=>[84+98*x,350-98*y];
 let s=text(32,38,'底面：垂線OHを引く');
 s+=poly(['O','A','B','O'].map(n=>f(tetra[n])))+line(...f(tetra.O),...f(tetra.H),'class="accent"')+right(f(tetra.H),f(tetra.O),f(tetra.A));
 for(const[n,dx,dy]of[['O',-24,28],['A',10,25],['B',-15,-17],['H',12,-5]])s+=dot(...f(tetra[n]))+label(f(tetra[n])[0]+dx,f(tetra[n])[1]+dy,n);
 s+=math(158,386,[rm('2√2')])+math(65,225,[rm('√5')])+math(300,247,[rm('3')])+math(160,298,[rm('2')]);
 s+=text(45,435,'AB = 3、OH = 2 より底面積は3。');
 s+=line(407,70,407,464,'class="guide"')+text(434,38,'立体：底面への高さCSを求める');
 const p=([x,y,z])=>[450+98*x+34*y,340-29*y-110*z];
 s+=poly(['O','A','B','O'].map(n=>p(tetra[n])),'fill="#edf3f7"');
 for(const n of ['O','A','B'])s+=line(...p(tetra.C),...p(tetra[n]));
 s+=line(...p(tetra.C),...p(tetra.S),'class="accent"')+line(...p(tetra.S),...p(tetra.T),'class="guide"')+line(...p(tetra.C),...p(tetra.T),'class="guide"');
 s+=right(p(tetra.S),p(tetra.C),p(tetra.A),10);
 for(const[n,dx,dy]of[['O',-20,24],['A',10,22],['B',-20,-12],['C',3,-20],['S',18,-8],['T',-10,28]])s+=dot(...p(tetra[n]))+label(p(tetra[n])[0]+dx,p(tetra[n])[1]+dy,n);
 s+=math(655,200,[rm('2')])+text(440,402,'SはAB上、TはOA上の補助点。')+text(440,435,'CS ⟂ 底面OAB。立体は平行投影。');
 return s;
}
export function tangentCircles(){
 const f=([x,y])=>[58+36*x,490-36*y],g=tangency,h=[g.Q[0],2];
 let s=poly([f(g.O1),f(h),f(g.O2),f(g.O1)],'fill="#edf3f7" stroke="none"');
 for(const[n,r]of[['O1',2],['O2',6]])s+=`<circle cx="${f(g[n])[0]}" cy="${f(g[n])[1]}" r="${36*r}"/>`;
 s+=line(...f([-.5,0]),...f([17.3,0]))+line(...f(g.R),...f([13,13/root(3)]),'class="guide"');
 for(const[a,b]of[['O1','P'],['O2','Q']])s+=line(...f(g[a]),...f(g[b]));
 s+=line(...f(g.O1),...f(h),'class="guide"')+right(f(h),f(g.O1),f(g.O2));
 s+=right(f(g.P),f(g.O1),f(g.Q))+right(f(g.Q),f(g.O2),f(g.P));
 for(const[n,dx,dy]of[['R',-6,30],['P',-10,30],['Q',-10,30]])s+=dot(...f(g[n]))+label(f(g[n])[0]+dx,f(g[n])[1]+dy,n);
 for(const[n,k,dx,dy]of[['O1','1',-29,-8],['O2','2',15,-6]])s+=dot(...f(g[n]))+math(f(g[n])[0]+dx,f(g[n])[1]+dy,[mi('O'),sub(k)]);
 s+=line(670,274,670,490,'class="axis"')+line(664,274,676,274,'class="axis"')+line(664,490,676,490,'class="axis"');
 s+=math(148,461,[rm('2')])+math(682,390,[rm('6')])+math(292,325,[rm('8')])+math(448,347,[rm('4')]);
 s+=label(680,476,'ℓ')+text(49,560,'異なる接点P・Qをもつ共通外接線を考えます。')+text(49,591,'青の直角三角形でPQを求め、△RPO₁と△RQO₂の相似を使います。');
 return s;
}
export function circleTriangle(){
 const f=([x,y])=>[340+150*x,262-150*(y+.5)],g=circle;
 let s=`<circle cx="340" cy="262" r="${150*g.radius}"/>`;
 s+=poly([g.A,g.B,g.P,g.A].map(f),'fill="#edf3f7"');
 s+=line(...f(g.A),...f(g.P),'class="accent"')+right(f(g.B),f(g.A),f(g.P));
 for(const[n,dx,dy]of[['A',3,35],['B',17,2],['P',-20,-25],['D',-39,3]])s+=dot(...f(g[n]))+label(f(g[n])[0]+dx,f(g[n])[1]+dy,n);
 s+=math(403,459,[rm('(1/5, −8/5)')])+math(553,190,[rm('(1, 0)')])+math(330,71,[rm('(−1/5, 3/5)')]);
 s+=text(54,512,'Dは円の中心。AとPは直径の両端なので、∠ABPは直角。');
 return s;
}
export function supplement(){const M=s=>`\\(${s}\\)`;return {schemaVersion:'lexus-answer-supplement.v1',packageId,sourceSha256:learnerSha,contentProvenance:'original_editorial',restrictedSourceCopied:false,review:{needsHumanReview:true,notes:'整数の奇約数と1・2の順序列を条件から独立列挙。元の導出不足は修復依頼へ分離。'},operations:[
 {type:'insert-after',expectedMatches:1,anchor:{type:'formula',major_question_id:'major-question-02',latex:'(2x-9)(y+2)=18'},blocks:[{type:'prose',major_question_id:'major-question-02',text:M('d=2x-9')+'は18の奇数の約数です。正負を含む6個の候補について、'+M('x=(d+9)/2,\\ y=18/d-2')+'から対応する整数を求めます。'},{type:'table',major_question_id:'major-question-02',caption:'奇数の約数と整数解の対応',headers:[M('d'),M('y+2'),M('x'),M('y')],rows:integerPairs().map(({d,x,y})=>[d,y+2,x,y].map(n=>M(String(n))))}]},
 {type:'insert-after',expectedMatches:1,anchor:{type:'formula',major_question_id:'major-question-04',latex:'a_5=8'},blocks:[{type:'prose',major_question_id:'major-question-04',text:'2個食べる回数で分けると、重複も数え漏れもなく確認できます。並びは左から食べる順です。'},{type:'table',major_question_id:'major-question-04',caption:'合計5個を食べる順序の確認',headers:['2個食べる回数','食べる順序','通り数'],rows:[0,1,2].map(k=>{const seq=eatingWays(5).filter(a=>a.filter(x=>x===2).length===k);return [String(k),seq.map(a=>`(${a.join(', ')})`).join(' ／ '),String(seq.length)];})}]}
 ]};}
export function build(){const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('a2-tangent-circle',730,520,'ABを直径とする半径5の円。中心CからPでの接線に下ろした垂線がCP。接線上のXまでの距離はCP以上。','内積条件を円と接線で読む',tangentCircle());
 pack.add('a2-tetrahedron',850,480,'4面が合同な四面体OABC。左は底面OABと垂線OH、右は補助点S・Tと高さCS。底面積3、高さ2。立体は平行投影。','底面積と高さを分けて考える',tetrahedron());
 pack.add('a2-tangent-circles',750,620,'半径2と6の外接する2円と、異なる接点P・Qをもつ共通外接線。Rは接線と中心線の交点。中心間8、半径差4の直角三角形を示す。','三平方の定理と接線上の相似',tangentCircles());
 pack.add('a3-circle-triangle',750,540,'t=1の円の中心Dは(0,−1/2)。共通点A(1/5,−8/5)、B(1,0)と、Aの対蹠点P(−1/5,3/5)を結ぶ。APが直径で角ABPは直角。','直径と円周角から面積へ',circleTriangle());
 pack.save('条件から独立座標計算。円の接線・全6辺・高さ・直角・面積を回帰検証。原本cropの転用なし。円の共通点の係数誤記は元HTML修復待ち。');
 fs.writeFileSync(new URL(`../src/data/pastExamBatch/answer-supplements/${packageId}.json`,import.meta.url),JSON.stringify(supplement(),null,2)+'\n');}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))build();
