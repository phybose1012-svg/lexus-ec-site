import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {verifyAsahikawaikaReadable} from './verify-asahikawaika-readable.mjs';
import {renderUniversityAdmissions,applyUniversityAdmissionsFromIndex} from '../src/lib/universityAdmissions.ts';
const data=JSON.parse(fs.readFileSync(new URL('../src/data/universityAdmissions/asahikawaika.json',import.meta.url),'utf8'));
const raw=JSON.parse(fs.readFileSync(new URL('../src/data/generated/admissionInfoPosts.json',import.meta.url),'utf8'));
test('all four Asahikawa routes preserve 102 facts and shared source mappings',()=>{
 const html=renderUniversityAdmissions(data);assert.equal(verifyAsahikawaikaReadable(html).facts,102);
 for(const [before,after]of [['17:00必着','17:00'],['両方を満たす','いずれかを満たす'],['免除・徴収猶予',''],['当該学校推薦型選抜受験者の中央値以上','全国受験者の中央値以上'],['2025年度の成績','2024年度の成績']])assert.throws(()=>verifyAsahikawaikaReadable(html.replaceAll(before,after)));
 assert.throws(()=>verifyAsahikawaikaReadable(html.replace('2026年度から廃止','廃止')));
});
test('each special selection retains its distinct point scale and timing',()=>{
 const modified=structuredClone(data);modified.schemes[2].examRows[6].value=modified.schemes[2].examRows[6].value.replace('200点','300点');assert.throws(()=>renderUniversityAdmissions(modified),/total differs/u);
 const html=renderUniversityAdmissions(data);for(const term of ['13:20','9:45～11:45','9:00まで','17:00まで','学長が了承'])assert.throws(()=>verifyAsahikawaikaReadable(html.replaceAll(term,'')));
});
test('shared quotas and the foreign total map to one condition or total cell without losing exclusions',()=>{
 const html=renderUniversityAdmissions(data),proof=verifyAsahikawaikaReadable(html);
 for(const id of ['general-first/exam/0','international-private/exam/0'])assert.equal(proof.mappings.find(m=>m.id===id).action,'merge-shared-quota-condition');
 assert.equal(proof.mappings.find(m=>m.id==='international-private/exam/6').action,'split-score-condition-and-total-table');
 assert.doesNotMatch(html,/個別試験等の合計は350点。/u);
 for(const term of ['48名に含まれます','特別選抜の欠員は前期日程に加算されます','基礎学力の試問を含む','科目別成績が一般選抜受験者の平均を下回る場合','面接評価が著しく低い場合'])assert.throws(()=>verifyAsahikawaikaReadable(html.replaceAll(term,'')));
 assert.throws(()=>verifyAsahikawaikaReadable(html.replace('data-admission-derived-total data-admission-value>350点','data-admission-derived-total data-admission-value>300点')));
 const modified=structuredClone(data);modified.schemes[3].examRows[4].value=modified.schemes[3].examRows[4].value.replace('150点','200点');assert.throws(()=>renderUniversityAdmissions(modified),/international total differs/u);
});
test('venue guidance addresses readers while preserving publication and ticket conditions',()=>{
 const html=renderUniversityAdmissions(data);verifyAsahikawaikaReadable(html);
 assert.doesNotMatch(html,/確認する。|入場する。|持参する。/u);
 for(const term of ['詳細は募集要項の公開後に更新します','受験票の指定をご確認ください','受験票をご確認ください','徒歩順路で入場してください','A4用紙に片面印刷して持参してください'])assert.ok(html.includes(term));
});
test('Asahikawa replaces old body and metadata and is idempotent for production input',()=>{
 const index=new Map([[data.path,data]]),original=raw.find(p=>p.path===data.path),after=applyUniversityAdmissionsFromIndex(original,index);
 const production={...original,categories:['大学別入試情報','国公立医学部','不明'],infoItems:original.infoItems.map(e=>e.label==='地域'?{...e,value:'要確認'}:e.label==='種別'?{...e,value:'大学概要・公式入試情報'}:e)};
 assert.deepEqual(applyUniversityAdmissionsFromIndex(production,index),after);assert.deepEqual(applyUniversityAdmissionsFromIndex(after,index),after);
 assert.deepEqual(after.categories,['大学別入試情報','大学別基本情報','国公立医学部','北海道']);assert.equal(after.infoItems.find(e=>e.label==='種別').value,'入試情報');assert.equal(after.infoItems.find(e=>e.label==='地域').value,'北海道');
 verifyAsahikawaikaReadable(after.contentHtml);assert.doesNotMatch(after.contentHtml,/078-8802|2024年度|2025年度の入試情報|医大病院真枝/u);
 for(const p of raw.filter(p=>p.path!==data.path))assert.equal(applyUniversityAdmissionsFromIndex(p,index),p);
 const altered=structuredClone(data);altered.schemes[0].notes[3].text='<script>alert("x")</script>';assert.ok(renderUniversityAdmissions(altered).includes('&lt;script&gt;'));
});
