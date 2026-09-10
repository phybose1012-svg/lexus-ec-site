import test from 'node:test';
import assert from 'node:assert/strict';
import {ensureMajorQuestionHeading} from '../src/lib/pastExamHeadings.mjs';
test('Missing reader heading is restored from metadata without changing question content',()=>{
 const a='<article data-major-question-id="major-question-04"><p>unchanged</p></article>';
 assert.equal(ensureMajorQuestionHeading(a,'第4問'),a.replace('><p>','><h2>第4問</h2><p>'));
 const restored=ensureMajorQuestionHeading(a,'第4問');assert.equal(ensureMajorQuestionHeading(restored,'different'),restored);
});
test('Heading fallback requires metadata and an article, and escapes labels',()=>{
 const a='<article data-major-question-id="major-question-04"></article>';
 assert.throws(()=>ensureMajorQuestionHeading(a,''));assert.throws(()=>ensureMajorQuestionHeading('<p>x</p>','第4問'));
 assert.match(ensureMajorQuestionHeading(a,'a<b & c'),/<h2>a&lt;b &amp; c<\/h2>/);
});
