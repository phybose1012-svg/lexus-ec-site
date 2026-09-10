import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {extractAnalysis} from './import-past-exam-analysis.mjs';
import {buildAnalysis} from './build-past-exam-analyses.mjs';
import {renderProjection} from './build-past-exam-staging-answers.mjs';
import {durationLabelFor} from './past-exam-duration.mjs';
import {loadFigureManifest} from '../src/lib/pastExamFigures.mjs';
import {normalizeInequalitiesDeep} from '../src/lib/mathNotation.mjs';
import {openUpstreamIssues,upstreamIssueText} from './lib/past-exam-upstream-issues.mjs';

const frontend=fileURLToPath(new URL('../',import.meta.url));
const repo=path.dirname(frontend);
const data=path.join(frontend,'src/data');
const sourceRoot=path.resolve(process.argv[2]??'');
if(!process.argv[2]) throw new Error('Provide source repository');
const only=process.argv[3];
const read=f=>JSON.parse(fs.readFileSync(f,'utf8').replace(/^\uFEFF/,''));
const write=(f,v)=>{fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n');};
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const inventory=read(path.join(data,'pastExamBatch/inventory.json')).packages;
const catalog=[];
const seen=new Set();
const ledgerFile=path.join(data,'pastExamBatch/status.json');
const ledger=fs.existsSync(ledgerFile)?read(ledgerFile).packages:[];
const subjectNames={mathematics:'数学',physics:'物理',chemistry:'化学',biology:'生物'};
const durationOverrides=read(path.join(data,'pastExamBatch/duration-overrides.json'));
const packageOverrides=read(path.join(data,'pastExamBatch/package-overrides.json'));
for(const item of inventory) {
  const pieces=item.directory.split('/');
  const university=pieces[2],year=pieces[5],method=pieces[6],stage=pieces[7],subject=pieces[8];
  const id=stage==='second-stage'?`${item.id}-second-stage`:item.id;
  const key=`${university}/${year}/${subject}`;
  const segment=!seen.has(key)?subject:`${subject}-${method}-${stage}`;
  seen.add(key);
  const entry={id,sourcePackageId:item.id,university,year,subject,segment,method,stage,name:item.package?.university_name??({'iwate-medical':'岩手医科大学','nippon-medical':'日本医科大学'}[university]??university),examLabel:item.package?.exam_method_name??({'general':'一般選抜','general-late':'一般選抜後期'}[method]??method)};
  if(packageOverrides[id]?.examLabel)entry.examLabel=packageOverrides[id].examLabel;
  catalog.push(entry);
}
write(path.join(data,'pastExamBatch/catalog.json'),catalog);

function pendingAnalysis(question,reason) {
  return {schemaVersion:'lexus-analysis-page.v1',packageId:question.packageId,route:{...question.route,path:question.route.path.replace(/questions\/$/,'analysis/')},university:question.university.name,year:Number(question.exam.year),subject:question.subject.name,examLabel:question.exam.label,duration:question.exam.duration,format:'確認中',headline:'分析データの確認中',summary:'',requirementsSummary:'',difficultyCounts:[0,0,0,0],examTotal:null,profiles:[],targets:{basis:'provisional_editorial',timeBudgetBasis:'provisional_editorial',totalPoints:0,timeBudgetMinutes:null,profiles:[]},majorQuestions:[],source:{approved:false,project:'shidai-igakubu-gokaku-dokuhon',html:question.source.reference,sha256:''},pendingReason:reason,links:{questions:question.route.path,answers:question.route.path.replace(/questions\/$/,'answers/'),university:question.links.universityLibrary}};
}
for(let index=0;index<inventory.length;index++) {
  const item=inventory[index],entry=catalog[index];
  if(only&&![entry.id,entry.university].includes(only)) continue;
  const file=`${entry.id}.json`;
  const questionFile=path.join(data,'generated/pastExamQuestions',file);
  if(fs.existsSync(path.join(data,'pastExamAnswerSources',file))) {
    console.log(`Preserving authored package ${entry.id}`);continue;
  }
  const dir=path.join(sourceRoot,item.directory);
  const sourceDir=path.join(dir,'source-html/generated/public-candidate/questions');
  const upstreamIssuesPath=path.join(dir,'issues.json');
  const upstreamIssues=fs.existsSync(upstreamIssuesPath)?openUpstreamIssues(read(upstreamIssuesPath)):[];
  const status={id:entry.id,directory:item.directory,state:'in-progress',upstreamOpenIssues:upstreamIssues,issues:[]};
  const record=()=>{const at=ledger.findIndex(s=>s.id===entry.id);if(at>=0)ledger[at]=status;else ledger.push(status);write(ledgerFile,{schemaVersion:'lexus-past-exam-batch-status.v1',packages:ledger});};
  record();
  try {
    const duration=item.package?.time_limit;
    const durationLabel=durationLabelFor(duration,entry.subject,durationOverrides[entry.id]);
    const args=['--source-dir',sourceDir,'--output',questionFile,'--public-root',path.join(frontend,'public'),'--university-id',entry.university,'--university-name',entry.name,'--year',entry.year,'--subject-id',entry.subject,'--subject-name',subjectNames[entry.subject],'--subject-english',entry.subject.toUpperCase(),'--exam-label',entry.examLabel,'--stage-label',entry.stage==='second-stage'?'二次試験':'一次試験','--duration-label',durationLabel,'--source-reference',`${item.directory}/source-html/generated/public-candidate/questions`,'--route-segment',entry.segment,'--library-package-id',entry.id,'--defer-crops','true','--analysis-path',`/past-exam-library/${entry.university}/${entry.year}/${entry.segment}/analysis/`];
    const overrideFile=path.join(data,'pastExamBatch/question-overrides',file);
    const manifestFile=path.join(data,'pastExamFigures',file);
    const figures=fs.existsSync(manifestFile)?loadFigureManifest(manifestFile,path.join(frontend,'public'),entry.id):null;
    if(figures)args.push('--figure-manifest',manifestFile);
    const supplementsFile=path.join(data,'pastExamBatch/question-supplements',file);
    const supplements=fs.existsSync(supplementsFile)?read(supplementsFile):null;
    if(supplements&&(supplements.packageId!==entry.id||!Array.isArray(supplements.operations)))throw new Error('Invalid package-scoped question supplements');
    write(overrideFile,{packageId:item.id,operations:supplements?.operations??[],printNotes:['各設問に記載された解答形式・記号・単位の指定に従ってください。','図版準備中・内容確認中の設問は、確認が完了するまで演習対象外です。']});
    execFileSync(process.execPath,[path.join(repo,'.agents/skills/past-exam-question-importer/scripts/import-question-page.mjs'),...args,'--overrides',overrideFile],{cwd:repo,stdio:'pipe'});
    const q=read(questionFile);
    const imgs=q.document.questions.flatMap(q=>[...q.html.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(m=>m[1]));
    if(imgs.some(src=>!figures?.bySrc.has(src))) throw new Error('Source image survived deferred-figure import: '+imgs.join(', '));
    status.questions='imported';
    status.questionFigures=q.document.questions.reduce((n,q)=>n+(q.html.match(/data-figure-placeholder/g)||[]).length,0);
    if(status.questionFigures)status.issues.push({scope:'questions',kind:'figures-pending',count:status.questionFigures,message:'Question figures require independent reconstruction; dependent questions remain review-only.'});
    const reconstruction=read(path.join(dir,'source-html/reconstruction.json'));
    const editorialPath=path.join(dir,'source-html/editorial-explanations.json');
    try {
      const editorial=read(editorialPath);
      for(const page of editorial.pages) for(const block of page.blocks) if(block.type==='table'&&(!block.headers?.length||block.rows?.some(r=>r.length!==block.headers.length))) status.issues.push({scope:'answers',kind:'table-column-mismatch',message:`${page.source_page_id} / ${block.major_question_id} / ${block.caption}: headers=${block.headers?.length}, rows=${block.rows?.map(r=>r.length).join(',')}. Only this table is withheld.`});
      const snapshot={schemaVersion:'lexus-staging-answer-snapshot.v1',question:q,editorial,assets:reconstruction.assets??[],sourceReference:`${item.directory}/source-html/editorial-explanations.json`,sha256:hash(editorialPath)};
      const output=renderProjection(snapshot);
      write(path.join(data,'pastExamStagingAnswerSources',file),snapshot);
      write(path.join(data,'generated/pastExamAnswers',file),output);
      status.answers='editorial-adaptation-imported';
      status.answerFigures=output.document.majorQuestions.reduce((n,q)=>n+(q.html.match(/data-figure-placeholder/g)||[]).length,0);
      if(status.answerFigures)status.issues.push({scope:'answers',kind:'figures-pending',count:status.answerFigures,message:'Required visual positions retained; no restricted answer crop copied.'});
      status.issues.push({scope:'answers',kind:'editorial-review',message:'Imported learner-oriented adaptation; not independently reauthored or fully mathematically verified in this batch.'});
    } catch(error) {
      status.answers='source-repair-required';status.issues.push({scope:'answers',kind:'source-error',message:error.message});
      const html='<article class="source-page-card major-question-card" id="major-question-01" data-major-question-id="major-question-01"><h2>解答・解説は確認中です</h2><p class="prose">対応する学習者向け解説の元データを確認しています。解答を推測で補わず、確認でき次第反映します。</p></article>';
      write(path.join(data,'generated/pastExamAnswers',file),{schemaVersion:'lexus-past-exam-answer-page.v1',packageId:q.packageId,route:{...q.route,path:q.route.path.replace(/questions\/$/,'answers/')},university:q.university,exam:q.exam,subject:q.subject,document:{role:'answers',pageUnit:'major_question',majorQuestions:[{id:'major-question-01',label:'確認中',order:1,html}]},source:{needsHumanReview:true,contentProvenance:'missing-source'},links:{questions:q.route.path,universityLibrary:q.links.universityLibrary,analysis:q.links.analysis}});
    }
    try {
      const meta=read(path.join(dir,'analysis.json'));
      const derived=read(path.join(dir,'derived.json'));
      const htmlFile=path.join(dir,'preview-html/public-preview/index.html');
      const html=fs.readFileSync(htmlFile,'utf8');
      let evidence;
      try {evidence=extractAnalysis(html,meta,`${item.directory}/preview-html/public-preview/index.html`,derived);}
      catch(error) {
        evidence=extractAnalysis(html,meta,`${item.directory}/preview-html/public-preview/index.html`,derived,{deferTargets:true});
        status.issues.push({scope:'analysis-targets',kind:'source-error',message:error.message});
      }
      if(!evidence.targetAnalysis)status.issues.push({scope:'analysis-targets',kind:'pending',message:'Target section retained but scores withheld until validated source is supplied.'});
      evidence.package={...evidence.package,id:entry.id};
      const majors=meta.major_questions;
      const editorial={packageId:entry.id,routeSegment:entry.segment,durationLabel,format:entry.subject==='mathematics'?'解答形式は問題文を参照':'選択・数値解答など（各設問を参照）',headline:majors[0].topics?.slice(0,2).join('・')||majors[0].title,summary:`${majors.map(m=>`${m.label}は${m.topics?.slice(0,2).join('・')||m.title}`).join('、')}。独立して解ける設問から着手し、後半の条件を読み落とさないようにしましょう。`,requirementsSummary:'保存済み分析に基づく出題内容。',majorQuestions:majors.map(m=>({id:m.id,title:m.title,subtitle:(m.topics??[]).slice(0,3).join('・')||m.title,summary:m.overview||m.title,studyAction:(m.required_abilities??[]).slice(0,2).join('。')||m.overview,subquestions:m.subquestions.map(s=>({id:s.id,title:s.summary,note:s.strategy.reason}))})),profiles:[{id:'weak',title:`${q.subject.name}が苦手なら`,text:'基本レベルでも短時間で答えが出るとは限りません。独立して解ける短い問題を探し、点数を積み上げましょう。前問の結果が必要な設問は、その結果を確保できてから取り組みます。'},{id:'strong',title:`${q.subject.name}が得意なら`,text:'基本レベル・基本＋αレベルの取りこぼしをなくすことを最優先にします。長い計算や条件整理に時間がかかる問題は、残り時間を確認してから着手しましょう。'}],targets:(evidence.targetAnalysis?.profiles??[]).map(p=>({id:p.id,title:`${q.subject.name}が${p.id==='weak'?'苦手':'得意'}なら`,summary:'優先度と前問依存を考慮した得点計画。',focus:'先に解く問題を確保し、残り時間に応じて追加候補へ進みます。時間内に収まらない場合は、下の優先度表で切り替える問題を確認しましょう。'})),editorialNotes:['保存済み分析の難易度・優先度・計算を保持したステージング向け要約。細部の校正は別担当へ。'],...(!evidence.targetAnalysis?{targetReviewStatus:'source-repair-required',targetReviewNote:'元データの目標点・所要時間・前問依存を確認しています。数値は検証完了後に掲載します。'}:{})};
      editorial.examLabel=entry.examLabel;
      const output=buildAnalysis(evidence,editorial);
      write(path.join(data,'pastExamAnalysisEvidence',file),evidence);
      write(path.join(data,'pastExamAnalysisSources',file),normalizeInequalitiesDeep(editorial));
      write(path.join(data,'generated/pastExamAnalyses',file),output);
      status.analysis=evidence.targetAnalysis?'imported':'targets-deferred';
    } catch(error) {
      status.analysis='source-repair-required';status.issues.push({scope:'analysis',kind:'source-error',message:error.message});
      write(path.join(data,'generated/pastExamAnalyses',file),pendingAnalysis(q,'対応する分析HTMLの出題構成・配点・目標点を確認しています。検証できたデータが揃い次第、このページへ反映します。'));
    }
    status.state='staging-review-draft';
  } catch(error) {
    status.state='source-repair-required';status.issues.push({scope:'questions',kind:'import-error',message:String(error.stderr??error.message).slice(0,5000)});
  }
  record();
  const handoff=path.join(repo,'docs/handoffs/past-exam-batch',`${entry.id}.md`);
  fs.mkdirSync(path.dirname(handoff),{recursive:true});
  fs.writeFileSync(handoff,`# ${entry.name} ${entry.year}年度 ${subjectNames[entry.subject]} — 修正担当への依頼\n\n対象元データ: \`C:/---hp/shidai-igakubu-gokaku-dokuhon/${item.directory}\`\n\n## 方針\n\n- 元リポジトリの AGENTS.md と該当過去問スキルを読む。別方式・別段階の同名 package_id と混同しない。\n- reconstruction.json / editorial-explanations.json / analysis.json を正本として修復し、生成HTMLだけを編集しない。\n- 原本の各ページ画像と照合し、全問・全解答欄・TeX・前提条件・依存関係・図表を監査する。以下は自動検査で検出した項目であり、全文の正誤を保証するリストではない。\n- 不明な値や欠けた条件を推測で補完しない。未解決項目は issues.json に残す。\n- 検証不能の目標点を出さず、仮配点・公式試験時間・仮時間配分を区別する。\n- 制限付き図版は複製せず、条件に基づく独自SVGへ置換する。\n- 再生成後に元データvalidator、desktop/mobileでの全ページ表示と数式、印刷を確認する。\n- 変更はこのパッケージに限定。他担当の変更を上書きしない。ステージング掲載許可は2026-09-09のユーザー指示あり。本番公開の承認とは別。\n\n## 検出事項\n\n${status.issues.map(v=>`- **${v.scope} / ${v.kind}**: ${v.message}${v.count?`（${v.count}件）`:''}`).join('\n')}\n\n## 完了報告\n\n修正した正本の位置、原文→修正後、根拠となるページ・計算、再生成したHTML、テスト結果、未解決事項を列挙する。過去問ライブラリーの再取り込み先IDは \`${entry.id}\`。既存の独自解説へ昇格済みのパッケージは一括取込で上書きしない。\n`);
  if(upstreamIssues.length)fs.appendFileSync(handoff,`\n## 元データの未解決項目\n\n元のissues.jsonから取得した編集メモです。完了済みという意味ではありません。\n\n${upstreamIssues.map(i=>`- **${i.id??'source-issue'}**: ${upstreamIssueText(i)}`).join('\n')}\n`);
  console.log(`${entry.id}: ${status.state}; questions=${status.questions??'failed'}, answers=${status.answers??'-'}, analysis=${status.analysis??'-'}`);
}
