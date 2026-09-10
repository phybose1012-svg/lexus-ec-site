import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { describeTargetReplacement } from '../src/lib/pastExamTargetRoute.mjs';
import { buildAnalysis } from './build-past-exam-analyses.mjs';

test('replacement wording distinguishes removals, additions and actual swaps', () => {
  const old = [{label:'問1'}, {label:'問2'}], added = [{label:'問3'}];
  assert.equal(describeTargetReplacement(old, added), '問1・問2を外し、問3を追加');
  assert.equal(describeTargetReplacement(old, []), '問1・問2を外す');
  assert.equal(describeTargetReplacement([], added), '問3を追加');
  assert.equal(describeTargetReplacement(), '選択する問題を変更');
});

test('Kindai removal-only target route retains the verified selection and has no empty destination', () => {
  const id='kindai-2025-general-first-a-mathematics';
  const read=dir=>JSON.parse(fs.readFileSync(new URL(`../src/data/${dir}/${id}.json`,import.meta.url),'utf8'));
  const page=buildAnalysis(read('pastExamAnalysisEvidence'),read('pastExamAnalysisSources'));
  const weak=page.targets.profiles.find(p=>p.id==='weak');
  assert.equal(weak.routeKind,'replacement');
  assert.equal(weak.additional.length,0);
  assert.equal(weak.replaced.length,3);
  assert.equal(weak.route.points,48);
  assert.equal(weak.route.minutes,59.9);
  assert.match(describeTargetReplacement(weak.replaced,weak.additional),/を外す$/);
  const template=fs.readFileSync(new URL('../src/pages/past-exam-library/[university]/[year]/[subject]/analysis.astro',import.meta.url),'utf8');
  assert.match(template,/describeTargetReplacement\(profile\.replaced, profile\.additional\)/);
});
