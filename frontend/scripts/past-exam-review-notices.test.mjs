import test from 'node:test';
import assert from 'node:assert/strict';
import {withReviewNotice} from '../src/lib/pastExamReviewNotices.mjs';
const original='<article id="major-question-04"><h2>第4問</h2><p>Original formula stays unchanged.</p></article>';
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
