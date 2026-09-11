import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage,math,mi,rm,text,line,dot,pointsPath} from './lib/past-exam-svg-author.mjs';
export const packageId='kitasato-2025-general-mathematics';
export const f=x=>2*x-Math.sqrt(Math.max(0,1-x*x));
export const derivative=x=>2+x/Math.sqrt(1-x*x);
export const critical=-2/Math.sqrt(5),zero=1/Math.sqrt(5);
export const curvePoints=()=>Array.from({length:321},(_,i)=>{const t=-Math.PI/2+Math.PI*i/320;return [Math.sin(t),2*Math.sin(t)-Math.cos(t)];});
export function probabilityCases(){
  const cases=new Map(),A=[0,1,2,3],B=[3,3,4,5];
  for(const a of A)for(const b of (a===3?B:A))for(const c of (b===3?B:A)){
    if(a+b+c===8){const key=[a,b,c].join(',');cases.set(key,(cases.get(key)??0)+1);}
  }
  return [...cases].map(([key,count])=>({values:key.split(',').map(Number),count}));
}
const M=s=>`\\(${s}\\)`;
export function answerSupplement(){
  const first='major-question-01',second='major-question-02';
  return {schemaVersion:'lexus-answer-supplement.v1',packageId,sourceSha256:'ca6f4f25570f9faa3f5c0cc2a905ea03399b025f803ad6a996b1af939006a343',contentProvenance:'original_editorial',restrictedSourceCopied:false,review:{needsHumanReview:true,notes:'問題のカード64経路と導関数から独立に構成したHTML表。原本の表画像・文章は複製しない。元HTMLの説明補足と権利レビューは未完了。'},operations:[
    {type:'insert-after',expectedMatches:1,anchor:{major_question_id:first,type:'prose',text:'3回の和が8になる並びを、2回目に3を引く場合と1回目に3を引く場合に分けます。'},blocks:[
      {type:'prose',major_question_id:first,text:'どちらの箱もカードは4枚です。数字ではなくカードを区別すれば、3回の経路は64通りで等確率です。箱Bの「3」は2枚あるため、数字の並びが同じでも経路は2通りになる場合があります。'},
      {type:'table',major_question_id:first,caption:'和が8になる5種類の並び',headers:['1回目','2回目','3回目','カードの経路数','確率'],rows:probabilityCases().map(c=>[...c.values.map(x=>M(String(x))),String(c.count),M(`\\dfrac{${c.count}}{64}`)])},
      {type:'prose',major_question_id:first,text:'該当する経路は1＋1＋2＋1＋1＝6通りです。表の確率を合計すると、次の値になります。'},
    ]},
    {type:'insert-after',expectedMatches:1,anchor:{major_question_id:second,type:'formula',latex:"f'(x)=0\\Longrightarrow x=-\\frac2{\\sqrt5}"},blocks:[
      {type:'prose',major_question_id:second,text:'導関数の符号と、端点・停留点での関数値をまとめます。両端では導関数の値を置かず、斜線で示します。'},
      {type:'table',major_question_id:second,caption:'増減表',headers:[M('x'),M('-1'),'…',M('-\\frac2{\\sqrt5}'),'…',M('1')],rows:[[M("f'(x)"),'[[no-value]]',M('-'),M('0'),M('+'),'[[no-value]]'],[M('f(x)'),M('-2'),'↘',M('-\\sqrt5'),'↗',M('2')]]},
    ]},
  ]};
}
function graph(){
  const P=(x,y)=>[330+205*x,275-95*y],center='text-anchor="middle"';
  const c=curvePoints(),right=c.slice(160),region=[P(0,1),P(1,2),...right.slice().reverse().map(([x,y])=>P(x,y))];
  let s=`<path data-region="S" d="${pointsPath(region)} Z" fill="#e4edf3" stroke="none"/>`;
  s+=line(...P(-1.22,0),...P(1.45,0),'class="axis" marker-end="url(#arrow)"')+line(...P(0,-2.5),...P(0,2.45),'class="axis" marker-end="url(#arrow)"');
  s+=line(...P(-1,-2),...P(0,-2),'class="guide"')+line(...P(1,2),...P(1,0),'class="guide"')+line(...P(1,2),...P(0,2),'class="guide"');
  s+=`<path data-function="f" d="${pointsPath(c.map(([x,y])=>P(x,y)))}" stroke-width="2.6"/>`;
  s+=line(...P(-.08,.92),...P(1.18,2.18),'class="accent" data-function="line"');
  for(const [x,y] of [[-1,-2],[1,2],[critical,-Math.sqrt(5)],[zero,0],[0,-1]])s+=dot(...P(x,y));
  s+=math(635,281,[mi('x')])+math(343,42,[mi('y')]);
  s+=math(309,301,[mi('O')],center)+math(...[P(-1,0)[0],301],[rm('−1')],center)+math(P(1,0)[0],301,[rm('1')],center);
  for(const [y,label] of [[2,'2'],[1,'1'],[-1,'−1'],[-2,'−2']])s+=math(310,P(0,y)[1]+8,[rm(label)],'text-anchor="end"');
  s+=line(...P(zero,0),454,308,'class="guide"')+math(463,330,[rm('1/√5')])+math(420,202,[mi('S')],center);
  s+=math(566,63,[mi('y'),rm(' = '),mi('x'),rm(' + 1')]);
  s+=line(...P(critical,-Math.sqrt(5)),198,529,'class="guide"')+math(214,557,[rm('(−2/√5, −√5)')]);
  s+=text(214,584,'最小点');
  s+=math(42,51,[mi('y'),rm(' = 2'),mi('x'),rm(' − √(1 − '),mi('x'),rm('²)')]);
  return s;
}
export function build(){
  const pack=createSvgPackage(packageId,import.meta.url);
  pack.add('ans-q2-function-graph',740,620,'関数y=2x−√(1−x²)の定義域は−1から1。最小点は(−2/√5,−√5)、端点は(−1,−2)と(1,2)。直線y=x+1とy軸、曲線で囲まれる領域Sを青く示す。','関数の概形と、問(2)の面積S。',graph());
  const dir=new URL('../src/data/pastExamBatch/answer-supplements/',import.meta.url);fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(new URL(`${packageId}.json`,dir),JSON.stringify(answerSupplement(),null,2)+'\n');
  return pack.save('関数の条件から独立計算。増減表と確率の表は別の意味的HTML。元HTMLの途中式・条件の説明は修復待ち。権利・人間レビュー未承認。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))build();
