import test from 'node:test';import assert from 'node:assert/strict';import {verifyRyukyuReadable,verifyRyukyuTransforms} from './verify-ryukyu-readable.mjs';
const html=verifyRyukyuTransforms().contentHtml;
test('All original facts, sources, statuses and main/raw transforms survive',()=>assert.equal(verifyRyukyuReadable(html).facts,61));
for(const [label,before,after]of [
 ['Required arrival differs','17:00必着','17:00消印有効'],
 ['Recommendation interview collection differs','集合12:40','集合13:40'],
 ['Recommendation fee differs','17,000円','7,000円'],
 ['Reading/listening exception omitted','リスニング0点','リスニング満点'],
 ['Regional AND condition lost','宜野座村','那覇市'],
 ['Main total corrupted','1,800点','1,700点'],
 ['Score scope corrupted','平面上の曲線と複素数平面','複素数のみ'],
 ['Graduation period lost','2年以内','3年以内'],
 ['Combined geography choice corrupted','から2つを選択解答','から1つを選択解答'],
 ['Late arrival condition corrupted','30分を超えて遅刻','60分を超えて遅刻'],
 ['Entrant denominator corrupted','全選抜・110人','全選抜・111人'],
 ['Unknown detail invented','支払期間・金額・締切時刻は未公表','支払期間・金額・締切時刻は公表済'],
 ['Inline external source added','<td>200点</td>','<td>200点<a href="https://www.u-ryukyu.ac.jp/">資料1</a></td>'],
 ])test(label,()=>{assert.ok(html.includes(before));assert.throws(()=>verifyRyukyuReadable(html.replace(before,after)));});
