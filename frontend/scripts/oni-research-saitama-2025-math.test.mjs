import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const article = JSON.parse(readFileSync(new URL('../src/data/oniResearch/saitama-medical-2025-early-mathematics.json', import.meta.url), 'utf8'));
const near = (a, b, eps = 1e-10) => assert.ok(Math.abs(a-b) < eps, `${a} != ${b}`);
const d = (k) => (10 + 20*k)/(1 + k*k);
const distance2 = (s,k) => (10-s)**2 + (20-k*s)**2;
const choose = (n,k) => { let out=1; for(let i=1;i<=k;i++) out=out*(n-i+1)/i; return out; };

test('全10小問に問題・解答・段階的解説・学力別判断・撤退条件がある', () => {
  assert.equal(article.questions.length,10);
  assert.equal(new Set(article.questions.map(q=>q.id)).size,10);
  for(const q of article.questions){
    assert.ok(q.problem.length && q.answer.length && q.steps.length>=2,q.id);
    for(const key of ['weak','strong','retreat','dependencies']) assert.ok(q.judgment[key].length>10,`${q.id}: ${key}`);
    assert.ok(q.mistake && q.review);
  }
  assert.equal(article.restrictedSourceCopied,false);
  assert.equal(article.status,'staging_review');
});

test('39欄に欠番・重複がなく、原本で印刷済みの負号と20番の数字を区別する', () => {
  const slots=article.questions.flatMap(q=>q.slots);
  assert.deepEqual(slots.map(s=>s.number),Array.from({length:39},(_,i)=>i+1));
  assert.ok(slots.every(s=>/^[0-9−]$/.test(s.value)));
  assert.equal(slots[19].value,'1');
  assert.equal(slots[22].value,'−');
  const originalKey=['2','3','2','3','2','1','2','1','5','5','2','7','1','0','1','0','2','2','1','1','5','2','−','1','3','2','3','2','3','3','3','1','0','0','1','6','1','2','3'];
  assert.deepEqual(slots.map(s=>s.value),originalKey);
});

test('第1問：停留点・最小値と、中心まわりの回転を独立計算', () => {
  const x=Math.log(3)/2, value=(t)=>Math.exp(t)+3*Math.exp(-t);
  near(value(x),2*Math.sqrt(3));
  near(Math.exp(x)-3*Math.exp(-x),0);
  for(let t=-5;t<=5;t+=.025) assert.ok(value(t)>=value(x)-1e-12);
  const [ax,ay]=[2,1], [bx,by]=[1,-2], c=Math.SQRT1_2, s=c;
  const zx=bx+(ax-bx)*c-(ay-by)*s;
  const zy=by+(ax-bx)*s+(ay-by)*c;
  near(zx,1-Math.sqrt(2));near(zy,2*(Math.sqrt(2)-1));
  near((zx-bx)**2+(zy-by)**2,(ax-bx)**2+(ay-by)**2);
});

test('第2問：最接近を射影の式で確認し、最適速度比を検算', () => {
  near(d(1),15);near(distance2(d(1),1),50);
  near(d(3),7);near(distance2(d(3),3),10);
  for(const k of [.1,.5,1,3,10]){
    const nearest=d(k);
    assert.ok(nearest>0);
    assert.ok(distance2(nearest,k)<distance2(nearest+.2,k));
    if(nearest>.2) assert.ok(distance2(nearest,k)<distance2(nearest-.2,k));
  }
  const k0=(Math.sqrt(5)-1)/2;
  near(k0*k0+k0-1,0);
  const derivative=k=>-2*(k*k+k-1)/(1+k*k)**2;
  assert.ok(derivative(k0-.1)>0 && derivative(k0+.1)<0);
  for(let k=.005;k<=100;k+=.005) assert.ok(d(k)<=d(k0)+1e-10);
});

test('第3問：円・直交・面積比・鈍角・PTの長さを座標から独立検算', () => {
  const t=Math.sqrt(3), P=[2*t/(1+t*t),(t*t-1)/(1+t*t)];
  const B=[0,1],C=[0,-1],Q=[1/t,0],S=[t,0],A=[1,0],T=[1,1-1/t];
  const vector=(a,b)=>b.map((v,i)=>v-a[i]);
  const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
  const norm=a=>Math.hypot(...a);
  const area=(a,b,c)=>Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))/2;
  near(P[0]**2+P[1]**2,1);
  near(dot(vector(P,B),vector(P,C)),0);
  near(area(P,B,C)/area(P,Q,S),3);
  near(Math.acos(dot(vector(T,A),vector(T,P))/(norm(vector(T,A))*norm(vector(T,P)))),2*Math.PI/3);
  near(norm(vector(P,T)),(2*Math.sqrt(3)-3)/3);
  assert.ok(B[0]<P[0] && P[0]<T[0] && T[0]<S[0]);
});

test('第4問：全ての非負整数解を列挙して仕切り法と照合', () => {
  const byA=Array(11).fill(0);
  for(let a=0;a<=10;a++) for(let b=0;b<=10-a;b++) for(let c=0;c<=10-a-b;c++) for(let d=0;d<=10-a-b-c;d++) byA[a]++;
  assert.equal(byA.reduce((s,n)=>s+n,0),1001);
  assert.equal(choose(14,4),1001);
  byA.forEach((count,k)=>{near(count,choose(13-k,3));near(count,(11-k)*(12-k)*(13-k)/6);});
  assert.equal(byA[10],1);
});
