import test from 'node:test';
import assert from 'node:assert/strict';
import {openUpstreamIssues,upstreamIssueText} from './lib/past-exam-upstream-issues.mjs';
test('Both upstream issue schemas retain unresolved entries without duplicate IDs',()=>{
 const open={id:'one',status:'open',needed_action:'確認する'};
 const done={id:'two',status:'resolved'};
 assert.deepEqual(openUpstreamIssues({items:[open,done]}),[open]);
 assert.deepEqual(openUpstreamIssues({issues:[open,done]}),[open]);
 assert.deepEqual(openUpstreamIssues({items:[open],issues:[open,done]}),[open]);
 assert.deepEqual(openUpstreamIssues([open,done]),[open]);
 assert.equal(upstreamIssueText(open),'確認する');
});
