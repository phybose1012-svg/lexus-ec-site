import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { extractAnalysis } from './import-past-exam-analysis.mjs';
const root = process.argv[2];
if (!root) throw new Error('Provide source repository');
const read = f => JSON.parse(fs.readFileSync(f, 'utf8').replace(/^\uFEFF/, ''));
const files = execFileSync('rg', ['--files', 'projects/universities', '-g', 'question-reader.json'], {cwd:root, encoding:'utf8'}).trim().split(/\r?\n/).sort();
const result=[];
for (const file of files) {
  const dir = path.dirname(path.dirname(file));
  const reader = read(path.join(root,file));
  const record = {id:reader.package_id, directory:dir.replaceAll('\\','/'), majors:reader.reader_structure.major_questions.length, errors:[]};
  try {
    const meta=read(path.join(root,dir,'analysis.json'));
    record.package=meta.package;
    record.questions=meta.major_questions.flatMap(m=>m.subquestions).length;
    const html=fs.readFileSync(path.join(root,dir,'preview-html/public-preview/index.html'),'utf8');
    const derived=read(path.join(root,dir,'derived.json'));
    const evidence=extractAnalysis(html,meta,`${dir}/preview-html/public-preview/index.html`,derived);
    record.analysis=evidence.targetAnalysis?'ready':'missing-targets';
  } catch (e) {record.errors.push(`analysis: ${e.message}`);}
  try {
    const edit=read(path.join(root,dir,'source-html/editorial-explanations.json'));
    record.answers=edit.provenance;
    record.answerMajors=[...new Set(edit.pages.flatMap(p=>p.blocks).map(b=>b.major_question_id))];
  } catch(e) {record.errors.push('answers: editorial-explanations.json missing or invalid');}
  const reconstruction=read(path.join(root,dir,'source-html/reconstruction.json'));
  record.assets=(reconstruction.assets??[]).map(a=>({id:a.id,rights:a.rights_status,status:a.replacement_status}));
  result.push(record);
}
const report = {schemaVersion:'lexus-past-exam-batch-audit.v1', sourceRepository:'shidai-igakubu-gokaku-dokuhon', packages:result};
fs.mkdirSync('src/data/pastExamBatch',{recursive:true});
fs.writeFileSync('src/data/pastExamBatch/inventory.json',JSON.stringify(report,null,2)+'\n');
for (const r of result) console.log(`${r.id}: ${r.majors} sections / ${r.questions??'?'} questions / ${r.analysis??'failed'} ${r.errors.join(' | ')}`);
console.log(`${result.length} packages; ${result.filter(r=>r.errors.length).length} with source/adapter issues`);
