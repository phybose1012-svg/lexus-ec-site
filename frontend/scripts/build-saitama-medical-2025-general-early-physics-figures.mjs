import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createSvgPackage, math, mi, rm, sub, text, line, dot, pointsPath} from './lib/past-exam-svg-author.mjs';

export const packageId='saitama-medical-2025-general-early-physics';
const mid='text-anchor="middle"', arrow='marker-end="url(#arrow)"';
const M=(x,y,v,e='')=>math(x,y,[mi(v)],e);
const L=(x,y,v,e='')=>math(x,y,[rm(v)],e);
const ix=(x,y,v,i,e='')=>math(x,y,[mi(v),sub(i)],e);
const arc=(x,y,r,a,b)=>`<path d="${pointsPath(Array.from({length:81},(_,i)=>[x+r*Math.sin(a+(b-a)*i/80),y+r*Math.cos(a+(b-a)*i/80)]))}"/>`;

// Physical coordinates: B=(0,0), O=(0,r), theta measured from OB.
export const pointOnCylinder=(theta,r=1)=>[r*Math.sin(theta),r*(1-Math.cos(theta))];
export function departure(r=1,g=1){
 const theta=2*Math.PI/3, [x,y]=pointOnCylinder(theta,r),v=Math.sqrt(g*r/2);
 const vx=v*Math.cos(theta),vy=v*Math.sin(theta);
 const t=(vy+Math.sqrt(vy*vy+2*g*y))/g;
 return {x,y,v,vx,vy,t,landing:x+vx*t,maximumHeight:y+vy*vy/(2*g),floorSpeed:Math.sqrt(7*g*r/2)};
}
export const thermodynamics=()=>({pressureII:2**(5/3),massII:2**(5/3)-1,energyII:1.5*(2**(2/3)-1),handWork:3*2**(-1/3)-2,massIII:5,temperatureIII:3,temperatureIV:3*2**(-2/3)});
export function electricMotion(){const mass=1e-10,charge=4e-8,E=[-3,-4],initial=[.003,-.001];const a=E.map(v=>charge*v/mass),potential=3*initial[0]+4*initial[1],time=Math.sqrt(2*potential/(-(3*a[0]+4*a[1])));return{potential,energy:charge*potential,time,velocity:a.map(v=>v*time),position:initial.map((v,i)=>v+.5*a[i]*time*time),impulse:a.map(v=>mass*v*time)};}

function cylinder(){
 const x=460,y=255,r=175,theta=2*Math.PI/3,C=[x+r*Math.sin(theta),y+r*Math.cos(theta)];
 let s=line(65,430,460,430)+line(65,210,65,430)+arc(x,y,r,0,Math.PI);
 for(let k=0;k<9;k++)s+=line(65,230+k*23,48,245+k*23);
 s+=line(x,y-r,x,y+r,'class="guide"')+line(x,y,...C,'class="guide"')+arc(x,y,64,0,theta);
 s+=dot(x,y)+dot(x,y-r)+dot(x,y+r)+dot(...C);
 s+=L(65,466,'A',mid)+L(x,466,'B',mid)+L(x,y-r-23,'D',mid)+L(C[0]+22,C[1]+5,'C')+L(x-27,y+8,'O');
 s+=M(550,185,'r')+L(539,300,'120°');
 s+=`<circle cx="220" cy="422" r="8" fill="#18334c"/>`+M(218,395,'a',mid)+line(257,408,337,408,arrow);
 return s+text(380,511,'図1　床・壁と半円筒面の断面（模式図）',mid);
}

const halfVolume=(x,y)=>ix(x,y-20,'V','0',mid)+line(x-24,y-3,x+24,y-3)+L(x,y+27,'2',mid);
export const pistonTop=compressed=>compressed?258:154;
export const thermalLayerY=compressed=>pistonTop(compressed)+7;
function piston(x,compressed,{mass,thermal=false}={}){
 const bottom=374,top=pistonTop(compressed),w=150;
 let s=`<rect x="${x}" y="${top+12}" width="${w}" height="${bottom-top-12}" fill="#edf3f7" stroke="none"/>`;
 s+=line(x,94,x,bottom)+line(x,bottom,x+w,bottom)+line(x+w,bottom,x+w,94);
 s+=`<rect x="${x}" y="${top}" width="${w}" height="12" fill="#d6e0e7"/>`;
 if(mass){s+=`<rect x="${x+42}" y="${top-35}" width="66" height="35" rx="2" fill="#f8f4eb"/>`+M(x+75,top-48,mass,mid);}
 else s+=ix(x+75,125,'p','a',mid);
 s+=compressed?halfVolume(x+75,321):ix(x+75,254,'V','0',mid)+ix(x+75,303,'T','0',mid);
 if(thermal)s+=`<rect x="${x}" y="${thermalLayerY(compressed)}" width="${w}" height="5" fill="#d9b76a" stroke="#98752e"/>`+line(x+130,top+12,x+177,top+35)+text(x+164,top+60,'熱を通す素材')+ix(x+w+45,110,'p','a',mid);
 return s;
}
function statesII(){return piston(135,false)+piston(515,true,{mass:'M'})+text(210,427,'図1　状態Ⅰ',mid)+text(590,427,'図2　状態Ⅱ',mid)+text(400,476,'ゆっくり圧縮した後、おもりで静止させる',mid);}
function statesIII(){return piston(135,false,{mass:'M′',thermal:true})+piston(515,true,{mass:'M′',thermal:true})+text(210,432,'図3　おもりをのせた瞬間',mid)+text(590,432,'図4　静止した状態Ⅲ',mid);}

export function build(){const pack=createSvgPackage(packageId,import.meta.url);
 pack.add('q1-half-cylinder',760,540,'床ABの左端Aに壁、右端BからDまで半径rの半円筒面。中心O、角BOCは120度。小物体aは床から右へ進む。離脱速度や軌道などの解答は示さない。','第1問 図1　半円筒面内の運動。',cylinder());
 pack.add('q2-states-i-ii',800,510,'状態Ⅰは体積V0・温度T0で大気圧paとつり合う。ゆっくり圧縮した状態Ⅱは体積V0/2で質量Mのおもりを載せて静止する。断面積一定の模式図。','第2問 図1・2　状態Ⅰと状態Ⅱ。',statesII());
 pack.add('q2-states-i-iii',800,470,'ピストンの底面に熱を通す素材を貼り付ける。左は体積V0・温度T0の気体に質量M′のおもりを載せた瞬間、右は体積V0/2で静止した状態Ⅲ。素材はピストンと共に動き、左を力のつり合う状態とは扱わない。','第2問 図3・4　急におもりを載せた後の変化。',statesIII());
 return pack.save('問題9ページ・解答5ページを確認し、本文の条件から独立に3図を生成。元cropの転用なし。元HTMLの選択肢の指数・個数と分析の前問依存は修復待ち。問題図に未知の温度・質量・軌道の解答を入れない。権利・人間承認は未完了。');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))build();
