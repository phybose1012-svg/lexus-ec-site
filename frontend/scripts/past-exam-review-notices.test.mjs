import test from 'node:test';
import assert from 'node:assert/strict';
import {withReviewNotice} from '../src/lib/pastExamReviewNotices.mjs';
const original='<article id="major-question-04"><h2>第4問</h2><p>Original formula stays unchanged.</p></article>';
test('Fukuoka gates only the beat-period notation and rebound-magnitude inconsistency',()=>{
 const id='fukuoka-2025-general-keitobetsu-physics';
 assert.match(withReviewNotice(original,id,'major-question-01'),/うなりの振動数/);
 assert.match(withReviewNotice(original,id,'major-question-03'),/反発係数の範囲/);
 assert.equal(withReviewNotice(original,id,'major-question-02'),original);
});
test('Known source mismatch notice appears inside its heading anchor without replacing source content',()=>{
 const html=withReviewNotice(original,'dokkyo-medical-2025-general-early-physics','major-question-04');
 assert.match(html,/<\/h2><aside[^>]+data-source-review="required"/);
 assert.match(html,/演習・採点の対象外/);
 assert.equal(html.replace(/<aside[\s\S]*?<\/aside>/,''),original);
});
test('Source notices never leak into another university or major question',()=>{
 assert.equal(withReviewNotice(original,'iwate-medical-2025-general-physics','major-question-04'),original);
 assert.equal(withReviewNotice(original,'dokkyo-medical-2025-general-early-physics','major-question-01'),original);
});
test('Fujita explanation gate names the affected subquestions without changing question conditions',()=>{
 const body='<article id="major-question-01"><h2>第1問</h2><p>Original formula stays unchanged.</p></article>';
 const html=withReviewNotice(body,'fujita-health-2025-general-early-mathematics','major-question-01');
 assert.match(html,/\(1\).*\(2\).*\(8\)/);
 assert.match(html,/問題条件・解答値の変更ではありません/);
 assert.equal(html.replace(/<aside[\s\S]*?<\/aside>/,''),body);
 assert.equal(withReviewNotice(original,'fujita-health-2025-general-early-mathematics','major-question-02'),original);
});
test('Fujita physics distinguishes mathematical plotting from physical highest-point applicability',()=>{
 const result=withReviewNotice(original,'fujita-health-2025-general-early-physics','major-question-04');
 assert.match(result,/数式のグラフ/);assert.match(result,/学習者向けHTMLから抜けています/);assert.match(result,/再衝突/);
 assert.equal(result.replace(/<aside[\s\S]*?<\/aside>/,''),original);
});
