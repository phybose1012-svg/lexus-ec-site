import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {verifyAkitaReadable} from './verify-akita-readable.mjs';import {renderUniversityAdmissions,applyUniversityAdmissionsFromIndex} from '../src/lib/universityAdmissions.ts';
const data=JSON.parse(fs.readFileSync(new URL('../src/data/universityAdmissions/akita.json',import.meta.url),'utf8'));
const raw=JSON.parse(fs.readFileSync(new URL('../src/data/generated/admissionInfoPosts.json',import.meta.url),'utf8'));
test('all seven Akita routes preserve every fact, shared source mapping and publication state',()=>{
 const html=renderUniversityAdmissions(data);assert.equal(verifyAkitaReadable(html).facts,189);
 for(const [before,after]of [['17:00必着','17:00'],['第1解答科目','第2解答科目'],['12月14日（月）以前','12月15日（火）以前'],['両方の基準','いずれかの基準'],['自筆記名','記名'],['少なくとも5年間','4年間'],['猶予期間を設けても',''],['学長が許可','本人が希望'],['面接評価が「不可」','面接評価が低い'],['2026年度以前','2025年度以前']])assert.throws(()=>verifyAkitaReadable(html.replaceAll(before,after)));
});
test('distinct common and individual scores cannot be silently changed',()=>{
 for(const [route,row] of [[0,4],[1,6],[2,5],[3,11],[5,12]]){const modified=structuredClone(data);modified.schemes[route].examRows[row].value=modified.schemes[route].examRows[row].value.replace(/^\d+点/u,'999点');assert.throws(()=>renderUniversityAdmissions(modified));}
 const html=renderUniversityAdmissions(data);assert.throws(()=>verifyAkitaReadable(html.replaceAll('各75点','各50点')));
});
test('every varying condition identifies its route in visible text while shared recommendation conditions appear once',()=>{
 const html=renderUniversityAdmissions(data);verifyAkitaReadable(html);
 for(const label of ['後期（一般枠）：数学の換算','前期・後期（秋田県地域枠）・推薦3枠：数学の換算','前期・後期（一般枠）：理科の換算','後期（秋田県地域枠）・推薦3枠：理科の換算','前期：第1段階選抜','後期（一般枠・秋田県地域枠）：第1段階選抜','面接の詳細（一般選抜：前期・後期）','小論文の評価（推薦3枠共通）','同意書（東北・秋田県地域枠）'])assert.throws(()=>verifyAkitaReadable(html.replace(label,'対象方式なし')));
 for(const term of ['確定後に更新します。','確定後の大学の公表を受けて更新します。','地域医療への貢献意欲等も勘案する。'])assert.throws(()=>verifyAkitaReadable(html.replaceAll(term,'')));
});
test('all original main metadata is replaced from actual canonical scope',()=>{
 const original=raw.find(p=>p.path===data.path),index=new Map([[data.path,data]]),after=applyUniversityAdmissionsFromIndex(original,index);
 const stale={...original,title:'旧情報',displayTitle:'旧情報',categories:['不明'],infoItems:original.infoItems.map(e=>['地域','種別','年度'].includes(e.label)?{...e,value:'要確認'}:e),contentHtml:'<h2>旧情報</h2>'};assert.deepEqual(applyUniversityAdmissionsFromIndex(stale,index),after);assert.deepEqual(applyUniversityAdmissionsFromIndex(after,index),after);
 assert.deepEqual(after.categories,['大学別入試情報','大学別基本情報','国公立医学部','東北']);assert.equal(after.infoItems.find(e=>e.label==='地域').value,'東北');assert.equal(after.infoItems.find(e=>e.label==='種別').value,'入試情報');assert.equal(after.modified,'2026-10-11');assert.equal(verifyAkitaReadable(after.contentHtml).tables,11);
 for(const p of raw.filter(p=>p.path!==data.path))assert.equal(applyUniversityAdmissionsFromIndex(p,index),p);
});
test('the current entrant cohort and campus remain distinct from quotas and mailing address',()=>{
 const post=applyUniversityAdmissionsFromIndex(raw.find(p=>p.path===data.path),new Map([[data.path,data]]));
 for(const [before,after]of [['77人','78人'],['88人','89人'],['71.0%','70.0%'],['約10～20分','約35分'],['010-8543','010-8502']])assert.throws(()=>verifyAkitaReadable(post.contentHtml.replaceAll(before,after)));
 assert.doesNotMatch(post.contentHtml,/前年から推測|転用していません|補完していません|確定値として扱/u);
});
