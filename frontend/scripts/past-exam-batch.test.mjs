import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {inline,renderProjection} from './build-past-exam-staging-answers.mjs';
import {buildAnalysis} from './build-past-exam-analyses.mjs';
import {durationLabelFor} from './past-exam-duration.mjs';
const root=fileURLToPath(new URL('../src/data/',import.meta.url));
const read=name=>JSON.parse(fs.readFileSync(root+name,'utf8'));
const pages=folder=>fs.readdirSync(root+folder).filter(f=>f.endsWith('.json')).map(f=>read(folder+'/'+f));
test('Science selection time is not labelled as three compulsory subjects',()=>{
 assert.equal(durationLabelFor({kind:'combined_subjects',minutes:120,subject_ids:['physics','chemistry','biology'],note:'2科目を選択'},'physics'),'理科2科目 合計120分');
 assert.equal(durationLabelFor({kind:'combined_subjects',minutes:140,subject_ids:['english','mathematics'],note:'2科目を等分した仮時間'},'mathematics'),'英語・数学 合計140分');
 assert.equal(durationLabelFor({kind:'subject_only',minutes:60,subject_ids:['physics'],note:''},'physics'),'物理 60分');
});
test('Every inventoried package has three distinct document routes',()=>{
 const catalog=read('pastExamBatch/catalog.json');
 for(const role of ['Questions','Answers','Analyses']){
  const all=pages('generated/pastExam'+role);const ids=new Set(all.map(p=>p.packageId));
  assert.equal(new Set(all.map(p=>p.route.path)).size,all.length,'duplicate URL');
  for(const item of catalog)assert.ok(ids.has(item.id),`${role}: ${item.id}`);
 }
});
test('Existing independently authored answer files have no competing projection',()=>{
 const original=pages('pastExamAnswerSources');
 const staged=pages('pastExamStagingAnswerSources');
 assert.ok(original.every(o=>!staged.some(s=>s.question.packageId===o.packageId)));
});
test('Projected explanations are explicit about provenance and carry no source images',()=>{
 for(const source of pages('pastExamStagingAnswerSources')){
  const result=renderProjection(source);
  assert.equal(result.source.contentProvenance,'editorial_adaptation_import');
  assert.equal(result.source.independentlyReauthored,false);
  assert.equal(result.source.restrictedAssetsCopied,false);
  assert.equal(result.document.majorQuestions.length,source.question.document.questions.length);
  assert.doesNotMatch(result.document.majorQuestions.map(m=>m.html).join(''),/<img\b|<script\b|onerror=|javascript:/);
 }
});
test('Inline text is escaped and TeX remains an empty rendering target',()=>{
 assert.equal(inline('<b>x</b>'),'&lt;b&gt;x&lt;/b&gt;');
 assert.match(inline(String.raw`\(\frac12\)`),/data-katex="\\frac12"[^>]*><\/span>/);
});
test('Malformed tables cannot silently lose or misalign cells',()=>{
 const source=structuredClone(pages('pastExamStagingAnswerSources')[0]);
 source.editorial.pages[0].blocks.push({type:'table',headers:['x','1'],rows:[['f']],major_question_id:source.question.document.questions[0].id});
 assert.match(renderProjection(source).document.majorQuestions[0].html,/data-blocked-table="true"/);
});
test('Deferred target data requires an explicit source-repair marker',()=>{
 const evidence=read('pastExamAnalysisEvidence/aichi-medical-2025-general-physics.json');
 const editorial=read('pastExamAnalysisSources/aichi-medical-2025-general-physics.json');
 assert.equal(evidence.targetAnalysis,null);
 assert.equal(buildAnalysis(evidence,editorial).targets.profiles.length,0);
 delete editorial.targetReviewStatus;
 assert.throws(()=>buildAnalysis(evidence,editorial),/Missing or unsupported target/);
});
test('Question, answer and analysis navigation stays inside the same exam variant',()=>{
 for(const q of pages('generated/pastExamQuestions')){
  const a=read('generated/pastExamAnswers/'+q.packageId+'.json');
  const analysis=read('generated/pastExamAnalyses/'+q.packageId+'.json');
  assert.equal(a.links.questions,q.route.path);
  assert.equal(analysis.links.questions,q.route.path);
  assert.equal(analysis.links.answers,a.route.path);
  assert.equal(a.route.path,q.route.path.replace(/questions\/$/,'answers/'));
 }
});
