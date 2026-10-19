import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {renderUniversityAdmissions} from '../src/lib/universityAdmissions.ts';
const candidate=JSON.parse(fs.readFileSync(new URL('../src/data/universityAdmissions/kyoto.json',import.meta.url)));
test('Kyoto keeps route-specific test and qualification exceptions visible',()=>{
 const h=renderUniversityAdmissions(candidate);
 for(const text of ['700点以上','約3倍','1275点','資格1・5','資格2・3・4','共通テストは受験できず','Home Edition','オンライン出力した控えは使えません','2025年度以前','既納入学料は返還しません','本人以外','必着'])assert.ok(h.includes(text),text);
 const origins=[...h.matchAll(/data-admission-origins="([^"]+)"/g)].flatMap(m=>m[1].split(' '));
 const expected=candidate.schemes.reduce((n,s)=>n+s.scheduleRows.length+s.examRows.length+s.venueRows.length+s.notes.length,0)+candidate.basicInfoRows.length+candidate.coverageNotes.length;
 assert.equal(origins.length,expected);assert.equal(new Set(origins).size,expected);
 const tables=[...h.matchAll(/<table\b[^>]*>[\s\S]*?<\/table>/g)].map(m=>m[0]);
 tables.forEach(t=>assert.doesNotMatch(t,/https?:|data-admission-source-id=/));
 const visible=new Set([...h.matchAll(/data-admission-source-id="([^"]+)"/g)].map(m=>m[1]));
 candidate.sources.forEach(s=>assert.ok(visible.has(s.id),s.id));
});
test('Kyoto statistics identify the selection population and total',()=>{
 const h=renderUniversityAdmissions(candidate);
 assert.ok(h.includes('一般前期・105人'));assert.ok(h.includes('特色入試入学者は含みません'));
 for(const value of ['83人','22人','68人','37人','79.0％','21.0％','64.8％','35.2％'])assert.ok(h.includes(value),value);
 assert.doesNotMatch(h,/医学科入学者109人|医学科入学者108人|2024年度/);
});
test('Kyoto refuses accidental reassignment of route identities',()=>{
 const d=structuredClone(candidate);d.schemes.reverse();assert.throws(()=>renderUniversityAdmissions(d),/two reviewed medicine routes/);
});
test('Kyoto retains application limits and both deadline contact exceptions',()=>{
 const s=candidate.schemes.find(s=>s.id==='special-recommendation'),h=renderUniversityAdmissions(candidate);
 const enrollment=h.slice(h.indexOf('id="admission-special-enrollment"'),h.indexOf('id="admission-fees"'));
 for(const t of [s.notes[1].text,enrollment]){
  assert.match(t,/共通テストを課す場合・課さない場合を含め/);
  assert.match(t,/1大学・学部に限/);
  assert.match(t,/独自日程で入学者選抜を行う公立大学・学部/);
  assert.match(t,/前期1大学・学部、後期1大学・学部の計2つ/);
  assert.match(t,/入学辞退許可|辞退が許可/);
 }
 for(const t of [s.scheduleRows[8].value,h]){
  assert.match(t,/特別な事情により期限までに提出できない場合は、医学科教務担当へ連絡/);
  assert.match(t,/未提出の場合は受験者としての権利を失/);
  assert.match(t,/資格2・4はIBスコア、資格3は飛び級/);
  assert.match(t,/提出日は受験上の諸注意で指定され、具体的な日付は未公表/);
 }
 for(const t of [s.scheduleRows[9].value,enrollment]){
  assert.match(t,/2027年2月17日（水）17時必着/);
  assert.match(t,/簡易書留速達/);
  assert.match(t,/同じ締切日時までに医学科教務担当へ連絡し、指示に従/);
 }
});
