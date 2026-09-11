import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {normalizeInequalitiesDeep} from '../src/lib/mathNotation.mjs';
import {inline,escapeHtml} from '../src/lib/pastExamInline.mjs';
import {loadFigureManifest,renderRegisteredFigure} from '../src/lib/pastExamFigures.mjs';
import {applyAnswerSupplement} from './lib/past-exam-answer-supplements.mjs';
import {renderVariationTrend} from '../src/lib/pastExamVariationTrend.mjs';
export {inline,escapeHtml};

const dataRoot=fileURLToPath(new URL('../src/data/',import.meta.url));
const canonical=JSON.parse(fs.readFileSync(path.join(dataRoot,'pastExamFormulaPurposes.json'),'utf8')).purposes;
export function purposeFor(title) {
  const label=String(title).replace(/（学習者向け解説）/g,'').replace(/^(?:第|問|設問)?[0-9０-９ⅠⅡⅢⅣⅤⅥ()（）a-z.．-]+(?:問)?[\s　]+/,'').trim();
  const found=canonical.find(p=>p.label===label);
  return found??{id:`source-goal-${crypto.createHash('sha256').update(label).digest('hex').slice(0,12)}`,label:label||'解法の確認',useWhen:`保存済み学習者向け解説で「${label}」を扱う計算ブロック。取り込み後の目的タグ校正対象。`};
}
export function renderProjection(snapshot, purposes=new Map()) {
  if(snapshot.schemaVersion!=='lexus-staging-answer-snapshot.v1'||snapshot.editorial?.provenance!=='editorial_adaptation') throw new Error('Only separately identified editorial adaptations can be projected');
  const supplementFile=path.join(dataRoot,'pastExamBatch/answer-supplements',`${snapshot.question.packageId}.json`);
  const supplementText=fs.existsSync(supplementFile)?fs.readFileSync(supplementFile,'utf8'):null;
  const supplement=supplementText?JSON.parse(supplementText):null;
  const {question,editorial,assets}=normalizeInequalitiesDeep({...snapshot,editorial:applyAnswerSupplement(snapshot,supplement)});
  const manifestFile=path.join(dataRoot,'pastExamFigures',`${question.packageId}.json`);
  const figures=fs.existsSync(manifestFile)?loadFigureManifest(manifestFile,fileURLToPath(new URL('../public/',import.meta.url)),question.packageId):null;
  if(editorial.package_id!==question.source.sourcePackageId) throw new Error('Source package mismatch');
  const known=new Set(question.document.questions.map(q=>q.id));
  const all=editorial.pages.flatMap(p=>p.blocks);
  for(const block of all) if(!known.has(block.major_question_id)) throw new Error(`Unassigned answer block: ${block.major_question_id}`);
  function render(block,goal) {
    if(block.type==='prose') return `<p class="prose">${inline(block.text)}</p>`;
    if(block.type==='note') return `<aside class="source-note answer-note"><strong>${escapeHtml(block.label)}</strong><p>${inline(block.text)}</p></aside>`;
    if(block.type==='formula') {
      const purpose=purposeFor(goal);purposes.set(purpose.id,purpose);
      return `<div class="formula answer-formula" data-formula-purpose="${purpose.id}"><span class="answer-formula__purpose">${inline(purpose.label)}</span><div class="answer-formula__math" data-katex="${escapeHtml(block.latex)}" data-display-mode="true"></div></div>`;
    }
    if(block.type==='answer_key') return `<section class="answer-key-panel"><h3>解答</h3><dl class="batch-answer-key">${block.items.map(v=>`<div><dt>${inline(v.label)}</dt><dd>${inline(v.value)}</dd></div>`).join('')}</dl></section>`;
    if(block.type==='structured_list') return `<ul class="batch-answer-list">${block.items.map(v=>`<li>${v.label?`<strong>${inline(v.label)}</strong> `:''}${inline(v.text??v.value)}</li>`).join('')}</ul>`;
    if(block.type==='table') {
      if(!block.headers?.length||block.rows?.some(r=>r.length!==block.headers.length)) return `<aside class="source-note" data-blocked-table="true"><strong>表の確認中</strong><p>${inline(block.caption||'この箇所の表')}：元データの列数が一致していないため、確認後に掲載します。</p></aside>`;
      const variation=/増減|凹凸/.test(block.caption??'');
      const noValue='<td class="answer-table__no-value" aria-label="値なし"><svg class="answer-table__diagonal" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false"><line x1="0" y1="0" x2="100" y2="100" vector-effect="non-scaling-stroke"/></svg></td>';
return `<div class="table-scroll answer-table-scroll${variation?' answer-table-scroll--variation':''}" role="region" aria-label="${escapeHtml(block.caption)}" tabindex="0"><table class="source-table answer-table${variation?' answer-table--variation':''}"><caption>${inline(block.caption)}</caption><thead><tr>${block.headers.map(c=>`<th scope="col">${inline(c)}</th>`).join('')}</tr></thead><tbody>${block.rows.map(r=>`<tr>${r.map((c,i)=>i===0?`<th scope="row">${inline(c)}</th>`:/^(未定義|定義されない|\[\[no-value\]\])$/.test(c)?noValue:`<td>${(variation&&renderVariationTrend(c,block.caption))||inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    }
    if(block.type==='crop') {
      const asset=assets.find(a=>a.id===block.asset_id);
      if(!asset) throw new Error(`Unregistered source figure ${block.asset_id}`);
      if(figures?.byId.has(asset.id)) return renderRegisteredFigure(figures,asset.id);
      const alt=asset.alt||'解説に必要な図';
      const box=asset.crop_box_pixels;
      const ratio=box&&box[2]>box[0]&&box[3]>box[1]?(box[2]-box[0])/(box[3]-box[1]):1.6;
      return `<figure class="batch-figure-pending" data-figure-placeholder="true" data-figure-id="${escapeHtml(asset.id)}"><div role="img" aria-label="${escapeHtml(alt)}（図版準備中）" style="aspect-ratio:${Math.max(.8,Math.min(2.5,ratio)).toFixed(3)}"><strong>図版準備中</strong><p>${escapeHtml(alt)}</p></div><figcaption>図の位置・大きさを確保しています。図を使う説明は確認完了までレビュー中です。</figcaption></figure>`;
    }
    throw new Error(`Unsupported editorial block ${block.type}`);
  }
  const majors=question.document.questions.map((q,i)=>{
    const blocks=all.filter(b=>b.major_question_id===q.id);
    if(!blocks.length) throw new Error(`Missing explanations ${q.id}`);
    let goal=`${q.label}の解法`;let sectionOpen=false;
    let html=`<article class="source-page-card major-question-card answer-major-card" id="${q.id}" data-major-question-id="${q.id}"><h2>${escapeHtml(q.label)} 解答・解説</h2><div class="answer-explanation">`;
    for(const block of blocks){
      if(block.type==='heading') {
        if(block.level<=2) {goal=block.text;continue;}
        if(sectionOpen) html+='</section>';
        goal=block.text;
        html+=`<section class="answer-explanation-section"><h3>${inline(block.text)}</h3>`;sectionOpen=true;
      } else html+=render(block,goal);
    }
    html+=(sectionOpen?'</section>':'')+'</div></article>';
    return {id:q.id,label:q.label,order:i+1,html};
  });
  return {schemaVersion:'lexus-past-exam-answer-page.v1',packageId:question.packageId,route:{...question.route,path:question.route.path.replace(/questions\/$/,'answers/')},university:question.university,exam:question.exam,subject:question.subject,document:{role:'answers',pageUnit:'major_question',majorQuestions:majors},source:{contentProvenance:'editorial_adaptation_import',reference:snapshot.sourceReference,sha256:snapshot.sha256,...(supplement?{supplement:{reference:`frontend/src/data/pastExamBatch/answer-supplements/${question.packageId}.json`,sha256:crypto.createHash('sha256').update(supplementText).digest('hex'),contentProvenance:supplement.contentProvenance,needsHumanReview:true}}:{}),needsHumanReview:true,rightsStatus:'review_required',restrictedAssetsCopied:false,independentlyReauthored:false,reviewNote:'保存済み学習者向け解説のステージング取り込み版。数式・論理・図版の詳細校正前。'},links:{questions:question.route.path,universityLibrary:question.links.universityLibrary,analysis:question.links.analysis}};
}
export function buildAll() {
  const dir=path.join(dataRoot,'pastExamStagingAnswerSources');
  if(!fs.existsSync(dir)) return;
  const purposes=new Map();
  for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.json')).sort()) {
    const source=JSON.parse(fs.readFileSync(path.join(dir,file),'utf8'));
    if(fs.existsSync(path.join(dataRoot,'pastExamAnswerSources',file))) throw new Error(`Refusing to overwrite authored answers ${file}`);
    const output=renderProjection(source,purposes);
    fs.writeFileSync(path.join(dataRoot,'generated/pastExamAnswers',file),JSON.stringify(output,null,2)+'\n');
    console.log(`Projected staging answers: ${output.packageId}`);
  }
  fs.writeFileSync(path.join(dataRoot,'pastExamBatch/formula-purposes.json'),JSON.stringify({schemaVersion:'lexus-formula-purposes.v1',status:'imported-purpose-labels-require-editorial-review',purposes:[...purposes.values()].sort((a,b)=>a.id.localeCompare(b.id))},null,2)+'\n');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) buildAll();
